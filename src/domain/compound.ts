// Compound growth for the "try it" calculator. Pure: no React, no browser APIs.

/** What `start` grows to after `years` at `ratePct` a year, compounded yearly, rounded to whole units. */
export function futureValue(start: number, ratePct: number, years: number): number {
  return Math.round(start * Math.pow(1 + ratePct / 100, years))
}
