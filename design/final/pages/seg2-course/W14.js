/* W14 Course home (Phase 3 spine). Anchor course record, home default. Student: current module, next due work,
   own counts and released course total. Staff: explicit published-content preview with staff identity;
   a TA after access ends sees the content plus the access notice. Contract: pages/PAGES.md, pages/SPINE.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "offline", "permissionUnavailable"];

  function itemGo(a, item) { return WB.Teaching.courseworkGo(a, item); }
  function itemLink(a, item) {
    var go = itemGo(a, item);
    return go ? a.K.link({ label: item.title, go: go }) : esc(item.title);
  }

  function moduleBlock(a) {
    var m = a.sel.currentModule(a.view, a.who.courseId);
    if (!m) return a.K.section({ title: "This week", body: P.p("No module is running this week") });
    var published = P.assessments(a);
    var next = a.role === "student" ? a.sel.nextDue(a.view, a.who.courseId, a.who) : null;
    var items = published.filter(function (it) { return m.item_ids.indexOf(it.id) >= 0 && (!next || it.id !== next.assessmentId); });
    var span = a.sel.fmtShortDate(m.starts) + " to " + a.sel.fmtShortDate(m.ends);
    var list = items.length ? a.K.list({ label: "Module coursework", items: items.map(function (x) { return { title: x.title, go: itemGo(a, x) || undefined }; }) }) : P.p(next && m.item_ids.indexOf(next.assessmentId) >= 0 ? "No other coursework in this module" : "Nothing is published in this module yet");
    return a.K.section({ title: m.title, body: P.p(span) + list });
  }

  function nextDueBlock(a) {
    var next = a.sel.nextDue(a.view, a.who.courseId, a.who);
    if (!next) return a.K.empty({ title: "Nothing due", body: P.p("You have no open work with a due date ahead.") });
    var item = a.sel.assessment(a.view, next.assessmentId);
    var go = itemGo(a, item);
    var action = go ? [{ label: item.quiz_id ? "View quiz rules" : "View assignment", go: go, kind: "primary" }] : [];
    return a.K.section({ title: "Next due", body: P.p(item.title) + P.p("Due " + P.when(a, next.due)), actions: action, level: 2 });
  }

  function studentRail(a) {
    var c = a.sel.courseworkCounts(a.view, a.who.courseId, a.who.personId);
    var total = a.sel.courseTotal(a.view, a.who.courseId, a.who.personId, a.who);
    var stats = a.K.grid(a.ctx, {
      cols: 2, compactCols: 2,
      items: [
        a.K.stat({ label: "All work", value: String(c.all) }), a.K.stat({ label: "To do", value: String(c.toDo) }),
        a.K.stat({ label: "Handed in", value: String(c.handedIn) }), a.K.stat({ label: "Feedback out", value: String(c.released) }),
      ],
    });
    var figure = total && !total.empty ? a.K.figure({ label: "Course total", value: total.display, basis: "Released results only" }) : P.p("No released results yet");
    return a.K.disclosure({ id: P.id(a, "progress"), summary: "Course progress", body: P.stack(a, [stats, figure]) });
  }

  function content(a) {
    var c = a.sel.course(a.view, a.who.courseId);
    var context = P.p(c.code + " · " + c.term);
    if (a.role !== "student") {
      var warning = P.taEnded(a) && a.sel.accessEnd(a.view, a.who.personId, a.who.courseId) ? P.taEndedNotice(a, P.assessmentId(a)) : P.taTaskEnded(a, P.assessmentId(a)) ? P.taTaskEndedNotice(a, P.assessmentId(a)) : "";
      return P.stack(a, [context, a.K.badge({ label: "Published content preview", tone: "neutral" }), P.p("Published course content. You are still viewing as " + WB.ROLE_LABELS[a.role] + "."), warning, P.links(a, [{ label: "Return to course builder", go: "W35" }]), moduleBlock(a)]);
    }
    return P.stack(a, [context, a.K.rail(a.ctx, { main: P.stack(a, [nextDueBlock(a), moduleBlock(a)]), rail: studentRail(a), railLabel: "Course progress" })]);
  }

  function body(a) {
    if (!a.who.courseId || a.state === "permissionUnavailable") return P.permissionNotice(a, "You are not enrolled in this course");
    if (a.state === "loading") return P.loading(a, "the course home");
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown"), content(a)]);
    return content(a);
  }

  WB.definePage("W14", {
    states: STATES,
    na: P.na(STATES, { firstUseEmpty: "A course home always shows its modules; an empty course is drawn on the module page" }),
    render: function (a) { var c = a.sel.course(a.view, a.who.courseId); return P.shell(a, { title: a.role !== "student" && c && a.state !== "permissionUnavailable" ? "Published course preview" : c && a.state !== "permissionUnavailable" ? c.title : a.page.title, body: body(a) }, { page: "W14" }); },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
