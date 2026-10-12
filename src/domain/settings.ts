// App settings: the shape and how it is read from / written to its saved text. Language is not here (see
// src/state/language.ts). Saving and subscribing live in src/state/settings.ts.

export interface Settings {
  sound: boolean
}

/** Sound is on unless explicitly saved as 'off'. */
export function parseSettings(sound: string | null): Settings {
  return { sound: sound !== 'off' }
}

export const serializeSettings = (settings: Settings) => (settings.sound ? 'on' : 'off')

export const defaultSettings: Settings = { sound: true }
