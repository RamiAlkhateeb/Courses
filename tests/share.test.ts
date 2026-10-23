import { describe, expect, it } from 'vitest'
import { appCourses, loadModule } from '../src/content/courses'
import { lessonsFor } from '../src/domain/lessons'
import { SLIDE_WORDS, shareSlides } from '../src/domain/share'
import { blockWords } from '../src/domain/chunks'

describe('share slides', () => {
  it('turn investing/basics/why into a hook, short text slides, the key idea, question/answer pairs and a call to action', async () => {
    const mod = await loadModule('investing', 'basics')
    const lesson = lessonsFor(mod).find((l) => l.id === 'why')!
    const slides = shareSlides(lesson)
    expect(slides[0]).toMatchObject({ kind: 'hook', title: { en: 'Saving vs investing' } })
    expect(slides[0].kind === 'hook' && slides[0].standfirst?.en).toMatch(/^Saving keeps money safe/)
    expect(slides.at(-1)).toEqual({ kind: 'cta' })
    const kinds = slides.map((s) => s.kind)
    expect(kinds.indexOf('idea')).toBeLessThan(kinds.indexOf('question'))
    const qs = lesson.steps.filter((s) => s.kind === 'question').length
    expect(kinds.filter((k) => k === 'question')).toHaveLength(qs)
    // each question is followed by its answer
    slides.forEach((s, i) => s.kind === 'question' && expect(slides[i + 1]).toEqual({ kind: 'answer', question: s.question }))
    // the diagram stands alone
    expect(slides.some((s) => s.kind === 'content' && s.blocks.length === 1 && s.blocks[0].type === 'diagram')).toBe(true)
  })

  it('every lesson of the offered courses makes at least 4 slides, none empty, none too long, nothing a picture cannot hold', async () => {
    for (const course of appCourses) {
      for (const id of Object.keys(course.loaders)) {
        const mod = await loadModule(course.id, id)
        for (const lesson of lessonsFor(mod)) {
          const slides = shareSlides(lesson)
          expect(slides.length, lesson.id).toBeGreaterThanOrEqual(4)
          for (const s of slides) {
            if (s.kind !== 'content') continue
            expect(s.blocks.length, lesson.id).toBeGreaterThan(0)
            for (const b of s.blocks) expect(['objectives', 'takeaways', 'practice', 'calculator', 'exercise', 'cardBreak']).not.toContain(b.type)
            if (s.blocks.length > 1) expect(s.blocks.reduce((n, b) => n + blockWords(b), 0), lesson.id).toBeLessThanOrEqual(SLIDE_WORDS)
          }
        }
      }
    }
  })
})
