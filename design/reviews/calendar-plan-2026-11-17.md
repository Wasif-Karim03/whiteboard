# Course calendars and calendar workspace

Chosen by Codex under owner delegation, 17 November 2026. The owner asked for a separate calendar for each course and a familiar Google Calendar-style view with useful information.

## Design contract

Audience: learners and teaching staff finding classes, office hours and coursework/grading deadlines. Main task: see what happens when, then open the correct record or read the event details.

The calendar itself supplies the structure: a week time grid, a month grid and a chronological Schedule. A compact toolbar provides Previous, Today, Next, the period, view choice and course scope. Keep existing system typography, semantic light/dark colors and focus rules; use course-colored edges plus text labels, not decorative cards or color-only meanings. Details show exact endpoints, location when supplied, course, type, source and privacy. Do not invent missing events or locations. No new fonts, assets, dependencies, paid service or Google connection.

Reference: [Google Calendar's official view-switching guidance](https://support.google.com/calendar/answer/6110849?co=GENIE.Platform%3DDesktop&hl=en), checked 17 November 2026. Familiar view switching informs the interaction; this prototype is not a Google integration or a pixel copy.

## Source findings

W07 and W32 were eight-day tables; W07's Week/Month controls did not change views. W32 already restricted the default course but was secondary navigation. W07 gathered coursework due dates only for the persona's default course, even though other courses were enrolled. Existing fictional events are sparse; empty course views must remain honest.

## Implementation

1. One authorized selector projection for all enrolled courses or a verified single course. Exclude private visibility from course scopes, unpublished coursework and expired/unallocated TA grading tasks. Use scenario clock for authority, never the browsed date. Keep record routes faithful and the data-only loader independent of page helpers.
2. Shared pure calendar renderer/date cursor for W07/W32. Civil-date arithmetic handles month/year/leap transitions. Institution-zone timestamps handle offsets and midnight overlap. Dates and views are local session UI state, distinct from the scenario clock and route identity.
3. Month, week and Schedule controls work. Timed week events use quarter-hour positions and separate overlap lanes; point deadlines stay in a separate band with their exact times. Excess overlap or ambiguous daylight-saving placement falls back to Schedule with an explanation; no event is dropped.
4. Course Calendar is a primary course destination. Every course card has a Calendar action. Combined view can filter by any enrolled course and hand that same scope to W32. Other courses retain an honest empty calendar and do not show PHYS-bound course-page links.
5. Compact views default to Schedule. Explicit month/week views retain focusable horizontal scrolling. The calendar establishes its own responsive container, so native-frame previews also receive narrow styles. No new animation.
6. Event Details focuses a named heading; Close returns to the exact event occurrence and restores both grid scroll axes. Period controls preserve their focus and announce quietly. Scope/role/scenario/page changes clear stale selections. Private event actions remain explicit preview-only actions.

## Checks and boundary

Terra owns the shared renderer/date unit and its tests. Root owns selectors, page integration, viewer state, CSS and integration tests. Astra performs read-only planning and final source review. No recursive delegation.

Acceptance evidence must include second-course events and deadlines, unrepresented/foreign scopes, private records tagged with course IDs, TA expiry while browsing earlier dates, month/leap/DST/midnight boundaries, overlap fallback, exact routes, selection and focus/scroll continuity. Run full source proof and the static detector. Source/mock checks cannot establish visual, real keyboard, screen-reader or device acceptance. Preserve the existing file-URL restriction; do not serve or rehost to bypass it. Formal Phase 6 remains owner-run.
