# UX and psychology research: synthesis

As of: 15 November 2026

This combines five desk-research files on how students, instructors and TAs think, feel and behave with course software. It is input for step 2 of the plan in `NOTES.md`: walk the 12 journeys by role against this research and Nielsen's 10 heuristics. It is desk research, not user testing. Only the planned sessions with real participants can confirm that a design works.

| File | Role / topic | Design rules |
|---|---|---|
| [01_students.md](01_students.md) | Students | 17 |
| [02_instructors.md](02_instructors.md) | Instructors | 23 |
| [03_tas_grading.md](03_tas_grading.md) | TAs and the grading workflow | 20 |
| [04_assessment_psychology.md](04_assessment_psychology.md) | Timed work, deadlines, status, undo (cross-role) | 22 |
| [05_accessibility_inclusion.md](05_accessibility_inclusion.md) | Accessibility, inclusion, legal baseline | 25 |

## Key takeaways

- **The product's core rules are backed by evidence. The gaps are in how they're shown.** The evidence supports "Graded ≠ Released", immutable receipts and narrow TA scope ([02 §5](02_instructors.md), [03 §7](03_tas_grading.md), [01 §5](01_students.md)). Most of the work ahead is making these states visible, calm and worded the same way everywhere.
- **Scores should not lead.** When students see the grade before the comments, they engage less with the feedback. One randomised study (116 students) found that showing feedback before marks improved later performance and engagement. Whiteboard should show "Feedback ready" on Home and in alerts, never the score ([01 §7](01_students.md)). This extends the deep dive's grade-leak fix.
- **Fear of irreversible actions is the main instructor and TA anxiety.** The fix: review before anything that can't be undone, undo for everything else, and a logged correction path after release ([02 §5](02_instructors.md), [04 §8](04_assessment_psychology.md)).
- **Defaults are not neutral.** Alphabetical grading order measurably lowers scores for students later in the alphabet. Rubrics alone don't make graders consistent. Courses copied from last term carry stale dates. Whiteboard should choose its defaults on purpose: random grading order, hold-before-release, and a check list after copying ([03 §3–4](03_tas_grading.md), [02 §2](02_instructors.md)).
- **Accessibility is a legal deadline and a test of core screens.** WCAG 2.1 AA applies to public universities from 26 April 2027 (50,000+ population) or 26 April 2028 (smaller). Existing LMSs fail most often in quizzes, grading tools, editors and math, which are Whiteboard's core screens. Build to WCAG 2.2 AA ([05 §1, §3](05_accessibility_inclusion.md)).

## Cross-cutting design rules

These are the rules that more than one file reached on its own, or that a file showed are decisive. Step 2 should check every journey against them first. Per-role rules stay in the role files.

1. **One status vocabulary, text plus icon plus colour, in the same words for every role.** Draft, Submitted, Late, Graded · staff only, Released, Missing. Students see no hint of a score before release. ([01 #11](01_students.md), [05 #13, #21](05_accessibility_inclusion.md), D25, BD4)
2. **Submission is the one irreversible student action, so it gets a review step and a real receipt.** Before submit, list what will be sent and flag blanks. After submit, show the receipt: item, course, time with seconds and time zone, receipt ID and files. The receipt is text that can be copied, can be found later, and shows no indefinite spinner. ([01 #4–6](01_students.md), [04 #15](04_assessment_psychology.md), [05 #14](05_accessibility_inclusion.md))
3. **Release is a deliberate instructor step with a student-view preview.** Hold is the default. Release shows who will see what and how many students are affected. TAs see "Graded · staff only" and have no release control. ([02 #1–4](02_instructors.md), [03 #11](03_tas_grading.md))
4. **Post-release correction is logged, not silent.** This is already decided: Q01.3 shows "Feedback updated" with old → new and keeps the earlier release, and Q02.3/D27 say rubric changes don't re-score released work. Instructors' demand for undo is met this way, not by editing the snapshot. ([02 #6](02_instructors.md), [03 #10](03_tas_grading.md))
5. **Undo everywhere else.** Grading shortcuts, rubric application and settings edits are undoable within the session, with a visible "Applied: X". Confirmation dialogs are kept for actions that truly can't be reversed. ([02 #5](02_instructors.md), [03 #2](03_tas_grading.md))
6. **Timed work: show the rules before Start, save honestly, and adjust per student.** Before Start, show the window, the limit and the late-start effect. Show "Saved / not yet saved" and a connection state. Accommodation time is set per student and carries through the BD3 end rule, so a late start never removes accommodated time. The timer is shown but not animated, and isn't announced every second. ([04 §1–3](04_assessment_psychology.md), [05 #4, #22](05_accessibility_inclusion.md))
7. **Few, actionable alerts by default.** Students get due soon, not yet submitted and feedback ready, each linking to the item. Instructors get digests and quiet hours. Announcements and discussions are opt-in or digested. ([01 #7](01_students.md), [02 #18](02_instructors.md), [04 §10](04_assessment_psychology.md))
8. **Locked things say who owns them.** Registrar roster rows, department settings and TA-scope limits each show their owner and a "Request change" path. Never show a disabled control without a reason. ([02 #10–11](02_instructors.md), [03 #12](03_tas_grading.md))
9. **Staff power tools are keyboard-first, but never at a screen reader's cost.** Number keys apply rubric items. Single-key shortcuts can be turned off or remapped (WCAG 2.1.4). Every shortcut has a visible control. ([03 #2–3](03_tas_grading.md), [05 #12](05_accessibility_inclusion.md))
10. **Default grading order is random, and the order is shown.** ([03 #4](03_tas_grading.md))
11. **Same layout in every course, one cross-course "What's due" list, and dates in the user's own time zone with the zone named.** ([01 #1–3](01_students.md))
12. **Fixed help location, no re-entering data, and paste and password managers allowed at sign-in.** These are WCAG 2.2 criteria 3.2.6, 3.3.7 and 3.3.8, and they matter most in the join-course and setup journeys this prototype tests first. ([05 #8–10](05_accessibility_inclusion.md))

## Conflicts found, and what this library adopts

| # | Conflict | Adopted | Why |
|---|---|---|---|
| C1 | [03 #18](03_tas_grading.md) proposes a TA "preview as student". | **Keep BD2: no TA preview.** Rule 18 stays in 03 only as a rejected option. | BD2 rests on the Spec 02 permission matrix (preview exposes unreleased material). The 03 file found no evidence for TA preview. |
| C2 | Usual consumer "undo send" versus immutable receipts ([04 §8](04_assessment_psychology.md)). | **Review step before submit, no undo after.** | Keeps the receipt rule. Error prevention fits an irreversible action better than undo. |
| C3 | Instructors want undo or quick correction versus immutable release snapshots ([02 §11](02_instructors.md)). | **Logged correction per Q01.3/D27.** | Already decided. It meets the need without editing the snapshot. |
| C4 | Does a release have a "recall" (hide again)? [02 #3](02_instructors.md) says to state it either way. | **Open: no decision exists.** Proposed for the first HTML: no recall, and the release dialog says so. | The deep-dive and decisions files have no recall rule. Recall would make "Released" less trustworthy for students. Step 2 should check this in J-journeys with release. |
| C5 | Anonymous grading ([03 #5](03_tas_grading.md)) versus section-scoped TAs and regrades. | **Open.** Names hidden during grading is compatible; the regrade reveal point needs a rule. | No decision covers anonymity. Step 2 should note it, not decide it alone. |
| C6 | Student-side label for graded-not-released: [01 #11](01_students.md) suggests "Being reviewed". | **Open for step 2.** | D25 names only the staff label. Any student-visible change after grading still tells the student that grading happened. Test whether students prefer plain "Submitted" until release. |
| C7 | Test participant counts: NOTES plans 5 students, 3 instructors, 2 TAs. The usability skill says about 5 per role. | **Keep 5/3/2 for the first round and say it is a small sample.** | Recruiting is the bottleneck. A second round can add instructors and TAs. |

No conflict with earlier research: the Title II dates in [05](05_accessibility_inclusion.md) match `research/04_cross_cutting/notes.md` (26 April 2027 / 2028).

## Coordinator verification (15 Nov 2026)

I fetched the primary pages myself for the claims that most affect decisions:

- **DOJ interim final rule** ([govinfo, 91 FR, 20 April 2026](https://www.govinfo.gov/content/pkg/FR-2026-04-20/html/2026-07663.htm)): confirmed 26 April 2027 for entities with 50,000+ population and 26 April 2028 for smaller entities, with the WCAG 2.1 Level AA standard. Comments were due 22 June 2026, so DOJ may still change it.
- **Mark withholding** ([St Andrews portal](https://research-portal.st-andrews.ac.uk/en/publications/effects-of-temporary-mark-withholding-on-academic-performance/)): confirmed as Kuepper-Tetzel and Gardner 2021, *Psychology Learning & Teaching*. Experiment 1 had 116 Year 2 students, randomised. Experiment 2 compared 97 students with a historical cohort of 90. The finding: positive effects on later performance and on feedback engagement. It is one UK university.
- **Grace period** ([Massey repository](https://mro.massey.ac.nz/items/5037646a-8837-4c57-8772-81ed0d059bf4/full)): confirmed as Cochrane, Erueti and Jin 2026, *Journal of Further and Higher Education*, with 198 students in one online first-year course. "Assessment marks did not differ meaningfully across submission categories."
- **Grading-order bias** ([SSRN 4603146](https://papers.ssrn.com/abstract=4603146)): the paper exists, by Wang, Pei and Li, now expanded to about 70 million Canvas records and revised February 2026. It reports a drop of about 0.15 SD, about 2.5 points per 100, past the 60th graded item. **I corrected 03**, which had given 3.5 points from 2024 press coverage. It is still a working paper, not peer-reviewed.
- **Deadline push-notification study (IEEE 9373909)**: I couldn't open the IEEE page or find it by search. **I corrected 01**, which had linked a library proxy URL, and marked the claim unconfirmed. Don't rest a decision on it alone.

The agent for [04](04_assessment_psychology.md) worked from search summaries, not full pages. Its rules are labelled with that limit. Treat its Medium-confidence items as Low until checked.

## Where the evidence is thin

Several things had no good evidence: hidden versus visible quiz timers, late-start rules, first login and joining a course, TA "ready for review" handoffs, adjunct workflows, attendance time cost, blind users grading handwritten work, autistic students' LMS use, and whether dark mode helps. Current EDUCAUSE 2024–2025 student data also returned 403 errors, so no recent national mobile-use figure is cited. Each of these gaps is an open question in a role file, and the user tests should cover them.

## Next step (needs the owner's go-ahead)

Step 2: walk the 12 board journeys as student, instructor and TA against the 12 cross-cutting rules above, the role files and Nielsen's 10 heuristics. Output a severity-ranked UX fix plan, kept separate from the 118-item visual fix list. Settle C4–C6 there and record them under owner delegation.
