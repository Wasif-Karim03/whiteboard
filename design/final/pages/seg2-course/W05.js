/* W05 Today (Home). Global page, no course shell. Student: next due work and own counts. Instructor: PS4 progress
   and the grading and release links. TA: each grading task, read only through an active task scope (A6); after
   access ends, this page's own notice with no learner data and no self-link. Rail: upcoming events, unread
   announcements, activity and the latest release time, never a score. Contract: pages/PAGES.md, pages/SPINE.md;
   decisions in pages/seg2-course/NOTES.md (chosen by Claude under owner delegation). */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "firstUseEmpty", "offline", "permissionUnavailable"];
  var WEEK_MINUTES = 7 * 24 * 60;
  var ENDED = "Your grading access for this course has ended";
  var KINDS = {
    feedbackReleased: "Feedback is out", announcementUpdated: "Announcement changed", announcementPublished: "New announcement",
    discussionReply: "New reply", workReceived: "Work handed in",
  };

  function itemGo(id) { return P.recordGo("W19", "assessment", id) || P.recordGo("W25", "assessment", id); }

  // TA tasks for published course items, found through the selector (A4, A6).
  function taTasks(a) {
    return P.assessments(a).map(function (x) { return a.sel.gradingTaskFor(a.view, a.who.personId, x.id); }).filter(Boolean);
  }
  function taskActive(a, task) {
    return a.sel.taTaskAccess(a.view, task.assessment_id, a.who).active && Boolean(a.sel.taScope(a.view, task.assessment_id, a.who));
  }
  function itemTitle(a, id) { var x = a.sel.assessment(a.view, id); return x ? x.title : ""; }

  // ---------- Main: tasks ----------
  function studentTasks(a) {
    var next = a.sel.nextDue(a.view, a.who.courseId, a.who);
    var nextGo = next ? itemGo(next.assessmentId) : null;
    var priority = next ? a.K.section({ title: "Your next step", level: 2, actions: nextGo ? [{ label: a.sel.assessment(a.view, next.assessmentId).kind === "quiz" ? "View quiz rules" : "View assignment", go: nextGo, kind: "primary" }] : [], body: P.p(itemTitle(a, next.assessmentId)) + P.p("Due " + P.when(a, next.due)) + P.status(a, P.ownSubmission(a, next.assessmentId), true) })
      : a.K.empty({ title: "Nothing due", body: P.p("You have no open work with a due date ahead.") });
    var items = P.assessments(a).map(function (it) {
      var quiz = it.quiz_id ? a.sel.quiz(a.view, it.quiz_id) : null;
      return { item: it, due: quiz ? quiz.close : it.due };
    }).filter(function (row) { return row.due && (!next || row.item.id !== next.assessmentId) && !a.sel.isBefore(row.due, a.view.clock); })
      .sort(function (x, y) { return a.sel.minutesBetween(y.due, x.due); });
    var upcoming = items.length ? a.K.list({ label: "Upcoming coursework", items: items.map(function (row) {
      var go = itemGo(row.item.id);
      return { title: row.item.title, meta: "Due " + P.when(a, row.due), go: go || undefined,
        trailing: P.status(a, P.ownSubmission(a, row.item.id), true) };
    }) }) : P.p("No upcoming coursework with a due date");
    var c = a.sel.courseworkCounts(a.view, a.who.courseId, a.who.personId);
    var progress = c.all ? a.K.progress({ label: "Submitted work", value: c.handedIn + c.released, max: c.all }) : P.p("No coursework is published yet");
    var stats = a.K.grid(a.ctx, { cols: 3, compactCols: 2, items: [
      a.K.stat({ label: "To do", value: String(c.toDo) }),
      a.K.stat({ label: "Awaiting feedback", value: String(c.handedIn) }),
      a.K.stat({ label: "Feedback available", value: String(c.released) }),
    ] });
    var course = P.recordGo("W14", "course", a.who.courseId);
    return '<div class="wb-overview"><div class="wb-priority">' + priority + '</div><div class="wb-tasklist">' + a.K.section({ title: "Other upcoming work", level: 2, body: upcoming }) + '</div>' + a.K.disclosure({ id: P.id(a, "progress"), summary: "Course progress", body: progress + P.p("Includes handed-in work and work with released feedback.") + stats }) + P.links(a, [{ label: "Coursework", go: "W18" }, course ? { label: "Course home", go: course } : null]) + '</div>';
  }

  function otherTeachingCourses(a) {
    var courses = a.sel.calendarCourses(a.view, a.who).filter(function (course) { return course.id !== a.who.courseId && !course.archived && a.sel.verifiedRole(a.view, a.who, course.id) === "instructor"; });
    return P.stack(a, courses.map(function (course) {
      var who = { role: a.role, personId: a.who.personId, courseId: course.id };
      var rows = a.sel.courseAssessments(a.view, who).filter(function (item) { return (a.sel.receiptsFor(a.view, item.id, who).length || (a.sel.releasesFor(a.view, item.id, who) || []).length) && item.grading_intent !== "ungraded"; }).map(function (item) {
        var ready = (a.sel.releaseReady(a.view, item.id, who) || []).filter(function (r) { return r.included; }).length;
        var reviewed = a.sel.reviewProgress(a.view, item.id, who);
        return { title: item.title, meta: (reviewed ? reviewed.reviewed + " of " + reviewed.of + " reviewed. " : "") + ready + " ready for release", go: WB.Teaching.go(a, ready ? "W53" : "W48", { courseId: course.id, assessmentId: item.id, learnerId: null, receiptId: null }) };
      });
      return a.K.section({ title: course.code + ": " + course.title, level: 2, body: rows.length ? a.K.list({ label: "Teaching work in " + course.code, items: rows }) : P.p("No submitted work awaiting review"), actions: [{ label: "Open course", go: WB.Teaching.go(a, "W35", { courseId: course.id, assessmentId: null, learnerId: null, receiptId: null }) }] });
    }));
  }
  function instructorTasks(a) {
    var id = P.assessmentId(a);
    var item = a.sel.assessment(a.view, id);
    if (!item || a.sel.verifiedRole(a.view, a.who, item.course_id) !== "instructor") return P.permissionNotice(a, "You are not teaching this course");
    var got = a.sel.receivedProgress(a.view, id, a.who);
    var done = a.sel.reviewProgress(a.view, id, a.who);
    var ready = (a.sel.releaseReady(a.view, id, a.who) || []).filter(function (r) { return r.included; });
    var queue = P.recordGo("W48", "assessment", id);
    var release = P.recordGo("W53", "assessment", id);
    var action = ready.length && release ? { label: "Review release", go: release, kind: "primary" } : queue ? { label: "Open grading queue", go: queue, kind: "primary" } : null;
    var counts = [got ? { label: "Handed in", value: got.received + " of " + got.of } : null, done ? { label: "Reviewed", value: done.reviewed + " of " + done.of } : null, { label: "Ready for release", value: String(ready.length) }].filter(Boolean);
    var work = a.K.section({ title: item.title, level: 3, body: a.K.kv(counts) + P.p("Reviewed results stay held until you release them."), actions: action ? [action] : [] });
    var secondary = [{ label: "Manage course content", go: "W35" }, { label: "Manage assessments", go: "W18" }, { label: "Gradebook", go: "W51" }];
    if (release) secondary.push({ label: ready.length ? "Release feedback" : "View release history", go: release });
    return P.stack(a, [a.K.section({ title: "Review and release", level: 2, body: work }), a.K.section({ title: "Course workspace", level: 2, body: P.links(a, secondary) }), otherTeachingCourses(a)]);
  }

  function taTask(a, task) {
    var name = itemTitle(a, task.assessment_id);
    if (!taskActive(a, task)) return a.K.section({ title: name, level: 2, body: P.p("Access ended " + P.when(a, task.access_end)) });
    var done = a.sel.reviewProgress(a.view, task.assessment_id, a.who);
    var go = P.gradingGo(a, task.assessment_id);
    var body = a.K.kv([{ label: "Grading due", value: P.when(a, task.grading_due) }, { label: "Access ends", value: P.when(a, task.access_end) }]) +
      (done ? P.p("You have reviewed " + done.reviewed + " of " + done.of) : "") +
      (go ? P.links(a, [{ label: "Open allocated grading", go: go }]) : P.p("Grading for this item is not drawn in this prototype"));
    return a.K.section({ title: name, level: 2, body: body });
  }

  // Course-level access end: this page's own notice (P.taEndedNotice links back here), no learner data.
  function endedNotice(a, tasks) {
    var end = a.sel.accessEnd(a.view, a.who.personId, a.who.courseId);
    var names = tasks.map(function (t) { return itemTitle(a, t.assessment_id); }).filter(Boolean).join(", ");
    var body = (end ? P.p("Access ended " + P.when(a, end) + ".") : "") + (names ? P.p("Grading task: " + names + ".") : "") + P.p("Marks you saved stay with the instructor.");
    return P.stack(a, [
      a.K.notice({ tone: "info", title: ENDED, body: body, actions: [{ label: "Get help", go: "W12" }] }),
      a.K.button({ label: "Open allocated grading", disabled: true, reason: "Your grading access has ended", id: P.id(a, "grading") }),
    ]);
  }

  function taMain(a) {
    var tasks = taTasks(a);
    if (!tasks.length) return a.K.empty({ title: "No grading is allocated to you", body: P.p("The instructor allocates grading tasks.") });
    if (P.taEnded(a)) return endedNotice(a, tasks);
    return P.stack(a, tasks.map(function (t) { return taTask(a, t); }));
  }

  function tasks(a) {
    if (a.state === "firstUseEmpty") return a.K.empty({ title: "Nothing needs you today", action: { label: "Open your courses", go: "W06" } });
    if (a.role === "student") return studentTasks(a);
    if (a.role === "instructor") return instructorTasks(a);
    return taMain(a);
  }

  // ---------- Rail ----------
  function upcoming(a) {
    var to = a.sel.addMinutes(a.view.clock, WEEK_MINUTES);
    var ended = P.taEnded(a);
    var rows = a.sel.eventsFor(a.view, a.who, a.view.clock, to).filter(function (ev) {
      if (ev.kind !== "gradingTask" || a.role !== "ta") return true;
      var task = taTasks(a).filter(function (t) { return t.id === ev.task_id; })[0];
      return !ended && Boolean(task) && taskActive(a, task);
    }).slice().sort(function (x, y) { return a.sel.minutesBetween(y.start, x.start); });
    if (!rows.length) return P.p("Nothing on your calendar this week");
    return a.K.list({ label: "Upcoming events", items: rows.map(function (ev) { return { title: ev.name, meta: P.when(a, ev.start) }; }) });
  }

  function latestTitle(a, annId) {
    var ann = a.view.data.comms.announcements.filter(function (x) { return x.id === annId; })[0];
    return ann ? ann.revisions[ann.revisions.length - 1].title : "";
  }
  function announcements(a) {
    var list = a.sel.unreadAnnouncements(a.view, a.who.courseId, a.who.personId);
    if (!list.length) return P.p("No unread announcements");
    return a.K.list({
      label: "Unread announcements",
      items: list.map(function (u) { return { title: latestTitle(a, u.id), meta: u.reason === "new" ? "New" : "Changed since you read it", go: P.recordGo("W29", "announcement", u.id) || undefined }; }),
    });
  }

  // R02: an activity row resolves only against records this viewer may see now (published course assessments,
  // published course announcements, visible topics, scoped receipts); any other row is not shown at all.
  function publishedTitle(a, id) { var x = P.assessments(a).filter(function (it) { return it.id === id; })[0]; return x ? x.title : ""; }
  function announcementTitle(a, id) {
    var ann = a.view.data.comms.announcements.filter(function (x) { return x.id === id && x.state === "published" && x.course_id === a.who.courseId; })[0];
    return ann ? ann.revisions[ann.revisions.length - 1].title : "";
  }
  function refTitle(a, ref) {
    if (ref.type === "assessment") return publishedTitle(a, ref.id);
    if (ref.type === "announcement") return announcementTitle(a, ref.id);
    if (ref.type === "receipt") { var r = P.receiptById(a, ref.id); return r ? publishedTitle(a, r.assessment_id) : ""; }
    var topic = ref.type === "discussion" ? a.sel.visibleTopics(a.view, a.who.courseId, a.who.personId).filter(function (t) { return t.id === ref.id; })[0] : null;
    return topic ? topic.title : "";
  }
  function activity(a) {
    if (P.taEnded(a)) return "";
    var items = a.sel.activityFor(a.view, a.who.personId).map(function (x) {
      var title = refTitle(a, x.ref);
      return title ? { title: (KINDS[x.kind] || "Update") + ": " + title, meta: P.when(a, x.at), go: x.go } : null;
    }).filter(Boolean);
    return items.length ? a.K.list({ label: "Recent activity", items: items }) : P.p("No recent activity");
  }

  function releaseLine(a) {
    var at = a.sel.lastReleaseAt(a.view, a.who.courseId, a.who);
    if (!at) return "";
    return P.p("Latest feedback released " + P.when(a, at)) + (a.role === "student" ? P.links(a, [{ label: "My grades", go: "W24" }]) : "");
  }

  function rail(a) {
    return P.stack(a, [
      a.state === "offline" ? a.K.flag("lastKnown") : "",
      a.K.section({ title: "Coming up", level: 2, body: upcoming(a) }),
      a.K.section({ title: "Announcements", level: 2, body: announcements(a) }),
      P.taEnded(a) ? "" : a.K.section({ title: "Activity", level: 2, body: activity(a) }),
      releaseLine(a),
      P.links(a, [{ label: "View calendar", go: "W07" }, { label: "View activity", go: "W08" }]),
    ]);
  }

  // ---------- Body ----------
  function header(a) {
    var c = a.sel.course(a.view, a.who.courseId);
    return c ? P.p(c.code + " · " + c.term) : "";
  }

  function denied(a) {
    if (P.taEnded(a) && taTasks(a).length) return endedNotice(a, taTasks(a));
    return a.K.notice({
      tone: "info", title: "Your access to this course has changed", body: P.p("Nothing from this course is shown until your access is confirmed."),
      actions: [{ label: "Open your courses", go: "W06" }, { label: "Get help", go: "W12" }],
    });
  }

  function body(a) {
    if (a.state === "permissionUnavailable") return P.stack(a, [header(a), denied(a)]);
    if (a.state === "loading") return P.stack(a, [header(a), P.loading(a, "your day")]);
    var main = P.stack(a, [tasks(a), a.K.disclosure({ id: P.id(a, "updates"), summary: "Calendar and activity", body: rail(a) })]);
    return P.stack(a, [header(a), a.state === "offline" ? P.offlineNotice(a) : "", main]);
  }

  WB.definePage("W05", {
    states: STATES,
    na: P.na(STATES, {
      filteredEmpty: "Home has no filters",
      archived: "Past terms are drawn on the Courses page",
      notYetAvailable: "Home lists only work that is already published",
    }),
    render: function (a) { return { title: a.role === "instructor" ? "Teaching today" : a.role === "ta" ? "My grading tasks" : "Today", navActive: "today", body: body(a) }; },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
