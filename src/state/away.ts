import type { AwaySnapshot } from '../domain/playground/away'
import { snapshotOf } from '../domain/playground/away'
import { localDay } from '../domain/progress'
import { createPersistedStore } from './createPersistedStore'
import { playgroundStore } from './playground'

/** What the portfolio looked like when the player last looked (src/domain/playground/away.ts). This device only. */
function parse(raw: string | null): AwaySnapshot | null {
  try {
    const d = JSON.parse(raw ?? 'null') as Partial<AwaySnapshot> | null
    if (!d || typeof d.season !== 'number' || typeof d.tick !== 'number' || typeof d.netWorth !== 'number') return null
    return { season: d.season, tick: d.tick, netWorth: d.netWorth, income: typeof d.income === 'number' ? d.income : 0, day: typeof d.day === 'string' ? d.day : '' }
  } catch {
    return null
  }
}

export const awayStore = createPersistedStore<AwaySnapshot | null>({ key: 'away:v1', empty: null, parse })

/** The player has looked (opened the portfolio, or closed the card): remember the portfolio as it is now. `seen` marks
 *  today as done, so the card does not come back until tomorrow. */
export function lookedAtPortfolio(seen = true) {
  const s = playgroundStore.get()
  awayStore.update(() => snapshotOf(s, seen ? localDay() : ''))
}
