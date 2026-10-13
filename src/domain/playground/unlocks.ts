import { ASSET_IDS, ASSETS, type AssetId } from './config'

/** Assets the player has been taught: each unlocks after a number of finished lessons (ASSETS[…].unlockAfterLessons). */
export const unlockedAssets = (lessonsDone: number): AssetId[] => ASSET_IDS.filter((id) => lessonsDone >= ASSETS[id].unlockAfterLessons)

/** Market news is unlocked by the unit checkpoint: finishing every lesson of the first unit. */
export const eventsUnlocked = (lessonsDone: number, unitLessons: number) => unitLessons > 0 && lessonsDone >= unitLessons

/** The first asset the player can buy, for the empty state's "Buy Safe Savings". */
export const firstUnlocked = (lessonsDone: number): AssetId | null => unlockedAssets(lessonsDone)[0] ?? null
