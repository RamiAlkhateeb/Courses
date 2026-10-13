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
  await page.getByRole('button', { name: 'Start my path' }).click()
  for (let i = 0; i < 2; i++) await page.getByRole('button', { name: 'Continue' }).click() // language, daily time
  await expect(page.getByText('$1,000')).toBeVisible() // the starting bank
  await page.getByRole('button', { name: 'Start climbing' }).click()
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
    for (const route of ['welcome', 'welcome/language', 'welcome/time', 'welcome/bank']) {
      await page.goto(route)
      await page.waitForTimeout(300)
      expect((await textOutside(page, other)).match(foreign) ?? [], route).toEqual([])
    }
    await onboarded(page, { lang })
    for (const route of ['./', 'review', 'review/terms', 'me', 'playground']) {
      await page.goto(route)
      await page.waitForTimeout(400)
      expect((await textOutside(page, other)).match(foreign) ?? [], route).toEqual([])
    }
  })
}

test('only the Investing course is offered', async ({ page }) => {
  await onboarded(page)
  await page.goto('courses')
  await expect(page).toHaveURL(/\/course\/investing$/)
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

test('fund the Playground, buy Safe Savings, and see what happened', async ({ page }) => {
  const errors = watchErrors(page)
  const lessons = ['investing/basics/why', 'investing/basics/compounding']
  await onboarded(page, { 'progress:v2': JSON.stringify({ bank: 1240, lessonsDone: lessons }) })
  await page.goto('playground/fund')
  await page.getByRole('button', { name: '$500', exact: true }).click()
  await page.getByRole('button', { name: /^Move/ }).first().click()
  await expect(page).toHaveURL(/\/playground$/)
  await page.getByRole('button', { name: 'Buy Safe Savings' }).click()
  await page.getByRole('button', { name: '$100', exact: true }).click()
  await page.getByRole('button', { name: /^Buy .*100/ }).click()
  await expect(page).toHaveURL(/\/playground\/debrief$/)
  await expect(page.getByText('Educational. Not financial advice.')).toBeVisible()
  const bank = JSON.parse((await page.evaluate(() => localStorage.getItem('progress:v2')))!).bank
  expect(bank).toBe(740) // $500 moved out; the bank never changes from trades
  expect(errors).toEqual([])
})
