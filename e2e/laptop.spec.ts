import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

// The laptop layout (≥1024px): the course sidebar beside a wider page, and no tab bar. Phones are covered by the rest of
// the suite, which runs at phone size.
test.use({ viewport: { width: 1440, height: 900 } })

const start = (page: Page, items: Record<string, string> = {}) =>
  page.addInitScript((items) => {
    if (!localStorage.getItem('profile:v1')) localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
    for (const [k, v] of Object.entries(items)) if (!localStorage.getItem(k)) localStorage.setItem(k, v)
  }, items)

const outline = (page: Page) => page.getByRole('navigation', { name: 'Course outline' })

test('Learn shows the sidebar, its outline marks finished lessons, and the tab bar is gone', async ({ page }) => {
  await start(page, { 'progress:v2': JSON.stringify({ bank: 1000, lessonsDone: ['investing/basics/why'] }) })
  await page.goto('./')
  await expect(outline(page)).toBeVisible()
  // The tab bar's links now live in the sidebar
  await expect(page.getByRole('navigation', { name: 'Zubda' })).toHaveCount(1)
  await expect(page.getByRole('navigation', { name: 'Zubda' }).getByRole('link', { name: 'Me' })).toBeVisible()
  // The first lesson is done, the second is next and opens, the third is locked
  const unit = outline(page).getByRole('region', { name: /How investing works/ })
  await expect(unit.getByRole('link', { name: 'Saving vs investing Completed' })).toBeVisible()
  await expect(unit.getByRole('link', { name: /Risk and return/ })).toHaveCount(0)
  await expect(unit.getByText('Risk and return')).toBeVisible()
  await unit.getByRole('link', { name: /Compounding/ }).click()
  await expect(page).toHaveURL(/basics\/learn\/compounding$/)
  await expect(outline(page).getByRole('link', { name: /Compounding/ })).toHaveAttribute('aria-current', 'page')
  // The lesson's bottom bar lines up with the page, beside the sidebar, not under it
  const side = await page.locator('aside').filter({ has: page.getByRole('navigation') }).boundingBox()
  const next = await page.getByRole('button', { name: 'Next', exact: true }).boundingBox()
  expect(next!.x).toBeGreaterThan(side!.x + side!.width)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('in Arabic the sidebar sits on the right', async ({ page }) => {
  await start(page, { lang: 'ar' })
  await page.goto('./')
  await expect(page.getByRole('navigation', { name: 'مخطط الدورة' })).toBeVisible()
  const side = await page.locator('aside').filter({ has: page.getByRole('navigation') }).boundingBox()
  expect(side!.x).toBeGreaterThan(1440 / 2)
})

test('the old course page opens Learn; Welcome keeps its own column without the sidebar', async ({ page }) => {
  await start(page)
  await page.goto('course/investing')
  await expect(page).toHaveURL(/\/Courses\/$/)
  await expect(outline(page)).toBeVisible()
  await page.goto('welcome')
  await expect(page.locator('aside')).toHaveCount(0)
})

for (const theme of ['light', 'dark'] as const)
  test(`no serious accessibility violations with the sidebar (${theme})`, async ({ page }) => {
    await start(page, { 'theme:v1': theme })
    await page.goto('./')
    await expect(outline(page)).toBeVisible()
    await page.waitForTimeout(300)
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(serious.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([])
  })

// Part 2: Learn, Me and the portfolio use the width
const box = async (locator: ReturnType<Page['locator']>) => (await locator.boundingBox())!

for (const lang of ['en', 'ar'] as const)
  test(`Learn is a dashboard: the Today card sits beside Up next (${lang})`, async ({ page }) => {
    await start(page, { lang })
    await page.goto('./')
    const upNext = await box(page.getByRole('region', { name: lang === 'en' ? /Up next/ : /التالي/ }).first())
    const rail = page.getByRole('complementary', { name: lang === 'en' ? 'Your day' : 'يومك' })
    const today = await box(rail.getByRole('region').filter({ has: page.locator('#today-title') }))
    expect(Math.abs(today.y - upNext.y)).toBeLessThan(upNext.height) // the same row
    // Beside it: to its right in English, to its left in Arabic
    if (lang === 'en') expect(today.x).toBeGreaterThan(upNext.x + upNext.width)
    else expect(today.x + today.width).toBeLessThan(upNext.x)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  })

test('Me has two columns: This week beside the garden', async ({ page }) => {
  await start(page, { 'progress:v2': JSON.stringify({ bank: 1010, lessonsDone: ['investing/basics/why'] }) })
  await page.goto('me')
  const week = await box(page.getByText('This week', { exact: true }))
  const garden = await box(page.getByRole('heading', { name: 'Your garden' }))
  expect(garden.x).toBeGreaterThan(week.x + 100)
  expect(garden.y).toBeLessThan(week.y + 200)
})

test('the portfolio has two columns: what you own beside the chart', async ({ page }) => {
  await start(page, { 'progress:v2': JSON.stringify({ bank: 1000, lessonsDone: ['investing/basics/practice-first-buy'] }) })
  await page.goto('portfolio')
  await page.getByRole('button', { name: 'Buy Safe Savings' }).click()
  await page.getByRole('button', { name: '$100', exact: true }).click()
  await page.getByRole('button', { name: /^Buy .*100/ }).click()
  const money = await box(page.getByText('Your play money', { exact: true }))
  const own = await box(page.getByRole('heading', { name: 'What you own' }))
  expect(own.x).toBeGreaterThan(money.x + 300)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

for (const theme of ['light', 'dark'] as const)
  for (const route of ['me', 'portfolio'])
    test(`no serious accessibility violations on /${route} at laptop width (${theme})`, async ({ page }) => {
      await start(page, { 'theme:v1': theme, 'progress:v2': JSON.stringify({ bank: 1000, lessonsDone: ['investing/basics/practice-first-buy'] }) })
      await page.goto(route)
      await page.waitForTimeout(500)
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
      const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(serious.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([])
    })
