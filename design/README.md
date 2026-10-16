# Final page design workspace

Read `../HANDOFF.md` first. This folder starts the new design phase; it does not mark the existing concept screens as final designs.

- `START_PROMPT.md`: paste into Claude after opening/attaching the project.
- `screen_tracker.csv`: canonical progress table, exactly one row per destination/platform (100 rows). Screen briefs and routes remain in `../showcase/app_map/` JSON.
- `state_checklist.md`: common acceptance and the eight expanded-flow areas to cover without inventing screen counts.
- `decisions.md`: design choices, constraints and questions that remain open.
- `SESSION_NOTES.md`: current work, next batch and handoff protocol.
- `handoff_snapshot.json`: local source hashes, counts, Git pointer and check results at handoff.
- `system/`: proposed shared tokens and components (batch 01; not accepted).
- `batch01/`: editable S01–S09 web + planned-iOS design sources. `build.mjs` → `preview/batch01_student_journey.html`; `tools/check_batch01.mjs` → `preview/batch01_verification.json` (static checks only).
- `batch02/`: editable P41–P44 + S14–S16 + P47–P49 sources (reuses batch01 kit/spec/controller). `batches.mjs` registers batches; `node design/build.mjs [batch]` → `preview/batch02_access_and_authoring.html`; `node design/tools/check_batch.mjs [batch]` → `preview/batch02_verification.json` (static checks only).
- `batch03/`: editable S10–S13 (quiz attempt, course conversation, calendar, updates) + S17–S20 (grading, rubric-change preview, gradebook, release) sources. `node design/build.mjs batch03` → `preview/batch03_grading_and_course_life.html`; `node design/tools/check_batch.mjs batch03` → `preview/batch03_verification.json` (static checks only). Student→staff role handoffs are marked `data-handoff="<id>"` (explained in words, never linked) and the checker accepts them for handoff routes.
- `batch04/`: editable S21–S23 (people and permissions, course copy, insights and attendance) + S24–S25 (academic timetable, schedule-change review) sources, plus a scheduling-office shell in `kit4.js`. `node design/build.mjs batch04` → `preview/batch04_course_operations.html`; `node design/tools/check_batch.mjs batch04` → `preview/batch04_verification.json` (static checks only).
- `batch05/`: editable S26–S27 (find a room, reservation request) + S28–S33 (event discovery, organization home, event composer, event approval, check-in, officer handoff) sources, plus campus-operations and organization-officer shells in `kit5.js`. `node design/build.mjs batch05` → `preview/batch05_spaces_and_campus_life.html`; `node design/tools/check_batch.mjs batch05` → `preview/batch05_verification.json` (static checks only).
- `batch06/`: editable S34–S36 (get support, referral, follow-through) + P50, S37–S40 (institution setup, people and records, connections, migration rehearsal, trust and AI controls) + P45–P46 (search, technical help) sources, plus support-desk and institution-administration shells in `kit6.js`. `node design/build.mjs batch06` → `preview/batch06_support_institution_and_tools.html`; `node design/tools/check_batch.mjs batch06` → `preview/batch06_verification.json` (static checks only). All 100 tracker targets are now drafted; none accepted.
- `tools/build_review.mjs` → `preview/index.html`: the owner review packet. It links all six previews, flags layout-risk screens, lists D1–D58 and every open question from `decisions.md`, and lets the reviewer mark each decision Accept, Adjust or Reject and export Markdown. Drafts stay in that browser only. A full `node design/build.mjs` also rebuilds it.

## Tracker rules

Keep `screen_id` stable; `platform` is `web` or `ios`. `scope` records concept versus proposed, not completion. `design_status`: `Not started`, `In progress`, `Ready for review`, `Changes requested`, `Accepted`. Only mark `Accepted` with the owner's actual review recorded in `notes`—an automated check alone does not accept a design.

Track `states_status` separately: `Not specified`, `Specified`, `Implemented`, `Reviewed`. Record variants and role boundaries in `state_notes` or link a brief. `browser_status` starts `Not run`; use `Passed`, `Issues found` or `Blocked` only with evidence. For iOS, separately record `native_device_status`; HTML/browser previews cannot establish device acceptance. Update paths in `design_source` and `preview_path` plus `verification_evidence` as work is created. Do not invent deliverable paths in advance or change every row to Done after a global restyle.

The CSV's priority comes from the coverage review for P41–P50; original S screens are marked `Core flow` rather than invented research priority scores. `desktop_recommended` is a phone-scope warning, not permission to omit the target. Suggested order is in HANDOFF.md; batch boundaries can change with recorded rationale.

A batch is reviewable when its screens form a coherent flow, alternate states are specified, sample data and permissions agree across screens, sources are saved and actual checks are reported. Keep standalone design previews self-contained when practical. Do not make backend/framework/native implementation decisions by accident.
