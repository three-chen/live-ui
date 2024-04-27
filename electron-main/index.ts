// electron-main/index.ts
// import type { ExecException } from 'child_process'
// import { exec } from 'child_process'
import { app, BrowserWindow } from 'electron'
import { Window } from './window'
const isDevelopment: boolean = process.env.NODE_ENV !== 'production'

// const child = exec(
//   'ffmpeg -f dshow -i video="HP Wide Vision HD Camera":audio="麦克风阵列 (英特尔® 智音技术)" -c:v libx264 -preset veryfast -maxrate 3000k -bufsize 6000k -pix_fmt yuv420p -g 50 -r 30 -s 640x480 -c:a aac -b:a 160k -ac 2 -ar 44100 -f flv rtmp://localhost/live/livestream',
//   (error: ExecException | null, stdout: string, stderr: string) => {
//     console.log('error', error)
//     console.log('stdout', stdout)
//     console.log('stderr', stderr)
//   }
// )

// setTimeout(() => {
//   console.log('kill')
//   child.kill()
// }, 10000)

// 创建主窗口
async function createWindow() {
  let window = new Window()
  window.listen()
  window.createWindows({ isMainWin: true })
  window.createTray()
}
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        console.log('graceful-exit')
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
