import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AbuShreek, Button } from '../../components/ui'
import { moneyText } from '../../i18n'
import { ASSETS } from '../../domain/playground/config'
import type { Trade } from '../../domain/playground/engine'
import { usePlayground } from '../../state/usePlayground'
import { assetName } from './shared'
import styles from './Playground.module.css'

/** Design 32: after a trade, the mascot explains what happened, the risk and the fee: never what to do next. */
export function DebriefPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const trade = useLocation().state as Trade | null
  const { state } = usePlayground()
  if (!trade || !ASSETS[trade.asset]) return <Navigate to="/playground" replace />

  const a = ASSETS[trade.asset]
  const buying = trade.side === 'buy'
  const name = assetName(t, trade.asset)
  const nudge = state.trades.length >= 3 ? 'pg_nudge_fees' : buying ? 'pg_nudge_wait' : 'pg_nudge_risk'
  const points = buying
    ? [
        { tone: styles.dotGood, text: t(`pg_did_${trade.asset}`) },
        { tone: styles.dotOkay, text: a.badYearFall > 0 ? t('pg_risk_line', { n: a.risk, pct: Math.round(a.badYearFall * 100) }) : t('pg_risk_line_safe') },
        { tone: styles.dotBad, text: t('pg_fee_line', { fee: moneyText(trade.fee, { decimals: 2 }) }) },
      ]
    : [
        { tone: styles.dotGood, text: t('pg_sold_line', { amount: moneyText(trade.amount), name }) },
        { tone: styles.dotOkay, text: t('pg_sold_cash', { cash: moneyText(state.cash, { decimals: 2 }) }) },
        { tone: styles.dotBad, text: t('pg_fee_line', { fee: moneyText(trade.fee, { decimals: 2 }) }) },
      ]

  return (
    <div className={styles.pageFull}>
      <p className={styles.kicker}>{buying ? t('pg_you_bought') : t('pg_you_sold')}</p>
      <h1 className={styles.bigTitle}>{t('pg_amount_of', { amount: moneyText(trade.amount), name: assetName(t, trade.asset, true) })}</h1>
      <div className={styles.emptyRow}>
        <AbuShreek pose="think" height={150} />
        <p className={styles.bubble}>{t('pg_debrief_bubble')}</p>
      </div>
      <div className={styles.fundCard}>
        <p className={styles.kicker}>{t('pg_what_happened')}</p>
        <ul className={styles.points}>
          {points.map((p, i) => (
            <li key={i}>
              <i className={`${styles.dot} ${p.tone}`} />
              <span>{p.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className={styles.callout}>
        <span>
          <strong>{t('pg_try_this')}</strong> {t(nudge)}
        </span>
      </p>
      <div className={styles.foot}>
        <p className={styles.fine}>{t('pg_educational_not_advice')}</p>
        <Button onClick={() => navigate('/playground', { replace: true })}>{t('pg_back_to_playground')}</Button>
      </div>
    </div>
  )
}
