// Phase 2c: page file layout, discovery and the full site load (team plan Step 3).
// Page files live in pages/<segment folder>/<ID>.js; pageFiles() validates the layout and returns the sorted
// list, siteFiles() gives the script order after DATA_FILES, and loadSite() loads it all in a bare node:vm
// context. load_kit.mjs and load_data.mjs are unchanged.
import fs from "node:fs";
import path from "node:path";
import { loadAll, DATA_DIR, dataPath } from "./load_data.mjs";
import { SEGMENTS } from "./page_meta.mjs";

export const SEGMENT_DIRS = Object.freeze(["seg1-access", "seg2-course", "seg3-submit", "seg4-community", "seg5-authoring", "seg6-grading", "optional"]);
export const PAGE_PRE = Object.freeze(["pages/register.js", "pages/placeholder.js", "pages/shared.js", "pages/calendar.js", "pages/teaching.js"]);
export const PAGE_SEAL = "pages/seal.js";
export const VIEWER_PURE = Object.freeze(["viewer/route.js", "viewer/compose.js", "viewer/tours.js", "viewer/bar.js", "viewer/interact.js", "viewer/board.js"]);

const PAGE_FILE = /^[WO]\d\d\.js$/;
const DEFINE_CALL = /WB\.definePage\(\s*["']([^"']*)["']/g;

// Optional pages (O01–O03) live in "optional" even though their manifest segment is 6.
export function folderFor(id) {
  if (id.startsWith("O")) return "optional";
  const segment = SEGMENTS[id];
  if (!segment) throw new Error(`pageFiles: unknown page id '${id}'`);
  return SEGMENT_DIRS[segment - 1];
}

function nestedJs(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return nestedJs(p);
    return d.name.endsWith(".js") ? [p] : [];
  });
}

function checkPageFile(root, folder, name) {
  const rel = `pages/${folder}/${name}`;
  if (!PAGE_FILE.test(name)) throw new Error(`pageFiles: ${rel} is not named <ID>.js`);
  const id = name.slice(0, 3);
  const want = folderFor(id);
  if (want !== folder) throw new Error(`pageFiles: ${rel} belongs in pages/${want}/`);
  const text = fs.readFileSync(path.join(root, rel), "utf8");
  const ids = [...text.matchAll(DEFINE_CALL)].map((m) => m[1]);
  if (!ids.length) throw new Error(`pageFiles: ${rel} has no WB.definePage("${id}") call`);
  const wrong = ids.filter((x) => x !== id);
  if (wrong.length) throw new Error(`pageFiles: ${rel} defines ${wrong.join(", ")}, not ${id}`);
  return { folder, id, rel };
}

function folderFiles(root, folder) {
  const dir = path.join(root, "pages", folder);
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    if (d.isDirectory()) {
      const deep = nestedJs(path.join(dir, d.name));
      if (deep.length) throw new Error(`pageFiles: ${path.relative(root, deep[0])} is nested too deep`);
      return [];
    }
    if (d.name.endsWith(".md")) return [];
    if (!d.name.endsWith(".js")) return [];
    return [checkPageFile(root, folder, d.name)];
  });
}

// Sorted pages/<dir>/<ID>.js paths (folder order, then id), relative to root. Throws on any layout error.
export function pageFiles({ root = DATA_DIR } = {}) {
  const pagesDir = path.join(root, "pages");
  if (!fs.existsSync(pagesDir)) return [];
  const folders = fs.readdirSync(pagesDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  const unknown = folders.filter((f) => !SEGMENT_DIRS.includes(f));
  if (unknown.length) throw new Error(`pageFiles: pages/${unknown[0]}/ is not a segment folder (${SEGMENT_DIRS.join(", ")})`);
  const found = SEGMENT_DIRS.filter((f) => folders.includes(f)).flatMap((f) => folderFiles(root, f));
  const order = (x) => SEGMENT_DIRS.indexOf(x.folder);
  return [...found].sort((a, b) => order(a) - order(b) || a.id.localeCompare(b.id)).map((x) => x.rel);
}

// Script order after DATA_FILES, as paths relative to design/final. extraPageFiles (absolute) is for tests only.
export function siteFiles({ extraPageFiles = [] } = {}) {
  return [...PAGE_PRE, ...pageFiles(), ...extraPageFiles, PAGE_SEAL, ...VIEWER_PURE];
}

export const sitePath = (f) => (path.isAbsolute(f) ? f : dataPath(f));

export function loadSite({ extraPageFiles = [], extra = [] } = {}) {
  return loadAll({ extra: [...siteFiles({ extraPageFiles }).map(sitePath), ...extra] });
}
