import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BottomSheet, Button } from '../../components/ui'
import { ListSwitch } from '../../components/SettingsList'
import { Money } from '../../components/Money'
import { moneyText } from '../../i18n'
import { ASSET_IDS, CONFIG, type AssetId } from '../../domain/playground/config'
import type { AutoInvest, PlaygroundState } from '../../domain/playground/engine'
import { assetName, ASSET_DOT } from './shared'
import styles from './Playground.module.css'

/** "$12.40 paid out this season", with the amount as <Money> (left-to-right) inside the translated sentence. */
function IncomeLine({ amount }: { amount: number }) {
  const { t } = useTranslation()
  const [before, after = ''] = t('pg_income', { amount: '\u0000' }).split('\u0000')
  return (
    <p className={styles.income}>
      {before}
      <Money amount={amount} />
      {after}
    </p>
  )
}

/** Auto-invest (a monthly buy) and whether payouts are reinvested: the Playground's two standing choices. */
export function AutoInvestCard({
  state,
  onAutoInvest,
  onReinvest,
}: {
  state: PlaygroundState
  onAutoInvest: (plan: AutoInvest | null) => void
  onReinvest: (on: boolean) => void
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const plan = state.autoInvest
  return (
    <section className={styles.autoCard} aria-labelledby="auto-title">
      <div className={styles.autoHead}>
        <div>
          <h2 id="auto-title" className={styles.autoTitle}>
            {t('pg_auto_title')}
          </h2>
          <p className={styles.muted}>{plan ? t('pg_auto_on', { amount: moneyText(plan.amount), asset: assetName(t, plan.asset, true) }) : t('pg_auto_off')}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          {plan ? t('pg_auto_change') : t('pg_auto_set_up')}
        </Button>
      </div>
      <ul className={styles.autoSwitch}>
        <ListSwitch icon="coins" label={t('pg_reinvest')} checked={state.reinvest} onChange={onReinvest} />
      </ul>
      <p className={styles.note}>{t('pg_reinvest_note')}</p>
      {state.income > 0 && <IncomeLine amount={state.income} />}
      {open && (
        <AutoInvestSheet
          plan={plan}
          onClose={() => setOpen(false)}
          onSave={(p) => {
            onAutoInvest(p)
            setOpen(false)
          }}
        />
      )}
    </section>
  )
}

function AutoInvestSheet({ plan, onClose, onSave }: { plan: AutoInvest | null; onClose: () => void; onSave: (plan: AutoInvest | null) => void }) {
  const { t } = useTranslation()
  const [asset, setAsset] = useState<AssetId>(plan?.asset ?? 'us500')
  const [amount, setAmount] = useState(plan?.amount ?? CONFIG.autoInvestPresets[1])
  return (
    <div className={styles.scrim} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <BottomSheet>
          <div className={styles.grab} aria-hidden />
          <h2 className={styles.sheetTitle}>{t('pg_auto_sheet_title')}</h2>
          <p className={styles.kicker}>{t('pg_auto_amount')}</p>
          <div className={styles.chips} role="group" aria-label={t('pg_auto_amount')}>
            {CONFIG.autoInvestPresets.map((p) => (
              <button key={p} type="button" className={amount === p ? styles.chipOn : ''} aria-pressed={amount === p} onClick={() => setAmount(p)}>
                <Money amount={p} decimals={0} />
              </button>
            ))}
          </div>
          <p className={styles.kicker}>{t('pg_auto_into')}</p>
          <div className={`${styles.assetList} ${styles.autoAssets}`} role="radiogroup" aria-label={t('pg_auto_into')}>
            {ASSET_IDS.map((id) => (
              <button key={id} type="button" role="radio" aria-checked={asset === id} className={`${styles.assetRow} ${asset === id ? styles.assetOn : ''}`} onClick={() => setAsset(id)}>
                <span className={styles.dot} style={{ background: ASSET_DOT[id] }} />
                <span className={styles.assetText}>
                  <strong>{assetName(t, id, true)}</strong>
                </span>
              </button>
            ))}
          </div>
          <p className={styles.note}>{t('pg_auto_note')}</p>
          <div className={styles.sheetActions}>
            <Button onClick={() => onSave({ asset, amount })}>{t('pg_auto_save')}</Button>
            {plan && (
              <Button variant="secondary" onClick={() => onSave(null)}>
                {t('pg_auto_stop')}
              </Button>
            )}
          </div>
          <p className={styles.fine}>{t('pg_play_money_not_advice')}</p>
        </BottomSheet>
      </div>
    </div>
  )
}
