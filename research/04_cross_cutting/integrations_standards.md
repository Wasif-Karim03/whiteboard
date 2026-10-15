# Integration, identity and portability requirements

As of 2026-10-15. Standard support, certification and an operational institutional deployment are three different claims. Whiteboard currently has none of those established. Product evidence is in the matrix; this document specifies the integration decisions.

## Select standards by the job

| Standard/family | Verified purpose and version context | Whiteboard use and boundary (recommendation) |
| --- | --- | --- |
| LTI 1.3 / Advantage | LTI 1.3 improves tool-launch security; Advantage comprises Deep Linking, Assignment and Grade Services and Names and Role Provisioning Services. [CROSS-S12] | For an add-on, implement the tool side against the partner LMS; for a full LMS, platform-side integrations become a separate obligation. Grade passback must show acknowledgment/failure and safe retries. |
| OneRoster | Roster/resource/grade exchange; 1.2 is a published release with profile distinctions. Its ecosystem is strongly school-oriented. [CROSS-S13] | Accept when a target HE deployment supports the needed profile. Do not substitute it for discovery of SIS APIs or assume every university uses it. |
| Edu-API / LIS | Edu-API explicitly targets higher-ed enterprise data; the opened overview still labels it Candidate Final Public, building on LIS and earlier work. [CROSS-S14] | Track it, but choose a deployed, versioned interface for the first school. No “universal higher-ed standard connector” promise. |
| QTI | Assessment items/tests/results; QTI 3 final specification and 3.0.1 model links coexist with older versions and separate draft areas. [CROSS-S16] | Specify supported item types, response processing, accommodation data and source versions. Import must report unsupported constructs. |
| Common Cartridge / Thin Common Cartridge | Course-content interchange and linked-resource packaging. [CROSS-S17] | Export/import teaching materials; keep submissions, feedback, historic grades and third-party link entitlements in a separate migration inventory. |
| Caliper | Structured learning-activity events; catalog lists 1.2. [CROSS-S18, CROSS-S15] | Later, when a school has a defined analytic question and a lawful/approved data purpose. A click is not proof of attendance or learning. |
| xAPI | Learning-experience statements; ADL repository labels its own version historical 1.0.3 and points to current xAPI 2.0. [CROSS-S19] | Use only for a defined LRS/learning-event requirement; agree profiles and identity semantics. Not a substitute for roster or official-grade APIs. |
| SAML / OIDC | Federation/authentication protocols; Entra documents both. [CROSS-S27] | Choose the campus-supported route; validate issuer, audience, signatures, freshness, tenant and return path using maintained libraries. |
| SCIM | User/group provisioning and deprovisioning, separate from SSO. [CROSS-S27] | Useful for account lifecycle. Application permissions and section membership still need authoritative inputs. |

1EdTech makes standards available freely, while its stated conformance-certification process requires membership and testing. Read specifications without spending; evaluate certification costs only under a separately authorized plan. Never label a product certified because it implements part of a protocol. [CROSS-S15]

## Source-of-truth model

The following is a recommended starting architecture, to be agreed with the registrar and IT team, not a claim every campus uses the same model.

| Record | Default authority | Whiteboard responsibility |
| --- | --- | --- |
| Person identity and institutional login | Campus IAM, reconciled with SIS/HR | Maintain stable tenant-scoped subject mapping; do not use mutable email as the only key. |
| Course, section, term and enrollment | SIS / authorized campus feed | Store source identifiers and timestamps; reconcile additions, withdrawals and cross-listing. |
| Assignment, rubric, submission and formative score | LMS owning the course | Version state; preserve submission/release receipts and audit changes. |
| Final academic result | Registrar-controlled SIS process | Export only under agreed authority; distinguish assessment score from official transcript grade. |
| Space/room schedule | Registrar/facilities scheduling owner | Link to authoritative booking status; avoid a second conflicting inventory. |
| Club role/event participation | Approved engagement system or delegated officers | Restrict officer powers, revoke at turnover, minimize sensitive participation data. |

A student can be a TA in another course, an employee, a club officer and an alumni guest simultaneously. One global “student” or “teacher” role cannot encode that. Multi-campus tenancy must explicitly define which legal/institutional boundary is isolated and what cross-registration permits.

## First-school implementation contract

Before coding a connector, capture exact SIS product/version/hosting, academic calendar structure, identity identifiers, course/section hierarchy, cross-listed course rules, integration licensing, API limits, data direction, refresh cadence and named ownership. Public vendor docs show possible routes, not those institution-specific facts. Ellucian, Workday, PeopleSoft and Jenzabar examples are documented in CROSS-S20–CROSS-S26 and CROSS-S33.

Build observable synchronization: cursor/checkpoint; validation and quarantine; idempotent event handling; bounded retries; dead-letter review; reversible mapping changes; reconciliation totals; health and last-success display. Separate a preview from a write. These are engineering recommendations motivated by record correctness, not surveyed feature preferences.

Minimum acceptance cases: a late enrollment, withdrawal, reinstatement, duplicate identifier, renamed user, cross-listed section, TA downgrade, faculty change, guest expiry, term rollover, repeated/out-of-order event, upstream outage and grade write failure. Verify no revoked user or wrong tenant can see a submission. Test failure before retrying a grade write and display the authoritative outcome, not merely “request sent.”

## Migration is an operational project

MSU's checklist and Rutgers' historical transition record provide concrete evidence that import requires human remediation and acceptance. [CROSS-S38, CROSS-S39] For Whiteboard, use a golden-course inventory with representative quizzes, equations, rubric scales, accommodations, linked content and assignments. Compare rendered content and scoring behavior, document omissions, and get faculty signoff. Maintain a protected archive path for records outside the course-content migration.

For institution-wide adoption, require repeatable dry runs, tenant/campus role tests, source-to-target counts, grade-policy reconciliation, accessible course templates, training and a rollback/continuity plan. Do not advertise instant whole-campus migration from a file-format checkbox.
