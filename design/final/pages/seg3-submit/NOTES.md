# seg3-submit quiz pages (W25, W26, W27): notes

The quiz pages on web, iPad and iPhone, all on the `full` tier. Read with `pages/PAGES.md` (the contract) and `pages/SPINE.md` (rule R-truth, presentation variants, record-true links). Everything below was **chosen by Claude under owner delegation** (17 Nov 2026) and follows the Phase 3 plan segment for seg3-submit with amendments A1, A2, A3 and A10. All records are fictional and local. These are source checks only (`tools/seg3-submit.test.mjs`, `check_render`, `check_vocab`, `check_lines`); no browser, keyboard, screen-reader or device check has run.

## Drawn states and variants

| Page | Drawn states | Variants |
|---|---|---|
| W25 Quiz rules/start | loading, offline, notYetAvailable, saveFailed, conflict, permissionUnavailable | acknowledged, confirm |
| W26 Quiz attempt | loading, invalid, saving, saveFailed, offline, sessionExpired | reviewed, confirm |
| W27 Quiz receipt/review | loading, offline, success, permissionUnavailable | quiz2 |

Every other manifest state has an N/A reason of 140 characters or fewer.

## Decisions

- **W25 authority first.** Instructor and TA see a staff preview of the published rules only: the base time limit and the published full-time threshold (computed with the staff member's own id, who has no allowance). No learner attempt, allowance, receipt, timer, checkbox, Start or dialog is read or drawn, and the line "Personal extra time is not shown in this preview" says why. The instructor gets the preview flag and "Edit quiz" through `P.recordGo("W41", …)`; the TA gets "Quiz timing, extra time and release are the instructor's step" and no edit link. An ended TA gets the access-ended notice plus the published rules. Staff ignore saveFailed and conflict; offline adds the offline notice.
- **W25 learner timing** reads only the learner's own allowance (`extra_minutes` or `multiplier`), never the basis reference, note or recorder. "To get your full time, start by" always comes from `lateStartThreshold`.
- **W25 learner branches follow the clock:** not open (flag, Start disabled "Opens …", and a link to `W25~group_submission`); an active attempt (timer and "Resume attempt"); a received attempt ("View receipt" through `P.recordGo`, and Start disabled "A second attempt is not drawn in this prototype" while attempts remain and the quiz is open); an attempt whose time ran out ("Check the attempt"); closed (flag and close time); eligible (the committing action). A short window adds a warning with the minutes really available, repeated in the dialog.
- **`OPEN_CLOCK`** is the hard-coded scenario `group_submission`, the only clock where Start is truly eligible. A test proves the quiz is open there with no attempt, so a fixture change fails the test rather than drawing something untrue (kit request 5).
- **Start (A2).** Default: a disabled "I have read the current rules" box, Start disabled ("Confirm you have read the current rules first") and "I have read them" → `W25:acknowledged`. Acknowledged: the opener and "Not read yet". Confirm: the dialog open with personal time, minutes available now, hard close, attempt number, the AI rule and "The timer keeps running if you leave or lose connection". Its primary "Start attempt now" is preview-only (nothing starts); a separate link "See an example attempt in progress" → `W26~quiz_in_progress`, and the text says the example is a separate record, not the result. Offline, saveFailed and conflict win over both variants.
- **W26 answers (A3).** Choice questions draw "Choice A" to "Choice D" as unselected placeholders with help text saying the question content is not in this prototype; the raw fixture value is shown as text. Only an acknowledged answer is labelled "Saved answer" with its time; an unacknowledged one is "Unsaved draft: not sent" with a dirty, saving, saved-locally or failed save status by state; no record is "No answer yet". Each question has a preview-only "Save answer", disabled offline and while saving.
- **Submit (A2).** Default: Submit disabled ("Review your answers first") and "Review answers" → `W26:reviewed`. Reviewed: a review list of the exact payload and the opener. Confirm: the dialog lists each question (saved value and time, "Unsaved changes: will not be sent", or "No answer"), the counts, attempt, question version, time left and "This cannot be changed after sending", with a warning when anything has no saved answer. Its primary "Submit attempt" is preview-only; a separate "See an example confirmed receipt" → `W27~quiz_received`. Saving, offline, saveFailed and invalid win, with no opener, dialog or receipt link.
- **W26 not answerable.** No attempt: status, rules link and the off-home link. Received: "already handed in" and the receipt. Time up: "Time is up. Your answers are locked", the deadline, "no receipt exists until it is confirmed" and "Check status" → W27. No fields in any of these.
- **Sign in again (A1)** on W26 `sessionExpired` is preview-only ("switch the role in the viewer bar or follow the tour") plus a Help link (W12). No page link changes role; W25 → W58 and W27 → W53 in the journeys are carried by the tour bar.
- **W27** draws the receipt slip, "This receipt does not change", and the submitted answers as plain text. The released review shows only `resultFor` values (score, comment, release time) and the last release version; a held or absent result shows the release rule and "Nothing about marking is shown before release". Offline keeps the receipt and answers but replaces the review with "could not be loaded" and a preview-only Retry, so no stale score. No editing control, no attempt or release selector, no "start another" dialog.
- **Record-true links (A10).** W27's rules link is `P.recordGo("W25", "assessment", …)`; for Quiz 2 it is null, so no link is drawn and the page says "The rules page is drawn for Quiz 3 only in this prototype". W25 → W27 and W26 → W27 receipt links and W27 → W26 also go through `P.recordGo`.

## Committing actions with no result scenario

Start attempt (W25), Submit attempt (W26), Check for an active attempt, Refresh rules (W25), Save answer (W26), Retry and Download receipt (W27), and Sign in again (W26) are preview-only. The example links in the two dialogs open separate example records.

## Known gaps

- **Payload versus receipt.** The W26 dialog at its home clock confirms two saved answers, while the example receipt at its own clock holds four, because the fixture has the learner keep answering until later. The example-link wording says so; a fixture change would fix it (kit requests 1 and 2).
- **Placeholder choices** and raw `sample-answer-*` values stay visible until kit request 2 lands.
- **Choice placeholders are not disabled.** `K.choiceGroup` has no `disabled` option, so the placeholders are unselected but not disabled (kit request 6).

## Fix round 1 (inspection R01–R09)

- **R04 (W26).** Placeholder choices are now a plain `K.list` labelled "Choices are not in this prototype", so nothing can be selected (supersedes the note above until kit request 6 lands).
- **R08 (W27).** Only the default anchor falls back to W25's quiz when its receipt is not issued yet. Any other unresolved receipt (W27:quiz2 absent or not the viewer's) draws "This receipt is not available" with no quiz title, status or quiz links. Chosen by Claude under owner delegation.


## Inspection 2 fixes

INSP2-03: W27 renders released excused/missing outcomes with the kit status, omits a null score row, and retains receipt, comment and release metadata. Chosen by Codex under owner delegation. Regression coverage is in the segment test file; source checks only.

## Student record navigation

- Selected coursework, quiz rules and immutable receipts retain their course and record context. Released assignment feedback uses the receipt bound to its release snapshot; a quiz receipt shows only answers and feedback bound to that attempt. Excused and missing outcomes need no numeric score. Chosen by Codex under owner delegation. Source checks only; no browser or device acceptance.
