import { Link, createBrowserRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AppShell } from '../components/AppShell'
import { AppFrame, TabsLayout } from '../components/AppFrame'
import { HomePage } from '../features/home/HomePage'
import { MePage } from '../features/me/MePage'
import { OnboardingStep, Welcome } from '../features/onboarding/Onboarding'
import { PathPage } from '../features/path/PathPage'
import { SummitPage } from '../features/path/SummitPage'
import { ReviewRun } from '../features/review/ReviewRun'
import { ReviewTab } from '../features/review/ReviewTab'
import { TermsPage } from '../features/terms/TermsPage'

// Everything except the shell and home page is code-split: each route's chunk loads on first visit.
export const router = createBrowserRouter(
  [
    {
      // The mobile app (designs in design/): onboarding, the four tabs, and full-screen lessons.
      path: '/',
      element: <AppFrame />,
      hydrateFallbackElement: <p>…</p>,
      children: [
        { path: 'welcome', element: <Welcome /> },
        { path: 'welcome/:step', element: <OnboardingStep /> },
        {
          element: <TabsLayout />,
          children: [
            { index: true, element: <PathPage /> },
            { path: 'review', element: <ReviewTab /> },
            { path: 'terms', element: <TermsPage /> },
            { path: 'me', element: <MePage /> },
          ],
        },
        { path: 'summit', element: <SummitPage /> },
        { path: 'review/run', element: <ReviewRun /> },
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
          // `moduleId`, not `id`: AppShell keys the sidebar's section list off `id`, and a lesson has no sections.
          path: 'course/:courseId/:moduleId/lesson',
          lazy: async () => {
            const { LessonPage } = await import('../features/lesson/LessonPage')
            return { element: <LessonPage /> }
          },
        },
      ],
    },
    {
      // Desktop reading views: the course catalog, a course's chapter list, one-page modules and Settings.
      element: <AppShell />,
      children: [
        { path: 'courses', element: <HomePage /> },
        {
          path: 'course/:courseId',
          lazy: async () => {
            const { CoursePage } = await import('../features/course/CoursePage')
            return { element: <CoursePage /> }
          },
        },
        {
          path: 'course/:courseId/:id',
          lazy: async () => {
            const { ModulePage } = await import('../features/modules/ModulePage')
            return { element: <ModulePage /> }
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
