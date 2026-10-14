# Abu Shreek (أبو شريك): working conventions

Vite + React + TypeScript study app (brand "Abu Shreek", أبو شريك in Arabic; repo `Courses`): an investing course plus a play-money market simulator. Other courses stay in the repo, hidden (see "Product rules"). Open to guests: **no accounts, no backend**. Progress lives in the browser's localStorage. Pattern borrowed from the BA2 course app (`../BA2`), minus Supabase/auth/submissions.

## Commands
- `npm run dev`: dev server
- `npm run build`: type-check + build
- `npm run lint`: oxlint (ignores `solutions/`, `legacy/`)
- `npm test`: vitest — content validation (incl. a ban on scripts/handlers in content HTML), progress rules, the persisted store, i18n parity (same keys, `{{vars}}` and plural forms in EN/AR), lesson-id snapshot (`tests/__snapshots__`; update with `npx vitest -u` only when you accept resetting ✓ marks), layer boundaries, and "no raw colours outside `tokens.css`"
- `npm run test:e2e`: Playwright smoke suite (onboarding, a lesson, RTL, deep link, axe) against a production build served under the Pages base path (`e2e/`, `playwright.config.ts`). Browsers: `npx playwright install chromium`
- `npm run check:bundle`: first-load JS budget (after a build)

## Layout
- `src/content/courses.ts`: course registry. Each course is `src/content/courses/<id>/index.ts` + one file per module; `category` (`careers` / `business` / `management`) and `audiences` (`job-seekers` / `professionals` / `entrepreneurs`, at least one) show as the course page kicker and badges. `getCourse` only finds offered courses (`appCourses`); tests read the full `courses` list. A course with no `loaders` is an outline: its chapters show as "Coming soon".
- `src/content/helpers.ts`: shared content builders (`L`, `section`, `mcq`, `box`, `table`, …).
- `src/features/<name>/`: feature code. Mobile app screens: `onboarding` (Welcome, Language, Daily goal), `path` (the Learn path), `playground` (the simulator: page, Buy/Sell sheet, news, season summary), `lesson` (card lessons, quiz, feedback, Lesson complete), `me`, `account` (the 11 sign-up / log-in / reset / account / delete screens, plus the legal drafts), `profile` (onboarding choices, active trail). Desktop views: `course`, `settings`. Shared UI in `src/components/` (`ui/` is the design kit).
- Routes (`src/app/router.tsx`): the mobile column (`AppFrame`, redirects first-timers to `/welcome`) holds `/` (Learn), `/playground` (+ `/summary`), `/me`, the account routes (`/signup`, `/login`, `/forgot-password`, `/check-email`, `/new-password`, `/account`, `/account/delete`, `/legal/:page`: all behind `AccountGate`, first-timers may open them before onboarding), lessons and quizzes; the desktop `AppShell` keeps `/course/:id` and `/settings` (`/courses`, the old catalog, redirects to the Investing course).
- `solutions/`: the author's practice solutions (C#/Python/JS/SQL/Java). Not part of the app build.
- `legacy/`: old unrelated backend files, kept for reference only.
- `docs/content-sources/README.ar.md`: the original Arabic README the first modules were migrated from.

## Conventions
- One language on screen at a time: never render the other language next to the current one (a Playwright sweep checks the main screens). Language names in a language picker are the exception and carry `lang="…"`.
- Content HTML is rendered only through `safeHtml()` (`src/components/content/safeHtml.ts`, DOMPurify): no scripts, handlers or inline styles.
- The app icon is the mascot's face on the navy tile: `public/favicon-32.png`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `manifest.webmanifest`; `LogoMark` shows the same image. Regenerate all of them together if the mascot changes.
- Identity lives in `src/styles/tokens.css` — never raw colours (a test enforces it; add a token instead). See "Design system" below.
- Content is typed data (`Module` in `src/content/types.ts`), all text `Localized` with `en` + `ar`. UI strings go through i18next (`src/i18n/locales/en.ts` / `ar.ts`; keys are type-checked against `en`, so a typo fails `tsc`; for a key built at runtime cast with `as ParseKeys`, and add the key to both files — `tests/i18n.test.ts` checks the pair, including all six Arabic plural forms); use logical CSS properties for RTL.
- Question IDs are stable (`<prefix>-qNNN`, prefix letters only, unique app-wide); saved progress references them. Never renumber.
- Option display order is shuffled per question (`src/domain/optionOrder.ts`); stored answers are always indices into `question.options`.
- Finance courses (investing, personal finance) are educational only: no recommendations of specific products, figures labelled as illustrations, and the course `notice` keeps the not-financial-advice disclaimer.
- Progress goes only through `src/state/progress.ts` (rules in `src/domain/progress.ts`), so a backend can replace it later. Every value kept in localStorage uses `createPersistedStore` (`src/state/`), which re-reads storage before each update and syncs across tabs; don't write new `localStorage` code.
- Roadmap lessons come from `lessonsFor(mod)` (`src/domain/lessons.ts`). Every section of an offered course fixes its lesson ids (`lessons: ['…']` in `section()`, `Section.lessonIds`; a test enforces it), so the cards are shared out between those ids and editing text can't move a ✓; to split a long section, add an id (the old one keeps its ✓). Sections without ids fall back to automatic splitting; finished ones are saved as `course/module/lessonId` in `lessonsDone` (plus `lastLesson` for Home's Continue and per-day earnings in `activity`), so changing how a section splits into parts can reset its ✓.
- Deploy base path is `/<repo>/` (from `GITHUB_REPOSITORY`, fallback `/Courses/`) when `GITHUB_PAGES=true` (see `vite.config.ts`); use `import.meta.env.BASE_URL` / `resolveAssetPath`, never hard-code it.
- Accounts are optional (Supabase, `docs/SUPABASE-INTEGRATION.md`): guest mode stays complete, and with no `VITE_SUPABASE_*` env vars the app has no account UI and downloads no Supabase code. Only the URL and the anon key ever go in the frontend, never a `service_role` key. Sync goes through `src/state/sync.ts` (merge rules in `src/domain/sync.ts`): don't write to Supabase from components. Account screens call `src/state/auth.ts` only; form rules are in `src/domain/auth.ts`; form fields are `TextField` / `CheckPill` in `components/ui`. Supabase keeps its own session under `sb-…-auth-token` in localStorage (the one exception to `createPersistedStore`). The legal pages in `src/features/account/legal.ts` are drafts to be reviewed. The SQL is in `supabase/migrations/`.

## Design system (the garden design, from `design/`)
The mobile UI follows `design/Abu Shreek Mobile App Flow.html` (27 screens, EN + AR; screen map in `design/README.md`). It is a visual spec: build with the app's own components, then check at 390×844 and 320 wide, in English and Arabic.
- Colours (tokens only, `src/styles/tokens.css`): `--indigo` `#293681` (ink, dark surfaces), `--blue` `#4274D9` (the next step: CTA, current node, progress), `--sky` `#95CCDD`, `--mint` `#D0E7E6`, mist background, leaf greens for what has grown, `--correct` / `--oops` (+ `-bg`) for feedback. Legacy names (`--brand`, `--accent`, `--paper`, …) are aliases for the desktop reading pages; use the new names in new code.
- Fonts: one family per language, used for headings and body alike (`--font`, swapped by `html[dir='rtl']`): Instrument Sans for English, IBM Plex Sans Arabic for Arabic. Self-hosted (`src/styles/fonts.css`, `@fontsource/*`) with strict `unicode-range`s; nothing loads from Google Fonts. Never hard-code a `font-family` in a component.
- Look: soft cards (24px radius), chunky 3D-edge round nodes and buttons, blue gradient CTA with `--shadow-cta`, a floating pill tab bar, blurred sky/blue glows behind each screen (`AppFrame`), garden decorations (`GardenArt`: Tree, Bush, Sprout, Mound) coloured by tokens.
- Layout: a max-width-430px column (`--app-max`); the floating tab bar (Learn · Playground · Me; Arabic تعلّم · التجربة · أنا) shows on the three main screens, lessons are full screen.
- RTL: `dir` follows the i18n language; use logical CSS properties, mirror the mascot and the Learn path zigzag (`AbuShreek` has a `flip` prop that defaults to `dir`; `UnitPath` follows `dir`). Money is always LTR Western digits (`<Money>`).
- Mascot poses: `wave` (Welcome, Language), `point` (guidance, news), `think` (quiz), `cheer` (correct, lesson complete, season summary), `oops` (wrong).
- Every button-looking control is a `Button` (or `buttonClass()` on a `<Link>`; `size="sm"` for inline ones): don't write a new `.btn` in a feature stylesheet.
- Shared UI lives in `src/components/ui/` (`Button`, `Card`, `AnswerOption`, `ProgressBar`, `StatPill`, `TabBar`, `BottomSheet`, `PathNode`, `AbuShreek`, `Coin`, `Icon`); reuse it, don't restyle per screen.
- The design is light-only; there is no dark theme.
- Removed by the garden design (and deleted, not hidden): mountain/summit/expedition, Review and Terms tabs, Scenario lessons, Rest day, Starting bank, Fund Playground, Lesson payout screen, Season missions, Unlocks, Risk check, Trade debrief, "What if I waited?", Past seasons, Time paused. Don't fake friends or rankings.

## Product rules (the money loop)
- Investing is the only course the app offers (`ENABLED_COURSE_IDS` in `src/content/courses.ts`); other course files stay in the repo, hidden.
- One wallet of play money: the bank starts at $1,000 (`START_BANK`, `src/domain/money.ts`), and lessons add $10 per correct answer (`PAY_PER_CORRECT`) the first time a roadmap lesson is finished (replays and practice pay nothing). Saved progress is `progress:v2` (`bank`, plus `perfect`, the count of lessons finished with every answer right, for the "Quiz ace" milestone); `parseProgress` migrates v1 XP players to $1,000 + $10 per right answer. Always label it play money. Never real money, brokerage links, advice ("you should buy"), or rankings by return.
- The wallet shown on Learn, Me and Lesson complete is `useWallet()` (`src/state/usePlayground.ts`): the bank plus the Playground's net worth. Opening the Playground sweeps the bank into its cash (lesson rewards earned mid-season join the cash and count as money moved in), so there is no "fund" step.
- Gains and losses pair colour with an arrow and text (↑ +$486, ↓ −6%), never colour alone. Money is rendered with `<Money>` (left-to-right, Western digits, also in Arabic).
- The Playground (`src/domain/playground/`): pure functions, every number in `config.ts`. Four assets (Cash, Safe Savings, Broad Index Fund, Bonds, and a fictional company), all open from the start. The market is a function of the seed alone (`buildMarket`): trades never move prices, so a season replays exactly. 1 simulated year per real minute at 1x (speeds pause/1×/2×/3×), 1 tick = 1 week, 10-year seasons, 1% fee on every buy and sell, three random news events per season (time stops until Continue). Time runs only while the Playground screen is open and visible (`usePlaygroundClock`); a season that was running when the app opened comes back paused. Money leaves the Playground only between seasons (`canWithdraw`): "Play again" on the season summary cashes out into the bank (`cashOut`). The summary (`insights.ts`) is derived from the trades, never advice. Saved as `playground:v1`. No rankings.
- Fictional company names are marked "(fictional)" / "(خيالية)".

## Architecture (layers)
Dependencies point one way; `tests/architecture.test.ts` fails CI if one points the wrong way.
| Folder | What lives there | May import |
| --- | --- | --- |
| `src/content/` | course data, registry, content hooks | `content` |
| `src/domain/` | **pure rules**: progress/streak/bank/spaced review, lessons, chunks, path states. No React, no browser APIs | `domain`, `content` |
| `src/state/` | persisted stores (`createPersistedStore`), hooks over them, sound, `useTrail` | `state`, `domain`, `content` |
| `src/i18n/` | translations and language setup | + `state` |
| `src/components/` | shared UI | + `i18n` |
| `src/features/<name>/` | one screen area | itself + everything above, **never another feature** |
| `src/app/` | router and providers | anything |

Need something from another feature? Move it down a layer (shared logic to `domain`, shared hooks to `state`, shared UI to `components`).

## Glossary (one word per thing)
| Say | Meaning | Also called (UI / old code) |
| --- | --- | --- |
| **Course** | A subject, e.g. Investing Fundamentals (`Course`, `src/content/courses/<id>/`) | "trail" in the mobile UI |
| **Group** | A labelled run of modules inside a course (`NavGroup`) | "unit" / "part" |
| **Module** | One content file of a course (`Module`, `useModule`, `moduleId`) | "chapter" / "camp" in the UI; was `Week` (BA2 legacy) before the rename |
| **Section** | One heading's worth of a module (`Section`) | |
| **Lesson** | A short card run cut from a section, one roadmap node (`Lesson`, `lessonsFor`) | |
| **Card** | One idea inside a lesson (`chunks.ts`) | |
| **Question** | A multiple-choice question with a stable id | "quick check" |
| **Week** (calendar) | Monday–Sunday, only for the earnings bars and the rest day (`weekStart`, `WeekStrip`) | never a module |

## Skills
`add-module`, `add-course` in `.claude/skills/`.

Roadmap: `docs/PLAN.md`.
