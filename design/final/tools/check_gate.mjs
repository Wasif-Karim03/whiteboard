// Phase 2 gate checks (M1–M10, R1–R9): release authority, release history, held payloads, immutable
// overrides, the ps4_released ending, anchor and journey records and Activity links. Every rule is a pure
// function returning string[] errors; check_fixtures.mjs checkAll spreads them. Source checks only, not
// browser acceptance.
export const PHYS = "phys110-f26";
export const REYES = Object.freeze({ role: "instructor", personId: "reyes" });
export const MAYA = Object.freeze({ role: "ta", personId: "maya" });
export const AISHA = Object.freeze({ role: "student", personId: "aisha" });
export const BEN = Object.freeze({ role: "student", personId: "ben" });
export const CARMEN = Object.freeze({ role: "student", personId: "carmen" });

// M2: only a verified instructor may list, preview or release; at the default and ta_expired clocks.
export function checkReleaseAuthority(WB, data = WB.data) {
  const S = WB.sel;
  const errors = [];
  const expect = (label, got, want) => { if (got !== want) errors.push(`release authority: ${label} is ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`); };
  for (const id of ["default", "ta_expired"]) {
    const v = S.buildView(data, id);
    for (const [name, who] of [["maya", MAYA], ["aisha", AISHA], ["no viewer", undefined]]) {
      expect(`${id} releaseReady for ${name}`, S.releaseReady(v, "ps4", who), null);
      expect(`${id} releasePreview for ${name}`, S.releasePreview(v, PHYS, "aisha", "ps4", who), null);
      expect(`${id} canRelease for ${name}`, S.canRelease(v, who, PHYS), false);
    }
    expect(`${id} canRelease for reyes`, S.canRelease(v, REYES, PHYS), true);
  }
  return errors;
}

const views = (WB, data) => Object.keys(data.scenarios.clocks).map((id) => WB.sel.buildView(data, id));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const OUTCOMES = ["scored", "excused", "missing"];

// Snapshots of one item that contain the learner, oldest version first, and the latest entry among them.
function latestFor(d, personId, itemId) {
  const list = d.grades.releases.filter((r) => r.item_id === itemId && r.entries.some((e) => e.person_id === personId)).sort((a, b) => a.version - b.version);
  const last = list.at(-1);
  return last ? { release: last, entry: last.entries.find((e) => e.person_id === personId), earlier: list.length > 1 } : null;
}

function entryErrors(tag, rel, e, item, questions) {
  const errors = [];
  const at = `${tag}: ${rel.id} entry ${e.person_id}`;
  if (!OUTCOMES.includes(e.status)) errors.push(`${at} status '${e.status}' is not scored, excused or missing`);
  if (e.status === "scored") {
    if (typeof e.score !== "number" || e.score < 0 || !item || e.score > item.max) errors.push(`${at} score ${e.score} is not within the item maximum`);
  } else if (e.score !== null) errors.push(`${at} has a score but is ${e.status}`);
  if (e.marks) {
    const keys = Object.keys(e.marks);
    if (!keys.every((k) => questions.includes(k))) errors.push(`${at} marks name a question the item does not have`);
    const sum = keys.reduce((n, k) => n + e.marks[k], 0);
    if (sum !== e.score) errors.push(`${at} marks sum to ${sum}, not the score ${e.score}`);
  }
  return errors;
}

// R5: release history is append-only and the results agree with the latest snapshot only.
export function checkReleases(WB, data = WB.data) {
  const errors = [];
  for (const v of views(WB, data)) {
    const d = v.data;
    const tag = `releases[${v.id}]`;
    const ids = d.grades.releases.map((r) => r.id);
    if (new Set(ids).size !== ids.length) errors.push(`${tag}: release ids are not unique`);
    const byItem = {};
    for (const r of d.grades.releases) (byItem[r.item_id] ||= []).push(r);
    for (const [itemId, list] of Object.entries(byItem)) {
      const sorted = [...list].sort((a, b) => a.version - b.version);
      sorted.forEach((r, i) => {
        if (r.version !== i + 1) errors.push(`${tag}: ${itemId} version ${r.version} breaks the sequence 1…${sorted.length}`);
        if (i > 0 && !WB.sel.isBefore(sorted[i - 1].released_at, r.released_at)) errors.push(`${tag}: ${r.id} is not later than version ${sorted[i - 1].version}`);
      });
    }
    for (const r of d.grades.releases) {
      const people = r.entries.map((e) => e.person_id);
      if (new Set(people).size !== people.length) errors.push(`${tag}: ${r.id} has more than one entry for a learner`);
      const item = d.grades.grade_items.find((x) => x.id === r.item_id);
      const questions = (d.coursework.assessments.find((a) => a.id === r.item_id)?.questions || []).map((q) => q.id);
      for (const e of r.entries) errors.push(...entryErrors(tag, r, e, item, questions));
      for (const e of r.entries) {
        const latest = latestFor(d, e.person_id, r.item_id);
        if (latest.release !== r) continue;
        const res = d.grades.results.find((x) => x.person_id === e.person_id && x.item_id === r.item_id);
        if (!res || !same([res.released.status, res.released.score], [e.status, e.score])) errors.push(`${tag}: ${r.id} entry ${e.person_id} has no matching released result`);
      }
    }
    for (const res of d.grades.results) {
      if (res.released.status === null) continue;
      const latest = latestFor(d, res.person_id, res.item_id);
      if (!latest || !same([latest.entry.status, latest.entry.score], [res.released.status, res.released.score])) errors.push(`${tag}: result ${res.id} differs from its latest snapshot`);
    }
    for (const g of d.grades.grade_drafts) {
      const latest = latestFor(d, g.person_id, g.assessment_id);
      const carried = !!latest && latest.entry.draft_revision === g.revision;
      if ((g.release_state === "released") !== carried) errors.push(`${tag}: grade draft ${g.id} release_state '${g.release_state}' disagrees with the latest snapshot`);
    }
    const ps4 = d.coursework.assessments.find((a) => a.id === "ps4");
    const rubric = d.coursework.rubrics.find((r) => r.assessment_id === "ps4");
    const maxima = (list, key) => Object.fromEntries(list.map((x) => [x[key], x.max]));
    if (!rubric || !same(maxima(rubric.criteria, "question_id"), maxima(ps4.questions, "id"))) errors.push(`${tag}: the PS4 rubric maxima differ from the question maxima`);
  }
  return errors;
}

// Receipts and release snapshots are never replaced or removed by a scenario override (L5).
export function checkImmutableOverrides(data) {
  const locked = ["coursework.receipts", "groups.receipts", "grades.releases"];
  const errors = [];
  for (const [id, list] of Object.entries(data.scenarios.overrides)) {
    for (const o of list) if (locked.includes(`${o.dataset}.${o.collection}`) && o.op !== "add") errors.push(`overrides[${id}]: ${o.op} of ${o.dataset}.${o.collection} '${o.id}' (only add is allowed)`);
  }
  return errors;
}

// R9: a held payload (a reviewed grade draft whose revision the latest snapshot does not carry) is mirrored
// by the result's pending value. With no held payload, pending is null unless no grade draft exists for it
// (a non-draft outcome such as a pending Missing).
export function checkHeldPayloadSync(WB, data = WB.data) {
  const errors = [];
  for (const v of views(WB, data)) {
    const d = v.data;
    for (const res of d.grades.results) {
      const draft = d.grades.grade_drafts.find((g) => g.person_id === res.person_id && g.assessment_id === res.item_id);
      const latest = latestFor(d, res.person_id, res.item_id);
      const held = draft && draft.review_complete && !(latest && latest.entry.draft_revision === draft.revision);
      const tag = `held payload[${v.id}]: ${res.id}`;
      if (held) {
        const score = Object.values(draft.marks).reduce((n, x) => n + x, 0);
        if (!same(res.pending, { status: "scored", score })) errors.push(`${tag} pending ${JSON.stringify(res.pending)} differs from the held payload ${score}`);
      } else if (res.pending !== null && draft) errors.push(`${tag} has a pending value but no held payload`);
    }
    // REV-04: every held draft has exactly one result carrying its pending outcome.
    for (const draft of d.grades.grade_drafts) {
      const latest = latestFor(d, draft.person_id, draft.assessment_id);
      if (!draft.review_complete || (latest && latest.entry.draft_revision === draft.revision)) continue;
      const matches = d.grades.results.filter((r) => r.person_id === draft.person_id && r.item_id === draft.assessment_id);
      if (matches.length !== 1) errors.push(`held payload[${v.id}]: held draft ${draft.id} has ${matches.length} results, expected exactly one`);
    }
  }
  return errors;
}

// REV-03: a review record and the matching grade draft agree on completion wherever both exist.
export function checkReviewDraftAgreement(WB, data = WB.data) {
  const errors = [];
  for (const v of views(WB, data)) {
    for (const r of v.data.staff.reviews) {
      const draft = v.data.grades.grade_drafts.find((g) => g.person_id === r.person_id && g.assessment_id === r.assessment_id);
      if (draft && draft.review_complete !== r.reviewed) errors.push(`reviews[${v.id}]: ${r.id} reviewed ${r.reviewed} disagrees with grade draft ${draft.id} review_complete ${draft.review_complete}`);
    }
  }
  return errors;
}

// M5: the J03 ending exists and reads from records.
export function checkReleasedScenario(WB, data = WB.data) {
  const S = WB.sel;
  const errors = [];
  const expect = (label, got, want) => { if (!same(got, want)) errors.push(`ps4_released: ${label} is ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`); };
  const v = S.buildView(data, "ps4_released");
  expect("learner total", S.courseTotal(v, PHYS, "aisha", AISHA)?.display, "85.17%");
  expect("staff total", S.courseTotal(v, PHYS, "aisha", REYES)?.display, "85.17%");
  expect("releaseReady", S.releaseReady(v, "ps4", REYES), [{ personId: "ben", included: false, reason: "notReady", revised: false }]);
  expect("fingerprint", S.releasePreview(v, PHYS, "aisha", "ps4", REYES)?.fingerprint, null);
  expect("courseworkCounts(aisha)", S.courseworkCounts(v, PHYS, "aisha"), { all: 8, toDo: 0, handedIn: 2, released: 5 });
  return errors;
}

// ---------- Anchors, journeys and Activity links (M7, R3, R7) ----------
const LOOKUP = {
  course: (d) => d.world.courses,
  person: (d) => d.world.people,
  assessment: (d) => d.coursework.assessments,
  draft: (d) => d.coursework.drafts,
  rubric: (d) => d.coursework.rubrics,
  receipt: (d) => [...d.coursework.receipts, ...d.groups.receipts],
  release: (d) => d.grades.releases,
  policy: (d) => [d.grades.policy],
  attempt: (d) => d.quiz.attempts,
  allowance: (d) => d.quiz.allowances,
  announcement: (d) => d.comms.announcements,
  discussion: (d) => d.comms.discussions,
  groupSet: (d) => d.groups.group_sets,
  group: (d) => d.groups.group_sets.flatMap((s) => s.groups),
  task: (d) => d.staff.grading_tasks,
};

// The record a {type, id} reference names in a view, or null.
export function resolveRecord(view, ref) {
  if (!ref || !Object.hasOwn(LOOKUP, ref.type)) return null;
  return LOOKUP[ref.type](view.data).find((r) => r.id === ref.id) || null;
}

// The assessment a record belongs to, for the same-assessment rule.
function assessmentOf(type, record) {
  if (!record) return null;
  if (type === "assessment") return record.id;
  if (type === "receipt" || type === "draft") return record.assessment_id;
  if (type === "release") return record.item_id;
  if (type === "attempt") return record.quiz_id;
  return null;
}

export function checkAnchorRecords(WB) {
  const errors = [];
  for (const [pageId, a] of Object.entries(WB.manifest.anchors)) {
    const all = [[pageId, a], ...Object.entries(a.variants).map(([id, v]) => [`${pageId}:${id}`, v])];
    for (const [label, x] of all) {
      if (x.record && !resolveRecord(WB.sel.scenarioView(x.home), x.record)) errors.push(`anchors: ${label} ${x.record.type}:${x.record.id} does not resolve in ${x.home}`);
    }
  }
  return errors;
}

export function checkJourneyRecords(WB, journeys = WB.manifest.journeys) {
  const errors = [];
  for (const j of journeys) {
    j.steps.forEach((s, i) => {
      const anchor = WB.sel.anchorFor(s.page, s.token);
      if (s.token && !anchor) { errors.push(`journeys: ${j.id} step ${i + 1} ${s.page} token '${s.token}' has no anchor`); return; }
      if (!anchor || !anchor.record) return;
      if (!resolveRecord(WB.sel.buildView(WB.data, s.scenario), anchor.record)) {
        errors.push(`journeys: ${j.id} step ${i + 1} ${s.page} ${anchor.record.type}:${anchor.record.id} does not resolve in ${s.scenario}`);
      }
    });
  }
  return errors;
}

const GO = /^([A-Za-z0-9_-]+)(?::([a-z][a-z0-9-]*))?$/;
export function checkActivityLinks(WB, data = WB.data) {
  const errors = [];
  for (const v of views(WB, data)) {
    for (const item of v.data.activity.items) {
      const tag = `activity[${v.id}]: ${item.id}`;
      const m = GO.exec(item.go);
      const anchor = m && WB.sel.anchorFor(m[1], m[2]);
      if (!anchor || !anchor.record) { errors.push(`${tag} go '${item.go}' has no anchor`); continue; }
      const target = resolveRecord(v, anchor.record);
      if (!target) { errors.push(`${tag} ${anchor.record.type}:${anchor.record.id} does not resolve`); continue; }
      const same = anchor.record.type === item.ref.type && anchor.record.id === item.ref.id;
      const ref = resolveRecord(v, item.ref);
      const shared = assessmentOf(anchor.record.type, target);
      if (!same && !(shared && shared === assessmentOf(item.ref.type, ref))) errors.push(`${tag} go '${item.go}' does not match its ${item.ref.type}:${item.ref.id}`);
      const enrollment = v.data.world.enrollments.find((e) => e.person_id === item.person_id);
      const page = WB.manifest.pagesById[m[1]];
      if (!enrollment || !page.roles.includes(enrollment.role)) errors.push(`${tag} ${m[1]} does not allow ${item.person_id}'s role`);
    }
  }
  return errors;
}
