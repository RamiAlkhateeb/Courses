// Builds public/sw.js at build time: the installable app's service worker. It precaches the whole built app (HTML,
// scripts, styles, fonts, diagrams, icons: about 1.6 MB) so every lesson opens offline, and caches the guide pictures
// as they are first shown (5 MB for all of them is too much to fetch up front). The cache name is a hash of the file
// list, so a new deploy replaces the old cache. Only GETs to this site are handled: Supabase and the rest go untouched.
import { createHash } from 'node:crypto'
import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import type { Plugin } from 'vite'

/** Public files that are not precached (fetched and cached on first use instead). */
const RUNTIME_ONLY = /^guides\//

function publicFiles(dir: string, root = dir): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? publicFiles(path, root) : [relative(root, path).split('\\').join('/')]
  })
}

const worker = (cache: string, files: string[]) => `// Generated at build by scripts/serviceWorker.ts. Do not edit.
const CACHE = ${JSON.stringify(cache)}
const PRECACHE = ${JSON.stringify(files)}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('abu-shreek-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return
  // Pages: the network first (a new deploy shows at once), the cached app when offline. Routes are client-side.
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('./index.html', { ignoreSearch: true })))
    return
  }
  // Files: built names change with their content, so the cache can answer first; anything new is kept for next time.
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok && res.type === 'basic') {
            const copy = res.clone()
            void caches.open(CACHE).then((c) => c.put(req, copy))
          }
          return res
        }),
    ),
  )
})

// A notification was tapped: open (or focus) the app on its page (news alerts: the portfolio; the reminder: Learn).
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const page = new URL('./' + ((event.notification.data && event.notification.data.open) || 'portfolio'), self.registration.scope).href
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const open = list.find((c) => 'focus' in c)
      return open ? open.focus().then((c) => c && 'navigate' in c ? c.navigate(page) : c) : self.clients.openWindow(page)
    }),
  )
})
`

export function serviceWorker(): Plugin {
  let publicDir = 'public'
  return {
    name: 'abu-shreek-service-worker',
    apply: 'build',
    enforce: 'post', // after index.html is emitted
    configResolved(config) {
      publicDir = config.publicDir
    },
    generateBundle(_, bundle) {
      const built = Object.keys(bundle).filter((f) => !f.endsWith('.map'))
      const pub = publicFiles(publicDir).filter((f) => !RUNTIME_ONLY.test(f))
      const files = ['./', './index.html', ...[...built, ...pub].filter((f) => f !== 'index.html').filter((f) => f !== 'sw.js').map((f) => `./${f}`)].sort()
      const cache = `abu-shreek-${createHash('sha256').update(files.join('\n')).digest('hex').slice(0, 12)}`
      this.emitFile({ type: 'asset', fileName: 'sw.js', source: worker(cache, files) })
    },
  }
}
