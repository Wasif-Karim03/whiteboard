// Phase 3 seg1-access tests (W01–W04, W08–W13): structure, render matrix, access mode, journeys, dialogs and
// authority (plan seg1 step 11, amendments A1, A4, A7, A10). Every expected value is read from WB.sel or the
// fixtures here, never typed. Source checks only, not browser, device or accessibility acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import {
  WB, S, P, esc, SCENARIOS, CTX3, CTX5, view, viewer, copy, when, frame, direct, tokensOf, rolesOf, count,
  idsInMain, dialogOf, goLinks, goPages, disabledWith, mainOf,
} from "./spine_helpers.mjs";

const SEG = ["W01", "W02", "W03", "W04", "W08", "W09", "W10", "W11", "W12", "W13"];
const GUEST_PAGES = ["W01", "W02", "W03", "W12", "W13"];
const PREVIEW_ROLE_NOTE = "Preview only: in this prototype, switch the role in the viewer bar or follow the tour";
const isVariant = (page, token) => Boolean(token) && Object.hasOwn(WB.pageFor(page).variants, token);
const ctxLabel = (c) => `${c.platform}/${c.width || c.orientation || ""}`;

// A1: every go target page allows the frame's current role, so no link changes identity.
export function roleSafeLinks(html, role) {
  return goPages(html).filter((p) => !WB.manifest.pagesById[p] || !WB.manifest.pagesById[p].roles.includes(role));
}

// Every SEG render: all tokens × scenarios × 3 platforms × roles, plus the narrow and portrait contexts at default.
let cache = null;
function renders() {
  if (cache) return cache;
  cache = [];
  const add = (vs) => {
    try {
      cache.push({ ...vs, f: frame(vs) });
    } catch (err) {
      cache.push({ ...vs, error: err.message });
    }
  };
  for (const page of SEG) {
    for (const token of tokensOf(page)) for (const role of rolesOf(page)) {
      for (const scenario of SCENARIOS) for (const c of CTX3) add({ page, token, scenario, role, ...c });
      for (const c of [CTX5[1], CTX5[3]]) add({ page, token, scenario: "default", role, ...c });
    }
  }
  return cache;
}
const pick = (fn) => renders().filter(fn);
const label = (r) => `${r.page} ${ctxLabel(r)} ${r.role} ${r.token || "default"} ${r.scenario}`;
const one = (vs) => frame({ scenario: "default", platform: "web", width: "regular", ...vs });

// ---------- 1. Structure ----------
test("seg1 structure: real pages, 16 states covered, N/A reasons in bounds, required failures drawn, all full", () => {
  const all = [...WB.manifest.states.map((s) => s.id)].sort();
  for (const id of SEG) {
    const e = WB.pageFor(id);
    assert.equal(e.placeholder, false, id);
    assert.deepEqual([...e.states, ...Object.keys(e.na)].sort(), all, id);
    for (const r of Object.values(e.na)) assert.ok(r.length >= 1 && r.length <= 140, `${id}: ${r}`);
    for (const p of WB.PLATFORMS) assert.equal(e.page.platforms[p], "full", `${id} ${p}`);
  }
  for (const id of ["W01", "W02", "W03"]) assert.ok(WB.pageFor(id).states.includes("permissionUnavailable"), id);
});

// ---------- 2. Render matrix ----------
test("seg1 render matrix: clean frames, no placeholder, no handoff, ids in the frame ns, role-safe links (A1)", () => {
  const bad = [];
  for (const r of renders()) {
    if (r.error) { bad.push(`${label(r)} threw: ${r.error}`); continue; }
    const problems = [...r.f.problems];
    if (r.f.html.includes("Not built yet")) problems.push("placeholder text");
    if (r.f.html.includes("wb-handoff")) problems.push("handoff");
    if (r.f.html.includes('type="password"')) problems.push("password field");
    if (r.f.html.includes("style=")) problems.push("style attribute");
    if (r.f.blocked) problems.push("role blocked");
    for (const id of idsInMain(r.f.html)) if (!id.startsWith("t-")) problems.push(`id ${id} outside the frame ns`);
    const unsafe = roleSafeLinks(r.f.html, r.role);
    if (unsafe.length) problems.push(`role-unsafe links ${unsafe.join(",")}`);
    if (problems.length) bad.push(`${label(r)}: ${problems.slice(0, 3).join("; ")}`);
  }
  assert.deepEqual(bad.slice(0, 20), []);
});

// ---------- 3. Access mode ----------
test("seg1 access mode: sign-in, recovery, guest and expiry frames carry no nav; signed-in pages use the app shell", () => {
  const accessOf = (r) => r.page === "W01" || r.page === "W02" || (r.role === "guest" && GUEST_PAGES.includes(r.page)) ||
    (r.page === "W13" && ["sessionExpired", "maintenance", "retry-failed"].includes(r.token));
  for (const r of pick((x) => x.scenario === "default")) {
    const access = r.f.html.includes('data-mode="access"');
    if (accessOf(r)) {
      assert.ok(access, label(r));
      assert.ok(!r.f.html.includes("data-nav"), label(r));
    } else if (["W04", "W08", "W09", "W10", "W11"].includes(r.page)) {
      assert.ok(!access, label(r));
      assert.ok(r.f.html.includes("data-nav"), label(r));
    }
  }
});

// ---------- 4. Journeys ----------
test("seg1 journeys: J01 steps link forward; the W01 → W02 identity change is carried by the tour (A1)", () => {
  const j = WB.manifest.journeys.find((x) => x.id === "J01");
  for (let i = 1; i < j.steps.length - 1; i += 1) {
    const s = j.steps[i];
    for (const c of CTX3) {
      const f = frame({ page: s.page, role: s.role, scenario: s.scenario, token: s.token, ...c });
      assert.ok(goPages(f.html).includes(j.steps[i + 1].page), `${s.page} → ${j.steps[i + 1].page} ${c.platform}`);
    }
  }
  for (const c of CTX3) {
    const f = frame({ page: "W01", role: "guest", ...c });
    assert.ok(!goPages(f.html).includes("W02"), c.platform);
  }
});

test("seg1 journeys: J09 and J10 W08 steps are real and row links equal the fixture go values", () => {
  for (const id of ["J09", "J10"]) {
    const s = WB.manifest.journeys.find((x) => x.id === id).steps.find((x) => x.page === "W08");
    const v = view(s.scenario);
    const expected = S.activityFor(v, viewer(s.scenario, s.role).personId).map((x) => x.go);
    assert.ok(expected.includes("W31"), id);
    for (const c of CTX3) {
      const f = frame({ page: "W08", role: s.role, scenario: s.scenario, ...c });
      const rowGos = [...mainOf(f.html).matchAll(/<li class="wb-row">[\s\S]*?<\/li>/g)].flatMap((m) => goLinks(m[0]));
      assert.deepEqual(rowGos, [...expected], `${id} ${c.platform}`);
    }
  }
});

// ---------- 5. Dialogs ----------
test("seg1 dialogs: each dialog variant opens exactly its dialog", () => {
  const cases = { "W01:leaving": ["guest", "t-c-leave"], "W04:skip": ["student", "t-c-skip"], "W08:settings": ["student", "t-c-settings"], "W10:sign-out": ["student", "t-c-signout"], "W12:review": ["student", "t-c-review"] };
  for (const [key, [role, id]] of Object.entries(cases)) {
    const [page, token] = key.split(":");
    for (const c of CTX3) assert.deepEqual(frame({ page, token, role, ...c }).openDialogs, [id], `${key} ${c.platform}`);
  }
});

test("seg1 dialogs: destinations are role-safe; identity changes are preview-only with the A1 note (A1)", () => {
  const skip = dialogOf(one({ page: "W04", token: "skip", role: "student" }).html, "t-c-skip");
  assert.deepEqual(goLinks(skip), ["W05"]);
  for (const [page, token, role, id] of [["W01", "leaving", "guest", "t-c-leave"], ["W10", "sign-out", "student", "t-c-signout"]]) {
    const d = dialogOf(one({ page, token, role }).html, id);
    assert.ok(d, `${page} ${id}`);
    assert.deepEqual(goLinks(d), [], `${page} ${token}`);
    assert.ok(d.includes(`data-note="${esc(PREVIEW_ROLE_NOTE)}"`), `${page} ${token}`);
  }
  for (const role of rolesOf("W13")) {
    const f = one({ page: "W13", token: "sessionExpired", role });
    assert.equal(count(f.html, 'data-act="open-dialog"'), 1, role);
    const d = dialogOf(f.html, "t-c-leave");
    assert.ok(!goPages(d).includes("W01"), role);
    assert.ok(goPages(d).includes("W12"), role);
    assert.ok(d.includes(`data-note="${esc(PREVIEW_ROLE_NOTE)}"`), role);
  }
});

test("seg1 dialogs: blocking states win over dialog variants (offline + open dialog draws no opener or dialog)", () => {
  for (const [page, variant, role] of [["W01", "leaving", "guest"], ["W12", "review", "student"], ["W12", "review", "guest"], ["W10", "sign-out", "student"]]) {
    for (const platform of ["web", "ipad", "iphone"]) {
      const d = direct(page, { platform, role, state: "offline", variant });
      assert.deepEqual(d.openDialogs, [], `${page} ${role} ${platform}`);
      assert.ok(!d.html.includes('data-act="open-dialog"'), `${page} ${role} ${platform}`);
      assert.deepEqual(d.problems, [], `${page} ${platform}`);
    }
  }
  for (const state of ["filteredEmpty", "saving", "saveFailed", "permissionUnavailable"]) {
    const d = direct("W01", { role: "guest", state, variant: "leaving" });
    assert.deepEqual(d.openDialogs, [], state);
    assert.ok(!d.html.includes('data-act="open-dialog"'), state);
  }
});

// ---------- 6. Guest authority ----------
test("seg1 guest authority: no person name, email or course code in any guest render", () => {
  const w = view().data.world;
  const needles = [...w.people.flatMap((p) => [p.name, p.email]), ...w.courses.map((c) => c.code)].map(esc);
  const bad = [];
  for (const r of pick((x) => x.role === "guest")) for (const n of needles) if (r.f.html.includes(n)) bad.push(`${label(r)}: ${n}`);
  assert.deepEqual(bad.slice(0, 10), []);
});

// ---------- 7. Student authority ----------
test("seg1 student authority: no unreleased PS4 score in any student render; Activity rows carry no score", () => {
  const bad = [];
  for (const sc of SCENARIOS) {
    const v = view(sc);
    const o = S.resultFor(v, viewer(sc, "student").personId, "ps4", viewer(sc, "instructor")).staffOutcome;
    if (!o || o.score === null || o.score === undefined) continue;
    const needle = esc(P.score(o.score, S.assessment(v, "ps4").max));
    for (const r of pick((x) => x.role === "student" && x.scenario === sc)) if (r.f.html.includes(needle)) bad.push(label(r));
  }
  assert.deepEqual(bad.slice(0, 10), []);
  for (const r of pick((x) => x.page === "W08")) {
    const rows = [...mainOf(r.f.html).matchAll(/<li class="wb-row"[\s\S]*?<\/li>/g)].map((m) => m[0]);
    for (const row of rows) assert.ok(!row.includes(" / "), label(r));
  }
});

// ---------- 8. TA authority ----------
test("seg1 TA authority: no W53 link; after access ends no W48 or W14 link and the end comes from sel.accessEnd", () => {
  for (const r of pick((x) => x.role === "ta")) assert.ok(!goPages(r.f.html).includes("W53"), label(r));
  const sc = "ta_expired";
  const ta = viewer(sc, "ta");
  const end = esc(when(S.accessEnd(view(sc), ta.personId, ta.courseId)));
  for (const [page, token] of [["W04", "first-task"], ["W08", null], ["W03", null]]) {
    for (const c of CTX3) {
      const f = frame({ page, token, role: "ta", scenario: sc, ...c });
      const pages = goPages(f.html);
      assert.ok(!pages.includes("W48") && !pages.includes("W14"), `${page} ${c.platform}`);
      assert.ok(f.html.includes(end), `${page} ${c.platform}`);
    }
  }
  const ta0 = viewer("default", "ta");
  const task = S.gradingTaskFor(view(), ta0.personId);
  for (const c of CTX3) {
    assert.ok(goLinks(frame({ page: "W04", token: "first-task", role: "ta", ...c }).html).includes(P.recordGo("W48", "assessment", task.assessment_id)), c.platform);
  }
});

// ---------- 9. Staff authority and published-only search (A4) ----------
test("seg1 staff authority: staff search never shows a group-only topic or group pages; the student does", () => {
  const v = view();
  const groupTitles = v.data.comms.discussions.filter((d) => d.audience === "group").map((d) => esc(d.title));
  assert.ok(groupTitles.length > 0);
  for (const role of ["instructor", "ta"]) for (const c of CTX3) {
    const f = frame({ page: "W09", token: "group-only", role, ...c });
    for (const t of groupTitles) assert.ok(!f.html.includes(t), `${role} ${c.platform}`);
    assert.ok(!goPages(f.html).some((p) => p === "W33" || p === "W34"), `${role} ${c.platform}`);
  }
  for (const c of CTX3) assert.ok(groupTitles.some((t) => frame({ page: "W09", token: "group-only", role: "student", ...c }).html.includes(t)), c.platform);
});

test("seg1 A4: an unpublished PS4 never appears on any W09 view, for any role", () => {
  const data = copy(WB.data);
  data.coursework.assessments.find((x) => x.id === "ps4").published = false;
  const t = esc(S.assessment(view(), "ps4").title);
  const w09 = WB.pageFor("W09");
  const opts = [{}, ...w09.states.map((s) => ({ state: s })), ...Object.keys(w09.variants).map((v) => ({ variant: v }))];
  for (const role of rolesOf("W09")) for (const o of opts) {
    const d = direct("W09", { role, data, ...o });
    assert.ok(!d.html.includes(t), `${role} ${JSON.stringify(o)}`);
  }
});

// ---------- 10. Request ≠ approval ≠ confirmation (A7) ----------
const buttons = (html) => [...html.matchAll(/<button[^>]*>[\s\S]*?<\/button>/g)].map((m) => m[0]);

test("seg1 W03 (A7): Accept is never enabled, no acceptance is claimed, access is stated as a supported fact", () => {
  for (const r of pick((x) => x.page === "W03")) {
    for (const b of buttons(r.f.html).filter((x) => />Accept/.test(x))) assert.ok(b.includes('aria-disabled="true"'), label(r));
    assert.ok(!/accepted/i.test(mainOf(r.f.html)), label(r));
  }
  for (const role of ["student", "instructor", "ta"]) {
    const f = one({ page: "W03", role });
    assert.ok(f.html.includes(esc(`You already have access to this course as ${WB.ROLE_LABELS[role]}`)), role);
    assert.ok(f.html.includes(esc("This invitation's status cannot be checked in this prototype")), role);
    assert.ok(disabledWith(f.html, "This invitation cannot be verified"), role);
  }
});

test("seg1 W12 and W11: a request is preview-only with no reference; no provider destination is offered", () => {
  for (const role of rolesOf("W12")) {
    const d = dialogOf(one({ page: "W12", token: "review", role }).html, "t-c-review");
    const send = buttons(d).find((b) => b.includes("Submit request"));
    assert.ok(send && send.includes("data-note="), role);
    assert.deepEqual(goLinks(d), [], role);
  }
  for (const r of pick((x) => x.page === "W12")) assert.ok(!/AH-[A-Z0-9-]+/.test(r.f.html), label(r));
  for (const role of rolesOf("W11")) assert.ok(disabledWith(one({ page: "W11", role }).html, "No verified destination"), role);
});

// ---------- 11. Offline ≠ synced ----------
test("seg1 offline and save failures never show a saved status and do show the reason or failure", () => {
  const saved = WB.K.saveStatus("saved");
  const expect = {
    W04: { offline: "You're offline. Nothing has been saved", saveFailed: "Preferences were not saved. Your choices are kept here" },
    W08: { offline: "You're offline. Showing the last copy saved on this device", saveFailed: "Delivery settings were not saved. Your earlier settings still apply" },
    W10: { offline: "You're offline. Nothing has been saved", saveFailed: "Preferences were not saved" },
    W12: { offline: "You're offline. Nothing has been sent", saveFailed: "We can't tell whether your request arrived" },
  };
  for (const [page, states] of Object.entries(expect)) for (const [state, text] of Object.entries(states)) {
    for (const r of pick((x) => x.page === page && x.token === state)) {
      assert.ok(!r.f.html.includes(saved), label(r));
      assert.ok(r.f.html.includes(esc(text)), `${label(r)}: ${text}`);
    }
  }
});

// ---------- 12. Selector truth and record-true links (A10) ----------
test("seg1 selector truth: sign-in host, own email, activity empty view for the instructor", () => {
  const inst = view().data.world.institution;
  assert.ok(one({ page: "W01", role: "guest" }).html.includes(esc(inst.sign_in_host)));
  for (const role of ["student", "instructor", "ta"]) {
    const email = esc(S.person(view(), viewer("default", role).personId).email);
    for (const page of ["W04", "W10"]) assert.ok(one({ page, role }).html.includes(email), `${page} ${role}`);
  }
  assert.equal(S.activityFor(view(), viewer("default", "instructor").personId).length, 0);
  for (const c of CTX3) {
    const f = frame({ page: "W08", role: "instructor", ...c });
    assert.ok(f.html.includes("wb-empty"), c.platform);
    assert.ok(f.html.includes("No activity yet"), c.platform);
  }
});

// The student's W09 index for a query, computed from the fixtures (published, own course, visible topics).
function expectedResults(query) {
  const v = view();
  const st = viewer("default", "student");
  const q = query.toLowerCase();
  const hit = (...xs) => xs.some((x) => String(x || "").toLowerCase().includes(q));
  const items = v.data.coursework.assessments.filter((x) => x.course_id === st.courseId && x.published && hit(x.title))
    .map((x) => ({ title: x.title, go: P.recordGo("W19", "assessment", x.id) || P.recordGo("W25", "assessment", x.id) }));
  const anns = v.data.comms.announcements.filter((x) => x.course_id === st.courseId && x.state === "published")
    .map((x) => ({ id: x.id, rev: x.revisions[x.revisions.length - 1] })).filter((x) => hit(x.rev.title, x.rev.body))
    .map((x) => ({ title: x.rev.title, go: P.recordGo("W29", "announcement", x.id) }));
  const topics = S.visibleTopics(v, st.courseId, st.personId).filter((x) => hit(x.title, ...(x.posts || []).map((p) => p.body)))
    .map((x) => ({ title: x.title, go: P.recordGo("W31", "discussion", x.id) }));
  return [...items, ...anns, ...topics];
}

test("seg1 W09 (A10): the result count matches the rows and every row links its own record or is plain text", () => {
  const q = "projectile";
  const want = expectedResults(q);
  assert.ok(want.length > 0);
  for (const c of CTX3) {
    const f = frame({ page: "W09", token: "results", role: "student", ...c });
    const main = mainOf(f.html);
    assert.equal(count(main, '<li class="wb-row"'), want.length, c.platform);
    assert.ok(main.includes(`${want.length} result`), c.platform);
    for (const w of want) assert.ok(main.includes(esc(w.title)), `${c.platform} ${w.title}`);
    assert.deepEqual(goLinks(main).filter((g) => /^W(19|25|29|31)\b/.test(g)).sort(), want.map((w) => w.go).filter(Boolean).sort(), c.platform);
  }
});

test("seg1 A10: course and grading links name the viewer's own record", () => {
  const st = viewer("default", "student");
  const course = P.recordGo("W14", "course", st.courseId);
  assert.ok(goLinks(one({ page: "W03", role: "student" }).html).includes(course));
  assert.ok(goLinks(one({ page: "W04", token: "first-task", role: "student" }).html).includes(course));
  for (const r of pick((x) => x.role !== "guest")) {
    for (const g of goLinks(r.f.html)) {
      const p = g.split(/[:~]/)[0];
      if (!Object.hasOwn(WB.manifest.anchors, p) || r.page === "W08") continue;
      assert.ok(["W14", "W48", "W19", "W25", "W29", "W31"].includes(p), `${label(r)} ${g}`);
    }
  }
});

// ---------- Fix round 1 ----------
const activityList = (html) => (html.match(/<ul class="wb-list" aria-label="Activity">[\s\S]*?<\/ul>/) || [""])[0];
// A second TA task (Quiz 3) ordered before the PS4 task; `ps4End` overrides the PS4 task's access end.
function reorderedTasks(ps4End) {
  const data = copy(WB.data);
  const base = data.staff.grading_tasks[0];
  const quizId = S.anchorFor("W25").record.id;
  if (ps4End) base.access_end = ps4End;
  data.staff.grading_tasks.unshift({ ...base, id: `${base.id}-quiz`, assessment_id: quizId, access_end: S.addMinutes(view().clock, 60 * 24 * 7) });
  return { data, ps4: S.assessment(view(), base.assessment_id).title, quiz: S.assessment(view(), quizId).title };
}

test("R03: a W08 receipt row names the receipt's own assessment even when another TA task comes first", () => {
  const { data, ps4, quiz } = reorderedTasks(null);
  for (const platform of ["web", "iphone"]) {
    const list = activityList(direct("W08", { role: "ta", data, platform }).html);
    assert.ok(list.includes(esc(`Work arrived for grading: ${ps4}`)), platform);
    assert.ok(!list.includes(esc(quiz)), platform);
  }
});

test("R03: W08 drops the receipt row when its own task has expired, even with another active task", () => {
  const { data, ps4 } = reorderedTasks(S.addMinutes(view().clock, -60));
  for (const platform of ["web", "iphone"]) {
    const r = direct("W08", { role: "ta", data, platform });
    assert.deepEqual(r.problems, [], platform);
    const list = activityList(r.html);
    assert.ok(!list.includes("Work arrived for grading") && !list.includes(esc(ps4)), platform);
  }
});

test("R02: W08 shows no activity for an unpublished assessment or a draft announcement, keeping the others", () => {
  const v = view();
  const quiz2 = S.anchorFor("W27", "quiz2");
  const q2 = S.assessment(v, S.receiptsFor(v, "quiz2", viewer("default", "student")).find((r) => r.id === quiz2.record.id).assessment_id);
  const ann = v.data.comms.announcements.find((x) => x.id === S.anchorFor("W29").record.id);
  const annTitle = ann.revisions[ann.revisions.length - 1].title;
  const before = activityList(direct("W08", { role: "student" }).html);
  assert.ok(before.includes(esc(q2.title)) && before.includes(esc(annTitle)), "precondition");
  const data = copy(WB.data);
  data.coursework.assessments.find((x) => x.id === q2.id).published = false;
  data.comms.announcements.find((x) => x.id === ann.id).state = "draft";
  for (const platform of ["web", "iphone"]) {
    const list = activityList(direct("W08", { role: "student", data, platform }).html);
    assert.ok(!list.includes(esc(q2.title)) && !list.includes(esc(annTitle)), platform);
    assert.ok(!list.includes('data-go="W27:quiz2"'), platform);
    assert.ok(list.includes("New reply"), platform);
  }
});
