// Social carousel slides cut from a roadmap lesson (the share route, src/app/SharePage.tsx). Pure: the page draws
// them with the app's own components, and scripts/social/export-post.mjs screenshots them.
import type { Block, Localized, Question } from '../content/types'
import { blockWords } from './chunks'
import type { Lesson } from './lessons'

export type Slide =
  | { kind: 'hook'; title: Localized; standfirst?: Localized }
  | { kind: 'content'; blocks: Block[] }
  | { kind: 'idea'; html: Localized }
  | { kind: 'question'; question: Question }
  | { kind: 'answer'; question: Question }
  | { kind: 'cta' }

/** Blocks a still image can't carry: lists of goals, the live simulator, sliders, and the lesson's own plumbing. */
const DROPPED = new Set<Block['type']>(['objectives', 'takeaways', 'practice', 'calculator', 'exercise', 'cardBreak'])
/** Pictures and tables get a slide of their own. */
const ALONE = new Set<Block['type']>(['diagram', 'table', 'code', 'tabs', 'formula'])
/** Most words of text on one slide (the image is read at a glance; a step of the app is up to 90). */
export const SLIDE_WORDS = 55

/** The standfirst inside a section's heading markup (`heading()` in src/content/helpers.ts). */
const standfirstOf = (html?: Localized): Localized | undefined => {
  const pick = (s?: string) => s?.match(/<p class="standfirst">([\s\S]*?)<\/p>/)?.[1]
  const en = pick(html?.en)
  return en ? { en, ar: pick(html?.ar) } : undefined
}

/** The slides of a lesson: a hook, its text in short slides (a picture or table alone), the key idea, and a closing
 *  call to action. With `quiz`, each question also comes twice before the call to action (asked, then answered with
 *  why); posts leave them out by default. */
export function shareSlides(lesson: Lesson, { quiz = false }: { quiz?: boolean } = {}): Slide[] {
  const first = lesson.steps.find((s) => s.kind === 'content')
  const slides: Slide[] = [{ kind: 'hook', title: lesson.title, standfirst: standfirstOf(first?.kind === 'content' ? first.heading?.html : undefined) }]
  const ideas: Slide[] = []
  let text: Block[] = []
  const flush = () => {
    if (text.length) slides.push({ kind: 'content', blocks: text })
    text = []
  }
  for (const step of lesson.steps) {
    if (step.kind !== 'content') continue
    for (const block of step.blocks) {
      if (DROPPED.has(block.type)) continue
      if (block.type === 'keyIdea') {
        ideas.push({ kind: 'idea', html: block.html })
      } else if (ALONE.has(block.type)) {
        flush()
        slides.push({ kind: 'content', blocks: [block] })
      } else {
        const words = text.reduce((n, b) => n + blockWords(b), 0)
        if (text.length && words + blockWords(block) > SLIDE_WORDS) flush()
        text.push(block)
      }
    }
    flush()
  }
  slides.push(...ideas)
  for (const step of quiz ? lesson.steps : []) {
    if (step.kind === 'question') slides.push({ kind: 'question', question: step.question }, { kind: 'answer', question: step.question })
  }
  slides.push({ kind: 'cta' })
  return slides
}

// ---- carousel-engine markdown (RamiAlkhateeb/carousel-engine) ----------------------------------------------------
// The same slides written in the engine's markdown: front matter, then one `<!-- slide:layout -->` per slide from its
// closed set (cover first, framework, story, cta), plain text only, a body of at most 300 characters, and an `image:`
// on every slide (the app's guides and charts, copied next to the markdown as assets/…). The engine renders it with
// its `zubda` theme (scripts/social/to-carousel.mjs).

export type Lang = 'en' | 'ar'

/** Engine limits (its validator warns past these; it never shrinks text, so we cut at sentence ends instead) */
export const ENGINE = { coverTitle: 90, storyTitle: 78, frameworkTitle: 72, labels: 3, labelChars: 36, body: 300 } as const

export interface CarouselMeta {
  lang: Lang
  slug: string
  /** The lesson's title in this language */
  title: string
  /** Brand shown in the engine's header */
  author: string
  guide: 'saud' | 'sara'
  kicker: string
  /** Optional hand-written hook and stat (social/posts/…) */
  hook?: string
  stat?: { from: string; to: string; note?: string }
  text: { keyIdea: string; quickCheck: string; answer: string; ctaTitle: string; ctaBody: string }
}

export interface CarouselPost {
  markdown: string
  /** Files the markdown points at: `from` under the app's public/ folder, `to` the name in assets/ */
  assets: { from: string; to: string }[]
}

type GuidePose = 'point' | 'think' | 'cheer' | 'oops' | 'news'
type EngineSlide = { layout: 'cover' | 'framework' | 'story' | 'cta'; eyebrow?: string; title?: string; body?: string; image: string; labels?: string[] }

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ' }
/** Lesson HTML as one line of plain text (paragraph and list breaks become spaces). */
export const plainText = (html: string) =>
  html
    .replace(/<\/(p|li|h\d|div|tr)>|<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#?\w+);/g, (m, e: string) => ENTITIES[e] ?? m)
    .replace(/\s+/g, ' ')
    .trim()

/** Sentences, each keeping its end mark (. ! ? ؟ …). A mark only ends a sentence before a space, so 2.00 stays whole. */
const sentences = (text: string) => text.split(/(?<=[.!?؟…]["”»)]*)\s+/).map((s) => s.trim()).filter(Boolean)

/** Packs sentences into pieces of at most `max` characters (a single longer sentence stays whole: the engine warns). */
function pack(parts: string[], max: number): string[] {
  const out: string[] = []
  for (const part of parts) {
    const last = out.at(-1)
    if (last !== undefined && last.length + 1 + part.length <= max) out[out.length - 1] = `${last} ${part}`
    else out.push(part)
  }
  return out
}

/** A title and its body as story slides: the first sentence is the title when it fits, the rest is cut to ≤300. */
function storySlides(text: string, fallbackTitle: string, image: string, eyebrow?: string): EngineSlide[] {
  const parts = sentences(text)
  const lead = parts.length > 1 && parts[0].length <= ENGINE.storyTitle ? parts.shift()! : undefined
  const bodies = pack(parts, ENGINE.body)
  return bodies.map((body, i) => ({ layout: 'story', eyebrow, title: i === 0 && lead ? lead : fallbackTitle, body, image }))
}

const BOX_POSE: Record<string, GuidePose> = { example: 'news', mistake: 'oops', analogy: 'point', keypoint: 'point' }

/** The lesson's slides as carousel-engine markdown, in one language. */
export function carouselPost(slides: Slide[], meta: CarouselMeta): CarouselPost {
  const t = (l: Localized | undefined) => (l ? (meta.lang === 'ar' ? (l.ar ?? l.en) : l.en) : '')
  const assets = new Map<string, string>()
  const guide = (pose: GuidePose) => {
    const name = `${meta.guide}-${pose}.png`
    assets.set(`guides/${name}`, name)
    return `assets/${name}`
  }
  const picture = (src: string) => {
    const name = src.replace(/^\//, '').replace(/^diagrams\//, '')
    assets.set(src.replace(/^\//, ''), name)
    return `assets/${name}`
  }

  const out: EngineSlide[] = []
  for (const slide of slides) {
    switch (slide.kind) {
      case 'hook':
        out.push({
          layout: 'cover',
          eyebrow: meta.kicker,
          title: meta.hook ?? meta.title,
          body: meta.stat ? `${meta.stat.from} → ${meta.stat.to}${meta.stat.note ? `: ${meta.stat.note}` : ''}` : slide.standfirst && plainText(t(slide.standfirst)),
          image: guide('point'),
        })
        break
      case 'content':
        for (const block of slide.blocks) out.push(...blockSlides(block))
        break
      case 'idea':
        out.push(...storySlides(plainText(t(slide.html)), meta.title, guide('think'), meta.text.keyIdea))
        break
      case 'question': {
        const q = slide.question
        const prompt = t(q.prompt)
        const labels = q.options.map(t)
        // As chips when they fit the framework layout; otherwise a story slide listing the options
        if (prompt.length <= ENGINE.frameworkTitle && labels.length <= ENGINE.labels && labels.every((l) => l.length <= ENGINE.labelChars))
          out.push({ layout: 'framework', eyebrow: meta.text.quickCheck, title: prompt, labels, image: guide('think') })
        else
          for (const body of pack([...sentences(plainText(prompt)), ...labels.map((l, i) => `(${i + 1}) ${l}`)], ENGINE.body))
            out.push({ layout: 'story', eyebrow: meta.text.quickCheck, title: meta.title, body, image: guide('think') })
        break
      }
      case 'answer': {
        const q = slide.question
        // The right option is the title; why is the body
        const why = pack(sentences(q.explain ? plainText(t(q.explain)) : ''), ENGINE.body)
        const right = plainText(t(q.options[q.answer]))
        const title = right.length <= ENGINE.storyTitle ? right : meta.title
        for (const [i, body] of (why.length ? why : ['']).entries())
          out.push({ layout: 'story', eyebrow: meta.text.answer, title: i === 0 ? title : meta.title, body: body || undefined, image: guide('cheer') })
        break
      }
      case 'cta':
        out.push({ layout: 'cta', title: meta.text.ctaTitle, body: meta.text.ctaBody, image: guide('cheer') })
        break
    }
  }

  function blockSlides(block: Block): EngineSlide[] {
    switch (block.type) {
      case 'html':
        return storySlides(plainText(t(block.html)), meta.title, guide('point'))
      case 'box':
        return storySlides(plainText(t(block.html)), t(block.label), guide(BOX_POSE[block.variant] ?? 'point'), t(block.label))
      case 'diagram': {
        const caption = plainText(t(block.caption))
        return [{ layout: 'story', eyebrow: t(block.fig), title: plainText(t(block.title)), body: caption, image: picture(block.src) }]
      }
      case 'table': {
        const head = block.headers.map((h) => plainText(t(h)))
        const rows = block.rows.map((r) => r.map((c, i) => (i === 0 ? plainText(t(c)) : `${head[i]}: ${plainText(t(c))}`)).join(', ') + '.')
        return pack(rows, ENGINE.body).map((body) => ({ layout: 'story', title: meta.title, body, image: guide('point') }))
      }
      case 'formula':
        return [{ layout: 'story', title: block.eq, body: plainText(t(block.note)), image: guide('point') }]
      case 'tabs':
        return (block.tabs[0]?.blocks ?? []).flatMap(blockSlides)
      default:
        return []
    }
  }

  const line = (k: string, v: string | undefined) => (v ? `${k}: ${v.replace(/\s+/g, ' ')}\n` : '')
  const body = out
    .map((s) => {
      const heading = s.title ? `${s.layout === 'cover' ? '#' : '##'} ${s.title}\n` : ''
      return `<!-- slide:${s.layout} -->\n${line('eyebrow', s.eyebrow)}${line('image', s.image)}${s.labels ? line('labels', s.labels.join(' | ')) : ''}\n${heading}${s.body ? `\n${s.body}\n` : ''}`
    })
    .join('\n')
  const quote = (v: string) => JSON.stringify(v)
  const markdown = `---\ntitle: ${quote(meta.title)}\nlanguage: ${meta.lang}\nslug: ${meta.slug}\nauthor: ${quote(meta.author)}\ntheme: zubda\n---\n\n${body}`
  return { markdown, assets: [...assets].map(([from, to]) => ({ from, to })) }
}
