/* Whiteboard Phase 2b fixtures: the four calendar records named in spec/docs/22-fixtures-overview.html
   (lecture-oct21, office-hours, private-shift, grading-due).
   grading-due is derived per grading task in WB.sel.calendarEvents, not stored.
   Times come from the board copy's W07 week view (PHYS 110 class Wed 9:00 AM, Hollis Hall 104; Office hours
   Tue 2 PM, Physics lab; Library work shift Wed 5:00 PM to 8:00 PM, only you). The grading-due event is
   task-backed: its owner, course and time come from its grading task in the resolved view (REV-01), so a
   scenario that moves, reassigns or removes the task changes or removes the event too. Fictional, "reconstructed". */
(function (root) {
  "use strict";
  var WB = root.WB;
  var sel = WB.sel;
  var PHYS = "phys110-f26";

  WB.defineFrozen(WB.data, "calendar", {
    meta: { source: "reconstructed", basis: ["spec/docs/22-fixtures-overview.html", "board copy W07 week view"] },
    // visibility: course (everyone in the course), private (owner only), staffTask (owner and instructors).
    events: [
      { id: "lecture-oct21", course_id: PHYS, owner_id: null, name: "PHYS 110 class", location: "Hollis Hall 104", start: "2026-10-21T09:00:00-04:00", end: "2026-10-21T09:50:00-04:00", kind: "class", visibility: "course", source: "registrar" },
      { id: "office-hours", course_id: PHYS, owner_id: "reyes", name: "Office hours", location: "Physics lab", start: "2026-10-20T14:00:00-04:00", end: "2026-10-20T15:00:00-04:00", kind: "officeHours", visibility: "course", source: "course" },
      { id: "private-shift", course_id: null, owner_id: "aisha", name: "Library work shift", location: null, start: "2026-10-21T17:00:00-04:00", end: "2026-10-21T20:00:00-04:00", kind: "personal", visibility: "private", source: "personal" },
    ],
  });

  // Every event in the view: the stored events plus one grading-due event per grading task in the resolved
  // view (REV-01, REV-02). A task-derived event takes its owner, course and time from the task, its title from
  // the assessment, and the stable id "grading-due-<task id>"; adding, moving, reassigning or removing a task
  // changes the calendar the same way.
  WB.defineFrozen(sel, "calendarEvents", function (view) {
    var derived = view.data.staff.grading_tasks.map(function (task) {
      var item = sel.assessment(view, task.assessment_id);
      return Object.freeze({
        id: "grading-due-" + task.id, task_id: task.id, course_id: task.course_id, owner_id: task.ta_id,
        name: (item ? item.title : task.assessment_id) + " grading due", location: null,
        start: task.grading_due, end: task.grading_due, kind: "gradingTask", visibility: "staffTask", source: task.id,
      });
    });
    return view.data.calendar.events.concat(derived);
  });

  // Enrolled scopes, independently of whether a calendar currently contains any events.
  WB.defineFrozen(sel, "calendarCourses", function (view, who) {
    if (!who) return [];
    return view.data.world.courses.filter(function (course) { return Boolean(sel.verifiedRole(view, who, course.id)); });
  });
  WB.defineFrozen(sel, "calendarZone", function (view) { return view.data.world.institution.timezone; });

  // Shared projection for personal and course calendars. Browsing never changes the authority clock.
  WB.defineFrozen(sel, "calendarEntries", function (view, who, courseId) {
    var courses = sel.calendarCourses(view, who);
    var ids = courses.map(function (c) { return c.id; });
    if (!ids.length || (courseId !== null && courseId !== undefined && ids.indexOf(courseId) < 0)) return [];
    function courseFor(id) { return courses.filter(function (c) { return c.id === id; })[0]; }
    function inScope(id) { return ids.indexOf(id) >= 0 && (!courseId || id === courseId); }
    function taskVisible(ev) {
      var task = view.data.staff.grading_tasks.filter(function (t) { return t.id === ev.task_id; })[0];
      var item = task ? sel.assessment(view, task.assessment_id) : null;
      if (!task || !item || !item.published || item.course_id !== ev.course_id) return false;
      var role = sel.verifiedRole(view, who, ev.course_id);
      if (role === "instructor") return true;
      return role === "ta" && task.ta_id === who.personId && sel.taTaskAccess(view, task.assessment_id, who).active && Boolean(sel.taScope(view, task.assessment_id, who));
    }
    var events = sel.calendarEvents(view).filter(function (ev) {
      if (ev.visibility === "private") return !courseId && ev.owner_id === who.personId;
      if (!inScope(ev.course_id)) return false;
      if (ev.visibility === "staffTask") return taskVisible(ev);
      return ev.visibility === "course";
    }).map(function (ev) {
      var course = courseFor(ev.course_id);
      var go = null;
      if (ev.kind === "gradingTask") {
        var task = view.data.staff.grading_tasks.filter(function (t) { return t.id === ev.task_id; })[0];
        go = sel.verifiedRole(view, who, ev.course_id) === "instructor" ? sel.recordGo("W57", "task", task.id) : sel.recordGo("W48", "assessment", task.assessment_id);
      }
      return Object.freeze({ id: ev.id, courseId: ev.course_id, courseLabel: course ? course.code : "Personal", courseKey: course ? course.key : "personal", name: ev.name, start: ev.start, end: ev.end || ev.start, kind: ev.kind, where: ev.location || "", source: ev.source === "registrar" ? "Registrar timetable" : ev.kind === "gradingTask" ? "Grading plan" : ev.visibility === "private" ? "Private · only you" : "Course", go: go, private: ev.visibility === "private" });
    });
    var due = view.data.coursework.assessments.filter(function (item) { return item.published && inScope(item.course_id); }).map(function (item) {
      var quiz = item.quiz_id ? sel.quiz(view, item.quiz_id) : null;
      var start = quiz ? quiz.close : item.due;
      if (!start) return null;
      var course = courseFor(item.course_id);
      return Object.freeze({ id: "due-" + item.id, courseId: item.course_id, courseLabel: course.code, courseKey: course.key, name: item.title, start: start, end: start, kind: "due", where: "", source: "Coursework", go: sel.verifiedRole(view, who, item.course_id) === "instructor" ? (item.kind === "quiz" ? "W41" : "W40") + "?tc=" + encodeURIComponent(item.course_id) + "&ta=" + encodeURIComponent(item.id) : sel.recordGo("W19", "assessment", item.id) || sel.recordGo("W25", "assessment", item.id) || (item.kind === "quiz" ? "W25" : "W19") + "?tc=" + encodeURIComponent(item.course_id) + "&ta=" + encodeURIComponent(item.id), private: false });
    }).filter(Boolean);
    return Object.freeze(events.concat(due).sort(function (a, b) { return sel.minutesBetween(b.start, a.start) || a.id.localeCompare(b.id); }));
  });

  // Events the viewer may see whose start falls in [fromIso, toIso). The viewer must match an enrollment by
  // person and role (M3); none gives []. Private events: owner only. Staff-task events: owner, or a verified
  // instructor of the event's course. Course events: enrolled in the course.
  WB.defineFrozen(sel, "eventsFor", function (view, who, fromIso, toIso) {
    var enrollment = who ? view.data.world.enrollments.filter(function (e) { return e.person_id === who.personId && e.role === who.role; })[0] : null;
    if (!enrollment) return [];
    return sel.calendarEvents(view).filter(function (ev) {
      if (sel.isBefore(ev.start, fromIso) || !sel.isBefore(ev.start, toIso)) return false;
      if (ev.visibility === "private") return ev.owner_id === who.personId;
      if (ev.visibility === "staffTask") return ev.owner_id === who.personId || sel.verifiedRole(view, who, ev.course_id) === "instructor";
      return enrollment.course_ids.indexOf(ev.course_id) >= 0;
    });
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
