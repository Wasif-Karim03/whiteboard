# Student success and advising opportunities

**As of:** 2026-10-15

## Recommendation

Build a transparent referral and case-handoff layer later in the roadmap, after the core LMS and identity/integration foundations are trustworthy. Keep official degree audit, program requirements, academic standing, and registration authority in the SIS/registrar ecosystem. Integrate with an existing advising platform when an institution has one. Defer predictive risk scoring until there is local governance, validation capacity, service inventory, and evidence that staff can act on the signals.

This is a promoted adjacency because the LMS is often where an observable need first appears, while the advisor or support office owns the response. Whiteboard can improve that handoff without claiming to know why a student is struggling.

## Opportunity 1 — Explainable referral handoff

Let authorized faculty or staff create a referral from a concrete context such as a missed assignment, repeated absence, course question, or student request. The record should contain:

- observable reason and source link;
- student-visible wording separate from internal routing metadata;
- receiving service, accountable owner, due date, and urgency;
- only the minimum necessary context;
- accepted, redirected, in progress, resolved, unable-to-contact, and unable-to-serve states;
- timestamped updates and a correction/retraction path;
- escalation when no owner accepts the referral;
- an outcome category that does not require sensitive narrative.

This addresses the closed-loop gap shown across Navigate360, Starfish, Stellic, Civitas, and EDUCAUSE guidance [ADVISE-SRC-001, ADVISE-SRC-002, ADVISE-SRC-006, ADVISE-SRC-018, ADVISE-SRC-023].

Acceptance test:

1. Create a synthetic faculty concern from a course.
2. Route it to a configured tutoring queue.
3. Verify the student, faculty member, advisor, and tutor each see only their permitted view.
4. Redirect once, accept, record an action, close, reopen, and audit every transition.
5. Remove access from one role and verify previously cached sensitive text is unavailable.

## Opportunity 2 — Student-facing support map and warm handoff

Show each student a clear, institution-configured support network: academic advisor, tutoring, financial aid, career, accessibility, basic-needs, and other services. Each service entry needs eligibility, scope, modality, current hours, booking/contact route, expected response time, and emergency boundaries.

A warm handoff should let the student know why the referral was made, what information will be shared, what happens next, and how to decline or correct information where policy permits. EDUCAUSE found that students at the same institution may disagree about whether support technology is available, making discovery part of the problem [ADVISE-SRC-028].

Acceptance test: a synthetic student can find a relevant resource in two steps, understand what will be shared, book or request help, and see the handoff state without seeing internal notes.

## Opportunity 3 — Evidence-linked advising context

Create an advisor preparation view that links to authoritative sources rather than copying unqualified values:

- current program/catalog term and holds from the SIS;
- degree-audit timestamp and unresolved exceptions from the audit system;
- current enrollments and graded items from the LMS;
- student plan and appointment/referral history from the advising platform;
- data freshness, source, and permission on every section.

Do not collapse these into an unsourced “360 profile.” EDUCAUSE warns that inconsistent definitions and unclear data flows amplify problems at scale [ADVISE-SRC-001].

Acceptance test: intentionally stale one source, revoke another, and introduce a conflicting program value. The interface must show the conflict and source owners instead of silently selecting a winner.

## Opportunity 4 — Observable-signal inbox

Start with events people can verify: missing assignment, no LMS login for a configured period, faculty concern, new hold, dropped course, unregistered next term, missed appointment, or student help request. Show why the item appeared and let staff correct it.

Avoid a single red/yellow/green “risk” label. Each item should show event time, source freshness, course/term context, applicable policy, previous outreach, and whether a service is actually available.

Acceptance test: replay the same synthetic events and get the same inbox. Changing a source record must retract or update the signal. A staff member can document “not actionable” without changing the underlying academic record.

## Opportunity 5 — Referral capacity and service-level visibility

Add operational data that established product marketing often underplays: queue age, unassigned cases, accepted/refused referrals, time to first response, appointment availability, unable-to-serve reasons, and reopening. Predicting more need without measuring capacity can worsen inequity by making demand visible while leaving it unmet.

Report activity separately from outcomes:

- **activity:** messages sent, referrals created, appointments booked;
- **response:** contact made, referral accepted, service used;
- **resolution:** issue resolved, redirected, unable to resolve;
- **academic outcome:** persistence, completion, or course result;
- **causal claim:** requires an appropriate evaluation design and cannot be inferred from correlation.

## Opportunity 6 — Degree-audit question and exception workflow

Offer a structured “ask about this requirement” action on imported audit output. Route it to the correct advisor or registrar queue with the audit version, requirement identifier, source catalog, course, and student explanation.

Whiteboard should not recalculate the audit. Terra State documents that Degree Works best-fit placement can need correction, what-if does not change the official record, and posted SIS data controls the audit [ADVISE-SRC-015]. Maryland likewise says uAchieve does not imply degree clearance [ADVISE-SRC-033].

Acceptance test: a student questions a synthetic requirement, the registrar resolves it in the authoritative mock system, and Whiteboard shows the new audit only after the source version changes.

## Capabilities to integrate or defer

### Integrate

- Official degree audit, program requirements, transfer articulation, substitutions, waivers, and graduation clearance.
- SIS program, enrollment, grade, hold, standing, and registration records.
- LMS graded activity and engagement events.
- Existing advising CRM notes, appointments, cases, campaigns, and permissions.
- Institutional messaging and emergency communications.

### Defer

- Predictive persistence or completion score.
- Automated “best intervention” recommendations.
- Generative summaries of sensitive advising notes.
- Automatic outreach based only on a model score.
- Clinical, conduct, disability, immigration, or financial-aid case management.
- Degree-rule authoring and official graduation certification.

## Guardrails for any later risk engine

If the institution later requests predictive prioritization, require a separate validation and governance project. The minimum product contract is:

1. Define the outcome, horizon, population, and allowed use.
2. Document data lineage, missingness, lag, and excluded sensitive attributes.
3. Validate calibration and error rates locally and by relevant groups.
4. Show contributing signals and their timestamps; never claim causation.
5. Let authorized staff correct data, dismiss a signal, and record rationale.
6. Give students an understandable notice and appropriate review channel.
7. Prohibit automatic adverse academic, financial, disciplinary, or access decisions.
8. Monitor whether interventions change the data used by later model versions.
9. Sunset models that drift or no longer support an actionable service.

Advising Success Network and EDUCAUSE both identify privacy, accuracy, bias, transparency, and stakeholder governance as conditions for responsible advising analytics [ADVISE-SRC-026, ADVISE-SRC-029].

## Suggested delivery sequence

### Later MVP: synthetic referral workflow

- Institution-configured support directory.
- Faculty/student help request.
- Least-privilege routing and status lifecycle.
- Transparent current signals only.
- Source links, timestamps, audit log, and data-expiry rules.
- No production integration and no risk score.

### Pilot: one low-risk service

Use one institution-approved service such as tutoring or general academic advising. Import approved identifiers through a read-only connector; export referrals for human review if no API exists. Measure routing completeness, time to acceptance, student visibility, permission errors, and unresolved cases.

### Integration release

Connect one SIS or advising platform with an object-level contract. Add idempotency, retry, reconciliation, audit export, retention/deletion rules, and incident procedures. Preserve the external system as authority.

### Expansion

Add more support units only after each unit defines eligibility, staffing, note visibility, escalation, and outcome categories. Evaluate predictive features only after observable-signal workflows are adopted and capacity data is reliable.

## Procurement questions

- Which system owns degree requirements, exceptions, official clearance, advising notes, referrals, appointments, and risk outputs?
- Which features are separate modules or services?
- For each SIS/LMS/advising connector, what moves in each direction, how often, and how are deletes and corrections handled?
- Can the institution export notes, cases, audit history, model outputs, and configuration in documented formats?
- How are advisor delegation, temporary coverage, cross-unit access, and private notes configured?
- Can a referral be redirected, refused for lack of capacity, reopened, and escalated?
- What does the student see, and can they correct or contest information?
- For a prediction, what is the target, training population, local validation, group-level performance, explanation method, and drift plan?
- Which AI features are enabled by default, what data is sent, and can each be disabled independently?
- What implementation work covers degree-rule cleanup, historical conversion, testing, training, and adoption?

## Product decision

Promote the domain for **later integration-led development**. The Whiteboard advantage is a clear, contextual bridge from teaching activity to human support. The recommended first product is transparent referral and status coordination. Degree audit, official records, predictive scoring, and high-sensitivity casework remain with specialist and institutional systems.

