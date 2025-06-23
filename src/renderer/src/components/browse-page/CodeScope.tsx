import {
  DragEvent,
  useEffect,
  useRef,
  useState,
  useMemo,
  MouseEvent,
  forwardRef,
  useImperativeHandle
} from 'react'
import { createRoot, Root } from 'react-dom/client'
type ScopeLineDirections = 'start' | 'end'
type ScopeDragHandler = (e: DragEvent<HTMLDivElement>, type: ScopeLineDirections) => void
type UseCodeScopeArg = {
  onChangeLines: (type: ScopeLineDirections, lineNumber: number) => void
  onChangeSelecting: (type: ScopeLineDirections, selecting: boolean) => void
}

interface CodeScopeRefs {
  triggerChangeLine: (type: ScopeLineDirections, lineNumber: number) => void
  triggerClearWaitLine: () => void
}

interface CodeScopeProps {
  onChangeScope: UseCodeScopeArg['onChangeLines']
  onChangeSelecting: UseCodeScopeArg['onChangeSelecting']
}

const CodeScope = forwardRef<CodeScopeRefs, CodeScopeProps>(
  ({ onChangeScope, onChangeSelecting }, ref) => {
    const startLineRef = useRef<HTMLDivElement>(null)
    const endLineRef = useRef<HTMLDivElement>(null)
    const intialLineY = useRef<{ start: number; end: number }>({ start: 0, end: 0 })
    const debounceTimer = useRef<NodeJS.Timeout>(null)
    const debounceTimer2 = useRef<NodeJS.Timeout>(null)
    const [startMarginTop, setStartMarginTop] = useState<number>(0)
    const [endMarginBottom, setEndMarginBottom] = useState<number>(0)
    const [waitLine, setWaitLine] = useState<ScopeLineDirections | null>(null)

    const triggerChangeLine: CodeScopeRefs['triggerChangeLine'] = (type, lineNumber) => {
      console.log('triggerChangeLine ::: ', type, lineNumber)
      if (type === 'start') {
        setStartMarginTop((prev) => prev + lineNumber * 20)
      } else {
        setEndMarginBottom((prev) => prev + lineNumber * 20)
      }
      setWaitLine(null)
    }

    const triggerClearWaitLine = () => {
      setWaitLine(null)
    }
    useImperativeHandle(ref, () => ({
      triggerChangeLine,
      triggerClearWaitLine
    }))

    const handleDragCaptureOfLine: ScopeDragHandler = (e, type) => {
      const { start, end } = intialLineY.current
      const distance = type === 'start' ? start - e.clientY : e.clientY - end
      if (!e.clientY || distance <= 0) return
      const sp = 20 * Math.floor(distance / 20)

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      debounceTimer.current = setTimeout(() => {
        if (type === 'start') {
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
        setWaitLine(null)
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
      onChangeSelecting(direction, changedSelecting ? true : false)
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
          style={{ marginTop: `${-startMarginTop}px` }}
          onDragCapture={(e) => handleDragCaptureOfLine(e, 'start')}
        />
        <div id={'code-scope-target-section'} />
        <div
          id={'code-scope-endline'}
          ref={endLineRef}
          data-wait={waitLine === 'end'}
          draggable
          onClick={(e) => handleClickLine(e, 'end')}
          onDragCapture={(e) => handleDragCaptureOfLine(e, 'end')}
          style={{ marginTop: `${endMarginBottom}px` }}
        />
      </div>
    )
  }
)
export default CodeScope

const getScopeContainer = () => {
  const scopeContainer = document.createElement('div')
  scopeContainer.setAttribute('id', 'code-scope-container')
  return scopeContainer
}

export const useCodeScope = ({ onChangeLines, onChangeSelecting }: UseCodeScopeArg) => {
  const rootRef = useRef<Root>(null)
  const initLineNumberRef = useRef<number>(0)
  const currentLineNumberRef = useRef<{ [direction in ScopeLineDirections]: number }>({
    start: 0,
    end: 0
  })
  const isSelectingRef = useRef<ScopeLineDirections | null>(null)
  const codeScopeRef = useRef<CodeScopeRefs>(null)
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
    if (isSelectingRef.current) {
      return
    }
    currentLineNumberRef.current = {
      ...currentLineNumberRef.current,
      [type]: initLineNumberRef.current + (type === 'start' ? -changeLineCount : changeLineCount)
    }
    onChangeLines(
      type,
      initLineNumberRef.current + (type === 'start' ? -changeLineCount : changeLineCount)
    )
  }
  const handleChangeSelecting = (direction: ScopeLineDirections, selecting: boolean) => {
    isSelectingRef.current = selecting ? direction : null
    onChangeSelecting(direction, selecting)
  }

  const MemorizedCodeScope = useMemo(
    () => (
      <CodeScope
        ref={codeScopeRef}
        onChangeScope={handleChangeScope}
        onChangeSelecting={handleChangeSelecting}
      />
    ),
    [handleChangeScope]
  )

  const renderScope = (target: HTMLElement, lineNumber: number) => {
    if (isSelectingRef.current) {
      const selectedDirection = isSelectingRef.current
      const { start, end } = currentLineNumberRef.current
      if (
        (selectedDirection === 'start' && lineNumber >= end) ||
        (selectedDirection === 'end' && lineNumber <= start)
      ) {
        codeScopeRef.current?.triggerClearWaitLine()
        return
      }

      currentLineNumberRef.current = {
        ...currentLineNumberRef.current,
        [selectedDirection]: lineNumber
      }
      isSelectingRef.current = null
      const changedLineAmount =
        selectedDirection === 'start' ? start - lineNumber : lineNumber - end
      codeScopeRef.current?.triggerChangeLine(selectedDirection, changedLineAmount)
      onChangeLines(selectedDirection, lineNumber)
      return
    }
    cleanupRoot()
    const container = getScopeContainer()
    target.appendChild(container)
    rootRef.current = createRoot(container)
    rootRef.current.render(MemorizedCodeScope)
    initLineNumberRef.current = lineNumber
    currentLineNumberRef.current = { start: lineNumber, end: lineNumber }
    onChangeLines('start', lineNumber)
    onChangeLines('end', lineNumber)
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
