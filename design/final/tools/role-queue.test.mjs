import test from "node:test";
import assert from "node:assert/strict";
import { WB, S, P, view, viewer, copy, direct, mainOf, esc, goLinks, when } from "./spine_helpers.mjs";

const scenario = "group_submission";
const ps = S.anchorFor("W48").record.id;
const motion = S.anchorFor("W19", "motion").record.id;
function taskData() {
  const data = copy(WB.data), task = data.staff.grading_tasks[0];
  const v = view(scenario), ta = viewer(scenario, "ta");
  const receipts = S.receiptsFor(v, motion, viewer(scenario, "instructor"));
  assert.ok(receipts.length && receipts[0].captured_members.length);
  data.staff.grading_tasks.push({ ...task, id: task.id + "-motion", assessment_id: motion, learner_ids: [...receipts[0].captured_members], question_ids: ["*"], access_end: S.addMinutes(v.clock, 1440) });
  return { data, ta, receipts };
}

test("W19 staff links name only the queue that resolves to the displayed assignment", () => {
  for (const role of ["instructor", "ta"]) for (const platform of ["web", "ipad", "iphone"]) {
    const normal = direct("W19", { role, platform });
    assert.ok(goLinks(mainOf(normal.html)).includes(P.recordGo("W48", "assessment", ps)));
    const result = direct("W19", { role, platform, variant: "motion" });
    assert.ok(!goLinks(mainOf(result.html)).includes("W48"));
    if (role === "instructor") assert.ok(result.html.includes("grading queue for this assignment is not drawn"));
  }
});

test("W48 keeps other assignment receipts separate from problem-set queue and retains group grader link", () => {
  const v = view(scenario), ins = viewer(scenario, "instructor");
  const psReceipts = S.receiptsFor(v, ps, ins), groups = S.receiptsFor(v, motion, ins);
  assert.ok(psReceipts.length && groups.length);
  for (const platform of ["web", "ipad", "iphone"]) {
    const result = direct("W48", { role: "instructor", scenario, platform });
    assert.deepEqual(result.problems, []);
    const html = mainOf(result.html), divider = html.indexOf("Other assignment: ");
    assert.ok(divider > 0);
    const main = html.slice(0, divider), other = html.slice(divider);
    for (const receipt of psReceipts) assert.ok(main.includes(esc(receipt.id)) && !other.includes(esc(receipt.id)));
    for (const receipt of groups) assert.ok(other.includes(esc(receipt.id)) && !main.includes(esc(receipt.id)));
    assert.ok(goLinks(other).includes(P.recordGo("W49", "receipt", groups[0].id)));
    const got = S.receivedProgress(v, ps, ins), done = S.reviewProgress(v, ps, ins);
    assert.ok(main.includes(`${got.received} of ${got.of}`) && main.includes(`${done.reviewed} of ${done.of}`));
  }
});

test("W48 separately checks each TA task, including missing and expired problem-set allocations", () => {
  for (const mode of ["missing", "expired"]) {
    const { data, receipts } = taskData(), task = data.staff.grading_tasks[0], v = view(scenario);
    if (mode === "missing") data.staff.grading_tasks.shift();
    else task.access_end = S.addMinutes(v.clock, -60);
    for (const platform of ["web", "ipad", "iphone"]) for (const state of [null, "offline", "notYetAvailable"]) {
      const result = direct("W48", { role: "ta", scenario, data, platform, state: state === "notYetAvailable" ? null : state });
      assert.deepEqual(result.problems, []);
      const html = mainOf(result.html);
      assert.ok(html.includes(mode === "missing" ? "not in your grading tasks" : "Your grading access for this assignment has ended"));
      assert.ok(html.includes(esc(receipts[0].id)) && goLinks(html).includes(P.recordGo("W49", "receipt", receipts[0].id)));
      assert.ok(!goLinks(html).includes("W53"));
      const psReceipts = S.receiptsFor(v, ps, viewer(scenario, "instructor"));
      for (const r of psReceipts) assert.ok(!html.includes(esc(r.id)));
      const assignment = direct("W19", { role: "ta", scenario, data, platform, state }).html;
      assert.ok(!goLinks(mainOf(assignment)).includes("W48"));
    }
  }
  const { data } = taskData();
  data.staff.grading_tasks[1].access_end = S.addMinutes(view(scenario).clock, -60);
  const html = direct("W48", { role: "ta", scenario, data }).html;
  const groups = S.receiptsFor(view(scenario), motion, viewer(scenario, "instructor"));
  assert.ok(!html.includes(esc(groups[0].id)));
});


test("expired PS4 task never offers its queue on W19 or W53 while active Motion remains available", () => {
  const { data, receipts } = taskData();
  const end = S.addMinutes(view(scenario).clock, -60);
  data.staff.grading_tasks[0].access_end = end;
  for (const platform of ["web", "ipad", "iphone"]) {
    for (const page of ["W19", "W53"]) for (const state of [null, "offline", "loading"]) {
      const html = mainOf(direct(page, { role: "ta", scenario, data, platform, state }).html);
      assert.ok(html.includes("Your grading access for this assignment has ended"), `${page} ${platform} ${state}`);
      assert.ok(html.includes(esc(when(end))));
      assert.ok(!goLinks(html).includes("W48") && !goLinks(html).includes("W53"));
    }
    const html = mainOf(direct("W48", { role: "ta", scenario, data, platform }).html);
    assert.ok(html.includes(esc(when(end))) && html.includes(esc(receipts[0].id)));
    assert.ok(goLinks(html).includes(P.recordGo("W49", "receipt", receipts[0].id)));
  }
});
