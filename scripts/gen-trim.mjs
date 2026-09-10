/**
 * Reads Archivo's real metrics and emits the cap-trim constants used by `.t`.
 * DESIGN-DIRECTION.md §2.4 — these must be measured, never hand-copied, because
 * the formula returns the wrong sign for a face whose hhea metrics are asymmetric.
 *
 *   --trim-top    = capHeight/upm - (hheaAsc + hheaDesc)/2/upm
 *   --trim-bottom = (hheaAsc + hheaDesc)/2/upm      (hheaDesc signed, negative)
 */
import * as fontkit from 'fontkit';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const src = process.argv[2];
if (!src || !existsSync(src)) {
  console.error('usage: node scripts/gen-trim.mjs <path-to-archivo.ttf>');
  process.exit(1);
}
const f = fontkit.create(readFileSync(src));
const upm = f.unitsPerEm;
const cap = f.capHeight;
const asc = f.hhea.ascent;
const desc = f.hhea.descent;

// `desc` is SIGNED and negative in fontkit, so the midpoint of the content box is
// (asc + desc)/2, not (asc - desc)/2. Using the latter yields the content HEIGHT and
// drives trim-bottom ~63% too large. This is the sign trap called out in §2.4.
const half = (asc + desc) / 2 / upm;   // baseline -> content-box centre
const trimTop = cap / upm - half;      // line-box top    -> cap top,   less 0.5lh
const trimBottom = half;               // baseline        -> line-box bottom, less 0.5lh

console.log(JSON.stringify({ family: f.familyName, upm, cap, hheaAsc: asc, hheaDesc: desc,
  capPerEm: +(cap / upm).toFixed(4), trimTop: +trimTop.toFixed(4), trimBottom: +trimBottom.toFixed(4) }, null, 2));

writeFileSync('lib/font-metrics.json', JSON.stringify({
  capPerEm: +(cap / upm).toFixed(4),
  trimTop: +trimTop.toFixed(4),
  trimBottom: +trimBottom.toFixed(4),
}, null, 2) + '\n');
