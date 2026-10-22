# Whiteboard: screen inventory

Counted from actual screen registrations on 15 October 2026. **40 unique primary workspaces**, each intended for desktop web and responsive mobile web: **40 desktop layouts + 40 mobile adaptations = 80 layout targets**. This is not 80 different product features or a claim of separate native iOS/Android applications. Browser visual acceptance remains pending.

[CSV](08_screen_inventory.csv) · [Production coverage cross-check](09_screen_coverage_gaps.md) · [Acceptance tracker](05_update_tracker.md)

| Area | Unique screens | Desktop web | Mobile web |
| --- | --- | --- | --- |
| Student learning | 13 | 13 | 13 |
| Teaching and assessment | 10 | 10 | 10 |
| Scheduling and rooms | 4 | 4 | 4 |
| Events and organizations | 6 | 6 | 6 |
| Student support | 3 | 3 | 3 |
| Institution and IT | 4 | 4 | 4 |
| Total | 40 | 40 | 40 |

Shared views are counted once by their main workflow; e.g. instructors also use discussion/calendar, and students also use event/support screens. Staff tables need responsive treatment, not a reduced screenshot of a desktop frame.

| ID | Screen | Primary actors | Desktop | Mobile |
| --- | --- | --- | --- | --- |
| S01 | Today | Student | Included | Responsive |
| S02 | Courses | Student | Included | Responsive |
| S03 | Course home | Student | Included | Responsive |
| S04 | Modules & materials | Student | Included | Responsive |
| S05 | Assignment | Student | Included | Responsive |
| S06 | Scan pages | Student · mobile web | Included | Responsive |
| S07 | Review submission | Student | Included | Responsive |
| S08 | Submission receipt | Student | Included | Responsive |
| S09 | Feedback and grade explanation | Student | Included | Responsive |
| S10 | Quiz attempt | Student | Included | Responsive |
| S11 | Course conversation | Student / instructor | Included | Responsive |
| S12 | Calendar | Student / faculty | Included | Responsive |
| S13 | Updates & preferences | Student | Included | Responsive |
| S14 | Course builder | Instructor | Included | Responsive |
| S15 | Assignment editor | Instructor | Included | Responsive |
| S16 | Quiz builder | Instructor | Included | Responsive |
| S17 | Grading workspace | Instructor / TA | Included | Responsive |
| S18 | Rubric-change preview | Instructor | Included | Responsive |
| S19 | Gradebook | Instructor | Included | Responsive |
| S20 | Release and records | Instructor | Included | Responsive |
| S21 | People and course permissions | Instructor | Included | Responsive |
| S22 | Course copy and rollover | Instructor | Included | Responsive |
| S23 | Course insights and attendance | Instructor | Included | Responsive |
| S24 | Academic timetable | Registrar / department | Included | Responsive |
| S25 | Schedule-change review | Registrar | Included | Responsive |
| S26 | Find a room | Permitted requester | Included | Responsive |
| S27 | Reservation request | Requester / space approver | Included | Responsive |
| S28 | Campus event discovery | Student | Included | Responsive |
| S29 | Organization home | Student / officer | Included | Responsive |
| S30 | Collaborative event composer | Organization officer | Included | Responsive |
| S31 | Event approval workspace | Student affairs | Included | Responsive |
| S32 | Event attendance | Operator / student | Included | Responsive |
| S33 | Organization transition | Outgoing / incoming officer | Included | Responsive |
| S34 | Get support | Student | Included | Responsive |
| S35 | Advising context and referral | Adviser / faculty | Included | Responsive |
| S36 | Support follow-through | Coordinator / student | Included | Responsive |
| S37 | People, access & records | Institution administrator | Included | Responsive |
| S38 | Connections & reconciliation | Institution IT | Included | Responsive |
| S39 | Migration rehearsal | Implementation administrator | Included | Responsive |
| S40 | Trust & AI controls | Institution IT | Included | Responsive |

## Counting boundary

This inventory counts the current approved showcase’s primary workspaces. It does not count light/dark themes, tabs, modal dialogs, validation/loading/empty/error states, role variants or the marketing-page sections as new primary screens. Examples: syllabus is within S04, assignment creation within S15, quiz review within S10, and the student event pass within S32. These states still require design and testing.

The complete production application needs a separate route/state inventory before a final engineering estimate. Login/SSO entry and recovery, invitation/onboarding, account/profile settings, institution setup, global navigation/search and help/support flows are not represented as standalone workspaces in this set. Some controls/settings already exist inside other screens; do not add a new screen count for those without deciding the actual flow. Native app-specific permissions, offline lifecycle and app-store delivery are not scoped here.

The wider research includes specialist campus domains intentionally outside native Whiteboard scope. This count does not imply payroll, finance, housing allocation, clinical systems or a full SIS are being built.

## Follow-up cross-check

The complete-product review found ten recommended new primary workspace candidates plus eight existing areas needing fuller flows. If adopted, this produces a **provisional 50-workspace / 100-layout target**, not a final or implemented count. See `09_screen_coverage_gaps.md`; the audited current showcase count remains 40.
