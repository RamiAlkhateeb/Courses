# Abu Shreek design handoff

> The app was renamed from "Masar" to "Abu Shreek" (أبو شريك) after these screens were drawn, so the images (and
> `screens/masar-style-guide.png`) still show the old name. The layouts, colours and Rafiq are unchanged.

Source: the Claude Design canvas "App Flow". Screens are 390×844 (shown at 2x). Mobile-first: the app is a
max-width-430px column, with a tab bar (Path · Review · Terms · Me) on the four main screens.

`rafiq/` holds the guide character: `wave` (hello), `cheer` (correct), `oops` (not quite), `think` (questions),
`point` (next step). They are copied to `public/rafiq/` and rendered by `src/components/ui/Rafiq.tsx`.
`screens/masar-style-guide.png` has the colours, type, path nodes and button/answer states.

## Flow order

| # | File | What it does |
|---|------|--------------|
| 01 | welcome | Landing: headline, Rafiq waving, EN/عربي switch, "Start my path" / "I already have a path" |
| 02 | language | Onboarding 1/4: English or Arabic (switches `dir` immediately) |
| 03 | your-goal | Onboarding 2/4: why you're here (understand money / invest / accounting / business skills) |
| 04 | pick-a-trail | Onboarding 3/4: choose the first course ("trail") |
| 05 | daily-time | Onboarding 4/4: 5/10/15/20 min a day, then "Start my path" |
| 06 | home-path | **Home**: trail switcher, streak + XP chips, current-camp banner, mountain path map |
| 07 | lesson-card | Lesson content card with key idea, term chip, Rafiq tip, Next |
| 08 | quiz-question | Quick check: options A–D, hint, Check |
| 09 | correct | Green bottom sheet: Rafiq cheers, "+10 XP", explanation, Continue |
| 10 | not-quite | Red bottom sheet: Rafiq oops, explanation, Try again / Re-read the card |
| 11 | camp-cleared | Lesson results: XP, accuracy, time, week streak, Review my mistake |
| 12 | review-tab | Cards due, per-topic strength, Mistakes only / Key terms |
| 13 | progress | **Me** tab: streak, XP, lessons, this-week bars, trails, milestones |
| 14 | home-arabic-rtl | Home mirrored for RTL (path, chips, Rafiq flipped) |
| 15 | quiz-arabic-rtl | Quiz mirrored for RTL |
| 16 | terms-collection | **Terms** tab: EN / AR / Both, flip card, collected words |
| 17 | summit-map | Whole-trail mountain with numbered camps and camp list |
| 18 | weekly-expedition | Shared weekly XP goal with friends (needs a backend — not built) |
| 19 | scenario-lesson | "What would you do?" lesson: tap an option to see its trade-offs |
| 20 | rest-day | Missed a day: use the weekly rest day to keep the streak |

## Status
See "Design rebuild" in `docs/PLAN.md`.
