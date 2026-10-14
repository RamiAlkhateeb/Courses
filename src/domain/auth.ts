// Pure rules for the account screens: what makes a password acceptable, what counts as an email, how a display name
// is cleaned, and the confirmation words. No React, no network: the screens and the tests share these.

/** Supabase's minimum, and ours. The dashboard's password setting must be at least this too. */
export const MIN_PASSWORD = 8

export interface PasswordChecks {
  length: boolean
  number: boolean
  letter: boolean
}

export const passwordChecks = (password: string): PasswordChecks => ({
  length: password.length >= MIN_PASSWORD,
  number: /\d/.test(password),
  letter: /\p{L}/u.test(password), // any script: an Arabic passphrase counts
})

export const passwordOk = (password: string) => Object.values(passwordChecks(password)).every(Boolean)

/** A deliberately loose shape check (something@something.tld); the server is the real judge. */
export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())

export const MAX_NAME = 40

/** Collapse whitespace and cut to length, so a pasted name or stray spaces never reach the profile. */
export const cleanName = (value: string) => value.replace(/\s+/g, ' ').trim().slice(0, MAX_NAME)

/** The word to type before an account is deleted. */
export const DELETE_WORD = 'DELETE'
export const deleteConfirmed = (typed: string) => typed.trim().toUpperCase() === DELETE_WORD

/** Seconds before "Resend email" works again. */
export const RESEND_SECONDS = 60

/** 42 → "0:42" (always Western digits, like money). */
export const clock = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
