// End-to-end source routes for the instructor workspace. Not browser acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import { WB, S, frame, direct, copy, view, mainOf } from './spine_helpers.mjs';
const V = WB.viewer;
const PHYS = 'phys110-f26', MATH = 'math220-f26';
const current = (over = {}) => ({ ...V.DEFAULTS, role: 'instructor', ...over });
const follow = (state, go) => V.reduce(WB, state, { type: 'link', href: '#/' + go }).vs;
const links = html => [...html.matchAll(/data-go="([^"]+)"/g)].map(m => m[1].replace(/&amp;/g, '&'));
const render = state => V.renderFrame(WB, V.normalize(WB, state).vs);
const selected = (page, selection, more = {}) => current({ page, selection, ...more });

test('two teaching courses link to their own course, coursework, people and gradebook records', () => {
  const today = render(current({page:'W05'}));
  assert.ok(today.html.includes('Linear Algebra'));
  assert.ok(links(today.html).some(g => g.startsWith('W53?tc=' + MATH)));
  const home = render(current({page:'W06'}));
  assert.ok(links(home.html).includes('W35?tc=' + MATH));
  for (const courseId of [PHYS, MATH]) {
    const state = selected('W18', {courseId});
    const who = {role:'instructor',personId:'reyes',courseId};
    const items = S.courseAssessments(view(), who);
    const html = render(state).html;
    for (const item of items) {
      const go = links(html).find(g => g.startsWith(item.kind === 'quiz' ? 'W41' : 'W40') && g.includes('ta=' + item.id));
      assert.ok(go, item.id);
      const next = follow(state, go), page = render(next);
      assert.ok(page.title.includes(item.title), item.id);
      assert.equal(next.role, 'instructor');
      assert.equal(next.selection.courseId, courseId);
      assert.ok(!page.html.includes('Record unavailable'));
    }
    for (const learner of S.teachingLearners(view(), who)) {
      const people = render(selected('W45',{courseId,learnerId:learner.id}));
      assert.ok(mainOf(people.html).includes(learner.name));
      for (const item of items) assert.ok(mainOf(people.html).includes(item.title));
    }
  }
});

test('compact gradebook selects each learner and every grade cell reaches the same assessment', () => {
  for (const platform of ['web','ipad','iphone']) for (const courseId of [PHYS,MATH]) {
    const who = {role:'instructor',personId:'reyes',courseId};
    for (const learner of S.teachingLearners(view(),who)) {
      const state = selected('W51',{courseId,learnerId:learner.id},{platform});
      const html = render(state).html;
      if(platform !== 'web') assert.ok(html.includes('Choose student'));
      for (const item of S.gradebook(view(),courseId,who).items) {
        const go=links(html).find(g=>g.startsWith('W49?')&&g.includes('ta='+item.id)&&g.includes('tl='+learner.id));
        assert.ok(go, learner.id+'/'+item.id+'/'+platform);
        const dest=render(follow(state,go));
        assert.ok(dest.title.includes(S.assessment(view(),item.id).title));
        assert.ok(mainOf(dest.html).includes(learner.name));
      }
    }
  }
});

test('context links keep role, platform, scenario, hard reload and back/forward record identity', () => {
  const start=current({platform:'iphone',scenario:'math_released'});
  const next=follow(start,'W49?tc='+MATH+'&ta=math-assignment&tl=aisha&tr=AH-MATH220-000');
  assert.equal(next.role,'instructor');assert.equal(next.platform,'iphone');assert.equal(next.scenario,'math_released');
  const url=V.formatHash(next), restored=V.parseHash(url).vs;
  assert.equal(V.formatHash(restored),url);
  const moved=follow(next,'W49?tc='+MATH+'&ta=math-assignment&tl=aisha&tr=AH-MATH220-001');
  assert.equal(V.renderPlan(next,moved).frame,true);
  const back=V.reduce(WB,moved,{type:'hash',hash:url}).vs;
  assert.equal(back.selection.receiptId,'AH-MATH220-000');
  assert.equal(follow(moved,'W05').selection,null);
});

test('foreign, empty, mismatched, wrong-editor and peer records deny on every tier', () => {
  const bad=[{courseId:''},{courseId:MATH,learnerId:''},{courseId:'math120-s26'},
    {courseId:MATH,assessmentId:'ps4'}, {courseId:MATH,learnerId:'carmen'},
    {courseId:MATH,assessmentId:'math-practice',receiptId:'AH-MATH220-001'},
    {courseId:PHYS,learnerId:'ben',receiptId:'AH-PHYS110-001'}];
  for(const platform of ['web','ipad','iphone']) for(const selection of bad){
    const r=render(selected('W49',selection,{platform}));
    assert.equal(r.title,'Record unavailable');assert.ok(!mainOf(r.html).includes('aisha-ps4-sample.pdf'));
  }
  assert.equal(render(selected('W41',{courseId:PHYS,assessmentId:'ps4'})).title,'Record unavailable');
  assert.equal(render(selected('W40',{courseId:PHYS,assessmentId:'quiz3'})).title,'Record unavailable');
  assert.equal(render(selected('W23',{courseId:PHYS,assessmentId:'ps4',learnerId:'ben'},{role:'student'})).title,'Record unavailable');
});

test('older attempt never inherits latest attempt marks, review label or released feedback', () => {
  for(const scenario of ['default','math_released']){
    const state=selected('W49',{courseId:MATH,assessmentId:'math-assignment',learnerId:'aisha',receiptId:'AH-MATH220-000'},{scenario});
    const old=mainOf(render(state).html);
    assert.ok(old.includes('Submission attempts')); assert.ok(old.includes('vector-working-first.pdf'));
    assert.ok(!old.includes('Explain why the column vectors are independent.'));
    assert.ok(old.includes('No released feedback is linked to this attempt'));
    assert.ok(!old.includes('>Released<'));
    const queue=mainOf(render(selected('W48',{courseId:MATH,assessmentId:'math-assignment'},{scenario})).html);
    const oldRow=queue.match(/<tr[^>]*>[\s\S]*?AH-MATH220-000[\s\S]*?<\/tr>/)?.[0];
    assert.ok(oldRow&&oldRow.includes('Not reviewed')); assert.ok(!oldRow.includes('>Released<'));
  }
});

test('second-course exact release stays in that course, preserves other held learner and student totals', () => {
  const state=selected('W53',{courseId:MATH,assessmentId:'math-assignment'},{token:'confirm'});
  const html=render(state).html;
  assert.ok(html.includes('AH-MATH220-001'));assert.ok(!html.includes('AH-PHYS110-001'));
  const go=links(html).find(g=>g.startsWith('W53~math_released?'));
  assert.ok(go);const released=follow(state,go);
  const r=render(released);assert.ok(r.html.includes('Version 1'));
  const instructor={role:'instructor',personId:'reyes',courseId:MATH};
  const student={role:'student',personId:'aisha',courseId:MATH};
  const v=view('math_released');
  assert.equal(S.courseTotal(v,MATH,'aisha',instructor,{as:'learner'}).display,S.courseTotal(v,MATH,'aisha',student).display);
  assert.equal(S.resultFor(v,'ben','math-assignment',instructor).status,null);
  const studentHtml=render(selected('W23',{courseId:MATH,assessmentId:'math-assignment'},{role:'student',scenario:'math_released'})).html;
  assert.ok(studentHtml.includes('8 / 10'));assert.ok(studentHtml.includes('Check the final row operation.'));
});

test('submitted quiz evidence is receipt-bound, acknowledged and TA question-scoped', () => {
  const v=view(), teacher={role:'instructor',personId:'reyes',courseId:PHYS};
  assert.equal(S.teachingQuizAnswers(v,teacher,'AH-PHYS110-Q2-001').length,4);
  const html=render(selected('W49',{courseId:PHYS,assessmentId:'quiz2',learnerId:'aisha',receiptId:'AH-PHYS110-Q2-001'})).html;
  assert.ok(html.includes('Submitted answers'));assert.ok(html.includes('sample-answer-q2-1'));
  const data=copy(WB.data), base=data.staff.grading_tasks[0];
  data.staff.grading_tasks=[{...base,learner_ids:['ben']},{...base,id:'quiz-task',assessment_id:'quiz2',learner_ids:['aisha'],question_ids:['q2-1']}];
  const changed=S.buildView(data,'default'), ta=S.viewerFor(changed,'ta');
  assert.equal(S.teachingQuizAnswers(changed,ta,'AH-PHYS110-Q2-001').length,1);
  assert.equal(S.resolveTeachingSelection(changed,'ta',{courseId:PHYS,assessmentId:'ps4',learnerId:'aisha'},'W49',null).allowed,false);
});

test('secondary-course enrollment is sufficient even when the instructor no longer teaches PHYS', () => {
  const data=copy(WB.data);data.world.enrollments.find(e=>e.person_id==='reyes').course_ids=[MATH];
  const r=direct('W51',{role:'instructor',data,selection:{courseId:MATH}});
  assert.deepEqual(r.problems,[]);assert.ok(r.html.includes('Vectors and linear systems'));assert.ok(!r.html.includes('Problem Set 4: Kinematics'));
});

test('record-specific conflict examples and release targets do not carry another record payload', () => {
  const math = render(selected('W49',{courseId:MATH,assessmentId:'math-assignment',receiptId:'AH-MATH220-001',learnerId:'aisha'},{token:'conflict'}));
  assert.ok(!mainOf(math.html).includes('question 2'));
  assert.ok(!mainOf(math.html).includes('fp-dd91aa69'));
  assert.equal(render(selected('W53',{courseId:MATH,assessmentId:'math-assignment',receiptId:'AH-MATH220-000'})).title,'Record unavailable');
});
