/* W34 Group workspace (Phase 3 seg4). Student only. Anchor: Team Orbit; home group_work_in_progress. The viewer's
   group must be the anchor group, else nothing about it is drawn. Per published group assignment (A4): the receipt
   with its captured members, or the shared draft with its membership version, or neither. Conflict blocks Add
   and Review and keeps any receipt unchanged. Rules: pages/seg4-community/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "firstUseEmpty", "conflict", "offline", "permissionUnavailable"];

  function groupId(a) { return a.sel.anchorFor("W34").record.id; }
  function setOf(a) {
    var gid = groupId(a);
    return a.view.data.groups.group_sets.filter(function (s) {
      return s.course_id === a.who.courseId && s.groups.some(function (g) { return g.id === gid; });
    })[0] || null;
  }
  function work(a, set) {
    var published = P.assessments(a).map(function (x) { return x.id; });
    return a.view.data.groups.group_assignments.filter(function (g) {
      return g.course_id === a.who.courseId && g.group_set_id === set.id && published.indexOf(g.id) >= 0;
    });
  }
  function namesOf(a, ids) { return ids.map(function (m) { return P.personName(a, m); }).filter(Boolean).join(", "); }
  function link(label, go) { return go ? { label: label, go: go } : null; }

  function receiptPart(a, r) {
    var facts = a.K.kv([
      { label: "Handed in by", value: P.personName(a, r.actor_id) }, { label: "Accepted", value: P.when(a, r.accepted_at) },
      { label: "Members on the receipt", value: namesOf(a, r.captured_members) },
      { label: "Membership version at hand-in", value: String(r.membership_version) },
    ]);
    var keep = a.state === "conflict" ? P.p("This receipt keeps its original members") : "";
    return P.stack(a, [facts, keep, P.links(a, [link("View receipt", P.recordGo("W22", "receipt", r.id))])]);
  }

  function blockReason(a) {
    if (a.state === "conflict") return "Refresh the group first";
    return a.state === "offline" ? "You're offline" : "";
  }
  function draftActions(a, draft) {
    var reason = blockReason(a);
    if (reason) {
      return P.stack(a, [
        a.K.button({ label: "Add group work", disabled: true, reason: reason, id: P.id(a, "add") }),
        a.K.button({ label: "Review and submit", disabled: true, reason: reason, id: P.id(a, "review") }),
      ]);
    }
    return P.links(a, [link("Continue group work", P.recordGo("W20", "draft", draft.id)), link("Review and submit", P.recordGo("W21", "draft", draft.id))]);
  }
  function draftPart(a, draft) {
    var files = a.K.list({ label: "Files in the shared draft", items: draft.files.map(function (f) { return { title: f.name, meta: P.fileMeta(a, f) }; }) });
    return P.stack(a, [
      P.p("Shared draft saved by " + P.personName(a, draft.actor_id) + " · " + P.when(a, draft.saved_at)), files,
      P.p("Prepared for membership version " + draft.membership_version), draftActions(a, draft),
    ]);
  }
  function nonePart(a) {
    var reason = blockReason(a);
    var add = reason ? a.K.button({ label: "Add group work", disabled: true, reason: reason, id: P.id(a, "add") }) : "";
    return P.stack(a, [P.p("No shared draft yet. Start it from the assignment page."), add]);
  }

  function block(a, it) {
    var r = a.sel.receiptsFor(a.view, it.id, a.who)[0] || null;
    var draft = r ? null : a.sel.draftFor(a.view, it.id, a.who);
    var part = r ? receiptPart(a, r) : draft ? draftPart(a, draft) : nonePart(a);
    var more = P.links(a, [link("Assignment details", P.recordGo("W19", "assessment", it.id))]);
    var body = P.stack(a, [P.status(a, P.ownSubmission(a, it.id), true), part, P.p("One submission counts for the whole group."), more]);
    return a.K.card({ title: it.title, body: body, level: 2 });
  }

  function conflictNotice(a, set, items) {
    var draft = items.map(function (it) { return a.sel.draftFor(a.view, it.id, a.who); }).filter(Boolean)[0];
    var text = "Current membership version " + set.version + (draft ? ". The shared draft was prepared for version " + draft.membership_version : "") + ".";
    return a.K.notice({
      tone: "warning", title: "Your group's membership changed. Review the members again before handing in", body: P.p(text),
      actions: [{ label: "Refresh group", note: "Preview only: the group is not reloaded in this prototype" }, { label: "My groups", go: "W33" }],
    });
  }

  function content(a, set, g) {
    var items = work(a, set).map(function (x) { return a.sel.assessment(a.view, x.id); });
    var facts = a.K.kv([
      { label: "Group", value: g.name }, { label: "Group set", value: set.name },
      { label: "Members", value: namesOf(a, g.members) }, { label: "Membership version", value: String(set.version) },
    ]);
    var empty = a.K.empty({ title: "No group work assigned yet", body: P.links(a, [{ label: "My groups", go: "W33" }]) });
    var top = a.state === "conflict" ? conflictNotice(a, set, items) : a.state === "offline" ? P.offlineNotice(a) + a.K.flag("lastKnown") : "";
    var list = a.state === "firstUseEmpty" || !items.length ? [empty] : items.map(function (it) { return block(a, it); });
    return P.stack(a, [top, facts].concat(list));
  }

  function body(a) {
    var set = setOf(a);
    var g = set ? a.sel.groupFor(a.view, a.who.personId, set.id) : null;
    if (a.state === "permissionUnavailable" || !g || g.id !== groupId(a)) return P.permissionNotice(a, "This group workspace is not available to you");
    if (a.state === "loading") return P.loading(a, "the group workspace");
    return content(a, set, g);
  }

  WB.definePage("W34", {
    states: STATES,
    na: P.na(STATES, { invalid: "Files are added on the add-work page; this workspace takes no typed input" }),
    render: function (a) {
      return P.shell(a, { title: "Group workspace", body: body(a), crumbs: [{ label: "My groups", go: "W33" }] }, { section: "groups" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
