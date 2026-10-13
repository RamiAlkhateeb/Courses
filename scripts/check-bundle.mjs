// Fails when the first-load JavaScript (every file linked from dist/index.html) grows past the budget.
// Run after `npm run build`. Raise BUDGET_KB on purpose, in the same change that adds the weight.
import { readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const BUDGET_KB = 170 // gzipped; about 135 KB today
const html = readFileSync('dist/index.html', 'utf8')
const files = [...html.matchAll(/(?:src|href)="[^"]*?(\/assets\/[^"]+\.js)"/g)].map((m) => m[1])
let total = 0
for (const f of new Set(files)) {
  const size = gzipSync(readFileSync(`dist${f}`)).length
  total += size
  console.log(`${(size / 1024).toFixed(1).padStart(7)} KB  ${f}`)
}
const kb = total / 1024
console.log(`first-load JS: ${kb.toFixed(1)} KB gzipped (budget ${BUDGET_KB} KB)`)
if (kb > BUDGET_KB) {
  console.error('Over budget.')
  process.exit(1)
}
