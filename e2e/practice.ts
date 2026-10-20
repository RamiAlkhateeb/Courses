import { expect, type Page } from '@playwright/test'

// The simulator lives in the practice lessons. Tests that exercise the simulator open the basics practice lesson as a
// replay (it is in lessonsDone), so guests may open it and Next never waits; e2e/practice.spec.ts covers the waiting.
export const PRACTICE = 'course/investing/basics/learn/practice-first-buy'
export const PRACTICE_DONE = 'investing/basics/practice-first-buy'

/** Saved progress that has finished the basics practice lesson (plus anything else given). */
export const withPractice = (extra: Record<string, unknown> = {}) => JSON.stringify({ bank: 1000, ...extra, lessonsDone: [PRACTICE_DONE, ...((extra.lessonsDone as string[]) ?? [])] })

/** Open the basics practice lesson and step to its simulator card. */
export async function openSimulator(page: Page) {
  await page.goto(PRACTICE)
  const task = page.locator('#practice-task')
  for (let i = 0; i < 6 && !(await task.isVisible()); i++) {
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await page.waitForTimeout(100)
  }
  await expect(task).toBeVisible()
}
