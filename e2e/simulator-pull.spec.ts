import { expect, test, type Page } from '@playwright/test'
import { openSimulator, withPractice } from './practice'

// The simulator's pull on Learn: "while you were away", the portfolio row, and this week's challenge.
const onboarded = (page: Page, progress: string) =>
  page.addInitScript((p) => {
    localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
    if (!localStorage.getItem('progress:v2')) localStorage.setItem('progress:v2', p)
  }, progress)

test('a day after a buy, Learn says what happened while you were away; opening the portfolio puts it away', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-11T08:00:00') })
  await onboarded(page, withPractice({ bank: 1240 }))
  await openSimulator(page)
  await page.getByRole('button', { name: 'Buy Safe Savings' }).click()
  await page.getByRole('button', { name: '$100', exact: true }).click()
  await page.getByRole('button', { name: /^Buy .*100/ }).click()
  await expect(page.getByRole('button', { name: 'Buy or sell' })).toBeVisible()

  await page.goto('./')
  const away = page.getByRole('region', { name: 'While you were away' })
  await expect(page.getByRole('link', { name: /Your portfolio/ })).toBeVisible()
  await expect(away).toHaveCount(0) // just looked: nothing to say yet

  await page.clock.fastForward('24:00:00') // a real day: about seven simulated weeks
  await page.reload()
  await expect(away).toBeVisible()
  await expect(away).toContainText(/\d+ simulated weeks went by/)
  await away.getByRole('link', { name: 'See your portfolio' }).click()
  await expect(page).toHaveURL(/\/portfolio$/)
  // This week's challenge sits on the portfolio while the season runs
  await expect(page.getByText("This week's challenge")).toBeVisible()
  await expect(page.getByText(/Year 1 of the season · ends in about \d+ days/)).toBeVisible()

  await page.goto('./')
  await expect(page.getByRole('link', { name: /Your portfolio/ })).toBeVisible()
  await expect(away).toHaveCount(0)
})

test('between seasons the portfolio row shows the play money waiting, not $0', async ({ page }) => {
  await onboarded(page, withPractice({ bank: 1240 }))
  await page.goto('./')
  const row = page.getByRole('link', { name: /Your portfolio/ })
  await expect(row).toContainText('$1,240')
})
