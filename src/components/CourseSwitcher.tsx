import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { appCourses, getCourse } from '../content/courses'
import { useLocalized } from '../content/useLocalized'
import { updateProfile } from '../state/profile'
import { useTrailId } from '../state/useTrail'
import { Dropdown, Icon } from './ui'
import styles from './CourseSwitcher.module.css'

/** The active course's name as a dropdown: the offered courses, and "All courses", in a list that opens right under
 *  the name. `title` is Learn's heading (one line, truncated if it must); `inline` sits under the name on Me. */
export function CourseSwitcher({ className, variant = 'inline' }: { className?: string; variant?: 'inline' | 'title' }) {
  const { t } = useTranslation()
  const tc = useLocalized()
  const navigate = useNavigate()
  const active = useTrailId()
  const course = getCourse(active)
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLButtonElement>(null)

  return (
    <>
      <button type="button" className={`${styles.switcher} ${variant === 'title' ? styles.title : ''} ${className ?? ''}`} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(true)} ref={button}>
        <span className="visually-hidden">{t('courses_switch')}: </span>
        <span className={styles.name}>{course ? tc(course.title) : ''}</span>
        <Icon name="chevronDown" size={variant === 'title' ? 24 : 20} className={styles.down} />
      </button>
      {open && (
        <Dropdown
          anchor={button}
          label={t('courses_switch')}
          onClose={() => setOpen(false)}
          options={appCourses.map((c) => ({
            key: c.id,
            label: tc(c.title),
            selected: c.id === active,
            onSelect: () => {
              updateProfile({ trail: c.id })
              setOpen(false)
              navigate('/')
            },
          }))}
          footer={
            <Link to="/courses" className={styles.all} onClick={() => setOpen(false)}>
              {t('courses_all')} <Icon name="chevron" size={18} className={styles.chev} />
            </Link>
          }
        />
      )}
    </>
  )
}
