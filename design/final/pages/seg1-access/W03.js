/* W03 Invitation (Phase 3 seg1). No invitation record exists in the fixtures, so the page states only the
   supported fact (access from the enrollment) and that the invitation cannot be verified; Accept stays disabled
   (amendment A7). Guests see the institution only. Identity changes are preview-only (A1). Contract: pages/PAGES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "permissionUnavailable"];
  var ROLE_NOTE = "Preview only: in this prototype, switch the role in the viewer bar or follow the tour";
  var HELP = { label: "Invitation help", go: "W12" };

  function inst(a) { return a.view.data.world.institution; }
  function guest(a) { return a.who.personId === null; }
  function accept(a, reason) {
    return a.K.button({ label: "Accept invitation", kind: "primary", disabled: true, reason: reason, id: P.id(a, "accept") });
  }
  function replacement(a) {
    return a.K.button({ label: "Request a replacement", note: "Preview only: a request is not an approval and nothing is sent" });
  }

  function guestBody(a) {
    var expired = a.state === "permissionUnavailable";
    return P.stack(a, [
      expired ? a.K.notice({ tone: "info", title: "This invitation has expired or was withdrawn. It cannot grant access" }) : "",
      a.K.kv([{ label: "Institution", value: inst(a).name }]),
      P.p("The recipient is hidden until you sign in."),
      expired
        ? a.K.button({ label: "Sign in to review", disabled: true, reason: "This invitation is no longer valid", id: P.id(a, "review") })
        : P.links(a, [{ label: "Sign in to review", go: "W01" }]),
      expired ? replacement(a) : "",
    ]);
  }

  function facts(a) {
    var c = a.sel.course(a.view, a.who.courseId);
    var rows = [
      { label: "Institution", value: inst(a).name },
      { label: "Course", value: c.code + " " + c.title + ", " + c.term },
      { label: "Role", value: WB.ROLE_LABELS[a.role] },
    ];
    var end = a.role === "ta" ? a.sel.accessEnd(a.view, a.who.personId, a.who.courseId) : null;
    if (end) rows.push({ label: "Grading access ends", value: P.when(a, end) });
    return a.K.kv(rows);
  }

  function current(a) {
    var course = P.recordGo("W14", "course", a.who.courseId);
    return P.stack(a, [
      facts(a),
      P.p("You already have access to this course as " + WB.ROLE_LABELS[a.role] + "."),
      P.p("This invitation's status cannot be checked in this prototype."),
      a.role === "ta" ? P.p("Accepting grants your allocated grading scope only, never policy or release.") : "",
      accept(a, "This invitation cannot be verified"),
      P.links(a, [course ? { label: "Open course", go: course } : null, { label: "Continue setup", go: "W04" }]),
    ]);
  }

  function signedBody(a) {
    if (P.taEnded(a)) return P.taEndedNotice(a);
    if (a.state === "loading") return P.loading(a, "the invitation");
    if (a.state === "permissionUnavailable") {
      return P.stack(a, [
        a.K.notice({ tone: "info", title: "This invitation has expired or was withdrawn. It cannot grant access", actions: [HELP] }),
        accept(a, "This invitation is no longer valid"), replacement(a),
      ]);
    }
    if (a.variant === "wrong-account") {
      return P.stack(a, [
        a.K.notice({ tone: "info", title: "This invitation is for a different account. You are signed in as " + a.sel.person(a.view, a.who.personId).name }),
        P.p("The recipient is hidden."),
        accept(a, "Signed in with a different account"),
        a.K.button({ label: "Use another account", note: ROLE_NOTE }),
      ]);
    }
    return current(a);
  }

  WB.definePage("W03", {
    states: STATES,
    na: P.na(STATES, {
      saveFailed: "No pending invitation exists in the fixtures, so no acceptance can be drawn (kit request)",
      success: "No pending invitation exists in the fixtures, so no acceptance can be drawn (kit request)",
      offline: "Nothing is sent from this page; the invitation cannot be verified here",
    }),
    variants: { "wrong-account": "Invitation for a different account" },
    render: function (a) {
      if (guest(a)) {
        return { mode: "access", title: a.page.title, body: a.state === "loading" ? P.loading(a, "the invitation") : guestBody(a), links: [HELP] };
      }
      return { title: a.page.title, body: signedBody(a), navActive: null };
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
