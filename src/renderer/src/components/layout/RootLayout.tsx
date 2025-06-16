import { FC, PropsWithChildren } from 'react'

interface RootLayoutProps extends PropsWithChildren {}
const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return <>{children}</>
}
export default RootLayout
