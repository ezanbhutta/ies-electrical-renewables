import { Container } from './Container';
import { Gate } from './Gate';
import { SectionHeader } from './Primitives';
import { forContractors, company } from '@/lib/content';
import type { Fact } from '@/lib/content';

/**
 * THE SECTION THAT BEATS EVERY COMPETITOR, rebuilt.
 *
 * It was a 5/7 split with a flat six row table on the right and NOTHING in the
 * left column below the heading — about 400px of empty ground, the single
 * largest dead area on the page. The table itself had no hierarchy either: the
 * two insurance limits, which are the first thing a supply chain reader checks,
 * sat as rows three and four of six with nothing to distinguish them.
 *
 * Three changes:
 *
 *   1. THE CALL TO ACTION MOVED LEFT, under the heading, which is what the
 *      empty column was for. It also stops the button stretching the width of
 *      a 680px value column, which is not a shape a button should ever be.
 *
 *   2. THE TWO INSURANCE FIGURES BECOME TILES at display size — see the `hero`
 *      flag in lib/content.ts. Emphasis on a published fact, not a new claim,
 *      and capped at two so it never becomes a stats bar.
 *
 *   3. EVERYTHING IS BOUNDED. The facts sit on one surface instead of floating
 *      as hairlines on the section ground.
 *
 * Rule mechanics still matter more here than anywhere else, because rows
 * disappear at runtime: every row carries `border-top` and the list carries
 * `border-bottom`, so rules always equal rowCount + 1 and removing a row in any
 * position can never orphan, double or trail one.
 */
function FactRow({ label, value, numeric, first = false }: { label: string; value: Fact; numeric: boolean; first?: boolean }) {
  if (value === null) return null; // row removed; rules recompute around it
  const pending = value === 'pending';
  return (
    <div
      className="fact-row"
      style={{
        /* The first row opens the card, so its rule would hang above the top
           row with nothing to divide — it read as a stray line inside the
           card's own padding. */
        borderTop: first ? undefined : '1px solid var(--rule-dark)',
        display: 'grid',
        /* TWO EQUAL HALVES, sharing the tiles' own gutter. The old
           minmax(150px, 4fr) / 7fr split put the value column at L903, which
           lined up with neither hero tile above it — the label edges matched
           and the value edges did not, which is the sort of near miss that
           reads as sloppiness rather than as a grid. Equal halves on the same
           gutter put this column's left edge exactly on the second tile's. */
        gridTemplateColumns: 'calc((100% - var(--gutter)) / 2) minmax(0, 1fr)',
        columnGap: 'var(--gutter)',
        alignItems: 'baseline',
        paddingBlock: 14,
      }}
    >
      <dt className="t text-micro uppercase" style={{ color: 'var(--micro)' }}>
        {label}
      </dt>
      <dd
        className={`t text-body ${numeric && !pending ? 'num' : ''}`}
        style={{ color: pending ? 'var(--muted)' : 'var(--heading)' }}
      >
        {pending ? forContractors.pendingLabel : value}
      </dd>
    </div>
  );
}

export function ForContractors() {
  const accreditations =
    company.accreditations.length > 0
      ? company.accreditations.join(', ')
      : company.accreditationsFallback;

  const heroFacts = forContractors.facts.filter((f) => f.hero && f.value !== null);
  const listFacts = forContractors.facts.filter((f) => !f.hero);

  return (
    <section
      id="for-contractors"
      className="ground-green-900 relative"
      style={{ paddingBlock: 'var(--section-pad)' }}
      aria-labelledby="contractors-title"
    >
      <Container>
        <div className="ies-grid items-start">
          <div className="col-span-4 sm:col-span-8 md:col-span-4" data-col="4">
            <SectionHeader
              micro={forContractors.micro}
              headline={forContractors.headline}
              sub={forContractors.sub}
              id="contractors-title"
              /* `md:` maps exactly onto the condition that causes the defect:
                 below 1024 this block is full container width and d2's small
                 end is already right. */
              headingClass="text-d2 md:text-d3"
            />
            {/* The button lives here now, at its own width. It used to fill a
                680px column on the right while this one stood empty. */}
            <a href={forContractors.cta.href} className="btn btn--gold mt-6 max-sm:w-full">
              {forContractors.cta.label}
            </a>
          </div>

          <div className="col-span-4 sm:col-span-8 md:col-span-7 md:col-start-6 max-md:mt-8" data-col="7">
            {/* THE TWO HEADLINE FIGURES. A tile each, at --num scale, because a
                cover limit is the first gate on every prequalification and
                these were rows three and four of a flat six row table. */}
            {heroFacts.length > 0 ? (
              <ul
                className="grid grid-cols-1 sm:grid-cols-2"
                style={{ gap: 'var(--gutter)' }}
              >
                {heroFacts.map((f) => (
                  <li
                    key={f.label}
                    className="reveal"
                    style={{
                      background: 'var(--green-700)',
                                            borderRadius: 'var(--r-xl)',
                      padding: 'var(--pad-surface)',
                    }}
                  >
                    <p className="t text-micro uppercase" style={{ color: 'var(--micro)' }}>
                      {f.label}
                    </p>
                    <p
                      className={`t mt-2 ${f.value === 'pending' ? 'text-title' : 'text-figure num'}`}
                      style={{ color: f.value === 'pending' ? 'var(--muted)' : 'var(--gold-500)' }}
                    >
                      {f.value === 'pending' ? forContractors.pendingLabel : f.value}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}

            {/* Everything else, on one bounded surface. */}
            <dl
              className="reveal"
              // Same gutter vertically as the tiles use horizontally.
              style={{
                marginTop: 'var(--gutter)',
                background: 'var(--green-700)',
                                borderRadius: 'var(--r-xl)',
                padding: '10px var(--pad-surface) 22px',
              }}
            >
              {/* `first` is computed against the rows that SURVIVE, not the
                  index in the source array — a null value removes its row, so
                  a hardcoded i===0 would leave the rule on whatever came
                  second if the first fact were ever unset. */}
              {listFacts
                .filter((f) => f.value !== null)
                .map((f, i) => (
                  <FactRow key={f.label} label={f.label} value={f.value} numeric={f.numeric} first={i === 0} />
                ))}
              {/* ACCREDITATIONS always renders — list or fallback — so it can
                  never disappear and leave the reader wondering. */}
              <FactRow
                label={forContractors.accreditationsLabel}
                value={accreditations}
                numeric={false}
              />
            </dl>
          </div>
        </div>

        {/* The Gate runs full width. Inside the seven column block it stretched
            that column to roughly 1800px while the left column stayed empty for
            the whole run. Full width also gives its option rows the room they
            need at every breakpoint. */}
        <div className="ies-grid mt-12">
          <div className="col-span-4 sm:col-span-8 md:col-span-12" data-col="12">
            <Gate />
          </div>
        </div>
      </Container>
    </section>
  );
}
