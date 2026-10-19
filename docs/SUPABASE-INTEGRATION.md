# Optional accounts (Supabase)

Status: **built.** Abu Shreek is guest-first: with no account everything works and progress lives in this browser. An
account only adds **sync**, so progress, the play-money bank and the Playground follow a learner across devices.

Rules that hold:
- Guest mode stays complete. Nothing is locked behind sign-in.
- With no env vars the app is exactly the guest app: no account UI, no network, and the Supabase library is not even
  downloaded (it is a lazy chunk, loaded only when someone has a saved sign-in or opens the account page).
- The frontend gets only the project URL and the **anon / publishable** key (public by design). **Never** put a
  `service_role` key in this repo, the build, or a `VITE_` variable.
- Every table has row-level security; a learner can only ever touch their own rows.

## What is stored

One table, `public.user_state` ([`supabase/migrations/0001_user_state.sql`](../supabase/migrations/0001_user_state.sql)):
one row per learner per store, `key` in (`progress`, `profile`, `playground`), `data` = that store's JSON exactly as the
app keeps it in localStorage, `updated_at` set by the server. Language and the sound setting stay per device.
`delete_my_account()` (security definer, acts only on the caller) removes the account and, by cascade, its rows.

Play money is client-computed (like the rest of progress), so a determined user can edit their own rows. That is fine
for a learning game with no rankings. If a leaderboard is ever added, move payouts into a server function first.

## How sync works (`src/state/sync.ts`, rules in `src/domain/sync.ts`)

- The three local stores stay what the screens read: instant, and offline-capable.
- Signed in: **pull** (merge the account's rows into the local stores), then **push** whatever differs. After that, a change
  to a store is pushed after about 2 s (the Playground ticks every second, so it is batched to about 10 s), when the tab is
  hidden, and when the browser comes back online. Coming back to the tab after a minute pulls again. Failures keep the data
  dirty and retry; the status shows Synced / Syncing / Offline / Error.
- Merge rules:
  - Learning is **additive**: lessons done, sections read and answers from both sides are kept (a right answer outranks an
    older wrong one); review boxes take the higher box; the streak with the later day wins; per-day earnings take the larger.
  - Money is **not** additive: the bank and the Playground are one wallet, taken together from whichever side was saved more
    recently. Adding or max-ing two banks would create or destroy play money. A lesson finished only on the losing side keeps
    its tick but its payout is not re-paid.
  - The profile comes from the newer side, and "finished onboarding" never goes back to false.
- Both stores of the wallet travel in one request so they cannot be saved half-and-half.
- **Shared devices:** signing out keeps this device's data as guest progress and remembers whose it was
  (`sync:meta.owner`). Signing in as a *different* account replaces it with that account's data instead of merging, so one
  person's progress never leaks into another's account.
- Guest progress made before the first sign-in is merged into the new account, so nothing is lost.

## Screens

The account flow is eleven screens from the design (`src/features/account/`), all in the mobile column and all routed
under `AccountGate`, which sends everyone back to Me when accounts are not configured:

| Route | Screen |
|---|---|
| `/signup` | Create your account: name, email, password with three visible rules, agreement to the terms |
| `/login` | Log in; a wrong email or password turns the fields red and never says which one was wrong |
| `/forgot-password`, `/check-email` | Ask for a reset link; always answers "Check your email" (no account enumeration) |
| `/new-password` | Choose a new password (from the reset email, or from Account → Password) |
| `/account` | Name, email, password (Change), and a red Delete account link. Back goes to Settings |
| `/settings` (not behind the gate) | Account row, language, daily goal, sound, reminder (disabled), Terms / Privacy / Help, Log out (signed in only) |
| `/account/delete` | Delete the account: says what goes, needs `DELETE` typed first |
| `/legal/terms`, `/legal/privacy`, `/legal/help` | **Drafts** (`legal.ts`): the owner must review them (and the Arabic) before launch |

Entry points: a Log in button in the Learn header (signed out only), the guest banner on Me (Create profile / Log in), the Account row in Settings (gear on Me) and Welcome's "I already have an
account". There is no email confirmation step: Create account goes straight to Learn (keep "Confirm email" off in Supabase; if it were on, a new account would land on Learn signed out). No Google / Apple sign-in. The reminder row in Settings is disabled
(needs notifications). Errors are mapped to translated messages (`acc_err_*`); the rules for passwords, names and the
delete word are pure functions in `src/domain/auth.ts`.

Deleting the account removes the online copy only; this device keeps its own copy as guest progress (the screen says so).

## Set-up (one time)

1. **Database.** Supabase dashboard → SQL Editor → New query → paste `supabase/migrations/0001_user_state.sql` → Run (then the later files in `supabase/migrations/` in order; `0003_user_state_settings.sql` lets preferences sync). It
   can be run twice safely.
2. **Auth settings** (Authentication → URL Configuration):
   - Site URL: `https://ramialkhateeb.github.io/Courses/`
   - Redirect URLs (all four): `https://ramialkhateeb.github.io/Courses/account`, `https://ramialkhateeb.github.io/Courses/new-password`,
     `http://localhost:5173/account` and `http://localhost:5173/new-password`.
     The password-reset email returns to `/new-password`.
   - Password length: Authentication → Policies → minimum password length **8** (the app enforces 8 + a letter + a number
     on its own screens, but only the dashboard setting stops a direct API call).
   - Authentication → Providers → Email: enabled. "Confirm email" is **off** for now, so sync starts right after sign-up;
     turning it on later needs no code change (the app already shows "check your email").
3. **Deploy.** The repository secrets `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are passed to the build step in
   `.github/workflows/deploy.yml`. CI (`ci.yml`) builds without them, which keeps proving that guest mode works.
4. **Local dev (optional).** Copy `.env.example` to `.env.local` and fill in the two values. `.env.*` is git-ignored.

## Testing

- `e2e/account.spec.ts` (fake Supabase in `e2e/fakeSupabase.ts`, answered inside the test; `playwright.config.ts` builds with a made-up project, so nothing reaches a real database): sign up (rules; straight to Learn, no confirm screen), log in (wrong and right password, reload), Me gear → Settings → Account, guest Settings, reset flow, Account edits, change password, log out, delete (button waits for `DELETE`), Arabic RTL, and axe on every screen in English and Arabic.
- `tests/auth-domain.test.ts` (password / email / name / delete-word rules) and `tests/legal.test.ts`.
- `tests/sync.test.ts`: every merge rule, the wallet decision, the shared-device rule.
- Manual: sign up, finish a lesson, open the app in a second browser, sign in: the lesson is ticked and the bank matches;
  sign out: the guest copy is still there.

## Later, if wanted
- Server-side payouts and display names (needed before any leaderboard).
- Per-lesson history for analytics (normalised tables instead of snapshots).
- Social providers (Google) and email confirmation.
