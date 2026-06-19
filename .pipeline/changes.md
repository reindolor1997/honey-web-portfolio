# Implementation Changes

## Files Created

### index.html
Single-page HTML5 document. Sections in order: fixed navbar header, hero, about,
skills, projects, contact, footer.

Key details:
- Google Fonts (Poppins) loaded via `<link>` in `<head>`.
- `js/main.js` loaded with `defer` in `<head>` (all paths relative so file:// works).
- Nav toggle button carries `aria-label="Toggle menu"` and `aria-expanded="false"` (JS flips it).
- Every form input has a matching `<label for>` to satisfy accessibility requirements.
- `<form id="contact-form" novalidate>` — browser native validation disabled; JS handles it.
- `<p class="form-status" role="status" aria-live="polite">` is present but empty on load.
- All placeholder text and links marked with `<!-- TODO: replace placeholder -->` comments.
- Email placeholder uses `reinvesting1012026@gmail.com` per spec open-question resolution.
- Social link hrefs are `#` placeholders; project Live Demo / Source hrefs are `#` placeholders.
- Footer year is static "2026".

### css/style.css
Mobile-first stylesheet with a single `@media (min-width: 768px)` breakpoint and a
`@media (min-width: 1024px)` breakpoint for wider grid layouts.

Key details:
- All nine CSS custom properties defined in `:root` exactly as spec prescribes.
- `* { box-sizing: border-box; }` and `body { margin: 0; }` reset applied.
- `html { scroll-behavior: smooth; }` set.
- `--navbar-height: 64px` custom property used consistently for navbar height,
  `padding-top` on the hero, and `scroll-margin-top` on all sections (prevents
  fixed nav from covering headings on anchor navigation).
- `.container` centered with `max-width: var(--max-width)` and `margin-inline: auto`.
- `.btn`, `.btn-primary`, `.btn-secondary` defined with hover lift transition.
- `.nav-menu` collapses via `max-height: 0 / overflow: hidden` on mobile; expands
  when `.navbar` has class `nav-open`. Toggle button animates to X shape.
- On desktop (768px+) the toggle is `display: none` and `.nav-menu` is a horizontal
  flex row.
- `.skills-grid` and `.projects-grid` use CSS Grid with `auto-fit / minmax` at
  wider breakpoints; single/two-column on mobile.
- `.skill-card` and `.project-card` have surface background, `--radius`, `--shadow`,
  and a `translateY` hover-lift transition.
- `:focus-visible` outline set to `3px solid var(--color-accent)` for keyboard users.
- `.form-status.success` → green text; `.form-status.error` → red text.

### js/main.js
Plain IIFE, no modules, no dependencies. All behavior wrapped in strict mode.

Behavior 1 — Mobile nav toggle:
- Queries `.nav-toggle` and `.navbar`.
- Click toggles class `nav-open` on the navbar and flips `aria-expanded` on the
  button between "true" / "false".
- Each `.nav-menu a` click calls `closeMenu()`.

Behavior 2 — Contact form validation:
- Listens for `submit` on `#contact-form`, calls `e.preventDefault()`.
- Validates name (non-empty trimmed), email (regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`),
  message (non-empty trimmed) in sequence; each failure sets an error message and
  focuses the offending field.
- Each submit unconditionally calls `formStatus.classList.remove('success', 'error')`
  before adding the new class, preventing stacking.
- On success: sets text to "Thanks! Your message has been received.", adds `.success`,
  calls `form.reset()`.

Behavior 3 — Active nav link on scroll:
- Guarded by `if ('IntersectionObserver' in window)` so missing-browser support
  degrades silently.
- Observes all `section[id]` elements with `rootMargin: '0px 0px -60% 0px'` so
  the active link updates when a section reaches the top portion of the viewport.
- On intersection: removes `active` from all nav links, adds it to the matching one.

## Tester Focus Areas

1. **Anchor navigation** — Click each nav link and verify the section heading is
   fully visible below the fixed navbar (scroll-margin-top must be working).
2. **Mobile nav** — Resize to < 768 px. Toggle must open/close, X animation must
   play, clicking a link must close the menu before the target section scrolls into view.
3. **Form validation edge cases**:
   - Whitespace-only name, email, or message must be rejected.
   - Malformed emails ("noDomain", "no@dot", "@start.com") must fail.
   - Valid submission must clear the form and show success text; a second submission
     after clearing must re-validate (not duplicate the status text).
4. **Keyboard-only navigation** — Tab through nav links, buttons, and form fields.
   Each must show the amber focus outline.
5. **file:// protocol** — Open index.html by double-click (not a dev server). Font,
   stylesheet, and script must all load (all paths are relative).
6. **IntersectionObserver fallback** — Simulate unavailability by temporarily
   deleting `window.IntersectionObserver` in DevTools; the page must still load and
   function with no console errors.
