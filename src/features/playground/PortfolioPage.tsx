import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ListScreen } from '../../components/SettingsList'
import { PlaygroundPanel } from '../../components/playground/PlaygroundPanel'
import { ChallengeCard } from '../../components/playground/ChallengeCard'
import { firstPracticeHref, portfolioOpen } from '../../domain/playground/practice'
import { playgroundStore } from '../../state/playground'
import { useProgress } from '../../state/useProgress'
import { useStore } from '../../state/useStore'
import { useAwardBadges } from '../../state/useBadges'
import { lookedAtPortfolio } from '../../state/away'

/** Route `/portfolio`: the simulator on its own screen, the shortcut from Learn once the first practice lesson is done.
 *  Before that, it opens that lesson (which introduces the simulator). */
export function PortfolioPage() {
  const { t } = useTranslation()
  const { progress, visitPortfolio } = useProgress()
  const state = useStore(playgroundStore)
  const open = portfolioOpen(state, progress.lessonsDone)
  // Looking at the portfolio is one of the daily quests
  useEffect(() => {
    // Opening the portfolio is "looking": the "while you were away" card starts counting again from here
    if (open) lookedAtPortfolio(false)
    if (open) visitPortfolio()
    // once per visit
  }, [open])
  // Simulator firsts (first buy, first payout, a season run to the end) are saved as badges here
  useAwardBadges()
  if (!open) return <Navigate to={firstPracticeHref} replace />
  return (
    <ListScreen title={t('portfolio_title')} back="/">
      <ChallengeCard state={state} />
      <PlaygroundPanel />
    </ListScreen>
  )
}
