/* W01 Institution sign-in (Phase 3 seg1). Guest only, access mode. The hand-off to the institution is drawn as a
   leaving dialog whose continue item is preview-only: a link would keep the guest role, and the tour carries the
   identity change to W02 (amendment A1). Blocking states draw no opener and no dialog. Contract: pages/PAGES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "filteredEmpty", "saving", "saveFailed", "offline", "permissionUnavailable"];
  var BLOCKING = ["filteredEmpty", "saving", "saveFailed", "offline", "permissionUnavailable"];
  var ROLE_NOTE = "Preview only: in this prototype, switch the role in the viewer bar or follow the tour";
  var HELP = { label: "Sign-in help", go: "W12" };

  function inst(a) { return a.view.data.world.institution; }
  function homeTitle() { return WB.manifest.pagesById.W05.title; }

  function search(a) {
    return a.K.field({ id: P.id(a, "find"), label: "Find your institution", help: "Search by name or email domain" });
  }

  function facts(a, owner) {
    var i = inst(a);
    var rows = [{ label: "Institution", value: i.name }, { label: "You will sign in at", value: i.sign_in_host }];
    if (owner) rows.push({ label: "Account recovery", value: i.support });
    rows.push({ label: "Then return to", value: homeTitle() });
    return a.K.kv(rows);
  }

  function leaveDialog(a) {
    return a.K.dialog(a.ctx, {
      id: P.id(a, "leave"), title: "Leaving Whiteboard", open: a.variant === "leaving",
      body: P.stack(a, [P.p("You are about to sign in on your institution's own page."), facts(a, true)]),
      actions: [{ label: "Continue to institution", kind: "primary", note: ROLE_NOTE, id: P.id(a, "leave-go") }],
    });
  }

  function form(a, cont) {
    return P.stack(a, [
      search(a),
      facts(a, false),
      a.K.field({ id: P.id(a, "remember"), type: "checkbox", label: "Remember this institution (never your credentials)" }),
      cont,
      a.K.button({ label: "Choose another institution", kind: "quiet", note: "Preview only: the institution list is a sample" }),
      P.p("Whiteboard never asks for your password. Simulated redirect: this prototype contacts no sign-in service."),
    ]);
  }

  function blocked(a, reason) {
    return a.K.button({ label: "Continue to institution", kind: "primary", disabled: true, reason: reason, id: P.id(a, "continue") });
  }

  function failed(a) {
    return a.K.notice({
      tone: "error", title: "The sign-in service could not be reached. You are not signed in",
      body: P.p("Checked " + P.when(a, a.view.clock) + ". Then return to: " + homeTitle() + "."),
      actions: [{ label: "Try again", go: "W01" }, HELP],
    });
  }

  function body(a) {
    var host = inst(a).sign_in_host;
    if (a.state === "loading") return P.stack(a, [search(a), '<p role="status">Searching institutions…</p>']);
    if (a.state === "permissionUnavailable") {
      return a.K.notice({ tone: "info", title: "That account belongs to a different institution", body: P.p("Choose the institution that issued your account."), actions: [{ label: "Choose the correct institution", go: "W01" }] });
    }
    if (a.state === "filteredEmpty") {
      return P.stack(a, [search(a), a.K.empty({ title: "No institution matches", body: P.p("Search by the institution's name or its email domain."), action: HELP }), blocked(a, "Choose an institution from the results first")]);
    }
    if (a.state === "saveFailed") return P.stack(a, [failed(a), facts(a, false)]);
    if (a.state === "saving") return form(a, blocked(a, "Already contacting " + host));
    if (a.state === "offline") return P.stack(a, [a.K.notice({ tone: "warning", title: "You're offline" }), form(a, blocked(a, "You're offline. Sign-in needs a connection"))]);
    return form(a, a.K.button({ label: "Continue to institution", kind: "primary", act: "open-dialog", target: P.id(a, "leave") }));
  }

  WB.definePage("W01", {
    states: STATES,
    na: P.na(STATES, {
      firstUseEmpty: "Sign-in always shows the institution search",
      invalid: "Typed text alone is never accepted; the no-match view covers it",
      sessionExpired: "Expired sessions are drawn on Auth return and System states",
      success: "This page only hands off; the outcome is drawn on Auth return",
    }),
    variants: { leaving: "Leaving Whiteboard dialog open" },
    render: function (a) {
      var out = { mode: "access", title: a.page.title, body: body(a), links: [HELP] };
      if (a.state === null || BLOCKING.indexOf(a.state) < 0) {
        if (a.state !== "loading") out.dialog = leaveDialog(a);
      }
      return out;
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
