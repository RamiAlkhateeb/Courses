// The daily study reminder: when to send it. Pure (the clock and the saved values are passed in) so it is unit-tested.
// No backend sends it: the app checks while it is open (a background tab is enough), like the news alerts.

export interface ReminderSettings {
  on: boolean
  /** Local hour of the day (0–23) from which the reminder may be sent */
  hour: number
  /** Local day ('YYYY-MM-DD') it was last sent, so it is sent at most once a day */
  lastSent: string
}

export const REMINDER_HOURS = [8, 12, 18, 20]
export const defaultReminder: ReminderSettings = { on: false, hour: 18, lastSent: '' }

/** Send now? Only when on, from the chosen hour, not yet today, and not when a lesson was already finished today. */
export function reminderDue(r: ReminderSettings, now: Date, today: string, lastLessonDay: string): boolean {
  return r.on && now.getHours() >= r.hour && r.lastSent !== today && lastLessonDay !== today
}

export function parseReminder(raw: string | null): ReminderSettings {
  try {
    const d = JSON.parse(raw ?? '') as Partial<ReminderSettings>
    return {
      on: d.on === true,
      hour: typeof d.hour === 'number' && d.hour >= 0 && d.hour <= 23 ? Math.floor(d.hour) : defaultReminder.hour,
      lastSent: typeof d.lastSent === 'string' ? d.lastSent : '',
    }
  } catch {
    return defaultReminder
  }
}
