# Whiteboard showcase v2 progress

Approved: 2026-10-15. Branch: `showcase/v2`. Source: `Claude outputs/Pellwin-Showcase.html`. Archive: `showcase/archive/showcase_v1_2026-10-15.html`. The research report and hosted research Site are separate and unchanged.

| Step | Status | Evidence / next checkpoint |
| --- | --- | --- |
| B0 Preserve and prepare | Complete | Original and archive byte/hash match. |
| B1 Story and shell | Complete | Offline narrative, 14 sections, responsive tokens/nav/theme, shared pure render contract and local conversation brief. |
| B2 Student learning | Complete | Ten P0 workspaces; shared page/tag/receipt state, interruption/retry, course materials, quiz and conversation. |
| B3 Faculty and assessment | Complete | Eleven teaching screens; immutable release snapshots, per-learner marks, revoked-role and conflict guards. |
| B4 Spaces | Complete | Canonical timetable, capacity checks, proposal/source approval, series exceptions. |
| B5 Events and organizations | Complete | Draft/published versions, room/funding review, RSVP, check-in and officer transitions. |
| B6 Institution and support | Complete | Support ownership/sharing, access, audit export, migration validation, grade reconciliation and AI controls. |
| B7 P1 coverage | Complete | All 40 workspaces and six guided journeys available; rollover, people, notifications, offline check-in and transitions exposed. |
| B8 QA and delivery | Complete with limitation | Node/static/Astra checks passed; browser visual/runtime QA remains blocked and explicitly unverified below. |

## Constraints

Only fictional local data. No service connections, messages, publishing, paid calls or backend are authorized. Inline deliverable; source fragments are development-only and compiled into the single HTML. Keep the original archive immutable. Do not claim live availability, institutional adoption, certifications or measured savings.

## Handoff

B0 completed; root owns shared model, shell, styles, integration and commits. Bounded workers may own disjoint screen modules after the rendering/action contract is saved. Previous browser URL-policy limit must be respected; record actual checks, not promised checks.

B1: Replaced the internal review shell with the planned product narrative. Built static readable scenes, role anchors, theme controls, source footer and honest local CTA. Syntax/build checks passed; browser execution is not yet claimed.

B2: Added the student day, course/materials, scanning/PDF samples, page organizer, receipt, quiz and discussion. Node checks passed for pure rendering, tag validation, preserved retry state, new-attempt grade invalidation, quiz submission and escaped replies. P1 course/update views are implemented but stage-gated until B7.

B3: Faculty authoring, rubric grading, feedback release and TA access are connected. Node regressions verify held drafts do not alter released feedback, current-attempt visibility, matching page tags, conflict blocking and revoked access.

B4: Added scheduling constraints and room requests with separate approval and source confirmation. Campus regressions verify applied meetings persist, room capacity/date validation and recurrence state.

B5: Events and organizations share room and approval state. Regression checks cover immutable published events, review dependencies, capacity/waitlists, stable offline check-in identity and derived member counts.

B6: Added four institution/IT workspaces and connected the referral queue. AI and assurance are explicitly planned or unverified; audit export is a real local JSON download containing fictional records.

B7: Enabled all planned P1 workspaces. Final artifact contains 40 real HTML/CSS workspaces, inline styles, inline SVG and inline scripts without runtime network dependencies.

## Gap coverage and deliberate boundaries

| Gap IDs | Result / where to inspect |
| --- | --- |
| L01–L04, L06–L07 | S05–S09, S17–S21: page tags, grading, release snapshots, recovery and course roles. |
| L05, L09–L16 | Full LMS story; S01–S04, S10–S16, S21–S23: course work, content, authoring, quizzes, grades, people, copy and observations. |
| L08 | Responsive CSS and readable mobile reflow implemented; browser/device verification remains outstanding. |
| L17–L19 | Production capture, durable storage, native app availability and measured superiority claims removed. Samples are explicit. |
| R01–R06 | S12 and S24–S27: canonical meetings, constraints, source approval, room requests, recurrence and scheduled-use provenance. |
| R07 | Universal optimization and measured occupancy claims excluded. |
| E01–E08 | S28–S33 and shared calendar: discovery, membership, organization-owned drafts, dependencies, RSVP/waitlist, offline check-in and transition. |
| E09 | Settlement, secure elections and official transcript issuance excluded. |
| X01–X08 | Semantic controls/statuses, branding, scoped roles, local audit, retention policy, source directions, exception resolution and migration preview. S37–S39. Evidence documents are not represented as ready. |
| X09–X14 | S40 and S17: explicit readiness requirements, optional authored AI draft, disabled path, learner policy, unselected provider terms; unsupported customer/partnership/certification claims removed. |
| A01–A05 | S34–S36: service directory, sharing choice, selected service, owner/queue/capacity, correction and authoritative degree-audit reference. |
| A06–A07 | No predictive risk score, diagnosis or clinical workflow. Support is a later roadmap direction. |
| W01–W06 | Campus map, specialist-system boundaries, sourced problem statements, fair category comparison, staged direction and honest local conversation brief. |
| W07 | Deferred: presentation mode, logo variants and design-system explorer. V1 retained in archive. |

P2 extras deferred as approved: marigold editorial surface, separate presentation/design-system modes, alternate logo studies, additional native-app and specialist-system mockups. They do not advance the central shared-workflow story. Integration services, real camera/PDF processing, persistent uploads, authentication, AI inference and production assurance remain product implementation work, not capabilities of this single-file showcase.

## Verification and remaining manual review

Run from the repository root:

```
node showcase/tools/check_student.cjs
node showcase/tools/check_teaching.cjs
node showcase/tools/check_campus.cjs
node showcase/tools/check_integrated.cjs
node showcase/build.mjs --stage B8
node --check showcase/src/controller.js
python3 showcase/tools/check_html.py
git diff --check
```

Passed: 40 pure screen renderers, six valid journey routes, registered action targets, unique screen-control IDs, actual HTML label/anchor targets, no required external assets, script syntax, fictional export contents, source authority/release guards and archive SHA-256 preservation. Browser runtime console cleanliness has not been established by these Node/static checks.

Browser limitation: the previously recorded local-file URL-policy restriction was respected. No localhost, alternate URL scheme or browser workaround was used. Desktop/phone light/dark rendering, actual keyboard/focus behavior, clipping/overflow, zoom, screen-reader behavior and runtime browser console remain **unverified**. Smallest remaining QA: open the final HTML locally in Chrome; inspect all chapters at approximately 1440px and 390px in Light and Dark, traverse the six examples, and check the console. No real mobile device test was run.

## Final handoff

Edit `showcase/src/` modules and run the build command; do not hand-edit the generated HTML. `showcase/build.mjs` produces the complete offline file at `Claude outputs/Pellwin-Showcase.html` (legacy filename; visible brand is Whiteboard). The artifact has 40 workspaces and six guided examples, with fictional data held only in memory. Reload restores initial state; theme preference may persist locally. Copy/Download brief prepares local text and never contacts anyone. The original is in `showcase/archive/showcase_v1_2026-10-15.html`. Research files and unrelated project files remain separate. Branch `showcase/v2`; implementation groups committed individually. Final review corrections are recorded in the QA commit.

Final QA corrections: fixed cross-domain route targets, stale grade-export status, unpublished course/assignment/quiz gates, canonical submission preservation, event-revision room authority, scoped reset behavior and the scheduling journey’s authority record. The quiz workspace is explicitly a first-question preview, not a complete exam engine. Final single-file size: approximately 254 KB. Astra performed bounded source/state integration review; no Astra/browser visual approval is implied.
