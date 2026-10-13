import { ASSET_IDS, type AssetId } from './config'
import { marketOf, netWorth, valueOf, type PlaygroundState } from './engine'

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

/** The biggest single bet: the holding with the largest share of the net worth. */
export function biggestBet(s: PlaygroundState): { id: AssetId; share: number } | null {
  const top = [...allocation(s).assets].sort((x, y) => y.share - x.share)[0]
  return top ? { id: top.id, share: top.share } : null
}
