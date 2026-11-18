# Instructor readiness check — 18 November 2026

**Verdict: the research and instructor mapping are delivered; the complete instructor workflow is not finished.** This pass audits the current local prototype. No UI/product source, fixture, permissions, dependency or route changes were made. Review prioritization is chosen by Codex under owner delegation.

Root inspected the current source, repeated the documented staffing probes and ran project checks. A bounded independent Astra review inspected actual source and reproduced the same capability gaps. These are source/fixture findings, not real-browser usability results or an institutional approval.

## Remaining work, in priority order

| Priority | Finding and evidence | Required improvement |
| --- | --- | --- |
| P0 | [W45 roster](../final/pages/seg5-authoring/W45.js#L49) lists names/roles without a learner-record destination. | Open a selected student's authorized course record with assessment, attempt, grade and feedback links. |
| P0 | [W51 cell routing](../final/pages/seg6-grading/W51.js#L46) links only the anchored learner/assessment; [compact selection](../final/pages/seg6-grading/W51.js#L67) fixes one learner without a picker. | Connect each supported cell to the exact record or an honest no-work state; allow selecting every authorized learner on compact screens. |
| P0 | [W18 assessment routes](../final/pages/seg2-course/W18.js#L46) represent three editors for eight PHYS assessments. PS4 has the dedicated queue/release flow; Motion has a receipt-grader path. [Course entry](../final/pages/seg2-course/W06.js#L32) does not provide equal coverage for the second teaching course; its gradebook selector is null. | Generalize selected course/assessment/attempt context and complete representative workflows across two courses. Explain each assessment's grading intent rather than assuming every assessment needs a grade column. Eight assessments versus six grade items alone is not proof of missing grades. |
| P0 | [W45 actions](../final/pages/seg5-authoring/W45.js#L66) retain the anchored TA's revoke/change controls when no TA task/member exists. [W57 compact handoff](../final/pages/seg6-grading/W57.js#L114) offers task follow-up beside an empty plan. | Distinguish no TA, enrolled-but-unassigned TA, delayed roster and actual active/expired tasks. Never offer an action on a nonexistent person/task. |
| P1 | [W57 reassignment](../final/pages/seg6-grading/W57.js#L83) and W45 access changes explicitly remain preview-only. | Model optional scoped allocation, instructor review/takeover and handover history. Real authorization, saved revisions, stale-write rejection and persistence belong to separately authorized backend engineering. |
| Acceptance | [Owner checklist](../final/acceptance/checklist.md) remains Not run. Existing local-file browser restriction remains in force. | Owner-assisted visual, keyboard, VoiceOver, zoom/reflow and platform review. Do not infer usability from source renders or bypass the browser restriction. |

## What is verified

- The existing source-level guardrails distinguish held evaluations from released feedback, prohibit TA release/preview, protect immutable receipt/release snapshots and filter learner publication/access scope. The source gates exercise these rules; no production authorization claim follows.
- Repeating the [staffing comparison](../../docs/plans/instructor-local-audit-2026-11-17.md) with all allocations removed, then with TA membership removed as well, preserves complete serialized instructor receipt/progress/release-ready/gradebook projections. **27 renders per variant; 54 total; zero structural problems.** This establishes a useful solo-workflow foundation, not complete no-TA presentation.
- The existing app, board and spec rebuild byte-identically to the previous milestone. No visual improvements were implemented in this audit.

## Verification run on 18 November

| Check | Result |
| --- | --- |
| `node --test design/final/tools/*.test.mjs` | 521 tests, 521 pass, zero fail/skipped |
| `node design/final/tools/check_all.mjs` | Pass: 18 checks, zero failed/todo; 5,124 structural renders and 189/189 targets; 41,580 link views / 804,470 links; 78 tour steps and 26/26 required hops |
| `bash design/final/tools/legacy_check.sh` | Pass; both legacy commands exit zero in disposable copy only |
| `node design/final/build.mjs && node design/final/tools/check_size.mjs` | Pass; all three artifacts within budget |
| Staffing projection/render probe | Pass; both variants, 54 renders total |
| Browser/device/assistive technology acceptance | Not run; remains owner-run |

Artifact bytes: app **797,112 / 921,600**, board **779,007 / 921,600**, spec **1,011,283 / 1,012,975**. Only 1,692 bytes of spec budget remain. Existing lint advisories were not independently rerun or visually resolved by this audit.

## Recommended next step

Use the existing [instructor plan](../../docs/plans/instructor-workspace-plan-2026-11-17.md) and [28-capability map](../../docs/plans/instructor-capability-map-2026-11-17.csv). Complete R0 selected-record/authority contracts, then R1 student records, exact coursework/grade-cell navigation, compact selection and honest solo states. R2 optional TA delegation follows that foundation. R3 exception/calculation coverage, R4 observed human review and R5 separately authorized engineering remain open.

Passing all current tests means the represented sample obeys those checks. It does not mean every planned instructor capability exists, every student record is reachable, or the application is ready for real teaching.
