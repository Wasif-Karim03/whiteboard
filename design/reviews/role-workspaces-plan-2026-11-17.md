# Student, instructor and TA workspaces

Chosen by Codex under owner delegation, 17 November 2026. The owner asked to differentiate the student/instructor experiences and check whether the two sides match.

Keep shared branding and navigation structure; distinguish the work, labels, entry points and available actions. Student Today and course views prioritize due work, submission status and released feedback. Instructor Today prioritizes submitted work, review and the separate release step; course entry leads to authoring, and assessment rows lead to their actual editors. TA entry prioritizes allocated grading, with task-specific access and expiry.

Confirmed source defects to correct:
- “Preview as learner” points to W14 while W14 draws staff progress/release links. Use an explicit published-content preview with a return to staff authoring; do not impersonate a learner.
- W19:motion's generic queue link opens PS4. Use record-matching routes and suppress unsupported links.
- W48 combines receipts from PS4 and Motion under PS4-specific title/counts. Separate assessment sections while retaining the required group receipt journey.
- W14/W18 can present a PS4 grading link to a TA who has another active task but no active PS4 scope. Check the specific assessment before exposing that action.

Implementation is bounded to shared navigation presentation, role entry pages and these wrong-record/scope cases. Every count/date must come from the same selectors/records as its corresponding assessment view. Keep student published-only visibility, Graded distinct from Released, immutable receipts, TA task scope and instructor-only release. No new data/backend, role-changing links, decorative stripes or new dependencies.

Root owns shared role navigation, W05/W06/W14/W18, selector support and cross-role tests. Terra owns W19/W48 and queue regression tests. Astra performs bounded planning and final source review. Use existing frontend/premium design guidance for restrained hierarchy, not separate visual themes. Keep the deliberately dirty tree and spec byte cap; no commit/push/deploy/paid action.

Acceptance: role entry points and primary actions differ; published title/due/quiz-close data agree across matching student, editor and calendar views; TA links require the specific task; assignment queue rows/counts agree; reviewed/held work does not imply student release. Run the required full source proof. Browser restrictions and owner-only Phase 6 remain unchanged; source checks do not establish rendered usability or runtime authorization.
