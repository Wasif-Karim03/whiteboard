// Tests for check_tokens.mjs against the real design/final/system/tokens.css and in-memory failing copies.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ratio, parseTokenBlocks, PAIRS, checkTokens } from "./check_tokens.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TOKENS = path.join(HERE, "..", "system", "tokens.css");
const CLI = path.join(HERE, "check_tokens.mjs");
const css = fs.readFileSync(TOKENS, "utf8");

// Split the real file into its light block, its two dark blocks and the rest, so fixtures edit one block only.
const darkStart = css.indexOf(':root[data-theme="dark"] {');
const mediaStart = css.indexOf("@media (prefers-color-scheme: dark)");
const motionStart = css.indexOf("@media (prefers-reduced-motion");
const parts = { light: css.slice(0, darkStart), dark: css.slice(darkStart, mediaStart), sys: css.slice(mediaStart, motionStart), rest: css.slice(motionStart) };
const join = (p) => p.light + p.dark + p.sys + p.rest;
const swap = (block, re, to) => {
  assert.match(parts[block], re, `fixture anchor ${re} missing in ${block}`);
  return join({ ...parts, [block]: parts[block].replace(re, to) });
};
const errorsOf = (text) => checkTokens(text).errors;

test("ratio is 21 for black on white and symmetric", () => {
  assert.equal(Math.round(ratio("#000000", "#ffffff") * 1000) / 1000, 21);
  assert.equal(ratio("#16191b", "#ffffff"), ratio("#ffffff", "#16191b"));
});

test("parseTokenBlocks returns light, dark and systemDark, with dark merged over light and raw values kept", () => {
  const t = parseTokenBlocks(css);
  for (const k of ["light", "dark", "systemDark"]) assert.ok(Object.keys(t[k]).length > 20, `${k} has tokens`);
  assert.equal(t.light["wb-surface"], "#ffffff");
  assert.equal(t.dark["wb-surface"], "#1b1e20");
  assert.equal(t.dark["wb-space-1"], undefined, "hex maps hold colours only");
  assert.equal(t.raw.dark["wb-scrim"], "rgb(0 0 0 / 0.55)");
  assert.ok(!("wb-font" in t.raw.dark), "raw dark holds only dark declarations");
});

test("PAIRS keeps the 21 legacy pairs and adds course, kind, border and focus pairs with the right floors", () => {
  assert.ok(PAIRS.length > 21);
  for (const [fg, bg, min, kind] of PAIRS) {
    assert.ok(fg.startsWith("wb-") && bg.startsWith("wb-"));
    assert.equal(min, kind === "text" ? 4.5 : 3, `${fg} on ${bg}`);
  }
  const has = (fg, bg) => PAIRS.some((p) => p[0] === fg && p[1] === bg);
  for (const c of ["phys", "math", "chem", "cs"]) assert.ok(has("wb-on-course", `wb-course-${c}`) && has(`wb-course-${c}`, "wb-surface"));
  for (const k of ["exam", "quiz", "asg", "cls", "off", "priv"]) assert.ok(has(`wb-kind-${k}`, "wb-surface"));
  assert.ok(has("wb-border", "wb-fill") && has("wb-focus", "wb-accent-tint") && has("wb-accent", "wb-bg"));
});

test("the real tokens.css passes every pair in light and dark", () => {
  const { rows, errors } = checkTokens(css);
  assert.deepEqual(errors, []);
  assert.equal(rows.length, PAIRS.length * 2);
  assert.ok(rows.every((r) => r.pass));
});

test("a lightened text token fails in light", () => {
  const errs = errorsOf(swap("light", /--wb-text-2: #575e63;/, "--wb-text-2: #9aa1a6;"));
  assert.ok(errs.some((e) => /light: wb-text-2 on wb-surface/.test(e)), errs.join("\n"));
  assert.ok(!errs.some((e) => /^dark:/.test(e)));
});

test("a weakened dark-only border fails only in dark", () => {
  const text = join({ ...parts, dark: parts.dark.replace("--wb-border: #7d868b;", "--wb-border: #3a3f42;"), sys: parts.sys.replace("--wb-border: #7d868b;", "--wb-border: #3a3f42;") });
  const errs = errorsOf(text);
  assert.ok(errs.some((e) => /^dark: wb-border on wb-bg/.test(e)), errs.join("\n"));
  assert.ok(!errs.some((e) => /^light:/.test(e)));
});

test("a removed token is reported as missing", () => {
  const errs = errorsOf(swap("light", /--wb-focus: #0a66d8;/, ""));
  assert.ok(errs.some((e) => /wb-focus.*missing/.test(e)), errs.join("\n"));
});

test("systemDark drifting from dark is an error", () => {
  const errs = errorsOf(swap("sys", /--wb-text-2: #a9b1b6;/, "--wb-text-2: #b0b8bd;"));
  assert.ok(errs.some((e) => /systemDark.*wb-text-2/.test(e)), errs.join("\n"));
});

test("a non-hex dark override of a checked token is an error even though light has a hex", () => {
  const text = join({ ...parts, dark: parts.dark.replace("--wb-fill: #2d3235;", "--wb-fill: transparent;"), sys: parts.sys.replace("--wb-fill: #2d3235;", "--wb-fill: transparent;") });
  const errs = errorsOf(text);
  assert.ok(errs.some((e) => /dark: wb-fill is not a 6-digit hex/.test(e)), errs.join("\n"));
});

test("scrim or shadow drift between the two dark blocks is an error", () => {
  const scrim = errorsOf(swap("sys", /--wb-scrim: rgb\(0 0 0 \/ 0\.55\);/, "--wb-scrim: rgb(0 0 0 / 0.4);"));
  assert.ok(scrim.some((e) => /systemDark.*wb-scrim/.test(e)), scrim.join("\n"));
  const shadow = errorsOf(swap("dark", /--wb-shadow-2: 0 10px 32px rgb\(0 0 0 \/ 0\.5\);/, "--wb-shadow-2: none;"));
  assert.ok(shadow.some((e) => /systemDark.*wb-shadow-2/.test(e)), shadow.join("\n"));
});

test("a custom property without the --wb- prefix is an error", () => {
  const errs = errorsOf(swap("light", /--wb-space-1: 4px;/, "--wb-space-1: 4px; --s1: 4px;"));
  assert.ok(errs.some((e) => /--s1/.test(e)), errs.join("\n"));
});

test("CLI exits 0 on the real file and 1 on a failing copy", () => {
  const ok = spawnSync(process.execPath, [CLI], { encoding: "utf8" });
  assert.equal(ok.status, 0, ok.stdout + ok.stderr);
  assert.match(ok.stdout, new RegExp(`${PAIRS.length} pairs × 2 themes, 0 failures`));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "wb-tokens-"));
  try {
    const bad = path.join(dir, "tokens.css");
    fs.writeFileSync(bad, css.replace("--wb-text-2: #575e63;", "--wb-text-2: #c0c4c8;"));
    const fail = spawnSync(process.execPath, [CLI, bad], { encoding: "utf8" });
    assert.equal(fail.status, 1, fail.stdout + fail.stderr);
    assert.match(fail.stdout, /wb-text-2/);
    const missing = spawnSync(process.execPath, [CLI, path.join(dir, "nope.css")], { encoding: "utf8" });
    assert.equal(missing.status, 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
