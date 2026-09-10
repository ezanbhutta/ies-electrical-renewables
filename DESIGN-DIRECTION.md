# IES — Final Design Direction

**Build document.** Everything below is decided. Where sources disagreed, the pick and its one‑line reason are given inline. Nothing here needs a follow‑up question except the six items in the last section, which need the client, not the developer.

Absolute paths for source material:
- Brief: `/Users/ezanbhutta/Downloads/IES-landing-page-brief.md`
- Prior lenses: `/private/tmp/claude-501/-Users-ezanbhutta-Documents-Github-Projects-IES-Electrical-Services/33d8acd1-e02f-40c6-9662-101cdfb7e768/scratchpad/salvage/{truth,structure,devices,palette}.json`
- Brand SVGs: `/private/tmp/claude-501/-Users-ezanbhutta-Documents-Github-Projects-IES-Electrical-Services/33d8acd1-e02f-40c6-9662-101cdfb7e768/scratchpad/brand/IES Electrical Renewables/SVG/Asset 1..9.svg`

---

## 1. The design language, derived from the logo

The client said "the website should have the same feel as the logo." That is not a mood. It is six measurable properties of the artwork, and every one of them has a page consequence.

**1.1 Gold completes the structure; it does not decorate it.**
The green shape is a **C**, not an E: a spine with two arms and an open middle. The gold bar *is* the E's middle arm. Gold is what makes the mark read IES rather than ICS. It is load‑bearing, not subordinate.

Page consequence: gold marks the operative element in a group, never a wash across a group. The primary CTA is a gold ground with a dark‑green letterform inside it — the mark's own figure/ground, inverted. The mobile menu button is three horizontal bars (the C's own vocabulary) and **its middle bar is gold**. Gold never runs as body copy, never as a heading clause, never as a section ground — not because it is subordinate but because it measures 2.31:1 on cream and cannot legally carry meaning there.

**1.2 The corner radius is absolute and tiny. One literal, everywhere.**
`2.34` appears 33 times across the artwork and never grows with the element. At the three sizes the mark actually renders on this page its own corner is 1.26px, 2.11px and 3.05px. The honest translation is **one radius: `2px`**, on every rectangle whose minor dimension is ≥14px. Below 14px: `0`. Inner edges: `0`, always.

This kills every pill in all six references at once: a 48px pill needs 24px, the mark's rule yields ~7px, and the artwork's actual render range is 1.3–3.1px. There is no radius ladder. A card is not rounder than a button. **Any `border-radius` above 2px in the codebase is a build error.**

*Chosen over devices.json's 6/4/0 and over logodna's 6/4/0: the reviewer showed the proportional derivation (0.1448 × 44) is the very method the "absolute radius" thesis rejects, and that a 4px‑vs‑6px difference is invisible. One literal is the only version that is both derived and checkable.*

**1.3 Total orthogonality. No diagonals, no circles, no chamfers.**
Every segment in the artwork is axis‑aligned or a corner sweep tangent to a horizontal or vertical. There is not one 45° edge and not one closed circular path.

Deleted from the build as a consequence: **the checkmark tick** (brief §6, four instances), **the chevron** (structure.json F1/F6, four instances), **the "Learn more →" arrow**, **the mobile menu close X**, **every circular badge, avatar, seal and rotating ring**, **every chamfered corner**, **every glow, gradient and wireframe**. All are replaced by one object — the accent bar (§1.4) — or by nothing.

The page ships **zero pictorial icons**. This is austere and it costs a small amount of scanning affordance for the supply‑chain reader. It is accepted: the mark is a wordmark with one ornament, ref 6 is near‑monochrome and is the reference the client responded to, and every icon removed is one fewer optical alignment to get wrong on a page whose stated top priority is alignment.

**1.4 One ornament: the E's bar, lifted at native size, floating free.**
Bar bounds in the artwork: x 59.35→107.09, y 29.78→44.28 (**47.74 × 14.50**, true stroke height 14.14, carrying a 0.46° optical tilt). It floats with gaps of 13.72 / 14.79 / 15.14 on its three closed sides — **its clear space is about one bar height** — and sits flush to the arms' terminals on the fourth. Its height is dimensioned by negative space: the C's path contains a cut slot written literally as `v-14.14`, and the bar is that slot's plug.

Ship **two sizes only**:
- `--bar` **48 × 14px**, radius 2px. Section headers and service cards.
- `--bar-sm` **16 × 5px**, radius 0. Inline: commitment lines, link rows, the CLOSE control, before `{{PHONE}}` in the footer, before an error message.

The bar **never stretches**. Anything full‑width is a 1px hairline — that is a different object in the mark (the strapline pipe). The bar and the label it leads are always the same colour, because in the artwork the bar and the strapline are one gold.

Instance ledger, exact and closed: 6 section headers + 3 service cards = **9 `--bar`**. 4 commitment lines + 3 card link rows + 1 panel link + 1 footer phone + 1 CLOSE = **10 `--bar-sm`**. No others.

**1.5 Extreme weight contrast, one family, nothing in the middle.**
Heavy stem/cap = 16.16/74.41 = **0.2172**. Light stem/cap = 1.26/10.21 = **0.1234**. Stem ratio **1.746**, absolute stroke ratio 12.83:1, cap ratio 7.29:1. The lockup is **monotypographic** — one species of letterform, separated only by weight and size.

The mark is *not* monolinear: horizontals measure 14.99, verticals 16.05–16.16, a consistent **7% optical compensation** on all four horizontal arms. Page rule that falls out: **a horizontal rule renders one step lighter than a vertical divider of the same nominal weight.**

**1.6 The shared measure.**
The strapline's last glyph terminates at x 199.58 against the mark's right edge at 199.64 — flush to 0.06 units — while its left ink starts at 0.92, i.e. inset by 9% of its own cap height. **The logo justifies the supporting line to the primary's RIGHT edge and lets the left hang inside.** The mark was not resized to suit the strapline; the strapline was tracked until it hit the measure.

Page consequence: where two stacked objects can share a measure, they share it exactly. Where they cannot, they share the left edge and **no right edge is faked**. The one place the artwork's construction is reproduced literally is the hero: a 1px gold hairline and the live strapline beneath it, both **exactly 320px** wide, left edge on L1 (§4.2).

---

## 2. The alignment system

The client's stated top priority. Built as construction, not care.

### 2.1 Grid

**1180px, 12 columns of exactly 80.000px, 20px gutters, 100.000px pitch.**

```
(1180 − 11 × 20) / 12 = 960 / 12 = 80.000
pitch = 100.000        spans = 100n − 20 → 80, 180, 280, 380, 480, 580, 680, 780, 880, 980, 1080, 1180
```

Line positions from the container's left edge: **L1 0, L2 100, … L6 500, … L9 800, … L13 1180.** At a 1440 viewport the container spans **x130 → x1310**.

*Chosen over devices.json's 1176/76/24: brief §5 scopes the 8px base to **vertical** rhythm only, so forcing horizontal 8‑divisibility buys nothing and needlessly abandons the brief's own 1180.*

Fractional widths are permitted but **never computed twice**. Every section declares one grid and every child is placed on it:

```css
.grid { display:grid; grid-template-columns:repeat(var(--cols),minmax(0,1fr)); column-gap:var(--gutter); }
```

**Banned outright** (each recomputes per element and drifts up to 1px): `width:33.333%`, `width:calc((100% - 40px)/3)`, percentage `flex-basis`, any fixed px width on a layout child.

**Intermediate widths.** The grid is integral at ≥1276 (80.000) and at 1024 (59.000) and fractional between. Therefore **no absolute px constant may be used for a horizontal position.** Every derived line is a calc off the resolved column:

```css
--col:   calc((100% - 11 * var(--gutter)) / 12);
--pitch: calc(var(--col) + var(--gutter));
--void:  calc(var(--col) + 2 * var(--gutter));   /* 120 at ≥1276 */
--L6:    calc(5 * var(--pitch));                 /* 500 */
--L9:    calc(8 * var(--pitch));                 /* 800 */
```

Breakpoints: **≥1024** 12 cols / 20 gutter / 48 page gutter. **768–1023** 8 cols / 16 / 24 (76.000 exactly at 768). **<768** 4 cols / 16 / 24. Spans do **not** map automatically — only 3, 6, 9 and 12 spans descend to integers, so the 4‑span card and the 7/4 hero split are **re‑authored per breakpoint**, not mapped.

### 2.2 Two geometries, mirrored around a constant void

- **Split A** (Hero only): content C1–C7 (680) │ void C8 (120) │ panel C9–C12 (380).
- **Split B** (For Contractors, Process, Enquiry): heading C1–C4 (380) │ void C5 (120) │ content C6–C12 (680).

Same three widths reversed. The page therefore has **four primary vertical lines** — L1, L6, L9, L13 — recurring across sections, plus a stated secondary set (§2.3). Below 1024 both splits collapse to a full‑width stack and the void ceases to exist.

*This comes from ref 6 and devices.json F6, not from the logo. The logo's contribution here is the shared measure (§1.6), not the asymmetric split.*

### 2.3 Two line families, both tested

The single most common way this build fails is confusing a **box** edge with an **ink** edge. So both are declared.

- **Box lines** — where grounds, borders, rules and container edges start and stop: **0, 500, 800, 1180**.
- **Ink lines** — where the first stem of text lands: **0, 500, 800, 1180** for unpadded text, **plus 32, 532, 832** for text inside a padded surface.

**Every padded surface on the page uses the same 32px inset**, so the ink family is exactly the box family + 32. Surfaces with 32px padding: service card, hero nameplate panel, enquiry form card, mobile menu panel. Nothing else is padded horizontally.

Secondary line sets, declared so they are not mistaken for drift: the four‑cell rhythm **300 / 600 / 900** (footer columns, fact‑table gutters) and the three‑card rhythm **400 / 780** (service card left edges).

### 2.4 Cap trim — the mechanism that makes every other number true

A declared 96px section padding must measure from the section edge **to visible ink**. Untrimmed, an 11px/16px label sits ~4px low and a 56px/64px H1 sits ~11.6px low, so the same declared padding renders as three different paddings down one page.

```css
.t::before, .t::after { content:''; display:block; height:0; }
.t::before { margin-bottom: calc(var(--trim-top)    * 1em - 0.5lh); }
.t::after  { margin-top:    calc(var(--trim-bottom) * 1em - 0.5lh); }

@supports (text-box: trim-both cap alphabetic) {
  .t { text-box: trim-both cap alphabetic; }
  .t::before, .t::after { margin: 0; }     /* or every element is trimmed twice */
}
```

**The two constants must be computed from the shipped font file, not copied.** The single‑constant formula in the alignment lens is wrong and returns the wrong sign for any face but Inter.

```
--trim-top    = capHeight/upm − (hheaAsc − hheaDesc)/2/upm
--trim-bottom = (hheaAsc − hheaDesc)/2/upm
```

Build step: read `hhea.ascender`, `hhea.descender`, `OS/2.sCapHeight` and `head.unitsPerEm` from the Archivo woff2 with `fontkit` or `opentype.js`, write both values into `globals.css` as a one‑line codegen, and commit the generated values.

Apply `.t` to **block‑level text only** — h1–h3, p, dt, dd, li, label, the micro label, the strapline. **Never to an inline `<a>`**: a `display:block` pseudo‑element inside an inline anchor does not establish the intended box and breaks the link.

**Consequence, stated so nobody undoes it:** under trim, a paragraph's ink height is `(n−1) × line-height + capHeight`, which is fractional. That is fine. **Box positions stay on the 8px rhythm without exception; paragraph ink height is the fractional quantity, and it is absorbed at the component boundary below it, never inside the paragraph.**

### 2.5 Optical corrections, named so a future editor does not "fix" them

1. **Vertical dividers overshoot** the cap height of the line they separate by **14.6%** at each end (measured: the strapline pipe spans y 87.12–100.31 against caps at 88.61–98.82 — exactly 1.49 over at each end). Where a divider separates a stacked label/value pair it spans the pair's block height + 4px each end.
2. **A divider is thinner than the type it divides**: 1.00 against a 1.26 stem, ratio 0.79. All dividers are 1px.
3. **Horizontals render lighter than verticals** (§1.5): on dark, horizontal rules use `--rule-dark` (0.14 alpha), vertical dividers use `--rule-dark-strong` (0.24).
4. **Headline optical hang.** Only h1 and h2 are corrected, and the value is **per initial glyph**, not per family — a blanket constant pushes an A‑ or W‑initial headline *past* the line. Measure the left side bearing off the shipped Archivo file for three classes and ship a table: flat‑stem initials (E F B H I L M N P R T‑no), round initials (O C G S), diagonal initials (A V W Y). Apply as `margin-inline-start: calc(-1 * var(--lsb-flat | --lsb-round | --lsb-diag))`. **Never** apply it to an element carrying a border or a background.
5. **Tracked labels are never centred, never right‑aligned, and never a right‑edge reference.** CSS `letter-spacing` trails the final glyph, so a left‑aligned label's first stem is already at the box edge. **Do not ship `margin-left:-0.18em` on micro labels** — devices.json F3 has this backwards and it would pull every label ~2px left of the headline beneath it. Where a tracked run is inside a `width:fit-content` box, apply `margin-right` equal to the negative of its tracking.
6. **Vertical centring inside fixed‑height objects** (buttons, table rows) lifts text by ~1px per 400px of block height, matching the mark's own 0.235% optical lift of the bar above true centre.

### 2.6 The one container primitive

Four sections are full‑bleed colour and three sit on the page ground. Writing a coloured band as `<section class="bg-green-900 px-12 py-24">` puts its content at x48 while every cream section's content is at x130 — an **82px** mismatch at 1440 and **322px** at 1920, alternating down the page. This is two orders of magnitude larger than every other alignment risk here.

**Exactly one file in the codebase may declare a horizontal max‑width, auto margin or horizontal padding.**

```tsx
// components/Container.tsx  — the only place these properties may appear
export function Container({ children }: { children: React.ReactNode }) {
  return <div className="ies-container">{children}</div>;
}
```
```css
.ies-container { width: min(1180px, 100% - 2 * var(--page-gutter)); margin-inline: auto; }
```

A `<section>` carries **only** its ground colour and its vertical padding. Never `px-*`, never `max-width`, never `mx-auto`. Enforce in CI:

```bash
grep -rnE '(max-w-|max-width|mx-auto|\bcontainer\b|p[xlrse]-|m[lrse]-|inset-|left-|right-|w-\[)' app components \
  | grep -v 'components/Container.tsx'
```
Whitelist only the 32px surface padding (`p-8`) and the sanctioned headline hang.

### 2.7 Vertical scale

**8, 16, 24, 32, 48, 64, 96.** Nothing else between blocks, ever. `4px` is a detail unit (radius, hairline offsets), not a spacing value. Banned as spacing: **12, 20, 40, 56, 72, 80, 88, 100, 120**.

Component heights are any multiple of 8: header 88 (64 mobile), button/field 48, fact row 64 (104 mobile), service card 320, hero band 688.

*This scale is justified on its own terms — it is the brief's own 8px base. It is **not** derived from the logo; the 96/8 = 12 story is numerology, since both numbers come from the brief and the artwork's actual instruction is that nothing sits in the middle, which a seven‑step scale plainly violates.*

### 2.8 Acceptance checklist — measurements and greps, not judgements

Run at 1440 (container x130→x1310).

1. **One container.** The grep in §2.6 returns nothing.
2. **Left ink line.** First‑stem x of: header mark, and every section's `--bar`, micro label and sub = **130.0 ±1**. h1/h2 read ~126–128; that is the sanctioned hang and the only exception.
3. **Right box line.** Right edge of: header CTA, hero panel, third service card, every fact‑table hairline, the For Contractors CTA, the enquiry card, footer column 4, every footer hairline = **1310.0 ±1**.
4. **L9 box.** Hero panel left edge, For Contractors CTA left edge = **930.0**. **L9 ink.** Panel's first text stem, every fact‑table value's first stem = **962.0**.
5. **L6 box.** Enquiry card left edge, every fact‑table hairline start = **630.0**. **L6 ink.** Every Process step title, every commitment line, the card's first field label = **662.0** (card) / **630.0** (unpadded).
6. **Column widths.** `[...document.querySelectorAll('[data-col]')].map(e=>e.getBoundingClientRect().width)` returns only values from `{80,180,280,380,480,580,680,780,880,980,1080,1180}` at ≥1276. **`data-col` is a required attribute on every grid‑placed child.**
7. **Rhythm.** Sweep computed `margin-top/bottom`, `padding-top/bottom`, **`gap`, `row-gap`** on every layout element. Every value ∈ `{0,8,16,24,32,48,64,96}`.
8. **Ink padding.** In every section, the distance from the section's top edge to the **first text node's ink rect** (`Range` + `getClientRects`, not a pixel scan — four sections are opaque) is **96.0 ±1** desktop, **64.0 ±1** mobile. Hero is exempt and reads **96.0** by its own spec.
9. **Token removal.** Blank `{{VAT_NUMBER}}` and re‑render: the next section's top edge moves up by **exactly 64.0px**, hairline count = rowCount + 1, no two hairlines adjacent. Blank `{{ACCREDITATIONS}}`: the fallback string renders and the row does **not** disappear.
10. **Ink to ink.** The hero panel's top edge y = the hero `--bar`'s ink top y, and its bottom edge y = the strapline's baseline y, both ±1. The three service cards' bars, title cap‑tops, lower hairlines and link baselines each share one y within 0.5px.
11. **Gold floats.** No gold element's bounding rect comes within 2px of any sibling's or parent's border.
12. **Radius.** No computed `border-radius` on the page exceeds 2px.

---

## 3. Colour

Two hues. The gold exists in two steps because the logo gold measures 2.31:1 on cream and the page sets 11px gold labels on four cream sections. Every ratio below is computed, not estimated.

### 3.1 The complete custom property block

```css
:root {
  color-scheme: light;

  /* ---- 1. BRAND PRIMITIVES (lifted from the SVG, unaltered) ---- */
  --brand-green: #1B3A2B;   /* .cls-1 — the three letterform elements */
  --brand-gold:  #CBA135;   /* .cls-2 — the E bar and all 21 strapline glyphs */

  /* ---- 2. DARK GROUNDS ---- */
  --green-900: #10251A;   /* header, hero, For Contractors, footer */
  --green-800: #16351F;   /* raised surface on green-900 (mobile menu panel) */
  --green-700: #1B3A2B;   /* = brand green. Coverage band, hero panel, buttons on cream */
  --green-600: #24503A;   /* SURFACE + HOVER ONLY. Never a text ground for gold (3.80) or muted (4.32) */

  /* ---- 3. GOLD, two steps split by ground family ---- */
  --gold-500: #CBA135;    /* DARK ONLY. g900 6.68 | g800 5.56 | g700 5.15 — AA */
  --gold-600: #B8912E;    /* pressed state of a gold fill (fg 5.48) */
  --gold-300: #D9B65A;    /* hover for gold text/icon on dark (g900 8.29) */
  --gold-ink: #8A6220;    /* LIGHT ONLY. cream-50 5.22 | cream-100 4.83 | white 5.46. Floor is 4.83 */

  /* ---- 4. LIGHT GROUNDS ---- */
  --cream-50:      #FBFAF6;
  --cream-100:     #F3F1E9;
  --surface-field: #FFFFFF;

  /* ---- 5. TEXT ON LIGHT ---- */
  --ink-900:   #14201A;   /* cream-50 16.07 | cream-100 14.84 */
  --body-700:  #41504A;   /* cream-50  8.14 | cream-100  7.51 */
  --muted-600: #5F6B64;   /* replaces the brief's #7C877F, which is 3.57 and FAILS. 5.33 | 4.92 */

  /* ---- 6. TEXT ON DARK ---- */
  --on-dark:       #FBFAF6;  /* g900 14.27 | g800 11.88 | g700 11.01 */
  --on-dark-body:  #C9D4CB;  /* g900 10.57 | g800  8.80 | g700  8.16 */
  --on-dark-muted: #A8B5AC;  /* g900  7.58 | g800  6.31 | g700  5.85 | g600 4.32 FAIL */

  /* ---- 7. RULES ---- */
  --rule-light:        #E3DFD4;
  --rule-light-strong: #D6D1C2;                 /* rules that span the full measure */
  --rule-dark:         rgba(251,250,246,0.14);  /* HORIZONTAL rules on dark */
  --rule-dark-strong:  rgba(251,250,246,0.24);  /* VERTICAL dividers on dark — see §2.5 rule 3 */
  --rule-accent-dark:  #CBA135;                 /* 1px is enough on dark (6.68) */
  --rule-accent-light: #CBA135;                 /* MINIMUM 2px on cream: at 1px and 2.31 a gold hairline dies */

  /* ---- 8. BUTTONS ---- */
  --btn-gold-bg:            #CBA135;
  --btn-gold-fg:            #10251A;  /* 6.68. NEVER white on gold (2.42) */
  --btn-gold-bg-hover:      #D9B65A;  /* fg 8.29 — lifts, never dulls */
  --btn-gold-bg-press:      #B8912E;  /* fg 5.48 */
  --btn-green-bg:           #1B3A2B;
  --btn-green-fg:           #FBFAF6;  /* 11.92 */
  --btn-green-bg-hover:     #10251A;  /* fg 15.45 */
  --btn-ghost-dark-border:  rgba(251,250,246,0.45);  /* 4.21 on g900, clears the 3:1 minimum */
  --btn-ghost-dark-fg:      #FBFAF6;
  --btn-ghost-dark-hover:   rgba(251,250,246,0.08);

  /* ---- 9. FOCUS — one treatment legal on every ground ---- */
  --focus-ring:    #CBA135;
  --focus-keyline: #10251A;
  /* outline:none; box-shadow: 0 0 0 2px var(--focus-ring), 0 0 0 4px var(--focus-keyline); offset 2px */

  /* ---- 10. FORM ---- */
  --field-bg:           #FFFFFF;
  --field-border:       #8F8877;  /* 3.53 on white. An input border is a UI component: 1.4.11 needs 3:1 */
  --field-border-hover: #5F6B64;
  --field-border-focus: #1B3A2B;
  --field-text:         #14201A;
  --field-placeholder:  #646F68;  /* 5.23 on white */
  --field-hint:         #5F6B64;

  /* ---- 11. STATE — functional only ---- */
  --state-error:   #8E2419;  /* cream-50 8.32 | on white 8.69. Far in VALUE from gold, so it can never read as a mis-rendered accent */
  --state-success: #1B3A2B;

  /* ---- 12. LOGO — inline the SVG, drive both classes from here ---- */
  --logo-letter: #1B3A2B;   /* .cls-1 */
  --logo-accent: #CBA135;   /* .cls-2 */

  /* ---- 13. GEOMETRY ---- */
  --measure:     1180px;
  --cols:        12;
  --gutter:      20px;
  --col:         calc((100% - 11 * var(--gutter)) / var(--cols));
  --pitch:       calc(var(--col) + var(--gutter));
  --void:        calc(var(--col) + 2 * var(--gutter));
  --page-gutter: 24px;
  --pad-surface: 32px;      /* the ONLY horizontal inset on the page */

  --r:           2px;       /* the single radius literal. minor dimension >= 14px */
  --r-0:         0;         /* every inner edge, every rule, every cell, anything under 14px */

  --bar-w:       48px;  --bar-h:    14px;
  --bar-sm-w:    16px;  --bar-sm-h: 5px;

  --text-measure: 640px;    /* ~62ch at 17px. Every free-running paragraph */

  /* ---- 14. TYPE ---- */
  --font: var(--font-archivo), 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --w-text: 400;  --w-ui: 600;  --w-mark: 800;
  /* cap-trim constants — GENERATED from the shipped woff2, do not hand-edit */
  --trim-top: 0.3648;  --trim-bottom: 0.3652;
}

/* ---- GROUND SCOPES — set on the <section>; children are then legal by construction ---- */
.ground-cream, .ground-cream-100 {
  --ground: var(--cream-50);
  --micro: var(--gold-ink);   --bar-fill: var(--gold-ink);
  --heading: var(--ink-900);  --body: var(--body-700);   --muted: var(--muted-600);
  --rule: var(--rule-light);  --rule-strong: var(--rule-light-strong);
  --numeral: var(--gold-ink);
  --logo-letter: #1B3A2B;     --logo-accent: #1B3A2B;
}
.ground-cream     { background: var(--cream-50); }
.ground-cream-100 { background: var(--cream-100); --ground: var(--cream-100); }

.ground-green-900, .ground-green-800, .ground-green-700 {
  --micro: var(--gold-500);   --bar-fill: var(--gold-500);
  --heading: var(--on-dark);  --body: var(--on-dark-body); --muted: var(--on-dark-muted);
  --rule: var(--rule-dark);   --rule-strong: var(--rule-dark-strong);
  --numeral: var(--gold-500);
  --logo-letter: var(--on-dark); --logo-accent: var(--gold-500);
}
.ground-green-900 { background: var(--green-900); --ground: var(--green-900); }
.ground-green-800 { background: var(--green-800); --ground: var(--green-800); }
.ground-green-700 { background: var(--green-700); --ground: var(--green-700); }

@media (min-width: 1024px) { :root { --page-gutter: 48px; } }
@media (max-width: 1023px) { :root { --cols: 8; --gutter: 16px; } }
@media (max-width:  767px) { :root { --cols: 4; --gutter: 16px; } }

/* ---- ENVIRONMENT GUARDS ---- */
@media (forced-colors: active) {
  .card, .field, .fact-row { border: 1px solid CanvasText; }
  .bar { forced-color-adjust: none; background: Highlight; }
  :focus-visible { outline: 3px solid Highlight; outline-offset: 2px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; }
}

/* ---- GLOBAL ---- */
html { scroll-behavior: smooth; }
:target, [id] { scroll-margin-top: 88px; }
@media (max-width: 767px) { [id] { scroll-margin-top: 64px; } }
body { font-family: var(--font); font-synthesis-weight: none; font-synthesis-style: none;
       hyphens: none; -webkit-hyphens: none; background: var(--cream-50); color: var(--body-700); }
h1, h2, h3 { text-wrap: balance; }
p { text-wrap: pretty; max-width: var(--text-measure); }
```

### 3.2 Colour rules

- **Gold is never running type.** No heading, no body, no card title, no link label at body size. The only gold type on the page is the 11px micro label (the strapline's exact role) and the strapline itself. The bold clause of the For Contractors headline is **not** gold — devices.json F9 and palette.json F8 sanctioned that once; it is withdrawn, because gold on a headline would be the first time on the page that gold behaves differently from the artwork, in the section the primary audience reads hardest.
- **Gold's allowlist, closed:** the accent bar, the micro labels, the live strapline, 1px hairlines on dark / 2px marks on cream, the focus ring, the Process numerals (`--gold-ink`), and exactly **one** filled object — the primary CTA. *This enumerated list replaces logodna's "5% of container area" ceiling, which is unimplementable because "container" is undefined and the same button is 0.9% of the hero and 47.6% of its own button row.*
- **Orange `#C2622A` is deleted.** It measures **1.71:1 against the brand gold** — same value, separated only by hue — so it would read as the gold rendered on a mis‑profiled screen.
- **Headline split is by weight only, both clauses at full ink**, on every ground, no exception.
- **`--green-600` is a surface and hover colour only.** Never a text ground for gold or muted.

---

## 4. Type

### 4.1 Family: one variable grotesque, Archivo

Delete the brief's serif (Fraunces / Newsreader / Source Serif 4) and delete Inter / Plus Jakarta Sans. The mark is a **monolinear squared grotesque with flat, square‑cut terminals and no stress axis**; a modulated transitional serif beside it reads as a second brand. And the lockup is **monotypographic** — a two‑family site would be the first thing on the page that the identity itself does not do.

Match the **strapline**, not the mark: the mark's E measures ink‑width/cap = **1.0601** and its S **1.0773** — wider than tall, i.e. drawn artwork no text face reaches (Helvetica Neue Bold: 0.759). The strapline is real type with sharp 90° corners and no radius.

**Archivo Variable (wght axis only).** American gothic grotesque: monolinear, flat horizontal cap terminals, rectangular counters with tight turns, a genuine 100–900 axis so 400 and 800 are real masters. Second choice if 800 renders soft: Chivo.

**Reject on the squared‑counter test:** Outfit, Poppins, Figtree, Plus Jakarta Sans, Manrope — all built on a true circle or soft bowls, against a mark whose counters are straight orthogonal walls turned by a large 28.06 sweep. One‑sentence version for the handover: *set a capital O next to the logo's E; if the O is a circle, the face is wrong.*

**Do not ship the wdth axis.** The logo's own *type* is normal width; only the bespoke mark is extended. Extending the site type copies the wrong half of the lockup.

```ts
// app/fonts.ts
import { Archivo } from 'next/font/google';
export const archivo = Archivo({
  subsets: ['latin'], display: 'swap', variable: '--font-archivo',
  fallback: ['Helvetica Neue','Helvetica','Arial','sans-serif'],
  adjustFontFallback: true, preload: true,
});   // omit `weight` (ships the whole wght axis in one file); omit `axes` (no wdth download)
```

`font-synthesis-weight: none` is set because it prevents a smeared faux 800 on any platform whose fallback family has real masters. **Note the cost honestly:** the cap‑trim constants are bound to Archivo's metrics, so during the swap window trimmed elements shift slightly. `adjustFontFallback` holds CLS near zero; it does not hold it at zero.

**Delete the brief's text wordmark fallback** (`IES` in a serif at 600 / `ELECTRICAL SERVICES` at 10px / 0.28em). Wrong face, wrong weight, wrong name under client decision 1, tracking ~5× the brand's own, and structurally impossible at 1.0601 ink/cap. The condition it guards against does not exist: Asset 1 and Asset 2 are inlined as React components with `fill: var(--logo-letter)` / `var(--logo-accent)`. Note the deletion in the README.

**Acceptance test before committing the family.** Render `H` at 100px. At 800 the vertical stem must be **15.0–16.5px** (target 15.6 = 0.2172 × cap at cap/em 0.72). At 400 it must be **8.5–9.5px**. If 800 measures under 14.5px, use 900 for the bold clause and record it in the README. *This test, not any derived figure, is the authority.*

### 4.2 Scale

Desktop. Every value: `size / line-height px / weight / tracking`.

| Token | Spec | Use |
|---|---|---|
| `--t-display-1` | 56 / 64 / **400 light + 800 bold** / −0.01em | h1, once per page |
| `--t-display-2` | 40 / 48 / 400 + 800 / 0 | every section h2 |
| `--t-numeral` | 56 / 56 / 800 / 0 / `tabular-nums lining-nums` | Process 01–04 |
| `--t-title` | 22 / 32 / 600 / 0 | service card + process step titles |
| `--t-value` | 20 / 24 / 600 / 0 / tabular | hero panel values **only** |
| `--t-lead` | 19 / 32 / 400 / 0 | hero sub, section subs |
| `--t-body` | 17 / 28 / 400 / 0 | all paragraphs **and fact‑table values** |
| `--t-ui` | 16 / 24 / 600 / 0 | buttons, nav, form labels, inputs |
| `--t-meta` | 15 / 24 / 400 / 0 | footer links, form hints |
| `--t-legal` | 14 / 24 / 400 / 0 | footer bottom bar, field errors |
| `--t-strapline` | 12 / 16 / 400 / **+0.06em** uppercase | the live ELECTRICAL \| RENEWABLES |
| `--t-micro` | 11 / 16 / **600** / **+0.12em** uppercase | the six section eyebrow labels |

The text cluster tops out at **22** and the display cluster starts at **40** — a **1.82×** gap with nothing in it. There is no 24, 26, 28, 30, 32 or 36px step anywhere. *State it as "the mid‑range is deliberately empty, in the spirit of the mark's refusal of intermediate values." Do not claim it reproduces the artwork's 12:1 or 7.29:1 ratios; it does not.*

Everything is sentence case except the two uppercase objects — micro label and strapline — which is the logo's own division: the brand contains no lowercase, so uppercase is the brand voice and lowercase is information.

**Mobile (<768) changes exactly six values:** `--t-display-1` 34/40, `--t-display-2` 26/32, `--t-numeral` 40/40, `--t-value` 18/24, `--t-lead` 17/28, `--t-body` 16/24. Everything else is identical at both widths. **At ≤360:** `--t-display-1` 30/36 (the 320px measure is 272px and 34px runs to seven lines).

### 4.3 The headline device

**Light clause weight 400, bold clause weight 800.** Not 300/600.

Measured: the logo's own light‑to‑heavy stem ratio is **1.746**. A grotesque at 400 measures ~0.124 stroke/cap and at 800 ~0.210, giving **1.69** — within ~3% of the artwork. Weight **300** measures ~0.105, giving **2.07**, i.e. **19% more contrast than the logo ever uses**; the page would be more extreme than the identity it is derived from, and a 4.2px cream stroke on green-900 blooms. Weight **700** measures ~0.19, ~12% under the mark, and the split visibly softens.

Markup as two spans with a real space, driven from `lib/content.ts` as a typed pair so an author cannot forget the device:

```ts
type Headline = { light: string; bold: string };
```

### 4.4 Tracking — four values, nothing else

`+0.12em` micro label · `+0.06em` strapline · `−0.01em` h1 · `0` everywhere else.

The brief's `0.18em` is **three to five times the logo's own tracking**. Measured from the strapline's 21 glyph boxes: flat‑sided pair ink gaps average 2.453 units on a 10.21 cap = 0.240 cap, which nets out to roughly **+0.05em** against real grotesque sidebearings. `0.18em` produces an ink gap ~0.45 cap, nearly double the artwork. The brief's `0.28em` strapline fallback is ~5× and is deleted with the fallback itself.

The strapline gets `0.06em` because that is the artwork. Micro labels get `0.12em` — double the brand's own so an 11px all‑caps line does not fuse, two thirds under the brief's.

**Do not apply display negative tracking of −0.02 to −0.04em.** Measured, the mark is *not* negatively tracked: its letter gaps are 0.180 and 0.149 cap against natural bold gaps of 0.193 and 0.085. Its density comes from extension (E ink/cap 1.0601) and stroke mass. −0.01em on the h1 is an optical‑size normalisation, not a style, and anything more makes left‑edge alignment harder on the client's first priority.

**No "fit test."** The artwork has no advance‑per‑cap constant to reproduce: ELECTRICAL spans 8.57 cap heights and RENEWABLES spans 9.58 — same character count, 11.8% apart. The line was tracked once until it hit a 199.64 measure; that is a fitted one‑off, not a reusable metric.

### 4.5 The strapline set as live text

Client decision 1 puts `ELECTRICAL | RENEWABLES` on the page in real type. Every dimension is fixed by the artwork, and **the pipe is drawn, not typed.**

```css
.strapline {
  font: 400 12px/16px var(--font);
  letter-spacing: .06em; text-transform: uppercase;
  font-variant-ligatures: none; white-space: nowrap; width: fit-content;
  color: var(--micro);                 /* #CBA135 on dark, #8A6220 on cream — from the ground scope */
  margin-left: -0.075em;               /* per-glyph LSB, measured off Archivo */
  margin-right: -0.06em;               /* the trailing letter-space */
}
.strapline__sep {
  display: inline-block; width: 1px; height: 11px; margin: 0 6px;
  vertical-align: -1.26px; background: currentColor;
}
```

Formulas behind those numbers so they survive a font change, with `C` = the shipped cap/em:
`height = 1.292 × C × font-size` · `width = 0.098 × C × font-size, rounded up to 1px` · `side margins = 0.700 × C × font-size` · `vertical-align = −0.146 × C × font-size`.

Measured source: separator rect 1.00 × 13.19 at y 87.12–100.31; cap band y 88.61–98.82 (height 10.21, centre 93.715); separator centre **also 93.715**; overshoot **exactly 1.49 (14.59%)** each end; separator width / letter stroke = **0.787**; side ink gaps 7.16 and 7.14 = 0.70 cap, twice a normal word space.

```html
<span class="strapline t">ELECTRICAL<span class="strapline__sep" aria-hidden="true"></span>&#8203; RENEWABLES</span>
```
Do **not** put an `aria-label` on it: on a plain span it is unreliable, and where honoured it replaces the visible words. A real space (or a visually hidden one) after the drawn pipe is the fix.

**Strapline cap height is 13.72% of the mark's cap**, not 18% — the 18% figure in the working notes is the *separator's* height (17.73%), and sizing live text from it would oversize by 29%.

**Size matching, footer:** render the inlined lockup at **168px wide** (not 180). At 168 its baked‑in strapline cap measures 8.5919px against the live 12px strapline's 8.64px — a 0.05px difference, so the page never shows two sizes of the same line. At 180 the artwork strapline would render 6.6% larger. The mark inside that lockup is 62.6px tall.

### 4.6 Figures

`.num { font-variant-numeric: tabular-nums lining-nums; }` on: both insurance amounts, the company number, the VAT number, the four Process numerals, the phone number, the footer year. Verify at install that the shipped subset carries `tnum` (render `1111` and `0000` at 20px, compare widths); if not, do **not** fake it with letter-spacing — set the panel values in a grid with a right‑aligned numeric column instead.

### 4.7 Links, no‑wrap policy, errors

- **Links:** `text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px;` Hover changes colour only (`--gold-300` on dark, `--gold-ink` on cream). **No thickness change, no translate, no motion.** The underline is the only remaining affordance signal on a page with no icons, so it is always present, never hover‑only.
- **No‑wrap policy.** Every ink budget below assumes a line count. Ship character budgets in `lib/content.ts` and assert them in the content audit: h1 light ≤ 30, h1 bold ≤ 62 (3 lines at 56/64 across 680); hero sub ≤ 130 (2 lines at 19/32); each h2 ≤ 46 (1 line at 40/48 across 680); each section sub ≤ 96; service card body ≤ 180 (5 lines at 17/28 across 316); `{{AREAS_COVERED}}` ≤ 44 characters — it appears in the hero sub, the fact table and the Coverage h2, so a long string silently adds a line to two headline‑scale elements.
- **Errors:** `--t-legal` at 600 in `--state-error`, preceded by `--bar-sm` in the same colour, `role="alert"`, plus the field border at `--state-error`. Never colour alone.

---

## 5. Page specification

Ground sequence: **Header green‑900 · Hero green‑900 · Services cream‑50 · For Contractors green‑900 · Process cream‑50 · Coverage green‑700 · Enquiry cream‑50 · Footer green‑900.** No two dark body sections adjacent. Section padding **96 desktop / 64 mobile**, uniform on both ground families.

**The section header stack — one spec, six uses, no exception:**
`--bar` (48×14, `--bar-fill`) · **16** · micro label · **16** · h2 · **24** · sub · **48** · content.
The bar's 16px clear space is the artwork's own aperture rule: the E's counter openings measure 14.79 and 14.99 against an arm stroke of 14.99 — space equals ink to within 1%.

### 5.1 Header — 88px, green‑900, permanent

A cream header cannot acquire a hairline "once scrolled" when it already sits on a green‑900 hero; the seam is visible from pixel zero. So: **permanent green‑900 rail, `position: sticky; top: 0`, 88px, with a permanent 1px `#CBA135` hairline on its bottom edge.** Against the hero it is invisible and the fold reads as one uninterrupted 776px dark field; over cream it reads as a nameplate rail. Zero JS, one logo state.

Same `Container` as every other section (ref 6 aligns its header to its content; refs 1/2/3/5 use a wider header and break the line).

- **Mark:** inlined **Asset 2** (mark only, no strapline), rendered at **40px tall × 107.32px wide** (40 × 199.64/74.41). Left edge on L1, `margin-inline-start: 0` — **the mark defines L1 and takes no optical correction**, because it is orthogonal with a flat full‑weight stem on the leading I, so its box edge *is* its optical edge. Top y24, ink centre y44.
- **Right cluster**, anchored to L13: primary CTA (48 tall, right edge 1180, top y20) · 24 · `{{PHONE}}` as a `tel:` link · 24 · 1px vertical divider, 14px tall, centred y44 · 24 · nav *Services / For Contractors / Contact*, 24px gaps, 48px hit areas at top y20. Nav cap ink centre y44.
- **Nav links:** plain text, no container, no pill. 1px `#CBA135` underline on hover and focus (6.68:1 on green-900).
- **Mobile (<768):** 64px rail. Menu button = **three horizontal bars, 20 × 2px, 5px apart; the middle bar is `--gold-500`, the outer two `--on-dark`** — the C's own vocabulary with gold completing it. Open state replaces the button with the word **CLOSE** in micro‑label style preceded by `--bar-sm`, inside a 44px hit area. **There is no X.** The panel is green‑800, full‑bleed, radius 0 where it meets the viewport edge.

### 5.2 Hero — 688px, green‑900, y88 → y776

**Split A.** Top padding 96, bottom padding 96, left stack ink 496 (62 units). At 1440 × 900 that leaves **124px of cream visible above the fold** — a ground change, which is a stronger "there is more" signal than an overlapping card.

**Left stack, C1–C7 (680), all left ink on L1:**

| | px |
|---|---|
| `--bar` | 14 |
| gap | 16 |
| micro label `ELECTRICAL CONTRACTORS` | 16 |
| gap | 16 |
| h1, 56/64 × 3 lines | 192 |
| gap | 24 |
| sub, 19/32 × 2 lines | 64 |
| gap | 48 |
| button row, 48 tall | 48 |
| gap | 32 |
| gold hairline, 1px | 1 |
| gap | 16 |
| live strapline | 16 |
| **total** | **496** |

**Buttons:** two, both 48 tall, 24px horizontal padding, **radius 2px**, 16px gap, sharing one baseline, left edges on L1. Primary = `--btn-gold-bg` ground with `--btn-gold-fg` text (6.68). Secondary = transparent with a 1px `--btn-ghost-dark-border` and cream text. **Width follows the label** — there is no fixed CTA width and no aspect lock; a 158px lock would overflow by 30px+ at any label longer than ~11 characters.

**The shared measure — the best detail on the page.** Set the gold hairline and the strapline beneath it to **exactly 320px**, left edge on L1, terminating on L4's inner edge (3 × 100 + 20 = 320). Compute the strapline's letter‑spacing **once at build time** within `[0.06em, 0.14em]` so its rendered width measures 320 ± 2px, measure with `getBoundingClientRect`, and hard‑code the value. Two objects of different weight and character, one exact measure — the artwork's own construction, reproduced literally.

*Do not size the hairline to the button row (devices.json F15). The button row is ~420–430px; landing a 23‑character 12px line on that measure needs ~+1.05em of tracking and gives a measure/cap of 53.9 against the artwork's 19.6, i.e. 2.75× out of proportion. 320px at 12px gives measure/cap ≈ 37 — still wider than the artwork but reachable at ~0.10em, which is inside the micro‑label range the page already uses. The measure is also unresolvable against the button row while the secondary label is a variable string.*

**Right: the compliance nameplate, C9–C12 (380 wide), `align-self: stretch`.**

Its top edge = the `--bar`'s ink top; its bottom edge = the strapline's baseline; height therefore 496px, driven by the left stack and computed by CSS, never hard‑coded. Ground `--green-700` on the `--green-900` hero — **one flat step, no gradient, no border, no shadow**, radius 2px. Padding 32 (ink line 832).

The brief asks for "the mark large at low opacity, nothing else." That is definitionally an empty box, and a faded mark reads as unfinished — the exact impression this deliverable exists to avoid. Contents instead, top to bottom:

1. Inlined **Asset 2** at **260px wide (97px tall)**, `--logo-letter: --on-dark`, `--logo-accent: --gold-500`, **full opacity**, left ink on 832.
2. 32.
3. Three `<dl>` rows, separated by 1px `--rule-dark` horizontals, `min-height: 72px`, growing to fill the panel's slack (at reference content they render 86). Each row: micro label (gold) over `--t-value` (white), cap‑tops aligned, not baselines.
   `COMPANY NUMBER {{COMPANY_NUMBER}}` · `PUBLIC LIABILITY {{PUBLIC_LIABILITY}}` · `EMPLOYERS LIABILITY {{EMPLOYERS_LIABILITY}}`
4. A 44px link row, **"Full compliance detail"**, followed by `--bar-sm` at 8px clear, anchoring to `#for-contractors`. **No chevron.**

Degradation: an empty token removes its row and the survivors grow; at zero filled tokens the panel renders mark, strapline and link, and is still not an empty box. **Panel height is driven by the left stack; slack goes into row height, never into bottom padding.**

**Not rendered below 1024** — its three rows are a subset of the For Contractors table, so nothing is lost.

**There is no straddling strip and no compliance row.** The artwork contains no overlap of any kind: the bar floats with clear gaps on all sides, the three letters are tracked *nearly* touching, everything is orthogonal. The straddle was the one adopted device that argued with the construction, and the client has made the construction binding. Its payload — company number and both insurance figures — is already in the panel, in the fold, at the same position in the reading order. The four commitment lines return to their brief position inside For Contractors (§5.4). **Net: one module fewer, one invented device fewer, and the fold still answers the vetting question without scrolling.**

**Mobile hero (<768):** content‑driven height, 48px top and bottom padding, expected ~695px at reference copy, y64 → ~y759, leaving ~85px of cream above an 844 fold. Both buttons full‑width, 48 tall, 16px gap. Panel not rendered.

### 5.3 Services — cream‑50, padding 96

Section header stack C1–C7, left aligned on L1. Three cards at C1–C4 (0–380), C5–C8 (400–780), C9–C12 (800–1180).

**Card:** 380 wide, `min-height: 320px` (40 units), 1px `--rule-light` border, radius 2px, **no shadow**. Padding 32 (ink line 32 / 432 / 832). Internal template `grid-template-rows: auto auto 1fr auto`, giving six horizontal lines every card shares: card top edge · bar top at +32 · title cap‑top · body cap‑top · lower hairline · link baseline = card bottom.

Stack: 32 pad · `--bar` 14 · 24 · title `--t-title` · 16 · **body slot, `min-height: 128px`** · 24 · 1px hairline running the card's full **inner** width (32→348, terminating on the text line, not the border) · 20 → **use 24** · link row `--t-ui` · 32 pad.

**The pin:** `.card-body { min-height: 128px }` (16 units = five trimmed lines at 17/28 = 124.37 + tolerance). The brief's three bodies are 177 / 150 / 119 characters ≈ 5 / 4 / 4 lines at a 316px measure. The lower hairline and link row then land at an identical y in all three cards regardless of copy. *Sized to the copy that exists — a 184px pin would put ~56px of dead air in every card including the longest.* Do **not** solve card equality by shortening card 1, padding cards 2 and 3, or letting cards size to content.

**Weighting the primary audience:** card 1 (*Commercial and Contracting*) sits on `--cream-100`, cards 2 and 3 on `--cream-50`. One step of ground, no accent spent. *Chosen over devices.json F7's inverted black card: in a three‑card row an inversion is a third of the section and it spends the section's accent budget to shout.*

**Link rows, identical on all three cards**, text + 8px + `--bar-sm`: card 1 → `#for-contractors`; card 2 *For homeowners and landlords* → enquiry form with type preselected `Homeowner`; card 3 *Enquire about renewables* → enquiry form. Using the same device three times is the house style applied to links, and it stops the domestic route being conspicuous by being the only card with one.

Card copy: remove **"and for new build plots at volume"** → *"for single properties and for new build plots."* "At volume" is a capacity claim about labour and plant, not a scope claim.

**Tablet:** 2‑up at C1–C4 / C5–C8 with the third full width. Never 3‑up below 1024 — 3 × 4 columns of an 8‑column grid does not exist.

### 5.4 For Contractors — green‑900, padding 96, Split B

Left C1–C4 (380): the section header stack, micro label `FOR MAIN CONTRACTORS`. Right C6–C12 (680).

**Fact table.** Label column C6–C8 (**500→780, 280px**) — 280 clears the longest label (`EMPLOYERS LIABILITY` ≈ 178px at 11/600/0.12em) by ~100px so no label can wrap; a single wrapped micro‑cap among six one‑line labels is a visible alignment failure. Gutter 20. Value column C9–C12 (**800→1180, 380px**), which takes a two‑line `{{REGISTERED_ADDRESS}}`.

- Values are `--t-body` (17/28), not `--t-value`. **Cap‑top aligned, not baseline** — at a 17/11 size pair, baseline alignment displaces the cap tops by 4.37px and gives the same hairline two different clearances.
- Hairlines run **x500 → x1180 only**, never to L1: a rule under the heading column would imply the heading is a table row. Colour `--rule-dark-strong`.
- **Rule mechanics: `border-top` on every row plus `border-bottom` on the `<dl>` container. Never `border-bottom` per row.** Rules then always equal rowCount + 1 and every rule is adjacent to a rendered row on both sides, so removing any row in any position can never orphan, double or trail a rule.
- Row `min-height: 64px`, `padding-block: 16px`, `align-items: start`, both cells cap‑trimmed. (16, not 20 — 20 is off the spacing scale and would fail checklist step 7.)
- **Row order, fixed:** PUBLIC LIABILITY · EMPLOYERS LIABILITY · COMPANY NUMBER · VAT NUMBER · AREAS COVERED · REGISTERED OFFICE · ACCREDITATIONS. The two rows that can exceed one line sit **last**, where a wrap cannot move anything above them, and ACCREDITATIONS always renders (list or fallback) so it never disappears.
- **Three token states, not two.** Type every fact as `string | 'pending' | null`. Filled → label + value. `'pending'` → label + *"Available on request"* in `--muted`. `null` → row removed, rules recomputed. **Insurance rows must never fall back to a number.**

**Four commitment lines**, below the table, 48px rows, no rules, text on L6. Each led by `--bar-sm` (16×5, gold) hanging **right‑aligned to x476** in the void — 24px clear of L6 — and **vertically centred on the first line's cap‑height centre, not its line‑box centre**. This is where the tick was; a bar is the stronger mark here because the four lines are statements of scope, not a feature comparison.

**Order — "One named contact for the whole job" moves to first.** It is the one true differentiator a weeks‑old firm has, and the references put their team proof in exactly that slot. No headcount, no name, no photograph beside it.

**CTA:** gold, 48 tall, at C9–C12, so it shares the value column's left box line (800) and the table's right line (1180).

Below 1024 the void is gone and hanging stops: `li { padding-left: 40px; position: relative }` with the bar at `left: 0`. On desktop the text is on the line and the mark hangs; on mobile the mark is on the line and the text indents. Either way the master line carries ink.

**Mobile:** rows stack label‑over‑value, `min-height: 88px` (104 at ≤360), padding 24, label→value gap 8. Still whole units, so removal stays rhythm‑safe.

### 5.5 Process — cream‑50, padding 96, Split B

Left C1–C4 heading (`HOW WE WORK`). Right C6–C12: four rows separated by full‑width 1px `--rule-light-strong` hairlines, **96px row height**, all title and body ink on L6.

Numerals **01 02 03 04**, `--t-numeral` (56 / 800 / tabular / `--gold-ink`, 5.22:1), hanging **right‑aligned to x476**. Solid, not outlined: `-webkit-text-stroke` renders inconsistently and a hollow stroke is a construction the mark never uses. All four steps permanently open — no accordion, no toggle, no client JS.

This section carries the visual mass the references spend on a gallery: tall rows, full‑width rules, and the page's largest type after the h1.

### 5.6 Coverage — green‑700, padding 96

Kept as its own band (not merged into Enquiry) so the ground alternation holds and the acceptance checklist stays as written. Left‑aligned on L1, **not centred**: the logo contains no centred relationship anywhere — the strapline is *justified* to the mark's measure, which is an edge‑to‑edge relationship — and a centred block has no reusable left edge, so it would be the only composition on the page the mark cannot account for.

Stack: `--bar` · 16 · micro label `WHERE WE WORK` · 16 · h2 40/48 across C1–C8 (0→780) · 24 · sub across C1–C4. Its distinctness comes from being the only section with no right column — an open, quiet band. The pause is achieved by emptiness, not by centring.

### 5.7 Enquiry — cream‑50, padding 96, Split B

Left C1–C4: header stack (`GET IN TOUCH`), then `{{PHONE}}` and `{{EMAIL}}` as large tappable links.
Right C6–C12: form card, 680 wide, `--cream-100`, 1px `--rule-light`, radius 2px, padding 32 (ink line 532).

Inside the card the page grid stops and a nested grid begins: inner width 616 = two columns of 296 with a 24px gutter. Field height 48, label→field 8, field→field 24 (88px pitch per row). Submit 296 wide on the card's inner left line.

Segmented control (the page's only state control, and it is real — it changes the message field's label): selected = `--green-700` ground with `--cream-50` label (11.92); unselected = `--ink-900` on white with a `--field-border` boundary. Radius 2px on the shell, **0 on every internal segment division**. Never signal selection by colour alone — keep `aria-pressed` and a weight change.

Success copy: **"Thanks. That has reached us and we will come back to you today."** plus `{{PHONE}}` for anything urgent. (One word of grammatical voice from the brief's "you will get a reply today": it moves a statement about the reader's future to a statement about the company's intent, which is the only version the company can guarantee at the moment the message renders.)

### 5.8 Footer — green‑900, padding‑top 96, padding‑bottom 48

Four columns at C1–C3 / C4–C6 / C7–C9 / C10–C12 (280 each). Column heads on L1, L4, L7, L10.
Column 1 carries the **inlined Asset 1** lockup (token‑driven, `--logo-letter: --on-dark`, `--logo-accent: --gold-500`) at **168px wide**, left edge on L1 — not the flat white Asset 7, because the inline keeps the gold E bar and gold strapline the brand intends.
Then 64 · a full 1180 hairline (`--rule-dark`) · 24 · the bottom bar, left aligned on L1, items separated by 1px vertical dividers (`--rule-dark-strong`, 14.6% overshoot) · 48 bottom padding.

Bottom bar: `{{LEGAL_NAME}}` · company number · VAT (omitted when empty) · current year. `{{PHONE}}` in the contact column is preceded by `--bar-sm` — a telephone handset is unavoidably curved, so there is no phone glyph.

**No giant display type footer.** Both references that use one put a photograph behind it; the largest type in the IES identity is the mark itself, and the primary audience scrolls to a footer for a company number.

---

## 6. Truth constraints (carried forward, unchanged and binding)

- **Publishing `{{COMPANY_NUMBER}}` makes the page self‑auditing.** A supply‑chain manager who reads a company number types it into Companies House; the incorporation date is public. Every other assertion on the page must survive that same check. State this as the governing rule in the README.
- **Hero secondary CTA is "Request our capability statement"**, matching the For Contractors CTA verbatim, anchored to the form with the contractor type preselected and the *Send me your capability statement* checkbox pre‑ticked. The brief's "Download" asserts a file that does not exist, and a dead download on the one page whose pitch is that it publishes what competitors hide is the worst available failure.
- **`{{LEGAL_NAME}}` and `{{SITE_NAME}}` are separate tokens.** `{{LEGAL_NAME}}` appears in exactly two places — the footer bottom bar beside the company number, and JSON‑LD `legalName` — and must be copied character for character from the Companies House record. `{{SITE_NAME}}` defaults to *IES Electrical and Renewables* for the title tag. Everywhere else the page uses the wordmark and the logo strapline.
- **JSON‑LD: `Organization` only.** name, url, logo, areaServed. `address` only when `{{REGISTERED_ADDRESS}}` is filled, and only as a registered office. **Permanently forbidden, named in a comment in `layout.tsx`:** `aggregateRating`, `review`, `foundingDate`, `numberOfEmployees`, `award`, `slogan`. No `LocalBusiness` until a real publicly accessible trading address exists.
- **Accreditation fallback.** Default *"Applications in progress. Ask us where we are up to."* is itself a factual claim; gate it in the README and ship a second approved value, *"Accreditation status available on request."* Never write a scheme name, even prefixed with "applying for."
- **Name no standard, regulation, edition or scheme** anywhere — visible copy, alt text, SVG `<title>`, metadata. Certificates are described by what the client receives, not by the standard they are issued under.
- **Zero dates** other than the current year in the footer. No founding year, and equally **no honesty‑signalling copy** ("a new company," "recently launched"). Silence on age is the only honest position that also serves the goal.
- **Build‑time content audit**, `scripts/audit-content.ts`, fails the build on: the banned lexicon (*trusted, leading, award winning, established, proven, renowned, preferred, market leader, industry leading, years, since, founded, experienced, our clients, our projects, our team of, thousands, hundreds, over, more than, satisfied, guaranteed*), any standard/scheme name, any hyphen or en dash in visible copy, and any string exceeding its declared character budget (§4.7).
- **Ship with realistic sample values visible** (the brief's own examples), every one listed in the README as a `{{TOKEN}}` to replace, so the picture the client receives is fully populated and finished‑looking.
- **Zero image slots.** No labelled placeholder frames — a labelled empty frame is the second most reliable "unfinished comp" signal after a low‑opacity watermark. Document in the README where real site photography drops in.

---

## 7. Tailwind theme extension

```js
// tailwind.config.ts
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: { 900:'#10251A', 800:'#16351F', 700:'#1B3A2B', 600:'#24503A' },
        gold:  { 300:'#D9B65A', 500:'#CBA135', 600:'#B8912E', ink:'#8A6220' },
        cream: { 50:'#FBFAF6', 100:'#F3F1E9' },
        ink:   { 900:'#14201A' },
        body:  { 700:'#41504A' },
        muted: { 600:'#5F6B64' },
        onDark:{ DEFAULT:'#FBFAF6', body:'#C9D4CB', muted:'#A8B5AC' },
        rule:  { light:'#E3DFD4', lightStrong:'#D6D1C2' },
        field: { border:'#8F8877', placeholder:'#646F68' },
        state: { error:'#8E2419' },
      },
      fontFamily: { sans: ['var(--font-archivo)','Helvetica Neue','Helvetica','Arial','sans-serif'] },
      fontWeight: { text:'400', ui:'600', mark:'800' },
      fontSize: {
        micro:     ['11px', { lineHeight:'16px', letterSpacing:'0.12em', fontWeight:'600' }],
        strapline: ['12px', { lineHeight:'16px', letterSpacing:'0.06em', fontWeight:'400' }],
        legal:     ['14px', { lineHeight:'24px' }],
        meta:      ['15px', { lineHeight:'24px' }],
        ui:        ['16px', { lineHeight:'24px', fontWeight:'600' }],
        body:      ['17px', { lineHeight:'28px' }],
        lead:      ['19px', { lineHeight:'32px' }],
        value:     ['20px', { lineHeight:'24px', fontWeight:'600' }],
        title:     ['22px', { lineHeight:'32px', fontWeight:'600' }],
        d2:        ['40px', { lineHeight:'48px' }],
        num:       ['56px', { lineHeight:'56px', fontWeight:'800' }],
        d1:        ['56px', { lineHeight:'64px', letterSpacing:'-0.01em' }],
        // mobile
        'd1-m':    ['34px', { lineHeight:'40px', letterSpacing:'-0.01em' }],
        'd1-xs':   ['30px', { lineHeight:'36px', letterSpacing:'-0.01em' }],
        'd2-m':    ['26px', { lineHeight:'32px' }],
        'num-m':   ['40px', { lineHeight:'40px', fontWeight:'800' }],
        'value-m': ['18px', { lineHeight:'24px', fontWeight:'600' }],
        'lead-m':  ['17px', { lineHeight:'28px' }],
        'body-m':  ['16px', { lineHeight:'24px' }],
      },
      spacing: { 1:'8px', 2:'16px', 3:'24px', 4:'32px', 6:'48px', 8:'64px', 12:'96px' },
      borderRadius: { DEFAULT:'2px', none:'0' },   // no other radius exists
      maxWidth: { measure:'1180px', text:'640px' },
      screens: { sm:'768px', md:'1024px', lg:'1276px' },
      boxShadow: { focus:'0 0 0 2px #CBA135, 0 0 0 4px #10251A' },
    },
  },
  corePlugins: { boxShadow: true },
};
```

`spacing` is deliberately sparse: `p-5`, `gap-5`, `mt-7` etc. simply do not exist, so the banned values cannot be typed. `borderRadius` has exactly two entries, so `rounded-lg` does not exist either.

---

## 8. Knowing departures from the written brief

| # | Brief says | Ship instead | Reason, one line |
|---|---|---|---|
| 1 | Transitional/old‑style serif for headings (§4) | Archivo, one variable grotesque | The mark has zero stroke modulation and flat square terminals; a modulated serif beside it reads as a second brand. |
| 2 | Inter or Plus Jakarta Sans for body/UI (§4) | Archivo everywhere | The lockup is monotypographic; a second family is the first thing on the page the identity does not do. |
| 3 | Headline weights 300 / 600 (§4) | **400 / 800** | 300 gives a 2.07 contrast ratio against a mark that measures 1.746 — the page would be *more* extreme than the logo. |
| 4 | Micro labels at 0.18em (§4) | **0.12em** | The logo's own widely tracked line measures ~0.05em; 0.18em is 3–5× the brand's own tracking. |
| 5 | Strapline fallback at 10px / 0.28em (§4) | Deleted with the whole text wordmark fallback | ~5× the brand's tracking, wrong face, wrong name, and no text face reaches the mark's 1.0601 ink/cap. |
| 6 | Line height 1.6 (§4) | 17/28 = 1.647 desktop, 16/24 = 1.5 mobile | 27.2px sits on no grid; leading should fall as the measure narrows. |
| 7 | Gold rule across each service card's top (§6) | The floating `--bar` inset 32/32 inside the card | In the mark, gold **never touches** the structural form; a rule welded to a card edge is the one thing the artwork never does. |
| 8 | Four gold **tick** icons (§6) | `--bar-sm` in the same position | A checkmark is two 45° limbs and the artwork contains no diagonal anywhere. |
| 9 | Gold **outlined** Process numerals (§6) | Solid, 800, `--gold-ink` | `-webkit-text-stroke` is inconsistent across browsers and a hollow stroke is a construction the mark never uses. |
| 10 | Hero right panel = mark at low opacity, nothing else (§6) | The compliance nameplate, mark at full opacity | Low opacity + nothing else is definitionally an empty box; the panel's payload is 100% `{{TOKEN}}` facts, so it adds proof without adding a claim. |
| 11 | Coverage as one short **centred** block (§6) | Left aligned on L1 | The logo has no centred relationship anywhere; its strapline is *justified*, edge to edge. |
| 12 | Cream header with a scroll‑conditional hairline (§6) | Permanent green‑900 rail, permanent gold hairline | The brief contradicts itself — a cream bar on a green hero has a visible seam from pixel zero — and the constant rail is the only version that keeps the zero‑JS rule. |
| 13 | Hero secondary: *Download* our capability statement (§6, "final") | *Request* our capability statement | The brief itself uses "Request" two sections later, and a dead download on this page is the worst available failure. |
| 14 | Service card: "…and for new build plots **at volume**" (§6) | "…and for new build plots." | "At volume" is a capacity claim about labour and plant, which §1 forbids. |
| 15 | Success copy: "you will get a reply today" (§6) | "we will come back to you today" | Moves a promise about the reader's future to a statement of the company's intent, the only version guaranteeable at render time. |
| 16 | Tick line order fixed (§6) | "One named contact for the whole job" promoted to first | No words change; it moves the single true differentiator into the slot the references reserve for social proof. |
| 17 | `IES Electrical Services` hard‑coded (§6, §7) | `{{LEGAL_NAME}}` + `{{SITE_NAME}}` | A guessed legal name printed beside a Companies House number is a compliance risk, not a placeholder. |
| 18 | `LocalBusiness` + `Organization` JSON‑LD (§7) | `Organization` only | `LocalBusiness` asserts a customer‑facing premises a registered‑office company may not truthfully have. |
| 19 | `--muted-500 #7C877F` (§4) | `--muted-600 #5F6B64` | 3.57:1 fails the brief's own stated 4.5:1 requirement. |
| 20 | Orange `#C2622A`, "at most twice" (§4) | Deleted | 1.71:1 against the brand gold — same value, different hue, so it reads as a rendering fault. |
| 21 | Gold as a hairline colour, unqualified (§4) | 1px gold on dark only; on cream, 2px minimum | 1px `#CBA135` on cream at 2.31:1 is a smudge, not a hairline. |
| 22 | Gold micro labels, unqualified (§4) | `--gold-ink #8A6220` on cream, `#CBA135` on dark | WCAG's large‑text relief starts at 18.66px bold; 11px labels get none, so the brief's own contrast rule forbids the brief's own label colour. |
| 23 | A single gold focus ring (§7) | Two‑tone: 2px gold + 2px `#10251A` keyline | A pure gold ring is 2.31:1 on cream and fails the 3:1 focus‑indicator floor on four of the page's sections. |
| 24 | One accent per section (§4) | Services carries four gold objects | The brief itself mandates three gold card rules in that one section, so the section rule and the card rule already collide in the source document. |
| 25 | Max content width 1180 with an unqualified 96px section padding | 1180 kept; hero uses 96/96 with a 688px band | The brief's own numbers, arranged so the fold lands at 76.4vh — its "roughly 78vh." |

**Additions the brief does not contain** (flagged so the client sees them as deliberate): the hero compliance nameplate (§5.2), `{{LEGAL_NAME}}` / `{{SITE_NAME}}` (§6), the three‑state token model (§5.4), the content audit script (§6), and the removal of Coverage's redundancy by leaving `{{AREAS_COVERED}}` in the hero sub, the fact table and the Coverage h2 with a 44‑character budget.

---

## 9. What survives from the six references, and what does not

### Carried over

| Device | From | Kept because |
|---|---|---|
| Left heading / right content split, repeated | ref 6 | It is why ref 6 reads as rigorous, and it collapses to four recurring vertical lines. |
| Full‑width hairline rules between tall list rows | ref 6 | The mark's own vocabulary is horizontal bars; this is the fact table and the Process section. |
| Short vertical hairline dividers | refs 3, 4, 5, 6 | The strapline pipe is exactly this object — but cut to the ink height + 14.6% overshoot, never running edge to edge. |
| Zero‑padded numerals 01–04 | ref 3 | Numeric typographic texture describing a method rather than an inventory. |
| Header aligned to the content container | ref 6 | Refs 1/2/3/5 use a wider header and break the page's master lines at the first object the eye lands on. |
| Solid + outline paired CTAs | refs 1, 3, 5 | Two actions, one baseline, both left edges on L1 — as rectangles, not pills. |
| One card weighted in a row | refs 2, 3 | Adopted as a one‑step ground change (cream‑100), not an inversion. |
| Near‑monochrome restraint, air as composition | ref 6 | The only reference of the six whose layout is buildable truthfully with no photography and no achievement numbers. |
| Micro eyebrow label above every heading | refs 2, 5 | Kept, re‑coloured by ground, and now led by the brand's own bar rather than a generic rule. |

### Rejected, each traced to the logo property that kills it

| Device | Seen in | Logo property | Substitute |
|---|---|---|---|
| Pill CTAs and pill nav containers | all six | Radius is absolute and renders at 1.3–3.1px; a 48px pill needs 24px, i.e. **12× too round**. Also: a pill's leading edge is a curve, so it has no box edge to align and its correction differs by height. | 48px rectangles, radius 2px, 24px padding. Nav = plain text links with a 1px gold underline, no container. |
| Circular icon badges, avatars, seals | refs 2, 3, 4, 6 | **Not one closed circular path in the artwork.** A circle has no edge to align — it can only be centred on a line, never aligned to one. | Nothing (the page ships no icons). Where ref 6 puts a circular row icon, the row carries `--bar-sm` hanging in the void. |
| Rotating "GET IN TOUCH" badge | ref 3 | Circle + diagonal in motion + brief §5's motion ban. | Nothing. Removed with no replacement. |
| Chamfered / cut corners | ref 1 | A chamfer is a 45° diagonal, and it is a third corner language beside the mark's softened outers and square inners. | Radius 2px on all four outer corners, 0 on every inner edge. |
| Lightning glyph, "Learn more →", chevrons, ticks, close X | refs 1, 5, 6 + brief §6 + structure.json | All built from 45° limbs; the mark's only near‑diagonal is a 0.46° optical correction below the perception threshold. | One object replaces all five: the accent bar, at two sizes. |
| Card row straddling the hero's bottom edge | refs 1, 4, 5 (adopted by structure.json + devices.json) | **The artwork has no element crossing another element's boundary.** The bar floats with clear gaps on all sides; the letters are tracked *nearly* touching, which is deliberate non‑contact. | No strip at all. Its payload is in the hero panel; the four commitments return to For Contractors; the 124px cream tail carries the "more below" signal. |
| Glassmorphic translucent blurred cards | ref 4 | The mark is four flat opaque fills with hard edges. Translucency also makes every contrast ratio a range instead of a number. | Opaque planes: `--green-700` on `--green-900`, `--green-800` for the mobile menu. |
| Orange wireframe render, blue circuit glow, gradient grounds | refs 1, 4 | Perspective lines and circuit traces are diagonals; a glow is a soft‑edged circle; a gradient makes contrast unverifiable. | Flat `--green-700` nameplate on flat `--green-900`, one hard step, mark at full opacity. |
| Soft pastel tinted rounded icon squares | ref 5 | Large radius on a small object — the exact inverse of the mark's rule — plus tints in a palette whose mark holds two flat colours and no intermediate tones. | Invert, never tint. Not needed here, since no icons ship. |
| Gold/yellow band or panel as a section ground | refs 1, 2 | Gold is ~1/7 of the mark's ink and appears as one small object plus one supporting line. A gold ground inverts the mark's figure and ground. | Gold's closed allowlist (§3.2), with exactly one filled object: the primary CTA. |
| Two‑tone headline coloured by hue | ref 5 | Gold on a headline would make gold a letterform in a place the mark does not, and it fails at 2.31:1 on cream. | Weight split only, both clauses at full ink, every ground, no exception. |
| Floating pill labels with hairline borders ("50W", "NX‑456", "SUN POWER") | refs 1, 2, 3 | Pill geometry fails the radius rule; a translucent hairline‑bordered label fails the flat‑opaque rule; and the content is invented specifics. | The `--bar` + micro label pair on a solid token ground, carrying real section labelling. |
| Escalating radius ladder (button 6 → card 12 → panel 16) | implicit in all six, and the default of every UI framework | The 2.34 literal appears 33 times and never grows with the element. **This is the failure most likely to arrive by habit rather than by copying.** | One literal: 2px. Anything above 2px is a build error. |
| Client logo strips, stats rows, star ratings, testimonials, team avatars, project galleries, video cards, carousels, portfolio counters | all six | Not a logo property — the truth constraint. Every one asserts clients, history, headcount, reviews or a body of work that a weeks‑old company does not have, and the company number the page publishes lets anyone confirm that in under a minute. | Compliance facts in the same slots; deleted slots become air, following ref 6. |
| Inset hero card with equal margins | refs 3, 6 (adopted by devices.json F4) | Both references fill it with strong photography, which IES has none of, and the nested container breaks the master left line between 1180 and 1276. | Full‑bleed dark hero — which is also the mark's own composition: elements sitting directly on an open ground with no frame. The plane‑within‑a‑plane gesture is the green‑700 panel. |
| Giant display type footer ("LETS TALK") | refs 2, 3 | The largest type in the identity is the mark itself; both refs need a photograph behind theirs. | The inlined lockup at 168px in footer column 1. |

---

## 10. Open questions — these genuinely need the client

1. **The legal name.** `{{LEGAL_NAME}}` must be copied character for character from the Companies House record. It appears beside the company number and in JSON‑LD `legalName`, and a guess there is a misstatement, not a placeholder. This blocks the footer bottom bar and the structured data.
2. **Whether accreditation applications have actually been submitted.** The default fallback string *"Applications in progress. Ask us where we are up to."* is itself a claim. If nothing has been lodged, ship *"Accreditation status available on request."* One of the two must be confirmed before the ACCREDITATIONS row can render.
3. **Whether the same‑day response commitment is one they will honour.** It is asserted twice on the page — the Process line and the enquiry headline. Both are forward commitments, which a new company can truthfully make, but they become a service level the moment they are published. The README lists them under *"Promises this page makes on your behalf."*
4. **Whether a capability statement exists as a file, and when.** The hero and For Contractors CTAs both say *Request*. If a real PDF appears, the change to *Download* is one string in `lib/content.ts` — but shipping *Download* now would put a dead link on the page's highest‑value action for the primary audience.
5. **Whether a registered office is the only address.** `LocalBusiness` structured data and any "visit us" language stay out until there is a real trading address with public access. If one exists, that changes the schema and adds a Coverage‑section option.
6. **Whether they intend to trade renewables under a separate identity.** Client decision 1 puts `ELECTRICAL | RENEWABLES` on the page as live text and it is half the name as the logo reads it, but the brief's h1 and service copy lead with electrical installation. If renewables is a second trading arm rather than a second half of one company, the h1's bold clause needs to carry it, and that is a copy decision the content owner has to make.