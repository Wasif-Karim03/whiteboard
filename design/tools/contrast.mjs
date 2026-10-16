// WCAG 2.x relative-luminance contrast for token pairs parsed from design/system/tokens.css.
// Static colour math only — not a rendered-page or assistive-technology test.
import fs from "node:fs";

export function parseTokens(cssPath) {
  const css = fs.readFileSync(cssPath, "utf8");
  const block = (re) => {
    const m = re.exec(css);
    const out = {};
    if (!m) return out;
    for (const [, k, v] of m[1].matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) out[k] = v;
    return out;
  };
  const light = block(/:root\s*\{([\s\S]*?)\n\}/);
  const dark = { ...light, ...block(/:root\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/) };
  // iOS grouped surfaces in dark mode (overridden in components.css .i-app)
  const iosDark = { ...dark, "wb-bg": "#000000", "wb-surface": "#1c1c1e", "wb-surface-2": "#2c2c2e", "wb-fill": "#2c2c2e" };
  return { light, dark, iosDark };
}
const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
// [foreground, background, minimum, use]
export const PAIRS = [
  ["wb-text", "wb-surface", 4.5, "Body text on cards"],
  ["wb-text", "wb-bg", 4.5, "Body text on page"],
  ["wb-text-2", "wb-surface", 4.5, "Secondary text on cards"],
  ["wb-text-2", "wb-bg", 4.5, "Secondary text on page"],
  ["wb-text-2", "wb-surface-2", 4.5, "Secondary text in sidebar"],
  ["wb-text-2", "wb-fill", 4.5, "Disabled-button label (still readable)"],
  ["wb-accent-text", "wb-surface", 4.5, "Links on cards"],
  ["wb-accent-text", "wb-accent-tint", 4.5, "Selected nav item"],
  ["wb-on-accent", "wb-accent", 4.5, "Primary button label"],
  ["wb-accent-text", "wb-fill", 4.5, "Secondary iOS button label"],
  ["wb-success", "wb-success-bg", 4.5, "Success badge"],
  ["wb-warning", "wb-warning-bg", 4.5, "Warning badge"],
  ["wb-error", "wb-error-bg", 4.5, "Error badge"],
  ["wb-info", "wb-info-bg", 4.5, "Info badge"],
  ["wb-neutral", "wb-neutral-bg", 4.5, "Neutral badge (held, queued)"],
  ["wb-text", "wb-warning-bg", 4.5, "Text in warning notice"],
  ["wb-text", "wb-error-bg", 4.5, "Text in error notice"],
  ["wb-error", "wb-surface", 4.5, "Inline field error"],
  ["wb-border", "wb-surface", 3, "Input boundary (non-text, 1.4.11)"],
  ["wb-focus", "wb-surface", 3, "Focus ring (non-text)"],
  ["wb-focus", "wb-bg", 3, "Focus ring on page"],
];
export function contrastReport(cssPath) {
  const t = parseTokens(cssPath);
  const rows = [];
  for (const theme of ["light", "dark", "iosDark"])
    for (const [fg, bg, min, use] of PAIRS) {
      const r = ratio(t[theme][fg], t[theme][bg]);
      rows.push({ theme, fg, bg, use, min, ratio: Math.round(r * 100) / 100, pass: r >= min });
    }
  return rows;
}
