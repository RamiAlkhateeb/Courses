import { describe, expect, it } from 'vitest'
import { parseTheme, resolveTheme } from '../src/domain/theme'

describe('appearance', () => {
  it('reads a saved choice, and anything else follows the phone', () => {
    expect(parseTheme('dark')).toBe('dark')
    expect(parseTheme('light')).toBe('light')
    expect(parseTheme(null)).toBe('system')
    expect(parseTheme('purple')).toBe('system')
  })
  it('System follows the phone; Light and Dark ignore it', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })
})
