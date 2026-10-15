# Events and clubs research

**Domain:** 03_events_clubs  
**Research date:** 2026-10-15  
**Primary market:** US higher education  
**Evidence rule:** Product capability claims are grounded in current vendor documentation or institutional operating guides. Review and forum evidence is used only for reported friction, with sample limits preserved in pain_points.csv. The complete claim-to-source trail is in the [source register](sources.md).

## Market coverage

The mapped market has three practical layers:

1. **Full engagement suites:** Encoura Engage, CampusGroups by Ready Education, Modern Campus Involve, The Hub by Suitable and Pathify Communities. These products join organization governance to event workflows, attendance and some form of co-curricular or impact record ([EVENT-002](https://www.encoura.org/student-success/engage/), [EVENT-008](https://connect.readyeducation.com/product/product/), [EVENT-013](https://moderncampus.com/products/student-engagement-and-learning-platform), [EVENT-021](https://www.suitable.co/products/student-organization-management), [EVENT-024](https://pathify.com/blog/introducing-the-new-improved-pathify-communities/)).
2. **Campus app and portal layer:** Modo Campus with My Community prioritizes discovery, communication and mobile reach. It offers useful event and group functions but documents less depth in elections, organization finance and formal records than the engagement suites ([EVENT-027](https://modolabs.com/modo-campus/), [EVENT-028](https://modolabs.com/my-community/)).
3. **Specialists and composable alternatives:** Localist concentrates on a branded institution-wide calendar; GivePulse on service and impact; Eventbrite and pretix on registration, ticketing and check-in. A campus can combine these with its room, identity and finance systems instead of buying a single engagement suite ([EVENT-029](https://www.localist.com/), [EVENT-035](https://learn.givepulse.com/higher-education), [EVENT-040](https://www.eventbrite.com/organizer/features/all-features/), [EVENT-032](https://github.com/pretix/pretix)).

Ten products were mapped. Five received full workflow deep dives and the remaining five were mapped as meaningful adjacent alternatives. The matrix records an explicit unknown whenever an opened source did not establish the capability; vendor silence is not treated as absence.

## Current ownership and naming

- **Engage:** Encoura completed its acquisition of Anthology's Lifecycle Engagement business, including Engage, on 2026-02-02. Current product evidence is therefore recorded as Encoura Engage. The older Campus Labs and Anthology names remain common in help URLs and campus documentation. Blackboard's March 2026 corporate recapitalization does not reverse the completed Engage sale ([EVENT-001](https://www.encoura.org/resources/press-room/encoura-anthology/), [EVENT-002](https://www.encoura.org/student-success/engage/)).
- **CampusGroups:** Ready Education acquired CampusGroups in May 2022 and markets it as CampusGroups by Ready Education ([EVENT-007](https://www.readyeducation.com/about/)).
- **Presence:** Modern Campus acquired Presence on 2021-06-24. The current product is Modern Campus Involve; Presence is retained only as a historical alias ([EVENT-012](https://moderncampus.com/newsroom/modern-campus-acquires-presence.html), [EVENT-013](https://moderncampus.com/products/student-engagement-and-learning-platform)).
- **Localist:** Concept3D acquired Localist in September 2022 and continues to operate Localist Events ([EVENT-030](https://concept3d.com/blog/concept3d/exciting-announcement-concept3d-acquires-localist/), [EVENT-029](https://www.localist.com/)).

## Deep dives

### Encoura Engage

Engage covers organization registration, event creation, configurable review, RSVP limits, attendance, budgeting, elections and verified co-curricular records. Its event stack is modular: the separate Event Check-in app is tied to Advanced Organization Management, and EMS room reservations require support enablement and third-party API credentials. Data services expose APIs and feeds, but API access depends on the institution's contract and technical implementation. This makes Engage broad and governance-ready, with procurement and module boundaries that cannot be resolved from public material ([EVENT-002](https://www.encoura.org/student-success/engage/), [EVENT-003](https://help.anthology.com/engage/en/configuring-your-event-rsvp-settings.html), [EVENT-004](https://help.anthology.com/engage/en/anthology-event-check-in-app-walkthrough.html), [EVENT-005](https://help.anthology.com/engage/en/room-reservation-setup---ems.html), [EVENT-006](https://help.anthology.com/engage/en/what-is-possible-with-engage-data-services-.html)).

### CampusGroups by Ready Education

CampusGroups documents the broadest visibly integrated surface in this set: clubs and officer permissions, elections, forms, approval workflows, events, ticket tiers, attendance, rooms, payments, budgets, reimbursements, mobile messaging and co-curricular transcripts. Its strength is operational breadth in one suite. Institution evidence also exposes a consequential handoff flaw: Case Western Reserve documents that only the officer who began an event draft can submit it for approval. Student forum reports at Old Dominion and Stanford describe stale organization listings and clubs that coordinate elsewhere, showing that software breadth does not by itself keep the directory authoritative ([EVENT-008](https://connect.readyeducation.com/product/product/), [EVENT-009](https://connect.readyeducation.com/product/events-calendars/), [EVENT-010](https://connect.readyeducation.com/product/budgeting-finance/), [EVENT-048](https://case.edu/studentlife/services/campusgroups/event-creation), [EVENT-046](https://www.reddit.com/r/ODU/comments/pfmh5d/how_can_i_find_active_clubs/), [EVENT-047](https://www.reddit.com/r/stanford/comments/127eyp0/club_leaders_ghosting/)).

### Modern Campus Involve

Involve has strong public documentation for configurable event forms and approvals, staff mobile check-in, organization transitions, elections, finance reconciliation, skills and SmartTranscript. Its room integration is narrower than a native scheduling engine: approved events import one way into EMS or 25Live, setup can take roughly 45 days, and EMS may require a paid API. Public app reviews report login and event-screen failures in some versions, while a 2025 support answer documents a manual workaround for student self check-in. Those reports are version- and configuration-specific; they identify acceptance-test targets rather than product-wide rates ([EVENT-014](https://involve-support.moderncampus.com/hc/en-us/articles/14706433663117-Event-Management), [EVENT-015](https://involve-support.moderncampus.com/hc/en-us/articles/23355406719245-Mobile-App-Event-Check-In), [EVENT-016](https://involve-support.moderncampus.com/hc/en-us/articles/17892551343629-Room-Reservation-Integrations), [EVENT-017](https://involve-support.moderncampus.com/hc/en-us/articles/17549629979917-Enable-and-Setup-Transitioning), [EVENT-019](https://involve-support.moderncampus.com/hc/en-us/articles/17716117024909-Finance-Submitting-A-Reconciliation-Request), [EVENT-020](https://involve-support.moderncampus.com/hc/en-us/articles/17764387358349-Student-s-Guide-to-the-SmartTranscript), [EVENT-043](https://apps.apple.com/us/app/modern-campus-involve/id1638706822?platform=watch&see-all=reviews), [EVENT-053](https://involve-support.moderncampus.com/hc/en-us/articles/34089317185421-Involve-101-February-2025)).

### The Hub by Suitable

The Hub connects mobile-first organization profiles, rosters, events, RSVP, approvals and room-system integrations to Suitable's co-curricular record. Current release evidence establishes finance reporting from 2025 and re-registration plus workflow automation in 2026. The main product page still labels secure elections, finance and re-registration as coming in 2022. Later sources resolve finance and re-registration, but no newer opened source confirmed secure elections; the matrix therefore records elections as unknown. This stale-page conflict is material for diligence and should be resolved in a product demonstration ([EVENT-021](https://www.suitable.co/products/student-organization-management), [EVENT-022](https://www.suitable.co/knowledge-center/events/an-exclusive-look-at-the-hubs-new-finance-reporting-tool), [EVENT-023](https://www.suitable.co/knowledge-center/events/product-showcase-the-hub-event-automations)).

### Pathify Communities

Pathify places clubs, events, chat, forms, dues, budgets, service and co-curricular records inside its wider campus app and portal. The 2026 Communities release added event approval intake and attendance counts for the co-curricular transcript, which addresses a historical depth gap between portals and engagement systems. Pathify documents extensive integration recipes, but public evidence did not establish room reservation depth, officer-transition workflow or paid event ticketing. A single incentivized review reports one-to-two-hour integrated-data delay; treat this as an integration test case, not a prevalence claim ([EVENT-024](https://pathify.com/blog/introducing-the-new-improved-pathify-communities/), [EVENT-025](https://resources.pathify.com/space/M5M2N/1968963595/Pathify%2BCXP%2BRelease%2BSeptember%2B27th%2B2026), [EVENT-026](https://pathify.com/campus-experience-platform/integrations/), [EVENT-044](https://www.softwareadvice.com/higher-education/ucroo-profile/)).

## Adjacent alternatives

- **Modo Campus with My Community** is credible where the institution's priority is a unified native app, group discovery, RSVP, QR/manual attendance and contextual campus services. It is a weaker documented match for formal organization finance, elections and co-curricular records ([EVENT-027](https://modolabs.com/modo-campus/), [EVENT-028](https://modolabs.com/my-community/)).
- **Localist Events** is a public calendar and event-marketing specialist with submissions, registration and Eventbrite/EMS connections. It complements a club system rather than replacing one ([EVENT-029](https://www.localist.com/), [EVENT-072](https://help.concept3d.com/hc/en-us/categories/11686644923155-Localist-Events)).
- **GivePulse** is strongest for service-learning, verified impact and flexible online/offline attendance. Its public Platinum education price is USD 1.75 per FTE per year for institutions above 2,000 FTE; department and enterprise scopes are quote-based ([EVENT-035](https://learn.givepulse.com/higher-education), [EVENT-036](https://learn.givepulse.com/pricing/education), [EVENT-037](https://support.givepulse.com/hc/en-us/articles/206897597-Event-Sign-In)).
- **Eventbrite** supplies mature paid registration, waitlist and organizer check-in. US paid-event fees are publicly listed, while free events have no ticketing fee. It lacks institution-wide club governance ([EVENT-039](https://www.eventbrite.com/organizer/pricing/), [EVENT-041](https://www.eventbrite.com/features/waitlist/), [EVENT-066](https://www.eventbrite.com/organizer/features/organizer-check-in-app/)).
- **pretix** is the meaningful open-source option. Its self-hosted Community edition is free under AGPLv3 with additional terms, and it offers APIs plus offline scanning. Operating it still requires technical ownership, and its scope is event commerce rather than student organization governance ([EVENT-032](https://github.com/pretix/pretix), [EVENT-033](https://pretix.eu/about/en/pricing/selfhosted), [EVENT-034](https://pretix.eu/about/en/features/checkin)).

## Workflow comparison

| Workflow | Strongest documented patterns | Friction or dependency to preserve in requirements |
|---|---|---|
| Create and approve an event | Configurable forms and routing in Engage, CampusGroups, Involve and 2026 Pathify ([EVENT-014](https://involve-support.moderncampus.com/hc/en-us/articles/14706433663117-Event-Management), [EVENT-025](https://resources.pathify.com/space/M5M2N/1968963595/Pathify%2BCXP%2BRelease%2BSeptember%2B27th%2B2026)) | Draft ownership must survive officer handoff; approval status, comments and resubmission need to remain visible ([EVENT-048](https://case.edu/studentlife/services/campusgroups/event-creation)) |
| RSVP, capacity and ticketing | CampusGroups combines RSVP and ticket tiers; Eventbrite and pretix supply specialist commerce ([EVENT-009](https://connect.readyeducation.com/product/events-calendars/), [EVENT-040](https://www.eventbrite.com/organizer/features/all-features/), [EVENT-033](https://pretix.eu/about/en/pricing/selfhosted)) | Ticketing is often absent or unclear in engagement suites; avoid assuming RSVP equals payments or waitlist |
| Check-in | Suite apps support staff scanning; GivePulse and pretix document offline operation ([EVENT-004](https://help.anthology.com/engage/en/anthology-event-check-in-app-walkthrough.html), [EVENT-037](https://support.givepulse.com/hc/en-us/articles/206897597-Event-Sign-In), [EVENT-034](https://pretix.eu/about/en/features/checkin)) | Support poor connectivity, duplicate scans, guests, manual corrections and privacy-safe attendance access |
| Rooms and resources | Engage integrates EMS; CampusGroups documents native/integrated rooms; Involve imports to EMS/25Live ([EVENT-005](https://help.anthology.com/engage/en/room-reservation-setup---ems.html), [EVENT-008](https://connect.readyeducation.com/product/product/), [EVENT-016](https://involve-support.moderncampus.com/hc/en-us/articles/17892551343629-Room-Reservation-Integrations)) | The room system remains the authority; one-way sync, paid APIs and implementation lead time can block end-to-end automation |
| Clubs and officers | CampusGroups, Involve, Engage, Suitable and Pathify manage organizations and roles ([EVENT-002](https://www.encoura.org/student-success/engage/), [EVENT-008](https://connect.readyeducation.com/product/product/), [EVENT-013](https://moderncampus.com/products/student-engagement-and-learning-platform), [EVENT-021](https://www.suitable.co/products/student-organization-management), [EVENT-024](https://pathify.com/blog/introducing-the-new-improved-pathify-communities/)) | Profiles decay unless re-registration, owner recertification and inactive-state handling are first-class ([EVENT-046](https://www.reddit.com/r/ODU/comments/pfmh5d/how_can_i_find_active_clubs/), [EVENT-047](https://www.reddit.com/r/stanford/comments/127eyp0/club_leaders_ghosting/)) |
| Elections | Engage, CampusGroups and Involve document elections ([EVENT-067](https://help.anthology.com/engage/en/using-engage-for-student-government-initiatives.html), [EVENT-058](https://connect.readyeducation.com/product/groups-membership/), [EVENT-018](https://involve-support.moderncampus.com/hc/en-us/articles/17696389779853-Using-Involve-For-Elections-Voting)) | Ballot secrecy, eligibility snapshots, auditability and contest rules create a separate risk class from ordinary forms |
| Funding and reconciliation | CampusGroups, Involve, Suitable and Pathify document finance workflows ([EVENT-010](https://connect.readyeducation.com/product/budgeting-finance/), [EVENT-019](https://involve-support.moderncampus.com/hc/en-us/articles/17716117024909-Finance-Submitting-A-Reconciliation-Request), [EVENT-022](https://www.suitable.co/knowledge-center/events/an-exclusive-look-at-the-hubs-new-finance-reporting-tool), [EVENT-024](https://pathify.com/blog/introducing-the-new-improved-pathify-communities/)) | Campus policy introduces hearings, receipts, pre-spend approval and post-event reports beyond a simple balance field ([EVENT-049](https://www.colorado.edu/involvement/student-organizations/guide)) |
| Co-curricular record | Engage, CampusGroups, Involve, Suitable and Pathify connect activity to records ([EVENT-002](https://www.encoura.org/student-success/engage/), [EVENT-008](https://connect.readyeducation.com/product/product/), [EVENT-020](https://involve-support.moderncampus.com/hc/en-us/articles/17764387358349-Student-s-Guide-to-the-SmartTranscript), [EVENT-021](https://www.suitable.co/products/student-organization-management), [EVENT-024](https://pathify.com/blog/introducing-the-new-improved-pathify-communities/)) | Students need control over sharing; staff need verification and correction rules before records become official |

## Baseline comparison

The current Whiteboard build has no events or clubs domain. It provides no event model, approvals, RSVP/capacity, attendance, room dependency, organization profile, roster, officer role, transition, election, budget, funding form or co-curricular record. The calendar visible in the static mockup is a presentation concept rather than a scheduling or event service. The repository also has no compiled native mobile app; mobile and tablet frames are static HTML views ([baseline evidence](../00_baseline/current_build.md)).

Reusable baseline assets are limited to the shell, visual tokens, role concepts and loading/empty/error-state patterns. No production backend, authentication or database is present, so event and club work begins with domain modeling and access rules rather than an extension of working application services ([baseline evidence](../00_baseline/current_build.md)).

## Product recommendation

Build a focused campus engagement core around reliable discovery and auditable handoffs:

1. A verified club directory with active, inactive and pending states; named current contacts; term-based recertification; and an officer transition packet for credentials, files, recurring obligations and open event/funding tasks.
2. Collaborative event drafts that any authorized officer can continue, with configurable institution fields, approval stages, reviewer comments, resubmission and a readable status timeline.
3. RSVP, capacity, waitlist, guest policy and calendar export, followed by privacy-scoped QR/manual check-in with offline capture and duplicate resolution.
4. Explicit dependency objects for rooms, risk review and funding. Whiteboard should show status and blockers while linking or synchronizing with the campus system that owns the authoritative booking or financial transaction.
5. Role-scoped announcements and reminders connected to clubs, events and approval tasks.

This scope fills the baseline gap while targeting the failures supported by evidence: stale discovery, unanswered contacts, draft handoff, complicated approvals and officer knowledge loss ([EVENT-046](https://www.reddit.com/r/ODU/comments/pfmh5d/how_can_i_find_active_clubs/), [EVENT-047](https://www.reddit.com/r/stanford/comments/127eyp0/club_leaders_ghosting/), [EVENT-048](https://case.edu/studentlife/services/campusgroups/event-creation), [EVENT-049](https://www.colorado.edu/involvement/student-organizations/guide), [EVENT-050](https://union.uni.edu/involvement/student-organization-officer-transition-guide)). It also fits the existing role-oriented UI direction ([baseline evidence](../00_baseline/current_build.md)).

## MVP and deferred scope

### MVP

- Organization profiles, membership requests, officer roles and term-based re-registration
- Event drafts with co-editing, submission, configurable approval stages and audit history
- RSVP, capacity, waitlist, guest handling and calendar feeds
- Staff and organizer check-in with QR, manual correction and offline queueing
- Room and funding request links/status adapters, without claiming to replace source systems
- Officer-transition checklist and durable organization files
- Mobile-responsive web flows, notifications and complete loading/empty/error/permission states

### Defer until governance and integration contracts exist

- Payment processing and institution-wide ticket settlement
- General ledger, purchase orders, reimbursements and stored-value accounts
- High-stakes elections
- Official co-curricular transcript issuance and predictive engagement analytics
- A new native mobile application; prove the workflow in a responsive installable web experience first

Ticket payments, finance and elections carry audit, eligibility, reconciliation and policy obligations that exceed a first engagement release. Formal learning records also require retention, correction and disclosure rules. Integrations should begin with clear status exchange and deep links, then graduate to two-way sync only when the source of truth and failure recovery are defined.

## Acceptance tests implied by the evidence

- An officer starts a draft, loses the role and another authorized officer completes and submits it without copying the event.
- A rejected event shows the responsible reviewer, reason, changed fields and a resubmission path.
- A room request remains visibly pending until the authoritative room system confirms it; sync failure does not silently publish a reserved room.
- An organization that misses recertification leaves discovery or is clearly marked inactive, and its old contact is not shown as current.
- Check-in works without connectivity, prevents accidental duplicate attendance and synchronizes corrections with an audit trail.
- A student can see why a club or event is shown, mute or leave a community and control public exposure of membership and attendance.

## Risks and evidence gaps

- Public pricing is unavailable for the five full engagement suites and Modo. Module entitlements and implementation fees require quotes.
- Public vendor documentation establishes feature presence, not usability, reliability or adoption. No logged-in sandbox or procurement response was available.
- The user-pain evidence is intentionally narrow: institutional guides show local operations, while app-store, review-site and forum samples are self-selected. No national prevalence is claimed.
- Suitable's stale roadmap language and Pathify's recent 2026 release history make current plan availability important to verify live.
- Room and financial integrations depend on institution-specific systems, APIs, contracts and process ownership.
- Membership, attendance, guest, service and co-curricular data can reveal sensitive associations. Access scope, student sharing controls, retention, correction and audit logs need product-level decisions before implementation.
