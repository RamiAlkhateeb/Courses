import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ListScreen } from '../../components/SettingsList'
import { LOGO_PATHS, LOGO_RADIUS } from '../../components/logoPaths'
import { Button, buttonClass, Guide } from '../../components/ui'
import { getCourse } from '../../content/courses'
import { useLocalized } from '../../content/useLocalized'
import { useAuth } from '../../state/auth'
import { useTrail } from '../../state/useTrail'
import { useProgress } from '../../state/useProgress'
import { useProfile } from '../../state/profile'
import { finishedOn } from '../../domain/progress'
import { lessonKey } from '../../domain/lessons'
import styles from './CertificatePage.module.css'

const W = 600
const H = 420

/** Route `/certificate/:courseId/:moduleId`: a unit's certificate of completion, once every lesson in it is done. Drawn
 *  as SVG so it can be saved as a picture or shared. No scores, no rankings: just what was finished. */
export function CertificatePage() {
  // Without a module: the whole course's certificate
  const { courseId = '', moduleId = '' } = useParams<{ courseId: string; moduleId?: string }>()
  const { t } = useTranslation()
  if (!getCourse(courseId)) return <p>{t('pageNotFound')}</p>
  return <Certificate courseId={courseId} moduleId={moduleId} />
}

function Certificate({ courseId, moduleId }: { courseId: string; moduleId: string }) {
  const { t, i18n } = useTranslation()
  const tc = useLocalized()
  const auth = useAuth()
  const { course, chapters, loaded } = useTrail(courseId)
  const { progress } = useProgress()
  const { name: localName } = useProfile()
  const svg = useRef<SVGSVGElement>(null)
  const [note, setNote] = useState('')
  const whole = !moduleId
  const chapter = chapters.find((c) => c.id === moduleId)
  const rtl = i18n.dir() === 'rtl'

  if (!loaded) return <p>{t('loading')}</p>
  if (!whole && !chapter) return <p>{t('pageNotFound')}</p>
  const scope = whole ? chapters : [chapter!]
  const keys = scope.flatMap((c) => c.lessons.map((l) => lessonKey(courseId, c.id, l.id)))
  const done = keys.length > 0 && scope.every((c) => c.lessons.length > 0 && c.done === c.lessons.length)
  // What the certificate is for: a unit, or the whole course
  const title = whole ? tc(course.title) : tc(chapter!.title)
  const subtitle = whole ? t('cert_course_line', { units: chapters.length, lessons: keys.length }) : tc(course.title)
  if (!done) {
    return (
      <ListScreen title={t('cert_title')} back="/">
        <div className={styles.locked}>
          <Guide pose="point" height={160} />
          <p>{t('cert_locked', { unit: title })}</p>
          <Link to="/" className={buttonClass()}>
            {t('backToLearning')}
          </Link>
        </div>
      </ListScreen>
    )
  }

  const name = (auth.status === 'signedIn' && auth.user ? auth.user.name || auth.user.email : localName) || t('cert_learner')
  // The day the last of these lessons was first finished (today for lessons finished before dates were kept)
  const day = finishedOn(progress, keys)
  const date = new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-u-nu-latn' : 'en', { dateStyle: 'long' }).format(day ? new Date(`${day}T12:00:00`) : new Date())
  const x = rtl ? W - 48 : 48
  const anchor = 'start' // with direction="rtl" on the drawing, start is the right edge

  /** The certificate as a PNG: token colours resolved (a stand-alone image can't read CSS variables), then drawn.
   *  Read from the drawing itself, which is always light (data-theme="light"), even in dark mode. */
  async function toPng(): Promise<Blob> {
    const css = getComputedStyle(svg.current!)
    const source = new XMLSerializer().serializeToString(svg.current!).replace(/var\((--[\w-]+)\)/g, (_, v: string) => css.getPropertyValue(v).trim() || 'currentColor')
    const img = new Image()
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = W * 2
    canvas.height = H * 2
    canvas.getContext('2d')!.drawImage(img, 0, 0, W * 2, H * 2)
    return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('png'))), 'image/png'))
  }
  const fileName = whole ? `zubda-${courseId}.png` : `zubda-${courseId}-${moduleId}.png`

  async function save() {
    const url = URL.createObjectURL(await toPng())
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNote(t('cert_saved'))
  }
  async function share() {
    const file = new File([await toPng()], fileName, { type: 'image/png' })
    try {
      await navigator.share({ files: [file], title: t('cert_title'), text: t('cert_share_text', { unit: title }) })
    } catch {
      // Cancelled, or sharing files isn't possible here: saving still works
    }
  }
  const canShare = typeof navigator !== 'undefined' && 'canShare' in navigator && navigator.canShare({ files: [new File([''], 'x.png', { type: 'image/png' })] })

  return (
    <ListScreen title={whole ? t('cert_course_title') : t('cert_title')} back="/">
      <svg ref={svg} data-theme="light" viewBox={`0 0 ${W} ${H}`} className={styles.cert} role="img" aria-label={t('cert_alt', { name, unit: title, course: subtitle, date })} direction={rtl ? 'rtl' : 'ltr'} xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width={W - 2} height={H - 2} rx="24" fill="var(--white)" stroke="var(--line)" strokeWidth="2" />
        <rect x="16" y="16" width={W - 32} height={H - 32} rx="16" fill="none" stroke="var(--sky)" strokeWidth="2" />
        <g transform={`translate(${rtl ? 48 : W - 48 - 56} 40) scale(0.875)`}>
          <rect width="64" height="64" rx={LOGO_RADIUS} fill="var(--logo-cream)" />
          <path d={LOGO_PATHS.word} fill="var(--logo-teal)" fillRule="evenodd" />
          <path d={LOGO_PATHS.burst} fill="var(--logo-sun)" />
        </g>
        <text x={x} y="70" textAnchor={anchor} fill="var(--blue-text)" fontSize="16" fontWeight="700" letterSpacing={rtl ? 0 : 2}>
          {t('cert_kicker')}
        </text>
        <text x={x} y="150" textAnchor={anchor} fill="var(--muted)" fontSize="18">
          {t('cert_awarded')}
        </text>
        <text x={x} y="196" textAnchor={anchor} fill="var(--indigo)" fontSize="36" fontWeight="700">
          {name}
        </text>
        <text x={x} y="244" textAnchor={anchor} fill="var(--muted)" fontSize="18">
          {t('cert_for')}
        </text>
        <text x={x} y="284" textAnchor={anchor} fill="var(--indigo)" fontSize="26" fontWeight="700">
          {title}
        </text>
        <text x={x} y="314" textAnchor={anchor} fill="var(--muted)" fontSize="18">
          {subtitle}
        </text>
        <line x1="48" x2={W - 48} y1="348" y2="348" stroke="var(--line)" strokeWidth="2" />
        <text x={x} y="380" textAnchor={anchor} fill="var(--muted)" fontSize="15">
          {t('cert_footer', { date })}
        </text>
      </svg>
      <div className={styles.actions}>
        <Button onClick={save}>{t('cert_save')}</Button>
        {canShare && (
          <Button variant="secondary" onClick={share}>
            {t('cert_share')}
          </Button>
        )}
        <p className={styles.note} aria-live="polite">
          {note}
        </p>
      </div>
    </ListScreen>
  )
}
