import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { practiceHref } from '../../content/courses'
import { useModule } from '../../content/useModule'
import { Cover } from '../../components/content/Cover'
import { SectionView } from '../../components/content/SectionView'
import { ModuleNav } from '../../components/content/ModuleNav'
import contentStyles from '../../components/content/content.module.css'
import { useProgress } from '../../state/useProgress'
import { ModuleQuestionsContext } from '../../components/content/moduleQuestions'
import { useScrollSpy } from '../../lib/useScrollSpy'

export function ModulePage() {
  const { courseId, id } = useParams<{ courseId: string; id: string }>()
  const { t } = useTranslation()
  const { mod, loading, notFound } = useModule(courseId, id)
  const { markRead } = useProgress()

  const sectionIds = useMemo(() => mod?.sections.map((s) => s.id) ?? [], [mod])
  const activeId = useScrollSpy(sectionIds)

  useEffect(() => {
    if (mod && activeId) markRead(`${mod.courseId}/${mod.id}`, activeId)
    // markRead is a fresh closure each render; only the active section changing matters here.
  }, [mod, activeId])

  // Content loads asynchronously, so a #section deep link can't be scrolled to by the browser on load.
  useEffect(() => {
    if (mod && window.location.hash) {
      document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView()
    }
  }, [mod])

  if (loading) return <p>{t('loading')}</p>
  if (notFound || !mod) return <p>{t('moduleNotFound')}</p>

  return (
    <ModuleQuestionsContext.Provider value={mod.questions}>
      <div className={contentStyles.content}>
        <Cover mod={mod} />
        {mod.sections.map((section) => (
          <SectionView key={section.id} section={section} />
        ))}
        {mod.questions.length > 0 && (
          <p className={contentStyles.quizCta}>
            <Link to={practiceHref(mod.courseId, mod.id)}>{t('takeQuiz')} →</Link>
          </p>
        )}
        <ModuleNav courseId={mod.courseId} moduleId={mod.id} />
      </div>
    </ModuleQuestionsContext.Provider>
  )
}
