# IES Electrical and Renewables — landing page

A single page marketing site. Next.js App Router, TypeScript, Tailwind, no CMS,
no database. Deploys to Vercel with no configuration.

**Live:** https://ies-electrical-renewables.vercel.app

```bash
npm install
npm run dev           # http://localhost:3000
npm run build         # full app, builds clean with no warnings
npm run build:static  # portable folder in ./out, openable from disk
npm run audit:content # truth and copy checks, fails the build on a violation
```

### Two build targets

`npm run build` produces the full app: the `/api/enquiry` route exists and the
form posts to the server. **This is what is deployed.**

`npm run build:static` writes a self contained site to **`./out`** (about 1.3MB,
fonts included) that opens straight from disk and uploads to any static host. A
static export cannot run a route handler, so the enquiry form there falls back
to a prefilled `mailto:` rather than posting into a void. The build script parks
`app/api` for the duration and restores it afterwards, including on failure.

### Deploying

Already linked to the Vercel project `ies-electrical-renewables`:

```bash
npx vercel deploy --prod
```

Note: Vercel refuses to deploy Next.js 15.1.6 and earlier because of a published
CVE. This project is pinned to an exact, patched version — **do not downgrade.**

---

## 1. The one rule that governs this page

**Publishing a company number makes the page self auditing.** A supply chain
manager who reads a company number types it into Companies House, where the
incorporation date is public. Every other assertion on this page has to survive
that same check.

So the page contains **no** client names, case studies, reviews, ratings, years
in business, headcount, project values, testimonials or client logo strips. It
does not say "trusted", "leading", "established" or "experienced". Where the
reference sites put invented achievement numbers, this page puts verifiable
compliance facts, which is a stronger signal to the audience it is built for.

If you add copy, that is the standard it has to meet.

---

## 2. Every placeholder, and where to put the value

Everything lives in **`lib/content.ts`**. Search that file for `REPLACE`.

| Token | What it is | Where it shows |
|---|---|---|
| `siteName` | Trading name | Browser tab, search results |
| `legalName` | **Exact** Companies House registered name | Footer bottom bar, JSON‑LD |
| `siteUrl` | Live domain, once registered | Canonical link, social image URL |
| `phone` | Main number | Header, hero, enquiry, footer |
| `email` | Enquiry address | Enquiry, footer |
| `areasCovered` | e.g. West Yorkshire and surrounding counties | Title, hero, fact table, Coverage |
| `companyNumber` | Companies House number | Hero panel, fact table, footer |
| `vatNumber` | VAT registration | Fact table, footer |
| `registeredAddress` | Registered office | Fact table, footer |
| `publicLiability` | e.g. £5,000,000 | Hero panel, fact table |
| `employersLiability` | e.g. £10,000,000 | Hero panel, fact table |
| `accreditations` | Array. **Leave empty until a certificate exists** | Fact table |

### Facts have three states, not two

```ts
publicLiability: '£5,000,000'   // prints the value
publicLiability: 'pending'      // prints "Available on request" in grey
publicLiability: null           // removes the whole row, rules recompute
```

Set a value to `null` and its row disappears cleanly: rules always equal
rowCount + 1, so no rule is ever orphaned, doubled or left trailing. `vatNumber`
ships as `null` to demonstrate this — fill it in and the row reappears.

**Insurance rows must never fall back to a number.** Use `'pending'`.

### Accreditations

Leave the array empty until a certificate is in hand. Never write a scheme name,
not even prefixed with "applying for". When empty, the row prints
`accreditationsFallback` instead of disappearing.

That fallback is itself a claim. It currently reads *"Applications in progress.
Ask us where we are up to."* — **only ship that if applications have actually
been lodged.** If nothing has been submitted, change it to *"Accreditation
status available on request."*

---

## 3. Promises this page makes on your behalf

Two forward commitments are published. A new company can truthfully make them,
but they become a service level the moment the page goes live. Confirm both:

1. **Same day response.** Stated in the Process section and in the enquiry
   headline.
2. **One named contact for the whole job.** The first of the four commitments.

---

## 4. The capability statement

Both CTAs say **Request**, not Download, because no PDF exists yet. A dead
download on the page's highest value action for its primary audience would be
the worst available failure. When a real file ships, change the two labels in
`lib/content.ts` and point them at it.

---

## 5. Design system, in short

Everything is derived from the logo artwork, measured off the vector rather than
eyeballed. `DESIGN-DIRECTION.md` carries the full derivation.

- **Radius follows the mark's own ratio**, 2.34 / 16.16 = **14.48%** of an
  element's minor dimension: `--r-bar: 2px` for stroke scale objects (14px minor
  → 2.03), `--r: 7px` for controls (48px minor → 6.95). Surfaces are **capped at
  `--r-lg: 12px`**, because the ratio would give a 320px card a 46px radius and
  stop it being a rectangle. That cap is the one value in the system that is
  judgement, not measurement. **There are no pills anywhere**, which is why the
  page looks unlike the reference sites it was benchmarked against.
- **One typeface, Manrope**, three weights: 400 / 600 / 800. Chosen by
  measurement against the logo's strapline, which is the only real type in the
  artwork. Glyph width over cap height across eleven letters gives an RMS error
  of **0.0136** against **0.0970** for Archivo, the previous choice. The stroke
  weights also land: the strapline measures 0.1234 stroke/cap and Manrope 400
  gives **0.1233**; the mark measures 0.2172 and Manrope 800 gives 0.2055,
  where Archivo 800 was 0.2714, a quarter heavier than the mark it echoed.
  The logo is monotypographic, so a second family would be the first thing on
  the page the identity itself does not do.
- **One ornament**, the E's gold bar, at two sizes, never stretched. Anything
  full width is a 1px hairline, which is a different object in the mark.
- **Gold is load bearing, not decorative.** Delete the gold bar from the logo
  and it reads ICS. So gold marks the operative element in a group and never
  washes across one.
- **Zero pictorial icons.** The mark contains no diagonal and no circle, so
  there is no tick, chevron, arrow or badge anywhere.

### Colour and contrast

Gold `#CBA135` measures **2.31:1 on cream** and cannot legally carry text there,
so gold exists in two steps: `--gold-500` on dark grounds (6.68:1 on green‑900)
and `--gold-ink #8A6220` on light (5.22:1). Every ratio is in the comments in
`app/globals.css`. The brief's `--muted-500 #7C877F` was replaced because it
measures 3.57:1 and fails the brief's own stated requirement.

### Alignment

12 columns of exactly **80px** on **20px** gutters inside 1180: `(1180 − 11×20) /
12 = 80.000`, pitch 100. The page runs on two mirrored splits so it has only
four master vertical lines. **`components/Container.tsx` is the only file
allowed to set a horizontal max‑width, auto margin or page padding** — a section
carries its ground colour and vertical padding, nothing else. Enforce with:

```bash
# The real risk is a <section> that sets its own measure or page padding, which
# puts a coloured band's content on a different line to every cream section's.
grep -rnE '(max-w-|max-width|mx-auto|px-|paddingInline|marginInline)' app components \
  | grep -v 'Container.tsx' | grep -v 'globals.css'
```

Small margin utilities inside a component (`mr-3` on a nav item) are fine and are
covered by the rhythm check instead — every gap must land on the 8px scale.

`npm run shoot` captures the desktop, mobile and reduced motion screenshots and
runs the alignment acceptance checklist, writing `screenshots/acceptance.json`.
It needs a browser, which is not a project dependency because Playwright's
postinstall downloads one and that would slow every hosted build:

```bash
npm i -D playwright && npx playwright install chromium
npm run shoot
```

The committed `screenshots/acceptance.json` holds the last verified run.

### Cap trim

`scripts/gen-trim.mjs` measures the shipped Archivo file and emits the two
constants that make a declared padding measure to visible ink. **Regenerate them
if the typeface ever changes** — they are bound to Archivo's metrics:

```bash
node scripts/gen-trim.mjs /path/to/Archivo.ttf
```

---

## 6. Motion

Three behaviours, each derived from the mark rather than added as decoration:

1. **The mark completes itself.** The letterforms settle, then the gold bar
   lands into the slot the C leaves open, and the wordmark stops reading ICS.
2. **Current along the gold hairline.** A hard edged travelling segment, not a
   glow — the artwork has no soft edges.
3. **The weight axis, made kinetic.** Archivo is variable, and the identity's
   whole typographic signature is 400 against 800, so the bold clause of each
   headline weights up as it enters.

Scroll reveals use `animation-timeline: view()` where supported, so they cost
**zero JavaScript**; an IntersectionObserver fallback covers older browsers.
**Everything dies completely under `prefers-reduced-motion: reduce`** and the
capture script asserts that.

---

## 7. The enquiry form

`app/api/enquiry/route.ts` is a **stub**. It validates, rejects the honeypot,
logs the payload and returns 200. It does not send email.

**TODO:** wire it to [Resend](https://resend.com) to deliver to `{{EMAIL}}`. No
API key is committed and no third party account was created on the client's
behalf.

---

## 8. Deliberate departures from the original brief

Each of these breaks something the brief specified. Raise any you disagree with.

| Brief said | Shipped | Why |
|---|---|---|
| Serif headings (Fraunces / Newsreader / Source Serif 4) | Archivo, one grotesque | The mark has zero stroke modulation and flat square terminals; a modulated serif beside it reads as a second brand |
| Inter or Plus Jakarta Sans for body | Archivo everywhere | The lockup is monotypographic |
| Headline weights 300 / 600 | **400 / 800** | 300 gives more stroke contrast than the logo itself ever uses |
| Micro labels at 0.18em | **0.12em** | The artwork's own tracking measures ~0.05em; 0.18em is three to five times the brand's own |
| Strapline `DOMESTIC · COMMERCIAL · RENEWABLES`, never pipes | `ELECTRICAL \| RENEWABLES` | Client instruction: the name follows the logo, and the logo's strapline uses a pipe |
| Golds `#B8873B` / `#C9A257` | `#CBA135` + `#8A6220` | Client instruction: the palette is the logo's |
| Cream header, hairline once scrolled past 40px | Permanent green‑900 rail with a permanent gold hairline | A cream bar on a green hero has a visible seam from pixel zero, and the scroll listener would be a third piece of client JS |
| Gold rule across each card's top | The floating bar, inset 32px | In the mark, gold never touches the structural form |
| Four gold tick icons | The small bar, same position | A checkmark is two 45° limbs; the artwork has no diagonal |
| Gold outlined Process numerals | Solid | `-webkit-text-stroke` is inconsistent, and a hollow stroke is a construction the mark never uses |
| Hero right panel: mark at low opacity, nothing else | Compliance nameplate, mark at full opacity | A faded mark in an otherwise empty box reads as unfinished, which is the exact impression this deliverable exists to avoid. Every value in the panel is a token, so it adds proof without adding a claim |
| Coverage centred | Left aligned | The logo has no centred relationship anywhere; its strapline is justified edge to edge |
| Hero secondary CTA: *Download* | *Request* | No file exists yet |
| "new build plots **at volume**" | "new build plots." | "At volume" is a capacity claim about labour and plant |
| "you will get a reply today" | "we will come back to you today" | States the company's intent rather than predicting the reader's future |
| Orange `#C2622A`, at most twice | Deleted | 1.71:1 against the brand gold — same value, different hue, so it reads as a rendering fault |
| `--muted-500 #7C877F` | `--muted-600 #5F6B64` | 3.57:1 fails the brief's own 4.5:1 requirement |
| Gold micro labels, unqualified | `--gold-ink` on cream, `--gold-500` on dark | 11px gets no large‑text relief, so the brief's own contrast rule forbids the brief's own label colour |
| `LocalBusiness` + `Organization` JSON‑LD | `Organization` only | `LocalBusiness` asserts a customer facing premises a registered office company may not have |
| Text wordmark fallback in a serif | Deleted | Real SVGs are inlined, so the condition it guarded against cannot occur |
| Zero client JS beyond form and menu | Plus one ~1KB motion module | Client instruction: the page needed liveness. It no‑ops entirely under reduced motion |
| One radius, 2px | 2 / 7 / 12 by minor dimension | Client instruction: more corner radius. The 14.48% ratio is the logo's own |

### Two places the direction document was wrong, and the measurement that shows it

1. **The hero's "exact 320px shared measure."** Reaching 320px needs ~0.58em of
   tracking, roughly ten times the artwork's own 0.06em, giving a measure/cap of
   38.9 against the logo's 19.6. Shipped instead: the hairline is drawn to the
   strapline's natural width at the brand's own tracking, so the two still share
   one exact measure and it survives a copy or font change. That is also how the
   artwork does it — the strapline was tracked to the mark, not the reverse.
2. **The cap‑trim formula's sign.** Written as `(hheaAsc − hheaDesc)/2`, which is
   only correct if descent is a positive magnitude. `fontkit` returns it signed
   and negative, so the published formula returned the content box height and
   drove trim‑bottom ~63% too large. Corrected to `(hheaAsc + hheaDesc)/2` in
   `scripts/gen-trim.mjs`.

---

## 9. Still needs the client

1. **The exact legal name** for the footer and JSON‑LD. A guess beside a company
   number is a misstatement, not a placeholder.
2. **Whether accreditation applications have actually been lodged** (see §2).
3. **Whether the same day response is a commitment you will honour** (see §3).
4. **Whether a capability statement exists as a file, and when** (see §4).
5. **Whether the registered office is the only address.** `LocalBusiness`
   structured data and any "visit us" language stay out until there is a real
   trading address with public access.
6. **Whether renewables trades under a separate identity.** The logo reads
   `ELECTRICAL | RENEWABLES` and the h1 leads with electrical installation. If
   renewables is a second trading arm rather than half of one company, the h1's
   bold clause needs to carry it.
