// Seeded randomness: the same seed always gives the same market, so a season can be replayed and "what if I had
// waited?" can be computed. Counter-based (the draw for week t of stream s needs no earlier draws), so any week
// can be recomputed on its own.

/** A 32-bit integer hash (the mulberry32 mixer): every input bit changes the output. */
function mix(a: number): number {
  a = (a + 0x6d2b79f5) | 0
  let t = Math.imul(a ^ (a >>> 15), 1 | a)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return (t ^ (t >>> 14)) >>> 0
}

/** A uniform number in [0, 1) for (seed, week, stream). */
export function uniform(seed: number, week: number, stream: number): number {
  return mix(mix(seed ^ Math.imul(week + 1, 0x9e3779b1)) ^ Math.imul(stream + 1, 0x85ebca6b)) / 4294967296
}

/** A standard normal number (Box–Muller) for (seed, week, stream). */
export function normal(seed: number, week: number, stream: number): number {
  const u1 = Math.max(uniform(seed, week, stream * 2), 1e-12)
  const u2 = uniform(seed, week, stream * 2 + 1)
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}
