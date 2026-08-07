import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  type Mode,
  type Roll,
  clampDice,
  decodeRoll,
  encodeRoll,
  roll as doRoll,
  rollToText,
} from '../lib/roll'
import { STORY_DICE } from '../lib/data'
import styles from './PlayStudio.module.css'

const MODES: { id: Mode; label: string; blurb: string }[] = [
  { id: 'dice', label: 'Story Dice', blurb: 'Roll ingredients for a scene' },
  { id: 'prompt', label: 'Prompt Roller', blurb: 'One-line writing prompt' },
  { id: 'wyr', label: 'Would You Rather', blurb: 'Impossible choices' },
  { id: 'tot', label: 'This or That', blurb: 'Quickfire picks' },
]

type AiState = { status: 'idle' | 'thinking' | 'done' | 'error'; text: string; msg?: string }

function readHashRoll(): Roll | null {
  if (typeof window === 'undefined') return null
  const h = window.location.hash.replace(/^#r=/, '')
  return h && window.location.hash.startsWith('#r=') ? decodeRoll(h) : null
}

export default function PlayStudio() {
  const [mode, setMode] = useState<Mode>('dice')
  const [dieCount, setDieCount] = useState(3)
  const [current, setCurrent] = useState<Roll | null>(null)
  const [rolling, setRolling] = useState(false)
  const [history, setHistory] = useState<Roll[]>([])
  const [copied, setCopied] = useState<'link' | 'text' | null>(null)
  const [ai, setAi] = useState<AiState>({ status: 'idle', text: '' })
  const [pack, setPack] = useState<{ status: AiState['status']; items: string[]; theme: string; msg?: string }>({
    status: 'idle',
    items: [],
    theme: '',
  })
  const abortRef = useRef<AbortController | null>(null)

  // Hydrate a shared roll from the URL hash.
  useEffect(() => {
    const shared = readHashRoll()
    if (shared) {
      setMode(shared.mode)
      if (shared.mode === 'dice') setDieCount(shared.dieCount)
      setCurrent(shared)
    }
  }, [])

  const rollNow = useCallback(
    (m: Mode = mode, n = dieCount) => {
      setAi({ status: 'idle', text: '' })
      setRolling(true)
      const r = doRoll(m, n)
      // Let the tumble animation play, then settle.
      window.setTimeout(() => {
        setCurrent(r)
        setHistory((h) => [r, ...h].slice(0, 12))
        setRolling(false)
        if (typeof window !== 'undefined') {
          const token = encodeRoll(r)
          window.history.replaceState(null, '', `#r=${token}`)
        }
      }, 620)
    },
    [mode, dieCount],
  )

  const switchMode = (m: Mode) => {
    setMode(m)
    setCurrent(null)
    setAi({ status: 'idle', text: '' })
  }

  const text = current ? rollToText(current) : ''

  const copy = async (kind: 'link' | 'text') => {
    if (!current) return
    const payload =
      kind === 'text' ? text : `${window.location.origin}${window.location.pathname}#r=${encodeRoll(current)}`
    try {
      await navigator.clipboard.writeText(payload)
      setCopied(kind)
      window.setTimeout(() => setCopied(null), 1600)
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  const expand = async () => {
    if (!current) return
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setAi({ status: 'thinking', text: '' })
    try {
      const { expandRoll } = await import('../lib/ai')
      const out = await expandRoll(current, ac.signal)
      if (!ac.signal.aborted) setAi({ status: 'done', text: out })
    } catch (e) {
      if (!ac.signal.aborted)
        setAi({ status: 'error', text: '', msg: e instanceof Error ? e.message : 'AI unavailable' })
    }
  }

  const makePack = async (theme: string) => {
    abortRef.current?.abort()
    const ac = new AbortController()
    abortRef.current = ac
    setPack((p) => ({ ...p, status: 'thinking', theme }))
    try {
      const { generatePack } = await import('../lib/ai')
      const items = await generatePack(theme, ac.signal)
      if (!ac.signal.aborted) setPack({ status: 'done', items, theme })
    } catch (e) {
      if (!ac.signal.aborted)
        setPack((p) => ({ ...p, status: 'error', msg: e instanceof Error ? e.message : 'AI unavailable' }))
    }
  }

  useEffect(() => () => abortRef.current?.abort(), [])

  const modeMeta = useMemo(() => MODES.find((x) => x.id === mode)!, [mode])

  return (
    <section className={styles.studio} aria-label="Creative play studio">
      <header className={styles.hero}>
        <p className={styles.kicker}>creative play · no signup</p>
        <h1 className={styles.title}>Roll a story into being.</h1>
        <p className={styles.sub}>
          Story dice, prompt rollers, would-you-rather and this-or-that — spun in your browser, expandable by AI,
          shareable by link.
        </p>
      </header>

      <div className={styles.modes} role="tablist" aria-label="Play modes">
        {MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            className={`${styles.modeBtn} ${mode === m.id ? styles.modeActive : ''}`}
            onClick={() => switchMode(m.id)}
          >
            <span className={styles.modeLabel}>{m.label}</span>
            <span className={styles.modeBlurb}>{m.blurb}</span>
          </button>
        ))}
      </div>

      <div className={styles.table}>
        {mode === 'dice' && (
          <div className={styles.diceControls}>
            <label htmlFor="dc" className={styles.dcLabel}>
              Dice: <strong>{dieCount}</strong>
            </label>
            <input
              id="dc"
              type="range"
              min={1}
              max={STORY_DICE.length}
              value={dieCount}
              onChange={(e) => setDieCount(clampDice(+e.target.value))}
              className={styles.range}
            />
            <span className={styles.dcHint}>{STORY_DICE.slice(0, dieCount).map((d) => d.name).join(' · ')}</span>
          </div>
        )}

        <div className={styles.stage} aria-live="polite">
          {!current && !rolling && (
            <p className={styles.empty}>Nothing rolled yet. Hit <strong>Roll</strong> to begin — {modeMeta.blurb.toLowerCase()}.</p>
          )}

          {mode === 'dice' && (rolling || current?.mode === 'dice') && (
            <div className={styles.diceGrid}>
              {(rolling ? STORY_DICE.slice(0, dieCount) : []).map((d, i) => (
                <Die key={`t${i}`} glyph="⚄" label={d.name} rolling />
              ))}
              {!rolling &&
                current?.mode === 'dice' &&
                current.faces.map((f, i) => (
                  <Die key={f.id + i} glyph={f.glyph} label={STORY_DICE[i]?.name ?? ''} caption={f.label} />
                ))}
            </div>
          )}

          {mode !== 'dice' && !rolling && current && (
            <div className={styles.cardOut}>
              {current.mode === 'prompt' && <p className={styles.promptText}>{current.text}</p>}
              {(current.mode === 'wyr' || current.mode === 'tot') && (
                <div className={styles.versus}>
                  <span className={styles.side}>{current.a}</span>
                  <span className={styles.vs}>or</span>
                  <span className={styles.side}>{current.b}</span>
                </div>
              )}
            </div>
          )}

          {mode !== 'dice' && rolling && <p className={styles.tumbling}>shuffling…</p>}
        </div>

        <div className={styles.actions}>
          <button className={styles.rollBtn} onClick={() => rollNow()} disabled={rolling}>
            {rolling ? 'Rolling…' : current ? 'Roll again' : 'Roll'}
          </button>
          {current && (
            <>
              <button className={styles.ghost} onClick={() => copy('text')}>
                {copied === 'text' ? 'Copied!' : 'Copy text'}
              </button>
              <button className={styles.ghost} onClick={() => copy('link')}>
                {copied === 'link' ? 'Link copied!' : 'Share link'}
              </button>
              <button className={styles.aiBtn} onClick={expand} disabled={ai.status === 'thinking'}>
                {ai.status === 'thinking' ? 'Thinking…' : '✦ Expand with AI'}
              </button>
            </>
          )}
        </div>

        {ai.status === 'thinking' && (
          <p className={styles.aiNote} role="status">
            <span className={styles.spinner} aria-hidden="true" /> Weaving a story seed… (AI is optional polish — your
            roll already stands on its own.)
          </p>
        )}
        {ai.status === 'done' && (
          <blockquote className={styles.aiOut}>
            {ai.text}
            <span className={styles.aiTag}>story seed · AI</span>
          </blockquote>
        )}
        {ai.status === 'error' && (
          <p className={styles.aiErr} role="alert">
            AI providers all busy right now ({ai.msg}). Your roll still works — try Expand again in a moment.
          </p>
        )}
      </div>

      {/* Prompt-pack generator */}
      <div className={styles.packBox}>
        <h2 className={styles.packTitle}>Fresh prompt pack</h2>
        <p className={styles.packSub}>Generate five brand-new prompts on any theme (AI, optional).</p>
        <PackForm status={pack.status} onGenerate={makePack} />
        {pack.status === 'thinking' && (
          <p className={styles.aiNote} role="status">
            <span className={styles.spinner} aria-hidden="true" /> Brewing five prompts{pack.theme ? ` on “${pack.theme}”` : ''}…
          </p>
        )}
        {pack.status === 'done' && pack.items.length > 0 && (
          <ol className={styles.packList}>
            {pack.items.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
        )}
        {pack.status === 'error' && (
          <p className={styles.aiErr} role="alert">
            Couldn’t reach AI ({pack.msg}). Try again shortly.
          </p>
        )}
      </div>

      {history.length > 0 && (
        <div className={styles.historyBox}>
          <h2 className={styles.packTitle}>Recent rolls</h2>
          <ul className={styles.history}>
            {history.map((h, i) => (
              <li key={i}>{rollToText(h)}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function Die({
  glyph,
  label,
  caption,
  rolling,
}: {
  glyph: string
  label: string
  caption?: string
  rolling?: boolean
}) {
  return (
    <figure className={`${styles.die} ${rolling ? styles.dieRolling : styles.dieSettled}`}>
      <span className={styles.dieCat}>{label}</span>
      <span className={styles.dieGlyph} aria-hidden="true">
        {glyph}
      </span>
      {caption && <figcaption className={styles.dieCaption}>{caption}</figcaption>}
    </figure>
  )
}

function PackForm({
  status,
  onGenerate,
}: {
  status: AiState['status']
  onGenerate: (theme: string) => void
}) {
  const [theme, setTheme] = useState('')
  return (
    <form
      className={styles.packForm}
      onSubmit={(e) => {
        e.preventDefault()
        onGenerate(theme)
      }}
    >
      <input
        className={styles.packInput}
        placeholder="Theme (optional): heist, grief, first contact…"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        aria-label="Prompt pack theme"
      />
      <button className={styles.aiBtn} type="submit" disabled={status === 'thinking'}>
        {status === 'thinking' ? 'Brewing…' : 'Generate 5'}
      </button>
    </form>
  )
}
