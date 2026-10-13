# Architecture notes: what was done, what was not

Result of the architecture review that followed the rename to Abu Shreek. Layers and vocabulary are in `CLAUDE.md`; this file records the status of each suggestion.

## Done
| # | Change |
| --- | --- |
| A1 | Two tabs no longer overwrite each other's progress: `createPersistedStore` re-reads storage before every update and follows the `storage` event (tests + a real two-tab run). |
| A2 | Route `errorElement` (`src/app/RouteError.tsx`) and one guarded reload when a deploy removed the files an open tab needs (`src/app/chunkReload.ts`). |
| A3 | `tests/content.test.ts` bans `<script>`, `<iframe>`, `on*=`, `javascript:` etc. in content HTML. Sanitising at render is still needed before any user/CMS content. |
| A4 | `tests/lesson-ids.test.ts` snapshots every lesson id, so content edits that would clear ✓ marks are deliberate. |
| B5/B6 | `domain/` (pure rules) ← `state/` (stores) ← `components/` ← `features/`; one persisted-store factory for progress, profile, settings, language. `tests/architecture.test.ts` enforces it. |
| B8 (part) | Every non-entry route is lazy-loaded (`page()` helper in `src/app/router.tsx`). |
| B9 | Colours only from `tokens.css` (test), one `Button` / `buttonClass()` instead of six hand-made button styles. |
| B10 | One vocabulary: Week → Module; glossary in `CLAUDE.md`. |
| B11 | `src/i18n/locales/{en,ar}.ts`, typed keys, parity test (found two Arabic plurals missing forms). One font per language, self-hosted. |
| C12 | Playwright smoke suite + axe in CI, bundle budget. |
| C14 | `progressStore` (`get`/`update`/`subscribe`) is the seam for a backend: a Supabase adapter replaces its storage, not its callers (`docs/SUPABASE-INTEGRATION.md`). No extra interface was added. |
| C15 | `engines`/`.nvmrc`, stray `eslint-disable` comments, Me avatar no longer uses the app name's first letter. `"strict": true` is explicit. |

## Not done, and why
- **B7 build-time manifest.** Measured: the largest content chunk is 56 KB (the rest are 5–30 KB), and only the courses a learner opens are loaded, so the saving is small today. Worth doing when content grows or a search feature needs a lesson index.
- **B8 separate `app/mobile` and `app/desktop` folders; merge `WeekStrip`/`WeekCard`.** A restructure with no user-visible gain until the mobile-vs-desktop product direction is decided.
- **B11 key naming.** English strings still mix camelCase and `snake_case` keys (`ob_goal_title`); renaming means touching dynamic keys (`goal_*`, `pace_*`). Left as is.
- **React component tests** (RTL/jsdom). The keyboard flow is covered end to end by the Playwright suite instead.
- **`noUncheckedIndexedAccess`.** Enabling it produced 148 errors; do it module by module.
- **C13 hosting.** Needs a decision: GitHub Pages serves deep links with HTTP 404 (`404.html` fallback) and cannot give per-page link previews. A host with rewrites (Cloudflare Pages, Netlify) and a custom domain fixes both and removes the `/Courses/` base-path handling.
