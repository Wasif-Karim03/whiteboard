# Whiteboard design board: A-to-Z deep dive (15 Nov 2026)

Source-level review of `Whiteboard-Design-Board (1).html` and its embedded spec bundle. Nothing here is browser, device, accessibility or owner acceptance.

**How to read this:** Part 0 is the whole product on one page: segments, the page map, journeys, build stages and the shared systems. Parts 1–6 take each segment apart page by page. Each page entry covers roles, the job it does, where it is reached from and leads to, what is drawn, the spec in brief, data, rules, assessment, gaps, decisions and what to design next. Each part ends with its own fix list, most important first.

## Fix lists at a glance (118 items)

| Part | Segment | Items | Rule conflicts | Missing states | Broken links | Data | Copy | Device |
|---|---|---|---|---|---|---|---|---|
| 1 | Foundation, access, account | 22 | 5 | 9 | 1 | 4 | 2 | 1 |
| 2 | Every day | 16 | 5 | 4 | 1 | 4 | 1 | 1 |
| 3 | Hand in, results, quizzes | 22 | 6 | 7 | 2 | 3 | 4 | 1 |
| 4 | Communication and groups | 18 | 5 | 8 | 1 | 2 | 1 | 1 |
| 5 | Build and run the course | 20 | 3 | 8 | 3 | 3 | 2 | 1 |
| 6 | Grade and release, optional | 20 | 4 | 8 | 3 | 1 | 2 | 1 |

Some items repeat across parts (TA preview, the iPhone tab bar, "Late", the W27 route), so the unique count is lower.

## Corrections made while compiling

- Part 6 originally said W52 belongs to no build stage. Wrong: Spec 05 Stage 1 lists W51–W53. Corrected in place.
- Several parts mark the J01–J12 numbering as "inferred". It matches the board's own journey list (section K), so treat it as confirmed.
- Part 4 cites "optional" priorities for W28/W30 from a helper matrix. That column came from a faulty script; use the priority written in each page spec.
- Spot-checked and confirmed: Activity previews show "Quiz 2 · 8 of 10" on PC, iPhone and the cancelled-class variant, breaking the no-score rule. W25's late-start copy says 11:20 PM where a 30-minute quiz closing at 11:59 PM gives 11:29 PM. W07 and W32 disagree on grading-deadline permissions.

---

# Part 0 · The whole product in one view

Source: the offline design board `Whiteboard-Design-Board (1).html` (Downloads, 15 Nov 2026) and the spec bundle embedded in it (handoff dated 4 Nov 2026). This is a source-level plan: nothing here has been checked in a browser, with a screen reader, or with a real school.

## What Whiteboard is

An academic web app with exactly three kinds of user:

| Role | What they come to do | The one promise Whiteboard makes them |
|---|---|---|
| **Student** | Find work, do it, hand it in, see results | "Your work arrived, here is the receipt, and every number tells you what it is based on." |
| **Instructor** | Build a course, grade, release results | "Nothing reaches students until you release it, and released history never changes quietly." |
| **Teaching assistant** | Grade the work they are assigned, by a deadline | "You see only your allocation; you can never release or change policy; your access has a clear end date." |

Tagline: *Your coursework, handed in and on the record.* Out of scope on purpose: campus life and events, direct messaging, registrar and SIS records, advising, admin, live video, native apps, automatic final grading.

## How the board is organised

| Board section | What it holds | Drawn screens |
|---|---|---|
| 0 · Start here | How to read the board, scenario used | 1 |
| S · System | Tokens, type, signature pieces, course identity | 3 |
| L · Logo | Five logo directions, browser-tab test | 2 |
| A · Sign in and first run | W01, W04 | 3 |
| B · Student every day | W05–W07, W14–W18, W32 | 25 |
| C · Hand in work | W19–W22 | 9 |
| D · Results | W23, W24 | 5 |
| E · Quizzes | W25–W27 | 5 |
| F · Talk and groups | W28–W31, W33, W34 | 8 |
| G · Account and help | W02, W03, W08–W12 | 10 |
| T · Instructor and TA every day | Staff views of W05–W07, W14, W18, W32 | 10 |
| H · Build the course | W35–W46, W55, W56, W59, W60 | 16 |
| I · Grade and release | W47–W54, W57, W58 | 14 |
| J · Optional | O01–O03 | 3 |
| X · States and failures | W13, 17 failure scenarios | 5 |
| K · Progress | Coverage and journeys (computed) | 1 |
| M · Components and tokens | C01–C16, design tokens | 2 panels |
| N · Page specifications | One panel per page, 63 | 63 panels |
| Q · Spec, data and handoff | Six specs, research, routes, fixtures, checklist | 26 panels |

Total: 211 entries = 120 drawn screens + 63 spec panels + 28 document panels.

## The segments used in this plan

The 63 pages fall into six segments. Parts 1–6 take each one apart page by page.

1. **Foundation, access and account**: the design system, sign-in, invitation, onboarding, activity, search, account, tools, help and system states (W01–W04, W08–W13).
2. **Every day**: home, courses, calendars and course content for all three roles (W05–W07, W14–W18, W32).
3. **Hand in, results and quizzes**: from reading the brief to the receipt, then feedback, grades and timed quizzes (W19–W27).
4. **Communication and groups**: announcements, discussions, moderation, group sets and the group workspace (W28–W31, W33, W34, W47, W55, W56).
5. **Build and run the course**: builder, settings, modules, content, files, assessments, question bank, rubrics, people, allowances, copy and import (W35–W46, W59, W60).
6. **Grade and release, plus optional ideas**: queue, grader, rubric impact, gradebook, policy, release, regrades, allocation, insights, achievements and the FAQ assistant (W48–W54, W57, W58, O01–O03).

## Page map: stage, roles, devices, journeys

Roles: s = student, i = instructor, a = TA, g = guest (not yet signed in). Stage = build stage from Spec 05.

| ID | Page | Roles | Stage | Drawn | Devices drawn | Journeys |
|---|---|---|---|---|---|---|
| W01 | Institution sign-in | g | 0 | 2 | PC, iPhone | J01 |
| W02 | Auth return / recovery | gsia | 0 | 1 | PC | J01 |
| W03 | Invitation | gsia | 0 | 1 | PC | J01 |
| W04 | Onboarding | sia | 0 | 1 | PC | J01 |
| W05 | Role-aware Home | sia | 0 | 5 | PC, iPad, iPhone | J01, J08 |
| W06 | Courses and term archive | sia | 0 | 4 | PC, iPhone | J02, J12 |
| W07 | Personal / global calendar | sia | 3 | 3 | PC, iPhone | J08, J10 |
| W08 | Activity and notification settings | sia | 3 | 3 | PC, iPhone | J09, J10 |
| W09 | Global search | sia | 3 | 1 | PC | none |
| W10 | Account and preferences | sia | 0 | 2 | PC, iPhone | none |
| W11 | Tools directory | sia | 3 | 1 | PC | none |
| W12 | Help / technical request | gsia | 3 | 1 | PC | none |
| W13 | System states | gsia | 0 | 1 | PC | none |
| W14 | Course home | sia | 1 | 6 | PC, iPhone | J02, J04 |
| W15 | Syllabus / grading summary | sia | 1 | 2 | PC, iPhone | none |
| W16 | Modules | sia | 1 | 2 | PC, iPhone | J02 |
| W17 | Lesson / material | sia | 1 | 2 | PC, iPhone | J02 |
| W18 | Coursework list | sia | 1 | 4 | PC, iPad, iPhone | J02 |
| W19 | Assignment detail | sia | 1 | 2 | PC, iPhone | J02, J07, J11 |
| W20 | Add work | s | 1 | 2 | PC, iPhone | J02, J07 |
| W21 | Review and submit | s | 1 | 2 | PC, iPhone | J02, J07 |
| W22 | Receipt / attempt history | s | 1 | 3 | PC, iPad, iPhone | J02, J07 |
| W23 | Released feedback | si | 1 | 2 | PC, iPhone | J03, J06 |
| W24 | Student course grades | si | 1 | 3 | PC, iPad, iPhone | J03, J05, J06 |
| W25 | Quiz rules / start | sia | 2 | 2 | PC, iPhone | J05, J11 |
| W26 | Quiz attempt | s | 2 | 2 | PC, iPhone | J05 |
| W27 | Quiz receipt / review | s | 2 | 1 | PC | J05 |
| W28 | Announcement list | sia | 3 | 2 | PC, iPhone | J09 |
| W29 | Announcement detail | sia | 3 | 1 | PC | J09 |
| W30 | Discussion list | sia | 3 | 1 | PC | J09 |
| W31 | Discussion thread | sia | 3 | 2 | PC, iPhone | J09 |
| W32 | Course calendar | sia | 3 | 7 | PC, iPad, iPhone | J10 |
| W33 | My course groups | s | 3 | 1 | PC | J07 |
| W34 | Group workspace | s | 3 | 1 | PC | J07 |
| W35 | Course builder | ia | 1 | 1 | PC | J04, J12 |
| W36 | Settings, syllabus, publication | ia | 1 | 1 | PC | J04, J10 |
| W37 | Module editor | ia | 1 | 1 | PC | J04 |
| W38 | Learning-content editor | ia | 1 | 1 | PC | J04 |
| W39 | Files and resources | ia | 1 | 1 | PC | J04 |
| W40 | Assignment editor | ia | 1 | 1 | PC | J04, J07 |
| W41 | Quiz editor | ia | 2 | 1 | PC | J05 |
| W42 | Question bank | ia | 2 | 1 | PC | J05 |
| W43 | Rubric library | ia | 1 | 1 | PC | J04 |
| W44 | Rubric editor | ia | 1 | 1 | PC | J04 |
| W45 | People and staff permission | ia | 2 | 1 | PC | J08 |
| W46 | Learner allowances | ia | 2 | 1 | PC | J11 |
| W47 | Group sets and membership | ia | 2 | 1 | PC | J07 |
| W48 | Grading queue | ia | 1 | 2 | PC | J03, J08 |
| W49 | Grader | ia | 1 | 2 | PC | J03, J07, J08 |
| W50 | Rubric-change impact | ia | 2 | 1 | PC | J03 |
| W51 | Staff gradebook | ia | 1 | 2 | PC | J03, J06 |
| W52 | Grading policy setup | ia | 1 | 1 | PC | J06 |
| W53 | Exact feedback release | ia | 1 | 2 | PC | J03, J05, J06 |
| W54 | Grade correction / regrade | ia | 2 | 1 | PC | J06, J11 |
| W55 | Announcement editor | ia | 3 | 1 | PC | J09 |
| W56 | Discussion setup / moderation | ia | 3 | 1 | PC | J09 |
| W57 | Grading allocation and deadlines | ia | 2 | 1 | PC | J08 |
| W58 | Insights and attendance | ia | 4 | 1 | PC | J11 |
| W59 | Course copy and rollover | ia | 4 | 1 | PC | J12 |
| W60 | Import / export preview | ia | 4 | 1 | PC | J12 |
| O01 | Achievements (optional) | s | opt | 1 | PC | none |
| O02 | Achievement authoring (optional) | ia | opt | 1 | PC | none |
| O03 | Course FAQ assistant (optional) | s | opt | 1 | PC | none |

Reading the map:
- Every page has at least one drawn screen. Only W05, W18, W22, W24 and W32 have all three widths.
- **41 pages are desktop only**, including every staff page. Spec 03 accepts desktop-first staff work but asks for a usable narrow alternative for review and protective actions; none is drawn yet.
- Ten pages sit in no journey: W09–W13, W15 and O01–O03. They are support pages, so that is expected. They still need entry points, and W12 has a stage problem: it is linked from Stage 0 sign-in but scheduled for Stage 3.

## The 12 journeys (how the segments connect)

| ID | Journey | Path | Segments crossed |
|---|---|---|---|
| J01 | Arrival | W01 → W02 → W03 → W04 → W05 | 1, 2 |
| J02 | Individual submission | W06 → W14 → W16 → W17 → W18 → W19 → W20 → W21 → W22 | 2, 3 |
| J03 | Grade and release | W48 → W49 → W50 → W51 → W53 → W23 → W24 | 6, 3 |
| J04 | Course authoring | W35 → W36 → W37 → W38 → W39 → W40 → W43 → W44 → W14 | 5, 2 |
| J05 | Quiz lifecycle | W41 → W42 → W25 → W26 → W27 → W53 → W24 | 5, 3, 6 |
| J06 | Policy and correction | W52 → W51 → W24 → W54 → W53 → W23 | 6, 3 |
| J07 | Group assignment | W47 → W40 → W33 → W34 → W19 → W20 → W21 → W22 → W49 | 4, 5, 3, 6 |
| J08 | TA workload | W45 → W57 → W05 → W07 → W48 → W49 | 5, 6, 2 |
| J09 | Course communication | W55 → W28 → W29 → W08 → W30 → W31 → W56 | 4, 1 |
| J10 | Academic planning | W36 → W32 → W07 → W08 | 5, 2, 1 |
| J11 | Exceptions | W46 → W19 → W25 → W58 → W54 | 5, 3, 6 |
| J12 | Term continuity | W06 → W59 → W60 → W35 | 2, 5 |

The spine is **J02 → J03**: a student hands in, staff grade and release, and the student sees the result. Spec 05 Stage 1 builds exactly that, and the board's "Still to do" list names J02 and J03 as the first clickable prototype.

## Build stages (Spec 05)

| Stage | Pages | It is done when… |
|---|---|---|
| 0 Foundation | W01–W06, W10, W13 + shell and fixtures | Role and course context, deep-link returns, session and permission states, light/dark and keyboard navigation all work |
| 1 Teaching transaction | W14–W24, W35–W40, W43–W44, W48–W49, W51–W53 | Instructor publishes one assignment → student submits → TA reviews → instructor releases → student sees the right receipt and grade, with failures recovering |
| 2 Assessment depth | W25–W27, W41–W42, W45–W47, W50, W54, W57 | Quizzes, timing and allowances, TA scope and expiry, rubric override protection, groups, allocation and correction connect |
| 3 Daily course life | W07–W09, W11–W12, W28–W34, W55–W56 | Announcements, discussions, both calendars, reminders, activity, tools and help share the same records; no private-calendar leaks |
| 4 Continuity | W58–W60 + full W06 archive | Attendance and insights use facts; copy and import exclude learner records; previews go stale correctly |
| 5 QA | Every page and variant | Coverage, responsive layouts, recovery, keyboard and assistive tech, privacy and copy reviewed |
| Optional | O01–O03 | Can't alter grades, expose hidden context or block a journey |

Each page tracks six separate statuses: specified → HTML implemented → source checked → browser checked → accessibility reviewed → owner accepted. Today every page is only **specified, with a drawn concept**.

## The systems every segment shares

These cut across all six parts, so each deep dive refers back here.

**1. The record model (Spec 04).** One consistent fictional world. The key records are person and enrollment, course offering, module, assessment, quiz attempt, submission and receipt, score and review, release snapshot, grading policy, group set, allowance, calendar item, grading task, announcement and discussion, activity, tool, and copy/import preview. Every record has a stable ID and a version; anything "received" or "released" is a frozen snapshot.

**2. The state vocabulary (Spec 03).** 16 named states: loading, first-use empty, filtered empty, invalid, saving/local save, save failed, conflict/stale, offline, permission unavailable, session expiring, not yet available, archived, success, partial bulk success, denied device permission and destructive action. Each page uses only the ones relevant to it and says N/A for the rest.

**3. The status words that must never be blurred:** Draft · Queued · Received · Graded (reviewed) · Held · Released · Missing · Excused · Late (not yet defined anywhere: open defect).

**4. The permission model (Spec 02).** A 20-row capability matrix across student, instructor and TA. The TA's mode for each staff tool is set in navigation.json: read-only, assigned-only, participate, own-tasks-only or no access by default. A hidden button is not security; every deep link needs a real permission check later.

**5. The five signature pieces (System section).** The context line (where you are), the save status (where your data is), the work trail (what happened to the work), the receipt slip (proof it arrived) and honest numbers (what a grade is based on). Almost every page uses them, so they are designed once.

**6. Course identity.** Each course gets one colour and subject artwork (PHYS 110 draws motion and vectors; MATH 220 draws axes and matrices), with a plain band as fallback. Colour only identifies a course; meaning always comes with words.

**7. The scenario world (fixtures).** Alder Hill College; clock set to Tue 20 Oct 2026, 4:00 PM ET. People: Aisha (student), Dr. Reyes (instructor), Maya Chen (TA, access ends Oct 25), Ben and Carmen. Courses: PHYS 110 and MATH 220 for Fall 2026, plus MATH 120, archived from Spring 2026. Golden numbers: Aisha's released grade is 84.50% and the staff working total is 85.17%. Other scenario clocks exist for hand-in (Thu Oct 15), group work, quiz-in-progress and TA-expired.

## Decisions waiting on the owner (summary)

The full list is at the end of this document. The big ones:
1. **Narrow-web navigation:** a bottom tab bar (as drawn) or a navigation disclosure (as specified).
2. **TA "preview as student":** allowed on three pages, but the permission matrix gives it to instructors only.
3. **Quiz end rule:** W26 says "personal deadline"; the agreed rule is the earlier of personal close and start + allowed minutes.
4. **"Late":** used in one acceptance check, defined nowhere.
5. **Student attendance view:** the permission matrix gives it to students; no page shows it.
6. **Staff pages on narrow screens:** which ones get an iPad or phone layout.
7. **Logo:** pick one of the five, or stay with the typographic wordmark.


---

# Segment 1 · Foundation, access, account and system

Pages: W01, W02, W03, W04, W08, W09, W10, W11, W12, W13. Board-wide: sections 0, S, L; components C01–C16; tokens. The 17 failure scenarios are mapped to their pages at the end.

Method: full read of Specs 01–06, the ten page specs, drawn/0, S, L, A, G, X, the component and token sheets, the nav map, route manifest and fixtures. Contrast figures below were computed from the token hex values. Nothing here is browser-verified.

## Segment section

**Purpose.** This segment is everything a person touches before any course content exists, plus the rules every other page inherits. It covers the access shell (W01–W04), the global shell utilities (W08–W12), the full-page failure template (W13), the design system and the 16 components. It decides how the product looks, how it speaks and how it fails.

**Who it serves.** Everyone: guest, student, instructor and TA. W01, W02, W03, W12 and W13 are also guest-reachable. The segment is drawn almost entirely from Aisha's student view. Instructor and TA variants of W04, W08, W09, W10, W11 are not drawn.

**Journeys.** J01 Arrival (W01 → W02 → W03 → W04 → W05) lives entirely here. W08 is a step in J09 (communication) and J10 (planning). W13, W12 and W10 are not in any journey sequence but are exit paths from every one of them. Every page in the 12 journeys uses the design system.

**Build stage.** Stage 0 Foundation: W01–W04, W10, W13, the shell and the fixtures. Stage 3 Daily course life: W08, W09, W11, W12. W11 and W12 carry priority "follow-on". Stage 0 pages link to W12 (help from sign-in, W02, W13) and W10 links to W08, so Stage 0 needs stubs of both.

**Segment-wide design principles visible in the board and specs**
1. The institution owns identity. There is no password field. W01 says "Whiteboard never sees your password."
2. State is told in words and marks, never colour alone. Status badges always carry an icon and words.
3. Say what is safe. Every failure states what happened, what is kept and the one next step (W13, X scenarios). "Nothing was lost" appears in many failure messages.
4. Honest labelling. The five signature pieces exist so that "where is my data", "did it arrive", "what is this number based on" and "what happened to it" are answered the same way on every page.
5. Absence reveals nothing. Search, 403 and 404 never hint that a hidden record exists. Activity never shows a score.
6. Preference is not record. Turning delivery off, reading a notice or ending a session never changes academic data.

**Segment-wide risks**
- The board and the specs are two different documents for the access pages. Drawn W01, W03 and W04 show less than their specs require, and in places contradict them (details per page).
- The iPhone tab bar conflicts with Spec 03 (see Design system below).
- Security-sensitive copy has been drawn wrongly in two places. W03 shows a full recipient email to the wrong account, and W08 shows "8 of 10" in an activity preview.
- Only 2 of the 17 failure scenarios are drawn (the X note says "three examples"). The other 15 are one-line text.
- Prototype chrome (logo switcher, theme switcher, scenario toolbar) must not leak into the product design.

---

## Design system as a segment

### Tokens (txt/64 against drawn S)
- The ZIP defines about 20 colour tokens: bg, surface, surface-2, fill, separator, border, text, text-2, accent, accent-text, on-accent, accent-tint, success, warning, error, info and neutral (each with a -bg), plus focus and scrim. It has two shadows and system-font stacks.
- Drawn S uses different names: --bg, --bg2, --line2, --ink, --ink2, --ink3, --acc, --red, --green, --amber. It has three inks, no info or neutral, and no fill or tint. A developer who builds from the board and one who builds from the ZIP will diverge. Pick the ZIP names as canonical and relabel S.
- The dark block in txt/64 appears twice, identical. This is probably one block each for Night and a second dark variant (inferred). Only Teal and Night are specified. Ink has no token sheet at all.
- Contrast, computed:
  - Light: text-2 on surface 6.59, on bg 5.98. Border on surface 3.40, on bg 3.09, which passes the 3:1 control-boundary claim but only just. Accent on white 5.80. Focus blue on bg 4.88. Every status colour on its tint is 5.0–5.9.
  - Dark: all pairs are 4.5–8.4. Dark border on surface is 4.51.
  - Separator is 1.30 and is decorative by design. Nothing may use it as a control edge.
  - Nothing fails. Tokens are a strength.

### Type scale
Drawn: Display 32, Title 28, Heading 22, Headline 17, Body 16, Caption 13.5 tabular. Spec 03: page title 28–32, section 18–20, body 16, secondary 14. The board's 22 and 17 sit outside the spec's section range, and 13.5 is below the spec's 14 secondary size. Decide whether the board or Spec 03 wins. The board's "tabular numbers for scores and dates" is a good rule that Spec 03 does not state. `--wb-scale` exists in the tokens, but no document says how it connects to W04's three text sizes (Default, Large, Largest) or W10's single "Larger text" switch.

### Status vocabulary
S says "Students only ever see the words on this row": Not started, Draft saved, Received, Released, Late, Excused, Needs action. But:
- C04 draws "Held, not released" and "Queued", and Spec 03 requires both. They are not on the row.
- "Missing" (defined in Spec 01) is not on the row.
- "Late" is drawn but never defined. It has no rule in any spec (known defect).
- "Draft saved" collides with save-status wording (see below).
Fix: one canonical status table with owner, meaning, icon, token and who sees it.

### Five signature pieces
| Piece | Drawn in S | Matches a C component? |
|---|---|---|
| Context line | "Alder Hill College / PHYS 110 / Coursework / Problem Set 4", wraps to 2 lines on phone | Overlaps C02, which also carries a breadcrumb. Two patterns for one job. Spec 02 requires institution, course and term, and current role, but the line shows no role or term. |
| Save-status | Draft saved 10:05 AM, Saving…, Saved on this device only, Couldn't save. Your text is still here. | Overlaps C12 (Unsaved changes, Saving…, Saved locally 4:02 PM, Save failed Retry). Three wordings for local state: "Saved on this device only", "Saved locally", and X's offline banner. Spec 03 requires a Conflict state. Neither S nor C12 draws it. |
| Work trail | Draft started, Submitted, Feedback released "Not yet" | No component. |
| Receipt slip | Received AH-PHYS110-001, Attempt 1, Accepted Oct 15 · 10:12 AM | No component. C03 and C13 are different things. |
| Honest numbers | 84.50% "Released work only", three categories, "Not counted yet: Problem Set 4 (received, not released)" | No component. Spec 04 also requires represented weight ("planned total weight") and the "No released grade yet" empty text. S does not show them. |

Three of the five signature pieces are not in the 16-component contract. They need contracts: anatomy, states, tokens, and which pages must use them. Section 0 lists the pieces in a different order from S (receipt slip and honest numbers before work trail). Pick one order.

### Components C01–C16
- The header says "All 16 reusable components … C01 is a divider". Only C02–C16 are drawn, which is 15 components. Spec 03 lists 15 plus the scenario toolbar.
- Strong: C04 (held is neutral, queued is distinct from received), C06 (summary with links), C09 (not-supported file with Remove), C13 (fingerprint and exclusions), C14 (no grade in preview), C16 (kept outside the product).
- Gaps in the contract text:
  - C08 draws only a confirm dialog. It has no focus-return, Escape or destructive variant (Spec 03 destructive-action pattern).
  - C07 shows no sort-button or empty-state anatomy.
  - C10 shows no text-alternative open state.
  - C11 shows one range. It has no all-day-on, recurrence or error state.
  - C15 omits "last verified" and the eligibility labels W11 needs (confirmed, unknown, unavailable, restricted, delayed).
  - C12 has no conflict state.
- C03's sample ("due Fri Oct 16, 11:59 PM EDT", Received) is a fine golden example. The C15 name "Lab simulator" does not match W11's "Mechanics simulation". Align the sample data.

### Theming and dark mode
Section 0 offers three board themes (Teal, Ink, Night) and a logo switch. The product has two modes, light and dark, per Spec 03 and W10 (system, light, dark). Treat Night as the dark mode, not as a user-selectable third theme (inferred). Ink is undefined. Section 0 also says Stage 1 is student-only and lists 3 themes, but the file has 8 themes, which is stale. The W10 drawn row "Dark appearance — Follow my device" reads as one toggle but the spec says a three-way select. Dark-mode drawings of W01–W13 are not distinguishable in the text. They exist only through the theme switch, so no dark state was ever deliberately reviewed per screen (inferred).

### Course identity
Every course gets its own colour and artwork by subject code (physics: motion and vectors; maths: axes and matrices; unknown: plain band). PHYS 110 is teal/blue, which is also the product accent. Risks:
- Course colour and product accent can be confused.
- A chosen course colour must clear 3:1 against its card and 4.5:1 for any text on it. Only the product tokens have been checked.
- Colour is identity only and never meaning, per the W05 note and Spec 02 (calendar source colours supplement text). Keep this rule explicit.
- CHEM 101 and CS 150 are labelled "sample for future courses". They must not appear in a student's course list.

### Logo
Five directions are drawn (Board, Checked, Slip, Trail, W), with the 16 px tab test and web-clip sizes 180/152. Spec 03 says the initial mark can be typographic and no new logo is required. The Slip (receipt with a torn edge) is called most distinctive but "softens below 20 px". Board is the default pick. The wordmark is lower-case "whiteboard" on the board and Capitalised in the specs. A decision is needed. The logo picker is a design tool and must not ship.

### iPhone tab bar versus Spec 03 navigation disclosure (rule conflict)
- Drawn: iPhone W08 and W10 show a bottom bar of Today, Courses, Calendar, Activity, Tools, with an avatar top right. Search, Help and Account have no visible phone entry beyond the avatar (inferred).
- Spec 03: narrow web (320–768) uses a navigation disclosure, "not a native tab-bar promise". Spec 03 also says do not redraw the existing iPhone frames. CLAUDE.md says iPhone presentation is planned native. Section 0 says the iPhone frames are "the same web app in a browser".
- Practical problem: a tab bar fits five global items. It cannot hold the 8-item student course nav or the 9-plus staff course nav and tools. Safari's own bottom bar also competes with it ("aA whiteboard…" drawn).
- Suggested resolution (inferred, owner call): keep a five-item bottom bar only for the global shell, and use a disclosure for course and staff nav and for Search, Help, Account. Say so in Spec 03. Otherwise the web build will have to pick silently.

### Segment-level system gaps
- Spec 03 asks for an explicit "N/A rationale" per state. None exists in any drawn artifact.
- Loading skeletons, filtered-empty and partial-bulk-success states have no drawn example anywhere in this segment.
- Text size: W04 offers Default, Large and Largest. W10 offers a "Larger text" toggle. Spec W10 offers normal or larger. Three different models.
- Reduced motion and forced-colours are asserted but never shown.
- Spec 03 sample copy says TA access ends "Oct 18". Fixtures and drawn screens say Oct 25.
- No drawn screen carries the "Prototype - fictional data" label Spec 05 requires. W01's spec also requires a "fictional concept label". It is absent from drawn W01.

---

## Pages

### W01 · Institution sign-in
- **Roles / priority / stage:** guest. Core. Stage 0. Legacy P41.
- **Job to be done:** Guest: pick the school and hand off to its sign-in service, with the original deep link preserved.
- **Gets here from → goes to:** From an unauthenticated deep link, W02 retry, W03 sign-in to review, and sign-out from W10. Goes to the external institution host, then W02. "Sign-in help" goes to W12 (follow-on, Stage 3). A stub is needed in Stage 0. "Choose another school" stays on the page.
- **Drawn today:** PC and iPhone. One button "Continue with Alder Hill sign-in", the line "You will go to login.alderhill.example and come back here. Whiteboard never sees your password.", "Not Alder Hill? Choose another school · Need help signing in?". iPhone: full-width button, with the note above it. No iPad.
- **Spec in brief:** 2 fields (Institution combobox with required select-from-list, "Remember institution" checkbox). 3 actions: Continue, Choose another institution, Sign-in help. 5 states: Searching, No institution match, Handoff pending, Unavailable identity service, Wrong institution. 1 dialog, "Leaving Whiteboard". 3 acceptance checks: deep link returns after W02, unknown name leaves Continue unavailable with a reason, a failed handoff never renders authenticated navigation.
- **Data it reads/writes:** Institution directory fixture (id, name, trusted host, support URL). Validated internal return context. Reads and writes a remembered institution preference only.
- **Rules it must protect:** No password form. Return parameters never become open redirects. No account-existence hints. Failed handoff never implies signed in.
- **Design assessment:** The drawn screen is clear, calm and honest, and the host disclosure is good practice. But it is the "Alder Hill is pre-selected" version and the spec is the "search for your school" version. The combobox, remember checkbox, no-match, searching and pending states and the Leaving dialog are not drawn. The spec's header has a Help link and a fictional label, and drawn W01 has neither. "Choose another school" as a text link is the only route to the combobox, which is easy to miss. The drawn wordmark is lower-case.
- **Gaps:** Five of five states and the dialog are undrawn. Wrong-institution (a failure scenario) is not drawn. There is no iPad frame. Keyboard and combobox announcement are undrawn.
- **Open decisions:** (policy) Does the first school see a pre-selected institution or a search? Is "remember institution" allowed, and by whom? Are the IdP and protocol partner-decided? (D63)
- **Design next:** (1) PC: choose-school combobox with results and a no-match state. (2) PC and iPhone: handoff pending with host named and a retry-after-timeout message. (3) PC: identity service unavailable, with failure time and the preserved destination. (4) PC: wrong-institution message. (5) Dialog: Leaving Whiteboard. (6) iPad frame.

### W02 · Auth return/recovery
- **Roles / priority / stage:** guest, student, instructor, TA. Core. Stage 0. Legacy P41.
- **Job to be done:** Everyone: turn an institutional return into a landing context, or a recoverable failure with a way out.
- **Gets here from → goes to:** From the institutional return, an expired-session recovery from W13, and a cancelled W01 handoff. Goes to W04 on first use, W05 or the retained destination otherwise, W01 on retry, W12 for help. Without course access: W05 if another context exists, otherwise W12. The W13 "Sign in again" action goes to W01, not W02, although the W02 entry says W13 recovery lands here (minor).
- **Drawn today:** PC only, one variant: "That sign-in link has expired", with Retry sign-in, Use another account, Get technical help.
- **Spec in brief:** 2 read-only fields (Return destination, Institution). 4 actions. 5 states: Verifying, Cancelled, Expired return, Authenticated without course access, Destination unavailable. 1 dialog, "Switch signed-in account", which warns about unsent work. 3 checks: an expired callback restarts a fresh W01 with no redirect loop, first use goes to W04 and keeps the destination, a guessed course URL is still access-checked.
- **Data it reads/writes:** Simulated verification outcome, safe destination, account and role summary, a redacted correlation reference.
- **Rules it must protect:** No tokens or raw provider errors shown. A consumed callback creates no duplicate session or acceptance. Authentication alone grants no course access. No infinite spinner.
- **Design assessment:** The expired view is excellent copy ("Nothing was shared with Whiteboard"). The note names three scenarios (cancelled, expired, no course), yet only one is drawn. The drawn "Retry sign-in" and "Use another account" are two equally weighted choices. The spec's "Continue" success is never drawn. The selectable error reference is not drawn.
- **Gaps:** Verifying, cancelled, no-course-access, destination-unavailable and success are undrawn. The Switch-account dialog is undrawn. No iPhone frame, although the page is reachable on phones.
- **Open decisions:** (policy) Link validity period ("a few minutes" is hard-coded in copy). Which role loads first for a multi-role person?
- **Design next:** PC and iPhone: verifying; cancelled; no course access (account and institution shown, no course data); destination unavailable with permitted Home; the Switch-account dialog.

### W03 · Invitation
- **Roles / priority / stage:** guest, student, instructor, TA. Core. Stage 0. Legacy P42.
- **Job to be done:** The intended recipient reviews exactly which role, course and period is offered, and accepts it. A wrong account sees a block, not the details.
- **Gets here from → goes to:** From an institution invitation link, a W02 return with invitation context, or a replacement link. Goes to W04 or W14 on accept, W01 on "Sign in to review" or "Use another account", or stays for "Request replacement". The accepted-invitation view links to W14.
- **Drawn today:** PC only, the wrong-account state. It shows "Dr. Diane Reyes invited arahman@alderhill.example to join Introductory Mechanics, Fall 2026 as a student", then Role, Access, Invited by, a warning "You are signed in as bokafor@alderhill.example. This invitation is for a different account.", and the buttons Use another account and Request a new invitation.
- **Spec in brief:** 3 fields (Recipient masked until verified, Role and access period, an Acceptance checkbox shown only after full details). 4 actions. 5 states: Needs identity, Wrong account, Expired or revoked, Already accepted, Acceptance failed. 1 dialog: Accept course role. 3 checks: the wrong account cannot see the full recipient address or learner records, an expired invitation cannot be accepted from a stale page, double activation gives one result.
- **Data it reads/writes:** Invitation fixture (masked recipient, inviter, course, role, scope, expiry, status). Existing membership.
- **Rules it must protect:** Only the matching recipient sees full details. TA acceptance grants allocated scope and never release or policy authority. Wrong institution never activates. Repeat acceptance adds no duplicate role.
- **Design assessment:** Role and period are explained very well. But the drawn wrong-account screen breaks the page's own acceptance check. It prints the full intended recipient address (arahman@…) to a different signed-in person (bokafor@…) and shows the course and role. The spec says mask the recipient and "Wrong account view cannot expose full recipient address". Showing the invited role and course is arguably more than a wrong account should learn. The drawn button reads "Request a new invitation" while the spec says "Request replacement". The failure scenario "invite-expired" says "Ask for a new one".
- **Gaps:** Four of five states are undrawn, and so are the acceptance checkbox, the dialog, the TA variant and the instructor variant. There is no TA invitation example with the access end (Oct 25) that would prove the TA scope copy. No iPhone.
- **Open decisions:** (rule conflict) What a wrong-account viewer may see. The spec says masked, the drawing shows full. (policy) Invitation expiry length and who can issue replacements.
- **Design next:** Redraw the wrong-account state with a masked address and the course name withheld or reduced. Draw: needs-identity guest, matching recipient with checkbox and Accept, the Accept dialog, expired or revoked, already accepted, acceptance-not-confirmed, and a TA invitation with an access end date. Add an iPhone frame.

### W04 · Onboarding
- **Roles / priority / stage:** student, instructor, TA. Core. Stage 0. Legacy P43.
- **Job to be done:** Student, instructor, TA: confirm managed identity, set a few preferences and reach the first task. Skippable.
- **Gets here from → goes to:** From the first W02 return, an accepted W03 invitation, and a resume from W05. Goes to W05 on skip, and to W14, W35 or W48 on "Start first task" (a student to W14, an instructor to W35, a TA to W48; inferred mapping from the spec's role summaries). Preferences can be changed later in W10.
- **Drawn today:** PC only, student. A card with Aisha's name and "Student · set by Alder Hill College / From your school". Appearance (System, Light, Dark), Text size (Default, Large, Largest), a checkbox "Email me a daily summary — One email at 7:00 AM listing what is due. Receipts are always sent." Continue and Skip for now. The full global sidebar and top bar are visible around it.
- **Spec in brief:** 4 fields: Preferred name, Time zone (required, with a deadline preview in both zones), Landing context, Optional delivery. 3-step progress (Confirm details, Preferences, First task). 4 actions. 5 states: Identity mismatch, Multiple roles, No assigned course, Save failed, Resumed. 1 dialog: Skip setup. 3 checks: skip grants nothing and fabricates no consent, a timezone change previews one deadline in both zones, a failed save stays unsaved.
- **Data it reads/writes:** Identity, assigned contexts, a preference draft and completion flags.
- **Rules it must protect:** Role is shown and never chosen. Onboarding creates no enrolment. Delivery consent is separate from required operation. A TA's first task shows no release control.
- **Design assessment:** The drawn copy is warm and the "role from the school, never a choice" principle is visible. Disagreements with the spec:
  - It is a single card, not the three-step flow, and there is no progress list.
  - Time zone is a required field and is not drawn. Landing context is not drawn either.
  - It draws appearance and text size, which the spec's onboarding does not list.
  - It draws the full signed-in sidebar and course list around a page that Spec 02 places in the "Access shell", where there is no signed-in course navigation yet (rule conflict, minor).
  - "Receipts are always sent" implies email is on, while W08 says email delivery is off by default in the fixture and receipts appear in-app. "Email me a daily summary" appears nowhere in W08's settings. Delivery vocabulary is inconsistent across W04, W08 and W10.
- **Gaps:** Steps 1 and 3 are undrawn. Instructor, TA and multi-role variants are undrawn. Save-failed, no-course, resumed and identity-dispute states and the Skip dialog are undrawn. No iPhone, even though a first run on a phone is likely.
- **Open decisions:** (policy) Is a daily summary email offered at all? Which text-size model is canonical (three sizes or two)? Do TAs and instructors get different first-task copy?
- **Design next:** PC: step 1 (confirm details, with correction contact); step 2 (time zone with dual-zone preview, delivery); step 3 (first task per role, including TA allocated work). Multiple-roles landing picker. Save-failed. No-course welcome. The Skip dialog. iPhone for all steps.

### W08 · Activity and notification settings
- **Roles / priority / stage:** student, instructor, TA. Core. Stage 3. Legacy S13.
- **Job to be done:** Student: see what happened to my work this term and set delivery. Instructor: see grading and release tasks. TA: see allocation and deadline events in scope.
- **Gets here from → goes to:** From global Activity, W05 update cards, W07 reminder settings and W10. Goes to W19, W22, W23, W29, W32 or W48 as the item requires. There is no route to W27 (quiz receipt), although quiz feedback notices exist. This is a known defect.
- **Drawn today:** PC (student): filters All, Unread, Feedback, Deadlines. Four items. A "How you hear about it" panel: In-app Always on, Email (Feedback and deadlines), Browser alerts "Blocked by this browser", Save delivery settings. A "Mark all read" button. iPhone: list only. iPhone "Class cancelled" variant: a New notice at the top with the instructor's reason quoted.
- **Spec in brief:** 3 fields (Filters term/course/type/unread, Email/browser delivery, Class reminder lead). 5 actions: Open update, Mark read/unread, Load older, Save delivery settings, Enable browser delivery. 5 states: No activity, Older history loading, Feedback update, Delivery blocked, Settings save failed. 1 dialog: Browser notifications. 3 checks: disabling delivery keeps history, a held staff score creates no learner score or progress preview, a failed save never says saved.
- **Data it reads/writes:** Event reference and version, term, type, personal read state, source time. Browser permission state kept apart from the saved preference.
- **Rules it must protect:** No score in any preview, email or browser text. Hidden content leaves no event or count hint. Reading changes only personal read state. A TA gets allocated facts only.
- **Design assessment:** The separation of history from delivery is the right idea and is drawn well. Problems:
  - **The drawn item "Feedback released: Quiz 2 / PHYS 110 · 8 of 10" shows a score in an activity preview.** This breaks the spec ("no score, grade delta or rubric detail"), C14 ("Never expose a grade in notification preview") and WD19. The "8 of 10" must go.
  - The list is not in time order: New Today, Oct 18, Oct 15, then Oct 20.
  - The W10 iPhone says "Email on, browser off". The W08 fixture says delivery is off by default.
  - The spec's term and course filters, class reminder lead, "Load older" and the settings drawer are not drawn. Settings sit inline, not in a drawer.
  - "Mark all read" has no confirmation or opener dialog and no spec action. The spec has per-item mark read/unread only (known defect: dialog with no opener).
  - The iPhone frame has no visible way to reach the delivery settings, though its note says it is "one tap away".
- **Gaps:** Instructor and TA lists are undrawn. No-activity, filtered-empty, loading, save-failed, delivery-blocked after an attempt, and the browser-notification dialog are undrawn. A cancelled-class notice should also show reminder invalidation (Spec 03).
- **Open decisions:** (rule conflict) Is "Mark all read" in scope? If yes, it needs a spec action. (policy) What "Always on" means for in-app, and whether any channel is on by default. (policy) Whether a cancelled class is a notice or an announcement (the drawn notice carries the instructor's reason text).
- **Design next:** Redraw the Quiz 2 item as "Feedback released: Quiz 2" with no score. PC and iPhone: no-activity and filtered-empty; settings drawer with reminder lead; save-failed; the Browser notifications dialog. Instructor activity (grading and release tasks). TA activity (allocation and deadline). iPhone settings entry.

### W09 · Global academic search
- **Roles / priority / stage:** student, instructor, TA. Core. Stage 3. Legacy P45.
- **Job to be done:** Student: find permitted material fast. Instructor, TA: find in their own scope.
- **Gets here from → goes to:** From the Search button or shortcut, W05, and W17 "find related". The entry list says "W10 shared tools", which is wrong (the tools page is W11). Goes to W14, W17, W19, W25, W29, W31 or W11 by result type. There is no W16 or W18 destination for module or coursework-list results.
- **Drawn today:** PC (student), query "projectile". Filter chips All, Courses, Coursework, Materials, Discussions; "Include archive"; "4 results" with type chips. One archived result (MATH 120, Spring 2026).
- **Spec in brief:** 3 fields (Query 2–200 characters, Type/course/term, Include archive). 4 actions. 5 states: No query, Searching, No results, Archived result, Stale result. 1 dialog: Clear search history. 3 checks: hidden lesson title reveals nothing, Back restores filters, a failed search keeps the query.
- **Data it reads/writes:** A permitted content index fixture, URL query state, optional recent queries.
- **Rules it must protect:** Permissions apply before snippets, counts and suggestions. Private calendar events are excluded. A staff query must not keep staff results after switching to learner context. Held grades and unpublished or locked material never appear.
- **Design assessment:** The "absent from counts" note matches the spec. Results carry course, term and type, and the archive label shows before opening. But results are flat, where the spec asks for grouping (courses, materials, coursework, announcements, discussions, tools). "Quiz 3: Projectile motion" is listed, and Quiz 3 opens Wednesday, so the result should show "Opens Wed Oct 21". No snippet text is drawn although the spec requires one. Nothing says held grades are excluded (known defect). The type filter has no Announcements or Tools, which are result types the spec lists.
- **Gaps:** No-query with recent queries, loading, no-results, stale, search-failed and the clear-history dialog are undrawn. Instructor and TA scope are undrawn. No iPhone, where search is reached from a tab bar that has no Search item.
- **Open decisions:** (rule conflict) Held grades excluded: say it in the spec. (policy) Whether recent queries are stored at all.
- **Design next:** PC and iPhone: no-query; no-results with scope explanation; a failed search; stale result. Draw grouped results with snippets and a "not open yet" label. An instructor search that shows staff-only results with a clear context label.

### W10 · Profile/account/preferences
- **Roles / priority / stage:** student, instructor, TA. Core. Stage 0. Legacy P44.
- **Job to be done:** Everyone: set display preferences, see managed identity, end sessions, sign out.
- **Gets here from → goes to:** From the account menu, W04 resume, W08 preference link and shared-page returns. Goes to W08 for notification settings, W01 on sign out, W12 for identity corrections. Session-stale goes to W02 through W01.
- **Drawn today:** PC: Profile (photo, "managed by Alder Hill College" email, Preferred name, Pronouns optional, Time zone), Display (Larger text, Reduce motion, Dark appearance "Follow my device"), Sessions ("This computer · active now", End other sessions, Sign out). iPhone: managed identity first, Preferences list (including a Notifications row), Sign out.
- **Spec in brief:** 4 fields (Preferred name, Pronouns, Time zone with preview, Theme/text/motion selects). 5 actions: Save, Change photo, Notification settings, End other session, Sign out. 5 states: Managed identity, Photo pending, Save rejected, Session stale, Unsaved changes. 2 dialogs: End session, Leave unsaved preferences. 3 checks: blank pronouns save, a timezone change preserves event instants, a failed session end stays unconfirmed.
- **Data it reads/writes:** Editable preference fixture, managed identity facts, photo review status, session summaries (no tokens).
- **Rules it must protect:** Managed values are read-only. No local password controls. Session facts are private from course staff. Role is read-only.
- **Design assessment:** The managed versus editable split is clear. Issues: the drawn "End other sessions" is one bulk action, while the spec is "End other session" per selected session. The drawn page shows only one session, so the choice is never needed. Display rows are drawn as switches but the spec's theme is a three-way select. The Save preferences button is not drawn. The Sign out warning about unsent work is not drawn. The PC frame has no link to notification settings; only the phone has one. Display settings overlap W04 (three text sizes) with a binary "Larger text". For a TA, W10 is the natural place to show "Access ends Oct 25", which is undrawn.
- **Gaps:** Photo pending, save-rejected, session-stale and unsaved-changes states and both dialogs are undrawn. Instructor and TA frames are undrawn. A time zone preview is not drawn.
- **Open decisions:** (policy) Are pronouns shown to others at all, and where? (policy) Photo review ownership. (rule conflict) Text-size model (see W04).
- **Design next:** PC: with the Save bar and unsaved indicator; photo pending; save-rejected with field errors; two-session list with the End session dialog; sign-out with unsent work; a TA view that shows the access end. iPhone: the same states.

### W11 · Academic software/tools directory
- **Roles / priority / stage:** student, instructor, TA. Required, priority "follow-on". Stage 3. New (no legacy ID).
- **Job to be done:** Student: find which approved tools my course needs and how I get access. Instructor: see the same, with course-policy cross-links. TA: same, read-only (inferred).
- **Gets here from → goes to:** From global Tools, W14, W17 and W09 results. Goes to W12 (tool help), W15 (course policy) or an external provider. The "Continue to provider" action is not drawn.
- **Drawn today:** PC (student): two cards, "Mechanics simulation" (PHYS 110, label "Sample access") and "Institution-approved AI tool" (label "Unknown", with "AI is not permitted during quizzes" for PHYS 110). Each has "Open access instructions". A footer note: "A listing never promises a free licence."
- **Spec in brief:** 3 fields (Search tools, Course/status filters, Selected tool via URL ID). 5 actions: View details, Open access instructions, Continue to provider, Get help, Open course policy. 5 states: Eligibility confirmed, Eligibility unknown, Unavailable/expired, Course restriction, Catalog delayed. 1 dialog: Open external academic tool. 3 checks: unknown eligibility cannot show a "free access" call-to-action, a course AI prohibition stays visible, a failed refresh keeps a dated label.
- **Data it reads/writes:** A catalogue fixture (tool ID, purpose, eligibility, licence status, owner, expiry), a course policy reference, last-verified metadata.
- **Rules it must protect:** A listing never promises a licence. Course policy outranks the institution listing. No admin or procurement UI. No credentials.
- **Design assessment:** The honest "Unknown" label is the right instinct. The drawn "Sample access" is a label that is not in the spec's vocabulary and is ambiguous: does it mean eligibility confirmed or "demo"? The cards omit the C15 fields: owner, expiry, last verified, "needs your Alder Hill account". Sample tools data includes a real product name (Gemini), which implies a licence (known defect). The detail drawer, filters and search are undrawn. A tool's course restriction is drawn on the card, which is good.
- **Gaps:** Confirmed, unavailable or expired, delayed catalogue, no-results, drawer, dialog and the invalid-ID drawer are undrawn. No iPhone. Nothing is drawn for instructor or TA.
- **Open decisions:** (policy) Directory ownership and who verifies entitlement (D63 partner discovery). (policy) Which sample tool names are safe to ship in fixtures.
- **Design next:** PC and iPhone: a card per eligibility state using C15 in full; a detail drawer; the external-link dialog; a stale-catalogue banner; a "restricted by this course" card. Rename "Sample access" to a spec label.

### W12 · Help/technical request
- **Roles / priority / stage:** guest, student, instructor, TA. Required, priority "follow-on". Stage 3. Legacy P46.
- **Job to be done:** Everyone: find an answer or send a reviewable technical request. The request never changes coursework.
- **Gets here from → goes to:** From global Help, sign-in recovery (W01, W02, W13), contextual failures in upload and quiz, and W11 tool help. Goes back to the original task ("Return to work"). Guest entry is listed in the spec, but the drawn page appears only in the signed-in shell.
- **Drawn today:** PC (student): a search box, four help articles, and a "Report a problem" form with Where did it happen (Upload page), What happened (prefilled text), and the line "We will include your browser and the page address. No grades or file contents." Button "Review request". A note: "Sending a request does not submit coursework or extend a deadline."
- **Spec in brief:** 4 fields (Issue location, What happened 20–3000 characters, Diagnostics checkboxes, Screenshot). 5 actions: Search help, Review request, Submit technical request, Return to work, Retry request. 5 states: Article only, Attachment failed, Offline draft, Acknowledgement unknown, Received. 1 dialog: Review technical request. 3 checks: a receipt never changes W22 or W27, an offline Submit never invents a reference, removing all diagnostics still allows submission.
- **Data it reads/writes:** A help article fixture, a request draft, selected diagnostics, a simulated acknowledgement and reference.
- **Rules it must protect:** Diagnostics are opt-in and individually reviewable, unchecked until reviewed. Grades, answers and private messages are never automatic. Guests see only redacted sign-in diagnostics. The page never claims a deadline was extended.
- **Design assessment:** The "this does not submit coursework" note is right and early. But the drawn line "We will include your browser and the page address" states that diagnostics are included. The spec says each diagnostic is a separate checkbox, unchecked by default, and review shows the exact payload. The screenshot field, diagnostics checklist and the "never included" list are not drawn. The Review dialog (exact payload and recipient) is not drawn. Help is linked from the Stage 0 sign-in page, but the signed-out shell a guest sees is undrawn.
- **Gaps:** Guest variant, attachment-failed, offline draft, unknown acknowledgement, received (with reference and sample label) and the Review dialog are undrawn. No iPhone.
- **Open decisions:** (policy) Who receives the request (institution IT is assumed). (policy) The spec's "Request status panel" implies a request-status history that has no owner.
- **Design next:** PC and iPhone: form with a per-item diagnostics list and the "never included" list; the Review dialog; received with reference; offline draft; unknown acknowledgement; attachment failed. Guest version inside the access shell.

### W13 · System states
- **Roles / priority / stage:** guest, student, instructor, TA. Core. Stage 0. New (no legacy ID).
- **Job to be done:** Everyone: understand a blocked, missing, expired or unavailable page and find a safe next step.
- **Gets here from → goes to:** From route guards, unmatched routes, session expiry and maintenance. Goes to a safe previous page, W05 Home, W01 (sign in again), W12 (help), or retries in place.
- **Drawn today:** PC: five stacked cards. 403 "This page is not available to your account", 404, SESSION "You were signed out", MAINTENANCE "Whiteboard is unavailable right now", RECOVERY FAILED "Still unavailable". Each has actions.
- **Spec in brief:** 3 fields (State code enum, Return context, Reference). 5 actions: Back, Go Home, Sign in again, Retry availability, Get technical help. 5 states: 403, 404, Session expired, Maintenance, Recovery failed. 1 dialog: Leave unsent work. 3 checks: a guessed private submission URL exposes no learner name, expired-session recovery rechecks access, maintenance Retry cannot claim success or auto-refresh a form.
- **Data it reads/writes:** State reason enum, a safe context, the last acknowledged operation, an optional redacted reference.
- **Rules it must protect:** 403 and 404 reveal nothing. No invented ETA. No infinite spin. A TA's expired access cannot be fixed by choosing instructor context. A return URL cannot bypass guards.
- **Design assessment:** Copy is the best in the segment ("We do not say what is on the page", "Maintenance never invents a time"). The state set differs between documents:
  - Spec 02 names "service-error" as a variant. W13's spec has recovery-failed and no general service error (known defect).
  - The enum has four values but there are five states, so "recovery failed" has no route code.
  - The 403 suggests "Switch to a course or role you have". For an expired TA this is wrong guidance, because the spec says role selection cannot recover expiry.
  - The reference code and timestamp the spec lists are not drawn.
  - Session-expired copy ("Nothing new was submitted. Any work saved earlier is still saved.") is good, but the "unsent work" dialog it should trigger is undrawn.
- **Gaps:** No iPhone, though recovery must fit at 400% zoom. A TA-access-ended variant (Spec 03 sample: "You can grade assigned questions until Oct 18, 11:59 pm ET. Only the instructor can restore access.", with the date wrong; fixtures say Oct 25) is not drawn here. Guest-shell versions are undrawn. The Leave unsent work dialog is undrawn.
- **Open decisions:** (rule conflict) Add a service-error state, or fold it into maintenance. (policy) Whether TA access-ended is a W13 state or a banner in the page.
- **Design next:** iPhone and PC: reference code and timestamp on each state; a TA-expired variant; a service-error variant; the Leave-unsent-work dialog; guest-shell versions of session-expired and maintenance.

---

## The 17 failure scenarios mapped to pages

Source: fixtures failure_scenarios and drawn X. The X note says "three examples ... are drawn in full", but only two scenarios are, since upload and interrupted upload are the same.

| # | Scenario | Page | Drawn | Note |
|---|---|---|---|---|
| 1 | wrong-institution | W01 | one line | Not drawn on W01. Spec has the state. |
| 2 | invite-expired | W03 | one line | Spec has "Expired or revoked". |
| 3 | source-delayed | W07 | one line | Outside this segment. |
| 4 | module-locked | W16 | one line | Outside this segment. |
| 5 | upload-interrupted | W20 | full (PC, iPhone) | Good copy. Retry sits on the file. |
| 6 | unsupported-file | W20 | one line | C09 draws a .heic row. |
| 7 | offline-draft | W20 | full (iPad) | Submit disabled with a reason. |
| 8 | attempt-concurrent-submit | W21 | one line | Outside this segment. |
| 9 | ta-expired | W49 | one line | "Saved marks stay held". Align with Spec 02: attributed grading remains intact. |
| 10 | score-conflict | W49 | one line | Outside this segment. |
| 11 | release-preview-stale | W53 | one line | Outside this segment. |
| 12 | weights-not-100 | W52 | one line | Outside this segment. |
| 13 | empty-category | W24 | one line | Outside this segment. |
| 14 | group-membership-changed | W34 | one line | Outside this segment. |
| 15 | quiz-save-unacknowledged | W26 | one line | Outside this segment. |
| 16 | import-unsupported-type | W60 | one line | Outside this segment. |
| 17 | calendar-permission-denied | W07 | one line | Outside this segment. |

Findings:
- None of the 17 maps to W13, W02, W08, W09, W10, W11 or W12. The segment's own failures (session expired, 403, 404, maintenance, delivery blocked, settings save failed, request offline, catalogue delayed, search failed, identity service down) are not injectable from C16's "Inject failure…". Add them.
- Only 2 are drawn, 15 are copy-only. In this segment's pages the failures are specified in the page specs but not drawn.
- The two drawn upload scenarios use the right pattern (inline, next to the file, "Nothing was lost"). Use it as the model for the other 15.

---

## Segment fix list

1. [rule-conflict] W08: remove "8 of 10" from the Quiz 2 activity item. Previews carry no score (W08 spec, C14, WD19).
2. [rule-conflict] W03: the wrong-account view prints the full recipient address and the course and role. Mask it per the spec's acceptance check, then redraw.
3. [rule-conflict] Decide the iPhone navigation: bottom tab bar versus the disclosure in Spec 03. Recommended (inferred): a five-item bar for global destinations only, and a disclosure for course nav, staff nav and Search/Help/Account. Update Spec 03.
4. [state] W01: draw the school search combobox, no-match, pending, identity-unavailable and wrong-institution states and the Leaving dialog. Drawn W01 omits the spec's Help link and fictional label.
5. [state] W02: draw verifying, cancelled, no-course-access, destination-unavailable and the Switch-account dialog (only expired is drawn).
6. [state] W04: draw the 3-step flow with required time zone and dual-zone preview, landing context, TA first task and Skip dialog. Reconcile with the access shell.
7. [link] W08 has no route to W27 (quiz receipt). W09's entry text says "W10 shared tools", which should be W11. Stage 0 pages link to W12, a Stage 3 follow-on page, so a stub is needed.
8. [state] W13: add the service-error variant, a reference code and timestamp, a TA access-ended variant, the Leave-unsent-work dialog and iPhone frames. Correct the 403 copy for expired TA access.
9. [state] W12: change drawn diagnostics to unchecked, opt-in and per-item. Draw the Review dialog, received (with reference), offline draft, unknown acknowledgement and the guest version.
10. [data] Failure injection list: add the segment's own failures to C16. Only 2 of 17 scenarios are drawn.
11. [state] Draw the C12 conflict state. Give the context line, work trail, receipt slip and honest numbers component contracts. Resolve the overlap between "Context line" and C02, and between "Save-status" and C12 (three wordings of "local").
12. [data] Token naming: the board's --bg2, --line2, --ink2, --ink3, --acc, --red, --green, --amber versus the ZIP tokens. Add info, neutral and fill to S. Remove or label the duplicated dark block in txt/64. Define the Ink theme or drop it.
13. [rule-conflict] Status vocabulary: S says students see only seven words, but C04 and W24 need "Held", "Queued" and "Missing". Define "Late" or remove it from S. Make one table.
14. [copy] Text size and appearance: W04 (Default, Large, Largest), W10 (Larger text toggle), Spec (normal or larger). Dark mode: toggle versus a three-way select. Pick one model.
15. [rule-conflict] Delivery defaults: W04 says "receipts are always sent" by email, W10 iPhone says "Email on", W08 fixture says off. Choose one.
16. [data] Section 0 is stale: "Stage 1 is the student path" and "3 themes" versus 8 themes and instructor and TA views. The C-sheet title says 16 components but draws 15.
17. [device] Missing frames: iPad for W01. iPhone for W02, W03, W04, W09, W11, W12, W13. Instructor and TA frames for W04, W08, W09, W10, W11.
18. [state] W09: draw grouped results with snippets, no-query with recents, no-results, stale and failure. State that held grades are excluded. Show "opens Wed" for the not-yet-open Quiz 3.
19. [state] W10: draw Save bar, unsaved-changes, photo pending, save-rejected, two-session list and both dialogs. Show the TA access-end date.
20. [state] W11: replace the "Sample access" label with the spec vocabulary. Add the C15 owner, expiry and last-verified fields. Draw the drawer, the external-link dialog and a stale catalogue. Remove the real product name from sample data.
21. [copy] Spec 03 sample says TA access ends Oct 18. Fixtures say Oct 25. "Authorised" versus "authorized". Logo wordmark case (lower-case "whiteboard" on the board). "Request a new invitation" versus "Request replacement".
22. [data] Course identity: confirm that course colours pass contrast and do not clash with the teal accent. Keep sample courses CHEM 101 and CS 150 out of real course lists. Prototype-only logo and theme switchers must not ship.


---

# Segment 2 · Every day: home, courses, calendars, course content

Pages: W05, W06, W07, W14, W15, W16, W17, W18, W32. Sources: Spec 01–06, page specs, drawn/B.txt (student) and drawn/T.txt (instructor/TA), fixtures overview, known-defects review (15 Nov). Journey numbers J01–J12 are not in the extracted text; I number them in the order of Spec 04 "Critical journeys" (inferred): J01 Arrival, J02 Individual work, J03 Grade and release, J04 Course setup, J05 Quiz, J06 Policy/grades, J07 Group work, J08 TA workload, J09 Communication, J10 Calendar, J11 Exceptions, J12 Term continuity.

## Segment section

**Purpose.** The pages people open every day. Home says what needs me; Courses finds a course or a past term; the calendars (W07 global, W32 per course) show when things happen; W14–W18 are the course front door, syllabus, module path, lesson and work list. Everything else (submit, grade, release) is reached from here.

**Who it serves.** Student (Aisha) is the main design. Instructor (Dr. Reyes) and TA (Maya, access to Oct 25) have drawn variants only for W05, W06, W07, W14, W18 and W32 (all PC). Nothing is drawn for staff on W15, W16, W17.

**Journeys.** J01 (W05 is the exit of Arrival), J02 (W06 → W14 → W16/W17 → W18 → W19), J03 (W05 "ready to release", W14 staff next-actions, W18 staff counts), J04 (W14 student preview), J08 (W05/W07/W14 TA home and deadline), J09 (W05, W32 notices), J10 (W07, W32: the whole calendar journey), J11 (W18 personal extension), J12 (W06 archive, W14 archived banner). J05–J07 only touch these pages by link.

**Build stage.** W05, W06 are Stage 0 (W06 archive depth Stage 4). W14–W18 Stage 1. W07 and W32 Stage 3 (daily course life). So W14/W18 must ship before the calendar rules they link to exist; Stage 1 links to W07/W32 need bounded stubs.

**Design principles visible in the screens**
1. One question per page: "what needs me?" Home gives one hero, a week strip, then plain lists; counts are exact, never risk scores.
2. Course identity by colour plus artwork, one banner per course (PHYS 110 blue, MATH 220 violet), same layout so people learn it once. Meaning is never colour alone (words and icons on every status).
3. Truthful, quiet states: "Nothing due this week" with a next step; held feedback shows "Received / Not released" with no marking-progress hint.
4. Source and authority are visible: "from the registrar", "Only you", "staff only" dashed, "Course, published by Dr. Reyes, Version 1".
5. Same record, many views: one event ID/version shared by W07 and W32, personal due dates lead, course dates secondary.
6. Staff pages reuse student layout with fewer or different actions (TA = same page, fewer buttons).

**Segment-wide risks**
- Staff shell is drawn inconsistently with Spec 02: the TA W14 screen shows the full 10-item instructor nav; "Assessments" is missing from every staff nav; W18 staff breadcrumb says "Builder".
- Staff numbers disagree across W05/W14/W18 (see W18).
- Registrar-sourced classes can be cancelled by the instructor on screen, against WD15/Spec 01.
- Numbers on Home show a released score, against the W05 spec.
- Module names and counts differ between W14, W16 and the staff W14.
- "Instructor and TA" composite screens (W06, W07, W18) draw two people's views as one page. A person has one role per course, so these are hard to turn into a test.
- No narrow staff designs; iPhone uses a bottom tab bar against Spec 03 (known).

---

### W05 · Role-aware Home
- **Roles / priority / stage:** student, instructor, TA / core / Stage 0 (legacy S01, S14, S17).
- **Job to be done:** Student: see the one next thing, what is handed in, what was just released. Instructor: see what needs release, review, opening soon. TA: see own allocated marking, its deadline and when access ends.
- **Gets here from → goes to:** From W02 return, global nav, W04 completion, back from tools. Goes to W19 (next work; but drawn hero is Quiz 3, so W25 is the right target, which the spec does not list), W35 (teaching course; the instructor drawn card leads to release, so also W53), W48 (TA allocation), W07, W08. "Open next work" for the TA has nothing to open, so it is disabled/empty.
- **Drawn today:** Student PC (hero "Next up · opens in 16 hours" Quiz 3; Needs you: Quiz 3, Motion investigation; Handed in: PS4 Received; Recently released: Quiz 2 "8 / 10"; week strip Mon 19–Sun 25; Coming up: Quiz 3 opens, class "from the registrar", Library shift "only you can see this · Personal"; Courses list). Student iPad (same, no Recently released, no course list). Student iPhone (large title, hero, week strip, lists, bottom tab bar). Instructor PC ("Ready to release PS4, 1 of 3 learners", Needs you: Release PS4 / Quiz 3 allowances / PS4 marking due Fri 5:00 PM "On track"). TA PC ("Your marking": PS4 Q1a–4, 2 learners, "2 of 2 reviewed", note on access end and what a TA cannot do). No staff iPad/iPhone.
- **Spec in brief:** Fields: academic context, term. Actions: open next work (student), open teaching course (instructor), open allocated grading (TA), view calendar, view activity. 5 states (quiet day, source delayed, TA expiry, role changed, partial load failure); 1 dialog (change academic context). 3 acceptance checks.
- **Data it reads/writes:** Reads role-filtered task summaries, personal dates, receipt state, source timestamps, calendar/activity record IDs, grading task (Maya, due Fri Oct 23 5 PM, access end Oct 25). Writes nothing.
- **Rules it must protect:** No grade or score in preview cards; staff counts never in learner cards; TA sees allocated work only, no release/policy; private calendar titles owner-only; context is never inferred from the last selection.
- **Design assessment:** Strong hierarchy and honest counts. Defects: (1) student "Recently released Quiz 2 8 / 10" breaks "no score in preview cards" and acceptance check 1 [rule conflict]; (2) instructor "Coming up: Dr. Reyes office hours Tue 2:00 PM" is already past at 4:00 PM Tuesday; (3) TA card sits under "Needs you" yet says "Nothing left in your allocation / All reviewed"; (4) instructor "PS4 marking due … 2 of 2 reviewed … On track" should read complete, and "reviewed by you" conflicts with Maya reviewing the work; (5) iPad drops the Courses list and Recently released with no stated rule; (6) hero opens a quiz that is not yet open, "Needs you" lists it as a task though nothing can be done (should read "Opens Wed").
- **Gaps:** Quiet day, source delayed, partial panel failure, TA expiry (ended/approaching), role changed, and the Change-context dialog are not drawn. No student with zero courses, no TA with empty allocation (spec acceptance check 2 needs it). No staff iPad/iPhone. Term select is not visible in the drawn bar (only a "Fall 2026" label). Dark mode unseen.
- **Open decisions:** Do released scores appear on Home? (rule conflict, spec says no; drawn says yes.) Is Home's hero allowed to be a not-yet-open item (policy)? One role per context or composite "staff" Home for people who teach one course and TA another (policy).
- **Design next:** PC: student quiet day; student partial failure (calendar panel down, courses still work); TA empty allocation; TA access ended with saved-work reassurance; context switch dialog; instructor with nothing to release. iPhone: instructor and TA Home. Fix Quiz 2 card to "Feedback released" without score.

### W06 · Courses and term archive
- **Roles / priority / stage:** student, instructor, TA / core / Stage 0, archive depth Stage 4 (legacy S02).
- **Job to be done:** Student: find current and past courses by term. Instructor: find courses taught. TA: find courses assisted and see when access ends.
- **Gets here from → goes to:** From global nav, W05 cards, W09 course results, back from W14. Goes to W14 (open course, with archive banner), same page (past term), W12 (ask about missing access). All resolve; W12 is marked follow-on elsewhere but is linked from Stage 0 (known).
- **Drawn today:** Student PC current (Fall 2026, PHYS 110 and MATH 220 cards with next task, "Ask about access"). Student PC past (Spring 2026: MATH 120, "Read-only archive", "Available: Syllabus · Coursework · Grades", "Available years: Spring 2026 and later"). Student iPhone (cards). Staff PC ("Courses you teach or assist": PHYS 110 as Instructor "Next: release PS4 feedback" and as TA (Maya Chen) "Access ends Oct 25"). No staff past term, no iPad.
- **Spec in brief:** Fields: year/term, course query, role filter (filters in URL). Actions: open course, select past term, clear filters, ask about missing access. 5 states (no current courses, no matches, read-only archive, history unavailable, archive load failed); dialog "Archived course access". 3 acceptance checks.
- **Data it reads/writes:** Membership summary, institution term catalogue, retention/access, next-work summary. Read only.
- **Rules it must protect:** Cards filtered by active or retained membership; archived student sees only own work and released feedback; staff role expiry removes historical staff access even if student enrollment stays; never enumerate hidden courses; no promise of permanent history.
- **Design assessment:** The past-term screen is exactly on message ("earlier terms are kept by the school"). Defects: the staff screen draws one PHYS 110 as instructor and again as TA under one account, which contradicts one-role-per-course (Spec 02) and shows two people's sessions; staff URL is `?role=staff` while the spec filter has instructor/TA values; archived card lists "Grades" for MATH 120 although W24 for archives is only implied; copy "we will include the term you selected" is vague about what is sent to W12.
- **Gaps:** Archived access dialog, "No current courses", "No filter matches", "History unavailable", "Archive load failed" not drawn. Year select and role-filter options not shown opened. Staff past term, TA with ended access (how an expired staff role looks in the archive), and iPad missing. Next-task text for TA/instructor courses on narrow screens.
- **Open decisions:** Retention period for archive and for TA history (policy). Does a TA see a past course after access ends, even read-only (policy)? Which "Available" areas does each archived role get (policy).
- **Design next:** PC: no-current-courses, filtered-empty, load-failed (term kept), history-unavailable; archive dialog. Staff: past term with an expired TA row. iPhone: archive card.

### W07 · Personal/global academic calendar
- **Roles / priority / stage:** student, instructor, TA / core / Stage 3 (legacy S12).
- **Job to be done:** Student: one planner for course dates, due dates and private events. Instructor: course dates, private events, view of TA marking deadlines. TA: own marking deadline and access end next to private events.
- **Gets here from → goes to:** From global nav, W05 events, W32 combined link, W57 deadline link (W57 not drawn here). Goes to W19, W25, W32, W48 (open item), W57 (manage grading deadlines, instructor), W08 (reminder settings). All resolve; W25 is a quiz open, not a receipt, so no link to W27 (known).
- **Drawn today:** Student PC (week Oct 19–25, Agenda/Week/Month, toggles PHYS 110 / MATH 220 / Private events, due strip: "Quiz 3 closes", "MATH 220 quiz", "Motion investigation due", private "Library work shift Only you" gray; drawer for the shift with Visible to Only you, Repeats, Reminder 30 min before, Edit/Delete; drawer for registrar class with "Copied from the registrar · Last updated Oct 19, 6:00 AM"). Student iPhone (3-day grid). Instructor/TA PC composite (toggles PHYS 110 / Staff grading tasks / Private events; dashed "PS4 marking due Fri Oct 23 5:00 PM · staff only"; drawer "Assigned to Maya Chen · Visible to Maya Chen, Dr. Reyes · Student due date Oct 16 (separate)").
- **Spec in brief:** Fields (private editor): title 1–160, start/end/zone with DST rule, repeat with end date, reminder (none/at time/10/30 min). Actions: add private event, edit/delete (occurrence or series), open academic item, manage grading deadlines (instructor), reminder settings. States: unsaved, recurring edit, stale source, permission denied (notifications), offline. Dialogs: apply recurring change, delete private event. 3 acceptance checks.
- **Data it reads/writes:** Reads shared academic event ID/version, source timestamp/zone, personal allowance, staff grading task references. Writes private event, recurrence exceptions, reminder preference (owner-only). Fixture records: lecture-oct21, office-hours, private-shift, grading-due.
- **Rules it must protect:** Private events never reach W32, staff views, rosters, exports or role-switch; the planner cannot be read by an instructor or TA; academic dates are read-only here; students never see staff grading targets; TA deadline independent of student due date; moving or cancelling an event retires its reminder; source label and freshness on registrar items.
- **Design assessment:** Privacy language is clear ("Only you", gray, no staff toggle for students). Defects: (1) student grid shows a "MATH 220 quiz" due Thursday while MATH 220 W14 and W06 both say "Nothing due this week" [data]; (2) the "Due" strip has no times or course name for the MATH quiz and the Quiz 3 title is not linked to course colour in the text; (3) iPhone draws a 3-day time grid, the spec makes Agenda the narrow default with a non-grid alternative [device]; (4) the staff screen is an instructor/TA composite, and instructor's staff toggle lacks the student-due toggle the spec names; (5) staff view lacks any private event of the owner and a MATH 220 legend, so it cannot prove "private stays private across role switches"; (6) "TA deadlines originate from W57" but "Manage grading deadlines" for instructors is the only drawn action, and W32 says TA can too (rule conflict, known).
- **Gaps:** Private-event editor (add, with errors, unsaved draft badge), recurring-scope dialog, delete dialog, stale-source label, notification-blocked, offline, month/agenda views, cancelled/moved item with reminder note, TA expired access state (task greys out), week-of-DST, narrow staff views are all undrawn. No dialogs on any screen despite 2 specified.
- **Open decisions:** Who may edit TA deadlines, instructor only (W07) or TA own read (W32)? (rule conflict.) Does a student see "Class cancelled" in the combined view? (policy.) Reminder sender and delivery authority for registrar events (policy).
- **Design next:** PC student: add-private-event editor with validation; recurring edit dialog; delete dialog; agenda view; cancelled class with reminder invalidated; stale registrar item. PC TA: expiring access. iPhone: agenda default, add event full-width.

### W14 · Course home
- **Roles / priority / stage:** student, instructor, TA / core / Stage 1 (legacy S03).
- **Job to be done:** Student: pick up where I am, see due soon and the latest announcement. Instructor: see learner/held/review counts, course state, next actions and preview as a learner. TA: see only my allocated marking and what I cannot do.
- **Gets here from → goes to:** From W06, W05, W09, accepted W03 invitation. Goes to W16/W17 (continue), W18, W24 (grades), W35 (builder) or W48 (TA), preview toggle. Syllabus (W15) is meant to be a visible overview link but no drawn nav item or card leads there (unresolved in drawings).
- **Drawn today:** Student PHYS 110 PC and iPhone (banner Section 01, nav tabs, Due soon, latest announcement "Quiz 3 covers projectile motion only", Modules list with percents). Student MATH 220 PC and iPhone (violet art, "Nothing due this week", Modules · sample). Instructor PC (Learners 3 · 1 TA; Results held 1; Awaiting review 0; Course state Published; Next actions: Release PS4, Review Quiz 3 allowances, Preview as learner; "What learners can reach": Modules 2 of 3, Assignments 2, Quizzes 1, Syllabus Version 1). TA PC (Your work: PS4, Aisha, Ben, 2 of 2 reviewed, note about scope and access end).
- **Spec in brief:** Fields: view context, module focus. Actions: continue module, view coursework, view grades, open course tools (W35/W48), enter/exit student preview. States: course not published, archived, nothing due, delayed overview, staff preview. Dialog: leave student preview. 3 checks (no draft leak, grade card without score, exit preview records nothing).
- **Data it reads/writes:** Publication/archive facts, membership, nav, next work (same data as W18/W19), module progress. Preview must not write.
- **Rules it must protect:** No draft module names before publication; grade card shows availability not score; preview is conspicuous, reversible, cannot submit/complete/trigger reminders; TA scope and expiry; archived read-only.
- **Design assessment:** The strongest page: one banner, same layout for two courses, honest empty state. Defects: (1) student module list (Module 3 Kinematics 100%, Module 4 Projectile 40%, Module 5 Forces 0%) disagrees with W16 (Module 1 Motion in 1D, Module 2 Vectors and projectile, Module 3 Forces locked) [data]; (2) staff "Modules 2 of 3 published" but the student sees three modules including a locked one with a title, which leaks an unpublished title unless all three are published [data]; (3) staff "Quizzes 1 published / Assignments 2 published" does not match W18 (Quiz 2 + Quiz 3, PS1–4 + Motion investigation + lab); (4) staff "Awaiting review 0" conflicts with W18 "Reviewed 1 of 2"; (5) TA nav shows Builder, Gradebook, People, Settings, which Spec 02 says a TA must not see [rule conflict]; (6) instructor nav lacks Syllabus and "Assessments"; (7) preview is drawn as a button but its persistent banner is absent; the TA can preview in the spec but not per the matrix (known); (8) student cards show no grade card at all despite W24 being one of the three actions.
- **Gaps:** Not published, archived, delayed-overview, preview banner and exit dialog are undrawn. No student Grades availability card, no office-hour facts, no teaching contacts (spec layout). No iPad; no staff iPhone.
- **Open decisions:** May a TA preview as a student (rule conflict, known). Does a not-yet-open module show its title to learners (policy, matches W16 "not open yet").
- **Design next:** PC: student unpublished/archived banners; staff preview mode with persistent bar and leave dialog; student with grade card (availability only); TA nav limited to allowed entries. Fix module naming across W14/W16.

### W15 · Syllabus/grading summary
- **Roles / priority / stage:** student, instructor, TA / core / Stage 1 (legacy S03, S04).
- **Job to be done:** Student: read the published syllabus and plain grading rules. Instructor: check what students see and jump to policy/settings. TA: read operational rules.
- **Gets here from → goes to:** From W14 nav, W19 rule link, W24 explanation, W11 AI policy. Goes to W24, W18, W52 (instructor edit policy), W36 (edit details). The "from W14" path is not drawn (no Syllabus tab in either nav).
- **Drawn today:** Student PC (Version 1 · current, find box, Download accessible syllabus, Contacts, Late work, AI rules, grading categories 40/25/35, letter bands, Special cases: excused, missing, not graded, rounding; links View my grades, Open coursework). Student iPhone (grading first). No staff variant.
- **Spec in brief:** Fields: policy version (read-only), find within syllabus. Actions: download, view grades, open coursework, edit policy (instructor), edit course details. States: published, policy not configured, document unavailable, policy changed, course restriction. Dialog: published policy history. 3 checks.
- **Data it reads/writes:** Published syllabus asset/version, structured grading policy, course AI rule. Read only.
- **Rules it must protect:** Syllabus policy is not the learner's released calculation; no hardcoded weights if policy absent; no fabricated grade; PDF failure keeps rules readable; stricter course AI rule wins; no silent rewrite of releases.
- **Design assessment:** Plain and well worded; weights match fixture (84.50%). Defects: the note says instructors get an Edit policy action but no instructor view is drawn; late-work copy "closed Oct 18" uses a close date that no other screen mentions; "Not graded yet: left out until released" is wrong vs spec "received-but-ungraded excluded" (graded-but-held is also excluded, which is a different case); iPhone omits contacts/AI/late rules entirely (not just collapsed).
- **Gaps:** Instructor and TA variants; policy-not-configured; document-unavailable; policy-changed with history; history dialog; version picker; archived banner; AI restriction beside a tool link; no iPad.
- **Open decisions:** Does the TA get the Edit buttons disabled or absent (policy). Where does the AI rule live: syllabus vs W11 (policy). Policy history visibility for students (policy).
- **Design next:** PC: instructor variant with Edit policy/details; policy-changed + history dialog; document-failed; unconfigured. TA view. iPhone: full section list.

### W16 · Modules
- **Roles / priority / stage:** student, instructor, TA / core / Stage 1 (legacy S04).
- **Job to be done:** Student: see ordered modules, what unlocks each, and what I have completed. Instructor: preview what learners see and jump to edit. TA: read.
- **Gets here from → goes to:** From W14 continue, nav, W17 breadcrumb, W09. Goes to W17 (lessons), W19/W25 (assessments), W37 (instructor edit). Dialog "Reset my manual completion" has no opener (known).
- **Drawn today:** Student PC (Module 1 complete 4 of 4; Module 2 current 2 of 4 with Lesson Done, Reading Unopened, Quiz 3 Opens Wed, Motion investigation In progress; Module 3 locked until Module 2; requirement panel "2 of 4 complete"). Student iPhone (collapsed). No staff drawing.
- **Spec in brief:** Fields: module filter, expanded modules. Actions: open item, open assessment, inspect requirement, mark authored completion, edit module (instructor). States: available, not open yet, prerequisite locked, completion pending, archived. Dialog: reset manual completion. 3 checks (Module 3 does not complete Module 4; locked items blocked by direct route; failed completion leaves counts).
- **Data it reads/writes:** Module order/version, items, availability; per-learner per-module requirement state (separate from assessment submission). Writes manual completion.
- **Rules it must protect:** Completion per learner and module; expansion never completes; hidden/unpublished items not titled; no completion in preview/archive/offline.
- **Design assessment:** Clear lock reason and text progress. Defects: "6 items complete" has no denominator; Module 2 "2 of 4 done" but only one item is shown Done (Quiz 3 not open, Motion investigation in progress) [data]; the requirement ties module completion to finishing a quiz and a group assignment, but the spec says module state is separate from assessment submission [rule conflict]; Module 3 title shown while the staff view says "2 of 3 published" (see W14); iPhone loses the requirements panel.
- **Gaps:** Not-open-yet, completion pending/failed, archived, reset dialog (and opener), filter with no results, staff preview/edit, TA view, expand all, iPad.
- **Open decisions:** May a module require an assessment as completion criterion (rule conflict). Do locked titles show (policy; matches "permitted title").
- **Design next:** PC: failed completion; not-open-yet; reset dialog from a "Mark as unread" control; staff preview with Edit module. iPhone: requirements under the locked item.

### W17 · Lesson/material
- **Roles / priority / stage:** student, instructor, TA / core / Stage 1 (legacy S04).
- **Job to be done:** Student: read with accessible media and move to the next item. Instructor: see how the published version reads and open the editor. TA: read.
- **Gets here from → goes to:** From W16, W14, W09, W31. Goes to W17/W19/W25 (next), W38 (edit), same page (download, alternative, complete).
- **Drawn today:** Student PC (Vectors and components; figure with text description link; video with captions and transcript; "Completion Automatic when opened", "Version 1 · published", Download, Use accessible alternative, Up next: reading). Student iPhone (one column, Next item dock; transcript and download not visible). No staff.
- **Spec in brief:** Fields: media playback, manual completion, find in lesson. Actions: download, accessible alternative, mark complete, next item, edit lesson. States: loading file, unsupported preview, alternative missing, availability changed, completion failed. Dialog: open external material. 3 checks.
- **Data it reads/writes:** Lesson/module IDs, published version, blocks, files; own completion state. Writes manual completion only.
- **Rules it must protect:** Opening is not completing; download is the displayed version; replaced files do not change submitted snapshots; no accessibility certification claim; availability recheck removes protected content.
- **Design assessment:** Good reading layout and alt/caption evidence. Defects: drawn lesson uses automatic completion, so the manual "Mark complete" and its failure copy (the case that matters) is only on the reading, which is not drawn; "Next item" appears as a button but the up-next card repeats it; iPhone shows no completion state; breadcrumb shows only "Modules / Vectors and components".
- **Gaps:** Manual-completion reading page, failed completion, loading file, unsupported preview, alternative missing, availability changed, external-link dialog, find-in-lesson, staff/preview view, TA view, iPad.
- **Open decisions:** Who owns the accessible-alternative report path (policy, W12). Preview-as-student completion (policy; spec says no mutation).
- **Design next:** PC: manual-completion lesson incl. failure; unsupported-file; availability-changed redirect; external-material dialog; staff version with Edit lesson. iPhone: full completion and download controls.

### W18 · Coursework list
- **Roles / priority / stage:** student, instructor, TA / core / Stage 1 (legacy S03, S05, S10).
- **Job to be done:** Student: scan every assignment/quiz with personal due date, status and released score. Instructor: see received/reviewed/released counts and create assessments. TA: see rows in own allocation.
- **Gets here from → goes to:** From course nav, W14, W15, back from W19/W25. Goes to W19, W25, W24, W40/W41 (create), W48 (grading). W27 receipt reachable only through W22/W27 text, not a drawn link.
- **Drawn today:** Student PC (tabs All 8 / To do 2 / Handed in 1 / Released 4; table Title, Type, Due, Status, Score; PS4 Received Not released; Motion investigation In progress; Quiz 3 Opens Oct 21; PS3 Excused Not counted; PS1/2, lab, Quiz 2 with scores). Student iPad (same, Quiz 2 cut), iPhone (two-line rows). Staff PC "Instructor and TA" (breadcrumb "Builder", columns Due/Received/Reviewed/Released: PS4 2 of 3 / 1 of 2 / 0 of 1; Motion investigation 1 team; Quiz 3 empty; Quiz 2 Done 3/3).
- **Spec in brief:** Fields: type/status/category, sort (default personal due soonest, missing due last), search ≤160. Actions: open assignment/quiz, view grades, create assessment (W40/W41 chooser), open grading queue. States: no published work, no filter matches, personal extension, received/feedback held, source failed. Dialog: choose assessment type. 3 checks.
- **Data it reads/writes:** Assessment summary, published dates, personal allowance, receipt reference, group mode, release availability. Staff counts from review records.
- **Rules it must protect:** No graded-but-held status or score in learner rows or filter counts; personal due leads, no private basis; staff due-to-grade dates stay out of learner rows; list failure never reads as "missing".
- **Design assessment:** Table is the right pattern; score column explains blanks. Defects: (1) no category, points, sort or search in the drawn controls [state]; (2) "Quiz 3 due Oct 22 / Opens Oct 21" mixes due and close vocabulary used elsewhere ("closes Thu"); (3) staff numbers do not agree: instructor "Reviewed 1 of 2, Released 0 of 1" vs W14 "Awaiting review 0" and W05 TA "2 of 2 reviewed" [data]; (4) staff nav lacks Coursework and breadcrumb says Builder; (5) the Quiz 3 row has no allowance indicator in staff view though W14 says one is active (staff only, fine, but W18 student row does not show the personal extension state either); (6) "Not counted" on excused is clear, but "Not released" in the score cell for PS4 also tells the student a score exists, which is consistent with "no marking-progress hint" only because the state is receipt-based.
- **Gaps:** No published work, filtered empty, personal extension row, load failed, choose-type dialog, TA-limited view (only a note), empty staff list, narrow staff list, Group badge detail.
- **Open decisions:** Show "late" status (undefined, known; policy). Staff counts when TA has partial scope (policy).
- **Design next:** PC: student empty/filtered/failed/personal extension row; staff chooser dialog with quiz path; TA-scoped list. iPhone: staff counts. Fix breadcrumb and nav.

### W32 · Course calendar (incl. class-cancel flow)
- **Roles / priority / stage:** student, instructor, TA / core / Stage 3 (legacy S12, S03).
- **Job to be done:** Student: day-by-day timeline of this course, next class/quiz/exam. Instructor: publish, edit and cancel course events. TA: read, plus own grading deadline link.
- **Gets here from → goes to:** From course nav, W07 detail, W14, W29. Goes to W19/W25, W07, W57. Activity (W08) receives the cancel notice but the notice is not drawn.
- **Drawn today:** Student PC/iPad/iPhone (filters All/Classes/Quizzes/Exams/Assignments, strip Next class/quiz/exam, per-week day list, midterm drawer "Source Course, published by Dr. Reyes, Version 1, Changes None"). Student cancelled PC (banner "Class cancelled … Reason from Dr. Reyes", Next class moves to Fri Oct 23, row "Class · Cancelled"). Instructor PC (Add course event; "Cancel class" on every upcoming class; event form Draft: title, type Exam, starts, Publication Draft, Publish event/Save draft). Instructor cancel dialog (required reason; Who is told: all 3 students and the TA; How: Whiteboard notice and email; When: right away; "You can restore the class later, and students are told again"; Keep class / Cancel class and tell students). Instructor cancelled result (Sent banner "told at 4:02 PM", row Cancelled with "Told 3 of 3 students", Restore class).
- **Spec in brief:** Fields: title/type, start/end/zone, repeat/end, publication (draft default). Actions: open event, view combined, create/publish, edit/cancel (reviewed occurrence/series; invalidate reminders), manage deadlines. States: draft, published, one occurrence changed, cancelled, source delayed, publish failed. Dialogs: publish/change, cancel occurrence/series. 4 checks (one shared event ID in W07/W32, one occurrence edit keeps series, private events never appear, failed publish keeps prior version and reminders).
- **Data it reads/writes:** Shared event ID/version/source, recurrence/exception, cancellation; assessment dates plus allowance; staff allocation separate. Writes course event, cancel with reason, notice, reminder invalidation.
- **Rules it must protect:** Registrar-sourced meetings are read-only; instructor edits only Whiteboard-owned events; private W07 events never enter W32; draft invisible to students; cancel/move invalidates reminders; notices carry no hidden data; cancel notifies per preferences, not by guarantee.
- **Design assessment:** The cancel flow is clear and the dialog states who and how. Defects: (1) classes are labelled "from the registrar" in W07 but the instructor can "Cancel class" on them, which contradicts WD15/Spec 01 and the W32 disabled-when "source-managed" [rule conflict]; (2) dialog has no occurrence/series choice, no reminder effect ("your 30-minute reminder for this class is cancelled") and no sign who has reminders; (3) "How: notice and email" ignores notification preferences/blocked delivery (W08) and the no-real-email prototype boundary; (4) student footer reads "students cannot move them" and "Source Course" for a class the registrar owns, while the class list implies registrar source; (5) midterm is drawn as published (student) and also Draft (instructor form), so the two views disagree; (6) "Unopened" on an exam and quiz is an odd word; (7) the "Cancelled" text repeats the reason twice for students; (8) the student's Activity badge stays at 2 although a notice is claimed; (9) Restore tells students again but no restore dialog, cancelled-class reminders revival, or conflict with Quiz timing is drawn.
- **Gaps:** Student combined W07 view of a cancelled class; Activity notice; TA view; edit one occurrence; publish failed; source delayed; draft event preview; agenda/week/month toggle (only agenda drawn); iPhone instructor; cancel of today/started class; restore dialog; reminder invalidation visible.
- **Open decisions:** Who may cancel a registrar class: instructor posts a "not meeting" notice only, or registrar must cancel (rule conflict, policy). Do email notices respect preferences (policy). May a TA see the cancel notice (policy).
- **Design next:** PC instructor: cancel dialog with scope and reminder effect, registrar-class variant ("Post a class notice; timetable change goes to registrar"), restore dialog, publish-failed, one-occurrence edit. PC/iPhone student: W08 notice and W07 cancelled row with reminder retired. PC TA: read-only.

---

## Segment fix list
1. [rule-conflict] Registrar-sourced classes show a Cancel class action for the instructor (W32), contradicting read-only source meetings (WD15, Spec 01). Decide: restrict to Whiteboard-owned events, or change the label to a class notice.
2. [rule-conflict] Home shows "8 / 10" on Quiz 2 (W05 student) against "no grade or score in preview cards".
3. [rule-conflict] TA shell shows full instructor nav (Builder, Gradebook, People, Settings) (W14), and staff nav omits Assessments/Syllabus; W18 staff breadcrumb says "Builder".
4. [state] W32 cancel dialog: add occurrence/series scope and explicit "reminders cancelled" note; add student Activity (W08) notice and W07 cancelled row.
5. [data] Staff counts disagree: W14 Awaiting review 0 vs W18 Reviewed 1 of 2 vs W05 TA 2 of 2 vs "reviewed by you"; Modules 2 of 3 published vs three student-visible modules; Quizzes 1 published vs two quizzes.
6. [data] Module names/percents differ between W14 and W16; Module 2 "2 of 4" shows one Done; "6 items complete" has no denominator.
7. [data] W07 shows a "MATH 220 quiz" due this week while W14/W06 for MATH 220 say nothing due.
8. [rule-conflict] W16 requires finishing an assessment for module completion; spec keeps module state separate from submission.
9. [state] Draw missing states: W05 quiet/partial failure/TA empty/TA expiry/context dialog; W06 empty/filtered/failed/history-unavailable/archive dialog; W07 editor, recurrence, delete, offline, denied, stale; W14 unpublished/archived/preview bar/leave dialog; W15 policy-not-set/unavailable/changed/history; W17 manual completion and failures.
10. [data] W05 instructor "Coming up" lists past office hours (Tue 2 PM at 4 PM); TA card "Needs you" with nothing to do; PS4 "On track" while 2 of 2 reviewed.
11. [rule-conflict] Grading-deadline authority: W07 instructor-only, W32 instructor/TA; preview as student for TA (known).
12. [link] No visible path to W15 from either W14 nav; W16 reset dialog and W27 notice links unresolved (known).
13. [state] W32 midterm is Published for students and Draft for instructor; show drafts only to staff with a label in the timeline.
14. [device] W07 iPhone is a time grid, spec default is agenda; iPhone bottom tab bar vs Spec 03 disclosure; no staff narrow designs; iPad cropping (Quiz 2, courses list).
15. [state] Staff variants of W15, W16, W17 are not drawn; composite "Instructor and TA" screens (W06, W07, W18) should be split by role.
16. [copy] "Not graded yet: left out until released" (W15) vs "received-but-ungraded excluded"; "due" vs "closes" for quizzes; "Unopened" for exams; "Course dates come from the course" under registrar-sourced rows; "no grade yet" variants.


---

# Segment 3 · Student hand-in, results and quizzes (W19–W27)

Sources read: Specs 01–06, W19–W27 specs, W18/W08/W07/W12/W41/W46 cross-refs, drawn/C, D, E, X, drawn/S status row, the 15 Nov review file. The fixtures overview lists only dataset shapes. The grade golden values come from Spec 04 and the drawn screens, so I re-derived them below. Facts are from the text. "(inferred)" marks my reading.

## Segment overview

**Purpose.** Take a student from "I read the brief" to "I hold an immutable proof it was received" to "I understand exactly what the released result means for my course grade". Quizzes run the same ladder under a clock. The segment turns work into records (draft, receipt, attempt) and turns staff results into learner-visible facts (release snapshot, released-only total).

**Who it serves.** Students (all nine pages). Instructors appear only as read-only learner preview on W23/W24, as "Edit" on W19/W25, and as staff preview on W25. TAs appear only on W19/W25 (read). Nothing here lets a TA or instructor submit or release.

**Journeys.** The brief lists J01–J12 but the files I was given do not number them. By name, Spec 04 puts this segment in:
- Individual work: W18/W19, W20, W21, W22.
- Grade and release, learner end: W23/W24.
- Quiz: W25, W26, W27.
- Policy/grades, learner end: W24.
- Group work: W19–W22 and W24, shared attempt.
- Exceptions: W19/W25 personal rules and the more-time request.
- Term continuity: W22/W24 under archive.

**Build stage.** Stage 1 holds W19–W24, with the receipt and learner grade as the exit check. Stage 2 holds W25–W27. All are "core", required, with route scopes as in the route manifest.

**Segment-wide principles visible in the screens and specs**
1. Facts versus policy. A receipt is a fact and never changes. Review, score and key are policy and appear only after release (W27 note, W22 "It is not a grade").
2. An honest ladder of states. Draft (local) → Draft saved (server-acknowledged) → Sending → Received. Nothing before "Received" gets a receipt ID, a Received badge or success language. "Queued" must never look like "Received" (Spec 03).
3. Learner arithmetic uses released snapshots only. Held work shows "Feedback not released", with no score and no progress hint (W22, W24, W27).
4. Every failure names what is safe, what is not, and the one fix (X board, Spec 03 copy examples).
5. Time is authoritative on the server. The quiz clock is derived from the start time and never reset by refresh (W25/W26). The frontend never invents an accepted time.
6. No web promises of lockdown, background sync, durable offline storage, or cheating verdicts from focus loss.

**Segment-wide risks**
- Drawn and spec states diverge on the most consequential screens. W21 confirmation, W25 acknowledgement and the offline copy are the main cases.
- The drawn "now" is inconsistent. W19–W22 sit on Oct 15, W26/W27 on Oct 21, W24 on Oct 20 (first-world clock), and the fixture clock is Tue Oct 20, 4:00 PM ET.
- "Late" is never defined as a status (see W21).
- Per-answer save and offline copy contradict the "no background sync" principle.
- The late-start quiz threshold is wrong in the drawn copy (see W25).
- iPhone frames promise native camera capture. Spec 03 says do not redraw iPhone, and native iOS is a separate planned target.
- No staff destination is specified for the "unsent quiz draft requiring staff review".

---

### W19 · Assignment detail
- **Roles / priority / stage:** student (own and group work), instructor and TA read-only. Core. Stage 1. Route `/courses/:courseId/assignments/:assignmentId`. Legacy S05.
- **Job to be done:**
  - Student: know what is due, what is marked, which files are accepted, what the AI rule is, and what their current attempt state is, before touching work.
  - Instructor: open Edit (W40).
  - TA: read the brief. No allowance approval.
- **Gets here from → goes to:**
  - From W18 row, W05 next work, W07 due event, W17 linked assessment, W08 "Open update". Also W14 next-work card and W15 rule link (inferred from W14/W15 specs).
  - To W20 (Add work), W22 (receipt), W23 (feedback), W40 (instructor edit).
  - The more-time request stays on the same page. All of these resolve.
- **Drawn today:**
  - PC (student): header "Problem Set 4: Kinematics" with a "Not started" badge. Subtitle "Thursday, Oct 15 · 10:00 AM · you have not added anything yet". Brief paragraph. Questions-and-marks table, 1a/1b/2/3/4 totalling 30. Accepted files "PDF, PNG or JPG · up to 10 files · 25 MiB each". A status card showing "Not received", Due Fri Oct 16 11:59 PM, Closes Sun Oct 18 11:59 PM, Marks 30, Version 2, primary "Add work". AI note "clarify concepts only".
  - iPhone: status card first, brief after, sticky Add work. "Closes Sun, Oct 18" has no time.
  - Not drawn: instructor/TA view, group variant, any of the five states other than not-started, and the request-more-time dialog.
- **Spec in brief:**
  - 3 fields: submission method (read-only), more-time reason (20–1000 chars, no medical documentation), requested deadline (future, explicit zone).
  - 5 actions: Add work/resume, View receipt/history, View released feedback, Request more time, Edit assignment.
  - 5 states: not open yet, draft not submitted, received, closed without receipt, group unassigned.
  - 1 dialog (request more time), 3 acceptance checks.
- **Data it reads/writes:** reads the published assignment and version, rubric reference, formats and limits, personal timing, the own draft and attempt summaries, group eligibility and the allowance outcome. Writes only a typed more-time request, which creates no receipt and changes no date.
- **Rules it must protect:**
  - A request is not an approved extension, and no approval is implied.
  - Adding files cannot create a receipt.
  - A direct Add work URL for an unassigned group member stays blocked, with no individual workaround.
  - Personal due and close are primary and the course date is secondary.
  - The allowance basis never appears (medical basis never shown to peers).
  - Past close with no receipt says exactly that.
- **Design assessment:**
  - Works: the status card with the single primary action, dates beside it, the question and marks table, the AI rule in plain words. The mobile order is right.
  - Disagrees with the spec:
    - Two status words on one screen ("Not started" header, "Not received" card). The student status vocabulary (drawn/S) lists "Not started, Draft saved, Received, Released, Late, Excused, Needs action". "Not received" and "Missing" are not in it.
    - Only one due date appears, so there is no "personal" versus "course" labelling.
    - The Oct 15 10:00 AM subtitle reads like a due date (inferred: it is the scenario clock).
    - Missing: attempts permitted, group/individual mode, category and weight, rubric (readable stacked criteria), late and resubmission rule, "Camera if permitted" method.
    - The brief uses "marks"; the spec and fixtures say "points".
  - Copy: "You have not added anything yet" next to a calendar time is ambiguous.
- **Gaps:** received, closed-without-receipt, not-open, group-unassigned and pending-request states are undrawn. Also undrawn: the request dialog, the disabled Add work reason line (required by the accessibility rule), instructor and TA views, and a narrow-web layout.
- **Open decisions:**
  - Policy: whether a request after close is allowed. Whether the reason may reach the instructor only.
  - Policy: whether a quiz has an equivalent request. W25 has none, yet the matrix says "request through typed context".
  - Rule conflict: "no medical documentation" cannot be enforced on a free-text field. Needs a copy warning and a staff rule.
- **Design next:**
  - PC and iPhone: Closed-without-receipt (with Request more time) and Received.
  - PC: the dialog and its pending state.
  - PC: Group assignment with unassigned and assigned variants.
  - PC: Not-open.
  - PC: Instructor read-only view.
  - PC and iPhone: personal versus course date labels.

### W20 · Add work
- **Roles / priority / stage:** student only. Core. Stage 1. Legacy S06.
- **Job to be done:** student: prepare files or pages for one attempt, tag pages to questions, and know this is still a draft.
- **Gets here from → goes to:**
  - From W19 Add work/resume, W21 Edit work, and W22 Start new attempt.
  - To W21 (Review work) and W19 (Return). All resolve.
- **Drawn today:**
  - PC: "Add your work", "Draft saved 10:05 AM", a dropzone "Drop files here, or choose files", one file `aisha-ps4-sample.pdf` · 4 pages · "Saved", tags p.1 1a,1b / p.2 2 / p.3 3 / p.4 4, and the note "Instructors and TAs see the same tags". Buttons: Review and submit, Save and close.
  - iPhone: adds "or take a photo" and a four-up tag grid. A dock holds the next step.
  - X board: upload-interrupted (PC and iPhone) and offline-draft (iPad). Details below.
- **Spec in brief:**
  - 4 fields: files (type, size and page limits; reject empty, corrupt or password-protected PDF with a reason), page question tags (published IDs only), page order (unique positions, keyboard Move up/down), capture source (files always, camera only where secure and permitted).
  - 5 actions: choose files, use camera, reorder/remove, review work, return.
  - 5 states: camera denied, invalid file, processing failed, offline, interrupted draft.
  - 2 dialogs: remove page, camera explanation. 3 acceptance checks.
  - Upload states from the fixtures: selected_local, uploading_sample, processing_sample, failed, accepted_in_attempt.
- **Data it reads/writes:** writes draft item IDs, file metadata, order, tags and processing status. Reads the attempt target, assignment version and browser retention capability. The fixtures model retention explicitly.
- **Rules it must protect:**
  - Draft or capture never submits.
  - Draft vs queued vs received (Spec 02/03 require all three distinguished):
    - Local, this device only (not acknowledged).
    - Draft saved (server-acknowledged, no receipt).
    - Sending, then Received (W21/W22 only).
    - "Queued" has no web state. W21 says "no background web queue promise". If it exists it can only be a pending commit, and must never look like Received.
  - Offline preparation never shows Received or a receipt reference.
  - Removing or reordering changes the review payload only. Earlier received attempts are untouched.
  - Group target and membership are revalidated before W21.
  - No cloud-drive or photo-library access.
- **Design assessment:**
  - Works:
    - Per-file status with the tag section.
    - The explicit "Draft saved" label.
    - Failure copy that says what is safe ("Nothing was lost. Your other files and tags are saved").
    - Offline: "Saved on this device only" in the status and the banner, with a disabled "Reconnect to submit" and a reason.
  - Disagrees or is thin:
    - The dropzone leads on PC, but the spec says the picker is the universal route and drag/drop is optional.
    - The tags are static text. There is no multi-select control, no page thumbnails or preview, no reorder, rotate or remove, no processing states, and no per-file size and type.
    - The offline copy says the draft "will save to Whiteboard when you reconnect". The spec says "keep tab open; reconnect" and "no background-sync claim". The 17-failure list says "Sends when you reconnect and confirm", which is also off. It promises automation that is not guaranteed. Reword to "Reconnect, then choose Save".
    - The interrupted screen says "Your other files and tags are saved". Only one file is listed and it is the one that stopped at 62%. Tags for p.1–p.4 on a PDF that has not fully uploaded are contradictory.
    - The iPhone interrupted screen keeps "Review and submit" enabled while a file has failed. The spec disables Review while an item is processing or invalid.
    - The failure list says "Nothing was submitted", the screen says "Nothing was lost". Pick one.
    - The iPhone "take a photo straight into the draft" implies native capture. For web it is "browser camera only if permitted" (W20 spec). Native iOS is a planned, separate target.
- **Gaps:**
  - Undrawn: unsupported or oversized file, processing failed, camera explanation, camera denied, remove-page dialog, invalid-tag, over-limit count, interrupted draft (browser lost selection), and a session-expired draft.
  - No tag editor for a page that answers several questions.
  - No pending-submission lock state.
  - Nothing at tablet or narrow web.
- **Open decisions:**
  - Policy: durability of the draft. Server draft "saved" versus device-only. Today the spec says both ("Own draft" server; "no durable offline storage").
  - Policy: upload formats and size are "configurable sample bounds", not a promise.
  - Policy: accessible-alternative (non-photo) route.
  - Whether required question coverage is mandatory (the spec says only when the assignment specifies; W21 drawn assumes it is).
- **Design next:**
  - PC: invalid file (name and reason, valid files kept).
  - PC: processing failed.
  - PC: camera explanation and denied.
  - PC: tag editor and reorder with Move up/down.
  - PC: remove-page dialog.
  - PC: interrupted draft with "reattach original files".
  - iPhone: native camera only if the owner decides native is in scope.
  - Fix the offline copy and the interrupted-upload tag state.

### W21 · Review and submit
- **Roles / priority / stage:** student. Core. Stage 1. Legacy S07.
- **Job to be done:** student: confirm the exact payload once, send it once, and recover safely if the outcome is unknown.
- **Gets here from → goes to:**
  - From W20 validated draft, W19 resume review, and W34 group submission action. The W34 → W21 link needs checking because W34 is a group workspace page.
  - To W22 on success and W20 on Edit. Cancel goes to W19. "Check submission status" stays on the page or goes to W22.
- **Drawn today:**
  - PC and iPhone: "Review and submit", "Draft saved 10:05 AM", "1 file · 4 pages", file name, checks "All 5 questions have a page" and "Within the limits". One checkbox "This is my own work. I have said what help I used, as the course AI rule asks." The note "Submitting creates your receipt. A received attempt can't be edited afterwards." Buttons: Submit work (the only filled button on iPhone) and Back to files.
  - Not drawn: any of the six states, the confirm dialog, or the group view.
- **Spec in brief:**
  - 3 fields: review confirmation (confirm exact payload; any change resets it), submission note (≤1000 chars), target group (read-only).
  - 5 actions: Edit work, Inspect page/file, Submit attempt, Check status, Cancel.
  - 6 states: coverage invalid, ready, sending, outcome unknown, rules changed, offline.
  - 1 dialog (Submit this attempt) and 4 acceptance checks.
  - Disabled-when for Submit: unconfirmed, invalid, offline, personal close reached, attempts exhausted, submission pending. "Passing due alone marks late and does not block when close is still open."
- **Data it reads/writes:** reads the reviewed payload fingerprint, ordered item references, target and membership version. Writes a submission operation reference and an acknowledged attempt. There is no mutable receipt copy.
- **Rules it must protect:**
  - One action, one acknowledged attempt (double-click yields one).
  - A timeout never produces a success receipt. Check status first, then resend.
  - Changing order, content or membership clears the confirmation.
  - Preview or staff cannot produce a learner receipt.
  - A concurrent send resolves to the one accepted attempt.
- **Design assessment:**
  - Works: checks first, one deliberate confirmation, the plain irreversible-receipt line, a single filled button.
  - Disagrees:
    - The drawn checkbox is an academic-honesty attestation. The spec checkbox is "confirm the exact current payload". These are different legal acts and the drawn one has no payload-binding.
    - No target, attempt number, personal deadline or member snapshot beside Submit.
    - No submission note, and no submit dialog.
    - "Draft saved" is shown on a screen where the spec wants "Draft, not submitted".
    - No "Late" indication (see below).
- **"Late" is never defined as a status.** Five places touch it:
  - The status-word row in drawn/S lists "Late" but has no colour or token.
  - W21's disabled-when and acceptance check, which is the only functional definition: accepted after personal due, before personal close.
  - W19, W22 and W18 (not read in detail) do not show it.
  - The syllabus mentions a "late work" rule.
  - W58 uses "Late" as an attendance value, a name collision.
  - Open: is Late computed from accepted time at receipt (so it is immutable, a receipt fact) or recomputed against a changing allowance? Who sees it (student, grader)? Does it carry a penalty? The spec leaves late penalties to the institution.
  - Recommend: a receipt fact "Received after due" computed once from accepted time versus the personal due then in force. Neutral wording. No penalty implied. W21 warns before send when past due and before close.
- **Gaps:** Sending, Outcome unknown, Rules changed, Coverage invalid, Offline (W21-specific), the confirmation dialog, a group snapshot and the concurrent-send message ("Another attempt was sent at the same time. Shows which one was received." is text only). No past-due warning and no past-close recovery view.
- **Open decisions:** rule conflict: confirmation semantics (payload confirmation versus integrity attestation). Policy: whether an integrity attestation is wanted at all, and whether it is a required field or part of the submission note. Policy: Late wording and whether to show it to graders.
- **Design next:** PC: Ready with a full commit panel (attempt, target, personal deadline, count); the dialog; Sending; Outcome unknown (keeps the payload, "Check status"); Rules changed (differences); Coverage invalid (links to pages); Late warning; at/after close recovery; group variant. iPhone: sticky commit panel.

### W22 · Receipt/attempt history
- **Roles / priority / stage:** student (own or authorized group receipts). Core. Stage 1. Legacy S08.
- **Job to be done:** student: hold immutable proof, inspect exactly what was received, start another permitted attempt without touching the old one.
- **Gets here from → goes to:**
  - From W21, W19 link, W23 receipt reference, W34 shared group receipt, W24 View receipt, W08 "Open update", and W18.
  - To W20 (new attempt), W23 (feedback), W06 (archive) and W12 (help).
  - W24 links to "W22 or W27", consistent.
- **Drawn today:**
  - PC: "Your receipt · Locked · cannot be changed". A slip: Received, Receipt ID AH-PHYS110-001, Assignment, Version 2, Attempt 1, Accepted Thu Oct 15 10:12 AM EDT, Submitted by Aisha Rahman, File name + 4 pages, "Pages tagged 1a, 1b · 2 · 3 · 4". "Received means your files are saved exactly as shown. It is not a grade." Download receipt, Back to coursework. A work trail: draft started 9:48, file added 9:52, tagged 10:05, received 10:12, "Feedback released: Not yet. Your instructor chooses when."
  - iPad: slip and trail side by side. iPhone: slip first, trail behind "See work trail".
- **Spec in brief:**
  - 3 fields: attempt selector, file/page selector (from immutable contents only), receipt reference (copyable).
  - 5 actions: Download receipt, View submitted item, Open earlier attempt, Start new attempt, View released feedback.
  - 6 states: received, no confirmed receipt, item unavailable, later draft exists, feedback held, archive restricted.
  - 1 dialog (Start another attempt), 3 acceptance checks.
- **Data it reads/writes:** reads the immutable receipt ID, time, assignment version, ordered payload, target snapshot, and separate release references. It writes nothing except a new draft for the next attempt.
- **Rules it must protect:**
  - Received attempts are immutable. Editing the prompt or source never changes bytes or version facts.
  - A new attempt starts from a copied draft with a new ID, with old reference and received time untouched.
  - No fabricated reference while pending (never a Received badge for an unacknowledged operation).
  - Held feedback shows no grading-progress hint.
  - No permanent-download promise after archive.
  - Group receipts keep the captured members and submitter.
- **Design assessment:**
  - Works: the receipt looks like a receipt. The "It is not a grade" line. A phone screenshot of the slip alone is proof (designer note). The trail explains how draft became attempt.
  - Disagrees:
    - The history rail (earlier attempts, new-attempt eligibility, selected release association) is absent. The page cannot show an attempt selector, and the "Start new attempt" button is missing, even though PS4 is past close at the fixture clock.
    - No per-item preview or download.
    - Page tags are collapsed into "1a, 1b · 2 · 3 · 4". The mapping to page numbers is lost.
    - The receipt ID "AH-PHYS110-001" is also used as the attempt URL ID. The numbering is per course, not per assessment (inferred). The scheme for a second attempt is undefined.
    - "Feedback released: Not yet. Your instructor chooses when." on a receipt page is a mild progress hint. The spec's held state is receipt facts only.
    - Legacy PC labels "Locked · cannot be changed" and iPad "Locked" differ.
    - The trail's "Draft started" row is not a receipt fact.
- **Gaps:** earlier-attempt list, later-draft banner, item-unavailable retry, no-confirmed-receipt, archive-restricted, group receipt (group name, actor, members), the start-new-attempt dialog, a disabled-with-reason new attempt (closed, exhausted).
- **Open decisions:** policy: number of attempts per assignment and which attempt is graded (the fixture shows 1 attempt). Policy: late attempts labelled on the receipt. Policy: retention and download period after term.
- **Design next:** PC and iPhone: receipt with history rail and two attempts; Start-another-attempt dialog; closed and exhausted disabled states; later-draft banner; item-unavailable retry; group receipt with captured members; archive-restricted. PC: the unconfirmed route ("No confirmed receipt"). Decide the tag text format ("p.1 → 1a, 1b").

### W23 · Released feedback
- **Roles / priority / stage:** student; instructor in a read-only learner preview. Core. Stage 1. Legacy S09.
- **Job to be done:**
  - Student: read the exact released result against the received attempt, see how it moved the course grade, request a review, answer a clarification.
  - Instructor: preview what the learner sees, with no learner actions.
- **Gets here from → goes to:**
  - From W22, W24 assessment row, W08 privacy-safe feedback event, W19 released status.
  - To W24, and same-page review and history. A request goes to staff W54. W54 is outside this segment and is not specified to return here.
  - The W27 links from W08/W07 are missing (known defect). They resolve to W23 only for assignments.
- **Drawn today:**
  - PC: "Feedback: Problem Set 4", "Released", "Rubric version 2 · released copy, unchanged by later edits". A question table 6/6, 4/4, 5/6, 7/8, 5/6 = 27/30. "Dr. Reyes's comment". A "This assignment 27/30" card. Banner "Your released grade changed. 84.50% before, 85.17% now."
  - iPhone: marks first, comment second, one-line grade-change sentence. The banner is a good, plain-language link between result and total.
- **Spec in brief:**
  - 4 fields: release version, question/page, correction reason (20–1500 chars), clarification response (1–1500 chars).
  - 6 actions: inspect criterion/comment, view prior release, view course calculation, request review, download released feedback, send requested clarification.
  - 7 states: not released, released, feedback updated, excused, review pending, viewer failed, clarification needed.
  - 1 dialog (request feedback review), 5 acceptance checks.
  - Release types: `reviewed_attempt` (needs a receipt) and `status_outcome` (Missing/Excused, no receipt).
- **Data it reads/writes:** reads the immutable typed result snapshot, rubric, linked correction request, and released category explanation. It writes a typed review request or a clarification response on the same W54 request.
- **Rules it must protect:**
  - Held (staff edits, drafts, progress) never shows.
  - A later release supersedes but never overwrites the earlier one.
  - Missing/Excused open feedback without an attempt, with no invented page or number.
  - A request never changes a score or deadline and never becomes a discussion post.
  - No direct-message inbox.
  - Instructor preview cannot send requests or replies.
  - Group learners see only their own applicable outcome. Individual overrides are private.
- **Design assessment:**
  - Works: the frozen-copy label, the marks-plus-comment order, and the grade-change line.
  - Disagrees:
    - No page/question viewer (the received pages), no per-criterion rubric detail, no release selector or history, and no Request review button. The spec's five actions are mostly absent.
    - "Rubric version 2" is a rubric reference. The assignment version is also "Version 2". These are easy to confuse.
    - "Your released grade changed" implies the course total changes with this release. Spec 04 and WD26 allow separate release candidates (reviewed attempt, status, policy projection). Whether releasing PS4 releases the new total together is not stated. Rule conflict: decide.
    - The banner shows two numeric grades in-page, which is fine. Notification previews must not (WD19).
  - Copy: "Released" alone does not show release time or version, which the header region requires.
- **Gaps:** not-released, updated (with compare), excused, review pending, viewer failed, clarification needed, and the review dialog are undrawn. No status_outcome (Missing/Excused) page. No instructor preview bar. No narrow-web criterion drawer.
- **Open decisions:** rule conflict: does the course total move with the item release or by its own release (WD26)? Policy: correction window and who sees a pending request. Policy: whether TAs' comments are shown with author.
- **Design next:** PC: with viewer and criteria, release selector and history; Updated (old/new comparison with no red/green reliance); Excused; Missing; Review dialog and pending; Clarification needed with reply; Viewer failed. iPhone: criterion drawer.

### W24 · Student course grades
- **Roles / priority / stage:** student; instructor in read-only learner preview. Core. Stage 1. Legacy S09, S19. New learner view.
- **Job to be done:** student: see one released number, exactly what it is based on, every assessment's released status, and the arithmetic. Instructor: preview that exact view.
- **Gets here from → goes to:** from course Grades nav, W15, W23 category contribution, W18 "View my grades", W27 View course grades. To W23 or W27, W22 or W27, W15, and same-page drawer. W12 for a mismatch. All resolve.
- **Drawn today:**
  - PC: "RELEASED GRADE 84.50% B", "So far", "Based on released work only". A note: "Not counted yet: Problem Set 4 is received but not released, and Quiz 3 hasn't opened. Problem Set 3 is excused and left out of the average." Category bars with weights: Assignments 40% 51/60 · 85.00%, Labs 25% 18/20 · 90.00%, Quizzes 35% 8/10 · 80.00%. "Counted so far: all three categories, 100% of the course weight". A "Released items" list of four rows.
  - iPad: the same two zones. iPhone: grade bar, categories, one held line.
  - Not drawn: the assessment table in full, the calculation drawer or dialog, release history, the six states, and filters and sort.
- **Spec in brief:**
  - 3 fields: category/status filter, sort (not defaulted to score), calculation section disclosure.
  - 5 actions: open released assessment, inspect calculation, view receipt, read policy, view release history.
  - 6 states: no released results, held work, released missing, released excused, empty category, policy/calculation mismatch.
  - 1 dialog (calculation details), 4 acceptance checks.
- **Data it reads/writes:** reads only the released result set and published policy and category mapping. No writes. Staff drafts are never read.
- **Rules it must protect:** held work is excluded from the arithmetic and shows no score or progress. Missing and excused change totals only after release. No NaN or Infinity. SIS is authoritative, so the page carries an official-record caveat. No hypothetical edits. No rank-by-score default.
- **Grade calculation, re-derived**
  - Weights (Assignments/Labs/Quizzes): 40/25/35 = 100.
  - Assignments, proportional method: PS1 24/30 + PS2 27/30 = 51/60 = 85.00%. PS3 is excused, so its 30 points leave numerator and denominator. PS4 is held, so excluded.
  - Labs: 18/20 = 90.00%. Quizzes: Quiz 2 8/10 = 80.00%. Quiz 3 has not opened.
  - Learner: 0.40×85 + 0.25×90 + 0.35×80 = 34 + 22.5 + 28 = **84.50%** ✓.
  - Staff with PS4 27/30: assignments 78/90 = 86.6667%. Total = 34.6667 + 22.5 + 28 = 85.1667 → **85.17%** ✓. After release the learner sees 85.17% (golden value learner_after_ps4_release).
  - Equal versus proportional: here the same (all items are 30 points, so equal gives the same 86.67%). The canonical test is 10/10 + 50/100: equal 75%, proportional 60/110 = 54.5454…%.
  - What it would be if PS3 were Missing=0 instead of excused: 51/90 = 56.67%, total 73.17%. This is why "excused" and "missing" must look different.
  - Empty category, Labs empty: active weights 40 + 35 = 75. Total = (34 + 28)/0.75 = 82.67%, shown as "based on released work, 75% of the course weight". All categories empty: "No released grade yet", never 0 and never NaN. A category with zero possible points counts as empty, not 0.
  - Rounding: only at the last step, two decimals. Category values are not rounded before combining. Rounding mode (half-up versus half-even) is unspecified. Letter grade "B" is shown with no boundaries and no rule for rounded versus unrounded input (policy).
- **Design assessment:**
  - Works: one number with its basis, the grey "not counted" note, the weight written next to each category, the represented-weight line.
  - Disagrees:
    - No item table with category, possible points, personal due, receipt and status. Excused PS3 and held PS4 are not listed as rows. The spec says every visible assessment appears.
    - No calculation drawer, release history or policy version, and no official-record caveat.
    - The empty-category rule differs. WD10 redistributes. The W24 spec says apply the published rule or show total unavailable. The failure text says "Weights rebalance".
    - The review file reports a W24 undefined/NaN scan hit and a dialog with two "Close details" buttons. Both unresolved.
    - "Score" column lacks possible points on the iPhone.
  - Copy: "no grade yet" is worded three ways across the board.
- **Gaps:** all six states, the drawer, filters and sort, the narrow table-to-rows form, the instructor preview bar, and archived-course read-only. No view for released history.
- **Open decisions:** policy (WD10, WD11): empty-category rule, rounding and mode, letter boundaries and rounding input, missing-becomes-zero timing, extra credit. Rule conflict: does the total change with the item or with its own projection release (WD12/WD26)?
- **Design next:** PC: full item table with every status; the calculation drawer with plain-text arithmetic (the 84.50 and 85.17 lines); empty-category and all-empty states; missing, excused and held rows; mismatch state; release history; policy version and the official-record caveat. iPhone: row form. Fix the dialog buttons.

### W25 · Quiz rules/start
- **Roles / priority / stage:** student; instructor and TA read (staff preview). Core. Stage 2. Legacy S10, S16.
- **Job to be done:** student: read rules, see personal timing, acknowledge, and start or resume. Instructor: Edit quiz (W41). TA: view rules only.
- **Gets here from → goes to:** from W18 quiz row, W07 due event, W17 link, W27 "permitted another attempt", and W26 recovery (inferred). To W26 (start or resume), W27 (prior receipt), W18, W41.
- **Drawn today:**
  - PC (role s): "Quiz 3: Projectile motion" with an "Opens Wed 8:00 AM" badge. A "Before you start" list: Opens Wed Oct 21 8:00 AM, Closes Thu Oct 22 11:59 PM, "Time once started 30 minutes, which includes your extra time", "Attempts 2 allowed · this is attempt 1", "Results Released by your instructor", "AI tools Not permitted during the quiz". A note about saving and the clock. Two checkboxes ("I have read the rules above", "I will not use AI tools during this quiz"). "Start attempt" with "Starting begins your 30 minutes." A "Late start" box.
  - iPhone: rules first, Start in a fixed dock.
- **Spec in brief:**
  - 3 fields: rules acknowledgement (one checkbox, a refresh clears it), attempt summary, personal timing.
  - 5 actions: Start, Resume, View prior receipt, Return to coursework, Edit quiz.
  - 6 states: available, not open/closed, active attempt, allowance mismatch, start outcome unknown, staff preview.
  - 1 dialog (Start timed attempt), 4 acceptance checks.
- **Quiz timing rule**
  - Effective deadline = min(personal close, startedAt + effective duration). An untimed quiz ends at personal close. One allowance mode only (extra minutes or multiplier, never both).
  - Worked example, fixture-style: close 11:59 PM, 30-minute timer. Start at 11:20 PM → deadline 11:50 PM. Start at 11:29 PM → 11:59 PM. Start at 11:50 PM → 11:59 PM, 9 minutes left. The acceptance check "start 9 minutes before close warns 9 minutes" is consistent with this.
  - The drawn "Late start" copy is wrong. It says "If you start after 11:20 PM Thursday ... fewer than 30 minutes". The real threshold is 11:29 PM (11:59 − 30). At 11:20 the student still gets the full 30.
  - Also the "late start" box is static. The spec wants the real remaining time before Start, computed from the current time, shown in the dialog.
- **Data it reads/writes:** reads the published quiz version, personal timing (with allowance), own attempt status, release rule, integrity disclosure, allowed materials. Writes: starting creates one attempt. Browsing and refreshing never do.
- **Rules it must protect:**
  - Rules shown without an attempt being consumed.
  - A timed-out Start resolves the existing attempt before offering Start again.
  - Allowances show only the resulting total ("includes your extra time"), never the reason or basis. A TA sees adjusted timing and cannot grant it.
  - The course AI prohibition shows even if W11 lists an AI tool.
  - Focus loss is never proof of cheating.
  - No lockdown claim.
- **Design assessment:**
  - Works: the honest note ("page cannot lock your computer"), the personal total with no reason, the late-start idea itself, rules before Start on mobile.
  - Disagrees:
    - Shown as "not open yet" (badge Opens Wed 8:00 AM, clock Tue Oct 20) while Start and the two checkboxes look enabled. The spec's Not open state shows an exact time with no Start.
    - Two checkboxes versus one. The second ("I will not use AI tools") is an attestation not in the spec.
    - Missing: score-selection rule (two attempts, which counts?), personal versus course window labelling, connectivity and device requirements, the integrity disclosure.
    - The designer note says "no background sync". The visible text does not say it.
    - "Unsaved answers stay on this device" is promised unconditionally. The spec says "only where actually retained".
    - The URL (`/quizzes/quiz3`) matches the spec.
- **Gaps:** not-open and closed, active attempt with Resume, allowance mismatch, start outcome unknown, staff preview bar, the Start timed-attempt dialog, mobile late start, and an instructor view.
- **Open decisions:** policy: attempts and score-selection (highest, last, average). Policy: accommodations beyond extra minutes (the spec says to validate with the institution). Rule conflict: whether the AI attestation is wanted.
- **Design next:** PC: Not-open, Available (single acknowledgement), Active attempt with Resume, Late-start in the dialog with the real minutes, Allowance mismatch, Start-unknown, Staff preview. iPhone: the dialog.

### W26 · Quiz attempt
- **Roles / priority / stage:** student only. Core. Stage 2. Legacy S10.
- **Job to be done:** student: answer a fixed version, know what is saved, track time, review, submit once.
- **Gets here from → goes to:** from W25 Start/Resume, W02 restored attempt context, and W27 only if the attempt is still active. To W27 (submit) and the same page. Session expiry goes to W01 then back here.
- **Drawn today:**
  - PC: header "Quiz 3: Projectile motion · attempt 1", "18:00 left · ends 10:30 AM", "Answer 4 not saved". Question 4 (written, 4 points) with the typed text. Warning "Not saved yet. Your text is kept on this device. We keep trying. Check your connection, then choose 'Check status'." Buttons Previous, Save answer, Check status. A navigator: 1 Saved, 2 Empty, 3 Empty, 4 Unsaved. "Review answers".
  - iPhone: timer and save state on top, a numbers row.
  - Scenario: in progress at 10:12 AM with a simulated connection drop. 18:00 left at 10:12 implies start 10:00 and a 30-minute deadline of 10:30.
- **Spec in brief:**
  - 4 fields: choice, numeric (blank is not zero), written, review flag (not a cheating signal).
  - 5 actions: Save answer, Next/previous, Review answers, Submit quiz, Reconnect/check status.
  - 6 states: saving, offline unsent, time expired, submission unknown, focus interruption, session expired.
  - 1 dialog (Submit quiz answers), 4 acceptance checks.
- **Data it reads/writes:** reads the immutable question and rule snapshot and the deadline. Writes per-answer acknowledged versions, review flags and the submission operation state.
- **Rules it must protect:**
  - A "Saved" mark means the server received it. Pending, Saved and Not saved are distinct words.
  - Time expiry: lock edits, finalize acknowledged answers once. Unsent offline text stays a labelled local draft needing recovery or staff review, never an invented accepted timestamp.
  - The clock never resets on refresh, blur or reconnect.
  - Later authoring changes cannot alter the attempt.
  - No auto-cancel from focus loss.
  - Authorization is rechecked on resume.
- **Design assessment:**
  - Works: save status in words and colour at the answer and navigator levels, with the end time beside the countdown. "Not saved" is a good plain term.
  - Disagrees:
    - The spec state "Time expired: Personal deadline reached" uses the personal deadline. The agreed rule is the effective deadline = earlier of personal close and start + duration. The page note repeats the correct rule, so the state text contradicts its own note (rule conflict in the 15 Nov review). Fix the spec state.
    - "We keep trying" is an automatic-retry promise. The principle is no background sync guarantee. State what the tab does ("while this page stays open").
    - The navigator has no Flagged state and no Saving state.
    - There is no Next on the PC screen, only Previous. The Submit button and review panel are absent.
    - The URL has no attempt ID (`/quizzes/quiz3/attempt`), and the spec route has one.
  - Copy: "Saved" versus "Answer 4 not saved" is good. "Unsaved" in the navigator versus "not saved" in the header should match.
- **Gaps:** time expired (including the unsent-draft recovery view), submission unknown, session expired, focus interruption (neutral), the submit dialog and review panel with unanswered warning, and a saving state. Also undrawn: numeric and choice questions, units and media alternatives, and the timer's accessible form (role=timer, polite warnings only).
- **Open decisions:** policy (WD25): expiry, resume and accommodation rules need institutional confirmation. Rule conflict: who reviews an unsent local draft after expiry. The spec says staff review, but no W-page is specified for it. Policy: is the 10-answer limit on offline storage, if any?
- **Design next:** PC and iPhone: Time-expired with acknowledged answers finalized and unsent text kept; Submit dialog and review panel; Submission unknown; Session expired; Saving state; a choice question and a numeric question with units; Flagged in the navigator.

### W27 · Quiz receipt/review
- **Roles / priority / stage:** student. Core. Stage 2. Legacy S10. Desktop only (per the review file's list).
- **Job to be done:** student: hold quiz proof, see the answers that were submitted, and see released score and review only when policy permits. Then start another attempt.
- **Gets here from → goes to:** from W26, W25 history, W24 released row, W08 feedback event. W08 and W07 have no route to W27 (the known broken link). W18 does link to it. To W24, W25 and same-page actions. W26 for status resolution.
- **Drawn today:**
  - PC only: "Quiz 3: Projectile motion · Received", "RECEIPT AH-PHYS110-Q3-001", "Attempt 1 · submitted Wed Oct 21 at 10:24 AM · answers received: 4 of 4". "Your answers" (Q1–Q4, Q4 truncated "They are independent components…"). "Results: Not released yet. Your instructor releases scores and feedback. Until then, the answer key and any score stay hidden. You will see a notice in Activity." "Another attempt: You have 1 attempt left. It closes Thu Oct 22 at 11:59 PM." Start another attempt, Download receipt.
- **Spec in brief:**
  - 3 fields: attempt selector, review section, release selector.
  - 5 actions: Download receipt, Inspect submitted answer, Inspect released feedback, View course grades, Start another attempt.
  - 6 states: received/held, review partially released, review released, review window closed, no confirmed receipt, feedback updated.
  - 1 dialog (Start another quiz attempt), 3 acceptance checks.
- **Data it reads/writes:** reads the immutable question, answer and receipt snapshot, the finalization reason, the released review payload, version, visibility window, and the score-selection policy. No writes.
- **Rules it must protect:** held results reveal no score, key or marking progress in the DOM, export or question status. Receipt facts and release policy are separate. Keys, answers and score can be released independently. Later authoring cannot alter the snapshot. A failed fetch keeps the receipt and shows no stale key.
- **Design assessment:**
  - Works: "never zeros, says so plainly", the clear separation of fact and policy, the attempt-left line with its close time.
  - Disagrees:
    - The truncated Q4 answer. A receipt of exact answers must not truncate (offer a full-text expand).
    - No question version, finalization reason ("submitted by you" versus "finalized at time limit"), selected scoring attempt, attempt selector or release selector.
    - The score-selection policy is never shown, and with two attempts it determines the Quiz 3 score in W24.
    - "Start another attempt" shows no disabled reason or timing preview. The dialog should show the attempts remaining, the personal timing and the score-selection method.
    - "You will see a notice in Activity", but W08/W07 have no link to this page. The promise is not wired.
  - Copy: "Not released yet" and "Results" duplicate the labels used in W24.
- **Gaps:** partially released, released, window closed, no confirmed receipt (after expiry), feedback updated, the Start-another dialog, narrow and iPhone layout, and a TA or instructor view.
- **Open decisions:** policy: score selection, review window, key and answer visibility. Rule conflict: add W27 to the W08/W07 route lists.
- **Design next:** PC and iPhone: Received-held (full answers), Partially released, Released with per-question feedback, Review window closed, No confirmed receipt after expiry (shows the unsent draft recovery), Feedback updated, the Start-another dialog.

---

## Segment fix list (most important first)
1. [rule-conflict] Define "Late" once: a neutral receipt fact computed from accepted time versus the personal due in force. Add it to the student status vocabulary, show it on W19/W21/W22/W18, and separate it from W58's attendance "Late". Decide whether it carries a penalty.
2. [copy] Fix the W25 late-start text. 11:20 PM is wrong. A 30-minute quiz closing at 11:59 PM truncates only after 11:29 PM. Show the computed remaining time before Start.
3. [rule-conflict] W26 "Time expired" state names the personal deadline. Rewrite to the effective deadline, min(personal close, start + effective duration).
4. [rule-conflict] W21 confirmation: the spec checks "exact payload", the drawn screen shows an integrity attestation. Decide, then draw both (payload confirmation plus submit dialog).
5. [state] Draw the W21 failure ladder: Sending, Outcome unknown, Rules changed, Coverage invalid, Offline, concurrent send.
6. [copy] Offline and retry copy (W20, W26, failure list): remove "will save when you reconnect", "Sends when you reconnect" and "We keep trying". Say what the open tab does and that nothing is guaranteed.
7. [state] Draw W26 Time expired with the unsent-draft recovery and Session expired. Specify where staff review unsent quiz drafts (no page owns it) [link].
8. [data] W24: full item table with excused and held rows, calculation drawer (the 84.50 / 85.17 arithmetic as plain text), release history, policy version, official-record caveat, empty-category and all-empty states.
9. [rule-conflict] Decide whether the course total moves with the item release or with its own projection release (WD12/WD26). The W23 banner assumes the former.
10. [rule-conflict] Letter grade and rounding: boundaries, rounded versus unrounded input, rounding mode. The drawn "B" has no source.
11. [link] Add W27 to W07/W08 destination lists (the quiz notice has no route). Check the W34 → W21 entry.
12. [state] W22 history rail: earlier attempts, Start new attempt (with disabled reasons), later-draft banner, group receipt, archive-restricted.
13. [state] W19: closed-without-receipt, group-unassigned, pending request, and the request-more-time dialog. Label personal versus course dates.
14. [copy] W20 interrupted-upload text contradicts itself (only one file shown and it is the failed one, yet "other files and tags are saved"). Disable Review on the iPhone failed state.
15. [state] W20: invalid-file, processing-failed, camera explanation and denied, tag editor, reorder, remove-page dialog.
16. [rule-conflict] W25 score-selection (two attempts) is not shown anywhere. Show it on W25 and W27.
17. [state] W25: draw Not-open, Active attempt/Resume, Allowance mismatch, Start-unknown, Staff preview. Use one acknowledgement checkbox or add the AI one to the spec.
18. [data] Receipt formatting: keep page-to-tag mapping, define receipt ID numbering for attempts 2+, do not truncate quiz answers.
19. [state] W23: viewer with criteria, release history, Updated, Excused/Missing, Review request dialog and pending, Clarification needed.
20. [device] iPhone frames promise native camera capture and a tab bar. Spec 03 says narrow web uses a navigation disclosure. W27 has no iPhone frame. Decide the target before drawing more.
21. [data] Normalize the drawn "now": W19–W22 are Oct 15, W24 reflects Oct 20, W26/W27 Oct 21. Label each as a scenario override of the Oct 20 4:00 PM clock.
22. [copy] Terminology: "marks" versus "points"; "no grade yet" worded three ways; both W24 dialog buttons read "Close details".


---

# Segment 4: Course communication and group work (W28–W31, W33–W34, W47, W55–W56)

## Segment overview

**Purpose.** Two linked jobs. (1) One-to-many course communication: staff write announcements and run discussions; students read, reply and report. (2) Project-group work: staff build group sets, students see their team and the one shared submission and receipt. The segment holds the line between "course communication" and "private messaging". Spec 01 excludes a direct-message inbox, WD05 and AR03 repeat the exclusion, and live chat and peer grading for groups are out of scope (WD07, W34 notes).

**Who it serves.** Students: W28–W31, W33, W34. Instructors: W55, W56, W47, plus read-only use of the student pages. TAs: read access, participation in discussions, scoped moderation only when granted (W56), and a scoped group view (W47 "assigned_read_only" in the nav map). TA announcement authoring and publishing are off by default (WD06).

**Journeys.** J09 Course communication: W55 → W28/W29 → W08 → W30/W31 → W56. J07 Group assignment: W47 → W40 → W33/W34 → W19–W22 → W49 → W53 → W24. W29 and W31 are also reached from W08 and W09 notices. The journey tags come from matrix.txt. The record-level sequences are in Spec 04 "Critical journeys".

**Build stages.** W28–W34, W55 and W56 are Stage 3 (Daily course life). W47 is Stage 2 (Assessment depth). Dependency problem: W34 is Stage 3, but W22 and W21 need it as the group receipt target and W40 needs W47. The Stage 1 exit check is individual work only, so this is workable, but group receipt behaviour cannot be accepted until Stages 2 and 3 are both built.

**Priority labels disagree.** The specs mark W28 and W30 "core"; matrix.txt marks them "optional" and "Optional". W56 is "follow-on" in both, but W30's "Start topic" and "Manage discussions" depend on it. Decide whether discussion is required for J09.

**Design principles visible in the screens and specs**
1. The audience is stated wherever a post is read or written. W29 says "Published to PHYS 110". W31 says "Open · visible to PHYS 110" and "Your reply is public to this course". W55 says "All of PHYS 110 · 3 learners".
2. Authorship carries a role. W31 labels posts "Teaching assistant". W56 says hidden posts name who hid them and why (note only, not drawn).
3. Status words are text. Unread is "New" plus a dot and bold, and the W28 phone note says colour is not the only signal. States are Draft, Scheduled, Published, Updated, Locked.
4. Published state and delivery state are separate. W55 draft says "Nothing has been sent". The spec asks for separate Published and Pending/Failed counts and retry without a duplicate feed item.
5. Receipts and history are never rewritten. Group receipts freeze their members. Hidden posts keep the original in restricted history. Edited announcements keep the earlier published text beside the draft.
6. Group concepts are kept apart. W33 says the page "only shows project groups", not sections or grading groups.

**Segment-wide risks**
- Fixtures have no announcement, discussion or delivery records. 84_Q lists group_set, group_assignment and group_receipt, but nothing for announcements, discussion posts, read markers, moderation actions or delivery channels. J09 cannot be built or acceptance-tested from the listed data.
- Drawn screens contradict each other on the same records (W28/W29 vs W55, W33 vs W34, W30 vs W31). See each page.
- Only 1 drawn screen exists for W29, W30, W33, W34, W47, W55 and W56, all PC, student or instructor only. No TA variant, no failure or empty state, and no dialog is drawn anywhere in this segment.
- "Staff preview" of group pages is a known broken link (W47→W34, details at W47).
- Privacy through small numbers: PHYS 110 has 3 learners. Counts such as "reported by 1 learner" or "2 members" are close to identifying (inferred).
- Narrow-web alignment: all the student and staff pages here are desktop-only except W28 and W31, which have iPhone frames. These use a bottom tab bar, which Spec 03 does not allow for narrow web.

---

### W28 · Announcement list
- **Roles / priority / stage:** student, instructor, TA. Spec: core. Matrix: optional. Stage 3. Journey J09.
- **Job to be done:** Student: see what the instructor published and which items are unread. Instructor: browse the same list and jump to authoring. TA: read within scope.
- **Gets here from → goes to:** From course nav "Announcements", W14 latest card, W08 events, W29 Back. To W29 (open), W55 (instructor "create/manage"), W08 (notification preferences), W14. All resolve. Staff nav lists W28 with "read_only" for TAs.
- **Drawn today:** PC student (3 rows: "Quiz 3 opens Wednesday" New Oct 19; "Office hours move this week" Updated Oct 16; "Problem Set 4 is graded" Read Oct 15; search box; All/Unread toggle). iPhone student (same 3 rows, no search or filter; note says dot + bold + word "New"). No instructor, TA, empty, no-match, archived, failure or mark-all-read screen.
- **Spec in brief:** Fields: search (max 160), read filter (All/Unread), sort (newest/oldest, pins labelled). Actions: open, mark read/unread (own marker, notifies nobody), clear filters, create/manage (W55), notification preferences (W08). Six states: no announcements, no matches, updated publication, archived, list failure (keep dated rows or offer retry, no false empty), revoked visibility. One dialog: "Mark all visible read" (only the filtered, published rows). Three acceptance checks: scheduled item not visible or counted before publish; delivery off still keeps announcements; read-marker failure keeps old status and offers retry.
- **Data it reads/writes:** Published announcement ID/version, audience visibility, author, timestamps, pin; own read marker. No fixture exists.
- **Rules it must protect:** No direct messaging. Learners never see draft or scheduled titles or counts. Read state is personal and never deletes or reveals anything to staff. No score snippets in excerpts. Archived courses are read-only.
- **Design assessment:** The three-row list is clear: New, Updated and Read are words, which satisfies the colour rule. Problems: (a) "Updated" replaces the read state, so a row cannot be both updated and read or unread. The state model needs read plus updated-since-read. (b) Pinned state, sort and the "mark all read" opener (a known dialog with no opener, review-2026-11-15) are not drawn. (c) "Problem Set 4 is graded" announces grading while PS4 is held; the copy is careful ("Feedback is not released yet") but confirms staff status. Confirm that is intended. (d) The iPhone has no search or filter although the spec lists them.
- **Gaps:** Instructor view (draft/scheduled entry, authoring link), TA view, archived banner, filtered-empty, list-failure, revoked-row, mark-all-read, pagination, "Updated" row detail. No iPad.
- **Open decisions:** Policy: does editing a published announcement notify again, or only show "Updated"? Policy: can staff see aggregate read counts? Spec W29 says "no read-receipt promise to staff", so the answer should stay no. Rule conflict: W28/W30 priority core vs optional.
- **Design next:** PC instructor list with a Drafts/Scheduled tab (staff only) and the authoring link. PC student empty and filtered-empty. PC row showing "Updated" + unread. PC mark-all-read dialog. iPhone with search/filter disclosure. PC archived read-only.

### W29 · Announcement detail
- **Roles / priority / stage:** student, instructor, TA. Core. Stage 3. J09.
- **Job to be done:** Student: read one announcement, open the linked quiz or event, download the attachment, set own marker. Instructor: check what learners see; start an edit. TA: read.
- **Gets here from → goes to:** From W28, W14, W08, W09. To W19, W25, W32 (referenced items), W28 Back, W55 (instructor edit; also the Preview target from W55). Resolves. Note W55 "Preview" goes to W29, a student-facing page, so W29 needs a visible "Preview, not published" state for staff (not specified).
- **Drawn today:** PC student only: "Quiz 3 opens Wednesday", "Dr. Diane Reyes · Oct 19, 9:00 AM · Published to PHYS 110", body, AI-tools notice, buttons Open Quiz 3 / See it on the calendar / Mark unread, attachment "quiz3-practice.pdf · 2 pages · accessible version available" with Download. No back link, revision, edited, failed-attachment, unavailable or archive screen.
- **Spec in brief:** Fields: read marker, published revision selector (learner-exposed revisions only), attachment selector (from that revision). Actions: open referenced record, download, mark unread, back (restores query and position), edit (opens a new draft; published version unchanged). States: Published, Edited after publication (summary, no draft bleed), Attachment failed (inline retry), Not yet published (neutral view, no title or count hint), Audience changed, Archived. Dialog: open external link (host plus authored title, AI/tool restriction). Acceptance: draft edit leaves learner text unchanged; attachment URL cannot bypass audience; read-marker failure does not block reading.
- **Data it reads/writes:** Announcement revision, attachment reference, canonical links, own read marker.
- **Rules it must protect:** No "Reply privately" or professor inbox. Reading is not acknowledgement. Audience checked on direct URL and attachments.
- **Design assessment:** The note ("Reading … never counts as agreeing") is exactly the spec intent. The audience line is good. Disagreement with W55: W29 shows this announcement already published Oct 19 9:00 AM, while W55 shows the same title as an unsent draft scheduled for Tue Oct 20 5:00 PM with a shorter body (no AI sentence). The student and staff worlds do not match. The "mark unread" button is drawn but the read state it toggles is not shown on the page.
- **Gaps:** Published-revision selector, change summary, "Updated" label, Back link, external-link dialog, failure and unavailable views, instructor/TA variant, narrow layout (desktop-only per review file).
- **Open decisions:** Policy: do learners see earlier revisions or only the current one plus change summary? Policy: link-check on referenced items that become unpublished.
- **Design next:** PC "Updated Oct 16" with change summary and revision picker (use the "Office hours move this week" item). PC unavailable-announcement view. PC attachment-failed. PC external-link dialog. Staff preview banner. iPhone/narrow single column.

### W30 · Discussion list
- **Roles / priority / stage:** student, instructor, TA. Core (matrix says Optional). Stage 3. J09.
- **Job to be done:** Student: find topics, see which are open, closed or group-only, start a topic. Staff: same plus manage entry.
- **Gets here from → goes to:** From course nav, W14, W17 lesson discussion, W31 breadcrumb. To W31, W56 (manage; instructor, TA), W14. Resolves. The W56 link needs a topic ID, but the list-level "Manage discussions" has no ID (see W56).
- **Drawn today:** PC student: search, "Start a topic", All/Open/Group only filter; four rows: "Projectile motion: where do I start?" (Maya Chen · 6 replies · last reply today 9:12 AM · Open); "Problem Set 4, question 3 setup" (Ben Okafor · 3 replies · yesterday · Open); "Team Orbit planning" (Group only · 2 members · Oct 18 · Open); "Welcome and course norms" (Dr. Diane Reyes · replies closed). No iPhone.
- **Spec in brief:** Fields: search (160), audience/state filters, new-topic title (5–160) and body (20–5000). Actions: open, start topic (only if the course policy allows the role), filter, manage (W56), read posting rules. States: no topics, no matches, replies closed (opens read-only), group limited, create failed (draft preserved), archived. Dialog: create topic (identity, audience, grading consequence, "no private message"). Acceptance: hidden group topic absent from search, counts and suggestions; closed topic has no composer; failed submit keeps the draft and never duplicates on retry.
- **Data it reads/writes:** Discussion publication, audience, posting policy, topic metadata, own unread state, optional draft.
- **Rules it must protect:** Posts are public to the stated audience. Group topics do not leak to non-members. Graded status appears only as a label; grades only via released results.
- **Design assessment:** Labels are in words and "Group only" is clear. Conflicts: the first row says the topic's author is Maya Chen, but W31 shows Aisha's question as the opening post and Maya as the reply. Reply count 6 versus 2 posts shown (could be an excerpt; unclear). The group row's "2 members" is shown to Aisha who is a member (allowed), but W56 labels the same space "Team Orbit only". The "Welcome" row says "Dr. Diane Reyes · replies closed" and also shows a "Replies closed" badge; fine. Spec mentions graded/not graded and due date, not drawn. No unread marker is drawn, though the spec requires text unread status.
- **Gaps:** Topic-level unread, graded/due display, no-topics, no-match, create-failed, archived, new-topic dialog, TA/instructor view with Manage entry, narrow layout.
- **Open decisions:** Policy: can learners start topics at all (course posting policy)? Policy: can learners start a group-scoped topic in their own group? Rule conflict: author shown (original poster vs staff-created prompt).
- **Design next:** PC with unread text and a graded topic row. PC new-topic dialog showing audience. PC empty and no-match. PC instructor view with Manage. iPhone list.

### W31 · Discussion thread
- **Roles / priority / stage:** student, instructor, TA. Core. Stage 3. J09.
- **Job to be done:** Read the prompt and replies, reply to a parent post, report a post, save a draft. Staff: also moderate when in scope.
- **Gets here from → goes to:** From W30, W17, W09 result, W14. To W30, W56 (moderate; only for staff in scope). Report is same page. Resolves.
- **Drawn today:** PC student and iPhone student: header "Projectile motion: where do I start? Open · visible to PHYS 110"; two posts (Aisha 8:40 AM, "Maya Chen · Teaching assistant" 9:12 AM) each with Reply and Report; composer "Write a reply for everyone in PHYS 110 · Your reply is public to this course · Save draft · Post reply". iPhone uses "TA" while PC uses "Teaching assistant" (copy inconsistency). No report dialog, post-audience dialog, hidden-post placeholder, closed, error or offline screens.
- **Spec in brief:** Fields: reply body (1–5000), reply target, attachment, report reason (required, max 1000). Actions: reply, post reply (one acknowledged post), save draft (never claims posted), edit own post (edited marker), report/moderate (W56 for moderators). States: draft, posting unknown (check thread before retry), replies closed, hidden by moderation (neutral placeholder, reason to the affected author), membership changed, offline. Dialogs: "Post to this audience", "Report post" ("report is not automatic removal"). Acceptance: lock while composing blocks posting; retry checks for the existing post; membership loss leaves no active composer.
- **Data it reads/writes:** Posts, parent reference, moderation state, own draft and operation reference; link to released grade for graded threads.
- **Rules it must protect:** Replies go to the audience, not to a person. Every post shows author, role and time. Hidden post keeps staff history. TA moderation needs explicit scope.
- **Design assessment:** The best-drawn page in the segment: audience above and below the thread, role labels. Gaps are mostly states. The report path is the only route into W56 from the student side; its confirmation and "what happens next" are not designed. Maya's TA access ends Oct 25; her older posts should keep the role label after expiry (inferred).
- **Gaps:** Report dialog, reply-audience dialog, hidden placeholder (with and without disclosed reason), edited marker, locked thread, unknown-post outcome, offline, staff variant, nested replies, attachment.
- **Open decisions:** Policy: does the affected author see the hide reason while other readers only see a neutral placeholder? Policy: edit window and edit-history visibility. Policy: can a TA be a moderator on group threads.
- **Design next:** PC report dialog and "report received" confirmation. PC thread with a hidden post (reader view and author view). PC locked thread. PC unknown-post state. iPhone narrow reply.

### W33 · My course groups
- **Roles / priority / stage:** student only. Core. Stage 3. J07.
- **Job to be done:** See own team, its members, and group assignments. Understand what happens if the team changes.
- **Gets here from → goes to:** From course nav "Groups", W19 (unassigned guidance), W34 Back, W14 group card. To W34, W19, W15 or W12 (guidance). Resolves for students. Staff navigation "Groups" goes to W47, not W33; W47's "W33 staff preview return" is the broken link (see W47).
- **Drawn today:** PC student: "My groups › Lab teams › Team Orbit; Aisha Rahman, Ben Okafor · set by Dr. Reyes · Active member"; "Motion investigation · Group assignment · due Fri 11:59 PM · In progress"; "How groups work" explains no join or leave and that received work keeps members at send time. Breadcrumb reads "Coursework", not "Groups". No self-enrollment, unassigned, full, changed, unknown-join or archived screen.
- **Spec in brief:** Fields: set filter, join selection, membership acknowledgement. Actions: open my group (W34), open group assignment (W19), join (only when enabled), view membership details, assignment guidance. States: instructor assignment pending (label "Unassigned", submission blocked), active, full/closed, membership changed, join outcome unknown (no blind retry), archive. Dialog: join this group. Acceptance: instructor-assigned set has no Join or leave; a full group rejects join without changing membership; moving groups does not expose the new group's old work.
- **Data it reads/writes:** Published group set and membership, self-enrollment policy, group assignment links, receipt-linked history.
- **Rules it must protect:** Three different things: course section, grading allocation group (W57), project group. Self-enrollment only if published. A past member does not keep access to future work.
- **Design assessment:** The page and the "How groups work" copy are strong, and it answers the "no join button" question. Conflicts: (a) it says "In progress" for Motion investigation while W34 shows a received group receipt for the same team and assignment. (b) W34's receipt is dated Thu Oct 22, 2:20 PM, two days after the scenario clock (Tue Oct 20, 4:00 PM). There is a scenario override named group_submission and group_work_in_progress; these screens come from different overrides and need labelling. (c) Breadcrumb is wrong. (d) Only sections vs groups is explained; grading allocation groups are not mentioned on this page although the spec names them.
- **Gaps:** Unassigned state, self-enrollment variant, full group, membership-changed, unknown join, archive, narrow web, a past-membership note (receipts remain visible after leaving), display of the other members' names policy.
- **Open decisions:** Policy: are member names visible to all group members (drawn, yes). Policy: self-enrollment support in v1 (WD07 says follow-on). Rule conflict: which scenario world W33 depicts.
- **Design next:** PC unassigned state (blocked submission, who assigns). PC "membership changed" with prior receipt unchanged. PC self-enrollment variant with join dialog. Fix breadcrumb. Narrow-web card stack.

### W34 · Group workspace / group submission status
- **Roles / priority / stage:** student only. Core. Stage 3. J07.
- **Job to be done:** See one shared submission status for the team, add or resume shared work, open the shared receipt, and find own private result.
- **Gets here from → goes to:** From W33, W19, W22 (shared receipt target), W14. To W20 (add/resume), W21 (review), W22 (receipt), W23 (own feedback). Staff entry from W47 "Open group workspace preview" has no valid destination: the page is student-only and nothing describes a preview mode.
- **Drawn today:** PC student: "Motion investigation · Team Orbit · Received"; "GROUP RECEIPT AH-PHYS110-GROUP-001 · Sent by Ben Okafor · Thu Oct 22 at 2:20 PM · attempt 1 · Members when received Aisha Rahman, Ben Okafor · File team-orbit-investigation-sample.pdf · Team version 1"; "Shared work" copy ("One person sends it for everyone…"); "Open shared receipt"; "Your own result: private to you, appears only after release." No draft, conflict, membership-change or offline screen.
- **Spec in brief:** Fields: assessment selection, draft source (owner/version), responsibility acknowledgement (at W21). Actions: add/resume work (W20), review submission (W21), open shared receipt (W22), view own released feedback (W23), refresh status. States: no group work, another member updated (block stale overwrite), another member submitted, membership changed before submit (invalidate review), received with later membership change (keep original members), offline (last-known only). Dialog: "Prepare group submission". Acceptance: concurrent submissions give one accepted operation or an explicit conflict; membership change forces review and never rewrites a receipt; a private override shows only to that learner; offline status is labelled last-known.
- **Data it reads/writes:** Group/set/membership version, shared draft version, group receipt (membership_version, captured_members, actor_id, attempt), own release reference.
- **Rules it must protect:** One shared receipt, immutable, with captured members and actor. Individual override private to the affected learner. Members cannot change grading basis or release. No live collaboration or chat.
- **Design assessment:** The receipt block is the clearest in the segment: group, sender, time, attempt, members when received, team version. "Sent by Ben" correctly shows a teammate sent it. "Your own result" heading is audience-explicit. Missing: no hint about the later-change case that the note promises. "Received" is shown as the whole-page status with no due date, close or late handling.
- **Gaps:** Pre-submission draft view (draft owner, last update, acknowledgement), conflict states, membership-changed variants (before and after receipt), offline, no-assigned-work, multiple assessments selector, new attempt after receipt.
- **Open decisions:** Policy: can a former member still open the receipt (spec says institution policy)? Policy: who may send, any member or a named submitter? Rule conflict: preview link from W47 (see W47).
- **Design next:** PC draft-in-progress with another-member-edited banner. PC received + current team differs (version 2) with receipt unchanged. PC offline last-known. PC late-joiner view (not in snapshot). Narrow stack.

### W47 · Group sets and membership builder
- **Roles / priority / stage:** instructor (full), TA (listed in routes; nav map says "assigned_read_only"). Core. Stage 2. J07.
- **Job to be done:** Instructor: create a group set that covers every enrolled learner, publish it, and change membership later without touching received work. TA: read assigned scope only.
- **Gets here from → goes to:** From W40 ("Manage groups"/target selector), W45, course nav "Groups". To W40 (return with selected set), W34 ("Open group workspace preview"), W33 ("staff preview return" per Entry). The W34 and W33 links do not work: both are student-only pages, and the review file lists this as a known broken link. The drawn URL is /groups/manage; the route is /teach/courses/:courseId/groups.
- **Drawn today:** PC instructor: "Lab teams" with Preview random groups and Publish group set; Team Orbit (Aisha Rahman, Ben Okafor), Team Vector (Carmen Ortiz); coverage "Enrolled learners 3 of 3 placed", "Version 1", "Self-enrollment Off"; note "Group work received. Team Orbit has a receipt. A change publishes as version 2 and the receipt keeps its original members." No TA view, move dialog, capacity, effective time or unassigned pool.
- **Spec in brief:** Fields: set name (distinct, 1–100), allocation method (manual/random with reviewable preview), groups and capacity (unique names, one membership per learner per set), enrollment snapshot, membership effective time (prospective only). Actions: preview random, move member (button alternative to drag), publish (blocked by duplicates, unresolved targets, overcapacity, stale enrollment), open workspace preview, save draft, cancel (save/discard/keep). States: unassigned learners, group work received (lock snapshot, show effective time), join/withdraw (keep attribution), stale enrollment (disable publish). Dialogs: "Change membership after work" (old/new group, effective time, affected open assessments; no automatic transfer of private artifacts) and "Unsaved changes". Acceptance: cannot publish with unresolved targets; one receipt per received attempt; individual overrides attach to a member with reason and never mutate the shared artifact; saving incomplete draft is allowed, publishing is blocked.
- **Data it reads/writes:** Group-set version, enrollment snapshot, current membership, receipt membership (kept separate), assessment targets.
- **Rules it must protect:** Membership change is prospective, versioned and audited; received receipts are frozen; no retroactive redistribution. Late join, withdrawal and individual overrides need an explicit instructor decision. A section, a grading allocation (W57) and a project group are different.
- **Design assessment:** The note and coverage card state the key rule. The drawn page is a read-only snapshot: no controls show how to move someone, what version 2 looks like, or the effect on W40/W49. Team Vector has one member, which a "Team" label hides (a solo group; confirm intended). Individual overrides are an acceptance check here but have no UI here (they live in W49/W53), so this check cannot be tested on this page. "Publish group set" is shown although version 1 already has a receipt, so it is unclear whether this action would republish or create version 2. Group set vs section vs allocation is explained on W33 for students, not on W47 where the instructor chooses.
- **Gaps:** Move/Change-membership dialog, effective time, capacity, unassigned pool and empty state, random preview, stale enrollment, withdrawn learner, late-joiner, unsaved-changes dialog, TA read-only view, preview mechanism, narrow selector layout.
- **Open decisions:** Rule conflict: W47→W34/W33 staff preview. Options: add a staff "view as team" mode of W34 with the preview banner (matches the student-preview rule in Spec 02), or remove the link and show a staff-only group summary in W47. Policy: how late joiners and withdrawn members are graded (individual override with reason, per W40's "common score with explicit overrides"). Policy: self-enrollment in v1.
- **Design next:** PC move-member dialog with old/new group, effective time and open assessments. PC version history list (v1, v2). PC unassigned/new-enrollment state. PC random preview. PC unsaved-changes dialog. PC TA read-only. Staff "preview as team" variant of W34, if chosen.

### W55 · Announcement editor
- **Roles / priority / stage:** instructor (all), TA (listed, but authoring disabled by default; may only preview). Core. Stage 3. J09.
- **Job to be done:** Write an announcement, choose the audience and time, preview, publish or schedule, and see honest delivery status.
- **Gets here from → goes to:** From W28 (authoring link), W35 (course communication), W29 (edit), W08 source. To W29 (Preview), stays on page for publish/schedule/cancel. Resolves. The drawn URL is /announcements/new, while the spec route needs an ID with /edit.
- **Drawn today:** PC instructor: "New announcement", Preview and Schedule buttons; Title "Quiz 3 opens Wednesday"; message; attachment "quiz3-practice.pdf · accessible version added"; "Audience All of PHYS 110 · 3 learners"; "Publish Tue Oct 20, 5:00 PM"; "Email Sent as learners prefer"; "Status: draft. Nothing has been sent." No TA view, no dialog, no revision, delivery or failure screens, despite the note promising "queued, sent or failed".
- **Spec in brief:** Fields: title (1–160) and body (no assessment keys or held grades), audience (course default or enrolled subset, count reviewed vs roster), timing (now/scheduled, after current time, course zone), attachments (processed resources only), edit summary (required for substantial post-publication changes). Actions: save draft, preview (exact content and audience counts), publish/schedule (blocked on invalid content, empty audience, stale roster/preview), cancel schedule. States: draft (staff-only badge), scheduled (exact time, cancel/edit; not delivered), published revision (old text beside draft diff), delivery delayed/failed (separate Published from Pending/Failed counts; retry without duplicate feed item). Dialog: "Publish announcement" (exact count, subset labels, time, learner preview; delivery preferences affect delivery, publication recorded separately). Acceptance: schedule hidden from learners until publication; failed email leaves one published announcement with retry; TA can draft only with an explicit grant and cannot publish.
- **Data it reads/writes:** Announcement draft/revision, audience, schedule, attachments, delivery attempts per channel; roster version.
- **Rules it must protect:** Drafts never notify or show in the feed. Published and delivered are different facts. No grades or answer keys. The in-app announcement exists regardless of email preference.
- **Design assessment:** The audience-count line and "Nothing has been sent" are exactly right. Problems: (a) The drawn state is contradictory: Draft with a set publish time, a "Schedule" button (so is it Scheduled or Draft?), and "Email Sent as learners prefer" in a past-tense form for something unsent. (b) The same announcement is already published in W28/W29 on Oct 19 at 9:00 AM; W55 shows it as an unsent draft for Oct 20, 5:00 PM, with different body text. (c) Queue/sent/failed language is in the note, not on the screen. (d) No unpublish/withdraw/delete action exists for a published announcement: only edit and cancel-schedule. A mistaken announcement cannot be withdrawn. (e) Subset audiences are in the spec but only "All of PHYS 110" is drawn.
- **Gaps:** Scheduled, published-with-revision-diff, delivery pending/failed, publish dialog, subset audience, preview-staleness, TA read-only/denied, validation errors (held-grade check), save failed, conflict between two editors, mobile/narrow.
- **Open decisions:** Policy: a way to retract or archive a published announcement. Policy: which delivery channels exist (email only is drawn; in-app always; push is simulated per Spec 05). Policy: how "no held grades" validation is detected (inferred: assessment-link and score pattern check).
- **Design next:** PC scheduled state. PC publish dialog. PC published + delivery "2 sent, 1 failed, retry". PC revision diff with edit summary. PC subset audience. PC TA denied. Fix draft vs scheduled labelling.

### W56 · Discussion setup and moderation
- **Roles / priority / stage:** instructor (all), TA (moderation only when explicitly scoped, with end time; authoring only if separately granted). Follow-on. Stage 3. J09.
- **Job to be done:** Set up a course or group discussion, publish it, handle reported posts, lock or reopen threads.
- **Gets here from → goes to:** From W30 (manage), W31 (report/moderate), W35. To W30 (publish) and W31 (lock/reopen). The drawn page is the manage list (/discussions/manage), but the spec route is /discussions/:discussionId/manage, so per-thread entry from W31 is not designed.
- **Drawn today:** PC instructor: "Manage discussions · New discussion"; table Topic / Audience / State: Projectile motion (PHYS 110, Open), Team Orbit planning (Team Orbit only, Open), Welcome and course norms (PHYS 110, Locked); "Reported post: 'Just post the answer for question 3.' · reported by 1 learner" with Hide post and Dismiss report. No setup form, TA view, hide dialog, action history or locked-reason display.
- **Spec in brief:** Fields: title/prompt, audience (course or group-set reference; no direct-message threads), posting window, moderation reason (required to hide, restore, lock; learner-readable, reporter hidden), report status (Open, Under review, Action taken, No action). Actions: save setup draft, publish, hide reported post (reason placeholder; original retained in restricted history), lock/reopen (who/when/why). States: unpublished, locked, reported, stale moderation (another moderator already acted). Dialog: "Hide contribution". Acceptance: every post shows author, role, time; locking removes reply controls but keeps contributions; a TA cannot moderate another group by changing the route ID.
- **Data it reads/writes:** Discussion setup, posts, report records, moderation actions with reason, actor and time.
- **Rules it must protect:** Reporter identity restricted. No automatic penalty. History retained (hide is reversible, original preserved). Grading allocation alone gives no moderation right. Group threads follow membership and never become private messaging.
- **Design assessment:** Table plus report card is a workable layout. Problems: "Dismiss report" does not match the spec status set (Open, Under review, Action taken, No action); there is no "Under review". "reported by 1 learner" with three learners and a named TA is close to identifying the reporter (inferred). The note ("A hidden post says who hid it and why") has no drawn evidence. The reported post is not tied to its thread, so context is missing. Lock reasons are not shown. A reported post for a single answer-seeking message is a good realistic example.
- **Gaps:** Setup form, hide dialog, moderation history panel, TA scoped view, TA expired, stale-moderation, restore, reopen, group audience selection, the learner-side view of a hidden post.
- **Open decisions:** Policy: who is the moderator by default and whether a TA ever moderates (spec: explicit, time-bound grant). Policy: can the hide reason be seen by everyone or only the author. Policy: report count shown to staff.
- **Design next:** PC hide dialog. PC moderation history timeline with learner-visible explanation column. PC discussion setup form including group-set audience. PC TA scoped view and expired scope. PC stale-moderation. PC restored post.

---

## Segment fix list
1. [rule-conflict] W47→W34 (and W33 "staff preview return") sends staff to student-only pages. Decide: staff "view as team" mode of W34 with a preview banner (cannot submit or mark), or remove the link. Update the W47 entry text, the W33/W34 roles and the nav map.
2. [data] Add fixtures for announcements (published/scheduled/draft, revisions, audience, read markers), discussion posts and reports, moderation actions, and delivery attempts per channel. None exist in the 84_Q fixture list.
3. [state] W55 vs W28/W29: the same announcement is published Oct 19 for students and an unsent draft scheduled Oct 20 5:00 PM for staff. Pick one world, or add distinct records and label them.
4. [state] W33 shows "In progress" while W34 shows a received receipt; the receipt is dated Oct 22, after the Oct 20 scenario clock. Align to one scenario override and label the scenario.
5. [state] W55: resolve Draft vs Schedule and the past-tense "Email Sent as learners prefer". Draw Scheduled, Published, and Delivery pending/failed with separate counts and retry.
6. [rule-conflict] No way to withdraw a published announcement. Specify retract/archive with history, and the learner-visible outcome.
7. [state] W47: draw move-member dialog (effective time, old/new group, open assessments), version history, unassigned and stale-enrollment states, TA read-only. Clarify "Publish" vs "new version" when a receipt exists.
8. [rule-conflict] W47 acceptance on individual overrides has no UI on this page. Move it to W49/W53 or add an overrides summary (learner name and reason) to W47/W34-staff.
9. [state] W56 and W31: draw the Hide dialog, history, hidden-post placeholders (reader vs author), report confirmation, TA scope and expiry. Align status labels (Open/Under review/Action taken/No action).
10. [link] W56 route needs a discussion ID; W30 "Manage discussions" and W31 "Moderate" need distinct targets (list vs per-thread). Drawn URLs for W47 (/groups/manage), W55 (/announcements/new) and W56 (/discussions/manage) differ from the manifest.
11. [rule-conflict] W30 shows Maya Chen as the author of "Projectile motion" while W31 opens with Aisha's post; reply count 6 vs 2 posts shown. Fix fixture and copy.
12. [state] W28: model read state plus "Updated" together; draw pins, sort, mark-all-read (dialog has no opener), empty, no-match, failure and archived states.
13. [state] W29: draw revision selector, change summary, Back link, external-link dialog, attachment failure and unavailable page. Add a "staff preview" banner for W55→W29.
14. [copy] W33 breadcrumb says "Coursework"; "TA" vs "Teaching assistant" differs between W31 PC and iPhone; "Authorised/authorized" mix on staff pages.
15. [device] W29, W30, W33, W34 and all staff pages in this segment are desktop-only. W28 and W31 phones use a bottom tab bar that Spec 03 rules out for narrow web. Decide, then draw the 320–390px layouts.
16. [rule-conflict] Priority mismatch: W28/W30 are "core" in the spec, "optional" in matrix.txt; W56 "follow-on" but W30 depends on it.
17. [data] Small-class privacy: counts like "reported by 1 learner", "2 members" and "3 learners" can identify people. Decide display thresholds for report counts and group-only topics.
18. [state] Explain "group set vs section vs grading allocation" on W47 (and W57) as W33 does for students. Section definitions are not in this segment's scope, so where sections live is unresolved.


---

# Segment 5 · Instructor and TA: build and run the course (W35–W46, W59, W60)

Sources: Spec 01–06, navigation.json (txt/81), route manifest (txt/82), fixtures (txt/84), page specs W35–W46, W59, W60, W50 (for rubric proposals), drawn/H.txt, drawn/T.txt, and the 15 Nov review. Items marked "(inferred)" are my reading, not text on the board.

## Segment overview

**Purpose.** This is where staff author what students receive (outline, syllabus, lessons, files, assignments, quizzes, question bank, rubrics), decide who may help (people and TA scope), record operational timing exceptions (allowances), and carry a course into the next term (copy, import/export). It is the write side of the "received work is immutable" promise.

**Who it serves.** The instructor (Dr. Diane Reyes) is the only author. The TA (Maya Chen, access ends Oct 25 11:59 PM) gets read-only or no-access views. Authoring is "off by default" for TAs in every spec.

**Journeys (inferred numbering, following the order in Spec 04).** J04 Course setup (W35–W40, W43–W44), J05 Quiz (W41, W42 authoring side), J07 Group work (W40 targeting), J08 TA workload (W45), J11 Exceptions (W46), J12 Term continuity (W59, W60). J03 Grade and release is touched through rubric changes (W43/W44 into W50).

**Build stages (Spec 05).**
- Stage 1: W35–W40, W43, W44.
- Stage 2: W41, W42, W45, W46.
- Stage 4: W59, W60.
- Note: Stage 1 W40 and W44 depend on W47 (group sets) and W50 (rubric impact), which are Stage 2.

**Design principles visible in the screens and specs.**
1. Draft and published are separate. Students see the last published version until the instructor publishes deliberately ("Published · draft edits", W35).
2. Edits never reach received work. Every editor says how many receipts exist and which version they belong to (W40: "2 receipts belong to version 2. Changes publish as version 3"). Question bank, rubric, file and quiz edits all create a new pinned version.
3. Validation blocks the consequential action, not saving. A draft can always be saved, but publish is disabled with counted errors linked to the item.
4. Authority stops at the instructor. TAs never publish, change policy, grant allowances or see basis references.
5. Privacy by separation. The learner-visible reason is separate from the instructor-only basis (W46). Copy and export are content-only (W59, W60).
6. Impact is previewed before anything consequential: publish, availability change, rubric change, allowance, copy and import all name what changes and what does not.

**Segment-wide risks.**
- Navigation. The 10-item staff sidebar drawn on every page has no route to Files, Rubrics, Question bank, Allowances, Copy or Import, and none to Coursework. Almost every page's declared entry from W35 does not exist (see the nav fix below).
- Every page is drawn once, for the instructor only. No TA read-only view, no state and no dialog is drawn, and the staff shell is identical for the TA.
- No unpublish or hide action exists anywhere. An instructor who publishes the wrong thing has no protective way out.
- Version vocabulary is inconsistent: "version 3", "v2", "Version 1".
- Rule conflicts: W59 drawn copies Announcements, TA preview of a course as a student, TA role on W42/W59 versus no-access defaults.
- Nothing here has been verified in a browser. All pages are desktop-only today.

## The W35 entry-point mismatch and the grouped staff-tools nav fix

**What the specs claim versus what exists.** W35's actions are only Add module, Edit selected content, Preview as learner, Publish selected, Save draft and Cancel. The drawn W35 has just Preview as learner, Add module and Publish selected. Yet other pages list W35 as their entry:

| Page | Says it is entered from | Exists? |
|---|---|---|
| W36 | "W35 settings" | Resolves only via the sidebar Settings item (W35 header mentions "settings", not drawn) |
| W39 | "W35 Files" | No |
| W40 | "W35 add assignment" | No. Real entry is W18 "New assignment" |
| W41 | "W35 add quiz" and "W48 assessment settings" | No. W48 has no such action; real entry is W18 |
| W42 | "W35 assessment tools" | No |
| W43 | "W35 tools" | No |
| W45 | "W35 People" | Resolves through the sidebar People item |
| W59 | "W35 Next term", "W06 course copy action" | Neither exists |
| W60 | "W35 import content" | No |
| W55, W56, W58 (outside this segment) | "W35 communication", "W35 Insights" | No |

**Related drawn defects.**
- The drawn staff sidebar has Overview, Builder, Grading, Gradebook, People, Groups, Calendar, Announcements, Discussions and Settings. It has no Coursework item, so the staff W18 list (which owns "New assignment") has no nav route. Spec 02 calls that item "Assessments", but navigation.json omits it.
- Spec 02 says Files, Rubrics, Question bank, Allowances, Grading allocations, Insights and Copy/Import appear "as grouped course tools rather than an unstructured 26-item sidebar". navigation.json defines that group ("Staff Tools"), but no drawn screen shows it.
- W59 and W60 breadcrumbs say "Settings" even though navigation puts them in Staff Tools.
- Route paths: drawn URLs lack the `/teach/` prefix used in the manifest. Drawn W35 is `/build`, spec `/builder`. Drawn W38 is `/lessons/vectors/edit`, spec `/content/:id/edit`. Drawn W60 is `/transfer`, spec `/content-transfer`.

**Proposed fix (three layers).**
1. **Sidebar, two groups.**
   - Core course items: Overview, Coursework (or Assessments), Builder, Grading, Gradebook, People, Groups, Calendar, Announcements, Discussions, Settings.
   - A labelled, collapsible "Course tools" group below a divider, with items in navigation.json order: Files, Rubrics, Question bank, Allowances and requests, Grading plan, Insights and attendance, Grade review requests, Copy course, Import and export.
   - A TA sees only the entries their mode allows, and a read-only chip on each. Question bank, Copy and Import are absent for TAs (`no_access_default`).
2. **W35 owns the entry points it claims.**
   - Header menu "Course tools" repeats the group.
   - Each module row gets an "Add item" menu: Lesson (W38), Assignment (W40), Quiz (W41), File (W39 picker), Question from bank.
   - Outline footer "Resources" strip: Files (n), Rubrics (n), Question bank (n), each with a link.
   - "Import content" opens W60. "Next term" or "Copy this course" opens W59.
3. **Other doors.**
   - W06: a "Copy for next term" row action on past and current courses (W59 cites it; W06 has none).
   - W18: keep "New assignment" and add "New quiz" or a chooser, since W40/W41 enter from there.
   - W42: add an "Import questions" button leading to W60 (spec says W42 reviews import via W60).
   - W45: each learner row links to W46 (spec action "View operational allowances").
   - Allowances needs a course-level index (see W46): nav item "Allowances and requests" points to a per-learner route today.

On iPad, the tools group becomes a "Tools" popover in the course header. On narrow web it becomes a section inside the course navigation disclosure (Spec 03: disclosure, not a tab bar).

## Cross-cutting design proposals

### Publish validation (one shared pattern)
- **Publish review panel** (drawer on iPad, full page on narrow) opened by every Publish button (W35, W36, W37, W38, W40, W41). It has four parts:
  1. What changes: item, old version to new version, learner-visible diff, opening and due dates in the course zone.
  2. Blockers (red, with icon and words) and warnings (amber, need an explicit tick). Each links to the field or block.
  3. Impact: learners who can see it, receipts and attempts that stay on the old version, active attempts, excluded drafts.
  4. Fingerprint line: "Review applies to these exact versions". Any change, including a concurrent edit, invalidates it ("Preview changed. Review again.").
- **Blockers by page, from the specs.**
  - W35: missing title; course lacks syllabus or valid policy; unpublished parent; inaccessible required resource; stale version.
  - W36: required syllabus sections blank; assessment AI rule above course ceiling; unresolved policy mismatch; stale preview; zone change without date-effect review.
  - W37: prerequisite cycle (show the path); close before open; hidden required prerequisite; child missing.
  - W38: image without alternative; essential media without transcript or captions; resource still processing; invalid blocks.
  - W40: close before due; question maxima not equal to total; rubric total mismatch; group mode with unassigned learners; AI rule above ceiling; no grade category.
  - W41: choice key missing; window not open ≤ due ≤ close; invalid points; active-attempt rule conflict.
  - W44: score above criterion maximum; total differs from attached maximum; unresolved accessibility errors.
- **Uncertain and partial results.**
  - If the save cannot be confirmed the page says "Not confirmed", never "Published" (mock contract `pending_confirmation`).
  - Multi-item "Publish selected" returns item-level results (`partial` in the contract), with retry for failed items only.
  - Offline blocks publish and keeps the local draft.
- **Missing and needed.**
  - An Unpublish or "Hide from learners" action, keeping all received work.
  - A "Restore earlier version" action that creates a new version rather than deleting.
  - A "Publish correction" path for a typo in a live handout, with a changed-item notice.

### Versioning (edits never change received work)
- One scheme everywhere: "Version 3" for published, "Working draft (from v3)" for unpublished edits. The board currently mixes "version 2", "v2" and "Version 1".
- Rules to protect:
  - Every receipt, attempt and release stores the version it used (fixtures: receipt `assessment_version`, grade_draft `rubric_version`).
  - A draft in progress on v2 when v3 publishes should be warned at review ("This assignment changed. Review before sending") and never silently switched (inferred).
  - Question bank edits save a new version; quizzes keep the pinned one (W41 says "pinned", W42 says "copies selected version into caller quiz". These must be reconciled: choose pinned reference).
  - Replacing a file creates a new version; frozen submissions and snapshots keep the old file (W39).
  - Quiz edits after learners start create a new version. Key edits after submission cannot rewrite snapshots and enter held review (W41).
  - Rubric edits in use become proposals (W44/W50).
- Open: do date-only changes (e.g. extending PS4 close) create a new version or an audited change on the same version? Do already-submitted learners get re-evaluated for lateness? [policy]

### Accessibility checker (alt text, transcripts)
Drawn W38 is the best single example on the board: two blocking items with a "Fix" button each. Proposed shared checker (W38 primary; W39, W36 attachment, W41/W42 question media, W44 descriptors reuse it):
- **Blocks publish.**
  - Image with no alternative and not marked decorative. Offer an explicit "Decorative" toggle (spec field "text or decorative flag"; not drawn).
  - Essential video or audio without captions and transcript. Drawn shows "transcript" only; add captions and, where visual-only information matters, audio description (inferred).
  - Skipped or empty heading level (spec state "Missing alt or skipped heading").
  - Equation or diagram without a text equivalent (Spec 03).
  - Essential file with no accessible alternative (W39, W36 attachment).
  - Attached file still processing or failed (W38, W39).
- **Warns.** Alternative that is a filename, "image of..." or very long; link text such as "click here"; table without header row; meaning shown by colour only (all inferred from Spec 03 principles).
- **Behaviour.**
  - Counts errors, focuses the first affected block, explains the remedy (spec).
  - Stores the result with the published version.
  - Never claims WCAG conformance or automatic detection quality (Spec 03, same restraint as "no OCR accuracy claim").
  - "Not needed" in W39's accessible-version column is an instructor attestation and should say so (inferred).
- Vocabulary clash: "description", "alternative", "accessible version", "transcript" and "alt text" all appear. Pick one family.

### TA read-only modes (from navigation.json)
| Entry | TA mode | What the TA view must be |
|---|---|---|
| Builder W35 | read_only | Outline with publication state and learner preview if allowed (see conflict); no Add, Publish or Save |
| Settings W36 | read_only | Published syllabus and ceiling; no draft text; no basis data |
| People W45 | restricted_read_only | Own scope, access end, permitted roster only (Aisha, Ben); no Carmen, no invite, no revoke |
| Files W39 | published_or_assigned_read_only | Published or assigned files only; Download allowed in scope; no unpublished drafts |
| Rubrics W43 | assigned_read_only | Rubrics for assigned work; "Propose change" instead of edit (via W49/W50) |
| Question bank W42 | no_access_default | Absent from nav; direct URL gives the access-denied variant of W13 |
| Allowances W46 | effective_timing_only | Personal timing numbers in work context only; no list, no basis |
| Copy W59, Import W60 | no_access_default | Absent; denied on direct URL |

- **Design rules.** Remove action buttons rather than showing disabled ones. Render fields as plain text, not disabled inputs. Show a persistent chip: "View only · assigned work · access ends Oct 25, 11:59 PM". Remove staff-only content (keys, basis references) from the DOM, not just hide it.
- **Expiry.** After Oct 25 11:59 PM every one of these routes shows the expired variant (W13/W45), with saved attribution untouched.
- **Conflicts.**
  - W35, W40 and W41 let a "scoped TA" preview as learner, but the Spec 02 matrix gives student preview to instructors only (known defect; owner call).
  - W42 and W59 specs describe TA states ("Scope expired", "may inspect source content") while navigation says no access.
  - W41 shows keys on page; a TA must not see keys for questions they are not assigned to grade (inferred).

### Allowances privacy
- Three audiences:
  1. Instructor sees everything including the basis reference.
  2. TA sees effective timing only, with no "extra time" label or delta. The mere word "allowance" reveals an accommodation (inferred).
  3. The learner sees "30 minutes, which includes your extra time" only on their own W19/W25.
- Copy defect: drawn W46 labels the basis "(staff only)", but the spec says instructor only; a TA is staff. Change to "Instructor only".
- No allowance data in: notification previews, search, calendar of others, gradebook or exports (W60), copy (W59), group views, announcements.
- "Reason to learner" is free text. Add a hint and a warning: "Describe the outcome, not the reason. No health or diagnostic details."
- The incoming-request field is also free text. Warn learners before they type; the specs forbid medical documents and a message thread.
- The basis reference needs a read log visible to the instructor only (inferred).
- Open: should the instructor's own course home (W14 "Aisha +10 min") be allowed to name the learner on a shared screen?

### Copy excludes learner records
- Use an allow-list of content types (modules, lessons, files, assessment definitions, rubrics, question bank, policy drafts, syllabus), never "everything minus exclusions".
- Never copy: enrollment, staff grants, group memberships, submissions, scores, feedback, posts, allowances, attendance (W59 dialog), nor released snapshots or receipts.
- The destination is a new ID, unpublished, zero learners, no staff grants beyond the creating instructor (inferred), versions reset, rubrics reset from "in use" to "ready".
- Free text can still contain learner names. Add a warning that staff should review the copied text (inferred).

## Device recommendations (Spec 03: staff bulk work best on desktop, narrow alternative for review and protective actions)
Tiers: iPad landscape (about 1024–1366) uses the desktop layout with a collapsible sidebar. iPad portrait (about 768–834) uses the intermediate layout (rails become drawers). Phone and narrow web (320–767) is review plus protective actions only. Native iOS parity is not claimed (project rule).

| Page | iPad / narrow needed? | What it contains |
|---|---|---|
| W35 | Yes, both | iPad: full outline with inspector as drawer. Narrow: outline status, check counts, "Hide from learners", learner preview, publish review (read plus confirm). |
| W36 | iPad yes; narrow review | iPad: edit and publish. Narrow: published text, history, ceiling, access dates; edit and publish only on iPad or desktop. |
| W37 | iPad yes; narrow review | iPad: move up/down buttons, rule fields. Narrow: rules, cycle and availability check. |
| W38 | iPad yes (editing); narrow checker only | iPad: block list, canvas, checks in a drawer. Narrow: accessibility check list with per-issue Fix for alternatives (short text edits). |
| W39 | Yes, both | Library list with status, replace and download; narrow: status, usage, failed and processing retry. |
| W40 | iPad yes; narrow review | iPad: edit. Narrow: dates, receipts-by-version panel, publish review, "Hide". |
| W41 | iPad yes; narrow review | iPad: edit with key masked. Narrow: settings, active-attempt state, held-results state. |
| W42 | iPad optional; narrow no | List and usage; desktop for authoring. Narrow shows "Open on a larger screen". |
| W43 | Yes, both | List with status, usage; retire; open impact. |
| W44 | iPad landscape only; narrow review | Level matrix needs width. Narrow: read the rubric, in-use banner and "Preview impact". |
| W45 | Yes, both | Protective: revoke, change end date, pending invites; narrow is the key one (quick revoke from a phone). |
| W46 | iPad yes; narrow review | iPad: record and end allowance. Narrow: active allowance, decide a pending request, end allowance. |
| W59 | iPad yes; narrow review | Preview and exceptions on iPad. Narrow: status of a copy in progress or result only. |
| W60 | iPad optional; narrow no | Import validation tables are dense; narrow shows the last log only. |

---

### W35 · Course builder
- **Roles / priority / stage:** instructor edit, TA read-only (nav `read_only`, spec lists TA). Core. Stage 1.
- **Job to be done:** Instructor assembles the outline and sees exactly what learners can reach today, then publishes reviewed items. TA inspects the outline of an assigned course.
- **Gets here from → goes to:** From W05, W06, W14 "Open course tools", W59 copied draft. To W37 (add module), W38 (edit content), W14 (learner preview), plus the nine unresolved destinations claimed by other pages (see section above).
- **Drawn today:** One PC instructor screen (role code "ia"): Module 1 Published (4 items), Module 2 Published with draft edits (4 items, 1 unpublished change), Module 3 Draft, a "Learners can reach today" side panel (modules 2 of 3, items 8, hidden drafts 1 module), "Publish selected" with "Publish Module 2". Buttons: Preview as learner, Add module.
- **Spec in brief:** 4 fields (title, outline position, publication selection, code/term/section), 6 actions, 4 states (empty outline, blocked publication, published with draft edits, save conflict), 2 dialogs (publish course changes, unsaved changes), 4 acceptance checks. Moving Module 4 keeps links and question IDs; TA can inspect but not edit or publish; concurrent edit blocks publish; incomplete draft saves.
- **Data it reads/writes:** course, modules, items, draft versus published versions; PHYS 110 modules 1 to 3.
- **Rules it must protect:** received work unchanged by publishing; stable IDs on move; course must have syllabus and valid policy before publishing; no self-provisioned enrollment; TA authoring off.
- **Design assessment:** The "what learners reach today" panel is the strongest idea. It makes draft versus published concrete. Copy "Module 2 has 1 draft edit. Review it, then publish." is clear. Problems: the publish button names one module while the control is "Publish selected" and no selection checkboxes are drawn; no validation result or learner-impact count (spec state mentions it); no TA view; no entry points for the tools other pages claim; drawn path `/build` differs from `/builder`.
- **Gaps:** blocked-publication, save-conflict, empty-outline and unsaved-changes states; publish dialog; keyboard move alternative; item-level add menu; unpublish; partial publish; TA read-only; iPad and narrow.
- **Open decisions:** whether publishing a module cascades to its draft children [policy]; whether publish notifies learners in W08 [policy]; TA learner preview [rule conflict].
- **Design next:** (1) W35 publish review drawer with blockers, warnings and impact, desktop; (2) blocked-publication and save-conflict states; (3) empty outline with start options; (4) per-module Add item menu and Course tools menu; (5) TA read-only view; (6) iPad outline and drawer inspector; (7) narrow outline status with Hide.

### W36 · Course settings, syllabus and publication
- **Roles / priority / stage:** instructor edit, TA read-only. Core. Stage 1.
- **Job to be done:** Instructor writes the syllabus, sets zone, access window and AI ceiling, and publishes a versioned syllabus. TA reads and previews.
- **Gets here from → goes to:** From the sidebar Settings (spec says W35) and W15 staff preview return. To W52 (grading policy) and W15 (preview).
- **Drawn today:** One PC instructor screen: syllabus sections list (Contacts, Late work and resubmission, AI and tool rules, Grading), AI-use ceiling "Clarify concepts only; disclose assistance", attachment "physics-110-syllabus.pdf · accessible version added", Course card (code, section, zone "Eastern (EDT)", access window "Sample dates"), Publication history ("Version 1 Published · current"), link to Grading policy.
- **Spec in brief:** 5 fields (sections, zone, access window, AI ceiling, attachment), 4 actions, 4 states (incomplete, policy conflict, published revision pending, uncertain save), 1 dialog (publish changed syllabus), 3 acceptance checks (preview shows exact ceiling and version; AI-disabled course offers no assistant; zone change needs date review).
- **Data it reads/writes:** syllabus versions, zone, access window, AI ceiling, policy link, assessments' AI rules.
- **Rules it must protect:** stricter assessment AI rule wins; published snapshots immutable; no direct inbox in the communication route; grading rules live in W52.
- **Design assessment:** Clean and consistent with W15. Disagreements: drawn ceiling text ("Clarify concepts only") does not match the spec enum (Not allowed, Limited, Allowed with disclosure); "Sample dates" and "Eastern (EDT)" are placeholders (spec asks an IANA zone). Required sections (objectives, requirements) are not visible. History shows one row and no changed-paragraph diff. W59 and W60 sit under Settings in breadcrumbs.
- **Gaps:** all four states and the publish dialog; side-by-side draft diff; assessments affected by the ceiling; TA read-only; narrow.
- **Open decisions:** AI ceiling labels versus enum names [copy]; who sets the course access window when institution-managed [policy].
- **Design next:** (1) syllabus draft with checklist and diff, desktop; (2) publish dialog with affected assessments; (3) policy-conflict state; (4) zone change date-effects drawer; (5) TA read-only; (6) iPad.

### W37 · Module editor
- **Roles / priority / stage:** instructor edit; TA read-only via "Check learner access". Core. Stage 1.
- **Job to be done:** Instructor orders items and sets opening and prerequisite rules. TA checks who can reach a module.
- **Gets here from → goes to:** From W35 (add or edit module) and W16 preview return. To W38 (add lesson), W16 (check learner access).
- **Drawn today:** One PC screen: Module 2, title, availability "Open now", prerequisite "Module 1", completion rule "Finish all required items", four items (Lesson, Reading, Quiz 3 marked Required, Motion investigation), "Add lesson", "Check learner access", "Publish module".
- **Spec in brief:** 5 fields (title, summary, availability, prerequisites, completion rule), 6 actions, 4 states (empty, cycle detected, scheduled, child missing), 2 dialogs (change availability, unsaved changes), 4 acceptance checks (keyboard move equals drag; cycle blocks publish with path; removing a lesson keeps completion and received work; incomplete draft saves).
- **Data it reads/writes:** module, ordered child IDs, prerequisites, completion records (read-only).
- **Rules it must protect:** no cycles; viewing is not mastery; removing a child never erases history.
- **Design assessment:** Note on the board explains the rule well. The completion rule drawn ("Finish all required items") differs from the spec enum ("View required lessons" or "complete selected requirements"). "Add lesson" is the only add control, though a module contains readings, a quiz and an assignment.
- **Gaps:** move up/down buttons are not drawn; cycle, scheduled, empty, child-missing states; change-availability dialog; "Add assignment, quiz, file" menu; delete or hide module; TA view.
- **Open decisions:** what a learner mid-module sees when prerequisites change [policy].
- **Design next:** (1) item list with move buttons and Add item menu; (2) cycle error with path; (3) change-availability dialog with affected learners; (4) scheduled and child-missing states; (5) iPad.

### W38 · Learning-content editor
- **Roles / priority / stage:** instructor edit; assigned TA may preview. Core. Stage 1.
- **Job to be done:** Instructor writes a lesson from ordered blocks and fixes accessibility issues before publishing.
- **Gets here from → goes to:** From W35 outline item, W37 add lesson, W39 insert return. To W39 (insert resource), W17 (preview).
- **Drawn today:** One PC screen: "Lesson: Vectors and components" with blocks Heading, Text, Image (Needs attention), Video (Needs attention), and an Accessibility check card: "Image has no description" and "Video has no transcript", each with Fix, "2 issues stop publishing". Buttons: Preview lesson, Publish revision.
- **Spec in brief:** 5 fields (title, blocks, image alternative, media transcript or captions, resource version), 6 actions, 4 states (unsaved draft, accessibility issues, resource processing, offline or conflict), 2 dialogs (discard local draft, unsaved changes), 4 acceptance checks (missing alternative blocks publish and names the block; preview records no completion; failed autosave never says "All changes saved"; incomplete draft saves).
- **Data it reads/writes:** lesson blocks, asset versions, accessibility results.
- **Rules it must protect:** pasted scripts are sanitised; published page stays stable until publish; preview records no completion; replacing a file never mutates older page versions.
- **Design assessment:** The strongest accessibility moment on the board. The block navigator plus checker lets the instructor see the issue in context. Gaps against spec: no "decorative" choice, no heading-skip check, no captions or audio description, no equation block alternative, no autosave indicator drawn.
- **Gaps:** saving, failed save, conflict, processing states; discard dialog; block add menu and keyboard move; narrow and iPad.
- **Open decisions:** which media counts as "essential" [policy]; whether an instructor may publish with a documented exception to an accessibility blocker [policy].
- **Design next:** (1) checker states: none, warnings only, blocking; (2) block editor with decorative toggle and caption upload; (3) autosave states; (4) conflict compare; (5) iPad with checker drawer; (6) narrow checker-only list.

### W39 · Files and resources
- **Roles / priority / stage:** instructor edit; TA download of published or assigned files only (nav `published_or_assigned_read_only`). Core. Stage 1.
- **Job to be done:** Instructor manages assets with status, accessible alternatives, usage and versions. TA fetches a file they need for grading.
- **Gets here from → goes to:** From "W35 Files" (does not exist), W38 insert, W40 attachment picker. To the calling editor on insert.
- **Drawn today:** One PC screen: table with Name, Status, Accessible version, Used in. Rows: sample-handout.txt (Ready, not needed, Module 1), sample-page.svg (Ready, description added, lesson Vectors), projectile-notes.pdf (Processing, waiting, Module 2), lab-sheet.pdf (Failed, not used). Button Add files.
- **Spec in brief:** 4 fields, 4 actions (add, insert, replace, download), 4 states (empty, uploading, failed, in use), 1 dialog (replace referenced resource), 3 acceptance checks (replaced handout stays reachable from historical snapshots; failed upload cannot be inserted; TA cannot reach out-of-scope files).
- **Data it reads/writes:** assets, versions, hashes, usage references, alternative resources.
- **Rules it must protect:** replacing a file never changes what students already received; frozen snapshots keep the old version; no ready badge on failed items.
- **Design assessment:** Note promises version history, but the table shows none and there is no detail panel or Replace control. The failed file shows no reason or retry (spec: reason beside the file). "Not needed" under Accessible version needs an owner.
- **Gaps:** detail panel, replace dialog, usage listing (live versus frozen), upload queue, empty state, filters and search; TA view; entry point from nav.
- **Open decisions:** quota and size limits (proposed, not final) [policy]; who may mark "Not needed" [policy].
- **Design next:** (1) detail drawer with versions and usage; (2) replace dialog; (3) failed and processing states with retry; (4) upload queue; (5) picker mode for W38 and W40; (6) iPad list plus detail; (7) narrow status list.

### W40 · Assignment editor
- **Roles / priority / stage:** instructor edit; scoped TA preview. Core. Stage 1.
- **Job to be done:** Instructor sets rules and publishes a new version without touching received work.
- **Gets here from → goes to:** Actually from W18 "New assignment" (spec lists W35, W18 preview, W47). To W47 (groups), W43 (attach rubric), W19 (preview).
- **Drawn today:** One PC screen for Problem Set 4: title, Due Fri Oct 16 11:59 PM, Close Sun Oct 18 11:59 PM, AI rule, accepted files (PDF, PNG, JPG, up to 10 files, 25 MiB each, labelled "proposed limits"), Note "2 receipts belong to version 2. Changes publish as version 3 and never rewrite them." Buttons: Preview assignment, Publish changes.
- **Spec in brief:** 10 fields (title and instructions, dates, question maxima, target mode and group set, group grade mode, AI rule, grade category, file rules, attempts, audience), 6 actions, 4 states (invalid dates, unassigned targets, work already received, concurrent group change), 2 dialogs, 4 acceptance checks (group submission yields one receipt; membership change never rewrites ownership; publication fails on total mismatch; incomplete draft saves).
- **Data it reads/writes:** assignment versions, receipts count, group set snapshot, rubric version, category, PS4 (v2 to v3).
- **Rules it must protect:** received attempts immutable; due controls lateness, close controls eligibility; AI rule not above ceiling; target mode locked once work exists.
- **Design assessment:** Excellent single sentence of impact. Only 5 of 10 fields are drawn: no points, rubric, category, group mode, attempts or audience. PS4 is already past close at the scenario clock (Oct 20), which is a good realistic case. Spec mentions "allowances listed separately" but nothing is drawn.
- **Gaps:** all four states and dialogs; group version; rubric attach; question maxima table; per-item publish review; hide or unpublish; version history; TA view; narrow.
- **Open decisions:** does changing a date create a version and affect lateness of work already received? [policy]
- **Design next:** (1) full form with question maxima and rubric check; (2) group target variant (Motion investigation); (3) invalid dates and total mismatch; (4) publish revision dialog with receipt count; (5) work-received lock state; (6) iPad; (7) narrow review.

### W41 · Quiz editor
- **Roles / priority / stage:** instructor edit; scoped TA preview (keys hidden). Core. Stage 2.
- **Job to be done:** Instructor authors a versioned quiz with its own window, timer, attempts and held results.
- **Gets here from → goes to:** From W18 (spec says W35 add quiz, W42 insert, "W48 assessment settings", which does not exist). To W42, W25 (preview attempt), W46 (review allowances).
- **Drawn today:** One PC screen: Quiz 3 Projectile motion, questions version 3 (single choice, multiple select, numeric, written) each with "Key (staff only)" shown, settings Opens Wed Oct 21 8:00 AM, Due Thu Oct 22 11:59 PM, Timer 20 minutes, Attempts 2, Results held. Note "Active attempts. Changing questions after learners start creates a new version."
- **Spec in brief:** 6 fields, 6 actions, 4 states (invalid question, active attempts, results held, interrupted save), 2 dialogs (change published quiz, unsaved changes), 4 acceptance checks (assignment dates never change quiz timing; blur never cancels an attempt; key edit cannot rewrite snapshots).
- **Data it reads/writes:** quiz version, questions, keys, pinned bank versions, attempt snapshots (counts).
- **Rules it must protect:** open ≤ due ≤ close; one allowance mode; attempt snapshots immutable; release is held; deadline equals earlier of personal close and start plus effective timer.
- **Design assessment:** Key visible by default on screen is a screen-share risk; mask by default. The note says "Active attempts" but at Oct 20 4:00 PM the quiz is not yet open (opens Oct 21), so that note would only be true in a scenario override (inferred). Close datetime, attempt selection rule, correct-answer visibility and integrity notice are missing from drawn settings. No points per question.
- **Gaps:** question editor; invalid key; interrupted save; change dialog with diff and counts; TA mask; narrow.
- **Open decisions:** pinned versus copied bank questions [rule conflict between W41 and W42].
- **Design next:** (1) full settings and per-question points; (2) invalid key state; (3) active-attempt freeze state; (4) change published quiz dialog; (5) key masking; (6) iPad editor; (7) narrow status.

### W42 · Question bank
- **Roles / priority / stage:** instructor only in practice (nav `no_access_default` for TA; spec lists TA). Follow-on. Stage 2.
- **Job to be done:** Instructor reuses versioned questions without altering quizzes already given.
- **Gets here from → goes to:** From W41 "choose bank question" and "W35 assessment tools" (missing). To W41 and W60 (import review).
- **Drawn today:** One PC screen: list of four questions with type, version (v1, v1, v2, v1) and "Used in" Quiz 3. Button Create question.
- **Spec in brief:** 5 fields, 4 actions, 4 states (empty, invalid key, used question edited, scope expired), 1 dialog (retire question), 3 acceptance checks (v2 leaves a quiz on v1; keys never in learner search or source; invalid imports excluded with row errors).
- **Data it reads/writes:** bank questions, versions, usage, keys.
- **Rules it must protect:** keys staff-only; pinned versions; no learner-identifying tags.
- **Design assessment:** Version column and usage column give the key idea. No import, no detail or usage panel, no search, and the Retire dialog has no opener (known defect).
- **Gaps:** detail and key editor, collections and tags, retire opener, empty state, TA states (scope expired contradicts no access), narrow.
- **Open decisions:** TA access to the bank at all [rule conflict]; pinned versus copied [rule conflict].
- **Design next:** (1) detail with key and usage; (2) save new version and opt-in replacement; (3) retire dialog opener; (4) import entry to W60; (5) iPad list and detail.

### W43 · Rubric library
- **Roles / priority / stage:** instructor; TA read-only for assigned rubrics. Core. Stage 1.
- **Job to be done:** Instructor finds a rubric and attaches the right version; both roles see what is already in use.
- **Gets here from → goes to:** From W40, W49 and "W35 tools" (missing). To W44, W50.
- **Drawn today:** One PC screen: table of three rubrics (Kinematics problem rubric v2, 30 points, In use by PS4; Lab report rubric v1, 20, Ready, Motion investigation; Short written answer draft, 4, Draft, not used). Button New rubric.
- **Spec in brief:** 4 fields, 4 actions, 4 states (no results, incompatible points, in use, unavailable version), 1 dialog (attach rubric version), 3 acceptance checks (caller gets the exact version; retiring keeps old feedback readable; mismatched maximum disables Attach).
- **Data it reads/writes:** rubrics, versions, usage (held versus released).
- **Rules it must protect:** an in-use rubric is never edited quietly; pinned version; no auto-scaling of points.
- **Design assessment:** Status words map to the filter in the spec. Ambiguity: "Ready" for a rubric attached to Motion investigation versus "In use" for PS4. Define "in use" (attached to a published assessment or scored). Held versus released usage not drawn. Retire has no opener.
- **Gaps:** filters, search, incompatible-points state, attach dialog, duplicate, retire opener, TA mode.
- **Open decisions:** definition of "in use" [policy].
- **Design next:** (1) usage panel showing held and released; (2) attach picker mode with mismatch error; (3) retire dialog; (4) TA assigned read-only; (5) iPad list and detail.

### W44 · Rubric editor
- **Roles / priority / stage:** instructor edit; TA preview and impact view only. Core. Stage 1.
- **Job to be done:** Instructor defines criteria and levels; in-use edits become a proposal for impact review.
- **Gets here from → goes to:** From W43 and W50 returned proposal. To W43 (mark ready) and W50.
- **Drawn today:** One PC screen: Kinematics problem rubric, criteria 1a Setup 6, 1b Units 4, 2 Method 6, 3 Substitution 8, 4 Result 6 (total 30), levels "Full · Partial · None", note "In use. Problem Set 4 uses version 2. Your edit becomes version 3 and applies only after you review the impact", reason field "Clarify the wording for question 3", buttons Preview rubric, Preview in-use impact.
- **Spec in brief:** 5 fields, 4 actions, 4 states (new draft, invalid total, in-use proposal, conflict), 1 dialog (remove criterion), 3 acceptance checks (reorder keeps IDs; score above maximum blocks Ready; TA proposal cannot change scores).
- **Data it reads/writes:** rubric versions, criteria, usage; PS4 on v2.
- **Rules it must protect:** old version pinned; candidate labelled unpublished; no rescoring of manual overrides; released snapshots untouched.
- **Design assessment:** The in-use banner is exactly right. Level descriptors and point values per level are not visible, only names. Wording-only versus score-changing edits are not distinguished (W50 has a "wording only" state). A TA "proposal" has no authoring surface: they cannot edit, yet W50 needs a validated candidate (inferred gap).
- **Gaps:** invalid total, conflict, remove dialog, matrix view, reorder controls, TA proposal path, narrow.
- **Open decisions:** how a TA proposal is created (text note converted by the instructor) [policy].
- **Design next:** (1) level matrix desktop; (2) invalid total with arithmetic; (3) in-use proposal flow into W50; (4) TA propose-change form; (5) iPad landscape; (6) narrow read.

### W45 · Course people and staff permission
- **Roles / priority / stage:** instructor edit; TA restricted read-only. Core. Stage 2.
- **Job to be done:** Instructor grants narrow, time-limited TA access and revokes it. TA sees their own scope.
- **Gets here from → goes to:** From the sidebar People (spec: W35 People), W49 expired access, W57. To W46.
- **Drawn today:** One PC screen (role code "ia"): table with Dr. Reyes (Instructor, whole course), Maya Chen (TA, ends Oct 25 11:59 PM, "PS4 questions 1a to 4 · Aisha, Ben · cannot release or change policy"), Aisha, Ben, Carmen (students). Button "Invite course TA".
- **Spec in brief:** 4 fields, 4 actions (invite, save scope/end, revoke, view allowances), 4 states (pending, expired, revoked, roster delayed), 1 dialog (revoke), 3 acceptance checks (TA scoped to Q1 cannot reach Q2 by URL; expiry blocks writes but keeps saves; revoke is per course).
- **Data it reads/writes:** enrollments, grants, scope, access end, grant history.
- **Rules it must protect:** no self-escalation; explicit assignment; no indefinite default; revoke keeps attributed work.
- **Design assessment:** The scope string is excellent. The same drawing is used for TA, but the TA must not see Carmen or the invite button. No scope editor, no access-end editor, no "what a TA can open and cannot" table, though the note promises one.
- **Gaps:** edit scope and end-date drawer; revoke dialog; pending, expired, revoked and roster-delayed states; TA view; narrow.
- **Open decisions:** whether a TA sees other staff in the roster [policy].
- **Design next:** (1) scope editor with before/after permissions; (2) revoke dialog; (3) pending and expired rows; (4) TA self-view; (5) narrow revoke and end-date; (6) iPad.

### W46 · Learner allowances
- **Roles / priority / stage:** instructor only drawn; TA effective timing in context (nav `effective_timing_only`). Core. Stage 2.
- **Job to be done:** Instructor records and ends a scoped timing exception and decides learner requests.
- **Gets here from → goes to:** From W45 learner record, W49, W40/W41. To W19/W25/W07/W18 (outcomes).
- **Drawn today:** One PC instructor screen: Aisha Rahman, active allowance Extra minutes on Quiz 3, personal timing 30 minutes (20 plus 10), recorded by Dr. Reyes, basis reference "AS-EXAMPLE-026 (staff only)", "What Aisha sees: 30 minutes, which includes your extra time", buttons Preview adjustment, Record allowance.
- **Spec in brief:** 7 fields, 6 actions (preview, record, end, open affected work, approve request, decline request), 5 states (no allowance, timing conflict, active, expired, pending learner request), 1 dialog (record learner exception), 4 acceptance checks (assignment extension never extends a quiz; TA sees timing only; stale preview blocks; approve or decline updates W19).
- **Data it reads/writes:** allowance records, requests, personal timing, linked W19 request status; Aisha's 20+10 minutes.
- **Rules it must protect:** one timer mode; no medical data; basis instructor-only; receipts unchanged.
- **Design assessment:** The "what Aisha sees" panel is a good privacy device. Defects: "staff only" label; no pending request queue; no end allowance control; no index of all learners with allowances.
- **Gaps:** pending request state; decline with reason; timing conflict; expired; TA effective-timing component; narrow.
- **Open decisions:** group assignments and allowances [policy]; TA timing presentation [policy].
- **Design next:** (1) course-level index with pending requests; (2) request decision with approve and decline; (3) end allowance dialog; (4) TA timing chip; (5) narrow decision flow.

### W59 · Course copy and rollover
- **Roles / priority / stage:** instructor only. Follow-on. Stage 4.
- **Job to be done:** Instructor makes a separate draft course for next term from reusable content.
- **Gets here from → goes to:** From "W35 Next term" and "W06 course copy action", neither of which exists. To W35 on create.
- **Drawn today:** One PC screen: destination title "PHYS 110 · Spring 2027 (draft)", date rule "Shift all dates by 1 term", content checkboxes (Modules and lessons, Assignments and quizzes, Rubrics and grading policy, Announcements), preview "Copied 23 items", "Not copied: Learner work, grades, access", "Needs a choice: 1 file still processing". Button Create draft copy.
- **Spec in brief:** 6 fields, 4 actions, 4 states (incomplete, date exception, unsupported dependency, stale or failed copy), 1 dialog (create separate draft course), 3 acceptance checks (destination unpublished, zero learners, no staff permissions; changed source item blocks copy; retry checks existing operation).
- **Data it reads/writes:** source content versions, date map, destination ID.
- **Rules it must protect:** no learner records copied; independent course; unsupported tools not activated.
- **Design assessment:** Rule conflict: Announcements appear in the copy list, but the spec's content selection is modules, files, rubrics, questions and policy drafts, and the dialog forbids posts. The "Not copied" line omits group memberships, allowances, attendance and staff grants. Create is not shown disabled while an exception is open. No per-row date table, no acknowledgment, no source picker.
- **Gaps:** date-exception state, stale preview, failed or uncertain copy, result screen with checklist, source archive label.
- **Open decisions:** announcements in copy [rule conflict]; group set structure empty or omitted [policy]; TA source inspection [rule conflict with nav].
- **Design next:** (1) date map table; (2) exception resolution; (3) create dialog listing omissions; (4) result checklist; (5) iPad preview; (6) narrow status.

### W60 · Content import/export preview
- **Roles / priority / stage:** instructor only. Follow-on. Stage 4.
- **Job to be done:** Instructor validates a package or export and applies only reviewed, content-only changes.
- **Gets here from → goes to:** From "W35 import content" (missing), W42 import questions (no button), W59 unsupported package. To W35.
- **Drawn today:** One PC screen: import package "physics110-export.zip · 14 items", table Modules (3) supported, Quizzes (1) supported, Interactive widget not supported, text "Imported content arrives as drafts. Learner activity is never imported. A log lists everything left out." Buttons Download reviewed export, Import reviewed draft content.
- **Spec in brief:** 5 fields, 4 actions, 4 states (unsupported format, validation errors, sensitive activity detected, stale or failed), 1 dialog (transfer reviewed content), 3 acceptance checks (imports unpublished; errors never overwrite; export is a local download, no SIS claim).
- **Data it reads/writes:** package manifest and fingerprint, mapping, import log.
- **Rules it must protect:** no learner data, enrollment, grades, allowances or SIS transfer; no overwrite; no partial silent import.
- **Design assessment:** Plain and honest. Import and export share one screen with a visible export button while import validation is incomplete; mode switch undrawn. Export includes answer keys, which needs a warning. Drawn rows cover about 5 of 14 items (inferred).
- **Gaps:** sensitive-activity state, collision choice, validation errors, log view, export selection, mode switch.
- **Open decisions:** export contains keys, who may hold the file [policy].
- **Design next:** (1) separate Import and Export modes; (2) sensitive-activity rejection; (3) mapping table; (4) key warning; (5) import log; (6) narrow log only.

## Segment fix list
1. [link] W35 does not host the controls other pages claim (Files, Rubrics, Question bank, Add assignment, Add quiz, Copy, Import). Add the per-module Add item menu, Course tools menu and resource strip.
2. [link] Add the grouped "Course tools" sidebar group and a Coursework item to the staff shell; update the sidebar on every staff screen.
3. [state] Add Unhide/Hide (unpublish) and Restore earlier version for every published item; none exists.
4. [state] Draw the Publish review panel with blockers, warnings, impact and fingerprint; plus partial and uncertain publish results.
5. [rule-conflict] W59 drawn copies Announcements; spec forbids posts. Remove and restate the "not copied" list in full.
6. [rule-conflict] TA preview as learner (W35, W40, W41) versus the matrix; and W42/W59 TA states versus `no_access_default`.
7. [rule-conflict] W41 "pinned" versus W42 "copies" bank question version. Choose pinned.
8. [state] Draw TA read-only views for W35, W36, W39, W43, W45, W46 with chip and removed actions; add expired variant.
9. [data] W45 TA view must hide Carmen, invite and revoke; add scope and end-date editor and revoke dialog.
10. [copy] W46 "Basis reference (staff only)" should read "Instructor only"; add a free-text guard for learner reason.
11. [state] W46: pending request queue, decline with reason, end allowance, course-level index.
12. [state] W38: add decorative toggle, captions and audio description, heading check, autosave and conflict states.
13. [data] W40 drawn shows 5 of 10 fields; W41 lacks close, attempt rule, correct-answer visibility. Draw the full forms.
14. [copy] Unify version wording ("Version 3") and AI ceiling labels (drawn text versus enum).
15. [state] W44/W50: define how a TA proposal is authored and how wording-only differs from score-changing.
16. [state] W43: define "in use" and show held versus released usage; add the retire opener (also W42).
17. [link] Drawn paths differ from the manifest (`/build`, `/transfer`, `/lessons/:id`, missing `/teach`).
18. [device] Draw iPad versions of W35, W36, W37, W38, W39, W40, W41, W43, W45, W46 and narrow protective views for W35, W45, W46, W43; W42 and W60 stay desktop with an "open on a larger screen" message.
19. [data] W59 needs date map table, acknowledgment, source picker and result checklist; W60 needs mode switch, sensitive-activity state and key warning.
20. [state] W41 note claims active attempts when the quiz is not yet open at the scenario clock; show it only under the quiz-in-progress override.


---

# Segment 6 · Instructor and TA: grade and release (W48–W54, W57, W58) plus optional O01–O03

Sources: Spec 01–06, specs W48–W54, W57, W58, O01–O03, route manifest, navigation map, fixtures overview, drawn/I.txt and drawn/J.txt, and the 15 Nov review. Journey numbers J01–J12 are not defined in the extracted text, so I number the twelve "Critical journeys" of Spec 04 in the order listed (inferred): J01 Arrival, J02 Individual work, J03 Grade and release, J04 Course setup, J05 Quiz, J06 Policy/grades, J07 Group work, J08 TA workload, J09 Communication, J10 Calendar, J11 Exceptions, J12 Term continuity.

## Segment overview

**Purpose.** The staff half of the teaching transaction. Staff see what is received, review it per question, preview what a rubric or policy change would do, calculate a working total, and then release an exact, fingerprinted payload to learners. Around that sit the TA allocation that drives queue and calendar (W57), the typed regrade loop (W54), and attendance and fact-only insights (W58). O01–O03 are optional ideas that must never touch any of this.

**Who it serves.** The instructor (Dr. Diane Reyes) has full authority. The TA (Maya Chen, access ends Oct 25 11:59 PM) works only inside an allocation. All twelve pages are staff pages. O01 and O03 are student pages; O02 is staff.

**Journeys.** J03 Grade and release (W48, W49, W50, W51, W53, then W23/W24). J06 Policy/grades (W52, W51, W24, W54). J08 TA workload (W45, W57, W05/W07, W48, W49). J07 Group work (W49, W53). J11 Exceptions (W58 attendance correction, W54 grade concern). J05 Quiz touches W49 and W53 via written answers and quiz results. J12 touches W58 only through "attendance is not copied". Optional pages sit on no journey ("Optional features must not be required to complete them").

**Build stages.** Stage 1 (teaching transaction): W48, W49, W51, W52, W53 (Spec 05 lists W51–W53). Stage 2 (assessment depth): W50, W54, W57. Stage 4: W58. Optional, separately selected: O01–O03.

**Design principles visible in the screens and specs**
1. Saved is not complete, complete is not released. Per-question save, "Mark review complete", and release are three separate acts on three separate screens (W49 note, W48 acceptance "saving one of four questions does not mark review complete").
2. Two totals, always named. Staff working total (85.17%) beside what the learner sees today (84.50%), with the reason ("PS4 held") (W51, W52, W53).
3. Release is exact and frozen. A fingerprint binds recipients, payload, policy and rubric version, and any relevant change makes it stale (W53, W50, W52).
4. Scope is the permission. A TA sees only allocated learners and questions; out-of-scope people are absent, not greyed (W48 TA note), and totals and policy are withheld (W51 TA note).
5. Facts, not judgments. Insights show counts with their source and "Not recorded never means absent" (W58); no risk scores.
6. History is append-only. Released snapshots, receipts, and manual overrides survive rubric changes, policy changes, regrades and reassignment.

**Segment-wide risks**
- The authority boundary exists mostly as drawn notes, not as designed denied states. No W13 permission-denied variant is drawn for a TA deep link to W53, W52, W50-apply or W57-edit.
- Drawn fixture facts contradict each other across screens (Ben's review state, "1 learner" vs "2 learners", a regrade on an unreleased score). See per-page notes.
- Drawn routes differ from the manifest on nine pages (W49 `/grading/ps4/aisha` vs `/grading/:assessmentId/receipts/:receiptId`, W52 `/policy` vs `/grading-policy`, W53 `/release` vs `/releases`, W54 `/regrades/1` vs `/grading/requests/:requestId`, W57 `/grading/plan` vs `/grading-plan`, W50 `/rubrics/kin/impact` vs `/rubrics/:rubricId/change-preview`).
- Several heavy states have a rule but no drawn screen: stale, failed or uncertain release, score conflict, policy invalid, allocation conflict, expired TA.
- Only the instructor variant is drawn for W50, W52, W53 (TA variant is drawn), W54, W57, W58. Spec routes list "instructor, ta" for all of them.
- W58 has no learner-facing view even though Spec 04 says "attendance correction request" exists for the learner. W58 is also the only place a learner correction request lands.

---

### W48 · Grading queue
- **Roles / priority / stage:** instructor, TA (scope required); core, required; Stage 1. Legacy S17.
- **Job to be done:** Instructor: see what remains per assessment, learner and question across the whole course, then open work or start a release. TA: see only my allocation, its marking deadline and when access ends, and open the next piece of work.
- **Gets here from → goes to:** From W05 staff home, W07 grading-calendar item, W57 task, W51 needs-review cell. To W49 (Open next work), W57 (Inspect grading plan), W53 (Prepare release, instructor only), an "Open older attempt" dialog. W53's own entry list does not include W48, though W48 has "Prepare release". W45 and W46 cite "W49" for expired-access and extension handoffs, which look like W48/W57 typos (inferred).
- **Drawn today:** Instructor, PC: "Problem Set 4 · All questions" filter, table Aisha (received Oct 15 6:30 AM, 5 of 5, "Reviewed · held"), Ben ("Received", 0 of 5, "Not reviewed"), Carmen ("No work received", "Missing after close"). TA, PC: header strip with Marking due Fri 5:00 PM, Access ends Oct 25 11:59 PM, Reviewed 2 of 2; rows Aisha and Ben "1a to 4 · 5 of 5 · Reviewed"; note "Carmen is outside your allocation, so she is not shown." No phone.
- **Spec in brief:** Fields: queue scope (TA defaults to own allocation and cannot broaden), review status (Received, In progress, Review complete, Held revision, Missing), sort (grading due, then received, stable), selected receipt. Actions: Open next work, Inspect grading plan, Prepare release (instructor), Refresh queue. States: nothing allocated, work in progress, missing work (status-only row, no score field), allocation expired (rows removed, saved work kept). One dialog: open older attempt. Acceptance (3): queue and calendar show the same task ID and due time; saving one of four questions does not complete review; permission refresh removes out-of-scope work without leaking names or counts.
- **Data it reads/writes:** grading_task (ta_id, learner_ids, question_ids, grading_due, access_end), receipt, grade_draft (reviewed_questions, review_complete, release_state). Writes nothing except refresh state.
- **Rules it must protect:** TA scope is the intersection of learner and question and is rechecked on every read; Missing is its own state, never "not reviewed"; the queue never releases; the same receipt is used in queue and grader and "latest versus selected attempt" is explicit.
- **Design assessment:** The two drawn variants show the right difference (TA queue leads with deadline and access end). Problems: (1) the instructor row says "Reviewed · held" and the TA row says "Reviewed" while the spec vocabulary is "Review complete" / "Held revision"; (2) Ben is "Not reviewed, 0 of 5" for the instructor but "Reviewed, 5 of 5" for Maya, with no explanation (TA review complete, instructor not yet accepted? or a data error); (3) the instructor sees no deadline, owner or access column, so you cannot tell who holds each learner's work; (4) "Received" appears in Ben's State cell, which is a stage not a review state; (5) the instructor "Open next work" is ambiguous when work is split across TAs; (6) sidebar still shows "Gradebook" and "People" for the TA though the nav map says read-only or restricted.
- **Gaps:** Nothing allocated, allocation expired, work in progress, filtered-empty, loading, offline, and the older-attempt dialog are not drawn. No summary strip for the instructor (received / in progress / ready for instructor review / held revision counts are in the spec layout). No phone or narrow layout (Spec 03 asks for stacked sections). A TA who also sees group receipts is unspecified.
- **Open decisions:** (policy) Does a TA "Review complete" mean the instructor must accept it, or is it only a flag that makes work eligible for W53? (policy) Does the instructor queue show Ben as reviewed by Maya?
- **Design next:** Instructor with summary strip and an owner column (desktop). TA nothing-allocated and allocation-expired states (desktop). Older-attempt dialog (desktop). Filtered-empty. Narrow stacked version.

### W49 · Grader
- **Roles / priority / stage:** instructor, TA (scope required); core; Stage 1. Legacy S17.
- **Job to be done:** Instructor: score and comment each question of one immutable received attempt, resolve conflicts and overrides, mark review complete, then go to release. TA: score and comment assigned questions, mark review complete, or propose a rubric change, but never release.
- **Gets here from → goes to:** From W48, W51 cell, W54 correction review. To W48 (after completion), W50 (Propose rubric change), W53 (Prepare release, instructor). The review says some pages claim to open from W49 that have no control; W45 and W46 cite W49 for expiry and excuse, which W49 has no such control for.
- **Drawn today:** Instructor, PC: page strip "Page 1 of 4 aisha-ps4-sample.pdf · Text version available"; score panel with Receipt AH-PHYS110-001 · rubric v2; questions 1a 6/6, 1b 4/4, 2 5/6 (comment "Check the sign of vertical acceleration"), 3 7/8, 4 5/6; Total 27/30; "Review complete · Held · revision 3"; header "Propose rubric change" and "Prepare release". TA, PC: same, header button "Mark review complete", note "Only Dr. Reyes can release feedback. Your access ends Oct 25, 11:59 PM." There is no phone.
- **Spec in brief:** Three regions: roster/question picker, document (pages, tags), score panel (pinned rubric, override reason, comments, checklist). Fields: question score (finite, 0 to max, no input for missing work), rubric levels, manual override reason (required if score differs from rubric calculation), feedback/annotations (learner-visible only on release), individual group override (instructor only, member in receipt snapshot). Actions: Save question, Mark review complete (blocked if any required question unreviewed, unsaved, invalid or scope expired), Propose rubric change, Prepare release (instructor). States (5): partial review, manual override, released work revised, scope expires/save fails, competing score revision. Dialog: Replace manual score. Acceptance: selector updates document/rubric/comment together; overrides survive rubric recalculation; a failed save cannot mark complete or change the learner view.
- **Data it reads/writes:** Reads receipt, pages, tags, pinned question/rubric version. Writes held review revisions (score source, override reason, reviewer, confirmed save, completion as separate facts). The fixture grade_draft has revision, rubric_version, overall_comment.
- **Rules it must protect:** Received work is never changed. Saved ≠ complete ≠ released. Manual override is never auto-overwritten. A TA cannot overwrite a competing review (flags for the instructor). Released work edited later creates a held revision; the old snapshot stays visible. Expired scope blocks writes but keeps confirmed attributed saves.
- **Design assessment:** Good: per-question save lines and the stable total. Issues: (1) the TA screen shows "Mark review complete" as a header button on a page that already reads "Review complete"; the button state when already complete is undrawn; (2) the drawn screen has no roster, no question picker, no rubric levels, no override badge, no per-question save status other than "Marks and comment saved" text; (3) Q2 shows 5/6 with a comment but no rubric criterion; (4) "revision 3" and "rubric v2" are both bare version labels; (5) the TA screen offers "Propose rubric change" to the instructor too, where the TA verb "Propose" does not match instructor authority (W50 distinguishes Submit proposal from Apply); (6) the page does not say a score save is live vs "saved locally".
- **Quiz written answers (inferred):** W49 is defined for "an immutable received attempt" with pages/tags. Quiz attempts have a frozen item snapshot, auto-keyed items (choice, numeric) and written responses that "require human review" (W41). Nothing in W49 says how a quiz attempt renders there: auto-scored items need a read-only "scored by key" source with the key hidden from the learner, written items need the same score and comment controls, and "all required questions reviewed" must count only items needing a human. Quiz marks left unreviewed would make the W27 receipt reveal nothing. The grader shell, the stable question ID and the pinned-version rule apply unchanged; the document pane becomes an answer pane with a text equivalent.
- **Gaps:** Partial review, override badge and Replace-manual-score dialog, stale/competing revision, save failed, scope-expired, group receipt with member override, missing work (no score input), released-then-revised, offline, narrow tabs, and a quiz attempt are not drawn.
- **Open decisions:** (policy) Are second reviews allowed (W57 allows "deliberate second review")? W49 has no second-reviewer view. (rule conflict) Is "Propose rubric change" for the instructor just "Edit" (W50 Apply)?
- **Design next:** Full three-pane desktop grader with question picker, rubric levels, override badge. Competing-revision comparison. Save-failed and scope-expired states. Group receipt with individual override. Quiz attempt variant (auto-scored items plus written). Narrow document/score tabs.

### W50 · Rubric-change impact preview
- **Roles / priority / stage:** instructor; TA may propose (roles list "instructor, ta"); core; Stage 2. Legacy S18.
- **Job to be done:** Instructor: see exactly which held grades, overrides and released snapshots a rubric change affects, then apply the reviewed change. TA: see impact within scope and submit a proposal that changes no score.
- **Gets here from → goes to:** From W44 in-use edit, W49 Propose rubric change, W43 usage review. To W49 (Review preserved override) and W54 (correction for a released result). W44 and W43 are outside this segment.
- **Drawn today:** Instructor, PC: "Version 3 vs version 2"; Change: wording of question 3 levels; Points Unchanged (30); Held grades affected 1 (Aisha, PS4); Released grades affected 0; Manual overrides None; note "Preview is current. If grading changes first, refresh"; checkbox "I have reviewed the affected held grade"; "Apply as: Wording only, scores stay the same"; "Refresh impact" and "Apply reviewed change". No TA variant.
- **Spec in brief:** Fields: candidate version, application mode (Future-only default, or recalculate selected unreleased rubric-derived scores), held selection (manual overrides excluded), reason plus acknowledgment. Actions: Refresh impact (clears acknowledgment), Submit proposal (TA), Apply reviewed change (instructor; blocked when stale, no acknowledgment, released/override selected, or actor is TA), Review preserved override. States: wording only, manual overrides present, released usage, stale preview. Dialog: Apply rubric version. Acceptance: recalculation touches only rubric-derived held scores; overrides and released snapshots stay byte-for-byte unchanged; TA and stale attempts fail with no partial updates.
- **Data it reads/writes:** Rubric versions, held review revisions, release snapshots (read-only), proposal history. Writes a new rubric version and selected held revisions only.
- **Rules it must protect:** A manual override survives a bulk rubric update (Spec 04 and Spec 05). Released snapshots never change. Apply never releases. No partial writes.
- **Design assessment:** The drawn counts are the right ones. Issues: (1) Held affected 1 for a wording-only change with unchanged points and zero score effect; the table of learner, question, old/new score is not drawn so the instructor cannot see why 1 matters (it matters because the held row now points to rubric v3, which changes W53's fingerprint); (2) "Manual overrides: None" is the only override state drawn, the kept-count with author/reason is the key rule and it is not shown; (3) the "Apply as" dropdown shows a value but not the Future-only versus Recalculate choice; (4) the label "Propose rubric change" on W49 is one control for two roles with different results; (5) the page sits under "Builder" in breadcrumb, which is consistent for rubrics but hides that it affects grading.
- **Gaps:** TA variant (Submit proposal, scoped view); override-kept state; recalculate mode with old/new scores; stale preview with who/what/time diff; released-usage list; apply dialog; apply failure with no partial update; instructor and TA deep link denial.
- **Open decisions:** (rule conflict) The matrix gives TA "propose only"; W50 lists "Refresh impact: instructor or scoped TA". Does a TA see the instructor's other learners' effect? Spec says scoped. (policy) Does a bulk recalculation of held scores that were already "review complete" reopen the review?
- **Design next:** Impact table with old/new/override columns (desktop). TA proposal variant. Stale preview state. Apply dialog. Override-preserved state.

### W51 · Staff gradebook
- **Roles / priority / stage:** instructor, TA (scope required); core; Stage 1. Legacy S19.
- **Job to be done:** Instructor: compare staff working totals with what each learner sees today and understand every item's contribution; start a release; download a scoped sample. TA: see only marks and review states for assigned items, never totals.
- **Gets here from → goes to:** From W05, W48, W53 release result. To W49 (Open review), W52 (Review policy calculation, read-only for TA), W53 (Prepare release), W54 (Review grade concerns), a local download.
- **Drawn today:** Instructor, PC: "Gradebook · Aisha Rahman", Staff working total 85.17% (includes held PS4), Learner sees today 84.50% (released only), Why they differ: PS4 27/30 held; table of PS1 24/30 Released, PS2 27/30 Released, PS3 Excused ("Left out, not zero"), PS4 27/30 "Held, not in learner total", Motion lab 18/20, Quiz 2 8/10. "Download scoped sample", "Prepare release". TA, PC: "Gradebook · my allocation": PS4 Aisha 27/30 "Reviewed · held", PS4 Ben "Sample" "Reviewed"; note "Course totals and grading policy are only visible to the instructor."
- **Spec in brief:** Layout: toolbar, grid with learner rows and "Learner sees" totals, focused detail drawer. Fields: filters, focused cell, comparison (Working vs released, default Both), export columns. Actions: Open review, Review policy calculation, Prepare release, Download scoped sample, Review grade concerns. States: ungraded (excluded), missing (staff zero only under policy, learner status waits for release), excused (denominator removed), held revision (separate totals and old/new diff). Acceptance: 27/30 held changes the staff total only; excused removes denominator, ungraded is excluded; TA filters and export cannot reveal outside scope.
- **Data it reads/writes:** grade_items (ps1…quiz2), grade_draft, release snapshots, policy v. Writes only a local sample download.
- **Rules it must protect:** Every total names the score set and policy version. Held results never reach the learner view. Ungraded is excluded, not zero. "Missing" is a status, not "—". TA never sees a working grade outside scope.
- **Design assessment:** The strongest screen in the segment: both totals side by side and the "Treatment" column. Issues: (1) it is a single-learner view, not the roster grid the spec describes (no learner rows, no filters, no category subtotals, no policy version label); (2) the arithmetic that yields 85.17 is not shown (category denominators); (3) the "Sample" label for Ben's mark on the TA screen is a data placeholder leaking into the UI and contradicts W48 TA ("Ben 5 of 5"); (4) the TA table has no deadline or "Open review" action even though the spec has one; (5) the spec's acceptance check mentions TA export, but only the instructor has the download action (review finding); (6) TA "Review policy calculation" (read-only W52 with assigned examples) contradicts the drawn TA note that policy is not visible.
- **Gaps:** Roster grid and narrow learner-picker view; missing and ungraded cell examples; held-revision diff for a released then corrected item; focused-cell drawer; download dialog; TA nothing-in-scope state; stale-data warning.
- **Open decisions:** (rule conflict) Can a TA read policy and assigned examples (W52, W51 action) or not (W51 TA note)? (policy) Staff zero for missing: shown as "0" or "Missing (counts 0 under policy)"?
- **Design next:** Multi-learner staff grid with sticky headers and both total columns (desktop). Focused-cell drawer with arithmetic. Missing/ungraded rows. TA variant with deadline column. Narrow learner picker.

### W52 · Syllabus-based grading policy setup
- **Roles / priority / stage:** instructor edits; TA read-only with assigned examples; core. Not named in any Spec 05 stage (flag). Legacy S19, S14.
- **Job to be done:** Instructor: turn the syllabus into exact versioned rules (weights, mapping, method, status rules, rounding, letters), preview worked examples, and apply a version. TA: read the current calculation and scoped examples.
- **Gets here from → goes to:** From W36 grading-policy link, W51 calculation detail. To W51 (after apply). Applying leads to W53 for a separate projection release.
- **Drawn today:** Instructor, PC (breadcrumb "Settings"): weights Assignments 40%, Labs 25%, Quizzes 35%, "Total 100%"; "Points count in proportion"; rounding "Final % to 2 decimals; no early rounding"; Extra credit Off; worked example "Aisha, released only 84.50%" and "After PS4 is released 85.17%" with "Assignments 51/60, labs 18/20, quizzes 8/10 → 84.50%"; line "Weights add to 99%. Apply stays off until they total 100." "Preview calculation", "Apply policy version". No TA variant.
- **Spec in brief:** Fields (8): mode (points or weighted, default weighted), category weights and mapping (finite, non-negative, total 100, each assessment mapped once), within-category method (point-proportional vs equal weighting of item percentages), empty/status rules, rounding (two decimals at the final step, letters on unrounded values), extra credit (off), letter boundaries (no gaps or overlaps, inclusive lower, full 0 to 100), version acknowledgment. Actions: Preview, Apply (blocked by weights ≠ 100, unmapped items, invalid boundaries, stale preview or TA), Read current calculation (TA), Save draft, Cancel/return. States: invalid total (exact remaining or excess), empty category (provisional renormalization), policy changed after release, stale preview. Dialogs: Apply policy, Unsaved changes. Acceptance (4): golden fixture and 10/25/25/40 reconciliation; reject 99.9%, duplicate mapping, overlapping bands; all-excused shows "No calculable grade", not NaN, zero or a letter; draft saves incomplete input.
- **Data it reads/writes:** Policy record (version, categories, ungraded/excused/missing/empty rules, rounding), grade_items, policy_editor_scenario (separate 10/25/25/40), golden_results.
- **Rules it must protect:** Weights total 100 before apply; no NaN or Infinity; zero possible points never divides; equal and proportional methods are not conflated; applying a version does not change a released total; released totals stay pinned until W53 releases a projection.
- **Design assessment:** The worked-example idea is excellent: the numbers check by hand (51/60 = 85%, ×0.40 = 34.00; 90% ×0.25 = 22.50; 80% × 0.35 = 28.00; sum 84.50. With PS4: 78/90, 86.67% ×0.40 = 34.67, total 85.17). Issues: (1) the screen shows Total 100% and also the warning "Weights add to 99%": a rule illustration on a valid state looks like a contradiction (the NaN/undefined scan flags this page); (2) no category-to-assessment mapping, no letter-boundary table, no syllabus source line, no empty-category rule, no missing/ungraded/excused treatment are drawn although each has a validation; (3) the within-category control shows only the default, with no equal-weight option and no explanation of the difference; (4) the apply control is titled "Apply policy version" but the note "no released result changes until separate reviewed release" is missing from the page; (5) route differs from the manifest.
- **Gaps:** Invalid-total state (95, 99.9, 105); duplicate and unmapped item error; overlapping letter band error; all-excused and empty-category examples; old versus new impact for already-released learners; stale preview; draft saved/unsaved dialog; TA read-only view; narrow one-category-card layout; extra-credit-on path (later).
- **Open decisions:** (policy) late penalties, dropped work, extra credit, rounding and letter boundaries (Spec 06); empty-category default; whether a new course total needs explicit release (Spec 04 says yes: pinned learner projection). (rule conflict) TA policy visibility (see W51).
- **Design next:** Valid state and invalid-total state as two screens (desktop). Mapping table with duplicate error. Letter-band editor with overlap error. Old/new impact table. Worked example for all-empty and equal vs proportional. TA read-only. Narrow category card.

### W53 · Exact feedback release
- **Roles / priority / stage:** instructor releases; TA sees own completion status only; core; Stage 1. Legacy S20.
- **Job to be done:** Instructor: choose what to release, freeze an exact preview, confirm, and keep a release history. TA: see that reviewed work is waiting for the instructor.
- **Gets here from → goes to:** From W49 review complete, W51 Prepare release, W54 corrected result, and a course-wide policy projection (no assessment needed). Not reached from W48 in the entry list though W48 has the action. To W23 (Inspect learner feedback) and W24 (Preview learner course-total projection).
- **Drawn today:** Instructor, PC: "Release feedback"; "Problem Set 4 · 1 learner"; Preview fingerprint 7f3a·c21; Learner Aisha Rahman; Score 27/30; Comments 1 overall comment; Rubric Version 2; "Her course total 84.50% → 85.17%"; checkbox "I checked the preview and the course-total change"; "Held for review: none. Releasing cannot be undone, but you can issue a revision later."; "Refresh preview", "Release reviewed results", "Inspect learner view". TA, PC: "Release feedback", note "Only the instructor can release. Dr. Reyes sees your reviewed work in the release queue."; "Your reviewed work: Problem Set 4, 2 learners reviewed, Waiting for the instructor." No release button.
- **Spec in brief:** Steps: scope, exceptions, exact preview, confirm. Fields: release selection (reviewed scores, status outcomes, policy projection; groups expand to captured recipients), feedback visibility (scores, comments, annotations; quiz keys only by explicit policy), preview fingerprint, acknowledgment, change summary (required when replacing), candidate kind. Actions: Build exact preview, Refresh preview (clears acknowledgment), Release reviewed results (blocked for no candidate, stale fingerprint, missing acknowledgment, non-instructor), Inspect learner feedback → W23, Preview projection → W24. States: nothing ready, exceptions held, preview stale, released then revised, policy-only or status-only release. Dialog: Release exact feedback. Acceptance (6): comment edit after preview blocks release; group receipt makes member-specific snapshots; failure or uncertain outcome checks by operation ID and never duplicates; policy-only release without new score; missing/excused released without a fabricated submission; course-wide release works without assessmentId.
- **Data it reads/writes:** Reviewed grade_draft, receipts, policy version, rubric version, captured group membership, prior releases. Writes an immutable release snapshot with operation ID. Notification delivery is separate.
- **Rules it must protect:** Graded ≠ released. The fingerprint binds candidate kind, recipients, payload, receipt where applicable, membership, policy, arithmetic, denominator rule and rubric. Any change to score, comment, recipient scope, attempt or policy makes the preview stale (Spec 05). Prior releases are never rewritten; a revision is a new version (R2). No receipt for status or projection candidates. Release by the TA is denied, including by deep link.

**Three candidate types.** (a) reviewed_attempt: needs a complete review and a real receipt; preview shows score, comments, annotations, rubric version; group results expand to captured members. (b) status_outcome: Missing or Excused, with a reason, no numeric score for excused, no receipt; W24 shows status and denominator only after release. (c) policy_projection: no new marks; shows old and new total per learner, policy versions and the included released items; binds only released snapshots. Fingerprint inputs differ by type; "Nothing ready" shows only when all three kinds are ineligible and gives counts and reasons per kind.

**Review complete vs released.** Review complete is staff-only state set in W49 (and shown in W48/W51 as "Reviewed · held"). Release is an instructor-only act in W53 that produces the learner snapshot. A TA can complete reviews for 2 learners and the learner still sees nothing; W53 TA view says "Waiting for the instructor".

**Fingerprint and staleness.** The drawn "7f3a·c21" has no visible inputs, time built, or built-by. Staleness triggers named in specs: score, comment (even without a score change), recipient scope, attempt, policy and rubric change. Drawn refresh: "Refresh preview" exists, but there is no stale banner, no diff ("who, what, when"), and the acknowledgment is not shown as cleared. A W50 apply of rubric v3 changes the held grade's rubric reference and so should invalidate this preview; the drawn page shows "Rubric Version 2".

**Quiz results in W53 (inferred).** Spec 04 says quiz results follow "captured release policy" and W41 defaults feedback release to Manual held, with correct-answer visibility controlled separately. W53 gives that only as a "quiz keys" checkbox and a dialog line; "Inspect learner feedback" goes to W23, but a quiz review is W27 (W24 itself says "W23 or W27"). The preview must be a quiz payload: score, per-question feedback, key visibility, and the question version of the frozen attempt.
- **Design assessment:** Good: exactly one learner, exact numbers, before/after course total, explicit acknowledgment and the honest line "cannot be undone, but you can issue a revision". Issues: (1) "1 learner" here vs W53 TA "2 learners reviewed" and W48 instructor "Ben Not reviewed": the "Held for review: none" claim is inconsistent with that; (2) step flow (scope → exceptions → preview → confirm) is not drawn, the page shows only the last step; (3) the course-total move 84.50 → 85.17 is only a text line; (4) the checkbox merges "preview" and "course-total change", but candidate kinds are separate objects; (5) the release button name "Release reviewed results" is generic; the dialog should name recipient count; (6) route drawn `/release`, manifest `/releases`.
- **Gaps:** Stale preview, release failed/uncertain with check-by-operation-ID, TA denied, nothing ready (all three kinds), exceptions held, status_outcome and policy_projection previews, group member snapshots, replacing an earlier release (change summary), confirm dialog, quiz payload, narrow one-recipient preview, "Release succeeded" with recipient and version history. The review confirms there is no "failed or uncertain" or "TA denied" screen.
- **Open decisions:** (policy) must a course-total projection be a separate release or auto-follow an assessment release? Drawn page releases both together ("Her course total 84.50% → 85.17%"), the spec says policy projection is its own candidate kind. (policy) Notification delivery: preview contains no numeric grade (WD19).
- **Design next:** Stepper with all four steps (desktop). Stale preview with diff. Failed and uncertain outcome with status check. Status-only and policy-projection previews. Group release table. Release confirmation dialog. TA denied (W13 variant) for deep link. Quiz payload preview. Narrow one-recipient view.

### W54 · Grade correction and regrade review
- **Roles / priority / stage:** instructor decides; TA reviews and proposes within scope; core; Stage 2. Legacy S19, S09.
- **Job to be done:** Instructor: resolve a typed learner request with a recorded decision, ask one linked clarification, or hold a correction. TA: start a review and propose a correction, never approve or release.
- **Gets here from → goes to:** From W51 request badge, W48 review requests, W23 learner request handoff. To W49 (Propose correction, Save correction held), W53 (Release approved correction). W48 has no visible "review requests" control in the drawn queue.
- **Drawn today:** Instructor, PC: "Regrade request · Problem Set 4"; "Request clarification", "Propose correction"; Request from Aisha Rahman, Question 2, sample text "I used g as positive in the final substitution. Please check the sign."; Status Open; Affected question 2 (5 of 6); Decision: Correction score 6/6; Reason "Sign convention was stated at the top of the page"; note "Saved as a held correction. Not visible to Aisha until you release it." No TA variant.
- **Spec in brief:** Fields: request status (Requested, Under review, Clarification needed, Declined, Correction held, Resolved), decision reason (1–1500 characters, learner-readable), affected questions, correction score and reason, clarification prompt. Actions: Start review, Propose correction (TA), Request typed clarification (instructor), Save correction held, Release approved correction, Decline with reason. States: open request, duplicate request, superseded release, correction held. Acceptance: decline changes nothing; a correction to released work becomes R2 only after W53 and R1 stays readable; a TA cannot approve or release.
- **The regrade loop without messaging.** Learner (W23) files a typed request tied to a release, question and reason → status Requested → staff Start review (Under review) → either one typed clarification prompt (Clarification needed, learner replies once on the same request, back to Under review) or Decline with learner-visible reason (Declined, scores untouched) or Save correction held (Correction held, learner keeps old result) → instructor releases through W53 (Resolved, R2). No inbox exists; every message is a field on the request (WD05).
- **Data it reads/writes:** Request record, released snapshot referenced, receipt, rubric and policy version, manual override history. Writes a held correction revision and a decision.
- **Rules it must protect:** Original release and receipt are unchanged until re-release. A correction must not rescore a manual override via a bulk rule. Duplicate requests link rather than duplicate. A TA's proposal is a candidate, not a decision.
- **Design assessment:** Good: sample text is marked, the held state is explained. Issues: (1) the request concerns PS4 but PS4 is still held (W51, W53 not yet released), so Aisha cannot yet have a released score or a W23 request; this is a fixture contradiction (inferred: request needs a released snapshot); (2) the instructor screen has the TA verb "Propose correction" and no "Decline" or "Save correction held" button, where the note says it was already saved; (3) 5/6 → 6/6 would make PS4 28/30, silently diverging from the fingerprint that W53 previews as 27/30; (4) no request history, no snapshot reference ("which release R1"), no evidence pane; (5) the review confirms "Clarification pending" has no state.
- **Gaps:** Clarification needed and learner-replied states; declined; duplicate; superseded release (rebase); TA proposal view; instructor compare view; resolved; narrow layout.
- **Open decisions:** (policy) Response times and an upper limit on requests per assessment. (policy) Does a TA see the learner's text or only a summary?
- **Design next:** Full request thread with status chips and history (desktop). Clarification pending. Decline dialog. TA propose variant. Held-correction and R2 release handoff.

### W57 · Grading allocation and deadline planner
- **Roles / priority / stage:** instructor edits; TA reads own tasks; core; Stage 2. Legacy S17, S12.
- **Job to be done:** Instructor: assign questions and learners to TAs with an independent grading due date, find gaps and conflicts, apply one plan. TA: open my task and see its scope and due date.
- **Gets here from → goes to:** From W48, W07 staff calendar, W45. To W48 (Open my task), W07 calendar items, W45 (extend scope). W07 and W32 both link here.
- **Drawn today:** Instructor, PC: table Problem Set 4, Maya Chen, Aisha/Ben, 1a to 4, Marking due Fri Oct 23 5:00 PM, Access ends Sun Oct 25 11:59 PM; "Conflicts: None. Deadline is before access ends"; "Release permission: No · Maya cannot release"; "Not yet allocated: Carmen · Instructor keeps her work"; "Preview allocation", "Apply plan". No TA variant, no calendar view.
- **Spec in brief:** Fields: assessment/questions, assignee (access window must fit), learner/group slice, grading due (independent of student due/close and quiz timer), coverage rule (single primary reviewer; second review explicit), release target (planning only). Actions: Preview allocation, Apply plan (blocked by gaps, overlaps, assignee expiry before due, stale roster), Open my task (TA), Reassign incomplete work (keeps confirmed scores), Save draft, Cancel. States: unassigned work, conflicting assignment, access/deadline conflict, plan revised. Dialogs: Apply grading plan, Unsaved changes. Acceptance: one task edit updates queue and calendar with no duplicates; a TA sees only own tasks; reassignment preserves scores and never marks unreviewed questions complete.
- **Allocation driving queue and calendar.** One versioned grading-task ID is read by W48 (rows), W07/W32 (calendar item, own tasks only) and W05 (TA home). The queue's "Marking due" and the calendar's grading-due are the same field, so a move in W57 appears in both. The fixture `grading_task` has ta_id, learner_ids, question_ids, grading_due, access_end, release_permission, and `calendar` has a grading-due record. Release target is a planning date only and does not release.
- **Data it reads/writes:** grading_task, enrollments (TA access end), receipts, calendar grading-due. Writes new task versions and history.
- **Rules it must protect:** Grading due is a staff target and never changes student due or close. One primary reviewer per question; no silent overlap. Access end before due blocks apply. The TA cannot allocate work to themself. Expiry blocks writes but keeps attributed work.
- **Design assessment:** Clear and compact; the "Release permission: No" column makes the authority line visible. Issues: (1) only the success case is drawn ("Conflicts none"); (2) Carmen's "Not yet allocated" conflicts with W48, where she is "Missing after close" with no receipt, so there is nothing to grade, yet W57 treats her as unallocated work (a missing-work row has no review); (3) no timeline, no per-TA workload, no release target; (4) W07 limits the grading-deadline link to instructors while W32 says instructor/ta (review); (5) route differs from manifest; (6) "Fri Oct 23" shows the date but W48 TA shows only "Fri 5:00 PM".
- **Gaps:** Unassigned work, overlap, access-before-due conflict, plan revised diff, reassign dialog, Apply dialog, TA "my task" variant, draft/unsaved dialog, calendar item preview, narrow cards, a non-drag assignment alternative.
- **Open decisions:** (policy) Who owns missing-work learners (no review needed)? (rule conflict) TA edits to deadline: none per spec, but W32 lets TAs "manage" via the link.
- **Design next:** Conflict states (gap, overlap, access conflict) on desktop. Timeline and workload view. Apply dialog with old/new. TA task view. Calendar side-by-side showing the same task ID.

### W58 · Course insights and attendance
- **Roles / priority / stage:** instructor; TA only with explicit session/learner scope; follow-on; Stage 4. Legacy S23.
- **Job to be done:** Instructor: read source-backed counts, record attendance and correct it with a reason, review a learner's typed correction request. TA: same only inside a granted scope.
- **Gets here from → goes to:** From W35 Insights, W48 missing-work view, W32 course session. To W48 (Inspect submission fact). No link from a student page; no student page shows attendance (review finding).
- **Drawn today:** Instructor, PC (ROLE tag "ia" but only the instructor screen is in the text; breadcrumb reads "Grading"): tiles "PS4 received 2 of 3 (Source: submissions)", "PS4 reviewed 1 of 2 (Source: grading queue)", "Quiz 2 released 3 of 3 (Source: release record)"; attendance table for "Class Wed Oct 21": Aisha Present, Recorded by Dr. Reyes; Ben and Carmen "Not recorded · No record yet · Record"; note "Sample session. 'Not recorded' never means absent."
- **Spec in brief:** Fields: date/session filter (missing entry is unknown), attendance status (Present, Absent, Late, Excused, Not recorded; no inferred conversion), correction reason, source reference, learner slice. Actions: Inspect submission fact, Record attendance, Correct attendance (instructor, keeps original), Review learner request. States: no session record, source delayed, allowance applied, correction disputed/stale. Dialog: Correct attendance entry. Acceptance: unentered sessions never counted absent; missing-work count respects personal close and excuses; failed correction keeps original.
- **Attendance facts.** Each entry carries status, actor, source and time; a correction appends and keeps the original. "Not recorded" is a status, not a zero. The Oct 21 session date is also a future date relative to the scenario clock (Tue Oct 20 4:00 PM) so the drawn "Present" is for a class not yet held (inferred inconsistency).
- **The missing student attendance view.** No W-page lets a student see their own attendance or file a correction request, yet W58 expects "learner request" and Spec 02 lets a student see own permitted facts and request correction. The route list and navigation have no student page; W24/W14 do not mention it. This is an unresolved owner decision (see Open decisions).
- **Insights without risk scores.** Only counts with a source label and timestamp: submitted, reviewed, released. No ranking, color risk, predicted outcome, or "at risk" label (W58 permissions line). Gaps in the drawn screen: counts say "2 of 3" with no link to the learners; the spec asks for fact panels separating submission-before-close, module completion and attendance, but module completion is not drawn.
- **Data it reads/writes:** Receipts, grade_draft status, release records, calendar session, attendance entries (actor, source, time, original and corrected). Writes attendance records and corrections.
- **Rules it must protect:** No inferred absence. No risk labels. Corrections append, never overwrite. TA grading scope does not grant attendance access. Attendance is not copied by W59 or exported by W60.
- **Design assessment:** The "Not recorded never means absent" copy is exactly right. Issues: (1) PS4 "reviewed 1 of 2" conflicts with W48 TA 2 of 2; (2) tiles mix "received 2 of 3" (a count of three learners) with "reviewed 1 of 2" (a count of two) without explanation; (3) the breadcrumb says "Grading", though it is Insights; (4) the "Record" action is a link with no state for a TA; (5) no source timestamp or refresh age.
- **Gaps:** TA variant (scoped or no-access), Record and Correct dialogs, disputed/stale correction, source delayed, learner request review, session filter, empty first-use, missing-work fact list, narrow layout. No student view exists.
- **Open decisions:** (policy) Does the student see own attendance and file corrections? (spec says "own permitted facts") (policy) Is attendance in scope for the first school at all? Spec 01 and the matrix are proposals.
- **Design next:** Record attendance dialog and Correct attendance dialog (desktop). TA scoped and "no access" views. Source-delayed state. Student own-attendance page with a typed correction request (new, needs owner approval, desktop plus phone).

### O01 · Optional student achievements
- **Roles / priority / stage:** student; optional; off by default.
- **Job to be done:** Student: see awards, their criteria and the supporting work; ask for a correction.
- **Gets here from → goes to:** From W14 (only when enabled), W08 award activity. To W23 (supporting released work), W14.
- **Drawn today:** Student, PC, ROLE "s": the course nav has an extra "Achievements · Optional feature" tab; "Earned: On-time streak, Handed in 3 assignments before the due date, Earned"; note "Awards never change your grade. They are not part of the official calculation." Breadcrumb says "Course overview".
- **Spec in brief:** Fields: award filter (Earned, Available, All; no peers or ranking), selected award, sharing preference (private default). Actions: Read criteria, Open supporting work, Ask for correction, Return. States: feature off, not earned, earned, evidence changed (flag for instructor review, never silently revoked). Dialog: Request award correction. Acceptance: nothing is evaluated when off; own awards only, no leaderboard; missing evidence shows unavailable.
- **Data:** Award records, criterion version, evidence references (released items only).
- **Rules it must protect:** Awards never feed grades or W24; "On-time streak" must not read or reveal held results; no peer discovery; no external credential claim.
- **Design assessment:** The disclaimer is placed right. Issues: (1) "Handed in 3 assignments before the due date" is evidence from the submission record, a fact the learner already has, fine, but the page does not show which three; (2) "Streak" implies a gamified pressure the spec does not mention; (3) the optional tab changes the student nav that W14 defines, so the nav needs an "enabled" rule.
- **Gaps:** Not-earned and feature-off states, criteria detail, correction dialog, evidence-changed, narrow view.
- **Open decisions:** (policy) adopt at all (Spec 06: "whether achievements merit inclusion").
- **Design next:** Only if adopted: Not earned view, award detail with evidence, correction dialog (desktop and phone).

### O02 · Optional staff achievement authoring
- **Roles / priority / stage:** instructor; TA authoring disabled initially; optional.
- **Job to be done:** Instructor: write transparent criteria, review who is eligible, issue, correct or revoke.
- **Gets here from → goes to:** From W35 optional tools entry, O01 correction handoff. No drawn exit.
- **Drawn today:** Instructor, PC: Award title "On-time streak", Criteria "Hand in 3 assignments before the due date", Image description "A gold star", "Eligible now: 1 learner meets the criteria. Review before issuing"; buttons "Issue reviewed awards". Breadcrumb "Settings".
- **Spec in brief:** Fields: title (1 to 100), visual and text alternative, criteria (only course completion or released facts), effective version, issue/revoke reason, enable (default off). Actions: Preview, Save draft (TA disabled), Issue reviewed awards, Correct/revoke. States: disabled, invalid criterion (references held grades or private data), eligible review, criterion changed. Acceptance: TA drafting cannot issue, revoke or enable; criterion edits do not erase earned records; stale preview blocks issuing.
- **Data:** Criteria, eligible facts, issued awards and audit history.
- **Rules it must protect:** Only permitted published evidence; awards cannot change grade or release; TA cannot issue.
- **Design assessment:** Plain and transparent. The eligible count "1 learner" is a number with no names, no evidence preview and no fingerprint, unlike W53. The page looks enabled while the spec says default off; the disabled state is the first thing to draw. "Review before issuing" implies instructor review of a named list that is not drawn.
- **Gaps:** Disabled, invalid criterion (held grades), eligible list with evidence, issue dialog, revoke, versioned criteria.
- **Open decisions:** (policy) adopt or drop.
- **Design next:** Disabled state, invalid-criterion error, issue-awards dialog (desktop).

### O03 · Optional course FAQ assistant
- **Roles / priority / stage:** student; optional; off by default.
- **Job to be done:** Student: ask a course question and get a cited answer from visible material only.
- **Gets here from → goes to:** From W14 optional entry, W12 course FAQ context. To W17 (citation), W30 (ask in discussion).
- **Drawn today:** Student, PC: "Course FAQ · Optional feature"; question "When is Quiz 3 due?"; answer "Quiz 3 closes Thursday, Oct 22 at 11:59 PM. You have 20 minutes once you start, plus any extra time arranged for you."; Sources: Quiz 3 rules, Announcement Oct 19; note about fallback to discussion.
- **Spec in brief:** Fields: question (1 to 1500), context (published, learner-visible only), AI availability (off by default), citations (every answer cites a visible source or says insufficient evidence), local history. Actions: Ask, Open citation, Clear context, Ask in discussion. States: disabled by policy, no supported answer, citation changed, service unavailable. Acceptance: held results, keys and peers never enter context; course prohibition wins over institution allowance; unsupported answers say so.
- **Data:** Published sources and versions only; local session. No provider.
- **Rules it must protect:** No grading, no deadline change, no answer keys, no held results, labelled as simulated in the first HTML.
- **Design assessment:** The citations and the fallback are right. Two risks: (1) "plus any extra time arranged for you" reveals a personal allowance in an answer (permissible only for that learner's own record, and W46 keeps basis private; wording should not hint at its existence for others); (2) the answer's deadline can go stale, and the stale state is not drawn.
- **Gaps:** Disabled by policy, no supported answer, stale citation, unavailable, clear-context dialog, narrow citations-under-answer layout, a "simulated answer" label.
- **Open decisions:** (policy) adopt or drop; provider and data handling undecided (WD22, WD24).
- **Design next:** If adopted: disabled-by-policy, insufficient-evidence and stale-answer screens (desktop, narrow).

---

## Cross-cutting findings (the deep-dive questions)

**TA can never release or change policy, including deep links.** The matrix and every page agree on the rule ("TA cannot release, change policy or grant allowances"). Drawn evidence: W49 TA has no Prepare release; W53 TA shows no release button; W51 TA hides totals. Not drawn: what happens when a TA opens `/releases`, `/grading-policy`, `/rubrics/:id/change-preview` (apply) or `/grading-plan` (edit) directly. W53 TA currently renders a useful read-only page, but W52 "TA read-only with assigned examples" is contradicted by W51 TA note. Also the 15 Nov review notes no "TA denied" state on W53. Needed: a consistent server-side style denial (W13 permission variant, hidden private metadata) plus a visible read-only variant per page.

**Manual override vs bulk rubric update.** Rule appears in Spec 04, Spec 05, W49 and W50. W50 excludes overrides from selection, counts them separately, and links to W49 for explicit review. Only the "None" case is drawn.

**Policy validation (W52).** Weights total 100 (and finite, non-negative), each item mapped once, letter ranges no gap or overlap (lower inclusive), zero possible points shows "No calculable grade", equal versus proportional are separate options. Only the 100/99 text and the worked example are drawn.

**Score conflicts.** A second reviewer changes a score after load: W49 shows both records, the TA cannot overwrite, the instructor resolves via a held revision. Not drawn.

**Insights and attendance.** Facts with source, no risk scores, "Not recorded is not absent". The student attendance view is missing.

**How optional features stay unable to affect grades.** Off by default, no navigation when off, no evaluation when off, criteria limited to released or published facts (O02 rejects held grades), awards carry no points, no required journey depends on them (Spec 05), TA cannot issue, O03 has no staff tools and cannot change work, deadlines or grades. Nothing in W52 or W53 reads O01–O03.

---

## Segment fix list

1. [rule-conflict] TA policy visibility: W52 and W51 allow a TA read-only calculation with assigned examples; the drawn W51 TA note says policy is instructor-only. Decide and align W51, W52, nav.
2. [state] Draw W53 stale, failed/uncertain, TA-denied and nothing-ready states, plus the three candidate kinds (status outcome, policy projection) and the four-step flow.
3. [data] Fix the PS4 fixture across screens: Ben is "Not reviewed" (W48 instructor) but "Reviewed" (W48 TA, W51 TA); W53 says 1 learner and W53 TA says 2; W58 says reviewed 1 of 2. Pick one truth.
4. [rule-conflict] W54 request on a held, unreleased PS4: a regrade request needs a released snapshot. Re-base the fixture on Quiz 2 or a released PS.
5. [state] W49 score-conflict, override badge, Replace-manual-score dialog, partial review, save-failed and scope-expired states; quiz-attempt variant for written answers.
6. [state] W52 invalid-total, duplicate mapping, overlapping letters, all-empty and equal vs proportional examples; remove the contradictory "99%" line from the valid state.
7. (Withdrawn on check: W52 is in Stage 1 through Spec 05's "W51–W53" range.)
8. [state] W57 conflict states (gap, overlap, access ends before due) and a TA task view; resolve Carmen (missing work) versus "not yet allocated".
9. [link] W53 "Inspect learner feedback" goes to W23 only; add W27 for quizzes and W24 for projection (the spec has W24 action; drawn only has "Inspect learner view").
10. [link] W45 and W46 cite "W49" for expiry and excuse handoffs; likely W48/W57. W48 is missing from W53's entry list. W54 entry from W48 has no drawn control.
11. [rule-conflict] Student attendance view does not exist; decide (policy) and add a page or drop the "learner request" action from W58.
12. [state] W50 TA variant, kept-override state, recalculate mode and stale preview.
13. [state] W54 clarification-needed, declined, duplicate, superseded states; fix the instructor header verbs ("Propose correction" is a TA action).
14. [copy] Standardize status words: "Reviewed" vs "Review complete" vs "Held revision"; fix W51 TA "Sample" placeholder; fix breadcrumbs on W58 ("Grading") and W53.
15. [link] Align drawn routes with the manifest for W49, W50, W52, W53, W54, W57.
16. [rule-conflict] W07 allows only instructors to open grading deadlines; W32 says instructor/ta.
17. [state] W58 TA scoped variant, Record/Correct dialogs, source-delayed state; Oct 21 "Present" is after the Oct 20 scenario clock.
18. [device] No phone or narrow screens drawn for any staff page; Spec 03 asks for stacked sections and learner picker at 320 px, but the board is desktop-only.
19. [copy] O03 answer discloses "extra time arranged for you"; reword and add stale-answer state.
20. [state] O01–O03 not-earned, disabled-by-policy and unavailable states; keep optional tab out of default student nav.


---

