import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { ForContractors } from '@/components/ForContractors';
import { WhoDoesTheWork } from '@/components/WhoDoesTheWork';
import { Commitments } from '@/components/Commitments';
import { WhatWeHandOver } from '@/components/WhatWeHandOver';
import { CommonQuestions } from '@/components/CommonQuestions';
import { Process } from '@/components/Process';
import { Coverage } from '@/components/Coverage';
import { EnquiryForm } from '@/components/EnquiryForm';
import { Footer } from '@/components/Footer';
import { Motion } from '@/components/Motion';
import { header } from '@/lib/content';

/**
 * Ground sequence:
 *   Header g900 · Hero g900 · Services cream · For Contractors g900 ·
 *   Who Does The Work cream · Commitments g900 · What We Hand Over cream ·
 *   Process g900 · Common Questions cream · Coverage g700 · Enquiry cream ·
 *   Footer g900
 *
 * Ten body sections running D C D C D C D C D C D. The two newest went in as a
 * PAIR for the same arithmetic reason as the pair before them: adding one to an
 * even count forces a cream against cream seam, and only adding two restores
 * the alternation.
 *
 * Two grounds flipped when Process became a centred 4-up card row. Process took
 * the dark slot so its numerals gain --gold-500 through the ground scope, and
 * What We Hand Over took cream, where its photograph can be framed at full
 * tonal range instead of darkened until text survives on top of it.
 *
 * COMPOSITION alternates too, which is the other half of the client's note:
 *   Hero split · Services CENTRED · For Contractors split · Who split ·
 *   Handover split 6/6 · Process CENTRED · Coverage CENTRED band · Enquiry split
 * The rule is mechanical: CENTRED when the content below is a symmetric row of
 * equal cards, LEFT when it is a table, a list or a form. Never both in one
 * section.
 *
 * No two dark BODY sections are adjacent. The header is a rail, not a body
 * section, and reading as one field with the hero is the intent.
 *
 * The two new sections were added as a PAIR, and that is arithmetic rather than
 * taste: five body sections already alternated perfectly between a dark hero and
 * a dark footer, so adding one forces a cream against cream seam and only adding
 * two restores the alternation at seven.
 */
export default function Page() {
  return (
    <>
      <a href="#main" className="skip">
        {header.skipToContent}
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <ForContractors />
        <WhoDoesTheWork />
        <Commitments />
        <WhatWeHandOver />
        <Process />
        <CommonQuestions />
        <Coverage />
        <EnquiryForm />
      </main>
      <Footer />
      <Motion />
    </>
  );
}
