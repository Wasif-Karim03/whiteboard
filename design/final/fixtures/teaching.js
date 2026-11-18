/* Course-scoped fictional teaching projections. Chosen by Codex under owner delegation.
   Source: fictional course/enrollment/task records and owner-delegated teaching drill-down.
   Loaded after scenarios and before manifest/finalize. No production records or effects. */
(function (root) {
  "use strict";
  var WB = root.WB, sel = WB.sel;
  var def = function (k, v) { return WB.defineFrozen(sel, k, v); };
  WB.defineFrozen(WB.data, "teaching", { meta: { source: "reconstructed", basis: ["owner-delegated teaching drill-down"] }, history: [] });

  function roleFor(view, who) {
    return who && who.courseId ? sel.verifiedRole(view, who, who.courseId) : null;
  }
  function tasksFor(view, who) {
    return view.data.staff.grading_tasks.filter(function (t) { return t.course_id === who.courseId; });
  }
  function active(view, task) { return sel.isBefore(view.clock, task.access_end); }
  function questions(view, assessment) {
    if (assessment.questions) return assessment.questions;
    var quiz = assessment.quiz_id ? sel.quiz(view, assessment.quiz_id) : null;
    return quiz ? quiz.items.map(function (q) { return typeof q === "string" ? { id: q } : q; }) : [];
  }
  function idsOf(list) { return list.map(function (p) { return p.id; }); }
  function taskQuestions(view, task) {
    var item = sel.assessment(view, task.assessment_id);
    if (!item || item.course_id !== task.course_id) return [];
    var all = task.question_ids.length === 1 && task.question_ids[0] === "*";
    return questions(view, item).filter(function (q) { return all || task.question_ids.indexOf(q.id) >= 0; });
  }

  def("teachingTaskQuestions", function (view, who, task) {
    var role = roleFor(view, who);
    if (!task || (role !== "instructor" && role !== "ta")) return [];
    var record = tasksFor(view, who).filter(function (t) { return t.id === task.id; })[0];
    if (!record || (role === "ta" && (record.ta_id !== who.personId || !active(view, record)))) return [];
    return WB.deepFreeze(taskQuestions(view, record).slice());
  });

  def("teachingLearners", function (view, who) {
    var role = roleFor(view, who);
    if (role !== "instructor" && role !== "ta") return [];
    var enrolled = sel.enrolled(view, who.courseId, "student");
    if (role === "ta") {
      var assigned = [];
      tasksFor(view, who).forEach(function (t) {
        var scope = t.ta_id === who.personId ? sel.taScope(view, t.assessment_id, who) : null;
        if (scope) assigned = assigned.concat(scope.learnerIds);
      });
      enrolled = enrolled.filter(function (id) { return assigned.indexOf(id) >= 0; });
    }
    return WB.deepFreeze(enrolled.map(function (id) { return sel.person(view, id); }).filter(Boolean));
  });

  function scopedAssessment(view, assessment, scope) {
    if (!scope || scope.allQuestions) return assessment;
    var out = {};
    Object.keys(assessment).forEach(function (k) { out[k] = assessment[k]; });
    out.questions = questions(view, assessment).filter(function (q) { return scope.questionIds.indexOf(q.id) >= 0; });
    out.max = out.questions.reduce(function (sum, q) { return sum + (q.max || 0); }, 0);
    out.partial = true;
    return out;
  }
  function learnerReceipts(view, item, who, personId, scope) {
    return sel.receiptsFor(view, item.id, who).filter(function (r) {
      return r.course_id === who.courseId && (r.owner_id === personId || (r.captured_members || []).indexOf(personId) >= 0);
    }).map(function (r) {
      if (!scope || scope.allQuestions) return r;
      var out = JSON.parse(JSON.stringify(r));
      out.page_tags = (out.page_tags || []).map(function (t) {
        return { page: t.page, questions: t.questions.filter(function (id) { return scope.questionIds.indexOf(id) >= 0; }) };
      }).filter(function (t) { return t.questions.length > 0; });
      return out;
    });
  }
  def("teachingStudent", function (view, who, personId) {
    var role = roleFor(view, who);
    if (role !== "instructor" && role !== "ta") return null;
    if (idsOf(sel.teachingLearners(view, who)).indexOf(personId) < 0) return null;
    var items = sel.courseAssessments(view, who).map(function (item) {
      var scope = role === "ta" ? sel.taScope(view, item.id, who) : null;
      if (role === "ta" && (!scope || scope.learnerIds.indexOf(personId) < 0)) return null;
      var history = role === "instructor" ? sel.releasesFor(view, item.id, who) : null;
      var releases = (history || []).filter(function (r) { return r.entries.some(function (e) { return e.person_id === personId; }); });
      // A learner detail projection never includes another learner's release entry.
      var release = releases.length ? JSON.parse(JSON.stringify(releases[releases.length - 1])) : null;
      if (release) release.entries = release.entries.filter(function (e) { return e.person_id === personId; });
      return {
        assessment: scopedAssessment(view, item, scope),
        submission: sel.submissionFor(view, personId, item.id), receipts: learnerReceipts(view, item, who, personId, scope),
        result: sel.resultFor(view, personId, item.id, who), draft: sel.gradeDraftFor(view, personId, item.id, who), release: release,
      };
    }).filter(Boolean);
    var book = sel.gradebook(view, who.courseId, who);
    var row = book ? book.rows.filter(function (r) { return r.personId === personId; })[0] || null : null;
    return WB.deepFreeze({ person: sel.person(view, personId), items: items, gradebookRow: row });
  });

  def("teachingTeam", function (view, who) {
    var role = roleFor(view, who);
    if (role !== "instructor" && role !== "ta") return null;
    var tasks = tasksFor(view, who);
    var members = sel.enrolled(view, who.courseId, "ta").filter(function (id) { return role === "instructor" || id === who.personId; }).map(function (id) {
      return { person: sel.person(view, id), tasks: tasks.filter(function (t) { return t.ta_id === id; }) };
    });
    var history = (view.data.teaching && view.data.teaching.history || []).filter(function (h) {
      return h.course_id === who.courseId && !sel.isBefore(view.clock, h.at) && (role === "instructor" || h.ta_id === who.personId);
    });
    // A TA may inspect their assignment metadata but never other assignees or learner allocations after expiry.
    if (role === "ta") members = members.map(function (m) {
      return { person: m.person, tasks: m.tasks.filter(function (t) { return active(view, t); }) };
    });
    return WB.deepFreeze({ members: members, history: history });
  });

  def("teachingCoverage", function (view, who) {
    if (roleFor(view, who) !== "instructor") return [];
    var learners = sel.enrolled(view, who.courseId, "student");
    var tasks = tasksFor(view, who).filter(function (t) { return active(view, t) && sel.enrolled(view, who.courseId, "ta").indexOf(t.ta_id) >= 0; });
    return WB.deepFreeze(sel.courseAssessments(view, who).filter(function (item) { return item.grading_intent !== "ungraded"; }).map(function (item) {
      var mine = tasks.filter(function (t) { return t.assessment_id === item.id; });
      var assignedLearners = [], assignedQuestions = [];
      mine.forEach(function (t) { assignedLearners = assignedLearners.concat(t.learner_ids); assignedQuestions = assignedQuestions.concat(idsOf(taskQuestions(view, t))); });
      return {
        assessment: item,
        uncoveredPairs: learners.map(function (personId) {
          var covered = [];
          mine.filter(function (t) { return t.learner_ids.indexOf(personId) >= 0; }).forEach(function (t) { covered = covered.concat(idsOf(taskQuestions(view, t))); });
          return { person: sel.person(view, personId), questions: questions(view, item).filter(function (q) { return covered.indexOf(q.id) < 0; }) };
        }).filter(function (pair) { return pair.person && (pair.questions.length || (!questions(view, item).length && assignedLearners.indexOf(pair.person.id) < 0)); }),
        uncoveredLearners: learners.filter(function (id) { return assignedLearners.indexOf(id) < 0; }).map(function (id) { return sel.person(view, id); }).filter(Boolean),
        uncoveredQuestions: questions(view, item).filter(function (q) { return assignedQuestions.indexOf(q.id) < 0; }),
      };
    }));
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
