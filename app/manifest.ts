import type { MetadataRoute } from 'next';
import { company } from '@/lib/content';

// Required by `output: 'export'`, and already true of the default build.
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.siteName,
    short_name: 'IES',
    description: `Electrical installation, testing and renewables across ${company.areasCovered}.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#10251A',
    theme_color: '#10251A',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
