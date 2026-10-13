import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ParseKeys } from 'i18next'
import { AbuShreek, AnswerOption, Button, Icon, ProgressBar, type MascotPose } from '../../components/ui'
import { Tree } from '../../components/GardenArt'
import { LANGUAGES } from '../../i18n'
import { accountsEnabled } from '../../state/supabase'
import { DEFAULT_TRAIL } from '../../domain/profile'
import { updateProfile, useProfile } from '../../state/profile'
import styles from './Onboarding.module.css'

// Investing is the only course, so there is no goal or trail to pick: Welcome → Language (1 of 2) → Daily time (2 of 2) → Learn.
const STEPS = ['language', 'time'] as const
type Step = (typeof STEPS)[number]
const MINUTES = [5, 10, 15, 20]

/** The language that is not the current one: Welcome shows both. */
const otherLanguage = (lng: string) => LANGUAGES.find((l) => l.code !== lng)!.code
const dirOf = (lng: string) => (lng === 'ar' ? 'rtl' : 'ltr')

/** The Abu Shreek mark: a rounded indigo tile with a sky-blue "M". */
function BrandMark() {
  return (
    <span className={styles.mark} aria-hidden>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 18 L4 6 L12 14 L20 6 L20 18" stroke="var(--sky)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

/** Welcome: the brand (both names, stacked), a language switch, the headline in both languages, the mascot, and Get started. */
export function Welcome() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const other = otherLanguage(i18n.language)
  return (
    <div className={styles.welcome}>
      <svg className={styles.contours} width="390" height="620" viewBox="0 0 390 620" fill="none" aria-hidden focusable="false">
        <g stroke="var(--indigo)" strokeOpacity="0.09" strokeWidth="1.2">
          {[40, 90, 140, 190, 240, 290, 340].map((rx) => (
            <ellipse key={rx} cx="310" cy="430" rx={rx} ry={Math.round(rx * 0.63)} />
          ))}
        </g>
        <path d="M60 590 C150 540 340 560 318 480 C296 410 120 440 170 360 C210 296 340 330 322 250" stroke="var(--sky)" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 11" />
      </svg>
      <Tree size={70} style={{ position: 'absolute', insetInlineEnd: 32, insetBlockStart: 176 }} />
      <header className={styles.welcomeTop}>
        <span className={styles.brand}>
          <BrandMark />
          <span className={styles.brandName}>
            <span lang="en" dir="ltr">
              {t('appName', { lng: 'en' })}
            </span>
            <span lang="ar" dir="rtl">
              {t('appName', { lng: 'ar' })}
            </span>
          </span>
        </span>
        <div className={styles.langSwitch} role="group" aria-label={t('language')}>
          {LANGUAGES.map((l) => (
            <button key={l.code} type="button" aria-pressed={i18n.language === l.code} onClick={() => i18n.changeLanguage(l.code)} lang={l.code}>
              {l.short}
            </button>
          ))}
        </div>
      </header>
      <div className={styles.headWrap}>
        <h1 className={styles.headline}>{t('welcomeHeadline')}</h1>
        <span className={styles.bar} aria-hidden />
        <p className={styles.welcomeAlt} lang={other} dir={dirOf(other)}>
          {t('welcomeHeadline', { lng: other })}
        </p>
      </div>
      <div className={styles.bubble}>
        <span>{t('welcomeHi')}</span>
        <span lang={other} dir={dirOf(other)}>
          {t('welcomeHi', { lng: other })}
        </span>
      </div>
      <AbuShreek pose="wave" height={363} className={styles.heroMascot} />
      <div className={styles.welcomeSheet}>
        <Button onClick={() => navigate('/welcome/language')}>{t('startMyPath')}</Button>
        <Button
          variant="onIndigo"
          onClick={() => {
            // With accounts configured, "I already have an account" means: sign in and bring it here.
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
    if (step === 'language') return navigate('/welcome/time')
    updateProfile({ minutes, trail: DEFAULT_TRAIL, onboarded: true })
    navigate('/')
  }
  const other = otherLanguage(i18n.language)
  const pose: MascotPose = step === 'language' ? 'wave' : 'point'

  return (
    <div className={styles.step}>
      <header className={styles.stepTop}>
        <button type="button" className={styles.iconBtn} onClick={back} aria-label={t('back')}>
          <Icon name="back" size={24} className={styles.mirror} />
        </button>
        <ProgressBar value={index + 1} max={STEPS.length} label={t('stepOf', { n: index + 1, total: STEPS.length })} />
      </header>
      <div className={styles.guide}>
        <AbuShreek pose={pose} height={136} />
        <p className={styles.bubbleSm}>
          {step === 'language' ? t('obLangBubble') : t('obTimeBubble')}
          {step === 'language' && (
            <span lang={other} dir={dirOf(other)} className={styles.bubbleAlt}>
              {t('obLangBubble', { lng: other })}
            </span>
          )}
        </p>
      </div>
      <h1 className={styles.title}>{t(step === 'language' ? 'ob_language_title' : 'ob_time_title')}</h1>
      {step === 'language' && <p className={styles.sub}>{t('ob_language_sub')}</p>}

      {step === 'language' && (
        <div className={styles.list}>
          {LANGUAGES.map((l) => (
            <AnswerOption choice radio key={l.code} state={i18n.language === l.code ? 'selected' : 'idle'} role="radio" onClick={() => i18n.changeLanguage(l.code)} letter={<span lang={l.code}>{l.letter}</span>}>
              <strong className={styles.langName} lang={l.code}>
                {l.name}
              </strong>
              <small className={styles.hint}>{t(l.code === 'ar' ? 'rtl' : 'ltr')}</small>
            </AnswerOption>
          ))}
        </div>
      )}

      {step === 'time' && (
        <>
          <div className={styles.list}>
            {MINUTES.map((m) => (
              <AnswerOption choice radio key={m} role="radio" state={minutes === m ? 'selected' : 'idle'} onClick={() => setMinutes(m)}>
                <span className={styles.minutes}>
                  <strong className={styles.minNum}>{t('minShort', { n: m })}</strong>
                  <span className={minutes === m ? styles.paceOn : styles.hint}>{t(`pace_${m}` as ParseKeys)}</span>
                </span>
              </AnswerOption>
            ))}
          </div>
          <p className={styles.fine}>{t('changeLater')}</p>
        </>
      )}
      <div className={styles.grow} />
      <Button onClick={next}>{step === 'language' ? t('continue') : t('startLearning')}</Button>
    </div>
  )
}
