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
  getStaticData: () => ipcInvoke('getStaticData'),
} satisfies Window['electron'])

function ipcInvoke<Key extends keyof EventPayloadMapping>(key: Key): Promise<EventPayloadMapping[Key]> { 
  return electron.ipcRenderer.invoke(key)
}

function ipcOn<Key extends keyof EventPayloadMapping>(key: Key, callback: (payload: EventPayloadMapping[Key]) => void) { 
  electron.ipcRenderer.on(key, (_, payload) => callback(payload))
}