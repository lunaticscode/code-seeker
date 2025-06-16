import { FC, PropsWithChildren, createContext, useContext, useState } from 'react'

export interface FileTreeContextProps {
  expandedNodes: string[]
  handleChangeExpandedNodes: (targetFileNode: FileNode) => void
}

const FileTreeContext = createContext<FileTreeContextProps | null>(null)

export const useFileTreeContext = () => {
  const context = useContext(FileTreeContext)
  if (!context) {
    console.error('(!) Invalid context scope :: FileTreeContext')
    throw new Error('INVALID_CONTEXT_SCOPE')
  }
  return context
}

export interface FileTreeRootProps extends PropsWithChildren {}
const FileTreeRoot: FC<FileTreeRootProps> = ({ children }) => {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([])

  const handleChangeExpandedNodes = (targetFileNode: FileNode) => {
    if (!expandedNodes.includes(targetFileNode.path)) {
      setExpandedNodes((prev) => [...prev, targetFileNode.path])
    } else {
      setExpandedNodes((prev) => prev.filter((prevPath) => prevPath !== targetFileNode.path))
    }
  }
  const contextValue = { expandedNodes, handleChangeExpandedNodes }
  return <FileTreeContext.Provider value={contextValue}>{children}</FileTreeContext.Provider>
}
export default FileTreeRoot
