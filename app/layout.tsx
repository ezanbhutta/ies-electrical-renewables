import type { Metadata } from 'next';
import { manrope } from './fonts';
import './globals.css';
import { meta, company } from '@/lib/content';

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  alternates: { canonical: '/' },
  title: meta.title,
  description: meta.description,
  openGraph: { title: meta.title, description: meta.description, type: 'website', locale: 'en_GB' },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: '#10251A' };

/**
 * Organization only — NOT LocalBusiness. LocalBusiness asserts a customer
 * facing premises that a company trading from a registered office may not
 * truthfully have.
 *
 * PERMANENTLY FORBIDDEN in this object, because every one of them would be a
 * fabricated claim for a company this age:
 *   aggregateRating · review · foundingDate · numberOfEmployees · award · slogan
 *
 * Any property whose token is empty is OMITTED, never emitted as an empty
 * string.
 */
function jsonLd() {
  const org: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.siteName,
    legalName: company.legalName,
    areaServed: company.areasCovered,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: company.phone,
      email: company.email,
      contactType: 'sales',
      areaServed: 'GB',
    },
  };
  if (company.registeredAddress && company.registeredAddress !== 'pending') {
    org.address = { '@type': 'PostalAddress', streetAddress: company.registeredAddress, addressCountry: 'GB' };
  }
  if (company.vatNumber && company.vatNumber !== 'pending') org.vatID = company.vatNumber;
  if (company.companyNumber && company.companyNumber !== 'pending') {
    org.identifier = { '@type': 'PropertyValue', name: 'Companies House number', value: company.companyNumber };
  }
  return org;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={manrope.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
        />
        {children}
      </body>
    </html>
  );
}
