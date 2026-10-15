# Accessibility, privacy, security and procurement evidence

Researched 2026-10-15. This is an applicability map and product-readiness analysis, not legal advice or a compliance determination. Counsel and institutional officers must resolve the actual public entity, funding, data, jurisdiction and contract.

## Current legal baseline

**ADA Title II:** the April 20, 2026 interim final rule extended the technical compliance dates to **April 26, 2027** for entities with population at least 50,000, and **April 26, 2028** for smaller entities and special district governments. The specified technical standard remains WCAG 2.1 AA. DOJ's updated fact sheet, Federal Register amendment and eCFR text current through October13 2026 agree. [CROSS-S01, CROSS-S02, CROSS-S51]

Public university deadlines do **not** follow student headcount. DOJ's example uses the parent state's population for a state university. Establish the governing entity for a community college or special district rather than assigning a date from enrollment. Existing access/effective-communication obligations persist; password protection does not exempt an entire LMS. Contracted vendor services are within the rule's scope. [CROSS-S03]

**Private institutions:** do not transfer the Title II deadlines wholesale. Section 504 reaches covered recipients of federal financial assistance, including public/private institutions; Title III covers relevant private public accommodations, with exceptions such as religious entities requiring specific analysis. Private status is not a general accessibility exemption. [CROSS-S09, CROSS-S10]

**FERPA:** the key trigger is Department of Education program funding, including covered postsecondary arrangements—not simply public versus private ownership. The school-official exception for outsourced institutional functions requires, among other conditions, institutional direct control over use/maintenance, legitimate educational interest and purpose/re-disclosure restrictions. Student rights transfer on attendance at a postsecondary institution at any age (or at 18). [CROSS-S04, CROSS-S05]

Product implication (our recommendation): record the approved disclosure basis and purpose; enforce authorization per course/object; limit support access and its duration; support institutional access/correction/export processes. Do not describe Whiteboard as “FERPA certified.” A federal privacy statute is not a product certification program.

## Separate law from evidence

| Item | What it establishes | What Whiteboard should provide |
| --- | --- | --- |
| WCAG | Technical accessibility criteria; 2.2 is a published Recommendation, while the cited Title II rule names 2.1 AA. [CROSS-S11, CROSS-S01] | Prefer a tested 2.2 AA design target while documenting the exact legal/contract mapping. |
| VPAT / ACR | VPAT is ITI's template; a completed tested report is an ACR. Current page offers 2.5Rev April2025. ITI explicitly says there is no VPAT certification. [CROSS-S07] | Version-specific ACR with test methods, real exceptions and remediation ownership; no placeholder compliance badge. |
| HECVAT | EDUCAUSE's vendor-risk questionnaire, currently 4.1.6, including privacy, accessibility and AI areas. [CROSS-S06] | Honest product-specific answers backed by operating evidence. A completed questionnaire is not independent certification. |
| SOC 2 | A scoped auditor examination; Type 2 adds operating-effectiveness evidence over a period, unlike Type 1. [CROSS-S08] | Supply a report only if actually obtained; buyer reviews scope, period, exceptions, complementary controls and subprocessors. |
| RFP and contract | A particular buyer's obligations and acceptance terms. | Negotiate deliverable scope and prove controls; do not turn one institution's requirements into universal law. |

Section 508, ISO frameworks, SOC reports and security questionnaires can be requested in procurement; applicability is not established merely because their names appear in a sales deck. Likewise HECVAT and VPAT are not alternatives to practical accessibility/security tests.

## Data location and operating controls

Do not make a blanket claim that FERPA universally requires US-only hosting. Identify the actual contract and legal basis for any residency or remote-access limit. Record primary storage, backups, disaster recovery, support access, analytics and AI processing regions separately; “US database” does not describe every data flow. A DPA should specify permitted purposes, subprocessors and change notice, retention/deletion, return format, legal holds, breach cooperation and approved international access. These are recommended diligence fields; no state-by-state privacy-law survey was completed.

A real procurement can impose concrete incident duties: DSU's 2026 RFP requires vendor notification without unreasonable delay and a preliminary report within two business days after notice, alongside other liability terms. This is a contract example, not the notification clock for every university or every state. [CROSS-S35]

Recommended controls for even a real-data pilot: server-enforced object permissions; tenant isolation; secure sessions; encryption with managed secrets; authenticated uploads and malware/type validation; restricted logging; audit trails for grading/release/support access; backups with demonstrated restore; deletion with retention/hold semantics; defined incident contacts. No control is proven by a mock administration screen.

## Accessibility acceptance on the actual product

Run critical workflows with keyboard only and representative screen readers: sign-in, course selection, assignment creation, photo/PDF submission, review, rubric grading, accommodations, grade release and feedback. Test touch targets, reflow/zoom, focus, error identification, status announcements, color independence, reduced motion and equations. Include the uploaded-content path; an accessible shell around inaccessible feedback is not an acceptable result. AI/OCR text should be reviewable, and students need an equivalent route when capture or handwriting recognition fails.

Before institutional rollout, perform independent assessment, remediation and regression checks, then update the ACR to the tested version. The current local audit did not establish browser/device/screen-reader behavior. No external attestation, legal compliance, operational incident capacity or production security is established by the available artifact.
