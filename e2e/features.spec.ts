import { expect, test, type Page } from '@playwright/test'
import { openSimulator, withPractice } from './practice'

const onboarded = (page: Page, extra: Record<string, string> = {}) =>
  page.addInitScript((items) => {
    localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
    for (const [k, v] of Object.entries(items)) if (!localStorage.getItem(k)) localStorage.setItem(k, v)
  }, extra)

const basicsDone = ['why', 'compounding', 'risk-return', 'ready', 'practice-first-buy'].map((l) => `investing/basics/${l}`)

test('Daily review: a missed question shows a card on Learn that opens the review', async ({ page }) => {
  await onboarded(page, { 'progress:v2': JSON.stringify({ bank: 1000, answers: { 'invb-q001': { selected: 1, correct: false } } }) })
  await page.goto('./')
  const card = page.getByRole('link', { name: /Daily review/ })
  await expect(card).toContainText('1 question to put right')
  await card.click()
  await expect(page).toHaveURL(/\/course\/investing\/review$/)
  await expect(page.getByRole('radio').first()).toBeVisible()
})

test('a finished unit has a certificate that can be saved as an image', async ({ page }) => {
  await onboarded(page, { 'progress:v2': JSON.stringify({ bank: 1000, lessonsDone: basicsDone }) })
  await page.goto('./')
  await page.getByRole('link', { name: 'Certificate' }).first().click()
  await expect(page).toHaveURL(/\/certificate\/investing\/basics$/)
  await expect(page.getByRole('img', { name: /finished every lesson of How investing works/ })).toBeVisible()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Save as image' }).click()
  expect((await download).suggestedFilename()).toBe('abu-shreek-investing-basics.png')
  // An unfinished unit explains what is missing instead
  await page.goto('certificate/investing/asset-classes')
  await expect(page.getByText(/Finish every lesson in Asset classes/)).toBeVisible()
})

test('glossary: a term in a lesson opens a one-line definition', async ({ page }) => {
  await onboarded(page)
  await page.goto('course/investing/basics/learn/why')
  const term = page.locator('dfn[data-term]').first()
  for (let i = 0; i < 6 && !(await term.isVisible()); i++) await page.keyboard.press('Enter')
  await expect(term).toBeVisible()
  await term.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: 'Got it' })).toBeVisible()
  await page.getByRole('button', { name: 'Got it' }).click()
  await expect(page.getByRole('button', { name: 'Got it' })).toHaveCount(0)
})

test('simulator: a season goal, the yearly recap, and rebalancing to an example mix', async ({ page }) => {
  await onboarded(page, { 'progress:v2': withPractice() })
  await page.clock.install()
  await openSimulator(page)
  await page.getByRole('button', { name: 'Beat inflation' }).click()
  await expect(page.getByRole('button', { name: 'Beat inflation' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Buy Safe Savings' }).click()
  await page.getByRole('button', { name: '$100', exact: true }).click()
  await page.getByRole('button', { name: /^Buy .*100/ }).click()
  // One real day is one simulated year: the year's news, then the recap
  await page.clock.fastForward('24:05:00')
  const recap = page.getByRole('heading', { name: 'Year 1 is over' })
  for (let i = 0; i < 6 && !(await recap.isVisible()); i++) {
    await page.getByRole('button', { name: 'Continue' }).click()
    await page.waitForTimeout(150)
  }
  await expect(recap).toBeVisible()
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(recap).toHaveCount(0)
  await page.getByRole('button', { name: 'Rebalance', exact: true }).click()
  await page.getByRole('radio', { name: /Balanced/ }).click()
  await expect(page.getByText(/trades? · fees about/)).toBeVisible()
  await page.getByRole('button', { name: 'Rebalance now' }).click()
  const pg = await page.evaluate(() => JSON.parse(localStorage.getItem('playground:v1')!))
  expect(pg.goal).toBe('beat-inflation')
  expect(pg.recapSeen).toBe(1)
  expect(pg.holdings.index.units).toBeGreaterThan(0)
  expect(pg.holdings.bonds.units).toBeGreaterThan(0)
})

test('installable and offline: the service worker keeps lessons available without a network', async ({ page, context }) => {
  await onboarded(page)
  await page.goto('./')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  // Reload once so the page is controlled, then cut the network
  await page.reload()
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true)
  await context.setOffline(true)
  await page.goto('course/investing/basics/learn/compounding')
  await expect(page.locator('main, [class*=card]').first()).toBeVisible()
  await context.setOffline(false)
})

test('portfolio shortcut: after the first practice lesson, Learn links to the simulator on its own screen', async ({ page }) => {
  await onboarded(page, { 'progress:v2': withPractice() })
  await page.goto('./')
  await page.getByRole('link', { name: /Your portfolio/ }).click()
  await expect(page).toHaveURL(/\/portfolio$/)
  await expect(page.getByRole('heading', { name: 'Your portfolio', level: 1 })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Buy Safe Savings' })).toBeVisible()
})

test('Me shows the last seven days: days learning, play money earned', async ({ page }) => {
  const d = new Date()
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  await onboarded(page, { 'progress:v2': JSON.stringify({ bank: 1020, activity: { [today]: 20 } }) })
  await page.goto('me')
  const recap = page.getByRole('list', { name: 'Your last 7 days' })
  await expect(recap).toContainText('1 day learning')
  await expect(recap).toContainText('+$20 earned')
})

test('the simulator tour shows three tips once', async ({ page }) => {
  await onboarded(page, { 'progress:v2': withPractice() })
  await openSimulator(page)
  await expect(page.getByText('Tip 1 of 3')).toBeVisible()
  await page.getByRole('button', { name: 'Next tip' }).click()
  await page.getByRole('button', { name: 'Next tip' }).click()
  await expect(page.getByText('Tip 3 of 3')).toBeVisible()
  await page.getByRole('button', { name: 'Got it' }).click()
  await expect(page.getByText(/Tip \d of 3/)).toHaveCount(0)
  expect(await page.evaluate(() => localStorage.getItem('tour:simulator'))).toBe('seen')
  await openSimulator(page) // a fresh visit: the lesson starts again, the tour does not
  await expect(page.getByText(/Tip \d of 3/)).toHaveCount(0)
})

test('the daily study reminder can be switched on and given a time', async ({ page }) => {
  // Headless Chromium reports notifications as denied even when granted: stand in a browser that allows them
  await page.addInitScript(() => {
    class FakeNotification {
      static permission = 'granted'
      static requestPermission = async () => 'granted'
    }
    Object.defineProperty(window, 'Notification', { value: FakeNotification, configurable: true })
  })
  await onboarded(page)
  await page.goto('settings')
  await page.getByRole('switch', { name: /Daily reminder/ }).click()
  await expect(page.getByRole('switch', { name: /Daily reminder/ })).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByText(/Daily at 6:00/)).toBeVisible()
  await page.getByRole('button', { name: /Reminder time/ }).click()
  await page.getByRole('radio', { name: /8:00\sAM/ }).click()
  await expect(page.getByText(/Daily at 8:00\sAM/)).toBeVisible()
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('reminder:v1')!))
  expect(saved).toMatchObject({ on: true, hour: 8 })
})
