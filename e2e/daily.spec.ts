import { expect, test, type Page } from '@playwright/test'
import { answerActivity } from './activity'

// The daily loop on Learn: today's goal and quests, the chest, the streak-at-risk card, and resuming a lesson.
const onboarded = (page: Page, extra: Record<string, string> = {}) =>
  page.addInitScript((items) => {
    localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true, minutes: 5 }))
    for (const [k, v] of Object.entries(items)) if (!localStorage.getItem(k)) localStorage.setItem(k, v)
  }, extra)

const DAY = '2026-11-11'

test('Today: the goal and quests count, and finishing them opens a chest of play money', async ({ page }) => {
  await page.clock.setFixedTime(new Date(`${DAY}T10:00:00`))
  // Everything a quest can ask for is done today, so the chest is ready whichever three the day picked
  const daily = { day: DAY, lessons: 2, correct: 5, perfect: 1, portfolio: true, claimed: false }
  await onboarded(page, {
    'progress:v2': JSON.stringify({ bank: 1000, lessonsDone: ['investing/basics/why', 'investing/basics/compounding'], time: { [DAY]: 400 }, daily }),
  })
  await page.goto('./')
  const today = page.getByRole('region', { name: 'Today' })
  await expect(today).toContainText("Today's goal met: 5 min")
  await expect(today.getByRole('listitem')).toHaveCount(3)
  await expect(today.getByRole('listitem').first()).toContainText('Finish a lesson')
  await today.getByRole('button', { name: "Open today's chest" }).click()
  await expect(today.getByRole('status')).toContainText(/Chest opened: \W*\+\$\d+\W* play money/)
  const saved = JSON.parse((await page.evaluate(() => localStorage.getItem('progress:v2')))!)
  expect(saved.daily.claimed).toBe(true)
  expect(saved.bank).toBeGreaterThan(1000)
  // Claimed once a day: a reload keeps it opened
  await page.reload()
  await expect(today.getByRole('button', { name: "Open today's chest" })).toHaveCount(0)
})

test('Today: a fresh day starts with the goal at zero and the chest closed', async ({ page }) => {
  await page.clock.setFixedTime(new Date(`${DAY}T10:00:00`))
  await onboarded(page)
  await page.goto('./')
  const today = page.getByRole('region', { name: 'Today' })
  await expect(today).toContainText('0 of 5 min today')
  await expect(today).toContainText('Finish all three')
})

test('in the evening, a streak with no lesson today shows a card to keep it', async ({ page }) => {
  await page.clock.setFixedTime(new Date(`${DAY}T19:30:00`))
  await onboarded(page, { 'progress:v2': JSON.stringify({ bank: 1000, streak: { count: 4, lastDay: '2026-11-10' } }) })
  await page.goto('./')
  const card = page.getByRole('link', { name: /Keep your 4-day streak/ })
  await expect(card).toBeVisible()
  await card.click()
  await expect(page).toHaveURL(/\/learn\/why$/)
})

test('no at-risk card in the morning, or once a lesson is done today', async ({ page }) => {
  await page.clock.setFixedTime(new Date(`${DAY}T09:00:00`))
  await onboarded(page, { 'progress:v2': JSON.stringify({ bank: 1000, streak: { count: 4, lastDay: '2026-11-10' } }) })
  await page.goto('./')
  await expect(page.getByText('Up next')).toBeVisible()
  await expect(page.getByRole('link', { name: /Keep your/ })).toHaveCount(0)
})

test('leaving a lesson and coming back carries on from the same step', async ({ page }) => {
  await onboarded(page)
  await page.goto('course/investing/basics/learn/why')
  const bar = page.getByRole('progressbar', { name: /lesson/i })
  await expect(bar).toHaveAttribute('aria-valuenow', '0')
  await answerActivity(page)
  await page.keyboard.press('Enter')
  await answerActivity(page)
  await page.keyboard.press('Enter')
  await expect(bar).not.toHaveAttribute('aria-valuenow', '0')
  const step = await bar.getAttribute('aria-valuenow')
  await page.goto('./')
  await page.goto('course/investing/basics/learn/why')
  await expect(bar).toHaveAttribute('aria-valuenow', step!)
})
