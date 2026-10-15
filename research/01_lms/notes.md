# LMS core market and product findings

As of 15 October 2026. This is desk research for US higher education, not a hands-on product benchmark. Source identifiers link to the full evidence register in [sources.md](sources.md). The [competitor map](competitors.csv) has 18 products; the [matrix](feature_matrix.csv) covers 23 capabilities across nine platforms. Unknown cells are research gaps, not absent features.

## Decision summary

Whiteboard needs a complete, trustworthy teaching cycle before it can replace a campus LMS. A clean interface alone does not solve migration, assessment-policy fidelity, support, accessibility or institutional identity. The present build supplies useful grading interaction design, not production LMS coverage. This is an analyst conclusion from the [local baseline](../00_baseline/current_build.md), incumbent documentation and institutional evaluations below.

The most credible differentiation hypothesis is a consistent student task model plus dependable faculty workflows and transparent migration. Both the grading wedge and the whole-campus ambition already have competitors. The research supports testing a narrow institutional segment and a real end-to-end product before attempting campus-wide breadth.

## Market map and ownership

Canvas is operated by Instructure, taken private by KKR/Dragoneer funds in a completed November 2024 transaction. Blackboard is now the rebranded standalone former-Anthology teaching business following March 2026 restructuring and divestitures. Do not group Engage or the sold SIS into Blackboard's current product family. [Instructure transaction](https://www.instructure.com/en-gb/press-release/kkr-and-dragoneer-complete-acquisition-instructure), [Blackboard restructuring](https://www.blackboard.com/news/blackboard-formerly-anthology-emerges-debt-free-and-focused) (LMS-01/02).

| Segment | Products examined | Why included |
| --- | --- | --- |
| Institutional teaching platforms | Canvas, Blackboard, Brightspace, Moodle | Principal practical replacement comparisons; vendor documentation and US purchasing evidence. |
| Open/community or managed options | Sakai, Open edX, Open LMS | Different governance, extensibility and operating models; do not count hosted Moodle as a separate underlying platform. |
| Challengers and unified colleges | CYPHER Learning, Populi | AI/competency positioning and integrated-college counterexample. |
| Required adjacent leads | Google Classroom, Schoology | Both screened; Google supports qualifying higher-ed institutions, whereas Schoology is positioned primarily around schools/districts. Neither gets an assumed major US higher-ed share. |
| Grading specialists | Gradescope, Crowdmark | Direct competition for the current handwritten workflow. |
| Teaching/engagement/AI extensions | Nectir, Top Hat, FeedbackFruits, Harmonize, Campuswire | Show which pains institutions address through integrations rather than a new LMS. |

Moodle project stewardship is distinct from Open LMS ownership: Open LMS belongs to LTG, which became private within General Atlantic in March 2025. Sakai is a community project under Apereo; Axim stewards Open edX. Schoology belongs to PowerSchool, acquired by Bain in October 2024. Ultimate ownership of some small specialist brands was not independently established and is explicitly unverified in the CSV. [LTG history](https://ltgplc.com/about/history-of-ltg/), [Sakai release](https://www.apereo.org/news/2025/sakai-250-here), [Axim](https://www.axim.org/about), [PowerSchool filing](https://www.sec.gov/Archives/edgar/data/1835681/000119312524230179/d94063dex991.htm).

### Adoption evidence and what it cannot tell us

An August 2026 Axiom Flow study classified 3,400 US institutions from an initial 5,291-record list using automated website searches. Its classified sample reports Canvas 53.4%, Blackboard 15.7%, Brightspace 13.3% and Moodle 12.6%. These are low-confidence proxies for population share: the denominator excludes unresolved records, classifications can be wrong, and institutions may use multiple platforms. They are stored with scope/confidence, not presented as a definitive October 2026 census. [Study and method](https://axiomflow.app/blog/lms-distribution-us-higher-education) (LMS-37).

D2L's current site advertises more than 1,400 customers globally across sectors. This is medium-confidence vendor-reported scale, not US higher-ed institutions, FTE or enrollment. Its CUNY selection announcement also names SUNY and other public systems, demonstrating institutional relevance without a new population estimate. [Product](https://www.d2l.com/brightspace/), [CUNY announcement](https://www.d2l.com/newsroom/the-city-university-of-new-york-cuny-selects-d2l-brightspace/) (LMS-12/13).

The public Edutechnica search material indicates continued concentration, but the opened tag page failed and the underlying data are paid. No dataset was purchased. Conflicting unsourced SEO market-share tables were excluded. We have sufficient evidence to prioritize incumbents, not a complete market-sizing model.

## Competitor deep dives

### Canvas

Canvas combines course delivery, assessments, feedback and a broad integration ecosystem. Native file/text/media submissions support diverse student work; grade import is more constrained than a full assessment export. The course-import workflow supports date adjustment but documents linked-file and grade-policy caveats. [Assignment documentation](https://community.instructure.com/en/kb/articles/660671-how-do-i-create-an-online-assignment), [Import documentation](https://community.instructure.com/en/kb/articles/662748-what-is-the-course-import-tool), [Grade CSV scope](https://community.instructure.com/en/kb/articles/660862-how-do-i-import-grades-in-the-gradebook).

Current Core/Plus/Next packaging separates advanced AI/analytics capabilities; do not call all advertised features base-license functionality. Mobile/offline reading exists, while older app reviews describe parity and notification-discovery friction. Whiteboard should test its proposed unified task list against current Canvas behavior rather than treating historical complaints as current bugs. [Tiers](https://www.instructure.com/products/canvas-tiers), [App listing/reviews](https://apps.apple.com/us/app/canvas-by-instructure/id480883488).

**Commercial example:** Mississippi University for Women has a one-year Canvas extension of $88,808.68 for 18 August 2026–17 August 2027 in the May 2026 IHL board book, PDF page 70. Confidence high for that scoped amount; it is not list pricing or a universal per-student benchmark. [Board book](https://www.mississippi.edu/sites/default/files/ihl/files/May%202026%20Board%20Book.pdf) (LMS-38).

**Assessment:** strong ecosystem and existing adoption make replacing Canvas expensive. Opportunity lies in objectively better task outcomes, honest error recovery and portability, not claiming Canvas has no scanning or assessment tools.

### Blackboard LMS and Ultra

The current product distinguishes core capabilities from premium options and includes design assistance, content, grading and integration workflows. Ultra modernization is still relevant to evaluating complaints: a report about Original or an early Ultra version is not a present capability matrix. [Capabilities](https://www.blackboard.com/products/teaching-and-learning/learning-effectiveness/blackboard-lms/capabilities), [Ultra transition](https://www.blackboard.com/blackboard-ultra) (LMS-08/09).

The University of South Carolina's July 2025 assessment recommended staying with Blackboard. Local sandbox results and the cost/effort of conversion explain why a rational institution may prefer its incumbent. This is a local evaluation, not proof Blackboard is universally more usable. [USC report](https://sc.edu/about/offices_and_divisions/faculty_senate/about/news/2025/lms_assessmentcommit_report.pdf) (LMS-40).

Forum accounts describe grading and navigation frustration, but contain mixed opinions and historical versions. No comparable current public institutional list price was verified. Whiteboard's competitive test must include experienced Blackboard users, not only people who dislike it. [Faculty discussion](https://www.reddit.com/r/Professors/comments/1f1st5y/blackboard_ultra/) (LMS-43).

### D2L Brightspace

Brightspace documents full course setup, content, assessment, discussion and rubric/gradebook workflows. Pulse is a learner companion for content, dates and alerts, with some tasks completed in the browser. Creator+, Performance+, Achievement+ and Link illustrate packaging around the core. [Instructor documentation](https://community.d2l.com/brightspace/kb/articles/25590-welcome-to-the-higher-education-instructor-knowledge-base), [Pulse](https://community.d2l.com/brightspace/kb/articles/16502-about-brightspace-pulse), [Product](https://www.d2l.com/brightspace/).

Faculty reports identify hidden menus and differences between deleting content and unlinking grades. Those are testable workflow hypotheses, not evidence of absent functionality. CUNY's selection supports system-scale relevance; enterprise prices remain quote-dependent in this collection. [Faculty experience](https://www.reddit.com/r/Professors/comments/1voikhj/brightspace_as_someone_coming_from_mostly_canvas/), [CUNY](https://www.d2l.com/newsroom/the-city-university-of-new-york-cuny-selects-d2l-brightspace/).

**Assessment:** preserve flexible grading without distributing a simple change across unrelated menus. A Whiteboard benchmark should include revise, unpublish, delete and restore, not only create an assignment.

### Moodle and managed Moodle

Moodle combines open-source control with rich assessment, collaboration, roles and extension mechanisms. Its free license is not free hosting, upgrades, support or integration work. An assignment can use file submissions and rubric evaluation. Managed Open LMS and MoodleCloud are commercial operating choices, not proof of different underlying feature sets. [Features](https://docs.moodle.org/501/en/Features), [Assignment](https://docs.moodle.org/500/en/Assignment), [Project](https://docs.moodle.org/500/en/About_Moodle), [Open LMS](https://www.openlms.net/about-us/).

MoodleCloud displays $160/year for 50 users through $2,090/year for 750 users in USD, while saying billing is in AUD; these small hosted packages are not institutional LMS quotes. Reviews identify configuration complexity and hosted-plan plugin constraints. [Plans](https://www.moodlecloud.com/standard-plans/), [G2 reviews](https://www.g2.com/products/moodle/reviews).

**Assessment:** scope the comparison to a maintained modern Moodle configuration. A poorly maintained theme/plugin installation cannot establish that the underlying project cannot provide a good experience.

### Sakai

Apereo's Sakai 25 release and the project's feature documentation establish an active higher-ed community platform with content, communication, assessment and rubric support. Source availability and community governance offer a different procurement/operating model; hosting and experienced administration still matter. [Release](https://www.apereo.org/news/2025/sakai-250-here), [Features](https://qa1-us.nightly.sakaiproject.org/library/content/gateway/features.html).

Current US adoption, native mobile parity and institutional support pricing were not established. The feature page comes from a nightly gateway, so a production version/service provider must be checked before claiming a guaranteed deployment feature. **Assessment:** useful architecture/governance comparator, not a presumed fastest-growing replacement.

### CYPHER Learning

CYPHER positions itself around AI-assisted course construction, competency mapping and personalized learning; its higher-ed page also describes assignment types and Safe Exam Browser integration. This is a meaningful challenger to the claim that incumbents alone offer full platforms, but vendor marketing is not proof of US university deployment depth. [Higher-ed product](https://www.cypherlearning.com/solutions/higher-ed-lms).

Current institutional price, named US system-scale deployments and several workflow details remain unverified. **Assessment:** include in discovery interviews and product comparisons; do not copy AI outcomes or customer totals into a business case without validating scope and methodology.

### Populi

Populi already combines college SIS, LMS and administrative functions. Its teaching tools include assignment submission, rubrics, tests and discussions; its wider offering connects admissions, aid, accounts and advancement. This is a direct counterargument to Whiteboard's one-system novelty, particularly in small-college segments. [Features](https://www.populi.co/features/).

Its public model is $199/month plus $9/month per billable student, where a student takes at least one course in that month. Implementation/support are included; usage overages and third-party charges may apply. This is not FTE pricing. [Pricing](https://www.populi.co/pricing/) (LMS-23).

**Assessment:** validate the desired segment carefully. Large-campus specialization may be a gap, but cannot be assumed from the presence of a simple public price. Test whether Whiteboard can offer meaningfully better integrated workflows and institutional trust.

### Google Classroom and Schoology screening

Google offers no-charge Fundamentals for qualifying institutions and displays Education Plus at $6/user/year. That is Workspace suite pricing with eligibility/licensing rules, not a complete university LMS tender price. Classroom is a valuable low-friction workflow reference; comprehensive higher-ed assessment/admin parity is not established by this evidence. [Google editions](https://edu.google.com/workspace-for-education/editions/compare-editions/).

Schoology's current product positioning emphasizes schools, districts and family participation. Keep it in the map, but avoid a K-12-first design driving university role structures, student autonomy or institutional record requirements. Its PowerSchool/Bain ownership is verified; no major US higher-ed customer count or numeric enterprise price is asserted. [Schoology](https://www1.powerschool.com/global/middle-east-africa/schoology-learning/), [Ownership](https://www.sec.gov/Archives/edgar/data/1835681/000119312524230179/d94063dex991.htm).

## Specialist tools and newer AI positioning

Gradescope directly overlaps the present Whiteboard prototype: paper/digital/code grading and rubric changes applied to prior grading are marketed capabilities. AI answer grouping has institutional packaging boundaries. Crowdmark offers quote-led course/annual subscriptions in the same assessment-adjacency category; no universal numeric price was verified. [Gradescope](https://www.gradescope.com/splash), [Ownership](https://www.gradescope.com/tos), [Crowdmark pricing](https://www.crowdmark.com/request-pricing/).

Nectir supplies course-grounded assistants through LTI/SSO inside existing LMSs; it is an AI layer, not evidence of a new full registrar-backed LMS. Top Hat links participation/content to LMS grades, while FeedbackFruits and Harmonize specialize in pedagogical activity and discussion. Campuswire emphasizes course communication. These show that integration can already provide a coherent entry point without replacing every specialist. [Nectir](https://www.nectir.io/blog/introducing-lms-embed-access-nectir-ai-assistants-right-within-your-lms-with-lti), [Top Hat](https://tophat.com/features/), [FeedbackFruits](https://feedbackfruits.com/all-integrations), [Harmonize](https://harmonizelearning.com/), [Campuswire](https://campuswire.com/).

No unverified startup has been labeled a serious US institutional LMS winner. AI availability and contracts receive a dedicated current-release review in Domain 04. A headline AI feature does not establish learner benefit, safe grading or campus acceptance.

## Teaching workflow requirements

The following is our product analysis informed by incumbent documentation, the user-pain register and the [build audit](../../docs/Pellwin-Functional-Audit.md). It is not a claim that every institution needs identical policy.

| Workflow | Required product behavior | What our build currently supplies | MVP boundary |
| --- | --- | --- | --- |
| Create/provision a term course | Course/section/term identities, instructor/TA enrollment, student view and availability. | Fictional course/header and role selector. | Real identities and membership before pilot; one SIS integration rather than universal coverage. |
| Syllabus and organization | Accessible content, stable navigation, due-date linkage and publication state. | Course-home vision only. | Consistent course frame; structured weekly/module content with instructor flexibility inside it. |
| Author modules/materials | Reorder, prerequisites/release conditions, file/link/media handling and accessible alternatives. | Sample static materials. | Pages/files/links and simple publish/release; defer elaborate adaptive sequencing. |
| Assign work | Dates/timezones, points, groups/sections, accommodations, reference files, accepted formats. | Local inputs and question total. | Persistent validated records; clear due versus close dates. |
| Submit handwritten/PDF work | Capture/select, reorder/rotate, readable previews, question tags, resume, acceptance evidence. | Synthetic capture, real metadata check, disconnected review/receipt. | Make stored bytes/tags/receipt one transaction; no AI/OCR dependency. |
| Run quizzes/exams | Item bank, attempts, timing, autosave, accommodation, randomization, release and regrade rules. | Absent. | Basic accessible quiz types/attempts/autosave first; integrate specialist proctoring. |
| Grade with TAs | Scoped permissions, assigned/remaining queue, rubric versions, concurrent edits and comments. | Useful local rubric interface; wrong-question routing and circular queue. | Correct per-question state, audited writes, conflict detection and completion. |
| Operate gradebook | Points/categories/weights, missing/ungraded/excused, dropped scores and defensible totals. | Separate calculated concept. | One transparent calculation model, preview and change history. |
| Release feedback | Deliberate scope, no accidental zeros, per-student status and reconciliation. | Release-all ignored; fixed feedback. | Preview consequences, persist release state and retry integration safely. |
| Communicate | Announcements/discussions/messages and linked actionable notices with preferences. | Static examples/voice; no service. | Announcement + threaded course discussion + reliable task links; avoid parallel inboxes at first. |
| Plan student work | Combined deadlines, completed status and course/event timezones. | Today/calendar concepts. | One task model; course consistency without restricting pedagogy. |
| Support phone users | Submission and feedback parity, browser fallback and recoverable interruptions. | HTML device frames only. | Excellent mobile web first; native app justified by measured offline/device needs. |
| Copy/roll over | Dry-run mapping, date shifts, links/assets/item banks/rubrics and permissions retained appropriately. | Absent. | Support an identified source format and provide an exception report; no perfect-import promise. |
| Analyze learning | Define events/meaning; show helpful signals without pretending clicks measure learning. | Sample bars and no event service. | Transparent completion/activity reports; defer opaque risk scoring. |

Canvas documentation explicitly limits grade CSV transfer, and the institutional migration evaluation demonstrates why a visually successful course is not proof of a faithful conversion. Both support requiring round-trip tests for grades, files, rubrics and release rules. [CSV scope](https://community.instructure.com/en/kb/articles/660862-how-do-i-import-grades-in-the-gradebook), [USC assessment](https://sc.edu/about/offices_and_divisions/faculty_senate/about/news/2025/lms_assessmentcommit_report.pdf).

## User pain and competing interpretations

The [15-row pain register](pain_points.csv) preserves reporter/context/date, severity rationale and sampling limits. It includes faculty workflow friction, student discovery, mobile parity, conversion uncertainty, exam-version rubrics, migration and AI resistance. G2 mixes sectors; the app-store examples are historical and education level is not always known. Reddit identities and product configurations are unverified. One documented CSV limitation is separately labeled analyst implication rather than user testimony.

The same broad themes appear in different contexts, but this is not a representative survey. We cannot estimate how many faculty are dissatisfied, rank vendors universally or say every reported bug still exists. Favor task validation and counterevidence over accumulating angry comments. A focused faculty/student/admin interview round remains necessary.

## Pricing and switching economics

Do not combine open-source license prices, small hosted plans, Workspace suites, billable-student administration suites and negotiated LMS contracts into one range. They buy different things. The source register retains the scope, period and confidence of each figure.

Community College of Philadelphia's 2023 committee request proposed a five-year Canvas renewal totaling $1,475,880 for July 2023–June 2028, with opt-out after year three. It explicitly anticipated 18–24 months for a replacement transition and parallel systems. This is historical proposal evidence, not proof of execution or a universal migration schedule. [Committee agenda](https://www.myccp.online/sites/default/files/documents/BoardofTrustees/BusinessAffairsCommittee/2023/20230524_bac_agenda.pdf) (LMS-39).

**Commercial implication:** a cheaper license may still lose if conversion, accessibility tooling, support and instructor time are worse. A credible proposal should show a scoped total-cost model and migration/exit plan. Our pricing remains an untested decision; no invented Whiteboard price or savings claim is supplied.

## Recommendation and risks

Maintain the full LMS as the product direction. Validate a first segment where accessible course organization, handwritten assessment and student deadline clarity matter, and where a reference deployment can be supported. A grading integration remains a possible acquisition channel; it must win against specialist incumbents rather than being assumed unique.

An institutional LMS pilot needs real identity/membership, content, assignments, basic quizzes, correct grades/feedback, mobile submissions, communications, import/export and support. Campus-wide enterprise readiness adds extensive migration, analytics/records, security/accessibility evidence, resilience and procurement support. Do not reclassify prototype controls as completed roadmap work.

Largest risks: insufficient institutional trust; faculty adoption; a small team's inability to sustain assessment correctness/reliability; migration fidelity; selling to an undefined segment; creating a wider but shallower suite; and introducing AI before its value and governance are established. Domain 04 supplies verified purchase gates; the landscape will test the best adjacency.

## Research limits and next validation

No paid market report, product login, live demo, support-ticket dataset or customer interview was used. Public ownership and scoped price evidence are stronger than adoption or performance estimates. Capterra access failed; G2, app-store, Reddit and institutional evaluations were usable. Several matrix cells remain unknown by design.

Interview and benchmark tasks: students find next work across unfamiliar courses; faculty revise an existing graded assignment; TAs resolve competing grades; admins import a real anonymized course and reconcile gradebook outcomes. Obtain explicit permission before any real institutional data is transferred. Use synthetic material for initial product tests.
