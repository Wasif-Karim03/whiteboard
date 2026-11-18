import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../viewer/app.js", import.meta.url), "utf8");
const viewer = {};
vm.runInNewContext(source, { WB: { viewer }, document: { readyState: "loading", addEventListener() {} } });
const node = (name, inert = false) => ({ name, inert, children: [], parentElement: null });
function add(parent, ...children) {
  parent.children.push(...children);
  for (const child of children) child.parentElement = parent;
}

test("modal isolates sibling branches through body and restores their previous inert states", () => {
  const body = node("body"), bar = node("bar"), stage = node("stage"), tour = node("tour", true);
  const content = node("content"), overlays = node("overlays"), scrim = node("scrim"), dialog = node("dialog"), child = node("child");
  add(body, bar, stage, tour); add(stage, content, overlays); add(overlays, scrim, dialog); add(dialog, child);
  const saved = viewer.isolateModal(dialog, body);
  for (const n of [bar, tour, content, scrim]) assert.equal(n.inert, true, n.name);
  for (const n of [body, stage, overlays, dialog, child]) assert.equal(n.inert, false, n.name);
  viewer.restoreModal(saved);
  for (const n of [bar, content, scrim]) assert.equal(n.inert, false, n.name);
  assert.equal(tour.inert, true);
  const again = viewer.isolateModal(dialog, body);
  viewer.restoreModal(again);
  assert.equal(tour.inert, true);
});

test("modal lifecycle restores branches on close, switch and stage redraw before focus return", () => {
  const apply = source.slice(source.indexOf("  function apply(result)"), source.indexOf("  // ---------- Modal lifecycle"));
  const close = source.slice(source.indexOf("  function closeDialog("), source.indexOf("  function activateOpenDialogs("));
  const open = source.slice(source.indexOf("  function openDialog("), source.indexOf("  function closeDialog("));
  assert.ok(apply.indexOf("teardownModal()") < apply.indexOf("renderStage(current)"));
  assert.ok(open.indexOf("teardownModal()") < open.indexOf("enterModal(id"));
  assert.ok(close.indexOf("teardownModal()") < close.indexOf("target.focus()"));
  assert.match(source, /restoreModal\(modal\.isolated\)/);
});

test("render proof rejects a skipped heading in a dynamic page", async () => {
  const { frameProblems } = await import("./check_render.mjs");
  const sample = '<div class="wb-frame--web"><main><h1>Page</h1><h3>Skipped</h3></main></div>';
  assert.ok(frameProblems(sample, "web", "full").some((s) => s.includes("heading skips h1 to h3")));
});
