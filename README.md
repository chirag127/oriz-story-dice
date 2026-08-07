# oriz Play

- **Live app:** https://play.oriz.in
- **About / info:** https://chirag127.github.io/oriz-play/
- **llms.txt:** https://play.oriz.in/llms.txt

Creative-play studio: roll **story dice**, spin a **writing-prompt roller**, play **would-you-rather** and **this-or-that** — then expand any roll into a story seed with AI, and share the result by link.

**100% client-side, no upload, no signup, free.** Every roll runs in your browser. AI expansion is optional polish through a keyless multi-provider gateway; if it is down, the dice still roll.

## Features

- **Story Dice** — 1-9 categorized dice (Character, Setting, Object, Goal, Obstacle, Mood, Twist, Sense, Wildcard), physical 3D-ish CSS dice with a tumble-and-settle animation.
- **Prompt Roller** — recombines fragments into a one-line writing prompt.
- **Would You Rather** — impossible dilemmas.
- **This or That** — quickfire picks.
- **Expand with AI** — fuses any roll into a vivid story opening.
- **Fresh prompt pack** — generate five new prompts on any theme.
- **Share** — copy the result text or a compressed permalink (`#r=...` via LZ-string) that reconstructs the exact roll.
- **Recent rolls** history, keyboard-accessible, reduced-motion aware, WCAG-AA contrast.

## Tech

Static Astro (`output: 'static'`) + React 19 islands + Tailwind v4. Shared atomic packages: `@chirag127/oz-ai` (AI, g4f failover), `@chirag127/oz-tokens-base` (token contract), `@chirag127/oz-chrome` (header/footer shell), `@chirag127/oz-file`. Randomness via Web Crypto with a `Math.random` fallback; share codec via `lz-string`. Installable PWA. AI libs load only when you trigger a feature.

## Develop

```bash
npm install --legacy-peer-deps
npm run dev      # local
npm run test     # vitest - pure roll/codec logic
npm run build    # static dist/
npm run deploy   # Cloudflare Pages (project oriz-play)
```

Windows: use **npm** (pnpm skips `@esbuild/win32-x64`).

## Privacy

No backend, no API keys, no analytics. Shared links encode only the roll in the URL fragment — never sent to any server.

## License

MIT (c) 2026 Chirag Singhal
