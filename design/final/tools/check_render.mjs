// Phase 2c render check (team plan Step 8): renders every manifest page × the five WB.CONTEXTS × the page's
// roles × the default view, each applicable state and each variant (scenario "default"), plus every scenario
// for each page's default view on web regular with the first role. Every render must pass checkHtml, carry
// its frame class, one <main> (and one <h1> unless access mode) and the handoff block on non-full tiers.
// Source checks only, not browser acceptance.
// Run: node design/final/tools/check_render.mjs
import { pathToFileURL } from "node:url";
import { loadSite } from "./load_site.mjs";
import { checkHtml } from "./html_check.mjs";

export const EXPECTED_TARGETS = 189;
const count = (html, re) => (html.match(re) || []).length;

// Viewer and board chrome ids written by build.mjs page templates (appHtml, boardHtml).
export const CHROME_IDS = ["v-bar", "v-tour", "v-status", "v-stage", "b-root"];
const idsIn = (html) => [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);

// Problems across the composed page parts (bar, then the frame last) plus the chrome ids: a duplicate id in
// any part, or a frame id in the viewer (v-) or board (b-) namespace.
export function composedIdProblems(parts) {
  const all = [...parts.flatMap(idsIn), ...CHROME_IDS];
  const seen = new Map();
  for (const id of all) seen.set(id, (seen.get(id) || 0) + 1);
  const problems = [...seen].filter(([, n]) => n > 1).map(([id]) => `duplicate id "${id}"`);
  const viewerIds = [...new Set(idsIn(parts[parts.length - 1]).filter((id) => /^[vb]-/.test(id)))];
  return [...problems, ...viewerIds.map((id) => `frame id "${id}" uses a viewer namespace`)];
}

function ctxView(WB, c) {
  return { platform: c.platform, width: c.width || "regular", orientation: c.orientation || "landscape" };
}

// [{page, context, role, token, scenario}] for every render the check makes.
export function renderTargets(WB) {
  const out = [];
  for (const id of WB.pageIds()) {
    const entry = WB.pageFor(id);
    const tokens = [null, ...entry.states, ...Object.keys(entry.variants)];
    for (const c of WB.CONTEXTS) for (const role of entry.page.roles) for (const token of tokens) out.push({ page: id, context: c, role, token, scenario: "default" });
    for (const scenario of WB.sel.scenarioIds()) if (scenario !== "default") out.push({ page: id, context: WB.CONTEXTS[0], role: entry.page.roles[0], token: null, scenario });
  }
  return out;
}

export function frameProblems(html, platform, tier) {
  const problems = [...checkHtml(html)];
  let previousHeading = 0;
  for (const m of html.matchAll(/<h([1-6])\b/g)) {
    const rank = Number(m[1]);
    if (rank > previousHeading + 1) problems.push(`heading skips h${previousHeading} to h${rank}`);
    previousHeading = rank;
  }
  for (const bad of ["undefined", "NaN", "[object"]) if (html.includes(bad)) problems.push(`contains "${bad}"`);
  const mains = count(html, /<main[\s>]/g);
  const access = html.includes('data-mode="access"');
  if (mains !== 1) problems.push(`${mains} <main> elements`);
  if (!access && count(html, /<h1[\s>]/g) !== 1) problems.push(`${count(html, /<h1[\s>]/g)} <h1> elements`);
  if (!html.includes(`wb-frame--${platform}`)) problems.push(`missing wb-frame--${platform}`);
  if (tier !== "full" && !html.includes(`wb-handoff--${tier}`)) problems.push(`missing wb-handoff--${tier}`);
  return problems;
}

function viewState(WB, t) {
  return WB.viewer.normalize(WB, { ...WB.viewer.DEFAULTS, ...ctxView(WB, t.context), page: t.page, role: t.role, token: t.token, scenario: t.scenario }).vs;
}

function render(WB, t, vs = viewState(WB, t)) {
  return WB.viewer.renderFrame(WB, vs);
}

const label = (t) => `${t.page} ${t.context.name} ${t.role} ${t.token || "default"} ${t.scenario}`;

// M7: every variant manifest/anchors.js lists for a page is declared by that page's entry.
export function anchorVariantProblems(WB) {
  const errors = [];
  for (const [pageId, a] of Object.entries(WB.manifest.anchors)) {
    const entry = WB.pageFor(pageId);
    for (const v of Object.keys(a.variants)) if (!Object.hasOwn(entry.variants, v)) errors.push(`render: ${pageId} does not declare variant '${v}'`);
  }
  return errors;
}

export function checkRender(WB) {
  const errors = [];
  const targets = new Set();
  const firsts = new Map();
  let renders = 0;
  for (const t of renderTargets(WB)) {
    try {
      const vs = viewState(WB, t);
      const frame = render(WB, t, vs);
      renders += 1;
      for (const p of frameProblems(frame.html, t.context.platform, frame.tier)) errors.push(`render: ${label(t)}: ${p}`);
      const bar = WB.viewer.renderBar(WB, vs, { pendingJourney: "" });
      for (const p of composedIdProblems([bar, frame.html])) errors.push(`render: ${label(t)}: ${p}`);
      targets.add(`${t.page}/${t.context.platform}`);
      if (!firsts.has(t.page)) firsts.set(t.page, [t, frame.html]);
    } catch (err) {
      errors.push(`render: ${label(t)} threw: ${err.message}`);
    }
  }
  for (const [, [t, html]] of firsts) if (render(WB, t).html !== html) errors.push(`render: ${label(t)} is not deterministic`);
  errors.push(...anchorVariantProblems(WB));
  if (targets.size !== EXPECTED_TARGETS) errors.push(`render: ${targets.size}/${EXPECTED_TARGETS} page×platform targets`);
  return { renders, targets, errors };
}

function main() {
  const { renders, targets, errors } = checkRender(loadSite());
  for (const e of errors.slice(0, 50)) console.log(e);
  console.log(`check_render: ${renders} renders, ${targets.size}/${EXPECTED_TARGETS} page×platform targets, ${errors.length} errors. Source checks only.`);
  return errors.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
