/* W13 System states (Phase 3 seg1). Default is the not-found view. Guests, an expired session and maintenance
   use access mode; other signed-in views keep the app shell with no nav item current. No view names a record,
   course or person. Signing in again is preview-only (amendment A1). Contract: pages/PAGES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["permissionUnavailable", "sessionExpired"];
  var ROLE_NOTE = "Preview only: in this prototype, switch the role in the viewer bar or follow the tour";
  var HELP = { label: "Get help", go: "W12" };
  var MAINTENANCE = ["maintenance", "retry-failed"];

  function guest(a) { return a.who.personId === null; }
  function home(a) { return guest(a) ? { label: "Sign in", go: "W01" } : { label: "Go to Home", go: "W05" }; }

  function notFound(a) {
    return { title: "Page not found", body: a.K.notice({ tone: "info", title: "This page does not exist or has moved", actions: [home(a), HELP] }) };
  }

  function forbidden(a) {
    if (guest(a)) return { title: "Sign in to continue", body: a.K.notice({ tone: "info", title: "Sign in to continue", actions: [{ label: "Sign in to continue", go: "W01" }, HELP] }) };
    if (P.taEnded(a)) return { title: "Access ended", body: P.stack(a, [P.taEndedNotice(a), P.p("Access cannot be restored by switching role.")]) };
    return { title: "Not available", body: a.K.notice({ tone: "info", title: "This page is not available to this account", actions: [{ label: "Go to Home", go: "W05" }, HELP] }) };
  }

  function expired(a) {
    return {
      title: "Session expired",
      body: P.stack(a, [
        a.K.notice({ tone: "warning", title: "Your session has expired. Nothing new was submitted" }),
        a.K.button({ label: "Continue to sign-in", kind: "primary", act: "open-dialog", target: P.id(a, "leave") }),
      ]),
      dialog: a.K.dialog(a.ctx, {
        id: P.id(a, "leave"), title: "Leave unsent work",
        body: P.p("Work that was not handed in stays unsent on this device."),
        actions: [{ label: "Sign in again", kind: "primary", note: ROLE_NOTE, id: P.id(a, "leave-go") }, { label: "Get help", go: "W12", id: P.id(a, "leave-help") }],
      }),
    };
  }

  function maintenance(a) {
    var again = a.variant === "retry-failed" ? a.K.notice({ tone: "error", title: "Still unavailable. Try again later" }) : "";
    return {
      title: "Whiteboard is unavailable",
      body: P.stack(a, [
        a.K.notice({ tone: "warning", title: "Whiteboard is unavailable right now. No end time is known" }), again,
        a.K.button({ label: "Retry", note: "Preview only: no live service is checked in this prototype" }),
        P.links(a, [HELP]),
      ]),
    };
  }

  function view(a) {
    if (a.state === "permissionUnavailable") return forbidden(a);
    if (a.state === "sessionExpired") return expired(a);
    if (MAINTENANCE.indexOf(a.variant) >= 0) return maintenance(a);
    return notFound(a);
  }

  WB.definePage("W13", {
    states: STATES,
    na: P.na(STATES, {
      loading: "System states are static messages",
      offline: "Offline is drawn on each page that sends or loads data",
    }),
    variants: { maintenance: "Maintenance", "retry-failed": "Maintenance after a failed retry" },
    render: function (a) {
      var v = view(a);
      var access = guest(a) || a.state === "sessionExpired" || (a.state === null && MAINTENANCE.indexOf(a.variant) >= 0);
      var out = access ? { mode: "access", title: v.title, body: v.body, links: [HELP] } : { title: v.title, body: v.body, navActive: null };
      if (v.dialog) out.dialog = v.dialog;
      return out;
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
