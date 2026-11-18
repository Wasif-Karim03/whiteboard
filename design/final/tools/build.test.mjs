// Phase 2c tests: the build, the spec file and the source checks (team plan Step 9). Builds into temporary
// directories only; never touches design/build.mjs. Source checks only.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { build, OUTPUTS } from "../build.mjs";
import { DATA_DIR } from "./load_data.mjs";
import { loadSite } from "./load_site.mjs";
import { parseCsv } from "./csv.mjs";
import { checkSize } from "./check_size.mjs";
import { checkOffline, offlineReport as checkOfflineReport } from "./check_offline.mjs";
import { checkLines } from "./check_lines.mjs";
import { checkRender, EXPECTED_TARGETS } from "./check_render.mjs";
import { runChild } from "./check_all.mjs";

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "wb-build-"));
const OUT = tmp();
const BUILT = build({ outDir: OUT });
const read = (name, dir = OUT) => fs.readFileSync(path.join(dir, name), "utf8");
const decode = (s) => s.split("&" + "amp;").join("&");
const W = loadSite();

test("build writes three files and is byte-identical on a second run", () => {
  assert.deepEqual(BUILT.map((f) => f.name), [OUTPUTS.app, OUTPUTS.board, OUTPUTS.spec]);
  const again = tmp();
  const second = build({ outDir: again });
  for (const name of Object.values(OUTPUTS)) assert.equal(read(name, again), read(name), name);
  assert.deepEqual(second.map((f) => f.sha256), BUILT.map((f) => f.sha256));
  assert.deepEqual(fs.readdirSync(OUT).sort(), Object.values(OUTPUTS).sort());
});

test("the app file loads scripts in the plan's order; the board file uses gallery.js, not app.js", () => {
  const app = read(OUTPUTS.app);
  const order = ["/* kit/core.js */", "/* manifest/define.js */", "/* pages/register.js */", "/* pages/seal.js */", "/* viewer/route.js */", "/* viewer/interact.js */", "/* viewer/app.js */"];
  const at = order.map((h) => app.indexOf(h));
  for (const [i, h] of order.entries()) assert.ok(at[i] >= 0, `${h} missing`);
  assert.deepEqual(at, [...at].sort((a, b) => a - b));
  const board = read(OUTPUTS.board);
  assert.ok(board.includes("/* viewer/gallery.js */"));
  assert.ok(!board.includes("/* viewer/app.js */"));
});

test("checkSize and checkOffline pass for all three files", () => {
  assert.deepEqual(checkSize(OUT), []);
  for (const name of Object.values(OUTPUTS)) assert.deepEqual(checkOffline(name, read(name)), [], name);
  assert.ok(read(OUTPUTS.app).includes("Prototype controls · fictional data"));
});

test("checkOffline flags an external image, a network call and a remote url(", () => {
  const app = read(OUTPUTS.app);
  const inject = (s) => app.replace("</body>", `${s}</body>`);
  assert.ok(checkOffline(OUTPUTS.app, inject('<img src="https://x">')).length > 0);
  assert.ok(checkOffline(OUTPUTS.app, inject("<p>fetch(</p>")).some((e) => /network API/.test(e)));
  assert.ok(checkOffline(OUTPUTS.app, inject("<style>a{background:url(http://x)}</style>")).some((e) => /url\(/.test(e)));
  assert.ok(checkOffline(OUTPUTS.app, app.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/, "")).some((e) => /Content-Security-Policy/.test(e)));
});

test("checkOffline flags single-quoted, unquoted, spaced and entity-encoded href/src/srcset URLs; plain-text citations stay allowed", () => {
  const spec = read(OUTPUTS.spec);
  const app = read(OUTPUTS.app);
  const injectInto = (html, s) => html.replace("</body>", `${s}</body>`);
  const base = checkOfflineReport(OUTPUTS.spec, spec).citations;
  const attrForms = [];
  for (const scheme of ["https", "http"]) {
    const url = `${scheme}://example.org/x`;
    attrForms.push(`<a href='${url}'>x</a>`, `<a href=${url}>x</a>`, `<a href = "${url}">x</a>`, `<a href = '${url}'>x</a>`);
    attrForms.push(`<a href="${scheme}&#58;//example.org">x</a>`, `<a href="${scheme}&colon;&sol;&sol;example.org">x</a>`);
    attrForms.push(`<img srcset='${url} 2x'>`, `<img srcset = ${url}>`, `<img src='${url}'>`, `<img src=${url}>`);
  }
  for (const form of attrForms) {
    const errors = checkOffline(OUTPUTS.spec, injectInto(spec, form));
    assert.ok(errors.some((e) => /attribute/.test(e)), `spec: ${form}`);
  }
  for (const form of ["<script src = 'local.js'></script>", "<script src=local.js></script>", '<img SRCSET = "a.png 2x">', "<img src\n=\n'b.png'>"]) {
    assert.ok(checkOffline(OUTPUTS.app, injectInto(app, form)).some((e) => /src(set)? attribute/.test(e)), `app: ${form}`);
    assert.ok(checkOffline(OUTPUTS.spec, injectInto(spec, form)).some((e) => /src(set)? attribute/.test(e)), `spec: ${form}`);
  }
  const cited = injectInto(spec, "<p>Source: https://example.org/report (fictional citation)</p>");
  const report = checkOfflineReport(OUTPUTS.spec, cited);
  assert.deepEqual(report.errors, []);
  assert.equal(report.citations, base + 1);
});

test("the spec file has every section, no script, the full fix table and allowed-role prototype links", () => {
  const spec = read(OUTPUTS.spec);
  assert.equal((spec.match(/id="spec-[WO]\d\d"/g) || []).length, 63);
  assert.equal((spec.match(/id="doc-\d\d"/g) || []).length, 28);
  assert.ok(spec.includes('id="decisions"') && spec.includes('id="fixes"'));
  assert.ok(!/<script/i.test(spec));
  const fixes = parseCsv(fs.readFileSync(path.join(DATA_DIR, "tracker", "fix_tracker.csv"), "utf8")).rows;
  const tbody = /<table id="fixes-table">[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/.exec(spec)[1];
  assert.equal((tbody.match(/<tr>/g) || []).length, fixes.length);
  const links = [...spec.matchAll(/<section class="wb-spec__section" id="spec-([WO]\d\d)"[\s\S]*?<a href="([^"]*)">Open in prototype<\/a>/g)];
  assert.equal(links.length, 63);
  for (const [, id, raw] of links) {
    const href = decode(raw);
    assert.ok(href.startsWith("Whiteboard-Final.html#/"), href);
    const vs = W.viewer.parseHash(href.slice("Whiteboard-Final.html".length)).vs;
    const page = W.manifest.pagesById[id];
    assert.equal(vs.page, id);
    assert.ok(page.roles.includes(vs.role), `${id} ${vs.role}`);
    if (page.optional) assert.match(href, /opt=1/);
  }
  const hrefs = new Set(links.map(([, , raw]) => decode(raw)));
  for (const need of ["#/W01?v=1&r=guest", "#/W35?v=1&r=instructor", "#/W49?v=1&r=instructor", "#/O01?v=1&opt=1"]) {
    assert.ok(hrefs.has(`Whiteboard-Final.html${need}`), need);
  }
});

test("a source containing a closing script tag makes the build throw", () => {
  const dir = tmp();
  const bad = path.join(dir, "bad.js");
  fs.writeFileSync(bad, '/* this comment closes a tag: </script> */\n"use strict";\n');
  assert.throws(() => build({ outDir: path.join(dir, "out"), extraPageFiles: [bad] }), /contains "<\/script"/);
  assert.ok(!fs.existsSync(path.join(dir, "out")));
});

test("checkLines passes and checkRender covers 189 page×platform targets with no errors", () => {
  assert.deepEqual(checkLines(), []);
  const r = checkRender(W);
  assert.deepEqual(r.errors, []);
  assert.equal(r.targets.size, EXPECTED_TARGETS);
});

test("check_all marks a failing child process as fail, so a failing test run fails the whole check", () => {
  const bad = runChild(["tests", ["-e", "console.log('ℹ fail 1'); process.exit(1)"], "last"]);
  assert.equal(bad.status, "fail");
  assert.ok(bad.errors >= 1);
  assert.equal(runChild(["ok", ["-e", "console.log('fine')"], "first"]).status, "pass");
});

test("spec export nests fragment headings under its section without modifying extracted sources", () => {
  const html = read(OUTPUTS.spec);
  let previous = 0;
  for (const m of html.matchAll(/<h([1-6])\b/g)) {
    const rank = Number(m[1]);
    assert.ok(rank <= previous + 1, `heading h${previous} to h${rank}`);
    previous = rank;
  }
  const raw = fs.readFileSync(path.join(DATA_DIR, "spec/docs/02-design-tokens-from-the-zip.html"), "utf8");
  assert.ok(raw.includes("<h4"));
});

test("workspace styling ships in app and board while the reference spec keeps its size budget", () => {
  for (const name of [OUTPUTS.app, OUTPUTS.board]) {
    assert.ok(read(name).includes("/* system/workspace.css */"), name);
    assert.ok(read(name).includes("@container wb-screen (max-width: 650px)"), name);
  }
  assert.ok(!read(OUTPUTS.spec).includes("/* system/workspace.css */"));
});
