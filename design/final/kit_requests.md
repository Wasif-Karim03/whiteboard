# Kit and coordinator requests (Phase 3 spine)

The kit, fixtures and manifest are frozen after the Phase 2 gate. Each entry below lists:

- the page;
- what is missing;
- why the existing kit cannot express it;
- the proposed API;
- the workaround the page draws now.

Builders do not apply these; one coordinator does. Chosen by Claude under owner delegation, 16 Nov 2026.

## 1. W20: file picker

- **Missing:** a file input.
- **Why:** `K.field` has no `file` type (`FIELD_TYPES`), and pages may not add markup that behaves like a control.
- **Proposed:** `K.field({type: "file", id, label, accept, multiple, help})` renders a labelled `<input type="file">` with the help text.
- **Workaround:** preview-only `K.button`s "Choose files" and "Take photo", each with a `note`.

## 2. W23 and W49: page-viewer placeholder

- **Missing:** a component that shows a submitted page (thumbnail or placeholder, page number, tagged questions).
- **Why:** nothing in the kit draws a document page.
- **Proposed:** `K.pageThumb({page, label, questions})`, a non-interactive figure with a caption.
- **Workaround:**
  - The pages are listed as text: file name, size and page count.
  - Page-to-question tags are drawn as `K.kv` rows.
  - The page says "The page viewer is not drawn in this prototype."

## 3. W49: number-field bounds

- **Missing:** `min`, `max` and `step` on `K.field` type `number`.
- **Why:** `K.field` passes no bound attributes.
- **Proposed:** `K.field({type: "number", min, max, step})` emits the attributes, and `aria-describedby` keeps the help text.
- **Workaround:**
  - Help text reads "0 to <max>".
  - The `invalid` state shows the error "Enter a mark from 0 to <max>".

## 4. W53: row checkbox (dropped)

Dropped under plan addendum R02. The release scope is a fixed, read-only list, so no row checkbox is needed.

## 5. W53: dialog cancel label

- **Missing:** a custom Cancel label, for example "Return without applying changes".
- **Why:** `K.dialog` always labels the close button "Cancel" (or "Close" for capture).
- **Proposed:** a `K.dialog({cancelLabel})` option.
- **Workaround:** the default Cancel.

## 6. Coordinator: tracker progress (tools)

- **Missing:** a way to record page progress in `tracker/page_tracker.csv`.
- **Why:** `checkPageInitial` (`tools/check_tracker.mjs`) pins `html_implemented` to "No" and `source_checked` to "Not run".
- **Request:**
  - Relax the phase 0 check to an allowed-values check.
  - Then set `html_implemented=Yes` and `source_checked=Pass` for the 36 spine rows (12 pages × web, iPad, iPhone).
- **Cost:** those rows change the spec bytes, so recheck the spec cap (1,012,975 B) afterwards.
- **The builder did not edit the tracker.**

## 7. Optional: published-assessments selector

- **Missing:** a selector listing a course's published assessments.
- **Why:** pages read `view.data.coursework.assessments` filtered by course and `published` (assumption A2, `P.assessments`).
- **Proposed:** `sel.assessmentsFor(view, courseId, who)`, returning the published assessments the viewer may see.

## 8. Viewer: a state together with a presentation variant

- **Missing:** a viewer route that applies a state and a variant at once.
- **Why:** the viewer takes one token, a state or a variant, never both. So "conflict on `W53:acknowledged`" (R14) and "offline on `W21:confirm`" (R11) cannot be opened in the viewer.
- **Proposed:** an optional `state` alongside `variant` in the frame state. Alternatively, accept the current one-token rule.
- **Workaround:**
  - The pages handle both inputs; blocking states win.
  - The combinations are proved by direct renders in `tools/spine.test.mjs` and `tools/spine-authority.test.mjs`.

## 9. W24: learner-view status for the instructor preview

- **Missing:** a way to draw the learner's own status label (for example "Received · Feedback not released yet") inside an instructor frame.
- **Why:** `K.status` is role-aware and throws for learner-only keys when `ctx.role` is instructor.
- **Proposed:** `K.status(key, ctx, {asRole: "student"})`, drawn with a "Learner sees" prefix.
- **Workaround:**
  - A row the learner cannot see yet reads "Learner sees: not released yet".
  - A released row shows its staff status.

## seg3-submit

Quiz pages W25, W26 and W27. Chosen by Claude under owner delegation; details in `pages/seg3-submit/NOTES.md`.

1. **A `quiz-save-unacknowledged` failure sample.** `scenarios.js` requires W26 to draw `saving`, but `samples.js` has no such record, so `failureSample` returns null. Workaround: W26 names the unsent count from `attemptView(...).unsent`.
2. **Quiz item prompts, options and an answer-to-option mapping.** Items are `{id, kind}` only. Workaround: W26 draws "Choice A" to "Choice D" as unselected placeholders and shows raw answer values; W27 lists raw values. This also leaves the W26 confirm payload (two saved answers at its home clock) different from the example receipt (four).
3. **A second-attempt scenario.** Quiz 3 allows two attempts but no fixture has a second. Workaround: W25 draws "Start attempt" disabled with "A second attempt is not drawn in this prototype".
4. **Role-scoped quiz selectors.** `attemptFor`, `attemptView` and `allowanceFor` take a bare person id. Workaround: the pages pass only `a.who.personId`, and W25's staff preview never calls them for a learner.
5. **Optional: an "open with no attempt" scenario selector.** W25 hard-codes `OPEN_CLOCK = "group_submission"`, guarded by a test.
6. **`disabled` on `K.choiceGroup` options.** Amendment A3 asks for disabled placeholder choices; the kit only supports `disabled` on `K.field`. Workaround: unselected placeholders with help text saying the content is not in this prototype.
7. **Committing actions with no result scenario (A2).** Start attempt (W25) and Submit attempt (W26) are preview-only dialog primaries, each with a separately labelled example link (`W26~quiz_in_progress`, `W27~quiz_received`). A started-attempt scenario and a payload-matching receipt would let them link a true result.

## seg1-access

Access and account pages W01–W04 and W08–W13. Chosen by Claude under owner delegation; details in `pages/seg1-access/NOTES.md`.

1. **Invitation fixture and `sel.invitationFor(view, who)`** (masked recipient, inviter, expiry, reference, status), a pre-acceptance scenario and a sample for `invite-expired`. Page: W03. Why: no invitation record exists. Workaround: W03 states only "You already have access to this course as <role>" and "This invitation's status cannot be checked in this prototype"; Accept is disabled ("This invitation cannot be verified") (A7).
2. **Sample records for `wrong-institution`.** Pages: W01, W02. Why: `failureSample` returns null. Workaround: the notice names no account, course or figure.
3. **Tool catalog fixture and `sel.toolsFor(view, who)`** (eligibility, owner, expiry, last verified). Page: W11. Workaround: one "Sample entry: no tool is listed yet" card with unknown eligibility and a disabled "Continue to provider".
4. **Help request fixture** (reference, acknowledged time) and a scenario for W12 `success`. Workaround: Submit request is preview-only; no reference is ever drawn and `success` is N/A.
5. **Session summaries and saved preferences.** Pages: W10, W04. Workaround: "This session" with no time; End another session disabled; Save preferences disabled or preview-only.
6. **`sel.fmtInZone`** for a two-zone deadline preview. Page: W04. Workaround: one line in the institution zone from `sel.nextDue`.
7. **`sel.announcement(view, id, who)` and `sel.coursesFor(view, who)`** to replace direct reads of `comms.announcements` (W08, W09) and `world.enrollments` (W04, W08).
8. **An activity item for the PS4 release at `ps4_released`.** Page: W08. Workaround: rows are exactly `sel.activityFor`.
9. **`K.field` type `search`/combobox**, plus file-picker request 1. Pages: W01, W09, W10, W12. Workaround: a text field and preview-only buttons.
10. **Identity transitions (A1).** Sign out (W10), Use another account and Restart sign-in (W02, W03), Sign in again (W02, W10, W13) and the W01 → W02 hand-off are preview-only with the note "Preview only: in this prototype, switch the role in the viewer bar or follow the tour"; the tour carries the role change. A viewer action that switches role would let these link.
11. **Coordinator:** add `import("./seg1-access.test.mjs")` to `tools/index.js`.

## seg2-course

Pages W05, W06, W07, W15, W16, W17 and W32. Chosen by Claude under owner delegation, 17 Nov 2026.

1. **W17: lesson records.** Missing: lesson fixtures, `sel.lessonsFor(view, moduleId, who)` and a W17 anchor. Workaround: W17 draws the current module, its span, files shared in published announcements and the line "Lesson text is not in the prototype data yet".
2. **W15: grading policy and syllabus.** Missing: `sel.gradingPolicy(view, courseId, who)` (weights, version, method, treatments; `.data.grades` is banned for pages) and a syllabus document record. Workaround: grade items by category with points only, an info notice that weights and version are not drawn, and a disabled "Download syllabus" with its reason.
3. **W16, W17: completion and prerequisites.** Missing: module completion and prerequisite records. Workaround: no completion control; the line "Completion tracking is not drawn in this prototype"; locks come only from a module's start time.
4. **W05, W06, W15, W16, W17: course and module selectors.** Missing: `sel.coursesFor(view, who)` and `sel.modulesFor(view, courseId, who)`. Workaround: direct reads of `world.enrollments`, `world.institution`, `coursework.modules` and `comms.announcements`/`comms.discussions` (SPINE A2).
5. **Failure samples.** Missing: samples for `source-delayed`, `module-locked`, `ta-expired` and `calendar-permission-denied` (for example a last-checked time). Workaround: these states are drawn from real records with no typed figure.
6. **W07, W32: event status and editor.** Missing: calendar event `status`/`revision` (changed or cancelled occurrences), recurring edits and a course-event editor. Workaround: "New course event" and the private-event dialog actions are preview-only (`note`); week and month grids are not drawn.
7. **Shared agenda helper.** W07 and W32 duplicate about 30 lines (window, due rows, TA task filter). Proposed: `P.agendaRows(a, opts)` in `shared.js`.
8. **`P.taEndedNotice` link target.** It always links to W05, so W05 builds its own ended notice (link to W12). Proposed: an option for the action target.
9. **Committing actions with no result scenario (preamble rule).** Preview-only: Save private event, Delete this event, New course event, Retry (W06 offline), Clear filters, Download (W17), course search (W06).
10. **Coordinator.** Add `import("./seg2-course.test.mjs")` to `tools/index.js`; tracker rows for the 21 targets.

## seg6-grading

Pages W50, W52, W54, W57 and W58. Chosen by Claude under owner delegation, 17 Nov 2026.

1. **W52: grading policy selector.** Missing: `sel.gradingPolicy(view, courseId, who)` (mode, method, weights, treatment rules, rounding, version; instructor full, TA read-only), a `weights-not-100` failure sample, a letter-boundary table or its confirmed absence, and a fictional "Example learner" record (BD33). Workaround: category mapping with points from `gradebook`, weight cells read "Not drawn: see kit request", policy version from `releasePreview(...).inputs`, `invalid` drawn with no sample figures.
2. **W50: rubric candidate.** Missing: a candidate rubric version, manual-override records and a `rubric-preview-stale` sample. Workaround: current version, held results that would be recalculated, released snapshots marked immutable; Apply and the mode select disabled ("No candidate version to apply").
3. **W54: review requests.** Missing: `grades.review_requests` (Quiz 2, the student persona, `rel-quiz2-1`), `sel.reviewRequestsFor(view, courseId, who)` and a held-correction scenario so "Record decision" can be a committing action. Workaround: "No review request is on record" plus the released Quiz 2 snapshot inline (A8); every decision button disabled with its reason.
4. **W57: grading plan.** Missing: `sel.gradingPlan(view, courseId, who)` with the per-TA question split (`question_ids` is banned for pages) and an access/deadline conflict sample. Workaround: questions listed from the assessment's rubric with the line "Per-TA question split is not drawn"; the access check is derived with `sel.isBefore`; a selector listing a course's tasks would replace the TA × assessment `gradingTaskFor` loop.
5. **W58: attendance.** Missing: attendance and session records and a TA attendance grant. Workaround: an honest empty ("never counted as absent"); "Correct attendance" disabled, "Record attendance" preview-only; TA notice that a grading task does not grant attendance.
6. **Committing actions with no result scenario (preamble rule).** Disabled with a reason or preview-only: Apply reviewed change, Refresh impact, Submit proposal (W50); Apply policy version, Preview calculation, Edit weights (W52); Start review, Request typed clarification, Save correction as held, Decline with reason, Release approved correction (W54); Preview allocation, Reassign incomplete work, Apply plan (W57); Record attendance, Correct attendance, Clear filters (W58); every protective action.
7. **Coordinator.** Add `import("./seg6-grading.test.mjs")` to `tools/index.js`; add a W49 → W50 link on the frozen spine page (J03); tracker rows for the 15 seg6 and 9 optional targets.

## optional

Pages O01, O02 and O03. Chosen by Claude under owner delegation, 17 Nov 2026.

1. **Course feature flags and records.** Missing: a per-course flag for achievements and the assistant, award and criteria records, and a simulated FAQ answer with citations. Workaround: the default view says the feature is off; the `enabled` presentation variant shows the layout with truthful empties and disabled controls; no award, criterion, answer or citation is drawn.
2. **Committing actions with no result scenario.** Disabled with a reason: Enable achievements, Award name, Criteria, Issue reviewed awards (O02); Sharing, Ask for correction (O01); Question, Clear context (O03).

## seg4-community

Pages W28, W29, W30, W31, W33, W34, W47, W55, W56. Workarounds are drawn and recorded in `pages/seg4-community/NOTES.md`. Chosen by Claude under owner delegation.

### K1. Selectors for announcements, topics and groups

- **Pages:** W28, W29, W33, W34, W47, W55, W56.
- **Missing:** `announcementsFor(view, courseId, who)`, `announcement(view, id, who)`, `topicFor(view, id, who)`, `groupSetsFor(view, courseId, who)`, `groupAssignmentsFor(view, courseId, who)`; and an optional `about: {type, id}` on announcements so W29 can link a record-true W25 or W19.
- **Why:** pages read `view.data.comms.announcements`, `view.data.groups.group_sets` and `.group_assignments` directly, filtered by course (assumption A2).
- **Workaround:** direct reads filtered by `a.who.courseId`; W29 draws no assessment link.

### K2. Fixture: a withdrawn announcement

- **Pages:** W28, W29, W55.
- **Missing:** a withdrawn record with `withdrawn_at`, and an `announcement_withdrawn` scenario or a W29 variant.
- **Workaround:** the withdrawn branch is drawn and proved by a test data copy only.

### K3. Sample: `group-membership-changed`

- **Pages:** W34, W47 (`conflict`).
- **Missing:** a `failureSample` for this failure (audience student and instructor; from and to versions, the moved person, minutes ago).
- **Workaround:** the conflict notices use only record figures (`set.version`, `draft.membership_version`); no mover, time or counts are invented.

### K4. Fixtures: moderation reports and TA authoring or moderation scope

- **Pages:** W55, W56.
- **Missing:** report records, and a TA scope for announcements or moderation.
- **Workaround:** "Reported posts" is empty; a TA reads only, with "You have no moderation scope in this course" and "Publishing announcements is the instructor's step".

### K5. Scenarios: result clocks for publish, withdraw, membership v2 and a locked thread

- **Pages:** W47, W55, W56, W31.
- **Missing:** scenarios holding the result of publish, withdraw, move member, lock replies, hide post and post reply.
- **Why:** PAGES.md asks a confirm dialog's primary item to link the result page; none exists.
- **Workaround:** preview-only primary items with a note (recorded departure from the committing-action rule).

### K6. Staff read markers and instructor visibility of group topics

- **Pages:** W28, W30, W56.
- **Missing:** read markers for staff personas; `visibleTopics` returning group topics to the course instructor.
- **Workaround:** staff rows show "Updated" only for multi-revision records; group topics are hidden from staff (fail closed).

### C1. Coordinator

- `tools/spine.test.mjs` relaxation (done by the coordinator) and the import of `./seg4-community.test.mjs` in `tools/index.js`.

## seg5-authoring

Segment 5 (W35–W46, W59, W60). Workarounds are drawn; decisions are in `pages/seg5-authoring/NOTES.md` (chosen by Claude under owner delegation).

1. **Sample `import-unsupported-type`.** Missing from `fixtures/samples.js`, so `sel.failureSample` returns null and W60 `invalid` names no file or size. Proposed: `{id, file: {name, bytes, kind}}`, audience instructor. Workaround: "Choose a Whiteboard course package." with no figure.
2. **Authoring fixtures.** Missing: course files, lesson content, syllabus/settings/AI ceiling, a question bank with versions and pins, staff invitations, allowance requests, a copy/import log, a draft or unpublished item, and a publish-result scenario. Workaround: empty states, preview-only edits, and Publish / Create draft copy / Start import disabled with a reason (S5-1 to S5-4). Affected committing actions: publish (W35, W36, W38), hide and restore (W35, W37, W40), copy (W59), import and export (W60), revoke (W45), end and replace allowance (W46), retire (W42, W43).
3. **Selectors.** `sel.modulesFor(view, courseId, who)` and `sel.groupSet(view, id)` (pages read `coursework.modules` and `groups.group_sets` directly, A3); `sel.rubricById(view, id, who)` (W44 scans assessments); `sel.policyFor(view, courseId, who)` so W36 can link W52 record-true (S5-7); `sel.tasksFor(view, taId, courseId, who)` (W45 scans assessments per task).
4. **Coordinator.** Add `./seg5-authoring.test.mjs` to `tools/index.js`; tracker rows for the 14 pages.
5. **Kit: date-time field.** W40 draws dates as text fields holding the formatted selector string.
6. **Kit: field disabled vs button disabled.** `K.field` `disabled` uses the native attribute while `K.button` uses `aria-disabled`; tests check each form separately.


## Phase 4 coordinator dispositions (17 Nov 2026)

All requests above have been reviewed. Decisions below were **chosen by Codex under owner delegation**. “Retained fallback” closes the coordination decision for this local prototype; it does not claim the missing feature or record exists. New product data and services remain future work.

| Original request | Disposition and evidence |
|---|---|
| 1 file picker; seg1 #9 search/file controls | Retained fallback. Choose files, capture, search and sending remain labelled preview actions; this build has no upload/provider service. A native picker would imply an unsupported result flow. |
| 2 submitted-page viewer | Retained fallback. File names, pages, tags and accessible receipt text remain visible; no image/PDF contents exist to display. Do not fabricate a document image. |
| 3 number bounds | Implemented in K.field with finite/range/positive-step validation; W49 uses criterion max, zero min and whole-point step. kit.test.mjs covers attributes and rejection paths. |
| 4 release row checkboxes | Closed as previously dropped: release scope stays fixed and read-only. |
| 5 dialog cancel label | Implemented in K.dialog, escaped and validated. W53 says Return without applying changes. Default Cancel and close behavior remain covered. |
| 6 tracker progress; every segment coordinator tracker request | Implemented: 189 existing rows now record implementation and source proof; vocabulary permits source progress while browser and owner acceptance remain Not run. |
| 7 published assessment selector; seg1 #7, seg2 #4, seg4 K1, seg5 #3 general selectors | Retained existing scoped/filtering helpers where already used; no broad selector migration. Publication gaps on W14/W15/W19–W27 fixed and checked with mutated hidden titles on every student route. Added scoped sel.receiptById to retain issued own receipts without exposing current unpublished titles. |
| 8 combined state and variant | Accepted current one-token viewer rule. Direct-render tests cover blocking-state plus presentation-variant combinations; route grammar remains stable. |
| 9 learner status in instructor preview | Retained explicit Learner sees wording and released projections; no role override added to K.status. Noninterference checks cover W23/W24/W25 previews. |
| seg1 #1–6, #8; seg2 #1–3, #5–6; seg3 #1–3, #5, #7 | Retained documented empties/examples for missing invitations, catalog/help/session/preferences, lesson/syllabus/completion, events, answer prompts, second attempt, result clocks and failure records. No new institution rules, evidence or claimed outcomes are invented. |
| seg1 #10 identity transitions; seg3 #4 role-scoped quiz selectors | Retained persona-preserving actions and own-id reads; tour role switches are explicit. Navigation rejects links that change/disallow the current role. |
| seg1 #11; seg2 #10; seg4 C1; seg5 #4; seg6 #7 imports | Closed: all six segment suites and integration suites are imported by tools/index.js. |
| seg2 #7 agenda helper, #8 ended-notice option, #9 resultless actions | Retained working local helpers and honest preview actions. Deduplication/API expansion adds no acceptance behavior here. |
| seg3 #6 choice disabling | Retained unselected placeholders and explanatory text. Per-option disabling needs option-specific reason/description identities; no superficial disabled appearance added. |
| seg4 K2–K6 | Retained withdrawn-record mutation tests, record-derived conflict notices, empty reports, fail-closed staff group topic access and preview-only moderation/publish results. TA moderation grants remain absent. Post evidence is now displayed beside Hide (INSP2-04). |
| seg5 #1–2 fixtures, #5 date-time field, #6 field disabled | Retained no-figure missing-sample notices, honest empty authoring records, formatted text dates and native disabled fields with reasons. W35/W40 Hide actions now block offline; W35 also blocks conflict. |
| seg6 #1 policy, #2 candidate rubric, #3 review requests, #4 plan, #5 attendance, #6 resultless actions | Retained factual read-only/empty views and disabled actions because their enabling records are absent. W57 progress is explicitly assessment-wide; a TA sees own task progress only. No candidate, request, attendance, weight or letter boundary is invented. |
| seg6 #7 W49→W50 | Implemented as an instructor-only record-matching rubric link, absent for the group receipt; the navigation proof requires the exact J03 record. |
| optional #1–2 | Retained off-by-default flags, truthful empty enabled layouts and disabled unsupported actions. No awards or AI answers/citations invented. |

Remaining limitations are the retained fallbacks above, not open implementation claims. They belong in future product scope rather than browser acceptance. Source checks do not establish browser, device or assistive-technology behavior.


## Role-workspace coordinator dispositions (17 November 2026)

Chosen by Codex under owner delegation: implemented verified `sel.courseAssessments(view, who)` for instructor unpublished planning and published-only learner/TA content. Added shared `P.gradingGo`, `P.taTaskEnded` and `P.taTaskEndedNotice` for exact assessment routing and task-level expiry. Shell main navigation accepts optional role presentation labels with unchanged canonical IDs/destinations. Coordinated tests cover cross-role date/grade agreement and mixed TA allocations. These are local prototype/source guarantees; no runtime backend authorization is claimed.
