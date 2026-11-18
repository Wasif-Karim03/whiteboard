/* W10 Profile, account and preferences (Phase 3 seg1). Only the viewer's own facts; institution-managed
   identity is read-only. No session fixture exists, so no session time is drawn. Sign out and sign in again are
   preview-only: a page link cannot change identity (amendment A1). Offline draws no sign-out dialog. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "invalid", "saving", "saveFailed", "offline", "sessionExpired"];
  var MAX_NAME = 80;
  var ROLE_NOTE = "Preview only: in this prototype, switch the role in the viewer bar or follow the tour";
  var CHOICES = { Theme: ["System", "Light", "Dark"], "Text size": ["Normal", "Larger"], Motion: ["System", "Reduce"] };

  function inst(a) { return a.view.data.world.institution; }
  function select(a, key, label, values) {
    return a.K.field({ id: P.id(a, key), type: "select", label: label, options: values.map(function (v) { return { value: v, label: v }; }) });
  }

  function identity(a) {
    var me = a.sel.person(a.view, a.who.personId);
    var c = a.sel.course(a.view, a.who.courseId);
    var rows = [
      { label: "Name", value: me.name }, { label: "Email", value: me.email }, { label: "Institution", value: inst(a).name },
      { label: "Role", value: WB.ROLE_LABELS[a.role] }, { label: "Course", value: c.code + " " + c.title },
    ];
    var end = a.role === "ta" ? a.sel.accessEnd(a.view, a.who.personId, a.who.courseId) : null;
    if (end) rows.push({ label: P.taEnded(a) ? "Grading access ended" : "Grading access ends", value: P.when(a, end) });
    return a.K.section({ title: "Managed by " + inst(a).name, body: P.stack(a, [a.K.kv(rows), P.links(a, [{ label: "Ask for a correction", go: "W12" }])]), level: 2 });
  }

  function saveBlock(a) {
    var reason = a.state === "offline" ? "You're offline. Nothing has been saved" : a.state === "invalid" ? "Fix the preferred name first" : "No changes to save";
    var save = a.K.button({ label: "Save preferences", kind: "primary", disabled: true, reason: reason, id: P.id(a, "save") });
    if (a.state === "saving") return P.stack(a, [a.K.saveStatus("saving"), save]);
    if (a.state === "saveFailed") return P.stack(a, [a.K.saveStatus("failed"), a.K.notice({ tone: "error", title: "Preferences were not saved" }), save]);
    return save;
  }

  function preferences(a) {
    var zone = inst(a).timezone;
    var err = a.state === "invalid" ? "Use " + MAX_NAME + " characters or fewer" : undefined;
    var fields = [
      a.K.field({ id: P.id(a, "name"), label: "Preferred name", error: err }),
      a.K.field({ id: P.id(a, "pronouns"), label: "Pronouns (optional)" }),
      select(a, "zone", "Time zone", [zone]),
    ].concat(Object.keys(CHOICES).map(function (k, i) { return select(a, "pref" + i, k, CHOICES[k]); }));
    return a.K.section({
      title: "Preferences", level: 2,
      body: P.stack(a, fields.concat([
        saveBlock(a),
        a.K.button({ label: "Change photo", kind: "quiet", note: "Preview only: photos are not uploaded in this prototype" }),
        P.links(a, [{ label: "Notification settings", go: "W08:settings" }]),
      ])),
    });
  }

  function security(a) {
    var out = a.state === "offline"
      ? a.K.button({ label: "Sign out", kind: "danger", disabled: true, reason: "You're offline. Sign out needs a connection", id: P.id(a, "signout-btn") })
      : a.K.button({ label: "Sign out", kind: "danger", act: "open-dialog", target: P.id(a, "signout") });
    return a.K.section({
      title: "Security", level: 2,
      body: P.stack(a, [
        P.p("This session"),
        a.K.button({ label: "End another session", disabled: true, reason: "No other sessions are listed", id: P.id(a, "end") }),
        P.p("Passwords are managed by " + inst(a).name + "."),
        out,
      ]),
    });
  }

  function signOutDialog(a) {
    return a.K.dialog(a.ctx, {
      id: P.id(a, "signout"), title: "Sign out", open: a.variant === "sign-out",
      body: P.p("Work that has not been handed in stays unsent."),
      actions: [{ label: "Sign out", kind: "primary", note: ROLE_NOTE, id: P.id(a, "signout-go") }],
    });
  }

  function body(a) {
    if (!a.who.personId || !a.who.courseId) return a.K.empty({ title: "No course is assigned to this account yet" });
    if (a.state === "loading") return P.loading(a, "your account");
    if (a.state === "sessionExpired") {
      return P.stack(a, [
        a.K.notice({ tone: "warning", title: "Your session ended. Nothing new was submitted", actions: [{ label: "Get help", go: "W12" }] }),
        a.K.button({ label: "Sign in again", kind: "primary", note: ROLE_NOTE }),
      ]);
    }
    var main = P.stack(a, [a.state === "offline" ? P.offlineNotice(a) : "", identity(a), preferences(a)]);
    return a.K.rail(a.ctx, { main: main, rail: security(a), railLabel: "Security" });
  }

  WB.definePage("W10", {
    states: STATES,
    na: P.na(STATES, {
      firstUseEmpty: "Every account has managed identity facts to show",
      conflict: "Preferences belong to one account and are edited by one person",
      success: "Saving is preview-only; no save result is drawn",
    }),
    variants: { "sign-out": "Sign-out dialog open" },
    render: function (a) {
      var out = { title: a.page.title, navActive: "account", body: body(a) };
      if (a.who.personId && a.who.courseId && (a.state === null || ["invalid", "saving", "saveFailed"].indexOf(a.state) >= 0)) out.dialog = signOutDialog(a);
      return out;
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
