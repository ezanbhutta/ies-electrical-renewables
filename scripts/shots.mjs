/**
 * Redesign review captures. Uses the system Chrome, so no chromium download.
 *   node scripts/shots.mjs [baseUrl]
 *
 * `fullPage: true` returns a viewport sized image on this page — something in
 * the layout gives the capture a fixed height — so the whole page is taken by
 * sizing the VIEWPORT to the document instead, which is reliable either way.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:3000';
const OUT = 'screenshots/redesign';
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });

async function open(width, height, dsf = 1) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: dsf });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
  return page;
}

async function tall(name, width, dsf = 1) {
  let page = await open(width, 1000, dsf);
  // documentElement, not body: this page's <body> can report 0 once the
  // reveal pass has run, which is what produced a zero height capture.
  // Clamped to Chrome's own texture ceiling.
  const h = Math.min(
    16000,
    await page.evaluate(() =>
      Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
      ),
    ),
  );
  if (!h) throw new Error('measured zero page height');
  await page.close();
  page = await open(width, h, dsf);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await page.close();
  console.log('shot', name, `${width}x${h}`);
}

async function section(name, selector, width = 1440) {
  const page = await open(width, 1200, 2);
  const el = await page.locator(selector).first();
  if ((await el.count()) === 0) { console.log('MISSING', selector); await page.close(); return; }
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await el.screenshot({ path: `${OUT}/${name}.png` });
  await page.close();
  console.log('shot', name);
}

const page = await open(1440, 900, 2);
await page.screenshot({ path: `${OUT}/desktop-fold.png` });
await page.close();
console.log('shot desktop-fold');

await tall('desktop-full', 1440);
await tall('mobile-full', 390);
await section('sec-services', '#services');
await section('sec-who', '#who-does-the-work');
await section('sec-handover', '#handover');
await section('sec-questions', '#questions');
await section('sec-coverage', 'section.band-gold');

await browser.close();
console.log('done ->', OUT);
