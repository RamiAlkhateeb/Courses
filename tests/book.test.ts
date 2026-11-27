import { describe, expect, it } from 'vitest'
import { BOOK_COURSE_IDS } from '../src/content/book'
import { BOOKS } from '../src/content/bookLoaders'
import { courses, flatNav } from '../src/content/courses'

// Course books: every book loads, its chapters follow the course's units, and every text is in both languages with
// no Arabic number range written digit–digit (it shows reversed).
const strings = (value: unknown, out: { en: string; ar: string }[] = []) => {
  if (Array.isArray(value)) value.forEach((v) => strings(v, out))
  else if (value && typeof value === 'object') {
    const o = value as Record<string, unknown>
    if (typeof o.en === 'string' && typeof o.ar === 'string') out.push({ en: o.en, ar: o.ar })
    else Object.values(o).forEach((v) => strings(v, out))
  }
  return out
}

describe('course books', () => {
  it('every book course has a book, with chapters in the order of its units', async () => {
    for (const id of BOOK_COURSE_IDS) {
      expect(BOOKS[id], id).toBeDefined()
      const book = await BOOKS[id]()
      const units = flatNav(courses.find((c) => c.id === id)!).map((i) => i.id)
      const ids = book.chapters.map((c) => c.id)
      expect(ids.length).toBeGreaterThan(0)
      expect(ids, 'chapters follow the units, in order').toEqual(units.slice(0, ids.length))
    }
  })

  it('every text is in English and Arabic, and Arabic ranges read من … إلى …', async () => {
    for (const id of BOOK_COURSE_IDS) {
      const book = await BOOKS[id]()
      for (const { en, ar } of strings(book)) {
        expect(en.trim(), ar.slice(0, 40)).not.toBe('')
        expect(ar.trim(), en.slice(0, 40)).not.toBe('')
        expect(ar.replace(/<[^>]+>/g, ''), en.slice(0, 40)).not.toMatch(/\d[\d,.%]*\s?[–-]\s?\d/)
      }
    }
  })

  it('names no guide or story character (the book is not the lessons)', async () => {
    for (const id of BOOK_COURSE_IDS) {
      const names = strings(await BOOKS[id]()).flatMap(({ en, ar }) => [
        ...(en.match(/\b(Noor|Karim|Saud|Sara)\b/g) ?? []),
        // Whole Arabic words only (سارة hides inside خسارة), with an optional و / ل / ب in front
        ...ar.split(/[\s.,،؛:!؟?()«»"<>/]+/).filter((w) => /^[وبل]?(نور|كريم|سعود|سارة)$/.test(w)),
      ])
      expect(names).toEqual([])
    }
  })
})
