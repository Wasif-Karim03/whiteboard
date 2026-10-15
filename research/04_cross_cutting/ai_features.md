# AI availability, governance and differentiation

Checked 2026-10-15. Vendor documentation establishes advertised availability and controls, not educational benefit, accuracy or fairness. No model was run and no student content was uploaded. Costs below refer to packaging only; this research authorizes no paid inference.

## Incumbent capabilities and exact status

| Ecosystem | Evidence at the research date | Status and qualification |
| --- | --- | --- |
| Canvas / IgniteAI | September4 help places Agent in Canvas Next and describes admin/instructor feature switches. [CROSS-S40] | Available, entitlement/region dependent. Older “planned instructor access” announcements are superseded by this help page. |
| Canvas premium functions | Packaging update lists discussion insights, rubric generation and SpeedGrader grading assistance in Plus; Agent in Next. [CROSS-S41] | US free trial ended July31 2026; outside-US trial ended September30. Do not call those premium features universally free in October. No negotiated prices found. |
| Brightspace / Lumi Tutor and Feedback | October release notes document updates for customers who purchased the separate solutions. [CROSS-S42] | Available purchased add-ons. Tutor includes admin customization and conversation/export controls; validate actual tenant deployment. |
| Brightspace / Learner Mode | Fusion2026 announcement planned a September beta for Lumi Pro. [CROSS-S43] | **Announced beta timing**, not independently verified GA or proof beta actually shipped. Keep this separate from live Tutor/Feedback. |
| Blackboard | Trust-center list identifies opt-in AI Design Assistant, AVA Assisted Feedback and AVA Playground with named providers; March release describes instructor-reviewed knowledge-check suggestions. [CROSS-S44, CROSS-S45] | Documented current functions; exact plan entitlements and any expired promotional pricing need a quote. No universal free entitlement asserted. |
| Moodle | Versioned documentation describes AI subsystem placements/actions/providers, role controls, content generation and summaries, including provider routes such as Ollama. [CROSS-S46] | Framework available in documented versions; institution configures provider and permissions. Open-source framework does not make hosted inference free or prove a local model fits hardware. |
| Ellucian / Workday | Current product pages market embedded AI/student-experience assistance. [CROSS-S20, CROSS-S24] | Marketing-level direction here; no specific GA administrative agent, price or autonomous-action guarantee inferred. |
| Whiteboard | Audit establishes no AI/OCR backend. | Absent. Name hiding and rubric toggles are local UI behavior, not AI or privacy assurance. |

“AI-assisted grading” can mean suggestion drafting, answer grouping, rubric matching or actual scoring. Record which output is produced, who approves it, whether it is released, and how it is appealed. Do not compare those workflows as one binary feature. An authoring feature is not evidence of competent handwritten-math grading.

## Institutional sentiment and policy implications

EDUCAUSE's January2026 study reports concerns about misinformation, unconsented data use and data protection. Its role table has 1,960 respondents, with managers/staff prominent and faculty a minority; geography and question denominators vary. It is not a survey of all US students or an estimate that every institution holds the same policy. [CROSS-S47]

The Augsburg reflection reports faculty worries about learning and cognitive effort using small local 2025 samples, alongside other literature. This supports studying faculty acceptance, not a national percentage claim. [CROSS-S48] The procurement interviews also show that new AI features inside an existing contract can require fresh evaluation. [CROSS-S34]

Two institution-owned examples clarify the difference between procurement policy and course policy. Harvard's publicly available initial guidance tells staff to protect confidential data in public tools and obtain vendor risk assessment; it explicitly invokes existing policies rather than presenting a new universal policy. Michigan's course-policy resource offers permitted, disclosure-required and prohibited patterns as syllabus examples, not a single university-wide prohibition. [CROSS-S52, CROSS-S53]

Whiteboard should support institution/course/assignment policy distinctions: permitted, prohibited, limited, and disclosure-required uses. Faculty policy should be legible where the student works. An institution-wide AI license does not automatically override a course's assessment rules. These are product recommendations, not statements about a universal legal policy.

## Required product controls (recommendation)

1. Administrators can disable each AI function; disabling it leaves a fully usable teaching workflow. Educators control context-specific use; meaningful student alternatives remain available.
2. Disclose provider/model version, data categories, processing regions, retention, subprocessors, training use and deletion behavior. Obtain contractual no-training or other applicable data-use commitments where required; do not infer them from a general security logo.
3. Use the user's actual permissions and tenant/course scope. Retrieval must not expose another course's hidden submissions or protected advising/disciplinary data. Redact/minimize data before transfer where feasible.
4. Show source context and editable output. Require explicit review before grade changes, feedback release, messages, enrollment edits or high-impact student-success actions. Log who accepted what; support correction/appeal and deterministic rollback where possible.
5. Evaluate on representative content, including handwriting, math, low-quality images, languages, disability accommodations and prompt-injection attempts. Report failures and uncertainty; abstain when evidence is inadequate.
6. Measure useful outcomes against a non-AI workflow: instructor review time plus correction burden, student comprehension, error severity, accessibility and institutional cost. Avoid “time saved” estimates from token speed alone.

Recommended sequence: first make deterministic submissions/grades/audit/recovery trustworthy; then test optional formative help or draft feedback with humans approving. Defer autonomous final grading, disciplinary conclusions and opaque student-risk decisions. This is an evidence-informed risk/UX judgment, not proof AI can never perform them safely.
