const electron = require('electron')

electron.contextBridge.exposeInMainWorld('electron', {
  // subscribeStatistics: (callback: (statistics: any) => void) => {
  //   electron.ipcRenderer.on('statistics', (_, stats) => {
  //     callback(stats)
  //   })
  // },
  // getStaticData: () => electron.ipcRenderer.invoke('getStaticData'),
  
  // ipc 映射方案
  subscribeStatistics: (callback) => ipcOn('statistics', (stats) => callback(stats)),
  subscribeChangeView: (callback) => ipcOn('changeView', (view) => callback(view)),
  getStaticData: () => ipcInvoke('getStaticData'),
  sendFrameAction: (payload) => ipcSend('sendFrameAction', payload)
} satisfies Window['electron'])

function ipcInvoke<Key extends keyof EventPayloadMapping>(key: Key): Promise<EventPayloadMapping[Key]> { 
  return electron.ipcRenderer.invoke(key)
}

function ipcOn<Key extends keyof EventPayloadMapping>(key: Key, callback: (payload: EventPayloadMapping[Key]) => void) { 
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload)
  electron.ipcRenderer.on(key, cb)
  // 取消订阅该消息
  return () => electron.ipcRenderer.off(key, cb)
}

function ipcSend<Key extends keyof EventPayloadMapping>(key: Key, payload: EventPayloadMapping[Key]) { 
  electron.ipcRenderer.send(key, payload)
}