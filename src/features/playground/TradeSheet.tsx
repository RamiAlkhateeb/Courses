import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BottomSheet, Button, Icon } from '../../components/ui'
import { moneyText } from '../../i18n'
import { Change } from '../../components/Change'
import { Money } from '../../components/Money'
import { RiskPills } from '../../components/RiskPills'
import { ASSETS, CONFIG, type AssetId } from '../../domain/playground/config'
import { cents, feeFor, marketOf, maxBuy, priceOf, valueOf, type PlaygroundState } from '../../domain/playground/engine'
import { ASSET_IDS } from '../../domain/playground/config'
import { assetName, ASSET_DOT } from './shared'
import { Chart } from './Chart'
import styles from './Playground.module.css'

type Side = 'buy' | 'sell'

/** Designs 24 and 33: choose what to trade, then a Buy/Sell sheet with the price, risk, amount, fee and what is left. */
export function TradeSheet({
  state,
  unlocked,
  initial,
  side: initialSide = 'buy',
  onClose,
  onBuy,
  onSell,
}: {
  state: PlaygroundState
  unlocked: AssetId[]
  /** Open straight on this asset (tapping a holding); otherwise start with the list */
  initial?: AssetId
  side?: Side
  onClose: () => void
  onBuy: (asset: AssetId, amount: number) => void
  onSell: (asset: AssetId, amount: number) => void
}) {
  const { t } = useTranslation()
  const [asset, setAsset] = useState<AssetId | undefined>(initial)
  const [side, setSide] = useState<Side>(initialSide)

  return (
    <div className={styles.scrim} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <BottomSheet>
          <div className={styles.grab} aria-hidden />
          {asset ? (
            <TradeForm state={state} asset={asset} side={side} setSide={setSide} onBuy={onBuy} onSell={onSell} onBack={() => setAsset(undefined)} />
          ) : (
            <>
              <h2 className={styles.sheetTitle}>{t('pg_trade_what')}</h2>
              <div className={styles.assetList}>
                {ASSET_IDS.map((id) => {
                  const open = unlocked.includes(id)
                  return (
                    <button key={id} type="button" disabled={!open} className={`${styles.assetRow} ${open ? '' : styles.assetLocked}`} onClick={() => setAsset(id)}>
                      <span className={styles.dot} style={{ background: ASSET_DOT[id] }} />
                      <span className={styles.assetText}>
                        <strong>{assetName(t, id)}</strong>
                        <small>{open ? t(`pg_asset_${id}_blurb`) : t('pg_unlocks_after', { n: ASSETS[id].unlockAfterLessons })}</small>
                      </span>
                      {open ? <RiskPills level={ASSETS[id].risk} /> : <Icon name="lock" size={20} />}
                    </button>
                  )
                })}
              </div>
              <Link to="/playground/unlocks" className={styles.unlockLink}>
                {t('pg_what_unlocks')} ›
              </Link>
              <p className={styles.fine}>{t('pg_play_money_not_advice')}</p>
            </>
          )}
        </BottomSheet>
      </div>
    </div>
  )
}

function TradeForm({
  state,
  asset,
  side,
  setSide,
  onBuy,
  onSell,
  onBack,
}: {
  state: PlaygroundState
  asset: AssetId
  side: Side
  setSide: (s: Side) => void
  onBuy: (asset: AssetId, amount: number) => void
  onSell: (asset: AssetId, amount: number) => void
  onBack: () => void
}) {
  const { t } = useTranslation()
  const market = marketOf(state)
  const price = priceOf(state, asset, market)
  const held = state.holdings[asset]
  const value = valueOf(state, asset, market)
  const max = maxBuy(state.cash)
  const [buyAmount, setBuyAmount] = useState(() => Math.min(100, max))
  const [sellFraction, setSellFraction] = useState(0.5)

  const history = useMemo(() => market.price[asset].slice(Math.max(0, state.tick - 52), state.tick + 1), [market, asset, state.tick])
  const week = state.tick > 0 ? (price / market.price[asset][state.tick - 1] - 1) * 100 : 0
  const sinceBought = held && held.cost > 0 ? (value / held.cost - 1) * 100 : 0

  const sellAmount = side === 'sell' ? (sellFraction >= 1 ? value : cents(value * sellFraction)) : 0
  const amount = side === 'buy' ? buyAmount : sellAmount
  const fee = feeFor(amount)
  const canConfirm = side === 'buy' ? amount > 0 && amount + fee <= state.cash + 1e-9 : amount > 0
  const losing = side === 'sell' && held !== undefined && value < held.cost
  const step = (d: number) => setBuyAmount((a) => Math.max(0, Math.min(max, cents(a + d))))

  return (
    <>
      <div className={styles.tradeHead}>
        <div>
          <p className={styles.kicker}>{side === 'buy' ? t('pg_buy_kicker') : t('pg_sell_kicker')}</p>
          <h2 className={styles.tradeName}>{assetName(t, asset)}</h2>
          {ASSETS[asset].fictional && <small className={styles.muted}>{t('pg_fictional_company')}</small>}
        </div>
        <div className={styles.priceBox}>
          <strong>
            <Money amount={side === 'sell' ? value : price} decimals={side === 'sell' ? 0 : 2} />
          </strong>
          {side === 'sell' && held ? (
            <Change percent={sinceBought} label={t('pg_since_bought')} />
          ) : (
            <Change percent={week} label={t('pg_today')} />
          )}
        </div>
      </div>

      {side === 'buy' && (
        <>
          <Chart nominal={history.length > 1 ? history : [price, price]} label={t('pg_asset_chart', { name: assetName(t, asset), price: price.toFixed(2) })} />
          <div className={styles.riskRow}>
            <span className={styles.muted}>{t('pg_risk')}</span>
            <RiskPills level={ASSETS[asset].risk} />
            <strong>{t('pg_n_of_5', { n: ASSETS[asset].risk })}</strong>
          </div>
        </>
      )}

      <div className={styles.seg} role="group" aria-label={t('pg_buy_or_sell')}>
        <button type="button" aria-pressed={side === 'buy'} onClick={() => setSide('buy')}>
          {t('pg_buy')}
        </button>
        <button type="button" aria-pressed={side === 'sell'} disabled={!held} onClick={() => setSide('sell')}>
          {t('pg_sell')}
        </button>
      </div>

      {side === 'buy' ? (
        <>
          <div className={styles.stepper}>
            <button type="button" className={styles.round} onClick={() => step(-10)} aria-label={t('pg_less')}>
              <Icon name="minus" size={22} />
            </button>
            <strong className={styles.amount}>
              <Money amount={buyAmount} />
            </strong>
            <button type="button" className={styles.round} onClick={() => step(10)} aria-label={t('pg_more')}>
              <Icon name="plus" size={22} />
            </button>
          </div>
          <div className={styles.chips}>
            {CONFIG.tradePresets.map((p) => (
              <button key={p} type="button" className={buyAmount === p ? styles.chipOn : ''} disabled={p > max} onClick={() => setBuyAmount(p)}>
                <Money amount={p} />
              </button>
            ))}
            <button type="button" className={buyAmount === max && max > 0 ? styles.chipOn : ''} disabled={max <= 0} onClick={() => setBuyAmount(max)}>
              {t('pg_max')} <Money amount={max} />
            </button>
          </div>
          <dl className={styles.lines}>
            <div>
              <dt>{t('pg_fee', { pct: CONFIG.feeRate * 100 })}</dt>
              <dd>
                <Money amount={fee} decimals={2} />
              </dd>
            </div>
            <div>
              <dt>{t('pg_cash_left')}</dt>
              <dd>
                <Money amount={cents(state.cash - amount - fee)} decimals={2} />
              </dd>
            </div>
          </dl>
          <p className={styles.note}>{t('pg_fees_note')}</p>
        </>
      ) : (
        <>
          <strong className={`${styles.amount} ${styles.centre}`}>
            <Money amount={sellAmount} />
          </strong>
          <div className={styles.chips}>
            {[0.25, 0.5, 1].map((f) => (
              <button key={f} type="button" className={sellFraction === f ? styles.chipOn : ''} onClick={() => setSellFraction(f)}>
                {f === 1 ? t('pg_all') : `${f * 100}%`}
              </button>
            ))}
          </div>
          <dl className={styles.lines}>
            <div>
              <dt>{t('pg_fee', { pct: CONFIG.feeRate * 100 })}</dt>
              <dd>
                <Money amount={fee} decimals={2} />
              </dd>
            </div>
            <div>
              <dt>{t('pg_you_receive')}</dt>
              <dd>
                <Money amount={cents(amount - fee)} decimals={2} />
              </dd>
            </div>
          </dl>
          {losing && <p className={styles.callout}>{t('pg_loss_real')}</p>}
        </>
      )}

      <Button disabled={!canConfirm} onClick={() => (side === 'buy' ? onBuy(asset, amount) : onSell(asset, amount))}>
        {side === 'buy' ? t('pg_buy_amount', { amount: moneyText(amount) }) : t('pg_sell_amount', { amount: moneyText(amount) })}
      </Button>
      <Button variant="ghost" size="sm" className={styles.backBtn} onClick={onBack}>
        {t('pg_choose_another')}
      </Button>
    </>
  )
}

