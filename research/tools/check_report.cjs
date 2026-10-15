// Exercise the actual inline report controller against a small DOM fixture.
// This is a controller check, not browser rendering or assistive-technology QA.
const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');
const path = require('path');
const report = fs.readFileSync(path.join(__dirname, '../report/index.html'), 'utf8');
const scripts = [...report.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x => x[1]);
const controller = scripts.find(x => x.includes('function applyFilter(table)'));
assert(controller, 'inline controller exists');
for (const section of ['features', 'pains']) {
  const table = report.match(new RegExp('<table[^>]*id="06_student_success_advising-' + section + '"[\\s\\S]*?<\\/table>'));
  assert(table, 'advising ' + section + ' table exists');
  assert(/data-vendor="[^"]*navigate360/i.test(table[0]), 'product alias searchable in ' + section);
  assert(/data-vendor="[^"]*EAB Global Inc./i.test(table[0]), 'owner alias searchable in ' + section);
}
function element(extra = {}) {
  return Object.assign({attrs:{}, events:{}, value:'', textContent:'', hidden:false,
    addEventListener(name, fn) {this.events[name]=fn;},
    setAttribute(name,value) {this.attrs[name]=value;},
    removeAttribute(name) {delete this.attrs[name];},
    getAttribute(name) {return this.attrs[name] || null;}, focus() {},
  },extra);
}
const theme = element(), root = element(), globalInput=element(), globalClear=element();
const search=element({dataset:{tableSearch:'fixture'}}), clear=element({dataset:{clearSearch:'fixture'}}), status=element();
const empty=element({classList:{contains:name=>name==='empty-row'}});
const row = (name,vendor) => element({dataset:{search:name.toLowerCase(),vendor},cells:[{textContent:name}],classList:{contains:()=>false}});
const beta=row('Beta 10','vendor-b'), alpha=row('Alpha 2','vendor-a');
const body={rows:[beta,alpha,empty],querySelector:()=>empty,appendChild(item){this.rows=this.rows.filter(x=>x!==item);this.rows.push(item);}};
const table=element({id:'fixture',dataset:{vendorAware:'true'},tBodies:[body]});
const th=element();th.parentElement={children:[th],querySelectorAll:()=>[th]};
const sort=element({closest:type=>type==='table'?table:th});
const selectors={'[data-theme-toggle]':[theme],'.data-table':[table],'[data-table-search]':[search],'[data-clear-search]':[clear],'.sort-button':[sort],'.mobile-nav-panel a':[]};
const ids={'fixture':table,'fixture-search':search,'fixture-status':status};
const document={documentElement:root,querySelectorAll:q=>selectors[q]||[],querySelector:q=>q==='[data-global-vendor]'?globalInput:q==='[data-clear-global]'?globalClear:null,getElementById:id=>ids[id]};
const localStorage={getItem(){throw new Error('storage unavailable');},setItem(){throw new Error('storage unavailable');}};
vm.runInNewContext(controller,{document,localStorage,window:{}});
assert.equal(status.textContent,'2 of 2 records shown.');
search.value='Alpha';search.events.input();assert.equal(alpha.hidden,false);assert.equal(beta.hidden,true);
globalInput.value='vendor-b';globalInput.events.input();assert.equal(empty.hidden,false);assert.equal(status.textContent,'0 of 2 records shown.');
clear.events.click();assert.equal(beta.hidden,false);assert.equal(alpha.hidden,true);
globalClear.events.click();assert.equal(alpha.hidden,false);assert.equal(empty.hidden,true);
sort.events.click();assert.equal(body.rows[0],alpha);assert.equal(th.attrs['aria-sort'],'ascending');
sort.events.click();assert.equal(body.rows[0],beta);assert.equal(th.attrs['aria-sort'],'descending');
theme.events.click();assert.equal(root.attrs['data-theme'],'light');
theme.events.click();assert.equal(root.attrs['data-theme'],'dark');
theme.events.click();assert.equal(root.attrs['data-theme'],undefined);
console.log('PASS: actual inline controller filtering, combined vendor search, empty/reset states, sorting, theme cycle and unavailable storage. No browser rendering tested.');
