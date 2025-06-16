import { FC, Fragment } from 'react'
import { useFileTreeContext } from './Root'

export interface FileTreeProps {
  data: FileNode[]
}

const FileTreeContent: FC<FileTreeProps> = (props) => {
  const { data } = props
  const { expandedNodes, handleChangeExpandedNodes } = useFileTreeContext()
  const handleClickFileNode = (fileNode: FileNode) => {
    console.log({ fileNode })
    if (fileNode.type === 'dir') {
      console.log(fileNode.type)
      handleChangeExpandedNodes(fileNode)
    }
  }

  const renderNode = (fileNode: FileNode) => {
    if (fileNode.type === 'file') {
      return (
        <div className={'filetree-item-file'} onClick={() => handleClickFileNode(fileNode)}>
          {fileNode.name}
        </div>
      )
    } else {
      return (
        <>
          <div className={'filetree-item-dir'} onClick={() => handleClickFileNode(fileNode)}>
            📁{fileNode.name}
          </div>
          <div className={'filetree-item-dir-children-wrapper'} style={{ marginLeft: '10px' }}>
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
