import type { TFunction } from 'i18next'
import { CONFIG, type AssetId } from '../../domain/playground/config'

/** The colour dot of an asset in lists and in the allocation bar (tokens only). */
export const ASSET_DOT: Record<AssetId | 'cash', string> = {
  cash: 'var(--locked)',
  savings: 'var(--correct)',
  bonds: 'var(--ink-soft)',
  gold: 'var(--gold)',
  index: 'var(--brand)',
  us500: 'var(--code-bg)',
  reit: 'var(--leaf-mid)',
  tech: 'var(--sky)',
  nile: 'var(--accent)',
  crypto: 'var(--oops)',
}

/** "World Stocks ETF"; with `full`, anything made up says so: "Nile Foods (fictional)", "Crypto Coin (fictional)". */
export const assetName = (t: TFunction, id: AssetId, full = false) =>
  full && id === 'nile' ? t('pg_asset_nile_full') : full && id === 'crypto' ? t('pg_asset_crypto_full') : t(`pg_asset_${id}`)

/** The week within its simulated year (1–52). */
export const weekOf = (tick: number) => (tick % CONFIG.weeksPerYear) + 1

/** Which simulated year a week falls in (1-based). */
export const yearOf = (tick: number) => Math.min(CONFIG.seasonYears, Math.floor(tick / CONFIG.weeksPerYear) + 1)

export const riskWord = (t: TFunction, level: number) =>
  t(level <= 1 ? 'pg_risk_1' : level === 2 ? 'pg_risk_2' : level === 3 ? 'pg_risk_3' : level === 4 ? 'pg_risk_4' : 'pg_risk_5')
