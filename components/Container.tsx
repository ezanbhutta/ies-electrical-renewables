import type { ReactNode } from 'react';

/**
 * THE ONLY place in the codebase that may set a horizontal max-width, an auto
 * margin, or horizontal page padding (DESIGN-DIRECTION.md §2.6).
 *
 * A <section> carries its ground colour and its VERTICAL padding only. Writing
 * `px-12` on a coloured band puts its content at x48 while every cream section
 * sits at x130 — an 82px mismatch at 1440 and 322px at 1920, alternating down
 * the page. That is two orders of magnitude larger than any other alignment
 * risk here, which is why this is a primitive and not a convention.
 */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`ies-container ${className}`}>{children}</div>;
}
