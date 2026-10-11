import { useMemo, useState } from 'react'
import { Link, Outlet, useMatches } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useWeek } from '../content/useWeek'
import { getCourse } from '../content/courses'
import { useLocalized } from '../content/useLocalized'
import { useScrollSpy } from '../features/weeks/useScrollSpy'
import { Logo } from './Logo'
import { TopBar } from './TopBar'
import { TopbarStart } from './TopbarStart'
import { CourseContentsPanel } from './CourseContentsPanel'
import styles from './AppShell.module.css'

/** Course/module ids from the current URL. Read via useMatches because AppShell is the parent
 *  layout route, so useParams() here wouldn't see the child route's params. */
function useRouteIds() {
  const params = useMatches().at(-1)?.params as Record<string, string | undefined> | undefined
  return { courseId: params?.courseId, moduleId: params?.id }
}

function Sidebar({ courseId, moduleId }: { courseId?: string; moduleId?: string }) {
  const { t: tUi } = useTranslation()
  const t = useLocalized()
  const course = getCourse(courseId)
  const { week } = useWeek(courseId, moduleId)
  const sectionIds = useMemo(() => week?.sections.map((s) => s.id) ?? [], [week])
  const activeId = useScrollSpy(sectionIds)

  return (
    <aside className={styles.sidebar}>
      <Link to="/" className={styles.brand} aria-label={tUi('home')}>
        <Logo size={30} />
      </Link>
      <div className={styles.brandSub}>{course ? t(course.title) : tUi('appTagline')}</div>
      {week ? (
        <nav>
          {week.sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={section.id === activeId ? styles.current : undefined}
            >
              {t(section.navLabel)}
            </a>
          ))}
        </nav>
      ) : (
        course && <p className={styles.sidebarHint}>{tUi('courseContents')}</p>
      )}
    </aside>
  )
}

/** App-wide layout: sidebar (current week's sections, or a hint) + main content, with the
 *  language toggle and the Course Contents panel fixed top. */
export function AppShell() {
  const { t } = useTranslation()
  const [contentsOpen, setContentsOpen] = useState(false)
  const { courseId, moduleId } = useRouteIds()

  return (
    <div className={styles.shell}>
      <TopBar />
      <TopbarStart courseId={courseId} onOpenContents={() => setContentsOpen(true)} />
      {contentsOpen && <CourseContentsPanel courseId={courseId} onClose={() => setContentsOpen(false)} />}
      <Sidebar courseId={courseId} moduleId={moduleId} />
      <main className={styles.main} aria-label={t('appName')}>
        <Outlet />
      </main>
    </div>
  )
}
