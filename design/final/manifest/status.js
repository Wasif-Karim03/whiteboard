/* Whiteboard Phase 2b: the only bridge from record states to kit status keys.
   Source: design/final/decisions.md BD39 (who sees which word), C6 (no grading hint before release), C4 (no
   recall of a released snapshot); kit/API.md "Status vocabulary (ownership)". This file holds keys only; the
   kit (core.js) owns every word and its visibility. Team plan §3 Step 3 with amendments A1, A3 and B2, and fix R12
   (correctionHeld shows the student priorVisible). */
(function (root) {
  "use strict";
  var WB = root.WB;

  // Submission and result records (coursework submissions and scenario overrides of them).
  var RECORD_STATES = ["notStarted", "draft", "queued", "received", "graded", "held", "released", "correctionHeld", "feedbackUpdated", "missing", "excused"];
  // Announcement records (fixtures/comms.js).
  var ANNOUNCEMENT_STATES = ["published", "scheduled", "draft", "withdrawn"];

  // student: before the outcome is released; studentReleased: after; staff: instructor and TA.
  // "prior" means the student sees the snapshot in record.priorVisible {state, released}: an unreleased
  // excusal, and a held correction (R12: the latest released snapshot stays visible until the correction is
  // released; staff see held).
  var TABLE = {
    notStarted: { student: "notStarted", studentReleased: "notStarted", staff: null },
    draft: { student: "draft", studentReleased: "draft", staff: null },
    queued: { student: "queued", studentReleased: "queued", staff: null },
    received: { student: "receivedNotReleased", studentReleased: "receivedNotReleased", staff: "received" },
    graded: { student: "receivedNotReleased", studentReleased: "receivedNotReleased", staff: "graded" },
    held: { student: "receivedNotReleased", studentReleased: "receivedNotReleased", staff: "held" },
    released: { student: "released", studentReleased: "released", staff: "released" },
    correctionHeld: { student: "prior", studentReleased: "prior", staff: "held" },
    feedbackUpdated: { student: "released", studentReleased: "feedbackUpdated", staff: "released" },
    missing: { student: "notReceivedClosed", studentReleased: "missing", staff: "missing" },
    excused: { student: "prior", studentReleased: "excused", staff: "excused" },
  };
  var LATE_KEYS = ["received", "receivedNotReleased"];

  function fail(what) {
    throw new Error("WB.manifest.status.keyFor: " + what);
  }

  // Returns {key, late, released} or null. `released` is the release flag of the snapshot actually shown,
  // so callers pass it on to the kit's visibility rule unchanged.
  function keyFor(record, role, opts) {
    if (!record || typeof record !== "object") fail("record must be an object");
    var own = !opts || opts.own !== false;
    var row = TABLE[record.state];
    if (!row) fail("unknown record state '" + record.state + "'");
    if (role === "guest") return null;
    var isStaff = role === "instructor" || role === "ta";
    if (!isStaff && role !== "student") fail("unknown role '" + role + "'");
    if (role === "student" && !own) return null;
    var released = record.released === true;
    var key;
    if (isStaff) {
      key = row.staff;
    } else {
      key = released ? row.studentReleased : row.student;
      if (key === "prior") {
        var prior = record.priorVisible;
        if (!prior || typeof prior !== "object") fail("an unreleased excusal or a held correction needs priorVisible {state, released}");
        if (prior.state === "correctionHeld") fail("priorVisible cannot itself be 'correctionHeld'");
        // R16: a released excusal is terminal (it resolves to excused); an unreleased one would need recursion.
        if (prior.state === "excused" && prior.released !== true) fail("priorVisible 'excused' must be released");
        return keyFor({ state: prior.state, released: prior.released === true, late: record.late }, role, opts);
      }
    }
    if (key === null) return null;
    return { key: key, late: record.late === true && LATE_KEYS.indexOf(key) >= 0, released: released };
  }

  WB.defineFrozen(WB.manifest, "status", {
    RECORD_STATES: RECORD_STATES,
    ANNOUNCEMENT_STATES: ANNOUNCEMENT_STATES,
    TABLE: TABLE,
    keyFor: keyFor,
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
