# Calendar workspace review

Chosen by Codex under owner delegation, 17 November 2026. The authorized brief and design contract are in `calendar-plan-2026-11-17.md`.

## Delivered behavior

- W07 and W32 share actual Month, Week and Schedule views. Previous/Next/Today browse civil dates in local session state without changing the scenario clock or user role. Refresh/navigation away resets the cursor; view/scope/date are not backend persistence or shareable URL state.
- W07 combines every enrolled course's published deadlines with authorized class/office-hour events and the viewer's own private events. Course scope excludes all private visibility, even private records carrying a course ID. W32 permits any enrolled course and fails closed on a foreign scope.
- Calendar is directly visible in course navigation. Every course card opens its course calendar. Sparse courses have honest empty calendars, without PHYS-bound navigation falsely implying other course pages exist.
- Week has an hourly axis, quarter-hour placement, separate overlap lanes and a deadline band with exact times. Month has weekday headings, numbered dates and event information. Schedule groups events chronologically. Color edges have course text labels; missing locations are omitted.
- Details show exact zoned start/end, type, location, course, provenance and private visibility. A record link opens its actual assessment/grading record. Unsupported records remain unlinked; no fake events, dates or backend effects were added.
- Overflow regions are keyboard focusable. Narrow web and native frames share the calendar's own responsive container. Compact defaults to Schedule. No new motion. Week/Month preserve both scroll axes on detail redraw; Close returns to the exact occurrence opener. Period controls retain focus and announce quietly.
- A fixed civil-hour grid cannot accurately represent ambiguous daylight-saving overlaps. Affected weeks use an explained Schedule fallback with exact EDT/EST endpoints. More than eight simultaneous visual lanes also uses Schedule; no event is omitted.
- Existing loading, empty, offline, notification-denied, invalid, course-permission, instructor-only event action and TA expiry branches remain. Private save/delete and publishing actions retain explicit preview-only behavior. Delete views are limited to the active visible scope and period.

## Review corrections

Astra provided a bounded planning review and inspected the integrated changes. Corrections covered scope transfer from combined to course calendar, hidden private-event dialogs, responsive native-frame layout, occurrence focus and both scroll axes, repeated-hour DST collisions and fixture/page dependency layering. Record routing now resides in the manifest selector `sel.recordGo`, with `P.recordGo` delegating unchanged semantics. The data-only loader can project calendars without loading page helpers.

The final two reproduced cases—Month scroll restoration and separate 1:15 a.m. EDT/EST events—passed Astra's focused reinspection. No browser review was performed by the agents.

## Verification

- Full Node suite: 508 tests, 508 pass, 0 fail, 0 skipped.
- `node design/final/tools/check_all.mjs`: 18 checks, 0 failed, 0 todo. 5,124 structural renders; 189/189 targets; 41,580 link views / 804,760 links; 78 steps across 12 tours; 26/26 required hops; 13,854 leak probes; 18,387 authority renders; 924 fictional-content renders. The final report is `design/final/dist/verification.json`.
- Legacy proof: both legacy commands exit 0 in a disposable copy; no legacy build was run in this worktree.
- Build/size proof: app 790436/921600 bytes, board 772331/921600 bytes, static spec 1011283/1012975 bytes.
- New source/mock regressions: `calendar-view.test.mjs` (12) and `calendar-integration.test.mjs` (9), both imported by the combined runner. They cover all-course projection, foreign/private/unpublished exclusions, TA authority clock, honest empty courses, data-only API, scope transfer, destructive view privacy, leap/month/DST/midnight behavior, overlap fallback, local control dispatch and focus/scroll restoration.
- Cached local Impeccable 4.9.2 detector: exit 2 for findings. Two unchanged spec warnings (spacing/cadence). Two new advisory-only repeating-gradient findings (app/board) are dismissed: the single 1-pixel line every 80 pixels is the time grid's hour ruler, aligned to the event slots and hour labels, not decorative surface stripes. Findings are in `calendar-lint-2026-11-17.json`. No hosted AI, paid service or dependency installation.

Final artifact hashes:

| Artifact | SHA-256 |
| --- | --- |
| Whiteboard-Final.html | 82423c8afafc6319286fbd567aebc9fe474fb4d855fc671ee73abdfd2a8bb47b |
| Whiteboard-Final-Board.html | eb9a2b0849a39a615e4f1477582d92ca21b70195906ade01f7535850962900ad |
| Whiteboard-Final-Spec.html | 9b2275f6df86261f706145c2236648348958508dfcb2e3b2f8ec311b15c0bc9d |

## Remaining checks

These are source/mock/static checks, not browser rendering, actual keyboard/screen-reader behavior or device acceptance. The existing file-URL restriction was respected; no localhost, data URL or alternative hosting was used to bypass it. Formal Phase 6 remains owner-run, with all acceptance rows Not run. The owner should refresh/reopen the HTML and compare combined Calendar, a course calendar, Week, Month and Schedule at the desired viewport and appearance.
