import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/** Fails the test on any uncaught error or console error (e.g. a missing file under the base path). */
function watchErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  return errors
}

const onboarded = (page: Page, extra: Record<string, string> = {}) =>
  page.addInitScript((items) => {
    localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
    for (const [k, v] of Object.entries(items)) localStorage.setItem(k, v)
  }, extra)

test('a first-time visitor is sent to the welcome flow and can reach the path', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('./')
  await expect(page).toHaveURL(/\/Courses\/welcome$/)
  await page.getByRole('button', { name: 'Get started' }).click()
  await page.getByRole('button', { name: 'Continue' }).click() // language
  await page.getByRole('button', { name: 'Start learning' }).click() // daily time
  await expect(page).toHaveURL(/\/Courses\/$/)
  await expect(page.getByRole('navigation')).toBeVisible() // the tab bar
  expect(JSON.parse((await page.evaluate(() => localStorage.getItem('profile:v1')))!).onboarded).toBe(true)
  expect(errors).toEqual([])
})

/** Visible text of the page that is not inside an element marked with another language (e.g. the EN / عربي switch). */
const textOutside = (page: Page, otherLang: string) =>
  page.evaluate((lang) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const out: string[] = []
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const el = n.parentElement
      if (!el || el.closest(`[lang="${lang}"]`) || !el.checkVisibility()) continue
      out.push(n.textContent ?? '')
    }
    return out.join(' ')
  }, otherLang)

for (const [lang, other, foreign] of [
  ['en', 'ar', /[\u0600-\u06FF]+/g],
  ['ar', 'en', /[A-Za-z]{2,}/g],
] as const) {
  test(`only ${lang === 'en' ? 'English' : 'Arabic'} is shown on the main screens`, async ({ page }) => {
    await page.addInitScript((l) => localStorage.setItem('lang', l), lang)
    for (const route of ['welcome', 'welcome/language', 'welcome/time']) {
      await page.goto(route)
      await page.waitForTimeout(300)
      expect((await textOutside(page, other)).match(foreign) ?? [], route).toEqual([])
    }
    await onboarded(page, { lang })
    for (const route of ['./', 'me', 'settings', 'playground']) {
      await page.goto(route)
      await page.waitForTimeout(400)
      expect((await textOutside(page, other)).match(foreign) ?? [], route).toEqual([])
    }
  })
}

test('only the Investing course is offered; the courses page shows the rest as coming soon', async ({ page }) => {
  await onboarded(page)
  await page.goto('')
  await page.getByRole('button', { name: /Investing Fundamentals/ }).click()
  await page.getByRole('link', { name: 'All courses' }).click()
  await expect(page).toHaveURL(/\/courses$/)
  await expect(page.getByRole('heading', { name: 'Courses', level: 1 })).toBeVisible()
  await expect(page.getByText('Coming soon').first()).toBeVisible()
  await page.getByRole('button', { name: /Investing Fundamentals/ }).click()
  await expect(page).toHaveURL(/\/Courses\/$/)
  await page.goto('course/tech-interview')
  await expect(page.getByText('Page not found', { exact: false }).or(page.getByText("doesn't exist", { exact: false }))).toBeVisible()
})

test('finishing a lesson with the keyboard saves progress and pays the bank', async ({ page }) => {
  const errors = watchErrors(page)
  await onboarded(page)
  await page.goto('course/investing/basics/learn/compounding')
  await expect(page.locator('main, [class*=card]').first()).toBeVisible()
  // Enter/1 drive the lesson; the last Enter on the results screen returns to the path.
  for (let i = 0; i < 30 && page.url().includes('/learn/'); i++) {
    if (await page.getByRole('radio').count()) {
      await page.keyboard.press('1') // pick the first option shown
      await page.keyboard.press('Enter') // check
    }
    await page.keyboard.press('Enter') // continue
    await page.waitForTimeout(150)
  }
  await expect(page).not.toHaveURL(/\/learn\//)
  const saved = JSON.parse((await page.evaluate(() => localStorage.getItem('progress:v2')))!)
  expect(saved.lessonsDone).toContain('investing/basics/compounding')
  expect(saved.bank).toBeGreaterThanOrEqual(1000)
  expect(errors).toEqual([])
})

test('Arabic is right-to-left and uses its own font', async ({ page }) => {
  const errors = watchErrors(page)
  await onboarded(page, { lang: 'ar' })
  await page.goto('./')
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
  expect(await page.evaluate(() => getComputedStyle(document.body).fontFamily)).toContain('IBM Plex Sans Arabic')
  expect(await page.title()).toContain('أبو شريك')
  // no sideways scroll on a phone
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(errors).toEqual([])
})

test('a deep link under the base path loads (assets resolve, no error screen)', async ({ page }) => {
  const errors = watchErrors(page)
  await onboarded(page)
  await page.goto('course/investing')
  await expect(page.getByRole('heading', { name: 'Investing Fundamentals' })).toBeVisible()
  await expect(page.getByRole('alert')).toHaveCount(0)
  expect(errors).toEqual([])
})

for (const route of ['./', 'me', 'playground']) {
  test(`no serious accessibility violations on /${route === './' ? '' : route}`, async ({ page }) => {
    await onboarded(page)
    await page.goto(route)
    await page.waitForTimeout(500)
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(serious.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([])
  })
}

test('the Playground uses the one wallet: buy Safe Savings, time starts, the bank moves in', async ({ page }) => {
  const errors = watchErrors(page)
  await onboarded(page, { 'progress:v2': JSON.stringify({ bank: 1240 }) })
  await page.clock.install() // time follows the real clock: fake it so we can move it forward
  await page.goto('playground')
  await expect(page.getByText('Time starts when you make your first buy', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: /speed|pause/i })).toHaveCount(0) // no play or speed controls
  await expect(page.getByText('Educational only, not financial advice')).toBeVisible()
  await page.getByRole('button', { name: 'Buy Safe Savings' }).click()
  await page.getByRole('button', { name: '$100', exact: true }).click()
  await page.getByRole('button', { name: /^Buy .*100/ }).click()
  await expect(page.getByRole('button', { name: 'Buy or sell' })).toBeVisible()
  const saved = await page.evaluate(() => ({ bank: JSON.parse(localStorage.getItem('progress:v2')!).bank, pg: JSON.parse(localStorage.getItem('playground:v1')!) }))
  expect(saved.bank).toBe(0) // the whole wallet is in the Playground
  expect(saved.pg.status).toBe('running')
  expect(saved.pg.cash + saved.pg.holdings.savings.units * 1).toBeCloseTo(1240 - 1, 0) // minus the 1% fee on $100
  // one real day is one simulated year: two real hours later it is about four weeks on, with nothing pressed
  await expect(page.getByText('Year 1 · Week 1')).toBeVisible()
  await page.clock.fastForward('02:00:00')
  await expect(page.getByText('Year 1 · Week 5')).toBeVisible()
  expect(errors).toEqual([])
})

test('Playground auto-invest buys every month; payouts and the compare line show', async ({ page }) => {
  const errors = watchErrors(page)
  await onboarded(page, { 'progress:v2': JSON.stringify({ bank: 1000 }) })
  await page.clock.install()
  await page.goto('playground')
  await page.getByRole('button', { name: 'Buy Safe Savings' }).click()
  await page.getByRole('button', { name: '$100', exact: true }).click()
  await page.getByRole('button', { name: /^Buy .*100/ }).click()
  await page.getByRole('button', { name: 'Set up' }).click()
  await page.getByRole('button', { name: '$50', exact: true }).click()
  await page.getByRole('radio', { name: /World Stocks/ }).click()
  await page.getByRole('button', { name: 'Start auto-invest' }).click()
  await expect(page.getByText(/\$50.* a month into World Stocks/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Where your money is' })).toBeVisible()
  // A month is 4 weeks, about 1 hour 51 minutes of real time
  await page.clock.fastForward('02:00:00')
  await expect(page.getByText('Year 1 · Week 5')).toBeVisible()
  const pg = await page.evaluate(() => JSON.parse(localStorage.getItem('playground:v1')!))
  expect(pg.trades.filter((t: { auto?: boolean }) => t.auto)).toHaveLength(1)
  expect(pg.holdings.index.units).toBeGreaterThan(0)
  await page.getByRole('button', { name: 'All in US 500' }).click()
  await expect(page.locator('p', { hasText: /the same money all in US 500 Index ETF would be/ })).toBeVisible()
  expect(errors).toEqual([])
})

for (const lang of ['en', 'ar']) {
  test(`no sideways scroll at 320px in ${lang}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 })
    await onboarded(page, { lang, 'progress:v2': JSON.stringify({ bank: 1240 }) })
    for (const route of ['./', 'playground', 'me', 'settings', 'course/investing/basics/learn/risk-return']) {
      await page.goto(route)
      await page.waitForTimeout(400)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true)
    }
  })
}
