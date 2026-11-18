/* W17 Lesson and materials. Draws the current module (no lesson records exist yet; kit request): its span, the
   files shared in published course announcements and a link on to the module's first published item (A4).
   No completion control. Contract: pages/PAGES.md, pages/SPINE.md; decisions in pages/seg2-course/NOTES.md
   (chosen by Claude under owner delegation). */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "firstUseEmpty", "offline", "notYetAvailable", "permissionUnavailable"];
  var BACK = { label: "Back to modules", go: "W16" };

  function span(a, m) { return a.sel.fmtShortDate(m.starts) + " to " + a.sel.fmtShortDate(m.ends); }
  function firstLocked(a) {
    return a.view.data.coursework.modules.filter(function (m) { return m.course_id === a.who.courseId && a.sel.isBefore(a.view.clock, m.starts); })
      .sort(function (x, y) { return x.position - y.position; })[0] || null;
  }
  function locked(a) { return a.state === "notYetAvailable" ? firstLocked(a) : null; }
  function drawn(a) { return locked(a) || a.sel.currentModule(a.view, a.who.courseId); }

  function files(a) {
    var anns = a.state === "firstUseEmpty" ? [] : a.view.data.comms.announcements.filter(function (x) { return x.course_id === a.who.courseId && x.state === "published"; });
    var rows = [];
    anns.forEach(function (ann) {
      ann.attachments.forEach(function (f) {
        var go = P.recordGo("W29", "announcement", ann.id);
        var links = (go ? a.K.link({ label: "Open announcement", go: go }) : "") + a.K.button({ label: "Download", kind: "quiet", note: "Preview only: files are not downloaded in this prototype" });
        var meta = [f.pages ? f.pages + (f.pages === 1 ? " page" : " pages") : "", f.accessible_version ? "Accessible version available" : ""].filter(Boolean).join(" · ");
        rows.push({ title: f.name, meta: meta, trailing: links });
      });
    });
    var body = rows.length ? a.K.list({ label: "Shared files", items: rows }) : a.K.empty({ title: "No files are shared yet" });
    return a.K.section({ title: "Files shared in course announcements", body: a.state === "loading" ? P.loading(a, "files") : body });
  }

  function nextLinks(a, m) {
    var pub = P.assessments(a);
    var first = m.item_ids.map(function (id) { return pub.filter(function (x) { return x.id === id; })[0]; }).filter(Boolean)[0];
    var go = first ? WB.Teaching.courseworkGo(a, first) : null;
    var links = [go ? { label: first.title, go: go } : null, { label: "Coursework", go: "W18" }, BACK];
    return a.K.section({ title: "Next", level: 3, body: (first && !go ? P.p(first.title) : "") + P.links(a, links) });
  }

  function lockedView(a, m) {
    return P.stack(a, [a.K.flag("notOpen"), P.p("Opens " + P.when(a, m.starts)), P.links(a, [BACK])]);
  }

  function content(a) {
    var lock = locked(a);
    if (lock) return lockedView(a, lock);
    var m = a.sel.currentModule(a.view, a.who.courseId);
    var none = a.state === "notYetAvailable" ? a.K.notice({ tone: "info", title: "No module is locked at this point" }) : "";
    if (!m) return P.stack(a, [none, a.K.notice({ tone: "info", title: "No module is running at this point" }), P.links(a, [BACK])]);
    return P.stack(a, [
      none,
      a.role !== "student" ? a.K.flag("preview") : "",
      P.taEnded(a) ? P.taEndedNotice(a, P.assessmentId(a)) : "",
      P.p(span(a, m)),
      a.K.notice({ tone: "info", title: "Lesson text is not in the prototype data yet" }),
      files(a),
      nextLinks(a, m),
      a.role === "instructor" ? P.links(a, [{ label: "Edit lesson", go: "W38" }]) : "",
    ]);
  }

  function body(a) {
    if (a.state === "permissionUnavailable") return P.permissionNotice(a, "You are not enrolled in this course");
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown"), content(a)]);
    return content(a);
  }

  function render(a) {
    var c = a.sel.course(a.view, a.who.courseId);
    var m = a.state === "permissionUnavailable" ? null : drawn(a);
    var home = c ? P.recordGo("W14", "course", c.id) : null;
    var crumbs = home ? [{ label: c.code, go: home }, { label: "Modules", go: "W16" }] : undefined;
    return P.shell(a, { title: m ? m.title : a.page.title, body: body(a), crumbs: crumbs }, { page: "W17" });
  }

  WB.definePage("W17", {
    states: STATES,
    na: P.na(STATES, {
      saving: "Manual completion needs a lesson record this prototype's data does not have",
      saveFailed: "Manual completion needs a lesson record this prototype's data does not have",
    }),
    render: render,
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
