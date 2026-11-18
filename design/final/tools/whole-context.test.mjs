// Whole-prototype context/record regression audit, source renders only.
import test from 'node:test';
import assert from 'node:assert/strict';
import {WB,S,frame,direct,view,copy,mainOf} from './spine_helpers.mjs';
const V=WB.viewer, PHYS='phys110-f26';
const base=(page,selection,over={})=>({...V.DEFAULTS,page,role:'student',selection,...over});
const decode=s=>s.replace(/&amp;/g,'&');
const gos=html=>[...html.matchAll(/data-go="([^"]+)"/g)].map(m=>decode(m[1]));
const render=state=>V.renderFrame(WB,V.normalize(WB,state).vs);
const click=(state,go)=>V.reduce(WB,state,{type:'link',href:'#/'+go}).vs;

test('all 63 pages retain structurally valid explicit-course views across roles, tiers and states',()=>{
 let renders=0;
 for(const page of WB.pageIds())for(const role of WB.pageFor(page).page.roles)for(const courseId of [PHYS,'math220-f26'])for(const platform of ['web','ipad','iphone'])for(const token of [null,...WB.pageFor(page).states,...Object.keys(WB.pageFor(page).variants)]){
  const r=frame({page,role,platform,token,selection:{courseId}});
  assert.deepEqual(r.problems,[],`${page}/${role}/${courseId}/${platform}/${token}`);renders++;
 }
 assert.ok(renders>5500);
});

test('student assignment → course overview → another assignment or quiz never carries the first item',()=>{
 let state=base('W19',{courseId:PHYS,assessmentId:'ps4'});
 const overview=gos(render(state).html).find(g=>g.startsWith('W14?'));
 assert.ok(overview);state=click(state,overview);assert.equal(state.selection.assessmentId,undefined);
 const html=render(state).html;
 for(const [page,item,title] of [['W19:motion','motion','Motion investigation'],['W25','quiz3','Quiz 3: Projectile motion']]){
  const target=gos(html).find(g=>g.split(/[?:~]/)[0]===page.split(':')[0] && V.parseHash('#/'+g,{current:state}).vs.selection?.assessmentId===item);assert.ok(target);
  const dest=render(click(state,target));assert.ok(dest.title.includes(title));assert.notEqual(dest.title,'Record unavailable');
 }
});

test('explicit record requests match compatible pages and receipts derive their actual learner',()=>{
 const ben=render(base('W23',{courseId:PHYS,assessmentId:'ps4',receiptId:'AH-PHYS110-002'},{role:'instructor',scenario:'ps4_released'}));
 assert.ok(!mainOf(ben.html).includes('Clear working throughout'));
 for(const page of ['W44','W46','W26','W20','W21']){
  const role=WB.pageFor(page).page.roles.includes('instructor')?'instructor':'student';
  const r=render(base(page,{courseId:PHYS,assessmentId:'lab1'},{role}));
  assert.equal(r.title,'Record unavailable',page);
 }
 for(const extra of [{learnerId:'ben'},{receiptId:'AH-PHYS110-001'}]){
  assert.equal(render(base('W53',{courseId:PHYS,assessmentId:'ps4',...extra},{role:'instructor'})).title,'Record unavailable');
 }
 assert.equal(render(base('W22',{courseId:PHYS,assessmentId:'quiz2',receiptId:'AH-PHYS110-Q2-001'})).title,'Record unavailable');
 const q=render(base('W27',{courseId:PHYS,assessmentId:'quiz2',receiptId:'AH-PHYS110-Q2-001'},{scenario:'quiz_received'}));
 assert.ok(mainOf(q.html).includes('AH-PHYS110-Q2-001'));assert.ok(!mainOf(q.html).includes('AH-PHYS110-Q3-001'));
});

test('presentation tokens retain their default assessment when only course selection is supplied',()=>{
 for(const token of ['acknowledged','confirm']){
  const release=render(base('W53',{courseId:PHYS},{role:'instructor',token}));
  assert.ok(release.title.includes('Problem Set 4'));
  const quiz=render(base('W25',{courseId:PHYS},{token}));
  assert.ok(quiz.title.includes('Quiz 3'));
 }
});

test('immutable group receipt keeps its group identity after membership moves or deletion',()=>{
 for(const remove of [false,true]){
  const data=copy(WB.data), set=data.groups.group_sets[0], original=set.groups[0];
  const id=original.id, name=original.name;
  original.members=original.members.filter(p=>p!=='aisha');set.groups[1].members.push('aisha');
  if(remove)set.groups=set.groups.filter(g=>g.id!==id);
  for(const page of ['W48','W49']){
   const r=direct(page,{data,scenario:'group_submission',role:'instructor',...(page==='W49'?{variant:'group'}:{})});
   const body=mainOf(r.html);
   assert.ok(body.includes(remove?id:name),page);
   assert.ok(!body.includes('Team Vector'),page);
   assert.deepEqual(r.problems,[]);
  }
 }
});

test('ungraded practice never offers a hand-in link to an unrelated draft',()=>{
 const r=render(base('W19',{courseId:'math220-f26',assessmentId:'math-practice'}));
 for(const page of ['W14','W16','W17']) {
  const h=render(base(page,{courseId:'math220-f26'})).html;
  assert.ok(gos(mainOf(h)).some(go=>go.includes('ta=math-assignment')||go.includes('ta=math-practice')),page);
 }
 assert.ok(mainOf(r.html).includes('No hand-in required'));
 assert.ok(!gos(mainOf(r.html)).some(go=>/^W2[01](?:[:~?]|$)/.test(go)));
});

test('staffing examples opened from a solo course select the course whose staffing changes',()=>{
 const state=base('W57',{courseId:'math220-f26'},{role:'instructor'});
 const links=gos(render(state).html);
 const target=links.find(go=>go.startsWith('W57:examples~ta_unassigned?'));
 assert.ok(target);
 const next=click(state,target);
 assert.equal(next.selection.courseId,PHYS);
 assert.ok(mainOf(render(next).html).includes('No grading tasks yet'));
});
