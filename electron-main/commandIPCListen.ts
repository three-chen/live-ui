import { exec, spawn } from 'child_process'
import { ipcMain } from 'electron'

export const commandIPCListen = () => {
  // 监听命令
  ipcMain.on('ffmpegCommandExec', (event, arg) => {
    console.log(arg) // 输出 "ping"
    const ChildProcess = exec(arg) // 设置定时器，在30秒后执行关闭流的操作
    setTimeout(() => {
      console.log('Closing ffmpeg process...')
      ChildProcess.kill('SIGINT') // 发送 SIGINT 信号以关闭进程
    }, 30000)
    console.log('ChildProcess', ChildProcess)
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
    console.log('ChildProcess', ChildProcess)
  })
}
