# Simplicity pass: source review and evidence

Chosen by Codex under owner delegation on 17 November 2026. See `simplicity-plan-2026-11-17.md` for the observed Course Home problems, Apple references and acceptance criteria; `simplicity-pages-notes-2026-11-17.md` for the bounded page implementation.

## Integrated result

- Shared regular web/iPad course navigation offers three core destinations per role, with remaining authorized sections in More. Its closed summary names the active secondary section. Compact menus remain flat. Secondary-only kit callers are supported.
- More closes when selecting a destination, including its already-current route, when focus leaves, on an outside click, or on Escape. Escape restores summary focus; moving focus within the menu keeps it open.
- Preview chrome has one fictional-demo label and collapsed settings. Routine route metadata remains in the live region but is visually quiet. Action limitations, errors and normalization notes remain visible.
- Today shows the next task once with one primary record action, other upcoming work, and optional progress/calendar summaries. Courses groups preview-only find controls rather than presenting them as primary choices.
- Course Home uses the actual course title and one next task, then module rows; progress is optional. Assignment detail puts due, final cutoff, points and next action ahead of policies/rubric. File review keeps files and Review and submit first, while completed tags are optional. Released grade total and rows precede the optional category breakdown.
- TA expiry/allocation warnings, offline notices, missing question coverage, invalid files and the released-only grade basis remain visible in relevant source renders.

## Review corrections

Astra reviewed the integrated source and identified a secondary-only tabs exception, duplicate Today task link, same-route/focus-leave dropdown behavior and a W19 not-yet state that suppressed the expired-TA warning. Each was corrected and covered. Lead review also kept W19's final closing time outside the details disclosure. Final bounded Astra inspection found no remaining source blocker. This is a source review, not a browser or usability study.

## Required proof

- `node --test design/final/tools/*.test.mjs`: 487 tests, 487 pass, 0 fail, 0 skipped.
- `node design/final/tools/check_all.mjs`: 18 checks, 0 failed, 0 todo. 5,124 structural renders; 189/189 targets; 41,580 link views / 805,258 links; 78 tour steps across 12 tours, 26/26 required hops; 13,854 leak probes, 18,387 authority renders, 924 fictional-content renders.
- `bash design/final/tools/legacy_check.sh`: exit 0; old build and checker exit 0 in a disposable copy.
- `node design/final/build.mjs && node design/final/tools/check_size.mjs`: exit 0, all caps pass.
- Existing locally cached Impeccable 4.9.2 static detector: exit 2 for findings; no app/board findings, two unchanged spec warnings (spacing and requirements cadence), recorded in `simplicity-lint-2026-11-17.json`. No hosted AI review or paid service was invoked.
- New `simplicity-pages.test.mjs` and `simplicity-shell.test.mjs` are included in the combined runner. Tests check visible content outside closed details, selector-backed record/deadline correctness, warnings and mocked menu/status behavior.

Final artifacts:

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| Whiteboard-Final.html | 757361 | 6c7d4e6f41c68a8b4d8cfe1cfa4066dd5e44c9a4f2955c283f509b02a54a79eb |
| Whiteboard-Final-Board.html | 742656 | adfcfa23596f26c4c52b70bd233f4ad824e62a59cba1a8b52ea0edc9ef40b114 |
| Whiteboard-Final-Spec.html | 1011283 | 9b2275f6df86261f706145c2236648348958508dfcb2e3b2f8ec311b15c0bc9d |

## Remaining verification

A native read-only screenshot of the owner's previously loaded Course Home established the earlier clutter. The rebuilt output has not had a successful visual/reflow/keyboard/screen-reader/device check. The installed isolated browser previously rejected file URLs; no localhost, data URL or alternate route bypass was used. These source/mock/static results must not be presented as runtime accessibility or ease-of-use measurements. Formal Phase 6 remains owner-only and all acceptance rows stay Not run. Next step: owner refreshes or reopens the HTML and reviews Today, Course Home, assignment and file review in the desired platform view.
