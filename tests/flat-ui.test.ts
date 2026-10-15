import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function* cssFiles(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) yield* cssFiles(path)
    else if (path.endsWith('.css')) yield path
  }
}

// The flat design: no gradients, glows, blur, raised edges or drop shadows. The one shadow allowed is the focus ring on
// text inputs (`--focus-ring` / `--focus-ring-oops` in tokens.css).
const BANNED: [RegExp, string][] = [
  [/gradient\(/, 'gradient'],
  [/backdrop-filter/, 'backdrop blur'],
  [/filter:\s*blur/, 'blur'],
  [/text-shadow/, 'text shadow'],
]

describe('flat UI', () => {
  it('no gradients, blur or text shadows in any stylesheet', () => {
    const offenders: string[] = []
    for (const file of cssFiles('src')) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          for (const [re, what] of BANNED) if (re.test(line)) offenders.push(`${file}:${i + 1} ${what}: ${line.trim()}`)
        })
    }
    expect(offenders).toEqual([])
  })

  it('the only box-shadow is the input focus ring', () => {
    const offenders: string[] = []
    for (const file of cssFiles('src')) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          const m = /box-shadow:\s*([^;]+);/.exec(line)
          if (m && !/^var\(--focus-ring(-oops)?\)$/.test(m[1].trim())) offenders.push(`${file}:${i + 1}: ${line.trim()}`)
          if (/^\s*--[\w-]*shadow[\w-]*:/.test(line)) offenders.push(`${file}:${i + 1} shadow token: ${line.trim()}`)
        })
    }
    expect(offenders).toEqual([])
  })
})
