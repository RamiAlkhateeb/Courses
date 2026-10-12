# Abu Shreek · أبو شريك

*Learn the way forward.* Free, bite-size courses for careers and business — English and Arabic, light and dark mode. Each course is a journey of chapters and short card lessons with quick checks, time estimates, a recap, XP and streaks, plus a dashboard and "review mistakes". No account needed; progress is saved in your browser.

**Live site:** https://ramialkhateeb.github.io/Courses/

## Courses

**Tech Interview Prep**

| Module | Status |
| --- | --- |
| Resume & ATS | ✅ |
| .NET interview Q&A (35 questions with analogies) | ✅ |
| Data structures & algorithms patterns | ✅ |
| Behavioral (STAR), offers & negotiation, SQL, JavaScript, system design, mock-interview checklist | soon |

**Business & finance**

| Course | Written modules | Coming soon |
| --- | --- | --- |
| Investing Fundamentals | How investing works · Asset classes · Diversification, costs & behaviour | Valuation basics, retirement accounts, building a plan |
| Personal Finance | Budgeting & emergency fund | Debt, credit, insurance, saving for big goals |
| Accounting Essentials | The three financial statements | Bookkeeping, ratios, cash-flow management |
| Entrepreneurship | Validating a business idea | Business models, pricing, unit economics, funding, legal basics |
| Marketing Fundamentals | Customers, positioning & the funnel | Branding, digital channels, content & SEO, sales |

Investing and personal-finance content is educational only, not financial advice; each of those course pages says so.

**Outlined — planned chapters, lessons to be written**

| Course | Category | For |
| --- | --- | --- |
| Data Analysis | Careers | Job seekers, professionals |
| Accounting and Cost Analysis | Business & finance | Professionals, entrepreneurs |
| Financial Management & Feasibility Study | Business & finance | Entrepreneurs, professionals |
| Introduction to Economics | Business & finance | Job seekers, professionals |
| Fundamentals of Management and Theories of Organizations | Management & decision science | Professionals, entrepreneurs |
| Operations and Supply Chain Management | Management & decision science | Professionals, job seekers |
| Decision Theory | Management & decision science | Professionals |
| Game Theory | Management & decision science | Professionals, entrepreneurs |
| Modeling Procedures in Decision Support Systems | Management & decision science | Professionals |

Every course is tagged for one or more audiences — **Job seekers**, **Managers & professionals**, **Entrepreneurs** — and the home page can filter by them.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # content validation + progress logic
npm run lint
npm run build    # type-check + production build
```

## Adding content

- New lesson: use the `add-module` skill (`.claude/skills/add-module/SKILL.md`) — one TypeScript file in `src/content/courses/<course>/`, registered in the course's `index.ts`.
- New course: `add-course` skill — one folder + one line in `src/content/courses.ts`.
- All text needs `en` and `ar`; `npm test` enforces it, and enforces unique question IDs.

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
