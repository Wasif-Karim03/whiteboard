'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const context=vm.createContext({window:{},console,Date,Set,Map,Intl});
for(const file of ['src/core.js','src/teaching.js']){
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
}
const WB=context.window.WB;
const ids=['S09','S14','S15','S16','S17','S18','S19','S20','S21','S22','S23'];
assert.deepEqual(Object.keys(WB.renderers).sort(),ids.slice().sort(),'all teaching screens register');
assert.ok(Object.keys(WB.actions).filter(x=>x!=='set').every(x=>x.startsWith('teach-')),'module actions are namespaced');

for(const id of ids){
  const before=JSON.stringify(WB.state);
  const html=WB.render(id);
  assert.equal(JSON.stringify(WB.state),before,`${id} render stays pure`);
  assert.match(html,/<h4>|Faculty workspace/,`${id} renders substantial markup`);
  assert.ok(html.length>700,`${id} is not a placeholder`);
}

WB.state.teaching.coursePublished=false;
WB.reset();
assert.equal(WB.state.teaching.coursePublished,true,'reset restores cloned teaching defaults');
assert.notEqual(WB.state.teaching,WB.defaults.teaching,'reset does not reuse default object');
const gradebookAsc=WB.render('S19');
WB.dispatch('teach-sort-grades');
const gradebookDesc=WB.render('S19');
assert.ok(gradebookAsc.indexOf('Aisha Rahman')<gradebookAsc.indexOf('Owen Wright'),'ascending sort changes visible row order');
assert.ok(gradebookDesc.indexOf('Owen Wright')<gradebookDesc.indexOf('Aisha Rahman'),'descending sort changes visible row order');

// The real received/graded records drive the queue through its final item.
assert.match(WB.render('S17'),/2 remaining/);
WB.dispatch('teach-save-next');
assert.ok(WB.state.assessment.graded.includes('aisha'));
assert.equal(WB.state.assessment.student,'student-40');
WB.dispatch('teach-save-next');
assert.match(WB.render('S17'),/0 remaining/);
assert.match(WB.render('S17'),/All received work has been graded/i);

// Conflict recovery makes one explicit choice and closes the conflict.
WB.reset();
const scoreBefore=WB.state.assessment.marks.aisha[3];
WB.dispatch('teach-conflict-start');
assert.equal(WB.state.assessment.conflict,true);
const conflictState=JSON.stringify({student:WB.state.assessment.student,graded:WB.state.assessment.graded,marks:WB.state.assessment.marks});
assert.match(WB.dispatch('teach-save-next').message,/Resolve/);
assert.equal(JSON.stringify({student:WB.state.assessment.student,graded:WB.state.assessment.graded,marks:WB.state.assessment.marks}),conflictState,'open conflict blocks save-and-next');
assert.match(WB.dispatch('teach-student',{id:'ben'}).message,/Resolve/);
assert.equal(WB.state.assessment.student,'aisha','open conflict cannot move to another student');
WB.dispatch('teach-conflict-resolve',{choice:'theirs'});
assert.equal(WB.state.assessment.conflict,false);
assert.equal(WB.state.assessment.marks.aisha[3],scoreBefore-1);
assert.equal(WB.state.teaching.conflictContext,null);

// Work pages follow question tags and an empty submission has a recovery route.
WB.reset();
WB.state.submission.pages[0].rotation=90;
WB.state.submission.pages.find(page=>page.tag==='3').rotation=180;
assert.match(WB.render('S17'),/rotate\(180deg\)/,'grader uses the page tagged for the selected question');
WB.state.submission.pages=[];
assert.doesNotThrow(()=>WB.render('S17'));
assert.match(WB.render('S17'),/No page tagged for question 3/);
assert.match(WB.render('S17'),/Organize submission pages/);

// Rubric impact is derived from current use/override records and preserves overrides.
WB.reset();
assert.match(WB.render('S18'),/2 answers change/);
WB.state.teaching.rubricUses=['ben'];
WB.state.teaching.rubricOverrides=[];
assert.match(WB.render('S18'),/1 answer changes/);
const benBefore=WB.state.assessment.marks.ben[3];
WB.dispatch('teach-rubric-apply');
assert.equal(WB.state.assessment.marks.ben[3],benBefore-1);
assert.equal(WB.state.assessment.rubricAdjusted,true);
assert.match(WB.render('S18'),/0 answers change/,'an already-applied rule has no claimed impact');

// TA restrictions are enforced by actions as well as disabled interface controls.
WB.reset();
WB.dispatch('teach-role',{role:'ta'});
const taBefore=JSON.stringify(WB.state);
assert.match(WB.dispatch('teach-rubric-apply').message,/Only the instructor/);
assert.equal(JSON.stringify(WB.state),taBefore);
assert.match(WB.dispatch('teach-rubric-delta',{delta:-2}).message,/Only the instructor/);
assert.equal(JSON.stringify(WB.state),taBefore);
assert.match(WB.dispatch('teach-rubric-cancel').message,/Only the instructor/);
assert.equal(JSON.stringify(WB.state),taBefore);
assert.match(WB.dispatch('teach-release-preview').message,/cannot release/);
assert.equal(JSON.stringify(WB.state),taBefore);
assert.match(WB.render('S17'),/Rubric editing is instructor-only/);

// Permission mutations are instructor-only, and a revoked TA cannot grade.
WB.reset();
WB.dispatch('teach-ta-toggle'); // instructor revokes access
assert.equal(WB.state.institution.taActive,false);
WB.dispatch('teach-role',{role:'ta'});
const revokedBefore=JSON.stringify({marks:WB.state.assessment.marks,graded:WB.state.assessment.graded,taActive:WB.state.institution.taActive});
assert.match(WB.dispatch('teach-score',{score:2}).message,/no longer has grading access/);
assert.match(WB.dispatch('teach-save-next').message,/no longer has grading access/);
assert.match(WB.dispatch('teach-ta-toggle').message,/Only the instructor/);
assert.equal(JSON.stringify({marks:WB.state.assessment.marks,graded:WB.state.assessment.graded,taActive:WB.state.institution.taActive}),revokedBefore);
const revokedHtml=WB.render('S17');
assert.match(revokedHtml,/TA access revoked/);
assert.doesNotMatch(revokedHtml,/data-bind="assessment\.comments\.aisha"/,'revoked TA receives no editable comment control');

// Selected release holds an ungraded record, then releases exactly it once graded.
WB.reset();
WB.dispatch('teach-release-scope',{scope:'selected'});
assert.match(WB.dispatch('teach-release').message,/Preview/);
assert.deepEqual(Array.from(WB.state.assessment.released),[]);
WB.dispatch('teach-release-preview');
assert.deepEqual(Array.from(WB.state.teaching.releasePreparedIds),[]);
assert.deepEqual(Array.from(WB.state.teaching.releasePreparedHeld),['aisha']);
WB.dispatch('teach-release');
assert.deepEqual(Array.from(WB.state.assessment.released),[]);
WB.state.assessment.graded.push('aisha');
WB.dispatch('teach-release-preview');
WB.state.teaching.releasePreparedIds.push('ben'); // selected scope cannot expand after preview
WB.dispatch('teach-release');
assert.deepEqual(Array.from(WB.state.assessment.released),['aisha']);
assert.match(WB.render('S09'),/Feedback released/);
assert.match(WB.render('S09'),/27 \/ 30/);
assert.deepEqual(Array.from(WB.state.assessment.releaseSnapshots.aisha.marks),[6,4,5,7,5]);
assert.equal(WB.state.assessment.releaseSnapshots.aisha.attempt,1);

// Later grading changes stay draft-only until an explicit re-release snapshot.
const releasedComment=WB.state.assessment.releaseSnapshots.aisha.comment;
WB.state.assessment.marks.aisha[3]=5;
WB.state.assessment.comments.aisha='New staff draft that is not released.';
const heldStudentView=WB.render('S09');
assert.match(heldStudentView,/27 \/ 30/);
assert.match(heldStudentView,new RegExp(releasedComment.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
assert.doesNotMatch(heldStudentView,/New staff draft that is not released/);
assert.match(heldStudentView,/New draft held for review/);
assert.match(WB.render('S17'),/New draft after release/);
assert.match(WB.render('S19'),/New draft after release/);
WB.dispatch('teach-release-preview');
assert.deepEqual(Array.from(WB.state.teaching.releasePreparedIds),['aisha']);
WB.dispatch('teach-release');
assert.match(WB.render('S09'),/25 \/ 30/);
assert.match(WB.render('S09'),/New staff draft that is not released/);
assert.equal(WB.state.assessment.releaseSnapshots.aisha.rubricVersion,WB.state.teaching.rubricVersion);
WB.state.submission.attempt=2;
assert.doesNotMatch(WB.render('S09'),/Feedback released/,'a prior attempt snapshot cannot release a new attempt');

// All-reviewed uses canonical graded records and cannot include ungraded work.
WB.reset();
WB.dispatch('teach-release-scope',{scope:'all-reviewed'});
WB.dispatch('teach-release-preview');
const expectedReleased=WB.state.assessment.graded.length;
assert.equal(WB.state.teaching.releasePreparedIds.length,expectedReleased);
WB.state.teaching.releasePreparedIds.push('aisha'); // stale/tampered preview is rechecked
WB.dispatch('teach-release');
assert.equal(WB.state.assessment.released.length,expectedReleased);
assert.ok(!WB.state.assessment.released.includes('aisha'));

// Authored sample draft honors institution policy and cannot change score/release.
WB.reset();
const protectedBefore=JSON.stringify({marks:WB.state.assessment.marks,released:WB.state.assessment.released});
assert.match(WB.dispatch('teach-ai-start').message,/disabled/);
assert.equal(WB.state.assessment.aiDraft,false);
WB.state.institution.aiEnabled=true;
WB.dispatch('teach-ai-start');
assert.equal(typeof WB.state.assessment.aiDraft,'string');
assert.equal(WB.state.teaching.aiDraftFor,'aisha');
WB.state.assessment.aiDraft='Edited instructor feedback.';
WB.dispatch('teach-ai-accept');
assert.equal(WB.state.assessment.comments.aisha,'Edited instructor feedback.');
assert.equal(JSON.stringify({marks:WB.state.assessment.marks,released:WB.state.assessment.released}),protectedBefore);
WB.dispatch('teach-ai-start');
WB.dispatch('teach-ai-discard');
assert.equal(WB.state.assessment.aiDraft,false);
WB.dispatch('teach-student',{id:'ben'});
assert.match(WB.render('S17'),/Review your units and show the intermediate steps/,'grader reads selected student comment');

// Authoring, permissions, copy exceptions, and attendance controls change local records.
WB.reset();
WB.dispatch('teach-course-publish');
assert.equal(WB.state.teaching.coursePublished,false);
WB.dispatch('teach-course-preview');
assert.doesNotMatch(WB.render('S14'),/Forces and free-body diagrams/,'student preview hides draft module');
WB.dispatch('teach-assignment-save');
assert.equal(WB.state.teaching.assignmentSaveRevision,1);
WB.dispatch('teach-bank-toggle',{id:'qb-2'});
WB.dispatch('teach-bank-add');
assert.ok(WB.state.teaching.quizItems.some(q=>q.id==='qb-2'));
WB.dispatch('teach-allowance',{id:'aisha'});
assert.ok(WB.state.teaching.allowances.includes('aisha'));
WB.dispatch('teach-copy-preview');
assert.match(WB.dispatch('teach-copy-apply').message,/Resolve/);
assert.equal(WB.state.teaching.copyApplied,false);
WB.dispatch('teach-copy-resolve');
WB.dispatch('teach-copy-apply');
assert.equal(WB.state.teaching.copyApplied,true);
WB.dispatch('teach-attendance-correct',{id:'aisha',date:'Wed 14 Oct'});
assert.equal(WB.state.teaching.attendance[0].status,'Present');

console.log(`Teaching checks passed: ${ids.length} pure screens, canonical grading/release flow, role guards, and authoring controls.`);
