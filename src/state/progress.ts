import { emptyProgress, parseProgress } from '../domain/progress'
import { createPersistedStore } from './createPersistedStore'

/** Learner progress, saved in this browser (guest mode: no account, no backend). Every read and write goes through
 *  this store, so a backend can replace it later (docs/SUPABASE-INTEGRATION.md). Rules live in domain/progress.ts.
 *  Still key v1: the newer fields were added with defaults, so older saved progress parses unchanged. */
export const progressStore = createPersistedStore({
  key: 'progress:v1',
  empty: emptyProgress,
  parse: parseProgress,
})
