import { describe, expect, it } from 'vitest'
import { ar } from '../src/i18n/locales/ar'
import { en } from '../src/i18n/locales/en'

type Tree = { [key: string]: string | Tree }

function flatten(tree: Tree, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(tree)) {
    if (typeof v === 'string') out[prefix + k] = v
    else Object.assign(out, flatten(v, `${prefix}${k}.`))
  }
  return out
}

const PLURAL = /_(zero|one|two|few|many|other)$/
const EN_FORMS = ['one', 'other']
const AR_FORMS = ['zero', 'one', 'two', 'few', 'many', 'other']

/** key → its plural forms (empty for a plain key) */
function groups(flat: Record<string, string>) {
  const g = new Map<string, Map<string, string>>()
  for (const [key, text] of Object.entries(flat)) {
    const m = PLURAL.exec(key)
    const base = m ? key.slice(0, m.index) : key
    if (!g.has(base)) g.set(base, new Map())
    g.get(base)!.set(m ? m[1]! : '', text)
  }
  return g
}

const vars = (text: string) => [...new Set([...text.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1]!))].sort()

describe('UI strings (en / ar)', () => {
  const enG = groups(flatten(en))
  const arG = groups(flatten(ar))

  it('have the same keys in both languages', () => {
    expect([...arG.keys()].sort()).toEqual([...enG.keys()].sort())
  })

  it('have no empty strings', () => {
    for (const [lang, g] of [['en', enG], ['ar', arG]] as const) {
      for (const [key, forms] of g) for (const [form, text] of forms) expect(text.trim(), `${lang}.${key}_${form}`).not.toBe('')
    }
  })

  it('use the same {{variables}} in both languages', () => {
    for (const [key, enForms] of enG) {
      const arForms = arG.get(key)
      if (!arForms) continue
      const all = (forms: Map<string, string>) => [...new Set([...forms.values()].flatMap(vars))].sort()
      expect(all(arForms), `{{vars}} of "${key}"`).toEqual(all(enForms))
    }
  })

  it('have every plural form each language needs', () => {
    for (const [lang, g, forms] of [['en', enG, EN_FORMS], ['ar', arG, AR_FORMS]] as const) {
      for (const [key, found] of g) {
        if (found.has('')) continue // plain string
        expect([...found.keys()].sort(), `${lang}: plural forms of "${key}"`).toEqual([...forms].sort())
      }
    }
  })
})
