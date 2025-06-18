import { readdirSync, statSync, readFileSync } from 'fs'
import { join, extname } from 'path'
import { DEFUALT_MUST_EXCLUDES, MUST_EXCLUDE_PATHS } from '../consts/ignores'
import { EXTENSION_TO_LANGUAGE } from '../consts/langs'

const getFileNode = (rootDir, fileName) => {
  const fileNode: FileNode = { name: '', type: 'file', path: '' }
  const filePath = join(rootDir, fileName)
  const fileStat = statSync(filePath)
  const name = fileName
  const type = fileStat.isDirectory() ? 'dir' : 'file'
  fileNode.path = filePath
  fileNode.name = name
  fileNode.type = type
  if (type === 'dir') {
    const nextBaseFileNames = readdirSync(filePath)
    if (nextBaseFileNames.length) {
      fileNode.children = nextBaseFileNames.map((baseFileName) =>
        getFileNode(filePath, baseFileName)
      )
    }
  }
  return fileNode
}

export const getFileTree = (
  projectDir: string,
  lang: ProgrammingLangs = 'javascript'
): FileNode[] => {
  const fileNodes: FileNode[] = []
  try {
    const baseFileNames = readdirSync(projectDir)
    if (!baseFileNames.length) return []
    for (const fileName of baseFileNames) {
      const excludes = [...(MUST_EXCLUDE_PATHS[lang] ?? []), ...DEFUALT_MUST_EXCLUDES]
      if (!excludes?.includes(fileName)) {
        const fileNode = getFileNode(projectDir, fileName)
        fileNodes.push(fileNode)
      }
    }
    return fileNodes as FileNode[]
  } catch (err) {
    console.error(err)
    return []
  }
}

export const getFileContent = (filePath: string) => {
  if (!filePath) return null
  try {
    const code = readFileSync(filePath, { encoding: 'utf-8' })
    const ext = extname(filePath)
    const lang = EXTENSION_TO_LANGUAGE[ext] ?? 'plaintext'
    return { code, ext, lang }
  } catch (err) {
    console.error(err)
    return null
  }
}
