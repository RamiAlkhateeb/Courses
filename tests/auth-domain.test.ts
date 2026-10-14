import { describe, expect, it } from 'vitest'
import { cleanName, clock, deleteConfirmed, isEmail, passwordChecks, passwordOk } from '../src/domain/auth'

describe('account rules', () => {
  it('passwordChecks reports each rule separately', () => {
    expect(passwordChecks('abc')).toEqual({ length: false, number: false, letter: true })
    expect(passwordChecks('12345678')).toEqual({ length: true, number: true, letter: false })
    expect(passwordChecks('garden2026')).toEqual({ length: true, number: true, letter: true })
  })

  it('counts letters of any script (an Arabic passphrase is fine)', () => {
    expect(passwordOk('كلمةالمرور1')).toBe(true)
    expect(passwordOk('short1')).toBe(false)
  })

  it('isEmail is a loose shape check', () => {
    for (const ok of ['aya@example.com', ' aya@example.com ', 'a.b+c@d.co']) expect(isEmail(ok), ok).toBe(true)
    for (const bad of ['', 'aya', 'aya@', '@example.com', 'aya@example', 'a ya@example.com']) expect(isEmail(bad), bad).toBe(false)
  })

  it('cleanName trims, collapses spaces and caps the length', () => {
    expect(cleanName('  Aya   Rami ')).toBe('Aya Rami')
    expect(cleanName('x'.repeat(100))).toHaveLength(40)
  })

  it('the delete word is case-insensitive but exact', () => {
    expect(deleteConfirmed('DELETE')).toBe(true)
    expect(deleteConfirmed(' delete ')).toBe(true)
    expect(deleteConfirmed('DELET')).toBe(false)
    expect(deleteConfirmed('')).toBe(false)
  })

  it('clock formats seconds as m:ss', () => {
    expect(clock(42)).toBe('0:42')
    expect(clock(60)).toBe('1:00')
    expect(clock(5)).toBe('0:05')
    expect(clock(-3)).toBe('0:00')
  })
})
