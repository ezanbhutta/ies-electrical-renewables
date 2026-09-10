import { Container } from './Container';
import { LogoLockup } from './LogoLockup';
import { footer, company } from '@/lib/content';

/**
 * Four columns at C1–C3 / C4–C6 / C7–C9 / C10–C12, heads on L1, L4, L7, L10.
 *
 * Column 1 carries the INLINED lockup at 168px wide, not the flat white
 * Asset 7. At 168 the artwork's baked-in strapline cap measures 8.59px against
 * the live 12px strapline's 8.64px, so the page never shows two sizes of the
 * same line. At 180 the artwork's strapline would render 6.6% larger.
 *
 * REDESIGN. The previous footer was a logo, three link columns and a legal
 * line — which is every footer on the internet, and was fairly called generic.
 * A COMPLIANCE STRIP was added here and then removed. It was a dark card of
 * gold figures with its own call to action — structurally identical to the
 * hero's fold strip about 14,000px above, so the page opened and closed on the
 * same widget, and it was the FOURTH surface printing the same two insurance
 * numbers. The figures now sit in the legal line at the bottom, which is where
 * a supply chain reader looks for them anyway.
 *
 *   (removed) A main contractor scrolls to a footer looking for
 *      a company number. Every reference site spends this slot on a newsletter
 *      signup, which would be a new promise this page cannot keep. The four
 *      figures that make the page self auditing sit here instead, at a size
 *      that can be read without hunting, and every one is already published
 *   further up so nothing new is asserted.
 *
 * Still no giant display type down here, and that ruling now has a second
 * reason behind it: an outlined ghost of the strapline was tried across the
 * bottom bar and taken out again at the client's call. The largest type in this
 * identity is the mark itself.
 */
export function Footer() {
  const year = new Date().getFullYear();
  /* The compliance figures live HERE now, at legal weight, in the hairline
     divided run that already existed — not in a dark card with its own gold
     button. That strip was the same object as the hero fold strip about
     14,000px above it, so the page opened and closed on one component, and it
     was the fourth place these two numbers were typeset. Nothing left the
     page; it stopped being announced four times. */
  const bottom = [
    company.legalName,
    company.companyNumber ? `Company number ${company.companyNumber}` : null,
    company.vatNumber ? `VAT ${company.vatNumber}` : null,
    company.publicLiability && company.publicLiability !== 'pending' ? `PL ${company.publicLiability}` : null,
    company.employersLiability && company.employersLiability !== 'pending' ? `EL ${company.employersLiability}` : null,
    String(year),
  ].filter(Boolean) as string[];

  return (
    <footer className="ground-green-900" style={{ paddingTop: 'var(--section-pad)', paddingBottom: 48 }}>
      <Container>
        <div className="ies-grid gap-y-6">
          <div className="col-span-4 sm:col-span-4 md:col-span-3" data-col="3">
            <LogoLockup style={{ width: 168, height: 'auto' }} title={`${company.siteName} logo`} />
            <p className="t text-meta mt-3" style={{ color: 'var(--body)' }}>
              {footer.blurb}
            </p>
          </div>

          <nav className="col-span-4 sm:col-span-4 md:col-span-3" data-col="3" aria-label={footer.columns.services.head}>
            <h2 className="t text-micro uppercase" style={{ color: 'var(--micro)' }}>
              {footer.columns.services.head}
            </h2>
            <ul className="mt-2 flex flex-col gap-1">
              {footer.columns.services.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="lnk text-meta inline-flex items-center" style={{ minHeight: 32 }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="col-span-4 sm:col-span-4 md:col-span-3" data-col="3" aria-label={footer.columns.company.head}>
            <h2 className="t text-micro uppercase" style={{ color: 'var(--micro)' }}>
              {footer.columns.company.head}
            </h2>
            <ul className="mt-2 flex flex-col gap-1">
              {footer.columns.company.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="lnk text-meta inline-flex items-center" style={{ minHeight: 32 }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-4 sm:col-span-4 md:col-span-3" data-col="3">
            <h2 className="t text-micro uppercase" style={{ color: 'var(--micro)' }}>
              {footer.columns.contact.head}
            </h2>
            <ul className="mt-2 flex flex-col gap-1">
              <li>
                <a
                  href={`tel:${company.phone.replace(/\s/g, '')}`}
                  className="lnk text-meta num inline-flex items-center"
                  style={{ minHeight: 32 }}
                >
                  {company.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className="lnk text-meta inline-flex items-center break-token" style={{ minHeight: 32 }}>
                  {company.email}
                </a>
              </li>
              {company.registeredAddress && company.registeredAddress !== 'pending' ? (
                <li>
                  <p className="t text-meta" style={{ color: 'var(--body)' }}>
                    {company.registeredAddress}
                  </p>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div aria-hidden="true" className="mt-8" style={{ height: 1, background: 'var(--rule-dark)' }} />

        {/* The separator TRAILS its item instead of leading the next one.
            Leading separators orphan: when this run wraps — and with five
            items it wraps on any phone — a wrapped line opened with a floating
            pipe against the margin. A trailing one lands at the end of a line
            instead, where it reads as a continuation, and the last item never
            gets one. `items-baseline`, not `items-center`, so the rules sit on
            the text baseline rather than the tallest box in the row. */}
        <ul className="mt-3 flex flex-wrap items-baseline gap-y-1">
          {bottom.map((item, i) => (
            <li key={item} className="flex items-baseline">
              <span className={`text-legal ${i > 0 ? 'num' : ''}`} style={{ color: 'var(--muted)' }}>
                {item}
              </span>
              {i < bottom.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="mx-2 block"
                  style={{ width: 1, height: 12, background: 'var(--rule-dark-strong)', alignSelf: 'center' }}
                />
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
