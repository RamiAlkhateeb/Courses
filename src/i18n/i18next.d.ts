import type { en } from './locales/en'

// Makes `t('…')` check its key against the English strings (and autocomplete it).
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: { translation: typeof en }
  }
}
