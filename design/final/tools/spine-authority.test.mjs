// Phase 3 spine tests, part 2 (plan §4 T4–T9; addenda R01, R02, R05, R09, R12–R16): who may see what. Student
// pages never show held values, TA pages respect task scope and access end, the instructor release is exact
// and device tiers carry their protective actions. Expected values come from WB.sel. Source checks only.
import test from "node:test";
import assert from "node:assert/strict";
import {
  WB, S, P, esc, SCENARIOS, CTX3, CTX5, view, viewer, title, when, copy, frame, direct, tokensOf, rolesOf, count,
  mainOf, dialogOf, goLinks, goPages, rowsWith, disabledWith, studentIds, studentNames, courseId,
} from "./spine_helpers.mjs";

const ENDED = "Your grading access for this course has ended";
const STEP = esc("Releasing feedback is the instructor's step");
const OUTSIDE = "Other questions are outside your grading task";
const PS4 = "ps4";

// ---------- T4 / R09: student never sees held values ----------
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
const ps4Region = (page, html, sc) => {
  if (page === "W18" || page === "W24") return rowsWith(html, esc(title(PS4, sc))).join("");
  return mainOf(html);
};

test("T4: student pages show no held comment, score, staff total or staff status before release", () => {
  const held = SCENARIOS.filter((sc) => S.resultFor(view(sc), viewer(sc, "student").personId, PS4, viewer(sc, "student")).status === null);
  assert.ok(held.length >= 2);
  const bad = [];
  for (const sc of held) {
    const h = heldValues(sc);
    for (const page of ["W14", "W18", "W19", "W22", "W23", "W24"]) for (const token of tokensOf(page)) for (const c of CTX3) {
      const html = frame({ page, token, role: "student", scenario: sc, ...c }).html;
      const label = `${page} ${token} ${sc} ${c.platform}`;
      for (const cm of h.comments) if (html.includes(esc(cm))) bad.push(`${label}: held comment`);
      if (h.total && html.includes(h.total)) bad.push(`${label}: staff total`);
      if (h.score && ps4Region(page, html, sc).includes(esc(h.score))) bad.push(`${label}: held score`);
      for (const k of ["held", "graded"]) if (html.includes(`>${esc(WB.STATUS[k].label)}<`)) bad.push(`${label}: ${k} label`);
    }
  }
  assert.deepEqual(bad.slice(0, 10), []);
});

test("T4: at ps4_released W23 and W24 show the released score and total; W24 keeps released PS2 at default", () => {
  const sc = "ps4_released";
  const v = view(sc);
  const st = viewer(sc, "student");
  const res = S.resultFor(v, st.personId, PS4, st);
  const total = S.courseTotal(v, st.courseId, st.personId, st).display;
  for (const page of ["W23", "W24"]) for (const c of CTX3) {
    const html = frame({ page, role: "student", scenario: sc, ...c }).html;
    assert.ok(html.includes(esc(P.score(res.score, res.max))), `${page} ${c.platform}`);
    assert.ok(html.includes(esc(total)), `${page} total`);
  }
  const d = view();
  const ps2 = S.resultFor(d, st.personId, "ps2", viewer("default", "student"));
  for (const c of CTX3) {
    const html = frame({ page: "W24", role: "student", ...c }).html;
    assert.ok(rowsWith(html, esc(title("ps2"))).join("").includes(esc(P.score(ps2.score, ps2.max))), c.platform);
  }
});

// ---------- T5: TA on W53 ----------
test("T5: a TA on W53 sees only their own review progress", () => {
  const v = view();
  const rp = S.reviewProgress(v, PS4, viewer("default", "ta"));
  for (const c of CTX5) for (const token of tokensOf("W53")) {
    const html = frame({ page: "W53", token, role: "ta", ...c }).html;
    const label = `${token} ${c.platform}`;
    assert.ok(!html.includes('data-act="open-dialog"') && !html.includes('role="dialog"'), label);
    assert.ok(!html.includes("fp-"), label);
    for (const n of studentNames()) assert.ok(!html.includes(esc(n)), `${label} ${n}`);
    assert.ok(!/\d%/.test(html), label);
    assert.ok(!html.includes("W53~ps4_released"), label);
    assert.ok(html.includes(STEP), label);
    assert.ok(html.includes(`You have reviewed ${rp.reviewed} of ${rp.of}`), label);
  }
});

// ---------- T6: TA access ended ----------
test("T6: after access ends the staff pages show only the notice, the course pages keep course content", () => {
  const sc = "ta_expired";
  const v = view(sc);
  const ta = viewer(sc, "ta");
  const end = S.fmtDateTime(S.accessEnd(v, ta.personId, ta.courseId));
  const receiptIds = ["ps4", "motion"].flatMap((id) => S.receiptsFor(v, id, viewer(sc, "instructor")).map((r) => r.id));
  for (const c of CTX3) {
    const staff = [["W48"], ["W49"], ["W49", "ben"], ["W49", "group"], ["W51"], ["W53"]];
    for (const [page, token] of staff) {
      const html = frame({ page, token, role: "ta", scenario: sc, ...c }).html;
      const label = `${page}:${token} ${c.platform}`;
      for (const need of [ENDED, end, title(PS4, sc)]) assert.ok(html.includes(esc(need)), `${label} ${need}`);
      assert.ok(html.includes('href="#/W05"'), label);
      for (const n of studentNames(sc)) assert.ok(!html.includes(esc(n)), `${label} ${n}`);
      for (const r of receiptIds) assert.ok(!html.includes(r), `${label} ${r}`);
      assert.ok(!/\d+ \/ \d+/.test(mainOf(html)), `${label} score`);
    }
    for (const page of ["W14", "W18", "W19"]) {
      const html = frame({ page, role: "ta", scenario: sc, ...c }).html;
      assert.ok(html.includes(ENDED), page);
      assert.ok(html.includes(esc(title(PS4, sc))), `${page} course content`);
      for (const n of studentNames(sc)) assert.ok(!html.includes(esc(n)), `${page} ${n}`);
    }
  }
});

// ---------- R12: unallocated ----------
test("R12: an active TA on an assignment outside their tasks sees the unallocated notice", () => {
  for (const c of CTX3) {
    const html = frame({ page: "W19", token: "motion", role: "ta", ...c }).html;
    assert.ok(html.includes("This assignment is not in your grading tasks"), c.platform);
    assert.ok(!html.includes(ENDED), c.platform);
    const w49 = frame({ page: "W49", token: "group", role: "ta", scenario: "group_submission", ...c }).html;
    assert.ok(w49.includes("This assignment is not in your grading tasks"), `W49 group ${c.platform}`);
    for (const n of studentNames()) assert.ok(!w49.includes(esc(n)), n);
  }
});

// ---------- T7 / R01: partial TA scope ----------
test("T7: a TA with a partial task sees only assigned questions and no whole-assessment score", () => {
  const data = copy(WB.data);
  const keep = ["1a", "1b"];
  data.staff.grading_tasks = data.staff.grading_tasks.map((t) => (t.ta_id === "maya" ? { ...t, question_ids: keep } : t));
  const v = S.buildView(data, "default");
  const rubric = S.rubricFor(v, PS4, S.viewerFor(v, "ta")).criteria;
  const full = S.gradeDraftFor(view(), "aisha", PS4, viewer("default", "instructor"));
  const outside = rubric.filter((c) => !keep.includes(c.question_id));
  for (const c of CTX3) {
    const { html, problems } = direct("W49", { ...c, role: "ta", data });
    assert.deepEqual(problems, [], c.platform);
    assert.ok(html.includes(OUTSIDE), c.platform);
    assert.ok(!/\d+ \/ 30\b/.test(html), `${c.platform} whole score`);
    for (const cr of rubric.filter((x) => keep.includes(x.question_id))) assert.ok(html.includes(esc(cr.title)), `${c.platform} ${cr.title}`);
    for (const cr of outside) {
      assert.ok(!html.includes(esc(cr.title)), `${c.platform} ${cr.title}`);
      assert.ok(!html.includes(`Question ${cr.question_id}<`) && !html.includes(`Questions ${cr.question_id}<`), `${c.platform} tag ${cr.question_id}`);
      if (full.comments[cr.question_id]) assert.ok(!html.includes(esc(full.comments[cr.question_id])), `${c.platform} comment`);
    }
    assert.ok(!html.includes(esc(full.overall_comment)), "no overall comment");
  }
});

// ---------- T8 / R02 / R14: instructor release ----------
test("T8: W53 lists exactly the releaseReady rows and requires acknowledging the exact preview", () => {
  const v = view();
  const ins = viewer("default", "instructor");
  const ready = S.releaseReady(v, PS4, ins);
  const def = frame({ page: "W53", role: "instructor" }).html;
  for (const r of ready) assert.ok(def.includes(esc(S.person(v, r.personId).name)), r.personId);
  const others = studentIds().filter((p) => !ready.some((r) => r.personId === p));
  for (const p of others) assert.ok(!def.includes(esc(S.person(v, p).name)), p);
  assert.ok(def.includes("Held back"));
  assert.ok(!def.includes('data-act="open-dialog"'));
  assert.ok(disabledWith(def, "Acknowledge the exact preview first"));
  assert.ok(!def.includes("<fieldset"), "R02: no candidate checkboxes");
  const ack = frame({ page: "W53", token: "acknowledged", role: "instructor" });
  assert.match(ack.html, /data-act="open-dialog" data-target="t-c-release"/);
  const included = ready.find((r) => r.included);
  const fp = S.releasePreview(v, courseId(), included.personId, PS4, ins).fingerprint;
  const conf = frame({ page: "W53", token: "confirm", role: "instructor" });
  assert.deepEqual(conf.openDialogs, ["t-c-release"]);
  assert.ok(dialogOf(conf.html, "t-c-release").includes(fp));
  assert.equal(count(conf.html, "#/W53~ps4_released"), 1);
  for (const variant of ["acknowledged", "confirm"]) {
    const d = direct("W53", { role: "instructor", state: "conflict", variant });
    assert.deepEqual(d.openDialogs, [], variant);
    assert.ok(!d.html.includes('data-act="open-dialog"') && !d.html.includes('role="dialog"'), variant);
    assert.ok(disabledWith(d.html, "The preview is out of date. Refresh it first"), variant);
    assert.ok(disabledWith(direct("W53", { role: "instructor", state: "offline", variant }).html, "You're offline. Nothing can be released"));
  }
  assert.ok(disabledWith(frame({ page: "W53", token: "conflict", role: "instructor" }).html, "The preview is out of date. Refresh it first"));
});

test("T8: W53 at ps4_released lists history, has zero included rows and no dialog", () => {
  const sc = "ps4_released";
  const v = view(sc);
  const ins = viewer(sc, "instructor");
  const rel = S.releasesFor(v, PS4, ins).at(-1);
  for (const token of [null, "acknowledged", "confirm"]) {
    const f = frame({ page: "W53", token, role: "instructor", scenario: sc });
    assert.ok(f.html.includes(`Version ${rel.version}`) && f.html.includes(esc(when(rel.released_at))), `${token}`);
    assert.ok(f.html.includes("Nothing ready"));
    assert.deepEqual(f.openDialogs, []);
    assert.ok(!f.html.includes('data-act="open-dialog"'));
    assert.ok(disabledWith(f.html, "Nothing is ready to release"));
    const aisha = S.person(v, viewer(sc, "student").personId).name;
    assert.ok(!rowsWith(f.html, esc(aisha)).length);
  }
});

test("T8: W53 on iPad is review only; on iPhone it is a handoff with Keep everything held", () => {
  for (const orientation of ["landscape", "portrait"]) for (const token of tokensOf("W53")) {
    const f = frame({ page: "W53", token, role: "instructor", platform: "ipad", orientation });
    assert.ok(!f.html.includes("wb-handoff"), `${token}`);
    // Loading and permission branches draw no release control at all; every other token draws it disabled.
    if (!["loading", "permissionUnavailable"].includes(token)) assert.ok(disabledWith(f.html, "Release from the web app"), `${token}`);
    assert.ok(!f.html.includes('data-act="open-dialog"'), `${token}`);
    assert.deepEqual(f.openDialogs, []);
    assert.ok(!f.html.includes('role="dialog"'));
  }
  for (const token of tokensOf("W53")) {
    const f = frame({ page: "W53", token, role: "instructor", platform: "iphone" });
    assert.ok(f.html.includes("wb-handoff--review"), `${token}`);
    // R05: the permission branch carries a data-free handoff with no protective action.
    assert.equal(f.html.includes("Keep everything held"), token !== "permissionUnavailable", `${token}`);
    assert.ok(!f.html.includes('data-act="open-dialog"') && !f.html.includes('role="dialog"'), `${token}`);
  }
});

// ---------- T9 / R05: device tiers ----------
test("T9: iPhone staff frames carry the protective actions for the role", () => {
  const want = {
    W48: { instructor: ["Hold release for this assessment"], ta: [] },
    W49: { instructor: ["Flag for instructor review", "Hold this result"], ta: ["Flag for instructor review"] },
    W51: { instructor: [esc("Hold this learner's pending results")], ta: [] },
  };
  const all = Object.values(want).flatMap((w) => w.instructor);
  for (const [page, roles] of Object.entries(want)) for (const [role, labels] of Object.entries(roles)) {
    const html = frame({ page, role, platform: "iphone" }).html;
    assert.ok(html.includes("wb-handoff--review"), `${page} ${role}`);
    for (const l of labels) assert.ok(html.includes(l), `${page} ${role} ${l}`);
    for (const l of all.filter((x) => !labels.includes(x))) assert.ok(!html.includes(l), `${page} ${role} has ${l}`);
  }
  const ipad = frame({ page: "W51", role: "instructor", platform: "ipad" }).html;
  const learner = viewer("default", "student").personId;
  assert.ok(ipad.includes(esc(S.person(view(), learner).name)));
  for (const p of studentIds().filter((x) => x !== learner)) assert.ok(!ipad.includes("Grade items for " + esc(S.person(view(), p).name)), p);
  assert.ok(ipad.includes("Choose student"));
});

test("R05: iPhone denial and expiry branches still carry a data-free handoff", () => {
  for (const page of ["W48", "W49", "W51", "W53"]) {
    for (const [role, scenario, token] of [["ta", "ta_expired", null], ["instructor", "default", "permissionUnavailable"]]) {
      const f = frame({ page, role, scenario, token, platform: "iphone" });
      assert.deepEqual(f.problems, [], `${page} ${role}`);
      assert.ok(f.html.includes("wb-handoff--review"), `${page} ${role}`);
      for (const n of studentNames(scenario)) assert.ok(!f.html.includes(esc(n)), `${page} ${role} ${n}`);
    }
  }
});

// ---------- R13: W51 received cells ----------
function cellOf(html, name, itemId, items) {
  const row = rowsWith(html, esc(name))[0] || "";
  const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => m[1]);
  return cells[items.findIndex((i) => i.id === itemId)];
}

test("R13: W51 shows a received, unreviewed cell with its status and no score; an unreceived cell stays blank", () => {
  const v = view();
  const ins = viewer("default", "instructor");
  const gb = S.gradebook(v, courseId(), ins);
  const ben = gb.rows.find((r) => r.cells.ps4 && r.cells.ps4.status === null);
  const html = frame({ page: "W51", role: "instructor" }).html;
  const cell = cellOf(html, ben.name, PS4, gb.items);
  assert.ok(cell.includes(`>${WB.STATUS.received.label}<`), cell);
  assert.ok(cell.includes("Not in the total until released"));
  assert.ok(!/\d+ \/ \d+/.test(cell));
  const sc = "assignment_submission";
  const gb2 = S.gradebook(view(sc), courseId(), viewer(sc, "instructor"));
  const aisha = gb2.rows.find((r) => r.personId === viewer(sc, "student").personId);
  const blank = cellOf(frame({ page: "W51", role: "instructor", scenario: sc }).html, aisha.name, PS4, gb2.items);
  assert.ok(blank.includes("Open in grader"));
  assert.equal(blank.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, "").trim(), "");
});

// ---------- R15 / R16: W49 conflict and visibility wording ----------
test("R15: only the instructor can resolve a W49 score conflict", () => {
  const ins = frame({ page: "W49", token: "conflict", role: "instructor" }).html;
  for (const l of ["Keep mine", "Use theirs", "Compare"]) assert.ok(ins.includes(l), l);
  const ta = frame({ page: "W49", token: "conflict", role: "ta" }).html;
  for (const l of ["Compare", "Ask the instructor to resolve", "Only the instructor can resolve a competing review"]) assert.ok(ta.includes(l), l);
  for (const l of ["Keep mine", "Use theirs"]) assert.ok(!ta.includes(l), l);
  const sample = S.failureSample(view(), "score-conflict", viewer("default", "ta"));
  for (const need of [when(sample.mine.savedAt), when(sample.theirs.savedAt), S.person(view(), sample.theirs.reviewer_id).name]) assert.ok(ta.includes(esc(need)), need);
});

test("R16: W49 says what the learner sees", () => {
  assert.ok(frame({ page: "W49", role: "instructor" }).html.includes("Graded is not released. The learner sees nothing until the instructor releases it"));
  const sc = "ps4_released";
  const v = view(sc);
  const res = S.resultFor(v, viewer(sc, "student").personId, PS4, viewer(sc, "instructor"));
  const html = frame({ page: "W49", role: "instructor", scenario: sc }).html;
  assert.ok(html.includes(esc(`Released ${when(res.releasedAt)}. The learner sees this version`)));
});

test("W48: TA sees the scoped queue and no release link; instructor sees both learners with receipts", () => {
  const v = view();
  const ins = viewer("default", "instructor");
  const ta = frame({ page: "W48", role: "ta" }).html;
  assert.ok(ta.includes(STEP));
  assert.ok(!goPages(ta).includes("W53"));
  const html = frame({ page: "W48", role: "instructor" }).html;
  for (const r of S.receiptsFor(v, PS4, ins)) assert.ok(html.includes(esc(r.id)), r.id);
  assert.ok(goLinks(html).includes("W49") && goLinks(html).includes("W49:ben"));
  assert.ok(goPages(html).includes("W53"));
  assert.ok(goLinks(frame({ page: "W48", role: "instructor", scenario: "group_submission" }).html).includes("W49:group"));
  assert.ok(!rolesOf("W48").includes("student"));
});
