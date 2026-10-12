import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { languageStore } from '../state/language'
import { ar } from './locales/ar'
import { en } from './locales/en'

const resources = { en: { translation: en }, ar: { translation: ar } }

i18n.use(initReactI18next).init({
  resources,
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
export const formatNumber = (n: number, lng: string = i18n.language) => new Intl.NumberFormat(numberLocale(lng)).format(n)

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
