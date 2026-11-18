/* W35 Course builder (Phase 3 seg5). Instructor edits; an active TA reads the outline. Modules are the course's
   module records (assumption A3); only the module W37 draws links to W37 (A5). Publishing has no result
   record, so it is disabled with a reason (S5-1). iPad and iPhone are the review tier. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "firstUseEmpty", "conflict", "offline", "permissionUnavailable"];
  var PREVIEW = "Preview only: nothing changes in this prototype";
  var KINDS = { assignment: "Assignment", lab: "Lab", groupAssignment: "Group assignment", quiz: "Quiz" };

  function canEdit(a) { return a.role === "instructor" && a.tier === "full"; }
  function modules(a) {
    return a.view.data.coursework.modules.filter(function (m) { return m.course_id === a.who.courseId; })
      .slice().sort(function (x, y) { return x.position - y.position; });
  }
  function drawnModule(a) { return a.sel.currentModule(a.view, a.who.courseId) || modules(a)[0] || null; }
  function itemGo(a, item) { return WB.Teaching.go(a, item.kind === "quiz" ? "W41" : "W40", { assessmentId: item.id, learnerId: null, receiptId: null }); }
  function dueText(a, it) {
    var q = it.quiz_id ? a.sel.quiz(a.view, it.quiz_id) : null;
    var at = q ? q.close : it.due;
    return at ? P.when(a, at) : "";
  }
  function items(a, m) {
    return m.item_ids.map(function (id) { return a.sel.assessment(a.view, id); }).filter(Boolean);
  }

  function table(a, m) {
    var cols = [{ key: "title", label: "Item", primary: true }, { key: "kind", label: "Type" }, { key: "due", label: "Due or closes" }];
    if (canEdit(a)) cols.push({ key: "act", label: "Actions" });
    var rows = items(a, m).map(function (it) {
      var cells = { title: esc(it.title), kind: esc(KINDS[it.kind] || ""), due: esc(dueText(a, it)) };
      if (canEdit(a)) cells.act = a.state === "offline" || a.state === "conflict"
        ? a.K.button({ label: "Hide from learners", kind: "quiet", disabled: true, reason: a.state === "offline" ? "You're offline" : "Reload the current version first", id: P.id(a, "hide-" + it.id) })
        : a.K.button({ label: "Hide from learners", kind: "quiet", note: PREVIEW });
      var go = itemGo(a, it);
      return go ? { id: it.id, cells: cells, go: go } : { id: it.id, cells: cells };
    });
    return a.K.table(a.ctx, { id: P.id(a, "mod-" + m.id), caption: "Items in " + m.title, columns: cols, rows: rows, empty: { title: "This module has no items yet" } });
  }

  function moduleCard(a, m, drawn) {
    var moves = canEdit(a) ? [a.K.button({ label: "Move up", kind: "quiet", note: PREVIEW }), a.K.button({ label: "Move down", kind: "quiet", note: PREVIEW })].join("") : "";
    return a.K.card({ title: m.title, go: drawn && drawn.id === m.id ? "W37" : undefined, body: table(a, m), footer: moves || undefined });
  }

  function links(a) {
    var staff = [{ label: "Course settings", go: "W36" }, { label: "Files", go: "W39" }, { label: "Rubrics", go: "W43" }];
    if (a.role !== "instructor") return P.links(a, staff);
    return P.links(a, staff.concat([
      { label: "All assessments", go: WB.Teaching.go(a, "W18", { assessmentId: null, receiptId: null, learnerId: null }) }, { label: "Gradebook", go: WB.Teaching.go(a, "W51", { assessmentId: null, receiptId: null, learnerId: null }) }, { label: "People", go: WB.Teaching.go(a, "W45", { assessmentId: null, receiptId: null, learnerId: null }) },
      { label: "Question bank", go: "W42" }, { label: "Copy course", go: "W59" }, { label: "Import or export", go: "W60" },
      { label: "Preview published course", go: P.recordGo("W14", "course", a.who.courseId) },
    ]).filter(function (l) { return l.go; }));
  }

  function publish(a) {
    if (!canEdit(a)) return "";
    var reason = a.state === "offline" ? "You're offline. Nothing has been published" : a.state === "conflict" ? "Reload the current version first" : "Nothing is waiting to be published";
    return P.stack(a, [
      a.K.button({ label: "Add module", note: PREVIEW }),
      a.K.button({ label: "Publish selected", kind: "primary", disabled: true, reason: reason, id: P.id(a, "publish") }),
    ]);
  }

  function top(a) {
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.saveStatus("savedLocal")]);
    if (a.state === "conflict") {
      var acts = canEdit(a) ? [{ label: "Reload current version", note: PREVIEW }, { label: "Compare", note: PREVIEW }] : [];
      return a.K.notice({ tone: "warning", title: "Another staff member changed this outline", actions: acts });
    }
    return a.role === "ta" ? P.stack(a, [a.K.flag("readOnly"), P.p("Editing this course is the instructor's step")]) : "";
  }

  function empty(a) {
    return a.K.empty({ title: "No modules yet", body: a.role === "instructor" ? P.links(a, [{ label: "Import a course package", go: "W60" }]) : P.p("The instructor has not added modules.") });
  }

  function outline(a) {
    var list = modules(a);
    if (a.state === "firstUseEmpty" || !list.length) return empty(a);
    var drawn = drawnModule(a);
    return P.stack(a, list.map(function (m) { return moduleCard(a, m, drawn); }));
  }

  function full(a) {
    var c = a.sel.course(a.view, a.who.courseId);
    var rail = P.stack(a, [a.K.kv([{ label: "Course", value: c.code + " " + c.title }, { label: "Term", value: c.term }]), links(a)]);
    return P.stack(a, [top(a), a.K.rail(a.ctx, { main: outline(a), rail: rail, railLabel: "Inspector" }), publish(a)]);
  }

  // R06: a review-tier protective action follows the same blocking states as the web controls.
  function guarded(a, action, key, reasons) {
    var reason = Object.prototype.hasOwnProperty.call(reasons, a.state) ? reasons[a.state] : "";
    return reason ? { label: action.label, disabled: true, reason: reason, id: P.id(a, key) } : action;
  }
  function review(a) {
    var drawn = drawnModule(a);
    var rows = a.state === "firstUseEmpty" ? [] : modules(a).map(function (m) {
      var it = { title: m.title, meta: items(a, m).map(function (x) { return x.title; }).join(", ") || "No items yet" };
      if (drawn && drawn.id === m.id) it.go = "W37";
      return it;
    });
    var hide = a.role === "instructor" ? [guarded(a, { label: "Hide from learners", note: PREVIEW }, "hide", { offline: "You're offline", conflict: "Reload the current version first" })] : [];
    return P.stack(a, [
      P.handoff(a, { title: "Open on a larger screen", protectiveActions: hide }), top(a),
      rows.length ? a.K.list({ label: "Course outline", items: rows }) : empty(a), links(a),
    ]);
  }

  function body(a) {
    if (!a.who.courseId) return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a, "You are not teaching this course")]);
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "the course outline")]);
    return a.tier === "full" ? full(a) : review(a);
  }

  WB.definePage("W35", {
    states: STATES,
    na: P.na(STATES, { invalid: "No draft item is waiting, so no publication check has a result to show" }),
    render: function (a) { return P.shell(a, { title: "Course builder", body: body(a) }, { page: "W35" }); },
  });
})(globalThis);
