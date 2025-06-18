import { useEffect, useState } from 'react'
const EVENT_NAME = 'get-content-from-file-path'
type FileContent = {
  code: string
  ext: string
  lang: string
}
const DEFAULT_FILE_CONTENT: FileContent = {
  code: '',
  ext: '',
  lang: ''
}

const useFileContentWithIPC = () => {
  const [fileContent, setFileContent] = useState<FileContent>(DEFAULT_FILE_CONTENT)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const handleReceiveFileContentFromIPC = (_, data) => {
    setIsLoading(false)
    setFileContent(data)
  }

  const handleChangeSelectedFile = (file: FileNode) => {
    setIsLoading(true)
    window.electron.ipcRenderer.send(EVENT_NAME, file.path)
  }

  useEffect(() => {
    window.electron.ipcRenderer.on(EVENT_NAME, handleReceiveFileContentFromIPC)
    return () => {
      window.electron.ipcRenderer.removeAllListeners(EVENT_NAME)
    }
  }, [])

  return {
    fileContent,
    handleChangeSelectedFile,
    isLoading
  }
}
export default useFileContentWithIPC
