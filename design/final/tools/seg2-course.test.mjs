// Phase 3 seg2-course tests (plan segment seg2-course Step 9; amendments A1, A4, A6, A10): W05, W06, W07, W15,
// W16, W17 and W32. Render matrix, definitions, authority, state content, role-safe and record-true links and
// the journeys. Every expected figure is read from WB.sel here, never typed. Source checks only, not browser,
// device or accessibility acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import {
  WB, S, P, esc, SCENARIOS, CTX3, CTX5, view, viewer, title, when, copy, frame, direct, tokensOf, rolesOf,
  mainOf, idsInMain, goLinks, goPages, disabledWith, studentNames,
} from "./spine_helpers.mjs";

const SEG = ["W05", "W06", "W07", "W15", "W16", "W17", "W32"];
const ENDED = "Your grading access for this course has ended";
const NO_TASK = "No grading is allocated to you";
const PS4 = "ps4";
const ASSESSMENT_PAGES = ["W19", "W25", "W48", "W53"];
const fail = (list, label, problems) => { if (problems.length) list.push(`${label}: ${problems.slice(0, 3).join("; ")}`); };

// A1: every go target lists the frame's role, and a token after ":" is a state or variant of the target.
function roleSafeLinks(html, role) {
  const bad = [];
  for (const g of goLinks(html)) {
    const [page, rest] = g.split("?")[0].split("~")[0].split(":");
    const target = WB.manifest.pagesById[page];
    if (!target) { bad.push(`${g}: unknown page`); continue; }
    if (!target.roles.includes(role)) bad.push(`${g}: not for ${role}`);
    if (rest !== undefined) {
      const e = WB.pageFor(page);
      if (!e.states.includes(rest) && !Object.hasOwn(e.variants, rest)) bad.push(`${g}: unknown token`);
    }
  }
  return bad;
}

// A10: a link labelled with an assessment title opens the page view anchored on that same assessment.
function recordFalseLinks(html, sc) {
  const titles = new Map(view(sc).data.coursework.assessments.map((x) => [esc(x.title), x.id]));
  const bad = [];
  for (const m of html.matchAll(/data-go="([^"]+)"[^>]*>([^<]+)<\/a>/g)) {
    const [go, label] = [m[1], m[2]];
    const [page, variant] = go.split("?")[0].split("~")[0].split(":");
    if (!ASSESSMENT_PAGES.includes(page) || !titles.has(label)) continue;
    const anchor = S.anchorFor(page, variant || null);
    if (!anchor || anchor.record.type !== "assessment" || anchor.record.id !== titles.get(label)) bad.push(`${go} labelled ${label}`);
  }
  return bad;
}

function checkOne(bad, vs) {
  const label = `${vs.page} ${vs.platform}/${vs.width || vs.orientation || ""} ${vs.role} ${vs.token || "default"} ${vs.scenario}`;
  try {
    const f = frame(vs);
    const problems = [...f.problems];
    if (f.html.includes("Not built yet")) problems.push("placeholder text");
    if (f.html.includes("wb-handoff")) problems.push("handoff on a full tier");
    if (f.blocked) problems.push("role blocked");
    for (const id of idsInMain(f.html)) if (!id.startsWith("t-")) problems.push(`id ${id} outside the frame ns`);
    problems.push(...roleSafeLinks(f.html, vs.role), ...recordFalseLinks(f.html, vs.scenario));
    fail(bad, label, problems);
  } catch (err) {
    bad.push(`${label} threw: ${err.message}`);
  }
}

// ---------- Structure ----------
test("structure: the seven seg2 pages are real, cover all 16 states and draw their failure states", () => {
  const all = WB.manifest.states.map((s) => s.id);
  for (const id of SEG) {
    const e = WB.pageFor(id);
    assert.equal(e.placeholder, false, id);
    for (const s of all) assert.ok(e.states.includes(s) || Object.hasOwn(e.na, s), `${id} ${s}`);
    for (const r of Object.values(e.na)) assert.ok(r.length > 0 && r.length <= 140, id);
  }
  for (const f of WB.data.scenarios.failures) for (const id of f.pages.filter((p) => SEG.includes(p))) assert.ok(WB.pageFor(id).states.includes(f.state), `${id} ${f.state}`);
  assert.ok(Object.hasOwn(WB.pageFor("W07").variants, "add-event"));
  for (const id of ["W14", "W18"]) assert.equal(WB.pageFor(id).placeholder, false, id);
});

// ---------- Render matrix ----------
test("render: every seg2 page renders cleanly for each context, role and token at default", () => {
  const bad = [];
  for (const page of SEG) for (const token of tokensOf(page)) for (const c of CTX5) for (const role of rolesOf(page)) checkOne(bad, { page, token, scenario: "default", role, ...c });
  assert.deepEqual(bad.slice(0, 20), []);
});

test("render: every seg2 default view renders for every scenario and role on three platforms", () => {
  const bad = [];
  for (const page of SEG) for (const scenario of SCENARIOS) for (const role of rolesOf(page)) for (const c of CTX3) checkOne(bad, { page, scenario, role, ...c });
  assert.deepEqual(bad.slice(0, 20), []);
});

// ---------- Authority ----------
function heldValues(sc) {
  const v = view(sc);
  const ins = viewer(sc, "instructor");
  const st = viewer(sc, "student");
  const d = S.gradeDraftFor(v, st.personId, PS4, ins);
  const dt = S.draftTotal(v, st.personId, PS4, ins);
  const insTotal = S.courseTotal(v, st.courseId, st.personId, ins).display;
  const stTotal = S.courseTotal(v, st.courseId, st.personId, st).display;
  return {
    comments: d ? [d.overall_comment, ...Object.values(d.comments)].filter(Boolean) : [],
    score: dt ? P.score(dt.score, dt.max) : null,
    total: insTotal !== stTotal ? insTotal : null,
  };
}

test("authority: student W05, W07 and W32 show no held score, comment, staff total or staff status", () => {
  const h = heldValues("default");
  assert.ok(h.score && h.comments.length);
  for (const page of ["W05", "W07", "W32"]) for (const token of tokensOf(page)) for (const c of CTX3) {
    const html = frame({ page, token, role: "student", ...c }).html;
    const label = `${page} ${token} ${c.platform}`;
    assert.ok(!html.includes(esc(h.score)), `${label} score`);
    for (const cm of h.comments) assert.ok(!html.includes(esc(cm)), `${label} comment`);
    if (h.total) assert.ok(!html.includes(h.total), `${label} total`);
    for (const k of ["held", "graded"]) assert.ok(!html.includes(`>${esc(WB.STATUS[k].label)}<`), `${label} ${k}`);
  }
});

test("authority: W05 release and builder links are the instructor's; staff never reach student-only pages", () => {
  for (const c of CTX3) {
    const ta = goPages(mainOf(frame({ page: "W05", role: "ta", ...c }).html));
    assert.ok(!ta.includes("W53") && !ta.includes("W35"), c.platform);
    assert.ok(goPages(mainOf(frame({ page: "W05", role: "instructor", ...c }).html)).includes("W53"), c.platform);
  }
  const bad = [];
  for (const page of SEG) for (const role of ["instructor", "ta"]) for (const token of tokensOf(page)) {
    const gp = goPages(mainOf(frame({ page, token, role }).html));
    for (const p of ["W22", "W33", "W34"]) if (gp.includes(p)) bad.push(`${page} ${role} ${token} ${p}`);
  }
  assert.deepEqual(bad, []);
});

test("authority: at ta_expired the TA sees the ended notice on W05 and no grading links; course content stays", () => {
  const sc = "ta_expired";
  const v = view(sc);
  const ta = viewer(sc, "ta");
  const end = S.accessEnd(v, ta.personId, ta.courseId);
  for (const c of CTX3) {
    const html = frame({ page: "W05", role: "ta", scenario: sc, ...c }).html;
    assert.ok(html.includes(esc(ENDED)) && html.includes(esc(when(end))), c.platform);
    for (const n of studentNames(sc)) assert.ok(!html.includes(esc(n)), `${c.platform} ${n}`);
    assert.ok(!goPages(html).includes("W48"), c.platform);
    assert.ok(disabledWith(html, "Your grading access has ended"), c.platform);
    for (const page of ["W07", "W32"]) assert.ok(!goPages(mainOf(frame({ page, role: "ta", scenario: sc, ...c }).html)).includes("W48"), `${page} ${c.platform}`);
  }
  const current = S.currentModule(v, ta.courseId);
  const course = S.course(v, ta.courseId);
  assert.ok(frame({ page: "W16", role: "ta", scenario: sc }).html.includes(esc(current.title)));
  assert.ok(frame({ page: "W17", role: "ta", scenario: sc }).html.includes(esc(current.title)));
  assert.ok(frame({ page: "W15", role: "ta", scenario: sc }).html.includes(esc(S.person(v, S.enrolled(v, ta.courseId, "instructor")[0]).name)));
  assert.ok(frame({ page: "W06", role: "ta", scenario: sc }).html.includes(esc(course.code)));
});

test("authority: a TA with no grading task sees the empty queue text, not the ended notice", () => {
  const data = copy(WB.data);
  data.staff.grading_tasks = [];
  for (const platform of ["web", "ipad", "iphone"]) {
    const f = direct("W05", { role: "ta", platform, data });
    assert.deepEqual(f.problems, [], platform);
    assert.ok(f.html.includes(esc(NO_TASK)) && !f.html.includes(esc(ENDED)), platform);
    assert.ok(!goPages(mainOf(f.html)).includes("W48"), platform);
  }
});

test("A6: with one expired and one active task, only the active task shows progress or grading links", () => {
  const data = copy(WB.data);
  const base = data.staff.grading_tasks[0];
  data.staff.grading_tasks.push({ ...base, id: "task-maya-lab1", assessment_id: "lab1", grading_due: "2026-10-12T17:00:00-04:00", access_end: "2026-10-14T23:59:00-04:00" });
  const v = view();
  const ta = viewer("default", "ta");
  const progress = S.reviewProgress(v, PS4, ta);
  for (const platform of ["web", "iphone"]) {
    const f = direct("W05", { role: "ta", platform, data });
    assert.deepEqual(f.problems, [], platform);
    assert.ok(f.html.includes(esc(title("lab1"))) && f.html.includes("Access ended"), platform);
    assert.equal(f.html.split("You have reviewed").length - 1, 1, platform);
    assert.ok(f.html.includes(esc(`You have reviewed ${progress.reviewed} of ${progress.of}`)), platform);
    for (const n of studentNames()) assert.ok(!f.html.includes(esc(n)), platform);
    const cal = direct("W07", { role: "ta", platform, data });
    assert.deepEqual(cal.problems, [], platform);
    assert.deepEqual(goLinks(mainOf(cal.html)).filter((g) => g.startsWith("W48")), ["W48"], platform);
  }
});

test("authority: the private event is the owner's only, on W07; W32 never lists it", () => {
  const name = esc(S.calendarEvents(view()).find((e) => e.visibility === "private").name);
  for (const c of CTX3) {
    assert.ok(mainOf(frame({ page: "W07", role: "student", ...c }).html).includes(name), c.platform);
    for (const role of ["instructor", "ta"]) assert.ok(!frame({ page: "W07", role, ...c }).html.includes(name), `${role} ${c.platform}`);
    for (const role of rolesOf("W32")) assert.ok(!frame({ page: "W32", role, ...c }).html.includes(name), `W32 ${role} ${c.platform}`);
  }
});

test("authority: course-event and policy-editing controls are the instructor's only", () => {
  for (const role of rolesOf("W32")) {
    const html = frame({ page: "W32", role }).html;
    assert.equal(html.includes("New course event"), role === "instructor", role);
    const gp = goPages(mainOf(frame({ page: "W15", role }).html));
    assert.equal(gp.includes("W52"), role === "instructor", `W15 ${role} W52`);
    assert.equal(gp.includes("W36"), role === "instructor", `W15 ${role} W36`);
  }
});

test("authority: W15 shows grade item titles and maxima, never a score", () => {
  const v = view();
  const st = viewer("default", "student");
  const ins = viewer("default", "instructor");
  const staffRows = S.gradeRows(v, st.courseId, st.personId, ins);
  const ownRows = S.gradeRows(v, st.courseId, st.personId, st);
  const scores = [...staffRows, ...ownRows].flatMap((r) => [r.staffOutcome && r.staffOutcome.score, r.score]
    .filter((x) => x !== null && x !== undefined).map((x) => esc(P.score(x, r.max))));
  assert.ok(scores.length > 0);
  for (const role of rolesOf("W15")) for (const c of CTX3) {
    const html = frame({ page: "W15", role, ...c }).html;
    for (const s of scores) assert.ok(!html.includes(s), `${role} ${c.platform} ${s}`);
  }
  for (const [role, rows] of [["student", ownRows], ["instructor", staffRows]]) {
    const html = frame({ page: "W15", role }).html;
    for (const r of rows) assert.ok(html.includes(esc(r.title)), `${role} ${r.title}`);
  }
});

test("A4: an unpublished item appears on no student list (W05, W16, W17)", () => {
  const data = copy(WB.data);
  data.coursework.assessments.find((x) => x.id === PS4).published = false;
  const name = esc(title(PS4));
  for (const scenario of ["default", "assignment_submission"]) for (const page of ["W05", "W16", "W17"]) {
    const f = direct(page, { role: "student", scenario, data });
    assert.deepEqual(f.problems, [], `${page} ${scenario}`);
    assert.ok(!f.html.includes(name), `${page} ${scenario}`);
  }
  assert.ok(frame({ page: "W16", role: "student", scenario: "assignment_submission" }).html.includes(name));
});

// ---------- State content ----------
test("states: W07 device denial keeps the agenda; offline W07 and W32 carry the last-known flag", () => {
  const office = esc(S.calendarEvents(view()).find((e) => e.kind === "officeHours").name);
  for (const c of CTX3) {
    const denied = frame({ page: "W07", token: "deviceDenied", role: "student", ...c }).html;
    assert.ok(denied.includes("Browser notifications are blocked") && denied.includes(office), c.platform);
    assert.ok(goPages(mainOf(denied)).includes("W08"), c.platform);
    for (const page of ["W07", "W32"]) for (const role of rolesOf(page)) {
      assert.ok(frame({ page, token: "offline", role, ...c }).html.includes(esc(WB.FLAGS.lastKnown.label)), `${page} ${role} ${c.platform}`);
    }
  }
});

test("states: W16 shows when the locked module opens; notYetAvailable says when every module is open", () => {
  const v = view();
  const st = viewer("default", "student");
  const later = v.data.coursework.modules.filter((m) => m.course_id === st.courseId && S.isBefore(v.clock, m.starts));
  assert.ok(later.length > 0);
  for (const c of CTX3) {
    const html = frame({ page: "W16", role: "student", ...c }).html;
    for (const m of later) {
      assert.ok(html.includes(esc(when(m.starts))), c.platform);
      const body = html.slice(html.indexOf(`id="t-c-m-${m.id}"`));
      assert.ok(!body.slice(0, body.indexOf("</details>")).includes("data-go"), c.platform);
    }
    const locked = frame({ page: "W16", token: "notYetAvailable", role: "student", ...c }).html;
    assert.ok(locked.includes(esc(later[0].title)) && locked.includes(esc(when(later[0].starts))), c.platform);
    assert.ok(frame({ page: "W16", token: "notYetAvailable", role: "student", scenario: "ps4_released", ...c }).html.includes("Every module is open at this point"));
    assert.ok(frame({ page: "W17", token: "notYetAvailable", role: "student", scenario: "ps4_released", ...c }).html.includes("No module is locked at this point"));
  }
});

test("states: W17 lists announcement files only once they are published, with a W29 link", () => {
  const v = view();
  const ann = v.data.comms.announcements.find((x) => x.attachments.length);
  const file = esc(ann.attachments[0].name);
  for (const c of CTX3) {
    assert.ok(!frame({ page: "W17", role: "student", scenario: "assignment_submission", ...c }).html.includes(file), c.platform);
    const html = frame({ page: "W17", role: "student", ...c }).html;
    assert.ok(html.includes(file), c.platform);
    assert.ok(goLinks(mainOf(html)).includes(P.recordGo("W29", "announcement", ann.id)), c.platform);
  }
});

test("states: W07 dialogs open for add-event, invalid and (owner only) destructive", () => {
  for (const c of CTX3) {
    for (const token of ["add-event", "invalid"]) assert.deepEqual(frame({ page: "W07", token, role: "student", ...c }).openDialogs, ["t-c-event"], `${token} ${c.platform}`);
    assert.ok(frame({ page: "W07", token: "invalid", role: "student", ...c }).html.includes("End must be after start"));
    assert.deepEqual(frame({ page: "W07", role: "student", ...c }).openDialogs, [], c.platform);
    assert.deepEqual(frame({ page: "W07", token: "destructive", role: "student", ...c }).openDialogs, ["t-c-delete"], c.platform);
    const ins = frame({ page: "W07", token: "destructive", role: "instructor", ...c });
    assert.deepEqual(ins.openDialogs, [], c.platform);
    assert.ok(ins.html.includes("You have no private event in this period"), c.platform);
  }
});

test("states: W06 Past lists the student's archived course read-only and is empty for staff", () => {
  const v = view();
  const st = viewer("default", "student");
  const past = v.data.world.enrollments.find((e) => e.person_id === st.personId && e.role === "student").course_ids
    .map((id) => S.course(v, id)).filter((x) => x.archived);
  assert.ok(past.length > 0);
  for (const c of CTX3) {
    const html = frame({ page: "W06", token: "archived", role: "student", ...c }).html;
    for (const x of past) assert.ok(html.includes(esc(x.code)), c.platform);
    assert.ok(html.includes(esc(WB.FLAGS.readOnly.label)), c.platform);
    for (const role of ["instructor", "ta"]) assert.ok(frame({ page: "W06", token: "archived", role, ...c }).html.includes("No past courses in your history"), `${role} ${c.platform}`);
  }
});

test("states: W05 TA progress and access end come from the task; instructor progress from the selectors", () => {
  const v = view();
  const ta = viewer("default", "ta");
  const ins = viewer("default", "instructor");
  const end = S.accessEnd(v, ta.personId, ta.courseId);
  const got = S.receivedProgress(v, PS4, ins);
  for (const c of CTX3) {
    const t = frame({ page: "W05", role: "ta", ...c }).html;
    assert.ok(t.includes(esc(when(end))) && goLinks(mainOf(t)).includes("W48"), c.platform);
    assert.ok(frame({ page: "W05", role: "instructor", ...c }).html.includes(esc(`${got.received} of ${got.of}`)), c.platform);
  }
});

// ---------- Journeys ----------
function stepFrame(step, c) {
  return frame({ page: step.page, role: step.role, scenario: step.scenario, token: step.token, ...c });
}

test("journeys: every seg2 step of J01, J02, J08, J10 and J12 renders cleanly", () => {
  for (const jid of ["J01", "J02", "J08", "J10", "J12"]) {
    for (const step of WB.manifest.journeys.find((j) => j.id === jid).steps.filter((s) => SEG.includes(s.page))) {
      for (const c of CTX3) {
        const f = stepFrame(step, c);
        assert.deepEqual(f.problems, [], `${jid} ${step.page} ${c.platform}`);
        assert.ok(!f.html.includes("Not built yet"), `${jid} ${step.page}`);
      }
    }
  }
});

test("journeys: each seg2 step links on to the next step's page", () => {
  const pairs = [["J02", "W06", "W14"], ["J02", "W16", "W17"], ["J02", "W17", "W18"], ["J08", "W05", "W07"], ["J08", "W07", "W48"], ["J10", "W32", "W07"], ["J10", "W07", "W08"], ["J12", "W06", "W59"]];
  for (const [jid, from, to] of pairs) {
    const step = WB.manifest.journeys.find((j) => j.id === jid).steps.find((s) => s.page === from);
    for (const c of CTX3) assert.ok(goPages(mainOf(stepFrame(step, c).html)).includes(to), `${jid} ${from}→${to} ${c.platform}`);
  }
  const w14 = WB.manifest.journeys.find((j) => j.id === "J02").steps.find((s) => s.page === "W14");
  for (const c of CTX3) assert.ok(goPages(stepFrame(w14, c).html).includes("W16"), c.platform);
});

// ---------- Fix round 1 ----------
const recentActivity = (html) => (html.match(/<ul class="wb-list" aria-label="Recent activity">[\s\S]*?<\/ul>/) || [""])[0];

test("R02: W05 shows no activity for an unpublished assessment or a draft announcement, keeping the others", () => {
  const v = view();
  const ann = v.data.comms.announcements.find((x) => x.id === S.anchorFor("W29").record.id);
  const annTitle = ann.revisions[ann.revisions.length - 1].title;
  const q2Id = WB.data.coursework.receipts.find((r) => r.id === S.anchorFor("W27", "quiz2").record.id).assessment_id;
  const q2 = title(q2Id);
  const before = recentActivity(direct("W05", { role: "student" }).html);
  assert.ok(before.includes(esc(q2)) && before.includes(esc(annTitle)), "precondition");
  const data = copy(WB.data);
  data.coursework.assessments.find((x) => x.id === q2Id).published = false;
  data.comms.announcements.find((x) => x.id === ann.id).state = "draft";
  for (const platform of ["web", "iphone"]) {
    const list = recentActivity(direct("W05", { role: "student", data, platform }).html);
    assert.ok(!list.includes(esc(q2)) && !list.includes(esc(annTitle)), platform);
    assert.ok(!list.includes("a course item") && !list.includes('data-go="W27:quiz2"'), platform);
    assert.ok(list.includes("New reply"), platform);
  }
});

test("R02: W05 drops a TA's receipt activity when that task has expired while another task is active", () => {
  const data = copy(WB.data);
  const base = data.staff.grading_tasks[0];
  const ps4 = title(base.assessment_id);
  base.access_end = S.addMinutes(view().clock, -60);
  data.staff.grading_tasks.unshift({ ...base, id: `${base.id}-quiz`, assessment_id: S.anchorFor("W25").record.id, access_end: S.addMinutes(view().clock, 60 * 24 * 7) });
  for (const platform of ["web", "iphone"]) {
    const r = direct("W05", { role: "ta", data, platform });
    assert.deepEqual(r.problems, [], platform);
    assert.ok(!recentActivity(r.html).includes(esc(ps4)), platform);
  }
});
