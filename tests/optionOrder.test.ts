import { describe, expect, it } from 'vitest'
import { courses } from '../src/content/courses'
import { optionOrder } from '../src/domain/optionOrder'

describe('optionOrder', () => {
  it('is a stable permutation', () => {
    const order = optionOrder('invb-q001', 4)
    expect([...order].sort()).toEqual([0, 1, 2, 3])
    expect(optionOrder('invb-q001', 4)).toEqual(order)
  })

  it('does not show the correct answer in the same position for most questions', async () => {
    const firstShown: Record<number, number> = {}
    let total = 0
    for (const course of courses) {
      for (const load of Object.values(course.loaders)) {
        for (const q of (await load()).questions) {
          const position = optionOrder(q.id, q.options.length).indexOf(q.answer)
          firstShown[position] = (firstShown[position] ?? 0) + 1
          total++
        }
      }
    }
    // With 3 options a fair shuffle puts ~1/3 of answers in each position; flag anything badly skewed.
    for (const count of Object.values(firstShown)) expect(count / total).toBeLessThan(0.5)
  })
})
