/* W38 Learning-content editor (Phase 3 seg5). No lesson record exists, so the page draws a new untitled lesson
   draft in the current module (S5-2). Lesson drafts are the instructor's (S5-6). Saving is preview-only. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "invalid", "saving", "saveFailed", "conflict", "offline", "permissionUnavailable"];
  var PREVIEW = "Preview only: nothing changes in this prototype";
  var SAVE = { saving: "saving", saveFailed: "failed", conflict: "conflict", offline: "savedLocal" };

  function moduleTitle(a) {
    var m = a.sel.currentModule(a.view, a.who.courseId) || a.view.data.coursework.modules.filter(function (x) { return x.course_id === a.who.courseId; })[0];
    return m ? m.title : "";
  }
  function notices(a) {
    if (a.state === "offline") return P.offlineNotice(a);
    if (a.state === "saveFailed") return a.K.notice({ tone: "error", title: "The lesson draft was not saved; your text is still on this page", actions: [{ label: "Retry save", note: PREVIEW }] });
    if (a.state === "conflict") return a.K.notice({ tone: "warning", title: "Another staff member changed this lesson", actions: [{ label: "Compare", note: PREVIEW }, { label: "Reload", note: PREVIEW }] });
    return "";
  }
  function reason(a) {
    if (a.state === "offline") return "You're offline. Nothing has been published";
    if (a.state === "invalid") return "Fix the accessibility issue first";
    return "Add a title and lesson text first";
  }
  function editor(a) {
    return P.stack(a, [
      notices(a), a.K.saveStatus(SAVE[a.state] || "dirty"),
      a.K.field({ id: P.id(a, "title"), label: "Lesson title", required: true }),
      a.K.field({ id: P.id(a, "text"), label: "Lesson text", type: "textarea", required: true }),
      a.K.field({ id: P.id(a, "decorative"), label: "This image is decorative", type: "checkbox" }),
      a.K.field({ id: P.id(a, "alt"), label: "Text alternative", error: a.state === "invalid" ? "Describe the image or mark it decorative" : undefined }),
      a.K.button({ label: "Publish lesson", kind: "primary", disabled: true, reason: reason(a), id: P.id(a, "publish") }),
    ]);
  }

  function body(a) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.role === "ta") return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a, "Lesson drafts are open to the instructor only")]);
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "the lesson draft")]);
    var where = a.K.kv([{ label: "Module", value: moduleTitle(a) || "No module yet" }, { label: "Lesson", value: "New untitled draft" }]);
    var files = P.links(a, [{ label: "Insert from Files", go: "W39" }]);
    if (a.tier !== "full") {
      return P.stack(a, [P.handoff(a, { title: "Open on a larger screen" }), where, P.p("No accessibility issues are recorded for a new draft"), files]);
    }
    return P.stack(a, [where, editor(a), files]);
  }

  WB.definePage("W38", {
    states: STATES,
    na: P.na(STATES, { firstUseEmpty: "The editor always opens a new untitled draft, so there is no empty view" }),
    render: function (a) { return P.shell(a, { title: "Lesson editor", body: body(a), back: { label: "Module", go: "W37" } }, { page: "W35" }); },
  });
})(globalThis);
