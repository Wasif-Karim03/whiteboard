/* W32 Course calendar: shared month/week/schedule views, verified course scope, no private events.
   Calendar browsing never changes the scenario clock. Other enrolled courses have honest empty views;
   their unrelated prototype pages are not implied to exist. Chosen by Codex under owner delegation. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "firstUseEmpty", "filteredEmpty", "offline", "permissionUnavailable"];
  var EDIT_NA = "Course-event editing is preview-only; the editor is not drawn";

  function tools(a, course) {
    var links = [{ label: "View combined calendar", go: "W07" }];
    if (course.id === a.who.courseId && (a.role === "instructor" || (a.role === "ta" && !P.taEnded(a)))) links.push({ label: "Grading deadlines", go: "W57" });
    return '<div class="wb-cal-tools">' + P.links(a, links) + (a.role === "instructor" ? a.K.button({ label: "New course event", id: P.id(a, "new"), note: "Preview only: course events are not published in this prototype" }) : "") + '</div>';
  }

  function render(a) {
    var state = WB.calendar.normalize(a, a.calendar);
    var course = a.sel.calendarCourses(a.view, a.who).filter(function (c) { return c.id === state.courseId; })[0];
    var title = course ? course.code + " calendar" : "Course calendar";
    var body;
    if (a.state === "permissionUnavailable" || !course) body = P.permissionNotice(a, "You are not enrolled in this course");
    else {
      var offline = a.state === "offline" ? P.stack(a, [a.K.notice({ tone: "warning", title: "The registrar timetable may be out of date", body: P.p("Nothing here changes the registrar's record.") }), a.K.flag("lastKnown")]) : "";
      body = P.stack(a, [
        P.taEnded(a) ? P.taEndedNotice(a, P.assessmentId(a)) : "",
        offline,
        a.state === "loading" ? P.loading(a, "the course calendar") : WB.calendar.render(a, state),
        tools(a, course),
      ]);
    }
    var opts = { title: title, body: body, navActive: "calendar" };
    return course && course.id === a.who.courseId ? P.shell(a, opts, { section: "calendar" }) : opts;
  }
  WB.definePage("W32", {
    states: STATES,
    na: P.na(STATES, { invalid: EDIT_NA, saving: EDIT_NA, saveFailed: EDIT_NA, destructive: EDIT_NA }),
    render: render,
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
