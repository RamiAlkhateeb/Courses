import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ListScreen } from '../../components/SettingsList'
import { PlaygroundPanel } from '../../components/playground/PlaygroundPanel'
import { firstPracticeHref, portfolioOpen } from '../../domain/playground/practice'
import { playgroundStore } from '../../state/playground'
import { useProgress } from '../../state/useProgress'
import { useStore } from '../../state/useStore'

/** Route `/portfolio`: the simulator on its own screen, the shortcut from Learn once the first practice lesson is done.
 *  Before that, it opens that lesson (which introduces the simulator). */
export function PortfolioPage() {
  const { t } = useTranslation()
  const { progress } = useProgress()
  const state = useStore(playgroundStore)
  if (!portfolioOpen(state, progress.lessonsDone)) return <Navigate to={firstPracticeHref} replace />
  return (
    <ListScreen title={t('portfolio_title')} back="/">
      <PlaygroundPanel />
    </ListScreen>
  )
}
