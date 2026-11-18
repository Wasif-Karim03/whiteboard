/* W08 Activity and notification settings (Phase 3 seg1). Rows come from sel.activityFor and link with the
   fixture go unchanged (PAGES.md record links), so the J09 step opens the canonical thread W31, not W30. No row
   carries a score. A TA after access ends loses grading rows and gets the notice. Settings are preview-only. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "firstUseEmpty", "filteredEmpty", "saveFailed", "offline", "deviceDenied"];
  var KINDS = {
    feedbackReleased: "Feedback available", announcementPublished: "New announcement", announcementUpdated: "Announcement updated",
    discussionReply: "New reply", workReceived: "Work arrived for grading",
  };
  var REMINDERS = ["None", "At start", "10 minutes before", "30 minutes before"];

  function announcementTitle(a, id) {
    var ann = a.view.data.comms.announcements.filter(function (x) { return x.id === id && x.state === "published" && x.course_id === a.who.courseId; })[0];
    return ann ? ann.revisions[ann.revisions.length - 1].title : "";
  }
  // R02, R03: titles resolve only against records this viewer may see now; an unresolved row is not shown.
  function publishedTitle(a, id) { var x = P.assessments(a).filter(function (it) { return it.id === id; })[0]; return x ? x.title : ""; }
  function recordTitle(a, ref) {
    if (ref.type === "assessment") return publishedTitle(a, ref.id);
    if (ref.type === "announcement") return announcementTitle(a, ref.id);
    if (ref.type === "discussion") {
      var t = a.sel.visibleTopics(a.view, a.who.courseId, a.who.personId).filter(function (x) { return x.id === ref.id; })[0];
      return t ? t.title : "";
    }
    if (ref.type === "receipt") { var r = P.receiptById(a, ref.id); return r ? publishedTitle(a, r.assessment_id) : ""; }
    return "";
  }

  function rows(a) {
    var unread = a.sel.unreadAnnouncements(a.view, a.who.courseId, a.who.personId).map(function (u) { return u.id; });
    return a.sel.activityFor(a.view, a.who.personId).filter(function (x) { return !(P.taEnded(a) && x.kind === "workReceived"); }).map(function (x) {
      var title = recordTitle(a, x.ref);
      var isUnread = x.ref.type === "announcement" && unread.indexOf(x.ref.id) >= 0;
      return title ? { title: KINDS[x.kind] + ": " + title, meta: P.when(a, x.at) + (isUnread ? " · Unread" : ""), go: x.go } : null;
    }).filter(Boolean);
  }

  function emptyView(a) {
    return a.K.empty({ title: "No activity yet", body: P.p("Feedback, announcements, replies and work for grading appear here.") });
  }

  function filters(a) {
    var row = a.view.data.world.enrollments.filter(function (e) { return e.person_id === a.who.personId; })[0];
    var courses = (row ? row.course_ids : []).map(function (id) { var c = a.sel.course(a.view, id); return { value: id, label: c.code }; });
    var types = Object.keys(KINDS).map(function (k) { return { value: k, label: KINDS[k] }; });
    return a.K.grid(a.ctx, {
      cols: 3, compactCols: 1,
      items: [
        a.K.field({ id: P.id(a, "course"), type: "select", label: "Course", options: [{ value: "all", label: "All courses" }].concat(courses) }),
        a.K.field({ id: P.id(a, "type"), type: "select", label: "Type", options: [{ value: "all", label: "All types" }].concat(types) }),
        a.K.field({ id: P.id(a, "unread"), type: "checkbox", label: "Unread only" }),
      ],
    });
  }

  function settingsDialog(a) {
    var failed = a.state === "saveFailed";
    return a.K.dialog(a.ctx, {
      id: P.id(a, "settings"), title: "Delivery settings", kind: "form", open: a.variant === "settings" || failed,
      body: P.stack(a, [
        failed ? a.K.notice({ tone: "error", title: "Delivery settings were not saved. Your earlier settings still apply" }) : "",
        a.K.field({ id: P.id(a, "d-email"), type: "checkbox", label: "Email delivery" }),
        a.K.field({ id: P.id(a, "d-browser"), type: "checkbox", label: "Browser delivery" }),
        a.K.field({ id: P.id(a, "d-remind"), type: "select", label: "Class reminder", options: REMINDERS.map(function (r) { return { value: r, label: r }; }) }),
        P.p("In-app activity stays on whatever you choose."),
      ]),
      actions: [{ label: "Save delivery settings", kind: "primary", note: "Preview only: settings are not stored in this prototype", id: P.id(a, "d-save") }],
    });
  }

  function listBlock(a) {
    var list = rows(a);
    if (a.state === "firstUseEmpty" || !list.length) return emptyView(a);
    if (a.state === "filteredEmpty") return a.K.empty({ title: "No activity matches these filters", action: { label: "Clear filters", go: "W08" } });
    return P.stack(a, [a.K.list({ label: "Activity", items: list }), a.state === "loading" ? '<p role="status">Loading older activity…</p>' : ""]);
  }

  function body(a) {
    var offline = a.state === "offline";
    var tools = offline ? "" : P.stack(a, [
      a.K.button({ label: "Delivery settings", act: "open-dialog", target: P.id(a, "settings") }),
      a.K.button({ label: "Mark all as read", kind: "quiet", note: "Preview only: read markers are not changed in this prototype" }),
    ]);
    var denied = a.state === "deviceDenied" ? P.stack(a, [
      a.K.notice({ tone: "warning", title: "Browser notifications are blocked in this browser", body: P.p("Your preference is kept; in-app activity is unaffected.") }),
      a.K.button({ label: "Enable browser delivery", disabled: true, reason: "Allow notifications in your browser settings first", id: P.id(a, "enable") }),
    ]) : "";
    return P.stack(a, [
      P.taEnded(a) ? P.taEndedNotice(a) : "",
      offline ? P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown")]) : "",
      denied, filters(a), tools, listBlock(a),
    ]);
  }

  WB.definePage("W08", {
    states: STATES,
    na: P.na(STATES, {
      invalid: "Settings are choices from fixed lists; nothing is typed",
      saving: "Saving delivery settings is preview-only; the failure is drawn",
      conflict: "Activity and settings belong to one account",
      success: "Settings are preview-only; no save result is drawn",
    }),
    variants: { settings: "Delivery settings dialog open" },
    render: function (a) {
      var out = { title: a.page.title, navActive: "activity", body: body(a) };
      if (a.state !== "offline") out.dialog = settingsDialog(a);
      return out;
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
