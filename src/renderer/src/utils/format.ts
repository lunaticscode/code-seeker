export const getMarkdownString = (code: string, lang: string) => {
  if (!code || !lang) return ''
  if (lang !== 'markdown') {
    return '```' + lang + '\n' + code + '```'
  }
  return code
}
