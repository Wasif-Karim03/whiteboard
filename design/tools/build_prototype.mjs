// Builds the click-through prototype: design/prototype/Whiteboard-Prototype.html (one offline file).
// It loads every batch's kit and screen sources into one page (verified to render identically to the
// batch previews), adds a role picker, guided tours and a Web/iPhone switch, and follows each control's
// data-go link. Usage (from repo root): node design/tools/build_prototype.mjs   (also run by design/build.mjs)
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { BATCHES } from "../batches.mjs";
import { base, read, screens, routes } from "./load.mjs";
import { ROLES, TOURS, SCREEN_ROLE } from "../prototype/roles.mjs";

const files = [...new Set(BATCHES.flatMap((b) => b.js))].filter((f) => !f.endsWith("spec.js"));
const order = [...files.filter((f) => /\/kit\d?\.js$/.test(f)), ...files.filter((f) => !/\/kit\d?\.js$/.test(f))];
const MAP = { screens, edges: routes.edges, journeys: routes.journeys, xb: {} };

// ---- Check the combined page and the tours in Node before writing anything ----
const sb = { window: { MAP } };
vm.createContext(sb);
for (const f of order) vm.runInContext(read(f), sb, { filename: f });
const K = sb.window.K;
const errors = [], gaps = [];
const has = (go) => { const [id, st] = go.split(":"); return K.screens[id] && K.screens[id].states.some((s) => s[0] === st); };
for (const r of ROLES) {
  if (!has(r.home)) errors.push(`role ${r.key}: home ${r.home} is not a designed state`);
  for (const t of r.tours) if (!TOURS[t]) errors.push(`role ${r.key}: unknown tour ${t}`);
}
const mapped = Object.values(SCREEN_ROLE).flat();
for (const id of K.order) if (!mapped.includes(id)) errors.push(`screen ${id} has no role in SCREEN_ROLE`);
let links = 0;
for (const [key, t] of Object.entries(TOURS)) {
  t.steps.forEach(([go, , as], i) => {
    if (!has(go)) errors.push(`tour ${key} step ${i + 1}: ${go} is not a designed state`);
    if (as && !ROLES.some((r) => r.key === as)) errors.push(`tour ${key} step ${i + 1}: unknown role ${as}`);
    if (i === 0 || !has(go) || !has(t.steps[i - 1][0])) return;
    const [pid, pst] = t.steps[i - 1][0].split(":");
    const prev = K.screens[pid].web(pst) + K.screens[pid].ios(pst);
    const [id] = go.split(":");
    if (prev.includes(`data-go="${go}"`) || (pid !== id && prev.includes(`data-go="${id}:`))) links++;
    else gaps.push(`${key} ${i}→${i + 1}: ${t.steps[i - 1][0]} → ${go}`);
  });
}
if (errors.length) { console.error("Prototype build failed:\n  " + errors.join("\n  ")); process.exit(1); }

// ---- Page ----
const css = ["system/tokens.css", "system/components.css", "prototype/proto.css"].map((f) => read(f)).join("\n");
const js = order.map((f) => `/* ${f} */\n${read(f)}`).join("\n");
const PROTO = { roles: ROLES, tours: TOURS, screenRole: SCREEN_ROLE };
const json = (o) => JSON.stringify(o).replace(/</g, "\\u003c");
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Whiteboard prototype</title>
<meta name="description" content="Click-through prototype of Whiteboard for a fictional college: eight roles, guided tours, web and planned iPhone. Fictional data; not a working product.">
<style>
${css}
</style>
</head>
<body>
<header class="pt-bar" id="pt-bar" hidden>
  <button type="button" class="pt-brand" data-act="home" aria-label="Whiteboard prototype: all roles"><i aria-hidden="true"></i><span>Whiteboard</span></button>
  <span class="pt-chip pt-hide-m">Prototype · fictional data</span>
  <div class="pt-dd"><button type="button" class="pt-btn" data-act="menu-roles" aria-haspopup="true" aria-expanded="false" aria-controls="pt-m-roles"><span id="pt-role">Role</span><span class="caret" aria-hidden="true">▼</span></button><div class="pt-menu" id="pt-m-roles" hidden></div></div>
  <div class="pt-dd"><button type="button" class="pt-btn" data-act="menu-tours" aria-haspopup="true" aria-expanded="false" aria-controls="pt-m-tours">Tours<span class="caret" aria-hidden="true">▼</span></button><div class="pt-menu" id="pt-m-tours" hidden></div></div>
  <div class="pt-where" id="pt-where" aria-live="polite"></div>
  <div class="pt-dd right"><button type="button" class="pt-btn" data-act="menu-states" aria-haspopup="true" aria-expanded="false" aria-controls="pt-m-states"><span class="pt-hide-m">Other situations</span><span aria-hidden="true">⋯</span></button><div class="pt-menu" id="pt-m-states" hidden></div></div>
  <div class="pt-seg" role="group" aria-label="Platform"><button type="button" data-act="platform" data-platform="web" aria-pressed="true">Web</button><button type="button" data-act="platform" data-platform="ios" aria-pressed="false">iPhone</button></div>
  <button type="button" class="pt-btn pt-icon pt-hide-m" data-act="text" aria-pressed="false" aria-label="Larger text">A<small>A</small></button>
  <button type="button" class="pt-btn pt-icon pt-hide-m" data-act="theme" aria-label="Switch light or dark">◐</button>
</header>
<main id="pt-view" tabindex="-1"></main>
<div class="pt-tour" id="pt-tour" role="region" aria-label="Guided tour" hidden></div>
<div class="pt-toast" id="pt-toast" role="status" aria-live="polite"></div>
<script>window.MAP=${json(MAP)};window.PROTO=${json(PROTO)};</script>
<script>
${js}
</script>
<script>
${read("prototype/proto.js")}
</script>
</body>
</html>
`;
const out = path.join(base, "prototype", "Whiteboard-Prototype.html");
fs.writeFileSync(out, html);
const steps = Object.values(TOURS).reduce((n, t) => n + t.steps.length, 0);
console.log(`Built design/prototype/Whiteboard-Prototype.html · ${(html.length / 1024).toFixed(0)} KB · ${K.order.length} screens · ${ROLES.length} roles · ${Object.keys(TOURS).length} tours, ${steps} steps (${links} reachable by a click, ${gaps.length} via Next only)`);
if (process.argv.includes("--gaps")) console.log("  " + gaps.join("\n  "));
