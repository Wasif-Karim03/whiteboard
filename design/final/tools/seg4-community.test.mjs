// Phase 3 segment seg4-community tests (plan seg4 §Step 10 T1–T10; amendments A1, A4, A6, A10): render matrix,
// definitions, tiers, student-only groups, announcements, TA access, group truth, discussions, journeys and
// source hygiene. Expected values are read from WB.sel and WB.data, never typed. Source checks only, not
// browser, device or accessibility acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  WB, S, esc, SCENARIOS, CTX3, CTX5, view, viewer, copy, frame, direct, tokensOf, rolesOf, idsInMain, goLinks, goPages,
  disabledWith, mainOf, rowsWith, when, studentNames,
} from "./spine_helpers.mjs";

const PAGES = ["W28", "W29", "W30", "W31", "W33", "W34", "W47", "W55", "W56"];
const STAFF_PAGES = ["W47", "W55", "W56"];
const GROUP_HOME = "group_work_in_progress";
const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "pages", "seg4-community");
const homeOf = (id, variant) => (S.anchorFor(id, variant) || S.anchorFor(id) || { home: "default" }).home;
const fail = (list, label, problems) => { if (problems.length) list.push(`${label}: ${problems.slice(0, 3).join("; ")}`); };
const names = (ids, sc = "default") => ids.map((p) => S.person(view(sc), p).name);
const nameOf = (id) => S.person(view(), id).name;
const set = () => WB.data.groups.group_sets[0];
const motionId = () => S.anchorFor("W19", "motion").record.id;
const motionTitle = () => S.assessment(view(), motionId()).title;
const anns = () => WB.data.comms.announcements;
const ann = (id) => anns().find((x) => x.id === id);
const latest = (a) => a.revisions[a.revisions.length - 1];

// A1: every go target page lists the frame's role. Returns the offending pages.
export function roleSafeLinks(html, role) {
  return [...new Set(goPages(html))].filter((p) => !WB.manifest.pagesById[p] || !WB.manifest.pagesById[p].roles.includes(role));
}

// A10: a go resolves to the anchor record of its page (or variant); null when the page is course-level.
function resolve(go) {
  const [head] = go.split("~");
  const [page, variant] = head.split(":");
  const anchor = WB.manifest.anchors[page];
  if (!anchor) return null;
  return variant ? (anchor.variants[variant] || {}).record || null : anchor.record;
}
// The records a detail page shows; a link to another record of the same type would be record-false.
function shownRecords(page, token) {
  const motion = [S.anchorFor("W19", "motion").record, S.anchorFor("W20", "motion").record, S.anchorFor("W22", "group").record];
  if (page === "W29") return [(S.anchorFor("W29", token) || S.anchorFor("W29")).record];
  if (page === "W31") return [S.anchorFor("W31").record];
  if (page === "W33" || page === "W34" || page === "W47") return [S.anchorFor(page).record, ...motion];
  return [];
}
export function recordFalseLinks(html, page, token) {
  const shown = shownRecords(page, token);
  return goLinks(html).filter((g) => {
    const r = resolve(g);
    return r && shown.some((s) => s.type === r.type && s.id !== r.id) && !shown.some((s) => s.type === r.type && s.id === r.id);
  });
}

function checkOne(bad, vs) {
  const label = `${vs.page} ${vs.platform}/${vs.width || vs.orientation || ""} ${vs.role} ${vs.token || "default"} ${vs.scenario}`;
  try {
    const f = frame(vs);
    const problems = [...f.problems];
    if (f.html.includes("Not built yet")) problems.push("placeholder text");
    if (f.blocked) problems.push("role blocked");
    for (const id of idsInMain(f.html)) if (!id.startsWith("t-")) problems.push(`id ${id} outside the frame ns`);
    for (const p of roleSafeLinks(f.html, vs.role)) problems.push(`links ${p}, not allowed for ${vs.role}`);
    for (const g of recordFalseLinks(mainOf(f.html), vs.page, vs.token)) problems.push(`record-false link ${g}`);
    fail(bad, label, problems);
  } catch (err) {
    bad.push(`${label} threw: ${err.message}`);
  }
}

// ---------- T1 render matrix (with A1 and A10 on every frame) ----------
test("T1: every seg4 page renders for each context, role, token, at default and home, role-safe and record-true", () => {
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

test("T1: every seg4 page's default view renders for every scenario and role on 3 platforms", () => {
  const bad = [];
  for (const page of PAGES) for (const scenario of SCENARIOS) for (const role of rolesOf(page)) for (const c of CTX3) checkOne(bad, { page, scenario, role, ...c });
  assert.deepEqual(bad.slice(0, 20), []);
});

// ---------- T2 definitions ----------
test("T2: pages are real, cover the 16 states, draw the required failures and declare anchor variants", () => {
  for (const id of PAGES) {
    const e = WB.pageFor(id);
    assert.equal(e.placeholder, false, id);
    const covered = new Set([...e.states, ...Object.keys(e.na)]);
    for (const s of WB.manifest.states) assert.ok(covered.has(s.id), `${id} ${s.id}`);
    for (const r of Object.values(e.na)) assert.ok(r.length > 0 && r.length <= 140, id);
  }
  for (const id of ["W34", "W47"]) assert.ok(WB.pageFor(id).states.includes("conflict"), id);
  for (const id of PAGES) for (const v of Object.keys((WB.manifest.anchors[id] || { variants: {} }).variants)) assert.ok(Object.hasOwn(WB.pageFor(id).variants, v), `${id} ${v}`);
  assert.ok(Object.hasOwn(WB.pageFor("W29").variants, "office-hours"));
});

// ---------- T3 tiers ----------
const PROTECT = { W47: "Lock membership for this set", W55: "Withdraw announcement", W56: "Lock replies" };
test("T3: staff pages on iPad and iPhone are review tier: handoff, no fields or dialogs, instructor-only protective action", () => {
  for (const page of STAFF_PAGES) {
    for (const c of [CTX5[2], CTX5[3], CTX5[4]]) {
      for (const role of rolesOf(page)) {
        for (const token of tokensOf(page)) {
          const f = frame({ page, role, token, scenario: "default", ...c });
          const at = `${page} ${c.platform} ${role} ${token}`;
          assert.ok(f.html.includes("wb-handoff--review"), at);
          for (const bad of ["<textarea", "<input", 'data-act="open-dialog"']) assert.ok(!f.html.includes(bad), `${at} ${bad}`);
          assert.deepEqual(f.openDialogs, [], at);
        }
        const d = frame({ page, role, scenario: "default", ...c });
        assert.equal(d.html.includes(esc(PROTECT[page])), role === "instructor", `${page} ${c.platform} ${role} protective`);
      }
    }
    for (const role of rolesOf(page)) assert.ok(!frame({ page, role, ...CTX5[0] }).html.includes("wb-handoff"), `${page} web ${role}`);
  }
});

// ---------- T4 student-only groups ----------
test("T4: W33 and W34 are student only; no staff frame links them; a student never sees another group", () => {
  for (const page of ["W33", "W34"]) for (const role of ["instructor", "ta"]) assert.ok(frame({ page, role, ...CTX5[0] }).blocked, `${page} ${role}`);
  for (const page of PAGES) {
    for (const role of rolesOf(page).filter((r) => r !== "student")) {
      for (const sc of ["default", GROUP_HOME]) {
        const pages = goPages(frame({ page, role, scenario: sc, ...CTX5[0] }).html);
        assert.ok(!pages.includes("W33") && !pages.includes("W34"), `${page} ${role} ${sc}`);
      }
    }
  }
  const me = viewer("default", "student").personId;
  const others = set().groups.filter((g) => !g.members.includes(me));
  for (const page of ["W33", "W34"]) {
    for (const token of tokensOf(page)) {
      for (const sc of ["default", GROUP_HOME, "group_submission"]) {
        const html = mainOf(frame({ page, role: "student", token, scenario: sc, ...CTX5[0] }).html);
        for (const g of others) {
          assert.ok(!html.includes(esc(g.name)), `${page} ${token} ${sc} ${g.name}`);
          for (const m of names(g.members)) assert.ok(!html.includes(esc(m)), `${page} ${token} ${sc} ${m}`);
        }
      }
    }
  }
});

test("T4: a student moved out of the anchor group sees the permission notice on W34 and no member names", () => {
  const data = copy(WB.data);
  const me = viewer("default", "student").personId;
  const s = data.groups.group_sets[0];
  const anchorId = S.anchorFor("W34").record.id;
  const mine = s.groups.find((g) => g.id === anchorId);
  const other = s.groups.find((g) => g.id !== anchorId);
  mine.members = mine.members.filter((m) => m !== me);
  other.members.push(me);
  const html = mainOf(direct("W34", { role: "student", scenario: GROUP_HOME, data }).html);
  assert.ok(html.includes("Nothing from this page is shown outside your course role"));
  for (const m of names(mine.members)) assert.ok(!html.includes(esc(m)), m);
  assert.ok(!html.includes(esc(mine.name)));
});

// ---------- A4 published items only ----------
test("A4: an unpublished group assignment leaves no title on W33 or W34 for the student", () => {
  const data = copy(WB.data);
  data.coursework.assessments.find((x) => x.id === motionId()).published = false;
  for (const page of ["W33", "W34"]) {
    for (const sc of [GROUP_HOME, "group_submission"]) {
      const html = mainOf(direct(page, { role: "student", scenario: sc, data }).html);
      assert.ok(!html.includes(esc(motionTitle())), `${page} ${sc}`);
      assert.ok(!goLinks(html).some((g) => /^W(19|20|21|22)/.test(g)), `${page} ${sc}`);
    }
  }
  assert.ok(mainOf(frame({ page: "W33", role: "student", scenario: GROUP_HOME, ...CTX5[0] }).html).includes(esc(motionTitle())));
});

// ---------- T5 announcements ----------
function withExtraAnns() {
  const data = copy(WB.data);
  const base = data.comms.announcements[0];
  const make = (id, state, title) => ({ ...copy(base), id, state, pinned: false, attachments: [], revisions: [{ ...copy(base.revisions[0]), title }] });
  data.comms.announcements.push(make("t-draft", "draft", "Unpublished draft for the test"), make("t-sched", "scheduled", "Scheduled one for the test"));
  return data;
}
test("T5: draft and scheduled announcements reach only the instructor's W55", () => {
  const data = withExtraAnns();
  const titles = ["Unpublished draft for the test", "Scheduled one for the test"];
  for (const page of ["W28", "W29"]) for (const role of rolesOf(page)) {
    const html = direct(page, { role, data }).html;
    for (const t of titles) assert.ok(!html.includes(t), `${page} ${role} ${t}`);
  }
  for (const platform of ["web", "ipad", "iphone"]) {
    const ta = direct("W55", { role: "ta", data, platform }).html;
    for (const t of titles) assert.ok(!ta.includes(t), `W55 ta ${platform}`);
  }
  const ins = direct("W55", { role: "instructor", data }).html;
  for (const t of titles) assert.ok(ins.includes(t), `W55 instructor ${t}`);
});

test("T5: a withdrawn announcement shows the notice in place of its text; W28 still lists it", () => {
  const data = copy(WB.data);
  const id = S.anchorFor("W29").record.id;
  data.comms.announcements.find((x) => x.id === id).state = "withdrawn";
  const a = ann(id);
  for (const role of rolesOf("W29")) {
    const html = mainOf(direct("W29", { role, data }).html);
    assert.ok(html.includes("Withdrawn"), role);
    assert.ok(!html.includes(esc(latest(a).body)), role);
    for (const f of a.attachments) assert.ok(!html.includes(esc(f.name)), role);
    assert.ok(mainOf(direct("W28", { role, data }).html).includes(esc(latest(a).title)), `W28 ${role}`);
  }
});

test("T5: W29:office-hours shows the latest revision at default and the earlier one at an earlier clock", () => {
  const a = ann(S.anchorFor("W29", "office-hours").record.id);
  const now = mainOf(frame({ page: "W29", token: "office-hours", role: "student", ...CTX5[0] }).html);
  assert.ok(now.includes(esc(latest(a).body)));
  assert.ok(now.includes(esc(when(latest(a).at))));
  const early = mainOf(frame({ page: "W29", token: "office-hours", role: "student", scenario: "assignment_submission", ...CTX5[0] }).html);
  const shown = S.scenarioView("assignment_submission").data.comms.announcements.find((x) => x.id === a.id);
  assert.ok(early.includes(esc(latest(shown).body)));
  assert.ok(!early.includes(esc(latest(a).body)));
  const off = frame({ page: "W29", role: "student", scenario: "assignment_submission", ...CTX5[0] });
  assert.ok(goLinks(off.html).includes("W29~default"));
});

test("T5: W55 publish and withdraw variants open exactly that dialog on web; blocking states open none; TA has no fields", () => {
  for (const v of ["publish", "withdraw"]) assert.deepEqual(frame({ page: "W55", token: v, role: "instructor", ...CTX5[0] }).openDialogs, [`t-c-${v}`]);
  for (const st of ["saving", "invalid", "offline"]) for (const v of [null, "publish", "withdraw"]) {
    const f = direct("W55", { role: "instructor", state: st, variant: v });
    assert.deepEqual(f.openDialogs, [], `${st} ${v}`);
    assert.ok(!f.html.includes('data-act="open-dialog"'), `${st} ${v}`);
  }
  const pub = frame({ page: "W55", token: "publish", role: "instructor", ...CTX5[0] }).html;
  assert.ok(!/data-go="[^"]*"[^>]*>[^<]*<span class="wb-btn__label">Publish</.test(pub), "publish primary is not a link");
  for (const c of CTX3) {
    const html = mainOf(frame({ page: "W55", role: "ta", ...c }).html);
    assert.ok(!html.includes("<textarea") && !html.includes("<input"), c.platform);
  }
});

// ---------- T6 / A6 TA access ----------
test("T6: after TA access ends W47, W55, W56 show the ended notice and no learner names; W28–W31 have no composer", () => {
  const learners = studentNames("ta_expired");
  for (const page of STAFF_PAGES) for (const c of CTX3) {
    const html = mainOf(frame({ page, role: "ta", scenario: "ta_expired", ...c }).html);
    assert.ok(html.includes("Your grading access for this course has ended"), `${page} ${c.platform}`);
    for (const n of learners) assert.ok(!html.includes(esc(n)), `${page} ${c.platform} ${n}`);
  }
  for (const page of ["W28", "W29", "W30", "W31"]) for (const c of CTX3) assert.ok(!frame({ page, role: "ta", scenario: "ta_expired", ...c }).html.includes("<textarea"), page);
});

function withMotionTask(expired) {
  const data = copy(WB.data);
  const base = data.staff.grading_tasks[0];
  const clock = data.scenarios.clocks.default;
  const team = set().groups.find((g) => g.id === S.anchorFor("W34").record.id);
  const motion = { ...copy(base), id: "t-motion-task", assessment_id: motionId(), learner_ids: [...team.members], question_ids: ["*"] };
  if (expired === "motion") motion.access_end = S.addMinutes(clock, -60);
  if (expired === "base") base.access_end = S.addMinutes(clock, -60);
  data.staff.grading_tasks.push(motion);
  return { data, team };
}

test("T6: TA W47 without a motion task shows no student names", () => {
  for (const c of CTX3) {
    const html = mainOf(frame({ page: "W47", role: "ta", ...c }).html);
    for (const n of studentNames()) assert.ok(!html.includes(esc(n)), `${c.platform} ${n}`);
  }
});

test("T6/A6: with an active motion task the TA sees only that group's members, read-only", () => {
  for (const expired of [null, "base"]) {
    const { data, team } = withMotionTask(expired);
    const other = set().groups.filter((g) => g.id !== team.id);
    for (const platform of ["web", "ipad", "iphone"]) {
      const html = mainOf(direct("W47", { role: "ta", data, platform }).html);
      for (const n of names(team.members)) assert.ok(html.includes(esc(n)), `${expired} ${platform} ${n}`);
      for (const g of other) {
        assert.ok(!html.includes(esc(g.name)), `${expired} ${platform} ${g.name}`);
        for (const n of names(g.members)) assert.ok(!html.includes(esc(n)), `${expired} ${platform} ${n}`);
      }
      for (const no of ["Move to group", "Publish group set", "Save draft", "<input", "<textarea"]) assert.ok(!html.includes(no), `${expired} ${platform} ${no}`);
    }
  }
});

test("A6: an expired motion task beside an active task renders, lists the title with Access ended and no learners", () => {
  const { data } = withMotionTask("motion");
  for (const platform of ["web", "ipad", "iphone"]) {
    const f = direct("W47", { role: "ta", data, platform });
    assert.deepEqual(f.problems, [], platform);
    const html = mainOf(f.html);
    assert.ok(html.includes("Access ended") && html.includes(esc(motionTitle())), platform);
    for (const n of studentNames()) assert.ok(!html.includes(esc(n)), `${platform} ${n}`);
  }
});

// ---------- T7 group truth ----------
test("T7: W34 at the home clock shows the shared draft and links to its record-true pages", () => {
  const st = viewer(GROUP_HOME, "student");
  const draft = S.draftFor(view(GROUP_HOME), motionId(), st);
  for (const c of CTX3) {
    const html = mainOf(frame({ page: "W34", role: "student", scenario: GROUP_HOME, ...c }).html);
    assert.ok(html.includes(esc(S.person(view(GROUP_HOME), draft.actor_id).name)), c.platform);
    assert.ok(html.includes(`membership version ${draft.membership_version}`), c.platform);
    for (const g of ["W20:motion", "W21:motion", "W19:motion"]) assert.ok(goLinks(html).includes(g), `${c.platform} ${g}`);
  }
});

test("T7: W34 at group_submission shows the receipt and captured members, with no draft links", () => {
  const sc = "group_submission";
  const r = S.receiptsFor(view(sc), motionId(), viewer(sc, "student"))[0];
  for (const c of CTX3) {
    const html = mainOf(frame({ page: "W34", role: "student", scenario: sc, ...c }).html);
    assert.ok(goLinks(html).includes("W22:group"), c.platform);
    for (const m of names(r.captured_members, sc)) assert.ok(html.includes(esc(m)), `${c.platform} ${m}`);
    assert.ok(!goPages(html).includes("W20") && !goPages(html).includes("W21"), c.platform);
  }
});

test("T7: W34 conflict disables Add and Review and keeps an existing receipt unchanged", () => {
  for (const c of CTX3) {
    const f = frame({ page: "W34", role: "student", token: "conflict", scenario: GROUP_HOME, ...c });
    assert.ok(disabledWith(f.html, "Refresh the group first"), c.platform);
    assert.ok(!goPages(mainOf(f.html)).includes("W20") && !goPages(mainOf(f.html)).includes("W21"), c.platform);
    const done = mainOf(frame({ page: "W34", role: "student", token: "conflict", scenario: "group_submission", ...c }).html);
    assert.ok(goLinks(done).includes("W22:group") && done.includes("This receipt keeps its original members"), c.platform);
  }
});

test("T7: W47 conflict disables Publish; the move variant opens the dialog on web only", () => {
  assert.ok(disabledWith(frame({ page: "W47", role: "instructor", token: "conflict", ...CTX5[0] }).html, "Refresh the roster first"));
  assert.deepEqual(frame({ page: "W47", role: "instructor", token: "move", ...CTX5[0] }).openDialogs, ["t-c-move"]);
  for (const c of CTX5.slice(2)) assert.deepEqual(frame({ page: "W47", role: "instructor", token: "move", ...c }).openDialogs, [], c.platform);
  const f = direct("W47", { role: "instructor", state: "conflict", variant: "move" });
  assert.deepEqual(f.openDialogs, []);
  assert.ok(goLinks(frame({ page: "W47", role: "instructor", ...CTX5[0] }).html).includes("W40:motion"));
});

// ---------- T8 discussions ----------
test("T8: W30 links only the anchored topic and shows each topic's real reply count", () => {
  const v = view();
  for (const role of rolesOf("W30")) {
    const who = viewer("default", role);
    const html = mainOf(frame({ page: "W30", role, ...CTX5[0] }).html);
    const topicGo = goLinks(html).filter((g) => /^W31/.test(g));
    assert.deepEqual(topicGo, ["W31"], role);
    for (const t of S.visibleTopics(v, who.courseId, who.personId)) {
      const row = rowsWith(html, esc(t.title))[0];
      assert.ok(row && row.includes(`>${S.replyCount(v, t.id)}<`), `${role} ${t.title}`);
    }
  }
});

test("T8: the group topic reaches its members only; a closed thread has no composer; offline and saving disable Post", () => {
  const groupTopic = WB.data.comms.discussions.find((t) => t.audience === "group");
  assert.ok(mainOf(frame({ page: "W30", role: "student", ...CTX5[0] }).html).includes(esc(groupTopic.title)));
  for (const role of ["instructor", "ta"]) assert.ok(!frame({ page: "W30", role, ...CTX5[0] }).html.includes(esc(groupTopic.title)), role);
  const data = copy(WB.data);
  data.comms.discussions.find((t) => t.id === S.anchorFor("W31").record.id).replies_closed = true;
  for (const role of rolesOf("W31")) assert.ok(!direct("W31", { role, data }).html.includes("<textarea"), role);
  for (const c of CTX3) {
    assert.ok(disabledWith(frame({ page: "W31", role: "student", token: "offline", ...c }).html, "You're offline"), c.platform);
    assert.ok(disabledWith(frame({ page: "W31", role: "student", token: "saving", ...c }).html, "Your reply is still sending"), c.platform);
    for (const st of ["offline", "saving", "saveFailed"]) assert.ok(!frame({ page: "W31", role: "student", token: st, ...c }).html.includes("Reply posted"), st);
  }
});

// ---------- T9 journeys ----------
test("T9: J07 and J09 steps on seg4 pages are real and link to the next step", () => {
  for (const id of ["J07", "J09"]) {
    const steps = WB.manifest.journeys.find((j) => j.id === id).steps;
    steps.forEach((s, i) => {
      if (!PAGES.includes(s.page)) return;
      const f = frame({ page: s.page, role: s.role, scenario: s.scenario, token: s.token, ...CTX5[0] });
      assert.ok(!f.blocked && !f.html.includes("Not built yet"), `${id} ${s.page}`);
      const next = steps[i + 1];
      if (!next) return;
      const want = next.page + (next.token ? `:${next.token}` : "");
      if (WB.manifest.pagesById[next.page].roles.includes(s.role)) assert.ok(goLinks(f.html).includes(want), `${id} ${s.page} → ${want}`);
    });
  }
  assert.ok(goLinks(frame({ page: "W31", role: "instructor", ...CTX5[0] }).html).includes("W56"));
});

// ---------- T10 source hygiene ----------
test("T10: seg4 sources have no style, console, years, typed percentages or fixture id literals", () => {
  const groupReceipts = S.scenarioView("group_submission").data.groups.receipts;
  const ids = [
    ...WB.data.world.people.map((p) => p.id), ...WB.data.world.courses.map((c) => c.id),
    ...WB.data.coursework.receipts.map((r) => r.id), ...groupReceipts.map((r) => r.id),
  ];
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".js"));
  assert.deepEqual(files.sort(), PAGES.map((p) => `${p}.js`).sort());
  for (const f of files) {
    const text = fs.readFileSync(path.join(DIR, f), "utf8");
    for (const bad of ["style=", "console.", '%"']) assert.ok(!text.includes(bad), `${f} ${bad}`);
    assert.ok(!/\b(19|20)\d\d\b/.test(text), `${f} year`);
    for (const id of ids) assert.ok(!text.includes(`"${id}"`), `${f} ${id}`);
    assert.ok(text.split("\n").length <= 800, `${f} lines`);
  }
});

// ---------- Fix round 1 ----------
const dockOf = (html) => (html.match(/aria-label="Protective actions">([\s\S]*?)<\/div>/) || ["", ""])[1];

test("R05: W47 saveFailed blocks Move and Publish and opens no move dialog, alone or with the move variant; Retry stays", () => {
  for (const variant of [null, "move"]) {
    const r = direct("W47", { role: "instructor", state: "saveFailed", variant });
    const at = variant || "alone";
    assert.deepEqual(r.openDialogs, [], at);
    assert.ok(!r.html.includes('data-act="open-dialog"'), at);
    assert.ok(disabledWith(r.html, "Retry the failed save first"), at);
    for (const label of ["Move to group…", "Publish group set"]) {
      const btn = r.html.match(new RegExp(`<button[^>]*>(?:(?!</button>)[\\s\\S])*?${label}`));
      assert.ok(btn && btn[0].includes('aria-disabled="true"'), `${at} ${label}`);
    }
    assert.ok(r.html.includes("Retry save"), at);
  }
});

test("R06: W47, W55 and W56 review-tier protective actions follow the blocking states on iPad and iPhone", () => {
  const cases = {
    W47: [["offline", "You're offline"], ["conflict", "Refresh the roster first"], ["saveFailed", "Retry the failed save first"]],
    W55: [["offline", "You're offline"], ["saving", "Your changes are still saving"], ["saveFailed", "Save the draft first"]],
    W56: [["offline", "You're offline"], ["conflict", "Refresh the thread first"]],
  };
  for (const page of STAFF_PAGES) for (const c of [CTX5[2], CTX5[3], CTX5[4]]) {
    for (const [token, reason] of cases[page]) {
      const html = frame({ page, role: "instructor", token, ...c }).html;
      const dock = dockOf(html);
      const at = `${page} ${token} ${c.platform}/${c.orientation || ""}`;
      assert.ok(dock.includes(esc(PROTECT[page])) && dock.includes('aria-disabled="true"') && dock.includes(esc(reason)), at);
    }
    const free = dockOf(frame({ page, role: "instructor", ...c }).html);
    assert.ok(free.includes(esc(PROTECT[page])) && !free.includes('aria-disabled="true"'), `${page} default ${c.platform}`);
  }
  const conflict = frame({ page: "W56", role: "instructor", token: "conflict", platform: "iphone" }).html;
  assert.ok(conflict.includes("Refresh before acting"), "W56 keeps the conflict notice on the review tier");
});


test("INSP2-04: moderation evidence is escaped and sits with its own author, time and Hide control", () => {
  const data = copy(WB.data);
  const topic = data.comms.discussions.find((t) => t.id === S.anchorFor("W31").record.id);
  topic.posts.forEach((p, i) => { p.body += ` <em data-evidence="${i}">& inspect</em>`; });
  for (const state of [null, "offline", "conflict"]) {
    const r = direct("W56", { role: "instructor", state, data });
    assert.deepEqual(r.problems, []);
    const rows = [...r.html.matchAll(/<li class="wb-row">[\s\S]*?<\/li>/g)].map((m) => m[0]);
    for (const post of topic.posts) {
      const row = rows.find((x) => x.includes(esc(post.body)));
      assert.ok(row, post.id);
      assert.ok(row.includes(esc(S.person(view(), post.author_id).name)));
      assert.ok(row.includes(esc(when(post.at))));
      assert.ok(row.includes("Hide post…"));
      assert.ok(!row.includes('<em data-evidence='));
      for (const other of topic.posts.filter((p) => p.id !== post.id)) assert.ok(!row.includes(esc(other.body)));
      if (state) assert.ok(row.includes('aria-disabled="true"'));
    }
  }
});
