// Phase 2c line budget (team plan Step 8): every .js, .mjs, .css, .sh and .md file under design/final is at
// most 800 lines, except spec/, dist/ and tracker/ (generated or data). EXEMPT lists any deliberate exception
// with its reason; there are none today.
// Run: node design/final/tools/check_lines.mjs
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { DATA_DIR } from "./load_data.mjs";

export const MAX_LINES = 800;
export const EXEMPT = Object.freeze({});
const EXTENSIONS = new Set([".js", ".mjs", ".css", ".sh", ".md"]);
const SKIP_DIRS = new Set(["spec", "dist", "tracker"]);

function walk(dir, rel = "") {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const r = rel ? `${rel}/${d.name}` : d.name;
    if (d.isDirectory()) return !rel && SKIP_DIRS.has(d.name) ? [] : walk(path.join(dir, d.name), r);
    return EXTENSIONS.has(path.extname(d.name)) ? [r] : [];
  });
}

export const lineCount = (text) => text.split("\n").length - (text.endsWith("\n") ? 1 : 0);

// Returns {files, errors, exempt}; paths are relative to design/final.
export function lineReport(root = DATA_DIR) {
  const files = walk(root).map((rel) => ({ rel, lines: lineCount(fs.readFileSync(path.join(root, rel), "utf8")) }));
  const over = files.filter((f) => f.lines > MAX_LINES);
  return {
    files,
    errors: over.filter((f) => !EXEMPT[f.rel]).map((f) => `lines: ${f.rel} has ${f.lines} lines (max ${MAX_LINES})`),
    exempt: over.filter((f) => EXEMPT[f.rel]).map((f) => `${f.rel} (${f.lines}): ${EXEMPT[f.rel]}`),
  };
}

export function checkLines(root = DATA_DIR) {
  return lineReport(root).errors;
}

function main() {
  const r = lineReport();
  for (const e of r.errors) console.log(e);
  for (const x of r.exempt) console.log(`exempt: ${x}`);
  console.log(`check_lines: ${r.files.length} files, ${r.errors.length} errors, ${r.exempt.length} exemptions. Source checks only.`);
  return r.errors.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
