// WCAG 2.x contrast check for design/final/system/tokens.css, light and dark.
// Static colour math only: not a rendered-page, opacity or assistive-technology test.
// Usage: node design/final/tools/check_tokens.mjs [cssPath]   (exit 1 on any error)
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const HEX6 = /^#[0-9a-fA-F]{6}$/;
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, "");
const BLOCK_RES = {
  light: /^:root\s*\{([\s\S]*?)\n\}/m,
  dark: /^:root\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/m,
  systemDark: /^@media \(prefers-color-scheme: dark\)\s*\{\s*:root:not\(\[data-theme="light"\]\)\s*\{([\s\S]*?)\n\s*\}/m,
};
const declarations = (body) => {
  const out = {};
  for (const [, name, value] of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) out[name] = value.trim().replace(/\s+/g, " ");
  return out;
};
const hexOnly = (raw) => Object.fromEntries(Object.entries(raw).filter(([, v]) => HEX6.test(v)).map(([k, v]) => [k, v.toLowerCase()]));

// Returns effective hex maps (dark and systemDark merged over light) plus the raw declarations of each block.
export function parseTokenBlocks(cssText) {
  const text = stripComments(cssText);
  const raw = {};
  const found = {};
  for (const [name, re] of Object.entries(BLOCK_RES)) {
    const m = re.exec(text);
    found[name] = Boolean(m);
    raw[name] = m ? declarations(m[1]) : {};
  }
  const light = hexOnly(raw.light);
  return { light, dark: { ...light, ...hexOnly(raw.dark) }, systemDark: { ...light, ...hexOnly(raw.systemDark) }, raw, found };
}

const text = (fg, bg, use) => [fg, bg, 4.5, "text", use];
const control = (fg, bg, use) => [fg, bg, 3, "control", use];
const COURSES = ["phys", "math", "chem", "cs"];
const KINDS = ["exam", "quiz", "asg", "cls", "off", "priv"];
// [foreground, background, minimum, kind, use]
export const PAIRS = Object.freeze([
  // The 21 legacy pairs from design/tools/contrast.mjs
  text("wb-text", "wb-surface", "Body text on cards"),
  text("wb-text", "wb-bg", "Body text on page"),
  text("wb-text-2", "wb-surface", "Secondary text on cards"),
  text("wb-text-2", "wb-bg", "Secondary text on page"),
  text("wb-text-2", "wb-surface-2", "Secondary text in sidebar"),
  text("wb-text-2", "wb-fill", "Disabled-button label (still readable)"),
  text("wb-accent-text", "wb-surface", "Links on cards"),
  text("wb-accent-text", "wb-accent-tint", "Selected nav item"),
  text("wb-on-accent", "wb-accent", "Primary button label"),
  text("wb-accent-text", "wb-fill", "Secondary iOS button label"),
  text("wb-success", "wb-success-bg", "Success badge"),
  text("wb-warning", "wb-warning-bg", "Warning badge"),
  text("wb-error", "wb-error-bg", "Error badge"),
  text("wb-info", "wb-info-bg", "Info badge"),
  text("wb-neutral", "wb-neutral-bg", "Neutral badge (held, queued)"),
  text("wb-text", "wb-warning-bg", "Text in warning notice"),
  text("wb-text", "wb-error-bg", "Text in error notice"),
  text("wb-error", "wb-surface", "Inline field error"),
  control("wb-border", "wb-surface", "Input boundary (non-text, 1.4.11)"),
  control("wb-focus", "wb-surface", "Focus ring (non-text)"),
  control("wb-focus", "wb-bg", "Focus ring on page"),
  // Phase 2a additions
  ...COURSES.map((c) => text("wb-on-course", `wb-course-${c}`, `Text on ${c} course banner`)),
  text("wb-text", "wb-info-bg", "Text in info notice"),
  text("wb-text", "wb-neutral-bg", "Text in neutral notice"),
  text("wb-accent-text", "wb-bg", "Links on page"),
  text("wb-neutral", "wb-surface", "Neutral status text on cards"),
  text("wb-info", "wb-surface", "Info status text on cards"),
  control("wb-border", "wb-bg", "Input boundary on page"),
  control("wb-border", "wb-surface-2", "Input boundary in sidebar"),
  control("wb-border", "wb-fill", "Control boundary on fill"),
  control("wb-focus", "wb-surface-2", "Focus ring in sidebar"),
  control("wb-focus", "wb-fill", "Focus ring on fill"),
  control("wb-focus", "wb-accent-tint", "Focus ring on selected item"),
  control("wb-accent", "wb-surface", "Accent fill on cards"),
  control("wb-accent", "wb-bg", "Accent fill on page"),
  ...COURSES.map((c) => control(`wb-course-${c}`, "wb-surface", `${c} course colour on cards`)),
  ...KINDS.map((k) => control(`wb-kind-${k}`, "wb-surface", `${k} event mark on cards`)),
]);
const CHECKED = [...new Set(PAIRS.flatMap(([fg, bg]) => [fg, bg]))];

export function checkTokens(cssText) {
  const t = parseTokenBlocks(cssText);
  const errors = [];
  for (const [name, ok] of Object.entries(t.found)) if (!ok) errors.push(`${name}: block not found`);
  // 1. Every checked token is a 6-digit hex in each block that declares it, and light declares all of them.
  const invalid = new Set();
  for (const name of CHECKED) {
    if (!(name in t.raw.light)) { errors.push(`light: ${name} is missing`); invalid.add(name); }
    for (const block of ["light", "dark", "systemDark"]) {
      const v = t.raw[block][name];
      if (v !== undefined && !HEX6.test(v)) { errors.push(`${block}: ${name} is not a 6-digit hex (${v})`); invalid.add(name); }
    }
  }
  // 2. The two dark blocks hold identical declarations (colours, scrims, shadows and all).
  for (const name of new Set([...Object.keys(t.raw.dark), ...Object.keys(t.raw.systemDark)])) {
    const a = t.raw.dark[name];
    const b = t.raw.systemDark[name];
    if (a !== b) errors.push(`systemDark: --${name} differs from dark (${b ?? "missing"} vs ${a ?? "missing"})`);
  }
  // 3. Every custom property in the file is --wb-*.
  for (const [, name] of stripComments(cssText).matchAll(/(?:^|[\s;{])--([\w-]+)\s*:/g)) if (!name.startsWith("wb-")) errors.push(`custom property --${name} does not start with --wb-`);
  // 4. Contrast on the merged maps.
  const rows = [];
  for (const theme of ["light", "dark"])
    for (const [fg, bg, min, kind, use] of PAIRS) {
      if (invalid.has(fg) || invalid.has(bg)) continue;
      const r = ratio(t[theme][fg], t[theme][bg]);
      const row = { theme, fg, bg, min, kind, use, ratio: Math.round(r * 100) / 100, pass: r >= min };
      rows.push(row);
      if (!row.pass) errors.push(`${theme}: ${fg} on ${bg} is ${row.ratio}:1, needs ${min}:1 (${use})`);
    }
  return { rows, errors };
}

function main(argv) {
  const cssPath = argv[0] || fileURLToPath(new URL("../system/tokens.css", import.meta.url));
  let cssText;
  try {
    cssText = fs.readFileSync(cssPath, "utf8");
  } catch (err) {
    console.log(`check_tokens: cannot read ${cssPath}: ${err.message}`);
    return 1;
  }
  const { errors } = checkTokens(cssText);
  for (const e of errors) console.log(e);
  console.log(`${PAIRS.length} pairs × 2 themes, ${errors.length} failures`);
  return errors.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main(process.argv.slice(2));
