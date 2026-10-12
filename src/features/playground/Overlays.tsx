import { useTranslation } from 'react-i18next'
import { AbuShreek, Button, Icon } from '../../components/ui'
import { Money } from '../../components/Money'
import { ASSET_IDS } from '../../domain/playground/config'
import { direction, EVENTS, type EventId } from '../../domain/playground/events'
import { assetName } from './shared'
import styles from './Playground.module.css'

const ARROW = { up: 'arrowUp', down: 'arrowDown', flat: 'arrowRight' } as const

/** Design 25: market news, full screen on navy. Time is paused while it is up (see `pendingEvent`). Each asset gets
 *  an arrow, with colour AND shape, and one line on why. */
export function NewsOverlay({ id, year, paused, onContinue }: { id: EventId; year: number; paused: boolean; onContinue: () => void }) {
  const { t } = useTranslation()
  const event = EVENTS[id]
  return (
    <div className={styles.news} role="dialog" aria-modal="true" aria-label={t(`pg_event_${id}_title`)}>
      <header className={styles.newsTop}>
        <span>{paused ? t('pg_time_paused_year', { n: year }) : t('pg_year_n', { n: year })}</span>
        {paused && <Icon name="pause" size={20} />}
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
        <AbuShreek pose="point" height={130} />
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

/** Design 37: "Time stood still": shown when you come back, because markets only move while you watch. */
export function PausedOverlay({ year, net, speed, onResume, onStay }: { year: number; net: number; speed: number; onResume: () => void; onStay: () => void }) {
  const { t } = useTranslation()
  return (
    <div className={styles.paused} role="dialog" aria-modal="true" aria-label={t('pg_time_stood_still')}>
      <div className={styles.pauseTop}>
        <span className={styles.pauseDisc}>
          <Icon name="pause" size={42} />
        </span>
        <h1>{t('pg_time_stood_still')}</h1>
        <p className={styles.muted}>{t('pg_still_year', { n: year })}</p>
      </div>
      <div className={styles.pauseCard}>
        <div>
          <p className={styles.kicker}>{t('pg_net_worth')}</p>
          <strong className={styles.amount}>
            <Money amount={net} />
          </strong>
        </div>
        <div className={styles.pauseSpeed}>
          <p className={styles.kicker}>{t('pg_speed')}</p>
          <strong>{t('pg_years_per_minute', { count: speed })}</strong>
        </div>
      </div>
      <div className={styles.newsGuide}>
        <AbuShreek pose="wave" height={130} />
        <p className={styles.bubble}>{t('pg_welcome_back')}</p>
      </div>
      <div className={styles.newsFoot}>
        <p className={styles.fine}>{t('pg_play_money_simulated')}</p>
        <Button onClick={onResume} autoFocus>
          {t('pg_resume')}
        </Button>
        <Button variant="secondary" onClick={onStay}>
          {t('pg_stay_paused')}
        </Button>
      </div>
    </div>
  )
}
