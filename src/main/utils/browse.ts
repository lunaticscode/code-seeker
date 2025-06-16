import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import { DEFUALT_MUST_EXCLUDES, MUST_EXCLUDE_PATHS } from '../consts/ignores'

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
