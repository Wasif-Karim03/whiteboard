# Cross-cutting requirements and ecosystem research

As of **15 October 2026**. Desk research using the evidence-research workflow. The six deep dives below concern integration and identity ecosystems, not substitute LMS products. Eight rows in `competitors.csv` include the additional InCommon and Jenzabar map entries. No production products were tested. Source IDs resolve in [sources.md](sources.md); [requirements.csv](requirements.csv) is the actionable requirement register.

## Findings that change the plan

The platform must become a reliable participant in campus infrastructure before its broader scope becomes valuable. A faculty-friendly interface cannot authorize access, determine official enrollment, repair every imported assessment, or substitute for procurement evidence. This is our synthesis from institutional migration evidence and procurement research, not an estimated conversion rate. [CROSS-S34, CROSS-S38, CROSS-S39]

Two freshness corrections matter. DOJ's April 2026 interim final rule moved the Title II web/mobile deadlines to **26 April 2027 and 26 April 2028**, according to entity category; they are no longer the original 2026/2027 pair. Ellucian also reports its acquisition of Anthology's SIS/ERP business closed on December31 2025 (announced in2026); that does not mean Blackboard LMS and the acquired SIS are one current vendor platform. [CROSS-S02, CROSS-S22]

AI authoring, feedback and workflow assistance already exist in incumbent products with material entitlement controls. An AI label is therefore insufficient differentiation. The available build has no operational AI service, identity system, persistence or integrations; compare product claims against that baseline, not the visual polish. [CROSS-S40–CROSS-S46; ../00_baseline/current_build.md]

## Six ecosystem deep dives

### 1. Ellucian Student, Banner/Colleague and Ethos

**Verified scope.** Ellucian's current Student branding spans a legacy and SaaS ecosystem; retain Banner and Colleague names in discovery because deployment and integration details differ. The Hawkeye Community College account documents a concrete Colleague/Ethos transaction path. The acquisition expands Ellucian's SIS/ERP portfolio, without establishing API equivalence between acquired products. [CROSS-S20–CROSS-S22]

**Task path to validate (our implementation plan).** Registrar approves data fields → institution supplies stable person/course/section identifiers → a permitted adapter receives roster changes → Whiteboard reconciles membership and records source/time → exceptions go to an administrator → final grades return only through an approved official-grade workflow. An instructor's assignment score must not silently overwrite an SIS outcome.

**Strength and constraint.** Existing administrative records make this a valuable source-of-truth integration. The implementation constraint is discovering the precise product, hosting model, API entitlement, custom fields, event behavior and institutional owner. Public evidence does not establish one universal connector, list price or certification profile. Require a scoped integration statement of work and a sample add/drop reconciliation, not a broad “Ellucian compatible” claim.

### 2. Workday Student

**Verified scope.** Workday documents student data interchange, duplicate management, privacy settings and restricted data-purge capabilities. Its product page identifies higher-ed institutions, including community-college and university examples; these are vendor-listed relationships, not audited deployment counts. [CROSS-S23, CROSS-S24]

**Task path to validate.** A student may also be a worker. Map person identity independently from employment or enrollment status; import only the necessary academic relationships; preserve the ability to deactivate course access without erasing historical feedback. Obtain institution-approved integration security and tenant configuration before claiming support.

**Strength and constraint.** Broader student/employee/finance context can reduce duplicate administrative experiences. Whiteboard should integrate with the academic record and leave payroll, student finance and aid decisions in their governed systems. Student lifecycle details and API permissions require a tenant-specific demonstration. Pricing and exact LMS connector inclusion remain unknown from opened sources.

### 3. Oracle PeopleSoft Campus Solutions

**Verified scope.** Oracle continues to expose Campus Solutions 9.2 documentation. Its application-integration manual describes Integration Broker web services, request validation and cross-reference maps. This is specific technical evidence, not a claim every installation exposes identical endpoints. [CROSS-S25, CROSS-S26]

**Task path to validate.** Campus integration staff choose published services or a controlled extract → map institutional codes → reconcile changes and failed operations → registrar accepts outcomes. Ask which PeopleTools release, customizations, routing/security rules and maintenance windows apply.

**Strength and constraint.** A documented integration framework is preferable to direct database assumptions. The resulting adapter still needs campus configuration and testing. Avoid coupling Whiteboard's product data model to one installation's internal tables. No current public contract price or supported OneRoster profile was verified here.

### 4. Microsoft Entra ID

**Verified scope.** Entra documentation distinguishes SAML/OIDC authentication from SCIM provisioning. A commercial published price exists, but it is not a higher-ed price quote; see [buying_pricing.md](buying_pricing.md). [CROSS-S27, CROSS-S32]

**Task path to validate.** Campus admin registers the app → maps immutable identifiers and allowed groups → tests login → provisions/deprovisions users → verifies application-side permissions. Successful SSO is only one step. Whiteboard still needs course/section permissions, tenant isolation, support-access expiry and session revocation.

**Strength and constraint.** Reusing the institution's identity policy is a sensible first-school choice. Exact licensing, provisioning latency, group semantics and guest policy are acceptance-test inputs. Never use an unverified email-domain match as proof a person belongs to a campus or a course.

### 5. Google Workspace managed identity

**Verified scope.** Google documents administrator-configured custom SAML apps, group-based availability and IdP/SP-initiated testing. The reviewed page is not evidence that a generic custom app receives universal SCIM provisioning or course rosters. [CROSS-S28]

**Task path to validate.** Institution administrator enables the app for approved accounts/groups → a login resolves to the correct local immutable identity → enrollment authorization is evaluated separately → removal blocks access and active sessions within the agreed policy.

**Strength and constraint.** This can fit a campus already using managed Google identities. Personal Google sign-in and a verified institution-owned account are different trust contexts. Confirm handling of renamed accounts, aliases, alumni, guests and multiple managed domains. Do not infer a Workspace plan price or student headcount from consumer pricing.

### 6. Shibboleth with InCommon

**Verified scope.** Shibboleth provides institution-operated IdP/SP, discovery and metadata tools. Its V5 documentation identifies SAML and an Apache 2.0 license; a separate official OIDC Provider plugin distribution is available. InCommon supplies federation governance and metadata infrastructure, not Shibboleth itself. [CROSS-S29, CROSS-S30, CROSS-S49, CROSS-S50]

**Task path to validate.** Whiteboard's service configuration enters the approved trust arrangement → users select the right institution → assertions/attributes map to stable users → course permissions are checked → signing-key/metadata rollover and incident contacts are exercised.

**Strength and constraint.** This is relevant for institutional and cross-institution access. Federation membership is not required for every bilateral campus pilot, and a paid membership must not be assumed authorized. Operations, attribute release and multi-affiliation decisions remain real work. InCommon's public participation fees are separate from software and from Internet2 dues. [CROSS-S31]

## Broader map and deliberate limits

Jenzabar One API and Unity, powered by Boomi, provide another documented higher-ed integration route. Treat it as a further adapter family when the first partner institution needs it. [CROSS-S33] Populi and smaller integrated SIS/LMS suites are covered by the lead's LMS/landscape work; their existence must prevent “unified platform” from becoming an unsupported uniqueness claim. Okta, CAS, institutional IAM middleware and other SIS products remain discovery candidates, not verified feature rows here.

No comparable SIS market-share denominator, total customer count, negotiated SIS price or product-specific OneRoster certification was established. These cells are intentionally blank/unknown. “Owner” identifies the current product operator, not a complete beneficial-ownership or investor analysis. The main company transaction verified here is the completed Ellucian acquisition.

## Baseline mapping and launch position

| Baseline category | Cross-cutting implication |
| --- | --- |
| Reusable local design | Instructor/TA/student/admin distinctions and recovery-state language can seed task design. |
| Concept only | Institution settings and connection screens need operational services and live status. |
| Described service | LTI, roster exchange, grade passback, retention and support grants require implementation and tests. |
| Absent capability | Authentication, server authorization, tenancy, database, audit logging, backup, incident operation and AI are not established. |
| Prototype repair | Disconnected grades, ignored release choice and fixture receipts must be corrected before any real assessment pilot. |

Recommendation: proceed toward an **institution-sponsored teaching workflow pilot** with one supported identity/LMS/SIS route, while designing a coherent LMS data model. A full-LMS pilot is a different commitment: it must own course continuity, assessments, accessibility, records and support for the participating courses. A narrow pilot is not permission to bypass campus review, and a complete-looking prototype is not grounds for an institution-wide replacement claim.

See [integrations_standards.md](integrations_standards.md), [compliance_security.md](compliance_security.md), [buying_pricing.md](buying_pricing.md), [ai_features.md](ai_features.md) and [opportunities.md](opportunities.md) for the evidence-to-decision detail. Recommendations and proposed tests are analyst judgments; no interview, benchmark, legal audit or working connector is claimed.

## Validation performed

All eleven required domain files are present. Python CSV parsing, exact common headers, unique product and product-feature keys, source/product references, confidence/coverage enums, ISO observation dates and local Markdown links passed. The two college price schedules sum to their stated totals; San Juan training contingency reconciles to the approved cap. Fifty-three source entries were opened. No browser, connector, screen-reader, legal or security audit was performed. No shared files were edited or commits created by this worker.
