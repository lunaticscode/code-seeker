import { cwd } from 'process'
import { join } from 'path'
import { SYSTEM_PROMPT } from '../consts/llm'
import { app } from 'electron'

const modelFilename = 'qwen2.5-coder-1.5b-instruct-q4_k_m.gguf'

const modelPath = app.isPackaged
  ? join(process.resourcesPath, 'model', modelFilename)
  : join(cwd(), 'model', modelFilename)
console.log({ modelPath })
export const getLlamaSession = async () => {
  const { getLlama, LlamaChatSession } = await import('node-llama-cpp')
  const llama = await getLlama({ build: 'auto' })
  const model = await llama.loadModel({ modelPath })
  const context = await model.createContext()
  const session = new LlamaChatSession({
    contextSequence: context.getSequence(),
    systemPrompt: SYSTEM_PROMPT
  })
  return session
}
