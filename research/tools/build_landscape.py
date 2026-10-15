"""Serialize the reviewed campus landscape; offline and deterministic."""
from pathlib import Path
import csv, json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '05_landscape_missing'
OUT.mkdir(exist_ok=True)
DATE = '2026-10-15'
SCHEMAS = json.loads((ROOT / 'data/schemas.json').read_text())
S = []
def src(key, title, url, finding, kind='vendor product page', date='Not stated', limits='Advertised product scope; not independently tested. Ultimate ownership and price are not established unless explicitly recorded.'):
    S.append(dict(source_id='LAND-'+key, title=title, url=url, finding=finding, source_type=kind, publication_date=date, access_date=DATE, limitations=limits))
src('01','EDUCAUSE interoperability guide','https://www.educause.edu/content/2026/the-integrated-institution-a-guide-to-interoperability-for-student-success','Fragmented data and governance; phased integration; learning/advising handoffs.','sector guidance','2026-09-18','Expert guidance, not a representative prevalence survey or proof that one vendor replacement is best.')
src('02','Pathify campus experience platform','https://pathify.com/','Portal, tasks, communications, communities and middleware; vendor-listed Pacific and MCCC cases.')
src('03','Ready Education','https://www.readyeducation.com/','CampusGroups and campus mobile/community platform family.')
src('04','Illumia solutions','https://illumiatech.com/','Campus ID, credentials, access, dining, POS, payments and ERP integration.')
src('05','Becoming Illumia','https://illumiatech.com/about/becoming-illumia','Transact + CBORD rebrand launched March 2026; Roper parent; legacy contracts continue.','corporate transition FAQ','2026 transition','Page distinguishes launch/filing March 3 from legal effective date April 30; do not treat rebrand as a new acquisition.')
src('06','StarRez housing','https://www.starrez.com/','Housing, roommates, billing, meal plans, residence life, maintenance, conference lodging.')
src('07','Handshake employers','https://joinhandshake.com/employers/','Employer/student recruiting network; a career marketplace rather than LMS functionality.')
src('08','Symplicity higher education','https://www.symplicity.com/higher-ed','Career, experiential learning and broader student-service platform portfolio.')
src('09','Symplicity homepage','https://www.symplicity.com/','Penn State career-system testimonial and Hartnell accessibility-service story.')
src('10','Qualtrics higher education','https://www.qualtrics.com/education/higher-ed/','Student feedback, course evaluations and experience management.')
src('11','TeamDynamix higher education','https://www.teamdynamix.com/industries/higher-education/','ITSM, ESM, projects, assets and integration; Elon ticket-routing testimonial.','vendor product page with customer testimony',limits='Vendor-selected testimony supports a local workflow need; numeric efficiency and market claims not adopted.')
src('12','Blackbaud','https://www.blackbaud.com/','Fundraising/advancement and nonprofit financial/relationship software.')
src('13','Digication','https://www.digication.com/','ePortfolios and authentic learning evidence.')
src('14','Respondus LockDown Browser','https://web.respondus.com/he/lockdownbrowser/','Secure assessment browser with LMS integrations; distinct from Monitor webcam service.')
src('15','Respondus accessibility','https://web.respondus.com/accessibility-lockdown/','Assistive-technology support and accommodation documentation.','vendor documentation',limits='Read with actual device/assistive-technology tests; not a guarantee for every examination setup.')
src('16','OCLC WorldShare Management Services','https://www.oclc.org/en/worldshare-management-services.html','Library services, acquisitions/circulation and WorldCat-connected operations.')
src('17','Clarivate Yale library selection','https://clarivate.com/news/yale-university-selects-clarivate-to-provide-their-next-library-services-and-discovery-platforms/','Alma/Primo library services and discovery; Clarivate product ownership.','vendor customer announcement','2023','Historic selection, not a claim of current implementation completion.')
src('18','T2 Systems','https://www.t2systems.com/','Parking permits, enforcement and parking operations.')
src('19','Workday education','https://www.workday.com/en-us/solutions/industries/education.html','Student administration plus finance, human resources and planning platform.')
src('20','Salesforce education','https://www.salesforce.com/education/','Education CRM and student lifecycle relationships; integrations and AI positioning.')
src('21','Watermark','https://www.watermarkinsights.com/','Evaluation, assessment, curriculum, accreditation, faculty activity and student success suites.')
src('22','Technolutions Slate','https://technolutions.com/','Admissions, student success and advancement CRM; named institutional stories.')
src('23','Titanium Schedule','https://www.titaniumschedule.com/Main/','Counseling/health EMR; restricted records, accommodation tracking and institution-hosted operations.')
src('24','Maxient','https://www.maxient.com/','Student conduct and sensitive case management.')
src('25','Kuali','https://www.kuali.co/','Higher-ed administrative workflows, research and institutional operations portfolio.')
src('26','NC State ClassEval FAQ','https://provost.ncsu.edu/ofe/teaching-learning/evaluation-of-teaching-at-nc-state/classeval-faq/','Low response and bias cautions; anonymity and evaluation procedures.','institutional guidance',limits='Local operating guidance with historical studies; no national rate or causal effect adopted.')
src('27','Faculty proctoring discussion','https://www.reddit.com/r/Professors/comments/1hxpsy9/honorlock_and_respondus_what_say_thee/','Reported privacy/room-video concerns and mixed proctoring experiences.','user reports','2025-01 (month only; exact day not verified)',limits='Self-selected thread, unverified identities and mixed settings; not prevalence or current defect evidence.')
src('28','Ellucian student success','https://www.ellucian.com/en-ae/products/student/student-success','Degree audit/planning/advising scope; regional page, no US adoption inference.')
src('29','EAB Navigate360','https://eab.com/solutions/navigate360/','Student success CRM, appointments, coordinated support and student app.')
src('30','Populi features','https://www.populi.co/features/','Existing integrated college SIS/LMS/admissions/aid/finance/advancement counterexample.')
src('31','IMLeagues campus recreation','https://www.imleagues.com/','Intramurals, club sports, fitness, facility/membership and access scope; demonstration values are not customer measurements.')
src('32','Terra Dotta global education','https://www.terradotta.com/','International student/scholar services, study abroad, travel registry and risk; no legal compliance assertion.')
for item in S:
    item['publisher']={'01':'EDUCAUSE','26':'NC State Office for Faculty Excellence','27':'Reddit r/Professors contributors'}.get(item['source_id'][-2:],item['title'].split(' features')[0].split(' solutions')[0])
LOOKUP = {s['source_id']:s for s in S}
def refs(keys):
    ids=['LAND-'+k for k in keys.split()]
    return ' | '.join(ids), ' | '.join(LOOKUP[k]['url'] for k in ids)
def write(stem, rows, headers=None):
    with (OUT/(stem+'.csv')).open('w', newline='') as f:
        w=csv.DictWriter(f, fieldnames=headers or SCHEMAS[stem]); w.writeheader(); w.writerows(rows)

# This domain maps portfolio boundaries, not apples-to-apples LMS alternatives.
V=[
('PATHIFY','pathify','Pathify','Campus experience / portal','02','Unified tasks, communications, communities and middleware','Campus-facing coherence across existing systems','Underlying source accuracy and connector depth still matter'),
('READY','ready-education','Ready Education','Mobile / community','03','Mobile/student engagement family including CampusGroups','Student-life and campus-app reach','Does not establish replacement of SIS/LMS administration'),
('ILLUMIA','illumia','Illumia (Transact + CBORD)','Campus commerce / credentials','04 05','Identity, payments, dining and access','Deep campus commerce and physical-system scope','Hardware, financial reconciliation and specialist operating obligations'),
('STARREZ','starrez','StarRez','Housing / residence life','06','Housing and resident lifecycle','Roommates, billing and operational depth','Separate residential records and billing authority'),
('HANDSHAKE','handshake','Handshake','Careers / recruiting','07','Recruiting marketplace','Employer network and career discovery','Network participation cannot be recreated by adding a jobs page'),
('SYMPLICITY','symplicity','Symplicity','Careers / student services','08 09','Career and student-service portfolio','Institutional career operations and configurable workflows','Separate products and sensitive service boundaries'),
('QUALTRICS','qualtrics','Qualtrics','Surveys / experience','10','Feedback and experience management','Cross-journey feedback and evaluation capabilities','Survey response and bias remain methodological issues'),
('TEAMDX','teamdynamix','TeamDynamix','Help desk / enterprise service','11','ITSM, ESM, assets and projects','Service ownership, ticketing and automation','Much deeper than a course help button'),
('BLACKBAUD','blackbaud','Blackbaud','Advancement / fundraising','12','Donor and nonprofit operations','Fundraising-specific relationships and financial workflows','Low immediate teaching adjacency'),
('DIGICATION','digication','Digication','ePortfolios','13','Learning evidence and portfolios','Student-owned presentation of authentic work','Identity, permissions, assessment and post-graduation retention to negotiate'),
('RESPONDUS','respondus','Respondus','Secure assessment','14 15','LockDown Browser and optional Monitor','Established assessment integration and specialist controls','Device, accessibility, privacy and support obligations'),
('OCLC','oclc','OCLC WorldShare','Library','16','Library services platform','Library collection and circulation workflows','Specialist bibliographic ecosystem beyond an LMS'),
('ALMA','clarivate','Clarivate Alma / Primo','Library / discovery','17','Library services and discovery','Connected library resource operations','Migration and licensed-resource metadata require library expertise'),
('T2','t2','T2 Systems','Parking','18','Permits, enforcement and operations','Parking-specific operational scope','Far from teaching and includes physical operations'),
('WORKDAY','workday','Workday','SIS / HR / finance','19','Institutional system of record','Official student, workforce and finance scope','Multi-office transformation and integration complexity'),
('SALESFORCE','salesforce','Salesforce Education','CRM','20','Education lifecycle CRM','Configurable relationship and service workflows','Configuration/implementation scope and entitlements'),
('WATERMARK','watermark','Watermark','Assessment / institutional effectiveness','21','Evaluation, curriculum and accreditation portfolio','Links academic evidence to institutional reporting','Course gradebook is not an accreditation evidence system'),
('SLATE','technolutions','Technolutions Slate','Admissions / advancement CRM','22','Student lifecycle CRM','Admissions and communications with institution stories','Not a learning-content/assessment system'),
('TITANIUM','titanium','Titanium Schedule','Counseling / health records','23','Clinical and student-service EMR','Restricted records and clinical workflow specificity','Clinical data should not become general course context'),
('MAXIENT','maxient','Maxient','Conduct / sensitive cases','24','Conduct case management','Case-specific process and record controls','Avoid broad LMS access to conduct narratives'),
('KUALI','kuali','Kuali','Research / administrative workflow','25','Higher-ed administrative platform','Research and institutional workflow specialization','Distinct institutional buyers and governance'),
('ELLUCIAN','ellucian','Ellucian student success','Advising / degree planning','28','Degree audit/planning/advising','Close course-to-completion adjacency','Official degree rules need authoritative configuration'),
('EAB','eab','EAB Navigate360','Student success','29','Coordinated support CRM','Appointments and intervention workflows','Human service capacity still determines response'),
('POPULI','populi','Populi','Unified college administration','30','Integrated college suite','SIS/LMS/admissions/aid/accounts/advancement in existing offering','Large research-university suitability is not established')]
V.extend([
('IMLEAGUES','imleagues','IMLeagues','Athletics / recreation','31','Campus recreation platform','Intramurals, club sports, facilities and membership','Varsity compliance and athletic-department scope unverified'),
('TERRADOTTA','terradotta','Terra Dotta','International student services','32','Global education platform','Incoming, outgoing and travel workflow','Official reporting, sensitive documents and travel risk require specialist governance')])
C=[]
for cid,vid,name,segment,keys,position,strong,weak in V:
    d=dict.fromkeys(SCHEMAS['competitors'],'');d.update(competitor_id='LAND-'+cid,vendor_id=vid,domain_id='05_landscape_missing',name=name,product_name=name,owner='Operating brand verified; ultimate ownership not established in this domain',ownership_status='partial_ultimate_owner_unverified',target_segment='US higher education; '+segment,positioning=position,pricing_model='Institutional scope/quote; numeric price not verified',pricing_public='not_verified',pricing_notes='No comparable public price verified in this landscape scan.',strengths=strong,weaknesses=weak,verification_status='verified_scope_owner_partial',as_of_date=DATE)
    if cid=='ILLUMIA':d.update(owner='Illumia; Roper Technologies',ownership_status='verified_parent')
    if cid=='ALMA':d.update(owner='Clarivate',ownership_status='verified_product_parent')
    d['source_ids'],d['source_urls']=refs(keys);C.append(d)
write('competitors',C)

F=[('portal','Unified campus portal/tasks'),('mobile','Mobile-facing experience'),('community','Clubs/events/community'),('services','Student-service or referral workflows'),('academic','Academic evidence/evaluation'),('commerce','Campus payment/ID operations'),('records','Official student/finance/workforce records'),('integration','Integration or middleware advertised')]
# Narrow affirmative scope only; unknown is not a negative finding.
support={
'PATHIFY': {'portal':'✅','mobile':'✅','community':'✅','services':'partial','academic':'partial','integration':'✅'},
'READY': {'portal':'partial','mobile':'✅','community':'✅','services':'partial','integration':'partial'},
'ILLUMIA': {'mobile':'✅','community':'partial','commerce':'✅','records':'partial','integration':'✅'},
'WATERMARK': {'services':'✅','academic':'✅','records':'partial','integration':'partial'},
'SYMPLICITY': {'services':'✅','academic':'partial','integration':'partial'},
'WORKDAY': {'portal':'partial','services':'partial','records':'✅','integration':'✅'}}
rows=[]
for cid,cells in support.items():
    v=next(v for v in V if v[0]==cid)
    for fid,feature in F:
        coverage=cells.get(fid,'unknown');d=dict.fromkeys(SCHEMAS['feature_matrix'],'');d.update(domain_id='05_landscape_missing',competitor_id='LAND-'+cid,feature_id='LAND-F-'+fid,feature_name=feature,coverage=coverage,delivery_mode='mixed' if coverage!='unknown' else 'unknown',availability='general' if coverage!='unknown' else 'unknown',plan_or_version='Portfolio scope; exact product entitlement to verify',notes='Portfolio-level map, not a depth or quality score. Partial means narrower scope or connected external records.' if coverage!='unknown' else 'Opened portfolio evidence does not establish this capability; no absence inferred.',evidence_type='vendor documentation',confidence='medium' if coverage!='unknown' else 'low',verification_status='verified_scoped' if coverage!='unknown' else 'not_established',as_of_date=DATE);d['source_ids'],d['source_urls']=refs(v[4]);rows.append(d)
write('feature_matrix',rows)

P=[
('01','','Student-service staff lack a coherent view when data stays in disconnected systems','advisor/admin','cross-campus support','high','A missed handoff can leave a support need unresolved.','01','sector guidance','2026-09-18','Expert guidance; not measured prevalence.'),
('02','','Different meanings for enrollment/status/grade create misleading combined views','IT/admin','data governance','high','A technically successful sync can still drive the wrong action.','01','sector guidance','2026-09-18','Analyst implication of documented data-governance challenges; not a vendor defect.'),
('03','','Multiple logins and disconnected journeys make services hard to navigate','student','campus navigation','medium','Adds avoidable discovery and access work.','01','sector guidance','2026-09-18','Sector framework description; no survey rate.'),
('04','','Low online course-evaluation participation limits interpretation','faculty/admin','course evaluations','medium','Nonresponse makes feedback an uncertain representation.','26','institutional operating guidance','','NC State guidance; not attributed to a specific survey vendor.'),
('05','','Course ratings can reflect bias and should not stand alone in faculty decisions','faculty/admin','faculty evaluation','high','Overinterpretation can affect consequential personnel decisions.','26','institutional operating guidance','','Documented methodological caution; not a product-caused bias.'),
('06','LAND-RESPONDUS','Faculty report student objections to recording private living spaces','student/faculty','online proctoring','high','Privacy concerns can impair acceptable examination access.','27','user report','','Reported January 2025; exact day not verified. One self-selected mixed-opinion discussion; identities/configuration unverified.'),
('07','LAND-RESPONDUS','Assistive technology and examination setup need advance compatibility validation','student/disability staff','accessible assessment','high','A failed configuration can block an assessed attempt.','15','vendor documentation / analyst implication','','Compatibility checklist is not a measured complaint or claim of incompatibility.'),
('08','LAND-TEAMDX','Institutions need requests routed to the team responsible for resolution','IT/service staff','help desk triage','medium','Ownership delays can lengthen issue resolution.','11','vendor-selected customer testimony','','Elon testimonial supports local service-routing value; no timing/savings claim.'),
('09','LAND-TITANIUM','Clinical records cannot be assumed to migrate through a built-in import','clinical IT/admin','EMR migration','high','Manual conversion and record integrity require specialist planning.','23','vendor documented limitation','','Vendor says no built-in migration feature; no customer satisfaction inference.'),
('10','LAND-TITANIUM','Provider iPad workflow is unavailable in the documented Windows client','provider','clinical documentation','medium','Constrains device choice for clinical staff.','23','vendor documented limitation','','Vendor FAQ explicitly distinguishes client web forms from provider use.')]
rows=[]
for pid,cid,pain,role,workflow,severity,reason,keys,kind,date,limit in P:
    d=dict.fromkeys(SCHEMAS['pain_points'],'');d.update(pain_id='LAND-P-'+pid,domain_id='05_landscape_missing',competitor_id=cid,pain_point=pain,affected_role=role,institution_segment='US higher education; local/sector context as stated',workflow=workflow,severity=severity,severity_rationale=reason,evidence_type=kind,reported_date=date,source_context='See source register for institution/vendor context.',prevalence_limitations=limit,confidence='medium',verification_status='verified_scoped',as_of_date=DATE);d['source_ids'],d['source_urls']=refs(keys);rows.append(d)
write('pain_points',rows)

# Rankings are qualitative analyst decisions, not measured market scores.
R=[
('Academic advising / early alert','Ellucian; EAB; Starfish; Stellic; Civitas','high','medium','high','later','Promote 06; build transparent referrals after teaching data is trustworthy.','28 29 01'),
('Unified tasks / campus communications','Pathify; Ready Education; Salesforce','high','medium','high','now','Shared task and notification model inside LMS; defer institution-wide replacement.','02 03 20'),
('Attendance / participation','LMS incumbents; Top Hat; Illumia event access','medium','medium','high','now','Optional transparent attendance; avoid inferring physical presence from logins.','04 01'),
('Course evaluations / feedback','Watermark; Qualtrics','high','medium','high','later','Integrate survey windows/status first; protect anonymity and interpretations.','21 10 26'),
('ePortfolios / learning evidence','Digication; Watermark','medium','medium','high','later','Start durable exports and evidence links before a portfolio product.','13 21'),
('Curriculum / catalog governance','Watermark; Kuali; Coursedog (02)','high','low','high','later','Consume approved catalog/versions; authoring approvals remain separate.','21 25'),
('Degree audit / transfer articulation','Ellucian; specialist advising tools (06)','high','low','high','later','Read authoritative plans; no unofficial graduation promises.','28'),
('Assessment / academic integrity','Respondus; Gradescope (01); Turnitin brand lead unverified here','high','low','high','later','Integrate chosen provider; no homemade invasive proctoring or AI guilt score.','14 15 27'),
('Accessible content / accommodations','LMS/accessibility tools (04); Titanium; Symplicity','high','medium','high','now','Accessible assessment and operational accommodations; restricted diagnosis records stay outside.','15 23 09'),
('Institutional assessment / accreditation','Watermark; Kuali','high','low','medium','later','Export trustworthy outcomes; avoid premature official reporting replacement.','21 25'),
('Career services / internships','Handshake; Symplicity','medium','low','medium','later','Surface appointments/opportunities; preserve employer network and placement operations.','07 08'),
('Service learning / experiential record','Symplicity; Digication; GivePulse (03)','medium','medium','medium','later','Connect learning evidence and approved experiences.','08 13'),
('Help desk / service requests','TeamDynamix; Salesforce','high','low','medium','later','Contextual request handoff and status; keep enterprise ITSM authoritative.','11 20'),
('Campus mobile / portal','Pathify; Ready Education','high','medium','high','later','Mobile web core now; native/whole-campus hub after actual device need is measured.','02 03'),
('Admissions / recruitment CRM','Technolutions Slate; Salesforce; Populi','high','low','low','never','Integration within foreseeable roadmap; do not build another admissions system.','22 20 30'),
('Registration / official transcript / SIS','Workday; Ellucian (04); Populi','high','low','high','never','Integrate authoritative membership and grades; replacement is a different enterprise program.','19 28 30'),
('Financial aid / bursar / student accounts','Populi; Workday; Illumia','high','low','low','never','Show authorized balances/holds and deep links; keep aid/accounting authority external.','30 19 04'),
('Housing / residence life','StarRez; Symplicity portfolio','medium','low','low','never','Integrate requests/status; no residential allocation/billing engine initially.','06 08'),
('Dining / meal plans / campus ID','Illumia (Transact + CBORD)','medium','low','low','never','Credential and balance adapters only when demanded.','04 05'),
('Parking / mobility','T2 Systems','medium','low','low','never','Service discovery/deep link; hardware and enforcement remain specialist.','18'),
('Library / licensed resources','Clarivate Alma/Primo; OCLC WorldShare','medium','low','medium','never','Library links and reading resources; no bibliographic/circulation engine.','16 17'),
('Alumni / advancement / fundraising','Blackbaud; Slate; Populi','medium','low','low','never','Graduate identity/portfolio export and permissions; no donor CRM.','12 22 30'),
('HR / payroll / finance','Workday; Kuali','high','low','low','never','Role and employment context only; keep enterprise ledgers/payroll external.','19 25'),
('Research administration / grants','Kuali','high','low','low','never','Separate research office workflow and financial controls.','25'),
('Clinical counseling / health records','Titanium Schedule','high','low','low','never','Private referral/directory handoff; never generalize clinical notes into course records.','23'),
('Conduct / sensitive case management','Maxient; StarRez residence-life tools','high','low','low','never','Restricted handoff only; do not centralize narratives in the LMS.','24 06'),
('Facilities / work orders / assets','StarRez; TeamDynamix','medium','low','low','never','Request links/status; operational asset management stays external.','06 11'),
('Forms / approvals / workflow','Kuali; Salesforce; Slate','high','medium','medium','later','Reuse scoped event/course forms; defer general enterprise workflow builder.','25 20 22'),
('Continuing education / noncredit','Populi / course-suite leads; specialist market not deeply verified','medium','low','medium','later','Research separately if first segment requires non-term enrollment/payment.','30'),
('Lecture capture / video / captions','Specialist providers need follow-up; no named product verified in this scan','medium','medium','high','later','Accessible media and embedding now; integrate capture/transcoding rather than build infrastructure.','15 01'),
('Emergency / public safety communications','Specialist mass-notification provider needed; not verified in this scan','high','low','low','never','Do not present ordinary course notifications as emergency delivery.','01')]
R.extend([
('Athletics / recreation','IMLeagues; varsity-specialist coverage unverified','medium','low','low','never','Integrate schedules and discovery; sports operations and physical access remain specialist.','31'),
('International student services / study abroad','Terra Dotta','high','low','low','never','Integrate authorized appointments/tasks; official documentation and travel-risk decisions remain specialist.','32')])
rank=[]
score={'high':5,'medium':3,'low':1}
priority_headers='domain_id,domain_name,users,buyer,key_vendors,pain_score,ability_to_win_score,core_closeness_score,opportunity_score,score_rationale,implementation_burden,trust_or_regulatory_risk,recommendation,delivery_approach,promote_to_domain,confidence,as_of_date,source_ids,source_urls'.split(',')
office={0:'Student success / advising leadership',1:'CIO / academic affairs',2:'Academic affairs',3:'Institutional effectiveness',4:'Academic affairs',5:'Registrar / curriculum governance',6:'Registrar',7:'Academic affairs / assessment',8:'Accessibility / academic affairs',9:'Institutional effectiveness',10:'Career services',11:'Experiential learning',12:'CIO / service management',13:'CIO / student affairs',14:'Enrollment management',15:'Registrar / CIO',16:'Bursar / financial aid',17:'Housing / residence life',18:'Campus services / finance',19:'Parking / transportation',20:'Library leadership',21:'Advancement',22:'Finance / HR',23:'Research administration',24:'Health / counseling leadership',25:'Student affairs / conduct',26:'Facilities / CIO',27:'Relevant process owner / CIO',28:'Continuing education',29:'Academic technology',30:'Public safety'}
for i,(domain,players,pain,win,close,decision,rationale,keys) in enumerate(R,1):
    ids,urls=refs(keys);p,w,c=score[pain],score[win],score[close]
    rank.append(dict(domain_id=f'LAND-D-{i:02}',domain_name=domain,users='Students; faculty/staff in '+domain.lower(),buyer=office.get(i-1,'Athletics / recreation leadership' if i==32 else 'International programs leadership'),key_vendors=players,pain_score=p,ability_to_win_score=w,core_closeness_score=c,opportunity_score=p*w*c,score_rationale='Subjective 1–5 judgments (high=5, medium=3, low=1); product is a screening aid, not measured demand. '+rationale,implementation_burden='high' if win=='low' else 'medium to high; depends on scope',trust_or_regulatory_risk='high: authority/privacy/operational applicability needs institution review' if decision=='never' or i in [1,7,8,9] else 'medium to high; institution-specific data and policy',recommendation='never_build' if decision=='never' else decision,delivery_approach='native within LMS' if decision=='now' else 'integration / partner first; bounded native workflow later' if decision=='later' else 'integration / contextual handoff only',promote_to_domain='06_student_success_advising' if i==1 else 'no',confidence='medium' if i<29 else 'low',as_of_date=DATE,source_ids=ids,source_urls=urls))
write('priority_ranking',rank,priority_headers)
(OUT/'sources.json').write_text(json.dumps(S,indent=2)+'\n')
lines=['# Campus landscape source register','','Access date: 2026-10-15. Opened sources only. Market size, prices and ultimate ownership remain blank/unverified where this scan did not establish them.','','| ID | Title and URL | Publisher | Type | Publication/revision | Access | Finding | Limits |','| --- | --- | --- | --- | --- | --- | --- | --- |']
for s in S:lines.append('| '+' | '.join([s['source_id'],f"[{s['title']}]({s['url']})",s['publisher'],s['source_type'],s['publication_date'],s['access_date'],s['finding'],s['limitations']])+' |')
(OUT/'sources.md').write_text('\n'.join(lines)+'\n')
print('Landscape:',len(C),'competitors;',len(rows),'pains;',len(rank),'ranked domains;',len(S),'sources')
