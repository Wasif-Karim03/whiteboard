/* W45 Course people and staff permission (Phase 3 seg5). Anchor: the TA persona. The instructor sees the roster
   and the TA's tasks with revoke as a destructive dialog (preview-only primary). A TA sees only their own
   active task scope (DD-5.09, A6). An expired task shows its title and "Access ended" only. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "firstUseEmpty", "destructive", "offline", "permissionUnavailable"];
  var PREVIEW = "Preview only: nothing changes in this prototype";
  var ROLES = [["instructor", "Instructor"], ["ta", "Teaching assistant"], ["student", "Learner"]];

  function team(a) { return a.sel.teachingTeam(a.view, a.who); }
  function firstStaff(a) {
    var t = team(a);
    var active = t && t.members.filter(function (m) { return m.tasks.some(function (task) { return a.sel.isBefore(a.view.clock, task.access_end); }); })[0];
    var allocated = t && t.members.filter(function (m) { return m.tasks.length; })[0];
    return active ? active.person.id : allocated ? allocated.person.id : t && t.members.length ? t.members[0].person.id : null;
  }
  function taId(a) { return a.role === "ta" ? a.who.personId : firstStaff(a); }
  function taWho(a) {
    if (a.role === "ta") return a.who;
    var id = taId(a);
    return id ? { role: "ta", personId: id, courseId: a.who.courseId } : null;
  }
  function tasks(a) {
    var id = taId(a);
    return id ? P.assessments(a).map(function (it) { return { it: it, task: a.sel.gradingTaskFor(a.view, id, it.id) }; }).filter(function (e) { return e.task; }) : [];
  }
  function scopeOf(a, e) {
    var w = taWho(a);
    return w && a.sel.taTaskAccess(a.view, e.it.id, w).active ? a.sel.taScope(a.view, e.it.id, w) : null;
  }

  function taskBlock(a, e) {
    var s = scopeOf(a, e);
    if (!s) return a.K.card({ title: e.it.title, body: P.p("Access ended " + P.when(a, e.task.access_end)) });
    return a.K.card({ title: e.it.title, body: P.stack(a, [
      a.K.kv([{ label: "Grading due", value: P.when(a, e.task.grading_due) }, { label: "Questions", value: P.questionsText(s.questionIds) }]),
      a.K.list({ label: "Assigned learners", items: s.learnerIds.map(function (id) { return { title: P.personName(a, id) }; }) }),
    ]) });
  }
  function scopeView(a) {
    var end = a.sel.accessEnd(a.view, taId(a), a.who.courseId);
    var list = tasks(a);
    return a.K.section({ title: "Grading access: " + P.personName(a, taId(a)), level: 2, body: P.stack(a, [
      end ? a.K.kv([{ label: "Course access ends", value: P.when(a, end) }]) : "",
      P.stack(a, list.map(function (e) { return taskBlock(a, e); })),
    ]) });
  }

  // R07: the delayed roster replaces scope, roster and actions on every tier, so no name or revoke opener shows.
  function rosterDelayed(a) {
    return P.stack(a, [P.bareHandoff(a), a.K.notice({ tone: "info", title: "Roster delayed" }), a.K.empty({ title: "The roster has not arrived yet" })]);
  }
  // R01: the frame role alone is not membership; the viewer must hold that role in the course.
  function member(a) { return a.sel.verifiedRole(a.view, a.who, a.who.courseId) === a.role; }
  function learnerGo(a, id) { return WB.Teaching.go(a, "W45", { learnerId: id, assessmentId: null, receiptId: null }); }
  function roster(a) {
    var rows = [];
    ROLES.forEach(function (r) {
      a.sel.enrolled(a.view, a.who.courseId, r[0]).forEach(function (id) { rows.push({ title: P.personName(a, id), meta: r[1], go: r[0] === "student" ? learnerGo(a, id) : undefined }); });
    });
    return a.K.list({ label: "Course people", items: rows });
  }
  function selectedTask(a) { var list = tasks(a); return list.filter(function (e) { return a.sel.isBefore(a.view.clock, e.task.access_end); })[0] || list[0]; }
  function dialog(a) {
    var e = selectedTask(a);
    var end = a.sel.accessEnd(a.view, taId(a), a.who.courseId);
    return a.K.dialog(a.ctx, {
      id: P.id(a, "revoke"), kind: "destructive", title: "Revoke grading access", open: a.state === "destructive",
      body: P.p("Revoke " + P.personName(a, taId(a)) + "'s access" + (e ? " to " + e.it.title : "") + (end ? ", which otherwise ends " + P.when(a, end) : "") + ".") +
        P.p("Marks already saved stay. Nothing is released."),
      actions: [{ label: "Revoke access", id: P.id(a, "revoke-go"), note: PREVIEW }],
    });
  }
  function actions(a) {
    if (a.state === "offline") return [{ label: "Revoke access", disabled: true, reason: "You're offline. Nothing is changed", id: P.id(a, "revoke-off") }];
    return [{ label: "Revoke access", act: "open-dialog", target: P.id(a, "revoke") }, { label: "Change end date", note: PREVIEW }];
  }
  function studentRecord(a, id) {
    var person = a.sel.teachingStudent(a.view, a.who, id);
    if (!person) return P.permissionNotice(a, "This learner is not available in this course");
    var ids = a.sel.teachingLearners(a.view, a.who).map(function (person) { return person.id; });
    var index = ids.indexOf(id);
    var navigation = [{ label: "All course people", go: WB.Teaching.go(a, "W45", { learnerId: null, assessmentId: null, receiptId: null }) }];
    if (index > 0) navigation.push({ label: "Previous learner", go: learnerGo(a, ids[index - 1]) });
    if (index >= 0 && index + 1 < ids.length) navigation.push({ label: "Next learner", go: learnerGo(a, ids[index + 1]) });
    var items = person.items.map(function (entry) {
      var parts = [];
      if (entry.assessment.grading_intent === "ungraded") parts.push("Ungraded practice");
      else if (!entry.submission) parts.push("No submission recorded");
      if (entry.result && entry.result.staffOutcome) parts.push("Held: " + entry.result.staffOutcome.status + (entry.result.staffOutcome.score == null ? "" : " · " + P.score(entry.result.staffOutcome.score, entry.assessment.max)));
      if (entry.result && entry.result.status !== null) parts.push("Released: " + entry.result.status + (entry.result.score == null ? "" : " · " + P.score(entry.result.score, entry.assessment.max)));
      if (entry.draft && entry.draft.overall_comment) parts.push("Draft feedback: " + entry.draft.overall_comment);
      if (entry.result && entry.result.comment) parts.push("Released feedback: " + entry.result.comment);
      var receipts = entry.receipts.map(function (receipt) {
        var go = WB.Teaching.go(a, "W49", { learnerId: id, assessmentId: entry.assessment.id, receiptId: receipt.id });
        return go ? { title: "Review received work", meta: "Attempt " + receipt.attempt, go: go } : { title: "Received work", meta: "Attempt " + receipt.attempt };
      });
      var record = receipts.length ? a.K.list({ label: "Received attempts", items: receipts }) : P.links(a, [{ label: "Open grade record", go: WB.Teaching.go(a, "W49", { learnerId: id, assessmentId: entry.assessment.id, receiptId: null }) }]);
      var selected = a.selection && a.selection.assessmentId === entry.assessment.id ? P.p("Selected assessment") : "";
      var content = selected + (entry.submission ? P.status(a, entry.submission, false) : "") + (parts.length ? P.p(parts.join(" · ")) : "") + record;
      return a.K.section({ title: entry.assessment.title, level: 2, body: content || P.p("No grading details yet") });
    });
    return P.stack(a, [P.bareHandoff(a), a.K.section({ title: person.person.name, level: 2, body: P.p("Work and grades") }), P.links(a, navigation), P.stack(a, items)]);
  }

  function instructor(a) {
    if (a.selection && a.selection.learnerId) return studentRecord(a, a.selection.learnerId);
    var all = team(a), e = selectedTask(a);
    var plan = e ? P.recordGo("W57", "task", e.task.id) : null;
    var full = a.tier === "full";
    var canRevoke = Boolean(e && a.sel.isBefore(a.view.clock, e.task.access_end));
    var members = all && all.members.length ? a.K.list({ label: "Teaching team", items: all.members.map(function (m) {
      return { title: m.person.name, meta: m.tasks.length ? m.tasks.map(function (task) { var it = a.sel.assessment(a.view, task.assessment_id); var active = a.sel.isBefore(a.view.clock, task.access_end); var qs = active ? a.sel.teachingTaskQuestions(a.view, a.who, task) : []; return (it ? it.title : "Assignment") + (qs.length ? " · " + P.questionsText(qs.map(function (q) { return q.id; })) : "") + (active ? " · access ends " : " · Access ended ") + P.when(a, task.access_end); }).join("; ") : "No grading tasks" };
    }) }) : a.K.empty({ title: "No teaching assistants enrolled" });
    return P.stack(a, [
      P.handoff(a, { title: "Open on a larger screen", protectiveActions: canRevoke ? actions(a) : [] }),
      a.state === "offline" ? P.offlineNotice(a) : "", members, e ? scopeView(a) : "",
      full ? a.K.actions(a.ctx, (canRevoke ? actions(a) : []).concat([{ label: "Invite staff", note: PREVIEW }])) : "",
      a.K.empty({ title: "No pending invitations" }), roster(a),
      plan ? P.links(a, [{ label: "Grading plan", go: plan }]) : "",
    ]);
  }

  function body(a) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (!member(a)) return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a, "You are not teaching this course")]);
    if (a.state === "firstUseEmpty") return rosterDelayed(a);
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "course people")]);
    if (a.role === "ta") return P.stack(a, [P.bareHandoff(a), a.K.flag("readOnly"), P.p("Only the instructor changes staff access"), scopeView(a)]);
    return instructor(a);
  }

  WB.definePage("W45", {
    states: STATES,
    na: P.na(STATES, {
      invalid: "Invitations and end dates are preview-only, so no typed value is checked",
      saving: "Access changes are preview-only in this prototype",
      saveFailed: "Access changes are preview-only in this prototype",
      conflict: "No other staff edit of course access is recorded",
    }),
    render: function (a) {
      var out = { title: "Course people", body: body(a) };
      var quiet = ["offline", "loading", "firstUseEmpty"].indexOf(a.state) >= 0;
      if (a.role === "instructor" && member(a) && !quiet && !(a.selection && a.selection.learnerId) && tasks(a).some(function (e) { return a.sel.isBefore(a.view.clock, e.task.access_end); }) && !P.staffGate(a, null)) out.dialog = dialog(a);
      return P.shell(a, out, { page: "W45" });
    },
  });
})(globalThis);
