// Redesign regressions for usable collapsed settings and shipped style isolation. Source/mock checks only.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { loadSite } from "./load_site.mjs";
const W = loadSite();

test("preview settings start collapsed with all controls available and a named summary", () => {
  const html = W.viewer.renderBar(W, W.viewer.DEFAULTS);
  assert.match(html, /<details class="wb-previewbar__settings" id="v-settings">/);
  assert.match(html, /<summary id="v-settings-toggle">[\s\S]*?Preview settings<\/summary>/);
  for (const id of ["v-page", "v-role", "v-platform", "v-scenario", "v-state", "v-journey", "v-width", "v-orient", "v-appearance", "v-text", "v-opt"]) assert.ok(html.includes(`id="${id}"`), id);
  assert.ok(!html.includes('id="v-status"'), "live status stays outside the collapsed settings");
});

test("ending a tour returns focus to a visible settings control, open or collapsed", () => {
  const src = fs.readFileSync(new URL("../viewer/app.js", import.meta.url), "utf8");
  const fn = src.slice(src.indexOf("  function focusFor("), src.indexOf("  // ---------- The one apply path"));
  for (const open of [false, true]) {
    const focused = [];
    const elements = { "v-settings": { open }, "v-settings-toggle": { focus: () => focused.push("summary") }, "v-journey": { focus: () => focused.push("journey") } };
    const ctx = vm.createContext({ $: (id) => elements[id], stage: () => ({}) });
    vm.runInContext(fn, ctx);
    ctx.focusFor("journey");
    assert.deepEqual(focused, [open ? "journey" : "summary"]);
  }
});
