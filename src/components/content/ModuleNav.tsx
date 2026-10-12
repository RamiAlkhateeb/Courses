import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { flatNav, getCourse, hasModule, moduleHref } from '../../content/courses'
import { useLocalized } from '../../content/useLocalized'
import styles from './ModuleNav.module.css'

/** Previous/next buttons at the bottom of a module page. A neighbor that isn't written yet still
 *  shows its title, disabled ("soon"). */
export function ModuleNav({ courseId, moduleId }: { courseId: string; moduleId: string }) {
  const { t } = useTranslation()
  const tLoc = useLocalized()
  const course = getCourse(courseId)
  const items = course ? flatNav(course) : []
  const index = items.findIndex((item) => item.id === moduleId)
  if (index === -1) return null

  const prev = items[index - 1]
  const next = items[index + 1]

  return (
    <nav className={styles.moduleNav}>
      {prev ? (
        hasModule(courseId, prev.id) ? (
          <Link to={moduleHref(courseId, prev.id)} className={styles.btn}>
            <span className={styles.dir}>{t('previous')}</span>
            <span className={styles.label}>{tLoc(prev.title)}</span>
          </Link>
        ) : (
          <span className={`${styles.btn} ${styles.soon}`}>
            <span className={styles.dir}>{t('previous')}</span>
            <span className={styles.label}>{tLoc(prev.title)}</span>
          </span>
        )
      ) : (
        <span className={styles.spacer} />
      )}

      {next ? (
        hasModule(courseId, next.id) ? (
          <Link to={moduleHref(courseId, next.id)} className={`${styles.btn} ${styles.next}`}>
            <span className={styles.dir}>{t('next')}</span>
            <span className={styles.label}>{tLoc(next.title)}</span>
          </Link>
        ) : (
          <span className={`${styles.btn} ${styles.next} ${styles.soon}`}>
            <span className={styles.dir}>{t('next')}</span>
            <span className={styles.label}>{tLoc(next.title)}</span>
          </span>
        )
      ) : (
        <span className={styles.spacer} />
      )}
    </nav>
  )
}
