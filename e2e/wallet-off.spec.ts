import { expect, test, type Page } from '@playwright/test'
import { answerActivity } from './activity'

// The shipped app hides the play-money wallet and the simulator (no VITE_SIMULATOR=1 in its build): no money anywhere,
// no portfolio, and the practice lessons are left out of the path. Runs against its own build (playwright.config.ts).
const onboarded = (page: Page, progress: object = { bank: 1000 }) =>
  page.addInitScript((p) => {
    localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
    if (!localStorage.getItem('progress:v2')) localStorage.setItem('progress:v2', JSON.stringify(p))
  }, progress)

test('Learn shows no money and no practice lesson', async ({ page }) => {
  await onboarded(page, { bank: 1000, lessonsDone: ['investing/basics/why', 'investing/basics/compounding', 'investing/basics/risk-return', 'investing/basics/ready'] })
  await page.goto('course/investing')
  await expect(page.getByRole('heading', { name: /How investing works/ }).first()).toBeVisible()
  await expect(page.getByText('$1,000')).toHaveCount(0)
  await expect(page.getByText(/play money/i)).toHaveCount(0)
  await expect(page.getByText('Your portfolio')).toHaveCount(0)
  await expect(page.getByText(/Your first investment/)).toHaveCount(0)
})

test('the portfolio and the old playground links lead Home', async ({ page }) => {
  await onboarded(page)
  for (const path of ['portfolio', 'playground', 'playground/summary']) {
    await page.goto(path)
    await expect(page).toHaveURL(/\/Courses\/$/)
  }
})

test('a right answer pays nothing visible, and Me shows no wallet', async ({ page }) => {
  await onboarded(page)
  await page.goto('course/investing/basics/learn/why')
  for (let i = 0; i < 20 && !(await page.getByRole('radio').count()); i++) {
    await answerActivity(page)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(150)
  }
  await expect(page.getByRole('radio').first()).toBeVisible()
  await page.keyboard.press('1')
  await page.keyboard.press('Enter')
  await expect(page.getByText(/\+\$10/)).toHaveCount(0)
  await page.goto('me')
  await expect(page.getByText(/play money/i)).toHaveCount(0)
})

test('on a laptop the sidebar has no Portfolio link', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await onboarded(page, { bank: 1000, lessonsDone: ['investing/basics/why', 'investing/basics/compounding', 'investing/basics/risk-return', 'investing/basics/ready'] })
  await page.goto('course/investing')
  await expect(page.getByRole('navigation', { name: 'Courses' })).toBeVisible()
  await expect(page.locator('aside').getByRole('link', { name: 'Portfolio' })).toHaveCount(0)
})
