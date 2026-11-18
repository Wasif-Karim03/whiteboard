/* W59 Course copy and rollover (Phase 3 seg5). Instructor only (TA: no access by default). Copied counts come from
   the course's records (A1); the not-copied list is complete (BD21). No destination term exists, so the copy is
   disabled with a reason (S5-4). */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "invalid", "saveFailed", "permissionUnavailable"];
  var PREVIEW = "Preview only: nothing changes in this prototype";
  var NOT_COPIED = [
    "Announcements", "Discussion posts and replies", "People, staff access and grading tasks", "Submissions and receipts",
    "Marks, feedback and released results", "Allowances and requests", "Group membership", "Activity and read markers",
  ];
  var NO_TERM = "Choose a destination term first";

  function notCopied(a) { return a.K.list({ label: "Not copied", items: NOT_COPIED.map(function (t) { return { title: t }; }) }); }
  function copied(a) {
    var items = P.assessments(a);
    var mods = a.view.data.coursework.modules.filter(function (m) { return m.course_id === a.who.courseId; });
    var rubrics = items.filter(function (it) { return a.sel.rubricFor(a.view, it.id, a.who); });
    return a.K.list({ label: "Copied", items: [
      { title: "Modules", meta: String(mods.length) }, { title: "Coursework", meta: String(items.length) }, { title: "Rubrics", meta: String(rubrics.length) },
    ] });
  }
  function dates(a) {
    var rows = P.assessments(a).map(function (it) {
      var q = it.quiz_id ? a.sel.quiz(a.view, it.quiz_id) : null;
      var at = it.due || (q && q.close);
      return { id: it.id, cells: { item: esc(it.title), now: esc(at ? P.when(a, at) : ""), next: "Not set" } };
    });
    return a.K.table(a.ctx, {
      id: P.id(a, "dates"), caption: "Date map", rows: rows, empty: { title: "No dated coursework" },
      columns: [{ key: "item", label: "Item", primary: true }, { key: "now", label: "Current due or close" }, { key: "next", label: "New date" }],
    });
  }
  function top(a) {
    if (a.state === "invalid") return a.K.notice({ tone: "error", title: "Choose at least one module to copy" });
    if (a.state === "saveFailed") return a.K.notice({ tone: "error", title: "The copy did not finish. No draft course was created", actions: [{ label: "Retry", note: PREVIEW }] });
    return "";
  }
  function links(a) { return P.links(a, [{ label: "Import a package instead", go: "W60" }, { label: "Builder", go: "W35" }]); }

  function full(a) {
    var c = a.sel.course(a.view, a.who.courseId);
    return P.stack(a, [
      top(a), a.K.kv([{ label: "Source course", value: c.code + " " + c.title }, { label: "Term", value: c.term }, { label: "Section", value: c.section }]),
      a.K.section({ title: "What is copied", level: 2, body: copied(a) }),
      a.K.section({ title: "What is not copied", level: 2, body: notCopied(a) }), dates(a),
      a.K.field({ id: P.id(a, "checked"), label: "I have checked what is and is not copied", type: "checkbox", disabled: true, reason: NO_TERM }),
      a.K.button({ label: "Create draft copy", kind: "primary", disabled: true, reason: NO_TERM, id: P.id(a, "create") }), links(a),
    ]);
  }

  function body(a) {
    if (!a.who.courseId) return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a, "You are not teaching this course")]);
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.role === "ta") return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a)]);
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "course copy")]);
    if (a.tier === "full") return full(a);
    return P.stack(a, [P.handoff(a, { title: "Open on a larger screen" }), top(a), a.K.empty({ title: "No copy has been started" }), notCopied(a), links(a)]);
  }

  WB.definePage("W59", {
    states: STATES,
    na: P.na(STATES, {
      firstUseEmpty: "The source course always has content to preview",
      saving: "No copy is in progress in this prototype",
      conflict: "No copy is in progress for two people to change",
      offline: "Copying runs on the server; this preview stores nothing on the device",
    }),
    render: function (a) { return P.shell(a, { title: "Course copy and rollover", body: body(a) }, { page: "W59" }); },
  });
})(globalThis);
