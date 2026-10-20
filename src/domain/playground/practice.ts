// Practice lessons: each module ends with a hands-on task in the live simulator. These are the checks that say a task
// is done, read from the Playground state alone (pure, so the lesson and the tests agree).
import type { PracticeTask } from '../../content/types'
import { ASSETS, MIXES, MIX_IDS, type AssetId } from './config'
import type { PlaygroundState } from './engine'
import { allocation } from './risk'

export const PRACTICE_TASKS: PracticeTask[] = ['first-buy', 'spread', 'rebalance', 'income', 'auto', 'goal']

/** How close the holdings must be to an example mix (in share of net worth) to count as rebalanced. */
const MIX_TOLERANCE = 0.05

const held = (s: PlaygroundState) => (Object.keys(s.holdings) as AssetId[]).filter((id) => (s.holdings[id]?.units ?? 0) > 0)
const paysOut = (id: AssetId) => id === 'bonds' || (ASSETS[id].yield ?? 0) > 0

/** Is the practice task done in this Playground? */
export function practiceDone(task: PracticeTask, s: PlaygroundState): boolean {
  switch (task) {
    case 'first-buy':
      return s.status !== 'idle'
    case 'spread':
      return held(s).length >= 3
    case 'rebalance': {
      if (s.status === 'idle') return false
      const a = allocation(s)
      const share = (id: AssetId) => a.assets.find((x) => x.id === id)?.share ?? 0
      return MIX_IDS.some((m) => {
        const mix = MIXES[m]
        const ids = new Set<AssetId>([...held(s), ...(Object.keys(mix) as AssetId[])])
        return [...ids].every((id) => Math.abs(share(id) - (mix[id] ?? 0)) <= MIX_TOLERANCE)
      })
    }
    case 'income':
      return held(s).some(paysOut)
    case 'auto':
      return s.autoInvest !== null
    case 'goal':
      return s.goal !== null
  }
}
