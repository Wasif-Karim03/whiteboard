// Phase 3 segment seg3-submit tests for the quiz pages W25 (rules/start), W26 (attempt) and W27 (receipt/review):
// render matrix, structure, timing, the Start and Submit committing actions (plan amendments A2, A3), staff
// preview, record truth, role-safe links (A1), record-true links (A10) and the J05/J11 journey steps. Every
// expected value is read from WB.sel here, never typed. Source checks only, not browser, device or
// accessibility acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import {
  WB, S, P, esc, SCENARIOS, CTX3, CTX5, view, viewer, copy, frame, direct, tokensOf, rolesOf, count, mainOf,
  idsInMain, dialogOf, goLinks, goPages, disabledWith,
} from "./spine_helpers.mjs";

const PAGES = ["W25", "W26", "W27"];
const QUIZ = S.assessment(view(), S.anchorFor("W25").record.id).quiz_id;
const ITEM = S.anchorFor("W25").record.id;
const LEARNER = viewer("default", "student").personId;
const OPEN_CLOCK = "group_submission";
const W26_HOME = S.anchorFor("W26").home;
const W27_HOME = S.anchorFor("W27").home;
const START = "t-c-start";
const SUBMIT = "t-c-submit";
const OPENER = 'data-act="open-dialog"';

const homeOf = (id, variant) => (S.anchorFor(id, variant) || S.anchorFor(id) || { home: "default" }).home;
const fail = (list, label, problems) => { if (problems.length) list.push(`${label}: ${problems.slice(0, 3).join("; ")}`); };
const fmtTime = (iso) => `${S.fmtTime(iso)}`;
const quiz = (sc = "default") => S.quiz(view(sc), QUIZ);

// The visible text of the link whose href is target (tags stripped).
const linkText = (html, target) => {
  const m = html.match(new RegExp(`<a[^>]*href="${target}"[^>]*>([\\s\\S]*?)</a>`));
  return m ? m[1].replace(/<[^>]+>/g, "") : "";
};

// A1: every page-owned destination must allow the frame's current role (a link never changes identity).
function roleSafeLinks(html, role) {
  return goPages(html).filter((p) => !WB.manifest.pagesById[p] || !WB.manifest.pagesById[p].roles.includes(role));
}

function checkOne(bad, vs) {
  const label = `${vs.page} ${vs.platform}/${vs.width || vs.orientation || ""} ${vs.role} ${vs.token || "default"} ${vs.scenario}`;
  try {
    const f = frame(vs);
    const problems = [...f.problems];
    if (f.html.includes("Not built yet")) problems.push("placeholder text");
    if (f.blocked) problems.push("role blocked");
    if (f.html.includes("wb-handoff")) problems.push("handoff on a full tier");
    for (const id of idsInMain(f.html)) if (!id.startsWith("t-")) problems.push(`id ${id} outside the frame ns`);
    const unsafe = roleSafeLinks(f.html, vs.role);
    if (unsafe.length) problems.push(`role-changing links ${unsafe.join(",")}`);
    fail(bad, label, problems);
  } catch (err) {
    bad.push(`${label} threw: ${err.message}`);
  }
}

// ---------- Structure ----------
test("structure: W25–W27 are real pages covering all 16 states with short reasons", () => {
  const ids = WB.manifest.states.map((s) => s.id);
  assert.equal(ids.length, 16);
  for (const id of PAGES) {
    const p = WB.pageFor(id);
    assert.equal(p.placeholder, false, id);
    for (const s of ids) assert.ok(p.states.includes(s) !== Object.hasOwn(p.na, s), `${id} ${s}`);
    for (const r of Object.values(p.na)) assert.ok(r.length > 0 && r.length <= 140, id);
  }
  assert.ok(WB.pageFor("W26").states.includes("saving"));
  assert.ok(Object.hasOwn(WB.pageFor("W27").variants, "quiz2"));
  for (const v of ["acknowledged", "confirm"]) assert.ok(Object.hasOwn(WB.pageFor("W25").variants, v), `W25 ${v}`);
  for (const v of ["reviewed", "confirm"]) assert.ok(Object.hasOwn(WB.pageFor("W26").variants, v), `W26 ${v}`);
});

// ---------- Render matrix (with the A1 role-safe link check) ----------
test("render: every quiz page renders cleanly for each context, role and token at default and home", () => {
  const bad = [];
  for (const page of PAGES) {
    for (const token of tokensOf(page)) {
      const isVariant = token && Object.hasOwn(WB.pageFor(page).variants, token);
      const scenarios = [...new Set(["default", homeOf(page, isVariant ? token : null)])];
      for (const scenario of scenarios) for (const c of CTX5) for (const role of rolesOf(page)) checkOne(bad, { page, token, scenario, role, ...c });
    }
  }
  assert.deepEqual(bad.slice(0, 20), []);
});

test("render: every quiz page's default view renders for every scenario and allowed role on 3 platforms", () => {
  const bad = [];
  for (const page of PAGES) for (const scenario of SCENARIOS) for (const role of rolesOf(page)) for (const c of CTX3) checkOne(bad, { page, scenario, role, ...c });
  assert.deepEqual(bad.slice(0, 20), []);
});

test("A1: role-safe links also hold for every token at every scenario on web", () => {
  const bad = [];
  for (const page of PAGES) for (const token of tokensOf(page)) for (const scenario of SCENARIOS) for (const role of rolesOf(page)) {
    const unsafe = roleSafeLinks(frame({ page, token, scenario, role }).html, role);
    if (unsafe.length) bad.push(`${page} ${token} ${scenario} ${role}: ${unsafe.join(",")}`);
  }
  assert.deepEqual(bad.slice(0, 10), []);
  // sessionExpired on W26 offers a preview-only Sign in again and Help, never a W01 link.
  const f = frame({ page: "W26", token: "sessionExpired", role: "student", scenario: W26_HOME });
  assert.ok(!goPages(f.html).includes("W01"));
  assert.ok(goPages(mainOf(f.html)).includes("W12"));
  assert.ok(f.html.includes("Sign in again"));
});

// ---------- W25 timing ----------
test("W25 timing: the learner sees her own threshold and minutes; staff see the published ones only", () => {
  const v = view();
  const own = fmtTime(S.lateStartThreshold(v, QUIZ, LEARNER));
  const student = frame({ page: "W25", role: "student" }).html;
  assert.ok(student.includes(esc(own)));
  assert.ok(student.includes(String(S.effectiveMinutes(v, QUIZ, LEARNER))));
  for (const role of ["instructor", "ta"]) {
    const who = viewer("default", role);
    const published = fmtTime(S.lateStartThreshold(v, QUIZ, who.personId));
    assert.notEqual(published, own);
    const html = frame({ page: "W25", role }).html;
    assert.ok(html.includes(esc(published)), role);
    assert.ok(!html.includes(esc(own)), role);
  }
  const basis = S.allowanceFor(v, QUIZ, LEARNER).basis_reference_instructor_only;
  for (const scenario of SCENARIOS) for (const role of rolesOf("W25")) for (const token of tokensOf("W25")) {
    assert.ok(!frame({ page: "W25", role, scenario, token }).html.includes(basis), `${role} ${scenario} ${token}`);
  }
});

// ---------- W25 Start ----------
test("W25 Start: OPEN_CLOCK is inside the window with no attempt", () => {
  const v = view(OPEN_CLOCK);
  const q = S.quiz(v, QUIZ);
  assert.ok(!S.isBefore(v.clock, q.opens) && S.isBefore(v.clock, q.close));
  assert.equal(S.attemptFor(v, QUIZ, LEARNER), null);
});

test("W25 Start: unacknowledged, acknowledged and confirm at the open clock (A2 preview-only primary)", () => {
  for (const c of CTX3) {
    const base = frame({ page: "W25", role: "student", scenario: OPEN_CLOCK, ...c });
    assert.ok(disabledWith(base.html, "Confirm you have read the current rules first"), c.platform);
    assert.ok(!base.html.includes(OPENER));
    assert.ok(goLinks(base.html).includes("W25:acknowledged"));
    const ack = frame({ page: "W25", role: "student", scenario: OPEN_CLOCK, token: "acknowledged", ...c });
    assert.ok(ack.html.includes(OPENER) && ack.html.includes(`data-target="${START}"`));
    assert.deepEqual(ack.openDialogs, []);
    const conf = frame({ page: "W25", role: "student", scenario: OPEN_CLOCK, token: "confirm", ...c });
    assert.deepEqual(conf.openDialogs, [START]);
    const target = `#/W26~${W26_HOME}`;
    assert.equal(count(conf.html, `href="${target}"`), 1);
    const dlg = dialogOf(conf.html, START);
    assert.equal(count(dlg, `href="${target}"`), 1);
    // A2: the primary item starts nothing (no data-go); the separate link is labelled as an example.
    const primary = dlg.match(new RegExp(`<[^>]*id="${START}-go"[^>]*>`));
    assert.ok(primary && !primary[0].includes("data-go") && primary[0].includes("data-note"), c.platform);
    assert.ok(/example/i.test(linkText(dlg, target)), c.platform);
  }
});

test("W25 Start: before the quiz opens no token draws an opener, dialog or W26 link", () => {
  for (const token of [null, "acknowledged", "confirm"]) {
    const f = frame({ page: "W25", role: "student", token });
    assert.ok(!f.html.includes(OPENER), String(token));
    assert.deepEqual(f.openDialogs, []);
    assert.ok(!goLinks(f.html).some((g) => g.startsWith("W26~")), String(token));
    assert.ok(goLinks(f.html).includes(`W25~${OPEN_CLOCK}`), String(token));
  }
});

test("W25 Start: offline, saveFailed and conflict win over confirm", () => {
  for (const state of ["offline", "saveFailed", "conflict"]) {
    const f = direct("W25", { role: "student", scenario: OPEN_CLOCK, state, variant: "confirm" });
    assert.deepEqual(f.openDialogs, [], state);
    assert.ok(!f.html.includes(OPENER), state);
    assert.deepEqual(f.problems, [], state);
  }
});

test("W25 Start: a late start shows the minutes actually available", () => {
  const data = copy(WB.data);
  data.scenarios.clocks[OPEN_CLOCK] = "2026-10-22T23:50:00-04:00";
  const v = S.buildView(data, OPEN_CLOCK);
  const avail = S.availableMinutes(v, QUIZ, LEARNER, v.clock);
  assert.ok(avail < S.effectiveMinutes(v, QUIZ, LEARNER));
  const f = direct("W25", { role: "student", scenario: OPEN_CLOCK, data, variant: "confirm" });
  assert.ok(f.html.includes(`${avail} minutes`));
  assert.ok(dialogOf(f.html, START).includes(`${avail} minutes`));
});

test("W25 Start: an attempt in progress resumes; a received attempt links its receipt", () => {
  for (const scenario of ["quiz_in_progress", "late_quiz_start"]) {
    const f = frame({ page: "W25", role: "student", scenario });
    assert.ok(goPages(f.html).includes("W26"), scenario);
    assert.ok(!f.html.includes(OPENER), scenario);
  }
  const r = frame({ page: "W25", role: "student", scenario: "quiz_received" });
  assert.ok(goLinks(r.html).includes(P.recordGo("W27", "receipt", S.attemptFor(view("quiz_received"), QUIZ, LEARNER).receipt_id)));
  assert.ok(!r.html.includes(OPENER));
});

// ---------- W25 staff ----------
test("W25 staff: published preview only, no learner attempt, timer, Start or receipt; TA has no edit link", () => {
  for (const scenario of SCENARIOS) {
    for (const role of ["instructor", "ta"]) {
      const html = frame({ page: "W25", role, scenario }).html;
      assert.ok(!html.includes(OPENER), `${role} ${scenario}`);
      assert.ok(!html.includes("wb-timer"), `${role} ${scenario}`);
      assert.ok(!goPages(html).includes("W26") && !goPages(html).includes("W27"), `${role} ${scenario}`);
    }
    const inst = frame({ page: "W25", role: "instructor", scenario }).html;
    assert.ok(goLinks(inst).includes(P.recordGo("W41", "assessment", ITEM)), scenario);
    assert.ok(!goPages(frame({ page: "W25", role: "ta", scenario }).html).includes("W41"), scenario);
  }
  const ended = frame({ page: "W25", role: "ta", scenario: "ta_expired" }).html;
  assert.ok(ended.includes("Your grading access for this course has ended"));
  assert.ok(ended.includes(esc(quiz("ta_expired").title)));
});

// ---------- W26 ----------
const answersAt = (sc) => S.attemptFor(view(sc), QUIZ, LEARNER).answers;
const acked = (sc) => answersAt(sc).filter((x) => x.acknowledged_at !== null);
const unacked = (sc) => answersAt(sc).filter((x) => x.acknowledged_at === null);

test("W26 at home: the deadline and acknowledged values; Submit unreviewed by default", () => {
  const v = view(W26_HOME);
  const av = S.attemptView(v, QUIZ, LEARNER);
  for (const c of CTX3) {
    const f = frame({ page: "W26", role: "student", scenario: W26_HOME, ...c });
    assert.ok(f.html.includes(esc(S.fmtDateTime(av.deadline))), c.platform);
    for (const x of acked(W26_HOME)) assert.ok(f.html.includes(esc(x.value)), x.item_id);
    assert.ok(disabledWith(f.html, "Review your answers first"), c.platform);
    assert.ok(!f.html.includes(OPENER));
    assert.ok(goLinks(f.html).includes("W26:reviewed"));
  }
});

test("W26 confirm: the exact payload, unsent labelled, A2 preview-only primary and one example receipt link", () => {
  for (const c of CTX3) {
    const f = frame({ page: "W26", role: "student", scenario: W26_HOME, token: "confirm", ...c });
    assert.deepEqual(f.openDialogs, [SUBMIT]);
    const dlg = dialogOf(f.html, SUBMIT);
    for (const x of acked(W26_HOME)) assert.ok(dlg.includes(esc(x.value)), x.item_id);
    assert.ok(unacked(W26_HOME).length > 0 && dlg.includes("will not be sent"));
    const target = `#/W27~${W27_HOME}`;
    assert.equal(count(f.html, `href="${target}"`), 1);
    assert.equal(count(dlg, `href="${target}"`), 1);
    const primary = dlg.match(new RegExp(`<[^>]*id="${SUBMIT}-go"[^>]*>`));
    assert.ok(primary && !primary[0].includes("data-go") && primary[0].includes("data-note"), c.platform);
    assert.ok(/example/i.test(linkText(dlg, target)), c.platform);
  }
});

test("W26 A3: no choice is preselected and an unsent answer is never called a saved answer", () => {
  for (const token of tokensOf("W26")) for (const scenario of [W26_HOME, "late_quiz_start"]) {
    const html = frame({ page: "W26", role: "student", scenario, token }).html;
    // R04: placeholder choices are a non-interactive list, so no choice can be selected or changed.
    assert.ok(!/<input[^>]*type="(radio|checkbox)"/.test(mainOf(html)), `${token} ${scenario} has no selectable choice`);
    if (token !== "sessionExpired" && token !== "loading") assert.ok(count(html, 'aria-label="Choices are not in this prototype"') >= 2, `${token} ${scenario} draws the choice placeholders`);
    for (const x of unacked(W26_HOME)) assert.ok(!html.includes(`Saved answer: ${esc(x.value)}`), `${token} ${scenario}`);
  }
});

test("W26 saving: disabled with no opener and the unsent count", () => {
  const av = S.attemptView(view(W26_HOME), QUIZ, LEARNER);
  const f = frame({ page: "W26", role: "student", scenario: W26_HOME, token: "saving" });
  assert.ok(disabledWith(f.html, "An answer is still saving"));
  assert.ok(!f.html.includes(OPENER));
  assert.ok(f.html.includes(String(av.unsent)));
});

test("W26 blocking states win over confirm; sessionExpired shows no answer", () => {
  for (const state of ["offline", "saving", "saveFailed", "invalid"]) {
    const f = direct("W26", { role: "student", scenario: W26_HOME, state, variant: "confirm" });
    assert.deepEqual(f.openDialogs, [], state);
    assert.ok(!goLinks(f.html).some((g) => g.startsWith("W27~")), state);
    assert.deepEqual(f.problems, [], state);
  }
  const exp = frame({ page: "W26", role: "student", scenario: W26_HOME, token: "sessionExpired" }).html;
  for (const x of answersAt(W26_HOME)) assert.ok(!exp.includes(esc(x.value)), x.item_id);
});

test("W26 truth: no attempt at default, handed in at received, locked after time, 4 minutes on a late start", () => {
  const d = frame({ page: "W26", role: "student" }).html;
  assert.ok(!/<input|<textarea/.test(mainOf(d)));
  assert.ok(!d.includes(OPENER));
  assert.ok(goLinks(d).includes(`W26~${W26_HOME}`));
  const r = frame({ page: "W26", role: "student", scenario: "quiz_received" }).html;
  assert.ok(goPages(r).includes("W27"));
  assert.ok(!r.includes(OPENER));
  const data = copy(WB.data);
  data.scenarios.clocks[W26_HOME] = "2026-10-21T10:31:00-04:00";
  for (const variant of [null, "confirm"]) {
    const x = direct("W26", { role: "student", scenario: W26_HOME, data, variant });
    assert.ok(!x.html.includes(OPENER));
    assert.deepEqual(x.openDialogs, []);
    assert.ok(!/<input|<textarea/.test(mainOf(x.html)));
    assert.ok(!x.html.includes(S.anchorFor("W27").record.id));
    assert.deepEqual(x.problems, []);
  }
  const late = S.attemptView(view("late_quiz_start"), QUIZ, LEARNER);
  assert.equal(late.secondsLeft, 240);
  assert.ok(frame({ page: "W26", role: "student", scenario: "late_quiz_start" }).html.includes(`${late.secondsLeft / 60} minutes`));
});

// ---------- W27 ----------
test("W27 at home: receipt id and time, nothing editable, no score while held", () => {
  const v = view(W27_HOME);
  const id = S.anchorFor("W27").record.id;
  const rec = S.receiptsFor(v, ITEM, viewer(W27_HOME, "student")).find((r) => r.id === id);
  const f = frame({ page: "W27", role: "student", scenario: W27_HOME });
  assert.ok(f.html.includes(esc(id)));
  assert.ok(f.html.includes(esc(S.fmtDateTime(rec.accepted_at))));
  assert.ok(!/<input|<textarea|<select/.test(mainOf(f.html)));
  assert.ok(!f.html.includes("open-dialog"));
  assert.ok(!f.html.includes(` / ${quiz(W27_HOME).max}`));
});

test("W27 quiz2: the released review from resultFor; offline hides the score; A10 no W25 link", () => {
  const v = view();
  const st = viewer("default", "student");
  const anchor = S.anchorFor("W27", "quiz2");
  const item = S.receiptsFor(v, "quiz2", st).find((r) => r.id === anchor.record.id).assessment_id;
  const res = S.resultFor(v, st.personId, item, st);
  const f = frame({ page: "W27", role: "student", token: "quiz2" });
  assert.ok(f.html.includes(esc(P.score(res.score, res.max))));
  assert.ok(f.html.includes(esc(res.comment)));
  assert.ok(f.html.includes(esc(anchor.record.id)));
  assert.ok(!goPages(f.html).includes("W25"));
  assert.ok(!goPages(f.html).includes("W26"));
  const off = direct("W27", { role: "student", variant: "quiz2", state: "offline" });
  assert.ok(off.html.includes(esc(anchor.record.id)));
  assert.ok(!off.html.includes(esc(P.score(res.score, res.max))));
});

test("W27 truth: no Quiz 3 receipt before it exists; the rules link is record-true", () => {
  const id = S.anchorFor("W27").record.id;
  const d = frame({ page: "W27", role: "student" }).html;
  assert.ok(!d.includes(id));
  assert.ok(goLinks(d).includes(`W27~${W27_HOME}`));
  assert.ok(!frame({ page: "W27", role: "student", scenario: "quiz_in_progress" }).html.includes(id));
  assert.ok(goLinks(frame({ page: "W27", role: "student", scenario: W27_HOME }).html).includes(P.recordGo("W25", "assessment", ITEM)));
});

// ---------- Journeys ----------
// W25 → W58 (J11) and W27 → W53 (J05) change role, so the tour bar carries them, not a page link (A1).
test("journeys: J05 and J11 quiz steps render clean and link to the next quiz step", () => {
  const j05 = WB.manifest.journeys.find((j) => j.id === "J05").steps;
  const j11 = WB.manifest.journeys.find((j) => j.id === "J11").steps;
  const steps = [...j05.filter((s) => PAGES.includes(s.page)), j11.find((s) => s.page === "W25")];
  for (const c of CTX3) {
    for (const s of steps) {
      const f = frame({ page: s.page, role: s.role, scenario: s.scenario, token: s.token, ...c });
      assert.deepEqual(f.problems, [], `${s.page} ${c.platform}`);
      assert.ok(!f.html.includes("Not built yet"));
    }
    const w25 = j05.find((s) => s.page === "W25");
    assert.ok(goLinks(frame({ page: "W25", role: w25.role, scenario: w25.scenario, ...c }).html).includes(`W25~${OPEN_CLOCK}`));
    const open = frame({ page: "W25", role: "student", scenario: OPEN_CLOCK, token: "confirm", ...c });
    assert.ok(goPages(dialogOf(open.html, START)).includes("W26"));
    const w26 = j05.find((s) => s.page === "W26");
    const conf = frame({ page: "W26", role: w26.role, scenario: w26.scenario, token: "confirm", ...c });
    assert.ok(goPages(dialogOf(conf.html, SUBMIT)).includes("W27"));
    const w27 = j05.find((s) => s.page === "W27");
    assert.ok(goPages(frame({ page: "W27", role: w27.role, scenario: w27.scenario, ...c }).html).includes("W24"));
  }
});

// ---------- Fix round 1 ----------
test("R08: W27:quiz2 with its receipt absent or not the viewer's keeps its identity: no Quiz 3 title, status or links", () => {
  const id = S.anchorFor("W27", "quiz2").record.id;
  const absent = copy(WB.data);
  absent.coursework.receipts = absent.coursework.receipts.filter((r) => r.id !== id);
  const other = copy(WB.data);
  other.coursework.receipts.find((r) => r.id === id).owner_id = S.enrolled(view(), viewer("default", "student").courseId, "student").find((p) => p !== LEARNER);
  const q3 = S.assessment(view(), ITEM).title;
  for (const data of [absent, other]) for (const scenario of ["default", "quiz_in_progress"]) for (const platform of ["web", "iphone"]) {
    const r = direct("W27", { role: "student", data, scenario, platform, variant: "quiz2" });
    const at = `${data === absent ? "absent" : "other owner"} ${scenario} ${platform}`;
    assert.deepEqual(r.problems, [], at);
    assert.ok(r.html.includes("This receipt is not available"), at);
    assert.ok(!r.html.includes(esc(q3)), at);
    assert.ok(!goPages(r.html).some((p) => p === "W25" || p === "W26"), at);
  }
});


test("INSP2-03: released nonnumeric quiz outcomes preserve the receipt and release metadata without a score row", () => {
  const receiptId = S.anchorFor("W27", "quiz2").record.id;
  const itemId = WB.data.coursework.receipts.find((r) => r.id === receiptId).assessment_id;
  for (const status of ["excused", "missing"]) {
    const data = copy(WB.data);
    const result = data.grades.results.find((r) => r.person_id === LEARNER && r.item_id === itemId);
    result.released = { status, score: null };
    const release = data.grades.releases.find((r) => r.item_id === itemId);
    Object.assign(release.entries.find((r) => r.person_id === LEARNER), { status, score: null });
    for (const c of CTX3) {
      const r = direct("W27", { role: "student", variant: "quiz2", data, ...c });
      assert.deepEqual(r.problems, []);
      assert.ok(r.html.includes(esc(receiptId)));
      const review = r.html.slice(r.html.indexOf('>Released review<'));
      assert.ok(review.includes(WB.STATUS[status].label));
      assert.ok(!review.includes('>Score<'));
      assert.ok(review.includes(esc(release.entries.find((r) => r.person_id === LEARNER).comment)));
      assert.ok(review.includes(esc(P.when({ sel: S }, release.released_at))));
      assert.ok(review.includes('>Release version<'));
    }
  }
});
