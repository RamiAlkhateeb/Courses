// Every number the Playground uses, in one place (the build brief: "put every number in one config file").
// All of it is fiction: simulated prices for teaching, never real markets and never advice.

export type AssetId = 'savings' | 'index' | 'bonds' | 'nile'
/** Display order: safest first. */
export const ASSET_IDS: AssetId[] = ['savings', 'index', 'bonds', 'nile']

export interface AssetConfig {
  id: AssetId
  /** 1 (very low) to 5 (very high), shown as pills and used for the portfolio's risk level */
  risk: 1 | 2 | 3 | 4 | 5
  /** Price per unit when a season starts */
  startPrice: number
  /** Annualised average return and volatility (savings and bonds are driven by the interest rate instead) */
  mean: number
  vol: number
  /** How far it typically falls in a bad year (0.2 = 20%) */
  badYearFall: number
  /** A made-up company: always labelled "(fictional)" */
  fictional?: boolean
}

export const ASSETS: Record<AssetId, AssetConfig> = {
  savings: { id: 'savings', risk: 1, startPrice: 1, mean: 0.02, vol: 0, badYearFall: 0 },
  index: { id: 'index', risk: 3, startPrice: 24.8, mean: 0.07, vol: 0.15, badYearFall: 0.2 },
  bonds: { id: 'bonds', risk: 2, startPrice: 50, mean: 0.03, vol: 0.06, badYearFall: 0.08 },
  nile: { id: 'nile', risk: 5, startPrice: 12, mean: 0.09, vol: 0.35, badYearFall: 0.4, fictional: true },
}

export const CONFIG = {
  /** A season lasts this many simulated years (about as many real minutes at 1x) */
  seasonYears: 10,
  weeksPerYear: 52,
  /** Real seconds per simulated year at 1x */
  secondsPerYear: 60,
  /** Clock speeds: pause, 1x, 2x, 3x */
  speeds: [0, 1, 2, 3] as const,
  /** 1% of the amount, on every buy and every sell */
  feeRate: 0.01,
  /** Interest rate and inflation start here and drift (annual rates) */
  startRate: 0.03,
  startInflation: 0.03,
  /** Weekly noise and pull back to the start value, for the interest rate and for inflation */
  rateWeeklyVol: 0.0008,
  inflationWeeklyVol: 0.0006,
  reversion: 0.02,
  /** Safe Savings pays the interest rate minus this (but never less than savingsFloor) */
  savingsSpread: 0.01,
  savingsFloor: 0.005,
  /** Bonds lose this × the rate change in price (a 1.5-point rate rise costs about 7.5%) */
  bondDuration: 5,
  bondWeeklyNoise: 0.04,
  /** Quick amounts */
  tradePresets: [50, 100],
  /** Market news per season: how many, and the earliest/latest weeks they can land in */
  eventsPerSeason: 3,
}

export const WEEKS_PER_SEASON = CONFIG.seasonYears * CONFIG.weeksPerYear
/** Real milliseconds per simulated week at `speed` (1, 2 or 3) */
export const tickMs = (speed: number) => (CONFIG.secondsPerYear * 1000) / CONFIG.weeksPerYear / speed
