import { app, BrowserWindow } from 'electron'
import { ipcMainHandle, isDev } from './utils.js'
import { getStaticData, pollResource } from './resourceManager.js'
import { getPreloadPath, getUIPath } from './pathResolver.js'

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
    mainWindow.loadFile(getUIPath())
  }

  // ui 资源渲染后进行函数轮询
  pollResource(mainWindow)
  // on 采用 UDP 协议, 不期待响应
  // ipcMain.handle('getStaticData', () => { 
    // return getStaticData()
  // })
  
  // 广义 ipc handle 挂载映射方案, 类型完全安全
  ipcMainHandle('getStaticData', getStaticData)
})