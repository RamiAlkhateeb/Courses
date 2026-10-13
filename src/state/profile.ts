import { emptyProfile, parseProfile, type Profile } from '../domain/profile'
import { createPersistedStore } from './createPersistedStore'
import { useStore } from './useStore'

/** Onboarding choices and the active trail, saved in this browser. */
export const profileStore = createPersistedStore({
  key: 'profile:v1',
  empty: emptyProfile,
  parse: parseProfile,
})

export const updateProfile = (patch: Partial<Profile>) => profileStore.update((p) => ({ ...p, ...patch }))
export const useProfile = () => useStore(profileStore)
