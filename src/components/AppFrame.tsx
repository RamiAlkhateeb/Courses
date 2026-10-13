import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useProfile } from '../state/profile'
import { TabBar } from './ui'
import styles from './AppFrame.module.css'

/** Mobile column (max 430px) for the app screens. First-time visitors are sent to Welcome. */
export function AppFrame() {
  const { onboarded } = useProfile()
  const { pathname } = useLocation()
  if (!onboarded && !pathname.startsWith('/welcome') && !pathname.startsWith('/account')) return <Navigate to="/welcome" replace />
  return (
    <div className={styles.frame}>
      <Outlet />
    </div>
  )
}

/** The three main screens (Learn, Playground, Me): content above the floating tab bar. */
export function TabsLayout() {
  return (
    <div className={styles.tabs}>
      <Outlet />
      <TabBar />
    </div>
  )
}
