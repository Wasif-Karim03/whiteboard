// Phase 3 segment seg6-grading (W50, W52, W54, W57, W58) and optional (O01, O02, O03): render matrix, tiers,
// authority, data mutations, journeys and record-true, role-safe links (plan Step 8; amendments A1, A6, A8, A9,
// A10). Expected figures are read from WB.sel, never typed. Source checks only, not browser or device acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import {
  WB, S, P, esc, SCENARIOS, CTX3, CTX5, view, viewer, when, copy, frame, direct, tokensOf, rolesOf,
  mainOf, idsInMain, goLinks, goPages, rowsWith, disabledWith, studentNames, courseId,
} from "./spine_helpers.mjs";

const PAGES = ["W50", "W52", "W54", "W57", "W58", "O01", "O02", "O03"];
const STAFF = PAGES.slice(0, 5);
const OPTIONAL = PAGES.slice(5);
const ENDED = "Your grading access for this course has ended";
const NO_BOUNDARIES = "This policy sets no letter boundaries, so no page shows a letter grade";
const NO_TASKS = "No grading tasks yet";
const PROTECTIVE = {
  W50: "Hold recalculation for this rubric", W52: "Keep the current policy version", W54: "Keep the current result as released",
  W57: "Flag this task for follow-up", W58: "Flag a fact for review",
};
const homeOf = (id, variant) => (S.anchorFor(id, variant) || S.anchorFor(id) || { home: "default" }).home;
const isVariant = (page, token) => Boolean(token) && Object.hasOwn(WB.pageFor(page).variants, token);
const formControls = (html) => [...mainOf(html).matchAll(/<(input|select|textarea)\b[^>]*>/g)].map((m) => m[0]);

// A1: a link never changes identity, so every go target must allow the frame's current role.
export function roleSafeLinks(html, role) {
  return goPages(html).filter((target) => !WB.manifest.pagesById[target].roles.includes(role));
}

// The record a go token opens: the target's anchor record, or the named variant's; null for course-level pages.
function recordOfGo(go) {
  const [pageVar] = go.split("?")[0].split("~");
  const [page, variant] = pageVar.split(":");
  const anchor = WB.manifest.anchors[page];
  if (!anchor) return null;
  const rec = S.anchorFor(page, variant || null)?.record;
  if (!rec) return null;
  return `${rec.type}:${rec.id}`;
}

// A10: the records each page may link to (the records it shows), computed from the selectors at a scenario.
function allowedRecords(page, sc) {
  const v = view(sc);
  const ins = viewer(sc, "instructor");
  const items = P.assessments({ view: v, who: ins });
  const course = [`course:${courseId()}`];
  if (page === "W50") {
    const rubric = S.anchorFor("W50").record.id;
    const mine = items.filter((x) => x.rubric_id === rubric);
    const receipts = mine.flatMap((x) => S.receiptsFor(v, x.id, ins)).map((r) => `receipt:${r.id}`);
    return [`rubric:${rubric}`, ...mine.map((x) => `assessment:${x.id}`), ...receipts];
  }
  if (page === "W52") return items.filter((x) => (S.releaseReady(v, x.id, ins) || []).some((r) => r.included)).map((x) => `assessment:${x.id}`);
  if (page === "W54") return [`assessment:${S.anchorFor("W53").record.id}`];
  if (page === "W57") {
    const tas = S.enrolled(v, courseId(), "ta");
    const tasks = tas.flatMap((t) => items.map((x) => S.gradingTaskFor(v, t, x.id)).filter(Boolean));
    return [...tasks.map((t) => `assessment:${t.assessment_id}`), ...tas.map((t) => `person:${t}`)];
  }
  if (page === "W58") return items.map((x) => `assessment:${x.id}`);
  return course;
}

function checkOne(bad, vs) {
  const label = `${vs.page} ${vs.platform}/${vs.width || vs.orientation || ""} ${vs.role} ${vs.token || "default"} ${vs.scenario}`;
  try {
    const f = frame(vs);
    const problems = [...f.problems];
    if (f.html.includes("Not built yet")) problems.push("placeholder text");
    if (f.blocked) problems.push("role blocked");
    for (const id of idsInMain(f.html)) if (!id.startsWith("t-")) problems.push(`id ${id} outside the frame ns`);
    for (const t of roleSafeLinks(mainOf(f.html), vs.role)) problems.push(`link to ${t} changes role`);
    if (problems.length) bad.push(`${label}: ${problems.slice(0, 3).join("; ")}`);
  } catch (err) {
    bad.push(`${label} threw: ${err.message}`);
  }
}

// ---------- 1. Structure ----------
test("seg6 structure: the eight pages are real, cover all states and draw the required ones", () => {
  const all = [...WB.manifest.states.map((s) => s.id)].sort();
  for (const id of PAGES) {
    const e = WB.pageFor(id);
    assert.equal(e.placeholder, false, id);
    assert.deepEqual([...e.states, ...Object.keys(e.na)].sort(), all, id);
    for (const r of Object.values(e.na)) assert.ok(r.length > 0 && r.length <= 140, `${id}: ${r}`);
  }
  assert.ok(WB.pageFor("W52").states.includes("invalid"));
  for (const id of STAFF) assert.ok(WB.pageFor(id).states.includes("permissionUnavailable"), id);
  for (const id of OPTIONAL) assert.ok(Object.hasOwn(WB.pageFor(id).variants, "enabled"), id);
});

// ---------- 2. Render matrix ----------
test("seg6 render: every page × context × role × token renders cleanly at default and home, with role-safe links", () => {
  const bad = [];
  for (const page of PAGES) for (const token of tokensOf(page)) {
    const scenarios = [...new Set(["default", homeOf(page, isVariant(page, token) ? token : null)])];
    for (const scenario of scenarios) for (const c of CTX5) for (const role of rolesOf(page)) checkOne(bad, { page, token, scenario, role, ...c });
  }
  assert.deepEqual(bad.slice(0, 20), []);
});

test("seg6 render: every default view renders for every scenario and role on three platforms", () => {
  const bad = [];
  for (const page of PAGES) for (const scenario of SCENARIOS) for (const role of rolesOf(page)) for (const c of CTX3) checkOne(bad, { page, scenario, role, ...c });
  assert.deepEqual(bad.slice(0, 20), []);
});

// ---------- 3. Tiers ----------
test("seg6 tiers: review frames carry the handoff and the instructor protective action; W57 on iPad is full", () => {
  for (const page of STAFF) for (const c of CTX5) {
    const tier = WB.pageFor(page).page.platforms[c.platform];
    for (const role of rolesOf(page)) {
      const html = frame({ page, role, ...c }).html;
      if (tier !== "review") { assert.ok(!html.includes("wb-handoff"), `${page} ${c.platform} ${role}`); continue; }
      assert.ok(html.includes("wb-handoff--review"), `${page} ${c.platform} ${role}`);
      if (role === "instructor") assert.ok(html.includes(esc(PROTECTIVE[page])), `${page} ${c.platform} protective`);
    }
  }
  assert.equal(WB.pageFor("W57").page.platforms.ipad, "full");
  for (const orientation of ["landscape", "portrait"]) assert.ok(!frame({ page: "W57", role: "instructor", platform: "ipad", orientation }).html.includes("wb-handoff"));
});

test("seg6 tiers: O02 on iPad and iPhone is a handoff with no form control", () => {
  for (const c of [CTX5[2], CTX5[3], CTX5[4]]) for (const role of rolesOf("O02")) for (const token of tokensOf("O02")) {
    const html = frame({ page: "O02", role, token, ...c }).html;
    assert.ok(html.includes("wb-handoff--handoff"), `${c.platform} ${role} ${token}`);
    assert.deepEqual(formControls(html), [], `${c.platform} ${role} ${token}`);
  }
});

// ---------- 4. Authority ----------
test("seg6 authority: a TA whose access ended sees the notice only, with no learner name", () => {
  const names = studentNames("ta_expired");
  for (const page of STAFF) for (const token of tokensOf(page)) for (const c of CTX3) {
    const html = mainOf(frame({ page, token, role: "ta", scenario: "ta_expired", ...c }).html);
    assert.ok(html.includes(ENDED), `${page} ${token} ${c.platform}`);
    for (const n of names) assert.ok(!html.includes(esc(n)), `${page} ${token} ${c.platform}: ${n}`);
  }
});

test("seg6 authority: W52 shows a TA no course total, category figure or learner name", () => {
  const v = view();
  const ins = viewer("default", "instructor");
  const totals = S.enrolled(v, courseId(), "student").flatMap((p) => [S.courseTotal(v, courseId(), p, ins).display, S.courseTotal(v, courseId(), p, ins, { as: "learner" }).display]).filter(Boolean);
  assert.ok(totals.length > 0);
  for (const token of tokensOf("W52")) for (const c of CTX3) {
    const html = mainOf(frame({ page: "W52", token, role: "ta", ...c }).html);
    for (const t of totals) assert.ok(!html.includes(esc(t)), `${token} ${c.platform}: ${t}`);
    for (const n of studentNames()) assert.ok(!html.includes(esc(n)), `${token} ${c.platform}: ${n}`);
    for (const ctl of ["Apply policy version", "Preview calculation", "Edit weights"]) assert.ok(!html.includes(ctl), `${token} ${ctl}`);
  }
});

test("seg6 authority: W54 shows a TA none of the Quiz 2 receipt, learner or released score", () => {
  const v = view();
  const ins = viewer("default", "instructor");
  const rid = S.anchorFor("W27", "quiz2").record.id;
  const rec = P.receiptById({ view: v, who: ins, sel: S }, rid);
  const res = S.resultFor(v, rec.owner_id, rec.assessment_id, ins);
  for (const token of tokensOf("W54")) for (const c of CTX3) {
    const html = mainOf(frame({ page: "W54", token, role: "ta", ...c }).html);
    for (const need of [rid, S.person(v, rec.owner_id).name, P.score(res.score, res.max)]) assert.ok(!html.includes(esc(need)), `${token} ${c.platform}: ${need}`);
  }
});

test("seg6 authority: W50 shows a TA no apply control, release version or draft total", () => {
  const v = view();
  const ins = viewer("default", "instructor");
  const st = viewer("default", "student");
  const total = S.gradeDraftFor(v, st.personId, "ps4", ins).total;
  for (const token of tokensOf("W50")) for (const c of CTX3) {
    const html = mainOf(frame({ page: "W50", token, role: "ta", ...c }).html);
    assert.ok(!html.includes("Apply reviewed change"), `${token} ${c.platform}`);
    assert.ok(!html.includes("would be recalculated"), `${token} ${c.platform}`);
    assert.ok(!html.includes(esc(P.score(total.score, total.max))), `${token} ${c.platform}`);
    assert.ok(!/Version \d+ ·/.test(html), `${token} ${c.platform}`);
  }
});

test("seg6 authority: W57 shows a TA only their task's learners and no date field; W58 withholds attendance", () => {
  const v = view();
  const ta = viewer("default", "ta");
  const mine = S.taScope(v, "ps4", ta).learnerIds.map((p) => S.person(v, p).name);
  const others = studentNames().filter((n) => !mine.includes(n));
  assert.ok(others.length > 0);
  for (const c of CTX3) {
    const html = mainOf(frame({ page: "W57", role: "ta", ...c }).html);
    for (const n of mine) assert.ok(html.includes(esc(n)), `${c.platform} ${n}`);
    for (const n of others) assert.ok(!html.includes(esc(n)), `${c.platform} ${n}`);
    assert.ok(!html.includes('type="date"'), c.platform);
    assert.ok(mainOf(frame({ page: "W58", role: "ta", ...c }).html).includes("Attendance is not in your course role"), c.platform);
  }
});

test("seg6 authority: no TA frame has a release destination or a dialog opener", () => {
  for (const page of STAFF) for (const token of tokensOf(page)) for (const c of CTX3) {
    const html = frame({ page, token, role: "ta", ...c }).html;
    assert.ok(!goPages(mainOf(html)).includes("W53"), `${page} ${token} ${c.platform}`);
    assert.ok(!html.includes('data-act="open-dialog"'), `${page} ${token} ${c.platform}`);
  }
});

test("seg6 authority: W52 instructor shows the working and released totals under distinct labels", () => {
  const v = view();
  const ins = viewer("default", "instructor");
  const learner = viewer("default", "student").personId;
  const staff = S.courseTotal(v, courseId(), learner, ins).display;
  const released = S.courseTotal(v, courseId(), learner, ins, { as: "learner" }).display;
  assert.notEqual(staff, released);
  for (const c of CTX3) {
    const html = mainOf(frame({ page: "W52", role: "instructor", ...c }).html);
    assert.ok(html.includes(esc(staff)) && html.includes(esc(released)), c.platform);
    assert.ok(html.includes("Working total") && html.includes("Released total"), c.platform);
  }
});

test("seg6 authority: W50 at ps4_released lists the PS4 snapshot as excluded and holds no row for that learner", () => {
  const sc = "ps4_released";
  const v = view(sc);
  const ins = viewer(sc, "instructor");
  const snaps = S.releasesFor(v, "ps4", ins);
  assert.ok(snaps.length > 0);
  const last = snaps[snaps.length - 1];
  const html = mainOf(frame({ page: "W50", role: "instructor", scenario: sc }).html);
  assert.ok(html.includes(`Version ${last.version}`) && html.includes("Immutable: not changed by a rubric change"));
  for (const e of last.entries) {
    const name = esc(S.person(v, e.person_id).name);
    assert.deepEqual(rowsWith(html, name).filter((r) => r.includes("would be recalculated")), [], name);
  }
});

test("seg6 authority: W54 instructor shows the Quiz 2 snapshot inline, with no enabled score field", () => {
  const v = view();
  const ins = viewer("default", "instructor");
  const rid = S.anchorFor("W27", "quiz2").record.id;
  const rec = P.receiptById({ view: v, who: ins, sel: S }, rid);
  const snaps = S.releasesFor(v, rec.assessment_id, ins);
  const res = S.resultFor(v, rec.owner_id, rec.assessment_id, ins);
  for (const c of CTX3) {
    const html = mainOf(frame({ page: "W54", role: "instructor", ...c }).html);
    for (const need of [rid, `Version ${snaps[snaps.length - 1].version}`, P.score(res.score, res.max), when(snaps[snaps.length - 1].released_at)]) assert.ok(html.includes(esc(need)), `${c.platform}: ${need}`);
    assert.deepEqual(formControls(html), [], c.platform);
  }
});

test("seg6 authority: every form control on these pages is disabled, except the W57 grading due field and table sort", () => {
  const bad = [];
  for (const page of PAGES) for (const token of tokensOf(page)) for (const role of rolesOf(page)) for (const c of CTX3) {
    for (const tag of formControls(frame({ page, token, role, ...c }).html)) {
      if (/\sdisabled[\s>]/.test(tag) || /data-act="sort"/.test(tag) || (page === "W57" && /type="date"/.test(tag))) continue;
      bad.push(`${page} ${token} ${role} ${c.platform}: ${tag}`);
    }
  }
  assert.deepEqual(bad.slice(0, 10), []);
});

test("seg6 3.10: W52 never shows a letter grade and states that the policy has no boundaries", () => {
  for (const role of rolesOf("W52")) for (const token of tokensOf("W52")) for (const c of CTX3) for (const sc of ["default", "ps4_released"]) {
    assert.doesNotMatch(frame({ page: "W52", token, role, scenario: sc, ...c }).html, /\bgrade:? [A-F][+-]?\b/, `${role} ${token} ${c.platform}`);
  }
  for (const role of rolesOf("W52")) for (const c of CTX3) assert.ok(frame({ page: "W52", role, ...c }).html.includes(esc(NO_BOUNDARIES)), `${role} ${c.platform}`);
});

test("seg6 2.11: only the instructor's W57 has the grading due field", () => {
  for (const c of [CTX5[0], CTX5[2]]) {
    assert.ok(frame({ page: "W57", role: "instructor", ...c }).html.includes('type="date"'), c.platform);
    assert.ok(!frame({ page: "W57", role: "ta", ...c }).html.includes('type="date"'), c.platform);
  }
});

test("seg6 optional: default views have no enabled form control and O01/O03 are student-only", () => {
  assert.deepEqual(rolesOf("O01"), ["student"]);
  assert.deepEqual(rolesOf("O03"), ["student"]);
  for (const page of OPTIONAL) for (const role of rolesOf(page)) for (const c of CTX3) {
    const enabled = formControls(frame({ page, role, ...c }).html).filter((tag) => !/\sdisabled[\s>]/.test(tag));
    assert.deepEqual(enabled, [], `${page} ${role} ${c.platform}`);
  }
});

// ---------- 5. Data mutations ----------
test("seg6 data: W57 with no grading task draws the empty plan; access ending before grading due blocks Apply", () => {
  const none = copy(WB.data);
  none.staff.grading_tasks = [];
  const empty = direct("W57", { role: "instructor", data: none });
  assert.deepEqual(empty.problems, []);
  assert.ok(empty.html.includes(NO_TASKS));
  assert.ok(direct("W57", { role: "instructor", state: "firstUseEmpty" }).html.includes(NO_TASKS));

  const early = copy(WB.data);
  const task = early.staff.grading_tasks[0];
  task.access_end = S.addMinutes(task.grading_due, -24 * 60);
  for (const platform of ["web", "ipad"]) {
    const html = direct("W57", { role: "instructor", data: early, platform }).html;
    assert.ok(html.includes(esc(when(task.access_end))) && html.includes(esc(when(task.grading_due))), platform);
    assert.ok(disabledWith(html, "Access ends before grading is due"), platform);
  }
});

test("seg6 A6: with one expired and one active task a TA sees learners only for the active task", () => {
  const d = copy(WB.data);
  const active = d.staff.grading_tasks[0];
  const quiz = "quiz2";
  const v0 = view();
  const outsider = S.enrolled(v0, courseId(), "student").find((p) => !active.learner_ids.includes(p));
  d.staff.grading_tasks.push({ ...active, id: "task-maya-extra", assessment_id: quiz, learner_ids: [outsider], access_end: S.addMinutes(v0.clock, -60), grading_due: S.addMinutes(v0.clock, -120) });
  const html = mainOf(direct("W57", { role: "ta", data: d }).html);
  for (const p of active.learner_ids) assert.ok(html.includes(esc(S.person(v0, p).name)), p);
  assert.ok(!html.includes(esc(S.person(v0, outsider).name)));
  assert.ok(html.includes(esc(S.assessment(v0, quiz).title)) && html.includes("Access ended"));
  for (const page of ["W58", "W50", "W52"]) {
    const f = direct(page, { role: "ta", data: d });
    assert.deepEqual(f.problems, [], page);
    assert.ok(!mainOf(f.html).includes(esc(S.person(v0, outsider).name)), page);
  }
});

test("seg6 A9: W52 renders for both roles when every result in a category is excused", () => {
  const d = copy(WB.data);
  const cat = d.grades.policy.categories.find((c) => c.id === "labs");
  d.grades.results = d.grades.results.map((r) => (cat.items.includes(r.item_id) ? { ...r, released: { status: "excused", score: null }, pending: null } : r));
  for (const role of rolesOf("W52")) for (const platform of ["web", "iphone"]) {
    const f = direct("W52", { role, data: d, platform });
    assert.deepEqual(f.problems, [], `${role} ${platform}`);
  }
  assert.ok(direct("W52", { role: "instructor", data: d }).html.includes("No calculable grade"));
});

// ---------- 6. Journeys ----------
test("seg6 journeys: J03, J06, J08 and J11 steps on these pages are real and link to the next step", () => {
  let checked = 0;
  for (const jid of ["J03", "J06", "J08", "J11"]) {
    const steps = WB.manifest.journeys.find((j) => j.id === jid).steps;
    steps.forEach((s, i) => {
      if (!PAGES.includes(s.page) || !steps[i + 1]) return;
      for (const c of CTX3) {
        const f = frame({ page: s.page, role: s.role, scenario: s.scenario, token: s.token, ...c });
        assert.ok(!f.html.includes("Not built yet"), `${jid} ${s.page}`);
        assert.ok(goPages(mainOf(f.html)).includes(steps[i + 1].page), `${jid} ${s.page} → ${steps[i + 1].page} ${c.platform}`);
        checked += 1;
      }
    });
  }
  assert.ok(checked >= 15);
});

// ---------- 7. Record-true links (A8, A10) ----------
test("seg6 links: every go resolves, names an existing variant and opens a record the page shows", () => {
  const bad = [];
  for (const page of PAGES) for (const role of rolesOf(page)) for (const c of CTX3) for (const sc of ["default", "ps4_released"]) {
    const allowed = allowedRecords(page, sc);
    for (const token of tokensOf(page)) {
      for (const go of goLinks(mainOf(frame({ page, token, role, scenario: sc, ...c }).html))) {
        const [pv] = go.split("?")[0].split("~");
        const [target, variant] = pv.split(":");
        const entry = WB.manifest.pagesById[target];
        if (!entry) { bad.push(`${page}: unknown ${go}`); continue; }
        if (variant && !Object.hasOwn(WB.pageFor(target).variants, variant)) bad.push(`${page}: no variant ${go}`);
        const rec = recordOfGo(go);
        if (rec && !allowed.includes(rec)) bad.push(`${page} ${role} ${token} ${sc}: ${go} opens ${rec}`);
      }
    }
  }
  assert.deepEqual([...new Set(bad)].slice(0, 10), []);
});

test("seg6 A8: W54 links neither W23 nor W27, and its W53 link is labelled with the anchor title", () => {
  const title = S.assessment(view(), S.anchorFor("W53").record.id).title;
  for (const role of rolesOf("W54")) for (const token of tokensOf("W54")) for (const c of CTX3) {
    const html = mainOf(frame({ page: "W54", token, role, ...c }).html);
    const targets = goPages(html);
    assert.ok(!targets.includes("W23") && !targets.includes("W27"), `${role} ${token} ${c.platform}`);
    for (const m of html.matchAll(/data-go="W53[^"]*"[^>]*>([^<]*)</g)) assert.ok(m[1].includes(esc(title)), m[1]);
  }
  assert.ok(goPages(mainOf(frame({ page: "W54", role: "instructor" }).html)).includes("W53"));
});

// ---------- Fix round 1 ----------
const dockOf = (html) => (html.match(/aria-label="Protective actions">([\s\S]*?)<\/div>/) || ["", ""])[1];
const reviewCtx = (page) => [CTX5[2], CTX5[4]].filter((c) => WB.manifest.pagesById[page].platforms[c.platform] === "review");

test("R01: W50, W52 and W54 deny an instructor whose course enrollment is gone and show no learner data", () => {
  const data = copy(WB.data);
  const inst = viewer("default", "instructor").personId;
  data.world.enrollments = data.world.enrollments.filter((e) => !(e.person_id === inst && e.role === "instructor"));
  for (const page of ["W50", "W52", "W54"]) for (const platform of ["web", "iphone"]) {
    const r = direct(page, { role: "instructor", data, platform });
    assert.deepEqual(r.problems, [], `${page} ${platform}`);
    assert.ok(r.html.includes("You are not teaching this course"), `${page} ${platform}`);
    for (const n of studentNames()) assert.ok(!r.html.includes(esc(n)), `${page} ${platform} ${n}`);
  }
});

test("R09: W50 calls a marked draft with an incomplete review affected, never unscored; a learner with no draft stays unscored", () => {
  const v = view();
  const inst = viewer("default", "instructor");
  const item = v.data.coursework.assessments.find((x) => x.rubric_id === S.anchorFor("W50").record.id);
  const rows = S.releaseReady(v, item.id, inst);
  const marked = rows.find((r) => r.included).personId;
  const unscored = rows.find((r) => !r.included && !S.gradeDraftFor(v, r.personId, item.id, inst)).personId;
  const data = copy(WB.data);
  data.grades.grade_drafts.find((d) => d.person_id === marked && d.assessment_id === item.id).review_complete = false;
  const total = S.draftTotal(S.buildView(data, "default"), marked, item.id, inst);
  for (const platform of ["web", "iphone"]) {
    const html = direct("W50", { role: "instructor", data, platform }).html;
    const row = rowsWith(html, esc(S.person(v, marked).name)).join("");
    assert.ok(row.includes("Marked, review not complete") && row.includes(esc(P.score(total.score, total.max))), platform);
    assert.ok(!row.includes("Not scored yet"), platform);
    assert.ok(rowsWith(html, esc(S.person(v, unscored).name)).join("").includes("Not scored yet"), platform);
  }
});

test("R06: W50, W52, W54 and W57 review-tier protective actions are disabled offline (W50 and W52 also in conflict)", () => {
  const cases = [
    ["W50", "offline", "You're offline"], ["W50", "conflict", "Refresh the impact first"], ["W52", "offline", "You're offline"],
    ["W52", "conflict", "Recompute the preview first"], ["W54", "offline", "You're offline"], ["W57", "offline", "You're offline"],
  ];
  for (const [page, token, reason] of cases) for (const c of reviewCtx(page)) {
    const dock = dockOf(frame({ page, role: "instructor", token, ...c }).html);
    assert.ok(dock.includes(esc(PROTECTIVE[page])) && dock.includes('aria-disabled="true"') && dock.includes(esc(reason)), `${page} ${token} ${c.platform}`);
    assert.ok(!dockOf(frame({ page, role: "instructor", ...c }).html).includes('aria-disabled="true"'), `${page} default ${c.platform}`);
  }
  for (const page of ["W50", "W57"]) for (const c of reviewCtx(page)) {
    const dock = dockOf(frame({ page, role: "ta", token: "offline", ...c }).html);
    assert.ok(dock.includes('aria-disabled="true"') && dock.includes(esc("You're offline")), `${page} TA ${c.platform}`);
  }
});

test("INSP2-02: disjoint allocations keep assessment-wide progress outside individual rows", () => {
  const data = copy(WB.data);
  const task = data.staff.grading_tasks[0];
  const enrollment = data.world.enrollments.find((e) => e.person_id === task.ta_id && e.role === "ta");
  const secondId = `${task.ta_id}-second`;
  const person = data.world.people.find((p) => p.id === task.ta_id);
  data.world.people.push({ ...person, id: secondId, name: "Second teaching assistant" });
  data.world.enrollments.push({ ...enrollment, person_id: secondId });
  const learners = S.enrolled(view(), courseId(), "student");
  task.learner_ids = [learners[0]];
  data.staff.grading_tasks.push({ ...task, id: `${task.id}-second`, ta_id: secondId, learner_ids: [learners[1]] });
  for (const platform of ["web", "ipad"]) {
    const result = direct("W57", { role: "instructor", data, platform });
    assert.deepEqual(result.problems, []);
    const rows = rowsWith(result.html, esc(S.assessment(view(), task.assessment_id).title));
    assert.equal(rows.length, 2);
    for (const row of rows) assert.ok(!row.includes("received") && !row.includes("reviewed"));
    assert.ok(result.html.includes("Assessment-wide progress"));
    const got = S.receivedProgress(view(), task.assessment_id, viewer("default", "instructor"));
    assert.ok(result.html.includes(`${got.received} of ${got.of} received`));
  }
});
