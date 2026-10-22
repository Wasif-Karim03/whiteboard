# Pellwin state and control inventory

Companion to [Pellwin functional audit](Pellwin-Functional-Audit.md). Source snapshot: 15 October 2026.

This inventory lists all declared screen states and options present in source-extracted template output. It is a source inventory, not a browser test. Repeated controls are grouped by label, attributes and occurrence context. The same option may appear more than once when its default, disabled status or destination changes. State, role and device columns are independent unions of observed contexts; a row does not imply every possible combination of those columns was observed.

Controls inserted only by wiring functions, such as GT-02 editable question rows, GT-04 roster rows and the GT-09 extension editor, are described in the functional audit. Selections here are the output of individual scenario renders, not evidence of a continuous saved workflow. Icons are omitted from visible-text labels; ARIA labels/titles are preserved where present.

## Screen state manifest

| Screen | Role choices declared | Device choices declared | All state choices |
| --- | --- | --- | --- |
| GT-01 First-launch welcome | inst | desktop | Moodle (`moodle`); Blackboard (`bb`); Unmapped roles (`st17`) · ST-GT-17; Opened outside the link (`st15`) · ST-GT-15 |
| GT-02 Assignment setup | inst | desktop | Filled (`filled`); New (`new`); Validation (`errors`); Past due date (`past`) |
| GT-03 Question and rubric editor | inst, ta | desktop | Editing Q2 (`edit`); TA view (`ta`) |
| GT-04 Assignment dashboard | inst, ta | desktop, ipadL, ipadP | Grading in progress (`prog`); No submissions yet (`st01`) · ST-GT-01; Released (`released`) |
| GT-05 Question-by-question grader | inst, ta | desktop, ipadL, ipadP | Grading (`grade`); Names hidden (`hidden`); Graded by someone else (`st12`) · ST-GT-12; Rubric just changed (`st13`) · ST-GT-13; Question done (`st02`) · ST-GT-02; Loading page (`st03`) · ST-GT-03; All pages (`all`) |
| GT-06 Rubric change preview | inst | desktop | Preview (`preview`); Applied (`applied`) |
| GT-07 Submission detail | inst, ta | desktop, ipadL | Default (`view`); Retagging (`retag`); Submitted by instructor (`byinst`); Resubmitted after grading (`resub`) |
| GT-08 Release and sync | inst | desktop | Release checklist (`check`); Sending (`sync`); Some failed (`st14`) · ST-GT-14; All synced (`done`) |
| GT-09 Roster and late allowances | inst, ta | desktop | Default (`view`); Unmapped roles (`st17`) · ST-GT-17 |
| GT-20 Assignment status | student | desktop, phone | Not submitted (`notsub`); Submitted (`submitted`); Late window (`late`) · ST-GT-08; Closed (`closed`) · ST-GT-09; Waiting for feedback (`st20`) · ST-GT-20; Graded and released (`released`); Browser blocked (`st16`) · ST-GT-16; Not in roster yet (`st18`) · ST-GT-18; Outage near deadline (`st19`) · ST-GT-19 |
| GT-21 Phone handoff | student | desktop, phone | QR code (`qr`); Code expired (`expired`) |
| GT-22 Capture pages | student | phone | Pages added (`pages`); First use (`first`); No camera (`st04`) · ST-GT-04 |
| GT-23 Tag pages to questions | student | phone, desktop | Q3 untagged (`tagging`); All tagged (`done`) |
| GT-24 Review and submit | student | phone, desktop | Ready (`review`); Sending (`uploading`); Connection lost (`st06`) · ST-GT-06; Not sent yet (`st07`) · ST-GT-07; Late (`st08`) · ST-GT-08; Untagged question (`st10`) · ST-GT-10 |
| GT-25 Receipt | student | phone, desktop | On screen (`receipt`); Email copy (`email`) |
| GT-26 Desktop PDF upload | student | desktop | Choose a file (`empty`); File chosen (`chosen`); File too large (`st11`) · ST-GT-11 |
| GT-27 Graded feedback | student | desktop, phone | Released (`released`); Not released yet (`st20`) · ST-GT-20 |
| GT-30 Institution setup | admin | desktop | Overview (`view`); Support request (`support`) · FL-GT-14; Export running (`export`) |

The reviewer can additionally select TA on instructor-only screens to see the viewer restriction message. Those are not product roles declared by the screen itself. ST-GT-05 is an inline blur warning rather than a state-array entry.

## Screen options by scenario

### GT-01 First-launch welcome

Opens in: New window from the LMS.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | Create an assignment | — | data-act=create | Blackboard; Moodle; Unmapped roles | inst | desktop |

### GT-02 Assignment setup

Opens in: Deep Linking dialog, then a new window.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| input text | Title | value=Problem Set 4: Kinematics; placeholder=Problem Set 4 | — | Filled; Past due date; Validation | inst | desktop |
| input text | Due | value=Fri 16 Oct 2026, 11:59 pm; placeholder=Date and time | — | Filled; Past due date; Validation | inst | desktop |
| input checkbox | Accept late submissions | checked | data-late | Filled; Past due date; Validation | inst | desktop |
| input text | Accept until | value=Sun 18 Oct 2026, 11:59 pm | — | Filled; Past due date; Validation | inst | desktop |
| button | Handwritten, scanned by phone | aria-pressed=true | — | Filled; New; Past due date; Validation | inst | desktop |
| button | PDF upload only | aria-pressed=false | — | Filled; New; Past due date; Validation | inst | desktop |
| button | Remove PDF | — | — | Filled; Past due date; Validation | inst | desktop |
| input text | Quick add questions | placeholder=1a 5, 1b 5, 2 10 | data-quick | Filled; New; Past due date; Validation | inst | desktop |
| button | Add | — | data-add | Filled; New; Past due date; Validation | inst | desktop |
| button | Cancel | — | — | Filled; New; Past due date; Validation | inst | desktop |
| button | Save | — | data-save | Filled; New; Past due date; Validation | inst | desktop |
| input text | Title | value=; placeholder=Problem Set 4 | — | New | inst | desktop |
| input text | Due | value=; placeholder=Date and time | — | New | inst | desktop |
| input checkbox | Accept late submissions | — | data-late | New | inst | desktop |
| input text | Accept until | value=Sun 18 Oct 2026, 11:59 pm; hidden in initial markup | — | New | inst | desktop |

### GT-03 Question and rubric editor

Opens in: New window.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | Q1a Car from rest: acceleration 4 pts | — | — | Editing Q2; TA view | inst, ta | desktop |
| button | Q1b Car from rest: distance 4 pts | — | — | Editing Q2; TA view | inst, ta | desktop |
| button | Q2 Stone dropped from a bridge 6 pts | — | — | Editing Q2; TA view | inst, ta | desktop |
| button | Q3 Projectile from a cliff 8 pts | — | — | Editing Q2; TA view | inst, ta | desktop |
| button | Q4 Boat crossing a river 8 pts | — | — | Editing Q2; TA view | inst, ta | desktop |
| input radio | Subtract from full marks | checked | — | Editing Q2 | inst | desktop |
| input radio | Add up from zero | — | — | Editing Q2 | inst | desktop |
| input text | Points for item 1 | value=0 | data-ri=0 | Editing Q2 | inst | desktop |
| input text | Description for item 1 | value=Correct: 3.03 s and 29.7 m/s | — | Editing Q2 | inst | desktop |
| button | Remove item 1 | — | — | Editing Q2 | inst | desktop |
| input text | Points for item 2 | value=−2 | data-ri=1 | Editing Q2 | inst | desktop |
| input text | Description for item 2 | value=Sign error | — | Editing Q2 | inst | desktop |
| button | Remove item 2 | — | — | Editing Q2 | inst | desktop |
| input text | Points for item 3 | value=−2 | data-ri=2 | Editing Q2 | inst | desktop |
| input text | Description for item 3 | value=Speed not found, or found without t | — | Editing Q2 | inst | desktop |
| button | Remove item 3 | — | — | Editing Q2 | inst | desktop |
| input text | Points for item 4 | value=−1 | data-ri=3 | Editing Q2 | inst | desktop |
| input text | Description for item 4 | value=Missing or wrong units | — | Editing Q2 | inst | desktop |
| button | Remove item 4 | — | — | Editing Q2 | inst | desktop |
| button | Add rubric item | — | — | Editing Q2 | inst | desktop |
| input radio | Subtract from full marks | disabled; checked | — | Editing Q2; TA view | inst, ta | desktop |
| input radio | Add up from zero | disabled | — | Editing Q2; TA view | inst, ta | desktop |
| input text | Points for item 1 | value=0; disabled | data-ri=0 | Editing Q2; TA view | inst, ta | desktop |
| input text | Description for item 1 | value=Correct: 3.03 s and 29.7 m/s; disabled | — | Editing Q2; TA view | inst, ta | desktop |
| input text | Points for item 2 | value=−2; disabled | data-ri=1 | Editing Q2; TA view | inst, ta | desktop |
| input text | Description for item 2 | value=Sign error; disabled | — | Editing Q2; TA view | inst, ta | desktop |
| input text | Points for item 3 | value=−2; disabled | data-ri=2 | Editing Q2; TA view | inst, ta | desktop |
| input text | Description for item 3 | value=Speed not found, or found without t; disabled | — | Editing Q2; TA view | inst, ta | desktop |
| input text | Points for item 4 | value=−1; disabled | data-ri=3 | Editing Q2; TA view | inst, ta | desktop |
| input text | Description for item 4 | value=Missing or wrong units; disabled | — | Editing Q2; TA view | inst, ta | desktop |

### GT-04 Assignment dashboard

Opens in: New window.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | Roster and late | — | data-go=GT-09 | Grading in progress; No submissions yet; Released | inst | desktop, ipadL, ipadP |
| button | Export CSV | — | data-csv | Grading in progress; No submissions yet; Released | inst, ta | desktop, ipadL, ipadP |
| button | Release grades | — | data-go=GT-08 | Grading in progress; Released | inst | desktop, ipadL, ipadP |
| button | Review | — | data-go=GT-05 | Grading in progress; Released | inst, ta | desktop, ipadL, ipadP |
| button | Grade | — | data-go=GT-05 | Grading in progress | inst, ta | desktop, ipadL, ipadP |
| button | All 44 | aria-pressed=true | data-f=all | Grading in progress; Released | inst, ta | desktop, ipadL, ipadP |
| button | Not submitted 2 | aria-pressed=false | data-f=missing | Grading in progress; Released | inst, ta | desktop, ipadL, ipadP |
| button | Late 3 | aria-pressed=false | data-f=late | Grading in progress; Released | inst, ta | desktop, ipadL, ipadP |
| button | Release grades | disabled | data-go=GT-08 | No submissions yet | inst | desktop, ipadL, ipadP |

### GT-05 Question-by-question grader

Opens in: New window.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | Hide names | aria-pressed=false | data-names | All pages; Graded by someone else; Grading; Loading page; Rubric just changed | inst, ta | desktop, ipadL, ipadP |
| button | Previous submission | — | data-prev | All pages; Graded by someone else; Grading; Loading page; Names hidden; Rubric just changed | inst, ta | desktop, ipadL, ipadP |
| button | Next submission | — | data-nextsub | All pages; Graded by someone else; Grading; Loading page; Names hidden; Rubric just changed | inst, ta | desktop, ipadL, ipadP |
| button | Zoom (Z) | — | data-zoom | All pages; Graded by someone else; Grading; Loading page; Names hidden; Rubric just changed | inst, ta | desktop, ipadL, ipadP |
| button | Rotate page | — | data-rot | All pages; Graded by someone else; Grading; Loading page; Names hidden; Rubric just changed | inst, ta | desktop, ipadL, ipadP |
| button | Show all pages | aria-pressed=false | data-allp | Graded by someone else; Grading; Loading page; Names hidden; Rubric just changed | inst, ta | desktop, ipadL, ipadP |
| button | 1 0 Correct: 28.3 m with units 17 | aria-pressed=false | data-rk=r1 | All pages; Graded by someone else; Grading; Loading page; Names hidden; Rubric just changed | inst, ta | desktop, ipadL, ipadP |
| button | 2 −2 Sign error on g (treats gravity as upward) 6 | aria-pressed=false | data-rk=r2 | All pages; Graded by someone else; Grading; Loading page; Names hidden; Rubric just changed | inst, ta | desktop, ipadL, ipadP |
| button | 3 −3 Wrong time of flight (uses 2·v₀y/g, ignores the cliff) 4 | aria-pressed=false | data-rk=r3 | All pages; Graded by someone else; Grading; Loading page; Names hidden; Rubric just changed | inst, ta | desktop, ipadL, ipadP |
| button | 4 −1 Missing or wrong units 3 | aria-pressed=false | data-rk=r4 | All pages; Graded by someone else; Grading; Loading page; Names hidden; Rubric just changed | inst, ta | desktop, ipadL, ipadP |
| button | 5 −2 Components not shown 2 | aria-pressed=false | data-rk=r5 | All pages; Graded by someone else; Grading; Loading page; Names hidden; Rubric just changed | inst, ta | desktop, ipadL, ipadP |
| textarea | Comment C | placeholder=Optional. Students see it with their feedback. | data-com | All pages; Graded by someone else; Grading; Loading page; Names hidden; Rubric just changed | inst, ta | desktop, ipadL, ipadP |
| button | Save and next ungraded ↵ | — | data-save | All pages; Graded by someone else; Grading; Loading page; Names hidden; Rubric just changed | inst, ta | desktop, ipadL, ipadP |
| button | Show names | aria-pressed=true | data-names | Names hidden | inst, ta | desktop, ipadL, ipadP |
| button | Keep hers | — | data-owa=keep | Graded by someone else | inst, ta | desktop, ipadL, ipadP |
| button | Replace with mine | — | data-owa=mine | Graded by someone else | inst, ta | desktop, ipadL, ipadP |
| button | Grade Q3 | — | data-next3 | Question done | inst, ta | desktop, ipadL, ipadP |
| button | Show Q3 pages only | aria-pressed=true | data-allp | All pages | inst, ta | desktop, ipadL, ipadP |

### GT-06 Rubric change preview

Opens in: Modal over GT-03 or GT-05.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | Q1a Car from rest: acceleration 4 pts | — | — | Applied; Preview | inst | desktop |
| button | Q1b Car from rest: distance 4 pts | — | — | Applied; Preview | inst | desktop |
| button | Q2 Stone dropped from a bridge 6 pts | — | — | Applied; Preview | inst | desktop |
| button | Q3 Projectile from a cliff 8 pts | — | — | Applied; Preview | inst | desktop |
| button | Q4 Boat crossing a river 8 pts | — | — | Applied; Preview | inst | desktop |
| input radio | Subtract from full marks | checked | — | Applied; Preview | inst | desktop |
| input radio | Add up from zero | — | — | Applied; Preview | inst | desktop |
| input text | Points for item 1 | value=0 | data-ri=0 | Applied; Preview | inst | desktop |
| input text | Description for item 1 | value=Correct: 3.03 s and 29.7 m/s | — | Applied; Preview | inst | desktop |
| button | Remove item 1 | — | — | Applied; Preview | inst | desktop |
| input text | Points for item 2 | value=−2 | data-ri=1 | Preview | inst | desktop |
| input text | Description for item 2 | value=Sign error | — | Applied; Preview | inst | desktop |
| button | Remove item 2 | — | — | Applied; Preview | inst | desktop |
| input text | Points for item 3 | value=−2 | data-ri=2 | Applied; Preview | inst | desktop |
| input text | Description for item 3 | value=Speed not found, or found without t | — | Applied; Preview | inst | desktop |
| button | Remove item 3 | — | — | Applied; Preview | inst | desktop |
| input text | Points for item 4 | value=−1 | data-ri=3 | Applied; Preview | inst | desktop |
| input text | Description for item 4 | value=Missing or wrong units | — | Applied; Preview | inst | desktop |
| button | Remove item 4 | — | — | Applied; Preview | inst | desktop |
| button | Add rubric item | — | — | Applied; Preview | inst | desktop |
| button | Cancel | — | data-g6a=cancel | Preview | inst | desktop |
| button | Apply to new grading only | — | data-g6a=new | Preview | inst | desktop |
| button | Apply to all | — | data-g6a=all | Preview | inst | desktop |
| input text | Points for item 2 | value=−1 | data-ri=1 | Applied | inst | desktop |

### GT-07 Submission detail

Opens in: New window.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | Submissions | — | data-go=GT-04 | Default; Resubmitted after grading; Retagging; Submitted by instructor | inst, ta | desktop, ipadL |
| button | Retag pages | — | data-st=retag | Default; Resubmitted after grading; Submitted by instructor | inst, ta | desktop, ipadL |
| button | Upload for student | — | — | Default; Resubmitted after grading; Submitted by instructor | inst, ta | desktop, ipadL |
| button | Allow late… | — | — | Default; Resubmitted after grading; Submitted by instructor | inst | desktop, ipadL |
| button | Cancel | — | data-st=view | Retagging | inst, ta | desktop, ipadL |
| button | Save tags | — | data-savetags | Retagging | inst, ta | desktop, ipadL |
| button | Q1a | aria-pressed=true | data-tg | Retagging | inst, ta | desktop, ipadL |
| button | Q1b | aria-pressed=true | data-tg | Retagging | inst, ta | desktop, ipadL |
| button | Q2 | aria-pressed=false | data-tg | Retagging | inst, ta | desktop, ipadL |
| button | Q3 | aria-pressed=false | data-tg | Retagging | inst, ta | desktop, ipadL |
| button | Q4 | aria-pressed=false | data-tg | Retagging | inst, ta | desktop, ipadL |
| button | Q1a | aria-pressed=false | data-tg | Retagging | inst, ta | desktop, ipadL |
| button | Q1b | aria-pressed=false | data-tg | Retagging | inst, ta | desktop, ipadL |
| button | Q2 | aria-pressed=true | data-tg | Retagging | inst, ta | desktop, ipadL |
| button | Q3 | aria-pressed=true | data-tg | Retagging | inst, ta | desktop, ipadL |
| button | Q4 | aria-pressed=true | data-tg | Retagging | inst, ta | desktop, ipadL |

### GT-08 Release and sync

Opens in: New window.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| input radio | Hold those 3; release the other 38 | checked | — | Release checklist | inst | desktop |
| input radio | Release all 41 anyway (ungraded questions count as 0) | — | — | Release checklist | inst | desktop |
| button | Back to dashboard | — | data-go=GT-04 | Release checklist | inst | desktop |
| button | Release grades | — | data-release | Release checklist | inst | desktop |
| button | Export CSV | — | data-csv | All synced; Sending; Some failed | inst | desktop |
| button | Retry | — | data-retry | Some failed | inst | desktop |

### GT-09 Roster and late allowances

Opens in: New window.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | Refresh | — | data-refresh | Default; Unmapped roles | inst | desktop |
| button | Allow late… | — | data-allow={student index} | Default; Unmapped roles | inst | desktop |
| button | Refresh | disabled | data-refresh | Default; Unmapped roles | ta | desktop |

### GT-20 Assignment status

Opens in: Embedded in the LMS, or a new window.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | Submit with your phone | — | data-goto=GT-21 | Late window; Not submitted; Outage near deadline | student | desktop, phone |
| button | Upload a PDF instead | — | data-goto=GT-26 | Late window; Not submitted; Outage near deadline | student | desktop, phone |
| button | View what you sent | — | data-goto=GT-25 | Submitted; Waiting for feedback | student | desktop, phone |
| button | Resubmit | — | data-goto=GT-21 | Submitted | student | desktop, phone |
| button | See feedback | — | data-goto=GT-27 | Graded and released | student | desktop, phone |
| button | Open in a new window | — | — | Browser blocked | student | desktop, phone |
| button | Try again | — | data-retry18 | Not in roster yet | student | desktop, phone |

### GT-21 Phone handoff

Opens in: From GT-20 on a laptop.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | Email me the link | — | data-mail | Code expired; QR code | student | desktop |
| button | Upload a PDF instead | — | data-goto=GT-26 | Code expired; QR code | student | desktop |
| button | Open scanner | — | data-goto=GT-22~first | Code expired; QR code | student | phone |
| button | Get a new code | — | data-newcode | Code expired | student | desktop |

### GT-22 Capture pages

Opens in: Top-level mobile browser.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | Retake | — | data-retake=2 | Pages added | student | phone |
| button | Keep | — | data-keep | Pages added | student | phone |
| button | Retake page 1 | — | data-retake=0 | No camera; Pages added | student | phone |
| button | Rotate page 1 | — | data-rot=0 | No camera; Pages added | student | phone |
| button | Delete page 1 | — | data-del=0 | No camera; Pages added | student | phone |
| button | Retake page 2 | — | data-retake=1 | No camera; Pages added | student | phone |
| button | Rotate page 2 | — | data-rot=1 | No camera; Pages added | student | phone |
| button | Delete page 2 | — | data-del=1 | No camera; Pages added | student | phone |
| button | Retake page 3 | — | data-retake=2 | No camera; Pages added | student | phone |
| button | Rotate page 3 | — | data-rot=2 | No camera; Pages added | student | phone |
| button | Delete page 3 | — | data-del=2 | No camera; Pages added | student | phone |
| button | Retake page 4 | — | data-retake=3 | No camera; Pages added | student | phone |
| button | Rotate page 4 | — | data-rot=3 | No camera; Pages added | student | phone |
| button | Delete page 4 | — | data-del=3 | No camera; Pages added | student | phone |
| button | Next: tag pages | — | data-goto=GT-23 | No camera; Pages added | student | phone |
| button | Add page | — | data-add | First use; Pages added | student | phone |
| button | Choose photos | — | — | First use; No camera | student | phone |

### GT-23 Tag pages to questions

Opens in: Mobile or desktop browser.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | Q1a 1 pg | aria-pressed=false | data-q=1a | All tagged; Q3 untagged | student | desktop, phone |
| button | Q1b 1 pg | aria-pressed=false | data-q=1b | All tagged; Q3 untagged | student | desktop, phone |
| button | Q2 1 pg | aria-pressed=false | data-q=2 | All tagged; Q3 untagged | student | desktop, phone |
| button | Q3 none | aria-pressed=true | data-q=3 | Q3 untagged | student | desktop, phone |
| button | Q4 1 pg | aria-pressed=false | data-q=4 | All tagged; Q3 untagged | student | desktop, phone |
| button | Page 1 for Q3 | aria-pressed=false | data-tag=0 | All tagged; Q3 untagged | student | desktop, phone |
| button | Page 2 for Q3 | aria-pressed=false | data-tag=1 | All tagged; Q3 untagged | student | desktop, phone |
| button | Page 3 for Q3 | aria-pressed=false | data-tag=2 | Q3 untagged | student | desktop, phone |
| button | Page 4 for Q3 | aria-pressed=false | data-tag=3 | All tagged; Q3 untagged | student | desktop, phone |
| button | Next: review | — | data-goto=GT-24~st10 | Q3 untagged | student | desktop, phone |
| button | Q3 1 pg | aria-pressed=true | data-q=3 | All tagged | student | desktop, phone |
| button | Page 3, tagged for Q3 | aria-pressed=true | data-tag=2 | All tagged | student | desktop, phone |
| button | Next: review | — | data-goto=GT-24 | All tagged | student | desktop, phone |

### GT-24 Review and submit

Opens in: Mobile or desktop browser.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | Submit | — | data-submit | Late; Ready; Untagged question | student | desktop, phone |
| button | Try again | — | data-submit | Not sent yet | student | desktop, phone |
| button | Copy code A7K2-DRAFT | — | data-copy | Not sent yet | student | desktop, phone |
| button | Tag them now | — | data-goto=GT-23 | Untagged question | student | desktop, phone |
| button | Submit anyway | — | data-anyway | Untagged question | student | desktop, phone |

### GT-25 Receipt

Opens in: Same window, plus email.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | View what you sent | — | data-view | On screen | student | desktop, phone |
| button | Back to Moodle | — | data-goto=GT-20~submitted | On screen | student | desktop, phone |

### GT-26 Desktop PDF upload

Opens in: Embedded or new window.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| input file | Drop your PDF here, or choose a file PDF only, up to 50 MB Choose file | accept=application/pdf | data-file | Choose a file; File too large | student | desktop |
| button | Cancel | — | data-goto=GT-20 | Choose a file; File chosen; File too large | student | desktop |
| button | Next: tag pages | disabled | — | Choose a file; File too large | student | desktop |
| button | Replace | — | data-clear | File chosen | student | desktop |
| button | Next: tag pages | — | data-goto=GT-23~tagging | File chosen | student | desktop |

### GT-27 Graded feedback

Opens in: Embedded or new window.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | Q1a Full marks 4 / 4 | aria-expanded=false | data-fq=1a | Released | student | desktop, phone |
| button | Q1b Full marks 4 / 4 | aria-expanded=false | data-fq=1b | Released | student | desktop, phone |
| button | Q2 Missing or wrong units 5 / 6 | aria-expanded=false | data-fq=2 | Released | student | desktop, phone |
| button | Q3 Sign error on g (treats gravity as upward) · Missing or wrong units 5 / 8 | aria-expanded=true | data-fq=3 | Released | student | desktop, phone |
| button | Q4 Full marks 8 / 8 | aria-expanded=false | data-fq=4 | Released | student | desktop, phone |

### GT-30 Institution setup

Opens in: Our web admin, via a signed invite.

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| select | Retention period | choices: End of term + 90 days (default), End of term + 1 year, End of term + 3 years | — | Export running; Overview; Support request | admin | desktop |
| button | Export all data (ZIP + CSV) | — | data-exp | Overview; Support request | admin | desktop |
| button | PDF | — | — | Export running; Overview; Support request | admin | desktop |
| button | Approve for 48 hours | — | data-sa=ok | Support request | admin | desktop |
| button | Deny | — | data-sa=no | Support request | admin | desktop |

### PG-L-01 Today

No actionable HTML controls in the rendered template; visible navigation/rows may be static spans.

### PG-L-02 Calendar

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | Week | aria-pressed=true | — | Vision | Vision | desktop |
| button | Month | aria-pressed=false | — | Vision | Vision | desktop |
| input checkbox | PHYS 110 | checked | data-crs=PHYS 110 | Vision | Vision | desktop |
| input checkbox | MATH 151 | checked | data-crs=MATH 151 | Vision | Vision | desktop |
| input checkbox | ENGL 105 | checked | data-crs=ENGL 105 | Vision | Vision | desktop |
| input checkbox | CHEM 121 | checked | data-crs=CHEM 121 | Vision | Vision | desktop |
| input checkbox | PSYC 101 | checked | data-crs=PSYC 101 | Vision | Vision | desktop |
| input checkbox | MUSC 140 | checked | data-crs=MUSC 140 | Vision | Vision | desktop |

### PG-L-10 Course home

No actionable HTML controls in the rendered template; visible navigation/rows may be static spans.

### PG-L-40 Instructor gradebook

| Control | Label or accessible name | Initial attributes and choices | Source hook | Appears in states | Roles | Devices |
| --- | --- | --- | --- | --- | --- | --- |
| button | Export for SIS | — | — | Vision | Vision | desktop |
| th | Student | — | data-sortc=n | Vision | Vision | desktop |
| th | Problem sets PS1 | — | data-sortc=0 | Vision | Vision | desktop |
| th | Problem sets PS2 | — | data-sortc=1 | Vision | Vision | desktop |
| th | Problem sets PS3 | — | data-sortc=2 | Vision | Vision | desktop |
| th | Problem sets PS4 | — | data-sortc=3 | Vision | Vision | desktop |
| th | Labs Lab 1 | — | data-sortc=4 | Vision | Vision | desktop |
| th | Labs Lab 2 | — | data-sortc=5 | Vision | Vision | desktop |
| th | Labs Lab 3 | — | data-sortc=6 | Vision | Vision | desktop |
| th | Quizzes Quiz avg | — | data-sortc=7 | Vision | Vision | desktop |
| th | Midterm Midterm | — | data-sortc=8 | Vision | Vision | desktop |
| th | So far · of 80% Current | — | data-sortc=-1 | Vision | Vision | desktop |

### PG-L-42 Student grades with the maths

No actionable HTML controls in the rendered template; visible navigation/rows may be static spans.

## Every workflow step

The following steps reproduce the source design narrative and intended production behavior. Statements about real progress, saved drafts, email, receipts, access grants and LMS writes are proposed behavior or simulation copy, not verified capabilities. See the functional audit for what each action actually implements.

### FL-GT-01 Install in Blackboard

LMS admin, then us. Admin-only and short. Built after a pilot college provides a Blackboard sandbox (DN-66).

1. Us, once. Register the tool on the Anthology developer portal and get the Application (Client) ID.
2. The college’s admin. Admin › LTI Tool Providers › Register LTI 1.3 tool , then paste the Client ID. Blackboard shows a Deployment ID.
3. Institution policies. Choose which user fields to send (name, email, role) and allow grade services and membership.
4. Scope. Make the tool available to the pilot course(s) only.
5. We send a signed invite to GT-30 so the college confirms contacts, retention and support access. We map the Deployment ID to the tenant. — GT-30, view, admin
6. Smoke test in a test course: create an assignment, submit as a test student, grade, release, and check the Ultra gradebook column.

### FL-GT-02 Install in Moodle

LMS admin, then us. The first install we build and test (DN-66, Moodle first).

1. The admin. Site administration › Plugins › External tool › Manage tools , paste our registration URL, then “Add LTI Advantage”. The tool shows as pending .
2. Activate. Review the requested services and enable Grades (AGS), Roster (Names and Roles) and Deep Linking; share name and email; accept grades “always” or “delegate to teacher”.
3. Launch container. Set the default to New window .
4. Moodle 4.x only. Enable the tool in the pilot course(s).
5. The same GT-30 invite as Blackboard: contacts, retention, support access. — GT-30, view, admin
6. Smoke test. The same checklist, plus confirm scores arrive only as FullyGraded.

### FL-GT-03 Create an assignment

Instructor. Always through Deep Linking, so the LMS makes a gradable column.

1. First launch explains where to click: Moodle › Add an activity or resource › External tool › Select content. — GT-01, moodle, inst
2. The Deep Linking launch opens the setup. — GT-02, new, inst
3. Enter the title, due date and questions (quick-add “1a 4, 1b 4, 2 6…”). — GT-02, filled, inst
4. Save returns a link plus a lineItem; Moodle creates the gradebook column. The dashboard waits for submissions. — GT-04, st01, inst
5. Optional: set up rubrics now, or while grading. — GT-03, edit, inst

### FL-GT-04 Student submits by phone

Student. The flow that carries our promise: submissions can’t be lost. The retry loop is step 9.

1. Open the assignment in Moodle. — GT-20, notsub, student, desktop
2. QR code or link to the phone. — GT-21, qr, student, desktop
3. On the phone, “Open scanner” opens a top-level browser window. — GT-21, qr, student, phone
4. First use: the framing tip. — GT-22, first, student, phone
5. Capture pages. Drafts are saved on the phone. A blurry page warns, never blocks. — GT-22, pages, student, phone
6. Tag pages to questions. Q3 is still empty, so the screen says so. — GT-23, tagging, student, phone
7. Review and submit. — GT-24, review, student, phone
8. Chunked upload with real progress. — GT-24, uploading, student, phone
9. The connection drops at 62%. It retries on its own and resumes from the last chunk. — GT-24, st06, student, phone [Retry loop]
10. Receipt on screen. — GT-25, receipt, student, phone
11. The same receipt by email. — GT-25, email, student, desktop

### FL-GT-05 Student uploads a PDF on desktop

Student. For students who scan with another app or write on a tablet.

1. Open the assignment. — GT-20, notsub, student, desktop
2. Choose the PDF (50 MB max). — GT-26, empty, student
3. File accepted. — GT-26, chosen, student
4. Tag pages, with click selection. — GT-23, done, student, desktop
5. Review and submit. — GT-24, review, student, desktop
6. Receipt. — GT-25, receipt, student, desktop

### FL-GT-06 Student resubmits before the deadline

Student, then instructor. The new submission replaces the old for grading; the old one is kept.

1. Resubmit is available until the deadline. — GT-20, submitted, student, desktop
2. Capture again. — GT-22, pages, student, phone
3. Review and submit. — GT-24, review, student, phone
4. A new receipt. — GT-25, receipt, student, phone
5. If grading had started, the instructor sees “resubmitted after grading”. — GT-07, resub, inst

### FL-GT-07 Grade by question

Instructor or TA. The core loop. Enter saves and jumps to the next ungraded answer.

1. Dashboard: pick a question. — GT-04, prog, inst
2. The grader shows the first ungraded answer to Q3. — GT-05, grade, inst
3. Optional: hide names to reduce bias. — GT-05, hidden, inst
4. If someone else graded this answer since you opened it, choose whose grade stands (DN-75 guard). — GT-05, st12, inst
5. End of a question: go to the next one. — GT-05, st02, inst

### FL-GT-08 Change a rubric mid-grading

Instructor. One audited batch; released grades re-sync.

1. Edit the item. — GT-03, edit, inst
2. Preview: “changes 23 grades”. — GT-06, preview, inst
3. Apply to all, or to new grading only. — GT-06, applied, inst
4. Anyone grading sees the rubric refresh, with unsaved selections kept. — GT-05, st13, ta

### FL-GT-09 Release and pass back grades

Instructor, then students. Nothing goes to the LMS before release, and then only FullyGraded (DN-73).

1. Release checklist: ungraded answers. — GT-08, check, inst
2. Release: feedback becomes visible; scores are sent. — GT-08, sync, inst
3. Per-student status. Retry failures or export CSV. — GT-08, st14, inst
4. Students see their score in Moodle. — GT-20, released, student, desktop
5. And the feedback by question. — GT-27, released, student, phone

### FL-GT-10 Late submission and allowances

Student, instructor. Off by default; global or per-student allowance (DN-74).

1. After the due time, if late is allowed, the student can still submit. — GT-20, late, student, desktop
2. The review screen says it will be marked late. — GT-24, st08, student, phone
3. Per-student “allow late until…”. — GT-09, view, inst
4. Otherwise: closed. — GT-20, closed, student, desktop

### FL-GT-11 Roster change

Instructor. Names and Roles on each instructor launch, or on Refresh.

1. Refresh pulls Names and Roles. Added students appear as not submitted. — GT-09, view, inst
2. Dropped students are greyed out; their work is kept. — GT-04, prog, inst
3. A student added in Moodle a minute ago sees this until the roster catches up. — GT-20, st18, student, desktop

### FL-GT-12 Student views feedback

Student. After release only.

1. Before release. — GT-20, st20, student, desktop
2. After release: the score. — GT-20, released, student, phone
3. Feedback by question. — GT-27, released, student, desktop

### FL-GT-13 Instructor uploads for a student

Instructor or TA. For paper handed in. Audited.

1. Open the student’s submission. — GT-07, view, inst
2. Scan or upload, tag, and mark “submitted by instructor”. — GT-07, byinst, inst
3. Back on the dashboard, it counts as submitted. — GT-04, prog, inst

### FL-GT-14 Support access

College admin. Time-boxed and logged (DN-08).

1. The college admin approves or denies a time-boxed grant. — GT-30, support, admin
2. Every view is logged against the grant. — GT-30, view, admin

## Review control coverage

The complete review-shell, design-system, specimen, marketing and presentation options are explained in sections 4, 10, 11, 12 and 14 of the functional audit. This extracted table concentrates on all product-screen states and rendered vision controls.

205 grouped control variants are listed above. This is an inventory count, not a feature-completion metric.
