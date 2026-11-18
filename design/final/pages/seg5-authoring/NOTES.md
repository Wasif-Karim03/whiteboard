# Segment 5 (authoring): notes

W35–W46, W59 and W60 on web, iPad and iPhone. Read with `pages/PAGES.md` (the contract) and `pages/SPINE.md`. Every decision below was **chosen by Claude under owner delegation** (17 Nov 2026). All records are fictional and local. These are source checks only (`tools/seg5-authoring.test.mjs`, `check_render`, `check_vocab`, `check_lines`); no browser, keyboard, screen-reader or device check has run.

## Decisions

- **S5-1. Authoring is preview-only.** No scenario records an authoring outcome, so Save, Hide from learners, Restore earlier version, Move up/down, Add module, Upload, Replace allowance, Invite staff, Change end date, New/Retire question or rubric, Choose package and Export are preview-only buttons ("Preview only: nothing changes in this prototype"). W36 "Publish syllabus revision" is preview-only too (disabled offline). W35 "Publish selected", W38 "Publish lesson", Create draft copy (W59) and Start import (W60) are disabled with a reason. The destructive dialogs on W45 (Revoke access) and W46 (End allowance) open for real, but their primary item is preview-only. No result page is linked (coordinator's cross-segment rule).
- **S5-2. W38 draws a new untitled lesson draft** in the current module; no lesson record exists.
- **S5-3. W39 draws the empty library**; no file record exists. The attach list names only coursework with a W40 record view.
- **S5-4. W59 has no destination term**, so the confirmation box and Create draft copy are disabled with "Choose a destination term first".
- **S5-5. An ended TA gets the ended notice only** on all 14 pages (`P.staffGate` runs first, before the W42/W59/W60 denial).
- **S5-6. A TA is denied W38 drafts** ("Lesson drafts are open to the instructor only").
- **S5-7. No W52 link from W36.** No selector names the course's grading policy record, and A10 forbids a bare record link, so W36 draws no "Grading policy" link (selector request below).
- **S5-8. W35 firstUseEmpty links only W60** ("Import a course package") plus the preview-only Add module; a W37 link there would open a module the empty view says does not exist (A5).
- **A5.** Only the module W37 draws (`sel.currentModule`, else the first by position) links to W37, on W35 and W36. At `ta_expired` and `ps4_released` that is Module 4, drawn truthfully with no items.
- **A6.** W43, W44, W45 and W46 check `taTaskAccess(...).active` and a non-null `taScope` per task. An expired task shows its title and "Access ended", no learners or criteria. W45 lists tasks per published assessment (`gradingTaskFor(view, taId, itemId)`), so several tasks are handled.
- **A10.** Record links use `P.recordGo`: W40/W41 items, W44 and W50 rubric, W48 grading queue, W47 group set, W57 task, W46 allowance, W14 course home. W40:motion has no rubric or grading-queue link (no anchored view).

## Assumptions

- **A3.** Pages read `a.view.data.coursework.modules` and `a.view.data.groups.group_sets` filtered by course, because no selector lists them and neither is banned.
- **A4.** `WB.FLAGS.readOnly` exists (`kit/core.js`); the TA read-only views draw `K.flag("readOnly")`.
- Field-level disabled controls (W40 question points, W41 settings, W44 points, W59 checkbox) use `K.field` `disabled` with a reason; buttons use `K.button` `aria-disabled`.

## Drawn states per page

| Page | Drawn states | Variants |
|---|---|---|
| W35 Course builder | loading, firstUseEmpty, conflict, offline, permissionUnavailable | none |
| W36 Course settings | loading, saveFailed, offline, permissionUnavailable | none |
| W37 Module editor | loading, firstUseEmpty, invalid, offline, permissionUnavailable | none |
| W38 Learning-content editor | loading, invalid, saving, saveFailed, conflict, offline, permissionUnavailable | none |
| W39 Files and resources | loading, firstUseEmpty, saveFailed, offline, permissionUnavailable | none |
| W40 Assignment editor | loading, invalid, saving, saveFailed, conflict, offline, permissionUnavailable | motion |
| W41 Quiz editor | loading, invalid, saveFailed, offline, permissionUnavailable | none |
| W42 Question bank | loading, firstUseEmpty, filteredEmpty, permissionUnavailable | none |
| W43 Rubric library | loading, firstUseEmpty, filteredEmpty, permissionUnavailable | none |
| W44 Rubric editor | loading, invalid, saving, conflict, offline, permissionUnavailable | none |
| W45 Course people | loading, firstUseEmpty, destructive, offline, permissionUnavailable | none |
| W46 Learner allowances | loading, firstUseEmpty, invalid, destructive, offline, permissionUnavailable | none |
| W59 Course copy | loading, invalid, saveFailed, permissionUnavailable | none |
| W60 Import/export | loading, invalid, saveFailed, permissionUnavailable | none |

Every other state has an N/A reason of 140 characters or fewer.

## Fix round 1 (inspection R01–R09)

- **R01 (W45, W46).** After `staffGate`, the page checks `sel.verifiedRole` for the frame role in the course (W46: the quiz's course) before any allowance, scope or roster read; otherwise it shows "You are not teaching this course" and no dialog.
- **R07 (W45).** `firstUseEmpty` replaces scope, roster and actions on every tier with "Roster delayed"; no names, revoke opener or dialog.
- **R06 (W35, W40).** The review-tier Hide from learners is disabled offline (W35 also in conflict) with the web reason. Chosen by Claude under owner delegation.

## Fix round 2

- **INSP2-01:** W44 filters TA rubric criteria and assigned points by the active task's question scope and explains that other questions are outside the task. Chosen by Codex under owner delegation.
- **INSP2-05:** W46 identifies the allowance adjustment as extra minutes or a multiplier and keeps effective time selector-derived. Chosen by Codex under owner delegation.

## Phase 4 enrollment and offline handling

- W35, W36 and W59 show a permission notice when no course is assigned, retaining the handoff on non-full tiers. W40 disables its web Hide from learners action offline. Chosen by Codex under owner delegation.
- W44 explains that other questions are outside the task only for a partial question scope. Chosen by Codex under owner delegation.

## Teaching roster and selected learner

- W45 lists actual enrolled teaching assistants and their allocated tasks, and offers instructor links from the roster to each learner's scoped work and grade records. No revoke action is drawn without a task; a TA remains limited to their own task scope. Chosen by Codex under owner delegation.

- A selected learner's assessments without a receipt still offer their contextual grade record. Switching learners clears the previous assessment and receipt selection. Chosen by Codex under owner delegation.
