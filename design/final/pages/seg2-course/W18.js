/* W18 Coursework list (Phase 3 spine). Course-level. Student: filter row from courseworkCounts and every
   published item with its personal due time and own status; row links follow the PAGES.md W18 rule. Staff:
   instructor planning includes unpublished items and record-matching editor/grading links; TAs see only active allocations. Contract: pages/PAGES.md, pages/SPINE.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "firstUseEmpty", "filteredEmpty", "offline", "permissionUnavailable"];
  var FILTERS = { todo: ["notStarted", "draft", "queued"], handed: ["received", "receivedNotReleased"], feedback: ["released", "feedbackUpdated"] };
  function filterName(a) { return a.state === "filteredEmpty" ? "todo" : (a.role === "student" && FILTERS[a.variant] ? a.variant : "all"); }
  function matches(a, item, filter) {
    if (filter === "all") return true;
    var sub = P.ownSubmission(a, item.id);
    var status = WB.manifest.status.keyFor(sub, "student", { own: true });
    return Boolean(status) && FILTERS[filter].indexOf(status.key) >= 0;
  }

  function dueOf(a, item) {
    var quiz = item.quiz_id ? a.sel.quiz(a.view, item.quiz_id) : null;
    var due = quiz ? quiz.close : item.due;
    return due ? P.when(a, due) : "No due date";
  }

  // ps4 → W19 (W23 once released); motion → W19:motion; quiz3 → W25; quiz2 → W27:quiz2; others plain.
  function studentGo(a, item) {
    var res = a.sel.resultFor(a.view, a.who.personId, item.id, a.who);
    var sub = a.sel.submissionFor(a.view, a.who.personId, item.id);
    var legacy = P.recordGo(item.quiz_id ? "W25" : "W19", "assessment", item.id);
    if (!a.selection && legacy) {
      if (!item.quiz_id && res && res.status !== null && legacy.indexOf(":") < 0) return "W23";
      return legacy;
    }
    if (item.quiz_id && sub && sub.receipt_id) return WB.Teaching.go(a, "W27", { assessmentId: item.id, learnerId: a.who.personId, receiptId: sub.receipt_id });
    return WB.Teaching.go(a, item.quiz_id ? "W25" : res && res.status !== null ? "W23" : "W19", { assessmentId: item.id, learnerId: a.who.personId, receiptId: null });
  }

  function studentRow(a, item) {
    var row = { id: item.id, cells: { title: esc(item.title), due: esc(dueOf(a, item)), status: P.status(a, P.ownSubmission(a, item.id), true) } };
    var go = studentGo(a, item);
    return go ? { id: row.id, cells: row.cells, go: go } : row;
  }

  function activeTask(a, item) { return a.sel.taTaskAccess(a.view, item.id, a.who).active && Boolean(a.sel.taScope(a.view, item.id, a.who)); }
  function staffGo(a, item) {
    if (a.role === "instructor") return !a.selection && (P.recordGo("W40", "assessment", item.id) || P.recordGo("W41", "assessment", item.id)) || WB.Teaching.go(a, item.kind === "quiz" ? "W41" : "W40", { assessmentId: item.id, receiptId: null, learnerId: null });
    return P.gradingGo(a, item.id);
  }
  function staffRow(a, item, withCounts) {
    var task = a.role === "ta" ? a.sel.gradingTaskFor(a.view, a.who.personId, item.id) : null;
    var cells = { title: esc(item.title), due: esc(task ? P.when(a, task.grading_due) : dueOf(a, item)) };
    if (a.role === "instructor") { cells.publication = item.published ? "Published" : "Unpublished"; cells.intent = esc(a.sel.teachingAssessmentIntent(a.view, a.who, item.id) || ""); }
    if (withCounts) {
      var got = a.sel.receivedProgress(a.view, item.id, a.who);
      var done = a.sel.reviewProgress(a.view, item.id, a.who);
      cells.handed = got ? esc(got.received + " of " + got.of) : "";
      cells.reviewed = done ? esc(done.reviewed + " of " + done.of) : "";
    }
    if (a.role === "instructor") {
      var queue = WB.Teaching.go(a, "W48", { assessmentId: item.id, receiptId: null, learnerId: null });
      var release = WB.Teaching.go(a, "W53", { assessmentId: item.id, receiptId: null, learnerId: null });
      cells.actions = P.links(a, [queue ? { label: queue && queue.indexOf("W49") === 0 ? "Grade submission" : "Grade submissions", go: queue } : null, release ? { label: "Review release", go: release } : null]);
    }
    var go = staffGo(a, item);
    return go ? { id: item.id, cells: cells, go: go } : { id: item.id, cells: cells };
  }
  function columns(a, withCounts) {
    var cols = [{ key: "title", label: a.role === "instructor" ? "Assessment" : "Title", primary: true }, { key: "due", label: a.role === "ta" ? "Grading due" : "Due" }];
    if (a.role === "student") return cols.concat([{ key: "status", label: "Status" }]);
    if (a.role === "instructor") cols.push({ key: "publication", label: "Publication" }, { key: "intent", label: "Grading" });
    if (withCounts) cols = cols.concat([{ key: "handed", label: "Handed in" }, { key: "reviewed", label: "Reviewed" }]);
    if (a.role === "instructor") cols.push({ key: "actions", label: "Actions" });
    return cols;
  }

  function filterRow(a, current) {
    var c = a.sel.courseworkCounts(a.view, a.who.courseId, a.who.personId);
    var items = [["all", "All", c.all], ["todo", "To do", a.state === "filteredEmpty" ? 0 : c.toDo], ["handed", "Handed in", c.handedIn], ["feedback", "Feedback out", c.released]];
    return a.K.tabs({
      label: "Filter coursework",
      items: items.map(function (x) { return { id: P.id(a, "filter-" + x[0]), label: x[1] + " (" + x[2] + ")", go: x[0] === "all" ? "W18" : "W18:" + x[0], current: x[0] === current }; }),
    });
  }

  function emptyFor(a) {
    if (a.role === "instructor" && a.state === "filteredEmpty") return { title: "No assessments in this view", action: { label: "Show all assessments", go: "W18" } };
    if (a.role === "ta") return { title: "No active grading allocations", body: P.p("The instructor allocates grading tasks.") };
    if (a.state === "filteredEmpty" || filterName(a) !== "all") {
      return { title: "No work matches this filter", body: P.p("Other coursework is still in the course."), action: { label: "Clear filters", go: "W18" } };
    }
    if (a.role === "instructor") return { title: "No assessments yet", action: { label: "Open course builder", go: "W35" } };
    return { title: "No coursework is published yet", body: P.p("The instructor publishes assignments and quizzes here.") };
  }

  function table(a, withCounts) {
    var items = a.state === "firstUseEmpty" || a.state === "filteredEmpty" ? [] : a.sel.courseAssessments(a.view, a.who).filter(function (item) { return a.role === "student" ? matches(a, item, filterName(a)) : a.role === "ta" ? activeTask(a, item) : true; });
    var rows = items.map(function (item) { return a.role === "student" ? studentRow(a, item) : staffRow(a, item, withCounts); });
    return a.K.table(a.ctx, { id: P.id(a, "work"), caption: a.role === "instructor" ? "Assessment management" : a.role === "ta" ? "Assigned grading" : "Coursework", columns: columns(a, withCounts), rows: rows, empty: emptyFor(a) });
  }

  function content(a) {
    if (a.role === "student") {
      var filter = a.state === "firstUseEmpty" ? "" : filterRow(a, filterName(a));
      return P.stack(a, [filter, table(a, false), P.links(a, [{ label: "My grades", go: "W24" }])]);
    }
    var notice = "";
    if (a.role === "ta") {
      var allocated = a.sel.courseAssessments(a.view, a.who).some(function (item) { return Boolean(a.sel.gradingTaskFor(a.view, a.who.personId, item.id)); });
      if (allocated && P.taEnded(a)) notice = P.taEndedNotice(a, P.assessmentId(a));
      else if (P.taTaskEnded(a, P.assessmentId(a))) notice = P.taTaskEndedNotice(a, P.assessmentId(a));
    }
    return P.stack(a, [notice, table(a, true), a.role === "instructor" ? P.links(a, [{ label: "Course builder", go: "W35" }, { label: "Gradebook", go: "W51" }]) : ""]);
  }

  function body(a) {
    if (a.state === "permissionUnavailable") return P.permissionNotice(a, "You are not enrolled in this course");
    if (a.state === "loading") return P.loading(a, "coursework");
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown"), content(a)]);
    return content(a);
  }

  WB.definePage("W18", {
    states: STATES,
    na: P.na(STATES, { invalid: "Filters do not take a typed value here" }),
    variants: { todo: "To do", handed: "Handed in", feedback: "Feedback out" },
    render: function (a) { return P.shell(a, { title: a.role === "instructor" ? "Assessments" : a.role === "ta" ? "Assigned grading" : a.page.title, body: body(a) }, { section: a.role === "instructor" ? "assessments" : a.role === "ta" ? "grading" : "coursework" }); },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
