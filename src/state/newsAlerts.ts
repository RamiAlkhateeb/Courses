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

/** Show one alert, if the player turned them on and the browser still allows it. */
export function showNewsAlert(title: string, body: string) {
  if (!newsAlertsStore.get() || alertSupport() !== 'ok' || Notification.permission !== 'granted') return
  try {
    new Notification(title, { body, icon: `${import.meta.env.BASE_URL}icon-192.png`, tag: `news-${title}` })
  } catch {
    // Some mobile browsers only allow notifications from a service worker: no alert, the news still waits in the app
  }
}

export const useNewsAlerts = () => useStore(newsAlertsStore)
