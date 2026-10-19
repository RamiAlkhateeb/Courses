import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Guide, Button, Icon } from '../../components/ui'
import { Change } from '../../components/Change'
import { Money } from '../../components/Money'
import { moneyText } from '../../i18n'
import { ASSETS, ASSET_IDS, CONFIG, type AssetId } from '../../domain/playground/config'
import { gain, marketOf, maxDrawdown, msToNextWeek, netWorth, nextNews, realHistory, valueOf } from '../../domain/playground/engine'
import { EVENTS } from '../../domain/playground/events'
import { usePlayground } from '../../state/usePlayground'
import { assetName, ASSET_DOT, riskWord, weekOf, yearOf } from './shared'
import { Chart } from './Chart'
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

/** The Playground tab: net worth, the chart, the season's time, what you hold, and Buy or sell. Time follows the real
 *  clock (one real day = one year) and never stops; there are no play or speed controls. */
export function PlaygroundPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const pg = usePlayground()
  const { state } = pg
  const [sheet, setSheet] = useState<{ asset?: AssetId; side?: 'buy' | 'sell' } | null>(null)
  const [reading, setReading] = useState(false)
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
  const nextUpdate = Math.max(1, Math.ceil(msToNextWeek(state, now) / MINUTE))
  const daysLeft = Math.max(0, Math.ceil((state.startedAt + CONFIG.seasonYears * CONFIG.msPerYear - now) / (CONFIG.msPerYear)))

  const chartLabel = running
    ? t('pg_chart_alt', { year, now: moneyText(net), start: moneyText(state.funded), real: moneyText(real[real.length - 1] ?? net), worst: Math.round(worst.fall * 100) })
    : t('pg_chart_empty')

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('pg_title')}</h1>

      <div className={styles.netRow}>
        <div>
          <p className={styles.kicker}>{t('pg_net_worth')}</p>
          <p className={styles.netWorth}>
            <Money amount={net} />
            {running && state.funded > 0 && (
              <span className={styles.gain}>
                <Change amount={g} />
                <span aria-hidden> · </span>
                <Change percent={pct} />
              </span>
            )}
          </p>
        </div>
      </div>

      <div className={styles.chartCard}>
        <div className={styles.legend}>
          <span>
            <i className={styles.keyNominal} /> {t('pg_nominal')}
          </span>
          <span>
            <i className={styles.keyReal} /> {t('pg_after_inflation')}
          </span>
          <span className={styles.year}>{running ? t('pg_year_n', { n: year }) : ''}</span>
        </div>
        {running ? (
          <Chart nominal={state.history} real={real} start={state.funded} label={chartLabel} markers={seen.map((e) => e.tick - state.historyStart).filter((i) => i >= 0)} />
        ) : (
          <div className={styles.emptyChart}>
            <Chart nominal={[net, net]} label={chartLabel} />
            <p>{t('pg_time_starts')}</p>
          </div>
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

      <div className={styles.clock}>
        {state.status === 'running' ? (
          <>
            <p className={styles.clockText}>
              <strong>{t('pg_status_week', { year, week: weekOf(state.tick) })}</strong>
              <span>
                {t('pg_next_update', { count: nextUpdate })} · {t('pg_days_left', { count: daysLeft })}
              </span>
            </p>
            <Button size="sm" className={styles.buyBtn} disabled={state.cash <= 0 && holdings.length === 0} onClick={() => setSheet({})}>
              <Icon name="plus" size={18} /> {t('pg_buy_or_sell')}
            </Button>
          </>
        ) : state.status === 'idle' ? (
          <p className={styles.muted}>{t('pg_day_is_year')}</p>
        ) : null}
      </div>

      <ul className={styles.holdings}>
        <li className={styles.holding}>
          <span className={styles.dot} style={{ background: ASSET_DOT.cash }} />
          <span className={styles.assetText}>
            <strong>{t('pg_cash')}</strong>
            <small>{t('pg_ready_to_invest')}</small>
          </span>
          <span className={styles.holdValue}>
            <Money amount={state.cash} />
          </span>
        </li>
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
                  <small>{riskWord(t, ASSETS[id].risk)}</small>
                </span>
                <span className={styles.holdValue}>
                  <Money amount={v} />
                  <Change percent={change} />
                </span>
              </button>
            </li>
          )
        })}
      </ul>

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
