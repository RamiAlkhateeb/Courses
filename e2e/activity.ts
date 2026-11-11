import type { Page } from '@playwright/test'

/** Answers the activity on the current lesson step, if there is one (guess first, what would you do, sort, myth or
 *  fact), by taking the first option each time, so Next can move on. */
export async function answerActivity(page: Page) {
  // Wait for the step to be drawn (briefly: after the last step there is no lesson any more)
  await page.getByRole('progressbar', { name: 'Lesson progress' }).waitFor({ timeout: 3000 }).catch(() => {})
  const activity = page.locator('section[aria-label="Guess first"], section[aria-label="What would you do?"], section[aria-label="Sort it"], section[aria-label="Myth or fact?"]')
  if (!(await activity.count())) return
  const label = await activity.first().getAttribute('aria-label')
  if (label === 'Sort it') {
    for (let i = 0; i < 12; i++) {
      const buttons = activity.locator('li button')
      if (!(await buttons.count())) break
      await buttons.first().click()
    }
  } else {
    const first = activity.locator('[role="group"] button').first()
    if (await first.isEnabled()) await first.click()
  }
  // A focused option handles its own Enter (a choice stays tappable), so let Enter go back to the lesson
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
}
