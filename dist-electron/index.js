"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const electron = require("electron");
const path = require("path");
const child_process = require("child_process");
var EncodeProtocolEnum = /* @__PURE__ */ ((EncodeProtocolEnum2) => {
  EncodeProtocolEnum2["RTMP"] = "RTMP";
  EncodeProtocolEnum2["WEBRTC"] = "WEBRTC";
  EncodeProtocolEnum2["SRT"] = "SRT";
  return EncodeProtocolEnum2;
})(EncodeProtocolEnum || {});
let mainWindow = null;
const childProcessMap = /* @__PURE__ */ new Map();
const commandIPCListen = (mainW) => {
  mainWindow = mainW;
  electron.ipcMain.on("ffmpegCommandExec", (event, arg) => {
    console.log(arg);
    child_process.exec(arg, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  });
  electron.ipcMain.on("ffmpegCommandSpawn", (event, arg) => {
    const { command, args } = JSON.parse(arg);
    console.log(command, args);
    const ChildProcess = child_process.spawn(command, args, {
      windowsVerbatimArguments: true
    });
    setTimeout(() => {
      console.log("Closing ffmpeg process...");
      ChildProcess.kill("SIGINT");
    }, 3e4);
    if (ChildProcess.pid)
      childProcessMap.set(ChildProcess.pid, ChildProcess);
    console.log("ChildProcess pid", ChildProcess.pid);
  });
  electron.ipcMain.on("main-ffmpeg-protocols", (event, arg) => {
    child_process.exec(arg, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      const inputProtocolsRegex = /Input:\r?\n((?:\s{2}\w+\r?\n)+)/;
      const inputProtocolsMatch = stdout.match(inputProtocolsRegex);
      if (inputProtocolsMatch && inputProtocolsMatch[1]) {
        const inputProtocols = inputProtocolsMatch[1].trim().split("\n").map((protocol) => protocol.trim());
        const supports = [EncodeProtocolEnum.RTMP, EncodeProtocolEnum.SRT, EncodeProtocolEnum.WEBRTC];
        let finalProtocols = inputProtocols.filter((protocol) => supports.includes(protocol.toUpperCase()));
        finalProtocols = finalProtocols.map((protocol) => protocol.toUpperCase());
        mainWindow == null ? void 0 : mainWindow.webContents.send("main-ffmpeg-protocols-response", JSON.stringify(finalProtocols));
      }
    });
  });
  electron.ipcMain.on("main-desktop-stream", (event, arg) => {
    console.log("main-desktop-stream", arg);
    electron.desktopCapturer.getSources({ types: ["window", "screen"] }).then(async (sources) => {
      for (const source of sources) {
        console.log("sources", source.name, source.name.includes("Electron"), source.name.includes("整个屏幕"));
        if (source.name.includes("整个屏幕") || source.name.includes("Electron")) {
          mainWindow == null ? void 0 : mainWindow.webContents.send("main-desktop-stream-response", source.id);
          console.log(source.id);
          return;
        }
      }
    });
  });
};
const windowsCfg = {
  id: null,
  //唯一id
  title: "",
  //窗口标题
  width: null,
  //宽度
  height: null,
  //高度
  minWidth: null,
  //最小宽度
  minHeight: null,
  //最小高度
  route: "",
  // 页面路由URL '/manage?id=123'
  resizable: true,
  //是否支持调整窗口大小
  maximize: false,
  //是否最大化
  backgroundColor: "#eee",
  //窗口背景色
  data: null,
  //数据
  isMultiWindow: false,
  //是否支持多开窗口 (如果为false，当窗体存在，再次创建不会新建一个窗体 只focus显示即可，，如果为true，即使窗体存在，也可以新建一个)
  isMainWin: false,
  //是否主窗口(当为true时会替代当前主窗口)
  parentId: null,
  //父窗口id  创建父子窗口 -- 子窗口永远显示在父窗口顶部 【父窗口可以操作】
  modal: false
  //模态窗口 -- 模态窗口是禁用父窗口的子窗口，创建模态窗口必须设置 parent 和 modal 选项 【父窗口不能操作】
};
class Window {
  constructor() {
    __publicField(this, "main");
    __publicField(this, "group");
    __publicField(this, "tray");
    this.main = null;
    this.group = {};
    this.tray = null;
  }
  // 窗口配置
  winOpts(wh = []) {
    return {
      width: wh[0],
      height: wh[1],
      backgroundColor: "#f7f8fc",
      autoHideMenuBar: false,
      resizable: true,
      minimizable: true,
      maximizable: true,
      frame: true,
      show: false,
      minWidth: 0,
      minHeight: 0,
      modal: true,
      webPreferences: {
        contextIsolation: false,
        //上下文隔离
        nodeIntegration: true,
        //启用Node集成（是否完整的支持 node）
        webSecurity: false,
        preload: path.join(__dirname, "../electron-preload/index.js")
      }
    };
  }
  // 获取窗口
  getWindow(id) {
    return electron.BrowserWindow.fromId(id);
  }
  // 创建窗口
  createWindows(options) {
    console.log("------------creating window...");
    let args = Object.assign({}, windowsCfg, options);
    for (let i in this.group) {
      if (this.getWindow(Number(i)) && this.group[i].route === args.route && !this.group[i].isMultiWindow) {
        this.getWindow(Number(i)).focus();
        return;
      }
    }
    let opt = this.winOpts([args.width || 1920, args.height || 880]);
    if (args.parentId) {
      opt.parent = this.getWindow(args.parentId);
    } else if (this.main) {
      console.log(666);
    }
    opt.modal = args.modal;
    opt.resizable = args.resizable;
    if (args.backgroundColor)
      opt.backgroundColor = args.backgroundColor;
    if (args.minWidth)
      opt.minWidth = args.minWidth;
    if (args.minHeight)
      opt.minHeight = args.minHeight;
    let win = new electron.BrowserWindow(opt);
    console.log("window id: " + win.id);
    this.group[win.id] = {
      route: args.route,
      isMultiWindow: args.isMultiWindow
    };
    console.log("this.group", this.group);
    if (args.maximize && args.resizable) {
      win.maximize();
    }
    if (args.isMainWin) {
      if (this.main) {
        delete this.group[this.main.id];
        this.main.close();
      }
      this.main = win;
    }
    args.id = win.id;
    win.on("close", () => win.setOpacity(0));
    let winURL;
    if (electron.app.isPackaged) {
      winURL = args.route ? path.join(__dirname, `../../dist/index.html${args.route}`) : path.join(__dirname, `../../dist/index.html`);
    } else {
      winURL = args.route ? `${process.env["VITE_DEV_SERVER_URL"]}${args.route}?winId=${args.id}` : `${process.env["VITE_DEV_SERVER_URL"]}?winId=${args.id}`;
    }
    console.log("new window url:", winURL);
    console.log("env", process.env.NODE_ENV);
    if (process.env.NODE_ENV === "production") {
      win.loadURL(path.join(__dirname, "../dist/index.html"));
    } else {
      win.loadURL(winURL);
    }
    win.once("ready-to-show", () => {
      win.show();
    });
  }
  // 创建托盘
  createTray() {
    const contextMenu = electron.Menu.buildFromTemplate([
      {
        label: "注销",
        click: () => {
        }
      },
      {
        type: "separator"
        // 分割线
      },
      // 菜单项
      {
        label: "退出",
        role: "quit"
        // 使用内置的菜单行为，就不需要再指定click事件
      }
    ]);
    this.tray = new electron.Tray(path.join(__dirname, "../favicon.ico"));
    this.tray.on("click", () => {
      for (let i in this.group) {
        if (this.group[i])
          this.getWindow(Number(i)).show();
      }
    });
    this.tray.on("right-click", () => {
      var _a;
      (_a = this.tray) == null ? void 0 : _a.popUpContextMenu(contextMenu);
    });
    this.tray.setToolTip("小猪课堂");
  }
  // 开启监听
  listen() {
    electron.ipcMain.on("pinUp", (event, winId) => {
      event.preventDefault();
      if (winId && this.main.id == winId) {
        let win = this.getWindow(Number(this.main.id));
        if (win.isAlwaysOnTop()) {
          win.setAlwaysOnTop(false);
        } else {
          win.setAlwaysOnTop(true);
        }
      }
    });
    electron.ipcMain.on("window-hide", (event, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).hide();
      } else {
        for (let i in this.group) {
          if (this.group[i])
            this.getWindow(Number(i)).hide();
        }
      }
    });
    electron.ipcMain.on("window-show", (event, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).show();
      } else {
        for (let i in this.group) {
          if (this.group[i])
            this.getWindow(Number(i)).show();
        }
      }
    });
    electron.ipcMain.on("mini", (event, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).minimize();
      } else {
        for (let i in this.group) {
          if (this.group[i]) {
            this.getWindow(Number(i)).minimize();
          }
        }
      }
    });
    electron.ipcMain.on("window-max", (event, winId) => {
      if (winId) {
        this.getWindow(Number(winId)).maximize();
      } else {
        for (let i in this.group)
          if (this.group[i])
            this.getWindow(Number(i)).maximize();
      }
    });
    electron.ipcMain.on("window-new", (event, args) => this.createWindows(args));
    if (this.main) {
      commandIPCListen(this.main);
    } else {
      console.log("main window not exists");
    }
  }
}
const isDevelopment = process.env.NODE_ENV !== "production";
async function createWindow() {
  let window = new Window();
  window.createWindows({ isMainWin: true });
  window.listen();
  window.createTray();
}
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0)
    createWindow();
});
electron.app.on("ready", async () => {
  createWindow();
});
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        console.log("graceful-exit");
        electron.app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      electron.app.quit();
    });
  }
}
