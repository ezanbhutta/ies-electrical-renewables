Verified. Now I have what I need — including three things that change the ranking.

## Before anything ships: two blockers

**1. The live page publishes placeholder data.** I fetched `https://ies-electrical-renewables.vercel.app` just now. It serves `COMPANY NUMBER 00000000`, `REGISTERED OFFICE 1 Example Street, Wakefield, West Yorkshire, WF1 0AA`, `01924 000000`. These are not `{{TOKEN}}` format, so a token sweep will not catch them. Every recommendation below is inert until `lib/content.ts` §1 is filled. A supply chain manager who lands today sees dummy data inside the compliance nameplate, which costs more trust than every missing accreditation combined.

**2. `scripts/audit-content.ts` will fail the build on the top recommendation.** Its `SCHEMES` array bans `chas`, `constructionline`, `safecontractor`, `smas`, `niceic`, `cscs`, `jib`, `bs 7671`, `18th edition` in any content string. That rule exists to stop IES *claiming* an unheld accreditation. Naming a scheme with an honest submitted status is a different act, and the script cannot tell them apart. It needs an explicit carve out before rec #1 can ship.

**3. The repo is ahead of the deployment.** `public/hero.jpg` is wired into `components/Hero.tsx:57` as the LCP element and is present in `out/index.html`, but the deployed page returns zero images. The client asking for "photography, having previously had none" is describing the *live* site. The photography decision has already been made in code and not yet shipped.

---

## The structural constraint that caps the ADD budget

The live ground sequence (`app/page.tsx:14`) is Hero **D**, Services **C**, ForContractors **D**, Process **C**, Coverage **D**, Enquiry **C**, Footer **D**. That is five body sections in perfect alternation between a dark hero and a dark footer.

**Odd counts alternate cleanly; even counts cannot.** Adding one section forces a cream/cream seam somewhere. Adding two restores perfect alternation at seven. This is why the FAQ placements proposed in two lenses were unbuildable, and it is the arithmetic that sets the budget: **add exactly two sections, or zero.** I recommend two.

Both must be inserted adjacent to each other after For Contractors, ordered cream then dark. That is the only placement that is both structurally clean and content coherent:

`Services C → ForContractors D → [NEW A: cream] → [NEW B: dark] → Process C → Coverage D → Enquiry C`

---

# Ranked recommendation

## 1. Name the scheme and the submission date (EDIT, no new section)

**Where:** the `ACCREDITATIONS` row, `lib/content.ts` → `company.accreditationsFallback`. **Ground:** unchanged.

The page currently says *"Applications in progress. Ask us where we are up to."* That sits inside a section subtitled *"You should not have to email us to find out whether we clear your vetting"* and then makes the reader email. Omni3 (`omni3.co.uk`) labels two of its thirteen accreditations "Application in Progress" **beside the scheme name** — an unnamed application is indistinguishable from nothing.

CHAS publishes no minimum trading period and new businesses can apply; assessment leans on written policies and the named competent person where job history is thin. So this is not a permanent hole, it is a calendar entry.

> `{{SSIP_SCHEME}} assessment submitted {{SUBMISSION_DATE}}. We will publish the certificate number here on the day it is awarded, and not before.`

**No decision date.** CHAS's own cited figure is that roughly four in five small firms fail the first assessment; a public forecast of someone else's decision is a promise IES is likely to miss in front of the exact reader who will remember.

**Audience:** main contractor supply chain, decisively. **Blocked by:** the `SCHEMES` audit carve out. **Sites:** omni3.co.uk, chas.co.uk, tradecomply.co.uk.

## 2. Remove the request gate on the documents (EDIT + block inside For Contractors)

Three things gate documents today: commitment line 4 *"Insurance certificates and method statements available on request"*, and `Request our capability statement` appearing **twice** (hero secondary CTA and For Contractors CTA). Meanwhile `Full compliance detail` in the hero nameplate is `href: '#for-contractors'` — an in page anchor that promises detail and delivers a scroll.

Electrofire Group publishes its insurance policy, ICO registration and SafeContractor certificate as ungated PDFs; AMD Group publishes four governance policies plus a brochure; DG Scott links its Constructionline certificate PDF directly. Publishing openly is normal in this trade. Gating is the weaker option.

Ship **four** files, not six. Drop the specimen RAMS and specimen test certificate that two lenses proposed: a RAMS is written for a named site and client, and a test certificate carries an installation address and a scheme registration IES does not hold. A borrowed one is the same offence as captioning someone else's job as your own.

> **Everything a vetting pack asks for,** *(light)* **downloadable now.** *(bold)*
> Public liability certificate. Employers liability certificate. Health and safety policy. Capability statement.
> All four download directly. No form, no email, no waiting for someone to come back to you.

No per file issue dates — they timestamp the company's age a second time, in the one band aimed at the reader already counting. State currency once. Repoint `Full compliance detail` at this block, and switch both CTAs from `Request` to `Download` **only** once the PDF exists (`lib/content.ts:hero.secondary` already carries this warning).

**Audience:** main contractors, almost exclusively. **Sites:** electrofiregroupltd.co.uk, amd-group.co.uk, dg-scott.com.

## 3. ADD — "Who does the work" · position 3, after For Contractors · **cream**

The single largest unused asset. Companies House constrains the age of the *company*, not the trade history of the *person*. Every firm near IES's size names someone: SJK Electrical builds a trust block around Stuart Kershaw, AD Electrics signs off "Andrew and the AD Electrics team", ETS names both founders, CES carries Team as top level nav. The large nationals do not bother because they do not need to.

The page already promises *"One named contact for the whole job"* and then names nobody. That is the strongest commitment on the page withholding its own evidence.

**Publish what is checkable, not years.** There is no public register of how long someone has held a pair of pliers, and an unverifiable seniority number sitting one paragraph from a verifiable one invites exactly the comparison the page cannot win.

> **WHO DOES THE WORK** *(micro)*
>
> **You cannot check a track record.** *(light)* **You can check the people.** *(bold)*
>
> IES is weeks old. The qualifications below were earned before it existed, they belong to the individual who holds them, and every one is verifiable by you rather than asserted by us.
>
> {{PRINCIPAL_NAME}}, {{PRINCIPAL_ROLE}}
> QUALIFICATIONS: {{PRINCIPAL_QUALIFICATIONS}}
> CARD: {{CARD_TYPE_AND_GRADE}}
> DBS: {{DBS_STATUS}}
>
> Card records go out with the RAMS, so your gate team holds them before the first shift.
>
> Prices the job, attends the site, and answers the phone when your programme changes.

Notes for the copywriter: **do not publish the card number** on a public page — the buyer verifies by scanning the card or searching the register, and a printed number only exposes the individual to credential misuse. Keep the last line genderless; `{{PRINCIPAL_NAME}}` is unknown. This is the **one** place on the page that is frank about being new — three separate admissions reads as a company apologising for existing.

**Audience:** main contractors first (a named accountable individual is a vetting field), domestic third. **Sites:** sjkelectrical.com, adelectrics.co.uk, etsgroupofcompanies.co.uk, ces-groupcompanies.co.uk, rkec.co.uk.

## 4. ADD — "What we hand over" · position 4 · **dark green**

The page's actual differentiator is paperwork, and Process step 4 currently compresses it to *"Testing, certification and paperwork issued together."* A supply chain manager cannot tell what lands on their desk. Francis Construction states its PQQ is reviewed by **both** a Supply Chain Manager **and** a Health and Safety Manager — this material has its own dedicated second reviewer, and it currently gets one bullet line.

> **WHAT WE HAND OVER** *(micro)*
>
> **Every document you need,** *(light)* **issued before we leave site.** *(bold)*
>
> The paperwork is the part most firms make you chase. It is the part we have written down.
>
> Electrical installation certificate or condition report. Schedule of inspections. Schedule of test results, with the measured values recorded. Circuit schedules and distribution board charts, labelled and fitted. Operating and maintenance information for everything installed. Building regulations notification reference where the work is notifiable.
>
> Our health and safety policy, COSHH register and equipment inspection records exist today. Site induction records, toolbox talk registers and monitoring reports begin with the first job, and we will not pretend otherwise.

That last paragraph is load bearing. SSIP assessors require signed induction and toolbox talk records from the past twelve months, which a firm with no completed jobs does not have — so the "every document exists today" framing proposed in one lens was itself a hidden history claim.

If a buyer wants to see the format before appointing, offer **"a blank set of the forms and schedules we issue"** — never "a sample pack", which implies a job IES has done.

**Audience:** main contractors and commercial clients. **Sites:** francisconstruction.co.uk, basframes.co.uk, spectrumenergysystems.co.uk.

## 5. Trade a duplicated clause for Part S (EDIT, one card)

The Commercial card ends *"attend your inductions, and send RAMS before we arrive."* RAMS already appears twice more (For Contractors commitment 2, Process step 3) and inductions once more. That is a reclaimable clause.

Part S is the sharpest contractor facing knowledge available with zero trading history. **Verified against gov.uk and Approved Document S:** new non residential buildings with **more than 10** parking spaces need at least one charge point plus cable routes for one in five of the remaining spaces. Two lenses proposed copy that dropped the threshold and asserted the duty for all non residential buildings — aimed at the one reader most likely to know the number by heart.

> Installation, containment, distribution, lighting and small power on live and new build sites. Charge point provision priced at first fix under Part S, not found at completion.

178 characters, inside the 180 `cardBody` budget. Note Approved Document S is England only, which matters given the page offers to travel.

**Audience:** main contractor supply chain, exclusively. **Sites:** electriccarchargersuk.co.uk, gov.uk Approved Document S.

---

# Photography: the explicit answer

**Add it — one photograph, one subject, one place. And first, ship and document the one you already have.**

**Class 0, already built, not live.** `public/hero.jpg` is a full bleed licensed stock image duotoned into brand green, darkened until its lightest 1% of pixels clears 4.80:1 against gold and 11.12:1 against cream, carrying empty `alt`, `aria-hidden`, no caption. It is decorative and claims nothing. **Keep it.** It is not photography introduced under a work heading, which is the only line that matters. But it needs three things it does not have: a recorded licence id and tier (Stantec, the best precedent here, leaves the licence id in the filename), a reverse image check that it is not already running on a West Yorkshire competitor's site, and a decision on whether it becomes the Open Graph card — where captions and alt text are stripped and the ownership implication is at its strongest.

**Class 1, the addition.** A portrait of `{{PRINCIPAL_NAME}}` inside the new "Who does the work" section.

- **Depicting:** one real person, plain dark ground, no site background, no hard hat prop, no folded arms in front of a van. Not a team grid — until there is a team.
- **Treated:** rectangular crop at the existing 2px radius. **Never a circular or rounded avatar** — that is the single most likely way this gets implemented wrongly and it breaks orthogonality outright. If tonal consistency is wanted across future portraits, black and white applied consistently, not a green tint. Serve AVIF/WebP with a `srcset`; `hero.jpg` is currently a lone 58KB JPEG with no alternates and it is the LCP element.
- **Not in For Contractors.** `DESIGN-DIRECTION.md:593` already ruled on that slot: *"No headcount, no name, no photograph beside it."* A solitary portrait inside the band written for the buyer counting heads publishes headcount as one.

**Delete or use `public/band.jpg`.** It was written in the same second as `hero.jpg`, ships in `out/`, and nothing imports it. Someone already bought an image for a band. Force that decision rather than leaving it in the repo.

**The rule that keeps it from reading as a portfolio claim:**

> Every photograph on this page is of a person IES employs or an object IES owns, and no photograph may sit under a heading, caption or alt text that attributes completed work to IES.

Encode it in `scripts/audit-content.ts` beside the existing checks, not in prose — this project's prose rules are already going stale (`DESIGN-DIRECTION.md:649` still asserts "Zero image slots" while a hero photograph ships).

**Rejected photography subjects:** materials and component shots on the Services cards (they secretly assume IES holds stock — inverters and modules are ordered per job, never shelved, so the Renewables card would fall back to the stock imagery the same argument forbids); the van and premises (unverifiable until a liveried vehicle exists, and the registered office is currently a placeholder); test instruments with a calibration date under them (a number that goes stale on a fixed annual schedule on a page nobody maintains); documents photographed as objects (delivered better as text in rec #4).

---

# SKIP list

Each with the fact that blocks it.

| Section | Blocking fact |
|---|---|
| Case studies, projects, gallery, recent work | No completed projects. No honest partial version; the published company number confirms why. Present on 11 of 14 and 8 of 14 in two separate corpora. |
| Testimonials, reviews, ratings, star scores | No customers. The high value variant (AJ Field's named Contracts Managers at Anwyl and Wynne) needs clients; the domestic variant needs reviews. |
| Accreditation logo wall | No certificate held. Also **machine blocked** by the `SCHEMES` audit rule. Closes itself the day rec #1 lands. |
| Client logo wall | No clients. A logo implies a completed commercial relationship. |
| Stat tiles / numbers band | Every available number is a history number. The compliance nameplate already occupies this slot with facts that are true. |
| Years in business / About / heritage | Weeks old, and the number is one click from the page's own company number. |
| News feed | Nothing to report. An empty feed timestamps its own silence. |
| Careers | No headcount, no vacancies. Invites the exact question the page is answering. |
| Financial standing, turnover, accounts | No filed accounts. Keep it off the page entirely and answer it when a specific buyer asks — volunteering it invites disqualification from buyers who would never have raised it. |
| ISO 9001 / 14001 / 45001, Constructionline Gold | Needs an audited management system; Gold needs financial assessment. **Never write "we follow ISO 9001 principles"** — BAS Frames names that exact phrasing as a walk away red flag. |
| Indicative pricing, price bands, finance calculator | No jobs to price from; finance needs a real FCA regulated broker relationship and disclosure. |
| FAQ band | Structurally unbuildable at the proposed slot, and 2 of 5 proposed questions restated Process and Coverage verbatim. The two questions worth keeping are absorbed by recs #1 and #2. Never ask *"what happens if you go out of business"* — every competitor answers it with an insurance backed guarantee IES does not hold. |
| Sector exclusion list ("we do not take on X") | Not free. It is the one proposal that can cost enquiries at the moment a new firm needs every one. Absent from all 14 commercially motivated firms sampled, which is evidence it is a bad idea, not an unclaimed one. |
| "Current availability / earliest start" band | For a firm with no clients, every operative is uncommitted and the earliest start is today, so the honest version reads "we have no work." No buyer PQQ asks it at prequalification. |
| Hero slider or hero background swap | The nameplate is the strongest asset on the page and must stay maximally legible. The existing decorative hero already does this job with facts. |
| Coverage band imagery | Its distinctness is being the only section with no right column; the pause is achieved by emptiness. Filling it spends the page's only rest. |

---

# Two things to check before building

1. **Do not link the company number to Companies House yet.** The register entry is not a date, it is a dossier: filing history, registered office, and officer appointments linking to the director's other and previous companies. Open the real entry and read the officer appointments before advising the link. Moot while the number is `00000000`.
2. **One client question unblocks two decisions:** what does IES physically own today — a liveried vehicle, a unit, a bench, any stock? That single answer settles the van and materials photography verdicts together.

**Repetition to fix while you are in there:** "same day / come back today" already appears in the Enquiry headline and Process step 1; do not add a third. "One named contact" appears in For Contractors and Process step 3; rec #3 converts it to evidence rather than restating it.