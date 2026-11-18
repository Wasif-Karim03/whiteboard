// Phase 2b manifest checks: pages against the route manifest, board manifest and spec index; segment, stage
// and platform tiers; navigation against doc 19; journeys and the spine; the 16 states and failure scenarios.
// Every rule is a pure function returning string[] errors; the CLI loads the real data with loadAll().
// Source checks only, not browser acceptance. Run: node design/final/tools/check_manifest.mjs
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { loadAll } from "./load_data.mjs";
import { rel, SPEC_DIR, PAGE_TRACKER, PLATFORMS } from "./schema.mjs";
import { parseCsv } from "./csv.mjs";
import { SEGMENTS, STAGES, JOURNEY_PAGES } from "./page_meta.mjs";

export const ROUTE_DOC = `${SPEC_DIR}/docs/20-route-manifest-63-routes.html`;
export const NAV_DOC = `${SPEC_DIR}/docs/19-navigation-map-navigation-json.html`;
export const STATE_IDS = Object.freeze(["loading", "firstUseEmpty", "filteredEmpty", "invalid", "saving", "saveFailed", "conflict", "offline", "permissionUnavailable", "sessionExpired", "notYetAvailable", "archived", "success", "partialSuccess", "deviceDenied", "destructive"]);
export const SPINE = Object.freeze(["W14", "W18", "W19", "W20", "W21", "W22", "W23", "W24", "W48", "W49", "W51", "W53"]);
// Doc 19 block name → manifest key.
export const NAV_BLOCKS = Object.freeze({ Global: "global", "Top Bar": "utility", "Student Course": "studentCourse", "Staff Course": "staffCourse", "Staff Tools": "staffTools", "Optional (off by default)": "optional" });
const STAFF_BANNED = ["W22", "W33", "W34"];
const list = (s) => (s ? s.split(",").map((x) => x.trim()).filter(Boolean) : []);
const sameSet = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());

export function parseRouteDoc(html) {
  const re = /<tr><td>([WO]\d\d)<\/td><td>(.*?)<\/td><td><code>(.*?)<\/code><\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><td>(.*?)<\/td><\/tr>/g;
  return [...html.matchAll(re)].map(([, id, title, route, roles, scope, priority, legacy]) => ({ id, title, route, roles: list(roles), scope, priority, legacy: list(legacy) }));
}

// {blockName: [{label, page, mode}]}; mode is the third column ("Roles / TA mode"), "" when absent.
export function parseNavDoc(html) {
  const out = {};
  for (const [, name, body] of html.matchAll(/<div class="zkh">(.*?)<\/div><table class="zt">(.*?)<\/table>/g)) {
    const rows = [...body.matchAll(/<tr>(<td>.*?)<\/tr>/g)].map(([, row]) => [...row.matchAll(/<td>(.*?)<\/td>/g)].map((m) => m[1]));
    out[name] = rows.map(([label, page, mode = ""]) => ({ label, page, mode }));
  }
  return out;
}

export function checkPages(pages, routeRows, boardIds, specIndex, WB) {
  const errors = [];
  if (pages.length !== 63) errors.push(`pages: ${pages.length} pages, expected 63`);
  const dup = (key) => pages.map((p) => p[key]).filter((v, i, a) => a.indexOf(v) !== i);
  for (const v of dup("id")) errors.push(`pages: duplicate id ${v}`);
  for (const v of dup("route")) errors.push(`pages: duplicate route ${v}`);
  if (!sameSet(pages.map((p) => p.id), boardIds)) errors.push("pages: id set differs from spec/board_manifest.json");
  const rows = new Map(routeRows.map((r) => [r.id, r]));
  const specFiles = new Map(specIndex.filter((e) => e.kind === "spec" && e.page_id).map((e) => [e.page_id, e.file]));
  for (const p of pages) {
    const r = rows.get(p.id);
    if (!r) { errors.push(`pages: ${p.id} is not in doc 20`); continue; }
    for (const key of ["title", "route", "scope", "priority"]) if (p[key] !== r[key]) errors.push(`pages: ${p.id} ${key} '${p[key]}' differs from doc 20 '${r[key]}'`);
    if (!sameSet(p.roles, r.roles)) errors.push(`pages: ${p.id} roles differ from doc 20`);
    if (!sameSet(p.legacy, r.legacy)) errors.push(`pages: ${p.id} legacy differs from doc 20`);
    for (const role of p.roles) if (!WB.ROLES.includes(role)) errors.push(`pages: ${p.id} has unknown role ${role}`);
    if (p.spec !== `${SPEC_DIR.replace("design/final/", "")}/${specFiles.get(p.id)}`) errors.push(`pages: ${p.id} spec '${p.spec}' does not match spec/index.json`);
    else if (!fs.existsSync(rel("design/final", p.spec))) errors.push(`pages: ${p.id} spec file ${p.spec} is missing`);
    if (p.optional !== p.id.startsWith("O")) errors.push(`pages: ${p.id} optional flag is wrong`);
  }
  return errors;
}

export function checkMeta(pages, segments, stages, trackerRows) {
  const errors = [];
  for (const p of pages) {
    if (p.segment !== segments[p.id]) errors.push(`meta: ${p.id} segment ${p.segment}, page_meta says ${segments[p.id]}`);
    if (p.stage !== stages[p.id]) errors.push(`meta: ${p.id} stage ${p.stage}, page_meta says ${stages[p.id]}`);
    for (const platform of PLATFORMS) {
      const row = trackerRows.find((r) => r.page_id === p.id && r.platform === platform);
      if (!row) errors.push(`meta: ${p.id} ${platform} has no tracker row`);
      else if (p.platforms?.[platform] !== row.tier) errors.push(`meta: ${p.id} ${platform} tier ${p.platforms?.[platform]}, tracker says ${row.tier}`);
    }
  }
  return errors;
}

export function checkNavigation(nav, navDoc, pagesById, WB) {
  const errors = [];
  for (const [block, key] of Object.entries(NAV_BLOCKS)) {
    const want = navDoc[block];
    const got = nav[key] || [];
    if (!want) { errors.push(`navigation: doc 19 has no block '${block}'`); continue; }
    const norm = (e) => [e.label, e.page];
    if (JSON.stringify(got.map(norm)) !== JSON.stringify(want.map(norm))) errors.push(`navigation: ${key} differs from doc 19 '${block}'`);
    if (key === "staffCourse" || key === "staffTools") {
      want.forEach((w, i) => { if (got[i] && got[i].taMode !== w.mode) errors.push(`navigation: ${key} ${w.page} taMode '${got[i].taMode}' differs from doc 19 '${w.mode}'`); });
    }
    if (key === "global" || key === "utility") {
      want.forEach((w, i) => { if (got[i] && !sameSet(got[i].roles || [], list(w.mode))) errors.push(`navigation: ${key} ${w.page} roles differ from doc 19`); });
    }
  }
  const all = Object.entries(nav).filter(([k, v]) => Array.isArray(v)).flatMap(([k, v]) => v.map((e) => ({ block: k, ...e })));
  for (const e of all) if (!pagesById[e.page]) errors.push(`navigation: ${e.block} '${e.id}' targets unknown page ${e.page}`);
  if (!sameSet((nav.global || []).map((e) => e.id), WB.NAV_GLOBAL.map((e) => e.id))) errors.push("navigation: global ids differ from WB.NAV_GLOBAL");
  if (!sameSet((nav.utility || []).map((e) => e.id), WB.NAV_UTILITY.map((e) => e.id))) errors.push("navigation: utility ids differ from WB.NAV_UTILITY");
  const ids = [...WB.NAV_GLOBAL, ...WB.NAV_UTILITY].map((e) => e.id);
  for (const id of ids) {
    const href = nav.hrefs?.[id];
    if (!href) { errors.push(`navigation: hrefs.${id} is missing`); continue; }
    try { WB.safeHref(href, "navigation"); } catch (err) { errors.push(`navigation: hrefs.${id} fails the kit link policy (${err.message})`); }
    if (!/^#\/[WO]\d\d$/.test(href) || !pagesById[href.slice(2)]) errors.push(`navigation: hrefs.${id} '${href}' is not a page route`);
    const entry = all.find((e) => (e.block === "global" || e.block === "utility") && e.id === id);
    if (entry && href !== `#/${entry.page}`) errors.push(`navigation: hrefs.${id} '${href}' differs from its entry page ${entry.page}`);
  }
  for (const e of all.filter((x) => ["staffCourse", "staffTools", "extras"].includes(x.block))) if (STAFF_BANNED.includes(e.page)) errors.push(`navigation: staff entry '${e.id}' targets ${e.page} (BD8, BD38)`);
  for (const e of WB.sel.staffTools("ta")) if (e.taMode === "no_access_default") errors.push(`navigation: TA staff tools include ${e.page} (no_access_default, BD26)`);
  for (const e of nav.extras || []) {
    if (e.source !== "BD26") errors.push(`navigation: extra '${e.id}' lacks source BD26`);
    if (!sameSet(e.roles || [], ["instructor"])) errors.push(`navigation: extra '${e.id}' is not instructor-only`);
  }
  return errors;
}

// scenarioIds and anchors (Phase 2 gate M7): each step's scenario is a clock id and a token is a variant of
// that page in manifest/anchors.js.
export function checkJourneys(journeys, spine, journeyPages, pagesById, scenarioIds, anchors) {
  const errors = [];
  const ids = journeys.map((j) => j.id);
  if (JSON.stringify(ids) !== JSON.stringify(Object.keys(journeyPages))) errors.push(`journeys: ids ${ids.join(",")} differ from J01–J12`);
  for (const j of journeys) {
    const want = journeyPages[j.id] || [];
    if (JSON.stringify(j.steps.map((s) => s.page)) !== JSON.stringify(want)) errors.push(`journeys: ${j.id} steps differ from page_meta JOURNEY_PAGES`);
    if (!j.title) errors.push(`journeys: ${j.id} has no title`);
    for (const s of j.steps) {
      const page = pagesById[s.page];
      if (!page) errors.push(`journeys: ${j.id} step ${s.page} does not resolve`);
      else if (!page.roles.includes(s.role)) errors.push(`journeys: ${j.id} step ${s.page} role ${s.role} is not allowed on that page`);
      if (!scenarioIds.includes(s.scenario)) errors.push(`journeys: ${j.id} step ${s.page} scenario '${s.scenario}' is not a scenario`);
      if (s.token !== null && !Object.hasOwn(anchors[s.page]?.variants || {}, s.token)) errors.push(`journeys: ${j.id} step ${s.page} token '${s.token}' is not a variant of that page`);
    }
  }
  if (JSON.stringify(spine) !== JSON.stringify(SPINE)) errors.push("journeys: spine differs from the 12-page J02→J03 list");
  for (const id of spine) {
    const page = pagesById[id];
    if (!page) errors.push(`journeys: spine page ${id} does not resolve`);
    else for (const platform of PLATFORMS) if (!page.platforms?.[platform]) errors.push(`journeys: spine page ${id} lacks ${platform}`);
  }
  return errors;
}

// M7: anchor pages resolve, homes are scenarios, variant ids are well formed and never a state id, labels
// are non-empty.
export function checkAnchors(anchors, pagesById, scenarioIds, stateIds) {
  const errors = [];
  for (const [pageId, a] of Object.entries(anchors)) {
    if (!pagesById[pageId]) errors.push(`anchors: page ${pageId} does not resolve`);
    if (!scenarioIds.includes(a.home)) errors.push(`anchors: ${pageId} home '${a.home}' is not a scenario`);
    if (a.record !== null && (!a.record?.type || !a.record?.id)) errors.push(`anchors: ${pageId} record needs a type and an id`);
    for (const [id, v] of Object.entries(a.variants)) {
      if (!/^[a-z][a-z0-9-]*$/.test(id)) errors.push(`anchors: ${pageId} variant '${id}' is not a lower-case id`);
      if (stateIds.includes(id)) errors.push(`anchors: ${pageId} variant '${id}' is a state id`);
      if (!v.label || !String(v.label).trim()) errors.push(`anchors: ${pageId} variant '${id}' has no label`);
      if (!scenarioIds.includes(v.home)) errors.push(`anchors: ${pageId} variant '${id}' home '${v.home}' is not a scenario`);
      if (!v.record?.type || !v.record?.id) errors.push(`anchors: ${pageId} variant '${id}' record needs a type and an id`);
    }
  }
  return errors;
}

export function checkStates(states, failures, pagesById, WB) {
  const errors = [];
  const ids = states.map((s) => s.id);
  if (states.length !== 16) errors.push(`states: ${states.length} states, expected 16`);
  if (new Set(ids).size !== ids.length) errors.push("states: duplicate ids");
  if (JSON.stringify(ids) !== JSON.stringify(STATE_IDS)) errors.push("states: ids or order differ from the spec list");
  for (const s of states) {
    if (!s.label || !s.rule || !s.source) errors.push(`states: ${s.id} lacks label, rule or source`);
    if (s.saveState !== undefined && !Object.hasOwn(WB.SAVE_STATES, s.saveState)) errors.push(`states: ${s.id} saveState '${s.saveState}' is not a WB.SAVE_STATES key`);
  }
  if (failures.length !== 17) errors.push(`states: ${failures.length} failure scenarios, expected 17`);
  for (const f of failures) {
    if (!ids.includes(f.state)) errors.push(`states: failure ${f.id} state '${f.state}' is not a state id`);
    if (!f.pages.length) errors.push(`states: failure ${f.id} lists no pages`);
    for (const p of f.pages) if (!pagesById[p]) errors.push(`states: failure ${f.id} page ${p} does not resolve`);
  }
  return errors;
}

const readText = (p) => fs.readFileSync(rel(p), "utf8");

export function loadSources() {
  return {
    routeRows: parseRouteDoc(readText(ROUTE_DOC)),
    navDoc: parseNavDoc(readText(NAV_DOC)),
    boardIds: JSON.parse(readText(`${SPEC_DIR}/board_manifest.json`)).pages.map((p) => p.id),
    specIndex: JSON.parse(readText(`${SPEC_DIR}/index.json`)),
    trackerRows: parseCsv(readText(PAGE_TRACKER)).rows,
  };
}

export function checkAll(WB, src = loadSources()) {
  const m = WB.manifest;
  return [
    ...checkPages(m.pages, src.routeRows, src.boardIds, src.specIndex, WB),
    ...checkMeta(m.pages, SEGMENTS, STAGES, src.trackerRows),
    ...checkNavigation(m.navigation, src.navDoc, m.pagesById, WB),
    ...checkJourneys(m.journeys, m.spine, JOURNEY_PAGES, m.pagesById, Object.keys(WB.data.scenarios.clocks), m.anchors),
    ...checkAnchors(m.anchors, m.pagesById, Object.keys(WB.data.scenarios.clocks), m.states.map((x) => x.id)),
    ...checkStates(m.states, WB.data.scenarios.failures, m.pagesById, WB),
  ];
}

function main() {
  const errors = checkAll(loadAll());
  for (const e of errors) console.log(e);
  console.log(`check_manifest: ${errors.length} errors. Source checks only.`);
  return errors.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
