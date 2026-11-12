import { useTranslation } from 'react-i18next'
import type { ParseKeys } from 'i18next'
import { Card, Icon, ProgressBar } from '../ui'
import { CHALLENGE, challengeStatus, currentYear } from '../../domain/playground/challenges'
import { CONFIG, DAY_MS, MS_PER_WEEK } from '../../domain/playground/config'
import type { PlaygroundState } from '../../domain/playground/engine'
import { moneyText } from '../../i18n'
import styles from './Playground.module.css'

/** This week's challenge: one habit for the simulated year now running (one real week). Shown while a season runs. */
export function ChallengeCard({ state }: { state: PlaygroundState }) {
  const { t } = useTranslation()
  if (state.status !== 'running') return null
  const year = currentYear(state)
  const c = challengeStatus(state, year)
  const daysLeft = Math.max(1, Math.ceil(((year * CONFIG.weeksPerYear - state.tick) * MS_PER_WEEK) / DAY_MS))
  // "Under" challenges (fees, hand trades) are on track while within the limit; the others count up to a target
  const under = c.id === 'low-fees' || c.id === 'steady-hands'
  const vars = { max: moneyText(CHALLENGE.maxFees), target: c.target, value: c.id === 'low-fees' ? moneyText(c.value) : c.value }
  const state_ = under ? (c.met ? t('challenge_on_track') : t('challenge_over')) : c.met ? t('challenge_done') : t('challenge_to_go', { count: c.target - c.value })
  return (
    <Card className={styles.challenge}>
      <p className={styles.challengeKicker}>
        <Icon name="flag" size={16} /> {t('challenge_kicker')}
      </p>
      <h2 className={styles.challengeTitle}>{t(`challenge_${c.id}` as ParseKeys, vars)}</h2>
      {!under && <ProgressBar value={c.value} max={c.target} label={t(`challenge_${c.id}` as ParseKeys, vars)} />}
      <p className={styles.challengeNote}>
        <span>{t(`challenge_${c.id}_value` as ParseKeys, vars)}</span>
        <strong className={c.met ? styles.challengeMet : styles.challengeOpen}>{state_}</strong>
      </p>
      <p className={styles.challengeEnds}>{t('challenge_ends', { count: daysLeft, year })}</p>
    </Card>
  )
}
