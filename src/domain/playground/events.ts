import { CONFIG, type AssetId } from './config'

export type EventId = 'rates-rise' | 'rates-fall' | 'recession' | 'scandal' | 'inflation' | 'boom'

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
  'rates-rise': { id: 'rates-rise', rate: 0.015, inflation: 0, shock: { index: -0.01, nile: -0.06 } },
  'rates-fall': { id: 'rates-fall', rate: -0.015, inflation: 0, shock: { index: 0.01, nile: 0.06 } },
  recession: { id: 'recession', rate: -0.005, inflation: 0, shock: { index: -0.12, nile: -0.2, bonds: 0.03 } },
  scandal: { id: 'scandal', rate: 0, inflation: 0, shock: { nile: -0.35 } },
  inflation: { id: 'inflation', rate: 0.01, inflation: 0.03, shock: { index: -0.02, nile: -0.03 } },
  boom: { id: 'boom', rate: 0.005, inflation: 0, shock: { index: 0.1, nile: 0.15 } },
}
export const EVENT_IDS = Object.keys(EVENTS) as EventId[]

/** Which way an event pushes an asset, for the arrows on the news card: up, down or flat. */
export type Direction = 'up' | 'down' | 'flat'
export function direction(event: MarketEvent, asset: AssetId): Direction {
  if (asset === 'savings') return event.rate >= 0.01 ? 'up' : event.rate <= -0.01 ? 'down' : 'flat' // it pays the interest rate
  const move = asset === 'bonds' ? -event.rate * CONFIG.bondDuration + (event.shock.bonds ?? 0) : (event.shock[asset] ?? 0) // bonds fall when rates rise
  return move > 0.015 ? 'up' : move < -0.015 ? 'down' : 'flat'
}
