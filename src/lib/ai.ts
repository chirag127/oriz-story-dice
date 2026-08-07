import { complete } from '@chirag127/oz-ai'
import type { Roll } from './roll'
import { rollToText } from './roll'

const SEED_SYSTEM =
  'You are a concise, vivid story-seed writer. Given creative-play ingredients, write a single evocative paragraph (60-110 words) that fuses them into one story opening. No preamble, no headings, no lists. Present tense, one paragraph only.'

const PACK_SYSTEM =
  'You generate fresh creative writing prompts. Output EXACTLY 5 one-line prompts, each on its own line, no numbering, no bullets, no extra text. Each prompt is a single evocative sentence.'

/** Expand any roll into a story seed. Throws only if every provider fails. */
export async function expandRoll(r: Roll, signal?: AbortSignal): Promise<string> {
  const ingredients = rollToText(r)
  const framing =
    r.mode === 'wyr'
      ? `Turn this dilemma into a story opening about a character forced to choose: ${ingredients}`
      : r.mode === 'tot'
        ? `Write a story opening sparked by this contrast: ${ingredients}`
        : `Fuse these ingredients into one story opening: ${ingredients}`
  const text = await complete(framing, { system: SEED_SYSTEM, signal })
  return text.trim()
}

/** Generate a fresh 5-prompt pack around an optional theme. */
export async function generatePack(theme: string, signal?: AbortSignal): Promise<string[]> {
  const t = theme.trim()
  const ask = t ? `Theme: ${t}. Write 5 prompts.` : 'Write 5 wildly varied prompts.'
  const text = await complete(ask, { system: PACK_SYSTEM, signal })
  return text
    .split('\n')
    .map((l) => l.replace(/^\s*[-*\d.)\s]+/, '').trim())
    .filter(Boolean)
    .slice(0, 5)
}
