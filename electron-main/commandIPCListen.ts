import { exec, spawn } from 'child_process'
import { ipcMain } from 'electron'
import { EncodeProtocolEnum } from './types'

let mainWindow: Electron.BrowserWindow | null = null

export const commandIPCListen = (mainW: Electron.BrowserWindow) => {
  mainWindow = mainW
  // 监听命令
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
    // console.log('ChildProcess', ChildProcess)
  })

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
    // console.log('ChildProcess', ChildProcess)
  })

  ipcMain.on('main-ffmpeg-protocols', (event, arg) => {
    // console.log('main-ffmpeg-protocols', arg) // 输出 "ping"
    const ChildProcess = exec(arg, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`)
        return
      }
      console.log('stdout:', stdout)
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
}
