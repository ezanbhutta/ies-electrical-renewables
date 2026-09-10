import { Container } from './Container';
import { Photo, SectionHeader } from './Primitives';
import { whoDoesTheWork, company } from '@/lib/content';
import type { Fact } from '@/lib/content';

/**
 * Split B, cream. Position 4, immediately after For Contractors.
 *
 * NOT placed inside For Contractors: DESIGN-DIRECTION.md already ruled that a
 * solitary portrait in the band written for a buyer counting heads publishes
 * headcount as one. This is its own section for the same reason.
 *
 * Every row is a token and any row removes itself, so the section degrades to
 * the name and role alone rather than printing empty labels.
 */
function Row({ label, value }: { label: string; value: Fact }) {
  if (value === null) return null;
  return (
    <div
      className="ies-grid items-start"
      style={{
        borderTop: '1px solid var(--rule-strong)',
        minHeight: 64,
        paddingBlock: 16,
        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
        columnGap: 'var(--gutter)',
      }}
    >
      <dt className="t text-micro uppercase col-span-4 md:col-span-3" style={{ color: 'var(--micro)' }} data-col="3">
        {label}
      </dt>
      <dd
        className="t text-body col-span-4 md:col-span-4 md:col-start-4 max-md:mt-1"
        style={{ color: value === 'pending' ? 'var(--muted)' : 'var(--heading)' }}
        data-col="4"
      >
        {value === 'pending' ? 'Available on request' : value}
      </dd>
    </div>
  );
}

export function WhoDoesTheWork() {
  const rows = whoDoesTheWork.rows.filter((r) => r.value !== null);
  if (company.principalName === null) return null;

  return (
    <section
      id="who-does-the-work"
      className="ground-cream relative"
      style={{ paddingBlock: 'var(--section-pad)' }}
      aria-labelledby="who-title"
    >
      <Container>
        <div className="ies-grid items-stretch">
          {/* PHOTO LEFT, CONTENT RIGHT — the reference set's about-block.
              Electricien, Ampvex, Biztop and Current all run this composition,
              and all four hang a coloured block behind the image so the frame
              is not a plain rectangle on a plain ground.

              The offset block is gold and sits down-right, which is the only
              direction available: up-left would collide with the section's own
              top rule, and the container's right edge has the gutter to absorb
              a 24px overhang. It is a pseudo element, so it costs no markup and
              cannot take focus.

              The photograph is a PLACEHOLDER of somebody else's electrician and
              the alt text says only what the picture shows. This section is
              about a named individual, so replacing it with a photograph of
              that individual is the highest value image swap on the page —
              public/IMAGE-CREDITS.md says so too. */}
          <div className="col-span-4 sm:col-span-8 md:col-span-5" data-col="5">
            <Photo
              src="/electrician.jpg"
              alt="A screwdriver at the terminals of a domestic consumer unit, blue neutrals and green and yellow earths behind it."
              ratio="4 / 5"
              sizes="(min-width: 1024px) 42vw, 84vw"
              /* The hand sits at the left of a landscape source, so a portrait
                 crop taken from the centre loses it. */
              imgStyle={{ objectPosition: '26% 50%' }}
              offset
              className="reveal"
            />
          </div>

          <div className="col-span-4 sm:col-span-8 md:col-span-6 md:col-start-7 max-md:mt-8" data-col="6">
            <SectionHeader
              headline={whoDoesTheWork.headline}
              sub={whoDoesTheWork.sub}
              id="who-title"
            />

          {/* The right column became a bounded surface — the same card the
              enquiry form uses. It adds one of the page's missing objects
              without adding a single icon: a plate beside QUALIFICATIONS would
              read as a credential seal for credentials no body has awarded to
              IES, so this section stays badgeless on purpose.

              The <dl> keeps its border-bottom. It is not redundant against the
              card's own inset hairline, because the notes list sits below it
              INSIDE the card, and that rule is what divides table from notes. */}
           <div
             className="card reveal mt-6"
             style={{
               background: 'var(--cream-100)',
               borderRadius: 'var(--r-lg)',
               padding: 'var(--pad-surface)',
             }}
           >
            <p className="t text-title" style={{ color: 'var(--heading)' }}>
              {company.principalName === 'pending' ? 'Available on request' : company.principalName}
              {company.principalRole && company.principalRole !== 'pending' ? (
                <span style={{ color: 'var(--muted)' }}>, {company.principalRole}</span>
              ) : null}
            </p>

            {rows.length > 0 ? (
              <dl
                className="mt-3"
                style={{ borderBottom: '1px solid var(--rule-strong)' }}
              >
                {rows.map((r) => (
                  <Row key={r.label} label={r.label} value={r.value} />
                ))}
              </dl>
            ) : null}

            {/* mt-3 between notes, not mt-2. Cap trim puts each box's bottom on
                its own baseline, so a 16px gap lands at 27.5px baseline to
                baseline — within a rounding error of this text's own 28px line
                spacing, and the two separate statements read as one wrapped
                paragraph. 24px separates them. */}
            <ul className="mt-3">
              {whoDoesTheWork.notes.map((n) => (
                <li key={n} className="t text-body mt-3" style={{ color: 'var(--body)' }}>
                  {n}
                </li>
              ))}
            </ul>
           </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
