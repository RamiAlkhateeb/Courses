import { describe, expect, it } from 'vitest'
import { defaultReminder, parseReminder, reminderDue } from '../src/domain/reminder'

const at = (h: number) => new Date(2026, 9, 20, h, 5)
const today = '2026-10-20'

describe('daily study reminder', () => {
  it('is sent from the chosen hour, once a day, only if no lesson was done today', () => {
    const r = { on: true, hour: 18, lastSent: '' }
    expect(reminderDue(r, at(17), today, '2026-10-19')).toBe(false) // too early
    expect(reminderDue(r, at(18), today, '2026-10-19')).toBe(true)
    expect(reminderDue({ ...r, lastSent: today }, at(21), today, '2026-10-19')).toBe(false) // already sent
    expect(reminderDue(r, at(21), today, today)).toBe(false) // a lesson was done today
    expect(reminderDue({ ...r, on: false }, at(21), today, '')).toBe(false)
  })
  it('reads saved settings, tolerating garbage', () => {
    expect(parseReminder(null)).toEqual(defaultReminder)
    expect(parseReminder('{nope')).toEqual(defaultReminder)
    expect(parseReminder(JSON.stringify({ on: true, hour: 8, lastSent: today }))).toEqual({ on: true, hour: 8, lastSent: today })
    expect(parseReminder(JSON.stringify({ on: 'yes', hour: 99 }))).toEqual(defaultReminder)
  })
})
