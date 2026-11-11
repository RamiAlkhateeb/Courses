import { expect, test, type Page } from '@playwright/test'
import { answerActivity } from './activity'
import { appCourses } from '../src/content/courses'
import { lessonKey, lessonsFor } from '../src/domain/lessons'

// Rewards: 2× today, badges and levels on Me, the unit-complete moment, and the course certificate with its real date.
const onboarded = (page: Page, progress: object) =>
  page.addInitScript((p) => {
    localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
    if (!localStorage.getItem('progress:v2')) localStorage.setItem('progress:v2', JSON.stringify(p))
  }, progress)

const DAY = '2026-11-11'
const basics = ['why', 'compounding', 'risk-return', 'ready', 'practice-first-buy'].map((l) => `investing/basics/${l}`)

test('a 3-day streak makes the first lesson of the day pay double, and Learn says so', async ({ page }) => {
  await page.clock.install({ time: new Date(`${DAY}T10:00:00`) })
  await onboarded(page, { bank: 1000, streak: { count: 3, lastDay: '2026-11-10' } })
  await page.goto('./')
  await expect(page.getByText('2× play money on your first lesson today')).toBeVisible()
})

test('Me shows the level and badges, earned ones with their day and the next ones locked', async ({ page }) => {
  await onboarded(page, { bank: 1000, lessonsDone: basics.slice(0, 4), badges: { 'first-lesson': '2026-11-01' } })
  await page.goto('me')
  await expect(page.getByRole('heading', { name: 'Level 2: Planner' })).toBeVisible()
  await expect(page.getByText('First step')).toBeVisible()
  await expect(page.getByText('Earned Nov 1, 2026')).toBeVisible()
  await expect(page.getByText(/Next up · Reach a 3-day streak/)).toBeVisible()
})

test('finishing the last lesson of a unit celebrates it and links its certificate, dated that day', async ({ page }) => {
  await page.clock.install({ time: new Date(`${DAY}T10:00:00`) })
  // Everything in unit 1 but its first lesson (a free one, so a guest can open it)
  await onboarded(page, { bank: 1000, lessonsDone: basics.filter((k) => !k.endsWith('/why')) })
  await page.goto('course/investing/basics/learn/why')
  const certificate = page.getByRole('link', { name: 'See your certificate' })
  for (let i = 0; i < 30 && !(await certificate.isVisible()); i++) {
    await answerActivity(page)
    if (await page.getByRole('radio').count()) {
      await page.keyboard.press('1')
      await page.keyboard.press('Enter')
    }
    await page.keyboard.press('Enter')
    await page.waitForTimeout(150)
  }
  await expect(page.getByRole('heading', { name: 'Unit complete!' })).toBeVisible()
  await expect(page.getByRole('list', { name: 'Rewards' })).toContainText('Unit one done')
  const saved = JSON.parse((await page.evaluate(() => localStorage.getItem('progress:v2')))!)
  expect(saved.completed['investing/basics/why']).toBe(DAY)
  expect(saved.badges['unit-1']).toBe(DAY)
  await certificate.click()
  await expect(page).toHaveURL(/\/certificate\/investing\/basics$/)
  await expect(page.getByRole('img', { name: /November 11, 2026/ })).toBeVisible()
})

test('the course certificate shows the day the last lesson was first finished', async ({ page }) => {
  // Every lesson of the course, finished on dated days: the last one on Oct 20
  const keys: string[] = []
  for (const course of appCourses)
    for (const load of Object.values(course.loaders)) {
      const mod = await load()
      for (const lesson of lessonsFor(mod)) keys.push(lessonKey(course.id, mod.id, lesson.id))
    }
  const completed = Object.fromEntries(keys.map((k, i) => [k, i === 3 ? '2026-10-20' : '2026-10-01']))
  await onboarded(page, { bank: 1000, lessonsDone: keys, completed })
  await page.goto('certificate/investing')
  await expect(page.getByRole('img', { name: /Investing Fundamentals.*October 20, 2026/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Course certificate' })).toBeVisible()
})
