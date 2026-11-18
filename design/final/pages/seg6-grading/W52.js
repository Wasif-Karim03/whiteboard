/* W52 Grading policy setup (Phase 3, seg6-grading; decisions 3.10 and 6.01). Instructor and TA. Anchor: the course
   grading policy. No selector exposes the weights or rules, so the page draws the category mapping from the
   gradebook, the policy version from the release preview and the calculation preview from courseTotal and
   categoryPercent (null shows "No calculable grade"). A TA reads the mapping only: no totals and no learner.
   No letter grade is drawn anywhere. Notes: pages/seg6-grading/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["invalid", "loading", "conflict", "offline", "permissionUnavailable"];
  var LABELS = { assignments: "Assignments", labs: "Labs", quizzes: "Quizzes" };
  var NO_GRADE = "No calculable grade";
  var NO_LETTERS = "This policy sets no letter boundaries, so no page shows a letter grade";

  function label(id) { return Object.prototype.hasOwnProperty.call(LABELS, id) ? LABELS[id] : id; }
  function totalText(t) { return t && t.display ? t.display : NO_GRADE; }
  function pctText(a, v) { return v === null || v === undefined ? NO_GRADE : a.sel.pct(v); }

  // Grade items grouped by category, in gradebook order.
  function groups(gb) {
    var out = [];
    gb.items.forEach(function (it) {
      var g = out.filter(function (x) { return x.id === it.category; })[0];
      if (g) g.items.push(it);
      else out.push({ id: it.category, items: [it] });
    });
    return out;
  }

  function mapping(a, gb) {
    var policy = a.sel.gradingPolicy(a.view, a.who.courseId, a.who);
    var rows = groups(gb).map(function (g) {
      var points = g.items.reduce(function (n, it) { return n + it.max; }, 0);
      var titles = g.items.map(function (it) { return it.title; }).join(", ");
      return { id: g.id, cells: { cat: esc(label(g.id)), items: esc(titles), points: esc(String(points)), weight: esc(policy && policy.categories.filter(function (c) { return c.id === g.id; })[0] ? String(policy.categories.filter(function (c) { return c.id === g.id; })[0].weight) + "%" : "Not configured") } };
    });
    return a.K.table(a.ctx, {
      id: P.id(a, "mapping"), caption: "Category mapping",
      columns: [{ key: "cat", label: "Category", primary: true }, { key: "items", label: "Assessments" }, { key: "points", label: "Points possible", numeric: true }, { key: "weight", label: "Weight" }],
      rows: rows, empty: { title: "No grade items", body: P.p("Grade items appear here once assessments are published.") },
    });
  }

  // The first assessment with a release-ready result: its preview carries the applied policy version.
  function readyItem(a) {
    var hit = null;
    P.assessments(a).forEach(function (item) {
      if (hit) return;
      var row = (a.sel.releaseReady(a.view, item.id, a.who) || []).filter(function (r) { return r.included; })[0];
      if (row) hit = { item: item, personId: row.personId };
    });
    return hit;
  }

  function source(a, ready) {
    var pv = ready ? a.sel.releasePreview(a.view, a.who.courseId, ready.personId, ready.item.id, a.who) : null;
    var policy = a.sel.gradingPolicy(a.view, a.who.courseId, a.who);
    var rules = policy ? a.K.kv([{ label: "Ungraded work", value: "Excluded from the total" }, { label: "Excused work", value: "Removed from the denominator" }, { label: "Missing work", value: "Zero only after release" }, { label: "Rounding", value: String(policy.rounding.digits) + " decimal places at the final total" }]) : "";
    return rules + (pv && pv.inputs ? a.K.kv([{ label: "Policy version", value: String(pv.inputs.policy.version) }]) : "");
  }

  function preview(a, gb) {
    var learner = P.learnerId(a);
    var course = a.who.courseId;
    var staff = a.sel.courseTotal(a.view, course, learner, a.who);
    var rel = a.sel.courseTotal(a.view, course, learner, a.who, { as: "learner" });
    var cats = groups(gb).reduce(function (list, g) {
      return list.concat([
        { label: label(g.id) + " (working)", value: pctText(a, a.sel.categoryPercent(a.view, course, learner, g.id, a.who)) },
        { label: label(g.id) + " (released)", value: pctText(a, a.sel.categoryPercent(a.view, course, learner, g.id, a.who, { as: "learner" })) },
      ]);
    }, []);
    var grid = a.K.grid(a.ctx, {
      cols: 3, compactCols: 1, items: [
        a.K.figure({ label: "Working total", value: totalText(staff), basis: "Released and held results" }),
        a.K.figure({ label: "Released total", value: totalText(rel), basis: "Released results only" }),
        a.K.stat({ label: "Represented weight", value: staff ? String(staff.representedWeight) : NO_GRADE }),
      ],
    });
    var body = P.p("Calculation preview for " + P.personName(a, learner)) + grid + (cats.length ? a.K.kv(cats) : "");
    return a.K.section({ title: "Calculation preview", body: body, level: 2 });
  }

  function letters(a) { return a.K.section({ title: "Letter grade", body: P.p(NO_LETTERS), level: 2 }); }

  function top(a) {
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown")]);
    if (a.state === "invalid") return a.K.notice({ tone: "error", title: "Category weights do not add up to the whole course", body: P.p("The entered weights are not drawn: there is no sample record.") });
    if (a.state === "conflict") return a.K.notice({ tone: "error", title: "The calculation preview is out of date", body: P.p("Another change was applied after this preview.") });
    return "";
  }

  function actions(a) {
    var reasons = { invalid: "Fix the category weights first", conflict: "Recompute the preview first", offline: "You're offline" };
    var reason = Object.prototype.hasOwnProperty.call(reasons, a.state) ? reasons[a.state] : "There is no working change to apply";
    return P.stack(a, [
      a.K.button({ label: "Apply policy version", kind: "primary", disabled: true, reason: reason, id: P.id(a, "apply") }),
      a.K.button({ label: "Preview calculation", note: "Preview only: nothing is recomputed in this prototype" }),
      a.K.button({ label: "Edit weights", note: "Preview only: weights are not drawn; see the kit request" }),
    ]);
  }

  function links(a, ready) {
    if (a.role !== "instructor") return P.links(a, [{ label: "Gradebook", go: "W51" }]);
    var go = ready ? WB.Teaching.go(a, "W53", { assessmentId: ready.item.id, learnerId: null, receiptId: null }) : null;
    return P.links(a, [{ label: "Gradebook", go: "W51" }, go ? { label: "Release feedback: " + ready.item.title, go: go } : null, { label: "Course settings", go: "W36" }]);
  }

  // R06: a review-tier protective action follows the same blocking states as the web controls.
  function guarded(a, action, key, reasons) {
    var reason = Object.prototype.hasOwnProperty.call(reasons, a.state) ? reasons[a.state] : "";
    return reason ? { label: action.label, disabled: true, reason: reason, id: P.id(a, key) } : action;
  }
  function instructor(a, gb) {
    var ready = readyItem(a);
    var keep = [guarded(a, { label: "Keep the current policy version", note: "Preview only: nothing is changed in this prototype" }, "keep", { offline: "You're offline", conflict: "Recompute the preview first" })];
    if (a.tier !== "full") {
      return P.stack(a, [P.handoff(a, { title: "Open on a larger screen", protectiveActions: keep }), top(a), source(a, ready), mapping(a, gb), preview(a, gb), letters(a), links(a, ready)]);
    }
    return P.stack(a, [top(a), source(a, ready), mapping(a, gb), preview(a, gb), letters(a), actions(a), links(a, ready)]);
  }

  // BD23, BD33: read-only mapping of the TA's own items, whatever the token; no totals and no learner.
  function ta(a, gb) {
    return P.stack(a, [
      P.bareHandoff(a),
      a.K.notice({ tone: "info", title: "Read-only: the instructor sets the grading policy" }),
      gb ? mapping(a, gb) : P.p("No grade items are in your grading tasks"),
      P.p("A worked example for an example learner is not drawn yet"), letters(a), links(a, null),
    ]);
  }

  // R01: the frame role alone is not membership; the viewer must hold that role in the course.
  function member(a) { return a.sel.verifiedRole(a.view, a.who, a.who.courseId) === a.role; }
  function denied(a) { return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a, "You are not teaching this course")]); }
  function body(a) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (!member(a)) return denied(a);
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "the grading policy")]);
    var gb = a.sel.gradebook(a.view, a.who.courseId, a.who);
    if (a.role === "ta") return ta(a, gb);
    if (!gb) return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a)]);
    return instructor(a, gb);
  }

  WB.definePage("W52", {
    states: STATES,
    na: P.na(STATES, {
      saving: "Weights cannot be edited in this prototype, so nothing is saved", saveFailed: "Weights cannot be edited in this prototype, so nothing is saved",
      firstUseEmpty: "The course already has an applied policy version", success: "No working change exists to apply",
    }),
    render: function (a) { return P.shell(a, { title: a.page.title, body: body(a) }, { page: "W52" }); },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
