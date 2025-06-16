// JavaScript & TypeScript
const NODEJS_MUST_EXCLUDES = [
  'node_modules',
  '.DS_Store',
  'dist',
  'build',
  'out',
  '.vscode',
  '.idea',
  '.env',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'bun.lockb'
]

// Python
const PYTHON_MUST_EXCLUDES = [
  '__pycache__',
  '.venv',
  'env',
  'build',
  'dist',
  '.vscode',
  '.idea',
  '.env'
]

// Java
const JAVA_MUST_EXCLUDES = ['target', '.gradle', 'build', 'bin', '.vscode', '.idea', '.env']

// C++
const CPP_MUST_EXCLUDES = ['build', 'bin', 'obj', '.vscode', '.idea', '.env']

// C
const C_MUST_EXCLUDES = ['build', 'bin', 'obj', '.vscode', '.idea', '.env']

// Rust
const RUST_MUST_EXCLUDES = ['target', '.vscode', '.idea', '.env', 'Cargo.lock']

// PHP (Laravel, Symfony 등 고려)
const PHP_MUST_EXCLUDES = [
  'vendor',
  'node_modules', // Laravel에서 JS 의존성
  'storage',
  'bootstrap/cache',
  '.vscode',
  '.idea',
  '.env',
  'composer.lock',
  'package-lock.json',
  'yarn.lock'
]

// Flutter
const FLUTTER_MUST_EXCLUDES = [
  'build',
  '.dart_tool',
  '.pub-cache',
  '.vscode',
  '.idea',
  '.env',
  'pubspec.lock'
]

// Swift
const SWIFT_MUST_EXCLUDES = ['build', 'DerivedData', '.vscode', '.idea', '.env']

// Objective-C
const OBJC_MUST_EXCLUDES = ['build', 'DerivedData', '.vscode', '.idea', '.env']

// 종합 매핑 객체
export const MUST_EXCLUDE_PATHS: { [lang in ProgrammingLangs]?: string[] } = {
  javascript: NODEJS_MUST_EXCLUDES,
  typescript: NODEJS_MUST_EXCLUDES,
  python: PYTHON_MUST_EXCLUDES,
  java: JAVA_MUST_EXCLUDES,
  'c++': CPP_MUST_EXCLUDES,
  c: C_MUST_EXCLUDES,
  rust: RUST_MUST_EXCLUDES,
  php: PHP_MUST_EXCLUDES,
  flutter: FLUTTER_MUST_EXCLUDES,
  swift: SWIFT_MUST_EXCLUDES,
  'objective-c': OBJC_MUST_EXCLUDES
}
