import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { ParseKeys } from 'i18next'
import { Icon, Flame, StatPill } from '../../components/ui'
import { MoneyChip } from '../../components/MoneyChip'
import { useLocalized } from '../../content/useLocalized'
import { currentStreak, localDay } from '../../domain/progress'
import { useProgress } from '../../state/useProgress'
import { useWallet } from '../../state/usePlayground'
import { useTrail, useTrailId, type Chapter } from '../../state/useTrail'
import { UnitPath, type NodeKind } from './UnitPath'
import styles from './PathPage.module.css'

/** Set once the path has been opened in this browser session: later visits scroll to the lesson smoothly. */
const SCROLLED = 'learnScrolled'
const UNIT_NAMES = 6

const prefersReducedMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
function firstVisit(): boolean {
  try {
    const first = sessionStorage.getItem(SCROLLED) === null
    sessionStorage.setItem(SCROLLED, '1')
    return first
  } catch {
    return true
  }
}

/** Learn (the Home tab): the streak and the play-money balance, then every unit as a vertical garden path. The path
 *  scrolls to the current lesson when it opens; each unit's banner stays pinned while you scroll through the unit. */
export function PathPage() {
  const { t } = useTranslation()
  const tc = useLocalized()
  const { course, chapters, loaded, next } = useTrail(useTrailId())
  const { progress } = useProgress()
  const wallet = useWallet()
  const streak = currentStreak(progress.streak, localDay())

  const currentEl = useRef<HTMLElement | null>(null)
  const onCurrent = useCallback((el: HTMLElement | null) => {
    if (el) currentEl.current = el
  }, [])
  useEffect(() => {
    if (!loaded || !currentEl.current) return
    currentEl.current.scrollIntoView({ block: 'center', behavior: firstVisit() || prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [loaded, next?.lesson.id])

  /** One lit "current" lesson on the whole path: the next unfinished one. Everything after it is locked. */
  const kindsFor = (c: Chapter): NodeKind[] =>
    c.lessons.map((l) => {
      if (c.states[c.lessons.indexOf(l)] === 'done') return 'done'
      return next && next.mod.id === c.id && next.lesson.id === l.id ? 'current' : 'locked'
    })

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <StatPill title={t('streakDays', { count: streak })}>
          <Flame size={20} />
          {streak}
        </StatPill>
        <MoneyChip amount={wallet} />
      </header>

      {!loaded && <p className={styles.loading}>{t('loading')}</p>}
      {loaded && chapters.length === 0 && <p className={styles.loading}>{t('contentComing')}</p>}
      {loaded &&
        chapters.map((chapter, i) => (
          <section key={chapter.id} className={styles.section} aria-label={tc(chapter.title)}>
            <div className={styles.banner}>
              <div>
                <p className={styles.kicker}>{t('unitKicker', { n: i + 1, name: t(`unitName_${(i % UNIT_NAMES) + 1}` as ParseKeys) })}</p>
                <h2 className={styles.bannerTitle}>{tc(chapter.title)}</h2>
              </div>
              <span className={styles.guide} role="img" aria-label={t('unitGuide')}>
                <Icon name="guide" size={24} strokeWidth={1.8} />
              </span>
            </div>
            <UnitPath chapter={chapter} kinds={kindsFor(chapter)} onCurrent={onCurrent} />
          </section>
        ))}
      <span className="visually-hidden">{tc(course.title)}</span>
    </div>
  )
}
