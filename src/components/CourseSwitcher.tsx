import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { appCourses, getCourse } from '../content/courses'
import { useLocalized } from '../content/useLocalized'
import { updateProfile } from '../state/profile'
import { useTrailId } from '../state/useTrail'
import { Sheet } from './SettingsList'
import { Icon } from './ui'
import styles from './CourseSwitcher.module.css'

/** The active course's name as a dropdown: the offered courses, and "All courses". `title` is Learn's heading (big, may
 *  wrap onto two lines); `inline` sits under the name on Me. */
export function CourseSwitcher({ className, variant = 'inline' }: { className?: string; variant?: 'inline' | 'title' }) {
  const { t } = useTranslation()
  const tc = useLocalized()
  const navigate = useNavigate()
  const active = useTrailId()
  const course = getCourse(active)
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" className={`${styles.switcher} ${variant === 'title' ? styles.title : ''} ${className ?? ''}`} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        <span className="visually-hidden">{t('courses_switch')}: </span>
        <span className={styles.name}>{course ? tc(course.title) : ''}</span>
        <Icon name="chevronDown" size={variant === 'title' ? 24 : 20} className={styles.down} />
      </button>
      {open && (
        <Sheet title={t('courses_switch')} onClose={() => setOpen(false)}>
          <ul className={styles.list}>
            {appCourses.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={styles.row}
                  aria-current={c.id === active ? 'true' : undefined}
                  onClick={() => {
                    updateProfile({ trail: c.id })
                    setOpen(false)
                    navigate('/')
                  }}
                >
                  <span>{tc(c.title)}</span>
                  {c.id === active && <Icon name="check" size={20} />}
                </button>
              </li>
            ))}
          </ul>
          <Link to="/courses" className={styles.all} onClick={() => setOpen(false)}>
            {t('courses_all')} <Icon name="chevron" size={18} className={styles.chev} />
          </Link>
        </Sheet>
      )}
    </>
  )
}
