# seg6-grading and optional pages: notes

Pages W50, W52, W54, W57 and W58 (this folder) and O01–O03 (`pages/optional/`). Read with `PAGES.md` and `SPINE.md`. Everything below was **chosen by Claude under owner delegation** (17 Nov 2026). All records are fictional and local. Tests: `tools/seg6-grading.test.mjs`. These are source checks only: no browser, keyboard, screen-reader or device check has run.

## Drawn states

| Page | Drawn states | Variants |
|---|---|---|
| W50 Rubric-change impact preview | loading, conflict, offline, permissionUnavailable | none |
| W52 Grading policy setup | invalid, loading, conflict, offline, permissionUnavailable | none |
| W54 Grade correction and regrade review | loading, offline, permissionUnavailable, firstUseEmpty | none |
| W57 Allocation and deadline planner | loading, invalid, offline, permissionUnavailable, firstUseEmpty | none |
| W58 Course insights and attendance | loading, offline, permissionUnavailable, firstUseEmpty, filteredEmpty | none |
| O01 Student achievements | loading, permissionUnavailable, firstUseEmpty | enabled |
| O02 Staff achievement authoring | loading, permissionUnavailable, invalid | enabled |
| O03 Course FAQ assistant | loading, offline, permissionUnavailable, firstUseEmpty | enabled |

Every other state has an N/A reason of 140 characters or fewer.

## Decisions

- **Record absent, drawn honestly.** No fixture holds a rubric candidate, the policy weights, a review request, attendance, awards or an assistant answer. Each page draws the truthful empty from existing selectors, and every committing action is disabled with a reason or preview-only (preamble rule; listed in `kit_requests.md`).
- **Authority first.** Every staff page runs `P.staffGate` (W54 runs the same branches by hand, since it is course-level and has no task) before any state. A TA whose access ended sees the notice only.
- **A6, per-task access.** W50, W57 and W58 read learners, questions or counts for a task only when `taTaskAccess(...).active` and `taScope(...)` are both true. W57 lists an ended task by title with "Access ended" and its end time, and no learners.
- **W50.** The impact table lists `releaseReady` rows: included rows are "Held: would be recalculated" with the draft total and a grader link; not-ready rows are "Not scored yet". Released snapshots from `releasesFor` are listed as immutable. A TA sees only the assigned questions, their review progress and a disabled "Submit proposal".
- **W52 (3.10, 6.01).** The weight column reads "Not drawn: see kit request". The calculation preview names the student persona and shows the working total (released and held) and the released total under separate labels, plus per-category values; a null value shows "No calculable grade" (A9). No letter grade appears; both roles see "This policy sets no letter boundaries, so no page shows a letter grade". A TA sees a read-only mapping of their task items, with no totals, learner or controls. **Deviation from the PAGES.md failure-sample rule:** `invalid` draws no sample figures (none exists) and never a permission notice to the instructor.
- **W54 (6.04, A8).** The Quiz 2 evidence (learner, assessment, receipt, released snapshot version and time, score, comment, earlier versions) is inline. There are no W27 or W23 links. The only record links are "Release feedback: <title>" and "Grading queue: <title>", both opening the problem-set record they name. A TA gets the unallocated notice and "Only the instructor decides a correction", with no learner data.
- **W57 (2.11).** Only the instructor gets the "Grading due" date field (no typed value). The access check is derived: when access ends before grading is due, a warning shows both times and Apply is disabled with "Access ends before grading is due". Questions are the assessment's rubric list with "Per-TA question split is not drawn". iPad is full; iPhone is review with "Flag this task for follow-up" (instructor) or "Flag for instructor review" (TA).
- **W58.** Counts come from `receivedProgress` and counts of `submissionsFor` by state (SPINE A1); a TA counts only their active task's learners. Attendance is an empty that never counts anyone absent. **Deviation:** the planned W46 link is dropped, because W46 opens an allowance record W58 does not show (A10).
- **Optional pages.** Default views say the feature is off; the `enabled` presentation variant shows the layout with empties and disabled controls. O02 on iPad and iPhone is a handoff with the last result only. O01 and O03 link to Course home through `P.recordGo("W14", "course", …)`.
- **Review-tier protective actions** (preview-only): W50 "Hold recalculation for this rubric", W52 "Keep the current policy version", W54 "Keep the current result as released", W57 "Flag this task for follow-up", W58 "Flag a fact for review" (instructor); W50 and W57 "Flag for instructor review" (TA).

## Assumptions

- **A1.** A count or sum derived from selector-returned records is selector-derived (W52 points possible, W58 missing and excused counts).
- **A2.** Category display names (Assignments, Labs, Quizzes) are a label map in W52, with the raw id as fallback.
- **A3.** Frozen W49 has no link to W50, so the J03 W49 → W50 hop is a coordinator item.

## Fix round 1 (inspection R01–R09)

- **R01 (W50, W52, W54).** The same `sel.verifiedRole` membership guard runs after `staffGate`.
- **R09 (W50).** A draft with marks but an incomplete review reads "Marked, review not complete: its marks would be recalculated" with its draft total; only a learner with no marked draft reads "Not scored yet".
- **R06 (W50, W52, W54, W57).** Review-tier protective actions are disabled offline (W50 and W52 also in conflict) with the web reason. Chosen by Claude under owner delegation.

## Fix round 2

- **INSP2-02:** W57 moves progress out of individual allocation rows into a deduplicated, explicitly assessment-wide summary. Chosen by Codex under owner delegation.

## Teaching allocations

- W57 lists each TA's actual question scope and separates uncovered work for the instructor. Empty plans offer no follow-up flag for a nonexistent task. Chosen by Codex under owner delegation.

- W57's instructor-only Staffing examples open explicitly fictional staffing scenarios; offline they are disabled. The handover scenario shows the recorded actor, time, assessment and transfer rather than changing an allocation. Chosen by Codex under owner delegation.
