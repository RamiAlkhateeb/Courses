import { useTranslation } from 'react-i18next'
import { Guide, Button, Icon } from '../ui'
import { ASSET_IDS } from '../../domain/playground/config'
import { direction, EVENTS, type EventId } from '../../domain/playground/events'
import { assetName } from './shared'
import styles from './Playground.module.css'

const ARROW = { up: 'arrowUp', down: 'arrowDown', flat: 'arrowRight' } as const

/** Design 25: market news, full screen on navy. Time keeps running (it follows the real clock); unread stories wait in
 *  the queue. Each asset gets an arrow, with colour AND shape, and one line on why. */
export function NewsOverlay({ id, year, onContinue }: { id: EventId; year: number; onContinue: () => void }) {
  const { t } = useTranslation()
  const event = EVENTS[id]
  return (
    <div className={styles.news} role="dialog" aria-modal="true" aria-label={t(`pg_event_${id}_title`)}>
      <header className={styles.newsTop}>
        <span>{t('pg_year_n', { n: year })}</span>
      </header>
      <div className={styles.newsCard}>
        <p className={styles.kicker}>{t('pg_market_news')}</p>
        <h1>{t(`pg_event_${id}_title`)}</h1>
        <p className={styles.newsBody}>{t(`pg_event_${id}_body`)}</p>
        <ul className={styles.effects}>
          {ASSET_IDS.map((asset) => {
            const d = direction(event, asset)
            return (
              <li key={asset}>
                <span className={`${styles.arrow} ${styles[`arrow_${d}`]}`}>
                  <Icon name={ARROW[d]} size={22} />
                  <span className="visually-hidden">{t(`pg_dir_${d}`)}</span>
                </span>
                <span className={styles.assetText}>
                  <strong>{assetName(t, asset, true)}</strong>
                  <small>{t(`pg_event_${id}_${asset}`)}</small>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
      <div className={styles.newsGuide}>
        <Guide pose="news" height={130} />
        <p className={styles.bubble}>{t('pg_news_bubble')}</p>
      </div>
      <div className={styles.newsFoot}>
        <Button onClick={onContinue} autoFocus>
          {t('continue')}
        </Button>
      </div>
    </div>
  )
}
