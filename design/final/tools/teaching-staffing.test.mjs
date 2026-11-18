import test from "node:test";
import assert from "node:assert/strict";
import { WB, S, copy, direct, view, viewer, mainOf, esc, goLinks } from "./spine_helpers.mjs";

const ins = viewer("default", "instructor"), ta = viewer("default", "ta");

test("W45 team and W57 plan use actual enrollment and allocations", () => {
  for (const mode of ["no-ta", "unassigned"]) {
    const data = copy(WB.data);
    if (mode === "no-ta") data.world.enrollments = data.world.enrollments.filter((e) => !(e.person_id === ta.personId && e.role === "ta"));
    data.staff.grading_tasks = [];
    for (const platform of ["web", "ipad", "iphone"]) {
      const roster = direct("W45", { role: "instructor", data, platform });
      const plan = direct("W57", { role: "instructor", data, platform });
      assert.deepEqual(roster.problems, []); assert.deepEqual(plan.problems, []);
      const people = mainOf(roster.html), allocation = mainOf(plan.html);
      assert.ok(people.includes(mode === "no-ta" ? "No teaching assistants enrolled" : esc(S.person(view(), ta.personId).name)));
      if (mode === "no-ta") assert.ok(!people.includes(esc(S.person(view(), ta.personId).name)));
      else assert.ok(people.includes("No grading tasks"));
      assert.ok(!people.includes("Revoke access"));
      assert.ok(allocation.includes("No grading tasks yet") && !allocation.includes("Flag this task for follow-up"));
      assert.ok(allocation.includes("Instructor-owned work"));
    }
  }
});

test("W45 selected second learner shows their own course work on all tiers", () => {
  const v = view(), learners = S.teachingLearners(v, ins);
  assert.ok(learners.length >= 2);
  const learner = learners[1], projection = S.teachingStudent(v, ins, learner.id);
  for (const platform of ["web", "ipad", "iphone"]) {
    const html = mainOf(direct("W45", { role: "instructor", platform, selection: { courseId: ins.courseId, learnerId: learner.id } }).html);
    assert.ok(html.includes(esc(learner.name)) && html.includes("Work and grades"));
    assert.ok(html.includes("Previous learner") && html.includes("Next learner"));
    for (const entry of projection.items) assert.ok(html.includes(esc(entry.assessment.title)));
    for (const entry of projection.items) for (const rec of entry.receipts) assert.ok(goLinks(html).some((go) => go.includes(`tr=${encodeURIComponent(rec.id)}`)));
    assert.ok(!html.includes(esc(learners[0].name)));
  }
});

test("W57 shows task-specific questions and only instructor sees uncovered work", () => {
  const data = copy(WB.data), task = data.staff.grading_tasks[0];
  task.question_ids = [task.question_ids[0]];
  const v = S.buildView(data, "default"), actual = S.teachingTaskQuestions(v, ins, task);
  assert.ok(actual.length);
  for (const platform of ["web", "ipad", "iphone"]) {
    const html = mainOf(direct("W57", { role: "instructor", data, platform }).html);
    assert.ok(html.includes(`Question ${actual[0].id}`));
    assert.ok(html.includes("Instructor-owned work") && html.includes("Question"));
    const restricted = mainOf(direct("W57", { role: "ta", data, platform }).html);
    assert.ok(!restricted.includes("Instructor-owned work") && !goLinks(restricted).some((go) => /^W53/.test(go)));
    const outsider = S.enrolled(v, ins.courseId, "student").find((id) => !task.learner_ids.includes(id));
    assert.ok(!restricted.includes(esc(S.person(v, outsider).name)));
  }
});

test("W57 identifies uncovered learner-question pairs for disjoint TA allocations", () => {
  const data = copy(WB.data), first = data.staff.grading_tasks[0];
  const learners = first.learner_ids.slice(0, 2), questions = first.question_ids.slice(0, 2);
  assert.equal(learners.length, 2); assert.equal(questions.length, 2);
  first.learner_ids = [learners[0]]; first.question_ids = [questions[0]];
  const id = `${first.ta_id}-second`, original = data.world.people.find((p) => p.id === first.ta_id);
  const enrollment = data.world.enrollments.find((e) => e.person_id === first.ta_id && e.role === "ta");
  data.world.people.push({ ...original, id, name: "Second teaching assistant" });
  data.world.enrollments.push({ ...enrollment, person_id: id });
  data.staff.grading_tasks.push({ ...first, id: `${first.id}-second`, ta_id: id, learner_ids: [learners[1]], question_ids: [questions[1]] });
  const v = S.buildView(data, "default"), coverage = S.teachingCoverage(v, ins).find((row) => row.assessment.id === first.assessment_id);
  for (let i = 0; i < 2; i += 1) {
    const pair = coverage.uncoveredPairs.find((p) => p.person.id === learners[i]);
    assert.ok(pair.questions.some((q) => q.id === questions[1 - i]));
    const html = mainOf(direct("W57", { role: "instructor", data }).html);
    assert.ok(html.includes(esc(pair.person.name)) && html.includes(`Question ${questions[1 - i]}`));
  }
});

test("W57 fictional staffing examples navigate by scenario and preserve handover attribution", () => {
  const scenarios = ["ta_unassigned", "ta_handover"];
  for (const platform of ["web", "ipad", "iphone"]) {
    const html = mainOf(direct("W57", { role: "instructor", platform }).html);
    assert.ok(html.includes("Staffing examples") && html.includes("fictional examples"));
    for (const sc of scenarios) assert.ok(goLinks(html).some((go) => go.startsWith(`W57:examples~${sc}?`)));
    const offline = mainOf(direct("W57", { role: "instructor", platform, state: "offline" }).html);
    for (const sc of scenarios) assert.ok(!goLinks(offline).some((go) => go.startsWith(`W57:examples~${sc}`)));
    const taHtml = mainOf(direct("W57", { role: "ta", platform }).html);
    assert.ok(!taHtml.includes("Staffing examples") && !taHtml.includes("Staffing history"));
    for (const sc of scenarios) {
      const v = view(sc), team = S.teachingTeam(v, S.viewerFor(v, "instructor"));
      const result = direct("W57", { role: "instructor", platform, scenario: sc });
      assert.deepEqual(result.problems, []);
      const body = mainOf(result.html);
      assert.ok(body.includes("No grading tasks yet"));
      if (sc === "ta_handover") {
        assert.equal(team.history.length, 1);
        const h = team.history[0];
        assert.ok(body.includes("Staffing history") && body.includes(esc(S.person(v, h.from_ta_id).name)) && body.includes(esc(S.person(v, h.actor_id).name)));
        assert.ok(body.includes(esc(S.assessment(v, h.assessment_id).title)));
        assert.ok(S.gradeDraftFor(v, S.teachingLearners(v, S.viewerFor(v, "instructor"))[0].id, h.assessment_id, S.viewerFor(v, "instructor")));
      }
    }
  }
});

test("W45 offers contextual grade records without receipts and resets item when switching learners", () => {
  const v = view(), learners = S.teachingLearners(v, ins), person = learners[1];
  const entry = S.teachingStudent(v, ins, person.id).items.find((item) => !item.receipts.length);
  assert.ok(entry);
  const html = mainOf(direct("W45", { role: "instructor", selection: { courseId: ins.courseId, learnerId: person.id, assessmentId: entry.assessment.id } }).html);
  assert.ok(html.includes("Selected assessment") && html.includes("Open grade record"));
  const links = goLinks(html);
  assert.ok(links.some((go) => go.startsWith("W49?") && go.includes(`ta=${encodeURIComponent(entry.assessment.id)}`) && go.includes(`tl=${encodeURIComponent(person.id)}`) && !go.includes("tr=")));
  const other = links.find((go) => go.startsWith("W45?") && go.includes(`tl=${encodeURIComponent(learners[0].id)}`));
  assert.ok(other && !other.includes("ta=") && !other.includes("tr="));
});
