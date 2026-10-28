// Appearance: the learner's choice (follow the phone, or always light / dark) and the theme it gives. Pure; the store
// and the page attribute live in src/state/theme.ts.

export type ThemeChoice = 'system' | 'light' | 'dark'
export type Theme = 'light' | 'dark'

export const THEME_CHOICES: ThemeChoice[] = ['system', 'light', 'dark']

/** A saved choice; anything unknown (or nothing) follows the phone. */
export const parseTheme = (raw: string | null): ThemeChoice => (raw === 'light' || raw === 'dark' ? raw : 'system')

/** The theme to show: the choice, or the phone's setting when the choice is "system". */
export const resolveTheme = (choice: ThemeChoice, systemDark: boolean): Theme => (choice === 'system' ? (systemDark ? 'dark' : 'light') : choice)
