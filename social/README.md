# Social posts

Instagram carousels (1080×1350 PNG) cut from the app's lessons, drawn by the app itself with its own fonts, tokens and components.

```
node scripts/social/export-post.mjs investing basics why --lang ar
node scripts/social/export-post.mjs investing basics why --lang en --guide saud --no-build
```

This builds the app, serves it with `vite preview` under `/Courses/`, and opens the share route `/share/<course>/<module>/<lesson>?slide=N&lang=…&guide=…` (`src/app/SharePage.tsx`; slides from `shareSlides` in `src/domain/share.ts`) for each slide. It writes these files to `social/out/<course>-<module>-<lesson>.<lang>/` (not committed):

- `01.png`, `02.png`, …: one file per slide;
- `contact-sheet.png`: every slide on one image, for review;
- `caption.txt`: a **draft** caption. It holds the hook, the key idea, a comment-your-answer line, "link in bio", the course's not-financial-advice notice and hashtags. It is built from the lesson text only; edit it before posting.

The script warns (and exits with 2) when a slide's content does not fit even at the smallest size: shorten the text or split the card.

## Slides

Each lesson becomes these slides, in order:

1. a hook: the lesson title and standfirst;
2. the lesson's text in short slides, with each picture or table on a slide of its own;
3. the key idea;
4. for each question: the question, then the answer and why;
5. a call to action with the disclaimer.

Lesson goals, the simulator and the calculator are left out, because a still image can't carry them.

## Punchier hooks: `posts/<course>/<module>/<lesson>.json`

These files are optional. They are per language, and any field you leave out falls back to the lesson text:

```json
{
  "en": {
    "kicker": "Learn investing · Lesson 1",
    "hook": "Your money in the bank buys less every year",
    "stat": { "from": "1,000", "to": "492", "note": "What 1,000 buys in 24 years at 3% inflation a year. Illustrative figures." },
    "caption": "First line of the caption",
    "hashtags": "#investing #personalfinance"
  },
  "ar": { "…": "…" }
}
```

The content is educational only: take figures from the lesson (labelled as illustrations), and never name or recommend real products.
