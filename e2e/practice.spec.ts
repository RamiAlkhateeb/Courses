import { expect, test, type Page } from '@playwright/test'
import { fakeSupabase } from './fakeSupabase'
import { PRACTICE } from './practice'

const onboarded = (page: Page) =>
  page.addInitScript(() => {
    localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
    if (!localStorage.getItem('progress:v2')) localStorage.setItem('progress:v2', JSON.stringify({ bank: 1000 }))
  })

async function signIn(page: Page) {
  await fakeSupabase(page)
  await onboarded(page)
  await page.goto('login')
  await page.getByLabel('Email').fill('learner@example.com')
  await page.getByLabel('Password', { exact: true }).fill('right-password')
  await page.getByRole('button', { name: 'Log in' }).click()
  await expect(page).toHaveURL(/\/Courses\/$/)
}

test('two tabs (Learn, Me); old Playground links open the first practice lesson', async ({ page }) => {
  await onboarded(page)
  await page.goto('./')
  const tabs = page.getByRole('navigation').getByRole('link')
  await expect(tabs).toHaveCount(2)
  await expect(tabs.nth(0)).toHaveText(/Learn/)
  await expect(tabs.nth(1)).toHaveText(/Me/)
  await page.goto('playground')
  await expect(page).toHaveURL(new RegExp(`${PRACTICE}$`))
})

test('a practice lesson waits for its task: Next unlocks once the first buy is made', async ({ page }) => {
  await signIn(page)
  await page.goto(PRACTICE)
  const task = page.locator('#practice-task')
  for (let i = 0; i < 6 && !(await task.isVisible()); i++) await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(task).toHaveText('Make your first investment with play money')
  const next = page.getByRole('button', { name: 'Next', exact: true })
  await expect(next).toBeDisabled()
  await expect(page.getByText('Finish the task to continue.')).toBeVisible()
  await page.getByRole('button', { name: 'Buy Safe Savings' }).click()
  await page.getByRole('button', { name: '$100', exact: true }).click()
  await page.getByRole('button', { name: /^Buy .*100/ }).click()
  await expect(page.getByText('Done', { exact: true })).toBeVisible()
  await expect(next).toBeEnabled()
  await next.click()
  await expect(task).toHaveCount(0) // on to the key idea and the quick checks
})
