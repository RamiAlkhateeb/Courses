import { useEffect, useRef, useState } from 'react'
import { tickMs, type AssetId } from '../domain/playground/config'
import {
  advance,
  buy,
  cashOut,
  dismissEvent,
  fund,
  sell,
  setSpeed,
  type PlaygroundState,
  type Speed,
  type Trade,
  type TradeResult,
} from '../domain/playground/engine'
import { eventsUnlocked, unlockedAssets } from '../domain/playground/unlocks'
import { progressStore } from './progress'
import { playgroundStore } from './playground'
import { useProgress } from './useProgress'
import { useTrail, useTrailId } from './useTrail'
import { useStore } from './useStore'

/** A fresh seed for a new season (the only place randomness enters: the season itself is then deterministic). */
const newSeed = () => (Math.floor(Math.random() * 0x7fffffff) ^ Date.now()) >>> 0

/** The trade the player just made, for the debrief screen (not saved: a reload shows the Playground instead). */
let lastTrade: Trade | null = null
export const takeLastTrade = () => {
  const t = lastTrade
  lastTrade = null
  return t
}

export function usePlayground() {
  const state = useStore(playgroundStore)
  const { chapters } = useTrail(useTrailId())
  const unitLessons = chapters[0]?.lessons.length ?? 0
  const { progress } = useProgress()
  const lessons = progress.lessonsDone.length
  const unlocked = unlockedAssets(lessons)
  const news = eventsUnlocked(lessons, unitLessons)

  return {
    state,
    unlocked,
    newsUnlocked: news,
    lessons,
    /** Move `amount` from the bank into the Playground. The Playground gets it first, so a crash between the two
     *  saves can only leave you with extra play money, never less. */
    fund(amount: number): boolean {
      const bank = progressStore.get().bank
      const a = Math.min(Math.floor(amount * 100) / 100, bank)
      if (!(a > 0) || playgroundStore.get().status === 'ended') return false
      playgroundStore.update((s) => fund(s, a))
      progressStore.update((p) => ({ ...p, bank: Math.round((p.bank - a) * 100) / 100 }))
      return true
    },
    /** Take everything out between seasons: the money goes back to the bank and a new season is set up. */
    cashOut(): number | null {
      const out = cashOut(playgroundStore.get(), newSeed(), news)
      if (!out) return null
      playgroundStore.update(() => out.state)
      progressStore.update((p) => ({ ...p, bank: Math.round((p.bank + out.amount) * 100) / 100 }))
      return out.amount
    },
    buy(asset: AssetId, amount: number): TradeResult {
      if (!unlocked.includes(asset)) return { ok: false, reason: 'amount' }
      // The first buy starts the season: pick its seed, and whether it has news (only if that is unlocked now).
      const before = playgroundStore.get()
      const ready = before.status === 'idle' ? { ...before, seed: newSeed(), eventsOn: news } : before
      const r = buy(ready, asset, amount)
      if (r.ok) {
        lastTrade = r.trade
        playgroundStore.update(() => r.state)
      }
      return r
    },
    sell(asset: AssetId, amount: number): TradeResult {
      const r = sell(playgroundStore.get(), asset, amount)
      if (r.ok) {
        lastTrade = r.trade
        playgroundStore.update(() => r.state)
      }
      return r
    },
    setSpeed: (speed: Speed) => playgroundStore.update((s) => setSpeed(s, speed)),
    dismissEvent: () => playgroundStore.update(dismissEvent),
  }
}

/**
 * The clock: while the Playground screen is open and visible, a week passes every `tickMs(speed)`. It stops while
 * `hold` is true (a sheet is open), when news is waiting, when the tab is hidden, and whenever the screen is closed.
 * Coming back (or opening the app on a season that was running) pauses time and reports `away`, so the screen can say
 * "Time stood still" and let the player Resume.
 */
export function usePlaygroundClock(state: PlaygroundState, hold: boolean) {
  const [away, setAway] = useState(() => state.status === 'running' && state.speed > 0)
  const resumeSpeed = useRef<Speed>(state.speed || 1)

  // Opened with a running season: nothing moved while the app was closed.
  useEffect(() => {
    if (state.status === 'running' && state.speed > 0) {
      resumeSpeed.current = state.speed
      playgroundStore.update((s) => setSpeed(s, 0))
    }
    // only on first show
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function onVisibility() {
      const s = playgroundStore.get()
      if (document.hidden) {
        if (s.status === 'running' && s.speed > 0) {
          resumeSpeed.current = s.speed
          playgroundStore.update((x) => setSpeed(x, 0))
          setAway(true)
        }
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const running = state.status === 'running' && state.speed > 0 && !state.pendingEvent && !hold && !away
  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => playgroundStore.update(advance), tickMs(state.speed))
    return () => window.clearInterval(id)
  }, [running, state.speed])

  return {
    away: away && state.status === 'running',
    resume() {
      playgroundStore.update((s) => setSpeed(s, resumeSpeed.current))
      setAway(false)
    },
    stayPaused() {
      setAway(false)
    },
  }
}
