# Zubda · زبدة

Learn investing in small steps, then practise with play money. Short card lessons with quick checks pay into a $1,000 play-money bank; the Playground is a seeded market simulator where that money can grow or shrink over five-year "seasons", with news, missions and a "what if I waited?" replay. English or Arabic (right-to-left), one language at a time. Free, no account: progress stays in your browser. Educational only, never financial advice.

**Live site:** https://ramialkhateeb.github.io/Courses/

## What's in the app

**Investing Fundamentals** is the only course offered right now: How investing works · Asset classes · Diversification, costs & behaviour.

Other courses (Tech Interview Prep, Personal Finance, Accounting, Entrepreneurship, Marketing, and nine outlined management and economics courses) stay in `src/content/courses/` but are hidden; add an id to `ENABLED_COURSE_IDS` in `src/content/courses.ts` to bring one back.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # content validation, progress logic, i18n parity, architecture rules
npm run test:e2e # browser smoke tests (needs: npx playwright install chromium)
npm run lint
npm run build    # type-check + production build
```

## Adding content

- New lesson: use the `add-module` skill (`.claude/skills/add-module/SKILL.md`) — one TypeScript file in `src/content/courses/<course>/`, registered in the course's `index.ts`.
- New course: `add-course` skill — one folder + one line in `src/content/courses.ts`.
- All text needs `en` and `ar`; `npm test` enforces it, and enforces unique question IDs.
- Give every section of an offered course fixed lesson ids (`lessons: ['…']` in `section()`), so editing text never resets a learner's ✓.

## Deployment (GitHub Pages)

Pushing to `master` runs `.github/workflows/deploy.yml` (lint → test → build → publish). One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Pull requests run `.github/workflows/ci.yml`.

The build uses base path `/<repo-name>/` (currently `/Courses/`, taken from `GITHUB_REPOSITORY` when `GITHUB_PAGES=true`) and copies `index.html` to `404.html` so deep links to a module work on Pages.

## Repository layout

```
src/                 the app (content in src/content/courses/)
solutions/           practice solutions by language (not part of the build)
legacy/              old backend files kept for reference
docs/PLAN.md         roadmap and improvement ideas
docs/content-sources original Arabic README the first modules came from
```
