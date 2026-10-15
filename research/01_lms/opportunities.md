# LMS opportunities and recommended scope

As of 15 October 2026. These are analyst hypotheses grounded in [notes](notes.md), [pain evidence](pain_points.csv), [competitor capabilities](feature_matrix.csv) and the [audited baseline](../00_baseline/current_build.md). They are not proven demand or measured UX superiority.

## Where Whiteboard could win

| Opportunity | Supporting evidence | Proposed behavior | Test before claiming an advantage |
| --- | --- | --- | --- |
| One dependable student task model | LMS-P01/02; [assignment discovery](https://www.reddit.com/r/canvas/comments/1wh2157/finding_all_assignments/). | Every assessed item has one visible state, deadline and canonical action; published course consistency with flexible pedagogy. | Unfamiliar-course tasks with students, including phone-only users; compare current products. |
| Correct assessment changes with clear consequences | LMS-P04/05/10; [faculty workflow](https://www.reddit.com/r/Professors/comments/1voikhj/brightspace_as_someone_coming_from_mostly_canvas/), [rubric versions](https://www.reddit.com/r/Professors/comments/1luvpiw/gradescope/). | Preview which grades change; keep rubric versions, release scope and history understandable. | Alter a rubric mid-grading, resolve conflicts and reconcile every total; no lost overrides. |
| Submission certainty | LMS-P09/15; [formatting concern](https://www.reddit.com/r/moodle/comments/1su1d3k/format_of_word_document_messes_up_when_uploading/). | Student sees exact accepted file and durable receipt; interruptions resume without duplicate submissions. | Fault-inject upload disconnects/reload/expiry and compare stored bytes. |
| Migration as a first-class product | LMS-P12/13; [USC assessment](https://sc.edu/about/offices_and_divisions/faculty_senate/about/news/2025/lms_assessmentcommit_report.pdf). | Import preview and exception report, date shifting, scoped tool mapping, reversible cutover. | Real authorized source-course conversion against an explicit rubric, not a screenshot comparison. |
| Explainable grades | Current audited grade-math concept; [CSV limitations](https://community.instructure.com/en/kb/articles/660862-how-do-i-import-grades-in-the-gradebook). | Distinguish ungraded, missing, excused and released; show category weighting and versioned changes. | Independently calculate results and compare student/faculty/admin views. |
| Coherent integration before wholesale replacement | [Populi](https://www.populi.co/features/), [FeedbackFruits](https://feedbackfruits.com/all-integrations). | Unify identity/context/navigation and reconcile data while respecting authoritative systems. | An institution can replace or export a specialist without losing records or requiring double entry. |

## MVP for the LMS domain

Build real course/section/term records, identity and instructor/TA/student permissions; accessible content/modules; persistent assignments; basic timed/autosaved quizzes with accommodations; upload/capture/tag/review/receipt; rubric grading and correct gradebook/release; announcements and a simple discussion experience; task/calendar/notification preferences; scoped migration/export and support operations.

First repair the existing prototype's state flow, release selection, grading queue, lifecycle/timer behavior and misleading simulated actions. These are not substitutes for implementing the above services.

## Defer or integrate

- Native apps until mobile-web tests show a specific unmet offline/device need.
- Advanced proctoring, plagiarism detection, specialty item engines, publishing libraries and lecture video through vetted integrations.
- Broad adaptive learning and automated high-stakes grading until governance, evidence and human review justify them.
- General financial aid, finance/HR and other university record systems until the landscape defines build/partner boundaries.
- A large customizable dashboard/widget framework before core tasks work reliably.

## Things to cut from current claims

Remove any implication that camera capture, durable drafts, email receipts, live LMS writes, security-document downloads or support-access grants already work. Avoid marketing scan/rubric grading as unique: [Gradescope](https://www.gradescope.com/splash) directly overlaps the design. Avoid claiming all-in-one is new: [Populi](https://www.populi.co/features/) is a relevant existing example. Current stakeholders must approve any revised branding or public customer statement.

## Biggest uncertainties

Which first segment values the proposed UX enough to switch? Is replacement necessary, or will an embedded grading/course-experience wedge suffice? Can Whiteboard preserve advanced grading policies without recreating menu overload? Which SIS and legacy import target comes first? What support and institutional evidence can the team sustain? These require interviews and scoped implementation tests, not more confident feature claims.
