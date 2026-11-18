# Phase 3 fix round 1: all 9 findings accepted (coordinator)

## R01 high  
- path: design/final/pages/seg5-authoring/W46.js:70
- evidence: Removing the instructor's enrollment makes viewerFor return the guest viewer, but compose.js preserves a.role as 'instructor'. W46 trusts that role, and staffGate does not verify instructor enrollment. Its unscoped allowanceFor lookup therefore still supplies the learner's note and instructor-only basis reference, which record() renders.
- fix: Verify the viewer's instructor membership in the allowance assessment's course before reading or rendering sensitive allowance fields. Deny mismatched or missing enrollment, and cover both cases with regression tests.

## R02 medium  
- path: design/final/pages/seg2-course/W05.js:122
- evidence: Home resolves activity titles directly from assessments, announcements and discussions. activityFor filters only by recipient, and scenario projection filters only by time. If ann-quiz3 becomes a draft while its existing activity remains, Home still exposes its title although W28/W29 hide it. Similarly, unpublished Quiz 2 remains visible through activity on both W05 and W08, whose assessment lookup also ignores publication.
- fix: Resolve activity references against currently authorized sources: published course assessments, visible announcements and visibleTopics. Suppress inaccessible record details and destinations. Test publication and audience changes with existing activity retained.

## R03 medium  
- path: design/final/pages/seg1-access/W08.js:26
- evidence: A receipt activity title comes from gradingTaskFor(view, personId) rather than ref.id. With a second task ordered before PS4, the existing PS4 receipt notification displays the second assessment's title while its unchanged fixture destination still opens PS4. It also bypasses the referenced task's individual access check.
- fix: Resolve ref.id through the scoped receipt lookup, then obtain that receipt's assessment title. Suppress inaccessible receipt activity. Cover reordered tasks and an expired referenced task alongside another active task.

## R04 medium  
- path: design/final/pages/seg3-submit/W26.js:41
- evidence: Amendment A3 requires disabled, unselected placeholder choices. W26 renders enabled K.choiceGroup inputs. The kit emits native radios/checkboxes without disabled attributes, and viewer/app.js leaves their changes intact. A learner can select fabricated answers while the saved-answer text and review payload continue showing different fixture values. The new test checks only absence of checked.
- fix: Use a noninteractive placeholder presentation or supported disabled controls until the kit supports disabled choice groups. Extend the assertion to verify that placeholder choices cannot be changed.

## R05 medium  
- path: design/final/pages/seg4-community/W47.js:11
- evidence: saveFailed is absent from BLOCK. Consequently W47:saveFailed shows failed-save status but retains enabled Move and Publish controls and the move dialog. A direct saveFailed-plus-move render opens that dialog, contrary to the plan and NOTES requirement that blocking states suppress openers and dialogs.
- fix: Include saveFailed in the blocking logic with a recovery reason; retain Retry separately. Test the failed state alone and combined with move.

## R06 medium  
- path: design/final/pages/seg4-community/W55.js:118
- evidence: The review-tier branches construct protective actions without consulting their blocking helpers. W55 on iPhone/iPad keeps Withdraw enabled offline; W47 keeps Lock membership enabled offline or in conflict; W56 keeps Lock replies enabled even beside 'Refresh before acting'. Their web branches disable those operations. This violates segment rule 9 and makes device behavior inconsistent.
- fix: Apply the same state-dependent disabled reasons to protectiveActions on review tiers. Preserve the relevant failure notices and test each protective control across blocking states on iPad and iPhone.

## R07 medium  
- path: design/final/pages/seg5-authoring/W45.js:67
- evidence: firstUseEmpty affects roster() only. instructor() still renders scopeView(), including Maya and assigned learner names, plus revoke controls and a dialog containing identity details. On review tiers roster() is omitted entirely, so the requested empty state shows the normal scope instead. The plan explicitly requires 'Roster delayed' with no names.
- fix: Handle firstUseEmpty before scope, roster and action rendering on every tier, and suppress the revoke dialog. Assert that no person names or revoke opener appear.

## R08 medium  
- path: design/final/pages/seg3-submit/W27.js:15
- evidence: When the requested receipt cannot be resolved, context() unconditionally substitutes W25's Quiz 3 assessment. For W27:quiz2 with its receipt absent or inaccessible, the page becomes 'Quiz receipt: Quiz 3' and offers Quiz 3 rules or its active attempt. This violates amendment A10 precisely on the missing-record branch.
- fix: Preserve the requested receipt's identity when resolving context. If its assessment cannot be established through authorized data, render a generic unavailable receipt view without another quiz's status or links. Add an absent-Quiz-2-receipt case.

## R09 medium  
- path: design/final/pages/seg6-grading/W50.js:37
- evidence: impactRows equates releaseReady.included === false with 'Not scored yet: nothing to recalculate'. grades.js also returns included:false when a draft contains marks but review_complete is false. Such a partially reviewed draft is therefore falsely described as unscored and excluded from impact consideration.
- fix: Inspect the scoped grade draft independently of release readiness. Distinguish absent marks from incomplete review, and avoid claiming no recalculation impact without evidence. Cover a marked draft whose review is incomplete.

