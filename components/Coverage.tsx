import { Container } from './Container';
import { Chip, SplitHeadline } from './Primitives';
import { coverage } from '@/lib/content';

/**
 * THE GOLD BAND — the page's one accent ground, and its one release valve.
 *
 * IT NOW CONTAINS NOTHING BUT A SENTENCE, and that is the whole point.
 *
 * The previous version was supposed to be the moment the page breathes, and it
 * breathed by running the Services recipe with a different ground colour:
 * centred eyebrow, centred headline, centred button, symmetric row of three
 * equal cards on the twelve column grid. Same object, new paint. Worse, the
 * three tiles said nothing that was not already on the page — RESPONSE was the
 * hero fold strip's ANSWER row verbatim, BEYOND THAT restated the bold clause
 * eight lines above it, and AREAS COVERED printed a county that by then had
 * appeared in the hero sub, the hero strip, the fact table and the enquiry
 * column.
 *
 * A page made of card grids does not get quieter by adding another card grid.
 * So this section holds one statement, ranged left, on a ground nothing else
 * uses. It is the only section with no bounded object in it, and that absence
 * is what makes it read as a pause rather than as another slide.
 *
 * NO CALL TO ACTION either. It pointed at #contact, which is the very next
 * section — a button to scroll past one screen of gold.
 *
 * The eyebrow stays a PILL here. It is one of only two left on the page, and
 * on this ground it inverts to deep green and reads as a stamp pressed into
 * the colour rather than as a caption.
 *
 * WHERE IT SITS is unchanged and still load bearing: between Common Questions
 * and Enquiry, both cream, so it interrupts two like grounds. Anywhere else it
 * would touch a dark section, and two saturated grounds meeting is the one
 * thing the ground sequence exists to prevent.
 */
export function Coverage() {
  return (
    <section
      className="ground-cream band-gold"
      style={{ paddingBlock: 'calc(var(--section-pad) + 32px)' }}
      aria-labelledby="coverage-title"
    >
      <Container>
        <Chip className="reveal-bar">{coverage.micro}</Chip>

        {/* Ten columns, ranged left. Wide enough that the sentence breaks
            where it wants to rather than where a narrow measure forces it. */}
        <div style={{ maxWidth: 'calc(10 * var(--col) + 9 * var(--gutter))' }}>
          <SplitHeadline
            as="h2"
            id="coverage-title"
            headline={coverage.headline}
            className="text-d1 mt-3 reveal"
          />
        </div>

        <p className="t text-lead prose mt-4 reveal" style={{ color: 'var(--body)', maxWidth: 'var(--text-measure)' }}>
          {coverage.sub}
        </p>
      </Container>
    </section>
  );
}
