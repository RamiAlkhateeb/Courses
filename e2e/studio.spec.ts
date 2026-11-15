import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'

// /studio: preview a lesson's carousel slides and download them, from the browser.
const onboarded = (page: Page) =>
  page.addInitScript(() => {
    if (!localStorage.getItem('profile:v1')) localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
  })

const allSlides = (page: Page) => page.getByRole('button', { name: /^Download \d+ slides?$/ })

/** Mean difference (0–255) and the share of pixels that differ a lot, between two 1080×1350 PNGs. */
async function compare(page: Page, a: Buffer, b: Buffer) {
  return page.evaluate(
    async ([x, y]) => {
      const pixels = async (src: string) => {
        const img = new Image()
        img.src = src
        await img.decode()
        const canvas = document.createElement('canvas')
        canvas.width = 1080
        canvas.height = 1350
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        return { w: img.naturalWidth, h: img.naturalHeight, d: ctx.getImageData(0, 0, 1080, 1350).data }
      }
      const A = await pixels(x)
      const B = await pixels(y)
      let sum = 0
      let big = 0
      for (let k = 0; k < A.d.length; k += 4) {
        const diff = (Math.abs(A.d[k] - B.d[k]) + Math.abs(A.d[k + 1] - B.d[k + 1]) + Math.abs(A.d[k + 2] - B.d[k + 2])) / 3
        sum += diff
        if (diff > 40) big++
      }
      const n = A.d.length / 4
      return { size: `${A.w}x${A.h}`, mean: sum / n, big: big / n }
    },
    [`data:image/png;base64,${a.toString('base64')}`, `data:image/png;base64,${b.toString('base64')}`] as const,
  )
}

test('studio previews a lesson, copies its caption and saves the engine markdown; it is never indexed', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await onboarded(page)
  await page.goto('studio?module=basics&lesson=why&lang=en')
  await expect(page.getByRole('heading', { name: 'Studio' })).toBeVisible()
  await expect(page.locator('meta[name="robots"][content="noindex"]')).toHaveCount(1)
  await expect(allSlides(page)).toBeEnabled({ timeout: 20_000 })
  const count = Number((await allSlides(page).textContent())!.match(/\d+/)![0])
  await expect(page.locator('iframe')).toHaveCount(count)

  await page.getByRole('button', { name: 'Copy caption' }).click()
  await expect(page.getByText('Caption copied.')).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/^\[DRAFT: review and edit before posting\]\n\n/)

  const md = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download markdown' }).click()
  const file = await md
  expect(file.suggestedFilename()).toBe('zubda-investing-basics-why.en.md')
  expect(readFileSync((await file.path())!, 'utf8')).toMatch(/^---\ntitle: /)
})

test('a downloaded slide is a 1080×1350 PNG that matches the command-line export, in English and Arabic', async ({ page, context }) => {
  test.setTimeout(90_000)
  await onboarded(page)
  for (const lang of ['en', 'ar'] as const) {
    const guide = lang === 'ar' ? 'saud' : 'sara'
    await page.goto(`studio?module=basics&lesson=why&lang=${lang}`)
    await expect(allSlides(page)).toBeEnabled({ timeout: 20_000 })
    const dl = page.waitForEvent('download', { timeout: 60_000 })
    await page.getByRole('button', { name: 'Slide 2', exact: true }).click()
    const download = await dl
    expect(download.suggestedFilename()).toBe(`zubda-investing-basics-why.${lang}-02.png`)
    const studio = readFileSync((await download.path())!)

    // The command-line way (scripts/social/export-post.mjs): a screenshot of the share route at 1080×1350
    const cli = await context.newPage()
    await cli.setViewportSize({ width: 1080, height: 1350 })
    await cli.goto(`share/investing/basics/why?slide=2&lang=${lang}&guide=${guide}`)
    await cli.locator('[data-ready]').waitFor()
    const shot = await cli.screenshot({ clip: { x: 0, y: 0, width: 1080, height: 1350 } })
    const diff = await compare(cli, studio, shot)
    await cli.close()
    expect(diff.size).toBe('1080x1350')
    // Same layout and fonts; an Arabic line may break one word earlier, so a few percent of pixels differ
    expect(diff.mean, `${lang} mean difference`).toBeLessThan(10)
    expect(diff.big, `${lang} share of pixels that differ`).toBeLessThan(0.08)
  }
})

test("previewing Arabic slides never switches the studio's (or the app's) language", async ({ page }) => {
  await onboarded(page)
  await page.goto('studio?module=basics&lesson=why&lang=ar')
  await expect(page.getByRole('button', { name: /^Download \d+ slides?$/ })).toBeEnabled({ timeout: 20_000 })
  await page.waitForTimeout(1000)
  await expect(page.getByRole('heading', { name: 'Studio' })).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('lang'))).not.toBe('ar')
})

test('a lesson behind the guest gate says to sign in, and offers no downloads', async ({ page }) => {
  await onboarded(page)
  await page.goto('studio?module=asset-classes&lesson=stocks&lang=en')
  await expect(page.getByText('This lesson is for members: sign in to export it.')).toBeVisible({ timeout: 20_000 })
  await expect(allSlides(page)).toHaveCount(0)
})
