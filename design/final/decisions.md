# Whiteboard final design: decisions BD9 onward and C4–C6

BD1–BD8 live in [`design/reviews/board-decisions-2026-11-15.md`](../reviews/board-decisions-2026-11-15.md) and are not repeated here.

Every entry below was chosen by Claude under owner delegation (CLAUDE.md, 16 Oct 2026) on 15 Nov 2026. They are prototype defaults for the first HTML build, not school-validated policy, and the owner can reverse any of them. Institutional questions stay undecided: first school, late penalties, retention, upload limits and the accessibility support path. Where an entry touches one of them, the prototype shows a labelled sample and decides nothing.

Rules used to choose: the spec or permission matrix beats the drawn screen; take the more conservative authority; invent no institutional policy. Fix ids are rows in `tracker/fix_tracker.csv`.

## C4 · Release recall

- **Question:** Does a release have a "recall" that hides results again? ([02 #3](../../research/ux/02_instructors.md))
- **Decision:** No recall. The W53 release dialog says: "Students keep this result. You can correct it later. The correction is logged and students see 'Feedback updated'."
- **Why:** Final plan line 115. A recall would make "Released" untrustworthy for students; logged correction (synthesis rule 4, Q01.3, D27) already meets the instructor's need to fix mistakes.
- **Affected:** C4; journey walk J03, J05, J06 (see `design/reviews/journey-walk-2026-11.md`).
- chosen by Claude under owner delegation.

## C5 · Anonymous grading

- **Question:** How does anonymous grading ([03 #5](../../research/ux/03_tas_grading.md)) fit section-scoped TAs and regrades?
- **Decision:** An optional "Hide learner names while grading" setting per assessment. Default off; locked after the first receipt. Graders see stable aliases in random order. Names return at release. Regrades (W54) are always named.
- **Adjusted by the walk (clarified, not reversed):** while names are hidden, aliases replace names together on W48, W49, W50 and W51, in file names and routes (the drawn grader shows "aisha-ps4-sample.pdf" and "/grading/ps4/aisha"), and on group receipts; TA allocation views use aliases. Evidence: `design/reviews/board-deep-dive-2026-11-15.md:1764`, `:1751`.
- **Why:** Final plan line 116. Hiding names is compatible with TA scoping because the allocation still limits which receipts a TA sees; the reveal point is fixed at release so regrades, which need a released snapshot (BD24), are never anonymous.
- **Affected:** C5; journey walk J03, J08.
- chosen by Claude under owner delegation.

## C6 · Student label for graded, not released work

- **Question:** What does a student see after grading but before release? ([01 #11](../../research/ux/01_students.md) suggests "Being reviewed".)
- **Decision:** No change at grading. The student sees "Received · Feedback not released yet" until release.
- **Why:** Final plan line 117. Any student-visible change at grading leaks that grading happened (synthesis C6); BD9 makes "Received" the status word.
- **Affected:** C6; journey walk J02, J03, J06.
- chosen by Claude under owner delegation.

## BD9 · Status word for handed-in work

- **Question:** "Submitted" (synthesis rule 1) or "Received"?
- **Decision:** "Received" is the status and "Submit" is the verb. The synthesis's "Submitted" is replaced in the status vocabulary.
- **Why:** Final plan line 118. "Received" states what the system did (the receipt), not what the student attempted.
- **Affected:** DD-1.13.
- chosen by Claude under owner delegation.

## BD10 · Native presentation

- **Question:** Are iPhone and iPad drawn as native apps or as narrow web?
- **Decision:** iPhone and iPad are drawn as planned native apps ("planned presentation"); narrow web follows BD1.
- **Why:** Final plan line 119 and owner answer 1 (plan §6). Native parity is planned, not implemented.
- **Affected:** DD-1.03, DD-2.14, DD-3.20, DD-4.15.
- chosen by Claude under owner delegation.

## BD11 · Platform tier rule

- **Question:** Which tier (full, review and protect, handoff) does each page get on each platform?
- **Decision:** Applied in order: T1 web is always full. T2 a page whose board roles contain `s` or `g` is full on iPad and iPhone. T3 W42, W60 and O02 are handoff on iPad and iPhone. T4 on iPad, W48, W49, W51 (single-learner view), W53 (review only) and W57 are full. T5 every other staff-only page is review and protect, with the Part 5 protective-action text as its note. BD6 wins over the Part 5 device table and fix 5.18: their iPad editing requests are kept as notes only and never change the tier.
- **Why:** Fully determined by the board `PAGES` roles plus BD6; gives web 63/0/0, iPad 41/19/3, iPhone 36/24/3 (final plan lines 70–74).
- **Affected:** DD-5.18, `tracker/page_tracker.csv`.
- chosen by Claude under owner delegation.

## BD12 · Wrong-account invitation details

- **Question:** What does W03 show when an invitation is opened in the wrong account?
- **Decision:** Mask the wrong-account details on W03 (partial address; no course or role).
- **Why:** Final plan table (1.02); the W03 spec's acceptance check asks for masking.
- **Affected:** DD-1.02.
- chosen by Claude under owner delegation.

## BD13 · Email delivery defaults

- **Question:** W04, W10 and the W08 fixture disagree on email delivery.
- **Decision:** Receipts are always emailed; all other email is off by default.
- **Why:** Final plan table (1.15); keeps the receipt promise (synthesis rule 2) and the few-alerts rule (rule 7).
- **Affected:** DD-1.15.
- chosen by Claude under owner delegation.

## BD14 · Cancelling registrar classes

- **Question:** May an instructor cancel a registrar-sourced class on W32?
- **Decision:** Registrar classes get a "Class notice" instead; Cancel exists only for Whiteboard-owned events.
- **Why:** Final plan table (2.01); registrar meetings are read-only (WD15, Spec 01).
- **Affected:** DD-2.01.
- chosen by Claude under owner delegation.

## BD15 · Module completion

- **Question:** Does module completion require finishing an assessment (W16)?
- **Decision:** Module completion stays separate from submission.
- **Why:** Final plan table (2.08); the spec keeps module state separate.
- **Affected:** DD-2.08.
- chosen by Claude under owner delegation.

## BD16 · Grading-deadline authority

- **Question:** W07 says instructor-only, W32 says instructor or TA.
- **Decision:** The instructor sets grading deadlines; TAs see them read-only.
- **Why:** Final plan table (2.11, 6.16); the more conservative authority.
- **Affected:** DD-2.11, DD-6.16.
- chosen by Claude under owner delegation.

## BD17 · W21 confirmation

- **Question:** Does W21 confirm the exact payload or show an integrity attestation?
- **Decision:** W21 confirms the exact payload (items, files and what will be sent, with blanks flagged); any attestation sits inside the same submit dialog, not in place of the payload.
- **Why:** Final plan table (3.04); the spec checks the exact payload and synthesis rule 2 needs a review step.
- **Affected:** DD-3.04.
- chosen by Claude under owner delegation.

## BD18 · When the course total moves

- **Question:** Does the course total move with the item release or with its own projection release?
- **Decision:** The total moves with the item release, and the W53 preview shows the change (84.50% → 85.17%).
- **Why:** Final plan table (3.09); matches the W23 banner and keeps one release step.
- **Affected:** DD-3.09.
- chosen by Claude under owner delegation.

## BD19 · Letter grade source

- **Question:** Where do letter grades and rounding come from?
- **Decision:** The letter grade comes only from the W52 policy; no screen shows a letter that W52 does not define.
- **Why:** Final plan table (3.10). Boundaries and rounding are a course policy set in W52; the sample values are labelled fictional.
- **Affected:** DD-3.10.
- chosen by Claude under owner delegation.

## BD20 · Withdrawing an announcement

- **Question:** Can a published announcement be withdrawn?
- **Decision:** Yes. Announcements can be withdrawn, with history kept and a "Withdrawn" notice shown to learners in place of the text.
- **Why:** Final plan table (4.06).
- **Affected:** DD-4.06.
- chosen by Claude under owner delegation.

## BD21 · What course copy carries

- **Question:** The drawn W59 copies announcements; the spec forbids posts.
- **Decision:** W59 copies no announcements (or any other posts); the "not copied" list is shown in full.
- **Why:** Final plan table (5.05); the spec beats the drawn screen.
- **Affected:** DD-5.05.
- chosen by Claude under owner delegation.

## BD22 · Bank question versions

- **Question:** W41 says "pinned", W42 says "copies".
- **Decision:** Bank questions are pinned to a version.
- **Why:** Final plan table (5.07).
- **Affected:** DD-5.07.
- chosen by Claude under owner delegation.

## BD23 · TA view of grading policy

- **Question:** Can a TA see the W52 policy calculation?
- **Decision:** A TA sees a read-only calculation for assigned examples; editing stays instructor-only.
- **Why:** Final plan table (6.01); matches the W51 and W52 specs.
- **Affected:** DD-6.01.
- chosen by Claude under owner delegation.

## BD24 · Regrade fixture

- **Question:** W54 shows a regrade request on a held, unreleased PS4.
- **Decision:** The regrade example is re-based on Quiz 2 (released); a regrade request needs a released snapshot.
- **Why:** Final plan table (6.04).
- **Affected:** DD-6.04.
- chosen by Claude under owner delegation.

## BD25 · No scores in previews

- **Question:** W05 Home and W08 Activity show "8 / 10" and "8 of 10" for Quiz 2.
- **Decision:** Preview cards and activity items carry no score or grade on any platform. They say "Feedback ready" and link to W23 or W27, where the released result is shown.
- **Why:** The W08 spec, C14 and WD19 say previews carry no score (DD-1.01); the spec beats the drawn screen.
- **Affected:** DD-1.01, DD-2.02.
- chosen by Claude under owner delegation.

## BD26 · TA navigation and page access follow the permission matrix

- **Question:** The TA shell shows full instructor navigation (W14), and the W42/W59 TA states differ from `no_access_default`.
- **Decision:** Staff navigation is filtered by the Spec 02 permission matrix: a TA sees only allowed entries and informative read-only views. A page whose matrix entry is `no_access_default` for TAs (W42, W59) shows the standard W13 "not available to your account" state. Instructor navigation includes Assessments and Syllabus, and the W18 staff breadcrumb names the course, not "Builder".
- **Why:** Spec 02 (`spec/docs/04-spec-02-navigation-and-permissions.html`): "A TA sees only allowed entries and informative read-only views." The matrix beats the drawn screen and is the more conservative authority.
- **Matrix detail (inspection round 1):** NAV (`spec/docs/19-navigation-map-navigation-json.html`) keeps four staff entries for a TA in a scoped mode: Builder W35 `read_only`, Gradebook W51 `assigned_only`, People W45 `restricted_read_only`, Settings W36 `read_only`. They stay in TA navigation and open labelled read-only or scoped views with no edit affordances. The deep dive's claim that a TA "must not see" them (DD line 619) is rejected against the matrix.
- **Affected:** DD-2.03, DD-5.06; journey walk JW-028.
- chosen by Claude under owner delegation.

## BD27 · Quiz score selection

- **Question:** W25 and W27 do not show which attempt counts when more than one is allowed.
- **Decision:** W25 shows the quiz's attempt count and selection rule before Start, exactly as set in W41 (spec default: 1 attempt; latest completed attempt). W27 names the attempt that counts. The fixture value is labelled sample data.
- **Why:** The W41 spec field "Attempts and selection" says "choose highest/latest completed attempt and disclose before start"; synthesis rule 6 asks for the rules before Start.
- **Affected:** DD-3.16.
- chosen by Claude under owner delegation.

## BD28 · Individual overrides in group work

- **Question:** W47's acceptance check on individual overrides has no UI on that page.
- **Decision:** An individual override is made in W49 on one member, with a reason, and never changes the shared group receipt. W47 shows a read-only overrides summary (learner, reason, set by, link to W49). No staff version of W34 is added (BD8).
- **Why:** The W47 spec acceptance check ("Individual grade overrides attach to a member with reason and never mutate the shared submitted artifact") and the W49 score panel's "manual override reason" field. Keeps W33/W34 student-only per BD8.
- **Affected:** DD-4.08.
- chosen by Claude under owner delegation.

## BD29 · Discussion fixture

- **Question:** W30 and W31 disagree on the author and reply count of "Projectile motion".
- **Decision:** One reconstructed discussion fixture drives both pages. The thread's opening post is the one W31 draws (Aisha), and W30 shows that author and the fixture's real reply count.
- **Why:** The fixtures panel lists people but no discussion record, so the fixture is reconstructed and labelled as such (final plan §6, owner answer 2). The detail page shows the post itself, so it is the more specific source.
- **Affected:** DD-4.11.
- chosen by Claude under owner delegation.

## BD30 · Page priorities

- **Question:** W28/W30 are "core" in their specs and "optional" in matrix.txt; W56 is "follow-on" but W30 depends on it.
- **Decision:** The priority written in each page spec is canonical: W28 and W30 are core, W56 stays follow-on. In the prototype W30's discussions come from fixtures, so W30 does not need W56 to be built; W30's staff "Set up discussion" control links to W56.
- **Why:** The deep dive's corrections note (line 21) says the matrix column came from a faulty script and to use the page spec's priority.
- **Affected:** DD-4.16.
- chosen by Claude under owner delegation.

## BD31 · PS4 review fixture

- **Question:** W48, W51, W53 and W58 disagree on how much of Problem Set 4 is reviewed (JW finding on J03; DD-6.03).
- **Decision:** One reconstructed fixture: Aisha is reviewed and held; Ben is received and not reviewed (1 of 2). Every role and page reads it; W53 lists Ben as "Not ready, not included".
- **Why:** Three of the five drawn sources agree (W48 instructor, W53 instructor, W58 "reviewed 1 of 2", deep dive line 1939); the TA views are the outliers. One fixture truth stops the release screen misleading the instructor.
- **Affected:** DD-6.03; journey walk J03.
- chosen by Claude under owner delegation.

## BD32 · Quiz exception and recovery requests

- **Question:** W25 has no exception request, and an unsent offline quiz draft "requiring staff review" has no staff page (JW findings on J05 and J11).
- **Decision:** A student can send a typed request from W25 ("Ask about timing for this quiz") or from W27 when no receipt was confirmed. It lands in the W46 pending-request queue for the instructor and changes nothing until decided. Whether late drafts or requests after close are accepted is institutional and is shown as "not decided".
- **Also when a receipt exists:** W26 finalizes acknowledged answers at expiry but keeps newer unacknowledged edits on the device, so a student can hold a confirmed receipt and unsent edits. W27 then also offers "Send my unsent answers for review". The request carries the attempt id and the retained edits as a separate evidence record; the instructor inspects it from the W46 request as a read-only diff against the receipt. The original receipt never changes, and acceptance stays "not decided" (institutional).
- **Why:** The Spec 02 matrix gives students "Request through typed context" for allowances, and W46 already owns pending requests (DD-5.11). No new page and no invented policy.
- **Affected:** DD-3.07, DD-5.11; journey walk J05, J11.
- chosen by Claude under owner delegation.

## BD33 · TA policy examples

- **Question:** BD23 lets a TA read W52 examples, but the drawn example is a named learner's course total, which W51 bars a TA from seeing.
- **Decision:** TA-visible W52 examples use a fictional "Example learner" and show item and category arithmetic only. No named learner's course total reaches a TA. Instructors keep the named example.
- **Why:** The W51 spec says a TA sees "never full-course totals or roster"; the more conservative authority wins. Refines BD23.
- **Affected:** DD-6.01; journey walk J06.
- chosen by Claude under owner delegation.

## BD34 · Hiding and restoring published content

- **Question:** A mistaken publish cannot be taken back on W35 or any editor (DD-5.03).
- **Decision:** Every published item gets "Hide from learners" and "Restore earlier version" (W35, W37, W38, W40). Hiding removes the item from learner views but never changes received work, receipts or released results; a learner who already submitted keeps their W22 receipt.
- **Why:** Synthesis rule 5 (undo everywhere except irreversible steps) and the immutable-receipt rule. Release recall stays off (C4); this applies to content, not results.
- **Affected:** DD-5.03, DD-5.18; journey walk J04.
- chosen by Claude under owner delegation.

## BD35 · Late fact after a due-date change

- **Question:** If an instructor moves a due date on W40, does work already received change its "Late" fact (BD4)?
- **Decision:** No. A receipt keeps the Late fact computed against the due time in force when it was accepted. The W40 date-change impact panel says how many receipts keep their status. Whether a later change should waive lateness is institutional and not decided.
- **Why:** Receipts are immutable (project rule); BD4 defines Late as a receipt fact.
- **Affected:** DD-5.13; journey walk J04.
- chosen by Claude under owner delegation.

## BD36 · Where a quiz regrade request starts

- **Question:** BD24 re-bases the regrade example on Quiz 2, but W54's only learner entry is W23, and W27 has no request action.
- **Decision:** Keep Quiz 2 as the example. W27 gains "Request review", which opens the same typed dialog as W23 and lands in W54; W54's entry list adds W27. W27 also carries the full learner request lifecycle with the same states as W23: Review pending, Clarification needed (the staff question with a Reply action), Review declined (reason, score unchanged) and Review resolved (the outcome), each with time and decider.
- **Why:** BD24 is a plan default that stays; the smallest change that makes it reachable reuses the W23 dialog rather than inventing a new flow.
- **Affected:** DD-6.04; journey walk J06.
- chosen by Claude under owner delegation.

## BD37 · Where the quiz release preview renders

- **Question:** JW-134 proposed that W53 "Inspect learner feedback" open W27 for quizzes, but W27 is a student-only page and W53's spec asks for a "labeled assessment result preview without impersonation effects".
- **Decision:** The instructor's quiz release preview stays inside the staff surface W53 as a labelled, read-only "learner view" payload panel for one selected learner. It does not route into the student-only W27, shows no attempt, start or request actions, and has no impersonation side effects (no session switch, no read receipts, no audit entries as the learner).
- **Why:** SP/W53.html:2 "Opens labeled assessment result preview without impersonation effects"; W27 stays student-only, and the more conservative authority wins. No new route or permission is invented.
- **Future work:** Any route or permission for the preview belongs to W53 (a W53 sub-view, staff-only); W27 stays student-only.
- **Affected:** JW-134 (DD-6.05, DD-6.09); journey walk J05.
- chosen by Claude under owner delegation.

## BD38 · How staff see receipt facts

- **Question:** BD8 says staff inspect group work through "W47 membership, W22 receipts and W49", but W22 is a student-only page (JW-183, DD-4.01). Where do instructors and TAs read receipt facts?
- **Decision:** W22 stays student-only and no staff link points at it. Staff (instructor, TA) read receipt facts (immutable reference, received time, attempt, learner/group member snapshot and the immutable contents metadata) on their own authorised pages: W48 (grading queue) and W49 (grader, entered from W48), after checking membership and historical receipt snapshots in W47. These views are course-scoped, TA access stays limited to the assigned learners/questions, and receipt facts are read-only there. BD8's wording "W22 receipts" is superseded for staff access; the rest of BD8 (remove the W47 to W34/W33 links, W33 and W34 stay student-only) stands.
- **Why:** SP/W22.html:2 "Roles: student". SP/W49.html:2 "Roles: instructor, ta", Document region "Original pages, page tags, accessible download and receipt metadata", Data "Read immutable receipt/pages/tags", and the group override rule "member belongs to receipt snapshot". SP/W48.html:2 "Roles: instructor, ta", Queue region "learner/group snapshot, attempt receipt", field "Selected receipt immutable reference", sorted by received time. SP/W47.html:2 "Group work received … Lock historical member snapshot" and "TA receives only authorised group/receipt scope". Staff already have every record they need on their own pages, so no staff mode of W22 is invented (the more conservative authority wins). BD8's source file is not edited.
- **Affected:** DD-4.01; JW-183; journey walk J07.
- chosen by Claude under owner delegation.

## BD39 · Status vocabulary and who sees each word

- **Question:** DD-1.13: the System sheet says students see only seven words, but C04 and W24 need "Held", "Queued" and "Missing", and "Late" is undefined. Which words exist, what do they mean, and who sees each?
- **Decision:** One table, used by C04 and every page that shows a status. Every label is shown as text plus icon plus colour, never colour alone (synthesis rule 1, C04 "Icon plus words; color is secondary").

  | Label | Meaning | Visible to | Notes |
  |---|---|---|---|
  | Draft | Own work not yet submitted. | Student (own work only). | Never a receipt. |
  | Received | The system accepted the work and issued an immutable receipt. "Submit" is the verb; "Received" is the status (BD9). | Student, instructor, TA (anyone with receipt access: W22 for the student, W48/W49 for staff per BD38). | Replaces "Submitted" in synthesis rule 1. Until release a student sees "Received · Feedback not released yet" (C6). |
  | Late | A neutral receipt fact: accepted after the personal due time and before close, computed from the accepted time (BD4). Shown with Received, never instead of it. | Student and staff. | No penalty; late-penalty policy stays an open institutional question. The fact does not change when a due date moves (BD35). Attendance says "Arrived late" (BD4). |
  | Held | Staff review hold: graded or revised work kept back from release. | Instructor, TA only. Never shown to students. | If nothing has been released for the item, the student sees "Received · Feedback not released yet" with no score or progress (C6; SP/W24 "Held work" state). If a correction to an already released result is held, the student keeps seeing the latest released result and label (SP/W49 "Old released snapshot unchanged; new revision held"; C4 no recall); "Feedback updated" appears only once the correction is released. C04's "Held, not released" badge is the staff form. |
  | Queued | A send or sync is pending on this device; the work is not yet received. | The submitter only. | Not a receipt and never visually equivalent to Received (C04); no receipt reference is shown while pending. |
  | Missing | Past close with nothing received and no active allowance. | Staff at close; the student only after the Missing outcome is explicitly released. | Before release the student sees the neutral fact "Not received · closed", computed from the student's personal close time including any active allowance or extension (SP/W51 Missing "Close passed, no receipt, no active allowance … learner status waits for release"; Q03.2 "learners see the released view only"). Shows no score. A zero or denominator effect applies only after release, labelled Missing separately from a numeric zero (SP/W24 "Released missing"). |
  | Released | Feedback and result are visible to the student. | Student and staff. | Kept after release; a held correction does not change it, and the student sees "Feedback updated" only when the correction is released (C4). |
  | Graded | Staff finished grading; not yet released. | Instructor, TA only. | Students see no change at grading: "Received · Feedback not released yet" for a first result (C6), or the latest released result for a regrade (see Held). |
  | Excused | An instructor exception is active for this item, so it is removed from the denominator and never shown as zero. | Staff while the exception is active; the student only once the excusal is released. | Staff: SP/W51 Excused "Instructor exception active", shows "Remove denominator; never show as zero". Student: SP/W24 "Released excused", when "Excusal released", "Remove item from denominator per published rule; not zero"; W24 "Missing and excused affect learner totals only after release". Until the excusal is released the student keeps seeing exactly what they saw before it: if a result or Missing outcome was already released, that latest released snapshot and its label stay (C4 no recall; SP/W24 "All learner arithmetic uses released snapshots"); otherwise the current work state applies (Not started, Draft, Queued or Received before personal close; Received, or "Not received · closed" only once personal close has actually passed). On release, the learner label and the denominator treatment switch together. Consistent with D28 "Excused = removed from denominator". |

  **Other labels.** The original System sheet and D3 list more words than the table. Each is accounted for here (the System sheet's seven are Not started, Draft saved, Received, Released, Late, Excused, Needs action; deep dive, Status vocabulary):
  - Not started: kept as the student's word for an item with no draft and no receipt; it is not a receipt state, so BD39 adds no row and does not redefine it. No source defines it further.
  - Draft saved and Draft · not submitted: replaced by Draft. "Draft saved" collides with save-status wording (deep dive), so save-status text stays in C12 ("Saving…", "Saved locally", "Save failed") and never doubles as a status.
  - Queued · not received: replaced by Queued.
  - Not received: replaced, only once the student's personal close has passed with nothing received, by the pre-release fact "Not received · closed" (see Missing); before close the item keeps Not started, Draft or Queued. "Missing" is shown to the student only after release.
  - Feedback not released: replaced by "Received · Feedback not released yet" (see Received, Held and Graded).
  - Feedback released: replaced by Released. Feedback updated: kept as a student phrase, shown only once a held correction is released (see Held and Released).
  - Needs action: kept only as C04's attention badge ("Received | Held, not released | Queued | Needs action"). It is not a record status, is never shown instead of Received or Queued, and the sources give it no further meaning.
  - Locked, Closed, Extension applied, Last known, Read-only, Not open yet, Instructor preview (D3): access, availability and context states, not work statuses. They are unchanged and outside this table. Extension applied matters here only because it moves the personal close time used for "Not received · closed".

- **Why:** This reconciles four sources. C6: students see no hint of grading before release, so Graded and Held are staff-only and the student label stays "Received · Feedback not released yet". Synthesis rule 1 (UX-R01, `research/ux/00_synthesis.md:27`): one vocabulary for every role, with "Submitted" replaced by "Received" per BD9 and "Graded · staff only" kept. BD4: Late is a neutral receipt fact with no penalty and belongs in the status vocabulary. C04 and SP/W24 add Held, Queued and Missing, so the student-visible set is Draft, Received, Late, Queued, Released and, only once released, Missing and Excused, plus the C6 phrase and the pre-release fact "Not received · closed"; staff also see Held, Graded, unreleased Missing and an active Excused exception.
- **Affected:** DD-1.13; JW-168. Implementing the table in C04, the System sheet and the pages is Phase 2 work.
- chosen by Claude under owner delegation.
