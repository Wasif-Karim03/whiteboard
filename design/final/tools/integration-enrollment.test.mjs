import test from "node:test";
import assert from "node:assert/strict";
import { WB, S, copy, direct, viewer, mainOf } from "./spine_helpers.mjs";

const pages = ["W04", "W09", "W10", "W14", "W35", "W36", "W55", "W59"];

test("missing instructor enrollment renders an empty or permission state across page views", () => {
  const data = copy(WB.data);
  const personId = viewer("default", "instructor").personId;
  data.world.enrollments = data.world.enrollments.filter((e) => !(e.person_id === personId && e.role === "instructor"));
  assert.equal(S.viewerFor(S.buildView(data, "default"), "instructor").courseId, null);
  for (const page of pages) {
    const entry = WB.pageFor(page);
    const tokens = [null, ...entry.states, ...Object.keys(entry.variants)];
    for (const platform of ["web", "ipad", "iphone"]) for (const token of tokens) {
      const o = { role: "instructor", data, platform };
      if (token && entry.states.includes(token)) o.state = token;
      else if (token) o.variant = token;
      const result = direct(page, o);
      assert.deepEqual(result.problems, [], `${page} ${platform} ${token}`);
      if (token !== "loading") assert.match(mainOf(result.html), /No course is assigned|not enrolled|not teaching/i, `${page} ${platform} ${token}`);
    }
  }
});

test("W40 web hide is disabled offline and available by default", () => {
  for (const variant of [null, "motion"]) {
    const offline = mainOf(direct("W40", { role: "instructor", state: "offline", variant }).html);
    const normal = mainOf(direct("W40", { role: "instructor", variant }).html);
    const button = (html) => [...html.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g)].map((m) => m[0]).find((tag) => tag.includes("Hide from learners"));
    assert.match(button(offline), /aria-disabled="true"/);
    assert.ok(offline.includes("You&#39;re offline") || offline.includes("You're offline"));
    assert.doesNotMatch(button(normal), /aria-disabled="true"/);
  }
});

test("W35 web item Hide controls follow offline and conflict blocking states", () => {
  for (const state of [null, "offline", "conflict"]) {
    const html = mainOf(direct("W35", { role: "instructor", state }).html);
    const buttons = [...html.matchAll(/<button\b[^>]*>[\s\S]*?<\/button>/g)].map((m) => m[0]).filter((tag) => tag.includes("Hide from learners"));
    assert.ok(buttons.length);
    for (const button of buttons) {
      if (state) assert.match(button, /aria-disabled="true"/);
      else assert.doesNotMatch(button, /aria-disabled="true"/);
    }
    if (state) assert.ok(html.includes(state === "offline" ? "offline" : "Reload the current version first"));
  }
});
