// Phase 2b fixture checks: offsets, weekdays, no baked display text, grade and quiz arithmetic, TA access,
// fictional-only data, deep freezing, counts, scenario time consistency and quiz attempts.
// Every rule is a pure function returning string[] errors; the CLI loads the real data with loadAll().
// Source checks only, not browser acceptance. Run: node design/final/tools/check_fixtures.mjs
import { pathToFileURL } from "node:url";
import { loadAll } from "./load_data.mjs";
import { REYES, MAYA, checkReleaseAuthority, checkReleases, checkImmutableOverrides, checkReleasedScenario, checkHeldPayloadSync, checkReviewDraftAgreement, checkAnchorRecords, checkJourneyRecords, checkActivityLinks } from "./check_gate.mjs";

const PHYS = "phys110-f26";
export const NOTICE = "Fictional HTML design fixtures. No real institution, person, credential, upload, grade, tool entitlement or integration.";
export const PEOPLE = ["aisha", "ben", "carmen", "reyes", "maya"];
export const FREE_TEXT = ["title", "body", "name", "notice"];
const ISO_START = /^\d{4}-\d\d-\d\dT/;
const ISO_FULL = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)([+-]\d\d:\d\d)$/;
const WEEKDAY = /\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/;
const N_OF_M = /\b\d+ (of|\/) \d+\b/;
const MONTH_DAY = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.? \d{1,2}\b/;
const SECRET_KEY = /password|token|secret|api_?key/i;
const TIME_KEYS = ["accepted_at", "received_at", "published_at", "started_at", "read_at", "acknowledged_at", "at", "released_at", "saved_at", "reviewed_at"];
const RECEIVED_FAMILY = ["received", "graded", "held", "released", "correctionHeld", "feedbackUpdated"];

// Calls visit(value, key, path, ancestors) for every node.
export function walk(x, visit, key = null, path = "", ancestors = []) {
  visit(x, key, path, ancestors);
  if (x && typeof x === "object") {
    const next = [...ancestors, x];
    for (const [k, v] of Object.entries(x)) walk(v, visit, Array.isArray(x) ? key : k, `${path}${Array.isArray(x) ? `[${k}]` : `.${k}`}`, next);
  }
}

export function isoStrings(data) {
  const out = [];
  walk(data, (v) => { if (typeof v === "string" && ISO_START.test(v)) out.push(v); });
  return out;
}

// US Eastern: -04:00 from the second Sunday of March 02:00 to the first Sunday of November 02:00 (local).
function nthSunday(year, month, n) {
  const first = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  return 1 + ((7 - first) % 7) + (n - 1) * 7;
}
export function easternOffset(year, month, day, hour) {
  const local = [month, day, hour];
  const start = [3, nthSunday(year, 3, 2), 2];
  const end = [11, nthSunday(year, 11, 1), 2];
  const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
  return cmp(local, start) >= 0 && cmp(local, end) < 0 ? "-04:00" : "-05:00";
}

export function checkOffsets(isoList) {
  const errors = [];
  for (const iso of isoList) {
    const m = ISO_FULL.exec(iso);
    if (!m) { errors.push(`offsets: '${iso}' is not YYYY-MM-DDTHH:MM:SS±HH:MM`); continue; }
    const want = easternOffset(+m[1], +m[2], +m[3], +m[4]);
    if (m[7] !== want) errors.push(`offsets: '${iso}' should use ${want} (US Eastern)`);
  }
  return errors;
}

export function checkWeekdays(WB, view = WB.sel.scenarioView("default")) {
  const S = WB.sel;
  const d = view.data;
  const find = (list, id) => list.find((x) => x.id === id) || {};
  const groupView = S.scenarioView("group_submission");
  const cases = [
    ["clock", view.clock, "Tue"],
    ["receipt AH-PHYS110-001", find(d.coursework.receipts, "AH-PHYS110-001").accepted_at, "Thu"],
    ["ps4 due", find(d.coursework.assessments, "ps4").due, "Fri"],
    ["quiz3 opens", find(d.quiz.quizzes, "quiz3").opens, "Wed"],
    ["quiz3 close", find(d.quiz.quizzes, "quiz3").close, "Thu"],
    ["maya access_end", S.accessEnd(view, "maya", PHYS), "Sun"],
    ["ann-quiz3 published_at", find(d.comms.announcements, "ann-quiz3").published_at, "Mon"],
    ["group receipt", find(groupView.data.groups.receipts, "AH-PHYS110-GROUP-001").accepted_at, "Thu"],
  ];
  const errors = [];
  for (const [what, iso, want] of cases) {
    if (!iso) { errors.push(`weekdays: ${what} is missing`); continue; }
    const got = S.weekday(iso, "short");
    if (got !== want) errors.push(`weekdays: ${what} (${iso}) is ${got}, expected ${want}`);
  }
  if (S.fmtDate(view.clock) !== "Tue Oct 20") errors.push(`weekdays: fmtDate(clock) is '${S.fmtDate(view.clock)}'`);
  if (S.fmtTime(view.clock) !== "4:00 PM") errors.push(`weekdays: fmtTime(clock) is '${S.fmtTime(view.clock)}'`);
  return errors;
}

// No weekday word, percent sign, "N of M" or month-day text outside free-text fields. A weekday inside free
// text must equal the weekday of the nearest record's aboutAt.
export function checkNoBakedText(data, sel) {
  const errors = [];
  walk(data, (v, key, path, ancestors) => {
    if (typeof v !== "string" || ISO_START.test(v)) return;
    if (FREE_TEXT.includes(key)) {
      const m = WEEKDAY.exec(v);
      if (!m) return;
      const owner = [...ancestors].reverse().find((a) => a && !Array.isArray(a) && typeof a.aboutAt === "string");
      if (!owner) { errors.push(`baked text: ${path} names '${m[1]}' but its record has no aboutAt`); return; }
      const want = m[1].length > 3 ? sel.weekday(owner.aboutAt, "long") : sel.weekday(owner.aboutAt, "short");
      if (m[1] !== want) errors.push(`baked text: ${path} says '${m[1]}' but aboutAt ${owner.aboutAt} is ${want}`);
      return;
    }
    if (WEEKDAY.test(v)) errors.push(`baked text: ${path} contains a weekday ('${v}')`);
    if (v.includes("%")) errors.push(`baked text: ${path} contains '%' ('${v}')`);
    if (N_OF_M.test(v)) errors.push(`baked text: ${path} contains an 'N of M' count ('${v}')`);
    if (MONTH_DAY.test(v)) errors.push(`baked text: ${path} contains month-day text ('${v}')`);
  });
  return errors;
}

const BAD_OUTPUT = /NaN|Infinity|undefined/;
function clean(label, value, errors) {
  if (BAD_OUTPUT.test(JSON.stringify(value) ?? "undefined")) errors.push(`grades: ${label} output contains NaN, Infinity or undefined (${JSON.stringify(value)})`);
}

export function checkGrades(WB, view = WB.sel.scenarioView("default")) {
  const S = WB.sel;
  const errors = [];
  const expect = (label, got, want) => { if (got !== want) errors.push(`grades: ${label} is ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`); };
  const learner = S.courseTotal(view, PHYS, "aisha", REYES, { as: "learner" });
  const staff = S.courseTotal(view, PHYS, "aisha", REYES);
  const after = S.courseTotal(view, PHYS, "aisha", REYES, { as: "learner", assumeReleased: ["ps4"] });
  expect("learner total", learner.display, "84.50%");
  expect("staff total", staff.display, "85.17%");
  expect("learner total after PS4 release", after.display, "85.17%");
  const preview = S.releasePreview(view, PHYS, "aisha", "ps4", REYES);
  expect("release preview before", preview.before, "84.50%");
  expect("release preview after", preview.after, "85.17%");

  const policy = view.data.grades.policy;
  const counted = (cats) => view.data.grades.grade_items
    .map((it) => ({ ...it, r: view.data.grades.results.find((r) => r.person_id === "aisha" && r.item_id === it.id) }))
    .filter((it) => it.r && it.r.released.status === "scored" && cats.includes(it.category))
    .map((it) => ({ category: it.category, score: it.r.released.score, max: it.max }));
  const labsEmpty = S.weightedTotal(policy.categories, counted(["assignments", "quizzes"]), policy.method);
  const allEmpty = S.weightedTotal(policy.categories, [], policy.method);
  expect("labs-empty total", labsEmpty.display, "82.67%");
  expect("labs-empty represented weight", labsEmpty.representedWeight, 75);
  expect("all-empty display", allEmpty.display, null);
  expect("all-empty value", allEmpty.value, null);
  const canon = [{ category: "c", score: 10, max: 10 }, { category: "c", score: 50, max: 100 }];
  const equal = S.weightedTotal([{ id: "c", weight: 100 }], canon, "equal");
  const prop = S.weightedTotal([{ id: "c", weight: 100 }], canon, "proportional");
  expect("equal method", equal.display, "75.00%");
  expect("proportional method", prop.display, "54.55%");
  const draft = S.draftTotal(view, "aisha", "ps4", REYES);
  expect("PS4 draft total", draft && `${draft.score}/${draft.max}`, "27/30");

  const g = view.data.grades.golden;
  const r = (t) => (t.value === null ? null : S.round2(t.value));
  expect("golden learner_released", g.learner_released, r(learner));
  expect("golden staff_draft", g.staff_draft, r(staff));
  expect("golden learner_after_ps4_release", g.learner_after_ps4_release, r(after));
  expect("golden labs_empty", g.labs_empty, r(labsEmpty));
  expect("golden all_empty", g.all_empty, r(allEmpty));
  expect("golden equal", g.equal_vs_proportional.equal, r(equal));
  expect("golden proportional", g.equal_vs_proportional.proportional, r(prop));
  for (const [label, v] of [["learner", learner], ["staff", staff], ["after", after], ["labsEmpty", labsEmpty], ["allEmpty", allEmpty], ["equal", equal], ["proportional", prop], ["draft", draft]]) clean(label, v, errors);
  for (const p of ["aisha", "ben", "carmen"]) {
    clean(`${p} learner`, S.courseTotal(view, PHYS, p, { role: "student", personId: p }), errors);
    clean(`${p} staff`, S.courseTotal(view, PHYS, p, REYES), errors);
  }
  for (const cat of policy.categories) clean(`category ${cat.id}`, S.categoryPercent(view, PHYS, "aisha", cat.id, REYES, { as: "learner" }), errors);
  return errors;
}

export function checkQuiz(WB, view = WB.sel.scenarioView("default")) {
  const S = WB.sel;
  const errors = [];
  const expect = (label, got, want) => { if (got !== want) errors.push(`quiz: ${label} is ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`); };
  const close = view.data.quiz.quizzes.find((q) => q.id === "quiz3").close;
  const at = (hhmm) => close.replace(/T\d\d:\d\d/, `T${hhmm}`);
  expect("effectiveMinutes(quiz3, aisha)", S.effectiveMinutes(view, "quiz3", "aisha"), 30);
  const threshold = S.lateStartThreshold(view, "quiz3", "aisha");
  expect("aisha late-start threshold time", S.fmtTime(threshold), "11:29 PM");
  expect("aisha late-start threshold weekday", S.weekday(threshold, "short"), "Thu");
  expect("deadline for a 11:20 PM start", S.fmtTime(S.effectiveDeadline(view, "quiz3", "aisha", at("23:20"))), "11:50 PM");
  expect("deadline for a 11:50 PM start", S.fmtTime(S.effectiveDeadline(view, "quiz3", "aisha", at("23:50"))), "11:59 PM");
  expect("minutes for a 11:50 PM start", S.availableMinutes(view, "quiz3", "aisha", at("23:50")), 9);
  expect("ben late-start threshold time", S.fmtTime(S.lateStartThreshold(view, "quiz3", "ben")), "11:39 PM");
  return errors;
}

export function checkTaAccess(WB, data = WB.data) {
  const S = WB.sel;
  const errors = [];
  const view = S.buildView(data, "default");
  const end = S.accessEnd(view, "maya", PHYS);
  if (!end) return ["ta access: maya has no access end"];
  if (S.fmtShortDate(end) !== "Oct 25") errors.push(`ta access: end date is '${S.fmtShortDate(end)}'`);
  if (S.fmtTime(end) !== "11:59 PM") errors.push(`ta access: end time is '${S.fmtTime(end)}'`);
  if (S.weekday(end, "short") !== "Sun") errors.push(`ta access: end weekday is '${S.weekday(end, "short")}'`);
  if (S.taAccessActive(view, "maya", PHYS) !== true) errors.push("ta access: should be active at the default clock");
  const expired = S.buildView(data, "ta_expired");
  if (S.taAccessActive(expired, "maya", PHYS) !== false) errors.push("ta access: should have ended at the ta_expired clock");
  if (view.data.staff.grading_tasks.some((t) => t.release_permission !== false)) errors.push("ta access: a grading task grants release permission");
  return errors;
}

export function checkFictional(WB, data = WB.data) {
  const errors = [];
  if (data.world?.notice !== NOTICE) errors.push("fictional: world.notice differs from the doc 22 text");
  for (const [name, mod] of Object.entries(data)) if (mod?.meta?.source !== "reconstructed") errors.push(`fictional: ${name}.meta.source is not "reconstructed"`);
  walk(data, (v, key, path) => {
    if (key && SECRET_KEY.test(key)) errors.push(`fictional: ${path} has a credential-like key`);
    if (typeof v !== "string") return;
    if ((key === "email" || key === "support") && !/@[a-z0-9.-]+\.example$/.test(v)) errors.push(`fictional: ${path} '${v}' is not an .example address`);
    if (/host$/.test(key || "") && !/\.example$/.test(v)) errors.push(`fictional: ${path} '${v}' is not an .example host`);
    if (/@/.test(v) && /@[a-z0-9-]+\.[a-z]/i.test(v) && !/\.example\b/.test(v)) errors.push(`fictional: ${path} contains a non-.example address`);
  });
  const ids = (data.world?.people || []).map((p) => p.id);
  if (JSON.stringify([...ids].sort()) !== JSON.stringify([...PEOPLE].sort())) errors.push(`fictional: people are ${ids.join(", ")}`);
  return errors;
}

function tryThrows(fn) {
  try { fn(); return false; } catch { return true; }
}

export function checkFrozen(WB) {
  const errors = [];
  for (const root of ["data", "manifest", "sel"]) {
    walk(WB[root], (v, key, path) => { if (v && typeof v === "object" && !Object.isFrozen(v)) errors.push(`frozen: WB.${root}${path} is not frozen`); });
    const before = WB[root];
    const replaced = tryThrows(() => { WB[root] = {}; });
    if (!replaced && WB[root] !== before) errors.push(`frozen: WB.${root} could be replaced`);
    if (!tryThrows(() => { WB[root].extraKey = 1; })) errors.push(`frozen: a key could be added to WB.${root}`);
  }
  if (!tryThrows(() => { WB.data.world.people[0].name = "x"; })) errors.push("frozen: a nested record could be changed");
  if (!tryThrows(() => WB.defineFrozen(WB.data, "late", {}))) errors.push("frozen: WB.defineFrozen accepted a definition after finalize");
  const view = WB.sel.scenarioView("default");
  if (!Object.isFrozen(view) || !Object.isFrozen(view.data.coursework.submissions[0])) errors.push("frozen: scenarioView is not deep-frozen");
  return errors;
}

export function checkCounts(WB, view = WB.sel.scenarioView("default")) {
  const S = WB.sel;
  const errors = [];
  const expect = (label, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) errors.push(`counts: ${label} is ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`); };
  expect("courseworkCounts(aisha)", S.courseworkCounts(view, PHYS, "aisha"), { all: 8, toDo: 2, handedIn: 1, released: 4 });
  expect("receivedProgress(ps4)", S.receivedProgress(view, "ps4", REYES), { received: 2, of: 3 });
  expect("reviewProgress(ps4, instructor)", S.reviewProgress(view, "ps4", { role: "instructor", personId: "reyes" }), { reviewed: 1, of: 2 });
  expect("reviewProgress(ps4, maya)", S.reviewProgress(view, "ps4", MAYA), { reviewed: 1, of: 2 });
  expect("releaseReady(ps4)", S.releaseReady(view, "ps4", REYES).map((x) => `${x.personId}:${x.included}:${x.reason}`), ["aisha:true:ready", "ben:false:notReady"]);
  const topic = view.data.comms.discussions.find((t) => t.id === "projectile");
  expect("replyCount(projectile)", S.replyCount(view, "projectile"), topic ? topic.posts.length - 1 : null);
  expect("topicAuthor(projectile)", S.topicAuthor(view, "projectile"), "aisha");
  return errors;
}

// Time consistency of one resolved view (B3): nothing exists after the clock, receipts and their
// submissions agree, Missing only after close, grading records only for received work.
export function checkTemporal(WB, view) {
  const S = WB.sel;
  const d = view.data;
  const errors = [];
  const tag = `temporal[${view.id}]`;
  walk(d, (v, key, path) => {
    if (TIME_KEYS.includes(key) && typeof v === "string" && ISO_START.test(v) && S.isBefore(view.clock, v)) errors.push(`${tag}: ${path} ${v} is after the clock ${view.clock}`);
  });
  const subFor = (p, a) => d.coursework.submissions.find((s) => s.person_id === p && s.assessment_id === a);
  const receipts = [...d.coursework.receipts, ...d.groups.receipts];
  for (const r of receipts) {
    for (const p of r.captured_members || [r.owner_id]) {
      const s = subFor(p, r.assessment_id);
      if (!s || ["notStarted", "draft", "queued"].includes(s.state)) errors.push(`${tag}: receipt ${r.id} but ${p}'s ${r.assessment_id} is ${s ? s.state : "absent"}`);
    }
  }
  for (const s of d.coursework.submissions) {
    if (s.receipt_id && !receipts.some((r) => r.id === s.receipt_id)) errors.push(`${tag}: ${s.id} names receipt ${s.receipt_id}, which does not exist yet`);
    if (s.state === "missing") {
      const item = d.coursework.assessments.find((a) => a.id === s.assessment_id);
      const close = item?.close || d.quiz.quizzes.find((q) => q.id === s.assessment_id)?.close;
      if (!close || S.isBefore(view.clock, close)) errors.push(`${tag}: ${s.id} is missing before its close`);
    }
  }
  const needsReceived = (label, p, a, allowMissing) => {
    const s = subFor(p, a);
    const ok = s && (RECEIVED_FAMILY.includes(s.state) || (allowMissing && s.state === "missing"));
    if (!ok) errors.push(`${tag}: ${label} for ${p} ${a} but the submission is ${s ? s.state : "absent"}`);
  };
  // A saved draft exists only while its owner's (or every captured member's) submission is still a draft.
  for (const dr of d.coursework.drafts) {
    for (const p of dr.person_id ? [dr.person_id] : dr.captured_members) {
      const s = subFor(p, dr.assessment_id);
      if (!s || s.state !== "draft") errors.push(`${tag}: saved draft ${dr.id} but ${p}'s ${dr.assessment_id} is ${s ? s.state : "absent"}`);
    }
  }
  for (const g of d.grades.grade_drafts) needsReceived("grade draft", g.person_id, g.assessment_id, false);
  for (const r of d.staff.reviews) needsReceived("review", r.person_id, r.assessment_id, false);
  for (const r of d.grades.results) if (r.pending) needsReceived("pending result", r.person_id, r.item_id, r.pending.status === "missing");
  for (const t of d.quiz.attempts) {
    const deadline = S.effectiveDeadline(view, t.quiz_id, t.person_id, t.started_at);
    if (t.received_at && S.isBefore(deadline, t.received_at)) errors.push(`${tag}: attempt ${t.id} received after its deadline ${deadline}`);
    const upper = t.received_at && S.isBefore(t.received_at, view.clock) ? t.received_at : view.clock;
    for (const a of t.answers) {
      if (a.acknowledged_at === null) continue;
      if (S.isBefore(a.acknowledged_at, t.started_at) || S.isBefore(upper, a.acknowledged_at)) errors.push(`${tag}: answer ${a.item_id} acknowledged outside the attempt`);
    }
  }
  return errors;
}

export function checkAllTemporal(WB) {
  return WB.sel.scenarioIds().flatMap((id) => checkTemporal(WB, WB.sel.scenarioView(id)));
}

// A6: the quiz attempt timeline.
export function checkAttempts(WB) {
  const S = WB.sel;
  const errors = [];
  const expect = (label, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) errors.push(`attempts: ${label} is ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`); };
  expect("default attempt", S.attemptFor(S.scenarioView("default"), "quiz3", "aisha"), null);
  const live = S.scenarioView("quiz_in_progress");
  const t = S.attemptFor(live, "quiz3", "aisha");
  if (!t) return [...errors, "attempts: quiz_in_progress has no attempt"];
  expect("W26 deadline", S.fmtTime(S.effectiveDeadline(live, "quiz3", "aisha", t.started_at)), "10:30 AM");
  expect("quiz_in_progress attemptView", S.attemptView(live, "quiz3", "aisha"), { active: true, secondsLeft: 1200, acknowledged: 2, unsent: 1, deadline: "2026-10-21T10:30:00-04:00" });
  const got = S.scenarioView("quiz_received");
  const done = S.attemptFor(got, "quiz3", "aisha");
  expect("quiz_received receipt", done && done.receipt_id, "AH-PHYS110-Q3-001");
  expect("quiz_received time", done && S.fmtTime(done.received_at), "10:24 AM");
  expect("quiz_received attemptView", S.attemptView(got, "quiz3", "aisha"), { active: false, secondsLeft: 0, acknowledged: 4, unsent: 0, deadline: "2026-10-21T10:30:00-04:00" });
  const late = S.scenarioView("late_quiz_start");
  const lt = S.attemptFor(late, "quiz3", "aisha");
  expect("late start available minutes", lt && S.availableMinutes(late, "quiz3", "aisha", lt.started_at), 9);
  expect("late start deadline", lt && S.fmtTime(S.effectiveDeadline(late, "quiz3", "aisha", lt.started_at)), "11:59 PM");
  for (const id of S.scenarioIds()) {
    const v = S.attemptView(S.scenarioView(id), "quiz3", "aisha");
    if (v && /NaN|Infinity|null/.test(JSON.stringify(v))) errors.push(`attempts: ${id} attemptView has NaN, Infinity or null (${JSON.stringify(v)})`);
  }
  return errors;
}

// B4: counts, receipts, grade availability and status keys all come from the same view.
export function checkScenarioConsistency(WB) {
  const S = WB.sel;
  const keyFor = WB.manifest.status.keyFor;
  const errors = [];
  const expect = (label, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) errors.push(`consistency: ${label} is ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`); };
  const hand = S.scenarioView("assignment_submission");
  expect("assignment_submission aisha ps4 key", keyFor(S.submissionFor(hand, "aisha", "ps4"), "student").key, "draft");
  expect("assignment_submission aisha ps4 receipts", S.receiptsFor(hand, "ps4", { role: "student", personId: "aisha" }).map((r) => r.id), []);
  expect("assignment_submission draftTotal", S.draftTotal(hand, "aisha", "ps4", REYES), null);
  expect("assignment_submission handedIn", S.courseworkCounts(hand, PHYS, "aisha").handedIn, 0);
  expect("assignment_submission ann-quiz3", hand.data.comms.announcements.some((a) => a.id === "ann-quiz3"), false);
  const group = S.scenarioView("group_submission");
  expect("group_submission aisha motion key", keyFor(S.submissionFor(group, "aisha", "motion"), "student").key, "receivedNotReleased");
  expect("group_submission aisha motion receipts", S.receiptsFor(group, "motion", { role: "student", personId: "aisha" }).map((r) => r.id), ["AH-PHYS110-GROUP-001"]);
  expect("group_submission carmen motion receipts", S.receiptsFor(group, "motion", { role: "student", personId: "carmen" }).map((r) => r.id), []);
  const base = S.scenarioView("default");
  expect("default motion receipts", S.receiptsFor(base, "motion", { role: "instructor", personId: "reyes" }).map((r) => r.id), []);
  expect("default aisha ps4 key", keyFor(S.submissionFor(base, "aisha", "ps4"), "student").key, "receivedNotReleased");
  expect("default maya ps4 receipts", S.receiptsFor(base, "ps4", { role: "ta", personId: "maya" }).map((r) => r.id).sort(), ["AH-PHYS110-001", "AH-PHYS110-002"]);
  return errors;
}

// R18 (chosen by Claude under owner delegation): a TA holds at most one grading task per assessment, so
// assessment-level access and scope are unambiguous. Checked on the base data and every resolved scenario.
export function checkTaskUniqueness(WB) {
  const errors = [];
  const views = [["base", WB.data], ...WB.sel.scenarioIds().map((id) => [id, WB.sel.scenarioView(id).data])];
  for (const [name, data] of views) {
    const seen = new Set();
    for (const t of data.staff.grading_tasks) {
      const key = `${t.ta_id}/${t.assessment_id}`;
      if (seen.has(key)) errors.push(`${name}: more than one grading task for ${key}`);
      seen.add(key);
    }
  }
  return errors;
}

export function checkAll(WB) {
  const view = WB.sel.scenarioView("default");
  return [
    ...checkOffsets(isoStrings(WB.data)),
    ...checkWeekdays(WB, view),
    ...checkNoBakedText(WB.data, WB.sel),
    ...checkGrades(WB, view),
    ...checkQuiz(WB, view),
    ...checkTaAccess(WB),
    ...checkTaskUniqueness(WB),
    ...checkFictional(WB),
    ...checkFrozen(WB),
    ...checkCounts(WB, view),
    ...checkAllTemporal(WB),
    ...checkAttempts(WB),
    ...checkScenarioConsistency(WB),
    ...checkReleaseAuthority(WB),
    ...checkReleases(WB),
    ...checkImmutableOverrides(WB.data),
    ...checkReleasedScenario(WB),
    ...checkHeldPayloadSync(WB),
    ...checkReviewDraftAgreement(WB),
    ...checkAnchorRecords(WB),
    ...checkJourneyRecords(WB),
    ...checkActivityLinks(WB),
  ];
}

function main() {
  const errors = checkAll(loadAll());
  for (const e of errors) console.log(e);
  console.log(`check_fixtures: ${errors.length} errors. Source checks only.`);
  return errors.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main();
