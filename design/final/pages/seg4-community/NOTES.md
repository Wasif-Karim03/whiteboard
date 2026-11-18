# seg4-community: notes

Nine pages: W28, W29, W30, W31, W33, W34, W47, W55, W56, on web, iPad and iPhone. Read with `pages/PAGES.md` (the contract) and `pages/SPINE.md`. Everything below was **chosen by Claude under owner delegation** (17 Nov 2026). All records are fictional and local. These are source checks only (`tools/seg4-community.test.mjs`, `check_render`, `check_vocab`, `check_lines`): no browser, keyboard, screen-reader or device check has run.

## Segment rules

1. **File shape.** Each page is one IIFE with a `STATES` array and `P.na(STATES, {...})`. No shared file is allowed in the folder, so a few small lookups are repeated per file: `anns`, `latest`, `setOf`, `topic`/`subject`.
2. **Branch order.** Authority first (TA access ended, `permissionUnavailable`, `staffGate`), then `loading`, then a record absent at the clock (`P.offHome` or plain text), then the state token, then the default view.
3. **TA after access ends.** W28–W31 draw the published content plus `P.taEndedNotice`, with no composer, no "Start a topic" and no reply control. W47, W55 and W56 return `P.staffGate`: the notice only, no learner data.
4. **Committing actions with no result scenario** (withdraw, publish, move member, lock, hide, post reply, start topic, mark read, save) are preview-only `K.button`s with a `note` ("Preview only: nothing is … in this prototype"). Confirm dialogs (W47 `move`, W55 `publish` and `withdraw`) keep a preview-only primary item with an id and note; no link claims a result page. This departs from the PAGES.md committing-action rule because no fixture holds the result (kit request K5).
5. **Record-true links (A10).** Every record link is `P.recordGo(page, type, id)`; a null result draws plain text. Course-level pages (W28, W30, W55, W56, W08) use collective labels ("Manage announcements", "Manage discussions").
6. **Announcement visibility.** W28 and W29 show only `published` and `withdrawn` records to every role. `draft` and `scheduled` appear only in the instructor's W55 list. A withdrawn record shows its title and a "Withdrawn" notice in place of the text, with no attachments. Staff keep the version history (version and time only on W29, full history on W55).
7. **Read state.** Only the student gets it, from `unreadAnnouncements` (New or Updated badge, else "Read"). Staff personas have no markers, so a staff row shows "Updated" only when there is more than one revision.
8. **Wording.** No kit label is quoted. Closed replies use `K.flag("closed")`, last-known copies `K.flag("lastKnown")` and the TA's read-only views `K.flag("readOnly")`. Other words: "Not published yet", "Scheduled", "Withdrawn", "Replies closed".
9. **Offline.** `P.offlineNotice` plus `K.flag("lastKnown")`. Every sending control becomes a disabled `K.button` with the reason "You're offline" and an ns-prefixed id.
10. **Published items only (A4).** W33 and W34 list group work only when the group assignment is also a published assessment (`P.assessments`).
11. **TA task access (A6).** W47 reads learners for a TA only when `taTaskAccess(...).active` and `taScope(...)` is non-null for the group assignment. An expired task is named by title under "Access ended" with no learner data. A scoped TA sees only groups whose members are all in scope, read-only.
12. **Role-safe links (A1).** No page links a page the frame's role may not open; staff frames never link W33 or W34.

## Drawn states per page

| Page | Drawn states | Variants |
|---|---|---|
| W28 Announcement list | loading, firstUseEmpty, filteredEmpty, offline, permissionUnavailable | none |
| W29 Announcement detail | loading, offline, permissionUnavailable, notYetAvailable | office-hours |
| W30 Discussion list | loading, firstUseEmpty, filteredEmpty, offline, permissionUnavailable | none |
| W31 Discussion thread | loading, invalid, saving, saveFailed, offline, permissionUnavailable | none |
| W33 My course groups | loading, firstUseEmpty, offline, permissionUnavailable | none |
| W34 Group workspace | loading, firstUseEmpty, conflict, offline, permissionUnavailable | none |
| W47 Group sets | loading, firstUseEmpty, invalid, saveFailed, conflict, offline, permissionUnavailable | move |
| W55 Announcement editor | loading, invalid, saving, saveFailed, offline, permissionUnavailable | publish, withdraw |
| W56 Discussion setup | loading, firstUseEmpty, invalid, conflict, offline, permissionUnavailable | none |

Every other state has an N/A reason of 140 characters or fewer. Blocking states (invalid, saving, saveFailed, offline, conflict) win over the dialog variants: no opener and no dialog.

## Review tier (iPad and iPhone) for W47, W55, W56

`DEFAULT_REVIEW_NOTE` applies. Each draws the handoff, the read-only record and status, and no fields or dialogs.

| Page | Read-only content | Instructor protective action | TA |
|---|---|---|---|
| W47 | set facts, rosters, handed-in receipts | "Lock membership for this set" | scoped read-only groups, no action |
| W55 | subject title and state, published text, versions, all announcements | "Withdraw announcement" (published subject only) | published list, no action |
| W56 | topic table, subject status | "Lock replies" (open subject only) | topic table, no action |

## Other choices

- W31 posts are drawn as cards (title: name and role; body: time, reply-to and text), not a `K.list`, because a list row has no body slot.
- W34 with no draft and no receipt says "Start it from the assignment page" and links the record-true assignment (`W19:motion`); there is no W20 record to link.
- W29 at a clock before the anchor announcement shows `P.offHome` with the `W29~default` link; `W29:office-hours` shows the revision current at that clock.
- W56's instructor and TA never see the group topic, because `visibleTopics` hides group topics from non-members (fail closed; K6).

## Assumptions

- **A1.** A count taken from a selector result (for example `enrolled(...).length`) counts as selector-derived.
- **A2.** Pages read `a.view.data.comms.announcements`, `a.view.data.groups.group_sets` and `.group_assignments`, filtered by `a.who.courseId`, because no selector exists (kit request K1).
- **A3.** Optional fields `withdrawn_at` and `scheduled_for` are read only when present.

## Reachable only through test data copies

The withdrawn branch, the closed-replies thread, draft and scheduled announcements, a moved student on W34, an unpublished group assignment, and the scoped or expired TA task on W47 have no fixture or scenario; `tools/seg4-community.test.mjs` proves them with modified data copies (K2, K4).

## Fix round 1 (inspection R01–R09)

- **R05 (W47).** `saveFailed` blocks Move, Save and Publish ("Retry the failed save first") and suppresses the move dialog; Retry save stays.
- **R06 (W47, W55, W56).** Review-tier protective actions are disabled with the web reason in every blocking state except form validation (`invalid`, whose form is web-only), and the matching notice is drawn. Chosen by Claude under owner delegation.


## Inspection 2 fixes

INSP2-04: W56 shows each post body beside its own author, timestamp and Hide control. K.list escapes the plain-text evidence; offline/conflict actions stay blocked. Chosen by Codex under owner delegation. Regression coverage is in the segment test file; source checks only.

## Phase 4 enrollment handling

- W55 shows a permission notice and no editor or dialog when no course is assigned; non-full tiers retain their handoff. Chosen by Codex under owner delegation.
