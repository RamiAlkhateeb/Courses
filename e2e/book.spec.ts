import { expect, test, type Page } from '@playwright/test'
import { fakeSupabase } from './fakeSupabase'

// The course book: members download the PDF from private storage; guests are asked to sign up. The book's text is
// never in the deployed app (it lives only in book builds), so the PDF is the only way to read it.
const onboarded = (page: Page) =>
  page.addInitScript(() => {
    if (!localStorage.getItem('profile:v1')) localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
  })

test('a guest sees "Sign up to download the book" on Home, and the book page is not part of the app', async ({ page }) => {
  await fakeSupabase(page)
  await onboarded(page)
  await page.goto('./')
  await page.getByRole('link', { name: 'Sign up to download the book' }).click()
  await expect(page).toHaveURL(/\/signup$/)
  await page.goto('book/investing')
  await expect(page.getByText('Page not found', { exact: false })).toBeVisible()
})

test('a signed-in member downloads the book as a PDF', async ({ page }) => {
  const fake = await fakeSupabase(page)
  await onboarded(page)
  await page.goto('login')
  await page.getByLabel('Email').fill('learner@example.com')
  await page.getByLabel('Password', { exact: true }).fill('right-password')
  await page.getByRole('button', { name: 'Log in' }).click()
  await expect(page).toHaveURL(/\/Courses\/$/)
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download the book (PDF)' }).click()
  expect((await download).suggestedFilename()).toBe('Zubda - Investing Fundamentals.pdf')
  expect(fake.calls).toContain('POST storage sign investing.en.pdf')
})

test('a member is told when the book is not ready yet', async ({ page }) => {
  await fakeSupabase(page, { bookMissing: true })
  await onboarded(page)
  await page.goto('login')
  await page.getByLabel('Email').fill('learner@example.com')
  await page.getByLabel('Password', { exact: true }).fill('right-password')
  await page.getByRole('button', { name: 'Log in' }).click()
  await page.getByRole('button', { name: 'Download the book (PDF)' }).click()
  await expect(page.getByRole('alert')).toHaveText('The book is not ready yet. Try again soon.')
})
