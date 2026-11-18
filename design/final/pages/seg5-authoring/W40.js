/* W40 Assignment editor (Phase 3 seg5). Anchor: the problem set; variant motion: the group assignment. Received
   work locks question and points edits against its version (receipts by version, A1). Saving is preview-only. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "invalid", "saving", "saveFailed", "conflict", "offline", "permissionUnavailable"];
  var PREVIEW = "Preview only: nothing changes in this prototype";
  var SAVE = { saving: "saving", saveFailed: "failed", conflict: "conflict", offline: "savedLocal" };

  function itemOf(a) { return a.sel.assessment(a.view, a.selection && a.selection.assessmentId || a.sel.anchorFor("W40", a.variant).record.id); }
  function canEdit(a) { return a.role === "instructor" && a.tier === "full"; }
  function dates(it) { return [["Opens", it.opens], ["Due", it.due], ["Closes", it.close]].filter(function (d) { return d[1]; }); }

  function facts(a, it) {
    var rows = dates(it).map(function (d) { return { label: d[0], value: P.when(a, d[1]) }; });
    rows.push({ label: "Grading", value: a.sel.teachingAssessmentIntent(a.view, a.who, it.id) || "Not configured" });
    rows.push({ label: "Points", value: String(it.max) }, { label: "Version", value: String(it.version) });
    if (it.max_attempts) rows.push({ label: "Attempts", value: String(it.max_attempts) });
    if (P.lateRuleText(it)) rows.push({ label: "Late work", value: P.lateRuleText(it) });
    return a.K.kv(rows);
  }
  function byVersion(a, it) {
    var out = {};
    a.sel.receiptsFor(a.view, it.id, a.who).forEach(function (r) {
      var v = String(r.assessment_version || it.version);
      out[v] = (out[v] || 0) + 1;
    });
    return out;
  }
  function receipts(a, it) {
    var counts = byVersion(a, it);
    var lines = Object.keys(counts).map(function (v) { return P.p("Version " + v + ": " + counts[v] + " received"); });
    return a.K.section({ title: "Received work", level: 2, body: P.stack(a, lines.length ? lines.concat([
      P.p("Received work keeps the late fact from the due time in force when it was accepted"),
    ]) : [P.p("No work has been received yet")]) });
  }
  function lockReason(a, it) {
    var v = Object.keys(byVersion(a, it))[0];
    return v ? "Work has been received against version " + v : null;
  }

  function editor(a, it) {
    var lock = lockReason(a, it);
    var off = a.state === "offline";
    var f = function (key, label, value, more) { return a.K.field(Object.assign({ id: P.id(a, key), label: label, value: value }, more || {})); };
    var fields = [f("title", "Title", it.title)].concat(dates(it).map(function (d, i) {
      return f("date-" + i, d[0], P.when(a, d[1]), d[0] === "Closes" && a.state === "invalid" ? { error: "Close must be after the due time" } : null);
    }));
    fields.push(f("attempts", "Attempts", it.max_attempts || 1, { type: "number" }));
    (it.questions || []).forEach(function (q) {
      fields.push(f("q-" + q.id, "Question " + q.id + " points", q.max, lock ? { type: "number", disabled: true, reason: lock } : { type: "number" }));
    });
    var save = off ? a.K.button({ label: "Save draft", disabled: true, reason: "You're offline. Nothing has been published", id: P.id(a, "save") })
      : a.K.button({ label: "Save draft", kind: "primary", note: PREVIEW });
    var hide = off ? a.K.button({ label: "Hide from learners", disabled: true, reason: "You're offline", id: P.id(a, "hide") })
      : a.K.button({ label: "Hide from learners", note: PREVIEW });
    return P.stack(a, fields.concat([save, hide, a.K.button({ label: "Restore earlier version", kind: "quiet", note: PREVIEW })]));
  }

  function top(a) {
    var notice = "";
    if (a.state === "offline") notice = P.offlineNotice(a);
    if (a.state === "saveFailed") notice = a.K.notice({ tone: "error", title: "The assignment was not saved; your changes are still on this page", actions: [{ label: "Retry save", note: PREVIEW }] });
    if (a.state === "conflict") {
      notice = a.K.notice({ tone: "warning", title: a.variant === "motion" ? "Group membership changed while you were editing" : "Another staff member changed this assignment",
        actions: [{ label: "Reload", note: PREVIEW }] });
    }
    if (a.role === "ta") return P.stack(a, [a.K.flag("readOnly"), P.p("Editing this course is the instructor's step")]);
    return P.stack(a, [notice, a.tier === "full" && SAVE[a.state] ? a.K.saveStatus(SAVE[a.state]) : ""]);
  }

  function group(a, it) {
    if (!it.group_set_id) return "";
    var set = a.view.data.groups.group_sets.filter(function (s) { return s.id === it.group_set_id; })[0];
    if (!set) return "";
    var go = P.recordGo("W47", "groupSet", set.id);
    return P.stack(a, [a.K.kv([{ label: "Group set", value: set.name }]), P.p("One submission per group"), go ? P.links(a, [{ label: "Group set: " + set.name, go: go }]) : ""]);
  }
  function links(a, it) {
    var rubric = a.sel.rubricFor(a.view, it.id, a.who);
    var list = [{ label: "Rubric library", go: "W43" }];
    if (rubric) list.push({ label: "Rubric", go: P.recordGo("W44", "rubric", rubric.id) });
    if (a.role === "instructor") list.push({ label: "Grading queue", go: WB.Teaching.go(a, "W48", { assessmentId: it.id, receiptId: null, learnerId: null }) });
    return P.links(a, list.filter(function (l) { return l.go; }));
  }

  // R06: a review-tier protective action follows the same blocking states as the web controls.
  function guarded(a, action, key, reasons) {
    var reason = Object.prototype.hasOwnProperty.call(reasons, a.state) ? reasons[a.state] : "";
    return reason ? { label: action.label, disabled: true, reason: reason, id: P.id(a, key) } : action;
  }
  function body(a, it) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "the assignment")]);
    var mine = a.role === "instructor";
    var hide = mine ? [guarded(a, { label: "Hide from learners", note: PREVIEW }, "hide", { offline: "You're offline" })] : [];
    return P.stack(a, [
      P.handoff(a, { title: "Open on a larger screen", protectiveActions: hide }), top(a),
      canEdit(a) ? editor(a, it) : facts(a, it), mine ? receipts(a, it) : "", group(a, it), links(a, it),
    ]);
  }

  WB.definePage("W40", {
    states: STATES,
    na: P.na(STATES, { firstUseEmpty: "This page edits one existing assignment, so there is no empty view" }),
    variants: { motion: WB.manifest.anchors.W40.variants.motion.label },
    render: function (a) {
      var it = itemOf(a);
      return P.shell(a, { title: "Edit assignment: " + it.title, body: body(a, it), back: { label: "Builder", go: "W35" } }, { page: "W35" });
    },
  });
})(globalThis);
