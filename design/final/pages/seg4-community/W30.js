/* W30 Discussion list (Phase 3 seg4). Course-level. Topics come from visibleTopics, so a group topic reaches only its
   members. Reply counts, authors and last activity are selector values; only the anchored topic links to W31.
   Rules: pages/seg4-community/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "firstUseEmpty", "filteredEmpty", "offline", "permissionUnavailable"];
  var COLS = [
    { key: "topic", label: "Topic", primary: true }, { key: "by", label: "Started by" }, { key: "replies", label: "Replies", numeric: true },
    { key: "last", label: "Last activity" }, { key: "state", label: "State" },
  ];

  function topics(a) { return a.sel.visibleTopics(a.view, a.who.courseId, a.who.personId); }
  function groupName(a, t) {
    var hit = "";
    a.view.data.groups.group_sets.forEach(function (s) { s.groups.forEach(function (g) { if (g.id === t.group_id) hit = g.name; }); });
    return hit;
  }

  function row(a, t) {
    var last = a.sel.lastActivity(a.view, t.id);
    var state = (t.replies_closed ? a.K.flag("closed") : esc("Open")) +
      (t.audience === "group" ? " " + a.K.badge({ label: "Group only: " + groupName(a, t), tone: "neutral" }) : "");
    var cells = {
      topic: esc(t.title), by: esc(P.personName(a, a.sel.topicAuthor(a.view, t.id))), replies: esc(String(a.sel.replyCount(a.view, t.id))),
      last: last ? esc(P.when(a, last)) : "", state: state,
    };
    var go = P.recordGo("W31", "discussion", t.id);
    return go ? { id: t.id, cells: cells, go: go } : { id: t.id, cells: cells };
  }

  function emptyFor(a) {
    if (a.state === "filteredEmpty") return { title: "No topics match", body: P.p("Other topics are still in the list."), action: { label: "Clear filters", note: "Preview only: filters are not wired" } };
    return { title: "No discussions yet", body: P.p("Topics started in this course appear here.") };
  }

  function table(a) {
    var rows = a.state === "firstUseEmpty" || a.state === "filteredEmpty" ? [] : topics(a).map(function (t) { return row(a, t); });
    return a.K.table(a.ctx, { id: P.id(a, "topics"), caption: "Discussions", columns: COLS, rows: rows, empty: emptyFor(a) });
  }

  function rules(a) {
    var text = P.p("Posts are visible to everyone in the topic's audience: the whole course, or one group for a group topic.") +
      P.p("This is not private messaging. Ask about your own grades through the help page.");
    return a.K.disclosure({ id: P.id(a, "rules"), summary: "Posting rules", body: text });
  }

  function start(a) {
    if (P.taEnded(a)) return "";
    if (a.state === "offline") return a.K.button({ label: "Start a topic", disabled: true, reason: "You're offline", id: P.id(a, "start") });
    return a.K.button({ label: "Start a topic", note: "Preview only: no topic is started in this prototype" });
  }

  function body(a) {
    if (a.state === "permissionUnavailable") return P.permissionNotice(a, "Discussions are not available for your course role");
    if (a.state === "loading") return P.loading(a, "discussions");
    var top = [P.taEnded(a) ? P.taEndedNotice(a) : "", a.state === "offline" ? P.offlineNotice(a) + a.K.flag("lastKnown") : ""];
    var manage = a.role === "instructor" ? P.links(a, [{ label: "Manage discussions", go: "W56" }]) : "";
    return P.stack(a, top.concat([start(a), table(a), rules(a), manage]));
  }

  var PREVIEW = "Starting a topic is preview only in this prototype";
  WB.definePage("W30", {
    states: STATES,
    na: P.na(STATES, { invalid: PREVIEW, saving: PREVIEW, saveFailed: PREVIEW }),
    render: function (a) {
      return P.shell(a, { title: "Discussions", body: body(a) }, { page: "W30" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
