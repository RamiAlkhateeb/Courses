import { ASSET_IDS, ASSETS, CONFIG, type AssetId } from './config'
import { cents, marketOf, netWorth, valueOf, type PlaygroundState } from './engine'

export interface Allocation {
  /** Dollars and share (0–1) of the Playground's net worth, cash included */
  cash: { value: number; share: number }
  assets: { id: AssetId; value: number; share: number }[]
}

export function allocation(s: PlaygroundState): Allocation {
  const market = marketOf(s)
  const total = netWorth(s, market) || 1
  return {
    cash: { value: s.cash, share: s.cash / total },
    assets: ASSET_IDS.map((id) => {
      const value = valueOf(s, id, market)
      return { id, value, share: value / total }
    }).filter((a) => a.value > 0),
  }
}

/** The portfolio's risk, 1–5: each holding's risk weighted by its share; cash counts as no risk (but never below 1). */
export function riskLevel(s: PlaygroundState): 1 | 2 | 3 | 4 | 5 {
  const a = allocation(s)
  const weighted = a.assets.reduce((n, x) => n + ASSETS[x.id].risk * x.share, 0)
  return Math.min(5, Math.max(1, Math.round(weighted))) as 1 | 2 | 3 | 4 | 5
}

/** The biggest single bet: the holding with the largest share of the net worth. */
export function biggestBet(s: PlaygroundState): { id: AssetId; share: number } | null {
  const top = [...allocation(s).assets].sort((x, y) => y.share - x.share)[0]
  return top ? { id: top.id, share: top.share } : null
}

/** "If a bad year hits": what the stress shocks (funds −20%, single companies −40%, bonds −5%) would take away. */
export function stressLoss(s: PlaygroundState): number {
  const market = marketOf(s)
  return cents(-ASSET_IDS.reduce((n, id) => n + valueOf(s, id, market) * Math.min(0, CONFIG.stress[id]), 0))
}
