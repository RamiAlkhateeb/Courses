import { describe, expect, it } from 'vitest'
import { futureValue } from '../src/domain/compound'

describe('futureValue (the "try it" calculator)', () => {
  it('matches the course table: 1,000 at 7% for 10, 20 and 30 years', () => {
    expect(futureValue(1000, 7, 10)).toBe(1967)
    expect(futureValue(1000, 7, 20)).toBe(3870)
    expect(futureValue(1000, 7, 30)).toBe(7612)
  })

  it('keeps the amount at 0% and handles half-percent rates', () => {
    expect(futureValue(1000, 0, 25)).toBe(1000)
    expect(futureValue(1000, 3.5, 1)).toBe(1035)
  })
})
