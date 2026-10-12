import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AbuShreek, Button, Icon } from '../../components/ui'
import { Money } from '../../components/Money'
import { moneyText } from '../../i18n'
import { CONFIG, MISSIONS, MISSION_IDS, type Habit, type MissionId } from '../../domain/playground/config'
import { gain, marketOf, netWorth, realHistory, type SeasonResult } from '../../domain/playground/engine'
import { insights, metMissions } from '../../domain/playground/missions'
import { rewind, rewindSeries } from '../../domain/playground/rewind'
import { usePlayground } from '../../state/usePlayground'
import { Chart } from './Chart'
import { yearOf } from './shared'
import styles from './Playground.module.css'

const BackButton = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label={t('back')}>
      <Icon name="back" size={26} />
    </button>
  )
}

const kicker = (t: ReturnType<typeof useTranslation>['t'], season: number, years: number) => t('pg_season_kicker', { n: season, years: t('pg_years_n', { count: years }) })

/** Design 29: "Pick your missions": goals from your lessons for the next season. No rankings, just you against inflation. */
export function MissionsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const pg = usePlayground()
  const { state, lessons } = pg
  const idle = state.status === 'idle'
  const toggle = (id: MissionId) => pg.setMissions(state.missions.includes(id) ? state.missions.filter((m) => m !== id) : [...state.missions, id])

  return (
    <div className={styles.pageFull}>
      <div className={styles.topLinks}>
        <BackButton />
        <button type="button" className={styles.linkBtn} onClick={() => navigate('/playground/seasons')}>
          {t('pg_past_seasons')} ›
        </button>
      </div>
      <p className={styles.kicker}>
        {kicker(t, state.season, CONFIG.seasonYears)} · {t('pg_about_minutes', { count: CONFIG.seasonYears })}
      </p>
      <h1 className={styles.bigTitle}>{t('pg_missions_title')}</h1>
      <p className={styles.sub}>{t('pg_missions_sub')}</p>
      <ul className={styles.missions}>
        {MISSION_IDS.map((id) => {
          const open = lessons >= MISSIONS[id].unlockAfterLessons
          const on = state.missions.includes(id)
          return (
            <li key={id}>
              <button type="button" disabled={!open || !idle} aria-pressed={on} className={`${styles.mission} ${on ? styles.missionOn : ''} ${open ? '' : styles.assetLocked}`} onClick={() => toggle(id)}>
                <span className={styles.missionIcon}>
                  <Icon name={open ? (on ? 'check' : 'flag') : 'lock'} size={26} />
                </span>
                <span className={styles.assetText}>
                  <strong>{t(`pg_mission_${id}`)}</strong>
                  <small>{t(`pg_mission_${id}_desc`)}</small>
                  <span className={styles.badge}>{open ? t(`pg_mission_${id}_lesson`) : t('pg_unlocks_after', { n: MISSIONS[id].unlockAfterLessons })}</span>
                </span>
                <strong className={styles.score}>{on && state.status !== 'idle' ? `${metMissions(state).includes(id) ? 1 : 0} / 1` : '0 / 1'}</strong>
              </button>
            </li>
          )
        })}
      </ul>
      <button type="button" className={styles.wide} onClick={() => navigate('/playground/unlocks')}>
        <strong>{t('pg_what_unlocks')}</strong>
        <Icon name="chevron" size={20} />
      </button>
      <div className={styles.foot}>
        <p className={styles.fine}>{t('pg_play_money_simulated')} · {t('pg_not_advice')}</p>
        <Button onClick={() => navigate('/playground')}>{t('pg_start_season')}</Button>
      </div>
    </div>
  )
}

/** Designs 26 and 40: "Season complete": start vs end, after inflation, what helped, what hurt, missions. */
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
  const met = metMissions(s)
  const text = (i: { key: string; vars?: Record<string, number> }) => {
    const vars: Record<string, unknown> = { ...i.vars }
    if (i.key === 'fees') {
      return t('pg_insight_fees', { count: i.vars!.n, fee: moneyText(i.vars!.fee) })
    }
    return t(`pg_insight_${i.key}` as 'pg_insight_stayed', vars)
  }

  return (
    <div className={`${styles.pageFull} ${styles.summaryPage}`}>
      <p className={`${styles.kicker} ${styles.centre}`}>{kicker(t, s.season, CONFIG.seasonYears)}</p>
      <h1 className={`${styles.bigTitle} ${styles.centre}`}>{t('pg_season_complete')}</h1>
      <div className={styles.summaryMascot}>
        <AbuShreek pose={up ? 'cheer' : 'oops'} height={220} />
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
      {s.missions.length > 0 && (
        <>
          <h2 className={styles.kicker}>{t('pg_missions')}</h2>
          <ul className={styles.insightList}>
            {s.missions.map((id) => (
              <li key={id}>
                <Icon name={met.includes(id) ? 'check' : 'close'} size={20} className={met.includes(id) ? styles.upText : styles.downText} />
                <span>
                  {t(`pg_mission_${id}`)} · {met.includes(id) ? t('pg_mission_met') : t('pg_mission_missed')}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className={styles.summaryFoot}>
        <p className={styles.fine}>{t('pg_simulated_results')}</p>
        <Button
          onClick={() => {
            pg.cashOut()
            navigate('/playground/missions', { replace: true })
          }}
        >
          {t('pg_play_again')}
        </Button>
        <div className={styles.twoCol}>
          <Button variant="secondary" className={styles.dawnBtn} onClick={() => navigate('/playground/rewind')}>
            {t('pg_what_if_waited_short')}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            {t('backToPath')}
          </Button>
        </div>
      </div>
    </div>
  )
}

interface Replay {
  season: number
  seed: number
  eventsOn: boolean
  funded: number
  ended: number
  trades: number
  fees: number
  history: number[]
}

/** Design 35: "What if you had waited?": the same season, one index-fund buy held to the end, next to your own. */
export function RewindPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const pg = usePlayground()
  const [params] = useSearchParams()
  const wanted = Number(params.get('season'))
  const s = pg.state
  const past: SeasonResult | undefined = wanted ? s.past.find((p) => p.season === wanted) : undefined
  let replay: Replay | undefined
  if (past) replay = { season: past.season, seed: past.seed, eventsOn: past.eventsOn, funded: past.funded, ended: past.ended, trades: past.trades, fees: past.fees, history: past.history }
  else if (s.status === 'ended') replay = { season: s.season, seed: s.seed, eventsOn: s.eventsOn, funded: s.funded, ended: netWorth(s), trades: s.trades.length, fees: s.fees, history: s.history }
  else {
    const last = s.past[s.past.length - 1]
    if (last) replay = { season: last.season, seed: last.seed, eventsOn: last.eventsOn, funded: last.funded, ended: last.ended, trades: last.trades, fees: last.fees, history: last.history }
  }
  if (!replay || replay.funded <= 0) return <Navigate to="/playground" replace />

  const hold = rewind(replay.seed, replay.eventsOn, replay.funded)
  const line = rewindSeries(replay.seed, replay.eventsOn, replay.funded)
  const diff = Math.round(hold.ended - replay.ended)
  const top = Math.max(hold.ended, replay.ended, 1)

  return (
    <div className={styles.pageFull}>
      <BackButton />
      <p className={styles.kicker}>{t('pg_rewind_kicker', { n: replay.season })}</p>
      <h1 className={styles.bigTitle}>{t('pg_rewind_title')}</h1>
      <div className={styles.chartPlain}>
        <Chart nominal={replay.history} real={line} compareTone="green" label={t('pg_rewind_chart', { yours: moneyText(replay.ended), hold: moneyText(hold.ended) })} />
      </div>
      <div className={styles.compare}>
        <div className={styles.fundCard}>
          <div className={styles.bankRow}>
            <strong>{t('pg_your_season')}</strong>
            <strong className={styles.bankAmount}>
              <Money amount={replay.ended} />
            </strong>
          </div>
          <div className={styles.bar}>
            <span style={{ inlineSize: `${(replay.ended / top) * 100}%` }} />
          </div>
          <small className={styles.muted}>{t('pg_trades_fees', { count: replay.trades, fees: moneyText(Math.round(replay.fees)) })}</small>
        </div>
        <div className={styles.fundCard}>
          <div className={styles.bankRow}>
            <strong>{t('pg_buy_once_hold')}</strong>
            <strong className={styles.bankAmount}>
              <Money amount={hold.ended} />
            </strong>
          </div>
          <div className={`${styles.bar} ${styles.barGreen}`}>
            <span style={{ inlineSize: `${(hold.ended / top) * 100}%` }} />
          </div>
          <small className={styles.muted}>{t('pg_trades_fees', { count: 1, fees: moneyText(Math.round(hold.fees)) })}</small>
        </div>
      </div>
      <p className={styles.callout}>
        <span>{diff > 0 ? t('pg_rewind_cost', { diff: moneyText(diff) }) : t('pg_rewind_beat', { diff: moneyText(-diff) })}</span>
      </p>
      <div className={styles.emptyRow}>
        <AbuShreek pose={replay.trades > 3 ? 'oops' : 'think'} height={120} />
        <p className={styles.bubble}>{replay.trades > 3 ? t('pg_rewind_bubble_busy') : t('pg_rewind_bubble_quiet')}</p>
      </div>
      <div className={styles.foot}>
        <p className={styles.fine}>{t('pg_simulated_results')}</p>
        <Button
          onClick={() => {
            if (!past && s.status === 'ended') pg.cashOut()
            navigate('/playground/missions', { replace: true })
          }}
        >
          {t('pg_try_holding')}
        </Button>
      </div>
    </div>
  )
}

const HABIT: Record<Exclude<Habit, ''>, string> = { stayed: 'pg_habit_stayed', spread: 'pg_habit_spread', beat: 'pg_habit_beat' }

/** Design 36: "Past seasons": not a leaderboard, just your own history. */
export function SeasonsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { state: s } = usePlayground()
  const market = marketOf(s)
  const live = s.status !== 'idle' && s.funded > 0
  const real = live ? realHistory(s, market) : []
  const ahead = live && (real[real.length - 1] ?? 0) > s.funded

  return (
    <div className={styles.pageFull}>
      <BackButton />
      <h1 className={styles.bigTitle}>{t('pg_past_seasons')}</h1>
      <p className={styles.sub}>{t('pg_not_leaderboard')}</p>
      <ul className={styles.seasonList}>
        {live && (
          <li className={styles.seasonCard}>
            <div className={styles.bankRow}>
              <strong>{t('pg_season_n', { n: s.season })}</strong>
              <span className={`${styles.badge} ${styles.badgeNow}`}>{s.status === 'ended' ? t('pg_complete') : t('pg_in_progress_year', { n: yearOf(s.tick) })}</span>
            </div>
            <p className={styles.fromTo}>
              <span className={styles.muted}>
                <Money amount={s.funded} />
              </span>{' '}
              <span aria-hidden>→</span>{' '}
              <strong>
                <Money amount={netWorth(s, market)} />
              </strong>
            </p>
            <small className={styles.muted}>{ahead ? t('pg_beating_so_far') : t('pg_behind_so_far')}</small>
          </li>
        )}
        {[...s.past].reverse().map((p) => (
          <li key={p.season}>
            <button type="button" className={`${styles.seasonCard} ${styles.seasonBtn}`} onClick={() => navigate(`/playground/rewind?season=${p.season}`)}>
              <div className={styles.bankRow}>
                <strong>{t('pg_season_n', { n: p.season })}</strong>
                <span className={`${styles.badge} ${styles.badgeOn}`}>{t('pg_done')}</span>
              </div>
              <p className={styles.fromTo}>
                <span className={styles.muted}>
                  <Money amount={p.funded} />
                </span>{' '}
                <span aria-hidden>→</span>{' '}
                <strong>
                  <Money amount={p.ended} />
                </strong>
              </p>
              <small className={styles.muted}>
                {p.habit
                  ? t('pg_past_line', { real: moneyText(p.endedReal), habit: t(HABIT[p.habit] as 'pg_habit_stayed') })
                  : t('pg_past_line_nohabit', { real: moneyText(p.endedReal) })}
              </small>
            </button>
          </li>
        ))}
      </ul>
      {!live && s.past.length === 0 && <p className={styles.muted}>{t('pg_no_seasons')}</p>}
      <div className={styles.emptyRow}>
        <AbuShreek pose="wave" height={120} />
        <p className={styles.bubble}>{t('pg_seasons_bubble')}</p>
      </div>
      <div className={styles.foot}>
        <Button onClick={() => navigate('/playground/missions')}>{t('pg_back_to_missions')}</Button>
      </div>
    </div>
  )
}
