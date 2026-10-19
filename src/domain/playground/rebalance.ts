import { ASSET_IDS, type AssetId } from './config'
import { buy, cents, feeFor, marketOf, maxBuy, netWorth, sell, valueOf, type PlaygroundState, type Trade } from './engine'

/** Trades smaller than this are skipped: a $0.40 trade is all fee. */
const MIN_TRADE = 1

export interface Rebalanced {
  state: PlaygroundState
  trades: Trade[]
  fees: number
}

/** Bring the holdings back to `target` (shares of net worth, summing to 1 or less): sell what is over, then buy what is
 *  under with the cash that frees up. Holdings not in the target are sold. Every trade pays the usual 1% fee, so the
 *  result is close to the target, not exact. Only while a season runs. Pure: the preview and the real thing match. */
export function rebalance(s: PlaygroundState, target: Partial<Record<AssetId, number>>): Rebalanced {
  if (s.status !== 'running') return { state: s, trades: [], fees: 0 }
  const market = marketOf(s)
  const total = netWorth(s, market)
  let state = s
  const trades: Trade[] = []
  const desired = (id: AssetId) => total * (target[id] ?? 0)

  for (const id of ASSET_IDS) {
    const over = valueOf(state, id, market) - desired(id)
    if (over >= MIN_TRADE) {
      const r = sell(state, id, over)
      if (r.ok) {
        state = r.state
        trades.push(r.trade)
      }
    }
  }
  const needs = ASSET_IDS.map((id) => ({ id, need: desired(id) - valueOf(state, id, market) })).filter((n) => n.need >= MIN_TRADE)
  const wanted = needs.reduce((a, n) => a + n.need, 0)
  const scale = wanted > 0 ? Math.min(1, maxBuy(state.cash) / wanted) : 0
  for (const { id, need } of needs) {
    const amount = Math.floor(need * scale * 100) / 100
    if (amount < MIN_TRADE || amount + feeFor(amount) > state.cash + 1e-9) continue
    const r = buy(state, id, amount, 0)
    if (r.ok) {
      state = r.state
      trades.push(r.trade)
    }
  }
  return { state, trades, fees: cents(trades.reduce((a, t) => a + t.fee, 0)) }
}
