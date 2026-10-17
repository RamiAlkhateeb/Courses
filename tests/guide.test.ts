import { describe, expect, it } from 'vitest'
import type { Block } from '../src/content/types'
import { fillerPose } from '../src/domain/guide'

const p: Block = { type: 'html', html: { en: '<p>x</p>' } }
const idea: Block = { type: 'keyIdea', html: { en: '<p>k</p>' } }
const fig: Block = { type: 'diagram', fig: { en: 'F' }, title: { en: 'T' }, src: '/x.svg', alt: { en: 'A' }, caption: { en: 'C' } }
const box = (variant: 'analogy' | 'mistake' | 'example' | 'keypoint'): Block => ({ type: 'box', variant, label: { en: 'L' }, html: { en: 'x' } })

describe('the guide that fills a lesson step', () => {
  it('thinks over a key idea and points at a picture', () => {
    expect(fillerPose([p, idea], 3)).toBe('think')
    expect(fillerPose([p, fig], 3)).toBe('point')
  })

  it('takes turns on plain steps, so consecutive steps differ', () => {
    const poses = [0, 1, 2, 3].map((i) => fillerPose([p], i))
    expect(new Set(poses).size).toBe(4)
  })

  it('never repeats the pose of a tip guide already on the step', () => {
    expect(fillerPose([p, box('analogy'), fig], 0)).not.toBe('point')
    expect(fillerPose([box('example'), idea], 0)).toBe('think')
    for (let i = 0; i < 4; i++) expect(fillerPose([box('analogy')], i)).not.toBe('point')
  })
})
