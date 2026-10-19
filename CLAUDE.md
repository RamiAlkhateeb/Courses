# Abu Shreek (أبو شريك): working conventions

Vite + React + TypeScript study app (brand "Abu Shreek", أبو شريك in Arabic; repo `Courses`): an investing course plus a play-money market simulator. Other courses stay in the repo, hidden (see "Product rules"). Open to guests: **no accounts, no backend**. Progress lives in the browser's localStorage. Pattern borrowed from the BA2 course app (`../BA2`), minus Supabase/auth/submissions.

## Commands
- `npm run dev`: dev server
- `npm run build`: type-check + build
- `npm run lint`: oxlint (ignores `solutions/`, `legacy/`)
- `npm test`: vitest — content validation (incl. a ban on scripts/handlers in content HTML), progress rules, the persisted store, i18n parity (same keys, `{{vars}}` and plural forms in EN/AR), lesson-id snapshot (`tests/__snapshots__`; update with `npx vitest -u` only when you accept resetting ✓ marks), layer boundaries, "no raw colours outside `tokens.css`", and the flat-UI ban (`tests/flat-ui.test.ts`: no gradients, blur, glows or shadows except the focus ring)
- `npm run test:e2e`: Playwright smoke suite (onboarding, a lesson, RTL, deep link, axe) against a production build served under the Pages base path (`e2e/`, `playwright.config.ts`). Browsers: `npx playwright install chromium`
- `npm run check:bundle`: first-load JS budget (after a build)

## Layout
- `src/content/courses.ts`: course registry. Each course is `src/content/courses/<id>/index.ts` + one file per module; `category` (`careers` / `business` / `management`) and `audiences` (`job-seekers` / `professionals` / `entrepreneurs`, at least one) show as the course page kicker and badges. `getCourse` only finds offered courses (`appCourses`); tests read the full `courses` list. A course with no `loaders` is an outline: its chapters show as "Coming soon".
- `src/content/helpers.ts`: shared content builders (`L`, `section`, `mcq`, `box`, `table`, …).
- `src/features/<name>/`: feature code. Mobile app screens: `onboarding` (Welcome, Language, Daily goal), `path` (the Learn path), `playground` (the simulator: page, Buy/Sell sheet, news, season summary), `lesson` (card lessons, quiz, feedback, Lesson complete), `me`, `settings` (the gear on Me: Account row, language, daily goal, sound, reminder (disabled, "Soon"), the legal pages, Log out), `account` (entry points: a Log in button in the Learn header while signed out, the guest banner on Me, Welcome, the Account row in Settings; the sign-up / log-in / reset / account / delete screens, plus the legal drafts; no email confirmation step: Create account goes straight to Learn), `profile` (onboarding choices, active trail). Desktop view: `course`. Shared UI in `src/components/` (`ui/` is the design kit).
- Routes (`src/app/router.tsx`): the mobile column (`AppFrame`, redirects first-timers to `/welcome`) holds `/` (Learn), `/playground` (+ `/summary`), `/me`, `/settings` and `/legal/:page` (with or without accounts), the account routes (`/signup`, `/login`, `/forgot-password`, `/check-email`, `/new-password`, `/account`, `/account/delete`: all behind `AccountGate`; first-timers may open them and the legal pages before onboarding), lessons and quizzes; the desktop `AppShell` keeps `/course/:id` (`/courses`, the old catalog, redirects to the Investing course).
- `solutions/`: the author's practice solutions (C#/Python/JS/SQL/Java). Not part of the app build.
- `legacy/`: old unrelated backend files, kept for reference only.
- `docs/content-sources/README.ar.md`: the original Arabic README the first modules were migrated from.

## Conventions
- One language on screen at a time: never render the other language next to the current one (a Playwright sweep checks the main screens). Language names in a language picker are the exception and carry `lang="…"`.
- Content HTML is rendered only through `safeHtml()` (`src/components/content/safeHtml.ts`, DOMPurify): no scripts, handlers or inline styles.
- The logo is three rising sky bars and a white trend arrow on an indigo rounded square: `Logo` (`src/components/Logo.tsx`, token colours; 34px on Welcome, 64px avatar on Me) and `public/logo.svg` (the same drawing in hex, the SVG favicon). The PNG icons (`favicon-32.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`) are rendered from `logo.svg`; regenerate all of them together if it changes.
- Identity lives in `src/styles/tokens.css` — never raw colours (a test enforces it; add a token instead). See "Design system" below.
- Content is typed data (`Module` in `src/content/types.ts`), all text `Localized` with `en` + `ar`. UI strings go through i18next (`src/i18n/locales/en.ts` / `ar.ts`; keys are type-checked against `en`, so a typo fails `tsc`; for a key built at runtime cast with `as ParseKeys`, and add the key to both files — `tests/i18n.test.ts` checks the pair, including all six Arabic plural forms); use logical CSS properties for RTL.
- Question IDs are stable (`<prefix>-qNNN`, prefix letters only, unique app-wide); saved progress references them. Never renumber. Every question in an offered course has an `explain` (why the answer is right; shown on the result card after a correct answer or the second wrong try), and every lesson has at least 2 quick checks.
- Lesson content blocks beyond text (`src/content/helpers.ts`): `diagram` (numbers-only flat SVG in `public/diagrams/`, localized title / caption / alt; shares the card of the paragraph before it), `keyIdea` (the one thing to remember, its own indigo card just before the lesson's questions), `compoundCalculator` ("Try it" sliders, `src/domain/compound.ts`). Analogy, mistake and example boxes show the guide small (`point` / `oops` / `news`), and any room left under a lesson step is filled by the guide (`SpaceGuide`, pose from `fillerPose` in `src/domain/guide.ts`); an example box after a lone paragraph shares its card. Steps are 35–90 words: a short step (or a key idea) merges into the one before it (`mergeShort` in `src/domain/chunks.ts`); card text uses the `--lesson-text` / `--lesson-small` / `--lesson-label` tokens only. `tests/lesson-cards.test.ts` holds both; see the `lesson-cards` skill.
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
- Look: flat. White cards with a 1px `--line` border (radius 16–24), solid buttons (primary `--blue`, radius 16, min-height 56; secondary white with a border), a solid `--mist` page, thin 6px progress bars, garden decorations (`GardenArt`: Tree, Bush, Sprout, Mound) coloured by tokens. No raised/3D edges, gradients, glows, blur or drop shadows: the only shadow is the 4px focus ring on text inputs (`--focus-ring`). `tests/flat-ui.test.ts` enforces it. Speech bubbles are plain rounded boxes (no tails); streaks use the calendar icon, never a flame. White on `--blue` is 4.4:1, so text on it is 19px bold (large); small blue chips and `size="sm"` primary buttons use `--blue-text`.
- Layout: a max-width-430px column (`--app-max`); the tab bar (Learn · Playground · Me; Arabic تعلّم · التجربة · أنا) is docked to the bottom (76px, white, top border; the active tab is a `--chip-bg` rounded rectangle) and shows on the three main screens; lessons are full screen. Learn is a list: an indigo "Up next" card, then per unit a header and 60px lesson rows (done / next with a Start chip / locked).
- RTL: `dir` follows the i18n language; use logical CSS properties, mirror the guide (`Guide` has a `flip` prop that defaults to `dir`). Money is always LTR Western digits (`<Money>`).
- Guides: **Saud (سعود)** and **Sara (سارة)**, one picked at random each session (`currentGuide`, `src/state/guide.ts`; `?guide=saud|sara` pins one), drawn by `Guide` (`src/components/ui/Guide.tsx`) from `public/guides/<guide>-<pose>.png`. "Abu Shreek" is the app's brand name, not a character. Poses: `wave` (Welcome, Language), `point` (guidance, analogy boxes), `think` (quiz, the room under a key idea), `cheer` (correct, lesson complete, season summary), `oops` (wrong, mistake boxes), `news` (example boxes, market news), `coins` (a right answer that pays +$10, Lesson complete when the lesson paid), `streak` (the Lesson complete streak card).
- Every button-looking control is a `Button` (or `buttonClass()` on a `<Link>`; `size="sm"` for inline ones): don't write a new `.btn` in a feature stylesheet.
- Shared UI lives in `src/components/ui/` (`Button`, `Card`, `AnswerOption`, `ProgressBar`, `StatPill`, `TabBar`, `BottomSheet`, `Guide`, `Coin`, `Icon`); grouped list rows and sheets for Settings / Account are in `src/components/SettingsList.tsx`; reuse them, don't restyle per screen. Quiz options use `AnswerOption ring` (a radio circle that becomes a check / cross); feedback is an inline result card under the options.
- The design is light-only; there is no dark theme.
- Removed by the garden design (and deleted, not hidden): mountain/summit/expedition, Review and Terms tabs, Scenario lessons, Rest day, Starting bank, Fund Playground, Lesson payout screen, Season missions, Unlocks, Risk check, Trade debrief, "What if I waited?", Past seasons, Time paused. Don't fake friends or rankings.

## Product rules (the money loop)
- Investing is the only course the app offers (`ENABLED_COURSE_IDS` in `src/content/courses.ts`); other course files stay in the repo, hidden.
- One wallet of play money: the bank starts at $1,000 (`START_BANK`, `src/domain/money.ts`), and lessons add $10 per correct answer (`PAY_PER_CORRECT`) the first time a roadmap lesson is finished (replays and practice pay nothing). Saved progress is `progress:v2` (`bank`, plus `perfect`, the count of lessons finished with every answer right, for the "Quiz ace" milestone); `parseProgress` migrates v1 XP players to $1,000 + $10 per right answer. Always label it play money. Never real money, brokerage links, advice ("you should buy"), or rankings by return.
- The wallet shown on Learn, Me and Lesson complete is `useWallet()` (`src/state/usePlayground.ts`): the bank plus the Playground's net worth. Opening the Playground sweeps the bank into its cash (lesson rewards earned mid-season join the cash and count as money moved in), so there is no "fund" step.
- Gains and losses pair colour with an arrow and text (↑ +$486, ↓ −6%), never colour alone. Money is rendered with `<Money>` (left-to-right, Western digits, also in Arabic).
- The Playground (`src/domain/playground/`): pure functions, every number in `config.ts`. Nine investments, safest first, all open from the start, with **generic names only** (no real products, indexes or trademarks): Safe Savings, Government Bonds, Gold, World Stocks ETF, US 500 Index ETF, Property Fund (REIT), Tech Stocks ETF, Nile Foods (fictional), Crypto Coin (fictional). The market is a function of the seed alone (`buildMarket`; the newer assets follow the world-stocks weekly move through `beta`): trades never move prices, so a season replays exactly. **Time follows the real clock: 1 real day = 1 simulated year**, always running, even with the app closed (`startedAt` + `catchUp(state, now)`; `usePlaygroundClock` runs in `AppFrame`, so the wallet is live everywhere). There are no play, pause or speed controls. 1 tick = 1 week (about 27.7 real minutes), 10-year seasons (10 real days), 1% fee on every buy and sell, four random news events per season; news never stops time: stories that land queue up (`newsQueue`) and open one at a time on the Playground. Saved seasons from before (speed, `pendingEvent`) carry on from the week they were at (`parsePlayground`). Money leaves the Playground only between seasons (`canWithdraw`): "Play again" on the season summary cashes out into the bank (`cashOut`). The summary (`insights.ts`) is derived from the trades, never advice. Saved as `playground:v1`. No rankings.
- Fictional company and coin names are marked "(fictional)" / "(خيالية)".

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
`add-module`, `add-course`, `lesson-cards` (full steps, one typography, guide poses) in `.claude/skills/`.

Roadmap: `docs/PLAN.md`.
