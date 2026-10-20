import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomSheet, Button, Guide, Icon } from '../ui'
import { Change } from '../Change'
import { Money } from '../Money'
import { moneyText } from '../../i18n'
import { GOAL_IDS, GOALS, MIX_IDS, MIXES, type AssetId, type GoalId, type MixId } from '../../domain/playground/config'
import type { PlaygroundState } from '../../domain/playground/engine'
import { goalStatus } from '../../domain/playground/insights'
import { yearRecap } from '../../domain/playground/recap'
import { rebalance } from '../../domain/playground/rebalance'
import { assetName } from './shared'
import styles from './Playground.module.css'

/** The goal's sentence, with its numbers (shared by the card and the season summary). */
export function goalText(t: ReturnType<typeof useTranslation>['t'], goal: GoalId) {
  return t(`pg_goal_${goal}` as 'pg_goal_steady', { pct: Math.round(GOALS.steadyMaxFall * 100), amount: moneyText(GOALS.incomeTarget) })
}

/** Season goal: pick one of three habits to practise; the card then says whether it is on track. */
export function GoalCard({ state, onGoal }: { state: PlaygroundState; onGoal: (goal: GoalId | null) => void }) {
  const { t } = useTranslation()
  const status = goalStatus(state)
  return (
    <section className={styles.autoCard} aria-labelledby="goal-title">
      <h2 id="goal-title" className={styles.autoTitle}>
        {t('pg_goal_title')}
      </h2>
      <p className={styles.muted}>{t('pg_goal_sub')}</p>
      <div className={styles.goalChips} role="group" aria-label={t('pg_goal_title')}>
        {GOAL_IDS.map((g) => (
          <button key={g} type="button" aria-pressed={state.goal === g} onClick={() => onGoal(state.goal === g ? null : g)}>
            {goalText(t, g)}
          </button>
        ))}
      </div>
      {status && state.status !== 'idle' && (
        <p className={status.met ? styles.goalOn : styles.goalOff}>
          <Icon name={status.met ? 'check' : 'alert'} size={18} /> {t(status.met ? 'pg_goal_on_track' : 'pg_goal_not_yet')}
        </p>
      )}
    </section>
  )
}

/** One-tap rebalancing to an example mix: a preview of the trades and fees, then confirm. */
export function RebalanceSheet({ state, onClose, onConfirm }: { state: PlaygroundState; onClose: () => void; onConfirm: (mix: MixId) => void }) {
  const { t } = useTranslation()
  const [mix, setMix] = useState<MixId>('balanced')
  const preview = rebalance(state, MIXES[mix])
  const parts = (m: MixId) =>
    Object.entries(MIXES[m])
      .map(([id, share]) => `${Math.round((share ?? 0) * 100)}% ${assetName(t, id as AssetId)}`)
      .join(' · ')
  return (
    <div className={styles.scrim} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <BottomSheet>
          <div className={styles.grab} aria-hidden />
          <h2 className={styles.sheetTitle}>{t('pg_rebalance_title')}</h2>
          <p className={styles.note}>{t('pg_rebalance_sub')}</p>
          <div className={styles.assetList} role="radiogroup" aria-label={t('pg_rebalance_title')}>
            {MIX_IDS.map((m) => (
              <button key={m} type="button" role="radio" aria-checked={mix === m} className={`${styles.assetRow} ${mix === m ? styles.assetOn : ''}`} onClick={() => setMix(m)}>
                <span className={styles.assetText}>
                  <strong>{t(`pg_mix_${m}`)}</strong>
                  <small>{parts(m)}</small>
                </span>
              </button>
            ))}
          </div>
          <p className={styles.note} aria-live="polite">
            {preview.trades.length ? t('pg_rebalance_preview', { count: preview.trades.length, fee: moneyText(preview.fees) }) : t('pg_rebalance_none')}
          </p>
          <div className={styles.sheetActions}>
            <Button disabled={preview.trades.length === 0} onClick={() => onConfirm(mix)}>
              {t('pg_rebalance_confirm')}
            </Button>
          </div>
          <p className={styles.fine}>{t('pg_play_money_not_advice')}</p>
        </BottomSheet>
      </div>
    </div>
  )
}

/** The end of a simulated year: how the money did, the year's news, the market and prices. Never advice. */
export function RecapOverlay({ state, year, onContinue }: { state: PlaygroundState; year: number; onContinue: () => void }) {
  const { t } = useTranslation()
  const r = yearRecap(state, year)
  const change = r.start > 0 ? (r.end / r.start - 1) * 100 : 0
  return (
    <div className={styles.news} role="dialog" aria-modal="true" aria-labelledby="recap-title">
      <header className={styles.newsTop}>
        <span>{t('pg_year_n', { n: year })}</span>
      </header>
      <div className={styles.newsCard}>
        <p className={styles.kicker}>{t('pg_recap_kicker')}</p>
        <h1 id="recap-title">{t('pg_recap_title', { n: year })}</h1>
        <dl className={styles.lines}>
          <div>
            <dt>{t('pg_recap_money')}</dt>
            <dd>
              {/* From → to reads left to right in every language, like the money itself */}
              <bdi dir="ltr">
                <Money amount={r.start} /> → <Money amount={r.end} />
              </bdi>{' '}
              <Change percent={change} />
            </dd>
          </div>
          <div>
            <dt>{t('pg_recap_us500')}</dt>
            <dd>
              <Change percent={r.us500 * 100} />
            </dd>
          </div>
          <div>
            <dt>{t('pg_recap_prices')}</dt>
            <dd>{t('pg_recap_prices_value', { pct: (r.inflation * 100).toFixed(1) })}</dd>
          </div>
        </dl>
        <p className={styles.newsBody}>
          {r.news.length ? t('pg_recap_news', { list: r.news.map((id) => t(`pg_event_${id}_title`)).join(' · ') }) : t('pg_recap_quiet')}
        </p>
      </div>
      <div className={styles.newsGuide}>
        <Guide pose={change >= 0 ? 'cheer' : 'think'} height={130} />
        <p className={styles.bubble}>{t('pg_recap_bubble')}</p>
      </div>
      <div className={styles.newsFoot}>
        <Button onClick={onContinue} autoFocus>
          {t('continue')}
        </Button>
      </div>
    </div>
  )
}
