import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useProfile } from '../state/profile'
import { useTranslation } from 'react-i18next'
import { showNewsAlert } from '../state/newsAlerts'
import { useStudyReminder } from '../state/reminder'
import { usePlaygroundClock } from '../state/usePlayground'
import { TabBar } from './ui'
import styles from './AppFrame.module.css'

/** Screens a first-time visitor may open before onboarding: signing in is how someone brings an existing account here. */
const FIRST_TIMER_OK = /^\/(account|login|signup|forgot-password|check-email|new-password|legal)(\/|$)/

/** Mobile column (max 430px) for the app screens. First-time visitors are sent to Welcome. */
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
  if (!onboarded && !pathname.startsWith('/welcome') && !FIRST_TIMER_OK.test(pathname)) return <Navigate to="/welcome" replace />
  return (
    <div className={styles.frame}>
      <Outlet />
    </div>
  )
}

/** The two main screens (Learn, Me): content above the floating tab bar. */
export function TabsLayout() {
  return (
    <div className={styles.tabs}>
      <Outlet />
      <TabBar />
    </div>
  )
}
