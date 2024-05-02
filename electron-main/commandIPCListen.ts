import { ChildProcessWithoutNullStreams, exec, spawn } from 'child_process'
import { desktopCapturer, ipcMain } from 'electron'
import { EncodeProtocolEnum } from './types'

let mainWindow: Electron.BrowserWindow | null = null

const childProcessMap: Map<number, ChildProcessWithoutNullStreams> = new Map()

// 监听命令
export const commandIPCListen = (mainW: Electron.BrowserWindow) => {
  mainWindow = mainW
  // 用于非阻塞的命令行
  ipcMain.on('ffmpegCommandExec', (event, arg) => {
    console.log(arg) // 输出 "ping"
    const ChildProcess = exec(arg, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
    })
  })

  // 目前用于 ffmpeg 推流
  ipcMain.on('ffmpegCommandSpawn', (event, arg) => {
    const { command, args } = JSON.parse(arg)
    console.log(command, args) // 输出 "ping"
    const ChildProcess = spawn(command, args, {
      windowsVerbatimArguments: true
    })
    setTimeout(() => {
      console.log('Closing ffmpeg process...')
      ChildProcess.kill('SIGINT') // 发送 SIGINT 信号以关闭进程
    }, 30000)
    if (ChildProcess.pid) childProcessMap.set(ChildProcess.pid, ChildProcess)
    console.log('ChildProcess pid', ChildProcess.pid)
  })

  // 查询 ffmpeg支持的编码协议
  ipcMain.on('main-ffmpeg-protocols', (event, arg) => {
    // console.log('main-ffmpeg-protocols', arg) // 输出 "ping"
    const ChildProcess = exec(arg, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      // console.log('stdout:', stdout)
      const inputProtocolsRegex = /Input:\r?\n((?:\s{2}\w+\r?\n)+)/
      const inputProtocolsMatch = stdout.match(inputProtocolsRegex)

      if (inputProtocolsMatch && inputProtocolsMatch[1]) {
        const inputProtocols = inputProtocolsMatch[1]
          .trim()
          .split('\n')
          .map(protocol => protocol.trim())
        const supports: (keyof typeof EncodeProtocolEnum)[] = [EncodeProtocolEnum.RTMP, EncodeProtocolEnum.SRT, EncodeProtocolEnum.WEBRTC]
        let finalProtocols = inputProtocols.filter(protocol => supports.includes(protocol.toUpperCase() as keyof typeof EncodeProtocolEnum))
        finalProtocols = finalProtocols.map(protocol => protocol.toUpperCase())
        mainWindow?.webContents.send('main-ffmpeg-protocols-response', JSON.stringify(finalProtocols))
      }
    })
    // console.log('ChildProcess', ChildProcess)
  })

  // 获取桌面流，用于webrtc推流
  ipcMain.on('main-desktop-stream', (event, arg) => {
    console.log('main-desktop-stream', arg) // 输出 "ping"
    desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async (sources: any) => {
      for (const source of sources) {
        console.log('sources', source.name, (source.name as string).includes('Electron'), (source.name as string).includes('整个屏幕'))
        if ((source.name as string).includes('整个屏幕') || (source.name as string).includes('Electron')) {
          mainWindow?.webContents.send('main-desktop-stream-response', source.id)
          console.log(source.id)
          return
        }
      }
    })
  })
}
