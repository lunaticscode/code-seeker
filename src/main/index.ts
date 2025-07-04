import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { getFileContent, getFileTree } from './utils/browse'
import { getLlamaSession } from './utils/llm'
import { LlamaChatSession } from 'node-llama-cpp'
import ipc_events from './consts/events'

let translateChatSession: LlamaChatSession
let reviewChatSession: LlamaChatSession
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', async () => {
    const { reviewModelSession, translateModelSession } = await getLlamaSession()
    reviewChatSession = reviewModelSession
    translateChatSession = translateModelSession
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)

    ipcMain.on('request-project-dir-from-local', (event) => {
      console.log('ipcMain :: request-filesystem-permission')
      const result = dialog.showOpenDialogSync(window, {
        properties: ['openDirectory']
      })

      const dirname = result?.[0] || ''
      event.sender.send('response-project-dir-from-local', dirname)

      // try {
      //   const filesFromDir = getFileTree(dirname)
      //   return event.sender.send('extract-project-file-tree', filesFromDir)
      // } catch (err) {}
    })
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.on('request-project-dir-from-remote', (_, remotePath) => {
    console.log(remotePath)
  })

  ipcMain.on('extract-project-file-tree', (event, rootDir, lang) => {
    try {
      const filesFromDir = getFileTree(rootDir, lang)
      return event.sender.send('extract-project-file-tree', filesFromDir)
    } catch (err) {
      console.error(err)
      return event.sender.send('extract-project-file-tree', [])
    }
  })

  ipcMain.on('get-content-from-file-path', (event, filePath) => {
    const fileContent = getFileContent(filePath)
    return event.sender.send('get-content-from-file-path', fileContent)
  })

  ipcMain.on(ipc_events['LLAMA_REVIEW_EVENT'], async (event, code) => {
    let isStart = false
    console.log(reviewChatSession.context, code)
    event.sender.send(ipc_events['LLAMA_REVIEW_STATUS_EVENT'], 'wait')

    await reviewChatSession.promptWithMeta(code, {
      onTextChunk(chunk) {
        if (!isStart) {
          isStart = true
          event.sender.send(ipc_events['LLAMA_REVIEW_STATUS_EVENT'], 'progress')
        }

        event.sender.send(ipc_events['LLAMA_REVIEW_EVENT'], chunk)
      }
    })
    event.sender.send(ipc_events['LLAMA_REVIEW_STATUS_EVENT'], 'end')
  })

  //* Translate model testing.
  ipcMain.on(ipc_events['LLAMA_REVIEW_TRANSLATE_EVENT'], async (event, code) => {
    await translateChatSession.promptWithMeta(code, {
      onTextChunk(chunk) {
        event.sender.send(ipc_events['LLAMA_REVIEW_TRANSLATE_EVENT'], chunk)
      }
    })
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
