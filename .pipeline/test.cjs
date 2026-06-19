/**
 * Static test suite for Honey Web Portfolio (Astro migration)
 * Runner: node (no browser required)
 *
 * Requires a prior build: npm run build
 * Tests: dist/index.html structure + component source behavior assertions
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ── helpers ──────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, '..');

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

// ── require build ─────────────────────────────────────────────────────────────

const distHtmlPath = path.join(ROOT, 'dist', 'index.html');
if (!fs.existsSync(distHtmlPath)) {
  console.error('\nERROR: dist/index.html not found.');
  console.error('Run `npm run build` first, then re-run `npm test`.\n');
  process.exit(1);
}

// ── load files ────────────────────────────────────────────────────────────────

const html    = fs.readFileSync(distHtmlPath, 'utf8');
const navbar  = fs.readFileSync(path.join(ROOT, 'src/components/Navbar.astro'), 'utf8');
const contact = fs.readFileSync(path.join(ROOT, 'src/components/Contact.astro'), 'utf8');
const skillsTs   = fs.readFileSync(path.join(ROOT, 'src/data/skills.ts'), 'utf8');
const projectsTs = fs.readFileSync(path.join(ROOT, 'src/data/projects.ts'), 'utf8');

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

// ── HTML — STRUCTURE: SECTIONS ────────────────────────────────────────────────

test('HTML: <section id="home"> with class "hero" exists', () => {
  assertMatch(html,
    /<section[^>]+id=["']home["'][^>]*class=["'][^"']*hero[^"']*["']|<section[^>]+class=["'][^"']*hero[^"']*["'][^>]*id=["']home["']/,
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

test('HTML: navbar class present inside <header>', () => {
  assertMatch(html, /<header[\s\S]*?class=["'][^"']*navbar[^"']*["']/,
    'Missing element with class "navbar" inside <header>');
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
  assertMatch(html,
    /<button[^>]*class=["'][^"']*nav-toggle[^"']*["'][^>]*aria-label=["']Toggle menu["']|<button[^>]*aria-label=["']Toggle menu["'][^>]*class=["'][^"']*nav-toggle[^"']*["']/,
    'nav-toggle button missing aria-label="Toggle menu"');
});

test('HTML: nav-toggle button has aria-expanded="false" on load', () => {
  assertMatch(html,
    /<button[^>]*class=["'][^"']*nav-toggle[^"']*["'][^>]*aria-expanded=["']false["']|<button[^>]*aria-expanded=["']false["'][^>]*class=["'][^"']*nav-toggle[^"']*["']/,
    'nav-toggle button missing aria-expanded="false"');
});

test('HTML: nav-toggle has three <span> bars', () => {
  const toggleMatch = html.match(/<button[^>]*class=["'][^"']*nav-toggle[^"']*["'][^>]*>([\s\S]*?)<\/button>/);
  assert(toggleMatch, 'Could not find .nav-toggle button block');
  const spansInButton = (toggleMatch[1].match(/<span/g) || []).length;
  assert(spansInButton === 3, `Expected 3 <span> bars in nav-toggle, found ${spansInButton}`);
});

// ── HTML — HERO ───────────────────────────────────────────────────────────────

test('HTML: hero has .hero-subtitle paragraph', () => {
  assertMatch(html, /<p[^>]+class=["'][^"']*hero-subtitle[^"']*["']/, 'Missing <p class="hero-subtitle">');
});

test('HTML: CTA "View My Work" links to #projects', () => {
  assertMatch(html, /href=["']#projects["'][^>]*>View My Work<\/a>/,
    '"View My Work" anchor does not link to #projects');
});

test('HTML: CTA "Contact Me" links to #contact', () => {
  assertMatch(html, /href=["']#contact["'][^>]*>Contact Me<\/a>/,
    '"Contact Me" anchor does not link to #contact');
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
  assertMatch(html,
    /<input[^>]+type=["']text["'][^>]*id=["']name["'][^>]*required|<input[^>]+id=["']name["'][^>]*type=["']text["'][^>]*required/,
    'Name input missing type="text", id="name", or required attribute');
});

test('HTML: email input type="email" with id="email" and required', () => {
  assertMatch(html,
    /<input[^>]+type=["']email["'][^>]*id=["']email["'][^>]*required|<input[^>]+id=["']email["'][^>]*type=["']email["'][^>]*required/,
    'Email input missing type="email", id="email", or required attribute');
});

test('HTML: textarea id="message" with required', () => {
  assertMatch(html,
    /<textarea[^>]+id=["']message["'][^>]*required|<textarea[^>]+required[^>]*id=["']message["']/,
    'Textarea missing id="message" or required');
});

test('HTML: submit button with text "Send Message"', () => {
  assertMatch(html, /<button[^>]+type=["']submit["'][^>]*>\s*Send Message\s*<\/button>/,
    'Missing submit button with text "Send Message"');
});

test('HTML: form-status paragraph with role="status" and aria-live="polite"', () => {
  assertMatch(html,
    /<p[^>]+class=["'][^"']*form-status[^"']*["'][^>]*role=["']status["'][^>]*aria-live=["']polite["']/,
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

// ── HTML — SOCIAL LINKS ───────────────────────────────────────────────────────

test('HTML: social links use href="#" placeholders', () => {
  assertMatch(html, /<ul[^>]*class=["'][^"']*social-links[^"']*["'][\s\S]*?href=["']#["']/,
    'Social links do not use # placeholder hrefs');
});

// ── HTML — FOOTER ─────────────────────────────────────────────────────────────

test('HTML: footer contains static year 2026', () => {
  assertMatch(html, /<footer[\s\S]*?2026[\s\S]*?<\/footer>/,
    'Footer does not contain year 2026');
});

// ── SOURCE: Navbar.astro — script behavior ────────────────────────────────────

test('Navbar.astro: adds nav-open class on open', () => {
  assertMatch(navbar, /classList\.add\s*\(\s*['"]nav-open['"]\s*\)/,
    'Navbar script does not add "nav-open" class');
});

test('Navbar.astro: removes nav-open class on close', () => {
  assertMatch(navbar, /classList\.remove\s*\(\s*['"]nav-open['"]\s*\)/,
    'Navbar script does not remove "nav-open" class');
});

test('Navbar.astro: sets aria-expanded to "true"', () => {
  assertMatch(navbar, /setAttribute\s*\(\s*['"]aria-expanded['"]\s*,\s*['"]true['"]\s*\)/,
    'Navbar script never sets aria-expanded="true"');
});

test('Navbar.astro: sets aria-expanded to "false"', () => {
  assertMatch(navbar, /setAttribute\s*\(\s*['"]aria-expanded['"]\s*,\s*['"]false['"]\s*\)/,
    'Navbar script never sets aria-expanded="false"');
});

test('Navbar.astro: guards IntersectionObserver with feature detect', () => {
  assertMatch(navbar, /['"]IntersectionObserver['"]\s+in\s+window/,
    "Navbar script does not guard with 'IntersectionObserver' in window");
});

test('Navbar.astro: observes section[id] elements', () => {
  assertMatch(navbar, /querySelectorAll\s*\(\s*['"]section\[id\]['"]\s*\)/,
    'Navbar script does not query section[id] for IntersectionObserver');
});

test('Navbar.astro: IntersectionObserver has rootMargin set', () => {
  assertMatch(navbar, /rootMargin\s*:/,
    'Navbar IntersectionObserver missing rootMargin option');
});

// ── SOURCE: Contact.astro — script behavior ───────────────────────────────────

test('Contact.astro: listens for submit event', () => {
  assertMatch(contact, /addEventListener\s*\(\s*['"]submit['"]/,
    'Contact script does not listen for submit event');
});

test('Contact.astro: calls e.preventDefault()', () => {
  assertMatch(contact, /\.preventDefault\s*\(\s*\)/,
    'Contact script does not call preventDefault on submit');
});

test('Contact.astro: email validated with regex /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/', () => {
  assertMatch(contact, /\^[^\s@]+@[^\s@]+\.[^\s@]+\$|emailRegex/,
    'Contact script email validation regex not found');
});

test('Contact.astro: calls .trim() before validation', () => {
  assertMatch(contact, /\.trim\s*\(\s*\)/,
    'Contact script does not call .trim() before validation');
});

test('Contact.astro: success message is exactly "Thanks! Your message has been received."', () => {
  assertMatch(contact, /Thanks! Your message has been received\./,
    'Contact script success message text not found');
});

test('Contact.astro: calls form.reset() on success', () => {
  assertMatch(contact, /\.reset\s*\(\s*\)/,
    'Contact script does not call .reset() on success');
});

// ── SOURCE: skills.ts — data integrity ───────────────────────────────────────

test('skills.ts: contains all 6 skill names', () => {
  const skills = ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Git', 'Accessibility'];
  for (const skill of skills) {
    assert(skillsTs.includes(skill), `skills.ts missing skill "${skill}"`);
  }
});

// ── SOURCE: projects.ts — data integrity ─────────────────────────────────────

test('projects.ts: contains all 3 project titles', () => {
  const titles = ['Project One', 'Project Two', 'Project Three'];
  for (const title of titles) {
    assert(projectsTs.includes(title), `projects.ts missing project title "${title}"`);
  }
});

// ── EMAIL REGEX UNIT TESTS ────────────────────────────────────────────────────

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
  test(`Email regex: accepts valid email "${email}"`, () => {
    assert(emailRegex.test(email.trim()), `Email "${email}" should pass validation`);
  });
}

for (const email of invalidEmails) {
  test(`Email regex: rejects invalid email "${email || '(empty)'}"`, () => {
    assert(!emailRegex.test(email.trim()), `Email "${email}" should fail validation`);
  });
}

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
