import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AbuShreek, Icon } from '../../components/ui'
import { RiskPills } from '../../components/RiskPills'
import { moneyText } from '../../i18n'
import { CONFIG } from '../../domain/playground/config'
import { maxDrawdown } from '../../domain/playground/engine'
import { allocation, biggestBet, riskLevel, stressLoss } from '../../domain/playground/risk'
import { usePlayground } from '../../state/usePlayground'
import { useProgress } from '../../state/useProgress'
import { assetName, ASSET_DOT, riskWord, yearOf } from './shared'
import styles from './Playground.module.css'

/** Design 34: the portfolio's worst drop, risk level, where the money sits, and a stress test. */
export function RiskPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state } = usePlayground()
  const { progress } = useProgress()
  const worst = maxDrawdown(state.history, state.historyStart)
  const level = riskLevel(state)
  const alloc = allocation(state)
  const bet = biggestBet(state)
  const loss = stressLoss(state)
  const pct = (n: number) => Math.round(n * 100)
  const rows = [{ id: 'cash' as const, share: alloc.cash.share }, ...alloc.assets.map((a) => ({ id: a.id, share: a.share }))].filter((r) => r.share > 0)

  return (
    <div className={styles.pageFull}>
      <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label={t('back')}>
        <Icon name="back" size={26} />
      </button>
      <h1 className={styles.bigTitle}>{t('pg_risk_check')}</h1>

      <div className={styles.twoCol}>
        <div className={styles.statCard}>
          <p className={styles.kicker}>{t('pg_worst_drop')}</p>
          <strong className={styles.down}>
            <Icon name="arrowDown" size={30} /> <bdi dir="ltr">−{pct(worst.fall)}%</bdi>
          </strong>
          <small className={styles.muted}>{worst.fall > 0 ? t('pg_year_n', { n: yearOf(worst.tick) }) : t('pg_no_drop_yet')}</small>
        </div>
        <div className={styles.statCard}>
          <p className={styles.kicker}>{t('pg_risk_level')}</p>
          <RiskPills level={level} />
          <small className={styles.muted}>
            {t('pg_n_of_5', { n: level })} · {riskWord(t, level)}
          </small>
        </div>
      </div>

      <div className={styles.fundCard}>
        <p className={styles.kicker}>{t('pg_where_money_sits')}</p>
        <div className={styles.alloc} dir="ltr" role="img" aria-label={rows.map((r) => `${r.id === 'cash' ? t('pg_cash') : assetName(t, r.id, true)} ${pct(r.share)}%`).join(', ')}>
          {rows.map((r) => (
            <span key={r.id} style={{ flexGrow: r.share, background: ASSET_DOT[r.id] }} />
          ))}
        </div>
        <ul className={styles.allocList}>
          {rows.map((r) => (
            <li key={r.id}>
              <span className={styles.dot} style={{ background: ASSET_DOT[r.id] }} />
              <span>{r.id === 'cash' ? t('pg_cash') : assetName(t, r.id, true)}</span>
              <strong>
                <bdi dir="ltr">{pct(r.share)}%</bdi>
              </strong>
            </li>
          ))}
        </ul>
      </div>

      <p className={styles.callout}>
        {t('pg_stress', {
          funds: pct(-CONFIG.stress.index),
          single: pct(-CONFIG.stress.nile),
          loss: moneyText(loss),
          bank: moneyText(progress.bank),
        })}
      </p>

      <div className={styles.emptyRow}>
        <AbuShreek pose="point" height={110} />
        <p className={styles.bubble}>
          {bet && bet.share >= 0.5 ? t('pg_bet_half', { name: assetName(t, bet.id) }) : bet ? t('pg_bet_spread', { pct: pct(bet.share), name: assetName(t, bet.id) }) : t('pg_bet_none')}
        </p>
      </div>
      <p className={`${styles.fine} ${styles.pinBottom}`}>{t('pg_simulated_not_advice')}</p>
    </div>
  )
}
