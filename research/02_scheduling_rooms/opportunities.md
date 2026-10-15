# Scheduling and rooms opportunities

**As of:** 2026-10-15

## Recommended posture

Whiteboard should treat scheduling as a coordination and decision-support domain connected to an authoritative SIS and, where present, an institutional scheduler. The current artifact's calendar/class concept is useful as an interaction prototype, but it is not evidence of a production scheduler. A credible product claim begins only after source ownership, constraints, permissions, synchronization, and change semantics are implemented and tested.

The clearest opportunity is the work between systems: making conflicts understandable, collecting structured changes, routing exceptions, comparing scenarios, and explaining which source owns each fact. The specialist market is mature, broad, and institutionally embedded. Competing immediately on full timetable optimization, exam solving, event services, billing, room inventory, and every SIS connector would create a large integration and trust burden.

## Ranked opportunities

### 1. Explainable schedule change workspace

Build a planner where a registrar or department can propose moving a section, adding capacity, changing a meeting pattern, or releasing a room. Show the resulting hard conflicts, affected students, room constraints, approvals, and downstream records before a write occurs.

Why it is promising:

- Existing systems expose dense rules and workflows, while reviews report learning and multi-click friction [ROOM-SRC-019, ROOM-SRC-028, ROOM-SRC-039, ROOM-SRC-040].
- Institutional evidence shows that authority and governance, not only algorithmic optimization, block schedule improvements [ROOM-SRC-058, ROOM-SRC-060].
- It can begin read-only against exports and mature toward controlled writes after reconciliation is proven.

Minimum acceptance test:

1. Import a synthetic term with sections, rooms, instructors, capacities, meeting patterns, and 5–8 rule types.
2. Propose a time or room change.
3. Return deterministic hard conflicts, soft preference effects, affected enrollments, required approvers, and the source record for each fact.
4. Export a reviewable change set without writing to a production system.

### 2. Structured departmental intake and exception routing

Replace email/spreadsheet exchanges with versioned request forms, validation, named owners, decision reasons, and an audit trail. Villanova's documented prior workflow identifies duplicate work, errors, delays, and weak analysis in email/Excel collection [ROOM-SRC-029].

Key design requirements:

- Reusable templates for new section, room preference, instructor availability, special equipment, accessibility need, cancellation, and exception.
- Draft, submitted, returned, approved, rejected, and applied states.
- Field-level validation against the authoritative snapshot.
- Clear differentiation between a request and a committed SIS/scheduler change.
- Bulk import/export for departments that still need spreadsheet review.

This opportunity is useful without pretending to optimize the full timetable.

### 3. Room-data reconciliation and provenance

Create a canonical crosswalk for SIS room codes, scheduler codes, facilities identifiers, display names, capacities, layouts, features, accessibility attributes, and active dates. Flag disagreement and name the steward responsible for resolution.

The need is directly supported by institutional documentation showing room-number disagreement across physical signage, floorplans, and facilities data [ROOM-SRC-011]. PeopleSoft documentation also shows that even native fields and blackouts may not participate in internal search/conflict behavior as users might expect [ROOM-SRC-048].

Minimum acceptance test:

- Load three synthetic source files with intentionally mismatched identifiers, capacities, and active dates.
- Produce deterministic matches, unresolved candidates, provenance, last-seen timestamps, and a steward queue.
- Prevent unresolved records from silently becoming bookable.

### 4. Utilization evidence ledger

Build an analytics layer that labels scheduled hours, projected seats, enrolled seats, check-ins, and sensor observations separately. Display numerator, denominator, date range, excluded periods, source, latency, and confidence with every metric.

This prevents a common category error: treating a reservation as proof that a room was occupied. The University of Minnesota and Microsoft definitions provide a defensible starting taxonomy [ROOM-SRC-059, ROOM-SRC-061].

Initial views:

- Time utilization by building, room type, day, and hour.
- Projected versus enrolled seat fill.
- Cancellations and rooms released too late to reuse.
- Disagreement between scheduled and observed occupancy only when valid check-in or sensor data exists.
- Data completeness and freshness alongside each chart.

Do not infer actual attendance from a calendar reservation.

### 5. Connector contract and reconciliation console

Represent each integration as an explicit object-level contract: source system, direction, fields, keys, latency, transformation, retries, last successful sync, and exception owner. EMS illustrates why the product name alone is inadequate: general documentation describes bidirectional Campus Web Service options while its current Workday platform integration is one-way into EMS [ROOM-SRC-014, ROOM-SRC-015].

The first deliverable can work with file exports and simulated APIs. Production writeback should require idempotency, permissions, audit logs, rollback/reconciliation procedures, and institution-specific validation.

### 6. Student-centered schedule diagnostics

Highlight pathway conflicts, demand pressure, reserved-seat constraints, and required-course collision risk for authorized staff. AASCU program evidence says high-impact fixes can be as small as another section or a resolved conflict, while governance and habits often impede action [ROOM-SRC-057, ROOM-SRC-058].

Protect privacy by using aggregated counts for routine planning and restricting student-level drill-down to legitimate institutional roles. Show whether a signal comes from historical enrollment, declared pathway, current registration, or forecast. Do not present a model projection as known demand.

## What should remain integration-led

The following capabilities have substantial specialist depth and should initially be consumed from or handed off to existing systems:

- Full constraint-based timetable optimization across a term.
- High-stakes exam scheduling.
- Public event registration, billing, catering, security, and service orders.
- Real-time SIS writeback across every vendor/version.
- Sensor-based occupancy ingestion and building-control integration.
- Vertical rehearsal, ensemble, lesson, equipment, and practice-room scheduling.

Whiteboard can expose context and workflow around these systems without claiming native parity.

## Product principles

1. **Show authority and provenance.** Every section, room, enrollment, and booking must state its source and freshness.
2. **Separate proposed from committed.** Scenario work must never look like the authoritative schedule.
3. **Explain conflicts.** Name the rule, records, dates, and resolution owner instead of returning a generic collision.
4. **Model occurrences.** Recurring and irregular meetings need per-occurrence changes and cancellation semantics [ROOM-SRC-010].
5. **Treat accessibility as a constraint with restricted detail.** Store only operationally necessary attributes and avoid exposing personal diagnoses.
6. **Make overrides accountable.** Record who overrode what rule, why, when, and whether downstream systems accepted the change.
7. **Keep measurement honest.** Label scheduled, projected, enrolled, and observed use separately.
8. **Design for occasional users.** Use progressive disclosure, saved views, plain language, keyboard access, and reversible drafts.

## Suggested phased validation

### Phase A — Read-only prototype

- Synthetic or institution-approved de-identified exports only.
- Room crosswalk, schedule views, deterministic conflict checks, change proposals, and metric provenance.
- No production writes or claim of automated optimization.

Exit criteria: all displayed facts trace to a source row; every conflict is reproducible; stale or incomplete inputs are visible; keyboard and reduced-motion checks pass for core flows.

### Phase B — Controlled workflow pilot

- Department intake, approvals, comments, decision reasons, bulk export, and exception ownership.
- One institution, one term, one integration boundary.
- Compare proposed changes with the system of record after each import/export cycle.

Exit criteria: zero silent record loss in the pilot dataset; every status transition audited; reconciliation identifies duplicates, rejected writes, and stale updates.

### Phase C — Narrow connector

- One connector and one bounded write object, such as a reviewed room assignment or approved change file.
- Idempotent writes, retry rules, dry run, rollback/recovery procedure, and operator approval.

Exit criteria: exact version and direction documented; failure injection demonstrates reconciliation; institution owner signs off on permissions and recovery.

### Phase D — Optimization only after evidence

- Start with a constrained room-assignment problem before meeting-time optimization.
- Publish objective functions and hard/soft constraints.
- Compare solver output with a human-built benchmark and measure violations, preference satisfaction, runtime, and manual corrections.

Exit criteria: no hard-constraint violations; deterministic replay; schedulers can explain and override results; outcome quality is measured on institution-approved scenarios.

## Procurement questions derived from the research

- Which modules are included: academic, room optimization, exams, events, demand, analytics, calendar, services, billing?
- Does the optimizer assign times, rooms, instructors, or some subset? Which rules are hard versus weighted?
- How are irregular occurrences, cross-listed sections, linked activities, hybrid meetings, online rooms, setup/teardown, and sub-rooms modeled?
- For the exact SIS/version, which objects synchronize in each direction, at what latency, and with which system authoritative?
- What happens to rejected writes, duplicate keys, partial batches, and concurrent edits?
- Which utilization figures use reservations, projected seats, actual enrollment, check-ins, or sensors?
- Can confirmed requesters edit, cancel, or copy an event, and what permissions change those actions?
- What data cleanup, implementation, training, hardware, professional services, and annual escalation sit outside subscription price?
- Can the institution export all schedule, constraint, audit, and room records in a documented format?
- What accessibility metadata exists and who can view it?

## Decision recommendation

Advance a **read-only schedule diagnostics and change-workflow prototype** if Domain 02 is selected for build exploration. Treat SIS/scheduler replacement and full timetable optimization as out of initial scope. The prototype should demonstrate provenance, explainable conflicts, scenario status, room-data reconciliation, and honest utilization measures with synthetic data. That path tests a differentiated coordination layer while respecting the depth and institutional lock-in of the existing market.

