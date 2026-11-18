/* W57 Grading allocation and deadline planner (Phase 3, seg6-grading; decision 2.11). Instructor and TA. Anchor:
   the TA's problem-set grading task. The instructor sees every TA task with progress, learners, the staff grading
   due time beside the student due and close times, and a derived access check; the plan is preview only. A TA
   sees only their own tasks, each checked for active access first (amendment A6), and cannot edit deadlines. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "invalid", "offline", "permissionUnavailable", "firstUseEmpty"];
  var EARLY = "Access ends before grading is due";

  function instructorTasks(a) {
    var out = [];
    a.sel.enrolled(a.view, a.who.courseId, "ta").forEach(function (taId) {
      P.assessments(a).forEach(function (item) {
        var task = a.sel.gradingTaskFor(a.view, taId, item.id);
        if (task) out.push({ task: task, item: item });
      });
    });
    return out;
  }
  function ownTasks(a) {
    return P.assessments(a).map(function (item) {
      var access = a.sel.taTaskAccess(a.view, item.id, a.who);
      return access.task ? { task: access.task, item: item, active: access.active } : null;
    }).filter(Boolean);
  }
  function names(a, ids) { return ids.map(function (id) { return P.personName(a, id); }).join(", "); }
  function early(a, task) { return a.sel.isBefore(task.access_end, task.grading_due); }
  function questions(a, task) {
    var qs = a.sel.teachingTaskQuestions(a.view, a.who, task);
    return qs && qs.length ? P.questionsText(qs.map(function (q) { return q.id; })) : "Not listed for this task";
  }

  function progress(a, t) {
    var got = a.sel.receivedProgress(a.view, t.item.id, a.who);
    var done = a.sel.reviewProgress(a.view, t.item.id, a.who);
    return [got ? got.received + " of " + got.of + " received" : "", done ? done.reviewed + " of " + done.of + " reviewed" : ""].filter(Boolean).join(" · ");
  }

  function allocation(a, tasks) {
    var rows = tasks.map(function (t) {
      return {
        id: t.task.id, cells: {
          ta: esc(P.personName(a, t.task.ta_id)), item: esc(t.item.title),
          learners: esc(names(a, t.task.learner_ids)), questions: esc(questions(a, t.task)), end: esc(P.when(a, t.task.access_end)),
        },
      };
    });
    return a.K.table(a.ctx, {
      id: P.id(a, "allocation"), caption: "Allocation",
      columns: [
        { key: "ta", label: "Teaching assistant", primary: true }, { key: "item", label: "Assessment" },
        { key: "learners", label: "Learners" }, { key: "questions", label: "Questions" }, { key: "end", label: "Access ends" },
      ],
      rows: rows, empty: { title: "No grading tasks yet" },
    }) + a.K.section({ title: "Assessment-wide progress", level: 2, body: a.K.kv(tasks.filter(function (t, i) {
        return tasks.findIndex(function (other) { return other.item.id === t.item.id; }) === i;
      }).map(function (t) { return { label: t.item.title, value: progress(a, t) || "No progress available" }; })) });
  }

  function timeline(a, t) {
    var rows = [{ label: "Grading due (staff)", value: P.when(a, t.task.grading_due) }];
    if (t.item.due) rows.push({ label: "Student due", value: P.when(a, t.item.due) });
    if (t.item.close) rows.push({ label: "Student close", value: P.when(a, t.item.close) });
    rows.push({ label: "TA access ends", value: P.when(a, t.task.access_end) });
    var check = early(a, t.task)
      ? a.K.notice({ tone: "warning", title: EARLY, body: P.p("Access ends " + P.when(a, t.task.access_end) + ". Grading is due " + P.when(a, t.task.grading_due) + ".") })
      : P.p("Access covers the grading due time");
    return a.K.section({ title: "Timeline: " + t.item.title, body: a.K.kv(rows) + check, level: 2 });
  }

  function controls(a, tasks) {
    var reason = a.state === "offline" ? "You're offline" : a.state === "invalid" ? "Fix the grading due time first"
      : tasks.some(function (t) { return early(a, t.task); }) ? EARLY : "There is no change to apply";
    var field = a.state === "offline"
      ? a.K.field({ id: P.id(a, "due"), label: "Grading due", type: "date", disabled: true, reason: "You're offline" })
      : a.K.field({ id: P.id(a, "due"), label: "Grading due", type: "date", help: "Staff deadline; learners do not see it", error: a.state === "invalid" ? "Enter a grading due time" : undefined });
    return P.stack(a, [
      field,
      a.K.button({ label: "Preview allocation", note: "Preview only: nothing is reassigned in this prototype" }),
      a.K.button({ label: "Reassign incomplete work", note: "Preview only: nothing is reassigned in this prototype" }),
      a.K.button({ label: "Apply plan", kind: "primary", disabled: true, reason: reason, id: P.id(a, "apply") }),
      P.p("A release target is a plan only; nothing is released automatically"),
    ]);
  }

  function links(a, tasks) {
    var list = [{ label: "Home", go: "W05" }, { label: "Calendar", go: "W07" }];
    tasks.forEach(function (t) {
      var queue = P.recordGo("W48", "assessment", t.item.id);
      var scope = a.role === "instructor" ? P.recordGo("W45", "person", t.task.ta_id) : null;
      if (queue) list.push({ label: (a.role === "ta" ? "Open my task: " : "Grading queue: ") + t.item.title, go: queue });
      if (scope) list.push({ label: "Staff scope: " + P.personName(a, t.task.ta_id), go: scope });
    });
    return P.links(a, list);
  }

  function emptyPlan(a) {
    return a.K.empty({ title: "No grading tasks yet", body: P.p("Tasks appear here once work is allocated to a teaching assistant.") });
  }
  function top(a) { return a.state === "offline" ? P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown")]) : ""; }

  // R06: a review-tier protective action follows the same blocking states as the web controls.
  function guarded(a, action, key, reasons) {
    var reason = Object.prototype.hasOwnProperty.call(reasons, a.state) ? reasons[a.state] : "";
    return reason ? { label: action.label, disabled: true, reason: reason, id: P.id(a, key) } : action;
  }
  function instructorCoverage(a) {
    if (a.state === "firstUseEmpty") return "";
    var uncovered = a.sel.teachingCoverage(a.view, a.who).filter(function (row) { return row.uncoveredPairs.length; });
    if (!uncovered.length) return P.p("No uncovered grading work is listed");
    return a.K.section({ title: "Instructor-owned work", level: 2, body: a.K.list({ label: "Uncovered grading work", items: uncovered.map(function (row) {
      var pairs = row.uncoveredPairs.map(function (pair) { return pair.person.name + ": " + (pair.questions.length ? P.questionsText(pair.questions.map(function (q) { return q.id; })) : "All grading work"); });
      return { title: row.assessment.title, meta: pairs.join(" · ") };
    }) }) });
  }
  function staffingHistory(a) {
    var team = a.sel.teachingTeam(a.view, a.who);
    var history = team ? team.history : [];
    if (!history.length) return "";
    return a.K.section({ title: "Staffing history", level: 2, body: a.K.list({ label: "Staffing history", items: history.map(function (entry) {
      var item = a.sel.assessment(a.view, entry.assessment_id);
      var title = entry.kind === "handover" ? "Instructor takeover: " + (item ? item.title : "Assignment") : (item ? item.title : "Assignment");
      var people = entry.kind === "handover" ? P.personName(a, entry.from_ta_id) + " → " + P.personName(a, entry.to_instructor_id) : "";
      return { title: title, meta: [P.when(a, entry.at), P.personName(a, entry.actor_id), people].filter(Boolean).join(" · ") };
    }) }) });
  }
  function staffingExamples(a) {
    var entries = [["ta_unassigned", "Teaching assistant without an allocation"], ["ta_handover", "View instructor takeover example"]];
    var exampleCourse = a.sel.staffingExampleCourse(a.view, a.who);
    var actions = entries.map(function (entry, i) {
      if (a.state === "offline") return a.K.button({ label: entry[1], disabled: true, reason: "You're offline", id: P.id(a, "example-" + i) });
      if (!exampleCourse) return a.K.button({ label: entry[1], disabled: true, reason: "No staffing example is configured for an authorized course", id: P.id(a, "unavailable-example-" + i) });
      return a.K.link({ label: entry[1], go: WB.Teaching.go(a, "W57:examples~" + entry[0], { courseId: exampleCourse, learnerId: null, assessmentId: null, receiptId: null }) });
    });
    var solo = a.sel.soloTeachingCourse(a.view, a.who);
    if (solo) actions.unshift(a.state === "offline" ? a.K.button({ label: "No teaching assistants", disabled: true, reason: "You're offline", id: P.id(a, "solo-example") }) : a.K.link({ label: "No teaching assistants", go: WB.Teaching.go(a, "W57:examples", { courseId: solo, assessmentId: null, learnerId: null, receiptId: null }) }));
    return a.K.disclosure({ id: P.id(a, "staffing-examples"), summary: "Staffing examples", body: P.p("These fictional examples change the prototype scenario; no real allocation is changed.") + P.stack(a, actions) });
  }
  function instructor(a) {
    var tasks = a.state === "firstUseEmpty" ? [] : instructorTasks(a);
    if (a.tier !== "full") {
      var flag = tasks.length ? [guarded(a, { label: "Flag this task for follow-up", note: "Preview only: nothing is flagged in this prototype" }, "flag", { offline: "You're offline" })] : [];
      var cards = tasks.map(function (t) { return { title: t.item.title, meta: P.personName(a, t.task.ta_id) + " · " + names(a, t.task.learner_ids) + " · " + questions(a, t.task) + " · grading due " + P.when(a, t.task.grading_due) }; });
      return P.stack(a, [P.handoff(a, { title: "Open on a larger screen", protectiveActions: flag }), top(a), cards.length ? a.K.list({ label: "Grading tasks", items: cards }) : emptyPlan(a), instructorCoverage(a), staffingHistory(a), staffingExamples(a), links(a, tasks)]);
    }
    if (!tasks.length) return P.stack(a, [top(a), emptyPlan(a), instructorCoverage(a), staffingHistory(a), staffingExamples(a), links(a, tasks)]);
    var main = P.stack(a, [top(a), allocation(a, tasks), instructorCoverage(a)].concat(tasks.map(function (t) { return timeline(a, t); })).concat([staffingHistory(a), staffingExamples(a), links(a, tasks)]));
    return a.K.rail(a.ctx, { main: main, rail: controls(a, tasks), railLabel: "Plan" });
  }

  // A6: learners and questions only for a task whose access is active; an ended task shows its title only.
  function ownTask(a, t) {
    var scope = t.active ? a.sel.taScope(a.view, t.item.id, a.who) : null;
    if (!scope) return a.K.section({ title: t.item.title, body: P.p("Access ended " + P.when(a, t.task.access_end) + ". No learner data is shown."), level: 2 });
    return a.K.section({
      title: t.item.title, level: 2, body: a.K.kv([
        { label: "Learners", value: names(a, scope.learnerIds) }, { label: "Questions", value: P.questionsText(scope.questionIds) },
        { label: "Grading due", value: P.when(a, t.task.grading_due) }, { label: "Your access ends", value: P.when(a, t.task.access_end) },
      ]),
    });
  }

  function ta(a) {
    var tasks = a.state === "firstUseEmpty" ? [] : ownTasks(a);
    var live = tasks.filter(function (t) { return t.active && a.sel.taScope(a.view, t.item.id, a.who); });
    var flag = live.length ? [guarded(a, { label: "Flag for instructor review", note: "Preview only: nothing is flagged in this prototype" }, "flag", { offline: "You're offline" })] : [];
    return P.stack(a, [
      P.handoff(a, { title: "Open on a larger screen", protectiveActions: flag }), top(a),
      tasks.length ? P.stack(a, tasks.map(function (t) { return ownTask(a, t); })) : emptyPlan(a),
      P.p("The instructor sets grading deadlines"), links(a, live),
    ]);
  }

  function body(a) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "the grading plan")]);
    return a.role === "ta" ? ta(a) : instructor(a);
  }

  WB.definePage("W57", {
    states: STATES,
    na: P.na(STATES, {
      conflict: "Each learner and question has one grader in this plan, so no overlap is drawn",
      saving: "The plan is not editable beyond preview in this prototype", saveFailed: "The plan is not editable beyond preview in this prototype",
      success: "The plan is not editable beyond preview in this prototype",
    }),
    variants: { examples: "Staffing examples" },
    render: function (a) { return P.shell(a, { title: a.page.title, body: body(a) }, { page: "W57" }); },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
