// Builds design/preview/index.html: one offline review packet for the owner.
// Links the six batch previews, lists every proposed decision (D-entries) and every open
// question from design/decisions.md, and lets the reviewer record a verdict per item and
// copy or download the result as Markdown. Nothing is sent anywhere; drafts stay in this browser.
// Usage (from repo root): node design/tools/build_review.mjs   (also run by design/build.mjs)
import fs from "node:fs";
import path from "node:path";
import { BATCHES } from "../batches.mjs";
import { base, read, brief, crossBatchIndex } from "./load.mjs";

// Screens recorded as layout risks (dense tables / narrow columns) in SESSION_NOTES; never browser-rendered.
const LAYOUT_RISK = {
  S12: "", S17: "", S19: "", S21: "", S22: "", S24: "", S26: "", S31: "", S32: "", P48: "",
  S36: "Queue table in the narrow column", S37: "People table", S38: "Transfer table", S39: "Mapping table",
  P50: "Five-step indicator", P45: "Results split", P46: "iOS alert",
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Light inline Markdown: **bold**, *em*, `code`.
const md = (s) => esc(s).replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>").replace(/(^|[\s(])\*([^*]+)\*/g, "$1<em>$2</em>");

// ---- Parse decisions.md -------------------------------------------------------------------
const log = read("decisions.md").split("\n");
const openTable = [];
const resolved = {}; // Qid -> accepted resolution, from the "## Owner review" table
let ownerAccepted = null; // e.g. "16 Oct 2026" when the owner accepted the D-entries
let inOwner = false;
const sections = [];
let cur = null, inOpen = false;
for (let i = 0; i < log.length; i++) {
  const line = log[i];
  if (line.startsWith("## ")) { inOpen = /Open decisions/.test(line); inOwner = /Owner review/.test(line); }
  if (inOwner) {
    const h = line.match(/^### (\d+ \w+ \d{4})/);
    if (h && /accept D1–D\d+/.test(log.slice(i, i + 4).join(" "))) ownerAccepted = h[1];
    const r = line.match(/^\| (Q[\d./ Q]+?) \| [^|]+ \| (.+) \|$/);
    if (r) for (const id of r[1].split(" / ")) resolved[id.trim()] = r[2];
    continue;
  }
  if (inOpen && line.startsWith("| ") && !/^\| (Question|---)/.test(line)) {
    const [q, next, status] = line.split("|").slice(1, -1).map((c) => c.trim());
    openTable.push({ q, next, status });
  }
  if (line.startsWith("### ")) {
    const m = line.match(/Batch (\d+)/);
    cur = { heading: line.slice(4), batch: m ? `Batch ${m[1]}` : null, decisions: [], questions: [] };
    sections.push(cur);
    continue;
  }
  if (!cur) continue;
  const d = line.match(/^- \*\*(D\d+)\s+([^*]+?)\.?\*\*\s*(.*)$/);
  if (d) { cur.decisions.push({ id: d[1], title: d[2].trim(), body: d[3] }); continue; }
  if (/^Remaining questions/.test(line)) {
    const inline = line.slice(line.indexOf(":") + 1).trim();
    if (inline) cur.questions.push(...inline.split(/;\s+|(?<=[?.])\s+(?=[A-Z])/).map((q) => q.trim().replace(/^./, (c) => c.toUpperCase())).filter(Boolean));
    for (let j = i + 1; j < log.length && log[j].startsWith("- "); j++) cur.questions.push(log[j].slice(2).trim());
  }
}
const allD = sections.flatMap((s) => s.decisions);
const isAccept = (q) => /^accept/i.test(q);
const qs = sections.flatMap((s) => s.questions.filter((q) => !isAccept(q)).map((q, n) => ({ id: `${s.batch.replace("Batch ", "Q")}.${n + 1}`, batch: s.batch, q })));

// ---- Tracker summary ----------------------------------------------------------------------
function parseCsv(text) {
  const rows = []; let row = [], f = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { f += '"'; i++; } else if (c === '"') q = false; else f += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n") { row.push(f.replace(/\r$/, "")); rows.push(row); row = []; f = ""; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows;
}
const [head, ...trows] = parseCsv(read("screen_tracker.csv")).filter((r) => r.length > 1);
const col = (r, k) => r[head.indexOf(k)];
const tally = (k) => Object.entries(trows.reduce((a, r) => ((a[col(r, k)] = (a[col(r, k)] || 0) + 1), a), {}));

// ---- Page ---------------------------------------------------------------------------------
const xb = crossBatchIndex();
const tokens = read("system/tokens.css");
const built = new Date().toISOString().slice(0, 10);

const batchCards = BATCHES.map((b) => {
  const file = path.basename(b.out);
  const states = b.ids.reduce((n, id) => n + xb[id].states.length, 0);
  const sec = sections.find((s) => s.batch === b.label);
  const dr = sec && sec.decisions.length ? `${sec.decisions[0].id}–${sec.decisions.at(-1).id}` : "—";
  return `<article class="card"><header><h3>${esc(b.label)} · ${esc(b.heading || b.title)}</h3>
<p class="meta">${b.ids.length} screens · ${states} states × web + planned iPhone · decisions ${dr}</p></header>
<ul class="screens">${b.ids.map((id) => `<li><a href="${file}#${id}"><b>${id}</b> ${esc(brief(id).title)}</a>${id in LAYOUT_RISK ? ` <span class="chip" title="${esc(LAYOUT_RISK[id] || "Dense layout; check at narrow widths")}">layout risk</span>` : ""}</li>`).join("")}</ul>
<p><a class="btn" href="${file}">Open ${esc(b.label)} preview</a></p>
<label class="note">General notes on ${esc(b.label)}<textarea data-k="batch:${b.label}" rows="2"></textarea></label></article>`;
}).join("\n");

const verdicts = ["Accept", "Adjust", "Reject"];
const decisionRows = sections.filter((s) => s.decisions.length).map((s) => `<section class="dgroup"><h3>${esc(s.batch)}</h3>
${s.decisions.map((d) => `<div class="item" data-id="${d.id}"><details><summary><b>${d.id}</b> ${esc(d.title)}${ownerAccepted ? ` <span class="chip ok">Accepted ${ownerAccepted}</span>` : ""}</summary><p>${md(d.body)}</p></details>
<div class="verdict" role="radiogroup" aria-label="${d.id} verdict">${verdicts.map((v) => `<label><input type="radio" name="v-${d.id}" value="${v}" data-k="d:${d.id}">${v}</label>`).join("")}</div>
<input class="line" type="text" data-k="dn:${d.id}" aria-label="${d.id} note" placeholder="Note (optional)"></div>`).join("")}</section>`).join("\n");

const questionRows = qs.map((x) => `<div class="item"><p><b>${x.id}</b> ${md(x.q)}</p>${resolved[x.id] ? `<p class="resolved"><span class="chip ok">Resolved by owner</span> ${md(resolved[x.id])}</p>` : ""}<textarea data-k="q:${x.id}" rows="2" aria-label="Answer to ${x.id}"></textarea></div>`).join("\n");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Whiteboard Design Review</title>
<meta name="description" content="Owner review packet for all six Whiteboard design batches: previews, proposed decisions D1–${allD.at(-1).id} and open questions. Local, fictional, not accepted.">
<style>
${tokens}
*{box-sizing:border-box}
body{margin:0;background:var(--wb-bg);color:var(--wb-text);font:15px/1.5 var(--wb-font)}
main{max-width:1040px;margin:0 auto;padding:24px 16px 80px}
h1{font-size:28px;margin:0 0 4px}h2{font-size:20px;margin:40px 0 8px}h3{font-size:16.5px;margin:0}
a{color:var(--wb-accent)}:focus-visible{outline:3px solid var(--wb-focus);outline-offset:2px}
.meta{color:var(--wb-text-2);font-size:13px;margin:4px 0}
.notice{background:var(--wb-surface);border:1px solid var(--wb-border);border-left:4px solid var(--wb-accent);border-radius:10px;padding:12px 14px;margin:16px 0}
.grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
.card,.item,.stat{background:var(--wb-surface);border:1px solid color-mix(in srgb,var(--wb-border) 45%,transparent);border-radius:12px;padding:14px}
.screens{list-style:none;padding:0;margin:10px 0;display:grid;gap:2px}.screens a{text-decoration:none;color:var(--wb-text)}.screens a:hover b{color:var(--wb-accent)}
.chip{font-size:12px;font-weight:600;padding:1px 7px;border-radius:99px;background:var(--wb-fill);color:var(--wb-text-2)}
.chip.ok{background:var(--wb-accent-tint);color:var(--wb-text)}.resolved{color:var(--wb-text-2)}
.btn{display:inline-block;padding:7px 14px;border-radius:8px;background:var(--wb-accent);color:var(--wb-surface);font-weight:600;text-decoration:none;border:0;font:inherit;cursor:pointer;min-height:32px}
.btn.secondary{background:var(--wb-fill);color:var(--wb-text)}
.note{display:block;font-size:13px;color:var(--wb-text-2)}
textarea,.line{display:block;width:100%;margin-top:6px;font:inherit;color:var(--wb-text);background:var(--wb-bg);border:1px solid var(--wb-border);border-radius:8px;padding:6px 8px}
.stats{display:flex;flex-wrap:wrap;gap:12px}.stat{flex:1 1 200px}.stat ul{margin:6px 0 0;padding-left:18px}
.dgroup{margin-top:16px;display:grid;gap:8px}.item p{margin:6px 0}
summary{cursor:pointer}details p{color:var(--wb-text-2)}
.verdict{display:flex;gap:14px;flex-wrap:wrap;margin-top:8px}.verdict label{display:flex;gap:4px;align-items:center;min-height:32px}
table{width:100%;border-collapse:collapse;background:var(--wb-surface);border-radius:12px;overflow:hidden}th,td{text-align:left;padding:8px 10px;border-top:1px solid var(--wb-fill);vertical-align:top;font-size:14px}
.tablewrap{overflow-x:auto}
.bar{position:sticky;bottom:0;background:var(--wb-surface);border-top:1px solid var(--wb-border);padding:10px 16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:center}
#progress{color:var(--wb-text-2);font-size:13px}
</style></head><body><main>
<h1>Whiteboard design review</h1>
<p class="meta">Generated ${built} from design/batches.mjs, design/decisions.md and design/screen_tracker.csv by design/tools/build_review.mjs.</p>
<div class="notice"><b>What this is.</b> Fifty destinations (S01–S40 and proposed P41–P50), each drawn for web and as a planned iPhone illustration: 100 design targets. These are local design drafts with fictional data. They are not implemented features, and nothing is accepted. ${ownerAccepted ? `Every decision below was proposed by Claude. On ${ownerAccepted} the owner accepted D1–${allD.at(-1).id} and resolved the open questions to what is drawn (design/decisions.md, Owner review). The screen visuals are not yet owner-reviewed. You can still mark Adjust or Reject below to reopen an item.` : "Every decision below was proposed by Claude, and none has been reviewed by the owner."} Only static source checks have run. No browser, keyboard, screen-reader or device test has been done.</div>

<h2>How to review</h2>
<ol><li>Open each batch preview and switch states with the controls above each pair of frames. Screens tagged <span class="chip">layout risk</span> have dense tables or narrow columns, so check them at narrow web width and with larger text.</li>
<li>For each decision, mark Accept, Adjust or Reject. Answer the open questions you can.</li>
<li>Choose <b>Copy as Markdown</b> or <b>Download</b> and paste the result into the conversation. Your drafts are kept only in this browser.</li></ol>

<h2>Status</h2>
<div class="stats">${["design_status", "browser_status", "native_device_status"].map((k) => `<div class="stat"><b>${k.replace(/_/g, " ")}</b><ul>${tally(k).map(([v, n]) => `<li>${esc(v)}: ${n}</li>`).join("")}</ul></div>`).join("")}</div>

<h2>Batches</h2>
<div class="grid">${batchCards}</div>

<h2>Project-level open decisions</h2>
<div class="tablewrap"><table><thead><tr><th scope="col">Question</th><th scope="col">Next action</th><th scope="col">Status</th></tr></thead><tbody>
${openTable.map((r) => `<tr><td>${md(r.q)}</td><td>${md(r.next)}</td><td>${md(r.status)}</td></tr>`).join("")}</tbody></table></div>

<h2>Open questions (${qs.length})</h2>
<div class="dgroup">${questionRows}</div>

<h2>Proposed decisions (${allD.length})</h2>
<p class="meta">Expand an entry to read the full rationale.</p>
${decisionRows}
</main>
<div class="bar"><span id="progress" aria-live="polite"></span><button class="btn" id="copy" type="button">Copy as Markdown</button><button class="btn secondary" id="dl" type="button">Download</button></div>
<script>
const KEY="wb-review-v1";let st={};try{st=JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){}
const fields=[...document.querySelectorAll("[data-k]")];
for(const f of fields){const v=st[f.dataset.k];if(f.type==="radio")f.checked=v===f.value;else if(v)f.value=v;
f.addEventListener(f.type==="radio"?"change":"input",()=>{st[f.dataset.k]=f.value;try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}prog()})}
const D=${JSON.stringify(allD.map((d) => [d.id, d.title]))},Q=${JSON.stringify(qs.map((x) => [x.id, x.q]))},B=${JSON.stringify(BATCHES.map((b) => b.label))};
function prog(){const n=D.filter(([id])=>st["d:"+id]).length,q=Q.filter(([id])=>(st["q:"+id]||"").trim()).length;document.getElementById("progress").textContent=n+" of "+D.length+" decisions marked · "+q+" of "+Q.length+" questions answered"}
function out(){let m="# Whiteboard design review — owner feedback\\n\\n## Batch notes\\n";for(const b of B){const v=(st["batch:"+b]||"").trim();if(v)m+="- "+b+": "+v+"\\n"}
m+="\\n## Decisions\\n";for(const[id,t]of D){const v=st["d:"+id],n=(st["dn:"+id]||"").trim();if(v||n)m+="- "+id+" "+t+": "+(v||"(no verdict)")+(n?" — "+n:"")+"\\n"}
m+="\\n## Answers\\n";for(const[id,q]of Q){const a=(st["q:"+id]||"").trim();if(a)m+="- "+id+" "+q+"\\n  → "+a+"\\n"}return m}
document.getElementById("copy").onclick=async e=>{try{await navigator.clipboard.writeText(out());e.target.textContent="Copied"}catch(err){e.target.textContent="Copy blocked: use Download"}setTimeout(()=>e.target.textContent="Copy as Markdown",2500)};
document.getElementById("dl").onclick=()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([out()],{type:"text/markdown"}));a.download="whiteboard-review-feedback.md";a.click()};
prog();
</script></body></html>`;

const outPath = path.join(base, "preview", "index.html");
fs.writeFileSync(outPath, html);
console.log(`Built design/preview/index.html · ${BATCHES.length} batches · ${allD.length} decisions${ownerAccepted ? ` (owner-accepted ${ownerAccepted})` : ""} · ${qs.length} questions, ${qs.filter((x) => resolved[x.id]).length} resolved · ${openTable.length} project-level decisions`);
