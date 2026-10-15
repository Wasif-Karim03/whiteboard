# Whiteboard showcase: revision audit

Reviewed 15 October 2026 against commit `eca61e1` on `showcase/v2`.

**Outcome:** the showcase has broad visual coverage, but several connected workflows remain incomplete or inconsistent. Forty registered workspaces do not mean forty fully demonstrated workflows. Fix record correctness and task completion before expanding the page further.

At the audit checkpoint, this document produced an improvement backlog without editing the HTML. The subsequent authorized implementation is recorded in the current tracker; both original archives remain preserved. Findings apply to the self-contained showcase; production authentication, storage and integrations are a separate implementation scope.

Use [the readable tracker](05_update_tracker.md) for priorities and status, [the CSV](05_update_tracker.csv) for filtering, and [the execution plan](06_revision_plan.md) for build order. Earlier `03_progress.md` entries describe the prior implementation pass; this audit qualifies their completeness claims.

## Review method and limits

Reviewed the generated-page structure and source modules, all 40 workspace registrations, six journey definitions, shared controls/styles and the approved design requirements. Compared the proposed experience with `research/synthesis.md` and domain opportunity recommendations. An independent Astra reviewer examined workflow behavior using synthetic Node VM probes; the lead inspected sources, reproduced key defects and integrated the backlog.

All five existing check commands passed: student, teaching, campus, integrated and static HTML checks. New probes nevertheless reproduced faults in release approval, student evidence, excused work, module publication, feedback scope, policy consistency, RSVP/calendar state and referral correction. Reproduce them with:

```
node showcase/review/probe_review.cjs
```

Saved results: [evidence_2026-10-15.json](review/evidence_2026-10-15.json). These results document existing defects; they are not passing regression tests for a fix.

Browser appearance, actual focus behavior, screen-reader execution, mobile keyboard, clipping and runtime browser console remain unverified. The earlier local-file URL-policy restriction was respected; no alternate browser/localhost workaround was attempted. Visual proposals below are source-based review judgments, not claims based on screenshots.

## Step 1 — First impression, navigation and product story

**Keep:** Whiteboard branding, restrained teal palette, system typography, fictional-data label, LMS-first positioning, role entry points, offline delivery and honest roadmap. The page avoids invented schools, revenue, customers and assurance badges.

**Improve:** the page presents ten large interactive chapters before a reader has followed one complete outcome. Role links jump to sections but do not guide the reader through a role-specific story. Add a compact first-look path while keeping the full exploration available. Avoid adding more domains to compensate for incomplete core behavior. **REV-12, REV-13, REV-30.**

**Correct:** the hero is a separate static scene. It says the assignment is received even when the guided example starts with an empty draft, and calls the event “Open Lab” while the actual event is “Physics After Dark.” Share the data or label a deliberately separate scene clearly. **REV-11.**

**Navigation:** the walkthrough controller scrolls viewers away from its Back/Next controls. Next changes screens without explaining unmet actions; the student journey can end with held feedback. Workspace hashes can be opened but normal navigation does not update them. **REV-12, REV-29.**

## Step 2 — Student day, courses, calendar and updates

Workspaces reviewed: **S01, S02, S12, S13**.

**Keep:** a clear next task, familiar course structure, upcoming class context, notifications/preferences and separate calendar concepts for deadlines and meetings.

**Correct:** PHYS meeting details and some deadlines are hardcoded outside the canonical calendar. Empty-day and delayed-source controls add notices without changing the conflicting content beneath them. The personal calendar includes the event before RSVP and remains unchanged after cancellation, despite the RSVP success message saying it was added. **REV-11, REV-25, REV-38.**

**Improve:** demonstrate actionable updates derived from actual publication, release and event changes; add a clear past-course/term example when extending course navigation. Do this within the shared task model rather than making another independent inbox. **REV-14, REV-25.**

Research basis: [LMS opportunities](../research/01_lms/opportunities.md), [landscape opportunities](../research/05_landscape_missing/opportunities.md).

## Step 3 — Course materials, discussion and quizzes

Workspaces reviewed: **S03, S04, S10, S11**.

**Keep:** readable course home, syllabus and material alternatives, basic discussion posting and explicit assessment AI-use policy.

**Correct:** unpublishing Module 3 does not change its student material view. Builder order, visibility and prerequisite/release settings do not govern that view. Quiz bank additions, configured attempts and feedback-release options do not drive the student attempt. S10 explicitly calls itself a question-one preview, but the surrounding builder still implies a connected assessment workflow. **REV-08, REV-09.**

**Improve:** choose a bounded but complete quiz example with real local answer controls, review-before-submit and a visible configured result state. Include a useful empty/published content example and distinguish an authored announcement from the fixed demonstration text. **REV-09, REV-14.**

Research basis: [LMS recommendations](../research/01_lms/opportunities.md). Advanced proctoring and specialist exam engines remain outside this showcase revision.

## Step 4 — Assignment, capture, organization and receipt

Workspaces reviewed: **S05, S06, S07, S08**.

**Keep:** sample capture/PDF route, no-camera recovery, page tags/order/rotation, interruption/retry and a visibly fictional receipt. Actual camera or private-file upload is unnecessary for a shareable concept.

**Correct:** instructor and student see different AI-use rules for the same assignment. Recorded accommodations do not affect effective deadlines. Question pages reuse one generic solution illustration; the SVG label is not an equivalent transcription of its working. Rotated content needs browser verification because the paper wrapper clips overflow. **REV-10, REV-17, REV-36.**

**Improve:** associate missing-tag errors with the actual field, preserve focus after page actions, and validate invalid/empty dates and long input. Add a readable full-page/text route. Keep a receipt tied to an immutable submitted version rather than allowing review controls to obscure whether the viewer is editing a new draft. **REV-07, REV-15, REV-16, REV-17.**

## Step 5 — Faculty authoring, people, rollover and insights

Workspaces reviewed: **S14, S15, S16, S21, S22, S23**.

**Keep:** publishing controls, question bank concept, scoped TA view, correctable attendance and nonpredictive observations.

**Missing depth:** the showcase mostly edits the single seeded assignment. Creation, sample attachments and an empty-to-published course flow need a coherent demonstration. Operational allowances need downstream effect. Module and quiz settings need shared learner records. **REV-08, REV-09, REV-10, REV-14.**

**Correct:** course copy says the destination now has the reviewed content but sets only `copyApplied`; there is no inspectable destination with shifted dates or a tool-review item. The revision plan chooses an inspectable synthetic destination with the reviewed selections and shifted dates. **REV-37.**

**Improve:** teacher and student meeting/deadline displays must share selectors. Make insight counts traceable to source records; avoid implying clicks prove learning. **REV-11, REV-25.**

## Step 6 — Grading, gradebook and feedback release

Workspaces reviewed: **S17, S18, S19, S20, S09**.

**Keep:** rubric alongside the work, override awareness, conflict controls, held-versus-released feedback and snapshot-based student feedback after release.

**Highest-priority corrections:**

- Selecting Ben or Carmen still uses Aisha’s single submission-page collection. **REV-02.**
- The release preview stores IDs, not the approved content. A 27-point preview can publish a later 20-point score and edited comment without refreshed approval. **REV-03.**
- An excused learner can receive a numeric release even while the gradebook says Excused. **REV-04.**
- “Feedback for this answer” is stored once per learner; the same text appears under other questions. Saving one question marks the whole submission graded. **REV-35.**

Treat these as demo-integrity defects, even though the data is fictional. A school reviewer must be able to trust what the interface says it is approving. Validate independently calculated totals, statuses, rubric versions and release contents together. **REV-33.**

Research basis: [LMS correctness opportunities](../research/01_lms/opportunities.md), [cross-cutting readiness](../research/04_cross_cutting/opportunities.md).

## Step 7 — Scheduling and room booking

Workspaces reviewed: **S24, S25, S26, S27**.

**Keep:** explicit constraints, separate proposal/approval/source-application states, canonical meeting record, room authority and occurrence-level cancellation concept.

**Correct:** event-to-booking matching ignores the end of the time interval. A revised 17:30–23:00 event can publish against a room confirmed only until 19:00. Capacity can also be reduced below existing RSVPs. **REV-05.**

**Improve:** validate structured dates and intervals, retain useful pending/error recovery, and show source freshness and reconciliation where an authority changes. Ensure calendar/event cancellation semantics agree. **REV-15, REV-19, REV-38.**

Research basis: [scheduling opportunities](../research/02_scheduling_rooms/opportunities.md). Full optimization, sensor occupancy and a replacement SIS are still deliberately excluded.

## Step 8 — Events, clubs, attendance and officer transitions

Workspaces reviewed: **S28, S29, S30, S31, S32, S33**.

**Keep:** organization-owned drafts, distinct published version, funding/room dependencies, RSVP/waitlist and stable duplicate check-in identities.

**Correct:** Reset J4 mixes unpublished/draft event state with confirmed dependency state. Make Start/Reset a repeatable named scenario. **REV-06.**

**Missing depth:** a completed officer handoff does not update the actual roster president/contact. Show the incoming role, effective dates and transferred work. Add the inactive/unreachable organization case required by the discovery story. **REV-22.**

**Improve:** represent a small ordered attendee/waitlist roster, an intelligible student pass and manual/guest eligibility. Current aggregate counters cannot demonstrate fair promotion or meaningful pass validation. Link participation to the personal calendar. **REV-23, REV-38.**

Research basis: [events and clubs opportunities](../research/03_events_clubs/opportunities.md). Official transcripts, payment settlement and secure elections remain intentionally deferred.

## Step 9 — Student support and advising handoff

Workspaces reviewed: **S34, S35, S36**.

**Keep:** service selection, explicit sharing choice, owner/capacity/queue states and an authoritative degree-plan reference without claiming graduation clearance.

**Correct:** the correction action overwrites entered text with a fixed sentence. Completing the referral does not change the final student-facing S34 view in J5. **REV-21.**

**Improve:** show actual transition history and the correct receiving service/owner after redirection; distinguish requested from accepted appointments and carry student-safe updates through the final handoff. **REV-21.**

Research basis: [support opportunities](../research/06_student_success_advising/opportunities.md). Predictive scoring, clinical records and degree-rule replacement should stay out.

## Step 10 — Institution administration, migration and connections

Workspaces reviewed: **S37, S38, S39**.

**Keep:** planned connection directions, explicit external authority, honest readiness status, local fictional audit download and migration-before-acceptance framing.

**Missing depth:** duplicate resolution is a one-click boolean without the source rows or mapping decision. Migration maps every field at once without an inspectable asset/item exception report. Add a rejected/retry exchange and a reviewable preflight export. **REV-19, REV-20.**

**Improve:** model support access expiry and named actor/time in the fictional audit. Show the intended export/exit path and responsibilities for support/recovery rather than adding unsupported uptime claims. **REV-26, REV-27.**

Research basis: [cross-cutting opportunities](../research/04_cross_cutting/opportunities.md), [synthesis readiness gates](../research/synthesis.md).

## Step 11 — Trust, accessibility and AI

Workspace reviewed: **S40**, plus shared controls and policy in S05/S15/S17.

**Keep:** no certification badges, no selected provider/data terms, a usable AI-disabled route and a fixed authored sample rather than a hidden API call.

**Improve:** distinguish institution assistance settings from academic-use policy. Show course/assignment precedence and work context for optional draft feedback. **REV-28, REV-36.**

**Accessibility review:** native controls, labels, focus-visible styles, reduced-motion and dark color-scheme are present. Source review identifies focus-restoration and error-association risks, skipped heading levels and incomplete paper alternatives. Dense mobile text/actions require real rendering checks. **REV-07, REV-16, REV-17, REV-18, REV-31.**

A static token calculation found approximately 4.62:1 for white on the dark-theme accent and 5.80:1 on the light-theme accent. These two passing combinations do not establish whole-page contrast or accessibility conformance. Review guidance: [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), accessed 15 October 2026; applied selectively to this offline showcase.

## Step 12 — Roadmap, comparison, sources and handoff

**Keep:** fair category comparison, specialist-system boundaries, no invented dates, local conversation brief and preserved v1 archive.

**Improve:** make the intended first-school workflow and operational/portable-record path more concrete. Recheck every statement that suggests task completion against the revised behavior; change the old coverage record where a control is still just a visual. **REV-13, REV-27, REV-32.**

Keep advanced/native apps, new specialist domains, a design-system explorer and presentation mode behind the core fixes. No new backend, paid service, deployment or real campus data transfer is required to improve this showcase.

## Review conclusion

The strongest next revision is a smaller number of fully credible connected outcomes within the existing broad vision. Fix the incorrect records, complete the visible controls, improve navigation/focus and then perform the missing browser QA. Do not add speculative breadth before these checks pass.
