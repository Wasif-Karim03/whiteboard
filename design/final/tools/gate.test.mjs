// Phase 2 gate tests (M1–M10, R1–R9): viewer identity, fail-closed selectors, TA scope, release history,
// failure samples, result projections, anchors and Activity links. Modified data is always a JSON copy of
// WB.data resolved with buildView; the frozen data is never mutated. Source checks only, not browser acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import { loadAll } from "./load_data.mjs";
import { checkHtml } from "./html_check.mjs";
import * as F from "./check_fixtures.mjs";
import * as G from "./check_gate.mjs";
import * as V from "./check_vocab.mjs";
import { PHYS, REYES, MAYA, AISHA, BEN, CARMEN } from "./check_gate.mjs";

const WB = loadAll();
const S = WB.sel;
const K = WB.K;
const copy = (x) => JSON.parse(JSON.stringify(x));
const base = () => S.scenarioView("default");
const viewOf = (data, id = "default") => S.buildView(data, id);

// ---------- Step 1: viewer identity and course shell (M1) ----------

test("M1: viewerFor maps each role to its persona", () => {
  const v = base();
  assert.deepEqual({ ...S.viewerFor(v, "student") }, { role: "student", personId: "aisha", courseId: PHYS });
  assert.deepEqual({ ...S.viewerFor(v, "instructor") }, { role: "instructor", personId: "reyes", courseId: PHYS });
  assert.deepEqual({ ...S.viewerFor(v, "ta") }, { role: "ta", personId: "maya", courseId: PHYS });
  const guest = { role: "guest", personId: null, courseId: null };
  assert.deepEqual({ ...S.viewerFor(v, "guest") }, guest);
  assert.deepEqual({ ...S.viewerFor(v, "constructor") }, guest);
  for (const role of ["student", "instructor", "ta", "guest"]) assert.ok(Object.isFrozen(S.viewerFor(v, role)), role);
  const data = copy(WB.data);
  data.world.personas.ta.person_id = "aisha";
  assert.deepEqual({ ...S.viewerFor(viewOf(data), "ta") }, guest);
});

test("M1: verifiedRole rejects a role the enrollment does not grant", () => {
  const v = base();
  const fake = { role: "instructor", personId: "maya" };
  assert.equal(S.verifiedRole(v, fake, PHYS), null);
  assert.equal(S.verifiedRole(v, REYES, PHYS), "instructor");
  assert.equal(S.verifiedRole(v, undefined, PHYS), null);
  assert.equal(S.verifiedRole(v, { role: "guest", personId: null }, PHYS), null);
  assert.equal(S.verifiedRole(v, AISHA, "nope"), null);
  assert.deepEqual([...S.receiptsFor(v, "ps4", fake)], []);
  assert.deepEqual([...S.receiptsFor(v, "ps4", REYES).map((r) => r.id)].sort(), ["AH-PHYS110-001", "AH-PHYS110-002"]);
});

test("M1: courseShell returns shell-ready tabs and tools", () => {
  const v = base();
  const student = S.courseShell(v, S.viewerFor(v, "student"), { page: "W18" });
  assert.equal(student.tabs.length, 8);
  assert.equal(student.tools.length, 0);
  assert.equal([...student.tabs, ...student.tools].filter((t) => t.current).length, 1);
  assert.equal(student.tabs.find((t) => t.current).id, "coursework");
  const bySection = S.courseShell(v, S.viewerFor(v, "student"), { section: "coursework" });
  assert.deepEqual([...bySection.tabs.filter((t) => t.current).map((t) => t.id)], ["coursework"]);
  const ta = S.courseShell(v, S.viewerFor(v, "ta"), { page: "W48" });
  for (const page of ["W42", "W59", "W60"]) assert.ok(!ta.tools.some((t) => t.go === page), page);
  assert.ok(ta.tools.length > 0);
  assert.equal(S.courseShell(v, S.viewerFor(v, "guest"), { page: "W18" }), null);
  assert.equal(S.courseShell(v, { role: "instructor", personId: "maya", courseId: PHYS }, {}), null);
  const hrefs = WB.manifest.navigation.hrefs;
  for (const c of WB.CONTEXTS) {
    const ctx = WB.ctx({ ...c, role: "ta" });
    const html = K.shell(ctx, { ns: "g", title: "Grading", body: "<p>Body</p>", hrefs, course: ta });
    assert.deepEqual(checkHtml(html), [], c.name);
  }
});

test("M1: fmtBytes gives one decimal for MB and whole KB", () => {
  assert.equal(S.fmtBytes(1843200), "1.8 MB");
  assert.equal(S.fmtBytes(245760), "240 KB");
  for (const bad of [-1, NaN, Infinity, "12"]) assert.throws(() => S.fmtBytes(bad), /fmtBytes/);
});

// ---------- Step 2: fail-closed selectors, TA scope and release authority (M2, M3, R1, R2) ----------

// A copy of WB.data whose single grading task is changed by `over`; extra tasks are appended.
const withTask = (over, extra = []) => {
  const data = copy(WB.data);
  data.staff.grading_tasks = [{ ...data.staff.grading_tasks[0], ...over }, ...extra];
  return data;
};
const fails = (errors, label) => assert.ok(errors.length > 0, `${label}: expected errors, got none`);
const passes = (errors, label) => assert.deepEqual([...errors], [], label);
const NOBODY = [["ben", BEN], ["no viewer", undefined], ["guest", { role: "guest", personId: null }], ["instructor maya", { role: "instructor", personId: "maya" }]];

test("M2: a TA and a student cannot preview or list a release", () => {
  passes(G.checkReleaseAuthority(WB), "real data");
  const granted = withTask({ release_permission: true });
  assert.throws(() => S.canRelease(viewOf(granted), MAYA, PHYS), /grants release permission/);
  fails(F.checkTaAccess(WB, granted), "checkTaAccess with release permission");
  passes(F.checkTaAccess(WB), "checkTaAccess real data");
});

test("M3: progress selectors fail closed", () => {
  const v = base();
  for (const [name, who] of NOBODY) {
    assert.equal(S.reviewProgress(v, "ps4", who), null, name);
    assert.equal(S.receivedProgress(v, "ps4", who), null, name);
  }
  assert.deepEqual({ ...S.reviewProgress(v, "ps4", REYES) }, { reviewed: 1, of: 2 });
  assert.deepEqual({ ...S.receivedProgress(v, "ps4", MAYA) }, { received: 2, of: 2 });
  assert.equal(S.reviewProgress(S.scenarioView("ta_expired"), "ps4", MAYA), null);
});

test("M3: grade selectors derive the audience from the viewer", () => {
  const v = base();
  assert.equal(S.courseTotal(v, PHYS, "aisha", AISHA).display, "84.50%");
  assert.equal(S.courseTotal(v, PHYS, "aisha", REYES).display, "85.17%");
  assert.equal(S.courseTotal(v, PHYS, "aisha", REYES, { as: "learner" }).display, "84.50%");
  assert.equal(S.courseTotal(v, PHYS, "aisha", BEN), null);
  assert.equal(S.courseTotal(v, PHYS, "aisha", MAYA), null);
  assert.equal(S.courseTotal(v, PHYS, "aisha", undefined), null);
  assert.equal(S.courseTotal(v, PHYS, "aisha", AISHA, { assumeReleased: ["ps4"], audience: "staff" }).display, "84.50%");
  assert.equal(S.categoryPercent(v, PHYS, "aisha", "labs", BEN), null);
  assert.equal(S.categoryPercent(v, PHYS, "aisha", "labs", MAYA), null);
  assert.equal(S.categoryPercent(v, PHYS, "aisha", "labs", AISHA), 90);
});

test("R2: draftTotal is question-scoped for a TA", () => {
  const v = base();
  const total = (view, who) => { const t = S.draftTotal(view, "aisha", "ps4", who); return t && `${t.score}/${t.max}`; };
  assert.equal(total(v, REYES), "27/30");
  assert.equal(total(v, MAYA), "27/30");
  assert.equal(total(viewOf(withTask({ question_ids: ["1a"] })), MAYA), "6/6");
  assert.equal(total(viewOf(withTask({ learner_ids: ["ben"] })), MAYA), null);
  assert.equal(total(S.scenarioView("ta_expired"), MAYA), null);
  assert.equal(total(v, AISHA), null);
  assert.equal(total(v, undefined), null);
});

test("R1: taScope", () => {
  const v = base();
  const real = S.taScope(v, "ps4", MAYA);
  assert.equal(real.allQuestions, true);
  assert.deepEqual([...real.learnerIds], ["aisha", "ben"]);
  assert.equal(S.taScope(viewOf(withTask({ question_ids: ["1a"] })), "ps4", MAYA).allQuestions, false);
  assert.equal(S.taScope(viewOf(withTask({ question_ids: ["*"] })), "ps4", MAYA).allQuestions, true);
  for (const [name, view, who] of [["reyes", v, REYES], ["aisha", v, AISHA], ["ta_expired", S.scenarioView("ta_expired"), MAYA]]) assert.equal(S.taScope(view, "ps4", who), null, name);
});

test("M3: eventsFor trusts the enrollment", () => {
  const v = base();
  const week = ["2026-10-19T00:00:00-04:00", "2026-10-26T00:00:00-04:00"];
  assert.deepEqual([...S.eventsFor(v, { role: "instructor", personId: "ben" }, ...week)], []);
  assert.deepEqual([...S.eventsFor(v, undefined, ...week)], []);
  const grading = (who) => S.eventsFor(v, who, ...week).some((e) => e.kind === "gradingTask");
  assert.equal(grading(BEN), false);
  assert.equal(grading(MAYA), true);
  assert.equal(grading(REYES), true);
});

// ---------- Step 3: reconstructed records, release history and failure samples (M5, R1, R3–R7, R9) ----------

const over = (dataset, collection, op, record) => ({ dataset, collection, id: record.id, op, record });
// A copy of WB.data with extra overrides appended to one scenario.
function withOverrides(scenario, list, edit) {
  const data = copy(WB.data);
  data.scenarios.overrides[scenario] = [...data.scenarios.overrides[scenario], ...list];
  if (edit) edit(data);
  return data;
}
const DRAFT = () => copy(WB.data.grades.grade_drafts[0]);
const result = (released, pending) => ({ id: "aisha-ps4", person_id: "aisha", item_id: "ps4", released, pending });
const scored = (score) => ({ status: "scored", score });
// R4/R9: Aisha released at 27, then a held revision 4 (question 2 raised to 6, total 28).
const REVISED = () => [
  over("grades", "grade_drafts", "replace", { ...DRAFT(), revision: 4, marks: { ...DRAFT().marks, 2: 6 }, release_state: "held" }),
  over("grades", "results", "replace", result(scored(27), scored(28))),
];
// R5: the revision released as version 2.
const RERELEASE = (version = 2, marks = { ...DRAFT().marks, 2: 6 }) => [
  over("grades", "releases", "add", {
    id: "rel-ps4-2", course_id: PHYS, item_id: "ps4", version, released_at: "2026-10-27T15:00:00-04:00", actor_id: "reyes",
    entries: [{ person_id: "aisha", status: "scored", score: 28, draft_revision: 4, marks, comment: "Corrected question 2." }],
  }),
  over("grades", "results", "replace", result(scored(28), null)),
  over("grades", "grade_drafts", "replace", { ...DRAFT(), revision: 4, marks: { ...DRAFT().marks, 2: 6 }, release_state: "released" }),
];
const rows = (list) => [...list].map((r) => ({ ...r }));

test("M5: ps4_released reaches the J03 ending", () => {
  passes(G.checkReleases(WB), "checkReleases");
  passes(G.checkImmutableOverrides(WB.data), "checkImmutableOverrides");
  passes(G.checkReleasedScenario(WB), "checkReleasedScenario");
  assert.equal(S.courseTotal(base(), PHYS, "aisha", AISHA).display, "84.50%");
  const bad = withOverrides("ps4_released", [over("grades", "releases", "replace", { ...copy(WB.data.grades.releases[0]), entries: [] })]);
  fails(G.checkImmutableOverrides(bad), "replace of grades.releases");
  const gone = withOverrides("group_submission", [{ dataset: "coursework", collection: "receipts", id: "AH-PHYS110-001", op: "remove" }]);
  fails(G.checkImmutableOverrides(gone), "remove of coursework.receipts");
});

test("R4: a released learner is a candidate again only after a new held revision", () => {
  assert.deepEqual(rows(S.releaseReady(base(), "ps4", REYES)), [
    { personId: "aisha", included: true, reason: "ready", revised: false },
    { personId: "ben", included: false, reason: "notReady", revised: false },
  ]);
  const data = withOverrides("ps4_released", REVISED());
  const v = viewOf(data, "ps4_released");
  assert.deepEqual(rows(S.releaseReady(v, "ps4", REYES)), [
    { personId: "aisha", included: true, reason: "ready", revised: true },
    { personId: "ben", included: false, reason: "notReady", revised: false },
  ]);
  // R9: one held payload feeds the preview arithmetic and the staff total.
  const preview = S.releasePreview(v, PHYS, "aisha", "ps4", REYES);
  assert.deepEqual([preview.before, preview.after], ["85.17%", "85.61%"]);
  assert.equal(S.courseTotal(v, PHYS, "aisha", REYES).display, "85.61%");
  passes(G.checkHeldPayloadSync(WB, data), "checkHeldPayloadSync in sync");
  const stale = withOverrides("ps4_released", [REVISED()[0], over("grades", "results", "replace", result(scored(27), null))]);
  fails(G.checkHeldPayloadSync(WB, stale), "pending left null");
});

test("R5: a corrected re-release keeps history", () => {
  const data = withOverrides("ps4_released", RERELEASE());
  const v = viewOf(data, "ps4_released");
  passes(G.checkReleases(WB, data), "checkReleases re-release");
  passes(G.checkHeldPayloadSync(WB, data), "checkHeldPayloadSync re-release");
  assert.equal(S.courseTotal(v, PHYS, "aisha", AISHA).display, "85.61%");
  assert.deepEqual(rows(S.releaseReady(v, "ps4", REYES)), [{ personId: "ben", included: false, reason: "notReady", revised: false }]);
  const [snap, , draft] = RERELEASE();
  fails(G.checkReleases(WB, withOverrides("ps4_released", [snap, draft])), "result left at 27");
  fails(G.checkReleases(WB, withOverrides("ps4_released", RERELEASE(3))), "version gap");
  fails(G.checkReleases(WB, withOverrides("ps4_released", RERELEASE(2, { ...DRAFT().marks }))), "marks do not sum to the score");
});

test("R6: the fingerprint follows every preview input", () => {
  const fp = (data) => S.releasePreview(data ? viewOf(data) : base(), PHYS, "aisha", "ps4", REYES).fingerprint;
  const real = fp();
  assert.match(real, /^fp-[0-9a-f]{8}$/);
  assert.equal(fp(), real);
  assert.deepEqual({ ...S.releasePreview(base(), PHYS, "aisha", "ps4", REYES).inputs.policy }, { id: "phys110-policy", version: 1 });
  const edits = {
    "policy version": (d) => { d.grades.policy.version = 2; },
    "a mark": (d) => { d.grades.grade_drafts[0].marks["3"] = 8; d.grades.results.find((r) => r.id === "aisha-ps4").pending.score = 28; },
    "a draft comment": (d) => { d.grades.grade_drafts[0].comments["4"] = "Add units."; },
    "rubric version": (d) => { d.grades.grade_drafts[0].rubric_version = 3; },
    "receipt attempt": (d) => { d.coursework.receipts.find((r) => r.id === "AH-PHYS110-001").attempt = 2; },
    "another snapshot": (d) => { d.grades.releases.push({ ...copy(d.grades.releases[0]), id: "rel-ps1-2", version: 2, released_at: "2026-10-01T09:00:00-04:00" }); },
  };
  for (const [name, edit] of Object.entries(edits)) {
    const data = copy(WB.data);
    edit(data);
    assert.notEqual(fp(data), real, name);
  }
  const mark = copy(WB.data);
  edits["a mark"](mark);
  passes(G.checkHeldPayloadSync(WB, mark), "mark change kept in sync");
  assert.notEqual(S.releasePreview(viewOf(mark), PHYS, "aisha", "ps4", REYES).after, "85.17%");
  const ben = copy(WB.data);
  ben.coursework.receipts.find((r) => r.id === "AH-PHYS110-002").attempt = 2;
  ben.grades.results.find((r) => r.id === "ben-ps1").released.score = 21;
  assert.equal(fp(ben), real, "Ben's data only");
});

test("M5: draft payload exists only before the hand-in", () => {
  const hand = S.scenarioView("assignment_submission");
  const d = S.draftFor(hand, "ps4", AISHA);
  assert.equal(d.files.length, 1);
  assert.equal(d.files[0].pages, 4);
  assert.equal(d.page_tags.length, 4);
  assert.equal(S.draftFor(hand, "ps4", REYES), null);
  assert.equal(S.draftFor(hand, "ps4", MAYA), null);
  assert.equal(S.draftFor(base(), "ps4", AISHA), null);
  assert.equal(S.fmtBytes(1843200), "1.8 MB");
});

test("R3: the group draft", () => {
  for (const id of ["default", "group_work_in_progress"]) {
    const v = S.scenarioView(id);
    assert.equal(S.draftFor(v, "motion", AISHA)?.id, "team-orbit-motion-draft", `${id} aisha`);
    assert.equal(S.draftFor(v, "motion", BEN)?.id, "team-orbit-motion-draft", `${id} ben`);
    assert.equal(S.draftFor(v, "motion", CARMEN), null, `${id} carmen`);
    assert.equal(S.draftFor(v, "motion", REYES), null, `${id} reyes`);
  }
  for (const id of ["group_submission", "ps4_released"]) assert.equal(S.draftFor(S.scenarioView(id), "motion", AISHA), null, id);
});

test("M5/R1: failure samples resolve against the clock and the viewer", () => {
  const active = Object.keys(WB.data.scenarios.clocks).filter((id) => S.taScope(S.scenarioView(id), "ps4", MAYA));
  assert.ok(active.length > 0);
  for (const id of active) {
    const v = S.scenarioView(id);
    const s = S.failureSample(v, "score-conflict", MAYA);
    assert.ok(S.isBefore(s.mine.savedAt, s.theirs.savedAt), `${id} order`);
    assert.ok(S.isBefore(s.theirs.savedAt, v.clock), `${id} before clock`);
    assert.ok(Object.isFrozen(s), `${id} frozen`);
  }
  assert.equal(S.failureSample(base(), "score-conflict", AISHA), null);
  assert.equal(S.failureSample(S.scenarioView("ta_expired"), "score-conflict", MAYA), null);
  assert.equal(S.failureSample(viewOf(withTask({ learner_ids: ["ben"] })), "score-conflict", MAYA), null);
  assert.equal(S.failureSample(viewOf(withTask({ question_ids: ["1a", "1b", "3", "4"] })), "score-conflict", MAYA), null);
  assert.equal(S.failureSample(base(), "release-preview-stale", MAYA), null);
  assert.ok(S.failureSample(base(), "release-preview-stale", REYES));
  assert.equal(S.failureSample(base(), "upload-interrupted", MAYA), null);
  assert.ok(S.failureSample(base(), "upload-interrupted", AISHA));
  assert.equal(S.failureSample(base(), "no-such-failure", REYES), null);
  const failures = WB.data.scenarios.failures.map((f) => f.id);
  for (const s of WB.data.samples.failures) assert.ok(failures.includes(s.id), s.id);
});

test("M5: W14, W19 and W51 data", () => {
  assert.equal(S.currentModule(base(), PHYS).id, "kinematics");
  assert.equal(S.currentModule(S.scenarioView("ps4_released"), PHYS).id, "forces");
  assert.equal(S.nextDue(base(), PHYS, AISHA).assessmentId, "quiz3");
  assert.equal(S.nextDue(S.scenarioView("assignment_submission"), PHYS, AISHA).assessmentId, "ps4");
  assert.equal(S.nextDue(base(), PHYS, REYES), null);
  assert.equal(S.courseTotal(base(), PHYS, "ben", BEN).display, "78.19%");
  assert.equal(S.courseTotal(base(), PHYS, "carmen", CARMEN).display, "65.97%");
  assert.equal(S.courseTotal(base(), PHYS, "carmen", REYES).display, "59.42%");
});

test("R7 data: the Quiz 2 receipt", () => {
  assert.deepEqual([...S.receiptsFor(base(), "quiz2", AISHA)].map((r) => r.id), ["AH-PHYS110-Q2-001"]);
  passes(F.checkAttempts(WB), "checkAttempts");
  passes(F.checkAllTemporal(WB), "checkAllTemporal");
});

// ---------- Step 4: result, draft and gradebook projections (M4, R2, R8) ----------

const plain = (x) => JSON.parse(JSON.stringify(x));

test("M4: a learner result never carries a held value", () => {
  const v = base();
  const own = S.resultFor(v, "aisha", "ps4", AISHA);
  assert.equal(own.status, null);
  assert.equal("pending" in own, false);
  assert.equal("staffOutcome" in own, false);
  assert.equal("scoreWithheld" in own, false);
  assert.equal(S.resultFor(v, "aisha", "ps4", REYES).staffOutcome.score, 27);
  assert.equal(S.resultFor(v, "aisha", "ps4", MAYA).staffOutcome.score, 27);
  assert.equal("pending" in S.resultFor(v, "aisha", "ps4", REYES), false);
  const reyesRow = S.gradeRows(v, PHYS, "aisha", REYES).find((r) => r.itemId === "ps4");
  assert.deepEqual({ ...reyesRow.staffOutcome }, { status: "scored", score: 27 });
  assert.equal("pending" in reyesRow, false);
  assert.equal(S.resultFor(S.scenarioView("ta_expired"), "aisha", "ps4", MAYA), null);
  assert.equal(S.resultFor(v, "aisha", "ps4", BEN), null);
  const rel = S.scenarioView("ps4_released");
  const after = S.resultFor(rel, "aisha", "ps4", AISHA);
  assert.equal(after.score, 27);
  assert.equal(after.releasedAt, rel.data.grades.releases.find((r) => r.id === "rel-ps4-1").released_at);
  assert.equal(Object.keys(after.questionComments).length, 3);
  const data = withOverrides("ps4_released", RERELEASE());
  const re = viewOf(data, "ps4_released");
  const fixed = S.resultFor(re, "aisha", "ps4", AISHA);
  assert.equal(fixed.score, 28);
  assert.equal(fixed.releasedAt, "2026-10-27T15:00:00-04:00");
  assert.deepEqual([...S.releasesFor(re, "ps4", AISHA)].map((r) => r.version), [1, 2]);
});

test("R2: a TA limited to question 1a", () => {
  const v = viewOf(withTask({ question_ids: ["1a"] }));
  const draft = S.gradeDraftFor(v, "aisha", "ps4", MAYA);
  assert.deepEqual(Object.keys(draft.marks), ["1a"]);
  assert.deepEqual({ ...draft.comments }, {});
  assert.deepEqual([...draft.reviewed_questions], ["1a"]);
  assert.equal(draft.overall_comment, null);
  assert.equal(`${draft.total.score}/${draft.total.max}`, "6/6");
  assert.equal(draft.partial, true);
  const res = S.resultFor(v, "aisha", "ps4", MAYA);
  assert.equal(res.staffOutcome.score, null);
  assert.equal(res.scoreWithheld, true);
  assert.equal(res.comment, null);
  const book = S.gradebook(v, PHYS, MAYA);
  const cell = book.rows.find((r) => r.personId === "aisha").cells.ps4;
  assert.equal(cell.score, null);
  assert.equal(cell.scoreWithheld, true);
  const row = S.gradeRows(v, PHYS, "aisha", MAYA).find((r) => r.itemId === "ps4");
  assert.equal(row.scoreWithheld, true);
  for (const [name, x] of [["draft", draft], ["result", res], ["gradebook", book], ["rows", S.gradeRows(v, PHYS, "aisha", MAYA)]]) {
    const text = JSON.stringify(x);
    for (const leak of ['"1b":4', '"2":5', '"3":7', '"4":5']) assert.equal(text.includes(leak), false, `${name} ${leak}`);
    assert.equal(/\b27\b/.test(text), false, `${name} 27`);
  }
  assert.equal(S.resultFor(v, "aisha", "ps4", REYES).staffOutcome.score, 27);
  assert.deepEqual(Object.keys(S.gradeDraftFor(v, "aisha", "ps4", REYES).marks).sort(), ["1a", "1b", "2", "3", "4"]);
});

test("R8: a TA limited to q2-1 sees no whole Quiz 2 score", () => {
  const task = WB.data.staff.grading_tasks[0];
  const data = withTask({}, [{ ...copy(task), id: "maya-quiz2", assessment_id: "quiz2", learner_ids: ["aisha"], question_ids: ["q2-1"], release_permission: false }]);
  const v = viewOf(data);
  assert.equal(S.taScope(v, "quiz2", MAYA).allQuestions, false);
  const res = S.resultFor(v, "aisha", "quiz2", MAYA);
  const row = S.gradeRows(v, PHYS, "aisha", MAYA).find((r) => r.itemId === "quiz2");
  const cell = S.gradebook(v, PHYS, MAYA).rows.find((r) => r.personId === "aisha").cells.quiz2;
  for (const [name, x] of [["result", res], ["row", row], ["cell", cell]]) {
    assert.equal(x.score, null, name);
    assert.equal(x.scoreWithheld, true, name);
    assert.equal(/"score":8\b/.test(JSON.stringify(x)), false, name);
  }
  assert.equal(S.resultFor(v, "aisha", "quiz2", REYES).score, 8);
});

test("M4: gradebook and draft scope", () => {
  const v = base();
  const book = S.gradebook(v, PHYS, REYES);
  assert.equal(book.rows.length, 3);
  assert.equal(book.items.length, 6);
  for (const r of book.rows) assert.equal(Object.keys(r.cells).length, 6, r.personId);
  const totals = Object.fromEntries(book.rows.map((r) => [r.personId, [r.total, r.releasedTotal]]));
  assert.deepEqual(totals.aisha, ["85.17%", "84.50%"]);
  assert.deepEqual(totals.ben, ["78.19%", "78.19%"]);
  assert.deepEqual(totals.carmen, ["59.42%", "65.97%"]);
  const ta = S.gradebook(v, PHYS, MAYA);
  assert.deepEqual([...ta.items].map((i) => i.id), ["ps4"]);
  assert.deepEqual([...ta.rows].map((r) => r.personId), ["aisha", "ben"]);
  for (const r of ta.rows) assert.deepEqual([r.total, r.releasedTotal], [null, null]);
  assert.equal(ta.rows[0].cells.ps4.score, 27);
  assert.equal(S.gradebook(v, PHYS, AISHA), null);
  assert.equal(S.gradeDraftFor(v, "aisha", "ps4", AISHA), null);
  const draft = S.gradeDraftFor(v, "aisha", "ps4", REYES);
  assert.equal(`${draft.total.score}/${draft.total.max}`, "27/30");
  assert.equal(S.releasesFor(v, "ps1", MAYA), null);
  assert.equal(S.releasesFor(v, "ps1", REYES).length, 1);
  assert.equal(S.lastReleaseAt(v, PHYS, AISHA), "2026-10-14T09:30:00-04:00");
  assert.equal(S.lastReleaseAt(v, PHYS, MAYA), null);
});

test("M4: page files may not read grade internals", () => {
  passes(V.checkPageDataAccess(V.sourceFiles()), "real page files");
  for (const text of ["x.pending", "d.grade_drafts", "view.data.grades.results", "t.question_ids"]) {
    fails(V.checkPageDataAccess([{ path: "design/final/pages/W99.js", text }]), text);
  }
  passes(V.checkPageDataAccess([{ path: "design/final/fixtures/x.js", text: "x.pending" }]), "fixtures are not pages");
});

test("REV-06: a staff page may read staffOutcome from the scoped projections", () => {
  const page = (text) => [{ path: "design/final/pages/W99.js", text }];
  passes(V.checkPageDataAccess(page("var o = sel.resultFor(view, p, item, who).staffOutcome;")), "resultFor staffOutcome");
  passes(V.checkPageDataAccess(page("rows.map(function (row) { return row.staffOutcome; });")), "row.staffOutcome");
  fails(V.checkPageDataAccess(page("var held = r.pending;")), "r.pending");
  fails(V.checkPageDataAccess(page("var g = a.view.data.grades;")), "a.view.data.grades");
});

// ---------- Step 6: anchors, journeys and Activity links (M7, R3, R7) ----------

test("R3: the J07 record sequence resolves", () => {
  passes(G.checkAnchorRecords(WB), "checkAnchorRecords");
  passes(G.checkJourneyRecords(WB), "checkJourneyRecords");
  const j07 = WB.manifest.journeys.find((j) => j.id === "J07");
  const stepView = (k) => S.scenarioView(j07.steps[k - 1].scenario);
  for (const k of [6, 7]) assert.equal(S.draftFor(stepView(k), "motion", AISHA)?.id, "team-orbit-motion-draft", `step ${k}`);
  assert.deepEqual([...S.receiptsFor(stepView(8), "motion", AISHA)].map((r) => r.id), ["AH-PHYS110-GROUP-001"]);
  assert.deepEqual([...S.receiptsFor(stepView(9), "motion", REYES)].map((r) => r.id), ["AH-PHYS110-GROUP-001"]);
  assert.equal(S.draftFor(stepView(8), "motion", AISHA), null);
  const journeys = copy(WB.manifest.journeys).map((j) => (j.id === "J07" ? { ...j, steps: j.steps.map((s) => (s.page === "W22" ? { ...s, scenario: "default" } : s)) } : j));
  fails(G.checkJourneyRecords(WB, journeys), "J07 W22 at default");
});

test("R7: every Activity destination resolves", () => {
  passes(G.checkActivityLinks(WB), "real Activity links");
  const withGo = (id, go) => { const d = copy(WB.data); d.activity.items.find((x) => x.id === id).go = go; return d; };
  fails(G.checkActivityLinks(WB, withGo("act-quiz2-feedback", "W27")), "quiz2 feedback at W27");
  fails(G.checkActivityLinks(WB, withGo("act-office-hours-updated", "W29")), "office hours at W29");
  fails(G.checkActivityLinks(WB, withGo("act-quiz2-feedback", "W27:nope")), "unknown variant");
  assert.equal(WB.data.activity.items.find((x) => x.id === "act-ps4-received").go, "W48");
  assert.deepEqual({ ...S.anchorFor("W48").record }, { type: "assessment", id: "ps4" });
  assert.equal(S.anchorFor("W48", "nope"), null);
  assert.equal(S.anchorFor("W99"), null);
});

// ---------- Fix round 1: inspection findings REV-01 to REV-05 ----------

test("REV-01: a release preview or candidate list never crosses courses", () => {
  const MATH = "math220-f26";
  assert.equal(S.releasePreview(base(), MATH, "aisha", "ps4", REYES), null, "Reyes in MATH asking for a PHYS item");
  const mathOnly = copy(WB.data);
  mathOnly.world.enrollments.find((e) => e.id === "reyes").course_ids = [MATH];
  const mv = viewOf(mathOnly);
  assert.equal(S.releasePreview(mv, MATH, "aisha", "ps4", REYES), null, "MATH-only instructor, MATH course");
  assert.equal(S.releasePreview(mv, PHYS, "aisha", "ps4", REYES), null, "MATH-only instructor, PHYS course");
  assert.equal(S.releaseReady(mv, "ps4", REYES), null, "MATH-only instructor candidates");
  const moved = copy(WB.data);
  moved.coursework.assessments.find((a) => a.id === "ps4").course_id = MATH;
  const xv = viewOf(moved);
  assert.equal(S.releasePreview(xv, PHYS, "aisha", "ps4", REYES), null, "assessment in MATH, requested PHYS");
  assert.equal(S.releasePreview(xv, MATH, "aisha", "ps4", REYES), null, "assessment in MATH, policy in PHYS");
  assert.equal(S.releaseReady(xv, "ps4", REYES), null, "candidates for an item outside the policy course");
  assert.notEqual(S.releasePreview(base(), PHYS, "aisha", "ps4", REYES).fingerprint, null, "matching course still previews");
});

// Default data with Aisha's PS4 draft and review record edited.
const withReview = (draftOver, reviewed) => {
  const data = copy(WB.data);
  data.grades.grade_drafts = data.grades.grade_drafts.map((d) => d.id === "aisha-ps4" ? { ...d, ...draftOver } : d);
  data.staff.reviews = data.staff.reviews.map((r) => (r.id === "aisha-ps4" ? { ...r, reviewed } : r));
  return data;
};

test("REV-03: release candidates follow the current draft revision, not the review row", () => {
  const reopened = withReview({ review_complete: false, revision: 4 }, true);
  assert.deepEqual(rows(S.releaseReady(viewOf(reopened), "ps4", REYES)), [
    { personId: "aisha", included: false, reason: "notReady", revised: false },
    { personId: "ben", included: false, reason: "notReady", revised: false },
  ]);
  const stale = withReview({}, false);
  assert.deepEqual(rows(S.releaseReady(viewOf(stale), "ps4", REYES)), [
    { personId: "aisha", included: true, reason: "ready", revised: false },
    { personId: "ben", included: false, reason: "notReady", revised: false },
  ]);
  passes(G.checkReviewDraftAgreement(WB), "real data agrees");
  fails(G.checkReviewDraftAgreement(WB, reopened), "reopened draft, review row true");
  fails(G.checkReviewDraftAgreement(WB, stale), "completed draft, review row false");
});

test("REV-04: a held draft with no result is reported", () => {
  passes(G.checkHeldPayloadSync(WB), "real data");
  const missing = copy(WB.data);
  missing.grades.grade_drafts = [...missing.grades.grade_drafts, { ...DRAFT(), id: "ben-ps4", person_id: "ben", receipt_id: "AH-PHYS110-002" }];
  const errors = G.checkHeldPayloadSync(WB, missing);
  assert.ok(errors.some((e) => /held draft ben-ps4 has 0 results/.test(e)), "completed held Ben draft with no result");
  const twice = copy(WB.data);
  twice.grades.results = [...twice.grades.results, { ...copy(twice.grades.results.find((r) => r.id === "aisha-ps4")) }];
  fails(G.checkHeldPayloadSync(WB, twice), "aisha-ps4 result duplicated");
});

test("REV-05: a partial TA's review progress matches gradeDraftFor.review_complete", () => {
  const data = withReview({ reviewed_questions: ["1a"], review_complete: false }, false);
  data.staff.grading_tasks = [{ ...data.staff.grading_tasks[0], question_ids: ["1a"] }];
  const v = viewOf(data);
  assert.equal(S.gradeDraftFor(v, "aisha", "ps4", MAYA).review_complete, true);
  assert.deepEqual({ ...S.reviewProgress(v, "ps4", MAYA) }, { reviewed: 1, of: 2 });
  assert.deepEqual({ ...S.reviewProgress(v, "ps4", REYES) }, { reviewed: 0, of: 2 }, "the instructor keeps whole-assessment completion");
  const other = copy(data);
  other.grades.grade_drafts[0].reviewed_questions = ["1b"];
  const ov = viewOf(other);
  assert.equal(S.gradeDraftFor(ov, "aisha", "ps4", MAYA).review_complete, false);
  assert.deepEqual({ ...S.reviewProgress(ov, "ps4", MAYA) }, { reviewed: 0, of: 2 });
  assert.deepEqual({ ...S.reviewProgress(base(), "ps4", MAYA) }, { reviewed: 1, of: 2 }, "full-scope TA unchanged");
});

test("REV-02: the instructor iPhone section menu holds the last staff tool", () => {
  const v = base();
  const course = S.courseShell(v, S.viewerFor(v, "instructor"), { page: "W52" });
  const last = course.tools.at(-1);
  const html = K.shell(WB.ctx({ ...WB.CONTEXTS.find((c) => c.platform === "iphone"), role: "instructor" }), { ns: "r2", title: "Gradebook", body: "<p>Body</p>", hrefs: WB.manifest.navigation.hrefs, course });
  const start = html.indexOf('id="r2-sections"');
  assert.ok(start >= 0, "menu rendered");
  const menu = html.slice(start, html.indexOf("wb-navbar__trail"));
  assert.ok(menu.includes(`data-go="${last.go}"`), `last tool ${last.go} in the menu`);
  assert.deepEqual(checkHtml(html), []);
});
