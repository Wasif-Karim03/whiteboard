/* Whiteboard Phase 2b fixtures: Maya's grading task, PS4 review records and staff progress selectors.
   Sources: spec/docs/24-mock-service-contracts.html (TA context: maya, phys110-f26, scope ps4, learners aisha
   and ben, questions 1a to 4, access_end); design/reviews/journey-walk-2026-11.md:97 (JW-010, one TA access
   end date everywhere); decisions.md BD31 (Aisha reviewed and held, Ben received and not reviewed; W53 lists
   Ben as not ready). grading_due is chosen by Claude under owner delegation. Fictional, "reconstructed". */
(function (root) {
  "use strict";
  var WB = root.WB;
  var sel = WB.sel;
  var def = function (k, v) { return WB.defineFrozen(sel, k, v); };
  var PHYS = "phys110-f26";
  var RECEIVED_FAMILY = ["received", "graded", "held", "released", "correctionHeld", "feedbackUpdated"];

  WB.defineFrozen(WB.data, "staff", {
    meta: { source: "reconstructed", basis: ["spec/docs/24-mock-service-contracts.html", "journey-walk-2026-11.md:97", "decisions.md BD31"] },
    grading_tasks: [
      {
        id: "task-maya-ps4", ta_id: "maya", course_id: PHYS, assessment_id: "ps4", learner_ids: ["aisha", "ben"], question_ids: ["1a", "1b", "2", "3", "4"],
        grading_due: "2026-10-23T17:00:00-04:00", access_end: "2026-10-25T23:59:00-04:00", release_permission: false,
      },
    ],
    reviews: [
      { id: "aisha-ps4", person_id: "aisha", assessment_id: "ps4", reviewer_id: "maya", reviewed: true },
      { id: "ben-ps4", person_id: "ben", assessment_id: "ps4", reviewer_id: "maya", reviewed: false },
    ],
  });

  def("receivedFamily", function () { return RECEIVED_FAMILY.slice(); });
  def("gradingTaskFor", function (view, taId, assessmentId) {
    var matches = view.data.staff.grading_tasks.filter(function (t) { return t.ta_id === taId && (!assessmentId || t.assessment_id === assessmentId); });
    // R18: one task per TA and assessment (check_fixtures.checkTaskUniqueness); fail fast rather than pick one.
    if (assessmentId && matches.length > 1) throw new Error("WB.sel.gradingTaskFor: more than one task for " + taId + "/" + assessmentId);
    return matches[0] || null;
  });
  // R17: access is decided per grading task. The task for this assessment is active only while the view clock
  // is before its access_end (clock equal to access_end counts as ended).
  def("taTaskAccess", function (view, assessmentId, who) {
    if (!who || who.role !== "ta") return { task: null, active: false };
    var task = sel.gradingTaskFor(view, who.personId, assessmentId);
    return { task: task, active: !!task && sel.isBefore(view.clock, task.access_end) };
  });
  // Course-level notice: the latest access_end among the TA's grading tasks in the course, or null when there is none.
  def("accessEnd", function (view, personId, courseId) {
    return view.data.staff.grading_tasks.reduce(function (latest, x) {
      if (x.ta_id !== personId || x.course_id !== courseId) return latest;
      return latest === null || sel.isBefore(latest, x.access_end) ? x.access_end : latest;
    }, null);
  });
  def("taAccessActive", function (view, personId, courseId, nowIso) {
    var end = sel.accessEnd(view, personId, courseId);
    return end !== null && sel.isBefore(nowIso || view.clock, end);
  });

  function receivedSubs(view, assessmentId) {
    return sel.submissionsFor(view, assessmentId).filter(function (s) { return RECEIVED_FAMILY.indexOf(s.state) >= 0; });
  }
  // R11: once a TA's access has ended (view clock at or after access_end) the TA reads no learner data; the
  // grading task itself (assessment, access_end) stays readable for the W05/W48 "access ended" notice.
  def("taAccessEnded", function (view, assessmentId, who) {
    if (!who || who.role !== "ta") return false;
    return !sel.taTaskAccess(view, assessmentId, who).active;
  });
  // The canonical question ids of an assessment (R8): its questions, or for a quiz the items of the matching
  // quiz record; [] when neither exists.
  function questionIdsFor(view, assessmentId) {
    var item = sel.assessment(view, assessmentId);
    if (!item) return [];
    if (item.questions) return item.questions.map(function (q) { return q.id; });
    var quiz = item.quiz_id ? sel.quiz(view, item.quiz_id) : null;
    if (!quiz) return [];
    return quiz.items.map(function (x) { return typeof x === "string" ? x : x.id; });
  }

  // R1, R2, R8: a verified TA's active scope for one assessment, or null. allQuestions is true only when the
  // canonical question list is non-empty and every id is assigned, or when the task assigns exactly ["*"].
  def("taScope", function (view, assessmentId, who) {
    var item = sel.assessment(view, assessmentId);
    if (!item || sel.verifiedRole(view, who, item.course_id) !== "ta") return null;
    var access = sel.taTaskAccess(view, assessmentId, who);
    if (!access.active) return null;
    var task = access.task;
    var canon = questionIdsFor(view, assessmentId);
    var wildcard = task.question_ids.length === 1 && task.question_ids[0] === "*";
    var all = wildcard || (canon.length > 0 && canon.every(function (q) { return task.question_ids.indexOf(q) >= 0; }));
    return Object.freeze({
      learnerIds: Object.freeze(task.learner_ids.slice()),
      questionIds: Object.freeze(wildcard ? canon : task.question_ids.slice()),
      allQuestions: all,
    });
  });

  // M3: {all: true} for a verified instructor of the assessment's course, the taScope for a TA, else null.
  function scopeFor(view, assessmentId, who) {
    var item = sel.assessment(view, assessmentId);
    if (!item) return null;
    var role = sel.verifiedRole(view, who, item.course_id);
    if (role === "instructor") return { all: true };
    if (role === "ta") return sel.taScope(view, assessmentId, who);
    return null;
  }
  function inScope(scope) {
    return function (personId) { return scope.all === true || scope.learnerIds.indexOf(personId) >= 0; };
  }

  // Whether one learner's review is complete for this scope. Whole-assessment completion (the review record) for
  // an instructor or a TA assigned every question; for a partial TA scope, every assigned question is in the
  // grade draft's reviewed_questions, the rule gradeDraftFor uses for review_complete (REV-05).
  function reviewedIn(view, assessmentId, scope, personId) {
    if (scope.all === true || scope.allQuestions) {
      return view.data.staff.reviews.some(function (r) { return r.person_id === personId && r.assessment_id === assessmentId && r.reviewed; });
    }
    var d = view.data.grades.grade_drafts.filter(function (g) { return g.person_id === personId && g.assessment_id === assessmentId; })[0];
    return !!d && scope.questionIds.every(function (q) { return d.reviewed_questions.indexOf(q) >= 0; });
  }

  // Reviewed of received, within a TA's scope when the viewer is a TA; null for anyone else, a TA with no task
  // and a TA whose access has ended (fail closed).
  def("reviewProgress", function (view, assessmentId, who) {
    var scope = scopeFor(view, assessmentId, who);
    if (!scope) return null;
    var ok = inScope(scope);
    var subs = receivedSubs(view, assessmentId).filter(function (s) { return ok(s.person_id); });
    var reviewed = subs.filter(function (s) { return reviewedIn(view, assessmentId, scope, s.person_id); });
    return { reviewed: reviewed.length, of: subs.length };
  });

  // Received of enrolled learners in the assessment's course, within a TA's scope when the viewer is a TA;
  // null for anyone else, a TA with no task and a TA whose access has ended (fail closed).
  def("receivedProgress", function (view, assessmentId, who) {
    var scope = scopeFor(view, assessmentId, who);
    if (!scope) return null;
    var ok = inScope(scope);
    var item = sel.assessment(view, assessmentId);
    var learners = item ? sel.enrolled(view, item.course_id, "student").filter(ok) : [];
    return { received: receivedSubs(view, assessmentId).filter(function (s) { return ok(s.person_id); }).length, of: learners.length };
  });

  // M2: releasing is the instructor's step. A verified TA whose task in the course grants release is a data
  // error and throws; every other viewer gets false.
  def("canRelease", function (view, who, courseId) {
    var role = sel.verifiedRole(view, who, courseId);
    if (role === "instructor") return true;
    if (role !== "ta") return false;
    var grants = view.data.staff.grading_tasks.some(function (t) {
      return t.ta_id === who.personId && t.course_id === courseId && t.release_permission !== false;
    });
    if (grants) throw new Error("WB.sel.canRelease: a grading task grants release permission");
    return false;
  });
  // W53 candidates (releaseReady) live in fixtures/grades.js beside the release history they read.
})(typeof globalThis !== "undefined" ? globalThis : this);
