import { NextResponse } from 'next/server';

/**
 * Enquiry endpoint — STUB.
 *
 * TODO: wire this to Resend (https://resend.com) to deliver the enquiry to
 * {{EMAIL}}. Deliberately not implemented here: no API key is committed to this
 * repository, and no third party account is created on the client's behalf.
 * Until that is done this route validates, rejects bots, logs, and returns 200
 * so the front end flow is complete and testable.
 */
export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Malformed request.' }, { status: 400 });
  }

  // Honeypot. A real person never sees this field, so any value means a bot.
  // Return 200 rather than an error so the bot learns nothing.
  if (typeof payload.company_website === 'string' && payload.company_website.trim() !== '') {
    return NextResponse.json({ ok: true });
  }

  const required = ['name', 'email', 'phone', 'postcode', 'message'] as const;
  const missing = required.filter((k) => typeof payload[k] !== 'string' || !(payload[k] as string).trim());
  if (missing.length > 0) {
    return NextResponse.json({ ok: false, error: `Missing: ${missing.join(', ')}` }, { status: 422 });
  }

  // Server side mirror of the client validation.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email))) {
    return NextResponse.json({ ok: false, error: 'Invalid email.' }, { status: 422 });
  }

  const { company_website: _ignored, ...enquiry } = payload;
  console.log('[enquiry]', JSON.stringify(enquiry));

  return NextResponse.json({ ok: true });
}
