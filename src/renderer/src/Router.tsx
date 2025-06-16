import { HashRouter, Route, Routes } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import MainPage from './pages/MainPage'
import BrowsePage from './pages/BrowsePage'

const Router = () => {
  return (
    <RootLayout>
      <HashRouter>
        <Routes>
          <Route path={'/'} element={<MainPage />} />
          <Route path={'/browse'} element={<BrowsePage />} />
        </Routes>
      </HashRouter>
    </RootLayout>
  )
}
export default Router
