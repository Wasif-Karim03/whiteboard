# Design decisions and open questions

Baseline 15 October 2026. These distinguish existing direction from decisions Claude must still work through.

## Existing direction

- LMS-first, coherent teaching transactions; campus coordination expands around that core.
- Final-product vision includes 50 mapped destinations, with ten additions still labeled proposed.
- Separate web and planned iPhone presentation; twelve dense staff destinations recommend web for bulk work.
- Clean hierarchy, whitespace, restrained semantic color, realistic data and subtle optional motion. Preserve recognizable Whiteboard identity; use current showcase/atlas as references, not final accepted designs.
- Status, authority, privacy and recoverability are design requirements. A pending booking cannot look confirmed; a queue cannot look like an accepted submission.
- Existing showcase has local JavaScript/CSS sources and offline HTML output. No production framework or native architecture selected by this handoff.

## Open decisions — do not silently treat as settled

| Question | Next action | Status |
| --- | --- | --- |
| Exact final typography, spacing, tokens and components? | Batch 01 proposes `design/system/tokens.css` + `components.css` (see log D1–D4) | Accepted by owner 16 Oct 2026 (see Owner review) |
| Which staff actions can actually be completed on iPhone? | Define per-screen read/review/action/web-handoff capability for the 12 flagged destinations | Open |
| Do any of the 50 workspaces split/merge when designed? | Preserve IDs initially; record rationale and update map/counts if owner adopts a change | Open |
| Should full regrade detail, organization flows or direct messaging become standalone routes? | Specify existing-workspace flows first using the coverage review | Open |
| What preview/source format will Claude use? | Plain JS/CSS sources + dependency-free Node build into one offline HTML per batch (log D5) | Accepted by owner 16 Oct 2026 (see Owner review) |
| First-school segment, exact SIS/IdP and validated buyer requirements? | Research hypotheses exist; require partner discovery before claiming a production contract | Open |
| Permitted browser/native design acceptance environment? | Respect the recorded restriction; use authorized review or user-assisted evidence. Batch 01 was not opened in any browser by Claude | Open — owner inspection requested |

## Owner review

### 16 Oct 2026 — decisions and open questions (owner, in chat)

After reading the review packet (`design/preview/index.html`), the owner said “looks good to me for all of those”. When asked what that covered, the owner confirmed: **accept D1–D58, and resolve every open question to what is currently drawn.** No design changes followed from this.

What this does **not** cover: a visual review of the 100 screen targets (the tracker keeps them at *Ready for review*), any browser, keyboard, screen-reader or device acceptance (still *Not run*), and the project-level rows above that were not proposals (iPhone staff action scope, workspace splits, standalone routes, first-school segment and SIS/IdP, acceptance environment). Communication scope (coverage area 8) remains open.

| Question | Topic | Resolution (drawn default, accepted) |
| --- | --- | --- |
| Q01.1 | iOS Search/Help placement | Search from a nav-bar button and Account; Help from Account and error links; no sixth tab (D50–D51). |
| Q01.2 | S05 “Message instructor” in the closed state | Kept as drawn: the button is shown with its route marked to be decided. Communication scope (coverage area 8) itself remains undecided, so this accepts a placeholder, not a messaging feature. |
| Q01.3 / Q03.5 | Should a regraded release notify the learner? | As drawn: the work shows a “Feedback updated” notice with old → new and the earlier release kept in history. No separate notification is drawn. |
| Q02.1 | TA invitation as the P42 sample | Kept: the TA invite (Maya Chen) stays the sample (D14). |
| Q02.2 | iOS staff Grading tab | Kept: iOS staff tabs are Teaching, Grading, Calendar, Updates (D17). |
| Q02.3 | May a rubric change re-score released work? | No: rule changes affect unreleased grading only; released work is listed as unchanged (D27). |
| Q03.1 | Does a staff Updates feed need its own destination? | No new destination; staff “Updates” stays a note as drawn (D33). |
| Q03.2 | Should Missing appear to learners before the next release? | No: learners see the released view only (S19). |
| Q03.3 | Learner sees allowance by name (“1.5× quiz time”) | Accepted wording as drawn. |
| Q03.4 | Can a TA release? | No: release is instructor-only. |
| Q04.1 | Can a TA record allowances? | No. |
| Q04.2 | Should the learner see the allowance basis label? | No: only the instructor sees the basis reference; all course staff see adjusted timing (D36). |
| Q04.3 | Record attendance; learner correction requests? | Attendance is recorded with its source; a correction quotes the request and keeps the original in history (D38). A separate learner request screen is not drawn. |
| Q04.4 | Who owns the “approved tool” list? | As drawn in S22: the tool shows as unavailable and names who reviews tool requests (D37). No owner is fixed beyond that. |
| Q04.5 | Can a department scheduler approve? | No: a department scheduler proposes within their department; the registrar approves (D39). |
| Q04.6 | Does Whiteboard write to the scheduling source? | No: the registrar applies the change in the source; Whiteboard records it and waits for the refreshed copy (D40). No live integration. |
| Q05.1 | Fifth student tab for Campus? | Yes, as drawn (D42). |
| Q05.2 | Who records reservation confirmation? | Event Services, by hand. |
| Q05.3 | Should a waitlist offer expire? | No expiry is drawn, and none is added. |
| Q05.4 | Who can complete an officer handoff? | As drawn: the president assigns, the incoming officer accepts the checklist, and the outgoing officer keeps the role until then (D46). The adviser and Student Activities do not complete it. |
| Q05.5 | Guests and walk-ins per event? | Yes: walk-ins are an event setting and guests are named at RSVP, as drawn in S32. |
| Q05.6 | Does attendance reconciliation feed other records? | No: it feeds the event’s own synced attendance only (D48). |
| Q06.1 | Who can create referrals? | Instructors and advisers only; TAs cannot (D52). |
| Q06.2 | Can a student see and decline a referral? | Yes, as drawn: the student can follow or decline. A decline is recorded as “declined by student” with no reason required. |
| Q06.3 | Who provides technical support? | The institution’s IT Service Desk. |
| Q06.4 | Second approver for vendor access? | No: one administrator grants temporary, scoped, time-limited vendor access that can be closed early (D58). |
| Q06.5 | Who makes the canonical-record choice? | As drawn in S38: the administrator chooses, with the official student-records source recommended, and the local record is flagged for the Registrar. Official data does not change (D57). |
| Q06.6 | Faculty sign-off for migration acceptance? | No: the implementation administrator’s acceptance alone, as drawn. |

## Decision log

Append date, decision, reason, affected screen IDs/platforms, owner/review evidence and any remaining question. The “proposed by Claude, not owner-reviewed” status lines below are kept as history: on 16 Oct 2026 the owner accepted D1–D58 (see Owner review). The screen visuals themselves are not yet owner-reviewed.

### 15 Oct 2026 — Batch 01: shared design system + student journey S01–S09 (web, planned iOS)

Status of every entry below: **proposed by Claude, not owner-reviewed.** Affects S01–S09 web/iOS now; intended as the default for later batches once accepted.

- **D1 Identity and colour.** Keep Whiteboard teal (`#007176` light, `#5cc8c8` dark fill with dark label) as the only identity colour; neutrals move toward Apple system greys; iOS dark uses true-black grouped backgrounds. Focus ring is a separate blue so focus never reads as selection. Reason: continuity with the showcase, restraint, distinct focus. Static contrast: 63 token pairs (light, dark, iOS dark) meet 4.5:1 text / 3:1 non-text; lowest text pair 5.34:1. Rendered contrast unverified.
- **D2 Type.** System font stack (SF Pro on Apple platforms) with Dynamic Type roles; web body 15 px, iOS body 17 pt; tabular figures for times/scores. A “Larger text” preview (+24%) is provided; reflow at real accessibility sizes is unverified.
- **D3 One status vocabulary** (`K.STATUS` in `batch01/kit.js`): Not started, Draft · not submitted, Queued · not received, Received, Not received, Feedback not released, Feedback released, Feedback updated, Excused, Locked, Closed, Extension applied, Last known, Read-only, Not open yet, Instructor preview. Always icon + words. Queued and Received never share colour/icon; Held/Not released is neutral (nothing is wrong).
- **D4 Navigation.** Web: sidebar (Today, Courses, Calendar, Updates; Campus: Events, Support) + top bar with Search P45 / Help P46 / Account P44, all still *proposed*. Narrow web collapses the sidebar to a menu and stacks columns — it stays a web page (no tab bar). Planned iOS: four tabs (Today, Courses, Calendar, Updates), account avatar in the nav bar; Search/Help placement on iOS is still open. Course sections are links (deep-linkable pages), not ARIA tabs.
- **D5 Preview format.** Editable sources `design/system/*.css`, `design/batch01/*.js`; `node design/build.mjs` embeds the S01–S09 briefs and routes from `showcase/app_map/*.json` and writes one offline `design/preview/batch01_student_journey.html`. No framework, no network assets. iPhone frames are HTML illustrations, not a native build.
- **D6 Truthful submission states.** Web cannot background-queue; it says so (S06 offline, S07 queued). Planned iOS may queue but shows “Queued · not received” until server acknowledgment; only then S08 “Received”. Interrupted shows “Not submitted” with no reference number.
- **D7 Review before send.** Scan/upload never submits; S07 confirmation restates attempt, pages and coverage. Editing a received attempt opens a copy (Attempt 2) with the original receipt preserved.
- **D8 Camera permission.** Pre-permission explainer, then the OS/browser prompt; denial makes Photos/Files/upload the primary path and Settings secondary.
- **D9 Feedback privacy.** Today/notifications say feedback exists but never show the score. Held feedback shows receipt facts only (no grading progress). Re-release names the change (old → new) and keeps the prior snapshot. Excused is distinct from zero/missing. Downstream record acknowledgment is a neutral notice that does not make released feedback look provisional.
- **D10 Dates.** US format with explicit time zone (“Fri, Oct 16 · 11:59 pm ET”); personal (allowance) dates lead, course dates shown secondary.
- **D11 Added design states** (not new routes): S04 syllabus view, S05 choose-method sheet, S07 confirm and queued-offline. Each is labelled “added” in the preview with a reason.

Remaining questions for the owner: accept/adjust D1–D11; iOS Search/Help placement; whether S05 “Message instructor” (closed state) should exist given communication scope (coverage area 8) is undecided; whether a regraded release should notify the student.

### 16 Oct 2026 — Batch 02: access/arrival (P41–P44) + instructor authoring (S14–S16, P47–P49)

Status: **proposed by Claude, not owner-reviewed.** Batch 02 was started on the user’s “continue” instruction *before* the owner reviewed Batch 01, so it builds on D1–D11 as still-unaccepted defaults; if D1–D11 change, Batch 02 inherits the change through the shared kit/CSS.

- **D12 Access shell.** P41–P43 use a focused page with no product navigation (web) and no tab bar (iOS) until identity and role are known. Whiteboard never asks for a password; the school’s identity provider owns credentials and recovery. Hand-off names the school, the exact sign-in host and the return destination.
- **D13 iOS sign-in** uses the system authentication session (Apple-owned prompt, then a secure system sheet). Shown as an illustration only; no native build.
- **D14 Invitations** show full details only to the intended, signed-in recipient; the wrong account sees a masked address. Expired/used links never create duplicate access; replacement is a request to the inviter. Sample invitation is a TA invite (Maya Chen).
- **D15 First use** is three steps (confirm details → preferences → first task), skippable and resumable; roles come from records, the person only chooses where to land. iOS asks for notification permission only after delivery choices are explained. Added state: P43 “Preferences step”.
- **D16 Account (P44).** Editable vs institution-managed fields are visually and semantically distinct (read-only, dashed, “Managed by institution”); pronouns default blank; photo changes go to review while the current photo stays. Sessions and delegated access (calendar feed) are separate lists. iOS Account also hosts the proposed Search (P45) and Help (P46) entries — still the open placement question.
- **D17 Staff workspace shell.** Web sidebar: Teaching, Grading, Calendar, Updates + course tools (Builder, Files, Rubrics, People, Next term). iOS staff tabs: Teaching, Grading, Calendar, Updates. Staff avatar colour differs from student (purple-grey) as a secondary cue only.
- **D18 Validation pattern.** Field-level error beside the field (aria-invalid + describedby) + a rail summary whose items move focus to the field; publish stays visible but unavailable with its reason; checks announce “Blocks publishing / Warning / Passed” as text. Errors block, warnings don’t.
- **D19 Student preview** has its own purple bar (“Viewing as a student · nothing is recorded”) with a direct return, on web and iOS; preview shows only what publication, dates and prerequisites allow.
- **D20 Change after publish.** Editing published/in-use work shows a quantified learner-impact panel before applying: receipts, submitted pages and quiz-attempt snapshots never change; quizzes and rubrics version (v3 → v4); in-use rubric changes require an impact preview and a future-only vs re-score choice (re-score routes to grading review, S17).
- **D21 Files.** Replace creates a version (history and usage locations kept); uploading/processing/failed are distinct statuses; an asset without an accessible alternative can be inserted only with the issue flagged into the page’s checks.
- **D22 Desktop-recommended destinations (P47, P49).** iOS shows a mapped subset (block list / rubric summary, focused sheets, read-only learner preview) plus a “Best on a computer” card with the web link. This is a presentation choice, **not** a native-parity decision.
- **D23 Lifecycle scenarios.** Where map states span a lifecycle (S14 draft→published, S15 draft→changed), states are drawn on the same record with scenario dates (e.g. S14 draft states dated before term, Aug 24). P49 uses two rubrics from one library: a new “Free-body diagram quality” (draft/invalid/ready) and the in-use “Kinematics problem-solving” (in use/change), whose criteria match Aisha’s S09 feedback.
- **D24 Build/check format extended.** `design/batches.mjs` registers batches; `node design/build.mjs [batch]` writes one page per batch; `node design/tools/check_batch.mjs [batch]` checks each. Cross-batch links (e.g. S14 → S03) open the other batch page at that state. Shared-kit edits made for this: iOS shell accepts a custom tab set; links resolve cross-batch; the S01 account avatar now opens P44 (route S01→P44 now has a control); controller supports focus-to-field buttons.

Remaining questions for the owner (in addition to Batch 01’s): accept/adjust D12–D24; is a TA invitation the right sample for P42 (vs. a student course join); should iOS staff have a Grading tab at all before S17 is designed; may an in-use rubric change ever re-score already-*released* work, or only unreleased grading.

### 16 Oct 2026 — Batch 03: quiz, discussion, calendar, updates (S10–S13) + grading and release (S17–S20)

Status: **proposed by Claude, not owner-reviewed.** Started on the user’s “continue”, before owner review of Batches 01–02; inherits D1–D24 unaccepted.

- **D25 Graded ≠ released.** Staff-complete reviews are “Graded · staff only” (purple/accent, check icon); learner-visible results are “Released” (green). The gradebook shows a staff calculation and a separate “Learner sees” column, so a graded-but-unreleased score never looks published.
- **D26 Grading workspace (S17).** Web: roster | learner page | score/rubric/comment panel; the question selector drives all three. Saved scores do not count as a completed review; “Mark review complete” stays disabled with the number of unreviewed questions. Missing work has no score field at all. TA after access ends: read-only, saved work kept, names who can restore access. Three panes need ~1240 px of app width; below that the roster becomes a horizontal picker row (unverified in a browser). iOS: learner title + question picker above the page, grading in a sheet — urgent review only, not a parity claim.
- **D27 Rubric rule changes (S18).** Edits are previewed as an impact table (learner, level, score now → after, effect) before Apply. Manual scores are never overwritten by a rule change. Only the instructor applies; a TA can propose (Apply disabled with reason). Applying versions the rubric (v2 → v3). Released work (PS3, v1) is listed as unchanged — this avoids, but does not settle, the open question on re-scoring released work.
- **D28 Gradebook statuses (S19).** Not graded = excluded; Missing = 0 after close; Excused = removed from denominator; Graded = staff calculation only; Released = both. Each state is explained in a rail for the focused cell, with the arithmetic shown.
- **D29 Release (S20).** Steps Scope → Exceptions → Preview → Release. The preview is the exact per-learner payload (attempt, receipt, score, rubric version, comments). Any change after preview makes it stale and blocks release until refreshed. Web release needs an explicit confirmation checkbox; iOS uses a final confirmation step. Post-release edits become a held draft with old → new; releasing creates a new snapshot (R2) and keeps R1 — the same records Batch 01’s S09 “re-released” state shows. Institution record acknowledgment is separate and neutral (S38 later).
- **D30 Quiz attempt (S10).** Rules first: window, personal time (allowance named, separate from assignment extensions), attempts, release rule. Answers save per item; offline answers are labelled “Saved on this device · not sent” and Submit waits for a connection; the timer is described honestly (it keeps running). The submission receipt promises that questions and answers are kept together as a snapshot. Held results show no scores, keys or progress.
- **D31 Course conversation (S11).** Every contribution shows name, role chip (staff chips purple) and time; the composer states who you post as and who can see it. Locked threads remove reply controls rather than disabling them. The map state “course not published” is drawn as the Module 4 discussion before it opens.
- **D32 Calendar and updates (S12, S13).** Every calendar item names its source; a delayed source keeps last-known items, labelled; changes show old → new with who/when. Device-calendar sync is an optional switch with its own permission. Updates link to the changed record, never show scores, and say that delivery preferences change future email/alerts only; iOS keeps system notification permission and Whiteboard delivery switches as separate controls.
- **D33 Handoffs and shared-kit edits.** Student→staff routes (S08→S17, S10→S16) are explained in words with `data-handoff`, never linked; the checker now accepts that for handoff routes. Student Calendar/Updates tabs and nav, course Quizzes/Discussion links and the staff Grading/Calendar entries now open Batch 03 pages. Staff “Updates” stays a note: S13 is the student feed and no staff feed is mapped. The staff shell accepts another signed-in staff member (used for the TA views).

Remaining questions for the owner (in addition to earlier batches’): accept/adjust D25–D33; does a staff Updates feed need its own destination; should Missing appear to learners before the next release (S19 currently shows learners the released view only); quiz-time allowance shown to the learner by name (“1.5× quiz time”) — acceptable wording/privacy; can a TA release, or only the instructor (drawn instructor-only); should regraded releases notify the learner (still open from Batch 01).

### 16 Oct 2026 — Batch 04: course operations (S21–S23) + academic scheduling (S24–S25)

Status: **proposed by Claude, not owner-reviewed.** Started on the user’s “continue”, before owner review of Batches 01–03; inherits D1–D33 unaccepted.

- **D34 Course people and permissions (S21).** Staff and students in roster tables with role, access status, end date and the action beside each person. A course-role permission table answers in words (Yes / No / Propose only / Assigned work only). It matches D27 (TAs propose rubric changes) and D29 (release is instructor-only). Course roles never carry over to other courses or institution accounts. Institution access is S37’s job, so it is explained as a handoff and never linked. An invitation is not access: nothing is visible to the invitee until they accept while signed in (P42). Expired access blocks course actions, keeps saved work and offers Extend access with a named date. This is the restoration that S17 “access expired” points to.
- **D35 Revocation.** Revoking access opens a review (web dialog, iOS sheet) that names the person, role, course and term. It lists what ends and what is kept, and takes an optional staff-only reason. Revoked records stay: earlier scores remain attributed and released feedback is unchanged. This review is an added design state (S21 “Revoke review”) with its reason recorded.
- **D36 Allowances are operational records.** Each record stores what changes, which work, the personal dates or multiplier, who recorded it and when, and a basis label with at most a reference number (e.g. Accessibility Services AS-…). It never holds private or medical documentation. All course staff see the adjusted timing; only the instructor sees the basis reference. S17’s Excuse/Extension buttons now open S21. Tomás Rivera’s PS4 extension (recorded Mon, Oct 19, after S17 showed him Missing) is the sample. The route to S15 shows the personal date in the assignment editor.
- **D37 Course copy (S22).** The steps are Select → Dates → Preview → Copy. A “Never copied” list names the learner data that is excluded: people, submissions, scores and feedback, discussions, allowances and attendance. Dates shift by a stated rule (+21 weeks, weekdays kept), and source and destination dates sit side by side. Dates that land in a break are flagged for checking, not moved silently. An unsupported external tool blocks the copy until the instructor picks a placeholder page or leaves it out. “Approved tool” is shown as unavailable, with who reviews tool requests. The copy needs an explicit review checkbox on a current preview, and any change makes the preview stale. Applying creates a separate draft course with zero learners and leaves the source unchanged.
- **D38 Insights are facts, not predictions (S23).** The page shows three separate records: not submitted before close (named, with allowance status; excused learners not counted), module completion (three named counts) and attendance (each entry with its source). There is no composite score, risk label or prediction. An attendance correction quotes the request and records the corrected status, reason, who and when. The original entry is kept in history. When a source is delayed, entries are labelled “last known”, and an unentered session is not counted as absent. Referral to advising (S35) is a handoff.
- **D39 Scheduling-office shell and timetable (S24).** The new shell has Timetable, Change reviews and Find a room (S26, later). The role and term are shown, and iOS gets matching tabs. The timetable is a read-only copy of the institution scheduling source, with the system, status and last refresh always visible. Conflicts attach to the specific meeting, with text and evidence (a Facilities notice). Proposals appear inside the meeting as dashed “Proposed · not applied” notes while the source room stays shown. A department scheduler (e.g. Dr. Diane Reyes for Physics, from P41/P43) is assumed to see the same page filtered to their department and to propose but not approve. That scope is an assumption to confirm.
- **D40 Approve ≠ apply (S25).** Each room option shows its constraint verdict, and rejected alternatives stay visible: a room that is too small, and one that overlaps another class. A constraint evidence table compares current and proposed. Submitting and approving are both stated not to change the timetable. Apply source copy is a separate, acknowledged step. The change counts as “Applied” only when the refreshed source copy reflects it. Learners hear about it through Calendar (S12) only after that point, as a handoff. The MATH 220 move to Keene Center 105 (applied Thu, Oct 15 · 7:30 am) is the same change S12 shows learners at 7:40 am.
- **D41 Shared edits for Batch 04.** The staff sidebar gains Insights (S23), and People and Next term now open S21 and S22. The S14 course tools and iOS Course rows now link S21–S23. P41 and P43 scheduling roles now open S24. S17’s Excuse/Extension buttons open S21. The design-system nav table gains a Scheduling office row. `kit4.js` adds the scheduling shell, labelled radio/checkbox helpers and a timeline helper.

Remaining questions for the owner (in addition to earlier batches’): accept/adjust D34–D41. Can a TA record allowances (drawn: no)? Should the learner see the allowance basis label? Should attendance be recorded at all, and is a learner-initiated correction request in scope (communication scope is still undecided)? Who owns the “approved tool” list for course copy? Should a department scheduler approve within their own department, or only the registrar? Does Whiteboard ever write to the scheduling source, or only record that the registrar applied the change there (drawn as “Apply source copy” followed by waiting for the refreshed copy, with no live integration)?

### 16 Oct 2026 — Batch 05: campus spaces (S26–S27) + campus life (S28–S33)

Status: **proposed by Claude, not owner-reviewed.** Started on the user’s “continue”, before owner review of Batches 01–04; inherits D1–D41 unaccepted.

- **D42 Campus navigation.** The student web sidebar’s Campus group becomes Events (S28), Organizations (S29) and Support (S34, later). The student iPhone tab bar gains a fifth tab, **Campus**; this changes every student iOS frame in Batches 01–03. Organization officers keep the student shell plus a role-scoped organization section (home, event drafts, find a room, room requests, check-in, handoff). An event operator sees only that event’s check-in. Event Services and Student Activities staff get a campus-operations shell (Room requests, Find a room, Event reviews; iOS tabs Requests, Reviews, Rooms).
- **D43 Room search checks the whole interval (S26).** Every result repeats every requirement as met or not met, in text, and states its availability for the full start-to-end interval, including setup and teardown. Unavailable rooms stay listed with the conflicting booking named. Requirements are never dropped to find a match; “No full match” explains what each closest option lacks. Choosing a room is not a request.
- **D44 Request ≠ approval ≠ confirmation (S27).** A request moves Draft → Requested → Approved · not confirmed → Confirmed in source. Approval records a fingerprint of the exact details, and any change to them returns the request to review. Confirmation is a separate step: the approver records the reservation system’s confirmation number, and Whiteboard never books a room. A single date is cancelled on its own and the series is kept. Calendar shows the request with the same status words (new S12 requester state).
- **D45 Participation status (S28).** Place confirmed, Full, Waitlisted (#n of m) and Cancelled are text badges on every row and in the details. Capacity is a sentence (“48 of 60 places confirmed · 12 left”) before the bar. A waitlist position creates no pass and no calendar entry. Cancelled events stay visible to people who held a place, with who, when and why, and their actions are removed. Only approved, published versions appear in discovery.
- **D46 Organization ownership (S29, S30, S33).** Drafts, room requests, funding requests and files belong to the organization, never to an officer’s account. A revision is an organization draft beside the unchanged published version. Capacity can’t drop below confirmed places. “Send for review” needs valid fields and every dependency at least requested. The handoff needs an assignment, the incoming officer’s acceptance and every required item done. Until then the outgoing officer stays in the role. Afterwards the outgoing officer keeps membership and the organization keeps the work.
- **D47 Independent dependency owners (S31).** Room (Event Services), funding (Student Activities Fund) and event review (Student Activities) each show their owner and status. A reviewer can read the room and funding decisions but can’t change them. An open dependency disables Approve, naming that dependency. Approve ≠ publish: approval fingerprints the revision; publishing replaces version 1 and notifies the confirmed attendees.
- **D48 Offline check-in is not attendance until synced (S32).** Check-ins made offline read “Queued on this device · not synced”, and the event total counts synced records only. Reconciliation shows each queued record’s result. A duplicate keeps the earlier check-in and names the device and time. An ineligible result gives a reason and what to say, with no operator override. Operator scope is one event for a set time. Manual lookup covers a denied camera.
- **D49 Student pass (added S32 state).** The pass shows a decorative code, a short typed or spoken code as its accessible equivalent, and the event, time, place and status. It works offline and needs no calendar permission. Wallet is out of scope.
- **Shared edits for Batch 05.** These close the earlier “later batch” notes. `K.web` takes `who` and `groups`. S01’s Explore events and campus row open S28. S12’s campus event and S13’s campus update open S28. S12 gains a requester state (route S12→S27). S24’s Inspect room options and the scheduling Find a room link open S26 (the S26 preview follows the event scenario; a note says so). The design-system nav table now lists campus navigation.

Remaining questions for the owner (in addition to earlier batches’):
- Accept or adjust D42–D49.
- Is a fifth student tab right, or should Campus live under Today?
- Who records the reservation confirmation: Event Services by hand (drawn) or a source integration?
- Should a waitlist offer expire, and after how long (none drawn)?
- Can the president, the adviser or Student Activities complete a handoff?
- Are guests and walk-ins configured per event?
- Does attendance reconciliation feed any record beyond the event?

### 16 Oct 2026 — Batch 06: student support (S34–S36), institution operations (P50, S37–S40), shared tools (P45–P46)

Status: **proposed by Claude, not owner-reviewed.** Started on the user’s “continue”, before owner review of Batches 01–05; inherits D1–D49 unaccepted. This batch completes all 50 destinations × 2 platforms as design drafts.

- **D50 Support placement.** On the web, Support is the third item in the student Campus group (it now opens S34). On iPhone, Support lives under the Campus tab and the Today card; no sixth tab is added. Technical help (P46) is always a separate link, never a support service.
- **D51 Search and help entry on iPhone.** P45 is reached from a nav-bar search button (Today, Campus) and from Account (P44); P46 is reached from Account and from contextual error links. Neither gets a tab. Opening a search result pushes its destination; Back returns to the kept query.
- **D52 Referrals share facts, never judgments (S34–S35).** A referral carries the course, one observed fact and a note the student will read. It never carries grades, scores, submissions, attendance, allowances, private notes, diagnoses or risk labels. Both recipient views are previewed before sending. Destination and student-visible note are required. Corrections keep the earlier wording in the referrer’s history only. Teaching assistants have no referral permission (drawn: instructor or adviser only).
- **D53 One case, two views (S36).** Staff notes and the student-safe status are separate regions of the same case. Every state names who owns the next step, including “no one”, and the student status stays truthful when a case is unowned. Redirect and return-to-queue keep ordered history. The service can’t edit a referrer’s text; it asks the referrer (S35 handoff). Added S36 state: “Student view”, for arrivals from S13 and S34.
- **D54 Search never hints at hidden material (P45).** Results come only from what the person can open. Restricted items are not shown, counted or hinted at; the empty state says what search covers and who to ask. Each result names its source; archived items are labelled before opening.
- **D55 Technical requests list their diagnostics (P46).** Each diagnostic item is an editable checkbox, with a “never included” line (pages, answers, grades, messages). Photos/Files permission is asked only when adding an attachment. A technical request never changes an assignment receipt. Vendor access for a request is an institution decision (S37).
- **D56 Institution administration shell (P50, S37–S40).** One administration shell with Initial setup, People/access/records, Connections, Migration rehearsal and Trust & AI controls. All five recommend desktop; the iPhone frames are read-first subsets with a “Best on a computer” note. No native parity is decided.
- **D57 Sources of record and acknowledgments (P50, S38).** The student records system stays official for people, enrollment and final grades. Setup records each source owner’s acceptance, and rehearsal is blocked until the Registrar accepts. A grade transfer reads Validated · not sent → Acknowledged / Rejected by source, row by row, with the source’s reason quoted. Duplicate people are resolved by an explicit canonical choice; nothing merges silently. Every connection is labelled “Sample refresh · not live”.
- **D58 Acceptance binds a fingerprint; controls are intentions (S39–S40).** Migration acceptance names one exact preview fingerprint and goes stale when the source or mapping changes. A rehearsal never implies a production migration, and learner submissions and grades are not migrated. AI drafting allowed at the institution never overrides a stricter course policy. Data-use and accessibility entries describe intentions, with no compliance or certification claim. Exports are local fictional samples. Temporary vendor support access names its purpose, scope and window, and can be closed early.
- **Shared edits for Batch 06.** These close every remaining “later batch” note. Student, staff, scheduling and operations shells: Search opens P45 and Help opens P46. Campus › Support opens S34. S01 Find support, S09 Ask for learning support and S13’s support update now link S34/S36. P41/P43 administrator choices open S37/P50. S14’s implementation acceptance and S20’s institution record are S37/S38 handoffs in words. Stale notes for S10–S14 and S17 (designed in Batches 02–03) are now links.

Remaining questions for the owner (in addition to earlier batches’):
- Accept or adjust D50–D58.
- Who can create referrals: instructors and advisers only (drawn), or TAs too?
- Should a student be able to see and decline a referral before the service acts?
- Who provides technical support: the institution’s IT Service Desk (drawn), or the vendor directly?
- Should vendor support access need a second approver?
- Is a canonical-record choice the IT team’s to make, or the Registrar’s?
- Should migration acceptance need faculty sign-off as well as the implementation administrator’s?
