# Phase 3 spine pages: notes

The twelve spine pages (W14, W18–W24, W48, W49, W51, W53) on web, iPad and iPhone. Read with `PAGES.md`, which stays the contract. Everything below was **chosen by Claude under owner delegation** (16 Nov 2026) and is recorded here rather than in `decisions.md`, which is inlined in the spec. All records are fictional and local. These are source checks only: no browser, keyboard, screen-reader or device check has run.

## Shared helper file

`pages/shared.js` defines the frozen `WB.P` helpers. It loads third in `PAGE_PRE` (after `register.js` and `placeholder.js`, before the page files). Every helper takes the frozen render argument `a` first, composes only `a.K` and `a.sel`, and returns strings or plain values. Pages never type a date, percentage, score, or person, course or receipt id; every figure comes from a selector.

Main helpers:

- `P.na(drawn, own)`: N/A reasons for every manifest state the page does not draw. Shared defaults, with page-specific overrides.
- `P.recordVariant`, `P.suffix`, `P.assessmentId`: the record behind the view. Presentation variants change what is drawn, never which record.
- `P.draftOf`, `P.receiptOf`, `P.noDraft`: the anchor draft or receipt at this clock (rule R-truth).
- `P.closed`, `P.closedButton`: R04 closing time. A draft stays viewable after close, but no submit opener, dialog or receipt destination is drawn.
- `P.taEnded`, `P.taUnallocated`, `P.staffGate`: R12 access branches. Each staff page runs them first and shows no learner data.
- `P.handoff`, `P.bareHandoff`: the review-tier handoff. The authority, permission and expiry branches carry a data-free handoff (R05).
- `P.status`, `P.score`, `P.when`, `P.recordGo`, `P.offHome`, `P.tray`, `P.tagRows`.

## Rule R-truth

A page reads its anchor record through scoped selectors at the current clock.

- When the record does not exist at that clock, the page draws the truthful status for that clock and a link to the page at its home clock (`P.offHome`). For example, W20 and W21 at `default` show "already handed in", and W23 at `default` shows "Feedback has not been released".
- A state token that needs the record draws the off-home view too.
- Authority branches (role, TA scope, access ended, null selector) run before state branches.
- W20 and W21 count a draft only when its id equals the W20 anchor draft id.
- W22 counts a receipt only when its id equals the W22 anchor receipt id.

## Assumptions

- **A1.** A count or sum derived from a record that a selector returned counts as selector-derived. Examples are the total pages on W21 (summed `files[i].pages`) and the pending-file count from the offline sample.
- **A2.** Pages read `a.view.data.coursework.assessments`, filtered by course and `published`, through `P.assessments`, because no selector lists a course's published assessments. This is kit request 7.

## Presentation variants

These variants map to the default record (`P.recordVariant`), except `motion-reviewed`, which maps to the motion record.

- **W21 `reviewed` and `motion-reviewed` (R11).** The review checkbox is checked (preview only) and the Submit dialog opener is enabled.
  - The default and `motion` views draw the checkbox unchecked. Submit is disabled with the reason "Confirm you have reviewed this exact attempt first", and a link "I have reviewed it" leads to the reviewed variant.
- **W21 `confirm`.** The Submit dialog is drawn open. It holds the exact payload: assessment, attempt, files with sizes and pages, total pages, due time, assessment version and, for the group draft, the members and membership version. Its one primary destination is the receipt at its home clock. Choosing `confirm` implies reviewed.
- **W53 `acknowledged` (R14).** The preview acknowledgment is checked and the Release dialog opener is enabled.
  - The default view draws it unchecked, with Release disabled ("Acknowledge the exact preview first") and the link "I have checked it".
- **W53 `confirm`.** The Release dialog is drawn open with the recipients, the held-back names, the score and comment summary, the fingerprint, and one destination, `W53~ps4_released`. Choosing `confirm` implies acknowledged.
- **Blocking states always win over these variants.** Closing time, offline, conflict, saving and a coverage gap (W21) block the action, and so do a stale preview, offline and nothing ready (W53). A blocked action is drawn disabled with its reason, and no opener or dialog is drawn.
- The viewer applies either a state or a variant, never both. The state+variant combinations are proved by direct renders in `tools/spine.test.mjs` and `tools/spine-authority.test.mjs`.

## Learner sources

- **W23 and W24 instructor preview.** The learner is the student persona (`P.learnerId`: `viewerFor(view, "student").personId`). The page draws only the released projection: status, score, comment and question comments from `resultFor`, and `courseTotal` / `categoryPercent` with `{as: "learner"}`. It never reads `staffOutcome` or `scoreWithheld`.
  - `K.status` is role-aware, so it cannot draw learner-only labels for an instructor. On W24, a row the learner cannot see yet reads "Learner sees: not released yet". A released row shows its staff status.
- **W51 single-learner view (iPad and iPhone).** This view shows the student persona's gradebook row, or the first row when that learner is outside a TA's scope. The web view draws the whole table.

## Other choices

- **Access branches.**
  - An active TA on `permissionUnavailable` gets the permission notice, not the expiry notice, so no end date is invented.
  - On W53, an active TA with the task sees only "You have reviewed x of y" and "Releasing feedback is the instructor's step", whatever the token (T5).
- **W53 release scope** is the fixed, read-only list of `releaseReady` included rows (R02). There are no checkboxes. Held-back rows sit in their own list and link to the grader.
- **W53 on iPad** is review only. Release is always disabled ("Release from the web app"), and no dialog is drawn.
- **W53 on iPhone** is a handoff with "Keep everything held", read-only scope and history, and no preview figures.
- **W49 conflict (R15).** Only the instructor gets "Keep mine", "Use theirs" and "Compare". A TA gets "Compare", "Ask the instructor to resolve" and the line "Only the instructor can resolve a competing review".
- **W49 visibility line (R16)** is derived from `resultFor`, its `releasedAt` and `staffOutcome`.
- **W51 received, unreviewed cell (R13)** shows the kit received status and "Not in the total until released", with no score. A null cell stays blank.

## Fix round 1 (SPINE-01 to SPINE-06)

- **W53 exact preview (SPINE-01).** Each preview block lists every rubric question with its mark and comment from `releasePreview(...).inputs.draft`, read-only on web and iPad. The confirm dialog summarises each learner's total, per-question marks, question comment count and whether an overall comment is included.
- **W21 coverage gap (SPINE-02).** Gaps are computed from the draft's page tags whatever the state token. Any gap disables Submit ("Add a page for Question(s) … first") on default, reviewed, confirm and motion-reviewed, with no opener, dialog or W22 link.
- **W49 review tiers (SPINE-03, SPINE-04).** On iPhone the conflict notice keeps the details and "Compare" (a TA also keeps "Ask the instructor to resolve"); "Keep mine", "Use theirs" and "Retry save" are full-tier only. The read-only view shows the total, reviewer, reviewed time and overall comment, except to a partial TA.
- **W49 overall comment (SPINE-05)** is disabled with the same reason as the criterion fields when offline or saving.
- **W51 learner list (SPINE-06).** A null cell has no text; a status-only outcome (excused, missing) shows only its status, with "Not released" when held. Tests: `tools/spine-fixes.test.mjs`.

## Fix round 2 (SPINE-07 to SPINE-11)

- **W49 completion (SPINE-07).** "Save marks" and "Mark review complete" are judged separately. Completion is disabled with a reason when saving or offline (the field lock reason), invalid, in conflict, on saveFailed ("Save the marks first"), or when the draft is missing or any in-scope question has no mark ("Enter a mark for every question first"). "Retry save" stays in the saveFailed notice.
- **W21 and W53 confirmation boxes (SPINE-08)** are drawn as disabled `K.field` checkboxes (the kit supports `disabled` with a reason): they show the variant, and links switch it. Unreviewed links to reviewed ("I have reviewed it", "I have checked it"); reviewed, motion-reviewed, confirm and acknowledged link back ("Not reviewed yet", "Not checked yet"). When Submit or Release is blocked, the box shows the block reason instead.
- **W48 iPhone offline (SPINE-09).** The review tier shows the offline notice and the last-known flag through the same helper as the full tier.
- **W51 native filteredEmpty (SPINE-10).** On iPad and iPhone the filter-empty message and preview-only "Clear filters" are drawn before a learner is chosen, with the handoff kept; no learner grades or totals.
- **Test entry (SPINE-11).** `tools/index.js` imports every spine test file, so `check_all` runs them. Tests: `tools/spine-fixes2.test.mjs`.

## Fix round 3 (SPINE-12 and SPINE-13)

- **W49 release link (SPINE-12).** "Go to release" goes to `P.recordGo("W53", "assessment", receipt.assessment_id)`. When no anchored W53 destination exists for that assessment, no release link is drawn. Group receipts get none; the PS4 default keeps `W53`. Tests: `tools/spine-fixes3.test.mjs`.
- **W21 saving (SPINE-13).** While saving, Edit work and Cancel review are disabled buttons with the reason "Your submission is still sending", and the Add work back link is not drawn. Default and motion variants are covered by the same test file.

## Drawn states per page

| Page | Drawn states | Variants |
|---|---|---|
| W14 Course home | loading, offline, permissionUnavailable | none |
| W18 Coursework | loading, firstUseEmpty, filteredEmpty, offline, permissionUnavailable | none |
| W19 Assignment detail | loading, offline, notYetAvailable, permissionUnavailable | motion |
| W20 Add work | loading, invalid, saving, saveFailed, offline, deviceDenied | motion |
| W21 Review and submit | loading, invalid, saving, conflict, offline | motion, reviewed, motion-reviewed, confirm |
| W22 Receipt | loading, offline, success, permissionUnavailable | group |
| W23 Released feedback | loading, offline, permissionUnavailable | none |
| W24 Course grades | firstUseEmpty, loading, offline, permissionUnavailable | none |
| W48 Grading queue | permissionUnavailable, loading, firstUseEmpty, filteredEmpty, offline | none |
| W49 Grader | permissionUnavailable, conflict, loading, invalid, saving, saveFailed, offline | ben, group |
| W51 Staff gradebook | firstUseEmpty, loading, filteredEmpty, offline, permissionUnavailable | none |
| W53 Feedback release | conflict, loading, offline, success, permissionUnavailable | acknowledged, confirm |

Every other manifest state has an N/A reason of 140 characters or fewer in the page definition.

## Phase 4 navigation integration (17 Nov 2026)

Chosen by Codex under owner delegation. W49 now offers the instructor a "Preview rubric-change impact" link only when the receipt's scoped rubric resolves through `P.recordGo` to W50. The instructor's PS4 and Ben views link there on all platforms; group receipts, permission states and TA views do not gain the link.

`tools/check_navigation.mjs` checks actual internal links (including shell hrefs) across every allowed role, five contexts, scenario clock, applicable state and variant. It resolves them through the viewer reducer and checks destination roles, tokens, scenario notes and rendering. Each of the twelve tours is walked through Start/Next with exact page, role, scenario, token and position assertions. Twenty-six core same-role transitions additionally require matching links in real page output; confirmation presentation variants may expose the link. Role/time handoffs and editorial transitions remain explicit tour steps, not page links that change identity.

Reach coverage comes from the rendered board index and gallery links, parsed and normalized back into real prototype frames in all five contexts, including optional pages. It covers 189 page×platform targets. Mutation tests reject broken links, missing required hops, lost tour clock/token, gallery omissions, missing index entries and placeholder output. This is source evidence only; browser, focus, keyboard and device acceptance remain unrun.


## Workspace visual refresh

Chosen by Codex under owner delegation (17 Nov 2026). Shared workspace CSS updates navigation, typography, surfaces, row alignment, responsive live-web layout and planned native frames. The gallery keeps fixed device dimensions. W18 has real todo/handed/feedback presentation filters with own published rows; W05 separates submitted work from pending versus released feedback. Existing record, role, release and receipt rules continue to apply. Preview settings default closed; tour-end focus returns to the visible summary. Source tests pass; the new layout has not passed browser/owner acceptance.


## Role workspaces and record consistency

Chosen by Codex under owner delegation (17 November 2026). W05 has a student task view, instructor review/release view and TA allocation view. W06 opens W14 for students and the read/edit W35 for staff on the represented course. Staff W14 is an explicit published-content preview, not learner impersonation; it returns to the builder without showing a grading dashboard. W18 instructor planning uses verified `sel.courseAssessments`, including unpublished items, and exact W40/W41 editors; learners remain published-only. TA rows include only active per-assessment allocations.

`P.gradingGo(a, assessmentId)` resolves a supported queue or a selector-authorized receipt for the same assessment; it never falls back to a different assessment. `P.taTaskEnded` and `P.taTaskEndedNotice` use that task's cutoff. A missing task is distinct from an expired one. Course-wide expiry remains separate. W48's PS4 queue/counts exclude Motion receipts, which have their own labelled section; W53 preserves the limited TA handoff and blocks expired task links.

Student released totals match the staff released-total column. The separately labelled staff total may include held work. Review completion does not release results. Quiz close time is authoritative across coursework, management, builder and calendar views. Source/mock tests cover these agreements; browser acceptance remains unrun.

## Instructor completion (18 Nov 2026)

Chosen by Codex under owner delegation. W45 opens course-scoped student work/grades; W51 links each configured cell and supplies compact learner selection. W18/W35 connect all represented assessments to record-selected W40/W41/W48/W53. W49 reads the selected accepted attempt, filters grading/release state by receipt, and exposes acknowledged submitted quiz answers. Grade-only/no-upload records remain explicit. W52 now reads actual configured policy weights and rules.

Multi-course grade projections resolve explicit policies without PHYS fallback; the original PHYS golden values and fingerprint remain. MATH supplies two attempts, an ungraded practice item, a manual held result and an exact local release scenario. W57 distinguishes no TA from no allocation, shows actual task question scope, instructor coverage and fictional takeover history. Staffing and release examples are scenario transitions, not persisted changes. See the completion review for proof and limits.

## Whole-prototype cross-check (18 Nov 2026)

Chosen by Codex under owner delegation. Student entries, coursework/results and module links now use selected-course records. Feedback files and receipt links bind to the released snapshot; quiz receipt answers bind to the exact acknowledged attempt. Nonnumeric released outcomes do not create a numeric figure. Exact own issued receipts remain readable after unpublication without exposing current unpublished payload. Receipt owner and captured group ID govern record identity; current membership cannot rename a historical receipt.

Course-level links clear subordinate selection, while record variants select their actual assessment. Incompatible legacy draft/attempt/rubric selections deny; presentation tokens keep the correct default. Batch release accepts assessment scope only, never an individual learner/receipt query. Staffing examples select the authorized course their fixture changes. New whole-context/student regressions supplement existing source gates. Real browser/device acceptance remains Not run.
