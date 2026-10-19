import { ASSETS, CONFIG, type AssetId } from './config'

export type EventId = 'rates-rise' | 'rates-fall' | 'recession' | 'scandal' | 'inflation' | 'boom' | 'crypto-crash'

export interface MarketEvent {
  id: EventId
  /** Added to the interest rate (annual, e.g. 0.015 = 1.5 points) and to inflation, once */
  rate: number
  inflation: number
  /** One-off price shock per asset (log return, e.g. -0.06 = about -6%); bonds also react to `rate` */
  shock: Partial<Record<AssetId, number>>
}

/** The news the Playground can throw at you. The wording is in the translations (`pg_event_<id>_*`). */
export const EVENTS: Record<EventId, MarketEvent> = {
  // Assets that follow world stocks (beta) also feel the `index` shock through it; their own shock here is the extra.
  'rates-rise': { id: 'rates-rise', rate: 0.015, inflation: 0, shock: { index: -0.01, nile: -0.06, gold: -0.02, tech: -0.04, crypto: -0.08 } },
  'rates-fall': { id: 'rates-fall', rate: -0.015, inflation: 0, shock: { index: 0.01, nile: 0.06, gold: 0.02, tech: 0.04, crypto: 0.08 } },
  recession: { id: 'recession', rate: -0.005, inflation: 0, shock: { index: -0.12, nile: -0.2, bonds: 0.03, gold: 0.06, us500: -0.01, reit: -0.05, tech: -0.06, crypto: -0.15 } },
  scandal: { id: 'scandal', rate: 0, inflation: 0, shock: { nile: -0.35 } },
  inflation: { id: 'inflation', rate: 0.01, inflation: 0.03, shock: { index: -0.02, nile: -0.03, gold: 0.07, reit: 0.01, tech: -0.03 } },
  boom: { id: 'boom', rate: 0.005, inflation: 0, shock: { index: 0.1, nile: 0.15, gold: -0.02, tech: 0.06, crypto: 0.15 } },
  'crypto-crash': { id: 'crypto-crash', rate: 0, inflation: 0, shock: { crypto: -0.45, tech: -0.02 } },
}
export const EVENT_IDS = Object.keys(EVENTS) as EventId[]

/** Which way an event pushes an asset, for the arrows on the news card: up, down or flat. */
export type Direction = 'up' | 'down' | 'flat'
export function direction(event: MarketEvent, asset: AssetId): Direction {
  if (asset === 'savings') return event.rate >= 0.01 ? 'up' : event.rate <= -0.01 ? 'down' : 'flat' // it pays the interest rate
  const a = ASSETS[asset]
  const move =
    asset === 'bonds'
      ? -event.rate * CONFIG.bondDuration + (event.shock.bonds ?? 0) // bonds fall when rates rise
      : (event.shock[asset] ?? 0) + (a.beta ?? 0) * (event.shock.index ?? 0) + (a.rateSensitivity ?? 0) * event.rate // followers move with world stocks
  return move > 0.015 ? 'up' : move < -0.015 ? 'down' : 'flat'
}
