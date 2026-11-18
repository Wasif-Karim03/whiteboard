# Teaching assistants and the grading workflow

As of: 15 November 2026

## Key takeaways

- **TAs are time-boxed, part-time workers, and grading is the biggest elastic part of their job.** University policies cap TA work at about 10 to 20 hours a week, and one Wisconsin guide estimates grading at 5 to 9 hours a week for a 50% TA with three sections. A grading screen that wastes seconds per item costs real hours. Stress evidence is mostly anecdotal or old, and I found no large TA survey ([UMass](https://www.umass.edu/biology/about/governance-and-best-practices/values-and-expectations/graduate-ta-best-practices), [Wisconsin](https://kb.wisconsin.edu/images/group86/95768/TAWorkloadsReferenceSheet.pdf), [OSU](https://english.osu.edu/grader-recitation-workload-policy)).
- **A shared rubric does not by itself make graders consistent.** In a 28-person study of CS1 grading, a shared rubric still gave low agreement and people were inconsistent with themselves. Calibration meetings with blinded double-grading did better in a small psychology project. The product answer is rubric plus calibration tools plus drift checks, not rubric alone ([Messer et al. preprint](https://arxiv.org/html/2409.12967v3), [Boise State](https://www.boisestate.edu/undergraduate-research/?p=28670)).
- **Order and fatigue are measurable bias sources, and the default sort is a design decision.** A working paper on more than 30 million Canvas records found that early-graded work scored higher than late-graded work and that alphabetical default order disadvantaged late surnames. Randomised default order is the authors' suggested fix ([ScienceAlert summary](https://www.sciencealert.com/your-initials-could-seriously-impact-the-grade-you-receive-for-an-assignment), [UMich](https://record.umich.edu/articles/study-alphabetical-order-of-surnames-may-affect-grading)).
- **The "accidental release" failure is real and easy to cause in today's tools.** In Canvas, hiding grades does not stop new grades from posting, and a manual posting policy is a separate step. This backs the Whiteboard rule that Graded is not Released and that TAs cannot release ([Chapman](https://blogs.chapman.edu/academics/2025/05/19/manual-posting-policies-vs-hiding-grades-in-canvas/), [UBC](https://canvas-faculty.sites.olt.ubc.ca/?p=3010)).
- **Section scoping is often an enrollment-level setting people forget.** Canvas TAs can by default grade every section unless the instructor restricts them. FERPA turns this from a convenience problem into a compliance one, especially for undergraduate TAs ([Colorado State](https://canvas.colostate.edu/section-privileges/), [Canvas Community](https://community.canvaslms.com/t5/Canvas-Question-Forum/Permissions-View-Grades-by-Section/m-p/497598), [William & Mary](https://wm.edu/offices/registrar/facstaff/ferpaandbanner/announcements/ferpa-friday-oct-6.php)).

## Evidence quality, up front

Most of what exists here is vendor documentation, university help pages, forum threads and course policies. These are good for workflow facts and real complaints, and weak as evidence about outcomes. Peer-reviewed evidence on TA grading is thin and mostly from computer science, writing and large-scale testing. I mark each source type below. I could not read two PDFs in full (the UBC Gradescope and Crowdmark reports); I rely on search summaries of them and say so.

## 1. Who TAs are, and what limits them

"TA" covers at least three kinds of people, and their needs differ.

- **Graduate TAs** hold appointments, often 33% to 50% time. The University of Massachusetts Biology guidance says TA work can be no more than 20 hours per week during the appointment ([UMass](https://www.umass.edu/biology/about/governance-and-best-practices/values-and-expectations/graduate-ta-best-practices)). Columbia lists about 15 hours a week for PhD and MA TAs ([Columbia](https://sites.asit.columbia.edu/wp-content/uploads/sites/33/2017/10/Roles-of-TAs-and-Graders.pdf)). Georgia Tech Physics lists 13 hours a week as a semester average ([Georgia Tech](https://physics.gatech.edu/gta-guidelines)).
- **Graders and recitation leaders** have tighter caps. Ohio State caps graders at about 10 hours a week and recitation leaders at 20 ([OSU](https://english.osu.edu/grader-recitation-workload-policy)).
- **Undergraduate TAs and graders** are often part-time, sometimes unpaid or paid per hour, and are classmates or near-peers of the students. I found no single source that counts them. Treat their share of TA staffing as unknown [est: common in large intro courses, but not measured here].

Grading is the largest variable load. Wisconsin's TA workload sheet estimates grading at roughly 5 to 9 hours a week for a 50% TA teaching three discussion sections and tells departments to estimate per assignment and per student count ([Wisconsin](https://kb.wisconsin.edu/images/group86/95768/TAWorkloadsReferenceSheet.pdf)). Grading arrives in spikes after due dates, so a "20 hour" week can contain a 12-hour weekend. That spike pattern is my inference [est], not a measured result.

**Stress evidence is limited.** A Virginia Tech faculty blog says graduate students often report being overwhelmed by office hours and grading, and a GradCafe poster says they finish a 20-hour contract in about 10 hours. Both are anecdotes ([VT blog](https://wordpress.cs.vt.edu/elhamod/?p=236), [GradCafe](https://forum.thegradcafe.com/topic/10752-assistantship-workloads)). A mixed-method study of graduate assistants (University of South Florida; the abstract page gives no sample size) reports the main stressors as work overload, interpersonal conflict and organizational constraints, with frustration, anger and anxiety as the most common strains ([USF](https://digitalcommons.usf.edu/psy_facpub/738)). A conference paper on burnout among graduate TAs exists ([ASEE PEER](https://peer.asee.org/exploring-burnout-among-graduate-teaching-assistants)), but I could not open it and cannot report its numbers.

What this means: the evidence supports "time-poor, deadline-spiky, conflict with students is a stressor." It does not support specific stress percentages. Do not quote any.

## 2. How grading is split, and the tools that do it

### Splits

- **By question.** Gradescope is built around this. Graders can be assigned specific questions or can grade the same question together. One university guide notes graders evaluate one question across all submissions before moving on ([UVA](https://learningtech.virginia.edu/articles/efficient-and-consistent-grading-a-spotlight-on-gradescope), [UC Davis testimonials](https://wheel.ucdavis.edu/2020/01/23/faculty-testimonials-on-gradescope)). A UC Davis instructor assigns each grader specific questions for uniformity. UVA also notes question-by-question grading suits some assignments less well.
- **By section.** Canvas ties TAs to sections. By default a TA in a multi-section course can grade all sections, and the instructor must restrict them per enrollment ([Colorado State](https://canvas.colostate.edu/section-privileges/), [Indiana](https://www.kb.indiana.edu/d/bfbc) as reported in search; I could not open the Indiana page).
- **By student pile.** Common in essay courses and the default model in many LMS gradebooks. This is the pattern most exposed to order and "knowing the student" effects (section 4).

Whiteboard already scopes TAs to sections and questions. The evidence says that is the right model and that the scoping must be visible to the TA, not only enforced (section 7).

### Gradescope: what is documented and praised

- **Dynamic rubrics.** Rubrics are per question, shared across graders, and edits apply to submissions already graded ([UCLA](https://www.dts.ucla.edu/initiatives/bruin-learn-center-excellence/academic-tech-tools/gradescope)). Faculty at UC Davis say this improves fairness and consistency ([UC Davis](https://wheel.ucdavis.edu/2020/01/23/faculty-testimonials-on-gradescope)). A UBC evaluation also found instructors valued editing rubric descriptions and weights on the fly ([UBC Gradescope report](https://elearning5.sites.olt.ubc.ca/files/2021/05/gradescope-report.pdf), via search summary).
- **Reusable comments and batching.** UCLA notes graders can batch similar responses and reuse feedback. UBC's companion Crowdmark-versus-Gradescope comparison credits reusable TA comments for higher perceived feedback quality ([UBC Crowdmark report](https://elearning5.sites.olt.ubc.ca/files/2021/05/crowdmark-report.pdf), via search summary).
- **Rubric locking (new).** Since a 30 September 2025 release, instructors can choose "All staff can edit rubrics," "Only instructors can edit rubrics" or "No one can edit rubrics." Vendor source, so it describes intent, not outcomes ([Turnitin blog](https://www.turnitin.ca/blog/whats-new-in-gradescope-making-grading-easier-accessible-and-more-secure)). The default stays open to all staff. That implies the vendor saw mid-grading rubric edits by TAs as a real consistency risk.

### Gradescope: what is criticised

- **Binary rubric items.** The UBC evaluation found rubric items could only be binary, which made some rubrics hard to set up ([UBC Gradescope report](https://elearning5.sites.olt.ubc.ca/files/2021/05/gradescope-report.pdf), via search summary; small pilot).
- **Hotkeys that are too easy to hit.** The same UBC report records an instructor concern that rubric hotkeys are too easy to use, echoed by a few TAs, who said keeping focused was important. Small, informal sample.
- **Shortcuts and assistive technology.** A University of Wisconsin accessibility review says none of the keyboard shortcuts work when a screen reader is running, and that they are not always intuitive ([UW–Madison](https://kb.wisc.edu/154067)).
- **Digitising overhead.** For paper exams, the UBC comparison says Crowdmark's digitising workflow had issues but better feedback offset them in Gradescope's case. Details were not retrievable.

### Canvas SpeedGrader: what is criticised

These are forum threads and university IT notices, so they are real complaints but self-selected.

- **Speed and reliability.** A Canvas Ideas post reports about 4 seconds per assignment and compares it unfavourably to Gradescope ([Canvas Ideas](https://community.canvaslms.com/t5/Canvas-Ideas/Speedgrader-Make-SpeedGrader-Faster/idi-p/581498)). Other threads report tools that stop responding after a few minutes of use ([thread](https://community.canvaslms.com/thread/40829-speedgrader-tools-do-not-respond-well-after-a-few-minutes)) and trouble with very large classes ([thread](https://community.canvaslms.com/ideas/10890-speedgrader-should-allow-grading-of-large-classes)).
- **Change aversion.** A discussion-grading redesign drew complaints about navigation and added grading time. Boise State's known-issues page notes next/previous reply and context-view changes, and one user complains the save-score button moved to the page bottom, far from the question being scored ([Boise State](https://talk-boisestate.atlassian.net/wiki/spaces/LTS/pages/3015180290/Known+Issues+about+Canvas+Speedgrader), [Canvas forum](https://community.canvaslms.com/t5/Canvas-Question-Forum/Speedgrader-changed-with-Checkpoints-feature/m-p/631464)). Some institutions disabled the new version for accessibility and workflow reasons.

The pattern across both tools: graders complain about latency and about moving the score control. These are the two things a grading screen must get right.

### Crowdmark

The only independent evidence I found is the 2019 UBC pilot (six instructors, three TAs, three support staff; summary via search). A minority noted a decrease in the quality of TA marking and feedback, most praised flexible marking time and place, and the report urges monitoring TA work for quality as well as quantity ([UBC Crowdmark report](https://elearning5.sites.olt.ubc.ca/files/2021/05/crowdmark-report.pdf)). Crowdmark's own claims (for example a 40% time cut cited in a blog) are marketing and I could not verify their method ([Crowdmark blog](https://www.crowdmark.com/blog/how-digital-grading-improves-life-for-educators-and-students/)). A Newcastle conference abstract says TA marking is often inconsistent and out of line with course goals even with a marking scheme, and proposes giving TAs feedback on their feedback in real time ([Newcastle](https://eams.ncl.ac.uk/sessions/2021/using-online-marking-platforms-to-train-tas-on-how-to-give-effective-feedback)).

## 3. Consistency and calibration between graders

**Inter-rater consistency is lower than people assume.** Messer, Brown, Kölling and Shi (arXiv preprint, not yet peer-reviewed as far as I could tell) had 28 PhD, master's and third-year undergraduate participants, mostly without prior grading experience and each paid, grade the same 40 real CS1 Java submissions in seven groups of four. Krippendorff's alpha averaged about 0.22 for correctness and below 0.1 for elegance, readability and documentation. No group reached the 0.667 threshold the authors cite. Disagreement was widest for middle grades (roughly C- to B+). A shared rubric alone did not fix it, and one year of grading experience did not clearly help ([Messer et al.](https://arxiv.org/html/2409.12967v3)).

**People are inconsistent with themselves.** One submission was duplicated in the second batch. Only six participants noticed. Among those who did not, the mean absolute grade difference on the repeat was between 1.25 and 1.79 grade steps depending on criterion, while 24 of 28 said they graded consistently ([Messer et al.](https://arxiv.org/html/2409.12967v3)). Caveat: these are CS programming tasks with open-ended criteria, and the participants were not trained on a calibrated course rubric.

**Calibration can work in structured settings.** A Boise State undergraduate research project (a short project page, not a paper) had 11 TAs meet weekly with the instructor to calibrate grading of weekly essays in an introductory psychology course, with blinded independent grading and a three-part rubric. Reliability was about 0.79 for writing quality and engagement and about 0.70 for critical thinking. The authors conclude agreement is stronger on objective elements ([Boise State](https://www.boisestate.edu/undergraduate-research/?p=28670)). Methods are lightly documented, so treat it as suggestive.

**Drift in large-scale scoring.** In assessment research, raters shift severity over time. Palermo, Bunch and Ridge (2019) tracked three administrations of a large summative assessment and saw slightly rising severity on short constructed responses and mixed results on essays, with a cumulative effect of under one scaled-score point ([Measurement Inc. summary](https://www.measurementinc.com/highlights/longitudinal-scoring-stability/)). Within a session, a study by Hoskens and Wilson (2001) found raters drifted toward the mean, and their feedback intervention did not clearly beat the control (same search results; I could not open the paper). An IRT paper frames repeated scoring as an attention burden that affects severity, central tendency and halo effects ([PMC10240569 PDF](https://rcastoragev2.blob.core.windows.net/b354008cf994d9d49a212983f4e90e9b/10.1177_01466216231174566.PMC10240569.pdf), via search; I did not read the full text). These are professional scoring programmes, not TA grading in a course, so the effect sizes may not transfer.

**What this means for the product.** The evidence supports: shared rubric, a way to double-grade a sample, a visible disagreement signal, and a visible way to correct a rubric item after grading starts. It does not give a proven intervention or threshold. Do not hard-code an agreement target; offer the instructor the numbers.

## 4. Order effects, fatigue and bias

**Order and fatigue (working paper, very large sample).** Wang, Pei and Li (University of Michigan; working paper reported as under review at *Management Science* in April 2024) analysed more than 30 million Canvas assessment records, linked to registrar data. Under alphabetical default order, students with surnames A to E scored about 0.3 points (out of 100) higher than under random order, and U to Z about 0.3 lower, a gap of about 0.6. About 5% of graders who grade Z to A showed the reverse. Scores fell as graders moved through a batch: the first ten items got about 3.5 more points per 100 than items graded 50th to 60th. The current SSRN version (expanded to about 70 million records, revised February 2026) states the drift as about 0.15 SD, roughly 2.5 points per 100, for items graded beyond the 60th position versus the first. It also reports that a randomised message-based intervention in Fall 2025 reduced the bias ([SSRN 4603146](https://papers.ssrn.com/abstract=4603146)). Use the SSRN figure; the 3.5 figure comes from 2024 press coverage. Later comments were more negative and less polite, and later-graded items were more often disputed. The authors suggest randomised order as the default ([ScienceAlert](https://www.sciencealert.com/your-initials-could-seriously-impact-the-grade-you-receive-for-an-assignment), [UMich Record](https://record.umich.edu/articles/study-alphabetical-order-of-surnames-may-affect-grading)). Caveats: not yet peer-reviewed in the sources I saw, observational, and the figure for the Z-to-A subgroup comes from secondary coverage. The effect on one assignment is small; its value for Whiteboard is that it shows the default sort order is not neutral.

**Sequential assimilation in essay ratings.** A 2017 *Frontiers in Psychology* paper titled "Sequential Effects in Essay Ratings: Evidence of Assimilation Effects Using Cross-Classified Models" exists, and its title says ratings drift toward the previous one ([Frontiers](https://www.frontiersin.org/articles/10.3389/fpsyg.2017.00933/full)). I could not open the full text, so I cite it only for the existence of the finding, not for sample or size.

**Anonymity.** A Stockholm University working paper (IFN WP 1226) uses a quasi-experimental design around anonymous exams. As summarised in search, gender bias disappears once exams are anonymous, though in-group bias explains only about 10 to 20% of the total effect ([IFN](https://www.ifn.se/wfiles/wp/wp1226.pdf)). I could not read the PDF in full, it is non-US, and it is a working paper. Canvas offers anonymous grading, and Canvas guidance as reported in search says hiding names alone does not randomise order, but I did not capture a primary source for that and do not rely on it.

**Tension for Whiteboard.** Anonymous grading is good for fairness, but it can fight two TA needs: grading by section (the TA knows these students) and regrades (the student is now named). Design must say when names are hidden and when they are revealed, and show that state.

## 5. Regrade requests and conflict with students

- **Mechanics in Gradescope.** Regrades are per question and require a reason. They are on by default for published assignments, and instructors can set a date window. All instructors, TAs and readers can see all requests on one page, and staff close a request by replying, which emails the student ([Gradescope regrade page via search summary](https://help.gradescope.com/article/sr7x5r3ryw), [Guelph](https://support.courselink.uoguelph.ca/students/gradescope/regrade-requests)). Gradescope's help page returned 403 on retry, so I could not confirm assignment of requests to specific graders.
- **TA experience.** The UBC evaluation reports students did not always take the care they would asking in person, which one TA called a pain point ([UBC Gradescope report](https://elearning5.sites.olt.ubc.ca/files/2021/05/gradescope-report.pdf), via search summary).
- **Course policies show how staff protect themselves.** Brown's CS course allows requests only after 24 hours and within 7 days of release, only through the tool, only for rubric misapplication or missing items, and says regrades can raise or lower a score. It reports 222 regrade items in Spring 2020, 35 (about 16%) of which changed a grade, none of which changed a final grade. One course, one semester ([Brown CS](https://cs.brown.edu/courses/csci1660/old/2022/regrades.html)). A Georgia Tech course page says staff workload is high, so turnaround cannot be guaranteed and new grading comes first, with a three-tier path of grader, head TA and instructor ([Georgia Tech](https://lucylabs.gatech.edu/ml4t/?p=3590)). Colorado's CS guidance recommends a central form to avoid lost email and to curb abuse of the tool's regrade feature ([Colorado CS](https://www.colorado.edu/cs/sites/default/files/attached-files/faculty_guidelines-_gss_cms_fall_2021.pdf)).

These are course policies, so they show what staff want from a tool, not what is typical. Their shared themes: a waiting period, a stated reason, a scope limit ("misapplied rubric, not disputed value") and an escalation path. These match the interpersonal-conflict stressor in the USF study, and they suggest the tool, not the TA, should be the one that says "no".

The tension with immutable records: Gradescope rubric edits are retroactive, so a regrade fix can silently move other students' scores. Whiteboard's immutable release snapshots mean the app must decide how a post-release correction is shown (new version, original preserved). The evidence does not say what students prefer; this is an open question (below).

## 6. Keyboard-driven, high-volume UI needs

- **Documented model.** Gradescope maps number keys 1 to 0 to the first ten rubric items for a question, B and N to previous and next submission, and Shift+? to a shortcut map ([Gradescope shortcuts](https://guides.gradescope.com/hc/en-us/articles/37290703633677-Submission-navigation-and-keyboard-shortcuts)). A Clayton State video is titled "Grading Even Faster with Keyboard Shortcuts" ([Clayton](https://mediaspace.clayton.edu/media/Gradescope+-+Grading+Even+Faster+with+Keyboard+Shortcuts/1_vryy9owm)). Turnitin positions the map as helping both novice and experienced graders ([Turnitin](https://www.turnitin.ca/blog/enhance-your-grading-experience-with-new-features-accessibility-wins-gradescope)).
- **No quantitative evidence.** I found no study of speed or accuracy with these shortcuts. The UBC report's "hotkeys too easy" remark is the only user comment, and it is about accidental application.
- **Risks.** Shortcuts break with screen readers ([UW–Madison](https://kb.wisc.edu/154067)). Score controls placed far from the answer cost time ([Canvas forum](https://community.canvaslms.com/t5/Canvas-Question-Forum/Speedgrader-changed-with-Checkpoints-feature/m-p/631464)). Latency of seconds per item is called out as a problem ([Canvas Ideas](https://community.canvaslms.com/t5/Canvas-Ideas/Speedgrader-Make-SpeedGrader-Faster/idi-p/581498)).

Inference [est]: for a task repeated hundreds of times, the main wins are no layout shift between items, one-key apply and undo, and a visible "what did I just do" confirmation. That is consistent with the complaints, but it is my reading, not a tested result.

## 7. Permissions confusion, accidental release and FERPA

### What a TA sees and does

- **Canvas section scope is easy to miss.** By default, a TA in a multi-section course can grade all sections. Restriction is set per enrollment, not as a role permission, and one user found a custom view-only role still showed grades for all sections ([Colorado State](https://canvas.colostate.edu/section-privileges/), [Canvas Community](https://community.canvaslms.com/t5/Canvas-Question-Forum/Permissions-View-Grades-by-Section/m-p/497598)). A Canvas Ideas post asks for a course-level default ([Canvas Ideas](https://community.canvaslms.com/ideas/5584-course-level-setting-restrict-users-to-their-own-sections)). This is the confusion Whiteboard avoids if scope is a first-class, visible setting.
- **Rubric edit rights.** Gradescope's default lets all staff edit rubrics, and the new lock exists because that is risky ([Turnitin blog](https://www.turnitin.ca/blog/whats-new-in-gradescope-making-grading-easier-accessible-and-more-secure)).

### Accidental release

In Canvas, new grades post immediately under the default automatic policy. "Hide grades" only hides grades already visible and does not stop later grades from posting. Only a manual posting policy does that, and setting it does not retroactively hide anything ([Chapman](https://blogs.chapman.edu/academics/2025/05/19/manual-posting-policies-vs-hiding-grades-in-canvas/), [UBC](https://canvas-faculty.sites.olt.ubc.ca/?p=3010), [UMN](https://it.umn.edu/services-technologies/how-tos/canvas-work-grade-posting-policies-in)). A Canvas Community thread asks why hiding does not switch the policy to manual ([thread](https://community.canvaslms.com/t5/Canvas-Question-Forum/Why-doesn-t-hide-grades-automatically-change-grade-posting/m-p/591094)). The pattern is: two independent controls, one hidden, with the dangerous one as default. Canvas also has moderated grading, where provisional grades go to a final grader before publishing ([Instructure docs](https://developerdocs.instructure.com/services/canvas/resources/moderated_grading)); I did not read the details.

This supports Whiteboard's rule. The release step should be one clear action owned by the instructor, and "graded" and "released" should show as two separate states everywhere.

### FERPA and undergraduate TAs

- FERPA lets a school disclose records to "school officials" with a "legitimate educational interest," and schools define both terms in their annual notice. The regulation text quoted by AACRAO is 34 CFR 99.31(a)(1)(ii), which requires limiting access to those officials ([AACRAO](https://www.aacrao.org/news/ask-the-ferpa-professor-the-ferpa-professor-answers-a-question-regarding-legitimate-educational-interest/)). I did not find a rule that treats undergraduate TAs differently by law. The AACRAO column I fetched concerned department chairs, not TAs, so my earlier search summary about an undergraduate-TA column is not confirmed.
- Practice varies. William & Mary warns that a student grader or TA in Blackboard could reach other students' grades unless designated a school official ([W&M](https://wm.edu/offices/registrar/facstaff/ferpaandbanner/announcements/ferpa-friday-oct-6.php)). UW–Madison says not to share login credentials with TAs, even to enter grades ([UW–Madison](https://registrar.wisc.edu/ferpa-for-employees/)). Caltech says faculty and TAs do not get academic records unless duties require it ([Caltech](https://registrar.caltech.edu/records/ferpa/ferpa-faculty)). UW Bothell treats TAs as an extension of the faculty member ([UW Bothell](https://www.uwb.edu/registrar/?p=19076)).

Takeaway: the legal line is set by each school, so the product should make the TA's scope narrow by default and show it, and make the instructor's grant explicit. I am not giving legal advice.

## 8. TA and instructor communication, handoff and preview

I found no research on "ready for review" signals specifically. What exists points one way:

- Georgia Tech's tiered regrade path (grader, head TA, instructor) is a handoff pattern staff build by hand ([Georgia Tech](https://lucylabs.gatech.edu/ml4t/?p=3590)).
- Gradescope's single page for all regrade requests is a shared queue, but the Colorado guidance says teams still route around it with forms because email and forum posts get overlooked ([Colorado CS](https://www.colorado.edu/cs/sites/default/files/attached-files/faculty_guidelines-_gss_cms_fall_2021.pdf)).
- The UBC Crowdmark report and the Newcastle abstract both say instructors need to monitor TA quality, not only whether grading was done ([UBC Crowdmark report](https://elearning5.sites.olt.ubc.ca/files/2021/05/crowdmark-report.pdf), [Newcastle](https://eams.ncl.ac.uk/sessions/2021/using-online-marking-platforms-to-train-tas-on-how-to-give-effective-feedback)).

Inference [est]: a "ready for review" state works only if it carries three things: what is done (counts), what the TA is unsure about (flags and notes), and what is blocked. Without them it becomes a status label nobody trusts.

**TA preview of the student view.** I found no study. Canvas has a student-view feature, but my searches did not surface any complaint thread about it, so I cannot say how well it works. The risk case is clear from section 7: a preview that shows the TA's own scoped view rather than the student's would mislead. Treat this as an open question for testing.

## What conflicts with, or strains, a Whiteboard rule

- **No conflict** with "Graded is not Released" or "TAs cannot release." The Canvas posting evidence backs both.
- **Strain:** retroactive rubric edits (praised in Gradescope) versus immutable release snapshots. The app needs an explicit rule for post-release corrections.
- **Strain:** section-scoped grading versus anonymous grading. Names hidden helps fairness; names known helps context and regrades.
- **Gap:** no evidence found for any TA-to-instructor handoff pattern or for TA preview of the student view.

## Design implications for Whiteboard

1. **Make the grading screen static between items.** The score control, rubric and answer stay in fixed positions as the TA moves to the next item, and next-item latency is shown as instant feedback. Tags: TA. Evidence: [Canvas forum on moved save button](https://community.canvaslms.com/t5/Canvas-Question-Forum/Speedgrader-changed-with-Checkpoints-feature/m-p/631464), [Canvas Ideas on latency](https://community.canvaslms.com/t5/Canvas-Ideas/Speedgrader-Make-SpeedGrader-Faster/idi-p/581498). Confidence: Medium (forum complaints, self-selected).
2. **Offer number-key rubric application, previous/next keys and a shortcut map, and make every shortcut undoable with a visible "applied: X" confirmation.** Tags: TA. Evidence: [Gradescope shortcuts](https://guides.gradescope.com/hc/en-us/articles/37290703633677-Submission-navigation-and-keyboard-shortcuts), UBC "hotkeys too easy" remark ([UBC report](https://elearning5.sites.olt.ubc.ca/files/2021/05/gradescope-report.pdf)). Confidence: Medium.
3. **Every shortcut needs a non-shortcut equivalent that works with a screen reader.** Tags: TA. Evidence: [UW–Madison accessibility review](https://kb.wisc.edu/154067). Confidence: High.
4. **Default the grading order to random, with the sort order shown and changeable.** Never default to alphabetical. Tags: TA, instructor. Evidence: [ScienceAlert](https://www.sciencealert.com/your-initials-could-seriously-impact-the-grade-you-receive-for-an-assignment), [UMich](https://record.umich.edu/articles/study-alphabetical-order-of-surnames-may-affect-grading). Confidence: Medium (working paper, not yet peer-reviewed in sources seen; effect small per item).
5. **Show a "name hidden" state on the grading screen, and say when names will be revealed (for example at regrade).** Tags: TA, student. Evidence: [IFN WP 1226](https://www.ifn.se/wfiles/wp/wp1226.pdf), summary only. Confidence: Low to Medium.
6. **Show the TA a quiet progress and pace line (done count, items left) and an optional "take a break" prompt after long runs, with no scores or timers pushed at them.** Tags: TA. Evidence: first-ten versus 50th-to-60th score gap in [ScienceAlert](https://www.sciencealert.com/your-initials-could-seriously-impact-the-grade-you-receive-for-an-assignment); the break prompt is [est] and untested. Confidence: Low.
7. **Support a calibration pass: the instructor marks a small set of submissions as shared samples, TAs grade them blind, and the instructor sees where scores differ.** Report disagreement as raw differences per rubric item, not as a reliability statistic with a pass mark. Tags: instructor, TA. Evidence: [Messer et al.](https://arxiv.org/html/2409.12967v3), [Boise State](https://www.boisestate.edu/undergraduate-research/?p=28670). Confidence: Medium.
8. **Let TAs flag a submission or rubric item as "unsure" with a short note, and route flags to the instructor's review queue.** Tags: TA, instructor. Evidence: calibration studies above; the specific flow is [est]. Confidence: Low.
9. **Make rubric editing a permission the instructor sets (instructors only, anyone, none), and show the TA a visible lock marker when rubric edits are off.** Tags: instructor, TA. Evidence: [Turnitin blog](https://www.turnitin.ca/blog/whats-new-in-gradescope-making-grading-easier-accessible-and-more-secure) (vendor). Confidence: Medium.
10. **When a rubric item changes after grading began, show a preview of how many already-graded submissions change and by how much, and require confirmation. After release, create a new version and keep the original visible.** Tags: instructor, TA, student. Evidence: [UCLA on retroactive edits](https://www.dts.ucla.edu/initiatives/bruin-learn-center-excellence/academic-tech-tools/gradescope) against Whiteboard's snapshot rule. Confidence: Medium (the evidence is about the feature; the confirmation design is [est]).
11. **Show Graded and Released as two separate, always-visible states, and put the only release action in the instructor's view.** Show the TA a plain line such as "Graded. Students can't see this yet." Tags: TA, instructor. Evidence: [Chapman](https://blogs.chapman.edu/academics/2025/05/19/manual-posting-policies-vs-hiding-grades-in-canvas/), [UBC](https://canvas-faculty.sites.olt.ubc.ca/?p=3010), [UMN](https://it.umn.edu/services-technologies/how-tos/canvas-work-grade-posting-policies-in). Confidence: High.
12. **Show the TA their scope at the top of every grading screen (course, section(s), question(s), number of students) and refuse to show anything outside it.** Tags: TA. Evidence: [Colorado State](https://canvas.colostate.edu/section-privileges/), [Canvas Community](https://community.canvaslms.com/t5/Canvas-Question-Forum/Permissions-View-Grades-by-Section/m-p/497598). Confidence: High.
13. **Default new TA grants to the narrowest scope, and require the instructor to confirm any wider grant. Offer a "student TA" role marker that further limits what shows (for example no grade totals).** Tags: instructor, TA. Evidence: [William & Mary](https://wm.edu/offices/registrar/facstaff/ferpaandbanner/announcements/ferpa-friday-oct-6.php), [Caltech](https://registrar.caltech.edu/records/ferpa/ferpa-faculty), [34 CFR 99.31 via AACRAO](https://www.aacrao.org/news/ask-the-ferpa-professor-the-ferpa-professor-answers-a-question-regarding-legitimate-educational-interest/). Confidence: Medium (legal definitions vary by school; no legal advice).
14. **Build regrade as a form with a required reason, a stated scope ("a rubric item was missed or misapplied"), an optional window set by the instructor, and a three-step path (TA, head TA, instructor).** Tags: student, TA, instructor. Evidence: [Brown](https://cs.brown.edu/courses/csci1660/old/2022/regrades.html), [Georgia Tech](https://lucylabs.gatech.edu/ml4t/?p=3590), [Colorado CS](https://www.colorado.edu/cs/sites/default/files/attached-files/faculty_guidelines-_gss_cms_fall_2021.pdf). Confidence: Medium (course policies, not studies).
15. **Put all regrade requests in one queue visible to the whole grading team, with a status per request, and tell the student what happens next and when.** Tags: TA, student. Evidence: [Gradescope regrade summary](https://help.gradescope.com/article/sr7x5r3ryw), [Georgia Tech](https://lucylabs.gatech.edu/ml4t/?p=3590). Confidence: Medium.
16. **On a regrade, say plainly that the score can go up or down, before the student submits it.** Tags: student. Evidence: [Brown](https://cs.brown.edu/courses/csci1660/old/2022/regrades.html). Confidence: Medium.
17. **"Ready for review" should carry counts (graded, flagged, blocked) and the TA's notes, and the instructor's reply should come back to the same place.** Tags: TA, instructor. Evidence: [UBC Crowdmark report](https://elearning5.sites.olt.ubc.ca/files/2021/05/crowdmark-report.pdf), [Newcastle](https://eams.ncl.ac.uk/sessions/2021/using-online-marking-platforms-to-train-tas-on-how-to-give-effective-feedback). Confidence: Low (inferred from quality-monitoring needs; no direct study).
18. **A TA's "preview as student" must show exactly what a student in that section would see, and label itself as a preview, with the release state a student would see.** Tags: TA, instructor. Evidence: none direct; inferred from the visibility confusion in [Chapman](https://blogs.chapman.edu/academics/2025/05/19/manual-posting-policies-vs-hiding-grades-in-canvas/). Confidence: Low. **Coordinator note (15 Nov 2026): rejected. Decision BD2 keeps student preview instructor-only; see 00_synthesis.md C1.**
19. **Let TAs save and reuse their own comments per rubric item, with the instructor able to see and promote the good ones to shared.** Tags: TA, instructor. Evidence: [UCLA](https://www.dts.ucla.edu/initiatives/bruin-learn-center-excellence/academic-tech-tools/gradescope), [UBC Crowdmark report](https://elearning5.sites.olt.ubc.ca/files/2021/05/crowdmark-report.pdf). Confidence: Medium.
20. **Show instructors a weekly TA time estimate (items graded, average time per item) as information for them, and never as a TA ranking shown to peers.** Tags: instructor, TA. Evidence: [OSU](https://english.osu.edu/grader-recitation-workload-policy), [Wisconsin](https://kb.wisconsin.edu/images/group86/95768/TAWorkloadsReferenceSheet.pdf) for hour caps; the ranking caution is [est]. Confidence: Low.

## Open questions for user testing

1. Watch a TA grade 10 submissions with your prototype keyboard-only, then with the mouse. Where do they hesitate, and did anyone apply a rubric item by accident?
2. Ask TAs: "Would you rather grade by question across all students, or by student across all questions?" and "Does knowing the student's name change how you grade?"
3. Show a TA the "Graded, not released" line. Ask what they think students can see right now, and what would make them nervous about pressing something.
4. Ask instructors: "After release, you change a rubric item. What should students see?" Test the new-version-with-original-kept idea against simple alternatives.
5. Ask TAs what they would put in a "ready for review" note, and what an instructor would need to trust it enough not to re-check everything.
6. If either TA is an undergraduate: what do they believe they are allowed to see about classmates, and does the scope line at the top of the screen help or feel like surveillance?

## Sources

- [UMass Biology, graduate TA best practices](https://www.umass.edu/biology/about/governance-and-best-practices/values-and-expectations/graduate-ta-best-practices)
- [Wisconsin TA workloads reference sheet](https://kb.wisconsin.edu/images/group86/95768/TAWorkloadsReferenceSheet.pdf)
- [Ohio State grader and recitation workload policy](https://english.osu.edu/grader-recitation-workload-policy)
- [Columbia, roles of TAs and graders](https://sites.asit.columbia.edu/wp-content/uploads/sites/33/2017/10/Roles-of-TAs-and-Graders.pdf)
- [Georgia Tech Physics GTA guidelines](https://physics.gatech.edu/gta-guidelines)
- [Virginia Tech blog on TA workload](https://wordpress.cs.vt.edu/elhamod/?p=236)
- [GradCafe assistantship workloads thread](https://forum.thegradcafe.com/topic/10752-assistantship-workloads)
- [USF, Examining Stress in Graduate Assistants](https://digitalcommons.usf.edu/psy_facpub/738)
- [ASEE PEER, Exploring Burnout Among Graduate Teaching Assistants](https://peer.asee.org/exploring-burnout-among-graduate-teaching-assistants)
- [UVA, efficient and consistent grading with Gradescope](https://learningtech.virginia.edu/articles/efficient-and-consistent-grading-a-spotlight-on-gradescope)
- [UC Davis, faculty testimonials on Gradescope](https://wheel.ucdavis.edu/2020/01/23/faculty-testimonials-on-gradescope)
- [UCLA Gradescope page](https://www.dts.ucla.edu/initiatives/bruin-learn-center-excellence/academic-tech-tools/gradescope)
- [UBC Gradescope evaluation report](https://elearning5.sites.olt.ubc.ca/files/2021/05/gradescope-report.pdf)
- [UBC Crowdmark evaluation report](https://elearning5.sites.olt.ubc.ca/files/2021/05/crowdmark-report.pdf)
- [Turnitin blog, Gradescope rubric locking (30 Sep 2025)](https://www.turnitin.ca/blog/whats-new-in-gradescope-making-grading-easier-accessible-and-more-secure)
- [Turnitin blog, Gradescope grading experience and accessibility](https://www.turnitin.ca/blog/enhance-your-grading-experience-with-new-features-accessibility-wins-gradescope)
- [Gradescope submission navigation and keyboard shortcuts](https://guides.gradescope.com/hc/en-us/articles/37290703633677-Submission-navigation-and-keyboard-shortcuts)
- [Clayton State, Gradescope keyboard shortcuts video](https://mediaspace.clayton.edu/media/Gradescope+-+Grading+Even+Faster+with+Keyboard+Shortcuts/1_vryy9owm)
- [UW–Madison, Gradescope accessibility and usability](https://kb.wisc.edu/154067)
- [Gradescope help, managing regrade requests](https://help.gradescope.com/article/sr7x5r3ryw)
- [Guelph, Gradescope regrade requests](https://support.courselink.uoguelph.ca/students/gradescope/regrade-requests)
- [Brown CS regrade policy](https://cs.brown.edu/courses/csci1660/old/2022/regrades.html)
- [Georgia Tech ML4T assignment follow-up](https://lucylabs.gatech.edu/ml4t/?p=3590)
- [Colorado CS faculty guidelines, Fall 2021](https://www.colorado.edu/cs/sites/default/files/attached-files/faculty_guidelines-_gss_cms_fall_2021.pdf)
- [Canvas Ideas, make SpeedGrader faster](https://community.canvaslms.com/t5/Canvas-Ideas/Speedgrader-Make-SpeedGrader-Faster/idi-p/581498)
- [Canvas Community, SpeedGrader tools stop responding](https://community.canvaslms.com/thread/40829-speedgrader-tools-do-not-respond-well-after-a-few-minutes)
- [Canvas Ideas, SpeedGrader large classes](https://community.canvaslms.com/ideas/10890-speedgrader-should-allow-grading-of-large-classes)
- [Canvas Community, SpeedGrader changed with Checkpoints](https://community.canvaslms.com/t5/Canvas-Question-Forum/Speedgrader-changed-with-Checkpoints-feature/m-p/631464)
- [Boise State, known issues about Canvas SpeedGrader](https://talk-boisestate.atlassian.net/wiki/spaces/LTS/pages/3015180290/Known+Issues+about+Canvas+Speedgrader)
- [Crowdmark blog, digital grading](https://www.crowdmark.com/blog/how-digital-grading-improves-life-for-educators-and-students/)
- [Newcastle, online marking platforms to train TAs](https://eams.ncl.ac.uk/sessions/2021/using-online-marking-platforms-to-train-tas-on-how-to-give-effective-feedback)
- [Messer et al., how consistent are humans when grading programming assignments (arXiv)](https://arxiv.org/html/2409.12967v3)
- [Boise State undergraduate research, TA grading calibration](https://www.boisestate.edu/undergraduate-research/?p=28670)
- [Measurement Inc., longitudinal scoring stability](https://www.measurementinc.com/highlights/longitudinal-scoring-stability/)
- [Huang IRT rater drift paper (PMC10240569 PDF)](https://rcastoragev2.blob.core.windows.net/b354008cf994d9d49a212983f4e90e9b/10.1177_01466216231174566.PMC10240569.pdf)
- [SSRN 4603146, Wang, Pei and Li working paper (primary)](https://papers.ssrn.com/abstract=4603146)
- [ScienceAlert, surname order and grades](https://www.sciencealert.com/your-initials-could-seriously-impact-the-grade-you-receive-for-an-assignment)
- [UMich Record, alphabetical order of surnames may affect grading](https://record.umich.edu/articles/study-alphabetical-order-of-surnames-may-affect-grading)
- [Frontiers in Psychology, sequential effects in essay ratings (2017)](https://www.frontiersin.org/articles/10.3389/fpsyg.2017.00933/full)
- [IFN working paper 1226, anonymous grading and gender bias](https://www.ifn.se/wfiles/wp/wp1226.pdf)
- [Colorado State, Canvas section privileges](https://canvas.colostate.edu/section-privileges/)
- [Canvas Community, view grades by section](https://community.canvaslms.com/t5/Canvas-Question-Forum/Permissions-View-Grades-by-Section/m-p/497598)
- [Canvas Ideas, restrict users to own sections](https://community.canvaslms.com/ideas/5584-course-level-setting-restrict-users-to-their-own-sections)
- [Indiana, restrict TA grading by section](https://www.kb.indiana.edu/d/bfbc)
- [Chapman, manual posting policies versus hiding grades](https://blogs.chapman.edu/academics/2025/05/19/manual-posting-policies-vs-hiding-grades-in-canvas/)
- [UBC, showing and hiding grades](https://canvas-faculty.sites.olt.ubc.ca/?p=3010)
- [UMN, Canvas grade posting policies](https://it.umn.edu/services-technologies/how-tos/canvas-work-grade-posting-policies-in)
- [Canvas Community, hide grades and posting policy](https://community.canvaslms.com/t5/Canvas-Question-Forum/Why-doesn-t-hide-grades-automatically-change-grade-posting/m-p/591094)
- [Instructure, moderated grading](https://developerdocs.instructure.com/services/canvas/resources/moderated_grading)
- [AACRAO, Ask the FERPA Professor (legitimate educational interest)](https://www.aacrao.org/news/ask-the-ferpa-professor-the-ferpa-professor-answers-a-question-regarding-legitimate-educational-interest/)
- [William & Mary FERPA Friday, 6 Oct 2023](https://wm.edu/offices/registrar/facstaff/ferpaandbanner/announcements/ferpa-friday-oct-6.php)
- [UW–Madison registrar, FERPA for employees](https://registrar.wisc.edu/ferpa-for-employees/)
- [Caltech registrar, FERPA for faculty](https://registrar.caltech.edu/records/ferpa/ferpa-faculty)
- [UW Bothell registrar, FERPA for staff and faculty](https://www.uwb.edu/registrar/?p=19076)

Note: no fetched page contained instructions aimed at me. Several PDFs (UBC reports, IFN, one NSF paper) returned raw binary or 403 errors, so claims drawn from them rest on search summaries and are labelled that way.
