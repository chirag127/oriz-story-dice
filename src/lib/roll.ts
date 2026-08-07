import lzString from 'lz-string'
const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = lzString
import { PROMPT_PARTS, STORY_DICE, THIS_OR_THAT, WYR, type StoryFace } from './data'

export type Mode = 'dice' | 'prompt' | 'wyr' | 'tot'

export type DiceRoll = { mode: 'dice'; faces: StoryFace[]; dieCount: number }
export type PromptRoll = { mode: 'prompt'; text: string }
export type WyrRoll = { mode: 'wyr'; a: string; b: string }
export type TotRoll = { mode: 'tot'; a: string; b: string }
export type Roll = DiceRoll | PromptRoll | WyrRoll | TotRoll

const MIN_DICE = 1
const MAX_DICE = STORY_DICE.length

/** Uniform int in [0, n) using crypto when available, Math.random fallback. */
export function randInt(n: number): number {
  if (n <= 0) return 0
  const g = globalThis as { crypto?: Crypto }
  if (g.crypto?.getRandomValues) {
    // Rejection sampling to avoid modulo bias.
    const max = Math.floor(0xffffffff / n) * n
    const buf = new Uint32Array(1)
    let x = 0
    do {
      g.crypto.getRandomValues(buf)
      x = buf[0]
    } while (x >= max)
    return x % n
  }
  return Math.floor(Math.random() * n)
}

export function pick<T>(arr: readonly T[]): T {
  return arr[randInt(arr.length)]
}

export function clampDice(n: number): number {
  if (!Number.isFinite(n)) return 3
  return Math.min(MAX_DICE, Math.max(MIN_DICE, Math.round(n)))
}

/** Roll the first `dieCount` story dice, one face each. */
export function rollDice(dieCount: number): DiceRoll {
  const count = clampDice(dieCount)
  const faces = STORY_DICE.slice(0, count).map((d) => pick(d.faces))
  return { mode: 'dice', faces, dieCount: count }
}

export function rollPrompt(): PromptRoll {
  const text = `${pick(PROMPT_PARTS.opener)} ${pick(PROMPT_PARTS.subject)} ${pick(PROMPT_PARTS.turn)}`
  return { mode: 'prompt', text }
}

export function rollWyr(): WyrRoll {
  const [a, b] = pick(WYR)
  return { mode: 'wyr', a, b }
}

export function rollThisOrThat(): TotRoll {
  const [a, b] = pick(THIS_OR_THAT)
  return { mode: 'tot', a, b }
}

export function roll(mode: Mode, dieCount = 3): Roll {
  switch (mode) {
    case 'dice':
      return rollDice(dieCount)
    case 'prompt':
      return rollPrompt()
    case 'wyr':
      return rollWyr()
    case 'tot':
      return rollThisOrThat()
  }
}

/** Human-readable one-liner for a roll — used for copy + AI seed. */
export function rollToText(r: Roll): string {
  switch (r.mode) {
    case 'dice':
      return r.faces.map((f) => f.label).join(' · ')
    case 'prompt':
      return r.text
    case 'wyr':
      return `Would you rather ${r.a} — or ${r.b}?`
    case 'tot':
      return `${r.a} or ${r.b}?`
  }
}

// --- Share codec: compact roll -> LZ-string token, reversible ---
// Encodes minimal shape so URLs stay short.
type Wire =
  | { m: 'dice'; f: string[] } // face ids, index = die index
  | { m: 'prompt'; t: string }
  | { m: 'wyr'; a: string; b: string }
  | { m: 'tot'; a: string; b: string }

export function encodeRoll(r: Roll): string {
  let wire: Wire
  if (r.mode === 'dice') wire = { m: 'dice', f: r.faces.map((f) => f.id) }
  else if (r.mode === 'prompt') wire = { m: 'prompt', t: r.text }
  else if (r.mode === 'wyr') wire = { m: 'wyr', a: r.a, b: r.b }
  else wire = { m: 'tot', a: r.a, b: r.b }
  return compressToEncodedURIComponent(JSON.stringify(wire))
}

export function decodeRoll(token: string): Roll | null {
  try {
    const json = decompressFromEncodedURIComponent(token)
    if (!json) return null
    const w = JSON.parse(json) as Wire
    if (w.m === 'dice') {
      const faces: StoryFace[] = []
      w.f.forEach((id, i) => {
        const die = STORY_DICE[i]
        const face = die?.faces.find((x) => x.id === id)
        if (face) faces.push(face)
      })
      if (!faces.length) return null
      return { mode: 'dice', faces, dieCount: faces.length }
    }
    if (w.m === 'prompt') return { mode: 'prompt', text: String(w.t) }
    if (w.m === 'wyr') return { mode: 'wyr', a: String(w.a), b: String(w.b) }
    if (w.m === 'tot') return { mode: 'tot', a: String(w.a), b: String(w.b) }
    return null
  } catch {
    return null
  }
}
