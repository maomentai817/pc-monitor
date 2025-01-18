import path from 'path'
import { isDev } from './utils.js'
import { app } from 'electron'

export const getPreloadPath = () => { 
  return path.join(
    app.getAppPath(),
    isDev() ? '.' : '..',
    '/dist-electron/preload.cjs',
  )
}

export const getUIPath = () => { 
  return path.join(app.getAppPath(), '/dist-react/index.html')
}