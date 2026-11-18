// Phase 3 spine tests, part 5 (fix round 3, SPINE-12 and SPINE-13): W49 "Go to release" links only to the W53
// destination for the receipt's own assessment, and W21 while saving has no active Edit work, Cancel review or
// Add work links. A page variant travels in `token`; direct() takes a state and a variant together. Source checks
// only, not browser, device or accessibility acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import { frame, direct, goLinks, disabledWith } from "./spine_helpers.mjs";

const PLATFORMS = [{ platform: "web" }, { platform: "ipad", orientation: "landscape" }, { platform: "iphone" }];
const SAVING_REASON = "Your submission is still sending";
const HOME = "assignment_submission";
const disabledButton = (html, label) => (html.match(new RegExp(`<button[^>]*>(?:(?!</button>)[\\s\\S])*${label}`)) || [""])[0];

// ---------- SPINE-12: W49 release link ----------
test("SPINE-12: W49:group for instructors has no W53 release link on web, iPad or iPhone", () => {
  for (const c of PLATFORMS) {
    const html = frame({ page: "W49", token: "group", role: "instructor", scenario: "group_submission", ...c }).html;
    assert.ok(!goLinks(html).some((g) => g.startsWith("W53")), `${c.platform} has a W53 link`);
    assert.ok(!html.includes("Go to release"), `${c.platform} shows the release link text`);
  }
});

test("SPINE-12: W49 default (PS4 receipt) for instructors keeps the W53 release link", () => {
  for (const c of PLATFORMS) {
    const html = frame({ page: "W49", role: "instructor", ...c }).html;
    assert.ok(goLinks(html).includes("W53"), `${c.platform} default`);
  }
});

// ---------- SPINE-13: W21 saving ----------
test("SPINE-13: W21 saving has no link to W19 or W20 and disables Edit work and Cancel review with the reason", () => {
  for (const c of PLATFORMS) {
    const html = frame({ page: "W21", token: "saving", role: "student", scenario: HOME, ...c }).html;
    const go = goLinks(html);
    assert.ok(!go.some((g) => /^W(19|20)/.test(g)), `${c.platform} default links to W19 or W20`);
    assert.match(disabledButton(html, "Edit work"), /aria-disabled="true"/, `${c.platform} Edit work`);
    assert.match(disabledButton(html, "Cancel review"), /aria-disabled="true"/, `${c.platform} Cancel review`);
    assert.ok(disabledWith(html, SAVING_REASON), `${c.platform} reason`);
  }
});

test("SPINE-13: W21:motion saving at group_work_in_progress has no link to W19 or W20 and disables the two controls", () => {
  for (const c of PLATFORMS) {
    const html = direct("W21", { role: "student", scenario: "group_work_in_progress", state: "saving", variant: "motion", ...c }).html;
    const go = goLinks(html);
    assert.ok(!go.some((g) => /^W(19|20)/.test(g)), `${c.platform} motion links to W19 or W20`);
    assert.match(disabledButton(html, "Edit work"), /aria-disabled="true"/, `${c.platform} motion Edit work`);
    assert.match(disabledButton(html, "Cancel review"), /aria-disabled="true"/, `${c.platform} motion Cancel review`);
    assert.ok(disabledWith(html, SAVING_REASON), `${c.platform} motion reason`);
  }
});

test("SPINE-13: W21 saving draws no Add work back link on any platform", () => {
  for (const c of PLATFORMS) {
    const html = frame({ page: "W21", token: "saving", role: "student", scenario: HOME, ...c }).html;
    assert.ok(!html.includes("Add work"), `${c.platform} Add work`);
  }
});

test("SPINE-13: W21 default keeps the active Edit work, Cancel review and Add work links", () => {
  for (const c of PLATFORMS) {
    const html = frame({ page: "W21", role: "student", scenario: HOME, ...c }).html;
    const go = goLinks(html);
    assert.ok(go.some((g) => g.startsWith("W20")), `${c.platform} W20 link`);
    assert.ok(go.some((g) => g.startsWith("W19")), `${c.platform} W19 link`);
    assert.ok(html.includes("Add work"), `${c.platform} Add work`);
  }
});
