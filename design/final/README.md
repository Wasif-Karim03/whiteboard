# Whiteboard final design prototype

63 fictional pages on web, iPad and iPhone (189 design targets), in plain JavaScript on WB. Phases 0–5 source work is complete; Phase 6 is prepared for the owner and **Not run**. The files are local design demonstrations, with no backend, authentication, upload service or deployment.

The 17 Nov workspace refresh modernizes the shared interface, collapses preview settings and adds a task-first Today view, submission/feedback tracking and working Coursework status filters. The app and board load system/workspace.css; the reference spec keeps its prior styling and size. See ../reviews/workspace-redesign-review-2026-11-17.md. The revised appearance is not visually accepted: automated local-file browser access was blocked.

Open [dist/Whiteboard-Final.html](dist/Whiteboard-Final.html) by double-click. The [Board](dist/Whiteboard-Final-Board.html) links to each device view; the [Spec](dist/Whiteboard-Final-Spec.html) contains the original requirements and current tracker status. Follow [acceptance/checklist.md](acceptance/checklist.md) for owner-run checks. Do not bypass local-file browser restrictions with a server.

Editable sources: system/ and kit/ (shared UI), fixtures/ and manifest/ (fictional records/routes), pages/ (segment IIFEs), viewer/ (routing, tours, modal lifecycle), tools/ (build and source proof), tracker/ (189 target rows). PAGES.md and pages/SPINE.md define page contracts. kit_requests.md records retained missing-record fallbacks and coordinator decisions.

Verified commands from the repository root:

```sh
node --test design/final/tools/*.test.mjs
node design/final/tools/check_all.mjs
bash design/final/tools/legacy_check.sh
node design/final/build.mjs && node design/final/tools/check_size.mjs
```

The combined proof runs real link/tour, gallery reach, learner leakage, authority and fictional-content checks. These are source/static checks, not browser, device, screen-reader or owner acceptance. Spec size is capped at 1,012,975 bytes; app and board at 921,600 bytes each. NOTES.md is locked: update its entry in tracker/inputs.lock.json after every edit. Never run the old design/build.mjs or design/tools/check_batch.mjs in this worktree; legacy_check.sh uses a disposable copy.

Review evidence is saved under ../reviews/: phase4-source-review-2026-11-17.md, journey-walk-final-2026-11-17.md, source-accessibility-2026-11-17.md and impeccable-review-2026-11-17.md. Native iOS presentation and real accessibility behavior remain unverified. Commit and push of these updates were authorized by the owner on 18 Nov 2026. Deployment remains outside this publication request.

## Current instructor/student workflow milestone

The 18 Nov [whole-prototype audit](../reviews/whole-prototype-audit-2026-11-18.md) supersedes the earlier role-workspace milestone. Both courses have record-aware instructor/student entry, coursework/grade links and snapshot-bound feedback/receipts. Staff have learner records, compact learner selection, scoped TA allocation views and explicit solo/unassigned/takeover examples. All 558 source tests and 18 integration checks pass; saving and real services remain prototype-only. The reference spec remains a preserved requirements artifact.

## Generated-file exemptions

`spec/` fragments are the board's own HTML strings (one long line each, about 9 KB on average) and `spec/board_manifest.json` is about 2,200 lines of generated data. Both are exempt from the 800-line ceiling. Tracker CSVs are data.

## Assumptions A1–A4 (confirmed in this run)

- A1 held: `ZIPS.length` is 91 (63 `sec:"N"`, 28 `sec` M or Q); the other 120 `S` entries are drawn screens; 211 in all.
- A2 held: scripts 1–3 run in an empty `vm` context with no `document` stub (`sbAuto()` is defined but not called at load).
- A3 held: in a disposable copy, `node design/build.mjs` and `node design/tools/check_batch.mjs` both exit 0; the copy is removed afterwards and nothing is written in the repo.
- A4 held: the four journey-walk reviewers were launched with the Agent tool's model set to `fable` and ran without error; consolidation was done by the builder on Opus 5.5.

## Count variances

None. `tracker/expected_counts.json` has `variances: []`: 118 DD rows (22, 16, 22, 18, 20, 20), 28 rule conflicts, DD-6.07 withdrawn, 189 page rows. Phase 1 added C4–C6, BD9–BD37, 361 JW rows (33 at severity 3, none at 4) and 139 UX-rule rows; the plan's "about 40" UX rows was an estimate, and 139 is the actual count of (rule, page) pairs cited by a severity 2+ finding.
