# Implementation Spec — Migrate Portfolio to Astro + Tailwind + TypeScript

> Coder: implement exactly what is below. Do not invent features. All paths are absolute
> from the project root: `/Users/rein/Desktop/Claude Projects/Cursor Project/Honey Web Portfolio`.
> Where the draft plan (`_plan/stack-migration.md`) conflicts with this spec, **this spec wins**.
> Corrections to the draft are called out inline with **[CORRECTION]**.

---

## OPEN QUESTIONS

None block implementation. Decisions made where the draft was silent or wrong:

- **Deploy adapter (draft Phase 6 "vercel or netlify, user's choice").** Decision: **add no adapter.**
  Use pure static output (`output: 'static'`, default). Adapters are unnecessary for a static
  portfolio and the request does not name a host. Do not install `@astrojs/vercel` or `@astrojs/netlify`.
- **Tailwind integration method.** Decision: use the **official Vite plugin `@tailwindcss/vite` (Tailwind v4)**,
  not the deprecated `@astrojs/tailwind` integration and not a `tailwind.config.js` PostCSS pipeline.
  Tailwind v4 is config-via-CSS. **[CORRECTION]** The draft's `tailwind.config.mjs` (a v3 JS config) is
  outdated; honey tokens are defined in `global.css` with `@theme` instead. A `tailwind.config.mjs` file
  is still produced (see A4) but only as a thin `content` shim — the source of truth for tokens is
  `@theme` in CSS. If the coder's installed Astro pins Tailwind v3, fall back to the v3 path documented
  in the "Tailwind v3 fallback" note in A4. Default to v4.
- **Astro version.** Decision: pin to `astro@^5`. **[CORRECTION]** Do not run `npm create astro@latest`
  interactively (cannot run in a pipeline). Scaffold files by hand, then `npm install`.
- **Copy/content.** Decision: preserve all current placeholder copy verbatim ("Your Name",
  "Web Developer & Designer", the three placeholder projects, the bio paragraphs, year 2026, the
  `reinvesting1012026@gmail.com` email, `#` social links). The request is a stack migration, not a
  content rewrite.

---

## High-level sequencing (follow in order)

1. Create config + scaffold files (Section A).
2. `npm install`.
3. Create `src/` tree: styles, data, layout, components, page (Sections B–F).
4. Update `.gitignore` (Section G).
5. `npm run build` and confirm `dist/index.html` is produced (Section I, steps 1–4).
6. **Only after the build is confirmed working**, delete the legacy files:
   `index.html`, `css/style.css`, `js/main.js` (and the now-empty `css/` and `js/` dirs).
   **[CORRECTION]** The draft lists these as "Removed" but does not sequence the deletion after a
   green build — delete them last.
7. Replace `.pipeline/test.js` with the new suite (Section H), run it against `dist/`.
8. Update `README.md` (Section J).

---

## A. Config & scaffold files (create first)

### A1. `/package.json`
**[CORRECTION]** Created by hand (no interactive scaffold).

```json
{
  "name": "honey-web-portfolio",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "test": "node .pipeline/test.js"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

### A2. `/astro.config.mjs`
```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static output (default). No deploy adapter — pure static site.
export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### A3. `/tsconfig.json`
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

### A4. `/tailwind.config.mjs`
**[CORRECTION]** Under Tailwind v4 the color tokens live in `@theme` (Section B1), so this file is a thin
shim only. Keep it minimal so the file exists (the draft demanded it) without duplicating the source of truth:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
};
```

> **Tailwind v3 fallback (only if `npm install` resolves tailwindcss to v3.x):**
> Use the `@astrojs/tailwind` integration instead of `@tailwindcss/vite`, move the honey palette into
> `theme.extend.colors.honey` in this file (keys: `bg`, `surface`, `text`, `muted`, `accent`,
> `accentDark`), and make `global.css` start with `@tailwind base; @tailwind components; @tailwind
> utilities;` instead of `@import "tailwindcss";` and drop the `@theme` block. Default path is v4 — only
> fall back if install forces it.

---

## B. Styles

### B1. `/src/styles/global.css`
This file (a) imports Tailwind, (b) defines the honey theme tokens via `@theme`, (c) keeps the small
set of global rules that are awkward as utilities. Tailwind v4 import-first syntax:

```css
@import "tailwindcss";

/* Honey / amber theme tokens — exposes utilities like bg-honey-bg, text-honey-text, etc. */
@theme {
  --color-honey-bg: #fffdf7;
  --color-honey-surface: #ffffff;
  --color-honey-text: #2b2218;
  --color-honey-muted: #6b5d4a;
  --color-honey-accent: #f4a823;
  --color-honey-accent-dark: #d98b0c;
  --font-poppins: "Poppins", system-ui, -apple-system, sans-serif;
}

/* Global rules kept verbatim (not expressible cleanly as utilities) */
html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-poppins);
  background-color: var(--color-honey-bg);
  color: var(--color-honey-text);
  line-height: 1.7;
}

/* Fixed navbar offset so anchored section headings aren't hidden. 64px = navbar height. */
section[id] {
  scroll-margin-top: 64px;
}

/* Accessible keyboard focus ring */
:focus-visible {
  outline: 3px solid var(--color-honey-accent);
  outline-offset: 3px;
  border-radius: 4px;
}

/* Contact form status colors (referenced by JS in Contact.astro) */
.form-status.success {
  color: #2d7a2d;
}
.form-status.error {
  color: #c0392b;
}
```

Rules from the old CSS that become Tailwind utilities (do **not** put in global.css): box-sizing reset
(Tailwind preflight handles it), `ul` list-reset, `a` colors, buttons, navbar layout, hero gradient,
grids, card hover. Express those inline in components.

> Reference palette for utility usage in components:
> bg `#fffdf7` → `bg-honey-bg` | surface `#ffffff` → `bg-honey-surface` | text `#2b2218` → `text-honey-text`
> | muted `#6b5d4a` → `text-honey-muted` | accent `#f4a823` → `honey-accent` | accent-dark `#d98b0c` → `honey-accent-dark`.

---

## C. Data layer (TypeScript)

### C1. `/src/data/skills.ts`
Preserve the exact 6 skills and order from the current HTML.

```ts
export interface Skill {
  name: string;
}

export const skills: Skill[] = [
  { name: "HTML5" },
  { name: "CSS3" },
  { name: "JavaScript" },
  { name: "Responsive Design" },
  { name: "Git" },
  { name: "Accessibility" },
];
```

### C2. `/src/data/projects.ts`
Preserve the exact 3 projects, titles, descriptions, and the placeholder `#` links.
`demoUrl`/`sourceUrl` default to `"#"` to match current placeholders.

```ts
export interface Project {
  title: string;
  description: string;
  demoUrl: string;
  sourceUrl: string;
}

export const projects: Project[] = [
  {
    title: "Project One",
    description:
      "A responsive web application that helps users manage their daily tasks with a clean, intuitive interface built with vanilla JS.",
    demoUrl: "#",
    sourceUrl: "#",
  },
  {
    title: "Project Two",
    description:
      "An accessible e-commerce landing page featuring smooth animations, a sticky navigation bar, and a mobile-first layout.",
    demoUrl: "#",
    sourceUrl: "#",
  },
  {
    title: "Project Three",
    description:
      "A personal blog theme with dark-mode support, typography-focused design, and zero JavaScript dependencies for core reading.",
    demoUrl: "#",
    sourceUrl: "#",
  },
];
```

---

## D. Layout

### D1. `/src/layouts/Layout.astro`
Owns `<html>`, `<head>`, `<body>`. Imports global stylesheet. Keeps Google Fonts (Poppins) preconnect +
stylesheet links exactly as the original. Single `<slot />` in `<body>`.

Frontmatter:
```astro
---
import "../styles/global.css";
interface Props {
  title?: string;
}
const { title = "Honey Web Portfolio" } = Astro.props;
---
```

`<head>` must contain (verbatim attributes preserved from `index.html`):
- `<meta charset="UTF-8" />`
- `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`
- `<title>{title}</title>`
- `<link rel="preconnect" href="https://fonts.googleapis.com" />`
- `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`
- `<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />`

`<html lang="en">`. **Do not** add a manual `<script src>` link — components carry their own colocated scripts.

---

## E. Components

All components live in `/src/components/`. Use Tailwind utilities to reproduce the existing visual design
(honey theme, mobile-first, 768px and 1024px breakpoints → Tailwind `md:` and `lg:`). A `.container`
equivalent = `mx-auto w-full max-w-[1100px] px-5`. Buttons reproduce `.btn` / `.btn-primary` /
`.btn-secondary`. Inline button utility strings are acceptable — do **not** create a Button component.

Per-component requirements:

### E1. `/src/components/Navbar.astro`
- Markup parity with original: `<header><nav class="navbar">…</nav></header>`.
- **Keep the `navbar`, `nav-toggle`, `nav-menu`, `nav-open` class names** even while adding Tailwind
  utilities, because the colocated script and CSS animation rely on them. Add the hamburger
  animation + mobile collapse CSS in a scoped `<style>` block here, ported from the original
  `.navbar.nav-open .nav-toggle span` rules and the `.nav-menu` `max-height` transition.
- Brand: `<a href="#home" class="navbar__brand">Honey</a>`.
- Toggle button: `<button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">` with exactly
  three child `<span></span>` bars.
- `<ul class="nav-menu">` with 5 links in order: `#home` Home, `#about` About, `#skills` Skills,
  `#projects` Projects, `#contact` Contact.
- **Colocated `<script>`** (runs in browser; plain TS/JS, no framework). Ports two behaviors from `main.js`:
  - **Nav toggle:** click on `.nav-toggle` toggles `nav-open` on `.navbar`; sets `aria-expanded` to
    `"true"`/`"false"` accordingly. Clicking any `.nav-menu a` removes `nav-open` and sets
    `aria-expanded="false"` (close-on-link-click). Use `openMenu`/`closeMenu` helpers mirroring the original.
  - **Active link on scroll:** guard with `if ('IntersectionObserver' in window)`. Observe
    `document.querySelectorAll('section[id]')` with `rootMargin: '0px 0px -60% 0px', threshold: 0`. On
    intersect, toggle `active` class on the matching `.nav-menu a[href="#<id>"]`. Style `.active` (and
    `:hover`) in the scoped `<style>` to match original accent coloring.
  - Edge cases: null-guard every queried element before use (script may run before/without some nodes).

### E2. `/src/components/Hero.astro`
- `<section id="home" class="hero">` — keep `id="home"` and `hero` class.
- `<h1>Your Name</h1>` (preserve placeholder text).
- `<p class="hero-subtitle">Web Developer &amp; Designer</p>` — keep `hero-subtitle` class (anchor/test).
- Two CTAs: primary `<a href="#projects">View My Work</a>`, secondary `<a href="#contact">Contact Me</a>`.
- Reproduce the hero gradient + min-h-screen + centered layout via utilities or a scoped `<style>`.
- This is the page's only `<h1>`.

### E3. `/src/components/About.astro`
- `<section id="about" class="about">`, `<h2>About Me</h2>`, two `<p>` paragraphs (verbatim text from
  current `index.html`, lines 65–75).

### E4. `/src/components/SkillCard.astro`
- `Props { name: string }`.
- Renders `<li class="skill-card">{name}</li>` styled to match original skill card (surface bg, radius,
  shadow, hover lift).

### E5. `/src/components/Skills.astro`
- `<section id="skills" class="skills">`, `<h2>Skills</h2>`.
- `<ul class="skills-grid">` mapping `skills` from `/src/data/skills.ts` → `<SkillCard name={...} />`.
- Grid: 2 cols mobile, 3 cols `md:`, auto-fit `lg:` — match original responsive grid.

### E6. `/src/components/ProjectCard.astro`
- `Props { title: string; description: string; demoUrl: string; sourceUrl: string }`.
- Renders `<article class="project-card">` with `<h3>{title}</h3>`, `<p>{description}</p>`, and a
  `<div class="project-links">` containing primary `<a href={demoUrl}>Live Demo</a>` and secondary
  `<a href={sourceUrl}>Source</a>`.

### E7. `/src/components/Projects.astro`
- `<section id="projects" class="projects">`, `<h2>Projects</h2>`.
- `<div class="projects-grid">` mapping `projects` from `/src/data/projects.ts` →
  `<ProjectCard {...project} />`.
- Grid: 1 col mobile, 2 cols `md:`, auto-fit `minmax(300px,1fr)` `lg:`.

### E8. `/src/components/Contact.astro`
- `<section id="contact" class="contact">`, `<h2>Contact</h2>`.
- Form, attributes verbatim: `<form id="contact-form" novalidate>`.
  - Name: `<label for="name">Name</label>` + `<input type="text" id="name" name="name" required autocomplete="name" />`
  - Email: `<label for="email">Email</label>` + `<input type="email" id="email" name="email" required autocomplete="email" />`
  - Message: `<label for="message">Message</label>` + `<textarea id="message" name="message" rows="5" required></textarea>`
  - Submit: `<button type="submit" class="btn btn-primary">Send Message</button>`
  - Status: `<p class="form-status" role="status" aria-live="polite"></p>` (empty on load).
- Social block: `<div class="contact__social">` with `<a href="mailto:reinvesting1012026@gmail.com">reinvesting1012026@gmail.com</a>`
  and `<ul class="social-links">` with three `<li><a href="#">…</a></li>` items: GitHub, LinkedIn, Twitter / X.
- **Colocated `<script>`** porting form validation from `main.js` (sequential, client-only, no network):
  - `e.preventDefault()` on submit.
  - Read + `.trim()` name, email, message.
  - Empty name → status error `"Please enter your name."`, focus name, return.
  - Empty email → `"Please enter your email address."`, focus email, return.
  - Email failing regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` → `"Please enter a valid email address (e.g. you@example.com)."`, focus email, return.
  - Empty message → `"Please enter a message."`, focus message, return.
  - All valid → status success `"Thanks! Your message has been received."`, then `form.reset()`.
  - `setStatus(message, type)` sets `textContent`, then `classList.remove('success','error')` then
    `classList.add(type)`.
  - Null-guard form + status element.

### E9. `/src/components/Footer.astro`
- `<footer>` with `<p>&copy; 2026 Your Name. All rights reserved.</p>` (keep static year 2026).

---

## F. Page

### F1. `/src/pages/index.astro`
```astro
---
import Layout from "../layouts/Layout.astro";
import Navbar from "../components/Navbar.astro";
import Hero from "../components/Hero.astro";
import About from "../components/About.astro";
import Skills from "../components/Skills.astro";
import Projects from "../components/Projects.astro";
import Contact from "../components/Contact.astro";
import Footer from "../components/Footer.astro";
---
<Layout>
  <Navbar />
  <Hero />
  <About />
  <Skills />
  <Projects />
  <Contact />
  <Footer />
</Layout>
```
Order must match original section order: home, about, skills, projects, contact, footer.

---

## G. `.gitignore` additions
**[CORRECTION]** The draft omitted concrete entries. Append to `/.gitignore` (keep the existing
`.claude/settings.local.json` line):
```
# build output / deps
dist/
node_modules/
.astro/
```

---

## H. Test strategy

**[CORRECTION]** The existing `/.pipeline/test.js` is invalid post-migration: it reads `index.html`,
`css/style.css`, `js/main.js` (deleted), asserts CSS `:root` custom properties (now `@theme`), asserts an
IIFE in `main.js` (now colocated component scripts), and asserts `href="css/style.css"` relative link
(Astro injects hashed `/_astro/*.css`). **Replace the file wholesale.**

Write a new `/.pipeline/test.js` (Node, no browser, no deps) that:
- Runs via `node .pipeline/test.js` and exits non-zero on any failure (keep the existing pass/fail
  harness + reporter — old file lines ~20–52 and ~606–624 are reusable as-is).
- **Requires a prior build.** At top: assert `dist/index.html` exists; if missing, fail with a clear
  message instructing `npm run build` first. Read
  `const html = fs.readFileSync(path.join(ROOT, 'dist/index.html'), 'utf8')`.
- Also read source files for behavior assertions that get stripped/minified in `dist`:
  `src/components/Navbar.astro`, `src/components/Contact.astro`, `src/data/skills.ts`, `src/data/projects.ts`.

Tests to KEEP (retargeted to `dist/index.html` unless noted):
- DOCTYPE, `<html lang="en">`, charset UTF-8, viewport meta.
- All 5 `<section id>`s (home/about/skills/projects/contact), `<footer>`, exactly one `<h1>`.
- `<h2>` About Me / Skills / Projects / Contact present.
- Nav: `navbar` class present; `nav-menu` links to all 5 anchors; toggle button with
  `aria-label="Toggle menu"`, `aria-expanded="false"`, and 3 `<span>` bars.
- Hero `.hero-subtitle`; "View My Work" → `#projects`; "Contact Me" → `#contact`.
- Skills: exactly 6 `.skill-card` items; all 6 skill names present.
- Projects: exactly 3 `.project-card` articles; 3 `<h3>`; 3 `.project-links`; "Live Demo" + "Source".
- Contact form: `id="contact-form"` + `novalidate`; name/email/message inputs with correct types + `required`;
  submit "Send Message"; `.form-status` with `role="status"` aria-live, empty on load; labels for name/email/message.
- Email placeholder `reinvesting1012026@gmail.com` + `mailto:` link; social links use `href="#"`.
- Footer contains `2026`.
- Email regex unit tests (the valid/invalid arrays — old file lines ~561–588) — **keep verbatim**.

Tests to ADD (run against component source, since Astro strips comments/structure differently):
- `Navbar.astro` script: references `nav-open` add+remove, sets `aria-expanded` `"true"` and `"false"`,
  guards `'IntersectionObserver' in window`, queries `section[id]`, has `rootMargin`.
- `Contact.astro` script: listens for `submit`, calls `preventDefault`, uses regex
  `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` (or an `emailRegex` const), calls `.trim()`, success string
  `"Thanks! Your message has been received."`, calls `.reset()`.
- `skills.ts` contains all 6 skill names; `projects.ts` contains all 3 project titles (read text, assert
  names/titles present — `require` does not work on `.ts`).

Tests to REMOVE (no longer meaningful):
- Any reading `css/style.css` or `js/main.js` directly.
- CSS `:root` custom-property value assertions, `.btn`/`.navbar`/grid CSS-rule assertions,
  `@media` breakpoint assertions (these now live in Tailwind/scoped styles and are not the contract).
- The relative `href="css/style.css"` / `src="js/main.js"` path assertions and the
  "no absolute `/css` `/js`" assertion (Astro emits hashed `/_astro/*` paths by design).
- The "TODO: replace placeholder" comment assertion (Astro strips HTML comments from `dist`).
- The IIFE / `'use strict'` assertions (component scripts are ES modules, not an IIFE).

The new suite must exit 0 on a correct implementation.

---

## I. Verification steps (corrected)

1. `npm install` completes without errors.
2. `npm run dev` → site served at `http://localhost:4321`. All 6 sections render, honey theme intact,
   Poppins font loads. Mobile nav toggle opens/closes and `aria-expanded` flips. Active nav link
   highlights on scroll. Contact form validates sequentially, shows success, resets.
3. `npm run build` → `dist/` is generated and `dist/index.html` exists. No framework JS runtime ships;
   only the small colocated scripts for Navbar + Contact are emitted (expected — vanilla, no framework).
4. **[CORRECTION]** **Do NOT open `dist/index.html` via `file://`.** Astro emits absolute asset paths
   (`/_astro/...`), so `file://` will 404 the CSS/JS. Preview with a local server instead:
   `npm run preview` → open the printed URL (defaults to `http://localhost:4321`) and confirm the page.
   (If `file://` preview is ever truly required, set `build.assetsPrefix` or a relative `base` in
   `astro.config.mjs` — not needed for this task; documented only.)
5. **Only after steps 1–4 pass**, delete legacy files: `index.html`, `css/style.css`, `js/main.js`, and
   remove the now-empty `css/` and `js/` directories.
6. Run `npm test` (`node .pipeline/test.js`) against the fresh `dist/index.html` — all tests pass, exit 0.

---

## J. README.md
Update `/README.md` to document the new stack and commands: `npm install`, `npm run dev` (localhost:4321),
`npm run build` (outputs `dist/`), `npm run preview`, `npm test`. Note that the site is static (no adapter)
and that previewing the build requires a server (`npm run preview`), not `file://`.

---

## Files summary

**Create (in order):** `/package.json`, `/astro.config.mjs`, `/tsconfig.json`, `/tailwind.config.mjs`,
`/src/styles/global.css`, `/src/data/skills.ts`, `/src/data/projects.ts`, `/src/layouts/Layout.astro`,
`/src/components/Navbar.astro`, `/src/components/Hero.astro`, `/src/components/About.astro`,
`/src/components/SkillCard.astro`, `/src/components/Skills.astro`, `/src/components/ProjectCard.astro`,
`/src/components/Projects.astro`, `/src/components/Contact.astro`, `/src/components/Footer.astro`,
`/src/pages/index.astro`.

**Modify:** `/.gitignore`, `/.pipeline/test.js` (full replace), `/README.md`.

**Delete (last, after green build):** `/index.html`, `/css/style.css`, `/js/main.js`, and the empty
`/css/` and `/js/` directories.
