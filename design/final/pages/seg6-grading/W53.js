/* W53 Exact feedback release (Phase 3 spine). Anchor: the problem-set assessment. Instructor only for release: the scope is the
   fixed list of releaseReady included rows (R02), the exact preview comes from releasePreview, and Release opens
   only after the preview is acknowledged (R14). A stale preview or being offline always blocks it. iPad is review
   only; iPhone is a handoff with "Keep everything held". A TA sees only their own review progress. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["conflict", "loading", "offline", "success", "permissionUnavailable"];
  var ACKED = ["acknowledged", "confirm"];
  var REASONS = { notReady: "Review not complete" };
  var STEP = "Releasing feedback is the instructor's step";

  function itemId(a) { return P.assessmentId(a); }
  function has(o, k) { return Boolean(o) && Object.prototype.hasOwnProperty.call(o, k); }

  function rowsOf(a) {
    var ready = a.sel.releaseReady(a.view, itemId(a), a.who) || [];
    return {
      included: ready.filter(function (r) { return r.included; }),
      held: ready.filter(function (r) { return !r.included; }),
    };
  }

  function preview(a, r) { return a.sel.releasePreview(a.view, a.who.courseId, r.personId, itemId(a), a.who); }
  function fingerprints(a, rows) { return rows.included.map(function (r) { return preview(a, r).fingerprint; }); }

  function trail(a) {
    var current = ACKED.indexOf(a.variant) >= 0 ? 3 : 2;
    var labels = ["Scope", "Exceptions", "Exact preview", "Confirm"];
    return a.K.trail({ label: "Release steps", steps: labels.map(function (l, i) { return { label: l, state: i < current ? "done" : i === current ? "current" : "todo" }; }) });
  }

  function scope(a, rows) {
    if (!rows.included.length) return a.K.empty({ title: "Nothing ready", body: P.p("No reviewed result is waiting to be released.") });
    var items = rows.included.map(function (r) { return { title: P.personName(a, r.personId), meta: r.revised ? "Correction to an earlier release" : "Reviewed" }; });
    return a.K.section({ title: "Release scope", body: P.p("Release scope is fixed in this prototype: every reviewed result listed here") + a.K.list({ label: "Results to release", items: items }), level: 2 });
  }

  function heldBack(a, rows) {
    if (!rows.held.length) return "";
    var receipts = a.sel.receiptsFor(a.view, itemId(a), a.who);
    var items = rows.held.map(function (r) {
      var rec = receipts.filter(function (x) { return x.owner_id === r.personId; })[0];
      var go = rec ? P.recordGo("W49", "receipt", rec.id) : null;
      var item = { title: P.personName(a, r.personId), meta: Object.prototype.hasOwnProperty.call(REASONS, r.reason) ? REASONS[r.reason] : "Not ready" };
      return go ? { title: item.title, meta: item.meta, go: go } : item;
    });
    return a.K.section({ title: "Held back", body: a.K.list({ label: "Held back from this release", items: items }), level: 2 });
  }

  // SPINE-01: per-question marks and comments from the fingerprint-bound payload, labelled by the rubric.
  function questionRows(a, p) {
    var draft = p && p.inputs ? p.inputs.draft : null;
    var rubric = a.sel.rubricFor(a.view, itemId(a), a.who);
    if (!draft || !rubric) return [];
    return rubric.criteria.map(function (c) {
      var q = c.question_id;
      var mark = has(draft.marks, q) ? P.score(draft.marks[q], c.max) : "Not marked";
      var note = has(draft.comments, q) ? draft.comments[q] : "";
      return { q: q, label: "Question " + q + ": " + c.title, mark: mark, note: note };
    });
  }

  function questionList(a, p) {
    var rows = questionRows(a, p);
    if (!rows.length) return "";
    var kv = rows.map(function (x) { return { label: x.label, value: x.note ? x.mark + " · " + x.note : x.mark }; });
    return a.K.section({ title: "Marks and comments to release", body: a.K.kv(kv), level: 4 });
  }

  function previewBlock(a, r) {
    var p = preview(a, r);
    var d = a.sel.gradeDraftFor(a.view, r.personId, itemId(a), a.who);
    var rows = [
      { label: "Learner", value: P.personName(a, r.personId) }, { label: "Receipt", value: p.inputs.receipt.id },
      { label: "Rubric version", value: String(p.inputs.rubricVersion) }, { label: "Policy version", value: String(p.inputs.policy.version) },
    ];
    if (d && d.total) rows.push({ label: "Score", value: P.score(d.total.score, d.total.max) });
    if (d && d.overall_comment) rows.push({ label: "Comment", value: d.overall_comment });
    rows.push({ label: "Fingerprint", value: p.fingerprint });
    var figs = a.K.grid(a.ctx, { cols: 2, compactCols: 1, items: [
      a.K.figure({ label: "Course total before", value: p.before || "No released results", basis: "Released results only" }),
      a.K.figure({ label: "Course total after release", value: p.after || "No calculable grade", basis: "Released results plus this release" }),
    ] });
    return a.K.section({ title: "Exact preview: " + P.personName(a, r.personId), body: a.K.kv(rows) + questionList(a, p) + figs, level: 3 });
  }

  function history(a) {
    var list = (a.sel.releasesFor(a.view, itemId(a), a.who) || []).slice().reverse();
    if (!list.length) return a.K.section({ title: "Release history", body: P.p("No release yet"), level: 2 });
    var items = list.map(function (rel, i) {
      var names = rel.entries.map(function (e) { return P.personName(a, e.person_id); }).join(", ");
      var meta = [P.when(a, rel.released_at), P.personName(a, rel.actor_id), names, i === 0 ? "" : "Earlier version, still on record"].filter(Boolean).join(" · ");
      var item = { title: "Version " + rel.version, meta: meta };
      return i === 0 ? { title: item.title, meta: meta, go: a.selection ? WB.Teaching.go(a, "W23", { assessmentId: itemId(a), learnerId: rel.entries[0].person_id, receiptId: null }) : "W23" } : item;
    });
    return a.K.section({ title: "Release history", body: a.K.list({ label: "Releases, newest first", items: items }), level: 2 });
  }

  function staleNotice(a) {
    var s = a.sel.failureSample(a.view, "release-preview-stale", a.who);
    if (!s || s.assessment_id !== itemId(a)) return a.K.notice({ tone: "error", title: "The preview is out of date", body: P.p("Refresh the exact preview before releasing. No changed-result example is recorded for this assessment.") });
    var changed = s.changed.map(function (c) { return P.personName(a, c.person_id) + ", question " + c.question_id; }).join("; ");
    var body = P.p("Changed: " + changed + ". Changed at " + P.when(a, s.changedAt) + ", after the preview at " + P.when(a, s.previewedAt) + ".") +
      P.p("Preview revision " + s.preview_revision + ", current revision " + s.current_revision + ".");
    return a.K.notice({ tone: "error", title: "The preview is out of date", body: body, actions: [{ label: "Refresh preview", note: "Preview only: nothing is recalculated in this prototype" }] });
  }

  function blockReason(a, rows) {
    if (!rows.included.length) return "Nothing is ready to release";
    if (a.selection && ["ps4", "math-assignment"].indexOf(itemId(a)) < 0) return "No release outcome is modeled for this assessment";
    if (a.state === "conflict") return "The preview is out of date. Refresh it first";
    if (a.state === "offline") return "You're offline. Nothing can be released";
    return null;
  }

  // SPINE-01: the confirm dialog names what is released per learner: total, per-question marks, comment count.
  function dialogSummary(a, r) {
    var d = a.sel.gradeDraftFor(a.view, r.personId, itemId(a), a.who);
    var qs = questionRows(a, preview(a, r));
    var marks = qs.map(function (x) { return "Question " + x.q + ": " + x.mark; }).join("; ");
    var notes = qs.filter(function (x) { return x.note; }).length;
    var comments = notes ? notes + (notes === 1 ? " question comment" : " question comments") : "";
    var parts = [d && d.total ? P.score(d.total.score, d.total.max) : "", marks, comments, d && d.overall_comment ? "overall comment" : ""];
    return { label: P.personName(a, r.personId), value: parts.filter(Boolean).join(" · ") || "Reviewed" };
  }

  function dialog(a, rows) {
    var names = rows.included.map(function (r) { return P.personName(a, r.personId); });
    var held = rows.held.map(function (r) { return P.personName(a, r.personId); });
    var summary = rows.included.map(function (r) { return dialogSummary(a, r); });
    var rowsKv = [{ label: "Recipients", value: names.length + ": " + names.join(", ") }].concat(held.length ? [{ label: "Held back", value: held.join(", ") }] : [])
      .concat(summary).concat([{ label: "Fingerprint", value: fingerprints(a, rows).join(", ") }]);
    return a.K.dialog(a.ctx, {
      id: P.id(a, "release"), title: "Release this exact snapshot", open: a.variant === "confirm", cancelLabel: "Return without applying changes",
      body: a.K.kv(rowsKv) + P.p("Graded is not released. Delivery is separate"),
      actions: [{ id: P.id(a, "release-go"), label: "Release reviewed snapshot", kind: "primary", go: a.selection ? WB.Teaching.go(a, "W53~" + (itemId(a) === "math-assignment" ? "math_released" : "ps4_released"), { learnerId: null, receiptId: null }) : "W53~ps4_released" }],
    });
  }

  function control(a, rows) {
    var reason = blockReason(a, rows);
    var ack = !reason && ACKED.indexOf(a.variant) >= 0;
    var box = rows.included.length ? a.K.field({
      // SPINE-08: the box only shows the variant; the links below switch between unacknowledged and acknowledged.
      id: P.id(a, "ack"), type: "checkbox", checked: ack, disabled: true, reason: reason || "Use the link below to change this",
      label: "I have checked this exact preview (fingerprint " + fingerprints(a, rows).join(", ") + ")",
    }) : "";
    if (reason) return { html: P.stack(a, [box, a.K.button({ label: "Release reviewed results", disabled: true, reason: reason, id: P.id(a, "release-btn") })]), dialog: null };
    if (!ack) {
      var off = a.K.button({ label: "Release reviewed results", disabled: true, reason: "Acknowledge the exact preview first", id: P.id(a, "release-btn") });
      return { html: P.stack(a, [box, off, P.links(a, [{ label: "I have checked it", go: "W53:acknowledged" }])]), dialog: null };
    }
    var opener = a.K.button({ label: "Release reviewed results", kind: "primary", act: "open-dialog", target: P.id(a, "release") });
    var undo = P.links(a, [{ label: "Not checked yet", go: "W53" }]);
    return { html: P.stack(a, [box, opener, undo]), dialog: dialog(a, rows) };
  }

  function successNotice(a) {
    if (a.state !== "success") return "";
    var latest = (a.sel.releasesFor(a.view, itemId(a), a.who) || []).slice(-1)[0];
    if (!latest) return "";
    var names = latest.entries.map(function (e) { return P.personName(a, e.person_id); }).join(", ");
    return a.K.notice({ tone: "success", title: "Version " + latest.version + " released", body: P.p("Released to " + names + " at " + P.when(a, latest.released_at) + ".") });
  }

  function topNotices(a) {
    if (a.state === "conflict") return staleNotice(a);
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown")]);
    return successNotice(a);
  }

  function instructorWeb(a, rows) {
    var c = control(a, rows);
    var previews = rows.included.map(function (r) { return previewBlock(a, r); });
    var main = P.stack(a, [topNotices(a), trail(a), scope(a, rows), heldBack(a, rows)].concat(previews).concat([history(a)]));
    return { body: a.K.rail(a.ctx, { main: main, rail: a.K.section({ title: "Release", body: c.html, level: 2 }), railLabel: "Release" }), dialog: c.dialog };
  }

  function instructorIpad(a, rows) {
    var off = a.K.button({ label: "Release reviewed results", disabled: true, reason: "Release from the web app", id: P.id(a, "release-btn") });
    var previews = rows.included.map(function (r) { return previewBlock(a, r); });
    return { body: P.stack(a, [topNotices(a), scope(a, rows), heldBack(a, rows)].concat(previews).concat([history(a), off])), dialog: null };
  }

  function keepHandoff(a) {
    var keep = [{ label: "Keep everything held", note: "Preview only: nothing changes in this prototype" }];
    return P.handoff(a, { title: "Open on a larger screen", protectiveActions: keep });
  }

  function instructorPhone(a, rows) {
    return { body: P.stack(a, [keepHandoff(a), topNotices(a), scope(a, rows), heldBack(a, rows), history(a)]), dialog: null };
  }

  function taView(a) {
    var rp = a.sel.reviewProgress(a.view, itemId(a), a.who);
    var text = rp ? P.p("You have reviewed " + rp.reviewed + " of " + rp.of) : "";
    return { body: P.stack(a, [P.bareHandoff(a), text, P.p(STEP), P.links(a, [{ label: "Grading queue", go: "W48" }])]), dialog: null };
  }

  function view(a) {
    // T5: an active TA with this task sees only their progress, whatever the token.
    if (a.role === "ta" && !P.taEnded(a) && !P.taTaskEnded(a, itemId(a)) && !P.taUnallocated(a, itemId(a))) return taView(a);
    var gate = P.staffGate(a, itemId(a));
    if (gate) return { body: gate, dialog: null };
    if (a.state === "loading") return { body: P.stack(a, [keepHandoff(a), P.loading(a, "the release preview")]), dialog: null };
    if (!a.sel.canRelease(a.view, a.who, a.who.courseId)) return { body: P.stack(a, [P.bareHandoff(a), P.permissionNotice(a)]), dialog: null };
    var rows = rowsOf(a);
    if (a.platform === "web") return instructorWeb(a, rows);
    return a.platform === "ipad" ? instructorIpad(a, rows) : instructorPhone(a, rows);
  }

  WB.definePage("W53", {
    states: STATES,
    na: P.na(STATES, { firstUseEmpty: "With nothing reviewed the release scope says Nothing ready; there is no separate first-use view" }),
    variants: { acknowledged: "Preview acknowledged: Release enabled", confirm: "Release dialog open" },
    render: function (a) {
      var it = a.sel.assessment(a.view, itemId(a));
      var v = view(a);
      var out = { title: "Release feedback: " + it.title, body: v.body };
      if (v.dialog) out.dialog = v.dialog;
      return P.shell(a, out, { page: "W53" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
