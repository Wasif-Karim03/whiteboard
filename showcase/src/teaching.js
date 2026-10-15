(function(){
'use strict';

const WB=window.WB;
const questionIndex=(s,id)=>Math.max(0,s.assignment.questions.findIndex(q=>q.id===id));
const questionMax=(s,id)=>s.assignment.questions[questionIndex(s,id)].max;
const fallbackMarks=()=>[6,4,5,7,5];
const marksFor=(s,id)=>s.assessment.marks[id]||[];
const commentFor=(s,id)=>s.assessment.comments[id]||'';
const person=(s,id)=>s.people.find(p=>p.id===id);
WB.defaults.assessment.releaseSnapshots=WB.defaults.assessment.releaseSnapshots||{};
WB.state.assessment.releaseSnapshots=WB.state.assessment.releaseSnapshots||{};
const receivedPeople=s=>s.people.filter(p=>p.active&&(p.id==='aisha'?s.submission.status==='received':p.submitted));
const remaining=s=>receivedPeople(s).filter(p=>!s.assessment.graded.includes(p.id));
const unique=xs=>Array.from(new Set(xs));
const isInstructor=s=>s.assessment.role==='instructor';
const canGrade=s=>isInstructor(s)||(s.assessment.role==='ta'&&s.institution.taActive);
const snapshotFor=(s,id)=>s.assessment.releaseSnapshots[id];
const hasCurrentSnapshot=(s,id)=>{
  const snapshot=snapshotFor(s,id);
  return !!(s.assessment.released.includes(id)&&snapshot&&(id!=='aisha'||snapshot.attempt===s.submission.attempt));
};
const hasReleaseDraft=(s,id)=>{
  const snapshot=snapshotFor(s,id);
  return hasCurrentSnapshot(s,id)&&(JSON.stringify(snapshot.marks)!==JSON.stringify(marksFor(s,id))||snapshot.comment!==commentFor(s,id)||snapshot.rubricVersion!==s.teaching.rubricVersion);
};
const pageForQuestion=(s,id)=>s.submission.pages.find(page=>String(page.tag||'').split(',').map(tag=>tag.trim()).includes(id));
const copyDate=(value,days)=>{
  const d=new Date(value+'Z');
  d.setUTCDate(d.getUTCDate()+Number(days||0));
  return d.toISOString().slice(0,16);
};
const prettyDate=value=>{
  const d=new Date(value+'Z');
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let hour=d.getUTCHours(),suffix=hour>=12?'pm':'am';
  hour=hour%12||12;
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()} · ${hour}:${String(d.getUTCMinutes()).padStart(2,'0')} ${suffix} ET`;
};
const roleNotice=(s,h)=>isInstructor(s)?'':s.institution.taActive?h.notice('TA scope','TAs can score and comment. Rubric rules and grade release remain instructor-only.','warning'):h.notice('TA access revoked','Maya Chen can no longer score, comment, change permissions, or release work in this course.','error');
const toggleButton=(h,label,action,data,pressed,kind='quiet')=>h.btn(label,action,data,pressed?'primary':kind).replace('<button ','<button aria-pressed="'+String(pressed)+'" ');
const teacherTabs=(h,current)=>{
  const links=[['S14','Build'],['S15','Assign'],['S16','Quiz'],['S21','People'],['S22','Copy'],['S23','Insights']];
  return `<nav class="segmented" aria-label="Faculty workspace">${links.map(([id,label])=>id===current?`<span class="button primary" aria-current="page">${label}</span>`:h.go(label,id,'quiet')).join('')}</nav>`;
};
const gradeStatus=(s,id)=>{
  if(s.teaching.excused.includes(id))return 'Excused';
  if(hasReleaseDraft(s,id))return 'New draft after release';
  if(hasCurrentSnapshot(s,id))return 'Released';
  if(s.assessment.graded.includes(id))return 'Graded';
  const p=person(s,id);
  return p&&(p.id==='aisha'?s.submission.status==='received':p.submitted)?'Ungraded':'Missing';
};
const releaseCandidates=s=>{
  const received=new Set(receivedPeople(s).map(p=>p.id));
  if(s.assessment.releaseScope==='selected'){
    const id=s.assessment.student;
    return s.assessment.graded.includes(id)&&received.has(id)&&(!hasCurrentSnapshot(s,id)||hasReleaseDraft(s,id))?[id]:[];
  }
  return s.assessment.graded.filter(id=>received.has(id)&&(!hasCurrentSnapshot(s,id)||hasReleaseDraft(s,id)));
};
const heldFromScope=s=>{
  if(s.assessment.releaseScope==='selected'){
    const id=s.assessment.student;
    return receivedPeople(s).some(p=>p.id===id)&&!s.assessment.graded.includes(id)?[id]:[];
  }
  return remaining(s).map(p=>p.id);
};
const impactRecords=s=>{
  const idx=questionIndex(s,'3');
  const max=questionMax(s,'3');
  const delta=Number(s.teaching.pendingRubricDelta)-Number(s.teaching.rubricDelta);
  return unique(s.teaching.rubricUses).filter(id=>person(s,id)&&person(s,id).active&&s.assessment.marks[id]&&!s.teaching.rubricOverrides.includes(id)).map(id=>({
    id,
    before:Number(s.assessment.marks[id][idx]),
    after:Math.max(0,Math.min(max,Number(s.assessment.marks[id][idx])+delta))
  })).filter(x=>x.before!==x.after);
};
const moduleProgress={
  completed:WB.defaults.people.slice(0,32).map(p=>p.id),
  started:WB.defaults.people.slice(32,39).map(p=>p.id)
};

WB.defineState('teaching',{
  coursePublished:true,
  studentPreview:false,
  modules:[
    {id:'m1',title:'Foundations and vectors',published:true,prerequisite:'None',release:'Open now'},
    {id:'m2',title:'Motion in one dimension',published:true,prerequisite:'Complete module 1',release:'Open now'},
    {id:'m3',title:'Projectile motion',published:true,prerequisite:'Complete module 2',release:'12 Oct, 8:00 am'},
    {id:'m4',title:'Forces and free-body diagrams',published:false,prerequisite:'Complete module 3',release:'19 Oct, 8:00 am'}
  ],
  assignmentSection:'All PHYS 110 sections',
  assignmentGroups:'Individual work',
  assignmentSaved:true,
  assignmentSaveRevision:0,
  quizAttempts:'2',
  quizMinutes:'25',
  quizFeedback:'After the due date',
  bankSelected:[],
  quizItems:[{id:'qb-1',type:'Multiple choice',prompt:'At the highest point of a projectile’s flight, what is its vertical acceleration?',points:2}],
  rubricDelta:-1,
  rubricVersion:1,
  pendingRubricDelta:-2,
  rubricUses:['aisha','ben','carmen'],
  rubricOverrides:['carmen'],
  rubricPreviewOpen:false,
  conflictContext:null,
  releasePreview:false,
  releasePreparedIds:[],
  releasePreparedHeld:[],
  releasePreparedScope:'',
  excused:['student-3'],
  assignmentCategoryAverage:86,
  aiDraftStatus:'idle',
  aiDraftFor:'',
  allowances:[],
  copyShiftDays:364,
  copyInclude:['modules','assignments','quizzes'],
  copyPreview:false,
  copyApplied:false,
  copyExceptionResolved:false,
  attendance:[
    {id:'aisha',date:'Wed 14 Oct',status:'Absent',source:'Instructor check-in'},
    {id:'ben',date:'Wed 14 Oct',status:'Present',source:'Instructor check-in'},
    {id:'carmen',date:'Wed 14 Oct',status:'Present',source:'Instructor check-in'}
  ],
  moduleProgress
});

WB.actions['teach-course-publish']=(s)=>{
  s.teaching.coursePublished=!s.teaching.coursePublished;
  WB.audit(s,`${s.teaching.coursePublished?'Published':'Unpublished'} PHYS 110 course`);
  return {message:s.teaching.coursePublished?'Course published to enrolled students.':'Course returned to draft.'};
};
WB.actions['teach-course-preview']=(s)=>{s.teaching.studentPreview=!s.teaching.studentPreview;return {message:s.teaching.studentPreview?'Student preview opened.':'Instructor view restored.'};};
WB.actions['teach-module-move']=(s,p)=>{
  const i=s.teaching.modules.findIndex(m=>m.id===p.id),step=p.direction==='up'?-1:1,j=i+step;
  if(i<0||j<0||j>=s.teaching.modules.length)return {message:'That module is already at the edge.'};
  const next=s.teaching.modules.slice();[next[i],next[j]]=[next[j],next[i]];s.teaching.modules=next;
  return {message:'Module order updated.'};
};
WB.actions['teach-module-toggle']=(s,p)=>{const m=s.teaching.modules.find(x=>x.id===p.id);if(m)m.published=!m.published;return {message:m&&m.published?'Module published.':'Module set to draft.'};};
WB.actions['teach-assignment-save']=(s)=>{s.teaching.assignmentSaved=true;s.teaching.assignmentSaveRevision+=1;return {message:'Assignment changes saved in this example.'};};
WB.actions['teach-assignment-publish']=(s)=>{s.assignment.published=!s.assignment.published;s.teaching.assignmentSaved=true;WB.audit(s,`${s.assignment.published?'Published':'Unpublished'} ${s.assignment.title}`);return {message:s.assignment.published?'Assignment published.':'Assignment returned to draft.'};};
WB.actions['teach-bank-toggle']=(s,p)=>{s.teaching.bankSelected=s.teaching.bankSelected.includes(p.id)?s.teaching.bankSelected.filter(id=>id!==p.id):s.teaching.bankSelected.concat(p.id);return {};};
WB.actions['teach-bank-add']=(s)=>{
  const bank=[
    {id:'qb-2',type:'Numeric response',prompt:'Find the projectile flight time.',points:3},
    {id:'qb-3',type:'Written response',prompt:'Explain why horizontal velocity is constant.',points:4},
    {id:'qb-4',type:'Multiple choice',prompt:'Choose the correct free-body diagram.',points:2}
  ];
  const existing=new Set(s.teaching.quizItems.map(q=>q.id));
  const additions=bank.filter(q=>s.teaching.bankSelected.includes(q.id)&&!existing.has(q.id));
  s.teaching.quizItems=s.teaching.quizItems.concat(additions);s.teaching.bankSelected=[];
  return {message:additions.length?`${additions.length} question${additions.length===1?'':'s'} added.`:'Select a new question first.'};
};
WB.actions['teach-quiz-publish']=(s)=>{s.course.quizPublished=!s.course.quizPublished;return {message:s.course.quizPublished?'Quiz published.':'Quiz returned to draft.'};};
WB.actions['teach-role']=(s,p)=>{s.assessment.role=p.role==='ta'?'ta':'instructor';return {message:s.assessment.role==='ta'?'TA permissions shown.':'Instructor permissions shown.'};};
WB.actions['teach-question']=(s,p)=>{if(s.assessment.conflict)return {message:'Resolve the concurrent edit before changing questions.'};if(s.assignment.questions.some(q=>q.id===p.id))s.assessment.question=p.id;return {};};
WB.actions['teach-student']=(s,p)=>{if(s.assessment.conflict)return {message:'Resolve the concurrent edit before changing students.'};if(person(s,p.id)){s.assessment.student=p.id;s.assessment.aiDraft=false;s.teaching.aiDraftFor='';s.teaching.aiDraftStatus='idle';}return {};};
WB.actions['teach-score']=(s,p)=>{
  if(!canGrade(s))return {message:'This TA no longer has grading access.'};
  if(s.assessment.conflict)return {message:'Resolve the concurrent edit before changing the score.'};
  const id=s.assessment.student,qid=s.assessment.question,idx=questionIndex(s,qid),max=questionMax(s,qid);
  if(!s.assessment.marks[id])s.assessment.marks[id]=fallbackMarks();
  s.assessment.marks[id][idx]=Math.max(0,Math.min(max,Number(p.score)));
  return {message:`Question ${qid} score updated.`};
};
WB.actions['teach-save-next']=(s)=>{
  if(!canGrade(s))return {message:'This TA no longer has grading access.'};
  if(s.assessment.conflict)return {message:'Resolve the concurrent edit before saving or moving to another student.'};
  const id=s.assessment.student;
  if(!s.assessment.marks[id])s.assessment.marks[id]=fallbackMarks();
  s.assessment.graded=unique(s.assessment.graded.concat(id));
  const next=remaining(s)[0];
  if(next)s.assessment.student=next.id;
  return {message:next?`Saved. Next: ${next.name}.`:'Saved. The grading queue is complete.'};
};
WB.actions['teach-conflict-start']=(s)=>{if(!canGrade(s))return {message:'This TA no longer has grading access.'};s.assessment.conflict=true;s.teaching.conflictContext={student:s.assessment.student,question:s.assessment.question};return {message:'A concurrent TA edit is ready to review.'};};
WB.actions['teach-conflict-resolve']=(s,p)=>{
  if(!canGrade(s))return {message:'This TA no longer has grading access.'};
  if(!s.assessment.conflict)return {message:'There is no open conflict.'};
  if(p.choice==='theirs'){
    const context=s.teaching.conflictContext||{student:s.assessment.student,question:s.assessment.question},id=context.student,idx=questionIndex(s,context.question);
    if(!s.assessment.marks[id])s.assessment.marks[id]=fallbackMarks();
    s.assessment.marks[id][idx]=Math.max(0,s.assessment.marks[id][idx]-1);
  }
  s.assessment.conflict=false;s.teaching.conflictContext=null;
  return {message:p.choice==='theirs'?"Kept Maya's recorded score.":'Kept your score and resolved the conflict.'};
};
WB.actions['teach-rubric-preview']=(s)=>{
  if(!isInstructor(s))return {message:'Only the instructor can change rubric rules.'};
  s.teaching.rubricPreviewOpen=true;
  return {go:'S18',message:'Rubric impact preview prepared.'};
};
WB.actions['teach-rubric-delta']=(s,p)=>{if(!isInstructor(s))return {message:'Only the instructor can change rubric rules.'};s.teaching.pendingRubricDelta=Number(p.delta);s.teaching.rubricPreviewOpen=true;return {};};
WB.actions['teach-rubric-cancel']=(s)=>{if(!isInstructor(s))return {message:'Only the instructor can change rubric rules.'};s.teaching.pendingRubricDelta=s.teaching.rubricDelta;s.teaching.rubricPreviewOpen=false;return {go:'S17',message:'Rubric change canceled.'};};
WB.actions['teach-rubric-apply']=(s)=>{
  if(!isInstructor(s))return {message:'Only the instructor can change rubric rules.'};
  if(Number(s.teaching.pendingRubricDelta)===Number(s.teaching.rubricDelta)){s.teaching.rubricPreviewOpen=false;return {go:'S17',message:'The rubric rule is unchanged.'};}
  const impacts=impactRecords(s),idx=questionIndex(s,'3');
  impacts.forEach(x=>{s.assessment.marks[x.id][idx]=x.after;});
  s.teaching.rubricDelta=Number(s.teaching.pendingRubricDelta);s.teaching.rubricVersion+=1;s.assessment.rubricAdjusted=true;s.teaching.rubricPreviewOpen=false;
  WB.audit(s,`Updated Q3 rubric; ${impacts.length} score${impacts.length===1?'':'s'} recalculated`);
  return {go:'S17',message:`Rubric updated. ${impacts.length} score${impacts.length===1?'':'s'} changed; overrides were preserved.`};
};
WB.actions['teach-ai-start']=(s)=>{
  if(!canGrade(s))return {message:'This TA no longer has grading access.'};
  if(!s.institution.aiEnabled)return {message:'Draft help is disabled by institution policy.'};
  s.assessment.aiDraft='Your diagram clearly defines the launch angle. Recheck the vertical acceleration sign before the final substitution.';
  s.teaching.aiDraftStatus='draft';s.teaching.aiDraftFor=s.assessment.student;
  return {message:'Authored sample draft opened. No model or service was called.'};
};
WB.actions['teach-ai-accept']=(s)=>{
  if(!canGrade(s))return {message:'This TA no longer has grading access.'};
  if(!s.institution.aiEnabled||!s.assessment.aiDraft||s.teaching.aiDraftFor!==s.assessment.student)return {message:'There is no enabled draft for this student to accept.'};
  s.assessment.comments[s.assessment.student]=String(s.assessment.aiDraft);s.assessment.aiDraft=false;s.teaching.aiDraftStatus='accepted';
  s.teaching.aiDraftFor='';
  return {message:'Draft copied into feedback for instructor review.'};
};
WB.actions['teach-ai-discard']=(s)=>{if(!canGrade(s))return {message:'This TA no longer has grading access.'};s.assessment.aiDraft=false;s.teaching.aiDraftFor='';s.teaching.aiDraftStatus='discarded';return {message:'Draft discarded.'};};
WB.actions['teach-sort-grades']=(s)=>{s.assessment.sortAsc=!s.assessment.sortAsc;return {};};
WB.actions['teach-release-scope']=(s,p)=>{s.assessment.releaseScope=p.scope==='all-reviewed'?'all-reviewed':'selected';s.teaching.releasePreview=false;s.teaching.releasePreparedIds=[];s.teaching.releasePreparedHeld=[];s.teaching.releasePreparedScope='';return {};};
WB.actions['teach-release-preview']=(s)=>{
  if(!isInstructor(s))return {message:'TAs cannot release grades.'};
  s.teaching.releasePreparedIds=releaseCandidates(s);s.teaching.releasePreparedHeld=heldFromScope(s);s.teaching.releasePreparedScope=s.assessment.releaseScope;s.teaching.releasePreview=true;
  return {message:'Release preview updated from the current grading records.'};
};
WB.actions['teach-release']=(s)=>{
  if(!isInstructor(s))return {message:'TAs cannot release grades.'};
  if(!s.teaching.releasePreview||s.teaching.releasePreparedScope!==s.assessment.releaseScope)return {message:'Preview this release scope before releasing.'};
  const graded=new Set(s.assessment.graded),received=new Set(receivedPeople(s).map(p=>p.id)),eligible=new Set(releaseCandidates(s));
  const safe=s.teaching.releasePreparedIds.filter(id=>graded.has(id)&&received.has(id)&&eligible.has(id));
  safe.forEach(id=>{s.assessment.releaseSnapshots[id]={marks:marksFor(s,id).slice(),comment:commentFor(s,id),attempt:id==='aisha'?s.submission.attempt:1,rubricVersion:s.teaching.rubricVersion};});
  s.assessment.released=unique(s.assessment.released.concat(safe));
  s.teaching.releasePreview=false;s.teaching.releasePreparedIds=[];s.teaching.releasePreparedHeld=[];s.teaching.releasePreparedScope='';
  if(safe.length)WB.audit(s,`Released ${safe.length} ${s.assignment.title} grade${safe.length===1?'':'s'}`);
  return {message:safe.length?`${safe.length} grade${safe.length===1?'':'s'} released from the prepared snapshots; ungraded work stayed held.`:'No graded work was eligible for release.'};
};
WB.actions['teach-ta-toggle']=(s)=>{if(!isInstructor(s))return {message:'Only the instructor can change TA access.'};s.institution.taActive=!s.institution.taActive;WB.audit(s,`${s.institution.taActive?'Restored':'Revoked'} TA course access for Maya Chen`);return {message:s.institution.taActive?'TA access restored.':'TA access revoked for this course.'};};
WB.actions['teach-withdraw']=(s,p)=>{if(!isInstructor(s))return {message:'Only the instructor can change course enrollment.'};const target=person(s,p.id);if(target){target.active=false;WB.audit(s,`Marked ${target.name} withdrawn from PHYS 110`);}return {message:target?`${target.name} is no longer counted in the active roster.`:'Student not found.'};};
WB.actions['teach-allowance']=(s,p)=>{if(!isInstructor(s))return {message:'Only the instructor can record an allowance.'};if(!s.teaching.allowances.includes(p.id))s.teaching.allowances.push(p.id);WB.audit(s,`Recorded a 24-hour assignment allowance for ${person(s,p.id).name}`);return {message:'Allowance recorded without adding private diagnostic information.'};};
WB.actions['teach-allowance-remove']=(s,p)=>{if(!isInstructor(s))return {message:'Only the instructor can remove an allowance.'};s.teaching.allowances=s.teaching.allowances.filter(id=>id!==p.id);return {message:'Allowance removed.'};};
WB.actions['teach-copy-toggle']=(s,p)=>{s.teaching.copyInclude=s.teaching.copyInclude.includes(p.id)?s.teaching.copyInclude.filter(id=>id!==p.id):s.teaching.copyInclude.concat(p.id);s.teaching.copyPreview=false;s.teaching.copyApplied=false;return {};};
WB.actions['teach-copy-preview']=(s)=>{s.teaching.copyPreview=true;s.teaching.copyApplied=false;return {message:'Copy preview recalculated, including date shifts and exceptions.'};};
WB.actions['teach-copy-resolve']=(s)=>{s.teaching.copyExceptionResolved=true;s.teaching.copyApplied=false;return {message:'External tool mapped to a review placeholder.'};};
WB.actions['teach-copy-apply']=(s)=>{
  if(!s.teaching.copyPreview)return {message:'Preview the course copy before applying it.'};
  if(!s.teaching.copyExceptionResolved)return {message:'Resolve the external-tool exception before applying the copy.'};
  s.teaching.copyApplied=true;WB.audit(s,'Applied reviewed PHYS 110 course-copy plan');return {message:'Reviewed copy plan applied to the fictional destination course.'};
};
WB.actions['teach-attendance-correct']=(s,p)=>{const row=s.teaching.attendance.find(x=>x.id===p.id&&x.date===p.date);if(row){row.status='Present';row.source='Corrected by Dr. Diane Reyes';WB.audit(s,`Corrected attendance for ${person(s,p.id).name} on ${p.date}`);}return {message:row?'Attendance corrected with an audit entry.':'Attendance record not found.'};};

WB.reg('S09','Feedback and grade explanation','Student',(s,h)=>{
  const id='aisha',received=s.submission.status==='received',snapshot=snapshotFor(s,id),released=received&&hasCurrentSnapshot(s,id)&&snapshot.attempt===s.submission.attempt;
  const releasedMarks=released?snapshot.marks:[],score=releasedMarks.reduce((sum,value)=>sum+Number(value),0),pct=released?Math.round(score/30*100):0,category=Number(s.teaching.assignmentCategoryAverage),contribution=(category*.4).toFixed(1),newDraft=released&&hasReleaseDraft(s,id);
  const questionRows=s.assignment.questions.map((q,i)=>[h.e(`Question ${q.id}`),released?`${h.e(releasedMarks[i])} / ${h.e(q.max)}`:'—',released&&q.id==='3'?h.pill('Feedback attached','info'):'']);
  return h.head('Feedback and grade explanation',s.assignment.title,h.go('Back to assignment','S05','quiet'))+
    (released?h.notice('Feedback released',`Attempt ${s.submission.attempt} · receipt ${s.submission.receipt}. Your instructor released this result. `,'success'):received?h.notice('Feedback is not released yet','Your submission is safely received. Scores and comments remain hidden until the instructor releases them.','info'):h.notice('Submission is not received','Finish or retry the submission before feedback can be released.','warning'))+
    (newDraft?h.notice('New draft held for review','Your instructor has newer draft changes. The released score and comment below stay unchanged until an explicit re-release.','info'):'')+
    `<div class="columns"><div class="stack">${h.card('Submission record',h.row(`${s.submission.pages.length} pages ${received?'received':'prepared'}`,received?`Receipt ${s.submission.receipt}`:'No receipt yet',h.pill(s.submission.status,received?'success':'warning'))+(released?h.stats([[`${score} / 30`,'Released score'],[`${pct}%`,'Percent']]):''))}${released?h.card('Question scores',h.table('Question scores',['Question','Score','Note'],questionRows)):''}</div><div class="stack">${released?h.card('Instructor feedback',`<p>${h.e(snapshot.comment)}</p><p class="small muted">Released from rubric version ${h.e(snapshot.rubricVersion)} for attempt ${h.e(snapshot.attempt)}.</p>`):h.card('What happens next',received?'<p>Dr. Diane Reyes is reviewing submitted work. You will see the question scores, rubric notes, and comment here after release.</p>':'<p>Return to the assignment submission steps. A receipt confirms when the attempt is received.</p>')}${h.card('How the course total is calculated',released?`<p>This assignment is ${pct}% (${score} of 30). Your current assignment-category average is ${category}%. Assignments carry 40% of the course total, so that category currently contributes ${contribution} of 40 course points.</p><details><summary>Other category weights</summary><p class="small">Labs 25% · Quizzes 35%. Excused work is removed from the applicable category denominator.</p></details>`:'<p>The gradebook combines assignments at 40%, labs at 25%, and quizzes at 35%. Your category calculations will appear with the released score.</p>')}</div></div>`;
});

WB.reg('S14','Course builder','Instructor',(s,h)=>{
  const visibleModules=s.teaching.studentPreview?s.teaching.modules.filter(m=>m.published):s.teaching.modules;
  const modules=visibleModules.map((m,i)=>h.row(`${i+1}. ${m.title}`,`${m.prerequisite} · ${m.release}`,s.teaching.studentPreview?h.pill('Visible to student','success'):`${h.pill(m.published?'Published':'Draft',m.published?'success':'neutral')} ${i?h.btn('Move up','teach-module-move',{id:m.id,direction:'up'},'quiet'):'<button type="button" class="button quiet" disabled>First module</button>'} ${h.btn(m.published?'Unpublish':'Publish','teach-module-toggle',{id:m.id},'quiet')}`)).join('');
  const preview=s.teaching.studentPreview?h.notice('Student preview','Only published modules and released items are visible in this preview.','info'):'';
  return teacherTabs(h,'S14')+h.head('Build PHYS 110','Syllabus, modules, prerequisites, release rules and publication',`${h.btn(s.teaching.studentPreview?'Exit preview':'Student preview','teach-course-preview',{},'secondary')} ${h.btn(s.teaching.coursePublished?'Unpublish course':'Publish course','teach-course-publish',{},s.teaching.coursePublished?'secondary':'primary')}`)+preview+
    `<div class="columns"><div class="stack">${h.card('Course publication',h.row('PHYS 110 · Introductory Mechanics','Dr. Diane Reyes · Fall 2026',h.pill(s.teaching.coursePublished?'Published':'Draft',s.teaching.coursePublished?'success':'warning')))}${h.card('Modules',modules)}</div><div class="stack">${h.card('Syllabus',`<p><strong>Mechanics through observation, modeling, and clear written reasoning.</strong></p><p class="muted">Meets Mon/Wed/Fri, 9:00–9:50 am · Hollis Hall 104</p>${h.go('Edit current assignment','S15','primary')}`)}${h.card('Release logic','<p>Modules open in order after the prior module is complete. Scheduled dates use America/New_York.</p><details><summary>Less-used settings</summary><p class="small">Allow completion overrides · require syllabus acknowledgment · retain instructor-only notes during preview.</p></details>')}</div></div>`;
});

WB.reg('S15','Assignment editor','Instructor',(s,h)=>{
  const total=s.assignment.questions.reduce((sum,q)=>sum+Number(q.max),0);
  return teacherTabs(h,'S15')+h.head('Edit assignment',s.assignment.title,`${h.btn('Save changes','teach-assignment-save',{},'secondary')} ${h.btn(s.assignment.published?'Unpublish':'Publish','teach-assignment-publish',{},s.assignment.published?'secondary':'primary')}`)+
    h.notice(s.assignment.published?'Published to students':'Draft assignment',s.assignment.published?'Changes affect the same assignment students submit and instructors grade.':'Students cannot open this assignment until it is published.',s.assignment.published?'success':'warning')+
    `<div class="columns"><div class="stack">${h.card('Details',`<div class="form-grid">${h.field('Title','assignment.title',s.assignment.title)}${h.select('Assigned to','teaching.assignmentSection',s.teaching.assignmentSection,['All PHYS 110 sections','Section 01','Section 02'])}${h.field('Due','assignment.due',s.assignment.due,'datetime-local')}${h.field('Closes','assignment.close',s.assignment.close,'datetime-local')}${h.select('Work mode','teaching.assignmentGroups',s.teaching.assignmentGroups,['Individual work','Assigned groups'])}</div>${s.teaching.assignmentSaveRevision?`<p class="small muted">Example revision ${s.teaching.assignmentSaveRevision} saved.</p>`:''}`)}${h.card('Questions and points',s.assignment.questions.map(q=>h.row(`Question ${q.id}`,'Written work upload',`${q.max} points`)).join('')+h.row('Total','Derived from question maxima',`${total} points`))}</div><div class="stack">${h.card('Files and rubric',`${h.row('Problem Set 4 instructions.pdf','240 KB · accessible source document',h.pill('Attached','success'))}${h.row('Kinematics rubric','5 question groups · 30 points',h.go('Open grading rubric','S17','quiet'))}`)}${h.card('Accommodations summary','<p>Approved timing and due-date adjustments are summarized for permitted course staff; private documentation is not shown.</p>')}${h.card('Assessment AI-use policy',`<p>Prohibited during this assessment. Show your own reasoning.</p>`)}</div></div>`;
});

WB.reg('S16','Quiz builder','Instructor',(s,h)=>{
  const bank=[
    {id:'qb-2',type:'Numeric response',prompt:'Find the projectile flight time.',points:3},
    {id:'qb-3',type:'Written response',prompt:'Explain why horizontal velocity is constant.',points:4},
    {id:'qb-4',type:'Multiple choice',prompt:'Choose the correct free-body diagram.',points:2}
  ];
  const bankRows=bank.map(q=>h.row(q.prompt,`${q.type} · ${q.points} points`,toggleButton(h,s.teaching.bankSelected.includes(q.id)?'Selected':'Select','teach-bank-toggle',{id:q.id},s.teaching.bankSelected.includes(q.id)))).join('');
  return teacherTabs(h,'S16')+h.head('Quiz builder','Motion check: projectile reasoning',`${h.btn('Add selected','teach-bank-add',{},'secondary')} ${h.btn(s.course.quizPublished?'Unpublish quiz':'Publish quiz','teach-quiz-publish',{},s.course.quizPublished?'secondary':'primary')}`)+
    `<div class="columns"><div class="stack">${h.card('Quiz questions',s.teaching.quizItems.map((q,i)=>h.row(`${i+1}. ${q.prompt}`,q.type,`${q.points} points`)).join(''))}${h.card('Question bank',bankRows)}</div><div class="stack">${h.card('Attempt settings',`<div class="form-grid">${h.select('Attempts','teaching.quizAttempts',s.teaching.quizAttempts,['1','2','3','Unlimited'])}${h.field('Time limit (minutes)','teaching.quizMinutes',s.teaching.quizMinutes,'number')}${h.select('Release feedback','teaching.quizFeedback',s.teaching.quizFeedback,['After each attempt','After the due date','Instructor release'])}</div>`)}${h.card('Accommodations','<p>Approved extra time is applied per student when an attempt starts. The general limit stays visible here; private documentation is not included.</p>')}${h.card('Quiz AI-use policy',`<p>Prohibited during this assessment. Show your own reasoning.</p>`)}</div></div>`;
});

WB.reg('S17','Grading workspace','Instructor / TA',(s,h)=>{
  const selected=person(s,s.assessment.student)||s.people[0],qid=s.assessment.question,idx=questionIndex(s,qid),max=questionMax(s,qid),mark=marksFor(s,selected.id)[idx],left=remaining(s).length,page=pageForQuestion(s,qid),allowed=canGrade(s);
  const qButtons=s.assignment.questions.map(q=>toggleButton(h,q.id,'teach-question',{id:q.id},q.id===qid)).join('');
  const queue=remaining(s).slice(0,4).map(p=>h.btn(p.name,'teach-student',{id:p.id},p.id===selected.id?'primary':'quiet')).join('')||'<p class="empty">All received work has been graded.</p>';
  const conflict=s.assessment.conflict?h.notice('Concurrent edit to resolve','Maya Chen (TA) saved a different score for this answer. Saving and navigation stay blocked until this is resolved.','warning')+(allowed?`<div class="actions">${h.btn("Keep Maya's score",'teach-conflict-resolve',{choice:'theirs'},'secondary')}${h.btn('Keep my score','teach-conflict-resolve',{choice:'mine'},'primary')}</div>`:'<p class="small">An instructor must resolve this conflict because TA access is revoked.</p>'):'';
  const ai=!allowed?h.notice('Draft help unavailable','Active grading access is required to create or accept feedback drafts.','error'):!s.institution.aiEnabled?h.notice('Draft help is off','Institution policy has not enabled optional draft feedback. Grading and comments remain available.','neutral'):(s.assessment.aiDraft&&s.teaching.aiDraftFor===selected.id?`${h.area('Authored sample draft','assessment.aiDraft',s.assessment.aiDraft)}<div class="actions">${h.btn('Accept into comment','teach-ai-accept',{},'primary')}${h.btn('Discard','teach-ai-discard',{},'quiet')}</div><p class="small muted">This is prewritten sample text; no model or external service was called.</p>`:`${h.btn('Open authored sample draft','teach-ai-start',{},'secondary')}<p class="small muted">A draft can be edited, accepted, or discarded. It cannot change scores or release work.</p>`);
  const work=page?h.paper(qid,page.rotation):`${h.notice(`No page tagged for question ${qid}`,'The score and comment are preserved. Tag a page before evaluating the written work.','warning')}${h.go('Organize submission pages','S07','secondary')}`;
  const scoreControls=allowed?`${h.row('Full credit','Complete and correct',h.btn(`${max} points`,'teach-score',{score:max},mark===max?'primary':'quiet'))}${h.row('Minor reasoning error','Method is sound; one fix needed',h.btn(`${Math.max(0,max-1)} points`,'teach-score',{score:Math.max(0,max-1)},mark===max-1?'primary':'quiet'))}${h.row('Sign or setup error','Core method present',h.btn(`${Math.max(0,max-2)} points`,'teach-score',{score:Math.max(0,max-2)},mark===max-2?'primary':'quiet'))}`:h.notice('Read-only grading view','TA access has been revoked. Scores cannot be changed.','error');
  const commentEditor=allowed?`${h.area('Feedback for this answer',`assessment.comments.${selected.id}`,commentFor(s,selected.id))}<div class="actions">${s.assessment.conflict?'<button type="button" class="button primary" disabled>Resolve conflict before saving</button>':h.btn('Save and next','teach-save-next',{},'primary')}${s.assessment.conflict?'<button type="button" class="button quiet" disabled>Concurrent edit open</button>':h.btn('Simulate concurrent edit','teach-conflict-start',{},'quiet')}</div>`:`<p>${h.e(commentFor(s,selected.id))}</p><button type="button" class="button secondary" disabled>Comment editing unavailable</button>`;
  return h.head('Grade by question',`${s.assignment.title} · ${left} remaining`,`${toggleButton(h,'Instructor','teach-role',{role:'instructor'},s.assessment.role==='instructor')} ${toggleButton(h,'TA','teach-role',{role:'ta'},s.assessment.role==='ta')} ${h.go('Release','S20','secondary')}`)+roleNotice(s,h)+conflict+
    (hasReleaseDraft(s,selected.id)?h.notice('New draft after release','These score, comment, or rubric changes remain held until the instructor explicitly re-releases this student.','info'):'')+
    `<div class="actions" aria-label="Questions">${qButtons}</div><div class="columns wide-left"><div class="stack">${h.card(`${selected.name} · Question ${qid}`,work)}${h.card('Queue',queue)}</div><div class="stack">${h.card(`Score · ${mark} / ${max}`,`${scoreControls}<div class="actions">${isInstructor(s)?h.btn('Preview rubric rule change','teach-rubric-preview',{},'secondary'):'<button type="button" class="button secondary" disabled>Rubric editing is instructor-only</button>'}</div>`)}${h.card('Comment',commentEditor)}${h.card('Optional draft help',ai)}</div></div>`;
});

WB.reg('S18','Rubric-change preview','Instructor',(s,h)=>{
  const impacts=impactRecords(s),uses=unique(s.teaching.rubricUses).filter(id=>person(s,id)&&person(s,id).active),overrides=uses.filter(id=>s.teaching.rubricOverrides.includes(id));
  const rows=uses.map(id=>{const p=person(s,id),impact=impacts.find(x=>x.id===id),override=s.teaching.rubricOverrides.includes(id);return [h.e(p?p.name:id),override?h.pill('Manual override preserved','info'):h.pill('Recalculate','warning'),impact?`${impact.before} → ${impact.after}`:`${marksFor(s,id)[questionIndex(s,'3')]} unchanged`];});
  return h.head('Preview rubric change','Question 3 · Sign convention error',h.go('Back to grader','S17','quiet'))+roleNotice(s,h)+
    `<div class="columns"><div class="stack">${h.card('Rule change',`${h.row('Current rule','Sign convention error',`${s.teaching.rubricDelta} point`)}${h.row('Proposed rule','Sign convention error',`${s.teaching.pendingRubricDelta} points`)}<div class="actions">${h.btn('Set to −1','teach-rubric-delta',{delta:-1},s.teaching.pendingRubricDelta===-1?'primary':'quiet')}${h.btn('Set to −2','teach-rubric-delta',{delta:-2},s.teaching.pendingRubricDelta===-2?'primary':'quiet')}</div>`)}${h.notice(`${impacts.length} answer${impacts.length===1?' changes':'s change'}`,`${overrides.length} manual override${overrides.length===1?' is':'s are'} preserved. The count is derived from answers using this rubric item.`,impacts.length?'warning':'info')}</div><div class="stack">${h.card('Affected answers',h.table('Rubric impact preview',['Student','Treatment','Q3 score'],rows))}${h.card('Decision',isInstructor(s)?`<div class="actions">${h.btn('Cancel','teach-rubric-cancel',{},'quiet')}${h.btn('Apply rubric change','teach-rubric-apply',{},'primary')}</div>`:'<p>Ask Dr. Diane Reyes to review and apply this rubric change.</p>')}</div></div>`;
});

WB.reg('S19','Gradebook','Instructor',(s,h)=>{
  const ids=['aisha','ben','carmen','student-3','student-40'].filter(id=>person(s,id));
  ids.sort((a,b)=>{const av=person(s,a).name,bv=person(s,b).name;return s.assessment.sortAsc?av.localeCompare(bv):bv.localeCompare(av);});
  const rows=ids.map(id=>{const status=gradeStatus(s,id),score=(status==='Excused'||status==='Missing'||status==='Ungraded')?'—':`${WB.score(s,id)} / 30`,tone=status==='Released'?'success':status==='Ungraded'||status==='New draft after release'?'warning':'neutral';return [h.e(person(s,id).name),h.pill(status,tone),score,status==='Excused'?'Removed from denominator':status==='Missing'?'Counts as missing after close':status==='New draft after release'?'Held until explicit re-release':'Included when released'];});
  const activeIds=new Set(s.people.filter(p=>p.active).map(p=>p.id));
  const reviewed=s.assessment.graded.filter(id=>activeIds.has(id)).length,released=s.assessment.released.filter(id=>activeIds.has(id)).length;
  return h.head('Gradebook',s.assignment.title,`${h.btn(s.assessment.sortAsc?'Sort Z–A':'Sort A–Z','teach-sort-grades',{},'quiet')} ${h.go('Release records','S20','primary')}`)+
    h.stats([[`${WB.received(s)}`,'Received'],[`${reviewed}`,'Reviewed'],[`${released}`,'Released']])+
    `<div class="stack">${h.card('Student results',h.table('Problem Set 4 gradebook',[`<span>Student</span>`,'Status','Score','Calculation'],rows))}${h.card('Category calculation',`<p><strong>Assignments 40% · Labs 25% · Quizzes 35%</strong></p><p>A student’s assignment category average is multiplied by 0.40. Missing work enters the denominator after the close date; ungraded work does not. Excused work is removed from that category denominator.</p>`)}</div>`;
});

WB.reg('S20','Release and records','Instructor',(s,h)=>{
  const candidates=releaseCandidates(s),held=heldFromScope(s),prepared=s.teaching.releasePreparedIds;
  const activeIds=new Set(s.people.filter(p=>p.active).map(p=>p.id)),releasedCount=s.assessment.released.filter(id=>activeIds.has(id)&&hasCurrentSnapshot(s,id)).length,draftCount=s.assessment.released.filter(id=>activeIds.has(id)&&hasReleaseDraft(s,id)).length;
  const scopeButtons=`<div class="segmented" role="group" aria-label="Release scope">${toggleButton(h,'Selected student','teach-release-scope',{scope:'selected'},s.assessment.releaseScope==='selected')}${toggleButton(h,'All reviewed','teach-release-scope',{scope:'all-reviewed'},s.assessment.releaseScope==='all-reviewed')}</div>`;
  const selected=person(s,s.assessment.student);
  const preview=s.teaching.releasePreview?h.card('Prepared release',`${h.stats([[prepared.length,'Eligible grades'],[s.teaching.releasePreparedHeld.length,'Held ungraded']])}<p>${prepared.length?prepared.map(id=>h.e(person(s,id).name)).join(', '):'No graded work is eligible in this scope.'}</p>${s.teaching.releasePreparedHeld.length?`<p class="small muted">Held: ${s.teaching.releasePreparedHeld.map(id=>h.e(person(s,id).name)).join(', ')}</p>`:''}`):'';
  return h.head('Release grades',s.assignment.title,h.go('View gradebook','S19','quiet'))+roleNotice(s,h)+
    `<div class="columns"><div class="stack">${h.card('1. Choose exact scope',`${scopeButtons}<p>${s.assessment.releaseScope==='selected'?`Selected: ${h.e(selected?selected.name:'No student')}${selected&&hasReleaseDraft(s,selected.id)?` · ${h.pill('New draft after release','warning')}`:''}`:`${candidates.length} reviewed grade${candidates.length===1?' is':'s are'} eligible for first release or re-release.`}</p>`)}${h.card('2. Check held work',held.length?h.notice(`${held.length} ungraded submission${held.length===1?'':'s'} will stay held`,'Ungraded work is never converted to zero or released by this action.','warning'):h.notice('No ungraded work in this scope','Only reviewed records can enter the release.','success'))}</div><div class="stack">${preview}${h.card('3. Preview and release',isInstructor(s)?`<div class="actions">${h.btn('Refresh preview','teach-release-preview',{},'secondary')}${h.btn('Release prepared grades','teach-release',{},'primary')}</div><p class="small muted">The release button snapshots the prepared score, comment, attempt, and rubric version after rechecking eligibility.</p>`:'<p>TAs can prepare scores and comments, but only the instructor can release them.</p>')}${h.card('Release record',releasedCount?`<p>${releasedCount} feedback record${releasedCount===1?' is':'s are'} visible to active students.</p>${draftCount?`<p>${h.pill(`${draftCount} new draft${draftCount===1?'':'s'} held`,'warning')}</p>`:''}${h.go('Open student feedback','S09','secondary')}`:'<p>No feedback has been released for this assignment.</p>')}</div></div>`;
});

WB.reg('S21','People and course permissions','Instructor',(s,h)=>{
  const willa=person(s,'student-22');
  const instructor=isInstructor(s),permissionButton=instructor?h.btn(s.institution.taActive?'Revoke':'Restore','teach-ta-toggle',{},s.institution.taActive?'danger':'secondary'):'<button type="button" class="button secondary" disabled>Instructor approval required</button>';
  const rows=[
    ['Dr. Diane Reyes','Instructor',h.pill('Full course scope','success'),'—'],
    ['Maya Chen','Teaching assistant',h.pill(s.institution.taActive?'Active':'Revoked',s.institution.taActive?'success':'error'),permissionButton],
    ['Aisha Rahman','Student',h.pill('Active','success'),instructor?(s.teaching.allowances.includes('aisha')?h.btn('Remove allowance','teach-allowance-remove',{id:'aisha'},'quiet'):h.btn('Add allowance','teach-allowance',{id:'aisha'},'quiet')):'Instructor approval required'],
    [willa?willa.name:'Willa Brooks','Student',h.pill(willa&&willa.active?'Active':'Withdrawn',willa&&willa.active?'success':'neutral'),willa&&willa.active?(instructor?h.btn('Mark withdrawn','teach-withdraw',{id:willa.id},'danger'):'Instructor approval required'):'Removed from counts']
  ];
  return teacherTabs(h,'S21')+h.head('People and permissions','PHYS 110 · role scope and operational allowances')+
    roleNotice(s,h)+`<div class="stack">${h.card('Course people',h.table('Course people',['Person','Course role','Status','Action'],rows))}<div class="columns">${h.card('TA permission boundary','<ul><li>May grade assigned submissions and write comments while access is active.</li><li>Cannot edit rubric rules.</li><li>Cannot release grades or change course roles.</li></ul>')} ${h.card('Operational allowance',`<details><summary>Record a due-date allowance</summary><p>Add 24 hours for Aisha on Problem Set 4. The course workspace records the operational change without storing a diagnosis.</p>${!instructor?'<p class="small">Instructor approval is required.</p>':s.teaching.allowances.includes('aisha')?h.notice('24-hour allowance active','Applies to Problem Set 4 only.','success'):h.btn('Record 24-hour allowance','teach-allowance',{id:'aisha'},'primary')}</details>`)}</div></div>`;
});

WB.reg('S22','Course copy and rollover','Instructor',(s,h)=>{
  const destinationDue=copyDate('2025-10-17T23:59',s.teaching.copyShiftDays);
  const choices=[['modules','Modules and files'],['assignments','Assignments and rubrics'],['quizzes','Quizzes and question links']];
  const optionRows=choices.map(([id,label])=>h.row(label,s.teaching.copyInclude.includes(id)?'Included in preview':'Excluded',h.btn(s.teaching.copyInclude.includes(id)?'Included':'Include','teach-copy-toggle',{id},s.teaching.copyInclude.includes(id)?'primary':'quiet'))).join('');
  const exception=s.teaching.copyExceptionResolved?h.notice('External tool mapped','The lab simulator becomes an unpublished review placeholder in the destination course.','success'):h.notice('External tool needs review','The source lab simulator has no verified destination connection. Map it before applying the copy.','warning');
  return teacherTabs(h,'S22')+h.head('Copy a course','PHYS 110 Fall 2025 → PHYS 110 Fall 2026')+
    `<div class="columns"><div class="stack">${h.card('Content selection',optionRows)}${h.card('Date shift',`<div class="form-grid">${h.field('Shift dates by days','teaching.copyShiftDays',s.teaching.copyShiftDays,'number')}</div><p class="small">Source due date: Oct 17, 2025 · 11:59 pm ET<br>Preview: ${h.e(prettyDate(destinationDue))}</p>${h.btn('Preview copy','teach-copy-preview',{},'primary')}`)}</div><div class="stack">${s.teaching.copyPreview?h.card('Review before apply',`${h.stats([[s.teaching.copyInclude.length,'Content groups'],['1','Exception']])}${h.row(s.assignment.title,'Date-shift preview',prettyDate(destinationDue))}${exception}<div class="actions">${s.teaching.copyExceptionResolved?'':h.btn('Map to review placeholder','teach-copy-resolve',{},'secondary')}${s.teaching.copyApplied?'<button type="button" class="button primary" disabled>Copy applied</button>':h.btn('Apply reviewed copy','teach-copy-apply',{},'primary')}</div>`):h.card('Preview required','<p>Choose content and preview every shifted date and exception before applying the copy.</p>')}${s.teaching.copyApplied?h.notice('Copy plan applied','The fictional destination course now has the reviewed selections; the external tool remains unpublished.','success'):''}</div></div>`;
});

WB.reg('S23','Course insights and attendance','Instructor',(s,h)=>{
  const active=s.people.filter(p=>p.active),received=WB.received(s),missing=active.filter(p=>p.id==='aisha'?s.submission.status!=='received':!p.submitted);
  const activeIds=new Set(active.map(p=>p.id));
  const completed=s.teaching.moduleProgress.completed.filter(id=>activeIds.has(id)).length,started=s.teaching.moduleProgress.started.filter(id=>activeIds.has(id)).length,notStarted=Math.max(0,active.length-completed-started);
  const rows=s.teaching.attendance.map(a=>[h.e(person(s,a.id).name),h.e(a.date),h.pill(a.status,a.status==='Present'?'success':'warning'),h.e(a.source),a.status==='Absent'?h.btn('Correct to present','teach-attendance-correct',{id:a.id,date:a.date},'secondary'):'—']);
  const reviewed=s.assessment.graded.filter(id=>activeIds.has(id)).length;
  return teacherTabs(h,'S23')+h.head('Course insights','Concrete work and attendance signals; no predictive risk score')+
    h.stats([[`${received} / ${active.length}`,'Problem Set 4 received'],[`${reviewed}`,'Reviews complete'],[`${missing.length}`,'Missing submissions']])+
    `<div class="columns"><div class="stack">${h.card('Missed-work signal',missing.length?`${h.notice(`${missing.length} active student${missing.length===1?' has':'s have'} not submitted`,`${s.assignment.title} closes ${prettyDate(s.assignment.close)}. This is a factual work-status signal, not a prediction.`,'warning')}<details><summary>Show students</summary><p>${missing.map(p=>h.e(p.name)).join(', ')}</p></details>`:h.notice('All active students submitted','No missed-work follow-up is needed.','success'))}${h.card('Module completion',`<p><strong>Module 3: Projectile motion</strong></p><p>${completed} of ${active.length} active students completed all required items; ${started} started; ${notStarted} have not started.</p>`)}</div><div class="stack">${h.card('Attendance correction',h.table('Recent attendance',['Student','Meeting','Status','Source','Action'],rows))}${h.card('Interpretation','<p>Completion, submission, and attendance remain separate records. Staff can correct source errors; this workspace does not combine them into a hidden risk score.</p>')}</div></div>`;
});

})();
