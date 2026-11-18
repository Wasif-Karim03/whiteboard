// Loads the frozen kit plus the Phase 2b manifest and fixtures into one fresh, bare node:vm context.
// load_kit.mjs is unchanged; 2c reuses DATA_FILES (after KIT_FILES) for <script> order.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadKit, KIT_FILES } from "./load_kit.mjs";

export const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
export const DATA_FILES = Object.freeze([
  "manifest/define.js",
  "manifest/states.js",
  "manifest/status.js",
  "manifest/pages.js",
  "manifest/navigation.js",
  "manifest/journeys.js",
  "manifest/anchors.js",
  "fixtures/world.js",
  "fixtures/coursework.js",
  "fixtures/grades.js",
  "fixtures/quiz.js",
  "fixtures/groups.js",
  "fixtures/comms.js",
  "fixtures/calendar.js",
  "fixtures/staff.js",
  "fixtures/activity.js",
  "fixtures/samples.js",
  "fixtures/scenarios.js",
  "fixtures/teaching.js",
  "fixtures/teaching-selection.js",
  "manifest/finalize.js",
]);

export const dataPath = (f) => path.join(DATA_DIR, f);

export function loadAll({ extra = [] } = {}) {
  return loadKit({ files: [...KIT_FILES, ...DATA_FILES.map(dataPath), ...extra] });
}
