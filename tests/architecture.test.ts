// Keeps the layering from eroding. Every relative import under src/ is checked against the rules below, so a
// feature quietly reaching into another feature (or domain code reaching for React or localStorage) fails CI.
//
//   content     data + registry + content hooks           → content
//   domain      pure rules (progress, lessons, chunks…)   → domain, content        (no React, no browser APIs)
//   state       persisted stores, hooks, sound            → state, domain, content
//   i18n        translations                              → i18n, state, domain, content
//   components  shared UI                                 → components, i18n, state, domain, content
//   features/X  one screen area                           → X itself + everything above except other features
//   app         router and providers                      → anything
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, normalize, relative, sep } from 'node:path'
import { describe, expect, it } from 'vitest'

const SRC = join(process.cwd(), 'src')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(name) ? [p] : []
  })
}

const FOLDERS = new Set(['app', 'components', 'content', 'domain', 'i18n', 'state', 'styles'])

/** 'features/path', 'domain', 'main'… the layer a file or folder under src/ belongs to. */
function layerOf(path: string): string {
  const parts = relative(SRC, path).split(sep)
  const first = parts[0].replace(/\.(d\.ts|tsx?)$/, '')
  if (parts.length === 1) return FOLDERS.has(first) ? first : 'main' // 'src/i18n' (a folder import) vs src/main.tsx
  return parts[0] === 'features' ? `features/${parts[1]}` : parts[0]
}

const BASE = ['content']
const ALLOWED: Record<string, (layer: string) => boolean> = {
  content: (l) => [...BASE].includes(l),
  domain: (l) => ['domain', ...BASE].includes(l),
  state: (l) => ['state', 'domain', ...BASE].includes(l),
  i18n: (l) => ['i18n', 'state', 'domain', ...BASE].includes(l),
  components: (l) => ['components', 'i18n', 'state', 'domain', ...BASE].includes(l),
}

const IMPORT = /(?:from\s+|import\s*\(\s*|import\s+)['"](\.{1,2}\/[^'"]+)['"]/g
const files = walk(SRC)

function importsOf(file: string) {
  return [...readFileSync(file, 'utf8').matchAll(IMPORT)].map((m) => {
    const target = normalize(join(dirname(file), m[1]))
    return { spec: m[1], layer: layerOf(target) }
  })
}

describe('architecture boundaries', () => {
  it('every layer imports only from the layers it may depend on', () => {
    const violations: string[] = []
    for (const file of files) {
      const layer = layerOf(file)
      if (layer === 'app' || layer === 'main' || layer === 'styles') continue
      for (const { spec, layer: target } of importsOf(file)) {
        const ok = layer.startsWith('features/')
          ? target === layer || ['components', 'i18n', 'state', 'domain', ...BASE].includes(target)
          : ALLOWED[layer]?.(target) ?? false
        if (!ok) violations.push(`${relative(SRC, file)} (${layer}) imports ${spec} (${target})`)
      }
    }
    expect(violations).toEqual([])
  })

  it('domain code is pure: no React, router, i18n or query library, and no browser storage or DOM', () => {
    const offenders: string[] = []
    for (const file of files.filter((f) => layerOf(f) === 'domain')) {
      const code = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
      if (/from\s+['"](react|react-dom|react-router-dom|react-i18next|i18next|@tanstack\/[^'"]+)['"]/.test(code)) offenders.push(`${relative(SRC, file)}: imports a UI library`)
      if (/\b(localStorage|sessionStorage|document|window|navigator)\b/.test(code)) offenders.push(`${relative(SRC, file)}: touches a browser API`)
    }
    expect(offenders).toEqual([])
  })

  it('no file in a layer folder is left unclassified', () => {
    const layers = new Set(files.map(layerOf))
    const known = new Set(['main', 'app', 'components', 'content', 'domain', 'i18n', 'state'])
    const unknown = [...layers].filter((l) => !known.has(l) && !l.startsWith('features/'))
    expect(unknown).toEqual([])
  })
})
