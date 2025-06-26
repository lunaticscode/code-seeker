import { cwd } from 'process'
import { join } from 'path'
import { SYSTEM_PROMPT } from '../consts/llm'
import { app } from 'electron'

const MODEL = {
  REVIEW: 'qwen2.5-coder-1.5b-instruct-q4_k_m.gguf',
  TRANSLATE: 'tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf'
}

const modelsDir = app.isPackaged ? join(process.resourcesPath, 'model') : join(cwd(), 'model')

export const getLlamaSession = async () => {
  const { getLlama, LlamaChatSession } = await import('node-llama-cpp')
  const llama = await getLlama({ build: 'auto' })
  const reviewModelPath = join(modelsDir, MODEL.REVIEW)
  const translateModelPath = join(modelsDir, MODEL.TRANSLATE)
  const [reviewModel, translateModel] = await Promise.all([
    llama.loadModel({ modelPath: reviewModelPath }),
    llama.loadModel({ modelPath: translateModelPath })
  ])

  const [reviewModelContext, translateModelContext] = await Promise.all([
    reviewModel.createContext(),
    translateModel.createContext()
  ])
  const reviewModelSession = new LlamaChatSession({
    contextSequence: reviewModelContext.getSequence(),
    systemPrompt: SYSTEM_PROMPT.REVIEW
  })
  const translateModelSession = new LlamaChatSession({
    contextSequence: translateModelContext.getSequence(),
    systemPrompt: SYSTEM_PROMPT.TRANSLATE
  })
  console.log({ reviewModelSession, translateModelSession })

  return { reviewModelSession, translateModelSession }
}
