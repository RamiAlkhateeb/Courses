// Route `/studio` (hidden: linked from nowhere, noindex): turn a lesson into carousel slides from the browser. It previews
// the share route's slides (src/app/SharePage.tsx) in same-origin iframes, so the slides are drawn by exactly the code the
// command-line export uses (scripts/social/export-post.mjs), then saves each one as a PNG with html-to-image (loaded only
// when a download is pressed), copies the draft caption, and saves the carousel-engine markdown and its pictures.
// Lessons past the free ones follow the guest gate, like /share itself.
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ENABLED_COURSE_IDS, getCourse } from '../content/courses'
import { useLocalized } from '../content/useLocalized'
import { DEFAULT_TRAIL } from '../domain/profile'
import { useTrail } from '../state/useTrail'
import { ListGroup, ListPicker, ListSwitch } from '../components/SettingsList'
import { Button, Icon } from '../components/ui'
import type { ParseKeys } from 'i18next'
import i18n from '../i18n'
import { studioAr, studioEn } from '../i18n/locales/studio'
import styles from './StudioPage.module.css'

// The studio's own strings, added to i18next only here (they stay out of the first screen's download). A language's
// strings are added once that language is loaded: adding Arabic earlier would stop i18next loading the main Arabic file.
const STRINGS: Record<string, Record<string, string>> = { en: studioEn, ar: studioAr }
function addStudioStrings(lng: string) {
  if (STRINGS[lng] && !i18n.exists('studio_title', { lng, fallbackLng: false })) i18n.addResourceBundle(lng, 'translation', STRINGS[lng], true, false)
}
addStudioStrings('en')
i18n.on('languageChanged', addStudioStrings)
type StudioKey = keyof typeof studioEn | 'studio_download_all' | 'studio_assets' | 'studio_saved' | 'studio_slides'

const W = 1080
const H = 1350

type Lang = 'en' | 'ar'
type GuideName = 'saud' | 'sara'

/** The slide root inside a share iframe, once drawn and fitted; 'gate' when the lesson is behind the sign-up gate. */
async function slideRoot(frame: HTMLIFrameElement, timeout = 20_000): Promise<HTMLElement | 'gate'> {
  const start = Date.now()
  for (;;) {
    const doc = frame.contentDocument
    const root = doc?.querySelector<HTMLElement>('[data-slide-count][data-ready]')
    if (root) {
      await doc!.fonts.ready
      return root
    }
    // The share route shows the sign-up gate instead of the slide for a lesson a guest can't open
    if (doc?.querySelector('a[href$="/signup"]') && !doc.querySelector('[data-slide-count]')) return 'gate'
    if (Date.now() - start > timeout) throw new Error('slide did not load')
    await new Promise((r) => setTimeout(r, 120))
  }
}

/** Save `blob` as a file called `name` (a link in the page, clicked, then removed). */
function save(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export function StudioPage() {
  const { t: tr, i18n: i } = useTranslation()
  addStudioStrings(i.language)
  const t = (key: StudioKey, options?: Record<string, unknown>) => tr(key as ParseKeys, options) as string
  const tc = useLocalized()
  const [search, setSearch] = useSearchParams()

  // The choice lives in the URL, so a set-up can be bookmarked
  const courseId = getCourse(search.get('course') ?? '') ? search.get('course')! : DEFAULT_TRAIL
  const { course, chapters, loaded } = useTrail(courseId)
  const chapter = chapters.find((c) => c.id === search.get('module')) ?? chapters[0]
  const lesson = chapter?.lessons.find((l) => l.id === search.get('lesson')) ?? chapter?.lessons[0]
  const lang: Lang = search.get('lang') === 'ar' ? 'ar' : 'en'
  const guide: GuideName = search.get('guide') === 'saud' || search.get('guide') === 'sara' ? (search.get('guide') as GuideName) : lang === 'ar' ? 'saud' : 'sara'
  const quiz = search.get('quiz') === '1'
  const set = (patch: Record<string, string | null>) =>
    setSearch((s) => {
      const next = new URLSearchParams(s)
      for (const [k, v] of Object.entries(patch)) {
        if (v === null) next.delete(k)
        else next.set(k, v)
      }
      return next
    }, { replace: true })

  // Studio pages are tools, not search results
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  const key = chapter && lesson ? `${courseId}/${chapter.id}/${lesson.id}` : ''
  const src = (n: number) => `${import.meta.env.BASE_URL}share/${key}?slide=${n}&lang=${lang}&guide=${guide}${quiz ? '&quiz=1' : ''}`
  const slug = `zubda-${key.replace(/\//g, '-')}.${lang}`

  // The first slide says how many there are, and holds the caption and the engine markdown
  const [count, setCount] = useState(0)
  const [gated, setGated] = useState(false)
  const [overflow, setOverflow] = useState<number[]>([])
  const [caption, setCaption] = useState('')
  const [engine, setEngine] = useState<{ markdown: string; assets: { from: string; to: string }[] } | null>(null)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const frames = useRef<(HTMLIFrameElement | null)[]>([])

  // A new choice starts over
  useEffect(() => {
    setCount(0)
    setGated(false)
    setOverflow([])
    setCaption('')
    setEngine(null)
    setNote('')
  }, [key, lang, guide, quiz])

  async function firstLoaded(frame: HTMLIFrameElement) {
    try {
      const root = await slideRoot(frame)
      if (root === 'gate') return setGated(true)
      setCount(Number(root.dataset.slideCount))
      if (root.dataset.overflow === 'true') setOverflow((o) => (o.includes(1) ? o : [1, ...o]))
      const doc = frame.contentDocument!
      const draft = lang === 'ar' ? '[مسودة: راجِعها وعدّلها قبل النشر]' : '[DRAFT: review and edit before posting]'
      setCaption(`${draft}\n\n${doc.getElementById('share-caption')?.textContent ?? ''}`)
      const pre = doc.getElementById('share-carousel')
      if (pre) setEngine({ markdown: pre.textContent ?? '', assets: JSON.parse(pre.dataset.assets ?? '[]') })
    } catch {
      setNote(t('studio_failed'))
    }
  }

  async function slideLoaded(n: number, frame: HTMLIFrameElement) {
    const root = await slideRoot(frame).catch(() => null)
    if (root && root !== 'gate' && root.dataset.overflow === 'true') setOverflow((o) => (o.includes(n) ? o : [...o, n].sort((a, b) => a - b)))
  }

  /** Slide `n` as a 1080×1350 PNG, drawn from the iframe's own DOM. */
  async function png(n: number): Promise<Blob> {
    const frame = frames.current[n - 1]
    if (!frame) throw new Error('no slide')
    const root = await slideRoot(frame)
    if (root === 'gate') throw new Error('gated')
    const { toBlob } = await import('html-to-image')
    const blob = await toBlob(root, { width: W, height: H, pixelRatio: 1, canvasWidth: W, canvasHeight: H })
    if (!blob) throw new Error('empty picture')
    return blob
  }
  const fileName = (n: number) => `${slug}-${String(n).padStart(2, '0')}.png`

  async function download(ns: number[]) {
    setBusy(true)
    setNote('')
    try {
      for (const n of ns) save(await png(n), fileName(n))
      setNote(t('studio_saved', { count: ns.length }))
    } catch {
      setNote(t('studio_failed'))
    } finally {
      setBusy(false)
    }
  }

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(caption)
      setNote(t('studio_copied'))
    } catch {
      setNote(t('studio_failed'))
    }
  }

  const slides = Array.from({ length: Math.max(1, count) }, (_, i) => i + 1)
  const cli = `node scripts/social/export-post.mjs ${key.replace(/\//g, ' ')} --lang ${lang} --guide ${guide}${quiz ? ' --quiz' : ''}`
  const lessonLabel = (l: { title: Parameters<typeof tc>[0] }, i: number) => `${i + 1}. ${tc(l.title)}`

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1>{t('studio_title')}</h1>
        <p>{t('studio_sub')}</p>
      </header>

      <div className={styles.layout}>
        <div className={styles.controls}>
          <ListGroup>
            {ENABLED_COURSE_IDS.length > 1 && (
              <ListPicker
                icon="book"
                label={t('studio_course')}
                value={tc(course.title)}
                options={ENABLED_COURSE_IDS.map((id) => ({ key: id, label: tc(getCourse(id)!.title), selected: id === courseId, onSelect: () => set({ course: id, module: null, lesson: null }) }))}
              />
            )}
            {loaded && chapter && (
              <ListPicker
                icon="flag"
                label={t('studio_unit')}
                value={tc(chapter.title)}
                options={chapters.map((c) => ({ key: c.id, label: tc(c.title), selected: c.id === chapter.id, onSelect: () => set({ module: c.id, lesson: null }) }))}
              />
            )}
            {loaded && chapter && lesson && (
              <ListPicker
                icon="sprout"
                label={t('studio_lesson')}
                value={tc(lesson.title)}
                options={chapter.lessons.map((l, i) => ({ key: l.id, label: lessonLabel(l, i), selected: l.id === lesson.id, onSelect: () => set({ lesson: l.id }) }))}
              />
            )}
            <ListPicker
              icon="globe"
              label={t('studio_lang')}
              value={lang === 'ar' ? 'العربية' : 'English'}
              options={(['en', 'ar'] as Lang[]).map((l) => ({
                key: l,
                label: <span lang={l}>{l === 'ar' ? 'العربية' : 'English'}</span>,
                selected: l === lang,
                onSelect: () => set({ lang: l, guide: null }),
              }))}
            />
            <ListPicker
              icon="user"
              label={t('studio_guide')}
              value={t(guide === 'saud' ? 'studio_guide_saud' : 'studio_guide_sara')}
              options={(['sara', 'saud'] as GuideName[]).map((g) => ({ key: g, label: t(g === 'saud' ? 'studio_guide_saud' : 'studio_guide_sara'), selected: g === guide, onSelect: () => set({ guide: g }) }))}
            />
            <ListSwitch icon="help" label={t('studio_quiz')} note={t('studio_quiz_note')} checked={quiz} onChange={(on) => set({ quiz: on ? '1' : null })} />
          </ListGroup>

          {gated ? (
            <p className={styles.warn} role="status">
              <Icon name="lock" size={18} /> {t('studio_gate')}
            </p>
          ) : (
            <div className={styles.actions}>
              <Button disabled={!count || busy} onClick={() => download(slides)}>
                {t('studio_download_all', { count })}
              </Button>
              <Button variant="secondary" disabled={!caption} onClick={copyCaption}>
                {t('studio_copy_caption')}
              </Button>
              <Button variant="secondary" disabled={!engine} onClick={() => engine && save(new Blob([engine.markdown], { type: 'text/markdown' }), `${slug}.md`)}>
                {t('studio_markdown')}
              </Button>
              {engine && engine.assets.length > 0 && (
                <details className={styles.assets}>
                  <summary>{t('studio_assets', { count: engine.assets.length })}</summary>
                  <ul>
                    {engine.assets.map((a) => (
                      <li key={a.from}>
                        <a href={`${import.meta.env.BASE_URL}${a.from}`} download={a.to}>
                          {a.to}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              <p className={styles.note} role="status" aria-live="polite">
                {note}
              </p>
            </div>
          )}

          {overflow.map((n) => (
            <p key={n} className={styles.warn}>
              <Icon name="alert" size={18} /> {t('studio_overflow', { n })}
            </p>
          ))}

          <details className={styles.cli}>
            <summary>{t('studio_cli')}</summary>
            <code dir="ltr">{cli}</code>
          </details>
        </div>

        {/* The slides, drawn by the share route itself, shown at a quarter of their size */}
        {key && (
          <ol className={styles.grid} aria-label={t('studio_slides', { count })} dir="ltr">
            {slides.map((n) => (
              <li key={`${key}-${lang}-${guide}-${quiz}-${n}`} className={styles.tile}>
                <div className={styles.frame}>
                  <iframe
                    ref={(el) => {
                      frames.current[n - 1] = el
                    }}
                    title={t('studio_slide_n', { n })}
                    src={src(n)}
                    tabIndex={-1}
                    onLoad={(e) => (n === 1 ? firstLoaded(e.currentTarget) : slideLoaded(n, e.currentTarget))}
                  />
                </div>
                {count > 0 && (
                  <Button size="sm" variant="secondary" disabled={busy} onClick={() => download([n])}>
                    {t('studio_download_slide', { n })}
                  </Button>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
