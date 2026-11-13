# Roadmap

How the parts fit together: `docs/ARCHITECTURE.md`. The rules for every feature: `CLAUDE.md`.

## Where the app is (November 2026)
Zubda (زبدة) offers one course, **Investing Fundamentals** (six units, 39 lessons, EN + AR), plus a play-money market
simulator that runs on the real clock (one real week = one simulated year). Light and dark themes, installable and
offline. Optional accounts (Supabase) sync everything; without them the app is complete for guests.

### Built
- **The garden design** (`design/`): Welcome, Language, Daily goal; Learn (Up next, the path of units and lessons); card
  lessons with quick checks; Lesson complete; Me; Settings; certificates; the courses page.
- **Lessons as a story**: every unit follows two fictional characters, Noor and Karim. Each lesson opens on a hook with
  something to do (a guess, a "what would you do?", a sort, or a myth or fact), has a picture, and ends with a key idea
  and at least two quick checks. Each unit ends with a practice lesson in the simulator.
- **The daily loop**: a daily goal that counts study time, three quests a day and a chest of play money, a streak with
  freezes and an evening at-risk card, a daily review spaced over 1–16 days, Next lesson from Lesson complete, resuming
  a lesson where it was left.
- **Rewards**: 2× play money on the day's first lesson while a 3+ day streak is alive, 17 badges kept with their dates,
  six levels, unit and course certificates dated the day they were finished, confetti and a coin pop (off under
  reduced motion).
- **The simulator**: nine generic investments, fees, payouts, auto-invest, rebalancing, season goals, a yearly recap,
  news, "while you were away" on Learn and a weekly challenge on the portfolio.
- **Social carousels**: any lesson as Instagram slides (`/share/…`, `scripts/social/export-post.mjs`) or as markdown for
  the separate carousel-engine repo (`scripts/social/to-carousel.mjs`).

## Next
- **Export screen** (`/studio`, hidden): pick a lesson, a language, a guide and whether to include the quiz; preview the
  slides; download the PNGs, copy the caption, download the carousel-engine markdown.
- **More courses**: the other course files stay in the repo, hidden (`ENABLED_COURSE_IDS`). Personal finance is the most
  natural next one; write it with the `add-course` / `add-module` skills and the story recipe in the `lesson-cards`
  skill.

## Ideas (not built)
- Real push notifications for the study reminder and market news (needs a backend; today they only work while the app
  is open).
- Search across lessons; bookmarks or notes on cards.
- A timed mock quiz across a whole unit.
- Restyle the desktop reading pages (`/course/:id`) to the garden tokens.
- Privacy-friendly analytics (Plausible or Umami) to see which lessons people finish.
- Lighthouse CI and a link checker.

## History (short)
First called Masar, then Abu Shreek (أبو شريك), now Zubda. It began as a guest-only multi-course reader with XP; the
garden redesign (October 2026) replaced XP with one wallet of play money and removed the mountain path, the Review and
Terms tabs, Scenario lessons and the other screens listed in `CLAUDE.md`. Accounts were added later, optional
(`docs/SUPABASE-INTEGRATION.md`).
