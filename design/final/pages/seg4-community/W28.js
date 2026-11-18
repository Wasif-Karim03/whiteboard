/* W28 Announcement list (Phase 3 seg4). Course-level. Published and withdrawn announcements only, pinned first then
   newest; the read state is the student's own (unreadAnnouncements). Every row links its record-true detail or is
   plain text. Rules: pages/seg4-community/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "firstUseEmpty", "filteredEmpty", "offline", "permissionUnavailable"];
  var SHOWN = ["published", "withdrawn"];
  var COLS = [
    { key: "title", label: "Announcement", primary: true }, { key: "author", label: "Posted by" },
    { key: "at", label: "Published" }, { key: "state", label: "State" },
  ];

  function anns(a) {
    return a.view.data.comms.announcements.filter(function (x) { return x.course_id === a.who.courseId && SHOWN.indexOf(x.state) >= 0; });
  }
  function latest(x) { return x.revisions[x.revisions.length - 1]; }
  function ordered(a) {
    var pinned = anns(a).filter(function (x) { return x.pinned; });
    var rest = anns(a).filter(function (x) { return !x.pinned; });
    var newest = function (x, y) { return a.sel.isBefore(x.published_at, y.published_at) ? 1 : -1; };
    return pinned.sort(newest).concat(rest.sort(newest));
  }

  function readState(a, x) {
    if (x.state === "withdrawn") return esc("Withdrawn");
    if (a.role !== "student") return x.revisions.length > 1 ? a.K.badge({ label: "Updated", tone: "info" }) : "";
    var hit = a.sel.unreadAnnouncements(a.view, a.who.courseId, a.who.personId).filter(function (u) { return u.id === x.id; })[0];
    if (!hit) return esc("Read");
    return a.K.badge({ label: hit.reason === "new" ? "New" : "Updated", tone: "accent" });
  }

  function row(a, x) {
    var l = latest(x);
    var at = P.when(a, x.published_at) + (x.revisions.length > 1 ? " · Updated " + P.when(a, l.at) : "");
    var marks = [
      x.pinned ? a.K.badge({ label: "Pinned", tone: "neutral" }) : "", readState(a, x),
      x.attachments.length && x.state !== "withdrawn" ? a.K.badge({ label: "Attachment", tone: "neutral" }) : "",
    ].filter(Boolean).join(" ");
    var cells = { title: esc(l.title), author: esc(P.personName(a, x.author_id)), at: esc(at), state: marks };
    var go = P.recordGo("W29", "announcement", x.id);
    return go ? { id: x.id, cells: cells, go: go } : { id: x.id, cells: cells };
  }

  function emptyFor(a) {
    if (a.state === "filteredEmpty") return { title: "No announcements match", body: P.p("Other announcements are still in the list."), action: { label: "Clear filters", note: "Preview only: filters are not wired" } };
    return { title: "No announcements yet", body: P.p("Announcements from your instructor appear here."), action: { label: "Course overview", go: "W14" } };
  }

  function table(a) {
    var rows = a.state === "firstUseEmpty" || a.state === "filteredEmpty" ? [] : ordered(a).map(function (x) { return row(a, x); });
    return a.K.table(a.ctx, { id: P.id(a, "anns"), caption: "Announcements", columns: COLS, rows: rows, empty: emptyFor(a) });
  }

  function markAll(a) {
    if (a.role !== "student") return "";
    if (a.state === "offline") return a.K.button({ label: "Mark all as read", disabled: true, reason: "You're offline", id: P.id(a, "read-all") });
    return a.K.button({ label: "Mark all as read", note: "Preview only: nothing is marked as read in this prototype" });
  }

  function links(a) {
    var list = [{ label: "Notification settings", go: "W08" }];
    if (a.role === "instructor") list.push({ label: "Manage announcements", go: "W55" });
    return P.stack(a, [markAll(a), P.links(a, list), a.role === "ta" ? P.p("Publishing announcements is the instructor's step") : ""]);
  }

  function body(a) {
    if (a.state === "permissionUnavailable") return P.permissionNotice(a, "Announcements are not available for your course role");
    if (a.state === "loading") return P.loading(a, "announcements");
    var top = [P.taEnded(a) ? P.taEndedNotice(a) : "", a.state === "offline" ? P.offlineNotice(a) + a.K.flag("lastKnown") : ""];
    return P.stack(a, top.concat([table(a), links(a)]));
  }

  WB.definePage("W28", {
    states: STATES,
    na: P.na(STATES, {
      saving: "Read markers are preview only; nothing is saved from this list",
      saveFailed: "Read markers are preview only; nothing is saved from this list",
    }),
    render: function (a) {
      return P.shell(a, { title: "Announcements", body: body(a) }, { page: "W28" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
