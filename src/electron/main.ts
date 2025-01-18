import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { isDev } from './utils.js'
import { getStaticData, pollResource } from './resourceManager.js'
import { getPreloadPath } from './pathResolver.js'

app.on('ready', () =>
{
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  })

  // 开发模式
  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123')
  } else { 
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'))
  }

  // ui 资源渲染后进行函数轮询
  pollResource(mainWindow)
  // on 采用 UDP 协议, 不期待响应
  ipcMain.handle('getStaticData', () => { 
    return getStaticData()
  })
})