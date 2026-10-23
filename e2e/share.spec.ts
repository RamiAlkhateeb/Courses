import { expect, test } from '@playwright/test'

// The share route draws one 1080×1350 slide of a lesson (scripts/social/export-post.mjs screenshots them).
for (const lang of ['en', 'ar'] as const) {
  test(`share slides for investing/basics/why fit their canvas (${lang})`, async ({ page }) => {
    await page.setViewportSize({ width: 1080, height: 1350 })
    await page.addInitScript((l) => localStorage.setItem('lang', l), lang)
    const open = async (n: number) => {
      await page.goto(`share/investing/basics/why?slide=${n}&lang=${lang}&guide=sara`)
      const root = page.locator('[data-slide-count][data-ready]')
      await expect(root).toBeVisible()
      return root
    }
    const first = await open(1)
    const count = Number(await first.getAttribute('data-slide-count'))
    expect(count).toBeGreaterThan(5)
    await expect(page.locator('html')).toHaveAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    await expect(page.getByText(lang === 'ar' ? 'أبو شريك' : 'Abu Shreek', { exact: true })).toBeVisible()
    await expect(page.getByRole('navigation')).toHaveCount(0) // no tab bar: the slide is the whole page
    for (let n = 1; n <= count; n++) {
      const root = n === 1 ? first : await open(n)
      await expect(root, `slide ${n}`).toHaveAttribute('data-overflow', 'false')
    }
    const caption = await page.locator('#share-caption').textContent()
    expect(caption).toContain(lang === 'ar' ? 'ليس نصيحة مالية' : 'not financial advice')
  })
}
