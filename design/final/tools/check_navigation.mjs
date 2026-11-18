// Phase 4 navigation proof. Source checks only; no DOM/browser acceptance.
import { pathToFileURL } from "node:url";
import { loadSite } from "./load_site.mjs";

const PLATFORMS = ["web", "ipad", "iphone"];
const CONTEXTS = ["web-regular", "web-narrow", "ipad-landscape", "ipad-portrait", "iphone"];
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
export const dataGos = (html) => [...html.matchAll(/\bdata-go="([^"]+)"/g)].map((m) => decode(m[1]));
function pageLinks(html, errors, where) {
  const out = [];
  for (const m of html.matchAll(/<a\b[^>]*>/g)) {
    const tag = m[0], go = /\bdata-go="([^"]+)"/.exec(tag), href = /\bhref="([^"]+)"/.exec(tag);
    if (go) {
      const value = decode(go[1]);
      if (!href || decode(href[1]) !== `#/${value}`) errors.push(`${where}: data-go/href mismatch for ${value}`);
      out.push(value);
    } else if (href && decode(href[1]).startsWith("#/")) out.push(decode(href[1]).slice(2));
  }
  return out;
}
const hrefs = (html) => [...html.matchAll(/\bhref="([^"]+)"/g)].map((m) => decode(m[1]));
const state = (W, over) => W.viewer.normalize(W, { ...W.viewer.DEFAULTS, ...over, opt: true }).vs;
const label = (v) => [v.page, v.platform, v.width, v.orientation, v.role, v.scenario, v.token || "default", JSON.stringify(v.selection || null)].join("/");
const sameStep = (v, s) => v.page === s.page && v.role === s.role && v.scenario === s.scenario && v.token === (s.token || null);
const noPlaceholder = (W, frame, page, errors, where) => {
  if (W.pageFor(page).placeholder || /This page is a placeholder|Not built yet/.test(frame.html)) errors.push(`${where}: placeholder ${page}`);
};
function validateDestination(W, current, go, errors, cache) {
  const where = `links: ${label(current)} -> ${go}`;
  if (!/^[WO]\d\d(?::[A-Za-z0-9_.-]+)?(?:~[A-Za-z0-9_.-]+)?(?:\?(?:tc|ta|tl|tr)=[A-Za-z0-9_-]*(?:&(?:tc|ta|tl|tr)=[A-Za-z0-9_-]*)*)?$/.test(go)) {
    errors.push(`${where}: invalid go grammar`); return;
  }
  const result = W.viewer.reduce(W, current, { type: "link", href: `#/${go}` });
  if (!result || result.notes.some((n) => n !== W.viewer.TOUR_ENDED)) errors.push(`${where}: route notes ${result?.notes.join("; ")}`);
  if (!result) return;
  const vs = result.vs;
  const page = W.manifest.pagesById[vs.page];
  if (!page || vs.page !== go.slice(0, 3)) { errors.push(`${where}: page did not resolve`); return; }
  if (vs.role !== current.role || !page.roles.includes(current.role)) errors.push(`${where}: destination disallows the unchanged role`);
  const kind = W.viewer.classifyToken(W.pageFor(vs.page), vs.token);
  if (["unknown", "na"].includes(kind)) errors.push(`${where}: ${kind} destination token`);
  const key = label(vs);
  if (!cache.has(key)) {
    cache.add(key);
    try {
      const frame = W.viewer.renderFrame(W, vs);
      if (frame.blocked || frame.notes.length) errors.push(`${where}: blocked or unresolved destination`);
      noPlaceholder(W, frame, vs.page, errors, where);
    } catch (err) { errors.push(`${where}: render threw ${err.message}`); }
  }
}

// Core click paths must exist in page output, in addition to the tour's explicit role/time handoffs.
// Adjacent authoring tour pages can be editorial examples rather than clickable transitions.
export const REQUIRED_HOPS = Object.freeze([
  ["J02", "W06", "W14"], ["J02", "W14", "W16"], ["J02", "W16", "W17"],
  ["J02", "W17", "W18"], ["J02", "W18", "W19"], ["J02", "W19", "W20"],
  ["J02", "W20", "W21"], ["J02", "W21", "W22"],
  ["J03", "W48", "W49"], ["J03", "W49", "W50"], ["J03", "W50", "W51"], ["J03", "W51", "W53"], ["J03", "W23", "W24"],
  ["J05", "W41", "W42"], ["J05", "W26", "W27"],
  ["J06", "W52", "W51"], ["J06", "W54", "W53"],
  ["J07", "W33", "W34"], ["J07", "W34", "W19"], ["J07", "W19", "W20"], ["J07", "W20", "W21"], ["J07", "W21", "W22"],
  ["J08", "W48", "W49"], ["J09", "W28", "W29"], ["J09", "W30", "W31"],
  ["J11", "W58", "W54"],
]);
function walkTours(W, errors) {
  let steps = 0, hops = 0;
  if (W.manifest.journeys.length !== 12) errors.push(`links: expected 12 journeys, got ${W.manifest.journeys.length}`);
  for (const j of W.manifest.journeys) {
    let result = W.viewer.reduce(W, state(W, {}), { type: "tour", op: "start", jid: j.id });
    for (let i = 0; i < j.steps.length; i++) {
      const step = j.steps[i], v = result?.vs;
      if (!v || !sameStep(v, step) || v.j !== j.id || v.k !== i + 1 || result.notes.length) {
        errors.push(`links: ${j.id} step ${i + 1} reducer lost page/role/scenario/token or tour position`); break;
      }
      try {
        const frame = W.viewer.renderFrame(W, v);
        if (frame.blocked || frame.notes.length) errors.push(`links: ${j.id} step ${i + 1} blocked or unresolved`);
        noPlaceholder(W, frame, step.page, errors, `links: ${j.id} step ${i + 1}`);
      } catch (err) { errors.push(`links: ${j.id} step ${i + 1} threw ${err.message}`); }
      steps++;
      if (i + 1 < j.steps.length) result = W.viewer.reduce(W, v, { type: "tour", op: "next" });
    }
  }
  for (const [jid, from, to] of REQUIRED_HOPS) {
    const j = W.manifest.journeys.find((x) => x.id === jid);
    const source = j?.steps.find((s) => s.page === from), target = j?.steps.find((s) => s.page === to);
    if (!source || !target) { errors.push(`links: missing required journey hop ${jid} ${from}->${to}`); continue; }
    // Presentation variants expose confirmation dialogs without changing the record.
    const entry = W.pageFor(from);
    const recordVariant = (token) => W.P.recordVariant({ variant: token || null });
    const options = [...new Set([source.token, ...Object.keys(entry.variants)])]
      .filter((token) => recordVariant(token) === recordVariant(source.token));
    const found = options.some((token) => {
      const v = state(W, { ...source, token });
      try {
        return dataGos(W.viewer.renderFrame(W, v).html).some((go) => {
          const r = W.viewer.reduce(W, v, { type: "link", href: `#/${go}` });
          return r && !r.notes.length && sameStep(r.vs, target);
        });
      } catch { return false; }
    });
    if (!found) errors.push(`links: missing rendered journey hop ${jid} ${from}->${to} at its exact role/clock/record`);
    else hops++;
  }
  return { steps, hops };
}

export function checkLinks(W) {
  const errors = [], destinations = new Set();
  let renders = 0, links = 0;
  for (const page of W.manifest.pages) {
    const entry = W.pageFor(page.id), tokens = [null, ...entry.states, ...Object.keys(entry.variants)];
    for (const c of W.CONTEXTS) for (const role of page.roles) for (const scenario of W.sel.scenarioIds()) for (const token of tokens) {
      const vs = state(W, { ...c, page: page.id, role, scenario, token });
      try {
        const frame = W.viewer.renderFrame(W, vs); renders++;
        noPlaceholder(W, frame, page.id, errors, `links: ${label(vs)}`);
        for (const go of new Set(pageLinks(frame.html, errors, `links: ${label(vs)}`))) { links++; validateDestination(W, vs, go, errors, destinations); }
      } catch (err) { errors.push(`links: ${label(vs)} threw ${err.message}`); }
    }
  }
  const tours = walkTours(W, errors);
  return { errors: [...new Set(errors)], summary: `${renders} rendered views, ${links} links, ${tours.steps} steps across 12 tours, ${tours.hops}/${REQUIRED_HOPS.length} required page hops; source checks only`, ...tours, renders, links };
}

export function checkReach(W) {
  const errors = [], targets = new Set();
  const index = W.viewer.boardIndex(W), indexLinks = hrefs(index);
  for (const page of W.manifest.pages) {
    if (indexLinks.filter((h) => h === `#board-${page.id}`).length !== 1) errors.push(`reach: index must link once to ${page.id}`);
    try {
      const html = W.viewer.boardSection(W, page.id, { role: page.roles[0], token: null });
      if (!html.includes(`id="board-${page.id}"`)) errors.push(`reach: no gallery section ${page.id}`);
      const emitted = hrefs(html).filter((h) => h.startsWith("Whiteboard-Final.html#/"));
      const rows = W.viewer.boardLinks(W, page.id, { role: page.roles[0], token: null });
      for (const name of CONTEXTS) {
        const row = rows.find((r) => r.context === name);
        if (!row || !emitted.includes(row.href)) { errors.push(`reach: ${page.id} missing emitted ${name} link`); continue; }
        const parsed = W.viewer.parseHash(row.href.slice(row.href.indexOf("#/")));
        if (!parsed || parsed.notes.length) { errors.push(`reach: ${page.id} invalid ${name} link`); continue; }
        const v = parsed.vs, expected = state(W, { page: page.id, role: page.roles[0], platform: name.split("-")[0], width: name === "web-narrow" ? "narrow" : "regular", orientation: name === "ipad-portrait" ? "portrait" : "landscape" });
        if (v.page !== expected.page || v.role !== expected.role || v.platform !== expected.platform || v.width !== expected.width || v.orientation !== expected.orientation || v.token || v.scenario !== "default" || (page.optional && !v.opt)) errors.push(`reach: ${page.id} ${name} failed route round-trip`);
        const normalized = W.viewer.normalize(W, { ...v, opt: true }).vs;
        const frame = W.viewer.renderFrame(W, normalized);
        if (frame.blocked || frame.notes.length) errors.push(`reach: ${page.id} ${name} unresolved render`);
        noPlaceholder(W, frame, page.id, errors, "reach");
        if (PLATFORMS.includes(v.platform) && v.page === page.id) targets.add(`${page.id}/${v.platform}`);
      }
    } catch (err) { errors.push(`reach: ${page.id} threw ${err.message}`); }
  }
  if (targets.size !== 189) errors.push(`reach: ${targets.size}/189 page×platform targets`);
  return { errors, targets, summary: `${targets.size}/189 page×platform targets through rendered board/index links and route/render round-trips; optional pages on; source checks only` };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const W = loadSite();
  for (const check of [checkLinks, checkReach]) {
    const result = check(W); console.log(result.summary); for (const error of result.errors.slice(0, 50)) console.log(error);
    if (result.errors.length) console.log(`${result.errors.length} errors`);
    if (result.errors.length) process.exitCode = 1;
  }
}
