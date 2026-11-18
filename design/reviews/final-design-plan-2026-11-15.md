# Whiteboard final HTML design: build plan (15 Nov 2026)

This plan was written by Fable (read-only planner) and saved by the coordinator. Its structural claims about the board were spot-checked: 1,844 lines, line 1618 holds 812,544 bytes, and `saf(` Safari frames appear 3 times. **Status: proposed; waiting for owner approval.** Nothing has been built.

Inputs: `design/reviews/board-deep-dive-2026-11-15.md`, `board-decisions-2026-11-15.md`, `research/ux/00_synthesis.md`, the board `~/Downloads/Whiteboard-Design-Board (1).html`, and the older `design/` engine.

## 1. Recommendation

**Rebuild in a new modular tree, `design/final/`.** Use the board as the visual and spec baseline and the older `design/` engine as the pattern for states, checks and click-through. Do not patch the board in place.

Why the board can't simply be patched:
- About 74% of it, 812 KB on one line (`const ZIPS`), is spec panels. The CSS is about 70 KB and the drawn screens about 176 KB.
- It's a generic template: the header still names the example app "Gather".
- Screens are static pictures. `btn()` makes a `<div>`, so there is no interaction.
- Data is typed into each screen (for example `relRow` with a literal `8 / 10`). That is the root cause of the grade leaks and count mismatches (fixes 2.5–2.7, 4.3, 4.4, 4.11, 6.3).
- The iPhone frames draw Safari (`saf()`), but iPhone should be the planned native presentation.
- The 8 theme and 5 logo switchers must not ship (fix 1.22, BD7).

| Option | Verdict |
|---|---|
| A. Patch a repo copy of the board | No. It can't fix the typed-data defects, has no interaction or native iOS, and breaks the 800-line ceiling. |
| B. Rebuild on `design/system` and the batch kits | No. It covers a different 50-destination product and loses the board's visuals. |
| C. New `design/final/`: board visuals, old engine patterns, fixture-driven | **Yes.** It fixes the root cause, one page definition serves three platforms, and every file stays small. |

How option C is built:
- **One design system.** `system/tokens.css` uses the `--wb-*` names, which are already contrast-checked by `design/tools/contrast.mjs`. Add the board's course colours and its info, neutral and fill roles. Keep teal plus dark only.
- **One set of fictional data.** `fixtures/*.js` (the Alder Hill world). Every count, date, weekday and percentage comes from a selector. Announcements and discussions get real records (fix 4.2).
- **One page definition, three platforms.** Each page is one file: `render({platform, sizeClass, role, state, fx})`. Shared adaptive pieces (`K.dialog`, `K.table`, `K.split`, `K.actions`) do the platform work, so this is 63 page files, not 189.
- **Size budgets.** App at most 900 KB, spec file at most 1 MB. Plain scripts register on `WB.*` and load in both Node `vm` and the browser. No dependencies.

```
design/board/Whiteboard-Design-Board-2026-11-04.html   read-only copy (Downloads original kept)
design/final/
  build.mjs
  manifest/  pages.js, navigation.js, journeys.js, states.js (16), status.js
  system/    tokens.css, base.css, components-*.css, shell-web|ipad|iphone.css, viewer.css
  kit/       core, components, signature, adaptive, shell-web|ipad|iphone, icons, course-art (.js)
  fixtures/  world, coursework, grades, quiz, groups, comms, calendar, staff, activity, scenarios (.js)
  pages/     seg1-access/ … seg6-grading/, optional/   (one file per page)
  viewer/    app.js, gallery.js, tours.js
  spec/      extracted panels (63 page specs + 28 documents)
  tracker/   fix_tracker.csv, page_tracker.csv
  tools/     extract_board.mjs, check_*.mjs, check_all.mjs
  dist/      generated, never hand-edited
```

## 2. Platform model

iPhone and iPad are drawn as the planned native iOS and iPadOS presentation, with no Safari chrome. Narrow web (390 px) is a width toggle on Web that follows BD1. It is not a fourth designed target.

| | Web | iPad | iPhone |
|---|---|---|---|
| Frame | 1280 px, narrow toggle at 390 | About 1194×834 landscape and portrait | About 393×852 with safe areas |
| Global nav | Sidebar: Today, Courses, Calendar, Activity, Tools | Collapsible sidebar | Tab bar with the same five items (BD1) |
| Course nav | Course tabs; staff sidebar with "Course tools" | Same; Tools popover | Section list and title menu |
| List to detail | Two columns | Split view in landscape; push in portrait | Push navigation |
| Dialogs | Modal | Form sheet or popover | Bottom sheet; full screen for capture |
| Primary action | Header toolbar | Header toolbar | Bottom dock |
| Targets | At least 24 px | 44 pt | 44 pt |

Staff tiers follow BD6. Each page × platform is one of three tiers:
- **Full:** the whole page is designed.
- **Review and protect:** read the record, see status and use protective actions, with "Open on a larger screen" for editing.
- **Handoff:** the last result plus "Open on a larger screen" (W42, W60, O02).

Part 5 and fix 5.18 ask for iPad editing layouts that BD6 rules out. **BD6 wins**, recorded as a clarification.

**Targets: 63 × 3 = 189, all reachable.**

| Platform | Full | Review and protect | Handoff |
|---|---|---|---|
| Web | 63 | 0 | 0 |
| iPad | 41 | 19 | 3 |
| iPhone | 36 | 24 | 3 |

Adding states gives an estimated 300–350 [est] state variants and about 1,000 [est] renders checked in Node.

**Viewer bar**, labelled "Prototype controls · fictional data":
- **Platform:** Web, iPad, iPhone, with iPad orientation and web width.
- **Role:** Student, Instructor, TA, Guest. Labelled as a role switch, not sign-in.
- **Scenario clock:** default Tue 20 Oct 4:00 PM, plus hand-in, group, quiz and TA-access-ended scenarios.
- **State:** an "Other situations" menu drawn from the 16 states, with an N/A reason where a state doesn't apply.
- **Appearance and text:** System, Light or Dark; Default or Larger text.
- **Journeys:** J01–J12 as guided tours.
- **Deep links:** the view is stored in the URL hash.

## 3. Fix intake

**`design/final/tracker/fix_tracker.csv`.** Columns: `fix_id, source, type, severity, pages, platforms, roles, journey, rule_ref, decision_ref, resolution, owner_file, check, status, notes`.

Rows come from these sources:
- `DD-1.01`…`DD-6.20`: 118 deep-dive fixes (6.07 Withdrawn; duplicates marked).
- `BD1`–`BD10`: board decisions.
- `UX-R01`–`UX-R12`: one row per affected page (about 40).
- `JW-*`: journey walk findings.
- `C4`–`C6`: open conflicts.
- `IMP-*`: Impeccable findings.

Status values: Open, Decided, Implemented, Source-checked, Browser-checked, Owner-accepted, Withdrawn, Duplicate-of.

**`page_tracker.csv`:** 189 rows, each with its tier and six separate statuses: specified, HTML implemented, source checked, browser checked, accessibility reviewed, owner accepted.

Order of application:
1. Rule conflicts and decisions.
2. Status vocabulary and tokens.
3. Data, in fixtures.
4. Links, in the manifest.
5. Missing states.
6. Copy.
7. Device items.

**Journey walk (step 2 of the UX plan)** in Phase 1, before building. Four Fable reviewers take three journeys each, as every role. Severity is scored 0–4 against the 12 UX rules, the role files and Nielsen's 10 heuristics. Output: `design/reviews/journey-walk-2026-11.md`. A second walk runs on the built prototype in Phase 5.

**Proposed decisions**, to be recorded "chosen by Claude under owner delegation":
- **C4, release recall: none.** The release dialog says: "Students keep this result. You can correct it later. The correction is logged and students see 'Feedback updated'."
- **C5, anonymous grading: an optional "Hide learner names while grading" per assessment.** Default off; locked after the first receipt. Stable aliases in random order. Names return at release. Regrades are always named.
- **C6, student label: no change at grading.** The student sees "Received · Feedback not released yet" until release.
- **BD9, status word:** "Received" is the status and "Submit" is the verb. The synthesis's "Submitted" is replaced.
- **BD10:** iPhone and iPad are drawn as planned native apps; narrow web follows BD1.

Proposed defaults for the other rule conflicts:

| Fix | Proposed default |
|---|---|
| 1.02 | Mask the wrong-account details on W03 |
| 1.15 | Receipts are always emailed; other email is off by default |
| 2.01 | Registrar classes get a "Class notice"; Cancel only for Whiteboard events |
| 2.08 | Module completion stays separate from submission |
| 2.11, 6.16 | The instructor sets grading deadlines |
| 3.04 | W21 confirms the exact payload |
| 3.09 | The total moves with release, and the preview shows 84.50% → 85.17% |
| 3.10 | The letter grade comes only from W52 |
| 4.06 | Announcements can be withdrawn, with history |
| 5.05 | W59 copies no announcements |
| 5.07 | Bank questions are pinned |
| 6.01 | A TA sees a read-only calculation for assigned examples |
| 6.04 | The regrade example is re-based on Quiz 2 |

## 4. Phases

All checks are dependency-free Node scripts. `node design/final/tools/check_all.mjs` runs them and writes `dist/verification.json`. Source checks are not browser, device or accessibility acceptance.

| Phase | Work | Accept when / proof |
|---|---|---|
| 0 Baseline | Copy the board into `design/board/`, extract the specs, seed the trackers | Copy byte-identical; counts 211 = 120 + 63 + 28; 118 DD rows (22, 16, 22, 18, 20, 20), 28 conflicts. `extract_board.mjs --verify`, `check_tracker.mjs` |
| 1 Journey walk and decisions (alongside 2) | Walk 12 journeys by role; record decisions | No conflict left Open; every severity 3–4 finding resolved |
| 2 Foundation and spine | Tokens, kit, three shells, viewer, fixtures, manifest; spine J02→J03 (W14, W18–W24, W48, W49, W51, W53) on all platforms. **Owner looks at the spine before fan-out.** | `check_tokens` (4.5:1 text, 3:1 controls, light and dark), `check_fixtures` (2026 weekdays, 84.50%, 85.17%, W25 at 11:29 PM, TA access ends 25 Oct), `check_manifest` (63 pages, routes), `check_vocab` |
| 3 Pages by segment | Six parallel builders, one `pages/segN/` each | Segment rows Implemented; `check_render` (valid HTML, named buttons, no undefined or NaN); `check_lines` (no file over 800 lines) |
| 4 Integration | Tours, links, gallery, spec output | `check_links` (12 journeys walkable), `check_reach` (189/189), `check_leaks` (no scores in previews; no held values in student renders), `check_authority` (no TA release or preview, no staff route into W33/W34, receipts not editable), `check_fictional`, `check_offline`, `check_size`; the old `design/tools/check_batch.mjs` still passes |
| 5 Lint and review | Review Impeccable's source, then `npx impeccable detect design/final/dist` (and on the board copy, for before and after); Fable runs the second walk and a source-level accessibility review | No severity 3–4 open; every Impeccable finding fixed or dismissed with a reason |
| 6 Acceptance (user-assisted) | Owner opens the files by double-click (no localhost). `acceptance/checklist.md` covers: keyboard walk, 200% zoom, 320 px reflow, dark, larger text, reduced motion, VoiceOver spot check | Results recorded in `page_tracker.csv`; device status stays "Not run" |
| 7 Closeout | Owner accepts each segment; update NOTES, CLAUDE and README | No commit unless asked |

## 5. Work split

File-changing work runs through `/team` after `/clear`.

| Phase | Agents | Model | Owns |
|---|---|---|---|
| 0 | 1 | Haiku, with a Fable spot-check | `design/board/`, `spec/`, `tracker/` |
| 1 | 4 + 1 | Fable | Journey-walk files, decision rows |
| 2a / 2b / 2c | 1 each | Opus | `system/` + `kit/`; `fixtures/` + `manifest/`; `viewer/` + `tools/` + `build.mjs` |
| 2 gate | 1 | Fable | Review only |
| 3 | 6 in parallel | Opus | One `pages/segN/` each (about 9–14 pages) |
| 3 support | 1 | Haiku | Tracker statuses, copy sweeps |
| 4 | 1–2 | Opus | `viewer/tours.js`, link fixes |
| 5 | 1 + 1 | Fable reviews; Haiku runs checks | Review files, `IMP` rows |
| 6 | Owner + 1 | Fable records results | `acceptance/` |

The kit and fixtures freeze after the Phase 2 gate. Builders ask for changes through `kit_requests.md`, which one coordinator applies.

## 6. Risks and open owner decisions

**Risks**
- **Size of the job.** If time runs short, cut state depth on Stage 3–4 pages, not platforms.
- **The handoff folder (`handoff/academic-webapp-2026-11-04`) is not on disk.** Fixtures will be reconstructed from the board's fixtures panel and labelled as reconstructed.
- **Native look in HTML is an approximation.** It is labelled "planned presentation".
- **Browser acceptance needs owner time.** Until then every row stays "Not run".
- **`design/build.mjs` says narrow web has no tab bar.** BD1 supersedes that for this app. D59 and D60 still hold.

**Owner answers (15 Nov 2026)**
1. iPhone and iPad are drawn as native apps (chosen by Claude under owner delegation).
2. Handoff ZIP: the owner doesn't have it. Fixtures are reconstructed from the board's fixtures panel and drawn screens, and labelled "reconstructed".
3. Impeccable: approved. Review its source before running it.
4. O01–O03 are included, off by default (chosen by Claude under owner delegation).
5. Commit: not now. Don't commit or push until the owner asks.

## 7. What the owner gets

Three offline files in `design/final/dist/`:
1. **`Whiteboard-Final.html`:** the whole product as a click-through. Pick Web, iPad or iPhone and a role, click through or follow the 12 journeys, and switch light or dark, text size, scenario date and situation.
2. **`Whiteboard-Final-Board.html`:** every page side by side on all three devices with its states.
3. **`Whiteboard-Final-Spec.html`:** the page specs, decisions and fix list, showing what was fixed and how it was checked.
