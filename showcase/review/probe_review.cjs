// Historical baseline evidence: executes preserved v2 modules, never the revised application.
const fs=require('fs'),vm=require('vm'),path=require('path');
const base=path.resolve(__dirname,'..'),c={window:{}};vm.createContext(c);
const archive=fs.readFileSync(path.join(base,'archive/showcase_v2_2026-10-15.html'),'utf8');
const script=archive.match(/<script>([\s\S]*)<\/script>/)[1];
const controllerStart=script.lastIndexOf("(function(){\n'use strict';\nconst WB=window.WB,one=");
if(controllerStart<0)throw Error('Archived baseline controller boundary not found');
vm.runInContext(script.slice(0,controllerStart),c);
const W=c.window.WB,results=[];
W.reset();W.state.assessment.graded.push('aisha');W.dispatch('teach-release-preview');const previewScore=W.score(W.state);W.dispatch('teach-score',{score:0});W.state.assessment.comments.aisha='Edited after preview';W.dispatch('teach-release');results.push({id:'REV-03',previewScore,releasedScore:W.state.assessment.releaseSnapshots.aisha.marks.reduce((a,b)=>a+b,0),releasedComment:W.state.assessment.releaseSnapshots.aisha.comment});
W.reset();const originalModule=W.render('S04');W.dispatch('teach-module-toggle',{id:'m3'});results.push({id:'REV-08',modulePublished:W.state.teaching.modules.find(m=>m.id==='m3').published,studentViewUnchanged:originalModule===W.render('S04')});
W.reset();W.state.assessment.student='student-3';W.dispatch('teach-release-preview');W.dispatch('teach-release');results.push({id:'REV-04',excused:W.state.teaching.excused.includes('student-3'),released:W.state.assessment.released.includes('student-3'),snapshot:W.state.assessment.releaseSnapshots['student-3']});
W.reset();const q3=W.state.submission.pages.find(p=>p.tag==='3');q3.rotation=90;W.dispatch('teach-student',{id:'ben'});const ben=W.render('S17');results.push({id:'REV-02',selectedLearner:W.state.assessment.student,usesAishasRotatedPage:ben.includes('rotate(90deg)')});
W.reset();W.state.assessment.comments.aisha='Only question three';W.dispatch('teach-question',{id:'1a'});results.push({id:'REV-35',question:W.state.assessment.question,otherQuestionShowsSameFeedback:W.render('S17').includes('Only question three')});
W.reset();results.push({id:'REV-36',canonicalPolicy:W.state.assignment.policy,instructorDisplaysProhibited:W.render('S15').includes('Prohibited during this assessment')});
W.reset();const calBefore=W.render('S12');W.dispatch('campus-rsvp');results.push({id:'REV-38',rsvp:W.state.campus.rsvp,calendarUnchanged:calBefore===W.render('S12')});
W.reset();W.dispatch('campus-create-referral');W.state.campus.referralData.note='Correct the date to October 13';W.dispatch('campus-correct-referral');results.push({id:'REV-21',entered:'Correct the date to October 13',stored:W.state.campus.referralData.note});
process.stdout.write(JSON.stringify({date:'2026-10-15',method:'Node VM, no browser, synthetic local records; findings reproduce existing defects',results},null,2)+'\n');
