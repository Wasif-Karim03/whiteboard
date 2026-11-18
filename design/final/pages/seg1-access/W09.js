/* W09 Global academic search (Phase 3 seg1). The index is built per render from scoped sources only: published
   assessments in the viewer's course (A4), published announcements and sel.visibleTopics, so staff never see a
   group-only topic. Rows link with P.recordGo or are plain text (A10). The sample queries are presentation. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "filteredEmpty", "invalid", "conflict", "offline"];
  var QUERIES = { results: "projectile", "group-only": "orbit", invalid: "p" };
  var TYPES = { assessment: "Coursework", announcement: "Announcements", discussion: "Discussions" };

  function hit(q, texts) {
    var needle = q.toLowerCase();
    return texts.some(function (t) { return String(t || "").toLowerCase().indexOf(needle) >= 0; });
  }

  function index(a) {
    var cid = a.who.courseId;
    var items = P.assessments(a).map(function (x) {
      return { type: "assessment", title: x.title, texts: [x.title], go: P.recordGo("W19", "assessment", x.id) || P.recordGo("W25", "assessment", x.id) };
    });
    var anns = a.view.data.comms.announcements.filter(function (x) { return x.course_id === cid && x.state === "published"; }).map(function (x) {
      var rev = x.revisions[x.revisions.length - 1];
      return { type: "announcement", title: rev.title, texts: [rev.title, rev.body], go: P.recordGo("W29", "announcement", x.id) };
    });
    var topics = a.sel.visibleTopics(a.view, cid, a.who.personId).map(function (x) {
      return { type: "discussion", title: x.title, texts: [x.title].concat((x.posts || []).map(function (p) { return p.body; })), go: P.recordGo("W31", "discussion", x.id) };
    });
    return items.concat(anns, topics);
  }

  function query(a) {
    if (a.state === "invalid") return QUERIES.invalid;
    if (a.variant) return QUERIES[a.variant];
    return a.state ? QUERIES.results : "";
  }

  function controls(a, q) {
    var err = a.state === "invalid" ? "Enter at least 2 characters" : undefined;
    var search = a.state === "invalid" || a.state === "offline"
      ? a.K.button({ label: "Search", kind: "primary", disabled: true, reason: err || "You're offline. Search needs a connection", id: P.id(a, "go") })
      : a.K.button({ label: "Search", kind: "primary", note: "Preview only: the sample queries are drawn as views" });
    return P.stack(a, [
      a.K.field({ id: P.id(a, "q"), label: "Search", value: q, error: err }),
      a.K.grid(a.ctx, {
        cols: 3, compactCols: 1,
        items: [
          a.K.field({ id: P.id(a, "type"), type: "select", label: "Type", options: [{ value: "all", label: "All types" }].concat(Object.keys(TYPES).map(function (k) { return { value: k, label: TYPES[k] }; })) }),
          a.K.field({ id: P.id(a, "course"), type: "select", label: "Course", options: [{ value: "own", label: a.sel.course(a.view, a.who.courseId).code }] }),
          a.K.field({ id: P.id(a, "archived"), type: "checkbox", label: "Include archived terms" }),
        ],
      }),
      search,
    ]);
  }

  function results(a, q) {
    var code = a.sel.course(a.view, a.who.courseId).code;
    var found = index(a).filter(function (x) { return hit(q, x.texts); });
    if (!found.length) return a.K.empty({ title: "No results you can open match this search", body: P.p("Try another word.") });
    var groups = Object.keys(TYPES).map(function (t) {
      var list = found.filter(function (x) { return x.type === t; });
      if (!list.length) return "";
      var items = list.map(function (x) { return { title: x.title, meta: TYPES[t] + " · " + code, go: x.go || undefined }; });
      return a.K.section({ title: TYPES[t], body: a.K.list({ label: TYPES[t], items: items }), level: 2 });
    });
    var n = found.length + (found.length === 1 ? " result" : " results");
    var lost = a.state === "conflict" ? a.K.list({ label: "Changed access", items: [{ title: "A result can no longer be opened because access changed" }] }) : "";
    return P.stack(a, ['<p role="status">' + WB.esc(n + " you can open") + "</p>"].concat(groups, [lost]));
  }

  function body(a) {
    if (!a.who.courseId) return a.K.empty({ title: "No course is assigned to this account yet" });
    var q = query(a);
    var top = controls(a, q);
    if (a.state === "loading") return P.stack(a, [top, '<p role="status">Searching…</p>']);
    if (a.state === "offline") return P.stack(a, [top, a.K.notice({ tone: "warning", title: "Search could not run. Your query is kept", actions: [{ label: "Retry", go: "W09:results" }] })]);
    if (a.state === "filteredEmpty") return P.stack(a, [top, a.K.empty({ title: "No results you can open match these filters", action: { label: "Clear filters", go: "W09:results" } })]);
    if (a.state === "invalid" || !q) {
      return P.stack(a, [top, P.p("Search covers material you can open."),
        a.K.button({ label: "Clear recent searches", kind: "quiet", disabled: true, reason: "No recent searches are stored", id: P.id(a, "recent") })]);
    }
    return P.stack(a, [top, results(a, q)]);
  }

  WB.definePage("W09", {
    states: STATES,
    na: P.na(STATES, {
      firstUseEmpty: "The default view is the no-query guidance",
      saving: "Search saves nothing",
      saveFailed: "Search saves nothing",
    }),
    variants: { results: "Sample query with results", "group-only": "Sample query matching a group-only topic" },
    render: function (a) { return { title: a.page.title, navActive: "search", body: body(a) }; },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
