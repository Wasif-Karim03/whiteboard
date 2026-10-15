"""Validate research contracts and generate merged data without network access."""
from pathlib import Path
from urllib.parse import unquote, urlparse
import csv, hashlib, json, re

ROOT=Path(__file__).resolve().parents[1]
SCHEMAS=json.loads((ROOT/'data/schemas.json').read_text())
DATE='2026-10-15'
DOMAINS=['01_lms','02_scheduling_rooms','03_events_clubs','04_cross_cutting','05_landscape_missing','06_student_success_advising']
errors=[]; summaries=[]; merged={k:[] for k in SCHEMAS}
def check(ok,message):
    if not ok:errors.append(message)
for domain in DOMAINS:
    folder=ROOT/domain
    for file in ['notes.md','opportunities.md','sources.md',*[k+'.csv' for k in SCHEMAS]]:
        check((folder/file).is_file(),f'{domain}: missing {file}')
    if not (folder/'sources.md').exists():continue
    register=(folder/'sources.md').read_text()
    source_ids=set(re.findall(r'\|\s*((?:LMS-|ROOM-|EVENT-|CROSS-|LAND-|ADVISE-)[A-Za-z0-9-]+)\s*\|',register))
    count={}
    competitors=set()
    for stem,headers in SCHEMAS.items():
        path=folder/(stem+'.csv')
        if not path.exists():continue
        with path.open(newline='') as f:
            reader=csv.DictReader(f);check(reader.fieldnames==headers,f'{path}: header mismatch'); rows=list(reader)
        count[stem]=len(rows)
        seen=set()
        for index,row in enumerate(rows,2):
            label=f'{domain}/{stem}.csv:{index}'
            check(None not in row and None not in row.values(),label+': row width')
            check(row['domain_id']==domain,label+': wrong domain')
            check(row['as_of_date']==DATE,label+': wrong access date')
            ids=row['source_ids'].split(' | '); urls=row['source_urls'].split(' | ')
            check(len(ids)==len(urls) and bool(ids[0]),label+': source pair count')
            for sid,url in zip(ids,urls):
                check(sid in source_ids,label+': unknown source '+sid)
                check(url in register,label+': URL missing from source register '+url)
                check(urlparse(url).scheme in {'http','https'},label+': non-web evidence URL')
            if stem=='competitors':
                key=row['competitor_id'];competitors.add(key)
                check(bool(row['vendor_id']) and not re.match(r'(ROOM|ADVISE)-VEND',row['vendor_id']),label+': vendor ID not canonical')
                for field in ['pricing_confidence','market_share_confidence','customer_count_confidence']:
                    check(row[field] in {'','high','medium','low'},label+': invalid '+field)
                for value,confidence in [('price_amount','pricing_confidence'),('market_share_value','market_share_confidence'),('customer_count_value','customer_count_confidence')]:
                    if row[value]:check(bool(row[confidence]),label+': numeric claim missing confidence')
            elif stem=='feature_matrix':
                key=(row['competitor_id'],row['feature_id'])
                check(row['competitor_id'] in competitors,label+': missing competitor')
                check(row['coverage'] in {'✅','partial','❌','unknown'},label+': coverage')
                check(row['delivery_mode'] in {'native','add_on','integration','mixed','unknown'},label+': delivery mode')
                check(row['availability'] in {'general','beta','announced','retired','unknown'},label+': availability')
                check(row['confidence'] in {'high','medium','low'},label+': confidence')
            else:
                key=row['pain_id']
                check(not row['reported_date'] or bool(re.fullmatch(r'\d{4}-\d{2}-\d{2}',row['reported_date'])),label+': imprecise reported date must move to context')
                check(not row['competitor_id'] or row['competitor_id'] in competitors,label+': missing pain competitor')
                check(row['severity'] in {'high','medium','low'},label+': severity')
                check(bool(row['severity_rationale']) and bool(row['prevalence_limitations']),label+': missing pain qualification')
            check(key not in seen,label+': duplicate key'); seen.add(key)
        merged[stem].extend(rows)
    summaries.append(dict(domain=domain,**count,source_records=len(source_ids)))

# Local Markdown links, including references to original audit artifacts, must resolve.
for path in ROOT.rglob('*.md'):
    for target in re.findall(r'\]\(([^)]+)\)',path.read_text()):
        target=target.strip('<>')
        if target.startswith(('http:','https:','mailto:','#')):continue
        resolved=(path.parent/unquote(target.split('#')[0])).resolve()
        generated={ROOT/'data'/('all_'+k+'.csv') for k in SCHEMAS} | {ROOT/'data/validation.json',ROOT/'data/vendor_coverage.csv'}
        check(resolved.exists() or resolved in generated,f'{path.relative_to(ROOT)}: broken link {target}')

if not errors:
    for stem,rows in merged.items():
        with (ROOT/'data'/('all_'+stem+'.csv')).open('w',newline='') as f:
            writer=csv.DictWriter(f,fieldnames=SCHEMAS[stem]);writer.writeheader();writer.writerows(rows)
    vendors={}
    for row in merged['competitors']:
        vendors.setdefault(row['vendor_id'],{'domains':set(),'products':set()})
        vendors[row['vendor_id']]['domains'].add(row['domain_id']);vendors[row['vendor_id']]['products'].add(row['product_name'])
    with (ROOT/'data/vendor_coverage.csv').open('w',newline='') as f:
        writer=csv.DictWriter(f,fieldnames=['vendor_id','domain_count','domain_ids','products']);writer.writeheader()
        for vendor,details in sorted(vendors.items()):writer.writerow(dict(vendor_id=vendor,domain_count=len(details['domains']),domain_ids=' | '.join(sorted(details['domains'])),products=' | '.join(sorted(details['products']))))
    original=ROOT.parent/'Claude outputs/Pellwin-Showcase.html'
    check(hashlib.sha256(original.read_bytes()).hexdigest()=='090136bffdcdbdc4b7d0a8b1a650cb9e1a6a3750eabb35cd28b1ec13ba29d2dd','Original HTML changed')
result=dict(checked_date=DATE,status='pass' if not errors else 'fail',domains=summaries,totals={k:len(v) for k,v in merged.items()},errors=errors,limits=['Checks validate structure and traceability, not independent truth of every external claim.','No product execution or representative customer interviews.','Local browser preview previously blocked by URL policy; no bypass attempted.'])
(ROOT/'data/validation.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
raise SystemExit(bool(errors))
