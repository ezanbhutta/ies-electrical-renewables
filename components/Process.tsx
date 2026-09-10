import { Container } from './Container';
import { SectionHeader } from './Primitives';
import { process } from '@/lib/content';

/**
 * CENTRED header over a symmetric 4-up card row — the composition every one of
 * the four reference sites uses for a step or feature row.
 *
 * Previously this was an asymmetric split with the numerals hanging into a void
 * column. The void is gone, so the numerals come onto the line at the top of
 * each card, which is where the references put them.
 *
 * On the dark ground `--numeral` resolves to `--gold-500` through the ground
 * scope, so four 56px figures become the largest piece of accent on the page.
 * That is the visual mass the references spend on a project gallery, which is
 * the one thing a weeks old company cannot show.
 *
 * Numerals are SOLID, not outlined: `-webkit-text-stroke` renders
 * inconsistently and a hollow stroke is a construction the mark never uses.
 * All four steps are permanently open. No accordion, no client JS.
 *
 * REDESIGN: each step became a bounded card, which is what Inconsl and Catalxg
 * do with a numbered step row. The card is OUTLINED where Commitments' cards
 * two sections up are FILLED, and that is deliberate: both sections are four
 * green-700-ish objects on green-900, and filling both would make the second
 * read as a repeat of the first rather than a new idea. An outline also lets
 * the 56px numeral sit on the section's own ground, so the accent stays the
 * loudest thing in the card instead of competing with a fill.
 */
export function Process() {
  return (
    <section
      className="ground-green-900"
      style={{ paddingBlock: 'var(--section-pad)' }}
      aria-labelledby="process-title"
    >
      <Container>
        <div className="ies-grid">
          <div className="col-span-4 sm:col-span-8 md:col-span-12" data-col="12">
            <SectionHeader
              micro={process.micro}
              headline={process.headline}
              id="process-title"
              align="centre"
            />
          </div>
        </div>

        <ol className="ies-grid ies-grid--rows mt-6">
          {process.steps.map((s) => (
            <li
              key={s.n}
              className="card col-span-4 md:col-span-3 reveal flex flex-col"
              data-col="3"
              style={{
                /* A FILL, not an outline. These were the one outlined card on
                   the page; with the hairlines gone everywhere else an outline
                   here would have been the only one left. The fill is what the
                   other dark surfaces already use. */
                background: 'var(--green-700)',
                borderRadius: 'var(--r-lg)',
                padding: 'var(--pad-surface)',
              }}
            >
              <span
                aria-hidden="true"
                className="t text-num num block"
                style={{ color: 'var(--numeral)' }}
              >
                {s.n}
              </span>
              <h3 className="t text-title mt-3" style={{ color: 'var(--heading)' }}>
                {s.title}
              </h3>
              <p className="t text-body mt-2" style={{ color: 'var(--body)' }}>
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
