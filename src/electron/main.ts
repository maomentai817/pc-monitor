import { app, BrowserWindow } from 'electron'
import { ipcMainHandle, isDev } from './utils.js'
import { getStaticData, pollResource } from './resourceManager.js'
import { getPreloadPath, getUIPath } from './pathResolver.js'
import { createTray } from './tray.js'
import { createMenu, hideMenu } from './menu.js'

// 在构建前将 app-menu 置空
if (process.platform !== 'darwin')  hideMenu()

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

  // 挂载托盘图标
  createTray(mainWindow)
  // 应用关闭前, 托盘隐藏
  handleCloseEvents(mainWindow)
  // 菜单
  if (process.platform === 'darwin')
    createMenu(mainWindow)
})

function handleCloseEvents(mainWindow: BrowserWindow) { 
  let willClose = false
  
  mainWindow.on('close', e => { 
    if (willClose) { 
      return
    }
    e.preventDefault()
    // 阻止默认关闭事件, 仅对窗口做隐藏
    mainWindow.hide()
    // macos
    if (app.dock) { 
      app.dock.hide()
    }
  })

  // before-quit
  app.on('before-quit', () => { 
    willClose = true
  })
  // 点击托盘图标显示窗口时, 重置
  mainWindow.on('show', () => { 
    willClose = false
  })
}