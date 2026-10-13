import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function* files(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) yield* files(path)
    else yield path
  }
}

// Colours are defined once, in src/styles/tokens.css; components use `var(--…)`. (The logo and mascot are drawings
// with their own fixed palette, so they are exempt.)
const EXEMPT = ['src/styles/tokens.css', 'src/components/Logo.tsx']
const RAW_COLOUR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/

describe('design tokens', () => {
  it('no raw colours outside tokens.css', () => {
    const offenders: string[] = []
    for (const file of files('src')) {
      if (!/\.(css|tsx)$/.test(file) || EXEMPT.includes(file.replaceAll('\\', '/'))) continue
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (RAW_COLOUR.test(line.replace(/&#\d+;|\/\/.*$/, ''))) offenders.push(`${file}:${i + 1}: ${line.trim()}`)
        })
    }
    expect(offenders, 'use a token from src/styles/tokens.css').toEqual([])
  })
})
