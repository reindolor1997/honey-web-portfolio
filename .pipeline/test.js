/**
 * Static test suite for Honey Web Portfolio
 * Runner: node (no browser required)
 *
 * Tests: HTML structure, CSS variables, JS syntax/logic, accessibility
 * attributes, placeholder TODOs, form attributes, email validation regex.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// ── helpers ──────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

let passed = 0;
let failed = 0;
const results = [];

function test(name, fn) {
  try {
    fn();
    results.push({ name, status: 'PASS', detail: null });
    passed++;
  } catch (err) {
    results.push({ name, status: 'FAIL', detail: err.message });
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertMatch(str, pattern, message) {
  if (!pattern.test(str)) throw new Error(message + ` (pattern: ${pattern})`);
}

function assertNotMatch(str, pattern, message) {
  if (pattern.test(str)) throw new Error(message + ` (pattern: ${pattern})`);
}

function assertCount(str, pattern, expectedCount, message) {
  const matches = str.match(pattern) || [];
  if (matches.length !== expectedCount) {
    throw new Error(`${message} — expected ${expectedCount}, got ${matches.length}`);
  }
}

// ── load source files ─────────────────────────────────────────────────────────

const html = read('index.html');
const css  = read('css/style.css');
const js   = read('js/main.js');

// ── FILE EXISTENCE ────────────────────────────────────────────────────────────

test('index.html exists and is non-empty', () => {
  assert(html.length > 100, 'index.html appears empty or too short');
});

test('css/style.css exists and is non-empty', () => {
  assert(css.length > 100, 'style.css appears empty or too short');
});

test('js/main.js exists and is non-empty', () => {
  assert(js.length > 100, 'main.js appears empty or too short');
});

// ── JS SYNTAX ────────────────────────────────────────────────────────────────

test('js/main.js has valid JavaScript syntax', () => {
  // vm.Script constructor throws a SyntaxError on bad syntax
  new vm.Script(js, { filename: 'main.js' });
});

// ── HTML — DOCTYPE / ROOT ─────────────────────────────────────────────────────

test('HTML: DOCTYPE html declared', () => {
  assertMatch(html, /<!DOCTYPE html>/i, 'Missing <!DOCTYPE html>');
});

test('HTML: <html lang="en"> set', () => {
  assertMatch(html, /<html[^>]+lang="en"/i, 'Missing lang="en" on <html>');
});

test('HTML: charset UTF-8 declared', () => {
  assertMatch(html, /<meta[^>]+charset=["']?UTF-8["']?/i, 'Missing UTF-8 charset meta');
});

test('HTML: responsive viewport meta present', () => {
  assertMatch(html, /<meta[^>]+name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i,
    'Missing responsive viewport meta tag');
});

// ── HTML — ASSET PATHS ────────────────────────────────────────────────────────

test('HTML: stylesheet loaded with relative path (css/style.css)', () => {
  assertMatch(html, /href=["']css\/style\.css["']/, 'Stylesheet not linked with relative path css/style.css');
});

test('HTML: main.js loaded with relative path and defer', () => {
  assertMatch(html, /src=["']js\/main\.js["'][^>]*defer|defer[^>]*src=["']js\/main\.js["']/,
    'main.js not loaded with relative path + defer attribute');
});

test('HTML: no absolute paths starting with / for local assets', () => {
  // Should not have href="/css or src="/js
  assertNotMatch(html, /(?:href|src)=["']\/(?:css|js)\//,
    'Found absolute-rooted path — page would break when opened via file://');
});

// ── HTML — STRUCTURE: SECTIONS ────────────────────────────────────────────────

test('HTML: <section id="home"> with class "hero" exists', () => {
  assertMatch(html, /<section[^>]+id=["']home["'][^>]*class=["'][^"']*hero[^"']*["']|<section[^>]+class=["'][^"']*hero[^"']*["'][^>]*id=["']home["']/,
    'Missing <section id="home" class="hero">');
});

test('HTML: <section id="about"> exists', () => {
  assertMatch(html, /<section[^>]+id=["']about["']/i, 'Missing <section id="about">');
});

test('HTML: <section id="skills"> exists', () => {
  assertMatch(html, /<section[^>]+id=["']skills["']/i, 'Missing <section id="skills">');
});

test('HTML: <section id="projects"> exists', () => {
  assertMatch(html, /<section[^>]+id=["']projects["']/i, 'Missing <section id="projects">');
});

test('HTML: <section id="contact"> exists', () => {
  assertMatch(html, /<section[^>]+id=["']contact["']/i, 'Missing <section id="contact">');
});

test('HTML: <footer> element exists', () => {
  assertMatch(html, /<footer[\s>]/, 'Missing <footer> element');
});

// ── HTML — HEADING HIERARCHY ───────────────────────────────────────────────────

test('HTML: exactly one <h1> on the page', () => {
  assertCount(html, /<h1[\s>]/gi, 1, 'Expected exactly one <h1> element');
});

test('HTML: <h2> "About Me" exists', () => {
  assertMatch(html, /<h2[^>]*>\s*About Me\s*<\/h2>/i, 'Missing <h2>About Me</h2>');
});

test('HTML: <h2> "Skills" exists', () => {
  assertMatch(html, /<h2[^>]*>\s*Skills\s*<\/h2>/i, 'Missing <h2>Skills</h2>');
});

test('HTML: <h2> "Projects" exists', () => {
  assertMatch(html, /<h2[^>]*>\s*Projects\s*<\/h2>/i, 'Missing <h2>Projects</h2>');
});

test('HTML: <h2> "Contact" exists', () => {
  assertMatch(html, /<h2[^>]*>\s*Contact\s*<\/h2>/i, 'Missing <h2>Contact</h2>');
});

// ── HTML — NAV ────────────────────────────────────────────────────────────────

test('HTML: <nav class="navbar"> inside <header>', () => {
  assertMatch(html, /<header[\s\S]*?<nav[^>]+class=["'][^"']*navbar[^"']*["']/,
    'Missing <nav class="navbar"> inside <header>');
});

test('HTML: nav contains link to #home', () => {
  assertMatch(html, /<ul[^>]*class=["'][^"']*nav-menu[^"']*["'][\s\S]*?href=["']#home["']/,
    'Nav menu missing link to #home');
});

test('HTML: nav contains link to #about', () => {
  assertMatch(html, /<ul[^>]*class=["'][^"']*nav-menu[^"']*["'][\s\S]*?href=["']#about["']/,
    'Nav menu missing link to #about');
});

test('HTML: nav contains link to #skills', () => {
  assertMatch(html, /<ul[^>]*class=["'][^"']*nav-menu[^"']*["'][\s\S]*?href=["']#skills["']/,
    'Nav menu missing link to #skills');
});

test('HTML: nav contains link to #projects', () => {
  assertMatch(html, /<ul[^>]*class=["'][^"']*nav-menu[^"']*["'][\s\S]*?href=["']#projects["']/,
    'Nav menu missing link to #projects');
});

test('HTML: nav contains link to #contact', () => {
  assertMatch(html, /<ul[^>]*class=["'][^"']*nav-menu[^"']*["'][\s\S]*?href=["']#contact["']/,
    'Nav menu missing link to #contact');
});

// ── HTML — ACCESSIBILITY: NAV TOGGLE ──────────────────────────────────────────

test('HTML: nav-toggle button has aria-label="Toggle menu"', () => {
  assertMatch(html, /<button[^>]+class=["'][^"']*nav-toggle[^"']*["'][^>]*aria-label=["']Toggle menu["']|<button[^>]+aria-label=["']Toggle menu["'][^>]*class=["'][^"']*nav-toggle[^"']*["']/,
    'nav-toggle button missing aria-label="Toggle menu"');
});

test('HTML: nav-toggle button has aria-expanded="false" on load', () => {
  assertMatch(html, /<button[^>]+class=["'][^"']*nav-toggle[^"']*["'][^>]*aria-expanded=["']false["']|<button[^>]+aria-expanded=["']false["'][^>]*class=["'][^"']*nav-toggle[^"']*["']/,
    'nav-toggle button missing aria-expanded="false"');
});

test('HTML: nav-toggle has three <span> bars', () => {
  // Find the button block and count spans inside it
  const toggleMatch = html.match(/<button[^>]*class=["'][^"']*nav-toggle[^"']*["'][^>]*>([\s\S]*?)<\/button>/);
  assert(toggleMatch, 'Could not find .nav-toggle button block');
  const spansInButton = (toggleMatch[1].match(/<span/g) || []).length;
  assert(spansInButton === 3, `Expected 3 <span> bars in nav-toggle, found ${spansInButton}`);
});

// ── HTML — HERO ───────────────────────────────────────────────────────────────

test('HTML: hero has .hero-subtitle paragraph', () => {
  assertMatch(html, /<p[^>]+class=["'][^"']*hero-subtitle[^"']*["']/, 'Missing <p class="hero-subtitle">');
});

test('HTML: CTA button "View My Work" links to #projects', () => {
  assertMatch(html, /href=["']#projects["'][^>]*>View My Work<\/a>|View My Work<\/a>[\s\S]{0,200}href=["']#projects["']/,
    '"View My Work" button does not link to #projects');
  // More precise: the anchor with btn-primary in hero points to #projects
  assertMatch(html, /href=["']#projects["'][^>]*class=["'][^"']*btn[^"']*["']|class=["'][^"']*btn[^"']*["'][^>]*href=["']#projects["']/,
    '"View My Work" btn missing href=#projects');
});

test('HTML: CTA button "Contact Me" links to #contact', () => {
  assertMatch(html, /href=["']#contact["'][^>]*>Contact Me<\/a>|>Contact Me<\/a>/,
    '"Contact Me" button does not link to #contact');
});

// ── HTML — SKILLS ─────────────────────────────────────────────────────────────

test('HTML: <ul class="skills-grid"> contains exactly 6 .skill-card items', () => {
  assertCount(html, /<li[^>]+class=["'][^"']*skill-card[^"']*["']/g, 6,
    'Expected exactly 6 .skill-card <li> elements');
});

test('HTML: skills include HTML5, CSS3, JavaScript, Responsive Design, Git, Accessibility', () => {
  const skills = ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Git', 'Accessibility'];
  for (const skill of skills) {
    assert(html.includes(skill), `Skill "${skill}" not found in HTML`);
  }
});

// ── HTML — PROJECTS ───────────────────────────────────────────────────────────

test('HTML: exactly 3 <article class="project-card"> elements', () => {
  assertCount(html, /<article[^>]+class=["'][^"']*project-card[^"']*["']/g, 3,
    'Expected exactly 3 .project-card articles');
});

test('HTML: each project-card has an <h3>', () => {
  assertCount(html, /<h3[\s>]/g, 3, 'Expected exactly 3 <h3> elements (one per project card)');
});

test('HTML: each project-card has a .project-links div', () => {
  assertCount(html, /<div[^>]+class=["'][^"']*project-links[^"']*["']/g, 3,
    'Expected 3 .project-links divs');
});

test('HTML: project links contain "Live Demo" and "Source" labels', () => {
  assertMatch(html, /Live Demo/, 'Missing "Live Demo" text in project links');
  assertMatch(html, /\bSource\b/, 'Missing "Source" text in project links');
});

// ── HTML — CONTACT FORM ───────────────────────────────────────────────────────

test('HTML: <form id="contact-form" novalidate> present', () => {
  assertMatch(html, /<form[^>]+id=["']contact-form["'][^>]*novalidate/,
    'Missing <form id="contact-form" novalidate>');
});

test('HTML: name input type="text" with id="name" and required', () => {
  assertMatch(html, /<input[^>]+type=["']text["'][^>]*id=["']name["'][^>]*required|<input[^>]+id=["']name["'][^>]*type=["']text["'][^>]*required/,
    'Name input missing type="text", id="name", or required attribute');
});

test('HTML: email input type="email" with id="email" and required', () => {
  assertMatch(html, /<input[^>]+type=["']email["'][^>]*id=["']email["'][^>]*required|<input[^>]+id=["']email["'][^>]*type=["']email["'][^>]*required/,
    'Email input missing type="email", id="email", or required attribute');
});

test('HTML: textarea id="message" with required', () => {
  assertMatch(html, /<textarea[^>]+id=["']message["'][^>]*required|<textarea[^>]+required[^>]*id=["']message["']/,
    'Textarea missing id="message" or required');
});

test('HTML: submit button with class btn btn-primary and text "Send Message"', () => {
  assertMatch(html, /<button[^>]+type=["']submit["'][^>]*>Send Message<\/button>/,
    'Missing submit button with text "Send Message"');
});

test('HTML: form-status paragraph with role="status" and aria-live="polite"', () => {
  assertMatch(html, /<p[^>]+class=["'][^"']*form-status[^"']*["'][^>]*role=["']status["'][^>]*aria-live=["']polite["']/,
    'Missing <p class="form-status" role="status" aria-live="polite">');
});

test('HTML: form-status paragraph is empty on load', () => {
  const statusMatch = html.match(/<p[^>]+class=["'][^"']*form-status[^"']*["'][^>]*>([\s\S]*?)<\/p>/);
  assert(statusMatch, 'Could not locate .form-status element');
  assert(statusMatch[1].trim() === '', 'form-status should be empty on page load');
});

// ── HTML — ACCESSIBILITY: FORM LABELS ────────────────────────────────────────

test('HTML: <label for="name"> present', () => {
  assertMatch(html, /<label[^>]+for=["']name["']/, 'Missing <label for="name">');
});

test('HTML: <label for="email"> present', () => {
  assertMatch(html, /<label[^>]+for=["']email["']/, 'Missing <label for="email">');
});

test('HTML: <label for="message"> present', () => {
  assertMatch(html, /<label[^>]+for=["']message["']/, 'Missing <label for="message">');
});

// ── HTML — EMAIL PLACEHOLDER ──────────────────────────────────────────────────

test('HTML: email placeholder uses reinvesting1012026@gmail.com', () => {
  assertMatch(html, /reinvesting1012026@gmail\.com/, 'Placeholder email not found in HTML');
});

test('HTML: email link uses mailto: href', () => {
  assertMatch(html, /href=["']mailto:reinvesting1012026@gmail\.com["']/,
    'Missing mailto: link for the placeholder email');
});

// ── HTML — FOOTER ─────────────────────────────────────────────────────────────

test('HTML: footer contains static year 2026', () => {
  assertMatch(html, /<footer[\s\S]*?2026[\s\S]*?<\/footer>/,
    'Footer does not contain year 2026');
});

// ── HTML — TODO PLACEHOLDERS ──────────────────────────────────────────────────

test('HTML: TODO placeholder comments present for pending items', () => {
  assertMatch(html, /<!--\s*TODO:\s*replace placeholder\s*-->/i,
    'No <!-- TODO: replace placeholder --> comments found');
});

test('HTML: social link hrefs are # placeholders', () => {
  // Social links list should contain at least one href="#"
  assertMatch(html, /<ul[^>]*class=["'][^"']*social-links[^"']*["'][\s\S]*?href=["']#["']/,
    'Social links do not use # placeholder hrefs');
});

// ── CSS — CUSTOM PROPERTIES ───────────────────────────────────────────────────

const cssVars = {
  '--color-bg':          '#fffdf7',
  '--color-surface':     '#ffffff',
  '--color-text':        '#2b2218',
  '--color-muted':       '#6b5d4a',
  '--color-accent':      '#f4a823',
  '--color-accent-dark': '#d98b0c',
  '--max-width':         '1100px',
  '--radius':            '12px',
};

for (const [varName, value] of Object.entries(cssVars)) {
  test(`CSS: custom property ${varName}: ${value} defined in :root`, () => {
    // Match "varName: value" allowing optional spaces
    const pattern = new RegExp(varName.replace('-', '\\-') + '\\s*:\\s*' + value.replace(/[().,]/g, '\\$&'));
    assert(pattern.test(css), `${varName}: ${value} not found in :root`);
  });
}

test('CSS: --shadow custom property defined in :root', () => {
  assertMatch(css, /--shadow\s*:/, 'Missing --shadow custom property');
});

test('CSS: --navbar-height custom property defined', () => {
  assertMatch(css, /--navbar-height\s*:\s*64px/, 'Missing --navbar-height: 64px');
});

// ── CSS — RESET & BASE ────────────────────────────────────────────────────────

test('CSS: box-sizing: border-box applied universally', () => {
  assertMatch(css, /\*[\s\S]*?box-sizing\s*:\s*border-box/, 'Missing universal box-sizing: border-box');
});

test('CSS: body { margin: 0 } reset applied', () => {
  assertMatch(css, /body\s*\{[^}]*margin\s*:\s*0/, 'Missing body { margin: 0 }');
});

test('CSS: html { scroll-behavior: smooth } set', () => {
  assertMatch(css, /html\s*\{[^}]*scroll-behavior\s*:\s*smooth/, 'Missing html { scroll-behavior: smooth }');
});

// ── CSS — NAVBAR ──────────────────────────────────────────────────────────────

test('CSS: .navbar is position: fixed', () => {
  assertMatch(css, /\.navbar\s*\{[^}]*position\s*:\s*fixed/, 'Missing .navbar { position: fixed }');
});

test('CSS: .navbar is top: 0', () => {
  assertMatch(css, /\.navbar\s*\{[^}]*top\s*:\s*0/, 'Missing top: 0 in .navbar');
});

test('CSS: section has scroll-margin-top using --navbar-height', () => {
  assertMatch(css, /section\s*\{[^}]*scroll-margin-top\s*:\s*var\(--navbar-height\)/,
    'Missing scroll-margin-top: var(--navbar-height) on section');
});

// ── CSS — MOBILE NAV ──────────────────────────────────────────────────────────

test('CSS: .nav-menu collapses with max-height: 0 on mobile', () => {
  assertMatch(css, /\.nav-menu\s*\{[^}]*max-height\s*:\s*0/, 'Missing max-height: 0 on .nav-menu');
});

test('CSS: .navbar.nav-open .nav-menu expands max-height', () => {
  assertMatch(css, /\.navbar\.nav-open\s+\.nav-menu\s*\{[^}]*max-height\s*:/,
    'Missing .navbar.nav-open .nav-menu { max-height: ... }');
});

test('CSS: @media (min-width: 768px) — .nav-toggle display: none', () => {
  assertMatch(css, /@media\s*\(min-width\s*:\s*768px\)[\s\S]*?\.nav-toggle\s*\{[^}]*display\s*:\s*none/,
    'Missing .nav-toggle { display: none } at 768px breakpoint');
});

// ── CSS — FOCUS VISIBLE ───────────────────────────────────────────────────────

test('CSS: :focus-visible outline uses --color-accent', () => {
  assertMatch(css, /:focus-visible\s*\{[^}]*outline[^}]*var\(--color-accent\)/,
    'Missing :focus-visible outline using --color-accent');
});

// ── CSS — BUTTONS ─────────────────────────────────────────────────────────────

test('CSS: .btn class defined', () => {
  assertMatch(css, /\.btn\s*\{/, 'Missing .btn class definition');
});

test('CSS: .btn-primary class defined', () => {
  assertMatch(css, /\.btn-primary\s*\{/, 'Missing .btn-primary class definition');
});

test('CSS: .btn-secondary class defined', () => {
  assertMatch(css, /\.btn-secondary\s*\{/, 'Missing .btn-secondary class definition');
});

// ── CSS — GRIDS ───────────────────────────────────────────────────────────────

test('CSS: .skills-grid uses CSS Grid', () => {
  assertMatch(css, /\.skills-grid\s*\{[^}]*display\s*:\s*grid/, 'Missing display: grid on .skills-grid');
});

test('CSS: .projects-grid uses CSS Grid', () => {
  assertMatch(css, /\.projects-grid\s*\{[^}]*display\s*:\s*grid/, 'Missing display: grid on .projects-grid');
});

test('CSS: .projects-grid uses auto-fit / minmax at 1024px breakpoint', () => {
  assertMatch(css, /@media\s*\(min-width\s*:\s*1024px\)[\s\S]*?\.projects-grid[\s\S]*?auto-fit[\s\S]*?minmax/,
    'Missing auto-fit/minmax for .projects-grid at 1024px');
});

// ── CSS — FORM STATUS ─────────────────────────────────────────────────────────

test('CSS: .form-status.success has a color (green text)', () => {
  assertMatch(css, /\.form-status\.success\s*\{[^}]*color\s*:/, 'Missing .form-status.success color');
});

test('CSS: .form-status.error has a color (red text)', () => {
  assertMatch(css, /\.form-status\.error\s*\{[^}]*color\s*:/, 'Missing .form-status.error color');
});

// ── CSS — BREAKPOINTS ─────────────────────────────────────────────────────────

test('CSS: mobile-first — @media (min-width: 768px) breakpoint present', () => {
  assertMatch(css, /@media\s*\(min-width\s*:\s*768px\)/, 'Missing 768px breakpoint');
});

test('CSS: @media (min-width: 1024px) breakpoint present', () => {
  assertMatch(css, /@media\s*\(min-width\s*:\s*1024px\)/, 'Missing 1024px breakpoint');
});

// ── JS — IIFE & STRICT MODE ───────────────────────────────────────────────────

test('JS: code wrapped in an IIFE', () => {
  assertMatch(js, /\(function\s*\(\)\s*\{/, 'main.js is not wrapped in an IIFE');
});

test('JS: strict mode declared inside IIFE', () => {
  assertMatch(js, /'use strict'/, "main.js does not declare 'use strict'");
});

// ── JS — NAV TOGGLE ──────────────────────────────────────────────────────────

test('JS: queries .nav-toggle element', () => {
  assertMatch(js, /querySelector\s*\(\s*['"]\.nav-toggle['"]\s*\)/, 'JS does not query .nav-toggle');
});

test('JS: queries .navbar element', () => {
  assertMatch(js, /querySelector\s*\(\s*['"]\.navbar['"]\s*\)/, 'JS does not query .navbar');
});

test('JS: nav-open class toggled on navbar', () => {
  assertMatch(js, /classList\.(?:add|toggle)\s*\(\s*['"]nav-open['"]\s*\)/, 'JS does not add nav-open class');
  assertMatch(js, /classList\.remove\s*\(\s*['"]nav-open['"]\s*\)/, 'JS does not remove nav-open class');
});

test('JS: aria-expanded flipped to "true" and "false"', () => {
  assertMatch(js, /setAttribute\s*\(\s*['"]aria-expanded['"]\s*,\s*['"]true['"]\s*\)/,
    'JS never sets aria-expanded="true"');
  assertMatch(js, /setAttribute\s*\(\s*['"]aria-expanded['"]\s*,\s*['"]false['"]\s*\)/,
    'JS never sets aria-expanded="false"');
});

test('JS: nav menu link clicks call closeMenu', () => {
  assertMatch(js, /nav-menu\s*a|navLinks/,
    'JS does not reference nav-menu links for close-on-click');
  assertMatch(js, /closeMenu/, 'JS does not call closeMenu from link click handlers');
});

// ── JS — FORM VALIDATION ──────────────────────────────────────────────────────

test('JS: listens for submit on #contact-form', () => {
  assertMatch(js, /getElementById\s*\(\s*['"]contact-form['"]\s*\)|querySelector\s*\(\s*['"]#contact-form['"]\s*\)/,
    'JS does not target #contact-form');
  assertMatch(js, /addEventListener\s*\(\s*['"]submit['"]/, 'JS does not listen for submit event');
});

test('JS: e.preventDefault() called in submit handler', () => {
  assertMatch(js, /e\.preventDefault\s*\(\s*\)|event\.preventDefault\s*\(\s*\)/,
    'JS does not call preventDefault on submit');
});

test('JS: email validated with regex /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/', () => {
  assertMatch(js, /\^[^\s@]+@[^\s@]+\.[^\s@]+\$|emailRegex/,
    'JS email validation regex not found');
});

test('JS: whitespace trimmed before validation (trim() called)', () => {
  assertMatch(js, /\.trim\s*\(\s*\)/, 'JS does not call .trim() before validation');
});

test('JS: success message is exactly "Thanks! Your message has been received."', () => {
  assertMatch(js, /Thanks! Your message has been received\./,
    'Success message text not found in JS');
});

test('JS: form.reset() called on successful submission', () => {
  assertMatch(js, /\.reset\s*\(\s*\)/, 'JS does not call form.reset() on success');
});

test('JS: formStatus classes cleared before adding new class', () => {
  assertMatch(js, /classList\.remove\s*\(\s*['"]success['"]\s*,\s*['"]error['"]\s*\)|classList\.remove\s*\(\s*['"]error['"]\s*,\s*['"]success['"]\s*\)/,
    'JS does not clear both success and error classes before setting new status');
});

// ── JS — EMAIL REGEX LOGIC (unit-tested in Node) ─────────────────────────────

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validEmails = [
  'user@example.com',
  'user.name+tag@sub.domain.org',
  'a@b.io',
];

const invalidEmails = [
  'noDomain',
  'no@dot',
  '@start.com',
  '',
  '   ',
  'missing-at-sign.com',
];

for (const email of validEmails) {
  test(`JS email regex: accepts valid email "${email}"`, () => {
    assert(emailRegex.test(email.trim()), `Email "${email}" should pass validation`);
  });
}

for (const email of invalidEmails) {
  test(`JS email regex: rejects invalid email "${email || '(empty)'}"`, () => {
    assert(!emailRegex.test(email.trim()), `Email "${email}" should fail validation`);
  });
}

// ── JS — INTERSECTIONOBSERVER GUARD ──────────────────────────────────────────

test('JS: IntersectionObserver guarded with feature-detect', () => {
  assertMatch(js, /['"]IntersectionObserver['"]\s+in\s+window/,
    "JS does not guard IntersectionObserver with 'IntersectionObserver' in window");
});

test('JS: IntersectionObserver observes section[id] elements', () => {
  assertMatch(js, /querySelectorAll\s*\(\s*['"]section\[id\]['"]\s*\)/,
    'JS does not query section[id] for IntersectionObserver');
});

test('JS: IntersectionObserver rootMargin set to reduce early triggering', () => {
  assertMatch(js, /rootMargin\s*:/, 'JS IntersectionObserver missing rootMargin option');
});

// ── PRINT RESULTS ─────────────────────────────────────────────────────────────

console.log('\n========================================');
console.log('  Honey Web Portfolio — Static Tests');
console.log('========================================\n');

for (const r of results) {
  const icon = r.status === 'PASS' ? 'PASS' : 'FAIL';
  console.log(`[${icon}] ${r.name}`);
  if (r.detail) {
    console.log(`       --> ${r.detail}`);
  }
}

console.log('\n----------------------------------------');
console.log(`  Total: ${passed + failed}   PASS: ${passed}   FAIL: ${failed}`);
console.log('----------------------------------------\n');

process.exitCode = failed > 0 ? 1 : 0;
