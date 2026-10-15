# Whiteboard showcase: update tracker

Updated **15 October 2026**. Reviewed baseline: `eca61e1`; revised artifact: `../Claude outputs/Pellwin-Showcase.html`.

**38 items: 27 Done (source/state), 8 Implemented/unverified, 3 blocked browser-acceptance gates.** All four follow-up defects are fixed and covered by regression checks. Browser acceptance has not passed.

Priorities remain 9 P0 / 25 P1 / 4 P2. P0 means required before calling the external demo ready; P1 completes important workflows/usability; P2 is polish/maintainability.

[Full audit](04_revision_audit.md) · [Execution plan](06_revision_plan.md) · [Detailed CSV](05_update_tracker.csv) · [Current verification evidence](review/verification_2026-10-15.json)

The CSV preserves original baseline evidence and adds implementation notes, current test evidence, remaining checks and completion dates. Source paths/line numbers in the original evidence refer to the pre-revision audit.

Done (source/state) means the local model, renderer or source acceptance check passed. Implemented/unverified means the code is present but its browser/usability acceptance has not run. Blocked means a permitted browser route is still unavailable. No production or accessibility conformance is implied.

## Step 1 — Shared record and approval correctness

| ID | Priority | Update | Status |
| --- | --- | --- | --- |
| REV-02 | P0 | Bind grading work to the selected student | Done (source/state) |
| REV-03 | P0 | Invalidate stale feedback-release previews | Done (source/state) |
| REV-04 | P0 | Exclude excused work from numeric release | Done (source/state) |
| REV-05 | P0 | Validate reservation duration and committed event capacity | Done (source/state) |
| REV-06 | P0 | Make event reset a consistent initial scenario | Done (source/state) |
| REV-15 | P1 | Validate dates, numeric inputs and long/empty content | Done (source/state) |
| REV-24 | P1 | Separate local actor views from institutional permission claims | Done (source/state) |
| REV-33 | P1 | Add regression cases for the discovered cross-screen defects | Done (source/state) |
| REV-35 | P0 | Match question feedback and review completeness to the grading unit | Done (source/state) |
| REV-36 | P0 | Show one consistent assignment AI-use policy | Done (source/state) |

## Step 2 — Navigation, walkthrough and accessibility

| ID | Priority | Update | Status |
| --- | --- | --- | --- |
| REV-07 | P0 | Preserve keyboard focus through updates | Implemented/unverified |
| REV-11 | P1 | Remove stale titles, dates and class locations | Done (source/state) |
| REV-12 | P1 | Keep next-step guidance beside the active workspace | Implemented/unverified |
| REV-13 | P1 | Offer a focused first-look path before the full tour | Implemented/unverified |
| REV-16 | P1 | Make error location and status announcements precise | Implemented/unverified |
| REV-17 | P1 | Provide an equivalent readable submission and usable rotation | Implemented/unverified |
| REV-25 | P1 | Make empty and delayed states change the actual content | Done (source/state) |
| REV-29 | P2 | Make workspace URLs and Back/Forward consistent | Implemented/unverified |
| REV-31 | P2 | Finish shared form metadata and heading semantics | Implemented/unverified |

## Step 3 — LMS depth

| ID | Priority | Update | Status |
| --- | --- | --- | --- |
| REV-08 | P1 | Make modules and student preview share course data | Done (source/state) |
| REV-09 | P1 | Connect the authored quiz to the student attempt | Done (source/state) |
| REV-10 | P1 | Apply operational allowances in the student view | Done (source/state) |
| REV-14 | P1 | Show creation and attachments, not only editing the fixture | Done (source/state) |
| REV-28 | P1 | Make the policy layers and source context visible | Done (source/state) |
| REV-37 | P1 | Make copy application produce an inspectable destination | Done (source/state) |

## Step 4 — Campus participation and support

| ID | Priority | Update | Status |
| --- | --- | --- | --- |
| REV-21 | P1 | Make service handoff and history follow the actual record | Done (source/state) |
| REV-22 | P1 | Demonstrate real officer handoff and freshness changes | Done (source/state) |
| REV-23 | P1 | Make student pass, waitlist order and check-in eligibility explicit | Done (source/state) |
| REV-38 | P1 | Make personal event participation agree with the calendar | Done (source/state) |

## Step 5 — Institution readiness

| ID | Priority | Update | Status |
| --- | --- | --- | --- |
| REV-19 | P1 | Make reconciliation inspectable and fallible | Done (source/state) |
| REV-20 | P1 | Expand preflight into a reviewable exception report | Done (source/state) |
| REV-26 | P1 | Show credible access expiry and change history | Done (source/state) |
| REV-27 | P1 | Show the operational plan and portable-record exit | Done (source/state) |

## Step 6 — Visual QA, claims and handoff

| ID | Priority | Update | Status |
| --- | --- | --- | --- |
| REV-01 | P0 | Complete browser acceptance review | Blocked: browser acceptance |
| REV-18 | P1 | Verify dense controls, tables and readable mobile type | Blocked: browser acceptance |
| REV-30 | P2 | Reduce repeated card chrome and improve screen distinction | Blocked: browser acceptance |
| REV-32 | P1 | Reconcile the showcase claims with actual demonstrated behavior | Implemented/unverified |
| REV-34 | P2 | Make the source and status record easier to maintain | Done (source/state) |

## What remains

Browser acceptance for REV-01/18/30 and the eight implemented/unverified UI items. All four confirmed readiness defects are corrected: submitted quiz snapshots, quiz-owned feedback deadline, module-specific reading state and modified-link behavior. The new regression suite exercises these and related release/allowance/publication edges.

Inspect all chapters and forty workspace variants at desktop/phone widths in both themes; traverse all six journeys, check keyboard/focus/error recovery/history/dialogs/downloads and the console. Do not bypass the recorded URL-policy restriction. All five selected public source targets have now been checked; the earlier EDUCAUSE HEAD 403 results are retained as transport history alongside successful primary-page reads.

The remaining work is browser/usability verification and any fixes it reveals. No backend, private data, paid service or deployment is required.

## Updating this tracker

Use the CSV as the editable source; update this table alongside it. Close a row only with the stated acceptance evidence and completion date. Keep browser-dependent rows pending until those checks run.
