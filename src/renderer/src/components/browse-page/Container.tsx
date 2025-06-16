import FileTree from '@renderer/FileTree'
import useGetFileTree from '@renderer/hooks/useGetFileTree'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import '@renderer/assets/container/browse-page.css'

const BrowseContainer = () => {
  const { rootDir, lang, originType } = useLocation().state
  const { trigger, fileTree } = useGetFileTree()
  const setupFileTree = () => {
    trigger(originType, rootDir, lang)
  }
  useEffect(() => {
    setupFileTree()
  }, [rootDir + lang])
  return (
    <div className={'browse-container'}>
      <section className={'filetree-section'}>
        <FileTree.Root>
          <FileTree.Content data={fileTree ?? []} />
        </FileTree.Root>
      </section>
      <section className={'file-content-section'}></section>
    </div>
  )
}
export default BrowseContainer
