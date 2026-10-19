import { Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Guide, Button, Icon } from '../../components/ui'
import { Money } from '../../components/Money'
import { moneyText } from '../../i18n'
import { CONFIG } from '../../domain/playground/config'
import { gain, marketOf, netWorth, realHistory } from '../../domain/playground/engine'
import { insights } from '../../domain/playground/insights'
import { usePlayground } from '../../state/usePlayground'
import styles from './Playground.module.css'

/** Season complete: start vs end, after inflation, what helped and what hurt. Play again cashes out into the bank. */
export function SummaryPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const pg = usePlayground()
  const s = pg.state
  if (s.status !== 'ended') return <Navigate to="/playground" replace />
  const market = marketOf(s)
  const net = netWorth(s, market)
  const real = realHistory(s, market)
  const realEnd = real[real.length - 1] ?? net
  const up = gain(s, market) >= 0
  const { helped, hurt } = insights(s)
  const text = (i: { key: string; vars?: Record<string, number> }) => {
    const vars: Record<string, unknown> = { ...i.vars }
    if (i.key === 'fees') {
      return t('pg_insight_fees', { count: i.vars!.n, fee: moneyText(i.vars!.fee) })
    }
    if (i.key === 'income') return t('pg_insight_income', { amount: moneyText(i.vars!.amount) })
    return t(`pg_insight_${i.key}` as 'pg_insight_stayed', vars)
  }

  return (
    <div className={`${styles.pageFull} ${styles.summaryPage}`}>
      <p className={`${styles.kicker} ${styles.centre}`}>{t('pg_season_kicker', { n: s.season, years: t('pg_years_n', { count: CONFIG.seasonYears }) })}</p>
      <h1 className={`${styles.bigTitle} ${styles.centre}`}>{t('pg_season_complete')}</h1>
      <div className={styles.summaryMascot}>
        <Guide pose={up ? 'cheer' : 'oops'} height={220} />
      </div>
      <div className={styles.twoCol}>
        <div className={styles.statCard}>
          <p className={styles.kicker}>{t('pg_started')}</p>
          <strong className={styles.amount}>
            <Money amount={s.funded} />
          </strong>
        </div>
        <div className={styles.statCard}>
          <p className={styles.kicker}>{t('pg_ended')}</p>
          <strong className={`${styles.amount} ${up ? styles.upText : styles.downText}`}>
            <Money amount={net} />
          </strong>
        </div>
      </div>
      <p className={styles.callout}>
        <span>{t(realEnd >= s.funded ? 'pg_after_inflation_line' : 'pg_after_inflation_behind', { real: moneyText(realEnd) })}</span>
      </p>

      <h2 className={styles.kicker}>{t('pg_what_helped')}</h2>
      <ul className={styles.insightList}>
        {(helped.length ? helped : [null]).map((i, k) => (
          <li key={k}>
            <Icon name="arrowUp" size={20} className={styles.upText} />
            <span>{i ? text(i) : t('pg_nothing_stood_out')}</span>
          </li>
        ))}
      </ul>
      <h2 className={styles.kicker}>{t('pg_what_hurt')}</h2>
      <ul className={styles.insightList}>
        {(hurt.length ? hurt : [null]).map((i, k) => (
          <li key={k}>
            <Icon name="arrowDown" size={20} className={styles.downText} />
            <span>{i ? text(i) : t('pg_nothing_stood_out')}</span>
          </li>
        ))}
      </ul>
      <div className={styles.summaryFoot}>
        <p className={styles.fine}>{t('pg_simulated_results')}</p>
        <Button
          onClick={() => {
            pg.cashOut()
            navigate('/playground', { replace: true })
          }}
        >
          {t('pg_play_again')}
        </Button>
        <Button variant="secondary" onClick={() => navigate('/')}>
          {t('backToLearning')}
        </Button>
      </div>
    </div>
  )
}
