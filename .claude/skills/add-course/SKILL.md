---
name: add-course
description: Add a whole new course (e.g. "Project management") alongside the existing ones. Use when the user wants another course.
---

# Add a course

1. Create `src/content/courses/<course-id>/index.ts` exporting a `Course` (see `investing/index.ts`): `id`, `category` (`careers`, `business` or `management`; add a new category in `CourseCategory`, `HomePage`'s `CATEGORIES` and the `category.*` i18n keys if neither fits), localized `title`/`description`, `audiences` (required, at least one of `job-seekers` / `professionals` / `entrepreneurs` — Home filters on it), `audience` (one sentence, "who it's for" — a test requires it in EN and AR), optional `notice` (shown on the course page — required wording for finance topics: educational only, not financial advice), nav `groups`, and `loaders`.
2. Build content with the shared helpers in `src/content/helpers.ts` (`L`, `section`, `mcq`, …).
3. List the course in `src/content/courses.ts` (`courses` array). The home page, `/course/<id>` page, lesson mode, sidebar, contents panel and prev/next all derive from it — no router changes needed.
4. Pick a distinct letters-only question-ID prefix per module, unique app-wide (a test enforces this).
5. Add modules with the `add-module` skill, and check their steps with the `lesson-cards` skill. Run `npm test`, `npm run lint`, `npm run build`.
