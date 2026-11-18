/* W12 Help and technical request (Phase 3 seg1). Guests use access mode and see no course, person or work
   facts. No request record exists, so sending is preview-only and no reference, case number or acknowledged time
   is ever drawn. Invalid, saving, save failure and offline draw no review dialog. Contract: pages/PAGES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["invalid", "saving", "saveFailed", "offline"];
  var TOPICS = ["Signing in", "Uploading work", "Quizzes", "Tools"];
  var PLACES = ["Sign-in", "Assignment upload", "Quiz", "Tool", "Other"];
  var GUEST_PLACES = ["Sign-in", "Other"];
  var DIAGNOSTICS = ["Page", "Time", "Browser version"];
  var MIN_TEXT = 20;

  function inst(a) { return a.view.data.world.institution; }
  function guest(a) { return a.who.personId === null; }
  function mail(a) { return "<p>" + a.K.link({ label: "Email " + inst(a).support, href: "mailto:" + inst(a).support }) + "</p>"; }

  function help(a) {
    return P.stack(a, [
      a.K.list({ label: "Help topics", items: TOPICS.map(function (t) { return { title: t }; }) }),
      P.p("Service status: sample only; not connected to a live service."),
      mail(a),
      guest(a) ? "" : P.links(a, [{ label: "Return to Home", go: "W05" }]),
    ]);
  }

  function opener(a) {
    if (a.state === "invalid") return a.K.button({ label: "Review request", kind: "primary", disabled: true, reason: "Describe the problem in at least " + MIN_TEXT + " characters", id: P.id(a, "review-btn") });
    if (a.state === "offline") return a.K.button({ label: "Review request", kind: "primary", disabled: true, reason: "You're offline. Nothing has been sent", id: P.id(a, "review-btn") });
    if (a.state) return "";
    return a.K.button({ label: "Review request", kind: "primary", act: "open-dialog", target: P.id(a, "review") });
  }

  function stateNotice(a) {
    if (a.state === "saving") return a.K.notice({ tone: "info", title: "Sending. Not acknowledged yet" });
    if (a.state === "saveFailed") {
      return P.stack(a, [
        a.K.notice({ tone: "warning", title: "We can't tell whether your request arrived", body: P.p("Check before retrying. Your draft is kept.") }),
        a.K.button({ label: "Check request status", note: "Preview only: no request record exists in this prototype" }),
      ]);
    }
    if (a.state === "offline") return a.K.notice({ tone: "warning", title: "Draft only. Not sent" });
    return "";
  }

  function form(a) {
    var places = guest(a) ? GUEST_PLACES : PLACES;
    return P.stack(a, [
      stateNotice(a),
      a.K.field({ id: P.id(a, "where"), type: "select", label: "Where did it happen", options: places.map(function (v) { return { value: v, label: v }; }) }),
      a.K.field({
        id: P.id(a, "what"), type: "textarea", label: "What happened", help: "Leave out answers, grades and private details",
        error: a.state === "invalid" ? "Describe the problem in at least " + MIN_TEXT + " characters" : undefined,
      }),
      a.K.choiceGroup({
        id: P.id(a, "diag"), legend: "Diagnostics to include", name: P.id(a, "diag"), type: "checkbox",
        options: DIAGNOSTICS.map(function (d, i) { return { id: P.id(a, "diag-" + i), value: d, label: d }; }),
      }),
      a.K.button({ label: "Attach a screenshot", kind: "quiet", note: "Preview only: files are not uploaded in this prototype" }),
      opener(a),
    ]);
  }

  function reviewDialog(a) {
    return a.K.dialog(a.ctx, {
      id: P.id(a, "review"), title: "Review your request", kind: "form", open: a.variant === "review",
      body: P.stack(a, [
        a.K.kv([{ label: "Recipient", value: inst(a).support }, { label: "Diagnostics", value: "None selected" }]),
        P.p("Sending a request does not submit coursework or extend a deadline."),
      ]),
      actions: [{ label: "Submit request", kind: "primary", note: "Preview only: nothing is sent and no reference is created", id: P.id(a, "review-send") }],
    });
  }

  WB.definePage("W12", {
    states: STATES,
    na: P.na(STATES, {
      loading: "Help text is static",
      success: "No request record exists in the fixtures, so no reference can be shown (kit request)",
      conflict: "A request draft belongs to one person",
    }),
    variants: { review: "Review dialog open" },
    render: function (a) {
      var body = a.K.rail(a.ctx, { main: help(a), rail: form(a), railLabel: "Request help" });
      var out = guest(a)
        ? { mode: "access", title: a.page.title, body: body, links: [{ label: "Back to sign-in", go: "W01" }] }
        : { title: a.page.title, navActive: "help", body: body };
      if (!a.state) out.dialog = reviewDialog(a);
      return out;
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
