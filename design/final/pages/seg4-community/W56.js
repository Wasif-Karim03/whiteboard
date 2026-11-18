/* W56 Discussion setup and moderation (Phase 3 seg4). Instructor and TA. The subject is the W31 anchor topic when it
   is visible at the clock. Hide, Lock and setup changes are preview only; there are no report records, so the
   reported list is empty. A TA has no moderation scope. iPad and iPhone are the review tier with the instructor's
   "Lock replies" protective action. Rules: pages/seg4-community/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "firstUseEmpty", "invalid", "conflict", "offline", "permissionUnavailable"];
  var BLOCK = { invalid: "Add a reason learners can read first", conflict: "Refresh the thread first", offline: "You're offline" };
  var COLS = [
    { key: "topic", label: "Topic", primary: true }, { key: "audience", label: "Audience" }, { key: "replies", label: "Replies", numeric: true },
    { key: "last", label: "Last activity" }, { key: "state", label: "State" },
  ];

  function topics(a) { return a.sel.visibleTopics(a.view, a.who.courseId, a.who.personId); }
  function subject(a) {
    var id = a.sel.anchorFor("W31").record.id;
    return topics(a).filter(function (t) { return t.id === id; })[0] || null;
  }
  function blocked(a) { return Object.prototype.hasOwnProperty.call(BLOCK, a.state) ? BLOCK[a.state] : ""; }
  // R06: on the review tier every blocking state but form validation (no form is drawn there) blocks the protective action.
  function reviewBlocked(a) { return a.state === "invalid" ? "" : blocked(a); }

  function table(a) {
    var rows = a.state === "firstUseEmpty" ? [] : topics(a).map(function (t) {
      var last = a.sel.lastActivity(a.view, t.id);
      var go = P.recordGo("W31", "discussion", t.id);
      var cells = {
        topic: esc(t.title), audience: esc(t.audience === "group" ? "Group only" : "Whole course"),
        replies: esc(String(a.sel.replyCount(a.view, t.id))), last: last ? esc(P.when(a, last)) : "", state: t.replies_closed ? a.K.flag("closed") : esc("Open"),
      };
      return go ? { id: t.id, cells: cells, go: go } : { id: t.id, cells: cells };
    });
    var empty = { title: "No discussions yet" };
    if (a.role === "instructor" && a.tier === "full") empty.action = { label: "Create discussion", note: "Preview only: no discussion is created in this prototype" };
    return a.K.table(a.ctx, { id: P.id(a, "topics"), caption: "Discussions", columns: COLS, rows: rows, empty: empty });
  }

  function control(a, label, suffix, note) {
    var reason = blocked(a);
    if (reason) return a.K.button({ label: label, kind: "quiet", disabled: true, reason: reason, id: P.id(a, suffix) });
    return a.K.button({ label: label, kind: "quiet", note: note });
  }
  function postItem(a, post, editable) {
    var person = a.sel.person(a.view, post.author_id);
    var role = person ? WB.ROLE_LABELS[person.role] || "" : "";
    var hide = editable ? control(a, "Hide post…", "hide-" + post.id, "Preview only: nothing is hidden in this prototype") : undefined;
    return { title: P.personName(a, post.author_id) + " · " + role, meta: P.when(a, post.at) + " · " + post.body, trailing: hide };
  }

  function stateTop(a) {
    if (a.state === "offline") return P.offlineNotice(a) + a.K.flag("lastKnown");
    if (a.state !== "conflict") return "";
    return a.K.notice({
      tone: "warning", title: "This thread changed while you were deciding. Refresh before acting",
      actions: [{ label: "Refresh", note: "Preview only: the thread is not reloaded in this prototype" }],
    });
  }

  function thread(a, t) {
    if (!t) return P.p("The moderated thread has not started at this point.");
    var lock = t.replies_closed ? "Reopen replies" : "Lock replies";
    var reason = a.K.field({ label: "Reason shown to learners", id: P.id(a, "reason"), error: a.state === "invalid" ? "Add a reason learners can read" : undefined });
    var posts = a.K.list({ label: "Posts in this thread", items: t.posts.map(function (p) { return postItem(a, p, true); }) });
    var body = P.stack(a, [posts, reason, control(a, lock, "lock", "Preview only: replies do not change in this prototype")]);
    return a.K.section({ title: "Thread: " + t.title, level: 2, body: body });
  }
  function reported(a) {
    return a.K.section({ title: "Reported posts", level: 2, body: a.K.empty({ title: "No reported posts", body: P.p("Posts that learners report appear here.") }) });
  }
  function links(a, t) {
    var go = t ? P.recordGo("W31", "discussion", t.id) : null;
    return P.links(a, [{ label: "Discussions", go: "W30" }, go ? { label: "Open thread", go: go } : null]);
  }

  function instructorFull(a) {
    var t = a.state === "firstUseEmpty" ? null : subject(a);
    var parts = a.state === "firstUseEmpty" ? [table(a)] : [stateTop(a), table(a), thread(a, t), reported(a)];
    return P.stack(a, parts.concat([links(a, t)]));
  }

  function instructorReview(a) {
    var t = a.state === "firstUseEmpty" ? null : subject(a);
    var reason = reviewBlocked(a);
    var lock = reason ? { label: "Lock replies", disabled: true, reason: reason, id: P.id(a, "lock-off") }
      : { label: "Lock replies", note: "Preview only: replies do not change in this prototype" };
    var protect = t && !t.replies_closed ? [lock] : [];
    var result = t ? P.p(t.title + " · " + (t.replies_closed ? "Replies closed" : "Replies open")) : "";
    var handoff = P.handoff(a, { title: "Open on a larger screen", lastResult: result, protectiveActions: protect });
    return P.stack(a, [handoff, reason ? stateTop(a) : "", table(a), links(a, t)]);
  }

  function taView(a) {
    var notice = a.K.notice({ tone: "info", title: "You have no moderation scope in this course", body: P.p("A grading task does not include moderation.") });
    return P.stack(a, [P.bareHandoff(a), notice, a.K.flag("readOnly"), table(a), P.links(a, [{ label: "Discussions", go: "W30" }])]);
  }

  function body(a) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "discussion setup")]);
    if (a.role === "ta") return taView(a);
    return a.tier === "full" ? instructorFull(a) : instructorReview(a);
  }

  var PREVIEW = "Setup changes are preview only in this prototype";
  WB.definePage("W56", {
    states: STATES,
    na: P.na(STATES, { saving: PREVIEW, saveFailed: PREVIEW }),
    render: function (a) {
      return P.shell(a, { title: "Discussion setup", body: body(a) }, { section: "discussions" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
