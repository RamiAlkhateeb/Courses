// Every screen except the first is a separate, hash-named file. After a deploy the old files are gone from the host,
// so a tab opened before the deploy fails the next time it opens a screen it hasn't loaded yet: a blank page with a
// console error. Vite reports that as `vite:preloadError`; reloading fetches the new build, and progress is saved
// per answer, so nothing is lost. A short guard stops a reload loop if the host really is down.

const KEY = 'chunk-reload-at'
const GUARD_MS = 10_000

/** True for the browser's "couldn't load a dynamically imported file" errors (message text differs by browser). */
export const isChunkLoadError = (error: unknown): boolean =>
  error instanceof Error &&
  /dynamically imported module|importing a module script failed|failed to fetch dynamically|error loading dynamically/i.test(error.message)

/** Reload once (guarded). Returns false when a reload already happened a moment ago, so callers show the error. */
export function reloadOnce(): boolean {
  let last = 0
  try {
    last = Number(sessionStorage.getItem(KEY) ?? 0)
  } catch {
    // storage blocked: treat as never reloaded
  }
  if (Date.now() - last < GUARD_MS) return false
  try {
    sessionStorage.setItem(KEY, String(Date.now()))
  } catch {
    // ignore
  }
  window.location.reload()
  return true
}

export function reloadOnStaleChunks() {
  window.addEventListener('vite:preloadError', (event) => {
    if (reloadOnce()) event.preventDefault()
  })
}
