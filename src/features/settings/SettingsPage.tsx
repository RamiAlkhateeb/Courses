import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Icon } from '../../components/ui'
import { GoalSheet, LanguageSheet, ListGroup, ListRow, ListScreen, ListSwitch } from '../../components/SettingsList'
import { LANGUAGES } from '../../i18n'
import { accountsEnabled } from '../../state/supabase'
import { signOut, useAuth } from '../../state/auth'
import { useProfile } from '../../state/profile'
import { playSound } from '../../state/sound'
import { useSettings } from '../../state/useSettings'
import { alertSupport, setNewsAlerts, useNewsAlerts } from '../../state/newsAlerts'
import { installApp, useCanInstall } from '../../state/install'
import { setReminderHour, setReminderOn, useReminder } from '../../state/reminder'
import { REMINDER_HOURS } from '../../domain/reminder'
import { AnswerOption } from '../../components/ui'
import { Sheet } from '../../components/SettingsList'

/** Design 31, opened by the gear on Me: Account (when accounts are on), preferences, about, and Log out (signed in only).
 *  Guests see the same screen; their Account row opens Log in. */
export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const auth = useAuth()
  const { minutes } = useProfile()
  const { settings, updateSettings } = useSettings()
  const [sheet, setSheet] = useState<'language' | 'goal' | 'reminder' | null>(null)
  const reminder = useReminder()
  const hourText = (h: number) => new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-u-nu-latn' : 'en', { hour: 'numeric', minute: '2-digit' }).format(new Date(2026, 0, 1, h))
  const newsAlerts = useNewsAlerts()
  const [support, setSupport] = useState(alertSupport)
  const canInstall = useCanInstall()
  const signedIn = accountsEnabled && auth.status === 'signedIn'
  const lang = LANGUAGES.find((l) => l.code === i18n.language)

  return (
    <ListScreen
      title={t('settings')}
      back="/me"
      footer={
        signedIn && (
          <Button
            variant="secondary"
            onClick={async () => {
              await signOut()
              navigate('/me', { replace: true })
            }}
          >
            <Icon name="logout" size={22} /> {t('acc_log_out')}
          </Button>
        )
      }
    >
      {accountsEnabled && auth.status !== 'loading' && (
        <ListGroup>
          <ListRow icon="user" label={t('acc_title')} sub={t('set_account_sub')} to={signedIn ? '/account' : '/login'} />
        </ListGroup>
      )}

      <ListGroup title={t('acc_s_prefs')}>
        <ListRow icon="globe" label={t('language')} value={lang?.name} onClick={() => setSheet('language')} />
        <ListRow icon="clock" label={t('acc_daily_goal')} value={t('minShort', { n: minutes })} onClick={() => setSheet('goal')} />
        <ListSwitch
          icon="volume"
          label={t('soundEffects')}
          checked={settings.sound}
          onChange={(sound) => {
            updateSettings({ sound })
            if (sound) playSound('correct') // a sample, so turning it on is audible
          }}
        />
        {/* A local notification when Playground news lands; with no backend, only while the app is open. */}
        <ListSwitch
          icon="megaphone"
          label={t('set_news_alerts')}
          note={t(support === 'unsupported' ? 'set_news_alerts_unsupported' : support === 'denied' ? 'set_news_alerts_blocked' : 'set_news_alerts_note')}
          checked={newsAlerts && support === 'ok'}
          disabled={support !== 'ok'}
          onChange={async (on) => {
            await setNewsAlerts(on)
            setSupport(alertSupport())
          }}
        />
        {/* The daily study reminder: a local notification at the chosen time if no lesson was done that day */}
        <ListSwitch
          icon="bell"
          label={t('set_reminder')}
          note={support === 'ok' ? (reminder.on ? t('set_reminder_on', { time: hourText(reminder.hour) }) : t('set_news_alerts_note')) : t(support === 'denied' ? 'set_news_alerts_blocked' : 'set_news_alerts_unsupported')}
          checked={reminder.on && support === 'ok'}
          disabled={support !== 'ok'}
          onChange={async (on) => {
            await setReminderOn(on)
            setSupport(alertSupport())
          }}
        />
        {reminder.on && support === 'ok' && <ListRow icon="clock" label={t('set_reminder_time')} value={hourText(reminder.hour)} onClick={() => setSheet('reminder')} />}
      </ListGroup>

      {canInstall && (
        <ListGroup>
          <ListRow icon="arrowDown" label={t('set_install')} sub={t('set_install_sub')} onClick={() => void installApp()} />
        </ListGroup>
      )}

      <ListGroup title={t('acc_s_about')}>
        <ListRow icon="doc" label={t('acc_terms')} to="/legal/terms" />
        <ListRow icon="shield" label={t('acc_privacy_policy')} to="/legal/privacy" />
        <ListRow icon="help" label={t('acc_help')} to="/legal/help" />
      </ListGroup>

      {sheet === 'language' && <LanguageSheet onClose={() => setSheet(null)} />}
      {sheet === 'goal' && <GoalSheet onClose={() => setSheet(null)} />}
      {sheet === 'reminder' && (
        <Sheet title={t('set_reminder_time')} onClose={() => setSheet(null)}>
          {REMINDER_HOURS.map((h) => (
            <AnswerOption
              key={h}
              choice
              radio
              role="radio"
              state={reminder.hour === h ? 'selected' : 'idle'}
              onClick={() => {
                setReminderHour(h)
                setSheet(null)
              }}
            >
              {hourText(h)}
            </AnswerOption>
          ))}
        </Sheet>
      )}
    </ListScreen>
  )
}
