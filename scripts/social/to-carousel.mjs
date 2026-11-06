#!/usr/bin/env node
// Writes a lesson as carousel-engine markdown (github.com/RamiAlkhateeb/carousel-engine), with the app's guides and
// charts copied next to it, so the engine can render it in its Zubda theme: Instagram PNGs and a LinkedIn PDF.
// The markdown comes from the share route (#share-carousel in src/app/SharePage.tsx, built by carouselPost in
// src/domain/share.ts), so it uses the same slides, overrides and translations as export-post.mjs.
//
//   node scripts/social/to-carousel.mjs <courseId> <moduleId> <lessonId> --engine ../carousel-engine
//        [--lang ar|en] [--guide saud|sara] [--quiz] [--build] [--no-app-build] [--port 4174]
//
// Writes <engine>/content/zubda-<course>-<module>-<lesson>/<lang>.md, assets/ and caption-<lang>.txt (a draft).
// --build then runs the engine: `carousel build … --languages <lang> --format all --strict` (output in <engine>/dist).
import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { flags, openSlide, sharePage, startPreview } from './share-page.mjs'

const args = process.argv.slice(2)
const { flag, toggle } = flags(args)
const lang = flag('--lang', 'en') === 'ar' ? 'ar' : 'en'
const guide = flag('--guide', lang === 'ar' ? 'saud' : 'sara')
const engineFlag = flag('--engine', undefined)
const quiz = toggle('--quiz')
const runEngine = toggle('--build')
const noAppBuild = toggle('--no-app-build')
const port = Number(flag('--port', '4174'))
const [courseId, moduleId, lessonId] = args
if (!courseId || !moduleId || !lessonId || typeof engineFlag !== 'string') {
  console.error('usage: node scripts/social/to-carousel.mjs <courseId> <moduleId> <lessonId> --engine <carousel-engine dir> [--lang ar|en] [--guide saud|sara] [--quiz] [--build] [--no-app-build]')
  process.exit(1)
}
const engine = resolve(engineFlag)
if (!existsSync(join(engine, 'templates', 'base.html'))) {
  console.error(`${engine} does not look like a carousel-engine checkout`)
  process.exit(1)
}

const { base, browser, close } = await startPreview({ build: !noAppBuild, port })
let slug
try {
  const page = await sharePage(browser, lang)
  await openSlide(page, base, { courseId, moduleId, lessonId, n: 1, lang, guide, quiz })
  const pre = page.locator('#share-carousel')
  const markdown = await pre.textContent()
  const assets = JSON.parse((await pre.getAttribute('data-assets')) ?? '[]')
  const caption = await page.locator('#share-caption').textContent()
  slug = markdown.match(/^slug: (.+)$/m)[1]

  const dir = join(engine, 'content', slug)
  mkdirSync(join(dir, 'assets'), { recursive: true })
  for (const { from, to } of assets) copyFileSync(join('public', from), join(dir, 'assets', to))
  writeFileSync(join(dir, `${lang}.md`), markdown)
  const draft = lang === 'ar' ? '[مسودة: راجِعها وعدّلها قبل النشر]' : '[DRAFT: review and edit before posting]'
  writeFileSync(join(dir, `caption-${lang}.txt`), `${draft}\n\n${caption}\n`)
  console.log(`${markdown.match(/<!-- slide:/g).length} slides, ${assets.length} pictures → ${dir}`)
} finally {
  await close()
}

if (runEngine) {
  const cli = join(engine, 'dist-bin', 'cli.js')
  if (!existsSync(cli)) {
    console.error(`build the engine first: (cd ${engine} && npm install && npm run build)`)
    process.exit(1)
  }
  const result = spawnSync('node', [cli, 'build', join('content', slug), '--languages', lang, '--format', 'all', '--strict'], { cwd: engine, stdio: 'inherit' })
  process.exit(result.status ?? 1)
}
