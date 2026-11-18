/* W22 Receipt (Phase 3 spine). Student only. Anchor: the persona's problem-set receipt; variant group (the group
   receipt at its own home clock). The receipt is read through receiptsFor at the current clock; when it is not
   there yet the page says so and shows no reference (rule R-truth). Contract: pages/SPINE.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "offline", "success", "permissionUnavailable"];

  function isGroup(a) { return a.variant === "group"; }
  function itemId(a) { return a.selection && a.selection.assessmentId ? a.selection.assessmentId : a.sel.anchorFor("W19", isGroup(a) ? "motion" : null).record.id; }

  function receipt(a) {
    if (a.selection && !a.selection.receiptId) return P.receiptOf(a);
    var anchor = a.sel.anchorFor("W22", isGroup(a) ? "group" : null);
    var id = a.selection && a.selection.receiptId ? a.selection.receiptId : anchor.record.id;
    return a.sel.receiptsFor(a.view, itemId(a), a.who).filter(function (r) { return r.id === id; })[0] || null;
  }

  function slip(a, it, r) {
    var course = a.sel.course(a.view, a.who.courseId);
    return a.K.receipt({
      ref: r.id, item: it.title, course: course.code, acceptedAt: a.sel.fmtDateTime(r.accepted_at), timeZone: a.sel.zoneAbbr(r.accepted_at),
      attempt: r.attempt, files: r.files.map(function (f) { return f.name; }), late: Boolean(r.late),
    });
  }

  function extras(a, r) {
    var rows = r.files.map(function (f) { return { label: f.name, value: P.fileMeta(a, f) }; });
    rows = rows.concat(P.tagRows(r.page_tags));
    if (r.assessment_version !== undefined) rows.push({ label: "Assignment version", value: String(r.assessment_version) });
    var actor = P.personName(a, r.actor_id);
    if (actor) rows.push({ label: "Handed in by", value: actor });
    if (r.captured_members) {
      rows.push({ label: "Handed in for", value: r.captured_members.map(function (m) { return P.personName(a, m); }).filter(Boolean).join(", ") });
      rows.push({ label: "Group membership version", value: String(r.membership_version) });
    }
    return a.K.kv(rows);
  }

  function links(a, it, receipt) {
    var res = isGroup(a) ? null : a.sel.resultFor(a.view, a.who.personId, it.id, a.who);
    var released = (a.sel.releasesFor(a.view, it.id, a.who) || []).slice().reverse().reduce(function (found, rel) {
      return found || rel.entries.filter(function (entry) { return entry.person_id === a.who.personId; })[0] || null;
    }, null);
    var sub = a.sel.submissionFor(a.view, a.who.personId, it.id);
    var matches = released && (released.receipt_id ? released.receipt_id === receipt.id : sub && sub.receipt_id === receipt.id);
    var out = res && res.status !== null && matches ? { label: "View feedback", go: a.selection ? WB.Teaching.go(a, "W23", { assessmentId: it.id, receiptId: receipt.id }) : "W23" } : null;
    return P.links(a, [{ label: "Back to the assignment", go: P.recordGo("W19", "assessment", it.id) || WB.Teaching.go(a, "W19", { assessmentId: it.id, receiptId: null }) }, out, { label: "Coursework", go: "W18" }]);
  }

  function present(a, it, r) {
    var top = a.state === "success"
      ? a.K.notice({ tone: "success", title: "Handed in", body: P.p("Receipt " + r.id + " was issued at " + P.when(a, r.accepted_at) + ".") })
      : a.state === "offline" ? P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown")]) : "";
    var main = P.stack(a, [top, slip(a, it, r), P.p("This receipt does not change")]);
    var rail = P.stack(a, [P.status(a, P.ownSubmission(a, it.id), true), extras(a, r), links(a, it, r)]);
    return a.K.rail(a.ctx, { main: main, rail: rail, railLabel: "Details" });
  }

  function absent(a, it) {
    var empty = a.K.empty({ title: "No confirmed receipt", body: P.p("Nothing has been handed in for this attempt yet.") });
    return P.stack(a, [empty, P.status(a, P.ownSubmission(a, it.id), true), P.offHome(a, "The receipt is issued later in the prototype")]);
  }

  function body(a, it) {
    if (a.state === "permissionUnavailable") return P.permissionNotice(a, "This receipt belongs to another person");
    if (a.state === "loading") return P.loading(a, "the receipt");
    var r = receipt(a);
    return r ? present(a, it, r) : absent(a, it);
  }

  WB.definePage("W22", {
    states: STATES,
    na: P.na(STATES, { firstUseEmpty: "A receipt page is about one receipt; without it the page says no receipt exists" }),
    variants: { group: WB.manifest.anchors.W22.variants.group.label },
    render: function (a) {
      var it = a.sel.assessment(a.view, itemId(a));
      var gate = P.publicationGate(a, it, receipt(a));
      if (gate) return gate;
      return P.shell(a, { title: "Receipt: " + it.title, body: body(a, it) }, { section: "coursework" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
