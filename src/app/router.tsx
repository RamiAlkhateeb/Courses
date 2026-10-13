import type { ComponentType } from 'react'
import { Link, Navigate, createBrowserRouter, type RouteObject } from 'react-router-dom'
import { ENABLED_COURSE_IDS } from '../content/courses'
import { useTranslation } from 'react-i18next'
import { AppShell } from '../components/AppShell'
import { RouteError } from './RouteError'
import { AppFrame, TabsLayout } from '../components/AppFrame'
import { PathPage } from '../features/path/PathPage'

/** A route whose screen is a named export of a feature module, loaded on first visit. */
const page = <K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K): Pick<RouteObject, 'lazy'> => ({
  lazy: async () => {
    const Page: ComponentType = (await load())[name]
    return { element: <Page /> }
  },
})

// Everything except the two shells and the Path tab (the entry screen) is code-split: each route's chunk loads on first visit.
export const router = createBrowserRouter(
  [
    {
      // The mobile app (designs in design/): onboarding, the four tabs, and full-screen lessons.
      path: '/',
      element: <AppFrame />,
      errorElement: <RouteError />,
      hydrateFallbackElement: <p>…</p>,
      children: [
        { path: 'welcome', ...page(() => import('../features/onboarding/Onboarding'), 'Welcome') },
        { path: 'welcome/:step', ...page(() => import('../features/onboarding/Onboarding'), 'OnboardingStep') },
        {
          element: <TabsLayout />,
          children: [
            { index: true, element: <PathPage /> },
            { path: 'playground', ...page(() => import('../features/playground/PlaygroundPage'), 'PlaygroundPage') },
            { path: 'me', ...page(() => import('../features/me/MePage'), 'MePage') },
          ],
        },
        { path: 'playground/fund', ...page(() => import('../features/playground/FundPage'), 'FundPage') },
        { path: 'playground/unlocks', ...page(() => import('../features/playground/UnlocksPage'), 'UnlocksPage') },
        { path: 'playground/risk', ...page(() => import('../features/playground/RiskPage'), 'RiskPage') },
        { path: 'playground/missions', ...page(() => import('../features/playground/SeasonPages'), 'MissionsPage') },
        { path: 'playground/summary', ...page(() => import('../features/playground/SeasonPages'), 'SummaryPage') },
        { path: 'playground/rewind', ...page(() => import('../features/playground/SeasonPages'), 'RewindPage') },
        { path: 'playground/seasons', ...page(() => import('../features/playground/SeasonPages'), 'SeasonsPage') },
        { path: 'playground/debrief', ...page(() => import('../features/playground/DebriefPage'), 'DebriefPage') },
        { path: 'account', ...page(() => import('../features/account/AccountPage'), 'AccountPage') },
        {
          // A roadmap lesson: small cards from one section, then its questions.
          path: 'course/:courseId/:moduleId/learn/:lessonId',
          lazy: async () => {
            const { LessonRoute } = await import('../features/lesson/CardLesson')
            return { element: <LessonRoute /> }
          },
        },
        {
          path: 'course/:courseId/review',
          lazy: async () => {
            const { ReviewPage } = await import('../features/lesson/ReviewPage')
            return { element: <ReviewPage /> }
          },
        },
        {
                    path: 'course/:courseId/:moduleId/lesson',
          lazy: async () => {
            const { LessonPage } = await import('../features/lesson/LessonPage')
            return { element: <LessonPage /> }
          },
        },
      ],
    },
    {
      // Desktop views: a course's chapter list and Settings.
      element: <AppShell />,
      errorElement: <RouteError />,
      children: [
        // The catalog listed every course; with Investing the only one, its old URL opens that course.
        { path: 'courses', element: <Navigate to={`/course/${ENABLED_COURSE_IDS[0]}`} replace /> },
        {
          path: 'course/:courseId',
          lazy: async () => {
            const { CoursePage } = await import('../features/course/CoursePage')
            return { element: <CoursePage /> }
          },
        },
        {
          path: 'settings',
          lazy: async () => {
            const { SettingsPage } = await import('../features/settings/SettingsPage')
            return { element: <SettingsPage /> }
          },
        },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  // Matches vite.config.ts's `base`: '/' in dev, '/<repo>/' when built for GitHub Pages.
  { basename: import.meta.env.BASE_URL },
)

function NotFound() {
  const { t } = useTranslation()
  return (
    <p>
      {t('pageNotFound')} <Link to="/">{t('home')}</Link>
    </p>
  )
}
