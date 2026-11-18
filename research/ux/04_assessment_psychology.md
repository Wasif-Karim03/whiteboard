# Psychology of assessment, time pressure and status in course software

As of: 15 November 2026

Scope: students, instructors and TAs in US higher education. This file covers timed quizzes, connection loss, deadlines and extensions, accommodations, cognitive load, status clarity, irreversible actions, proctoring, notifications and dark patterns. Evidence quality is flagged on every claim. Search snippets were my main route to many sources. Where I only saw an abstract or a summary, I say so.

## Key takeaways

- Timers are a real but modest anxiety source. The only controlled study I found on timer display (113 students, 29 quizzes) found that giving students a choice of timer did not change scores, but students liked the choice and tended to settle on one. I found no study that tests a hidden timer against a visible one. Offering a hide option is a reasonable inference, not an evidence-backed rule. [Providing a Choice of Time Trackers (SIGCSE 2023)](https://sigcse2023.sigcse.org/details/sigcse-ts-2023-papers/55/Providing-a-Choice-of-Time-Trackers-on-Online-Assessments)
- The most reliable anxiety reducer in the sources was not a UI trick. It was removing uncertainty: preparation sessions, clear rules and transparency about what the system does. This held for online exams at the Open University and for proctoring. [Moorman et al. 2024](https://university.open.ac.uk/scholarship-and-innovation/esteem/sites/www.open.ac.uk.scholarship-and-innovation.esteem/files/resources/Moorman%20F.%20Warriner%20G.%20and%20Whitehead%20B.%20%282024%29%20Anxiety%20of%20online%20exams.%20eSTEeM%20Final%20Report.pdf), [Chaudhry et al. 2022](https://perl.sce.carleton.ca/assets/pdfs/Chaudhry2022_posterAbstract_soups.pdf)
- Automatic, penalty-free grace periods look safe for grades in the one recent study I found (198 students, one NZ course). They are small evidence. Delaware's data warns that unlimited flexibility can push work to the end. A bounded window is the best-supported design. [Cochrane et al. 2026](https://mro.massey.ac.nz/items/5037646a-8837-4c57-8772-81ed0d059bf4/full), [ASEE 2024](https://peer.asee.org/47200.pdf)
- Accommodation stigma is documented but mostly in small qualitative studies. Students avoid disclosing. Design so that extra time appears as a plain, private fact on the student's own quiz, with no label that reveals why. [Leonard & Sasso 2026](https://digitalcommons.georgiasouthern.edu/gcpa/vol42/iss1/1)
- Many "UX laws" are weaker than their reputation. Hick's law and Miller's 7 plus or minus 2 are widely overapplied. Use them only as prompts to reduce visible choices and chunk information, and test the result. [Cowan 2001](https://pubmed.ncbi.nlm.nih.gov/11515286/), [Hick-Hyman critique summary](https://ixdf.org/literature/article/the-hick-hyman-law-an-argument-against-complexity-in-user-interface-design)

---

## 1. Timed quizzes, test anxiety and the countdown timer

### What the evidence says

- A SIGCSE 2023 paper from the University of Virginia ran a semester-long study across 29 online quizzes in three CS courses with 113 students. Students strongly preferred a countdown of remaining time, graphical displays over text-only, and visuals that changed colour as time passed. Students who could choose on every quiz usually kept one timer or settled on a favourite after a few quizzes. Choice had no significant effect on scores. The authors argue choice makes testing more comfortable and inclusive. [SIGCSE 2023 listing](https://sigcse2023.sigcse.org/details/sigcse-ts-2023-papers/55/Providing-a-Choice-of-Time-Trackers-on-Online-Assessments)
  - Limits: CS students, one university, a sample of 113. I saw the abstract-level summary, not the full paper.
- A 2025 LMU Munich study reported that about one third of students experienced anxiety before and during online exams, and 30% said the interface design hurt their performance. [Cherif et al. 2025](https://www.mmi.ifi.lmu.de/pubdb/publications/pub/cherif2025stress/cherif2025stress.pdf)
  - Limits: I only saw summary text. Self-report. Non-US.
- Research with children aged 7 to 9 found lower anxiety with a visible timer than in other assessment contexts, and a replication found no significant difference in maths performance. [Search summary only; see Moorman/other results below, not a primary source I could open]
  - Limits: children, maths, not university. I could not retrieve a primary link, so do not cite this in design reasoning.
- The Open University eSTEeM project (Moorman, Warriner, Whitehead; April 2022 to April 2024) ran preparation sessions after reports of student anxiety about online exams. Most students said the sessions removed uncertainty and reduced anxiety. Timing was still a significant issue. There was a strong preference for continuing online exams. [Final report](https://university.open.ac.uk/scholarship-and-innovation/esteem/sites/www.open.ac.uk.scholarship-and-innovation.esteem/files/resources/Moorman%20F.%20Warriner%20G.%20and%20Whitehead%20B.%20%282024%29%20Anxiety%20of%20online%20exams.%20eSTEeM%20Final%20Report.pdf), [project page](https://oro.open.ac.uk/102268)
  - Limits: UK distance-learning students, post-exam survey plus interviews, an institutional report rather than a controlled trial.

### What it does not say

I found no study that compares a visible timer with a hidden one for adults. So the claim "visible timers raise anxiety" is only partly supported. The honest summary is:

1. Timers can be a source of anxiety for some students (SIGCSE paper).
2. Students prefer to see time remaining, so removing it by default is risky.
3. Whether hiding the timer helps anxious students is untested. That is a test-participant question for Whiteboard.

Pop-psychology flag: blog posts such as exam-countdown tips pages gave advice with no sources. I did not use them.

### Design reading

Keep a countdown available, make it calm (no red flashing early on, no audible alarms), let a student collapse it to a small unobtrusive form, and always give a screen-reader-friendly time check on demand. Escalate emphasis only near the end (for example last five minutes), because the studies suggest students want information, not alarm. This is [est] design inference.

---

## 2. Connection loss and autosave during quizzes

### What real users and institutions report

The Canvas community and university guides give consistent facts about a major competitor:

- Canvas can only save answers when the connection is live. Answers entered after the connection drops are not saved. The timer keeps counting down while offline. [UBC](https://lthub.ubc.ca/technology-tips/internet-connection/), [Wharton](https://support.wharton.upenn.edu/help/administering-and-troubleshooting-online-exams), [Stanford](https://med.stanford.edu/edtech/services/lms/medcanvas/exams)
- Students see messages such as "Connection Lost ... Your progress will be saved". Those can be unclear about what was actually saved. [Wharton](https://support.wharton.upenn.edu/help/administering-and-troubleshooting-online-exams)
- Community posts describe students losing several answers because the browser could not reach the server. [Canvas Community thread](https://community.canvaslms.com/t5/Canvas-Question-Forum/Canvas-Quiz-Answers-changes-not-saved/m-p/495028)
- A Canvas Ideas request asks for a visible connection status and a save indicator in New Quizzes. That is a direct signal of the unmet need. [Canvas Ideas](https://community.canvaslms.com/t5/Canvas-Ideas/New-Quizzes-Show-connection-status-offer-a-save-button-with/idi-p/572851)
- One community thread says a few extra minutes may be allowed for answers recorded after a timer disconnect. This is community-reported, not official documentation. [Community thread](https://community.canvaslms.com/t5/Archived-Questions/ARCHIVED-Canvas-giving-students-5-extra-minutes-with-a-slow/m-p/503211)
- Instructors are told they can give extra time if a student reports time lost to a connection problem. [UBC](https://lthub.ubc.ca/technology-tips/internet-connection/)

Limits: forum posts are self-selected complaints. They show what goes wrong, not how often.

### Why it matters psychologically

Nielsen's first heuristic, visibility of system status, says systems should keep users informed through feedback within a reasonable time, and that people can only act well if they know the current state. [NN/g](https://www.nngroup.com/articles/visibility-system-status/) A student in a timed quiz cannot tell whether an answer is saved. The cost of not knowing is high, so uncertainty itself is the problem. This is [est] inference from the heuristic plus the Canvas complaints.

### Design reading

- Show a persistent, quiet save indicator per question: "Saved 10:42:07" in the student's time zone, or "Not saved yet, connection lost".
- On connection loss, say plainly what is safe (answers saved up to time X), what is not, and that the timer rule is X. The rule must be decided by the product (see section 3).
- Queue answers locally and sync on reconnect, and say so.
- Give instructors a quiz activity log (when answers saved, when the connection dropped) so they can resolve disputes fairly. This matches the Canvas advice that instructors check the quiz log. [WWU guide](https://atus.wwu.edu/kb/canvas-quiz-best-practices)

---

## 3. Late starts and fair end-time rules

I found no peer-reviewed study on late starts specifically. The evidence is institutional guidance and platform behaviour, so everything below is [est].

- The rule most platforms follow is that the timer runs from when the student starts, capped by the quiz's close time. In Canvas, community discussion shows students often misunderstand this and are surprised when the window closes first. [Canvas Community](https://community.canvaslms.com/t5/Archived-Questions/When-a-student-starts-quiz/m-p/234794)
- The source of anxiety is not the rule but the surprise.

Design reading:

- Before the student starts, show a plain sentence: "You have 30 minutes. The quiz closes at 11:59 pm on Friday. If you start at 11:45 pm you will have 14 minutes, not 30."
- Show the actual time they will get, computed at the moment of starting, with seconds, in their time zone.
- Do not let a late start look like a student mistake. State it as arithmetic.
- Record an immutable start and end receipt for both student and instructor, consistent with the Whiteboard receipt rule.

---

## 4. Late policies, grace periods and flexible deadlines

### Evidence

- Cochrane, Erueti and Jin (2026, Journal of Further and Higher Education) studied an automatic, penalty-free grace period with 198 students in a fully online first-year Health Communication course at a New Zealand university, across two assessments. Submissions were sorted into on time, grace period, extension and non-submission. Marks did not differ meaningfully across categories. By assessment two more students submitted on time, but a substantial minority kept relying on the grace period. Students who submitted on time first were likely to do so again. Early non-submission predicted continued non-submission or withdrawal. The authors say clear expectations and early support for students who disengage are needed. [Massey record](https://mro.massey.ac.nz/items/5037646a-8837-4c57-8772-81ed0d059bf4/full)
  - Limits: one course, one term, non-US, first-year, observational. I saw a summary, not the full text.
- A University of Delaware chemical engineering study (ASEE 2024) of "lightly flexible" deadlines found average extensions per student were 0.5 for juniors, 1.0 for sophomores and 3.0 for first-years. The paper warns that over-flexible deadlines can lead to students not demonstrating the learning outcomes by the end of the semester. [ASEE paper](https://peer.asee.org/47200.pdf)
  - Limits: conference paper, one department, small, engineering.
- An ASEE programming course paper reports that grace periods with limits improved outcomes and reduced plagiarism without many of the harms of unlimited flexible deadlines. [ASEE](https://strategy.asee.org/impact-of-late-policies-on-submission-behavior-and-grades-in-computer-programming.pdf)
  - Limits: I saw only the search summary.
- Cornell tested an "extension without penalty" model and a secondary summary says grades did not decline. [Secondary summary only, not verified from a Cornell primary page.]
- University of Saskatchewan teaching guidance describes a soft deadline followed by a 48-hour grace period with no approval needed. [USask](https://teaching.usask.ca/articles/2026-01-26-flexible-deadlines.php) This is practitioner guidance, not research.
- A community-college organisation (OES) writes on assignment flexibility and student success. It is a vendor-style source, so treat claims cautiously. [OES](https://oes.com/us/blog/why-assignment-flexibility-matters-for-student-success-in-community-colleges/)

### Reading across the sources

- Automatic windows remove the need to ask. Asking is itself a cost, particularly for students who feel shame. This is [est], linked to the stigma evidence in section 5.
- Flexibility without limits risks pile-ups. A bounded window plus a visible pattern is the compromise supported here.
- The evidence base is thin. All of it is from small or single-course studies. None is a randomised trial in US universities.

### Conflict check

I found nothing against a Whiteboard rule. But the evidence does not tell us what grace length is right. That should be an instructor setting with a sensible default. The instructor test group should say what default they would choose.

---

## 5. Extensions and accommodations without stigma

### Evidence

- Leonard and Sasso (2026): a phenomenological study of six undergraduates with ADHD, depression or anxiety. They faced perceptions of being "lazy" or gaming the system because of accommodations. [Georgia Southern](https://digitalcommons.georgiasouthern.edu/gcpa/vol42/iss1/1)
  - Limits: six participants, one institution, qualitative.
- Gernsbacher's work at Wisconsin-Madison found respondents accepted sign interpreters and Braille as fair, but not extended time or flexible deadlines for psychological disabilities. Most requested accommodations were granted once asked. [APA GradPSYCH](https://www.apa.org/gradpsych/2015/04/dispelling-myths)
  - Limits: a magazine summary. Public opinion, not student outcomes.
- A US Department of Education survey (April 2022), cited by a student newspaper, reported that only 37% of students with disabilities told their college, and 85% of those received accommodations. A Mental Health America survey, cited the same way, reported 70% of students with mental health disabilities did not register. [The Sunflower](https://thesunflower.com/79369/news/what-wichita-state-gets-right-when-accommodating-students-with-disabilities-and-areas-to-improve)
  - Limits: secondary reporting. Check the original federal tables before using the numbers in any external document.
- Freedman (2020, Critical Education) reports stigma and discrimination from having to disclose and negotiate accommodations with instructors. [Critical Education](https://ices.library.ubc.ca/index.php/criticaled/article/view/186504/185583)
- A University of Minnesota piece argued universal design could reduce reliance on individual accommodations. [MN Daily](https://mndaily.com/uncategorized/u-mulls-universal-accommodation/03/02/2016/snoadmin/) This is journalism, not research.

### Design reading

- A student should see only their own time: "Your time: 60 min" with no reason attached. Other students never see another student's allowance.
- Instructors and TAs should see the allowance where they grade or proctor, but with the reason hidden unless they have a legitimate need. The accommodation reason should live with the disability office, not the course.
- Apply accommodations automatically from an approved record. Do not require a student to ask the instructor again each quiz. This follows the "negotiation costs" finding in Freedman.
- Do not show a badge such as "Accommodated" in rosters, gradebooks or the TA queue. Use neutral language like "Adjusted time".
- Per-student extensions for non-disability reasons (illness, family emergency) should use the same neutral display, so the UI does not sort students into groups.
- Confidence is medium because the evidence is qualitative and small, but the direction is consistent.

---

## 6. Cognitive load, forms and dashboards

### Theory, with caveats

- Cognitive load theory (Sweller and colleagues) separates intrinsic load (the inherent difficulty of the material), extraneous load (how it is presented) and germane load (effort on building lasting knowledge). Design guidance is to cut extraneous load. [Sweller 2010 in Educational Psychology Review, via Springer](https://link.springer.com/article/10.1007/s10648-010-9133-8), [Kirschner 2002 summary](https://www.researchgate.net/profile/Paul-Kirschner/publication/222830815_Cognitive_load_theory_Implications_of_cognitive_load_theory_on_the_design_of_learning/links/6075346ea6fdccb8195985d9/Cognitive-load-theory-Implications-of-cognitive-load-theory-on-the-design-of-learning.pdf)
  - Caveat: CLT was built for instructional design (learning new material), not for interface design. Applying it to dashboards is an analogy [est]. The germane-load category is itself disputed in the literature; I did not verify the details.
- Cowan (2001, Behavioral and Brain Sciences) argues that Miller's "7 plus or minus 2" was a rough estimate and the real limit in the focus of attention is about four chunks, under conditions where chunking and rehearsal are blocked. Other commentators in the same issue disputed how clear the limit is. [PubMed](https://pubmed.ncbi.nlm.nih.gov/11515286/), [Cambridge](https://www.cambridge.org/core/journals/behavioral-and-brain-sciences/article/magical-number-4-in-shortterm-memory-a-reconsideration-of-mental-storage-capacity/44023F1147D4A1D44BDC0AD226838496)
  - Caveat: the number is a lab estimate for memory, not a rule for how many menu items or cards a screen may hold. Do not write "max 4 items" in a design system.
- Hick-Hyman law links choice time to number of options. Critiques say it was tested on simple, equally likely, practised stimuli. It is logarithmic, so cutting options helps less than people assume. The variable that matters in interfaces is often uncertainty and information to process, not option count. [IxDF](https://ixdf.org/literature/article/the-hick-hyman-law-an-argument-against-complexity-in-user-interface-design)
  - Caveat: this critique is from secondary sources. I did not find an NN/g article on the law.

### Pop-psychology flag

Articles that say "Hick's law means fewer than N menu items" or "people hold 7 things in mind so use 7 tabs" overclaim. Treat these as prompts to test, not rules.

### Design reading

- Prefer one primary question per screen state (what needs me now?) over many equal-weight widgets. This is [est] and should be tested with the 10 participants.
- Group related status into labelled chunks (for example "Due soon", "Waiting on a grade", "New feedback") rather than one long mixed list.
- Remove decoration and duplicate controls. That is extraneous load in the CLT sense.
- Do not hide frequent actions behind menus just to cut the count of visible options. Findability suffers. [IxDF](https://ixdf.org/literature/article/the-hick-hyman-law-an-argument-against-complexity-in-user-interface-design)
- For long forms (course setup, grading rubrics), split into steps with a visible summary of what is done. The anxiety here is uncertainty about what remains.

---

## 7. Status clarity and system trust

- Nielsen's heuristic 1 says the system should keep users informed through feedback within reasonable time. Progress indicators reassure users that a longer wait is normal. NN/g notes the idea reaches beyond screens. [NN/g](https://www.nngroup.com/articles/visibility-system-status/)
  - Limits: the heuristic is expert judgement from 1994, not an experimental result. It is a well-used checklist item. Secondary blog results repeated it; I rely on the NN/g page.
- The link from uncertainty to anxiety shows up in the proctoring work (section 9) and the Open University project, where reducing uncertainty reduced anxiety. [Moorman et al.](https://university.open.ac.uk/scholarship-and-innovation/esteem/sites/www.open.ac.uk.scholarship-and-innovation.esteem/files/resources/Moorman%20F.%20Warriner%20G.%20and%20Whitehead%20B.%20%282024%29%20Anxiety%20of%20online%20exams.%20eSTEeM%20Final%20Report.pdf)
- Whiteboard's "Graded is not Released" rule is a status problem. A student whose work is graded but not released sees nothing. That silence is ambiguous: lost, late or pending?

Design reading:

- Give every submission a visible state with plain words and a timestamp: Submitted, Being graded, Graded (waiting for your instructor to release), Released.
- For the student, do not show the grade, but do show that grading is under way, if the instructor chooses. Say who controls the next step ("Your instructor releases feedback"). This respects the authority rule and reduces the empty-silence problem. Confidence: medium; needs testing, because some instructors may not want progress shown.
- Show an expected-by date when the instructor has set one. Do not invent one.
- Use real pending states. Never show a spinner or "Almost done" without actual progress.

---

## 8. Error prevention versus undo for irreversible actions

### Sources

- Secondary summaries of Nielsen's error-prevention heuristic say confirmations suit actions with serious consequences, should restate what will happen, and should avoid preselected answers. Undo is a recovery mechanism, not prevention. If undo is impossible, a type-to-confirm step is a fallback. [Destructive action modals](https://uxpsychology.substack.com/p/how-to-design-better-destructive), [Educative summary](https://www.educative.io/answers/error-prevention-how-to-prevent-conscious-user-mistakes)
  - Limits: I did not retrieve the NN/g article itself, so these are secondary. The substack is practitioner opinion.

### Reading for Whiteboard

Whiteboard has two irreversible events: student submission (immutable receipt) and instructor release of feedback (snapshot). Undo cannot be offered for either without breaking the product rule. That means prevention carries the load. This is [est].

- Submission: show a review step listing what will be sent (files, answers, count, any blank answers), then a single clear button. After submission, show the receipt at once. For files, show filename, size and a received time with seconds.
- If a student submits the wrong file, the fix is a new attempt where the policy allows, not an edit to the receipt. Say that before they press submit.
- Release: show a summary before the instructor releases ("142 students will see grades and comments; 6 are still ungraded; 3 have regrade flags"). Make the consequence concrete and count-based. Block or warn about ungraded work.
- TAs cannot release. Do not show them a disabled release button with no explanation. Show who can release it.
- Avoid confirmation fatigue: do not put confirmations on routine actions. Reserve them for the two irreversible ones.

Conflict note: a short post-submit undo window would be the usual consumer pattern, but it conflicts with the immutable-receipt rule. The right answer here is stronger pre-submit review, not a loophole.

---

## 9. Proctoring, surveillance stress and privacy

Whiteboard has not decided on proctoring. Still, it is the sharpest case of surveillance in assessment.

- Balash et al. (SOUPS 2021): a survey of 102 students who took proctored exams. About half were at least moderately concerned about installing proctoring software on personal computers, and 52% agreed or strongly agreed it was too privacy invasive. [arXiv](https://arxiv.org/pdf/2106.05917)
  - Limits: 102 students, mostly one setting.
- Chaudhry et al. (SOUPS 2022 poster): 14 interviews. A main theme was students' uncertainty about what the software could do, caused by a lack of transparency. [Poster abstract](https://perl.sce.carleton.ca/assets/pdfs/Chaudhry2022_posterAbstract_soups.pdf)
  - Limits: 14 interviews, a poster.
- A Leiden medical-student survey (597 respondents): internet failure and anxiety that the software would wrongly flag behaviour were the most common reasons for disapproval. Most would still accept proctoring if it prevented study delay. [Springer](https://link.springer.com/doi/10.1007/s40670-021-01420-w)
  - Limits: medical students, Netherlands.
- Kwapisz (arXiv 2025) examines surveillance features that worsen anxiety for students with disabilities. I did not read the paper. [arXiv](https://arxiv.org/pdf/2511.10826.pdf)
- A 2025 conference abstract links privacy concern to AI anxiety, which mediates trust and satisfaction. [COTL 2025](https://cotl2025.sched.com/event/21iwZ/what-is-proctoring-my-exam-the-impact-of-artificial-intelligence-anxiety-and-trust-in-technology-on-student-satisfaction)
  - Limits: abstract only.

Reading: the recurring factors are false-flag fear, device intrusion, lack of transparency and technical failure. A prototype that never proctors avoids most of this. Because the project states no AI inference or live integration exists, Whiteboard should not imply monitoring it does not perform. If any integrity signal is ever shown (for example tab-switch counts), say exactly what is recorded and who sees it. That is [est].

---

## 10. Notifications and interruptions

- Altmann and Trafton's goal-activation work shows a "resumption lag" after an interruption, and that even very brief interruptions carry a cost. Longer or more demanding interruptions take longer to recover from. Cues during the interruption reduce the lag. [Hodgetts & Jones](https://www.interruptions.net/literature/Hodgetts-JEP_LMC06.pdf), [Cognitive Science Society paper](https://escholarship.org/content/qt18b4r661/qt18b4r661.pdf)
  - Limits: lab tasks, mostly not students using an LMS.
- Hodgetts and Jones (2007) applied it to pop-ups and alerts. The cost of retrieving the goal was greater after 15 seconds than after 5 seconds. [Hodgetts HCII07](https://www.interruptions.net/literature/Hodgetts-HCII07.pdf)
- A study of 381 college students found the mere presence of a phone during a lecture reduced attention and memory, and noticeable distraction by texts reduced learning further. [PsyPost summary](https://www.psypost.org/just-cell-phone-possession-can-impair-learning-study-suggests/)
  - Limits: I saw a news summary of the journal study. Lecture, not LMS notifications.
- A German experiment (93 students) tested push notifications from a game during a lecture. I did not retrieve the results. [Marburg archive](https://archiv.ub.uni-marburg.de/es/2022/0166/pdf/1-s2.0-S2451958822000045-main.pdf)
- A review paper argues that notifications are designed to attract attention, so they are likely to distract. [Ochs & Sonderegger 2021, via Bremen blog summary](https://blogs.uni-bremen.de/inform/?p=175)

I found no LMS-specific notification research for students, instructors or TAs. That is a gap. Everything below is [est].

Design reading:

- Never push notifications or banners into an active quiz. Suppress all non-essential notices while a timed attempt is open.
- Batch routine items (new announcement, new discussion reply) into a digest the user chooses. Send immediate notices only for time-critical things (quiz about to close, feedback released).
- Make each notification say what happened and where to act on it, so the user can resume the previous task.
- For TAs, a grading queue should not be interrupted by chat-like alerts. Resumption cost is highest in focused marking.

---

## 11. Dark patterns and gamified pressure

- No peer-reviewed study that directly tests Duolingo-style streaks for anxiety turned up in my search. The material is blogs and industry write-ups. [Decision Lab](https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification), [Mobbin](https://mobbin.com/blog/streaks-are-about-losing-a-study-of-859-streak-designs)
- The Decision Lab says streaks can shift attention from learning to keeping the streak. It cites a Journal of Consumer Research finding that users who break streaks are more likely to quit. I could not verify that paper. [Decision Lab](https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification)
- Duolingo's own blog says its streak draws on loss aversion. [Duolingo blog](https://blog.duolingo.com/how-duolingo-streak-builds-habit) Secondary reports say easing streak rules (such as weekend protection) worked better than strict ones. These figures are from write-ups, not published studies, and the company is selling retention. Treat them as vendor claims.
- Loss aversion itself is from Kahneman and Tversky's prospect theory, but the "twice as powerful" figure quoted in blogs is a rough average and varies by study. I did not verify it here.

Reading for a course app:

- Avoid streaks for attendance, logins or reading. A missed day should not become a visible loss. In a graded course, pressure from a streak can be mistaken for course expectation.
- No public leaderboards of grades or speed. No "X classmates have already submitted" counters. These raise social comparison and are unsupported by evidence of benefit [est].
- No false urgency (red countdown banners days before a due date, "only 2 hours left!" language when the true deadline is days away).
- Positive progress markers tied to real course state (all assignments submitted this week) are fine if they never turn into a penalty display.
- Dark-pattern examples: pre-ticked consent boxes, hidden decline buttons, guilt-trip wording on declining reminders. Do not use them in notifications settings.

---

## Where the evidence is weak (summary)

| Topic | Strength | Note |
|---|---|---|
| Timer choice | Low to medium | One CS study, n=113. No hidden-timer test. |
| Connection loss | Medium (descriptive) | Many forum and institutional reports. No frequency data. |
| Late start rules | Very low | No research found. |
| Grace periods | Low to medium | Single-course and conference studies. |
| Accommodation stigma | Medium (qualitative) | Consistent but small. |
| CLT, Hick, Miller | Theory, contested for UI | Do not treat as design laws. |
| Proctoring stress | Medium | Several surveys, small samples. |
| Notifications | Low for LMS | Lab and lecture evidence only. |
| Streak harms | Low | Mostly blogs and vendor claims. |

---

## Design implications for Whiteboard

1. Show a quiet, always-visible countdown during timed quizzes, with a "collapse to small" control and an on-demand time check. Roles: student. Evidence: [SIGCSE 2023](https://sigcse2023.sigcse.org/details/sigcse-ts-2023-papers/55/Providing-a-Choice-of-Time-Trackers-on-Online-Assessments). Confidence: Medium. The hide option itself is unproven [est].
2. Keep the timer calm until the last stretch. Escalate colour or emphasis only in the final minutes, and never add sound by default. Roles: student. Evidence: students preferred graphical, colour-changing timers per the same study, plus [Cherif 2025](https://www.mmi.ifi.lmu.de/pubdb/publications/pub/cherif2025stress/cherif2025stress.pdf). Confidence: Low.
3. Show a per-question save indicator with a time (for example "Saved 10:42:07") and an explicit "Not saved, connection lost" state. Roles: student, instructor. Evidence: [Canvas Ideas request](https://community.canvaslms.com/t5/Canvas-Ideas/New-Quizzes-Show-connection-status-offer-a-save-button-with/idi-p/572851), [UBC](https://lthub.ubc.ca/technology-tips/internet-connection/), [NN/g](https://www.nngroup.com/articles/visibility-system-status/). Confidence: High.
4. Queue answers locally on connection loss and say so, along with what the timer is doing. Decide and publish one rule for offline time (does the clock keep running; is there a short save window). Roles: student, instructor. Evidence: [Wharton](https://support.wharton.upenn.edu/help/administering-and-troubleshooting-online-exams), [Stanford](https://med.stanford.edu/edtech/services/lms/medcanvas/exams). Confidence: Medium.
5. Give instructors a quiz activity log (save times, disconnects, start and end) to resolve disputes. Roles: instructor, TA. Evidence: [WWU guide](https://atus.wwu.edu/kb/canvas-quiz-best-practices). Confidence: Medium.
6. Before a quiz starts, state in plain words the time this student will actually get, including late-start arithmetic, with a time zone and seconds. Roles: student. Evidence: [Canvas Community confusion thread](https://community.canvaslms.com/t5/Archived-Questions/When-a-student-starts-quiz/m-p/234794) plus [est]. Confidence: Medium.
7. Offer an automatic, bounded, penalty-free grace window as an instructor setting, with a clearly shown default and the exact new deadline on the student's assignment. Roles: instructor, student. Evidence: [Cochrane et al. 2026](https://mro.massey.ac.nz/items/5037646a-8837-4c57-8772-81ed0d059bf4/full), [ASEE 2024](https://peer.asee.org/47200.pdf). Confidence: Medium.
8. Show instructors a summary of how many students used the grace window and extensions, so they can spot disengagement early. Roles: instructor, TA. Evidence: Cochrane et al. found early non-submission predicted continued non-submission. Confidence: Low to Medium.
9. Apply approved accommodations and extensions automatically, and show the student only their own adjusted time in neutral words ("Your time: 60 min"). Never show a reason or a badge to peers. Roles: student, instructor, TA. Evidence: [Leonard & Sasso](https://digitalcommons.georgiasouthern.edu/gcpa/vol42/iss1/1), [Freedman 2020](https://ices.library.ubc.ca/index.php/criticaled/article/view/186504/185583). Confidence: Medium.
10. In rosters, gradebooks and TA queues use neutral language such as "Adjusted time" and keep the reason out of course views. Roles: instructor, TA. Evidence: same as item 9 [est]. Confidence: Medium.
11. Use one primary question per screen state and group dashboard items into labelled chunks, instead of enforcing numeric limits from Miller or Hick. Roles: all. Evidence: [Cowan 2001](https://pubmed.ncbi.nlm.nih.gov/11515286/), [IxDF critique](https://ixdf.org/literature/article/the-hick-hyman-law-an-argument-against-complexity-in-user-interface-design). Confidence: Low. Test it.
12. Do not hide frequent actions in menus only to cut visible choices. Roles: all. Evidence: [IxDF](https://ixdf.org/literature/article/the-hick-hyman-law-an-argument-against-complexity-in-user-interface-design). Confidence: Medium.
13. Split long setup and grading forms into steps with a visible "done and remaining" summary. Roles: instructor, TA. Evidence: [Kirschner summary of CLT](https://www.researchgate.net/profile/Paul-Kirschner/publication/222830815_Cognitive_load_theory_Implications_of_cognitive_load_theory_on_the_design_of_learning/links/6075346ea6fdccb8195985d9/Cognitive-load-theory-Implications-of-cognitive-load-theory-on-the-design-of-learning.pdf) [est: analogy from instruction to UI]. Confidence: Low.
14. Show every submission and grade in a plain-language state with a timestamp (Submitted, Being graded, Graded and waiting for release, Released), and say who controls the next step. Roles: student, TA, instructor. Evidence: [NN/g](https://www.nngroup.com/articles/visibility-system-status/), [Moorman et al.](https://university.open.ac.uk/scholarship-and-innovation/esteem/sites/www.open.ac.uk.scholarship-and-innovation.esteem/files/resources/Moorman%20F.%20Warriner%20G.%20and%20Whitehead%20B.%20%282024%29%20Anxiety%20of%20online%20exams.%20eSTEeM%20Final%20Report.pdf). Confidence: Medium to High.
15. Before final submission, show a review screen listing exactly what will be sent, flagging blank answers, then show the immutable receipt immediately after. Say before submit that the receipt cannot be edited. Roles: student. Evidence: [destructive-action guidance](https://uxpsychology.substack.com/p/how-to-design-better-destructive), [est]. Confidence: Medium.
16. Before release, show the instructor a count-based summary (how many students, how many ungraded, how many flagged) and block or warn on ungraded work. Roles: instructor. Evidence: same as item 15 [est]. Confidence: Medium.
17. When a TA sees release disabled, say who can release it rather than showing an unexplained disabled button. Roles: TA. Evidence: [NN/g](https://www.nngroup.com/articles/visibility-system-status/) [est]. Confidence: Medium.
18. Use confirmations only for the two irreversible events (submit, release). Do not add them to routine actions. Roles: all. Evidence: [Educative summary](https://www.educative.io/answers/error-prevention-how-to-prevent-conscious-user-mistakes) [est]. Confidence: Low to Medium.
19. Do not claim or imply monitoring or integrity checks that the product does not perform. If any signal is ever recorded, say what, and who sees it. Roles: student, instructor. Evidence: [Chaudhry et al.](https://perl.sce.carleton.ca/assets/pdfs/Chaudhry2022_posterAbstract_soups.pdf), [Balash et al.](https://arxiv.org/pdf/2106.05917). Confidence: Medium.
20. Suppress non-essential notifications while a timed quiz is open, and batch routine ones into a user-chosen digest. Roles: student, instructor, TA. Evidence: [Hodgetts & Jones](https://www.interruptions.net/literature/Hodgetts-JEP_LMC06.pdf), [Hodgetts 2007](https://www.interruptions.net/literature/Hodgetts-HCII07.pdf). Confidence: Medium for suppression, Low for batching [est].
21. Write notifications so the user can resume what they were doing: what happened, where, what to do next. Roles: all. Evidence: cue findings in [Cognitive Science Society paper](https://escholarship.org/content/qt18b4r661/qt18b4r661.pdf). Confidence: Low.
22. Do not use streaks, public speed or grade leaderboards, "X classmates already submitted" counters, or false-urgency wording. Roles: student. Evidence: [Decision Lab](https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification) (non-peer-reviewed) [est]. Confidence: Low to Medium.

---

## Open questions for user testing

1. Would students want to hide the countdown during a quiz? Do those who hide it feel calmer, or do they check the time more often by other means? Test: let students toggle and watch what they do.
2. When a connection drops mid-quiz in a mock-up, which wording and which rule about the clock feels fair to students and to instructors? Show two versions of the message.
3. What default grace-window length would the three instructors choose, and what would make them turn it off? Do they want to see who used it?
4. How would TAs and instructors feel about seeing "Adjusted time" next to a student's name? Is there any case where they need the reason?
5. Do students want to see "Being graded" before release, or does it add pressure? Do instructors want that status shown at all?
6. At the submit review screen and the release summary, which details do participants actually read, and which do they skip? Where does the confirmation feel like friction?

---

## Sources

- [Providing a Choice of Time Trackers on Online Assessments, SIGCSE 2023](https://sigcse2023.sigcse.org/details/sigcse-ts-2023-papers/55/Providing-a-Choice-of-Time-Trackers-on-Online-Assessments)
- [Cherif et al. 2025, LMU Munich stress study](https://www.mmi.ifi.lmu.de/pubdb/publications/pub/cherif2025stress/cherif2025stress.pdf)
- [Moorman, Warriner and Whitehead 2024, OU eSTEeM final report](https://university.open.ac.uk/scholarship-and-innovation/esteem/sites/www.open.ac.uk.scholarship-and-innovation.esteem/files/resources/Moorman%20F.%20Warriner%20G.%20and%20Whitehead%20B.%20%282024%29%20Anxiety%20of%20online%20exams.%20eSTEeM%20Final%20Report.pdf)
- [OU project page](https://oro.open.ac.uk/102268)
- [UBC internet connection tips](https://lthub.ubc.ca/technology-tips/internet-connection/)
- [Wharton online exam troubleshooting](https://support.wharton.upenn.edu/help/administering-and-troubleshooting-online-exams)
- [Stanford Canvas exam recommendations](https://med.stanford.edu/edtech/services/lms/medcanvas/exams)
- [WWU Canvas quiz best practices](https://atus.wwu.edu/kb/canvas-quiz-best-practices)
- [Canvas Ideas: connection status request](https://community.canvaslms.com/t5/Canvas-Ideas/New-Quizzes-Show-connection-status-offer-a-save-button-with/idi-p/572851)
- [Canvas Community: answers not saved](https://community.canvaslms.com/t5/Canvas-Question-Forum/Canvas-Quiz-Answers-changes-not-saved/m-p/495028)
- [Canvas Community: extra minutes with slow connection](https://community.canvaslms.com/t5/Archived-Questions/ARCHIVED-Canvas-giving-students-5-extra-minutes-with-a-slow/m-p/503211)
- [Canvas Community: when a student starts quiz](https://community.canvaslms.com/t5/Archived-Questions/When-a-student-starts-quiz/m-p/234794)
- [Cochrane, Erueti and Jin 2026, grace period study](https://mro.massey.ac.nz/items/5037646a-8837-4c57-8772-81ed0d059bf4/full)
- [ASEE 2024 flexible deadlines paper](https://peer.asee.org/47200.pdf)
- [ASEE late policies in programming](https://strategy.asee.org/impact-of-late-policies-on-submission-behavior-and-grades-in-computer-programming.pdf)
- [University of Saskatchewan flexible deadlines](https://teaching.usask.ca/articles/2026-01-26-flexible-deadlines.php)
- [OES assignment flexibility](https://oes.com/us/blog/why-assignment-flexibility-matters-for-student-success-in-community-colleges/)
- [Leonard and Sasso 2026, accommodations stigma](https://digitalcommons.georgiasouthern.edu/gcpa/vol42/iss1/1)
- [APA GradPSYCH, Gernsbacher](https://www.apa.org/gradpsych/2015/04/dispelling-myths)
- [The Sunflower, citing ED and MHA surveys](https://thesunflower.com/79369/news/what-wichita-state-gets-right-when-accommodating-students-with-disabilities-and-areas-to-improve)
- [Freedman 2020, Critical Education](https://ices.library.ubc.ca/index.php/criticaled/article/view/186504/185583)
- [MN Daily, universal accommodation](https://mndaily.com/uncategorized/u-mulls-universal-accommodation/03/02/2016/snoadmin/)
- [Sweller 2010, Educational Psychology Review](https://link.springer.com/article/10.1007/s10648-010-9133-8)
- [Kirschner, cognitive load theory implications](https://www.researchgate.net/profile/Paul-Kirschner/publication/222830815_Cognitive_load_theory_Implications_of_cognitive_load_theory_on_the_design_of_learning/links/6075346ea6fdccb8195985d9/Cognitive-load-theory-Implications-of-cognitive-load-theory-on-the-design-of-learning.pdf)
- [Cowan 2001, PubMed](https://pubmed.ncbi.nlm.nih.gov/11515286/)
- [Cowan 2001, Cambridge](https://www.cambridge.org/core/journals/behavioral-and-brain-sciences/article/magical-number-4-in-shortterm-memory-a-reconsideration-of-mental-storage-capacity/44023F1147D4A1D44BDC0AD226838496)
- [IxDF, Hick-Hyman law](https://ixdf.org/literature/article/the-hick-hyman-law-an-argument-against-complexity-in-user-interface-design)
- [NN/g, visibility of system status](https://www.nngroup.com/articles/visibility-system-status/)
- [UX Psychology, destructive action modals](https://uxpsychology.substack.com/p/how-to-design-better-destructive)
- [Educative, error prevention](https://www.educative.io/answers/error-prevention-how-to-prevent-conscious-user-mistakes)
- [Balash et al. 2021, Examining the Examiners](https://arxiv.org/pdf/2106.05917)
- [Chaudhry et al. 2022 poster abstract](https://perl.sce.carleton.ca/assets/pdfs/Chaudhry2022_posterAbstract_soups.pdf)
- [Leiden medical student proctoring survey, Springer](https://link.springer.com/doi/10.1007/s40670-021-01420-w)
- [Kwapisz 2025, arXiv](https://arxiv.org/pdf/2511.10826.pdf)
- [COTL 2025 abstract on AI anxiety and proctoring](https://cotl2025.sched.com/event/21iwZ/what-is-proctoring-my-exam-the-impact-of-artificial-intelligence-anxiety-and-trust-in-technology-on-student-satisfaction)
- [Hodgetts and Jones, JEP LMC 2006](https://www.interruptions.net/literature/Hodgetts-JEP_LMC06.pdf)
- [Hodgetts and Jones, HCII 2007](https://www.interruptions.net/literature/Hodgetts-HCII07.pdf)
- [Cognitive Science Society resumption paper](https://escholarship.org/content/qt18b4r661/qt18b4r661.pdf)
- [PsyPost, phone possession and learning](https://www.psypost.org/just-cell-phone-possession-can-impair-learning-study-suggests/)
- [Marburg archive, push notification experiment](https://archiv.ub.uni-marburg.de/es/2022/0166/pdf/1-s2.0-S2451958822000045-main.pdf)
- [Bremen blog summary of notification research](https://blogs.uni-bremen.de/inform/?p=175)
- [Decision Lab, streak creep](https://thedecisionlab.com/insights/consumer-insights/streak-creep-the-perils-of-too-much-gamification)
- [Mobbin, 859 streak designs](https://mobbin.com/blog/streaks-are-about-losing-a-study-of-859-streak-designs)
- [Duolingo blog, streak and habit](https://blog.duolingo.com/how-duolingo-streak-builds-habit)

No prompt-injection instructions were seen in fetched material (I used search results only, with no page fetches).
