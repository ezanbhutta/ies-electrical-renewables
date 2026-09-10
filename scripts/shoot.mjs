/**
 * Captures the deliverable screenshots and runs the alignment acceptance
 * checklist from DESIGN-DIRECTION.md §2.8 against the live page.
 *
 * Usage: node scripts/shoot.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:3000';
mkdirSync('screenshots', { recursive: true });

const LEGAL_COLS = [80, 180, 280, 380, 480, 580, 680, 780, 880, 980, 1080, 1180];
const SCALE = new Set([0, 8, 16, 24, 32, 48, 64, 96]);

// Use the full chromium build rather than the headless shell.
const browser = await chromium.launch({ channel: 'chromium' });

// ---- Desktop -------------------------------------------------------------
const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await desktop.goto(BASE, { waitUntil: 'networkidle' });
await desktop.waitForTimeout(1200);
await desktop.screenshot({ path: 'screenshots/desktop-fold.png' });
// let every scroll driven reveal finish before the full page shot
await desktop.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 400) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await desktop.waitForTimeout(900);
await desktop.screenshot({ path: 'screenshots/desktop-full.png', fullPage: true });

// ---- Acceptance checklist ------------------------------------------------
const report = await desktop.evaluate(({ LEGAL_COLS, SCALE }) => {
  const R = (e) => e.getBoundingClientRect();
  const scale = new Set(SCALE);
  const out = {};

  out.illegalColumnWidths = [
    ...new Set(
      [...document.querySelectorAll('[data-col]')]
        .map((e) => +R(e).width.toFixed(1))
        .filter((w) => w > 0 && !LEGAL_COLS.some((l) => Math.abs(l - w) < 1.5)),
    ),
  ];

  out.rightBoxLines = [
    ...new Set(
      [...document.querySelectorAll('[data-col], .btn, dl, article.card')]
        .map((e) => +R(e).right.toFixed(1))
        .filter((v) => v > 1200),
    ),
  ].sort((a, b) => a - b);

  const radii = new Set();
  document.querySelectorAll('*').forEach((e) => {
    const s = getComputedStyle(e);
    ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'].forEach((k) => {
      const v = parseFloat(s[k]);
      if (v > 0) radii.add(+v.toFixed(1));
    });
  });
  out.radiiInUse = [...radii].sort((a, b) => a - b);
  out.radiusViolations = out.radiiInUse.filter((v) => ![2, 7, 12].includes(v));

  const bad = [];
  document.querySelectorAll('section, .ies-grid, [data-col], ul, ol, dl, article').forEach((e) => {
    const s = getComputedStyle(e);
    ['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'rowGap'].forEach((k) => {
      const v = parseFloat(s[k]);
      if (!isNaN(v) && v > 0 && !scale.has(Math.round(v))) {
        bad.push(`${e.tagName.toLowerCase()} ${k}=${v.toFixed(1)}`);
      }
    });
  });
  out.rhythmViolations = [...new Set(bad)];

  // service cards must share every horizontal line
  const cards = [...document.querySelectorAll('article.card')];
  out.cardLines = cards.map((c) => ({
    left: +R(c).left.toFixed(1),
    bar: +R(c.querySelector('.bar')).top.toFixed(1),
    title: +R(c.querySelector('h3')).top.toFixed(1),
    bottom: +R(c).bottom.toFixed(1),
  }));
  out.cardsShareLines =
    new Set(out.cardLines.map((c) => c.bar)).size === 1 &&
    new Set(out.cardLines.map((c) => c.title)).size === 1 &&
    new Set(out.cardLines.map((c) => c.bottom)).size === 1;

  // fact table on L6 / L9 / L13
  const dt = document.querySelector('dt'), dd = document.querySelector('dd');
  out.factTable = dt && dd ? {
    labelLeft: +R(dt).left.toFixed(1), labelWidth: +R(dt).width.toFixed(1),
    valueLeft: +R(dd).left.toFixed(1), valueWidth: +R(dd).width.toFixed(1),
    valueRight: +R(dd).right.toFixed(1),
  } : null;

  // the shared measure
  const sl = document.querySelector('.strapline');
  const wrap = sl?.parentElement?.parentElement;
  out.sharedMeasure = sl && wrap ? {
    hairline: +R(wrap.firstElementChild).width.toFixed(1),
    strapline: +R(sl).width.toFixed(1),
  } : null;

  out.h1Count = document.querySelectorAll('h1').length;
  return out;
}, { LEGAL_COLS, SCALE: [...SCALE] });

// ---- Mobile --------------------------------------------------------------
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
await mobile.goto(BASE, { waitUntil: 'networkidle' });
await mobile.waitForTimeout(1200);
await mobile.screenshot({ path: 'screenshots/mobile-fold.png' });
await mobile.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 400) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await mobile.waitForTimeout(900);
await mobile.screenshot({ path: 'screenshots/mobile-full.png', fullPage: true });

// ---- Reduced motion sanity check ----------------------------------------
const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await rm.goto(BASE, { waitUntil: 'networkidle' });
await rm.waitForTimeout(600);
report.reducedMotion = await rm.evaluate(() => {
  const running = document.getAnimations().filter((a) => a.playState === 'running').length;
  const hidden = [...document.querySelectorAll('.reveal, .wght-in, .reveal-bar')]
    .filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.99).length;
  return { runningAnimations: running, elementsStillHidden: hidden };
});
await rm.screenshot({ path: 'screenshots/desktop-reduced-motion.png' });

await browser.close();
writeFileSync('screenshots/acceptance.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
