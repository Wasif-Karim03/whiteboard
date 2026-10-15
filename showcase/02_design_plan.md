# Whiteboard: final-product showcase design plan

Prepared 15 October 2026. **Status: approved by the user on 15 October 2026; implementation authorized.** Companion: [gap analysis](01_gap_analysis.md). This document specifies a shareable visual of the intended final product, not a production application or a claim that the features are available today.

## 1. Deliverable and decisions

Upgrade [`Claude outputs/Pellwin-Showcase.html`](../Claude%20outputs/Pellwin-Showcase.html) in place. Keep one self-contained HTML source with inline CSS, JavaScript and SVG; use no CDN, external font, runtime fetch, build step or backend. The legacy filename can remain while every visible product reference becomes Whiteboard. The research report and its hosted Site are separate artifacts and will not be replaced or redeployed by this work.

Before the first HTML edit, copy the exact current file to `showcase/archive/showcase_v1_2026-10-15.html` and verify its hash against the recorded baseline. Create `showcase/v2` from the reviewed current Git state, preserving unrelated/untracked files. Track the existing source explicitly as part of the authorized showcase work. Do not reset the working tree or alter the research history. Record progress and commit after each implementation group below.

The intended reading experience is a coherent product page with substantial real HTML/CSS screens and optional guided interaction. The page must work when opened directly or sent as one attachment. It should feel complete without requiring a viewer to inspect 40 unrelated screens or read our research report.

## 2. Design contract

**Audience:** co-founders, partner-school faculty and administrators, IT/accessibility/procurement readers, advisors and possible investors. **Primary task:** understand the intended product, see important tasks work in a sample campus and judge the boundaries honestly. **Primary action:** “Explore the product.” Secondary role links take readers to the parts relevant to them.

**One visual idea:** follow a piece of campus work as it moves between people. A student's assignment becomes an instructor's grading task and a student's feedback; an organization's event becomes a room request and an approval. The same records, names and status language make the unity visible. This is more specific to Whiteboard than a decorative dashboard collage.

**Retain:** cool paper, teal actions, strong hierarchy, restrained borders, white student work, colored course identifiers, clear status words, calm recovery copy. **Extend:** larger product-story headings, a responsive product shell, campus-operation workspaces and a stable guided-demo model. **Remove from the main narrative:** design workshops, competing logo concepts, internal decision IDs, development-stage tables and the nested marketing-site frame.

The first design pass is deliberately restrained: no generic gradient hero, emoji-led feature tiles, ornamental glass, repeated three-card sections, mock customer-logo strip or giant fabricated metrics. Distinction comes from the connected campus scenario and readable UI. Do not change the teal identity merely to make the page look newly designed.

## 3. Story and navigation

Reading order:

```text
Whiteboard vision + interactive product scene
  → the fragmented-work problem + connected platform map
  → a student's day → courses → submission certainty
  → teaching and assessment → grading and feedback
  → schedules and rooms → events and organizations
  → student support
  → institutional administration and IT
  → fair comparison of approaches and connected systems
  → trust, accessibility and optional AI controls
  → delivery sequence → partner conversation → selected sources
```

Use a compact sticky top navigation: Product, Teaching, Campus, Institutions, Direction. Add a mobile disclosure menu, theme selector and skip link. Give each major section a real anchor. A short role chooser links to Student, Faculty/TA, Campus teams and IT/institution administration views; individual screens retain the precise actor such as registrar, club officer or adviser. These entry groups are navigation conveniences, not a single all-powerful campus role.

The narrative remains visible without JavaScript. Tabs and walkthroughs enhance the page; the first meaningful example in every domain is readable if scripting fails. An optional screen index can expose every planned workspace without becoming the first-time visitor's default route. Internal screen/gap IDs remain in implementation/documentation only.

## 4. Section-by-section specification

Gap IDs below refer to [01_gap_analysis.md](01_gap_analysis.md). Workspaces are listed in Section 5. All scenes use fictional data and depict planned behavior.

| Section | Purpose and content | UI shown | Interaction and responsive behavior | Gap coverage |
| --- | --- | --- | --- | --- |
| 01. Vision | Introduce Whiteboard as an LMS-centered university platform. Draft headline: “Your university, working together.” Explain courses, spaces, campus life and support in one short paragraph. Keep a visible “Product vision — interactive concept with fictional data” note. | S01 Today, with connected coursework and one campus event; phone preview beside the main scene where space permits. | “Explore the product” anchors to the tour; role links change the starting context without hiding the whole page. Desktop scene becomes a readable stacked view on phone. | L03, L05, L08, X03, W04, W06 |
| 02. Why connected work matters | Three short problem statements: find the right work; know whether it went through; know who acts next. Then show LMS core → campus coordination → support, with specialist systems connected at the boundary. | A small semantic HTML/SVG platform map, not another app screen. | Click/focus a domain label to jump to its section. No dependency on hover. One or two unobtrusive source footnotes. | L18, R02, E08, W01, W03, W05 |
| 03. A student's day | Show one consistent place for courses, deadlines, class times, event changes and actionable notifications. | S01, S02, S12, S13. | Today/Courses/Calendar/Updates tabs; course filters and notification preferences work locally. Selecting an assignment enters the connected course/submission story. Calendar has a genuine list view on narrow screens. | L03, L07, L08, L09, L13, R01, E08 |
| 04. Inside a course | Establish that this is a full LMS: organized content, syllabus, materials, quizzes, conversation and announcements. | S03, S04, S10, S11. | Course navigation, a module expand/collapse, accessible material view, a short quiz attempt/review and a discussion reply using sample text. Include draft/autosaved state and accommodation context. | L09, L10, L11, L13, L14 |
| 05. Submit with confidence | Deep student walkthrough from assignment instructions through handwritten/PDF work to a verifiable receipt. | S05, S06, S07, S08; S09 appears after the grading journey. | Use sample scan pages; organize/rotate/tag, preview exactly what is sent, submit locally, inspect receipt and retry an explicit interrupted-send scenario. Phone handoff is optional, not mandatory. | L02, L06, L07, L08, L17 |
| 06. Teach the course | Show how professors create, publish, adapt and reuse coursework, and how TAs participate within scope. | S14, S15, S16, S21, S22, S23. | Faculty workspace tabs: Build, Assign, Quiz, People, Copy, Insights. Publish/student-preview state, a question-bank selection, a TA permission example, course date shifting and import exceptions. Less-used detail is in expandable panels. | L04, L10, L11, L14, L15, L16, X05, X08 |
| 07. Grade, explain and release | Retain v1's strongest visual: readable work alongside question rubric. Connect grade changes, release preview and student feedback. | S17, S18, S19, S20, S09. | Select a question/student, apply rubric items, edit a comment, preview rubric impact, choose release scope and view student feedback. Optional authored AI draft branch uses accept/edit/discard. Demo records drive every total. | L01, L04, L06, L07, L12, L17, L18, X01, X10 |
| 08. Plan time and space | Show registrar/department coordination and room requests as distinct from a personal calendar. | S24, S25, S26, S27. | Timetable/list switch, capacity/equipment/accessibility filters, proposed change with explained conflicts, approval and confirmed reservation timeline. A recurring reservation can alter one occurrence. Optional scheduled-use panel identifies its denominator/source. | R01–R07, X07 |
| 09. Campus life that follows through | Students discover current organizations; officers plan together; staff see dependencies; students RSVP; operators check in. | S28–S33. | Club/event search, join request, shared event draft, approval dependency timeline, RSVP/waitlist, sample event pass/check-in and officer handoff. Funding is a request/status panel, not a payment ledger. | E01–E09, W01 |
| 10. Help with a clear next step | Depict later student-support coordination without opaque risk labels or unofficial degree decisions. | S34, S35, S36. | Find tutoring/advising, see what context is shared, request/book a sample appointment, accept/redirect/resolve a referral and inspect student-visible status. Adviser sees only appropriate context. | A01–A07 |
| 11. Run the institution | Give administrators and IT their own useful workflows: people/policy, connected records, migration and exceptions. | S37, S38, S39. | Institution-admin/IT mode labels; inspect an expired TA role, roster mismatch, grade update requiring reconciliation and course-import exception. Show source, timestamp and direction where relevant. Actions update only fixtures. | X02, X05–X08, L15, R06 |
| 12. One experience, with clear boundaries | Fairly compare a specialist stack, a portal over existing systems and the Whiteboard integrated-core approach. Explain fit and tradeoffs rather than declaring a universal winner. Show library/career/housing/accounts as connected services. | A concise comparison table and native/connected service map; reuse small task examples rather than inventing another giant dashboard. | Semantic table/cards reflow on phone. Expand the authority note for a connected service. Text names replace partner-logo badges. | L18, L19, X14, W01–W03, W05 |
| 13. Trust and choice | Explain intended accessibility/privacy/security controls and what evidence is still needed. Show optional AI policy and a reviewable draft, with a usable disabled path. | S40 and the S17 draft-feedback panel reused with independent read-only snapshots. | Trust/AI-policy tabs, a role-scoped access example, audit entry and planned evidence-status rows. No pretend document downloads, certification badges or enabled production integrations. | X01, X04, X09–X14, A06 |
| 14. Direction and conversation | Separate complete vision from intended delivery sequence. Invite discussion with a school rather than announce a launch date or traction. Include selected sources and a brief prototype limitation note. | A text-based roadmap and a small conversation brief panel; no extra product screen. | In-page CTA opens a local brief with copy/download fallback; no message is sent. Footnotes link to a few direct external sources. All essential copy remains readable offline. | L05, X13, A07, W05–W07 |

## 5. Complete screen mockup list

Forty primary workspaces are planned. A workspace can contain named tabs/dialogs and explicit states below; those are not additional screen-count claims. Every workspace is HTML/CSS with real text, not an image of an interface. All P0 and P1 workspaces are in the intended approved build; P0 is implemented and checked first. P2 extras are listed separately.

| ID | Workspace and actor | Required visible content / state | Priority | Existing starting point |
| --- | --- | --- | --- | --- |
| S01 | Today — student | Next action, upcoming work, class/event changes, support link; empty and source-delayed variant | P0 | Today concept |
| S02 | Courses — student | Current/past courses, section, instructor, next task | P1 | Course chips/home concept |
| S03 | Course home — student | PHYS 110, instructor, stable navigation, current module and announcement | P0 | Course-home concept |
| S04 | Module/material/syllabus — student | Content list, reading, syllabus tab, accessible alternative and completion | P0 | Sample modules |
| S05 | Assignment detail — student | Instructions, due/close dates, timezone, rubric, formats, attempt status and permitted/limited/prohibited/disclosure-required AI-use policy | P0 | GT-20 |
| S06 | Mobile scan — student | Sample camera composition, readable-page guidance, sample-page capture and no-camera route | P0 | GT-22; visual only, no actual camera needed |
| S07 | Submission organizer/review — student | Selected PDF/sample pages, order/rotation, question tags, missing tag and exact final preview | P0 | GT-23/24/26 |
| S08 | Submission result — student | Received-in-example receipt, attempt/pages/timestamp; interrupted/not-sent/retry variants | P0 | GT-24/25 |
| S09 | Feedback and grade explanation — student | Same submission/rubric/comments as grader; unreleased state; weighted total explanation | P0 | GT-27 and student grades |
| S10 | Quiz attempt/review — student | Time/accommodation, saved answers, flagged item, submit confirmation, result availability and clear assessment AI-use policy | P0 | New |
| S11 | Course conversation — student/faculty | Announcements and discussions tabs; thread, reply and publication context | P0 | Static course announcements only |
| S12 | Calendar — student/faculty | Week/list, course identifiers, assignment due versus meeting time, event booking state | P0 | Calendar concept |
| S13 | Updates/preferences — student | Actionable course/event updates, read status, frequency/channel controls and quiet period | P1 | Static digest/inbox hints |
| S14 | Course builder — instructor | Syllabus/modules, order, prerequisites/release settings, publish and student preview | P0 | New authoring over course concept |
| S15 | Assignment editor — instructor | Dates, groups/sections, points/questions, files, rubric and accommodation summary | P0 | GT-02/03 |
| S16 | Quiz builder — instructor | Question bank, sample item types, attempts/timing/accommodations and feedback release | P0 | New |
| S17 | Grading workspace — instructor/TA | Question-specific page, rubric, comments, remaining queue, concurrency variant and optional draft help | P0 | GT-04/05/07 |
| S18 | Rubric-change preview — instructor | Old/new rule, affected answers, overrides preserved, apply/cancel | P0 | GT-06 |
| S19 | Gradebook — instructor | Category weights, ungraded/missing/excused, sortable rows, calculation explanation | P0 | Instructor gradebook concept |
| S20 | Release/records — instructor | Exact selected scope, held work, preview, release result; optional external reconciliation state | P0 | GT-08 |
| S21 | People and course permissions — instructor | Students/TAs, role scope, withdrawal/revocation and operational allowance dialog | P1 | GT-09 and TA policy |
| S22 | Course copy/rollover — instructor | Source course, date shifts, content selection, item/tool exceptions and review before apply | P0 | New |
| S23 | Course insights/attendance — instructor | Concrete missed-work signals, sample completion counts and correctable attendance; no risk score | P1 | Prototype analytics hints |
| S24 | Academic timetable — registrar/department | Sections, faculty, meetings, rooms, capacity/equipment/accessibility criteria and draft status | P0 | New; calendar is context only |
| S25 | Schedule-change review — registrar | Proposed versus current meeting, conflicts/impact, approver, decision and source apply status | P0 | New |
| S26 | Find a room — permitted requester | Date/time/recurrence, capacity, equipment, accessible route, availability and source freshness | P0 | New |
| S27 | Reservation/request — requester/space approver | Pending/returned/confirmed, one-occurrence change, cancellation and room-system acknowledgment | P0 | New |
| S28 | Campus event discovery — student | Current event, organizer, time/location, access information, RSVP and waitlist | P0 | New |
| S29 | Organization home — student/officer | Verified term/contact, events, join request, member/officer scope and inactive example | P0 | New |
| S30 | Collaborative event composer — officer | Co-editing, organization ownership, program details, room and funding requests | P0 | New |
| S31 | Event approval workspace — student affairs | Dependencies, responsible reviewers, returned reason, room/funding confirmation and publication | P0 | New |
| S32 | Event attendance — operator/student | Student pass, operator manual/sample scan, pending sync, duplicates and corrected count | P1 | New |
| S33 | Organization transition — outgoing/incoming officer | Recertification, roster/roles, open tasks, files and transferred draft | P1 | New |
| S34 | Get support — student | Tutoring/advising directory, eligibility, sharing explanation, request and appointment details | P0 | New |
| S35 | Advising context/referral — adviser/faculty | P0: create a contextual concern/referral with minimal information and a named service. P1: adviser preparation and linked degree-plan source/version. | P0 intake / P1 preparation | New |
| S36 | Support follow-through — coordinator/student | Received/redirected/accepted/in-progress/resolved, queue age/capacity and student-safe update | P0 | New |
| S37 | Institution administration — authorized admin | People/terms/role policy, invitation/revocation, retention/export and support-access example | P0 | GT-30 expanded |
| S38 | Integration health — IT | Roster/grade/room exchange, direction, freshness, rejected record, retry/reconciliation | P0 | GT-30 and GT-08 seeds |
| S39 | Migration preflight — IT/instructional design | Course/assets/item types/tool mapping, exception severity, preview and acceptance/export | P0 | New |
| S40 | Trust and AI policy — authorized admin | Intended role controls/audit, evidence status, optional AI switches, course-policy precedence and planned provider/data-use disclosure with unselected terms identified | P0 | GT-30 concepts; substantial new work |

Phone layouts are variants of these same workspaces, not a separately claimed native app. The student submission/feedback, calendar, event participation and support journeys must be usable at phone width. Dense staff tables can use contained horizontal scrolling with a readable summary/list and clear labels; the document itself must not overflow.

## 6. Six guided journeys and the interaction contract

| Journey | Connected sequence | What must be demonstrated |
| --- | --- | --- |
| J1. Find, submit, understand | S01 → S03 → S05 → S06/S07 → S08 → S09 after J2 | Selected pages and question tags survive navigation; receipt references the same attempt; due/close states are clear; a retry preserves the example. |
| J2. Teach, grade, release | S14/S15 → S17 → S18 → S19/S20 → S09 | Correct question queue, score/rubric consistency, TA restriction, consequence preview and explicit release; only released feedback appears in student view. |
| J3. Resolve a schedule change | S24 → S25 → S27 → S12 | Explain one capacity/overlap conflict, choose a feasible alternative, distinguish approval from authoritative confirmation and then update the calendar. |
| J4. Organize an event | S29 → S30 → S26/S27 → S31 → S28 → S32 | Organization-owned draft, room/funding dependency, approval before publication, RSVP/capacity and check-in reconciliation. S33 shows the officer-transition branch. |
| J5. Connect someone to help | S34 or course concern → S35 → S36 → student-safe status | Explain shared information, name the receiving service, accept/redirect/close, support correction and avoid revealing private notes. |
| J6. Bring a course over safely | S39 → S22 → S38 → S37 audit context | Surface an import exception, inspect a mapping, preview the fix, reconcile a sample roster/grade failure and record the example action. |

Each journey has Start, Back, Next, a visible step title and Reset example. Important controls work through keyboard and pointer. Viewers can leave a journey for another section without delayed callbacks changing its state. Changing role within a connected journey reads the same records; only information permitted to that role is shown in the example.

Use a small explicit data model for fictional people/roles, terms, sections, content, assignments, attempts/pages/tags, rubric versions, grades/releases, rooms/meeting occurrences, events/memberships/dependencies and referrals. Renderers must be pure; viewing a scene, a thumbnail or an audit must not change a student's pages or grades. Read-only snapshots receive clones separate from interactive state. Explicit scenario variants start from a named deterministic seed; changing scenario visibly resets that scenario, not unrelated work.

Demonstrations are session-local. Store only theme preference if storage is available; no analytics, external requests, service login, real camera/AI execution, production write, message sending or attendee tracking. The global concept notice stays visible; contextual copy identifies simulated service effects without filling normal product UI with implementation details. Optional sample-PDF selection should use built-in synthetic fixtures by default and never upload user files. A product-looking Submit/Release action must produce the corresponding sample state rather than an unrelated toast.

## 7. Fictional sample campus and consistency

Reuse **Alder Hill College**, visibly fictional. Retain PHYS 110 Introductory Mechanics, Dr. Diane Reyes, TA Maya Chen, student Aisha Rahman and IT administrator Tom Okafor. Add named fictional registrar/adviser/officer roles as needed; do not imply that Tom holds every campus approval role.

Set an explicit sample week, 12–16 October 2026, in America/New_York. PHYS 110 meets Monday/Wednesday/Friday 9:00–9:50 in Hollis Hall 104. Use additional plausible courses such as MATH 220 Linear Algebra and WRIT 140 Academic Writing with nonconflicting sample times. Current assignment: Problem Set 4: Kinematics, due Friday 16 October at 11:59 pm EDT, 30 points. Define question maxima once (6 + 4 + 6 + 8 + 6) and derive scores throughout the demo.

For scheduling, Hollis Hall 104 can seat the sample PHYS section; a smaller alternative must fail the capacity rule visibly. Show equipment/accessibility attributes without exposing a personal diagnosis. Reuse the same room in the Physics Society's fictional evening event and let a conflict produce an alternative occurrence. Event dates, approvals and room confirmations must agree in every calendar view.

Roster counts, submitted work, reviewed work, held feedback, event capacity/RSVP/check-in totals and referral queues are derived from records. Withdrawn students are not silently counted as active. Demo numbers are ordinary UI data; they never become traction, efficiency or adoption statistics in the page copy.

## 8. Visual system

### Palette and materials

Preserve the existing semantic teal system. Starting values below are design specifications, not claims of tested conformance; every final combination/state needs verification.

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | `#FAFEFE` | `#101213` |
| Surface | `#FFFFFF` | `#1C2122` |
| Primary text | `#141B1D` | `#E5EFF1` |
| Secondary text | `#5A6568` | `#B1BDC0` |
| Action fill | `#007176` | `#008287` |
| Accent text | `#007176` | `#65D2D2` |
| Subtle divider | `#D6DFE2` | `#30383A` |

Use a separate sufficiently visible control border and focus treatment; subtle dividers do not substitute for control boundaries. Statuses retain words/icons and their own semantic tones. Course colors carry text identifiers; course selection does not depend on hue. Student paper remains white with dark ink inside a dark frame. Marigold is optional P2 and limited to one flat editorial surface if it improves hierarchy; it is not required.

### Type and rhythm

Use the installed system UI stack (`-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `system-ui`, sans-serif) for the portable artifact. This preserves the intended clean/native character without fetching fonts or redistributing Apple's font files. Use tabular numerals for grades/time/capacity; monospace only for short technical IDs when helpful. Keep handwriting in original or newly drawn inline sample SVG; no external Caveat/Material Symbols request.

Extend the current scale: responsive hero approximately 40–64px; section headings 28–40px; screen titles 20–24px; narrative 16–18px; readable UI 14–16px; secondary UI generally at least 13px. Use rem and natural wrapping; never shrink an entire desktop interface to fit a phone. Keep narrative measure around 55–70 characters. Exact endpoints remain subject to rendered review.

Use a 4px primitive, mainly 8/16/24/32/48/64/96px groupings. Narrative sections get more air than dense product controls. Content max width can expand from the review's 1,040px to approximately 1,200px for the product stage, while copy stays narrower. Retain differentiated 6/8/10/14/20px radii and restrained elevation; use surface/border hierarchy before shadows.

### Layout concept

```text
Desktop: [brand   section anchors                  theme / explore]
         [short headline + status]   [dominant live product scene]
         [brief problem / connected platform map]
         [role/context label] [readable product workspace + focused explanation]
         [next domain, varying scene arrangement rather than identical tiles]
         [comparison] [trust] [roadmap and conversation]

Phone:   [brand                       menu / theme]
         [headline + concept status]
         [product view reflows; meaningful tabs wrap]
         [story sections in reading order]
         [calendar lists and summarized staff tables]
```

App chrome is subordinate to the actual work. Use a browser/device boundary only when it explains the context; do not nest a whole marketing website inside a fake browser inside the showcase. Mock browser labels must not imply ownership of an unverified domain. No stock campus imagery is needed.

### Motion and input

Use CSS for state transitions: approximately 120–180ms for selection and 180–250ms for a small panel movement. No scroll hijacking, autoplay carousel, animated numerical claims, persistent spinner or staggered reveal hiding essential text. `prefers-reduced-motion` removes nonessential displacement and smooth scrolling. Pause/cancel any demo timing when the scene changes; explicit progress transitions are preferable to fake network timers.

### Accessibility and offline resilience

Semantic landmarks, a sensible heading order, actual buttons/links/labels, visible focus, keyboard-operable tabs, correctly announced status changes, Escape/close/focus restoration for dialogs, text alternatives for meaningful SVG and no essential hover-only detail. Prefer native disclosure over custom modal where sufficient. Do not apply `inert` or `aria-hidden` to active controls. Unsupported browser enhancements must fall back to visible content.

Plan to check 320/390/768/1,280/1,440px layouts, 200% zoom, light/dark/system, reduced motion and keyboard. Tables get captions and real sort buttons; overflow stays inside labeled table containers. The showcase's accessibility tests are separate from the planned software's legal/product assurance. Passing this artifact does not create a VPAT, HECVAT result, SOC 2 report or FERPA certification.

Keep all required content/assets inline. No dependency installation is expected. Initial working budget: keep the HTML under roughly 1.5 MB uncompressed if feasible; measure the actual file and avoid deleting meaningful content just to hit an invented score. Use shared SVG symbols/renderers, lazy scene mounting where useful and no heavy animation library. Record actual performance observations only after measurement; do not claim phone performance from a desktop check.

## 9. Content, trust, comparison and sources

**Status language:** “Product vision,” “Planned experience,” “Connected system” and “Illustrative data” describe different things. One global status note plus clear roadmap and contextual labels is preferable to a warning badge on every control. Never use “Live,” “Trusted by,” “Certified,” “Deployed” or “Available now” as promotional claims.

**Roadmap:** show intended sequence—core learning workflow → institutional depth and migration → spaces/events/organizations → student support and selected adjacencies. Do not reuse December 2028, Jan 2027 or founder/hiring gates from missing historical sources. Broad final-product visuals remain visible even when a capability belongs to a later stage.

**Trust:** describe role-scoped access, auditable changes, institution-defined retention/export, accessible interaction and reviewable evidence as requirements/intended behavior. Mark documentation and external assessment as not yet established. FERPA terms depend on institutional arrangements; HECVAT is a risk questionnaire; a VPAT-based ACR reports tested conformance; SOC 2 requires an actual scoped examination. Do not add a pretend PDF download. Keep legal deadlines out of the hero; if included in a footnote, use the dated current research and entity-specific applicability. [Compliance analysis](../research/04_cross_cutting/compliance_security.md)

**AI:** show one small instructor-controlled draft-feedback example grounded in the displayed rubric. The draft is authored sample text, not an executed model. It can be edited/accepted/discarded and cannot silently change a score or release work. Show a disabled path and planned institution/course/assignment controls. Students see the permitted, limited, prohibited or disclosure-required rule where they submit or take a quiz (S05/S10), separately from staff grading assistance. S40 identifies the intended disclosure fields: provider/model, data categories, processing location, retention and training use. Show unselected/unverified terms honestly; do not invent a provider contract, data-residency guarantee or autonomous grading. [AI research](../research/04_cross_cutting/ai_features.md)

**Comparison:** compare approaches on workflow continuity, specialist depth, migration and institutional control. Describe Whiteboard as our planned approach; recognize incumbent/specialist breadth and portal integration. No competitor scorecards from unknown cells, universal ease-of-use claims, invented pricing or projected savings. [Synthesis](../research/synthesis.md)

Use a small selected-source footer, linked near only the few external facts used. Candidate evidence already preserved in research:

- [EDUCAUSE interoperability guide](https://www.educause.edu/content/2026/the-integrated-institution-a-guide-to-interoperability-for-student-success): fragmented context and meaningful exchange, not a national complaint percentage.
- [Villanova scheduling project](https://www.villanova.edu/university/technology-services/initiatives/academic-scheduling.html): local email/spreadsheet coordination problem, not every campus's process.
- [Case Western Reserve event guidance](../research/03_events_clubs/sources.md): resolve EVENT-048 to its direct page when implementing the footnote; one configured institution, not universal CampusGroups behavior.
- [Montana State migration checklist](https://www.montana.edu/ecat/migrate/pre-migration-checklist/): migration work/record boundaries, not proof that every migration loses data.
- [EDUCAUSE HECVAT](https://www.educause.edu/higher-education-community-vendor-assessment-toolkit) and [ITI VPAT guidance](https://www.itic.org/policy/accessibility/vpat): interpretation of procurement evidence, not Whiteboard certification.

Use only sources that support the final edited wording; include research date/limits compactly. Do not link to local research files as the only justification for a market fact on the externally sent HTML.

**Conversation CTA:** default to an in-page “Discuss a pilot” panel with a short institution/use-case brief and working copy/download action. State that the preview sends nothing and the brief can be shared with the person who provided the showcase. If a real team contact is supplied during implementation, use it; otherwise do not invent `hello@whiteboard...`, a booking service or a lead-submission success message. “Explore the product” remains the main immediately useful action.

## 10. Implementation order, checks and commits — after approval

Create `showcase/03_progress.md` at the start of implementation, with the table below as a checklist, actual check results and a handoff note after every group. Each completed group gets a local commit on `showcase/v2` and a 2–3 line user update. No deployment, public sharing, paid service or research-site change is implied by this plan.

| Step | Deliverable | Acceptance checkpoint before commit |
| --- | --- | --- |
| B0. Preserve and prepare | Verify/copy v1 archive, create branch and progress checklist; establish one model/render/action contract | Archive byte/hash match; original independent assets preserved; known current working-tree changes retained. |
| B1. P0 story and shell | Whiteboard identity, concept status, responsive narrative/nav/theme, platform map, source/CTA structure | All sections reachable, meaningful no-JS content, offline icons/fonts, safe theme storage and correct metadata. |
| B2. P0 student learning | Core student workspaces S01/S03–S08/S10–S12 and J1 | Same assignment/pages/tags/receipt; quiz autosave simulation; clear due/close/retry; readable phone layout. |
| B3. P0 faculty and assessment | S09/S14–S20/S22, J2 and faculty migration context | Rubric totals and selected scope agree across instructor/student views; queue ends correctly; role restrictions and unreleased state hold. |
| B4. P0 spaces | S24–S27, J3 | Conflict and capacity logic explain rejection; request/approval/confirmation differ; calendar and room occurrence agree. |
| B5. P0 events/organizations | S28–S31, J4 core | Shared ownership, dependency gating, room status and RSVP are coherent; no implied financial settlement. |
| B6. P0 institutional/support story | S34/S36–S40, S35 concern/referral creation, J5/J6 core, trust/comparison/roadmap copy | Role-specific context, named referral owner, import/sync exceptions and honest evidence/AI status; no fake external effects. |
| B7. P1 depth and full coverage | S02/S13/S21/S23/S32/S33 and S35 adviser preparation; remaining J4/J5 branches; optional AI draft S17 | All 40 promised workspaces present; notifications, attendance, operator sync, officer handoff and adviser visibility work with consistent sample data. |
| B8. QA and delivery | Copy review, source check, offline/link/asset/console/interaction checks; browser viewport/theme review; update handoff | Record actual checks and limits; no overflow/broken controls; archive unchanged; final file ready to send. |

P0 first does not mean stopping after P0. Complete the planned P1 coverage before final delivery unless the user changes the scope. P2 optional additions are presentation mode, a separate design-system explorer, alternate logo exploration, the marigold editorial panel and extra specialist/native-app mockups. The archive already preserves the v1 design-review material; these extras should not delay the final product story.

## 11. QA plan and handoff requirements

Browser review belongs to B8 after the HTML exists, with earlier spot checks on changed groups. Use permitted local-development/browser tools and do not bypass the prior recorded local-file URL-policy block. If browser access remains blocked, record the exact limitation, complete permitted static/controller checks and identify the smallest remaining manual review. Do not mark desktop/phone/light/dark screenshots, screen-reader execution or real-device checks as passed without running them.

| Area | Required check |
| --- | --- |
| Story and coverage | Every gap ID is implemented, explicitly deferred or intentionally removed; all 40 primary workspaces and six journeys are represented. |
| Desktop/phone and themes | Inspect every section at desktop/phone widths in light and dark, plus intermediate layouts/system preference/zoom. Use screenshots only for meaningful layout review or defects. |
| Navigation and keyboard | Anchors, role entries, mobile menu, tabs, dialogs, focus return, sort/filter, form labels and no single-key shortcut while typing. |
| Data correctness | Same active membership, submission, page/tag/score/rubric/release/event/room/referral records across relevant views; predictable reset and no render-time mutation. |
| Failure and authority | Interrupted submission, concurrency/release exception, pending room, rejected import/sync and unassigned referral show useful recovery without false success. |
| Assets and offline | Open via `file://` where permitted; no required network requests, missing icons/fonts, bad relative asset paths or console errors. |
| Claims and sources | No invented customers/contact/partnerships/certifications, no placeholder copy, no contradictory AI claims; only supported market facts receive footnotes. |
| Safety of demo state | User text is escaped, external links use appropriate schemes, no credentials/real records included, no real sending/upload/publishing behind demo buttons. |
| Performance | Record actual file weight and obvious responsiveness; avoid repeated heavy work/timers. No benchmark claims without comparable measurements. |

At delivery, summarize changes versus v1; list deferred gap items and reasons; provide the exact local HTML path. `showcase/03_progress.md` must state the branch/commits, current source/archive paths, completed checks, remaining limitations and the next step for a fresh session. The plan itself does not authorize any outbound message, paid AI request or new hosting deployment.

## 12. Approval checkpoint

The two documents complete the current planning stage. **No showcase HTML, archive or implementation branch has been changed/created in this stage.** Wait for the user's OK before B0 and the first HTML edit. This pause is explicitly requested in the brief's Step 3, not an additional approval policy.
