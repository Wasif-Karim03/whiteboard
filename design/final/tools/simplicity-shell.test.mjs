// Source/mock regressions for visible choices, current context and quiet prototype chrome.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { WB, S, view, viewer, frame, mainOf, esc } from "./spine_helpers.mjs";

// Retain each closed disclosure's summary, including when disclosures are nested.
function initial(html) {
  let out = "", at = 0;
  const stack = [];
  const visible = () => stack.every((d) => !d.closed || d.summary);
  for (const m of html.matchAll(/<details\b[^>]*>|<\/details>|<summary\b[^>]*>|<\/summary>/g)) {
    if (visible()) out += html.slice(at, m.index);
    if (m[0].startsWith("<details")) stack.push({ closed: !/\bopen(?:[\s=>])/.test(m[0]), summary: false });
    else if (m[0] === "</details>") stack.pop();
    else if (stack.length) stack.at(-1).summary = m[0] !== "</summary>";
    at = m.index + m[0].length;
  }
  return out + (visible() ? html.slice(at) : "");
}
const targets = (html) => [...html.matchAll(/data-go="([^"]+)"/g)].map((m) => m[1]);

test("regular course navigation shows core destinations including the course calendar and retains all secondary links", () => {
  for (const role of ["student", "instructor", "ta"]) for (const platform of ["web", "ipad"]) {
    const html = frame({ page: "W14", role, platform }).html;
    const nav = html.match(/<div class="wb-course-navigation">[\s\S]*?<\/details><\/div>/)[0];
    const core = role === "student" ? ["W14", "W18", "W32", "W24"] : ["W35", "W48", "W51", "W32"];
    assert.deepEqual(targets(initial(nav)), core);
    assert.deepEqual(targets(nav).sort(), Array.from(S.courseNav(role), (n) => n.page).sort());
    assert.match(initial(nav), /More/);
  }
});

test("a secondary destination names the current section even with More closed", () => {
  for (const [page, role, label] of [["W16", "student", "Modules"], ["W45", "instructor", "People"]]) {
    for (const platform of ["web", "ipad"]) {
      const html = frame({ page, role, platform }).html;
      assert.ok(html.includes(`class="is-current" aria-label="${label}, More course sections"`));
      assert.ok(initial(html).includes(label));
      assert.match(html, new RegExp(`data-go="${page}" aria-current="page"`));
    }
  }
  for (const vs of [{ platform: "web", width: "narrow" }, { platform: "iphone" }]) {
    const html = frame({ page: "W14", role: "instructor", ...vs }).html;
    assert.ok(!html.includes('class="wb-course-more"'), "compact menus stay flat");
    for (const item of S.courseNav("instructor")) assert.ok(targets(html).includes(item.page));
  }
});

test("Today shows the next task once and keeps warnings outside secondary disclosures", () => {
  const v = view(), who = viewer("default", "student"), next = S.nextDue(v, who.courseId, who);
  const title = esc(S.assessment(v, next.assessmentId).title);
  for (const platform of ["web", "ipad", "iphone"]) {
    const html = mainOf(frame({ page: "W05", role: "student", platform }).html);
    const shown = initial(html);
    assert.equal(shown.split(title).length - 1, 1);
    assert.match(shown, /Your next step/);
    assert.match(shown, /View quiz rules|View assignment/);
    assert.ok(!shown.includes('class="wb-stat"'));
    assert.ok(initial(mainOf(frame({ page: "W05", role: "student", platform, token: "offline" }).html)).match(/offline/i));
  }
});

test("preview chrome removes duplicate branding and preserves live text when visually quiet", () => {
  const bar = WB.viewer.renderBar(WB, WB.viewer.DEFAULTS);
  assert.ok(!bar.includes('class="wb-logo'));
  assert.ok(initial(bar).includes("Fictional demo") && initial(bar).includes("Preview settings"));
  assert.ok(!initial(bar).includes('id="v-page"'));
  const src = fs.readFileSync(new URL("../viewer/app.js", import.meta.url), "utf8");
  const fn = src.slice(src.indexOf("  function setStatus("), src.indexOf("  function errorText("));
  const states = [];
  const el = { textContent: "", classList: { toggle: (name, quiet) => states.push([name, quiet]) } };
  const ctx = vm.createContext({ $: () => el });
  vm.runInContext(fn, ctx);
  ctx.setStatus("Course home · Web · Student", true);
  assert.equal(el.textContent, "Course home · Web · Student");
  ctx.setStatus("This action is unavailable");
  assert.equal(el.textContent, "This action is unavailable");
  assert.deepEqual(states, [["wb-vstatus--quiet", true], ["wb-vstatus--quiet", false]]);
});

test("Escape closes a native course menu and returns focus to its summary", () => {
  const src = fs.readFileSync(new URL("../viewer/app.js", import.meta.url), "utf8");
  const fn = src.slice(src.indexOf("  function closeMenuOnEscape("), src.indexOf("  // ---------- Stage clicks"));
  for (const inside of [true, false]) {
    let focused = false, prevented = false;
    const detail = { open: true, querySelector: () => ({ focus: () => { focused = true; } }) };
    const ctx = vm.createContext({ modal: null, stage: () => ({ querySelector: () => detail }), V: {} });
    vm.runInContext(fn, ctx);
    ctx.closeMenuOnEscape({ key: "Escape", defaultPrevented: false, target: { closest: () => inside ? detail : null }, preventDefault: () => { prevented = true; } });
    assert.equal(detail.open, false); assert.ok(focused && prevented);
  }
});


test("a shell with only secondary sections still draws a working course menu", () => {
  const html = WB.courseTabs({ ns: "secondary", course: { tabs: [{ id: "modules", label: "Modules", go: "W16", current: true }] } });
  assert.ok(initial(html).includes("Modules"));
  assert.deepEqual(targets(html), ["W16"]);
});


test("course menus close on a current destination and when focus leaves, but stay open within", () => {
  const src = fs.readFileSync(new URL("../viewer/app.js", import.meta.url), "utf8");
  const blur = src.slice(src.indexOf("  function closeCourseMenuOnBlur("), src.indexOf("  // ---------- Stage clicks"));
  const click = src.slice(src.indexOf("  function onStageClick("), src.indexOf("  // R15: compact-table"));
  let applied = false;
  const inside = {}, outside = {};
  const detail = { open: true, contains: (node) => node === inside };
  const el = { closest: () => detail };
  const ctx = vm.createContext({ stage: () => ({ contains: () => true }), activationInput: () => ({ href: "#W16" }), WB: {}, current: {}, V: { activation: () => ({ kind: "link" }), shouldIntercept: () => true, reduce: () => ({}) }, apply: () => { assert.equal(detail.open, false); applied = true; } });
  vm.runInContext(blur + click, ctx);
  ctx.closeCourseMenuOnBlur({ target: { closest: () => detail }, relatedTarget: inside });
  assert.equal(detail.open, true);
  ctx.closeCourseMenuOnBlur({ target: { closest: () => detail }, relatedTarget: outside });
  assert.equal(detail.open, false);
  detail.open = true;
  ctx.onStageClick({ target: { closest: (selector) => selector === "button[data-cal-op]" ? null : el }, preventDefault: () => {} });
  assert.ok(applied); assert.equal(detail.open, false);
});
