/**
 * Two build targets from one source.
 *
 *  - Default (`npm run build`)  : full Next.js app. The /api/enquiry route
 *    exists, so the form POSTs to the server. This is what deploys to Vercel.
 *
 *  - `npm run build:static`     : a self contained folder in `out/`, openable
 *    from disk or uploadable to any static host. A static export cannot run a
 *    route handler, so the enquiry form falls back to a prefilled mailto rather
 *    than posting into a void.
 */
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const isStatic = process.env.STATIC_EXPORT === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // There is an unrelated package-lock.json in the home directory, so Next
  // otherwise infers that as the workspace root and traces the wrong tree.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  ...(isStatic
    ? { output: 'export', images: { unoptimized: true }, trailingSlash: true }
    : {}),
};

export default nextConfig;
