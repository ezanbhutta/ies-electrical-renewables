import { Container } from './Container';
import { SectionHeader } from './Primitives';
import { faq, company } from '@/lib/content';

/**
 * SPLIT 5/7 on cream: heading left, accordion right, first row open.
 *
 * This is the one reference section IES can write completely and truthfully,
 * because every answer restates something already published further up the
 * page. It also takes the slot the references give to testimonials and does
 * that job better for a company with no clients: a buyer forms confidence from
 * answers, not from assertions.
 *
 * Native <details>/<summary>, so it is keyboard operable and costs ZERO client
 * JavaScript.
 *
 * REDESIGN — THE MARKER, and this one resolves an old constraint rather than
 * overriding it. The previous note read "no chevron and no plus/minus: the mark
 * contains no diagonal and no circle". A chevron is still out, because it is
 * nothing but diagonals. A PLUS is two rectangles on the horizontal and
 * vertical axes, so it satisfied the no-diagonal rule the whole time; it was
 * ruled out only by the no-circle half, and circles became house geometry when
 * the icon plates did. So the marker is now a plus in a circular plate that
 * rotates 45 degrees into a minus on open — which is the device Current and
 * Inconsl both use for exactly this component.
 *
 * The rows became separated rounded cards. Hairline rules were correct on a
 * sharp page; on a rounded one a stack of full-width rules is the only square
 * construction left in the section. Separated cards also mean removing a row
 * cannot orphan a rule, which is what the old border arithmetic was protecting
 * against.
 */
export function CommonQuestions() {
  return (
    <section
      id="questions"
      className="ground-cream"
      style={{ paddingBlock: 'var(--section-pad)' }}
      aria-labelledby="faq-title"
    >
      <Container>
        <div className="ies-grid items-stretch">
          <div className="col-span-4 sm:col-span-8 md:col-span-5 flex flex-col" data-col="5">
            <SectionHeader headline={faq.headline} sub={faq.sub} id="faq-title" />

            {/* A DIFFERENT KIND OF CALL TO ACTION, deliberately.
                Every other one on the page is a filled pill. This is the
                telephone number itself, set at display size, because at the
                foot of an FAQ the useful thing is not a button that scrolls you
                somewhere — it is the number, big enough to read across a desk
                and tappable on a phone.

                `margin-top: auto` drops it to the foot of the column, so the
                two columns share a bottom edge instead of leaving this one
                empty for the accordion's whole height. */}
            <div className="reveal" style={{ marginTop: 'auto', paddingTop: 48 }}>
              <p className="t text-micro uppercase" style={{ color: 'var(--micro)' }}>
                {faq.aside.label}
              </p>
              <p className="t text-lead mt-2" style={{ color: 'var(--body)' }}>
                {faq.aside.body}
              </p>
              <a
                href={`tel:${company.phone.replace(/\s/g, '')}`}
                className="lnk t text-d3 num mt-3 inline-flex items-center"
                style={{ color: 'var(--heading)', minHeight: 44 }}
              >
                {company.phone}
              </a>
              <div className="mt-2">
                <a href={faq.aside.cta.href} className="btn btn--quiet">
                  {faq.aside.cta.label}
                </a>
              </div>
            </div>
          </div>

          <div className="col-span-4 sm:col-span-8 md:col-span-7 max-md:mt-6 flex flex-col gap-2" data-col="7">
            {faq.items.map((item, i) => (
              <details key={item.q} className="faq-row" open={i === 0}>
                <summary className="faq-q flex items-start gap-3">
                  <span className="t text-title flex-1" style={{ color: 'var(--heading)' }}>
                    {item.q}
                  </span>
                  {/* The plate is aria-hidden: <summary> already exposes the
                      open state to assistive technology, and a second
                      announcement of the same fact is noise. */}
                  <span className="faq-mark" aria-hidden="true">
                    <span className="faq-mark__h" />
                    <span className="faq-mark__v" />
                  </span>
                </summary>
                <p className="t text-body prose faq-a" style={{ color: 'var(--body)' }}>
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
