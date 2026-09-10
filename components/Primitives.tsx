import type { CSSProperties, ReactNode } from 'react';
import type { Fact, Headline } from '@/lib/content';
import { company } from '@/lib/content';
import { IconArrow, IconCheck } from '@/components/Icons';
import { Img, lqipStyle } from '@/components/Img';

/**
 * The page's single ornament: the E's middle bar, lifted at its native 3.29:1
 * proportion and never stretched. Two sizes only.
 *
 * It is the Gate's answer slot and the hero's opening mark. Nothing else — it
 * is no longer the section eyebrow's mark, because the eyebrow is no longer a
 * mandatory object on every section. It never stretches: anything full width is
 * a 1px hairline, which is a different object in the artwork.
 */
export function Bar({ className = '' }: { className?: string }) {
  return <span className={`bar ${className}`} aria-hidden="true" />;
}

export function BarSm({ className = '' }: { className?: string }) {
  return <span className={`bar-sm ${className}`} aria-hidden="true" />;
}

/**
 * The section eyebrow: the label alone.
 *
 * Two heavier treatments were tried and dropped — a bordered box (the border
 * outshouted the label, and read as a UI control on cream) and a 48x14 accent
 * bar above it (still one object too many above a headline). The label carries
 * itself: it is 11px, uppercase, tracked 0.12em and gold, which is already
 * distinct from every other text style on the page.
 *
 * Colour needs no token of its own. --micro resolves to --gold-ink (5.22:1) on
 * cream and --gold-500 (6.68:1) on green-900, so it is legal on every ground
 * by construction.
 *
 * It stays label-only now that the cards carry icon plates. Restoring either
 * dropped treatment would put a THIRD object above every h2.
 */
export function Chip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`chip text-micro uppercase ${className}`}>
      {/* `.t` rides the LABEL, not the pill: on the pill its cap-trim pseudo
          elements fight the flex centring. */}
      <span className="t">{children}</span>
    </span>
  );
}

/**
 * A nameplate row: micro label over a value, divided by a rule above.
 *
 * Lifted out of Hero.tsx because Coverage now uses the same object. It is the
 * page's one way of printing a fact on a dark ground, and it returns null on a
 * null value, so any row can disappear at runtime and the rules recompute
 * around it — the same discipline the fact table uses.
 *
 * `flex-1` matters only inside a stretched flex column (the hero panel, where
 * slack goes into row height rather than bottom padding). In a plain block
 * parent it is inert, so the same component serves both.
 */
export function PanelRow({ label, value, flush = false }: { label: string; value: Fact; flush?: boolean }) {
  if (value === null) return null;
  return (
    <div
      className="flex flex-col justify-center flex-1"
      style={{
        // `flush` is for the row that OPENS a surface. Its top rule would have
        // nothing above it to divide, so the row sits on the card's own padding
        // instead of under a hairline hanging in space. In the hero the mark is
        // above row one, so the rule there is doing real work and stays.
        borderTop: flush ? undefined : '1px solid var(--rule-dark)',
        minHeight: flush ? 56 : 72,
        paddingBlock: 16,
        paddingTop: flush ? 0 : 16,
      }}
    >
      <p className="t text-micro uppercase" style={{ color: 'var(--micro)' }}>
        {label}
      </p>
      <p className="t text-value num mt-1" style={{ color: 'var(--heading)' }}>
        {value === 'pending' ? 'Available on request' : value}
      </p>
    </div>
  );
}

/**
 * The strapline as live text. The pipe is DRAWN, not typed, so it matches the
 * artwork's 1px rule with its 14.6% cap overshoot rather than whatever vertical
 * bar the font happens to carry.
 */
export function Strapline({
  left,
  right,
  className = '',
}: {
  left: string;
  right: string;
  className?: string;
}) {
  return (
    <span className={`strapline t ${className}`}>
      {left}
      <span className="strapline__sep" aria-hidden="true" />
      &#8203; {right}
    </span>
  );
}

/**
 * The house headline: light first clause, bold second clause, both at full ink.
 * Weights 400 and 800, which puts the page's stroke contrast within ~3% of the
 * logo's own 1.746 stem ratio.
 *
 * `accent` names a substring of `bold` and gets a 2px gold underline. The
 * references recolour one word orange; that is unavailable here and the reason
 * is arithmetic rather than taste. On cream the only legal gold for TEXT is
 * --gold-ink at 5.22:1, because true gold is 2.31:1 and illegal at any size. An
 * underline is a RULE, not text, so it can carry the true brand gold on both
 * grounds and the word above it stays at full ink. Same emphasis, legal
 * everywhere, and it reuses the mark's own horizontal-bar vocabulary.
 *
 * If `accent` is absent or is not found inside `bold`, the bold clause renders
 * plainly. No throw, and no branch that changes layout between dev and prod.
 */
export function SplitHeadline({
  as: Tag = 'h2',
  headline,
  className = '',
  id,
}: {
  as?: 'h1' | 'h2';
  headline: Headline;
  className?: string;
  id?: string;
}) {
  const { light, bold, accent } = headline;
  // A headline must not end a line on a function word. Where the light clause
  // ends on one, the join to the bold clause is non-breaking, so the word
  // travels with what it governs instead of hanging at the line end.
  const FUNCTION_WORD = /\b(a|an|the|and|or|of|to|for|in|on|at|we|you|by|with|is|it)$/i;
  const joiner = light && FUNCTION_WORD.test(light.trim()) ? '\u00a0' : ' ';
  // The accent is matched against a NORMALISED clause. Headlines bind function
  // word pairs with non-breaking spaces, so a plainly typed accent silently
  // failed `includes` and the underline just never appeared — no error, no
  // layout change, nothing to notice in review. U+00A0 is one character, so
  // normalising is length preserving and the index still slices the ORIGINAL
  // string, which keeps the non-breaking spaces inside the accented run.
  const flat = (v: string) => v.replace(/\u00a0/g, ' ');
  const at = accent ? flat(bold).indexOf(flat(accent)) : -1;
  const canAccent = accent && at >= 0;
  let boldNode: ReactNode = bold;
  if (canAccent) {
    boldNode = (
      <>
        {bold.slice(0, at)}
        {/* The ORIGINAL slice, not the accent prop: the run on the page keeps
            whatever non-breaking spaces the headline was written with. */}
        <span className="accent-word">{bold.slice(at, at + accent.length)}</span>
        {bold.slice(at + accent.length)}
      </>
    );
  }
  // No light clause: a single flat sentence, no joiner, no undefined.
  if (!light) {
    return (
      <Tag id={id} className={`t ${className}`}>
        <span style={{ fontWeight: 'var(--w-mark)' as unknown as number }}>{boldNode}</span>
      </Tag>
    );
  }
  return (
    <Tag id={id} className={`t ${className}`}>
      <span style={{ fontWeight: 'var(--w-text)' as unknown as number }}>{light}</span>
      {joiner}
      <span style={{ fontWeight: 'var(--w-mark)' as unknown as number }}>{boldNode}</span>
    </Tag>
  );
}

/**
 * The section header. One spec, two variants, no per-section widths.
 *
 *   chip · 16 · h2 · 32 · sub · 48 · content
 *
 * The h2-to-sub gap went 24 -> 32 when the display sizes went up. A headline
 * ending on an accented word carries a 3px rule 7px below its baseline, and at
 * 24px the paragraph under it cleared that rule by single figures — close
 * enough to read as a collision rather than as a gap.
 *
 * The composition rule is mechanical, with no judgement in it:
 *   CENTRED when the content below spans the full container as a symmetric row
 *           of equal cards.
 *   LEFT    when the content below occupies a sub-column — a table, a form, a
 *           list, or a card grid on the 7.
 * Never both in one section.
 *
 * Commitments and Coverage moved from the first case to the second when they
 * gained bounded content on the 7. That is the rule applying, not an exception
 * to it: what changed is the content below, not the test.
 *
 * Centred measures are grid arithmetic rather than magic pixels, so they stay
 * correct at every --cols regime: headline 8 columns, sub 6 columns, both
 * centred on the container's own axis.
 *
 * The `marginInline: auto` on the sub is NOT redundant. globals.css sets
 * `p { max-width: var(--text-measure) }` with no auto margin, so on a wide
 * viewport the 640px cap engages inside a wider centred wrapper and the
 * paragraph silently left-hangs. This is the line that stops that.
 */
export function SectionHeader({
  micro,
  microStyle = 'plain',
  headline,
  sub,
  id,
  as = 'h2',
  align = 'left',
  headingClass = 'text-d2',
  children,
}: {
  /**
   * OPTIONAL, and that is the point.
   *
   * This was `micro: string` — required — so every one of the eleven sections
   * opened on the identical object: a gold pill, a dot, two to four tracked
   * caps words. Eleven times is not a house style, it is a template slot, and
   * it was the loudest single reason the page read as machine-made. A section
   * may now simply begin with its heading.
   *
   * Three treatments, deliberately mixed rather than standardised:
   *   'pill'   the closed gold capsule. ONCE on the page, on the gold band,
   *            where it inverts to green and reads as a stamp pressed into the
   *            colour. The hero carried the second one until it was cut.
   *   'plain'  tracked caps with no container. Three times.
   *   omitted  no eyebrow at all. Seven times.
   *
   * Do NOT normalise these back to one treatment in either direction. Bare
   * caps everywhere was tried before and read as unstyled text (globals.css
   * records it); pills everywhere is what this change exists to undo.
   */
  micro?: string;
  microStyle?: 'pill' | 'plain';
  headline: Headline;
  sub?: string;
  id?: string;
  as?: 'h1' | 'h2';
  align?: 'left' | 'centre';
  headingClass?: string;
  children?: ReactNode;
}) {
  const centred = align === 'centre';
  const eyebrow = micro
    ? microStyle === 'pill'
      ? <Chip className={centred ? 'reveal-chip' : 'reveal-bar'}>{micro}</Chip>
      : (
        <p
          className={`t text-micro uppercase ${centred ? 'reveal-chip' : 'reveal-bar'}`}
          style={{ color: 'var(--micro)' }}
        >
          {micro}
        </p>
      )
    : null;
  const headlineMeasure = { maxWidth: 'calc(8 * var(--col) + 7 * var(--gutter))', marginInline: 'auto' };
  const subMeasure = { maxWidth: 'calc(6 * var(--col) + 5 * var(--gutter))', marginInline: 'auto' };

  return (
    <div style={centred ? { textAlign: 'center' } : undefined}>
      {eyebrow}

      {/* No eyebrow means no top margin — otherwise a section with a cold open
          carries 16px of empty space above its first ink. */}
      {centred ? (
        <div style={headlineMeasure}>
          <SplitHeadline as={as} id={id} headline={headline} className={`${headingClass} ${micro ? 'mt-2' : ''} reveal`} />
        </div>
      ) : (
        <SplitHeadline as={as} id={id} headline={headline} className={`${headingClass} ${micro ? 'mt-2' : ''} reveal`} />
      )}

      {sub ? (
        centred ? (
          <div style={subMeasure}>
            <p
              className="t text-lead prose mt-4 reveal"
              style={{ color: 'var(--body)', marginInline: 'auto' }}
            >
              {sub}
            </p>
          </div>
        ) : (
          <p className="t text-lead prose mt-4 reveal" style={{ color: 'var(--body)' }}>
            {sub}
          </p>
        )
      ) : null}

      {children}
    </div>
  );
}

/* ===========================================================================
 * REDESIGN PRIMITIVES — the reference set's shared devices.
 *
 * Each one is a SHAPE taken from the ten references. None of them carries
 * borrowed CONTENT: the page's governing rule is that publishing a company
 * number makes every other assertion checkable, so a badge that reads "850+
 * Projects Completed" in a reference reads a verifiable figure here.
 * ======================================================================== */

/*
 * THE COUNTER-PLATE IS GONE.
 *
 * Every call to action carried a filled disc holding an arrow, tucked inside
 * the pill's trailing edge — the Biztop/Auron/Inconsl device. Removed at the
 * client's call: eight buttons on one page each wearing the same ornament is
 * the ornament becoming a uniform, which is the same fault the eyebrow pill
 * had. A button that says "Request a quote" does not need an arrow to explain
 * that it goes somewhere.
 *
 * `.btn__go` and its hover transform are gone from globals.css too. IconArrow
 * survives for the card tiles, which is a different object: there the arrow IS
 * the affordance, because the card's label is a link rather than a button.
 */
/**
 * The standalone circular arrow — a card's corner action, or a section's
 * "see all" beside a heading.
 *
 * `as="span"` when the whole card is already a link: a nested anchor would be
 * invalid HTML and a duplicate tab stop for the same destination.
 */
export function ArrowPlate({
  filled = false,
  as: Tag = 'span',
  className = '',
}: {
  filled?: boolean;
  as?: 'span' | 'div';
  className?: string;
}) {
  return (
    <Tag className={`arrow-plate ${filled ? 'arrow-plate--filled' : ''} ${className}`} aria-hidden="true">
      <IconArrow />
    </Tag>
  );
}

/**
 * The floating fact badge — the small accent card the references hang off a
 * photograph's corner.
 *
 * THE CONTENT RULE, and it is the whole reason this component takes a `label`
 * rather than free children: the value must be a figure a reader can verify
 * without asking us. Insurance cover, a company number, a statutory response
 * window, a document count that is a list length on this same page. Never a
 * count of work done, a rating, a headcount or a year.
 *
 * Returns null on a null value, the same discipline PanelRow uses, so a badge
 * whose fact is not yet known removes itself rather than printing an empty
 * plate over a photograph.
 */
export function FactBadge({
  value,
  label,
  tone = 'gold',
  className = '',
  style,
}: {
  value: Fact;
  label: string;
  tone?: 'gold' | 'green';
  className?: string;
  style?: CSSProperties;
}) {
  if (value === null) return null;
  return (
    <div className={`fact-badge ${tone === 'green' ? 'fact-badge--green' : ''} ${className}`} style={style}>
      <span className="fact-badge__value num">{value === 'pending' ? 'On request' : value}</span>
      <span className="fact-badge__label">{label}</span>
    </div>
  );
}

/**
 * A rounded, clipped photograph.
 *
 * `ratio` is an aspect-ratio string and is REQUIRED, because every one of these
 * frames holds a stock image today that a real site photograph replaces later.
 * Declaring the box means the swap cannot move anything below it, and it means
 * the reserved space is correct before the image decodes — the layout shift
 * this page would otherwise take on eight new photographs at once.
 */
export function Photo({
  src,
  alt,
  ratio,
  fill = false,
  offset = false,
  className = '',
  style,
  imgStyle,
  sizes,
  children,
}: {
  src: string;
  alt: string;
  /** Required unless `fill`. */
  ratio?: string;
  /**
   * FILL mode: the frame takes its height from the grid row instead of from an
   * aspect ratio, so the COLUMN BESIDE IT sets the section height.
   *
   * This exists because the alternative is worse in a specific, repeatable way:
   * a ratio'd photo on a six column span is ~750px tall, the prose beside it is
   * ~600px, and the difference is not a margin — it is 150px of dead cream in
   * the text column that no amount of spacing tuning removes, because the
   * picture is the thing setting the height. Fill inverts that: the content
   * decides, and the photograph crops to suit.
   */
  fill?: boolean;
  offset?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Crop control. `cover` centres by default, which is wrong whenever the
   *  subject is off centre in the source. */
  imgStyle?: CSSProperties;
  /** How wide this frame renders, so the browser can pick a variant before
   *  layout. See the note in Img.tsx — a wrong value here is worse than none
   *  of this machinery at all. */
  sizes: string;
  children?: ReactNode;
}) {
  const frame = (
    <div
      className="photo"
      style={{
        ...(fill ? { height: '100%', minHeight: 360 } : { aspectRatio: ratio }),
        ...lqipStyle(src),
      }}
    >
      <Img src={src} alt={alt} sizes={sizes} style={imgStyle} />
    </div>
  );
  if (!offset) {
    return (
      <div className={`relative ${fill ? 'h-full' : ''} ${className}`} style={style}>
        {frame}
        {children}
      </div>
    );
  }
  return (
    <div className={`photo-offset ${className}`} style={style}>
      {frame}
      {children}
    </div>
  );
}

/** A checklist row: gold disc, green tick, one line of text. */
export function CheckItem({ children }: { children: ReactNode }) {
  return (
    /* `text-body` rides the <li>, not the label span. The disc's vertical
       offset is `0.36em - 11px` (see globals.css), and `em` there has to
       resolve against the TEXT's size — which it only can if the size is set on
       their common parent. */
    <li className="check-item text-body">
      <span className="check-item__mark" aria-hidden="true">
        <IconCheck />
      </span>
      <span className="t" style={{ color: 'var(--body)' }}>
        {children}
      </span>
    </li>
  );
}

/* ===========================================================================
 * DEPTH AND ORNAMENT — the second redesign pass.
 * See the matching block in globals.css for why these exist.
 * ======================================================================== */

/**
 * The four point star the reference set scatters around a section.
 * Quadratic curves, no diagonal straight edges, so it sits inside the icon
 * set's own no-diagonal constraint.
 */
export function Sparkle({
  size = 24,
  className = '',
  style,
}: {
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={`sparkle ${className}`}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 0c0 6.6 5.4 12 12 12 -6.6 0-12 5.4-12 12 0-6.6-5.4-12-12-12 6.6 0 12-5.4 12-12z" />
    </svg>
  );
}
