/* W20 Add work (Phase 3 spine). Student only. Anchor: the persona's problem-set draft (manifest/anchors.js),
   variant motion (the group draft). The file tray, page tags and save status come from the draft; failure states come
   from WB.sel.failureSample. Nothing is sent from this page. File picking is preview-only (kit request 1). */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "invalid", "saving", "saveFailed", "offline", "deviceDenied"];

  function sample(a, id) { return a.sel.failureSample(a.view, id, a.who); }

  function tags(a, draft) {
    var rows = P.tagRows(draft.page_tags);
    return a.K.section({ title: "Pages and questions", body: rows.length ? a.K.kv(rows) : P.p("No pages tagged yet"), level: 2 });
  }

  function pickers(a, cameraDenied) {
    var choose = a.K.button({ label: "Choose files", note: "Preview only: no file picker in this prototype" });
    var photo = cameraDenied ? "" : a.K.button({ label: "Take photo", note: "Preview only: the camera is not used in this prototype" });
    return a.K.stack(a.ctx, { items: [choose, photo].filter(Boolean), gap: "sm" });
  }

  // The way on to W21, or a disabled control saying why not (closed first, then the state).
  function onward(a, it, blockReason) {
    var sfx = P.suffix(a);
    var back = { label: "Back to assignment", go: "W19" + sfx };
    if (P.closed(a, it)) return P.stack(a, [P.closedButton(a, it, "review"), P.links(a, [back])]);
    if (blockReason) {
      var off = a.K.button({ label: "Review and submit", disabled: true, reason: blockReason, id: P.id(a, "review") });
      return P.stack(a, [off, P.links(a, [back])]);
    }
    return a.K.section({ title: "Next", body: P.p("Nothing is handed in until you submit on the next page."), actions: [{ label: "Review and submit", go: "W21" + sfx, kind: "primary" }, back] });
  }

  function invalidNotice(a) {
    var s = sample(a, "unsupported-file");
    if (!s) return { html: P.permissionNotice(a), block: null };
    var body = P.p(s.file.name + " is a " + s.file.kind + " file. " + P.fileRuleText(s.rule)) + P.p("Your other files are kept.");
    return { html: a.K.notice({ tone: "error", title: "This file type cannot be handed in", body: body }), block: "Remove the unsupported file first" };
  }

  function saveFailed(a) {
    var s = sample(a, "upload-interrupted");
    if (!s) return { html: P.permissionNotice(a), block: null };
    var label = s.file.name + ": " + a.sel.fmtBytes(s.sent_bytes) + " of " + a.sel.fmtBytes(s.file.bytes) + " sent";
    var retry = a.K.button({ label: "Retry upload", note: "Preview only: nothing is uploaded in this prototype" });
    var body = a.K.progress({ label: label, value: s.sent_bytes, max: s.file.bytes }) + P.p("Your draft is kept. Nothing was handed in.") + retry;
    return { html: a.K.saveStatus("failed") + a.K.notice({ tone: "error", title: "The upload stopped", body: body }), block: "Finish or retry the upload first" };
  }

  function offline(a) {
    var s = sample(a, "offline-draft");
    if (!s) return { html: P.permissionNotice(a), block: null };
    var files = s.pending_files + (s.pending_files === 1 ? " file waits" : " files wait") + " on this device.";
    var body = P.p("Saved on this device. Not synced, not handed in.") + P.p(files);
    return { html: a.K.saveStatus("savedLocal", { time: a.sel.fmtTime(s.queuedAt) }) + a.K.notice({ tone: "warning", title: "You're offline", body: body }), block: "Reconnect to review and submit" };
  }

  function stateTop(a, draft) {
    if (a.state === "invalid") return invalidNotice(a);
    if (a.state === "saveFailed") return saveFailed(a);
    if (a.state === "offline") return offline(a);
    if (a.state === "saving") return { html: a.K.saveStatus("saving") + P.p("Saving to your draft. The newest change is still on this device."), block: "Wait for the save to finish" };
    var saved = a.K.saveStatus("saved", { time: a.sel.fmtTime(draft.saved_at) });
    if (a.state === "deviceDenied") {
      var body = P.p("Camera access is off for this browser. You can still choose files.");
      return { html: saved + a.K.notice({ tone: "info", title: "Camera is not available", body: body }), block: null };
    }
    return { html: saved, block: null };
  }

  function content(a, it, draft) {
    var top = stateTop(a, draft);
    var tagged = [];
    (draft.page_tags || []).forEach(function (t) { tagged = tagged.concat(t.questions); });
    var missing = (it.questions || []).map(function (q) { return q.id; }).filter(function (id) { return tagged.indexOf(id) < 0; });
    var details = tags(a, draft);
    if (a.state !== "invalid" && !missing.length) details = a.K.disclosure({ id: P.id(a, "tag-details"), summary: "Pages and question tags", body: details });
    var gap = missing.length ? a.K.notice({ tone: "warning", title: "Some questions have no page", body: P.p(P.questionsText(missing) + " have no page yet.") }) : "";
    return P.stack(a, [top.html, gap, P.tray(a, draft, true), onward(a, it, top.block), pickers(a, a.state === "deviceDenied"), details]);
  }

  function body(a, it) {
    if (a.state === "loading") return P.loading(a, "your draft");
    var draft = P.draftOf(a);
    if (!draft) return P.noDraft(a);
    return content(a, it, draft);
  }

  WB.definePage("W20", {
    states: STATES,
    na: P.na(STATES, {
      firstUseEmpty: "A new draft starts from the assignment page; this page always opens on one draft",
      conflict: "Draft edits from two devices are drawn on the review page, where the attempt is sent",
    }),
    variants: { motion: WB.manifest.anchors.W20.variants.motion.label },
    render: function (a) {
      var it = a.sel.assessment(a.view, P.assessmentId(a));
      var gate = P.publicationGate(a, it);
      if (gate) return gate;
      return P.shell(a, { title: "Add work: " + it.title, body: body(a, it), back: { label: "Assignment", go: "W19" + P.suffix(a) } }, { section: "coursework" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
