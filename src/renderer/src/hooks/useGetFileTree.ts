import { ProjectOrigins } from '@renderer/types'
import { useEffect, useState } from 'react'

const useGetFileTree = () => {
  const [fileTree, setFileTree] = useState<FileNode[]>()
  const [isLoading, setIsLoading] = useState(false)
  const handleExtractProjectFileTree = (_, data) => {
    setIsLoading(false)
    setFileTree(data)
  }

  const trigger = (origin: ProjectOrigins, path: string, lang: ProgrammingLangs = 'javascript') => {
    console.log('trigger exec')
    if (origin === 'local') {
      window.electron.ipcRenderer.send('extract-project-file-tree', path, lang)
    }
    if (origin === 'remote') {
      window.electron.ipcRenderer.send(
        'request-project-dir-from-remote',
        'https://github.com',
        lang
      )
    }
    setIsLoading(true)
    return
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('extract-project-file-tree', handleExtractProjectFileTree)
    return () => {
      window.electron.ipcRenderer.removeAllListeners('extract-project-file-tree')
    }
  }, [])
  return { fileTree, trigger, isLoading }
}
export default useGetFileTree
