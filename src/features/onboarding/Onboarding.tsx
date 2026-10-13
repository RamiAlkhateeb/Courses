import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ParseKeys } from 'i18next'
import { Button, Coin, Icon, OptionCard, ProgressBar, AbuShreek, type IconName, type MascotPose } from '../../components/ui'
import { LogoMark } from '../../components/Logo'
import { LANGUAGES } from '../../i18n'
import { getCourse } from '../../content/courses'
import { START_BANK } from '../../domain/money'
import { Money } from '../../components/Money'
import { useLocalized } from '../../content/useLocalized'
import { DEFAULT_TRAIL } from '../../domain/profile'
import { updateProfile, useProfile } from '../../state/profile'
import styles from './Onboarding.module.css'

/** The language that is not the current one: Welcome and the language step show both. */
const otherLanguage = (lng: string) => LANGUAGES.find((l) => l.code !== lng)!.code
const dirOf = (lng: string) => (lng === 'ar' ? 'rtl' : 'ltr')

const STEPS = ['language', 'goal', 'trail', 'time'] as const
type Step = (typeof STEPS)[number]
const GOALS: { id: string; icon: IconName }[] = [
  { id: 'money', icon: 'coins' },
  { id: 'invest', icon: 'trend' },
  { id: 'accounting', icon: 'calc' },
  { id: 'business', icon: 'megaphone' },
]
const MINUTES = [5, 10, 15, 20]

/** Designs 01–05 and 21: Welcome, then Language → Goal → Trail → Daily time → Starting bank, ending on Path. */
export function Welcome() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const other = otherLanguage(i18n.language)
  return (
    <div className={styles.welcome}>
      <header className={styles.welcomeTop}>
        <span className={styles.brand}>
          <LogoMark size={44} />
          <span className={styles.brandName}>
            {t('appName', { lng: 'en' })}
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
      <h1 className={styles.headline}>{t('welcomeHeadline')}</h1>
      <p className={styles.welcomeAlt} lang={other} dir={dirOf(other)}>
        {t('welcomeHeadline', { lng: other })}
      </p>
      <div className={styles.welcomeHero}>
        <div className={styles.bubble}>
          <span>{t('welcomeHi')}</span>
          <span lang={other} dir={dirOf(other)}>
            {t('welcomeHi', { lng: other })}
          </span>
        </div>
        <AbuShreek pose="wave" height={260} className={styles.heroMascot} />
      </div>
      <div className={styles.welcomeSheet}>
        <Button onClick={() => navigate('/welcome/language')}>{t('startMyPath')}</Button>
        <Button
          variant="ghost"
          className={styles.alreadyBtn}
          onClick={() => {
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
  const [goal, setGoal] = useState(profile.goal ?? 'invest')
  const [minutes, setMinutes] = useState(profile.minutes)
  if (index === -1) return null
  const other = otherLanguage(i18n.language)

  const back = () => (index === 0 ? navigate('/welcome') : navigate(`/welcome/${STEPS[index - 1]}`))
  const next = () => {
    if (step === 'language') navigate('/welcome/goal')
    else if (step === 'goal') {
      updateProfile({ goal })
      navigate('/welcome/trail')
    } else if (step === 'trail') {
      updateProfile({ trail: DEFAULT_TRAIL })
      navigate('/welcome/time')
    } else {
      updateProfile({ minutes })
      navigate('/welcome/bank')
    }
  }
  const pose: MascotPose | undefined = step === 'language' ? 'wave' : step === 'goal' ? 'think' : step === 'time' ? 'point' : undefined
  const bubble = step === 'language' ? t('obLangBubble') : step === 'goal' ? t('obGoalBubble') : step === 'time' ? t('obTimeBubble') : ''

  return (
    <div className={styles.step}>
      <header className={styles.stepTop}>
        <button type="button" className={styles.iconBtn} onClick={back} aria-label={t('back')}>
          <Icon name="back" size={26} className={styles.mirror} />
        </button>
        <ProgressBar value={index + 1} max={STEPS.length} />
      </header>
      <div className={styles.stepBody}>
        {pose && (
          <div className={styles.guide}>
            <AbuShreek pose={pose} height={150} />
            <p className={styles.bubbleSm}>
              {bubble}
              {step === 'language' && (
                <span lang={other} dir={dirOf(other)} className={styles.bubbleAlt}>
                  {t('obLangBubble', { lng: other })}
                </span>
              )}
            </p>
          </div>
        )}
        <h1 className={styles.title}>{t(`ob_${step}_title` as ParseKeys)}</h1>
        {(step === 'language' || step === 'trail') && <p className={styles.sub}>{t(`ob_${step}_sub` as ParseKeys)}</p>}

        {step === 'language' && (
          <div className={styles.list}>
            {LANGUAGES.map((l) => (
              <OptionCard radio key={l.code} state={i18n.language === l.code ? 'selected' : 'idle'} role="radio" onClick={() => i18n.changeLanguage(l.code)} letter={l.letter}>
                <strong lang={l.code}>{l.name}</strong>
                <small className={styles.hint}>{t(l.code === 'ar' ? 'rtl' : 'ltr')}</small>
              </OptionCard>
            ))}
          </div>
        )}

        {step === 'goal' && (
          <div className={styles.list}>
            {GOALS.map((g) => (
              <OptionCard radio key={g.id} role="radio" icon={g.icon} state={goal === g.id ? 'selected' : 'idle'} onClick={() => setGoal(g.id)}>
                {t(`goal_${g.id}` as ParseKeys)}
              </OptionCard>
            ))}
          </div>
        )}

        {step === 'trail' && <TrailCard />}

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

/** Design 04: Investing is the only trail for now, shown as one card. */
function TrailCard() {
  const { t } = useTranslation()
  const tc = useLocalized()
  const course = getCourse(DEFAULT_TRAIL)
  if (!course) return null
  return (
    <>
      <div className={styles.trailSolo}>
        <span className={styles.trailIcon}>
          <Icon name="trend" size={30} />
        </span>
        <strong className={styles.trailSoloName}>{tc(course.title)}</strong>
        <span className={styles.trailDesc}>{t('trailDesc_investing')}</span>
        <ul className={styles.bullets}>
          <li>{t('trailBullet1')}</li>
          <li>{t('trailBullet2')}</li>
          <li>{t('trailBullet3')}</li>
        </ul>
        <AbuShreek pose="point" height={130} className={styles.trailMascot} />
      </div>
      <p className={styles.fine}>{t('trailFine')}</p>
    </>
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
