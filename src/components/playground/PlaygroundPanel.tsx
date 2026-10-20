import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Guide, Button, Icon } from '../ui'
import { Change } from '../Change'
import { Money } from '../Money'
import { moneyText } from '../../i18n'
import { ASSETS, ASSET_IDS, type AssetId } from '../../domain/playground/config'
import { benchmark, gain, marketOf, maxDrawdown, msToNextWeek, netWorth, nextNews, realHistory, valueOf } from '../../domain/playground/engine'
import { EVENTS } from '../../domain/playground/events'
import { usePlayground } from '../../state/usePlayground'
import { assetName, ASSET_DOT, riskWord, weekOf, yearOf } from './shared'
import { Chart } from './Chart'
import { AllocationRing } from './AllocationRing'
import { allocation } from '../../domain/playground/risk'
import { AutoInvestCard } from './AutoInvest'
import { GoalCard, RebalanceSheet, RecapOverlay } from './SeasonExtras'
import { pendingRecap } from '../../domain/playground/recap'
import { NewsOverlay } from './Overlays'
import { TradeSheet } from './TradeSheet'
import styles from './Playground.module.css'

const MINUTE = 60_000

/** The current time, refreshed every 30 seconds: enough for "next update in N min" (the season clock is in AppFrame). */
function useNow() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

/** The live market simulator, shown inside practice lessons: net worth, the chart, the season's time, the mix, what you
 *  hold, Buy or sell, the goal and auto-invest, and the news and yearly recap overlays. Time follows the real clock (one
 *  real day = one year) and never stops; there are no play or speed controls. */
export function PlaygroundPanel({ toolsOpenAtStart = false }: { toolsOpenAtStart?: boolean } = {}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const pg = usePlayground()
  const { state } = pg
  const [sheet, setSheet] = useState<{ asset?: AssetId; side?: 'buy' | 'sell' } | null>(null)
  const [reading, setReading] = useState(false)
  const [compare, setCompare] = useState<'none' | 'savings' | 'us500'>('none')
  const [rebalancing, setRebalancing] = useState(false)
  const [explore, setExplore] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(toolsOpenAtStart)
  const now = useNow()

  const market = marketOf(state)
  const net = netWorth(state, market)
  const g = gain(state, market)
  const pct = state.funded > 0 ? (g / state.funded) * 100 : 0
  const running = state.status !== 'idle'
  const holdings = ASSET_IDS.filter((id) => state.holdings[id])
  const empty = !running && holdings.length === 0
  const seen = market.events.filter((e) => state.seenEvents.includes(e.tick))
  const latest = seen[seen.length - 1]
  const real = running ? realHistory(state, market) : []
  const worst = maxDrawdown(state.history)
  const year = yearOf(state.tick)
  const unread = nextNews(state, market)
  const recapYear = pendingRecap(state)
  const nextUpdate = Math.max(1, Math.ceil(msToNextWeek(state, now) / MINUTE))

  const compareLine = running && compare !== 'none' ? benchmark(state, compare, market) : undefined
  const compareNow = compareLine?.[compareLine.length - 1]
  const compareText =
    compare !== 'none' && compareNow !== undefined ? t('pg_compare_alt', { asset: assetName(t, compare), amount: moneyText(compareNow) }) : ''
  const chartLabel = running
    ? [
        t('pg_chart_alt', { year, now: moneyText(net), start: moneyText(state.funded), real: moneyText(real[real.length - 1] ?? net), worst: Math.round(worst.fall * 100) }),
        compareText,
      ].join(' ').trim()
    : t('pg_chart_empty')

  const shares = allocation(state)
  const shareOf = (id: AssetId) => shares.assets.find((a) => a.id === id)?.share ?? 0
  const pctText = (share: number) => `${Math.round(share * 100)}%`

  return (
    <div className={styles.panel}>
      {/* 1. How much, and how it is going, in plain words */}
      <section className={styles.summary} aria-labelledby="pf-total">
        <p className={styles.kicker} id="pf-total">
          {t('pf_your_money')}
        </p>
        <p className={styles.netWorth}>
          <Money amount={net} />
        </p>
        {running && state.funded > 0 && (
          <p className={styles.sinceStart}>
            <Change amount={g} /> <Change percent={pct} /> <span>{t('pf_since_start')}</span>
          </p>
        )}
        <p className={styles.muted}>
          {state.status === 'running'
            ? `${t('pg_status_week', { year, week: weekOf(state.tick) })} · ${t('pg_next_update', { count: nextUpdate })}`
            : state.status === 'idle'
              ? t('pg_day_is_year')
              : t('pg_season_complete')}
        </p>
      </section>

      {/* 2. One line: your money over time. The extra lines are one tap away. */}
      <div className={styles.chartCard}>
        {running ? (
          <Chart
            nominal={state.history}
            real={explore ? real : undefined}
            compare={explore ? compareLine : undefined}
            start={state.funded}
            label={chartLabel}
            markers={seen.map((e) => e.tick - state.historyStart).filter((i) => i >= 0)}
          />
        ) : (
          <div className={styles.emptyChart}>
            <Chart nominal={[net, net]} label={chartLabel} />
            <p>{t('pg_time_starts')}</p>
          </div>
        )}
        {running && (
          <button type="button" className={styles.explore} aria-expanded={explore} onClick={() => setExplore((x) => !x)}>
            <Icon name={explore ? 'minus' : 'plus'} size={16} /> {t('pf_explore')}
          </button>
        )}
        {running && explore && (
          <>
            <div className={styles.legend}>
              <span>
                <i className={styles.keyNominal} /> {t('pg_nominal')}
              </span>
              <span>
                <i className={styles.keyReal} /> {t('pg_after_inflation')}
              </span>
            </div>
            <div className={styles.compareRow} role="group" aria-label={t('pg_compare')}>
              <span>{t('pg_compare')}</span>
              {(['none', 'savings', 'us500'] as const).map((c) => (
                <button key={c} type="button" aria-pressed={compare === c} onClick={() => setCompare(c)}>
                  {t(`pg_compare_${c}`)}
                </button>
              ))}
            </div>
            {compareText && (
              <p className={styles.compareText} aria-live="polite">
                <i className={styles.keyCompare} aria-hidden /> {compareText}
              </p>
            )}
          </>
        )}
      </div>

      {latest && (
        <button type="button" className={styles.newsStrip} onClick={() => setReading(true)}>
          <i className={styles.newsDot} />
          <span>
            {state.newsQueue.length > 0
              ? t('pg_news_unread', { count: state.newsQueue.length })
              : t('pg_market_news_strip', { title: t(`pg_event_${EVENTS[latest.id].id}_title`) })}
          </span>
          <Icon name="chevron" size={18} />
        </button>
      )}

      {/* 3. The one main action */}
      {state.status === 'running' && (
        <Button disabled={state.cash <= 0 && holdings.length === 0} onClick={() => setSheet({})}>
          <Icon name="plus" size={20} /> {t('pg_buy_or_sell')}
        </Button>
      )}

      {/* 4. What you own: each holding's value, its share of the total and how it has done; cash last */}
      {running && (
        <section className={styles.ownCard} aria-labelledby="pf-own">
          <div className={styles.ownHead}>
            <h2 id="pf-own">{t('pf_what_you_own')}</h2>
            <AllocationRing state={state} />
          </div>
          <ul className={styles.holdings}>
            {holdings.map((id) => {
              const h = state.holdings[id]!
              const v = valueOf(state, id, market)
              const change = h.cost > 0 ? (v / h.cost - 1) * 100 : 0
              return (
                <li key={id}>
                  <button type="button" className={styles.holding} onClick={() => setSheet({ asset: id, side: 'sell' })}>
                    <span className={styles.dot} style={{ background: ASSET_DOT[id] }} />
                    <span className={styles.assetText}>
                      <strong>{assetName(t, id, true)}</strong>
                      <small>
                        {t('pf_share', { pct: pctText(shareOf(id)) })} · {riskWord(t, ASSETS[id].risk)}
                      </small>
                    </span>
                    <span className={styles.holdValue}>
                      <Money amount={v} />
                      <Change percent={change} />
                    </span>
                  </button>
                </li>
              )
            })}
            <li className={styles.holding}>
              <span className={styles.dot} style={{ background: ASSET_DOT.cash }} />
              <span className={styles.assetText}>
                <strong>{t('pg_cash')}</strong>
                <small>
                  {t('pf_share', { pct: pctText(shares.cash.share) })} · {t('pg_ready_to_invest')}
                </small>
              </span>
              <span className={styles.holdValue}>
                <Money amount={state.cash} />
              </span>
            </li>
          </ul>
        </section>
      )}

      {state.status === 'ended' && (
        <div className={styles.endCard}>
          <h2>{t('pg_season_complete')}</h2>
          <p>{t('pg_season_complete_body', { amount: moneyText(net) })}</p>
          <Button onClick={() => navigate('/playground/summary')}>{t('pg_see_summary')}</Button>
          <Button variant="secondary" onClick={() => pg.cashOut()}>
            {t('pg_cash_out')}
          </Button>
        </div>
      )}

      {empty && (
        <div className={styles.emptyCard}>
          <div className={styles.emptyRow}>
            <Guide pose="point" height={110} />
            <p className={styles.bubble}>{t('pg_empty_bubble')}</p>
          </div>
          <Button onClick={() => setSheet({ asset: 'savings', side: 'buy' })} disabled={state.cash <= 0}>
            {t('pg_buy_safe')}
          </Button>
        </div>
      )}

      {/* 5. Everything else, folded away until wanted (a practice lesson opens the tool its task needs) */}
      {state.status !== 'ended' && (
        <section className={styles.tools}>
          <button type="button" className={styles.toolsToggle} aria-expanded={toolsOpen} onClick={() => setToolsOpen((o) => !o)}>
            <span>
              <strong>{t('pf_more_tools')}</strong>
              <small>{t('pf_more_tools_sub')}</small>
            </span>
            <Icon name="chevronDown" size={20} className={toolsOpen ? styles.flipUp : undefined} />
          </button>
          {toolsOpen && (
            <div className={styles.toolsBody}>
              {state.status === 'running' && holdings.length > 0 && (
                <section className={styles.autoCard} aria-labelledby="pf-rebalance">
                  <div className={styles.autoHead}>
                    <div>
                      <h2 id="pf-rebalance" className={styles.autoTitle}>
                        {t('pg_rebalance')}
                      </h2>
                      <p className={styles.muted}>{t('pf_rebalance_sub')}</p>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setRebalancing(true)}>
                      {t('pf_rebalance_open')}
                    </Button>
                  </div>
                </section>
              )}
              <GoalCard state={state} onGoal={pg.setGoal} />
              <AutoInvestCard state={state} onAutoInvest={pg.setAutoInvest} onReinvest={pg.setReinvest} />
            </div>
          )}
        </section>
      )}

      <p className={styles.fine}>{t('pg_play_money_simulated')}</p>
      <p className={styles.fine}>{t('educationalOnly')}</p>

      {sheet && (
        <TradeSheet
          state={state}
          initial={sheet.asset}
          side={sheet.side}
          onClose={() => setSheet(null)}
          onBuy={(asset, amount) => pg.buy(asset, amount).ok && setSheet(null)}
          onSell={(asset, amount) => pg.sell(asset, amount).ok && setSheet(null)}
        />
      )}

      {rebalancing && (
        <RebalanceSheet
          state={state}
          onClose={() => setRebalancing(false)}
          onConfirm={(mix) => {
            pg.rebalance(mix)
            setRebalancing(false)
          }}
        />
      )}

      {/* After the news, a finished year's recap (once; years that passed while away show as the latest one) */}
      {!sheet && !rebalancing && !unread && !reading && recapYear !== null && (
        <RecapOverlay state={state} year={recapYear} onContinue={pg.seeRecap} />
      )}

      {/* Unread news opens by itself, one story at a time; time keeps running meanwhile. The strip re-opens the latest. */}
      {!sheet && (unread || (reading && latest)) && (
        <NewsOverlay
          id={(unread ?? latest)!.id}
          year={yearOf((unread ?? latest)!.tick)}
          onContinue={() => {
            if (unread) pg.readNews()
            else setReading(false)
          }}
        />
      )}

    </div>
  )
}
