// Static source checks for a design batch. Renders every screen × state × platform in Node.
// Validates structure and map/route coverage only. NOT a browser, keyboard, screen-reader or device test.
// Usage (from repo root): node design/tools/check_batch.mjs batch02   (or no argument for all batches)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { contrastReport, ratio } from "./contrast.mjs";
import { BATCHES, SHARED_CSS } from "../batches.mjs";
import { base, read, screens, routes, brief, crossBatchIndex, mapFor, runBatch } from "./load.mjs";

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr", "path", "circle", "rect", "use", "stop"]);
// Fixed (non-token) colour pairs used by batch components: preview bar, institution logos, staff avatar.
const LITERAL_PAIRS = [["#ffffff", "#3b2f6b", "preview bar text"], ["#3b2f6b", "#ffffff", "preview bar button"], ["#ffffff", "#23465a", "institution mark"], ["#ffffff", "#6a4b2a", "alternate institution mark"], ["#3b2f6b", "#e4e0f2", "staff avatar"], ["#134447", "#d7e7e8", "student avatar"], ["#0a66d8", "#f7f8f8", "system sheet button"]];

export function checkBatch(b, xb) {
  const MAP = mapFor(b, xb);
  const { K, sandbox } = runBatch(b, { ...MAP, screens, edges: routes.edges });
  const fails = [];
  const fail = (m) => fails.push(m);
  const BATCH = b.ids;

  function checkHtml(html, where) {
    const stack = [];
    for (const m of html.matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g)) {
      const [, close, tagRaw, , self] = m;
      const tag = tagRaw.toLowerCase();
      if (self || VOID.has(tag)) continue;
      if (!close) stack.push(tag);
      else if (stack.pop() !== tag) { fail(`${where}: unbalanced </${tag}>`); return []; }
    }
    if (stack.length) fail(`${where}: unclosed <${stack.join(",")}>`);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
    if (dup.length) fail(`${where}: duplicate id ${[...new Set(dup)]}`);
    for (const m of html.matchAll(/\s(?:for|aria-labelledby|aria-describedby|aria-controls|data-focus)="([^"]+)"/g))
      for (const ref of m[1].split(/\s+/)) if (!ids.includes(ref)) fail(`${where}: missing reference target #${ref}`);
    for (const m of html.matchAll(/<(button|a)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
      const text = m[3].replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<[^>]+>/g, "").trim();
      if (!text && !/aria-label(?:ledby)?="[^"]+"/.test(m[2])) fail(`${where}: unnamed <${m[1]}>`);
    }
    for (const m of html.matchAll(/<(select|input|textarea)\b([^>]*)>/g)) {
      const id = /id="([^"]+)"/.exec(m[2])?.[1];
      if (!id || !html.includes(`for="${id}"`)) if (!/aria-label=/.test(m[2])) fail(`${where}: unlabelled <${m[1]}>`);
    }
    for (const m of html.matchAll(/role="switch"([^>]*)>/g)) if (!/aria-checked=/.test(m[1]) || !/aria-label(?:ledby)?=/.test(m[1])) fail(`${where}: switch lacks state or label`);
    for (const m of html.matchAll(/role="progressbar"([^>]*)>/g)) if (!/aria-valuenow=/.test(m[1]) || !/aria-label=/.test(m[1])) fail(`${where}: progressbar lacks value or label`);
    const gos = [...html.matchAll(/data-go="([^"]+)"/g)].map((m) => m[1]);
    for (const g of gos) {
      const [id, st] = g.split(":");
      const def = K.screens[id];
      if (def) { if (!def.states.some((s) => s[0] === st)) fail(`${where}: data-go to unknown state ${g}`); }
      else if (xb[id]) { if (!xb[id].states.includes(st)) fail(`${where}: cross-batch data-go to unknown state ${g}`); }
      else fail(`${where}: data-go to undesigned screen ${g}`);
    }
    if (/\s(?:src|href)="https?:/.test(html)) fail(`${where}: network asset/link`);
    return gos;
  }

  let renders = 0;
  const goesFrom = Object.fromEntries(BATCH.map((id) => [id, new Set()]));
  // Role handoffs (e.g. student S08 → staff S17) are explained in words, never linked: data-handoff="S17".
  const handoffFrom = Object.fromEntries(BATCH.map((id) => [id, new Set()]));
  if (K.order.join() !== BATCH.join()) fail("registry order " + K.order.join());
  for (const id of BATCH) {
    const def = K.screens[id], m = brief(id);
    if (!def) { fail(`${id} not registered`); continue; }
    m.states.forEach((s, i) => { if (!def.states.some((x) => x[2] === i)) fail(`${id}: map state not designed — ${s}`); });
    for (const [st, , mi, why] of def.states) {
      if (mi == null && !why) fail(`${id}:${st} added state lacks a reason`);
      if (!def.notes[st]?.web || !def.notes[st]?.ios) fail(`${id}:${st} missing web/iOS design note`);
      const w = def.web(st), i = def.ios(st);
      renders += 2;
      if (!/^<div class="wb w-app/.test(w)) fail(`${id}:${st} web not wrapped in web shell`);
      if (!/^<div class="wb i-app"/.test(i)) fail(`${id}:${st} iOS not wrapped in iOS shell`);
      if ((w.match(/<h1[\s>]/g) || []).length !== 1 && !/role="dialog"/.test(w)) fail(`${id}:${st} web should have exactly one h1`);
      if (m.status === "proposed" && /Concept · web/.test(w)) fail(`${id}:${st} proposed screen labelled as concept`);
      for (const g of [...checkHtml(w, `${id}:${st}:web`), ...checkHtml(i, `${id}:${st}:ios`)]) goesFrom[id].add(g.split(":")[0]);
      checkHtml(w + i, `${id}:${st}:pair`);
      for (const m of (w + i).matchAll(/data-handoff="([^"]+)"/g)) handoffFrom[id].add(m[1]);
      sandbox.window.PV.notes(id, st);
    }
  }
  // Every edge from a batch screen to a designed screen (this batch or an earlier one) has a control.
  const designed = (x) => BATCH.includes(x) || xb[x];
  const edges = routes.edges.filter((e) => BATCH.includes(e.source) && designed(e.target) && e.source !== e.target);
  for (const e of edges.filter((e) => !goesFrom[e.source].has(e.target) && !(e.handoff && handoffFrom[e.source].has(e.target)))) fail(`route ${e.source}→${e.target} “${e.label}” has no control${e.handoff ? " or handoff explanation" : ""} in ${e.source}`);
  // Edges to not-yet-designed screens are named in preview notes.
  const external = routes.edges.filter((e) => BATCH.includes(e.source) && !designed(e.target));
  const srcText = b.js.map((f) => read(f)).join("\n");
  for (const e of external) if (!srcText.includes(e.target)) fail(`route ${e.source}→${e.target} not referenced`);

  const contrast = contrastReport(path.join(base, "system/tokens.css"));
  for (const r of contrast.filter((x) => !x.pass)) fail(`contrast ${r.theme} ${r.fg}/${r.bg} ${r.ratio} < ${r.min}`);
  const literal = LITERAL_PAIRS.map(([fg, bg, use]) => ({ fg, bg, use, ratio: +ratio(fg, bg).toFixed(2) }));
  for (const r of literal) if (r.ratio < 4.5) fail(`literal contrast ${r.use} ${r.fg}/${r.bg} ${r.ratio} < 4.5`);

  // Built preview exists, is current and self-contained.
  const built = path.join(base, b.out);
  const html = fs.readFileSync(built, "utf8");
  if (/<(?:script|link|img)[^>]+(?:src|href)="(?!#|data:)/.test(html)) fail("preview loads an external asset");
  const markup = html.replace(/<script>[\s\S]*?<\/script>/g, "");
  const builtIds = [...markup.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  if (builtIds.length !== new Set(builtIds).size) fail("preview has duplicate ids in static render");
  for (const m of markup.matchAll(/href="#([A-Za-z][\w-]*)(?::[\w-]+)?"/g)) if (!builtIds.includes(m[1])) fail(`preview anchor #${m[1]} missing`);
  for (const m of markup.matchAll(/href="([\w-]+\.html)#?([\w:-]*)"/g)) if (!BATCHES.some((o) => path.basename(o.out) === m[1])) fail(`preview links to unknown page ${m[1]}`);
  const srcs = [...SHARED_CSS, ...b.js, "batch01/preview.js", "build.mjs", "batches.mjs", "tools/load.mjs"];
  const srcNewest = Math.max(...srcs.map((f) => fs.statSync(path.join(base, f)).mtimeMs));
  if (fs.statSync(built).mtimeMs < srcNewest) fail("preview is older than its sources — run node design/build.mjs");

  const result = {
    checked_at: new Date().toISOString(),
    batch: b.key,
    scope: "Static source/structure checks only. No browser, keyboard, screen-reader, rendered-contrast or device test was run.",
    screens: BATCH.length,
    design_states: K.order.reduce((n, id) => n + K.screens[id].states.length, 0),
    renders,
    map_states_covered: BATCH.reduce((n, id) => n + brief(id).states.length, 0),
    routes_with_controls: edges.length,
    routes_to_later_batches_referenced: external.length,
    contrast_pairs: contrast.length + literal.length,
    contrast_min_text: Math.min(...contrast.filter((r) => r.min === 4.5).map((r) => r.ratio), ...literal.map((r) => r.ratio)),
    failures: fails,
  };
  fs.writeFileSync(path.join(base, b.verification), JSON.stringify(result, null, 2) + "\n");
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const only = process.argv[2];
  const xb = crossBatchIndex();
  let bad = 0;
  for (const b of BATCHES.filter((x) => !only || x.key === only)) {
    const r = checkBatch(b, xb);
    if (r.failures.length) { bad++; console.error(`${b.label}: ${r.failures.length} failure(s)\n` + r.failures.slice(0, 40).join("\n")); }
    else console.log(`${b.label} static checks passed: ${r.screens} screens, ${r.design_states} states, ${r.renders} renders, ${r.map_states_covered} map states covered, ${r.routes_with_controls} routes with controls + ${r.routes_to_later_batches_referenced} to later batches referenced, ${r.contrast_pairs} contrast pairs (min text ${r.contrast_min_text}:1). No browser/device test run.`);
  }
  process.exit(bad ? 1 : 0);
}
