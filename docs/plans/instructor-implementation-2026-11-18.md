# Instructor prototype implementation — 18 November 2026

Chosen by Codex under owner delegation after the owner requested completion of the six gaps in the readiness review. Scope is the existing fictional local HTML prototype, not production backend/native engineering or owner-only acceptance. Uses the existing frontend-design and premium-web-design guidance: quiet existing surfaces, record-first navigation, progressive detail, clear labels and existing typography/tokens. No visual-theme rewrite, dependency or paid service.

## Contract and stages

1. Preserve the existing Wxx page families, canonical role identity, legacy anchors/journeys and all size budgets. Extend their links with optional course/assessment/learner/receipt selection; never put role or identity overrides into record links.
2. Add pure authorized projections for course policy, learner records, accepted quiz evidence, team and learner-question allocation coverage. Keep default PHYS results/fingerprint stable; add an independent MATH course example with two accepted attempts and a manual held result.
3. Connect course → assessment → queue → exact attempt and roster/gradebook → selected learner → grade evidence. Add compact learner navigation, explicit grading intent, and correct no-TA/no-allocation presentation.
4. Model instructor takeover and a second-course release through explicitly fictional scenarios. Preserve original attribution and immutable releases; no button claims an actual saved staff change.
5. Verify new paths, error/empty/permission states, earlier attempts, TA intersections, legacy journeys, source gates and size limits. Browser acceptance remains separately owner-run under the existing restriction.

Root owns selection/routing/page integration and verification. Bounded workers own multi-course grading projections and W45/W57 student/team presentation. Astra reviews selection, attempt and release risks independently. No recursive delegation.

## Record selection contract

Optional link fields are `tc` (course), `ta` (assessment), `tl` (learner), and `tr` (receipt). Context-only queries inherit the current role, platform and scenario. Complete share/reload hashes retain the selection. All selectors re-check enrollment, course/item/receipt consistency, learner membership and current per-task TA scope; explicitly invalid or empty IDs deny instead of falling back to PS4/Aisha. Course changes clear subordinate IDs. True global views clear course selection. Contextual calendar controls use the same verified course and reset their cursor when selection changes.

Legacy page/state/variant/scenario links remain valid. This is an explicit record-selection extension to the fixed route contract, not a new destination or identity-switching mechanism. Record-specific presentation variants cannot silently override a conflicting explicit selection.

## Acceptance delivered in source

- Both fictional teaching courses have course, coursework, people and gradebook entry paths.
- Every represented instructor assessment opens its exact editor, queue and release/history view. Unsupported release outcomes remain disabled with a reason.
- Every configured gradebook cell opens the selected learner's accepted work or an explicit manual/no-upload/no-grade record.
- Each enrolled learner is selectable on compact gradebook views; roster records show course work, accepted attempts, held/released values and feedback.
- Earlier attempts do not inherit current-attempt marks, reviewed labels or release feedback. Quiz evidence is receipt-bound and acknowledged, never pending answers or another attempt.
- No-TA and unassigned-TA states have no phantom revoke/follow-up controls. Allocation coverage is by learner-question pairs. Takeover preserves prior draft/reviewer attribution and does not release anything.
- MATH release preview/outcome and student totals stay in MATH; PHYS's existing arithmetic and fingerprint remain unchanged. TA release and release preview remain prohibited.

The completion review records exact proof and remaining limits: [instructor-completion-2026-11-18.md](../../design/reviews/instructor-completion-2026-11-18.md).
