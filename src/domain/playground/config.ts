// Every number the Playground uses, in one place (the build brief: "put every number in one config file").
// All of it is fiction: simulated prices for teaching, never real markets and never advice.

// Names are generic on purpose ("US 500 Index ETF", not a real product or index name): the app recommends no products.
export type AssetId = 'savings' | 'bonds' | 'gold' | 'index' | 'us500' | 'reit' | 'tech' | 'nile' | 'crypto'
/** Display order: safest first. */
export const ASSET_IDS: AssetId[] = ['savings', 'bonds', 'gold', 'index', 'us500', 'reit', 'tech', 'nile', 'crypto']

export interface AssetConfig {
  id: AssetId
  /** 1 (very low) to 5 (very high), shown as pills and used for the portfolio's risk level */
  risk: 1 | 2 | 3 | 4 | 5
  /** Price per unit when a season starts */
  startPrice: number
  /** Annualised average return and volatility (savings and bonds are driven by the interest rate instead). For the
   *  assets that follow the market (`beta`), `vol` is their own noise on top of beta × the world-stocks move. */
  mean: number
  vol: number
  /** How much of the world-stocks weekly move it shares (1 = moves with it, 0 = its own path, below 0 = against it) */
  beta?: number
  /** Price change per 1-point interest-rate rise (−3 = falls about 3%): property funds, like bonds, dislike rate rises */
  rateSensitivity?: number
  /** How far it typically falls in a bad year (0.2 = 20%) */
  badYearFall: number
  /** A made-up company or coin: always labelled "(fictional)" */
  fictional?: boolean
}

export const ASSETS: Record<AssetId, AssetConfig> = {
  savings: { id: 'savings', risk: 1, startPrice: 1, mean: 0.02, vol: 0, badYearFall: 0 },
  bonds: { id: 'bonds', risk: 2, startPrice: 50, mean: 0.03, vol: 0.06, badYearFall: 0.08 },
  gold: { id: 'gold', risk: 3, startPrice: 180, mean: 0.04, vol: 0.14, beta: -0.1, badYearFall: 0.15 },
  index: { id: 'index', risk: 3, startPrice: 24.8, mean: 0.07, vol: 0.15, badYearFall: 0.2 },
  us500: { id: 'us500', risk: 3, startPrice: 41, mean: 0.08, vol: 0.05, beta: 1.05, badYearFall: 0.22 },
  reit: { id: 'reit', risk: 3, startPrice: 30, mean: 0.06, vol: 0.12, beta: 0.8, rateSensitivity: -3, badYearFall: 0.25 },
  tech: { id: 'tech', risk: 4, startPrice: 62, mean: 0.1, vol: 0.14, beta: 1.3, badYearFall: 0.33 },
  nile: { id: 'nile', risk: 5, startPrice: 12, mean: 0.09, vol: 0.35, badYearFall: 0.4, fictional: true },
  crypto: { id: 'crypto', risk: 5, startPrice: 8, mean: 0.1, vol: 0.65, beta: 1.5, badYearFall: 0.7, fictional: true },
}

export const CONFIG = {
  /** A season lasts this many simulated years (as many real days) */
  seasonYears: 10,
  weeksPerYear: 52,
  /** Time follows the real clock: one real day is one simulated year, always running (even with the app closed) */
  msPerYear: 24 * 60 * 60 * 1000,
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
  /** Market news per season (spread over it, so a story lands every couple of days) */
  eventsPerSeason: 4,
}

export const WEEKS_PER_SEASON = CONFIG.seasonYears * CONFIG.weeksPerYear
/** Real milliseconds per simulated week (about 27.7 minutes) */
export const MS_PER_WEEK = CONFIG.msPerYear / CONFIG.weeksPerYear
