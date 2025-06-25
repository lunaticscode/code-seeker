import { LlamaReviewStatus } from '@renderer/types'
import { useEffect, useState } from 'react'

const useReview = () => {
  const [status, setStatus] = useState<LlamaReviewStatus>('wait')
  const [result, setResult] = useState<string>('')

  const onReceiveReviewChunk = (chunk: string) => {
    setResult((prev) => prev + chunk)
  }

  const onReceiveReivewStatus = (status: LlamaReviewStatus) => {
    setStatus(status)
  }

  const cleanupListener = () => {
    window.electron.ipcRenderer.removeAllListeners(ipc_events['LLAMA_REVIEW_EVENT'])
    window.electron.ipcRenderer.removeAllListeners(ipc_events['LLAMA_REVIEW_STATUS_EVENT'])
  }

  const review = (code: string) => {
    cleanupListener()
    window.electron.ipcRenderer.send(ipc_events['LLAMA_REVIEW_EVENT'], code)
    window.electron.ipcRenderer.on(ipc_events['LLAMA_REVIEW_EVENT'], (_, chunk) =>
      onReceiveReviewChunk(chunk)
    )
    window.electron.ipcRenderer.on(ipc_events['LLAMA_REVIEW_STATUS_EVENT'], (_, status) =>
      onReceiveReivewStatus(status)
    )
  }

  useEffect(() => {
    if (status === 'end') {
      cleanupListener()
    }
  }, [status])

  useEffect(() => {
    return () => {
      cleanupListener()
    }
  }, [])

  return {
    status,
    review,
    result
  }
}
export default useReview
