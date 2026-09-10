import { Manrope } from 'next/font/google';

/**
 * Manrope, chosen by MEASUREMENT against the logo's strapline rather than by
 * taste. The strapline is the only real type in the artwork (the IES mark is
 * bespoke lettering no text face reaches), so it is the correct reference.
 *
 * Measured, glyph ink width over cap height across C R A W S N E B T L I,
 * root mean square error against the artwork:
 *     Manrope 0.0136   <-- chosen
 *     Inter   0.0331
 *     DM Sans 0.0410
 *     Archivo 0.0970   <-- the previous choice, 7x further away
 *
 * And the stroke weights land almost exactly:
 *     strapline stroke/cap measured 0.1234, Manrope 400 gives 0.1233
 *     mark      stroke/cap measured 0.2172, Manrope 800 gives 0.2055
 * Archivo 800 measured 0.2714, i.e. 25% heavier than the mark it was meant to
 * echo. An earlier note rejected Manrope on a "squared counter" test, but that
 * test compared it to the bespoke MARK; the strapline is the right reference
 * and Manrope wins it outright.
 *
 * `weight` is omitted so the whole 200..800 variable axis ships in one file.
 */
export const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  fallback: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
  preload: true,
});
