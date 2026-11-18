import test from "node:test";
import assert from "node:assert/strict";
import { S, view, viewer, frame, direct, copy, WB, mainOf, esc } from "./spine_helpers.mjs";

function details(html, label) {
  return [...html.matchAll(/<details\b[^>]*>[\s\S]*?<\/details>/g)].map((m) => m[0]).find((d) => d.includes(`<summary class="wb-disclosure__summary">${label}</summary>`));
}
function closed(d) { assert.ok(d); assert.doesNotMatch(d.match(/^<details[^>]*>/)[0], /\bopen\b/); }
function outside(html, d) { return html.replace(d, ""); }

test("W14 prioritizes next due, keeps progress collapsed, and uses the course title", () => {
  const v = view(), who = viewer("default", "student"), course = S.course(v, who.courseId);
  for (const platform of ["web", "ipad", "iphone"]) {
    const result = frame({ page: "W14", role: "student", platform });
    const html = mainOf(result.html);
    assert.ok(result.html.includes(esc(course.title)) && html.includes(esc(course.code)) && html.includes(esc(course.term)));
    const d = details(html, "Course progress"); closed(d);
    const next = S.nextDue(v, who.courseId, who);
    assert.ok(outside(html, d).includes(esc(S.assessment(v, next.assessmentId).title)));
    assert.ok(html.indexOf("Next due") < html.indexOf('aria-label="Module coursework"'));
  }
});

test("W19 keeps due and the next action before collapsed submission details", () => {
  for (const platform of ["web", "ipad", "iphone"]) {
    const html = mainOf(frame({ page: "W19", role: "student", platform }).html);
    const d = details(html, "Submission details and rubric"); closed(d);
    const visible = outside(html, d);
    assert.ok(visible.includes("Due") && visible.includes("Points"));
    const v = view(), it = S.assessment(v, S.anchorFor("W19").record.id);
    if (it.close) assert.ok(visible.includes("Closes") && visible.includes(esc(S.fmtDateTime(it.close))));
    assert.match(visible, /View receipt|Continue work|Add work|View feedback/);
    assert.ok(html.indexOf("Due") < html.indexOf("Submission details and rubric"));
  }
});

test("W20 keeps review and errors visible while complete tags are collapsed", () => {
  for (const platform of ["web", "ipad", "iphone"]) {
    const html = mainOf(frame({ page: "W20", role: "student", platform, scenario: "assignment_submission" }).html);
    const d = details(html, "Pages and question tags"); closed(d);
    assert.ok(outside(html, d).includes("Review and submit"));
    const bad = mainOf(frame({ page: "W20", role: "student", platform, token: "invalid", scenario: "assignment_submission" }).html);
    assert.ok(bad.includes("This file type cannot be handed in") && bad.includes("Pages and questions"));
    assert.ok(!details(bad, "Pages and question tags"));
  }
  const data = copy(WB.data);
  const draft = data.scenarios.overrides.assignment_submission.find((o) => o.collection === "drafts" && o.op === "add").record;
  draft.page_tags = [];
  const html = mainOf(direct("W20", { role: "student", data, scenario: "assignment_submission" }).html);
  assert.ok(html.includes("Some questions have no page") && html.includes("Pages and questions"));
  assert.ok(!details(html, "Pages and question tags"));
});

test("W24 keeps released total and results visible with category breakdown collapsed", () => {
  for (const platform of ["web", "ipad", "iphone"]) {
    const html = mainOf(frame({ page: "W24", role: "student", platform }).html);
    const d = details(html, "Category breakdown"); closed(d);
    const visible = outside(html, d);
    assert.ok(visible.includes("Course total") && visible.includes("Released results only") && visible.includes("Grade items"));
  }
});

test("W14 next task appears once with a record-true primary action outside progress", () => {
  const v = view(), who = viewer("default", "student"), next = S.nextDue(v, who.courseId, who);
  const item = S.assessment(v, next.assessmentId);
  const go = WB.P.recordGo("W19", "assessment", item.id) || WB.P.recordGo("W25", "assessment", item.id);
  assert.ok(go);
  for (const platform of ["web", "ipad", "iphone"]) {
    const html = mainOf(frame({ page: "W14", role: "student", platform }).html);
    const d = details(html, "Course progress"); closed(d);
    const visible = outside(html, d);
    assert.equal(visible.split(esc(item.title)).length - 1, 1);
    const action = [...visible.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map((m) => m[0]).find((a) => a.includes(`data-go="${go}"`));
    assert.ok(action && action.includes("wb-btn--primary"));
    assert.ok(action.includes(item.quiz_id ? "View quiz rules" : "View assignment"));
  }
});

test("W19 retains TA expiry and allocation notices in the not-yet view", () => {
  const names = S.enrolled(view(), viewer("default", "student").courseId, "student").map((id) => S.person(view(), id).name);
  for (const platform of ["web", "ipad", "iphone"]) {
    for (const state of [null, "offline", "notYetAvailable"]) {
      const result = direct("W19", { role: "ta", scenario: "ta_expired", state, platform });
      assert.deepEqual(result.problems, []);
      const html = mainOf(result.html);
      assert.ok(html.includes("Your grading access for this course has ended"), `${platform} ${state}`);
      if (state === "notYetAvailable") assert.ok(html.includes("This assignment opens later"));
      for (const name of names) assert.ok(!html.includes(esc(name)));
      assert.ok(!html.includes('data-go="W53"'));
    }
    const unallocated = mainOf(direct("W19", { role: "ta", variant: "motion", state: "notYetAvailable", platform }).html);
    assert.ok(unallocated.includes("This assignment is not in your grading tasks"));
    assert.ok(unallocated.includes("This assignment opens later"));
    assert.ok(!unallocated.includes('data-go="W53"'));
  }
});
