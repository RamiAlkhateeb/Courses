import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import { accountsEnabled, arrivedFromEmailLink, hasStoredSession, loadSupabase } from './supabase'
import { useStore } from './useStore'

export interface AuthUser {
  id: string
  email: string
  /** The display name chosen at sign-up (kept in the account's metadata); empty when there is none */
  name: string
}

/** `off`: accounts are not configured. `loading`: checking a saved sign-in. `recovery`: arrived from a reset-password email. */
export type AuthStatus = 'off' | 'loading' | 'signedOut' | 'signedIn' | 'recovery'
export interface AuthState {
  status: AuthStatus
  user: AuthUser | null
}

let state: AuthState = { status: accountsEnabled ? 'loading' : 'off', user: null }
const listeners = new Set<() => void>()
const set = (next: AuthState) => {
  state = next
  listeners.forEach((l) => l())
}

/** A store-shaped object so `useStore` and the sync code can both use it. */
export const authStore = {
  get: () => state,
  subscribe(l: () => void) {
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  },
}
export const useAuth = () => useStore(authStore)

const toUser = (s: Session | null): AuthUser | null => {
  if (!s?.user) return null
  const name = s.user.user_metadata?.name
  return { id: s.user.id, email: s.user.email ?? '', name: typeof name === 'string' ? name : '' }
}

let listening: Promise<void> | undefined
/** Load the client (once) and keep the auth state in step with it. Every sign-in path goes through here: a visitor who
 *  had no saved sign-in never loaded the client at startup, so signing in must start the listening itself. */
function ensureListening(): Promise<void> {
  listening ??= (async () => {
    const sb = await loadSupabase()
    sb.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      const user = toUser(session)
      if (event === 'PASSWORD_RECOVERY') set({ status: 'recovery', user })
      else if (event === 'SIGNED_OUT' || !user) set({ status: 'signedOut', user: null })
      else if (state.status !== 'recovery') set({ status: 'signedIn', user })
    })
    const { data } = await sb.auth.getSession()
    if (state.status === 'loading' || (data.session && state.status === 'signedOut')) set(data.session ? { status: 'signedIn', user: toUser(data.session) } : { status: 'signedOut', user: null })
  })().catch((e) => {
    listening = undefined // allow a retry
    throw e
  })
  return listening
}

let started = false
/** Start listening for the signed-in user. Without a saved sign-in (or an email link) the client is not even downloaded. */
export async function initAuth(): Promise<void> {
  if (!accountsEnabled || started) return
  started = true
  if (!hasStoredSession() && !arrivedFromEmailLink()) return set({ status: 'signedOut', user: null })
  try {
    await ensureListening()
  } catch {
    set({ status: 'signedOut', user: null })
  }
}

/** Why something failed, in terms the screen can translate. */
export type AuthError = 'unconfirmed' | 'invalid' | 'exists' | 'weak' | 'email' | 'rate' | 'network' | 'unknown'
export type AuthResult = { ok: true; needsConfirmation?: boolean } | { ok: false; error: AuthError }

function failure(e: unknown): AuthResult {
  const err = e as { code?: string; status?: number; message?: string } | null
  const code = err?.code ?? ''
  const msg = (err?.message ?? '').toLowerCase()
  const error: AuthError =
    code === 'email_not_confirmed' || msg.includes('not confirmed') ? 'unconfirmed'
    : code === 'invalid_credentials' || msg.includes('invalid login') ? 'invalid'
    : code === 'user_already_exists' || code === 'email_exists' || msg.includes('already registered') ? 'exists'
    : code === 'weak_password' || msg.includes('password') ? 'weak'
    : code === 'email_address_invalid' || code === 'validation_failed' || msg.includes('email') ? 'email'
    : code.includes('rate_limit') || err?.status === 429 ? 'rate'
    : err?.status === 0 || msg.includes('fetch') || msg.includes('network') ? 'network'
    : 'unknown'
  return { ok: false, error }
}

async function run(fn: (sb: Awaited<ReturnType<typeof loadSupabase>>) => Promise<{ error: unknown | null; needsConfirmation?: boolean; session?: Session | null }>): Promise<AuthResult> {
  try {
    await ensureListening()
    const sb = await loadSupabase()
    const { error, needsConfirmation, session } = await fn(sb)
    // Don't wait for the library's event: a successful sign-in is signed in now.
    if (!error && session?.user) set({ status: 'signedIn', user: toUser(session) })
    return error ? failure(error) : { ok: true, ...(needsConfirmation ? { needsConfirmation } : {}) }
  } catch (e) {
    return failure(e)
  }
}

export const signIn = (email: string, password: string) =>
  run(async (sb) => {
    const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password })
    return { error, session: data?.session }
  })

export const signUp = (email: string, password: string, name = '') =>
  run(async (sb) => {
    const { data, error } = await sb.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: accountUrl(), data: name ? { name } : {} } })
    return { error, needsConfirmation: !error && !data.session, session: data?.session }
  })

/** The addresses the emails send people back to; built from the deploy base path, never hard-coded. */
const appUrl = (path: string) => `${location.origin}${import.meta.env.BASE_URL}${path}`
const accountUrl = () => appUrl('account')

export const requestPasswordReset = (email: string) => run(async (sb) => sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: appUrl('new-password') }))

/** Send the confirmation link again (the "Resend email" button). */
export const resendConfirmation = (email: string) => run(async (sb) => sb.auth.resend({ type: 'signup', email: email.trim(), options: { emailRedirectTo: accountUrl() } }))

export const updateName = (name: string) =>
  run(async (sb) => {
    const res = await sb.auth.updateUser({ data: { name } })
    if (!res.error && state.user) set({ status: state.status, user: { ...state.user, name } })
    return res
  })

/** Change the sign-in email. The server mails a link to the new address; the email only changes once it is opened. */
export const updateEmail = (email: string) => run(async (sb) => sb.auth.updateUser({ email: email.trim() }, { emailRedirectTo: accountUrl() }))

export const setNewPassword = (password: string) =>
  run(async (sb) => {
    const res = await sb.auth.updateUser({ password })
    if (!res.error) set({ status: 'signedIn', user: state.user })
    return res
  })

export const signOut = () =>
  run(async (sb) => {
    const res = await sb.auth.signOut()
    set({ status: 'signedOut', user: null })
    return res
  })

/** Delete the account and everything saved for it (the `delete_my_account` function), then sign out. This device keeps its own copy as guest progress. */
export const deleteAccount = () =>
  run(async (sb) => {
    const res = await sb.rpc('delete_my_account')
    if (!res.error) {
      await sb.auth.signOut().catch(() => undefined)
      set({ status: 'signedOut', user: null })
    }
    return res
  })
