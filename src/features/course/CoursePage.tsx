import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buttonClass } from '../../components/ui'
import { useTranslation } from 'react-i18next'
import { AudienceBadges } from '../../components/AudienceBadges'
import { ProgressRing } from '../../components/ProgressRing'
import { flatNav, getCourse, hasModule, moduleHref, practiceHref, type Course, type NavItem } from '../../content/courses'
import type { Localized, Module } from '../../content/types'
import { useLocalized } from '../../content/useLocalized'
import { useModules } from '../../content/useModule'
import { formatDuration, learnHref, lessonMinutes, lessonsFor, moduleMinutes, nextInCourse, type Lesson } from '../../domain/lessons'
import { mistakes } from '../../domain/progress'
import { useProgress } from '../../state/useProgress'
import { unitStates, type NodeState } from '../../domain/pathStates'
import styles from './CoursePage.module.css'

interface Chapter {
  item: NavItem
  number: number
  mod?: Module
  lessons: Lesson[]
  states: NodeState[]
  done: number
}

/** A course as a journey: an overview header, then a timeline of chapters (modules), each opening into its
 *  lessons. Lessons unlock in order within a chapter; chapters are independent. */
export function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { t: tUi } = useTranslation()
  const course = getCourse(courseId)
  const ids = course ? flatNav(course).map((i) => i.id) : []
  const mods: Record<string, Module> = useModules(courseId ?? '', ids)
  const { progress } = useProgress()

  if (!course) return <p>{tUi('pageNotFound')}</p>

  const chapters: Chapter[] = flatNav(course).map((item, i) => {
    const mod = mods[item.id]
    const lessons = mod ? lessonsFor(mod) : []
    const states = unitStates(lessons.map((l) => l.id), progress.lessonsDone, `${course.id}/${item.id}`)
    return { item, number: i + 1, mod, lessons, states, done: states.filter((s) => s === 'done').length }
  })
  const written = chapters.filter((c) => hasModule(course.id, c.item.id))
  const loaded = written.every((c) => c.mod)
  const next = loaded ? nextInCourse(course.id, written.map((c) => c.mod!), progress.lessonsDone) : null

  return (
    <div className={styles.page}>
      <CourseHeader course={course} chapters={written} loaded={loaded} next={next} />
      <Timeline course={course} chapters={chapters} currentId={next?.mod.id} />
    </div>
  )
}

function CourseHeader({
  course,
  chapters,
  loaded,
  next,
}: {
  course: Course
  chapters: Chapter[]
  loaded: boolean
  next: ReturnType<typeof nextInCourse>
}) {
  const t = useLocalized()
  const { t: tUi } = useTranslation()
  const { progress, reset } = useProgress()
  const mods = chapters.flatMap((c) => (c.mod ? [c.mod] : []))
  const lessons = chapters.reduce((n, c) => n + c.lessons.length, 0)
  const done = chapters.reduce((n, c) => n + c.done, 0)
  const minutes = chapters.reduce((n, c) => n + moduleMinutes(c.lessons), 0)
  const questionIds = mods.flatMap((w) => w.questions.map((q) => q.id))
  const wrong = mistakes(questionIds, progress.answers).length
  const learn = whatYouLearn(mods)

  function handleReset() {
    if (window.confirm(tUi('resetConfirm'))) reset()
  }

  return (
    <header className={styles.header}>
      <p className={styles.kicker}>{tUi(`category.${course.category}`)}</p>
      <AudienceBadges audiences={course.audiences} className={styles.audiences} />
      <h1>{t(course.title)}</h1>
      <p className={styles.lede}>{t(course.description)}</p>

      {chapters.length === 0 ? (
        <p className={styles.comingNote} role="note">
          <strong>{tUi('contentComing')}</strong> {tUi('contentComingNote')}
        </p>
      ) : (
        <>
          <dl className={styles.stats}>
            <div>
              <dt>{tUi('statChapters')}</dt>
              <dd>{chapters.length}</dd>
            </div>
            <div>
              <dt>{tUi('statLessons')}</dt>
              <dd>{loaded ? lessons : '…'}</dd>
            </div>
            <div>
              <dt>{tUi('statTime')}</dt>
              <dd>{loaded ? formatDuration(minutes, tUi) : '…'}</dd>
            </div>
            <div>
              <dt>{tUi('statQuestions')}</dt>
              <dd>{loaded ? questionIds.length : '…'}</dd>
            </div>
          </dl>

          <div className={styles.actions}>
            {next ? (
              <Link className={buttonClass({ size: 'sm' })} to={learnHref(course.id, next.mod.id, next.lesson.id)}>
                {done > 0 ? tUi('continueCourse') : tUi('startCourse')} <span aria-hidden>→</span>
              </Link>
            ) : (
              loaded && lessons > 0 && <span className={styles.complete}>✓ {tUi('courseComplete')}</span>
            )}
            {wrong > 0 && (
              <Link className={buttonClass({ variant: 'secondary', size: 'sm' })} to={`/course/${course.id}/review`}>
                {tUi('reviewMistakes', { n: wrong })}
              </Link>
            )}
            {loaded && lessons > 0 && (
              <span className={styles.overall}>
                <ProgressRing done={done} total={lessons} size={40} />
                {tUi('lessonsDoneOf', { done, total: lessons })}
              </span>
            )}
          </div>
        </>
      )}

      {(learn.length > 0 || course.audience) && (
        <div className={styles.about}>
          {learn.length > 0 && (
            <section>
              <h2>{tUi('whatYouLearn')}</h2>
              <ul className={styles.learnList}>
                {learn.map((item, i) => (
                  <li key={i}>{t(item)}</li>
                ))}
              </ul>
            </section>
          )}
          {course.audience && (
            <section>
              <h2>{tUi('whoItsFor')}</h2>
              <p>{t(course.audience)}</p>
            </section>
          )}
        </div>
      )}

      {course.notice && (
        <p className={styles.notice} role="note">
          {t(course.notice)}
        </p>
      )}
      {chapters.length > 0 && (
        <button type="button" className={styles.reset} onClick={handleReset}>
          {tUi('resetProgress')}
        </button>
      )}
    </header>
  )
}

/** Up to 6 learning goals: the first `objectives` block of each module, taken round-robin so every
 *  chapter is represented. */
function whatYouLearn(mods: Module[]): Localized[] {
  const lists = mods.map((w) => {
    for (const s of w.sections) for (const b of s.blocks) if (b.type === 'objectives') return b.items
    return []
  })
  const out: Localized[] = []
  for (let i = 0; out.length < 6 && lists.some((l) => i < l.length); i++) {
    for (const list of lists) if (i < list.length && out.length < 6) out.push(list[i])
  }
  return out
}


function Timeline({ course, chapters, currentId }: { course: Course; chapters: Chapter[]; currentId?: string }) {
  const t = useLocalized()
  const { t: tUi } = useTranslation()
  // null: follow the default (only the current chapter open); after a toggle, the reader's own choice.
  const [open, setOpen] = useState<Set<string> | null>(null)
  const isOpen = (id: string) => (open ? open.has(id) : id === currentId)
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev ?? (currentId ? [currentId] : []))
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className={styles.journey}>
      {course.groups.map((group, g) => (
        <section key={t(group.label)} className={styles.part}>
          <h2 className={styles.partLabel}>
            {tUi('partN', { n: g + 1 })} · {t(group.label)}
          </h2>
          <ol className={styles.timeline}>
            {group.items.map((item) => {
              const chapter = chapters.find((c) => c.item.id === item.id)!
              return (
                <ChapterStop
                  key={item.id}
                  courseId={course.id}
                  chapter={chapter}
                  open={isOpen(item.id)}
                  onToggle={() => toggle(item.id)}
                />
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}

function ChapterStop({
  courseId,
  chapter,
  open,
  onToggle,
}: {
  courseId: string
  chapter: Chapter
  open: boolean
  onToggle: () => void
}) {
  const t = useLocalized()
  const { t: tUi } = useTranslation()
  const { item, number, mod, lessons, states, done } = chapter

  if (!hasModule(courseId, item.id)) {
    return (
      <li className={`${styles.chapter} ${styles.soon}`}>
        <span className={styles.stop} aria-hidden />
        <div className={styles.chapterCard}>
          <p className={styles.chapterNo}>{tUi('chapterN', { n: number })}</p>
          <h3>{t(item.title)}</h3>
          <p className={styles.chapterMeta}>{tUi('comingSoon')}</p>
        </div>
      </li>
    )
  }

  const total = lessons.length
  const stage = !mod ? 'new' : done === total ? 'done' : done > 0 ? 'started' : 'new'
  const target = lessons.find((_, i) => states[i] === 'current') ?? lessons[0]
  const action = stage === 'done' ? tUi('chapterReview') : stage === 'started' ? tUi('chapterContinue') : tUi('chapterStart')
  const listId = `lessons-${item.id}`

  return (
    <li className={`${styles.chapter} ${styles[stage]}`}>
      <span className={styles.stop} aria-hidden />
      <div className={styles.chapterCard}>
        <div className={styles.chapterHead}>
          <div>
            <p className={styles.chapterNo}>{tUi('chapterN', { n: number })}</p>
            <h3>{t(item.title)}</h3>
            {mod && (
              <p className={styles.chapterMeta}>
                {formatDuration(moduleMinutes(lessons), tUi)} · {tUi('nLessons', { count: total })}
              </p>
            )}
          </div>
          {mod && <ProgressRing done={done} total={total} />}
        </div>

        {mod && (
          <div className={styles.chapterActions}>
            <Link
              className={buttonClass({ variant: stage === 'done' ? 'secondary' : 'ink', size: 'sm' })}
              to={learnHref(courseId, item.id, target.id)}
            >
              {action}
            </Link>
            <Link className={styles.textLink} to={moduleHref(courseId, item.id)}>
              {tUi('readModule')}
            </Link>
            {mod.questions.length > 0 && (
              <Link className={styles.textLink} to={practiceHref(courseId, item.id)}>
                {tUi('practice')}
              </Link>
            )}
            <button
              type="button"
              className={styles.toggle}
              aria-expanded={open}
              aria-controls={listId}
              onClick={onToggle}
            >
              {open ? tUi('hideLessons') : tUi('showLessons')}
              <span aria-hidden className={styles.chevron}>
                ▾
              </span>
            </button>
          </div>
        )}

        {mod && open && (
          <ol id={listId} className={styles.lessons}>
            {lessons.map((lesson, i) => (
              <LessonRow
                key={lesson.id}
                href={learnHref(courseId, item.id, lesson.id)}
                lesson={lesson}
                state={states[i]}
                index={i + 1}
              />
            ))}
          </ol>
        )}
      </div>
    </li>
  )
}

function LessonRow({
  href,
  lesson,
  state,
  index,
}: {
  href: string
  lesson: Lesson
  state: NodeState
  index: number
}) {
  const t = useLocalized()
  const { t: tUi } = useTranslation()
  const title =
    lesson.parts > 1 ? tUi('lessonOfParts', { title: t(lesson.title), n: lesson.part, of: lesson.parts }) : t(lesson.title)
  const icon = state === 'done' ? '✓' : state === 'current' ? '▶' : '🔒'
  const body = (
    <>
      <span className={styles.rowIcon} aria-hidden>
        {icon}
      </span>
      <span className={styles.rowIndex}>{String(index).padStart(2, '0')}</span>
      <span className={styles.rowTitle}>{title}</span>
      <span className={styles.rowTime}>{tUi('minutes', { n: lessonMinutes(lesson) })}</span>
    </>
  )
  return (
    <li>
      {state === 'locked' ? (
        <span className={`${styles.row} ${styles.rowLocked}`} title={tUi('pathLocked')} aria-label={`${title} (${tUi('pathLocked')})`}>
          {body}
        </span>
      ) : (
        <Link to={href} className={`${styles.row} ${styles[`row_${state}`]}`}>
          {body}
        </Link>
      )}
    </li>
  )
}
