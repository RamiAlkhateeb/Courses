import { ASSET_IDS, CONFIG, MISSIONS, MISSION_IDS, type AssetId, type Habit, type MissionId } from './config'
import { marketOf, maxDrawdown, realHistory, type PlaygroundState, type Trade } from './engine'
import { biggestBet } from './risk'

export const missionsUnlocked = (lessonsDone: number): MissionId[] => MISSION_IDS.filter((id) => lessonsDone >= MISSIONS[id].unlockAfterLessons)

/** Units held of each asset just after the trades up to and including week `tick` (replayed from the trade list). */
export function unitsAt(trades: Trade[], tick: number): Partial<Record<AssetId, number>> {
  const units: Partial<Record<AssetId, number>> = {}
  for (const t of trades) {
    if (t.tick > tick) break
    const u = t.amount / t.price
    units[t.asset] = Math.max(0, (units[t.asset] ?? 0) + (t.side === 'buy' ? u : -u))
  }
  return units
}

const held = (units: Partial<Record<AssetId, number>>) => ASSET_IDS.filter((id) => (units[id] ?? 0) > 1e-9)

/** Held three or more kinds of asset at once, at any point in the season. */
export function wasSpread(trades: Trade[]): boolean {
  const units: Partial<Record<AssetId, number>> = {}
  for (const t of trades) {
    const u = t.amount / t.price
    units[t.asset] = Math.max(0, (units[t.asset] ?? 0) + (t.side === 'buy' ? u : -u))
    if (held(units).length >= 3) return true // after each trade, not each week: several trades can share a week
  }
  return false
}

/** Was invested at the moment every piece of news landed (and the season had some). */
export function stayedThroughNews(s: PlaygroundState): boolean {
  const seen = marketOf(s).events.filter((e) => e.tick <= s.tick)
  return seen.length > 0 && seen.every((e) => held(unitsAt(s.trades, e.tick)).length > 0)
}

/** The season finished with more than it started with, in the dollars of its first week. */
export function beatInflation(s: PlaygroundState): boolean {
  const real = realHistory(s)
  return s.funded > 0 && real.length > 0 && real[real.length - 1] > s.funded
}

/** Which of the picked missions the season meets (judged on the whole season; live while it runs). */
export function metMissions(s: PlaygroundState): MissionId[] {
  return s.missions.filter((id) => (id === 'beat-inflation' ? beatInflation(s) : id === 'rate-rise' ? stayedThroughNews(s) : wasSpread(s.trades)))
}

export interface Insight {
  /** Translation key suffix (`pg_insight_<key>`) and its numbers */
  key: string
  vars?: Record<string, number>
}

/** Sold within this many weeks before the low point of the worst fall: selling into the dip. */
const DIP_WINDOW = 26
const BIG_BET = 0.7

/** What helped and what hurt in a finished season, from the trades alone: habits and costs, never "you should have". */
export function insights(s: PlaygroundState): { helped: Insight[]; hurt: Insight[]; habit: Habit } {
  const helped: Insight[] = []
  const hurt: Insight[] = []
  const worst = maxDrawdown(s.history, s.historyStart)
  const dip = worst.fall >= 0.05
  const soldIntoDip = dip && s.trades.some((t) => t.side === 'sell' && t.tick >= worst.tick - DIP_WINDOW && t.tick <= worst.tick)
  const year = Math.min(CONFIG.seasonYears, Math.floor(worst.tick / CONFIG.weeksPerYear) + 1)
  if (dip && !soldIntoDip) helped.push({ key: 'stayed', vars: { year } })
  if (wasSpread(s.trades)) helped.push({ key: 'spread' })
  if (beatInflation(s)) helped.push({ key: 'beat' })
  if (soldIntoDip) hurt.push({ key: 'sold_dip', vars: { year } })
  if (s.fees > 0) hurt.push({ key: 'fees', vars: { n: s.trades.length, fee: Math.round(s.fees) } })
  const bet = biggestBet(s)
  if (bet && bet.share >= BIG_BET && bet.id !== 'savings') hurt.push({ key: 'big_bet', vars: { pct: Math.round(bet.share * 100) } })
  if (s.funded > 0 && !beatInflation(s)) hurt.push({ key: 'behind' })
  const habit: Habit = helped.some((i) => i.key === 'stayed') ? 'stayed' : helped.some((i) => i.key === 'spread') ? 'spread' : helped.some((i) => i.key === 'beat') ? 'beat' : ''
  return { helped: helped.slice(0, 3), hurt: hurt.slice(0, 3), habit }
}

