import { createPersistedStore } from './createPersistedStore'

export type Language = 'en' | 'ar'

/** The chosen UI language, saved in this browser under the key the app has always used ('lang'). It lives here so
 *  language gets the same cross-tab sync as everything else: switching language in one tab switches the others. */
export const languageStore = createPersistedStore<Language>({
  key: 'lang',
  empty: 'en',
  parse: (raw) => (raw === 'ar' ? 'ar' : 'en'),
  serialize: (lng) => lng,
})
