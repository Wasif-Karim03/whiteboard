// Tests for Phase 2b: design/final/manifest/ and design/final/fixtures/ with check_fixtures, check_manifest and
// check_vocab. Every rule runs on the real data (expects no errors) and on modified copies built by cloning,
// never by mutating the frozen data. Source checks only, not browser acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadKit, KIT_FILES } from "./load_kit.mjs";
import { loadAll, DATA_FILES, DATA_DIR, dataPath } from "./load_data.mjs";
import * as F from "./check_fixtures.mjs";
import * as M from "./check_manifest.mjs";
import * as V from "./check_vocab.mjs";
import { SEGMENTS, STAGES, JOURNEY_PAGES } from "./page_meta.mjs";
import { REYES, AISHA } from "./check_gate.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WB = loadAll();
const S = WB.sel;
const PHYS = "phys110-f26";
const SRC = M.loadSources();
const copy = (x) => JSON.parse(JSON.stringify(x));
const base = () => S.scenarioView("default");
const viewOf = (data, id = "default", opts) => S.buildView(data, id, opts);
const fails = (errors, label) => assert.ok(errors.length > 0, `${label}: expected errors, got none`);
const passes = (errors, label) => assert.deepEqual([...errors], [], label);

// ---------- Real data passes every rule ----------

test("loadAll appends DATA_FILES after the unchanged kit and every data file exists", () => {
  assert.equal(KIT_FILES.length, 9);
  assert.equal(DATA_FILES.at(-1), "manifest/finalize.js");
  assert.ok(DATA_FILES.indexOf("fixtures/scenarios.js") < DATA_FILES.indexOf("fixtures/teaching.js"));
  assert.equal(DATA_FILES.at(-2), "fixtures/teaching-selection.js");
  for (const f of DATA_FILES) assert.ok(fs.existsSync(dataPath(f)), f);
});

test("check_fixtures passes on the real data", () => passes(F.checkAll(WB), "check_fixtures"));
test("check_manifest passes on the real data", () => passes(M.checkAll(WB, SRC), "check_manifest"));
test("check_vocab passes on the real data", () => passes(V.checkAll(WB), "check_vocab"));

test("golden values come from records: 84.50% learner, 85.17% staff and after release (BD18)", () => {
  const v = base();
  assert.equal(S.courseTotal(v, PHYS, "aisha", AISHA).display, "84.50%");
  assert.equal(S.courseTotal(v, PHYS, "aisha", REYES).display, "85.17%");
  const preview = S.releasePreview(v, PHYS, "aisha", "ps4", REYES);
  assert.deepEqual([preview.before, preview.after], ["84.50%", "85.17%"]);
  for (const n of [v.data.grades.golden.learner_released, v.data.grades.golden.staff_draft]) assert.equal(typeof n, "number");
  const src = fs.readdirSync(path.join(DATA_DIR, "fixtures")).concat(fs.readdirSync(path.join(DATA_DIR, "manifest")).map((f) => `../manifest/${f}`))
    .filter((f) => f.endsWith(".js")).map((f) => fs.readFileSync(path.join(DATA_DIR, "fixtures", f), "utf8")).join("\n");
  for (const banned of ["84.50%", "85.17%", "11:29", "Oct 25"]) assert.ok(!src.includes(banned), `source contains ${banned}`);
});

test("dates format from ISO records: clock, quiz threshold and TA access end", () => {
  const v = base();
  assert.equal(S.fmtDate(v.clock), "Tue Oct 20");
  assert.equal(S.fmtTime(v.clock), "4:00 PM");
  assert.equal(S.zoneAbbr(v.clock), "EDT");
  const t = S.lateStartThreshold(v, "quiz3", "aisha");
  assert.equal(S.fmtTime(t), "11:29 PM");
  assert.equal(S.weekday(t, "short"), "Thu");
  const end = S.accessEnd(v, "maya", PHYS);
  assert.deepEqual([S.fmtShortDate(end), S.fmtTime(end), S.weekday(end, "short")], ["Oct 25", "11:59 PM", "Sun"]);
  assert.equal(S.fmtDateTime(v.data.quiz.quizzes.find((q) => q.id === "quiz3").close), "Thu Oct 22, 11:59 PM");
});

// ---------- Required negatives (plan Step 10) ----------

test("1. a clock with offset -05:00 in October fails checkOffsets", () => {
  fails(F.checkOffsets(["2026-10-20T16:00:00-05:00"]), "October EST");
  fails(F.checkOffsets(["2026-10-20 16:00"]), "no offset");
  passes(F.checkOffsets(["2026-12-01T09:00:00-05:00", "2026-03-08T03:00:00-04:00"]), "EST in December, EDT after the March change");
});

test("2. a record field 'Tue' or '84.50%' outside a free-text field fails checkNoBakedText", () => {
  fails(F.checkNoBakedText({ rows: [{ id: "a", when: "Tue" }] }, S), "weekday");
  fails(F.checkNoBakedText({ rows: [{ id: "a", total: "84.50%" }] }, S), "percent");
  fails(F.checkNoBakedText({ rows: [{ id: "a", count: "2 of 3" }] }, S), "N of M");
  fails(F.checkNoBakedText({ rows: [{ id: "a", until: "Oct 25" }] }, S), "month-day");
});

test("3. a free-text 'Wednesday' whose aboutAt is a Thursday fails; a record without aboutAt fails", () => {
  fails(F.checkNoBakedText({ a: [{ aboutAt: "2026-10-22T08:00:00-04:00", revisions: [{ title: "Quiz opens Wednesday" }] }] }, S), "wrong weekday");
  fails(F.checkNoBakedText({ a: [{ title: "Quiz opens Wednesday" }] }, S), "no aboutAt");
  passes(F.checkNoBakedText({ a: [{ aboutAt: "2026-10-21T08:00:00-04:00", revisions: [{ title: "Quiz opens Wednesday" }] }] }, S), "matching weekday");
});

test("4. an allowance of 0 extra minutes moves Aisha's threshold off the expected time", () => {
  const data = copy(WB.data);
  data.quiz.allowances[0].extra_minutes = 0;
  const v = viewOf(data);
  assert.notEqual(S.fmtTime(S.lateStartThreshold(v, "quiz3", "aisha")), "11:29 PM");
  fails(F.checkQuiz(WB, v), "allowance 0");
});

test("5. a missing meta.source fails checkFictional", () => {
  const data = copy(WB.data);
  delete data.coursework.meta.source;
  fails(F.checkFictional(WB, data), "meta.source");
});

test("6. a real-looking email fails checkFictional", () => {
  const data = copy(WB.data);
  data.world.people[0].email = "x@gmail.com";
  fails(F.checkFictional(WB, data), "gmail");
  const keyed = copy(WB.data);
  keyed.world.institution.api_key = "sample";
  fails(F.checkFictional(WB, keyed), "credential key");
});

test("7–9. 62 pages, a duplicate route and a changed W14 route fail checkPages", () => {
  const pages = copy(WB.manifest.pages);
  const run = (list) => M.checkPages(list, SRC.routeRows, SRC.boardIds, SRC.specIndex, WB);
  passes(run(pages), "real pages");
  fails(run(pages.slice(0, 62)), "62 pages");
  fails(run(pages.map((p) => (p.id === "W15" ? { ...p, route: "/courses/:courseId" } : p))), "duplicate route");
  fails(run(pages.map((p) => (p.id === "W14" ? { ...p, route: "/courses/:id" } : p))), "W14 route");
  fails(run(pages.map((p) => (p.id === "W14" ? { ...p, title: "Course page" } : p))), "W14 title");
});

test("checkMeta catches a wrong tier and segment", () => {
  const pages = copy(WB.manifest.pages);
  const trackerRows = SRC.trackerRows;
  passes(M.checkMeta(pages, SEGMENTS, STAGES, trackerRows), "real meta");
  fails(M.checkMeta(pages.map((p) => (p.id === "W42" ? { ...p, platforms: { ...p.platforms, iphone: "full" } } : p)), SEGMENTS, STAGES, trackerRows), "tier");
  fails(M.checkMeta(pages.map((p) => (p.id === "W14" ? { ...p, segment: 3 } : p)), SEGMENTS, STAGES, trackerRows), "segment");
});

test("10–11. a nav entry to W99 and a staff entry to W22 fail checkNavigation", () => {
  const nav = copy(WB.manifest.navigation);
  const run = (n) => M.checkNavigation(n, SRC.navDoc, WB.manifest.pagesById, WB);
  passes(run(nav), "real navigation");
  fails(run({ ...nav, extras: [...nav.extras, { id: "x", label: "X", page: "W99", roles: ["instructor"], source: "BD26" }] }), "W99");
  fails(run({ ...nav, extras: [...nav.extras, { id: "receipt", label: "Receipt", page: "W22", roles: ["instructor"], source: "BD26" }] }), "staff W22");
  fails(run({ ...nav, staffCourse: nav.staffCourse.map((e) => (e.id === "builder" ? { ...e, taMode: "full" } : e)) }), "taMode");
  fails(run({ ...nav, hrefs: { ...nav.hrefs, help: "javascript:alert(1)" } }), "unsafe href");
});

test("TA navigation drops no_access_default tools; instructors get the BD26 extras", () => {
  const ta = S.staffTools("ta").map((e) => e.page);
  for (const p of ["W42", "W59", "W60"]) assert.ok(!ta.includes(p), p);
  assert.ok(S.staffTools("instructor").some((e) => e.page === "W42"));
  assert.deepEqual(copy(S.courseNav("instructor").slice(-2).map((e) => e.id)), ["syllabus", "assessments"]);
  assert.ok(S.courseNav("ta").every((e) => typeof e.taMode === "string"));
  assert.equal(S.courseNav("guest").length, 0);
});

test("12. a journey step role not allowed on its page fails checkJourneys", () => {
  const journeys = copy(WB.manifest.journeys);
  const scenarios = Object.keys(WB.data.scenarios.clocks);
  const run = (j, spine = [...WB.manifest.spine]) => M.checkJourneys(j, spine, JOURNEY_PAGES, WB.manifest.pagesById, scenarios, WB.manifest.anchors);
  passes(run(journeys), "real journeys");
  const step = (page, edit) => journeys.map((j) => (j.id === "J02" ? { ...j, steps: j.steps.map((s) => (s.page === page ? { ...s, ...edit } : s)) } : j));
  fails(run(step("W20", { scenario: "nope" })), "step scenario nope");
  fails(run(step("W20", { token: "nope" })), "step token nope");
  const bad = journeys.map((j) => (j.id === "J02" ? { ...j, steps: j.steps.map((s) => (s.page === "W20" ? { ...s, role: "instructor" } : s)) } : j));
  fails(run(bad), "W20 as instructor");
  fails(run(journeys.slice(0, 11)), "11 journeys");
  fails(run(journeys, WB.manifest.spine.slice(1)), "short spine");
});

test("13. 15 states fail checkStates, as does a failure scenario with an unknown state", () => {
  const states = copy(WB.manifest.states);
  const failures = copy(WB.data.scenarios.failures);
  const run = (s, f = failures) => M.checkStates(s, f, WB.manifest.pagesById, WB);
  passes(run(states), "16 states");
  fails(run(states.slice(0, 15)), "15 states");
  fails(run(states, failures.map((f, i) => (i === 0 ? { ...f, state: "released" } : f))), "failure state");
  fails(run(states.map((s) => (s.id === "saving" ? { ...s, saveState: "pending" } : s))), "saveState");
});

test("14. record state 'submitted' fails checkRecordStates", () => {
  const data = copy(WB.data);
  data.coursework.submissions[0].state = "submitted";
  fails(V.checkRecordStates(WB, data), "submitted");
});

test("15–16. a status word in a page file and an assignment to WB.STATUS fail checkNoLabelRedefinition", () => {
  passes(V.checkNoLabelRedefinition(V.sourceFiles(), WB), "real sources");
  fails(V.checkNoLabelRedefinition([{ path: "design/final/pages/fake.js", text: 'const X = "Held";' }], WB), "Held literal");
  fails(V.checkNoLabelRedefinition([{ path: "design/final/pages/fake.js", text: "WB.STATUS.held = { label: 1 };" }], WB), "assignment");
  fails(V.checkNoLabelRedefinition([{ path: "design/final/pages/fake.js", text: "Object.defineProperty(WB.FLAGS, 'x', {});" }], WB), "defineProperty");
  fails(V.checkNoLabelRedefinition([{ path: "design/final/manifest/status.js", text: "var t = { label: 1 };" }], WB), "label key in status.js");
});

test("17. an unreleased excusal without priorVisible throws in keyFor", () => {
  assert.throws(() => WB.manifest.status.keyFor({ state: "excused", released: false }, "student"), /priorVisible/);
  assert.throws(() => WB.manifest.status.keyFor({ state: "submitted", released: false }, "student"), /unknown record state 'submitted'/);
});

test("18. an allowance with both extra minutes and a multiplier throws", () => {
  const data = copy(WB.data);
  data.quiz.allowances[0].multiplier = 1.5;
  assert.throws(() => S.effectiveMinutes(viewOf(data), "quiz3", "aisha"), /both extra_minutes and multiplier/);
});

test("19. WB.defineFrozen refuses a redefinition, and any definition after finalize", () => {
  const partial = loadKit({ files: [...KIT_FILES, dataPath("manifest/define.js"), dataPath("manifest/states.js")] });
  assert.throws(() => partial.defineFrozen(partial.manifest, "states", []), /'states' already defined/);
  assert.throws(() => WB.defineFrozen(WB.data, "extra", {}), /finalized/);
});

test("20. loadAll twice gives independent WB objects", () => {
  const a = loadAll();
  const b = loadAll();
  assert.notEqual(a, b);
  assert.notEqual(a.data, b.data);
  assert.notEqual(a.sel.scenarioView, b.sel.scenarioView);
});

// ---------- Amendments A1–A6, B1–B4 ----------

test("A1/B1: state fields are validated by dataset; unclassified state fields fail", () => {
  const ann = copy(WB.data);
  ann.comms.announcements[0].state = "held";
  fails(V.checkRecordStates(WB, ann), "announcement held");
  const fail = copy(WB.data);
  fail.scenarios.failures[0].state = "released";
  fails(V.checkRecordStates(WB, fail), "failure released");
  const stray = copy(WB.data);
  stray.staff.reviews[0].state = "held";
  assert.ok(V.checkRecordStates(WB, stray).some((e) => e.includes("unclassified")));
  const override = copy(WB.data);
  override.scenarios.overrides.assignment_submission[0].record.state = "submitted";
  fails(V.checkRecordStates(WB, override), "override record");
  const prior = copy(WB.data);
  prior.coursework.submissions[2] = { ...prior.coursework.submissions[2], released: false, priorVisible: { state: "graded2", released: false } };
  fails(V.checkRecordStates(WB, prior), "priorVisible state");
});

test("A2: roots are frozen and pinned; nested records cannot change", () => {
  passes(F.checkFrozen(WB), "checkFrozen");
  assert.throws(() => { WB.data = {}; });
  assert.throws(() => { WB.data.extra = 1; });
  assert.throws(() => { WB.data.coursework.submissions[0].state = "draft"; });
  assert.throws(() => { WB.sel.pct = null; });
});

test("A3/B2: an unreleased excusal shows the student the prior snapshot, with its release flag", () => {
  const k = WB.manifest.status.keyFor;
  const excused = (prior) => ({ state: "excused", released: false, priorVisible: prior });
  assert.deepEqual({ ...k(excused({ state: "missing", released: true }), "student") }, { key: "missing", late: false, released: true });
  assert.deepEqual({ ...k(excused({ state: "missing", released: false }), "student") }, { key: "notReceivedClosed", late: false, released: false });
  assert.equal(k({ state: "excused", released: true }, "student").key, "excused");
  assert.equal(k(excused({ state: "missing", released: true }), "instructor").key, "excused");
  for (const [pr, want] of [[true, "missing"], [false, "notReceivedClosed"]]) {
    const r = k(excused({ state: "missing", released: pr }), "student");
    const html = WB.K.status(r.key, WB.ctx({ platform: "web", role: "student" }), { released: r.released, own: true, late: r.late });
    assert.ok(html.includes(WB.STATUS[want].label));
  }
  assert.equal(k({ state: "held", released: false }, "guest"), null);
  assert.equal(k({ state: "held", released: false }, "student", { own: false }), null);
  assert.equal(k({ state: "received", released: false, late: true }, "student").late, true);
  assert.equal(k({ state: "held", released: false, late: true }, "instructor").late, false);
});

test("A4: learner arithmetic reads released snapshots only; staff read pending first", () => {
  const data = copy(WB.data);
  const r = data.grades.results.find((x) => x.id === "aisha-ps1");
  r.pending = { status: "excused", score: null };
  const v = viewOf(data);
  assert.equal(S.courseTotal(v, PHYS, "aisha", AISHA).display, "84.50%");
  assert.notEqual(S.courseTotal(v, PHYS, "aisha", REYES).display, "85.17%");
  r.released = r.pending;
  r.pending = null;
  assert.notEqual(S.courseTotal(viewOf(data), PHYS, "aisha", AISHA).display, "84.50%");
});

test("A4: a released Missing counts as zero; an unreleased one only for staff", () => {
  const data = copy(WB.data);
  data.grades.results.find((x) => x.id === "aisha-ps3").released = { status: "missing", score: null };
  const t = S.courseTotal(viewOf(data), PHYS, "aisha", AISHA);
  assert.equal(t.display, S.pct(0.4 * (51 / 90) * 100 + 22.5 + 28));
});

test("A5/B3: every scenario view is time-consistent; removing the override or the projection breaks it", () => {
  passes(F.checkAllTemporal(WB), "all scenarios");
  const hand = S.scenarioView("assignment_submission");
  assert.ok(!hand.data.comms.announcements.some((a) => a.id === "ann-quiz3"));
  assert.ok(!hand.data.coursework.receipts.some((r) => r.id === "AH-PHYS110-001"));
  assert.equal(hand.data.comms.announcements.find((a) => a.id === "ann-office-hours").revisions.length, 1);
  const noOverride = copy(WB.data);
  noOverride.scenarios.overrides.assignment_submission = [];
  fails(F.checkTemporal(WB, viewOf(noOverride, "assignment_submission")), "no override");
  fails(F.checkTemporal(WB, viewOf(copy(WB.data), "assignment_submission", { project: false })), "no projection");
  assert.equal(WB.data.coursework.submissions.find((s) => s.id === "aisha-ps4").state, "held", "base data untouched");
});

test("A5: overrides are applied immutably and reject bad entries", () => {
  const data = copy(WB.data);
  assert.throws(() => S.applyOverrides(data, [{ dataset: "coursework", collection: "submissions", id: "nobody-ps4", op: "replace", record: {} }]), /missing/);
  assert.throws(() => S.applyOverrides(data, [{ dataset: "coursework", collection: "nothing", id: "x", op: "remove" }]), /unknown collection/);
  assert.throws(() => S.scenarioView("no_such_scenario"), /unknown scenario/);
  const out = S.applyOverrides(data, [{ dataset: "coursework", collection: "submissions", id: "aisha-ps4", op: "remove" }]);
  assert.ok(data.coursework.submissions.some((s) => s.id === "aisha-ps4"));
  assert.ok(!out.coursework.submissions.some((s) => s.id === "aisha-ps4"));
});

test("A6: quiz attempt timeline across scenarios", () => {
  passes(F.checkAttempts(WB), "checkAttempts");
  const late = S.scenarioView("late_quiz_start");
  assert.equal(S.attemptView(late, "quiz3", "aisha").secondsLeft, 240);
  const data = copy(WB.data);
  data.scenarios.overrides.quiz_received[0].record.received_at = "2026-10-21T10:31:00-04:00";
  data.scenarios.clocks.quiz_received = "2026-10-21T10:40:00-04:00";
  fails(F.checkTemporal(WB, viewOf(data, "quiz_received")), "received after deadline");
});

test("B4: selectors read one view; counts, receipts, grades and keys agree per scenario", () => {
  passes(F.checkScenarioConsistency(WB), "consistency");
  const hand = S.scenarioView("assignment_submission");
  assert.deepEqual({ ...S.courseworkCounts(hand, PHYS, "aisha") }, { all: 8, toDo: 3, handedIn: 0, released: 4 });
  assert.equal(S.courseTotal(hand, PHYS, "aisha", REYES).display, "84.50%");
  const group = S.scenarioView("group_submission");
  assert.equal(S.courseworkCounts(group, PHYS, "aisha").handedIn, 2);
});

test("unread announcements, topics and events follow the person and the view", () => {
  const v = base();
  assert.deepEqual(copy(S.unreadAnnouncements(v, PHYS, "aisha").map((x) => `${x.id}:${x.reason}`)), ["ann-quiz3:new", "ann-office-hours:updated"]);
  assert.ok(S.visibleTopics(v, PHYS, "aisha").some((t) => t.id === "team-orbit-planning"));
  assert.ok(!S.visibleTopics(v, PHYS, "carmen").some((t) => t.id === "team-orbit-planning"));
  const week = ["2026-10-19T00:00:00-04:00", "2026-10-26T00:00:00-04:00"];
  assert.ok(S.eventsFor(v, AISHA, ...week).some((e) => e.id === "private-shift"));
  assert.ok(!S.eventsFor(v, { role: "student", personId: "ben" }, ...week).some((e) => e.id === "private-shift" || e.kind === "gradingTask"));
  assert.ok(S.eventsFor(v, { role: "ta", personId: "maya" }, ...week).some((e) => e.kind === "gradingTask"));
  assert.ok(S.isBefore(S.calendarEvents(v).find((e) => e.kind === "gradingTask").start, S.accessEnd(v, "maya", PHYS)));
  assert.equal(S.activityFor(v, "aisha")[0].id, "act-projectile-reply");
  for (const x of v.data.activity.items) assert.ok(!Object.keys(x).some((k) => /score|grade/i.test(k)), "BD25: no score fields");
});

// ---------- Fix round 1: R11–R14 ----------

test("R11: a TA whose access has ended gets no receipts and no progress; the task stays readable", () => {
  const maya = { role: "ta", personId: "maya" };
  const live = base();
  assert.deepEqual([...S.receiptsFor(live, "ps4", maya).map((r) => r.id)].sort(), ["AH-PHYS110-001", "AH-PHYS110-002"]);
  assert.deepEqual({ ...S.reviewProgress(live, "ps4", maya) }, { reviewed: 1, of: 2 });
  assert.deepEqual({ ...S.receivedProgress(live, "ps4", maya) }, { received: 2, of: 2 });
  assert.deepEqual({ ...S.receivedProgress(live, "ps4", REYES) }, { received: 2, of: 3 });
  const ended = S.scenarioView("ta_expired");
  assert.deepEqual([...S.receiptsFor(ended, "ps4", maya)], []);
  assert.equal(S.reviewProgress(ended, "ps4", maya), null);
  assert.equal(S.receivedProgress(ended, "ps4", maya), null);
  const task = S.gradingTaskFor(ended, "maya", "ps4");
  assert.equal(task.assessment_id, "ps4");
  assert.equal(task.access_end, S.accessEnd(ended, "maya", PHYS));
  assert.deepEqual({ ...S.reviewProgress(ended, "ps4", { role: "instructor", personId: "reyes" }) }, { reviewed: 1, of: 2 });
  assert.ok(S.receiptsFor(ended, "ps4", { role: "instructor", personId: "reyes" }).length > 0);
});

test("R15: TA progress and receipts respect the grading task scope", () => {
  const maya = { role: "ta", personId: "maya" };
  const live = base();
  // Motion investigation has no grading task for Maya: nothing to read, although her access is active.
  assert.equal(S.gradingTaskFor(live, "maya", "motion"), null);
  assert.equal(S.reviewProgress(live, "motion", maya), null);
  assert.equal(S.receivedProgress(live, "motion", maya), null);
  assert.deepEqual([...S.receiptsFor(live, "motion", maya)], []);
  // Narrowing the task to Aisha, built as spread copies so the frozen WB.data is untouched.
  const task = WB.data.staff.grading_tasks[0];
  const narrowed = { ...WB.data, staff: { ...WB.data.staff, grading_tasks: [{ ...task, learner_ids: ["aisha"] }] } };
  const view = viewOf(narrowed);
  assert.deepEqual({ ...S.receivedProgress(view, "ps4", maya) }, { received: 1, of: 1 });
  assert.deepEqual({ ...S.reviewProgress(view, "ps4", maya) }, { reviewed: 1, of: 1 });
  assert.deepEqual([...S.receiptsFor(view, "ps4", maya).map((r) => r.id)], ["AH-PHYS110-001"]);
  assert.deepEqual([...WB.data.staff.grading_tasks[0].learner_ids], ["aisha", "ben"]);
  // An expired TA access reads nothing for the grading task, as before.
  const ended = S.scenarioView("ta_expired");
  assert.equal(S.receivedProgress(ended, "ps4", maya), null);
  assert.equal(S.reviewProgress(ended, "ps4", maya), null);
  assert.deepEqual([...S.receiptsFor(ended, "ps4", maya)], []);
});

test("R12: a held correction shows the student the latest released snapshot; staff see held", () => {
  const k = WB.manifest.status.keyFor;
  const held = (state) => ({ state: "correctionHeld", released: true, priorVisible: { state, released: true } });
  for (const want of ["feedbackUpdated", "missing", "released"]) {
    const r = k(held(want), "student");
    assert.equal(r.key, want);
    const html = WB.K.status(r.key, WB.ctx({ platform: "web", role: "student" }), { released: r.released, own: true, late: r.late });
    assert.ok(html.includes(WB.STATUS[want].label));
    assert.equal(k(held(want), "instructor").key, "held");
    assert.equal(k(held(want), "ta").key, "held");
  }
  assert.throws(() => k({ state: "correctionHeld", released: true }, "student"), /priorVisible/);
  assert.throws(() => k({ state: "correctionHeld", released: false }, "student"), /priorVisible/);
  assert.throws(() => k({ state: "correctionHeld", released: true, priorVisible: { state: "correctionHeld", released: true } }, "student"), /priorVisible/);
  passes(V.checkMapping(WB), "checkMapping");
});

test("R16: a held correction after a released excusal keeps Excused", () => {
  const k = WB.manifest.status.keyFor;
  const priorExcused = { state: "excused", released: true };
  const r = k({ state: "correctionHeld", released: true, priorVisible: priorExcused }, "student");
  assert.equal(r.key, "excused");
  assert.equal(r.released, true);
  const html = WB.K.status(r.key, WB.ctx({ platform: "web", role: "student" }), { released: r.released, own: true, late: r.late });
  assert.ok(html.includes(WB.STATUS.excused.label));
  assert.equal(k({ state: "correctionHeld", released: true, priorVisible: priorExcused }, "instructor").key, "held");
  assert.equal(k({ state: "correctionHeld", released: true, priorVisible: priorExcused }, "ta").key, "held");
  assert.throws(() => k({ state: "correctionHeld", released: true, priorVisible: { state: "excused", released: false } }, "student"), /priorVisible/);
  assert.throws(() => k({ state: "correctionHeld", released: true, priorVisible: { state: "correctionHeld", released: true } }, "student"), /priorVisible/);
  passes(V.checkMapping(WB), "checkMapping");
  passes(V.checkFixtureStatuses(WB), "checkFixtureStatuses");
});

test("R13: zero-point items never count; an all-zero-point category is empty and renormalises", () => {
  const one = [{ id: "c", weight: 100 }];
  const mixed = [{ category: "c", score: 0, max: 0 }, { category: "c", score: 10, max: 10 }];
  for (const method of ["equal", "proportional"]) {
    const t = S.weightedTotal(one, mixed, method);
    assert.equal(t.value, 100, method);
    assert.equal(t.display, "100.00%", method);
  }
  const two = [{ id: "a", weight: 40 }, { id: "z", weight: 60 }];
  const items = [{ category: "a", score: 8, max: 10 }, { category: "z", score: 0, max: 0 }];
  for (const method of ["equal", "proportional"]) {
    const t = S.weightedTotal(two, items, method);
    assert.equal(t.display, "80.00%", method);
    assert.equal(t.representedWeight, 40, method);
  }
  const allZero = S.weightedTotal(one, [{ category: "c", score: 0, max: 0 }], "equal");
  assert.equal(allZero.value, null);
  assert.equal(allZero.empty, true);
});

test("R14: a 1.5 multiplier on 15 minutes gives 22.5 minutes and a deadline 30 s after 22 minutes", () => {
  const start = "2026-10-21T10:00:00-04:00";
  const withAllowance = (allowance) => {
    const data = copy(WB.data);
    data.quiz.quizzes.find((q) => q.id === "quiz3").minutes = 15;
    Object.assign(data.quiz.allowances[0], allowance);
    return viewOf(data);
  };
  const mult = withAllowance({ extra_minutes: null, multiplier: 1.5, timer_mode: "multiplier" });
  const extra = withAllowance({ extra_minutes: 7, multiplier: null });
  assert.equal(S.effectiveMinutes(mult, "quiz3", "aisha"), 22.5);
  assert.equal(S.effectiveMinutes(extra, "quiz3", "aisha"), 22);
  const a = S.effectiveDeadline(mult, "quiz3", "aisha", start);
  const b = S.effectiveDeadline(extra, "quiz3", "aisha", start);
  assert.equal(a, "2026-10-21T10:22:30-04:00");
  assert.equal(S.minutesBetween(b, a) * 60, 30);
  assert.equal(S.availableMinutes(mult, "quiz3", "aisha", start), 22.5);
});

test("R17: access is decided per grading task; an expired task does not hide an active one in the same course", () => {
  const maya = { role: "ta", personId: "maya" };
  const clock = base().clock;
  const ps4Task = WB.data.staff.grading_tasks[0];
  const expiredMotion = { ...ps4Task, id: "task-maya-motion", assessment_id: "motion", access_end: "2026-10-19T23:59:00-04:00" };
  const boundaryMotion = { ...expiredMotion, access_end: clock };
  const viewWith = (tasks) => viewOf({ ...WB.data, staff: { ...WB.data.staff, grading_tasks: tasks } });
  // Both orders of the same two tasks must give the same answer.
  for (const tasks of [[ps4Task, expiredMotion], [expiredMotion, ps4Task]]) {
    const view = viewWith(tasks);
    assert.equal(S.taTaskAccess(view, "ps4", maya).active, true);
    assert.equal(S.taTaskAccess(view, "motion", maya).active, false);
    assert.deepEqual({ ...S.receivedProgress(view, "ps4", maya) }, { received: 2, of: 2 });
    assert.deepEqual([...S.receiptsFor(view, "ps4", maya).map((r) => r.id)].sort(), ["AH-PHYS110-001", "AH-PHYS110-002"]);
    assert.equal(S.receivedProgress(view, "motion", maya), null);
    assert.equal(S.reviewProgress(view, "motion", maya), null);
    assert.deepEqual([...S.receiptsFor(view, "motion", maya)], []);
    // The course-level notice keeps the latest access_end, so the course stays active while ps4 is.
    assert.equal(S.accessEnd(view, "maya", PHYS), ps4Task.access_end);
    assert.equal(S.taAccessActive(view, "maya", PHYS), true);
  }
  // Exact boundary: a clock equal to access_end counts as ended for that task.
  const edge = viewWith([ps4Task, boundaryMotion]);
  assert.equal(S.taTaskAccess(edge, "motion", maya).active, false);
  assert.equal(S.receivedProgress(edge, "motion", maya), null);
  assert.deepEqual([...S.receiptsFor(edge, "motion", maya)], []);
  assert.deepEqual({ ...S.receivedProgress(edge, "ps4", maya) }, { received: 2, of: 2 });
  assert.deepEqual([...WB.data.staff.grading_tasks.map((t) => t.access_end)], [ps4Task.access_end]);
});

// ---------- File discipline ----------

test("manifest, fixtures and the new tools are at most 800 lines; data files have no module or console use", () => {
  const dataFiles = ["manifest", "fixtures"].flatMap((d) => fs.readdirSync(path.join(DATA_DIR, d)).filter((f) => f.endsWith(".js")).map((f) => path.join(DATA_DIR, d, f)));
  const tools = ["check_fixtures.mjs", "check_manifest.mjs", "check_vocab.mjs", "load_data.mjs", "data.test.mjs"].map((f) => path.join(HERE, f));
  for (const f of [...dataFiles, ...tools]) assert.ok(fs.readFileSync(f, "utf8").split("\n").length <= 800, `${path.basename(f)} is over 800 lines`);
  for (const f of dataFiles) {
    const src = fs.readFileSync(f, "utf8");
    for (const [re, what] of [[/^\s*(import|export)\b/m, "module syntax"], [/\brequire\(/, "require"], [/\bconsole\b/, "console"], [/\bwindow\b/, "window"], [/\bdocument\b/, "document"]]) assert.ok(!re.test(src), `${path.basename(f)}: ${what}`);
    assert.ok(/^\/\*[\s\S]*?(Source|spec\/|board)/.test(src), `${path.basename(f)}: source comment`);
  }
  assert.ok(fs.existsSync(path.join(DATA_DIR, "fixtures", "SOURCES.md")));
});

test("R18: a TA holds at most one grading task per assessment; duplicates fail the check and the selector", () => {
  assert.deepEqual(F.checkTaskUniqueness(WB), []);
  const ps4Task = WB.data.staff.grading_tasks[0];
  const dup = { ...ps4Task, id: "task-maya-ps4-b", learner_ids: ["carmen"] };
  const data = { ...WB.data, staff: { ...WB.data.staff, grading_tasks: [ps4Task, dup] } };
  const fakeWB = { data, sel: { scenarioIds: () => [], scenarioView: () => ({ data }) } };
  fails(F.checkTaskUniqueness(fakeWB), "duplicate TA/assessment task");
  assert.throws(() => S.gradingTaskFor(viewOf(data), "maya", "ps4"), /more than one task/);
});

test("REV-01: the grading-due event follows its grading task (deadline change, reassignment, removal)", () => {
  const week = ["2026-10-19T00:00:00-04:00", "2026-10-26T00:00:00-04:00"];
  const task = WB.data.staff.grading_tasks[0];
  const withTasks = (tasks) => viewOf({ ...WB.data, staff: { ...WB.data.staff, grading_tasks: tasks } });
  const due = (view, who, role) => S.eventsFor(view, { role, personId: who }, ...week).find((e) => e.kind === "gradingTask");
  assert.equal(due(withTasks([task]), "maya", "ta").start, task.grading_due);
  const moved = withTasks([{ ...task, grading_due: "2026-10-24T12:00:00-04:00" }]);
  assert.equal(due(moved, "maya", "ta").start, "2026-10-24T12:00:00-04:00");
  const reassigned = withTasks([{ ...task, ta_id: "reyes" }]);
  assert.equal(due(reassigned, "maya", "ta"), undefined);
  assert.equal(due(reassigned, "reyes", "instructor").owner_id, "reyes");
  assert.equal(due(withTasks([]), "maya", "ta"), undefined);
  assert.equal(due(withTasks([]), "reyes", "instructor"), undefined);
});

test("REV-02: grading-due events are generated per task; adding or removing either task changes only its event", () => {
  const week = ["2026-10-19T00:00:00-04:00", "2026-10-26T00:00:00-04:00"];
  const ps4 = WB.data.staff.grading_tasks[0];
  const motion = { ...ps4, id: "task-maya-motion", assessment_id: "motion", grading_due: "2026-10-24T17:00:00-04:00" };
  const withTasks = (tasks) => viewOf({ ...WB.data, staff: { ...WB.data.staff, grading_tasks: tasks } });
  const ids = (view) => [...S.eventsFor(view, { role: "ta", personId: "maya" }, ...week).filter((e) => e.kind === "gradingTask").map((e) => e.id).sort()];
  assert.deepEqual(ids(withTasks([ps4])), ["grading-due-task-maya-ps4"]);
  assert.deepEqual(ids(withTasks([ps4, motion])), ["grading-due-task-maya-motion", "grading-due-task-maya-ps4"]);
  assert.deepEqual(ids(withTasks([motion])), ["grading-due-task-maya-motion"]);
  assert.deepEqual(ids(withTasks([])), []);
  const names = S.calendarEvents(withTasks([ps4, motion])).filter((e) => e.kind === "gradingTask").map((e) => e.name);
  assert.equal(new Set(names).size, 2);
  assert.ok(names.every((n) => !/undefined/.test(n)));
  assert.equal(S.calendarEvents(withTasks([ps4])).filter((e) => e.kind !== "gradingTask").length, WB.data.calendar.events.length);
});

test("REV-03: a TA sees a group receipt only when every captured member is in scope", () => {
  const ps4 = WB.data.staff.grading_tasks[0];
  const maya = { role: "ta", personId: "maya" };
  const gv = S.scenarioView("group_submission");
  const withMotion = (learners) => viewOf({ ...WB.data, staff: { ...WB.data.staff, grading_tasks: [ps4, { ...ps4, id: "task-maya-motion", assessment_id: "motion", learner_ids: learners }] } }, "group_submission");
  const groupIds = (view) => [...S.receiptsFor(view, "motion", maya).map((r) => r.id)];
  assert.deepEqual(groupIds(withMotion(["aisha", "ben"])), ["AH-PHYS110-GROUP-001"]);
  assert.deepEqual(groupIds(withMotion(["aisha"])), []);
  assert.ok(S.receiptsFor(gv, "motion", { role: "instructor", personId: "reyes" }).some((r) => r.id === "AH-PHYS110-GROUP-001"));
});
