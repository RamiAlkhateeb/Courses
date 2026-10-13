import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Money } from '../../components/Money'
import { moneyText } from '../../i18n'
import { usePlayground } from '../../state/usePlayground'
import { useNavigate } from 'react-router-dom'
import { MoneyChip } from '../../components/MoneyChip'
import { AbuShreek, Button, Card } from '../../components/ui'
import { Coin } from '../../components/ui/Coin'
import { playSound } from '../../state/sound'
import styles from './LessonPayout.module.css'

/** Design 28: after "Camp cleared", the money the lesson just paid: +$40, coins flying to the bank chip, the bank
 *  before → after, and a line from the mascot. */
export function LessonPayout({
  payout,
  bankAfter,
  subtitle,
  onDone,
}: {
  payout: number
  bankAfter: number
  subtitle: string
  onDone: () => void
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const pg = usePlayground()
  const offer = Math.min(100, Math.floor(bankAfter))
  const canOffer = offer > 0 && pg.unlocked.includes('savings') && pg.state.status !== 'ended'
  useEffect(() => playSound('correct'), [])
  return (
    <div className={styles.page}>
      <div className={styles.bankChip}>
        <MoneyChip amount={bankAfter} className={styles.chipPulse} />
      </div>
      {/* The coins fly from the amount to the chip; with reduced motion they are not drawn at all. */}
      <div className={styles.coins} aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={styles.coin} style={{ ['--i' as string]: i }}>
            <Coin size={26} />
          </span>
        ))}
      </div>
      <div className={styles.amount}>
        <p className={styles.kicker}>{t('payoutKicker')}</p>
        <p className={styles.big}>
          <Money amount={payout} sign />
        </p>
        <p className={styles.sub}>{subtitle}</p>
      </div>
      <Card className={styles.bankCard}>
        <div>
          <p className={styles.cardKicker}>{t('yourBank')}</p>
          <p className={styles.change}>
            <s className={styles.old}>
              <Money amount={bankAfter - payout} />
            </s>{' '}
            <span aria-hidden>→</span> <Money amount={bankAfter} />
          </p>
        </div>
        <Coin size={44} />
      </Card>
      <div className={styles.guide}>
        <AbuShreek pose="cheer" height={150} />
        <p className={styles.bubble}>{t('payoutBubble')}</p>
      </div>
      {canOffer && (
        <div className={styles.offer}>
          <div>
            <strong>{t('pg_move_offer', { amount: moneyText(offer) })}</strong>
            <small>{t('pg_bank_stays', { amount: moneyText(bankAfter - offer) })}</small>
          </div>
          <Button
            variant="indigo"
            size="sm"
            onClick={() => {
              if (pg.fund(offer)) navigate('/playground')
            }}
          >
            {t('pg_move')}
          </Button>
        </div>
      )}
      <div className={styles.foot}>
        <p className={styles.fine}>{t('playMoneyNotAdvice')}</p>
        <Button onClick={onDone} autoFocus>
          {t('backToPath')}
        </Button>
      </div>
    </div>
  )
}
