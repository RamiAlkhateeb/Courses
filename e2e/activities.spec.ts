import { expect, test, type Page } from '@playwright/test'

// Lesson activities (unit 1 pilot): guess first, sort, what would you do, myth or fact. Not scored; Next waits for them.
const onboarded = (page: Page) =>
  page.addInitScript(() => {
    if (!localStorage.getItem('profile:v1')) localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
  })
const next = (page: Page) => page.getByRole('button', { name: 'Next', exact: true })

test('guess first: Next waits for the guess, which then shows how close it was', async ({ page }) => {
  await onboarded(page)
  await page.goto('course/investing/basics/learn/why')
  const guess = page.getByRole('region', { name: 'Guess first' })
  await expect(guess).toContainText('In 24 years')
  await expect(next(page)).toBeDisabled()
  await guess.getByRole('button', { name: 'About 750 worth' }).click()
  await expect(guess.getByRole('status')).toContainText('Close!')
  await expect(guess.getByRole('status')).toContainText('About 492 worth')
  await expect(guess.getByRole('button', { name: /About 500 worth/ })).toBeDisabled()
  await expect(next(page)).toBeEnabled()
})

test('sort: each item shows right or where it belongs, then the tally', async ({ page }) => {
  await onboarded(page)
  await page.goto('course/investing/basics/learn/why')
  await page.getByRole('region', { name: 'Guess first' }).getByRole('button').first().click()
  const sort = page.getByRole('region', { name: 'Sort it' })
  for (let i = 0; i < 4 && !(await sort.isVisible()); i++) await next(page).click()
  await expect(next(page)).toBeDisabled()
  // Everything into "Saving": two right, two wrong
  for (let i = 0; i < 4; i++) await sort.getByRole('button', { name: 'Saving' }).first().click()
  await expect(sort).toContainText('Belongs in: Investing')
  await expect(sort.getByRole('status')).toContainText('2 of 4 right')
  await expect(next(page)).toBeEnabled()
})

test('what would you do: each option shows where it leads, and another can be compared', async ({ page }) => {
  await onboarded(page)
  await page.goto('course/investing/basics/learn/risk-return')
  const choice = page.getByRole('region', { name: 'What would you do?' })
  await expect(next(page)).toBeDisabled()
  await choice.getByRole('button', { name: /Sell everything/ }).click()
  await expect(choice.getByRole('status')).toContainText('real loss')
  await choice.getByRole('button', { name: /Hold and wait/ }).click()
  await expect(choice.getByRole('status')).toContainText('no guarantee')
  await expect(next(page)).toBeEnabled()
})

test('myth or fact, in Arabic', async ({ page }) => {
  await onboarded(page)
  await page.addInitScript(() => localStorage.setItem('lang', 'ar'))
  await page.goto('course/investing/basics/learn/compounding')
  await page.getByRole('region', { name: 'خمّن أولًا' }).getByRole('button').first().click()
  const myth = page.getByRole('region', { name: 'خرافة أم حقيقة؟' })
  for (let i = 0; i < 8 && !(await myth.isVisible()); i++) await page.getByRole('button', { name: 'التالي', exact: true }).click()
  await myth.getByRole('button', { name: 'حقيقة' }).click()
  await expect(myth.getByRole('status')).toContainText('إنها خرافة')
})

test('a finished lesson never waits on its activities', async ({ page }) => {
  await onboarded(page)
  await page.addInitScript(() => localStorage.setItem('progress:v2', JSON.stringify({ bank: 1000, lessonsDone: ['investing/basics/why'] })))
  await page.goto('course/investing/basics/learn/why')
  await expect(next(page)).toBeEnabled()
})
