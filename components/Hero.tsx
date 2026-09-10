import { Container } from './Container';
import { PanelRow, SplitHeadline } from './Primitives';
import { Img, lqipStyle } from './Img';
import { hero, company } from '@/lib/content';

/**
 * THE HERO, rebuilt.
 *
 * The first redesign pass kept the original construction — a text column, a
 * void column and a flat nameplate, all inside their grid cells — and only
 * changed the corners. That is why it still read as a brochure. This is the
 * reference set's construction instead:
 *
 *   1. DISPLAY TYPE AT 80px. The references run 72 to 90; the page's old
 *      ceiling was 56 and no amount of layout fixes a hero that is not loud.
 *   2. A PHOTOGRAPH IN A FRAME on the right, with the compliance card LAYERED
 *      over its lower corner — card over photo over ground, which is the
 *      depth every one of the ten references has and this page had none of.
 *   3. THE FOLD STRIP CROSSING THE SECTION SEAM into Services.
 *
 * On (3): the old direction document ruled that nothing may cross a section
 * boundary, on the grounds that the artwork contains no such element. The
 * client has since asked for the reference language explicitly, and three of
 * the ten references park exactly this bar across exactly this seam. The rule
 * is superseded, and said so here rather than quietly broken.
 *
 * Everything in the strip and the card is a token from lib/content.ts. The
 * construction changed; not one claim did.
 */
export function Hero() {
  const rows = hero.panel.rows.filter((r) => r.value !== null);

  return (
    <section
      id="top"
      className="ground-green-900 section-overlap"
      aria-labelledby="hero-title"
      /* NO bottom padding. The strip's negative margin is what pulls the
         section's bottom edge up through it, and any padding here is added back
         below that — with 80px of it the strip finished 24px ABOVE the seam
         instead of astride it, which is a near miss that reads as a mistake.
         The strip supplies its own top margin, so the gap above it is kept. */
      style={{ paddingTop: 'var(--hero-pad)', paddingBottom: 0 }}
    >
      {/* Atmosphere, not portfolio. Licensed stock, duotoned into the brand
          green and darkened until its lightest pixels still clear 4.80:1
          against gold. Decorative: empty alt, aria-hidden, no caption, so
          nothing here claims this is work IES has done.

          NOT lazy loaded — it is the LCP element. Explicit width and height so
          it reserves its box and cannot shift layout. */}
      {/* THE LCP ELEMENT. `priority` on this one only: it is above the fold on
          every viewport, so lazy loading it would defer the largest paint on
          the page. Everything else on the page stays lazy. */}
      <div className="absolute inset-0 -z-10" aria-hidden="true" style={{ ...lqipStyle('/hero.jpg') }}>
        <Img
          src="/hero.jpg"
          alt=""
          priority
          sizes="100vw"
          className="h-full w-full object-cover"
          style={{ opacity: 0.5 }}
        />
      </div>
      {/* The wash. Two stops rather than one: the left third carries the
          headline and needs to be near solid, the right stays open so the
          photograph is still legible behind the frame. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(100deg, var(--green-900) 0%, rgba(16,37,26,0.94) 42%, rgba(16,37,26,0.72) 100%)',
        }}
      />

      <Container>
        <div className="ies-grid items-center">

          <div className="col-span-4 sm:col-span-8 md:col-span-6" data-col="6" style={{ position: 'relative', zIndex: 2 }}>
            <SplitHeadline
              as="h1"
              id="hero-title"
              headline={hero.headline}
              className="text-d0"
            />

            <p className="t text-lead mt-4" style={{ color: 'var(--body)', maxWidth: 520 }}>
              {hero.sub}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 mt-6">
              <a href={hero.primary.href} className="btn btn--gold max-sm:w-full">
                {hero.primary.label}
              </a>
              <a href={hero.secondary.href} className="btn btn--ghost max-sm:w-full">
                {hero.secondary.label}
              </a>
            </div>
          </div>

          {/* THE LAYERED RIGHT SIDE: photo frame with the compliance card
              across its bottom. Not rendered below 1024 — the
              card's rows are a subset of the fact table, so nothing is lost,
              and a three layer stack at 390px is a pile, not a composition. */}
          <div
            className="hidden md:block md:col-span-5 md:col-start-8"
            data-col="5"
            style={{ position: 'relative', zIndex: 1 }}
          >
            {/* The crop favours the right of the frame, where the RCD and the
                run of MCBs are, rather than the bare hand at the left edge —
                the same file carries the hand in Who Does The Work, and the two
                instances should not open on the same detail.

                Do NOT drop the image: the compliance card is positioned
                absolutely against this frame's parent, whose height comes
                solely from the 4/5 box. */}
            {/* 1/1, not 4/5. The grid is `items-center`, so the section's
                height is whichever column is taller — shrinking the headline
                alone would have left the 4/5 frame setting the same height as
                before and nothing would have moved. */}
            <div
              className="photo"
              style={{ aspectRatio: '1 / 1', borderRadius: 'var(--r-xl)', ...lqipStyle('/electrician.jpg') }}
            >
              <Img
                src="/electrician.jpg"
                alt=""
                sizes="(min-width: 1024px) 34vw, 84vw"
                style={{ objectPosition: '62% 55%' }}
              />
            </div>


            {/* The card crosses the frame's bottom edge and hangs past its
                left. Both overhangs land in the void column beside it, which
                is empty by construction at every width this renders at. */}
            <div
              className="ground-green-900"
              style={{
                position: 'absolute',
                left: -76,
                bottom: -40,
                zIndex: 4,
                /* 84%, not 100% + 40. At full width it covered the whole lower
                   half of the frame including the subject, so the photograph
                   became a texture behind a card rather than a layer under it.
                   Leaving the frame's right quarter clear is what makes the
                   stack read as depth. */
                width: '84%',
                background: 'var(--green-900)',
                                borderRadius: 'var(--r-xl)',
                padding: 24,
                boxShadow: '0 32px 64px -28px rgba(0,0,0,0.6)',
              }}
            >
              <div className="flex flex-col">
                {rows.map((r, i) => (
                  <PanelRow key={r.label} label={r.label} value={r.value} flush={i === 0} />
                ))}
              </div>
              <a
                href={hero.panel.link.href}
                className="lnk text-ui inline-flex items-center gap-1 mt-2"
                style={{ minHeight: 44 }}
              >
                {hero.panel.link.label}
              </a>
            </div>
          </div>
        </div>

        {/* THE FOLD STRIP, astride the seam. --overlap is half its own height,
            so it sits exactly on the boundary rather than near it. */}
        <div
          className="overlap-down reveal"
          style={{
            ['--overlap' as string]: '-56px',
            marginTop: 56,
            background: 'var(--green-700)',
                        borderRadius: 'var(--r-xl)',
            padding: '20px 28px',
            boxShadow: '0 32px 64px -28px rgba(0,0,0,0.45)',
          }}
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <div>
              <p className="t text-micro uppercase" style={{ color: 'var(--micro)' }}>
                {hero.strip.callLabel}
              </p>
              <a
                href={`tel:${company.phone.replace(/\s+/g, '')}`}
                className="lnk tap t text-value num mt-1"
                style={{ color: 'var(--heading)' }}
              >
                {company.phone}
              </a>
            </div>
            {hero.strip.items.map((it) => (
              <div
                key={it.label}
                className="max-sm:hidden"
                style={{ borderLeft: '1px solid var(--rule-dark)', paddingLeft: 32 }}
              >
                <p className="t text-micro uppercase" style={{ color: 'var(--micro)' }}>
                  {it.label}
                </p>
                {/* Same size as the phone number beside it. The strip holds
                    three facts of equal standing, and setting one of them two
                    steps larger made it read as a heading with two captions. */}
                <p className="t text-value mt-1" style={{ color: 'var(--heading)' }}>
                  {it.value}
                </p>
              </div>
            ))}
            <a href={hero.strip.cta.href} className="btn btn--gold max-sm:w-full md:ml-auto">
              {hero.strip.cta.label}
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
