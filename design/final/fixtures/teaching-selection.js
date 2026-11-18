/* Source: instructor-workspace-plan-2026-11-17.md; chosen by Codex under owner delegation.
   Explicit teaching record selection. IDs select records, never a person to impersonate. */
(function (root) {
  "use strict";
  var W = root.WB, S = W.sel;
  W.defineFrozen(S, "teachingAssessmentIntent", function (view, who, assessmentId) {
    var item = S.assessment(view, assessmentId);
    if (!item || !S.verifiedRole(view, who, item.course_id) || item.course_id !== who.courseId) return null;
    if (item.grading_intent === "ungraded") return "Ungraded practice";
    var policy = S.gradingPolicy(view, who.courseId, who);
    var ids = policy ? policy.categories.reduce(function (out, c) { return out.concat(c.items); }, []) : [];
    return ids.indexOf(item.id) >= 0 && view.data.grades.grade_items.some(function (g) { return g.id === item.id; }) ? "Included in gradebook" : "Gradebook setup needed";
  });
  W.defineFrozen(S, "teachingQuizAnswers", function (view, who, receiptId) {
    var r = S.receiptById(view, receiptId, who);
    var item = r ? S.assessment(view, r.assessment_id) : null;
    if (!item || !item.quiz_id || (who.role !== "instructor" && who.role !== "ta")) return [];
    var scope = who.role === "ta" ? S.taScope(view, item.id, who) : null;
    if (who.role === "ta" && (!scope || scope.learnerIds.indexOf(r.owner_id) < 0)) return [];
    var attempt = view.data.quiz.attempts.filter(function (t) { return t.receipt_id === r.id && t.person_id === r.owner_id && t.quiz_id === item.quiz_id && t.received_at && !S.isBefore(view.clock, t.received_at); })[0];
    return W.deepFreeze((attempt ? attempt.answers : []).filter(function (answer) { return answer.acknowledged_at && !S.isBefore(view.clock, answer.acknowledged_at) && (!scope || scope.allQuestions || scope.questionIds.indexOf(answer.item_id) >= 0); }));
  });
  W.defineFrozen(S, "receiptGroupLabel", function (view, who, receiptId) {
    var receipt = S.receiptById(view, receiptId, who);
    if (!receipt || !receipt.group_id) return null;
    var groups = view.data.groups.group_sets.filter(function (set) { return set.course_id === receipt.course_id; }).reduce(function (all, set) { return all.concat(set.groups); }, []);
    var group = groups.filter(function (g) { return g.id === receipt.group_id; })[0];
    return group ? group.name : receipt.group_id;
  });
  W.defineFrozen(S, "quizAttemptForReceipt", function (view, receiptId, who) {
    var receipt = S.receiptById(view, receiptId, who);
    var item = receipt ? S.assessment(view, receipt.assessment_id) : null;
    if (!item || !item.quiz_id || (who.courseId && who.courseId !== receipt.course_id)) return null;
    var found = view.data.quiz.attempts.filter(function (t) { return t.receipt_id === receipt.id && t.person_id === receipt.owner_id && t.quiz_id === item.quiz_id && t.received_at && !S.isBefore(view.clock, t.received_at); })[0];
    if (!found) return null;
    var scope = who.role === "ta" ? S.taScope(view, item.id, who) : null;
    if (who.role === "ta" && !scope) return null;
    var out = Object.assign({}, found);
    out.answers = found.answers.filter(function (answer) { return answer.acknowledged_at && !S.isBefore(view.clock, answer.acknowledged_at) && (!scope || scope.allQuestions || scope.questionIds.indexOf(answer.item_id) >= 0); });
    return W.deepFreeze(out);
  });
  W.defineFrozen(S, "staffingExampleCourse", function (view, who) {
    var courseId = view.data.world.personas.ta.course_id;
    return who && S.verifiedRole(view, who, courseId) === "instructor" && S.enrolled(view, courseId, "ta").length ? courseId : null;
  });
  W.defineFrozen(S, "soloTeachingCourse", function (view, who) {
    var enrollment = view.data.world.enrollments.filter(function (e) { return who && e.person_id === who.personId && e.role === "instructor"; })[0];
    return enrollment && enrollment.course_ids.filter(function (id) { return S.enrolled(view, id, "ta").length === 0; })[0] || null;
  });
  W.defineFrozen(S, "resolveTeachingSelection", function (view, role, raw, page, variant) {
    if (!raw) return null;
    if (Object.keys(raw).some(function (key) { return ["courseId", "assessmentId", "learnerId", "receiptId"].indexOf(key) < 0 || typeof raw[key] !== "string" || !/^[A-Za-z0-9_-]+$/.test(raw[key]); })) return { allowed: false };
    var anchorVariant = variant === "motion-reviewed" ? "motion" : ["confirm", "reviewed", "acknowledged"].indexOf(variant) >= 0 ? null : variant;
    var persona = view.data.world.personas[role];
    if (!persona || (role !== "instructor" && role !== "ta" && role !== "student")) return { allowed: false };
    var who = { role: role, personId: persona.person_id, courseId: raw.courseId || persona.course_id };
    if (!S.verifiedRole(view, who, who.courseId)) return { allowed: false };
    var out = { courseId: who.courseId, assessmentId: raw.assessmentId || null, learnerId: raw.learnerId || null, receiptId: raw.receiptId || null };
    if (out.learnerId && (role === "student" ? out.learnerId !== who.personId : !S.teachingLearners(view, who).some(function (p) { return p.id === out.learnerId; }))) return { allowed: false };
    if (page === "W53" && (out.receiptId || out.learnerId)) return { allowed: false };
    var receipt = out.receiptId ? S.receiptById(view, out.receiptId, who) : null;
    if (out.receiptId && (!receipt || receipt.course_id !== who.courseId)) return { allowed: false };
    if (receipt) {
      if (out.assessmentId && out.assessmentId !== receipt.assessment_id) return { allowed: false };
      if (out.learnerId && (receipt.captured_members || [receipt.owner_id]).indexOf(out.learnerId) < 0) return { allowed: false };
      out.assessmentId = receipt.assessment_id;
      if (receipt.owner_id && !out.learnerId) out.learnerId = receipt.owner_id;
    }
    var itemPages = ["W19", "W22", "W23", "W25", "W27", "W40", "W41", "W48", "W49", "W53"];
    if (!out.assessmentId && itemPages.indexOf(page) >= 0) {
      var recordAnchor = S.anchorFor(page, anchorVariant);
      var anchoredReceipt = recordAnchor && recordAnchor.record.type === "receipt" ? S.receiptById(view, recordAnchor.record.id, who) : null;
      var defaultPage = ["W49", "W23", "W22"].indexOf(page) >= 0 ? "W19" : page === "W27" ? "W25" : page;
      var defaultVariant = anchorVariant === "group" && defaultPage === "W19" ? "motion" : anchorVariant;
      var legacy = S.anchorFor(defaultPage, defaultVariant);
      var candidate = anchoredReceipt ? S.assessment(view, anchoredReceipt.assessment_id) : legacy && legacy.record.type === "assessment" ? S.assessment(view, legacy.record.id) : null;
      if (!candidate || candidate.course_id !== who.courseId) candidate = S.courseAssessments(view, who).filter(function (it) { return ["W25", "W27", "W41"].indexOf(page) >= 0 ? it.kind === "quiz" : true; })[0];
      if (!candidate) return { allowed: false };
      out.assessmentId = candidate.id;
    }
    var item = out.assessmentId ? S.assessment(view, out.assessmentId) : null;
    if (item && ((["W25", "W27", "W41"].indexOf(page) >= 0 && item.kind !== "quiz") || (["W22", "W40"].indexOf(page) >= 0 && item.kind === "quiz"))) return { allowed: false };
    var immutableReceipt = receipt && ["W22", "W27"].indexOf(page) >= 0 && (role === "student" && (receipt.captured_members || [receipt.owner_id]).indexOf(who.personId) >= 0);
    if (out.assessmentId && (!item || item.course_id !== who.courseId || (role !== "instructor" && !item.published && !immutableReceipt))) return { allowed: false };
    if (role === "ta" && item && ["W48", "W49", "W51", "W53"].indexOf(page) >= 0 && (!S.taTaskAccess(view, item.id, who).active || !S.taScope(view, item.id, who))) return { allowed: false };
    var baseAnchor = S.anchorFor(page, anchorVariant);
    // Legacy editors/attempts remain bound to their declared record until explicitly generalized.
    if (baseAnchor && item && itemPages.indexOf(page) < 0) {
      var bound = null, record = baseAnchor.record;
      if (record.type === "assessment") bound = record.id;
      else if (record.type === "rubric") { var rubric = view.data.coursework.rubrics.filter(function (r) { return r.id === record.id; })[0]; bound = rubric && rubric.assessment_id; }
      else if (record.type === "allowance") { var allowance = view.data.quiz.allowances.filter(function (r) { return r.id === record.id; })[0]; bound = allowance && allowance.assessment_id; }
      else if (record.type === "draft") { var draftAnchor = S.anchorFor("W19", variant === "motion" || variant === "motion-reviewed" ? "motion" : null); bound = draftAnchor && draftAnchor.record.id; }
      else if (record.type === "attempt") bound = S.anchorFor("W25").record.id;
      if (bound && bound !== item.id) return { allowed: false };
    }
    if (page === "W23" && receipt) {
      if (!out.learnerId) return { allowed: false };
      var releases = S.releasesFor(view, item.id, who) || [];
      var entry = null;
      releases.forEach(function (r) { r.entries.forEach(function (e) { if (e.person_id === out.learnerId) entry = e; }); });
      if (entry && entry.receipt_id && entry.receipt_id !== receipt.id) return { allowed: false };
    }
    if (baseAnchor && page !== "W43" && !itemPages.includes(page) && ["course", "person", "task", "policy"].indexOf(baseAnchor.record.type) < 0) {
      var linked = baseAnchor.record.type === "rubric" ? view.data.coursework.rubrics.filter(function (r) { return r.id === baseAnchor.record.id; })[0] : null;
      var linkedItem = linked ? S.assessment(view, linked.assessment_id) : null;
      if (linkedItem && linkedItem.course_id !== who.courseId) return { allowed: false };
      if (!linkedItem && who.courseId !== persona.course_id) return { allowed: false };
    }
    if (role === "ta" && item && out.learnerId) {
      var scope = S.taScope(view, item.id, who);
      if (!scope || scope.learnerIds.indexOf(out.learnerId) < 0) return { allowed: false };
    }
    // Record-specific legacy tokens must agree with an explicit selection, not override it.
    var anchor = S.anchorFor(page, anchorVariant);
    if (anchor && anchorVariant && ["assessment", "receipt"].indexOf(anchor.record.type) >= 0) {
      var selected = anchor.record.type === "receipt" ? out.receiptId : out.assessmentId;
      if (selected && selected !== anchor.record.id) return { allowed: false };
    }
    return W.deepFreeze({ allowed: true, who: who, selection: out });
  });
})(globalThis);
