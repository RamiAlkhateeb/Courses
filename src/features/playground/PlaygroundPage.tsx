import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AbuShreek, Button, Icon, type IconName } from '../../components/ui'
import { Change } from '../../components/Change'
import { Money } from '../../components/Money'
import { moneyText } from '../../i18n'
import { ASSETS, ASSET_IDS, type AssetId } from '../../domain/playground/config'
import { gain, marketOf, maxDrawdown, netWorth, realHistory, valueOf, type Speed } from '../../domain/playground/engine'
import { EVENTS } from '../../domain/playground/events'
import { useProgress } from '../../state/useProgress'
import { usePlayground, usePlaygroundClock } from '../../state/usePlayground'
import { assetName, ASSET_DOT, riskWord, yearOf } from './shared'
import { Chart } from './Chart'
import { NewsOverlay, PausedOverlay } from './Overlays'
import { TradeSheet } from './TradeSheet'
import styles from './Playground.module.css'

const SPEEDS: { speed: Speed; icon: IconName; key: 'pg_pause' | 'pg_speed_1' | 'pg_speed_2' | 'pg_speed_4' }[] = [
  { speed: 0, icon: 'pause', key: 'pg_pause' },
  { speed: 1, icon: 'play', key: 'pg_speed_1' },
  { speed: 2, icon: 'fast', key: 'pg_speed_2' },
  { speed: 4, icon: 'faster', key: 'pg_speed_4' },
]

/** The Playground tab (designs 23, 27, 30): net worth, the chart, the clock, what you hold, and Buy or sell. */
export function PlaygroundPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const pg = usePlayground()
  const { state, unlocked } = pg
  const [sheet, setSheet] = useState<{ asset?: AssetId; side?: 'buy' | 'sell' } | null>(null)
  const [reading, setReading] = useState(false)
  const clock = usePlaygroundClock(state, sheet !== null)
  useProgress() // keeps the bank-dependent screens fresh

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

  const chartLabel = running
    ? t('pg_chart_alt', { year, now: moneyText(net), start: moneyText(state.funded), real: moneyText(real[real.length - 1] ?? net), worst: Math.round(worst.fall * 100) })
    : t('pg_chart_empty')

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1>{t('pg_title')}</h1>
        <Button variant="ink" size="sm" onClick={() => navigate('/playground/fund')}>
          <Icon name="plus" size={18} /> {t('pg_add_funds')}
        </Button>
      </header>

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
        {running && (
          <Link to="/playground/risk" className={styles.riskLink}>
            {t('pg_risk_check')} ›
          </Link>
        )}
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
          <span>{t('pg_market_news_strip', { title: t(`pg_event_${EVENTS[latest.id].id}_title`) })}</span>
          <Icon name="chevron" size={18} />
        </button>
      )}

      <div className={styles.speed}>
        <span className={styles.speedBtns} role="group" aria-label={t('pg_speed')}>
          {SPEEDS.map((s) => (
            <button
              key={s.speed}
              type="button"
              aria-pressed={state.status === 'running' && state.speed === s.speed}
              aria-label={t(s.key)}
              disabled={state.status !== 'running'}
              onClick={() => pg.setSpeed(s.speed)}
            >
              <Icon name={s.icon} size={s.speed === 0 ? 20 : 22} />
            </button>
          ))}
        </span>
        <span className={styles.muted}>{t('pg_years_per_minute', { count: state.status === 'running' && state.speed ? state.speed : 1 })}</span>
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
          <Button
            onClick={() => {
              pg.cashOut()
            }}
          >
            {t('pg_cash_out')}
          </Button>
        </div>
      )}

      {empty && (
        <div className={styles.emptyCard}>
          <div className={styles.emptyRow}>
            <AbuShreek pose="point" height={110} />
            <p className={styles.bubble}>{state.cash > 0 ? t('pg_empty_bubble') : t('pg_unfunded_bubble')}</p>
          </div>
          {state.cash <= 0 ? (
            <Button onClick={() => navigate('/playground/fund')}>{t('pg_fund_cta')}</Button>
          ) : unlocked.includes('savings') ? (
            <Button onClick={() => setSheet({ asset: 'savings', side: 'buy' })}>{t('pg_buy_safe')}</Button>
          ) : (
            <Button variant="secondary" onClick={() => navigate('/')}>
              {t('pg_unlock_first')}
            </Button>
          )}
        </div>
      )}

      <p className={styles.fine}>{t('pg_play_money_simulated')}</p>

      {state.status !== 'ended' && !empty && (
        <div className={styles.dock}>
          <AbuShreek pose="think" height={96} className={styles.dockMascot} />
          <Button disabled={state.cash <= 0 && holdings.length === 0} onClick={() => setSheet({})}>
            <Icon name="plus" size={20} /> {t('pg_buy_or_sell')}
          </Button>
        </div>
      )}

      {sheet && (
        <TradeSheet
          state={state}
          unlocked={unlocked}
          initial={sheet.asset}
          side={sheet.side}
          onClose={() => setSheet(null)}
          onBuy={(asset, amount) => {
            const r = pg.buy(asset, amount)
            if (r.ok) navigate('/playground/debrief', { state: r.trade })
          }}
          onSell={(asset, amount) => {
            const r = pg.sell(asset, amount)
            if (r.ok) navigate('/playground/debrief', { state: r.trade })
          }}
        />
      )}

      {(state.pendingEvent || reading) && (
        <NewsOverlay
          id={state.pendingEvent ?? latest!.id}
          year={state.pendingEvent ? year : yearOf(latest!.tick)}
          paused={!!state.pendingEvent}
          onContinue={() => {
            if (state.pendingEvent) pg.dismissEvent()
            setReading(false)
          }}
        />
      )}

      {clock.away && !state.pendingEvent && <PausedOverlay year={year} net={net} speed={state.speed || 1} onResume={clock.resume} onStay={clock.stayPaused} />}
    </div>
  )
}
