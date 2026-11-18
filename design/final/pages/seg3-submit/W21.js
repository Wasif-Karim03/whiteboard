/* W21 Review and submit (Phase 3 spine). Student only; anchor and home as W20, variant motion. Submit is the
   committing action: unconfirmed by default (R11), an enabled dialog opener on the reviewed presentation
   variants, and the dialog drawn open on confirm. Closed, offline, conflict, saving and a coverage gap always win
   over the reviewed variants. The only link to the receipt sits inside the dialog. Contract: pages/SPINE.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "invalid", "saving", "conflict", "offline"];
  var REVIEWED = ["reviewed", "motion-reviewed", "confirm"];

  function isMotion(a) { return P.suffix(a) !== ""; }
  function reviewed(a) { return REVIEWED.indexOf(a.variant) >= 0; }

  function filesRows(a, draft) {
    return draft.files.map(function (f, i) { return { label: "File " + (i + 1), value: f.name + " · " + P.fileMeta(a, f) }; });
  }

  function payload(a, it, draft) {
    var rows = [{ label: "Assignment", value: it.title }, { label: "Attempt", value: String(draft.attempt) }]
      .concat(filesRows(a, draft))
      .concat([{ label: "Total pages", value: String(P.pageCount(draft.files)) }]);
    if (it.due) rows.push({ label: "Due", value: P.when(a, it.due) });
    if (draft.assessment_version !== undefined) rows.push({ label: "Assignment version", value: String(draft.assessment_version) });
    return rows;
  }

  function groupRows(a, draft) {
    if (!draft.captured_members) return [];
    var names = draft.captured_members.map(function (m) { return P.personName(a, m); }).filter(Boolean).join(", ");
    return [{ label: "Handed in for", value: names }, { label: "Group membership version", value: String(draft.membership_version) }];
  }

  // Questions with no tagged page; null when the assessment has no question list (R06).
  function gaps(it, draft) {
    if (!it.questions) return null;
    var tagged = [];
    (draft.page_tags || []).forEach(function (t) { tagged = tagged.concat(t.questions); });
    return it.questions.map(function (q) { return q.id; }).filter(function (q) { return tagged.indexOf(q) < 0; });
  }

  function coverage(a, it, draft) {
    var missing = gaps(it, draft);
    if (missing === null) return "";
    var tags = P.tagRows(draft.page_tags);
    var text = missing.length ? P.p(P.questionsText(missing) + " have no page yet.") : P.p("Every question has a page");
    var tone = missing.length && a.state === "invalid" ? a.K.notice({ tone: "error", title: "Some questions have no page", body: text }) : text;
    return a.K.section({ title: "Question coverage", body: tone + (tags.length ? a.K.kv(tags) : ""), level: 2 });
  }

  function blockReason(a, it, draft) {
    if (a.state === "offline") return "You're offline. Nothing has been sent";
    if (a.state === "conflict") {
      var s = a.sel.failureSample(a.view, "attempt-concurrent-submit", a.who);
      return s ? "Attempt " + s.attempt + " is already in" : "This attempt is already in";
    }
    if (a.state === "saving") return "Already sending";
    // SPINE-02: a coverage gap blocks Submit whatever the state token or variant.
    var missing = gaps(it, draft);
    return missing && missing.length ? "Add a page for " + P.questionsText(missing) + " first" : null;
  }

  function stateNotice(a) {
    if (a.state === "offline") return a.K.notice({ tone: "warning", title: "You're offline", body: P.p("Your draft is saved on this device. Nothing has been sent, and nothing is sent in the background.") });
    if (a.state === "saving") return a.K.notice({ tone: "info", title: "Sending. Not received yet", body: P.p("Your work counts as handed in only when a receipt is shown.") });
    if (a.state !== "conflict") return "";
    var s = a.sel.failureSample(a.view, "attempt-concurrent-submit", a.who);
    if (!s) return P.permissionNotice(a);
    return a.K.notice({
      tone: "warning", title: "This attempt was already accepted at " + P.when(a, s.acceptedAt) + " from another session",
      body: P.p("Check the status before doing anything else."), actions: [{ label: "Check submission status", go: "W22~default" }],
    });
  }

  function destination(a) {
    var variant = isMotion(a) ? "group" : null;
    var anchor = a.sel.anchorFor("W22", variant);
    return "W22" + (variant ? ":" + variant : "") + "~" + anchor.home;
  }

  function dialog(a, it, draft) {
    var body = a.K.kv(payload(a, it, draft).concat(groupRows(a, draft))) + P.p("Your work counts as handed in only when a receipt is shown");
    return a.K.dialog(a.ctx, {
      id: P.id(a, "submit"), title: "Submit this attempt", open: a.variant === "confirm", body: body,
      actions: [{ id: P.id(a, "submit-go"), label: "Submit attempt", kind: "primary", go: destination(a) }],
    });
  }

  // SPINE-13: while the submission is sending, Edit work and Cancel review are disabled with the reason.
  function navigation(a, sfx) {
    if (a.state !== "saving") return P.links(a, [{ label: "Edit work", go: "W20" + sfx }, { label: "Cancel review", go: "W19" + sfx }]);
    var reason = "Your submission is still sending";
    return a.K.stack(a.ctx, {
      items: [
        a.K.button({ label: "Edit work", disabled: true, reason: reason, id: P.id(a, "edit-work") }),
        a.K.button({ label: "Cancel review", disabled: true, reason: reason, id: P.id(a, "cancel-review") }),
      ],
      gap: "sm",
    });
  }

  function commit(a, it, draft) {
    var sfx = P.suffix(a);
    var links = navigation(a, sfx);
    if (P.closed(a, it)) return { html: P.stack(a, [P.closedButton(a, it, "submit-btn"), links]), dialog: null };
    var reason = blockReason(a, it, draft);
    var ok = !reason && reviewed(a);
    // SPINE-08: the box only shows the variant; the links below switch between unreviewed and reviewed.
    var box = a.K.field({ id: P.id(a, "reviewed-box"), type: "checkbox", label: "I have reviewed this exact attempt", checked: ok, disabled: true, reason: reason || "Use the link below to change this" });
    if (reason) return { html: P.stack(a, [box, a.K.button({ label: "Submit attempt", disabled: true, reason: reason, id: P.id(a, "submit-btn") }), links]), dialog: null };
    if (!ok) {
      var off = a.K.button({ label: "Submit attempt", disabled: true, reason: "Confirm you have reviewed this exact attempt first", id: P.id(a, "submit-btn") });
      var go = isMotion(a) ? "W21:motion-reviewed" : "W21:reviewed";
      return { html: P.stack(a, [box, off, P.links(a, [{ label: "I have reviewed it", go: go }]), links]), dialog: null };
    }
    var opener = a.K.button({ label: "Submit attempt", kind: "primary", act: "open-dialog", target: P.id(a, "submit") });
    var undo = P.links(a, [{ label: "Not reviewed yet", go: "W21" + sfx }]);
    return { html: P.stack(a, [box, opener, undo, links]), dialog: dialog(a, it, draft) };
  }

  function content(a, it, draft) {
    var head = a.K.kv(payload(a, it, draft).concat(groupRows(a, draft)));
    var c = commit(a, it, draft);
    var main = P.stack(a, [stateNotice(a), head, P.tray(a, draft, false), coverage(a, it, draft)]);
    return { body: a.K.rail(a.ctx, { main: main, rail: a.K.section({ title: "Submit", body: c.html, level: 2 }), railLabel: "Submit" }), dialog: c.dialog };
  }

  function view(a, it) {
    if (a.state === "loading") return { body: P.loading(a, "your attempt"), dialog: null };
    var draft = P.draftOf(a);
    if (!draft) return { body: P.noDraft(a), dialog: null };
    return content(a, it, draft);
  }

  WB.definePage("W21", {
    states: STATES,
    na: P.na(STATES, { firstUseEmpty: "Review always starts from one draft; with no draft the page says so and links back" }),
    variants: {
      motion: WB.manifest.anchors.W21.variants.motion.label, reviewed: "Reviewed: Submit enabled", "motion-reviewed": "Group draft, reviewed",
      confirm: "Submit dialog open",
    },
    render: function (a) {
      var it = a.sel.assessment(a.view, P.assessmentId(a));
      var gate = P.publicationGate(a, it);
      if (gate) return gate;
      var v = view(a, it);
      var out = { title: "Review and submit: " + it.title, body: v.body };
      // SPINE-13: no Add work back link while the submission is sending.
      if (a.state !== "saving") out.back = { label: "Add work", go: "W20" + P.suffix(a) };
      if (v.dialog) out.dialog = v.dialog;
      return P.shell(a, out, { section: "coursework" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
