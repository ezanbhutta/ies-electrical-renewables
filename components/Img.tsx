import type { CSSProperties } from 'react';
import { images } from '@/lib/images';

/**
 * THE ONE IMAGE PRIMITIVE.
 *
 * Every photograph on the page goes through here. It exists because this
 * project builds to TWO targets — the Vercel app and a static folder that has
 * to open from disk with no server — so `next/image` is unavailable by
 * construction: its optimiser is a server route. Variants are generated ahead
 * of time by scripts/gen-images.py and selected here with a plain <picture>,
 * which behaves identically in both targets and needs no runtime JS.
 *
 * WHAT IT FIXES, measured before the change: 1.06MB of JPEG served as
 * image/jpeg to every device regardless of what the browser asked for. A phone
 * downloaded the same 900px file as a 27 inch display, no modern format was
 * negotiated at all, and each frame sat empty until its file landed.
 *
 * Three things happen here:
 *
 *   1. FORMAT NEGOTIATION. AVIF first, WebP second, JPEG last. The browser
 *      takes the first <source> whose type it supports, so this is a
 *      capability check rather than a guess about the device.
 *
 *   2. RESPONSIVE SELECTION. `srcset` lists the real widths and `sizes` tells
 *      the browser how wide the frame will actually be, so it can choose
 *      before layout. `sizes` is REQUIRED from every caller — a wrong or
 *      missing one is the single easiest way to make this slower than plain
 *      <img>, because the default `100vw` makes a 340px card download the
 *      1400px file.
 *
 *   3. A PLACEHOLDER. A 20px blur of the image itself, inlined as a data URI
 *      (~1KB, costs no request), painted as the frame's background. The photo
 *      fades over it on decode, so a frame is never empty and never flashes.
 *
 * An unknown `src` is not an error: it renders a plain <img> and carries on,
 * because a missing manifest entry should degrade to today's behaviour rather
 * than blank the page.
 */
export function Img({
  src,
  alt,
  sizes,
  priority = false,
  className = '',
  style,
}: {
  src: string;
  alt: string;
  /** e.g. "(min-width: 1024px) 30vw, 100vw". Required — see note 2 above. */
  sizes: string;
  /** Set on the LCP image only. Disables lazy loading and raises fetch priority. */
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const meta = images[src];
  const common = {
    alt,
    className,
    width: meta?.w,
    height: meta?.h,
    decoding: 'async' as const,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    fetchPriority: priority ? ('high' as const) : ('auto' as const),
    style,
  };

  if (!meta) return <img src={src} sizes={sizes} {...common} />;

  const stem = src.replace(/^\//, '').replace(/\.jpg$/, '');
  const set = (ext: string) => meta.widths.map((w) => `/img/${stem}-${w}.${ext} ${w}w`).join(', ');

  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img src={`/img/${stem}-${meta.widths[meta.widths.length - 1]}.jpg`} srcSet={set('jpg')} sizes={sizes} {...common} />
    </picture>
  );
}

/** The blur placeholder for a frame, as a style object. */
export function lqipStyle(src: string): CSSProperties {
  const meta = images[src];
  if (!meta) return {};
  return {
    backgroundImage: `url("${meta.lqip}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
}
