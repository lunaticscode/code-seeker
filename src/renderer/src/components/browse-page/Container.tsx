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

  const [code, setCode] = useState('')
  const [selectedLines, setSelectedLines] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0
  })
  const [isSelecting, setIsSelecting] = useState<boolean>(false)
  const [isReviewing, setIsReviewing] = useState<boolean>(false)
  const { rootDir, lang, originType } = useLocation().state
  const [reviewResult, setReviewResult] = useState<string>('')
  const { trigger, fileTree, isLoading: treeLoading } = useGetFileTree()
  const { fileContent, handleChangeSelectedFile, isLoading: fileLoading } = useFileContentWithIPC()
  const isLoading = useMemo(() => treeLoading || fileLoading, [treeLoading, fileLoading])

  const setupFileTree = () => {
    trigger(originType, rootDir, lang)
  }

  function onChangeSelecting(_direction: string, selecting: boolean) {
    setIsSelecting(selecting)
  }

  function onChangeLines(type: 'start' | 'end', lineNumber: number) {
    setSelectedLines((prev) => ({ ...prev, [type]: lineNumber }))
  }

  const hanldeClickCodeLine = (_code: string, lineNumber: number, element: HTMLElement) => {
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

  const setupCode = (str: string) => {
    setCode(str)
  }

  const MemorizedMarkdown = useMemo(
    () => (
      <Markdown
        children={getMarkdownString(fileContent.code, fileContent.lang)}
        components={{
          code(props) {
            const { children, className, node, ref, ...rest } = props
            const match = /language-(\w+)/.exec(className || '')
            setupCode(String(children).replace(/\n$/, ''))
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

    [fileContent.code, code, fileContent.lang, HighlighterStyle]
  )

  const onReceiveLlamaChunkData = (chunk: string) => {
    setReviewResult((prev) => prev + chunk)
  }

  const handleClickReivew = () => {
    if (!code) return
    const selectedCode = code.split('\n').slice(selectedLines.start - 1, selectedLines.end)

    setReviewResult('')
    window.electron.ipcRenderer.removeAllListeners('llama-test')
    window.electron.ipcRenderer.send('llama-test', selectedCode.join('\n'))
    window.electron.ipcRenderer.on('llama-test-start', () => {
      setIsReviewing(true)
    })
    window.electron.ipcRenderer.on('llama-test', (_, chunk) => onReceiveLlamaChunkData(chunk))
    window.electron.ipcRenderer.on('llama-test-finish', () => {
      setIsReviewing(false)
    })
  }

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
          {isReviewing && <h3>Review exec....</h3>}
          {JSON.stringify(selectedLines)}
          <button onClick={handleClickReivew}>review</button>
          <Markdown>{reviewResult}</Markdown>
        </div>
      </section>
    </div>
  )
}
export default BrowseContainer
