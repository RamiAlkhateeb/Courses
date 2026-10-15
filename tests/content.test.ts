import { describe, expect, it } from 'vitest'
import { AUDIENCES, courses } from '../src/content/courses'
import type { Block, Localized, Module } from '../src/content/types'

/** Every module of every course, loaded the same way the app loads them. */
async function allModules() {
  const mods: Module[] = []
  for (const course of courses) {
    for (const load of Object.values(course.loaders)) mods.push(await load())
  }
  return mods
}

function* walkBlocks(blocks: Block[]): Generator<Block> {
  for (const block of blocks) {
    yield block
    if (block.type === 'tabs') for (const tab of block.tabs) yield* walkBlocks(tab.blocks)
  }
}

function* localizedIn(mod: Module): Generator<Localized> {
  yield mod.cover.kicker
  yield mod.cover.titleHtml
  for (const q of mod.questions) {
    yield q.prompt
    yield* q.options
    if (q.explain) yield q.explain
  }
  for (const s of mod.sections) {
    yield s.navLabel
    yield s.sectionLabel
    yield s.headingHtml
    for (const b of walkBlocks(s.blocks)) {
      if (b.type === 'html' || b.type === 'box' || b.type === 'keyIdea') yield b.html
      if (b.type === 'diagram') yield* [b.fig, b.title, b.alt, b.caption]
      if (b.type === 'objectives' || b.type === 'takeaways') yield* b.items
    }
  }
}

describe('course content', () => {
  it('every nav item with a loader resolves to a module with matching ids', async () => {
    for (const course of courses) {
      const navIds = course.groups.flatMap((g) => g.items.map((i) => i.id))
      expect(new Set(navIds).size, `${course.id}: duplicate nav ids`).toBe(navIds.length)
      for (const [id, load] of Object.entries(course.loaders)) {
        expect(navIds, `${course.id}/${id} has a loader but no nav item`).toContain(id)
        const mod = await load()
        expect(mod.id).toBe(id)
        expect(mod.courseId).toBe(course.id)
      }
    }
  })

  it('question ids are unique across the whole app and answers are in range', async () => {
    const seen = new Set<string>()
    for (const mod of await allModules()) {
      for (const q of mod.questions) {
        expect(seen.has(q.id), `duplicate question id ${q.id}`).toBe(false)
        seen.add(q.id)
        expect(q.id).toMatch(/^[a-z]+-q\d{3}$/)
        expect(q.moduleId).toBe(mod.id)
        expect(q.answer, `${q.id}: answer out of range`).toBeGreaterThanOrEqual(0)
        expect(q.answer, `${q.id}: answer out of range`).toBeLessThan(q.options.length)
      }
    }
  })

  it('every exercise block points at an existing question, and every question is used', async () => {
    for (const mod of await allModules()) {
      const ids = new Set(mod.questions.map((q) => q.id))
      const used = new Set<string>()
      for (const s of mod.sections) {
        for (const b of walkBlocks(s.blocks)) {
          if (b.type === 'exercise') {
            expect(ids.has(b.questionId), `${mod.id}: unknown question ${b.questionId}`).toBe(true)
            used.add(b.questionId)
          }
        }
      }
      for (const id of ids) expect(used.has(id), `${mod.id}: question ${id} is never shown`).toBe(true)
    }
  })

  it('section ids are unique within a module', async () => {
    for (const mod of await allModules()) {
      const ids = mod.sections.map((s) => s.id)
      expect(new Set(ids).size, `${mod.id}: duplicate section ids`).toBe(ids.length)
    }
  })

  it('every piece of text has an Arabic translation', async () => {
    for (const mod of await allModules()) {
      for (const text of localizedIn(mod)) {
        expect(text.ar, `${mod.id}: missing ar for "${text.en.slice(0, 50)}"`).toBeTruthy()
      }
    }
  })

  it('every course says who it is for, in both languages', () => {
    for (const course of courses) {
      expect(course.audience?.en, course.id).toBeTruthy()
      expect(course.audience?.ar, course.id).toBeTruthy()
    }
  })

  it('every course has a unique id, a known category and at least one audience', () => {
    const ids = courses.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const course of courses) {
      expect(['careers', 'business', 'management'], course.id).toContain(course.category)
      expect(course.audiences.length, `${course.id}: no audience`).toBeGreaterThan(0)
      expect(new Set(course.audiences).size, `${course.id}: duplicate audience`).toBe(course.audiences.length)
      for (const a of course.audiences) expect(AUDIENCES, course.id).toContain(a)
    }
  })

  it('every course and chapter title has both languages, including planned (unwritten) chapters', () => {
    for (const course of courses) {
      expect(course.title.ar, course.id).toBeTruthy()
      expect(course.description.ar, course.id).toBeTruthy()
      for (const group of course.groups) {
        expect(group.label.ar, `${course.id}: group`).toBeTruthy()
        for (const item of group.items) expect(item.title.ar, `${course.id}/${item.id}`).toBeTruthy()
      }
    }
  })

  // Course HTML is rendered with dangerouslySetInnerHTML, so what may appear in it is pinned here. Until content is
  // sanitised at render time (needed before any community or CMS content), this test is the only gate.
  it('content HTML has no scripts, event handlers, javascript: URLs or embeds', async () => {
    const banned = /<\s*(script|iframe|object|embed|style|link|meta|form)\b|\son[a-z]+\s*=|javascript\s*:|data\s*:\s*text\/html/i
    for (const mod of await allModules()) {
      for (const text of localizedIn(mod)) {
        for (const lang of ['en', 'ar'] as const) {
          expect(text[lang], `${mod.courseId}/${mod.id} (${lang}): ${text[lang]?.slice(0, 60)}`).not.toMatch(banned)
        }
      }
    }
  })
})
