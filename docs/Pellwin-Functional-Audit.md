# Pellwin functional audit

Audit date: 15 October 2026. Source: `Claude outputs/Pellwin-Showcase.html`, 396,815 bytes, 3,140 lines. Source SHA-256: `090136bffdcdbdc4b7d0a8b1a650cb9e1a6a3750eabb35cd28b1ec13ba29d2dd`.

Pellwin is being designed as a college grading tool for handwritten assignments, connected to Moodle first. This file is an interactive design review with sample data. It demonstrates the intended experience extensively, but it does not implement a complete grading service. Its strongest work is the detailed treatment of instructors, students, TAs, submission problems and grade release. Its main functional weakness is that individual demonstrations do not share a consistent assignment or submission record.

This audit covers the product purpose, implementation, every screen and its options, review-site controls, future-platform concepts, workflows, data behavior and defects. The [state and control inventory](Pellwin-State-and-Control-Inventory.md) provides the complete declared state list and a supplemental inventory extracted from generated markup. The final section records exactly what was checked.

## 1 Product purpose and scope

### The first product

Pellwin starts as a separate grading service launched from an existing college LMS. The college keeps its course and gradebook in Moodle. Pellwin supplies the handwritten submission and rubric grading experience.

The target use case is a problem set, lab or similar assignment where students show handwritten working. Students photograph pages or supply a PDF. They identify which questions appear on which pages. An instructor grades the same question across students, with the relevant pages and rubric together. Release is the deliberate point at which students receive feedback and scores are passed to the LMS.

The intended benefits are less page switching, consistent rubric decisions, clearer feedback and reliable submissions. No measured time saving, customer adoption or pilot outcome is established by this file.

### The later platform

Tier 2 is a wider LMS, including course home, calendar, gradebook and native phone interfaces. These are explicitly vision pages. The recorded condition is paying users and funding, followed by one founder working full-time and two or three hires. December 2028 is a checkpoint, not a delivery promise. The first product does not require building this platform.

### Brand and research context

Whiteboard is the codename; Pellwin is the working product name. Clearance is unresolved. The decisions page notes a conflict with an earlier register mentioning Greenwell or Oakwell. The fictional demonstration institution is Alder Hill College in Ohio, with approximately 1,900 students and Moodle 4.5. These are sample content, not actual customers or deployments.

The sample course is PHYS 110, Introductory Mechanics. Problem Set 4 has five questions worth 30 points: 1a = 4, 1b = 4, 2 = 6, 3 = 8, 4 = 8. The roster contains 44 records: 41 submitted, two not submitted and one dropped; three submissions are late. Dr. Diane Reyes is the instructor, Maya Chen the TA, Tom Okafor the administrator and Noah Fischer the main student in the phone flow.

The adjacent interview workbook is a discovery tool, not part of the software. It contains one example conversation and no real interviews. Its demand gate is at least 10 professor interviews and at least six Yes responses; its permission gate counts at least one signed pilot LOI. It does not prove customer demand. The HTML calls the January 2027 discovery gate provisional.

## 2 How the current HTML is built

### Current implementation

| Area | Actual implementation |
| --- | --- |
| Packaging | One standalone HTML file containing the markup, CSS and one inline JavaScript application. |
| Framework | Plain JavaScript and browser DOM APIs. No React, Vue or application build configuration is present in this folder. |
| Styling | CSS custom properties, grid/flex layouts, media queries, container queries, SVG and CSS device frames. |
| Navigation | A custom hash router uses `#/section` and optional screen/state/role/device segments. In-memory routing also works when hash updates throw. |
| Rendering | Functions return HTML strings; the application inserts them with `innerHTML`, then attaches handlers. |
| Screen definitions | `SCREENS` stores identity, roles, devices, state choices, render functions, wiring functions and specification notes. |
| Flow definitions | `FLOWS` stores explanatory steps and references to screen/state/role/device combinations. |
| Local state | Objects and sets such as `G`, `PH`, `V`, `RS`, `VIS`, `FV` and `VV`. Most disappear on reload. |
| Persistent preference | `pw-theme` in localStorage, wrapped in try/catch. This is the persistence actually implemented. |
| Images and handwriting | Inline SVG/CSS. Handwriting is synthetic sample content using Caveat, varied by seeded positions and rotation. |
| Remote resources | Google Fonts stylesheets for Inter, Caveat and Material Symbols Rounded. The file does not self-host its production font. |
| Animation | CSS transitions/keyframes and the Web Animations API. `setTimeout` simulates waiting, upload progress, sync and refresh. |
| Real file interaction | GT-26 reads a selected/dropped file's name, size and type/extension. It does not upload, parse or render that PDF. |
| Automated review | A small custom `runAudit()` function checks selected markup/copy conditions. It is not a full accessibility or functional test suite. |

Relevant source starts: tokens at line 17, components at 321, product styling at 614, page markup at 962, application script at 1952, screen definitions at 2425, student screens at 2663, viewer at 2809, flows at 2867, vision pages at 2987 and audit at 3116.

### Intended production services

The design calls for LTI 1.3 launch, assignment creation through Deep Linking, Names and Roles roster retrieval and Assignment and Grade Services score passback. Those services are described and simulated; there are no live integration calls in this file.

The phone workflow calls for camera input, image compression, local IndexedDB drafts, PDF creation using pdf-lib, chunked uploads with resume and server-side upload-start timestamps. The actual capture screen adds generated sample pages. There is no IndexedDB implementation, camera file input, PDF library, upload endpoint or server timestamp code here.

Likewise, receipts, email links, audit trails, retention, exports, one-time handoff tokens and time-limited support grants are intended service features. Displaying their screens does not implement those services. The domains shown in browser frames are labels, not evidence of deployed sites.

### State separation

The grader stores selected rubric items, comments, current index, zoom, rotation and a set of saved students in `G`. Phone capture and tagging use `PH`. The roster uses fixture objects and a separate `RS` refresh flag. Release, receipt and feedback screens mostly construct independent fixture data.

Consequently, changing an assignment, grading an answer, editing a rubric or capturing a page does not reliably update every downstream screen. This is the most important distinction when demonstrating the HTML: a screen can be interactive without representing a complete transaction.

## 3 Roles and permissions

| Capability | Instructor | TA | Student | Institution administrator |
| --- | --- | --- | --- | --- |
| First-launch instructor welcome | Yes | Restricted view directs to dashboard | No | No |
| Create assignment | Yes | No | No | No |
| Edit rubric | Yes | Read-only by default | No | No |
| Grade a question | Yes | Yes | No | No |
| Hide names while grading | Yes | Yes | No | No |
| View submission and retag | Yes | Yes | Own work/feedback through student screens | No grading screen declared |
| Upload for a student | Designed | Designed | Own upload only | No grading screen declared |
| Release grades and sync | Yes | No | No | No |
| Manage roster and late allowance | Yes | Read-only | No | No grading screen declared |
| Submit/resubmit | Through upload-for-student design | Through upload-for-student design | Yes | No |
| See released feedback | Instructor detail views | TA detail views | Own feedback | No grading screen declared |
| Retention/export/support controls | No institution screen declared | No | No | Yes |

The design says instructors may allow TA rubric editing and uploading/retagging per course. There is no operational course-permission editor in the HTML. The screen viewer lets a reviewer impersonate different roles; that is a demonstration control, not authentication or server authorization.

## 4 Review website controls

The surrounding website is a design-review tool. These controls belong to reviewers, not necessarily to the final college product.

### Global navigation and presentation

| Option | What it does |
| --- | --- |
| Sidebar section links | Select one of 16 review sections; update the active link and page title. |
| Previous/Next section links | Move sequentially through the review. |
| Mobile menu | Opens the sidebar overlay; clicking its scrim or pressing Escape closes it. |
| Search button, `/`, Cmd/Ctrl+K | Opens search for sections, headings, tokens, icons, statuses, topic aliases, screens, exception states, flows and vision pages. |
| Search text | Case-insensitive substring matching; prefix matches rank first; at most 40 results. Blank search lists sections. |
| Search Up/Down | Cycles the selected result. |
| Search Enter | Opens the chosen result. |
| Search Escape or outside click | Closes search. Escape restores the previously focused element through `closeSearch()`. Other close paths do not all do that. |
| `[` and `]` | Previous and next section, except while typing or inside designated interactive areas. |
| Auto / Light / Dark | Changes the review theme; Auto follows the system. Saves the preference locally. |
| `T` or mobile theme button | Cycles Auto, Light, Dark. |
| Present / `P` | Hides review chrome and shows one heading/block at a time. Attempts fullscreen; failure is silently tolerated. |
| Presentation arrows, PageUp/PageDown, Space | Move through blocks and sections. |
| Presentation Exit / Escape | Leaves presentation mode; fullscreen exit may require another Escape according to the source's own comment. |

### All 16 sections

| Section | Content and options |
| --- | --- |
| 1 Overview | Product tiers, review-stage history, fictional cast, shortcut reference and source-document hierarchy. Mostly read-only. |
| 2 Logo concepts | Select Margin, Tally, Stack, Score ring or Wordmark. Shows lockups, symbol sizes, app icons, home-screen/browser-tab examples and monochrome treatments. Margin is recommended, not approved. |
| 3 Brand voice | Audience-specific examples, principles, terminology and Do/Don't pairs. The illustrative cookie fallback button is not a live connection workflow. |
| 4 Color | Light/dark swatches, status chips, course colors, contrast table, All/Fails only filter and color-vision simulation choices. |
| 5 Typography | Web/iOS scales; Tuned/Defaults comparison; Dynamic Type slider from xSmall through AX5. Slider changes the sample layout, not the user's operating-system text size. |
| 6 Layout and spacing | Spacing examples, live viewport ruler, width classes, iPad size-class examples, device frames, Comfortable/Compact roster density switch. |
| 7 Shape, elevation, materials | Radius/elevation examples, focus sample, scrollable material-bar demonstration. Export CSV here is a specimen. |
| 8 Icons | Text filter by name/meaning/SF Symbol; Show filled checkbox; icon count and platform mapping. |
| 9 Motion | Preview reduced motion checkbox; Replay each demo; Replay all. Ten demos: Sheet, Scan capture, Upload, Rubric update, Grade release, Check-off, Toast, Skeleton, Pull to refresh, Tab switch. |
| 10 Components | Button variants/states, inputs, checkboxes, radios, switches, segmented controls, tabs, statuses, live rubric, banners, dialog/menu examples, progress and iOS specimens. |
| 11 Screens | Choose screen, role, device and state; use the rendered demonstration; inspect specification notes and TA capability matrix. |
| 12 Flows | Choose one of 14 workflows, choose a numbered step, use previous/next arrows, and Open live on a screen step. Previews are inert. |
| 13 Platform pages | Choose one of five vision pages; switch allowed device; filter calendar courses and sort gradebook numeric columns. |
| 14 Marketing site | Desktop/iPhone preview of the marketing page; CTAs and links are specimens. |
| 15 Anti-AI rulebook | Paired good/bad design examples; compare bouncing Save and next against instant feedback. This is a visual/copy rulebook, not an AI grading feature. |
| 16 Decisions and changelog | Open review decisions, decision status register, Run again for the custom audit, build-check claims and dated history. |

### Component specimen options

The button matrix shows Primary, Secondary, Tertiary and Destructive in Default, Hover, Focus, Pressed, Disabled and Loading appearances. Forced CSS appearance does not always equal actual button semantics: a visually disabled specimen uses `aria-disabled`/classes rather than necessarily a native disabled button. The separate live Release grades sample shows loading and a demo-only toast. Other specimen exports/cancels/rotates have no product action.

Text-field examples include default points, focused points, invalid nine-out-of-eight points, a filled question label, a disabled late cutoff and quick-add input. Editing these specimens does not configure the product. Selection specimens include Hide names, Allow late submissions, disabled Claim answers (V2), subtract/add scoring modes, Email students on release, Show TA names and an iOS switch. The widgets toggle, but do not set global assignment policy.

Submission-type segmented buttons update their selection. By question / By student / Release tabs update selected-tab semantics, but do not load a production work area. The standalone live rubric toggles five items, makes Correct mutually exclusive with deductions, recalculates the score, rejects an empty selection and resets on save with a sample next-student toast.

Feedback specimens include sync-failure Retry/Export, a late warning, rubric refresh, Undo toast, tooltip, page menu, overwrite dialog and Copy student link. Apart from Show a live toast, these are generally visual examples. Rotate `R`, Crop `C`, Move to another question and Remove page are menu specimens; the actual grader uses `C` for Comment and has no crop command. The iOS examples include grouped page lists, a tagging sheet, three settings switches and tab-bar samples. They do not constitute a native app.

## 5 Instructor and TA screens

### GT-01 First-launch welcome

Purpose: explain the course context and where to create a linked assignment. Instructor only; desktop. States: Moodle, Blackboard, Unmapped roles, Opened outside the link. Source line 2426.

| Option or information | Actual behavior |
| --- | --- |
| College, course, LMS and detected role | Fixture content; changing Moodle/Blackboard state changes the instructions. |
| Three introductory steps | Explains assignment creation, phone submissions and grade/release. |
| Create an assignment | Highlights the LMS instructions and shows an explanatory toast. Does not open GT-02, create an activity or register a gradebook column. |
| Watch the 2-minute guide | Styled text; no video or link action. |
| Unmapped-role warning | Static scenario; does not retrieve or map roles. |
| Outside-assignment launch warning | Explains opening from the course assignment link; no recovery integration. |
| Help in header | Text with no help destination. This is repeated in product headers. |

The intended constraint is sensible: create through LMS Deep Linking so the assignment receives its gradebook association. The file cannot establish whether its Moodle/Blackboard menu guidance is current; those are recorded design instructions, not externally verified platform documentation.

### GT-02 Assignment setup

Purpose: configure a new assignment. Instructor only; desktop. States: Filled, New, Validation, Past due date. Source line 2442.

| Option | Actual behavior |
| --- | --- |
| Title | Editable input. Save does not validate that it is present or persist it. |
| Due | Free-text input with Eastern time helper. No date picker/parser. Past-date warning is a forced state, not a calculation. |
| Accept late submissions | Shows/hides the cutoff input. New state defaults off; filled sample is on. |
| Accept until | Editable text; no chronological or timezone validation. |
| Handwritten / PDF upload only | Toggles selected button. Does not change subsequent screens or save a submission policy. |
| Optional problem-set PDF | Filled sample shows `PHYS110-PS4.pdf`; Add PDF is styled text and Remove PDF has no handler. |
| Question label and points | Rows can be edited. Points parse as floats; totals update. Labels are not checked for duplicates or emptiness. |
| Remove question | Deletes that row locally and updates totals. |
| Quick add + Add / Enter | Accepts comma-separated numeric labels with an optional single letter, followed by unsigned integer/decimal points; creates local rows. Save rejects zero-point rows. Invalid entries can be silently discarded when mixed with valid ones. |
| Total | Live question count and sum of points. |
| Save | Checks at least one question and positive points, then shows a demo toast describing the hypothetical LMS column. |
| Cancel | Visible but not wired. |

Only the question list has substantive validation. Assignment title, dates, allowed-late timing and uniqueness need an agreed specification before implementation. Changing inputs does not change the fixed dashboard assignment.

### GT-03 Question and rubric editor

Purpose: define how question answers receive points. Instructor and TA; desktop. States: Editing Q2 and TA view. Source line 2471; shared editor starts at 2524.

| Option | Actual behavior |
| --- | --- |
| Question list 1a, 1b, 2, 3, 4 | Shows labels/titles/points with Q2 selected. Buttons do not switch questions. |
| Subtract from full marks / Add up from zero | Radio controls change visually. No saved scoring-mode model; GT-05 remains a fixed subtract-from-eight grader. |
| Rubric item points | Editable; changing the second item's points away from −2 opens a fixed preview. Other edits have no saved rubric model. |
| Rubric description | Editable input only. |
| Used count | Fixed example counts, including 23 answers using Sign error. |
| Remove rubric item | Visible button, no handler. |
| Add rubric item | Visible button, no handler. |
| TA read-only state | Inputs disabled and explanation shown; no instructor override control exists here. |

The sample rubric is Q2, worth six points: Correct, Sign error, Speed not found/found without t, Missing/wrong units. GT-05 uses a separate Q3 rubric, not this editable data.

### GT-04 Assignment dashboard

Purpose: show submission and grading progress and enter work. Instructor and TA; desktop/iPad landscape/iPad portrait. States: Grading in progress, No submissions yet, Released. Source line 2477.

| Option | Actual behavior |
| --- | --- |
| Roster and late | Instructor opens GT-09. Hidden for TA. |
| Export CSV | Demo-only toast; no CSV download. |
| Release grades | Instructor opens GT-08; disabled in empty scenario and absent for TA. |
| Submitted, missing, graded-answer and release summaries | Fixture-derived counts mixed with fixed scenario totals. |
| Per-question progress | Five bars and Grade/Review buttons. Every button opens the same Q3 grader; question context is not passed. |
| All / Not submitted / Late | Filters fixture table rows. This is working local behavior. |
| Submission table | Names, status, timestamps, page counts, graded-question count and scores. Rows are not wired to open their own detail. |
| Empty/released state selectors | Review controls show those scenarios; current grader progress does not automatically produce them. |

The intended next step from a student row is submission detail, but the current table is informational. GT-07 is reached through the screen selector or other explicit demonstration links.

### GT-05 Question-by-question grader

Purpose: grade one question across many student submissions. Instructor and TA; desktop and both iPad orientations. Seven states include grading, hidden names, overwrite conflict, rubric refresh, completed question, loading and all pages. Source line 2495; renderer at 2546.

| Option | Actual behavior |
| --- | --- |
| Current student / submission counter | Drawn from a fixed 12-person Q3 list. |
| Hide names / Show names | Changes header/accessible page description. It does not redact names that a real student might write on a scanned page. |
| Previous / Next | Moves through the fixed list and wraps. Does not query submissions. |
| Zoom / `Z` | Toggles 1× and 1.35× for the single-page presentation. |
| Rotate | Rotates the displayed single page by 90 degrees per press. No separate `R` shortcut is wired. |
| Show all pages / Show Q3 pages only | Switches between fixed multi-page sample and question-specific sample. All-pages view is not a real PDF viewer. |
| Correct item / `1` | Selects full credit and removes deductions; toggling again can leave no selection. |
| Sign error / `2` | Deducts two points. |
| Wrong time of flight / `3` | Deducts three points. |
| Missing or wrong units / `4` | Deducts one point. |
| Components not shown / `5` | Deducts two points. |
| Live score | Starts unset until an item is selected; score is eight plus deductions, clamped at zero. |
| Comment / `C` | Focuses editable comment; text is stored in the in-memory per-student object. |
| Save and next ungraded / Enter | Rejects empty selection; otherwise adds the student to a saved set and advances one position. It does not skip already saved students or automatically end the question. |
| Cmd/Ctrl+Enter in comment | Invokes save. Escape leaves the comment and refocuses the grader. |
| Left/Right arrows | Move through the same list; normal Enter inside a comment remains text input. |
| Conflict Keep hers / Replace with mine | Closes the scenario and shows a message. Does not persist competing grade versions or implement a real overwrite check. |
| Rubric refresh notice | Sample banner; no live subscription, server refresh or version reconciliation. |
| Grade Q3 in completed-Q2 state | Switches to ordinary Q3 grading state. |
| Loading state | Skeleton plus descriptive text. Prefetching and sub-300ms performance are targets, not measured features. |

Example calculations checked directly: Correct = 8/8; Sign error = 6/8; Sign error + Units = 5/8; all deductions = 0/8. A saved comment and rubric selection remain in memory while navigating the viewer, but a page reload discards them. Zoom/rotation are shared state rather than per-document state. The synthetic all-pages view does not apply the same zoom/rotation transform.

### GT-06 Rubric change preview

Purpose: explain consequences before changing already-used grading criteria. Instructor only; desktop. States: Preview and Applied. Source line 2500.

| Option | Actual behavior |
| --- | --- |
| Before/after comparison | Fixed Sign error −2 to −1 example. |
| Answers affected / score impact | Fixed 23 of 41 answers and +1 each. Does not calculate from edits. |
| Apply to all | Toast and Applied presentation; no batch grade recalculation. |
| Apply to new grading only | Different toast, but GT-06 still transitions to the same Applied presentation saying 23 answers updated. |
| Cancel | Removes dialog and resets the second input to −2. |
| Escape | Removes the dialog, without the same explicit input reset as Cancel. |

The important design choice is visible impact before a rubric change. Production needs actual affected-grade counts, selected scope, rubric versions and audited recalculation. The prototype currently communicates a fixed example regardless of the proposed new value.

### GT-07 Submission detail

Purpose: inspect one student's full submission and history. Instructor and TA; desktop/iPad landscape. States: Default, Retagging, Submitted by instructor, Resubmitted after grading. Source line 2505.

| Option | Actual behavior |
| --- | --- |
| Back to Submissions | Opens dashboard. |
| All pages | Three fixed Ben Kowalski sample pages with tags. |
| Grades by question | Fixed score table, including ungraded Q4. |
| Audit trail | Fixed events; special states modify the sample history. |
| Retag pages | Opens retagging state. |
| Question tag buttons | Toggle visual pressed state per page. |
| Save tags | Toast only; does not update a durable tag model or return to detail. A redraw restores fixed tags. |
| Cancel retagging | Returns to default state. |
| Upload for student | Visible, no upload control or handler. |
| Allow late | Instructor-only visible button, no handler here; actual local editing is on GT-09. |
| Resubmission notice | Describes replacement of the grading submission and retention of history. No version store is implemented. |

### GT-08 Release and sync

Purpose: explicitly publish feedback and send grades to the LMS. Instructor only; desktop. States: Release checklist, Sending, Some failed, All synced. Source line 2510; renderer at 2604.

| Option | Actual behavior |
| --- | --- |
| Incomplete submissions checklist | Fixed Hunter, Dana and Sam example, identifying ungraded questions. |
| Hold those 3; release other 38 | Initially selected. Later displays always follow this case. |
| Release all 41 anyway; ungraded = 0 | Selectable radio; the handler never reads it. It has no effect. |
| Back to dashboard | Opens GT-04. |
| Release grades | Loading delay, then Sending state, then fixed failure scenario. No feedback policy or LMS write changes. |
| Student-by-student status | Fixed Synced, Pending, Failed or Held state per row. |
| Moodle ID / total / failure reason | Fixture values; no actual identity or grade service lookup. |
| Retry all / per-row Retry | Spinner, redraw and still-failing toast. No request is made. |
| Export CSV | Toast only. |
| All synced state | Manually selectable review scenario; Retry does not lead there. |

Recorded policy: send only when released, using FullyGraded; show feedback then; later rubric changes re-sync released grades. The file simulates the policy. The failure banner says 3 of 41 although this scenario holds three and releases 38; the HTML already flags that copy issue.

### GT-09 Roster and late allowances

Purpose: see LMS membership and grant individual extensions. Instructor and TA; desktop. States: Default and Unmapped roles. Source line 2515; implementation at 2624.

| Option | Actual behavior |
| --- | --- |
| Course staff and students | Fixed roster; dropped student's work remains represented. |
| Refresh | After a delay adds one fixture student, Mei Tanaka; updates the refreshed label. Not a Names and Roles request. |
| Allow late | Replaces the cell with a free-text cutoff and Save. |
| Save cutoff | Writes text into an existing fixture student's `allow` property. No time validation/server record. |
| Existing allowance | Displayed as text; no edit/revoke button once saved. |
| TA view | Refresh disabled; allowance editor hidden; view-only banner. |
| Unmapped-role scenario | Adds a Mentor example and says unmapped roles are treated as students. No mapping UI. |

The added Mei record is constructed outside `ROSTER`; Save searches only `ROSTER`, so her allowance is not retained on redraw even though a success message appears.

## 6 Student screens

Common phone chrome includes a back chevron, title/subtitle, step indicator and simulated Safari address/status bars. The back chevron produced by `mTop()` is an `aria-hidden` span styled as a button, with no back-navigation handler. It is therefore a visible option-shaped placeholder, not an actionable HTML control in the extracted inventory. Device bezels, status icons and address bars are also decorative frames.

### GT-20 Assignment status

Purpose: the student's entry point from the LMS. Student; desktop and phone. Nine states. Source line 2664.

| Option or scenario | Actual behavior |
| --- | --- |
| Submit with your phone | Opens GT-21; default desktop shows QR handoff, phone shows Open scanner. |
| Upload a PDF instead | Opens GT-26; on phone it falls back to GT-26's desktop presentation because that screen has no phone target. |
| View what you sent | Opens GT-25 receipt; the later PDF-view button is a toast. |
| Resubmit | Opens GT-21; does not create a stored replacement version. |
| See feedback | Opens GT-27. |
| Problem-set PDF | File-chip presentation only; no downloadable reference PDF. |
| Not submitted | Fixture deadline and remaining time. No live countdown computation. |
| Submitted | Fixed received timestamp, page/question counts and receipt number. |
| Late window | Allows the same demonstration submission route; late status is scenario-driven. |
| Closed | Message; no submit action. |
| Waiting for feedback | Receipt access without feedback. |
| Released | Fixed 26/30 score and feedback action. |
| Browser blocked | Open in a new window button is visible but unwired. |
| Not in roster | Try again shows Checking and then switches to not-submitted after a delay; no roster lookup. |
| Outage near deadline | Shows a hypothetical outage and extended deadline. No outage monitor or extension engine. |

The recorded product policy counts an upload started before the deadline as on time. This is a requirement, not a behavior enforced by the HTML.

### GT-21 Phone handoff

Purpose: transfer a laptop assignment session to a phone. Student; desktop and phone. States: QR code and Code expired. Source line 2685.

| Option | Actual behavior |
| --- | --- |
| QR graphic | Generated example pattern; not an encoded signed assignment URL. It is labeled as an example in its accessible description. |
| 15-minute single-use statement | Describes a proposed handoff token policy; no token creation, clock or expiry enforcement. |
| Email me the link | Shows a message saying it was sent to a fictional address. Sends nothing. |
| Get a new code | Returns expired scenario to QR scenario; no new token. |
| Upload a PDF instead | Opens desktop PDF screen. |
| Open scanner on phone | Opens GT-22 First use inside the same review. Does not actually launch Safari/Chrome or request a camera. |

### GT-22 Capture pages

Purpose: collect photos, inspect quality and prepare pages. Student; phone only. States: Pages added, First use, No camera. Source line 2697.

| Option | Actual behavior |
| --- | --- |
| Add page | Adds a generated SVG page; checks the 30-page limit. No camera/file selection. |
| Choose photos | Visible button without a handler/file input. |
| Framing tip | Static guidance: flat surface, good light, fill the frame. |
| Page thumbnails | Sample pages, not captured images. |
| Blurry warning | Predetermined blur flag and CSS filter; no image-quality analysis. |
| Retake | Removes the sample page's blur flag and redraws it. |
| Keep | Suppresses the warning using one shared flag. It does not clear the thumbnail blur filter. |
| Rotate page | Changes thumbnail rotation in 90-degree steps. Rotation is not carried into a generated/uploaded PDF. |
| Delete page | Immediately splices the page array, adjusts tag indices and shows a message. No confirmation despite the component rule requiring it. Rotation indices are not remapped. |
| Page count | Reflects current `PH.pages` while on this screen. |
| Next: tag pages | Opens GT-23, whose initial render resets the pages to the four-page sample. |
| Reorder pages | Mentioned in notes as drag-to-reorder, explicitly not drawn and not implemented. |

The proposed image target is roughly 1,600–2,000px on the long edge, JPEG around 0.7 quality, about 200–400KB/page, at most 30 pages. These are design targets; there is no compression measurement or implementation. Closing/reloading loses this prototype's work despite the draft-saved copy.

### GT-23 Tag pages to questions

Purpose: associate one or more pages with each question. Student; phone and desktop. States: Q3 untagged and All tagged. Source line 2717.

| Option | Actual behavior |
| --- | --- |
| Question chips 1a, 1b, 2, 3, 4 | Select which question is being tagged; show count of assigned pages. |
| Page selection | Toggles that page in the selected question's array. Multiple questions may share a page; questions may span pages. |
| No-pages warning | Reports the first question without a page. Does not hard-block progression. |
| Next: review | Opens GT-24. If any question is empty, requests the untagged-question scenario. |
| All tagged scenario | Seeds all five questions with sample tags. |

Within the screen, tagging is local behavior. Entry resets capture/tag state. Review and receipt do not consume a unified record of those choices. The one-use delegated click listener can also be consumed by a non-action click, leaving later controls inert until a redraw.

### GT-24 Review and submit

Purpose: confirm work and show reliable progress. Student; phone and desktop. Six states. Source line 2728.

| Option or scenario | Actual behavior |
| --- | --- |
| Pages / tagged questions / due / timing summary | Fixed four-page example. Does not derive from current capture/tag arrays. |
| Four preview thumbnails | Always the four `NOAH` sample pages. |
| Submit | Runs a timed percentage animation, then opens the fixed receipt. No upload or PDF construction. |
| Untagged-question dialog | Always names Q3, even when another question triggered the condition. |
| Tag them now | Returns to tagging, which reseeds the scenario. |
| Submit anyway | Runs the same animation. Does not record that a question was intentionally skipped. |
| Sending | Percent display and progress bar. Forced state previews remain static until a relevant action starts the simulation. |
| Connection lost | Fixed 62% message; does not detect network state or resume data. |
| Not sent yet | Shows A7K2-DRAFT recovery code. Try again starts the animation. |
| Copy code | Toast saying copied; no clipboard write. |
| Late scenario | Fixed late notice. No date/deadline enforcement. |

Normal Submit starts at zero and increments by four. It visits 60%, then 64%, so its `p === 62` interruption branch never runs. The separately displayed 62% failure state and the motion-section upload demo do not prove this flow recovers a real interruption.

### GT-25 Receipt

Purpose: show proof of acceptance and let the student inspect the stored submission. Student; phone/desktop. States: On screen and Email copy. Source line 2752.

| Option | Actual behavior |
| --- | --- |
| Received time / receipt / email confirmation | Fixed 11:52pm EDT, A7K2, four pages and five tagged questions. |
| View what you sent | Toast describing opening the exact PDF; no PDF stored or opened. |
| Back to Moodle | Opens GT-20 Submitted state inside the review; does not navigate to Moodle. |
| Email preview | Renders fictional sender/recipient, subject and receipt body. Does not send email. |
| Email receipt link | Styled text only. |

The intended rule is to preserve the phone draft until server acceptance is acknowledged. The prototype has no server acknowledgment or draft lifecycle.

### GT-26 Desktop PDF upload

Purpose: accept an already-scanned PDF as an alternative to camera capture. Student; desktop. States: Choose a file, File chosen, File too large. Source line 2762.

| Option | Actual behavior |
| --- | --- |
| Choose file | A real file input accepts a local file and reads its metadata. |
| Drag and drop | Reads the first dropped file's metadata. Multiple files are not combined. |
| PDF/50MB check | Local MIME/extension and size checks. File picker and drag/drop paths use slightly different type criteria. No content signature check. |
| Selected file name/size | Displays escaped name and size, explicitly saying it stays in the browser/not uploaded. |
| Replace | Clears local file metadata and returns to empty state. |
| Next: tag pages | Enables for an accepted file; opens the same four sample pages in GT-23, not the chosen PDF's actual pages. |
| Cancel | Returns to GT-20. |
| File too large | Displays scanner-app reduce-size advice. Wrong file types can also receive this size-focused error. |

Replacing an oversized forced-state example with a valid file does not clear `state='st11'`, so the error can remain while Next is enabled. Files are never parsed or uploaded by this screen.

### GT-27 Graded feedback

Purpose: show released scores, applied rubric items, pages and comments. Student; desktop/phone. States: Released and Not released yet. Source line 2777.

| Option | Actual behavior |
| --- | --- |
| Total | Fixed 26/30. Not linked to grading actions. |
| Question rows | Expand/collapse per-question sample pages, deductions and instructor comment. Initially Q3 appears open. |
| Applied rubric items | Fixed sample deductions; Q3 is 5/8 and Q2 5/6. |
| Instructor comment | Fixed physics explanation, not the comment typed in GT-05. |
| Email your instructor | Styled text, no email link. |
| Not released state | Shows waiting message with no feedback. This is a viewer state, not enforced data access control. |

The first click on initially-open Q3 does not collapse it because rendered default state and `c._open` are initialized differently. A non-action click can consume the one-use listener. The Blackboard/Moodle wording is already identified as needing LMS-specific templating.

## 7 Institution administrator screen

### GT-30 Institution setup

Purpose: document the college connection and give IT control of data/support policies. Institution administrator; desktop. States: Overview, Support request, Export running. Source line 2791.

| Option or section | Actual behavior |
| --- | --- |
| Connection / Contacts / Data retention / Data export / Support access / Documents navigation | Sidebar labels are spans; do not navigate. Content is shown together. |
| Connection details | Fixture LMS/domain, Active status, Grades/Roster/Deep Linking services, launch preference and smoke-test statement. |
| Contacts | Fixed fictional IT/security/registrar contacts; no editable fields. |
| Retention dropdown | End of term +90 days, +1 year or +3 years. Native selection changes; no saved policy or deletion job. |
| Export all data ZIP + CSV | Switches to Export running state with fixed progress. No archive, CSV, download link or actual email. |
| Support request | Fixed PHYS 110 assignment scope, ticket, read-only claim and 48-hour duration. |
| Approve for 48 hours | Changes to Overview and shows approval toast. No grant, expiry or log insertion. |
| Deny | Changes to Overview and shows denial toast, including a claim support was told why; no reason input or message delivery. |
| Support history | Static 24-hour grant and six recorded views; no actual access logging. |
| HECVAT 4 / VPAT 2.5 / DPA / Subprocessor list PDF buttons | Visible placeholders without downloads. The decisions page explicitly says these documents do not exist yet. |
| Help | Unwired text. |

These are procurement and operational requirements for a future pilot. They cannot be presented as completed security, accessibility or contractual evidence.

## 8 All 14 workflows

The viewer contains 68 steps. Its Previous/Next buttons and numbered steps navigate the explanation; Open live jumps to the referenced demonstration. A static preview is generated with `inert` and does not execute its screen wiring. Some preview renderers nevertheless mutate shared state, which should be corrected.

| Flow | Intended sequence | Actual completeness |
| --- | --- | --- |
| FL-GT-01 Install in Blackboard | Developer registration → admin client registration → policies/services → pilot course scope → signed institution invite → smoke test. | Explanatory text and GT-30 preview; no registration/invite/integration. |
| FL-GT-02 Install in Moodle | Add registration URL → enable required services → choose new window → enable pilot courses → institution setup → smoke test. | Explanatory text and preview. First intended integration target. |
| FL-GT-03 Create assignment | Welcome → Deep Linking setup → enter questions/settings → save into course → empty dashboard → optional rubric. | Individual screens; no actual Deep Linking response or shared saved assignment. |
| FL-GT-04 Submit by phone | LMS status → QR handoff → phone scanner → capture → tag → review → upload → interruption/retry → on-screen/email receipt. | Illustrated sequence with local interactions; state resets and hardcoded review break continuity. |
| FL-GT-05 Submit desktop PDF | Status → file select → accepted file → tag → review → receipt. | Metadata selection works; actual PDF pages are not consumed. |
| FL-GT-06 Resubmit | Submitted status → new capture → review → new receipt → instructor resubmission warning. | Fixture states; no stored versions, new receipt identity or grade invalidation. |
| FL-GT-07 Grade by question | Dashboard → question grader → optional hidden names → conflict check → question completion. | Rubric toggles/score/navigation work locally; question choice and completion are disconnected. |
| FL-GT-08 Change rubric | Editor → impact preview → choose scope/apply → other grader refresh. | Fixed preview/toasts; no batch recalculation or live refresh. |
| FL-GT-09 Release/pass back | Checklist → send → per-student failure/retry/export → student status → feedback. | Timed simulation; release-scope radio ignored and feedback fixed. |
| FL-GT-10 Late allowance | Late window → late review → instructor allowance → closed alternative. | Text/cell editing; no deadline enforcement. |
| FL-GT-11 Roster change | Refresh membership → retain dropped work → wait for new enrollment to appear. | Adds one fixture and displays alternate states. |
| FL-GT-12 View feedback | Before-release message → released score → feedback by question. | Display scenarios; no user/session gate. |
| FL-GT-13 Upload for student | Open detail → instructor upload/tag → dashboard counts it. | Illustrative states; Upload for student has no handler. |
| FL-GT-14 Support access | Admin approves/denies scoped grant → log every view. | Toast/state change only. |

All flow references matched declared screen IDs, state keys, roles and devices in the source-level check. That establishes internally valid references, not completed workflow behavior.

## 9 Exceptional conditions and recovery

| State ID | Meaning | Where represented | What the current file does |
| --- | --- | --- | --- |
| ST-GT-01 | No submissions | GT-04 | Empty dashboard scenario. |
| ST-GT-02 | All answers to question graded | GT-05 | Completed-Q2 scenario; not reached automatically by save loop. |
| ST-GT-03 | Page loading | GT-05 | Static skeleton; no fetch/prefetch. |
| ST-GT-04 | Camera unavailable | GT-22 | Message and Choose photos placeholder. |
| ST-GT-05 | Blurry page | GT-22 and voice examples | Inline default warning with Retake/Keep; not a dedicated state-selector entry. |
| ST-GT-06 | Upload connection lost | GT-24 | Fixed 62% scenario; no real network detection. |
| ST-GT-07 | Upload not sent | GT-24 | Retry simulation and pretend Copy code. |
| ST-GT-08 | Late submission | GT-20/24 | Alternative deadline messages. |
| ST-GT-09 | Submissions closed | GT-20 | No submission action in that scenario. |
| ST-GT-10 | Question has no pages | GT-24 | Fixed Q3 warning and submit-anyway/tag choices. |
| ST-GT-11 | PDF exceeds size limit | GT-26 | Real metadata size check plus forced error scenario. |
| ST-GT-12 | Someone else graded answer | GT-05 | Choice dialog without versioned writes. |
| ST-GT-13 | Rubric changed during grading | GT-05 | Banner scenario; no event/reconciliation. |
| ST-GT-14 | Some LMS grade writes failed | GT-08 | Failure table, simulated retry and export toast. |
| ST-GT-15 | Launch lacks assignment connection | GT-01 | Instructions; no live launch check. |
| ST-GT-16 | Browser blocks embedded connection | GT-20 | Fallback button without action. |
| ST-GT-17 | LMS roles unmapped | GT-01/09 | Warning and fixture role. |
| ST-GT-18 | Student not yet in roster | GT-20 | Timed retry scenario. |
| ST-GT-19 | Outage overlaps deadline | GT-20 | Hypothetical extension text. |
| ST-GT-20 | Feedback not released | GT-20/27 | Waiting scenario. |

All 20 named conditions appear somewhere in content/rendering. Only 19 are explicitly registered with `ST-GT-*` metadata in the screen state arrays because the blur warning is inline. Search indexing built from those arrays therefore does not give ST-GT-05 the same state shortcut as the others.

## 10 Five future-platform pages

| Page | Visible options and information | Actual behavior |
| --- | --- | --- |
| PG-L-01 Today | Date, classes, room/time, due-soon assignments, status, recent grades/announcements; Today/Courses/Calendar/Inbox tab-bar concepts. | Static native-looking phone mockup. Tabs and rows do not navigate. Notifications are grouped as New since yesterday. |
| PG-L-02 Calendar | Week/Month buttons; six course checkboxes; class blocks, deadlines, times and current-time line. | Course checkboxes hide/show those events. Week/Month do not switch view. Times/date are fixtures. Despite the page's claim of testing all 12 colors, its actual courses use six. |
| PG-L-10 Course home | Home/Modules/Assignments/Grades/People/Syllabus navigation; current/past week materials; announcement; Coming up; grading progress; staff. Desktop/iPad landscape selector. | Layout preview. Navigation, files, quiz rows and assignment rows are not live. |
| PG-L-40 Instructor gradebook | Student names; four problem sets; three labs; quiz average; midterm; Current column; missing/late/excused indicators; Export for SIS. | Numeric column headers sort descending; Current is computed from category means and weights. Student header restores fixture order rather than alphabetical sort. No direction toggle. Export is inert. |
| PG-L-42 Student grades | Current grade; category averages/weights; lowest-quiz drop; equation; ungraded final; recent assignment; course tabs. | Formula runs from sample numbers. Navigation is static. It illustrates transparency, not a complete grading-policy engine. |

The gradebook uses problem sets 30%, labs 20%, quizzes 15%, midterm 15%; the final 20% is not yet graded, so current performance is normalized over 80%. Missing values count as zero; excused values are excluded. The student grade example drops the lowest quiz. These two demonstrations use separate datasets; they are not two views of the same student record.

The calendar library note mentions Schedule-X with FullCalendar as a fallback/revisit choice. Neither library is loaded. The native iPhone appearance uses HTML/CSS and system font fallbacks, not SwiftUI or a compiled native app. The mockups still draw Material Symbols while listing proposed SF Symbol mappings.

## 11 Marketing page

The main message is grading handwritten problem sets inside Moodle. Three steps explain phone scanning, question-by-question grading and release back to the LMS. Desktop and iPhone previews reuse scaled, inert Tier 1 screen renderers.

Visible options are How it works, For IT, Pilots, Talk to us about a pilot, See how it works, and footer labels Security, Accessibility, Privacy and Subprocessors. They have no form, email action, destination or navigation wiring. There is no pilot signup/contact backend.

The For IT section describes LTI 1.3 installation, HECVAT 4, a VPAT, a DPA with FERPA-related terms, subprocessors, configurable retention, ZIP/CSV export, approved/time-boxed support access and no AI on student work. These are proposed product/procurement commitments, not proof of implemented controls or legal compliance. The decisions page explicitly distinguishes missing documents from completed ones.

The page says the team is in Ohio and building with a few colleges in 2027. The same review asks whether that public statement is acceptable. It should remain proposed copy until those facts are confirmed. No invented speed benchmarks, testimonials or customer counts are used. Marigold is a flat product-shot background, confined to marketing.

## 12 Design system and interaction rules

### Colors and status

The primary accent is Deep Teal `#007176` in light mode. Neutral colors have a subtle teal cast. Five status families cover information, success, warning, error and neutral states. Submitted, Graded, Late, Missing, Excused and Released use text plus an icon as well as color. Released has an outline to distinguish it from Graded.

Twelve course colors exist as tokens: Red, Orange, Amber, Lime, Green, Teal, Sky, Blue, Indigo, Violet, Pink and Brown. Course chips use tinted backgrounds, a colored bar, text and sometimes a shape. The source rejects some white-on-solid fills for insufficient contrast. Light/dark values and a table of pre-entered contrast results are present. The code displays those values rather than recomputing contrast from the rendered page.

Color-vision simulation choices are Typical, Protanopia, Deuteranopia, Tritanopia and Grayscale, applied to the designated color-demo area through SVG matrices. This does not establish accessibility for the whole application.

### Typography and layout

Web typography uses Inter, with tabular scores/times/counts, tuned spacing and optical sizing. The future native design calls for San Francisco and platform text styles. Caveat is confined to sample handwriting. Production self-hosted InterVariable and richer math rendering are described future steps; the file loads Google Fonts and uses plain Unicode math.

Spacing follows a four-point scale. Width classes are Compact <600, Medium 600–839, Expanded 840–1199, Large 1200–1599 and XL >=1600. The intended grader is unsupported at Compact. Product container CSS changes the grader layout at 900px, so the actual breakpoint is not identical to the prose width-class table. The review can scale a desktop frame and allow sideways scrolling; that is different from a naturally responsive production screen.

Comfortable rows are 48px, compact rows 36px. Vision gradebook rows are 32px, explicitly awaiting a separate dense exception. Radii vary by component from 6px controls through 20px sheets and capsules. Hairlines and spacing separate content; shadows indicate floating surfaces. Scanned work remains white in dark mode.

### Motion and accessibility intent

Micro/move/emphasis durations are 150/250/300ms on web. The stated policy favors opacity/transform, reduced motion and instant grading actions. The code also animates colors/borders and stroke-dashoffset in examples, so the prose restriction is stronger than the implementation. The reduced-motion demo checkbox affects the motion helper, not every animation everywhere in the document. System reduced-motion queries are handled in several places, but there is no complete browser verification.

The file includes labels, visible-focus styling, named dialogs, native input elements and keyboard shortcuts. Important remaining areas include focus trapping/restoration for overlays, focus behavior after `innerHTML` rebuilds, visible text wrapping at accessibility sizes, semantic navigation, announced progress and keyboard access to all intended controls. No VoiceOver/NVDA or third-party accessibility pass is established here.

### Brand voice

The voice is calm, short and specific: say what happened, then what to do; protect the student's work first; name people; show counts and timezones. Sentence case, true minus signs and tabular scores are deliberate. No emoji or exaggerated claims are intended in product UI. The anti-AI rulebook means avoiding generic generated-looking design and copy; it is separate from the proposed promise not to use AI on student submissions.

## 13 Confirmed defects and misleading behavior

Priority here means impact on an honest, coherent prototype demonstration. Missing production services are recorded separately rather than treated as accidental bugs in a design artifact.

| ID | Priority | Finding and evidence | Consequence and repair direction |
| --- | --- | --- | --- |
| F01 | High | GT-23 calls `phReset()` on initial render, line 2719. Source-extracted execution with one captured page produced four after entry. | Captured pages/tags are replaced with fixtures. Rotation values remain indexed separately and can attach to different pages. Make renderers pure and initialize a submission only at an explicit new-attempt action. |
| F02 | High | GT-24 summary and thumbnails use literal four-page/NOAH data, lines 2731–2740; GT-25 uses fixed receipt data. | Review/receipt can certify work the student did not choose. Derive all views from one submission record. |
| F03 | High | GT-08 radios at 2608 are never read by `wireRelease()` at 2619; three students are always held at 2611. | Release all 41 has no effect. Store and apply release scope; calculate counts from that scope. |
| F04 | High | `p=0`, `p+=4`, `p===62`, lines 2744–2745. Arithmetic check never reaches 62. | Normal Submit cannot demonstrate its promised recovery branch. Use an explicit interruption threshold/state rather than equality on this increment sequence. |
| F05 | High | GT-22/23/27 delegated listeners use `{once:true}`, lines 2714, 2725, 2788. Non-action clicks can consume them before handlers reattach. | Controls can stop responding after clicking whitespace/content. Delegate persistently to a stable container or explicitly remove listeners on teardown. Browser reproduction remains to be run. |
| F06 | High | All dashboard question buttons open only GT-05, line 2486/2489; the grader fixes Q3 and eight points. | Grade Q1a/Q2/Q4 opens the wrong question. Pass assignment/question identity and render the correct rubric/pages. |
| F07 | High | Grader Save adds to `G.done` but advances modulo the same fixed list, line 2568. | Save and next ungraded revisits graded students and never automatically completes. Filter remaining ungraded answers and handle zero remaining. |
| F08 | Medium | Rubric editor/preview fix −2→−1 and 23 answers at 2524–2542; both apply scopes lead to Applied when opened as GT-06. From GT-03, apply only closes the dialog and shows a toast. | Different edits and new-only scope receive inaccurate impact messaging. Compute preview and applied state from actual selection. |
| F09 | Medium | GT-26 error uses `st==='st11'` even with a valid file, line 2768; extracted render showed an error and enabled Next together. | Successful replacement does not resolve the error. Derive validation from current file and distinguish wrong-type from oversized errors. |
| F10 | Medium | GT-27 defaults open to Q3 in rendering but `_open` is initially unset in its click handler, lines 2781/2788. | First click on initially-open Q3 does not close it. Initialize one authoritative accordion state. |
| F11 | Medium | GT-09 adds Mei via a concatenated temporary record at 2624, but Save only searches ROSTER at 2633. | New student's extension appears saved, then disappears. Update the same roster collection used for rendering. |
| F12 | Medium | Preview/audit calls invoke screen renderers with state mutations, particularly GT-22 First use and GT-23, lines 2699, 2719, 2854, 3125. | Reading a flow or running the audit can reset live submission state. Separate fixture creation from rendering; audit snapshots must not mutate live data. |
| F13 | Medium | GT-08 first delayed callback and GT-20 roster retry call global `setState()` after navigation, lines 2619 and 2682. | A stale timer can set an invalid state on a different screen. Cancel timers on exit or bind updates to a screen/session token. |
| F14 | Medium | Grade-sync error says 3 of 41 while header says 38 released/3 held, lines 2614–2615. | Counts disagree in the key release failure message. Template from actual released count. Already acknowledged in the review. |
| F15 | Medium | GT-22 Delete is immediate at 2714 while component guidance at 1572 requires confirmation for destructive actions. | Prototype contradicts its own recovery rule. Supply confirmation or a clearly specified undo/recovery path. |
| F16 | Medium | `toast()` starts removal after 2,600ms at 2029; specimen says four seconds and pause on hover at 1673. No hover-pause or functional Undo handler. | Success/undo examples overstate behavior. Align timing and wire supported actions. |
| F17 | Medium | Custom contrast audit inserts `true` directly, line 3126. Contrast table is a pre-entered array at 1959. | A Pass does not inspect actual UI contrast or whether rejected pairs are used. Report measured scope honestly; test computed styles separately. |
| F18 | Low | Calendar claims all 12 course colors; `CRS` has six courses at 2975 and PG-L-02 uses them at 2994–3004. | The advertised twelve-color stress test is incomplete. Add a genuine twelve-course case or narrow the claim. |
| F19 | Low | Footer says all nine stages published while STAGES lists 5–7 as Dropped; overview still says Stage 1 of 9. | Completion labels are inconsistent. State that the revised review scope is complete and explain the merged stages once. |
| F20 | Low | Prototype warning badge is demonstrated in Components, but is not inserted into every GT frame by `frameHTML()` at 2838. | Isolated screenshots may look like real product claims. Make the prototype label persistent and non-obscuring if interview use requires it. |

These findings do not imply real student data has been lost: all affected submission data in this file is synthetic and local. They matter because a prospective user could mistake a successful simulation for implemented reliability.

## 14 Limits of the built-in audit

Run again checks whether buttons have a text/title/ARIA name; certain form fields have labels; IDs duplicate in the currently mounted DOM; role=img SVGs have labels; vision sections have a badge; selected copy contains excessive em dashes/emoji/exclamation marks; and status chips have words/icons.

Its scope is narrow. It does not click controls, verify action outcomes, inspect every state/device combination, run a real screen reader, check focus trapping, compare dynamic state across screens, test uploads, verify permission enforcement or contact an LMS. It accepts `title`/icon text as a button name, which can hide weak names. Label checks exempt `.sr` fields and do not validate all relationships or announcements. The contrast result is hardcoded Pass, and many contrast ratios are stored data. It also renders default screens to inspect their copy, which can change live prototype state.

The build-check rows claiming desktop light/dark and phone-width checks are historical statements inside the artifact. They were not rerun as browser checks in this audit and should not be treated as fresh evidence.

## 15 Product services still required

This is the implementation work implied by the existing design, not authorization to build or deploy it now.

| Area | Missing service or policy detail |
| --- | --- |
| Identity and tenancy | Real users, institution/course membership, authenticated sessions, server-enforced instructor/TA/student/admin scope. |
| LMS installation and launch | Registrations, deployment mapping, signed launch validation, Deep Linking, roster retrieval, real score services, test institutions. |
| Assignment records | Persistent title/dates/timezone/questions, validated scoring policies, published links and reference PDFs. |
| Capture and local drafts | Actual camera/library input, image processing, draft storage, supported-browser behavior and recoverable edits. |
| PDF handling | Parsing selected PDFs, real page previews/tags/rotation/reorder, PDF construction and file limits enforced beyond the UI. |
| Reliable submission | Resumable upload protocol, server acceptance, durable storage, retries, receipt identity, deduplication and draft cleanup rules. |
| Deadlines | Trusted timestamps, upload-start policy, resubmission windows, per-student extensions, outages and consistent timezone handling. |
| Grading records | Per-question selections/comments, consistent score model, version conflicts, ungraded queues, rubric versions and bulk recalculation. |
| Release | Stored release scope, treatment of incomplete questions, feedback visibility, retryable/idempotent grade writes and reconciliation. |
| Feedback and history | Exact accepted files, stored submission versions, grade history, released comments and auditable changes. |
| Notifications | Actual receipt delivery, expired links, failed-delivery behavior and release-notification settings. |
| Institution operations | Retention execution, recoverable administration where appropriate, real exports, access grants, expiry and view logs. |
| Pilot documentation | Actual HECVAT/VPAT/DPA/subprocessor deliverables and substantiated public statements. |
| Accessibility and measurement | Browser/keyboard/screen-reader testing; device tests; real performance measurements and grading-time study. |

There is no AI grading, OCR, automatic edge detection, chatbot, payment screen, subscription management, complete course authoring system or complete native app in this HTML. Claim locks and regrade requests are explicitly outside the present MVP; real math rendering and native-platform work are later. Their absence should not be confused with broken controls that were never in scope.

## 16 Decisions that remain open

The review's own queue asks for product-name resolution, logo direction, template-based copy corrections, contrast-driven chip/status acceptance, holding incomplete submissions by default, light-only pilot timing, course-first native tabs, dense gradebook rows and alignment with a separate interview prototype that is not present here.

It also asks whether Ohio/2027/pilot statements may be public, warns that compliance-related downloads do not yet exist, and proposes showing simulated Moodle chrome with its label intact. These decisions are recorded proposals; reading them does not approve them.

The source-of-truth documents named by the HTML are not in this project folder: Business Research v2.1, SCOPE-CORRECTION-LMS-Core, Tech-v2 Phases 1/2/3a/3b, Grading Tool MVP Scope and Estimate, and Design-v2 Phase A. Their decisions, full requirements, budget and estimates cannot be independently reconstructed from the showcase alone.

## 17 Suggested correction sequence and acceptance checks

1. **Make the prototype internally coherent.** Preserve one assignment, one question context and one submission object across capture/tag/review/receipt. Keep render functions pure. Acceptance: add/remove/rotate a page, tag it, enter review, run audit, visit a flow and return; the same pages/tags remain and all counts match.
2. **Repair active controls and feedback.** Remove one-use delegate hazards, handle timers on navigation, honor release scope, make rubric preview values/scopes truthful and resolve file validation after replacement. Acceptance: test each option in the screen tables, including clicking non-action content before using a control.
3. **Make the grading loop complete.** Dashboard passes the chosen question; save selects the next ungraded answer and finishes cleanly; dashboard and feedback use saved data. Acceptance: grade every answer once; none reappears as ungraded; points and comments match every view.
4. **Label simulations consistently.** Camera, email, clipboard, exports, QR and service status must say what is being demonstrated until wired. Acceptance: an isolated screenshot or a new reviewer cannot mistake a toast for a delivered email or stored submission.
5. **Implement a narrow real Moodle slice when authorized.** One test institution/course, assignment creation, real PDF submission, question grading, release and verified gradebook arrival. Acceptance: a real test learner's accepted bytes, receipt, feedback and LMS score reconcile after reload and retry.
6. **Prove the failure paths.** Interrupt actual uploads, expire a handoff link, submit near deadline, resubmit after grading, simulate concurrent graders and LMS failures, and verify permissions/retention/access logs in an appropriate test environment. Acceptance criteria must use stored records and observed outcomes, not just scenario selectors.

## 18 Verification performed and evidence limits

The original HTML was read and left unchanged. The audit inventoried 16 sections, 18 grading-tool screens, 64 declared screen states, 14 flows comprising 68 steps, five vision pages and the marketing preview. All 20 exception IDs are accounted for, including ST-GT-05's inline warning.

The inline JavaScript passed `node --check`. Source-extracted render functions successfully generated 159 combinations: 153 grading-screen/state/declared-role/declared-device combinations and six vision/device combinations. Nonessential symbol/status graphic helpers were substituted for this source-only exercise. Screen event handlers, actual DOM behavior, CSS layout and browser APIs were not exercised by those render checks.

Additional source-level checks confirmed sample rubric scores, the unreachable 62% branch, capture reset on tagging entry, hardcoded review count, contradictory valid-file/error output and valid flow-to-screen references. An independent Astra review inspected the behavior and gaps; the lead checked the findings against the source and integrated them here.

Browser visual testing was not performed. A prior attempt to open this local HTML was rejected by browser security policy because `file://` is disallowed. No alternate browser/server workaround was used. No live LMS, real camera, mobile device, upload, email, export, signed-in user flow or screen reader was tested. Technical statements about proposed LMS behavior are reported as the design's intent rather than claims verified against current external documentation.

Only local audit documents were added. No application code was changed, published or deployed.
