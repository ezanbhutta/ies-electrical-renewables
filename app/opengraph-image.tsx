import { ImageResponse } from 'next/og';
import { company } from '@/lib/content';

// Required by `output: 'export'`, and already true of the default build.
export const dynamic = 'force-static';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${company.siteName}`;

/** Green ground, white wordmark, gold accent, gold hairline. No photography. */
export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#10251A',
          padding: 96,
        }}
      >
        <div style={{ display: 'flex', width: 48, height: 14, background: '#CBA135', borderRadius: 2 }} />
        <div
          style={{
            display: 'flex',
            fontSize: 128,
            fontWeight: 800,
            color: '#FBFAF6',
            letterSpacing: '-0.01em',
            marginTop: 32,
          }}
        >
          IES
        </div>
        <div style={{ display: 'flex', width: 320, height: 1, background: '#CBA135', marginTop: 32 }} />
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: '#CBA135',
            letterSpacing: '0.12em',
            marginTop: 16,
          }}
        >
          ELECTRICAL | RENEWABLES
        </div>
      </div>
    ),
    size,
  );
}
