import { describe, expect, it } from 'vitest'
import { GLOSSARY } from '../src/content/glossary'
import { markTerms } from '../src/domain/glossary'

describe('glossary terms in lessons', () => {
  it('every term has both languages, at least one form to match and a short definition', () => {
    const ids = new Set<string>()
    for (const g of GLOSSARY) {
      expect(ids.has(g.id)).toBe(false)
      ids.add(g.id)
      expect(g.term.en && g.term.ar && g.def.en && g.def.ar).toBeTruthy()
      expect(g.match.en.length && g.match.ar.length).toBeTruthy()
      expect(g.def.en.split(/\s+/).length).toBeLessThanOrEqual(30)
    }
  })
  it('marks the first appearance only, as a whole word, case-insensitive', () => {
    const out = markTerms('<p>Inflation eats cash. Inflation again. Not deflationary.</p>', 'en')
    expect(out).toBe('<p><dfn data-term="inflation" tabindex="0" role="button">Inflation</dfn> eats cash. Inflation again. Not deflationary.</p>')
  })
  it('never touches tags, attributes, links, code or headings, and marks once per card across blocks', () => {
    const html = '<p><a href="/bonds">bonds</a> <span title="bonds">x</span> <code>bonds</code></p><h2>Bonds</h2><p>Bonds pay interest.</p>'
    const seen = new Set<string>()
    const out = markTerms(html, 'en', seen)
    expect(out).toContain('<a href="/bonds">bonds</a>')
    expect(out).toContain('title="bonds"')
    expect(out).toContain('<h2>Bonds</h2>')
    expect(out).toContain('<p><dfn data-term="bond" tabindex="0" role="button">Bonds</dfn> pay interest.</p>')
    expect(markTerms('<p>More bonds.</p>', 'en', seen)).toBe('<p>More bonds.</p>')
  })
  it('prefers the longest form, and handles symbols and Arabic with glued prefixes', () => {
    expect(markTerms('<p>Low-cost ETFs win.</p>', 'en')).toContain('>ETFs</dfn>')
    expect(markTerms('<p>A P/E of 20.</p>', 'en')).toContain('>P/E</dfn>')
    expect(markTerms('<p>وبالتضخم تتآكل القيمة.</p>', 'ar')).toContain('وب<dfn data-term="inflation" tabindex="0" role="button">التضخم</dfn>')
  })
})
