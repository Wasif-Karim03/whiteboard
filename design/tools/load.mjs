// Shared loader: reads the canonical app map and runs a batch's renderer sources in a VM.
// Used by the build and the static checker so both see exactly the same registry.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { BATCHES } from "../batches.mjs";

export const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const read = (...p) => fs.readFileSync(path.join(base, ...p), "utf8");
export const screens = JSON.parse(read("..", "showcase", "app_map", "screens.json"));
export const routes = JSON.parse(read("..", "showcase", "app_map", "routes.json"));
export const brief = (id) => screens.find((s) => s.id === id);

// Map every designed screen to the batch page that renders it (for cross-batch links).
export function crossBatchIndex() {
  const xb = {};
  for (const b of BATCHES) {
    const { K } = runBatch(b, { screens, edges: [] });
    for (const id of K.order) xb[id] = { file: path.basename(b.out), batch: b.label, states: K.screens[id].states.map((s) => s[0]) };
  }
  return xb;
}

export function mapFor(b, xb) {
  return {
    screens: screens.map((s) => (b.ids.includes(s.id) ? s : { id: s.id, title: s.title, status: s.status })),
    edges: routes.edges.filter((e) => b.ids.includes(e.source) || b.ids.includes(e.target)),
    journeys: b.journeys.map((j) => routes.journeys.find((x) => x.id === j)),
    xb: Object.fromEntries(Object.entries(xb || {}).filter(([id]) => !b.ids.includes(id))),
  };
}

export function runBatch(b, MAP) {
  const sandbox = { window: { MAP } };
  vm.createContext(sandbox);
  for (const f of b.js) vm.runInContext(read(f), sandbox, { filename: f });
  return { K: sandbox.window.K, PV: sandbox.window.PV, sandbox };
}
