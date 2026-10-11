import { describe, expect, it } from 'vitest'
import { parseSettings } from '../src/features/settings/store'

describe('settings', () => {
  it('defaults to sound on', () => {
    expect(parseSettings(null)).toEqual({ sound: true })
    expect(parseSettings('maybe')).toEqual({ sound: true })
  })

  it('keeps a saved sound-off choice', () => {
    expect(parseSettings('off')).toEqual({ sound: false })
    expect(parseSettings('on')).toEqual({ sound: true })
  })
})
