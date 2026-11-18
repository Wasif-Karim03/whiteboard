/* W46 Learner allowances (Phase 3 seg5). Anchor: the student persona's Quiz 3 allowance. The instructor sees the
   record, including the instructor-only basis (DD-5.10); ending it is a destructive dialog with a preview-only
   primary. A TA sees only the effective time, and only for a learner in an active task (A6). */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "firstUseEmpty", "invalid", "destructive", "offline", "permissionUnavailable"];
  var PREVIEW = "Preview only: nothing changes in this prototype";

  // R01: the frame role alone is not membership. The viewer must hold that role in the quiz's course before any
  // allowance field is read.
  function member(a, quizId) {
    var item = a.sel.assessment(a.view, quizId);
    return Boolean(item) && a.sel.verifiedRole(a.view, a.who, item.course_id) === a.role;
  }
  function ctx(a) {
    var quizId = a.sel.anchorFor("W41").record.id;
    var learner = P.learnerId(a);
    var ok = member(a, quizId);
    var al = ok ? a.sel.allowanceFor(a.view, quizId, learner) : null;
    return { quizId: quizId, learner: learner, member: ok, al: al && al.id === a.sel.anchorFor("W46").record.id ? al : null };
  }
  function denied(a) { return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a, "You are not teaching this course")]); }
  function minutes(a, c) { return a.sel.effectiveMinutes(a.view, c.quizId, c.learner) + " minutes"; }

  function record(a, c) {
    var q = a.sel.quiz(a.view, a.sel.assessment(a.view, c.quizId).quiz_id);
    return a.K.kv([
      { label: "Learner", value: P.personName(a, c.learner) }, { label: "Quiz", value: q.title },
      { label: "Quiz time", value: q.minutes + " minutes" },
      c.al.timer_mode === "multiplier" ? { label: "Time multiplier", value: c.al.multiplier + "×" } : { label: "Extra time", value: c.al.extra_minutes + " minutes" },
      { label: "Effective time", value: minutes(a, c) },
      { label: "Latest start for full time", value: P.when(a, a.sel.lateStartThreshold(a.view, c.quizId, c.learner)) },
      { label: "Quiz closes", value: P.when(a, q.close) }, { label: "Recorded by", value: P.personName(a, c.al.recorded_by) },
      { label: "Note", value: c.al.note }, { label: "Basis reference (instructor only)", value: c.al.basis_reference_instructor_only },
    ]);
  }
  function endAction(a) {
    if (a.state === "offline") return { label: "End allowance", disabled: true, reason: "You're offline. Nothing is changed", id: P.id(a, "end-off") };
    return { label: "End allowance", act: "open-dialog", target: P.id(a, "end") };
  }
  function pending(a) {
    return P.stack(a, [a.K.empty({ title: "No pending requests" }), P.p("A request changes nothing until the instructor decides it")]);
  }
  function editor(a) {
    var bad = a.state === "invalid";
    return P.stack(a, [
      a.K.field({ id: P.id(a, "extra"), label: "Extra minutes", type: "number" }),
      a.K.field({ id: P.id(a, "mult"), label: "Time multiplier", type: "number", error: bad ? "Use extra minutes or a multiplier, not both" : undefined }),
      bad ? a.K.button({ label: "Save allowance", disabled: true, reason: "Fix the allowance first", id: P.id(a, "save") }) : a.K.button({ label: "Replace allowance", note: PREVIEW }),
    ]);
  }

  function instructor(a, c) {
    var go = P.recordGo("W41", "assessment", c.quizId);
    var link = go ? P.links(a, [{ label: "Quiz settings", go: go }]) : "";
    if (!c.al || a.state === "firstUseEmpty") return P.stack(a, [P.bareHandoff(a), a.K.empty({ title: "No allowance recorded for this learner" }), pending(a), link]);
    var full = a.tier === "full";
    return P.stack(a, [
      P.handoff(a, { title: "Open on a larger screen", protectiveActions: [endAction(a)] }),
      a.state === "offline" ? P.offlineNotice(a) : "", record(a, c),
      full ? editor(a) : "", full ? a.K.actions(a.ctx, [endAction(a)]) : "", pending(a), link,
    ]);
  }
  function ta(a, c) {
    var acc = a.sel.taTaskAccess(a.view, c.quizId, a.who);
    var s = acc.active ? a.sel.taScope(a.view, c.quizId, a.who) : null;
    var line = s && c.al && s.learnerIds.indexOf(c.learner) >= 0 ? P.p("Effective time: " + minutes(a, c))
      : a.K.notice({ tone: "info", title: "This learner's timing is outside your grading tasks" });
    return P.stack(a, [P.bareHandoff(a), a.K.flag("readOnly"), line]);
  }

  function body(a, c) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (!c.member) return denied(a);
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "allowances")]);
    return a.role === "ta" ? ta(a, c) : instructor(a, c);
  }

  WB.definePage("W46", {
    states: STATES,
    na: P.na(STATES, {
      saving: "Allowance changes are preview-only in this prototype",
      saveFailed: "Allowance changes are preview-only in this prototype",
      conflict: "No other staff edit of this allowance is recorded",
    }),
    render: function (a) {
      var c = ctx(a);
      var out = { title: "Learner allowances", body: body(a, c) };
      var ok = a.role === "instructor" && c.member && c.al && !P.staffGate(a, null) && ["loading", "offline", "firstUseEmpty"].indexOf(a.state) < 0;
      if (ok) {
        out.dialog = a.K.dialog(a.ctx, {
          id: P.id(a, "end"), kind: "destructive", title: "End allowance", open: a.state === "destructive",
          body: P.p("End " + P.personName(a, c.learner) + "'s extra time.") + P.p("Attempts already received keep their timing"),
          actions: [{ label: "End allowance", id: P.id(a, "end-go"), note: PREVIEW }],
        });
      }
      return P.shell(a, out, { page: "W46" });
    },
  });
})(globalThis);
