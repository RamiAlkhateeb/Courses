import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ParseKeys } from 'i18next'
import { Button, Coin, Icon, OptionCard, ProgressBar, AbuShreek, type MascotPose } from '../../components/ui'
import { LogoMark } from '../../components/Logo'
import { LANGUAGES } from '../../i18n'
import { accountsEnabled } from '../../state/supabase'
import { START_BANK } from '../../domain/money'
import { Money } from '../../components/Money'
import { DEFAULT_TRAIL } from '../../domain/profile'
import { updateProfile, useProfile } from '../../state/profile'
import styles from './Onboarding.module.css'

// Investing is the only course, so there is no goal or trail to pick: Language → Daily time → Starting bank.
const STEPS = ['language', 'time'] as const
type Step = (typeof STEPS)[number]
const MINUTES = [5, 10, 15, 20]

/** Designs 01, 02, 05 and 21: Welcome, then Language → Daily time → Starting bank, ending on Path. */
export function Welcome() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  return (
    <div className={styles.welcome}>
      <header className={styles.welcomeTop}>
        <span className={styles.brand}>
          <LogoMark size={44} />
          <span className={styles.brandName}>{t('appName')}</span>
        </span>
        <div className={styles.langSwitch} role="group" aria-label={t('language')}>
          {LANGUAGES.map((l) => (
            <button key={l.code} type="button" aria-pressed={i18n.language === l.code} onClick={() => i18n.changeLanguage(l.code)} lang={l.code}>
              {l.short}
            </button>
          ))}
        </div>
      </header>
      <h1 className={styles.headline}>{t('welcomeHeadline')}</h1>
      <div className={styles.welcomeHero}>
        <p className={styles.bubble}>{t('welcomeHi')}</p>
        <AbuShreek pose="wave" height={260} className={styles.heroMascot} />
      </div>
      <div className={styles.welcomeSheet}>
        <Button onClick={() => navigate('/welcome/language')}>{t('startMyPath')}</Button>
        <Button
          variant="ghost"
          className={styles.alreadyBtn}
          onClick={() => {
            // With accounts configured, "I already have a path" means: sign in and bring it here.
            if (accountsEnabled) return navigate('/account')
            updateProfile({ onboarded: true })
            navigate('/')
          }}
        >
          {t('alreadyHavePath')}
        </Button>
        <p className={styles.fine}>{t('welcomeFine')}</p>
      </div>
    </div>
  )
}

export function OnboardingStep() {
  const { step } = useParams<{ step: string }>()
  const index = STEPS.indexOf(step as Step)
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const profile = useProfile()
  const [minutes, setMinutes] = useState(profile.minutes)
  if (index === -1) return null

  const back = () => (index === 0 ? navigate('/welcome') : navigate(`/welcome/${STEPS[index - 1]}`))
  const next = () => {
    if (step === 'language') navigate('/welcome/time')
    else {
      updateProfile({ minutes, trail: DEFAULT_TRAIL })
      navigate('/welcome/bank')
    }
  }
  const pose: MascotPose = step === 'language' ? 'wave' : 'point'
  const bubble = step === 'language' ? t('obLangBubble') : t('obTimeBubble')

  return (
    <div className={styles.step}>
      <header className={styles.stepTop}>
        <button type="button" className={styles.iconBtn} onClick={back} aria-label={t('back')}>
          <Icon name="back" size={26} className={styles.mirror} />
        </button>
        <ProgressBar value={index + 1} max={STEPS.length} />
      </header>
      <div className={styles.stepBody}>
        <div className={styles.guide}>
          <AbuShreek pose={pose} height={150} />
          <p className={styles.bubbleSm}>{bubble}</p>
        </div>
        <h1 className={styles.title}>{t(step === 'language' ? 'ob_language_title' : 'ob_time_title')}</h1>
        {step === 'language' && <p className={styles.sub}>{t('ob_language_sub')}</p>}

        {step === 'language' && (
          <div className={styles.list}>
            {LANGUAGES.map((l) => (
              <OptionCard radio key={l.code} state={i18n.language === l.code ? 'selected' : 'idle'} role="radio" onClick={() => i18n.changeLanguage(l.code)} letter={<span lang={l.code}>{l.letter}</span>}>
                <strong lang={l.code}>{l.name}</strong>
                <small className={styles.hint}>{t(l.code === 'ar' ? 'rtl' : 'ltr')}</small>
              </OptionCard>
            ))}
          </div>
        )}

        {step === 'time' && (
          <>
            <div className={styles.list}>
              {MINUTES.map((m) => (
                <OptionCard radio key={m} role="radio" state={minutes === m ? 'selected' : 'idle'} onClick={() => setMinutes(m)}>
                  <span className={styles.minutes}>
                    <strong className={styles.minNum}>{t('minShort', { n: m })}</strong>
                    <span className={styles.hint}>{t(`pace_${m}` as ParseKeys)}</span>
                  </span>
                </OptionCard>
              ))}
            </div>
            <p className={styles.fine}>{t('changeLater')}</p>
          </>
        )}
      </div>
      <footer className={styles.stepFoot}>
        <Button onClick={next}>{t('continue')}</Button>
      </footer>
    </div>
  )
}

/** Design 21: the $1,000 play-money bank, then Path. This is where onboarding is marked finished. */
export function StartingBank() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div className={styles.step}>
      <div className={styles.bankBody}>
        <p className={styles.bankKicker}>{t('bankKicker')}</p>
        <h1 className={styles.bankTitle}>{t('bankTitle')}</h1>
        <div className={styles.notes} aria-hidden>
          <span className={`${styles.note} ${styles.note500}`}>
            <b>$500</b>
          </span>
          <span className={`${styles.note} ${styles.note200}`}>
            <b>$200</b>
          </span>
          <span className={`${styles.note} ${styles.note100}`}>
            <b>$100</b>
          </span>
        </div>
        <p className={styles.bankTotal}>
          <Coin size={44} /> <Money amount={START_BANK} />
        </p>
        <p className={styles.bankSub}>{t('bankSub')}</p>
        <div className={styles.guide}>
          <AbuShreek pose="wave" height={130} />
          <p className={styles.bubbleSm}>{t('bankBubble')}</p>
        </div>
      </div>
      <footer className={styles.stepFoot}>
        <p className={styles.fine}>{t('bankFine')}</p>
        <Button
          onClick={() => {
            updateProfile({ onboarded: true })
            navigate('/')
          }}
        >
          {t('startClimbing')}
        </Button>
      </footer>
    </div>
  )
}
