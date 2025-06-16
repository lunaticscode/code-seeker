import { useEffect, useState } from 'react'

type ProjectOrigins = 'local' | 'remote'
const useGetFileTree = () => {
  const [fileTree, setFileTree] = useState<FileNode[]>()
  const handleExtractProjectFileTree = (_, data) => {
    setFileTree(data)
  }

  const trigger = (origin: ProjectOrigins, lang: ProgrammingLangs = 'javascript') => {
    console.log('trigger exec')
    if (origin === 'local') {
      window.electron.ipcRenderer.send('request-project-dir-from-local', lang)
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
