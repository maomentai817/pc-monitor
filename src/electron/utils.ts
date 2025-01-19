import { ipcMain, WebContents, WebFrameMain } from 'electron'
import { getUIPath } from './pathResolver.js'
import { pathToFileURL } from 'url'

export const isDev = (): boolean => process.env.NODE_ENV === 'development'

// 广义映射 ipc handle 方案
export function ipcMainHandle<Key extends keyof EventPayloadMapping>(key: Key, handler: () => EventPayloadMapping[Key]) { 
  return ipcMain.handle(key, (event) => { 
    validateEventFrame(event.senderFrame as WebFrameMain)
    return handler()
  })
}

export function ipcMainOn<Key extends keyof EventPayloadMapping>(key: Key, handler: (payload: EventPayloadMapping[Key]) => void) { 
  ipcMain.on(key, (event, payload) => { 
    validateEventFrame(event.senderFrame as WebFrameMain)
    return handler(payload)
  })
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(key: Key, webContents: WebContents, preload: EventPayloadMapping[Key]) { 
  webContents.send(key, preload)
}

export function validateEventFrame(frame: WebFrameMain) { 
  if (isDev() && new URL(frame.url).host === 'localhost:5123') return
  if (frame.url !== pathToFileURL(getUIPath()).toString()) { 
    throw new Error('Malicious event')
  }
}