/* W55 Announcement editor (Phase 3 seg4). Instructor and TA. The subject is the W29 anchor announcement when it exists
   at the clock, else a new blank one. Publish and Withdraw open confirm dialogs whose primary item is preview only
   (no result scenario exists). A TA reads published announcements only. iPad and iPhone are the review tier with
   the instructor's "Withdraw announcement" protective action. Rules: pages/seg4-community/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "invalid", "saving", "saveFailed", "offline", "permissionUnavailable"];
  var SHOWN = ["published", "withdrawn"];
  var BLOCK = { invalid: "Add a title first", saving: "Your changes are still saving", saveFailed: "Save the draft first", offline: "You're offline" };

  function anns(a) { return a.view.data.comms.announcements.filter(function (x) { return x.course_id === a.who.courseId; }); }
  function latest(x) { return x.revisions[x.revisions.length - 1]; }
  function subject(a) {
    var id = a.sel.anchorFor("W29").record.id;
    return anns(a).filter(function (x) { return x.id === id; })[0] || null;
  }
  function blocked(a) { return Object.prototype.hasOwnProperty.call(BLOCK, a.state) ? BLOCK[a.state] : ""; }
  // R06: on the review tier every blocking state but form validation (no form is drawn there) blocks the protective action.
  function reviewBlocked(a) { return a.state === "invalid" ? "" : blocked(a); }
  function stateText(a, x) {
    if (!x || x.state === "draft") return "Not published yet";
    if (x.state === "scheduled") return "Scheduled" + (x.scheduled_for ? " for " + P.when(a, x.scheduled_for) : "");
    if (x.state === "withdrawn") return "Withdrawn" + (x.withdrawn_at ? " " + P.when(a, x.withdrawn_at) : "");
    return "Published " + P.when(a, x.published_at);
  }

  function allList(a, list) {
    if (!list.length) return P.p("No announcements yet");
    return a.K.list({
      label: "All announcements",
      items: list.map(function (x) {
        var go = SHOWN.indexOf(x.state) >= 0 ? P.recordGo("W29", "announcement", x.id) : null;
        var item = { title: latest(x).title, meta: stateText(a, x) };
        if (go) item.go = go;
        return item;
      }),
    });
  }
  function history(a, x) {
    if (!x) return P.p("No versions yet");
    var items = x.revisions.slice().reverse().map(function (r) { return { title: "Version " + r.rev, meta: P.when(a, r.at) }; });
    return a.K.list({ label: "Version history", items: items });
  }
  function audienceText(a) {
    var course = a.sel.course(a.view, a.who.courseId);
    var n = a.sel.enrolled(a.view, a.who.courseId, "student").length;
    return "Everyone in " + course.code + ": " + n + (n === 1 ? " learner" : " learners");
  }

  function editor(a, x) {
    var l = x ? latest(x) : null;
    var timing = a.K.choiceGroup({
      legend: "When to publish", name: P.id(a, "timing"), id: P.id(a, "timing"), type: "radio",
      options: [{ id: P.id(a, "timing-now"), value: "now", label: "Publish now", checked: true }, { id: P.id(a, "timing-later"), value: "later", label: "Schedule for later" }],
    });
    return P.stack(a, [
      a.K.field({ label: "Title", id: P.id(a, "title"), value: a.state === "invalid" || !l ? "" : l.title, error: a.state === "invalid" ? "Add a title" : undefined }),
      a.K.field({ label: "Message", type: "textarea", id: P.id(a, "body"), value: l ? l.body : "" }),
      P.p("Audience: " + audienceText(a)), timing,
    ]);
  }

  function stateTop(a) {
    if (a.state === "saving") return a.K.saveStatus("saving");
    if (a.state === "offline") return P.offlineNotice(a) + a.K.flag("lastKnown");
    if (a.state !== "saveFailed") return "";
    return a.K.saveStatus("failed") + a.K.notice({
      tone: "error", title: "Your changes were not saved. Learners still see the last published version",
      actions: [{ label: "Retry save", note: "Preview only: nothing is saved in this prototype" }],
    });
  }

  function button(a, label, suffix, opener, note) {
    var reason = blocked(a);
    if (reason) return a.K.button({ label: label, disabled: true, reason: reason, id: P.id(a, suffix) });
    if (opener) return a.K.button({ label: label, kind: suffix === "publish-btn" ? "primary" : "secondary", act: "open-dialog", target: P.id(a, opener) });
    return a.K.button({ label: label, note: note });
  }
  function actions(a, x) {
    var out = [button(a, "Save draft", "save", null, "Preview only: nothing is saved in this prototype")];
    if (x && x.state === "withdrawn") out.push(button(a, "Publish again as a new version", "republish", null, "Preview only: nothing is published in this prototype"));
    else out.push(button(a, x && x.state === "published" ? "Publish update…" : "Publish…", "publish-btn", "publish"));
    if (x && x.state === "published") out.push(button(a, "Withdraw…", "withdraw-btn", "withdraw"));
    return P.stack(a, out);
  }

  function dialogs(a, x) {
    if (blocked(a)) return "";
    var title = x ? latest(x).title : "New announcement";
    var publish = a.K.dialog(a.ctx, {
      id: P.id(a, "publish"), title: "Publish this announcement?", open: a.variant === "publish",
      body: a.K.kv([{ label: "Title", value: title }, { label: "Audience", value: audienceText(a) }, { label: "Timing", value: "Publish now" }]) +
        P.p("Delivery follows each person's notification settings; publishing is recorded separately."),
      actions: [{ label: "Publish", kind: "primary", id: P.id(a, "publish-go"), note: "Preview only: nothing is published in this prototype" }],
    });
    if (!x || x.state !== "published") return publish;
    return publish + a.K.dialog(a.ctx, {
      id: P.id(a, "withdraw"), title: "Withdraw this announcement?", kind: "destructive", open: a.variant === "withdraw",
      body: P.p("Learners will see a Withdrawn notice in place of the text. The history is kept."),
      actions: [{ label: "Withdraw announcement", kind: "primary", id: P.id(a, "withdraw-go"), note: "Preview only: nothing is withdrawn in this prototype" }],
    });
  }

  function links(a, x) {
    var go = x && SHOWN.indexOf(x.state) >= 0 ? P.recordGo("W29", "announcement", x.id) : null;
    return P.links(a, [{ label: "Announcements", go: "W28" }, go ? { label: "View as published", go: go } : null]);
  }

  function rail(a, x) {
    return P.stack(a, [P.p(stateText(a, x)), a.K.section({ title: "Versions", level: 2, body: history(a, x) }), a.K.section({ title: "All announcements", level: 2, body: allList(a, anns(a)) })]);
  }

  function instructorFull(a, x) {
    var main = P.stack(a, [stateTop(a), editor(a, x), actions(a, x), links(a, x)]);
    return { body: a.K.rail(a.ctx, { main: main, rail: rail(a, x), railLabel: "Status and history" }), dialog: dialogs(a, x) };
  }

  function instructorReview(a, x) {
    var reason = reviewBlocked(a);
    var withdraw = reason ? { label: "Withdraw announcement", disabled: true, reason: reason, id: P.id(a, "withdraw-off") }
      : { label: "Withdraw announcement", note: "Preview only: nothing is withdrawn in this prototype" };
    var protect = x && x.state === "published" ? [withdraw] : [];
    var result = P.p((x ? latest(x).title : "New announcement") + " · " + stateText(a, x));
    var text = x && x.state === "published" ? P.p(latest(x).body) : "";
    var top = reason ? stateTop(a) : "";
    return P.stack(a, [P.handoff(a, { title: "Open on a larger screen", lastResult: result, protectiveActions: protect }), top, text, history(a, x), allList(a, anns(a)), links(a, x)]);
  }

  function taView(a) {
    var shown = anns(a).filter(function (x) { return SHOWN.indexOf(x.state) >= 0; });
    var notice = a.K.notice({ tone: "info", title: "Publishing announcements is the instructor's step", body: P.p("You can read the published announcements.") });
    return P.stack(a, [P.bareHandoff(a), notice, allList(a, shown), P.links(a, [{ label: "Announcements", go: "W28" }])]);
  }

  function view(a) {
    if (!a.who.courseId) return { body: P.stack(a, [P.bareHandoff(a), P.permissionNotice(a, "You are not teaching this course")]), dialog: "" };
    var gate = P.staffGate(a, null);
    if (gate) return { body: gate, dialog: "" };
    if (a.state === "loading") return { body: P.stack(a, [P.bareHandoff(a), P.loading(a, "the announcement editor")]), dialog: "" };
    if (a.role === "ta") return { body: taView(a), dialog: "" };
    var x = subject(a);
    return a.tier === "full" ? instructorFull(a, x) : { body: instructorReview(a, x), dialog: "" };
  }

  WB.definePage("W55", {
    states: STATES,
    na: P.na(STATES, {
      destructive: "Withdrawing keeps the full history; nothing is deleted",
      conflict: "One instructor authors announcements in this prototype",
      firstUseEmpty: "The editor starts a new announcement when there is none; the list shows the empty course",
    }),
    variants: { publish: "Publish dialog open", withdraw: "Withdraw dialog open" },
    render: function (a) {
      var v = view(a);
      return P.shell(a, { title: "Announcement editor", body: v.body, dialog: v.dialog || undefined }, { section: "announcements" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
