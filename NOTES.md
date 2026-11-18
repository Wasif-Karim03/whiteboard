# Whiteboard: handoff (18 Nov 2026, written for Codex or a fresh Claude session)

For cross-device setup, see [docs/TRANSFER.md](docs/TRANSFER.md). Sections 1–9 below give the long-term project picture. Section 0 is the live state; read it first. **Codex: follow `AGENTS.md`** (the work queue and the rules). Copies of the run's plan and fix lists are in `docs/codex-handoff/`.

## 0. Live state: source audit verified; GitHub publication authorized; owner acceptance unrun

**Current owner brief (18 Nov).** The owner explicitly requested committing and pushing all Whiteboard updates to `https://github.com/Wasif-Karim03/whiteboard.git`. This authorizes this Git publication to the existing `main` and `showcase/v2` transfer branches, with normal fast-forward pushes only. It supersedes the standing no-commit/no-push rule for this publication. No deployment, paid service or backend/native implementation is included. Decisions below are chosen by Codex under owner delegation.

**Publication preparation:** update the root/current README and transfer guide; include source, generated app/board/spec, fictional research, trackers and audits; exclude ignored per-machine caches/session state; run source proof and refresh `docs/transfer-manifest.json` from the staged tracked set. The pre-publication scan found no credential/config filenames, private-key or token-pattern matches in the candidate files (heuristic, not a security certification). Use Git history and remote branch heads to identify the delivered revision; no self-referential commit hash is stored in this locked note.

**Whole-prototype audit:** `design/reviews/whole-prototype-audit-2026-11-18.md`. Additional student course/result/receipt links, snapshot-bound files, exact quiz attempts, nonnumeric outcomes, unpublished own receipts, legacy record compatibility, stale cross-page selections, captured group identity and staffing-example course scope are fixed. Optional practice has an honest no-hand-in state. New whole-context/student suites supplement the existing gates; independent Astra source review verified closure of all six findings it reported. The audit is source-only, not owner acceptance.

**Delivered in the prototype**
- W45 roster entries open course-scoped student records with coursework, accepted attempts, held/released grades and feedback; previous/next keeps the instructor's identity. W51 student names and every configured cell open the selected record; compact views have a student picker.
- Both teaching courses have their own content/assessment/people/gradebook paths. Every represented assessment opens its exact editor/queue/release-history view. W05 also summarizes the other teaching course's review/release work. Grading intent says included, ungraded practice or setup needed.
- Optional `tc/ta/tl/tr` record selection extends existing page links; it never changes the viewer's role/person. Composer/selector checks deny empty/foreign/mismatched records, cross-course references and invalid TA learner-question intersections. Reload/back preserves the selected record, global entry clears it, and calendar controls use/reset the same course context. No new page IDs or canonical nav identities.
- Independent course policies/totals replace PHYS-only fallback. New fictional MATH examples include two accepted attempts, an ungraded practice item, a manual held grade and an exact release scenario. Earlier attempts cannot inherit later marks/review/release badges or feedback. Quiz graders show acknowledged answers from the matching submitted attempt.
- Real enrollment/tasks drive no-TA and unassigned-TA screens; phantom revoke/follow-up controls are removed. W57 shows actual question scopes and uncovered learner-question pairs. Fictional staffing examples demonstrate instructor takeover while retaining prior reviewer attribution and transfer history. Real allocation/revocation is still preview-only.
- Graded remains distinct from Released. TA release and preview stay prohibited. Receipts/release snapshots remain immutable. PHYS golden values/fingerprint are unchanged; MATH's release and learner total stay in MATH. W52 shows actual configured weights/rules.
- Existing restrained styling and Month/Week/Schedule calendars remain. Root integrated; bounded workers implemented grading projections and W45/W57. Astra reviewed actual source and verified the final old-attempt correction on web/iPhone source renders. No browser acceptance is implied.

**Evidence and checks**
- Implementation contract: `docs/plans/instructor-implementation-2026-11-18.md`.
- Current completion/remaining limits and final integration output: `design/reviews/whole-prototype-audit-2026-11-18.md` (the instructor completion review is the previous milestone); `design/final/dist/verification.json` is the generated source proof.
- Full standalone suite before final integration: **558 tests, 558 pass, zero fail/skipped**; new teaching-data/staffing/navigation suites are included in tools/index.js. Final integration reruns the suite and all source gates.
- Legacy disposable-copy proof passes; both legacy commands exit zero. Strict build caps pass: app **855,552 / 921,600 B**, board **837,229 / 921,600 B**, spec **1,011,283 / 1,012,975 B**. Spec unchanged; 1,692 B headroom. No cap increased.
- Earlier structural coverage remains 189 page×platform targets; current detailed counts belong to the completion review, not the historical readiness review. Free cached Impeccable static detect was rerun: four unchanged baseline findings, exit 2 for findings; no new findings, no hosted/paid analysis. Nothing was claimed visually resolved.

**Important limits.** These are fictional source/mock/static flows. Saves, manual-grade editing, invitations and allocation/revocation are explicitly previews; there is no durable backend, real PDF viewer or SIS integration. Optional moderation, production concurrency/autosave, notifications and institutional handoff remain separately scoped engineering. The broader research plan is not wholly implemented merely because these six prototype gaps are closed.

**Owner acceptance:** rendering/reflow, keyboard, VoiceOver and device/usability checks remain unverified. The prior isolated Playwright session returned `Access to "file:" protocol is blocked`. No localhost, alternate hosting/data URL or restriction bypass was used. All `design/final/acceptance/checklist.md` rows remain Not run.

**Research/history:** the 15-source research register, 28-capability CSV and instructor plan are in `research/instructor-workflows/` and `docs/plans/`. The earlier readiness review describes pre-implementation gaps; the completion review supersedes those named gaps. Phases 0–5 source work and all existing journeys remain; old sections 1–9 are history.

**Next:** owner opens the rebuilt `design/final/dist/Whiteboard-Final.html`, compares Student/Instructor in Preview settings and both courses. Inspect People → student, Gradebook → cell, compact learner picker, MATH attempt history/release and Grading plan → Staffing examples. Formal Phase 6 remains owner-run; never mark unobserved browser results passed. Further actual backend engineering is not inferred from this prototype pass.

**Commands / rules**
```
node --test design/final/tools/*.test.mjs
node design/final/tools/check_all.mjs
bash design/final/tools/legacy_check.sh
node design/final/build.mjs && node design/final/tools/check_size.mjs
```
Never run old design/build.mjs or design/tools/check_batch.mjs in this worktree. Preserve unrelated work; no reset/stash/discard or force-push. Only the explicit Git publication above is authorized; future commits/pushes still require task authorization. After every NOTES edit refresh its bytes/sha256 in design/final/tracker/inputs.lock.json, then rerun check_all. Keep spec growth near zero.

## 1. Status in one paragraph

**Design phase is complete and owner-accepted; the project is ON HOLD** (owner paused it on 16 Oct 2026 after opening the click-through prototype, without sending feedback). Research, a 40-screen interactive showcase, a 50-destination web/iPhone navigation atlas, 100 detailed design targets (50 destinations × web + planned iPhone), decisions D1–D65 and an offline click-through prototype all exist and pass their local source checks. **Nothing is implemented as a real product.** No backend, auth, storage, AI, native iOS app or deployment exists, and browser/keyboard/screen-reader/device acceptance has never been run. Implementation is not authorized.

## 2. What Whiteboard is

An LMS-first university platform concept for US higher education. The center is the teaching cycle: find work → submit → grade (with scoped TAs) → release feedback → student acts on it, on web and phone. Around it, campus coordination is connected: scheduling/rooms, events/student organizations, support/advising handoffs and institution/IT operations. It keeps the same identity, calendar, status and permissions throughout.

Core product truths (keep them in every change): Graded ≠ Released; request ≠ approval ≠ confirmation; offline ≠ synced; submitted receipts and release snapshots are immutable; course/role permissions are explicit; specialist systems (SIS, finance, etc.) stay authoritative. AI is optional, permission-scoped and reviewable, never autonomous final grading. All data is fictional.

Recommended launch hypothesis (research): a small, institution-backed teaching pilot centered on consistent course organization and dependable handwritten/PDF assessment. An LTI grading integration is the lower-disruption entry. First school, SIS and identity provider are still **assumptions** (D63), not validated.

## 3. Timeline: what was done, in order

| When | Phase | Result |
| --- | --- | --- |
| ≤12 Oct 2026 | Early archive | Older showcase + interview tracker uploaded to GitHub `main` (commit `dfb7860`, kept in history) |
| 15 Oct | Market research | 6 domains (LMS, scheduling/rooms, events/clubs, cross-cutting compliance/AI/integration, 33-domain landscape, student success/advising), synthesis and offline HTML report |
| 15 Oct | Product showcase | 40 interactive local concept workspaces (S01–S40), 6 guided examples. Audit found and fixed defects: 38 tracked items, plus 4 more from a readiness recheck |
| 15 Oct | Coverage + atlas | Screen inventory found 10 missing destinations (P41–P50). Built a navigation atlas: 50 destinations × web/iPhone, 147 transitions, 15 journeys |
| 16 Oct | Detailed design | All 100 targets drawn in 6 batches on one design system (tokens + components), with states. Owner accepted decisions D1–D58, resolved 29 open questions, then visually accepted all 100 ("everything looks great") |
| 16 Oct | Delegated decisions | Owner delegated remaining decisions to Claude: D59–D65 recorded as "chosen by Claude under owner delegation" |
| 16 Oct | Prototype | Click-through `Whiteboard-Prototype.html`: 8 roles, 24 guided tours (159 steps), Web/iPhone switch, state picker, light/dark, larger text. Owner opened it, then paused the project |
| 22 Oct | GitHub | Whole project (including previously uncommitted atlas, inventories, handoff docs) committed and pushed; this NOTES.md rewritten as the full review |

## 4. Folder map

| Path | What it is | Open / edit |
| --- | --- | --- |
| `research/` | Research packet: domain folders `00_baseline`–`06_student_success_advising` (notes, opportunities, sources, CSVs), `data/` merged CSVs, `synthesis.md` (the decision summary) | Report: `research/report/index.html` (research only, not the product) |
| `showcase/src/` | Source of the 40-screen showcase (`core, content, student, teaching, campus, institution, controller.js`, `styles.css`, `CONTRACT.md`) | Build: `node showcase/build.mjs --stage B8` → `Claude outputs/Pellwin-Showcase.html` (legacy filename, brand is Whiteboard) |
| `showcase/0*_*.md/csv` | Showcase history: gap analysis, plan, progress log, revision audit, update tracker (05), readiness recheck (07), screen inventory (08), coverage gaps (09) | Historical; later entries supersede earlier counts |
| `showcase/app_map/` | Navigation atlas. `screens.json` + `routes.json` are the main design-brief data (the design build reads them) | `node showcase/app_map/build.mjs` then `validate.mjs` → `index.html` |
| `showcase/archive/` | Preserved originals | Never edit |
| `design/` | Design phase: `system/{tokens,components}.css`, `batch01`–`batch06/*.js` screen sources, `batches.mjs` registry, `tools/`, `preview/` (6 batch previews + review packet `index.html`), `prototype/` | `node design/build.mjs` builds everything |
| `design/` records | `screen_tracker.csv` (100 rows; CRLF line endings, keep them), `decisions.md` (D1–D65 + Owner review; the packet parser depends on its format), `state_checklist.md`, `SESSION_NOTES.md` (detailed per-session log), `README.md`, `START_PROMPT.md` | Update after each batch of work |
| `docs/` | Original functional audit and state/control inventory (historical baseline) | Read only |
| `Claude outputs/` | Generated showcase HTML; `Whiteboard-Interview-Tracker.xlsx` (interview template, **not** completed customer evidence) | |
| `CLAUDE.md`, `HANDOFF.md` | Project rules for Claude; original 15 Oct handoff (still useful for rules and context) | |

Not in git on purpose: `.sites/` (a local hosting copy of the research with its own nested git repo), `.claude/` (agent session state), `.DS_Store`, `showcase/.tool-cache/`.

## 5. Key numbers

- 50 destinations: S01–S40 (from the showcase) + P41–P50 (proposed, keep the "proposed" label). × 2 platforms = **100 design targets**, all design_status **Accepted**.
- iPhone is a **planned** presentation, not a native app. 12 dense staff destinations recommend web for bulk work: S18, S19, S22, S24, S25, S37, S38, S39, S40, P47, P49, P50. D60 says iPhone staff views do read/review, single-record and protective actions only.
- Design batches: 01 student journey S01–S09; 02 authoring/access; 03 integrity + student everyday; 04 scheduling/rooms; 05 events/orgs; 06 support + institution/IT. 254 states, 508 renders, contrast min 5.05:1.
- Prototype: 96 of 135 transitions are reachable by a real click. The other 39 are deliberately "Next" (another person deciding, time passing, offline, a role switch); don't add buttons for them.

## 6. Decisions you must not reopen

- D1–D58 owner-accepted; 29 open questions resolved to drawn defaults (`design/decisions.md` › Owner review).
- D59 no direct messaging (S05 closed → "Request more time…"). D60 iPhone staff capability rule. D61 no screen splits/merges. D62 no new routes. D63 school/SIS/IdP stay assumptions needing partner discovery. D64 acceptance is by user-assisted inspection. D65 the prototype reuses the accepted screen sources (verified 508/508 identical renders), so it can't drift.
- The owner delegates decisions: choose, then record as "chosen by Claude under owner delegation". Never invent customers, results, certifications or SIS/IdP facts.

## 7. Verification state (last run 22 Oct 2026)

Passing (local, Node 24, no dependencies):
- `node design/tools/check_batch.mjs`: all 6 batches pass.
- `node showcase/tools/check_{student,readiness_regressions,teaching,campus,institution,integrated,controller_logic}.cjs`: all pass.
- `python3 showcase/tools/check_html.py`: passes; archives unchanged.
- Also available: `node design/build.mjs`, `node design/tools/build_prototype.mjs --gaps`, `node showcase/app_map/validate.mjs` (writes `verification.json`).

**Not done:** real-browser visual/keyboard/screen-reader/zoom/reflow checks, phone scaling, iOS device/simulator tests, and the owner's prototype feedback. Source checks are not browser acceptance. An earlier local-file URL-policy restriction applies: don't bypass it via localhost. Use an authorized environment or user-assisted inspection (D64).

## 8. Next steps (each needs the owner's go-ahead)

1. **Ask the owner for prototype feedback first** (Student tour + iPhone view), with screenshots of problems. Fix in `design/prototype/*` or the batch screen sources, rebuild, rerun checks.
2. Structured accessibility/browser acceptance by user-assisted inspection (D64); record results in `screen_tracker.csv` (browser_status is currently *Not run*).
3. Partner discovery for a first school (D63); the interview tracker xlsx is the template.
4. Optional on request only: publish the prototype as a private shareable link.
5. Implementation planning is **not authorized** yet. Don't start React/Next/native/backend work without explicit approval.

## 9. Working rules for Claude

- Owner's standing rule: run file-changing tasks through `/team` (run `/clear` first).
- Edit sources, then rebuild generated HTML; never hand-edit generated files (`Pellwin-Showcase.html`, `app_map/index.html`, previews, prototype).
- Track UI design, source checks, browser review and owner review as separate statuses. Update `design/screen_tracker.csv` and `design/SESSION_NOTES.md` after each batch.
- Keep `showcase/archive/` and historical audits intact. Use free/local tools only. Commit/push only when asked; the remote was verified public on 4 Nov 2026.
- Read big files in slices; `SESSION_NOTES.md` has the per-step history if you need the "why" behind something.
