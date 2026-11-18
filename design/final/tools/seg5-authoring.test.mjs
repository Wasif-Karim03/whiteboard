// Phase 3 segment 5 (authoring: W35–W46, W59, W60) tests. Plan seg5-authoring §3 Step 3 with amendments A1, A5, A6
// and A10. Every expected value is read from WB.sel or the fixtures here, never typed. Source checks only, not
// browser, device or accessibility acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import {
  WB, S, P, esc, SCENARIOS, CTX3, CTX5, view, viewer, copy, when, frame, direct, tokensOf, rolesOf, count,
  idsInMain, goLinks, goPages, disabledWith, mainOf, studentIds, courseId,
} from "./spine_helpers.mjs";

const SEG = WB.manifest.pages.filter((p) => p.segment === 5).map((p) => p.id);
const DENIED_TA = ["W42", "W59", "W60"];
const HANDOFF_PAGES = ["W42", "W60"];
const REVIEW_PAGES = SEG.filter((id) => !HANDOFF_PAGES.includes(id));
const NEVER = ["W22", "W33", "W34"];
const fail = (list, label, problems) => { if (problems.length) list.push(`${label}: ${problems.slice(0, 3).join("; ")}`); };
const ta = (sc = "default") => viewer(sc, "ta");
const anchorRecord = (go) => {
  const [page, variant] = go.split("~")[0].split(":");
  const a = WB.manifest.anchors[page];
  if (!a) return null;
  return variant ? (a.variants[variant] || {}).record || null : a.record;
};

// A1: a page link never changes identity, so every go target allows the frame's current role.
function roleSafeLinks(html, role) {
  return [...new Set(goPages(html))].filter((p) => !WB.manifest.pagesById[p].roles.includes(role)).map((p) => `link to ${p} not allowed for ${role}`);
}

function checkOne(bad, vs) {
  const label = `${vs.page} ${vs.platform}/${vs.width || vs.orientation || ""} ${vs.role} ${vs.token || "default"} ${vs.scenario || "default"}`;
  try {
    const f = frame(vs);
    const problems = [...f.problems, ...roleSafeLinks(f.html, vs.role)];
    if (f.html.includes("Not built yet")) problems.push("placeholder text");
    if (f.blocked) problems.push("role blocked");
    for (const id of idsInMain(f.html)) if (!id.startsWith("t-")) problems.push(`id ${id} outside the frame ns`);
    for (const p of goPages(f.html)) if (NEVER.includes(p)) problems.push(`links ${p}`);
    fail(bad, label, problems);
  } catch (err) {
    bad.push(`${label} threw: ${err.message}`);
  }
}

// ---------- 1. Structure ----------
test("structure: the 14 authoring pages are real, with short N/A reasons, W60 invalid and W40 motion", () => {
  assert.equal(SEG.length, 14);
  for (const id of SEG) assert.equal(WB.pageFor(id).placeholder, false, id);
  for (const id of SEG) for (const r of Object.values(WB.pageFor(id).na)) assert.ok(r.length > 0 && r.length <= 140, id);
  assert.ok(WB.pageFor("W60").states.includes("invalid"));
  assert.ok(Object.hasOwn(WB.pageFor("W40").variants, "motion"));
});

// ---------- 2. Render matrix (with the A1 role-safe link check) ----------
test("render: every page × 5 contexts × role × token at default renders cleanly with role-safe links", () => {
  const bad = [];
  for (const page of SEG) for (const token of tokensOf(page)) for (const c of CTX5) for (const role of rolesOf(page)) checkOne(bad, { page, token, role, ...c });
  assert.deepEqual(bad.slice(0, 20), []);
});

test("render: every page's default view × every scenario × role on 3 platforms renders cleanly", () => {
  const bad = [];
  for (const page of SEG) for (const scenario of SCENARIOS) for (const role of rolesOf(page)) for (const c of CTX3) checkOne(bad, { page, scenario, role, ...c });
  assert.deepEqual(bad.slice(0, 20), []);
});

// ---------- 3. Tiers ----------
test("tiers: W42 and W60 off web are handoff only; review pages carry no editor on iPhone; web instructor has no handoff", () => {
  for (const page of HANDOFF_PAGES) for (const platform of ["ipad", "iphone"]) for (const role of rolesOf(page)) {
    const m = mainOf(frame({ page, role, platform }).html);
    assert.ok(m.includes("wb-handoff--handoff"), `${page} ${platform} ${role}`);
    for (const tag of ["<table", "<input", "<textarea"]) assert.ok(!m.includes(tag), `${page} ${platform} ${role} ${tag}`);
  }
  for (const page of REVIEW_PAGES) for (const role of rolesOf(page)) {
    const m = mainOf(frame({ page, role, platform: "iphone" }).html);
    assert.ok(m.includes("wb-handoff--review"), `${page} ${role}`);
    assert.ok(!m.includes("<textarea"), `${page} ${role}`);
  }
  for (const page of SEG) assert.ok(!frame({ page, role: "instructor" }).html.includes("wb-handoff"), page);
  const revoke = frame({ page: "W45", role: "instructor", platform: "iphone" }).html;
  assert.ok(revoke.includes('data-act="open-dialog"') && revoke.includes("Revoke access"));
  const end = frame({ page: "W46", role: "instructor", platform: "iphone" }).html;
  assert.ok(end.includes('data-act="open-dialog"') && end.includes("End allowance"));
});

// ---------- 4. Role blocks ----------
test("roles: students and guests are blocked on all 14 pages", () => {
  for (const page of SEG) for (const role of ["student", "guest"]) assert.equal(frame({ page, role }).blocked, true, `${page} ${role}`);
});

// ---------- 5. TA authority ----------
test("TA: no authoring, publishing, hiding, revoking, inviting or learner-preview control on any page or platform", () => {
  const banned = ["Preview as learner", "Publish", "Save draft", "Hide from learners", "Revoke", "Invite", 'data-act="open-dialog"'];
  const bad = [];
  for (const page of SEG) for (const token of tokensOf(page)) for (const c of CTX5) {
    const html = frame({ page, token, role: "ta", ...c }).html;
    for (const b of banned) if (html.includes(b)) bad.push(`${page} ${token} ${c.platform} has ${b}`);
    for (const p of goPages(html)) if ([...DENIED_TA, ...NEVER].includes(p)) bad.push(`${page} ${token} ${c.platform} links ${p}`);
  }
  assert.deepEqual(bad.slice(0, 20), []);
});

test("TA: W42, W59 and W60 show the not-available notice on every token and platform", () => {
  for (const page of DENIED_TA) for (const token of tokensOf(page)) for (const c of CTX3) {
    const html = frame({ page, token, role: "ta", ...c }).html;
    assert.ok(html.includes("This is not available for your course role"), `${page} ${token} ${c.platform}`);
  }
});

test("TA: after access ends every page shows only the ended notice and no learner names", () => {
  const names = studentIds("ta_expired").map((id) => S.person(view("ta_expired"), id).name);
  for (const page of SEG) for (const c of CTX3) {
    const html = frame({ page, role: "ta", scenario: "ta_expired", ...c }).html;
    assert.ok(html.includes("Your grading access for this course has ended"), `${page} ${c.platform}`);
    for (const n of names) assert.ok(!html.includes(esc(n)), `${page} ${c.platform} ${n}`);
  }
});

test("TA: W45 shows only the TA's own scope (assigned learners, not the others)", () => {
  const v = view();
  const task = S.gradingTaskFor(v, ta().personId);
  const scope = S.taScope(v, task.assessment_id, ta());
  const others = studentIds().filter((id) => !scope.learnerIds.includes(id));
  assert.ok(others.length > 0);
  for (const c of CTX3) {
    const html = frame({ page: "W45", role: "ta", ...c }).html;
    for (const id of scope.learnerIds) assert.ok(html.includes(esc(S.person(v, id).name)), `${c.platform} ${id}`);
    for (const id of others) assert.ok(!html.includes(esc(S.person(v, id).name)), `${c.platform} ${id}`);
  }
});

function quizTaskData(learnerIds) {
  const data = copy(WB.data);
  const base = data.staff.grading_tasks[0];
  const quizId = S.anchorFor("W41").record.id;
  const quiz = S.quiz(view(), S.assessment(view(), quizId).quiz_id);
  data.staff.grading_tasks.push({
    ...base, id: `${base.id}-quiz`, assessment_id: quizId, learner_ids: learnerIds,
    question_ids: quiz.items.map((x) => (typeof x === "string" ? x : x.id)),
  });
  return data;
}

test("TA: W46 never shows the allowance basis or note; with a quiz task it shows only the effective time", () => {
  const v = view();
  const quizId = S.anchorFor("W41").record.id;
  const learner = viewer("default", "student").personId;
  const al = S.allowanceFor(v, quizId, learner);
  for (const c of CTX3) {
    const html = frame({ page: "W46", role: "ta", ...c }).html;
    assert.ok(!html.includes(al.basis_reference_instructor_only) && !html.includes(esc(al.note)), c.platform);
  }
  const data = quizTaskData([learner]);
  for (const platform of ["web", "iphone"]) {
    const html = direct("W46", { role: "ta", data, platform }).html;
    assert.ok(html.includes(`Effective time: ${S.effectiveMinutes(v, quizId, learner)} minutes`), platform);
    assert.ok(!html.includes(al.basis_reference_instructor_only) && !html.includes(esc(al.note)), platform);
  }
});

test("TA: W41 draws no answer-key section", () => {
  for (const token of tokensOf("W41")) for (const c of CTX3) assert.ok(!frame({ page: "W41", token, role: "ta", ...c }).html.includes("Answer key"), `${token} ${c.platform}`);
});

// ---------- A6: per-task TA access ----------
test("A6: with one expired and one active task, TA pages show learners only for the active task", () => {
  const v = view();
  const learner = viewer("default", "student").personId;
  const data = quizTaskData([learner]);
  data.staff.grading_tasks[0].access_end = S.addMinutes(v.clock, -60);
  data.staff.grading_tasks[1].access_end = S.addMinutes(v.clock, 60 * 24 * 7);
  const expiredOnly = data.staff.grading_tasks[0].learner_ids.filter((id) => id !== learner);
  const psTitle = S.assessment(v, data.staff.grading_tasks[0].assessment_id).title;
  for (const page of ["W43", "W44", "W45", "W46"]) for (const platform of ["web", "iphone"]) {
    const r = direct(page, { role: "ta", data, platform });
    assert.deepEqual(r.problems, [], `${page} ${platform}`);
    for (const id of expiredOnly) assert.ok(!r.html.includes(esc(S.person(v, id).name)), `${page} ${platform} ${id}`);
  }
  const w45 = direct("W45", { role: "ta", data }).html;
  assert.ok(w45.includes(esc(S.person(v, learner).name)) && w45.includes("Access ended") && w45.includes(esc(psTitle)));
  const w44 = direct("W44", { role: "ta", data }).html;
  assert.ok(w44.includes("Access ended"));
  for (const c of S.rubricFor(v, data.staff.grading_tasks[0].assessment_id, viewer("default", "instructor")).criteria) assert.ok(!w44.includes(esc(c.title)));
  const w43 = direct("W43", { role: "ta", data }).html;
  assert.ok(w43.includes("Access ended") && !goPages(w43).includes("W44"));
});

// ---------- 6. Instructor truths ----------
const I = (page, o = {}) => frame({ page, role: "instructor", ...o }).html;

test("instructor: W46 shows the basis, extra minutes and effective time", () => {
  const v = view();
  const quizId = S.anchorFor("W41").record.id;
  const learner = viewer("default", "student").personId;
  const al = S.allowanceFor(v, quizId, learner);
  assert.equal(al.id, S.anchorFor("W46").record.id);
  const html = I("W46");
  assert.ok(html.includes(al.basis_reference_instructor_only));
  assert.ok(html.includes(`${al.extra_minutes} minutes`));
  assert.ok(html.includes(`${S.effectiveMinutes(v, quizId, learner)} minutes`));
  assert.ok(html.includes(esc(when(S.lateStartThreshold(v, quizId, learner)))));
});

test("instructor: W45 shows the access end; after expiry it shows Access ended and no question list", () => {
  const v = view();
  const taId = S.anchorFor("W45").record.id;
  const task = S.gradingTaskFor(v, taId);
  const qs = P.questionsText(S.taScope(v, task.assessment_id, ta()).questionIds);
  const html = I("W45");
  assert.ok(html.includes(esc(when(S.accessEnd(v, taId, courseId())))));
  assert.ok(html.includes(esc(qs)));
  const ended = I("W45", { scenario: "ta_expired" });
  assert.ok(ended.includes("Access ended") && !ended.includes(esc(qs)));
});

test("instructor: W40 shows dates and receipts by version, never a receipt id as an input; motion links W47", () => {
  const v = view();
  const item = S.assessment(v, S.anchorFor("W40").record.id);
  const receipts = S.receiptsFor(v, item.id, viewer("default", "instructor"));
  assert.ok(receipts.length > 0);
  const html = I("W40");
  assert.ok(html.includes(esc(when(item.due))));
  const version = receipts[0].assessment_version;
  assert.ok(html.includes(`Version ${version}: ${receipts.filter((r) => r.assessment_version === version).length} received`));
  for (const r of receipts) assert.ok(!html.includes(`value="${esc(r.id)}"`), r.id);
  assert.ok(/<input[^>]*\sdisabled[\s>]/.test(html) && html.includes(`Work has been received against version ${version}`));
  assert.ok(goPages(I("W40", { token: "motion" })).includes("W47"));
});

test("instructor: W41 locks editing while an attempt is active, and states bank pins (W41, W42)", () => {
  const live = I("W41", { scenario: "quiz_in_progress" });
  assert.ok(live.includes("An attempt is in progress") && disabledWith(live, "Wait until the active attempt ends"));
  const idle = I("W41");
  assert.ok(!idle.includes("An attempt is in progress") && !idle.includes("Wait until the active attempt ends"));
  assert.ok(idle.includes("pinned") && I("W42").includes("pinned"));
});

test("instructor: W59 lists announcements as not copied, never as copied, and draft copy is disabled", () => {
  const html = I("W59");
  const list = (label) => (html.match(new RegExp(`<ul class="wb-list" aria-label="${label}">[\\s\\S]*?</ul>`)) || [""])[0];
  assert.ok(list("Not copied").includes("Announcements"));
  assert.ok(list("Copied").length > 0 && !list("Copied").includes("Announcements"));
  assert.ok(html.includes("Create draft copy") && disabledWith(html, "Choose a destination term first"));
});

test("instructor: W35 Publish is disabled with a reason", () => {
  const html = I("W35");
  assert.ok(html.includes("Publish selected") && disabledWith(html, "Nothing is waiting to be published"));
});

test("offline: no page claims a server save while offline", () => {
  for (const page of SEG) {
    if (!WB.pageFor(page).states.includes("offline")) continue;
    for (const role of rolesOf(page)) for (const c of CTX3) {
      const html = frame({ page, token: "offline", role, ...c }).html;
      assert.ok(!html.includes("wb-save--success"), `${page} ${role} ${c.platform}`);
      assert.ok(!/wb-save__label">Saved(?! locally)/.test(html), `${page} ${role} ${c.platform}`);
    }
  }
});

test("destructive: W45 and W46 open one dialog for the instructor and none for the TA", () => {
  for (const page of ["W45", "W46"]) for (const c of CTX3) {
    assert.equal(frame({ page, token: "destructive", role: "instructor", ...c }).openDialogs.length, 1, `${page} ${c.platform}`);
    assert.equal(frame({ page, token: "destructive", role: "ta", ...c }).openDialogs.length, 0, `${page} ${c.platform}`);
  }
});

// ---------- A5: only the module W37 draws links to W37 ----------
test("A5: W35 links W37 exactly once, labelled with the module W37 draws", () => {
  for (const scenario of ["default", "ps4_released"]) {
    const v = view(scenario);
    const m = S.currentModule(v, courseId()) || v.data.coursework.modules.filter((x) => x.course_id === courseId()).sort((x, y) => x.position - y.position)[0];
    const html = I("W35", { scenario });
    assert.equal(count(html, 'data-go="W37"'), 1, scenario);
    assert.ok(html.includes(`data-go="W37">${esc(m.title)}</a>`), scenario);
    assert.ok(I("W37", { scenario }).includes(esc(m.title)), scenario);
  }
});

// ---------- A10: record-true links ----------
test("A10: a page showing record X never links a page whose anchor is a different record of the same type", () => {
  const bad = [];
  for (const page of SEG) {
    const variants = [null, ...Object.keys(WB.pageFor(page).variants)];
    for (const variant of variants) {
      const own = anchorRecord(variant ? `${page}:${variant}` : page);
      if (!own || own.type === "course") continue;
      for (const role of rolesOf(page)) for (const c of CTX3) {
        const html = mainOf(frame({ page, token: variant, role, ...c }).html);
        for (const g of goLinks(html)) {
          const r = anchorRecord(g);
          if (r && r.type === own.type && r.id !== own.id) bad.push(`${page}:${variant || ""} ${role} ${c.platform} links ${g}`);
        }
      }
    }
  }
  assert.deepEqual(bad, []);
});

// ---------- 7. Journeys ----------
test("journeys: every authoring step renders cleanly with its role, scenario and token", () => {
  const bad = [];
  for (const j of WB.manifest.journeys) for (const s of j.steps) {
    if (!SEG.includes(s.page)) continue;
    for (const c of CTX3) checkOne(bad, { page: s.page, role: s.role, scenario: s.scenario, token: s.token, ...c });
  }
  assert.deepEqual(bad, []);
});

test("journeys: next-step links on 3 platforms (W42 and W60 on web only)", () => {
  const next = [
    ["W35", "W36"], ["W36", "W37"], ["W37", "W38"], ["W38", "W39"], ["W39", "W40"], ["W40", "W43"], ["W43", "W44"], ["W44", "W14"],
    ["W41", "W42"], ["W45", "W57"], ["W59", "W60"], ["W60", "W35"], ["W36", "W32"],
  ];
  const bad = [];
  for (const [from, to] of next) for (const c of CTX3) {
    if (HANDOFF_PAGES.includes(from) && c.platform !== "web") continue;
    if (!goPages(I(from, c)).includes(to)) bad.push(`${from} ${c.platform} has no link to ${to}`);
  }
  assert.deepEqual(bad, []);
});

// ---------- Fix round 1 ----------
const dockOf = (html) => (html.match(/aria-label="Protective actions">([\s\S]*?)<\/div>/) || ["", ""])[1];
function withoutInstructor() {
  const data = copy(WB.data);
  const inst = viewer("default", "instructor").personId;
  data.world.enrollments = data.world.enrollments.filter((e) => !(e.person_id === inst && e.role === "instructor"));
  return data;
}

test("R01: W45 and W46 deny an instructor whose course enrollment is gone and show no allowance or person data", () => {
  const v = view();
  const data = withoutInstructor();
  const quizId = S.anchorFor("W41").record.id;
  const al = S.allowanceFor(v, quizId, viewer("default", "student").personId);
  const people = [...studentIds(), S.anchorFor("W45").record.id].map((id) => S.person(v, id).name);
  for (const page of ["W45", "W46"]) for (const platform of ["web", "iphone"]) for (const state of [null, "destructive"]) {
    const r = direct(page, { role: "instructor", data, platform, state });
    const at = `${page} ${platform} ${state || "default"}`;
    assert.deepEqual(r.problems, [], at);
    assert.ok(r.html.includes("You are not teaching this course"), at);
    assert.deepEqual(r.openDialogs, [], at);
    assert.ok(!r.html.includes(al.basis_reference_instructor_only) && !r.html.includes(esc(al.note)), at);
    for (const n of people) assert.ok(!r.html.includes(esc(n)), `${at} ${n}`);
  }
  assert.ok(direct("W46", { role: "instructor" }).html.includes(al.basis_reference_instructor_only), "an enrolled instructor still sees the basis");
});

test("R07: W45 firstUseEmpty shows Roster delayed with no names, revoke opener or dialog on every tier", () => {
  const v = view();
  const people = [...studentIds(), S.anchorFor("W45").record.id].map((id) => S.person(v, id).name);
  for (const role of rolesOf("W45")) for (const c of CTX5) {
    const f = frame({ page: "W45", role, token: "firstUseEmpty", ...c });
    const at = `${role} ${c.platform}/${c.width || c.orientation || ""}`;
    assert.ok(f.html.includes("Roster delayed") && f.html.includes("The roster has not arrived yet"), at);
    for (const n of people) assert.ok(!f.html.includes(esc(n)), `${at} ${n}`);
    assert.ok(!f.html.includes("Revoke access") && !f.html.includes('data-act="open-dialog"'), at);
    assert.deepEqual(f.openDialogs, [], at);
  }
});

test("R06: W35 and W40 review-tier Hide from learners is disabled offline (and W35 in conflict), enabled otherwise", () => {
  const cases = [["W35", "offline", "You're offline"], ["W35", "conflict", "Reload the current version first"], ["W40", "offline", "You're offline"]];
  for (const [page, token, reason] of cases) for (const c of [CTX5[2], CTX5[4]]) {
    const dock = dockOf(frame({ page, role: "instructor", token, ...c }).html);
    assert.ok(dock.includes("Hide from learners") && dock.includes('aria-disabled="true"') && dock.includes(esc(reason)), `${page} ${token} ${c.platform}`);
    const free = dockOf(frame({ page, role: "instructor", ...c }).html);
    assert.ok(free.includes("Hide from learners") && !free.includes('aria-disabled="true"'), `${page} default ${c.platform}`);
  }
});

test("INSP2-01: W44 limits criteria and points to the active TA question scope", () => {
  const data = copy(WB.data);
  const task = data.staff.grading_tasks[0];
  task.question_ids = [task.question_ids[0]];
  const v = S.buildView(data, "default");
  const rubric = S.rubricFor(v, task.assessment_id, viewer("default", "instructor"));
  const assigned = rubric.criteria.filter((c) => task.question_ids.includes(c.question_id));
  const excluded = rubric.criteria.filter((c) => !task.question_ids.includes(c.question_id));
  assert.ok(assigned.length && excluded.length);
  for (const platform of ["web", "iphone"]) {
    const result = direct("W44", { role: "ta", data, platform });
    assert.deepEqual(result.problems, []);
    for (const c of assigned) assert.ok(result.html.includes(esc(c.title)));
    for (const c of excluded) assert.ok(!result.html.includes(esc(c.title)));
    assert.ok(result.html.includes(`${assigned.reduce((n, c) => n + c.max, 0)} points`));
    assert.ok(result.html.includes("Other questions are outside your grading task"));
    assert.ok(!result.html.includes(`of ${S.assessment(v, task.assessment_id).max} points`));
  }
});

test("INSP2-05: W46 displays the selected allowance mode and derived effective time", () => {
  for (const mode of ["extra_minutes", "multiplier"]) {
    const data = copy(WB.data);
    const allowance = data.quiz.allowances[0];
    if (mode === "multiplier") Object.assign(allowance, { timer_mode: mode, extra_minutes: null, multiplier: 1.5 });
    const v = S.buildView(data, "default");
    for (const platform of ["web", "iphone"]) {
      const result = direct("W46", { role: "instructor", data, platform });
      assert.deepEqual(result.problems, []);
      assert.ok(result.html.includes(mode === "multiplier" ? `${allowance.multiplier}×` : `${allowance.extra_minutes} minutes`));
      assert.ok(result.html.includes(`${S.effectiveMinutes(v, allowance.assessment_id, allowance.person_id)} minutes`));
      assert.ok(!result.html.includes("null minutes"));
    }
  }
});

test("INSP2-01: W44 full question scope does not claim other questions are excluded", () => {
  const task = S.gradingTaskFor(view(), ta().personId);
  assert.ok(S.taScope(view(), task.assessment_id, ta()).allQuestions);
  for (const platform of ["web", "iphone"]) {
    assert.ok(!direct("W44", { role: "ta", platform }).html.includes("Other questions are outside your grading task"));
  }
});
