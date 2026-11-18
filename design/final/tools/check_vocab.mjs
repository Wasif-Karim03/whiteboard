// Phase 2b vocabulary checks: every state field belongs to a known vocabulary, record states map to kit
// status keys the kit lets that role see, fixture statuses render through K.status, and no file outside
// kit/core.js redefines a status or flag word. Every rule is a pure function returning string[] errors; the
// CLI loads the real data with loadAll(). Source checks only, not browser acceptance.
// Run: node design/final/tools/check_vocab.mjs
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { loadAll, DATA_DIR } from "./load_data.mjs";
import { loadKit } from "./load_kit.mjs";
import { walk } from "./check_fixtures.mjs";

const LATE_KEYS = ["received", "receivedNotReleased"];
const CLASSIFIED = [
  [/^\.coursework\.submissions\[\d+\]\.(priorVisible\.)?state$/, "record"],
  [/^\.comms\.announcements\[\d+\]\.state$/, "announcement"],
  [/^\.scenarios\.failures\[\d+\]\.state$/, "failure"],
];
const OVERRIDE_RECORD = /^\.scenarios\.overrides\.(\w+)\[(\d+)\]\.record(\..*)$/;

function vocabularies(WB) {
  return {
    record: WB.manifest.status.RECORD_STATES,
    announcement: WB.manifest.status.ANNOUNCEMENT_STATES,
    failure: WB.manifest.states.map((s) => s.id),
  };
}

// Classifies every `state` field by its path. Override records are classified by their declared dataset and
// collection; any other state field is an error.
function stateErrors(data, vocab, label) {
  const errors = [];
  walk(data, (v, key, p) => {
    if (key !== "state" || typeof v !== "string" || /\]$/.test(p)) return;
    let at = p;
    const o = OVERRIDE_RECORD.exec(p);
    if (o) {
      const entry = data.scenarios.overrides[o[1]][+o[2]];
      at = `.${entry.dataset}.${entry.collection}[0]${o[3]}`;
    }
    const kind = CLASSIFIED.find(([re]) => re.test(at));
    if (!kind) { errors.push(`vocab[${label}]: unclassified state field ${p}`); return; }
    if (!vocab[kind[1]].includes(v)) errors.push(`vocab[${label}]: ${p} '${v}' is not a ${kind[1]} state`);
  });
  return errors;
}

export function checkRecordStates(WB, data = WB.data) {
  const vocab = vocabularies(WB);
  const errors = stateErrors(data, vocab, "base");
  if (errors.length) return errors;
  for (const id of Object.keys(data.scenarios.clocks)) errors.push(...stateErrors(WB.sel.buildView(data, id).data, vocab, id));
  return errors;
}

// Every record state × role × release flag maps to a visible kit status key (or null).
export function checkMapping(WB) {
  const errors = [];
  const { RECORD_STATES, TABLE, keyFor } = WB.manifest.status;
  const keys = Object.keys(WB.STATUS);
  for (const s of RECORD_STATES) {
    if (!TABLE[s]) { errors.push(`mapping: ${s} has no table row`); continue; }
    for (const v of Object.values(TABLE[s])) if (v !== null && v !== "prior" && !keys.includes(v)) errors.push(`mapping: ${s} maps to unknown key ${v}`);
  }
  const records = [];
  // A prior snapshot may be any state except correctionHeld, and excused only when released (R16).
  const priors = RECORD_STATES.flatMap((ps) => [true, false].map((pr) => ({ state: ps, released: pr })))
    .filter((p) => p.state !== "correctionHeld" && (p.state !== "excused" || p.released));
  for (const state of RECORD_STATES) for (const released of [true, false]) for (const late of [true, false]) {
    if ((state === "excused" && !released) || state === "correctionHeld") {
      for (const priorVisible of priors) records.push({ state, released, late, priorVisible });
    } else records.push({ state, released, late });
  }
  for (const rec of records) for (const role of WB.ROLES) {
    const label = `${JSON.stringify(rec)} as ${role}`;
    let k;
    try { k = keyFor(rec, role, { own: true }); } catch (err) { errors.push(`mapping: ${label} threw ${err.message}`); continue; }
    if (role === "guest" && k !== null) errors.push(`mapping: ${label} gives a key to a guest`);
    if (k === null) continue;
    if (!keys.includes(k.key) || k.key === "late") errors.push(`mapping: ${label} gives key ${k.key}`);
    else if (!WB.statusVisible(k.key, role, { released: k.released, own: true })) errors.push(`mapping: ${label} gives ${k.key}, which ${role} cannot see`);
    if (k.late && !LATE_KEYS.includes(k.key)) errors.push(`mapping: ${label} puts late on ${k.key}`);
    if (role === "student" && keyFor(rec, role, { own: false }) !== null) errors.push(`mapping: ${label} shows another student's status`);
  }
  return errors;
}

function render(WB, s, role, errors, tag) {
  const k = WB.manifest.status.keyFor(s, role, { own: true });
  if (!k) return null;
  try {
    WB.K.status(k.key, WB.ctx({ platform: "web", role }), { released: k.released, own: true, late: k.late });
  } catch (err) {
    errors.push(`statuses[${tag}]: ${s.id || s.state} as ${role} (${k.key}) throws ${err.message}`);
  }
  return k.key;
}

// Every submission in every scenario renders through K.status for its owner and for staff.
export function checkFixtureStatuses(WB, views = WB.sel.scenarioIds().map((id) => WB.sel.scenarioView(id))) {
  const errors = [];
  for (const view of views) for (const s of view.data.coursework.submissions) for (const role of ["student", "instructor", "ta"]) render(WB, s, role, errors, view.id);
  const base = WB.sel.scenarioView("default");
  const spot = [["aisha", "ps4", "held", "receivedNotReleased"], ["carmen", "ps4", "missing", "notReceivedClosed"], ["aisha", "ps3", "excused", "excused"]];
  for (const [p, a, staffKey, studentKey] of spot) {
    const s = WB.sel.submissionFor(base, p, a);
    if (!s) { errors.push(`statuses: ${p} ${a} is missing`); continue; }
    const st = render(WB, s, "student", errors, "spot");
    const sf = render(WB, s, "instructor", errors, "spot");
    if (st !== studentKey) errors.push(`statuses: ${p} ${a} student key ${st}, expected ${studentKey}`);
    if (sf !== staffKey) errors.push(`statuses: ${p} ${a} staff key ${sf}, expected ${staffKey}`);
  }
  // B2: an unreleased excusal shows the student the prior snapshot, released or not.
  for (const [pr, want] of [[true, "missing"], [false, "notReceivedClosed"]]) {
    const rec = { id: "excusal-after-missing", state: "excused", released: false, late: false, priorVisible: { state: "missing", released: pr } };
    const got = render(WB, rec, "student", errors, "excusal");
    if (got !== want) errors.push(`statuses: held excusal after ${pr ? "released" : "unreleased"} Missing shows ${got}, expected ${want}`);
  }
  // R12: a held correction shows the student the latest released snapshot; staff see held.
  for (const [ps, want] of [["feedbackUpdated", "feedbackUpdated"], ["missing", "missing"], ["released", "released"], ["excused", "excused"]]) {
    const rec = { id: "correction-held", state: "correctionHeld", released: true, late: false, priorVisible: { state: ps, released: true } };
    const got = render(WB, rec, "student", errors, "correction");
    if (got !== want) errors.push(`statuses: held correction after ${ps} shows the student ${got}, expected ${want}`);
    const staff = render(WB, rec, "instructor", errors, "correction");
    if (staff !== "held") errors.push(`statuses: held correction shows staff ${staff}, expected held`);
  }
  return errors;
}

const QUOTED = /(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g;
const ASSIGN = /\bWB\s*\.\s*(STATUS|FLAGS)\b(\s*(\.\s*\w+|\[[^\]]*\]))*\s*(=(?!=)|\+=)/;
const DEFINE = /(defineProperty|defineProperties|assign|setPrototypeOf)\s*\(\s*WB\s*\.\s*(STATUS|FLAGS)\b/;

// files: [{path, text}]. Only kit/core.js may define status and flag words.
export function checkNoLabelRedefinition(files, WB, kitWB = loadKit()) {
  const errors = [];
  const words = new Set([...Object.values(WB.STATUS), ...Object.values(WB.FLAGS)].map((e) => e.label));
  for (const f of files) {
    for (const m of f.text.matchAll(QUOTED)) if (words.has(m[2])) errors.push(`labels: ${f.path} redefines the kit word ${m[0]}`);
    if (ASSIGN.test(f.text)) errors.push(`labels: ${f.path} assigns to WB.STATUS or WB.FLAGS`);
    if (DEFINE.test(f.text)) errors.push(`labels: ${f.path} defines properties on WB.STATUS or WB.FLAGS`);
    if (/(^|\/)manifest\/status\.js$/.test(f.path) && /(\blabel\s*:|["']label["'])/.test(f.text)) errors.push(`labels: ${f.path} has a label key`);
  }
  if (JSON.stringify(WB.STATUS) !== JSON.stringify(kitWB.STATUS)) errors.push("labels: WB.STATUS differs from the kit after loading data");
  if (JSON.stringify(WB.FLAGS) !== JSON.stringify(kitWB.FLAGS)) errors.push("labels: WB.FLAGS differs from the kit after loading data");
  if (!Object.isFrozen(WB.STATUS) || !Object.isFrozen(WB.FLAGS)) errors.push("labels: WB.STATUS or WB.FLAGS is no longer frozen");
  return errors;
}

function jsFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return jsFiles(p);
    return d.name.endsWith(".js") ? [p] : [];
  });
}

export function sourceFiles() {
  return ["manifest", "fixtures", "pages"].flatMap((d) => jsFiles(path.join(DATA_DIR, d)))
    .map((p) => ({ path: path.relative(path.join(DATA_DIR, "..", ".."), p), text: fs.readFileSync(p, "utf8") }));
}

// M4: page files read grade, staff and sample data only through the WB.sel projections, never the records.
const PAGE_DATA_BANS = [/\.pending\b/, /grade_drafts/, /\.data\.(grades|staff|samples)\b/, /\.drafts\b/, /\.releases\b/, /\bgolden\b/, /question_ids/];
export function checkPageDataAccess(files) {
  const errors = [];
  for (const f of files) {
    if (!/(^|\/)pages\//.test(f.path)) continue;
    for (const re of PAGE_DATA_BANS) if (re.test(f.text)) errors.push(`page data: ${f.path} reads ${re} directly; use a WB.sel projection`);
  }
  return errors;
}

export function checkAll(WB) {
  const files = sourceFiles();
  return [...checkRecordStates(WB), ...checkMapping(WB), ...checkFixtureStatuses(WB), ...checkNoLabelRedefinition(files, WB), ...checkPageDataAccess(files)];
}

function main() {
  const errors = checkAll(loadAll());
  for (const e of errors) console.log(e);
  console.log(`check_vocab: ${errors.length} errors. Source checks only.`);
  return errors.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
