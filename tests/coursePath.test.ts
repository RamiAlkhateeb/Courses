import { describe, expect, it } from 'vitest'
import { unitStates } from '../src/domain/pathStates'

describe('roadmap', () => {
  const ids = ['overview', 'template', 'content', 'keywords']
  const prefix = 'tech-interview/resume'

  it('opens the first lesson of a fresh unit and locks the rest', () => {
    expect(unitStates(ids, [], prefix)).toEqual(['current', 'locked', 'locked', 'locked'])
  })

  it('moves "current" past finished lessons; finished ones stay open', () => {
    const done = [`${prefix}/overview`, `${prefix}/template`]
    expect(unitStates(ids, done, prefix)).toEqual(['done', 'done', 'current', 'locked'])
  })

  it('treats each unit on its own', () => {
    // Progress in another module does not unlock or lock this one.
    expect(unitStates(ids, ['tech-interview/dsa/approach'], prefix)[0]).toBe('current')
    expect(unitStates(ids, ids.map((id) => `${prefix}/${id}`), prefix)).toEqual(['done', 'done', 'done', 'done'])
  })
})
