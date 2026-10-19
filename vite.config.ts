import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { serviceWorker } from './scripts/serviceWorker.ts'

// GitHub Pages serves a project site at https://<user>.github.io/<repo>/, so production builds need that
// subpath. The repo name comes from Actions' GITHUB_REPOSITORY ("owner/repo"), so a rename can't break
// the deploy again; 'Courses' is the fallback for local `GITHUB_PAGES=true` builds. Local dev stays at '/'.
// https://vite.dev/config/
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'Courses'

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? `/${repo}/` : '/',
  plugins: [react(), serviceWorker()], // the service worker makes the app installable and the lessons work offline
})
