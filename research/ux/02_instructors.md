# Instructors as users of course software

As of: 15 November 2026

Scope: faculty, adjuncts and lecturers who teach in US higher education. This file covers how they adopt course software, what it costs them in time and worry, and what that means for Whiteboard screens. It does not repeat the general LMS market notes in `research/01_lms/notes.md`.

A warning on the evidence. The strongest faculty-technology data is old (ECAR 2014 and 2017). Newer numbers often come from vendors (Cengage, D2L, iClicker). Forum posts (Canvas Community, Reddit) are self-selected: people write when something broke. I label each source below. I did not find peer-reviewed studies for several of the questions asked, and I say so where that is the case.

## Key takeaways

- **Most faculty use the basics, and are content with the basics.** The largest ECAR faculty study found most faculty use basic LMS functions and see unused potential, but satisfaction is highest for simple tasks such as posting content ([EDUCAUSE 2014](https://library.educause.edu/resources/2014/8/study-of-faculty-and-information-technology-2014); summary via the search index). So Whiteboard should make the basic path (post, collect, grade, release) fast and the rest optional. Do not assume instructors want more features.
- **Setup and copying each term is a real, repeated cost, and copy tools fail in predictable ways.** Date shifting, broken links and un-copied groups are recurring forum complaints ([Canvas Community](https://community.canvaslms.com/t5/Canvas-Question-Forum/Dates-not-adjusting-when-using-adjust-dates-tool-when-copying/td-p/533222); [FIU](https://insider.fiu.edu/?p=4931); [Utah State](https://www.usu.edu/teach/help-topics/canvas/reusing-your-course.php)). A good "new term from last term" flow with a visible review list is a core Whiteboard journey.
- **Irreversible actions are the main source of fear, and current tools handle them badly.** Canvas defaults to showing grades as soon as they are entered, and some universities override that default because accidental release does more harm than delay ([Indiana University KB](https://www.kb.indiana.edu/d/beid), found via search; page could not be fetched directly). Faculty also ask for undo on curves and gradebook edits, and are told it does not exist ([Canvas Idea: Gradebook Reset/undo](https://community.canvaslms.com/t5/Canvas-Ideas/Gradebook-Reset-undo-function/idi-p/600690)). This supports the Whiteboard rule "Graded is not Released".
- **Rosters belong to the registrar, and instructors hit a wall.** In Canvas, an instructor usually cannot remove a student added by the student information system (SIS); the registrar or an admin must act, and a manual removal can be undone by the next overnight sync ([Canvas Community](https://community.canvaslms.com/t5/Canvas-Question-Forum/Teachers-not-able-to-Remove-Students-from-Courses/m-p/612509)). Whiteboard should show who owns each roster action and what to do next, not a dead button.
- **Evidence is thin on adjuncts, TA trust and attendance time cost.** I found no rigorous study on any of the three. Treat the design rules for them as hypotheses to test with the 3 instructors and 2 TAs.

## 1. LMS adoption and the "basics only" pattern

**What the data says.**
- The 2014 ECAR faculty study (151 institutions, 17,451 faculty, 13 countries) found that most faculty use basic LMS functions and recognise the systems could do much more ([EDUCAUSE, 2014](https://library.educause.edu/resources/2014/8/study-of-faculty-and-information-technology-2014)). It is a large sample but it is 12 years old and covers non-US respondents too.
- An Inside Higher Ed summary of that work reports 58 percent of faculty mainly used the LMS to store content such as lecture notes and the syllabus, while 41 percent used it to interact with students outside class ([Inside Higher Ed](https://www.insidehighered.com/node/60944)). I only saw this via a search snippet, not the full article.
- About three quarters of faculty were satisfied with simple tasks such as posting content, but opinion was split on collaborative features (same source).
- The 2017 ECAR faculty LMS section says three quarters or more of faculty used the LMS for common core purposes, and satisfaction had changed little over time ([EDUCAUSE 2017, LMS section](https://www.educause.edu/ecar/research-publications/ecar-study-of-faculty-and-information-technology/2017/lms)). I could not open that page (HTTP 403), so this comes from the search summary only.
- Campus Technology reported the same 2017 studies as showing students and faculty hold contrasting views of classroom technology ([Campus Technology, 2017](https://campustechnology.com/articles/2017/11/06/students-faculty-have-contrasting-views-of-classroom-technology-ecar-surveys-find.aspx)).

**What it means.** The "basics only" pattern is not laziness. Instructors have other work: Cengage's 2022 survey says they spend about 42 percent of their time on teaching, 31 percent on course preparation, 14 percent on admin and 13 percent on connecting with students ([Cengage Faces of Faculty 2022 press release](https://www.prnewswire.com/news-releases/is-the-great-resignation-coming-to-higher-education-new-cengage-research-shows-the-majority-of-college-faculty-are-satisfied-but-increasing-responsibilities-are-leaving-them-feeling-unsupported-undervalued-and-burnt-out-301635480.html)). That source is a vendor press release, fielded January 2022 with about 1,024 faculty at 581 US institutions, with no sampling method given. Use the proportions as a rough guide only.

**Inference [est].** If most use is "post content and enter grades", then the features that make Whiteboard different (TA scoping, release gating, receipts) must show up inside that basic path, not in a separate "advanced" area. Otherwise instructors will skip them.

**Where this is weak.** ECAR 2014 and 2017 pre-date the pandemic. Instructors now run more online and hybrid courses (Cengage: 77 percent said managing multiple course modalities has a significant impact on their role). Current usage depth may have risen. No source I found measures it for 2024 to 2026.

## 2. Time cost of course setup and copying a course

**What the data says.**
- Cengage reports 73 percent of faculty said they spent more time on online course setup ([search summary of the Cengage release](https://www.prnewswire.com/news-releases/is-the-great-resignation-coming-to-higher-education-new-cengage-research-shows-the-majority-of-college-faculty-are-satisfied-but-increasing-responsibilities-are-leaving-them-feeling-unsupported-undervalued-and-burnt-out-301635480.html)). The release text I fetched did not state this exact figure, so treat it as unverified. It is vendor-reported either way.
- Forum and teaching-centre sources show the typical failures when copying a course:
  - The "adjust dates" step fails with an error naming one assignment and shifts none of the dates ([Canvas Community](https://community.canvaslms.com/t5/Canvas-Question-Forum/Dates-not-adjusting-when-using-adjust-dates-tool-when-copying/td-p/533222)).
  - Due dates do not transfer ([Canvas Community](https://community.canvaslms.com/t5/Canvas-Question-Forum/Due-Dates-not-transferring-in-course-copy/m-p/512666)).
  - Quizzes and announcements keep old dates even when the course dates change (same search summary).
  - Links copied between course shells can point back to the old course, which new students cannot open ([FIU](https://insider.fiu.edu/?p=4931)).
  - Groups are not copied, and holidays and breaks need manual date edits ([Indiana University CTL](https://ctl.indianapolis.iu.edu/Teaching-Online/RegularMaintenance)).
  - Third-party tools can keep an "Until" date from the old course, which blocks new due dates ([Cengage help](https://help.cengage.com/cnowv2/instructor/common/tbs-due-date-sync.html)).
- Canvas offers a "Validate Links in Content" button that lists broken links, unpublished content and cross-course links ([Utah State](https://www.usu.edu/teach/help-topics/canvas/reusing-your-course.php)). It is a check the instructor must remember to run.

**Evidence quality.** These are self-selected forum posts and teaching-centre how-to pages. They show failure types that happen. They do not show how often they happen. I found no published measure of hours spent on setup per course per term.

**What it means.** The instructor's fear is not the copy itself. It is finding out in week 3 that a due date is last year's. The design question is how to make the result of a copy visible and checkable before students see anything.

## 3. Workload, burnout and adjunct constraints

**What the data says.**
- Cengage 2022 (vendor, about 1,024 faculty): 64 percent happy in their roles, 26 percent dissatisfied. Of the dissatisfied, 70 percent had considered a career change in the past six months. Top drivers: feeling unsupported or under administrative pressure (29 percent) and feeling undervalued or underpaid (28 percent). Some 61 percent said keeping up with student communication had a significant impact, and 52 percent spend more time communicating with students about class content ([Cengage release](https://www.prnewswire.com/news-releases/is-the-great-resignation-coming-to-higher-education-new-cengage-research-shows-the-majority-of-college-faculty-are-satisfied-but-increasing-responsibilities-are-leaving-them-feeling-unsupported-undervalued-and-burnt-out-301635480.html)). The release reports no validated burnout measure, despite the headline word "burnt out".
- Adjuncts were 18 percent of the Cengage sample, and the release gives no adjunct-specific results.
- A 2025 Liberty University dissertation surveyed 85 US adjuncts on workload, course format, pay, support and burnout, and found no statistically significant results ([Liberty Digital Commons](https://digitalcommons.liberty.edu/doctoral/7110)). A null result in a small, single-method dissertation sample tells us little either way.
- A 2025 Liberty dissertation interviewed 25 online adjuncts across two institutions and reported that clear expectations, a thorough LMS orientation and contact with support staff improved satisfaction and readiness ([Liberty Digital Commons](https://digitalcommons.liberty.edu/doctoral/6867)). It is qualitative and small.
- Adjunct access can be delayed by HR paperwork: one university help page says adjuncts can log into the student portal but not the LMS until an HR form is processed, and IT cannot add them by hand ([SLU help desk](https://ask.slu.edu/TDClient/30/Portal/KB/PrintArticle?ID=55)). Another source notes delayed course materials when instructors are hired close to the start of a seven-week term ([EDUCAUSE Review, 2013](https://er.educause.edu/articles/2013/10/the-faculty-readiness-website-preparing-instructors-and-building-community)).
- Every Learner Everywhere reports support for online adjuncts lags behind support for tenure-track faculty ([Every Learner Everywhere](https://www.everylearnereverywhere.org/resources/supporting-online-adjunct-faculty-across-institutional-roles/)).

**Gap.** I found no study on adjuncts who work at several institutions on different LMSs. That claim is common sense, not evidence. Cross-LMS memory cost is therefore an assumption [est]. I do expect it: a person who uses three systems will remember the idiosyncrasies of none of them.

**What it means.** Assume adjuncts arrive late (days before term, sometimes after), with little training, and with other LMSs open in other tabs. First-use clarity matters more for them than for anyone.

## 4. Grading load and feedback-writing time

**What the data says.**
- I did not find a recent, large, peer-reviewed survey of how much time US college instructors spend on feedback. The most-cited figure is from a 1966 study of high school English teachers that estimated roughly 9 to 12 hours a week responding to student writing, per a writing-instruction book (via search summary). It is old, not college, and I could not open it.
- Practitioner claims (for example 18 hours a week grading, or 20 minutes for a ten-page paper) appear in blogs without a traceable study. I do not rely on them.
- Boston University published a Spring 2025 workload survey with time on formative feedback by job title ([BU SP25 Workload Survey](https://www.bu.edu/wpnet/files/2026/04/SP25-Workload-Survey-quantitative-results.pdf)). The chart data did not yield averages I could cite. A single institution, so not generalisable.
- A self-selected Reddit complaint (r/AskProfessors, August 2024) says Canvas grading takes many clicks per student: enter a comment, update the score, move to the next student, about 60 clicks for a class of twenty ([r/AskProfessors thread](https://lr.eu.psf.lt/r/AskProfessors/comments/1f0dis0/what_are_your_issues_with_canvas)). One anecdote, via a mirror site, not verified.

**What it means.** Grading is the repeated, high-volume task. Per-student click cost and keyboard speed matter more than visual polish. This is a hypothesis [est] from workload logic plus one anecdote; test it with the grading screen.

**Related: grader consistency.** A 2024 arXiv study of programming assignments found human graders often disagreed with each other and with their own earlier marks, and that a shared rubric alone did not ensure consistency ([arXiv 2409.12967](https://arxiv.org/abs/2409.12967)). A 2026 Journal of Chemical Education study of graduate TA calibration found completion-based calibration did not improve accuracy but a threshold-based version did ([UMN experts page](https://experts.umn.edu/en/publications/asynchronous-grading-calibration-exercises-to-improve-graduate-te/)). Both are single-subject-area studies. They support instructor concern about TA grading quality, which is the other reason release gating matters.

## 5. Fear of mistakes: early release, wrong students, irreversible actions

**What the data says.**
- Canvas defaults to an automatic posting policy, so grades are visible as soon as they are entered. Indiana University overrides that default for most courses because unintended release does more harm than delayed release ([IU Knowledge Base, via search snippet](https://www.kb.indiana.edu/d/beid)). I could not fetch the page.
- Hiding under an automatic policy only hides grades already entered. Newly entered grades show at once. To hide past and future grades, the instructor must change the policy to manual ([UNH Canvas Grade Post Policies](https://td.usnh.edu/TDClient/60/Portal/KB/Article/1977/Canvas-Grade-Post-Policies)). This is a trap: the first rescue step does not fully work.
- A Canvas Community user reported a single student's grade posted although the column was hidden ([Canvas Community](https://community.canvaslms.com/t5/Question-Forum/Single-student-grade-was-posted-despite-column-being-hidden/m-p/191554)). One report, but it shows why instructors do not trust the hide state.
- Faculty ask for undo: a request to reset anything they "try out" in the gradebook, after a late-policy change they did not like; support said not possible ([Canvas Ideas: Gradebook Reset undo](https://community.canvaslms.com/t5/Canvas-Ideas/Gradebook-Reset-undo-function/idi-p/600690)). Another user found a curve irreversible ([Canvas Ideas: Curving of Grades](https://community.canvaslms.com/t5/Idea-Conversations/Curving-of-Grades/idi-p/510004)). Gradebook history lets users view earlier marks but not revert ([Canvas Ideas: Restore button](https://community.canvaslms.com/t5/Canvas-Ideas/Gradebook-History-Restore-Button/idi-p/632818)).
- I found no study that counts how often accidental grade release happens, or how it harms students. The evidence is that institutions act to prevent it, and that faculty request undo.

**Design science backing preview and confirmation.** Nielsen Norman Group's progressive disclosure guidance says hiding advanced settings helps novices avoid mistakes ([NN/g](https://www.nngroup.com/articles/progressive-disclosure/)). It does not directly test confirmation dialogs. Confirmation can become noise if overused [est]. So reserve confirmation for the few actions that cannot be reversed, and make the rest undoable.

**What it means.** Whiteboard's "Graded is not Released" is supported by this evidence. The extra rule: make Release a two-step action with a preview of what students will see and a count of who is affected, and say plainly whether it can be undone. Also decide whether release can be recalled. If it cannot, say so before the click. If it can, show the undo.

## 6. Communication with students

**What the data says.**
- Cengage 2022: 61 percent of faculty say keeping up with student communication has a significant impact on their role, and 52 percent spend more time communicating with students about class content ([Cengage](https://www.prnewswire.com/news-releases/is-the-great-resignation-coming-to-higher-education-new-cengage-research-shows-the-majority-of-college-faculty-are-satisfied-but-increasing-responsibilities-are-leaving-them-feeling-unsupported-undervalued-and-burnt-out-301635480.html)). Vendor source.
- A UMass Amherst report on email (349 faculty respondents) says faculty find email overwhelming, and after-hours messages from students and colleagues create feelings of "email invasion" ([UMass email report](https://websites.umass.edu/misra/files/2023/08/Email-final-report.pdf)). One institution.
- A 2006 EDUCAUSE survey (n = 257 faculty) found faculty received about 15 emails per week ([EDUCAUSE Review, 2008](https://er.educause.edu/articles/2008/2/email-in-academia-expectations-use-and-instructional-impact)). It is very old and predates smartphones and LMS inboxes; it should not be cited as current volume.
- Student side: a Westminster pilot (first-year life sciences, UK) found students averaged about 14 emails a week and nearly half found most not useful ([Westminster LTRC report](https://ceti.westminster.ac.uk/wp-content/uploads/sites/61/2020/06/LTRC-4-University-Communications-Lived-experiences-of-first-year-Life-Sciences-students-1.pdf)). A 2025 Times Higher Education piece reports that "overload" of university emails buries important ones and makes students disengage ([THE](https://timeshighereducation.com/news/students-feel-spammed-overload-university-emails)). Both are UK, and about university-wide email, not course announcements.
- I found no study on announcement overload within an LMS course, or on discussion moderation time.

**What it means.** The instructor is both a sender (worried about students ignoring announcements) and a receiver (worried about question floods). Whiteboard's announcement tool should help the instructor send fewer, clearer messages, and should point repeated questions to where the answer already lives. Both are hypotheses [est].

## 7. Delegating to TAs: trust and control

**What the data says.**
- UIC faculty (two lecturers, an editorial piece, not research) felt anxious partly because they had to guide TAs through a new LMS ([UIC](https://learning.uic.edu/news-stories/faculty-voices-on-lms-migration-how-support-shaped-the-experience/)). Two people only.
- Canvas gives TAs both "Grades - Edit" and "Grades - View All Grades" by default, and admins can change them. A thread quoting Canvas Support says the edit permission alone lets a user edit and view all grades ([Canvas Community](https://community.canvaslms.com/t5/Archived-Questions/SpeedGrader-permissions-fix/td-p/195787); [Canvas Community, decouple grading permissions idea](https://community.canvaslms.com/t5/Canvas-Ideas/Gradebook-Settings-Decouple-grading-permissions-from-gradebook/idc-p/491646)). Instructors who want scoped TAs are asking for it as a feature.
- The grader consistency studies in section 4 support instructors' wish to review TA work before students see it.
- I found no study that measures instructor trust in TAs or how it changes how much they delegate. That is a gap.

**What it means.** Instructors want to delegate without losing the final say. Whiteboard's split (TA grades, instructor releases) fits. Visibility of TA progress and a way to spot-check before release are the supporting features [est].

## 8. Registrar-owned rosters vs instructor-controlled settings

**What the data says.**
- If an enrolment carries an SIS ID, only an admin can remove it in Canvas. Manual removal may be reversed by the overnight sync ([Canvas Community](https://community.canvaslms.com/t5/Canvas-Question-Forum/Teachers-not-able-to-Remove-Students-from-Courses/m-p/612509); [Canvas Community, SIS enrolments](https://community.canvaslms.com/t5/Canvas-Question-Forum/Is-there-a-way-to-remove-suspend-block-a-SIS-added-user-from-a/td-p/586208)).
- Columbia's help page tells instructors they cannot remove enrolled students and to file a support ticket ([Columbia CTL](https://support.ctl.columbia.edu/migrated/1827718)). CSU Stanislaus says similar for previously assigned instructors ([CSU Stanislaus](https://www.csustan.edu/office-academic-technology/canvas-lms/canvas-how-people-rosters-roles)).
- A Canvas Ideas request asks the People page to distinguish SIS-imported from manual enrolments ([Canvas Ideas](https://community.canvaslms.com/t5/Canvas-Ideas/People-Differentiate-between-SIS-Import-and-Manual-enrollments/idi-p/402380/page/2)). So even the basic label is missing.
- The Canvas Community answers are user explanations, not official policy. The design reason (protecting registrar data) is plausible, but I could not confirm it from Instructure documentation.

**What it means.** The friction is not that the rule exists. It is that the screen gives no explanation and no path. Show where each roster fact came from, who can change it, and a "request a change" action that tracks status.

## 9. Attendance

**What the data says.** I found no rigorous study of instructor time cost for attendance, or of roster-sync reliability. What exists:
- Vendor claims: iClicker says its app supports geolocation or scheduled check-ins and syncs rosters with major LMSs ([iClicker](https://www.iclicker.com/institutions/)). Acadly cites a Western Kentucky instructor with a class of 113 reporting savings of over 30 minutes of admin time per lecture ([Acadly](https://acadly.com/)). Both are marketing, one testimonial.
- A 2012 student-newspaper report: a professor weighted clicker attendance at 3 percent of the grade, and students present without a clicker are marked absent ([Daily Pennsylvanian](https://thedp.com/article/2012/02/professors_use_clickers_to_track_attendance)). Old and anecdotal.
- At FIU, an instructor said app-based attendance integrates with the LMS so grades no longer go in by hand, but students complained about attendance use of the app ([Campus Technology, 2015](https://campustechnology.com/articles/2015/03/10/clickers-go-mobile.aspx?p=1)).
- A known failure mode is wifi dependence in app-based tools ([Macmillan community](https://community.macmillanlearning.com/t5/learning-stories-blog/a-new-way-to-use-iclicker-contact-tracing-in-large-enrollment/m-p/15654)).

**What it means.** Instructors will tolerate attendance only if it is nearly free and fixable after the fact. Failure cases to design for: late arrivals, forgotten devices, no connectivity, and roster changes in week 2 [est].

## 10. Templates, defaults and progressive disclosure

**What the data says.**
- NN/g: progressive disclosure makes applications easier to learn and less error-prone. Put frequent features first, make the step to more options obvious, base the split on evidence, and avoid more than two levels ([NN/g](https://www.nngroup.com/articles/progressive-disclosure/)). General usability guidance rather than faculty-specific research.
- The IU example shows a default is a policy decision: the vendor's default of automatic release was reversed by the institution for most courses ([IU KB](https://www.kb.indiana.edu/d/beid)). Defaults carry weight because most instructors will not change them [est].
- Template-based support is how institutions reduce migration fear. UIC faculty who had content moved into template sites felt better supported ([UIC](https://learning.uic.edu/news-stories/faculty-voices-on-lms-migration-how-support-shaped-the-experience/)). Two people.

**What it means.** The default for release should be the safe one (hold). Settings should live next to the task they affect, show their current value, and state their effect on students in plain words. A "start from last term" or "start from template" option should be offered first when creating a course.

## 11. Resistance to change and migration

**What the data says.**
- UIC (editorial, two faculty): one felt "very anxious", one "confused and, to be honest, scared". Support from training and staff helped; time during a short winter break was a worry; adoption paces differ ([UIC](https://learning.uic.edu/news-stories/faculty-voices-on-lms-migration-how-support-shaped-the-experience/)).
- A peer-reviewed paper notes some faculty were unhappy about an LMS change because they had put much time and effort into learning the old one ([Ryan et al., IRRODL](https://www.irrodl.org/index.php/irrodl/article/download/1126/2078?inline=1)). Single-institution, found via snippet.
- Campus announcements say Blackboard-to-Canvas differences may frustrate long-time users ([University of Miami IT](https://www.it.miami.edu/about-umit/it-news/umit-announcements/canvas-next-gen-management-system/index.html)).
- A r/Professors thread (July 2024, "What is Canvas missing?") has a top complaint that students got confused when the instructor switched to "new quizzes", which the To Do list could not reach ([r/Professors](https://lr.eu.psf.lt/r/Professors/comments/1e5t5d5/what_is_canvas_missing/ldoqy1r/?context=3)). Self-selected, via a mirror.
- A marketing blog claims resistance is sunk-cost and migration fear, not real satisfaction ([Winsome Marketing](https://www.winsomemarketing.com/resources/edtech-marketing-lms-migration-marketing-why-educators-hate-their-current-platform)). Vendor perspective; I treat it as opinion.

**What it means.** Whiteboard is not replacing an LMS in the prototype, so migration is a later problem. The lesson for the setup journey: the instructor brings content and habits from another system, and the first 15 minutes decide whether they trust the new one [est]. A visible "import what you have" path and a calm first screen are the two levers.

**A note on a possible conflict.** Instructors tend to distrust anything new that touches grades. Whiteboard's immutable receipts and release snapshots help students more than instructors, and may feel restrictive to an instructor who wants to correct a mistake quickly. The evidence for undo (section 5) pulls the other way. The rule needs both: immutable student receipts, and an instructor-side way to correct a grade after release that is audited rather than hidden. Test it.

## Design implications for Whiteboard

1. **Put release inside the basic grading path, not in settings.** The grading screen's primary completion action is "Review and release", with "Graded" as a separate saved state. Roles: Instructor, TA. Evidence: [EDUCAUSE 2014](https://library.educause.edu/resources/2014/8/study-of-faculty-and-information-technology-2014) (basic-use pattern) and [IU KB](https://www.kb.indiana.edu/d/beid). Confidence: Medium.
2. **Make Release a two-step action with a student-view preview.** Show who will see what, the count of students affected, and any excluded or unscored items before confirming. Roles: Instructor. Evidence: [UNH Canvas policy page](https://td.usnh.edu/TDClient/60/Portal/KB/Article/1977/Canvas-Grade-Post-Policies) (hiding is partial and confusing). Confidence: Medium.
3. **State up front whether a release can be recalled, and show the recall control next to the released state.** If recall exists, label it plainly ("Hide from students") and say what happens to notifications already sent. Roles: Instructor. Evidence: [Canvas Idea: Reset/undo](https://community.canvaslms.com/t5/Canvas-Ideas/Gradebook-Reset-undo-function/idi-p/600690). Confidence: Medium.
4. **Use hold as the default for release, per assignment and for the course.** Offer a single course-level default that the instructor sets once in setup. Roles: Instructor. Evidence: [IU KB](https://www.kb.indiana.edu/d/beid). Confidence: High that holding is the safer default; Low on how many want a per-assignment override.
5. **Reserve confirmation dialogs for actions that cannot be undone; make all other edits undoable with a visible "Undo" for at least the current session.** Do not confirm routine saves. Roles: all. Evidence: [NN/g](https://www.nngroup.com/articles/progressive-disclosure/) for the error-reduction principle; confirmation fatigue is an inference [est]. Confidence: Low to Medium.
6. **Show a grade-change log (who, when, from, to) on every grade, including after release.** Allow an instructor to correct a released grade, with a reason, and notify the student. Roles: Instructor, TA. Evidence: [Canvas Ideas: Restore button](https://community.canvaslms.com/t5/Canvas-Ideas/Gradebook-History-Restore-Button/idi-p/632818). Confidence: Medium. Conflicts with strict immutability if "immutable" is read as "no corrections", so test the wording.
7. **Build "Start from last term" as the first option in course setup, with a review list afterwards.** The review list shows every date that moved, every link to the old course, and every item that did not copy (including groups). Roles: Instructor. Evidence: [Canvas Community date issue](https://community.canvaslms.com/t5/Canvas-Question-Forum/Dates-not-adjusting-when-using-adjust-dates-tool-when-copying/td-p/533222), [FIU](https://insider.fiu.edu/?p=4931), [Indiana CTL](https://ctl.indianapolis.iu.edu/Teaching-Online/RegularMaintenance). Confidence: High that these failures occur; Medium on the best UI.
8. **Run an automatic check when a course is copied, not an optional button.** Block publishing to students until the instructor has seen the list, or show a clear "not yet checked" state. Roles: Instructor. Evidence: [Utah State](https://www.usu.edu/teach/help-topics/canvas/reusing-your-course.php) (link checker exists but must be run by hand). Confidence: Medium.
9. **Shift dates by term start with a calendar preview and a holiday-aware step.** Show old date, new date and weekday. Roles: Instructor. Evidence: [Indiana CTL](https://ctl.indianapolis.iu.edu/Teaching-Online/RegularMaintenance). Confidence: Medium.
10. **Label each roster row with its source (registrar or added by instructor) and who can change it.** Where the instructor cannot act, show a "Request change from registrar" action with a status. Roles: Instructor, TA. Evidence: [Canvas Community](https://community.canvaslms.com/t5/Canvas-Question-Forum/Teachers-not-able-to-Remove-Students-from-Courses/m-p/612509), [Canvas Ideas](https://community.canvaslms.com/t5/Canvas-Ideas/People-Differentiate-between-SIS-Import-and-Manual-enrollments/idi-p/402380/page/2). Confidence: High.
11. **Never show a disabled control without a reason.** Next to any locked setting, say who owns it (registrar, department or instructor) in a short sentence. Roles: all staff. Evidence: [Columbia CTL](https://support.ctl.columbia.edu/migrated/1827718) (instructors told to file tickets with no in-app route). Confidence: Medium.
12. **Keep the first screen of settings to the few things most instructors change; put the rest behind one labelled "More options" step.** No more than two levels. Roles: Instructor. Evidence: [NN/g](https://www.nngroup.com/articles/progressive-disclosure/), [EDUCAUSE 2014](https://library.educause.edu/resources/2014/8/study-of-faculty-and-information-technology-2014). Confidence: Medium. The split itself must come from the prototype tests.
13. **Write every setting with its effect on students in plain words** (for example "Students see grades when you release them"), and show the current value in the row. Roles: Instructor. Evidence: inference from [UNH Canvas policy page](https://td.usnh.edu/TDClient/60/Portal/KB/Article/1977/Canvas-Grade-Post-Policies) where the policy names do not predict behaviour [est]. Confidence: Low to Medium.
14. **Make the grading screen keyboard-driven, with score, comment and "next student" reachable without the mouse, and a visible count of remaining items.** Roles: Instructor, TA. Evidence: one [r/AskProfessors anecdote](https://lr.eu.psf.lt/r/AskProfessors/comments/1f0dis0/what_are_your_issues_with_canvas) (about 60 clicks for twenty students); self-selected. Confidence: Low (test timing in the prototype).
15. **Give the instructor a TA progress view before release**: per TA, graded count, remaining, and a way to open a sample. Roles: Instructor, TA. Evidence: [arXiv 2409.12967](https://arxiv.org/abs/2409.12967) (graders vary), [Canvas Community on TA permissions](https://community.canvaslms.com/t5/Archived-Questions/SpeedGrader-permissions-fix/td-p/195787). Confidence: Medium.
16. **Scope TA access by section and question, and show each TA exactly what they can and cannot see at the moment they are added.** Roles: Instructor, TA. Evidence: [Canvas Ideas: decouple grading permissions](https://community.canvaslms.com/t5/Canvas-Ideas/Gradebook-Settings-Decouple-grading-permissions-from-gradebook/idc-p/491646). Confidence: Medium.
17. **Let announcements be scheduled, targeted by section and previewed as students see them; show a "who has not opened this" count.** Roles: Instructor. Evidence: inference from [Cengage](https://www.prnewswire.com/news-releases/is-the-great-resignation-coming-to-higher-education-new-cengage-research-shows-the-majority-of-college-faculty-are-satisfied-but-increasing-responsibilities-are-leaving-them-feeling-unsupported-undervalued-and-burnt-out-301635480.html) (communication load) and [THE](https://timeshighereducation.com/news/students-feel-spammed-overload-university-emails) (overload buries messages). Confidence: Low.
18. **Offer quiet hours for instructor notifications** (batch student questions into one daily digest by default, with an urgent override for quiz-window problems). Roles: Instructor, TA. Evidence: [UMass email report](https://websites.umass.edu/misra/files/2023/08/Email-final-report.pdf). Confidence: Low to Medium.
19. **Make attendance a one-screen task with all students defaulting to a single state, bulk set, and an edit-later path that keeps a log.** Handle late arrivals and roster changes. Roles: Instructor, TA. Evidence: weak (vendor and anecdote: [iClicker](https://www.iclicker.com/institutions/), [Daily Pennsylvanian](https://thedp.com/article/2012/02/professors_use_clickers_to_track_attendance)). Confidence: Low.
20. **Do not rely on wifi or a student device for attendance; always allow instructor-entered attendance.** Roles: Instructor. Evidence: [Macmillan community](https://community.macmillanlearning.com/t5/learning-stories-blog/a-new-way-to-use-iclicker-contact-tracing-in-large-enrollment/m-p/15654). Confidence: Low to Medium.
21. **First sign-in for an adjunct or new instructor should land on a short checklist with the next step highlighted, and show clearly when access is waiting on someone else (HR, registrar).** Roles: Instructor. Evidence: [SLU help desk](https://ask.slu.edu/TDClient/30/Portal/KB/PrintArticle?ID=55), [Liberty dissertation](https://digitalcommons.liberty.edu/doctoral/6867). Confidence: Low to Medium (small, qualitative).
22. **Make the setup journey resumable and save as you go, since instructors set up between other tasks.** Show progress as steps done, not a percentage. Roles: Instructor. Evidence: inference from time allocation in [Cengage](https://www.prnewswire.com/news-releases/is-the-great-resignation-coming-to-higher-education-new-cengage-research-shows-the-majority-of-college-faculty-are-satisfied-but-increasing-responsibilities-are-leaving-them-feeling-unsupported-undervalued-and-burnt-out-301635480.html) [est]. Confidence: Low.
23. **Offer "import what you have" (syllabus, due dates) at setup so instructors do not start from blank.** Roles: Instructor. Evidence: [UIC faculty experience](https://learning.uic.edu/news-stories/faculty-voices-on-lms-migration-how-support-shaped-the-experience/) (content moved into templates helped); two people. Confidence: Low.

## Open questions for user testing

1. **What do instructors expect "Release" to mean?** Ask the 3 instructors to describe what students see before and after they click it, and whether they expect to be able to take it back. Their answer sets the recall rule.
2. **Do they want to correct a grade after release, and how fast?** Watch how they react to an audited correction flow compared to a locked one. This tests the immutability tension above.
3. **How do they currently check a copied course, and what do they miss?** Have each instructor copy a sample course from last term and think aloud. Count what they catch without the review list, then with it.
4. **Which settings do they change in the first 10 minutes, and which do they never touch?** This sets the "first level" of settings. We have no usage data of our own.
5. **How much do they trust a TA to grade without checking?** Ask the 2 TAs what they would not want the instructor to see mid-grading, and ask instructors what they would want to sample before release.
6. **What would they do when the roster is wrong (a missing or extra student)?** Observe whether they find the right path, and whether a "request change" action feels useful or slow.

## Sources

- [EDUCAUSE, Study of Faculty and Information Technology 2014](https://library.educause.edu/resources/2014/8/study-of-faculty-and-information-technology-2014)
- [EDUCAUSE 2014 report PDF](https://library.educause.edu/-/media/files/library/2014/8/ers1407-pdf.pdf)
- [EDUCAUSE ECAR faculty study 2017, LMS](https://www.educause.edu/ecar/research-publications/ecar-study-of-faculty-and-information-technology/2017/lms) (403 on fetch; search summary only)
- [Inside Higher Ed summary of ECAR 2014](https://www.insidehighered.com/node/60944)
- [Campus Technology, 2017 ECAR](https://campustechnology.com/articles/2017/11/06/students-faculty-have-contrasting-views-of-classroom-technology-ecar-surveys-find.aspx)
- [Cengage Faces of Faculty 2022 press release](https://www.prnewswire.com/news-releases/is-the-great-resignation-coming-to-higher-education-new-cengage-research-shows-the-majority-of-college-faculty-are-satisfied-but-increasing-responsibilities-are-leaving-them-feeling-unsupported-undervalued-and-burnt-out-301635480.html)
- [Liberty University dissertation, adjunct workload and burnout (2025)](https://digitalcommons.liberty.edu/doctoral/7110)
- [Liberty University dissertation, online adjunct LMS orientation (2025)](https://digitalcommons.liberty.edu/doctoral/6867)
- [Every Learner Everywhere, supporting online adjuncts](https://www.everylearnereverywhere.org/resources/supporting-online-adjunct-faculty-across-institutional-roles/)
- [SLU help desk, adjuncts not in Canvas](https://ask.slu.edu/TDClient/30/Portal/KB/PrintArticle?ID=55)
- [EDUCAUSE Review 2013, Faculty Readiness Website](https://er.educause.edu/articles/2013/10/the-faculty-readiness-website-preparing-instructors-and-building-community)
- [Indiana University KB, Canvas grade posting policies](https://www.kb.indiana.edu/d/beid)
- [UNH, Canvas Grade Post Policies](https://td.usnh.edu/TDClient/60/Portal/KB/Article/1977/Canvas-Grade-Post-Policies)
- [Canvas Community, single grade posted despite hidden column](https://community.canvaslms.com/t5/Question-Forum/Single-student-grade-was-posted-despite-column-being-hidden/m-p/191554)
- [Canvas Ideas, Gradebook Reset/undo](https://community.canvaslms.com/t5/Canvas-Ideas/Gradebook-Reset-undo-function/idi-p/600690)
- [Canvas Ideas, Curving of Grades](https://community.canvaslms.com/t5/Idea-Conversations/Curving-of-Grades/idi-p/510004)
- [Canvas Ideas, Gradebook History Restore Button](https://community.canvaslms.com/t5/Canvas-Ideas/Gradebook-History-Restore-Button/idi-p/632818)
- [Canvas Community, dates not adjusting on copy](https://community.canvaslms.com/t5/Canvas-Question-Forum/Dates-not-adjusting-when-using-adjust-dates-tool-when-copying/td-p/533222)
- [Canvas Community, due dates not transferring](https://community.canvaslms.com/t5/Canvas-Question-Forum/Due-Dates-not-transferring-in-course-copy/m-p/512666)
- [Cengage help, due date sync](https://help.cengage.com/cnowv2/instructor/common/tbs-due-date-sync.html)
- [FIU Insider, copying courses](https://insider.fiu.edu/?p=4931)
- [Indiana University Indianapolis CTL, regular maintenance](https://ctl.indianapolis.iu.edu/Teaching-Online/RegularMaintenance)
- [Utah State, reusing your course in Canvas](https://www.usu.edu/teach/help-topics/canvas/reusing-your-course.php)
- [Boston University SP25 workload survey](https://www.bu.edu/wpnet/files/2026/04/SP25-Workload-Survey-quantitative-results.pdf)
- [r/AskProfessors, issues with Canvas (mirror)](https://lr.eu.psf.lt/r/AskProfessors/comments/1f0dis0/what_are_your_issues_with_canvas)
- [r/Professors, what is Canvas missing (mirror)](https://lr.eu.psf.lt/r/Professors/comments/1e5t5d5/what_is_canvas_missing/ldoqy1r/?context=3)
- [arXiv 2409.12967, consistency of human grading](https://arxiv.org/abs/2409.12967)
- [UMN, asynchronous grading calibration for graduate TAs](https://experts.umn.edu/en/publications/asynchronous-grading-calibration-exercises-to-improve-graduate-te/)
- [Canvas Community, SpeedGrader permissions](https://community.canvaslms.com/t5/Archived-Questions/SpeedGrader-permissions-fix/td-p/195787)
- [Canvas Ideas, decouple grading permissions](https://community.canvaslms.com/t5/Canvas-Ideas/Gradebook-Settings-Decouple-grading-permissions-from-gradebook/idc-p/491646)
- [Canvas Community, teachers cannot remove students](https://community.canvaslms.com/t5/Canvas-Question-Forum/Teachers-not-able-to-Remove-Students-from-Courses/m-p/612509)
- [Canvas Community, removing SIS-added users](https://community.canvaslms.com/t5/Canvas-Question-Forum/Is-there-a-way-to-remove-suspend-block-a-SIS-added-user-from-a/td-p/586208)
- [Canvas Ideas, differentiate SIS and manual enrolments](https://community.canvaslms.com/t5/Canvas-Ideas/People-Differentiate-between-SIS-Import-and-Manual-enrollments/idi-p/402380/page/2)
- [Columbia CTL, removing students](https://support.ctl.columbia.edu/migrated/1827718)
- [CSU Stanislaus, Canvas rosters and roles](https://www.csustan.edu/office-academic-technology/canvas-lms/canvas-how-people-rosters-roles)
- [UMass Amherst email report](https://websites.umass.edu/misra/files/2023/08/Email-final-report.pdf)
- [EDUCAUSE Review 2008, email in academia](https://er.educause.edu/articles/2008/2/email-in-academia-expectations-use-and-instructional-impact)
- [Westminster LTRC, student emails](https://ceti.westminster.ac.uk/wp-content/uploads/sites/61/2020/06/LTRC-4-University-Communications-Lived-experiences-of-first-year-Life-Sciences-students-1.pdf)
- [Times Higher Education, student email overload](https://timeshighereducation.com/news/students-feel-spammed-overload-university-emails)
- [iClicker institutions](https://www.iclicker.com/institutions/)
- [Acadly](https://acadly.com/)
- [Daily Pennsylvanian, clickers for attendance](https://thedp.com/article/2012/02/professors_use_clickers_to_track_attendance)
- [Campus Technology, Clickers Go Mobile](https://campustechnology.com/articles/2015/03/10/clickers-go-mobile.aspx?p=1)
- [Macmillan community, iClicker wifi note](https://community.macmillanlearning.com/t5/learning-stories-blog/a-new-way-to-use-iclicker-contact-tracing-in-large-enrollment/m-p/15654)
- [NN/g, progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
- [UIC, faculty voices on LMS migration](https://learning.uic.edu/news-stories/faculty-voices-on-lms-migration-how-support-shaped-the-experience/)
- [Ryan et al., IRRODL](https://www.irrodl.org/index.php/irrodl/article/download/1126/2078?inline=1)
- [University of Miami IT, Canvas transition](https://www.it.miami.edu/about-umit/it-news/umit-announcements/canvas-next-gen-management-system/index.html)
- [Winsome Marketing, LMS migration blog (vendor opinion)](https://www.winsomemarketing.com/resources/edtech-marketing-lms-migration-marketing-why-educators-hate-their-current-platform)
