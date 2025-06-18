import FileTree from '@renderer/FileTree'
import useGetFileTree from '@renderer/hooks/useGetFileTree'
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import '@renderer/assets/container/browse-page.css'
import Markdown from 'react-markdown'
import useFileContentWithIPC from '@renderer/hooks/useFileContentWithIPC'
import { getMarkdownString } from '@renderer/utils/format'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus as HighlighterStyle } from 'react-syntax-highlighter/dist/esm/styles/prism'
const BrowseContainer = () => {
  const { rootDir, lang, originType } = useLocation().state
  const [markdown, setMarkdown] = useState<string>('')
  const { trigger, fileTree, isLoading: treeLoading } = useGetFileTree()
  const { fileContent, handleChangeSelectedFile, isLoading: fileLoading } = useFileContentWithIPC()
  const isLoading = useMemo(() => treeLoading || fileLoading, [treeLoading, fileLoading])
  const setupFileTree = () => {
    trigger(originType, rootDir, lang)
  }
  useEffect(() => {
    if (rootDir + lang) {
      setupFileTree()
    }
  }, [rootDir + lang])

  return (
    <div className={'browse-container'}>
      <section className={'filetree-section'}>
        <FileTree.Root>
          <FileTree.Content data={fileTree ?? []} onFileClick={handleChangeSelectedFile} />
        </FileTree.Root>
      </section>
      <section className={'file-content-section'}>
        <div className={'file-content-source'}>
          {isLoading && <h3>isLoading...</h3>}
          <Markdown
            children={getMarkdownString(fileContent.code, fileContent.lang)}
            components={{
              code(props) {
                const { children, className, node, ref, ...rest } = props
                const match = /language-(\w+)/.exec(className || '')
                return match ? (
                  <SyntaxHighlighter
                    {...rest}
                    PreTag="div"
                    children={String(children).replace(/\n$/, '')}
                    language={match[1]}
                    style={HighlighterStyle}
                  />
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                )
              }
            }}
          />
        </div>
        <div className={'file-content-review'}>
          {/* <textarea onChange={(e) => setMarkdown(e.target.value)} /> */}
          <Markdown>{markdown}</Markdown>
        </div>
      </section>
    </div>
  )
}
export default BrowseContainer
