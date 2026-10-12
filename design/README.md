# Abu Shreek design handoff

Source: the Claude Design canvas (47 frames; 42 numbered screens in English and Arabic, plus a style guide, a tokens sheet
and the mascot sheet). Screens are 390×844 (shown at 2x). Mobile-first: a max-width-430px column with a tab bar
(Path · Playground · Review · Me) on the four main screens.

`abu-shreek/` holds the mascot (Abu Shreek, أبو شريك): `wave` (hello), `cheer` (correct), `oops` (not quite), `think`
(questions), `point` (next step). They are copied to `public/abu-shreek/` and drawn by `src/components/ui/AbuShreek.tsx`.
`screens/Abu Shreek style guide.png` and `screens/Tokens and Arabic rules.png` have the colours, type, buttons, answer
states, money styling and the six Arabic plural forms.

The product logic (learning pays play money, the Playground, unlocks) is in `docs/PLAN.md`.

## Flow order and status

| # | Screen | What it does | Status |
|---|--------|--------------|--------|
| 01 | Welcome | Names stacked, tagline, mascot, EN/عربي switch, Start / "I already have a path" | built |
| 02 | Language | Onboarding 1/4: English or Arabic | built |
| 03 | Your goal | Onboarding 2/4: why you're here | built |
| 04 | Your first trail | Onboarding 3/4: Investing, the only trail for now | built |
| 05 | Daily time | Onboarding 4/4: 5/10/15/20 min a day | built |
| 21 | Starting bank | $1,000 play-money bank, then Path | built |
| 06 | Home path | Mountain path, opens at your lesson, "Back to my camp" | built |
| 07 | Lesson card | Content card, Next | built |
| 08 | Quiz question | Options, "Check answer" | built |
| 09 | Correct | Green sheet, mascot cheers | built |
| 10 | Not quite | Red sheet, mascot oops | built |
| 11 | Camp cleared | Lesson results, earned $ | built |
| 28 | Lesson payout | +$40, coin to the bank chip, bank before → after | built ("Move $100?" offer: phase C) |
| 12 | Review tab | Cards due, topics, practice | built |
| 16 | Terms collection | Word collection (inside Review) | built (move under Review: phase C) |
| 13 | Progress (Me) | Streak, bank, week, trails, milestones | built |
| 14, 15 | Home / Quiz, Arabic RTL | Mirrored layouts | built |
| 17 | Summit map | Whole trail overview | built |
| 19 | Scenario lesson | "What would you do?" trade-offs | not built (needs a content type) |
| 20 | Rest day | One rest day a week keeps the streak | built |
| 18 | Weekly expedition | Shared crew goal | skipped (needs a backend) |
| 22, 30, 23 | Fund Playground, empty, Playground | Move money in, net worth, chart, holdings | phase C |
| 24, 33, 32 | Buy, Sell, Trade debrief | Trade sheets and explanations | phase C |
| 25, 34, 31 | Market news, Risk check, What unlocks | Events, risk, unlock ladder | phase C |
| 37 | Time paused | "Time stood still" | phase C |
| 29, 26, 35, 36 | Missions, Season summary, What if I waited, Past seasons | Seasons | phase D |
| 27, 38, 39, 40 | Playground / Buy / News / Summary, Arabic | RTL versions | phases C–D |
| 41, 42 | Error, EN and AR | Reload and Home | built |
