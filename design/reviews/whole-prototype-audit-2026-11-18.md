# Whole-prototype audit — 18 November 2026

**Verdict:** the current prototype's source checks are clear after additional cross-role record/navigation fixes. It is suitable for the owner's next visual review; this is not completed browser acceptance or a production LMS readiness claim.

Chosen by Codex under owner delegation for the request to cross-check everything and identify further improvements. Scope: all 63 page families, four roles where allowed, three platform tiers, existing state/variant/scenario coverage, generated app/board/spec, and the named instructor/student journeys. Existing dirty work preserved; no new dependency, paid service, commit, push, deployment or browser-policy workaround.

## Findings corrected

| Finding | Correction and regression evidence |
| --- | --- |
| Enrolled student could not enter the second represented course, or open its coursework/result rows | Course entry, coursework and grade rows now select the actual authorized course and assessment. Course-home/module/lesson links use the same record-aware destination. |
| Feedback for the revised MATH attempt named the first attempt's PDF | W23 gets its receipt/files from the learner's released snapshot. Receipt links open that exact record; earlier receipts do not offer another attempt's feedback. |
| Selecting Ben's receipt could leave feedback on default learner Aisha | Receipt selection derives its actual owner; feedback scope and snapshot relationship are checked. Batch release rejects learner/receipt-scoped targets. |
| Same-course explicit URLs could open a different legacy receipt, quiz, draft or rubric | Supported receipt/quiz views honor selection; legacy record-bound views reject incompatible selected records. Presentation tokens retain the declared default assessment. |
| PS4 → Overview → Motion/Quiz inherited PS4's selection | Course-level navigation clears subordinate IDs; record variants and contextual item links select their named item. |
| Issued own receipt became inaccessible through an explicit link after unpublication | Exact, scoped own immutable receipt remains readable, while current unpublished assignment payload and feedback stay withheld. |
| Group receipt was relabeled after a captured member moved groups | Queue and grader resolve the receipt's captured group ID, with an ID fallback if that group has been removed. They never infer receipt identity from current member placement. |
| Released excused/missing outcomes could throw for absent numeric score | Feedback renders the nonnumeric outcome rather than an empty score figure. |
| Quiz receipt could use the most recent attempt's answers | Exact receipt-to-attempt selector exposes only acknowledged submitted answers in scope. No fallback to another attempt. |
| Solo-course staffing links could leave the user in a course the scenario did not affect | Staffing examples select the authorized course whose staffing is represented; solo and unassigned/takeover states stay distinct. |
| Optional practice offered a hand-in link to an unrelated draft flow | Practice explicitly requires no hand-in. Other unmodeled hand-in flows show a disabled action with a reason. |

## Audit coverage and limits

| Area | Source evidence |
| --- | --- |
| Access, roles, account/profile and utility pages | Existing state/tier suites, role-safe navigation, revoked-enrollment and failure branches. Sign-in remains a mock role switch. |
| Courses, publication, modules, lessons, coursework | Existing publication leak tests plus new cross-course entry and contextual two-hop record checks. |
| Assignments, receipts, quiz rules/attempts and results | Own/foreign/unpublished scope; exact attempts, numeric/nonnumeric outcomes, released/held separation and source-render failure cases. |
| Calendars | Month/Week/Schedule, enrolled course isolation, private events, deadline/TA expiry agreement, source reducer behavior and selected source-item links. |
| Announcements, discussions and groups | Existing role/publication/scenario suites; new captured group-identity regression. Real sending/downloads/group writes remain modeled only. |
| Authoring, roster, allowances, rubric and staff tools | Existing page contract and task-scope checks; incompatible selection denial and record-aware student/team paths. Authoring saves remain previews. |
| Grading, policy, release, correction, attendance and team ownership | Existing immutable/fingerprint/TA authority gates plus instructor completion suites. No attendance record is treated as absence. Unmodeled correction/moderation/persistence remains explicit. |
| Optional pages | Existing enabled/off states, role and empty-data checks. Optional feature layout is not evidence of a real service. |
| Shells and accessibility source | Heading ranks, IDs/labels, role-safe links, modal isolation/focus rules, source contrast checks, platform tiers and reduced-motion CSS. Actual assistive-technology behavior is not established. |
| Build, references and provenance | Offline/self-contained checks, file sizes, locked inputs, required journeys, fictional-only content and source layout/line budgets. |

An additional sweep renders **over 5,500 explicit-course combinations across all 63 page families**, allowed roles, states/variants and three tiers. The independent Astra audit reproduced and then verified closure of its six record/snapshot findings. The student audit independently supplied targeted fixes and tests. These are source renders, not browser sessions or user-study observations.

## Final verification

- Standalone suite: **558 tests, 558 pass, zero fail/skipped**. Includes `whole-context.test.mjs` and `whole-student.test.mjs` in the combined runner.
- Full integration proof: **18 checks, zero failed/todo**, including **558/558 tests**. 5,323 structural renders; **189/189 page×platform targets**; 55,560 link views / 1,089,509 links; 78 tour steps and 26/26 required hops. Leak probes: 18,246; authority renders: 24,588; fictional-content renders: 926. All pass.
- Legacy proof: pass; old commands run only in a disposable copy.
- Strict sizes: app **855,552 / 921,600 B**; board **837,229 / 921,600 B**; spec **1,011,283 / 1,012,975 B**. Spec unchanged; caps unchanged.
- Free cached Impeccable static detect: exit **2 for findings**, four findings identical by rule/severity/output to the prior baseline: two calendar-grid stripe advisories and two unchanged spec warnings. No new findings. See [raw output](whole-prototype-lint-2026-11-18.json), [existing static-review rationale](impeccable-review-2026-11-17.md) and [calendar rationale](calendar-review-2026-11-17.md). Static scanning cannot review runtime layout.

## What remains before calling the whole experience accepted

The [owner acceptance checklist](../final/acceptance/checklist.md) remains **Not run**: real rendering, narrow reflow, zoom, keyboard/focus, VoiceOver, device and task usability checks. The prior local-file restriction was respected; no localhost, alternate browser/data URL or hosting bypass was attempted. No acceptance row was marked passed.

The product remains fictional local design data. Persistent saves, real PDF viewing/uploading, authentication/authorization services, notifications, grade corrections/moderation, SIS acknowledgment and deployment require separately scoped engineering. A passing source gate does not imply those services exist or that every option in the broad research roadmap is implemented.

Open [the rebuilt app](../final/dist/Whiteboard-Final.html) for owner review. Compare student and instructor course entry, both courses' coursework/grades, snapshot-bound feedback and receipts, compact learner selection, calendar source links, group receipt identity and staffing examples.
