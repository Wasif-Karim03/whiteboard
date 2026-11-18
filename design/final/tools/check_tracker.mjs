// Static checks for design/final/tracker/ (baseline, decisions and later source progress).
// Source checks only: not browser, device, accessibility or owner acceptance.
// Usage (from repo root): node design/final/tools/check_tracker.mjs [--phase 0|1]   (default 1, which includes phase 0)
// Every rule function takes in-memory data and returns a list of error strings, so tests can use fixtures.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv, splitList, splitRefs } from "./csv.mjs";
import { sha256 } from "./extract_board.mjs";
import { deriveUxPairs, uxRulesOf } from "./ux_rows.mjs";
import { BOARD_DECISIONS, DECISIONS_MD, DELEGATION_PHRASE, EXPECTED_COUNTS, FIX_COLUMNS, FIX_ID_PREFIX, FIX_TRACKER, INPUTS_LOCK, JOURNEY_WALK_MD, LOCKED_INPUTS, OUT_OF_RUN_STATUSES, PAGE_COLUMNS, PAGE_INITIAL, PAGE_TRACKER, PLATFORMS, SPEC_DIR, STATUSES, TYPES, rel } from "./schema.mjs";

const FT = path.basename(FIX_TRACKER);
const PT = path.basename(PAGE_TRACKER);
const JOURNEYS = Array.from({ length: 12 }, (_, i) => `J${String(i + 1).padStart(2, "0")}`);
const ROLES = ["Student", "Instructor", "TA", "Guest"];
const PROTECTED_TYPES = ["rule-conflict", "conflict"];
const MIN_RESOLUTION = 20;
const MANDATORY_BD = Array.from({ length: 24 }, (_, i) => `BD${i + 1}`);
// Anchors are restated here on purpose, independently of page_meta.tierFor.
const ANCHOR_HANDOFF = ["W42", "W60", "O02"];
const ANCHOR_IPAD_FULL = ["W48", "W49", "W51", "W53", "W57"];

const byId = (rows) => new Map(rows.map((r) => [r.fix_id, r]));
const isDd = (r) => r.fix_id.startsWith("DD-");
const isJw = (r) => /^JW-\d{3}$/.test(r.fix_id);
const sev = (r) => (r.severity === "" ? null : Number(r.severity));
const targetIdOf = (r) => (r.resolution.trim().match(FIX_ID_PREFIX) || [])[1] || null;

export function checkColumns(columns, expected, file) {
  return columns.join(",") === expected.join(",") ? [] : [`${file}: columns expected ${expected.join(",")}, actual ${columns.join(",")}`];
}

export function checkFixVocab(rows) {
  const seen = new Set();
  return rows.flatMap((r) => {
    const e = [];
    if (seen.has(r.fix_id)) e.push(`${FT}: duplicate fix_id ${r.fix_id}`);
    seen.add(r.fix_id);
    if (!STATUSES.includes(r.status)) e.push(`${FT}: ${r.fix_id} status expected one of ${STATUSES.join("/")}, actual "${r.status}"`);
    if (OUT_OF_RUN_STATUSES.includes(r.status)) e.push(`${FT}: ${r.fix_id} status "${r.status}" is not allowed in Phase 0–1 (allowed: Open, Decided, Withdrawn, Duplicate-of)`);
    if (!TYPES.includes(r.type)) e.push(`${FT}: ${r.fix_id} type expected one of ${TYPES.join("/")}, actual "${r.type}"`);
    return e;
  });
}

export function checkDdCounts(rows, expected) {
  const dd = rows.filter(isDd);
  const part = (p) => dd.filter((r) => r.fix_id.startsWith(`DD-${p}.`)).length;
  const actual = { dd_total: dd.length, dd_by_part: [1, 2, 3, 4, 5, 6].map(part), rule_conflicts: dd.filter((r) => r.type === "rule-conflict").length, withdrawn: dd.filter((r) => r.status === "Withdrawn").map((r) => r.fix_id) };
  return Object.entries(actual).filter(([k, v]) => JSON.stringify(v) !== JSON.stringify(expected[k])).map(([k, v]) => `${FT}: ${k} expected ${JSON.stringify(expected[k])}, actual ${JSON.stringify(v)}`);
}

export function checkPresent(rows, ids, opts = {}) {
  const map = byId(rows);
  return ids.flatMap((id) => {
    const r = map.get(id);
    if (!r) return [`${FT}: required row ${id} is missing`];
    if (opts.type && r.type !== opts.type) return [`${FT}: ${id} type expected ${opts.type}, actual ${r.type}`];
    if (opts.status && r.status !== opts.status) return [`${FT}: ${id} status expected ${opts.status}, actual ${r.status}`];
    return [];
  });
}

// Any Duplicate-of row: resolution starts with an existing fix_id whose row is not itself Duplicate-of.
export function checkDuplicates(rows) {
  const map = byId(rows);
  return rows.filter((r) => r.status === "Duplicate-of").flatMap((r) => {
    const t = targetIdOf(r);
    if (!t || !map.has(t)) return [`${FT}: ${r.fix_id} is Duplicate-of but its resolution does not start with an existing fix_id ("${r.resolution.slice(0, 40)}")`];
    if (t === r.fix_id) return [`${FT}: ${r.fix_id} is Duplicate-of itself`];
    if (map.get(t).status === "Duplicate-of") return [`${FT}: ${r.fix_id} is Duplicate-of ${t}, which is itself Duplicate-of (chain)`];
    return [];
  });
}

// The (page_id, platform) set must equal board_manifest.json pages × PLATFORMS exactly.
export function checkPageRows(rows, expected, pageIds) {
  const e = [];
  const keys = rows.map((r) => `${r.page_id}/${r.platform}`);
  const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
  if (dup.length) e.push(`${PT}: duplicate (page_id, platform) ${[...new Set(dup)].join(",")}`);
  if (rows.length !== expected.page_rows) e.push(`${PT}: rows expected ${expected.page_rows}, actual ${rows.length}`);
  const want = new Set(pageIds.flatMap((id) => PLATFORMS.map((pl) => `${id}/${pl}`)));
  const got = new Set(keys);
  const missing = [...want].filter((k) => !got.has(k));
  const unexpected = [...got].filter((k) => !want.has(k));
  if (missing.length) e.push(`${PT}: missing (page_id, platform) ${missing.join(",")}`);
  if (unexpected.length) e.push(`${PT}: unexpected (page_id, platform) ${unexpected.join(",")}`);
  for (const r of rows) {
    if (!PLATFORMS.includes(r.platform)) e.push(`${PT}: ${r.page_id} unknown platform "${r.platform}"`);
    if (!r.tier_rule) e.push(`${PT}: ${r.page_id}/${r.platform} has an empty tier_rule`);
  }
  for (const pl of PLATFORMS) {
    const got = ["full", "review", "handoff"].map((t) => rows.filter((r) => r.platform === pl && r.tier === t).length);
    if (JSON.stringify(got) !== JSON.stringify(expected.tiers[pl])) e.push(`${PT}: ${pl} tiers (full/review/handoff) expected ${expected.tiers[pl].join("/")}, actual ${got.join("/")}`);
  }
  return e;
}

// Browser/owner results stay locked until the separately authorized acceptance step.
export function checkPageInitial(rows) {
  const allowed = { specified: ["Yes"], html_implemented: ["No", "Yes"], source_checked: ["Not run", "Pass", "Fail"],
    browser_checked: ["Not run"], accessibility_reviewed: ["Not run", "Source reviewed"], owner_accepted: ["Not run"] };
  return rows.flatMap((r) => Object.entries(allowed).filter(([c, values]) => !values.includes(r[c]))
    .map(([c, values]) => `${PT}: ${r.page_id}/${r.platform} ${c} expected "${values.join('/')}"; actual "${r[c]}"`));
}

export function checkAnchors(rows) {
  const tier = (id, pl) => rows.find((r) => r.page_id === id && r.platform === pl)?.tier;
  const want = (id, pl, t) => (tier(id, pl) === t ? [] : [`${PT}: anchor ${id}/${pl} expected ${t}, actual ${tier(id, pl)}`]);
  return [
    ...ANCHOR_HANDOFF.flatMap((id) => [...want(id, "ipad", "handoff"), ...want(id, "iphone", "handoff")]),
    ...ANCHOR_IPAD_FULL.flatMap((id) => [...want(id, "ipad", "full"), ...want(id, "iphone", "review")]),
    ...rows.filter((r) => /[sg]/.test(r.roles) && r.tier !== "full").map((r) => `${PT}: anchor ${r.page_id}/${r.platform} has roles ${r.roles} and must be full, actual ${r.tier}`),
    ...rows.filter((r) => r.platform === "web" && r.tier !== "full").map((r) => `${PT}: anchor ${r.page_id}/web must be full, actual ${r.tier}`),
  ];
}

// The lock must list exactly LOCKED_INPUTS, once each, with valid bytes/sha256, and every hash must still match.
export function checkLock(lock, readFile) {
  if (!Array.isArray(lock)) return [`${INPUTS_LOCK}: expected an array of {path, bytes, sha256}`];
  const paths = lock.map((f) => f?.path);
  const dup = paths.filter((p, i) => paths.indexOf(p) !== i);
  return [
    ...[...new Set(dup)].map((p) => `${INPUTS_LOCK}: duplicate entry ${p}`),
    ...LOCKED_INPUTS.filter((p) => !paths.includes(p)).map((p) => `${INPUTS_LOCK}: required entry ${p} is omitted`),
    ...paths.filter((p) => !LOCKED_INPUTS.includes(p)).map((p) => `${INPUTS_LOCK}: unexpected entry ${p}`),
    ...lock.filter((f) => LOCKED_INPUTS.includes(f?.path)).flatMap((f) => lockEntryErrors(f, readFile)),
  ];
}

function lockEntryErrors(f, readFile) {
  if (!Number.isInteger(f.bytes) || f.bytes < 0) return [`${INPUTS_LOCK}: ${f.path} bytes expected a non-negative integer, actual ${JSON.stringify(f.bytes)}`];
  if (!/^[0-9a-f]{64}$/.test(f.sha256 ?? "")) return [`${INPUTS_LOCK}: ${f.path} sha256 expected 64 lowercase hex characters, actual ${JSON.stringify(f.sha256)}`];
  const buf = readFile(f.path);
  if (!buf) return [`${INPUTS_LOCK}: ${f.path} is missing`];
  const got = sha256(buf);
  if (got !== f.sha256) return [`${INPUTS_LOCK}: ${f.path} sha256 expected ${f.sha256}, actual ${got} (input changed)`];
  return buf.length === f.bytes ? [] : [`${INPUTS_LOCK}: ${f.path} bytes expected ${f.bytes}, actual ${buf.length}`];
}

// decisions.md entries: "## BDnn · …" or "## Cn · …", each running to the next "## " heading.
export function parseDecisionEntries(md) {
  const parts = md.split(/^(?=## )/m);
  return new Map(parts.flatMap((p) => { const m = p.match(/^## (BD\d+|C\d+)\b/); return m ? [[m[1], p]] : []; }));
}

export function checkMandatoryDecisions(rows, entries) {
  const map = byId(rows);
  const bdNum = (id) => Number(id.slice(2));
  const mdIds = [...entries.keys()].filter((id) => /^BD\d+$/.test(id) && bdNum(id) >= 9);
  const rowIds = rows.filter((r) => /^BD\d+$/.test(r.fix_id) && bdNum(r.fix_id) >= 9).map((r) => r.fix_id);
  return [
    ...checkPresent(rows, MANDATORY_BD, { type: "decision", status: "Decided" }),
    ...mdIds.filter((id) => !map.has(id) || map.get(id).type !== "decision" || map.get(id).status !== "Decided").map((id) => `${FT}: ${DECISIONS_MD} has ${id} but the tracker has no type=decision, status=Decided row for it`),
    ...rowIds.filter((id) => !entries.has(id)).map((id) => `${FT}: tracker row ${id} has no entry in ${DECISIONS_MD}`),
  ];
}

export function checkConflictRows(rows) {
  return rows.filter((r) => PROTECTED_TYPES.includes(r.type)).flatMap((r) => {
    if (r.status === "Open") return [`${FT}: ${r.type} row ${r.fix_id} is still Open`];
    if (r.status === "Withdrawn" || r.status === "Duplicate-of") return [];
    const e = [];
    if (!r.resolution.trim()) e.push(`${FT}: ${r.type} row ${r.fix_id} has an empty resolution`);
    if (!r.decision_ref.trim()) e.push(`${FT}: ${r.type} row ${r.fix_id} has an empty decision_ref`);
    else e.push(...decisionRefErrors(r.fix_id, r.decision_ref));
    return e;
  });
}

const isProtected = (r) => PROTECTED_TYPES.includes(r.type) || (isJw(r) && [3, 4].includes(sev(r)));
const needsRef = (types) => types.some((t) => [...PROTECTED_TYPES, "decision"].includes(t));

// A protected Duplicate-of must point at a Decided canonical target with a substantive resolution.
export function checkProtectedDuplicates(rows, resolveRef = () => []) {
  const map = byId(rows);
  return rows.filter((r) => isProtected(r) && r.status === "Duplicate-of").flatMap((r) => {
    const t = map.get(targetIdOf(r));
    if (!t) return [];
    const pair = `${r.fix_id} -> ${t.fix_id}`;
    const res = t.resolution.trim();
    const e = [];
    if (t.status !== "Decided") e.push(`${FT}: protected duplicate ${pair}: target status expected Decided, actual ${t.status}`);
    if (res.length < MIN_RESOLUTION || FIX_ID_PREFIX.test(res)) e.push(`${FT}: protected duplicate ${pair}: target resolution is not substantive ("${res.slice(0, 40)}")`);
    if (needsRef([r.type, t.type]) && !t.decision_ref.trim()) e.push(`${FT}: protected duplicate ${pair}: target has an empty decision_ref`);
    else if (needsRef([r.type, t.type])) e.push(...decisionRefErrors(t.fix_id, t.decision_ref).map((m) => `${m} (protected duplicate ${pair})`));
    return [...e, ...resolveRef(t).map((m) => `${m} (target of ${r.fix_id})`)];
  });
}

// A non-blank decision_ref must have no empty token: ";" and "BD9;" are errors, not an empty or one-item list.
export function decisionRefErrors(fixId, value) {
  return splitRefs(value).some((tok) => !tok) ? [`${FT}: ${fixId} decision_ref "${value}" has an empty token`] : [];
}

const refListErrors = (fixId, value, boardText, entries) => [
  ...decisionRefErrors(fixId, value),
  ...splitRefs(value).filter(Boolean).flatMap((tok) => refErrors(fixId, tok, boardText, entries)),
];

export function checkDecisionRefs(rows, boardDecisionsText, entries) {
  return rows.flatMap((r) => refListErrors(r.fix_id, r.decision_ref, boardDecisionsText, entries));
}

function refErrors(fixId, tok, boardText, entries) {
  if (!/^(BD\d+|C[4-6])$/.test(tok)) return [`${FT}: ${fixId} decision_ref token "${tok}" must be BDn or C4–C6`];
  if (/^BD[1-8]$/.test(tok)) return new RegExp(`^\\|\\s*${tok}\\s*\\|`, "m").test(boardText) ? [] : [`${FT}: ${fixId} decision_ref ${tok} not found in ${BOARD_DECISIONS}`];
  const entry = entries.get(tok);
  if (!entry) return [`${FT}: ${fixId} decision_ref ${tok} has no entry in ${DECISIONS_MD}`];
  return entry.includes(DELEGATION_PHRASE) ? [] : [`${FT}: ${fixId} decision_ref ${tok}: entry in ${DECISIONS_MD} lacks "${DELEGATION_PHRASE}"`];
}

export function checkJwRows(rows) {
  return rows.filter(isJw).flatMap((r) => {
    const e = [];
    const s = sev(r);
    if (s === null || !Number.isInteger(s) || s < 0 || s > 4) e.push(`${FT}: ${r.fix_id} severity expected 0–4, actual "${r.severity}"`);
    if (!JOURNEYS.includes(r.journey)) e.push(`${FT}: ${r.fix_id} journey expected J01–J12, actual "${r.journey}"`);
    for (const c of ["roles", "rule_ref", "source"]) if (!r[c].trim()) e.push(`${FT}: ${r.fix_id} has an empty ${c}`);
    if ([3, 4].includes(s) && r.status === "Open") e.push(`${FT}: ${r.fix_id} has severity ${s} and is still Open`);
    if ([3, 4].includes(s) && !r.resolution.trim()) e.push(`${FT}: ${r.fix_id} has severity ${s} and an empty resolution`);
    return e;
  });
}

// UX rows: id shape, rule_ref equal to the id's rule, and the id set equal to deriveUxPairs (ux_rows.mjs) over the JW rows.
export function checkUxRows(rows, pageIds) {
  const ux = rows.filter((r) => r.fix_id.startsWith("UX-"));
  const shape = ux.flatMap((r) => {
    const m = r.fix_id.match(/^UX-R(\d\d)-([WO]\d\d)$/);
    if (!m) return [`${FT}: ${r.fix_id} does not match UX-Rnn-Wnn`];
    const e = [];
    if (Number(m[1]) < 1 || Number(m[1]) > 12) e.push(`${FT}: ${r.fix_id} rule ${m[1]} is not 01–12`);
    if (!pageIds.includes(m[2])) e.push(`${FT}: ${r.fix_id} page ${m[2]} is not a board page`);
    if (r.rule_ref !== `UX-R${m[1]}`) e.push(`${FT}: ${r.fix_id} rule_ref expected UX-R${m[1]}, actual "${r.rule_ref}"`);
    return e;
  });
  const want = deriveUxPairs(rows);
  const got = new Set(ux.map((r) => r.fix_id));
  return [
    ...shape,
    ...[...want.keys()].filter((id) => !got.has(id)).map((id) => `${FT}: UX row ${id} is missing (cited by ${want.get(id).jw.join(";")})`),
    ...[...got].filter((id) => !want.has(id)).map((id) => `${FT}: UX row ${id} is not cited by any severity 2+ JW row`),
  ];
}

// Journey-walk finding rows: "| id | step | role | platforms | sev | rule refs | … | status · decision |".
// Pages are the W/O ids anywhere in the step cell, so "W24→W54 (+W27 per BD36)" gives W24, W27, W54.
const WALK_ID = 0, WALK_STEP = 1, WALK_SEV = 4, WALK_RULES = 5, WALK_CELLS = 11;
const sortedSet = (xs) => [...new Set(xs)].sort().join(";");
export const stepPages = (step) => sortedSet(step.match(/\b[WO]\d\d\b/g) || []);

// Finding rows start with a JW id (outer pipes optional); a row that does not split into WALK_CELLS cells is an error, not skipped.
const walkCells = (l) => l.trim().replace(/^\|/, "").replace(/(?<!\\)\|$/, "").split(/(?<!\\)\|/).map((c) => c.trim());
export function parseWalkRows(md) {
  return md.split("\n").filter((l) => /^\|?\s*JW-\d{3}\s*\|/.test(l)).map((l) => {
    const c = walkCells(l);
    if (c.length !== WALK_CELLS) return { id: c[WALK_ID], error: `${JOURNEY_WALK_MD}: ${c[WALK_ID]} row has ${c.length} cells, expected ${WALK_CELLS}` };
    return { id: c[WALK_ID], pages: stepPages(c[WALK_STEP]), severity: c[WALK_SEV], ux: sortedSet(uxRulesOf(c[WALK_RULES])) };
  });
}
export const parseWalkFindings = (md) => parseWalkRows(md).filter((f) => !f.error);

// Severity, pages and UX-Rnn tokens of each md finding must equal its CSV row, so UX rows derive from proven JW data.
export function checkWalkFields(md, rows) {
  const map = byId(rows);
  return parseWalkFindings(md).flatMap((f) => {
    const r = map.get(f.id);
    if (!r) return [];
    const csv = { severity: r.severity.trim(), pages: sortedSet(splitList(r.pages).map((x) => x.trim()).filter(Boolean)), ux: sortedSet(uxRulesOf(r.rule_ref)) };
    return ["severity", "pages", "ux"].filter((k) => f[k] !== csv[k]).map((k) => `${JOURNEY_WALK_MD}: ${f.id} ${k === "ux" ? "UX-Rnn tokens" : k} md "${f[k]}" does not match ${FT} "${csv[k]}"`);
  });
}

export function checkJourneyWalk(md, rows) {
  if (md === null) return [`${JOURNEY_WALK_MD}: missing`];
  const e = JOURNEYS.filter((j) => !new RegExp(`^## ${j}\\b`, "m").test(md)).map((j) => `${JOURNEY_WALK_MD}: missing heading ## ${j}`);
  const coverage = (md.split(/^(?=## )/m).find((p) => /^## Coverage\b/.test(p)) || "").split("\n").filter((l) => /^\|\s*J\d\d\s*\|/.test(l));
  if (coverage.length !== JOURNEYS.length * ROLES.length) e.push(`${JOURNEY_WALK_MD}: coverage table expected ${JOURNEYS.length * ROLES.length} rows, actual ${coverage.length}`);
  const pairs = new Set(coverage.map((l) => l.split("|").slice(1, 3).map((c) => c.trim()).join("/")));
  for (const j of JOURNEYS) for (const r of ROLES) if (!pairs.has(`${j}/${r}`)) e.push(`${JOURNEY_WALK_MD}: coverage row ${j}/${r} missing`);
  // Coverage comes from parsed finding rows: each CSV JW id needs exactly one parsed md finding, and vice versa.
  const walk = parseWalkRows(md);
  e.push(...walk.filter((f) => f.error).map((f) => f.error));
  const mdCount = walk.filter((f) => !f.error).reduce((m, f) => m.set(f.id, (m.get(f.id) || 0) + 1), new Map());
  const csvIds = new Set(rows.filter(isJw).map((r) => r.fix_id));
  for (const [id, n] of mdCount) if (n > 1) e.push(`${JOURNEY_WALK_MD}: ${id} has ${n} finding rows, expected 1`);
  for (const id of mdCount.keys()) if (!csvIds.has(id)) e.push(`${JOURNEY_WALK_MD}: ${id} has no row in ${FT}`);
  for (const id of csvIds) if (!mdCount.has(id)) e.push(`${FT}: ${id} has no parsed finding row in ${JOURNEY_WALK_MD}`);
  return [...e, ...checkWalkFields(md, rows)];
}

const readOrNull = (p) => (fs.existsSync(rel(p)) ? fs.readFileSync(rel(p), "utf8") : null);

function phase0(ctx) {
  const { fix, page, expected, lock, pageIds } = ctx;
  return [
    ...checkColumns(fix.columns, FIX_COLUMNS, FT), ...checkColumns(page.columns, PAGE_COLUMNS, PT),
    ...checkFixVocab(fix.rows), ...checkDdCounts(fix.rows, expected),
    ...checkPresent(fix.rows, MANDATORY_BD.slice(0, 8), { type: "decision" }),
    ...checkDuplicates(fix.rows),
    ...checkPageRows(page.rows, expected, pageIds), ...checkPageInitial(page.rows), ...checkAnchors(page.rows),
    ...checkLock(lock, (p) => (fs.existsSync(rel(p)) ? fs.readFileSync(rel(p)) : null)),
  ];
}

function phase1(ctx) {
  const { fix, boardText, entries, pageIds, walkMd } = ctx;
  const resolveRef = (t) => refListErrors(t.fix_id, t.decision_ref, boardText, entries);
  return [
    ...checkPresent(fix.rows, ["C4", "C5", "C6"]),
    ...checkMandatoryDecisions(fix.rows, entries),
    ...checkConflictRows(fix.rows), ...checkProtectedDuplicates(fix.rows, resolveRef),
    ...checkDecisionRefs(fix.rows, boardText, entries),
    ...checkJwRows(fix.rows),
    // The walk check (md vs CSV JW fields) runs before the UX check, which derives its pair set from those JW rows.
    ...checkJourneyWalk(walkMd, fix.rows), ...checkUxRows(fix.rows, pageIds),
  ];
}

function main(argv) {
  const i = argv.indexOf("--phase");
  const phase = i >= 0 ? argv[i + 1] : "1";
  if (!["0", "1"].includes(phase)) throw new Error(`--phase expected 0 or 1, actual ${phase}`);
  const expected = JSON.parse(fs.readFileSync(rel(EXPECTED_COUNTS), "utf8"));
  const ctx = {
    fix: parseCsv(fs.readFileSync(rel(FIX_TRACKER), "utf8")), page: parseCsv(fs.readFileSync(rel(PAGE_TRACKER), "utf8")),
    expected, lock: JSON.parse(fs.readFileSync(rel(INPUTS_LOCK), "utf8")),
    boardText: fs.readFileSync(rel(BOARD_DECISIONS), "utf8"), entries: parseDecisionEntries(readOrNull(DECISIONS_MD) || ""),
    pageIds: JSON.parse(fs.readFileSync(rel(SPEC_DIR, "board_manifest.json"), "utf8")).pages.map((p) => p.id), walkMd: readOrNull(JOURNEY_WALK_MD),
  };
  if (expected.variances?.length) console.log(`check_tracker: recorded count variances:\n${JSON.stringify(expected.variances, null, 2)}`);
  const errors = [...phase0(ctx), ...(phase === "1" ? phase1(ctx) : [])];
  if (errors.length) { console.error(`check_tracker --phase ${phase} FAILED (${errors.length}):\n  ${errors.join("\n  ")}`); return 1; }
  const n = (f) => ctx.fix.rows.filter(f).length;
  console.log(`check_tracker --phase ${phase} passed: ${ctx.fix.rows.length} fix rows (${n(isDd)} DD, ${n((r) => r.type === "decision")} decision, ${n((r) => r.type === "conflict")} conflict, ${n(isJw)} JW, ${n((r) => r.type === "ux-rule")} UX), ${ctx.page.rows.length} page rows; statuses ${STATUSES.filter((s) => n((r) => r.status === s)).map((s) => `${s} ${n((r) => r.status === s)}`).join(", ")}. Source checks only.`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.exitCode = main(process.argv.slice(2)); } catch (e) { console.error(`check_tracker: ${e.message}`); process.exitCode = 1; }
}
