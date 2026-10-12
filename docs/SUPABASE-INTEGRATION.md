# Plan: optional accounts with the BA2 Supabase backend

Status: **planned, not started.** Abu Shreek is guest-only today: progress lives in this browser's
localStorage (`src/features/progress/store.ts`). This document says how to add **optional** accounts,
so progress follows a learner across devices, by reusing the Supabase backend archived in BA2:
<https://github.com/PA-WiT/BA2/tree/main/supabase-archive>.

Guiding rules:
- **Guest mode stays the default and stays complete.** Nothing becomes locked behind sign-in.
  An account only adds sync.
- **The app must build and run with no Supabase env vars.** Then it's exactly today's guest
  app, for local dev, forks and CI.
- **Progress keeps going only through `src/features/progress/store.ts`.** Components don't
  change; only the store learns to sync.
- **The frontend gets the anon key only.** Every table has RLS. The `service_role` key is never
  in the app or the repo.

---

## 1. What the BA2 archive gives us

| Archive path | What it is | Use in Abu Shreek |
|---|---|---|
| `migrations/0001_init.sql` | `profiles` (role `student`/`admin`, auto-created on sign-up), `quiz_sessions`, `question_attempts` (append-only), `week_progress` (`sections_read[]`), `bookmarks`, all with own-row RLS | **Reuse as is** |
| `migrations/0002_progress_rpc.sql` | `mark_section_read(week_id, section_id)`: race-safe upsert into `week_progress` | **Reuse as is** |
| `migrations/0003_submissions.sql` | `profiles.email`, `is_admin()`, admin read policy, `homework_submissions` + `submit_homework` / `review_submission` RPCs | Reuse `profiles.email` + `is_admin()`; **skip homework** unless graded assignments are wanted |
| `migrations/0004_backfill_profile_email.sql` | One-off email backfill | Only needed if 0003 runs on an existing project; harmless on a new one |
| `migrations/0005_homework_links_and_deadlines.sql` | Drive links, deadlines, late flag | **Skip** (homework only) |
| `lib/supabase.ts` | Client from `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (throws if missing) | Reuse, but make it **optional**: return `null` when the vars are missing |
| `lib/auth.ts` | Sign up / in / out, change email or password, reset email | Reuse |
| `features/auth/*` | `AuthProvider` + `useAuth`, Login, ResetPassword, Settings, ChangePassword, `RequireAuth`, `RequireAdmin` | Reuse the provider and pages, restyled with Abu Shreek tokens; merge the account settings into our Settings page |
| `features/progress/api.ts`, `features/quiz/api.ts` | TanStack Query mutations: mark section read, record attempt | Fold into the store's remote adapter (§4) |
| `components/LockedSection.tsx`, `content/access.ts` | "First 2 sections free" paywall-style gate | **Don't use**: it conflicts with guest-first |
| `features/submissions/*` | Student and admin homework pages | Later, only with homework (§8) |
| `i18n-keys.ts` | EN/AR/FA strings for the auth UI | Merge the EN + AR keys into `src/i18n/index.ts` |
| `skills/supabase-setup`, `skills/add-progress-feature` | Claude Code skills | Copy `supabase-setup` into `.claude/skills/` (update paths) |

BA2 calls a module a `week` (`week_id`). Abu Shreek has courses, so **use `week_id = '<courseId>/<moduleId>'`**,
the same key the local store already uses for `sectionsRead`. That lets 0001/0002 run unchanged.

## 2. Mapping Abu Shreek's local progress to tables

The local `Progress` shape (`src/features/progress/store.ts`) and where each part lives once
signed in:

| Local field | Meaning | Server source of truth |
|---|---|---|
| `answers[qid]` | latest option picked, right/wrong | `question_attempts` (append-only); the latest row per `question_id` |
| `boxes[qid]` | Leitner box 1–5 for picking lesson questions | **new** `review_boxes (user_id, question_id, box)`. Could be derived from attempts, but a small table is simpler and cheaper |
| `sectionsRead[course/module]` | sections seen | `week_progress.sections_read` via `mark_section_read` |
| `lessonsDone[]` | finished roadmap lessons `course/module/lessonId` | **new** `lesson_completions` |
| `lastLesson` | Home's Continue | latest `lesson_completions` row |
| `xp`, `activity[day]` | XP total and per-day XP | sum of `lesson_completions.xp`, grouped by `local_day` (view) |
| `streak` | consecutive days | derived from distinct `local_day` in `lesson_completions` (client or view) |
| settings (`theme`, `sound`, `lang`) | per device | stay **local**; optionally add `profiles.preferences jsonb` later |

### New migration (draft): `0006_masar_progress.sql`

```sql
-- Finished roadmap lessons (and Practice/Review runs, which have no lesson key) — one row per finish.
create table public.lesson_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  lesson_key text,                         -- 'course/module/lessonId'; null for Practice / Review runs
  correct int not null default 0,
  total int not null default 0,
  xp int not null check (xp >= 0 and xp <= 500),
  local_day date not null,                 -- learner's local calendar day (streaks follow their midnight)
  completed_at timestamptz not null default now()
);
create index on public.lesson_completions (user_id, local_day);
create index on public.lesson_completions (user_id, lesson_key);

create table public.review_boxes (
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  question_id text not null,
  box smallint not null check (box between 1 and 5),
  updated_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

alter table public.lesson_completions enable row level security;
alter table public.review_boxes enable row level security;
create policy "own completions" on public.lesson_completions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own boxes" on public.review_boxes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- XP per day for the week strip and the streak; RLS of the base table applies through the view.
create view public.daily_xp with (security_invoker = true) as
  select user_id, local_day, sum(xp)::int as xp
  from public.lesson_completions group by user_id, local_day;

-- One call that loads everything the store needs after sign-in.
create function public.my_progress() returns jsonb
language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'answers', (select coalesce(jsonb_object_agg(question_id, jsonb_build_object('selected', selected, 'correct', is_correct)), '{}')
                from (select distinct on (question_id) question_id, selected, is_correct
                      from public.question_attempts where user_id = auth.uid()
                      order by question_id, created_at desc) a),
    'boxes', (select coalesce(jsonb_object_agg(question_id, box), '{}') from public.review_boxes where user_id = auth.uid()),
    'sectionsRead', (select coalesce(jsonb_object_agg(week_id, sections_read), '{}') from public.week_progress where user_id = auth.uid()),
    'lessonsDone', (select coalesce(jsonb_agg(distinct lesson_key), '[]') from public.lesson_completions where user_id = auth.uid() and lesson_key is not null),
    'lastLesson', (select lesson_key from public.lesson_completions where user_id = auth.uid() and lesson_key is not null order by completed_at desc limit 1),
    'activity', (select coalesce(jsonb_object_agg(local_day, xp), '{}') from public.daily_xp where user_id = auth.uid() and local_day > current_date - 60),
    'xp', (select coalesce(sum(xp), 0) from public.lesson_completions where user_id = auth.uid())
  );
$$;
grant execute on function public.my_progress() to authenticated;
```

A second function, `import_guest_progress(p jsonb)` (`security invoker`), takes the local `Progress`
JSON on a learner's **first** sign-in on a device and inserts:
- one synthetic `question_attempts` row per answer;
- `review_boxes`, using the higher box on conflict;
- `week_progress`, as a union;
- one `lesson_completions` row per finished lesson, carrying its share of `activity`'s XP on its day.

It's idempotent per device: the client stores `progress:importedFor = <user id>`.

The XP cap in the check constraint keeps a tampered client from writing absurd totals. XP is a
motivator, not a grade, so client-computed XP is acceptable. If a leaderboard is ever added, move XP
calculation into a `complete_lesson` RPC.

## 3. Environment, build and deploy

- `.env.example` gets `VITE_SUPABASE_URL=` and `VITE_SUPABASE_ANON_KEY=`. `.env.local` is already
  git-ignored by Vite's defaults; check before the first commit.
- `src/lib/supabase.ts`:
  `export const supabase = url && anonKey ? createClient<Database>(url, anonKey) : null` and
  `export const accountsEnabled = supabase !== null`. With it `null`, every account UI is hidden.
- **GitHub Pages**:
  - Add both values as repository **secrets**.
  - Pass them to the build step in `.github/workflows/deploy.yml` (`env:`). CI (`ci.yml`) builds
    without them, which also proves guest mode still works.
  - The anon key is public by design; RLS is what protects data.
- **Supabase Auth settings**:
  - Site URL `https://ramialkhateeb.github.io/Courses/`.
  - Redirect URLs: that URL plus `/Courses/reset-password` and `http://localhost:5173/*`.
  - Password-reset links must include the base path. Build them with `import.meta.env.BASE_URL`,
    never a hard-coded path.
  - Deep links already work on Pages through the `404.html` copy.
- Generate types: `npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts`.

## 4. Client design

1. **Remote adapter** (`src/features/progress/remote.ts`):
   - `load(): Promise<Progress>` calls `my_progress()`.
   - Event writers: `recordAnswer`, `recordReview`, `markRead`, `completeLesson`, mapped to
     `question_attempts` inserts, `review_boxes` upserts, `mark_section_read`, and
     `lesson_completions` inserts.
2. **Store**: `store.ts` keeps its synchronous API and localStorage cache, so the UI stays instant
   and works offline. When signed in:
   - Each `update()` also appends the event to an **outbox** (localStorage `progress:outbox`).
   - A flusher sends the outbox, with retry and backoff, when online.
   - On sign-in: flush, call `load()`, then merge into the cache.
   - On sign-out: keep the local copy as guest progress, and don't wipe it.
3. **Merge rules** (pure function, unit-tested):
   - `lessonsDone` and `sectionsRead`: union.
   - `boxes`: max.
   - `answers`: the newest wins. Add an `at` timestamp to local answers from now on; old entries
     without one lose to the server.
   - `activity`: max per day. The same lessons recorded on both sides must not double count.
   - `xp`: the server value after import.
4. **Auth**:
   - Port `AuthProvider`, `lib/auth.ts`, and the Login and ResetPassword pages. Restyle with Abu Shreek
     tokens: flat cards, `--brand`, serif headings.
   - Add routes `login` and `reset-password` (lazy).
   - Add an **Account** section to `src/features/settings/SettingsPage.tsx`: email, change
     password, sign out, delete account.
   - `RequireAdmin` is only needed if an admin area is added (§8).
5. **UI touchpoints**, all non-blocking:
   - The top bar shows "Sign in" or the avatar initial, next to ⚙.
   - After a learner's 2nd finished lesson, the summary offers once: "Save your progress across
     devices — create a free account".
   - The Home dashboard shows "Synced" or "On this device only".
6. **i18n**: merge the archive's EN + AR auth strings and add the sync strings. FA isn't used in
   Abu Shreek, so drop it.

## 5. Privacy and security checklist
- RLS enabled, with an own-row policy, on every user table. Run the archive skill's checklist
  ("empty results = RLS or not logged in").
- `security definer` functions only where the archive already uses them (`mark_section_read`,
  `handle_new_user`, `is_admin`). New functions are `security invoker`.
- Admin promotion only via SQL in the dashboard. There's no in-app path.
- **Account deletion**: a `delete_my_account()` RPC (security definer, deletes `auth.users` row →
  cascades), for user control and GDPR-style requests.
- Collect only email and display name. Add a short privacy note to Settings and the README.

## 6. Rollout phases

| Phase | Work | Done when |
|---|---|---|
| 0. Decide | Supabase project/region; email confirmation on or off; homework yes or no | Decisions recorded here |
| 1. Backend | New Supabase project; run 0001, 0002, 0003 (only for `profiles.email` + `is_admin`, or a trimmed copy), then 0006; auth URLs; secrets | `my_progress()` returns `{}`-shaped JSON for a test user; RLS tests pass |
| 2. Optional client | `src/lib/supabase.ts` (nullable), types, `accountsEnabled` | App builds and runs with and without env vars |
| 3. Auth UI | Provider, Login/Reset pages, Settings → Account | Sign up, in, out and reset work on localhost and Pages |
| 4. Sync | Remote adapter, outbox, merge, guest import | Progress made as a guest appears on a second device after sign-in; offline answers sync later |
| 5. Polish | Nudges, sync status, privacy note, docs (`CLAUDE.md`, README, skill) | Reviewed in EN/AR, light/dark, mobile |

## 7. Testing
- **Unit (vitest)**: merge rules, outbox ordering and retry, guest-import payload builder, and
  `accountsEnabled = false` meaning no network calls.
- **SQL**: a small script run against a local stack (`npx supabase start`) that signs in as two
  users and asserts each sees only their own rows in every table and in `my_progress()`.
- **E2E (Playwright)**, against the local Supabase stack:
  1. Sign up, then finish a lesson.
  2. Open a second browser context and sign in: the lesson is ✓ there.
  3. Sign out: guest progress is still shown.
- **CI** keeps running without Supabase secrets, so guest mode can't regress.

## 8. Later, if needed
- **Homework / assignments**: archive 0003 + 0005 and `features/submissions/*` (Drive links,
  deadlines, admin review). Map `week_id` to `course/module`.
- **Bookmarks and notes** on cards: the `bookmarks` table already exists in 0001.
- **Certificates** per finished course: derived from `lesson_completions`.
- **Leaderboards**: need server-computed XP (`complete_lesson` RPC) and opt-in display names.

## Open questions for the owner
1. Should we create a new Supabase project for Abu Shreek, or reuse BA2's? A new one is recommended,
   so the data and auth settings stay separate.
2. Should email confirmation be required before sync starts?
3. Do we want homework/assignments (§8) at all?
4. Should accounts be offered in Arabic and English only? FA strings in the archive would be dropped.
