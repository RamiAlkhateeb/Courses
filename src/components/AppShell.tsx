import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMatches } from 'react-router-dom'
import { TopBar } from './TopBar'
import { TopbarStart } from './TopbarStart'
import styles from './AppShell.module.css'

/** Course id from the current URL. Read via useMatches because AppShell is the parent layout route,
 *  so useParams() here wouldn't see the child route's params. */
function useCourseId() {
  const params = useMatches().at(-1)?.params as Record<string, string | undefined> | undefined
  return params?.courseId
}

/** Desktop reading layout (catalog, course chapter list, Settings): a top bar with the back link, then the page. */
export function AppShell() {
  const { t } = useTranslation()
  return (
    <div className={styles.shell}>
      <TopBar />
      <TopbarStart courseId={useCourseId()} />
      <main className={styles.main} aria-label={t('appName')}>
        <Outlet />
      </main>
    </div>
  )
}
