# Accessibility and inclusion for a US higher-ed course web app

As of: 15 November 2026

Scope: legal baseline, who is affected, where existing LMSs fail, and what that means for Whiteboard screens. Legal points are research notes, not legal advice. Several secondary sources were used where the primary page blocked fetching; each is flagged.

## Key takeaways

- **The legal bar is WCAG 2.1 AA, and the dates moved.** DOJ's April 2026 interim final rule pushed the ADA Title II web deadline to 26 April 2027 (public entities with 50,000 or more people) and 26 April 2028 (smaller entities and special districts). Public universities are treated as covered. Build to WCAG 2.2 AA anyway: it is a superset of 2.1 AA (minus the obsolete 4.1.1), and the 2.2 additions hit LMS patterns directly.
- **One in five undergraduates has a disability, and about half are invisible to the disability office.** NCES: 20.5% of undergraduates in 2019-20. EDUCAUSE 2025: 24% self-report, and only 47% of those are registered with the accessibility office. Accessibility must be the default, not an accommodation you request.
- **Existing LMSs fail at the same places: quizzes, grading tools, rich editors, custom keyboard shortcuts, and math.** Whiteboard's riskiest screens are therefore its core ones: timed quizzes, TA grading, and feedback reading.
- **Cognitive and executive-function load is the larger, under-served half of "accessibility".** Concentration difficulty is part of NCES's own definition of disability. The best-supported design moves are plain language, one clear next action, visible deadlines, no data loss, and calm status.
- **Evidence is thin in three areas you care about:** handwritten-work grading for blind users, autistic students' LMS experience, and dark-mode benefit. Treat those rules as hypotheses to test.

## 1. The legal and standards baseline

### ADA Title II web rule (2024), as extended in 2026

What it is: DOJ's 2024 rule makes WCAG 2.1 Level AA the technical standard for web content and mobile apps of state and local governments, including content provided through contractors ([ADA.gov rule page](https://www.ada.gov/resources/2024-03-08-web-rule/)). Public colleges and universities are state or local entities.

Compliance dates (verified against the Federal Register notice text via [govinfo, 91 FR, 20 April 2026](https://www.govinfo.gov/content/pkg/FR-2026-04-20/html/2026-07663.htm), the [ADA.gov first-steps page](https://www.ada.gov/resources/web-rule-first-steps/) and the [Federal Register API record 2026-07663](https://www.federalregister.gov/api/v1/documents/2026-07663.json?fields[]=abstract&fields[]=dates)):

| Entity | Original date (2024 rule) | Current date (April 2026 interim final rule) |
|---|---|---|
| Population 50,000 or more | 24 April 2026 | **26 April 2027** |
| Population under 50,000, and special district governments | 26 April 2027 | **26 April 2028** |

Notes:

- Population uses the 2020 decennial Census and is the population of the government the entity belongs to. Student enrollment does not count ([ADA.gov first steps](https://www.ada.gov/resources/web-rule-first-steps/)). A state university system normally rides on the state's population, so it falls in the 50,000+ tier [est; confirm with each school's counsel].
- Source discrepancy: the Federal Register API summary I fetched gave the original larger-entity date as "April 26, 2026". The govinfo text and law-firm summaries give 24 April 2026 ([Plante Moran](https://plantemoran.com/explore-our-thinking/insight/2026/04/doj-extends-ada-title-ii-web-accessibility-compliance-deadlines)). The original date no longer matters; the new dates agree across sources.
- The interim final rule took effect 20 April 2026. Comments closed 22 June 2026. DOJ's stated reasons: it "overestimated" entities' capacity, generative AI cannot yet reliably remediate at scale, and there is uncertainty about standards. DOJ says it may issue a proposed rule on the substance during the extension, but expects to apply the rule on the new dates if nothing else changes ([govinfo](https://www.govinfo.gov/content/pkg/FR-2026-04-20/html/2026-07663.htm)). I could not find a later change as of this date; check the Federal Register again before launch.
- The extension does not suspend the existing duty of effective communication and nondiscrimination ([Plante Moran](https://plantemoran.com/explore-our-thinking/insight/2026/04/doj-extends-ada-title-ii-web-accessibility-compliance-deadlines)). Private lawsuits remain possible, and DOJ itself cites that litigation risk.
- Exceptions are narrow: archived content, preexisting conventional documents (PDF, Word and similar) that are not used to access services, third-party content, individualized password-protected documents, preexisting social posts. Even when an exception applies, an accessible format must still be provided to a person who needs it ([ADA.gov first steps](https://www.ada.gov/resources/web-rule-first-steps/)).
- DOJ's 2023 proposal had specific course-content exceptions. They were dropped in 2024, and DOJ says the extension will help it clarify them; it does not commit to restoring them ([govinfo](https://www.govinfo.gov/content/pkg/FR-2026-04-20/html/2026-07663.htm)). Practical reading: a password-protected course is not safely exempt, so assume course content is in scope [est].
- Conforming alternate versions (a separate "accessible site") are allowed only in very limited cases. Do not plan an "accessible mode" as the compliance path ([ADA.gov rule page](https://www.ada.gov/resources/2024-03-08-web-rule/)).
- Undue burden and fundamental alteration defenses exist but are decided case by case ([ADA.gov rule page](https://www.ada.gov/resources/2024-03-08-web-rule/)). A vendor cannot lean on them lightly.

Who this binds: the rule is Title II, so it covers public institutions. Private colleges fall under Title III, which has no web-specific regulation, but WCAG is the benchmark in practice [est; I did not verify this in a primary source in this pass]. Whiteboard will likely be sold to both, so design to the stricter standard.

### Section 504 and Section 508

- **Section 504 (HHS rule):** HHS's 2024 Section 504 rule also adopts WCAG 2.1 AA for recipients of HHS funding. Its dates were extended in May 2026: recipients with 15 or more employees to 11 May 2027, smaller recipients to 10 May 2028 ([Reed Smith summary](https://www.reedsmith.com/our-insights/blogs/health-industry-washington-watch/102mvp8/ocr-extends-digital-accessibility-compliance-dates-under-section-504/); [Federal Register, 11 May 2026](https://www.govinfo.gov/content/pkg/FR-2026-05-11/html/2026-09266.htm)). Relevance: universities with HHS-funded programs (medical, nursing, research hospitals) are recipients. Treat it as a second reason for the same standard. I did not read the Federal Register text in full; the dates come from law-firm summaries and the notice headline.
- **Section 508:** binds federal agencies' own ICT and federal procurement. It matters here mainly because buyers ask for a **VPAT** (Voluntary Product Accessibility Template), the vendor's self-reported conformance report. Expect every school to request a current VPAT or ACR (Accessibility Conformance Report) from Whiteboard. Plan to produce one from real testing, not a self-grade.

### WCAG 2.2 additions that matter most in an LMS

Source for all rows: [W3C "What's new in WCAG 2.2"](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/). The "LMS pattern" column is my mapping.

| Criterion (level) | What it requires | LMS pattern at risk |
|---|---|---|
| 2.4.11 Focus Not Obscured, Minimum (AA) | A focused element is not fully hidden by sticky content | Sticky headers, sticky "Submit" bars, cookie or chat widgets covering the focused field in long quizzes and gradebooks |
| 2.5.7 Dragging Movements (AA) | Anything done by dragging also works with a single click or tap | Drag-to-reorder questions, matching or ordering quiz items, kanban-like to-do boards, calendar event dragging |
| 2.5.8 Target Size, Minimum (AA) | Targets at least 24 by 24 CSS px (or spacing or other exceptions) | Dense gradebook cells, rubric level buttons, row actions, calendar chips on phones. AAA is 44 by 44 px ([Make It Fable summary](https://makeitfable.com/article/wcag-2-2/)); aim for 44 on touch |
| 3.2.6 Consistent Help (A) | Help in the same place on every page | A "Get help" link that moves between student, TA and instructor views |
| 3.3.7 Redundant Entry (A) | Do not make users re-enter info already given in the same process | Re-typing section, course code, or answers when a late-start quiz restarts or a form errors |
| 3.3.8 Accessible Authentication, Minimum (AA) | No cognitive-function test to log in unless an alternative exists; paste and password managers must work | Blocking paste, image CAPTCHAs, one-time codes the user must transcribe with no copy or autofill option ([practical checklist: Somerset playbook](https://playbook.somerset.gov.uk/accessibility/whats-new-in-wcag-2-2)) |

Also relevant from WCAG 2.x, not new:

- **2.2.1 Timing Adjustable (A):** time limits must be turnable off, adjustable (to at least 10 times the default), or extendable (a warning and at least 20 seconds to extend, repeatable 10 times), with exceptions for real-time events and essential limits. W3C explicitly allows a third party to control the limit, with extra test time as the example ([W3C Understanding 2.2.1](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html)). This is the standards basis for per-student time multipliers on Whiteboard quizzes.
- **1.4.1 Use of Color (A):** color cannot be the only way to convey status. About 1 in 12 men have color vision deficiency ([NEI](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness)).
- **2.3.3 Animation from Interactions (AAA):** non-essential motion from interactions can be turned off. Technique: the CSS `prefers-reduced-motion` query ([W3C Understanding 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)). It is AAA, so not legally required, but cheap to honor.

## 2. How many students, and the registration gap

- **NCES (primary, federal):** in 2019-20, 20.5% of undergraduates (about 3.48 million of 16.94 million) had a disability under NPSAS:20 ([NCES Digest Table 311.10](https://nces.ed.gov/programs/digest/d22/tables/dt22_311.10.asp)). About 11% of postbaccalaureate students ([NCES Fast Facts](https://nces.ed.gov/fastfacts/display.asp?id=60)). The table's definition is four self-reported difficulty types: hearing, vision, concentrating or making decisions, and walking or stairs. The table gives no breakdown by type, so I am not citing a type split. The survey is self-report and from 2019-20, before the pandemic-era rise in disclosed mental health conditions.
- **EDUCAUSE 2025 Students and Technology Report:** 24% of students reported a disability or impairment (19% in 2023). **Only 47%** of those had registered with their institution's accessibility office. Off-campus and working students were less likely to register ([EDUCAUSE report library page, via search summary](https://library.educause.edu/resources/2025/4/2025-educause-students-and-technology-report); [summary with the figures](https://poetsandquantsforundergrads.com/news/students-demand-more-than-just-wi-fi-report-highlights-gaps-in-tech-integration-career-readiness/)). Sample: more than 160 institutions and nearly 40,000 undergraduates, per a secondary summary. Caveat: I could not open the primary EDUCAUSE page (HTTP 403); the figures come from search summaries that agree with each other.
- **Older gap evidence:** a PNPI fact sheet reports about 8% of students registered with their institution as having a disability in 2019-20 (via search summary; I could not read the PDF). Compare with NCES's 20.5% self-reported. The two measure different things, so the exact gap is not a clean subtraction, but the direction is robust [est: roughly a third to a half of students with disabilities are unregistered, depending on the source].
- **Reasons students do not register** are covered in EDUCAUSE's 2020 report ([Unregistered and underserved](https://www.educause.edu/ecar/research-publications/student-technology-report-supporting-the-whole-student/2020/accessibility-and-accommodations/unregistered-and-underserved)). I could not open it (403), so I do not quote findings.

Implication: if accessibility lives behind an accommodation letter, about half the people who need it will not get it. Quiz extra time is the one place where registration is unavoidably involved, so that flow needs special care (section 8).

## 3. What existing LMSs get wrong

Evidence quality: mostly institutional audits, vendor reports and a few forum threads. I found no peer-reviewed head-to-head screen-reader study of Canvas, Blackboard and Moodle.

- **Blackboard, audited:** a Massachusetts state audit of UMass Boston found 44 of 59 Blackboard student features tested (75%) were not accessible ([Mass.gov audit finding](https://www.mass.gov/info-details/university-of-massachusetts-boston-finding-2), via search summary; the page returned 403 to me). Single institution, and the university was moving to Canvas.
- **Canvas, faculty-facing:** a University of Washington report from a blind faculty member who has tested Canvas with JAWS since 2012 says updates often do not improve, and sometimes break, screen-reader access to instructor pages, and flags custom keyboard commands that collide with screen-reader commands ([UW ResearchWorks paper, via search summary](https://digital.lib.washington.edu/researchworks/bitstreams/311fe66d-7b30-473e-8c2c-021a6185713d/download); I could not extract the PDF text, so details are secondhand). One user, but the regression pattern is a useful warning: **instructor-side tools get the least accessibility attention.** Whiteboard's TA and instructor screens are the dense ones.
- **Canvas quizzes:** Northwestern's guidance acknowledges known screen-reader and keyboard barriers in New Quizzes and recommends Classic Quizzes and avoiding some question types ([Northwestern Canvas guidance](https://canvas.northwestern.edu/courses/1580/pages/canvas-lms)). A Canvas community thread reports NVDA problems with New Quizzes ([Canvas Community](https://community.canvaslms.com/t5/New-Quizzes-Discussion/Issues-with-NVDA-screen-reader-and-New-Quizzes/td-p/592702)). Anecdotal.
- **Other documented issues:** heading levels out of order ([Wisconsin evaluation](https://kb.wisc.edu/accessibility/107460)); parts not usable by keyboard and unlabeled analytics ([Manchester accessibility statement](https://www.itservices.manchester.ac.uk/uom-accessibility-statements/canvas-learning-management-system/)). A rich-text editor that does not announce expansion is a known Canvas gap.
- **Moodle:** vendor-commissioned conformance reports (WCAG 2.2 AA) disclose partial support, for example an autocomplete widget whose deletions are conveyed visually only ([Moodle VPAT](https://docs.moodle.org/503/en/VPAT)). Self-reported.
- **Literature review:** a 2024 Springer chapter says most studies find serious WCAG barriers in LMSs including Moodle, Blackboard, ATutor and Sakai ([Springer chapter](https://link.springer.com/chapter/10.1007/978-3-031-60049-4_12)); I read only the abstract-level summary, and its sources are older.
- **Grading tool (Gradescope):** the University of Wisconsin's evaluation found keyboard shortcuts do not work while a screen reader runs, some markup-toolbar buttons are unlabeled, and math was announced by JAWS but not NVDA ([Wisconsin Gradescope evaluation](https://kb.wisc.edu/154067)). The vendor claims WCAG 2.1 AA for staff grading tools but says accessibility may be limited within submissions themselves ([Leeds statement](https://desystemshelp.leeds.ac.uk/gradescope-accessibility-statement)).
- **General web baseline (not LMS):** 95.9% of home pages had detectable WCAG failures in 2026, led by low-contrast text (83.9%), missing alt text (53.1%) and missing form labels (51%). Pages that used ARIA averaged more errors (59.1 vs 42), correlational only ([WebAIM Million 2026](https://webaim.org/projects/million/)). Lesson: use native HTML controls first; ARIA is not a free pass.
- **What screen-reader users do:** in the WebAIM survey #10 (Dec 2023 to Jan 2024, 1,539 responses, uncontrolled sample), 71.6% navigate long pages by headings first, 3.7% by landmarks. CAPTCHA was the top problem item, followed by widgets (menus, tabs, dialogs) that do not behave as expected and bad alt text ([WebAIM survey #10](https://webaim.org/projects/screenreadersurvey10/)). Heading structure is the main map.

Pattern across sources: core navigation is usually workable; **quizzes, grading, editors, custom widgets and custom shortcuts** are where it breaks. Those are exactly Whiteboard's differentiators.

## 4. Math, PDFs and handwritten work

- **Math:** MathML conveys structure so screen readers can navigate inside an expression. MathJax can render LaTeX or MathML into an accessible form. Equations as images or scanned PDFs leave blind students without the content ([summary of practitioner guidance: CUNY toolkit](https://pressbooks.cuny.edu/accessibilitytoolkit/chapter/stem/); [Syracuse guide](https://itsaccessibility.syr.edu/accessible-course-content/making-stem-content-accessible/)). A 2025 Swedish MTM test found NVDA, JAWS and VoiceOver all support MathML on Windows and iOS or macOS ([MTM](https://www.mtm.se/en/recommendations-for-stem-users/), via search summary). Support is uneven for complex expressions and for VoiceOver on macOS in some reports. The Wisconsin finding that JAWS announced Gradescope math but NVDA did not shows the same split.
- **Automated checkers** (for example Ally) have documented limits on complex STEM content ([Syracuse guide](https://itsaccessibility.syr.edu/accessible-course-content/making-stem-content-accessible/)). Do not treat a green score as accessible math.
- **PDFs:** PDFs keep math as flat alt text, so students cannot explore structure. Under the Title II rule, preexisting PDFs are exempt only if posted before the deadline and not used to access services ([ADA.gov first steps](https://www.ada.gov/resources/web-rule-first-steps/)). New instructor-uploaded PDFs after the deadline are in scope. Whiteboard cannot fix a bad PDF, but it can prompt for a text alternative at upload.
- **Handwritten and scanned student work:** I found no source on how a blind grader reads scanned handwriting, or how a blind student submits and gets feedback on handwritten work. This is a real evidence gap. Illinois frames Gradescope as "similar to grading paper" and handles access through individual plans ([Illinois](https://answers.uillinois.edu/121402)). Inference [est]: both sides need a non-visual path, such as typed or dictated submission, and feedback delivered as text, not only pen marks over an image.
- **Feedback as pen marks:** the Wisconsin evaluation (Gradescope) flags unlabeled markup toolbar buttons. Whiteboard's annotation tools will have the same trap unless every mark has a text twin (comment, score, location).

## 5. Neurodivergent students and executive-function-friendly design

Evidence is mostly practitioner guidance and conference papers, not trials. Be honest about that in design reviews.

- **Prevalence:** NCES's definition of disability includes "serious difficulty concentrating or making decisions" ([NCES Table 311.10](https://nces.ed.gov/programs/digest/d22/tables/dt22_311.10.asp)). I could not verify a national ADHD share for undergraduates from a primary source; a blog cites 15% for ADD or ADHD in 2019-20, which I do not rely on.
- **ADHD in online learning:** a *Journal on Technology and Persons with Disabilities* review organizes online strategies around executive function and focus ([Cal State repository PDF](https://dspace.calstate.edu/bitstream/handle/10211.3/223478/ID%2032_pgs%20249-265.pdf?sequence=1)). An Open University conference proposal notes difficulty sustaining attention through passive asynchronous material ([Open University](https://www.open.ac.uk/blogs/H890Conference/index.php/2024/03/20/adhd-and-the-vle-student-perspectives-and-improvement-strategies/)); it is a proposal, not results. Consumer guides link executive-function weakness to late or missed deadlines ([BestColleges](https://www.bestcolleges.com/blog/adhd-college-students/)). Consistent advice across sources: visible weekly schedule, checklists, reminders, and less reliance on willpower. Evidence that notification settings improve outcomes is advice, not tested effect.
- **Autism:** evidence is thin. A 2015 *Journal of Postsecondary Education and Disability* paper applies Universal Design to autistic postsecondary students ([Burgstahler & Russo-Gleicher, 2015](https://sites.uw.edu/sherylb/files/2020/08/BurgstahlerJPEDautism2015.pdf); I did not read its findings). An OLC abstract argues that online-course accommodations are often mismatched to autistic learners and that few accessibility trainings address them ([OLC session](https://conference.onlinelearningconsortium.org/node/7225)). Predictability and consistent structure are the most repeated recommendation, but from guidance pages, not studies.
- **The best-sourced framework:** W3C's cognitive accessibility guidance groups design into eight objectives: understand what things are, find what you need, clear content, avoid and fix mistakes, help users focus, do not rely on memory, provide help, support personalization ([W3C COGA "Making Content Usable"](https://www.w3.org/TR/coga-usable/)). This is a standards body consensus document, not a user study, but it is the right checklist.

What this means for Whiteboard's cycle: the "what do I do next, and by when" question should be answerable in one glance; errors should never lose work; status words must mean one thing everywhere (this overlaps the existing pain-point work in `research/01_lms/notes.md`, not repeated here).

## 6. Low bandwidth, old devices, shared devices

Evidence is old and secondary. I could not find a current EDUCAUSE or Pew number I could verify.

- A 2018 Learning House and Aslanian survey of online students found 67% did some coursework on a mobile device, and 45% accessed the LMS that way ([Campus Technology](https://campustechnology.com/articles/2018/06/19/two-thirds-of-online-students-do-some-coursework-on-a-mobile-device.aspx)). Online-student sample, dated.
- A 2013 NACS survey found 91% complete coursework on laptops ([eCampus News](https://www.ecampusnews.com/2013/04/23/survey-students-more-likely-to-do-coursework-on-smartphone-than-desktop/)); too old to lean on.
- Unreliable devices and connections concentrate among low-income, rural and some minority students (an academic paper reported secondhand, [IIIsci PDF](https://www.iiisci.org/Journal/PDV/sci/pdfs/SA328CM22.pdf)). Treat as direction, not a number.
- I found no evidence on shared device use (library labs, family laptops). Design assumption [est]: some students log in on shared or borrowed devices, so signing out cleanly, no sensitive data left on screen, and safe session timeouts matter.
- The 2025 EDUCAUSE report covers devices and connectivity, but I could not open it. Pull it before finalizing performance budgets.

Design consequence: a quiz or submission must survive a dropped connection (autosave, resume, honest "not yet saved" state), and the receipt is the trust anchor when the network is bad.

## 7. Language and plain language

- US higher ed hosted 1,177,766 international students in 2024-25, 6.1% of 19.2 million students ([Open Doors 2025 via ACE](https://www.acenet.edu/News-Room/Pages/Open-Doors-2025.aspx) and [IIE press release](https://www.iie.org/news/open-doors-2025-press-release/)); new international enrollment fell 17% in fall 2025. This understates English-language learners, who include many domestic students and multilingual residents. I found no reliable national figure for those.
- I found no study giving a target reading level for college LMS text. W3C COGA's guidance on plain language, short chunks and familiar terms is the standards-level source ([W3C COGA](https://www.w3.org/TR/coga-usable/)). WCAG's AAA reading-level criterion exists but I did not verify its wording here.
- Practical rule [est]: system words (status, buttons, errors) should be short, literal and identical everywhere; no idioms, no "oops". This also lowers the load for every role and survives machine translation.
- Interface language: the page language attribute is missing on 13.5% of home pages ([WebAIM Million 2026](https://webaim.org/projects/million/)). Screen readers mispronounce without it.

## 8. Color-only status, motion, dark mode

- **Color-only status:** WCAG 1.4.1 forbids it. About 1 in 12 men have color vision deficiency ([NEI](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness)). Low-contrast text is the single most common web failure (83.9%, [WebAIM Million 2026](https://webaim.org/projects/million/)). For Whiteboard this hits "Graded / Released / Late / Submitted" chips and calendar colors directly.
- **Motion:** respect `prefers-reduced-motion` ([W3C 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)). Countdown timers are a special case: the timer is information, so keep it but do not animate it, and never auto-announce every second to a screen reader (inference [est]).
- **Dark mode:** evidence is mixed and weaker than its popularity suggests. Piepenbrock et al. (2013, *Ergonomics*) found a positive-polarity (dark text on light) advantage for younger and older adults ([Taylor & Francis abstract](https://informahealthcare.com/doi/abs/10.1080/00140139.2013.790485)). Some people with cloudy ocular media (for example cataract) read better in dark mode; people with central vision loss were unaffected, in a seven-person Legge study as reported by a secondary source ([Pratt SI summary](https://ixd.prattsi.org/2020/09/assistive-technology-dark-mode/)). Astigmatism claims come from blogs and I could not verify them. Recommendation: offer both, default to the OS setting, and test contrast in both. Do not claim dark mode "is more accessible."

## Conflicts and tensions with current Whiteboard rules

- **Timed quiz windows and late starts vs WCAG 2.2.1.** Not a conflict, but a requirement: the window needs an accommodation path (per-student multiplier or extension) that the instructor controls. Be careful that a late start does not silently shorten a student's accommodated time.
- **Immutable receipts** are good for accessibility (a stable record), but they must be readable text with an unambiguous timestamp, not an image or only a toast.
- **TA scoped grading** means TAs use dense screens. Dense is where target-size and keyboard failures concentrate (see Gradescope findings).
- No finding contradicts "Graded is not Released". A blind or low-vision student should be able to tell the difference without color.

## Design implications for Whiteboard

1. **Target WCAG 2.2 AA for every screen, not 2.1 AA.** 2.1 AA is the legal minimum under Title II; 2.2 closes gaps in dragging, targets, focus, help and login. Roles: all. Evidence: [ADA.gov rule](https://www.ada.gov/resources/2024-03-08-web-rule/), [W3C new in 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/). Confidence: High.
2. **No "accessible mode" or separate accessible version.** Build one interface that works for everyone. Roles: all. Evidence: conforming alternate versions are allowed only in very limited cases ([ADA.gov](https://www.ada.gov/resources/2024-03-08-web-rule/)); half of students with disabilities are unregistered ([EDUCAUSE 2025 summary](https://poetsandquantsforundergrads.com/news/students-demand-more-than-just-wi-fi-report-highlights-gaps-in-tech-integration-career-readiness/)). Confidence: High.
3. **Plan for the Title II dates in sales material and the VPAT:** 26 April 2027 (50,000+) and 26 April 2028 (smaller). Do not state them as settled forever; DOJ may still revise. Roles: instructor, admin buyers. Evidence: [govinfo FR 20 Apr 2026](https://www.govinfo.gov/content/pkg/FR-2026-04-20/html/2026-07663.htm). Confidence: High on dates, Medium on stability.
4. **Every quiz time limit supports per-student adjustment set by the instructor,** and the late-start rule must recompute the student's own allowed time, not the class default. Show the remaining time as text with a way to pause announcements. Roles: student, instructor. Evidence: [W3C 2.2.1](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html). Confidence: High.
5. **Every drag interaction has a click or keyboard alternative** (reorder questions, matching items, calendar moves, rubric ordering). Roles: all. Evidence: [W3C 2.5.7](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/). Confidence: High.
6. **Minimum touch target 44 by 44 px on phones; never below 24 by 24 CSS px anywhere,** including gradebook cells, rubric levels and row actions. Roles: TA, instructor (dense screens), student on mobile. Evidence: [W3C 2.5.8](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/); AAA 44 px per [Make It Fable](https://makeitfable.com/article/wcag-2-2/). Confidence: High.
7. **Sticky bars (Submit, grading toolbar) must not cover the focused control,** including during keyboard tabbing through long quizzes and grading lists. Roles: student, TA. Evidence: [W3C 2.4.11](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/). Confidence: High.
8. **Login allows paste, autofill and password managers; no image or puzzle CAPTCHA; offer a non-transcription option** (magic link, passkey, SSO). Roles: all. Evidence: [W3C 3.3.8](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/), [Somerset checklist](https://playbook.somerset.gov.uk/accessibility/whats-new-in-wcag-2-2), CAPTCHA top screen-reader problem in [WebAIM #10](https://webaim.org/projects/screenreadersurvey10/). Confidence: High.
9. **Put the help link in the same place on every screen and every role.** Roles: all. Evidence: [W3C 3.2.6](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/). Confidence: High.
10. **Never ask a user to re-enter what they already gave** (join-course code, section, name, answers after an error or resume). Roles: student, instructor. Evidence: [W3C 3.3.7](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/). Confidence: High.
11. **Use native HTML controls and real headings first; add ARIA only for gaps.** Give every screen one H1 and an ordered heading outline. Roles: all. Evidence: heading navigation first for 71.6% of screen-reader users ([WebAIM #10](https://webaim.org/projects/screenreadersurvey10/)); ARIA pages had more errors ([WebAIM Million](https://webaim.org/projects/million/)). Confidence: High.
12. **Do not ship custom keyboard shortcuts in the grading screen that collide with screen-reader keys.** If shortcuts exist, make them remappable and off when a screen reader is detected or the user turns them off. Roles: TA, instructor. Evidence: [UW Canvas report](https://digital.lib.washington.edu/researchworks/bitstreams/311fe66d-7b30-473e-8c2c-021a6185713d/download) (secondhand), [Wisconsin Gradescope evaluation](https://kb.wisc.edu/154067). Confidence: Medium.
13. **Every status (Draft, Submitted, Late, Graded, Released, Missing) uses a text label plus an icon plus color,** never color alone, and "Graded" and "Released" are distinguishable without color. Roles: all. Evidence: [WCAG 1.4.1](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) and [NEI](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness). Confidence: High.
14. **Submission receipts are real text** with the submission time (including seconds and time zone), a receipt ID, and a copy button, not an image or only a toast. Announce the receipt to screen readers on submit. Roles: student. Evidence: inference from [COGA](https://www.w3.org/TR/coga-usable/) objectives 4 and 6. Confidence: Medium.
15. **Autosave answers and drafts, show an honest "saved / not yet saved" state, and resume after a dropped connection.** Roles: student. Evidence: [COGA objective 4](https://www.w3.org/TR/coga-usable/); device and connectivity gaps in [IIIsci](https://www.iiisci.org/Journal/PDV/sci/pdfs/SA328CM22.pdf) (weak). Confidence: Medium.
16. **Render math as MathML (via MathJax) from LaTeX input; never images of equations.** Provide a text alternative field when an image is unavoidable. Roles: instructor (authoring), student, TA. Evidence: [CUNY toolkit](https://pressbooks.cuny.edu/accessibilitytoolkit/chapter/stem/), [MTM](https://www.mtm.se/en/recommendations-for-stem-users/). Confidence: Medium (screen-reader support uneven, test with NVDA, JAWS and VoiceOver).
17. **Prompt for a text alternative at upload** (alt text for images, a note that PDFs should be tagged), and flag scanned-image PDFs. Roles: instructor, TA. Evidence: [ADA.gov first steps](https://www.ada.gov/resources/web-rule-first-steps/). Confidence: Medium.
18. **Every annotation or mark on graded work has a text equivalent** (comment text, location, points) available without the image, and the feedback screen reads in a logical order. Roles: TA, instructor, student. Evidence: [Wisconsin Gradescope evaluation](https://kb.wisc.edu/154067); handwritten-work gap noted above. Confidence: Low (evidence gap; test it).
19. **Offer a non-handwritten submission path** (typed or dictated answer) wherever the course allows it. Roles: student, instructor. Evidence: none direct; inference [est]. Confidence: Low.
20. **One primary next action per screen and a visible "due soon" list with exact dates,** not a color or scroll-only cue. Roles: student. Evidence: [BestColleges ADHD guide](https://www.bestcolleges.com/blog/adhd-college-students/), [Open University](https://www.open.ac.uk/blogs/H890Conference/index.php/2024/03/20/adhd-and-the-vle-student-perspectives-and-improvement-strategies/), [COGA objectives 2 and 5](https://www.w3.org/TR/coga-usable/). Confidence: Medium (advice-grade evidence).
21. **Keep the same words and the same place for the same thing across roles** (status names, button labels, help). Short literal words; no idioms. Roles: all. Evidence: [COGA objectives 1 and 3](https://www.w3.org/TR/coga-usable/); autism guidance on predictability ([OLC abstract](https://conference.onlinelearningconsortium.org/node/7225)). Confidence: Medium.
22. **Honor `prefers-reduced-motion` and keep animation optional;** the quiz countdown is shown, not animated, and not announced every second. Roles: all, student on timed quiz. Evidence: [W3C 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). Confidence: High for reduced motion, Medium for the timer announcement rule.
23. **Offer light and dark themes that follow the OS setting; test contrast in both;** do not market dark mode as an accessibility feature. Roles: all. Evidence: [Piepenbrock 2013](https://informahealthcare.com/doi/abs/10.1080/00140139.2013.790485), [Pratt SI summary](https://ixd.prattsi.org/2020/09/assistive-technology-dark-mode/). Confidence: Low-Medium.
24. **Set the page `lang` attribute and the document title on every route,** and move focus to the page heading on route change in the prototype. Roles: all. Evidence: missing `lang` on 13.5% of pages ([WebAIM Million](https://webaim.org/projects/million/)); focus handling is standard practice [est]. Confidence: High.
25. **Prepare a tested VPAT / ACR** (real testing with NVDA, JAWS, VoiceOver, keyboard-only, zoom to 400%) before any sale to a school. Roles: admin buyers. Evidence: [Moodle's VPAT as model](https://docs.moodle.org/503/en/VPAT); buyers' use of VPATs from [ADA.gov context](https://www.ada.gov/resources/web-rule-first-steps/) (vendors' content is in scope). Confidence: Medium.

## Open questions for user testing

1. Do any of the ~10 participants use a screen reader, magnifier, voice control, captions or extended-time accommodations? If not, recruit at least two assistive-technology users separately; five general participants cannot validate accessibility.
2. Student: "When do you open course software on your phone vs a laptop, and have you ever lost work to a bad connection or timeout?" Tests rules 14, 15.
3. Student with extra time: "How do you currently get extra time on a quiz, and what goes wrong?" Tests rule 4 and the late-start interaction.
4. TA and instructor: "Which keyboard shortcuts or fast actions do you rely on when grading, and would you give them up for screen-reader compatibility?" Tests rule 12.
5. Student: "Which words on this screen did you hesitate over?" (status chips, Graded vs Released, receipt). Tests rules 13, 21.
6. All: Show the status chips in grayscale and ask "what state is this item in?" Cheap test of rule 13.

## Sources

- [ADA.gov: Title II web rule](https://www.ada.gov/resources/2024-03-08-web-rule/)
- [ADA.gov: first steps / compliance dates](https://www.ada.gov/resources/web-rule-first-steps/)
- [Federal Register 2026-07663 (JSON record)](https://www.federalregister.gov/api/v1/documents/2026-07663.json?fields[]=abstract&fields[]=dates)
- [govinfo: 91 FR, 20 April 2026, DOJ extension](https://www.govinfo.gov/content/pkg/FR-2026-04-20/html/2026-07663.htm)
- [Plante Moran summary of DOJ extension](https://plantemoran.com/explore-our-thinking/insight/2026/04/doj-extends-ada-title-ii-web-accessibility-compliance-deadlines)
- [govinfo: HHS Section 504 extension, 11 May 2026](https://www.govinfo.gov/content/pkg/FR-2026-05-11/html/2026-09266.htm)
- [Reed Smith: OCR extends Section 504 digital accessibility dates](https://www.reedsmith.com/our-insights/blogs/health-industry-washington-watch/102mvp8/ocr-extends-digital-accessibility-compliance-dates-under-section-504/)
- [W3C: What's new in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [W3C Understanding 2.2.1 Timing Adjustable](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html)
- [W3C Understanding 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- [W3C COGA: Making Content Usable](https://www.w3.org/TR/coga-usable/)
- [Make It Fable: WCAG 2.2](https://makeitfable.com/article/wcag-2-2/)
- [Somerset playbook: What's new in WCAG 2.2](https://playbook.somerset.gov.uk/accessibility/whats-new-in-wcag-2-2)
- [NCES Digest Table 311.10](https://nces.ed.gov/programs/digest/d22/tables/dt22_311.10.asp)
- [NCES Fast Facts: students with disabilities](https://nces.ed.gov/fastfacts/display.asp?id=60)
- [EDUCAUSE 2025 Students and Technology Report](https://library.educause.edu/resources/2025/4/2025-educause-students-and-technology-report)
- [Poets&Quants summary of EDUCAUSE 2025](https://poetsandquantsforundergrads.com/news/students-demand-more-than-just-wi-fi-report-highlights-gaps-in-tech-integration-career-readiness/)
- [EDUCAUSE 2020: Unregistered and underserved](https://www.educause.edu/ecar/research-publications/student-technology-report-supporting-the-whole-student/2020/accessibility-and-accommodations/unregistered-and-underserved)
- [Mass.gov: UMass Boston audit finding 2 (Blackboard)](https://www.mass.gov/info-details/university-of-massachusetts-boston-finding-2)
- [UW ResearchWorks: Canvas screen-reader paper](https://digital.lib.washington.edu/researchworks/bitstreams/311fe66d-7b30-473e-8c2c-021a6185713d/download)
- [Northwestern Canvas guidance](https://canvas.northwestern.edu/courses/1580/pages/canvas-lms)
- [Canvas Community: NVDA and New Quizzes](https://community.canvaslms.com/t5/New-Quizzes-Discussion/Issues-with-NVDA-screen-reader-and-New-Quizzes/td-p/592702)
- [Wisconsin: Canvas evaluation](https://kb.wisc.edu/accessibility/107460)
- [Manchester: Canvas accessibility statement](https://www.itservices.manchester.ac.uk/uom-accessibility-statements/canvas-learning-management-system/)
- [Moodle VPAT](https://docs.moodle.org/503/en/VPAT)
- [Springer chapter: LMS accessibility review](https://link.springer.com/chapter/10.1007/978-3-031-60049-4_12)
- [Wisconsin: Gradescope accessibility](https://kb.wisc.edu/154067)
- [Leeds: Gradescope accessibility statement](https://desystemshelp.leeds.ac.uk/gradescope-accessibility-statement)
- [Illinois: Gradescope accessibility](https://answers.uillinois.edu/121402)
- [WebAIM Million 2026](https://webaim.org/projects/million/)
- [WebAIM Screen Reader Survey #10](https://webaim.org/projects/screenreadersurvey10/)
- [CUNY accessibility toolkit: STEM](https://pressbooks.cuny.edu/accessibilitytoolkit/chapter/stem/)
- [Syracuse: accessible STEM content](https://itsaccessibility.syr.edu/accessible-course-content/making-stem-content-accessible/)
- [MTM: recommendations for STEM users](https://www.mtm.se/en/recommendations-for-stem-users/)
- [Cal State repository: ADHD online learning review](https://dspace.calstate.edu/bitstream/handle/10211.3/223478/ID%2032_pgs%20249-265.pdf?sequence=1)
- [Open University: ADHD and the VLE](https://www.open.ac.uk/blogs/H890Conference/index.php/2024/03/20/adhd-and-the-vle-student-perspectives-and-improvement-strategies/)
- [BestColleges: ADHD in college](https://www.bestcolleges.com/blog/adhd-college-students/)
- [Burgstahler & Russo-Gleicher 2015](https://sites.uw.edu/sherylb/files/2020/08/BurgstahlerJPEDautism2015.pdf)
- [OLC: online learners with autism](https://conference.onlinelearningconsortium.org/node/7225)
- [Campus Technology: mobile coursework 2018](https://campustechnology.com/articles/2018/06/19/two-thirds-of-online-students-do-some-coursework-on-a-mobile-device.aspx)
- [eCampus News: coursework devices 2013](https://www.ecampusnews.com/2013/04/23/survey-students-more-likely-to-do-coursework-on-smartphone-than-desktop/)
- [IIIsci: device access paper](https://www.iiisci.org/Journal/PDV/sci/pdfs/SA328CM22.pdf)
- [ACE: Open Doors 2025](https://www.acenet.edu/News-Room/Pages/Open-Doors-2025.aspx)
- [IIE: Open Doors 2025 press release](https://www.iie.org/news/open-doors-2025-press-release/)
- [NEI: color blindness](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/color-blindness)
- [Piepenbrock et al. 2013 abstract](https://informahealthcare.com/doi/abs/10.1080/00140139.2013.790485)
- [Pratt SI: dark mode as assistive technology](https://ixd.prattsi.org/2020/09/assistive-technology-dark-mode/)

No prompt-injection instructions were seen in fetched pages.
