# Abu Shreek design handoff: the garden design

Source: `Abu Shreek Mobile App Flow.html`, the Claude Design export (27 screens at 390×844, English and Arabic/RTL, plus a
style board and a tokens board). It is a visual spec only: the app is built from its own components (`src/components/ui/`),
colours live in `src/styles/tokens.css`. Open the HTML in a browser to see every screen.

`abu-shreek/` holds the mascot (Abu Shreek, أبو شريك): `wave` (welcome, language), `point` (guidance), `think` (quiz),
`cheer` (correct, lesson complete, season summary), `oops` (not quite). They are copied to `public/abu-shreek/` and drawn
by `src/components/ui/AbuShreek.tsx`.

## Screens and where they live

| Screens | Route | Code |
|---|---|---|
| Welcome, Language, Daily goal | `/welcome`, `/welcome/language`, `/welcome/time` | `src/features/onboarding` |
| Learn path (streak and money, unit banner, zigzag nodes, chest) | `/` | `src/features/path` |
| Lesson card, quiz, Correct, Not quite, Lesson complete | `/course/:id/:module/learn/:lesson` | `src/features/lesson` |
| Me (stats, this week, Your garden, milestones) | `/me` | `src/features/me` |
| Playground (empty, running), Buy, Sell, Market news | `/playground` | `src/features/playground` |
| Season summary | `/playground/summary` | `src/features/playground/SummaryPage.tsx` |
| Error | any failing route | `src/app/RouteError.tsx` |
| Sign up, Log in (+ wrong password), Forgot password, Check your email, New password, Account, Delete account (screens 25–35, Arabic Sign up and Log in) | `/signup`, `/login`, `/forgot-password`, `/check-email`, `/new-password`, `/account`, `/account/delete` | `src/features/account` (built from a separate export, `Abu_Shreek_Mobile_App_Flow-png.zip`; the PNGs are not in the repo) |

The Arabic versions are the same components with `dir="rtl"`; nothing is duplicated.

## What the design removed

Mountain and summit, Weekly expedition, Review and Terms tabs, Scenario lessons, Rest day, Starting bank, Fund Playground,
Lesson payout screen, Season missions, What unlocks, Risk check, Trade debrief, What if I waited, Past seasons and
Time paused. They are gone from the code, not hidden.

## Navigation

Three tabs in a flat bar docked to the bottom: Learn (تعلّم), Playground (التجربة), Me (أنا). The flat update (no 3D edges, gradients, glows or shadows; the Learn list; ring quiz options; the inline result card; the bar-chart logo; Settings and the slimmer Account) is from the PNG export of 38 screens.

The product logic (one wallet of play money, lessons add rewards, the Playground) is in `CLAUDE.md` under "Product rules".
