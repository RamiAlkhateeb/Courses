import { lazy, Suspense } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useProfile } from '../state/profile'
import { useTranslation } from 'react-i18next'
import { showNewsAlert } from '../state/newsAlerts'
import { useStudyReminder } from '../state/reminder'
import { usePlaygroundClock } from '../state/usePlayground'
import { useWide } from '../state/useWide'
import { useTrailId } from '../state/useTrail'
import { coursePath } from '../content/courses'
import { TabBar } from './ui'
import styles from './AppFrame.module.css'

// The laptop sidebar loads only on a wide window, so phones never download it
const Sidebar = lazy(() => import('./Sidebar').then((m) => ({ default: m.Sidebar })))

/** Screens a first-time visitor may open before onboarding: signing in is how someone brings an existing account here. */
const FIRST_TIMER_OK = /^\/(account|login|signup|forgot-password|check-email|new-password|legal)(\/|$)/

/** The app's frame. On a phone, a column (max 430px). On a laptop (≥1024px, `useWide`), the course sidebar beside a
 *  wider page; Welcome and onboarding keep the column. First-time visitors are sent to Welcome. */
export function AppFrame() {
  const { onboarded } = useProfile()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  // Playground time follows the real clock on every screen (the wallet shows it); news can raise an alert
  // The daily study reminder (when switched on in Settings): at most once a day, only if no lesson was done yet today
  useStudyReminder((streak) => ({
    title: t('reminder_title'),
    body: streak > 0 ? t('reminder_body_streak', { count: streak }) : t('reminder_body'),
  }))
  usePlaygroundClock((ids) => ids.forEach((id) => showNewsAlert(t('pg_alert_title', { title: t(`pg_event_${id}_title`) }), t(`pg_event_${id}_body`))))
  const wide = useWide()
  if (!onboarded && !pathname.startsWith('/welcome') && !FIRST_TIMER_OK.test(pathname)) return <Navigate to="/welcome" replace />
  const withSidebar = wide && onboarded && !pathname.startsWith('/welcome')
  // Learn, Me and the portfolio use more of a laptop's width (two columns); other pages keep a reading width
  const roomy = pathname === '/' || /^\/course\/[^/]+\/?$/.test(pathname) || pathname === '/me' || pathname === '/portfolio'
  if (!withSidebar)
    return (
      <div className={styles.frame}>
        <Outlet />
      </div>
    )
  return (
    <div className={`${styles.wide} ${roomy ? styles.roomy : ''}`}>
      <Suspense fallback={<div />}>
        <Sidebar />
      </Suspense>
      <div className={styles.page}>
        <Outlet />
      </div>
    </div>
  )
}

/** The two main screens (Learn, Me): content above the floating tab bar. */
export function TabsLayout() {
  // On a laptop the sidebar holds the same links, so the tab bar goes
  const wide = useWide()
  const trail = useTrailId()
  return (
    <div className={wide ? undefined : styles.tabs}>
      <Outlet />
      {!wide && <TabBar learnTo={coursePath(trail)} />}
    </div>
  )
}
