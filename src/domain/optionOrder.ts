/**
 * Display order for a question's options: a permutation of `0..count-1`, seeded by the question id so it is
 * the same on every visit (and in both the quick-check and lesson views) but differs between questions.
 * Content authors can then write the correct answer anywhere — often first — without it always showing first.
 * Indices stored in progress stay indices into `question.options`, never display positions.
 */
export function optionOrder(questionId: string, count: number): number[] {
  // FNV-1a hash of the id → seed for a small LCG; deterministic and dependency-free.
  let seed = 2166136261
  for (let i = 0; i < questionId.length; i++) {
    seed ^= questionId.charCodeAt(i)
    seed = Math.imul(seed, 16777619)
  }
  const next = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 2 ** 32
  }
  const order = Array.from({ length: count }, (_, i) => i)
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}
