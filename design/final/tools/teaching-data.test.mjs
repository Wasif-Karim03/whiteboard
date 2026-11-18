// Fictional course grading/teaching projections. Source checks only.
import test from "node:test";
import assert from "node:assert/strict";
import { loadAll } from "./load_data.mjs";
const W = loadAll(), S = W.sel, PHYS = "phys110-f26", MATH = "math220-f26";
const who = (role, courseId = PHYS, personId = role === "instructor" ? "reyes" : role === "ta" ? "maya" : "aisha") => ({ role, personId, courseId });
const base = () => S.scenarioView("default");
const copy = () => JSON.parse(JSON.stringify(W.data));
const view = (d) => S.buildView(d, "default");
const plain = (x) => JSON.parse(JSON.stringify(x));

test("PHYS golden totals and reviewed receipt fingerprint remain exact", () => {
  const v = base(), instructor = who("instructor");
  assert.equal(S.courseTotal(v, PHYS, "aisha", who("student")).display, "84.50%");
  assert.equal(S.courseTotal(v, PHYS, "aisha", instructor).display, "85.17%");
  const p = S.releasePreview(v, PHYS, "aisha", "ps4", instructor);
  assert.equal(p.before, "84.50%"); assert.equal(p.after, "85.17%");
  assert.equal(p.fingerprint, "fp-dd91aa69");
  assert.equal(W.data.grades.grade_drafts[0].id, "aisha-ps4");
});

test("MATH has an independent held total, policy, draft and release fingerprint", () => {
  const v = base(), instructor = who("instructor", MATH), student = who("student", MATH);
  assert.equal(S.gradingPolicy(v, MATH, instructor).id, "math220-policy");
  assert.equal(S.courseTotal(v, MATH, "aisha", instructor).display, "80.00%");
  assert.equal(S.courseTotal(v, MATH, "aisha", student).display, null);
  const r = S.resultFor(v, "aisha", "math-assignment", student);
  assert.equal(r.score, null); assert.ok(!Object.hasOwn(r, "staffOutcome"));
  const p = S.releasePreview(v, MATH, "aisha", "math-assignment", instructor);
  assert.equal(p.before, null); assert.equal(p.after, "80.00%");
  assert.equal(p.inputs.receipt.id, "AH-MATH220-001"); assert.equal(p.inputs.receipt.attempt, 2);
  assert.equal(p.inputs.policy.id, "math220-policy"); assert.deepEqual(plain(p.inputs.released), []);
  assert.notEqual(p.fingerprint, "fp-dd91aa69");
  const book = S.gradebook(v, MATH, instructor);
  assert.deepEqual(plain(book.items.map((x) => x.id)), ["math-assignment"]);
  assert.deepEqual(plain(book.rows.map((x) => x.personId)), ["aisha", "ben"]);
  assert.equal(book.rows.find((x) => x.personId === "ben").total, "60.00%");
  assert.equal(S.gradeDraftFor(v, "ben", "math-assignment", instructor), null);
});

test("cross-course selectors fail closed and never fall back to PHYS policy", () => {
  const v = base(), math = who("instructor", MATH), phys = who("instructor");
  assert.equal(S.resultFor(v, "aisha", "ps4", math), null);
  assert.equal(S.gradeDraftFor(v, "aisha", "ps4", math), null);
  assert.equal(S.resultFor(v, "carmen", "math-assignment", math), null);
  assert.equal(S.courseTotal(v, MATH, "carmen", math), null);
  assert.equal(S.releasePreview(v, MATH, "aisha", "ps4", math), null);
  assert.equal(S.releaseReady(v, "ps4", math), null);
  assert.equal(S.releasesFor(v, "ps4", math), null);
  assert.equal(S.lastReleaseAt(v, PHYS, math), null);
  assert.equal(S.gradeRows(v, MATH, "aisha", phys), null);
  const d = copy(); d.grades.policies = [];
  const missing = view(d);
  assert.equal(S.gradebook(missing, MATH, math), null);
  assert.equal(S.categoryPercent(missing, MATH, "aisha", "assignments", math), null);
  assert.equal(S.resultFor(missing, "aisha", "math-assignment", math), null);
  assert.equal(S.releaseReady(missing, "math-assignment", math), null);
});

test("MATH release changes only MATH learner projection and binds the current draft revision", () => {
  const d = copy(), draft = d.grades.grade_drafts.find((x) => x.id === "aisha-math-assignment");
  const r = d.grades.results.find((x) => x.id === "aisha-math-assignment");
  r.released = { status: "scored", score: 8 }; r.pending = null;
  draft.release_state = "released";
  d.grades.releases.push({ id: "rel-math-assignment-test", course_id: MATH, item_id: "math-assignment", version: 1, released_at: "2026-10-20T09:00:00-04:00", actor_id: "reyes", entries: [{ person_id: "aisha", status: "scored", score: 8, draft_revision: draft.revision, comment: draft.overall_comment }] });
  const v = view(d), math = who("instructor", MATH);
  assert.equal(S.resultFor(v, "aisha", "math-assignment", who("student", MATH)).score, 8);
  assert.equal(S.courseTotal(v, MATH, "aisha", who("student", MATH)).display, "80.00%");
  assert.equal(S.releasePreview(v, MATH, "aisha", "math-assignment", math).fingerprint, null);
  assert.ok(!S.releaseReady(v, "math-assignment", math).some((x) => x.personId === "aisha"));
  assert.equal(S.releasePreview(v, PHYS, "aisha", "ps4", who("instructor")).fingerprint, "fp-dd91aa69");
  assert.equal(S.releasesFor(v, "math-assignment", math).length, 1);
  assert.ok(S.releasesFor(v, "ps4", who("instructor")).every((x) => x.course_id === PHYS));
});

test("teaching drill-down scopes learner, course, attempts and manual/no-grade rows", () => {
  const v = base(), math = who("instructor", MATH);
  assert.deepEqual(plain(S.teachingLearners(v, math).map((p) => p.id)), ["aisha", "ben"]);
  assert.equal(S.teachingStudent(v, math, "carmen"), null);
  assert.equal(S.teachingStudent(v, who("student", MATH), "aisha"), null);
  const student = S.teachingStudent(v, math, "aisha");
  assert.ok(student.items.every((x) => x.assessment.course_id === MATH));
  const assignment = student.items.find((x) => x.assessment.id === "math-assignment");
  assert.deepEqual(plain(assignment.receipts.map((r) => r.attempt)), [1, 2]);
  assert.equal(assignment.draft.receipt_id, "AH-MATH220-001");
  const practice = student.items.find((x) => x.assessment.id === "math-practice");
  assert.equal(practice.result, null); assert.equal(practice.draft, null); assert.equal(practice.release, null);
  const ben = S.teachingStudent(v, math, "ben").items.find((x) => x.assessment.id === "math-assignment");
  assert.equal(ben.receipts.length, 0); assert.equal(ben.draft, null); assert.equal(ben.result.staffOutcome.score, 6);
});

test("partial TA drill-down contains only allocated learner/question marks, comments and tags", () => {
  const d = copy(), t = d.staff.grading_tasks.find((x) => x.id === "task-maya-ps4");
  t.learner_ids = ["aisha"]; t.question_ids = ["1a"];
  const v = view(d), ta = who("ta");
  assert.deepEqual(plain(S.teachingLearners(v, ta).map((p) => p.id)), ["aisha"]);
  assert.equal(S.teachingStudent(v, ta, "ben"), null);
  const p = S.teachingStudent(v, ta, "aisha");
  assert.equal(p.items.length, 1);
  const it = p.items[0]; assert.equal(it.assessment.id, "ps4");
  assert.deepEqual(plain(it.assessment.questions.map((q) => q.id)), ["1a"]);
  assert.deepEqual(plain(Object.keys(it.draft.marks)), ["1a"]);
  assert.equal(it.draft.overall_comment, null); assert.equal(it.result.score, null); assert.equal(it.result.staffOutcome.score, null); assert.equal(it.release, null);
  assert.ok(it.receipts.every((r) => r.page_tags.every((tag) => tag.questions.every((q) => q === "1a"))));
  assert.equal(p.gradebookRow.total, null);
  assert.deepEqual(plain(S.teachingTaskQuestions(v, ta, t).map((q) => q.id)), ["1a"]);
  assert.deepEqual(plain(S.teachingCoverage(v, ta)), []);
  const expired = S.buildView(d, "ta_expired");
  assert.deepEqual(plain(S.teachingLearners(expired, ta)), []);
  assert.equal(S.teachingStudent(expired, ta, "aisha"), null);
  assert.deepEqual(plain(S.teachingTaskQuestions(expired, ta, t)), []);
  assert.equal(S.teachingTaskQuestions(expired, who("instructor"), t).length, 1);
});

test("teaching team and coverage use canonical course tasks and exclude ended allocations", () => {
  const v = base(), instructor = who("instructor");
  const team = S.teachingTeam(v, instructor);
  assert.deepEqual(plain(team.members.map((m) => m.person.id)), ["maya"]);
  assert.equal(team.members[0].tasks[0].id, "task-maya-ps4");
  assert.equal(S.teachingTeam(v, who("student")), null);
  assert.equal(S.teachingTeam(v, who("instructor", MATH)).members.length, 0);
  const ps4 = S.teachingCoverage(v, instructor).find((x) => x.assessment.id === "ps4");
  assert.deepEqual(plain(ps4.uncoveredLearners.map((p) => p.id)), ["carmen"]);
  assert.equal(ps4.uncoveredQuestions.length, 0);
  const expired = S.teachingCoverage(S.scenarioView("ta_expired"), instructor).find((x) => x.assessment.id === "ps4");
  assert.equal(expired.uncoveredLearners.length, 3); assert.equal(expired.uncoveredQuestions.length, 5);
  assert.deepEqual(plain(S.teachingTaskQuestions(v, instructor, { id: "missing", course_id: PHYS, question_ids: ["*"] })), []);
});

test("coverage reports missing learner-question pairs even when both independent unions are complete", () => {
  const d = copy(), first = d.staff.grading_tasks.find((t) => t.id === "task-maya-ps4");
  d.world.enrollments.find((e) => e.id === "carmen").course_ids = [];
  first.learner_ids = ["aisha"]; first.question_ids = ["1a"];
  d.staff.grading_tasks.push({ ...first, id: "task-reyes-split-test", ta_id: "reyes", learner_ids: ["ben"], question_ids: ["1b", "2", "3", "4"] });
  d.world.enrollments.push({ id: "reyes-ta-test", person_id: "reyes", role: "ta", course_ids: [PHYS] });
  const row = S.teachingCoverage(view(d), who("instructor")).find((x) => x.assessment.id === "ps4");
  assert.equal(row.uncoveredLearners.length, 0); assert.equal(row.uncoveredQuestions.length, 0);
  assert.deepEqual(plain(row.uncoveredPairs.map((p) => [p.person.id, p.questions.map((q) => q.id)])), [["aisha", ["1b", "2", "3", "4"]], ["ben", ["1a"]]]);
});

test("foreign task metadata and receipt bindings cannot authorize a grading projection", () => {
  const d = copy();
  d.staff.grading_tasks.find((t) => t.id === "task-maya-ps4").course_id = MATH;
  const v = view(d), ta = who("ta");
  assert.equal(S.resultFor(v, "aisha", "ps4", ta), null);
  assert.equal(S.gradeDraftFor(v, "aisha", "ps4", ta), null);
  assert.equal(S.draftTotal(v, "aisha", "ps4", ta), null);
  assert.equal(S.gradebook(v, PHYS, ta), null);
  const mixed = copy();
  mixed.grades.grade_drafts.find((r) => r.id === "aisha-math-assignment").receipt_id = "AH-PHYS110-001";
  assert.equal(S.releasePreview(view(mixed), MATH, "aisha", "math-assignment", who("instructor", MATH)).fingerprint, null);
});
