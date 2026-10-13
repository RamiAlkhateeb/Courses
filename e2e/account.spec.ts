import { expect, test, type Page, type Route } from '@playwright/test'

// Accounts against a fake Supabase: every request to the made-up project is answered here, so the sign-up and
// sign-in flows (and the sync that follows) are tested end to end without a real database.
const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString('base64url')
const USER = { id: '11111111-1111-4111-8111-111111111111', aud: 'authenticated', role: 'authenticated', email: 'learner@example.com', app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' }
const session = () => ({
  access_token: `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: USER.id, exp: Math.floor(Date.now() / 1000) + 3600, role: 'authenticated' })}.sig`,
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: 'fake-refresh',
  user: USER,
})
const json = (route: Route, status: number, body: unknown) => route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) })

interface Fake {
  rows: Record<string, { key: string; data: unknown; updated_at: string }>
  upserts: string[][]
  signupNeedsConfirmation: boolean
}

async function fakeSupabase(page: Page, opts: Partial<Fake> = {}) {
  const fake: Fake = { rows: {}, upserts: [], signupNeedsConfirmation: false, ...opts }
  await page.route('https://fake-project.supabase.co/**', async (route) => {
    const req = route.request()
    const url = new URL(req.url())
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } })
    if (url.pathname.endsWith('/auth/v1/signup')) return fake.signupNeedsConfirmation ? json(route, 200, USER) : json(route, 200, session())
    if (url.pathname.endsWith('/auth/v1/token')) {
      const body = req.postDataJSON() as { password?: string }
      if (body.password === 'unconfirmed') return json(route, 400, { code: 'email_not_confirmed', error_code: 'email_not_confirmed', msg: 'Email not confirmed', message: 'Email not confirmed' })
      return body.password === 'right-password' ? json(route, 200, session()) : json(route, 400, { code: 'invalid_credentials', error_code: 'invalid_credentials', msg: 'Invalid login credentials', message: 'Invalid login credentials' })
    }
    if (url.pathname.endsWith('/auth/v1/user')) return json(route, 200, USER)
    if (url.pathname.endsWith('/auth/v1/logout')) return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*' } })
    if (url.pathname.endsWith('/rest/v1/user_state')) {
      if (req.method() === 'GET') return json(route, 200, Object.values(fake.rows))
      if (req.method() === 'POST') {
        const sent = req.postDataJSON() as { key: string; data: unknown }[]
        fake.upserts.push(sent.map((r) => r.key))
        const out = sent.map((r) => ({ key: r.key, updated_at: new Date().toISOString() }))
        sent.forEach((r, i) => (fake.rows[r.key] = { key: r.key, data: r.data, updated_at: out[i].updated_at }))
        return json(route, 201, out)
      }
    }
    return json(route, 404, { message: 'not faked: ' + url.pathname })
  })
  return fake
}

const onboarded = (page: Page, progress?: object) =>
  page.addInitScript((p) => {
    localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
    if (p) localStorage.setItem('progress:v2', JSON.stringify(p))
  }, progress)

async function fill(page: Page, email: string, password: string) {
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
}

test('create an account: signs up, syncs the guest progress up, and leaves the account page', async ({ page }) => {
  const fake = await fakeSupabase(page)
  await onboarded(page, { bank: 1180, lessonsDone: ['investing/basics/why'] })
  await page.goto('account')
  await page.getByRole('button', { name: 'Create account' }).first().click()
  await fill(page, 'learner@example.com', 'right-password')
  await page.getByRole('button', { name: 'Create account' }).last().click()
  await expect(page).toHaveURL(/\/Courses\/$/)
  // the guest's progress reached the account
  await expect.poll(() => fake.rows.progress !== undefined).toBe(true)
  expect((fake.rows.progress.data as { bank: number }).bank).toBe(1180)
  // and the app now knows who is signed in
  await page.goto('me')
  await expect(page.getByText('learner@example.com')).toBeVisible()
})

test('sign in: a wrong password says so, the right one works, and it stays signed in after a reload', async ({ page }) => {
  await fakeSupabase(page)
  await onboarded(page)
  await page.goto('account')
  await fill(page, 'learner@example.com', 'wrong')
  await page.getByRole('button', { name: 'Sign in' }).last().click()
  await expect(page.getByRole('alert')).toContainText('do not match')
  await fill(page, 'learner@example.com', 'right-password')
  await page.getByRole('button', { name: 'Sign in' }).last().click()
  await expect(page).toHaveURL(/\/Courses\/$/)
  await page.reload()
  await page.goto('me')
  await expect(page.getByText('learner@example.com')).toBeVisible()
})

test('sign in on a second device brings the account progress down', async ({ page }) => {
  const progress = { answers: {}, sectionsRead: {}, bank: 1500, streak: { count: 3, lastDay: '2026-10-01' }, boxes: {}, lessonsDone: ['investing/basics/why', 'investing/basics/compounding'], activity: {} }
  await fakeSupabase(page, { rows: { progress: { key: 'progress', data: progress, updated_at: '2026-10-02T00:00:00Z' } } })
  await onboarded(page)
  await page.goto('account')
  await fill(page, 'learner@example.com', 'right-password')
  await page.getByRole('button', { name: 'Sign in' }).last().click()
  await expect(page).toHaveURL(/\/Courses\/$/)
  const saved = JSON.parse((await page.evaluate(() => localStorage.getItem('progress:v2')))!)
  expect(saved.bank).toBe(1500)
  expect(saved.lessonsDone).toHaveLength(2)
})

test('when the project asks for email confirmation, the screen says to check the inbox instead of hanging', async ({ page }) => {
  await fakeSupabase(page, { signupNeedsConfirmation: true })
  await onboarded(page)
  await page.goto('account')
  await page.getByRole('button', { name: 'Create account' }).first().click()
  await fill(page, 'learner@example.com', 'right-password')
  await page.getByRole('button', { name: 'Create account' }).last().click()
  await expect(page.getByRole('status')).toContainText('Check your email')
  await expect(page).toHaveURL(/\/account$/)
})

test('signing in before confirming the email explains what to do', async ({ page }) => {
  await fakeSupabase(page)
  await onboarded(page)
  await page.goto('account')
  await fill(page, 'learner@example.com', 'unconfirmed')
  await page.getByRole('button', { name: 'Sign in' }).last().click()
  await expect(page.getByRole('alert')).toContainText('Confirm your email')
})

test('sign out keeps the local copy and returns to the guest view', async ({ page }) => {
  await fakeSupabase(page)
  await onboarded(page, { bank: 1180, lessonsDone: ['investing/basics/why'] })
  await page.goto('account')
  await fill(page, 'learner@example.com', 'right-password')
  await page.getByRole('button', { name: 'Sign in' }).last().click()
  await expect(page).toHaveURL(/\/Courses\/$/)
  await page.goto('account')
  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page).toHaveURL(/\/me$/)
  expect(JSON.parse((await page.evaluate(() => localStorage.getItem('progress:v2')))!).lessonsDone).toContain('investing/basics/why')
})
