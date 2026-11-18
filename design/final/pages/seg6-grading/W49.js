/* W49 Grader (Phase 3 spine). Instructor and TA. Anchor: the persona's problem-set receipt; variants ben (no review
   yet) and group (the group receipt at its home clock). Marks and comments come from gradeDraftFor; a partial TA task
   limits pages, tags, criteria and comments to its questions (R01). Nothing is released from here. Mark bounds are
   help text (kit request 3); the page viewer is listed as text (kit request 2). Contract: pages/SPINE.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["permissionUnavailable", "conflict", "loading", "invalid", "saving", "saveFailed", "offline"];
  var OUTSIDE = "Other questions are outside your grading task";

  function isGroup(a) { var r = a.selection && a.selection.receiptId ? P.receiptById(a, a.selection.receiptId) : null; return r ? Boolean(r.group_id) : a.variant === "group"; }
  function itemId(a) { if (a.selection && a.selection.assessmentId) return a.selection.assessmentId; return a.sel.anchorFor("W19", isGroup(a) ? "motion" : null).record.id; }
  function receipt(a) {
    if (a.selection) {
      if (a.selection.receiptId) return P.receiptById(a, a.selection.receiptId);
      return a.sel.receiptsFor(a.view, itemId(a), a.who).filter(function (r) { return (r.captured_members || [r.owner_id]).indexOf(a.selection.learnerId) >= 0; }).slice().sort(function (x, y) { return y.attempt - x.attempt; })[0] || null;
    }
    return P.receiptById(a, a.sel.anchorFor("W49", a.variant).record.id);
  }
  function has(o, k) { return Boolean(o) && Object.prototype.hasOwnProperty.call(o, k); }

  // The question ids this viewer may see: null means all of them (instructor or a whole-assessment task).
  function keep(a, it) {
    if (a.role !== "ta") return null;
    var s = a.sel.taScope(a.view, it.id, a.who);
    return s && !s.allQuestions ? s.questionIds : null;
  }

  function criteria(a, it, kept) {
    var rubric = a.sel.rubricFor(a.view, it.id, a.who);
    var list = rubric && rubric.criteria ? rubric.criteria : [];
    return kept ? list.filter(function (c) { return kept.indexOf(c.question_id) >= 0; }) : list;
  }

  function ownerName(a, it, r) {
    if (!r.group_id) return P.personName(a, r.owner_id);
    return a.sel.receiptGroupLabel(a.view, a.who, r.id) || r.group_id;
  }

  function submissionPane(a, it, r, kept) {
    var rows = [{ label: "Learner", value: ownerName(a, it, r) }, { label: "Receipt", value: r.id }, { label: "Accepted", value: P.when(a, r.accepted_at) }];
    r.files.forEach(function (f) { rows.push({ label: f.name, value: P.fileMeta(a, f) }); });
    if (r.captured_members) rows.push({ label: "Members", value: r.captured_members.map(function (m) { return P.personName(a, m); }).join(", ") });
    var answers = a.sel.teachingQuizAnswers(a.view, a.who, r.id);
    var answerBlock = answers.length ? a.K.section({ title: "Submitted answers", body: a.K.kv(answers.map(function (answer) { return { label: "Question " + answer.item_id, value: String(answer.value) }; })), level: 2 }) : "";
    var tags = P.tagRows(r.page_tags, kept);
    var tagged = tags.length ? a.K.section({ title: "Pages and questions", body: a.K.kv(tags), level: 2 }) : "";
    return P.stack(a, [a.K.kv(rows), answerBlock, tagged, P.p("The page viewer is not drawn in this prototype.")]);
  }

  function draftOf(a, r) {
    var d = r.group_id ? null : a.sel.gradeDraftFor(a.view, r.owner_id, r.assessment_id, a.who);
    return d && d.receipt_id === r.id ? d : null;
  }

  function readOnlyReason(a) {
    if (a.state === "offline") return "You're offline. Marks cannot be saved";
    return a.state === "saving" ? "Already saving" : null;
  }

  function criterionBlock(a, c, draft, first) {
    var lock = readOnlyReason(a);
    var mark = a.K.field({
      id: P.id(a, "q-" + c.question_id), label: "Mark for question " + c.question_id, type: "number", min: 0, max: c.max, step: 1, help: "0 to " + c.max,
      value: draft && has(draft.marks, c.question_id) ? draft.marks[c.question_id] : undefined,
      error: first && a.state === "invalid" ? "Enter a mark from 0 to " + c.max : undefined, disabled: Boolean(lock), reason: lock || undefined,
    });
    var note = a.K.field({
      id: P.id(a, "c-" + c.question_id), label: "Comment for question " + c.question_id, type: "textarea",
      value: draft && has(draft.comments, c.question_id) ? draft.comments[c.question_id] : undefined, disabled: Boolean(lock), reason: lock || undefined,
    });
    return a.K.section({ title: "Question " + c.question_id + ": " + c.title + " (" + c.max + " points)", body: mark + note, level: 2 });
  }

  // R16: what the learner sees right now, from the released projection.
  function visibility(a, r) {
    if (r.group_id) return P.p("Graded is not released. The learner sees nothing until the instructor releases it");
    if (a.selection) {
      var list = a.sel.releasesFor(a.view, r.assessment_id, a.who) || [];
      var exact = list.some(function (rel) { return rel.entries.some(function (entry) { return entry.person_id === r.owner_id && entry.receipt_id === r.id; }); });
      if (!exact) return P.p("No released feedback is linked to this attempt. Other attempts may have a released result.");
    }
    var res = a.sel.resultFor(a.view, r.owner_id, r.assessment_id, a.who);
    if (!res || res.status === null) return P.p("Graded is not released. The learner sees nothing until the instructor releases it");
    if (!res.staffOutcome) return P.p("Released " + P.when(a, res.releasedAt) + ". The learner sees this version");
    return P.p("The learner still sees the released version from " + P.when(a, res.releasedAt) + ". This change is held until released");
  }

  // SPINE-12: the release link goes only to the W53 destination for this receipt's assessment; none means no link.
  function releaseLink(a, r) {
    var go = a.selection ? WB.Teaching.go(a, "W53", { assessmentId: r.assessment_id, receiptId: null, learnerId: null }) : P.recordGo("W53", "assessment", r.assessment_id);
    return go ? P.links(a, [{ label: "Go to release", go: go }]) : "";
  }

  // J03: only an instructor may preview changes to the rubric belonging to this receipt.
  function rubricLink(a, r) {
    if (a.role !== "instructor") return "";
    var rubric = a.sel.rubricFor(a.view, r.assessment_id, a.who);
    var go = rubric ? P.recordGo("W50", "rubric", rubric.id) : null;
    return go ? P.links(a, [{ label: "Preview rubric-change impact", go: go }]) : "";
  }

  function saveState(a) {
    var map = { conflict: "conflict", saveFailed: "failed", saving: "saving", offline: "savedLocal" };
    return a.K.saveStatus(has(map, a.state) ? map[a.state] : "saved");
  }

  function saveReason(a) {
    return readOnlyReason(a) || (a.state === "invalid" ? "Fix the mark first" : a.state === "conflict" ? "Resolve the competing review first" : null);
  }

  // SPINE-07: completion needs a saved draft with a mark for every question in scope, separate from saving.
  function completeReason(a, draft, list) {
    var reason = saveReason(a) || (a.state === "saveFailed" ? "Save the marks first" : null);
    if (reason) return reason;
    var unmarked = list.filter(function (c) { return !draft || !has(draft.marks, c.question_id); });
    return !draft || unmarked.length ? "Enter a mark for every question first" : null;
  }

  function saveButtons(a, draft, list) {
    var note = "Preview only: nothing is saved in this prototype";
    var reason = saveReason(a);
    var save = reason ? a.K.button({ label: "Save marks", disabled: true, reason: reason, id: P.id(a, "save") }) : a.K.button({ label: "Save marks", kind: "primary", note: note });
    var done = completeReason(a, draft, list);
    var complete = done ? a.K.button({ label: "Mark review complete", disabled: true, reason: done, id: P.id(a, "complete") }) : a.K.button({ label: "Mark review complete", note: note });
    return a.K.stack(a.ctx, { items: [save, complete], gap: "sm" });
  }

  function summary(a, r, draft, partial) {
    var bits = [];
    if (!draft) bits.push(P.p("Not reviewed yet"));
    if (partial) bits.push(P.p(OUTSIDE));
    if (draft && !partial && draft.total) bits.push(a.K.kv([{ label: "Total", value: P.score(draft.total.score, draft.total.max) }]));
    if (draft && draft.reviewer_id) bits.push(P.p("Reviewed by " + P.personName(a, draft.reviewer_id) + (draft.reviewed_at ? ", " + P.when(a, draft.reviewed_at) : "")));
    var sub = r.group_id ? null : a.sel.submissionFor(a.view, r.owner_id, r.assessment_id);
    if (sub && (!sub.receipt_id || sub.receipt_id === r.id)) bits.push(P.status(a, sub, false));
    return P.stack(a, bits);
  }

  // A TA task that does not cover every question: totals and the overall comment stay hidden (R01).
  function isPartial(a, r, draft, kept) {
    var res = r.group_id ? null : a.sel.resultFor(a.view, r.owner_id, r.assessment_id, a.who);
    return Boolean(kept) || Boolean(draft && draft.partial) || Boolean(res && res.scoreWithheld);
  }

  function markingPane(a, it, r, kept) {
    var draft = draftOf(a, r);
    var partial = isPartial(a, r, draft, kept);
    var list = criteria(a, it, kept);
    var blocks = list.map(function (c, i) { return criterionBlock(a, c, draft, i === 0); });
    var lock = readOnlyReason(a);
    var overall = partial ? "" : a.K.field({
      id: P.id(a, "overall"), label: "Overall comment", type: "textarea", value: draft ? draft.overall_comment : undefined, disabled: Boolean(lock), reason: lock || undefined,
    });
    var release = a.role === "instructor" ? releaseLink(a, r) : P.p("Releasing feedback is the instructor's step");
    return P.stack(a, [saveState(a), summary(a, r, draft, partial)].concat(blocks).concat([overall, saveButtons(a, draft, list), visibility(a, r), release]));
  }

  // SPINE-03: resolving writes the review, so it is offered only on the full tier; review tiers keep Compare.
  function conflictButtons(a) {
    var note = "Preview only: nothing changes in this prototype";
    var compare = a.K.button({ label: "Compare", note: note });
    if (a.role !== "instructor") return [compare, a.K.button({ label: "Ask the instructor to resolve", note: note })];
    if (a.tier !== "full") return [compare];
    return [a.K.button({ label: "Keep mine", note: note }), a.K.button({ label: "Use theirs", note: note }), compare];
  }

  function conflictNotice(a) {
    var s = a.sel.failureSample(a.view, "score-conflict", a.who);
    var rec = receipt(a);
    if (!s || !rec || s.assessment_id !== rec.assessment_id || s.person_id !== rec.owner_id) return a.K.notice({ tone: "warning", title: "This review has a conflicting revision", body: P.p("No saved conflict example is recorded for this submission. Keep the current version until the conflict is resolved.") });
    var body = P.p("Question " + s.question_id + ": " + P.personName(a, s.mine.reviewer_id) + " saved " + s.mine.score + " at " + P.when(a, s.mine.savedAt) + ". " +
      P.personName(a, s.theirs.reviewer_id) + " saved " + s.theirs.score + " at " + P.when(a, s.theirs.savedAt) + " (revision " + s.theirs.revision + ").");
    var buttons = conflictButtons(a);
    var extra = a.role === "instructor" ? "" : P.p("Only the instructor can resolve a competing review");
    return a.K.notice({ tone: "warning", title: "Someone else changed this review", body: body + extra + a.K.stack(a.ctx, { items: buttons, gap: "sm" }) });
  }

  function saveFailedNotice(a) {
    var title = "Marks were not saved";
    if (a.tier !== "full") return a.K.notice({ tone: "error", title: title, body: P.p("Open the grader on a larger screen to save them again.") });
    return a.K.notice({ tone: "error", title: title, body: P.p("Your marks are still on this page."), actions: [{ label: "Retry save", note: "Preview only: nothing is saved in this prototype" }] });
  }

  function stateNotice(a) {
    if (a.state === "conflict") return conflictNotice(a);
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown")]);
    if (a.state === "saveFailed") return saveFailedNotice(a);
    return "";
  }

  function full(a, it, r) {
    var kept = keep(a, it);
    var list = submissionPane(a, it, r, kept);
    var detail = markingPane(a, it, r, kept);
    var layout = a.ctx.sizeClass === "regular"
      ? a.K.split(a.ctx, { id: P.id(a, "grader"), listLabel: "Submission", detailLabel: "Marking", list: list, detail: detail })
      : P.stack(a, [a.K.section({ title: "Submission", body: list, level: 2 }), a.K.section({ title: "Marking", body: detail, level: 2 })]);
    return P.stack(a, [stateNotice(a), layout]);
  }

  // SPINE-04: the summary and overall comment for viewers who see every question; a partial task sees neither.
  function readOnlySummary(a, r, draft, kept) {
    var partial = isPartial(a, r, draft, kept);
    var overall = !partial && draft && draft.overall_comment ? a.K.kv([{ label: "Overall comment", value: draft.overall_comment }]) : "";
    return P.stack(a, [summary(a, r, draft, partial), overall]);
  }

  function readOnlyMarks(a, it, r, kept) {
    var draft = draftOf(a, r);
    var rows = criteria(a, it, kept).map(function (c) {
      var mark = draft && has(draft.marks, c.question_id) ? P.score(draft.marks[c.question_id], c.max) : "Not marked";
      var note = draft && has(draft.comments, c.question_id) ? " · " + draft.comments[c.question_id] : "";
      return { label: "Question " + c.question_id + ": " + c.title, value: mark + note };
    });
    return rows.length ? a.K.kv(rows) : P.p("Not reviewed yet");
  }

  function review(a, it, r) {
    var kept = keep(a, it);
    var note = "Preview only: nothing changes in this prototype";
    var protect = [{ label: "Flag for instructor review", note: note }];
    if (a.role === "instructor") protect.push({ label: "Hold this result", note: note });
    var handoff = P.handoff(a, { title: "Open on a larger screen", protectiveActions: protect });
    var release = a.role === "instructor" ? releaseLink(a, r) : "";
    var marks = P.stack(a, [readOnlySummary(a, r, draftOf(a, r), kept), readOnlyMarks(a, it, r, kept)]);
    return P.stack(a, [handoff, stateNotice(a), submissionPane(a, it, r, kept), marks, visibility(a, r), release]);
  }

  function missing(a) {
    if (!isGroup(a)) return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a)]);
    var empty = a.K.empty({ title: "No group receipt at this time", body: P.p("The group has not handed in yet at this point.") });
    return P.stack(a, [P.bareHandoff(a), empty, P.offHome(a, "The group receipt arrives later in the prototype")]);
  }

  function body(a, it) {
    var gate = P.staffGate(a, it.id);
    if (gate) return gate;
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "the submission")]);
    var r = receipt(a);
    if (!r) return a.selection && a.selection.learnerId ? WB.Teaching.gradeRecord(a, it, a.selection.learnerId) : missing(a);
    return P.stack(a, [WB.Teaching.attempts(a, r), a.tier === "full" ? full(a, it, r) : review(a, it, r), WB.Teaching.feedback(a, it, r), rubricLink(a, r)]);
  }

  WB.definePage("W49", {
    states: STATES,
    na: P.na(STATES, { firstUseEmpty: "The grader opens one submission; an empty queue is drawn on the grading queue" }),
    variants: { ben: WB.manifest.anchors.W49.variants.ben.label, group: WB.manifest.anchors.W49.variants.group.label },
    render: function (a) {
      var it = a.sel.assessment(a.view, itemId(a));
      return P.shell(a, { title: "Grade: " + it.title, body: body(a, it), back: { label: "Grading queue", go: a.selection ? WB.Teaching.go(a, "W48", { learnerId: null, receiptId: null }) : "W48" } }, { page: "W48" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
