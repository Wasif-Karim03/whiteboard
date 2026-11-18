/* W19 Assignment detail (Phase 3 spine). Anchor: the problem-set assessment; variant motion (group work). Facts come from
   the assessment record and its rubric; the student rail picks one next action from the clock (draft, receipt,
   release, closed). Staff see facts only, with the TA access branches of R12. Contract: pages/SPINE.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "offline", "notYetAvailable", "permissionUnavailable"];

  function item(a) { return a.sel.assessment(a.view, P.assessmentId(a)); }

  function facts(a, it, essential) {
    var rows = [
      it.opens ? { label: "Opens", value: P.when(a, it.opens) } : null,
      it.due ? { label: "Due", value: P.when(a, it.due) } : null,
      it.close ? { label: "Closes", value: P.when(a, it.close) } : null,
      it.max !== undefined ? { label: "Points", value: String(it.max) } : null,
      it.max_attempts ? { label: "Attempts allowed", value: String(it.max_attempts) } : null,
      P.lateRuleText(it) ? { label: "Late work", value: P.lateRuleText(it) } : null,
      P.fileRuleText(it.sample_file_rule) ? { label: "Files", value: P.fileRuleText(it.sample_file_rule) } : null,
    ].filter(Boolean);
    rows = rows.filter(function (row) { var key = row.label === "Due" || row.label === "Closes" || row.label === "Points"; return essential ? key : !key; });
    return rows.length ? a.K.kv(rows) : "";
  }

  function rubric(a, it) {
    var r = a.sel.rubricFor(a.view, it.id, a.who);
    if (!r || !r.criteria || !r.criteria.length) return "";
    var rows = r.criteria.map(function (c) { return { label: "Question " + c.question_id + ": " + c.title, value: c.max + " points" }; });
    return a.K.section({ title: "Rubric", body: a.K.kv(rows), level: 2 });
  }

  function mainPart(a, it) {
    return P.stack(a, [it.body ? P.p(it.body) : "", a.K.disclosure({ id: P.id(a, "assignment-details"), summary: "Submission details and rubric", body: P.stack(a, [facts(a, it, false), rubric(a, it)]) })]);
  }

  function released(a, it) {
    var res = a.sel.resultFor(a.view, a.who.personId, it.id, a.who);
    return Boolean(res) && res.status !== null;
  }

  function trail(a, it, draft, receipt) {
    var out = released(a, it);
    var st = function (done, current) { return done ? "done" : current ? "current" : "todo"; };
    return a.K.trail({
      label: "Your progress on this assignment",
      steps: [
        { label: "Add work", state: st(Boolean(draft || receipt), !draft && !receipt) },
        { label: "Review", state: st(Boolean(receipt), Boolean(draft) && !receipt) },
        { label: "Receipt", state: st(Boolean(receipt), false) },
        { label: "Feedback", state: st(out, Boolean(receipt) && !out) },
      ],
    });
  }

  function nextAction(a, it, draft, receipt) {
    if (it.submission_mode === "none") return a.K.notice({ tone: "info", title: "No hand-in required", body: P.p("Use this practice to prepare. It does not contribute to your course grade.") });
    var sfx = P.suffix(a);
    if (released(a, it) && !sfx) return a.K.actions(a.ctx, [{ label: "View feedback", go: "W23", kind: "primary" }]);
    if (receipt) return a.K.actions(a.ctx, [{ label: "View receipt", go: a.selection ? WB.Teaching.go(a, "W22", { assessmentId: it.id, receiptId: receipt.id, learnerId: null }) : P.recordGo("W22", "receipt", receipt.id) || "W22", kind: "primary" }]);
    if (P.closed(a, it)) {
      var view = draft ? { label: "View your draft", go: "W20" + sfx } : null;
      return P.stack(a, [P.closedButton(a, it, "submit"), P.links(a, [view, { label: "Ask for help with a closed assignment", go: "W12" }])]);
    }
    if (draft) return a.K.actions(a.ctx, [{ label: "Continue work", go: "W20" + sfx, kind: "primary" }, { label: "Review and submit", go: "W21" + sfx }]);
    if (!P.recordGo("W19", "assessment", it.id)) return a.K.button({ label: "Add work", disabled: true, reason: "A hand-in flow is not modeled for this assignment", id: P.id(a, "unmodeled-submit") });
    return a.K.actions(a.ctx, [{ label: "Add work", go: "W20" + sfx, kind: "primary" }]);
  }

  function groupPart(a, it) {
    var g = a.sel.groupFor(a.view, a.who.personId, it.group_set_id);
    if (!g) return { html: a.K.notice({ tone: "info", title: "You are not in a group for this assignment", body: P.p("Ask the instructor to add you to a group.") }), ok: false };
    var names = g.members.map(function (m) { return P.personName(a, m); }).filter(Boolean).join(", ");
    return { html: a.K.kv([{ label: "Group", value: g.name }, { label: "Members", value: names }]) + P.links(a, [{ label: "Group workspace", go: "W34" }]), ok: true };
  }

  function studentRail(a, it) {
    var draft = P.draftOf(a);
    var receipt = P.receiptOf(a);
    var group = P.suffix(a) ? groupPart(a, it) : { html: "", ok: true };
    var action = group.ok ? nextAction(a, it, draft, receipt) : "";
    return P.stack(a, [P.status(a, P.ownSubmission(a, it.id), true), group.html, action, trail(a, it, draft, receipt)]);
  }

  function staffRail(a, it) {
    if (P.taEnded(a)) return P.taEndedNotice(a, it.id);
    if (P.taTaskEnded(a, it.id)) return P.taTaskEndedNotice(a, it.id);
    if (P.taUnallocated(a, it.id)) return P.unallocatedNotice(a);
    if (a.role === "ta") {
      var access = a.sel.taTaskAccess(a.view, it.id, a.who);
      if (!access.active || !a.sel.taScope(a.view, it.id, a.who)) return P.unallocatedNotice(a);
    }
    var queue = a.role === "instructor" && a.selection ? WB.Teaching.go(a, "W48", { assessmentId: it.id, receiptId: null, learnerId: null }) : P.recordGo("W48", "assessment", it.id);
    var edit = a.role === "instructor" ? a.selection ? WB.Teaching.go(a, "W40", { assessmentId: it.id, receiptId: null, learnerId: null }) : P.recordGo("W40", "assessment", it.id) : null;
    return P.stack(a, [P.links(a, [edit ? { label: "Edit assignment", go: edit } : null, queue ? { label: "Grading queue", go: queue } : null]),
      queue ? "" : P.p("The grading queue for this assignment is not drawn in this prototype")]);
  }

  function content(a, it) {
    var rail = a.role === "student" ? studentRail(a, it) : staffRail(a, it);
    return P.stack(a, [facts(a, it, true), rail, mainPart(a, it)]);
  }

  function notYet(a, it) {
    var body = it.opens ? P.p("Opens " + P.when(a, it.opens) + ". You can read the facts now; adding work starts then.") : P.p("This assignment is not open yet.");
    var access = P.taEnded(a) ? P.taEndedNotice(a, it.id) : P.taTaskEnded(a, it.id) ? P.taTaskEndedNotice(a, it.id) : P.taUnallocated(a, it.id) ? P.unallocatedNotice(a) : "";
    return P.stack(a, [access, a.K.notice({ tone: "info", title: "This assignment opens later", body: body }), facts(a, it, true), mainPart(a, it)]);
  }

  function body(a, it) {
    if (a.state === "permissionUnavailable") return P.permissionNotice(a, "This assignment is not available for your course role");
    if (a.state === "loading") return P.stack(a, [P.taTaskEnded(a, it.id) ? P.taTaskEndedNotice(a, it.id) : "", P.loading(a, "the assignment")]);
    if (a.state === "notYetAvailable") return notYet(a, it);
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown"), content(a, it)]);
    return content(a, it);
  }

  WB.definePage("W19", {
    states: STATES,
    na: P.na(STATES, { firstUseEmpty: "An assignment page always has its assignment; an empty course is drawn on the coursework list" }),
    variants: { motion: WB.manifest.anchors.W19.variants.motion.label },
    render: function (a) {
      var it = item(a);
      var gate = P.publicationGate(a, it);
      if (gate) return gate;
      return P.shell(a, { title: it.title, body: body(a, it), crumbs: [{ label: "Coursework", go: "W18" }] }, { section: "coursework" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
