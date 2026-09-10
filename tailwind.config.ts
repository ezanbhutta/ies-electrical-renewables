import type { Config } from 'tailwindcss';

/**
 * Every value here is derived in DESIGN-DIRECTION.md.
 * Two deliberate constraints, both enforced by omission rather than by review:
 *  - `spacing` is sparse, so off-scale gaps (p-5, gap-7) cannot be typed.
 *  - `borderRadius` is short, so an arbitrary corner cannot be typed either.
 *
 * REDESIGN 2026-09: the radius scale moved from sharp (2 / 7 / 12) to rounded
 * (12 / 20 / 28 / pill) to match the reference direction. The scale is still
 * short on purpose — four surfaces plus a pill, no more — so the page cannot
 * drift into a fifth corner value nobody chose.
 */
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green: { 900: '#10251A', 800: '#16351F', 700: '#1B3A2B', 600: '#24503A' },
        gold: { 300: '#D9B65A', 500: '#CBA135', 600: '#B8912E', ink: '#8A6220' },
        cream: { 50: '#FBFAF6', 100: '#F3F1E9' },
        ink: { 900: '#14201A' },
        body: { 700: '#41504A' },
        muted: { 600: '#5F6B64' },
        onDark: { DEFAULT: '#FBFAF6', body: '#C9D4CB', muted: '#A8B5AC' },
        rule: { light: '#E3DFD4', lightStrong: '#D6D1C2' },
        field: { border: '#8F8877', placeholder: '#646F68' },
        state: { error: '#8E2419' },
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontWeight: { text: '400', ui: '600', mark: '800' },
      /* ==================================================================
         THE FLUID TYPE SCALE.

         THE BUG THIS FIXES. The container is a RATIO — 84% of the viewport at
         every width — but the type inside it was fixed pixels switched at
         breakpoints. Those two systems disagree, and they disagree worst in the
         1024 to 1280 band: the `md:` breakpoint fires at 1024 and hands the
         page its LARGEST type (68px hero, 52px headings) at the moment the
         container is only 0.84 * 1024 = 860px, roughly 40% narrower than the
         1440 display it was tuned on. A five column heading there is about
         340px holding 52px words, so the longest word simply left the box.
         "Fine on the Mac, text out of the box elsewhere" is exactly that.

         THE FIX. Every size that carries meaning at more than one width is now
         `clamp(min, a + b*vw, max)`, interpolating linearly between a 360px
         viewport and a 1600px one, and holding flat outside that range. Type
         and container now scale together, so the RATIO between them is
         constant and there is no step at any breakpoint.

         HOW TO DERIVE A NEW ONE, so this stays maintainable:
           b  = (max - min) / (1600 - 360)   -> express as vw: b * 100
           a  = min - b * 360
         Check it at three widths — 360, 1024, 1600 — before committing.

         Line heights are UNITLESS on purpose. A fixed px line height against a
         fluid font size decouples the two and the leading collapses at one end
         of the range; a ratio scales with whatever the clamp resolves to.

         The `-m` and `-xs` variants are gone. A size that adapts by itself does
         not need a second class, and every responsive `sm:text-*` pair on the
         page was a place the jump could be reintroduced by hand.
         ================================================================== */
      fontSize: {
        /* Fixed: UI furniture, not display type. These should not grow on a
           large screen and are already at their floor. */
        micro: ['11px', { lineHeight: '16px', letterSpacing: '0.12em', fontWeight: '600' }],
        strapline: ['12px', { lineHeight: '16px', letterSpacing: '0.06em', fontWeight: '400' }],
        legal: ['13px', { lineHeight: '22px' }],
        meta: ['14px', { lineHeight: '22px' }],
        ui: ['15px', { lineHeight: '24px', fontWeight: '600' }],

        /* Fluid, 360 -> 1600 viewport. Resolved sizes at 1440 in brackets.
           The whole scale came down roughly 12% at the client's call — the
           page was reading large at every level, not just in the hero. */
        body: ['clamp(16px, 15.71px + 0.0806vw, 17px)', { lineHeight: '1.62' }],          /* 17 */
        lead: ['clamp(15px, 14.13px + 0.2419vw, 18px)', { lineHeight: '1.6' }],           /* 18 */
        value: ['clamp(16px, 14.84px + 0.3226vw, 20px)', { lineHeight: '1.25', fontWeight: '600' }], /* 19 */
        title: ['clamp(17px, 15.84px + 0.3226vw, 21px)', { lineHeight: '1.4', fontWeight: '600' }],  /* 20 */
        num: ['clamp(30px, 24.19px + 1.6129vw, 50px)', { lineHeight: '1.05', fontWeight: '800' }],   /* 47 */

        /* A figure set inside HALF a seven column track — the two insurance
           tiles. Its own curve, because that track is ~0.245 * viewport wide
           before padding and a size derived from the full measure overflows it.
           Ceiling for eleven glyphs of tabular Manrope ExtraBold is
           (0.245 * vw - 64) / 6.6; this stays under it from 320 up. */
        figure: ['clamp(20px, 17.67px + 0.6481vw, 32px)', { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.02em' }], /* 27 */

        /* Display. d0 is the HERO ONLY. d3 is the ONE heading that lands in a
           four column track (For Contractors) — used once, not a tier. */
        d3: ['clamp(22px, 19.1px + 0.8065vw, 32px)', { lineHeight: '1.26', letterSpacing: '-0.018em' }],  /* 31 */
        /* STEEPER CURVE, anchored on the laptop rather than the desktop.
           The old one resolved to 42px at 1366, where a six column track is
           561px — so "You cannot check a track record." needed 560px and broke
           to a second line, giving a three line heading on every laptop while a
           1728px MacBook got the intended two. Anchored at 33px/1366 it clears
           that clause with room to spare and still reaches 44 on a large
           display. Solve for a new anchor as:
              b = (max - atAnchor) / (1920 - anchorVw);  a = atAnchor - b * anchorVw */
        d2: ['clamp(24px, 5.88px + 1.9856vw, 44px)', { lineHeight: '1.24', letterSpacing: '-0.022em' }], /* 35 @1440 */
        d1: ['clamp(26px, 19.03px + 1.9355vw, 50px)', { lineHeight: '1.22', letterSpacing: '-0.02em' }],  /* 47 */
        d0: ['clamp(26px, 18.45px + 2.0968vw, 52px)', { lineHeight: '1.16', letterSpacing: '-0.026em' }], /* 49 */
      },
      spacing: { 1: '8px', 2: '16px', 3: '24px', 4: '32px', 6: '48px', 8: '64px', 12: '96px' },
      borderRadius: {
        bar: '2px',      /* the accent bar only */
        DEFAULT: '12px', /* inputs, selects, textarea */
        lg: '20px',      /* cards */
        xl: '28px',      /* photo frames, large planes */
        pill: '999px',   /* buttons, tags, icon plates */
        none: '0',
      },
      maxWidth: { measure: '84%', text: '640px' },
      screens: { sm: '768px', md: '1024px', lg: '1276px' },
      boxShadow: {
        focus: '0 0 0 2px #CBA135, 0 0 0 4px #10251A',
        /* Lifts a card off cream. Deliberately a green-tinted shadow rather
           than neutral black: on #FBFAF6 a grey shadow reads as dirt. */
        card: '0 18px 40px -18px rgba(16, 37, 26, 0.18)',
        badge: '0 18px 40px -18px rgba(16, 37, 26, 0.55)',
      },
    },
  },
  plugins: [],
} satisfies Config;
