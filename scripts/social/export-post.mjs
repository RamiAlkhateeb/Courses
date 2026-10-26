#!/usr/bin/env node
// Exports a lesson as an Instagram carousel: one 1080×1350 PNG per slide, a contact sheet to review them, and a
// draft caption. The slides are the app's share route (src/app/SharePage.tsx) on a production build served by
// `vite preview` under the GitHub Pages base path, as in playwright.config.ts.
//
//   node scripts/social/export-post.mjs <courseId> <moduleId> <lessonId> [--lang ar|en] [--guide saud|sara]
//        [--quiz] [--out dir] [--no-build] [--port 4174]
//
// Posts carry the lesson only; --quiz adds each question and then its answer before the closing slide.
//
// Optional hand-written hooks, stats and captions: social/posts/<courseId>/<moduleId>/<lessonId>.json (see social/README.md).
import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { chromium } from '@playwright/test'

const args = process.argv.slice(2)
const flag = (name, fallback) => {
  const i = args.indexOf(name)
  if (i === -1) return fallback
  const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true
  args.splice(i, value === true ? 1 : 2)
  return value
}
// An on/off flag never takes the next argument (so `--quiz investing basics why` still works)
const toggle = (name) => {
  const i = args.indexOf(name)
  if (i !== -1) args.splice(i, 1)
  return i !== -1
}
const lang = flag('--lang', 'en') === 'ar' ? 'ar' : 'en'
const guide = flag('--guide', lang === 'ar' ? 'saud' : 'sara')
const noBuild = toggle('--no-build')
const quiz = toggle('--quiz')
const port = Number(flag('--port', '4174'))
const outFlag = flag('--out', undefined)
const [courseId, moduleId, lessonId] = args
if (!courseId || !moduleId || !lessonId) {
  console.error('usage: node scripts/social/export-post.mjs <courseId> <moduleId> <lessonId> [--lang ar|en] [--guide saud|sara] [--quiz] [--out dir] [--no-build]')
  process.exit(1)
}
const out = resolve(typeof outFlag === 'string' ? outFlag : join('social', 'out', `${courseId}-${moduleId}-${lessonId}.${lang}`))
mkdirSync(out, { recursive: true })

const W = 1080
const H = 1350
// The same build environment as the e2e web server, so the base path is /Courses/
const env = { ...process.env, GITHUB_PAGES: 'true', GITHUB_REPOSITORY: 'owner/Courses' }
const base = `http://localhost:${port}/Courses/`

if (!noBuild) {
  console.log('building…')
  const build = spawnSync('npm', ['run', 'build'], { env, stdio: ['ignore', 'ignore', 'inherit'] })
  if (build.status !== 0) process.exit(build.status ?? 1)
}

const server = spawn('npx', ['vite', 'preview', '--port', String(port), '--strictPort'], { env, stdio: 'ignore', detached: true })
const stop = () => {
  try {
    process.kill(-server.pid)
  } catch {
    /* already gone */
  }
}
process.on('exit', stop)

async function waitForServer() {
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(base)).ok) return
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error(`vite preview did not start on ${base}`)
}

let failed = false
const browser = await (async () => {
  await waitForServer()
  return chromium.launch()
})()
try {
  const context = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })
  // Skip onboarding and apply the language before the app starts (as e2e/smoke.spec.ts does)
  await context.addInitScript((l) => {
    localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
    localStorage.setItem('lang', l)
  }, lang)
  const page = await context.newPage()
  const url = (n) => `${base}share/${courseId}/${moduleId}/${lessonId}?slide=${n}&lang=${lang}&guide=${guide}${quiz ? '&quiz=1' : ''}`
  const open = async (n) => {
    await page.goto(url(n))
    const root = page.locator('[data-slide-count]')
    await Promise.race([
      root.and(page.locator('[data-ready]')).waitFor({ timeout: 20_000 }),
      page.locator('[data-share-error]').waitFor({ timeout: 20_000 }).then(() => {
        throw new Error(`no such lesson: ${courseId}/${moduleId}/${lessonId}`)
      }),
    ])
    await page.evaluate(() => document.fonts.ready)
    return root
  }

  const first = await open(1)
  const count = Number(await first.getAttribute('data-slide-count'))
  const caption = await page.locator('#share-caption').textContent()
  const files = []
  for (let n = 1; n <= count; n++) {
    const root = n === 1 ? first : await open(n)
    if ((await root.getAttribute('data-overflow')) === 'true') {
      failed = true
      console.warn(`! slide ${n}: the content does not fit, even at the smallest size; shorten it or split the card`)
    }
    const file = join(out, `${String(n).padStart(2, '0')}.png`)
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: W, height: H } })
    files.push(file)
  }

  const draft = lang === 'ar' ? '[مسودة: راجِعها وعدّلها قبل النشر]' : '[DRAFT: review and edit before posting]'
  writeFileSync(join(out, 'caption.txt'), `${draft}\n\n${caption}\n`)

  // Contact sheet: every slide side by side, in reading order (right to left for Arabic)
  const sheet = await browser.newPage({ viewport: { width: 1800, height: 600 } })
  const thumbs = files.map((f, i) => `<figure><img src="data:image/png;base64,${readFileSync(f).toString('base64')}"><figcaption>${i + 1}</figcaption></figure>`).join('')
  await sheet.setContent(
    `<body dir="${lang === 'ar' ? 'rtl' : 'ltr'}" style="margin:0;padding:24px;background:#e9eef0;font:600 20px sans-serif;color:#293681">
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:24px">${thumbs}</div>
      <style>figure{margin:0}img{width:100%;display:block;border-radius:8px;border:1px solid #d0e7e6}figcaption{text-align:center;margin-top:6px}</style>
    </body>`,
  )
  await sheet.screenshot({ path: join(out, 'contact-sheet.png'), fullPage: true })
  console.log(`${count} slides → ${out}${failed ? ' (some slides overflow)' : ''}`)
} finally {
  await browser.close()
  stop()
}
process.exit(failed ? 2 : 0)
