'use client';

import { useEffect } from 'react';

/**
 * The page's third and last piece of client JS, and it is deliberately tiny.
 *
 * One job: provide the reveal fallback for browsers without scroll driven
 * animations. Where `animation-timeline: view()` exists (Chrome 115+), the
 * reveals are pure CSS and this observer never runs at all.
 *
 * It no-ops entirely under prefers-reduced-motion, and it never affects layout:
 * the reveals animate opacity and transform only, so no measurement in the
 * acceptance checklist moves.
 */
export function Motion() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const cleanups: Array<() => void> = [];

    const supportsViewTimeline =
      typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: view()');
    if (!supportsViewTimeline) {
      const targets = document.querySelectorAll('.reveal, .reveal-bar, .reveal-chip, .wght-in');
      // Toggles rather than latches, so an element replays every time it
      // re-enters the viewport, scrolling either way. `unobserve` here would
      // make the fallback behave differently from the view() path.
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            entry.target.classList.toggle('is-in', entry.isIntersecting);
          }
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
      );
      targets.forEach((t) => io.observe(t));
      cleanups.push(() => io.disconnect());
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
