# Screen count cross-check and production coverage gaps

Checked 15 October 2026 against the code registry, approved `02_design_plan.md` and existing research recommendations. **40 is the exact current showcase workspace count. It is not the final production screen count.**

The earlier 40 desktop + 40 mobile count means responsive layout/test targets for the same workspaces. It does not mean eighty independently designed pages, eighty features, or native apps. Staff workflows still need explicit phone usability and capability decisions.

## Counting result

| Scope | Unique workspaces | Desktop targets | Mobile adaptation targets | Status |
| --- | --- | --- | --- | --- |
| Current showcase | 40 | 40 | 40 | Registered in code; browser acceptance pending |
| Recommended additional workspaces | 10 | 10 | 10 | Planning proposal only; not implemented or agreed scope |
| Proposed combined planning baseline | 50 | 50 | 50 | 100 layout targets if these additions are adopted |

**50 is a proposal, not an audited final production total.** Detailed routing can split or merge some of these workspaces. Tab/dialog/error/permission/role variants require their own state inventory and are not added to these totals.

## Recommended new primary workspaces

Proposed IDs are reserved for planning only; they are not registered S41–S50 screens.

| Proposed ID | Workspace | Priority | Why it is absent from the existing count |
| --- | --- | --- | --- |
| P41 | Institution selection and sign-in | P0 | No sign-in workspace in S01–S40; S38 describes identity targets only. |
| P42 | Invitation and account activation | P0 | S21/S37 show existing people and revocation; no invitation acceptance flow. |
| P43 | First-use onboarding | P1 | All forty workspaces start with established sample users and courses. |
| P44 | Profile and account | P1 | S13 covers updates/preferences, not a complete personal profile/account workspace. |
| P45 | Global search and results | P1 | No cross-product search workspace; room finder and event discovery are domain-specific. |
| P46 | Help center and technical support requests | P1 | S34–36 are academic/student services; S40 mentions operational support but has no user-facing technical help workflow. |
| P47 | Learning-content editor | P0 | S04 reads materials and S14 organizes modules; neither is a full content editor. |
| P48 | Course files and learning resources | P0 | S15 has a bounded sample attachment toggle; S07 manages student submission pages, not course assets. |
| P49 | Rubric library and builder | P0 | S17 grades and S18 previews one rubric rule change; neither authors a complete reusable rubric. |
| P50 | Institution initial setup | P0 | S37–40 show ongoing operations/readiness, not a complete initial setup journey. |

[Detailed CSV](09_screen_coverage_gaps.csv) includes intended purpose and device-count assumptions. Priorities are product-planning recommendations, not a claim that institutions have validated this exact navigation.

## Existing workspaces that need more flows, not automatically another screen

| Area | Extend | Coverage to specify before estimating the final product |
| --- | --- | --- |
| Announcements and discussions | S11 | Authoring, draft/schedule/publish, thread navigation and moderation. Current posting is a bounded reply example. |
| Assignment variants | S05/S15/S17/S21 | Group work, section-specific assignments, file types, exceptions and controlled revisions. Do not count each field choice as a page. |
| Learner grades and review requests | S09/S19/S20 | Whole-course detail, correction/regrade request lifecycle and export. Decide whether detail warrants a separate route. |
| Quiz lifecycle | S10/S16 | Full item authoring, timed/autosaved attempts, persisted versions/history and recovery. The current snapshot example is not a production exam engine. |
| Organizations and funding | S29/S30/S31/S33 | Registration, renewal, configurable forms, roster/role changes and request histories; formal finance stays external. |
| Events and bookings | S26/S27/S28/S30/S31/S32 | My bookings/events, discovery/detail navigation, recurrence exceptions, approvals, pass and guest/accessibility paths. Many are variants inside existing workspaces. |
| Institution configuration | S37/S38/S39/S40 | Full role scopes, connector setup/mapping, terms/archives, audit filtering and readiness evidence. P50 is initial setup, not duplicate ongoing administration. |
| Communications | S11/S13 | Decide whether direct messaging is needed; reuse notifications/course context before adding another inbox. No separate chat screen is committed. |

## States omitted from the forty-primary-screen total

These are real design/test work, but should not be counted as new primary screens by default:

- SSO redirect/failure, invitation expiry, session timeout, no-access and wrong-institution states.
- Loading, empty results, unavailable content, validation errors, 404 and recoverable service errors.
- Phone camera/file permission, scan review, upload progress/interruption/resume, offline check-in and sync conflicts.
- Confirmation/undo, unsaved edits, preview, multi-step forms, accessible alternatives and success receipts.
- Student/instructor/TA/admin permissions, narrow/desktop/tablet reflow, light/dark themes and keyboard/assistive-technology behavior.

## What remains deliberately outside the native product count

Native iOS/Android-only screens are not scoped. Financial aid/payroll/clinical records/housing allocation/library circulation are specialist-system boundaries, not missing Whiteboard modules to add automatically. Advising in the showcase remains a later connected workflow, not a replacement degree-rule engine.

## Evidence basis

- [Current exact inventory](08_screen_inventory.md): all forty registered IDs were checked against the CSV.
- [Approved design plan](02_design_plan.md): forty primary workspaces and explicit phone variants.
- [LMS opportunities](../research/01_lms/opportunities.md): complete authoring, content, assessment and permission workflows.
- [Cross-cutting opportunities](../research/04_cross_cutting/opportunities.md): institutional identity/setup, integration, migration and support readiness.
- [Research synthesis](../research/synthesis.md): LMS-first scope and specialist authority boundaries.

No HTML, product scope or production functionality was added by this counting review.
