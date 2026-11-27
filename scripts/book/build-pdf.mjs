// Prints a course's book to PDF, in English and Arabic:
//   node scripts/book/build-pdf.mjs investing [--lang en|ar] [--no-build]
// It builds the app with the book page switched on (VITE_BOOK=1, into dist-book/, never deployed), serves it with
// `vite preview`, opens /book/<course>?lang=… in Chromium and saves book-out/<course>.<lang>.pdf (both ignored by git).
// Upload the PDFs for members with scripts/book/upload.mjs.
import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { chromium } from '@playwright/test'

const args = process.argv.slice(2)
const course = args.find((a) => !a.startsWith('--'))
if (!course) {
  console.error('usage: node scripts/book/build-pdf.mjs <course> [--lang en|ar] [--no-build]')
  process.exit(1)
}
const langArg = args.includes('--lang') ? args[args.indexOf('--lang') + 1] : null
const langs = langArg ? [langArg] : ['en', 'ar']
const port = 4176
const base = `http://localhost:${port}/Courses/`
// Book builds have no accounts (blank Supabase values win over a local .env) and the /Courses/ base path
const env = { ...process.env, GITHUB_PAGES: 'true', GITHUB_REPOSITORY: 'owner/Courses', VITE_BOOK: '1', VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '' }

if (!args.includes('--no-build')) {
  console.log('building the book build…')
  const result = spawnSync('npx', ['vite', 'build', '--outDir', 'dist-book'], { env, stdio: ['ignore', 'ignore', 'inherit'] })
  if (result.status !== 0) process.exit(result.status ?? 1)
}
const server = spawn('npx', ['vite', 'preview', '--outDir', 'dist-book', '--port', String(port), '--strictPort'], { env, stdio: 'ignore', detached: true })
const stop = () => {
  try {
    process.kill(-server.pid)
  } catch {
    /* already gone */
  }
}
process.on('exit', stop)
for (let i = 0; ; i++) {
  try {
    if ((await fetch(base)).ok) break
  } catch {
    /* not up yet */
  }
  if (i > 100) throw new Error(`vite preview did not start on ${base}`)
  await new Promise((r) => setTimeout(r, 200))
}

mkdirSync('book-out', { recursive: true })
const browser = await chromium.launch()
try {
  for (const lang of langs) {
    const page = await browser.newPage()
    await page.goto(`${base}book/${course}?lang=${lang}`)
    await page.locator('[data-ready]').waitFor({ timeout: 30_000 })
    const footer = `<div style="width:100%;font-size:8pt;color:#5B678F;text-align:center;font-family:sans-serif"><span class="pageNumber"></span></div>`
    const path = `book-out/${course}.${lang}.pdf`
    await page.pdf({ path, format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: footer, outline: true, tagged: true })
    console.log(`wrote ${path}`)
    await page.close()
  }
} finally {
  await browser.close()
  stop()
}
