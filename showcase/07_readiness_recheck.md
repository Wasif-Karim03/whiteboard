# Whiteboard showcase: readiness recheck

Historical review at commit `1585b39`, 15 October 2026. **Correction update: all four findings below are now fixed and regression-tested.** The new source/state checks and independent review passed; browser acceptance remains outstanding. The original reproductions below document the pre-fix behavior.

No HTML or application source was changed in this review. All eight existing Node regression suites and the static HTML checker passed again. Passing those checks does not cover the new reproductions below. A fresh independent Astra review confirmed the three state defects; the lead independently reproduced them and tested the actual click handler with a Ctrl-click event double.

## Historical confirmed defects — corrected

| Finding | Evidence / reproduction | Fix acceptance | Tracker |
| --- | --- | --- | --- |
| Submitted quiz content changes after submission | `src/student.js:400`, `src/teaching.js:454`: submit the initial quiz, then add bank question `qb-2`. The same submitted attempt now shows the added question as unanswered. Rendering reads the live authored items instead of a submitted version. | Preserve the submitted question/answer/settings version. Adding/editing questions affects future attempts, leaving the submitted record unchanged. | REV-09 reopened |
| Another assignment changes quiz feedback availability | `src/student.js:361`: results use the current assignment's effective due date. At Oct 21, submit the quiz under “After the due date”; results are available. Create the new assignment due Oct 23; the same quiz becomes held. | Give the quiz an independent deadline/release context. Creating/editing a separate assignment cannot hide or release its results. | REV-09 reopened |
| Module reading status carries over from another module | `src/student.js:608`, `src/student.js:229`: complete m3, publish m4 and advance beyond its release date, then open m4. Its button says “Mark reading incomplete” even though m4 is not completed; clicking fails to complete it. | Derive the label and action from the active module's own completion record. One completion action adds that module without altering another. | REV-08 reopened |
| Modified workspace-link clicks lose native behavior | `src/controller.js:264–273`: the click handler always prevents the default for `data-open-screen` links, ignoring Ctrl/Meta/Shift and button state. An event-double invocation with Ctrl-click confirmed default prevention. | Intercept only unmodified primary clicks. Preserve native new-tab/window behavior while normal clicks keep local workspace routing. Verify in a permitted browser. | REV-29 reopened |

## Known acceptance work still open

- Desktop/phone rendering in Light and Dark, including all forty workspaces and six journeys.
- Actual keyboard focus, screen-reader output, field-error recovery, browser history, dialogs and downloads.
- Mobile keyboard, zoom, clipping/overflow and browser console review.
- Fresh-reviewer usability of the first-look path and guided workflows.
- Two EDUCAUSE source URLs remain unverified after HTTP 403 responses; three other source endpoints returned HTTP 200 in the earlier link check.

The recorded local-file URL-policy restriction remains respected; no alternate route was used. Source-based checks cannot close these browser gates. Interface review also used the [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), accessed 15 October 2026; no conformance claim is made.

## Current decision and next order

The product vision has broad coverage; these findings call for correctness fixes rather than more product domains. Keep the planned boundaries: real backend, authentication, storage, integrations and operational assurance are separate production implementation work.

1. Snapshot quiz attempts and separate quiz deadlines from assignment deadlines.
2. Correct per-module reading state.
3. Preserve modified-link navigation and add regressions for all four reproductions.
4. Complete the outstanding browser/usability acceptance and fix what it reveals.

Tracker totals after this review: **25 Done (source/state), 3 Reopened, 7 Implemented/unverified, 3 blocked browser gates**. See [the tracker](05_update_tracker.md) and [CSV](05_update_tracker.csv). The final-product showcase is not yet fully accepted; it should not be described as completely finished or as a production campus platform.

## Correction evidence

`node showcase/tools/check_readiness_regressions.cjs` now exercises immutable quiz contents/settings, independent deadlines, captured-policy release, separate quiz allowances, prior-attempt history, per-module completion and actual modified-click handling with event doubles. All 20 commands in `review/verification_2026-10-15.json` passed. A bounded independent Astra review found no blocking defect in these fixes or their integrations. No browser was executed.

Current tracker counts supersede the historical totals above: **27 Done (source/state), 8 Implemented/unverified, 3 blocked browser gates**. EDUCAUSE primary pages were subsequently retrieved successfully with the public web reader; browser acceptance is the remaining gate.
