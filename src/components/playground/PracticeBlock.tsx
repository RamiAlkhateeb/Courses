import { useTranslation } from 'react-i18next'
import type { PracticeTask } from '../../content/types'
import { practiceDone } from '../../domain/playground/practice'
import { playgroundStore } from '../../state/playground'
import { useStore } from '../../state/useStore'
import { Icon } from '../ui'
import { PlaygroundPanel } from './PlaygroundPanel'
import styles from './Playground.module.css'

/** A practice lesson's hands-on card: the task, then the live simulator. The lesson moves on once the task is done. */
export function PracticeBlock({ task }: { task: PracticeTask }) {
  const { t } = useTranslation()
  const done = practiceDone(task, useStore(playgroundStore))
  return (
    <section className={styles.practice} aria-labelledby="practice-task">
      <div className={`${styles.task} ${done ? styles.taskDone : ''}`} role="status" aria-live="polite">
        <span className={styles.taskIcon}>
          <Icon name={done ? 'check' : 'flag'} size={20} strokeWidth={done ? 3 : 2} />
        </span>
        <span>
          <small>{done ? t('practice_done') : t('practice_your_task')}</small>
          <strong id="practice-task">{t(`practice_task_${task}`)}</strong>
          {!done && <span className={styles.taskHint}>{t('practice_hint')}</span>}
        </span>
      </div>
      <PlaygroundPanel />
    </section>
  )
}
