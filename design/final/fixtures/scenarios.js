/* Whiteboard Phase 2b fixtures: scenario configuration (clocks, record overrides, failure scenarios) and the
   view resolver every data selector takes as its first argument.
   Sources: spec/docs/22-fixtures-overview.html (scenario_clock_overrides, scenario_record_overrides,
   quiz_attempt_scenario, late_quiz_start_scenario), spec/docs/23-failure-scenarios-fixtures.html (17 ids),
   board-deep-dive-2026-11-15.md:206 (hand-in clock Thu Oct 15), :1096 (Quiz 3 receipt), :1247 (group
   receipt), the board copy ("assignment_submission world, Thu Oct 15, 10:00 AM"). Other override times, the
   quiz_received, late_quiz_start and ps4_released scenarios and the failure state and page mapping are chosen by Claude
   under owner delegation (SOURCES.md). WB.data.scenarios is configuration only; records live in the other
   modules and are resolved per scenario by WB.sel.scenarioView. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var sel = WB.sel;
  var def = function (k, v) { return WB.defineFrozen(sel, k, v); };
  var PHYS = "phys110-f26";

  function sub(person, assessment, state, released, extra) {
    var r = { id: person + "-" + assessment, person_id: person, assessment_id: assessment, course_id: PHYS, state: state, released: released, late: false };
    Object.keys(extra || {}).forEach(function (k) { r[k] = extra[k]; });
    return r;
  }
  var replaceSub = function (record) { return { dataset: "coursework", collection: "submissions", id: record.id, op: "replace", record: record }; };
  var remove = function (dataset, collection, id) { return { dataset: dataset, collection: collection, id: id, op: "remove" }; };
  var add = function (dataset, collection, record) { return { dataset: dataset, collection: collection, id: record.id, op: "add", record: record }; };
  var replace = function (dataset, collection, record) { return { dataset: dataset, collection: collection, id: record.id, op: "replace", record: record }; };
  function answer(item, at) { return { item_id: item, value: "sample-answer-" + item, acknowledged_at: at }; }
  function attempt(startedAt, answers, receivedAt, receiptId) {
    return { id: "aisha-quiz3-1", person_id: "aisha", quiz_id: "quiz3", attempt: 1, started_at: startedAt, answers: answers, received_at: receivedAt, receipt_id: receiptId };
  }
  function failure(id, state, pages) { return { id: id, state: state, pages: pages }; }

  var GROUP_RECEIPT = {
    id: "AH-PHYS110-GROUP-001", assessment_id: "motion", course_id: PHYS, group_id: "team-orbit", membership_version: 1, captured_members: ["aisha", "ben"],
    actor_id: "ben", attempt: 1, status: "received", accepted_at: "2026-10-22T14:20:00-04:00", files: [{ name: "team-orbit-investigation-sample.pdf", pages: 6, bytes: 2621440 }],
  };
  var QUIZ_RECEIPT = {
    id: "AH-PHYS110-Q3-001", assessment_id: "quiz3", course_id: PHYS, owner_id: "aisha", actor_id: "aisha", attempt: 1, status: "received",
    accepted_at: "2026-10-21T10:24:00-04:00", assessment_version: 3, files: [], page_tags: [],
  };
  // The group hand-in and the Quiz 3 hand-in, shared by their own scenarios and by ps4_released.
  var GROUP_DONE = [
    remove("coursework", "drafts", "team-orbit-motion-draft"),
    add("groups", "receipts", GROUP_RECEIPT),
    replaceSub(sub("aisha", "motion", "received", false, { receipt_id: GROUP_RECEIPT.id })),
    replaceSub(sub("ben", "motion", "received", false, { receipt_id: GROUP_RECEIPT.id })),
  ];
  var QUIZ_DONE = [
    add("quiz", "attempts", attempt("2026-10-21T10:00:00-04:00", [
      answer("q1", "2026-10-21T10:03:00-04:00"),
      answer("q2", "2026-10-21T10:07:00-04:00"),
      answer("q3", "2026-10-21T10:15:00-04:00"),
      answer("q4", "2026-10-21T10:22:00-04:00"),
    ], QUIZ_RECEIPT.accepted_at, QUIZ_RECEIPT.id)),
    add("coursework", "receipts", QUIZ_RECEIPT),
    replaceSub(sub("aisha", "quiz3", "received", false, { receipt_id: QUIZ_RECEIPT.id })),
  ];
  // Phase 2 gate M5: Aisha's PS4 feedback released as version 1. The snapshot entry is built from the base
  // grade draft so its marks, comments and revision are never retyped. Ben is not in the snapshot.
  var PS4_DRAFT = WB.data.grades.grade_drafts[0];
  var PS4_RECEIPT = WB.data.coursework.receipts[0];
  function withKeys(record, extra) {
    var out = {};
    Object.keys(record).forEach(function (k) { out[k] = record[k]; });
    Object.keys(extra).forEach(function (k) { out[k] = extra[k]; });
    return out;
  }
  var PS4_RELEASED = [
    replaceSub(sub("carmen", "motion", "missing", false)),
    replaceSub(sub("aisha", "ps4", "released", true, { receipt_id: PS4_RECEIPT.id })),
    replace("grades", "results", { id: "aisha-ps4", person_id: "aisha", item_id: "ps4", released: { status: "scored", score: 27 }, pending: null }),
    replace("grades", "grade_drafts", withKeys(PS4_DRAFT, { release_state: "released" })),
    add("grades", "releases", {
      id: "rel-ps4-1", course_id: PHYS, item_id: "ps4", version: 1, released_at: "2026-10-27T09:00:00-04:00", actor_id: "reyes",
      entries: [{
        person_id: "aisha", status: "scored", score: 27, receipt_id: PS4_DRAFT.receipt_id, rubric_version: PS4_DRAFT.rubric_version,
        draft_revision: PS4_DRAFT.revision, marks: PS4_DRAFT.marks, comment: PS4_DRAFT.overall_comment, question_comments: PS4_DRAFT.comments,
      }],
    }),
  ];

  WB.defineFrozen(WB.data, "scenarios", {
    meta: { source: "reconstructed", basis: ["spec/docs/22-fixtures-overview.html", "spec/docs/23-failure-scenarios-fixtures.html", "board-deep-dive-2026-11-15.md:206,1096,1247"] },
    clocks: {
      default: WB.data.world.clock,
      ta_unassigned: WB.data.world.clock,
      ta_handover: WB.data.world.clock,
      math_released: "2026-10-20T17:00:00-04:00",
      assignment_submission: "2026-10-15T10:00:00-04:00",
      group_work_in_progress: "2026-10-20T16:00:00-04:00",
      group_submission: "2026-10-22T14:30:00-04:00",
      quiz_in_progress: "2026-10-21T10:10:00-04:00",
      quiz_received: "2026-10-21T10:30:00-04:00",
      late_quiz_start: "2026-10-22T23:55:00-04:00",
      ta_expired: "2026-10-26T09:00:00-04:00",
      ps4_released: "2026-10-27T16:00:00-04:00",
    },
    overrides: {
      default: [],
      ta_unassigned: [],
      ta_handover: [add("teaching", "history", {
        id: "handover-maya-ps4", course_id: PHYS, ta_id: "maya", assessment_id: "ps4", at: "2026-10-20T15:00:00-04:00", kind: "handover", actor_id: "reyes", from_ta_id: "maya", to_instructor_id: "reyes"
      })],
      math_released: [
        replace("coursework", "submissions", { id: "aisha-math-assignment", person_id: "aisha", assessment_id: "math-assignment", course_id: "math220-f26", state: "released", released: true, late: false, receipt_id: "AH-MATH220-001" }),
        replace("grades", "results", { id: "aisha-math-assignment", person_id: "aisha", item_id: "math-assignment", released: { status: "scored", score: 8 }, pending: null }),
        replace("grades", "grade_drafts", withKeys(WB.data.grades.grade_drafts.filter(function (d) { return d.id === "aisha-math-assignment"; })[0], { release_state: "released" })),
        add("grades", "releases", { id: "rel-math-assignment-1", course_id: "math220-f26", item_id: "math-assignment", version: 1, released_at: "2026-10-20T16:30:00-04:00", actor_id: "reyes", entries: [{ person_id: "aisha", status: "scored", score: 8, receipt_id: "AH-MATH220-001", rubric_version: 1, draft_revision: 1, marks: { q1: 8 }, comment: "Explain why the column vectors are independent.", question_comments: { q1: "Check the final row operation." } }] })
      ],
      // Before the PS4 hand-in: Aisha's PS4 is a draft with no review, draft or result; Carmen's is not
      // missing yet (close has not passed). The receipt itself drops out by projection.
      assignment_submission: [
        replaceSub(sub("aisha", "ps4", "draft", false)),
        replaceSub(sub("carmen", "ps4", "notStarted", false)),
        remove("grades", "results", "aisha-ps4"),
        remove("grades", "results", "carmen-ps4"),
        remove("grades", "grade_drafts", "aisha-ps4"),
        remove("staff", "reviews", "aisha-ps4"),
        add("coursework", "drafts", {
          id: "aisha-ps4-draft", person_id: "aisha", group_id: null, assessment_id: "ps4", course_id: PHYS, attempt: 1, assessment_version: 2,
          saved_at: "2026-10-15T09:58:00-04:00", files: [{ id: "f1", name: "aisha-ps4-sample.pdf", pages: 4, bytes: 1843200, kind: "pdf", processing: "ready" }],
          page_tags: PS4_RECEIPT.page_tags,
        }),
        remove("grades", "grade_drafts", "aisha-math-assignment"),
        remove("grades", "results", "aisha-math-assignment"),
        replace("coursework", "submissions", { id: "aisha-math-assignment", person_id: "aisha", assessment_id: "math-assignment", course_id: "math220-f26", state: "received", released: false, late: false, receipt_id: "AH-MATH220-000" }),
      ],
      group_work_in_progress: [
        replaceSub(sub("aisha", "motion", "draft", false)),
        replaceSub(sub("ben", "motion", "draft", false)),
      ],
      group_submission: GROUP_DONE,
      quiz_in_progress: [
        add("quiz", "attempts", attempt("2026-10-21T10:00:00-04:00", [
          answer("q1", "2026-10-21T10:03:00-04:00"),
          answer("q2", "2026-10-21T10:07:00-04:00"),
          answer("q3", null),
        ], null, null)),
        replaceSub(sub("aisha", "quiz3", "draft", false)),
      ],
      quiz_received: QUIZ_DONE,
      late_quiz_start: [
        add("quiz", "attempts", attempt("2026-10-22T23:50:00-04:00", [], null, null)),
        replaceSub(sub("aisha", "quiz3", "draft", false)),
      ],
      ta_expired: [],
      ps4_released: GROUP_DONE.concat(QUIZ_DONE, PS4_RELEASED),
    },
    // state is a WB.manifest.states id; pages are the pages that must draw it.
    failures: [
      failure("wrong-institution", "permissionUnavailable", ["W01", "W02"]),
      failure("invite-expired", "permissionUnavailable", ["W03"]),
      failure("source-delayed", "offline", ["W07", "W32"]),
      failure("module-locked", "notYetAvailable", ["W16", "W17"]),
      failure("upload-interrupted", "saveFailed", ["W20"]),
      failure("unsupported-file", "invalid", ["W20"]),
      failure("offline-draft", "offline", ["W20", "W21"]),
      failure("attempt-concurrent-submit", "conflict", ["W21"]),
      failure("ta-expired", "permissionUnavailable", ["W48", "W49", "W05"]),
      failure("score-conflict", "conflict", ["W49"]),
      failure("release-preview-stale", "conflict", ["W53"]),
      failure("weights-not-100", "invalid", ["W52"]),
      failure("empty-category", "firstUseEmpty", ["W24", "W51"]),
      failure("group-membership-changed", "conflict", ["W34", "W47"]),
      failure("quiz-save-unacknowledged", "saving", ["W26"]),
      failure("import-unsupported-type", "invalid", ["W60"]),
      failure("calendar-permission-denied", "deviceDenied", ["W07"]),
    ],
  });

  // ---------- View resolution (pure; base data is never touched) ----------
  function clone(x) {
    if (Array.isArray(x)) return x.map(clone);
    if (x && typeof x === "object") {
      var out = {};
      Object.keys(x).forEach(function (k) { out[k] = clone(x[k]); });
      return out;
    }
    return x;
  }
  function records(data, dataset, collection) {
    var list = data[dataset] && data[dataset][collection];
    if (!Array.isArray(list)) throw new Error("WB.sel.applyOverrides: unknown collection " + dataset + "." + collection);
    return list;
  }

  // Applies override entries in order to a copy of `data`.
  function applyOverrides(data, overrides) {
    var out = clone(data);
    (overrides || []).forEach(function (o) {
      var list = records(out, o.dataset, o.collection);
      var at = list.map(function (r) { return r.id; }).indexOf(o.id);
      if (o.op === "add") {
        if (at >= 0) throw new Error("WB.sel.applyOverrides: add of existing '" + o.id + "'");
        out[o.dataset][o.collection] = list.concat([clone(o.record)]);
      } else if (o.op === "replace" || o.op === "remove") {
        if (at < 0) throw new Error("WB.sel.applyOverrides: " + o.op + " of missing '" + o.id + "'");
        out[o.dataset][o.collection] = o.op === "remove"
          ? list.filter(function (r) { return r.id !== o.id; })
          : list.map(function (r) { return r.id === o.id ? clone(o.record) : r; });
      } else {
        throw new Error("WB.sel.applyOverrides: unknown op '" + o.op + "'");
      }
    });
    return out;
  }

  // Projection rule for historical views: a record whose primary timestamp is after the clock does not exist
  // yet. Receipts (accepted_at), attempts (started_at), announcements (published_at), read markers (read_at),
  // posts and activity items (at), release snapshots (released_at) and saved drafts (saved_at) drop out; revisions after the clock are trimmed so an announcement shows its
  // last earlier revision; a topic with no posts left drops out; an attempt received later is shown unreceived.
  function projectToClock(data, clock) {
    var notLater = function (iso) { return !sel.isBefore(clock, iso); };
    var out = clone(data);
    out.coursework.receipts = out.coursework.receipts.filter(function (r) { return notLater(r.accepted_at); });
    out.groups.receipts = out.groups.receipts.filter(function (r) { return notLater(r.accepted_at); });
    out.quiz.attempts = out.quiz.attempts.filter(function (t) { return notLater(t.started_at); }).map(function (t) {
      if (t.received_at === null || notLater(t.received_at)) return t;
      var c = clone(t);
      c.received_at = null;
      c.receipt_id = null;
      return c;
    });
    out.comms.announcements = out.comms.announcements.filter(function (a) { return notLater(a.published_at); }).map(function (a) {
      var c = clone(a);
      c.revisions = a.revisions.filter(function (r) { return notLater(r.at); });
      return c;
    }).filter(function (a) { return a.revisions.length > 0; });
    out.comms.readMarkers = out.comms.readMarkers.filter(function (m) { return notLater(m.read_at); });
    out.comms.discussions = out.comms.discussions.map(function (t) {
      var c = clone(t);
      c.posts = t.posts.filter(function (p) { return notLater(p.at); });
      return c;
    }).filter(function (t) { return t.posts.length > 0; });
    out.activity.items = out.activity.items.filter(function (x) { return notLater(x.at); });
    out.grades.releases = out.grades.releases.filter(function (r) { return notLater(r.released_at); });
    out.coursework.drafts = out.coursework.drafts.filter(function (d) { return notLater(d.saved_at); });
    return out;
  }

  function withoutConfig(data) {
    var out = {};
    Object.keys(data).forEach(function (k) { if (k !== "scenarios") out[k] = data[k]; });
    return out;
  }

  // Resolves a scenario against any data set (the checks pass modified copies); `project: false` skips the
  // projection rule (used only to prove the temporal check catches it).
  function buildView(data, scenarioId, opts) {
    var cfg = data.scenarios;
    if (!cfg || !Object.prototype.hasOwnProperty.call(cfg.clocks, scenarioId)) throw new Error("WB.sel.scenarioView: unknown scenario '" + scenarioId + "'");
    var clock = cfg.clocks[scenarioId];
    var applied = applyOverrides(withoutConfig(data), cfg.overrides[scenarioId] || []);
    // Staffing examples operate on the copied course enrollment/allocation, preserving saved attribution.
    if (["ta_unassigned", "ta_handover"].indexOf(scenarioId) >= 0) {
      applied.staff.grading_tasks = applied.staff.grading_tasks.filter(function (t) { return t.course_id !== PHYS; });

    }
    var projected = opts && opts.project === false ? applied : projectToClock(applied, clock);
    return WB.deepFreeze({ id: scenarioId, clock: clock, data: projected });
  }

  def("applyOverrides", applyOverrides);
  def("projectToClock", projectToClock);
  def("buildView", buildView);
  def("scenarioIds", function () { return Object.keys(WB.data.scenarios.clocks); });
  def("scenarioView", function (scenarioId) { return buildView(WB.data, scenarioId); });
})(typeof globalThis !== "undefined" ? globalThis : this);
