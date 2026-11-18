/* W36 Course settings, syllabus and publication (Phase 3 seg5). Course facts are institution-managed and
   read-only; no syllabus record exists, so the instructor's editor starts empty and saving is preview-only. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "saveFailed", "offline", "permissionUnavailable"];
  var PREVIEW = "Preview only: nothing changes in this prototype";
  var OFFLINE = "You're offline. Nothing has been published";

  function canEdit(a) { return a.role === "instructor" && a.tier === "full"; }
  function modules(a) {
    var drawn = a.sel.currentModule(a.view, a.who.courseId);
    var list = a.view.data.coursework.modules.filter(function (m) { return m.course_id === a.who.courseId; })
      .slice().sort(function (x, y) { return x.position - y.position; });
    var shown = drawn || list[0];
    return a.K.list({ label: "Modules", items: list.map(function (m) {
      var row = { title: m.title, meta: P.when(a, m.starts) + " to " + P.when(a, m.ends) };
      if (shown && shown.id === m.id) row.go = "W37";
      return row;
    }) });
  }
  function facts(a) {
    var c = a.sel.course(a.view, a.who.courseId);
    return a.K.section({ title: "Managed by your institution", level: 2, body: a.K.kv([
      { label: "Course", value: c.code }, { label: "Title", value: c.title }, { label: "Term", value: c.term }, { label: "Section", value: c.section },
    ]) });
  }
  function links(a) {
    var list = [{ label: "Builder", go: "W35" }, { label: "Course calendar", go: "W32" }];
    if (a.role === "instructor") list.push({ label: "Syllabus as learners see it", go: "W15" });
    return P.links(a, list);
  }
  function top(a) {
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.saveStatus("savedLocal")]);
    if (a.state === "saveFailed") {
      return P.stack(a, [a.K.saveStatus("failed"), a.K.notice({ tone: "error", title: "The syllabus draft was not saved; your text is still on this page",
        actions: canEdit(a) ? [{ label: "Retry save", note: PREVIEW }] : [] })]);
    }
    return a.role === "ta" ? P.stack(a, [a.K.flag("readOnly"), P.p("Editing this course is the instructor's step")]) : "";
  }
  function editor(a) {
    if (!canEdit(a)) return "";
    var off = a.state === "offline";
    var btn = function (label, kind, key) {
      return off ? a.K.button({ label: label, kind: kind, disabled: true, reason: OFFLINE, id: P.id(a, key) }) : a.K.button({ label: label, kind: kind, note: PREVIEW });
    };
    return a.K.section({ title: "Syllabus", level: 2, body: P.stack(a, [
      a.K.field({ id: P.id(a, "syllabus"), label: "Syllabus text", type: "textarea", help: "No syllabus has been written for this course yet" }),
      btn("Save draft", "secondary", "save"), btn("Publish syllabus revision", "primary", "publish"),
    ]) });
  }

  function body(a) {
    if (!a.who.courseId) return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a, "You are not teaching this course")]);
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "course settings")]);
    return P.stack(a, [P.handoff(a, { title: "Open on a larger screen" }), top(a), facts(a), editor(a), modules(a), links(a)]);
  }

  WB.definePage("W36", {
    states: STATES,
    na: P.na(STATES, {
      invalid: "The syllabus text has no required format in this prototype",
      saving: "No syllabus record exists, so there is no save in progress to show",
      conflict: "No syllabus record exists for two people to edit",
    }),
    render: function (a) { return P.shell(a, { title: "Course settings", body: body(a) }, { page: "W36" }); },
  });
})(globalThis);
