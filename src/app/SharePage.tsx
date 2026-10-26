// Route `/share/:courseId/:moduleId/:lessonId?slide=N&lang=ar|en&guide=saud|sara&quiz=1`: one slide of a social carousel
// (1080×1350) cut from a roadmap lesson (`shareSlides`, src/domain/share.ts), drawn with the app's own components.
// scripts/social/export-post.mjs screenshots every slide and saves the draft caption. Lives in src/app because it
// reuses the lesson feature's question card (a feature may not import another feature).
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCourse } from '../content/courses'
import type { Localized } from '../content/types'
import { useLocalized } from '../content/useLocalized'
import { useModule } from '../content/useModule'
import { lessonsFor } from '../domain/lessons'
import { shareSlides, type Slide } from '../domain/share'
import { Blocks } from '../components/content/Blocks'
import contentStyles from '../components/content/content.module.css'
import { safeHtml } from '../components/content/safeHtml'
import { Logo } from '../components/Logo'
import { AnswerOption, Guide } from '../components/ui'
import { QuestionCard } from '../features/lesson/LessonParts'
import lessonStyles from '../features/lesson/LessonPage.module.css'
import styles from './SharePage.module.css'

/** Optional hand-written hook, stat and caption for a lesson, per language (social/posts/<course>/<module>/<lesson>.json). */
interface PostOverride {
  kicker?: string
  hook?: string
  stat?: { from: string; to: string; note?: string }
  caption?: string
  hashtags?: string
}
type PostFile = Partial<Record<'en' | 'ar', PostOverride>>
const POSTS = import.meta.glob<PostFile>('/social/posts/**/*.json', { import: 'default' })

/** How far the content may shrink to fit the slide (a zoom on the content area: the text reflows wider). */
const FITS = [1, 0.94, 0.88, 0.82, 0.76]

const plain = (html: string) => html.replace(/<\/(p|li|h\d)>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

export function SharePage() {
  const { courseId, moduleId, lessonId } = useParams<{ courseId: string; moduleId: string; lessonId: string }>()
  const [search] = useSearchParams()
  const { i18n } = useTranslation()
  const want = search.get('lang') === 'ar' ? 'ar' : search.get('lang') === 'en' ? 'en' : null
  const [langReady, setLangReady] = useState(!want || i18n.language === want)
  useEffect(() => {
    if (want && i18n.language !== want) void i18n.changeLanguage(want).then(() => setLangReady(true))
  }, [want, i18n])

  const { mod, loading, notFound } = useModule(courseId, moduleId)
  const [post, setPost] = useState<PostFile | null | undefined>(undefined)
  useEffect(() => {
    const load = POSTS[`/social/posts/${courseId}/${moduleId}/${lessonId}.json`]
    if (!load) setPost(null)
    else void load().then(setPost, () => setPost(null))
  }, [courseId, moduleId, lessonId])

  const lessons = useMemo(() => (mod ? lessonsFor(mod) : []), [mod])
  const at = lessons.findIndex((l) => l.id === lessonId)
  const quiz = search.get('quiz') === '1' // the questions and answers too (left out of posts by default)
  const slides = useMemo(() => (at >= 0 ? shareSlides(lessons[at], { quiz }) : []), [lessons, at, quiz])

  if (notFound || !getCourse(courseId) || (mod && at === -1)) return <p data-share-error="not-found">Not found</p>
  if (loading || !mod || !langReady || post === undefined) return null
  const n = Math.min(Math.max(1, Number(search.get('slide')) || 1), slides.length)
  const lang = i18n.language === 'ar' ? 'ar' : 'en'
  return (
    <SlideView
      key={n}
      slides={slides}
      index={n - 1}
      courseTitle={getCourse(courseId)!.title}
      notice={getCourse(courseId)!.notice}
      lessonNumber={`${mod.order}.${at + 1}`}
      override={post?.[lang] ?? {}}
    />
  )
}

function SlideView({ slides, index, courseTitle, notice, lessonNumber, override }: { slides: Slide[]; index: number; courseTitle: Localized; notice?: Localized; lessonNumber: string; override: PostOverride }) {
  const t = useLocalized()
  const { t: tUi } = useTranslation()
  const slide = slides[index]
  const dark = slide.kind === 'hook' || slide.kind === 'cta'
  const content = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [fit, setFit] = useState(0)
  const [ready, setReady] = useState(false)
  const [overflow, setOverflow] = useState(false)

  // Measure only once the fonts and pictures are in: both change the height
  useEffect(() => {
    let live = true
    const imgs = [...(root.current?.querySelectorAll('img') ?? [])]
    void Promise.all([document.fonts.ready, ...imgs.map((img) => img.decode().catch(() => undefined))]).then(() => live && setLoaded(true))
    return () => {
      live = false
    }
  }, [])
  useLayoutEffect(() => {
    const el = content.current
    if (!loaded || !el) return
    const over = el.scrollHeight > el.clientHeight + 1
    if (over && fit < FITS.length - 1) return setFit(fit + 1)
    setOverflow(over)
    setReady(true)
  }, [loaded, fit])

  const hook = slide.kind === 'hook' ? slide : null
  const firstQuestion = slides.findIndex((s) => s.kind === 'question') + 1
  const idea = slides.find((s) => s.kind === 'idea')
  const caption = [
    override.caption ?? override.hook ?? t(slides[0].kind === 'hook' ? slides[0].title : courseTitle),
    plain(t(idea?.kind === 'idea' ? idea.html : slides[0].kind === 'hook' && slides[0].standfirst ? slides[0].standfirst : courseTitle)),
    override.stat?.note && `${override.stat.from} → ${override.stat.to}: ${override.stat.note}`,
    firstQuestion > 0 && `❓ ${tUi('share_caption_quiz', { n: firstQuestion })}`,
    `📚 ${tUi('share_caption_app')}`,
    notice && `⚠️ ${t(notice)}`,
    override.hashtags ?? tUi('share_hashtags'),
  ].filter(Boolean)

  return (
    <div
      ref={root}
      className={styles.canvas}
      data-slide={index + 1}
      data-slide-count={slides.length}
      data-ready={ready || undefined}
      data-overflow={ready ? String(overflow) : undefined}
    >
      <div className={`${styles.slide} ${dark ? styles.dark : ''}`}>
        <header className={styles.top}>
          <span className={styles.brand}>
            <Logo size={26} /> {tUi('share_brand')}
          </span>
          <span className={styles.count} dir="ltr">
            {index + 1} / {slides.length}
          </span>
        </header>

        <div ref={content} className={`${styles.body} ${styles[slide.kind]}`} style={{ zoom: FITS[fit] } as CSSProperties}>
          {hook && (
            <>
              <p className={styles.kickerDark}>{override.kicker ?? `${t(courseTitle)} · ${tUi('share_lesson_n', { n: lessonNumber })}`}</p>
              <h1 className={styles.headline}>{override.hook ?? t(hook.title)}</h1>
              {override.stat && (
                <>
                  <p className={styles.stat} dir="ltr">
                    <span>{override.stat.from}</span> <b aria-hidden>→</b> <span className={styles.statTo}>{override.stat.to}</span>
                  </p>
                  <p className={styles.statNote}>{override.stat.note ?? tUi('share_illustrative')}</p>
                </>
              )}
              {hook.standfirst && !override.stat && <p className={styles.sub} dangerouslySetInnerHTML={safeHtml(t(hook.standfirst))} />}
              <Guide pose="point" height={136} className={styles.hookGuide} />
            </>
          )}

          {slide.kind === 'content' && (
            <div className={`${styles.card} ${contentStyles.content}`}>
              <Blocks blocks={slide.blocks} />
            </div>
          )}

          {slide.kind === 'idea' && (
            <>
              <div className={contentStyles.content}>
                <Blocks blocks={[{ type: 'keyIdea', html: slide.html }]} />
              </div>
              <Guide pose="think" height={130} className={styles.guide} />
            </>
          )}

          {slide.kind === 'question' && (
            <>
              <QuestionCard question={slide.question} kicker={tUi('quickCheck')} selected={null} checked={false} onSelect={() => undefined} />
              <p className={styles.swipe}>{tUi('share_swipe')}</p>
            </>
          )}

          {/* The answer: the question again, only the right option (ticked), and why */}
          {slide.kind === 'answer' && (
            <>
              <p className={lessonStyles.kicker}>{tUi('share_answer')}</p>
              <h1 className={lessonStyles.prompt}>{t(slide.question.prompt)}</h1>
              <AnswerOption ring state="correct" disabled>
                {t(slide.question.options[slide.question.answer])}
              </AnswerOption>
              {slide.question.explain && (
                <div className={styles.why}>
                  <span className={styles.chip}>{tUi('share_why')}</span>
                  <p>{t(slide.question.explain)}</p>
                </div>
              )}
            </>
          )}

          {slide.kind === 'cta' && (
            <>
              <Logo size={52} />
              <h1 className={styles.headline}>{tUi('share_cta_title')}</h1>
              <p className={styles.sub}>{tUi('share_cta_sub')}</p>
              <p className={styles.handle}>{tUi('share_link_bio')}</p>
              {notice && <p className={styles.legal}>{t(notice)}</p>}
              <Guide pose="cheer" height={120} className={styles.guide} />
            </>
          )}
        </div>

        <div className={styles.progress} aria-hidden>
          {slides.map((_, k) => (
            <i key={k} className={k <= index ? styles.on : undefined} />
          ))}
        </div>
      </div>
      <pre id="share-caption" hidden>
        {caption.join('\n\n')}
      </pre>
    </div>
  )
}
