// Phase 2c build: three offline single-file HTML outputs (team plan Step 7).
//   Whiteboard-Final.html        the prototype viewer (kit, data, pages, viewer and app.js)
//   Whiteboard-Final-Board.html  the board gallery (same scripts with gallery.js)
//   Whiteboard-Final-Spec.html   the static spec (no script)
// Validates the whole site with loadSite() before writing anything. Output is deterministic: no timestamps,
// no randomness. Each file is written to <name>.tmp and renamed. Never touches design/build.mjs.
// Run: node design/final/build.mjs [--out <dir>]
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
import { KIT_FILES, KIT_DIR } from "./tools/load_kit.mjs";
import { DATA_FILES, DATA_DIR, dataPath } from "./tools/load_data.mjs";
import { loadSite, pageFiles, sitePath, PAGE_PRE, PAGE_SEAL, VIEWER_PURE } from "./tools/load_site.mjs";
import { renderSpec } from "./tools/build_spec.mjs";
import { parseCsv } from "./tools/csv.mjs";

export const DIST_DIR = path.join(DATA_DIR, "dist");
export const OUTPUTS = Object.freeze({ app: "Whiteboard-Final.html", board: "Whiteboard-Final-Board.html", spec: "Whiteboard-Final-Spec.html" });
export const CSS_FILES = Object.freeze([
  "tokens.css", "base.css",
  "components-core.css", "components-forms.css", "components-data.css", "components-signature.css", "components-overlay.css",
  "shell-web.css", "shell-ipad.css", "shell-iphone.css",
  "viewer.css",
]);
const CSP_SCRIPT = "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; base-uri 'none'; form-action 'none'";
const CSP_STATIC = "default-src 'none'; style-src 'unsafe-inline'; script-src 'none'; base-uri 'none'; form-action 'none'";

const read = (p) => fs.readFileSync(p, "utf8");
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function styleBlock(workspace) {
  return "<style>\n" + [...CSS_FILES, ...(workspace ? ["workspace.css"] : [])].map((f) => `/* system/${f} */\n${read(path.join(DATA_DIR, "system", f))}`).join("\n") + "</style>";
}

// [label, absolute path] in <script> order; extraPageFiles are absolute and load before pages/seal.js.
export function scriptSources({ entry, extraPageFiles = [] }) {
  const site = (f) => [path.isAbsolute(f) ? path.relative(DATA_DIR, f) : f, sitePath(f)];
  return [
    ...KIT_FILES.map((f) => [`kit/${f}`, path.join(KIT_DIR, f)]),
    ...DATA_FILES.map((f) => [f, dataPath(f)]),
    ...PAGE_PRE.map(site),
    ...pageFiles().map(site),
    ...extraPageFiles.map(site),
    site(PAGE_SEAL),
    ...VIEWER_PURE.map(site),
    site(entry),
  ];
}

function scriptBlocks(sources) {
  return sources.map(([label, file]) => {
    const src = read(file);
    if (/<\/script/i.test(src)) throw new Error(`build: ${label} contains "</script"`);
    return `<script>/* ${label} */\n${src}\n</script>`;
  }).join("\n");
}

function head(title, csp, workspace = false) {
  return (
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    `<meta http-equiv="Content-Security-Policy" content="${csp}">\n<title>${esc(title)}</title>\n${styleBlock(workspace)}\n</head>\n`
  );
}

function appHtml(WB, scripts) {
  return (
    head("Whiteboard · Final design prototype (fictional data)", CSP_SCRIPT, true) +
    '<body class="wb-viewer">\n' + WB.icons.sprite() + "\n" +
    '<button type="button" class="wb-vskip" data-v-act="skip">Skip to prototype</button>\n' +
    '<div id="v-bar"></div>\n<div id="v-tour" class="wb-tourwrap" hidden></div>\n' +
    '<p id="v-status" class="wb-vstatus" role="status"></p>\n' +
    '<div id="v-stage" class="wb-viewer-stage" role="region" aria-label="Prototype screen" tabindex="-1"></div>\n' +
    "<noscript><p>The prototype needs JavaScript. Whiteboard-Final-Spec.html works without it.</p></noscript>\n" +
    scripts + "\n</body></html>\n"
  );
}

function boardHtml(WB, scripts) {
  return (
    head("Whiteboard · Final design board (fictional data)", CSP_SCRIPT, true) +
    '<body class="wb-viewer">\n' + WB.icons.sprite() + '\n<div id="b-root"></div>\n' +
    "<noscript><p>The board needs JavaScript. Whiteboard-Final-Spec.html works without it.</p></noscript>\n" +
    scripts + "\n</body></html>\n"
  );
}

function specHtml(WB) {
  const index = JSON.parse(read(path.join(DATA_DIR, "spec", "index.json")));
  const body = renderSpec({
    index,
    readFragment: (file) => read(path.join(DATA_DIR, "spec", file)),
    decisionsMd: read(path.join(DATA_DIR, "decisions.md")),
    fixRows: parseCsv(read(path.join(DATA_DIR, "tracker", "fix_tracker.csv"))).rows,
    pageRows: parseCsv(read(path.join(DATA_DIR, "tracker", "page_tracker.csv"))).rows,
    pages: WB.manifest.pages,
    prototypeHref: WB.viewer.prototypeHref,
  });
  return head("Whiteboard · Final design spec (fictional data)", CSP_STATIC) + '<body class="wb-viewer">\n' + body + "\n</body></html>\n";
}

function writeAtomic(dir, name, text) {
  const file = path.join(dir, name);
  fs.writeFileSync(file + ".tmp", text);
  fs.renameSync(file + ".tmp", file);
  return { name, bytes: Buffer.byteLength(text), sha256: sha256(text) };
}

export function build({ outDir = DIST_DIR, extraPageFiles = [] } = {}) {
  const WB = loadSite({ extraPageFiles });
  const files = [
    [OUTPUTS.app, appHtml(WB, scriptBlocks(scriptSources({ entry: "viewer/app.js", extraPageFiles })))],
    [OUTPUTS.board, boardHtml(WB, scriptBlocks(scriptSources({ entry: "viewer/gallery.js", extraPageFiles })))],
    [OUTPUTS.spec, specHtml(WB)],
  ];
  fs.mkdirSync(outDir, { recursive: true });
  return files.map(([name, text]) => writeAtomic(outDir, name, text));
}

function main() {
  const at = process.argv.indexOf("--out");
  const outDir = at > 0 ? path.resolve(process.argv[at + 1] || "") : DIST_DIR;
  const out = build({ outDir });
  for (const f of out) console.log(`${f.name} ${f.bytes} bytes sha256 ${f.sha256}`);
  console.log(`build: ${out.length} files in ${path.relative(process.cwd(), outDir) || "."}`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
