import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { fakeSupabase } from './fakeSupabase'

const onboarded = (page: Page, progress?: object, lang?: string) =>
  page.addInitScript(
    ([p, l]) => {
      localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
      if (p) localStorage.setItem('progress:v2', JSON.stringify(p))
      if (l) localStorage.setItem('lang', l)
    },
    [progress, lang] as const,
  )

async function signUpForm(page: Page, opts: { name?: string; email?: string; password?: string; agree?: boolean } = {}) {
  await page.getByLabel('Name').fill(opts.name ?? 'Aya')
  await page.getByLabel('Email').fill(opts.email ?? 'learner@example.com')
  await page.getByLabel('Password', { exact: true }).fill(opts.password ?? 'right-password1')
  if (opts.agree !== false) await page.getByRole('checkbox').check()
}

async function logIn(page: Page, email: string, password: string) {
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Log in' }).click()
}

const GOOD = { bank: 1180, lessonsDone: ['investing/basics/why'] }

test('Learn shows a Log in button while signed out, and it goes away once signed in', async ({ page }) => {
  await fakeSupabase(page)
  await onboarded(page)
  await page.goto('./')
  const cta = page.getByRole('link', { name: 'Log in' })
  await expect(cta).toBeVisible()
  await cta.click()
  await expect(page).toHaveURL(/\/login$/)
  await logIn(page, 'learner@example.com', 'right-password')
  await expect(page).toHaveURL(/\/Courses\/$/)
  await expect(page.getByRole('link', { name: 'Log in' })).toHaveCount(0)
})

test('guests get the first three lessons; the rest and the unit reviews ask for an account', async ({ page }) => {
  await fakeSupabase(page)
  await onboarded(page)
  await page.goto('./')
  await expect(page.getByRole('link', { name: /Sign up to unlock/ }).first()).toBeVisible()
  await page.goto('course/investing/basics/learn/why')
  await expect(page.getByRole('heading', { name: 'Create a free account to keep learning' })).toHaveCount(0)
  await page.goto('course/investing/asset-classes/learn/stocks')
  await expect(page.getByRole('heading', { name: 'Create a free account to keep learning' })).toBeVisible()
  await page.goto('course/investing/basics/lesson')
  await expect(page.getByRole('heading', { name: 'Create a free account to keep learning' })).toBeVisible()
  await page.getByRole('link', { name: 'Create account' }).click()
  await expect(page).toHaveURL(/\/signup$/)
})

test('signed in, every lesson opens', async ({ page }) => {
  await fakeSupabase(page)
  await onboarded(page)
  await page.goto('login')
  await logIn(page, 'learner@example.com', 'right-password')
  await expect(page).toHaveURL(/\/Courses\/$/)
  await expect(page.getByRole('link', { name: /Sign up to unlock/ })).toHaveCount(0)
  await page.goto('course/investing/asset-classes/learn/stocks')
  await expect(page.getByRole('heading', { name: 'Create a free account to keep learning' })).toHaveCount(0)
})

test('Welcome: "I already have an account" opens Log in', async ({ page }) => {
  await fakeSupabase(page)
  await page.goto('welcome')
  await page.getByRole('button', { name: 'I already have an account' }).click()
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible()
})

test('sign up: the rules are shown and enforced, then it signs up and syncs the guest progress up', async ({ page }) => {
  const fake = await fakeSupabase(page)
  await onboarded(page, GOOD)
  await page.goto('signup')
  await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible()
  // submitting an empty form explains what is missing and sends nothing
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page.getByText('Enter your name.')).toBeVisible()
  await expect(page.getByText('Please agree to the terms to continue.')).toBeVisible()
  expect(fake.calls).toEqual([])
  // a weak password keeps its rules unmet; a good one meets all three
  await page.getByLabel('Password', { exact: true }).fill('short')
  await expect(page.getByRole('listitem').filter({ hasText: '8+ characters' })).not.toContainText('✓')
  await signUpForm(page)
  for (const rule of ['8+ characters', 'One number', 'One letter']) await expect(page.getByRole('listitem').filter({ hasText: rule })).toContainText('✓')
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page).toHaveURL(/\/Courses\/$/)
  expect(fake.bodies.signup).toMatchObject({ email: 'learner@example.com', data: { name: 'Aya' } })
  await expect.poll(() => fake.rows.progress !== undefined).toBe(true)
  expect((fake.rows.progress.data as { bank: number }).bank).toBe(1180)
  await page.goto('me')
  await expect(page.getByText('Aya', { exact: true })).toBeVisible() // the name, not the email, on the Me row
})

test('there is no email confirmation step: no confirm-email screen', async ({ page }) => {
  await onboarded(page)
  await page.goto('confirm-email') // an unknown route
  await expect(page.getByRole('heading', { name: 'Confirm your email' })).toHaveCount(0)
})

test('log in: a wrong password says so (and the mascot looks sheepish), the right one works, and it survives a reload', async ({ page }) => {
  await fakeSupabase(page)
  await onboarded(page)
  await page.goto('login')
  await logIn(page, 'learner@example.com', 'wrong')
  await expect(page.getByRole('alert')).toContainText('That email and password do not match.')
  await expect(page.getByText('Hmm, that did not work. Let us try again.')).toBeVisible()
  await page.getByLabel('Password', { exact: true }).fill('right-password')
  await page.getByRole('button', { name: 'Log in' }).click()
  await expect(page).toHaveURL(/\/Courses\/$/)
  await page.reload()
  await page.goto('me')
  await expect(page.getByText('learner@example.com')).toBeVisible()
})

test('log in on a second device brings the account progress down', async ({ page }) => {
  const progress = { answers: {}, sectionsRead: {}, bank: 1500, streak: { count: 3, lastDay: '2026-10-01' }, boxes: {}, lessonsDone: ['investing/basics/why', 'investing/basics/compounding'], activity: {} }
  await fakeSupabase(page, { rows: { progress: { key: 'progress', data: progress, updated_at: '2026-10-02T00:00:00Z' } } })
  await onboarded(page)
  await page.goto('login')
  await logIn(page, 'learner@example.com', 'right-password')
  await expect(page).toHaveURL(/\/Courses\/$/)
  const saved = JSON.parse((await page.evaluate(() => localStorage.getItem('progress:v2')))!)
  expect(saved.bank).toBe(1500)
  expect(saved.lessonsDone).toHaveLength(2)
})

test('forgot password: asks for the email, then "Check your email" with a resend wait', async ({ page }) => {
  const fake = await fakeSupabase(page)
  await onboarded(page)
  await page.goto('login')
  await page.getByRole('link', { name: 'Forgot password?' }).click()
  await expect(page.getByRole('heading', { name: 'Forgot your password?' })).toBeVisible()
  await page.getByLabel('Email').fill('not-an-email')
  await page.getByRole('button', { name: 'Send reset link' }).click()
  await expect(page.getByRole('alert')).toContainText('valid email')
  await page.getByLabel('Email').fill('anyone@example.com')
  await page.getByRole('button', { name: 'Send reset link' }).click()
  await expect(page).toHaveURL(/\/check-email$/)
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible()
  await expect(page.getByText('anyone@example.com')).toBeVisible()
  expect(fake.calls.some((c) => c.includes('recover'))).toBe(true)
  expect(JSON.stringify(fake.bodies.recover)).not.toContain('password')
  await page.getByRole('button', { name: 'Use a different email' }).click()
  await expect(page).toHaveURL(/\/forgot-password$/)
})

test('Me gear opens Settings, Settings opens Account: edit the name, change the daily goal and language, open the legal pages', async ({ page }) => {
  const fake = await fakeSupabase(page)
  await onboarded(page, GOOD)
  await page.goto('signup')
  await signUpForm(page)
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page).toHaveURL(/\/Courses\/$/)
  await page.goto('me')
  await page.getByRole('link', { name: 'Settings' }).click()
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
  await page.getByRole('link', { name: /Account/ }).click()
  await expect(page.getByRole('heading', { name: 'Account' })).toBeVisible()
  // Account keeps only the profile and Delete account
  await expect(page.getByRole('button', { name: 'Log out' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /Language/ })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Delete account' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Name\s*Aya/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Email\s*learner@example.com/ })).toBeVisible()
  // edit the name
  await page.getByRole('button', { name: /Name\s*Aya/ }).click()
  await page.getByLabel('Name').fill('Aya  Rami')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('button', { name: /Name\s*Aya Rami/ })).toBeVisible()
  expect(fake.bodies.user).toMatchObject({ data: { name: 'Aya Rami' } })
  await page.getByRole('button', { name: 'Back' }).click()
  await expect(page).toHaveURL(/\/settings$/)
  // daily goal
  await page.getByRole('button', { name: /Daily goal/ }).click()
  await page.getByRole('option', { name: /20 min/ }).click()
  expect(JSON.parse((await page.evaluate(() => localStorage.getItem('profile:v1')))!).minutes).toBe(20)
  // language
  await page.getByRole('button', { name: /Language/ }).click()
  await page.getByRole('option', { name: /العربية/ }).click()
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await page.evaluate(() => localStorage.setItem('lang', 'en'))
  await page.reload()
  // legal pages
  await page.getByRole('link', { name: 'Terms of Use' }).click()
  await expect(page.getByRole('heading', { name: 'Terms of Use', level: 1 })).toBeVisible()
  await expect(page.getByText('play money', { exact: false }).first()).toBeVisible()
  await page.goBack()
  await page.getByRole('link', { name: 'Privacy Policy' }).click()
  await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible()
  await page.goBack()
  await page.getByRole('link', { name: 'Help and support' }).click()
  await expect(page.getByRole('heading', { name: 'Help and support', level: 1 })).toBeVisible()
})

test('change password from Account: both fields must match before it saves', async ({ page }) => {
  const fake = await fakeSupabase(page)
  await onboarded(page)
  await page.goto('login')
  await logIn(page, 'learner@example.com', 'right-password')
  await expect(page).toHaveURL(/\/Courses\/$/)
  await page.goto('account')
  await page.getByRole('link', { name: /Password/ }).click()
  await expect(page.getByRole('heading', { name: 'Choose a new password' })).toBeVisible()
  await page.getByLabel('New password').fill('brand-new-pass1')
  await page.getByLabel('Confirm password').fill('different-pass1')
  await page.getByRole('button', { name: 'Save password' }).click()
  await expect(page.getByText('Passwords do not match')).toBeVisible()
  expect(fake.calls.some((c) => c.startsWith('PUT user'))).toBe(false)
  await page.getByLabel('Confirm password').fill('brand-new-pass1')
  await expect(page.getByText('Passwords match')).toBeVisible()
  await page.getByRole('button', { name: 'Save password' }).click()
  await expect(page).toHaveURL(/\/account$/)
  expect(fake.bodies.user).toMatchObject({ password: 'brand-new-pass1' })
})

test('Settings works as a guest: no Log out, and the Account row opens Log in', async ({ page }) => {
  await fakeSupabase(page)
  await onboarded(page)
  await page.goto('me')
  await expect(page.getByRole('heading', { name: 'Save your progress' })).toBeVisible()
  await page.getByRole('link', { name: 'Settings' }).click()
  await expect(page.getByRole('button', { name: 'Log out' })).toHaveCount(0)
  await page.getByRole('link', { name: /Account/ }).click()
  await expect(page).toHaveURL(/\/login$/)
})

test('log out keeps the local copy and returns to the guest view', async ({ page }) => {
  await fakeSupabase(page)
  await onboarded(page, GOOD)
  await page.goto('login')
  await logIn(page, 'learner@example.com', 'right-password')
  await expect(page).toHaveURL(/\/Courses\/$/)
  await page.goto('settings')
  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page).toHaveURL(/\/me$/)
  expect(JSON.parse((await page.evaluate(() => localStorage.getItem('progress:v2')))!).lessonsDone).toContain('investing/basics/why')
  await page.goto('account') // signed out: Account sends you to Log in
  await expect(page).toHaveURL(/\/login$/)
})

test('delete account: the red button waits for DELETE, then removes the account and keeps this device\'s copy', async ({ page }) => {
  const fake = await fakeSupabase(page)
  await onboarded(page, GOOD)
  await page.goto('login')
  await logIn(page, 'learner@example.com', 'right-password')
  await expect(page).toHaveURL(/\/Courses\/$/)
  await page.goto('account/delete')
  await expect(page.getByRole('heading', { name: 'Delete your account?' })).toBeVisible()
  await expect(page.getByText('What we will delete')).toBeVisible()
  const del = page.getByRole('button', { name: 'Delete my account forever' })
  await expect(del).toBeDisabled()
  await page.getByLabel('Type DELETE to confirm').fill('DELET')
  await expect(del).toBeDisabled()
  await page.getByLabel('Type DELETE to confirm').fill('delete')
  await expect(del).toBeEnabled()
  await del.click()
  await expect(page).toHaveURL(/\/me$/)
  expect(fake.calls.some((c) => c.includes('rpc/delete_my_account'))).toBe(true)
  expect(JSON.parse((await page.evaluate(() => localStorage.getItem('progress:v2')))!).lessonsDone).toContain('investing/basics/why')
})

test('"Keep my account" goes back to Account without calling the server', async ({ page }) => {
  const fake = await fakeSupabase(page)
  await onboarded(page)
  await page.goto('login')
  await logIn(page, 'learner@example.com', 'right-password')
  await expect(page).toHaveURL(/\/Courses\/$/)
  await page.goto('account/delete')
  await page.getByRole('button', { name: 'Keep my account' }).click()
  await expect(page).toHaveURL(/\/account$/)
  expect(fake.calls.some((c) => c.includes('delete_my_account'))).toBe(false)
})

test('Arabic: sign up and log in are right-to-left, in Arabic, with the Arabic copy from the design', async ({ page }) => {
  await fakeSupabase(page)
  await onboarded(page, undefined, 'ar')
  await page.goto('signup')
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.getByRole('heading', { name: 'أنشئ حسابك' })).toBeVisible()
  await expect(page.getByText('8 أحرف على الأقل')).toBeVisible()
  await expect(page.getByRole('link', { name: 'شروط الاستخدام' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.goto('login')
  await expect(page.getByRole('heading', { name: 'تسجيل الدخول' })).toBeVisible()
  await expect(page.getByText('أهلاً بعودتك! جاهز تكمل النمو؟')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

for (const lang of ['en', 'ar'] as const) {
  test(`account screens have no serious accessibility violations (${lang})`, async ({ page }) => {
    await fakeSupabase(page)
    await onboarded(page, GOOD, lang)
    const routes = ['./', 'me', 'settings', 'signup', 'login', 'forgot-password', 'legal/terms', 'legal/privacy', 'legal/help']
    for (const route of routes) {
      await page.goto(route)
      await page.waitForTimeout(300)
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
      const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(serious.map((v) => `${route} ${v.id}: ${v.nodes[0]?.target}`)).toEqual([])
    }
    // the signed-in screens
    await page.goto('login')
    await page.getByLabel(lang === 'en' ? 'Email' : 'البريد الإلكتروني').fill('learner@example.com')
    await page.getByLabel(lang === 'en' ? 'Password' : 'كلمة المرور', { exact: true }).fill('right-password')
    await page.locator('form button[type=submit]').click()
    await expect(page).toHaveURL(/\/Courses\/$/)
    for (const route of ['me', 'settings', 'account', 'account/delete', 'new-password']) {
      await page.goto(route)
      await page.waitForTimeout(400)
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
      const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(serious.map((v) => `${route} ${v.id}: ${v.nodes[0]?.target}`)).toEqual([])
    }
  })
}
