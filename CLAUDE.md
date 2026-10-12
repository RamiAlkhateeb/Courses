# Abu Shreek (أبو شريك): working conventions

Vite + React + TypeScript study app (brand "Abu Shreek · أبو شريك", repo `Courses`) with free courses for careers (tech interview prep) and business (investing, personal finance, accounting, entrepreneurship, marketing). Open to guests: **no accounts, no backend**. Progress lives in the browser's localStorage. Pattern borrowed from the BA2 course app (`../BA2`), minus Supabase/auth/submissions.

## Commands
- `npm run dev`: dev server
- `npm run build`: type-check + build
- `npm run lint`: oxlint (ignores `solutions/`, `legacy/`)
- `npm test`: vitest — content validation (incl. a ban on scripts/handlers in content HTML), progress rules, the persisted store, i18n parity (same keys, `{{vars}}` and plural forms in EN/AR), lesson-id snapshot (`tests/__snapshots__`; update with `npx vitest -u` only when you accept resetting ✓ marks), layer boundaries, and "no raw colours outside `tokens.css`"
- `npm run test:e2e`: Playwright smoke suite (onboarding, a lesson, RTL, deep link, axe) against a production build served under the Pages base path (`e2e/`, `playwright.config.ts`). Browsers: `npx playwright install chromium`
- `npm run check:bundle`: first-load JS budget (after a build)

## Layout
- `src/content/courses.ts`: course registry. Each course is `src/content/courses/<id>/index.ts` + one file per module; `category` (`careers` / `business` / `management`) groups it on the home page and `audiences` (`job-seekers` / `professionals` / `entrepreneurs`, at least one) drives the Home filter and badges. A course with no `loaders` is an outline: its chapters show as "Coming soon".
- `src/content/helpers.ts`: shared content builders (`L`, `section`, `mcq`, `box`, `table`, …).
- `src/features/<name>/`: feature code. Mobile app screens: `onboarding` (Welcome + 4 steps), `path` (Home mountain, Summit, rest-day offer), `lesson` (card lessons, quiz, results), `review`, `terms`, `me`, `profile` (onboarding choices, active trail). Desktop reading views: `course`, `modules` (the one-page reading view), `home` (the catalog, now at `/courses`), `settings`. Shared UI in `src/components/` (`ui/` is the design kit).
- Routes (`src/app/router.tsx`): the mobile column (`AppFrame`, redirects first-timers to `/welcome`) holds `/` (Path), `/review`, `/terms`, `/me`, `/summit`, lessons and quizzes; the desktop `AppShell` keeps `/courses`, `/course/:id`, one-page modules and `/settings`.
- `solutions/`: the author's practice solutions (C#/Python/JS/SQL/Java). Not part of the app build.
- `legacy/`: old unrelated backend files, kept for reference only.
- `docs/content-sources/README.ar.md`: the original Arabic README the first modules were migrated from.

## Conventions
- Identity lives in `src/styles/tokens.css` — never raw colours (a test enforces it; add a token instead). See "Design system" below.
- Content is typed data (`Module` in `src/content/types.ts`), all text `Localized` with `en` + `ar`. UI strings go through i18next (`src/i18n/locales/en.ts` / `ar.ts`; keys are type-checked against `en`, so a typo fails `tsc`; for a key built at runtime cast with `as ParseKeys`, and add the key to both files — `tests/i18n.test.ts` checks the pair, including all six Arabic plural forms); use logical CSS properties for RTL.
- Question IDs are stable (`<prefix>-qNNN`, prefix letters only, unique app-wide); saved progress references them. Never renumber.
- Option display order is shuffled per question (`src/domain/optionOrder.ts`); stored answers are always indices into `question.options`.
- Finance courses (investing, personal finance) are educational only: no recommendations of specific products, figures labelled as illustrations, and the course `notice` keeps the not-financial-advice disclaimer.
- Progress goes only through `src/state/progress.ts` (rules in `src/domain/progress.ts`), so a backend can replace it later. Every value kept in localStorage uses `createPersistedStore` (`src/state/`), which re-reads storage before each update and syncs across tabs; don't write new `localStorage` code.
- Roadmap lessons come from `lessonsFor(mod)` (`src/domain/lessons.ts`); finished ones are saved as `course/module/lessonId` in `lessonsDone` (plus `lastLesson` for Home's Continue and per-day XP in `activity`), so changing how a section splits into parts can reset its ✓.
- Deploy base path is `/<repo>/` (from `GITHUB_REPOSITORY`, fallback `/Courses/`) when `GITHUB_PAGES=true` (see `vite.config.ts`); use `import.meta.env.BASE_URL` / `resolveAssetPath`, never hard-code it.
- No secrets are needed. If a backend is ever added, follow `docs/SUPABASE-INTEGRATION.md` (optional accounts on the BA2 Supabase archive; guest mode stays the default).

## Design system (from `design/`)
The mobile UI follows the Claude Design canvas: screenshots in `design/screens/` (flow order in `design/README.md`), Rafiq PNGs in `design/rafiq/` (served from `public/rafiq/`). Build against the screenshot, then check it at 390×844 in English and Arabic.
- Colours (tokens): ink/`--brand` `#14213D`, saffron/`--accent` `#F2A93B`, dawn/`--dawn` `#FBEBCB`, paper `#F6F1E6`, card/`--surface` `#FFFCF5`, line/`--rule` `#DDD3BF`, correct/`--green` `#1F6B4A`, oops/`--red` `#A8432B`, saffron text/`--accent-ink` `#8A5A00`, muted `#5B6478`, locked `#CFC3A8`.
- Fonts: one family per language, used for headings and body alike (`--font`, swapped by `html[dir='rtl']`): Instrument Sans for English, IBM Plex Sans Arabic for Arabic. They are self-hosted (`src/styles/fonts.css`, files from `@fontsource/*`) with strict `unicode-range`s, so a language's files download only when its script is on screen; nothing loads from Google Fonts. Never hard-code a `font-family` in a component (code blocks keep the monospace stack).
- Look: flat 1px-border cards, 16–20px radius (`--radius`, `--radius-lg`), no chunky 3D buttons. Saffron only for "what's next" (Continue, current node, XP progress) — selected/neutral states use dawn + ink.
- Layout: a max-width-430px column (`--app-max`); the tab bar (Path · Review · Terms · Me) shows on the four main screens, lessons are full screen.
- RTL: set `dir` from the i18n language, use logical CSS properties (`margin-inline-start`, `inset-inline-end`, …), and mirror Rafiq and the mountain path in Arabic (`Rafiq` and `PathMap` do this via `dir`).
- Every button-looking control is a `Button` (or `buttonClass()` on a `<Link>`; `size="sm"` for inline ones): don't write a new `.btn` in a feature stylesheet.
- Shared UI lives in `src/components/ui/` (`Button`, `Card`, `OptionCard`, `ProgressBar`, `TabBar`, `BottomSheet`, `Rafiq`, `PathNode`); reuse it, don't restyle per screen.
- The design is light-only; there is no dark theme or theme setting.
- Finance content keeps the "educational only, not financial advice" notice (Welcome, trail picker, results).
- Not built (needs a backend): Weekly expedition (design 18). Don't fake friends or rankings.

## Architecture (layers)
Dependencies point one way; `tests/architecture.test.ts` fails CI if one points the wrong way.
| Folder | What lives there | May import |
| --- | --- | --- |
| `src/content/` | course data, registry, content hooks | `content`, `lib` |
| `src/lib/` | generic helpers (`useScrollSpy`) | `lib` |
| `src/domain/` | **pure rules**: progress/streak/XP/spaced review, lessons, chunks, path states. No React, no browser APIs | `domain`, `content`, `lib` |
| `src/state/` | persisted stores (`createPersistedStore`), hooks over them, sound, `useTrail` | `state`, `domain`, `content`, `lib` |
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
| **Module** | One content file of a course (`Module`, `useModule`, `moduleId`, `ModulePage`) | "chapter" / "camp" in the UI; was `Week` (BA2 legacy) before the rename |
| **Section** | One heading's worth of a module (`Section`) | |
| **Lesson** | A short card run cut from a section, one roadmap node (`Lesson`, `lessonsFor`) | |
| **Card** | One idea inside a lesson (`chunks.ts`) | |
| **Question** | A multiple-choice question with a stable id | "quick check" |
| **Week** (calendar) | Monday–Sunday, only for the XP bars and the rest day (`weekStart`, `WeekStrip`) | never a module |

## Skills
`add-module`, `add-course` in `.claude/skills/`.

Roadmap: `docs/PLAN.md`.
