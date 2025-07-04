import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { PROGRAMMING_LANGS } from '../main/consts/langs'
import events from '../main/consts/events'

export const langs = PROGRAMMING_LANGS
export const ipc_events = events
// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('langs', langs)
    contextBridge.exposeInMainWorld('ipc_events', ipc_events)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
