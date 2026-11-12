import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Change } from '../../components/Change'
import { Money } from '../../components/Money'
import { buttonClass, Guide, Icon } from '../../components/ui'
import { awaySummary } from '../../domain/playground/away'
import { localDay } from '../../domain/progress'
import { awayStore, lookedAtPortfolio } from '../../state/away'
import { playgroundStore } from '../../state/playground'
import { useStore } from '../../state/useStore'
import styles from './PathPage.module.css'

/** "While you were away" on Learn: the simulated weeks that passed since the player last looked, how the portfolio moved
 *  (market moves only), payouts, and news waiting. At most once a day; opening the portfolio or ✕ puts it away. */
export function AwayCard() {
  const { t } = useTranslation()
  const pg = useStore(playgroundStore)
  const snap = useStore(awayStore)
  const away = awaySummary(snap, pg, localDay())
  if (!away) return null
  return (
    <section className={styles.away} aria-labelledby="away-title">
      <Guide pose="news" height={72} className={styles.awayGuide} />
      <div className={styles.awayText}>
        <h2 id="away-title">{t('away_title')}</h2>
        <p>{t('away_weeks', { count: away.weeks })}</p>
        <ul>
          <li>
            {t('away_change')} <Change amount={away.change} />
          </li>
          {away.income > 0 && (
            <li>
              {t('away_income')} <Money amount={away.income} sign />
            </li>
          )}
          {away.news > 0 && <li>{t('away_news', { count: away.news })}</li>}
        </ul>
        <Link to="/portfolio" className={buttonClass({ size: 'sm' })} onClick={() => lookedAtPortfolio()}>
          {t('away_open')}
        </Link>
      </div>
      <button type="button" className={styles.awayClose} aria-label={t('away_close')} onClick={() => lookedAtPortfolio()}>
        <Icon name="close" size={20} />
      </button>
    </section>
  )
}
