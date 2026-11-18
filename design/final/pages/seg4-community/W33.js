/* W33 My course groups (Phase 3 seg4). Student only. Anchor: the lab-teams set; home group_work_in_progress. Shows
   only the viewer's own group (groupFor) and the set's published group work (A4). No Join control: the instructor
   assigns groups. Rules: pages/seg4-community/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "firstUseEmpty", "offline", "permissionUnavailable"];

  function setOf(a) {
    var id = a.sel.anchorFor("W33").record.id;
    return a.view.data.groups.group_sets.filter(function (s) { return s.id === id && s.course_id === a.who.courseId; })[0] || null;
  }
  // A4: only group work that is also a published assessment.
  function work(a, set) {
    var published = P.assessments(a).map(function (x) { return x.id; });
    return a.view.data.groups.group_assignments.filter(function (g) {
      return g.course_id === a.who.courseId && g.group_set_id === set.id && published.indexOf(g.id) >= 0;
    });
  }

  function workList(a, set) {
    var items = work(a, set).map(function (g) {
      var it = a.sel.assessment(a.view, g.id);
      var go = P.recordGo("W19", "assessment", it.id);
      var item = { title: it.title, meta: it.due ? "Due " + P.when(a, it.due) : "", trailing: P.status(a, P.ownSubmission(a, it.id), true) };
      if (go) item.go = go;
      return item;
    });
    if (!items.length) return P.p("No group work assigned yet");
    return a.K.list({ label: "Group work", items: items });
  }

  function card(a, set, g) {
    var members = g.members.map(function (m) { return P.personName(a, m); }).filter(Boolean).join(", ");
    var facts = a.K.kv([
      { label: "Group", value: g.name }, { label: "Members", value: members }, { label: "Membership version", value: String(set.version) },
    ]);
    var go = P.recordGo("W34", "group", g.id);
    var body = P.stack(a, [
      facts, set.self_enrollment ? "" : P.p("Your instructor assigns groups"), workList(a, set),
      P.p("A receipt keeps the members it was handed in with, even if groups change later."),
      go ? P.links(a, [{ label: "Open group workspace", go: go }]) : "",
    ]);
    return a.K.card({ title: set.name, body: body, level: 2 });
  }

  function none(a) {
    return a.K.empty({
      title: "You are not in a group yet",
      body: P.p("Your instructor assigns groups") + P.links(a, [{ label: "Ask for help", go: "W12" }, { label: "Course overview", go: "W14" }]),
    });
  }

  function body(a) {
    if (a.state === "permissionUnavailable") return P.permissionNotice(a, "Groups are not available for your course role");
    if (a.state === "loading") return P.loading(a, "your groups");
    var set = setOf(a);
    var g = set ? a.sel.groupFor(a.view, a.who.personId, set.id) : null;
    if (a.state === "firstUseEmpty" || !g) return none(a);
    var top = a.state === "offline" ? P.offlineNotice(a) + a.K.flag("lastKnown") : "";
    return P.stack(a, [top, card(a, set, g)]);
  }

  WB.definePage("W33", {
    states: STATES,
    na: P.na(STATES, {
      conflict: "Membership changes are drawn on the group workspace",
      invalid: "Groups in this course are assigned by the instructor; there is nothing to join",
      saving: "Groups in this course are assigned by the instructor; there is nothing to join",
    }),
    render: function (a) {
      return P.shell(a, { title: "My groups", body: body(a) }, { page: "W33" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
