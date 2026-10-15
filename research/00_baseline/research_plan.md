# Whiteboard market and product research plan

Prepared 15 October 2026. Status: approved by the user on 15 October 2026. External research may proceed under this plan.

## Objective and decision questions

Evaluate Whiteboard as a unified university platform with an LMS core for US higher education: four-year universities, public/private colleges and community colleges. Compare their needs rather than assuming a single buyer or workflow. Use K-12 and international examples only when they clarify a product's positioning, applicability or a relevant standard.

The research must explain what schools use, what users struggle with, who buys, what integration/accessibility/security requirements matter, and where a new vendor could win. The output should distinguish the long-term platform ambition from a credible first-school launch. Recommendations are findings to be developed, not a predetermined endorsement of either a small grading add-on or replacing every campus system.

Translate the Apple-quality UX goal into assessable tasks: discoverability, navigation consistency, understandable language, task completion steps, accessibility, mobile parity, loading/recovery behavior and perceived responsiveness. Distinguish demonstrated behavior, user testimony, vendor claims and our design judgment. Do not invent usability measurements.

## Research order and depth

| Order | Domain | Work and depth | Completion checkpoint |
| --- | --- | --- | --- |
| 0 | Baseline and plan | Read the audit, classify build maturity, set research questions, schemas and evidence rules. | Stop for the user's OK. |
| 1 | 01 LMS core | Deepest domain: broad vendor map, six core-platform deep dives plus justified newer entrants, specialist submission/grading tools and open-source alternatives. Analyze task-level workflows, not just feature checklists. | Files complete; source/data checks; short findings update; research commit. |
| 2 | 02 Scheduling and rooms | Academic timetabling and operational booking separately; 4–6 deep dives, SIS-native options and cross-domain event/space handoffs. | Same checkpoint. |
| 3 | 03 Events and clubs | 4–6 deep dives across engagement suites, club systems and campus app alternatives; approvals, finance and room dependencies. | Same checkpoint. |
| 4 | 04 Cross-cutting requirements | Integration/identity standards, legal/accessibility/security requirements, buying/pricing/migration and AI. Compare representative SIS/identity ecosystems where vendor matrices apply. | Same checkpoint; reconcile earlier domain recommendations with verified requirements. |
| 5 | 05 Missing landscape | Full campus taxonomy, supplier map, sourced pain and proximity; rank build/integrate/partner boundaries. | Same checkpoint; select any promotions using the rule below. |
| 6 | Promoted domains | A full folder and 4–6 deep dives for each high-value addition justified by the landscape findings. Do not promote automatically. | Individual domain checkpoints and commits. |
| 7 | Synthesis and HTML | Merge/deduplicate evidence; develop launch wedge, positioning, roadmap and risks; generate the final offline HTML. | Validate evidence/data/report; final commit; report path and top 10 takeaways. |

Cross-cutting questions discovered before stage 4 are recorded as leads/open questions. Any current legal or standards claim needed earlier is verified at that point and later consolidated; it is never assumed until the dedicated stage.

Work is primarily sequential so each domain informs the next. A bounded worker may research an independent vendor set or domain in parallel only after approval; it owns a disjoint folder and returns evidence plus limitations. The lead owns shared schemas, merged data and synthesis. Use supported account-entitled model IDs without changing the selected parent or invoking paid APIs. Use bounded Astra planning/review where it improves substantial integration work; do not claim Astra-led review unless it occurs.

## Domain questions

### 01 LMS core

- Which platforms are serious US higher-ed incumbents, challengers, open-source options and niche entrants? Verify the starting leads Canvas, Blackboard, Brightspace, Moodle, Google Classroom and Schoology, including present owner, product name, current availability and higher-ed versus K-12 relevance.
- What adoption evidence exists, for which year, population and denominator? Separate institutions, enrollment, FTE, installations and paying customers. Does consolidation change the effective vendor choice?
- How do students, faculty, TAs, instructional designers and LMS administrators accomplish the full teaching cycle: create/copy a course, syllabus, modules/content, assignments, rubrics, submissions, handwritten/photo/PDF work, feedback, gradebook and term rollover?
- How mature are quizzes/exams, item banks, accessibility/accommodations, announcements, discussions, calendars, notifications, mobile apps, analytics and administrative oversight? What requires add-ons or a higher plan?
- Where do specialist grading/scanning/integrity tools fill gaps? Distinguish human rubric grading, OCR, annotation, AI assistance and automated grading.
- What does pricing include, how hard are migration/content conversion/training, and which pain is sufficiently persistent to justify switching?
- Which existing Whiteboard design assets help, which prototype gaps are blockers, and what must a credible LMS MVP include or defer?

Core deep-dive plan: investigate the six named platforms, then add or substitute substantive higher-ed deep dives if evidence shows a named lead is predominantly outside the target market. Retain every starting lead in the map with a documented inclusion/depth decision. Add focused newer/AI-native and open-source comparisons when relevant; label unverified entrants as leads until checked.

### 02 Scheduling and rooms

- Verify 25Live/CollegeNET, EMS/Accruent, Coursedog, Ad Astra, Infosilem and SIS-native scheduling leads; determine their current ownership and product boundaries.
- Separate academic timetable generation, section planning, faculty assignment, student conflict reduction, exams, reservations and event-space operations. Which vendor solves which problem?
- How do constraints work: capacities, room equipment, accessibility, faculty availability, preferences, travel/campus location, meeting patterns and conflicts? Distinguish hard constraints from optimization preferences.
- How do approvals, recurring bookings, overrides, waitlists, blackout periods, calendar updates and cancellations work? Which utilization metrics are reliable and which depend on sensors/attendance data?
- What information comes from or writes to SIS/LMS/facilities/event tools? Who owns the authoritative timetable and room record?
- What are real administrative pain, deployment requirements, pricing and a feasible first scheduling/booking module for Whiteboard?

### 03 Events and clubs

- Verify Engage/CampusLabs, CampusGroups, Presence/Modern Campus and campus app leads, including current product names and ownership. Find meaningful specialist/open alternatives.
- How do event creation, approval, RSVP/ticketing, waitlists, check-in, space requests, budgets, payments and communications connect?
- How do organizations handle membership, officer transitions, elections, constitutions, forms, funding requests and purchasing/reimbursement?
- What engagement/co-curricular transcript claims can be supported? Who can see attendance/participation data, and how do policies affect it?
- Where are student experience, staff workload and procurement pain most acute? Which parts belong in the platform and which should integrate?

### 04 Cross-cutting requirements

- **Integrations and standards:** verify current SIS families and ownership, including Banner/Colleague, Workday Student and PeopleSoft. Assess actual higher-ed use and scope of LTI 1.3/Advantage, OneRoster, Caliper/xAPI and other relevant exchange/content standards such as QTI/Common Cartridge. Separate protocol support, certification, version and operational deployment.
- **Identity:** assess SAML/OIDC, Shibboleth/InCommon and Microsoft/Google identity ecosystems; institution/course/section roles, provisioning, lifecycle, guest access, multi-campus tenancy and source-of-truth boundaries.
- **Accessibility/legal/security:** verify FERPA applicability, WCAG requirements, DOJ ADA Title II rule applicability/deadlines/current amendments, VPAT/ACR evidence, HECVAT versions, SOC 2 scope, privacy/retention, data location, subprocessors and incident obligations. Distinguish law, institutional procurement policy, voluntary standard and vendor evidence. Differentiate public/private institutions; do not treat an attestation/template as certification or assert legal compliance.
- **Buying and economics:** identify users, champions, decision-makers and budget owners across CIO/provost/registrar/student affairs; public RFPs, evaluation criteria, procurement windows, contract/renewal terms, migration/training/support and switching risks. Extract public price evidence with enrollment scope, year, modules and fees intact.
- **AI:** verify currently available versus announced/beta offerings; grading assistance, tutors, authoring, assessment, admin and student-success uses. Capture institutional policies and user attitudes without equating comments with representative surveys. Examine training/data use, opt-out, accuracy, accessibility, academic integrity and human review.
- What gates must Whiteboard meet before a pilot, before an institution-wide LMS contract and before cross-campus expansion?

Create separate `integrations_standards.md`, `compliance_security.md`, `buying_pricing.md`, `ai_features.md` and `requirements.csv` alongside the shared domain files. The feature matrix uses representative products for which support can be verified; laws/standards are not treated as competing vendors.

### 05 Full campus landscape and missing domains

Map at least these candidate areas without prejudging build priority:

- Advising, degree audit/planning, early alert, retention/student success and attendance.
- Proctoring, academic integrity, ePortfolios, accessibility/disability services and accommodations.
- Curriculum/catalog management, registration, student records, admissions/recruitment CRM, financial aid and student accounts/payments.
- Campus mobile, unified communications/messaging, surveys/course evaluation and institutional research/accreditation.
- Career services/internships, alumni/advancement and continuing/professional education.
- Housing, dining, campus ID/access, parking/transportation, library, facilities/work orders and help desk.
- Finance/procurement, HR/payroll, research/grants, athletics/recreation, international student services, health/counseling and campus safety, where they affect the whole-university platform boundary.

For each: who sells it; verified institutional pain; users/buyer; records/integrations needed; closeness to teaching; implementation/trust/regulatory burden; and Now/Later/Never-build recommendation. Never-build may mean integrate or partner, not exclude the function from the unified experience.

Promote an adjacency into its own domain folder when evidence supports substantial pain, a credible Whiteboard advantage, and a close shared workflow/data dependency with the core. Record the reason and alternatives. If none qualifies, say so rather than manufacture a domain. Any promotion receives the full seven-part research treatment.

## Repeatable domain workflow

1. Build the market map and record inclusion/exclusion decisions. Cover incumbents, challengers, open source and meaningful specialists; record search coverage and remaining gaps rather than claiming an exhaustive census of all vendors.
2. Deep-dive the selected 4–6 products, going further for LMS: feature availability, current owner, public pricing, integration evidence, named customers, strengths/limitations and the real task path.
3. Collect pain from public G2/Capterra reviews, relevant Reddit discussions, app-store reviews, EDUCAUSE, institutional evaluations/RFPs and higher-ed reporting. Use multiple independent sources where possible. Record role/context/date and sampling limits; never invent interviews or represent desk research as direct testing.
4. Build the sourced feature matrix. `unknown` means unavailable evidence, not a missing feature. Separate native, add-on/integration, plan-limited and beta availability.
5. Derive gaps/opportunities and explicitly label our inferences. Compare with the maturity categories in `current_build.md`.
6. Recommend a domain MVP, deferrals, build/integrate boundary, risks and the smallest useful acceptance tests.
7. Check citations/schema/consistency, update README/PROGRESS, commit the research checkpoint and give a 5–10 line user summary before continuing.

## Evidence and confidence contract

- Use free public sources and existing entitlements only. No purchased reports, paid APIs, new subscriptions, private-data uploads or external publishing. If a source is inaccessible, record the gap and find alternatives without bypassing access controls.
- Open sources before citing them. Prefer official vendor release/docs/pricing, institutional procurement/contracts/policies, standards bodies and government sources for factual/current claims. Use reviews/forums for reported experience, with the reporter/date/context preserved.
- Record source title, URL, publisher, source type, publication/revision date when available, access date, supported claim and limits in `sources.md`. Cite near claims in notes and include source IDs/URLs in CSV records. No long copied passages.
- Use an as-of date for findings and verify ownership/status close to the final synthesis. An October 2026 access date does not make a historical figure an October 2026 measurement. Keep transaction announcement, completion and rebranding distinct.
- Market share, prices and customer counts each receive high/medium/low confidence tied to evidence. High requires clear scope/date and strong source; medium has material scope/recency limitations; low is weak/indirect evidence. `unverified` is a verification status, not a substitute for a citation or a fourth confidence level. Omit unsupported numbers.
- Public contract prices retain currency, contract period, campus/enrollment scope, recurring versus one-time fees, bundles and negotiated discounts. Derived annual/per-FTE comparisons are labeled calculations with inputs/assumptions. Do not present one contract as a universal list price.
- Separate documented capabilities, vendor marketing, reported user pain and our synthesis. Note source conflicts rather than vote-counting citations. Customer logos establish vendor-listed relationships, not independently verified deployment scope.
- Pain severity and opportunity scores are analyst judgments, not published measurements. A single complaint cannot establish prevalence. Do not make statistical claims from a convenience sample.

## Shared data schemas

Use UTF-8 CSV with quoted fields where necessary; dates use ISO `YYYY-MM-DD`. All domain copies use the exact same headers. Empty numeric fields mean unknown/not found, never zero. Multiple source IDs/URLs within a cell use ` | `; the CSV parser still handles ordinary quoting/newlines correctly.

**`competitors.csv` and `data/all_competitors.csv`**

```text
competitor_id,vendor_id,domain_id,name,product_name,owner,ownership_status,target_segment,positioning,pricing_model,pricing_public,price_amount,currency,price_unit,price_period,price_scope,one_time_fees,pricing_notes,pricing_confidence,market_share_value,market_share_unit,market_share_scope,market_share_period,market_share_confidence,customer_count_value,customer_count_scope,customer_count_period,customer_count_confidence,notable_customers,integrations,strengths,weaknesses,verification_status,as_of_date,source_ids,source_urls
```

One row per product competitor within a domain. Stable `vendor_id` links vendors spanning domains; product IDs remain stable after an acquisition. The merged file preserves domain-specific rows rather than collapsing different products or deployments.

**`feature_matrix.csv`**

```text
domain_id,competitor_id,feature_id,feature_name,coverage,delivery_mode,availability,plan_or_version,notes,evidence_type,confidence,verification_status,as_of_date,source_ids,source_urls
```

Store one competitor-feature pair per row for consistent headers across domains; the report pivots it into a competitors × features table. `coverage`: `✅`, `partial`, `❌`, `unknown`. `delivery_mode`: `native`, `add_on`, `integration`, `mixed`, `unknown`. `availability`: `general`, `beta`, `announced`, `retired`, `unknown`. Unsupported is `❌` only with evidence; silence is `unknown`.

**`pain_points.csv` and `data/all_pain_points.csv`**

```text
pain_id,domain_id,competitor_id,pain_point,affected_role,institution_segment,workflow,severity,severity_rationale,evidence_type,reported_date,source_context,prevalence_limitations,confidence,verification_status,as_of_date,source_ids,source_urls
```

Severity uses `high`, `medium`, `low`, with rationale; confidence describes evidence quality separately. The same underlying complaint reused across domains retains `pain_id` so it is not counted as independent evidence. Anonymous identities/private student information are unnecessary and are not copied.

**Supplemental schemas**

`04_cross_cutting/requirements.csv`: `requirement_id,category,requirement,institution_scope,authority_type,applicability,deadline_or_version,whiteboard_gap,validation_needed,confidence,verification_status,as_of_date,source_ids,source_urls`.

`05_landscape_missing/priority_ranking.csv`: `domain_id,domain_name,users,buyer,key_vendors,pain_score,ability_to_win_score,core_closeness_score,opportunity_score,score_rationale,implementation_burden,trust_or_regulatory_risk,recommendation,delivery_approach,promote_to_domain,confidence,as_of_date,source_ids,source_urls`.

Opportunity scoring starts with pain × ability to win × closeness, each an explicit 1–5 qualitative judgment. Show component scores, evidence/rationale and sensitivity; risks and implementation cost remain visible rather than hidden in a single score. Recommendations use `now`, `later`, `never_build`; delivery approach clarifies native build, integration or partner.

No competitor/feature/pain CSVs are populated before approval. Record an empty result or data gap honestly rather than adding placeholder findings.

## Folder layout

```text
research/
  README.md
  PROGRESS.md
  00_baseline/
    current_build.md
    research_plan.md
  01_lms/
  02_scheduling_rooms/
  03_events_clubs/
  04_cross_cutting/
  05_landscape_missing/
  06_<promoted_domain>/                 # only when evidence justifies promotion
  data/
    all_competitors.csv
    all_pain_points.csv
  synthesis.md
  report/
    index.html
```

Each numbered research domain gets `notes.md`, `competitors.csv`, `feature_matrix.csv`, `pain_points.csv`, `opportunities.md` and `sources.md`. The cross-cutting and landscape supplements are specified above. `notes.md` includes deep dives, market coverage, baseline comparison, recommendation, uncertainties and handoff notes. `sources.md` is a claim-to-source evidence table, not just a URL dump.

## Version control and continuity

This folder is not currently a Git repository. After approval, initialize a local repository and create `research/market`. Before staging, check for secrets and existing ignore rules; stage only explicit `research/` paths. Preserve the original HTML, workbook and audit. Do not configure/change a remote, push, rewrite history or commit unrelated files.

Make an initial baseline/schema checkpoint, then commit after each completed domain and after synthesis/report. Each checkpoint records domain/date, files, evidence gaps and validation performed. If commit is blocked by identity/signing/policy, preserve the work, report the exact blocker and continue research without changing global configuration.

`PROGRESS.md` tracks not started/in progress/complete/blocked, dates, source freshness, open questions, worker ownership, last commit and the exact next action. Keep a compact resumption note after each domain; do not rely on chat history to reconstruct research state.

## Synthesis and final HTML

`synthesis.md` will cover campus buying/usage, opportunity ranking, launch wedge, positioning and counterarguments, purchasing gates, MVP → v1 → v2 roadmap mapped to the build, and risks/open questions. Recommendations may challenge the one-system premise where integration or a specialist is a better solution.

The report will be one self-contained `report/index.html` with inline CSS/JS and embedded data generated from the CSVs. It must work on `file://` without fetching local CSV files, CDN libraries, remote fonts or a build step. Links to source files and external evidence remain available as ordinary links.

Design: restrained Apple-style visual hierarchy, whitespace, system typography, responsive sticky sidebar, light/dark/system theme, keyboard-operable controls, clear focus and reduced-motion support. No fabricated screenshots, testimonials or completion metrics. Do not restyle the existing prototype.

Sections: executive summary → domains → synthesis/roadmap → sources. Domain sections contain market map, sortable/filterable competitor and feature tables, sourced pain, opportunities and recommendation. Distinguish unknown, partial/add-on and absent features visually and in text. Simple charts are used only when the data support them; any counts summarize the research sample, not population prevalence.

Validate CSV parsing/required fields/IDs, cross-file references, cited numeric claims and confidence, merge deduplication, internal links, table filters/sorts and offline data loading. Check desktop/mobile widths, keyboard access, light/dark and reduced motion in an allowed browser workflow when available. The earlier local-file policy restriction must not be bypassed; if browser verification remains blocked, disclose the specific untested checks and provide static validation evidence.

## Approval checkpoint

Step 0 is complete when the baseline and plan are saved and shown to the user. Stop at this checkpoint. Do not browse, populate domain findings, initialize Git, delegate external research or build the final report until the user approves this plan.
