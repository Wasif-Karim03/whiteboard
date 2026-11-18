// Source checks for design/final/system/*.css and the kit together: sizes, colour discipline, tokens in use,
// focus and motion rules, hit targets and class coverage. Static checks only, not browser acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadKit, renderMatrix, KIT_FILES, KIT_DIR, ROLES_ALL } from "./load_kit.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SYSTEM = path.join(HERE, "..", "system");
const SYSTEM_FILES = ["tokens.css", "base.css", "components-core.css", "components-forms.css", "components-data.css", "components-signature.css", "components-overlay.css", "shell-web.css", "shell-ipad.css", "shell-iphone.css"];
const NEW_TOOLS = ["check_tokens.mjs", "load_kit.mjs", "html_check.mjs", "tokens.test.mjs", "kit.test.mjs", "system.test.mjs"];
const read = (p) => fs.readFileSync(p, "utf8");
const cssFiles = fs.readdirSync(SYSTEM).filter((f) => f.endsWith(".css"));
const css = Object.fromEntries(cssFiles.map((f) => [f, read(path.join(SYSTEM, f))]));
const allCss = Object.values(css).join("\n");
const kitSrc = KIT_FILES.map((f) => read(path.join(KIT_DIR, f))).join("\n");
const stripComments = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "");

test("the files named in the plan exist", () => {
  for (const f of SYSTEM_FILES) assert.ok(fs.existsSync(path.join(SYSTEM, f)), `system/${f}`);
  for (const f of [...KIT_FILES, "API.md"]) assert.ok(fs.existsSync(path.join(KIT_DIR, f)), `kit/${f}`);
  for (const f of NEW_TOOLS) assert.ok(fs.existsSync(path.join(HERE, f)), `tools/${f}`);
});

test("every system, kit and new tools file is at most 800 lines, and API.md at most 200", () => {
  const files = [...cssFiles.map((f) => path.join(SYSTEM, f)), ...fs.readdirSync(KIT_DIR).map((f) => path.join(KIT_DIR, f)), ...NEW_TOOLS.map((f) => path.join(HERE, f))];
  for (const f of files) assert.ok(read(f).split("\n").length <= 800, `${path.basename(f)} is over 800 lines`);
  assert.ok(read(path.join(KIT_DIR, "API.md")).split("\n").length <= 200, "API.md is over 200 lines");
});

test("size budgets: system CSS at most 90 KB, kit JS at most 150 KB", () => {
  const cssBytes = cssFiles.reduce((n, f) => n + fs.statSync(path.join(SYSTEM, f)).size, 0);
  const jsBytes = fs.readdirSync(KIT_DIR).filter((f) => f.endsWith(".js")).reduce((n, f) => n + fs.statSync(path.join(KIT_DIR, f)).size, 0);
  assert.ok(cssBytes <= 90 * 1024, `CSS is ${cssBytes} bytes`);
  assert.ok(jsBytes <= 150 * 1024, `JS is ${jsBytes} bytes`);
});

test("only tokens.css contains colour literals", () => {
  const colour = /#[0-9a-fA-F]{3,8}\b|\b(rgb|rgba|hsl|hsla)\(/;
  for (const [f, text] of Object.entries(css)) if (f !== "tokens.css") assert.doesNotMatch(stripComments(text), colour, f);
  assert.doesNotMatch(kitSrc, colour, "kit");
  assert.match(css["tokens.css"], colour);
});

test("every custom property is --wb-* and every var(--wb-*) used is declared", () => {
  const declared = new Set();
  for (const [, name] of stripComments(allCss).matchAll(/(?:^|[\s;{])--([\w-]+)\s*:/g)) {
    assert.ok(name.startsWith("wb-"), `--${name}`);
    declared.add(name);
  }
  for (const [, name] of (stripComments(allCss) + kitSrc).matchAll(/var\(--([\w-]+)/g)) assert.ok(declared.has(name), `var(--${name}) is not declared`);
});

test("focus is never removed, focus-visible and both reduced-motion rules exist, hit tokens are 24 px and 44 px", () => {
  assert.doesNotMatch(allCss, /outline\s*:\s*(none|0)\b/);
  assert.match(css["base.css"], /:focus-visible\s*\{\s*outline: 2px solid var\(--wb-focus\); outline-offset: 2px;?\s*\}/);
  assert.match(css["tokens.css"], /@media \(prefers-reduced-motion: reduce\)\s*\{\s*:root \{ --wb-motion-fast: 0ms; --wb-motion-base: 0ms; --wb-motion-slow: 0ms; \}/);
  assert.match(css["base.css"], /@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*animation: none !important;[\s\S]*transition: none !important;/);
  assert.match(css["tokens.css"], /--wb-hit-web: 24px;/);
  assert.match(css["tokens.css"], /--wb-hit-ios: 44px;/);
  for (const f of cssFiles) {
    const queries = [...stripComments(css[f]).matchAll(/@media\s*\(([^)]*)\)/g)].map((m) => m[1].split(":")[0].trim());
    for (const q of queries) assert.ok(["prefers-color-scheme", "prefers-reduced-motion"].includes(q), `${f}: @media (${q})`);
  }
  assert.match(css["shell-web.css"], /\.wb-frame--web \{ --wb-hit: var\(--wb-hit-web\);/);
  assert.match(css["shell-ipad.css"], /\.wb-frame--ipad \{\s*--wb-hit: var\(--wb-hit-ios\);/);
  assert.match(css["shell-iphone.css"], /\.wb-frame--iphone \{\s*--wb-hit: var\(--wb-hit-ios\);/);
});

test("REV-02: the iPhone section menu is height-bounded and scrolls inside the frame", () => {
  const body = stripComments(css["shell-iphone.css"]).match(/\.wb-sectionmenu \{([^}]*)\}/)[1];
  assert.match(body, /max-height: calc\(100% - [^;]+\);/);
  assert.match(body, /overflow-y: auto;/);
  assert.match(body, /overscroll-behavior: contain;/);
  assert.doesNotMatch(stripComments(css["shell-iphone.css"]).match(/\.wb-navbar \{([^}]*)\}/)[1], /position:/, "the menu is placed in .wb-iphone, not the nav bar");
});

// Flat rule list: [selectors[], body]. @media wrappers are ignored; their inner rules are still listed.
const rules = [...stripComments(allCss).matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => [m[1].split(",").map((s) => s.trim()), m[2]]);

test("interactive classes declare min-height: var(--wb-hit), and icon-only controls also min-width", () => {
  const interactive = ["wb-btn", "wb-iconbtn", "wb-tab", "wb-navitem", "wb-seg__opt", "wb-input", "wb-select", "wb-check", "wb-rowlink", "wb-tabitem", "wb-sortbtn", "wb-iconlink", "wb-titlebtn"];
  const declares = (cls, prop) => rules.some(([sels, body]) => sels.includes(`.${cls}`) && new RegExp(`${prop}:\\s*var\\(--wb-hit\\)`).test(body));
  for (const cls of interactive) assert.ok(declares(cls, "min-height"), `.${cls} min-height`);
  for (const cls of ["wb-iconbtn", "wb-iconlink", "wb-check"]) assert.ok(declares(cls, "min-width"), `.${cls} min-width`);
});

// Effective cascade for co-emitted classes: every class that appears on an element alongside an interactive class
// (for example "wb-check wb-toggle") is collected from the render matrix, and no rule for any of them may set
// min-height to anything other than a var(--wb-hit) expression (a fixed 26px would undercut the hit target).
test("no rule for a class co-emitted with an interactive class sets a fixed min-height below var(--wb-hit)", () => {
  const interactive = new Set(["wb-btn", "wb-iconbtn", "wb-tab", "wb-navitem", "wb-seg__opt", "wb-input", "wb-select", "wb-check", "wb-rowlink", "wb-tabitem", "wb-sortbtn", "wb-iconlink", "wb-titlebtn"]);
  const WB = loadKit();
  const coEmitted = new Set();
  for (const role of ROLES_ALL)
    for (const c of WB.CONTEXTS)
      for (const [, render] of renderMatrix(WB.K, WB, WB.ctx({ ...c, role, tier: "review" })))
        for (const m of render().matchAll(/class="([^"]*)"/g)) {
          const list = m[1].split(/\s+/);
          if (list.some((cls) => interactive.has(cls))) for (const cls of list) coEmitted.add(cls);
        }
  assert.ok(coEmitted.has("wb-toggle"), "the toggle is co-emitted with wb-check");
  const checked = [];
  for (const cls of coEmitted) {
    const own = new RegExp(`\\.${cls}(?![\\w-])(?!\\S*::?(before|after))`);
    for (const [sels, body] of rules) {
      if (!sels.some((sel) => own.test(sel))) continue;
      for (const [, value] of body.matchAll(/(?:^|[;\s])min-height\s*:\s*([^;]+)/g)) {
        checked.push(cls);
        assert.match(value.trim(), /var\(--wb-hit\)/, `.${cls} sets min-height: ${value.trim()} (in "${sels.join(", ")}")`);
      }
    }
  }
  assert.ok(checked.includes("wb-check"), "wb-check min-height was examined");
});

test("dialogs fit their frame: modal, form sheet, sheet, full screen and popover declare max-height and the body scrolls", () => {
  const body = (sel) => rules.filter(([sels]) => sels.includes(sel)).map(([, b]) => b).join(";");
  assert.match(body(".wb-dialog"), /display:\s*flex/);
  assert.match(body(".wb-dialog"), /flex-direction:\s*column/);
  for (const v of ["modal", "formsheet", "sheet", "fullscreen", "popover"]) assert.match(body(`.wb-dialog--${v}`), /max-height:\s*[^;]+/, `.wb-dialog--${v} max-height`);
  assert.match(body(".wb-dialog--fullscreen"), /max-height:\s*100%/);
  assert.match(body(".wb-dialog__body"), /overflow:\s*auto/);
  assert.match(body(".wb-dialog__body"), /min-height:\s*0/);
  for (const part of [".wb-dialog__head", ".wb-dialog__actions"]) assert.match(body(part), /flex:\s*none/, `${part} stays reachable`);
});

test("every wb-* class emitted across the kit render matrix has a selector in system CSS", () => {
  const WB = loadKit();
  const emitted = new Set();
  for (const role of ROLES_ALL)
    for (const c of WB.CONTEXTS) {
      const ctx = WB.ctx({ ...c, role, tier: "review" });
      for (const [, render] of renderMatrix(WB.K, WB, ctx)) for (const m of render().matchAll(/class="([^"]*)"/g)) for (const cls of m[1].split(/\s+/)) if (cls.startsWith("wb-")) emitted.add(cls);
    }
  const styled = new Set([...stripComments(allCss).matchAll(/\.(wb-[\w-]+)/g)].map((m) => m[1]));
  // Allow-list: classes that exist only as hooks for 2c behaviour or tests, with no visual rule of their own.
  const ALLOW = new Set([]);
  const missing = [...emitted].filter((c) => !styled.has(c) && !ALLOW.has(c));
  assert.deepEqual(missing, []);
  assert.ok(emitted.size > 150, `emitted ${emitted.size} classes`);
});

// Dock rules come from the flat list; a selector matches when one of its comma-separated parts does.
const ruleBodies = (test) => rules.filter(([sels]) => sels.some(test)).map(([, body]) => body).join(";");

test("the iPhone dock wraps, its first action takes a full row, and More actions stays fixed", () => {
  assert.match(ruleBodies((s) => s === ".wb-dock"), /flex-wrap:\s*wrap/);
  assert.match(ruleBodies((s) => s === ".wb-dock > .wb-btn:first-child"), /flex:\s*1 1 100%/);
  assert.match(ruleBodies((s) => s === ".wb-dock > .wb-btn"), /flex:\s*1 1 auto/);
  assert.match(ruleBodies((s) => s === ".wb-more"), /flex:\s*none/);
});

test("dock buttons grow with multi-line labels: height auto, min-height var(--wb-hit) and vertical padding", () => {
  const body = ruleBodies((s) => s === ".wb-dock > .wb-btn");
  assert.match(body, /(?:^|;)\s*height:\s*auto/);
  assert.match(body, /min-height:\s*var\(--wb-hit\)/);
  assert.match(body, /padding-block:\s*var\(--wb-space-2\)/);
});

test("disabled dock actions sit in a wrapper that takes the same item sizing, and their reason text wraps", () => {
  const wrap = ruleBodies((s) => s === ".wb-dock > .wb-btnwrap");
  assert.match(wrap, /flex:\s*1 1 auto/);
  assert.match(wrap, /min-width:\s*0/);
  assert.match(ruleBodies((s) => s === ".wb-dock > .wb-btnwrap:first-child"), /flex:\s*1 1 100%/);
  const inner = ruleBodies((s) => s === ".wb-dock .wb-btnwrap > .wb-btn");
  assert.match(inner, /width:\s*100%/);
  assert.match(inner, /(?:^|;)\s*height:\s*auto/);
  assert.match(inner, /min-height:\s*var\(--wb-hit\)/);
  assert.match(ruleBodies((s) => /^\.wb-dock\s.*wb-btn__reason$/.test(s)), /white-space:\s*normal/);
  assert.match(ruleBodies((s) => /^\.wb-dock\s.*wb-btn__reason$/.test(s)), /overflow-wrap:\s*anywhere/);
});

test("More actions stays at the right end of its row when the dock wraps, and its menu is bounded", () => {
  assert.match(ruleBodies((s) => s === ".wb-more"), /margin-left:\s*auto/);
  const menu = ruleBodies((s) => s === ".wb-more__menu");
  assert.match(menu, /right:\s*0/);
  assert.match(menu, /max-width:/);
});

test("dock labels wrap instead of clipping, and no dock rule hides overflow or truncates text", () => {
  assert.match(ruleBodies((s) => /^\.wb-dock\s.*wb-btn__label$/.test(s)), /white-space:\s*normal/);
  assert.match(ruleBodies((s) => /^\.wb-dock\s.*wb-btn__label$/.test(s)), /overflow-wrap:\s*anywhere/);
  const dockRules = rules.filter(([sels]) => sels.some((s) => /^\.wb-dock(?![\w-])/.test(s)));
  assert.ok(dockRules.length >= 4, `${dockRules.length} dock rules`);
  for (const [sels, body] of dockRules) {
    assert.doesNotMatch(body, /overflow:\s*hidden/, sels.join(", "));
    assert.doesNotMatch(body, /text-overflow/, sels.join(", "));
  }
});
