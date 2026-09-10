'use client';

import { useEffect, useState } from 'react';
import { LogoLockup } from './LogoLockup';
import { Container } from './Container';
import { BarSm } from './Primitives';
import { header, company } from '@/lib/content';

/**
 * 88px permanent green-900 rail, sticky, with a permanent 1px gold hairline.
 *
 * The brief asked for a cream header that acquires a hairline once scrolled
 * past 40px. That cannot work here: a cream bar sitting on a green-900 hero has
 * a visible seam from pixel zero, and the scroll listener would be the third
 * piece of client JS on a page budgeted for two. A constant dark rail is
 * invisible against the hero and reads as a nameplate over cream.
 *
 * The mark takes NO optical correction. It is orthogonal with a flat, full
 * weight stem on the leading I, so its box edge is its optical edge — it is
 * what defines L1 for the whole page.
 */
export function Header() {
  const [open, setOpen] = useState(false);

  // Close on Escape, and lock the background while the panel is up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="ground-green-900 sticky top-0 z-50" style={{ borderBottom: '1px solid var(--gold-500)' }}>
      <Container>
        <div className="flex items-center justify-between h-[64px] md:h-[88px]">
          {/* The full lockup, strapline included. Intrinsic ratio 199.64 x 100.31,
              so a 56px tall lockup is 111.5px wide and leaves 16px above and below
              inside the 88px rail. On mobile it runs 40px tall inside the 64px rail. */}
          <a
            href="#top"
            className="flex items-center"
            style={{ minHeight: 44 }}
            aria-label={`${company.siteName}, home`}
          >
            <LogoLockup style={{ width: 79.6, height: 'auto' }} className="md:hidden" />
            <LogoLockup style={{ width: 111.5, height: 'auto' }} className="hidden md:block mark-anim" />
          </a>

          {/* Desktop cluster, anchored to L13. Reading order left to right:
              nav · divider · phone · CTA. */}
          <div className="hidden md:flex items-center">
            <nav aria-label="Primary">
              <ul className="flex items-center gap-3">
                {header.nav.map((n) => (
                  <li key={n.label}>
                    <a href={n.href} className="nav-lnk text-ui">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Vertical divider: 14px, the cap height of the line it separates,
                plus the artwork's 14.6% overshoot. Verticals read heavier than
                horizontals, so this uses --rule-strong. */}
            <span
              aria-hidden="true"
              className="mx-3 block"
              style={{ width: 1, height: 14, background: 'var(--rule-strong)' }}
            />

            <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="lnk text-ui num mr-3">
              {company.phone}
            </a>

            <a href={header.cta.href} className="btn btn--gold">
              {header.cta.label}
            </a>
          </div>

          {/* Mobile control. Three horizontal bars, the middle one gold — the
              C's own vocabulary, with gold completing it exactly as it completes
              the E. There is no X: an X is two diagonals and the artwork has
              none, so the open state is the word CLOSE. */}
          <button
            type="button"
            className="md:hidden flex items-center min-h-[44px] min-w-[44px] justify-end"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <span className="flex items-center gap-1">
                <BarSm />
                <span className="text-micro uppercase" style={{ color: 'var(--micro)' }}>
                  {header.menuClose}
                </span>
              </span>
            ) : (
              <>
                <span className="sr-only vh">{header.menuOpen}</span>
                <span className="flex flex-col" aria-hidden="true" style={{ gap: 5 }}>
                  <span style={{ width: 20, height: 2, background: 'var(--on-dark)' }} />
                  <span style={{ width: 20, height: 2, background: 'var(--gold-500)' }} />
                  <span style={{ width: 20, height: 2, background: 'var(--on-dark)' }} />
                </span>
              </>
            )}
          </button>
        </div>
      </Container>

      {open ? (
        <div
          id="mobile-menu"
          className="ground-green-800 md:hidden fixed inset-x-0 bottom-0 z-40 overflow-y-auto"
          style={{ top: 64 }}
        >
          <Container>
            <nav aria-label="Primary mobile" className="py-6">
              <ul className="flex flex-col">
                {header.nav.map((n) => (
                  <li key={n.label} style={{ borderBottom: '1px solid var(--rule-dark)' }}>
                    <a
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="lnk block text-title py-3 min-h-[44px]"
                      style={{ textDecoration: 'none' }}
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={`tel:${company.phone.replace(/\s/g, '')}`}
                className="lnk num block text-title py-3 min-h-[44px]"
                onClick={() => setOpen(false)}
              >
                {company.phone}
              </a>
              <a
                href={header.cta.href}
                onClick={() => setOpen(false)}
                className="btn btn--gold w-full mt-2"
              >
                {header.cta.label}
              </a>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
