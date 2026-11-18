/* W48 Grading queue (Phase 3 spine). Instructor and TA. Anchor: the problem-set assessment. One row per receipt the viewer may
   see (receiptsFor is TA-scoped), review state from gradeDraftFor, progress from receivedProgress and
   reviewProgress. iPhone is the review tier: handoff, read-only rows and the instructor's hold. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["permissionUnavailable", "loading", "firstUseEmpty", "filteredEmpty", "offline"];

  function itemId(a) { return P.assessmentId(a); }
  function motionId(a) { return a.sel.anchorFor("W19", "motion").record.id; }

  function stats(a) {
    var got = a.sel.receivedProgress(a.view, itemId(a), a.who);
    var done = a.sel.reviewProgress(a.view, itemId(a), a.who);
    var items = [
      got ? a.K.stat({ label: "Handed in", value: got.received + " of " + got.of }) : "",
      done ? a.K.stat({ label: "Reviewed", value: done.reviewed + " of " + done.of }) : "",
    ];
    var task = a.role === "ta" ? a.sel.taTaskAccess(a.view, itemId(a), a.who).task : null;
    if (task && task.grading_due) items.push(a.K.stat({ label: "Grading due", value: P.when(a, task.grading_due) }));
    if (task && task.access_end) items.push(a.K.stat({ label: "Your access ends", value: P.when(a, task.access_end) }));
    return a.K.grid(a.ctx, { items: items.filter(Boolean), cols: 4, compactCols: 2 });
  }

  function progressText(a) {
    var got = a.sel.receivedProgress(a.view, itemId(a), a.who);
    var done = a.sel.reviewProgress(a.view, itemId(a), a.who);
    return P.p([got ? "Handed in " + got.received + " of " + got.of : "", done ? "Reviewed " + done.reviewed + " of " + done.of : ""].filter(Boolean).join(". "));
  }

  function reviewText(a, r) {
    if (r.group_id) return "Not reviewed";
    var d = a.sel.gradeDraftFor(a.view, r.owner_id, r.assessment_id, a.who);
    return d && d.receipt_id === r.id && d.review_complete ? "Reviewed" : "Not reviewed";
  }

  function receiptRow(a, it, r) {
    var who = r.group_id ? a.sel.receiptGroupLabel(a.view, a.who, r.id) || r.group_id : P.personName(a, r.owner_id);
    var sub = r.group_id ? null : a.sel.submissionFor(a.view, r.owner_id, r.assessment_id);
    if (sub && sub.receipt_id && sub.receipt_id !== r.id) sub = null;
    var cells = {
      learner: esc(who), item: esc(it.title), ref: esc(r.id), at: esc(P.when(a, r.accepted_at)),
      status: sub ? P.status(a, sub, false) : "", review: esc(reviewText(a, r)),
    };
    var go = !a.selection && P.recordGo("W49", "receipt", r.id) || WB.Teaching.go(a, "W49", { assessmentId: r.assessment_id, receiptId: r.id, learnerId: r.owner_id || null });
    return go ? { id: r.id, cells: cells, go: go } : { id: r.id, cells: cells };
  }

  function rows(a, id) {
    if (a.state === "firstUseEmpty" || a.state === "filteredEmpty") return [];
    var it = a.sel.assessment(a.view, id);
    return a.sel.receiptsFor(a.view, id, a.who).map(function (r) { return receiptRow(a, it, r); });
  }
  function activeTask(a, id) {
    if (a.role !== "ta") return true;
    var access = a.sel.taTaskAccess(a.view, id, a.who);
    return Boolean(access.active && a.sel.taScope(a.view, id, a.who));
  }
  function mainAccess(a) {
    if (a.role !== "ta") return "";
    var access = a.sel.taTaskAccess(a.view, itemId(a), a.who);
    if (!access.task) return P.unallocatedNotice(a);
    if (P.taTaskEnded(a, itemId(a))) return P.taTaskEndedNotice(a, itemId(a));
    if (!activeTask(a, itemId(a))) return P.unallocatedNotice(a);
    return "";
  }

  function emptyFor(a) {
    if (a.state === "filteredEmpty") return { title: "No submissions match the filter", body: P.p("Other submissions are still in the queue."), action: { label: "Clear filters", note: "Preview only: filters are not wired" } };
    return a.role === "ta"
      ? { title: "Nothing received in this task", body: P.p("Submissions appear here once assigned learners hand in.") }
      : { title: "Nothing received yet", body: P.p("Submissions appear here once learners hand in.") };
  }

  function table(a, id, other) {
    var columns = [
      { key: "learner", label: "Learner", primary: true }, { key: "item", label: "Assignment" }, { key: "ref", label: "Receipt" },
      { key: "at", label: "Accepted" }, { key: "status", label: "Status" }, { key: "review", label: "Review" },
    ];
    return a.K.table(a.ctx, { id: P.id(a, other ? "other-queue" : "queue"), caption: other ? "Other assignment submissions" : "Submissions to grade", columns: columns, rows: rows(a, id), empty: emptyFor(a) });
  }

  function otherAssignments(a) {
    if (a.selection) return "";
    var id = motionId(a);
    if (!activeTask(a, id) || !rows(a, id).length) return "";
    var it = a.sel.assessment(a.view, id);
    return a.K.section({ title: "Other assignment: " + it.title, body: table(a, id, true), level: 2 });
  }

  // Instructor only: enrolled learners with no receipt for the assessment, as plain text with their status.
  function notIn(a) {
    if (a.role !== "instructor" || a.state === "firstUseEmpty" || a.state === "filteredEmpty") return "";
    var gb = a.sel.gradebook(a.view, a.who.courseId, a.who);
    var ids = a.sel.receiptsFor(a.view, itemId(a), a.who).reduce(function (out, r) { return out.concat(r.captured_members || [r.owner_id]); }, []);
    var items = (gb ? gb.rows : []).filter(function (row) { return ids.indexOf(row.personId) < 0; }).map(function (row) {
      var sub = a.sel.submissionFor(a.view, row.personId, itemId(a));
      return { title: row.name, meta: sub && sub.manual ? "Manual grade; no uploaded submission required" : undefined, trailing: sub ? P.status(a, sub, false) : "", go: WB.Teaching.go(a, "W49", { assessmentId: itemId(a), learnerId: row.personId, receiptId: null }) };
    });
    return items.length ? a.K.section({ title: "No uploaded receipt", body: a.K.list({ label: "Learners with no receipt", items: items }), level: 2 }) : "";
  }

  function links(a) {
    if (a.role === "ta") return P.p("Releasing feedback is the instructor's step");
    return P.links(a, [{ label: "Release feedback", go: "W53" }, { label: "Grading allocation", go: "W57" }]);
  }

  // SPINE-09: both tiers show the offline notice and the last-known flag.
  function offlineTop(a) {
    return a.state === "offline" ? P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown")]) : "";
  }

  function full(a) {
    var access = mainAccess(a);
    return P.stack(a, [offlineTop(a), access || P.stack(a, [stats(a), table(a, itemId(a), false), notIn(a), links(a)]), otherAssignments(a)]);
  }

  function review(a) {
    var hold = a.role === "instructor" ? [{ label: "Hold release for this assessment", note: "Preview only: nothing is held in this prototype" }] : [];
    var access = mainAccess(a);
    var handoff = P.handoff(a, { title: "Open on a larger screen", lastResult: access ? "" : progressText(a), protectiveActions: access ? [] : hold });
    return P.stack(a, [handoff, offlineTop(a), access || P.stack(a, [table(a, itemId(a), false), links(a)]), otherAssignments(a)]);
  }

  function body(a) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.state === "loading") return P.stack(a, [P.handoff(a, { title: "Open on a larger screen" }), P.loading(a, "the grading queue")]);
    return a.tier === "full" ? full(a) : review(a);
  }

  WB.definePage("W48", {
    states: STATES,
    na: P.na(STATES, { invalid: "The queue takes no typed input; marks are entered in the grader" }),
    render: function (a) {
      var it = a.sel.assessment(a.view, itemId(a));
      return P.shell(a, { title: "Grading queue: " + it.title, body: body(a) }, { page: "W48" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
