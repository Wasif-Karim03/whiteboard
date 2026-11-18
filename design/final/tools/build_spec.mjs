// Phase 2c: the static spec file body (team plan Step 7). renderSpec() is pure: every input is passed in, and
// prototype links come from the loaded site's prototypeHref, so the spec never formats hashes itself.
// Sections: 63 pages (id="spec-<ID>"), 28 documents (id="doc-NN"), decisions and the fix list status.
import { esc, renderMarkdown } from "./md.mjs";

export const STATUS_COLUMNS = Object.freeze([
  ["specified", "Specified"],
  ["html_implemented", "HTML implemented"],
  ["source_checked", "Source checked"],
  ["browser_checked", "Browser checked"],
  ["accessibility_reviewed", "Accessibility reviewed"],
  ["owner_accepted", "Owner accepted"],
]);
export const FIX_COLUMNS = Object.freeze(["fix_id", "type", "severity", "pages", "decision_ref", "status", "resolution"]);
const PLATFORM_LABELS = { web: "Web", ipad: "iPad", iphone: "iPhone" };
const TIER_LABELS = { full: "Full", review: "Review and protect", handoff: "Handoff" };
const HEADER = "Whiteboard final design · Spec · fictional data · source checks only, not browser acceptance";

function checkFragment(file, html) {
  if (/<script/i.test(html)) throw new Error(`renderSpec: ${file} contains <script`);
  // Exported board fragments sit under an h2 here. Repair their outline in the output only;
  // the extracted, hash-locked source fragments remain byte-identical to the board.
  let previous = 2;
  return html.replace(/<h([1-6])(\b[^>]*)>([\s\S]*?)<\/h\1>/gi, (_, rank, attrs, text) => {
    const level = Math.max(3, Math.min(Number(rank), previous + 1));
    previous = level;
    return `<h${level}${attrs}>${text}</h${level}>`;
  });
}

const docNumber = (file) => {
  const m = /^docs\/(\d\d)-/.exec(file);
  if (!m) throw new Error(`renderSpec: document file ${file} has no NN- prefix`);
  return m[1];
};

function statusTable(page, pageRows) {
  const rows = ["web", "ipad", "iphone"].map((platform) => {
    const row = pageRows.find((r) => r.page_id === page.id && r.platform === platform);
    if (!row) throw new Error(`renderSpec: page_tracker has no ${page.id} ${platform} row`);
    const statuses = STATUS_COLUMNS.map(([key]) => `<td>${esc(row[key])}</td>`).join("");
    return `<tr><th scope="row">${PLATFORM_LABELS[platform]}</th><td>${TIER_LABELS[page.platforms[platform]]}</td>${statuses}</tr>`;
  });
  const head = ["Platform", "Tier", ...STATUS_COLUMNS.map(([, label]) => label)].map((h) => `<th scope="col">${h}</th>`).join("");
  return `<table class="wb-spec__status"><caption>Tier and tracker status by platform</caption><thead><tr>${head}</tr></thead><tbody>${rows.join("")}</tbody></table>`;
}

function pageSection(page, entry, readFragment, pageRows, prototypeHref) {
  const href = prototypeHref({ page: page.id, role: page.roles[0], opt: page.optional });
  return (
    `<section class="wb-spec__section" id="spec-${page.id}" aria-labelledby="spec-${page.id}-title">` +
    `<h2 id="spec-${page.id}-title">${esc(`${page.id} · ${page.title}`)}</h2>` +
    statusTable(page, pageRows) +
    `<p><a href="${esc(href)}">Open in prototype</a> (as ${esc(page.roles[0])})</p>` +
    `<div class="wb-spec__fragment">${checkFragment(entry.file, readFragment(entry.file))}</div></section>`
  );
}

function docSection(entry, readFragment) {
  const nn = docNumber(entry.file);
  return (
    `<section class="wb-spec__section" id="doc-${nn}" aria-labelledby="doc-${nn}-title">` +
    `<h2 id="doc-${nn}-title">${esc(`Document ${nn} · ${entry.name}`)}</h2>` +
    (entry.note ? `<p>${esc(entry.note)}</p>` : "") +
    `<div class="wb-spec__fragment">${checkFragment(entry.file, readFragment(entry.file))}</div></section>`
  );
}

function countTable(caption, rows, key) {
  const counts = new Map();
  for (const r of rows) counts.set(r[key] || "(blank)", (counts.get(r[key] || "(blank)") || 0) + 1);
  const body = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([k, n]) => `<tr><th scope="row">${esc(k)}</th><td>${n}</td></tr>`).join("");
  return `<table><caption>${esc(caption)}</caption><thead><tr><th scope="col">Value</th><th scope="col">Rows</th></tr></thead><tbody>${body}</tbody></table>`;
}

function fixSection(fixRows) {
  const head = FIX_COLUMNS.map((c) => `<th scope="col">${c}</th>`).join("");
  const body = fixRows.map((r) => `<tr>${FIX_COLUMNS.map((c) => `<td>${esc(r[c])}</td>`).join("")}</tr>`).join("\n");
  return (
    '<section class="wb-spec__section" id="fixes" aria-labelledby="fixes-title"><h2 id="fixes-title">Fix list status</h2>' +
    `<p>${fixRows.length} rows from tracker/fix_tracker.csv. The notes column is left out; read it in the CSV.</p>` +
    countTable("Rows by status", fixRows, "status") + countTable("Rows by type", fixRows, "type") +
    `<table id="fixes-table"><caption>Fix list</caption><thead><tr>${head}</tr></thead><tbody>\n${body}\n</tbody></table></section>`
  );
}

function toc(pages, docs) {
  const pageLinks = pages.map((p) => `<li><a href="#spec-${p.id}">${p.id}</a></li>`).join("");
  const docLinks = docs.map((d) => `<li><a href="#doc-${docNumber(d.file)}">${esc(docNumber(d.file) + " " + d.name)}</a></li>`).join("");
  return (
    '<nav class="wb-spec__toc" aria-labelledby="toc-title"><h2 id="toc-title">Contents</h2>' +
    `<h3>Pages</h3><ul>${pageLinks}</ul><h3>Documents</h3><ul>${docLinks}</ul>` +
    '<h3>Records</h3><ul><li><a href="#decisions">Decisions</a></li><li><a href="#fixes">Fix list status</a></li></ul></nav>'
  );
}

// index: spec/index.json entries; readFragment(file) → html; pageRows/fixRows: parsed CSV rows;
// pages: manifest pages in order; prototypeHref: WB.viewer.prototypeHref from the loaded site.
export function renderSpec({ index, readFragment, decisionsMd, fixRows, pageRows, pages, prototypeHref }) {
  const specs = new Map(index.filter((e) => e.kind === "spec").map((e) => [e.page_id, e]));
  const docs = index.filter((e) => e.kind === "document");
  const missing = pages.filter((p) => !specs.has(p.id)).map((p) => p.id);
  if (missing.length) throw new Error(`renderSpec: spec/index.json has no page entry for ${missing.join(", ")}`);
  return (
    `<div class="wb-spec"><header><h1>${esc(HEADER)}</h1></header>` + toc(pages, docs) + "<main>" +
    pages.map((p) => pageSection(p, specs.get(p.id), readFragment, pageRows, prototypeHref)).join("\n") +
    docs.map((d) => docSection(d, readFragment)).join("\n") +
    `<section class="wb-spec__section" id="decisions" aria-labelledby="decisions-title"><h2 id="decisions-title">Decisions</h2>${renderMarkdown(decisionsMd)}</section>` +
    fixSection(fixRows) + "</main></div>"
  );
}
