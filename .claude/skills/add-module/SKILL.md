---
name: add-module
description: Add a new module (lesson page) to an existing course in src/content/courses. Use when writing or porting a module, e.g. "write the SQL module" or "turn the System Design notes into a module".
---

# Add a module to a course

Modules are typed TypeScript files (`Module` in `src/content/types.ts`). All text is `Localized` — **English and Arabic live inline**; there is no separate locale folder.

## Steps
1. Create `src/content/courses/<course>/<module-id>.ts` exporting a `Module`. Copy the shape of `investing/basics.ts` (compact, uses the shared helpers) or `tech-interview/dsa.ts` (code tabs). Use the builders in `src/content/helpers.ts`: `L(en, ar)`, `cover`, `section`, `html`, `box`, `table`, `formula`, `objectives`, `takeaways`, `exercise`, `mcq`.
2. Question IDs are **stable**: `<prefix>-qNNN` (e.g. `sql-q003`), zero-padded, never renumbered or reused — saved progress in readers' browsers references them. `mcq()` builds the ID for you. Prefixes are letters only and unique across the whole app. Options are shown in a shuffled (stable) order, so you can write the correct answer anywhere.
3. Every `Section` needs a short `navLabel` (sidebar text) and a unique `id` (used for `#deep-links` and progress).
4. Reuse the existing `Block` variants before inventing one: `html`, `objectives`, `takeaways`, `box` (analogy / mistake / keypoint / example), `code`, `formula`, `table`, `tabs` (e.g. Python / C# / JS), `exercise`, `diagram`.
   Roadmap lessons are cut from this automatically (one paragraph / list / box / table / code per card, see `src/domain/chunks.ts`), so keep paragraphs short and one idea each. Put each `exercise` right after the content it tests — a lesson only asks about cards it has shown. Use `cardBreak` (from `src/content/helpers.ts`) only to force an extra split.
5. Register it: add a lazy loader to `loaders` in the course's `index.ts` (`dsa: () => import('./dsa').then((m) => m.dsa)`). The nav item usually exists already as a "Soon" entry; if not, add it to the right group. Without a loader the module shows a "Soon" badge.
6. Provide `ar` for every `Localized` value. Arabic technical terms stay in Latin script (e.g. `Dictionary`, `async`).
7. Verify: `npm test` (checks ids, answer ranges, every question is shown, every text has Arabic), `npm run lint`, `npm run build`, then open the module in `npm run dev` and flip EN/AR + dark mode.

## Notes
- Raw `<script>` or event handlers inside `html` blocks are not allowed — content is rendered with `dangerouslySetInnerHTML`, so only author-controlled markup goes in.
- Images/diagrams go in `public/figures/<course>/<module>/` and are referenced root-absolute (`/figures/...`); `resolveAssetPath` adds the GitHub Pages base path.
- Practice solutions the author wrote live in `solutions/` — link to them, don't copy rough code into the course; write the clean pattern solution.
