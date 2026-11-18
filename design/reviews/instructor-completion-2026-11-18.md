# Instructor prototype completion — 18 November 2026

Chosen by Codex under owner delegation. Supersedes the six prototype gaps in the earlier [readiness review](instructor-readiness-2026-11-18.md). Scope: the existing fictional HTML prototype. Production persistence and owner-run acceptance are not completion claims.

| Earlier gap | Delivered prototype behavior |
| --- | --- |
| Student records | W45 roster entries open the selected student's course assessments, accepted attempts, held/released grades and feedback. Previous/next retains student identity separately from the instructor. |
| Gradebook navigation | W51 cells open exact learner/assessment evidence; grade-only/manual/no-upload cases have an explicit record. Student names open the course record. |
| Compact selection | iPad/iPhone gradebook offers a named student picker and record links for every authorized learner. |
| Course and assessment coverage | Both teaching courses open their own builder, assessment list, roster and gradebook. Every represented assessment has exact editor/queue/history navigation. Policy and totals resolve the selected course. Teaching today includes the other course's reviewed/release work. |
| No TA / no allocation | Actual team membership and tasks drive controls. No nonexistent TA revoke or nonexistent-task follow-up; a solo MATH course and unassigned-TA example remain usable directly by the instructor. |
| Teaching-team handover | Task-specific questions, deadlines and learner-question coverage are visible. A clearly fictional takeover scenario removes allocation while retaining prior grading attribution and records transfer history. Real allocation/revocation persistence remains outside this prototype. |

Additional corrections: submitted quiz answers are receipt-bound and acknowledged; older attempts never inherit newer marks/review/release badges or feedback; cross-course and cross-task tuples deny rather than fallback; release confirmation is bound to the modeled assessment outcome; empty totals have honest labels. Grading intent distinguishes included gradebook work, ungraded practice and configuration needed. Actual policy weights and calculation rules are visible.

## Verification

- New teaching-data, staffing and navigation suites exercise course/role boundaries, both courses, all configured cells/learners, compact views, route reload/back, old/new attempts, quiz evidence, empty/foreign/mixed IDs, TA task intersections and instructor takeover. Original PHYS fingerprint remains `fp-dd91aa69`.
- Full standalone suite and final integrated runner: **545 tests pass, zero fail/skipped**.
- Required `check_all`: **18 checks, zero failed/todo**. 5,323 structural renders; 189/189 targets; 55,560 link views / 1,087,709 links; 78 tour steps and 26/26 required hops. Learner/preview leak probes: 18,246; authority renders: 24,588; fictional-content renders: 926. All pass.
- Disposable-copy legacy proof: pass; both legacy commands exit zero.
- Strict build/size: app **844,644 / 921,600 B**, board **826,321 / 921,600 B**, spec **1,011,283 / 1,012,975 B**. Spec unchanged. No size cap was raised.
- Astra independently reviewed actual source and teaching probes. Its reported selection/attempt/quiz gaps were corrected. Its final web/iPhone source-render check confirms the first MATH attempt lacks the newer release badge/marks/comment while the second retains the right result.

All tests/renders above are source/mock/static evidence. Real browser layout, keyboard, VoiceOver, zoom/reflow, device checks and user task sessions remain Not run. The previously recorded local-file restriction was not bypassed and no localhost server was started. No paid service, new dependency, commit, push or deployment.

## How to inspect the result

Open [the app](../final/dist/Whiteboard-Final.html), select Instructor in Preview settings, then My courses. Compare PHYS and MATH, open People → student, use Gradebook → cell, switch learners on iPhone/iPad, inspect the first/revised MATH attempts, and open the exact MATH release preview. Under Grading plan → Staffing examples, compare the solo course, unassigned assistant and takeover example. Role switching is prototype inspection, not sign-in.

## Practical limits

This delivers the named instructor navigation/mapping improvements in the local design. Save, manual-grade editing, invitation, allocation/revocation and other preview-only controls still explicitly say what is modeled; no durable backend writes are claimed. Submitted PDFs are fictional file metadata, not a working document viewer. Optional moderation, institutional grade handoff, production autosave/concurrency and notifications require separately scoped engineering. The broader research roadmap remains a proposal wherever those capabilities are not represented. Formal Phase 6 acceptance remains owner-run and unmarked.
