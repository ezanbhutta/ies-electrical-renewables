# Final craft report — IES Electrical Services

**Adversarial pass:** 40 candidates, 0 FALSE_POSITIVEs dropped, 8 duplicate pairs merged → **32 findings** (24 real defects, 8 taste calls). Where a verdict corrected a proposed fix, the corrected version is what appears below.

---

## REAL DEFECTS

### 1. `.t` cap-trim is a no-op in Chrome and Safari — the entire spacing premise is false there
**`app/globals.css:254`** — `@supports (text-box: trim-both cap alphabetic)` sets `text-box: trim-both` but only zeroes the fallback pseudos' margins; `content:''; display:block` from lines 236–241 still applies. A block-level pseudo at each edge means there is no first/last *line box* to trim, so the property computes and does nothing. Firefox (negative-margin fallback) gets the spec rhythm; Chromium and Safari do not.
Measured, Chrome 148: `#services h2` = 96.00px, not 76.80. `#commitments .chip span.t` = 16px, not 7.92. Section header ink gaps = **12.29 / 30.31 / 42.28** against the specified **8 / 16 / 24** — ratio 1 : 2.46 : 3.44 instead of 1 : 2 : 3. Document height 8595 instead of 7957: **638px, 7.4% of the page, is unintended whitespace.**
**Fix:** in the `@supports` block, replace `.t::before, .t::after { margin: 0 }` with `content: none`.
**Proof:** `#services h2` reports height **76.80**, and the Commitments header gaps read exactly 8.00 / 16.00 / 24.00.
*Land this first — findings 2, 14 and 21 change value once it does.*

### 2. Services 3-up breaks its own six shared lines — 12px at 1440, 88px at 1024
**`components/Services.tsx:31, 34`** — the doc comment (lines 5–13) promises six shared horizontal lines pinned by `minHeight: 128`. Measured at 1440: body heights **140 / 128 / 128**, hairline tops **282 / 270 / 270**, link tops **307 / 295 / 295** — two of six lines broken. At 1024 (card 273px) "Commercial and Contracting" wraps: h3 heights **64 / 32 / 32**, hairline tops **1704 / 1672 / 1616** — an **88px spread across three adjacent cards**, three of six lines broken. A pixel constant cannot hold across widths.
**Fix:** line 31 — add `minHeight: 64` to the h3 (reserve two title lines); line 34 — replace `minHeight: 128` with `flex: '1 1 auto'` on the body.
**Proof:** at 1440 *and* 1024, `[...document.querySelectorAll('#services article')].map(a=>a.querySelector('div[aria-hidden]').getBoundingClientRect().top)` returns three identical values.

### 3. From 768–1023 every full-width block is half-width and every centred head is 193px off-centre
**`components/Services.tsx:54`, `Commitments.tsx:27`, `Process.tsx:31`, `Coverage.tsx:17`, `ForContractors.tsx:122`, `Hero.tsx:69`** — blocks declare `col-span-4` and `md:col-span-N` only. `globals.css:203` drops `--cols` to 8 at ≤1023, so `col-span-4` = **half the grid**. Measured at 900px (container 72..828, centre 450): all six render **72..442**, and all five `.reveal-chip` centres read **257.0 against a page centre of 450.0**. The hero headline is crammed into 370px next to 386px of empty photograph (the panel is `hidden md:flex`).
**Fix:** `col-span-4 sm:col-span-8 md:col-span-12` on the five full-width blocks; `col-span-4 sm:col-span-8 md:col-span-7` on Hero.tsx:69. `sm` is 768px, exactly the 8-column breakpoint.
**Proof:** at 900px every chip centre equals the container centre, 450.

### 4. The hero panel stops one whole column short of the right measure
**`components/Hero.tsx:127`** — `md:col-span-4` with no `col-start`, so auto-placement lands it on columns 8–11. Measured at 1440: panel **832.5..1222.3** against the container's right edge **1324.8**, which 41 other blocks share. The void column the component's own comment specifies (Hero.tsx:8, "content C1-C7 | void C8 | panel C9-C12") does not exist. On the first screen, the page's right margin visibly steps out by 8.5% of the viewport the moment you scroll past the hero.
**Fix:** add `md:col-start-9`.
**Proof:** the panel's right equals `.ies-container`'s right (1324.8) and its left reads 934.9 (L9).

### 5. Nine of eleven display headlines break on a function word
**`app/globals.css:541`** (`text-wrap: balance` equalises lengths, not syntax) with copy in **`lib/content.ts`**. Extracted at 1440 by walking text nodes and grouping Range rects by top: h1 ends line 1 on "for"; For Contractors splits "supply / chain" *and* "asks / for"; Gate ends on "The"; Who ends on "a", then splits "can / check"; Commitments ends on "on"; Coverage ends on "and"; Questions ends on "they"; Enquiry ends on "and"; Services splits "one / standard". Only Handover and Process break cleanly. Recurs at 768.
**Fix:** bind pairs with U+00A0 inside the clause strings in `lib/content.ts`. **Three pairs cannot be reached that way** — "hold to on / every" and "scope and / we" straddle the light/bold junction, and "they / ask" straddles the accent slice: for those, replace the word-space join at `Primitives.tsx:108` and `Hero.tsx:78` with U+00A0 on h1/commitments/contact, and extend `faq.accent` to include the preceding word.
**Proof:** re-run the line-box walk — no non-final line matches `/\b(a|an|the|and|or|of|to|for|in|on|at|we|you|by|with)$/i`; count goes 9 → 0. (`scrollWidth - clientWidth` was 0 on every heading when tested live.)

### 6. Brand gold appears on none of the five cream sections; the token built to carry it is dead
**`app/globals.css:318`** — `.ground-cream .accent-word` overrides to `var(--gold-ink)` (#8A6220). Live: all four dark accents compute `rgb(203,161,53)`, all five cream ones `rgb(138,98,32)`. Meanwhile `--rule-accent-light: #cba135` (line 50) has **zero references** anywhere in `app`, `components`, `lib` or `scripts`, and three comment blocks (Primitives.tsx:74–77, globals.css:299–306, globals.css:50) all assert the true gold is carried on both grounds. The underline device was chosen *precisely because* a rule is not text and clears the text-contrast rule; abandoning that leaves it with no rationale.
**Fix:** line 318 — `linear-gradient(var(--rule-accent-light), var(--rule-accent-light))`. The word above stays `--ink-900` at 16.07:1, so no text contrast changes. Rewrite the three comments to state the actual rule.
**Proof:** `getComputedStyle(document.querySelector('#services .accent-word')).backgroundImage` returns `rgb(203, 161, 53)`.
*Honest caveat: #CBA135 is 2.31:1 on cream. Look at the 2px rule on screen before deciding whether the cream variant needs `background-size: 100% 3px`.*

### 7. The Gate is pushed 144px clear of the block above it by two stacked margins
**`components/ForContractors.tsx:121`** (`ies-grid mt-12`, 96px) wrapping a grid item whose child is **`Gate.tsx:114`** (`mt-6`, 48px). Grid items establish independent formatting contexts, so the margins cannot collapse. Measured at 1440: CTA bottom 2220 → Gate top **2364**, a **144.00px** gap. Not on the 8/16/24/32/48/64/96 scale, 1.5× the section padding, and the largest single interval on the page — 75% as strong as a real section break, inside one section, immediately before a second header stack. It is why For Contractors measures 1778px, 2.68× the median body section.
**Fix:** delete `mt-6` from Gate.tsx:114 and let the wrapper's `mt-12` own the gap.
**Proof:** CTA-bottom to Gate-root-top = exactly 96; `#for-contractors` height falls 1778 → 1730 (→ ~1577 with finding 1).

### 8. Section top to first ink is 100px everywhere except the hero, where it is 96px
**`app/globals.css:284`** — `.chip { display: inline-flex }` puts an atomic inline box on a line box whose strut ascent is 18.13px (Manrope hheaAsc 1.066em × 16 + 1.07 half-leading) against the chip's synthesised baseline at 14px: **+4.13px**. Measured: all ten chip-bearing sections report 100.00; the hero, which renders `<Bar>` directly (`Hero.tsx:70`, `display:block`), reports 96. Top padding reads 100 while bottom reads 96, so every band is optically bottom-heavy — and the hero, the section everything else is compared to, is the odd one out.
**Fix:** `.chip { display: flex; width: fit-content }` and add `margin-inline: auto` to the centred rule at lines 294–297. (`vertical-align: top` also works.) Do **not** change section padding to 92 — that leaves the hero wrong.
**Proof:** `section.querySelector('.bar').getBoundingClientRect().top - section.getBoundingClientRect().top` = 96 for all eleven.

### 9. For Contractors is both left-aligned and centred, which the composition rule forbids twice
**`components/Gate.tsx:119`** — `align="centre"` on a second SectionHeader inside a section that already has a left one (`ForContractors.tsx:72-77`). Measured at 1440: chips at **x=115.2 and x=656.5** — two heading axes, 700px apart, in one green band. And the centred head sits over a five-row label/value fieldset — `Primitives.tsx:119-122` states the rule mechanically: "CENTRED when the content below is a symmetric row of equal cards. LEFT when the content below is a table, a form, a list. Never both in one section." This is the only section that breaks it, which is what makes it read as a mistake rather than a variation.
**Fix:** drop `align="centre"` from line 119. The Gate stays full width; only its head changes axis (and it inherits the left-wipe reveal every other left head uses).
**Proof:** both `#for-contractors .chip` x values return 115.2.

### 10. The Gate's label/value table shares no column line with the fact table 200px above it
**`components/Gate.tsx:154`** — value block is `md:col-span-9 md:col-start-4` on a full-width 12-col fieldset. Measured at 1440: Gate label **115.2..402.6**, Gate values **422.6..1324.8**; the fact table above is dt **627.5..914.9**, dd **934.9..1324.8**. Two label/value tables of identical visual character, four column lines where the system promises three. The comment at Gate.tsx:150-152 claims the options "start on L9 … like every value in the table above" — they start on **L4, 512.3px** to its left.
**Fix:** put the Gate on the section's own 5/7 axis — label `col-span-4 md:col-span-5`, value `col-span-4 md:col-span-7 md:col-start-6 max-sm:mt-2`. 7 columns = 697.3px of run against the 380px the comment says is needed, so nothing wraps. Rewrite the comments at lines 140 and 150-152 in the same commit.
**Proof:** the Gate value block's x equals the fact table dt's x (627.5), and no element in the section reports x=422.6.

### 11. Every FAQ answer starts 12px left of the question it answers
**`components/CommonQuestions.tsx:56`** — `paddingLeft: 28` against a question indented by `BarSm` (16px) + `mr-3` (24px) = 40. Measured at 1440, all six rows: column line 627.53, question text **667.53**, answer text **655.53**. The identical construction in `WhatWeHandOver.tsx:54` measures exactly 40, so 40 is the house value and 28 is simply wrong (it is also off the 8/16/24/32/48 scale). The accordion's left edge is a 12px sawtooth down the most-read section on the page.
**Fix:** `paddingLeft: 'calc(var(--bar-sm-w) + 24px)'`.
**Proof:** a Range over the summary text span and over the answer paragraph in the same `<details>` both report 667.53.

### 12. `max-md:mt-6` drops the right column 48px while the columns are still side by side
**`ForContractors.tsx:80`, `WhoDoesTheWork.tsx:65`, `WhatWeHandOver.tsx:43`, `CommonQuestions.tsx:37`, `EnquiryForm.tsx:246`** — `max-md` is ≤1023, but at 768–1023 both halves are `col-span-4` on an 8-col grid, i.e. level. Measured at 900px, all five: left tops **1988 / 4730 / 6190 / 8133 / 9494**, right tops **2036 / 4778 / 6238 / 8181 / 9542** — a uniform 48px stagger. In Hand Over it is the framed photograph hanging 48px above its own heading.
**Fix (minimum, keeps the two-up tablet composition):** change `max-md:mt-6` to `max-sm:mt-6` on all five. ForContractors.tsx:80 already carries both, so there it is a pure deletion.
**Proof:** at 900px each split's two children report equal `y`.

### 13. The 3-up service row becomes 2 + 1 orphan at 768–1023, under a centred header
**`components/Services.tsx:18`** — `sm:col-span-4` on an 8-col grid is half a row. Measured at 900px: cards at **[72..442, y1106]**, **[458..828, y1106]**, **[72..442, y1489]**, leaving 458..828 empty. The centred header no longer has a symmetric row to be centred over — which is the system's own stated precondition for CENTRED. Three cards do not divide eight columns.
**Fix:** `col-span-4 sm:col-span-8 md:col-span-4` — 1-up at tablet, 3-up at 1024.
**Proof:** at 900px the three card widths are equal and no row holds two cards with a hole beside them.

### 14. The small bar is aligned by its bottom edge, not its centre, on both list marks
**`components/CommonQuestions.tsx:49`** (`mt-[11px]`, 22/32) and **`components/WhatWeHandOver.tsx:54`** (`mt-[9px]`, 17/28). From Manrope's live metrics (cap 0.72em, asc 1.07em, desc 0.30em) the cap-band centre is 16.55px and 14.43px from box top; the 5px bar's centres sit at 13.5 and 11.5 — **3.01px and 2.89px high**, more than half the bar's own height. Both values reproduce exactly as `capCentre − barHeight` instead of `capCentre − barHeight/2`: one systematic derivation error, not two optical nudges. Eleven rows across two sections read as a mark floating above the line rather than beside it.
**Fix:** derive it once — `.bar-sm--inline { margin-top: calc(0.5lh + 0.023em - var(--bar-sm-h) / 2) }`, where 0.023 = (hheaAsc − hheaDesc − cap) / 2·upm, the same metrics that generate `--trim-top`/`--trim-bottom`. **After finding 1 lands**, the box top becomes the cap top and the rule becomes `calc((0.72em - var(--bar-sm-h)) / 2)`. Fix the trim first, then set this once.
**Proof:** `(barTop + 2.5) − (textTop + 0.5×lineHeight + 0.023×fontSize)` is under 0.5px on both; today it reads −3.01 and −2.89.

### 15. The framed handover photograph declares a shape its file does not have, and is still the dark-ground grade
**`components/WhatWeHandOver.tsx:34-35`** declares `width={1800} height={760}` (2.368:1). `file public/band.jpg` reports **1600×1200** (1.333:1), confirmed on the served file. Rendered box is 594.8×715, so `object-cover` scales to 953×715 and **discards 37.6% of the image width** — and that number grows whenever the right column's copy gets longer, because the text drives the height. Luminance histogram over the source: **median 0.130, p95 0.556, max 0.579** — it never reaches a highlight, against cream-50 at 0.955. The comment at lines 12–16 claims it "runs at its full tonal range" on the flipped ground; the asset was never re-graded. A near-black 594×715 plate beside a light text column is the heaviest object on any cream section and breaks the 6/6 balance the component exists to hold.
**Fix:** correct the attributes to `width={1600} height={1200}`; re-grade `band.jpg` for a light ground (median ≈0.35–0.45, p95 ≥0.80). **Keep `h-full object-cover`** — the proposed `aspectRatio: '4/3'` renders 594.8×446 beside a 715px column and trades a crop problem for a 269px hole.
**Proof:** `[i.naturalWidth, i.naturalHeight]` matches the declared pair; re-run the histogram — median clears 0.30, p95 clears 0.80.

### 16. The 40px h2 is the only display size on the page with zero tracking
**`tailwind.config.ts:39`** — `d2: ['40px', { lineHeight: '48px' }]`, no `letterSpacing`; live h2s compute `letter-spacing: normal`. But `d1` 56px, `d1-m` 34px and `d1-xs` 30px all carry −0.01em (lines 41–43), so **30px and 34px are set tighter than 40px** — the curve is non-monotonic. Between 768 and 1023 the inversion is on one screen at one time: SectionHeader renders `text-d2` (40px, tracking 0) while Hero renders `sm:text-d1-m` (34px, −0.34px). This spec sets 20 clauses across ten sections; a 40px headline at tracking 0 reads as unset next to an h1 that is tracked.
**Fix:** `d2: ['40px', { lineHeight: '48px', letterSpacing: '-0.01em' }]`; then `d2-m` → −0.005em and `d1` → −0.02em so the curve is monotonic.
**Proof:** line counts per headline are unchanged — measured `[2,3,2,3,2,2,2,3,3,2]` at normal, −0.01em and −0.02em — and `scrollWidth − clientWidth` stays 0.

### 17. Commitments opens its content 97px below the header where its two sibling card rows use 48px
**`components/Commitments.tsx:38, 40`** — a `mt-6` hairline followed by a second `mt-6` on the `<ul>`. Measured at 1440: header wrapper bottom 4199 → rule 4247 → list **4296**, total **97px box / 105.7px to ink**. Services: header bottom 1066 → cards 1114 = **48.0**. Process: 5666 → 5714 = **48.0**. Three centred 4-up rows on one page, opening at two different distances, one at double the spec.
**Fix:** drop the hairline wrapper (line 38) so the `<ul>`'s own `mt-6` carries the specified 48, or split the 48 around the rule (`mt-3` / `mt-3`).
**Proof:** header-bottom to content-top reads 48 (or 49 with a retained 1px rule) in all three; today 48 / 97 / 48.

### 18. The hero's header stack uses 16px where the Chip primitive uses 8px
**`components/Hero.tsx:70-73`** — hand-built as `<Bar>` + `mt-2` micro + `mt-2` h1. Measured: bar bottom 199 → micro top **215 (16px)**. Every Chip section measures **8px** for the same two objects (`.chip { gap: 8px }`, globals.css:287). The spec is bar / 8 / label / 16 / h2 / 24 / sub. Same three objects, two spacings, and the divergent one is above the fold.
**Fix:** replace lines 70–73 with `<Chip className="reveal-chip">{hero.micro}</Chip>`, keeping `mt-2` on the h1. Combined with finding 8, the hero's first ink also lands at 96 alongside everything else.
**Proof:** hero bar-bottom to micro-top = 8.

### 19. Coverage's headline is over its own budget, and the audit is structurally blind to it
**`lib/content.ts:451`** — `light: \`Based in ${company.areasCovered},\`` = **49 characters against `budgets.h2` = 46**. `scripts/audit-content.ts:95-110` checks the `.bold` clause of every h2 and the `.light` clause of **none**, so the only headline that overruns is the only one the audit cannot see. Consequence: Coverage is the sole *centred* h2 running to three lines, ragging **513.0 / 589.3 / 557.4** — a 76.3px spread on a header-only band where the headline *is* the entire composition. It is also the only headline in the file with no `accent` key, so the weakest-composed head is the least branded one.
**Fix:** add `county: 'West Yorkshire'` to the `company` object and set line 451 to `` `Based in ${company.county},` `` (24 chars) — do **not** hardcode the string; `areasCovered` is tokenised in eight places and is still needed by the fact row, the meta title and the FAQ. Add `.light` entries for all seven h2s to `audit-content.ts:99-108`. Give `coverage.headline` an `accent` key on a bold-clause substring.
**Proof:** `npm run audit:content` fails on the current string and passes on the shortened one; the Coverage h2 renders two lines with a spread under 60px.

### 20. The FAQ answer stops 57px inside the rule that frames it, and runs to 81 characters
**`app/globals.css:122`** — `--text-measure: 640px` in a system where everything else is derived (`--measure-ratio: 84%`, `--col` from `--cols`/`--gutter`, `Primitives.tsx:153-154` building measures as column calcs). Measured at 1440: the open FAQ answer's right edge is **1267.5** while the accordion hairline bracketing it ends at **1324.8** — the section has two right edges where the grid says one. Per-line character counts on the answers reach **81**, against Bringhurst's comfortable ceiling of 75.
**Fix — in this order.** First drop the cap inside the accordion: `#questions .faq-row p { max-width: none }`. That fixes the right edge *and* removes the 81-char line by letting the 7-column measure govern. Narrowing `--text-measure` first would widen the visible gap from 57.3px to ~102px.
**Proof:** the answer paragraph's right edge equals the accordion rule's, 1324.8; longest line falls from 81 characters to the column's own count.

### 21. One body span opts out of `.t`, and the checkbox beside it rides 2.4px high
**`components/EnquiryForm.tsx:322, 324`** — the span at 324 is the **only** childless 17px/400 non-anchor element on the page without the `t` class (verified by DOM sweep). The 20px checkbox at 322 carries an off-scale `marginTop: 2`: measured centre **7926** against a label cap centre of **7928.43**, −2.43px. It is the last control before submit and the only checkbox on the site.
**Fix, sequenced:** land finding 1, then add `t` to the span, then set `marginTop: -4` (with the trim working the cap band is 0–12.24px, so a 20px control centres at −3.88). If the trim fix is deferred, set `marginTop: 4` and leave the span alone.
**Proof:** `checkbox.top + 10` minus the label's cap centre is under 0.5px; today −2.43. *Note: while `.t` is inert, this span currently renders identically to its neighbours in Chrome — it is a live Firefox-only inconsistency that becomes an 8.31px error everywhere the moment the trim is repaired.*

### 22. The enquiry form's inner grid invents a 24px gutter
**`components/EnquiryForm.tsx:276`** — `gap-3` = 24px (tailwind.config.ts:50) against `--gutter: 20px`. Measured at 1440: cells **659.5..964.2** and **988.2..1292.8**, a 24px column gap inside a 633.3px box. Every other nested grid on the page — fact table, Who Does The Work, CTA row, Gate — inherits `column-gap: var(--gutter)` from `.ies-grid` and comes out at 20. This is the only 24px column gutter in the layout.
**Fix:** `gap-y-3` plus `style={{ columnGap: 'var(--gutter)' }}`.
**Proof:** `getComputedStyle(grid).columnGap` returns `'20px'`, rowGap stays `'24px'`.

### 23. The footer's phone link is indented 24px past the rest of its own column
**`components/Footer.tsx:72-84`** — the phone `<li>` is a flex row with a leading `BarSm` (16px) + `gap-1` (8px); the email and address `<li>`s have no mark. Measured at 1440, contact column: heading **1037.4**, phone link **1061.4**, email **1037.4**, address **1037.4**. Footer columns are the purest alignment test on a site and this is the only one of four that fails it.
**Fix:** hang the mark, don't delete it — Footer.tsx:73-75 documents why the bar is there ("a telephone handset is unavoidably curved, so there is no phone glyph anywhere on this page"). `<li className="flex items-center gap-1" style={{ marginLeft: 'calc(-1 * (var(--bar-sm-w) + 8px))' }}>`.
**Proof:** all four items in that column report x = 1037.4.

### 24. Selecting a Gate option changes its width and shifts the row
**`components/Gate.tsx:175`** — `fontWeight: on ? 'var(--w-mark)' : 'var(--w-ui)'` on an `inline-flex` label with fixed 16px padding, inside a `flex flex-wrap` row where width is intrinsic. Measured by toggling weight in place: "£1m" 64.01→65.06, "£2m" 66.64→67.46, "£5m" 66.59→67.22, "£10m" 74.27→75.84. Every option to the right of the picked one moves. The component's own comment at Gate.tsx:194-196 promises "answering a row moves nothing" — true of the answer slot below, false of the option row above it.
**Fix:** reserve the bold width — `data-label={o.label}` plus a hidden `::before` at `var(--w-mark)` in the same grid area, so the box is always sized at 800 and only the visible glyphs change weight.
**Proof:** record every `.gate-opt` left edge, click each option in each row, assert no left moves by more than 0.01px.

---

## TASTE CALLS — the page is already correct here; only preference is available

### T1. The four 5/7 heading rails run 62% / 45% / 38% / 3% empty
`EnquiryForm.tsx:234`, `ForContractors.tsx:71`, `CommonQuestions.tsx:32`. Measured (column height / ink / void): contact **806 / 306 / 0.62**, for-contractors **531 / 290 / 0.45**, questions **471 / 290 / 0.38**, who-does-the-work **298 / 290 / 0.03**. The 290px is the header stack's fixed height; the right column is unbounded. Nothing in the grid or the composition rule is broken — the split is doing exactly what a split does. But the Enquiry rail strands half a page of cream beside the page's single most important control, and one composition behaving four different ways down one page is the inconsistency the brief is asking about.
**If you want it:** `md:sticky md:self-start` with `top: 'calc(89px + 32px)'` on all three, so the rails pin and track the form/table beside them. Verified: the contact column collapses to 306px and holds at 120px from the viewport top. No containment wrapper is needed for For Contractors — the Gate is a sibling grid, so the sticky context already ends at the split row.
**Proof:** `(colHeight − inkHeight) / colHeight` → ~0 on all four.

### T2. Commitments' centred sub ends on a 106px stub and is wider than the headline above it
`Primitives.tsx:154` gives every centred sub a 6-column measure (594.8px) while the headline gets 8. Measured: the sub breaks **564.9 / 106.2** (second line 18.8% of the first) and that 564.9 first line is **12.3px wider than the h2's widest line, 552.6** — the silhouette inverts at the bottom of a centred stack. Coverage's single-line sub is fine, which is why this is a measure question, not a copy one. Changing `subMeasure` to `calc(5 * var(--col) + 4 * var(--gutter))` re-breaks it to **467.8 / 203.3**, inside the h2; Coverage stays on one line. This is a real inversion, but it is one section and the remedy is a global measure change — your call.
**Proof:** `max(sub line widths) < max(h2 line widths)` — today 564.9 > 552.6.

### T3. Two headlines put the weight change on a sentence boundary
`lib/content.ts:224` (gate) and `:295` (who) are the only two `light` clauses ending in a full stop; the other nine end on a comma or mid-phrase, matching the device documented at `Primitives.tsx:66-68`. The reader meets sentence-final punctuation, one space and a 400-unit weight jump at the same point, so the contrast is decorative rather than structural. Gate compounds it by orphaning "The" onto the light line. Both remedies are rewrites, so this is editorial preference against a documented rule — *"Set your own thresholds and / the answers are already above."*, *"You cannot check a track record, / but you can check the people."* Both keep their existing `accent` substrings.
**Proof:** `!/[.!?]$/.test(h.light)` passes for all eleven Headline objects.

### T4. `.num` applies tabular figures to running text
`app/globals.css:476`. `lining-nums` is genuinely inert — Manrope ships no oldstyle set (measured identical to `normal`). `tabular-nums` is not: the footer phone measures **105.30px tabular vs 99.31 normal**, "£10,000,000" **103.05 vs 97.95**, because Manrope's proportional `1` is 0.39em and its tabular `1` is 0.62em. None of the six running-text sites (`Header.tsx:76,141`, `Footer.tsx:79,113`, `EnquiryForm.tsx:237,262`) is a column where a digit needs to line up with a digit above it. **Drop `lining-nums`** (free) and strip `.num` from those six. **Leave `Process.tsx:51` alone** — tabular is what makes 01–04 a uniform 49.60px set (normal gives 45.13 / 51.13 / 50.60 / 51.56); and leave the two stacked value lists (`ForContractors.tsx:46`, `Hero.tsx:31`), which are the one conventional home for it here.

### T5. `lead-m` duplicates `body` byte-for-byte, and four size steps sit inside 3px
`tailwind.config.ts:47` is identical to `:35`. `legal` 14/24, `meta` 15/24, `ui` 16/24, `body` 17/28 are four steps across 3px — ratios 1.071 / 1.067 / 1.063, all under the ~1.125 a reader resolves as deliberate. Fifteen live specs counted off the DOM. The visible part is the footer stacking 15/24 links above a 14/24 legal line in the same column: two greys a pixel apart, too close to read as a level. Collapse `legal` into `meta` (`Footer.tsx:113`, `EnquiryForm.tsx:126,332`) and delete `lead-m`; live spec count 15 → 12. *One correction to the case for it: the claim that lead and body are indistinguishable below 768 is false — most body copy is overridden to `text-body-m` (16/24) there. The real collision is `EnquiryForm.tsx:240,260,324` and the hero sub across 768–1023.*

### T6. Centred micro labels sit 0.66px off the bar's axis
`app/globals.css:284` + `tailwind.config.ts:30` — CSS appends the 0.12em (1.32px) letter-space after the final glyph too, and `align-items: center` centres the bar over the *box*. Measured on all five centred chips: bar centre 720.00, box centre 720.00, ink centre **719.34**. Invisible at 1x. It earns a line only because the correction already exists 200 lines up in the same stylesheet for the same reason (`globals.css:339`, `margin-right: -0.06em`, with the comment explaining exactly this) and was never applied to the 29 micro labels. `.chip .text-micro { margin-right: -0.12em }` — no effect on left-aligned chips.

### T7. `.nav-lnk` measures 45.86px where every other control is 48
`app/globals.css:368` — `padding-block: 12px` on an element with no `display`, so the padding measures from the 21.86px font content area, not the 24px line box. Measured: 46.00px against the header CTA's exact 48.00. The header is `items-center`, so nothing shifts and no client will see it. `display: inline-block` makes it 48. An auditor's finding, not a designer's.

### T8. Commitments' 4-up leans right; the hero panel's hairlines land on fractions
Two cosmetic mass/pixel notes, both defensible as shipped. **Commitments** (`lib/content.ts:195-200`): items 1–2 render two lines (ink bottom 3868), items 3–4 render three (3900) — a single 32px step at the midpoint of a section whose own comment calls it a symmetric beat. Reorder the array to **3, 1, 2, 4** — free, no side effects, symmetric about the centre axis. Do **not** add `display:flex` to the span at `Commitments.tsx:51`; that turns `.t::before/::after` into flex items and breaks the cap-trim contract on that element. **Hero panel** (`Hero.tsx:25`): three `flex-1` rows split 279.41px of slack, so the 1px `--rule-dark` borders land at **348.59 / 441.73 / 534.87** and split across device rows at 1x. Leave it — `Hero.tsx:123-124` explicitly documents "slack goes into row height, never into bottom padding", and pinning the rows contradicts that. If it reads soft on a 1x monitor, raise the rule's alpha on that panel only.

---

## The single change

**`app/globals.css:254` — replace `margin: 0` with `content: none` in the `@supports` block.** One declaration. It makes the section header stack measure 8 / 16 / 24 to ink instead of 12.3 / 30.3 / 42.3, removes 638px (7.4%) of unintended whitespace, ends the two-different-rhythms split between Firefox and Chromium, and makes the page's founding claim — that a declared padding measures to visible ink — true for the first time. Findings 2, 14 and 21 are downstream of it. (Runner-up for pure perceptual payoff: `globals.css:318`, which puts brand gold back on the five cream sections.)

## Honestly, where this sits

The system underneath this page is more rigorous than most professional studio work — a derived container ratio, a mechanical composition rule, font-metric-generated trim constants, and comments that state their own reasoning — but a professional build is judged on whether the rendered page honours it, and right now the page's largest spacing mechanism is silently inert in Chrome and Safari, a card row staggers 88px at 1024, the tablet band is broken, and nine headlines break on a function word; fix those four and the page stops being an excellent system with a flawed render and becomes work that would survive a studio's own final craft check.