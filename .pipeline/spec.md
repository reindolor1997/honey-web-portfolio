# Implementation Spec: Honey Web Portfolio

## OPEN QUESTIONS

These do NOT block implementation. Where unanswered, use the placeholder values
listed and mark them in the HTML with an HTML comment `<!-- TODO: replace placeholder -->`
so they are easy to find and swap later.

1. **Owner identity** — Real name, job title/tagline, and bio copy are unknown.
   Use placeholder name "Your Name" and title "Web Developer & Designer".
2. **Contact details** — Real email, social links (GitHub, LinkedIn, etc.) unknown.
   Use `mailto:reinvesting1012026@gmail.com` for the email link and `#` for social URLs.
3. **Real projects** — Use three placeholder project cards with generic copy.
4. **Form backend** — There is no backend. The contact form must be handled
   client-side only (validate + show a success message). Do NOT post to a server.
5. **Brand color** — "Honey" theme implies an amber/gold palette. Use the palette
   defined in the CSS variables section below unless told otherwise.

---

## Overview

Build a single-page, statically-served portfolio website using plain HTML, CSS,
and vanilla JavaScript. No build step, no frameworks, no external runtime
dependencies. The page must open by double-clicking `index.html` (all asset paths
relative). One web font may be loaded from Google Fonts via `<link>`; otherwise no
external resources.

Sections, in order: hero/intro, about, skills, projects, contact. Plus a fixed
top navigation bar and a footer.

---

## Files to create

All paths are absolute.

1. `/Users/rein/Desktop/Claude Projects/Cursor Project/Honey Web Portfolio/index.html`
2. `/Users/rein/Desktop/Claude Projects/Cursor Project/Honey Web Portfolio/css/style.css`
3. `/Users/rein/Desktop/Claude Projects/Cursor Project/Honey Web Portfolio/js/main.js`

No other files. Do NOT modify README.md, .gitignore, or anything under .claude/ or .git/.

There is no existing code in this repo to copy patterns from. Follow the conventions
defined in this spec instead.

---

## File: index.html

Standard HTML5 document. `<html lang="en">`, UTF-8 charset, responsive viewport
meta tag. Link the stylesheet in `<head>` and load `js/main.js` with `defer` at the
end of `<head>` or before `</body>`.

### Required structure (in this order)

1. `<header>` containing `<nav class="navbar">`:
   - Brand/logo text on the left (the owner name or "Honey").
   - Nav links: Home, About, Skills, Projects, Contact — each an anchor to the
     matching section id (`#home`, `#about`, `#skills`, `#projects`, `#contact`).
   - A hamburger toggle button `<button class="nav-toggle" aria-label="Toggle menu" aria-expanded="false">`
     for mobile, with three `<span>` bars.
   - The link list is `<ul class="nav-menu">`.

2. `<section id="home" class="hero">`:
   - Heading `<h1>` with name, a `<p class="hero-subtitle">` tagline.
   - Two CTA buttons: "View My Work" (anchors to `#projects`) and
     "Contact Me" (anchors to `#contact`), classes `btn btn-primary` and `btn btn-secondary`.

3. `<section id="about" class="about">`:
   - `<h2>` section title "About Me".
   - One or two paragraphs of placeholder bio.

4. `<section id="skills" class="skills">`:
   - `<h2>` "Skills".
   - A `<ul class="skills-grid">` of skill items. Use these placeholders:
     HTML5, CSS3, JavaScript, Responsive Design, Git, Accessibility.
     Each item is `<li class="skill-card">SkillName</li>`.

5. `<section id="projects" class="projects">`:
   - `<h2>` "Projects".
   - A `<div class="projects-grid">` containing exactly three
     `<article class="project-card">`, each with:
     `<h3>` title, `<p>` description, and a `<div class="project-links">` with two
     links ("Live Demo" and "Source", both `href="#"` placeholders).

6. `<section id="contact" class="contact">`:
   - `<h2>` "Contact".
   - `<form id="contact-form" novalidate>` with:
     - `<input type="text" id="name" name="name" required>` (+ `<label>`)
     - `<input type="email" id="email" name="email" required>` (+ `<label>`)
     - `<textarea id="message" name="message" required>` (+ `<label>`)
     - `<button type="submit" class="btn btn-primary">Send Message</button>`
     - A `<p class="form-status" role="status" aria-live="polite"></p>` for feedback.
   - Below the form, a list of social links (`#` placeholders) and the email link.

7. `<footer>`: copyright line with the current year text (static "2026" is fine).

### Accessibility requirements
- Every form input has an associated `<label for>`.
- Section headings use a single `<h1>` (hero) then `<h2>` per section.
- Nav toggle button has `aria-label` and toggles `aria-expanded`.

---

## File: css/style.css

Single stylesheet. Mobile-first, then `@media (min-width: 768px)` for larger screens.

### CSS variables (define in `:root`) — Honey/amber theme
```
--color-bg: #fffdf7;
--color-surface: #ffffff;
--color-text: #2b2218;
--color-muted: #6b5d4a;
--color-accent: #f4a823;      /* honey gold */
--color-accent-dark: #d98b0c;
--max-width: 1100px;
--radius: 12px;
--shadow: 0 6px 20px rgba(0,0,0,0.08);
```

### Requirements
- `* { box-sizing: border-box; }`, reset default margin on body.
- One Google Font (e.g. Poppins or Inter) via `<link>` in HTML + `font-family` fallback to system sans-serif.
- `.navbar` is `position: fixed; top: 0`, full width, with the surface background and shadow; add top padding/`scroll-margin-top` to sections so fixed nav does not overlap anchored content.
- `html { scroll-behavior: smooth; }`.
- A reusable `.container` / section max-width wrapper centered with `--max-width`.
- `.btn` base style; `.btn-primary` filled accent, `.btn-secondary` outlined.
- `.skills-grid` and `.projects-grid` use CSS Grid: single column on mobile,
  multi-column (auto-fit, minmax) on desktop.
- `.project-card` and `.skill-card` use surface bg, radius, shadow, hover lift transition.
- Mobile nav: `.nav-menu` hidden/collapsed by default on mobile, shown when the
  navbar has class `nav-open` (toggled by JS). On desktop the menu is always a
  horizontal row and the toggle is hidden.
- Provide a visible `:focus-visible` outline using `--color-accent` for keyboard users.
- `.form-status` styling: a `.success` modifier (green text) and `.error` modifier (red text).

---

## File: js/main.js

Vanilla JS, no modules required (can be a plain script). Wrap in
`document.addEventListener('DOMContentLoaded', ...)` or rely on `defer`.

Implement exactly these behaviors:

1. **Mobile nav toggle**
   - Selector: `.nav-toggle` button and `.navbar`.
   - On click: toggle class `nav-open` on the navbar and flip the button's
     `aria-expanded` between `"true"`/`"false"`.
   - Clicking any `.nav-menu a` link closes the menu (remove `nav-open`, reset aria).

2. **Contact form validation** (client-side only, no network)
   - Listen for `submit` on `#contact-form`; call `e.preventDefault()`.
   - Validate: name non-empty (trimmed), email matches a simple regex
     `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, message non-empty (trimmed).
   - On any failure: set `.form-status` text to a clear message, add class `error`,
     remove class `success`. Do not clear the form.
   - On success: set `.form-status` text to
     "Thanks! Your message has been received." add class `success`, remove `error`,
     and reset the form with `form.reset()`.

3. **Active nav link on scroll** (progressive enhancement, optional-but-include)
   - Use `IntersectionObserver` over the five sections; add class `active` to the
     matching `.nav-menu a` when its section is in view, remove from others.
   - Must degrade gracefully: guard with `if ('IntersectionObserver' in window)`.

No other JS behavior. No analytics, no third-party scripts.

---

## Edge cases the implementation must handle

1. Opening `index.html` directly from the filesystem (file://) must work — use only
   relative asset paths, no absolute `/` paths.
2. Form submit with whitespace-only fields must be treated as empty (trim first).
3. Invalid email formats (missing `@`, missing domain dot) must fail validation.
4. Pressing the submit button repeatedly must not stack duplicate status text —
   each submit overwrites `.form-status` content and toggles the single active class.
5. Fixed navbar must not cover section headings when navigating via anchor links
   (handled via `scroll-margin-top` on sections).
6. Keyboard-only navigation: nav links, buttons, and form fields must be reachable
   and show a focus outline.
7. Mobile menu must close after a nav link is clicked so the target section is visible.
8. If `IntersectionObserver` is unavailable, the page must still function (no errors).

---

## Out of scope (do NOT build)

- No backend, no form email delivery, no database.
- No frameworks, bundlers, npm packages, or TypeScript.
- No additional pages or routing (single page only).
- No dark-mode toggle unless later requested.
- Do not invent real personal data; use the placeholders defined above.
