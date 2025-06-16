import { HashRouter, Route, Routes } from 'react-router-dom'
import MainPage from './pages/MainPage'
import RootLayout from './components/layout/RootLayout'

const Router = () => {
  return (
    <RootLayout>
      <HashRouter>
        <Routes>
          <Route path={'/'} element={<MainPage />} />
        </Routes>
      </HashRouter>
    </RootLayout>
  )
}
export default Router
