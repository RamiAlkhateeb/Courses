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

/** Design 31, opened by the gear on Me: Account (when accounts are on), preferences, about, and Log out (signed in only).
 *  Guests see the same screen; their Account row opens Log in. */
export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const auth = useAuth()
  const { minutes } = useProfile()
  const { settings, updateSettings } = useSettings()
  const [sheet, setSheet] = useState<'language' | 'goal' | null>(null)
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
        {/* No study reminders yet: the row is shown, switched off and disabled. */}
        <ListSwitch icon="bell" label={t('set_reminder')} note={t('set_soon')} checked={false} disabled />
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
    </ListScreen>
  )
}
