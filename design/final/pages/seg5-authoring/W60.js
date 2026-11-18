/* W60 Content import/export preview (Phase 3 seg5). Instructor only (TA: no access by default); iPad and iPhone are
   the handoff tier. No package or log record exists, so choosing and exporting are preview-only. The invalid
   state reads the import-unsupported-type failure sample; with no sample it names no file or size. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "invalid", "saveFailed", "permissionUnavailable"];
  var PREVIEW = "Preview only: nothing changes in this prototype";

  function failure(a) {
    if (a.state === "invalid") {
      var s = a.sel.failureSample(a.view, "import-unsupported-type", a.who);
      var what = s && s.file ? P.p(s.file.name + " · " + a.sel.fmtBytes(s.file.bytes)) : P.p("Choose a Whiteboard course package.");
      return P.stack(a, [
        a.K.notice({ tone: "error", title: "This file type cannot be imported", body: what }),
        a.K.button({ label: "Start import", kind: "primary", disabled: true, reason: "Choose a supported package first", id: P.id(a, "start") }),
      ]);
    }
    if (a.state === "saveFailed") return a.K.notice({ tone: "error", title: "The import stopped. Nothing was added to the course", actions: [{ label: "Retry", note: PREVIEW }] });
    return "";
  }

  function full(a) {
    return P.stack(a, [
      a.K.segmented({ label: "Direction", name: P.id(a, "dir"), options: [{ value: "import", label: "Import", selected: true }, { value: "export", label: "Export" }] }),
      P.p("Only course content moves: no people, submissions, marks or keys"), failure(a),
      a.K.empty({ title: "No import or export has run" }),
      a.K.button({ label: "Choose package", kind: "primary", note: PREVIEW }), a.K.button({ label: "Export course content", note: PREVIEW }),
      P.links(a, [{ label: "Builder", go: "W35" }]),
    ]);
  }

  function body(a) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.role === "ta") return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a)]);
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "content transfer")]);
    if (a.tier !== "full") return a.K.handoff(a.ctx, { title: "Open on a larger screen", note: "No import or export has run in this course" });
    return full(a);
  }

  WB.definePage("W60", {
    states: STATES,
    na: P.na(STATES, {
      firstUseEmpty: "The page always opens on an empty transfer, drawn in its default view",
      saving: "No transfer is in progress in this prototype",
      conflict: "No transfer is in progress for two people to change",
      offline: "Transfers run on the server; this preview stores nothing on the device",
    }),
    render: function (a) { return P.shell(a, { title: "Content import and export", body: body(a) }, { page: "W60" }); },
  });
})(globalThis);
