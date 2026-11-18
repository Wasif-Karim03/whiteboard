# Whiteboard workspace redesign

Owner brief: the current application feels dated; make it professional, nicer and easier to track. This reopens the visual design, not production/backend scope. Decisions below were chosen by Codex under owner delegation.

Audience/task: learners tracking work, deadlines and feedback; instructors/TAs tracking received/reviewed work without crossing release/scope boundaries. Visual idea: an academic workspace centered on the next concrete action, with quiet navigation and consistently aligned task/date/status rows.

Design contract: keep Whiteboard teal (#007176 / #006a6f), white surfaces (#ffffff), cool canvas (#f3f4f5), ink (#16191b), muted text (#575e63); all existing dark semantic equivalents stay available. Use the local system sans deliberately: 30px page title, 17px section title, 13–15px task/UI text, 11–12px metadata. No remote fonts/assets or decorative charts. Use 8/16/24/32px grouping, white task surfaces, restrained outlines, a single emphasized next-step panel, quieter secondary activity. Colors alone never carry status.

Structure: compact preview utilities → sidebar and workspace header → next action and due/status → submitted-work progress → upcoming tasks. Secondary calendar/announcements remain in a readable rail. Coursework uses real status filters; course browsing groups its filters. Default preview controls collapse in native details but all controls and live status remain available. Tour end returns focus to the visible settings summary when collapsed.

Responsive: live regular web fills available width, reflows rails and grids at intermediate container widths, and stacks navigation at narrow widths; explicit narrow/native previews and the board retain their device targets. Board and app share workspace CSS; the static reference spec intentionally keeps its own styles to preserve its tight size cap. Reduced motion and existing visible focus remain inherited.

Implementation ownership: lead integrates shared CSS, build/style packaging, collapsed preview controls and focus; Terra worker changes W05/W06/W18 and filtering/progress regressions; Astra performs bounded design/risk review. Preserve all record links, status words, immutable receipt/release semantics and scoped selectors. No purchase, backend, deployment, commit or localhost workaround.

Acceptance: inspect representative local-file renders (development only), keyboard details and filtering, intermediate/narrow viewport behavior, dark/larger text and release/TA safety; run all source tests and the combined/legacy/size proofs. Formal owner Phase 6 acceptance remains separate and Not run. Record actual observations and limitations; never infer visual success from a file write.
