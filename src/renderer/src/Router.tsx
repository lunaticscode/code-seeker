import { HashRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RootLayout from './components/layout/RootLayout'

const Router = () => {
  return (
    <RootLayout>
      <HashRouter>
        <Routes>
          <Route path={'/'} element={<HomePage />} />
        </Routes>
      </HashRouter>
    </RootLayout>
  )
}
export default Router
