/* W24 Student course grades (Phase 3 spine). Student and instructor preview. Course total and category figures
   come from courseTotal and categoryPercent (instructor with {as: "learner"}); the table from gradeRows. Rows that
   are not released show the kit's not-released status and no score. Staff outcomes are never read here. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["firstUseEmpty", "loading", "offline", "permissionUnavailable"];

  function learner(a) { return a.role === "student" ? a.who.personId : P.learnerId(a); }
  function opts(a) { return a.role === "instructor" ? { as: "learner" } : undefined; }
  function categoryLabel(id) { return id.charAt(0).toUpperCase() + id.slice(1); }

  function categories(rows) {
    var out = [];
    rows.forEach(function (r) { if (out.indexOf(r.category) < 0) out.push(r.category); });
    return out;
  }

  function figures(a, personId, rows) {
    var total = a.sel.courseTotal(a.view, a.who.courseId, personId, a.who, opts(a));
    var items = [];
    categories(rows).forEach(function (c) {
      var v = a.sel.categoryPercent(a.view, a.who.courseId, personId, c, a.who, opts(a));
      items.push(v === null ? a.K.stat({ label: categoryLabel(c), value: "No released results" }) : a.K.figure({ label: categoryLabel(c), value: a.sel.pct(v), basis: "Released results only" }));
    });
    var figure = total && !total.empty ? a.K.figure({ label: "Course total", value: total.display, basis: "Released results only" }) : P.p("No released results yet");
    var breakdown = items.length ? a.K.grid(a.ctx, { items: items, cols: 4, compactCols: 2 }) : P.p("No categories yet");
    return { total: figure, breakdown: breakdown };
  }

  // The W19 anchor item → W23 only when released; a quiz with a W27 receipt anchor → W27; others plain (PAGES.md).
  function rowGo(a, row, personId) {
    if (a.role !== "student") return null;
    var item = a.sel.assessment(a.view, row.itemId);
    var sub = a.sel.submissionFor(a.view, personId, row.itemId);
    if (!a.selection) {
      if (P.recordGo("W19", "assessment", row.itemId) === "W19") return row.status !== null ? "W23" : null;
      var legacy = sub && sub.receipt_id ? P.recordGo("W27", "receipt", sub.receipt_id) : null;
      if (legacy) return legacy;
    }
    if (item && item.quiz_id) return sub && sub.receipt_id ? WB.Teaching.go(a, "W27", { assessmentId: item.id, learnerId: personId, receiptId: sub.receipt_id }) : null;
    return row.status !== null ? WB.Teaching.go(a, "W23", { assessmentId: row.itemId, learnerId: personId, receiptId: null }) : null;
  }

  function statusCell(a, row, personId) {
    if (a.role === "student") return P.status(a, P.ownSubmission(a, row.itemId), true);
    // Instructor preview: K.status is role-aware, so learner-only labels cannot be drawn for an instructor.
    // A row the learner cannot see yet says so in words; a released row shows its staff status.
    if (row.status === null) return esc("Learner sees: not released yet");
    var sub = a.sel.submissionFor(a.view, personId, row.itemId);
    return sub ? P.status(a, sub, false) : "";
  }

  function tableRow(a, row, personId) {
    var cells = {
      item: esc(row.title), category: esc(categoryLabel(row.category)),
      score: esc(row.status === null ? "" : P.score(row.score, row.max)), status: statusCell(a, row, personId),
    };
    var go = rowGo(a, row, personId);
    return go ? { id: row.itemId, cells: cells, go: go } : { id: row.itemId, cells: cells };
  }

  function table(a, rows, personId) {
    var columns = [{ key: "item", label: "Item", primary: true }, { key: "category", label: "Category" }, { key: "score", label: "Score" }, { key: "status", label: "Status" }];
    return a.K.table(a.ctx, {
      id: P.id(a, "grades"), caption: "Grade items", columns: columns,
      rows: rows.map(function (r) { return tableRow(a, r, personId); }),
      empty: { title: "No grade items yet", body: P.p("Items appear here when the instructor adds them.") },
    });
  }

  function lastRelease(a) {
    var at = a.sel.lastReleaseAt(a.view, a.who.courseId, a.who);
    return at ? P.p("Last release " + P.when(a, at)) : "";
  }

  function content(a) {
    var personId = learner(a);
    var rows = a.sel.gradeRows(a.view, a.who.courseId, personId, a.who);
    if (!rows) return P.permissionNotice(a);
    var published = P.assessments(a);
    rows = rows.filter(function (r) { return published.some(function (it) { return it.id === r.itemId; }); });
    var empty = a.state === "firstUseEmpty"
      ? a.K.notice({ tone: "info", title: "Empty categories", body: P.p("A category with no released results is left out of the total until something is released.") })
      : "";
    var head = a.role === "instructor" ? P.stack(a, [a.K.flag("preview"), P.p("Previewing as " + P.personName(a, personId))]) : "";
    var f = figures(a, personId, rows);
    return P.stack(a, [head, empty, f.total, table(a, rows, personId), lastRelease(a), a.K.disclosure({ id: P.id(a, "categories"), summary: "Category breakdown", body: f.breakdown })]);
  }

  function body(a) {
    if (a.state === "permissionUnavailable") return P.permissionNotice(a, "These grades belong to another person");
    if (a.state === "loading") return P.loading(a, "grades");
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown"), content(a)]);
    return content(a);
  }

  WB.definePage("W24", {
    states: STATES,
    na: P.na(STATES),
    render: function (a) { return P.shell(a, { title: a.page.title, body: body(a) }, { page: "W24" }); },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
