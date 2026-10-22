# Whiteboard — handoff to Claude

> **Update 16 Oct 2026:** the design sequence below is done. All 100 targets are drafted, committed as `8eba7f2`, and D1–D58 are owner-accepted. For the current state and next steps, see [NOTES.md](NOTES.md) and `design/SESSION_NOTES.md`. The rest of this file is the original handoff.

Current snapshot: **15 October 2026**. Purpose: carry the existing product/research work into detailed page design for web and iPhone. This document supersedes historical completion/count statements for current status; it does not erase the underlying audit history.

## 1. What we are building

Whiteboard is an LMS-first university platform for US higher education. Make courses, work, submissions, assessment, feedback and the next action clear. Connect scheduling/rooms, events/organizations and later student-support handoffs through consistent identity, calendar, status and permissions. The quality bar is clean, fast, obvious, restrained and accessible. Avoid generic gradient/emoji marketing layouts.

“One platform” means coherent experiences and reliable handoffs, with specialist records remaining authoritative where appropriate. It does not commit us to replacing the SIS, finance, payroll, clinical systems, housing allocation or library operations. AI is optional, permission-scoped and reviewable; no autonomous final grading or opaque consequential student labels.

## 2. What is finished, and what is not

| Workstream | Current state | Main entry |
| --- | --- | --- |
| Market/product research | Organized desk-research packet and offline report, dated October 2026; not primary customer validation or legal advice | `research/synthesis.md`, `research/report/index.html` |
| Product showcase | 40 local concept workspaces, six guided examples, revised fictional state/actions | `Claude outputs/Pellwin-Showcase.html` |
| Showcase audit/corrections | 38 tracked items: 27 Done (source/state), 8 Implemented/unverified, 3 blocked browser gates | `showcase/05_update_tracker.csv` |
| Screen inventory/coverage review | Exact current 40 plus ten proposed additions; expanded-flow gaps recorded | `showcase/08_screen_inventory.md`, `09_screen_coverage_gaps.md` |
| Whole-product navigation atlas | 50 destinations × web/planned iPhone, 147 transitions, 15 journeys; offline HTML with searchable directory, state notes and handoffs | `showcase/app_map/index.html` |
| Detailed final page design | **Next phase. Not accepted or complete.** Existing concept/mockups are inputs | `design/README.md`, `design/screen_tracker.csv` |
| Production system/native iOS | Not implemented | Separate future engineering scope |

All iOS designs are planned interpretations. Twelve staff destinations recommend web for dense/bulk work: S18, S19, S22, S24, S25, S37, S38, S39, S40, P47, P49, P50. Phone scope still needs a deliberate capability decision, not an automatic promise of parity.

The 100-target count excludes dialogs, role variants, loading/empty/error/permission/offline states and themes. Those are real design work and must be specified inside each target. Fifty is the **current planning baseline**, not a permanently final production route count. P41–P50 remain visibly proposed; designing them does not prove institutional validation or implementation.

## 3. Read in this order

1. This handoff and `CLAUDE.md`.
2. `research/synthesis.md`; relevant `research/01_lms` through `06_student_success_advising/opportunities.md`; inspect CSV/source evidence when using market claims. Research report is not the product showcase.
3. `showcase/README.md`, `src/CONTRACT.md`, `05_update_tracker.md`, and the correction sections of `07_readiness_recheck.md`.
4. `showcase/08_screen_inventory.md`, `09_screen_coverage_gaps.md`, then `app_map/README.md`, `screens.json` and `routes.json`. Inspect the atlas visually when permitted.
5. `design/README.md`, `screen_tracker.csv`, `state_checklist.md`, `decisions.md` and `SESSION_NOTES.md`.
6. Relevant showcase renderers/styles before editing. Read large files in slices. Do not reread every historical log before useful work.

## 4. What changed during the completed work

The original functional/control audit is in `docs/Pellwin-Functional-Audit.md` and `docs/Pellwin-State-and-Control-Inventory.md`. They document historical baselines, not the final state.

The showcase grew into role-based student, instructor/TA, scheduling, campus-life, support and institution/IT workflows. Subsequent revisions corrected per-learner submissions, answer-specific feedback/review, exact feedback-release scope/snapshots, excused grade treatment, AI-policy consistency, booking/event commitments, repeatable resets and invalid/locked edits. Added shared module/course state, quiz authoring/attempt policies, learner allowances, course/assignment creation, sample attachments and inspectable rollover destinations.

Campus revisions connected waitlist/pass/check-in eligibility and calendar participation, organization officer handoff and referral correction/history. Institutional concepts added inspectable rejected source rows/retry, migration decisions/exceptions, fictional access expiry/audit, portable sample exports and responsibilities. These remain local demonstrations.

A later readiness recheck found four further defects, all corrected: quiz submission contents changed with later authoring; unrelated assignment deadlines changed quiz feedback; reading-completion labels leaked between modules; modified workspace clicks lost native behavior. Regression checks cover the fixes. Submitted snapshots/history, independent quiz deadlines and per-module completion are important contracts to preserve.

The screen-count review identified ten absent standalone workspaces: institution sign-in, invitation, onboarding, profile, global search, technical help, content editor, resource library, rubric builder and initial institution setup. The atlas then documented all 50 destinations separately for web and planned iPhone. Independent atlas review corrected distinct quiz publication/release routes, responsibility-handoff labels, shared tools with role-aware returns and complete printing after filtering. The original showcase was preserved during atlas creation.

## 5. File map and editing rules

| Path | Use |
| --- | --- |
| `research/` | Research narrative, competitors/features/pain CSVs, evidence and synthesis; source claims and scope decisions |
| `research/report/index.html` | Research presentation, **not** the product prototype |
| `showcase/src/{core,content,student,teaching,campus,institution,controller}.js` | Editable showcase records, render/action registries, story and interaction controller |
| `showcase/src/styles.css` | Existing offline theme/layout/responsive styles |
| `showcase/src/CONTRACT.md` | Records, renderer purity, actions, snapshots, sample actor and validation rules |
| `showcase/build.mjs` | Rebuilds the legacy-named product HTML |
| `showcase/archive/` | Preserved originals: do not edit |
| `showcase/tools/`, `showcase/review/` | Local checks, historical probes and verification evidence |
| `showcase/app_map/screens.json` | Detailed per-screen content/actions/states and platform presentation; main design brief data |
| `showcase/app_map/routes.json` | Directed transitions, conditions, role handoffs, shared navigation and guided journeys |
| `showcase/app_map/{view.js,app.js,styles.css,build.mjs}` | Editable atlas UI/build sources; rebuild `index.html` |
| `design/` | New design-phase tracker, state checklist, decisions and resumable session notes |

Start new design explorations under `design/` (for example, a batch-specific preview) while keeping the existing showcase and atlas intact. Record the actual editable source and preview path in the tracker. If improving the existing showcase directly, edit its sources and keep behavior/contracts passing. Do not silently replace the stack with React/Next/Expo, treat an HTML phone frame as a native application, or build production services as an incidental design step.

## 6. Recommended design sequence

1. Confirm existing visual language; document typography, semantic colors, spacing, controls, layout/navigation, focus and motion in `design/decisions.md`. Establish light/dark and web versus iPhone patterns with realistic coursework.
2. Design one complete student course-to-submission-to-feedback journey: S01–S09. Include camera/file denial, interruption, receipt and held/released feedback. Review the batch before applying it everywhere.
3. Complete course access/content and assessment authoring: P41–P44, P47–P49, S14–S16; connect the learner preview. Proposed entries retain their label.
4. Finish assessment integrity and student everyday work: S10–S13, S17–S23, P45–P46. Include TA scope, exceptions, feedback release and official-record boundaries.
5. Design scheduling/rooms S24–S27 and events/organizations S28–S33, respecting authority, approval and capacity states.
6. Design support S34–S36 and institution/IT S37–S40 plus P50. Keep student-safe views separate from confidential staff context.
7. Review all 15 journeys end to end across roles and platforms; close shared state/variant work and run permissible browser/device checks.

This is a suggested execution order, not a claim that all of the broad product must launch together. Research recommends an LMS-first pilot; the design atlas documents the wider vision. Do not add features merely to make the count larger.

## 7. Acceptance and known limits

Each target needs a defined role/purpose, entry/exit and back behavior, realistic content, working specified interactions, error/recovery states, permission boundaries, light/dark behavior and readable narrow layouts. Native design should describe system authentication/camera/file access and safe area/keyboard behavior explicitly. Dense staff phone views must state what can be completed versus reviewed or handed off.

Actual browser visual, focus/keyboard, screen-reader, overflow/zoom, console, download/print and fresh-reviewer usability checks are **still unverified**. The earlier local-file URL-policy restriction was respected; do not evade it using localhost or a different route. A future agent should use a permitted environment or ask for user-assisted inspection and record the evidence. No iOS device or simulator acceptance exists. Never promote source tests to accessibility or device conformance.

Research/audit files preserve older statements. In particular, the synthesis's old defect list predates corrections; `03_progress.md` contains historical sizes/counts/statuses and ends with newer entries. For current showcase correctness use the current tracker, readiness correction evidence and actual source. For current atlas counts use JSON/validation. For future design progress use `design/screen_tracker.csv`. Do not mark the 100 targets complete merely because concepts exist.

## 8. Verified local commands

From repository root; no dependencies required for these checks:

```sh
node showcase/build.mjs --stage B8
node showcase/tools/check_student.cjs
node showcase/tools/check_revision_student.cjs
node showcase/tools/check_readiness_regressions.cjs
node showcase/tools/check_teaching.cjs
node showcase/tools/check_revision_teaching.cjs
node showcase/tools/check_campus.cjs
node showcase/tools/check_institution.cjs
node showcase/tools/check_integrated.cjs
node showcase/tools/check_controller_logic.cjs
python3 showcase/tools/check_html.py
node showcase/app_map/build.mjs
node showcase/app_map/validate.mjs
```

These are source/state/static checks; no production or browser assertion is implied. Atlas validation writes `verification.json`. Build commands overwrite their generated HTML; preserve deliberate changes by editing sources first. The handoff evidence file `design/handoff_snapshot.json` records actual file hashes, counts and check results from this handoff. Do not mistake hashes for usability evidence.

## 9. Git and preservation

Current branch at handoff: `showcase/v2`; HEAD `779defc` (showcase readiness corrections). The atlas, screen inventories and this handoff include **uncommitted local files**. Share/open the whole folder, not just the last Git commit. Check `git status` before work. No push, publication, paid service or new deployment is part of this handoff.

Leave `.DS_Store`, `.sites/`, the interview workbook and unrelated files alone. Do not upload the folder to external services automatically. Do not copy secrets, private data or agent logs into handoff material. Research examples and prototype fixtures are fictional; the interview workbook is not completed customer evidence.

## 10. Resume protocol

At the end of each Claude batch, update the tracker paths/status/evidence, record decisions and write the next exact task in `design/SESSION_NOTES.md`. Keep historical audits intact. Tell the owner which pages changed, what was verified and what remains unverified. Use `design/START_PROMPT.md` to launch the next session.
