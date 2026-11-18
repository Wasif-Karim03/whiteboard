// Phase 3 spine tests, part 3 (fix round 1, SPINE-01..06): the W53 exact preview carries the payload, a W21
// coverage gap blocks Submit on every variant, W49 review tiers offer no write controls and still show the
// summary, the W49 overall comment locks with the criteria, and W51 learner lists draw no invented text.
// Expected values come from WB.sel. Source checks only, not browser, device or accessibility acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import {
  WB, S, P, esc, view, viewer, copy, frame, direct, courseId, mainOf, dialogOf, rowsWith, disabledWith,
} from "./spine_helpers.mjs";

const PS4 = "ps4";

// ---------- SPINE-01: W53 exact preview shows the payload ----------
function heldDrafts(sc = "default") {
  const v = view(sc);
  const ins = viewer(sc, "instructor");
  return S.releaseReady(v, PS4, ins).filter((r) => r.included).map((r) => S.gradeDraftFor(v, r.personId, PS4, ins));
}

test("SPINE-01: every question comment and mark of the held draft appears in the W53 preview before release", () => {
  const drafts = heldDrafts();
  assert.ok(drafts.length > 0);
  const rubric = S.rubricFor(view(), PS4, viewer("default", "instructor")).criteria;
  const frames = [
    ["web default", frame({ page: "W53", role: "instructor" })],
    ["web acknowledged", frame({ page: "W53", token: "acknowledged", role: "instructor" })],
    ["ipad landscape", frame({ page: "W53", role: "instructor", platform: "ipad", orientation: "landscape" })],
    ["ipad portrait", frame({ page: "W53", role: "instructor", platform: "ipad", orientation: "portrait" })],
  ];
  for (const [label, f] of frames) {
    const main = mainOf(f.html);
    for (const d of drafts) {
      const comments = Object.values(d.comments);
      assert.ok(comments.length > 0, "the held draft has question comments");
      for (const c of comments) assert.ok(main.includes(esc(c)), `${label}: ${c}`);
      for (const cr of rubric) {
        if (!Object.hasOwn(d.marks, cr.question_id)) continue;
        assert.ok(main.includes(esc(cr.title)), `${label}: ${cr.title}`);
        assert.ok(main.includes(esc(P.score(d.marks[cr.question_id], cr.max))), `${label}: mark ${cr.question_id}`);
      }
    }
  }
  const ipad = frame({ page: "W53", role: "instructor", platform: "ipad" }).html;
  assert.ok(!/<textarea|type="number"/.test(mainOf(ipad)), "iPad preview is read-only");
});

test("SPINE-01: the W53 confirm dialog summarises per-question marks and the comment count", () => {
  const drafts = heldDrafts();
  const rubric = S.rubricFor(view(), PS4, viewer("default", "instructor")).criteria;
  const dialog = dialogOf(frame({ page: "W53", token: "confirm", role: "instructor" }).html, "t-c-release");
  assert.ok(dialog.length > 0);
  for (const d of drafts) {
    for (const cr of rubric) {
      if (!Object.hasOwn(d.marks, cr.question_id)) continue;
      assert.ok(dialog.includes(esc(`Question ${cr.question_id}: ${P.score(d.marks[cr.question_id], cr.max)}`)), cr.question_id);
    }
    const n = Object.keys(d.comments).length;
    assert.ok(dialog.includes(`${n} question comment`), `comment count ${n}`);
  }
});

// ---------- SPINE-02: W21 coverage gap ----------
const HOME = "assignment_submission";
// A copy of WB.data whose PS4 draft at the home scenario loses its last page tag.
function gapData() {
  const data = copy(WB.data);
  const st = viewer(HOME, "student");
  const draft = S.draftFor(view(HOME), PS4, st);
  const ov = data.scenarios.overrides[HOME].find((o) => o.collection === "drafts" && o.id === draft.id);
  const lost = draft.page_tags[draft.page_tags.length - 1].questions;
  ov.record.page_tags = ov.record.page_tags.slice(0, -1);
  return { data, lost };
}

test("SPINE-02: a W21 coverage gap disables Submit with the missing questions on every reviewed variant", () => {
  const { data, lost } = gapData();
  const reason = `Add a page for ${P.questionsText(lost)} first`;
  for (const platform of ["web", "ipad", "iphone"]) {
    for (const variant of [null, "reviewed", "confirm"]) {
      const d = direct("W21", { platform, role: "student", scenario: HOME, variant, data });
      const label = `${platform} ${variant || "default"}`;
      assert.deepEqual(d.problems, [], label);
      assert.ok(!d.html.includes('data-act="open-dialog"'), label);
      assert.deepEqual(d.openDialogs, [], label);
      assert.ok(!d.html.includes("#/W22"), label);
      assert.ok(disabledWith(d.html, reason), `${label} reason`);
    }
  }
  // The real data has full coverage, so the reviewed variant keeps its opener.
  assert.ok(frame({ page: "W21", token: "reviewed", role: "student", scenario: HOME }).html.includes('data-act="open-dialog"'));
});

// ---------- SPINE-03 / SPINE-04: W49 iPhone review tier ----------
const WRITES = ["Keep mine", "Use theirs", "Retry save", "Save marks", "Mark review complete"];

test("SPINE-03: W49 on iPhone offers no write control in conflict or saveFailed, for instructor and TA", () => {
  for (const role of ["instructor", "ta"]) {
    for (const token of ["conflict", "saveFailed"]) {
      const html = frame({ page: "W49", token, role, platform: "iphone" }).html;
      for (const w of WRITES) assert.ok(!html.includes(`>${w}<`), `${role} ${token} ${w}`);
    }
    const conflict = frame({ page: "W49", token: "conflict", role, platform: "iphone" }).html;
    assert.ok(conflict.includes(">Compare<"), `${role} compare`);
    const s = S.failureSample(view(), "score-conflict", viewer("default", role));
    assert.ok(conflict.includes(esc(S.person(view(), s.theirs.reviewer_id).name)), `${role} details`);
  }
  // The full tier keeps the instructor's resolution.
  const web = frame({ page: "W49", token: "conflict", role: "instructor" }).html;
  for (const l of ["Keep mine", "Use theirs"]) assert.ok(web.includes(l), l);
  assert.ok(frame({ page: "W49", token: "saveFailed", role: "instructor" }).html.includes("Retry save"));
});

test("SPINE-04: W49 on iPhone shows the total, reviewer and overall comment; a partial TA sees neither", () => {
  const ins = viewer("default", "instructor");
  const r = S.receiptsFor(view(), PS4, ins).find((x) => S.gradeDraftFor(view(), x.owner_id, PS4, ins));
  const d = S.gradeDraftFor(view(), r.owner_id, PS4, ins);
  const html = frame({ page: "W49", role: "instructor", platform: "iphone" }).html;
  assert.ok(html.includes(esc(d.overall_comment)), "overall comment");
  assert.ok(html.includes(esc(P.score(d.total.score, d.total.max))), "total");
  assert.ok(html.includes(esc(S.person(view(), d.reviewer_id).name)), "reviewer");

  const data = copy(WB.data);
  const taId = viewer("default", "ta").personId;
  const keep = S.rubricFor(view(), PS4, ins).criteria.slice(0, 2).map((c) => c.question_id);
  data.staff.grading_tasks = data.staff.grading_tasks.map((t) => (t.ta_id === taId ? { ...t, question_ids: keep } : t));
  const partial = direct("W49", { platform: "iphone", role: "ta", data }).html;
  assert.ok(!partial.includes(esc(d.overall_comment)), "partial: no overall comment");
  assert.ok(!partial.includes(esc(P.score(d.total.score, d.total.max))), "partial: no total");
});

// ---------- SPINE-05: W49 overall comment locks ----------
test("SPINE-05: the W49 overall comment is disabled with the same reason as the criteria when offline or saving", () => {
  const reasons = { offline: "You're offline. Marks cannot be saved", saving: "Already saving" };
  for (const [token, reason] of Object.entries(reasons)) {
    const html = frame({ page: "W49", token, role: "instructor" }).html;
    const field = html.match(/<textarea[^>]*id="t-c-overall"[^>]*>/);
    assert.ok(field, token);
    assert.match(field[0], /disabled|aria-disabled="true"/, token);
    assert.ok(html.includes(esc(reason)), token);
  }
  const live = frame({ page: "W49", role: "instructor" }).html.match(/<textarea[^>]*id="t-c-overall"[^>]*>/);
  assert.ok(live && !/disabled/.test(live[0]), "editable by default");
});

// ---------- SPINE-06: W51 learner list ----------
function learnerRowOf(html, title) {
  return [...html.matchAll(/<li class="wb-row">[\s\S]*?<\/li>/g)].map((m) => m[0]).find((li) => li.includes(`>${esc(title)}<`)) || "";
}

test("SPINE-06: W51 learner lists show a status-only outcome as its status and leave a null cell blank", () => {
  const ins = viewer("default", "instructor");
  const gb = S.gradebook(view(), courseId(), ins);
  const me = viewer("default", "student").personId;
  const row = gb.rows.find((x) => x.personId === me);
  const excused = gb.items.find((it) => row.cells[it.id] && row.cells[it.id].status === "excused");
  assert.ok(excused, "the persona has an excused item");
  for (const c of [{ platform: "ipad", orientation: "landscape" }, { platform: "ipad", orientation: "portrait" }, { platform: "iphone" }]) {
    const html = frame({ page: "W51", role: "instructor", ...c }).html;
    assert.ok(!html.includes("No result"), c.platform);
    const li = learnerRowOf(html, excused.title);
    assert.ok(li.includes(`>${WB.STATUS.excused.label}<`), `${c.platform} excused`);
  }
  const sc = HOME;
  const gb2 = S.gradebook(view(sc), courseId(), viewer(sc, "instructor"));
  const row2 = gb2.rows.find((x) => x.personId === viewer(sc, "student").personId);
  const blank = gb2.items.find((it) => !row2.cells[it.id] || (row2.cells[it.id].status === null && !row2.cells[it.id].held));
  assert.ok(blank, "a null cell exists at the home scenario");
  const li = learnerRowOf(frame({ page: "W51", role: "instructor", platform: "iphone", scenario: sc }).html, blank.title);
  assert.ok(li.length > 0);
  assert.ok(!li.includes("wb-row__meta") && !li.includes("wb-row__trailing"), li);
  // The held indicator stays on a held status-only cell (web table).
  const heldCell = gb.rows.flatMap((x) => gb.items.map((it) => ({ x, it, c: x.cells[it.id] }))).find((e) => e.c && e.c.held && e.c.score === null);
  assert.ok(heldCell, "a held status-only cell exists");
  assert.ok(rowsWith(frame({ page: "W51", role: "instructor" }).html, esc(heldCell.x.name))[0].includes("Not released"));
});
