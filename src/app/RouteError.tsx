import { useEffect } from 'react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AbuShreek, Button, buttonClass, Card, Icon } from '../components/ui'
import { isChunkLoadError, reloadOnce } from './chunkReload'
import styles from './RouteError.module.css'

/** Shown by the router when a screen throws or its code can't be loaded (designs 41, 42). Reloading fixes the common
 *  case: the app was deployed while this tab was open, so the tab's old files are gone (see chunkReload.ts). */
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
      <div className={styles.top}>
        <AbuShreek pose="oops" height={240} />
        <h1>{t('errorTitle')}</h1>
        <Card className={styles.card}>
          <p>{stale ? t('errorUpdated') : t('errorGeneric')}</p>
          <p className={styles.safe}>
            <Icon name="check" size={20} /> {t('errorSafe')}
          </p>
        </Card>
      </div>
      <div className={styles.actions}>
        <Button onClick={() => window.location.reload()}>{t('errorReload')}</Button>
        <Link to="/" className={buttonClass({ variant: 'secondary' })}>
          {t('home')}
        </Link>
      </div>
    </main>
  )
}
