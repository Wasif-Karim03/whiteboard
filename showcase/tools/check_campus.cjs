const fs=require('fs');
const vm=require('vm');
const path=require('path');

const root=path.resolve(__dirname,'..');
const context={window:{},console};
vm.createContext(context);
for(const file of ['src/core.js','src/campus.js']){
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
}
const WB=context.window.WB;
const ids=Array.from({length:13},(_,i)=>`S${i+24}`);
const assert=(condition,message)=>{if(!condition)throw new Error(message);};

assert(ids.every(id=>WB.renderers[id]),'S24–S36 must all be registered');
assert(Object.keys(WB.actions).filter(name=>name!=='set').every(name=>name.startsWith('campus-')),'Campus action names must be prefixed');

for(const id of ids){
  const before=JSON.stringify(WB.state);
  const html=WB.render(id);
  assert(typeof html==='string'&&html.length>500,`${id} should render substantive HTML`);
  assert(JSON.stringify(WB.state)===before,`${id} renderer mutated state`);
}
const initialTimetable=WB.render('S24');
assert(initialTimetable.includes('44 / 72')&&initialTimetable.includes('<b>99</b>'),'timetable counts should derive PHYS enrollment from active people');

WB.reset();
WB.dispatch('campus-select-proposal',{choice:'small-room'});
WB.dispatch('campus-submit-schedule');
assert(WB.state.campus.proposal.status==='needs revision','capacity conflict should block schedule submission');
WB.dispatch('campus-select-proposal',{choice:'available'});
WB.dispatch('campus-submit-schedule');
WB.dispatch('campus-approve-schedule');
assert(WB.state.campus.proposal.sourceStatus==='queued'&&!WB.state.campus.scheduleApplied,'approval must not imply source application');
const applied=WB.dispatch('campus-apply-schedule');
assert(WB.state.campus.scheduleApplied&&WB.state.campus.proposal.sourceStatus==='applied'&&applied.go==='S12','schedule application should update the calendar-facing state');
assert(WB.state.campus.meeting.time==='10:00'&&WB.state.campus.meeting.room==='Hollis Hall 104','applied proposal should update the canonical meeting');
WB.dispatch('campus-select-proposal',{choice:'small-room'});
assert(WB.state.campus.scheduleApplied&&WB.state.campus.meeting.time==='10:00','a new proposal must not erase the previously applied meeting');
assert(WB.render('S24').includes('10:00–10:50'),'timetable should render the canonical applied meeting');

WB.reset();
WB.state.campus.roomSearch.time='15:30';
WB.dispatch('campus-request-room',{room:'hollis-104'});
assert(WB.state.campus.roomStatus==='confirmed'&&WB.state.campus.roomSearch.attempt==='blocked','3:30 conflict should preserve the confirmed booking');
WB.state.campus.roomSearch.time='17:30';
WB.state.campus.roomSearch.capacity=73;
WB.dispatch('campus-request-room',{room:'hollis-104'});
assert(WB.state.campus.roomStatus==='confirmed'&&WB.state.campus.roomSearch.attempt==='blocked','room capacity should be validated before request creation');
WB.state.campus.roomSearch.capacity=64;
WB.state.campus.roomSearch.date='Wednesday, 4 November 2026';
WB.state.campus.roomSearch.recurrence='One time';
WB.dispatch('campus-request-room',{room:'hollis-104'});
assert(WB.state.campus.roomStatus==='requested'&&WB.state.campus.roomRequest.confirmation==='not requested','request should remain unconfirmed');
assert(WB.state.campus.roomRequest.capacity===64&&WB.state.campus.roomRequest.date==='Wednesday, 4 November 2026'&&WB.state.campus.roomRequest.recurrence==='One time','reservation should capture actual search criteria');
WB.dispatch('campus-approve-room');
assert(WB.state.campus.roomStatus==='approved'&&WB.state.campus.roomRequest.confirmation==='pending','approval should remain distinct from confirmation');
WB.dispatch('campus-confirm-room');
assert(WB.state.campus.roomStatus==='confirmed','facilities acknowledgment should confirm the room');
WB.dispatch('campus-toggle-occurrence');
assert(WB.state.campus.roomRequest.occurrence==='cancelled'&&WB.state.campus.roomStatus==='confirmed','occurrence cancellation should preserve the series');

WB.reset();
const publishedBefore=JSON.stringify(WB.state.campus.event);
WB.dispatch('campus-start-event-revision');
assert(WB.state.campus.eventPublished&&JSON.stringify(WB.state.campus.event)===publishedBefore&&WB.state.campus.roomStatus==='confirmed'&&WB.state.campus.draftRoomStatus==='draft'&&WB.state.campus.fundingStatus==='draft','event revision should reopen draft dependencies without changing published event authority');
WB.state.campus.eventDraft.title='Physics After Dark: Revised program';
WB.state.campus.eventDraft.capacity=61;
WB.dispatch('campus-save-event');
assert(WB.state.campus.event.title!=='Physics After Dark: Revised program'&&WB.state.campus.event.capacity===60,'draft edits must not leak into published event data');
WB.dispatch('campus-publish-event');
assert(WB.state.campus.event.title!=='Physics After Dark: Revised program'&&WB.state.campus.draft.revisionOpen,'blocked revision must remain unpublished');
WB.state.campus.roomSearch.time='15:30';
WB.dispatch('campus-request-room',{room:'hollis-104'});
assert(WB.state.campus.draftRoomStatus==='draft'&&WB.state.campus.roomStatus==='confirmed','room finder conflict should block the revision without changing published authority');
WB.state.campus.roomSearch.time='17:30';
WB.state.campus.roomSearch.capacity=61;
WB.dispatch('campus-request-room',{room:'hollis-104'});
assert(WB.state.campus.roomRequest.capacity===61&&WB.state.campus.draftRoomStatus==='requested'&&WB.state.campus.roomStatus==='confirmed','event room request should use draft capacity without changing the published room status');
WB.dispatch('campus-approve-room');
WB.dispatch('campus-confirm-room');
WB.state.campus.eventDraft.capacity=62;
WB.dispatch('campus-save-event');
assert(WB.state.campus.draftRoomStatus==='draft'&&WB.state.campus.roomStatus==='confirmed','editing confirmed room requirements should invalidate only draft confirmation');
WB.state.campus.eventDraft.capacity=61;
WB.dispatch('campus-request-room',{room:'hollis-104',source:'event-draft'});
WB.dispatch('campus-approve-room');
WB.dispatch('campus-confirm-room');
WB.dispatch('campus-request-funding');
WB.dispatch('campus-approve-funding');
WB.dispatch('campus-approve-event');
WB.dispatch('campus-publish-event');
assert(WB.state.campus.eventPublished&&!WB.state.campus.draft.revisionOpen&&WB.state.campus.event.title==='Physics After Dark: Revised program'&&WB.state.campus.event.capacity===61,'completed dependencies should publish the approved draft atomically');

WB.reset();
WB.dispatch('campus-fill-event');
WB.dispatch('campus-rsvp');
assert(WB.state.campus.rsvp==='waitlisted','full event should create a waitlist status');
WB.dispatch('campus-release-seat');
assert(WB.state.campus.rsvp==='confirmed'&&WB.state.campus.event.rsvps===WB.state.campus.event.capacity,'released seat should promote the waiting student');

WB.reset();
const startingTotal=WB.state.campus.checkin.syncedIds.length+WB.state.campus.checkin.offlineIds.length;
WB.dispatch('campus-checkin',{person:'aisha'});
const afterEntry=WB.state.campus.checkin.syncedIds.length+WB.state.campus.checkin.offlineIds.length;
WB.dispatch('campus-checkin',{person:'aisha'});
const afterDuplicate=WB.state.campus.checkin.syncedIds.length+WB.state.campus.checkin.offlineIds.length;
assert(afterEntry===startingTotal+1&&afterDuplicate===afterEntry&&WB.state.campus.checkin.duplicateId==='aisha','stable attendee IDs should prevent duplicate increments despite pre-existing offline records');
WB.dispatch('campus-sync-checkins');
assert(WB.state.campus.checkin.offlineIds.length===0&&!WB.state.campus.checkin.duplicateId&&WB.state.campus.checkin.syncedIds.includes('aisha'),'reconciliation should preserve attendee identity and clear pending state');
const syncedCount=WB.state.campus.checkin.syncedIds.length;
WB.dispatch('campus-checkin',{person:'aisha'});
assert(WB.state.campus.checkin.syncedIds.length===syncedCount&&WB.state.campus.checkin.offlineIds.length===0,'a synced attendee should remain duplicate-protected');

WB.reset();
const rosterBefore=WB.state.campus.org.members.filter(member=>member.active).length;
WB.dispatch('campus-request-membership');
WB.dispatch('campus-approve-membership');
assert(WB.state.campus.org.members.filter(member=>member.active).length===rosterBefore+1&&WB.state.campus.org.members.some(member=>member.id==='aisha'),'membership approval should update the roster record');

WB.reset();
WB.dispatch('campus-select-support',{service:'Academic advising'});
WB.dispatch('campus-request-appointment');
assert(WB.state.campus.support.appointmentShare==='Name, email, service, and requested time','minimal sharing should be captured with the appointment request');
assert(WB.render('S35').includes('Academic advising · requested'),'adviser context should reflect the selected appointment service');
WB.dispatch('campus-cancel-appointment');
WB.dispatch('campus-toggle-sharing');
WB.dispatch('campus-request-appointment');
assert(WB.state.campus.support.appointmentShare.includes('PHYS 110'),'expanded sharing should be captured without changing earlier requests retroactively');

WB.reset();
const openBefore=WB.state.campus.supportQueue.filter(item=>item.status!=='resolved').length;
WB.dispatch('campus-create-referral');
assert(WB.state.campus.referral==='received'&&WB.state.campus.referralData.owner==='Unassigned','new referral should enter the named queue unassigned');
assert(WB.state.campus.supportQueue.filter(item=>item.status!=='resolved').length===openBefore+1,'referral creation should add an open queue record');
WB.dispatch('campus-redirect-referral');
assert(WB.state.campus.referral==='redirected'&&WB.state.campus.referralData.service==='Academic Advising','redirect should name the receiving service');
WB.dispatch('campus-accept-referral');
WB.dispatch('campus-resolve-referral');
assert(WB.state.campus.referral==='resolved'&&WB.state.campus.referralData.owner==='Marisol Vega','accepted referral should resolve with an owner');
assert(WB.state.campus.supportQueue.filter(item=>item.status!=='resolved').length===openBefore,'resolution should remove the referral from open queue totals');

WB.reset();
WB.state.campus.event.title='<script>unsafe()</script>';
WB.state.campus.referralData.note='<img src=x onerror=unsafe()> & detail';
const eventHtml=WB.render('S28');
const referralHtml=WB.render('S35');
assert(!eventHtml.includes('<script>unsafe()')&&eventHtml.includes('&lt;script&gt;'),'event values must be escaped');
assert(!referralHtml.includes('<img src=x')&&referralHtml.includes('&lt;img'),'referral values must be escaped');

console.log(`campus checks passed: ${ids.length} renderers, ${Object.keys(WB.actions).filter(name=>name.startsWith('campus-')).length} actions`);
