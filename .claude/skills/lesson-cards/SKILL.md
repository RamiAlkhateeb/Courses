---
name: lesson-cards
description: Write or review lesson steps (cards) so none is near-empty and every step shares one typography and the right guide pose. Use when writing, editing or reviewing lesson content, or when a lesson step looks empty, too long, or styled differently from the others.
---

# Lesson cards: full steps, one typography

A lesson is a run of steps (cards) cut from a section by `toCards()` (`src/domain/chunks.ts`), then its quick checks.
Learners read one step per screen on a phone, so every step must be worth a screen and look like the others.

## The rules

1. **One idea per step, 35–90 words.** A step under 35 words (`SHORT_CARD`) is "short".
   - A short step joins the step before it automatically while the two stay within 90 words (`CARD_WORDS`).
   - A key idea joins the step before it while the two stay within 110 words.
   - Nothing merges past a question, a `cardBreak`, or a step holding a table, picture, calculator or code.
   - A step over 90 words is cut in two (`splitLong`): between blocks where the halves come out most even (never just
     before a key idea or after a heading / lead-in), or a lone long paragraph at the sentence end nearest its middle,
     in each language on its own sentences (an inline tag straddling the cut keeps it whole). Media steps are never cut.
     `tests/lesson-cards.test.ts` fails on any text step over 90 words.
2. **Group what belongs together** in the content order so merging can work: a definition, then its example box, then
   the key idea. An example box right after a lone paragraph always shares its card.
3. **Pictures where there is a number or a comparison** (`diagram()`): flat SVG in `public/diagrams/`, numbers only, brand
   colours; title, caption and alt are `Localized`. A picture stays on the card of the paragraph before it.
4. **One key idea per lesson** (`keyIdea()`), just before the lesson's `exercise()` blocks; at least 2 quick checks per
   lesson, each with an `explain`.
5. **Room left under a step is filled by the guide** (`SpaceGuide` in `src/features/lesson/`): it measures the space
   between the step and the docked button and shows the guide (160–280px tall) only when it fits; the pose comes from
   `fillerPose()` (`src/domain/guide.ts`). This is decoration, not a fix for thin text: `tests/lesson-cards.test.ts`
   still fails on any short text step that stands alone, naming the lesson and step.

## Typography (one size and face on every step)

- All card text inherits `--lesson-text` (20px, line-height `--lesson-line`) from `.content`, in the language's one
  font (`--font`). Paragraphs, lists, objectives, takeaways, every box, the key idea and formulas use it.
- Smaller sizes only for `--lesson-small` (tables, captions, notes) and `--lesson-label` (uppercase kickers).
- Emphasis is `<strong>` (bold, blue on light cards) or the card itself (the indigo key idea), never a bigger font.
- Don't add `font-size` or `font-family` in `src/components/content/content.module.css` outside those tokens; the test
  checks it.

## The guide (Saud or Sara) on lesson screens

Two guides, **Saud (سعود)** and **Sara (سارة)**; `currentGuide` (`src/state/guide.ts`) picks one at random each
session (`?guide=saud|sara` pins one). Every pose exists for both. The app name "Abu Shreek" is the brand only.

| Pose | Where |
| --- | --- |
| `point` | analogy boxes |
| `oops` | mistake boxes, a wrong answer |
| `news` | example boxes (real-world cases), Playground market news |
| `think` | the room under a key idea; quiz screens |
| `wave`, `cheer`, `think`, `point` | the room under other steps, taking turns (never the pose of a tip box on the same step) |
| `cheer` | a right answer, Lesson complete (replay or practice) |
| `coins` | a right answer that pays +$10, Lesson complete when the lesson paid |
| `streak` | the streak card on Lesson complete |

New poses: one transparent PNG per guide, 640px tall, facing right (the app mirrors the guide in Arabic):
`public/guides/saud-<pose>.png` and `public/guides/sara-<pose>.png`, and the name added to `GuidePose`
(`src/domain/guide.ts`).

## Checklist

1. `npm test`: `lesson-cards`, `chunks`, `lessons` and `content` tests.
2. Walk the lesson in the app (`npm run dev`, `/course/<course>/<module>/learn/<lesson>`) or with a Playwright
   screenshot at 390×844 and 320 wide, in English and Arabic: every step has text that fills at least a third of the
   screen or a picture, and all steps share one text size.
3. To see how a lesson splits, print `lessonsFor(mod)` steps with `cardWords()` from `src/domain/chunks.ts`.
