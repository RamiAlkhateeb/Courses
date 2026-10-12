import { getSettings } from './settings'

export type SoundKind = 'correct' | 'wrong' | 'complete'

/** Notes per sound: [frequency Hz, start s, length s]. Synthesised, so there are no audio files to load. */
const NOTES: Record<SoundKind, [number, number, number][]> = {
  correct: [
    [660, 0, 0.12],
    [990, 0.1, 0.18],
  ],
  wrong: [
    [220, 0, 0.16],
    [185, 0.14, 0.22],
  ],
  complete: [
    [523, 0, 0.14],
    [659, 0.12, 0.14],
    [784, 0.24, 0.14],
    [1047, 0.36, 0.3],
  ],
}

let ctx: AudioContext | undefined

/** Plays a short effect unless sound is off in Settings or the browser has no Web Audio. */
export function playSound(kind: SoundKind) {
  if (!getSettings().sound) return
  try {
    ctx ??= new AudioContext()
    const now = ctx.currentTime
    for (const [freq, start, length] of NOTES[kind]) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = kind === 'wrong' ? 'triangle' : 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, now + start)
      gain.gain.exponentialRampToValueAtTime(0.18, now + start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + length)
      osc.connect(gain).connect(ctx.destination)
      osc.start(now + start)
      osc.stop(now + start + length + 0.02)
    }
  } catch {
    // No audio available — sounds are optional.
  }
}
