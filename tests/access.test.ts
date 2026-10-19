import { describe, expect, it } from 'vitest'
import { canOpenLesson, canOpenPractice, FREE_LESSONS, lessonOrder } from '../src/domain/access'

const chapters = [
  { id: 'basics', lessons: [{ id: 'why' }, { id: 'compounding' }] },
  { id: 'assets', lessons: [{ id: 'stocks' }, { id: 'bonds' }] },
]
const order = lessonOrder(chapters)

describe('guest access', () => {
  it('orders lessons across chapters, as on the path', () => {
    expect(order).toEqual(['basics/why', 'basics/compounding', 'assets/stocks', 'assets/bonds'])
  })
  it(`a guest gets the first ${FREE_LESSONS} lessons, even across chapters`, () => {
    expect(canOpenLesson(order, 'basics', 'why', true)).toBe(true)
    expect(canOpenLesson(order, 'assets', 'stocks', true)).toBe(true)
    expect(canOpenLesson(order, 'assets', 'bonds', true)).toBe(false)
    expect(canOpenLesson(order, 'nope', 'x', true)).toBe(false)
  })
  it('members (and apps without accounts) open everything; practice is for members', () => {
    expect(canOpenLesson(order, 'assets', 'bonds', false)).toBe(true)
    expect(canOpenPractice(true)).toBe(false)
    expect(canOpenPractice(false)).toBe(true)
  })
})
