/* W16 Modules. Course modules in order; a module not open yet shows only its opening time. Item rows are the
   module's published items (A4), linked by recordGo. Only the current module links to W17, the page that draws
   it. Completion tracking has no record yet (kit request). Contract: pages/PAGES.md, pages/SPINE.md; decisions
   in pages/seg2-course/NOTES.md (chosen by Claude under owner delegation). */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "firstUseEmpty", "offline", "notYetAvailable", "permissionUnavailable"];

  function modules(a) {
    return a.view.data.coursework.modules.filter(function (m) { return m.course_id === a.who.courseId; }).slice()
      .sort(function (x, y) { return x.position - y.position; });
  }
  function notOpen(a, m) { return a.sel.isBefore(a.view.clock, m.starts); }
  function span(a, m) { return a.sel.fmtShortDate(m.starts) + " to " + a.sel.fmtShortDate(m.ends); }
  function items(a, m) {
    var pub = P.assessments(a);
    return m.item_ids.map(function (id) { return pub.filter(function (x) { return x.id === id; })[0]; }).filter(Boolean);
  }

  function itemRow(a, x) {
    var go = WB.Teaching.courseworkGo(a, x);
    var name = go ? a.K.link({ label: x.title, go: go }) : esc(x.title);
    var status = a.role === "student" ? " " + P.status(a, P.ownSubmission(a, x.id), true) : "";
    return "<li>" + name + status + "</li>";
  }

  function moduleBody(a, m, current) {
    if (notOpen(a, m)) return a.K.flag("notOpen") + P.p("Opens " + P.when(a, m.starts));
    var list = items(a, m);
    var rows = list.length ? "<ul>" + list.map(function (x) { return itemRow(a, x); }).join("") + "</ul>" : P.p("Nothing is published in this module yet");
    var lesson = current ? P.links(a, [{ label: "Open lesson and materials", go: "W17" }]) : "";
    return P.p(span(a, m)) + rows + lesson;
  }

  function lockedNotice(a, list) {
    var first = list.filter(function (m) { return notOpen(a, m); })[0];
    if (!first) return a.K.notice({ tone: "info", title: "Every module is open at this point" });
    return a.K.notice({ tone: "info", title: first.title + " is not open yet", body: P.p("Opens " + P.when(a, first.starts) + ". Its items appear then.") });
  }

  function content(a) {
    var list = a.state === "firstUseEmpty" ? [] : modules(a);
    if (!list.length) return a.K.empty({ title: "No modules are published yet" });
    var cur = a.sel.currentModule(a.view, a.who.courseId);
    var blocks = list.map(function (m) {
      var current = Boolean(cur) && cur.id === m.id;
      return a.K.disclosure({ id: P.id(a, "m-" + m.id), summary: m.title, body: moduleBody(a, m, current), open: current });
    });
    var staff = a.role !== "student";
    return P.stack(a, [
      staff ? a.K.flag("preview") : "",
      P.taEnded(a) ? P.taEndedNotice(a, P.assessmentId(a)) : "",
      a.state === "notYetAvailable" ? lockedNotice(a, list) : "",
      P.stack(a, blocks),
      P.p("Completion tracking is not drawn in this prototype."),
      a.role === "instructor" ? P.links(a, [{ label: "Edit module", go: "W37" }]) : "",
    ]);
  }

  function body(a) {
    if (a.state === "permissionUnavailable") return P.permissionNotice(a, "You are not enrolled in this course");
    if (a.state === "loading") return P.loading(a, "the modules");
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown"), content(a)]);
    return content(a);
  }

  WB.definePage("W16", {
    states: STATES,
    na: P.na(STATES, {
      saving: "Manual completion needs records this prototype's data does not have",
      saveFailed: "Manual completion needs records this prototype's data does not have",
      destructive: "Manual completion needs records this prototype's data does not have",
      filteredEmpty: "The module filter is not drawn",
    }),
    render: function (a) { return P.shell(a, { title: "Modules", body: body(a) }, { page: "W16" }); },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
