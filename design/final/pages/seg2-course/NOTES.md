# seg2-course notes (Phase 3)

Pages W05 Today, W06 Courses, W07 Calendar, W15 Syllabus and grading, W16 Modules, W17 Lesson and materials and W32 Course calendar. All full tier on web, iPad and iPhone; no anchors. W14 and W18 are unchanged. Tests: `tools/seg2-course.test.mjs`. Every decision below is chosen by Claude under owner delegation, 17 Nov 2026.

## Drawn states and variants

| Page | States | Variants |
|---|---|---|
| W05 | loading, firstUseEmpty, offline, permissionUnavailable | none |
| W06 | loading, firstUseEmpty, filteredEmpty, offline, archived | none |
| W07 | loading, firstUseEmpty, filteredEmpty, invalid, offline, deviceDenied, destructive | add-event |
| W15 | loading, firstUseEmpty, offline, permissionUnavailable | none |
| W16 | loading, firstUseEmpty, offline, notYetAvailable, permissionUnavailable | none |
| W17 | loading, firstUseEmpty, offline, notYetAvailable, permissionUnavailable | none |
| W32 | loading, firstUseEmpty, filteredEmpty, offline, permissionUnavailable | none |

Required failure states are drawn: W05 permissionUnavailable (ta-expired), W07 offline and deviceDenied, W32 offline, W16 and W17 notYetAvailable.

## Decisions

- Global pages (W05, W06, W07) skip the course shell and return title, nav item and body; course pages use `P.shell`.
- The W06 Past tab is the `archived` state (`W06:archived`); past cards are read-only and unlinked.
- Only the anchored course (PHYS 110) links to W14; other course cards are plain, with a line saying so.
- Historical Phase 3: W07/W32 originally showed an eight-day agenda table. The authorized calendar workspace update below supersedes that presentation.
- W17 draws the current module and the files shared in published course announcements; with `notYetAvailable` it draws the first module that is not open yet.
- Item lists use only published items (A4). A TA's tasks are found per published item through `gradingTaskFor`; progress and grading links appear only when `taTaskAccess(...).active` and `taScope` are both true (A6). An expired task shows its title and "Access ended" only.
- W05 builds its own access-ended notice (P.taEndedNotice links to W05 itself) and a disabled "Open allocated grading". A TA with no task sees "No grading is allocated to you".
- W05 `permissionUnavailable` for a student, instructor or active TA is one notice, "Your access to this course has changed", linking W06 and W12. This departs from the plan's `P.permissionNotice` for the active TA, because that notice links back to W05.
- Record-specific links use `P.recordGo` (A10): W14, W19/W25, W29, W48, W53, W57. A TA's grading-deadline row links to W48 only for an active task; an instructor's links to W57.
- W15 shows grade item title, category and points only, never a score or status; weights, the policy version and the syllabus file are not drawn.
- Not drawn (no records): lesson text and media, manual completion, prerequisites, policy weights and versions, syllabus download, the course-event editor, recurring and cancelled events. Each has a visible line and a kit request.
- Preview-only committing actions (preamble rule): Save private event, Delete this event, New course event, Retry, Clear filters, Download, course search.

## Assumptions

- A-1 (spine.test.mjs edit): skipped; the coordinator had already relaxed it.
- A-2: direct reads of non-banned collections (`world.enrollments`, `world.institution`, `coursework.modules`, `comms.announcements`, `comms.discussions`) are allowed where no selector exists (SPINE A2), and each is a kit request.

Source checks only; no browser, keyboard, screen-reader or device acceptance has run.

## Fix round 1 (inspection R01–R09)

- **R02 (W05).** Recent activity resolves each row against published course assessments, published course announcements, `visibleTopics` and scoped receipts; an unresolved row is not shown (no "a course item" fallback). Chosen by Claude under owner delegation.

## Phase 4 enrollment handling

- W14 shows the course permission notice when no course is assigned. Chosen by Codex under owner delegation.

## Task-first workspace

- W05 highlights the next due task, lists upcoming published coursework with the learner's own status and shows submitted work as handed-in plus feedback-released items over all published coursework. Staff and TA progress stays selector-scoped. W18 status tabs are real presentation variants matching `courseworkCounts`; excused work stays under All. W06 groups the existing preview-only search and term controls and explains its course list. Chosen by Codex under owner delegation.

## Course calendars and calendar workspace

Chosen by Codex under owner delegation, 17 November 2026:

- W07 and W32 share `pages/calendar.js`: real Month, Week and Schedule switching, Previous/Next/Today, enrolled-course scope, exact event details. Compact defaults to Schedule. Week uses quarter-hour slots, distinct overlap lanes and a deadline band; excessive overlap or ambiguous daylight-saving placement uses an explained Schedule fallback.
- Calendar scope/period/view/selection are local viewer state; navigation away or changing role/scenario clears the state. It is not saved to a backend or encoded in the shareable route. Refresh returns to the scenario's initial period/default scope. Browsing never changes the authority clock.
- Combined calendar includes published deadlines from all enrolled courses and only the viewer's own private events. Course calendars exclude private visibility even if a private record carries a course ID. TA deadlines remain task-scoped and expire by scenario clock.
- Course navigation exposes Calendar directly. Every W06 course card can open its own calendar, including an honest empty calendar where no event fixtures exist. Those courses do not imply unrelated prototype course pages exist.
- Source and fixture code resolve record routes through `sel.recordGo`; `P.recordGo` delegates without changing semantics. Calendar event dialogs are restricted to records visible in the selected scope and period.
- Event detail Close restores its occurrence focus and both grid scroll axes; period/view controls preserve focus. The calendar's own container handles narrow native frames as well as web. No new dependencies/assets/services.

Evidence and limitations: `design/reviews/calendar-plan-2026-11-17.md` and `calendar-review-2026-11-17.md`. Browser, real keyboard, screen-reader and device checks remain unrun.

## Restrained task-card styling

Chosen by Codex under owner delegation, 17 November 2026: the owner's screenshot identified Today’s decorative teal left stripe as unwanted. Removed the asymmetric stripe and changed the section label to secondary text in `system/workspace.css`. The ordinary border, task title, due time, status and action remain. Calendar course-color edges continue to identify courses. No behavior changed; visual review of the rebuilt card remains owner-run.


## Student, instructor and TA workflows

Chosen by Codex under owner delegation, 17 November 2026:

- W05 instructor Teaching today uses the represented assessment's actual received/reviewed counts and included release candidates; ready work offers Review release, otherwise Open grading queue plus release history. Student Today remains personal; TA My grading uses the same active-task queue-or-receipt resolver as W18.
- W06 student course cards open W14; staff cards open the represented course's W35 builder (TA read-only). Other course records remain calendar-only rather than pointing to a different course's content.
- W14 staff published-content preview explicitly retains staff identity and returns to W35. It contains no instructor grading dashboard, default queue or release link. No allocation history does not invent expiry.
- W18 instructor assessment management includes authorized unpublished planning, exact editors, counts and grading/release actions. Student rows remain published and personal; TA rows show active allocated assessments, grading deadline and scoped counts. Mixed expiry uses the selected task's own end time.
- Dates use quiz close time where present; released learner totals remain distinct from held staff totals. W32 no longer labels a staff member's own calendar as Instructor preview.

Full evidence: `design/reviews/role-workspaces-plan-2026-11-17.md`, `role-workspaces-review-2026-11-17.md` and role-workspaces/role-queue source tests. Real browser, keyboard, screen-reader and device checks remain unrun.
