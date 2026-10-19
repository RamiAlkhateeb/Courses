// Registers the service worker (built by scripts/serviceWorker.ts) in production builds: it makes the app installable,
// keeps every lesson available offline, and lets market news alerts show on phones that only allow notifications
// from a service worker.
export function registerServiceWorker() {
  if (!import.meta.env.PROD || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // Not available (private mode, an old browser): the app works the same online
    })
  })
}
