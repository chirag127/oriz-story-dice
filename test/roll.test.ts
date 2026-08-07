import { describe, expect, it } from 'vitest'
import { STORY_DICE, THIS_OR_THAT, WYR } from '../src/lib/data'
import {
  clampDice,
  decodeRoll,
  encodeRoll,
  randInt,
  roll,
  rollDice,
  rollPrompt,
  rollThisOrThat,
  rollToText,
  rollWyr,
} from '../src/lib/roll'

describe('randInt', () => {
  it('stays in range [0,n)', () => {
    for (let i = 0; i < 500; i++) {
      const x = randInt(6)
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThan(6)
    }
  })
  it('handles n<=0', () => {
    expect(randInt(0)).toBe(0)
    expect(randInt(-3)).toBe(0)
  })
})

describe('clampDice', () => {
  it('clamps to [1, count]', () => {
    expect(clampDice(0)).toBe(1)
    expect(clampDice(99)).toBe(STORY_DICE.length)
    expect(clampDice(4)).toBe(4)
    expect(clampDice(Number.NaN)).toBe(3)
  })
})

describe('rollDice', () => {
  it('returns one face per requested die', () => {
    const r = rollDice(5)
    expect(r.mode).toBe('dice')
    expect(r.faces).toHaveLength(5)
    expect(r.dieCount).toBe(5)
  })
  it('each face belongs to its die', () => {
    const r = rollDice(STORY_DICE.length)
    r.faces.forEach((f, i) => {
      expect(STORY_DICE[i].faces.some((x) => x.id === f.id)).toBe(true)
    })
  })
})

describe('other modes', () => {
  it('prompt is a non-empty string', () => {
    expect(rollPrompt().text.length).toBeGreaterThan(10)
  })
  it('wyr pulls from WYR pool', () => {
    const r = rollWyr()
    expect(WYR.some(([a, b]) => a === r.a && b === r.b)).toBe(true)
  })
  it('tot pulls from THIS_OR_THAT pool', () => {
    const r = rollThisOrThat()
    expect(THIS_OR_THAT.some(([a, b]) => a === r.a && b === r.b)).toBe(true)
  })
  it('roll() dispatches by mode', () => {
    expect(roll('dice', 2).mode).toBe('dice')
    expect(roll('prompt').mode).toBe('prompt')
    expect(roll('wyr').mode).toBe('wyr')
    expect(roll('tot').mode).toBe('tot')
  })
})

describe('rollToText', () => {
  it('joins dice faces', () => {
    const t = rollToText(rollDice(3))
    expect(t).toContain(' · ')
  })
  it('formats wyr + tot', () => {
    expect(rollToText({ mode: 'wyr', a: 'X', b: 'Y' })).toBe('Would you rather X — or Y?')
    expect(rollToText({ mode: 'tot', a: 'X', b: 'Y' })).toBe('X or Y?')
  })
})

describe('share codec round-trips', () => {
  it('dice', () => {
    const r = rollDice(4)
    const back = decodeRoll(encodeRoll(r))
    expect(back).toEqual(r)
  })
  it('prompt', () => {
    const r = rollPrompt()
    expect(decodeRoll(encodeRoll(r))).toEqual(r)
  })
  it('wyr + tot', () => {
    const w = rollWyr()
    const t = rollThisOrThat()
    expect(decodeRoll(encodeRoll(w))).toEqual(w)
    expect(decodeRoll(encodeRoll(t))).toEqual(t)
  })
  it('rejects garbage', () => {
    expect(decodeRoll('not-a-real-token')).toBeNull()
    expect(decodeRoll('')).toBeNull()
  })
})
