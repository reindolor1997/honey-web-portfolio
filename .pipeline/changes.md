# Migration Changes — Honey Web Portfolio (Astro + Tailwind v4 + TypeScript)

## Files Created

| File | Purpose |
|------|---------|
| `package.json` | Project manifest; defines `astro@^5` dependency, `@tailwindcss/vite` + `tailwindcss@^4` dev deps, and `dev/build/preview/test` scripts. |
| `astro.config.mjs` | Astro config — static output, Tailwind v4 via `@tailwindcss/vite` Vite plugin. No deploy adapter. |
| `tsconfig.json` | Extends `astro/tsconfigs/strict`; includes `.astro/types.d.ts`. |
| `tailwind.config.mjs` | Thin content-shim for Tailwind v4 (token source of truth lives in `@theme` in CSS). |
| `src/styles/global.css` | Imports Tailwind v4 (`@import "tailwindcss"`), defines honey palette via `@theme`, plus minimal global rules (scroll-behavior, body font/bg/color, scroll-margin-top, focus-visible ring, form-status colors). |
| `src/data/skills.ts` | TypeScript data — `Skill` interface + array of 6 skills (HTML5, CSS3, JavaScript, Responsive Design, Git, Accessibility). |
| `src/data/projects.ts` | TypeScript data — `Project` interface + array of 3 placeholder projects with `demoUrl`/`sourceUrl` defaulting to `"#"`. |
| `src/layouts/Layout.astro` | Root layout owning `<html lang="en">`, `<head>` (charset, viewport, title, Poppins preconnect + stylesheet), global CSS import, single `<slot />`. |
| `src/components/Navbar.astro` | Fixed navbar with hamburger toggle; keeps `navbar`/`nav-menu`/`nav-toggle`/`nav-open` class names; scoped `<style>` for mobile collapse animation; colocated `<script>` for toggle behavior, `aria-expanded` management, close-on-link-click, and IntersectionObserver active-link tracking. |
| `src/components/Hero.astro` | `<section id="home" class="hero">` with `<h1>Your Name</h1>`, `.hero-subtitle`, and two CTA anchors (`#projects`, `#contact`). |
| `src/components/About.astro` | `<section id="about">` with two placeholder `<p>` paragraphs verbatim from original. |
| `src/components/SkillCard.astro` | Renders `<li class="skill-card">` accepting `name` prop. |
| `src/components/Skills.astro` | `<section id="skills">` mapping `skills` data to `<SkillCard />`; responsive 2/3/auto-fit grid. |
| `src/components/ProjectCard.astro` | Renders `<article class="project-card">` with `<h3>`, `<p>`, and `.project-links` (Live Demo + Source anchors). |
| `src/components/Projects.astro` | `<section id="projects">` mapping `projects` data to `<ProjectCard />`; responsive 1/2/auto-fit grid. |
| `src/components/Contact.astro` | `<section id="contact">` with `<form id="contact-form" novalidate>` (name/email/message/submit/form-status), social block with mailto link and `href="#"` GitHub/LinkedIn/Twitter placeholders, colocated `<script>` for sequential form validation with `setStatus()` helper. |
| `src/components/Footer.astro` | `<footer>` with static copyright line `2026 Your Name`. |
| `src/pages/index.astro` | Sole page — imports Layout + all 7 components in section order (Navbar, Hero, About, Skills, Projects, Contact, Footer). |

## Files Modified

| File | Change |
|------|--------|
| `.gitignore` | Added `dist/`, `node_modules/`, `.astro/` entries beneath the existing `.claude/settings.local.json` line. |
| `.pipeline/test.js` | Full replacement. Removed all assertions against deleted legacy files (`css/style.css`, `js/main.js`). Removed CSS `:root` custom-property assertions, CSS rule/grid/breakpoint assertions, IIFE/`'use strict'` assertions, relative asset path assertions (`href="css/style.css"`, `src="js/main.js"`), and TODO comment assertion (Astro strips HTML comments from `dist/`). Added build guard (exits with error if `dist/index.html` missing). Retargeted all HTML tests to `dist/index.html`. Added source-file behavior tests against `Navbar.astro` (nav-open add/remove, aria-expanded true/false, IntersectionObserver guard/section[id]/rootMargin) and `Contact.astro` (submit listener, preventDefault, email regex, .trim(), success string, .reset()). Added data integrity tests against `src/data/skills.ts` and `src/data/projects.ts`. Kept email regex unit-test arrays verbatim. |

## Files Deleted

| File | Reason |
|------|--------|
| `index.html` | Replaced by Astro build output at `dist/index.html`. |
| `css/style.css` | Styles migrated to `src/styles/global.css` (Tailwind v4 `@theme`) and Tailwind utilities inline in components. |
| `css/` (directory) | Empty after `style.css` removal. |
| `js/main.js` | Behavior migrated to colocated `<script>` blocks in `Navbar.astro` (toggle + scroll spy) and `Contact.astro` (form validation). |
| `js/` (directory) | Empty after `main.js` removal. |

## Tester Focus Areas

1. **`dist/index.html` structure** — all five `section[id]` values, exactly one `<h1>`, exactly 6 `.skill-card` items, exactly 3 `.project-card` articles, `form-status` empty on load.
2. **Nav toggle markup** — `aria-expanded="false"` on load, exactly 3 `<span>` bars inside `.nav-toggle`.
3. **Hero CTAs** — `href="#projects"` on "View My Work", `href="#contact"` on "Contact Me".
4. **Contact form** — `novalidate` attribute present, all three inputs have `required`, submit button text is matched with surrounding whitespace (`\s*Send Message\s*`) because Astro emits a newline inside the button element.
5. **Source behavior tests** — read `.astro` component source files directly, resilient to Astro's inline-script minification. If a component script is refactored, update these tests.
6. **Email regex unit tests** — run entirely in Node; no browser needed.
7. **Build guard** — if `dist/` is missing or stale, the test runner exits early with a clear message instead of a cryptic read error.
8. **Preview, not file://** — Astro emits `/_astro/...` absolute asset paths. Always verify the build with `npm run preview`, not by opening `dist/index.html` directly in the browser.
