/**
 * Sweeps the page across every width the layout can break at and reports
 * MECHANICAL faults only — horizontal page overflow, elements escaping the
 * viewport, and text overflowing its own box. Judgement calls are not its job.
 *
 *   node scripts/responsive-audit.mjs [baseUrl]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:3000';
const WIDTHS = [320, 360, 390, 414, 480, 600, 700, 768, 834, 900, 1024, 1100, 1180, 1280, 1366, 1440, 1600, 1920, 2560];

const browser = await chromium.launch({ channel: 'chrome' });
let bad = 0;

for (const w of WIDTHS) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 25)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);

  const r = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const pageOverflow = document.documentElement.scrollWidth - vw;
    const escaping = [];
    const textOverflow = [];
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') continue;
      // `.vh` is the visually-hidden utility (clipped to 1px for screen
      // readers) and `.skip` is parked at -9999px until focused. Both overflow
      // their own box BY DESIGN, so neither is a fault.
      if (el.classList.contains('vh') || el.classList.contains('skip')) continue;
      if (el.closest('.vh, .skip')) continue;
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      const id = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
      // Escaping the viewport horizontally. Allow 1px of rounding.
      if (b.right > vw + 1 || b.left < -1) {
        // Ignore deliberately clipped decoration inside an overflow:hidden parent.
        let p = el.parentElement, clipped = false;
        while (p) { const pcs = getComputedStyle(p); if (pcs.overflow !== 'visible' && pcs.overflowX !== 'visible') { clipped = true; break; } p = p.parentElement; }
        if (!clipped) escaping.push({ id, left: Math.round(b.left), right: Math.round(b.right), txt: (el.textContent || '').trim().slice(0, 30) });
      }
      // Text wider than its own box.
      if (el.children.length === 0 && el.scrollWidth - el.clientWidth > 2 && (el.textContent || '').trim())
        textOverflow.push({ id, over: el.scrollWidth - el.clientWidth, txt: (el.textContent || '').trim().slice(0, 34) });
    }
    const uniq = (a, k) => [...new Map(a.map(x => [k(x), x])).values()];
    return { pageOverflow, escaping: uniq(escaping, x => x.id + x.left).slice(0, 6), textOverflow: uniq(textOverflow, x => x.id + x.txt).slice(0, 6) };
  });

  const issues = (r.pageOverflow > 1 ? 1 : 0) + r.escaping.length + r.textOverflow.length;
  if (issues) bad++;
  const flag = issues ? 'FAIL' : ' ok ';
  console.log(`${flag} ${String(w).padStart(4)}  hScroll:${String(r.pageOverflow).padStart(4)}  escaping:${r.escaping.length}  textOver:${r.textOverflow.length}`);
  for (const e of r.escaping) console.log(`        escapes  ${e.id}  L${e.left} R${e.right}  "${e.txt}"`);
  for (const t of r.textOverflow) console.log(`        textover ${t.id}  +${t.over}px  "${t.txt}"`);
  await page.close();
}
await browser.close();
console.log(`\n${bad}/${WIDTHS.length} widths with issues`);
