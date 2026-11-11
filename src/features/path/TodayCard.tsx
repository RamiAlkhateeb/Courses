import { useTranslation } from 'react-i18next'
import type { ParseKeys } from 'i18next'
import { Button, Coin, Icon, ProgressBar } from '../../components/ui'
import { localDay, studiedToday } from '../../domain/progress'
import { questsToday } from '../../domain/quests'
import { moneyText } from '../../i18n'
import { useProfile } from '../../state/profile'
import { useProgress } from '../../state/useProgress'
import styles from './PathPage.module.css'

/** Today on Learn: the daily goal (minutes studied of the minutes chosen), three quests for the day, and the chest of
 *  play money that opens when all three are done. New quests every day (src/domain/quests.ts). */
export function TodayCard({ portfolio }: { portfolio: boolean }) {
  const { t } = useTranslation()
  const { progress, claimChest } = useProgress()
  const { minutes } = useProfile()
  const today = localDay()
  const ctx = { portfolio, goalSeconds: minutes * 60 }
  const { quests, chestReady, claimed, chest } = questsToday(progress, today, ctx)
  const studied = Math.min(minutes, Math.floor(studiedToday(progress, today) / 60))

  return (
    <section className={styles.today} aria-labelledby="today-title">
      <header className={styles.todayHead}>
        <h2 id="today-title" className={styles.todayTitle}>
          {t('today_title')}
        </h2>
        <span className={styles.todayGoal}>{studied >= minutes ? t('goal_met', { n: minutes }) : t('goal_progress', { done: studied, n: minutes })}</span>
      </header>
      <ProgressBar value={studied} max={minutes} label={t('today_goal')} />
      <ul className={styles.quests}>
        {quests.map((q) => (
          <li key={q.id} className={q.done ? styles.questDone : undefined}>
            <span className={styles.questMark} aria-hidden>
              {q.done && <Icon name="check" size={14} strokeWidth={3} />}
            </span>
            <span className={styles.questText}>{t(`quest_${q.id}` as ParseKeys)}</span>
            <span className={styles.questCount}>{q.done ? t('quest_done') : t('quest_count', { value: q.value, target: q.target })}</span>
          </li>
        ))}
      </ul>
      {chestReady ? (
        <Button size="sm" onClick={() => claimChest(ctx)}>
          <Coin size={18} /> {t('chest_open')}
        </Button>
      ) : claimed ? (
        <p className={styles.chestNote} role="status">
          <Coin size={18} /> {t('chest_claimed', { money: moneyText(chest, { sign: true }) })}
        </p>
      ) : (
        <p className={styles.chestNote}>
          <Coin size={18} /> {t('chest_locked')}
        </p>
      )}
    </section>
  )
}
