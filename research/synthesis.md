# Whiteboard: a coherent university experience, built from a trustworthy LMS

Decision synthesis as of 15 October 2026. This combines public desk research and the local build audit. Recommendations are product judgments to validate with institutions, not customer commitments, market-size estimates or measured Whiteboard outcomes. Domain evidence and limitations are preserved in the source files linked below.

## Executive summary

Keep the LMS at the center. Make the everyday teaching cycle exceptionally clear and reliable, then connect campus coordination around it. The strongest proposed advantage is consistency across finding work, submitting it, grading it, releasing feedback and getting help. The current artifact contributes grading interaction design and campus navigation concepts; it is not a production LMS. [Build baseline](00_baseline/current_build.md), [LMS findings](01_lms/notes.md).

“One platform” is already a competitive proposition. Populi combines college administration and learning; Pathify unifies campus experiences over other systems; specialist portfolios connect their own domains. Whiteboard needs a demonstrably better complete workflow for a defined first-school segment, supported by honest migration, accessibility and operating evidence. [Populi](https://www.populi.co/features/), [Pathify](https://pathify.com/), [landscape](05_landscape_missing/notes.md).

The recommended launch hypothesis is a small, institution-backed teaching pilot centered on consistent course organization and dependable handwritten/PDF assessment. Keep the full LMS direction, with an LTI grading integration available as a lower-disruption entry if a design partner prefers it. Validate segment, buyer, budget and willingness to migrate before treating either route as the chosen commercial wedge. [LMS recommendation](01_lms/opportunities.md), [procurement](04_cross_cutting/buying_pricing.md).

## 1. How campuses buy and use software, and why it is painful

Campus work crosses academic affairs, registrar, IT, student affairs, facilities, finance and specialist service offices. Products encode different permissions, records and decision authority. That helps explain why one procurement does not necessarily replace an entire stack: an event approval, a room confirmation, an assessment score and an official transcript grade are different records. This is a synthesis of the domain workflow maps, not a universal campus organization chart. [Rooms](02_scheduling_rooms/notes.md), [events](03_events_clubs/notes.md), [integration authority model](04_cross_cutting/integrations_standards.md).

EDUCAUSE's current interoperability guidance describes disconnected data, inconsistent meanings and fragile handoffs, and recommends shared governance with phased improvement. A single sign-in reduces access friction but cannot by itself reconcile different student identities, grades or case states. [September 2026 guide](https://www.educause.edu/content/2026/the-integrated-institution-a-guide-to-interoperability-for-student-success).

Buying includes workflow acceptance, legal/privacy/security/accessibility review, procurement and implementation planning. Public examples show multi-year contracts, separate implementation/training, and migration work. There is no supported universal sales-cycle length or contract term in this research. A university can rationally retain an incumbent because conversion and ongoing operations outweigh the benefit of a new interface; USC's 2025 assessment is a concrete counterexample to assuming incumbents always lose a usability comparison. [Buying evidence](04_cross_cutting/buying_pricing.md), [USC assessment](https://sc.edu/about/offices_and_divisions/faculty_senate/about/news/2025/lms_assessmentcommit_report.pdf).

The user-pain evidence supports repeated workflow themes—discovery, scattered settings, inconsistent status, handoffs and migration—but does not measure national prevalence. Institutional guides describe local constraints; review/app/forum samples are self-selected and some are historical. The merged pain table keeps those distinctions. [All pain points](data/all_pain_points.csv).

## 2. Opportunity map

This ordering expresses pain × ability to win × closeness to teaching **qualitatively**. It is an ordinal screening model, not measured demand or a prediction of revenue. High pain with low ability to win is not automatically an attractive build decision.

| Order | Opportunity | Pain | Ability to win hypothesis | LMS proximity | Decision |
| --- | --- | --- | --- | --- | --- |
| 1 | Consistent course/task/submission/feedback cycle | High | Medium: current interaction ideas help; reliability and faculty adoption remain unproven | Direct | Launch validation focus |
| 2 | Accessible handwritten/PDF assessment and TA grading | High | Medium: existing prototype direction, but strong specialists already compete | Direct | Prove a complete transaction; optional LTI entry |
| 3 | Migration, integration health and understandable exceptions | High | Medium if scoped to one partner/source first | Direct | Core readiness and differentiator |
| 4 | Event/organization coordination with truthful room status | Medium–high | Medium within a limited workflow | Near | v1 expansion candidate, buyer-dependent |
| 5 | Transparent support referrals and advising handoffs | High | Medium for coordination; low for degree-rule replacement | Near | Full research promoted to Domain 06; build later |
| 6 | Schedule visibility, change requests and room reconciliation | High | Medium for coordination; low for full optimization | Near | Start integration-led; sequence against event demand |
| 7 | Evaluations, portfolios and institutional evidence exchange | Medium–high | Medium for exports/light workflows; low for wholesale suite replacement | Near | v2 or partner-led |
| 8 | Official SIS, financial/clinical/physical-access operations | High consequence | Low within current scope | Mostly distant authority | Integrate for foreseeable roadmap |

Evidence and full ranking: [LMS](01_lms/notes.md), [rooms](02_scheduling_rooms/notes.md), [events](03_events_clubs/notes.md), [cross-cutting](04_cross_cutting/notes.md), [33-domain landscape ranking](05_landscape_missing/priority_ranking.csv), [advising](06_student_success_advising/notes.md). Severity and ability-to-win labels are our judgments; the current build proves none of the market outcomes.

## 3. Our wedge and first-school hypothesis

Target discovery around a smaller college or a bounded department/program with an institutional sponsor, meaningful handwritten/PDF work and willingness to test course consistency. Include community colleges in interviews; their SIS, support capacity, nontraditional schedules and accessibility needs may change the fit. Do not assume smaller means easier procurement or permission to bypass institution policies.

The complete pilot experience should let an instructor create or import a course, publish accessible work, receive a real submission, grade with scoped TA roles, release correct feedback, and let the student find and act on it from a phone. The institution must be able to reconcile roster/grade state and export records. That is the smallest credible demonstration of the proposed advantage over an attractive mockup. [Baseline comparison and required teaching workflows](01_lms/notes.md).

If the partner wants to retain its LMS, an assessment tool launched through LTI is a narrower acquisition route. It reduces the initial migration surface but still requires authorization, accessible uploads, persistent grading, accurate return/reconciliation, institutional review and support. Gradescope/Crowdmark already serve the category, so “we scan handwriting” is insufficient positioning. [Assessment competitors](01_lms/competitors.csv), [LTI platform/tool distinction](04_cross_cutting/integrations_standards.md).

Do not launch room optimization, organization finance or automated student-risk scoring to make the pilot appear broader. Add an adjacent workflow only when the same buyer can name the real problem, authorize its data flow and identify a tool or manual process it could retire.

## 4. Positioning and the honest counterarguments

**Proposed promise:** Whiteboard makes teaching and everyday campus work clear: one place to know what matters, complete it and trust the result. The product should earn this through consistent objects, permissions, status and recovery. This is proposed positioning, not a verified performance claim.

An integrated product can reuse identity, course context, calendar, tasks, permissions and audit history. That may reduce duplicate configuration and fragmented journeys. Demonstrate it through fewer failed handoffs, correct reconciliations and better task outcomes; do not assume a lower subscription count means lower total cost. [Integration guidance](https://www.educause.edu/content/2026/the-integrated-institution-a-guide-to-interoperability-for-student-success), [procurement economics](04_cross_cutting/buying_pricing.md).

The counterarguments are serious. Specialists offer depth and established support; migration disrupts teaching; a young vendor creates continuity and concentration risk; broad access can threaten privacy; integrations may be brittle; different offices control budgets; portals can already provide a unified experience. Populi also challenges the idea that integrated college administration is new. [Landscape](05_landscape_missing/notes.md), [events integration limits](03_events_clubs/notes.md), [USC incumbent assessment](https://sc.edu/about/offices_and_divisions/faculty_senate/about/news/2025/lms_assessmentcommit_report.pdf).

Our answer should be evidence: a supported segment, an honest scope, independent accessibility/security work, an import exception report, measurable successful task completion, tested recovery and a credible export/exit path. No binding savings or performance promise should precede that evidence.

## 5. Must-haves before a school can buy

The exact contract depends on the institution and deployment. The [16-row requirements register](04_cross_cutting/requirements.csv) distinguishes laws, standards, procurement evidence and recommendations. It is not a claim that every small pilot requires identical certifications.

| Gate | Evidence Whiteboard must produce | Present build |
| --- | --- | --- |
| Identity and authority | Chosen institutional SSO; server-enforced tenant/course/object permissions; enrollment and revocation tests | No real authentication/authorization |
| Core teaching integrity | Persisted content/submissions/rubrics/grades, versioning, release audit, backups and demonstrated restore | Local in-memory interactions and fixtures |
| Accessibility | Tested critical journeys, content path and assistive technology; accurate version-specific ACR and remediation plan | Accessibility not established |
| Privacy and security | Institution-approved data purposes/roles; accurate HECVAT; contracts, subprocessors, retention, incident/support controls; assurance required by buyer | No operational evidence |
| Integration and portability | Exact SIS/tool contracts; chosen LTI services; content/item import profiles; reconciliation, failure handling and export | Described or absent |
| Institutional operation | Support ownership, implementation/training, availability/recovery terms, cost and exit plan | Prototype only |
| AI, if included | Specific entitlement/provider/data terms, off switch, permission scope, human review and evaluated failure behavior | AI absent |

For public entities, the current DOJ Title II rule names WCAG 2.1 AA and revised 2027/2028 compliance dates; entity population and governance determine the relevant category, not enrollment. Private-school obligations need their own analysis. FERPA is not a vendor certification, and HECVAT/VPAT are not certification badges. [Current legal/evidence map](04_cross_cutting/compliance_security.md), [DOJ fact sheet](https://www.ada.gov/resources/2024-03-08-web-rule/).

Integration priorities: one actual SIS/identity setup first; LTI 1.3/Advantage services appropriate to platform/tool role; versioned content and assessment interchange; lifecycle/provisioning beyond sign-in. OneRoster is not automatically the best higher-ed roster model; evaluate Edu-API and campus-specific interfaces. Caliper/xAPI are later event-interoperability choices tied to defined analytic purposes. [Standards analysis](04_cross_cutting/integrations_standards.md).

## 6. Roadmap mapped to the current build

These are acceptance stages, not invented delivery dates or staffing estimates.

| Stage | Scope | Reuse from current build | Work that must be real | Exit evidence |
| --- | --- | --- | --- | --- |
| Foundation | Product records, identity, tenancy, roles, uploads, audit, recovery | Visual language and scenario/control inventory | Backend, storage, server permissions, versioning, operational controls | Wrong-tenant/revoked-role tests; stored-byte recovery; audit and restore demonstration |
| MVP pilot | One full course cycle: organization/content, assignments, basic quizzes, phone/PDF work, rubric/TA grading, gradebook, feedback, announcements/discussions and task/calendar | Grading and Today/course/gradebook concepts | Correct shared state; real submission receipts; accommodations; basic import/export; chosen roster/SSO integration | Student/instructor/TA/admin complete synthetic then approved pilot workflows; zero silent lost work or unexplained grade mismatch in acceptance dataset |
| v1 institutional LMS | Faculty onboarding, course rollover/migration, moderation/grade policy depth, reliable notification/mobile completion, support and procurement evidence | Existing concepts provide hypotheses, not completed modules | Roster lifecycle, import exceptions, reporting, operations and wider assessment policies | Partner-approved converted courses, accessibility assessment, recovery/reconciliation and support rehearsal |
| v1 adjacency | Select events/clubs and room-request/change coordination with shared calendar/tasks | Calendar direction only | Officer lifecycle, co-editing, approvals, RSVP/check-in and authoritative room status | Real responsible office and a measured end-to-end improvement; no contradictory booking state |
| v2 connected campus | Student-support referrals; selected evaluations/portfolio/evidence exchange; deeper schedule analytics if demanded | No production implementation | Permission-scoped handoffs, authoritative plans, explicit analytics purposes; narrow additional connectors | Institution-approved data governance and demonstrated value before adding domains |
| Integration boundary | SIS/aid/finance/payroll, housing, commerce/IDs, library, careers, clinical/conduct systems | None | Scoped adapters and safe contextual links, with source/freshness/owner | Correct authority, minimal data, observable failures and export/exit |

Before reusing the prototype logic, fix the known question-state, review-page, release-scope, queue and upload-count defects. Replace synthetic success with persisted results and failure/retry paths. Keep the original showcase as design history rather than equating it with the application architecture. [Functional audit](../docs/Pellwin-Functional-Audit.md), [baseline](00_baseline/current_build.md).

AI comes after deterministic workflows are trustworthy. Incumbents already ship authoring, assistance and tutoring in differing tiers. An AI label is not a durable edge; evaluate optional reviewable help against time plus correction burden, educational usefulness, privacy, accessibility and cost. Defer autonomous final grades and opaque consequential student labels. [Current AI releases and controls](04_cross_cutting/ai_features.md).

## 7. Top risks and open questions

1. **Undefined first segment:** which institution/program, sponsor and renewal window create a real purchasing route? Validate with buyers, not just enthusiastic users.
2. **Depth versus breadth:** can we deliver assessment correctness and support while expanding? Select one adjacent workflow at a time.
3. **Migration:** which real source courses, quiz types, rubrics, dates, files and policies must survive? Obtain permitted test material and reconcile results.
4. **Trust and continuity:** who handles peak assessment incidents, restores records, trains faculty and supports accessibility exceptions?
5. **Differentiation:** do students/faculty complete important tasks better than in a modern configured incumbent? Benchmark matched tasks, including revision/error recovery.
6. **Economics:** what costs are actually retired after implementation, integrations, training, parallel operation and support? No Whiteboard price or savings model is validated yet.
7. **Authority and privacy:** who owns each record, which purposes permit access, and which data must stay outside shared views?
8. **Adoption:** will officers, faculty and staff keep records current? Governance and human service capacity remain necessary.
9. **AI:** which useful task merits the data/cost/governance burden? What happens when it is disabled or wrong?
10. **Evidence limits:** this is broad public desk research, not complete market coverage, a live competitor benchmark, legal review or primary customer discovery. Several ownership, pricing and feature cells remain unverified/unknown.

## Follow-up research packet

Recruit students, faculty/TAs, LMS/IT, registrar, accessibility/security/procurement and the chosen adjacent service owner. Use the existing interview workbook as a template, not as completed evidence. Record actual product version/configuration, tasks, failures, authority and cost. Begin with synthetic coursework; institution data transfer requires explicit authorization and an approved handling path. [Local interview baseline](00_baseline/current_build.md), [domain acceptance tasks](01_lms/opportunities.md).

The offline HTML report embeds the reviewed domain narrative and CSV tables. Source files remain the editable research record. All chart counts describe this research corpus only, not market prevalence or vendor quality. Static validation and remaining browser-verification limits are recorded in [validation data](data/validation.json) and [progress](PROGRESS.md).
