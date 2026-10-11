// App settings (sound), kept in this browser's localStorage. Language is not here: i18next already
// persists it (src/i18n/index.ts). Same external-store pattern as src/features/progress/store.ts, so every
// component sees one shared value.

export interface Settings {
  sound: boolean
}

const SOUND_KEY = 'sound'

export function parseSettings(sound: string | null): Settings {
  return { sound: sound !== 'off' }
}

const hasDom = typeof window !== 'undefined'

function read(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null // localStorage unavailable (private mode)
  }
}

let current = hasDom ? parseSettings(read(SOUND_KEY)) : parseSettings(null)
const listeners = new Set<() => void>()

export function updateSettings(patch: Partial<Settings>) {
  current = { ...current, ...patch }
  try {
    localStorage.setItem(SOUND_KEY, current.sound ? 'on' : 'off')
  } catch {
    // ignore
  }
  listeners.forEach((l) => l())
}

export const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
export const getSettings = () => current
