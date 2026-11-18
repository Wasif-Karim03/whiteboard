/* W47 Group sets and membership builder (Phase 3 seg4). Instructor and TA. Anchor: the lab-teams set. Authority first
   (staffGate on the group assignment, then the TA's own task access and scope, A6). The instructor edits on web
   (preview-only Move, Save and Publish); iPad and iPhone are the review tier with a read-only roster and the
   instructor's "Lock membership" protective action. Rules: pages/seg4-community/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "firstUseEmpty", "invalid", "saveFailed", "conflict", "offline", "permissionUnavailable"];
  var INVALID = "Every learner must be in exactly one group before publishing";
  var BLOCK = { conflict: "Refresh the roster first", offline: "You're offline", invalid: INVALID, saveFailed: "Retry the failed save first" };

  function setOf(a) {
    var id = a.sel.anchorFor("W47").record.id;
    return a.view.data.groups.group_sets.filter(function (s) { return s.id === id && s.course_id === a.who.courseId; })[0] || null;
  }
  function gaOf(a, set) {
    return a.view.data.groups.group_assignments.filter(function (g) { return g.course_id === a.who.courseId && g.group_set_id === set.id; })[0] || null;
  }
  function names(a, ids) { return ids.map(function (m) { return P.personName(a, m); }).filter(Boolean); }
  function blocked(a) { return Object.prototype.hasOwnProperty.call(BLOCK, a.state) ? BLOCK[a.state] : ""; }
  // R06: on the review tier every blocking state but form validation (no form is drawn there) blocks the protective action.
  function reviewBlocked(a) { return a.state === "invalid" ? "" : blocked(a); }

  function facts(a, set, ga) {
    var it = ga ? a.sel.assessment(a.view, ga.id) : null;
    var rows = [{ label: "Group set", value: set.name }, { label: "Membership version", value: String(set.version) }, { label: "Self-enrollment", value: set.self_enrollment ? "On" : "Off" }];
    if (it) rows.push({ label: "Used by", value: it.title + " · published with membership version " + ga.membership_version_at_publish });
    var go = it ? P.recordGo("W40", "assessment", it.id) : null;
    return P.stack(a, [a.K.kv(rows), go ? P.links(a, [{ label: "Open the assignment editor", go: go }]) : ""]);
  }

  function memberItem(a, m, editable) {
    var move = editable ? a.K.button({ label: "Move to group…", kind: "quiet", act: "open-dialog", target: P.id(a, "move") }) : "";
    return { title: P.personName(a, m), trailing: move || undefined };
  }
  function groupCard(a, g, editable) {
    var count = g.members.length + (g.members.length === 1 ? " member" : " members");
    var list = a.K.list({ label: g.name + " members", items: g.members.map(function (m) { return memberItem(a, m, editable); }) });
    return a.K.card({ title: g.name, body: P.p(count) + list });
  }
  function roster(a, set, groups, editable) {
    var ungrouped = set.ungrouped.length ? P.p(names(a, set.ungrouped).join(", ")) : P.p("Everyone is in a group");
    var cards = [a.K.card({ title: "Not in a group", body: ungrouped })].concat(groups.map(function (g) { return groupCard(a, g, editable); }));
    return a.K.grid(a.ctx, { items: cards, cols: 3, compactCols: 1 });
  }

  function receipts(a, set, ga) {
    var list = ga ? a.sel.receiptsFor(a.view, ga.id, a.who).filter(function (r) { return r.group_id; }) : [];
    if (!list.length) return "";
    var cards = list.map(function (r) {
      var g = set.groups.filter(function (x) { return x.id === r.group_id; })[0];
      var go = P.recordGo("W49", "receipt", r.id);
      var kv = a.K.kv([
        { label: "Members", value: names(a, r.captured_members).join(", ") }, { label: "Membership version", value: String(r.membership_version) },
        { label: "Accepted", value: P.when(a, r.accepted_at) },
      ]);
      return a.K.card({ title: g ? g.name : "Group", body: kv + P.p("These members are fixed on the receipt") + (go ? P.links(a, [{ label: "Open in grader", go: go }]) : "") });
    });
    return a.K.section({ title: "Group work handed in", level: 2, body: P.stack(a, cards) });
  }

  function actionButton(a, label, suffix, note) {
    var reason = blocked(a);
    if (reason) return a.K.button({ label: label, disabled: true, reason: reason, id: P.id(a, suffix) });
    return a.K.button({ label: label, kind: suffix === "publish" ? "primary" : "secondary", note: note });
  }
  function stateTop(a) {
    if (a.state === "invalid") return a.K.notice({ tone: "error", title: INVALID });
    if (a.state === "saveFailed") return a.K.saveStatus("failed") + a.K.button({ label: "Retry save", note: "Preview only: nothing is saved in this prototype" });
    if (a.state === "offline") return P.offlineNotice(a) + a.K.flag("lastKnown");
    if (a.state !== "conflict") return "";
    return a.K.notice({
      tone: "warning", title: "The course roster changed after this set was built. Refresh before publishing",
      actions: [{ label: "Refresh roster", note: "Preview only: the roster is not reloaded in this prototype" }],
    });
  }

  function moveDialog(a) {
    return a.K.dialog(a.ctx, {
      id: P.id(a, "move"), title: "Change membership after work", open: a.variant === "move",
      body: P.p("The change applies from now on. Work already handed in keeps the members it was handed in with."),
      actions: [{ label: "Apply from now on", kind: "primary", id: P.id(a, "move-apply"), note: "Preview only: membership does not change in this prototype" }],
    });
  }

  function instructorFull(a, set, ga) {
    if (a.state === "firstUseEmpty") {
      return { body: a.K.empty({ title: "No group sets yet", action: { label: "Create group set", note: "Preview only: no set is created in this prototype" } }), dialog: "" };
    }
    var editable = !blocked(a);
    var actions = P.stack(a, [
      editable ? "" : actionButton(a, "Move to group…", "move-btn"),
      actionButton(a, "Save draft", "save", "Preview only: nothing is saved in this prototype"),
      actionButton(a, "Publish group set", "publish", "Preview only: nothing is published in this prototype"),
    ]);
    var body = P.stack(a, [stateTop(a), facts(a, set, ga), roster(a, set, set.groups, editable), receipts(a, set, ga), actions]);
    return { body: body, dialog: editable ? moveDialog(a) : "" };
  }

  function instructorReview(a, set, ga) {
    var reason = reviewBlocked(a);
    var lock = [reason ? { label: "Lock membership for this set", disabled: true, reason: reason, id: P.id(a, "lock") }
      : { label: "Lock membership for this set", note: "Preview only: nothing is locked in this prototype" }];
    var handoff = P.handoff(a, { title: "Open on a larger screen", lastResult: P.p(set.name + " · membership version " + set.version), protectiveActions: lock });
    var top = reason ? stateTop(a) : "";
    var main = a.state === "firstUseEmpty" ? a.K.empty({ title: "No group sets yet" }) : P.stack(a, [facts(a, set, ga), roster(a, set, set.groups, false), receipts(a, set, ga)]);
    return P.stack(a, [handoff, top, main]);
  }

  // A6: a TA reads learners only through an active task and a non-null scope for this group assignment.
  function taView(a, set, ga) {
    var it = a.sel.assessment(a.view, ga.id);
    var access = a.sel.taTaskAccess(a.view, ga.id, a.who);
    var scope = access.active ? a.sel.taScope(a.view, ga.id, a.who) : null;
    var handoff = P.handoff(a, { title: "Open on a larger screen" });
    if (!scope) return P.stack(a, [handoff, a.K.notice({ tone: "info", title: "Access ended", body: P.p("Grading task: " + it.title + ". No learner data is shown.") })]);
    var groups = set.groups.filter(function (g) { return g.members.every(function (m) { return scope.learnerIds.indexOf(m) >= 0; }); });
    var cards = groups.map(function (g) { return groupCard(a, g, false); });
    return P.stack(a, [handoff, a.K.flag("readOnly"), P.p("Groups in your grading task for " + it.title), P.stack(a, cards), P.p("Changing membership is the instructor's step")]);
  }

  function view(a) {
    var set = setOf(a);
    var ga = set ? gaOf(a, set) : null;
    var gate = P.staffGate(a, ga ? ga.id : null);
    if (gate) return { body: gate, dialog: "" };
    if (a.state === "loading") return { body: P.stack(a, [P.handoff(a, { title: "Open on a larger screen" }), P.loading(a, "group sets")]), dialog: "" };
    if (!set) return { body: P.stack(a, [P.handoff(a, { title: "Open on a larger screen" }), a.K.empty({ title: "No group sets yet" })]), dialog: "" };
    if (a.role === "ta") return { body: ga ? taView(a, set, ga) : P.bareHandoff(a), dialog: "" };
    return a.tier === "full" ? instructorFull(a, set, ga) : { body: instructorReview(a, set, ga), dialog: "" };
  }

  WB.definePage("W47", {
    states: STATES,
    na: P.na(STATES, { saving: "Saving is drawn as preview only; the failed save is drawn instead" }),
    variants: { move: "Change membership dialog open" },
    render: function (a) {
      var v = view(a);
      return P.shell(a, { title: "Groups", body: v.body, dialog: v.dialog || undefined }, { page: "W47" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
