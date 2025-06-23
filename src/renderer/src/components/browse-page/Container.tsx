import FileTree from '@renderer/FileTree'
import useGetFileTree from '@renderer/hooks/useGetFileTree'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '@renderer/assets/container/browse-page.css'
import Markdown from 'react-markdown'
import useFileContentWithIPC from '@renderer/hooks/useFileContentWithIPC'
import { getMarkdownString } from '@renderer/utils/format'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus as HighlighterStyle } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useCodeScope } from './CodeScope'
const BrowseContainer = () => {
  const navigate = useNavigate()
  const { renderScope } = useCodeScope({ onChangeLines, onChangeSelecting })
  const [selectedLines, setSelectedLines] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0
  })
  const [isSelecting, setIsSelecting] = useState<boolean>(false)
  const { rootDir, lang, originType } = useLocation().state
  const [markdown, setMarkdown] = useState<string>('')
  const { trigger, fileTree, isLoading: treeLoading } = useGetFileTree()
  const { fileContent, handleChangeSelectedFile, isLoading: fileLoading } = useFileContentWithIPC()
  const isLoading = useMemo(() => treeLoading || fileLoading, [treeLoading, fileLoading])

  const setupFileTree = () => {
    trigger(originType, rootDir, lang)
  }

  function onChangeSelecting(direction, selecting: boolean) {
    setIsSelecting(selecting)
  }

  function onChangeLines(type: 'start' | 'end', lineNumber: number) {
    setSelectedLines((prev) => ({ ...prev, [type]: lineNumber }))
  }

  const hanldeClickCodeLine = (code: string, lineNumber: number, element: HTMLElement) => {
    const lines = code.split(/\r?\n/)
    const text = lines[lineNumber - 1]
    renderScope(element, lineNumber)
  }

  useEffect(() => {
    if (rootDir + lang) {
      setupFileTree()
    }
  }, [rootDir + lang])

  useEffect(() => {
    if (!rootDir) {
      navigate('/')
    }
  }, [rootDir])

  const MemorizedMarkdown = useMemo(
    () => (
      <Markdown
        children={getMarkdownString(fileContent.code, fileContent.lang)}
        components={{
          code(props) {
            const { children, className, node, ref, ...rest } = props
            const match = /language-(\w+)/.exec(className || '')
            console.log('rendering Markdown')
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                showLineNumbers={true}
                wrapLines={true}
                style={HighlighterStyle}
                lineProps={(lineNumber) => {
                  return {
                    id: `code-line-${lineNumber + 1}`,
                    className: 'code-line',
                    draggable: false,
                    onClick: (e) => {
                      console.log(e.relatedTarget)
                      hanldeClickCodeLine(String(children), lineNumber, e.currentTarget)
                    }
                  }
                }}
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            )
          }
        }}
      />
    ),

    [fileContent.code, fileContent.lang, HighlighterStyle]
  )

  return (
    <div className={'browse-container'}>
      <section className={'filetree-section'}>
        <FileTree.Root>
          <FileTree.Content data={fileTree ?? []} onFileClick={handleChangeSelectedFile} />
        </FileTree.Root>
      </section>
      <section className={'file-content-section'}>
        <div className={'file-content-source'} draggable={false}>
          {isLoading && <h3>isLoading...</h3>}
          {MemorizedMarkdown}
        </div>
        <div className={'file-content-review'}>
          {isSelecting ? 'true' : 'false'}
          {JSON.stringify(selectedLines)}
          <Markdown>{markdown}</Markdown>
        </div>
      </section>
    </div>
  )
}
export default BrowseContainer
