/* W06 Courses and term archive. Global page, no course shell. The viewer's own enrollment lists their courses;
   only the anchored course opens its student home or staff builder; all enrolled courses have calendar actions. Past terms are the archived
   state, read-only. Enrollment and institution rows are read directly (SPINE A2; selector kit request).
   Contract: pages/PAGES.md, pages/SPINE.md; decisions in pages/seg2-course/NOTES.md (chosen by Claude under
   owner delegation). */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "firstUseEmpty", "filteredEmpty", "offline", "archived"];

  function myCourses(a) {
    var who = a.who;
    var row = a.view.data.world.enrollments.filter(function (e) { return e.person_id === who.personId && e.role === who.role; })[0];
    if (!row) return [];
    return row.course_ids.map(function (id) { return a.sel.course(a.view, id); }).filter(Boolean);
  }

  function meta(a, c) {
    var parts = [c.term, c.section, WB.ROLE_LABELS[a.role]];
    var next = a.role === "student" ? a.sel.nextDue(a.view, c.id, a.who) : null;
    var item = next ? a.sel.assessment(a.view, next.assessmentId) : null;
    if (item) parts.push("Next due " + item.title + ", " + P.when(a, next.due));
    if (a.role === "ta" && P.taEnded(a) && c.id === a.who.courseId) {
      var end = a.sel.accessEnd(a.view, a.who.personId, c.id);
      if (end) parts.push("Grading access ended " + P.when(a, end));
    }
    return parts.join(" · ");
  }

  function card(a, c, past) {
    var home = P.recordGo("W14", "course", c.id);
    var go = past ? null : a.role === "student" ? (home || WB.Teaching.go(a, "W14", { courseId: c.id, assessmentId: null, learnerId: null, receiptId: null })) : home ? "W35" : WB.Teaching.go(a, "W35", { courseId: c.id, assessmentId: null, learnerId: null, receiptId: null });
    var o = { key: c.key, code: c.code, title: c.title, meta: past ? [c.term, c.section].join(" · ") : meta(a, c) };
    if (go) o.go = go;
    var html = a.K.courseCard(a.ctx, o);
    var calendar = '<button type="button" class="wb-btn wb-btn--quiet" data-cal-op="open-course" data-cal-value="' + WB.esc(c.id) + '">Calendar<span class="wb-sr"> for ' + WB.esc(c.code) + '</span></button>';
    return P.stack(a, [html, calendar, past ? a.K.flag("readOnly") : ""]);
  }

  function grid(a, list, past) {
    return a.K.grid(a.ctx, { cols: 3, compactCols: 1, items: list.map(function (c) { return card(a, c, past); }) });
  }

  function controls(a, list, past) {
    var tabs = a.K.tabs({ label: "Course lists", items: [{ id: P.id(a, "tab-current"), label: "Current", go: "W06", current: !past }, { id: P.id(a, "tab-past"), label: "Past", go: "W06:archived", current: past }] });
    var terms = [];
    list.forEach(function (c) { if (terms.indexOf(c.term) < 0) terms.push(c.term); });
    var select = a.sizeClass === "regular" && terms.length
      ? a.K.field({ id: P.id(a, "term"), type: "select", label: "Term", help: "Preview only: term filtering does not run in this prototype", options: [{ value: "", label: "All terms" }].concat(terms.map(function (t) { return { value: t, label: t }; })) })
      : "";
    var search = a.K.field({ id: P.id(a, "search"), label: "Search courses", help: "Preview only: search does not run in this prototype" });
    return '<div class="wb-course-filters">' + tabs + a.K.disclosure({ id: P.id(a, "find"), summary: "Find a course", body: a.K.grid(a.ctx, { cols: 2, compactCols: 1, items: [select, search].filter(Boolean) }) }) + '</div>';
  }

  function pastView(a, all) {
    var past = all.filter(function (c) { return c.archived; });
    if (!past.length) {
      return a.K.empty({ title: "No past courses in your history", body: P.p("Older terms may be outside the retention period.") });
    }
    return P.stack(a, [P.p("Materials, your own work and released feedback stay readable."), grid(a, past, true)]);
  }

  function currentView(a, all) {
    var current = all.filter(function (c) { return !c.archived; });
    if (a.state === "filteredEmpty") {
      return a.K.empty({ title: "No courses match these filters", action: { label: "Clear filters", note: "Preview only: filters are not applied in this prototype" } });
    }
    if (!current.length || a.state === "firstUseEmpty") {
      return a.K.empty({ title: "You have no current courses", action: { label: "View past courses", go: "W06:archived" } });
    }
    var linked = false;
    return P.stack(a, [grid(a, current, false), linked ? P.p("Other courses are listed but not drawn in this prototype.") : ""]);
  }

  function body(a) {
    var all = myCourses(a);
    var past = a.state === "archived";
    var head = controls(a, all, past);
    if (a.state === "loading") return P.stack(a, [head, P.loading(a, "your courses")]);
    var content = past ? pastView(a, all) : currentView(a, all);
    var offline = a.state === "offline"
      ? P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown"), a.K.button({ label: "Retry", note: "Preview only: nothing reconnects in this prototype" })])
      : "";
    var links = [a.role === "instructor" ? { label: "Copy a course to a new term", go: "W59" } : null, { label: "Ask about missing access", go: "W12" }];
    return P.stack(a, [offline, head, content, P.links(a, links)]);
  }

  WB.definePage("W06", {
    states: STATES,
    na: P.na(STATES, { permissionUnavailable: "Courses lists only your own memberships; there is nothing to deny" }),
    render: function (a) { return { title: a.role === "instructor" ? "Teaching courses" : a.role === "ta" ? "Teaching assignments" : "Courses", navActive: "courses", body: body(a) }; },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
