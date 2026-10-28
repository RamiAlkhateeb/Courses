#!/usr/bin/env node
// Renders the app icons from public/logo.svg (the Zubda mark) with Playwright's Chromium. Run after editing the logo:
//   node scripts/make-icons.mjs
// favicon-32, icon-192 and icon-512 are the mark itself (rounded, transparent corners). apple-touch-icon (180) is a full
// cream square, since iOS rounds it itself and paints transparent corners black; icon-maskable-512 puts the word inside
// the 80% safe zone on a full cream square, so launchers can crop it to any shape.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const pub = join(import.meta.dirname, '..', 'public')
const svg = readFileSync(join(pub, 'logo.svg'), 'utf8')
// The square's fill, read from the drawing so the maskable background always matches it
const cream = svg.match(/<rect[^>]*fill="(#[0-9a-fA-F]{3,8})"/)?.[1] ?? '#fff'
const inner = svg.replace(/<rect[^>]*\/>/, '') // the word and the burst, without the square

const icons = [
  { file: 'favicon-32.png', size: 32, markup: svg },
  { file: 'apple-touch-icon.png', size: 180, markup: inner.replace('<svg ', `<svg style="background:${cream}" `) },
  { file: 'icon-192.png', size: 192, markup: svg },
  { file: 'icon-512.png', size: 512, markup: svg },
  {
    file: 'icon-maskable-512.png',
    size: 512,
    // Full-bleed cream, the mark scaled to 80% in the middle
    markup: inner.replace('viewBox="0 0 64 64"', 'viewBox="-8 -8 80 80"').replace('<svg ', `<svg style="background:${cream}" `),
  },
]

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 })
  for (const { file, size, markup } of icons) {
    await page.setViewportSize({ width: size, height: size })
    const sized = markup.replace('<svg ', `<svg width="${size}" height="${size}" `)
    await page.setContent(`<html><body style="margin:0;background:transparent">${sized}</body></html>`)
    await page.screenshot({ path: join(pub, file), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } })
    console.log(`${file} (${size}px)`)
  }
} finally {
  await browser.close()
}
