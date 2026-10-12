import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AbuShreek, Button, Coin, Icon } from '../../components/ui'
import { Money } from '../../components/Money'
import { moneyText } from '../../i18n'
import { CONFIG } from '../../domain/playground/config'
import { canWithdraw, netWorth } from '../../domain/playground/engine'
import { usePlayground } from '../../state/usePlayground'
import { useProgress } from '../../state/useProgress'
import styles from './Playground.module.css'

const STEP = 50

/** Design 22: move some of the bank into the Playground. Only the money you move can be lost; the rest stays safe. */
export function FundPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { progress } = useProgress()
  const pg = usePlayground()
  const bank = progress.bank
  const [amount, setAmount] = useState(() => Math.min(CONFIG.fundPresets[0], Math.floor(bank)))
  const max = Math.floor(bank)
  const set = (n: number) => setAmount(Math.max(0, Math.min(max, n)))

  return (
    <div className={styles.pageFull}>
      <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label={t('back')}>
        <Icon name="back" size={26} />
      </button>
      <h1 className={styles.bigTitle}>{t('pg_fund_title')}</h1>
      <p className={styles.sub}>{t('pg_fund_sub')}</p>

      <div className={styles.fundCard}>
        <div className={styles.bankRow}>
          <span className={styles.kicker}>{t('yourBank')}</span>
          <strong className={styles.bankAmount}>
            <Coin size={26} /> <Money amount={bank} />
          </strong>
        </div>
        <p className={styles.kicker}>{t('pg_move_to')}</p>
        <div className={styles.stepper}>
          <button type="button" className={styles.round} onClick={() => set(amount - STEP)} aria-label={t('pg_less')}>
            <Icon name="minus" size={22} />
          </button>
          <strong className={styles.amount}>
            <Money amount={amount} />
          </strong>
          <button type="button" className={styles.round} onClick={() => set(amount + STEP)} aria-label={t('pg_more')}>
            <Icon name="plus" size={22} />
          </button>
        </div>
        <div className={styles.chips}>
          {CONFIG.fundPresets.map((p) => (
            <button key={p} type="button" className={amount === p ? styles.chipOn : ''} disabled={p > max} onClick={() => set(p)}>
              <Money amount={p} />
            </button>
          ))}
          <button type="button" className={amount === max && max > 0 ? styles.chipOn : ''} disabled={max <= 0} onClick={() => set(max)}>
            {t('pg_max')} <Money amount={max} />
          </button>
        </div>
        <dl className={styles.lines}>
          <div>
            <dt>{t('pg_stays_safe')}</dt>
            <dd>
              <Money amount={bank - amount} />
            </dd>
          </div>
        </dl>
      </div>

      {pg.state.status === 'ended' && <p className={styles.callout}>{t('pg_cash_out_first')}</p>}
      <p className={styles.callout}>
        <Icon name="shield" size={22} /> {t('pg_only_moved_lost')}
      </p>
      <div className={styles.emptyRow}>
        <AbuShreek pose="think" height={130} />
        <p className={styles.muted}>{t('pg_time_runs_fast')}</p>
      </div>

      <div className={styles.foot}>
        <Button
          disabled={amount <= 0 || pg.state.status === 'ended'}
          onClick={() => {
            if (pg.fund(amount)) navigate('/playground', { replace: true })
          }}
        >
          {t('pg_move_amount', { amount: moneyText(amount) })}
        </Button>
        {canWithdraw(pg.state) && netWorth(pg.state) > 0 && (
          <Button
            variant="ghost"
            onClick={() => {
              pg.cashOut()
              navigate('/playground', { replace: true })
            }}
          >
            {t('pg_move_back', { amount: moneyText(netWorth(pg.state)) })}
          </Button>
        )}
      </div>
    </div>
  )
}
