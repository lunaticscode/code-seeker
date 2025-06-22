import { DragEvent, useEffect, useRef, useState, FC, useMemo, MouseEvent } from 'react'
import { createRoot, Root } from 'react-dom/client'
type ScopeLineDirections = 'start' | 'end'
type ScopeDragHandler = (e: DragEvent<HTMLDivElement>, type: ScopeLineDirections) => void
type UseCodeScopeArg = {
  onChangeLines: (type: ScopeLineDirections, lineNumber: number) => void
  onChangeSelecting: (selecting: boolean) => void
}

interface CodeScopeProps {
  onChangeScope: UseCodeScopeArg['onChangeLines']
  onChangeSelecting: UseCodeScopeArg['onChangeSelecting']
}

const CodeScope: FC<CodeScopeProps> = ({ onChangeScope, onChangeSelecting }) => {
  const startLineRef = useRef<HTMLDivElement>(null)
  const endLineRef = useRef<HTMLDivElement>(null)
  const intialLineY = useRef<{ start: number; end: number }>({ start: 0, end: 0 })
  const debounceTimer = useRef<NodeJS.Timeout>(null)
  const debounceTimer2 = useRef<NodeJS.Timeout>(null)
  const [startMarginTop, setStartMarginTop] = useState<number>(0)
  const [endMarginBottom, setEndMarginBottom] = useState<number>(0)
  const [waitLine, setWaitLine] = useState<ScopeLineDirections | null>(null)

  const handleDragStartOfStartLine: ScopeDragHandler = (e, type) => {}
  const handleDragEndOfStartLine: ScopeDragHandler = (e, type) => {}

  const handleDragCaptureOfStartLine: ScopeDragHandler = (e, type) => {
    const { start, end } = intialLineY.current
    const distance = type === 'start' ? start - e.clientY : e.clientY - end
    if (!e.clientY || distance <= 0) return
    const sp = 20 * Math.floor(distance / 20)
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      if (type === 'start') {
        // setStartMarginTop(sp)
        setStartMarginTop(distance)
      }
      if (type === 'end') {
        setEndMarginBottom(distance)
      }
    }, 2)
    if (debounceTimer2.current) {
      clearTimeout(debounceTimer2.current)
    }
    debounceTimer2.current = setTimeout(() => {
      if (type === 'start') {
        setStartMarginTop(sp)
      }
      if (type === 'end') {
        setEndMarginBottom(sp)
      }
      onChangeScope(type, sp / 20)
    }, 100)
  }

  useEffect(() => {
    if (startLineRef.current) {
      const startRect = startLineRef.current.getBoundingClientRect()
      intialLineY.current.start = startRect.y
    }
    if (endLineRef.current) {
      const endRect = endLineRef.current.getBoundingClientRect()
      intialLineY.current.end = endRect.y
    }
  }, [])

  const handleClickLine = (e: MouseEvent, direction: ScopeLineDirections) => {
    const changedSelecting = waitLine === direction ? null : direction
    onChangeSelecting(changedSelecting ? true : false)
    setWaitLine(changedSelecting)
    e.stopPropagation()
  }
  const handleClickCodeSection = (e: MouseEvent) => {
    console.log('handleClickCodeSection')
    e.stopPropagation()
  }

  return (
    <div onClick={handleClickCodeSection} id={'code-scope-section'}>
      <div
        id={'code-scope-startline'}
        data-wait={waitLine === 'start'}
        ref={startLineRef}
        draggable
        onClick={(e) => handleClickLine(e, 'start')}
        onDragStart={(e) => handleDragStartOfStartLine(e, 'start')}
        onDragEnd={(e) => handleDragEndOfStartLine(e, 'start')}
        style={{ marginTop: `${-startMarginTop}px` }}
        onDragCapture={(e) => handleDragCaptureOfStartLine(e, 'start')}
      />
      <div id={'code-scope-target-section'} />
      <div
        ref={endLineRef}
        draggable
        data-wait={waitLine === 'end'}
        onClick={(e) => handleClickLine(e, 'end')}
        onDragStart={(e) => handleDragStartOfStartLine(e, 'end')}
        onDragEnd={(e) => handleDragEndOfStartLine(e, 'end')}
        onDragCapture={(e) => handleDragCaptureOfStartLine(e, 'end')}
        style={{ marginTop: `${endMarginBottom}px` }}
        id={'code-scope-endline'}
      />
    </div>
  )
}
export default CodeScope

const getScopeContainer = () => {
  const scopeContainer = document.createElement('div')
  scopeContainer.setAttribute('id', 'code-scope-container')
  return scopeContainer
}

export const useCodeScope = ({ onChangeLines, onChangeSelecting }: UseCodeScopeArg) => {
  const rootRef = useRef<Root>(null)
  const initLineNumberRef = useRef<number>(0)
  const isSelectingRef = useRef<boolean>(false)

  const cleanupRoot = () => {
    if (rootRef.current) {
      rootRef.current.unmount()
      const containerElement = document.getElementById('code-scope-container') ?? null
      if (containerElement) {
        containerElement.remove()
      }
    }
  }

  const handleChangeScope = (type: ScopeLineDirections, changeLineCount: number) => {
    // console.log(initLineNumberRef.current, type, changeLineCount)
    if (isSelectingRef.current) {
      return
    }
    onChangeLines(
      type,
      initLineNumberRef.current + (type === 'start' ? -changeLineCount : changeLineCount)
    )
  }
  const handleChangeSelecting = (selecting: boolean) => {
    isSelectingRef.current = selecting
    onChangeSelecting(selecting)
  }

  const MemorizedCodeScope = useMemo(
    () => <CodeScope onChangeScope={handleChangeScope} onChangeSelecting={handleChangeSelecting} />,
    [handleChangeScope]
  )

  const renderScope = (target: HTMLElement, initLineNumber: number) => {
    if (isSelectingRef.current) {
      console.log(initLineNumber)
      // 1) CodeScope ref(imperativeHandle) 이용해서 라인 이동(=> 스타일 변경)
      // 2) handleChangeScope 실행, direction 어떻게 가져올건 지 생각
      return
    }
    cleanupRoot()
    const container = getScopeContainer()
    target.appendChild(container)
    rootRef.current = createRoot(container)
    rootRef.current.render(MemorizedCodeScope)
    initLineNumberRef.current = initLineNumber
    onChangeLines('start', initLineNumber)
    onChangeLines('end', initLineNumber)
  }

  useEffect(() => {
    return () => {
      cleanupRoot()
    }
  }, [])

  return {
    renderScope
  }
}
