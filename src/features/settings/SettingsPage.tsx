import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../../i18n'
import { playSound } from './sound'
import { useSettings } from './useSettings'
import styles from './SettingsPage.module.css'

/** Language and sound. Saved in this browser like progress. */
export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { settings, updateSettings } = useSettings()

  function toggleSound() {
    const sound = !settings.sound
    updateSettings({ sound })
    if (sound) playSound('correct') // a sample, so turning it on is audible
  }

  return (
    <div className={styles.page}>
      <h1>{t('settings')}</h1>

      <section className={styles.group}>
        <h2>{t('language')}</h2>
        <div className={styles.segmented} role="radiogroup" aria-label={t('language')}>
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              role="radio"
              aria-checked={i18n.language === l.code}
              className={i18n.language === l.code ? styles.on : undefined}
              onClick={() => i18n.changeLanguage(l.code)}
              lang={l.code}
            >
              {l.name}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.group}>
        <div className={styles.row}>
          <div>
            <h2>{t('soundEffects')}</h2>
            <p>{t('soundEffectsHint')}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.sound}
            aria-label={t('soundEffects')}
            className={`${styles.switch} ${settings.sound ? styles.switchOn : ''}`}
            onClick={toggleSound}
          >
            <span />
          </button>
        </div>
      </section>
    </div>
  )
}
