# IES — BUILD SPEC v2 (reference alignment)

## 0. The one change

**Give every section a single vertical mirror axis: kill the `md:col-span-1` void column, and put the section header (chip → headline → sub) on the container's own centre line, so the header and the content beneath it share one axis instead of the two, 666px apart, that the page currently has.**

Everything else in this spec is downstream of that sentence. Measured at 1440 (`--measure-ratio: 84%` → container 1209.6px, `--col` 82.467, pitch 102.467): today the heading block at C1–C4 has its axis at x=194.9, the content block at C6–C12 at x=861.0, and the container's own axis at x=604.8. Nothing sits on it. That same 4 / 1 / 7 arithmetic repeats in `ForContractors.tsx`, `WhoDoesTheWork.tsx`, `WhatWeHandOver.tsx`, `Process.tsx` and `EnquiryForm.tsx`. `Footer.tsx` — four `col-span-3` blocks filling C1–C12 — is the only section already built the reference way, and it is the template.

---

## 1. Global primitives — `components/Primitives.tsx`, `app/globals.css`, `tailwind.config.ts`

### 1.1 NEW `<Chip>` — replaces `<Bar/>` + micro label in every section head

The references' section heads open with a **closed, bordered box**. A box has a computable centre; a 48×14 bar over an 11px label at a different width has only a left edge, which is why nothing below it can line up on anything.

```tsx
export function Chip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`chip ${className}`}>
      <BarSm />
      <span className="t text-micro uppercase">{children}</span>
    </span>
  );
}
```

```css
.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding-inline: 12px;
  border: 1px solid var(--rule-strong);
  /* DECLARED BREAK from the mark's 14.48%-of-minor-dimension radius rule:
     32px minor gives 4.63px, which resolves to neither 2 nor 7. Takes 2px on
     the grounds that a rule drawn AROUND text is stroke scale, same family as
     the accent bar. Not a pill. Do not "fix" this to 7px. */
  border-radius: var(--r-bar);
  color: var(--micro);
  white-space: nowrap;
}
```

Colour needs no new token: `--micro` and `--bar-fill` already resolve to `--gold-ink` (#8A6220, 5.22:1 on cream-50) in `.ground-cream*` and `--gold-500` (6.68:1 on g900, 5.15:1 on g700) in `.ground-green-*`. `--rule-strong` likewise resolves per ground.

The full 48×14 `<Bar/>` is **retired from all six section heads** and keeps only its two earned jobs: the Gate answer slot in `Gate.tsx`, and the hero's own left-aligned opening mark. Two stacked marks above a centred headline is worse than losing one ornament, and the chip is the device the client pointed at.

### 1.2 NEW `<Chip>` reveal keyframe

`.reveal-bar` animates `ies-wipe` from `clip-path: inset(0 100% 0 0)` — it opens from the left edge regardless of `transform-origin`, so under a centred chip it opens off-axis. Add:

```css
@keyframes ies-wipe-centre {
  from { clip-path: inset(0 50% 0 50%); }
  to   { clip-path: inset(0 0 0 0); }
}
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .reveal-chip {
      animation: ies-wipe-centre 420ms cubic-bezier(0.2,0.7,0.3,1) both;
      animation-timeline: view();
      animation-range: entry 0% entry 40%;
    }
  }
  @supports not (animation-timeline: view()) {
    .reveal-chip { opacity: 0; }
    .is-in.reveal-chip { animation: ies-wipe-centre 420ms cubic-bezier(0.2,0.7,0.3,1) both; opacity: 1; }
  }
}
```
Left-aligned chips (Hero, ForContractors, Handover, FAQ, Enquiry) keep `reveal-bar`.

### 1.3 `SectionHeader` — the spine. Exact spec.

```tsx
export function SectionHeader({
  micro, headline, sub, id, as = 'h2',
  align = 'left',                       // 'left' | 'centre'
  headingClass = 'text-d2 max-sm:text-d2-m',
  children,
}: { /* … */ align?: 'left' | 'centre' })
```

**Rhythm, identical on both variants** (unchanged from today, and already correct — the 16px chip clear space is the artwork's own aperture rule):

```
chip · 16 · h2 · 24 · sub · 48 · content
```
i.e. `mt-2` on the headline, `mt-3` on the sub, `mt-6` on whatever the section renders next. The old `bar · 16 · micro · 16 · h2` collapses to one step because chip and label are now one object.

**`align="centre"` markup and measures:**

```tsx
<div className="col-span-4 md:col-span-12" style={{ textAlign: 'center' }}>
  <Chip className="reveal-chip">{micro}</Chip>

  <div style={{ maxWidth: 'calc(8 * var(--col) + 7 * var(--gutter))', marginInline: 'auto' }}>
    <SplitHeadline as={as} id={id} headline={headline} className={`${headingClass} mt-2 reveal`} />
  </div>

  {sub ? (
    <div style={{ maxWidth: 'calc(6 * var(--col) + 5 * var(--gutter))', marginInline: 'auto' }}>
      <p className="t text-lead max-sm:text-lead-m mt-3 reveal"
         style={{ color: 'var(--body)', marginInline: 'auto' }}>{sub}</p>
    </div>
  ) : null}
</div>
```

Measures are **grid arithmetic, not magic pixels**, so they stay correct at every `--cols` regime. At 1440 they resolve to:

| slot | span | width | centred on |
|---|---|---|---|
| wrapper | C1–C12 | 1209.6 | 604.8 |
| headline | C3–C10 | **799.73** | 604.8 |
| sub | C4–C9 | **594.80** | 604.8 |

**Three blockers in `globals.css` that must be fixed in the same commit or centring silently fails:**

1. `p { max-width: var(--text-measure) }` (640px) carries **no auto margin**. At a 2050px viewport the container is 1722 and the 6-column sub wrapper is 851px wide — the 640px cap engages and the paragraph left-hangs inside its own centred box. Hence `marginInline: 'auto'` on the `<p>` above. Non-optional.
2. `.bar` is `display:block; width:48px` with no auto margin — irrelevant once the chip replaces it in section heads, but do not reintroduce `<Bar/>` there expecting it to centre.
3. `.reveal-bar`'s `transform-origin: left center` does nothing for a clip-path wipe; use `.reveal-chip` (§1.2).

**`align="left"`** is the existing markup verbatim, with `<Chip>` swapped in for the `<Bar/>` + `<p className="text-micro">` pair, and the wrapper span set by the caller (5 or 6 columns — never 4, never 7, never 8; see §3).

**One header measure on the whole page.** `SectionHeader` currently ships at four different desktop widths — `md:col-span-7` in Services (697.3), `md:col-span-4` in five sections (389.9), `md:col-span-8` in Coverage (799.8), plus the hero's own 7-column stack. After this change there are exactly two: centred-12 and left-5. Remove every per-section `col-span` variation on the header wrapper.

### 1.4 The keyword accent — and why it is not a colour swap

`Headline` gains a third field:

```ts
export type Headline = { light: string; bold: string; accent?: string };
```
`accent` names a **substring of `bold`**. `SplitHeadline` splits `bold` on the first occurrence and wraps it:

```tsx
{headline.accent && headline.bold.includes(headline.accent)
  ? (() => {
      const [before, after] = headline.bold.split(headline.accent);
      return <>{before}<span className="accent-word">{headline.accent}</span>{after}</>;
    })()
  : headline.bold}
```
If `accent` is absent or not found, render `bold` plainly — no throw, no dev-only branch that changes production layout.

**The device is a 2px gold underline under otherwise full-ink text. It is NOT a colour swap.** REF B and REF C recolour one word orange; that is unavailable here and the reason is arithmetic, not preference:

- On cream, the only legal gold for **text** is `--gold-ink` #8A6220 (5.22:1 on cream-50). True gold #CBA135 is **2.31:1** and illegal at any size.
- But at 40px display, `--gold-ink` reads as brown, not gold, which is exactly why the token is confined to 11px labels today. Swapping the keyword to it would look like a mistake, not an accent.
- REF C's *other* device — an underlined keyword — is orthogonal, therefore legal, and survives intact on both grounds with the headline at its full 14.84:1 (`--ink-900` on cream-50) / 14.27:1 (`--on-dark` on g900).

```css
.accent-word {
  text-decoration: underline;
  text-decoration-color: var(--underline);
  text-decoration-thickness: 2px;
  text-underline-offset: 6px;
  text-decoration-skip-ink: none;   /* or a descender punches a hole in the rule */
}
```
Add to the ground scopes in `globals.css`:
```css
.ground-cream, .ground-cream-100 { --underline: var(--rule-accent-light); }  /* #CBA135 */
.ground-green-900, .ground-green-800, .ground-green-700 { --underline: var(--rule-accent-dark); } /* #CBA135 */
```
Both resolve to the same hex; the two names keep the ground discipline honest and make a future divergence a one-line change.

**2px is a floor, not a preference.** The token comment already records it: `--rule-accent-light: #cba135; /* MINIMUM 2px on cream: at 1px and 2.31 a gold hairline dies */`. Do not ship it at 1px. Do not scale it up on `text-d1` either — the underline is stroke scale and stays 2px at every size, the same way `--r-bar` does.

The existing 400/800 weight split stays underneath and is still the primary device: it lands within ~3% of the logo's 1.746 stem ratio, and it is the one part of the current headline treatment the references also do.

### 1.5 NEW `<Card>` — pinned slots

Generalises the technique `Services.tsx` already documents. Slots, with heights derived from the `fontSize` tokens in `tailwind.config.ts` rather than eyeballed:

| slot | spec | pinned height |
|---|---|---|
| marker | `<IconPlate/>` 48×48, or the step numeral at `text-num` | 48 (56 for numeral) |
| gap | | 24 |
| title | `text-title` 22/32 | `minHeight: 32` (1 line) |
| gap | | 16 |
| body | `text-body` 17/28 | `minHeight: 84` (3 lines) |

Card shell: `minHeight: 320` in a 3-up, `280` in a 4-up; `padding: var(--pad-surface)` (32px, the only horizontal inset on the page); `borderRadius: var(--r-lg)` (12px); `boxShadow: 'inset 0 0 0 1px var(--rule-light)'` on cream, `'inset 0 0 0 1px var(--rule-dark-strong)'` over a `var(--green-800)` fill on dark so cards separate from a g900 section ground.

**Inset ring, never a real `border`** — the existing comment is right that a border displaces content by 1px and would put card ink at 163 while the hero panel's sits at 162.

**Delete, in every card:** the inner hairline (`<div style={{height:1, background:'var(--rule-light)'}}/>`) and the per-card `.lnk`. No reference card has either, and both are what force the card bottom to be pinned rather than falling out of the content. `Services.tsx`'s current `minHeight: 128` body pin drops to 84 once they are gone.

Keep `.card:hover .bar-sm { transform: translateX(8px) }` in `globals.css` — it moves to the section button.

### 1.6 NEW `<IconPlate>` — the orthogonal answer to the references' circular icon

48×48 square, `borderRadius: var(--r-bar)` (2px), filled `var(--green-700)` on cream and `var(--green-600)` on dark, carrying a glyph in `var(--gold-500)` drawn from **orthogonal strokes only, 2px weight**:

- conduit elbow — two strokes meeting at a right angle
- distribution board — rectangle with three horizontal bars
- PV panel — rectangle with a grid
- battery — rectangle with a smaller terminal rectangle
- socket — rectangle with two vertical slots

Every one is literally the product; none contains a curve or a diagonal. REF C's black **square** icons are the direct precedent, so this is adoption, not substitution. `aria-hidden="true"`; the meaning is carried by the card title in real text.

**Zero-risk fallback if the glyph set is not drawn:** seat the existing 48×14 `<Bar/>` inside a 48×48 slot so its mass matches the references' icons and every card's first text baseline lands identically. `Services.tsx` already puts `<Bar/>` there — it is a slot change, not a new component.

### 1.7 Deletions in `globals.css`

- `--void: calc(var(--col) + 2 * var(--gutter));` — retire the token.
- The entire `.conductor` block, both ground overrides, the `@media` display gate, and `@keyframes ies-energise`.

---

## 2. Split B, the void column, and the Conductor — resolved, not glossed

### 2.1 Split B is retired by name

The 4 / 1 / 7 pattern is named in the file comments of `Hero.tsx` ("Split A"), `ForContractors.tsx`, `WhoDoesTheWork.tsx`, `WhatWeHandOver.tsx` and `Process.tsx`. **Update those comments as part of the change**, or the next reader reinstates the pattern from the documentation. Replace with the new rule, stated as a mechanical test with no judgement in it:

> A section is **CENTRED** when the content beneath the header is a symmetric row of equal cards. It is **LEFT** (a split) when the content beneath is asymmetric — a table, a form, an accordion. Never both in one section.

Splits are **6/6 or 5/7 only**, touching at one 20px gutter with nothing between them. 6/6 puts the meeting point at x=604.8, the container's own centre, so even an asymmetric section is built on the same axis as the centred ones — that shared axis is what makes a mixed page read as one system. 5/7 is the maximum asymmetry the references permit while both outer edges still land on the container edges. The current 4/1/7 meets at x=452.4, an arbitrary position 152px left of centre that lands on nothing.

### 2.2 The void column: delete all six

```
components/Hero.tsx            <div className="hidden md:block md:col-span-1" … data-col="1" />
components/ForContractors.tsx  same
components/WhoDoesTheWork.tsx  same
components/WhatWeHandOver.tsx  same
components/Process.tsx         same
components/EnquiryForm.tsx     same
```
`4 + 1 + 7 = 12` can never be symmetric, because `4 ≠ 7`. The 122.5px column sitting 512px from the left edge and 697px from the right reads as a misalignment, not as structure — and the Conductor drawing a line down it asserts the misalignment was deliberate.

**Two things currently hang INTO the void and will break.** Both are positioned `right: calc(100% + 24px)` and both must come onto the line:

- `ForContractors.tsx` commitment bars and `WhatWeHandOver.tsx` document bars (`.bar-sm`)
- `Process.tsx` step numerals (`text-num`)

The fix already exists in the source as the mobile treatment — `max-md:static max-md:mt-[9px] max-md:mr-3`. **Promote it to all breakpoints:** drop `absolute`, drop the `right`/`top` inline style, keep `mt-[9px]` (cap-height centring on the first line) and `mr-3` (the 24px clearance). The list then carries a second vertical alignment line *inside* the content column — the same thing the references get from their ticked lists, without a tick.

### 2.3 The Conductor: retired, with one part salvaged

Delete `components/Conductor.tsx` and its three call sites (`ForContractors.tsx`, `WhoDoesTheWork.tsx`, `WhatWeHandOver.tsx`), plus the CSS named in §1.7.

Three reasons, any one sufficient: (a) its only home is the void column, which no longer exists; (b) under the new order those three sections are no longer consecutive, so a run would be a stray mark rather than the unbroken vertical the component comment argues for; (c) **not one of the three reference sites contains a vertical rule of any kind.**

**Salvage the part worth keeping.** The `ies-current` animation — a hard-edged brighter segment travelling a gold rule — is genuinely on-brand and orthogonal. Move it to a **horizontal** full-bleed 1px gold rule at the top edge of the Coverage band, reusing the `.current` class already written for the hero strapline hairline. Keep the `animation-timeline: view()` mechanism and the `prefers-reduced-motion` guard; change only the axis.

This is a change to something that was sold to the client as the page's signature element. **Say it out loud rather than shipping it quietly** — see §8.

---

## 3. Page order and grounds — `app/page.tsx`

Six consecutive identical Split B sections is the second half of the complaint, and centring alone does not fix it. The references rotate three composition types and never run the same one twice.

| # | section | ground | composition |
|---|---|---|---|
| — | Header | g900 rail | 3-zone |
| 1 | Hero | **g900** | SPLIT 7/5, photo right |
| 2 | Services | cream | **CENTRED** 3-up |
| 3 | For Contractors + Gate | **g900** | SPLIT 5/7 |
| 4 | Who Does The Work | cream | **CENTRED** 3-up |
| 5 | **Commitments** (new) | **g900** | **STRIP** 4-up |
| 6 | What We Hand Over | cream | SPLIT 6/6, photo left |
| 7 | Process | **g900** | **CENTRED** 4-up |
| 8 | **Common Questions** (new) | cream | SPLIT 5/7, accordion |
| 9 | Coverage | **g700** | **BAND**, centred |
| 10 | Enquiry | cream | SPLIT 5/7 |
| — | Footer | g900 | 4-up |

Grounds run **D C D C D C D C D C D** — no two dark bodies adjacent, exactly as the existing `page.tsx` comment requires. Compositions run split · centred · split · centred · strip · split · centred · split · band · split — never the same type twice.

**Two ground flips are forced by the alternation and both are improvements anyway.** What We Hand Over moves g900 → cream, which is where its framed photograph can run at full tonal range instead of being duotoned and darkened to survive type sitting on it. Process moves cream → g900, where `--numeral` already resolves to `--gold-500` through the ground scope, so its four 56px figures gain the accent for free — the largest piece of accent on the page, which is the mass the references spend on a project gallery.

**Both new sections are added as a pair**, for the same arithmetic reason the existing file comment records for the last pair: adding one to eight body sections forces a cream-against-cream seam, and only adding two restores alternation at ten.

---

## 4. Section-by-section

Measures below are at 1440. `--col` 82.467, `--gutter` 20. 5 cols = 492.3 · 6 = 594.8 · 7 = 697.3 · 8 = 799.7 · 3 = 287.4 · 4 = 389.9.

**Responsive spans — the gotcha that will bite.** Tailwind breakpoints are `sm: 768 / md: 1024 / lg: 1276`; `--cols` is 12 at ≥1024, **8** at 768–1023, 4 at ≤767. In the 8-column regime a `col-span-3` leaves a 2-column remainder and goes ragged, and three `col-span-4`s leave an orphan. So:

- **4-up:** `col-span-4 sm:col-span-4 md:col-span-3` → 1-up / clean 2×2 / 4-up
- **3-up:** cards 1–2 `col-span-4 sm:col-span-4 md:col-span-4`; card 3 `col-span-4 sm:col-span-8 md:col-span-4` → 1-up / two full symmetric rows / 3-up
- Never a 5-up. 12 does not divide by 5 and every reference stops at four.

### 4.1 Header
Three zones with the nav on the **true** centre. `space-between` will not centre it — the left lockup (111.5px) and the right cluster (~300px) have different widths. Make the flex row `relative` and give the `<nav>` `absolute left-1/2 -translate-x-1/2`. Since `Container` is 84% centred, the container axis is the viewport axis, so the nav lands on the page's own mirror line and the rail teaches the alignment system before the reader has seen a section.

Collision check at the tightest desktop width (1024, container 860.2): lockup 111.5 + three nav items at `gap-3` ≈ 270 + right cluster (phone ≈ 90, divider 1, margins 48, CTA ≈ 160) ≈ 300 → 681.5 in 860, leaving ≈ 89px clear each side. A fourth item leaves ≈ 45px, which is legal but tight — so **three items at `md`, the fourth only at `lg`**. Add `{ label: 'Handover', href: '#handover' }` to `header.nav` with an `lg:` gate; the anchor already exists.

Keep unchanged: 88/64px rail heights, the permanent 1px gold hairline, the 14px drawn vertical divider, the three-bar mobile control with its gold middle bar and the word CLOSE instead of an X. No pill around the nav — 2px or nothing. Reject REF B's separate top utility bar: there is no second rail's worth of true content.

### 4.2 Hero — SPLIT 7/5, stays LEFT aligned
Every reference hero is left aligned; centring is reserved for card sections and applying it here would break the rule the rest of the page depends on.

- Left stack `col-span-4 md:col-span-7`, all ink on L1: `<Chip>` (left, `reveal-bar`), headline `text-d1-xs sm:text-d1-m md:text-d1`, sub, two buttons, then the `fit-content` strapline block with its gold hairline. Unchanged apart from the chip and the accent.
- Delete the void spacer. Right column becomes `hidden md:flex md:col-span-5 flex-col` — **492.3px, up from 389.9**, which fixes real cramping in the compliance nameplate.
  - Top: the photograph. `aspectRatio: '16 / 10'`, `objectFit: 'cover'`, `borderRadius: 'var(--r-lg)'`, `width: '100%'` → 492.3 × 307.7.
  - Bottom: the existing nameplate, internals untouched, `marginTop: 20` (exactly one gutter) so the two objects read as one stacked column.
  - `LogoMark` stays proportional at 82% width; the extra 102px of column goes into the rows, which is where it was needed.
- Remove `absolute inset-0 -z-10 object-cover` from `/hero.jpg`. The section ground becomes flat `ground-green-900`, on which every existing token is already proven — no scrim, no duotone needed.
- Primary button gains a trailing `<BarSm/>`.
- Below 1024 the right column is not rendered, as now.

Content: `hero.headline` gains `accent: 'contractors'`.

### 4.3 Services — CENTRED 3-up. The proof the system works.
This section already has the reference geometry and the wrong header bolted to it: the header sits at `col-span-7` (axis x=194.9) while the card row spans all 12 (axis x=604.8). Two unrelated axes stacked inside one section is precisely "not aligned".

- `<SectionHeader align="centre">` at `col-span-12`. Headline 799.7, sub 594.8, both on 604.8.
- **Add a sub** — the section has never had one and every reference card section does.
- Card row: second `ies-grid` at `mt-6`, spans per §4 preamble.
- Card interior: `<IconPlate/>` → 24 → title (`minHeight: 32`) → 16 → body (`minHeight: 84`) → nothing. Delete the inner hairline and all three `.lnk`s.
- **Make all three cards the same ground.** `card.weighted` puts the section's only ground accent off the mirror axis in a symmetric 3-up. Set all three to cream-50 and delete the flag. If the client wants REF A's inverted card, invert the **middle** one — the only position where it confirms the axis rather than fighting it.
- Close with one centred `.btn--gold`, `marginInline: auto`, `marginTop: 48`, trailing `<BarSm/>`. **Never `w-full`** — `.btn` is already correct at height 48 / padding-inline 24 / `white-space: nowrap`.

Deleting the per-card links costs nothing functionally: `services.cards[1].link.enquiryType` is dead — the only dispatcher of `ies:enquiry-prefill` is `Gate.tsx:101` and the only listener is `EnquiryForm.tsx:159`.

Accent budget for this section, counted: chip · underlined keyword · three plate glyphs · button. Nothing else gold.

### 4.4 For Contractors + Gate — SPLIT 5/7, stays LEFT
A label column and a value column is asymmetric by definition, so it stays left, and REF C's own left-aligned chip is the signal that tells the reader which axis a section uses.

- Heading `col-span-4 md:col-span-5` (492.3, up from 389.9 — un-cramps a sub that currently measures ~46 characters a line at 19/32). Content `col-span-4 md:col-span-7` (697.3). No spacer.
- **Do not touch the nested grids.** `FactRow`, the `<dl>` and every Gate fieldset use `gridTemplateColumns: 'repeat(7, minmax(0,1fr))'` and assume a 7-column parent; the content column stays 7, so label 3/7 = 280 and value 4/7 = 380 remain exactly C6–C8 and C9–C12 of the page grid.
- **Preserve the rule mechanics comment verbatim.** Every row carries `border-top` and the `<dl>` carries `border-bottom`, so a null row can never orphan, double or trail a rule.
- CTA: delete the nested 7-column wrapper and the `w-full`. A plain `.btn--gold` at natural width, left on L6, `marginTop: 48`, trailing `<BarSm/>`. A 380px full-bleed button pinned to the value column currently reads as one more table row, not a section close.
- Gate: `<Chip>` replaces the `<Bar/>` + micro pair. Everything below is unchanged — the 7-column fieldsets, the empty-or-filled bar slot that keeps its width either way, the `aria-live` answer region, the handoff button. The Gate is the honest replacement for the references' testimonial row and already does that job better, because it answers against published figures instead of asserting.
- The four `commitments` **move out** to the new Commitments strip (§4.9). A 4-up inside a 7-column block would give 148px cards, which is unreadable, and the references' own split sections carry lists, not card rows.

Content: accents only. No fact, no row, no commitment string changes. `forContractors.sub`, `pendingLabel`, `accreditationsFallback`, `openPrefix`, `scopeNote` and every `handoff` string are doing legal work and stay byte-identical. **`accreditationsFallback` must keep the words "Applications in progress" and never a scheme name, not even prefixed.**

### 4.5 Who Does The Work — CENTRED 3-up
- Centred header at `col-span-12`.
- Principal name + role at `text-title`, centred, `marginTop: 32` — the only content not in a card, and it belongs on the axis.
- Credential row at `marginTop: 48`. **Span is a function of the surviving row count**, so the row is symmetric at every count and can never go ragged when a credential is null:

| surviving rows | md span each | width |
|---|---|---|
| 3 | `md:col-span-4` | 389.9 |
| 2 | `md:col-span-6` | 594.8 |
| 1 | `md:col-span-12` | 1209.6 |

- Each credential is the `<Card>` primitive: `<IconPlate/>` → 24 → label at `text-micro uppercase` in `var(--micro)`, `minHeight: 16` → 8 → value at `text-title`, `minHeight: 32`. `minHeight: 200` on the shell. A `'pending'` value prints `Available on request` in `var(--muted)`, exactly as `Row` does today.
- The existing top-level guard stays: `if (company.principalName === null) return null`.
- The two `notes` join into **one** centred paragraph at 594.8, `marginTop: 48` — they are asides about how the credentials are used, so they close the row rather than becoming two more list items.

### 4.6 What We Hand Over — SPLIT 6/6, cream, photo left
- Left `col-span-4 md:col-span-6` (594.8): the photograph only. `aspectRatio: '4 / 3'`, `objectFit: 'cover'`, `borderRadius: 'var(--r-lg)'`, `alignSelf: 'start'`.
- Right `col-span-4 md:col-span-6` (594.8): left chip, headline, sub, the six-item document list, and the disclosure paragraph with its `borderTop: '1px solid var(--rule-strong)'` and `paddingTop: 24`.
- Both columns `align-self: start`, touching at one 20px gutter, so their top lines match exactly and the two read as one composite object.
- Document markers come in flow per §2.2. Each row keeps `minHeight: 48`.
- Below 1024 the photo stacks above at the same 4:3; below 768 drop it rather than ship 47KB above a list.
- Section flips to `ground-cream`; the duotone/darkening treatment is no longer needed and the image runs at full tonal range inside its frame.
- **`whatWeHandOver.today` does not move, soften or truncate.** It is the sentence that makes the list above credible to an assessor who knows a new firm cannot have twelve months of signed induction records.

### 4.7 Process — CENTRED 4-up, g900
- Centred header at `col-span-12`. **Add a sub** — the section currently passes none, and every centred reference header is a three-part stack.
- Four cards at `col-span-4 sm:col-span-4 md:col-span-3` (287.4 each), `marginTop: 48`.
- Card interior: numeral at `text-num` (56/56) in `var(--numeral)` → 24 → title (`minHeight: 32`) → 16 → body (`minHeight: 84`). **The numeral replaces the IconPlate here** — a step number *is* the marker and two marks would be one too many. `minHeight: 280`.
- Delete the step dividers. Four cards separated by a gutter and a card edge already read as four objects; a rule inside a card grid is a second card edge and no reference has one.
- Close with a centred `.btn--gold` at `marginTop: 48`.
- **Numerals stay solid, not outlined.** `-webkit-text-stroke` renders inconsistently and a hollow stroke is a construction the mark never uses — every shape in the artwork is a filled plane. None of the three references outlines anything either.
- All four steps stay permanently open. REF A and REF C use accordions, but an accordion of four twelve-word steps hides content that costs nothing to show.

Content: `process.headline` is the worst staircase on the page — 11 characters against 41 — and centring exposes it hardest. Rebalance to ~27/29 and let the existing `h1,h2,h3 { text-wrap: balance }` finish it. Trim the four bodies to three lines at the 287.4 measure (≈33 chars/line) so the 84px pin holds. Step 01's same-day yes-or-no stays: it is a commitment IES controls. Do not let the rewrite escalate it into a promised quotation turnaround.

### 4.8 Coverage — BAND, g700, centred
Currently the most ragged block on the page: bar + micro + headline in one `ies-grid` at `col-span-8`, then a **second** `ies-grid` holding only a `col-span-4` sub with `mt-3`. Two widths, two grid rows, both left-hanging, and no action anywhere.

- One `ies-grid`, one centred `col-span-12` child: chip · headline 799.7 · sub 594.8. **Delete the second grid.**
- Beneath at `marginTop: 48`, a second `ies-grid` of four equal cells, each `col-span-4 sm:col-span-4 md:col-span-3` (287.4) — REF B's horizontal in-band form row:
  - C1–C3 postcode or site address (input, height 48, `var(--r)`)
  - C4–C6 enquiring as (select, the three `enquiry.types` values)
  - C7–C9 email (input)
  - C10–C12 `.btn--gold` at `width: '100%'`, height 48, trailing `<BarSm/>`
- Four equal cells means the row's centre **is** the container's centre by construction, so it sits on the header's axis with no adjustment. 2×2 at 8 columns, stacked at 4.
- The button does **not** submit. It dispatches `ies:enquiry-prefill` with the three values and scrolls to `#contact` — the exact path `Gate.tsx:101–103` already uses. No new endpoint, no second form handler. Coverage becomes a client component for this. **Fallback if that is not wanted:** a single centred `.btn--gold` at natural width, `marginInline: auto`, `marginTop: 48`, which still closes the section on its axis.
- The salvaged travelling gold rule (§2.3) sits at the band's top edge, full bleed, 1px `var(--rule-accent-dark)` with the `.current` overlay.

**Green, not orange, and that is arithmetic.** Gold #CBA135 as a large ground makes cream text 2.42:1 and gold text meaningless. `--green-700` is the only accent-ground role available; on it `--gold-500` clears 5.15:1 and the ground scope already handles every child token.

I am overturning a derivation written into `Coverage.tsx` — that centring is illegal because the logo's strapline is justified rather than centred. That argued against centring a block with **no right column**, where the axis would be invented. Over a symmetric four-cell row the axis is the row's own, and the chip supplies the closed top object the mark's justified strapline supplies to the lockup. This is a composition question and the client's instruction governs.

**Write this guard into the file comment:** this band is the exact shape of REF A's and REF C's stats bands, so the first person who wants to add a number will reach for this section. No counters, no plus signs, no percentages, no count-up, no years, no headcount, no "trusted by".

### 4.9 NEW — Commitments strip, g900, position 5
Fills the slot REF B gives a greyscale client logo strip and REF C gives an orange stats band: a short, full-width, four-mark row that punctuates the scroll and does credibility work between two long sections. IES has no clients and no numbers, so **the geometry is adopted and the content is replaced** — with the four commitments moved out of For Contractors, which are already in `lib/content.ts`, already pass `npm run audit:content`, and are the one true differentiator a new firm has.

- Chip `OUR COMMITMENTS`, centred; headline 799.7 centred; sub 594.8 centred.
- `marginTop: 48`, a 1px `var(--rule-dark)` rule across C1–C12, then four cells at `col-span-4 sm:col-span-4 md:col-span-3` (287.4), each centred on its own axis: `<BarSm/>` marker, then the commitment at `text-title` with `minHeight: 96` so all four bottom lines agree.
- No cards, no plates, no button — the strip is deliberately lighter than a card row so it reads as a beat, not another section.

### 4.10 NEW — Common Questions, cream, SPLIT 5/7, position 8
REF A's FAQ (heading left, accordion right, first row open) is the one reference section IES can write completely and truthfully, because every answer restates something already published. It also takes the slot the references give to testimonials and does that job better: a buyer forms confidence from answers, not assertions.

- Heading `col-span-4 md:col-span-5` (492.3) with a **left** chip; accordion `col-span-4 md:col-span-7` (697.3); one 20px gutter, nothing between.
- Native `<details>` / `<summary>`, `<details open>` on the first row — no client JS, keyboard-operable by default.
- Each row: `borderTop: '1px solid var(--rule-strong)'` with `border-bottom` on the wrapper (same mechanics as the fact table, so a removed row cannot orphan a rule); `minHeight: 64`; question at `text-title` in `var(--heading)`; answer at `text-body` in `var(--body)` capped at `var(--text-measure)`. A `<BarSm/>` at each row's left gives the accordion a second vertical alignment line.
- No chevron, no plus/minus. Rotate the `BarSm`'s existing `translateX` on open, or let the row height carry the state.
- Rules are legal here and only here as decoration: all three references use hairlines exactly and only inside accordions.

**Store as `faq` in `lib/content.ts` as `{ q, a }` pairs, with every figure interpolated from `company` rather than typed**, so a change to a token propagates and cannot drift out of agreement with the fact table. Six rows, first open. Question 2 prints `company.accreditations.join(', ')` when populated and `company.accreditationsFallback` verbatim otherwise. Any row whose interpolated token is `null` removes itself, following the `Fact` filtering pattern already in `Hero.tsx` and `WhoDoesTheWork.tsx`.

**Write this rule into the file comment:** an answer may only restate something already published elsewhere on this page or in `lib/content.ts`. An FAQ is the easiest place on a page for a new claim to appear, because the format invites a confident sentence.

The "how new is the company" question is answered by conceding the point and redirecting to what is checkable — the individual's qualifications — exactly as Who Does The Work already argues. Do not soften it to "established" or "growing" (both would fail the audit's `BANNED` list anyway) and do not add a founding year.

### 4.11 Enquiry — SPLIT 5/7, left
Same treatment as For Contractors. Delete the void, move to 5/7, left chip, add a sub.

- Left `col-span-4 md:col-span-5` (492.3): chip, headline, sub, then at `marginTop: 48` the phone at `text-title` and email at `text-body`, both `.lnk`, `minHeight: 44`.
- Right `col-span-4 md:col-span-7` (697.3): the form card unchanged. Inner width 697.3 − 64 padding = 633.3, so a half field is 304.6 — comfortably above the 280 at which the segmented control's three labels start to crowd.
- **Submit becomes `btn--gold`**, `marginTop: 48`, trailing `<BarSm/>`, **`minWidth: 296` deleted** so the width follows the label as `.btn` intends. This is a choice, not a constraint: `--btn-gold-fg` #10251A on #CBA135 is 6.68:1 regardless of the ground behind it, so gold is fully legal on cream — and the cream sections currently carry almost no accent at all, which is the main reason the page reads quieter than the references even where its geometry is right.
- **Do not touch anything inside the form card:** the segmented control earns its keep by changing the message field's label rather than decorating; selection is carried by `aria-pressed` and a weight change, not colour alone; radius is 7px on the shell and 0 on every internal division; the honeypot is `.vh` rather than `display:none` so a bot reading computed styles still fills it; the static export path hands the enquiry to the visitor's mail client rather than posting into a void.

Content: `enquiry.headline` is 18/30 — a staircase. Rebalance to ~25/27, add `accent`, add a sub that lowers the barrier without promising a price or a turnaround.

### 4.12 Footer — no change, and that is the finding
`Footer.tsx` is four equal `col-span-3` blocks filling C1–C12 with heads on L1, L4, L7, L10, and `col-span-4 md:col-span-3` already gives 4-across / clean 2×2 / 1-up with `gap-y-6` handling the wrap. It is the only section already built the reference way and it is the template the rest of the page is moving toward — point at it when the client asks why the footer did not change.

- Do **not** convert the four column heads to chips. They are column heads inside one block, not section heads, and four bordered boxes in a row read as four buttons.
- Do **not** add a giant display-type footer. Both references that do it put a photograph behind it, the largest type in this identity is the mark itself, and the primary audience scrolls to a footer for a company number.
- The contact column's `<BarSm/>` standing in for a phone glyph stays; keep the reason in the comment — a telephone handset is unavoidably curved, so there is no phone glyph anywhere on this page.

---

## 5. Imagery

**Two photographs on the page. Both are promoted from full-bleed washes to grid objects with declared column spans and visible edges.** This is the single change that will make the client feel the references have been followed — at the moment `/hero.jpg` and `/band.jpg` are both `absolute inset-0 -z-10 object-cover`, so they read as atmosphere and contribute no alignment line at all. "You are allowed to use images as well" strongly suggests they did not register as images.

| # | file | where | frame | subject |
|---|---|---|---|---|
| 1 | `/hero.jpg` (replace or re-crop) | Hero right column, top of the stacked pair | `col-span-5`, 16:10, 492.3 × 307.7, `--r-lg` corners | containment or tray run, conduit, cable, or a bare distribution board — no branding, no finished room |
| 2 | `/band.jpg` (replace or re-crop) | What We Hand Over, left column | `col-span-6`, 4:3, 594.8 wide, `--r-lg` corners | a multifunction tester on a bench, a blank schedule or label sheet, a cable drum, or an unpopulated enclosure |

**The rule that stops either reading as a portfolio claim** — binding, and it should be written into both files:

1. `alt=""` and `aria-hidden="true"`. No `<figcaption>`, no `title` attribute, no descriptive alt, ever.
2. No adjacent label naming a site, client, job, town or date.
3. No heading whose subject the photograph could be read as a completed instance of.
4. **Materials and plant only. No people, in either image.** A cut-out or posed figure on the brand ground reads as "this is our electrician" — a headcount claim from a company that has published no headcount. This also rejects REF A's central hero device outright, twice over: the figure is a staff claim, and it is masked into a lightning bolt, which is a diagonal container.

**The crop is where the truth constraint actually bites, not the frame.** A framed photograph beside a heading reads as an *example* of that heading. Image 2 sits next to "Every document you need, issued before we leave site", so it must **not** be a finished installation, a completed certificate, or a labelled and energised board — any of those is read by a buyer as a job IES has completed, and there are none. Image 1's adjacent copy is "Electrical installation **for** contractors…", which describes an offer rather than a delivery, which is why a materials crop is safe there.

**Loading:** image 1 keeps `fetchPriority="high"` and explicit `width`/`height` (still the LCP element, must reserve its box). Image 2 keeps `loading="lazy"` and explicit dimensions. Once both leave the type's ground, the duotone-and-darken treatment documented in `Hero.tsx` (holding the lightest 1% of pixels to 4.80:1 against gold) is no longer needed and both can run at full tonal range.

**No third photograph.** Not in Services (no reference puts one in a card grid; the three plates already give the row its line of dark shapes), not in For Contractors (anything shown beside insurance figures reads as evidence for them), not in Who Does The Work (a portrait there is a headcount claim and a staff claim in one object), not in Process (a photograph of a process being carried out is a completed-job claim), not in Coverage (the band's job is to be a hard stop; a photo softens it).

---

## 6. Rejections — every reference device dropped, with its reason

**Circles, diagonals and stars — the real conflict, resolved device by device once so no section decides again.**

*Adapted, with a named orthogonal substitute:*

| reference device | replacement | why |
|---|---|---|
| circular card marker (REF A, REF C) | 48×48 square `<IconPlate/>` at `--r-bar` | REF C's own black **square** icons are the direct precedent and settle it |
| circular arrow badge inside a CTA (REF A) | `<BarSm/>` trailing the label | already the house pattern on `.lnk`, and `translateX(8px)` already animates |
| pill chip (REF B, REF C) | 2px bordered chip | no pills; 2px is the mark's stroke scale |
| pill button (REF A) | existing `.btn` at `--r` 7px | **outvoted by the references themselves** — REF B and REF C both already use a rectangle |
| large circular send button (REF B) | full-column gold rectangle in the Coverage band | makes the row four equal cells instead of three plus an ornament |
| diagonal lightning-bolt as a layout path (REF A) | orthogonal conduit run — a gold hairline turning only at 90° | literally the trade's own geometry |

*Deleted outright, no substitute — said out loud rather than quietly omitted:*

- **Rotating "LET'S GET STARTED" badge (REF A)** — rotation is a circle in time.
- **Play triangle on "HOW WE WORK" (REF B) and circular "WATCH OUR VIDEO" badge (REF C)** — a triangle is diagonals, and no video exists. The hero's `btn--ghost` secondary already occupies that slot.
- **Lightning glyph on FAQ rows (REF A)** — nothing but diagonals. `<BarSm/>` takes the slot.
- **Tick marks on lists (REF B, REF C)** — two diagonals, and a tick asserts *completion*, which is the wrong verb for a list of documents IES will issue. The 16×5 gold stub is the logo's own C-bar and carries brand meaning a tick does not.
- **Cut-out person masked into a shape (REF A hero and CTA band)** — a diagonal container plus an implied staff claim.

**Social proof — geometry kept, content rejected.** These occupy roughly a third of each reference page and are load-bearing in their rhythm. Mechanically they are symmetric 3-up and 4-up rows on the container axis, which is the same geometry as the service cards; the content is unavailable to a company weeks old that prints its own Companies House number in its footer:

- **Stat counters** — 125K+ / 25K+ / 98% (REF A), 800+ / 20+ / 400+ / 100+ (REF C). Disprovable in one search. No plus signs, no percentages, no count-up animation, anywhere.
- **Star ratings** (all three) — also barred by orthogonality; a star is diagonals.
- **Testimonial cards with quote glyphs** (REF A's entire "WHAT OUR CLIENTS SAY") — no clients. The slot goes to the Gate and the FAQ.
- **Greyscale client logo strip** (REF B) — no clients. The slot goes to the Commitments strip.
- **Founder name with signature** (REF B) and **avatar cluster with Google logo and "800+ WE HAPPY CUSTOMER"** (REF C) — headcount and customer-count claims. A qualification is checkable by the reader; a signature is not.
- **Years-of-experience badges, "trusted by" language, project galleries, team photos** — every one is caught by the `BANNED` array in `scripts/audit-content.ts` and would fail the build.

**Also rejected:**

- **Accent as a full page ground (REF A's orange).** Gold #CBA135 as a large ground makes cream text 2.42:1 and gold-on-gold meaningless. `--green-700` takes that role.
- **REF B's separate top utility bar.** No second rail's worth of true content, and inventing some means inventing facts.
- **REF C's contact map.** Needs a published site address; `company.registeredAddress` is currently a placeholder.
- **A named-standards strip (BS 7671 / Part P / EAWR / CDM).** This was the obvious honest filler for the logo-strip slot and it **cannot ship as specified**: `scripts/audit-content.ts` line ~48 lists `'bs 7671'`, `'bs7671'`, `'18th edition'`, `'part p'` in `SCHEMES` and hard-fails the build on any of them, because a row of four institutional names in the slot where competitors put accreditation badges is read as accreditations. The Commitments strip (§4.9) fills the slot instead with copy that already ships and already passes. See §8.
- **The 1px vertical Conductor** — absent from all three references, and its only home is the column being deleted. §2.3.

---

## 7. Content and audit changes — `lib/content.ts`, `scripts/audit-content.ts`

1. `export type Headline = { light: string; bold: string; accent?: string }`.
2. Add `accent` to nine headlines (hero, services, forContractors, gate, whoDoesTheWork, whatWeHandOver, process, coverage, enquiry). The accented substring must sit near the line's centre — that is where it confirms the mirror axis rather than pulling off it.
3. **Rebalance every headline clause pair to within ~25% of each other in character count**, then let the existing `text-wrap: balance` finish. They are currently split *grammatically*, not visually: `process` is 11 chars against 41, `enquiry` is 18 against 30. Under centring a ragged two-line headline puts two different centres on the page and destroys the axis the whole section depends on. Audit all nine.
4. Add subs to `services`, `process` and `enquiry` (none of the three has one; every centred reference header is a three-part stack).
5. Trim card and step bodies to the pinned slot: 3-up at 389.9 ≈ 45 chars/line, 4-up at 287.4 ≈ 33 chars/line. **Write the copy to the slot, never the slot to the copy** — the `Services.tsx` comment is right and its warning carries over.
6. Delete `services.cards[*].link` and `services.cards[*].weighted`; add `services.cta` and `process.cta`.
7. Move `forContractors.commitments` to a new `commitments` block; add `faq` as `{ q, a }` pairs.
8. `budgets` gains: `cardTitle3up: 26`, `cardTitle4up: 22`, `cardBody3up: 135`, `cardBody4up: 99`, `faqAnswer: 190`.
9. **`scripts/audit-content.ts`: add the new `commitments` and `faq` blocks to the `strings()` call at line ~64**, or their copy is never checked against `BANNED`, `SCHEMES` or the dash rule. Add the new budget entries to `budgetChecks`. Keep `company.areasCovered` at 44 — it still interpolates into two headline-sized elements.
10. No hyphens or dashes in any new visible copy (the audit enforces it): "same day", not "same-day".

---

## 8. Needs the client before it can be built

1. **The overlap rule.** REF A's most distinctive device is three white cards straddling a photograph's bottom edge. `Hero.tsx` records that the client made *"no element crosses another element's boundary"* binding, derived from the artwork. That is a collision between **two client instructions**, not between the client and us, so only they can release it. *Default if they don't:* run the photograph and the content block edge to edge against one shared gutter with matched top and bottom lines, so they read as one composite object without anything crossing. Releasing it later is a negative top margin on one column and nothing else moves.
2. **The Conductor.** Sold as the page's signature element; this spec retires the vertical run and salvages only the travelling-current animation onto a horizontal rule. Say it, don't ship it quietly.
3. **The 48×14 Bar leaving six section heads.** A real loss of the brand's one ornament, taken because two stacked marks above a centred headline is worse. It survives inside the chip as a `BarSm`, in the Gate answer slots, and in the hero.
4. **A named-standards strip.** If the client wants BS 7671 / Part P named on the page, that requires editing the `SCHEMES` array in `scripts/audit-content.ts` — a deliberate relaxation of a guard built to stop exactly this. My recommendation is no: in the slot where every competitor puts accreditation badges, four institutional names are read as accreditations regardless of the disclaimer under them, and the `ACCREDITATIONS` row two sections earlier still prints "Applications in progress."
5. **Photography.** Both images need replacing or re-cropping to the frames and subjects in §5. No people. If only the current stock is available, image 2 should be dropped and What We Hand Over run as a 5/7 text split rather than shipped with a crop that implies a completed job.
6. **The underlined "come back today"** in the enquiry headline. The accent puts emphasis squarely on a same-day-reply promise. Defensible — it is a commitment about IES's own behaviour, it matches Process step 01, and a firm with no jobs on has no excuse for missing it — but if the client is not comfortable, move the accent to "the scope and dates".
7. **The Coverage in-band form row.** Makes `Coverage.tsx` a client component (third on the page, after `Header` and `EnquiryForm`/`Gate`). Confirm that is acceptable, or take the single centred button fallback in §4.8.