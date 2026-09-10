import type { ComponentType, CSSProperties } from 'react';
import { Container } from './Container';
import { SectionHeader } from './Primitives';
import { IconArrow } from './Icons';
import { Img, lqipStyle } from './Img';
import { IconArray, IconBadge, IconConsumerUnit, IconContainment } from './Icons';
import { services } from '@/lib/content';

/** The icon set no longer forwards arbitrary SVG props — see Icons.tsx. */
type IconComponent = ComponentType<{ className?: string; style?: CSSProperties }>;

/**
 * CENTRED header over a symmetric 3-up card row.
 *
 * The three cards carry three different grounds, which is the device the client
 * pointed at in the reference: a light card, an accent card and a dark card in
 * one row. It is adapted rather than copied — the references give each card its
 * own icon hue, and this identity owns ONE accent, so the colour variety they
 * buy at icon level this page buys at card level instead. Every plate on the
 * page is the logo's own green and gold pair, inverted by ground.
 *
 * Contrast is legal on all three by construction, not by luck:
 *   cream-100  ink-900 on #F3F1E9  14.84:1
 *   gold       green-900 on #CBA135 6.68:1   (the same pair as the gold button)
 *   green-900  cream-50 on #10251A 14.27:1
 *
 * The order is deliberate: the gold card is card 1, Commercial and Contracting,
 * because main contractors are the primary audience and this is the only place
 * on the page where a whole surface carries the accent.
 */
type Tone = 'light' | 'gold' | 'dark';

const TONES: Record<
  Tone,
  {
    bg: string; heading: string; body: string; bar: string; rule: string;
    link: string; badgeBg: string; badgeFg: string; tileRest: string;
  }
> = {
  light: {
    bg: 'var(--cream-100)',
    heading: 'var(--ink-900)',
    body: 'var(--body-700)',
    bar: 'var(--gold-ink)',
    rule: 'var(--rule-light-strong)',
    link: 'var(--ink-900)',
    badgeBg: 'var(--green-900)',
    badgeFg: 'var(--gold-500)',
    tileRest: 'rgba(16, 37, 26, 0.07)',
  },
  gold: {
    bg: 'var(--gold-500)',
    heading: 'var(--green-900)',
    body: 'var(--green-900)',
    bar: 'var(--green-900)',
    rule: 'rgba(16, 37, 26, 0.28)',
    link: 'var(--green-900)',
    badgeBg: 'var(--green-900)',
    badgeFg: 'var(--gold-500)',
    tileRest: 'rgba(16, 37, 26, 0.12)',
  },
  dark: {
    bg: 'var(--green-900)',
    heading: 'var(--on-dark)',
    body: 'var(--on-dark-body)',
    bar: 'var(--gold-500)',
    rule: 'var(--rule-dark-strong)',
    link: 'var(--on-dark)',
    badgeBg: 'var(--gold-500)',
    badgeFg: 'var(--green-900)',
    tileRest: 'rgba(251, 250, 246, 0.10)',
  },
};

const ORDER: Tone[] = ['gold', 'light', 'dark'];

/* Subject matter is the trade, not generic business glyphs: containment for
   commercial, a consumer unit for domestic, a solar array for renewables. All
   three are orthogonal objects in life, so the mark's no-diagonal rule costs
   nothing here. */
const ICONS: IconComponent[] = [IconContainment, IconConsumerUnit, IconArray];

function Card({ card, tone, Icon }: { card: (typeof services.cards)[number]; tone: Tone; Icon: IconComponent }) {
  const t = TONES[tone];
  return (
    <article
      className="card reveal flex flex-col col-span-4 sm:col-span-8 md:col-span-4"
      data-col="4"
      style={{
        background: t.bg,
        borderRadius: 'var(--r-lg)',
        padding: 'var(--pad-surface)',
        minHeight: 360,
        // Tokens the children read, so a card's tone is set in ONE place.
        ['--bar-fill' as string]: t.bar,
        ['--link' as string]: t.link,
        ['--link-hover' as string]: t.link,
        ['--card-rule' as string]: t.rule,
        // The action plate takes the same pair as this card's icon badge, so
        // the two circular objects in a card never disagree. See globals.css.
        ['--tile-rest-bg' as string]: t.tileRest,
        ['--tile-hover-bg' as string]: t.badgeBg,
        ['--tile-hover-fg' as string]: t.badgeFg,
      }}
    >
      {/* THE PHOTO HEADER, and the plate overlapping it.
          Electricien, Ampvex and Mezan all open a service card with an image
          and drop a coloured icon chip across its lower edge. The chip is what
          keeps the card from reading as a photo with a caption: it belongs to
          the CARD, so it has to break the photo's boundary to say so.

          The photo is inset by the card's own 32px padding rather than
          bleeding to the card edge. A bled image would need the card's 20px
          radius on its top two corners and square on the bottom two, which is
          four different corners on one object; inset, it is one 20px rectangle
          inside another and the geometry stays honest.

          `overflow-visible` on the wrapper, not the frame: .photo clips its own
          image, and the chip has to escape that clip. */}
      <div className="relative" style={{ marginBottom: 28 }}>
        <div
          className={`photo ${tone === 'gold' ? 'photo--on-gold' : ''}`}
          style={{ aspectRatio: '16 / 10', borderRadius: 'var(--r-lg)', ...lqipStyle(card.photo) }}
        >
          <Img
            src={card.photo}
            alt={card.photoAlt}
            /* One of three cards at desktop, full width once they stack. */
            sizes="(min-width: 1024px) 26vw, (min-width: 768px) 40vw, 84vw"
            /* Optional per card: `cover` centres by default, which is wrong
               whenever the subject is off centre in the source. */
            style={'photoPosition' in card ? { objectPosition: card.photoPosition } : undefined}
          />
        </div>
        <div className="absolute" style={{ left: 16, bottom: -24 }}>
          <IconBadge bg={t.badgeBg} fg={t.badgeFg}>
            <Icon />
          </IconBadge>
        </div>
      </div>
      {/* Two title lines are reserved: below 1280 the longest title wraps, and
          the shared hairline and link baselines have to survive that. */}
      <h3 className="t text-title card-title mt-3" style={{ color: t.heading }}>
        {card.title}
      </h3>
      {/* mb-3 is not decoration. The hairline claims the card's slack with
          `marginTop: auto`, and in the tallest card there is no slack left, so
          without a bottom margin here the longest body sits ON the rule. */}
      <p className="t text-body mt-3 mb-3" style={{ color: t.body }}>
        {card.body}
      </p>
      {/* The hairline owns the card's slack, so all three land on one line
          whatever the copy does. Only one element may claim it. */}
      <div
        aria-hidden="true"
        className="mt-3"
        style={{ height: 1, background: t.rule, marginTop: 'auto' }}
      />
      {/* The action row: label left, tile right, both on one 48px line. The
          tile sits INSIDE the anchor, so it is hit area rather than a second
          control, and aria-hidden keeps the accessible name the sentence. The
          underline class rides the label span rather than the flex anchor, so
          the rule cannot be drawn across the tile. */}
      <a
        href={card.link.href}
        className="text-ui flex items-center justify-between gap-2 mt-3 w-full"
        style={{ minHeight: 48, color: t.link }}
      >
        <span className="lnk">{card.link.label}</span>
        <span className="card-tile" aria-hidden="true">
          <IconArrow />
        </span>
      </a>
    </article>
  );
}

export function Services() {
  return (
    <section
      id="services"
      className="ground-cream"
      /* Extra top padding: the hero's fold strip hangs 56px into this section,
         so the section header has to start below where that strip ends or the
         two collide. `position: relative` + z-index 0 keeps this ground BEHIND
         the strip rather than painting over it. */
      style={{
        paddingTop: 'calc(var(--section-pad) + 72px)',
        paddingBottom: 'var(--section-pad)',
        position: 'relative',
        zIndex: 0,
      }}
      aria-labelledby="services-title"
    >
      <Container>
        <div className="ies-grid">
          <div className="col-span-4 sm:col-span-8 md:col-span-12" data-col="12">
            <SectionHeader
              headline={services.headline}
              id="services-title"
              align="centre"
            />
          </div>
        </div>
        <div className="ies-grid ies-grid--rows mt-6">
          {services.cards.map((c, i) => (
            <Card key={c.title} card={c} tone={ORDER[i]} Icon={ICONS[i]} />
          ))}
        </div>
      </Container>
    </section>
  );
}
