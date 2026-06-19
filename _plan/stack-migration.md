# Plan: Portfolio Website Stack Migration

## Context

The current portfolio is plain HTML/CSS/JS — no build tools, no framework, no npm. It works and is accessible, but it has real limitations: no component reuse (copy-paste to add projects), no hot reload during development, no TypeScript safety, limited animation capability, and no easy path to add a blog or CMS later. The goal is to migrate to a modern stack that removes these friction points without over-engineering a portfolio site.

---

## Stack Research & Recommendation

### Options Evaluated

| Stack | Pros | Cons |
|---|---|---|
| **Vanilla HTML/CSS/JS** (current) | Zero deps, opens via file:// | No DX, no reuse, no build pipeline |
| **Next.js + Tailwind** | Huge ecosystem, React, Vercel-native | Overkill for static portfolio; heavy runtime |
| **Nuxt.js + Tailwind** | Vue-based, good SSG | Less popular for portfolios; larger bundle |
| **SvelteKit + Tailwind** | Tiny output, great DX | Smaller ecosystem; still more than needed |
| **Astro + Tailwind + TypeScript** | Purpose-built for content sites, zero JS by default, islands architecture | Newer, smaller community than Next.js |

### Recommended Stack: **Astro + Tailwind CSS + TypeScript**

#### Why Astro beats the alternatives for a portfolio

1. **Zero JS by default.** Astro ships HTML-only unless you explicitly opt a component into the client. The current site ships 137 lines of vanilla JS — Astro would ship 0 until you need interactivity. Lighthouse scores will be higher out of the box.

2. **Purpose-built for content/portfolio sites.** Next.js, Nuxt, and SvelteKit are app frameworks that happen to support static output. Astro is a *content* framework — its design center is exactly this use case. Less config to fight.

3. **Islands architecture.** If you later want a React or Svelte animation component, you drop it in with `client:load`. You don't have to commit the whole site to a single framework.

4. **Component reuse now.** Project cards, skill cards, and nav can be `.astro` components. Adding a new project means editing one file, not copy-pasting HTML.

5. **TypeScript out of the box.** Astro's tooling is TypeScript-first with zero config. The current site has no type safety at all.

6. **Built-in Markdown/MDX support.** Trivial to add a blog or case studies later without a CMS.

7. **Vite under the hood.** Instant hot module replacement during development. No more manual refresh.

8. **Deploy anywhere.** Vercel, Netlify, GitHub Pages — all first-class with official adapters.

#### Why not Next.js?
Next.js is a great framework, but it carries React hydration overhead on every page, requires more configuration for purely static output, and is designed for apps with dynamic data fetching — none of which applies here. It's the right tool for a SaaS dashboard, not a portfolio.

#### Why not SvelteKit?
Very close second. SvelteKit produces smaller bundles than Next.js and has excellent DX. But Astro's zero-JS default and native `.astro` component format (which reads like enhanced HTML, easy to onboard) make it a better fit for a mostly-static site.

---

## Implementation Plan

### Phase 1 — Project Bootstrap
- `npm create astro@latest` inside the project directory with:
  - Template: `Empty`
  - TypeScript: `Strict`
  - Install deps: yes
- Add Tailwind CSS via `npx astro add tailwind`
- Configure `tailwind.config.mjs` with the existing honey/amber color tokens as a custom palette:
  - `honey.bg: #fffdf7`, `honey.surface: #ffffff`, `honey.text: #2b2218`
  - `honey.muted: #6b5d4a`, `honey.accent: #f4a823`, `honey.accentDark: #d98b0c`

### Phase 2 — Component Architecture
Convert current flat HTML into reusable Astro components:

```
src/
├── layouts/
│   └── Layout.astro          # <html>, <head> (meta, fonts), <body>
├── components/
│   ├── Navbar.astro           # Fixed nav + mobile toggle
│   ├── Hero.astro             # Hero section
│   ├── About.astro            # About section
│   ├── Skills.astro           # Skills grid + SkillCard.astro
│   ├── Projects.astro         # Projects grid + ProjectCard.astro
│   ├── Contact.astro          # Form + social links
│   └── Footer.astro           # Footer
└── pages/
    └── index.astro            # Composes all sections
```

### Phase 3 — Data Layer
Extract hardcoded content into typed data files:
- `src/data/projects.ts` — array of `{ title, description, demoUrl, sourceUrl }`
- `src/data/skills.ts` — array of `{ name, icon? }`

`ProjectCard.astro` and `SkillCard.astro` accept props typed with these interfaces. Adding a new project = one line in `projects.ts`.

### Phase 4 — Styles Migration
- Replace `css/style.css` custom properties with Tailwind config tokens
- Use Tailwind utility classes in components (no separate CSS file needed for most things)
- Keep a minimal `src/styles/global.css` for: `scroll-behavior: smooth`, `scroll-margin-top` on sections, `:focus-visible` outline, and the form status color classes

### Phase 5 — JavaScript Migration
Current `main.js` has three behaviors. In Astro:
- **Nav toggle** — inline `<script>` in `Navbar.astro` (same logic, scoped)
- **Form validation** — inline `<script>` in `Contact.astro`
- **Active nav on scroll** — inline `<script>` in `Navbar.astro` alongside toggle

No framework runtime needed — same vanilla JS, just colocated with the component.

### Phase 6 — Build & Deploy Config
- `astro.config.mjs`: set `output: 'static'` for pure static output
- Add `vercel` or `netlify` adapter (user's choice)
- Update `README.md` with `npm run dev` / `npm run build` instructions
- Keep `.gitignore` updated (`node_modules/`, `dist/`)

---

## Files Modified / Created

| Action | Path |
|---|---|
| **Created** | `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `package.json` |
| **Created** | `src/layouts/Layout.astro` |
| **Created** | `src/components/*.astro` (7 components) |
| **Created** | `src/data/projects.ts`, `src/data/skills.ts` |
| **Created** | `src/styles/global.css` |
| **Created** | `src/pages/index.astro` |
| **Removed** | `index.html`, `css/style.css`, `js/main.js` |

---

## Verification

1. `npm run dev` → opens `localhost:4321`, all 6 sections visible, honey theme intact
2. Mobile nav toggle opens/closes, `aria-expanded` flips
3. Contact form validates fields in sequence, shows success message, resets
4. Active nav link highlights on scroll
5. `npm run build` → `dist/` folder with static HTML, no JS bundle unless components use `client:*`
6. Open `dist/index.html` directly in browser — should still work via `file://`
7. Run updated `.pipeline/test.js` against `dist/index.html` — all structural tests pass
