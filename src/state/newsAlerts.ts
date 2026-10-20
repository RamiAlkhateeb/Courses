import { createPersistedStore } from './createPersistedStore'
import { useStore } from './useStore'

// Market news alerts: a local browser notification when Playground news lands. There is no backend, so the app must be
// open (a background tab is enough); nothing arrives while it is fully closed. Off until the player turns it on.

export const newsAlertsStore = createPersistedStore<boolean>({
  key: 'newsAlerts',
  empty: false,
  parse: (raw) => raw === 'on',
  serialize: (on) => (on ? 'on' : 'off'),
})

export type AlertSupport = 'ok' | 'denied' | 'unsupported'

export function alertSupport(): AlertSupport {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  return Notification.permission === 'denied' ? 'denied' : 'ok'
}

/** Turn alerts on (asking the browser's permission first) or off. Resolves to whether they are on now. */
export async function setNewsAlerts(on: boolean): Promise<boolean> {
  if (!on || alertSupport() !== 'ok') {
    newsAlertsStore.update(() => false)
    return false
  }
  const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()
  const granted = permission === 'granted'
  newsAlertsStore.update(() => granted)
  return granted
}

/** Ask the browser for notification permission (news alerts and the study reminder share it). */
export async function askNotificationPermission(): Promise<boolean> {
  if (alertSupport() !== 'ok') return false
  return (Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission()) === 'granted'
}

/** Show one alert, if the player turned them on and the browser still allows it. */
export function showNewsAlert(title: string, body: string) {
  if (newsAlertsStore.get()) notify(title, body, `news-${title}`)
}

/** A local notification (through the service worker when there is one), if the browser allows it. */
export function notify(title: string, body: string, tag: string, open = 'portfolio') {
  if (alertSupport() !== 'ok' || Notification.permission !== 'granted') return
  // `data.open` is the page a tap opens (the service worker reads it), relative to the app
  const options = { body, icon: `${import.meta.env.BASE_URL}icon-192.png`, tag, data: { open } }
  // Through the service worker when there is one (phones only allow that, and a tap opens the page)
  const viaWorker = 'serviceWorker' in navigator ? navigator.serviceWorker.getRegistration() : Promise.resolve(undefined)
  void viaWorker
    .then((reg) => {
      if (reg) return reg.showNotification(title, options)
      new Notification(title, options)
    })
    .catch(() => {
      // Not allowed here: no alert, the news still waits in the app
    })
}

export const useNewsAlerts = () => useStore(newsAlertsStore)
