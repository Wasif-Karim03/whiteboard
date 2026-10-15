# Showcase source contract

Sources are concatenated into one offline HTML by `showcase/build.mjs`. No imports, network calls or runtime packages are required by the artifact. All data/effects are fictional. Preserve both archives; do not hand-edit generated HTML.

## Modules and screens

- `core.js`: canonical model, selectors, validation, helpers, render/action registry.
- `content.js`: story chapters, six journey routes, shared hero renderer.
- `student.js`: S01–S08, S10–S13 and student actions.
- `teaching.js`: S09, S14–S23, grading/authoring/rollover actions.
- `campus.js`: S24–S36, scheduling, events, organizations and support.
- `institution.js`: S37–S40, reconciliation, migration and trust.
- `controller.js`: browser event routing, focus, theme, local guides, URLs and downloads.
- `styles.css`: offline semantic palette, layouts, responsive/reduced-motion behavior.

`WB.reg(id,title,role,(state,h)=>html)` registers a pure renderer. `WB.render` verifies no state mutation and temporarily sets the screen's sample actor, restoring the caller context afterward. Never initialize state inside a renderer.

`WB.actions[name]=(state,params)=>({message?,go?,download?,errorPath?})` performs an intentional local change. `download` is `{name,text}`. `go` is a registered workspace ID. Prefix actions by module. Controllers announce at the destination and focus the requested error field. Action success must represent the corresponding model change.

## Shared records

- `assignment`: current assignment ID, title, due/close wall-clock values, publication, AI policy, five questions and sample attachments.
- `submission`: Aisha's current attempt. `submissions[personId]`: other learners' attempts. Use `WB.submissionFor(state,id)` everywhere, rather than borrowing Aisha's pages.
- Submission includes `id,owner,status,attempt,pages,receipt`; each page has `id,tag,rotation,owner?,workVariant?`. Editing received work starts a new draft and preserves an earlier receipt snapshot in `history`.
- `assessment.marks[personId]`: scores for question IDs `1a,1b,2,3,4` with maxima `6,4,6,8,6`. `questionComments[personId][questionId]` is answer-specific; `comments[personId]` is overall feedback.
- `reviewedQuestions[personId]` tracks answer review; all required questions plus explicit completion are needed before the submission enters `graded`. `released` is separate.
- `teaching.releasePlan` stores the approved preview payload/fingerprint; stale scope/content/attempt/eligibility cannot silently change the release. `releaseSnapshots` preserve the exact released version. Excused/missing/unreceived work is ineligible for numeric release.
- `teaching.modules` drives student order/access; structured `releaseAt` and completed-module IDs drive availability.
- `teaching.quizItems` drives student answer controls; item types are Multiple choice, Numeric response and Written response, with optional options/answer. Student answers are `course.quizAnswers[itemId]`; attempt count, review, submission and result release are separate.
- Allowances are `{id,assignmentId,extraHours,extraMinutes}`. Use `WB.effectiveDates(state,personId)` for effective due/close/time allowance.
- `teaching.destinationCourse` holds the actual separate copied modules/assignments/quizzes/tool-review record and no student data.
- `campus.meeting` is the source-applied timetable. Proposals are separate from this record.
- Published `campus.event` is separate from `eventDraft`. Date keys and start/end times are structured; approval fingerprints and existing commitments constrain publication.
- `campus.participation` has confirmed records, aggregate other-confirmed count, ordered waitlist and sample pass. Use `WB.personalCampusEvent` for personal calendar context.
- Use `WB.studentSupportStatus` for student-safe referral output; staff history/notes have separate scope.
- Institution reconciliation, grade exports, migration rows/previews, portable export and access expiry are inspectable local records. No external system has received them.

## Helpers and control semantics

`WB.e` escapes user text; `WB.clone` copies JSON-safe records. `WB.audit` records named actors and ordered times using `WB.clock` and the explicit fictional institution clock. `WB.academicPolicy` applies a course prohibition over the assignment rule; institution AI draft permission is separate.

`WB.set(path,value)` rejects unsafe prototype paths, invalid fields and inappropriate/locked edits. Invalid visible values block form actions instead of silently using an earlier valid model value. `WB.fieldErrors` is UI error state. Module actions also validate consequential transitions.

`WB.actorFor(screen,state)` labels the sample role. The controller sets this actor for actions; direct Node tests may leave it unset. This is a showcase role view, never production authentication or authorization.

HTML helpers: `head` renders h3 beneath a chapter h2; `card` renders h4. `btn` creates stable per-render IDs and data actions; `go` creates `#Sxx` navigation links. `field/area/select` provide labels and names; fields/areas associate errors. `table` supplies caption, column headers and a labeled scroll region. `paper(question,rotation,owner,variant)` renders owner-specific illustrative work, full text and an enlarged readable alternative inside a rotation-safe square stage. Escape dynamic content inserted into HTML bodies.

The controller avoids replacing unchanged panels, restores focus by control identity, supports native links/history and keeps guidance beside the active task. Actual browser acceptance is still separate from source/unit checks.

## Scenario resets and checks

J1/J2 restore the academic dependency closure, preserving delivery preferences. J2 preserves an organized received Aisha submission only when it belongs to the original assignment. J3 resets the scheduling closure. `WB.resetCampusJourney` handles J4/J5. `WB.resetInstitutionJourney` handles the IT portion of J6 without regranting unrelated access; the controller separately resets course-copy state.

See `showcase/README.md` for build/check commands and `05_update_tracker.csv` for acceptance evidence. Existing historical probes execute the v2 archive, not the revised modules. Never infer browser focus, clipping, console cleanliness, real-device performance or conformance from a pure renderer count.
