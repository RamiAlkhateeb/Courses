import { useEffect } from 'react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Card, Rafiq } from '../components/ui'
import { isChunkLoadError, reloadOnce } from './chunkReload'
import styles from './RouteError.module.css'

/** Shown by the router when a screen throws or its code can't be loaded. Reloading fixes the common case: the app
 *  was deployed while this tab was open, so the tab's old files are gone (see chunkReload.ts). */
export function RouteError() {
  const error = useRouteError()
  const { t } = useTranslation()
  const stale = isChunkLoadError(error)
  if (!isRouteErrorResponse(error)) console.error(error)
  // lazy() route chunks don't always raise vite:preloadError: recover from a stale deploy here too (once)
  useEffect(() => {
    if (stale) reloadOnce()
  }, [stale])

  return (
    <main className={styles.page} role="alert">
      <Rafiq pose="oops" height={120} />
      <Card className={styles.card}>
        <h1>{t('errorTitle')}</h1>
        <p>{stale ? t('errorUpdated') : t('errorGeneric')}</p>
        <div className={styles.actions}>
          <Button onClick={() => window.location.reload()}>{t('errorReload')}</Button>
          <Link to="/" className={styles.home}>
            {t('home')}
          </Link>
        </div>
      </Card>
    </main>
  )
}
