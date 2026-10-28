import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const onboarded = (page: Page) =>
  page.addInitScript(() => {
    if (!localStorage.getItem('profile:v1')) localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
  })
const theme = (page: Page) => page.locator('html').getAttribute('data-theme')

test('Appearance in Settings switches to dark, and the choice is kept', async ({ page }) => {
  await onboarded(page)
  await page.goto('settings')
  expect(await theme(page)).toBe('light')
  await page.getByRole('button', { name: /Appearance/ }).click()
  await page.getByRole('option', { name: 'Dark' }).click()
  expect(await theme(page)).toBe('dark')
  await page.reload()
  expect(await theme(page)).toBe('dark')
  await expect(page.getByRole('button', { name: /Appearance/ })).toContainText('Dark')
})

test('Same as phone follows the phone, and Light overrides it', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await onboarded(page)
  await page.goto('')
  expect(await theme(page)).toBe('dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await expect.poll(() => theme(page)).toBe('light') // follows a change while open
  await page.evaluate(() => localStorage.setItem('theme:v1', 'light'))
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.reload()
  expect(await theme(page)).toBe('light')
})

for (const path of ['', 'me', 'settings', 'course/investing/basics/learn/why', 'courses']) {
  test(`dark mode keeps AA contrast: /${path}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await onboarded(page)
    await page.goto(path)
    await expect(page.locator('html[data-theme="dark"]')).toHaveCount(1)
    await page.waitForTimeout(300)
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
  })
}

test('share slides stay light inside a dark app', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.setViewportSize({ width: 1080, height: 1350 })
  await page.goto('share/investing/basics/why?slide=2&lang=en')
  const root = page.locator('[data-ready]')
  await expect(root).toHaveAttribute('data-theme', 'light')
  expect(await root.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(244, 250, 251)') // the light mist
})
