/* W39 Files and resources (Phase 3 seg5). No file record exists, so the library is empty (S5-3); uploading is
   preview-only. The attach list names the coursework whose editor is drawn (W40 record links). */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "firstUseEmpty", "saveFailed", "offline", "permissionUnavailable"];
  var PREVIEW = "Preview only: nothing changes in this prototype";

  function attach(a) {
    var rows = P.assessments(a).map(function (it) { return { title: it.title, go: P.recordGo("W40", "assessment", it.id) }; })
      .filter(function (r) { return r.go; });
    return rows.length ? a.K.list({ label: "Attach to coursework", items: rows }) : "";
  }
  function upload(a) {
    if (a.role !== "instructor" || a.tier !== "full") return "";
    if (a.state === "offline") return a.K.button({ label: "Upload files", disabled: true, reason: "You're offline. Nothing is uploaded", id: P.id(a, "upload") });
    return a.K.button({ label: "Upload files", kind: "primary", note: PREVIEW });
  }
  function top(a) {
    if (a.state === "offline") return P.offlineNotice(a);
    if (a.state === "saveFailed") {
      return a.K.notice({ tone: "error", title: "The upload did not finish. Nothing was added to the library",
        actions: a.role === "instructor" && a.tier === "full" ? [{ label: "Retry", note: PREVIEW }] : [] });
    }
    return a.role === "ta" ? P.p("Only published files are shown to teaching assistants") : "";
  }

  function body(a) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "the file library")]);
    return P.stack(a, [
      P.handoff(a, { title: "Open on a larger screen" }), top(a),
      a.K.empty({ title: "No files in this course yet" }), upload(a), attach(a),
    ]);
  }

  WB.definePage("W39", {
    states: STATES,
    na: P.na(STATES, {
      invalid: "No file has been chosen, so no file check has a result to show",
      saving: "No upload is in progress in this prototype",
      conflict: "The library is empty, so no file can be edited by two people",
    }),
    render: function (a) { return P.shell(a, { title: "Files and resources", body: body(a) }, { page: "W39" }); },
  });
})(globalThis);
