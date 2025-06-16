import { ProjectOrigins } from '@renderer/types'
import { useEffect, useState } from 'react'

const useGetFileTree = () => {
  const [fileTree, setFileTree] = useState<FileNode[]>()
  const handleExtractProjectFileTree = (_, data) => {
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
    return
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('extract-project-file-tree', handleExtractProjectFileTree)
    return () => {
      window.electron.ipcRenderer.removeAllListeners('extract-project-file-tree')
    }
  }, [])
  return { fileTree, trigger }
}
export default useGetFileTree
