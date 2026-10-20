import { describe, expect, it } from 'vitest'
import { MIXES } from '../src/domain/playground/config'
import { buy, emptyPlayground, fund, setAutoInvest, setGoal, type PlaygroundState } from '../src/domain/playground/engine'
import { practiceDone, PRACTICE_TASKS } from '../src/domain/playground/practice'
import { rebalance } from '../src/domain/playground/rebalance'
import { hasMedia } from '../src/domain/chunks'
import { practice } from '../src/content/helpers'

const T0 = 1_760_000_000_000
const idle = fund({ ...emptyPlayground, seed: 4 }, 1000)
const bought = (s: PlaygroundState, asset: Parameters<typeof buy>[1], amount: number) => {
  const r = buy(s, asset, amount, T0)
  if (!r.ok) throw new Error(r.reason)
  return r.state
}

describe('practice lessons', () => {
  it('nothing is done in a fresh Playground', () => {
    for (const task of PRACTICE_TASKS) expect(practiceDone(task, idle)).toBe(false)
  })
  it('first buy: any investment starts the season', () => {
    expect(practiceDone('first-buy', bought(idle, 'gold', 50))).toBe(true)
  })
  it('spread: three kinds held at once', () => {
    let s = bought(bought(idle, 'savings', 50), 'bonds', 50)
    expect(practiceDone('spread', s)).toBe(false)
    s = bought(s, 'index', 50)
    expect(practiceDone('spread', s)).toBe(true)
  })
  it('rebalance: the holdings sit close to an example mix', () => {
    const s = bought(idle, 'crypto', 500)
    expect(practiceDone('rebalance', s)).toBe(false)
    expect(practiceDone('rebalance', rebalance(s, MIXES.growth).state)).toBe(true)
  })
  it('income: something that pays out is held (dividends, rent or bond interest); gold and savings do not', () => {
    expect(practiceDone('income', bought(idle, 'gold', 50))).toBe(false)
    expect(practiceDone('income', bought(idle, 'savings', 50))).toBe(false)
    expect(practiceDone('income', bought(idle, 'bonds', 50))).toBe(true)
    expect(practiceDone('income', bought(idle, 'reit', 50))).toBe(true)
  })
  it('auto-invest and goal: set up', () => {
    expect(practiceDone('auto', setAutoInvest(idle, { asset: 'index', amount: 50 }))).toBe(true)
    expect(practiceDone('goal', setGoal(idle, 'steady'))).toBe(true)
  })
  it('a practice block gets a card of its own', () => {
    expect(hasMedia([practice('spread')])).toBe(true)
  })
})
