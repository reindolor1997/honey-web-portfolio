# Honey Web Portfolio

A single-page personal portfolio built with **Astro + Tailwind CSS v4 + TypeScript**.

## Stack

- [Astro](https://astro.build) — static site framework (zero JS shipped by default)
- [Tailwind CSS v4](https://tailwindcss.com) — utility-first styles via `@tailwindcss/vite`
- TypeScript — strict mode, typed component props and data files
- No deploy adapter — pure static output (`dist/`)

## Getting started

```bash
npm install
```

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server at `http://localhost:4321` |
| `npm run build` | Build static site to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run static test suite (requires a prior build) |

> **Note:** Open via `npm run preview`, not by double-clicking `dist/index.html`.
> Astro's build emits absolute `/_astro/` asset paths that don't resolve over `file://`.
