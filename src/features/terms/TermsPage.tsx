import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, Icon, AbuShreek } from '../../components/ui'
import type { Localized } from '../../content/types'
import { useLocalized } from '../../content/useLocalized'
import { lessonKey, lessonTerms } from '../../domain/lessons'
import { useProgress } from '../../state/useProgress'
import { useTrail, useTrailId } from '../../state/useTrail'
import styles from './TermsPage.module.css'

type Mode = 'en' | 'ar' | 'both'
interface Entry {
  term: Localized
  lessonTitle: Localized
  collected: boolean
  lessonNo: number
}

/** Design 16: the key words of the trail, collected as their lessons are finished. */
export function TermsPage() {
  const { t, i18n } = useTranslation()
  const tc = useLocalized()
  const { progress } = useProgress()
  const { course, chapters } = useTrail(useTrailId())
  const [mode, setMode] = useState<Mode>(i18n.language === 'ar' ? 'ar' : 'en') // one language unless the learner asks for both
  const [picked, setPicked] = useState(0)
  const [flipped, setFlipped] = useState(false)

  let counter = 0
  const entries: Entry[] = chapters.flatMap((c) =>
    c.lessons.flatMap((l) => {
      counter += 1
      const collected = progress.lessonsDone.includes(lessonKey(course.id, c.id, l.id))
      return lessonTerms(l).map((term) => ({ term, lessonTitle: l.title, collected, lessonNo: counter }))
    }),
  )
  const got = entries.filter((e) => e.collected)
  const nextLocked = entries.find((e) => !e.collected)
  const featured = got[Math.min(picked, got.length - 1)]
  // Which language(s) the big card shows; Flip swaps a single-language card to the other one.
  const sides = mode === 'both' ? ['en', 'ar'] : (mode === 'en') !== flipped ? ['en'] : ['ar']

  return (
    <div className={styles.page}>
      <Link to="/review" className={styles.back} aria-label={t('back')}>
        <Icon name="back" size={26} />
      </Link>
      <header className={styles.head}>
        <div>
          <h1>{t('termsTitle')}</h1>
          <p className={styles.sub}>{t('termsCollected', { n: got.length, total: entries.length })}</p>
        </div>
        <AbuShreek pose="point" height={120} />
      </header>

      <div className={styles.seg} role="group">
        {(['en', 'ar', 'both'] as Mode[]).map((m) => (
          <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} lang={m === 'both' ? undefined : m}>
            {t(m === 'en' ? 'termsEnglish' : m === 'ar' ? 'termsArabic' : 'termsBoth')}
          </button>
        ))}
      </div>

      {featured ? (
        <Card tone="dawn" className={styles.featured}>
          <div className={styles.fTerms}>
            {sides.includes('en') && <strong>{featured.term.en}</strong>}
            {sides.includes('ar') && (
              <strong lang="ar" dir="rtl" className={styles.ar}>
                {featured.term.ar ?? featured.term.en}
              </strong>
            )}
          </div>
          <div className={styles.fFoot}>
            <span className={styles.from}>{t('fromLesson', { title: tc(featured.lessonTitle) })}</span>
            <button type="button" className={styles.flip} onClick={() => setFlipped((f) => !f)}>
              <Icon name="flip" size={20} /> {t('flip')}
            </button>
          </div>
        </Card>
      ) : (
        <p className={styles.empty}>{t('termsEmpty')}</p>
      )}

      {got.length > 0 && <h2 className={styles.kicker}>{t('yourCollection')}</h2>}
      <div className={styles.grid}>
        {got.map((e, i) => (
          <button
            key={e.term.en}
            type="button"
            className={`${styles.chip} ${i === picked ? styles.chipOn : ''}`}
            onClick={() => {
              setPicked(i)
              setFlipped(false)
            }}
          >
            {mode !== 'ar' && <strong>{e.term.en}</strong>}
            {mode !== 'en' && (
              <span lang="ar" dir="rtl">
                {e.term.ar ?? e.term.en}
              </span>
            )}
          </button>
        ))}
        {nextLocked && (
          <div className={styles.locked}>
            <span>{t('nextLocked', { title: tc(nextLocked.lessonTitle) })}</span>
            <Icon name="lock" size={22} />
          </div>
        )}
      </div>
    </div>
  )
}
