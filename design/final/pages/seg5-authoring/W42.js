/* W42 Question bank (Phase 3 seg5). No bank record exists, so the table lists the questions the course's quizzes
   use, each pinned (BD22). Instructor only (TA: no access by default); iPad and iPhone are the handoff tier. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "firstUseEmpty", "filteredEmpty", "permissionUnavailable"];
  var PREVIEW = "Preview only: nothing changes in this prototype";
  var KINDS = { single_choice: "Single choice", multiple_select: "Multiple select", numeric: "Numeric", written: "Written" };

  function rows(a) {
    if (a.state === "firstUseEmpty" || a.state === "filteredEmpty") return [];
    var out = [];
    P.assessments(a).forEach(function (it) {
      var q = it.quiz_id ? a.sel.quiz(a.view, it.quiz_id) : null;
      if (!q) return;
      var go = P.recordGo("W41", "assessment", it.id);
      var used = go ? a.K.link({ label: it.title, go: go }) : esc(it.title);
      q.items.forEach(function (x) {
        var item = typeof x === "string" ? { id: x } : x;
        out.push({ id: q.id + "-" + item.id, cells: { q: esc("Question " + item.id), kind: esc(KINDS[item.kind] || ""), used: used, rule: "Pinned" } });
      });
    });
    return out;
  }
  function empty(a) {
    if (a.state === "filteredEmpty") return { title: "No questions match the filter", action: { label: "Clear filters", note: PREVIEW } };
    return { title: "No questions yet" };
  }

  function full(a) {
    return P.stack(a, [
      P.p("A quiz keeps the version it pinned. Editing a question here makes a new version; quizzes change only when the instructor re-pins."),
      a.K.table(a.ctx, {
        id: P.id(a, "bank"), caption: "Questions in use", rows: rows(a), empty: empty(a),
        columns: [{ key: "q", label: "Question", primary: true }, { key: "kind", label: "Type" }, { key: "used", label: "Used in" }, { key: "rule", label: "Version rule" }],
      }),
      a.K.button({ label: "New question", kind: "primary", note: PREVIEW }), a.K.button({ label: "Retire question", note: PREVIEW }),
    ]);
  }

  function body(a) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.role === "ta") return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a)]);
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "the question bank")]);
    if (a.tier !== "full") return a.K.handoff(a.ctx, { title: "Open on a larger screen", note: "Question authoring needs the web app" });
    return full(a);
  }

  WB.definePage("W42", {
    states: STATES,
    na: P.na(STATES, {
      invalid: "No question is open for editing, so no question check has a result to show",
      saving: "No question change is recorded in this prototype",
      saveFailed: "No question change is recorded in this prototype",
      conflict: "No question is open for editing by two people",
      offline: "No question record is stored on this device",
    }),
    render: function (a) { return P.shell(a, { title: "Question bank", body: body(a) }, { page: "W42" }); },
  });
})(globalThis);
