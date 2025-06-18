import { FC, Fragment, useState } from 'react'
import { useFileTreeContext } from './Root'
import '@renderer/assets/components/filetree.css'
export interface FileTreeContentProps {
  data: FileNode[]
  onFileClick?: (file: FileNode) => void
}

const FileTreeContent: FC<FileTreeContentProps> = (props) => {
  const { data, onFileClick } = props
  const { expandedNodes, handleChangeExpandedNodes } = useFileTreeContext()
  const [selectedFilePath, setSelectedFilePath] = useState<string>('')
  const handleClickFileNode = (fileNode: FileNode) => {
    if (selectedFilePath === fileNode.path) return
    setSelectedFilePath(fileNode.path)
    if (fileNode.type === 'dir') {
      handleChangeExpandedNodes(fileNode)
    } else {
      onFileClick?.(fileNode)
    }
  }

  const renderNode = (fileNode: FileNode) => {
    if (fileNode.type === 'file') {
      return (
        <div
          data-selected={selectedFilePath === fileNode.path}
          className={'filetree-item file'}
          onClick={() => handleClickFileNode(fileNode)}
        >
          {fileNode.name}
        </div>
      )
    } else {
      return (
        <>
          <div
            data-selected={selectedFilePath === fileNode.path}
            className={'filetree-item dir'}
            onClick={() => handleClickFileNode(fileNode)}
          >
            📁{fileNode.name}
          </div>
          <div className={'filetree-item dir-children-wrapper'} style={{ marginLeft: '10px' }}>
            {expandedNodes.includes(fileNode.path)
              ? fileNode.children?.map((fileNode, index) => (
                  <Fragment key={`${fileNode.name}-child-${index}`}>
                    {renderNode(fileNode)}
                  </Fragment>
                ))
              : null}
          </div>
        </>
      )
    }
  }

  return (
    <div>
      {data?.map((baseFileNode, index) => (
        <div className={'filetree-base-item'} key={`baefile_${index}`}>
          {renderNode(baseFileNode)}
        </div>
      ))}
    </div>
  )
}
export default FileTreeContent
