import { useSyncExternalStore } from 'react'
import type { PersistedStore } from './createPersistedStore'

/** The current value of a persisted store, re-rendering the component when it changes (here or in another tab). */
export const useStore = <T>(store: Pick<PersistedStore<T>, 'get' | 'subscribe'>): T =>
  useSyncExternalStore(store.subscribe, store.get, store.get)
