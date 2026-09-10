'use client';

import { useEffect, useId, useState } from 'react';
import type { ReactNode } from 'react';
import { Container } from './Container';
import { BarSm, SectionHeader } from './Primitives';
import { Img, lqipStyle } from './Img';
import { IconBadge, IconCall, IconLetterbox, IconPlot } from './Icons';
import { enquiry, company } from '@/lib/content';
import type { Fact } from '@/lib/content';

type EnquiryType = (typeof enquiry.types)[number];
type Errors = Partial<Record<string, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The static export has no route handler to post to, so it hands the enquiry
 *  to the visitor's mail client instead of posting into a void. */
const STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1';

/**
 * The page's only stateful control, and it earns its keep: the segmented
 * control changes the message field's label, so it is doing work rather than
 * decorating. Selection is never signalled by colour alone — aria-pressed and a
 * weight change carry it too.
 *
 * Radius 2px on the shell, 0 on every internal division, because an inner edge
 * in the artwork is always square.
 */
function Segmented({
  value,
  onChange,
  labelledBy,
}: {
  value: EnquiryType;
  onChange: (v: EnquiryType) => void;
  labelledBy: string;
}) {
  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      className="flex max-md:flex-col"
      style={{ background: 'rgba(16, 37, 26, 0.06)', borderRadius: 'var(--r)', padding: 4, gap: 4 }}
    >
      {enquiry.types.map((t, i) => {
        const selected = t === value;
        return (
          <button
            key={t}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(t)}
            className="flex-1 text-ui seg-opt"
            style={{
              minHeight: 48,
              padding: '0 16px',
              // The shell can no longer clip, so the corners live on the end
              // children. `overflow:hidden` was clipping the third option out of
              // existence below ~514px and across 768-1023, and clipping the
              // focus ring off all three at every width.
              //
              // INNER RADIUS = OUTER MINUS THE BORDER WIDTH. The shell is
              // `var(--r)` on a 1px border, so a child sitting inside that
              // border needs --r minus 1 to sit concentric with it. These were
              // hardcoded 7px, which was --r's value BEFORE the redesign moved
              // it to 12 — so the segments kept a 7px corner inside a 12px
              // shell and the shell's border showed through as a broken line at
              // each end. Derived from the token now, so it cannot go stale
              // again. This is the stacked (column) axis; the row axis swaps in
              // the .seg-opt media query in globals.css.
              /* Each option is its own pill inside the track: inner radius is
                 the shell's radius minus its 4px padding, so the two sit
                 concentric. No dividers — the gap between pills does that job
                 now that there is no outline to divide. */
              borderRadius: 'calc(var(--r) - 4px)',
              background: selected ? 'var(--green-700)' : 'transparent',
              color: selected ? 'var(--cream-50)' : 'var(--ink-900)',
              fontWeight: selected ? 'var(--w-mark)' : 'var(--w-ui)',
              transition: 'background-color 150ms ease-out, color 150ms ease-out',
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
  textarea = false,
  className = '',
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  textarea?: boolean;
  className?: string;
}) {
  const errId = `${id}-error`;
  const common = {
    id,
    value,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errId : undefined,
    className: 'field-input',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
    style: {
      width: '100%',
      background: 'var(--field-bg)',
      color: 'var(--field-text)',
      borderRadius: 'var(--r)',
      padding: textarea ? '12px 16px' : '0 16px',
      height: textarea ? undefined : 48,
      minHeight: textarea ? 144 : undefined,
      font: 'var(--w-text) 16px/24px var(--font)',
    } as React.CSSProperties,
  };
  return (
    <div className={className}>
      <label htmlFor={id} className="t text-ui block" style={{ color: 'var(--ink-900)' }}>
        {label}
      </label>
      <div className="mt-1">
        {textarea ? <textarea {...common} rows={5} /> : <input {...common} type={type} autoComplete={autoComplete} />}
      </div>
      {error ? (
        <p id={errId} role="alert" className="flex items-center gap-1 mt-1">
          <BarSm />
          <span className="text-legal" style={{ color: 'var(--state-error)', fontWeight: 'var(--w-ui)' as unknown as number }}>
            {error}
          </span>
        </p>
      ) : null}
    </div>
  );
}

/**
 * A contact cell: plate, micro label, value. Three of them replace what was a
 * bare phone and email stack in the thinnest column on the page.
 *
 * THREE, NOT FOUR. The reference shows a 2x2, but IES has three contact
 * channels. A fourth would have to be Hours, Response time, or a fourth
 * printing of the company number — already in the hero nameplate, the fact
 * table and the footer. The row is 3-up because that is the shape the content
 * has, and it is not padded to fit a grid.
 *
 * It inherits FactRow's discipline: a null value removes the whole cell, and
 * 'pending' prints the standing phrase in muted rather than an empty label.
 */
function InfoCell({
  icon,
  label,
  value,
  href,
  numeric = false,
}: {
  icon: ReactNode;
  label: string;
  value: Fact;
  href?: string;
  numeric?: boolean;
}) {
  if (value === null) return null;
  const pending = value === 'pending';
  const text = pending ? 'Available on request' : value;
  // The 44px lives on the VALUE, not on the anchor. On the anchor it made the
  // two linked cells 27px taller than the third, because only they carried a
  // touch target — three cells in a column, two heights.
  const body = (
    <span
      className={`t text-value flex items-center break-token ${numeric && !pending ? 'num' : ''}`}
      style={{ color: pending ? 'var(--muted)' : 'var(--ink-900)' }}
    >
      {text}
    </span>
  );
  return (
    /* A ROW, not a card.
       Each of these used to be its own 200px surface holding a plate, a micro
       label and one line of text stacked vertically — three cards for three
       facts, about 600px of column to say a phone number, an email address and
       a county. The plate now sits BESIDE the text instead of above it, and the
       three rows share one surface divided by hairlines, which is the same
       object the credentials table and the fact table already use. */
    <li
      className="flex items-center gap-3"
      style={{ borderTop: '1px solid var(--rule)', padding: '18px 0' }}
    >
      <IconBadge bg="var(--green-900)" fg="var(--gold-500)">
        {icon}
      </IconBadge>
      <span className="min-w-0">
        <span className="t text-micro uppercase block" style={{ color: 'var(--micro)' }}>
          {label}
        </span>
        {href && !pending ? (
          <a
            href={href}
            className="lnk"
            /* 44, not 28. On a phone these two rows are the primary conversion
               path — a reader at a site gate taps the number rather than
               filling the form — so they get a full touch target rather than
               the 24px WCAG floor. */
            style={{ display: 'flex', alignItems: 'center', minHeight: 44 }}
          >
            {body}
          </a>
        ) : (
          body
        )}
      </span>
    </li>
  );
}

export function EnquiryForm() {
  const uid = useId();
  const [type, setType] = useState<EnquiryType>('Main contractor');
  const [f, setF] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    postcode: '',
    message: '',
    capability: false,
    company_website: '', // honeypot
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const set = (k: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  /** The Gate hands its still open rows over here, so a threshold IES does not
   *  meet becomes a conversation rather than a silent bounce. */
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const d = (e as CustomEvent<{ message: string; type: EnquiryType }>).detail;
      if (!d) return;
      setType(d.type);
      setF((p) => ({ ...p, message: d.message }));
      // Let the scroll settle before taking focus, or the browser fights it.
      window.setTimeout(() => document.getElementById(`${uid}-message`)?.focus(), 600);
    };
    window.addEventListener('ies:enquiry-prefill', onPrefill);
    return () => window.removeEventListener('ies:enquiry-prefill', onPrefill);
  }, [uid]);

  function validate(): Errors {
    const e: Errors = {};
    if (!f.name.trim()) e.name = enquiry.validation.name;
    if (!f.email.trim()) e.email = enquiry.validation.email;
    else if (!EMAIL.test(f.email.trim())) e.email = enquiry.validation.emailFormat;
    if (!f.phone.trim()) e.phone = enquiry.validation.phone;
    if (!f.postcode.trim()) e.postcode = enquiry.validation.postcode;
    if (!f.message.trim()) e.message = enquiry.validation.message;
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      document.getElementById(`${uid}-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    // Honeypot: a real person never sees this field, so any value means a bot.
    // Report success so the bot learns nothing, and send nothing.
    if (f.company_website.trim() !== '') {
      setStatus('sent');
      return;
    }

    setStatus('sending');

    if (STATIC) {
      const body = [
        `Enquiring as: ${type}`,
        `Name: ${f.name}`,
        f.company ? `Company: ${f.company}` : null,
        `Email: ${f.email}`,
        `Phone: ${f.phone}`,
        `Postcode or site address: ${f.postcode}`,
        '',
        f.message,
        '',
        f.capability ? 'Please send your capability statement.' : null,
      ]
        .filter((l) => l !== null)
        .join('\n');
      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
        `Enquiry from ${f.name}`,
      )}&body=${encodeURIComponent(body)}`;
      setStatus('sent');
      return;
    }

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, type }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="ground-cream" style={{ paddingBlock: 'var(--section-pad)' }} aria-labelledby="contact-title">
      <Container>
        <div className="ies-grid items-stretch">
          {/* Left column is a flex COLUMN so the contact block can take the
              slack with `margin-top: auto` and land its bottom edge on the form
              card's. Previously the two columns shared only a top grid line and
              finished 45px apart, which is the kind of near miss that reads as
              a mistake rather than as a rhythm. */}
          <div className="col-span-4 sm:col-span-8 md:col-span-5 flex flex-col md:h-full" data-col="5">
            <SectionHeader headline={enquiry.headline} id="contact-title" />

            {/* The form beside this column is 748px tall and the header plus
                contact rows come to about 500. Pushing the rows to the bottom
                with `margin-top: auto` aligned the two columns' bottom edges
                and left a 246px hole in the middle, which is the same problem
                the other way round.

                The photograph takes the slack instead: `flex: 1` with a minimum,
                so it grows or shrinks with whatever the form does and the two
                columns keep a shared top AND bottom edge at every width. It is
                the spare frame from the original service card set — see
                public/IMAGE-CREDITS.md. */}
            {/* `flex: 1 1 0` and an ABSOLUTE frame, not `1 1 auto` with a
                `h-full` frame. On basis `auto` the frame has no definite height
                to resolve 100% against, so the image fell back to its intrinsic
                600px and drove the column to 1292 — taller than the form it was
                supposed to match. Basis 0 plus `inset: 0` means the frame takes
                exactly the space the header and the contact rows leave. */}
            <div className="hidden md:block mt-6 relative" style={{ flex: '1 1 0', minHeight: 140 }}>
              {/* position/inset as INLINE STYLE, not the `absolute inset-0`
                  utilities. globals.css appends its component classes AFTER
                  `@tailwind utilities`, so `.photo { position: relative }` and
                  `.absolute` have equal specificity and the later rule wins —
                  the frame stayed relative, took its intrinsic 738px and
                  covered the three contact rows underneath it. Any utility that
                  collides with a component class in this codebase loses the
                  same way; inline style is the reliable override. */}
              <div
                className="photo"
                style={{ position: 'absolute', inset: 0, borderRadius: 'var(--r-xl)', ...lqipStyle('/panel-wiring.jpg') }}
              >
                <Img
                  src="/panel-wiring.jpg"
                  alt=""
                  sizes="(min-width: 1024px) 40vw, 84vw"
                  style={{ objectPosition: '50% 40%' }}
                />
              </div>
            </div>

            <ul
              className="mt-6 flex flex-col"
              style={{ borderBottom: '1px solid var(--rule)' }}
            >
              <InfoCell
                icon={<IconCall />}
                label="PHONE"
                value={company.phone}
                href={`tel:${company.phone.replace(/\s/g, '')}`}
                numeric
              />
              <InfoCell
                icon={<IconLetterbox />}
                label="EMAIL"
                value={company.email}
                href={`mailto:${company.email}`}
              />
              <InfoCell icon={<IconPlot />} label="AREAS COVERED" value={company.areasCovered} />
            </ul>
          </div>

          <div className="col-span-4 sm:col-span-8 md:col-span-7 max-md:mt-6" data-col="7">
            <div
              style={{
                background: 'var(--cream-100)',
                borderRadius: 'var(--r-lg)',
                padding: 'var(--pad-surface)',
              }}
            >
              {status === 'sent' ? (
                <div role="status">
                  <h3 className="t text-title" style={{ color: 'var(--heading)' }}>
                    {enquiry.successTitle}
                  </h3>
                  <p className="t text-body mt-2" style={{ color: 'var(--body)' }}>
                    {enquiry.successBody}{' '}
                    <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="lnk num">
                      {company.phone}
                    </a>
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <p id={`${uid}-type`} className="t text-ui" style={{ color: 'var(--ink-900)' }}>
                    {enquiry.typeLabel}
                  </p>
                  <div className="mt-1">
                    <Segmented value={type} onChange={setType} labelledBy={`${uid}-type`} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 mt-3" style={{ columnGap: 'var(--gutter)' }}>
                    <Field id={`${uid}-name`} label={enquiry.fields.name} value={f.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                    {type !== 'Homeowner' ? (
                      <Field id={`${uid}-company`} label={enquiry.fields.company} value={f.company} onChange={set('company')} autoComplete="organization" />
                    ) : null}
                    <Field id={`${uid}-email`} label={enquiry.fields.email} type="email" value={f.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                    <Field id={`${uid}-phone`} label={enquiry.fields.phone} type="tel" value={f.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
                    <Field
                      id={`${uid}-postcode`}
                      label={enquiry.fields.postcode}
                      value={f.postcode}
                      onChange={set('postcode')}
                      error={errors.postcode}
                      autoComplete="postal-code"
                      className="sm:col-span-2"
                    />
                    <Field
                      id={`${uid}-message`}
                      label={enquiry.messageLabels[type]}
                      value={f.message}
                      onChange={set('message')}
                      error={errors.message}
                      textarea
                      className="sm:col-span-2"
                    />
                  </div>

                  {/* Honeypot. Visually hidden rather than display:none so a bot
                      reading computed styles still fills it. */}
                  <div className="vh" aria-hidden="true">
                    <label htmlFor={`${uid}-company_website`}>Company website</label>
                    <input
                      id={`${uid}-company_website`}
                      name="company_website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={f.company_website}
                      onChange={(e) => setF((p) => ({ ...p, company_website: e.target.value }))}
                    />
                  </div>

                  <label className="flex items-start gap-2 mt-3" style={{ minHeight: 44 }}>
                    <input
                      type="checkbox"
                      checked={f.capability}
                      onChange={(e) => setF((p) => ({ ...p, capability: e.target.checked }))}
                      className="check-box"
                    />
                    <span className="text-body" style={{ color: 'var(--body)' }}>
                      {enquiry.capabilityCheckbox}
                    </span>
                  </label>

                  {status === 'error' ? (
                    <p role="alert" className="flex items-center gap-1 mt-3">
                      <BarSm />
                      <span className="text-legal" style={{ color: 'var(--state-error)', fontWeight: 'var(--w-ui)' as unknown as number }}>
                        {enquiry.errorMessage}
                      </span>
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    className="btn btn--green mt-3 max-sm:w-full"
                    style={{ minWidth: 'min(296px, 100%)' }}
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? enquiry.submitting : enquiry.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
