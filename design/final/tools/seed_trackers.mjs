// One-time seeder for design/final/tracker/. Reads sources, never writes them.
// Always regenerates page_tracker.csv. Writes fix_tracker.csv, expected_counts.json and inputs.lock.json
// only when fix_tracker.csv does not exist yet, or when given --force.
// Usage (from repo root): node design/final/tools/seed_trackers.mjs [--force]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { toCsv, joinList } from "./csv.mjs";
import { sha256, json } from "./extract_board.mjs";
import { SEGMENTS, STAGES, tierFor } from "./page_meta.mjs";
import { BOARD_DECISIONS, DEEP_DIVE, EXPECTED_COUNTS, FIX_COLUMNS, FIX_TRACKER, INPUTS_LOCK, LOCKED_INPUTS, PAGE_COLUMNS, PAGE_INITIAL, PAGE_TRACKER, PLATFORMS, SPEC_DIR, rel } from "./schema.mjs";

const PLANNED = Object.freeze({ dd_total: 118, dd_by_part: [22, 16, 22, 18, 20, 20], rule_conflicts: 28, withdrawn: ["DD-6.07"], page_rows: 189, tiers: { web: [63, 0, 0], ipad: [41, 19, 3], iphone: [36, 24, 3] } });
const FIX_LIST_HEADING = /^## Segment fix list/;
const NOTE_CHARS = 140;
const RESOLUTION_CHARS = 200;

const blankFix = () => Object.fromEntries(FIX_COLUMNS.map((c) => [c, ""]));
const pageIdsIn = (text) => [...new Set(text.match(/[WO]\d\d/g) || [])].sort();
export const shorten = (text, max) => (text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`);

// Parses one numbered fix-list line: "N. [tag] text" or "N. (Withdrawn …)". Returns null for other lines.
export function parseDdItem(line) {
  const m = line.match(/^(\d+)\.\s+(.*)$/);
  if (!m) return null;
  const tagged = m[2].match(/^\[([a-z-]+)\]\s*(.*)$/);
  if (tagged) return { n: Number(m[1]), type: tagged[1], text: tagged[2] };
  if (m[2].startsWith("(Withdrawn")) return { n: Number(m[1]), type: "withdrawn", text: m[2] };
  return { n: Number(m[1]), type: "", text: m[2] };
}

// Reads the numbered items that follow each "## Segment fix list" heading. Part = heading order (1–6).
export function parseDeepDive(text) {
  const lines = text.split("\n");
  const starts = lines.flatMap((l, i) => (FIX_LIST_HEADING.test(l) ? [i] : []));
  return starts.flatMap((start, p) => {
    let i = start + 1;
    while (i < lines.length && lines[i].trim() === "") i += 1;
    const items = [];
    for (; i < lines.length; i += 1) {
      const item = parseDdItem(lines[i]);
      if (!item) break;
      items.push({ ...item, part: p + 1, line: i + 1 });
    }
    return items;
  });
}

export function ddRow(item) {
  return {
    ...blankFix(),
    fix_id: `DD-${item.part}.${String(item.n).padStart(2, "0")}`,
    source: `${path.basename(DEEP_DIVE)}:${item.line}`,
    type: item.type,
    pages: joinList(pageIdsIn(item.text)),
    status: item.type === "withdrawn" ? "Withdrawn" : "Open",
    notes: shorten(item.text, NOTE_CHARS),
  };
}

// Board decisions table rows: "| BDn | Question | Decision | Why |".
export function parseBoardDecisions(text) {
  return text.split("\n").flatMap((l, i) => {
    const m = l.match(/^\|\s*(BD\d+)\s*\|([^|]*)\|([^|]*)\|/);
    return m ? [{ id: m[1], question: m[2].trim(), decision: m[3].trim(), line: i + 1 }] : [];
  });
}

const bdRow = (d) => ({ ...blankFix(), fix_id: d.id, source: `${path.basename(BOARD_DECISIONS)}:${d.line}`, type: "decision", decision_ref: d.id, resolution: shorten(d.decision, RESOLUTION_CHARS), status: "Decided", notes: d.question });

export function buildPageRows(manifest) {
  return manifest.pages.flatMap((p) => PLATFORMS.map((platform) => {
    const t = tierFor(p.roles, p.id, platform);
    return { page_id: p.id, page_name: p.name, segment: String(SEGMENTS[p.id]), stage: STAGES[p.id], roles: p.roles, platform, ...t, ...PAGE_INITIAL };
  }));
}

const tierCounts = (rows, platform) => ["full", "review", "handoff"].map((t) => rows.filter((r) => r.platform === platform && r.tier === t).length);

// "Record, don't force": actual values replace planned ones, each change logged with evidence.
export function expectedCounts(items, pageRows) {
  const dd = items.map(ddRow);
  const firstLine = (part) => items.find((x) => x.part === part)?.line ?? 0;
  const actual = {
    dd_total: dd.length,
    dd_by_part: [1, 2, 3, 4, 5, 6].map((p) => items.filter((x) => x.part === p).length),
    rule_conflicts: dd.filter((r) => r.type === "rule-conflict").length,
    withdrawn: dd.filter((r) => r.status === "Withdrawn").map((r) => r.fix_id),
    page_rows: pageRows.length,
    tiers: Object.fromEntries(PLATFORMS.map((pl) => [pl, tierCounts(pageRows, pl)])),
  };
  const evidence = (k) => (k === "page_rows" || k === "tiers" ? `${PAGE_TRACKER}:1` : `${DEEP_DIVE}:${firstLine(1)}`);
  const variances = Object.keys(PLANNED).filter((k) => JSON.stringify(PLANNED[k]) !== JSON.stringify(actual[k])).map((k) => ({ what: k, planned: PLANNED[k], actual: actual[k], evidence: evidence(k) }));
  return { ...actual, variances };
}

const lockEntry = (p) => { const buf = fs.readFileSync(rel(p)); return { path: p, bytes: buf.length, sha256: sha256(buf) }; };

function main(argv) {
  const manifest = JSON.parse(fs.readFileSync(rel(SPEC_DIR, "board_manifest.json"), "utf8"));
  const pageRows = buildPageRows(manifest);
  fs.mkdirSync(rel(path.dirname(PAGE_TRACKER)), { recursive: true });
  fs.writeFileSync(rel(PAGE_TRACKER), toCsv(pageRows, PAGE_COLUMNS));
  console.log(`seed_trackers: wrote ${PAGE_TRACKER} (${pageRows.length} rows)`);
  if (fs.existsSync(rel(FIX_TRACKER)) && !argv.includes("--force")) {
    console.log(`seed_trackers: ${FIX_TRACKER} exists; not overwriting it, ${EXPECTED_COUNTS} or ${INPUTS_LOCK} (use --force)`);
    return 0;
  }
  const items = parseDeepDive(fs.readFileSync(rel(DEEP_DIVE), "utf8"));
  const decisions = parseBoardDecisions(fs.readFileSync(rel(BOARD_DECISIONS), "utf8"));
  const fixRows = [...items.map(ddRow), ...decisions.map(bdRow)];
  const counts = expectedCounts(items, pageRows);
  fs.writeFileSync(rel(FIX_TRACKER), toCsv(fixRows, FIX_COLUMNS));
  fs.writeFileSync(rel(EXPECTED_COUNTS), json(counts));
  fs.writeFileSync(rel(INPUTS_LOCK), json(LOCKED_INPUTS.map(lockEntry)));
  console.log(`seed_trackers: wrote ${FIX_TRACKER} (${items.length} DD + ${decisions.length} BD rows), ${EXPECTED_COUNTS} (${counts.variances.length} variances), ${INPUTS_LOCK}`);
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.exitCode = main(process.argv.slice(2)); } catch (e) { console.error(`seed_trackers: ${e.message}`); process.exitCode = 1; }
}
