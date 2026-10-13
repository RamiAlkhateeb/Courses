import { useEffect } from 'react'
import { tickMs, type AssetId } from '../domain/playground/config'
import { advance, buy, cashOut, dismissEvent, fund, netWorth, sell, setSpeed, type PlaygroundState, type Speed, type TradeResult } from '../domain/playground/engine'
import { progressStore } from './progress'
import { playgroundStore } from './playground'
import { useProgress } from './useProgress'
import { useStore } from './useStore'

/** A fresh seed for a new season (the only place randomness enters: the season itself is then deterministic). */
const newSeed = () => (Math.floor(Math.random() * 0x7fffffff) ^ Date.now()) >>> 0

const round2 = (n: number) => Math.round(n * 100) / 100

/** Everything the player owns in play money: the bank plus the Playground's net worth (cash and holdings). */
export function useWallet(): number {
  const { progress } = useProgress()
  const pg = useStore(playgroundStore)
  return round2(progress.bank + netWorth(pg))
}

/** One wallet: while a season is open, money from lessons flows into the Playground's cash. */
function sweepBank() {
  const s = playgroundStore.get()
  const bank = progressStore.get().bank
  if (s.status === 'ended' || !(bank > 0)) return
  // The Playground gets it first, so a crash between the two saves can only leave extra play money, never less.
  playgroundStore.update((x) => fund(x, bank))
  progressStore.update((p) => ({ ...p, bank: round2(p.bank - bank) }))
}

export function usePlayground() {
  const state = useStore(playgroundStore)
  const { progress } = useProgress()
  useEffect(sweepBank, [progress.bank, state.status])

  return {
    state,
    /** Take everything out between seasons: the money goes back to the bank and a new season is set up. */
    cashOut(): number | null {
      const out = cashOut(playgroundStore.get(), newSeed())
      if (!out) return null
      playgroundStore.update(() => out.state)
      progressStore.update((p) => ({ ...p, bank: round2(p.bank + out.amount) }))
      return out.amount
    },
    buy(asset: AssetId, amount: number): TradeResult {
      sweepBank()
      // The first buy starts the season: pick its seed.
      const before = playgroundStore.get()
      const r = buy(before.status === 'idle' ? { ...before, seed: newSeed() } : before, asset, amount)
      if (r.ok) playgroundStore.update(() => r.state)
      return r
    },
    sell(asset: AssetId, amount: number): TradeResult {
      const r = sell(playgroundStore.get(), asset, amount)
      if (r.ok) playgroundStore.update(() => r.state)
      return r
    },
    setSpeed: (speed: Speed) => playgroundStore.update((s) => setSpeed(s, speed)),
    dismissEvent: () => playgroundStore.update(dismissEvent),
  }
}

/**
 * The clock: while the Playground screen is open and visible, a week passes every `tickMs(speed)`. It stops while
 * `hold` is true (a sheet is open), when news is waiting, and whenever the screen is closed or the tab is hidden.
 * Markets only move while you watch, so a season that was running when the app opened (or the tab went to the
 * background) comes back paused, and the player taps play.
 */
export function usePlaygroundClock(state: PlaygroundState, hold: boolean) {
  const pause = () => {
    const s = playgroundStore.get()
    if (s.status === 'running' && s.speed > 0) playgroundStore.update((x) => setSpeed(x, 0))
  }
  useEffect(() => {
    pause()
    const onVisibility = () => document.hidden && pause()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      pause()
    }
  }, [])

  const running = state.status === 'running' && state.speed > 0 && !state.pendingEvent && !hold
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => playgroundStore.update(advance), tickMs(state.speed))
    return () => window.clearInterval(id)
  }, [running, state.speed])
}
