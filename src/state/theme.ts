import { parseTheme, resolveTheme, type ThemeChoice } from '../domain/theme'
import { createPersistedStore } from './createPersistedStore'
import { useStore } from './useStore'

/** Appearance (System / Light / Dark), saved on this device only: a phone and a laptop can differ. */
export const themeStore = createPersistedStore<ThemeChoice>({
  key: 'theme:v1',
  empty: 'system',
  parse: parseTheme,
  serialize: (choice) => choice,
})

export const setThemeChoice = (choice: ThemeChoice) => themeStore.update(() => choice)
export const useThemeChoice = () => useStore(themeStore)

const systemQuery = () => (typeof matchMedia === 'undefined' ? null : matchMedia('(prefers-color-scheme: dark)'))

/** Puts the theme on <html data-theme> (tokens.css switches on it) and the browser bar. */
function apply() {
  const theme = resolveTheme(themeStore.get(), systemQuery()?.matches ?? false)
  document.documentElement.dataset.theme = theme
  // The browser bar: the indigo brand in light, the page's own navy in dark (read from the tokens)
  const bar = getComputedStyle(document.documentElement).getPropertyValue(theme === 'dark' ? '--mist' : '--surface-ink').trim()
  if (bar) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bar)
}

/** Applies the theme now and keeps it in step with the setting (any tab) and, on "System", with the phone. */
export function startTheme() {
  apply()
  themeStore.subscribe(apply)
  systemQuery()?.addEventListener('change', apply)
}
