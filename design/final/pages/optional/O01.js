/* O01 Optional student achievements (Phase 3, optional; off by default). Student only. No fixture says a course opted
   in, so the default view says the feature is off and the "enabled" presentation variant shows the layout with
   truthful empties: no award, criterion, peer, ranking or points is ever drawn. Notes: pages/seg6-grading/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "permissionUnavailable", "firstUseEmpty"];

  function off(a) {
    return a.K.notice({ tone: "info", title: "Achievements are an optional proposal and are off for this course", body: P.p("Recognition is separate from grades.") });
  }

  function enabled(a) {
    return P.stack(a, [
      a.K.segmented({ label: "Show", name: P.id(a, "filter"), options: [{ value: "earned", label: "Earned", selected: true }, { value: "available", label: "Available" }, { value: "all", label: "All" }] }),
      a.K.empty({ title: "No award criteria are published", body: P.p("Recognition is separate from grades and never changes a score.") }),
      a.K.field({ id: P.id(a, "share"), label: "Sharing", type: "select", options: [{ value: "private", label: "Only me" }], disabled: true, reason: "Private course view only" }),
      a.K.button({ label: "Ask for correction", disabled: true, reason: "You have no award to correct", id: P.id(a, "correct") }),
    ]);
  }

  function body(a) {
    if (a.state === "permissionUnavailable" || !a.sel.courseShell(a.view, a.who, { page: "O01" })) return P.permissionNotice(a);
    if (a.state === "loading") return P.loading(a, "achievements");
    var main = a.variant === "enabled" ? enabled(a) : a.state === "firstUseEmpty" ? a.K.empty({ title: "No achievements yet", body: P.p("Achievements are off for this course.") }) : off(a);
    var home = P.recordGo("W14", "course", a.who.courseId);
    return P.stack(a, [main, home ? P.links(a, [{ label: "Course home", go: home }]) : ""]);
  }

  WB.definePage("O01", {
    states: STATES,
    na: P.na(STATES, {
      filteredEmpty: "The filter is drawn only in the enabled layout, which has no records to filter",
      offline: "This page sends nothing while achievements are off",
      success: "Achievements are off, so nothing is earned or corrected here",
      invalid: "This page takes no typed input",
    }),
    variants: { enabled: "Layout when enabled, with no records" },
    render: function (a) { return P.shell(a, { title: a.page.title, body: body(a) }, { page: "O01" }); },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
