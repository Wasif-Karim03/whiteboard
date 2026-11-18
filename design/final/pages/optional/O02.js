/* O02 Optional staff achievement authoring (Phase 3, optional; off by default). Instructor and TA. Web is full; iPad
   and iPhone are the handoff tier (banner and last result only, no controls). Every authoring control is disabled
   because enabling the feature needs a future product decision; a TA can never enable, issue or revoke awards.
   Notes: pages/seg6-grading/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "permissionUnavailable", "invalid"];
  var DECISION = "Needs a future product decision";

  function fields(a) {
    var error = a.state === "invalid" ? "A criterion may use released results only" : undefined;
    return P.stack(a, [
      a.K.field({ id: P.id(a, "name"), label: "Award name", disabled: true, reason: DECISION }),
      a.K.field({ id: P.id(a, "criteria"), label: "Criteria", type: "textarea", disabled: true, reason: DECISION, error: error }),
    ]);
  }

  function instructor(a) {
    var invalid = a.state === "invalid"
      ? a.K.notice({ tone: "error", title: "A criterion may not use unreleased grades", body: P.p("The entered criterion is not drawn: there is no sample record.") })
      : "";
    return P.stack(a, [
      invalid,
      a.K.notice({ tone: "info", title: "Achievements are an optional proposal and are off for this course" }),
      a.K.field({ id: P.id(a, "enable"), label: "Enable achievements", type: "checkbox", disabled: true, reason: DECISION }),
      a.variant === "enabled" || a.state === "invalid" ? fields(a) : "",
      a.K.button({ label: "Issue reviewed awards", disabled: true, reason: "No award is defined", id: P.id(a, "issue") }),
    ]);
  }

  function body(a) {
    if (a.tier !== "full") return P.handoff(a, { title: "Open on a larger screen", lastResult: P.p("Achievements are off for this course") });
    if (P.taEnded(a)) return P.taEndedNotice(a, null);
    if (a.state === "permissionUnavailable") return P.permissionNotice(a, a.role === "instructor" ? "You are not teaching this course" : null);
    if (a.state === "loading") return P.loading(a, "achievement settings");
    var main = a.role === "instructor" ? instructor(a) : a.K.notice({ tone: "info", title: "A teaching assistant cannot enable, issue or revoke awards" });
    return P.stack(a, [main, P.links(a, [{ label: "Course settings", go: "W36" }])]);
  }

  WB.definePage("O02", {
    states: STATES,
    na: P.na(STATES, {
      saving: "Achievements are off, so nothing is saved", saveFailed: "Achievements are off, so nothing is saved",
      success: "Achievements are off, so no award is issued", partialSuccess: "Achievements are off, so no award is issued",
      firstUseEmpty: "The page says in place that achievements are off", destructive: "Achievements are off, so no award is revoked",
    }),
    variants: { enabled: "Layout when enabled, with no records" },
    render: function (a) { return P.shell(a, { title: a.page.title, body: body(a) }, { page: "O02" }); },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
