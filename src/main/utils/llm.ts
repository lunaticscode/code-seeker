import { cwd } from 'process'
import { join } from 'path'
import { SYSTEM_PROMPT } from '../consts/llm'
// import { SYSTEM_PROMPT } from '../consts/llm'

const modelFilename = 'qwen2.5-coder-1.5b-instruct-q4_k_m.gguf'
const modelPath = join(cwd(), 'src', 'model', modelFilename)
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
