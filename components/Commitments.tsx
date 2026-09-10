import type { ComponentType, CSSProperties } from 'react';
import { Container } from './Container';
import { SectionHeader } from './Primitives';
import { IconBadge, IconCertificate, IconDossier, IconMethodStatement, IconPass } from './Icons';
import { commitments } from '@/lib/content';

/** The icon set no longer forwards arbitrary SVG props — see Icons.tsx. */
type IconComponent = ComponentType<{ className?: string; style?: CSSProperties }>;

/**
 * Position 5 on green-900: heading block on the 5, a 2x2 card grid on the 7.
 *
 * It was four bare sentences under four bars, centred, with no bounded object
 * in 8,595px of scroll around it. That is the section the references most
 * obviously do differently, and this is their composition — headline block
 * beside an asymmetric card grid.
 *
 * THE COMPOSITION RULE IS RESTATED, NOT BROKEN. Primitives.tsx sets it out:
 * centred when the row below spans the full container, left when the block
 * below occupies a sub-column. This block occupies a sub-column, so the header
 * is left. It also breaks the page's run of consecutive centred heads, which is
 * the other half of what the client was reacting to.
 *
 * FILL, NOT BORDER: green-700 on green-900 is the one step fill the palette
 * already provides and it is what the hero nameplate uses. A border-only card
 * would be the only object on the page whose edge is its entire existence.
 *
 * NO ACTION TILE on these four. They are statements, not links, and a tile
 * would promise somewhere to go.
 */
const ICONS: IconComponent[] = [
  IconPass,
  IconMethodStatement,
  IconCertificate,
  IconDossier,
];

export function Commitments() {
  return (
    <section
      id="commitments"
      className="ground-green-900"
      style={{ paddingBlock: 'var(--section-pad)' }}
      aria-labelledby="commitments-title"
    >
      <Container>
        {/* HEADER ABOVE, NOT BESIDE.
            It used to sit in a five column block next to a 2x2 grid, which left
            that column empty for the section's whole height — the largest hole
            on the page. Above the cards it costs nothing and the four
            commitments get the full measure, which is also what the composition
            rule in Primitives.tsx already says to do with a symmetric row of
            equal cards. */}
        <div className="ies-grid">
          <div className="col-span-4 sm:col-span-8 md:col-span-7" data-col="7">
            <SectionHeader
              micro={commitments.micro}
              headline={commitments.headline}
              sub={commitments.sub}
              id="commitments-title"
            />
          </div>
        </div>

        <div className="ies-grid mt-8">
          <div className="col-span-4 sm:col-span-8 md:col-span-12" data-col="12">
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {commitments.items.map((c, i) => {
                const Icon = ICONS[i];
                return (
                  <li
                    key={c.title}
                    className="card ground-green-700 reveal flex flex-col"
                    style={{ borderRadius: 'var(--r-lg)', padding: 'var(--pad-surface)' }}
                  >
                    <IconBadge bg="var(--gold-500)" fg="var(--green-900)">
                      <Icon />
                    </IconBadge>
                    {/* Two title lines reserved, so all four bodies start on one
                        line whatever the title does. */}
                    <h3 className="t text-title card-title mt-3" style={{ color: 'var(--heading)' }}>
                      {c.title}
                    </h3>
                    <p className="t text-body mt-3" style={{ color: 'var(--body)' }}>
                      {c.body}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
