'use client';

import { useState } from 'react';
import { Bar, SectionHeader } from './Primitives';
import { gate, company } from '@/lib/content';

/**
 * THE GATE — the buyer sets their own thresholds and each row answers itself
 * against what IES has already published above.
 *
 * WHY IT USES THE BAR AND NOT A TICK
 * The middle letter of the mark is a C. The gold stub is the only thing that
 * makes it read IES rather than ICS, so presence or absence of that one object
 * is the sole place this identity carries meaning by something being there or
 * not being there. A cleared row puts the bar in the slot; an open row leaves
 * the slot empty. No tick, no cross, no red. Both rows stay legible, the same
 * way ICS is a legible word and simply the wrong one.
 *
 * WHAT WAS DELIBERATELY REMOVED
 * An aggregate "clears 3 of 5" counter. Three reasons, any one sufficient:
 *   1. It is a claim about IES that exists in no content file, and it implies a
 *      formal assessment that nobody has run.
 *   2. It hands a supply chain manager a screenshot ready fail count in ten
 *      seconds, inside the one section written to win the approved list.
 *   3. It could only be built as a CSS counter, which is generated content and
 *      never reaches a screen reader, so the payoff of the whole interaction
 *      would have been the one part assistive tech could not have.
 * Every row now answers for itself, in real DOM text.
 *
 * The open rows are not failures to hide. They are the two questions an
 * approved list decision usually turns on, so answering them early and then
 * offering to talk is worth more than a buyer discovering them later.
 */

/** "£5,000,000" -> 5000000. Returns null for 'pending', null, or unparseable. */
function toNumber(v: string | null): number | null {
  if (!v || v === 'pending') return null;
  const digits = v.replace(/[^0-9]/g, '');
  return digits ? Number(digits) : null;
}

type Answer = { cleared: boolean; text: string } | null;

export function Gate() {
  const [picked, setPicked] = useState<Record<string, string>>({});

  /** Resolve one row against what IES publishes. Never invents a value. */
  function answer(rowId: string, optionId: string): Answer {
    const row = gate.rows.find((r) => r.id === rowId);
    const opt = row?.options.find((o) => o.id === optionId);
    if (!row || !opt) return null;

    if (rowId === 'pl' || rowId === 'el') {
      const held = rowId === 'pl' ? company.publicLiability : company.employersLiability;
      const heldNum = toNumber(held);
      // A 'pending' or empty figure is neither cleared nor open. Saying "open"
      // would assert a shortfall we have not established.
      if (heldNum === null) return { cleared: false, text: 'Available on request.' };
      return heldNum >= opt.value
        ? { cleared: true, text: `${held} in place.` }
        : { cleared: false, text: `${held} in place, which is under your minimum.` };
    }

    if (rowId === 'ssip') {
      if (opt.value === 0) return { cleared: true, text: 'Nothing needed from us here.' };
      return company.accreditations.length > 0
        ? { cleared: true, text: company.accreditations.join(', ') }
        : { cleared: false, text: company.accreditationsFallback };
    }

    if (rowId === 'person') {
      if (opt.value === 0) return { cleared: true, text: 'Nothing needed from us here.' };
      const q = company.principalQualifications;
      const named = company.principalName;
      if (!q || q === 'pending' || !named || named === 'pending') {
        return { cleared: false, text: 'Named contact and qualifications on request.' };
      }
      return { cleared: true, text: `${named}. ${q}.` };
    }
    return null;
  }

  /** Carry the still open rows into the enquiry form and move focus there. */
  function sendOpen() {
    const open = gate.rows
      .map((r) => {
        const chosen = picked[r.id];
        if (!chosen) return null;
        const a = answer(r.id, chosen);
        if (!a || a.cleared) return null;
        const opt = r.options.find((o) => o.id === chosen);
        return `${r.label}: ${opt?.label}`;
      })
      .filter(Boolean) as string[];

    const message = open.length
      ? `${gate.handoff.intro}\n${open.map((l) => `- ${l}`).join('\n')}`
      : gate.handoff.intro;

    window.dispatchEvent(
      new CustomEvent('ies:enquiry-prefill', { detail: { message, type: 'Main contractor' } }),
    );
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const anyOpen = gate.rows.some((r) => {
    const c = picked[r.id];
    if (!c) return false;
    const a = answer(r.id, c);
    return a && !a.cleared;
  });

  return (
    /* THE GATE, rebuilt as one bounded instrument.
     *
     * It was a full width stack of fieldsets on bare hairlines: a three word
     * label alone in a 3/12 column, option pills adrift in the middle, and the
     * sentence "Set a threshold to see the answer." repeated once per row —
     * the same line of grey text four times, which is filler, not an interface.
     *
     * Now it is a card with a three part row: LABEL | OPTIONS | ANSWER, all on
     * one baseline. The placeholder sentence is stated ONCE as a hint under the
     * heading, and each row's answer slot holds a short "Not set" until there
     * is something to say. The slot keeps its width either way, so answering a
     * row moves nothing on the page.
     */
    <div>
      {/* ONE LEFT EDGE. The hint used to sit in its own four column block
          starting at column 9, which put it at L935 — aligned to nothing above
          it, below it or beside it, and the only text on the page that did not
          share an edge with something. It belongs with the sentence it
          qualifies. */}
      <div className="ies-grid">
        <div className="col-span-4 sm:col-span-8 md:col-span-7" data-col="7">
          <SectionHeader headline={gate.headline} sub={gate.sub} />
          <p className="t text-meta mt-2" style={{ color: 'var(--muted)' }}>
            {gate.unsetHint}
          </p>
        </div>
      </div>

      <div
        className="reveal mt-6"
        style={{
          background: 'var(--green-700)',
                    borderRadius: 'var(--r-xl)',
          padding: '6px var(--pad-surface) var(--pad-surface)',
        }}
      >
        {gate.rows.map((row, idx) => {
          const chosen = picked[row.id];
          const a = chosen ? answer(row.id, chosen) : null;
          return (
            <fieldset
              key={row.id}
              className="gate-row"
              style={{ borderTop: idx === 0 ? 'none' : '1px solid var(--rule-dark)' }}
            >
              <legend className="vh">{row.label}</legend>

              <p className="t text-micro uppercase gate-row__label" style={{ color: 'var(--micro)' }} aria-hidden="true">
                {row.label}
              </p>

              <div className="gate-row__opts flex flex-wrap gap-1">
                {row.options.map((o) => {
                  const on = chosen === o.id;
                  return (
                    <label
                      key={o.id}
                      data-on={on}
                      data-label={o.label}
                      className="text-ui gate-opt"
                      style={{
                        /* 44, not 40. `.gate-opt` sets this in globals.css for
                           the same reason, but an inline style outranks a class
                           — so the class alone left every option two thirds of
                           a millimetre under the minimum touch target. */
                        minHeight: 44,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        /* A pill must never wrap. `border-radius: 999px` on a
                           box grown to two lines is an ellipse, which is what
                           "Not required" rendered as once the column narrowed. */
                        whiteSpace: 'nowrap',
                        padding: '0 18px',
                        borderRadius: 'var(--r-pill)',
                        cursor: 'pointer',
                        background: on ? 'var(--gold-500)' : 'transparent',
                        color: on ? 'var(--green-900)' : 'var(--heading)',
                        border: `1px solid ${on ? 'var(--gold-500)' : 'var(--btn-ghost-dark-border)'}`,
                        fontWeight: on ? 'var(--w-mark)' : 'var(--w-ui)',
                        transition: 'background-color 150ms ease-out, color 150ms ease-out',
                      }}
                    >
                      <input
                        type="radio"
                        name={row.id}
                        value={o.id}
                        checked={on}
                        onChange={() => setPicked((p) => ({ ...p, [row.id]: o.id }))}
                        className="vh"
                      />
                      {/* A SPAN, not a bare text node. `.gate-opt > *` assigns
                          the shared grid area to ELEMENT children only; an
                          anonymous text item does not match it, so the label
                          was auto-placed into a second implicit row underneath
                          the hidden bold-width copy and sat low in its pill. */}
                      <span>{o.label}</span>
                    </label>
                  );
                })}
              </div>

              {/* The answer. Real DOM text in a live region, never generated
                  content, so a screen reader gets exactly what a sighted reader
                  gets. */}
              <div className="gate-row__answer" aria-live="polite">
                {a?.cleared ? <Bar className="gate-row__bar" /> : null}
                <span
                  className="block t text-body"
                  style={{ color: a ? 'var(--heading)' : 'var(--muted)' }}
                >
                  {a ? (
                    a.cleared ? a.text : `${gate.openPrefix} ${a.text}`
                  ) : (
                    <>
                      <span aria-hidden="true" style={{ opacity: 0.55, letterSpacing: '0.08em' }}>
                        {gate.unsetLabel}
                      </span>
                      <span className="vh">{gate.unsetLabelA11y}</span>
                    </>
                  )}
                </span>
              </div>
            </fieldset>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
        <p className="t text-meta" style={{ color: 'var(--muted)' }}>
          {gate.scopeNote}
        </p>
        {anyOpen ? (
          <button type="button" onClick={sendOpen} className="btn btn--ghost max-sm:w-full md:ml-auto">
            {gate.handoff.label}
          </button>
        ) : null}
      </div>
    </div>
  );
}
