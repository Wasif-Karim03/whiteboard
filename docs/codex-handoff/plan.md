# Phase 3 plan: remaining 51 pages in six segments (combined)

## 0. Coordinator preamble (binding on all segments)

- Common rules: `/Users/wasifkarim/.claude/team-runs/Whiteboard-20261117-090843/common-brief.md` (folders, frozen files, size ≈75 KB page source per segment, vocab/selector rules, tests per segment, decisions marked "chosen by Claude under owner delegation").
- **Already done by the coordinator:** `tools/spine.test.mjs` structure test relaxed to "the 12 spine pages are real" (only spine pages asserted non-placeholder). Builders must not edit it further. The coordinator adds `import("./<segment>.test.mjs")` lines to `tools/index.js` after the builds; builders don't edit `tools/index.js`.
- Segment notes: `pages/<segment>/NOTES.md` (loader ignores `.md`). Kit requests: append-only under `## <segment>` in `design/final/kit_requests.md`.
- **Cross-segment rule for committing actions with no result scenario** (publish, withdraw, move member, lock, copy, apply, accept, request): draw them as preview-only (note) or disabled-with-reason controls; never link a fabricated result page. This is a recorded departure from PAGES.md's committing-action rule, justified because no fixture holds the result; each segment lists the affected actions in its NOTES.md and kit requests.
- Global pages (W01–W13, W05–W07) don't use `P.shell` (it forces course tabs); course pages do.
- Direct reads of non-banned `a.view.data.*` collections (enrollments, institution, modules, announcements, group_sets, group_assignments) are allowed where no selector exists (SPINE A2), and each is listed as a selector kit request.
- Proof for every segment: its own `tools/<segment>.test.mjs`, `check_render`, `check_vocab`, `check_lines`; final combined proof by the coordinator: all tests, `check_all`, `legacy_check.sh`, `build.mjs` + size caps.


---

## Segment: Plan: Phase 3 segment `seg1-access` (W01, W02, W03, W04, W08, W09, W10, W11, W12, W13)

### 1. Goal

Replace the ten `seg1-access` placeholders with real page files for web, iPad and iPhone, plus one test file and a notes file. Fixture gaps are drawn as the smallest truthful workaround and logged in `kit_requests.md`.

### 2. Context (verified)

Root: `/Users/wasifkarim/Claude/Projects/Whiteboard/design/final/` (paths below are relative to it).

- **Layout.** One file per page at `pages/seg1-access/<ID>.js`; `.md` files beside page files are ignored (`pages/PAGES.md:9`, `tools/pages.test.mjs:139`). All ten pages are manifest segment 1 (`manifest/pages.js:21-24,28-33`). No extra `.js` helper file is allowed in the folder, and `pages/shared.js` is frozen, so small per-file duplication is expected.
- **Tiers.** Every page is `["full","full","full"]` (`manifest/pages.js:21-33`). `K.handoff` throws on full (`kit/API.md:102`), so never call `K.handoff`, `P.handoff` or `P.bareHandoff`. Platform differences are layout only.
- **Roles.**
  - W01: guest only.
  - W02, W03, W12, W13: guest, student, instructor, ta.
  - W04, W08, W09, W10, W11: student, instructor, ta.
- **Anchors.** None of the ten pages is in `manifest/anchors.js`, so all are course-level with home `default`, and `sel.anchorFor("<ID>")` returns null (`anchors.js:52-55`). Any variant is a presentation variant declared by the page.
- **Required failure states** (`fixtures/scenarios.js:134-135`): W01 and W02 must draw `permissionUnavailable` (wrong-institution); W03 must draw `permissionUnavailable` (invite-expired).
  - `fixtures/samples.js:15-28` has no sample for either id, so `sel.failureSample` returns null. These states draw no date or figure.
- **Journeys** (`manifest/journeys.js:33,45,46`), all at `default`, token null:
  - J01: W01 (guest) → W02 → W03 → W04 → W05 (student).
  - J09: … W29 → W08 → W30 … (student).
  - J10: … W07 → W08 (last step).
- **Shell.**
  - `mode: "access"` gives logo, `<h1>`, body and `links`, with no nav. Overlays (`dialog`, `toast`) still render (`kit/adaptive.js:311-319`, `shell-web.js:47-48`).
  - Any role may return `mode: "access"`; the composer merges the render result unchanged (`viewer/compose.js:94-95`).
  - `P.shell` forces `navActive: "courses"` and adds course tabs (`pages/shared.js:56-61`). Do not use it here; return a plain object with `navActive` set to `"activity"`, `"search"`, `"account"`, `"tools"`, `"help"` or `null`.
- **Viewer.** A guest has `{role: "guest", personId: null, courseId: null}` (`fixtures/world.js:134,147-153`).
- **Selectors and data used** (signatures checked):
  - `sel.person(view, personId)` → `{name, email, role}`.
  - `sel.course(view, courseId)` → `{code, title, term, section, archived, key}`.
  - `sel.verifiedRole(view, who, courseId)`.
  - `sel.accessEnd(view, personId, courseId)`, `sel.gradingTaskFor(view, taId, assessmentId?)`, `sel.assessment(view, id)`.
  - `sel.nextDue(view, courseId, who)` → `{assessmentId, due}` or null; student only (`coursework.js:200`).
  - `sel.activityFor(view, personId)`, newest first; items are `{at, kind, ref: {type, id}, go}` (`activity.js:27`).
  - `sel.unreadAnnouncements(view, courseId, personId)` → `[{id, reason}]`; `sel.visibleTopics(view, courseId, personId)` (`comms.js:96,110`).
  - `sel.fmtDateTime`, `sel.zoneAbbr`.
  - `P.when(a, iso)`, `P.taEnded(a)`, `P.taEndedNotice(a)`, `P.permissionNotice(a, text)`, `P.loading(a, label)`, `P.offlineNotice(a)`, `P.assessments(a)`, `P.recordGo(pageId, type, id)`, `P.na(drawn, own)`, `P.id(a, suffix)`, `P.stack`, `P.links`, `P.p`.
  - Direct reads with no selector: `a.view.data.world.institution` (`{name, timezone, sign_in_host, support}`), `a.view.data.world.enrollments`, `a.view.data.comms.announcements`. None is in `PAGE_DATA_BANS` (`tools/check_vocab.mjs:165`); same precedent as SPINE A2.
- **Missing fixtures.** There is no record for invitations, tool catalog, help articles or requests, sessions, saved preferences, search index, or time-zone conversion. Fixtures are frozen, so these become kit requests (step 12).
- **Known blocker outside this segment.** `tools/spine.test.mjs:29-33` asserts every non-spine page is a placeholder. It fails as soon as any seg1 page is real, and every Phase 3 segment hits it. The file is shared, so the coordinator must relax it (see section 6).
- **Assumptions.**
  - A1 (from SPINE): a count derived from a selector-returned list is selector-derived.
  - A2: `quiz2` resolves through `sel.assessment`. If it returns null, the row shows only its kind label.
  - A3: UI copy constants (field limits such as 80 characters, reminder options, help topic names) are not "figures"; keep them as named constants.

### 3. Changes

**Rules for every page file**

- Strict IIFE on `globalThis.WB`; `WB.definePage("<ID>", {states, na: P.na(STATES, own), variants, render})`.
- At most 300 lines and about 7 KB per file; functions under 50 lines.
- No `style=`, no `console.*`, no typed dates, percentages, scores, or person, course or receipt ids.
- Every id is built with `P.id(a, …)`.
- Navigation is a link (`K.link`, or a destination in an action list); actions are `K.button`.
- Disabled controls use `K.button({disabled: true, reason, id})`.
- Preview-only buttons carry a `note`.
- Authority branches run before state branches; blocking states win over variants.
- No string literal may equal a kit status or flag label; `check_vocab` enforces this.
- Layout: `K.rail` or `K.grid` on regular width (they collapse on compact), `K.stack` otherwise. Dialogs adapt through `K.dialog(a.ctx, …)`.

### Step 1. `pages/seg1-access/W01.js`: Institution sign-in

- **Roles and mode:** guest; `mode: "access"`; `links: [{label: "Sign-in help", go: "W12"}]`.
- **States:** `loading`, `filteredEmpty`, `saving`, `saveFailed`, `offline`, `permissionUnavailable`. **Variant:** `leaving` ("Leaving Whiteboard dialog open").
- **N/A reasons (own):**
  - `firstUseEmpty`: sign-in always shows the institution search.
  - `invalid`: typed text alone is never accepted; the no-match view covers it.
  - `sessionExpired`: expired sessions are drawn on Auth return and System states.
  - `success`: this page only hands off; the outcome is drawn on Auth return.
- **Figures:** institution name, sign-in host and support address from `a.view.data.world.institution`. The return destination is the title of `WB.manifest.pagesById.W05`.
- **Default view:**
  - `K.field` text "Find your institution" (preview).
  - `K.kv`: selected institution, "You will sign in at" (host), "Then return to" (W05 title).
  - `K.field` checkbox "Remember this institution (never your credentials)".
  - `K.button` "Continue to institution" (`act: "open-dialog"`).
  - Preview-only `K.button` "Choose another institution".
  - The line "Whiteboard never asks for your password. Simulated redirect: this prototype contacts no sign-in service."
- **Dialog `P.id(a, "leave")`:** `K.kv` of institution, host, recovery owner (support address) and return destination. One primary destination `go: "W02"`, labelled "Continue to institution". `open` when the variant is `leaving`.
- **State views:**
  - `loading`: `<p role="status">` "Searching institutions…"; no account hints.
  - `filteredEmpty`: no match; explain name and domain search. Continue is disabled ("Choose an institution from the results first"); no opener or dialog. Link W12.
  - `saving`: Continue disabled ("Already contacting <host>").
  - `saveFailed`: error notice "The sign-in service could not be reached. You are not signed in", checked at `P.when(a, a.view.clock)`, with the return destination. Links "Try again" (`W01`) and W12.
  - `offline`: warning; Continue disabled ("You're offline. Sign-in needs a connection").
  - `permissionUnavailable`: notice "That account belongs to a different institution". No course or person detail. Link "Choose the correct institution" (`W01`).
- **Blocking:** `filteredEmpty`, `saving`, `saveFailed`, `offline` and `permissionUnavailable` draw no opener and no dialog, even with `leaving`.
- **Never:** a password field, or `data-nav`.

### Step 2. `pages/seg1-access/W02.js`: Auth return/recovery

- **Roles and mode:** all four; `mode: "access"` for every role (authenticated nav is never drawn during verification); `links` to W12.
- **States:** `loading`, `offline`, `permissionUnavailable`, `sessionExpired`. **Variant:** `destination-gone`.
- **Figures:** institution name; `sel.person(view, who.personId).name`; `WB.ROLE_LABELS[a.role]`; `sel.course(view, who.courseId).code`.
- **Authority:** a guest (`who.personId === null`) never gets account facts. The guest default is "Sign-in was not completed. Nothing was submitted", with "Retry sign-in" → `W01`.
- **Default view (signed-in):**
  - Success-tone notice "Signed in to <institution>".
  - `K.kv`: account name, institution, course role (read-only), return destination.
  - Links: "Continue to Home" → `W05`, "Finish setup" → `W04`, "Review your invitation" → `W03`.
  - "Use another account" opens dialog `P.id(a, "switch")` ("Switch signed-in account"); its primary destination is "Restart sign-in" → `W01`.
- **State views:**
  - `loading`: "Verifying your sign-in with <institution>…"; Continue is a disabled `K.button` ("Verification is still running"); no account facts.
  - `sessionExpired`: "This sign-in link has expired or was already used"; no token text; link `W01`.
  - `permissionUnavailable`:
    - guest: "That account belongs to a different institution".
    - signed-in: "You are signed in, but this account has no course access here", with the account name and institution only (no course records).
    - both: links `W01` and `W12`.
  - `offline`: warning "Can't verify while offline. Nothing changed"; link `W02`.
- **Variant `destination-gone`:** sign-in confirmed; "The page you asked for is no longer available"; one link `W05`.
- **Never:** a `go` to any course page from the guest or failure views.

### Step 3. `pages/seg1-access/W03.js`: Invitation

- **Roles and mode:** all four; guest in `mode: "access"`; signed-in roles in app mode with `navActive: null`.
- **States:** `loading`, `permissionUnavailable`. **Variant:** `wrong-account`.
- **N/A reasons (own):**
  - `saveFailed` and `success`: no pending invitation exists in the fixtures, so no acceptance can be drawn (kit request).
  - `offline`: nothing is sent; the invitation here is already accepted.
- **Record truth (decision):** no invitation record exists, and each persona's enrollment already grants the role. The default signed-in view is therefore the truthful "already accepted" view.
- **Default view (signed-in):**
  - `K.kv`: institution, course (`code`, `title`, `term`), role label, and for a TA the grading access end (`sel.accessEnd`, omitted when null).
  - Text "This invitation was accepted. Your access is active".
  - Accept is a disabled `K.button` ("This invitation was already accepted and cannot be accepted twice").
  - Links: "Open course" → `W14`, "Continue setup" → `W04`.
  - No inviter name, expiry date or reference (not in the fixtures).
- **Authority:**
  - `P.taEnded(a)`: draw `P.taEndedNotice(a)` and the Home link only; no Accept, no `W14` or `W48` link.
  - TA: add the line "Accepting grants your allocated grading scope only, never policy or release".
  - Guest default: institution only, "The recipient is hidden until you sign in"; link "Sign in to review" → `W01`; no course, role or person.
- **State views:**
  - `permissionUnavailable`: "This invitation has expired or was withdrawn. It cannot grant access".
    - Preview-only `K.button` "Request a replacement", with the note "Preview only: a request is not an approval and nothing is sent".
    - Guest: "Sign in to review" is a disabled `K.button` ("This invitation is no longer valid").
    - Signed-in: no `W14` link.
  - `loading`: `P.loading(a, "the invitation")`.
- **Variant `wrong-account`** (signed-in only; the guest draws its default view):
  - "This invitation is for a different account. You are signed in as <name>".
  - Recipient hidden; no course facts.
  - Accept disabled ("Signed in with a different account").
  - Link "Use another account" → `W01`.

### Step 4. `pages/seg1-access/W04.js`: Onboarding

- **Roles and mode:** student, instructor, ta; app mode, `navActive: null`.
- **States:** `loading`, `firstUseEmpty`, `invalid`, `saving`, `saveFailed`, `offline`. **Variants:** `preferences`, `first-task`, `skip` (dialog open on step 1).
- **Header:** `K.trail` with three steps (Confirm details, Preferences, First task); the current step follows the variant.
- **Step 1 (default):**
  - `K.kv` headed "Managed by <institution>": name, email (`sel.person`), role label, course code and title. Read-only text, never inputs.
  - `K.field` "Preferred name".
  - Link "Continue" → `W04:preferences`.
  - Link "Something is wrong with these details" → `W12`.
- **Step 2 (`preferences`):**
  - `K.field` select "Time zone", with the single option from `institution.timezone`.
  - `K.field` select "Landing course": options are the course codes from the viewer's own `world.enrollments` row, never another person's.
  - `K.field` checkbox "Optional email delivery", unchecked.
  - Students only, when `sel.nextDue` is non-null: "Next deadline in this zone: " + `P.when(a, due)`.
  - Preview-only "Save preferences".
  - Links: Back → `W04`, Continue → `W04:first-task`.
- **Step 3 (`first-task`):** one role link: student "Open your course" → `W14`; instructor "Open the course builder" → `W35`; TA "Open your grading queue" → `W48`. Plus "Open Home" → `W05`.
- **Skip:** on every step, `K.button` "Skip for now" opens dialog `P.id(a, "skip")`. The body says which steps remain and that Account holds the return path. Its primary destination is "Open Home" → `W05`.
- **Authority:**
  - TA: never a link to `W53`.
  - `P.taEnded(a)`: the first-task step draws `P.taEndedNotice(a)` and no `W48` link.
  - Roles are text only; no control changes a role.
- **State views:**
  - `firstUseEmpty`: "No course is assigned to this account yet"; no course rows; link `W05`.
  - `invalid`: preferred-name `error` "Use 80 characters or fewer" (`MAX_NAME` constant).
  - `saving`: `K.saveStatus("saving")`.
  - `saveFailed`: `K.saveStatus("failed")`, the notice "Preferences were not saved. Your choices are kept here", and preview-only "Retry".
  - `offline`: `P.offlineNotice(a)`; Save disabled ("You're offline. Nothing has been saved").

### Step 5. `pages/seg1-access/W08.js`: Activity and notification settings

- **Roles and mode:** student, instructor, ta; app mode, `navActive: "activity"`.
- **States:** `loading`, `firstUseEmpty`, `filteredEmpty`, `saveFailed`, `offline`, `deviceDenied`. **Variant:** `settings` (dialog open).
- **List:** `K.list` of `sel.activityFor(a.view, a.who.personId)`. Each row:
  - Title: a kind label from a constant map, plus the record title. Labels: `feedbackReleased` "Feedback available", `announcementPublished` "New announcement", `announcementUpdated` "Announcement updated", `discussionReply` "New reply", `workReceived` "Work arrived for grading".
  - Record title by `ref.type`:
    - `assessment`: `sel.assessment(...).title`.
    - `announcement`: the latest revision title from `a.view.data.comms.announcements`, only when the announcement is `published` and in `who.courseId`.
    - `discussion`: the title from `sel.visibleTopics(...)`, else none.
    - `receipt`: the assessment title of `sel.gradingTaskFor(view, who.personId)`.
  - Meta: `P.when(a, item.at)`, plus the written word "Unread" when `sel.unreadAnnouncements` lists the announcement.
  - `go`: the fixture `item.go`, unchanged.
- **Empty list:** `K.empty` "No activity yet", naming the covered event types. The instructor persona has no items and gets this view.
- **Filters:** `K.field` selects for course (own enrollment codes) and type, and an "Unread only" checkbox, all preview-only. Preview-only "Mark all as read".
- **Settings:** `K.button` "Delivery settings" opens `K.dialog` (`kind: "form"`, id `P.id(a, "settings")`):
  - Checkboxes "Email delivery" and "Browser delivery", both unchecked.
  - Select "Class reminder" with options None, At start, 10 minutes before, 30 minutes before (constants).
  - The line "In-app activity stays on whatever you choose".
  - Preview-only "Save delivery settings".
- **Authority:**
  - No score, mark or grading progress in any row, for any role.
  - `P.taEnded(a)`: drop `workReceived` rows and draw `P.taEndedNotice(a)` above the list; no `W48` link.
  - Never a `W53` link.
- **State views:**
  - `loading`: rows kept, plus `<p role="status">` "Loading older activity…".
  - `firstUseEmpty`: the empty view.
  - `filteredEmpty`: "No activity matches these filters" and "Clear filters" → `W08`.
  - `saveFailed`: error notice in the dialog, "Delivery settings were not saved. Your earlier settings still apply". The word "saved" never appears as a success.
  - `deviceDenied`: "Browser notifications are blocked in this browser. Your preference is kept; in-app activity is unaffected". "Enable browser delivery" is disabled with a reason.
  - `offline`: `P.offlineNotice(a)`, `K.flag("lastKnown")`, then the list.
- **Journey note (decision):** Activity opens the canonical item, so the J09 step links to `W31` (fixture `go`), not `W30`. `W30` is reached from `W31`, which belongs to seg4.

### Step 6. `pages/seg1-access/W09.js`: Global academic search

- **Roles and mode:** student, instructor, ta; app mode, `navActive: "search"`.
- **States:** `loading`, `filteredEmpty`, `invalid`, `conflict`, `offline`. **Variants:** `results` (sample query "projectile"), `group-only` (sample query "orbit"). Both queries live in one constant map.
- **N/A (own):** `firstUseEmpty`: the default view is the no-query guidance.
- **Index:** built per render from scoped sources only, then filtered by a case-insensitive substring match on title or body:
  - `P.assessments(a)` (published, viewer's course): link `P.recordGo("W19", "assessment", id) || P.recordGo("W25", "assessment", id)`.
  - Published announcements in `who.courseId` (latest revision): link `P.recordGo("W29", "announcement", id)`.
  - `sel.visibleTopics(view, courseId, personId)`: link `P.recordGo("W31", "discussion", id)`.
  - A null `recordGo` gives a plain-text row.
  - Each row carries a type label and the course code. No snippet, count or suggestion comes from outside this index.
- **Default view:**
  - `K.field` text "Search", with `value` set to the variant's query.
  - Filter selects (type, course) and an "Include archived terms" checkbox, preview-only.
  - Preview-only "Search".
  - Guidance: "Search covers material you can open".
  - "Clear recent searches" is disabled ("No recent searches are stored").
- **Results variants:**
  - `<p role="status">` with the result count (`results.length`).
  - `K.list` grouped by type under `K.section`s.
  - Zero matches (for example staff on `group-only`) draw the no-results view with no hidden-count hint.
- **Authority:**
  - Staff never see group-only topics (`visibleTopics` enforces it).
  - Unpublished assessments never appear.
  - No `W33`, `W34` or `W53` links.
  - No scores.
- **State views:**
  - `loading`: query kept; "Searching…".
  - `filteredEmpty`: "No results you can open match"; link "Clear filters" → `W09:results`.
  - `invalid`: field error "Enter at least 2 characters"; Search disabled with the same reason.
  - `offline`: "Search could not run. Your query is kept"; link "Retry" → `W09:results`. Never an empty-result claim.
  - `conflict`: results with one extra plain row, "A result can no longer be opened because access changed", with no title.

### Step 7. `pages/seg1-access/W10.js`: Profile/account/preferences

- **Roles and mode:** student, instructor, ta; app mode, `navActive: "account"`.
- **States:** `loading`, `invalid`, `saving`, `saveFailed`, `offline`, `sessionExpired`. **Variant:** `sign-out` (dialog open).
- **Layout:** `K.rail` with the profile as main and "Security" as the rail.
- **Managed identity:** `K.kv` headed "Managed by <institution>": name, email, institution, role label, course code and title. For a TA, add "Grading access ends" or "Grading access ended" with `P.when(a, sel.accessEnd(...))`, chosen by `P.taEnded(a)`. Link "Ask for a correction" → `W12`.
- **Preferences:**
  - `K.field` "Preferred name" and "Pronouns (optional)".
  - Select "Time zone" (`institution.timezone`).
  - Selects Theme (System, Light, Dark), Text size (Normal, Larger) and Motion (System, Reduce).
  - "Save preferences" disabled ("No changes to save").
  - Preview-only "Change photo".
  - Link "Notification settings" → `W08:settings`.
- **Security:**
  - "This session" (no time, because there is no session fixture).
  - "End another session" disabled ("No other sessions are listed").
  - The line "Passwords are managed by <institution>".
  - `K.button` (`kind: "danger"`) "Sign out" opens dialog `P.id(a, "signout")`. Body: "Work that has not been handed in stays unsent". Primary destination "Sign out" → `W01`.
- **Authority:** only the viewer's own facts; no other person, no session facts for anyone else, no role control.
- **State views:**
  - `loading`: `P.loading(a, "your account")`.
  - `invalid`: preferred-name error (same 80-character constant); Save disabled.
  - `saving`: `K.saveStatus("saving")`.
  - `saveFailed`: `K.saveStatus("failed")` and "Preferences were not saved"; no success toast.
  - `offline`: `P.offlineNotice(a)`; Save and Sign out disabled with reasons; no dialog.
  - `sessionExpired`: no identity facts at all; the notice "Your session ended. Nothing new was submitted"; link "Sign in again" → `W01`.

### Step 8. `pages/seg1-access/W11.js`: Academic tools directory

- **Roles and mode:** student, instructor, ta; app mode, `navActive: "tools"`.
- **States:** `loading`, `firstUseEmpty`, `filteredEmpty`, `offline`. No variants.
- **Record truth (decision):** no tool catalog fixture exists. The page invents no tool, provider, host, license or date.
- **Default view:**
  - Controls: `K.field` "Search tools" and a status select (Available, Eligibility unknown, Unavailable), preview-only.
  - One `K.card` titled "Sample entry: no tool is listed yet", with `K.kv`:
    - Provider: "Not listed".
    - Eligibility: "Unknown: no verified entitlement record".
    - Help owner: `institution.support` as a `mailto:` link.
  - "Continue to provider" is a disabled `K.button` ("No verified destination").
  - Links: "Get tool help" → `W12`, "Course policy" → `W15`.
  - The line "A listing never promises a free license; course policy overrides a listing".
  - `a.view.data.world.notice` as the fixture notice.
- **State views:**
  - `loading`: `P.loading(a, "the tools directory")`.
  - `firstUseEmpty`: `K.empty` "No tools are listed for <institution>", with action `W12`.
  - `filteredEmpty`: "No tools match these filters" and "Clear filters" → `W11`.
  - `offline`: warning "The catalog could not be refreshed. Eligibility is not confirmed", `K.flag("lastKnown")`, the card, and a working help link. No date.
- **Authority:** the same view for all three roles. Never the words "free", "activate" or "connected" as a claim.

### Step 9. `pages/seg1-access/W12.js`: Help/technical request

- **Roles and mode:** all four; guest in `mode: "access"` with `links` to `W01`; others in app mode, `navActive: "help"`.
- **States:** `invalid`, `saving`, `saveFailed`, `offline`. **Variant:** `review` (dialog open).
- **N/A reasons (own):**
  - `loading`: help text is static.
  - `success`: no request record exists in the fixtures, so no reference can be shown (kit request).
- **Default view** (`K.rail`: help as main, the request form as rail):
  - `K.list` of task topics (constants: Signing in, Uploading work, Quizzes, Tools), plain text.
  - "Service status: sample only; not connected to a live service".
  - Support contact: `institution.support` as a `mailto:` link.
  - Form:
    - `K.field` select "Where did it happen" (Sign-in, Assignment upload, Quiz, Tool, Other).
    - `K.field` textarea "What happened", with help text "Leave out answers, grades and private details".
    - `K.choiceGroup` checkbox "Diagnostics to include" (Page, Time, Browser version), all unchecked.
    - Preview-only "Attach a screenshot".
  - `K.button` "Review request" opens dialog `P.id(a, "review")` (`kind: "form"`):
    - `K.kv`: recipient (`institution.support`); "Diagnostics: none selected".
    - The line "Sending a request does not submit coursework or extend a deadline".
    - A preview-only `K.button` "Submit request" with id `P.id(a, "review-send")` and the note "Preview only: nothing is sent and no reference is created".
  - Signed-in roles: link "Return to Home" → `W05`.
- **Authority:**
  - Guest: no course, person or work facts; the select offers "Sign-in" and "Other" only; no `W05` link.
  - No reference, case number or acknowledged time in any view.
- **State views:**
  - `invalid`: textarea error "Describe the problem in at least 20 characters"; Review disabled; no dialog.
  - `saving`: info notice "Sending. Not acknowledged yet".
  - `saveFailed`: warning "We can't tell whether your request arrived. Check before retrying. Your draft is kept"; preview-only "Check request status".
  - `offline`: warning "Draft only. Not sent"; Review disabled ("You're offline. Nothing has been sent"); no dialog, even with `review`.

### Step 10. `pages/seg1-access/W13.js`: System states

- **Roles:** all four.
- **States:** `permissionUnavailable` (403), `sessionExpired`. **Variants:** `maintenance`, `retry-failed`. The default view is the 404 (the spec default).
- **Mode:** `access` for a guest, for `sessionExpired` and for both maintenance variants; app mode with `navActive: null` otherwise.
- **Views** (one notice plus recovery links; no record name, course or person in any of them):
  - Default (404): "Page not found"; links `W05` (signed-in) or `W01` (guest), and `W12`.
  - `permissionUnavailable`:
    - Default: "This page is not available to this account"; links `W05` and `W12`.
    - TA with `P.taEnded(a)`: `P.taEndedNotice(a)` and the line "Access cannot be restored by switching role".
    - Guest: "Sign in to continue" → `W01`.
  - `sessionExpired`: "Your session has expired. Nothing new was submitted". A `K.button` opens dialog `P.id(a, "leave")` ("Leave unsent work"); its primary destination is "Continue to sign-in" → `W01`.
  - `maintenance`: "Whiteboard is unavailable right now. No end time is known". Preview-only "Retry"; link `W12`. No `W05` or `W01`.
  - `retry-failed`: the same, plus "Still unavailable. Try again later"; no spinner.
- **Title:** changes per view (`<h1>`).

### Step 11. `tools/seg1-access.test.mjs` (one file, at most 800 lines)

Import from `./spine_helpers.mjs`, as `spine.test.mjs:6-9` does. Every expected value comes from `S`/`WB`, never typed. `const SEG = ["W01","W02","W03","W04","W08","W09","W10","W11","W12","W13"]`.

1. **Structure.**
   - Each SEG page has `placeholder === false`.
   - Every N/A reason is 1 to 140 characters.
   - Required states are drawn: W01, W02 and W03 include `permissionUnavailable`.
   - Every `page.platforms` value is `full`, and no render contains `wb-handoff`.
2. **Render matrix.**
   - SEG × `tokensOf` × `CTX5` × `rolesOf` at `default`.
   - SEG default view × `SCENARIOS` × `CTX3` × roles.
   - Each render: `problems` empty, no "Not built yet", not blocked, every id in `<main>` starts with `t-`. Copy the `checkOne` pattern from `spine.test.mjs:14-26`.
3. **Access mode.**
   - W01, W02, guest W03, guest W12, guest W13 and W13 `sessionExpired` carry `data-mode="access"` and no `data-nav`.
   - W04 and W08–W11 carry `data-mode="app"`.
   - No SEG render contains `type="password"`.
4. **Journeys.**
   - J01 on `CTX3`: `goPages` of each step includes the next page (W01→W02, W02→W03, W03→W04, W04→W05).
   - J09 and J10 W08 steps are real. For the student, `goLinks` equals the fixture `go` values of `S.activityFor`, and includes `W31`.
5. **Dialogs.**
   - Opened by variant: `W01:leaving`, `W04:skip`, `W08:settings`, `W10:sign-out`, `W12:review` each give `openDialogs` equal to the expected `t-c-…` id.
   - Opened by state: W13 `sessionExpired` has exactly one opener, and `dialogOf(html, "t-c-leave")` links to `W01`.
   - Destinations: `dialogOf` contains exactly one destination to W02, W05 and W01 for `W01:leaving`, `W04:skip` and `W10:sign-out` respectively.
   - Blocking wins, via `direct()`: W01 `offline` + `leaving`, W12 `offline` + `review` and W10 `offline` + `sign-out` give `openDialogs` `[]` and no `data-act="open-dialog"`.
6. **Guest authority.** For every person name and email in `view().data.world.people` and every course code: absent from every guest render of W01, W02, W03, W12 and W13, for all tokens.
7. **Student authority.**
   - No SEG student render in any scenario contains `P.score(o.score, o.max)`, where `o` is the instructor's `S.resultFor(view, aisha, "ps4", instructorWho).staffOutcome`. Skip when it is null.
   - W08 rows contain no `" / "` score pattern.
8. **TA authority.**
   - No SEG TA render links to `W53`.
   - At `ta_expired`, W04 `first-task`, W08 and W03 have no `W48` or `W14` link and contain `when(S.accessEnd(...))`.
   - At `default`, W04 `first-task` links to `W48`.
9. **Staff authority.**
   - `W09:group-only` for instructor and TA contains no group-only topic title (titles come from `view().data.comms.discussions` with `audience === "group"`) and no `W33` or `W34` link.
   - The student render contains that title.
   - With a `direct()` data copy where `ps4.published = false`, the PS4 title is absent from every W09 view.
10. **Request ≠ approval ≠ confirmation.**
    - W03 Accept is `aria-disabled` in every signed-in view.
    - `W12:review` has a "Submit request" button with a `data-note` and no reference.
    - No W12 render in any state matches `/AH-[A-Z0-9-]+/`.
    - W11 has a disabled "Continue to provider".
11. **Offline ≠ synced.** `offline` and `saveFailed` renders of W04, W08, W10 and W12 never contain the `K.saveStatus("saved")` output (compute it through `WB.K`) and do contain the disabled reason or failure notice.
12. **Selector truth.**
    - W01 contains `institution.sign_in_host`.
    - W10 and W04 contain the viewer's `S.person(...).email` for each role.
    - The `W09:results` count for the student equals the number of result rows.
    - The instructor's W08 shows the empty view.

### Step 12. Notes and requests

- **Create `pages/seg1-access/NOTES.md`.** Record the drawn states and variants table, and the decisions above, each marked "chosen by Claude under owner delegation":
  - W03 is drawn as already accepted.
  - W11 uses a sample entry with unknown eligibility.
  - W12 creates no reference.
  - W08 links to W31, not W30.
  - W02 uses access mode for all roles.
  - The W13 mode rule.
  - Assumptions A1–A3.
- **Append `## seg1-access` to `kit_requests.md`.** Each entry: page, missing, why, proposed, workaround.
  1. Invitation fixture and `sel.invitationFor(view, who)` (masked recipient, inviter, expiry, reference, status), a pre-acceptance scenario, and a sample for `invite-expired`. Affects W03.
  2. Sample records for `wrong-institution`. Affects W01 and W02.
  3. Tool catalog fixture and `sel.toolsFor(view, who)` (eligibility, owner, expiry, last verified). Affects W11.
  4. Help request fixture (reference, acknowledged time) and a scenario for the W12 `success` state.
  5. Session summaries and saved preferences for W10 and W04.
  6. `sel.fmtInZone` for the two-zone deadline preview on W04.
  7. `sel.announcement(view, id, who)` and `sel.coursesFor(view, who)`, to replace the direct reads of `comms.announcements` and `world.enrollments`.
  8. An activity item for the PS4 release at `ps4_released`. Affects W08.
  9. `K.field` type `search`/combobox, plus the existing file-picker request 1, for W01, W09, W10 and W12.
  10. Coordinator: relax `tools/spine.test.mjs:29-33`, and add `import("./seg1-access.test.mjs")` to `tools/index.js`.

### 4. Acceptance criteria

- Ten files exist at `pages/seg1-access/<ID>.js`, each at most 800 lines, with about 75 KB or less of source in total.
- No other file under `pages/`, `kit/`, `fixtures/`, `manifest/`, `system/`, `spec/`, `tracker/` or `viewer/` changes; nor do `decisions.md`, `NOTES.md` (repo root) or `inputs.lock.json`.
- Each page defines all 16 states across `states` and `na`. W01, W02 and W03 draw `permissionUnavailable`.
- No SEG render contains `wb-handoff`, "Not built yet", `undefined`, `style=`, or a password field.
- Guest renders show no person, email or course. Access-mode frames have no `data-nav`.
- No student view shows an unreleased score. No TA view links to W53. After TA access ends there is no W48 or W14 link from W03, W04 or W08, and the end date comes from `sel.accessEnd`.
- Staff search never shows a group-only topic or an unpublished assessment.
- W03 never offers an enabled Accept. W12 never shows a reference. W11 never names a tool or provider.
- Dialog-opening variants open exactly one dialog. Blocking states suppress the opener and the dialog.
- J01 steps link forward as far as W05. W08 row links equal the fixture `go` values.
- `seg1-access.test.mjs` passes. `check_render`, `check_vocab`, `check_lines`, the build and the size checks pass, with the spec at or under 1,012,975 B and the app and board at or under 921,600 B each.
- Nothing is committed. `design/build.mjs` and `design/tools/check_batch.mjs` are never run.

### 5. Proof commands (from the repo root)

```bash
node --test design/final/tools/seg1-access.test.mjs 2>&1 | tail -n 20
bash -c 'node design/final/tools/check_render.mjs && node design/final/tools/check_vocab.mjs && node design/final/tools/check_lines.mjs' | tail -n 20
bash -c 'node design/final/build.mjs && node design/final/tools/check_size.mjs && node design/final/tools/check_offline.mjs' | tail -n 20
bash design/final/tools/legacy_check.sh | tail -n 20
# After the coordinator relaxes spine.test.mjs:29-33 and adds the index import:
bash -o pipefail -c 'node --test design/final/tools/*.test.mjs 2>&1 | tail -n 20'
node design/final/tools/check_all.mjs | tail -n 20
```

Until the coordinator makes those two edits, the last two commands fail on exactly one test: "structure: the 12 spine pages are real, the other 51 stay placeholders". Any other failure belongs to this segment.

### 6. Out of scope / risks

- **Decision for the coordinator: `tools/spine.test.mjs:29-33`.** It must be relaxed, for example to assert only that spine pages are not placeholders. I recommend the coordinator does this once, because six parallel builders editing a shared file would conflict. The builder must not edit it without that go-ahead.
- **Out of scope.** W05, W06 and W07 (segment 2); tracker rows (existing kit request 6); `tools/index.js`; any fixture, kit or manifest change; browser, device or accessibility acceptance (these are source checks only).
- **Design gaps drawn as workarounds.** These need the step 12 kit requests before the pages match the spec in full:
  - W03 acceptance flow.
  - W11 tool cards and detail.
  - W12 received receipt.
  - W10 sessions.
  - W04 two-zone preview.
  - W01 combobox.
- **Vocabulary risk.** Kind labels and copy must not equal a `WB.STATUS` or `WB.FLAGS` label exactly; run `check_vocab` after each page.
- **Size risk.** The app and board share headroom with five other segments; keep copy short and do not repeat long strings across pages.
- **Assumption risk.** If `sel.assessment(view, "quiz2")` is null (A2), the W08 row degrades to its kind label. Test 4 compares `go` values only, so it still passes.
---

## Segment: Plan: Phase 3 segment `seg2-course` (W05, W06, W07, W15, W16, W17, W32)

### 1. Goal

Replace the seven placeholder pages of `seg2-course` with real page files for web, iPad and iPhone, plus one segment test file, segment notes and kit requests. W14 and W18 and every frozen folder stay untouched.

### 2. Context (verified)

All paths are under `/Users/wasifkarim/Claude/Projects/Whiteboard/design/final/`.

**Contract and layout**
- `pages/PAGES.md` and `pages/SPINE.md` are the contract. All seven pages are course-level, home scenario `default`, with no anchor variants (`manifest/anchors.js:18-48` has no entry for them, so `sel.anchorFor("<ID>")` is null).
- `manifest/pages.js:25-27,35-37,52`: all seven allow `student`, `instructor`, `ta` and are tier `full` on web, iPad and iPhone. `K.handoff` must never be called (it throws on full). Platform differences come only from `a.sizeClass` and the adaptive kit (`K.rail`, `K.grid`, `K.table`, `K.dialog`).
- `tools/load_site.mjs:15,56`: only `<ID>.js` is allowed in `pages/seg2-course/`; `.md` files are ignored. No helper `.js` can be added, and `WB.P` is frozen.
- The 16 state ids are the keys of `NA` in `pages/shared.js:18-35`.

**Required failure states** (`fixtures/scenarios.js:136-150`)
- W05: `permissionUnavailable` (ta-expired).
- W07: `offline` (source-delayed) and `deviceDenied` (calendar-permission-denied).
- W32: `offline` (source-delayed).
- W16, W17: `notYetAvailable` (module-locked).
- `fixtures/samples.js:15-28` has no sample for these four failure ids, so `sel.failureSample` returns null. These states are drawn from real records, with no typed figure.

**Journeys** (`manifest/journeys.js:33-48`)
- J01: W05 is the last step.
- J02 (student, `assignment_submission`): W06 → W14 → W16 → W17 → W18.
- J08 (ta, default): W05 → W07 → W48.
- J10 (student, default): W32 → W07 → W08.
- J12 (instructor, default): W06 → W59.

**Selectors (signatures checked)**
- World (`fixtures/world.js`): `course(view, courseId)`, `person(view, personId)`, `enrolled(view, courseId, role)`, `verifiedRole(view, who, courseId)`, `courseShell(view, who, {page}|{section})`, `parseIso`, `addMinutes(iso, n)`, `isBefore(a, b)`, `fmtDate`, `fmtShortDate`, `fmtTime`, `fmtDateTime`, `zoneAbbr`.
- Coursework (`fixtures/coursework.js`): `assessment(view, id)`, `submissionFor(view, personId, id)`, `courseworkCounts(view, courseId, personId)`, `currentModule(view, courseId)`, `nextDue(view, courseId, who)` (student only, else null).
- Quiz: `quiz(view, quizId)` (fields `opens`, `close`, `ai_policy`).
- Calendar (`fixtures/calendar.js:43`): `eventsFor(view, who, fromIso, toIso)`. It already hides private events from non-owners and staff-task events from students. Event fields: `id, task_id?, course_id, owner_id, name, location, start, end, kind (class|officeHours|personal|gradingTask), visibility, source`.
- Comms: `unreadAnnouncements(view, courseId, personId)` → `[{id, reason}]`.
- Activity: `activityFor(view, personId)` → items `{kind, ref:{type,id}, go, at}`.
- Staff (`fixtures/staff.js`): `gradingTaskFor(view, taId, assessmentId?)`, `taTaskAccess`, `accessEnd(view, personId, courseId)` (null when the TA has no task), `taAccessActive`, `reviewProgress(view, assessmentId, who)`, `receivedProgress(view, assessmentId, who)`.
- Grades: `gradeRows(view, courseId, personId, who)` → rows `{itemId, title, category, max, status, score, …}` or null; `lastReleaseAt(view, courseId, who)`.
- `WB.P` helpers (`pages/shared.js:237-248`): `na, id, shell, assessmentId, assessments, receiptById, recordGo, status, ownSubmission, when, taEnded, taEndedNotice, permissionNotice, loading, offlineNotice, p, links, stack, lateRuleText, learnerId`.

**Gaps found (no selector or record exists)**
- No lesson records and no module completion records. `coursework.modules` holds only `{id, position, title, starts, ends, item_ids}`.
- No grading-policy selector. `.data.grades` is banned for pages (`tools/check_vocab.mjs:165`), so weights, policy version and method are unreachable.
- No selector for a viewer's courses. Pages read `a.view.data.world.enrollments`, `.institution`, `.coursework.modules` and `.comms.announcements` directly; none of these is banned.
- No syllabus document record. No calendar event revision or cancel fields.

**Facts the builder must respect**
- `P.shell` always adds the course tabs. W05, W06 and W07 are global pages and must return `{title, body, navActive}` directly, without `P.shell`.
- `P.taEnded` is true for a TA with no task at all, because `accessEnd` is null. W05 must tell "no allocation" from "ended".
- `P.taEndedNotice` links to W05; W05 must build its own notice so it does not link to itself.
- `check_vocab` fails on a quoted string that exactly equals a kit status or flag label. Flag keys are `locked, closed, extension, lastKnown, readOnly, notOpen, preview` (`kit/core.js:176-184`). Use `K.flag(key)` and `K.status`, and word other text around the labels.
- `tools/spine.test.mjs:29-31` asserts that every non-spine page is a placeholder. It fails as soon as any Phase 3 page exists.

**Assumptions**
- A-1: the one-assertion edit to `tools/spine.test.mjs` in Changes step 1 is allowed, because `tools/` is not in the brief's forbidden list. If the coordinator has already relaxed it, skip the step.
- A-2: reading the non-banned `a.view.data.*` collections above is acceptable, by the same reasoning as SPINE.md assumption A2.

### 3. Changes

Conventions for every page file:
- An IIFE like `pages/seg2-course/W14.js`, with a `STATES` array and `na: P.na(STATES, {...own reasons ≤140 chars})`.
- Ids through `P.id(a, "...")`. Each file targets ≤ 250 lines and about 10 KB (segment budget ≈ 75 KB).
- No `style=`, no `console.*`, no typed dates, percentages, scores or ids.
- Authority branches run before state branches.
- Course pages (W15, W16, W17, W32) share this body order: `permissionUnavailable` → `P.permissionNotice(a, "You are not enrolled in this course")`; `loading` → `P.loading`; `offline` → `P.offlineNotice` + `K.flag("lastKnown")` + content; else content. Staff see `K.flag("preview")`. An ended TA sees the published content plus `P.taEndedNotice(a, P.assessmentId(a))`.

### Step 1. `tools/spine.test.mjs` (one assertion)

Rename the test at line 29 to "structure: the 12 spine pages are real" and replace the loop at line 31 with `for (const id of SPINE) assert.equal(WB.pageFor(id).placeholder, false, id);`. Change nothing else. See assumption A-1.

### Step 2. `pages/seg2-course/W05.js` — Today (Home)

- **Shell:** `{title: "Today", navActive: "today", body}`; no course option.
- **States drawn:** `loading`, `firstUseEmpty`, `offline`, `permissionUnavailable`.
- **N/A reasons (own):**
  - `filteredEmpty`: "Home has no filters".
  - `archived`: "Past terms are drawn on the Courses page".
  - `notYetAvailable`: "Home lists only work that is already published".
- **Header:** `K.contextLine({institution: a.view.data.world.institution.name, course: code, term, role: a.role})` from `sel.course`, plus a "Change course" link to W06.
- **Layout:** `K.rail(ctx, {main: tasks, rail, railLabel: "Coming up"})`; tasks come first when stacked.
- **Student tasks:**
  - Next due from `sel.nextDue(view, courseId, who)`: title from `sel.assessment`, `P.when(due)`, `P.status(a, P.ownSubmission(a, id), true)`. Link is `P.recordGo("W19", …) || P.recordGo("W25", …)`, else plain text. Null gives `K.empty` "Nothing due".
  - Four `K.stat` from `courseworkCounts`.
  - Links to W18 and W14.
- **Instructor tasks:**
  - PS4 title via `P.assessmentId(a)`; `K.stat` "Handed in x of y" from `receivedProgress` and "Reviewed x of y" from `reviewProgress`.
  - Links: "Open teaching course" W35, "Grading queue" W48, "Release feedback" W53.
- **TA tasks** (`task = sel.gradingTaskFor(view, personId)`):
  - No task: `K.empty` "No grading is allocated to you", with no queue link and no instructor links.
  - Active: assessment title, "Grading due" `P.when(task.grading_due)`, "Access ends" `P.when(sel.accessEnd(...))`, `reviewProgress` as "You have reviewed x of y", and a link "Open allocated grading" → `P.recordGo("W48", "assessment", task.assessment_id)`. No W53 or W35 link.
  - Ended (task exists and `P.taEnded(a)`): the page's own `K.notice` with the exact title "Your grading access for this course has ended", the end date and the task title, the line "Marks you saved stay with the instructor", and a link to W12. "Open allocated grading" becomes a disabled `K.button` with the reason "Your grading access has ended". No progress, activity or learner data.
- **Rail (all roles, never a score):**
  - Upcoming events: `sel.eventsFor(view, who, view.clock, sel.addMinutes(view.clock, WEEK_MINUTES))` as a `K.list` of name and `P.when(start)`. An ended TA sees no `gradingTask` rows.
  - Unread announcements: ids from `unreadAnnouncements`; the title is the latest revision title read from `a.view.data.comms.announcements`. Link is `P.recordGo("W29", "announcement", id)`, else plain text. Reason shown as "New" or "Updated".
  - Activity: `sel.activityFor(view, personId)`, fixture `go` used unchanged. Text comes from a kind map plus the ref title; a `receipt` ref resolves through `P.receiptById` to the assessment title only. Not drawn for an ended TA.
  - Student and instructor: `sel.lastReleaseAt` as "Latest feedback released <when>". The student also gets a link to W24.
  - Links: "View calendar" W07 and "View activity" W08.
- **State tokens:**
  - `firstUseEmpty`: tasks replaced by `K.empty` "Nothing needs you today" with a link to W06; the rail is kept.
  - `offline`: `P.offlineNotice` and `K.flag("lastKnown")` above the rail.
  - `permissionUnavailable`: ended TA → the expiry branch; active TA → `P.permissionNotice(a)`; student or instructor → a notice "Your access to this course has changed" with links to W06 and W12. No counts in any of the three.
- **R-truth:** at `ta_expired` the TA default view draws the expiry branch without any token.

### Step 3. `pages/seg2-course/W06.js` — Courses

- **Shell:** `{title: "Courses", navActive: "courses", body}`.
- **States drawn:** `loading`, `firstUseEmpty`, `filteredEmpty`, `offline`, `archived`.
- **N/A (own):** `permissionUnavailable`: "Courses lists only your own memberships; there is nothing to deny".
- **Data:** the viewer's enrollment is the `a.view.data.world.enrollments` row matching `who.personId` and `who.role`; its `course_ids` map through `sel.course`. Current = `!archived`. A guest or missing enrollment gives an empty list.
- **Controls:** `K.tabs` Current → `go: "W06"`, Past → `go: "W06:archived"`. A `K.field` select of terms derived from the viewer's courses and a `K.field` search (preview only). Omit the select on compact.
- **Current view:** `K.grid` (cols 3, compactCols 1) of `K.courseCard(ctx, {key, code, title, meta, go})`.
  - `go = P.recordGo("W14", "course", course.id)`, so only PHYS 110 links; other cards are plain.
  - `meta` is term · section · role label, plus for a student "Next due <title>, <when>" from `sel.nextDue(view, course.id, who)`.
  - One line under the grid: "Other courses are listed but not drawn in this prototype".
  - Ended TA: the PHYS card stays linked and `meta` adds "Grading access ended <P.when(accessEnd)>".
  - Instructor only: link "Copy a course to a new term" → W59.
  - All roles: "Ask about missing access" → W12.
- **`archived` state (Past):** archived courses as cards with `K.flag("readOnly")`, no link, and the text "Materials, your own work and released feedback stay readable". With none (instructor, TA): `K.empty` "No past courses in your history", plus the line "Older terms may be outside the retention period" and a W12 link.
- **Other tokens:**
  - `firstUseEmpty`: `K.empty` "You have no current courses" with a Past link.
  - `filteredEmpty`: controls kept, `K.empty` with a preview-only "Clear filters".
  - `offline`: notice, `K.flag("lastKnown")`, the cards, and a preview-only "Retry"; never an empty-course message.

### Step 4. `pages/seg2-course/W07.js` — Calendar

- **Shell:** `{title: "Calendar", navActive: "calendar", body, dialog?}`.
- **States drawn:** `loading`, `firstUseEmpty`, `filteredEmpty`, `invalid`, `offline`, `deviceDenied`, `destructive`.
- **Variant:** `add-event` ("Add private event dialog open").
- **N/A (own):**
  - `saving` and `saveFailed`: "Private events are preview-only here; no save request is drawn".
  - `conflict`: "A private event has one owner and one editor".
- **Window:** `from` = start of the clock's day (`sel.addMinutes(clock, -(hour*60+minute))` using `sel.parseIso`), `to = sel.addMinutes(from, WINDOW_MINUTES)` (8 days, a named constant). Heading: "Today and the next 7 days", with the zone from `sel.zoneAbbr(view.clock)`.
- **Rows** (one `K.table` with columns When, Event, Where, Type; it becomes row cards on compact):
  - `sel.eventsFor(view, who, from, to)`.
  - Due rows from `P.assessments(a)` whose due time (or `sel.quiz(...).close` for a quiz) falls in the window.
  - Sorted by start with `sel.isBefore`.
  - Type comes from a kind map: Class, Office hours, "Private · only you", Grading deadline, Coursework due.
- **Row links (record-true):**
  - Class and office hours → `W32`.
  - Due row → `P.recordGo("W19"|"W25", "assessment", id)`, else plain.
  - `gradingTask` for a TA: when `sel.gradingTaskFor(view, personId)` has the same id as `ev.task_id`, → `P.recordGo("W48", "assessment", task.assessment_id)`.
  - `gradingTask` for an instructor → `P.recordGo("W57", "task", ev.task_id)`.
  - Personal rows are plain.
- **Ended TA:** drop `gradingTask` rows and add `P.taEndedNotice`.
- **Rail** (stacked under the agenda on compact):
  - `K.segmented` Agenda/Week/Month, regular size only (the agenda is the compact view).
  - "Add private event" as a `K.button` with `act: "open-dialog"` and `target: P.id(a, "event")`.
  - Links: "Reminder settings" W08; instructor "Manage grading deadlines" W57.
  - The line "Course dates are read-only here".
- **Dialog** (`K.dialog(ctx, {id: P.id(a, "event"), kind: "form", …})`, always present):
  - Open for `add-event` and `invalid`.
  - `K.field`s: title, start date, start time, end date, end time (no values), repeat select, reminder select.
  - One action "Save private event", a preview-only button with a `note`.
  - `invalid` adds the error "End must be after start" on the end field.
- **`destructive`:** a second dialog (`kind: "destructive"`, id `P.id(a, "delete")`) drawn open only when the viewer owns a `personal` event in the window. Its body shows the event name and time from the record; its action is a preview-only "Delete this event". Otherwise no dialog and the info notice "You have no private event in this period".
- **`offline`:** the notice "Course dates may be out of date" and `K.flag("lastKnown")`; rows are kept; the line "Changes are not confirmed until you reconnect".
- **`deviceDenied`:** a warning notice "Browser notifications are blocked", body "The calendar still works. Reminders are not delivered", with a link to W08; the agenda is intact.
- **`firstUseEmpty` and `filteredEmpty`:** table `empty` option. The same empty table appears truthfully at clocks with no rows.

### Step 5. `pages/seg2-course/W15.js` — Syllabus and grading

- **Shell:** `P.shell(a, {title: "Syllabus and grading", body}, {page: "W15"})`.
- **States drawn:** `loading`, `firstUseEmpty`, `offline`, `permissionUnavailable`.
- **N/A (own):**
  - `saveFailed`: "No syllabus file exists to fail a download".
  - `archived`: default reason.
- **Main:**
  - `K.courseBanner`.
  - Section "Teaching staff": names from `sel.enrolled(view, courseId, "instructor")` and `sel.person`, each with a `mailto:` `K.link`.
  - Section "Schedule": course modules from `a.view.data.coursework.modules` sorted by `position`, each with title and `fmtShortDate` span, plus a link to W16.
  - Section "Assessment rules":
    - `P.lateRuleText(item)` for each item that has a `late_rule`.
    - Attempts from `max_attempts`.
    - For each quiz, the AI rule from a map on `sel.quiz(...).ai_policy` (`not_permitted` → "AI tools are not permitted during this quiz").
  - Section "Grading categories":
    - Rows from `sel.gradeRows(view, courseId, learner, who)`, where `learner` is `who.personId` for a student and `P.learnerId(a)` for an instructor.
    - Grouped by `category` into a `K.table` with columns Category, Item, Points. Only `title`, `category` and `max` are used; never score, status or `staffOutcome`.
    - Followed by an info notice "Category weights and the policy version are not drawn on this page yet" (kit request).
    - A TA gets no table, only the line "You can read these rules. Changing the grading policy is the instructor's step".
    - Null rows for a student or instructor, or the `firstUseEmpty` token: `K.empty` "No grading policy is published for this course", with the line "A course total is not shown until one is published".
- **Rail:**
  - A disabled `K.button` "Download syllabus" with the reason "No syllabus file is attached to this course".
  - Links: W18 for all; W24 for the student; W52 "Edit grading policy" and W36 "Edit course details" for the instructor only.

### Step 6. `pages/seg2-course/W16.js` — Modules

- **Shell:** `P.shell(a, {title: "Modules", body}, {page: "W16"})`.
- **States drawn:** `loading`, `firstUseEmpty`, `offline`, `notYetAvailable`, `permissionUnavailable`.
- **N/A (own):**
  - `saving`, `saveFailed` and `destructive`: "Manual completion needs records this prototype's data does not have".
  - `filteredEmpty`: "The module filter is not drawn".
- **Each module** (`K.disclosure({id: P.id(a, "m-" + m.id), summary: m.title, body, open: isCurrent})`):
  - *Not open* (`sel.isBefore(view.clock, m.starts)`): `K.flag("notOpen")`, "Opens <P.when(m.starts)>", and no item titles or links.
  - *Open*: the span, then the items (`m.item_ids` → `sel.assessment`), each linked by `P.recordGo("W19"|"W25", …)` or plain. A student also sees `P.status(a, P.ownSubmission(a, id), true)`. With no items: "Nothing is published in this module yet".
  - *Current module only*: a link "Open lesson and materials" → `W17`. This is record-true because W17 draws the current module.
- **Other content:** instructor link "Edit module" → W37; one line "Completion tracking is not drawn in this prototype".
- **`notYetAvailable` token:**
  - Leads with a notice naming the first not-open module and its opening time.
  - When no module is locked at the clock (for example `ps4_released`), the notice reads "Every module is open at this point".
  - The list follows in both cases.
- **`firstUseEmpty`:** `K.empty` "No modules are published yet".

### Step 7. `pages/seg2-course/W17.js` — Lesson and materials

- **Shell:** `P.shell(a, {title, body, crumbs: [{label: course.code, go: "W14"}, {label: "Modules", go: "W16"}]}, {page: "W17"})`. The title is the drawn module's title, else `a.page.title`.
- **States drawn:** `loading`, `firstUseEmpty`, `offline`, `notYetAvailable`, `permissionUnavailable`.
- **N/A (own):**
  - `saving` and `saveFailed`: "Manual completion needs a lesson record this prototype's data does not have".
  - `deviceDenied`: default.
- **Module drawn:** `sel.currentModule(view, courseId)`. Null gives the notice "No module is running at this point" and a W16 link.
- **Content:**
  - The span.
  - An info notice "Lesson text is not in the prototype data yet" (kit request).
  - Section "Files shared in course announcements": attachments of course announcements in `a.view.data.comms.announcements` with state `published` (the view is already projected to the clock). Each row shows the file name, page count, "Accessible version available" when `accessible_version` is true, a link to `P.recordGo("W29", "announcement", ann.id)`, and a preview-only "Download". With none, or on `firstUseEmpty`: `K.empty` "No files are shared yet".
  - Footer "Next": the module's first item via `recordGo`, plus "Coursework" → W18 and "Back to modules" → W16.
  - Instructor link "Edit lesson" → W38.
  - No completion control.
- **`loading`:** title and span kept; only the files section shows `P.loading(a, "files")`.
- **`notYetAvailable`:**
  - Draws the first not-open module instead: title, `K.flag("notOpen")`, "Opens <when>", and the W16 link only. No files and no next-item link.
  - When none is locked, a notice "No module is locked at this point", then the normal content.

### Step 8. `pages/seg2-course/W32.js` — Course calendar

- **Shell:** `P.shell(a, {title: "Course calendar", body}, {section: "calendar"})`.
- **States drawn:** `loading`, `firstUseEmpty`, `filteredEmpty`, `offline`, `permissionUnavailable`.
- **N/A (own):**
  - `invalid`, `saving`, `saveFailed` and `destructive`: "Course-event editing is preview-only; the editor is not drawn".
  - `conflict`: default.
- **Rows:** the same window and table as W07, limited to `ev.course_id === who.courseId` and `ev.kind !== "personal"`, plus the due rows.
  - A student never has `gradingTask` rows.
  - A TA sees their own grading-deadline row linked to W48 as in W07.
  - An instructor's grading-deadline row links to W57.
  - An ended TA has no `gradingTask` rows and gets `P.taEndedNotice`.
  - Class and office-hours rows are plain here. Due rows link by `recordGo`.
  - A Source column comes from a map on `ev.source` (`registrar` → "Registrar timetable", `course` → "Course"; task-derived → "Grading plan").
- **Links and actions:**
  - "View combined calendar" → W07 for all.
  - Instructor and active TA: "Grading deadlines" → W57.
  - Instructor only: a preview-only `K.button` "New course event" with a `note`.
  - TA line: "Course events are published by the instructor".
- **`offline`:** the notice "The registrar timetable may be out of date", with `K.flag("lastKnown")` in the Source cell of `registrar` rows and the line "Nothing here changes the registrar's record".

### Step 9. `tools/seg2-course.test.mjs` (≤ 800 lines)

Import from `./spine_helpers.mjs`. `SEG = ["W05","W06","W07","W15","W16","W17","W32"]`. Every expected value is read from `S`, never typed.

1. **Structure:** each SEG page is not a placeholder; states and `na` cover 16 ids with reasons ≤ 140 characters; the required failure states are in `states`; W14 and W18 keep the states listed in SPINE.md.
2. **Render matrix:** SEG × `tokensOf` × `rolesOf` × `CTX5` at `default`, and the default view × `SCENARIOS` × `CTX3`. `problems` is empty, there is no "Not built yet", no `wb-handoff`, and ids in main start with `t-`.
3. **Authority:**
   - Student W05, W07 and W32 at `default` contain no held PS4 score, comment or staff total (same sources as `spine-authority.test.mjs` T4).
   - W05 TA has no `W53` or `W35` in `goPages`; instructor W05 has `W53`.
   - No staff frame of any SEG page has `W22`, `W33` or `W34` in `goPages` outside the shell.
   - At `ta_expired`, W05 TA shows the notice title and `when(accessEnd)`, no student names (`studentNames()`), and no W48 link (the disabled reason is present). W07 and W32 TA have no `W48` in `goPages`. W16, W17, W15 and W06 still render course content.
   - W05 TA with `grading_tasks` emptied (`direct` with a `copy(WB.data)`): empty-queue text, not the ended notice.
   - Private event: the `private-shift` name appears on student W07 and never on instructor or TA W07 or on any role's W32.
   - W32: "New course event" for the instructor only. W15: W52 and W36 links for the instructor only.
   - W15 for a TA and student shows no `staffOutcome` score; student and instructor see each `gradeRows` title.
4. **State content:**
   - W07 `deviceDenied` keeps the agenda rows. W07 and W32 `offline` carry the kit flag label read from `WB.FLAGS.lastKnown.label`.
   - W16 at `default` shows `when(module4.starts)` and no Module 4 item link. W16 and W17 `notYetAvailable` at `ps4_released` show the "open" notice.
   - W17 at `assignment_submission` has no attachment name; at `default` it has the attachment name and a `W29` link.
   - W07 `add-event` and `invalid` give `openDialogs` of `["t-c-event"]`. W07 `destructive` opens `t-c-delete` for the student and nothing for the instructor.
   - W06 `archived` shows the archived course code for the student and the empty text for the instructor.
5. **Journeys:** each SEG step of J01, J02, J08, J10 and J12 renders cleanly on `CTX3`. Body links (`goPages(mainOf(html))`): W06 → W14 and W16 → W17 → W18 (J02 clock), W05 → W07 → W48 (TA), W32 → W07 → W08 (student), W06 → W59 (instructor). W14 → W16 is checked on the whole frame (course tab).

### Step 10. Notes and requests

- **`pages/seg2-course/NOTES.md`:** drawn states and variants per page, and the decisions above, each marked "chosen by Claude under owner delegation". Decisions to record:
  - Global pages skip the course shell.
  - The W06 Past view is the `archived` state.
  - The 8-day agenda window.
  - W17 draws the current module with announcement files.
  - Weights, completion, lesson text, the event editor and recurring edits are not drawn.
  - Assumptions A-1 and A-2.
- **`kit_requests.md`, appended under `## seg2-course`:**
  1. Lesson fixtures and `sel.lessonsFor(view, moduleId, who)`, plus a W17 anchor.
  2. `sel.gradingPolicy(view, courseId, who)` (weights, version, method, treatments) and a syllabus document record.
  3. Module completion and prerequisite records.
  4. `sel.coursesFor(view, who)` and `sel.modulesFor(view, courseId, who)`.
  5. Failure samples for `source-delayed`, `module-locked`, `ta-expired` and `calendar-permission-denied` (for example a last-checked time).
  6. Calendar event `status` and `revision` (changed or cancelled) and an event editor.
  7. A shared agenda helper in `shared.js`, because W07 and W32 duplicate about 30 lines.
  8. A `P.taEndedNotice` option for its link target.
  9. Coordinator: add `./seg2-course.test.mjs` to `tools/index.js`; tracker rows for the 21 targets.

### 4. Acceptance criteria

- The seven pages render on all 5 contexts, all 3 roles, every drawn state and variant, and every scenario clock, with empty `frameProblems` and no placeholder text. No `wb-handoff` appears.
- Each definition covers all 16 states. The required failure states are drawn: W05 `permissionUnavailable`; W07 `offline` and `deviceDenied`; W32 `offline`; W16 and W17 `notYetAvailable`.
- Every date, count and name in the output comes from a selector or record. The page files contain no `style=`, no `console.`, no banned data access and no quoted kit label.
- Authority: every Step 9 item 3 assertion holds.
- Record-true links: a course, assessment, announcement or task links only where `P.recordGo` returns a token; otherwise plain text. Activity rows use the fixture `go` unchanged.
- The journey links in Step 9 item 5 hold on web, iPad and iPhone.
- Edge cases: a TA with no task, clocks with no events, clocks with no locked module, a null current module and a guest-like null enrollment all render without throwing.
- Must not change: `W14.js`, `W18.js`, `shared.js`, `kit/`, `fixtures/`, `manifest/`, `system/`, `spec/`, `tracker/`, `viewer/`, `decisions.md`, `NOTES.md` at the repo root, `inputs.lock.json`, other segment folders, and `tools/index.js`. The only edit to an existing test is Step 1.
- Each file ≤ 800 lines. The seven page files total ≤ 75 KB. Spec ≤ 1,012,975 B; app and board ≤ 921,600 B each.

### 5. Proof commands

Run from `/Users/wasifkarim/Claude/Projects/Whiteboard`.

```bash
bash -o pipefail -c 'node --test design/final/tools/*.test.mjs 2>&1 | tail -n 15'
node design/final/tools/check_all.mjs
bash design/final/tools/legacy_check.sh
bash -c 'node design/final/build.mjs && node design/final/tools/check_size.mjs && node design/final/tools/check_offline.mjs'
bash -c '! grep -nE "style=|console\.|K\.handoff|P\.handoff" design/final/pages/seg2-course/W{05,06,07,15,16,17,32}.js'
bash -c 'cat design/final/pages/seg2-course/W{05,06,07,15,16,17,32}.js | wc -c | awk "{ exit (\$1 > 76800) }"'
bash -c 'wc -c design/final/dist/*.html'
```

The last command is for reading the spec, app and board byte counts against the caps.

### 6. Out of scope and risks

- **Not drawn (no records):** lesson body and media, manual completion and its reset dialog, prerequisite locks, policy weights and version history, syllabus download, the course-event editor with publish and cancel, recurring-event edits, changed or cancelled occurrences, the context-switch dialog, and week and month grids. Each has a kit request and a visible, truthful line on the page.
- **Step 1 touches a shared test.** Other segment builders need the same one-line change; the edit is idempotent, but concurrent writes could collide. The coordinator should apply it once if possible.
- **W17 is thin** until lesson fixtures exist, and at the J02 clock its file list is empty. The tour step still links on to W18.
- **`tools/index.js` is not edited here,** so `check_all` will not run the new test file until the coordinator adds the import. The first proof command covers it meanwhile.
- **`tools/viewer.test.mjs` and `tools/pages.test.mjs` render the live W05 and W06.** If one of them asserts placeholder text on the live site (not seen in the grep), report it to the coordinator and do not edit those tests.
- **Size.** Seven pages share about 75 KB. If the build nears the app or board cap, trim W07's dialogs first.
- **Not acceptance.** These are source checks only. No browser, keyboard, screen-reader or device check runs. No commit; never run `design/build.mjs` or `design/tools/check_batch.mjs`.
---

## Segment: Plan: seg3-submit quiz pages W25, W26, W27 (web, iPad, iPhone)

### 1. Goal

Replace the W25 (Quiz rules/start), W26 (Quiz attempt) and W27 (Quiz receipt/review) placeholders with real page files in `design/final/pages/seg3-submit/`, plus one test file and segment notes. W19–W24 and all shared files stay untouched.

### 2. Context verified

All paths are under `/Users/wasifkarim/Claude/Projects/Whiteboard/design/final/`.

**Manifest and anchors**
- `manifest/pages.js:45-47`: W25 roles student, instructor, ta; W26 and W27 student only. All three are tier `full` on web, iPad and iPhone, so `K.handoff` is never drawn (it throws on full).
- `manifest/anchors.js:25-27`:
  - W25 → `assessment:quiz3`, home `default`.
  - W26 → `attempt:aisha-quiz3-1`, home `quiz_in_progress`.
  - W27 → `receipt:AH-PHYS110-Q3-001`, home `quiz_received`; variant `quiz2` → `receipt:AH-PHYS110-Q2-001`, home `default`.
- `manifest/journeys.js:38-39,47`: J05 has W25 (default), W26 (`quiz_in_progress`), W27 (`quiz_received`), then W53 (instructor) and W24. J11 has W19 → W25 → W58 (instructor).

**Clocks (`fixtures/scenarios.js:83-93`, `fixtures/world.js:17`)**

| Scenario | Clock | Quiz 3 situation for Aisha |
|---|---|---|
| `default`, `group_work_in_progress` | Oct 20 16:00 | Not open yet (opens Oct 21 08:00, closes Oct 22 23:59) |
| `quiz_in_progress` | Oct 21 10:10 | Active attempt: q1 and q2 acknowledged, q3 unacknowledged, q4 has no answer record |
| `quiz_received` | Oct 21 10:30 | Receipt `AH-PHYS110-Q3-001`, four acknowledged answers |
| `group_submission` | Oct 22 14:30 | Open, no attempt: the only clock where Start is truly eligible |
| `late_quiz_start` | Oct 22 23:55 | Active attempt started 23:50 with no answers |
| `ta_expired` | Oct 26 | Closed, no attempt |
| `ps4_released` | Oct 27 | Closed, receipt exists |

**Selectors (signatures checked)**
- `fixtures/quiz.js:52-108`:
  - `quiz(view, quizId)`
  - `allowanceFor(view, quizId, personId)`
  - `effectiveMinutes(view, quizId, personId)`
  - `effectiveDeadline(view, quizId, personId, startedAt)`
  - `lateStartThreshold(view, quizId, personId)`
  - `availableMinutes(view, quizId, personId, startedAt)`
  - `attemptFor(view, quizId, personId)`
  - `attemptView(view, quizId, personId)` → `{active, secondsLeft, acknowledged, unsent, deadline}` or null
- These quiz selectors take a bare `personId` and are not role-scoped. The pages must enforce scope themselves.
- `fixtures/coursework.js:117-147`: `assessment(view, id)` (quiz items carry `quiz_id`, with `due` and `close` null), `submissionFor(view, personId, assessmentId)`, `receiptsFor(view, assessmentId, who)`.
- `fixtures/grades.js:349,429`: `resultFor(view, personId, itemId, who)` and `releasesFor(view, itemId, who)` (student: own entries, each with `version` and `released_at`).
- `fixtures/world.js:103-113`: `fmtTime`, `fmtDateTime`, `zoneAbbr`, `addMinutes`, `minutesBetween`, `isBefore`, `minIso`.
- `pages/shared.js`: `P.na`, `P.id`, `P.shell`, `P.status`, `P.ownSubmission`, `P.score`, `P.when`, `P.recordGo`, `P.receiptById`, `P.offHome`, `P.taEnded`, `P.taEndedNotice`, `P.permissionNotice`, `P.loading`, `P.offlineNotice`, `P.p`, `P.links`, `P.stack`.
- `PRESENTATION` (`shared.js:13`) maps `confirm`, `reviewed` and `acknowledged` to the default record. Reuse those variant ids so `P.offHome` and `P.recordVariant` keep working.

**Fixture facts that shape the design**
- The 11:29 PM fact: `fmtTime(lateStartThreshold(view, "quiz3", "aisha"))` is "11:29 PM" (`tools/check_fixtures.mjs:174`). It is 11:39 PM for a learner with no allowance. Never type it.
- Quiz 3 has 20 minutes, 2 attempts, `selection: "latest"`, `release_rule: "instructor"`, `ai_policy: "not_permitted"`, version 3. Its items are `{id, kind}` objects; Quiz 2 items are plain strings, so normalise.
- No item has a prompt or options.
- Aisha's allowance is `extra_minutes: 10` and also holds `basis_reference_instructor_only`.
- `quiz3` is not in `grade_items` (`grades.js:35-42`), so `resultFor(…, "quiz3", …)` is null.
- `quiz2` is released: 8 of 10, with a comment, release `rel-quiz2-1`.
- `failures` requires W26 to draw `saving` (`scenarios.js:148`), but `fixtures/samples.js` has no `quiz-save-unacknowledged` record, so `failureSample` returns null for it.

**Kit and tooling**
- Kit (`kit/API.md`): `K.timer({label, remaining, endsAt})`, `K.saveStatus(state, {time?})`, `K.receipt({ref, item, course, acceptedAt, timeZone, attempt?, files?})`, `K.choiceGroup`, `K.field`, `K.dialog`, `K.rail`, `K.kv`, `K.list`, `K.disclosure`, `K.notice`, `K.empty`, `K.section`.
- Flag keys (`kit/core.js:176-184`): `notOpen`, `closed`, `extension`, `lastKnown`, `preview`.
- `tools/load_site.mjs:56` ignores `.md` files in a segment folder. `check_lines` counts `.md` files (800-line cap).
- `tools/check_vocab.mjs:165` bans `.pending`, `grade_drafts`, `.data.(grades|staff|samples)`, `.drafts`, `.releases`, `golden` and `question_ids` in page files. A string literal exactly equal to a kit status or flag label also fails.
- **Blocker:** `tools/spine.test.mjs:29-31` asserts that every non-spine page is a placeholder. It fails as soon as any Phase 3 page lands (see Changes step 6).

**Assumptions**
- A1 from `SPINE.md` applies: a count or format derived from a selector result counts as selector-derived.
- A bare `go: "W26"` keeps the current scenario (`PAGES.md` decision 5).

### 3. Changes

Shared conventions for all three files:
- IIFE on `globalThis.WB`, `var P = WB.P`, small functions, target 300 lines or fewer each.
- No `style=`, no `console.*`, no typed dates, times, scores, ids or names.
- Authority branches run before state branches (rule R-truth).
- `P.shell(a, out, {section: "coursework"})`.
- Quiz lookup: `itemId = a.sel.anchorFor("W25").record.id`, `item = a.sel.assessment(a.view, itemId)`, `quiz = a.sel.quiz(a.view, item.quiz_id)`.
- Minutes text is `String(n) + " minutes"`.
- Rule-text maps keyed by fixture value, with an unknown key dropping the row:
  - `selection.latest` → "Your latest attempt counts."
  - `release_rule.instructor` → "Scores are shown after the instructor releases them."
  - `ai_policy.not_permitted` → "AI tools are not permitted in this quiz."

### Step 1: `pages/seg3-submit/W25.js` (Quiz rules/start)

- **Anchor and home:** `assessment:quiz3`, `default`. Roles: student, instructor, ta.
- **States drawn:** `loading`, `offline`, `notYetAvailable`, `saveFailed`, `conflict`, `permissionUnavailable`.
- **N/A:** the rest through `P.na`, with these own reasons:
  - `success`: "Starting leads to the attempt page; this page shows no outcome of its own"
  - `invalid`: "The only input is the rules acknowledgement, which blocks Start instead"
  - `saving`: "Starting is one confirmed step; nothing here saves in the background"
- **Variants:** `acknowledged` ("Rules acknowledged: Start enabled") and `confirm` ("Start dialog open").

**Figures (all roles)**

| Figure | Source |
|---|---|
| Title, max points | `item.title`, `item.max` |
| Question count | `quiz.items.length` |
| Version | `quiz.version` |
| Opens, closes | `P.when(a, quiz.opens)`, `P.when(a, quiz.close)` |
| Attempts allowed | `quiz.max_attempts` |
| Selection, release and AI rules | the text maps above |

Add a static integrity line: leaving the window is never treated as evidence and never cancels an attempt.

**Student timing (own id only, `a.who.personId`)**
- Duration is `effectiveMinutes`.
- When `allowanceFor` returns a record, show `quiz.minutes` plus `extra_minutes` (or the multiplier) and `K.flag("extension")`.
- Read only `extra_minutes` and `multiplier`. Never read `basis_reference_instructor_only`, `note` or `recorded_by`.
- Always show "To get your full time, start by" with `fmtTime(lateStartThreshold(...))` and the zone.

**Student branches, in order, from the clock**
1. **Not open** (`isBefore(clock, quiz.opens)`): `K.flag("notOpen")`, the opens time, Start disabled with reason "Opens " + when. Add a notice action "See this quiz at a clock when it is open" → `W25~group_submission` (constant `OPEN_CLOCK`; a test proves it is open with no attempt).
2. **Active attempt** (`attemptView.active`): primary link "Resume attempt" → `W26`. Show time left from `secondsLeft` and the deadline. When `availableMinutes(…, attempt.started_at)` is less than `effectiveMinutes`, add the line that this attempt started with that many minutes. No Start.
3. **Received attempt** (`attempt.received_at`): "Attempt n of max" and "View receipt" → `P.recordGo("W27", "receipt", attempt.receipt_id)`. If attempts remain and the quiz is still open, draw Start disabled with reason "A second attempt is not drawn in this prototype" (kit request 3).
4. **Closed** (`!isBefore(clock, quiz.close)`): `K.flag("closed")`, the close time, no Start.
5. **Eligible** (open, no attempt): the committing action below. When `availableMinutes(view, quizId, personId, view.clock)` is less than `effectiveMinutes`, draw a warning notice with that number and the close time, and repeat it in the dialog.

`P.status(a, P.ownSubmission(a, itemId), true)` appears in every student branch.

**Committing action: Start attempt (eligible branch only)**
- Default: a disabled `K.field` checkbox "I have read the current rules" (`ns-rules-box`), Start disabled with reason "Confirm you have read the current rules first", and link "I have read them" → `W25:acknowledged`.
- `acknowledged` or `confirm`: checkbox checked, opener `K.button({act: "open-dialog", target: P.id(a, "start")})`, and link "Not read yet" → `W25`.
- Dialog `P.id(a, "start")`, open on `confirm`. Its `K.kv` holds: personal duration, minutes available if started now, hard close, attempt number, the AI rule, and "The timer keeps running if you leave or lose connection". One primary destination: `{id: P.id(a, "start-go"), label: "Start attempt now", go: "W26~quiz_in_progress"}`, built from `anchorFor("W26").home`.
- Blocking states win over the variants. Each draws Start disabled with its reason, no opener and no dialog:
  - `offline`: "You're offline. A timed attempt cannot start".
  - `saveFailed`: warning notice "We could not confirm whether your attempt started", preview-only button "Check for an active attempt", reason "Check before starting again".
  - `conflict`: notice "The quiz timing changed since you opened this page", preview-only "Refresh rules", reason "Confirm the current timing first".
- `notYetAvailable` token at a clock where the quiz has opened: `P.offHome(a, "This quiz has already opened at this point")`.

**Authority branches (run first)**
- `permissionUnavailable`: `P.permissionNotice` (staff text "You are not teaching this course"). No rules.
- **Staff preview (instructor and TA):** an info notice "Staff preview of the learner rules" stays in every staff view, with `K.flag("preview")` for the instructor only. Published timing only: `quiz.minutes` and the published threshold (`lateStartThreshold` called with the staff member's own id).
  - Never call `attemptFor`, `attemptView`, `allowanceFor`, `receiptsFor` or `submissionFor` for a learner.
  - No timer, Start, checkbox, dialog or receipt. Add the line "Personal extra time is not shown in this preview".
  - Instructor: link "Edit quiz" → `P.recordGo("W41", "assessment", itemId)`.
  - TA: the line "Quiz timing, extra time and release are the instructor's step", and no edit link.
  - `P.taEnded(a)`: published rules plus `P.taEndedNotice(a, null)`, the same as W19.
  - Staff ignore `saveFailed` and `conflict` and draw the plain preview. `offline` adds `P.offlineNotice`.
- Links for all roles: "Coursework" → `W18`.

**Platforms:** `K.rail` with main = rules (`K.section` plus `K.kv`) and rail = "Start" panel, `railLabel: "Start"`. Compact stacks the rules before Start (`railFirst` false). The dialog adapts through `K.dialog`. No other differences.

### Step 2: `pages/seg3-submit/W26.js` (Quiz attempt)

- **Anchor and home:** `attempt:aisha-quiz3-1`, `quiz_in_progress`. Role: student.
- **States drawn:** `loading`, `invalid`, `saving` (required), `saveFailed`, `offline`, `sessionExpired`.
- **N/A:** the rest through `P.na`, with these own reasons:
  - `conflict`: "One learner owns the attempt; a repeated send resolves to the same receipt"
  - `success`: "The result of submitting is the receipt page"
  - `firstUseEmpty`: "With no attempt the page says so and links to the rules"
- **Variants:** `reviewed` ("Review panel: Submit enabled") and `confirm` ("Submit dialog open").

**Record:** `attempt = attemptFor(view, quiz.id, a.who.personId)`, counted only when `attempt.id === anchorFor("W26").record.id`. `av = attemptView(...)`.

**Branches when the attempt is not answerable**
- No attempt: `P.status` of the submission, link "Quiz rules" → `W25`, and `P.offHome(a, "There is no attempt in progress at this point")`.
- Received: "This attempt is already handed in", link → `P.recordGo("W27", "receipt", attempt.receipt_id)`, plus `P.offHome`.
- Time expired (`!av.active` and not received): notice "Time is up. Your answers are locked" with the deadline, "Only saved answers are finalised; no receipt exists until it is confirmed", and link "Check status" → `W27`. No fields, no Submit.

**Active view**
- **Rail** (`railLabel: "Attempt"`, `railFirst: true`):
  - `K.timer({label: "Time left", remaining: minutes from av.secondsLeft, endsAt: P.when(a, av.deadline)})`.
  - Attempt number, question version (`quiz.version`), and counts from `av.acknowledged`, `av.unsent` and `quiz.items.length`.
  - A question status `K.list`, wrapped in `K.disclosure` (`P.id(a, "qlist")`) when `a.sizeClass` is compact.
  - The commit block.
- **Main:** one `K.section` per item, titled "Question n" from item order. Control by `kind`:
  - `single_choice` → `K.choiceGroup` radio; `multiple_select` → checkbox group. Options are the placeholders "Choice A" to "Choice D"; when an answer record exists the first option is drawn checked (kit request 2).
  - `numeric` → `K.field` text; `written` → textarea. The value is the answer value.
  - Under each: "Saved answer: " + value, and the save status.
- **Save status per question:**
  - Acknowledged → `K.saveStatus("saved", {time: fmtTime(acknowledged_at)})`.
  - Record with `acknowledged_at` null → `"dirty"` by default, `"saving"` in the `saving` state, `"savedLocal"` in `offline`, `"failed"` in `saveFailed`.
  - No record → the text "No answer yet".
- A preview-only "Save answer" `K.button` per question. It is disabled with a reason in `offline` and `saving`.

**Committing action: Submit quiz**
- Default: Submit disabled with reason "Review your answers first", and link "Review answers" → `W26:reviewed`.
- `reviewed` or `confirm`: a "Review" section listing the exact payload, and opener → dialog `P.id(a, "submit")`, open on `confirm`.
- Dialog body, one `K.kv` row per question:
  - acknowledged → the value and "saved " + time;
  - unacknowledged → "Unsaved changes: will not be sent";
  - no record → "No answer".
- The dialog also shows the answered and unanswered counts, attempt, question version, time left and "This cannot be changed after sending". When anything is unanswered or unsent it carries a warning notice.
- One primary destination: `{id: P.id(a, "submit-go"), label: "Submit attempt", go: "W27~quiz_received"}`, built from `anchorFor("W27").home`.
- Blocking states win over the variants. Each draws Submit disabled, no opener, no dialog, no `W27~` link:
  - `saving`: "An answer is still saving", with a notice that names the unsent count from `av.unsent` and says the timer has not been reset.
  - `offline`: "You're offline. Nothing has been sent", with a notice that unsent answers stay on this device only, nothing is sent in the background, and to reconnect before the deadline.
  - `saveFailed`: notice "We could not confirm your submission", link "Check status" → `W27`, reason "Check the status before sending again".
  - `invalid`: an `error` on the numeric field ("Enter a number, for example 12.5"), reason "Fix the marked answer first".
- `sessionExpired`: a notice only ("Sign in again to continue. The timer keeps running until" + deadline), link → `W01`. No questions, answers or Submit.
- Back link: `{label: "Quiz rules", go: "W25"}`, omitted in `saving`.

**Platforms:** `K.rail` side on regular, stacked with the timer first on compact. The question list is collapsible on compact. The dialog adapts. Every platform says nothing is sent in the background.

### Step 3: `pages/seg3-submit/W27.js` (Quiz receipt/review)

- **Anchor and home:** `receipt:AH-PHYS110-Q3-001`, `quiz_received`. Variant `quiz2` (label from `WB.manifest.anchors.W27.variants.quiz2.label`), home `default`. Role: student.
- **States drawn:** `loading`, `offline`, `success`, `permissionUnavailable`.
- **N/A:** the rest through `P.na`, with these own reasons:
  - `firstUseEmpty`: "A receipt page is about one receipt; without it the page says no receipt exists"
  - `saveFailed`: "Nothing is saved here; a failed review load is drawn under offline"

**Record**
- `anchor = anchorFor("W27", a.variant)`; `receipt = P.receiptById(a, anchor.record.id)`.
- `itemId = receipt ? receipt.assessment_id : anchorFor("W25").record.id`.
- `attempt = attemptFor(view, quiz.id, a.who.personId)`, used only when `attempt.receipt_id === receipt.id`.

**Absent receipt** (for example `default` with no variant, or `quiz_in_progress`)
- `K.empty` "No confirmed receipt", `P.status`, link "Go to the attempt" → `W26` when `attemptView.active`, else "Quiz rules" → `W25`, plus `P.offHome(a, "The receipt is issued later in the prototype")`.
- No reference, time or score.

**Present receipt**
- **Main:**
  - `K.receipt({ref: receipt.id, item: item.title, course: course.code, acceptedAt: fmtDateTime(accepted_at), timeZone: zoneAbbr(accepted_at), attempt: receipt.attempt})`. Leave `files` out.
  - The line "This receipt does not change".
  - A "Submitted answers" `K.kv`: question n → value and "saved " + time. Plain text only; no field, button or dialog that edits.
- **Rail** (`railLabel: "Details"`):
  - `P.status`, question version (`receipt.assessment_version`), answered count (`attemptView.acknowledged` of `quiz.items.length`).
  - "Released review" section (below).
  - Preview-only "Download receipt" `K.button` with a `note`.
  - Links: "View course grades" → `W24`, "Quiz rules and attempts" → `W25`, "Coursework" → `W18`.
- **Released review:** `res = resultFor(view, personId, itemId, a.who)`.
  - `res` null or `res.status === null` (held): the release-rule text and "Nothing about marking is shown before release". No score, key or progress.
  - Otherwise: the score from `P.score(res.score, res.max)`, `res.comment`, the release time from `P.when(a, res.releasedAt)`, the release version from the last entry of `releasesFor(view, itemId, a.who)`, and "Answer keys are not part of this review".
- **States:**
  - `success` (receipt present only): a success notice with the reference and time.
  - `offline`: `P.offlineNotice` plus `K.flag("lastKnown")`. The receipt and answers stay. The released review is replaced by "The released review could not be loaded" with a preview-only "Retry" button, so no stale score.
  - `permissionUnavailable`: `P.permissionNotice(a, "This receipt belongs to another person")`.
- Not drawn, by decision: the attempt selector, the release selector and the "Start another attempt" dialog. There is one attempt and one release, and the W25 link covers the route.

**Platforms:** `K.rail`, stacked on compact (receipt, then answers, then review). No other differences.

### Step 4: `tools/seg3-submit.test.mjs` (write this first; it must fail before the pages exist)

Import from `./spine_helpers.mjs`. Read every expected value from `S`. Define `const PAGES = ["W25", "W26", "W27"]`.

1. **Structure:** the three pages are not placeholders. States plus N/A cover all 16 ids with reasons of 140 characters or fewer. W26 draws `saving`. W27 declares `quiz2`. W25 declares `acknowledged` and `confirm`; W26 declares `reviewed` and `confirm`.
2. **Render matrix:** copy `checkOne` from `spine.test.mjs:14`. Cover every page × `CTX5` × `rolesOf` × `tokensOf` at `default` and the home scenario, and the default view × all `SCENARIOS` × `CTX3`. Expect no problems, no "Not built yet", ids inside the frame namespace, and no `wb-handoff`.
3. **W25 timing:** the student html at `default` holds `fmtTime(lateStartThreshold(v, "quiz3", aisha))` and `String(effectiveMinutes)`. The instructor and TA html hold the published threshold and not Aisha's. No role's html, on any scenario, contains the allowance's `basis_reference_instructor_only`.
4. **W25 Start:**
   - `OPEN_CLOCK` proof: at `group_submission` the clock is inside the window and `attemptFor` is null.
   - There: default is disabled with the reason and has a `W25:acknowledged` link; `acknowledged` has the opener; `confirm` gives `openDialogs` equal to `["t-c-start"]` and exactly one `#/W26~quiz_in_progress` href, inside the dialog.
   - At `default` (not open), all three tokens have no opener, no dialog and no `W26~` link, and the html has a `W25~group_submission` go.
   - `direct()` with `offline`, `saveFailed` or `conflict` plus variant `confirm` at `group_submission`: no dialog.
   - `direct()` with a data copy whose `scenarios.clocks.group_submission` is `2026-10-22T23:50:00-04:00`: the html includes `String(S.availableMinutes(...))` for that clock.
   - At `quiz_in_progress` and `late_quiz_start`: a `W26` go and no opener. At `quiz_received`: a `W27` go.
5. **W25 staff:** the instructor and TA html at every scenario has no `data-act="open-dialog"`, no `wb-timer` and no `W26` or `W27` go. The instructor has a `W41` go; the TA has none. The TA at `ta_expired` shows the access-ended title and still shows `quiz.title`.
6. **W26 at home:** the html holds the deadline time and each acknowledged answer value.
   - Default: Submit disabled, `W26:reviewed` link.
   - `confirm`: `openDialogs` equals `["t-c-submit"]`; the dialog holds every acknowledged value, the "will not be sent" text for q3, and exactly one `#/W27~quiz_received` href.
   - `saving`: disabled, no opener, includes `String(av.unsent)`.
   - `direct()` with `offline`, `saving`, `saveFailed` or `invalid` plus `confirm`: no dialog and no `W27~`.
   - `sessionExpired`: no answer value.
7. **W26 truth:**
   - At `default`: no fields, no opener, and a `W26~quiz_in_progress` go.
   - At `quiz_received`: a `W27` go and no opener.
   - Expired (`direct()` with a data copy whose `clocks.quiz_in_progress` is `2026-10-21T10:31:00-04:00`): no opener, no dialog, no `<input` or `<textarea` in main, and no receipt id.
   - At `late_quiz_start`: renders with `secondsLeft` 240 as 4 minutes.
8. **W27:**
   - At `quiz_received`: the receipt id and accepted time are present. The html has no `<input`, `<textarea` or `<select` in main and no `open-dialog`. It does not contain `" / " + quiz.max`.
   - Token `quiz2` at `default`: the html holds `P.score(res.score, res.max)`, `res.comment` and the Quiz 2 receipt id.
   - At `default` with no variant: no Quiz 3 receipt id, and a `W27~quiz_received` go.
   - `quiz2` plus `offline` (`direct()`): the receipt id is present and the score is absent.
   - At `quiz_in_progress`: no receipt id.
9. **Journeys:** the J05 steps for W25, W26 and W27 and the J11 step for W25 render clean on `CTX3`.
   - W25 → W26: the chain default → `W25~group_submission` → `confirm` dialog holds a W26 go.
   - W26 → W27: the `confirm` dialog at the step scenario holds a W27 go.
   - W27 → W24: `goPages` includes W24.
   - Add a comment that W25 → W58 and W27 → W53 change role, so the tour bar carries them.

### Step 5: notes and requests

- **`pages/seg3-submit/QUIZ.md`** (new, 120 lines or fewer): the per-page table of drawn states and variants, and the decisions above, each marked "chosen by Claude under owner delegation". State the limits: source checks only, fictional data.
- **`kit_requests.md`**: append a `## seg3-submit` section. Do not edit existing entries.
  1. A `quiz-save-unacknowledged` failure sample (W26 uses `attemptView.unsent` for now).
  2. Quiz item prompts, options and an answer-to-option mapping (W26 and W27 draw placeholder choices and raw values).
  3. A second-attempt scenario (the W25 "start another" control is disabled for now).
  4. Role-scoped quiz selectors (`attemptFor` and `allowanceFor` take a bare person id).
  5. Optional: a selector for "the scenario where the quiz is open with no attempt", to replace `OPEN_CLOCK`.

### Step 6: shared test blocker (coordinator-owned)

Every Phase 3 segment hits `tools/spine.test.mjs:29-31`. If the coordinator has not relaxed it, make this single minimal edit, which is identical for all segments:
- Rename the test to "structure: the 12 spine pages are real".
- Replace the loop on line 31 with `for (const id of SPINE) assert.equal(WB.pageFor(id).placeholder, false, id);`.

Change nothing else in that file. Report the edit in the hand-back. The coordinator adds `import("./seg3-submit.test.mjs")` to `tools/index.js`.

### 4. Acceptance criteria

- W25, W26 and W27 render on all 5 contexts for every allowed role, state, variant and scenario with no `frameProblems`, no placeholder text and no `wb-handoff`.
- No typed date, time, score, minute count, person, course or receipt id in the three page files. The 11:29 PM threshold appears only through `lateStartThreshold`.
- Start (W25) and Submit (W26) are reachable only through an acknowledged or reviewed variant and a confirm dialog with one scenario destination. They are never drawn when the clock or a blocking state forbids them.
- W26 confirms the exact acknowledged answers and labels unsent and unanswered ones. Offline and saving never show a receipt or a "saved" status for an unacknowledged answer.
- W27 has no editing control. A held result shows no score. The released Quiz 2 review shows only `resultFor` values. With no receipt at the clock, no reference is shown.
- Staff on W25 see published rules only, with no learner attempt, allowance or receipt and no Start. A TA gets no edit link. An ended TA gets the notice plus the published rules. The allowance basis reference never appears.
- Must not change: W19–W24, `shared.js`, `kit/`, `fixtures/`, `manifest/`, `system/`, `spec/`, `tracker/`, `viewer/`, `decisions.md`, `NOTES.md`, `inputs.lock.json` and other segments' folders. All existing tests keep passing, apart from the one-line relaxation in Step 6.
- Each new file is 800 lines or fewer. The three pages together are 40 KB or less. Spec size is unchanged; app and board are each 921,600 B or less.

### 5. Proof commands

Run from the repo root.

```bash
bash -o pipefail -c 'node --test design/final/tools/seg3-submit.test.mjs 2>&1 | tail -n 20'
bash -o pipefail -c 'node --test design/final/tools/*.test.mjs 2>&1 | tail -n 15'
bash -c 'node design/final/tools/check_render.mjs && node design/final/tools/check_vocab.mjs'
bash -o pipefail -c 'node design/final/build.mjs 2>&1 | tail -n 10'
bash -o pipefail -c 'node design/final/tools/check_all.mjs 2>&1 | tail -n 25'
bash design/final/tools/legacy_check.sh
bash -c 'wc -c design/final/dist/Whiteboard-Final*.html design/final/pages/seg3-submit/W2[567].js'
bash -c 'git status --porcelain design/final/pages/seg3-submit design/final/pages/shared.js design/final/kit design/final/fixtures design/final/manifest'
```

The last command must list only `W25.js`, `W26.js`, `W27.js` and `QUIZ.md` as new, plus whatever was already untracked before this work.

### 6. Out of scope / risks

- **Out of scope:** browser, keyboard, screen-reader and device acceptance; the kit, fixture and selector additions (requests only); `tools/index.js` (coordinator); tracker rows; commits. Never run `design/build.mjs` or `design/tools/check_batch.mjs`.
- **Payload versus receipt:** the W26 dialog at 10:10 AM confirms two saved answers, while the destination receipt at its home clock holds four, because the fixture has the learner keep answering until 10:24 AM. Record this in `QUIZ.md`. Fixing it needs a fixture change (covered by kit request 1 or 2).
- **Placeholder choices:** the "Choice A" to "Choice D" options and raw `sample-answer-*` values are a visible gap until kit request 2 lands.
- **`OPEN_CLOCK`:** `group_submission` is a hard-coded scenario id, guarded by a test. A fixture change to that scenario would fail the test rather than draw something untrue.
- **Shared files:** `spine.test.mjs` (Step 6) and `kit_requests.md` are touched by parallel segment builders. Keep both edits minimal and append-only to avoid merge conflicts.
- **Vocabulary:** a string literal exactly equal to a kit status or flag label fails `check_vocab`. Use `K.flag` and `K.status`, and word the sentences around them.
---

## Segment: Plan: Phase 3 segment `seg4-community` (W28, W29, W30, W31, W33, W34, W47, W55, W56)

### 1. Goal

Replace the nine segment-4 placeholders with real page files in `design/final/pages/seg4-community/`, drawn truthfully on web, iPad and iPhone from fixture selectors. Add one test file, segment notes and kit requests. Nothing outside the segment's own files changes.

### 2. Context (verified)

All paths are under `/Users/wasifkarim/Claude/Projects/Whiteboard/design/final/`.

**Registry and tiers**
- All nine pages are segment 4 (`tools/page_meta.mjs:13`). The folder `pages/seg4-community/` does not exist yet.
- `load_site` accepts only `<ID>.js` there; `.md` files are ignored (`pages/PAGES.md:9`).
- Roles and tiers, web/iPad/iPhone (`manifest/pages.js:48-76`):
  - W28–W31: student, instructor, ta; full/full/full.
  - W33, W34: student only; full/full/full.
  - W47, W55, W56: instructor, ta; full/review/review. None has a `PROTECTIVE_NOTES` entry, so `DEFAULT_REVIEW_NOTE` applies (`page_meta.mjs:52-68`).
- Anchors (`manifest/anchors.js:28-38`):
  - W29 `announcement:ann-quiz3`, home `default`, variant `office-hours` → `ann-office-hours`.
  - W31 `discussion:projectile`, home `default`.
  - W33 `groupSet:lab-teams` and W34 `group:team-orbit`, home `group_work_in_progress`.
  - W47 `groupSet:lab-teams`, home `default`.
  - W28, W30, W55, W56 are course-level.
- Required failure states: `group-membership-changed` → `conflict` on W34 and W47 (`fixtures/scenarios.js:147`). No other failure names these pages.
- Journeys (`manifest/journeys.js:41-45`):
  - J07: W47 (instructor) → W40 (instructor, `motion`) → W33, W34 (student, `group_work_in_progress`) → W19 (`motion`) …
  - J09: W55 (instructor) → W28 → W29 → W08 → W30 → W31 (student) → W56 (instructor).
- Navigation: students reach W28, W30, W33; staff reach W47, W28, W30. No staff entry targets W33 or W34 (`manifest/navigation.js:5,33-52`).

**Selectors (exact signatures)**
- `fixtures/comms.js:81-110`:
  - `replyCount(view, topicId)`, `lastActivity(view, topicId)`, `topicAuthor(view, topicId)`.
  - `unreadAnnouncements(view, courseId, personId)` → `[{id, reason: "new"|"updated"}]`, published only.
  - `visibleTopics(view, courseId, personId)`: group topics only for members. Reyes and Maya do not get `team-orbit-planning`.
- `fixtures/groups.js:31`: `groupFor(view, personId, setId)`.
- `fixtures/coursework.js`: `assessment(view, id)`, `submissionFor(view, personId, assessmentId)`, `receiptsFor(view, assessmentId, who)`, `draftFor(view, assessmentId, who)` (student only).
- `fixtures/staff.js`: `taScope(view, assessmentId, who)`, `taTaskAccess`, `taAccessActive`, `accessEnd`.
- `fixtures/world.js`: `person`, `enrolled(view, courseId, role)`, `courseShell`, `fmtDateTime`, `zoneAbbr`.
- `fixtures/samples.js:59`: `failureSample(view, failureId, who)`.

**Records**
- Announcements (`comms.js:22-41`): `{id, course_id, author_id, published_at, aboutAt?, pinned, state, attachments[{name, pages, accessible_version}], revisions[{rev, at, title, body}]}`.
  - All three are `published`. `ann-office-hours` has two revisions.
  - Read markers exist for Aisha only.
- `ANNOUNCEMENT_STATES` = published, scheduled, draft, withdrawn (`manifest/status.js:13`).
- BD20 / DD-4.06 (`decisions.md:122-127`): an announcement can be withdrawn, history is kept, and learners see a "Withdrawn" notice in place of the text.
- Discussions (`comms.js:47-75`): `{id, title, audience, group_id, replies_closed, posts[{id, author_id, at, parent_id, body}]}`. `welcome` has replies closed.
- Group set (`groups.js:15-26`): `lab-teams`, `version: 1`, `self_enrollment: false`, `ungrouped: []`, groups Team Orbit (aisha, ben) and Team Vector (carmen).
- Group assignment `motion`: `membership_version_at_publish: 1`.
- The Team Orbit draft (`membership_version`, `captured_members`, `actor_id`, `saved_at` 3:40 PM on 20 Oct) exists at `default` and `group_work_in_progress`. Both clocks are 20 Oct, 4:00 PM.
- The group receipt exists only at `group_submission` and `ps4_released`.
- Projection (`scenarios.js:195-222`): announcements, revisions, read markers and posts after the clock drop out. At `assignment_submission` (15 Oct) `ann-quiz3` and `projectile` do not exist.

**Gaps (all become kit requests)**
- No selector lists announcements, one topic, group sets or group assignments.
- No withdrawn, draft or scheduled announcement record, and no `withdrawn_at` field.
- `samples.failures` has six entries and none for `group-membership-changed`, so `failureSample` returns null.
- No moderation-report records and no TA moderation or authoring scope.
- No scenario holds the result of withdraw, publish, move member or lock.

**Checks**
- `PAGE_DATA_BANS` (`tools/check_vocab.mjs:165`): `.pending`, `grade_drafts`, `.data.(grades|staff|samples)`, `.drafts`, `.releases`, `golden`, `question_ids`. `.data.comms` and `.data.groups` are not banned.
- `checkNoLabelRedefinition` (`check_vocab.mjs:135`) fails on any quoted string exactly equal to a kit label. That includes "Draft", "Closed", "Locked", "Read-only", "Received", "Released", "Held", "Missing" and "Not open yet".
- Flag keys (`kit/core.js:177-183`): `locked`, `closed`, `extension`, `lastKnown`, `readOnly`, `notOpen`, `preview`.
- Helpers to reuse (`pages/shared.js`): `P.na`, `P.id`, `P.shell`, `P.recordGo`, `P.when`, `P.personName`, `P.status`, `P.ownSubmission`, `P.taEnded`, `P.taEndedNotice`, `P.staffGate(a, itemId|null)`, `P.permissionNotice`, `P.loading`, `P.offlineNotice`, `P.offHome`, `P.handoff`, `P.bareHandoff`, `P.stack`, `P.links`, `P.p`, `P.fileMeta`.
- Test helpers (`tools/spine_helpers.mjs`): `frame`, `direct` (accepts `data`, `state`, `variant`), `copy`, `view`, `viewer`, `tokensOf`, `rolesOf`, `goLinks`, `goPages`, `dialogOf`, `disabledWith`, `rowsWith`, `mainOf`, `idsInMain`, `CTX5`, `CTX3`, `SCENARIOS`.

**Blocker for the coordinator (verified)**
- `tools/spine.test.mjs:29-31` asserts that every non-spine page is still a placeholder. It fails as soon as any segment page is real.
- The builder must not edit it, because six segments run in parallel. The coordinator relaxes line 31 to check spine pages only. See C1 in §6.

**Assumptions**
- A1: a count taken from a selector result (for example `enrolled(...).length`) counts as selector-derived (SPINE.md A1).
- A2: pages may read `a.view.data.comms.announcements`, `a.view.data.groups.group_sets` and `.group_assignments`, filtered by `a.who.courseId`, because no selector exists (same basis as SPINE.md A2).
- A3: optional fields `withdrawn_at` and `scheduled_for` are read only when present.

### 3. Changes

### Step 0: segment rules (apply to every page)

Chosen by Claude under owner delegation; record them in the notes file (step 11).

1. **File shape.** Each file is an IIFE like `seg6-grading/W48.js`, with a `STATES` array, `P.na(STATES, {...})`, small functions, and a target of 250 lines or fewer. No shared file is allowed in the folder, so the few lookups below are repeated per file and kept under 10 lines each:
   - `anns(a)`: course announcements.
   - `latest(ann)`: the last revision.
   - `topicOf(a, id)`: `visibleTopics(...)` filtered by id.
   - `setOf(a)`: the group set whose id is `sel.anchorFor("W33").record.id`, checked against `a.who.courseId`.
2. **Branch order.** Authority first (null `a.who.courseId`, TA ended, `permissionUnavailable`), then `loading`, then record absent at this clock (`P.offHome`), then state tokens, then default.
3. **TA after access ends (`P.taEnded(a)`).**
   - W28–W31 draw the published content any TA sees plus `P.taEndedNotice(a)`, with no composer and no reply control.
   - W47, W55 and W56 return `P.staffGate(a, null)`: the notice only.
4. **Committing actions with no result scenario** (withdraw, publish, move member, lock, hide, post reply, start topic, mark read).
   - Each is a preview-only `K.button` with a `note` of the form "Preview only: nothing is … in this prototype".
   - Confirm dialogs are drawn only for the listed variants. Their primary item is a preview-only action with an `id` and `note`.
   - No link claims a result page. This is a deliberate, recorded departure from the PAGES.md committing-action rule, because no result scenario exists (kit request K5).
5. **Record-true links.** Every record link is `P.recordGo(page, type, id)`; when it returns null the row is plain text. Links to course-level pages (W28, W30, W55, W56, W08) use collective labels such as "Manage announcements" and "Manage discussions", never "Edit this …".
6. **Announcement visibility.**
   - W28 and W29 show only `published` and `withdrawn` records, to every role.
   - `draft` and `scheduled` appear only on W55, and only for the instructor.
   - A withdrawn record shows the title, a `K.notice` titled "Withdrawn" in place of the body, and no attachments. Staff also get a "Manage announcements" link.
7. **Read state.** Only the student gets it, from `unreadAnnouncements`, as `K.badge` "New" or "Updated", else the text "Read". Staff personas have no markers, so staff rows show "Updated" only when there is more than one revision.
8. **Wording.** Never quote a kit label. Use `K.flag("closed")`, `K.flag("readOnly")` and `K.flag("lastKnown")`. Word the others as "Not published yet", "Scheduled", "Withdrawn" and "Replies closed". Run `check_vocab` after each file.
9. **Offline.** `P.offlineNotice(a)` plus `K.flag("lastKnown")`. Every sending control becomes a disabled `K.button` with the reason "You're offline" and an `ns`-prefixed id.

### Step 1: `pages/seg4-community/W28.js` (Announcement list)

- **Anchor and shell:** course-level, home `default`. Shell `{page: "W28"}`, title "Announcements".
- **States:** loading, firstUseEmpty, filteredEmpty, offline, permissionUnavailable. N/A overrides:
  - saving and saveFailed: "Read markers are preview only; nothing is saved from this list".
  - archived: default reason.
- **Body:** `K.table` with id `P.id(a, "anns")`, caption "Announcements", columns title (primary), author, published, state. Compact contexts get row cards automatically.
  - Rows are `anns(a)` filtered by rule 6. Pinned rows come first, then newest `published_at`; each group is sorted without mutating the source.
  - Cells: latest revision title; `P.personName(a, author_id)`; `P.when(a, published_at)`, plus "Updated " + `P.when(latest.at)` when there is more than one revision; the pinned badge, the read state (rule 7) and "Attachment" when there are attachments.
  - `go` is `P.recordGo("W29", "announcement", id)`. `ann-ps4-due` has no anchor, so it has no `go`.
- **Empty states:**
  - firstUseEmpty, or no rows at this clock: "No announcements yet", with a link to W14.
  - filteredEmpty: "No announcements match", with a preview-only "Clear filters".
- **Actions and links:**
  - A preview-only "Mark all as read" button, student only.
  - "Notification settings" → `W08`.
  - Instructor: "Manage announcements" → `W55`. TA: the text "Publishing announcements is the instructor's step".
- **Platforms:** identical content; the kit adapts the layout.

### Step 2: `W29.js` (Announcement detail)

- **Anchor and shell:** record id from `a.sel.anchorFor("W29", a.variant).record.id`. Declare `variants: {"office-hours": "Office hours update"}`. Shell `{section: "announcements"}`, crumbs to W28, title from the latest revision.
- **States:** loading, offline, permissionUnavailable, notYetAvailable.
  - notYetAvailable is the neutral unavailable view: no title, body or count, and a link to W28. The `title` is "Announcement".
- **Record absent at the clock:** title "Announcement" and `P.offHome(a, "This announcement is not published at this point")`.
- **Body:**
  - `K.kv`: author via `P.personName`, published time via `P.when`, version (`latest.rev`), and updated time when the revision is above 1.
  - The latest body through `P.p`.
  - Attachments as a `K.list`: name, pages, "Accessible version available" from `accessible_version`, and a preview-only "Download" button.
  - For a record with more than one revision, a `K.disclosure` "Earlier versions" lists each prior revision's time and text.
  - A withdrawn record follows rule 6.
- **Actions and links:**
  - Student: preview-only "Mark as unread".
  - "Back to announcements" → `W28`, and "Notification settings" → `W08` (the J09 next step).
  - Instructor: "Manage announcements" → `W55`.
  - There is no reply control and no private-message control.
  - The record has no assessment reference field, so no W25 or W19 link is drawn (kit request K1).

### Step 3: `W30.js` (Discussion list)

- **Anchor and shell:** course-level. Shell `{page: "W30"}`.
- **States:** loading, firstUseEmpty, filteredEmpty, offline, permissionUnavailable. N/A overrides: invalid, saving and saveFailed, "Starting a topic is preview only in this prototype".
- **Body:** `K.table` over `a.sel.visibleTopics(a.view, a.who.courseId, a.who.personId)`.
  - Columns: topic (primary), started by (`P.personName(topicAuthor)`), replies (`replyCount`), last activity (`P.when(lastActivity)`), state.
  - State cell: `K.flag("closed")` when `replies_closed`, else "Open"; plus a "Group only: " + group name badge when the audience is `group`. Only the viewer's own group can appear, because `visibleTopics` is scoped.
  - `go` is `P.recordGo("W31", "discussion", id)`. Only `projectile` links; the others are plain text.
- **Other content:** a `K.disclosure` "Posting rules": posts are visible to the stated audience, and this is not private messaging.
- **Actions and links:**
  - Preview-only "Start a topic", disabled when offline.
  - Instructor: "Manage discussions" → `W56`.
  - TA: no manage link. The text "You have no moderation scope in this course" is drawn only on W56.

### Step 4: `W31.js` (Discussion thread)

- **Anchor and shell:** `topicOf(a, anchorFor("W31").record.id)`. Shell `{section: "discussions"}`, crumbs to W30.
- **States:** loading, invalid, saving, saveFailed, offline, permissionUnavailable.
  - permissionUnavailable: audience access changed. No posts and no composer; `P.permissionNotice` plus a W30 link.
- **Topic absent:** `P.offHome(a, "This discussion has not started at this point")`.
- **Body:**
  - Header `K.kv`: audience ("Everyone in " + the course code from `sel.course`), reply count, last activity.
  - Posts as a `K.list` labelled "Posts": the title is the author's name plus the role label from `WB.ROLE_LABELS[sel.person(...).role]`; the meta is `P.when(at)` plus "In reply to " + the parent author's name; the body text follows.
- **Composer** (only when not `replies_closed`, not TA-ended and not permissionUnavailable):
  - The line "Posting as <name> to <audience>".
  - `K.field` textarea with id `P.id(a, "reply")`.
  - Preview-only "Post reply".
- **State effects on the composer:**
  - invalid: field error "Write a reply before posting".
  - saving: `K.saveStatus("saving")` and Post disabled with "Your reply is still sending".
  - saveFailed: an error notice, "We could not confirm your reply was posted. Check the thread before trying again", with a preview-only "Check thread". There is no claim that it posted.
  - offline: Post disabled, "Not posted" text.
  - `replies_closed`: `K.flag("closed")`, "Replies are closed", and no field or button.
- **Actions and links:** "Back to discussions" → `W30`; preview-only "Report" per post; instructor "Manage discussions" → `W56` (the J09 next step for staff).

### Step 5: `W33.js` (My course groups; student only)

- **Anchor and shell:** set `lab-teams`, home `group_work_in_progress`. Shell `{page: "W33"}`.
- **Authority:** `var g = a.sel.groupFor(a.view, a.who.personId, set.id)`. Nothing about another group is read or drawn.
- **States:** loading, firstUseEmpty, offline, permissionUnavailable. N/A overrides:
  - conflict: "Membership changes are drawn on the group workspace".
  - invalid and saving: "Groups in this course are assigned by the instructor; there is nothing to join".
- **Body:** a `K.card` per set (one).
  - Set name, group name, members (names of `g.members` via `P.personName`), "Membership version " + `set.version`, and "Your instructor assigns groups" when `self_enrollment` is false. There is no Join control.
  - Group work list: each group assignment for the set gives `sel.assessment` title, due via `P.when`, own status via `P.status(a, P.ownSubmission(a, id), true)`, and a link `P.recordGo("W19", "assessment", id)` → `W19:motion`.
  - The line "A receipt keeps the members it was handed in with, even if groups change later".
- **firstUseEmpty or `g` null:** `K.empty` "You are not in a group yet" plus "Your instructor assigns groups", with links to W12 and W14. No group names.
- **Links:** "Open group workspace" → `P.recordGo("W34", "group", g.id)` (the J07 next step).

### Step 6: `W34.js` (Group workspace; student only)

- **Anchor and shell:** group `team-orbit`. Shell `{section: "groups"}`, crumbs to W33.
- **Authority:** the viewer's group is `groupFor(view, who.personId, set.id)`. If it is null, or its id is not the anchor id, draw `P.permissionNotice` and no group data.
- **States:** loading, firstUseEmpty, conflict (required), offline, permissionUnavailable.
- **Body:**
  - Header `K.kv`: group, set, members, membership version (`set.version`).
  - For each group assignment, with `it = sel.assessment`, `draft = sel.draftFor(view, it.id, who)` and `r = sel.receiptsFor(view, it.id, who)[0]`:
    - **Receipt exists:** `P.status`, "Handed in by " + `P.personName(r.actor_id)`, `P.when(r.accepted_at)`, the captured member names, "Membership version at hand-in " + `r.membership_version`, and a link `P.recordGo("W22", "receipt", r.id)` → `W22:group`. No Add or Review links.
    - **Draft exists:** "Shared draft saved by " + the actor + `P.when(draft.saved_at)`, the files via `P.fileMeta`, "Prepared for membership version " + `draft.membership_version`, and links from `P.recordGo("W20", "draft", draft.id)` and `P.recordGo("W21", "draft", draft.id)`.
    - **Neither:** "No shared draft yet" and an "Add group work" link to `W20:motion` through `recordGo("W19", …)`.
    - Always: an "Assignment details" link → `W19:motion` (the J07 next step) and the text "One submission counts for the whole group".
- **conflict:** a warning `K.notice` first, "Your group's membership changed. Review the members again before handing in", with body figures only from the records (`draft.membership_version`, `set.version`). No invented mover or time.
  - Add and Review become disabled `K.button`s with the reason "Refresh the group first".
  - A preview-only "Refresh group" button and a link to W33.
  - An existing receipt stays drawn, unchanged, with "This receipt keeps its original members".
- **offline:** rule 9 plus the last-known text. No "received" claim beyond an existing receipt.
- **firstUseEmpty:** "No group work assigned yet" and a link to W33.

### Step 7: `W47.js` (Group sets and membership builder; instructor, TA)

- **Anchor and shell:** set `lab-teams`. Shell `{page: "W47"}`. Declare `variants: {move: "Change membership dialog open"}` (presentation only).
- **States:** loading, firstUseEmpty, invalid, saveFailed, conflict (required), offline, permissionUnavailable.
- **Authority, in order:**
  1. `var gate = P.staffGate(a, groupAssignmentId)`. For Maya this gives the ended notice, or, while active, "This assignment is not in your grading tasks", because she has no `motion` task. No rosters.
  2. TA with a scope: `scope = sel.taScope(view, gaId, who)`. Draw only groups where every member is in `scope.learnerIds`, read-only. No ungrouped list, no counts for other groups, and no Move, Publish or Save.
- **Instructor, full tier (web):**
  - `K.kv`: set name, version, "Self-enrollment off" or "on", and usage (assignment title, "Published with membership version " + `membership_version_at_publish`, link `P.recordGo("W40", "assessment", gaId)` → `W40:motion`, the J07 next step).
  - `K.grid` (`cols: 3, compactCols: 1`) of `K.card`s:
    - "Not in a group" from `set.ungrouped`, or "Everyone is in a group".
    - One card per group: the member count, and members as a `K.list` each with a trailing preview-only "Move to group…" opener `{act: "open-dialog", target: P.id(a, "move")}`.
  - Section "Group work handed in" from `receiptsFor(view, gaId, who)`: the group name, captured members, `membership_version`, `P.when(accepted_at)`, "These members are fixed on the receipt", and a link `P.recordGo("W49", "receipt", r.id)`.
  - Actions: preview-only "Save draft" and "Publish group set".
  - Dialog `P.id(a, "move")`, open on the `move` variant: "Change membership after work". The body says the change applies from now on and receipts keep their members. The primary item is a preview-only "Apply from now on" (rule 4).
  - Blocking states win over `move`: no opener and no dialog.
  - There is no link to W33 or W34. Both are student-only.
- **Instructor state effects:**
  - invalid: an error notice, "Every learner must be in exactly one group before publishing"; Publish disabled with that reason.
  - saveFailed: `K.saveStatus("failed")` and a preview-only "Retry save".
  - conflict: a warning, "The course roster changed after this set was built. Refresh before publishing"; Publish and Move disabled with "Refresh the roster first"; a preview-only "Refresh roster". No invented added or withdrawn counts (kit request K3).
  - firstUseEmpty: `K.empty` "No group sets yet" and a preview-only "Create group set".
- **Review tier (iPad, iPhone):** `P.handoff(a, {title: "Open on a larger screen", lastResult, protectiveActions})` with the read-only `kv`, rosters and receipts.
  - `lastResult` is the set name plus the version text.
  - Protective action, instructor only: preview-only "Lock membership for this set". A TA gets none.
  - No Move, Save or Publish, and no dialog; the `move` variant draws the same read-only view.
  - Gate branches use `P.bareHandoff`, which `staffGate` already does.

### Step 8: `W55.js` (Announcement editor; instructor, TA)

- **Anchor and shell:** course-level. The editor subject is the W29 default anchor record (`anchorFor("W29").record.id`) when it exists at the clock, else a new blank draft. Shell `{section: "announcements"}`. Declare `variants: {publish: "Publish dialog open", withdraw: "Withdraw dialog open"}`.
- **States:** loading, invalid, saving, saveFailed, offline, permissionUnavailable. N/A overrides:
  - destructive: "Withdrawing keeps the full history; nothing is deleted".
  - conflict: "One instructor authors announcements in this prototype".
- **Authority:**
  - `P.staffGate(a, null)` runs first.
  - TA while active: a notice, "Publishing announcements is the instructor's step", plus a read-only list of published announcements (rule 6). No fields and no Save, Publish or Withdraw. On a review tier, add `P.bareHandoff`.
- **Instructor, full tier:** `K.rail` with the editor as main and the status as rail (`railLabel: "Status and history"`).
  - Editor: `K.field` title, `K.field` textarea body, a read-only audience line ("Everyone in <course code>: " + `enrolled(view, courseId, "student").length` + " learners"), and timing as a `K.choiceGroup` (now or scheduled). Values come from the subject's latest revision, or are empty.
  - Rail: state text per rule 8, the revision history (rev and time, newest first), and "All announcements" as a `K.list` including not-published states. A row links through `P.recordGo("W29", …)` only when the record is published or withdrawn.
  - Actions: preview-only "Save draft"; "Publish…" opens the `publish` dialog; "Withdraw…" opens the `withdraw` dialog, only when the subject is published.
  - Links: "Announcements" → `W28` (the J09 next step) and "View as published" → `P.recordGo("W29", "announcement", id)`.
  - Dialog `publish`: audience count, timing, the title, and "Delivery follows each person's notification settings; publishing is recorded separately". Primary: preview-only "Publish".
  - Dialog `withdraw`: "Learners will see a Withdrawn notice in place of the text. The history is kept." Primary: preview-only "Withdraw announcement".
  - A subject that is already withdrawn shows the history and a preview-only "Publish again as a new version", with no Withdraw.
- **Instructor state effects:**
  - invalid: title field error "Add a title"; Publish disabled, with no opener.
  - saving: `K.saveStatus("saving")`; Publish and Withdraw disabled.
  - saveFailed: `K.saveStatus("failed")` and "Retry save"; the notice says learners still see the last published version.
  - offline: rule 9.
  - Blocking states win over both variants.
- **Review tier:** a handoff whose `lastResult` is the subject title plus its state. The body is the read-only published text and history.
  - Protective action, instructor only, when the subject is published: preview-only "Withdraw announcement".
  - No fields and no dialogs; both variants draw the read-only view.

### Step 9: `W56.js` (Discussion setup and moderation; instructor, TA)

- **Anchor and shell:** course-level. The moderation subject is the W31 anchor topic when visible at the clock. Shell `{section: "discussions"}`.
- **States:** loading, firstUseEmpty, invalid, conflict, offline, permissionUnavailable. N/A overrides: saving and saveFailed, "Setup changes are preview only in this prototype".
- **Authority:**
  - `P.staffGate(a, null)` runs first.
  - TA while active: a notice, "You have no moderation scope in this course", with body "A grading task does not include moderation". Below it, the read-only topic table and a link to W30. No Hide, Lock or Publish.
- **Instructor, full tier:**
  - Topic table from `visibleTopics`: title, audience, replies, last activity, open or `K.flag("closed")`.
  - Section "Thread: <subject title>": the posts (author, role, time) each with a preview-only "Hide post…" button, a `K.field` "Reason shown to learners" (`P.id(a, "reason")`), and a preview-only "Lock replies" (or "Reopen replies" when `replies_closed`).
  - Section "Reported posts": `K.empty` "No reported posts", because there are no report records (kit request K4).
  - Links: "Discussions" → `W30` and "Open thread" → `P.recordGo("W31", "discussion", id)`.
- **Instructor state effects:**
  - firstUseEmpty: no topics; a preview-only "Create discussion".
  - invalid: reason field error "Add a reason learners can read"; Hide and Lock disabled.
  - conflict: a warning, "This thread changed while you were deciding. Refresh before acting"; Hide and Lock disabled with "Refresh the thread first"; a preview-only "Refresh". No invented moderator.
- **Review tier:** a handoff plus the read-only topic table and the subject's status.
  - Protective action, instructor only: preview-only "Lock replies".
  - No Hide and no fields.

### Step 10: tests, `tools/seg4-community.test.mjs`

Use the `spine.test.mjs` pattern, import from `./spine_helpers.mjs`, and split to `seg4-community-2.test.mjs` if the file passes 800 lines. Read expected values from `S` and `WB`; never type them. `PAGES = ["W28","W29","W30","W31","W33","W34","W47","W55","W56"]`.

- **T1, render matrix.**
  - Each page × each `tokensOf` token × `CTX5` × `rolesOf`, at `default` and at the home scenario: no problems, no "Not built yet", not blocked, and ids in `<main>` start with `t-`.
  - Default view × all `SCENARIOS` × `CTX3` × roles.
- **T2, definitions.**
  - None is a placeholder.
  - W34 and W47 include `conflict`.
  - W29 declares `office-hours`.
  - `states` plus `na` cover the 16 ids, and each reason is 140 characters or fewer.
- **T3, tiers.**
  - W47, W55 and W56 on iPad and iPhone contain `wb-handoff--review`, no `<textarea` or `<input`, and no `data-act="open-dialog"`.
  - The instructor's protective label is present; the TA's is absent.
  - Web has no handoff.
- **T4, student-only.**
  - `frame({page: "W33" | "W34", role: "instructor" | "ta"})` is blocked.
  - No staff-role frame of any segment page has `W33` or `W34` in `goPages`.
  - Student W33 and W34 html never contains the other group's name or Carmen's name; read both from the group-set data.
  - With a data copy that moves Aisha out of the anchor group, W34 draws the permission notice and no member names.
- **T5, announcements.**
  - With a data copy adding one `draft` and one `scheduled` record, their titles are absent from W28 and W29 for all roles and from W55 for the TA, and present on W55 for the instructor.
  - With a data copy setting `ann-quiz3` to `withdrawn`, student W29 contains "Withdrawn", not the latest body or the attachment name, and W28 still lists it.
  - `W29:office-hours` shows the rev 2 body and updated time. At `assignment_submission` it shows the rev 1 body, and default W29 shows the off-home link `W29~default`.
  - The W55 `withdraw` and `publish` variants (instructor, web) open exactly that dialog. `saving`, `invalid` and `offline` open none.
  - TA W55 has no fields.
- **T6, TA.**
  - At `ta_expired`, W47, W55 and W56 contain the ended notice and no learner names, and W28–W31 have no `<textarea`.
  - TA W47 at default contains no student names.
  - With a data copy adding a `motion` task for Aisha and Ben, TA W47 shows the Team Orbit members and not the other group, with no Move or Publish. Build the copy in the test; `question_ids` in a test file is fine.
- **T7, group truth.**
  - W34 at the home scenario shows the draft actor and `membership_version` and links `W20:motion`, `W21:motion` and `W19:motion`.
  - At `group_submission` it links `W22:group`, shows the captured members and has no W20 or W21 link.
  - `conflict` disables Add and Review (`disabledWith`) and keeps the receipt at `group_submission`.
  - W47 conflict disables Publish; the `move` variant opens the dialog on web only.
- **T8, discussions.**
  - W30 links only `W31` among topic rows, and each reply count equals `S.replyCount`.
  - With a data copy closing `projectile`, W31 has no `<textarea`.
  - `offline` and `saving` disable Post.
  - Student W30 shows the group topic title; the instructor and TA frames do not.
- **T9, journeys.** For J07 and J09 steps on segment pages, render with the step's role, scenario and token: real and unblocked.
  - When the next step's page allows the current role, `goLinks` includes the next page, with its token when the step has one (W34 → `W19:motion`, W47 → `W40:motion`).
  - For W31 → W56, assert through the instructor's W31 frame.
- **T10, source hygiene.** No segment file contains `style=`, `console.`, a four-digit year, `%"`, or a fixture person, course or receipt id literal; build the id list from `WB.data`.

### Step 11: notes and requests

- `pages/seg4-community/NOTES.md`: the step 0 rules, a drawn-states table, the tier protective actions, and assumptions A1–A3. Mark each "chosen by Claude under owner delegation", and state that these are source checks only.
- Append `## seg4-community` to `kit_requests.md`. Each entry gives page, missing, why, proposed, workaround:
  - **K1 selectors:** `announcementsFor(view, courseId, who)`, `announcement(view, id, who)`, `topicFor(view, id, who)`, `groupSetsFor(view, courseId, who)`, `groupAssignmentsFor`; and an optional `about: {type, id}` on announcements for W29 record links.
  - **K2 fixture:** a withdrawn announcement with `withdrawn_at` and an `announcement_withdrawn` scenario or W29 variant.
  - **K3 sample:** a `group-membership-changed` failure sample (audience student and instructor; from and to versions, moved person, minutes ago).
  - **K4 fixtures:** moderation reports, and a TA moderation or authoring scope.
  - **K5 scenarios:** result clocks for publish, withdraw, membership v2 and locked thread, so confirm dialogs can link to a record-true result.
  - **K6:** staff read markers, and instructor visibility of group topics in `visibleTopics`.
  - **C1:** relax `tools/spine.test.mjs:31`, and add the import of `./seg4-community.test.mjs` to `tools/index.js`.

### 4. Acceptance criteria

- Nine files exist at `pages/seg4-community/<ID>.js`, each 800 lines or fewer, with about 75 KB of total source or less. Plus one test file, `NOTES.md` and the kit-request section. No other file is modified.
- Every page renders on the 5 contexts for every allowed role, state, variant and scenario with empty `frameProblems` and no placeholder text.
- W34 and W47 draw `conflict`. W29 declares `office-hours`.
- W47, W55 and W56 on iPad and iPhone show the handoff, the read-only record and the protective action (instructor only), with no editor or dialog.
- No staff frame links to or shows W33 or W34 data. A student sees only their own group.
- Draft and scheduled announcements never reach W28, W29 or a TA. A withdrawn announcement shows the notice in place of the text, with history kept for staff.
- A TA cannot publish, withdraw, moderate or change membership. After access ends, a TA sees no learner names on W47, W55 or W56.
- Receipts are never editable and keep their captured members and membership version.
- Offline, saving and saveFailed never claim "posted", "published" or "received".
- No typed dates, percentages, scores or ids. No `style=` or `console.*`. No quoted kit labels. No banned data access.
- Must not change: spine pages, `shared.js`, kit, fixtures, manifest, viewer, spec and tracker. The spec stays at or under 1,012,975 B, and app and board at or under 921,600 B each.

### 5. Proof commands

Run from the repo root. The first command runs the segment tests alone, before the coordinator applies C1; the rest are the full gate after C1.

```bash
bash -o pipefail -c 'node --test design/final/tools/seg4-community*.test.mjs 2>&1 | tail -n 20'
bash -o pipefail -c 'node --test design/final/tools/*.test.mjs 2>&1 | tail -n 20'
bash -c 'node design/final/tools/check_render.mjs && node design/final/tools/check_vocab.mjs && node design/final/tools/check_lines.mjs'
bash -c 'node design/final/build.mjs && node design/final/tools/check_size.mjs && node design/final/tools/check_offline.mjs'
node design/final/tools/check_all.mjs
bash design/final/tools/legacy_check.sh
bash -c 'git -C . status --porcelain -- design/final | grep -v -E "seg4-community|kit_requests.md" | grep -E "^ M" ; test $? -eq 1'
```

The last command covers tracked files inside `design/final` only: it fails if any is modified other than `kit_requests.md`. Before C1 lands, the second command fails only on "structure: … the other 51 stay placeholders"; report that, do not edit the test.

### 6. Out of scope / risks

- **C1 (coordinator):** `spine.test.mjs:31` and the `tools/index.js` import. This is the only known reason the full proof can fail after a correct build.
- **Rule departure:** rule 4 leaves the PAGES.md committing-action rule unmet for withdraw, publish, move and lock, because no result scenario exists. It is recorded in the notes and K5. A reviewer may prefer disabled controls; that is a wording-level change.
- **Fixture gaps:** the withdrawn branch, the closed-replies thread, the scoped-TA roster and the draft/scheduled filter are reachable only through test data copies, not in the viewer (K2, K4).
- **Instructor and group topics:** `visibleTopics` hides group topics from the instructor. The plan follows the selector (fail closed) and records it as K6.
- **Not drawn:** search, filter and sort wiring, self-enrollment or Join (the set has it off), random grouping preview, delivery status counts, attachment upload, archived-course views, the report dialog.
- **Not done:** tracker rows, spec, `decisions.md` and NOTES.md edits; any commit; `design/build.mjs`; `design/tools/check_batch.mjs`.
- **Size:** nine pages at about 8 KB each is close to the 75 KB share. If over, trim W56 and W47 copy first.
- **Acceptance level:** source checks only. No browser, keyboard, screen-reader or device acceptance is claimed.
---

## Segment: Plan: Phase 3 segment `seg5-authoring` (W35–W46, W59, W60)

### 1. Goal

Replace the 14 placeholders of segment 5 with real page files under `design/final/pages/seg5-authoring/`, one test file and one notes file. Every figure comes from a selector, authority branches run first, tiers follow the manifest, and the total page source stays at or under 75 KB.

### 2. Context (verified)

All paths are under `/Users/wasifkarim/Claude/Projects/Whiteboard/design/final/`.

**Contract and tooling**
- Page contract: `pages/PAGES.md`. Segment-folder `.md` files are ignored by the loader (`PAGES.md:9`); a `.js` file not named `<ID>.js` is rejected.
- Frame checks: `tools/check_render.mjs:45-55` (`frameProblems`: one `<main>`, one `<h1>`, `wb-handoff--<tier>` off full).
- Test helpers: `tools/spine_helpers.mjs` exports `frame`, `direct`, `CTX3`, `CTX5`, `tokensOf`, `rolesOf`, `goLinks`, `goPages`, `disabledWith`, `dialogOf`, `idsInMain`, `copy`, `view`, `viewer`.
- Banned page text: `tools/check_vocab.mjs:165` (`.pending`, `grade_drafts`, `.data.(grades|staff|samples)`, `.drafts`, `.releases`, `golden`, `question_ids`).

**Tiers** (`manifest/pages.js:55-66,79-80`)
- All 14 pages have roles `["instructor","ta"]` and are full on web.
- W42 and W60 are handoff on iPad and iPhone.
- The other 12 are review on iPad and iPhone. Their tier notes are `PROTECTIVE_NOTES` in `tools/page_meta.mjs:52-67`. BD6 wins, so the iPad editing requests in those notes are notes only (`PAGES.md:67`).

**Anchors** (`manifest/anchors.js:32-37`)
- W40 → `assessment:ps4`, with variant `motion` → `assessment:motion` (home `default`).
- W41 → `assessment:quiz3`. W43 and W44 → `rubric:ps4-rubric`. W45 → `person:maya`. W46 → `allowance:aisha-quiz3`.
- W35–W39, W42, W59, W60 are course-level. Every home is `default`.

**Required failure state** (`fixtures/scenarios.js:149`)
- Only `import-unsupported-type` → `invalid` on W60.
- `fixtures/samples.js:15-28` has no sample with that id, so `sel.failureSample` returns null for everyone.

**TA rights** (`manifest/navigation.js:44-63`)
- W35 and W36 `read_only`; W45 `restricted_read_only`; W39 `published_or_assigned_read_only`; W43 `assigned_read_only`; W46 `effective_timing_only`.
- W42, W59 and W60 are `no_access_default` (BD26: the standard not-available state).
- TA "Preview as learner" is removed from W35, W40 and W41 (`tracker/fix_tracker.csv:85`, DD-5.06/BD2). TA authoring is off (spec W35 notes).
- BD21: W59 copies no announcements or posts and shows the full not-copied list (`fix_tracker.csv:84`).
- BD22: bank questions are pinned to a version on W41 and W42 (`fix_tracker.csv:86`).
- BD34: "Hide from learners" and "Restore earlier version" on W35, W37, W38, W40.

**Selectors (signatures checked)**
- World: `sel.course(view, courseId)`, `sel.person(view, id)`, `sel.enrolled(view, courseId, role)`, `sel.viewerFor(view, role)`, `sel.courseShell(view, who, {page})`.
- Coursework: `sel.assessment(view, id)`, `sel.submissionsFor(view, assessmentId)`, `sel.receiptsFor(view, assessmentId, who)`, `sel.rubricFor(view, assessmentId, who)`, `sel.currentModule(view, courseId)`.
- Quiz: `sel.quiz(view, quizId)`, `sel.allowanceFor(view, quizId, personId)`, `sel.effectiveMinutes(view, quizId, personId)`, `sel.lateStartThreshold(view, quizId, personId)`, `sel.attemptView(view, quizId, personId)`.
- Staff: `sel.gradingTaskFor(view, taId, assessmentId?)`, `sel.taTaskAccess(view, assessmentId, who)`, `sel.taScope(view, assessmentId, who)` (null after expiry), `sel.accessEnd(view, personId, courseId)`, `sel.taAccessActive(view, personId, courseId)`, `sel.receivedFamily()`.
- Grades: `sel.gradeDraftFor(view, personId, assessmentId, who)`.
- Other: `sel.failureSample(view, id, who)`, `sel.anchorFor(pageId, variant)`.
- `WB.P` helpers (`pages/shared.js:237-248`): `na`, `id`, `shell`, `staffGate(a, itemId|null)`, `taEnded`, `taUnallocated`, `permissionNotice`, `handoff`, `bareHandoff`, `loading`, `offlineNotice`, `recordGo`, `when`, `score`, `status`, `personName`, `assessments`, `learnerId`, `lateRuleText`, `p`, `links`, `stack`.

**Fixture gaps (no record exists)**
- Course files, lesson content, syllabus or course settings, question bank, invitations, allowance requests, copy or import logs, draft or unpublished items.
- Every assessment is `published: true` (`fixtures/coursework.js:15`).

**Assumptions**
- A1 (from `SPINE.md`): a count or sum over selector-returned records is selector-derived.
- A3 (new): pages may read `a.view.data.coursework.modules` and `a.view.data.groups.group_sets` filtered by course, because no selector lists them and neither is banned.
- A4: `WB.FLAGS` has a read-only key. The builder checks the exact key in `kit/core.js` before using `K.flag`.

**Blocking dependency for the coordinator**
- `tools/spine.test.mjs:29-31` asserts that every non-spine page is a placeholder. It fails as soon as any segment lands.
- The builder does not edit it. Record it in `kit_requests.md`; the coordinator relaxes it to "spine pages are real".

### 3. Changes

### Step 1. Segment conventions (apply to all 14 files)

Each file is `pages/seg5-authoring/<ID>.js`: an IIFE, `var P = WB.P`, target ≤ 150 lines and ≤ 5.4 KB. No helper file is possible, so the small local helpers are repeated.

Body order (authority first, R-truth):
1. **Gate.** `var gate = P.staffGate(a, null); if (gate) return gate;`. This covers an ended TA (notice only, no data, data-free handoff) and the `permissionUnavailable` state.
2. **TA no-access pages (W42, W59, W60).** `a.role === "ta"` returns `P.stack(a, [P.bareHandoff(a), P.permissionNotice(a)])` on every platform and token.
3. **Loading.** `P.stack(a, [P.bareHandoff(a), P.loading(a, "<thing>")])`.
4. **Tier.** `a.tier === "full" ? full(a) : review(a)`.
   - Review is `P.handoff(a, {title: "Open on a larger screen", protectiveActions})` plus the read-only record as `K.kv` / `K.list`. No `K.field`, except where the tier note names a short edit.
   - Handoff is `K.handoff` with a `note` only.

Shared rules:
- `canEdit(a)` is `a.role === "instructor" && a.tier === "full"`.
- A TA on web gets the read-only record with the read-only `K.flag` and the line "Editing this course is the instructor's step". A TA gets no field, Save, Publish, Hide, Restore or Preview-as-learner.
- Edit actions are preview-only `K.button`s with `note: "Preview only: nothing changes in this prototype"`. No scenario records an authoring outcome, so there is no committing destination (decision S5-1).
- A blocked action is `K.button({disabled: true, reason, id: P.id(a, …)})`.
- `offline` draws `P.offlineNotice`, `K.saveStatus("savedLocal")` and disabled Save/Publish with the reason "You're offline. Nothing has been published". It never draws the saved status.
- `saving` draws `K.saveStatus("saving")`; `saveFailed` draws `"failed"` with a preview-only "Retry save" on the full tier only; `conflict` draws `"conflict"`.
- Shell: `P.shell(a, {title, body, back?}, {page: <nav page>})`.
- N/A reasons: `P.na(STATES, {…own})`, each ≤ 140 characters, with no kit status or flag words.
- Destinations: `go` links only, built with `P.recordGo` for record pages. Never link W22, W33 or W34.

### Step 2. Pages

In each entry: I = instructor, T = TA (active access). An ended TA always gets the gate notice.

**W35 Course builder** (course-level, nav `W35`)
- States: loading, firstUseEmpty, conflict, offline, permissionUnavailable.
- N/A: `invalid`, "No draft item is waiting, so no publication check has a result to show".
- Figures: course code and title from `sel.course`. Modules come from the A3 list sorted by `position`. Each `item_ids` entry goes through `sel.assessment` for title and kind. Due is `P.when(item.due)`, or `sel.quiz(...).close` for quizzes.
- Kit: `K.section` per module, `K.list`, `K.kv`, `K.saveStatus`, `K.rail` on regular (outline plus an "Inspector" aside for the first module).
- I, web:
  - Links: "Course settings" → `W36`; module title → `W37`; item → `P.recordGo("W40","assessment",id)` or `P.recordGo("W41","assessment",id)`, else plain text; "Files" → `W39`; "Rubrics" → `W43`; "Question bank" → `W42`; "Copy course" → `W59`; "Import or export" → `W60`; "Preview as learner" → `W14`.
  - Buttons (preview-only): "Add module"; "Move up" / "Move down" per module; "Hide from learners" per item.
  - "Publish selected" is disabled with the reason "Nothing is waiting to be published".
- T: outline read-only with links to W37, W40 and W41. No Preview-as-learner, no W42/W59/W60 links, no buttons.
- firstUseEmpty: `K.empty` "No modules yet" with I links to `W37` and `W60`.
- conflict: notice "Another staff member changed this outline", I buttons "Reload current version" / "Compare", Publish disabled with "Reload the current version first".
- Review (iPad and iPhone): outline status as `K.list`. Protective (I): "Hide from learners". T: none. Publish is not drawn.

**W36 Course settings** (course-level, nav `W36`)
- States: loading, saveFailed, offline, permissionUnavailable.
- Figures: `sel.course` code, title, term, section as a read-only kv headed "Managed by your institution"; module titles and dates.
- I, web: `K.field` textarea "Syllabus text" with no value (no syllabus fixture), preview-only "Save draft" and "Publish syllabus revision".
- Links (both roles unless noted): modules → `W37`; "Course calendar" → `W32`; "Builder" → `W35`; I only: "Grading policy" → `W52`, "Syllabus as learners see it" → `W15`.
- T: read-only kv and links to W35, W37 and W32.
- saveFailed: error notice "The syllabus draft was not saved; your text is still on this page" with Retry (I, full).
- Review: read-only kv. No protective actions (the note names read-only content only).

**W37 Module editor** (course-level, nav `W35`, back `W35`)
- Module: `sel.currentModule(view, courseId)`, else the first A3 module, else firstUseEmpty.
- States: loading, firstUseEmpty, invalid, offline, permissionUnavailable.
- Figures: title, `P.when(starts)`, `P.when(ends)`, items.
- I, web: `K.field` title with the record value; items list with "Move up" / "Move down" preview buttons; "Hide from learners" and "Restore earlier version" (preview).
- Links: "Add lesson" → `W38`; items → W40 / W41 via `recordGo`; "Files" → `W39`.
- firstUseEmpty: also drawn truthfully when the module has no items (the `forces` module at `ps4_released`). `K.empty` "This module has no items yet".
- invalid: field error "A module cannot require itself" on a prerequisite select whose options are the other module titles; Save disabled with "Fix the prerequisite first".
- T: read-only kv and items.
- Review: rules and dates as kv. No editor, no move buttons.

**W38 Learning-content editor** (course-level, nav `W35`, back `W37`)
- No lesson fixture exists, so the page draws a new untitled lesson draft in the current module, with the module title from the selector (decision S5-2).
- States: loading, invalid, saving, saveFailed, conflict, offline, permissionUnavailable.
- I, web: `K.field` title; textarea "Lesson text"; checkbox "This image is decorative"; text "Text alternative"; `K.saveStatus`; "Publish lesson" disabled with "Add a title and lesson text first"; link "Insert from Files" → `W39`.
- invalid: error on the text alternative, "Describe the image or mark it decorative"; publish reason "Fix the accessibility issue first".
- conflict: notice with "Compare" and "Reload" (I, full).
- T: `P.permissionNotice(a, "Lesson drafts are open to the instructor only")`. A TA reads published lessons on the learner pages.
- Review: handoff plus "No accessibility issues are recorded for a new draft". No protective actions.

**W39 Files and resources** (course-level, nav `W39`)
- No file fixture exists, so the default view is the empty library (decision S5-3).
- States: loading, firstUseEmpty, saveFailed, offline, permissionUnavailable.
- I, web: `K.empty` "No files in this course yet"; preview-only "Upload files" (same workaround as kit request 1).
- "Attach to coursework" list: `P.assessments(a)` filtered to those with a W40 `recordGo`, linking `W40` and `W40:motion`.
- saveFailed: error notice "The upload did not finish. Nothing was added to the library" with Retry (I, full). No file name or size is drawn.
- T: the empty list and "Only published files are shown to teaching assistants". No upload.
- Review: handoff plus the empty status. No protective actions (there is no failed or processing item to retry).

**W40 Assignment editor** (anchor ps4; variant `motion`; nav `W35`, back `W35`)
- Item: `sel.assessment(view, sel.anchorFor("W40", a.variant).record.id)`.
- States: loading, invalid, saving, saveFailed, conflict, offline, permissionUnavailable.
- Variants: `{motion: WB.manifest.anchors.W40.variants.motion.label}`.
- Figures: title; `opens`, `due`, `close` via `P.when` (omit a missing one); `max`; `max_attempts`; `P.lateRuleText(item)`; `version`; questions (`id`, `max`) when present; rubric via `sel.rubricFor`.
- Receipts panel (I): `sel.receiptsFor(view, item.id, a.who)` grouped by `assessment_version`, drawn as "Version N: x received" (A1).
  - When the count is above zero, the question and points fields are disabled with "Work has been received against version N".
  - Add the line "Received work keeps the late fact from the due time in force when it was accepted" (BD35).
  - Receipts are a read-only kv and never fields.
- I, web: `K.field`s for title, the three dates (type text, the value is the formatted selector string) and attempts; "Save draft", "Hide from learners", "Restore earlier version" (preview).
- Links (I): "Rubric library" → `W43`; rubric → `P.recordGo("W44","rubric",rubric.id)`; "Grading queue" → `P.recordGo("W48","assessment",item.id)` when non-null.
- motion variant: group set name from A3 `group_sets` by `item.group_set_id`; link → `P.recordGo("W47","groupSet",id)`; the line "One submission per group".
- invalid: error on Close, "Close must be after the due time".
- conflict: only on `motion`, "Group membership changed while you were editing" with "Reload" (I). On ps4, the generic "Another staff member changed this assignment".
- T: published settings as a read-only kv. No receipts panel, no fields, no preview.
- Review: dates kv plus the receipts-by-version panel (I). Protective (I): "Hide from learners". T: none.

**W41 Quiz editor** (anchor quiz3; nav `W35`, back `W35`)
- Quiz: `sel.quiz(view, sel.assessment(view, anchorId).quiz_id)`.
- States: loading, invalid, saveFailed, offline, permissionUnavailable.
- Figures: title, `version`, `opens`, `close`, `minutes`, `max_attempts`, `max`. Small label maps for `selection`, `release_rule`, `ai_policy` (unknown value → empty). Items are `id` and a kind label.
- Active attempts: count of `sel.enrolled(view, courseId, "student")` whose `sel.attemptView(view, quiz.id, id)` is active (I only).
  - Above zero (true at `quiz_in_progress` and `late_quiz_start`): warning notice "An attempt is in progress", and question fields and Save disabled with "Wait until the active attempt ends".
- Held results (I): count of `sel.submissionsFor(view, itemId)` with `!released` and a state in `sel.receivedFamily()`.
- BD22 line, always drawn for I: "Questions added from the bank are pinned to the version chosen. A later bank edit does not change this quiz." No version number is typed.
- I, web: fields for the settings; "Answer key" section with the text "Hidden until you choose Show" and a preview-only "Show answer key" (no key data exists).
- Links (I): "Add from question bank" → `W42`; "Allowances" → `W46`.
- invalid: error on an item, "Choose a correct answer for this question"; Save disabled.
- T: settings as a read-only kv (dates, minutes, attempts). No items, no answer-key section, no active or held counts, no W42 link, no preview.
- Review: settings kv plus the active-attempt and held-results lines (I). No protective actions.

**W42 Question bank** (course-level, nav `W42`; iPad and iPhone are handoff)
- States: loading, firstUseEmpty, filteredEmpty, permissionUnavailable.
- T: not-available on every platform (step 1, rule 2).
- I, web: `K.table` "Questions in use".
  - One row per item of every course quiz (the `sel.quiz` of each `P.assessments` quiz). An item is an object or a string; normalise it like `fixtures/staff.js:71`.
  - Columns: Question (id), Type (kind label or blank), Used in (quiz title, linked via `P.recordGo("W41","assessment",…)` or plain text), Version rule ("Pinned").
  - Preview-only "New question" and "Retire question".
  - The BD22 line: "A quiz keeps the version it pinned. Editing a question here makes a new version; quizzes change only when the instructor re-pins."
- firstUseEmpty: `K.empty` "No questions yet". filteredEmpty: the table's `empty` plus a preview-only "Clear filters".
- I, iPad and iPhone: `K.handoff(ctx, {title: "Open on a larger screen", note: "Question authoring needs the web app"})` only. No table.

**W43 Rubric library** (anchor ps4-rubric; nav `W43`)
- Rows: for each `P.assessments(a)` item, `sel.rubricFor(view, item.id, a.who)` when non-null.
  - T: only items where `sel.taTaskAccess(view, item.id, a.who).task` exists.
- States: loading, firstUseEmpty, filteredEmpty, permissionUnavailable.
- Figures: assessment title, `version`, criteria count and points sum (A1).
- Usage (I): "In use" when any enrolled student has a non-null `sel.gradeDraftFor(view, id, item.id, a.who)`, else "Attached" (JW-114).
  - Draw it as `K.badge`. Check that the wording is not a kit status or flag label.
- Row link: `P.recordGo("W44","rubric",rubric.id)`.
- I: preview-only "New rubric" and "Retire" (Retire disabled with "In use by scored work" when in use); link "Preview impact" → `P.recordGo("W50","rubric",id)`.
- T: rows read-only, no usage badge, no buttons.
- Review: list with usage. Protective (I): "Retire", with the same disabled rule, and the impact link.

**W44 Rubric editor** (anchor ps4-rubric; nav `W43`, back `W43`)
- Rubric: the first `P.assessments` item whose `rubricFor(...).id` equals the anchor id. None → `P.permissionNotice`.
- States: loading, invalid, saving, conflict, offline, permissionUnavailable.
- Figures: each criterion's `question_id`, `title`, `max`; total (A1 sum) against `item.max`.
- I, web:
  - A `K.field` text (title) and a `K.field` number (points, help "Whole points") per criterion; "Move up" / "Move down" (preview).
  - In use (same rule as W43): warning notice "Scores already use version N" and a "Preview impact" link → W50 in place of a direct save. The points fields are disabled with "Change points through Preview impact".
  - Links: "Rubric library" → `W43`; "Course home" → `W14`.
- invalid: error "Criteria must add up to <item.max> points".
- conflict: notice plus "Reload" / "Compare" (I, full).
- T: criteria as a read-only kv. Allowed only when the TA has a task for that assessment, else `P.unallocatedNotice`. No propose control (authoring is off; DD-5.15 stays open).
- Review: read-only criteria, the in-use notice, and "Preview impact" as a link. No fields.

**W45 Course people and staff permission** (anchor person:maya; nav `W45`)
- TA record: `taId = sel.anchorFor("W45").record.id`, `taWho = sel.viewerFor(view, "ta")`. Use `taWho` only when `taWho.personId === taId`.
- States: loading, firstUseEmpty, destructive, offline, permissionUnavailable.
- I figures:
  - Roster: `sel.enrolled(view, courseId, role)` for the three roles, names via `P.personName`.
  - Maya's grading task via `sel.gradingTaskFor(view, taId)`: assessment title; `P.when(task.grading_due)`; end from `sel.accessEnd(view, taId, courseId)`.
  - Scope from `sel.taScope(view, task.assessment_id, taWho)`: learner names and `P.questionsText(scope.questionIds)`.
  - When the scope is null (access ended, for example at `ta_expired`): "Access ended <end>" and no scope lists.
  - Never write the banned `question_ids` text in the file.
- I, web:
  - Preview-only "Invite staff" and "Change end date".
  - "Revoke access" opens the dialog: `K.button({act: "open-dialog", target: P.id(a, "revoke")})`.
  - Dialog: `K.dialog(ctx, {id, kind: "destructive", title: "Revoke grading access", body, actions: [{label: "Revoke access", id, note}]})`. The body names the TA, the assessment and the end time, and says "Marks already saved stay. Nothing is released."
  - Link "Grading plan" → `P.recordGo("W57","task",task.id)`.
  - Pending invitations: `K.empty` "No pending invitations".
- destructive: the same view with the dialog `open: true` (I only; T gets the T view).
- firstUseEmpty: "Roster delayed", `K.empty` "The roster has not arrived yet", no names.
- T (active): own scope only (assessment, end date, assigned learner names from `taScope`, questions text), the read-only flag, and the line "Only the instructor changes staff access". No Carmen, no other roster rows, no invite or revoke, no dialog (DD-5.09).
- Review (I): Maya's scope kv. Protective actions: "Revoke access" (the dialog opener; the dialog is drawn on these tiers too), "Change end date" (preview), plus the pending-invites empty line. T: own scope and the handoff, no actions.

**W46 Learner allowances** (anchor allowance:aisha-quiz3; nav `W46`)
- Record: `quizId = sel.anchorFor("W41").record.id`, `learner = P.learnerId(a)`, `al = sel.allowanceFor(view, quizId, learner)`. It counts only when `al.id` equals the W46 anchor id; otherwise draw the firstUseEmpty view.
- States: loading, firstUseEmpty, invalid, destructive, offline, permissionUnavailable.
- I figures: learner name; quiz title; `sel.quiz(...).minutes`; `al.extra_minutes`; `sel.effectiveMinutes`; `P.when(sel.lateStartThreshold(...))`; `P.when(quiz.close)`; recorded by `P.personName(al.recorded_by)`; `al.note`; and a row labelled "Basis reference (instructor only)" with `al.basis_reference_instructor_only` (DD-5.10).
- I, web: preview-only "Replace allowance"; "End allowance" as a destructive dialog opener (same pattern as W45, body "Attempts already received keep their timing").
  - Pending requests: `K.empty` "No pending requests" and the line "A request changes nothing until the instructor decides it" (BD32).
  - Link: quiz → `P.recordGo("W41","assessment",quizId)`.
- invalid: field error "Use extra minutes or a multiplier, not both"; Save disabled.
- T: when `P.taUnallocated(a, quizId)` or the learner is not in `taScope.learnerIds`, a notice "This learner's timing is outside your grading tasks" (true for Maya in the fixture).
  - Otherwise only "Effective time: <effectiveMinutes> minutes". No basis, note, recorder or buttons.
- Review (I): the active allowance kv. Protective: "End allowance" (dialog opener) and the pending-request empty line.

**W59 Course copy and rollover** (course-level, nav `W59`)
- States: loading, invalid, saveFailed, permissionUnavailable.
- T: not-available on every platform.
- I, web:
  - Source kv from `sel.course`.
  - "Copied" list with A1 counts: modules (A3 length), coursework (`P.assessments` length), rubrics (count of non-null `rubricFor`).
  - "Not copied" `K.list` in full (BD21): announcements; discussion posts and replies; people, staff access and grading tasks; submissions and receipts; marks, feedback and released results; allowances and requests; group membership; activity and read markers.
  - Date map `K.table`: one row per assessment with the current due (`P.when`, or the quiz close) and a "New date" column reading "Not set".
  - A disabled `K.field` checkbox "I have checked what is and is not copied" with the reason "Choose a destination term first".
  - "Create draft copy" disabled with the same reason (there is no destination fixture; decision S5-4).
  - Links: "Import a package instead" → `W60`; "Builder" → `W35`.
- invalid: error notice "Choose at least one module to copy".
- saveFailed: error notice "The copy did not finish. No draft course was created" with Retry (full).
- Review (I): handoff plus `K.empty` "No copy has been started", and the not-copied list read-only. No protective actions.

**W60 Content import/export preview** (course-level, nav `W60`; iPad and iPhone are handoff)
- States: loading, invalid (required), saveFailed, permissionUnavailable.
- T: not-available on every platform.
- I, web:
  - `K.segmented` Import / Export.
  - Preview-only "Choose package" and "Export course content".
  - The line "Only course content moves: no people, submissions, marks or keys".
  - `K.empty` "No import or export has run".
  - Link "Builder" → `W35`.
- invalid: `var s = sel.failureSample(view, "import-unsupported-type", a.who)`.
  - Error notice "This file type cannot be imported".
  - Body: `s && s.file` gives the name and `sel.fmtBytes(s.file.bytes)`; otherwise "Choose a Whiteboard course package." with no figure.
  - "Start import" disabled with "Choose a supported package first".
- saveFailed: "The import stopped. Nothing was added to the course" with Retry.
- I, iPad and iPhone: `K.handoff` with `note: "No import or export has run in this course"` only.

### Step 3. Tests: `tools/seg5-authoring.test.mjs` (≤ 800 lines)

Import from `./spine_helpers.mjs`. `SEG = WB.manifest.pages.filter(p => p.segment === 5).map(p => p.id)`; if the field has a different name, use the literal 14 ids. Expected values come from `S.*`, never typed.

1. **Structure.** 14 ids; none is a placeholder; N/A reasons are ≤ 140 characters; W60 states include `invalid`; W40 declares `motion`.
2. **Render matrix.** Every page × `CTX5` × role × `tokensOf` at `default`, plus the default view × every scenario × `CTX3`. `problems` is empty; no "Not built yet"; main ids start with `t-`.
3. **Tiers.** W42 and W60 on iPad and iPhone contain `wb-handoff--handoff` and no `<table`, `<input` or `<textarea`. The 12 review pages on iPhone contain no `<textarea`. W45 iPhone as I has the revoke opener; W46 iPhone as I has the end-allowance opener.
4. **Role blocks.** `frame({page, role: "student"})` and guest are `blocked` for all 14.
5. **TA authority.**
   - Active TA on every page and platform: no "Preview as learner", "Publish", "Save draft", "Hide from learners", "Revoke" or "Invite"; no `data-act="open-dialog"`; `goPages` excludes W42, W59, W60, W22, W33, W34.
   - W42, W59, W60 as TA show the permission title on all tokens.
   - `ta_expired`: every page shows "Your grading access for this course has ended" and none of the student names, on `CTX3`.
   - W45 as TA: no Carmen name; contains Aisha and Ben.
   - W46 as TA: never contains `al.basis_reference_instructor_only` or `al.note`. With `direct("W46", {role: "ta", data})`, where `data` is `copy(WB.data)` plus a quiz3 grading task for Maya, it contains `String(S.effectiveMinutes(...))` and still no basis.
   - W41 as TA: no "Answer key".
6. **Instructor truths.**
   - W46 shows the basis, extra minutes and effective minutes.
   - W45 shows `when(S.accessEnd(...))`; at `ta_expired` it shows "Access ended" and no question list.
   - W40 shows `when(item.due)` and the receipt count, with no input whose value is a receipt id. W40:motion links W47.
   - W41 at `quiz_in_progress` has the active-attempt notice and a disabled Save; at `default` it does not.
   - W41 and W42 contain "pinned".
   - W59 contains "Announcements" inside the not-copied list and not in the copied list, and "Create draft copy" is disabled.
   - W35 Publish is disabled.
   - Offline tokens never contain the saved-status text without "locally".
   - W45 and W46 `destructive` tokens report `openDialogs` of length 1 for I and 0 for T.
7. **Journeys.**
   - Every step of J04, J05, J07, J08, J10, J11 and J12 whose page is in SEG renders cleanly with its role, scenario and token.
   - Next-step links (I, `CTX3`): W35→W36, W36→W37, W37→W38, W38→W39, W39→W40, W40→W43, W43→W44, W44→W14, W41→W42, W45→W57, W59→W60, W60→W35, W36→W32.
   - On W42 and W60, assert the link on web only; the handoff tier draws none.
   - No link is asserted for W42→W25, W46→W19 or W40→W33: the next step is a student page, and staff never link W33.

Follow TDD: write the test file first, then the pages. The coordinator adds the import to `tools/index.js`.

### Step 4. Notes and requests

**`pages/seg5-authoring/NOTES.md`**
- Decisions S5-1 to S5-4, plus S5-5 (an ended TA gets the notice only on all 14 pages) and S5-6 (a TA is denied W38 drafts).
- Assumptions A3 and A4.
- The drawn-states table.
- Each decision is marked "chosen by Claude under owner delegation". Source checks only.

**`kit_requests.md`, appended under `## seg5-authoring`** (missing / why / proposed / workaround, kept short)
1. Sample `import-unsupported-type` in `fixtures/samples.js` (`file{name,bytes,kind}`, audience instructor).
2. Fixtures: course files; lesson content; syllabus, settings and AI ceiling; question bank with versions and pins; invitations; allowance requests; copy/import log; a draft or unpublished item and a publish-result scenario.
3. Selectors: `sel.modulesFor(view, courseId, who)`, `sel.groupSet(view, id)`, `sel.rubricById`.
4. Coordinator: relax `tools/spine.test.mjs:29-31`; add `./seg5-authoring.test.mjs` to `tools/index.js`; tracker rows (same as request 6).
5. Kit: date-time field type (W40 uses text).

### 4. Acceptance criteria

- 14 files exist and are named exactly `<ID>.js`. Each is ≤ 300 lines. The combined size is ≤ 75 KB.
- Page files contain no `style=`, no `console.`, no typed date, percentage, score, or person, course or receipt id, and no banned data access.
- Every page covers all 16 states (drawn plus N/A). W60 draws `invalid`. W40 declares `motion`.
- Off web, W42 and W60 draw a handoff only. The other 12 draw the handoff plus the read-only record and the listed protective actions, and no editor.
- Web as instructor draws no `K.handoff`.
- A TA never gets edit, publish, hide, revoke, invite or preview-as-learner controls. A TA is denied on W42, W59 and W60. A TA sees no allowance basis, no Carmen on W45 and no answer-key section.
- An ended TA sees only the ended notice.
- The W59 not-copied list includes announcements and posts. W41 and W42 state that bank questions are pinned.
- Publish and copy are drawn disabled with a reason, because nothing publishable exists.
- No link goes to W22, W33 or W34.
- Unchanged: `shared.js`, `kit/`, `fixtures/`, `manifest/`, `system/`, `spec/`, `tracker/`, `viewer/`, `decisions.md`, the root `NOTES.md`, `inputs.lock.json`, other segments' folders, and the existing tests.
- No commit is made.

### 5. Proof commands (from the repo root)

```bash
node --test design/final/tools/seg5-authoring.test.mjs
bash -c 'node design/final/tools/check_render.mjs && node design/final/tools/check_vocab.mjs && node design/final/tools/check_lines.mjs'
bash -c 'cat design/final/pages/seg5-authoring/W*.js | wc -c'   # must print <= 76800
bash -c '! grep -nE "style=|console\.|20[0-9]{2}-|[0-9]%|aisha|maya|phys110|AH-PHYS" design/final/pages/seg5-authoring/*.js'
bash -o pipefail -c 'node --test design/final/tools/*.test.mjs 2>&1 | tail -n 15'
node design/final/tools/check_all.mjs
bash design/final/tools/legacy_check.sh
bash -c 'node design/final/build.mjs && node design/final/tools/check_size.mjs && node design/final/tools/check_offline.mjs'
```

The full `*.test.mjs` run and `check_all` pass only after the coordinator relaxes `spine.test.mjs:29-31`. Until then that single "structure" test is the only expected failure.

### 6. Out of scope / risks

- **Not done here:** edits to fixtures, kit, manifest, tracker, `tools/index.js` or the spine tests; browser, device or accessibility acceptance; commits.
- **Thin fixtures.** W38, W39, W42, W59 and W60 draw truthful empty or new-draft views instead of rich records. Richer drawings depend on request 2.
- **Size.** 14 pages at 5.4 KB is close to the 75 KB share. If over, trim W38 and W39 first, then drop the optional W35 inspector rail.
- **Label collision.** The "In use" / "Attached" badges and "Pinned" must not equal a kit status or flag label; `check_vocab` will fail if they do. Reword if so.
- **Flag key.** `K.flag` throws on an unknown key. Verify the read-only key in `kit/core.js`.
- **Dialog ids.** Each dialog action needs an `id`, and the review-tier dialog must still be returned through the shell `dialog` option.
- **A3 raw reads.** The `modules` and `group_sets` reads are a recorded assumption. A reviewer may prefer selectors (request 3).
---

## Segment: Plan: Phase 3 segment `seg6-grading` (W50, W52, W54, W57, W58) and `optional` (O01, O02, O03)

### 1. Goal

Replace the eight placeholders with real page files that follow `PAGES.md` and `SPINE.md`, plus one test file. No fixture exists for a rubric candidate, the policy projection, review requests, attendance, awards or the assistant, so each page draws the truthful "record absent" view from existing selectors and records the gap as a kit request.

### 2. Context (verified)

**Folders and tiers**
- `design/final/tools/load_site.mjs:19-24`: `folderFor` puts `O*` ids in `optional` and W50/W52/W54/W57/W58 (segment 6, `page_meta.mjs:15`) in `seg6-grading`.
- `load_site.mjs:56`: `.md` files in a segment folder are ignored, so `pages/seg6-grading/NOTES.md` is allowed.
- `manifest/pages.js:70-83` gives roles and tiers (web / iPad / iPhone):

| Page | Roles | Tiers |
|---|---|---|
| W50, W52, W54, W58 | instructor, ta | full / review / review |
| W57 | instructor, ta | full / full / review |
| O01, O03 | student | full / full / full |
| O02 | instructor, ta | full / handoff / handoff |

- None of the five W pages has a `PROTECTIVE_NOTES` entry (`page_meta.mjs:52-67`), so `DEFAULT_REVIEW_NOTE` applies.

**Anchors and journeys**
- `manifest/anchors.js:44-47`: W50 → `rubric:ps4-rubric`, W52 → `policy:phys110-policy`, W57 → `task:task-maya-ps4`, all home `default`, no variants. W54, W58 and O01–O03 have no anchor (course-level).
- `manifest/journeys.js:36-47`, all at scenario `default`: J03 W49→W50→W51; J06 W52→W51 and W54→W53; J08 W57→W05; J11 W58→W54. The steps on these pages are instructor steps.

**Required failure state**
- `fixtures/scenarios.js:145`: only `weights-not-100` → `invalid` on W52.
- `fixtures/samples.js:15-28` has no record for it, so `failureSample(view, "weights-not-100", who)` returns null for everyone.
- `PAGES.md:59`: the `ta-expired` state (`permissionUnavailable`) applies to every TA page that draws learner data, so W50, W52, W54, W57 and W58 draw it.

**Selectors (signatures checked)**
- `fixtures/grades.js`:
  - `courseTotal(view, courseId, personId, who, opts)` → `{value, display, representedWeight, empty}`; null for a TA.
  - `categoryPercent(view, courseId, personId, catId, who, opts)`.
  - `gradebook(view, courseId, who)` → `{items: [{id, title, category, max}], rows}`; a TA gets task items only.
  - `gradeRows`, `resultFor(view, personId, itemId, who)`, `gradeDraftFor(view, personId, assessmentId, who)`.
  - `releaseReady(view, assessmentId, who)`, `releasePreview(view, courseId, personId, itemId, who)` (`.inputs.policy.version`), `releasesFor(view, itemId, who)`: all null for a TA.
- `fixtures/staff.js`:
  - `gradingTaskFor(view, taId, assessmentId)`: raw and unscoped.
  - `taTaskAccess`, `taScope(view, assessmentId, who)` → `{learnerIds, questionIds, allQuestions}`.
  - `accessEnd`, `taAccessActive`, `reviewProgress`, `receivedProgress`, `canRelease`.
- `fixtures/coursework.js`: `rubricFor(view, assessmentId, who)`, `receiptsFor(view, assessmentId, who)`, `submissionsFor(view, assessmentId)`, `assessment`.
- `fixtures/world.js:125`: `enrolled(view, courseId, role)`.
- `sel.pct`, `fmtDateTime`, `isBefore`.

**Data that no selector exposes**
- `tools/check_vocab.mjs:165` bans `.data.grades`, `.data.staff`, `question_ids`, `.pending`, `.releases`, `.drafts` in page files.
- Not reachable from a page: policy weights, mode, method, treatment rules, rounding and letter boundaries (the policy record has no boundaries at all, `grades.js:25-34`); a task's question split for an instructor.
- No fixture exists for a rubric candidate version, manual overrides, review requests, attendance or sessions, awards or criteria, or an assistant or AI-policy flag (grep of `fixtures/`).

**Quiz 2 (decision 6.04)**
- Released snapshot `rel-quiz2-1` (`grades.js:82`).
- Receipt `AH-PHYS110-Q2-001`, which is the `W27:quiz2` anchor (`anchors.js:27`).
- Maya has no Quiz 2 task (`staff.js:16-21`).

**Helpers and kit**
- `pages/shared.js` `WB.P`: `na`, `id`, `shell`, `staffGate`, `taEnded`, `taUnallocated`, `taEndedNotice`, `unallocatedNotice`, `permissionNotice`, `handoff`, `bareHandoff`, `recordGo`, `receiptById`, `assessments`, `learnerId`, `personName`, `when`, `score`, `loading`, `offlineNotice`, `links`, `stack`, `p`.
- Kit: `K.table(ctx, {id, caption, empty, columns: [{key, label}], rows})`, `K.kv`, `K.figure({label, value, basis})`, `K.stat`, `K.notice`, `K.empty`, `K.list`, `K.section`, `K.rail`, `K.grid`, `K.field` (`disabled` needs `reason`), `K.button`, `K.handoff` (throws on full; `protectiveActions` only on review), `K.flag`, `K.status`, `K.saveStatus`, `K.disclosure`.
- Test helpers in `tools/spine_helpers.mjs`: `frame`, `direct`, `CTX5`, `CTX3`, `tokensOf`, `rolesOf`, `goPages`, `goLinks`, `rowsWith`, `disabledWith`, `idsInMain`, `copy`.

**Decisions**
- `tracker/fix_tracker.csv`: BD16 (2.11: instructor sets grading deadlines; TA read-only), BD19 (3.10: letter only from W52), BD23 and BD33 (6.01: TA read-only calculation; fictional "Example learner"; no named learner's total to a TA), BD24 and BD36 (6.04: Quiz 2; W27 and W23 are the entries to W54).

**Blocker for the coordinator (not this builder)**
- `tools/spine.test.mjs:29-33` asserts every non-spine page is still a placeholder. It fails as soon as any Phase 3 page lands, for every segment.
- The coordinator must relax it to "spine pages are not placeholders".
- The builder does not edit that file and reports this as the one expected failure in the full suite.

**Assumptions**
- A1: the `SPINE.md` A1 rule holds (a count derived from selector-returned records counts as selector-derived).
- A2: category display names (`assignments` → "Assignments" and so on) may be a label map in page code, with the raw id as fallback; they are labels, not figures.
- A3: frozen W49 has no link to W50 (grep found none), so the J03 W49→W50 hop is a coordinator item, not built here.

### 3. Changes

Conventions for every file:
- IIFE plus `"use strict"`, `var P = WB.P`, ids through `P.id(a, …)`, return through `P.shell(a, out, {page: "<ID>"})`.
- `na: P.na(STATES, {...own reasons ≤ 140 chars})`.
- No typed figure, date or id; no `style=`; no kit status words in quotes.
- Target ≤ 220 lines and ≤ 9 KB per W page; ≤ 120 lines per O page.
- Authority branches run before state branches. Preview-only buttons carry a `note`.
- Copy the `K.table` row shape from `seg6-grading/W51.js`.

### Step 1: `pages/seg6-grading/W50.js` (rubric-change impact preview)

- **Anchor and home:** rubric id from `sel.anchorFor("W50").record.id`. The assessment is the entry in `P.assessments(a)` whose `rubric_id` equals it. Home `default`.
- **Roles:** instructor, ta.
- **States drawn:** `loading`, `conflict` (stale preview), `offline`, `permissionUnavailable`.
- **N/A reasons:**
  - `invalid`, `saving`, `saveFailed`: "Fields stay locked until a candidate rubric version exists".
  - `success`, `partialSuccess`: "No candidate version exists, so nothing can be applied from this page".
  - `firstUseEmpty`: "With no candidate version the page says so in place".
  - Others: `P.na` defaults.
- **Authority branches, in order:**
  1. `P.staffGate(a, itemId)` covers ended access, `permissionUnavailable` and an unallocated TA.
  2. Active TA.
  3. Instructor.
- **Instructor, web (full):** `K.rail` with these parts.
  - *Rule comparison:* `K.table` of `rubricFor(...).criteria` (question, title, max) with the caption "Current version" plus `rubric.version`. Below it, `K.empty` "No candidate version saved" with link "Edit rubric" → `P.recordGo("W44", "rubric", id)`.
  - *Impact:*
    - One row per `releaseReady` included row: name, `gradeDraftFor(...).total` through `P.score`, and "Held: would be recalculated". Link "Open in grader" → `P.recordGo("W49", "receipt", receipt.id)` when non-null.
    - One row per not-included row: "Not scored yet: nothing to recalculate".
    - *Released, excluded:* every `releasesFor(view, itemId, who)` snapshot, with version, `P.when(released_at)` and names, and the text "Immutable: not changed by a rubric change". Link "Grade review requests" → `W54`.
  - *Decision (rail):* `K.field` select "Application mode", disabled with reason "No candidate version to apply". `K.button` "Apply reviewed change", `disabled: true`, same reason. `K.button` "Refresh impact", preview-only. No dialog is drawn, because no scenario holds an applied candidate (committing-action rule).
  - *Links:* W51 "Gradebook" (J03), W43 "Rubric library".
- **`conflict`:** error notice "The impact preview is out of date" with body "What changed is not drawn: there is no sample record". Apply stays disabled with reason "Refresh the impact first".
- **`offline`:** `P.offlineNotice` plus `K.flag("lastKnown")`; Refresh disabled.
- **TA (active, in task):**
  - Criteria table limited to `taScope.questionIds`.
  - `reviewProgress` line.
  - "Submit proposal" disabled ("No candidate version to propose").
  - Line "Applying a rubric change is the instructor's step".
  - No impact table, no released list, no totals. Link W48.
- **Review tier (iPad, iPhone):**
  - `P.handoff(a, {title: "Open on a larger screen", protectiveActions})`.
  - Read-only criteria and impact lists as `K.list`. No Apply and no fields.
  - Protective action: instructor "Hold recalculation for this rubric" (preview-only); TA "Flag for instructor review".

### Step 2: `pages/seg6-grading/W52.js` (grading policy setup; decisions 3.10, 6.01)

- **Anchor and home:** policy, `default`. `courseId = a.who.courseId`. The named example learner is `P.learnerId(a)`.
- **States drawn:** `invalid` (required), `loading`, `conflict` (stale preview), `offline`, `permissionUnavailable`.
- **N/A reasons:**
  - `saving`, `saveFailed`: "Weights cannot be edited in this prototype, so nothing is saved".
  - `firstUseEmpty`: "The course already has an applied policy version".
  - `success`: "No working change exists to apply".
- **Authority branches:**
  1. `P.staffGate(a, null)` (course-level: ended access and `permissionUnavailable`).
  2. Active TA.
  3. Instructor; when `gradebook(...)` is null, draw `P.permissionNotice`.
- **Instructor, web:**
  - *Policy source:* `K.kv` with "Policy version" from `releasePreview(view, courseId, learnerId, itemId, who).inputs.policy.version`. Drawn only when `inputs` is non-null, with `itemId` taken from the first `releaseReady` included row of any `P.assessments` item; otherwise the row is omitted.
  - *Categories:* `K.table` grouped from `gradebook(...).items`: category label, mapped assessments (titles), points possible (sum of `max`, A1). The weight column cell reads "Not drawn: see kit request".
  - *Preview*, in `K.grid`:
    - `K.figure` "Working total" = `courseTotal(view, courseId, learnerId, who).display`, basis "Released and held results".
    - `K.figure` "Released total" = `courseTotal(..., {as: "learner"}).display`, basis "Released results only".
    - `K.stat` "Represented weight" = `representedWeight`.
    - Per-category `K.kv` of `sel.pct(categoryPercent(...))`, staff and learner.
    - A null `display` draws "No calculable grade", never zero.
    - Caption names the learner through `P.personName`.
  - *Letter grade (3.10):* a section stating "This policy sets no letter boundaries, so no page shows a letter grade". No letter anywhere.
  - *Actions:*
    - "Apply policy version" disabled, reason "There is no working change to apply".
    - "Preview calculation" preview-only.
    - "Edit weights" preview-only, with a note.
  - *Links:* W51 "Gradebook" (J06), W53 through `P.recordGo("W53", "assessment", itemId)` when non-null, W36.
- **`invalid`:** error notice "Category weights do not add up to the whole course" with body "The entered weights are not drawn: there is no sample record". Apply disabled, reason "Fix the category weights first". Do not call `failureSample` and do not draw a permission notice to the instructor.
- **`conflict`:** "The calculation preview is out of date"; Apply disabled "Recompute the preview first".
- **TA (BD23, BD33):**
  - Notice "Read-only: the instructor sets the grading policy".
  - Mapping table from the TA's own `gradebook` items (task items only).
  - Line "A worked example for an example learner is not drawn yet".
  - No totals, no category percents, no named learner, no Apply, Preview or Edit, whatever the token. Link W51.
- **Review tier:**
  - Handoff plus read-only mapping; totals for the instructor only.
  - Protective action, instructor: "Keep the current policy version"; TA: none.

### Step 3: `pages/seg6-grading/W54.js` (grade correction and regrade review; decision 6.04)

- **Record:**
  - Receipt id from `sel.anchorFor("W27", "quiz2").record.id`.
  - `receipt = P.receiptById(a, id)`; `itemId = receipt.assessment_id`; learner = `receipt.owner_id`.
  - Course-level page, home `default`.
- **States drawn:** `loading`, `offline`, `permissionUnavailable`, `firstUseEmpty` (no request on record; also the default view).
- **N/A reasons:**
  - `invalid`, `saving`, `saveFailed`, `conflict`: "No review request is on record, so no decision can be typed or saved".
  - `success`: "No decision can be recorded without a request".
- **Authority branches:**
  1. `P.taEnded` → `P.taEndedNotice`.
  2. `permissionUnavailable` → `P.permissionNotice`.
  3. A TA with a null receipt (no Quiz 2 task) → `P.unallocatedNotice`, plus the line "Only the instructor decides a correction". No learner name, score or receipt.
  4. Instructor.
  - A bare handoff goes on non-full tiers.
- **Instructor, web:** `K.rail`.
  - *Request:* `K.empty` "No review request is on record at this point", with body "A request starts from released feedback" and links `W27:quiz2` and `W23`.
  - *Evidence* (the released snapshot a request would concern), as `K.kv`:
    - Learner.
    - Assessment title.
    - Receipt id.
    - Snapshot "Version" plus `P.when(released_at)` from the last `releasesFor(view, itemId, who)` entry.
    - Released score `P.score(res.score, res.max)` and comment from `resultFor(view, learner, itemId, who)`.
    - Line "Earlier versions stay on record" listing all versions.
    - When `resultFor` gives status null: notice "Feedback for this work has not been released, so no review can be requested".
  - *Decision (rail), all `K.button` disabled with reason "There is no open request":* "Start review", "Request typed clarification", "Save correction as held", "Decline with reason".
  - "Release approved correction" disabled, reason "No completed held correction".
  - Text "A correction stays held until it is released separately".
  - *Links:* "Release feedback: " plus the W53 anchor assessment title (`sel.assessment(view, sel.anchorFor("W53").record.id).title`) → `W53`. This is J06; the label names the record it opens, so it is record-true. Also W51 and W48.
- **Review tier:**
  - Handoff plus read-only evidence `K.kv`.
  - Protective action, instructor: "Keep the current result as released" (preview-only).

### Step 4: `pages/seg6-grading/W57.js` (allocation and deadline planner; decision 2.11)

- **Anchor and home:** task id from `sel.anchorFor("W57").record.id`, `default`.
- **Task lookup:**
  - Instructor: for each `enrolled(view, courseId, "ta")` × `P.assessments(a)`, call `gradingTaskFor(view, taId, item.id)` and keep non-null results.
  - TA: `taTaskAccess(view, item.id, a.who).task` per item.
  - Never read the banned question field.
- **States drawn:** `loading`, `invalid`, `offline`, `permissionUnavailable`, `firstUseEmpty` (no tasks).
- **N/A reasons:**
  - `conflict`: "Each learner and question has one grader in this plan, so no overlap is drawn".
  - `saving`, `saveFailed`, `success`: "The plan is not editable beyond preview in this prototype".
- **Authority branches:**
  1. `P.staffGate(a, null)`. A TA with ended access gets the notice only, with no learner names.
  2. Active TA (own tasks only).
  3. Instructor.
- **Instructor, web and iPad (full, no handoff):**
  - *Assessment plan:* per task, title, `receivedProgress` ("x of y received") and `reviewProgress`.
  - *Allocation:* `K.table` with TA name; learners (`task.learner_ids` → names); questions as the assessment's question list from `rubricFor(...).criteria`, with the note "Per-TA question split is not drawn"; access end `P.when(task.access_end)`.
  - *Timeline,* as `K.kv` with separate labels: "Grading due (staff)" `P.when(task.grading_due)`; "Student due" and "Student close" from `sel.assessment`; "TA access ends".
    - Derived check through `sel.isBefore(task.access_end, task.grading_due)`: when true, a warning notice with both dates and Apply disabled "Access ends before grading is due".
    - Otherwise the line "Access covers the grading due time".
  - *Controls:*
    - `K.field` date "Grading due", instructor only, with no typed value.
    - "Preview allocation" and "Reassign incomplete work" preview-only.
    - "Apply plan" disabled "There is no change to apply".
    - Text "A release target is a plan only; nothing is released automatically".
  - *Links:* "Home" → `W05` (J08), W48, W07, staff scope → `P.recordGo("W45", "person", task.ta_id)`.
- **`invalid`:** field error "Enter a grading due time" on the date field; Apply disabled "Fix the grading due time first". No dates are invented.
- **TA (active):**
  - `K.kv` of the own task: assessment, learners (`taScope.learnerIds` names), `P.questionsText(taScope.questionIds)`, grading due, access end.
  - Line "The instructor sets grading deadlines".
  - Link "Open my task" → `P.recordGo("W48", "assessment", itemId)`.
  - No other TA, no editing, no Apply.
- **iPhone (review):**
  - Handoff plus read-only task cards.
  - Protective action, instructor: "Flag this task for follow-up"; TA: "Flag for instructor review".

### Step 5: `pages/seg6-grading/W58.js` (course insights and attendance)

- **Home:** course-level, `default`.
- **States drawn:** `loading`, `offline` (source delayed: `K.flag("lastKnown")`), `permissionUnavailable`, `firstUseEmpty` (attendance never entered; also drawn in the default view's attendance region), `filteredEmpty`.
- **N/A reasons:**
  - `invalid`, `saving`, `saveFailed`, `conflict`: "No attendance entry exists to correct".
- **Authority branches:**
  1. `P.staffGate(a, null)`.
  2. Active TA.
  3. Instructor.
- **Instructor, web:**
  - *Submission facts:* `K.table`, one row per `P.assessments(a)` item with:
    - `receivedProgress` (received of expected);
    - missing count and excused count (counts of `submissionsFor(view, item.id)` by `state`, A1), with excused labelled "left out of the missing count";
    - a kit status through `P.status` where useful.
    - Row link → `P.recordGo("W48", "assessment", item.id)` or plain text.
  - *Attendance:* `K.empty` "No attendance has been recorded", body "A session with no entry is not recorded. It is never counted as absent". "Record attendance" and "Correct attendance" are preview-only or disabled ("No entry to correct").
  - Text "No risk scores or predictions are shown".
  - *Links:* "Grade review requests" → `W54` (J11), W46, W48, W32.
- **TA:**
  - Facts only for items where `taScope` is non-null, counting only `scope.learnerIds`.
  - Notice "Attendance is not in your course role. A grading task does not grant it".
  - No course-wide counts.
- **Review tier:**
  - Handoff plus read-only facts list.
  - Protective action, instructor: "Flag a fact for review"; TA: none.

### Step 6: `pages/optional/O01.js`, `O02.js`, `O03.js` (off by default)

All three draw the default view as "feature off". No fixture says a course opted in, so no award, criterion, answer or citation is drawn, ever. Each declares one presentation variant, `enabled` ("Layout when enabled, with no records"), which shows the regions as truthful empties.

- **O01 (student; full on all platforms).**
  - States: `loading`, `permissionUnavailable`, `firstUseEmpty`.
  - Default view:
    - Info notice "Achievements are an optional proposal and are off for this course".
    - Text "Recognition is separate from grades".
    - Link W14.
  - `enabled` variant:
    - `K.segmented` filter (Earned / Available / All).
    - `K.empty` "No award criteria are published".
    - Sharing shown as a disabled `K.field` select, reason "Private course view only".
    - "Ask for correction" disabled "You have no award to correct".
  - Not enrolled (`courseShell` null) → `P.permissionNotice`.
  - No peers, ranking or points.
- **O02 (instructor, ta; web full, iPad and iPhone handoff).**
  - States: `loading`, `permissionUnavailable`, `invalid` (`enabled` variant only: a criterion may not use held grades).
  - Handoff tiers: `K.handoff(ctx, {title: "Open on a larger screen", lastResult: P.p("Achievements are off for this course")})`. No controls and no protective actions.
  - Web, instructor:
    - `K.field` checkbox "Enable achievements", unchecked and disabled, reason "Needs a future product decision".
    - Definition and criteria fields disabled with the same reason.
    - "Issue reviewed awards" disabled.
  - Web, TA:
    - Notice "A teaching assistant cannot enable, issue or revoke awards".
    - No fields.
    - Ended access → `P.taEndedNotice`.
- **O03 (student; full on all platforms).**
  - States: `loading`, `offline` ("The assistant is unavailable. Nothing was sent"), `permissionUnavailable`, `firstUseEmpty`.
  - Default view:
    - Notice "The course assistant is an optional proposal and is off".
    - Text "It runs no AI service in this prototype".
  - `enabled` variant:
    - `K.field` textarea "Question", disabled with reason "Simulated answers are not drawn in this prototype".
    - `K.empty` "No questions asked".
    - "Clear context" disabled "Nothing to clear".
  - Links: "Ask in course discussion" → W30, W12, W14. No answer, citation or W17 link is fabricated.

### Step 7: Notes and requests

- **Create `design/final/pages/seg6-grading/NOTES.md`:** the drawn-states table, the decisions above marked "chosen by Claude under owner delegation", and assumptions A1–A3.
- **Append `## seg6-grading` and `## optional` to `design/final/kit_requests.md`.** Each entry gives page, missing, why, proposed API and workaround:

| # | Page | Request |
|---|---|---|
| 1 | W52 | `sel.gradingPolicy(view, courseId, who)`: mode, method, weights, treatment rules, rounding, version; instructor full, TA read-only. Plus a `weights-not-100` failure sample, a letter-boundary table (or its confirmed absence), and a fictional "Example learner" record (BD33). |
| 2 | W50 | Rubric candidate version and manual-override records; a `rubric-preview-stale` sample. |
| 3 | W54 | `grades.review_requests` (Quiz 2, Aisha, `rel-quiz2-1`) and `sel.reviewRequestsFor(view, courseId, who)`; a held-correction scenario so "Record decision" can be a committing action. |
| 4 | W57 | `sel.gradingPlan(view, courseId, who)` with the per-TA question split; an access/deadline conflict sample. |
| 5 | W58 | Attendance and session records and a TA attendance grant. |
| 6 | O01–O03 | Course feature flags, award and criteria records, a simulated FAQ answer with citations. |
| 7 | Coordinator | Relax `spine.test.mjs:29-33`; add the W49→W50 link (frozen spine page); add `import("./seg6-grading.test.mjs")` to `tools/index.js`; tracker rows for 24 targets. |

### Step 8: Tests in `design/final/tools/seg6-grading.test.mjs`

Split into `seg6-grading-2.test.mjs` if it passes 800 lines. Import from `./spine_helpers.mjs`. Every expected value is read from `S`, never typed. `PAGES = ["W50", "W52", "W54", "W57", "W58", "O01", "O02", "O03"]`.

1. **Structure.** None of `PAGES` is a placeholder. `states` ∪ `na` covers all 16 state ids. Reasons are ≤ 140 characters. W52 has `invalid`. The five W pages have `permissionUnavailable`.
2. **Render matrix.** Each page × `CTX5` × `rolesOf` × `tokensOf` at `default` (and home, which is the same) has `problems` empty, no "Not built yet", and ids prefixed `t-`. Each default view × all `SCENARIOS` × `CTX3` renders cleanly.
3. **Tiers.**
   - Review frames contain `wb-handoff--review`, and an instructor frame contains at least one protective action label.
   - O02 on iPad and iPhone contains `wb-handoff--handoff` and no `<input`, `<select` or `<textarea`.
   - W57 on iPad has no `wb-handoff`.
4. **Authority.**
   - *TA at `ta_expired`* on W50/W52/W54/W57/W58: contains "Your grading access for this course has ended", and no student name (`studentNames()`).
   - *TA at `default`:*
     - W52 contains no `courseTotal` display of any student (computed as the instructor) and no student name.
     - W54 contains none of the Quiz 2 receipt id, the learner name or the released score.
     - W50 contains none of "Apply reviewed change" enabled, release versions or draft totals.
     - W57 lists only the names in `taScope.learnerIds` and no date field (`type="date"`).
     - W58 contains "Attendance is not in your course role".
   - *No release path for a TA:* TA frames of all five W pages contain no `data-go` to `W53~` and no "Release" opener (`data-act="open-dialog"`).
   - *Graded ≠ Released:* W52 instructor shows both the staff and the learner `display` under distinct labels.
   - *Snapshots immutable:*
     - W50 at `ps4_released` lists the PS4 release version as excluded and has no held row for that learner.
     - W54 shows the snapshot version and has no enabled score field.
     - No frame of any page contains an editable input for a receipt or released score.
   - *3.10:* W52 for both roles and all tokens does not match `/\bgrade:? [A-F][+-]?\b/` and contains the no-boundaries sentence.
   - *2.11:* on W57 only the instructor frame has the "Grading due" field.
   - *Optional pages:* default views contain no enabled form control; O01 and O03 role is student only (`rolesOf`).
5. **Data mutation.** Using `direct` with `copy(WB.data)`:
   - Removing the grading task → W57 instructor draws `firstUseEmpty` content and does not throw.
   - Setting the task `access_end` before `grading_due` → W57 shows both dates and Apply disabled with the access reason.
6. **Journeys.** For J03, J06, J08 and J11 steps on `PAGES`: the frame is real, and `goPages` includes the next page (W50→W51, W52→W51, W54→W53, W57→W05, W58→W54) on `CTX3`.
7. **Record-true links.** Every `data-go` in `PAGES` frames resolves to a manifest page, and any variant suffix exists on the target.

### 4. Acceptance criteria

- Eight new page files in the correct folders; `pageFiles()` does not throw; none of the eight is a placeholder.
- All tests in `seg6-grading.test.mjs` pass.
- `check_render`, `check_vocab`, `check_lines` and `check_size` pass: spec ≤ 1,012,975 B; app and board ≤ 921,600 B; segment source ≤ about 75 KB.
- A TA never sees: a course total, another learner, a release preview or control, policy editing, the Quiz 2 request evidence, or attendance.
- After access ends, a TA sees the notice only.
- No letter grade appears anywhere.
- No invented request, award, answer, weight, date or score appears; every drawn figure traces to a selector.
- Disabled controls use `K.button` or `K.field` with a reason.
- **Unchanged:** W48, W49, W51, W53, `shared.js`, `kit/`, `fixtures/`, `manifest/`, `system/`, `spec/`, `tracker/`, `viewer/`, `decisions.md`, `NOTES.md` (root), `inputs.lock.json`, other segments' folders, and existing test files. Existing tests pass, apart from the known `spine.test.mjs:29-33` structure assertion until the coordinator relaxes it.
- No commit. `design/build.mjs` and `check_batch.mjs` are not run.

### 5. Proof commands

```bash
cd /Users/wasifkarim/Claude/Projects/Whiteboard
bash -o pipefail -c 'node --test design/final/tools/seg6-grading*.test.mjs 2>&1 | tail -n 20'
bash -o pipefail -c 'node --test design/final/tools/*.test.mjs 2>&1 | tail -n 25'
bash -c 'node design/final/tools/check_render.mjs && node design/final/tools/check_vocab.mjs && node design/final/tools/check_lines.mjs'
bash -o pipefail -c 'node design/final/tools/check_all.mjs 2>&1 | tail -n 25'
bash design/final/tools/legacy_check.sh
bash -c 'node design/final/build.mjs && node design/final/tools/check_size.mjs && node design/final/tools/check_offline.mjs'
git -C /Users/wasifkarim/Claude/Projects/Whiteboard status --short design/final | grep -v -E 'pages/(seg6-grading/(W50|W52|W54|W57|W58)\.js|seg6-grading/NOTES\.md|optional/O0[123]\.js)|tools/seg6-grading|kit_requests\.md|dist/' ; true
```

- The second command passes fully only after the coordinator relaxes `spine.test.mjs:29-33`. Until then that single test is the only permitted failure.
- The last command lists changes outside the allowed set, for manual comparison with the pre-existing untracked `design/final/`.

### 6. Out of scope and risks

- **Out of scope:** new fixtures, selectors or kit options (requests only); editing W49 to link W50; tracker rows; `tools/index.js`; the `spine.test.mjs` fix; browser, keyboard or accessibility acceptance (source checks only).
- **Thin pages:** W52, W54, W50, W58 and O01–O03 are deliberately thin because their records do not exist. If the coordinator lands kit requests 1–6, a follow-up pass fills weights, the Quiz 2 request, the candidate diff and attendance.
- **W52 `invalid` deviates from the `PAGES.md` failure-sample rule.** It draws no sample figures because no sample exists, and it does not draw a permission notice to the instructor. This is recorded in `NOTES.md`.
- **J06 W54→W53** is a labelled course-tool link to the PS4 release page, not a correction release. A reviewer may prefer plain text, in which case the journey test pair must be dropped.
- **Parallel builders:** `kit_requests.md` is appended by several builders at once. Append only under this segment's own headings.
- **Size:** the eight files must stay within about 75 KB. Cut the O-page `enabled` variants first if needed.
---

## Amendments after plan review round 1 (coordinator; these override the segment sections above)

All ten findings of `claudex-okm7femp` were accepted. Where an amendment conflicts with a segment section, the amendment wins. Each change gets a test.

- **A1 (R01, identity transitions; seg1, seg3).** A bare link keeps the current role (`viewer/route.js` parseHash merges the current state). A complete hash resets the platform, so neither can change identity safely.
  - No page link changes role: Sign out, Use another account, Restart sign-in, Sign in again, and the W01 → W02 hand-off.
  - These are drawn as preview-only buttons (`note`: "Preview only: in this prototype, switch the role in the viewer bar or follow the tour") or as disabled controls with a reason. A role change between journey steps is carried by the tour bar, as already noted for W25 → W58.
  - The W01 `leaving` dialog's primary item becomes a preview-only "Continue to institution". The `sessionExpired` recovery on W02, W03, W10, W13 and W26 is preview-only "Sign in again" plus the W12 help link, which is allowed for every role.
  - **Test:** for every SEG render, each `go` target page lists the frame's current role in `WB.manifest.pagesById[target].roles`. Write this as a shared helper `roleSafeLinks(html, role)` in each segment test file. It applies to all six segments.
- **A2 (R02 and R03, quiz flow; seg3).** No scenario matches a newly started attempt or the exact payload being submitted.
  - W25 "Start attempt now" and W26 "Submit attempt" stay as committing dialogs, but their primary item is preview-only, with a note saying nothing starts or is sent in this prototype.
  - Each dialog also carries a separate secondary link, labelled honestly: "See an example attempt in progress" → `W26~quiz_in_progress` on W25, and "See an example confirmed receipt" → `W27~quiz_received` on W26. The text states that these are separate example records, not the result of this action.
  - **Test:** neither dialog's primary item has a `data-go`, and each example link's label contains "example".
- **A3 (R04, W26 answers; seg3).** Never preselect a choice. Draw choice options as disabled, unselected placeholders, and show the raw fixture value read-only. Use "Saved answer" only for acknowledged values; an unacknowledged value is "Unsaved draft: not sent".
  - **Test:** no `checked` on any W26 choice, and q3 (unacknowledged) is never labelled with "Saved answer".
- **A4 (R05, published items; seg2, plus every learner-facing item list in any segment).** Item rows come only from the intersection of `m.item_ids` with `P.assessments(a)` (published only). This covers W16 rows, the W17 next item, W33/W34 group work, W05 and W09.
  - **Test:** a data copy with `ps4.published = false` leaves no PS4 title on W16, W17, W05 or W09 for the student.
- **A5 (R06, W35 module links; seg5).** Only the module that W37 actually draws (`sel.currentModule`, else the first) links to W37. Every other module title is plain text.
  - **Test:** W35 at `default` and at `ps4_released` has exactly one W37 link, labelled with that module's title.
- **A6 (R07, per-task TA access; seg2, seg5, seg6).** Before reading progress, learners or scope for a task, check `sel.taTaskAccess(view, assessmentId, who).active` and a non-null `sel.taScope(...)` for that task. An expired task is listed by title with "Access ended" and no learner data.
  - Applies to W05, W43, W44, W46, W47 and W57.
  - **Test:** a data copy with two tasks, one expired and one active, renders without throwing and shows learners only for the active task.
- **A7 (R08, W03; seg1).** W03 shows the supported fact: "You already have access to this course as <role>". It also says "This invitation's status cannot be checked in this prototype". Accept stays disabled with the reason "This invitation cannot be verified". No "accepted" claim.
- **A8 (R09, W54 evidence links; seg6).** The Quiz 2 evidence stays inline. Drop the W27:quiz2 and W23 links. W54 links only to role-allowed, record-matching destinations; W53 is allowed only with its anchor title as the label.
  - **Test:** the A1 role-safe link check, plus no `W23` or `W27` go from W54.
- **A9 (R10, null categories; seg6 W52, and any page formatting `categoryPercent` or `courseTotal`).** Format a value only when it is non-null; null shows "No calculable grade".
  - **Test:** a data copy where every result in a category is excused renders W52 for both roles without throwing.
- **A10 (R11, record-true rules link on W27; seg3, and every segment).** W27's "Quiz rules and attempts" link is `P.recordGo("W25", "assessment", itemId)`. When that returns null (Quiz 2), draw no link and add the line "The rules page is drawn for Quiz 3 only in this prototype". The same rule holds for every record-specific link in every segment: use `P.recordGo` for a record-specific destination and never a bare page id.
  - **Test:** `W27:quiz2` has no `W25` go. Each segment test checks that a page showing record X never links a bare page id whose anchor is a different record of the same type.
