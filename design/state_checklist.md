# Design coverage beyond the primary screen count

Use the per-screen `states`, `web`, `ios`, actions and incoming/outgoing transitions in the app-map JSON as the first brief. This checklist adds shared coverage; not every state applies to every target. Record justified N/A decisions rather than drawing meaningless states.

## Every destination/platform

- [ ] Purpose, actor, institution/course context and information hierarchy are clear.
- [ ] Entry, next action, back/cancel and deep-link return are specified; multi-role people keep the correct context.
- [ ] Default/loading/empty/error/validation/success and unavailable/no-access states are specified where relevant.
- [ ] Destructive actions, unsaved changes, confirmations/undo and pending approvals have explicit behavior.
- [ ] Shared account/search/preferences/technical help preserve original workspace and role on return.
- [ ] Light/dark, readable contrast, visible focus, labels/error associations, keyboard order and reduced motion are considered.
- [ ] Desktop, narrow web and iPhone navigation are distinguished; long content, large text, safe areas and keyboard obstruction are considered.
- [ ] Role handoffs show responsible person/team, record status and authoritative source. Navigation does not grant permission.
- [ ] Design source, preview, state coverage and actual verification evidence are recorded in the tracker.

## Critical journeys

- Access: wrong institution, SSO return/failure/expiry, mismatched/expired invitation, role context and onboarding recovery.
- Submission: camera/file permission denial, accessible alternative, unreadable/reordered pages, progress/interruption/retry, draft versus accepted receipt, preserved prior attempt and truthful offline status.
- Assessment: publication/availability, timed/autosaved work, accommodations, immutable attempt snapshot, staff-only references, held versus released results and correction/regrade behavior.
- Teaching: draft/publish/student preview, resource versions/alternatives, prerequisite/release constraints, TA scope, answer-specific feedback and exact release preview/snapshot.
- Campus: room request versus authoritative booking, time/capacity/accessibility constraints, revisions that invalidate approvals, RSVP/waitlist/pass eligibility, guests and check-in reconciliation.
- Support: student-safe status, restricted staff context, assignment/escalation, correction history and accountable next action.
- IT: tenant/role scope, revocation/expiry, sync exceptions/retry, migration preview acceptance/staleness and honest trust/AI controls.

## Eight expanded areas from the coverage review

Specify these inside existing destinations before deciding they need extra routes:

1. S11: announcement authoring/draft/schedule/publication, threads and moderation.
2. S05/S15/S17/S21: groups, section-specific work, file rules, learner exceptions and controlled revisions.
3. S09/S19/S20: course-wide grades, correction/regrade lifecycle and export.
4. S10/S16: complete quiz authoring, autosave/time/recovery and attempt versions/history.
5. S29/S30/S31/S33: organization registration/renewal, configurable forms, rosters/roles, funding request history; formal finance remains external.
6. S26/S27/S28/S30/S31/S32: own events/bookings, details, recurrence exceptions, approval, passes and accessibility/guest flows.
7. S37–S40/P50: initial versus ongoing configuration, terms/archives, connector setup/mapping, audit and evidence.
8. S11/S13: communication scope. A new direct-message inbox is undecided, not automatically a committed feature.

## Evidence boundaries

Source checks validate structure/state logic. Browser inspection validates rendered behavior in that environment. Native simulator/device testing validates that build/environment. Owner review accepts a design direction. Keep these separate. No compliance or certification claim follows from this checklist.
