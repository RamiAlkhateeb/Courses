import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { languageStore } from '../state/language'
import { en } from './locales/en'

// English ships in the first download; Arabic is its own chunk, fetched only when Arabic is chosen (about 8 KB less to
// load for everyone else). i18next asks this tiny "backend" for any language it does not have yet and waits for it, so
// switching language never shows untranslated keys.
const lazyLocales = {
  type: 'backend' as const,
  init() {},
  read(lng: string, _ns: string, done: (err: unknown, data?: Record<string, unknown>) => void) {
    if (lng === 'ar') import('./locales/ar').then((m) => done(null, m.ar), (err) => done(err))
    else done(null, en)
  },
}

/** Resolves once the saved language's translations are in (main.tsx waits for it before the first render). */
export const i18nReady = i18n
  .use(lazyLocales)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en } },
    partialBundledLanguages: true,
    lng: languageStore.get(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

const RTL_LANGS = ['ar']

/** The app's languages. Names are endonyms (each in its own language) so they stay readable whatever the UI language is. */
export const LANGUAGES = [
  { code: 'en', name: 'English', short: 'EN', letter: 'EN' },
  { code: 'ar', name: 'العربية', short: 'عربي', letter: 'ع' },
] as const

/** Number locale for a UI language: Arabic keeps Western digits (1,240), as in the design. */
export const numberLocale = (lng: string) => (lng === 'ar' ? 'ar-u-nu-latn' : lng)
export const formatNumber = (n: number, { decimals }: { decimals?: number } = {}, lng: string = i18n.language) =>
  new Intl.NumberFormat(numberLocale(lng), decimals === undefined ? undefined : { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n)

/** A play-money amount as text: `$1,240`, `+$486`, `−$6` (Western digits in both languages). For attributes and
 *  sentences; screens use <Money>, which also pins the direction. */
export const formatMoney = (amount: number, { sign = false, decimals = 0 }: { sign?: boolean; decimals?: number } = {}, lng: string = i18n.language) => {
  const abs = new Intl.NumberFormat(numberLocale(lng), { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(Math.abs(amount))
  return `${amount < 0 ? '−' : sign ? '+' : ''}$${abs}`
}

/** `formatMoney` wrapped so the amount stays one left-to-right unit when it is slotted into a sentence (a button label
 *  such as "Buy $150" inside Arabic text). */
export const moneyText = (amount: number, opts?: { sign?: boolean; decimals?: number }) => `\u2066${formatMoney(amount, opts)}\u2069`

const applyDir = (lng: string) => {
  document.documentElement.lang = lng
  document.documentElement.dir = RTL_LANGS.includes(lng) ? 'rtl' : 'ltr'
  document.title = i18n.t('docTitle')
  languageStore.update(() => (lng === 'ar' ? 'ar' : 'en'))
}
applyDir(i18n.language)
i18n.on('languageChanged', applyDir)
// Another tab switched language: follow it. (A no-op when this tab made the change: the value is already equal.)
languageStore.subscribe(() => {
  if (i18n.language !== languageStore.get()) void i18n.changeLanguage(languageStore.get())
})

export default i18n
