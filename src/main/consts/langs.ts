export const PROGRAMMING_LANGS = [
  'c',
  'c++',
  'python',
  'javascript',
  'typescript',
  'rust',
  'php',
  'java',
  'flutter',
  'swift',
  'objective-c'
] as const

export const EXTENSION_TO_LANGUAGE: Record<string, string> = {
  // JavaScript 계열
  '.js': 'javascript',
  '.cjs': 'javascript',
  '.mjs': 'javascript',
  '.ts': 'typescript',
  '.jsx': 'jsx',
  '.tsx': 'tsx',

  // HTML/CSS
  '.html': 'html',
  '.htm': 'html',
  '.css': 'css',
  '.scss': 'scss',
  '.sass': 'sass',
  '.less': 'less',

  // JSON / 데이터
  '.json': 'json',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.xml': 'xml',
  '.toml': 'toml',
  '.ini': 'ini',

  // Markdown / 텍스트
  '.md': 'markdown',
  '.txt': 'plaintext',
  '.csv': 'csv',

  // C 계열
  '.c': 'c',
  '.h': 'c',
  '.cpp': 'cpp',
  '.cc': 'cpp',
  '.cxx': 'cpp',
  '.hpp': 'cpp',
  '.hxx': 'cpp',
  '.cs': 'csharp',

  // Java 계열
  '.java': 'java',
  '.kt': 'kotlin',
  '.kts': 'kotlin',
  '.groovy': 'groovy',
  '.scala': 'scala',

  // Python / Ruby
  '.py': 'python',
  '.pyw': 'python',
  '.rb': 'ruby',
  '.erb': 'ruby',

  // PHP
  '.php': 'php',

  // Shell / CLI
  '.sh': 'bash',
  '.zsh': 'bash',
  '.bash': 'bash',
  '.bat': 'batch',
  '.cmd': 'batch',
  '.ps1': 'powershell',

  // Go / Rust / Swift
  '.go': 'go',
  '.rs': 'rust',
  '.swift': 'swift',

  // 기타
  '.sql': 'sql',
  '.r': 'r',
  '.lua': 'lua',
  '.dart': 'dart',
  '.vb': 'vbnet',
  '.coffee': 'coffeescript',
  '.elm': 'elm',
  '.clj': 'clojure',
  '.cljs': 'clojure',
  '.ex': 'elixir',
  '.exs': 'elixir'
}
