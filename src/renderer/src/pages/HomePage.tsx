import useGetFileTree from '@renderer/hooks/useGetFileTree'
import { useState } from 'react'
const DEFAULT_SELECTED_LANG: ProgrammingLangs = 'javascript'

const HomePage = () => {
  const [selectedLang, setSelectedLang] = useState<ProgrammingLangs>(DEFAULT_SELECTED_LANG)
  const { trigger, fileTree } = useGetFileTree()

  return (
    <>
      {JSON.stringify(fileTree)}
      <h2>HomePage</h2>
      <div>
        {langs.map((lang, index) => (
          <button
            style={{ color: 'white', backgroundColor: selectedLang === lang ? 'blue' : 'initial' }}
            onClick={() => setSelectedLang(lang)}
            key={`lang-select-button-key-${index}`}
          >
            {lang}
          </button>
        ))}
      </div>
      <button onClick={() => trigger('remote', selectedLang)}>
        Get project from Remote(e.g. Github, Gitlab)
      </button>
      <button onClick={() => trigger('local', selectedLang)}>Get project from Local</button>
    </>
  )
}
export default HomePage
