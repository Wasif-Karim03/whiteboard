/* W02 Auth return/recovery (Phase 3 seg1). Access mode for every role: authenticated nav is never drawn during
   verification. A guest never gets account facts. Switching account and signing in again are preview-only, since
   a page link cannot change identity (amendment A1). Contract: pages/PAGES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "offline", "permissionUnavailable", "sessionExpired"];
  var ROLE_NOTE = "Preview only: in this prototype, switch the role in the viewer bar or follow the tour";
  var HELP = { label: "Sign-in help", go: "W12" };

  function inst(a) { return a.view.data.world.institution; }
  function guest(a) { return a.who.personId === null; }
  function name(a) { return a.sel.person(a.view, a.who.personId).name; }

  function account(a) {
    var c = a.sel.course(a.view, a.who.courseId);
    return a.K.kv([
      { label: "Account", value: name(a) },
      { label: "Institution", value: inst(a).name },
      { label: "Course role", value: WB.ROLE_LABELS[a.role] + " in " + c.code + " (read-only)" },
      { label: "Return to", value: WB.manifest.pagesById.W05.title },
    ]);
  }

  function switchDialog(a) {
    return a.K.dialog(a.ctx, {
      id: P.id(a, "switch"), title: "Switch signed-in account",
      body: P.p("Signing in with another account ends this sign-in on this device."),
      actions: [{ label: "Restart sign-in", kind: "primary", note: ROLE_NOTE, id: P.id(a, "switch-go") }],
    });
  }

  function signedIn(a) {
    var ok = a.K.notice({ tone: "success", title: "Signed in to " + inst(a).name });
    if (a.variant === "destination-gone") {
      return P.stack(a, [ok, a.K.notice({ tone: "info", title: "The page you asked for is no longer available", actions: [{ label: "Continue to Home", go: "W05" }] })]);
    }
    return P.stack(a, [
      ok, account(a),
      P.links(a, [{ label: "Continue to Home", go: "W05" }, { label: "Finish setup", go: "W04" }, { label: "Review your invitation", go: "W03" }]),
      a.K.button({ label: "Use another account", act: "open-dialog", target: P.id(a, "switch") }),
    ]);
  }

  function noAccess(a) {
    if (guest(a)) {
      return a.K.notice({ tone: "info", title: "That account belongs to a different institution", body: P.p("Nothing was submitted."), actions: [{ label: "Retry sign-in", go: "W01" }, HELP] });
    }
    return P.stack(a, [
      a.K.notice({ tone: "info", title: "You are signed in, but this account has no course access here", actions: [HELP] }),
      a.K.kv([{ label: "Account", value: name(a) }, { label: "Institution", value: inst(a).name }]),
      a.K.button({ label: "Use another account", note: ROLE_NOTE }),
    ]);
  }

  function body(a) {
    if (a.state === "loading") {
      return P.stack(a, [
        '<p role="status">' + WB.esc("Verifying your sign-in with " + inst(a).name + "…") + "</p>",
        a.K.button({ label: "Continue", kind: "primary", disabled: true, reason: "Verification is still running", id: P.id(a, "continue") }),
      ]);
    }
    if (a.state === "sessionExpired") {
      return P.stack(a, [
        a.K.notice({ tone: "warning", title: "This sign-in link has expired or was already used", body: P.p("Nothing was submitted."), actions: [HELP] }),
        a.K.button({ label: "Sign in again", kind: "primary", note: ROLE_NOTE }),
      ]);
    }
    if (a.state === "permissionUnavailable") return noAccess(a);
    if (a.state === "offline") return a.K.notice({ tone: "warning", title: "Can't verify while offline. Nothing changed", actions: [{ label: "Check again", go: "W02" }] });
    if (guest(a)) return a.K.notice({ tone: "info", title: "Sign-in was not completed. Nothing was submitted", actions: [{ label: "Retry sign-in", go: "W01" }] });
    return signedIn(a);
  }

  WB.definePage("W02", {
    states: STATES,
    na: P.na(STATES, {
      firstUseEmpty: "Auth return always shows the result of one sign-in",
      success: "A confirmed sign-in is the default view of this page",
    }),
    variants: { "destination-gone": "Requested page no longer available" },
    render: function (a) {
      var out = { mode: "access", title: a.page.title, body: body(a), links: [HELP] };
      if (a.state === null && !guest(a) && a.variant !== "destination-gone") out.dialog = switchDialog(a);
      return out;
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
