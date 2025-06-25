type FileNode = {
  name: string
  type: 'file' | 'dir'
  children?: FileNode[]
  path: string
}

type ProgrammingLangs = (typeof import('./main/consts/langs').PROGRAMMING_LANGS)[number]

declare const langs: typeof import('./preload/index').langs
declare const ipc_events: typeof import('./preload/index').ipc_events
