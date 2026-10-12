import { useTranslation } from 'react-i18next'
import { getCourse } from '../content/courses'
import { ModulesList } from './ModulesList'
import styles from './CourseContentsPanel.module.css'

export function CourseContentsPanel({ courseId, onClose }: { courseId?: string; onClose: () => void }) {
  const { t } = useTranslation()
  const course = getCourse(courseId)
  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <span>{t('courseContents')}</span>
          <button type="button" className={styles.close} onClick={onClose} aria-label={t('close')}>
            ×
          </button>
        </div>
        {course && <ModulesList course={course} onNavigate={onClose} />}
      </div>
    </>
  )
}
