# Resume notes

## Handoff checkpoint — 15 October 2026

Current phase: research, corrected showcase and navigation-map work packaged for Claude. Detailed final page design has not started in this phase. All 100 tracker rows intentionally start `Not started`, regardless of existing concept/mockup coverage.

Next task: read the handoff, inspect the existing visual system and map briefs, then propose shared components/tokens and build the first coherent S01–S09 web/iPhone design batch. Save preview/source paths as work is created; review the batch before spreading the visual direction across the whole app.

Preserve: original showcase source/behavior, both archives, research evidence, stable IDs, proposed labels and uncommitted local work. Do not equate the legacy filename Pellwin with a second current product. Do not infer native build or production service from the map.

Evidence/limits: see `handoff_snapshot.json` for this checkpoint's actual local checks. Browser visual/keyboard/accessibility acceptance and native/device checks remain unverified. No public deployment, push or paid service was created.

## At the end of each design batch

Replace or append a concise checkpoint with: date; batch and screen IDs/platforms; editable source/preview paths; design decisions; tests/reviews actually performed; unresolved defects; owner feedback; exact next task. Update the CSV in the same batch. Keep acceptance separate from implementation and do not paste private conversations or logs.

## Checkpoint — 15 October 2026 · Batch 01 (S01–S09 web + planned iOS) ready for review

- **Batch:** shared design system + student course → assignment → scan/upload → review → receipt → feedback journey. 18 tracker rows (S01–S09 × web/ios) set to `Ready for review`, states `Specified`, browser `Not run`, iOS device `Not run`.
- **Sources:** `design/system/tokens.css`, `design/system/components.css`, `design/batch01/{kit,screens_a,screens_b,spec,preview}.js`, `design/batch01/preview.css`, build `design/build.mjs`, checks `design/tools/{check_batch01,contrast}.mjs`.
- **Preview:** `design/preview/batch01_student_journey.html` (offline, self-contained; deep links like `#S07:incomplete`). Theme, desktop/narrow web and larger-text controls.
- **Decisions:** D1–D11 in `decisions.md` (all proposed).
- **Checks actually run:** `node design/build.mjs`; `node design/tools/check_batch01.mjs` passed — 9 screens, 44 states, 88 renders, all 40 screens.json states covered, 20 internal routes each have a control, 12 later-batch routes referenced, 63 contrast pairs pass (static math), unique IDs/labels/ARIA refs, no network assets → `design/preview/batch01_verification.json`. A negative test (injected bad state target / unlabelled select) was detected. `node --check` on all batch JS. `python3 showcase/tools/check_html.py` still passes (showcase untouched).
- **Not run:** no browser rendering, visual, keyboard, focus, screen-reader, zoom/overflow, console or print check (recorded local-file restriction respected; no localhost/alternate route). Layout was reasoned from CSS, not seen. No iOS simulator/device. No owner review.
- **Known risks to inspect first:** desktop frame at ~980–1200 px (S09 three-pane, S07 page grid), narrow web 390 px, larger-text reflow in the iPhone frames, dark mode on illustrative page thumbnails, controller toasts/state switching.
- **Preserved:** showcase sources/generated HTML, archives, atlas JSON/HTML, research, all non-batch tracker rows.

**Exact next task:** owner opens the preview (or authorizes a permitted browser environment) and reviews D1–D11 and S01–S09; record feedback in tracker `notes`. Apply requested changes. Only after direction is accepted, start Batch 02: P41–P44, P47–P49, S14–S16 (access/onboarding and authoring), reusing `design/system` and adding `design/batch02/` + a build target.

## Checkpoint — 16 October 2026 · Batch 02 (P41–P44, S14–S16, P47–P49 web + planned iOS) ready for review

- **Batch:** arrival (institution sign-in, invitation, first use, account) + instructor authoring (course builder, assignment editor, quiz builder, lesson editor, course files, rubrics). Covers the `arrival`, `content`, `assessment` and `quiz` journeys (S10 learner quiz remains a later batch). 20 tracker rows → `Ready for review`, states `Specified`, browser `Not run`, iOS device `Not run`.
- **Started before owner review of Batch 01** on the user’s “continue”; inherits D1–D11 unaccepted.
- **Sources:** `design/batch02/{kit2,screens_access,screens_teach_a,screens_teach_b}.js`; additions appended to `design/system/components.css` (marked “BATCH 02 ADDITIONS”); registry `design/batches.mjs`; loader `design/tools/load.mjs`; checker `design/tools/check_batch.mjs` (old `check_batch01.mjs` now delegates to it). Shared-kit edits recorded in decisions D24.
- **Preview:** `design/preview/batch02_access_and_authoring.html` (offline; deep links like `#S15:invalid`). Batch 01 page rebuilt; it now links to P44 in Batch 02.
- **Decisions:** D12–D24 in `decisions.md` (all proposed).
- **Checks actually run (16 Oct):** `node design/build.mjs` (both pages); `node design/tools/check_batch.mjs` passed for both — Batch 02: 10 screens, 51 states (50 map + 1 added), 102 renders, 26 routes with controls (incl. cross-batch), 12 routes to later batches named; Batch 01: 44 states, 88 renders, 21 routes with controls. 70 contrast pairs incl. 7 literal colours (min text 5.05:1). Negative test on a scratch copy caught an unknown state target and a missing focus target. Render scan found no `undefined`/`NaN` leaks. `python3 showcase/tools/check_html.py` still passes.
- **Not run:** no browser rendering, visual, keyboard, focus, screen-reader, zoom, console or print check (restriction respected). Layout reasoned only.
- **Known risks to inspect first:** three-pane authoring (S14, S16, P47–P49) — rail drops below the editor under ~1360 px app width, so the 980 px desktop frame shows two columns; P48 six-column table inside the centre column (scrolls horizontally); P47 canvas block tags in the left gutter; iOS text-labelled nav-bar buttons (“Skip”, “Validate”); access pages at narrow width.
- **Exact next task:** owner reviews Batch 01 and Batch 02 previews and D1–D24 (or authorizes a permitted browser environment); record feedback in tracker `notes`; apply changes; rebuild and rerun `node design/tools/check_batch.mjs`. Proposed Batch 03 after acceptance: grading and release S17–S20 + S10–S13 (quiz attempt, discussion, calendar, updates), which closes the dashed handoffs in Batches 01–02.

## Checkpoint — 16 October 2026 · Batch 03 (S10–S13, S17–S20 web + planned iOS) ready for review

- **Batch:** learner course life (quiz attempt, course conversation, calendar, updates & preferences) + grading and release (grading workspace, rubric-change preview, gradebook, release and records). Covers the `quiz`, `grading` and `preferences` journeys and closes the S08→S17→S20→S09 loop of `submission`. 16 tracker rows → `Ready for review`, states `Specified`, browser `Not run`, iOS device `Not run`.
- **Started before owner review of Batches 01–02** on the user’s “continue”; inherits D1–D24 unaccepted.
- **Sources:** `design/batch03/{kit3,screens_learn,screens_grade}.js`; CSS appended to `design/system/components.css` (“BATCH 03 ADDITIONS”); registry entry in `design/batches.mjs`. Shared edits: student nav/tabs/course links and staff Grading/Calendar now open Batch 03 pages (`batch01/kit.js`, `batch02/kit2.js`); `K.webStaff` accepts `who`; S08 and S16 gained `data-handoff` explanations; checker accepts `data-handoff` for handoff routes (D33).
- **Preview:** `design/preview/batch03_grading_and_course_life.html` (offline; deep links like `#S20:stale`). Batch 01–02 pages rebuilt.
- **Scenario:** PS4 closed Sun Oct 18 → grading Mon Oct 19 → release R1 Tue Oct 20 4:10 pm → Aisha Q3 regrade 7 → 8 Thu Oct 22 (R2), matching S09. Aisha’s Q3 is a manual score, so the S18 rule change leaves it at 7.
- **Decisions:** D25–D33 in `decisions.md` (all proposed).
- **Checks actually run (16 Oct):** `node design/build.mjs` (3 pages); `node design/tools/check_batch.mjs` passed for all three — Batch 03: 8 screens, 40 states (all map states, none added), 80 renders, 14 routes with controls, 5 routes to later batches named; Batch 01: 27 routes with controls (was 21); Batch 02: 30 (was 26). 70 contrast pairs (min text 5.05:1; new literal border colours are non-text). Render scan: no `undefined`/`NaN`/`null` leaks in any batch. Negative test on a scratch copy caught a removed handoff note, unnamed icon buttons and an unknown cross-batch state. `python3 showcase/tools/check_html.py` still passes. Tracker rewrite kept CRLF; exactly 54 rows changed (16 new + 38 recheck notes).
- **Not run:** no browser rendering, visual, keyboard, focus, screen-reader, zoom, console or print check (restriction respected). Layout reasoned only.
- **Known risks to inspect first:** S17 three panes below ~1240 px (roster becomes a scrolling picker row); S19 seven-column table (horizontal scroll); S12 week grid collapses to a single column under 1000 px; S10 radio fieldsets inside iOS frames use web card styling; disabled quiz radios in the read-only answer snapshot may be low-contrast.
- **Exact next task:** owner reviews Batches 01–03 and D1–D33 (or authorizes a permitted browser environment); record feedback in tracker `notes`; apply changes; rebuild; rerun `node design/tools/check_batch.mjs`. Proposed Batch 04: course operations S21–S25 (people and permissions incl. allowances, course copy and rollover, insights and attendance, academic timetable, schedule-change review) — these also close the S21/S22 notes left in Batches 02–03.

## Checkpoint — 16 October 2026 · Batch 04 (S21–S25 web + planned iOS) ready for review

- **Batch:** course operations (people and course permissions with allowances, course copy and rollover, insights and attendance) + academic scheduling (timetable, schedule-change review). Covers the `allowance` and `schedule` journeys and the S22 part of `implementation`. 10 tracker rows → `Ready for review`, states `Specified`, browser `Not run`, iOS device `Not run`.
- **Started before owner review of Batches 01–03** on the user’s “continue”; inherits D1–D33 unaccepted.
- **Sources:** `design/batch04/{kit4,screens_course,screens_sched}.js`; CSS appended to `design/system/components.css` (“BATCH 04 ADDITIONS”); registry entry in `design/batches.mjs`. Shared edits (D41): `batch02/kit2.js` staff tools (People/Next term/Insights), `batch02/screens_teach_a.js` (S14 links), `batch02/screens_access.js` (P41/P43 scheduling role → S24), `batch03/screens_grade.js` (S17 excuse/extension → S21), `build.mjs` nav table.
- **Preview:** `design/preview/batch04_course_operations.html` (offline; deep links like `#S25:approved`). Batch 01–03 pages rebuilt.
- **Scenarios:** Maya Chen TA access ends Sun Oct 18 (matches S17); Ravi Shah grader revoked Thu Oct 15; Jordan Ellis invited Thu Oct 15; Tomás Rivera PS4 extension Mon Oct 19; PHYS 110 Fall 2026 → Spring 2027 (+21 weeks); MATH 220 Keene 212 → 105 for Oct 15–29, approved Wed Oct 14 4:05 pm, applied in source Thu Oct 15 7:30 am (matches S12).
- **Decisions:** D34–D41 in `decisions.md` (all proposed). One added design state: S21 “Revoke review”.
- **Checks actually run (16 Oct):** `node design/build.mjs` (4 pages); `node design/tools/check_batch.mjs` passed for all four — Batch 04: 5 screens, 26 states (25 map + 1 added), 52 renders, 8 routes with controls, 3 routes to later batches referenced (S26, S35, S37); Batch 02 now 34 routes with controls (was 30). 70 contrast pairs (min text 5.05:1). Render scan: no `undefined`/`NaN`/`null` leaks in any batch. Negative test on a scratch copy caught a duplicate id and an unknown state target. Tracker rewrite kept CRLF; 10 rows updated + 54 recheck notes appended.
- **Not run:** no browser rendering, visual, keyboard, focus, screen-reader, zoom, console or print check (restriction respected). Layout reasoned only.
- **Known risks to inspect first:** S22 three columns (edit3) below ~1360 px; S24 five-day grid collapses to one column under 1100 px; S21 five-column roster tables inside the main column; S25 compare cards + rail at 980 px; native checkbox/radio styling in dark mode.
- **Exact next task:** owner reviews Batches 01–04 and D1–D41 (or authorizes a permitted browser environment); record feedback in tracker `notes`; apply changes; rebuild; rerun `node design/tools/check_batch.mjs`. Proposed Batch 05: campus spaces and events S26–S33 (find a room, booking, events, officer flows), which closes the S26 notes left in S24.

## Checkpoint — 16 October 2026 · Batch 05 (S26–S33 web + planned iOS) ready for review

- Scope: S26 Find a room, S27 Reservation request, S28 Campus event discovery, S29 Organization home, S30 Collaborative event composer, S31 Event approval workspace, S32 Event attendance, S33 Organization transition. 41 states (40 map states plus the added S32 “Student pass”). Decisions D42–D49.
- Sources: `design/batch05/kit5.js` (statuses, data, org-nav group, campus-operations shell, pass code), `screens_spaces.js` (S26–S27), `screens_life.js` (S28–S30), `screens_events.js` (S31–S33); CSS appended to `system/components.css` under “BATCH 05 ADDITIONS”.
- Shared edits: student nav Campus group plus a fifth iOS Campus tab (D42); `K.web` gets `who`/`groups`; S01, S12, S13 and S24 links now open S26/S28; S12 gains the “Room request (requester)” state for route S12→S27.
- Verification: `node design/build.mjs` builds 5 pages; `node design/tools/check_batch.mjs` passes for all five (static checks only). A render scan for undefined/NaN/[object] values is clean. Not rendered in a browser (restriction respected).
- Layout risks to inspect: the S31 three dependency columns (stack under 1000 px), S26 split form + room cards, the S32 iOS scanner (raw iOS frame with a custom tab bar), the five-tab iOS bar in Batches 01–03, the S28 feed + detail split.
- Tracker: 80 rows Ready for review / Specified / browser Not run; 20 Not started (S34–S40, P45, P46, P50).

## Checkpoint — 16 October 2026 · Batch 06 (S34–S40, P45, P46, P50 web + planned iOS) ready for review — all 100 targets drafted

- Scope: S34 Get support, S35 Advising context and referral, S36 Support follow-through, P50 Institution initial setup, S37 People/access/records, S38 Connections & reconciliation, S39 Migration rehearsal, S40 Trust & AI controls, P45 Global search, P46 Help and technical requests. 51 design states (50 map + 1 added: S36 “Student view”). Covers the `support`, `implementation` and `search-help` journeys.
- Started before owner review of Batches 01–05 on the user’s “continue”; inherits D1–D49 unaccepted. Decisions D50–D58 (proposed).
- Sources: `design/batch06/kit6.js` (statuses, D6 data, `webDesk`/`webSupport`/`webAdmin` shells, boundary, steps), `screens_support.js` (S34–S36), `screens_admin.js` (P50, S37–S40), `screens_tools.js` (P45–P46). CSS appended to `system/components.css` (“BATCH 06 ADDITIONS”). Registry entry in `batches.mjs`; registry order is S34, S35, S36, P50, S37, S38, S39, S40, P45, P46.
- Shared edits: all shells’ Search/Help now open P45/P46. Support nav opens S34. S01, S09, S13, P41, P43, P44 and S14/S20 handoffs are now connected. Stale “later batch” notes for S10–S14 and S17 are replaced with links.
- Verification actually run: `node design/build.mjs` builds 6 pages. `node design/tools/check_batch.mjs` passes for all six (static checks only). Batch 06: 10 screens, 51 states, 102 renders, 25 routes with controls. A full render scan of every state in all six batches for undefined/NaN/[object] is clean. Not rendered in a browser (the restriction was respected).
- Layout risks to inspect: the S36 two-column page with the queue table in the narrow column; the S37 four-column people table; the S38 transfer table plus notices; S39 seven-row mapping table; the P50 step indicator with five steps at narrow widths; the P45 split filters; the P46 iOS alert over the form.
- Tracker: all 100 rows Ready for review / Specified / browser Not run. None accepted; the owner has reviewed none of the six batches.
- Next: owner review of all six previews and D1–D58. Then apply changes, rebuild, recheck, and run a browser/keyboard/screen-reader pass in an authorized environment.

## 16 Oct 2026 — Review packet (after Batch 06)

- Added `design/tools/build_review.mjs` → `design/preview/index.html`, one offline page for the owner. It links all six batch previews, with per-screen deep links and layout-risk chips, and shows tracker status counts and the project-level open-decisions table. It lists 29 open questions parsed from `decisions.md` and all 58 decisions (D1–D58), each with Accept/Adjust/Reject and a note. "Copy as Markdown" and "Download" export the feedback. Drafts use localStorage only, wrapped in try/catch. Nothing is sent anywhere.
- `node design/build.mjs` (full build) now also rebuilds the packet. All six `check_batch` runs still pass (static only).
- Not run: the packet has not been opened in any browser (same restriction). No design changes in this step, and the tracker is unchanged.
- Next: the owner opens `design/preview/index.html`, records feedback and pastes the exported Markdown back. Then apply the changes per batch, rebuild, recheck, and update the tracker.

## 16 Oct 2026 — Owner acceptance of decisions

- Owner, in chat after the review packet: “looks good to me for all of those”. When asked, they confirmed the scope: accept D1–D58, and resolve all 29 open questions to the drawn defaults. Recorded in `decisions.md` › Owner review, with a resolution table worked out from the sources and D-entries. The two proposal rows in the open-decisions table (tokens/components, build format) are now accepted.
- Not covered: owner visual review of the screens (the tracker stays *Ready for review*), browser/keyboard/screen-reader/device acceptance (*Not run*), and the non-proposal project questions. Communication scope (area 8) is still open, so S05 “Message instructor” stays a placeholder.
- Tracker: a note was appended to all 100 rows (CRLF kept). The packet now shows “Accepted” and “Resolved by owner” labels, parsed from the Owner review section. No design sources changed.
- Next: owner visual pass over the six previews, starting with the layout-risk screens, and browser acceptance in an authorized environment.

## 16 Oct 2026 — Committed

- `design/` committed on `showcase/v2` as `8eba7f2` (not pushed). The build still depends on the uncommitted `showcase/app_map/` files. NOTES.md, CLAUDE.md and HANDOFF.md now point new sessions at the current state.

## 16 Oct 2026 — Delegated decisions D59–D64

- The owner delegated the remaining decisions to Claude (“choose the best ones”). Recorded in decisions.md as **chosen by Claude under owner delegation**, kept separate from owner-accepted D1–D58.
- D59: no direct messaging. S05’s closed state (web and iOS) now offers “Request more time…”, a request rather than an extension, decided by staff and shown via S21. D60: iPhone capability rule for the 12 desktop-recommended destinations; it matches what is already drawn. D61: no splits or merges. D62: no new standalone routes. D63: first school, records system and sign-in stay working assumptions that need partner discovery. D64: acceptance by user-assisted inspection.
- Rebuilt; all six static checks pass. The packet shows D59–D64 as “Chosen by Claude · delegated”. Tracker S05 rows have a note.

## 16 Oct 2026 — Owner visual acceptance

- The owner reviewed the previews in their own browser: “everything looks great”. All 100 tracker rows are now design_status **Accepted**, with the quote in notes. Recorded in decisions.md › Owner review.
- Unchanged: browser_status *Not run* (no structured keyboard/screen-reader/reflow test), native_device_status *Not run* (no native build), states_status *Specified*.

## 16 Oct 2026 — Click-through prototype

- Built `design/prototype/` (roles.mjs, proto.js, proto.css) and `design/tools/build_prototype.mjs` → `design/prototype/Whiteboard-Prototype.html` (~750 KB, offline, one file). The owner asked for four steps (shell + student, then instructor/TA, campus roles, support/IT + guide). Because every screen already existed, all four were built in one pass.
- 8 roles, 24 tours, 159 steps. 95 of 135 transitions are reachable by clicking a real control; 40 are situation changes or role switches covered by Next (`node design/tools/build_prototype.mjs --gaps`).
- Verified (not in a browser): combined-page renders identical to the batch previews (508/508); build-time tour validation; a Node stub-DOM smoke test of every role, every tour step, every state on both platforms, plus the menus, with no runtime errors. Layout, scaling and real clicking are **not** browser-verified; owner inspection is needed (D64).
- D65 recorded. All six batch checks still pass.

## 16 Oct 2026 — Tour link review

- Reviewed all 40 Next-only tour transitions against the controls on each screen. One was a real click: “Capture page 3” (web) and the shutter (iPhone) on S06 *ready* now link to S06 *selected* (attribute only; the rendered design is unchanged). Now 96 of 135 transitions are reachable by a click.
- The other 39 are left as Next on purpose (chosen by Claude under owner delegation). They are another person deciding, a source system refreshing, time passing, going offline, typing a query, or a role switch. A button for them would suggest an authority or effect that the design deliberately doesn’t have.
- All six batch checks pass. Still not opened in a browser.

## 16 Oct 2026 — Paused

- The owner opened the prototype locally and then put the project on hold before sending feedback. Browser review is still unconfirmed. When work resumes, file changes go through `/team` (owner's instruction).
