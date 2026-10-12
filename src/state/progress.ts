import { emptyProgress, parseProgress } from '../domain/progress'
import { createPersistedStore } from './createPersistedStore'

/** Learner progress, saved in this browser (guest mode: no account, no backend). Every read and write goes through
 *  this store, so a backend can replace it later (docs/SUPABASE-INTEGRATION.md). Rules live in domain/progress.ts.
 *  v2 counts the play-money bank instead of XP; `parseProgress` migrates a saved v1 value the first time (see its comment). */
export const progressStore = createPersistedStore({
  key: 'progress:v2',
  legacyKeys: ['progress:v1'],
  empty: emptyProgress,
  parse: parseProgress,
})
