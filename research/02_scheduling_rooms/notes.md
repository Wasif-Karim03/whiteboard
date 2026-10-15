# Domain 02 — Scheduling and rooms research notes

**As of:** 2026-10-15  
**Scope:** Higher-education academic timetabling, room assignment, exam scheduling, event/facility booking, utilization evidence, and SIS handoffs. This is product and workflow research for Whiteboard; it is not a recommendation to buy or integrate a specific system.

## How this research was conducted

The review used free public sources and generic technical queries. Product capabilities were checked against current vendor product/help pages, ownership against company or parent-company sources, public price examples against institutional board/procurement records, and workflow pain against institutional help pages, project pages, reviews, and limited student anecdotes. Every cited URL was opened. Vendor claims are labeled as vendor evidence; individual reviews and forum posts are not treated as prevalence estimates.

`competitors.csv` maps 17 products or product families. `feature_matrix.csv` compares 17 capabilities across five specialist suites. A ✅ means public evidence establishes the function, `partial` means narrower scope or material qualification, `unknown` means the reviewed evidence does not establish it, and ❌ would require affirmative evidence of absence. No ❌ cells were assigned because product pages rarely prove absence.

## Category structure

The market is easier to understand as four overlapping product jobs:

1. **Academic schedule construction** builds the term schedule: sections, meeting patterns, instructors, times, rooms, rules, preferences, and student conflicts. Coursedog, Infosilem, Ad Astra, CollegeNET Schedule25, EMS Academic Planning, CourseLeaf CLSS, UniTime, TimeEdit, Syllabus Plus, CELCAT, and Modern Campus compete here in different depth.
2. **Operational room and event booking** manages ad hoc requests, availability, approvals, services, recurring reservations, calendars, billing, and changes. 25Live, EMS, Coursedog Event Scheduling, Ad Astra Event Scheduling, Infosilem Campus, Mazévo, UniTime, CELCAT, and ASIMUT overlap here.
3. **Space analytics** interprets scheduled hours, projected seats, enrolled seats, and sometimes observed occupancy. These are different measures. Booking data proves intended use; check-ins or sensors are needed to establish observed use [ROOM-SRC-059, ROOM-SRC-061].
4. **SIS-native scheduling** records sections, rooms, instructors, capacity, and conflicts inside the student system. PeopleSoft, Banner, Anthology Student, and Workday Student reduce duplicate systems for basic records, but the reviewed documentation does not establish the same optimization and event-management breadth as the specialist suites [ROOM-SRC-048, ROOM-SRC-049, ROOM-SRC-050, ROOM-SRC-051, ROOM-SRC-052, ROOM-SRC-053].

This separation matters for Whiteboard. A polished calendar view can show a class or room assignment, but it does not establish a scheduling engine. Production scheduling requires constraint data, authority rules, source-of-truth ownership, conflict handling, transactional changes, auditability, and reliable integration.

## Market map

| Cluster | Products | Observed position |
|---|---|---|
| Broad specialist suites | CollegeNET Series25, Accruent EMS, Coursedog, Ad Astra, Infosilem | Combine academic scheduling with some mix of event booking, room management, analytics, and SIS exchange. Modules and connector behavior vary materially. |
| Academic workflow and timetabling | CourseLeaf CLSS, Modern Campus Schedule, TimeEdit, UniTime, TechnologyOne Syllabus Plus, CELCAT | Stronger orientation to term construction, rules, workflow, and timetable optimization. UniTime is the notable open-source alternative. |
| Event/facility booking | Mazévo | Clear request/approval/facility scope; the cited University of Washington page expressly says it does not schedule classes or contain student data [ROOM-SRC-047]. |
| SIS-native | Oracle PeopleSoft, Ellucian Banner, Ellucian Anthology Student, Workday Student | Authoritative section and location records with conflict checks, but less public evidence of optimization and campus event operations. |
| Vertical specialist | ASIMUT | Music, performing arts, rehearsal, lesson, ensemble, equipment, and practice-room workflows. |

The landscape does not support a clean single winner. Institutions frequently combine an SIS with a specialist scheduler and sometimes a separate event/space tool. Public references show CourseLeaf integrating with 25Live and EMS, specialist products using Banner/Ethos, and event-only tools migrating from EMS. The integration boundary is part of the product decision, not an implementation detail.

## Deep dives

### CollegeNET Series25: 25Live, Schedule25, X25, and LYNX

CollegeNET presents Series25 as a linked family. 25Live is the event/request/calendar hub; Schedule25 performs academic room optimization; X25 handles space analytics; LYNX exchanges data with the SIS [ROOM-SRC-001, ROOM-SRC-003, ROOM-SRC-004]. This is broad coverage, but buyers should confirm which named products are included.

The evidence is strongest for location conflict detection, configurable approval tasks, repeated events, public calendar publishing, more than 100 reports, room criteria, and bulk academic room assignment. Schedule25 documents capacity, course type, institutional preferences, equipment/seating, and accessibility criteria. The reviewed sources do not clearly establish automated meeting-time assignment or demand forecasting, so those cells remain unknown.

CollegeNET announced a **majority investment** from Rubicon Technology Partners on 2025-03-04. The same announcement says founder Jim Wolfston continues to lead and remains a significant shareholder. The defensible current description is “Rubicon majority-backed, founder-led,” rather than an unqualified claim that CollegeNET was fully absorbed [ROOM-SRC-002].

Institution evidence exposes operational friction: confirmed-event changes may require staff email, large searches can take time, browser refresh can clear unsaved work, migration of irregular recurring events can require manual recreation, and room identifiers can diverge across systems [ROOM-SRC-007, ROOM-SRC-008, ROOM-SRC-009, ROOM-SRC-010, ROOM-SRC-011]. These findings describe specific institutions and configurations.

The strongest public price example is NOCCCD: a 63,000 USD annual 25Live license in each of three fiscal years, plus 160,000 USD implementation in FY2023-24 and 48,000 USD in FY2024-25 [ROOM-SRC-005]. This is a district contract, not list price.

### Accruent EMS

EMS spans classrooms, exams, events, study rooms, recurring meetings, reports, and workplace scheduling. The academic workflow pulls sections from the SIS, creates reservations/bookings, and writes locations back where the connector supports it [ROOM-SRC-012, ROOM-SRC-013, ROOM-SRC-014]. Automatic room assignment considers course size, layout, equipment, and instructor preference.

Integration needs connector-level verification. The general Campus Web Service documentation lists bidirectional options across Banner, Colleague, PowerCampus, PeopleSoft, Jenzabar, and Workday, but current EMS Platform Services documentation states that its Workday integration pulls into EMS and does **not** synchronize back [ROOM-SRC-014, ROOM-SRC-015]. A procurement checklist should therefore ask about direction, objects, latency, error handling, and authoritative fields for the exact SIS/version.

Accruent acquired EMS in 2018. Current Accruent and Fortive pages still identify Accruent as a Fortive operating company; Fortive's 2026 filings retain the Accruent brand [ROOM-SRC-016, ROOM-SRC-017].

Lincoln Land Community College publicly approved 112,212.61 USD for five years of EMS Campus license maintenance, starting at 20,717.49 USD in 2025 and increasing 4 percent annually [ROOM-SRC-018]. Higher-education Capterra reviewers report dated UI, limited mobile usefulness, confusing statuses, service-charge confusion, and support friction, but the sample is small and spans different versions [ROOM-SRC-019].

### Coursedog Scheduling Cloud

Coursedog's product family separates Academic Scheduling, Event Scheduling, Curriculum, Catalog, Faculty Workload, and demand-related functions. The Section Optimizer can assign times and rooms with weighted preferences for instructors, back-to-back patterns, room features/types/capacity, buildings, and conflicts. It does not assign instructors and its public support article says it does not support online rooms [ROOM-SRC-020, ROOM-SRC-021, ROOM-SRC-022]. Event Scheduling adds room requests, approvals, and live availability.

The product has unusually transparent implementation documentation. Room imports, blackout behavior, event-room relationships, cancellation behavior, and demand-projection limits are public [ROOM-SRC-023, ROOM-SRC-024]. Demand projections and conflict heatmaps can inform planning, but Coursedog tells users to apply human judgment; historical data quality constrains the result.

Coursedog announced a 90 million USD strategic growth investment led by JMI Equity and Gregg Scoresby and reported more than 170 customers at that time. The source does not establish a full acquisition, so the ownership field remains “privately operated, growth-backed” [ROOM-SRC-025].

Oakton College's five-year public package totals 606,249 USD and includes academic scheduling, room/event scheduling, faculty workload, demand projections, Banner work, implementation, training, maintenance, licenses, and hardware [ROOM-SRC-026]. It is useful as scope evidence, not a list price. Drew University lists incomplete prerequisite/restriction visibility and a course-size analytics issue; Villanova describes Banner as the system of record and its old email/Excel workflow as error-prone [ROOM-SRC-027, ROOM-SRC-029].

### Ad Astra

Ad Astra's public portfolio distinguishes Academic Scheduling, Room Scheduling and Space Management, Event Scheduling, Exam Scheduling, Student Demand Forecasting, Pathway Management, and Registration Monitoring [ROOM-SRC-030, ROOM-SRC-031, ROOM-SRC-032, ROOM-SRC-033]. That modularity is central to both fit and price. Core academic workflow includes a schedule grid, room and faculty assignment, permissions, workflow, reasons, historical recommendations, and bidirectional SIS positioning. Room optimization, exams, events, demand, and pathways may be separate modules.

The 2026 College of the Florida Keys statement of work is unusually specific. The three-year reviewed scope totals 182,839.94 USD: an initial 77,110 USD due (27,275 USD implementation/training plus 49,835 USD year-one subscription), then 51,828.40 USD and 53,901.54 USD. It includes Academic Scheduling, Banner integration, Student Demand Forecasting, Pathway Management, and Registration Monitoring; room, event, and exam scheduling are explicitly out of scope. It also says the institution owns custom API work and that poor source data or rework can create delay and cost [ROOM-SRC-035].

Current leadership evidence lists founder Tom Shaver as founder and CEO. No completed acquisition was verified in the reviewed official sources [ROOM-SRC-034].

### Infosilem

Infosilem provides Academic, Campus, and Exam products. Its FAQ substantiates combined automatic/manual scheduling, automatic time and room assignment, capacity enforcement, student pathways, professor preferences, hybrid delivery, APIs/CSV, room-use reports, and near-real-time bidirectional Ellucian Ethos integration [ROOM-SRC-036, ROOM-SRC-037]. This is the clearest public evidence of a single family covering academic timetable optimization, campus bookings, and exams.

Infosilem's privacy notice says Infosilem Inc. is a Berger-Levrault Group subsidiary [ROOM-SRC-038]. No current public pricing was located. Two verified G2 reviews describe the product as powerful but not always intuitive for infrequent users, with a steep learning curve and extra clicks for simple changes. Those are individual experiences, not a prevalence estimate [ROOM-SRC-039, ROOM-SRC-040].

## SIS-native comparison

- **PeopleSoft Campus Solutions** stores buildings, rooms, capacities, characteristics, and blackouts and performs native class/exam facility conflict checks. Its own documentation says some fields are meant for external Schedule25 and that internal facility search does not use academic organization; the described blackout structure is not used by the internal conflict logic [ROOM-SRC-048, ROOM-SRC-049].
- **Ellucian Banner Student** includes class scheduling in the SIS, creating a strong authoritative record but limited public proof of optimization and event-request breadth [ROOM-SRC-050].
- **Anthology Student** documents class scheduling with rooms, instructors, and waitlists. Ellucian officially completed its acquisition of Anthology's SIS and ERP business on 2025-12-31 and reported 260 customers in that acquired business. This is a completed transaction, not a pending rumor [ROOM-SRC-051, ROOM-SRC-052].
- **Workday Student** supports course sections, capacity, reserved seats, and overlap checks across dates, meetings, and locations before publication. The reviewed source does not establish a general event-booking or optimizer module [ROOM-SRC-053].

SIS-native capability is therefore a credible baseline and source-of-truth layer. It should not be scored as equivalent to specialist optimization unless the institution demonstrates rules, preferences, batch solving, exception workflows, and event operations in its exact deployment.

## Constraint and workflow model

A credible scheduler needs a richer model than `event(start, end, room)`:

| Constraint family | Examples | Product implication |
|---|---|---|
| Time | meeting patterns, instructional minutes, passing time, holidays, multi-part classes, irregular dates | Must model occurrences and academic calendars, not just a single interval. |
| Resource | capacity, layout, equipment, room type, accessibility, sub-rooms, blackouts | Needs versioned room metadata and clear ownership across facilities and registrar systems. |
| People | instructor availability, back-to-back preferences, departmental ownership, approvers | Must distinguish hard constraints, soft preferences, and permission policy. |
| Students | pathway conflicts, expected demand, reserved seats, registration monitoring | Requires student/SIS evidence and privacy-aware aggregation. |
| Operations | setup/teardown, services, billing, security, publishing, cancellations | Event booking is a lifecycle workflow, not merely availability search. |
| Integration | source system, direction, latency, keys, retries, reconciliation | “Integrates with Banner/Workday” is insufficient without an object-by-object contract. |

The strongest products expose both automation and manual override. A solver should return explainable conflicts and preference trade-offs; human schedulers still resolve governance, scarce-resource, and policy exceptions.

## Space analytics: keep four measures separate

1. **Scheduled time utilization:** reserved room-hours divided by available room-hours.
2. **Projected seat utilization:** requested or expected enrollment divided by room capacity.
3. **Actual enrolled-seat utilization:** census enrollment divided by capacity.
4. **Observed occupancy:** check-in, sensor, or attendance evidence that people were present.

University of Minnesota explicitly separates time utilization from projected and actual seat utilization and notes that actual event attendance is usually unavailable [ROOM-SRC-059]. Microsoft Places likewise distinguishes reservations from observed occupancy signals [ROOM-SRC-061]. Whiteboard should label these measures explicitly and never present reservations as actual use.

## Pricing evidence and limits

No reviewed specialist publishes a general price card. The usable evidence consists of institution-specific contracts with different modules, services, populations, and terms:

| Product | Public example | What it establishes | What it does not establish |
|---|---:|---|---|
| 25Live | 63,000 USD annual license; 208,000 USD implementation across two fiscal years | One district's disclosed term and implementation spending | Market list price or comparable scope for another institution |
| EMS Campus | 112,212.61 USD five-year maintenance | One college's renewal/maintenance trajectory | New implementation, modules, or services |
| Coursedog | 606,249 USD over five years | Bundled academic, room/event, workload, demand, Banner, training, maintenance, licenses, and hardware scope | Module-level standalone rates |
| Ad Astra | 182,839.94 USD over three years including implementation | Exact included and excluded modules for one college | Room/event/exam prices, which were out of scope |
| Mazévo | 8,404 USD/year basic up to 75 rooms; setup and migration extra | Event/facility package economics at one university | Academic scheduling, which the cited page expressly excludes |

These figures should be used to design an RFP and total-cost model, not normalized into a per-student benchmark.

## Implications for the current Whiteboard artifact

The baseline artifact demonstrates navigation and a sample calendar/class concept. It does not currently contain production academic scheduling, room inventory, constraint solving, permissioned booking, SIS synchronization, utilization evidence, or transactional change handling. Any “schedule” UI should remain clearly conceptual until those foundations exist.

The best near-term product opportunity is a neutral planning and coordination layer around authoritative systems: intake, conflict explanation, scenario comparison, approvals, exception ownership, and clearly sourced analytics. Replacing the SIS or attempting a full optimization engine would be a much larger product and implementation commitment.

## Evidence limits

- Vendor documentation proves marketed capability, not performance or implementation quality.
- Public contracts are precise but institution-specific and may omit discounts, taxes, later amendments, or adjacent internal costs.
- Review sites and student forums are useful for failure modes, not frequency. No complaint count is presented as market prevalence.
- Customer counts are included only when a dated source provides a scope; they are not market share.
- Product naming, modules, connectors, and ownership can change. Connector behavior should be revalidated against the exact SIS and product version during procurement.

