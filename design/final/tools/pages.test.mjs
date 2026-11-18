// Phase 2c tests: the page registry, placeholders and the page file layout (team plan Step 9).
// Registries are built in fresh vm contexts; nothing frozen is mutated. Source checks only.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadAll, DATA_DIR, dataPath } from "./load_data.mjs";
import { loadSite, pageFiles, siteFiles, SEGMENT_DIRS, PAGE_PRE, PAGE_SEAL, VIEWER_PURE } from "./load_site.mjs";
import { checkNoLabelRedefinition, sourceFiles } from "./check_vocab.mjs";

// SITE is the live site (whatever page files exist). EMPTY is an isolated registry with no discovered page
// files, so placeholder assertions keep holding once Phase 3 registers real pages.
const SITE = loadSite();
const EMPTY = loadAll({ extra: [...PAGE_PRE, PAGE_SEAL, ...VIEWER_PURE].map(dataPath) });
const STATE_IDS = SITE.manifest.states.map((s) => s.id);
const registryOnly = () => loadAll({ extra: PAGE_PRE.map(dataPath) });
const withViewer = () => loadAll({ extra: [...PAGE_PRE, ...VIEWER_PURE].map(dataPath) });
const render = () => ({ title: "T", body: "<p>B</p>" });

// A valid definition: the given states drawn, every other state N/A with a reason.
function def(states, over = {}) {
  const na = Object.fromEntries(STATE_IDS.filter((s) => !states.includes(s)).map((s) => [s, "Does not happen on this page"]));
  return { states, na, render, ...over };
}

test("with no page files, all 63 manifest pages are placeholders with every state N/A", () => {
  assert.equal(EMPTY.pageIds().length, 63);
  assert.deepEqual([...EMPTY.pageIds()], Array.from(EMPTY.manifest.pages, (p) => p.id));
  for (const id of EMPTY.pageIds()) {
    const e = EMPTY.pageFor(id);
    assert.equal(e.placeholder, true, id);
    assert.equal(e.states.length, 0, id);
    assert.deepEqual(Object.keys(e.na).sort(), [...STATE_IDS].sort(), id);
    for (const reason of Object.values(e.na)) assert.ok(reason.length > 0 && reason.length <= 140);
  }
});

// Holds for any mix of real and placeholder pages: 63 entries in manifest order, each a placeholder (no
// states, all N/A) or a real page (states and N/A cover all 16), and every page's default frame renders.
function checkSiteRegistry(WB) {
  assert.equal(WB.pageIds().length, 63);
  assert.deepEqual([...WB.pageIds()], Array.from(WB.manifest.pages, (p) => p.id));
  for (const id of WB.pageIds()) {
    const e = WB.pageFor(id);
    const covered = [...e.states, ...Object.keys(e.na)].sort();
    assert.deepEqual(covered, [...STATE_IDS].sort(), id);
    if (e.placeholder) assert.equal(e.states.length, 0, id);
    for (const reason of Object.values(e.na)) assert.ok(reason.length > 0 && reason.length <= 140, id);
    const role = WB.manifest.pagesById[id].roles[0];
    const out = WB.viewer.renderFrame(WB, WB.viewer.normalize(WB, { ...WB.viewer.DEFAULTS, page: id, role }).vs, { ns: "t" });
    assert.ok(out.html.length > 0, id);
  }
}

// A minimal real page file outside the repo, drawing every state, for the real-site invariant.
function realPageFile(id) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wb-real-"));
  const file = path.join(dir, `${id}.js`);
  const render = 'function (a) { return { title: "Home", body: (a.tier === "full" ? "" : a.K.handoff(a.ctx, { title: "Open on a larger screen" })) + "<p>Real page</p>" }; }';
  fs.writeFileSync(file, `WB.definePage("${id}", { states: ${JSON.stringify(STATE_IDS)}, na: {}, render: ${render} });\n`);
  return file;
}

test("the live site registry holds whether each page is registered or a placeholder", () => {
  checkSiteRegistry(SITE);
  const open = SITE.pageIds().filter((id) => SITE.pageFor(id).placeholder);
  if (!open.length) return;
  const withReal = loadSite({ extraPageFiles: [realPageFile(open[0])] });
  checkSiteRegistry(withReal);
  assert.equal(withReal.pageFor(open[0]).placeholder, false);
  for (const id of SITE.pageIds().filter((x) => x !== open[0])) assert.equal(withReal.pageFor(id).placeholder, SITE.pageFor(id).placeholder, id);
});

test("siteFiles keeps the plan's order: register, placeholder, page files, seal, pure viewer modules", () => {
  const files = siteFiles();
  assert.deepEqual(files.slice(0, 2), ["pages/register.js", "pages/placeholder.js"]);
  assert.equal(files[files.indexOf("pages/seal.js") + 1], "viewer/route.js");
  assert.deepEqual(files.slice(-6), [...VIEWER_PURE]);
});

const INVALID = [
  ["unknown id", "unknown page id", (WB) => WB.definePage("W99", def(["loading"]))],
  ["non-function render", "render must be a function", (WB) => WB.definePage("W06", def(["loading"], { render: "nope" }))],
  ["unknown state", "unknown state 'teleporting'", (WB) => WB.definePage("W06", def(["loading", "teleporting"]))],
  ["duplicate state", "listed twice", (WB) => WB.definePage("W06", def(["loading", "loading"]))],
  ["overlap of states and na", "in both states and na", (WB) => WB.definePage("W06", def(["loading"], { na: { ...def(["loading"]).na, loading: "Both" } }))],
  ["states and na do not cover all 16", "do not cover offline", (WB) => { const d = def(["loading"]); const { offline, ...na } = d.na; return WB.definePage("W06", { ...d, na }); }],
  ["empty reason", "is empty", (WB) => WB.definePage("W06", def(["loading"], { na: { ...def(["loading"]).na, offline: "  " } }))],
  ["reason over 140 characters", "over 140 characters", (WB) => WB.definePage("W06", def(["loading"], { na: { ...def(["loading"]).na, offline: "x".repeat(141) } }))],
  ["variant colliding with a state id", "collides with a state id", (WB) => WB.definePage("W06", def(["loading"], { variants: { loading: "Loading view" } }))],
  ["variant with a bad id", "must match", (WB) => WB.definePage("W06", def(["loading"], { variants: { "Open Dialog": "Open" } }))],
  ["variant with an empty label", "empty label", (WB) => WB.definePage("W06", def(["loading"], { variants: { "open-dialog": "" } }))],
  ["W20 marking saveFailed N/A although a failure scenario needs it", "needs state 'saveFailed'", (WB) => WB.definePage("W20", def(["invalid", "offline"]))],
];

for (const [label, reason, call] of INVALID) {
  test(`definePage rejects: ${label}`, () => {
    const WB = registryOnly();
    assert.throws(() => call(WB), (err) => err.message.startsWith("WB.definePage: ") && err.message.includes(reason));
  });
}

test("definePage rejects a duplicate id and any call after sealing", () => {
  const WB = registryOnly();
  WB.definePage("W06", def(["loading"]));
  assert.throws(() => WB.definePage("W06", def(["loading"])), /already registered/);
  WB.sealPages();
  assert.throws(() => WB.definePage("W08", def(["loading"])), /sealed/);
  assert.throws(() => WB.sealPages(), /already sealed/);
});

test("a valid definition is accepted, deep-frozen and returned by pageFor after sealing", () => {
  const WB = registryOnly();
  WB.definePage("W20", def(["saveFailed", "invalid", "offline"], { variants: { "open-dialog": "Submit dialog open" } }));
  assert.throws(() => WB.pageFor("W20"), /not sealed/);
  WB.sealPages();
  const e = WB.pageFor("W20");
  assert.equal(e.placeholder, false);
  assert.deepEqual([...e.states], ["saveFailed", "invalid", "offline"]);
  assert.equal(e.variants["open-dialog"], "Submit dialog open");
  assert.ok(Object.isFrozen(e) && Object.isFrozen(e.na) && Object.isFrozen(e.states));
  assert.equal(WB.pageFor("W21").placeholder, true);
  assert.throws(() => WB.pageFor("W99"), /unknown page/);
});

// ---------- pageFiles against temporary trees ----------
function tree(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wb-pages-"));
  for (const [rel, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), text);
  }
  return root;
}
const page = (id) => `WB.definePage("${id}", {});\n`;

test("pageFiles accepts a correct seg3-submit/W19.js and ignores .md files and top-level page scripts", () => {
  const root = tree({ "pages/register.js": "", "pages/PAGES.md": "", "pages/seg3-submit/W19.js": page("W19"), "pages/seg3-submit/NOTES.md": "", "pages/optional/O01.js": page("O01"), "pages/seg1-access/W01.js": page("W01") });
  assert.deepEqual(pageFiles({ root }), ["pages/seg1-access/W01.js", "pages/seg3-submit/W19.js", "pages/optional/O01.js"]);
});

test("pageFiles rejects a wrong folder, a stray .js file, a misnamed file, an id mismatch and an unknown folder", () => {
  assert.throws(() => pageFiles({ root: tree({ "pages/seg2-course/W19.js": page("W19") }) }), /belongs in pages\/seg3-submit/);
  assert.throws(() => pageFiles({ root: tree({ "pages/seg6-grading/O01.js": page("O01") }) }), /belongs in pages\/optional/);
  assert.throws(() => pageFiles({ root: tree({ "pages/seg3-submit/helpers.js": "" }) }), /not named <ID>\.js/);
  assert.throws(() => pageFiles({ root: tree({ "pages/seg3-submit/w19.js": page("W19") }) }), /not named <ID>\.js/);
  assert.throws(() => pageFiles({ root: tree({ "pages/seg3-submit/W19.js": page("W20") }) }), /defines W20, not W19/);
  assert.throws(() => pageFiles({ root: tree({ "pages/seg3-submit/deep/W19.js": page("W19") }) }), /nested too deep/);
  assert.throws(() => pageFiles({ root: tree({ "pages/misc/W19.js": page("W19") }) }), /not a segment folder/);
  assert.equal(SEGMENT_DIRS.length, 7);
});

test("the real design/final/pages tree has a valid layout", () => {
  assert.ok(Array.isArray(pageFiles({ root: DATA_DIR })));
});

// ---------- Placeholder render ----------
function frame(WB, vs) {
  const V = WB.viewer;
  return V.renderFrame(WB, V.normalize(WB, { ...V.DEFAULTS, ...vs }).vs, { ns: "t" }).html;
}

test("the placeholder render names the page, says Not built yet and carries the tier handoff", () => {
  const w05 = frame(EMPTY, { page: "W05" });
  assert.match(w05, /Not built yet/);
  assert.match(w05, /Role-aware Home/);
  assert.match(w05, /href="Whiteboard-Final-Spec\.html#spec-W05"/);
  assert.match(frame(EMPTY, { page: "W35", platform: "ipad", role: "instructor" }), /wb-handoff--review/);
  assert.match(frame(EMPTY, { page: "W42", platform: "iphone", role: "instructor" }), /wb-handoff--handoff/);
  assert.doesNotMatch(w05, /wb-handoff--/);
});

test("the placeholder uses access mode for the guest role and app mode otherwise", () => {
  assert.match(frame(EMPTY, { page: "W01", role: "guest" }), /data-mode="access"/);
  assert.match(frame(EMPTY, { page: "W02", role: "student" }), /data-mode="app"/);
  assert.match(frame(EMPTY, { page: "W06" }), /data-nav="courses" aria-current="page"/);
});

test("page sources quote no kit status or flag label (check_vocab)", () => {
  const files = sourceFiles().filter((f) => f.path.includes("design/final/pages/"));
  assert.ok(files.length >= 3, `${files.length} page source files`);
  assert.deepEqual([...checkNoLabelRedefinition(files, SITE)], []);
});

test("a spy page is defined before sealing in a viewer-loaded context", () => {
  const WB = withViewer();
  WB.definePage("W06", def(["loading"], { render: (a) => ({ title: "Spy", body: `<p>${a.state || "default"}</p>` }) }));
  WB.sealPages();
  assert.match(frame(WB, { page: "W06", token: "loading" }), /<p>loading<\/p>/);
});

test("M7: placeholders declare the anchor variants, so the real site has no undeclared variant", async () => {
  assert.deepEqual(Object.keys(EMPTY.pageFor("W19").variants), ["motion"]);
  assert.equal(EMPTY.pageFor("W19").variants.motion, "Motion investigation (group)");
  assert.deepEqual(Object.keys(EMPTY.pageFor("W05").variants), []);
  const { anchorVariantProblems } = await import("./check_render.mjs");
  assert.deepEqual(anchorVariantProblems(SITE), []);
});

test("M7/M8/R3: PAGES.md matches the anchor manifest", () => {
  const md = fs.readFileSync(path.join(DATA_DIR, "pages", "PAGES.md"), "utf8");
  const section = (title) => md.split(`## ${title}`)[1].split("\n## ")[0];
  const cells = (line) => line.split("|").slice(1, -1).map((c) => c.trim());
  const rows = section("Anchor records and home scenarios").split("\n").filter((l) => /^\| W\d\d|^\| O\d\d/.test(l)).map(cells);
  assert.deepEqual(rows.map((r) => r[0]), [...SITE.pageIds()]);
  const scenarios = SITE.sel.scenarioIds();
  const tick = (s) => /^`([^`]+)`$/.exec(s)?.[1];
  for (const [page, record, home, variants] of rows) {
    assert.ok(scenarios.includes(tick(home)), `${page} home`);
    const a = SITE.manifest.anchors[page];
    if (record === "course-level") {
      assert.equal(a, undefined, page);
      assert.equal(variants, "none", page);
      continue;
    }
    assert.equal(tick(record), `${a.record.type}:${a.record.id}`, page);
    assert.equal(tick(home), a.home, page);
    const listed = variants === "none" ? [] : variants.split("; ").map((v) => /^`([^`]+)` → `([^`]+)` \(`([^`]+)`\)$/.exec(v).slice(1));
    assert.deepEqual(listed, Object.entries(a.variants).map(([id, v]) => [id, `${v.record.type}:${v.record.id}`, v.home]), page);
  }
  const devices = section("Staff spine pages on iPad and iPhone").split("\n").filter((l) => /^\| W\d\d/.test(l)).map((l) => cells(l)[0]);
  assert.deepEqual(devices, ["W48", "W49", "W51", "W53"]);
  for (const heading of ["## Roles and scope", "## Committing actions"]) assert.ok(md.includes(heading), heading);
  assert.ok(md.includes("chosen by Claude under owner delegation"));
});
