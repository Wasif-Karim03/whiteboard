# Student/instructor/TA workspace audit and fixes

Chosen by Codex under owner delegation, 17 November 2026. The owner asked for more appropriate role-specific experiences and an audit of whether both sides match. See `role-workspaces-plan-2026-11-17.md` and the bounded queue implementation in `role-queue-notes-2026-11-17.md`.

## What each role now opens

| Area | Student | Instructor | TA |
| --- | --- | --- | --- |
| Home | Today: own next task, due/status, submitted work and released feedback | Teaching today: represented PS4 received/reviewed counts, release readiness and authoring/assessment/gradebook links | My grading tasks: active allocations, exact deadline/access cutoff, supported queue or authorized receipt |
| Course card | Represented learning home W14 | Represented builder W35 | Read-only represented builder W35 |
| Assessment list | Published coursework with own status and submission/result route | Published and unpublished planning, exact W40/W41 editors, class counts and matching grading/release actions | Active allocated assessments, grading deadline and scoped counts; supported queue/receipt only |
| Published preview | Normal learning view | Explicit published-course preview, instructor identity retained, return to builder | Explicit content preview, TA identity retained; expiry only when there is actual allocation history |
| Results | Released snapshots and released-only totals | Separately labelled staff-including-held and released totals; exact release preview/confirmation workflow | Allocated scope only; no release or release preview |

Shared branding, calendar structure and canonical navigation identities remain. Role labels, entry points and tasks differ; a cosmetic theme swap was not needed. Navigation links never change identity. The sparse fictional prototype still has one represented PS4 teaching-home workflow and record-true links; no unsupported course pages or backend are implied.

## Confirmed mismatches corrected

1. W35's “Preview as learner” opened staff progress/release controls on W14. It now says Preview published course; W14 staff content explicitly retains identity, omits the grading dashboard and returns to authoring.
2. W19's Motion grading link opened PS4. Staff links now match the assessment; unsupported assignment queues are not fabricated.
3. W48 mixed Motion group receipts under PS4 title/counts. PS4 queue rows/counts stay together; Motion has a separately labelled, independently authorized section. The group grader journey remains reachable.
4. W14/W18 could expose default PS4 queue links while a TA only had another active task. TA action resolution now verifies the actual assessment's task/scope and can open its supported receipt instead.
5. W19/W53 omitted PS4's task-specific expiry or offered its queue when Motion access remained active. Shared task-expiry helpers use PS4's actual cutoff; course-wide expiry is distinct. The explicitly limited W53 TA handoff/token contract remains.
6. TA Home claimed group grading was undrawn although Assigned grading could open its receipt. Both now share the same authorized queue-or-receipt resolver.
7. Published preview claimed access expired for a TA with no allocation history. It no longer invents expiry.
8. A staff member's own W32 calendar was labelled Instructor preview. The misleading badge is removed.

## Data agreements checked

- The same quiz's close time is used in student coursework, instructor assessment management, builder and calendar. A mutation regression ensures a stale assessment-level due field cannot override the canonical quiz close.
- Teaching Home, the matching assessment row and PS4 queue use the same received/reviewed selector values. Release readiness comes from actual included release candidates; zero ready candidates exposes release history rather than claiming ready work.
- The student's released total equals the instructor's released-total column. A different staff total including held results is intentional and separately labelled. Reviewed/graded does not mean released.
- Instructor unpublished planning remains unavailable to students/TAs. Roles and enrollment are verified in `sel.courseAssessments`. Private calendar visibility and immutable receipt/release rules remain covered by the full existing gates.
- Scope tests cover removed/expired PS4 allocation while Motion remains active, exact cutoff text, missing allocation history, supported group receipts and no TA release links.

## Actual proof

- `node --test design/final/tools/*.test.mjs`: **521 tests, 521 pass, 0 fail, 0 skipped**.
- `node design/final/tools/check_all.mjs`: **18 checks, 0 failed, 0 todo**. 5,124 structural renders; 189/189 page/platform targets; 41,580 link views / 804,470 links; 78 steps across 12 tours and 26/26 required hops; 13,854 leak probes; 18,387 authority renders; 924 fictional-content renders. Final report: `design/final/dist/verification.json`.
- `bash design/final/tools/legacy_check.sh`: exit 0; both legacy commands exit 0 in a disposable copy only.
- Build/strict size proof: app **797112/921600 bytes**, board **779007/921600 bytes**, static spec **1011283/1012975 bytes**.
- New `role-workspaces.test.mjs` (9) and `role-queue.test.mjs` (4) are imported by the combined runner. Astra independently inspected planning and integration, confirmed final corrections and ran the 13 focused tests. Terra owned the bounded W19/W48/W53 queue/expiry changes; root integrated roles, selectors, navigation, entry pages and cross-role tests.
- Local cached Impeccable: exit 2 for findings, recorded in `role-workspaces-lint-2026-11-17.json`. No new findings: two unchanged spec warnings and the two advisory calendar-hour-grid findings already dismissed with structural rationale in the calendar review. No dependency installation, paid service or hosted AI review.

Final hashes:

| Artifact | SHA-256 |
| --- | --- |
| Whiteboard-Final.html | 18ef2204311899d9fd19ea1883f636d37f3430e0ecf3a6d20010adb22d1e61ab |
| Whiteboard-Final-Board.html | fdd53b4093ab7462e77acaa078326e221ffabb67539ea8063dc42c6735fc0ceb |
| Whiteboard-Final-Spec.html | 9b2275f6df86261f706145c2236648348958508dfcb2e3b2f8ec311b15c0bc9d |

## Limits and next review

This is a source/data/route audit with source/mock tests. It does not establish production authorization or real browser usability. Updated rendering, reflow, keyboard, screen-reader and device checks remain unrun. The existing local-file browser restriction was respected; no alternate hosting or permission bypass was used. All formal Phase 6 acceptance rows remain Not run.

Owner review: open the HTML, use Preview settings to compare Student/Instructor/TA on Today and Courses, then follow the role-specific course entry. Compare Coursework/Assessments, the published preview, PS4 queue and the separately labelled Motion receipt section. Instructors should see held work without implying it is already available to students.
