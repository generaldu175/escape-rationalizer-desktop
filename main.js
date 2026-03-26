const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // 允许网页直接运行你的脚本
      webSecurity: false      // ⭐ 关键：允许跨域请求，不再拦截 API
    }
  })
  
  // 这一行可以让你在打开程序时，右边自动弹出调试窗口（像浏览器按 F12 那样）
  // 调试好了之后可以把下面这一行删掉
  // win.webContents.openDevTools()

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

// 兼容 Mac 的退出逻辑
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
