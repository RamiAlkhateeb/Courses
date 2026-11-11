import { describe, expect, it } from 'vitest'
import { appCourses } from '../src/content/courses'
import type { Block } from '../src/content/types'
import { activityIn, isActivity, mythRight, predictVerdict, sortTally } from '../src/domain/activities'
import { toCards } from '../src/domain/chunks'
import { lessonsFor } from '../src/domain/lessons'

describe('activity rules', () => {
  it('rates a guess: right, next to it, or further off', () => {
    expect(predictVerdict(2, 2)).toBe('exact')
    expect(predictVerdict(1, 2)).toBe('close')
    expect(predictVerdict(3, 2)).toBe('close')
    expect(predictVerdict(0, 2)).toBe('far')
  })

  it('tallies a sort and knows when every item is placed', () => {
    const items = [{ bucket: 0 as const }, { bucket: 1 as const }, { bucket: 0 as const }]
    expect(sortTally(items, {})).toEqual({ placed: 0, right: 0, total: 3, done: false })
    expect(sortTally(items, { 0: 0, 1: 0 })).toEqual({ placed: 2, right: 1, total: 3, done: false })
    expect(sortTally(items, { 0: 0, 1: 1, 2: 0 })).toEqual({ placed: 3, right: 3, total: 3, done: true })
  })

  it('checks a myth-or-fact tap', () => {
    expect(mythRight(false, false)).toBe(true)
    expect(mythRight(true, false)).toBe(false)
  })

  it('puts an activity on the card of the lone paragraph that sets it up, and on a card of its own otherwise', () => {
    const p: Block = { type: 'html', html: { en: '<p>A hook.</p>' } }
    const guess: Block = { type: 'predict', prompt: { en: 'How much?' }, options: [{ en: '1' }, { en: '2' }], answer: 1, reveal: { en: 'Two.' } }
    const fact: Block = { type: 'myth', statement: { en: 'A myth.' }, fact: false, explain: { en: 'Why.' } }
    const { cards } = toCards([p, guess, fact])
    expect(cards.map((c) => c.map((b) => b.type))).toEqual([['html', 'predict'], ['myth']])
    expect(activityIn(cards[0])).toBe(guess)
  })
})

describe('activities in the offered courses', () => {
  it('are well formed: answers in range, both sort buckets used, at least two options', async () => {
    for (const course of appCourses)
      for (const load of Object.values(course.loaders)) {
        const mod = await load()
        for (const s of mod.sections)
          for (const b of s.blocks.filter(isActivity)) {
            const where = `${mod.id}/${s.id} ${b.type}`
            if (b.type === 'predict') {
              expect(b.options.length, where).toBeGreaterThanOrEqual(3)
              expect(b.answer, where).toBeGreaterThanOrEqual(0)
              expect(b.answer, where).toBeLessThan(b.options.length)
            }
            if (b.type === 'choice') expect(b.options.length, where).toBeGreaterThanOrEqual(2)
            if (b.type === 'sort') expect(new Set(b.items.map((i) => i.bucket)).size, where).toBe(2)
          }
      }
  })

  it('a card holds at most one activity', async () => {
    for (const course of appCourses)
      for (const load of Object.values(course.loaders)) {
        const mod = await load()
        for (const lesson of lessonsFor(mod))
          for (const step of lesson.steps)
            if (step.kind === 'content') expect(step.blocks.filter(isActivity).length, `${mod.id}/${lesson.id}`).toBeLessThanOrEqual(1)
      }
  })
})
