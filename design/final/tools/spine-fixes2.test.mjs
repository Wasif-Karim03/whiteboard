// Phase 3 spine tests, part 4 (fix round 2, SPINE-07..11): W49 completion needs a saved, fully marked draft,
// W21/W53 confirmation boxes are read-only indications with links both ways, W48 iPhone keeps the offline notice,
// W51 native handles filteredEmpty before choosing a learner, and index.js loads every spine test file.
// Expected values come from WB.sel. Source checks only, not browser, device or accessibility acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { WB, esc, frame, mainOf, goLinks, disabledWith, tokensOf, CTX5 } from "./spine_helpers.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const HOME = "assignment_submission";
const COMPLETE = "Mark review complete";
const completeButton = (html) => (html.match(new RegExp(`<button[^>]*>(?:(?!</button>)[\\s\\S])*${COMPLETE}`)) || [""])[0];

// ---------- SPINE-07: W49 completion guard ----------
test("SPINE-07: W49 Mark review complete is disabled with a reason on saveFailed and with no draft; enabled on a complete draft", () => {
  for (const c of [{ platform: "web" }, { platform: "ipad", orientation: "landscape" }, { platform: "ipad", orientation: "portrait" }]) {
    const failed = frame({ page: "W49", token: "saveFailed", role: "instructor", ...c }).html;
    assert.match(completeButton(failed), /aria-disabled="true"/, `${c.platform} saveFailed`);
    assert.ok(disabledWith(failed, "Save the marks first"), `${c.platform} saveFailed reason`);
    assert.ok(failed.includes("Retry save"), `${c.platform} retry stays available`);

    const ben = frame({ page: "W49", token: "ben", role: "instructor", ...c }).html;
    assert.match(completeButton(ben), /aria-disabled="true"/, `${c.platform} ben`);
    assert.ok(disabledWith(ben, "Enter a mark for every question first"), `${c.platform} ben reason`);

    const def = frame({ page: "W49", role: "instructor", ...c }).html;
    const btn = completeButton(def);
    assert.ok(btn, `${c.platform} default has the button`);
    assert.doesNotMatch(btn, /aria-disabled/, `${c.platform} default enabled`);
  }
  for (const token of ["offline", "saving"]) {
    assert.match(completeButton(frame({ page: "W49", token, role: "instructor" }).html), /aria-disabled="true"/, token);
  }
});

// ---------- SPINE-08: W21 / W53 confirmation boxes ----------
const checkboxes = (html) => [...html.matchAll(/<input[^>]*type="checkbox"[^>]*>/g)].map((m) => m[0]);

test("SPINE-08: no enabled checkbox input on any W21 or W53 frame", () => {
  const cases = [["W21", "student", HOME], ["W53", "instructor", "default"]];
  for (const [page, role, scenario] of cases) {
    for (const token of tokensOf(page)) {
      for (const c of CTX5) {
        const html = frame({ page, token, role, scenario, ...c }).html;
        for (const box of checkboxes(html)) assert.match(box, /\sdisabled(?=[\s>=/])|aria-disabled="true"/, `${page} ${token} ${c.platform}: ${box}`);
      }
    }
  }
  assert.ok(checkboxes(frame({ page: "W21", token: "reviewed", role: "student", scenario: HOME }).html).length > 0, "W21 still shows the box");
  assert.ok(checkboxes(frame({ page: "W53", token: "acknowledged", role: "instructor" }).html).length > 0, "W53 still shows the box");
});

test("SPINE-08: the reviewed and acknowledged variants link back to the unconfirmed variant", () => {
  const base = (g) => g.split("~")[0];
  const links = [
    [frame({ page: "W21", token: "reviewed", role: "student", scenario: HOME }), "W21"],
    [frame({ page: "W21", token: "motion-reviewed", role: "student", scenario: "group_work_in_progress" }), "W21:motion"],
    [frame({ page: "W53", token: "acknowledged", role: "instructor" }), "W53"],
  ];
  for (const [f, target] of links) assert.ok(goLinks(mainOf(f.html)).map(base).includes(target), target);
  assert.ok(goLinks(frame({ page: "W21", role: "student", scenario: HOME }).html).includes("W21:reviewed"));
  assert.ok(goLinks(frame({ page: "W53", role: "instructor" }).html).some((g) => base(g) === "W53:acknowledged"));
});

// ---------- SPINE-09: W48 iPhone offline ----------
test("SPINE-09: W48 on iPhone offline shows the offline notice and the last-known flag", () => {
  for (const role of ["instructor", "ta"]) {
    const main = mainOf(frame({ page: "W48", token: "offline", role, platform: "iphone" }).html);
    assert.ok(main.includes(esc("You're offline. Showing the last copy saved on this device")), `${role} notice`);
    assert.ok(main.includes(WB.K.flag("lastKnown")), `${role} flag`);
  }
});

// ---------- SPINE-10: W51 native filteredEmpty ----------
test("SPINE-10: W51 on iPad and iPhone filteredEmpty shows the filter message, no learner grades, and keeps the iPhone handoff", () => {
  for (const c of [{ platform: "ipad", orientation: "landscape" }, { platform: "ipad", orientation: "portrait" }, { platform: "iphone" }]) {
    const main = mainOf(frame({ page: "W51", token: "filteredEmpty", role: "instructor", ...c }).html);
    assert.ok(main.includes("No learners match the filter"), c.platform);
    assert.ok(main.includes("Clear filters"), c.platform);
    assert.ok(!main.includes("Grade items for"), `${c.platform} no learner list`);
    assert.ok(!main.includes("Total (staff, includes held)"), `${c.platform} no totals`);
  }
  const phone = mainOf(frame({ page: "W51", token: "filteredEmpty", role: "instructor", platform: "iphone" }).html);
  assert.ok(phone.includes("Open on a larger screen"), "iPhone handoff");
});

// ---------- SPINE-11: every spine test file runs through index.js ----------
test("SPINE-11: tools/index.js imports every spine test file", () => {
  const index = readFileSync(join(HERE, "index.js"), "utf8");
  const spine = readdirSync(HERE).filter((f) => /^spine.*\.test\.mjs$/.test(f));
  assert.ok(spine.length >= 4);
  for (const f of spine) assert.ok(index.includes(`import("./${f}")`), f);
});
