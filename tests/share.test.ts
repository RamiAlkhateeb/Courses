import { describe, expect, it } from 'vitest'
import { appCourses, loadModule } from '../src/content/courses'
import { lessonsFor } from '../src/domain/lessons'
import { ENGINE, SLIDE_WORDS, carouselPost, plainText, shareSlides, type CarouselMeta } from '../src/domain/share'
import { blockWords } from '../src/domain/chunks'

describe('share slides', () => {
  it('leave the questions out of a post by default: hook, text, pictures, key idea, call to action', async () => {
    const mod = await loadModule('investing', 'basics')
    const lesson = lessonsFor(mod).find((l) => l.id === 'why')!
    const kinds = shareSlides(lesson).map((s) => s.kind)
    expect(kinds).not.toContain('question')
    expect(kinds).not.toContain('answer')
    expect(kinds[0]).toBe('hook')
    expect(kinds.at(-2)).toBe('idea')
    expect(kinds.at(-1)).toBe('cta')
  })

  it('with quiz: turn investing/basics/why into a hook, short text slides, the key idea, question/answer pairs and a call to action', async () => {
    const mod = await loadModule('investing', 'basics')
    const lesson = lessonsFor(mod).find((l) => l.id === 'why')!
    const slides = shareSlides(lesson, { quiz: true })
    expect(slides[0]).toMatchObject({ kind: 'hook', title: { en: 'Saving vs investing' } })
    expect(slides[0].kind === 'hook' && slides[0].standfirst?.en).toMatch(/^Cash feels safe/)
    expect(slides.at(-1)).toEqual({ kind: 'cta' })
    const kinds = slides.map((s) => s.kind)
    expect(kinds.indexOf('idea')).toBeLessThan(kinds.indexOf('question'))
    const qs = lesson.steps.filter((s) => s.kind === 'question').length
    expect(kinds.filter((k) => k === 'question')).toHaveLength(qs)
    // each question is followed by its answer
    slides.forEach((s, i) => s.kind === 'question' && expect(slides[i + 1]).toEqual({ kind: 'answer', question: s.question }))
    // the diagram stands alone
    expect(slides.some((s) => s.kind === 'content' && s.blocks.length === 1 && s.blocks[0].type === 'diagram')).toBe(true)
    // activities: the sort shows as a table of its two buckets; the guess needs a tap, so it is left out
    const blocks = slides.flatMap((s) => (s.kind === 'content' ? s.blocks : []))
    expect(blocks.some((b) => b.type === 'predict' || b.type === 'sort')).toBe(false)
    expect(blocks.find((b) => b.type === 'table')).toMatchObject({ headers: [{ en: 'Saving' }, { en: 'Investing' }] })
  })

  it('a myth shows as a box with its reason', async () => {
    const mod = await loadModule('investing', 'basics')
    const lesson = lessonsFor(mod).find((l) => l.id === 'compounding')!
    const blocks = shareSlides(lesson).flatMap((s) => (s.kind === 'content' ? s.blocks : []))
    expect(blocks.find((b) => b.type === 'box' && b.label.en === 'Myth')).toBeTruthy()
  })

  it('every lesson of the offered courses makes at least 3 slides, none empty, none too long, nothing a picture cannot hold', async () => {
    for (const course of appCourses) {
      for (const id of Object.keys(course.loaders)) {
        const mod = await loadModule(course.id, id)
        for (const lesson of lessonsFor(mod)) {
          const slides = shareSlides(lesson, { quiz: true })
          expect(shareSlides(lesson).length, lesson.id).toBeGreaterThanOrEqual(3)
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

describe('carousel-engine markdown', () => {
  const meta = (lang: 'en' | 'ar'): CarouselMeta => ({
    lang,
    slug: 'zubda-investing-basics-why',
    title: lang === 'ar' ? 'الادخار مقابل الاستثمار' : 'Saving vs investing',
    author: 'Zubda',
    guide: 'sara',
    kicker: 'Learn investing · Lesson 1',
    text: { keyIdea: 'Key idea', quickCheck: 'Quick check', answer: 'Answer', ctaTitle: 'Learn investing', ctaBody: 'Link in bio' },
  })
  const slidesOf = (md: string) => md.split('<!-- slide:').slice(1)
  const layouts = (md: string) => slidesOf(md).map((s) => s.slice(0, s.indexOf(' -->')))

  it('writes the front matter and the engine layouts, cover first and call to action last', async () => {
    const mod = await loadModule('investing', 'basics')
    const lesson = lessonsFor(mod).find((l) => l.id === 'why')!
    const { markdown, assets } = carouselPost(shareSlides(lesson), meta('en'))
    expect(markdown).toMatch(/^---\ntitle: "Saving vs investing"\nlanguage: en\nslug: zubda-investing-basics-why\nauthor: "Zubda"\ntheme: zubda\n---\n/)
    const ls = layouts(markdown)
    expect(ls[0]).toBe('cover')
    expect(ls.at(-1)).toBe('cta')
    expect(ls.every((l) => ['cover', 'framework', 'story', 'cta'].includes(l))).toBe(true)
    // every slide has a picture, and each picture is listed for copying
    for (const s of slidesOf(markdown)) expect(s).toMatch(/\nimage: assets\/\S+/)
    expect(assets).toContainEqual({ from: 'diagrams/inflation.svg', to: 'inflation.svg' })
    expect(assets).toContainEqual({ from: 'guides/sara-point.png', to: 'sara-point.png' })
    // plain text only, and prices are not cut at their decimal point
    expect(markdown).not.toMatch(/<(?!!-- slide)/)
    expect(markdown).toContain('2.00 today')
  })

  it('keeps every slide inside the engine limits, with and without the quiz, in both languages', async () => {
    for (const course of appCourses) {
      for (const id of Object.keys(course.loaders)) {
        const mod = await loadModule(course.id, id)
        for (const lesson of lessonsFor(mod)) {
          for (const lang of ['en', 'ar'] as const) {
            for (const quiz of [false, true]) {
              const { markdown } = carouselPost(shareSlides(lesson, { quiz }), meta(lang))
              for (const s of slidesOf(markdown)) {
                const layout = s.slice(0, s.indexOf(' -->'))
                const title = s.match(/^#{1,2} (.+)$/m)?.[1] ?? ''
                const body = s.split(/^#{1,2} .+$/m)[1]?.trim() ?? ''
                const limit = layout === 'cover' ? ENGINE.coverTitle : layout === 'framework' ? ENGINE.frameworkTitle : layout === 'cta' ? 100 : ENGINE.storyTitle
                expect(title.length, `${lesson.id} ${lang}: ${title}`).toBeLessThanOrEqual(limit)
                // a single sentence longer than the limit stays whole (the engine warns); none in the offered lessons
                expect(body.length, `${lesson.id} ${lang}: ${body.slice(0, 60)}`).toBeLessThanOrEqual(ENGINE.body)
              }
              expect(layouts(markdown).includes('framework') || layouts(markdown).filter((l) => l === 'story').length > 0).toBe(true)
              if (!quiz) expect(markdown).not.toContain('Quick check')
            }
          }
        }
      }
    }
  })

  it('reads plain text out of lesson HTML', () => {
    expect(plainText('<p>Prices rise &amp; fall — that is <strong>inflation</strong>.</p><p>Next.</p>')).toBe('Prices rise & fall — that is inflation. Next.')
  })
})
