import type { Page, Route } from '@playwright/test'

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

export interface Fake {
  rows: Record<string, { key: string; data: unknown; updated_at: string }>
  upserts: string[][]
  signupNeedsConfirmation: boolean
  /** Auth calls received, as 'METHOD /path', so tests can assert what the screens sent */
  calls: string[]
  /** The last body sent to each auth call */
  bodies: Record<string, unknown>
}

export async function fakeSupabase(page: Page, opts: Partial<Fake> = {}) {
  const fake: Fake = { rows: {}, upserts: [], signupNeedsConfirmation: false, calls: [], bodies: {}, ...opts }
  await page.route('https://fake-project.supabase.co/**', async (route) => {
    const req = route.request()
    const url = new URL(req.url())
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } })
    if (url.pathname.includes('/auth/v1/') || url.pathname.includes('/rpc/')) {
      fake.calls.push(`${req.method()} ${url.pathname.replace(/^.*\/(auth\/v1|rest\/v1)\//, '')}`)
      try {
        fake.bodies[url.pathname.split('/').pop()!] = req.postDataJSON()
      } catch {
        // no body
      }
    }
    if (url.pathname.endsWith('/auth/v1/signup')) {
      const name = (req.postDataJSON() as { data?: { name?: string } }).data?.name
      const user = { ...USER, user_metadata: name ? { name } : {} }
      return fake.signupNeedsConfirmation ? json(route, 200, user) : json(route, 200, { ...session(), user })
    }
    if (url.pathname.endsWith('/auth/v1/resend') || url.pathname.endsWith('/auth/v1/recover')) return json(route, 200, {})
    if (url.pathname.endsWith('/rest/v1/rpc/delete_my_account')) return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*' } })
    if (url.pathname.endsWith('/auth/v1/token')) {
      const body = req.postDataJSON() as { password?: string }
      if (body.password === 'unconfirmed') return json(route, 400, { code: 'email_not_confirmed', error_code: 'email_not_confirmed', msg: 'Email not confirmed', message: 'Email not confirmed' })
      return body.password === 'right-password' ? json(route, 200, session()) : json(route, 400, { code: 'invalid_credentials', error_code: 'invalid_credentials', msg: 'Invalid login credentials', message: 'Invalid login credentials' })
    }
    if (url.pathname.endsWith('/auth/v1/user')) {
      if (req.method() === 'PUT') {
        const body = req.postDataJSON() as { data?: { name?: string } }
        return json(route, 200, { ...USER, user_metadata: body.data ?? {} })
      }
      return json(route, 200, USER)
    }
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


