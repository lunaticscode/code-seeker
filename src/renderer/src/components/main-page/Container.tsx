import { ProjectOrigins } from '@renderer/types'
import '../../assets/container/main-page.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DEFAULT_SELECTED_LANG: ProgrammingLangs = 'javascript'
const DEFAULT_SELECTED_PROJECT_ORIGIN: ProjectOrigins = 'local'
const MainContainer = () => {
  const navigate = useNavigate()
  const [selectedLang, setSelectedLang] = useState<ProgrammingLangs>(DEFAULT_SELECTED_LANG)
  const [selectedType, setSelecteType] = useState<ProjectOrigins>(DEFAULT_SELECTED_PROJECT_ORIGIN)

  const handleSelectProjectDir = (_, rootDir) => {
    navigate('/browse', { state: { rootDir, originType: selectedType, lang: selectedLang } })
  }
  const handleBrowse = (type: ProjectOrigins) => {
    setSelecteType(type)
    window.electron.ipcRenderer.send('request-project-dir-from-local')
  }
  useEffect(() => {
    window.electron.ipcRenderer.on('response-project-dir-from-local', handleSelectProjectDir)
    return () => {}
  }, [])
  return (
    <div className={'main-container'}>
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
      <button className="action-button" onClick={() => handleBrowse('remote')}>
        Get project from Remote(e.g. Github, Gitlab)
      </button>
      <button className="action-button" onClick={() => handleBrowse('local')}>
        Get project from Local
      </button>
    </div>
  )
}
export default MainContainer
