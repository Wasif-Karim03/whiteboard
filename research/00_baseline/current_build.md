# Whiteboard current build baseline

Prepared 15 October 2026 from the existing local audit. This is an inventory of the current artifact, not market research. No external research has started.

## Product direction and naming

The current brief defines Whiteboard as one university platform with a full LMS at its core, surrounded by scheduling, rooms, events, clubs and other campus operations. Ease of use is the proposed differentiator.

The existing HTML uses Pellwin as a working name and Whiteboard as a codename. Its earlier strategy was a Moodle-connected handwritten grading tool first, with a full LMS deferred. That earlier strategy describes the artifact's scope; it does not override the new research brief. Whether a grading wedge remains the best launch strategy is an open research question.

## Evidence inspected

- [Functional audit](../../docs/Pellwin-Functional-Audit.md), dated 15 October 2026: architecture, screen behavior, limitations and 20 prioritized findings.
- [State and control inventory](../../docs/Pellwin-State-and-Control-Inventory.md): 18 product screens, 64 declared screen states, 205 grouped control variants, 14 workflows and 68 steps. Grouped variants are not completed features.
- [Current HTML](../../Claude%20outputs/Pellwin-Showcase.html): standalone design review, 396,815 bytes; filesystem modification date 28 September 2026. SHA-256 recorded by the audit: `090136bffdcdbdc4b7d0a8b1a650cb9e1a6a3750eabb35cd28b1ec13ba29d2dd`.
- [Interview tracker](../../Claude%20outputs/Whiteboard-Interview-Tracker.xlsx), as described in the audit: one example interview and no actual interview records. It is a discovery template, not evidence of market demand.

The audit's JavaScript syntax and 159 source-template checks passed. These were not browser, device, screen-reader, integration or end-to-end tests. Earlier local browser preview was blocked by browser policy; visual/runtime behavior remains unverified. No new browser verification is claimed here.

## Maturity definitions

| Level | Meaning |
| --- | --- |
| Local interaction | A limited action or calculation works in the prototype; no production service implied. |
| Interactive prototype | Screens and scenarios demonstrate a workflow, with fixtures or disconnected state. |
| Concept | Static or lightly interactive design direction. |
| Described requirement | Notes/copy describe intended behavior; service is absent. |
| Absent | No relevant implementation established in the inspected artifact. |

No domain is verified as a production-ready service.

## What exists and which domains it touches

| Part | Current maturity and evidence | Research domains |
| --- | --- | --- |
| Review shell and design system | Local navigation, search, theme/presentation controls, typography, color, component, motion and density demonstrations. A useful UX starting point; accessibility/performance not independently proven. | All domains; cross-cutting accessibility and UX. |
| Assignment setup and rubrics | Interactive prototype: title/dates/question inputs, local question rows/totals and rubric-change scenarios. Assignment/rubric data do not form one saved model. | 01 LMS. |
| Handwritten/photo submissions | Interactive prototype: synthetic pages, tags, blur/late/retry scenarios and receipts. No camera capture, IndexedDB drafts, real PDF creation, resumable upload or accepted-file storage. | 01 LMS; 04 security, privacy and accessibility. |
| Desktop PDF selection | Local file metadata/type/size checks. The chosen PDF is not parsed, rendered or uploaded; later pages remain fixtures. | 01 LMS. |
| Question grading | Local rubric toggles, score calculation, comments, name hiding and navigation. Fixed Q3 sample; saved-answer loop and question-context gaps. | 01 LMS. |
| Grade release and feedback | Interactive prototype with incomplete-work choices, sync failure states and feedback examples. Release-all selection is ignored; scores/feedback are disconnected fixtures. | 01 LMS; 04 integrations and data correctness. |
| TA roles, roster and extensions | Role-specific presentation, local roster filtering, simulated refresh and text-based late allowance. No authenticated users or server-enforced permissions. | 01 LMS; 04 identity and SIS. |
| Institution administration | Concept/prototype for LMS connection, contacts, retention, exports, support access and document downloads. Operational controls and documents are absent. | 04 procurement, compliance and security. |
| Full LMS course home | Concept: syllabus/modules/materials/announcements/navigation represented by sample content. No course authoring, copy/rollover, quizzes, discussion service or full content management. | 01 LMS. |
| Calendar and class information | Concept with local course visibility toggles. Sample schedule only; no scheduling engine, room inventory, constraints or booking workflow. | 01 LMS calendar; 02 scheduling/rooms. |
| Gradebook and student grades | Concepts with sample weighted-grade calculations and numeric sorting. Not tied to actual grading records or a comprehensive grading-policy model. | 01 LMS; 05 analytics/student success adjacency. |
| Native/mobile experience | Phone/iPad HTML frames and native-looking concept pages. Tier 1 submission screens are mobile-web designs; no compiled native app. | 01 LMS; 05 campus mobile/communications. |
| Events and clubs | Absent: no event approvals, RSVP/check-in, organization governance, club budgets or engagement service. | 03 events/clubs. |
| Wider campus operations | Absent: advising, admissions, student accounts/aid, housing, dining/ID, library, career, HR/finance and other university systems are not implemented. | 05 landscape; 04 system boundaries/integrations. |
| Marketing | One-page concept with pilot CTA and procurement claims. No working lead form. Customer, speed, compliance and deployment claims are not substantiated by the artifact. | All domains; 04 buying process. |

## Architecture and reusable assets

The artifact is one HTML file using inline CSS/JavaScript, SVG, string rendering and in-memory objects. It loads Google Fonts. Theme preference uses localStorage. There is no application framework manifest, backend, database, deployed service, persistent grading store, real LMS API client or operational identity system established in this folder.

Reusable work includes the visual vocabulary, product copy, instructor/TA/student/admin distinctions, grading interactions and extensive recovery-state design. Screen counts and polished UI must not be treated as implemented platform coverage.

## Important existing limitations

The audit confirms capture/tag resets, hardcoded review/receipt data, an ignored release choice, an unreachable upload interruption, click-listener hazards, fixed-question routing and an incomplete ungraded-answer loop. These are prototype behavior gaps. Missing production infrastructure is a separate category.

LTI 1.3/Advantage, roster exchange, grade passback, signed links, emails, audit logs, retention and support grants are described requirements. HECVAT/VPAT/DPA/subprocessor downloads are placeholders. No AI grading/OCR capability or current compliance certification is established.

The source specifications referenced by the HTML are missing from this folder, including Business Research v2.1, scope correction, Tech-v2 phases and MVP estimates. Treat their purported decisions as historical references, not independently checked requirements.

## Baseline for the research comparisons

For each domain, compare competitors against five explicit categories: reusable local behavior/design; concept only; described service; absent capability; and prototype repair. Revisit the grading wedge without assuming that either the earlier Moodle add-on strategy or immediate whole-campus replacement is the winning launch approach.

Repository inspection found no Git repository. Research version control will be initialized locally after plan approval and before domain checkpoints; existing artifacts will be preserved and only research changes committed for this task.
