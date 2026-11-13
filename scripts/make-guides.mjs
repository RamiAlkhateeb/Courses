#!/usr/bin/env node
// Makes the app's guide pictures from the PNG originals in public/guides/ (Saud and Sara in each pose):
//   node scripts/make-guides.mjs
// Each becomes a WebP at twice the largest size it is shown (280px tall), about a tenth of the PNG's weight, encoded by
// Playwright's Chromium (no image library needed). It also writes src/components/ui/guideSizes.ts with each picture's
// width-to-height ratio, so <Guide> can reserve its space before the picture loads. The PNGs stay: they are the source,
// and the social exports (scripts/social/) use them at full size.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const dir = join(import.meta.dirname, '..', 'public', 'guides')
const HEIGHT = 560
const QUALITY = 0.82

const browser = await chromium.launch()
const page = await browser.newPage()
const ratios = {}
for (const file of readdirSync(dir).filter((f) => f.endsWith('.png')).sort()) {
  const png = readFileSync(join(dir, file)).toString('base64')
  const { data, ratio } = await page.evaluate(
    async ({ png, height, quality }) => {
      const img = new Image()
      img.src = `data:image/png;base64,${png}`
      await img.decode()
      const width = Math.round((img.naturalWidth / img.naturalHeight) * height)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)
      return { data: canvas.toDataURL('image/webp', quality).split(',')[1], ratio: img.naturalWidth / img.naturalHeight }
    },
    { png, height: HEIGHT, quality: QUALITY },
  )
  const name = file.replace(/\.png$/, '')
  writeFileSync(join(dir, `${name}.webp`), Buffer.from(data, 'base64'))
  ratios[name] = Math.round(ratio * 1000) / 1000
  console.log(`${name}.webp`)
}
await browser.close()

const ts = `// Written by scripts/make-guides.mjs: each guide picture's width ÷ height, so <Guide> reserves its space.\nexport const GUIDE_RATIO: Record<string, number> = ${JSON.stringify(ratios, null, 2).replace(/"/g, "'")}\n`
writeFileSync(join(import.meta.dirname, '..', 'src', 'components', 'ui', 'guideSizes.ts'), ts)
