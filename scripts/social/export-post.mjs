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
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { flags, openSlide, sharePage, startPreview } from './share-page.mjs'

const args = process.argv.slice(2)
const { flag, toggle } = flags(args)
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
const { base, browser, close } = await startPreview({ build: !noBuild, port })

let failed = false
try {
  const page = await sharePage(browser, lang)
  const open = (n) => openSlide(page, base, { courseId, moduleId, lessonId, n, lang, guide, quiz })

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
  await close()
}
process.exit(failed ? 2 : 0)
