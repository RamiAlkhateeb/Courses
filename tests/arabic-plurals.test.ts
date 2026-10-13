import i18next from 'i18next'
import { describe, expect, it } from 'vitest'
import { ar } from '../src/i18n/locales/ar'
import { en } from '../src/i18n/locales/en'

// The counts and wording the design sheet ("Tokens and Arabic rules") promises, run through real i18next so the
// plural rules (Intl.PluralRules) pick the form, not just the JSON being complete.
const i18n = i18next.createInstance()
await i18n.init({ lng: 'ar', fallbackLng: 'en', resources: { en: { translation: en }, ar: { translation: ar } } })

describe('Arabic plurals', () => {
  const days: [number, string][] = [
    [0, 'لا أيام على المسار'],
    [1, 'يوم واحد على المسار'],
    [2, 'يومان على المسار'],
    [3, '3 أيام على المسار'],
    [11, '11 يومًا على المسار'],
    [100, '100 يوم على المسار'],
  ]
  it.each(days)('days on the path: %i', (count, text) => {
    expect(i18n.t('daysOnPath', { count })).toBe(text)
  })

  it('never says "1 أيام"', () => {
    expect(i18n.t('daysOnPath', { count: 1 })).not.toMatch(/1 أيام/)
  })
})
