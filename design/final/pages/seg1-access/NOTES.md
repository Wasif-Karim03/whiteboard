# seg1-access notes (W01–W04, W08–W13)

All decisions here are chosen by Claude under owner delegation. Source checks only (`tools/seg1-access.test.mjs`), not browser, device or accessibility acceptance. All data is fictional.

## Drawn states and variants

| Page | States | Variants | Mode |
|---|---|---|---|
| W01 | loading, filteredEmpty, saving, saveFailed, offline, permissionUnavailable | leaving | access |
| W02 | loading, offline, permissionUnavailable, sessionExpired | destination-gone | access (all roles) |
| W03 | loading, permissionUnavailable | wrong-account | guest access; others app |
| W04 | loading, firstUseEmpty, invalid, saving, saveFailed, offline | preferences, first-task, skip | app |
| W08 | loading, firstUseEmpty, filteredEmpty, saveFailed, offline, deviceDenied | settings | app (activity) |
| W09 | loading, filteredEmpty, invalid, conflict, offline | results, group-only | app (search) |
| W10 | loading, invalid, saving, saveFailed, offline, sessionExpired | sign-out | app (account) |
| W11 | loading, firstUseEmpty, filteredEmpty, offline | none | app (tools) |
| W12 | invalid, saving, saveFailed, offline | review | guest access; others app (help) |
| W13 | permissionUnavailable, sessionExpired | maintenance, retry-failed | see below |

## Decisions

1. **W03 states only the supported fact (A7).** No invitation record exists; each persona's enrollment already grants the role. W03 says "You already have access to this course as <role>" and "This invitation's status cannot be checked in this prototype"; Accept is always disabled. No acceptance is claimed.
2. **W11 uses one sample entry with unknown eligibility.** No tool, provider, host, license or date is invented.
3. **W12 creates no reference.** Submit request is preview-only; `success` is N/A.
4. **W08 rows use the fixture `go` unchanged,** so the J09 step opens W31 (the canonical thread), not W30. W30 is reached from W31 (seg4).
5. **W02 uses access mode for every role:** authenticated nav is never drawn during verification.
6. **W13 mode rule:** access for a guest, for `sessionExpired` and for both maintenance variants; app mode with no current nav item otherwise.
7. **Identity transitions are preview-only (A1).** A page link keeps the current role, so Sign out, Use another account, Restart sign-in, Sign in again and the W01 → W02 hand-off are preview-only buttons with the note "Preview only: in this prototype, switch the role in the viewer bar or follow the tour". The J01 step W01 → W02 is carried by the tour; the test asserts W01 has no W02 link. Links to W01 remain only for guests.
8. **State precedence.** Authority (guest, TA access ended) runs before states; blocking states (W01 filteredEmpty/saving/saveFailed/offline/permissionUnavailable; W10 offline; W12 any state) draw no dialog opener and no dialog, even with a dialog variant. W04 forces step 1 on `invalid` and step 2 on `saving`, `saveFailed` and `offline`. W08 opens the settings dialog on `saveFailed` so the failure is visible.
9. **Record-true links (A10).** "Open course" and "Open your course" use `P.recordGo("W14", "course", …)`; the TA queue link uses `P.recordGo("W48", "assessment", task)`. W09 rows use `P.recordGo` or are plain text.
10. **W09 sample queries** ("projectile", "orbit", and "p" for the invalid view) are presentation constants; results come only from published assessments (A4), published announcements and `sel.visibleTopics`.

## Assumptions

- A1: a count derived from a selector-returned list is selector-derived (W09 result count).
- A2: `quiz2` resolves through `sel.assessment`; if not, the W08 row shows only its kind label.
- A3: UI copy constants (80-character name limit, 20-character request minimum, reminder options, help topics) are not figures.

## Direct reads (SPINE A2, listed as kit request 7)

`world.institution`, `world.enrollments`, `world.notice`, `comms.announcements`.

## Fix round 1 (inspection R01–R09)

- **R02, R03 (W08).** An activity row resolves only against records the viewer may see now: published course assessments, published course announcements, `visibleTopics`, and receipts via the scoped `P.receiptById` (so a receipt row names its own assessment and drops when that task has expired). An unresolved row is not shown. Chosen by Claude under owner delegation.

## Phase 4 enrollment handling

- W04, W09 and W10 show an empty account/course state when the viewer has no assigned course, before reading course or identity details. Chosen by Codex under owner delegation.
