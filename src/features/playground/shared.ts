import type { TFunction } from 'i18next'
import { CONFIG, type AssetId } from '../../domain/playground/config'

/** The colour dot of an asset in lists and in the allocation bar (tokens only). */
export const ASSET_DOT: Record<AssetId | 'cash', string> = {
  cash: 'var(--locked)',
  savings: 'var(--correct)',
  index: 'var(--brand)',
  bonds: 'var(--ink-soft)',
  nile: 'var(--accent)',
}

/** "Broad Index Fund"; with `full`, a made-up company says so: "Nile Foods (fictional)". */
export const assetName = (t: TFunction, id: AssetId, full = false) => (full && id === 'nile' ? t('pg_asset_nile_full') : t(`pg_asset_${id}`))

/** Which simulated year a week falls in (1-based). */
export const yearOf = (tick: number) => Math.min(CONFIG.seasonYears, Math.floor(tick / CONFIG.weeksPerYear) + 1)

export const riskWord = (t: TFunction, level: number) =>
  t(level <= 1 ? 'pg_risk_1' : level === 2 ? 'pg_risk_2' : level === 3 ? 'pg_risk_3' : level === 4 ? 'pg_risk_4' : 'pg_risk_5')
