import { useSyncExternalStore } from 'react'

// "Install the app": browsers that support it fire `beforeinstallprompt` once the app qualifies (manifest + service
// worker). We keep the event so Settings can offer an Install row; it disappears once used or installed. iOS has no
// such event (Share → Add to Home Screen), so the row simply doesn't show there.

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let deferred: InstallPromptEvent | null = null
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export function listenForInstall() {
  if (typeof window === 'undefined') return
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault() // we offer it from Settings instead of the browser's own banner
    deferred = e as InstallPromptEvent
    emit()
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    emit()
  })
}

/** Show the browser's install dialog. Resolves to whether the app was installed. */
export async function installApp(): Promise<boolean> {
  if (!deferred) return false
  const e = deferred
  await e.prompt()
  const { outcome } = await e.userChoice
  deferred = null
  emit()
  return outcome === 'accepted'
}

export const useCanInstall = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => deferred !== null,
    () => false,
  )
