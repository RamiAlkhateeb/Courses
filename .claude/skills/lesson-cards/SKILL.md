---
name: lesson-cards
description: Write or review lesson steps (cards) so none is near-empty and every step shares one typography and the right Abu Shreek pose. Use when writing, editing or reviewing lesson content, or when a lesson step looks empty, too long, or styled differently from the others.
---

# Lesson cards: full steps, one typography

A lesson is a run of steps (cards) cut from a section by `toCards()` (`src/domain/chunks.ts`), then its quick checks.
Learners read one step per screen on a phone, so every step must be worth a screen and look like the others.

## The rules

1. **One idea per step, 35–90 words.** A step under 35 words (`SHORT_CARD`) is "short".
   - A short step joins the step before it automatically while the two stay within 90 words (`CARD_WORDS`).
   - A key idea joins the step before it while the two stay within 110 words.
   - Nothing merges past a question, a `cardBreak`, or a step holding a table, picture, calculator or code.
2. **Group what belongs together** in the content order so merging can work: a definition, then its example box, then
   the key idea. An example box right after a lone paragraph always shares its card.
3. **Pictures where there is a number or a comparison** (`diagram()`): flat SVG in `public/diagrams/`, numbers only, brand
   colours; title, caption and alt are `Localized`. A picture stays on the card of the paragraph before it.
4. **One key idea per lesson** (`keyIdea()`), just before the lesson's `exercise()` blocks; at least 2 quick checks per
   lesson, each with an `explain`.
5. **If a short step can't merge** (a key idea after a picture), the lesson screen adds a small Abu Shreek (`think`)
   under it (`needsIllustration`). Don't rely on this for plain text: `tests/lesson-cards.test.ts` fails on any short
   text step that stands alone, naming the lesson and step.

## Typography (one size and face on every step)

- All card text inherits `--lesson-text` (20px, line-height `--lesson-line`) from `.content`, in the language's one
  font (`--font`). Paragraphs, lists, objectives, takeaways, every box, the key idea and formulas use it.
- Smaller sizes only for `--lesson-small` (tables, captions, notes) and `--lesson-label` (uppercase kickers).
- Emphasis is `<strong>` (bold, blue on light cards) or the card itself (the indigo key idea), never a bigger font.
- Don't add `font-size` or `font-family` in `src/components/content/content.module.css` outside those tokens; the test
  checks it.

## Abu Shreek on lesson screens

| Pose | Where |
| --- | --- |
| `point` | analogy boxes |
| `oops` | mistake boxes, a wrong answer |
| `news` | example boxes (real-world cases), Playground market news |
| `think` | a short step that could not merge |
| `cheer` | a right answer, Lesson complete (replay or practice) |
| `coins` | a right answer that pays +$10, Lesson complete when the lesson paid |
| `streak` | the streak card on Lesson complete |

New poses: a transparent PNG, 640px tall, facing right (the app mirrors him in Arabic), in `public/abu-shreek/`, and
the name added to `MascotPose` (`src/components/ui/AbuShreek.tsx`).

## Checklist

1. `npm test`: `lesson-cards`, `chunks`, `lessons` and `content` tests.
2. Walk the lesson in the app (`npm run dev`, `/course/<course>/<module>/learn/<lesson>`) or with a Playwright
   screenshot at 390×844 and 320 wide, in English and Arabic: every step has text that fills at least a third of the
   screen or a picture, and all steps share one text size.
3. To see how a lesson splits, print `lessonsFor(mod)` steps with `cardWords()` from `src/domain/chunks.ts`.
