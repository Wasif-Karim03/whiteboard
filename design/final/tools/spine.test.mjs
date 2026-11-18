// Phase 3 spine tests, part 1 (plan §4 T1–T3, T10; addenda R03, R04, R07, R11): render matrix, definitions,
// the W21 committing action and the J02/J03 journeys. Every expected value is read from WB.sel here, never
// typed. Source checks only, not browser, device or accessibility acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import {
  WB, S, P, esc, SPINE, SCENARIOS, CTX3, CTX5, view, viewer, title, when, frame, direct, tokensOf, rolesOf, count,
  idsInMain, dialogOf, goLinks, goPages, disabledWith,
} from "./spine_helpers.mjs";

const homeOf = (id, variant) => (S.anchorFor(id, variant) || S.anchorFor(id) || { home: "default" }).home;
const fail = (list, label, problems) => { if (problems.length) list.push(`${label}: ${problems.slice(0, 3).join("; ")}`); };

function checkOne(bad, vs) {
  const label = `${vs.page} ${vs.platform}/${vs.width || vs.orientation || ""} ${vs.role} ${vs.token || "default"} ${vs.scenario}`;
  try {
    const f = frame(vs);
    const problems = [...f.problems];
    if (f.html.includes("Not built yet")) problems.push("placeholder text");
    if (f.blocked) problems.push("role blocked");
    for (const id of idsInMain(f.html)) if (!id.startsWith("t-")) problems.push(`id ${id} outside the frame ns`);
    fail(bad, label, problems);
  } catch (err) {
    bad.push(`${label} threw: ${err.message}`);
  }
}

// ---------- Structure ----------
test("structure: the 12 spine pages are real", () => {
  assert.equal(SPINE.length, 12);
  for (const id of SPINE) assert.equal(WB.pageFor(id).placeholder, false, id);
  for (const id of SPINE) for (const r of Object.values(WB.pageFor(id).na)) assert.ok(r.length > 0 && r.length <= 140, id);
});

test("T1: every spine page renders cleanly for each context, role, token, at default and home", () => {
  const bad = [];
  for (const page of SPINE) {
    for (const token of tokensOf(page)) {
      const isVariant = token && Object.hasOwn(WB.pageFor(page).variants, token);
      const scenarios = [...new Set(["default", homeOf(page, isVariant ? token : null)])];
      for (const scenario of scenarios) for (const c of CTX5) for (const role of rolesOf(page)) checkOne(bad, { page, token, scenario, role, ...c });
    }
  }
  assert.deepEqual(bad.slice(0, 20), []);
});

test("T1: every spine page's default view renders for every scenario and allowed role on 3 platforms", () => {
  const bad = [];
  for (const page of SPINE) for (const scenario of SCENARIOS) for (const role of rolesOf(page)) for (const c of CTX3) checkOne(bad, { page, scenario, role, ...c });
  assert.deepEqual(bad.slice(0, 20), []);
});

// ---------- T2 ----------
test("T2: definitions draw the required failure states and declare the anchor and presentation variants", () => {
  const need = { W20: ["saveFailed", "invalid", "offline"], W21: ["offline", "conflict"], W24: ["firstUseEmpty"], W48: ["permissionUnavailable"], W49: ["permissionUnavailable", "conflict"], W51: ["firstUseEmpty"], W53: ["conflict"] };
  for (const [id, states] of Object.entries(need)) for (const s of states) assert.ok(WB.pageFor(id).states.includes(s), `${id} ${s}`);
  for (const [id, a] of Object.entries(WB.manifest.anchors)) {
    if (!SPINE.includes(id)) continue;
    for (const v of Object.keys(a.variants)) assert.ok(Object.hasOwn(WB.pageFor(id).variants, v), `${id} ${v}`);
  }
  for (const v of ["confirm", "reviewed", "motion-reviewed"]) assert.ok(Object.hasOwn(WB.pageFor("W21").variants, v), `W21 ${v}`);
  for (const v of ["confirm", "acknowledged"]) assert.ok(Object.hasOwn(WB.pageFor("W53").variants, v), `W53 ${v}`);
});

// ---------- T3 / R11: W21 Submit ----------
const HOME = "assignment_submission";
const SUBMIT = "t-c-submit";

test("T3: W21 default is unconfirmed: Submit disabled with a reason, no opener, a link to the reviewed view", () => {
  for (const c of CTX3) {
    const f = frame({ page: "W21", role: "student", scenario: HOME, ...c });
    assert.ok(disabledWith(f.html, "Confirm you have reviewed this exact attempt first"), c.platform);
    assert.ok(!f.html.includes('data-act="open-dialog"'), c.platform);
    assert.deepEqual(f.openDialogs, []);
    assert.ok(goLinks(f.html).includes("W21:reviewed"), c.platform);
  }
});

test("T3: W21:reviewed has the opener; W21:confirm opens the dialog with the exact payload and one W22 link", () => {
  const v = view(HOME);
  const st = viewer(HOME, "student");
  const draft = S.draftFor(v, "ps4", st);
  const item = S.assessment(v, "ps4");
  for (const c of CTX3) {
    const rev = frame({ page: "W21", token: "reviewed", role: "student", scenario: HOME, ...c });
    assert.match(rev.html, new RegExp(`data-act="open-dialog" data-target="${SUBMIT}"`), c.platform);
    assert.deepEqual(rev.openDialogs, []);
    const conf = frame({ page: "W21", token: "confirm", role: "student", scenario: HOME, ...c });
    assert.deepEqual(conf.openDialogs, [SUBMIT], c.platform);
    const dialog = dialogOf(conf.html, SUBMIT);
    for (const f of draft.files) for (const need of [f.name, S.fmtBytes(f.bytes), String(f.pages)]) assert.ok(dialog.includes(esc(need)), `${c.platform} ${need}`);
    for (const need of [String(draft.attempt), S.fmtDateTime(item.due), item.title]) assert.ok(dialog.includes(esc(need)), `${c.platform} ${need}`);
    assert.equal(count(conf.html, 'href="#/W22~default"'), 1, c.platform);
    assert.equal(count(dialog, 'href="#/W22~default"'), 1, c.platform);
  }
});

test("T3: W21:motion-reviewed names both captured members and the one group receipt destination", () => {
  const sc = "group_work_in_progress";
  const v = view(sc);
  const draft = S.draftFor(v, "motion", viewer(sc, "student"));
  for (const c of CTX3) {
    const f = frame({ page: "W21", token: "motion-reviewed", role: "student", scenario: sc, ...c });
    assert.match(f.html, /data-act="open-dialog"/);
    const dialog = dialogOf(f.html, SUBMIT);
    for (const m of draft.captured_members) assert.ok(dialog.includes(esc(S.person(v, m).name)), m);
    assert.equal(count(f.html, "#/W22:group~group_submission"), 1, c.platform);
    const plain = frame({ page: "W21", token: "motion", role: "student", scenario: sc, ...c });
    assert.ok(!plain.html.includes('data-act="open-dialog"'), "unconfirmed motion has no opener");
    assert.ok(goLinks(plain.html).includes("W21:motion-reviewed"));
  }
});

test("T3: W21 at default has no draft: no opener and no W22 scenario link; offline and conflict block Submit", () => {
  for (const c of CTX3) {
    for (const token of [null, "reviewed", "confirm"]) {
      const f = frame({ page: "W21", token, role: "student", scenario: "default", ...c });
      assert.ok(!f.html.includes('data-act="open-dialog"'), `${token}`);
      assert.ok(!f.html.includes("#/W22~"), `${token}`);
      assert.deepEqual(f.openDialogs, []);
    }
    assert.ok(disabledWith(frame({ page: "W21", token: "offline", role: "student", scenario: HOME, ...c }).html, "You're offline. Nothing has been sent"));
    const conflict = frame({ page: "W21", token: "conflict", role: "student", scenario: HOME, ...c }).html;
    const sample = S.failureSample(view(HOME), "attempt-concurrent-submit", viewer(HOME, "student"));
    assert.ok(disabledWith(conflict, `Attempt ${sample.attempt} is already in`));
    assert.ok(conflict.includes(esc(when(sample.acceptedAt))));
    for (const state of ["offline", "conflict", "saving"]) {
      const d = direct("W21", { ...c, role: "student", scenario: HOME, state, variant: "confirm" });
      assert.deepEqual(d.openDialogs, [], `${state} wins over confirm`);
      assert.ok(!d.html.includes('data-act="open-dialog"'), state);
    }
  }
});

// ---------- R03: presentation variants off home ----------
test("R03: W21:confirm and W53:confirm keep their presentation off home and draw no dialog without the record", () => {
  const w21 = frame({ page: "W21", token: "confirm", role: "student", scenario: "default" });
  assert.ok(goLinks(w21.html).includes("W21:confirm~assignment_submission"));
  const w53 = frame({ page: "W53", token: "confirm", role: "instructor", scenario: "ps4_released" });
  assert.deepEqual(w53.openDialogs, []);
  assert.ok(disabledWith(w53.html, "Nothing is ready to release"));
  assert.deepEqual(frame({ page: "W53", token: "confirm", role: "instructor", scenario: "default" }).openDialogs, ["t-c-release"]);
});

// ---------- R04: closing time ----------
test("R04: after close, W19:motion and W21:motion keep the draft visible but offer no hand-in", () => {
  const sc = "ta_expired";
  const item = S.assessment(view(sc), "motion");
  const reason = `Closed on ${when(item.close)}`;
  for (const c of CTX3) {
    for (const [page, token] of [["W19", "motion"], ["W21", "motion"], ["W21", "motion-reviewed"], ["W20", "motion"]]) {
      const f = frame({ page, token, role: "student", scenario: sc, ...c });
      assert.ok(!f.html.includes('data-act="open-dialog"'), `${page}:${token}`);
      assert.ok(!f.html.includes("#/W22:group~"), `${page}:${token}`);
      assert.ok(disabledWith(f.html, reason), `${page}:${token} ${c.platform}`);
    }
  }
});

// ---------- R07: record-true destinations ----------
test("R07: group records link their record variants", () => {
  const g = frame({ page: "W22", token: "group", role: "student", scenario: "group_submission" });
  assert.ok(goLinks(g.html).includes("W19:motion"));
  assert.ok(!goPages(g.html).includes("W23"), "R06: no feedback link for group work");
  const off = frame({ page: "W21", token: "motion", role: "student", scenario: "group_submission" });
  assert.ok(goLinks(off.html).includes("W22:group"));
  assert.ok(goLinks(off.html).includes("W21:motion~group_work_in_progress"));
  const w19 = frame({ page: "W19", token: "motion", role: "student", scenario: "group_submission" });
  assert.ok(goLinks(w19.html).includes("W22:group"));
});

// ---------- T10: journeys ----------
function stepFrame(step, c, token = step.token) {
  return frame({ page: step.page, role: step.role, scenario: step.scenario, token, ...c });
}

test("T10: J02 and J03 spine steps draw real pages with the record figures", () => {
  for (const jid of ["J02", "J03"]) {
    const steps = WB.manifest.journeys.find((j) => j.id === jid).steps.filter((s) => SPINE.includes(s.page));
    for (const step of steps) {
      for (const c of CTX3) {
        const f = stepFrame(step, c);
        assert.deepEqual(f.problems, [], `${jid} ${step.page}`);
        assert.ok(!f.html.includes("Not built yet"), `${jid} ${step.page}`);
        const v = view(step.scenario);
        const who = S.viewerFor(v, step.role);
        if (step.page === "W20") assert.ok(f.html.includes(esc(S.draftFor(v, "ps4", who).files[0].name)));
        if (step.page === "W22") assert.ok(f.html.includes(esc(S.receiptsFor(v, "ps4", who)[0].id)));
        if (step.page === "W23" || step.page === "W24") {
          const res = S.resultFor(v, who.personId, "ps4", who);
          assert.ok(f.html.includes(esc(P.score(res.score, res.max))), `${step.page} score`);
          assert.ok(f.html.includes(esc(S.courseTotal(v, who.courseId, who.personId, who).display)), `${step.page} total`);
        }
      }
    }
  }
});

test("T10: each spine step links on to the next step's page", () => {
  const j02 = WB.manifest.journeys.find((j) => j.id === "J02").steps;
  const j03 = WB.manifest.journeys.find((j) => j.id === "J03").steps;
  const at = (list, id) => list.find((s) => s.page === id);
  const pairs = [
    [at(j02, "W14"), "W18"], [at(j02, "W18"), "W19"], [at(j02, "W19"), "W20"], [at(j02, "W20"), "W21"],
    [at(j03, "W48"), "W49"], [at(j03, "W49"), "W53"], [at(j03, "W51"), "W53"], [at(j03, "W23"), "W24"],
  ];
  for (const c of CTX3) {
    for (const [step, next] of pairs) assert.ok(goPages(stepFrame(step, c).html).includes(next), `${step.page}→${next} ${c.platform}`);
    // W21 → W22: default → reviewed → dialog destination.
    const w21 = at(j02, "W21");
    assert.ok(goLinks(stepFrame(w21, c).html).includes("W21:reviewed"));
    const confirm = stepFrame(w21, c, "confirm");
    assert.ok(goPages(dialogOf(confirm.html, SUBMIT)).includes("W22"));
    // W53 → W23: the history at ps4_released carries the W23 link on every platform.
    const w53 = frame({ page: "W53", role: "instructor", scenario: "ps4_released", ...c });
    assert.ok(goPages(w53.html).includes("W23"), `W53→W23 ${c.platform}`);
  }
  // W53 on web: default → acknowledged → dialog destination.
  assert.ok(goLinks(frame({ page: "W53", role: "instructor" }).html).includes("W53:acknowledged"));
  const conf = frame({ page: "W53", token: "confirm", role: "instructor" });
  assert.ok(goLinks(dialogOf(conf.html, "t-c-release")).includes("W53~ps4_released"));
});

test("T10: the course total on W23 matches the selector at ps4_released", () => {
  const sc = "ps4_released";
  const v = view(sc);
  const st = viewer(sc, "student");
  const html = frame({ page: "W23", role: "student", scenario: sc }).html;
  assert.ok(html.includes(esc(S.courseTotal(v, st.courseId, st.personId, st).display)));
  assert.ok(html.includes(esc(title("ps4", sc))));
});
