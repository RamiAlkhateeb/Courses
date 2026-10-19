import { useEffect, useRef } from 'react'
import type { AssetId } from '../domain/playground/config'
import { buy, cashOut, catchUp, fund, marketOf, netWorth, readNews, sell, setAutoInvest, setReinvest, type AutoInvest, type TradeResult } from '../domain/playground/engine'
import type { EventId } from '../domain/playground/events'
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
      const r = buy(before.status === 'idle' ? { ...before, seed: newSeed() } : before, asset, amount, Date.now())
      if (r.ok) playgroundStore.update(() => r.state)
      return r
    },
    sell(asset: AssetId, amount: number): TradeResult {
      const r = sell(playgroundStore.get(), asset, amount)
      if (r.ok) playgroundStore.update(() => r.state)
      return r
    },
    /** The player read the oldest unread market story. */
    readNews: () => playgroundStore.update(readNews),
    setAutoInvest: (plan: AutoInvest | null) => playgroundStore.update((s) => setAutoInvest(s, plan)),
    setReinvest: (on: boolean) => playgroundStore.update((s) => setReinvest(s, on)),
  }
}

/** How often the clock checks the real time. A simulated week is about 27.7 real minutes, so this is plenty. */
const CHECK_MS = 30_000

/**
 * The clock (`onNews` hears of the stories that just landed): time follows the real clock (one real day = one simulated year) and never stops, even while the app is
 * closed. Mounted once for the whole app (AppFrame), so the wallet on Learn and Me is live too. It catches the season up
 * on start, every 30 seconds and whenever the tab comes back into view; news that landed meanwhile waits in the queue.
 */
export function usePlaygroundClock(onNews?: (ids: EventId[]) => void) {
  const latest = useRef(onNews)
  latest.current = onNews
  useEffect(() => {
    const tick = (opening = false) => {
      const s = playgroundStore.get()
      if (s.status !== 'running') return
      playgroundStore.update((x) => catchUp(x, Date.now()))
      // Stories that landed in this catch-up (for the news alerts). Not on opening: those wait on the Playground.
      if (opening) return
      const after = playgroundStore.get()
      const fresh = after.seenEvents.filter((t) => !s.seenEvents.includes(t))
      const events = marketOf(after).events
      if (fresh.length) latest.current?.(fresh.map((t) => events.find((e) => e.tick === t)!.id))
    }
    tick(true)
    const id = window.setInterval(tick, CHECK_MS)
    const onVisibility = () => !document.hidden && tick()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])
}
