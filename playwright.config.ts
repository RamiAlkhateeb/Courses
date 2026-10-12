import { defineConfig } from '@playwright/test'

// The smoke suite runs against a production build served by `vite preview` under the same base path GitHub Pages
// uses (/Courses/), so a hard-coded "/" or a broken asset path fails here and not after deploy.
const PORT = 4173

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}/Courses/`,
    viewport: { width: 390, height: 844 },
    trace: 'retain-on-failure',
    // Locally the browser is preinstalled (PLAYWRIGHT_BROWSERS_PATH); CI runs `npx playwright install chromium`.
  },
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    env: { GITHUB_PAGES: 'true', GITHUB_REPOSITORY: 'owner/Courses' },
    url: `http://localhost:${PORT}/Courses/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
