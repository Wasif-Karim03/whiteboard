import test from "node:test";
import assert from "node:assert/strict";
import { WB, S, P, esc, view, viewer, copy, direct, rowsWith, mainOf, when } from "./spine_helpers.mjs";

const groups = { todo: ["notStarted", "draft", "queued"], handed: ["received", "receivedNotReleased"], feedback: ["released", "feedbackUpdated"] };

test("W18 filters published learner records by the same status families as courseworkCounts", () => {
  const v = view(), who = viewer("default", "student");
  const items = P.assessments({ view: v, who });
  const counts = S.courseworkCounts(v, who.courseId, who.personId);
  for (const platform of ["web", "ipad", "iphone"]) for (const [variant, keys] of Object.entries(groups)) {
    const result = direct("W18", { role: "student", platform, variant });
    assert.deepEqual(result.problems, []);
    const expected = items.filter((item) => {
      const sub = S.submissionFor(v, who.personId, item.id) || { state: "notStarted", released: false };
      return keys.includes(WB.manifest.status.keyFor(sub, "student", { own: true }).key);
    });
    assert.equal(expected.length, counts[{ todo: "toDo", handed: "handedIn", feedback: "released" }[variant]]);
    for (const item of items) assert.equal(rowsWith(result.html, esc(item.title)).length > 0, expected.includes(item), `${platform} ${variant} ${item.title}`);
    assert.match(result.html, new RegExp(`data-go="W18:${variant}" aria-current="page"|aria-current="page"[^>]*data-go="W18:${variant}"`));
  }
});

test("W05 upcoming list uses published items, exact due times, personal statuses and selector progress", () => {
  const data = copy(WB.data), v = S.buildView(data, "default"), who = S.viewerFor(v, "student");
  const next = S.nextDue(v, who.courseId, who);
  const upcoming = P.assessments({ view: v, who }).filter((item) => !next || item.id !== next.assessmentId).map((item) => ({ item, due: item.quiz_id ? S.quiz(v, item.quiz_id).close : item.due })).filter((x) => x.due && !S.isBefore(x.due, v.clock));
  assert.ok(upcoming.length);
  const count = S.courseworkCounts(v, who.courseId, who.personId);
  for (const platform of ["web", "iphone"]) {
    const html = mainOf(direct("W05", { role: "student", data, platform }).html);
    const list = html.match(/<ul[^>]*aria-label="Upcoming coursework"[\s\S]*?<\/ul>/)[0];
    assert.ok(!next || !list.includes(esc(S.assessment(v, next.assessmentId).title)), "priority task is not repeated in the secondary list");
    for (const row of upcoming) {
      assert.ok(list.includes(esc(row.item.title)) && list.includes(esc(when(row.due))));
      const sub = S.submissionFor(v, who.personId, row.item.id) || { state: "notStarted", released: false };
      const status = WB.manifest.status.keyFor(sub, "student", { own: true });
      assert.ok(list.includes(esc(WB.STATUS[status.key].label)));
    }
    assert.ok(html.includes(`aria-valuenow="${count.handedIn + count.released}"`) && html.includes(`aria-valuemax="${count.all}"`));
  }
});

test("W05 TA progress remains scoped to assigned learners", () => {
  const data = copy(WB.data), task = data.staff.grading_tasks[0];
  task.learner_ids = [task.learner_ids[0]];
  const v = S.buildView(data, "default"), who = S.viewerFor(v, "ta");
  const progress = S.reviewProgress(v, task.assessment_id, who);
  const html = mainOf(direct("W05", { role: "ta", data }).html);
  assert.ok(html.includes(`You have reviewed ${progress.reviewed} of ${progress.of}`));
  assert.ok(!html.includes("Release feedback"));
});

test("W05 submission progress and status counts track released feedback across scenarios", () => {
  const counts = {};
  for (const scenario of ["default", "ps4_released"]) {
    const v = view(scenario), who = viewer(scenario, "student");
    const c = S.courseworkCounts(v, who.courseId, who.personId);
    counts[scenario] = c;
    for (const platform of ["web", "iphone"]) {
      const result = direct("W05", { role: "student", scenario, platform });
      assert.deepEqual(result.problems, []);
      const html = mainOf(result.html);
      assert.ok(html.includes(`aria-valuenow="${c.handedIn + c.released}"`));
      for (const [label, value] of [["To do", c.toDo], ["Awaiting feedback", c.handedIn], ["Feedback available", c.released]]) {
        const stat = [...html.matchAll(/<div class="wb-stat">[\s\S]*?<\/div>/g)].map((m) => m[0]).find((s) => s.includes(label));
        assert.ok(stat && stat.includes(`>${value}<`), `${scenario} ${platform} ${label}`);
      }
    }
  }
  // Other coursework also changes between these scenario clocks; each displayed count above follows its selector.
  assert.notEqual(counts.ps4_released.handedIn, counts.default.handedIn);
  assert.ok(counts.ps4_released.released > counts.default.released);
  assert.ok(counts.ps4_released.handedIn + counts.ps4_released.released >= counts.default.handedIn + counts.default.released);
});

test("W18 empty presets show counts consistent with their visible rows and offer a real reset", () => {
  for (const platform of ["web", "ipad", "iphone"]) {
    const empty = mainOf(direct("W18", { role: "student", state: "firstUseEmpty", platform }).html);
    assert.ok(empty.includes("No coursework is published yet"));
    assert.ok(!empty.includes('aria-label="Filter coursework"'));
    const filtered = mainOf(direct("W18", { role: "student", state: "filteredEmpty", platform }).html);
    assert.match(filtered, /To do \(0\)/);
    assert.ok(filtered.includes("No work matches this filter"));
    assert.match(filtered, /data-go="W18"[^>]*>Clear filters|data-go="W18"[^>]*>[\s\S]*?Clear filters/);
    const restored = mainOf(direct("W18", { role: "student", platform }).html);
    const v = view(), who = viewer("default", "student");
    const count = S.courseworkCounts(v, who.courseId, who.personId);
    assert.ok(restored.includes(`All (${count.all})`));
    assert.ok(!restored.includes("No work matches this filter"));
  }
});

test("W06 identifies the term control as a nonfunctional preview", () => {
  const html = mainOf(direct("W06", { role: "student", platform: "web" }).html);
  assert.ok(html.includes("Preview only: term filtering does not run in this prototype"));
});
