/* W43 Rubric library (Phase 3 seg5). One card per published assessment rubric. A rubric is "In use" when scored
   work exists (gradeDraftFor), else "Attached" (JW-114). A TA sees rubrics of active tasks only (A6). */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "firstUseEmpty", "filteredEmpty", "permissionUnavailable"];
  var PREVIEW = "Preview only: nothing changes in this prototype";

  function inUse(a, it) {
    return a.sel.enrolled(a.view, a.who.courseId, "student").some(function (id) { return a.sel.gradeDraftFor(a.view, id, it.id, a.who); });
  }
  function entries(a) {
    return P.assessments(a).map(function (it) {
      var acc = a.sel.taTaskAccess(a.view, it.id, a.who);
      if (a.role === "ta" && !acc.task) return null;
      var open = a.role !== "ta" || (acc.active && a.sel.taScope(a.view, it.id, a.who));
      var r = open ? a.sel.rubricFor(a.view, it.id, a.who) : null;
      return open && !r ? null : { it: it, rubric: r };
    }).filter(Boolean);
  }
  function retire(a, used, key) {
    return used ? { label: "Retire", disabled: true, reason: "In use by scored work", id: P.id(a, key) } : { label: "Retire", note: PREVIEW };
  }

  function card(a, e, i) {
    if (!e.rubric) return a.K.card({ title: e.it.title, body: P.p("Access ended") });
    var r = e.rubric;
    var pts = r.criteria.reduce(function (n, c) { return n + c.max; }, 0);
    var mine = a.role === "instructor";
    var used = mine && inUse(a, e.it);
    var impact = P.recordGo("W50", "rubric", r.id);
    var kv = a.K.kv([{ label: "Version", value: String(r.version) }, { label: "Criteria", value: String(r.criteria.length) }, { label: "Points", value: String(pts) }]);
    var foot = mine ? [a.tier === "full" ? WB.renderAction("card", retire(a, used, "retire-" + i)) : "", impact ? a.K.link({ label: "Preview impact", go: impact }) : ""].join("") : "";
    return a.K.card({
      title: e.it.title, go: P.recordGo("W44", "rubric", r.id) || undefined, footer: foot || undefined,
      body: P.stack(a, [kv, mine ? a.K.badge({ label: used ? "In use" : "Attached", tone: used ? "warning" : "neutral" }) : ""]),
    });
  }

  function list(a) {
    var all = a.state === "firstUseEmpty" || a.state === "filteredEmpty" ? [] : entries(a);
    if (a.state === "filteredEmpty") return a.K.empty({ title: "No rubrics match the filter", action: { label: "Clear filters", note: PREVIEW } });
    if (!all.length) return a.K.empty({ title: "No rubrics yet" });
    return P.stack(a, all.map(function (e, i) { return card(a, e, i); }));
  }

  function body(a) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "the rubric library")]);
    var mine = a.role === "instructor";
    var first = mine ? entries(a)[0] : null;
    var protect = first && first.rubric && a.state !== "firstUseEmpty" ? [retire(a, inUse(a, first.it), "retire-top")] : [];
    return P.stack(a, [
      P.handoff(a, { title: "Open on a larger screen", protectiveActions: protect }),
      a.role === "ta" ? a.K.flag("readOnly") : "", list(a),
      mine && a.tier === "full" ? a.K.button({ label: "New rubric", kind: "primary", note: PREVIEW }) : "",
    ]);
  }

  WB.definePage("W43", {
    states: STATES,
    na: P.na(STATES, {
      invalid: "Rubrics are edited in the rubric editor; this library takes no typed input",
      saving: "Nothing is saved from the library itself",
      saveFailed: "Nothing is saved from the library itself",
      conflict: "Rubrics are edited in the rubric editor, not in the library",
      offline: "The library sends nothing; edits happen in the rubric editor",
    }),
    render: function (a) { return P.shell(a, { title: "Rubric library", body: body(a) }, { page: "W43" }); },
  });
})(globalThis);
