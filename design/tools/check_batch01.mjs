// Kept for the Batch 01 command recorded in SESSION_NOTES; delegates to the shared checker.
// Usage (from repo root): node design/tools/check_batch01.mjs
import { BATCHES } from "../batches.mjs";
import { crossBatchIndex } from "./load.mjs";
import { checkBatch } from "./check_batch.mjs";

const r = checkBatch(BATCHES.find((b) => b.key === "batch01"), crossBatchIndex());
if (r.failures.length) { console.error(r.failures.slice(0, 40).join("\n")); console.error(`${r.failures.length} failure(s)`); process.exit(1); }
console.log(`Batch 01 static checks passed: ${r.screens} screens, ${r.design_states} states, ${r.renders} renders. No browser/device test run.`);
