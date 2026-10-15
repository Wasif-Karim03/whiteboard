(function(){
'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
const e=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names=['Aisha Rahman','Ben Kowalski','Carmen Ortiz','Daniel Park','Emily Nguyen','Faisal Haddad','Grace Liu','Hugo Silva','Isabel Torres','Jamal Carter','Kai Williams','Leila Hassan','Mateo Rivera','Nora Johnson','Olivia Bennett','Priya Raman','Quinn Delgado','Ravi Shah','Sofia Chen','Theo Martin','Uma Desai','Victor Santos','Willa Brooks','Xavier Reed','Yara Ali','Zoe James','Amir Khan','Bella Moore','Caleb Green','Dina Ahmed','Eli Turner','Freya Scott','Gabe Nelson','Hana Kim','Ian Foster','Jade Wilson','Kiran Patel','Lena Fischer','Miles Adams','Nadia Saleh','Owen Wright','Pia Costa','Rosa Diaz','Sean Murphy'];
const people=names.map((name,i)=>({id:i===0?'aisha':i===1?'ben':i===2?'carmen':'student-'+i,name,active:true,submitted:i<41,reviewed:i>0&&i<40}));
const defaults={
 people,
 assignment:{title:'Problem Set 4: Kinematics',due:'2026-10-16T23:59',close:'2026-10-18T23:59',published:true,policy:'Limited: use AI to clarify concepts; show your own working and disclose assistance.',questions:[{id:'1a',max:6},{id:'1b',max:4},{id:'2',max:6},{id:'3',max:8},{id:'4',max:6}]},
 submission:{status:'received',attempt:1,pages:[{id:1,tag:'1a, 1b',rotation:0},{id:2,tag:'2',rotation:0},{id:3,tag:'3',rotation:0},{id:4,tag:'4',rotation:0}],method:'scan',interrupted:false,error:'',receipt:'AH-PHYS110-001'},
 assessment:{student:'aisha',question:'3',role:'instructor',marks:{aisha:[6,4,5,7,5],ben:[5,4,4,6,5],carmen:[6,4,6,8,6]},graded:people.filter(x=>x.reviewed).map(x=>x.id),released:[],comment:'Your setup is clear. Check the sign of the vertical acceleration in the final substitution.',releaseScope:'selected',rubricAdjusted:false,conflict:false,aiDraft:false,sortAsc:true},
 course:{moduleOpen:true,material:'reading',reply:'',replies:[],quizAnswer:'',quizSubmitted:false,quizFlag:false,quizPublished:false,read:false,prefs:'Daily digest',quiet:true},
 institution:{aiEnabled:false,taActive:true,rosterResolved:false,gradeSynced:false,migrationMapped:false,migrationAccepted:false,retention:'End of term + 90 days',supportAccess:false,exported:false,logs:[]}
};
const WB=window.WB={defaults,state:clone(defaults),renderers:{},actions:{},ui:{},e,clone};
for(const [i,person] of defaults.people.entries())if(!defaults.assessment.marks[person.id])defaults.assessment.marks[person.id]=[6,4,Math.max(3,6-i%4),Math.max(5,8-i%4),Math.max(4,6-i%3)];
defaults.assessment.comments=Object.fromEntries(defaults.people.map(p=>[p.id,p.id==='aisha'?defaults.assessment.comment:'Review your units and show the intermediate steps.']));
WB.state=clone(defaults);
WB.defineState=(key,value)=>{WB.defaults[key]=clone(value);WB.state[key]=clone(value);};
WB.reg=(id,title,role,render)=>{WB.renderers[id]={id,title,role,render};};
WB.reset=()=>{WB.state=clone(WB.defaults);};
WB.beginDraft=s=>{if(s.submission.status==='received')s.submission.attempt++;s.submission.status='draft';s.assessment.graded=s.assessment.graded.filter(id=>id!=='aisha');s.assessment.released=s.assessment.released.filter(id=>id!=='aisha');if(s.assessment.releaseSnapshots)delete s.assessment.releaseSnapshots.aisha;};
WB.set=(path,value)=>{const keys=path.split('.');if(keys.some(x=>['__proto__','constructor','prototype'].includes(x)))throw Error('Invalid field');if(path.startsWith('submission.pages.'))WB.beginDraft(WB.state);let o=WB.state;for(const k of keys.slice(0,-1)){if(!o[k]||typeof o[k]!=='object')o[k]={};o=o[k];}o[keys.at(-1)]=value;};
WB.score=(s,id='aisha')=>(s.assessment.marks[id]||[]).reduce((a,b)=>a+Number(b),0);
WB.deadline=value=>{const d=new Date(value+'Z');return Number.isNaN(d.getTime())?'Date not set':d.toLocaleString('en-US',{timeZone:'UTC',month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})+' ET';};
WB.received=s=>s.people.filter(p=>p.active&&(p.id==='aisha'?s.submission.status==='received':p.submitted)).length;
WB.audit=(s,action)=>s.institution.logs.unshift({action,time:'15 Oct, 10:42 am',actor:'Authorized sample user'});
WB.dispatch=(name,p={})=>{if(!WB.actions[name])throw Error('Unknown action: '+name);return WB.actions[name](WB.state,p)||{};};
const attrs=o=>Object.entries(o).map(([k,v])=>` data-${k.replace(/[A-Z]/g,m=>'-'+m.toLowerCase())}="${e(v)}"`).join('');
const paths={book:'M4 4h6c2 0 2 2 2 2s0-2 2-2h6v16h-6c-2 0-2 1-2 1s0-1-2-1H4V4Zm8 2v15',check:'m5 12 4 4L19 6',arrow:'M4 12h16m-6-6 6 6-6 6',calendar:'M5 5h14v15H5zM8 3v4m8-4v4M5 10h14',grid:'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z',clock:'M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0',people:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 3a4 4 0 0 1 0 8m7 10v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',shield:'m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6l8-3Zm-4 9 3 3 5-6',sun:'M12 3v2m0 14v2M3 12h2m14 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',menu:'M4 6h16M4 12h16M4 18h16',upload:'M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6',bell:'M6 9a6 6 0 0 1 12 0v6l2 2H4l2-2V9m4 12h4',pin:'M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 0 1 14 0Zm-5 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0',file:'M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6m-6 4h6'};
const h=WB.h={e};
h.icon=(name='book')=>`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.book}"/></svg>`;
h.btn=(label,action,data={},kind='secondary')=>`<button type="button" class="button ${kind}" data-action="${e(action)}"${attrs(data)}>${e(label)}</button>`;
h.go=(label,id,kind='secondary')=>h.btn(label,'go',{screen:id},kind);
h.pill=(text,tone='neutral')=>`<span class="pill ${e(tone)}">${e(text)}</span>`;
h.head=(title,sub='',tools='')=>`<div class="screen-head"><div><p class="screen-crumb">Alder Hill College <span aria-hidden="true">/</span> Fall 2026</p><h4>${e(title)}</h4>${sub?`<p>${e(sub)}</p>`:''}</div>${tools?`<div class="actions">${tools}</div>`:''}</div>`;
h.card=(title,body,cls='')=>`<section class="card ${e(cls)}"><h5>${e(title)}</h5>${body}</section>`;
h.row=(title,sub='',tail='')=>`<div class="item-row"><div><strong>${e(title)}</strong>${sub?`<p>${e(sub)}</p>`:''}</div>${tail?`<div class="item-tail">${tail}</div>`:''}</div>`;
h.notice=(title,body='',tone='info')=>`<div class="notice ${e(tone)}"><strong>${e(title)}</strong>${body?`<p>${e(body)}</p>`:''}</div>`;
h.stats=items=>`<div class="stats">${items.map(([value,label])=>`<div><b>${e(value)}</b><span>${e(label)}</span></div>`).join('')}</div>`;
h.field=(label,path,value,type='text')=>{const id=WB.prefix+'-'+path.replace(/\W/g,'-');return `<label class="field" for="${id}"><span>${e(label)}</span><input id="${id}" type="${e(type)}" data-bind="${e(path)}" value="${e(value)}"></label>`;};
h.area=(label,path,value)=>{const id=WB.prefix+'-'+path.replace(/\W/g,'-');return `<label class="field" for="${id}"><span>${e(label)}</span><textarea id="${id}" data-bind="${e(path)}" rows="3">${e(value)}</textarea></label>`;};
h.select=(label,path,value,options)=>{const id=WB.prefix+'-'+path.replace(/\W/g,'-');return `<label class="field" for="${id}"><span>${e(label)}</span><select id="${id}" data-bind="${e(path)}">${options.map(x=>{const [v,l]=Array.isArray(x)?x:[x,x];return `<option value="${e(v)}"${String(v)===String(value)?' selected':''}>${e(l)}</option>`;}).join('')}</select></label>`;};
h.table=(caption,headers,rows)=>`<div class="table-scroll" role="region" aria-label="${e(caption)}" tabindex="0"><table><caption>${e(caption)}</caption><thead><tr>${headers.map(x=>`<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
h.tabs=(items,path,current)=>`<div class="segmented" role="group" aria-label="View">${items.map(([value,label])=>`<button type="button" data-action="set" data-path="${e(path)}" data-value="${e(value)}" aria-pressed="${String(current)===String(value)}">${e(label)}</button>`).join('')}</div>`;
h.paper=(question='3',rotation=0)=>`<div class="paper-wrap"><svg class="work-paper" viewBox="0 0 480 390" role="img" aria-label="Illustrative handwritten physics solution, question ${e(question)}" style="transform:rotate(${Number(rotation)||0}deg)"><rect width="480" height="390" rx="4" fill="#fff"/><g stroke="#d9e5ee" stroke-width="1">${Array.from({length:11},(_,i)=>`<path d="M24 ${56+i*28}H456"/>`).join('')}</g><path d="M48 24v342" stroke="#e8bfc2"/><g fill="#283b67" font-family="cursive" font-size="19"><text x="65" y="43">Question ${e(question)} · Kinematics</text><text x="68" y="91">Given: v₀ = 12 m/s, θ = 35°</text><text x="66" y="145">x(t) = v₀ cos(θ) · t</text><text x="68" y="201">y(t) = h + v₀ sin(θ)t − ½gt²</text><text x="69" y="287">Choose upward as positive.</text><text x="70" y="341">Check units: metres ✓</text></g><g stroke="#283b67" stroke-width="2" fill="none"><path d="M315 250h113m-103 12v-93m0 15 7 12m-7-12-7 12M330 246q25-104 89-15"/><path d="m409 232 11-1-2-11"/></g></svg><span class="paper-caption">Illustrative student work</span></div>`;
WB.render=(id,state=WB.state)=>{const entry=WB.renderers[id];if(!entry)return h.head('Experience in preparation','This chapter will be added in the next build group.');const before=JSON.stringify(state);WB.prefix=id;const html=entry.render(state,h);if(JSON.stringify(state)!==before)throw Error('Renderer mutated state: '+id);return html;};
WB.actions.set=(s,p)=>{WB.set(p.path,p.value);return {};};
})();
