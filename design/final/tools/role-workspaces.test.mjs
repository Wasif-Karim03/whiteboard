// Cross-role workflow/data agreement. Local source renders only, not runtime authorization or browser QA.
import test from "node:test";
import assert from "node:assert/strict";
import { WB, S, P, view, viewer, copy, direct, frame, mainOf, goLinks, esc, rowsWith, when } from "./spine_helpers.mjs";
const itemId = S.anchorFor("W48").record.id;
function body(page, role, o = {}) { return mainOf(direct(page, { role, ...o }).html); }

test("students, instructors and TAs have distinct entry tasks and retain the same route identities", () => {
  for (const platform of ["web", "ipad", "iphone"]) {
    const student = frame({ page: "W05", role: "student", platform }).html;
    const instructor = frame({ page: "W05", role: "instructor", platform }).html;
    const ta = frame({ page: "W05", role: "ta", platform }).html;
    assert.match(student, /Your next step/); assert.ok(!mainOf(student).includes('data-go="W35"'));
    assert.match(instructor, /Teaching today/); assert.match(instructor, /Review and release/);
    assert.match(instructor, /Reviewed results stay held until you release them/);
    assert.match(ta, /My grading tasks/); assert.ok(!mainOf(ta).includes('data-go="W53"'));
    for (const html of [student, instructor, ta]) {
      for (const [nav, page] of [["today", "W05"], ["courses", "W06"], ["calendar", "W07"]]) assert.ok(html.includes(`href="#/${page}" data-nav="${nav}"`));
    }
  }
});

test("course cards open learning for students and authoring for teaching roles", () => {
  for (const platform of ["web", "ipad", "iphone"]) {
    assert.ok(goLinks(body("W06", "student", { platform })).includes("W14"));
    for (const role of ["instructor", "ta"]) {
      const html = body("W06", role, { platform });
      assert.ok(goLinks(html).includes("W35"));
      assert.ok(!goLinks(html).includes("W14"));
    }
  }
});

test("teaching Today, assessment management and queue share assessment-specific counts and release readiness", () => {
  for (const scenario of ["default", "ps4_released"]) {
    const v = view(scenario), who = viewer(scenario, "instructor");
    const got = S.receivedProgress(v, itemId, who), done = S.reviewProgress(v, itemId, who);
    const ready = S.releaseReady(v, itemId, who).filter((r) => r.included);
    const home = body("W05", "instructor", { scenario });
    const row = rowsWith(body("W18", "instructor", { scenario }), esc(S.assessment(v, itemId).title)).join("");
    const queue = body("W48", "instructor", { scenario });
    for (const html of [home, row, queue]) {
      assert.ok(html.includes(`${got.received} of ${got.of}`));
      assert.ok(html.includes(`${done.reviewed} of ${done.of}`));
    }
    assert.ok(home.includes(`<dd>${ready.length}</dd>`));
    assert.ok(home.includes(ready.length ? "Review release" : "View release history"));
    assert.ok(!body("W05", "student", { scenario }).includes("Ready for release"));
  }
});

test("assessment rows lead to each role's actual work and unpublished planning stays instructor-only", () => {
  const data = copy(WB.data), item = data.coursework.assessments.find((i) => i.id === itemId);
  item.published = false;
  const v = S.buildView(data, "default"), title = esc(item.title);
  const instructor = body("W18", "instructor", { data });
  assert.ok(instructor.includes(title) && instructor.includes("Unpublished"));
  assert.ok(rowsWith(instructor, title).join("").includes('data-go="W40"'));
  for (const role of ["student", "ta"]) assert.ok(!body("W18", role, { data }).includes(title));
  assert.equal(S.courseAssessments(v, { personId: viewer("default", "student").personId, courseId: item.course_id, role: "instructor" }).length, 0);
  const normal = view(), title2 = esc(S.assessment(normal, itemId).title);
  for (const [role, go] of [["student", "W19"], ["instructor", "W40"], ["ta", "W48"]]) {
    assert.ok(rowsWith(body("W18", role), title2).join("").includes(`data-go="${go}"`));
  }
});

test("published preview retains staff identity and contains no grading/release dashboard", () => {
  for (const role of ["instructor", "ta"]) for (const platform of ["web", "ipad", "iphone"]) {
    const html = body("W14", role, { platform });
    assert.ok(html.includes("Published course content") && html.includes(WB.ROLE_LABELS[role]));
    assert.ok(html.includes("Return to course builder"));
    assert.ok(!html.includes('data-go="W53"') && !html.includes('data-go="W48"'));
    assert.ok(!html.includes("Ready for release"));
  }
  assert.ok(body("W35", "instructor").includes("Preview published course"));
  assert.ok(!body("W35", "instructor").includes("Preview as learner"));
});

test("a TA with another active task receives no expired/default-assessment queue from course lists", () => {
  const data = copy(WB.data), base = data.staff.grading_tasks[0], v = view("group_submission");
  const other = S.anchorFor("W19", "motion").record.id;
  const receipt = S.receiptsFor(v, other, viewer("group_submission", "instructor"))[0];
  base.access_end = S.addMinutes(v.clock, -1);
  data.staff.grading_tasks.push({ ...base, id: base.id + "-other", assessment_id: other, question_ids: ["*"], learner_ids: [...receipt.captured_members], access_end: S.addMinutes(v.clock, 1440) });
  for (const page of ["W14", "W18"]) {
    const html = body(page, "ta", { data, scenario: "group_submission" });
    assert.ok(!goLinks(html).includes("W48"));
    assert.ok(html.includes("Your grading access for this assignment has ended"));
    assert.ok(html.includes(esc(when(base.access_end))));
  }
  for (const page of ["W05", "W18"]) {
    const assigned = body(page, "ta", { data, scenario: "group_submission" });
    assert.ok(goLinks(assigned).includes(P.recordGo("W49", "receipt", receipt.id)), page);
    assert.ok(!goLinks(assigned).includes("W48"), page);
  }
});

test("quiz deadline source agrees in learner coursework, staff management, builder and calendar", () => {
  const data = copy(WB.data), quiz = data.quiz.quizzes.find((q) => q.id === S.anchorFor("W25").record.id);
  const item = data.coursework.assessments.find((it) => it.quiz_id === quiz.id);
  quiz.close = S.addMinutes(quiz.close, 30);
  item.due = S.addMinutes(quiz.close, -180);
  const exact = esc(when(quiz.close));
  for (const [page, role] of [["W18", "student"], ["W18", "instructor"], ["W35", "instructor"]]) {
    const row = rowsWith(body(page, role, { data }), esc(item.title)).join("");
    assert.ok(row.includes(exact), `${page} ${role}`);
    assert.ok(!row.includes(esc(when(item.due))));
  }
  const v = S.buildView(data, "default"), who = S.viewerFor(v, "student");
  assert.equal(S.calendarEntries(v, who, who.courseId).find((e) => e.id === "due-" + item.id).start, quiz.close);
});

test("released learner grades agree with staff released totals while held totals remain distinct", () => {
  const v = view(), who = viewer("default", "student"), ins = viewer("default", "instructor");
  const gb = S.gradebook(v, who.courseId, ins), row = gb.rows.find((r) => r.personId === who.personId);
  const own = S.courseTotal(v, who.courseId, who.personId, who);
  assert.equal(row.releasedTotal, own.display);
  const student = body("W24", "student"), staff = body("W51", "instructor");
  assert.ok(student.includes(esc(own.display)) && student.includes("Released results only"));
  assert.ok(staff.includes("Total (staff, includes held)") && staff.includes("Released total"));
  if (row.total !== row.releasedTotal) assert.ok(!student.includes(esc(row.total)));
});


test("published preview does not invent expiry for a TA with no allocation history", () => {
  const data = copy(WB.data); data.staff.grading_tasks = [];
  for (const platform of ["web", "ipad", "iphone"]) {
    const html = body("W14", "ta", { data, platform });
    assert.ok(html.includes("Published course content"));
    assert.ok(!html.includes("Your grading access for this course has ended"));
    assert.ok(!html.includes("Your grading access for this assignment has ended"));
    assert.ok(!goLinks(html).includes("W48"));
  }
});
