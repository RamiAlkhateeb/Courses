// Shared by the social scripts: command-line flags, a production build served by `vite preview` under the GitHub
// Pages base path (as in playwright.config.ts), and opening one slide of the share route (src/app/SharePage.tsx).
import { spawn, spawnSync } from 'node:child_process'
import { chromium } from '@playwright/test'

/** `--name value` flags and `--name` toggles, taken out of `args` as they are read. */
export function flags(args) {
  return {
    flag(name, fallback) {
      const i = args.indexOf(name)
      if (i === -1) return fallback
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true
      args.splice(i, value === true ? 1 : 2)
      return value
    },
    // An on/off flag never takes the next argument (so `--quiz investing basics why` still works)
    toggle(name) {
      const i = args.indexOf(name)
      if (i !== -1) args.splice(i, 1)
      return i !== -1
    },
  }
}

/** Builds the app (unless `build` is false), serves it, and opens Chromium. `close()` stops both. */
export async function startPreview({ build = true, port = 4174 } = {}) {
  // The same build environment as the e2e web server, so the base path is /Courses/
  // Built without accounts (blank Supabase variables win over a local .env), so no lesson is behind the guest gate
  const env = { ...process.env, GITHUB_PAGES: 'true', GITHUB_REPOSITORY: 'owner/Courses', VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '' }
  const base = `http://localhost:${port}/Courses/`
  if (build) {
    console.log('building…')
    const result = spawnSync('npm', ['run', 'build'], { env, stdio: ['ignore', 'ignore', 'inherit'] })
    if (result.status !== 0) process.exit(result.status ?? 1)
  }
  const server = spawn('npx', ['vite', 'preview', '--port', String(port), '--strictPort'], { env, stdio: 'ignore', detached: true })
  const stop = () => {
    try {
      process.kill(-server.pid)
    } catch {
      /* already gone */
    }
  }
  process.on('exit', stop)
  for (let i = 0; ; i++) {
    try {
      if ((await fetch(base)).ok) break
    } catch {
      /* not up yet */
    }
    if (i > 100) throw new Error(`vite preview did not start on ${base}`)
    await new Promise((r) => setTimeout(r, 200))
  }
  const browser = await chromium.launch()
  return {
    base,
    browser,
    async close() {
      await browser.close()
      stop()
    },
  }
}

/** A page with onboarding skipped and the language set before the app starts (as e2e/smoke.spec.ts does). */
export async function sharePage(browser, lang, viewport = { width: 1080, height: 1350 }) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 })
  await context.addInitScript((l) => {
    localStorage.setItem('profile:v1', JSON.stringify({ onboarded: true }))
    localStorage.setItem('lang', l)
  }, lang)
  return context.newPage()
}

/** Opens slide `n` of a lesson's share route and waits until it is drawn (fonts in, fitted). Returns its root. */
export async function openSlide(page, base, { courseId, moduleId, lessonId, n, lang, guide, quiz }) {
  await page.goto(`${base}share/${courseId}/${moduleId}/${lessonId}?slide=${n}&lang=${lang}&guide=${guide}${quiz ? '&quiz=1' : ''}`)
  const root = page.locator('[data-slide-count]')
  await Promise.race([
    root.and(page.locator('[data-ready]')).waitFor({ timeout: 20_000 }),
    page.locator('[data-share-error]').waitFor({ timeout: 20_000 }).then(() => {
      throw new Error(`no such lesson: ${courseId}/${moduleId}/${lessonId}`)
    }),
  ])
  await page.evaluate(() => document.fonts.ready)
  return root
}
