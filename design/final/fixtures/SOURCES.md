# Fixture and manifest sources (Phase 2b)

Everything in `design/final/fixtures/` and `design/final/manifest/` is fictional and every dataset carries `meta.source: "reconstructed"`. The original fixture files from the handoff are not on disk, so the data is rebuilt from the spec, the board and the deep dive. Where those give a value, the fixtures use it. Every other value below is **chosen by Claude under owner delegation**.

Displayed counts, dates, weekdays, times and percentages are not stored as text. Selectors compute them from ISO records (`WB.sel.*`), and `tools/check_fixtures.mjs` checks the results.

## Datasets and sources

| Dataset | File | Spec and board sources |
| --- | --- | --- |
| world (notice, clock, institution, people, courses, enrollments) | `fixtures/world.js` | spec/docs/22-fixtures-overview.html (notice verbatim, scenario clock, dataset names); board (Alder Hill, `help@alderhill.example`, `arahman@`, `bokafor@`) |
| coursework (assessments, receipts, submissions) | `fixtures/coursework.js` | spec/docs/22; deep dive (PS4 Kinematics, receipt AH-PHYS110-001 Thu Oct 15 10:12 AM); board W40 (PS4 close Oct 18 11:59 PM); board (Motion investigation due Oct 23) |
| grades (policy, items, results, drafts, golden) | `fixtures/grades.js` | spec/docs/06 (fixture check: 84.50% released, 85.17% staff draft), spec/docs/11 (staff evidence), BD18 (release preview) |
| quiz (quizzes, allowances, attempts) | `fixtures/quiz.js` | spec/docs/22 (quiz, allowance, attempt scenario); board W25/W26 (Quiz 3, 20 minutes, +10 minutes, latest attempt, late start) |
| groups (group sets, group assignments, group receipts) | `fixtures/groups.js` | spec/docs/22 (group_set, group_assignment, group_receipt) |
| comms (announcements, read markers, discussions) | `fixtures/comms.js` | deep dive :1182 (W28 rows), :1195 (W29 author, 9:00 AM, attachment), :1208 (W30 topics), :1221 (W31 posts); BD29 |
| calendar (events) | `fixtures/calendar.js` | spec/docs/22 (four event ids); board W07 week view (class Wed 9:00 AM in Hollis Hall 104, office hours Tue 2 PM in the Physics lab, private library shift Wed 5–8 PM) |
| staff (grading tasks, reviews) | `fixtures/staff.js` | spec/docs/24 (TA context: maya, phys110-f26, scope ps4, learners aisha and ben, no release permission, access ends Oct 25 11:59 PM) |
| activity | `fixtures/activity.js` | BD25 (no scores in previews), deep dive :1182 and :1221 |
| samples (failure-state figures) | `fixtures/samples.js` | spec/docs/23 (failure ids and pages) |
| scenarios (clocks, overrides, failures) | `fixtures/scenarios.js` | spec/docs/22 (scenario_clock_overrides, scenario_record_overrides) |
| pages | `manifest/pages.js` | spec/docs/20 (63 routes); `tools/page_meta.mjs` (segment, stage); `tracker/page_tracker.csv` (platform tiers) |
| navigation | `manifest/navigation.js` | spec/docs/19 (blocks Global, Top Bar, Student Course, Staff Course, Staff Tools, Optional); BD26 (instructor extras); BD8, BD38 (no staff entry to W22, W33 or W34) |
| journeys and spine | `manifest/journeys.js` | deep dive :161–172 (J01–J12 titles and paths) |
| states | `manifest/states.js` | spec/docs/05 (16 states, labels verbatim); kit `WB.SAVE_STATES` |
| status bridge | `manifest/status.js` | BD39 (who sees which word), C4, C6; kit `WB.STATUS` keys only, no labels |

## Values chosen by Claude under owner delegation

**World**
- Institution SSO host `sso.alderhill.example`. Emails `cortiz@`, `dreyes@` and `mchen@alderhill.example` (the board gives only Aisha's and Ben's).
- Course titles PHYS 110 Introductory Mechanics, MATH 220 Linear Algebra, MATH 120 Calculus II (Spring 2026, archived); section label "Section 01".
- Rounding: percentages round half-up to two places, with a 1e-9 epsilon to absorb binary noise.

**Coursework**
- Due and close times for Problem Sets 1–3 (PS3 due Oct 9, close Oct 11), the Motion lab (due Oct 9, max 20) and Quiz 2.
- Motion investigation: close Oct 24 and max 40 points (the board gives only the Oct 23 due date).
- PS4 question maxima 1a 6, 1b 4, Q2 6, Q3 8, Q4 6 (total 30). PS4 close Oct 18 11:59 PM comes from the board (W40), not chosen here.
- Ben's receipt AH-PHYS110-002, accepted Wed Oct 14 7:45 PM.
- Submission records for Aisha, Ben and Carmen beyond the drawn PS4 states (PS1, PS2, lab and Quiz 2 released; PS3 excused; Motion drafts; Quiz 3 not started).

**Grades**
- Category weights Assignments 40, Labs 25, Quizzes 35, and the item scores that produce the spec's released and staff totals.
- Grade draft revision 3 with rubric version 2 for Aisha's PS4.
- The golden "labs empty", "all empty" and equal-versus-proportional checks. The 10/25/25/40 policy-editor example is not reconstructed.

**Quiz**
- Quiz 2 timing: opens Mon Oct 5 8:00 AM, closes Tue Oct 6 11:59 PM, 20 minutes, one attempt.
- Quiz 3 opens Wed Oct 21 8:00 AM and closes Thu Oct 22 11:59 PM; two attempts; version 3; four items.
- Allowance reference AS-EXAMPLE-026.

**Comms, calendar and activity**
- Announcement publish times (Oct 19 9:00 AM; office hours revisions Oct 14 12:00 PM and Oct 16 8:30 AM; PS4 reminder Oct 15 8:00 AM) and read markers (Oct 14 6:20 PM, Oct 15 9:05 AM).
- The third W28 row is retitled "Problem Set 4 is due Friday": the drawn "Problem Set 4 is graded" contradicts PS4 being held.
- Discussion posts, authors, times and reply counts (projectile, PS4 Q3, team-orbit planning, welcome).
- Lecture end time 9:50 AM and office hours end 3:00 PM (the board gives start times); grading due Fri Oct 23 5:00 PM.
- Activity item times.

**Scenarios**
- Clocks: assignment_submission Oct 15 10:00 AM; group_work_in_progress Oct 20 4:00 PM; group_submission Oct 22 2:30 PM (group receipt AH-PHYS110-GROUP-001 at 2:20 PM); quiz_in_progress Oct 21 10:10 AM; ta_expired Oct 26 9:00 AM.
- The quiz_received scenario (receipt AH-PHYS110-Q3-001 at 10:24 AM, clock 10:30 AM) and the late_quiz_start scenario (start Thu Oct 22 11:50 PM, clock 11:55 PM) are added so W26 and the late-start rule have records to read.
- Attempt timeline: started 10:00 AM, answers acknowledged 10:03 and 10:07, third answer unsent.
- The 17 failure scenarios' mapping to the 16 state ids and to pages.

**Manifest**
- `manifest/define.js` as a separate first file, and `WB.manifest.pagesById` as its own key.
- Navigation extra "Assessments" maps to W18 (BD26 names the entry, not the page).
- Journey step roles.
- Excused-while-unreleased records carry `priorVisible {state, released}` so the student keeps seeing the prior released word.
- correctionHeld records also require `priorVisible {state, released}`, the latest released snapshot: the student sees that word (feedbackUpdated, missing or released) until the correction is released, and staff see held. This replaces the plan §3 Step 3 table row that showed the student `released` for every held correction (fix R12).

**Phase 2 gate records (16 Nov 2026)**
- PS4 extras: opens Fri Oct 9 9:00 AM, one attempt, late work accepted until close and marked late, module Kinematics, rubric `ps4-rubric` (version 2, criteria titles and maxima equal to the question maxima), the assignment body text.
- File sizes: `aisha-ps4-sample.pdf` 1,843,200 B, `ben-ps4-sample.pdf` 1,310,720 B, the Team Orbit file 2,621,440 B (6 pages).
- Modules: Module 3 Kinematics (Mon Oct 12 to Sun Oct 25 11:59 PM) and Module 4 Forces (Mon Oct 26 to Sun Nov 8 11:59 PM).
- The Team Orbit saved draft (Ben, Tue Oct 20 3:40 PM), removed by the group hand-in; Aisha's PS4 saved draft in the assignment_submission scenario (9:58 AM).
- Ben's and Carmen's released PS1, PS2, PS3, lab and Quiz 2 results and submissions; the five release snapshots (`rel-ps1-1`, `rel-ps2-1`, `rel-quiz2-1`, `rel-ps3-1`, `rel-lab1-1`), their times and comments.
- Aisha's grade draft reviewer (Maya), review time (Mon Oct 19 2:30 PM) and question comments.
- Aisha's base Quiz 2 attempt (started 9:00 AM, answers 9:03 to 9:15) and its receipt `AH-PHYS110-Q2-001` (9:16 AM).
- The ps4_released scenario (clock Tue Oct 27 4:00 PM; snapshot `rel-ps4-1` at 9:00 AM; Carmen's Motion work missing).
- Failure samples (`fixtures/samples.js`): file names, sizes, sent bytes and minute offsets for the six spine failure states.
- The release preview fingerprint: 32-bit FNV-1a over the preview inputs, a local change detector and not a security control.

## Later rules (fix runs, 16 Nov 2026; chosen by Claude under owner delegation)

| Rule | Where | Why |
|---|---|---|
| A TA holds at most one grading task per assessment | `check_fixtures.checkTaskUniqueness`, `WB.sel.gradingTaskFor` throws on duplicates | One allocation per TA per assessment on every drawn screen; makes access and scope unambiguous (R18) |
| Grading-due calendar events are generated from grading tasks (`grading-due-<task id>`), not stored | `WB.sel.calendarEvents` | Queue and calendar read the same task record (W48, W57; REV-01/02) |
| A TA sees a group receipt only when every captured member is in their task scope | `WB.sel.receiptsFor` | No out-of-scope learner data in a snapshot (BD38; REV-03) |

## Instructor workflow examples (18 Nov 2026)

Chosen by Codex under owner delegation for the instructor completion request, based on the research-backed instructor plan. All additions are fictional local examples, not customer data or results. MATH has a vector assignment (10 points), optional ungraded vector practice, Aisha's first/revised accepted receipts, a reviewed held mark of 8, Ben's manual held mark of 6, a separate weighted course policy and a matching release snapshot. Ben's MATH enrollment is added to support a second learner path. The new staffing examples retain membership without allocations or show instructor takeover with earlier reviewer attribution; they do not alter the default PHYS task or release history. Only the MATH release scenario releases the MATH result. No real files, upload service, durable saves or institutional integration are implied.
