import { expect, test, type Page } from '@playwright/test'

// Review fixes: Me's name and first visit, lessons done per course, /share behind the guest gate, light guide pictures.
const onboarded = (page: Page, progress?: object) =>
  page.addInitScript((p) => {
    if (!localStorage.getItem('profile:v1')) localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
    if (p && !localStorage.getItem('progress:v2')) localStorage.setItem('progress:v2', JSON.stringify(p))
  }, progress)

const basics = ['why', 'compounding', 'risk-return', 'ready', 'practice-first-buy'].map((l) => `investing/basics/${l}`)

test('a first visit to Me shows one welcome card, not a row of zeros', async ({ page }) => {
  await onboarded(page)
  await page.goto('me')
  await expect(page.getByRole('heading', { name: 'Your garden starts with one lesson' })).toBeVisible()
  await expect(page.getByText('lessons done')).toHaveCount(0)
  await page.getByRole('link', { name: 'Start your first lesson' }).click()
  await expect(page).toHaveURL(/\/learn\/why$/)
})

test('the name typed on Me shows there and on certificates; lessons done count the active course', async ({ page }) => {
  // Two other-course lessons in the saved list must not count on Investing's Me
  await onboarded(page, { bank: 1000, lessonsDone: [...basics, 'other/x/1', 'other/x/2'], completed: Object.fromEntries(basics.map((k) => [k, '2026-11-02'])) })
  await page.goto('me')
  await expect(page.getByText('lessons done').locator('..')).toContainText('5')
  await page.getByRole('button', { name: 'Add your name' }).click()
  await page.getByRole('textbox', { name: 'Your name' }).fill('Layla')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('heading', { name: /Layla/ })).toBeVisible()
  await page.getByRole('button', { name: 'Edit your name' }).click()
  await page.getByRole('textbox', { name: 'Your name' }).fill('Layla Haddad')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('heading', { name: /Layla Haddad/ })).toBeVisible()
  await page.goto('certificate/investing/basics')
  await expect(page.getByRole('img', { name: /Layla Haddad finished every lesson of How investing works.*November 2, 2026/ })).toBeVisible()
})

test('share slides of a locked lesson stay behind the guest gate, and slides are never indexed', async ({ page }) => {
  await onboarded(page)
  await page.goto('share/investing/basics/why?slide=1&lang=en')
  await expect(page.locator('[data-ready]')).toBeVisible()
  await expect(page.locator('meta[name="robots"][content="noindex"]')).toHaveCount(1)
  await page.goto('share/investing/asset-classes/stocks?slide=1&lang=en&quiz=1')
  await expect(page.getByRole('heading', { name: 'Create a free account to keep learning' })).toBeVisible()
  await expect(page.locator('[data-ready]')).toHaveCount(0)
})

test('guide pictures are light WebPs with their size reserved', async ({ page }) => {
  await onboarded(page)
  await page.goto('./?guide=sara')
  const guide = page.locator('img[src*="/guides/"]').first()
  await expect(guide).toHaveAttribute('src', /sara-[a-z]+\.webp$/)
  const w = await guide.getAttribute('width')
  expect(Number(w)).toBeGreaterThan(0)
})
