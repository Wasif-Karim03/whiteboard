/* Whiteboard Phase 2b fixtures: PHYS 110 coursework, receipts and per-learner submission records.
   Sources: spec/docs/22-fixtures-overview.html (assignment, receipt fields); board-deep-dive-2026-11-15.md
   :667 (W18 tabs All 8, To do 2, Handed in 1, Released 4; staff PS4 counts), :913 (receipt AH-PHYS110-001),
   :1764 (PS4 questions and marks); the board copy (W18 grade rows: titles and due days; W40 PS4 due and
   close). decisions.md BD31 (Aisha reviewed and held, Ben received and not reviewed), BD39 (states).
   Fictional, "reconstructed"; values not drawn are chosen by Claude under owner delegation (SOURCES.md). */
(function (root) {
  "use strict";
  var WB = root.WB;
  var sel = WB.sel;
  var def = function (k, v) { return WB.defineFrozen(sel, k, v); };
  var PHYS = "phys110-f26";

  function a(id, kind, title, due, close, max, extra) {
    var r = { id: id, course_id: PHYS, kind: kind, title: title, due: due, close: close, max: max, published: true };
    Object.keys(extra || {}).forEach(function (k) { r[k] = extra[k]; });
    return r;
  }
  function sub(person, assessment, state, released, extra) {
    var r = { id: person + "-" + assessment, person_id: person, assessment_id: assessment, course_id: PHYS, state: state, released: released, late: false };
    Object.keys(extra || {}).forEach(function (k) { r[k] = extra[k]; });
    return r;
  }

  WB.defineFrozen(WB.data, "coursework", {
    meta: { source: "reconstructed", basis: ["spec/docs/22-fixtures-overview.html", "board-deep-dive-2026-11-15.md:667,913,1764", "decisions.md BD31, BD39"] },
    // quiz2 and quiz3 timing lives in fixtures/quiz.js (quiz_id); due and close here are null for quizzes.
    assessments: [
      a("ps1", "assignment", "Problem Set 1", "2026-09-25T23:59:00-04:00", "2026-09-27T23:59:00-04:00", 30, { version: 1 }),
      a("ps2", "assignment", "Problem Set 2", "2026-10-02T23:59:00-04:00", "2026-10-04T23:59:00-04:00", 30, { version: 1 }),
      a("ps3", "assignment", "Problem Set 3", "2026-10-09T23:59:00-04:00", "2026-10-11T23:59:00-04:00", 30, { version: 1 }),
      a("ps4", "assignment", "Problem Set 4: Kinematics", "2026-10-16T23:59:00-04:00", "2026-10-18T23:59:00-04:00", 30, {
        version: 2,
        questions: [{ id: "1a", max: 6 }, { id: "1b", max: 4 }, { id: "2", max: 6 }, { id: "3", max: 8 }, { id: "4", max: 6 }],
        sample_file_rule: "pdf-png-jpg-up-to-10-files",
        opens: "2026-10-09T09:00:00-04:00", max_attempts: 1, late_rule: "accepted_until_close_marked_late", module_id: "kinematics", rubric_id: "ps4-rubric",
        body: "Solve the kinematics problems. Show your working for every question, upload clear pages and tag each page to its question.",
      }),
      a("lab1", "lab", "Motion lab", "2026-10-09T23:59:00-04:00", "2026-10-11T23:59:00-04:00", 20, { version: 1 }),
      a("motion", "groupAssignment", "Motion investigation", "2026-10-23T23:59:00-04:00", "2026-10-24T23:59:00-04:00", 40, { version: 1, group_set_id: "lab-teams" }),
      a("quiz2", "quiz", "Quiz 2", null, null, 10, { quiz_id: "quiz2" }),
      a("quiz3", "quiz", "Quiz 3: Projectile motion", null, null, 10, { quiz_id: "quiz3" }),
      { id: "math-assignment", course_id: "math220-f26", kind: "assignment", title: "Vectors and linear systems", published: true, version: 1, max: 10,
        opens: "2026-10-09T09:00:00-04:00", due: "2026-10-18T23:59:00-04:00", close: "2026-10-20T23:59:00-04:00", max_attempts: 2,
        questions: [{ id: "q1", max: 10 }], rubric_id: "math-rubric", grading_intent: "graded", body: "Explain and solve the vector system. Include your working." },
      { id: "math-practice", course_id: "math220-f26", kind: "assignment", title: "Vector practice", published: true, version: 1, max: 0,
        due: "2026-10-23T23:59:00-04:00", close: null, grading_intent: "ungraded", submission_mode: "none", body: "Optional practice. This work does not contribute to the course grade." },
    ],
    receipts: [
      {
        id: "AH-PHYS110-001", assessment_id: "ps4", course_id: PHYS, owner_id: "aisha", actor_id: "aisha", attempt: 1, status: "received",
        accepted_at: "2026-10-15T10:12:00-04:00", assessment_version: 2, files: [{ name: "aisha-ps4-sample.pdf", pages: 4, bytes: 1843200 }],
        page_tags: [{ page: 1, questions: ["1a", "1b"] }, { page: 2, questions: ["2"] }, { page: 3, questions: ["3"] }, { page: 4, questions: ["4"] }],
      },
      {
        id: "AH-PHYS110-002", assessment_id: "ps4", course_id: PHYS, owner_id: "ben", actor_id: "ben", attempt: 1, status: "received",
        accepted_at: "2026-10-14T19:45:00-04:00", assessment_version: 2, files: [{ name: "ben-ps4-sample.pdf", pages: 3, bytes: 1310720 }],
        page_tags: [{ page: 1, questions: ["1a", "1b", "2"] }, { page: 2, questions: ["3"] }, { page: 3, questions: ["4"] }],
      },
      // Phase 2 gate R7: the Quiz 2 receipt behind the "Feedback ready" Activity item (W27:quiz2).
      {
        id: "AH-PHYS110-Q2-001", assessment_id: "quiz2", course_id: PHYS, owner_id: "aisha", actor_id: "aisha", attempt: 1, status: "received",
        accepted_at: "2026-10-05T09:16:00-04:00", assessment_version: 1, files: [], page_tags: [],
      },
      { id: "AH-MATH220-000", assessment_id: "math-assignment", course_id: "math220-f26", owner_id: "aisha", actor_id: "aisha", attempt: 1, status: "received",
        accepted_at: "2026-10-15T09:00:00-04:00", assessment_version: 1, files: [{ name: "vector-working-first.pdf", pages: 1, bytes: 81920 }], page_tags: [{ page: 1, questions: ["q1"] }] },
      { id: "AH-MATH220-001", assessment_id: "math-assignment", course_id: "math220-f26", owner_id: "aisha", actor_id: "aisha", attempt: 2, status: "received",
        accepted_at: "2026-10-17T09:00:00-04:00", assessment_version: 1, files: [{ name: "vector-working-revised.pdf", pages: 2, bytes: 122880 }], page_tags: [{ page: 1, questions: ["q1"] }, { page: 2, questions: ["q1"] }] },
    ],
    modules: [
      { id: "vectors", course_id: "math220-f26", position: 1, title: "Vectors and systems", starts: "2026-10-12T00:00:00-04:00", ends: "2026-11-08T23:59:00-05:00", item_ids: ["math-assignment", "math-practice"] },
      { id: "kinematics", course_id: PHYS, position: 3, title: "Module 3: Kinematics", starts: "2026-10-12T00:00:00-04:00", ends: "2026-10-25T23:59:00-04:00", item_ids: ["ps4", "quiz3", "motion"] },
      { id: "forces", course_id: PHYS, position: 4, title: "Module 4: Forces", starts: "2026-10-26T00:00:00-04:00", ends: "2026-11-08T23:59:00-05:00", item_ids: [] },
    ],
    rubrics: [

      {
        id: "ps4-rubric", assessment_id: "ps4", version: 2,
        criteria: [
          { question_id: "1a", max: 6, title: "Read the motion graph" },
          { question_id: "1b", max: 4, title: "State the given quantities" },
          { question_id: "2", max: 6, title: "Free-fall time and sign convention" },
          { question_id: "3", max: 8, title: "Projectile range" },
          { question_id: "4", max: 6, title: "Interpret the result" },
        ],
      },
      { id: "math-rubric", assessment_id: "math-assignment", course_id: "math220-f26", title: "Vector reasoning", version: 1, criteria: [{ question_id: "q1", title: "Reasoning and solution", max: 10 }] },
    ],
    // Saved, not handed in. The Team Orbit draft exists until the group hand-in (scenarios.js GROUP_DONE removes it).
    drafts: [
      {
        id: "team-orbit-motion-draft", person_id: null, group_id: "team-orbit", membership_version: 1, captured_members: ["aisha", "ben"], actor_id: "ben",
        assessment_id: "motion", course_id: PHYS, attempt: 1, assessment_version: 1, saved_at: "2026-10-20T15:40:00-04:00",
        files: [{ id: "f1", name: "team-orbit-investigation-sample.pdf", pages: 6, bytes: 2621440, kind: "pdf", processing: "ready" }], page_tags: [],
      },
    ],
    // state is a WB.manifest.status RECORD_STATES value; released is the learner release flag.
    submissions: [
      { id: "aisha-math-assignment", person_id: "aisha", assessment_id: "math-assignment", course_id: "math220-f26", state: "held", released: false, late: false, receipt_id: "AH-MATH220-001" },
      { id: "ben-math-assignment", person_id: "ben", assessment_id: "math-assignment", course_id: "math220-f26", state: "held", released: false, late: false, manual: true },
      sub("aisha", "ps1", "released", true),
      sub("aisha", "ps2", "released", true),
      sub("aisha", "ps3", "excused", true),
      sub("aisha", "ps4", "held", false, { receipt_id: "AH-PHYS110-001" }),
      sub("aisha", "lab1", "released", true),
      sub("aisha", "motion", "draft", false),
      sub("aisha", "quiz2", "released", true, { receipt_id: "AH-PHYS110-Q2-001" }),
      sub("aisha", "quiz3", "notStarted", false),
      sub("ben", "ps4", "received", false, { receipt_id: "AH-PHYS110-002" }),
      sub("ben", "motion", "draft", false),
      sub("carmen", "ps4", "missing", false),
      sub("carmen", "motion", "notStarted", false),
      sub("ben", "ps1", "released", true),
      sub("ben", "ps2", "released", true),
      sub("ben", "ps3", "released", true),
      sub("ben", "lab1", "released", true),
      sub("ben", "quiz2", "released", true),
      sub("carmen", "ps1", "released", true),
      sub("carmen", "ps2", "released", true),
      sub("carmen", "ps3", "released", true),
      sub("carmen", "lab1", "released", true),
      sub("carmen", "quiz2", "released", true),
    ],
  });

  var TO_DO = ["notStarted", "draft", "queued"];
  var HANDED_IN = ["received", "receivedNotReleased"];
  var RELEASED = ["released", "feedbackUpdated"];
  var inList = function (list, x) { return list.indexOf(x) >= 0; };

  // Instructor planning includes unpublished items; learners and TAs read published course content only.
  def("courseAssessments", function (view, who) {
    var role = who ? sel.verifiedRole(view, who, who.courseId) : null;
    if (!role) return [];
    return view.data.coursework.assessments.filter(function (item) { return item.course_id === who.courseId && (role === "instructor" || item.published); });
  });

  def("assessment", function (view, assessmentId) {
    return view.data.coursework.assessments.filter(function (x) { return x.id === assessmentId; })[0] || null;
  });
  def("submissionFor", function (view, personId, assessmentId) {
    return view.data.coursework.submissions.filter(function (s) { return s.person_id === personId && s.assessment_id === assessmentId; })[0] || null;
  });
  def("submissionsFor", function (view, assessmentId) {
    return view.data.coursework.submissions.filter(function (s) { return s.assessment_id === assessmentId; });
  });

  // W18 tabs, from the learner's own status keys: To do (not started, draft, queued), Handed in
  // (received, not yet released) and Released. An excused item counts only under All.
  def("courseworkCounts", function (view, courseId, personId) {
    var counts = { all: 0, toDo: 0, handedIn: 0, released: 0 };
    view.data.coursework.assessments.forEach(function (item) {
      if (item.course_id !== courseId || !item.published) return;
      counts.all += 1;
      var s = sel.submissionFor(view, personId, item.id) || { state: "notStarted", released: false };
      var k = WB.manifest.status.keyFor(s, "student", { own: true });
      if (!k) return;
      if (inList(TO_DO, k.key)) counts.toDo += 1;
      else if (inList(HANDED_IN, k.key)) counts.handedIn += 1;
      else if (inList(RELEASED, k.key)) counts.released += 1;
    });
    return counts;
  });

  // Receipts the viewer may read (role verified against the enrollment): a student sees own receipts and group receipts that captured them;
  // an instructor sees all; a TA sees only assessments and learners in their grading task, and nothing once
  // their access has ended.
  def("receiptsFor", function (view, assessmentId, who) {
    var item = sel.assessment(view, assessmentId);
    var role = item ? sel.verifiedRole(view, who, item.course_id) : null;
    var personId = who && who.personId;
    var own = view.data.coursework.receipts.filter(function (r) { return r.assessment_id === assessmentId; });
    var group = (view.data.groups.receipts || []).filter(function (r) { return r.assessment_id === assessmentId; });
    if (role === "student") {
      return own.filter(function (r) { return r.owner_id === personId; })
        .concat(group.filter(function (r) { return r.captured_members.indexOf(personId) >= 0; }));
    }
    if (role === "instructor") return own.concat(group);
    if (role === "ta") {
      var access = sel.taTaskAccess(view, assessmentId, who);
      if (!access.active) return [];
      var task = access.task;
      var inScope = function (id) { return task.learner_ids.indexOf(id) >= 0; };
      return own.filter(function (r) { return inScope(r.owner_id); })
        // REV-03 (chosen by Claude under owner delegation): a group snapshot is returned to a TA only when every
        // captured member is in the task's scope; a partial allocation sees no group receipt (BD38).
        .concat(group.filter(function (r) { return r.captured_members.every(inScope); }));
    }
    return [];
  });

  // ---------- Phase 2 gate selectors (M5, R3) ----------
  // The module whose span holds the view clock (starts inclusive, ends exclusive), else null.
  // Issued receipt identity survives unpublishing; reuse the exact owner/course/TA scope above.
  def("receiptById", function (view, receiptId, who) {
    var rows = view.data.coursework.receipts.concat(view.data.groups.receipts || []);
    var record = rows.filter(function (r) { return r.id === receiptId; })[0];
    return record ? sel.receiptsFor(view, record.assessment_id, who).filter(function (r) { return r.id === receiptId; })[0] || null : null;
  });
  def("currentModule", function (view, courseId) {
    return view.data.coursework.modules.filter(function (m) {
      return m.course_id === courseId && !sel.isBefore(view.clock, m.starts) && sel.isBefore(view.clock, m.ends);
    })[0] || null;
  });
  // The assessment's rubric for any verified course member, else null.
  def("rubricFor", function (view, assessmentId, who) {
    var item = sel.assessment(view, assessmentId);
    if (!item || !sel.verifiedRole(view, who, item.course_id)) return null;
    return view.data.coursework.rubrics.filter(function (r) { return r.assessment_id === assessmentId; })[0] || null;
  });
  // A verified student's saved draft: their own, or a group draft that captured them while their group still
  // lists them. Null for staff and everyone else.
  def("draftFor", function (view, assessmentId, who) {
    var item = sel.assessment(view, assessmentId);
    if (!item || sel.verifiedRole(view, who, item.course_id) !== "student") return null;
    var me = who.personId;
    return view.data.coursework.drafts.filter(function (d) {
      if (d.assessment_id !== assessmentId) return false;
      if (d.person_id) return d.person_id === me;
      if (d.captured_members.indexOf(me) < 0) return false;
      var group = sel.groupFor(view, me, item.group_set_id);
      return !!group && group.id === d.group_id;
    })[0] || null;
  });
  // The student's next due item: the earliest published item due (a quiz's close) at or after the clock whose
  // own status key is not started, draft or queued. Null for staff and everyone else.
  def("nextDue", function (view, courseId, who) {
    if (sel.verifiedRole(view, who, courseId) !== "student") return null;
    var best = null;
    view.data.coursework.assessments.forEach(function (item) {
      if (item.course_id !== courseId || !item.published) return;
      var quiz = item.quiz_id ? sel.quiz(view, item.quiz_id) : null;
      var due = quiz ? quiz.close : item.due;
      if (!due || sel.isBefore(due, view.clock)) return;
      var s = sel.submissionFor(view, who.personId, item.id) || { state: "notStarted", released: false };
      var k = WB.manifest.status.keyFor(s, "student", { own: true });
      if (!k || !inList(TO_DO, k.key)) return;
      if (!best || sel.isBefore(due, best.due)) best = { assessmentId: item.id, due: due };
    });
    return best ? Object.freeze(best) : null;
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
