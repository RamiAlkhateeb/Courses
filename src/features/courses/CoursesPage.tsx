import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { appCourses, COMING_SOON_IDS, courses, flatNav, hasModule, type Course } from '../../content/courses'
import { useLocalized } from '../../content/useLocalized'
import { ListScreen } from '../../components/SettingsList'
import { Icon } from '../../components/ui'
import { updateProfile } from '../../state/profile'
import { useTrailId } from '../../state/useTrail'
import styles from './CoursesPage.module.css'

/** The first sentence of a description, so every card stays short. */
const firstSentence = (text: string) => text.match(/^.*?[.!؟?](\s|$)/)?.[0].trim() ?? text

/** All courses: the offered ones first (open them to learn), then a few others as "Coming soon" (`COMING_SOON_IDS`). */
export function CoursesPage() {
  const { t } = useTranslation()
  const tc = useLocalized()
  const navigate = useNavigate()
  const active = useTrailId()
  const offered = new Set(appCourses.map((c) => c.id))
  const soon = COMING_SOON_IDS.map((id) => courses.find((c) => c.id === id)).filter((c): c is Course => !!c && !offered.has(c.id))
  const ordered = [...appCourses, ...soon]

  const open = (c: Course) => {
    updateProfile({ trail: c.id })
    navigate('/')
  }

  return (
    <ListScreen title={t('courses_title')} back="/">
      <ul className={styles.list}>
        {ordered.map((c) => {
          const isOpen = offered.has(c.id)
          const chapters = flatNav(c).filter((i) => hasModule(c.id, i.id)).length
          const body = (
            <>
              <span className={styles.kicker}>{t(`category.${c.category}`)}</span>
              <strong className={styles.name}>{tc(c.title)}</strong>
              <span className={styles.blurb}>{firstSentence(tc(c.description))}</span>
              <span className={styles.meta}>
                {isOpen ? (
                  <>
                    <Icon name="book" size={18} /> {t('courses_chapters', { count: chapters })}
                    {c.id === active && <span className={styles.current}>{t('courses_current')}</span>}
                  </>
                ) : (
                  <span className={styles.soon}>{t('courses_coming_soon')}</span>
                )}
              </span>
            </>
          )
          return (
            <li key={c.id}>
              {isOpen ? (
                <button type="button" className={`${styles.card} ${c.id === active ? styles.active : ''}`} onClick={() => open(c)}>
                  {body}
                </button>
              ) : (
                <div className={`${styles.card} ${styles.locked}`} aria-disabled="true">
                  {body}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </ListScreen>
  )
}
