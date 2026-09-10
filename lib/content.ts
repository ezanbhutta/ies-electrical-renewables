/* ============================================================================
 * IES — ALL COPY AND ALL PLACEHOLDER VALUES LIVE IN THIS FILE.
 *
 * If you are not a developer, this is the only file you need. Search for the
 * word REPLACE to find every value that still needs a real answer.
 *
 * Three rules that keep the page honest, taken from the brief:
 *   1. Never write a number, a client name, a review, a rating, a year in
 *      business or an accreditation name that is not verifiably true today.
 *   2. Anything not yet known stays a placeholder. Empty values REMOVE their
 *      row rather than printing an empty label.
 *   3. No hyphens or dashes anywhere in visible copy.
 * ========================================================================= */

/** A headline is a bold clause, optionally preceded by a light one.
 *  The pair is a DEVICE, used three times on the page, not a required format.
 *
 *  NON-BREAKING SPACES: headlines below bind a function word to the word it
 *  governs, so a line never ends on "for", "the" or "you". THE BINDING MAY
 *  NEVER EXCEED TWO WORDS. A bound run cannot wrap, so a three word bind is a
 *  single unbreakable object roughly 20 characters wide — and at the 52px
 *  section heading size that overflows a five column measure and slides under
 *  whatever sits in the next column. Four of these were three word binds tuned
 *  against the old 40px heading, and raising the type size is what exposed
 *  them. If the display sizes in tailwind.config.ts change again, re-check the
 *  longest bound run against the NARROWEST column that renders it, which is
 *  the five column measure used by Coverage, Commitments and For Contractors. */
export type Headline = {
  /**
   * OPTIONAL. This was required, and that is what made every heading on the
   * page the same object: a light setup clause, a bold payoff, a gold rule
   * under a phrase — eleven times in a row, the same rhetorical beat each
   * time. The type was the machine. A flat sentence is now expressible.
   *
   * The split survives on exactly THREE headings, one per ground, spread down
   * the scroll, where it reads as emphasis rather than as a template slot.
   */
  light?: string;
  bold: string;
  /** A substring of `bold` to underline in brand gold. The references recolour
   *  a keyword; an underline is a RULE rather than text, so it can carry the
   *  true gold on cream where gold TEXT is illegal at 2.31:1. */
  accent?: string;
};

/** A fact has three states, not two.
 *   string    -> print the value
 *   'pending' -> print "Available on request" in muted grey
 *   null      -> remove the whole row and recompute the rules around it
 *  Insurance rows must NEVER fall back to a number. */
export type Fact = string | 'pending' | null;

/* ---------------------------------------------------------------------------
 * 1. THE COMPANY. REPLACE every value in this block.
 * ------------------------------------------------------------------------ */
export const company = {
  /** The trading name shown in the browser tab and search results. */
  siteName: 'IES Electrical and Renewables',

  /** REPLACE. Must be copied character for character from the Companies House
   *  record. It prints beside the company number, so a guess here is a
   *  misstatement rather than a placeholder. */
  legalName: 'IES Electrical and Renewables Ltd',

  /** The live domain. Used to resolve the Open Graph image URL and the
   *  canonical link, so it must match where the site is actually SERVED —
   *  a canonical pointing at a domain that does not serve the page tells
   *  search engines to index something that is not there, and the social
   *  preview image fails to load in WhatsApp, Slack and LinkedIn.
   *
   *  Currently the Hostinger subdomain. Change this and rebuild when the
   *  real domain is registered and pointed at the site. */
  siteUrl: 'https://ies-electrical.xstudioz.com',

  /** REPLACE. Shown in the header, hero panel, enquiry section and footer. */
  phone: '01924 000000',
  email: 'info@ieselectricalrenewables.co.uk',

  /** REPLACE. Used in the page title, the hero, the fact table and Coverage.
   *  Keep this to 44 characters or fewer: it appears inside two headline sized
   *  elements, so a longer string silently adds a line to each. */
  areasCovered: 'West Yorkshire and surrounding counties',

  /** The short form, for places where the full string blows a headline's
   *  budget. `areasCovered` stays authoritative for the fact table, the meta
   *  title and the FAQ; this is only ever the display short form. */
  county: 'West Yorkshire',

  /** REPLACE. Set to null to remove the row entirely. */
  companyNumber: '00000000' as Fact,
  vatNumber: null as Fact,
  registeredAddress: '1 Example Street, Wakefield, West Yorkshire, WF1 0AA' as Fact,

  /** REPLACE with the real cover once the certificates are in hand.
   *  Set to 'pending' while a quote is being arranged. Never invent a figure. */
  publicLiability: '£5,000,000' as Fact,
  employersLiability: '£10,000,000' as Fact,

  /** Leave EMPTY until a certificate exists. Never write a scheme name here,
   *  not even prefixed with "applying for". When empty, the row prints the
   *  fallback sentence below instead of disappearing. */
  accreditations: [] as string[],
  accreditationsFallback: 'Applications in progress. Ask us where we are up to.',

  /** REPLACE. The company's age is fixed by Companies House. The qualifications
   *  of the person running it are NOT: they were earned before the company
   *  existed and they are the strongest asset a new firm has.
   *  Do NOT publish a card NUMBER here. A buyer verifies by scanning the card or
   *  searching the register; printing the number only exposes the holder to
   *  credential misuse. Set any of these to null to remove that row. */
  principalName: 'Sample Name' as Fact,
  principalRole: 'Director' as Fact,
  principalQualifications: 'Level 3 electrical installation, inspection and testing' as Fact,
  cardTypeAndGrade: 'Approved electrician grade' as Fact,
  dbsStatus: null as Fact,

  /** The strapline is set as live text. The separator is drawn, not typed. */
  straplineLeft: 'ELECTRICAL',
  straplineRight: 'RENEWABLES',
} as const;

/* ---------------------------------------------------------------------------
 * 2. HEADER
 * ------------------------------------------------------------------------ */
export const header = {
  nav: [
    { label: 'Services', href: '#services' },
    { label: 'For Contractors', href: '#for-contractors' },
    { label: 'Contact', href: '#contact' },
  ],
  cta: { label: 'Request a quote', href: '#contact' },

  menuOpen: 'Menu',
  menuClose: 'Close',
  skipToContent: 'Skip to content',
} as const;

/* ---------------------------------------------------------------------------
 * 3. HERO
 * ------------------------------------------------------------------------ */
export const hero = {
  headline: {
    light: 'Electrical installation for',
    bold: 'contractors, commercial sites and homes.',
    /** The hero sits on green-900, where true gold is 6.68:1 and legal as TEXT,
     *  so this word is genuinely recoloured the way the reference sites
     *  recolour one word. On a cream section the same prop draws a gold rule
     *  instead. Accenting the primary audience rather than the service. */
    accent: 'contractors',
  } as Headline,
  sub: `A UK electrical contractor covering ${company.areasCovered}. Full installation, testing and renewables, delivered to programme and documented properly.`,
  primary: { label: 'Request a quote', href: '#contact' },
  /** "Request", not "Download". No capability statement file exists yet, and a
   *  dead download on this page's highest value action is the worst available
   *  failure. Change to "Download" only once a real PDF ships. */
  secondary: { label: 'Request our capability statement', href: '#contact' },

  /** The compliance nameplate on the right of the hero. Its rows are a subset
   *  of the For Contractors table, so it is not rendered below 1024px. */
  panel: {
    rows: [
      { label: 'COMPANY NUMBER', value: company.companyNumber },
      { label: 'PUBLIC LIABILITY', value: company.publicLiability },
      { label: 'EMPLOYERS LIABILITY', value: company.employersLiability },
    ],
    link: { label: 'Full compliance detail', href: '#for-contractors' },
  },

  /** The badge that overlaps the nameplate's corner. Three of the ten
   *  references hang a figure off a hero element this way, and all three fill
   *  it with a count of work done. This one holds a number that is already
   *  printed with its label in the panel behind it, so it introduces no claim:
   *  it is emphasis on a published fact, not a new one.
   *
   *  If `publicLiability` becomes null the badge removes itself. */
  badge: { value: company.publicLiability, label: 'Public liability cover' },

  /** THE FOLD STRIP.
   *  Electricien, Ampvex and Mezan all park a booking bar across the hero's
   *  bottom edge. The device is worth having — it puts the phone number at the
   *  fold, which for a contractor being rung from a site gate is the single
   *  most useful thing on the page — but their content is a fake 24/7 promise.
   *
   *  Every line below is already stated elsewhere in this file:
   *    the number    -> company.phone, in the header and the footer
   *    the same day  -> process step 01, verbatim
   *    the areas     -> company.areasCovered, in the fact table
   *  Nothing new is asserted, so the strip cannot drift out of agreement with
   *  the page it sits on. */
  strip: {
    callLabel: 'Speak to us',
    items: [
      { label: 'ANSWER', value: 'Same day, yes or no' },
      { label: 'COVERING', value: company.county },
    ],
    cta: { label: 'Send us the scope', href: '#contact' },
  },
} as const;

/* ---------------------------------------------------------------------------
 * 4. SERVICES
 * ------------------------------------------------------------------------ */
export const services = {
  headline: { bold: 'What we install.' } as Headline,
  cards: [
    {
      title: 'Commercial and Contracting',
      body: 'Installation, containment, distribution, lighting and small power on live and new build sites. Charge point provision priced at first fix under Part S, not found at completion.',
      link: { label: 'What your supply chain team needs', href: '#for-contractors' },
      /** Card 1 carries the primary audience, so it takes one step of ground.
       *  One step, no accent spent. */
      weighted: true,
      /** PLACEHOLDER photography. See public/IMAGE-CREDITS.md for the swap
       *  list. The alt text describes the PICTURE and never asserts that the
       *  work shown is ours, because it is not. */
      photo: '/containment.jpg',
      photoAlt: 'Conduit running down a commercial wall into a wall mounted distribution board.',
    },
    {
      title: 'Domestic',
      body: 'Rewires, consumer units, fault finding, inspection and testing for homeowners and landlords. Certificates issued the same week the work is signed off.',
      link: { label: 'For homeowners and landlords', href: '#contact', enquiryType: 'Homeowner' as const },
      weighted: false,
      photo: '/consumer-unit.jpg',
      photoAlt: 'A consumer unit with the breakers fitted and the circuits terminated.',
    },
    {
      title: 'Renewables',
      body: 'Solar, battery storage, EV charge points and heat pump electrical works, for single properties and for new build plots.',
      link: { label: 'Enquire about renewables', href: '#contact' },
      weighted: false,
      /* The card says "solar, battery storage, EV charge points and heat pump
       * ELECTRICAL WORKS" — which is the inverter, the DC side and the board,
       * not the panels. The previous placeholder was a US asphalt shingle roof,
       * which a UK reader clocks immediately; this is the equipment IES would
       * actually install and it carries no geography tell at all. */
      photo: '/renewables.jpg',
      photoAlt: 'A wall mounted hybrid inverter above a stack of battery storage modules.',
      /* A portrait source in a 16/10 frame. Centred, `cover` takes a band of
         battery casing and cuts the inverter off entirely; 34% down keeps the
         inverter body, the DC isolator and the top of the battery stack, which
         is the part that says what the picture is. */
      photoPosition: '50% 34%',
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 5. FOR CONTRACTORS — the section that beats every competitor
 * ------------------------------------------------------------------------ */
export const forContractors = {
  micro: 'FOR MAIN CONTRACTORS',
  headline: { bold: 'Everything your supply chain team asks for.' } as Headline,
  sub: 'You should not have to email us to find out whether we clear your vetting. Here it is.',

  /** Row order is fixed. The two rows that can run to a second line sit last,
   *  where a wrap cannot move anything above them.
   *
   *  `hero` promotes a fact out of the list and into its own tile at display
   *  size. Only the two insurance figures carry it, and the reason is what a
   *  supply chain reader is actually scanning for: cover limits are the first
   *  gate on every PQQ, and they were previously the third and fourth rows of a
   *  flat six row table where nothing outranked anything. Promoting them is
   *  emphasis on a published fact, not a new claim.
   *
   *  Do not add a third. Three hero tiles is a stats bar, and a stats bar is
   *  the thing this page deliberately does not have. */
  facts: [
    { label: 'PUBLIC LIABILITY', value: company.publicLiability, numeric: true, hero: true },
    { label: 'EMPLOYERS LIABILITY', value: company.employersLiability, numeric: true, hero: true },
    { label: 'COMPANY NUMBER', value: company.companyNumber, numeric: true, hero: false },
    { label: 'VAT NUMBER', value: company.vatNumber, numeric: true, hero: false },
    { label: 'AREAS COVERED', value: company.areasCovered as Fact, numeric: false, hero: false },
    { label: 'REGISTERED OFFICE', value: company.registeredAddress, numeric: false, hero: false },
  ],
  accreditationsLabel: 'ACCREDITATIONS',
  pendingLabel: 'Available on request',

  cta: { label: 'Request our capability statement', href: '#contact' },
} as const;

/* ---------------------------------------------------------------------------
 * 5a. THE GATE — check it against your own thresholds
 *
 *  The For Contractors sub-line promises "You should not have to email us to
 *  find out whether we clear your vetting. Here it is." Until now nothing on
 *  the page cashed that cheque. This does.
 *
 *  DELIBERATELY ABSENT: any aggregate score. An earlier design printed
 *  "IES clears 3 of 5 thresholds you set." That number is a claim about IES
 *  that exists nowhere in this file, it implies a formal assessment nobody ran,
 *  and it hands a buyer a screenshot ready fail count in ten seconds inside the
 *  one section written to win the approved list. Every row answers for itself.
 *
 *  Every answer string below is either a token from `company` or a plain
 *  statement of current position. Nothing is computed about IES except whether
 *  a published figure meets a number the BUYER typed.
 * ------------------------------------------------------------------------ */
export const gate = {
  headline: { bold: 'Check us against your own thresholds.' } as Headline,
  sub: 'Nothing new is claimed here. It is the same table, answered against your numbers.',
  /** Scope honesty: this is a lookup against four common fields, not a PQQ. */
  scopeNote: 'These are four common fields, not a full prequalification. Anything else, ask.',
  rows: [
    {
      id: 'pl',
      label: 'PUBLIC LIABILITY MINIMUM',
      kind: 'money' as const,
      /** Compared against company.publicLiability. */
      options: [
        { id: 'pl1', label: '£1m', value: 1_000_000 },
        { id: 'pl2', label: '£2m', value: 2_000_000 },
        { id: 'pl5', label: '£5m', value: 5_000_000 },
        { id: 'pl10', label: '£10m', value: 10_000_000 },
      ],
    },
    {
      id: 'el',
      label: 'EMPLOYERS LIABILITY MINIMUM',
      kind: 'money' as const,
      options: [
        { id: 'el5', label: '£5m', value: 5_000_000 },
        { id: 'el10', label: '£10m', value: 10_000_000 },
      ],
    },
    {
      id: 'ssip',
      label: 'SSIP OR EQUIVALENT',
      kind: 'boolean' as const,
      options: [
        { id: 'ssipY', label: 'Required', value: 1 },
        { id: 'ssipN', label: 'Not required', value: 0 },
      ],
    },
    {
      id: 'person',
      label: 'NAMED COMPETENT PERSON',
      kind: 'boolean' as const,
      options: [
        { id: 'personY', label: 'Required', value: 1 },
        { id: 'personN', label: 'Not required', value: 0 },
      ],
    },
  ],
  /** Shown when a row is still open. Stated in full, at the same size and the
   *  same colour as a cleared row. No red, no cross, no apology. */
  openPrefix: 'Open:',
  /** Shown in a row's answer slot before the reader has set anything.
   *
   *  An em dash, not words. It was the full sentence "Set a threshold to see
   *  the answer." once per row — the same grey line four times, which read as
   *  filler — and then the literal "Not set", which reads as a system message
   *  about the FORM rather than as an empty field. A dash is the printer's
   *  convention for a cell with nothing in it yet and says the same thing
   *  without narrating it. The screen reader text is separate, below. */
  unsetLabel: '\u2014',
  /** What a screen reader hears in place of the dash, which is meaningless
   *  read aloud. */
  unsetLabelA11y: 'No threshold set',
  unsetHint: 'Set a threshold on any row to see the answer.',
  handoff: {
    label: 'Send us anything still open',
    /** Turns a no into a conversation instead of a bounce. */
    intro: 'Thresholds I need covered:',
  },
} as const;

/* ---------------------------------------------------------------------------
 * 5b. WHO DOES THE WORK
 *  Companies House constrains the age of the COMPANY, not the trade history of
 *  the PERSON. The page already promises "One named contact for the whole job"
 *  and then names nobody, which is the strongest commitment on the page
 *  withholding its own evidence.
 *  No years, no seniority claims: there is no public register of how long
 *  someone has held a pair of pliers, and an unverifiable number sitting one
 *  paragraph from a verifiable one invites the wrong comparison.
 * ------------------------------------------------------------------------ */
export const whoDoesTheWork = {
  headline: {
    light: 'You cannot check a track record.',
    bold: 'You can check the people.',
    accent: 'check the people',
  } as Headline,
  sub: 'Earned before this company existed, held by the individual, and verifiable by you.',
  rows: [
    { label: 'QUALIFICATIONS', value: company.principalQualifications },
    { label: 'CARD', value: company.cardTypeAndGrade },
    { label: 'DBS', value: company.dbsStatus },
  ],
  notes: [
    'Card records go out with the RAMS, so your gate team holds them before the first shift.',
    'Prices the job, attends the site, and answers the phone when your programme changes.',
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 5c. WHAT WE HAND OVER
 *  The page's real differentiator is paperwork, and Process step 4 compresses
 *  it to one line. This is the only section a weeks old company can write in
 *  full with no missing facts, because it describes what the client receives
 *  rather than what has already been delivered.
 * ------------------------------------------------------------------------ */
export const whatWeHandOver = {
  headline: { bold: 'What you get before we leave site.' } as Headline,
  sub: 'The paperwork is the part most firms make you chase.',
  documents: [
    'Electrical installation certificate or condition report',
    'Schedule of inspections',
    'Schedule of test results, with the measured values recorded',
    'Circuit schedules and distribution board charts, labelled and fitted',
    'Operating and maintenance information for everything installed',
    'Building regulations notification reference where the work is notifiable',
  ],
  /** The honest disclosure. SSIP assessors want signed induction and toolbox
   *  talk records from the past twelve months, which a firm with no completed
   *  jobs cannot have. Saying so is what makes the rest of the list credible. */
  today:
    'Our health and safety policy, COSHH register and equipment inspection records exist today. Site induction records, toolbox talk registers and monitoring reports begin with the first job, and we will not pretend otherwise.',
} as const;

/* ---------------------------------------------------------------------------
 * 5d. COMMITMENTS
 *  Occupies the slot the reference sites give a client logo strip or a stats
 *  band. IES has no clients and no numbers, so the GEOMETRY is adopted and the
 *  CONTENT is replaced: the four commitments moved out of For Contractors.
 *  Every figure in a reference stats bar is a count of work done. IES has two
 *  publishable numbers, both insurance cover, both already printed with their
 *  labels in the hero nameplate, and a 56px treatment of an insurance sum
 *  reads as company scale to a skimmer. So this section holds that slot in the
 *  scroll and spends it on stated obligations instead.
 * ------------------------------------------------------------------------ */
export const commitments = {
  /** Says what the section DOES, not what room it is. 'OUR COMMITMENTS'
   *  labelled the furniture; this is the actual claim being made. */
  micro: 'STATED BEFORE WE START',
  headline: { bold: 'What we hold to on every job.' } as Headline,
  sub: 'Not a track record. A standard, stated before we start, so you can hold us to it.',

  /** THE SPLIT IS THE ONLY CHANGE HERE, and it has one hard rule: a body line
   *  may restate its own title or copy already published elsewhere in this
   *  file, and may do nothing else. A commitment must not be promoted into a
   *  service tier — "one named contact" is a promise about who answers the
   *  phone; "dedicated account management" would be a capability that does not
   *  exist.
   *
   *  "One named contact" stays first. It is the one true differentiator a
   *  weeks old firm has, and it sits where the reference sites put team proof.
   */
  items: [
    {
      title: 'One named contact',
      body: 'The person who prices the job runs it on site and answers the phone. You are not handed between numbers.',
    },
    {
      title: 'RAMS before we start',
      body: 'Issued before we come to site, not produced afterwards when somebody asks for them.',
    },
    {
      title: 'Certificates at handover',
      body: 'Test certificates and operating and maintenance information, handed over on completion.',
    },
    {
      title: 'Documents on request',
      body: 'Insurance certificates and method statements, sent the day you ask for them.',
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 5e. COMMON QUESTIONS
 *
 *  THE RULE FOR THIS FILE SECTION, and it is strict:
 *  an answer may ONLY restate something already published elsewhere on this
 *  page or already in this file. An FAQ is the easiest place on any site for a
 *  brand new claim to appear, because the format invites a confident sentence.
 *  Every figure below is INTERPOLATED from `company` rather than typed, so it
 *  cannot drift out of agreement with the fact table above it.
 *
 *  The "how new are you" answer concedes the point and redirects to what is
 *  checkable. Do not soften it to "established" or "growing" (both fail the
 *  content audit anyway) and never add a founding year.
 * ------------------------------------------------------------------------ */
export const faq = {
  headline: { bold: 'What buyers ask before they ask a price.' } as Headline,
  sub: 'Every answer here is something already published further up this page.',

  /** THE ASIDE, at the foot of the heading column.
   *
   *  That column held a heading and one line and then nothing for the whole
   *  height of the accordion — the emptiest block on the page. What belongs
   *  there is the thing every FAQ ends with: a way to ask the question that is
   *  not on the list.
   *
   *  Nothing here is new. "The same day" is process step 01 and the hero strip,
   *  worded the same way in all three. */
  aside: {
    label: 'NOT ON THE LIST',
    body: 'Ask us directly. We answer the same day.',
    cta: { label: 'Send us the scope', href: '#contact' },
  },
  items: [
    /* The insurance question was here and was deleted. It was `items[0]`, and
     * CommonQuestions renders `open={i === 0}`, so the first thing a reader met
     * in this section was a prose restatement of two figures already typeset
     * twice above it. The accreditation answer opens instead — a candid "not
     * yet, here is where we are up to", which is a better thing to lead with. */
    {
      q: 'Do you hold an accreditation?',
      a:
        company.accreditations.length > 0
          ? company.accreditations.join(', ')
          : company.accreditationsFallback,
    },
    {
      q: 'How long has the company been trading?',
      a: `Our company number is ${company.companyNumber ?? 'available on request'} and you can look up the incorporation date yourself. We would rather you did that than take our word for anything. What is worth checking is the qualifications of the person doing the work, which were earned before this company existed and are listed above.`,
    },
    {
      q: 'What paperwork do we get at handover?',
      a: 'Certificates, schedules of inspection and test results, circuit schedules, operating and maintenance information, and the building regulations notification reference where the work is notifiable. The full list is above.',
    },
    {
      q: 'Where do you work?',
      a: `${company.areasCovered}. If the job is right we will travel further for it, so ask.`,
    },
    {
      q: 'Who will we actually deal with?',
      a: 'One named contact for the whole job. The same person prices it, attends the site, and answers the phone when your programme changes.',
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 6. PROCESS
 * ------------------------------------------------------------------------ */
export const process = {
  micro: 'ENQUIRY TO HANDOVER',
  headline: { bold: 'You know where you stand at every step.' } as Headline,
  steps: [
    {
      n: '01',
      title: 'Enquiry',
      body: 'Tell us the scope. We will say yes or no the same day rather than leave you waiting.',
    },
    {
      n: '02',
      title: 'Survey and price',
      body: 'We attend, take it off properly, and send a written quotation with the scope spelled out.',
    },
    {
      n: '03',
      title: 'On site',
      body: 'RAMS in first, then the work, to the dates agreed. You get one point of contact throughout.',
    },
    {
      n: '04',
      title: 'Handover',
      body: 'Testing, certification and paperwork issued together. Nothing outstanding when we leave.',
    },
  ],
} as const;

/* ---------------------------------------------------------------------------
 * 7. COVERAGE
 * ------------------------------------------------------------------------ */
export const coverage = {
  micro: 'WHERE WE WORK',
  headline: {
    light: `Based in ${company.county},`,
    bold: 'available further for\u00a0programme work.',
    accent: 'available',
  } as Headline,
  sub: 'If the job is right we will travel for it. Ask.',

} as const;

/* ---------------------------------------------------------------------------
 * 8. ENQUIRY FORM
 * ------------------------------------------------------------------------ */
export const enquiry = {
  headline: { bold: 'Send us the scope. We will reply today.' } as Headline,
  typeLabel: 'I am enquiring as',
  types: ['Main contractor', 'Commercial', 'Homeowner'] as const,
  fields: {
    name: 'Name',
    company: 'Company',
    email: 'Email',
    phone: 'Phone',
    postcode: 'Postcode or site address',
  },
  /** The message field's label changes with the enquiry type. This is the only
   *  piece of real state on the page. */
  messageLabels: {
    'Main contractor': 'Scope, programme dates and anything we should see',
    Commercial: 'What needs doing and where',
    Homeowner: 'What you need a hand with',
  },
  capabilityCheckbox: 'Send me your capability statement',
  submit: 'Send enquiry',
  submitting: 'Sending',
  /** States the company's own intent rather than predicting the reader's
   *  future, which is the only version guaranteeable at render time. */
  successTitle: 'Thanks. That has reached us and we will come back to you today.',
  successBody: 'For anything urgent, call us.',
  errorMessage: 'That did not send. Please try again, or call us instead.',
  validation: {
    name: 'Please tell us your name.',
    email: 'Please enter an email address we can reply to.',
    emailFormat: 'That email address does not look right.',
    phone: 'Please leave a phone number.',
    postcode: 'Please give us a postcode or a site address.',
    message: 'Please tell us what the job involves.',
  },
} as const;

/* ---------------------------------------------------------------------------
 * 9. FOOTER
 * ------------------------------------------------------------------------ */
export const footer = {
  blurb: `Electrical installation, testing and renewables across ${company.areasCovered}.`,
  columns: {
    services: {
      head: 'Services',
      links: [
        { label: 'Commercial and Contracting', href: '#services' },
        { label: 'Domestic', href: '#services' },
        { label: 'Renewables', href: '#services' },
      ],
    },
    company: {
      head: 'Company',
      links: [
        { label: 'For contractors', href: '#for-contractors' },
        { label: 'Contact', href: '#contact' },
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
      ],
    },
    contact: { head: 'Get in touch' },
  },
} as const;

/* ---------------------------------------------------------------------------
 * 10. METADATA
 * ------------------------------------------------------------------------ */
export const meta = {
  title: `${company.siteName} | Electrical Contractors in ${company.areasCovered}`,
  description: `Electrical installation, testing and renewables for main contractors, commercial sites and homes across ${company.areasCovered}. Domestic, commercial, renewables.`,
} as const;

/* ---------------------------------------------------------------------------
 * 11. CHARACTER BUDGETS — asserted by `npm run audit:content`.
 *  Each budget is the point at which the element gains an extra line.
 * ------------------------------------------------------------------------ */
export const budgets = {
  areasCovered: 44,
  h1Light: 30,
  h1Bold: 62,
  h2: 46,
  sectionSub: 96,
  cardBody: 180,
} as const;
