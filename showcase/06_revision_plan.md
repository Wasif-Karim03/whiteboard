# Whiteboard showcase: step-by-step revision plan

Prepared 15 October 2026. Source implementation is complete. **27 items are source/state verified; 8 UI items await acceptance and 3 browser gates remain blocked.** The steps below preserve the approved execution plan; current per-item status is in the tracker. See [audit](04_revision_audit.md) and [tracker](05_update_tracker.md).

## Outcome and constraints

Make the existing product vision convincing through consistent, complete local workflows. Retain the existing Whiteboard brand, research-backed scope and one self-contained HTML deliverable. Preserve v1. Do not imply production availability, real authentication, connected systems, durable uploads, real AI or completed compliance evidence.

Improve the source modules, then rebuild `Claude outputs/Pellwin-Showcase.html`. Do not hand-edit the generated artifact. Do not add new domains, hosting, paid calls or real data to solve showcase problems.

## Step 0 — Freeze the review baseline and set the acceptance route

1. Check Git status and preserve unrelated changes.
2. Record the current artifact hash and reviewed commit. Keep the existing v1 archive immutable; retain a v2 checkpoint before the first implementation edit.
3. Re-run the existing checks and the review probes; confirm each fix begins from a reproducible issue.
4. Resolve the permitted-browser-access route for eventual QA. Browser access is a prerequisite for testing; REV-01 is the final acceptance result, not the access-enablement task. Do not bypass the recorded URL restriction. Continue independent source/state work while browser checks are blocked, but do not mark visual acceptance complete.

**Output:** reproducible baseline, named fictional scenarios, known verification limits. No screen redesign required yet.

## Step 1 — Repair shared records and approval correctness

**Items:** REV-02, REV-03, REV-04, REV-05, REV-06, REV-15, REV-24, REV-33, REV-35, REV-36.

Work in this order:

1. Define per-learner submissions/attempts and the grading unit. Make question feedback/review status explicit.
2. Connect the grader to the selected learner's evidence. Remove synthetic borrowing of another person's pages.
3. Make release preview an exact approved payload or invalidate it on relevant changes. Respect excused/missing/ungraded distinctions.
4. Define structured event/room intervals and capacity commitments. Validate the full reservation before publication.
5. Replace partial journey resets with coherent named seeds and a documented list of preserved records.
6. Use one assignment policy and explicit sample actors. Guard editable approved records and inappropriate role actions.
7. Validate shared inputs and add targeted regression cases for each defect.

**Acceptance:** no wrong-student work; no unreviewed change slips into a release; excused work stays nonnumeric; no event booking overrun or impossible capacity; no contradictory reset; instructor/student assignment policy agrees. Tests must exercise trigger and downstream outcome, not only HTML presence.

**Checkpoint:** rebuild and inspect changed source/state. This stage must precede cosmetic expansion.

## Step 2 — Make the main walkthrough easy to follow and accessible

**Items:** REV-07 first, then REV-11, REV-12, REV-13, REV-16, REV-17, REV-25, REV-29, REV-31.

1. Stabilize focus and minimize panel replacement. Distinguish navigation from editing and announce outcomes at the destination.
2. Derive hero, Today, course and calendar details from canonical records.
3. Put local step guidance beside the workspace. Explain required action versus Next navigation and explicitly connect submission to grading/released feedback.
4. Make empty/source-delayed states internally consistent.
5. Add equivalent text for sample work, useful page enlargement/rotation behavior and field-linked validation.
6. Add workspace URL/history behavior and complete shared heading/form semantics.
7. Present a concise first-look path for students, teaching staff and institutional reviewers; retain deeper exploration.

**Acceptance:** a fresh reviewer can follow a connected task without hunting for controls; changes agree across all relevant screens; keyboard focus remains meaningful. Browser-dependent acceptance remains pending until it actually runs.

## Step 3 — Complete the visible LMS authoring controls

**Items:** REV-08, REV-09, REV-10, REV-14, REV-28, REV-37.

1. Render learner module order/access from the same course records as the builder.
2. Complete one local assignment-creation/attachment flow.
3. Connect authored quiz items, attempts, review and result policy to the student preview. Keep unsupported item types explicitly bounded.
4. Derive effective learner allowances rather than showing a generic extra-time label.
5. Materialize a separate inspectable course-copy destination with shifted dates and unresolved-tool treatment.
6. Make academic policy precedence and optional draft assistance understandable without using an AI service.

**Acceptance:** edit → learner preview → submission/result uses the same data. Rollover changes the destination, not the source. Settings have a demonstrated effect or are explicitly described as future design choices.

## Step 4 — Finish campus participation and human handoffs

**Items:** REV-21, REV-22, REV-23, REV-38.

1. Make personal calendar membership follow RSVP and occurrence state.
2. Demonstrate a small ordered attendee/waitlist roster and a student pass/manual check-in path.
3. Complete officer transition in the shared roster, contacts and open-work owner. Add an expired/unreachable club case.
4. Preserve entered referral corrections and real transition history. Reflect the resolved/redirected request in the student-safe final view.

**Acceptance:** student/staff views agree on event participation and support status; identity/counts stay consistent; incoming roles actually change ownership. No official transcript, payment, diagnosis or secure-pass service claim is added.

## Step 5 — Make institution readiness inspectable

**Items:** REV-19, REV-20, REV-26, REV-27.

1. Show actual fictional duplicate source rows and a mapping decision.
2. Add rejected/partial exchange and retry/reconciliation examples with source, direction and freshness.
3. Add migration asset/item exceptions, severity and a local report export.
4. Model fictional access expiry and named audit events.
5. Explain intended implementation/support/recovery/exit responsibilities and demonstrate a portable record preview.

**Acceptance:** an IT reviewer can inspect what failed, why it failed, who owns the resolution and what the local export contains. Evidence readiness stays honest; no certified integration or operational SLA is invented.

## Step 6 — Perform visual QA, claims review and handoff

**Items:** REV-01, REV-18, REV-30, REV-32, REV-34.

1. Open the final artifact in a permitted browser surface. Test all chapter defaults and all 40 workspace variants at desktop/phone widths in Light and Dark. Spot-check 320px, intermediate tablet widths and 200% zoom.
2. Traverse all six journeys with pointer and keyboard; check focus restoration, dialog open/close, form errors and reduced motion. Inspect the console and contained overflow. Complete the REV-18 responsive checks and REV-30 rendered hierarchy review before closing REV-01.
3. Review typography, primary-versus-secondary actions and domain hierarchy from rendered evidence. Refine the existing brand rather than adding generic decoration.
4. Check sources, external links, offline assets and every product claim. Confirm no false completed workflow remains.
5. Format development sources for maintainability; rebuild and run the appropriate checks once more after final changes.
6. Update tracker rows individually with evidence and dates. Add handoff notes with exact results and remaining limits. Commit checkpoints only when authorized by the applicable task instructions; implementation permission alone does not authorize commits. This audit itself makes no new commit.

**Acceptance:** no unresolved P0 issue; all intended controls have accurate outcomes; artifact opens independently; archive hash unchanged; browser matrix documented. If permitted browser access is unavailable, mark that gate Blocked and avoid claiming the page is visually verified or fully release-ready.

## Verification matrix

| Check | Coverage | Evidence to save |
| --- | --- | --- |
| Local state regressions | Every confirmed behavior defect and its downstream state | Test name, command, result and relevant revision |
| Six guided journeys | Fresh start, normal completion, repeat reset and one failure/recovery each | Scenario state and observed outcome |
| Cross-view consistency | Selected learner, question, attempt, marks, policy, deadlines, meeting, event and referral | Before/after comparisons |
| Browser layout | Every chapter; every workspace state reviewed; desktop/phone × Light/Dark | Compact matrix with failures and fixes; screenshots only where useful |
| Keyboard/accessibility | Core actions, focus, labels, error associations, dialogs, text alternatives | Actual browser/assistive-tech result, never inferred conformance |
| Offline/claims | No required network assets, useful links, local download, accurate concept language | Static check plus browser execution and copy review |

## Scope discipline

Do not solve this backlog by adding a production backend, public deployment, private-data uploads, broad native apps, finance/payroll/clinical modules, autonomous grading or paid inference. The immediate deliverable is a credible final-product showcase. Real institutional delivery needs a separate engineering and readiness plan, already outlined in the research synthesis.

No dates, costs or effort estimates are invented. Assign owners and estimate after reviewing each bounded implementation group. A fix is Done only when its stated acceptance check passes; Implemented/unverified is a separate state.
