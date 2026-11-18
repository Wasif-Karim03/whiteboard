// Phase 2c: one command for every source check (team plan Step 8). Builds design/final/dist, runs the test
// suite and the CLI checks as child processes (no shell), runs render, lines, size and offline in-process,
// runs the Phase 4 integration checks and writes dist/verification.json. Exits 1 when any
// check fails, including the test suite. legacy_check.sh stays a separate proof (it copies the whole repo).
// Source checks only. Not browser, device or accessibility acceptance.
// Run: node design/final/tools/check_all.mjs
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { DATA_DIR } from "./load_data.mjs";
import { loadSite } from "./load_site.mjs";
import { build, DIST_DIR } from "../build.mjs";
import { checkRender, EXPECTED_TARGETS } from "./check_render.mjs";
import { lineReport } from "./check_lines.mjs";
import { checkSize } from "./check_size.mjs";
import { checkOfflineDir } from "./check_offline.mjs";
import { checkLinks, checkReach } from "./check_navigation.mjs";
import { checkLeaks, checkAuthority, checkFictional } from "./check_boundaries.mjs";

export const LABEL = "Source checks only. Not browser, device or accessibility acceptance.";
const REPO = path.join(DATA_DIR, "..", "..");
const TOOLS = "design/final/tools";
const DETAIL_LINES = 20;
export const SPAWNED = Object.freeze([
  ["tests", ["--test", `${TOOLS}/index.js`], "last"],
  ["check_tokens", [`${TOOLS}/check_tokens.mjs`], "first"],
  ["check_fixtures", [`${TOOLS}/check_fixtures.mjs`], "first"],
  ["check_manifest", [`${TOOLS}/check_manifest.mjs`], "first"],
  ["check_vocab", [`${TOOLS}/check_vocab.mjs`], "first"],
  ["extract_board_verify", [`${TOOLS}/extract_board.mjs`, "--verify"], "first"],
  ["check_tracker_phase0", [`${TOOLS}/check_tracker.mjs`, "--phase", "0"], "first"],
  ["check_tracker_phase1", [`${TOOLS}/check_tracker.mjs`, "--phase", "1"], "first"],
]);
export const INTEGRATION_CHECKS = Object.freeze([["check_links", checkLinks], ["check_reach", checkReach], ["check_leaks", checkLeaks], ["check_authority", checkAuthority], ["check_fictional", checkFictional]]);

// The test runner ends with a block of "ℹ" counters; report its pass and fail counts instead of the duration.
const summaryOf = (out, keep) => (keep === "last" ? out.filter((l) => /^ℹ (tests|pass|fail) /.test(l)).join(", ") : "") || out[out.length - 1];
const lines = (text) => String(text || "").split("\n").map((l) => l.trimEnd()).filter(Boolean);

export function runChild([id, args, keep]) {
  const r = spawnSync(process.execPath, args, { cwd: REPO, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const out = lines(`${r.stdout || ""}\n${r.stderr || ""}`);
  const failed = r.status !== 0 || r.signal !== null || Boolean(r.error);
  const counted = /(\d+) errors?\b/.exec(out.slice(-3).join(" "));
  return {
    id,
    status: failed ? "fail" : "pass",
    errors: failed ? Math.max(1, counted ? Number(counted[1]) : 1) : 0,
    summary: r.error ? `could not run: ${r.error.message}` : r.signal ? `killed by ${r.signal}` : summaryOf(out, keep) || `exit ${r.status}`,
    details: keep === "last" ? out.slice(-DETAIL_LINES) : out.slice(0, DETAIL_LINES),
  };
}

function inProcess(id, run) {
  try {
    const { errors, summary } = run();
    return { id, status: errors.length ? "fail" : "pass", errors: errors.length, summary, details: errors.slice(0, DETAIL_LINES) };
  } catch (err) {
    return { id, status: "fail", errors: 1, summary: `threw: ${err.message}`, details: lines(err.stack).slice(0, DETAIL_LINES) };
  }
}

function localChecks(distDir) {
  return [
    inProcess("check_render", () => {
      const r = checkRender(loadSite());
      return { errors: r.errors, summary: `${r.renders} renders, ${r.targets.size}/${EXPECTED_TARGETS} page×platform targets` };
    }),
    inProcess("check_lines", () => {
      const r = lineReport();
      return { errors: r.errors, summary: `${r.files.length} files, ${r.exempt.length} exemptions` };
    }),
    inProcess("check_size", () => ({ errors: checkSize(distDir), summary: "3 files within budget" })),
    inProcess("check_offline", () => {
      const reports = checkOfflineDir(distDir);
      const cites = reports.reduce((n, r) => n + r.citations, 0);
      return { errors: reports.flatMap((r) => r.errors), summary: `${reports.length} files, ${cites} plain-text https citations in the spec` };
    }),
  ];
}

function integrationChecks() {
  const W = loadSite();
  return INTEGRATION_CHECKS.map(([id, run]) => inProcess(id, () => run(W)));
}

export function checkAll({ distDir = DIST_DIR } = {}) {
  let dist = [];
  const buildCheck = inProcess("build", () => {
    dist = build({ outDir: distDir });
    return { errors: [], summary: `${dist.length} files written` };
  });
  const checks = [buildCheck, ...SPAWNED.map(runChild), ...localChecks(distDir), ...integrationChecks()];
  const report = { label: LABEL, generated_at: new Date().toISOString(), node: process.version, checks, dist };
  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(path.join(distDir, "verification.json"), JSON.stringify(report, null, 2) + "\n");
  return report;
}

function main() {
  const report = checkAll();
  for (const c of report.checks) console.log(`${c.status.padEnd(4)} ${c.id}: ${c.summary}`);
  const failed = report.checks.filter((c) => c.status === "fail");
  for (const c of failed) for (const d of c.details) console.log(`  ${c.id}: ${d}`);
  console.log(`check_all: ${report.checks.length} checks, ${failed.length} failed, ${report.checks.filter((c) => c.status === "todo").length} todo. ${LABEL}`);
  return failed.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
