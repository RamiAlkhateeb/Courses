import { defaultSettings, parseSettings, serializeSettings, type Settings } from '../domain/settings'
import { createPersistedStore } from './createPersistedStore'

/** App settings (sound), saved in this browser. The key and text format ('on' / 'off') are the ones the app has
 *  always used, so existing choices carry over. */
export const settingsStore = createPersistedStore({
  key: 'sound',
  empty: defaultSettings,
  parse: parseSettings,
  serialize: serializeSettings,
})

export const getSettings = (): Settings => settingsStore.get()
export const updateSettings = (patch: Partial<Settings>) => settingsStore.update((s) => ({ ...s, ...patch }))
