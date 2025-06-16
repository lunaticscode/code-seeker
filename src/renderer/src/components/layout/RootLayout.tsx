import { FC, PropsWithChildren } from 'react'
import Header from './Header'

interface RootLayoutProps extends PropsWithChildren {}
const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
export default RootLayout
