# Pages: the Phase 3 contract

Phase 2c built the page registry, a placeholder for every manifest page, the viewer and the build. Phase 3 replaces placeholders with real page files. This file is the contract for those files. All data is fictional. Every check here is a source check, not browser, device or accessibility acceptance.

## Where a page file goes

- One file per page: `pages/<segment folder>/<ID>.js`, for example `pages/seg3-submit/W19.js`.
- Folders: `seg1-access`, `seg2-course`, `seg3-submit`, `seg4-community`, `seg5-authoring`, `seg6-grading`, and `optional` for O01–O03.
- The folder must match the page's manifest segment. `tools/load_site.mjs` `pageFiles()` rejects a wrong folder, a nested file, a `.js` file not named `<ID>.js`, and a file whose `WB.definePage("<ID>"` literal does not match its name. `.md` notes beside page files are ignored.
- Files load in sorted order after `pages/register.js`, `pages/placeholder.js` and `pages/shared.js` (the frozen `WB.P` page helpers, third in `PAGE_PRE`; see `pages/SPINE.md`), plus `pages/calendar.js` (the shared pure calendar renderer), and before `pages/seal.js`. They are plain strict-mode scripts (an IIFE on `globalThis.WB`), like the kit.

## The definition

```js
(function (root) {
  "use strict";
  var WB = root.WB;
  WB.definePage("W19", {
    states: ["loading", "offline"],          // situations this page draws
    na: { conflict: "Nothing on this page can be edited by two people", … }, // every other state, with a reason
    variants: { "open-dialog": "Hand-in dialog open" },                     // optional named views
    render: function (a) { return { title: "…", body: "…" }; },
  });
})(globalThis);
```

Rules, enforced by `WB.definePage` (it throws `WB.definePage: …`):

- The id must be a manifest page, defined once, before sealing.
- `states` and the keys of `na` together cover all 16 manifest states, with no overlap and no unknown id.
- Each `na` reason is non-empty and at most 140 characters.
- A state that a failure scenario names for this page (`WB.data.scenarios.failures`) must be in `states`; it cannot be N/A. Example: W20 must draw `saveFailed`, `invalid` and `offline`.
- Variant ids match `^[a-z][a-z0-9-]*$`, never equal a state id, and have a non-empty label.
- `render` is a function. Entries are stored deep-frozen.

## What render receives and returns

`render(a)` gets one frozen object: `page`, `ctx`, `platform`, `sizeClass`, `orientation`, `tier`, `role`, `state` (or null), `variant` (or null), `scenario`, `view` (the scenario view from `WB.sel.scenarioView`), `who`, `sel`, `K`, `WB` and `ns`. The composer also accepts optional `calendar` cursor input for W07/W32 (`mode`, civil `day`, verified `courseId`, selected event); other pages ignore it. It is local UI state, not fixture data or an authority clock.

`who` is the frozen viewer `{role, personId, courseId}` from `sel.viewerFor(view, role)`: the persona for the role (student Aisha, instructor Reyes, TA Maya, in PHYS 110), or a guest with null ids. Pages never hard-code a person or course id; they pass `a.who.personId` and `a.who.courseId`. The `course` shell option comes from `sel.courseShell(a.view, a.who, {page})` or `{section}`, which is null when the role is not enrolled in the course.

It returns a plain object with string `title` and `body`, plus any shell option (`navActive`, `course`, `crumbs`, `back`, `actions`, `dialog`, `toast`, `links`, `mode`). It must not return `ns` or `hrefs`; the composer supplies them. Off the full tier, `body` must include `K.handoff(...)` (the composer checks for `wb-handoff--<tier>`); that check is the floor, not the whole tier obligation (see Tier obligations).

- Use `ns` as the prefix for every id the page emits, so the board can show three frames of one page side by side. The composer passes `ns` = `<stage ns>-c` (currently `p-c`); the shell uses the stage ns (`p`), the viewer chrome owns `v-*` and the board `b-*`. `check_render` enforces that ids are unique across the bar, the viewer chrome and every frame.
- Never mutate `view`, `sel` results or anything frozen. Build new objects.
- The role switch is not sign-in. If the role is not in `page.roles`, the composer shows a role-blocked notice and does not call `render`.

## Roles and scope

- Pass `a.who` to every scoped selector. A null result (or `[]` for a list) means "not yours to see": draw the permission notice, never a fallback figure.
- **TA scope is learners and questions** (R1, R2). A TA page reads `sel.taScope(view, assessmentId, a.who)` and draws only assigned learners and assigned questions: the question picker, marks, comments and receipt pages tagged to those questions. Where a selector returns `scoreWithheld: true` or `partial: true`, the page writes "Other questions are outside your grading task" and shows no whole-assessment score.
- TA pages branch on `sel.taTaskAccess(...).active` and `sel.taAccessActive`.
- After access ends (any clock at or after `access_end`, for example `ta_expired`):
  - W48, W49 and W51 show one info notice, "Your grading access for this course has ended", with the end date from `sel.accessEnd` and the task's assessment title, plus a link to W05. No learner names, counts, receipts, marks or totals.
  - W14, W18 and W19 show the published course content any TA sees, plus the same notice.
  - W53 shows the notice only.
- A TA on W53 before access ends sees their own completion status only (`reviewProgress`) and the line "Releasing feedback is the instructor's step". No candidate list, no preview, no totals, no Release control. `canRelease` is true for the instructor only.
- The `ta-expired` failure state applies to every page that allows a TA and draws learner data.

## Tier obligations

`a.tier` is the page's tier on the active platform (`page.platforms`, from `tracker/page_tracker.csv`, which applies the BD11 rule `tierFor` in `tools/page_meta.mjs`, T1-T5 in order). The tier takes precedence over every other description of the page on a device: draw what the tier allows, never more and never less.

- **full**: the whole page, no `K.handoff`. BD6 makes five staff pages full on iPad (W48, W49, W51, W53, W57); there W51 is a single-learner view and W53 review only (`IPAD_TIER_NOTES`).
- **handoff** (T3: W42, W60, O02 on iPad and iPhone): `K.handoff(ctx, {title, lastResult?, note?})` with "Open on a larger screen" and the last result only. No editing, no protective actions.
- **review** (T5: other staff pages on iPad or iPhone): the banner alone is not enough. Besides the `K.handoff` banner, the page draws the read-only record and status plus the protective actions its tier note names, as working kit controls (`K.handoff` `protectiveActions` or controls in the body). The tier note is `PROTECTIVE_NOTES["<ID>"]` in `page_meta.mjs` (the `tier_note` column of the page tracker), else `DEFAULT_REVIEW_NOTE`: "Read record, status, protective actions; Open on a larger screen". Example: W45 on iPhone must offer revoke, change end date and the pending invites (a quick revoke from a phone), not just a banner.
- Tier first, notes second: `PROTECTIVE_NOTES` also records iPad editing requests ("iPad: edit and publish", "iPad: move up/down buttons"). BD6 wins, so where the tier is review those requests are notes only: draw the review content and the narrow protective actions, never an editor.
- The composer checks only for `wb-handoff--<tier>`. A banner-only review page passes the source checks but is incomplete; protective actions are checked at Phase 3 review.

## Data, interaction and links

- **Derived values**: every count, date, time, total and percentage comes from a selector (`a.sel`, `a.view`). Never type a figure or date into page text and never recompute one a selector provides. Format with the selector helpers (for example `sel.fmtDateTime`) so every scenario clock agrees.
- **Disabled controls**: use `K.button({label, disabled: true, reason, id})`. The kit renders `aria-disabled="true"`, a visible reason and `aria-describedby` pointing at it; the control stays focusable. The viewer checks disabled first: a click does nothing and the status line announces the reason. Never fake a disabled control with styling or the native `disabled` attribute.
- **Preview-only actions**: a `K.button` without `act` does nothing in the prototype and the viewer says so; give it a `note` when a more precise message helps.
- **Links**: internal destinations use `go` (`go: "W20"` or `go: "W20:loading"`), which renders a `#/W20` href plus `data-go`; never hand-write a `#/` href. External `href` values are `https:` or `mailto:` only; `http:`, `javascript:`, `data:` and `//host` throw (`WB.safeHref`). Navigation is a link, never a button.
- **Grade and staff data**: pages never read `a.view.data.grades`, `.staff`, `.samples`, `coursework.drafts`, `question_ids` or any `pending` value directly. Use `resultFor`, `gradeRows`, `gradeDraftFor`, `gradebook`, `releasesFor`, `lastReleaseAt`, `draftFor`, `taScope` and `failureSample`. Staff outcomes not yet released are read from `resultFor(...).staffOutcome` or `gradeRows(...)[i].staffOutcome` (`{ status, score }`, or null; the score is null when `scoreWithheld`). `check_vocab` (`checkPageDataAccess`) enforces this for files under `pages/`.
- **Failure states** take their figures (file names, sizes, times) from `sel.failureSample(view, failureId, a.who)`; a null sample draws the permission notice.
- **W53 release**: list exactly the rows of `releaseReady`. A learner whose latest snapshot already carries the current revision is not listed; `revised: true` is labelled as a correction. The confirm dialog shows `releasePreview(...).fingerprint`. History comes from `releasesFor`, newest version first, and older snapshots stay visible.
- **Layout** uses `K.stack`, `K.grid`, `K.rail` and `K.split`. A `style` attribute fails `checkHtml` (only the kit progress bar width is allowed).
- **Go grammar**: `go` is `<page>[:<variant>][~<scenario>]`. The `~scenario` suffix switches the clock; the viewer never writes it into its own hashes.
- **Record links**: a link to a record page names the variant whose anchor is that record, or is plain text when no anchor or variant draws it. Activity and Home rows use the fixture `go` unchanged.
- **Dialogs**: `K.dialog(ctx, {id, title, body, actions})` with an `ns`-prefixed id. A view that shows the dialog open passes `open: true`; the composer reports it (`openDialogs`) and the viewer runs the full lifecycle: focus on the first Tab stop, a Tab trap in which a radio group is one stop, Escape and Cancel close, and focus returns to the opener, else the `<h1>`, else the stage. Openers are `K.button({act: "open-dialog", target})` and need no id. One modal at a time.

## Committing actions

A committing action (submit, release, group hand-in) is a `K.button` with `act: "open-dialog"`. The confirm dialog's primary item is a destination to the result page in the scenario where the record exists:

- Submit on W21 → `go: "W22~default"`.
- Release on W53 → `go: "W53~ps4_released"`.
- Group hand-in on `W21:motion` → `go: "W22:group~group_submission"`.

Never a button that does nothing, and never a direct link that skips the confirm.

## Anchor records and home scenarios

`manifest/anchors.js` is the source (`sel.anchorFor(pageId, variantId)` returns ids only; pages still read records through the scoped selectors). Every page with variants declares them in `definePage` with the same ids; placeholders carry them already and `check_render` reports a missing one. Outside its home scenario a page draws the truthful state for that clock.

| Page | Anchor record | Home scenario | Variants |
|---|---|---|---|
| W01 | course-level | `default` | none |
| W02 | course-level | `default` | none |
| W03 | course-level | `default` | none |
| W04 | course-level | `default` | none |
| W05 | course-level | `default` | none |
| W06 | course-level | `default` | none |
| W07 | course-level | `default` | none |
| W08 | course-level | `default` | none |
| W09 | course-level | `default` | none |
| W10 | course-level | `default` | none |
| W11 | course-level | `default` | none |
| W12 | course-level | `default` | none |
| W13 | course-level | `default` | none |
| W14 | `course:phys110-f26` | `default` | none |
| W15 | course-level | `default` | none |
| W16 | course-level | `default` | none |
| W17 | course-level | `default` | none |
| W18 | course-level | `default` | none |
| W19 | `assessment:ps4` | `default` | `motion` → `assessment:motion` (`group_work_in_progress`) |
| W20 | `draft:aisha-ps4-draft` | `assignment_submission` | `motion` → `draft:team-orbit-motion-draft` (`group_work_in_progress`) |
| W21 | `draft:aisha-ps4-draft` | `assignment_submission` | `motion` → `draft:team-orbit-motion-draft` (`group_work_in_progress`) |
| W22 | `receipt:AH-PHYS110-001` | `default` | `group` → `receipt:AH-PHYS110-GROUP-001` (`group_submission`) |
| W23 | `release:rel-ps4-1` | `ps4_released` | none |
| W24 | course-level | `default` | none |
| W25 | `assessment:quiz3` | `default` | none |
| W26 | `attempt:aisha-quiz3-1` | `quiz_in_progress` | none |
| W27 | `receipt:AH-PHYS110-Q3-001` | `quiz_received` | `quiz2` → `receipt:AH-PHYS110-Q2-001` (`default`) |
| W28 | course-level | `default` | none |
| W29 | `announcement:ann-quiz3` | `default` | `office-hours` → `announcement:ann-office-hours` (`default`) |
| W30 | course-level | `default` | none |
| W31 | `discussion:projectile` | `default` | none |
| W32 | course-level | `default` | none |
| W33 | `groupSet:lab-teams` | `group_work_in_progress` | none |
| W34 | `group:team-orbit` | `group_work_in_progress` | none |
| W35 | course-level | `default` | none |
| W36 | course-level | `default` | none |
| W37 | course-level | `default` | none |
| W38 | course-level | `default` | none |
| W39 | course-level | `default` | none |
| W40 | `assessment:ps4` | `default` | `motion` → `assessment:motion` (`default`) |
| W41 | `assessment:quiz3` | `default` | none |
| W42 | course-level | `default` | none |
| W43 | `rubric:ps4-rubric` | `default` | none |
| W44 | `rubric:ps4-rubric` | `default` | none |
| W45 | `person:maya` | `default` | none |
| W46 | `allowance:aisha-quiz3` | `default` | none |
| W47 | `groupSet:lab-teams` | `default` | none |
| W48 | `assessment:ps4` | `default` | none |
| W49 | `receipt:AH-PHYS110-001` | `default` | `ben` → `receipt:AH-PHYS110-002` (`default`); `group` → `receipt:AH-PHYS110-GROUP-001` (`group_submission`) |
| W50 | `rubric:ps4-rubric` | `default` | none |
| W51 | course-level | `default` | none |
| W52 | `policy:phys110-policy` | `default` | none |
| W53 | `assessment:ps4` | `default` | none |
| W54 | course-level | `default` | none |
| W55 | course-level | `default` | none |
| W56 | course-level | `default` | none |
| W57 | `task:task-maya-ps4` | `default` | none |
| W58 | course-level | `default` | none |
| W59 | course-level | `default` | none |
| W60 | course-level | `default` | none |
| O01 | course-level | `default` | none |
| O02 | course-level | `default` | none |
| O03 | course-level | `default` | none |

- W18 is course-level and lists Aisha's 8 items. Row links: ps4 → `W19` (or `W23` when released); motion → `W19:motion`; quiz3 → `W25`; quiz2 → `W27:quiz2`; every other row is plain text.
- W24 is course-level: Aisha's grades.
- W51 is the gradebook; its single-learner view is Aisha.

## Staff spine pages on iPad and iPhone

This table takes precedence over `DEFAULT_REVIEW_NOTE` for these four pages (`page_meta.mjs` is not edited). A protective action only withholds or flags; it never releases or changes a score. Each is a preview-only `K.button`.

| Page | iPad (full) | iPhone (review) | iPhone protective actions |
|---|---|---|---|
| W48 | whole queue | read-only queue with status and progress | instructor: "Hold release for this assessment"; TA: none |
| W49 | whole grader | read-only submission, marks and comments | "Flag for instructor review" (both); "Hold this result" (instructor) |
| W51 | single-learner view | single-learner read-only view | instructor: "Hold this learner's pending results" |
| W53 | review only: candidates, preview and history, read-only; no `K.handoff` (it throws on full); Release drawn as a disabled `K.button` with reason "Release from the web app" | read-only candidates and history | instructor: "Keep everything held" |

## Kit changes

After the Phase 2 gate, existing kit components, records and selectors do not change; additions go through the coordinator. Page files never patch `WB.K`, add CSS or edit `kit/`, `fixtures/` or `manifest/`. When a page needs a component, option, fixture record or token the kit lacks, add an entry to `design/final/kit_requests.md` (create it if absent): page id, what is missing, why the existing kit cannot express it, and a proposed API. One coordinator applies requests; until then, draw the page with existing components and note the gap.

Open gaps from the Phase 2 gate review (§4), recorded as kit requests and not built yet: a file picker, a page-viewer placeholder, number-field bounds, an unlabelled row checkbox, and a `cancelLabel` dialog option.

## Vocabulary

`tools/check_vocab.mjs` fails if any file under `pages/` quotes a kit status or flag label (for example the words the kit uses for statuses, such as received or released states). Get those labels from the kit (`K.status`, `WB.STATUS`, `WB.FLAGS`) and word N/A reasons around them.

## Checks to run after adding a page

```bash
bash -o pipefail -c 'node --test design/final/tools/index.js 2>&1 | tail -n 15'
bash -c 'node design/final/tools/check_render.mjs && node design/final/tools/check_vocab.mjs'
bash -c 'node design/final/build.mjs && node design/final/tools/check_size.mjs && node design/final/tools/check_offline.mjs'
node design/final/tools/check_all.mjs
```

`check_render` renders every page on all 5 contexts for every allowed role, the default view, each drawn state and each variant, plus every scenario clock for the default view. Each render must pass `checkHtml` and carry one `<main>`, one `<h1>` (outside access mode), its frame class and the tier handoff.

## Budgets

- App and board files: 900 KB each. Spec file: 1 MB. After the Phase 2 gate the spec is about 1,009 KB (it inlines the system CSS, so CSS growth counts against it). At Phase 2c the app was about 285 KB and the board about 275 KB. The spec is close to its budget; the pre-decided lever is cutting fix resolution text to 160 characters with a pointer to `tracker/fix_tracker.csv`.
- Every source file stays at or under 800 lines (`check_lines`).

## 2c decisions (chosen by Claude under owner delegation)

1. Placeholders mark all 16 states N/A with the reason "Not built yet: this page's situations arrive in Phase 3", so the situations menu is honest before Phase 3.
2. The placeholder links to its spec section (`Whiteboard-Final-Spec.html#spec-<ID>`) and lists page, route, roles, platform tier and segment.
3. A guest sees placeholders in access mode with a single Help link; other roles get the app shell with the matching nav item marked current.
4. Width and orientation are always stored in the hash and only take effect on their own platform, so switching platform and back restores them, with or without a reload.
5. A complete hash (`?v=1`) never inherits settings; a bare kit link (`#/W20`) inherits the current ones.
6. A tour survives only while page and role match its current step; any other change ends it with a "Tour ended" note.
7. The journey select is a picker; only "Start tour" starts a tour.
8. Sorting is not wired. The compact sort select shows the preview-only status and restores its rendered value.
9. The shell skip link moves focus in the frame without changing the hash.
10. Board frames are `inert` and `aria-hidden`; the board is a visual overview read through its "Open … in prototype" links. This is a known accessibility limitation of the board, not of the prototype.
11. Spec fragments are inlined as trusted generated HTML, guarded only against `<script` and attribute URLs. The spec page carries no script (`script-src 'none'`).
12. `check_offline` was built in 2c (Phase 4 lists it) because the build proof needs it. The other Phase 4 checks are `todo` stubs in `dist/verification.json`.
13. `viewer.css` lives in `system/` (assumption A1 held: system CSS was about 46 KB before it, under the 90 KB cap).
14. Stage frames use namespace `p` (shell) and `p-c` (page content); viewer chrome keeps `v-*` and the board `b-*`. `check_render` checks ids are unique across the bar, the viewer chrome and every frame.
15. Only one shell menu (iPad sidebar, iPhone Sections or Account) is open at a time: opening another closes the first. Escape closes a menu the viewer opened (by its toggle) and returns focus to its button. The iPad landscape sidebar drawn open on load is persistent navigation, not an overlay (it has no Hide button inside it), so Escape leaves it alone, as an iPadOS split-view sidebar does; only its toggle hides it.
16. A dialog consumes its Escape; the menu handler ignores Escape that was already handled or that arrives while a dialog is open.

## Phase 2 gate decisions (chosen by Claude under owner delegation)

17. Personas: student Aisha, instructor Reyes and TA Maya in PHYS 110 (`world.personas`); `viewerFor` keeps a role only when the enrollment grants it.
18. `canRelease` is instructor-only, and throws on a grading task that grants release permission.
19. A TA gets no course total.
20. Fail closed means null, or `[]` for lists.
21. `ps4_released` (27 Oct 2026, 4:00 PM) releases Aisha only; Ben stays not ready.
22. Failure samples store minutes before the clock, so every scenario draws a consistent time.
23. The `~scenario` link suffix.
24. A tour step applies its scenario and record variant; a manual clock change does not end the tour.
25. The committing-action rule above.
26. W53 on iPad draws no handoff and a disabled Release.
27. The iPhone protective actions in the staff device table.
28. A TA keeps course navigation after access ends (L8 deferred).
29. `style` is allowed only on the kit progress bar.
30. A TA's projections are limited to assigned questions; a partial task sees no whole-assessment score, total or overall comment.
31. A failure sample is returned to a TA only inside the task's learners and questions.
32. `manifest/anchors.js` is the single list of anchor records and variants; placeholders carry the variants.
33. A release candidate is a held payload not yet in the latest snapshot.
34. Results are compared with the latest snapshot; older snapshots are kept and integrity-checked.
35. The preview fingerprint hashes policy, receipt, rubric, draft payload, released snapshots and membership.
36. Activity links name a variant; "same record or same assessment" is the match rule.
37. The Quiz 2 attempt and receipt, and the Team Orbit draft, are reconstructed.
38. One held payload (the reviewed draft) feeds candidates, preview arithmetic and the fingerprint. Results' `pending` mirrors it, and `check_fixtures` enforces that.
39. A release preview or candidate list needs the assessment, the requested course and the grades policy to name the same course; otherwise it is null (REV-01).
40. Release readiness reads the current grade draft's `review_complete`; `check_fixtures` requires the review record to agree with it (REV-03). Every held draft needs exactly one result (REV-04).
41. A TA with a partial task counts a learner as reviewed when every assigned question is reviewed, the same rule as `gradeDraftFor` (REV-05).
42. The iPhone section menu is placed below the nav bar inside the screen, with a bounded height, and scrolls (REV-02).
43. The staff projections name the unreleased outcome `staffOutcome`, not `pending`, so a page can read it while the raw `.pending` ban stays (REV-06). Chosen by Claude under owner delegation.

## Instructor record selection (18 Nov 2026)

Chosen by Codex under owner delegation. Existing page IDs and legacy anchors remain. Optional `a.selection` is an immutable verified `{courseId,assessmentId,learnerId,receiptId}`. The composer resolves it through `sel.resolveTeachingSelection`; invalid/foreign/mismatched explicit IDs render a data-free unavailable view. `a.who` keeps the actual person's role/personId with the selected authorized course. No link impersonates a learner.

`WB.Teaching.go(a,page,overrides)` emits existing destinations with optional `tc/ta/tl/tr` query fields. Context-only links inherit role/platform/scenario; full reload hashes serialize the same selection. Course changes clear dependent records. `WB.Teaching.picker` and W45 navigate real enrolled learners on every tier. New helpers in `pages/teaching.js` load after shared/calendar helpers. Data selectors remain in fixtures, loaded before finalization.

Record-specific pages use the selected assessment/receipt; absent selection retains legacy anchors. A receipt-bound older attempt never inherits another attempt's draft/review/release labels. Batch release never takes a receipt-scoped target. New pure/source tests cover both courses, compact selection, reload/back, quiz evidence, empty/foreign IDs and intersecting TA scopes. These do not establish backend authorization, persistence or browser acceptance.
