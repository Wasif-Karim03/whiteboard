/* O03 Optional course FAQ assistant (Phase 3, optional; off by default). Student only. The assistant runs no AI
   service in this prototype: the default view says it is off and the "enabled" presentation variant shows the
   layout with a disabled question box and no answer or citation. Notes: pages/seg6-grading/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "offline", "permissionUnavailable", "firstUseEmpty"];
  var NO_QUESTIONS = { title: "No questions asked", body: "<p>Answers would cite course pages; none is drawn in this prototype.</p>" };

  function enabled(a) {
    return P.stack(a, [
      a.K.field({ id: P.id(a, "question"), label: "Question", type: "textarea", disabled: true, reason: "Simulated answers are not drawn in this prototype" }),
      a.K.empty(NO_QUESTIONS),
      a.K.button({ label: "Clear context", disabled: true, reason: "Nothing to clear", id: P.id(a, "clear") }),
    ]);
  }

  function main(a) {
    if (a.state === "offline") return a.K.notice({ tone: "warning", title: "The assistant is unavailable. Nothing was sent" });
    if (a.state === "firstUseEmpty") return a.K.empty(NO_QUESTIONS);
    if (a.variant === "enabled") return enabled(a);
    return a.K.notice({ tone: "info", title: "The course assistant is an optional proposal and is off", body: P.p("It runs no AI service in this prototype.") });
  }

  function body(a) {
    if (a.state === "permissionUnavailable" || !a.sel.courseShell(a.view, a.who, { page: "O03" })) return P.permissionNotice(a);
    if (a.state === "loading") return P.loading(a, "the course assistant");
    var home = P.recordGo("W14", "course", a.who.courseId);
    return P.stack(a, [main(a), P.links(a, [
      { label: "Ask in course discussion", go: "W30" }, { label: "Help", go: "W12" }, home ? { label: "Course home", go: home } : null,
    ])]);
  }

  WB.definePage("O03", {
    states: STATES,
    na: P.na(STATES, {
      invalid: "The question box stays disabled, so nothing is typed", saving: "The assistant is off, so nothing is saved",
      saveFailed: "The assistant is off, so nothing is saved", success: "The assistant is off, so no answer is given",
    }),
    variants: { enabled: "Layout when enabled, with no records" },
    render: function (a) { return P.shell(a, { title: a.page.title, body: body(a) }, { page: "O03" }); },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
