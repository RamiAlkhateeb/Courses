import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { hasModule, moduleHref, type Course } from '../content/courses'
import { useLocalized } from '../content/useLocalized'
import styles from './ModulesList.module.css'

/** A course's modules grouped by topic, linking to `/course/:courseId/:id`; modules not written yet show a
 *  "soon" badge. Shared by the course page and the Course Contents panel — one implementation. */
export function ModulesList({ course, onNavigate }: { course: Course; onNavigate?: () => void }) {
  const t = useLocalized()
  const { t: tUi } = useTranslation()

  return (
    <>
      {course.groups.map((group) => (
        <div key={t(group.label)}>
          <div className={styles.groupLabel}>{t(group.label)}</div>
          <ul className={styles.list}>
            {group.items.map((item) => {
              const written = hasModule(course.id, item.id)
              return (
                <li key={item.id}>
                  {written ? (
                    <Link to={moduleHref(course.id, item.id)} onClick={onNavigate}>
                      {t(item.title)}
                    </Link>
                  ) : (
                    <span className={styles.soon}>
                      {t(item.title)}
                      <span className={styles.soonBadge}>{tUi('soon')}</span>
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </>
  )
}
