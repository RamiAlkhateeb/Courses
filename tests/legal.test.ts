import { describe, expect, it } from 'vitest'
import { LEGAL, LEGAL_PAGES } from '../src/features/account/legal'

describe('legal pages', () => {
  it('have a title and every section in both languages', () => {
    for (const id of LEGAL_PAGES) {
      const page = LEGAL[id]
      for (const lang of ['en', 'ar'] as const) {
        expect(page.title[lang], `${id} title (${lang})`).toBeTruthy()
        expect(page.sections.length, id).toBeGreaterThan(0)
        for (const s of page.sections) {
          expect(s.h[lang], `${id} heading (${lang})`).toBeTruthy()
          expect(s.p[lang], `${id}: ${s.h.en} (${lang})`).toBeTruthy()
        }
      }
    }
  })

  it('never promise real money or advice', () => {
    const text = LEGAL_PAGES.flatMap((id) => LEGAL[id].sections.map((s) => s.p.en)).join(' ').toLowerCase()
    expect(text).toContain('play money')
    expect(text).not.toMatch(/guarantee|real returns|you will earn/)
  })
})
