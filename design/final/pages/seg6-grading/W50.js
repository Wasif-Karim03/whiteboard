/* W50 Rubric-change impact preview (Phase 3, seg6-grading). Instructor and TA. Anchor: the problem-set rubric. No
   candidate rubric version exists in the fixtures, so the page draws the current version, who a change would
   recalculate (held results only) and the released snapshots it can never touch; Apply stays disabled. A TA
   sees only the assigned questions and their own progress. Notes: pages/seg6-grading/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "conflict", "offline", "permissionUnavailable"];
  var NO_CANDIDATE = "No candidate version to apply";
  var NOTE = "Preview only: nothing is recalculated in this prototype";

  function rubricId(a) { return a.sel.anchorFor("W50").record.id; }
  function itemOf(a) {
    var id = rubricId(a);
    return P.assessments(a).filter(function (x) { return x.rubric_id === id; })[0] || null;
  }

  function criteriaTable(a, rubric, keep) {
    var rows = rubric.criteria.filter(function (c) { return !keep || keep.indexOf(c.question_id) >= 0; }).map(function (c) {
      return { id: c.question_id, cells: { q: esc("Question " + c.question_id), title: esc(c.title), max: esc(String(c.max)) } };
    });
    return a.K.table(a.ctx, {
      id: P.id(a, "criteria"), caption: "Current version " + rubric.version,
      columns: [{ key: "q", label: "Question", primary: true }, { key: "title", label: "Criterion" }, { key: "max", label: "Points", numeric: true }],
      rows: rows, empty: { title: "No criteria", body: P.p("This rubric has no criteria in your scope.") },
    });
  }

  function candidate(a) {
    var go = P.recordGo("W44", "rubric", rubricId(a));
    return a.K.empty({ title: "No candidate version saved", body: P.p("A change is drafted in the rubric editor first."), action: go ? { label: "Edit rubric", go: go } : undefined });
  }

  function impactRows(a, item) {
    var receipts = a.sel.receiptsFor(a.view, item.id, a.who);
    return (a.sel.releaseReady(a.view, item.id, a.who) || []).map(function (r) {
      var d = a.sel.gradeDraftFor(a.view, r.personId, item.id, a.who);
      var rec = receipts.filter(function (x) { return x.owner_id === r.personId; })[0];
      var go = rec ? P.recordGo("W49", "receipt", rec.id) : null;
      var cells = { learner: esc(P.personName(a, r.personId)), now: esc(marked(d) ? P.score(d.total.score, d.total.max) : ""), effect: esc(effectText(r, d)) };
      return go ? { id: r.personId, cells: cells, go: go } : { id: r.personId, cells: cells };
    });
  }
  // R09: release readiness is not the draft. A draft with marks but an incomplete review is still affected.
  function marked(d) { return Boolean(d && d.total && Object.keys(d.marks || {}).length); }
  function effectText(r, d) {
    if (r.included) return "Held: would be recalculated";
    if (marked(d)) return "Marked, review not complete: its marks would be recalculated";
    return "Not scored yet: nothing to recalculate";
  }

  function impactTable(a, item) {
    return a.K.table(a.ctx, {
      id: P.id(a, "impact"), caption: "Results a change would recalculate",
      columns: [{ key: "learner", label: "Learner", primary: true }, { key: "now", label: "Current draft" }, { key: "effect", label: "Effect" }],
      rows: impactRows(a, item), empty: { title: "Nothing held", body: P.p("No held result would be recalculated.") },
    });
  }

  function snapshots(a, item) {
    var list = a.sel.releasesFor(a.view, item.id, a.who) || [];
    if (!list.length) return a.K.empty({ title: "Nothing released yet", body: P.p("Released snapshots are listed here and never change.") });
    var items = list.map(function (s) {
      var names = s.entries.map(function (e) { return P.personName(a, e.person_id); }).join(", ");
      return { title: "Version " + s.version + " · " + P.when(a, s.released_at), meta: names + ". Immutable: not changed by a rubric change" };
    });
    return a.K.section({ title: "Released, excluded", body: a.K.list({ label: "Released snapshots", items: items }), level: 2 });
  }

  function top(a) {
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown")]);
    if (a.state !== "conflict") return "";
    return a.K.notice({ tone: "error", title: "The impact preview is out of date", body: P.p("What changed is not drawn: there is no sample record.") });
  }

  function decision(a) {
    var applyReason = a.state === "conflict" ? "Refresh the impact first" : NO_CANDIDATE;
    var refresh = a.state === "offline"
      ? a.K.button({ label: "Refresh impact", disabled: true, reason: "You're offline", id: P.id(a, "refresh") })
      : a.K.button({ label: "Refresh impact", note: NOTE });
    return P.stack(a, [
      a.K.field({ id: P.id(a, "mode"), label: "Application mode", type: "select", options: [{ value: "held", label: "Recalculate held results" }, { value: "future", label: "Future grading only" }], disabled: true, reason: NO_CANDIDATE }),
      a.K.button({ label: "Apply reviewed change", kind: "primary", disabled: true, reason: applyReason, id: P.id(a, "apply") }),
      refresh,
    ]);
  }

  function links(a, item) {
    if (a.role !== "instructor") return P.links(a, [{ label: "Grading queue: " + item.title, go: P.recordGo("W48", "assessment", item.id) }]);
    var lib = P.recordGo("W43", "rubric", rubricId(a));
    return P.links(a, [{ label: "Gradebook", go: "W51" }, lib ? { label: "Rubric library", go: lib } : null, { label: "Grade review requests", go: "W54" }]);
  }

  function instructorFull(a, item, rubric) {
    var main = P.stack(a, [top(a), criteriaTable(a, rubric, null), candidate(a), impactTable(a, item), snapshots(a, item), links(a, item)]);
    return a.K.rail(a.ctx, { main: main, rail: decision(a), railLabel: "Decision" });
  }

  function taBody(a, item, rubric, scope) {
    var done = a.sel.reviewProgress(a.view, item.id, a.who);
    var propose = a.K.button({ label: "Submit proposal", disabled: true, reason: "No candidate version to propose", id: P.id(a, "propose") });
    return P.stack(a, [
      top(a), criteriaTable(a, rubric, scope.questionIds),
      done ? P.p("You have reviewed " + done.reviewed + " of " + done.of) : "",
      a.tier === "full" ? propose : "", P.p("Applying a rubric change is the instructor's step"), links(a, item),
    ]);
  }

  // R06: a review-tier protective action follows the same blocking states as the web controls.
  function guarded(a, action, key, reasons) {
    var reason = Object.prototype.hasOwnProperty.call(reasons, a.state) ? reasons[a.state] : "";
    return reason ? { label: action.label, disabled: true, reason: reason, id: P.id(a, key) } : action;
  }
  function review(a, item, rubric) {
    var hold = guarded(a, { label: "Hold recalculation for this rubric", note: "Preview only: nothing is held in this prototype" }, "hold", { offline: "You're offline", conflict: "Refresh the impact first" });
    var handoff = P.handoff(a, { title: "Open on a larger screen", protectiveActions: [hold] });
    var items = rubric.criteria.map(function (c) { return { title: "Question " + c.question_id + ": " + c.title, meta: c.max + " points" }; });
    return P.stack(a, [handoff, top(a), a.K.list({ label: "Current version " + rubric.version, items: items }), impactTable(a, item), snapshots(a, item), links(a, item)]);
  }

  // R01: the frame role alone is not membership; the viewer must hold that role in the course.
  function member(a) { return a.sel.verifiedRole(a.view, a.who, a.who.courseId) === a.role; }
  function denied(a) { return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a, "You are not teaching this course")]); }
  function body(a) {
    var item = itemOf(a);
    var gate = P.staffGate(a, item ? item.id : null);
    if (gate) return gate;
    if (!member(a)) return denied(a);
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "the impact preview")]);
    var rubric = item ? a.sel.rubricFor(a.view, item.id, a.who) : null;
    if (!rubric) return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a)]);
    if (a.role === "ta") {
      var scope = a.sel.taTaskAccess(a.view, item.id, a.who).active ? a.sel.taScope(a.view, item.id, a.who) : null;
      if (!scope) return P.stack(a, [P.bareHandoff(a), P.p("Your access to this grading task has ended")]);
      var hand = a.tier === "full" ? "" : P.handoff(a, { title: "Open on a larger screen", protectiveActions: [guarded(a, { label: "Flag for instructor review", note: "Preview only: nothing is flagged in this prototype" }, "flag", { offline: "You're offline", conflict: "Refresh the impact first" })] });
      return P.stack(a, [hand, taBody(a, item, rubric, scope)]);
    }
    return a.tier === "full" ? instructorFull(a, item, rubric) : review(a, item, rubric);
  }

  WB.definePage("W50", {
    states: STATES,
    na: P.na(STATES, {
      invalid: "Fields stay locked until a candidate rubric version exists", saving: "Fields stay locked until a candidate rubric version exists",
      saveFailed: "Fields stay locked until a candidate rubric version exists", success: "No candidate version exists, so nothing can be applied from this page",
      partialSuccess: "No candidate version exists, so nothing can be applied from this page", firstUseEmpty: "With no candidate version the page says so in place",
    }),
    render: function (a) { return P.shell(a, { title: a.page.title, body: body(a) }, { page: "W50" }); },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
