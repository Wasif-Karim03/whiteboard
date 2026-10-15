# Whiteboard showcase: current page and research gaps

Prepared 15 October 2026. Planning only; the showcase HTML has not been edited. Priorities below describe what the **showcase must communicate**, not the production delivery order. A later product capability can be a must-have in a visual of the final product.

## 1. Located artifact and review basis

The single original product showcase is [`Claude outputs/Pellwin-Showcase.html`](../Claude%20outputs/Pellwin-Showcase.html). The other HTML files are the research report and its hosted copies, not competing product showcases. Upgrade this original file in place after approval; retain its current filename as the single editable showcase source unless the user requests a rename.

The original has 3,140 lines and 396,815 bytes. Baseline SHA256: `090136bffdcdbdc4b7d0a8b1a650cb9e1a6a3750eabb35cd28b1ec13ba29d2dd`. The source, prior [functional audit][audit], [state/control inventory][inventory], [research synthesis][synthesis], all six opportunities files and the merged CSVs inform this analysis. The CSVs contain 93 domain/product entries, 549 feature comparisons and 73 coded pain findings; these are research-corpus counts, not evidence of market prevalence or Whiteboard usage.

Important interpretation: the research recommends starting with a complete teaching workflow and sequencing expansion. This brief asks to **show the final product vision**. Therefore the page should depict teaching, campus coordination and later support together, while explaining the intended sequence and identifying specialist integrations. It should not shrink back into a grading-only launch page.

## 2. What the existing showcase actually contains

### Page structure

The HTML is an internal design-review application, not primarily a stakeholder product narrative. Hash routes switch between 16 sections; most content is initially hidden and rendered/activated through JavaScript. Ten foundation sections precede the product screens.

| Current section | Existing content and interaction | v2 treatment |
| --- | --- | --- |
| Overview | Two tiers, nine historical build stages, fictional cast, shortcuts, absent-source references | Replace with the full Whiteboard vision; retain the fictional scenario privately in fixtures and a brief visible sample-data note. |
| Logo concepts | Direction selection, sizes, themes, monochrome comparisons | Use one restrained working Whiteboard mark; remove the logo-selection exercise from the public journey. |
| Brand voice | Principles, audiences, preferred words and examples | Apply the voice to actual product copy; remove the workshop. |
| Color | Theme tokens, status/course palettes, calculated contrast and simulations | Retain semantic tokens; recheck actual use rather than publishing an accessibility claim from the specimen. |
| Typography | Inter tuning, system iOS styles, Dynamic Type and handwriting | Retain hierarchy; use offline-safe type and real reflow. |
| Layout and spacing | Spacing, widths, device frames, density | Reuse spacing/radius logic; replace fixed scaled canvases where they prevent readable mobile use. |
| Shape, elevation and materials | Radius, focus, borders, shadows and limited blur | Retain restrained surfaces and focus; keep decoration subordinate to screens. |
| Icons | Material Symbols and usage rules | Replace external icon-font dependency with inline SVG and text labels. |
| Motion | Tokens, replayable demonstrations | Apply subtle task feedback; remove the motion laboratory from the product story. |
| Components | Controls, rubric items, tables, feedback, dialogs, progress and iOS-like blocks | Reuse the visual vocabulary and recovery states with coherent demo state. |
| Grading tool screens | 18 screens; role/device/state controls; specification notes and TA policy | Retain the best grading/submission ideas inside the full teaching journey. |
| Grading tool flows | 14 stepped flows with exact screen/state/role/device links | Replace the catalogue-first experience with a small set of connected, comprehensible tours. |
| Platform pages | Five concepts: Today, calendar, course home, instructor gradebook, student grades | Promote into a consistent LMS product shell and add missing course workspaces. |
| Marketing site | Nested mock website for a Moodle add-on; pilot CTA and IT copy | Replace with the showcase itself, not a second website inside a frame. |
| Anti-AI rulebook | Internal design rules and intentionally bad examples | Apply the useful restraint; remove the rules/examples from the stakeholder page. |
| Decisions and audit | Decision IDs, historical changelog, runtime checks and asserted prior QA | Keep development evidence in documentation; replace with honest product status and research footnotes. |

### Existing product-screen map

| Group | Screens present | Maturity and reuse |
| --- | --- | --- |
| Instructor / TA | GT-01 welcome; GT-02 assignment setup; GT-03 questions/rubrics; GT-04 assignment dashboard; GT-05 question grader; GT-06 rubric-change preview; GT-07 submission detail; GT-08 release/sync; GT-09 roster/late allowances | Rich visual and local-interaction prototypes. Reuse structure, readable work, rubric keyboard ideas, explicit release and recovery. They do not establish a persistent course/assessment service. |
| Student | GT-20 assignment status; GT-21 phone handoff; GT-22 capture; GT-23 question tagging; GT-24 review/submit; GT-25 receipt; GT-26 PDF selection; GT-27 feedback | Useful journey, but capture/pages/receipt are partly synthetic and disconnected. Link one fixture through all stages before demonstrating submission certainty. |
| IT | GT-30 institution setup | Starting point for connection, contacts, retention, export and support-access concepts. Expand beyond LTI installation and replace document-download placeholders. |
| Broader LMS | Today, calendar, course home, instructor gradebook, student grades | Five independent vision renderers with fixtures. They need common records, navigation and lifecycle semantics. |

The prior inventory records 64 declared states and 14 flows with 68 steps. These counts do not mean that those production features exist. Both audit files distinguish working local controls, synthetic transitions and described services. [Baseline][baseline]

### Current design system and implementation

The useful signature is a cool paper background (`#FAFEFE`), white surfaces, dark ink (`#141B1D`) and a restrained teal action color (`#007176`). Dark mode uses graphite (`#101213`) with pale text and a lighter teal text accent. Status colors have distinct words/icons; course colors carry course codes. The system has a 4px spacing unit, 6/8/10/14/20px radii, limited surface elevation, 150–300ms motion tokens and an explicit focus treatment.

The page loads Inter, Caveat and Material Symbols from Google Fonts. System fonts supply iOS-like typography. Product text is mostly 14–17px, with a 32px review display style. The review shell uses a 268px rail and 1,040px content width; shell breakpoints include 1,100, 860 and 640px. Desktop mock frames can scale a fixed canvas rather than reflow. These are static source findings, not fresh browser verification.

Implementation is inline vanilla CSS/JavaScript, SVG, template strings, in-memory fixtures, localStorage theme preference, delegated handlers and multiple renderers. There is no framework/build/backend. Renderer side effects can reset the capture/tag fixture; review/receipt counts and grading context can diverge; some controls only show a toast. The v2 demo should reuse visual components, not inherit those independent state machines wholesale. [Known defects][audit]

## 3. Priority and treatment vocabulary

- **P0 must-have:** needed for an honest, complete and readable final-product showcase.
- **P1 should:** adds important depth or makes an operational advantage inspectable.
- **P2 nice:** optional polish or a later visual, with no material loss to the story if deferred.
- **Keep / modify / add / tone down:** applies to the showcase. “Add” usually means a working local demonstration with sample data, not a backend implementation.

Every row below has a priority, treatment and a research-linked reason. Names such as “submitted” inside the demo describe fictional records, never a real upload to a service.

## 4. LMS core — highest depth

| Gap ID | Treatment | Priority | Showcase decision | Research reason |
| --- | --- | --- | --- | --- |
| L01 | Keep | P0 | Question-by-question grading with readable handwritten work and rubric feedback | The current design has useful differentiation hypotheses, but specialists already cover this category; demonstrate clarity rather than novelty. [LMS][lms] |
| L02 | Keep | P0 | Student scan → organize → review → receipt → feedback sequence | Submission certainty is a strong proposed workflow advantage and needs an end-to-end visual. [LMS][lms] |
| L03 | Keep | P0 | Today, calendar, course and explainable-grade concepts | A consistent task model and understandable grade states anchor the platform story. [LMS][lms] |
| L04 | Keep | P1 | TA perspective, late allowances and grading recovery states | Permissions and real exceptions belong in credible instructor workflows. [LMS][lms] |
| L05 | Modify | P0 | Replace grading-first/Tier 2 framing with a full LMS at the center | The current research and user vision supersede the old Moodle-only positioning. [Synthesis][synthesis] |
| L06 | Modify | P0 | One assignment/submission/score model across every linked mockup | The current page resets tags, hardcodes review pages and ignores release scope; disconnected examples undermine submission/grade trust. [Baseline][baseline], [LMS][lms] |
| L07 | Modify | P0 | Show due date, close date, saved/submitted/released states and recovery separately | Research emphasizes correct assessment changes, receipts and unambiguous consequences. [LMS][lms] |
| L08 | Modify | P0 | Make mobile views reflow and finish real demo tasks without shrinking desktop text | Mobile completion is a product requirement; a device frame is not evidence of parity or a native application. [LMS][lms] |
| L09 | Add | P0 | Course list, stable course navigation, syllabus, modules and accessible material view | Full teaching needs organization/content, not just an assignment-grading subsystem. [LMS][lms] |
| L10 | Add | P0 | Instructor course authoring, publication and assignment creation | Show how coursework is made, revised and published in the planned LMS. [LMS][lms] |
| L11 | Add | P0 | Quiz authoring and student attempt, with autosave, time/accommodation and review states | Basic quizzes/exams are part of the recommended complete course cycle and absent from v1. [LMS][lms] |
| L12 | Add | P0 | Gradebook with categories, ungraded/missing/excused distinction and release preview | Explainable totals and controlled release are necessary to trust the final-product visual. [LMS][lms] |
| L13 | Add | P0 | Announcements, discussions and a canonical linked notification/task destination | Students should not need to relearn where assessed work and updates live. [LMS][lms] |
| L14 | Add | P1 | People/TA permissions, assignment accommodations and transparent attendance | Role scope and operational exceptions are core workflows; attendance must not be inferred from clicks. [LMS][lms], [Landscape][land] |
| L15 | Add | P0 | Course copy/rollover and import preview with visible exceptions | Migration and semester continuity are purchase barriers; perfect import cannot be assumed. [LMS][lms], [Cross-cutting][cross] |
| L16 | Add | P1 | Instructor course insights with source-linked observations and sample-only counts | Useful analytics should describe what happened without claiming clicks prove learning. [LMS][lms], [Landscape][land] |
| L17 | Tone down | P0 | Remove claims that capture, durable drafts, email receipts or grade writes already work | The audited artifact implements no such production services. [Baseline][baseline], [LMS][lms] |
| L18 | Tone down | P0 | Remove “unique scanning,” “faster grading” or universal UX-win claims | Competitor capabilities and limited pain samples do not substantiate uniqueness or measured superiority. [Competitors][competitors], [LMS][lms] |
| L19 | Tone down | P1 | Avoid App Store/native availability promises and niche exam-engine breadth | Responsive mobile web is the recommended starting point; advanced integrity/video/assessment tools can be integrated. [LMS][lms] |

## 5. Scheduling and rooms

| Gap ID | Treatment | Priority | Showcase decision | Research reason |
| --- | --- | --- | --- | --- |
| R01 | Keep | P0 | Calendar and course meeting context | It is useful shared context connecting learning to campus spaces. [Rooms][rooms] |
| R02 | Modify | P0 | Separate a personal calendar from a registrar's timetable workspace | Viewing class times does not demonstrate schedule construction, constraint handling or booking. [Rooms][rooms] |
| R03 | Add | P0 | Registrar timetable showing sections, faculty, rooms, capacity and equipment/accessibility constraints | The final vision needs campus-operation workflows rather than a calendar-only claim. [Rooms][rooms] |
| R04 | Add | P0 | Propose a change, inspect conflicts and affected meetings, route approval and show applied/pending status | Explainable changes and departmental intake are the strongest recommended coordination opportunities. [Rooms][rooms] |
| R05 | Add | P0 | Room search, request and confirmed reservation with occurrence-level change/cancel | Institutions need clear authority and recurring-event semantics; request is not confirmation. [Rooms][rooms] |
| R06 | Add | P1 | Room provenance, source freshness and explicitly labeled scheduled-use analytics | Misaligned room identifiers and reservation/occupancy confusion can make a polished view misleading. [Rooms][rooms] |
| R07 | Tone down | P0 | Do not imply universal automatic professor matching, optimal timetabling or sensor occupancy | Specialist optimization and observed-space measurement exceed the evidence and recommended first build. [Rooms][rooms] |

## 6. Events, clubs and student organizations

There is no existing events/clubs workspace to keep. Retain the underlying calendar and reusable forms, not an implied current engagement service. [Baseline][baseline]

| Gap ID | Treatment | Priority | Showcase decision | Research reason |
| --- | --- | --- | --- | --- |
| E01 | Add | P0 | Campus event discovery and current club profiles with a named officer/contact | Discovery needs current ownership and term recertification, not merely a large directory. [Events][events] |
| E02 | Add | P0 | Join/request membership, view roster roles and transfer officer duties | Officer turnover loses knowledge and can strand work. [Events][events] |
| E03 | Add | P0 | Collaborative event draft with room, adviser and funding dependencies | A draft should belong to the organization rather than one departing creator. [Events][events] |
| E04 | Add | P0 | Approval timeline showing who acts next, what is blocked and what is confirmed | Separate systems and institutional approvals can hold up publication or spending. [Events][events] |
| E05 | Add | P0 | RSVP, capacity/waitlist and accessible student event pass | Final-product event participation should show the student action and its result. [Events][events] |
| E06 | Add | P1 | Operator check-in with pending offline records, duplicate handling and reconciliation | Reliable attendance is a permissions/sync problem, not just a QR picture. [Events][events] |
| E07 | Add | P1 | Funding-request status and private activity history, with connected finance/verified-record boundaries | Students need status; formal finance and official transcripts require separate governance. [Events][events] |
| E08 | Modify | P0 | Reuse task/calendar/notification concepts for events without building another competing inbox | Unified experience depends on common state and vocabulary across domains. [Synthesis][synthesis], [Events][events] |
| E09 | Tone down | P0 | Do not claim native payment settlement, official co-curricular transcripts or secure elections at launch | The recommended initial scope defers these consequential operations. [Events notes][eventsnotes] |

## 7. Cross-cutting: institutional administration, IT, trust and AI

| Gap ID | Treatment | Priority | Showcase decision | Research reason |
| --- | --- | --- | --- | --- |
| X01 | Keep | P0 | Clear status words, icon-plus-color feedback, themes and recovery messages | Correctness and accessibility need visible behavior, not a badge. [Cross-cutting][cross] |
| X02 | Keep | P1 | Existing institution setup/retention/support-access ideas as design seeds | Those are relevant institutional needs, but are described controls rather than delivered services. [Baseline][baseline], [Cross-cutting][cross] |
| X03 | Modify | P0 | Introduce Whiteboard consistently across titles, mark, app chrome and sample copy | The current Pellwin/Moodle story no longer matches the approved full-platform direction. [Synthesis][synthesis] |
| X04 | Modify | P0 | Replace “security documents ready” and download placeholders with planned evidence and honest status | HECVAT, ACR, DPA and external assurance have not been established. [Requirements][requirements] |
| X05 | Modify | P0 | Distinguish SSO, course authorization, roster provisioning and grade exchange | One login does not confer every role or establish a complete SIS integration. [Standards][standards] |
| X06 | Add | P0 | Institution-admin view for people, terms, role scopes, retention and audit history | CIO/admin readers need to see who can control the platform and what changes are attributable. [Cross-cutting][cross] |
| X07 | Add | P0 | IT connection health showing source/direction, last sync, rejected roster/grade record and retry/reconcile | Reliable exchange and understandable failures are purchase-critical. [Cross-cutting][cross], [Rooms][rooms] |
| X08 | Add | P0 | Migration preflight, mapping/exception report and portable-record exit story | Institutions evaluate conversion, support and continuity as well as screens. [Cross-cutting][cross], [LMS][lms] |
| X09 | Add | P0 | Plain-language trust panel with planned accessibility/privacy/security work and no certification badges | FERPA is a legal framework; HECVAT/VPAT are not certifications; external assurance is buyer-specific. [Compliance][compliance] |
| X10 | Add | P1 | Optional AI draft-feedback preview with source context, edit/accept/discard and no automatic release | Reviewable assistance is a proposed experiment; incumbents already ship AI, and benefit is unproven. [AI research][ai] |
| X11 | Add | P0 | Institution/course/assignment AI controls, disabled state, learner-visible permitted/limited/prohibited/disclosure-required policy and honest provider/data-use disclosure | Faculty choice, data purpose and human review matter more than an AI label. [AI research][ai] |
| X12 | Tone down | P0 | Remove blanket “no AI on student work” alongside future AI, and unconditional “never used to train” claims | State the intended policy and disable controls; actual provider/data terms still require contracts. [AI research][ai] |
| X13 | Tone down | P0 | Remove invented partner colleges/team geography, dated gates, unowned email/domain links and unsupported QA assertions | Neither the research nor prototype proves customers, partnerships, contact ownership or tested conformance. [Baseline][baseline], [Synthesis][synthesis] |
| X14 | Tone down | P0 | Present SIS/IdP/scheduler brands as intended connection targets, not existing certified partnerships | Exact versions, permissions, objects, licensing and standards conformance need validation. [Standards][standards] |

## 8. Promoted domain: student success and advising

There is no current advising/referral screen. Grades and calendar provide course context to reuse; they do not establish a student-success service. [Baseline][baseline]

| Gap ID | Treatment | Priority | Showcase decision | Research reason |
| --- | --- | --- | --- | --- |
| A01 | Keep | P1 | Observable assignment and appointment context as the start of a help request | Course activity can connect a student to a human service without diagnosing the student. [Advising][advising] |
| A02 | Add | P0 | Student support directory with service eligibility, appointment/request route and sharing explanation | A service cannot help when students cannot find it or understand the handoff. [Advising][advising] |
| A03 | Add | P0 | Course concern → named referral owner → accepted/in-progress/resolved timeline | Closed-loop ownership is the recommended later-domain opportunity. [Advising][advising] |
| A04 | Add | P1 | Adviser preparation view with limited relevant course context and authoritative degree-plan link/timestamp | Conflicting or stale records should remain attributable; audit output is not graduation clearance. [Advising][advising] |
| A05 | Add | P1 | Support queue with capacity, waiting/unassigned state and correction/retraction | More alerts do not create human service capacity. [Advising][advising] |
| A06 | Tone down | P0 | Avoid risk scores, automatic intervention claims and diagnosis/clinical/conduct narratives | Privacy, bias and authority risks require separate validation; the research recommends transparent handoffs first. [Advising][advising] |
| A07 | Modify | P0 | Show advising as a later connected experience in the roadmap, not an existing launch service | Final vision can include it without misrepresenting present maturity or first release. [Synthesis][synthesis] |

## 9. Wider campus scope and the story around the screens

| Gap ID | Treatment | Priority | Showcase decision | Research reason |
| --- | --- | --- | --- | --- |
| W01 | Add | P0 | A simple map of teaching, campus coordination, support and connected specialist systems | “One platform” should explain shared work and boundaries; it is not a new category claim. [Landscape][land], [Synthesis][synthesis] |
| W02 | Add | P1 | Compact service launch points for library, careers, housing and accounts | A unified experience can include specialist services without pretending to replace their records. [Landscape][land] |
| W03 | Tone down | P0 | Do not turn payroll, aid, clinical records, parking enforcement or library circulation into invented native modules | The landscape ranks these as integration/partner boundaries for the foreseeable roadmap. [Landscape ranking][ranking] |
| W04 | Modify | P0 | Lead with problem → product → real tasks; move tokens/specifications/decision logs out of the public story | The research's differentiator is coherent task completion, not internal design-system completeness. [Synthesis][synthesis] |
| W05 | Add | P0 | A few sourced problem statements and a fair approach comparison | Pain evidence is limited; no prevalence, universal superiority or cost-saving estimate is justified. [Pain register][pains], [Synthesis][synthesis] |
| W06 | Add | P0 | Product-vision/sample-data label, delivery sequence without dates, and an honest conversation CTA | Viewers need to understand what is planned and what action is actually possible today. [Cross-cutting][cross] |
| W07 | Tone down | P2 | Leave full design-system explorer, alternate logos and presentation mode out of the main page | They are useful internal material but distract from the final-product story; v1 remains archived. [Synthesis][synthesis] |

## 10. Content and demonstration guardrails

Every depicted capability is part of an interactive **product vision**, not evidence of a live service. Keep fictional campus names, people, course sizes and scores clearly within sample UI. Never place those values in customer, traction, benchmark or savings claims. No school logos, partner testimonials, pricing promises or certification emblems will be added.

The page will distinguish what Whiteboard is intended to own from connected institutional authority. Planned SIS targets and standards are not installed integrations. AI output is authored demo content; no model call or private data transfer is needed. Trust copy describes requirements and intended controls, not achieved legal compliance.

Market facts will be few, linked to direct sources already preserved by the research. The page should show proposed behavior more often than it describes incumbent failures. Unknown cells in the research matrices cannot become competitor ❌ marks. The showcase itself will remain offline-capable and contain no fake outbound form submission.

## 11. Decisions resolved for the design plan

Proceed with the existing teal/paper visual identity, a consistent Whiteboard name, a public-facing narrative, 40 planned screen workspaces and six connected local tours. Retain the original fictional campus scenario; do not carry over its Moodle-only assumptions, invented real-team facts or prototype defects. The detailed section/screen mapping and implementation gates are in [02_design_plan.md](02_design_plan.md).

**Approval checkpoint:** stop after the two planning documents. No archive, branch switch, showcase HTML edit, deployment or build-stage commit occurs before the user's OK.

[audit]: ../docs/Pellwin-Functional-Audit.md
[inventory]: ../docs/Pellwin-State-and-Control-Inventory.md
[baseline]: ../research/00_baseline/current_build.md
[synthesis]: ../research/synthesis.md
[lms]: ../research/01_lms/opportunities.md
[rooms]: ../research/02_scheduling_rooms/opportunities.md
[events]: ../research/03_events_clubs/opportunities.md
[eventsnotes]: ../research/03_events_clubs/notes.md
[cross]: ../research/04_cross_cutting/opportunities.md
[standards]: ../research/04_cross_cutting/integrations_standards.md
[compliance]: ../research/04_cross_cutting/compliance_security.md
[requirements]: ../research/04_cross_cutting/requirements.csv
[ai]: ../research/04_cross_cutting/ai_features.md
[land]: ../research/05_landscape_missing/opportunities.md
[ranking]: ../research/05_landscape_missing/priority_ranking.csv
[advising]: ../research/06_student_success_advising/opportunities.md
[competitors]: ../research/data/all_competitors.csv
[pains]: ../research/data/all_pain_points.csv
