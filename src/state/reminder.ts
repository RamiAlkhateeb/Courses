import { useEffect, useRef } from 'react'
import { defaultReminder, parseReminder, reminderDue, type ReminderSettings } from '../domain/reminder'
import { currentStreak, localDay } from '../domain/progress'
import { createPersistedStore } from './createPersistedStore'
import { askNotificationPermission, notify } from './newsAlerts'
import { progressStore } from './progress'
import { useStore } from './useStore'

export const reminderStore = createPersistedStore<ReminderSettings>({ key: 'reminder:v1', empty: defaultReminder, parse: parseReminder })
export const useReminder = () => useStore(reminderStore)

/** Turn the reminder on (asking for notification permission) or off. Resolves to whether it is on now. */
export async function setReminderOn(on: boolean): Promise<boolean> {
  const granted = on ? await askNotificationPermission() : false
  reminderStore.update((r) => ({ ...r, on: on && granted }))
  return on && granted
}
export const setReminderHour = (hour: number) => reminderStore.update((r) => ({ ...r, hour }))

/** Checks once a minute (and when the tab comes back) whether today's reminder is due, and sends it. `text` gives the
 *  title and body for the current streak (it needs the translations, which live in a higher layer). */
export function useStudyReminder(text: (streak: number) => { title: string; body: string }) {
  const latest = useRef(text)
  latest.current = text
  useEffect(() => {
    const check = () => {
      const now = new Date()
      const today = localDay(now)
      const p = progressStore.get()
      if (!reminderDue(reminderStore.get(), now, today, p.streak.lastDay)) return
      reminderStore.update((r) => ({ ...r, lastSent: today }))
      const { title, body } = latest.current(currentStreak(p.streak, today, p.freezes))
      notify(title, body, 'study-reminder', '')
    }
    check()
    const id = window.setInterval(check, 60_000)
    const onVisibility = () => !document.hidden && check()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])
}
