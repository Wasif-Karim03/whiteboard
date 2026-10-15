# Domain 06 — Student success and advising research notes

**As of:** 2026-10-15  
**Promotion rationale:** This domain merits separate treatment because advising consumes LMS activity, course progress, registration, and degree data while producing referrals, appointments, notes, and interventions that must cross organizational boundaries. EDUCAUSE's September 2026 interoperability guide identifies the advising/early-alert/learning-tool connection as a direct student-success dependency [ADVISE-SRC-001].

## Scope and method

The domain includes academic advising, degree audit and planning, early alerts, referrals/case management, appointment scheduling, coordinated outreach, persistence analytics, and intervention measurement. It excludes clinical counseling records, disability accommodations, financial-aid determinations, and official degree conferral except where a handoff must be represented.

Research used current vendor/help pages for features, official or authoritative transaction sources for ownership, institutional pages for implementation and authority boundaries, sector organizations for workflow and governance, and review sites for reported friction. Every cited source was opened. Vendor outcome claims are not treated as causal evidence. No public price is presented: all mapped commercial products were treated as quote-based because a comparable current public price card was not found.

The current Whiteboard artifact has no implemented advising, degree audit, student-success case management, referral network, risk engine, or authoritative student-record integration. Existing grade and calendar concepts use sample data and cannot support production intervention decisions.

## Market structure

| Product category | Representative products | Core job |
|---|---|---|
| Broad student-success CRM | EAB Navigate360, EAB Starfish, Civitas Learning, Watermark SS&E, Salesforce Education Cloud, Encoura Reach, ConexED, Element451 | Caseloads, alerts, referrals, appointments, notes, messaging, analytics, and coordination across support offices. |
| Degree management and advising | Ellucian Degree Works + Advising, Stellic Progress + Care, CollegeSource uAchieve | Encode program requirements, audit progress, support what-if plans, exceptions, and advisor/student planning. |
| SIS-native advising | Workday Student Advising, Oracle PeopleSoft Academic Advisement, Ellucian Student | Keep progress, holds, requirements, and planning near authoritative academic records. |
| Engagement/nudging layer | Mainstay | Deliver conversational outreach and behavioral nudges; complements rather than replaces degree audit or case ownership. |

The products overlap but are not interchangeable. A strong early-alert system may have shallow degree-rule logic. A strong audit engine may lack cross-office cases. A CRM may unify communication while relying on external SIS and LMS truth. Whiteboard should model these as distinct services and records.

## Ownership clarification: Starfish and Encoura

Starfish is an **EAB product**. EAB announced an agreement to acquire Starfish from Hobsons in February 2021; reporting on 2021-03-03 confirms that the acquisition completed. EAB still maintains a current Starfish product page and ran Starfish product events in 2026 [ADVISE-SRC-006, ADVISE-SRC-007, ADVISE-SRC-008].

Encoura's February 2026 completed acquisition concerned **Anthology's Lifecycle Engagement and Student Success business**, including the product now documented as Encoura Reach. It did not transfer Starfish to Encoura [ADVISE-SRC-034, ADVISE-SRC-035]. Treating “Encoura/Starfish” as one ownership chain would be incorrect.

EAB itself is jointly owned by BC Partners and Vista Equity Partners; BC Partners lists the 2021 investment as unrealised in 2026 [ADVISE-SRC-010]. Navigate360 and Starfish together are described by EAB as supporting 850 institutions and 10 million students, so the 850 figure is not assigned separately to either product [ADVISE-SRC-011].

## Deep dives

### EAB Navigate360

Navigate360 is the broadest lifecycle CRM in the deep-dive set. Its public materials cover advising workflows, appointments, alerts, cases/referrals, campaigns, analytics, student self-service, integrations, and optional Program Advising. EAB states the SIS is the main source of data and lists LMS, email/calendar, and other connections [ADVISE-SRC-002]. Program Advising is an enhancement with next-term and long-range planning plus mobile scheduling and registration [ADVISE-SRC-003].

The integration between learning activity and advising is concrete: a 2024 case compendium describes an LMS non-login alert that creates an advisor case [ADVISE-SRC-005]. This is useful evidence of the workflow, but the reported case outcomes come from EAB materials and should not be generalized.

Small-sample G2 evidence identifies everyday friction: extra clicks, toggling away from student context to schedule, and limited template customization [ADVISE-SRC-004]. These are plausible high-frequency annoyances, not prevalence estimates.

### EAB Starfish

Starfish centers on early alert, scheduling, case management, operational/strategic analytics, and degree planning [ADVISE-SRC-006]. Its narrower positioning makes it a distinct EAB alternative rather than merely a historical Navigate name. Current public materials do not make the exact integration direction, latency, and mobile packaging sufficiently clear, so those rows are qualified.

A verified Capterra review from an IT director says the institution built its own advisor role and privilege management [ADVISE-SRC-009]. That points to an RFP question: whether local roles, delegated caseloads, note visibility, and temporary coverage can be configured without custom work.

### Ellucian Degree Works and Ellucian Advising

Ellucian's suite separates degree logic from broader advising workflow. Degree Works evaluates program requirements, supports planning and what-if analysis, and can integrate with non-Ellucian SISs. Ellucian Advising adds risk indicators, cases, dashboards, communications, and Microsoft Dynamics/Power Platform automation [ADVISE-SRC-012, ADVISE-SRC-013, ADVISE-SRC-014, ADVISE-SRC-016].

The authority boundary is visible in institutional documentation. Terra State tells students that Degree Works does not replace advisor guidance, the transcript is the official academic record, what-if does not change the program, and “best fit” course placement may need correction. Its audit refreshes nightly and depends on transfer work and changes being posted to Banner [ADVISE-SRC-015].

That makes Degree Works valuable while establishing why Whiteboard should never re-label a mirrored audit as the official degree decision. Exceptions, catalog terms, transfer articulations, repeated courses, and registrar approval remain consequential.

### Stellic Progress and Care

Stellic combines audit-aware multi-year planning in Progress with advising operations in Care. The documented feature set includes degree audit, what-if exploration, requirement editing, appointments, notes, messages, early alerts, LMS signals, referrals, support networks, and admin analytics [ADVISE-SRC-017, ADVISE-SRC-018]. Its public REST API documentation describes batch feeds, API pulls, and event-driven updates [ADVISE-SRC-019].

The clearest implementation caveat comes from Johns Hopkins. Its rollout was delayed by complex program requirements and incorrect SIS configuration, leaving too little validation time. The institution shifted to phased sprints and tighter project management [ADVISE-SRC-020]. This is strong evidence that a modern interface cannot compensate for uncoded or incorrect curriculum rules.

TCU's vendor-published case illustrates the coordination target: centralized notes, consistent appointments, shared student context, planning, referrals, and cross-unit lists [ADVISE-SRC-021]. The values are useful as one implementation story, not an independent causal evaluation. Stellic identifies itself as Stellic Inc.; no completed acquisition was found in official sources [ADVISE-SRC-022].

### Civitas Learning Student Impact Platform

Civitas provides the most detailed public technical documentation in this set. Advising supports Student Success Units, role-based visibility, student lists, appointments, private/shared notes, faculty alerts, assignment and resolution, messaging, and engagement opportunities. The platform also includes administrative analytics, planning, scheduling/registration, course demand, and initiative analysis [ADVISE-SRC-023].

Its prediction design is comparatively explicit: persistence predictions use an institution's historical data, “Powerful Predictors” identify influential variables, and engagement opportunities show “Metrics Involved.” The product documentation states that people make decisions and AI augments judgment. Initiative Analysis uses prediction-based propensity-score matching; that is a stronger measurement method than before/after reporting, but results still depend on assumptions and data quality.

Civitas also makes the build/integrate choice explicit: an institution can use its advising CRM or retain another CRM/early-alert tool while Civitas reads and writes relevant actions [ADVISE-SRC-024]. Security materials describe SSO, FERPA school-official handling, data specifications, and a trust center [ADVISE-SRC-025]. Ultimate financial ownership was not established from the reviewed official sources, so the map does not guess.

## Workflow model

The useful unit is a **closed-loop support episode**, not a risk score:

1. A signal arrives from faculty, LMS, SIS, student self-report, or a support office.
2. A rule creates an alert or referral with a specific reason and urgency.
3. The system assigns an accountable owner and due date.
4. The owner reviews relevant context under least-privilege access.
5. The student receives a supportive explanation and a concrete next step.
6. The receiving office accepts, redirects, or declines the referral with a reason.
7. The action and outcome are recorded without exposing unnecessary sensitive detail.
8. The alert closes or escalates; unresolved cases remain visible.
9. Reporting distinguishes activity, response, service uptake, and student outcome.

An alert without capacity, ownership, or closure can add noise. A prediction without an actionable service can prioritize unmet need rather than resolve it.

## Degree authority and data ownership

| Record | Appropriate authority | Whiteboard role |
|---|---|---|
| Official course history, grades, program, catalog term, holds | SIS / registrar | Read with provenance; do not overwrite. |
| Degree requirements and approved exceptions | Registrar-controlled degree audit/catalog process | Display sourced audit; route questions or exception requests. |
| Student plan | Approved planning system, with student/advisor collaboration | Visualize and discuss; mark proposed versus approved. |
| LMS engagement and graded activity | LMS, with course context and latency | Surface observable facts; avoid interpreting absence as intent. |
| Faculty concern | Faculty-authored alert | Preserve author, reason, timestamp, visibility, and correction path. |
| Advising note | Advising/case system under local retention and access policy | Link or summarize only within permission boundaries. |
| Referral status | Receiving service/case owner | Show accepted, redirected, in progress, resolved, or unable to serve. |
| Risk prediction | Versioned model output | Explain inputs, version, time, limitations, and never treat as fact. |

## Risk analytics and responsible use

Early alerts based on a missed assignment or a current hold are observable and explainable. Predictive scores infer a future outcome from historical patterns. They need separate controls.

Advising Success Network warns that data availability, accuracy, degree-rule coding, privacy, student knowledge/control, and AI/ML bias determine whether advising technology works as intended [ADVISE-SRC-026]. EDUCAUSE likewise frames student-data analytics as a stewardship decision and asks whether profiles change expectations or behavior [ADVISE-SRC-029].

Minimum procurement evidence for any risk engine should include:

- outcome definition and prediction horizon;
- training population, refresh cadence, and excluded attributes;
- performance by relevant student groups and sample sizes;
- calibration and false-positive/false-negative trade-offs;
- local validation before staff use;
- per-student reasons phrased as contributing signals, not causes;
- human review, correction, appeal, and suppression controls;
- monitoring for drift and intervention-induced feedback loops;
- prohibition on high-stakes automatic decisions from the score alone.

The product opportunity for Whiteboard is stronger around transparent current signals and case handoffs than a proprietary risk score.

## Interoperability findings

EDUCAUSE distinguishes a login-level connection from meaningful exchange. Its maturity path moves from disconnected systems, to point-to-platform links, to standards-based integration, to an active data ecosystem. It specifically says advisors need a complete view across advising, early alert, and learning tools [ADVISE-SRC-001].

For this domain, “integrates with the SIS/LMS” is incomplete. The contract must specify objects, fields, direction, latency, keys, correction ownership, deletions, retries, consent/legal basis, and how source changes invalidate derived alerts. Notes and sensitive referrals need a visibility policy separate from general academic progress.

## Pain evidence

The strongest recurring pain is structural:

- fragmented tools and noninterfacing notes;
- alerts without owners or capacity;
- unreliable audit output caused by source coding and exception gaps;
- workflow adoption by faculty and support staff;
- role/permission complexity;
- negative or unactionable messages;
- students unaware of available services;
- opaque risk labels and bias;
- custom integration debt and inconsistent definitions.

Review and forum evidence was used only for concrete failure modes. No complaint frequency or market prevalence was inferred.

## Pricing and buying

The reviewed products use quote-based enterprise selling. No comparable current price card was found, and no numerical price is inferred. Scope can include separate modules for advising, degree audit, planning, messaging/SMS, analytics, mobile, data integration, implementation, rule coding, training, and services.

Typical decision roles include advising/student-success leadership, registrar, academic affairs/provost, CIO/IT, institutional research, data governance, faculty leadership, student affairs, accessibility, privacy/security, and students. The buyer must price internal work: program-rule cleanup, identity/role design, integration, training, service-capacity redesign, and ongoing model/audit governance.

## Research conclusion

The evidence supports promotion of Domain 06 because Whiteboard's teaching context can make LMS events and academic progress easier to hand off to advisors. It does not support building a new degree-audit authority or predictive-risk engine first. A narrow, transparent referral/case layer can add value while preserving the SIS, LMS, audit engine, and existing advising CRM as systems of record.


Current ownership clarification: Francisco Partners lists Civitas Learning as a current private-buyout portfolio investment. This supports the portfolio relationship, not a specific ownership percentage. [ADVISE-SRC-043](https://www.franciscopartners.com/investments/civitas-learning).
