import { Container } from './Container';
import { CheckItem, FactBadge, Photo, SectionHeader } from './Primitives';
import { whatWeHandOver } from '@/lib/content';

/**
 * SPLIT 5/7 on cream, photo left, list right — the reference set's about-block.
 *
 * THE HEIGHT RULE, which is what this section got wrong first time.
 * The photograph was given a 4/5 aspect ratio on a six column span, so it
 * measured about 750px against roughly 600px of prose beside it. The extra
 * 150px did not become a margin, it became dead cream at the bottom of the text
 * column, and the section read as a picture with some writing next to it rather
 * than as one object. The picture is now in `fill` mode: the CONTENT sets the
 * height and the photograph crops to suit. Nothing here may reintroduce a fixed
 * ratio on this image.
 *
 * THE LIST IS BOUNDED. Six ticks floating on cream had no edge of their own, so
 * the densest, most useful content in the section was also the least
 * structured. It sits on a white surface now, which is the same object the
 * enquiry form and the credentials table already use, and it gives the right
 * column something with a shape to balance the photograph's.
 *
 * The disclosure sits OUTSIDE that surface, deliberately. It qualifies the
 * list rather than belonging to it, and putting it inside would make the
 * caveat look like a seventh document.
 */
export function WhatWeHandOver() {
  return (
    <section
      id="handover"
      className="ground-cream"
      style={{ paddingBlock: 'var(--section-pad)' }}
      aria-labelledby="handover-title"
    >
      <Container>
        <div className="ies-grid items-stretch">
          {/* MIRRORED. This composition and Who Does The Work three sections
              up were byte identical — photo on the 5 at column 1 with a gold
              object hanging off it, text on the 6 at column 7 — and on a full
              page view they read as one section printed twice. DOM order is
              unchanged (photo first) so the sub-768 stack is untouched; only
              the desktop columns swap.

              `md:row-start-1` is required on BOTH children: with definite
              column starts and no row placement, grid auto-flow advances past
              column 8 and drops the col-start-1 text into a second row. */}
          <div className="col-span-4 sm:col-span-8 md:col-span-5 md:col-start-8 md:row-start-1" data-col="5">
            <Photo
              src="/testing.jpg"
              alt="A multimeter probe on a terminal inside an energised distribution board."
              fill
              sizes="(min-width: 1024px) 42vw, 84vw"
              className="reveal"
            >
              {/* THE ONE HONEST COUNTER ON THE PAGE.
                  Every reference hangs a number off an image: "560+ Projects
                  Done", "850+ Projects Completed", "30+ Years Work Experience".
                  Each is a count of work performed, which is exactly what this
                  company cannot publish.

                  This is `documents.length`. It counts the list rendered beside
                  it, so it is not a claim about the past — it is the length of
                  a promise the reader can check by looking right, and it cannot
                  drift out of agreement with that list because it is computed
                  FROM the list. Add a seventh document and it says seven. */}
              <FactBadge
                value={String(whatWeHandOver.documents.length)}
                label="Documents at handover"
                className="absolute"
                /* RIGHT now the photo is mirrored to the right of the grid:
                   the badge hangs into the container's own 8% page margin,
                   which is empty by construction. It was on the left for the
                   same reason before the mirror — the rule is that it hangs
                   AWAY from the prose column, whichever side that is. */
                /* The overhang only exists on the desktop composition, where
                   the photo is mirrored to the right of a 12 column grid and
                   the container's own 8% page margin is behind it. Stacked on
                   a phone the photo IS the container, so -24 put a gold slab
                   7px from the viewport edge. */
                style={{ bottom: 24, right: 'var(--badge-overhang, 24px)' }}
              />
            </Photo>
          </div>

          <div className="col-span-4 sm:col-span-8 md:col-span-6 md:col-start-1 md:row-start-1 max-md:mt-6" data-col="6">
            <SectionHeader
              headline={whatWeHandOver.headline}
              sub={whatWeHandOver.sub}
              id="handover-title"
            />

            {/* The gold disc and green tick — the reference set's checklist, and
                the one place a tick is honest on this page: it marks an item on
                a list of what we ISSUE, not an award somebody granted. Icons.tsx
                bans ticks-in-badges as a SUBJECT, and this is a list bullet. */}
            <ul
              className="reveal mt-4 flex flex-col"
              style={{
                background: 'var(--surface-field)',
                borderRadius: 'var(--r-lg)',
                padding: 'clamp(20px, 16.9px + 0.86vw, 30px)',
                /* Disc to disc, not box to box. The marks are 22px and the
                   cap-trimmed text box is only ~13, so a 14px gap left 9px of
                   air between two heavy gold discs and the list read as one
                   solid block. 22 gives ~17px of clearance, which is a little
                   more than the disc's own radius and is where the rows start
                   reading as separate items. */
                gap: 22,
              }}
            >
              {whatWeHandOver.documents.map((d) => (
                <CheckItem key={d}>{d}</CheckItem>
              ))}
            </ul>

            {/* The disclosure that makes the list above credible. SSIP assessors
                want twelve months of signed induction and toolbox talk records,
                which a firm with no completed jobs cannot have. Saying so is
                what stops the list reading as a claim. */}
            <p className="t text-meta prose mt-3" style={{ color: 'var(--muted)' }}>
              {whatWeHandOver.today}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
