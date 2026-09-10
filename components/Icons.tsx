import type { ComponentType, CSSProperties, ReactNode } from 'react';
import {
  ArrowRight,
  Cable,
  Check,
  ClipboardList,
  FileCheck2,
  Files,
  HousePlug,
  Mail,
  MapPin,
  Phone,
  SunMedium,
  UserRound,
} from 'lucide-react';

/**
 * THE ICON SET.
 *
 * These were hand drawn — a 24px box, a 2px stroke module on even centrelines,
 * butt caps, miter joins, and no diagonal anywhere, because the logo contains
 * none. The construction was rigorous and the result was not legible: cable
 * tray seen head on read as three vertical bars, a consumer unit as an
 * unlabelled rectangle, a solar array as a plain grid. At 24px inside a 48px
 * plate the reader had to be told what they were looking at, which is the one
 * thing an icon may not require. They are Lucide now (ISC licensed), and the
 * exported names are unchanged so nothing else in the codebase moved.
 *
 * Lucide draws with ROUND caps and joins where the old set used butt and miter.
 * That is a real departure from the artwork and it is the right one now: the
 * page's geometry moved to pills, 20px cards and circular plates, and a hard
 * mitred glyph inside a circular gold plate was the last square object left in
 * the system.
 *
 * WHAT MAY NOT BE USED HERE, and this is a truth constraint rather than a
 * drawing one: no shields, rosettes, seals, award ribbons or ticks-in-badges.
 * They depict approval, and no body has approved IES. Lucide ships BadgeCheck,
 * ShieldCheck and Award; this page may use none of them. A tick inside a LIST
 * is fine and appears in the handover checklist — that marks an item on a list
 * of what we issue, not an accolade.
 *
 * Every icon here is decorative BY CONSTRUCTION: a plate always sits above or
 * beside a title naming the same thing, so all of them render aria-hidden.
 */
type GlyphProps = { className?: string; style?: CSSProperties };

type LucideLike = ComponentType<{
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
  'aria-hidden'?: boolean;
}>;

const glyph = (Cmp: LucideLike) =>
  function Icon({ className, style }: GlyphProps) {
    return <Cmp size={24} strokeWidth={2} className={className} style={style} aria-hidden />;
  };

/* --- SERVICES ------------------------------------------------------------ */

/** Commercial and Contracting — containment, distribution, small power. */
export const IconContainment = glyph(Cable);

/** Domestic — rewires, consumer units, inspection and testing. */
export const IconConsumerUnit = glyph(HousePlug);

/** Renewables — solar, battery storage, EV charge points, heat pumps. */
export const IconArray = glyph(SunMedium);

/* --- COMMITMENTS --------------------------------------------------------- */

/** One named contact. A PERSON, deliberately: the commitment is about who
 *  answers the phone, and every approval-shaped glyph is banned above. */
export const IconPass = glyph(UserRound);

/** RAMS issued before we come to site. */
export const IconMethodStatement = glyph(ClipboardList);

/** Certificates at handover. A document carrying a tick — the document TYPE,
 *  not an award. */
export const IconCertificate = glyph(FileCheck2);

/** Insurance certificates and method statements, sent on request. */
export const IconDossier = glyph(Files);

/* --- CONTACT ------------------------------------------------------------- */

export const IconCall = glyph(Phone);
export const IconLetterbox = glyph(Mail);
export const IconPlot = glyph(MapPin);

/* --- UI AFFORDANCES ------------------------------------------------------ */

/** The advance mark, inside a 40px plate. 16px, never 24: it is an affordance
 *  in the same family as a focus ring, not a subject like the glyphs above. */
export function IconArrow({ className, style }: GlyphProps) {
  return <ArrowRight size={16} strokeWidth={2} className={className} style={style} aria-hidden />;
}

/** The checklist tick. Sits inside a gold disc, so it is drawn in green ink. */
export function IconCheck({ className, style }: GlyphProps) {
  return <Check size={16} strokeWidth={2.5} className={className} style={style} aria-hidden />;
}

/**
 * THE PLATE the glyph sits in.
 *
 * A ROUNDED SQUARE, not a circle. The references use both; the mark contains no
 * closed circular path anywhere, and its one curve decision is the squared C
 * whose counter the gold bar completes, so a true circle would undo it.
 *
 * Geometry lives in `.icon-badge`: 48px square at `--r` (7px), which is 14.48%
 * of its minor — the mark's own corner ratio at control scale. It does NOT
 * follow `--r-lg`; that is a cap for large planes.
 *
 * WHERE IT MAY GO, and this is what stops an icon set becoming a badge farm:
 * only at card scale, only on a bounded surface, ONE PER SURFACE. Never in a
 * list row, never inline with body text, never in nav, never in the footer.
 * The bar is a MARKER that points at a line of text; the badge is a LABEL that
 * names the subject of a surface. Neither crosses into the other.
 */
export function IconBadge({
  children,
  bg,
  fg,
  className = '',
}: {
  children: ReactNode;
  bg: string;
  fg: string;
  className?: string;
}) {
  return (
    <span className={`icon-badge ${className}`} style={{ background: bg, color: fg }} aria-hidden="true">
      {children}
    </span>
  );
}
