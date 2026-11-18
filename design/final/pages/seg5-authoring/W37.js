/* W37 Module editor (Phase 3 seg5). The module is the current module at the view clock, else the first one
   (A3). Edits are preview-only; an active TA reads the module. iPad and iPhone are the review tier. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "firstUseEmpty", "invalid", "offline", "permissionUnavailable"];
  var PREVIEW = "Preview only: nothing changes in this prototype";

  function canEdit(a) { return a.role === "instructor" && a.tier === "full"; }
  function all(a) {
    return a.view.data.coursework.modules.filter(function (m) { return m.course_id === a.who.courseId; })
      .slice().sort(function (x, y) { return x.position - y.position; });
  }
  function moduleOf(a) { return a.sel.currentModule(a.view, a.who.courseId) || all(a)[0] || null; }
  function items(a, m) {
    if (a.state === "firstUseEmpty") return [];
    return m.item_ids.map(function (id) { return a.sel.assessment(a.view, id); }).filter(Boolean);
  }
  function itemGo(id) { return P.recordGo("W40", "assessment", id) || P.recordGo("W41", "assessment", id); }

  function itemTable(a, m) {
    var cols = [{ key: "title", label: "Item", primary: true }];
    if (canEdit(a)) cols.push({ key: "act", label: "Order" });
    var rows = items(a, m).map(function (it) {
      var cells = { title: esc(it.title) };
      if (canEdit(a)) cells.act = [a.K.button({ label: "Move up", kind: "quiet", note: PREVIEW }), a.K.button({ label: "Move down", kind: "quiet", note: PREVIEW })].join("");
      var go = itemGo(it.id);
      return go ? { id: it.id, cells: cells, go: go } : { id: it.id, cells: cells };
    });
    return a.K.table(a.ctx, { id: P.id(a, "items"), caption: "Items in this module", columns: cols, rows: rows, empty: { title: "This module has no items yet" } });
  }

  function editor(a, m) {
    var others = all(a).filter(function (x) { return x.id !== m.id; }).map(function (x) { return { value: x.id, label: x.title }; });
    var bad = a.state === "invalid";
    var off = a.state === "offline";
    var reason = off ? "You're offline. Nothing has been published" : bad ? "Fix the prerequisite first" : null;
    return P.stack(a, [
      a.K.field({ id: P.id(a, "title"), label: "Module title", value: m.title }),
      a.K.field({ id: P.id(a, "prereq"), label: "Prerequisite module", type: "select", options: [{ value: "", label: "No prerequisite" }].concat(others),
        error: bad ? "A module cannot require itself" : undefined }),
      reason ? a.K.button({ label: "Save module", kind: "primary", disabled: true, reason: reason, id: P.id(a, "save") }) : a.K.button({ label: "Save module", kind: "primary", note: PREVIEW }),
      a.K.button({ label: "Hide from learners", note: PREVIEW }), a.K.button({ label: "Restore earlier version", kind: "quiet", note: PREVIEW }),
    ]);
  }

  function facts(a, m) {
    return a.K.kv([{ label: "Module", value: m.title }, { label: "Starts", value: P.when(a, m.starts) }, { label: "Ends", value: P.when(a, m.ends) }]);
  }
  function links(a) {
    var list = [{ label: "Files", go: "W39" }];
    if (a.role === "instructor") list.unshift({ label: "Add lesson", go: "W38" });
    return P.links(a, list);
  }
  function top(a) {
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.saveStatus("savedLocal")]);
    return a.role === "ta" ? P.stack(a, [a.K.flag("readOnly"), P.p("Editing this course is the instructor's step")]) : "";
  }

  function body(a) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "the module")]);
    var m = moduleOf(a);
    if (!m) return P.stack(a, [P.bareHandoff(a), a.K.empty({ title: "No modules yet" })]);
    return P.stack(a, [
      P.handoff(a, { title: "Open on a larger screen" }), top(a),
      canEdit(a) ? editor(a, m) : facts(a, m), canEdit(a) ? facts(a, m) : "", itemTable(a, m), links(a),
    ]);
  }

  WB.definePage("W37", {
    states: STATES,
    na: P.na(STATES, {
      saving: "No module change is recorded, so there is no save in progress to show",
      saveFailed: "No module change is recorded, so no save can fail here",
      conflict: "No other staff edit of this module is recorded",
    }),
    render: function (a) {
      var m = moduleOf(a);
      return P.shell(a, { title: m ? "Edit module: " + m.title : "Edit module", body: body(a), back: { label: "Builder", go: "W35" } }, { page: "W35" });
    },
  });
})(globalThis);
