import { CONFIG, WEEKS_PER_SEASON } from './config'
import { buildMarket } from './market'
import { cents, feeFor, maxBuy } from './engine'

export interface Rewind {
  /** What the same money would be worth after one buy of the index fund in week 0 and no other trade */
  ended: number
  fees: number
  trades: 1
}

/** "What if I waited?": replay the same seed with a single buy-and-hold of the Broad Index Fund. */
export function rewind(seed: number, eventsOn: boolean, funded: number): Rewind {
  const market = buildMarket(seed, eventsOn)
  const amount = maxBuy(funded)
  const units = amount / market.price.index[0]
  return { ended: cents(units * market.price.index[WEEKS_PER_SEASON] + (funded - amount - feeFor(amount))), fees: feeFor(amount), trades: 1 }
}

export const feeRate = CONFIG.feeRate
