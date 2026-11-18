/* W31 Discussion thread (Phase 3 seg4). Anchor: the projectile topic, read through visibleTopics. Posts in order with
   author, role and time; the reply composer is preview only and never claims a post was sent. No composer when
   replies are closed, access has ended or the audience changed. Rules: pages/seg4-community/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "invalid", "saving", "saveFailed", "offline", "permissionUnavailable"];

  function topic(a) {
    var id = a.sel.anchorFor("W31").record.id;
    return a.sel.visibleTopics(a.view, a.who.courseId, a.who.personId).filter(function (t) { return t.id === id; })[0] || null;
  }
  function audience(a, t) {
    var course = a.sel.course(a.view, a.who.courseId);
    return t.audience === "group" ? "your group only" : "everyone in " + course.code;
  }
  function roleOf(a, personId) {
    var person = a.sel.person(a.view, personId);
    return person ? WB.ROLE_LABELS[person.role] || "" : "";
  }

  function header(a, t) {
    return a.K.kv([
      { label: "Audience", value: audience(a, t) },
      { label: "Replies", value: String(a.sel.replyCount(a.view, t.id)) },
      { label: "Last activity", value: P.when(a, a.sel.lastActivity(a.view, t.id)) },
    ]);
  }

  function report(a, post) {
    if (a.state === "offline") return a.K.button({ label: "Report", kind: "quiet", disabled: true, reason: "You're offline", id: P.id(a, "report-" + post.id) });
    return a.K.button({ label: "Report", kind: "quiet", note: "Preview only: nothing is reported in this prototype" });
  }
  function postCard(a, t, post) {
    var parent = post.parent_id ? t.posts.filter(function (x) { return x.id === post.parent_id; })[0] : null;
    var meta = P.when(a, post.at) + (parent ? " · In reply to " + P.personName(a, parent.author_id) : "");
    var title = P.personName(a, post.author_id) + " · " + roleOf(a, post.author_id);
    return a.K.card({ title: title, body: P.p(meta) + P.p(post.body), footer: report(a, post) });
  }
  function posts(a, t) {
    return a.K.section({ title: "Posts", level: 2, body: P.stack(a, t.posts.map(function (post) { return postCard(a, t, post); })) });
  }

  function postButton(a) {
    var id = P.id(a, "post");
    if (a.state === "offline") return a.K.button({ label: "Post reply", disabled: true, reason: "You're offline", id: id }) + P.p("Not posted");
    if (a.state === "saving") return a.K.saveStatus("saving") + a.K.button({ label: "Post reply", disabled: true, reason: "Your reply is still sending", id: id });
    return a.K.button({ label: "Post reply", kind: "primary", note: "Preview only: nothing is posted in this prototype" });
  }
  function failed(a) {
    if (a.state !== "saveFailed") return "";
    return a.K.notice({
      tone: "error", title: "We could not confirm your reply was posted. Check the thread before trying again",
      actions: [{ label: "Check thread", note: "Preview only: the thread is not reloaded in this prototype" }],
    });
  }
  function composer(a, t) {
    if (t.replies_closed) return P.stack(a, [a.K.flag("closed"), P.p("Replies are closed")]);
    if (P.taEnded(a)) return "";
    var field = a.K.field({ label: "Your reply", type: "textarea", id: P.id(a, "reply"), error: a.state === "invalid" ? "Write a reply before posting" : undefined });
    var line = P.p("Posting as " + P.personName(a, a.who.personId) + " to " + audience(a, t));
    return a.K.section({ title: "Reply", level: 2, body: P.stack(a, [failed(a), line, field, postButton(a)]) });
  }

  function links(a) {
    var list = [{ label: "Back to discussions", go: "W30" }];
    if (a.role === "instructor") list.push({ label: "Manage discussions", go: "W56" });
    return P.links(a, list);
  }

  function body(a, t) {
    if (a.state === "permissionUnavailable") return P.stack(a, [P.permissionNotice(a, "You no longer have access to this discussion"), links(a)]);
    if (a.state === "loading") return P.loading(a, "the discussion");
    if (!t) return P.stack(a, [P.offHome(a, "This discussion has not started at this point"), links(a)]);
    var top = [P.taEnded(a) ? P.taEndedNotice(a) : "", a.state === "offline" ? P.offlineNotice(a) + a.K.flag("lastKnown") : ""];
    return P.stack(a, top.concat([header(a, t), posts(a, t), composer(a, t), links(a)]));
  }

  WB.definePage("W31", {
    states: STATES,
    na: P.na(STATES, { firstUseEmpty: "A thread always has its opening post; an empty course is drawn on the discussion list" }),
    render: function (a) {
      var t = topic(a);
      var open = t && ["loading", "permissionUnavailable"].indexOf(a.state) < 0;
      return P.shell(a, { title: open ? t.title : "Discussion", body: body(a, t), crumbs: [{ label: "Discussions", go: "W30" }] }, { section: "discussions" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
