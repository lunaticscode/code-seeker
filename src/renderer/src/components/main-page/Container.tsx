import useGetFileTree from '@renderer/hooks/useGetFileTree'
import '../../assets/container/main-page.css'
import { useState } from 'react'
import FileTree from '@renderer/FileTree'

const DEFAULT_SELECTED_LANG: ProgrammingLangs = 'javascript'
const MainContainer = () => {
  const [selectedLang, setSelectedLang] = useState<ProgrammingLangs>(DEFAULT_SELECTED_LANG)
  const { trigger, fileTree } = useGetFileTree()
  console.log(fileTree)
  return (
    <div className={'main-container'}>
      <div>
        <FileTree.Root>
          <FileTree.Content data={fileTree ?? []} />
        </FileTree.Root>
      </div>
      <div className={'lang-button-group'}>
        {langs.map((lang, index) => (
          <button
            className={`lang-button ${selectedLang === lang ? 'selected' : ''}`}
            onClick={() => setSelectedLang(lang)}
            key={`lang-select-button-key-${index}`}
          >
            {lang}
          </button>
        ))}
      </div>
      <button className="action-button" onClick={() => trigger('remote', selectedLang)}>
        Get project from Remote(e.g. Github, Gitlab)
      </button>
      <button className="action-button" onClick={() => trigger('local', selectedLang)}>
        Get project from Local
      </button>
    </div>
  )
}
export default MainContainer
