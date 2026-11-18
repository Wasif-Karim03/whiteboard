// Phase 2c size budgets for the three built files (team plan Step 8).
// Run: node design/final/tools/check_size.mjs [distDir]
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { DATA_DIR } from "./load_data.mjs";

export const SIZE_BUDGETS = Object.freeze({
  "Whiteboard-Final.html": 900 * 1024,
  "Whiteboard-Final-Board.html": 900 * 1024,
  "Whiteboard-Final-Spec.html": 1012975,
});

export function sizeReport(distDir = path.join(DATA_DIR, "dist")) {
  return Object.entries(SIZE_BUDGETS).map(([name, budget]) => {
    const file = path.join(distDir, name);
    return { name, budget, bytes: fs.existsSync(file) ? fs.statSync(file).size : null };
  });
}

export function checkSize(distDir) {
  return sizeReport(distDir).flatMap((r) => {
    if (r.bytes === null) return [`size: ${r.name} is missing`];
    return r.bytes > r.budget ? [`size: ${r.name} is ${r.bytes} bytes (budget ${r.budget})`] : [];
  });
}

function main() {
  const dir = process.argv[2] ? path.resolve(process.argv[2]) : undefined;
  const errors = checkSize(dir);
  for (const r of sizeReport(dir)) console.log(`${r.name}: ${r.bytes ?? "missing"} / ${r.budget} bytes`);
  for (const e of errors) console.log(e);
  console.log(`check_size: ${errors.length} errors. Source checks only.`);
  return errors.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
