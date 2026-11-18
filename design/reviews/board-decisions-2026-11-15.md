# Design board decisions, 15 Nov 2026

Chosen by Claude under owner delegation (CLAUDE.md, 16 Oct 2026). These settle the open questions in `board-deep-dive-2026-11-15.md`. They are proposed defaults for the first HTML prototype, not school-validated policy. The owner can reverse any of them.

| # | Question | Decision | Why |
|---|---|---|---|
| BD1 | Narrow-web navigation | Keep a five-item bottom bar for the global shell only (Today, Courses, Calendar, Activity, Tools). Course nav, staff nav and Search/Help/Account go in a navigation disclosure. Reword Spec 03 to allow this. | The drawn phone screens already use the bar and read well. A disclosure covers the long course and staff menus, so the spec's concern (no native tab-bar promise for everything) still holds. |
| BD2 | Can a TA preview the course as a student? | No. Instructor only. Remove the TA option from W14, W35 and W40. | Matches the Spec 02 permission matrix and the conservative TA default (WD06). Preview shows unreleased material, which is beyond assigned grading. |
| BD3 | Quiz end rule | Effective deadline = the earlier of personal close and start + effective duration (WD25). Fix the W26 "personal deadline" text and the W25 late-start time (11:29 PM). | Already agreed in Spec 04 and WD25; W26 just contradicts it. |
| BD4 | What "Late" means | A neutral receipt fact: accepted after the personal due time and before close, computed from the accepted time. No penalty in the first HTML. Add it to the status vocabulary, W18, W19, W22 and W24. Attendance uses "Arrived late" so the two never collide. | Late penalties stay an open institutional question (Spec 06). A factual label is honest without inventing policy. |
| BD5 | Student attendance view | Add a "My attendance" section to W14 (course home) showing the student's own recorded sessions. Include a typed correction request reviewed in W58. No new page; the count stays at 63. | Spec 02 grants students their own attendance facts and correction requests; no page showed them. A section avoids adding a route. |
| BD6 | Staff pages on narrow screens | iPad: W48, W49, W51 (single-learner view), W53 (review only) and W57. Phone: read-only W48 queue and W53 release status. Everything else stays desktop, with an "Open on a larger screen" state plus the protective actions Part 5 lists per page. | Spec 03 says staff bulk work belongs on desktop but asks for a usable narrow path for review and protective actions. These are the pages a TA or instructor checks away from a desk. |
| BD7 | Logo | "Board" (the drawn default), paired with the whiteboard wordmark. | Clearest at 16px in a browser tab, already the default, and the spec asks for no new branding work. |
| BD8 | Staff preview of a group workspace (W47 to W34) | Remove the links. Staff inspect group work through W47 membership, W22 receipts and W49. W33 and W34 stay student-only. | Avoids inventing a new preview mode (YAGNI). Staff already have every record they need on their own pages. |

Still owner or institution only, not decided here: first school, late penalties, retention, upload limits, accessibility support path.
