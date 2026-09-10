/**
 * Build time content audit. Fails the build rather than trusting review.
 *
 * The page's whole pitch is that it publishes what its competitors hide, and it
 * publishes a company number, which lets anyone confirm the company's age in
 * under a minute. So a single overclaim is worse here than on an ordinary site.
 * These checks are the guard rail.
 *
 *   npm run audit:content
 */
import {
  company,
  hero,
  commitments,
  whoDoesTheWork,
  whatWeHandOver,
  services,
  forContractors,
  process as processContent,
  coverage,
  enquiry,
  footer,
  meta,
  budgets,
} from '../lib/content';

const failures: string[] = [];
const fail = (msg: string) => failures.push(msg);

/* -------------------------------------------------------------------------
 * 1. Banned lexicon. Every one of these asserts a track record, a scale or a
 *    reputation that a weeks old company cannot evidence.
 * ---------------------------------------------------------------------- */
const BANNED = [
  'trusted', 'leading', 'award winning', 'award-winning', 'established', 'proven',
  'renowned', 'preferred', 'market leader', 'industry leading', 'industry-leading',
  'years of', 'years experience', 'years of experience', 'since 19', 'since 20',
  'founded', 'experienced team', 'our clients', 'our projects', 'our team of',
  'thousands', 'hundreds', 'satisfied', 'guaranteed', 'best in', 'number one',
  'no.1', 'no. 1', 'five star', '5 star', 'reviews', 'rated',
];

/* -------------------------------------------------------------------------
 * 2. Named standards and schemes. The brief forbids naming any accreditation
 *    that is not confirmed, and none are. Certificates are described by what
 *    the client receives, never by the standard they are issued under.
 * ---------------------------------------------------------------------- */
const SCHEMES = [
  'niceic', 'napit', 'elecsa', 'stroma', 'chas', 'constructionline', 'safecontractor',
  'smas', 'acclaim', 'iso 9001', 'iso9001', 'iso 14001', 'iso 45001', 'ohsas',
  'bs 7671', 'bs7671', '18th edition', '17th edition', 'part p', 'mcs', 'trustmark',
  'niceic approved', 'ecа', 'jib', 'cscs',
];

/** Walk every string in the content tree, remembering where it came from. */
function strings(value: unknown, path: string, out: Array<[string, string]> = []) {
  if (typeof value === 'string') out.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => strings(v, `${path}[${i}]`, out));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) strings(v, path ? `${path}.${k}` : k, out);
  }
  return out;
}

const all = strings(
  { company, hero, services, forContractors, whoDoesTheWork, whatWeHandOver,
    process: processContent, coverage, enquiry, footer, meta },
  '',
);

/** Whole word match. Substring matching is wrong here: "chase" contains "chas",
 *  "generated" contains "rated". Escapes regex metacharacters so entries like
 *  "no.1" match literally. */
const wordRe = (needle: string) =>
  new RegExp(`(^|[^a-z0-9])${needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i');

for (const [path, text] of all) {
  for (const word of BANNED) {
    if (wordRe(word).test(text)) fail(`BANNED CLAIM  ${path}: contains "${word}"\n    ${text}`);
  }
  for (const scheme of SCHEMES) {
    if (wordRe(scheme).test(text)) fail(`NAMED SCHEME  ${path}: contains "${scheme}"\n    ${text}`);
  }

  // 3. No hyphens or dashes in visible copy. URLs, emails and keys are exempt.
  //     `photo` joined that list when the redesign added image paths to the
  //     content file: an asset path is not copy, and a reader never sees it.
  //     `photoAlt` is deliberately NOT exempt — alt text IS visible copy to
  //     anyone using a screen reader, and it is held to the same rules as the
  //     sentence beside it.
  const isTechnical =
    path.includes('href') ||
    path.includes('email') ||
    path.includes('siteUrl') ||
    /\.photo$/.test(path) ||
    path.startsWith('company.strapline');
  if (!isTechnical && /[-–—]/.test(text)) {
    fail(`DASH  ${path}: visible copy must contain no hyphens or dashes\n    ${text}`);
  }
}

/* -------------------------------------------------------------------------
 * 4. Character budgets. Each is the point at which an element gains a line.
 * ---------------------------------------------------------------------- */
const budgetChecks: Array<[string, string, number]> = [
  ['company.areasCovered', company.areasCovered, budgets.areasCovered],
  // `light` is optional on Headline now (a heading may be one flat clause), so
  // this budget only applies where the hero actually has one.
  ['hero.headline.light', hero.headline.light ?? '', budgets.h1Light],
  ['hero.headline.bold', hero.headline.bold, budgets.h1Bold],
  ['services.headline.bold', services.headline.bold, budgets.h2],
  ['forContractors.headline.bold', forContractors.headline.bold, budgets.h2],
  ['process.headline.bold', processContent.headline.bold, budgets.h2],
  ['coverage.headline.bold', coverage.headline.bold, budgets.h2],
  ['enquiry.headline.bold', enquiry.headline.bold, budgets.h2],
  ['forContractors.sub', forContractors.sub, budgets.sectionSub],
  ['whoDoesTheWork.headline.bold', whoDoesTheWork.headline.bold, budgets.h2],
  ['whoDoesTheWork.sub', whoDoesTheWork.sub, budgets.sectionSub],
  ['whatWeHandOver.headline.bold', whatWeHandOver.headline.bold, budgets.h2],
  ['whatWeHandOver.sub', whatWeHandOver.sub, budgets.sectionSub],
  ...services.cards.map((c) => [`services.card "${c.title}"`, c.body, budgets.cardBody] as [string, string, number]),
];

for (const [name, text, max] of budgetChecks) {
  if (text.length > max) fail(`BUDGET  ${name}: ${text.length} chars, budget ${max}`);
}

/* -------------------------------------------------------------------------
 * 4b. UNREPLACED SAMPLE VALUES.
 *
 * These are NOT in {{TOKEN}} format, so the token sweep cannot see them. They
 * ship on purpose, so the page the client reviews looks finished rather than
 * gap toothed. But a supply chain manager landing on a real domain and reading
 * COMPANY NUMBER 00000000 inside the compliance nameplate loses more trust than
 * every missing accreditation combined.
 *
 * Loud warning on a review build, hard failure before go live:
 *     npm run audit:content -- --live
 * ---------------------------------------------------------------------- */
const SAMPLES: Array<[string, string]> = [
  ['companyNumber', '00000000'],
  ['phone', '01924 000000'],
  ['registeredAddress', '1 Example Street'],
  ['principalName', 'Sample Name'],
  ['principalRole', 'Director'],
  ['principalQualifications', 'Level 3 electrical installation'],
  ['cardTypeAndGrade', 'Approved electrician grade'],
];
const live = process.argv.includes('--live');
const stillSample = SAMPLES
  .filter(([, needle]) => all.some(([, text]) => text.includes(needle)))
  .map(([field, needle]) => `${field} still reads like a sample ("${needle}")`);

if (stillSample.length > 0) {
  if (live) {
    stillSample.forEach((m) => fail(`UNREPLACED  ${m}`));
  } else {
    console.warn(`\n  ${stillSample.length} placeholder value(s) still in lib/content.ts:`);
    stillSample.forEach((m) => console.warn(`    ! ${m}`));
    console.warn('  Fine for a review build. Run `npm run audit:content -- --live` before go live.\n');
  }
}

/* -------------------------------------------------------------------------
 * 5. Structural truths.
 * ---------------------------------------------------------------------- */
if (company.accreditations.length > 0) {
  fail(
    'ACCREDITATIONS is non empty. Every entry must correspond to a certificate that\n' +
      '    exists today. Delete this check only when that is verified.',
  );
}
if (/download/i.test(hero.secondary.label) || /download/i.test(forContractors.cta.label)) {
  fail('CTA says "Download" but no capability statement file ships. Use "Request".');
}

/* -------------------------------------------------------------------------
 * 6. Inert accents.
 *
 * A headline's `accent` names a substring of its `bold` clause and gets the
 * gold rule. Headlines bind function word pairs with non-breaking spaces, so an
 * accent typed with ordinary spaces used to miss silently: no error, no layout
 * change, and the underline simply never drew. SplitHeadline now normalises
 * before matching; this check is what stops an accent that matches NOTHING —
 * a typo, or a rewritten headline — from shipping unnoticed.
 * ---------------------------------------------------------------------- */
const flat = (v: string) => v.replace(/\u00a0/g, ' ');
const headlines: Array<[string, { bold: string; accent?: string }]> = [
  ['hero', hero.headline],
  ['services', services.headline],
  ['forContractors', forContractors.headline],
  ['whoDoesTheWork', whoDoesTheWork.headline],
  ['commitments', commitments.headline],
  ['whatWeHandOver', whatWeHandOver.headline],
  ['process', processContent.headline],
  ['coverage', coverage.headline],
  ['enquiry', enquiry.headline],
];
for (const [name, h] of headlines) {
  if (h.accent && !flat(h.bold).includes(flat(h.accent))) {
    fail(`INERT ACCENT  ${name}.headline: accent "${h.accent}" is not inside bold "${h.bold}"`);
  }
}

/* ---------------------------------------------------------------------- */
if (failures.length > 0) {
  console.error(`\nContent audit FAILED with ${failures.length} issue(s):\n`);
  failures.forEach((f) => console.error(`  ✗ ${f}\n`));
  process.exit(1);
}
console.log(`Content audit passed. ${all.length} strings checked.`);
