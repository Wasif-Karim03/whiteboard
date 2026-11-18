/* Whiteboard Phase 2 gate fixtures: figures for the six spine failure states (M5, R1).
   Sources: spec/docs/23-failure-scenarios-fixtures.html (failure ids and the pages that draw them); the
   figures, names and minute offsets are chosen by Claude under owner delegation (SOURCES.md). Each record's
   id is a WB.data.scenarios.failures id. Times are stored as minutes before the view clock and resolved by
   WB.sel.failureSample, so every scenario draws a consistent time. audience lists the roles that may read
   the sample. Fictional, "reconstructed". */
(function (root) {
  "use strict";
  var WB = root.WB;
  var sel = WB.sel;
  var PHYS = "phys110-f26";

  WB.defineFrozen(WB.data, "samples", {
    meta: { source: "reconstructed", basis: ["spec/docs/23-failure-scenarios-fixtures.html"] },
    failures: [
      { id: "upload-interrupted", course_id: PHYS, audience: ["student"], file: { name: "aisha-ps4-page3-sample.jpg", bytes: 3145728, kind: "jpg" }, sent_bytes: 1258291 },
      { id: "unsupported-file", course_id: PHYS, audience: ["student"], file: { name: "ps4-notes-sample.docx", bytes: 245760, kind: "docx" }, rule: "pdf-png-jpg-up-to-10-files" },
      { id: "offline-draft", course_id: PHYS, audience: ["student"], queued_minutes_ago: 3, pending_files: 1 },
      { id: "attempt-concurrent-submit", course_id: PHYS, audience: ["student"], assessment_id: "ps4", attempt: 1, accepted_minutes_ago: 1 },
      {
        id: "score-conflict", course_id: PHYS, audience: ["instructor", "ta"], assessment_id: "ps4", person_id: "aisha", question_id: "2", base_revision: 3,
        mine: { reviewer_id: "maya", score: 5, minutes_ago: 20 }, theirs: { reviewer_id: "reyes", score: 6, minutes_ago: 8, revision: 4 },
      },
      {
        id: "release-preview-stale", course_id: PHYS, audience: ["instructor"], assessment_id: "ps4", preview_revision: 3, current_revision: 4,
        changed: [{ person_id: "aisha", question_id: "2" }], previewed_minutes_ago: 12, changed_minutes_ago: 5,
      },
    ],
  });

  // "<name>_minutes_ago" becomes "<name>At" (camel case); a bare "minutes_ago" becomes "savedAt".
  var AGO = /^(.*)minutes_ago$/;
  function atKey(prefix) {
    if (!prefix) return "savedAt";
    return prefix.replace(/_$/, "").replace(/_([a-z])/g, function (m, c) { return c.toUpperCase(); }) + "At";
  }
  function resolve(x, clock) {
    if (Array.isArray(x)) return x.map(function (v) { return resolve(v, clock); });
    if (!x || typeof x !== "object") return x;
    var out = {};
    Object.keys(x).forEach(function (k) {
      var m = AGO.exec(k);
      if (m) out[atKey(m[1])] = sel.addMinutes(clock, -x[k]);
      else out[k] = resolve(x[k], clock);
    });
    return out;
  }
  // Every value of `key` anywhere in the record.
  function named(x, key) {
    if (Array.isArray(x)) return x.reduce(function (acc, v) { return acc.concat(named(v, key)); }, []);
    if (!x || typeof x !== "object") return [];
    return Object.keys(x).reduce(function (acc, k) { return acc.concat(k === key ? [x[k]] : named(x[k], key)); }, []);
  }
  function within(list, allowed) { return list.every(function (v) { return allowed.indexOf(v) >= 0; }); }

  // The sample for a failure state with its times resolved against the view clock, or null for an unknown
  // id, a viewer whose verified role is not in the audience, a student and another learner's sample, and a TA
  // outside the grading task's learners or questions (R1).
  WB.defineFrozen(sel, "failureSample", function (view, failureId, who) {
    var sample = view.data.samples.failures.filter(function (f) { return f.id === failureId; })[0];
    if (!sample) return null;
    var role = sel.verifiedRole(view, who, sample.course_id);
    if (!role || sample.audience.indexOf(role) < 0) return null;
    var people = named(sample, "person_id");
    if (role === "student" && !within(people, [who.personId])) return null;
    if (role === "ta") {
      var scope = sample.assessment_id ? sel.taScope(view, sample.assessment_id, who) : null;
      if (!scope || !within(people, scope.learnerIds) || !within(named(sample, "question_id"), scope.questionIds)) return null;
    }
    return WB.deepFreeze(resolve(sample, view.clock));
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
