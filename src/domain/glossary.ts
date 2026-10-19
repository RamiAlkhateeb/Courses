// Marks glossary terms in lesson HTML so a tap can explain them (the terms live in src/content/glossary.ts). Pure
// string work: only text between tags is touched, never tag names or attributes, and never inside links, code,
// headings or a term already marked. Each term is marked once per card (`seen`), at its first appearance.
import { GLOSSARY, type GlossaryTerm } from '../content/glossary'

const SKIP = new Set(['a', 'code', 'pre', 'dfn', 'h1', 'h2', 'h3', 'h4', 'button'])
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')

const patterns = new Map<string, RegExp>()
/** English matches whole words, case-insensitive; Arabic matches inside words too (ال، و، ب، ل are glued on). */
function pattern(entry: GlossaryTerm, lang: 'en' | 'ar'): RegExp {
  const key = `${entry.id}:${lang}`
  let re = patterns.get(key)
  if (!re) {
    const alts = [...entry.match[lang]].sort((a, b) => b.length - a.length).map(escape).join('|')
    re = lang === 'en' ? new RegExp(`(?<![\\w-])(${alts})(?![\\w-])`, 'i') : new RegExp(`(${alts})`)
    patterns.set(key, re)
  }
  return re
}

export function markTerms(html: string, lang: 'en' | 'ar', seen: Set<string> = new Set(), glossary: GlossaryTerm[] = GLOSSARY): string {
  const tokens = html.split(/(<[^>]*>)/)
  for (const entry of glossary) {
    if (seen.has(entry.id) || entry.match[lang].length === 0) continue
    const re = pattern(entry, lang)
    let skip = 0
    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i]
      if (tok.startsWith('<')) {
        const m = /^<(\/?)([a-zA-Z0-9]+)/.exec(tok)
        if (m && SKIP.has(m[2].toLowerCase()) && !tok.endsWith('/>')) skip += m[1] ? -1 : 1
        continue
      }
      if (skip > 0) continue
      const hit = re.exec(tok)
      if (!hit) continue
      const open = `<dfn data-term="${entry.id}" tabindex="0" role="button">`
      tokens.splice(i, 1, tok.slice(0, hit.index), open, hit[0], '</dfn>', tok.slice(hit.index + hit[0].length))
      seen.add(entry.id)
      break
    }
  }
  return tokens.join('')
}

export const glossaryTerm = (id: string, glossary: GlossaryTerm[] = GLOSSARY) => glossary.find((g) => g.id === id)
