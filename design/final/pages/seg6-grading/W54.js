/* W54 Grade correction and regrade review (Phase 3, seg6-grading; decision 6.04). Instructor and TA, course-level.
   No review request record exists, so the page says so and shows, inline, the released Quiz 2 snapshot a request
   would concern (amendment A8: no W27 or W23 link). Every decision control is disabled with its reason; a
   correction stays held until released separately. A TA sees no learner, score or receipt. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "offline", "permissionUnavailable", "firstUseEmpty"];
  var NO_REQUEST = "There is no open request";

  function receiptOf(a) {
    var receipt = a.selection && a.selection.receiptId ? P.receiptById(a, a.selection.receiptId) : P.receiptById(a, a.sel.anchorFor("W27", "quiz2").record.id);
    return receipt && receipt.course_id === a.who.courseId && (!a.selection || !a.selection.assessmentId || a.selection.assessmentId === receipt.assessment_id) && (!a.selection || !a.selection.learnerId || a.selection.learnerId === receipt.owner_id) ? receipt : null;
  }

  function request(a) {
    return a.K.empty({ title: "No review request is on record at this point", body: P.p("A request starts from released feedback. The released result it would concern is shown below.") });
  }

  function evidence(a, rec) {
    var itemId = rec.assessment_id;
    var learner = rec.owner_id;
    var res = a.sel.resultFor(a.view, learner, itemId, a.who);
    if (!res || res.status === null) return a.K.notice({ tone: "info", title: "Feedback for this work has not been released, so no review can be requested" });
    var snaps = (a.sel.releasesFor(a.view, itemId, a.who) || []).filter(function (s) {
      return s.entries.some(function (e) { return e.person_id === learner; });
    });
    var rows = [
      { label: "Learner", value: P.personName(a, learner) },
      { label: "Assessment", value: a.sel.assessment(a.view, itemId).title },
      { label: "Receipt", value: rec.id },
    ];
    var last = snaps[snaps.length - 1];
    if (last) rows.push({ label: "Released snapshot", value: "Version " + last.version + " · " + P.when(a, last.released_at) });
    if (res.score !== null) rows.push({ label: "Released score", value: P.score(res.score, res.max) });
    if (res.comment) rows.push({ label: "Released comment", value: res.comment });
    if (snaps.length) rows.push({ label: "Earlier versions stay on record", value: snaps.map(function (s) { return "Version " + s.version; }).join(", ") });
    return a.K.section({ title: "Released result", body: a.K.kv(rows), level: 2 });
  }

  function decision(a) {
    var off = function (label, reason, key) { return a.K.button({ label: label, disabled: true, reason: reason, id: P.id(a, key) }); };
    return P.stack(a, [
      off("Start review", NO_REQUEST, "start"), off("Request typed clarification", NO_REQUEST, "clarify"),
      off("Save correction as held", NO_REQUEST, "hold"), off("Decline with reason", NO_REQUEST, "decline"),
      off("Release approved correction", "No completed held correction", "release"),
      P.p("A correction stays held until it is released separately"),
    ]);
  }

  // Record-true course links: the release and queue pages open the problem-set record they are labelled with.
  function links(a) {
    var id = a.selection ? P.assessmentId(a) : a.sel.anchorFor("W53").record.id;
    var title = a.sel.assessment(a.view, id).title;
    var release = a.selection ? WB.Teaching.go(a, "W53", { assessmentId: id, learnerId: null, receiptId: null }) : P.recordGo("W53", "assessment", id);
    var queue = a.selection ? WB.Teaching.go(a, "W48", { assessmentId: id, learnerId: null, receiptId: null }) : P.recordGo("W48", "assessment", id);
    return P.links(a, [
      release ? { label: "Release feedback: " + title, go: release } : null,
      { label: "Gradebook", go: "W51" }, queue ? { label: "Grading queue: " + title, go: queue } : null,
    ]);
  }

  function top(a) { return a.state === "offline" ? P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown")]) : ""; }

  // R06: a review-tier protective action follows the same blocking states as the web controls.
  function guarded(a, action, key, reasons) {
    var reason = Object.prototype.hasOwnProperty.call(reasons, a.state) ? reasons[a.state] : "";
    return reason ? { label: action.label, disabled: true, reason: reason, id: P.id(a, key) } : action;
  }
  function instructor(a, rec) {
    if (a.tier !== "full") {
      var keep = [guarded(a, { label: "Keep the current result as released", note: "Preview only: nothing is changed in this prototype" }, "keep", { offline: "You're offline" })];
      return P.stack(a, [P.handoff(a, { title: "Open on a larger screen", protectiveActions: keep }), top(a), request(a), evidence(a, rec), links(a)]);
    }
    var main = P.stack(a, [top(a), request(a), evidence(a, rec), links(a)]);
    return a.K.rail(a.ctx, { main: main, rail: decision(a), railLabel: "Decision" });
  }

  // R01: the frame role alone is not membership; the viewer must hold that role in the course.
  function member(a) { return a.sel.verifiedRole(a.view, a.who, a.who.courseId) === a.role; }
  function denied(a) { return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a, "You are not teaching this course")]); }
  function body(a) {
    if (P.taEnded(a)) return P.stack(a, [P.bareHandoff(a), P.taEndedNotice(a, null)]);
    if (a.state === "permissionUnavailable") return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a, a.role === "instructor" ? "You are not teaching this course" : null)]);
    if (!member(a)) return denied(a);
    var rec = receiptOf(a);
    if (a.role === "ta") return P.stack(a, [P.bareHandoff(a), rec ? "" : P.unallocatedNotice(a), P.p("Only the instructor decides a correction")]);
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "review requests")]);
    if (!rec) return P.stack(a, [P.bareHandoff(a), request(a), links(a)]);
    return instructor(a, rec);
  }

  WB.definePage("W54", {
    states: STATES,
    na: P.na(STATES, {
      invalid: "No review request is on record, so no decision can be typed or saved", saving: "No review request is on record, so no decision can be typed or saved",
      saveFailed: "No review request is on record, so no decision can be typed or saved", conflict: "No review request is on record, so no decision can be typed or saved",
      success: "No decision can be recorded without a request",
    }),
    render: function (a) { return P.shell(a, { title: a.page.title, body: body(a) }, { page: "W54" }); },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
