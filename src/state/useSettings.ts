import { settingsStore, updateSettings } from './settings'
import { useStore } from './useStore'

export function useSettings() {
  return { settings: useStore(settingsStore), updateSettings }
}
