/* Whiteboard Phase 2b: the 63 board pages in route-manifest order.
   Sources: spec/docs/20-route-manifest-63-routes.html (id, title, route, roles, scope, priority, legacy;
   transcribed), design/final/tools/page_meta.mjs (segment DD:75-80, stage DD:88-150) and
   design/final/tracker/page_tracker.csv (platform tiers, BD11). O01-O03 are optional and off by default
   (final plan §6, owner answer 4). Spec page files: spec/pages/<id>.html (spec/index.json). */
(function (root) {
  "use strict";
  var WB = root.WB;

  function p(id, title, route, roles, scope, priority, legacy, segment, stage, tiers) {
    return {
      id: id, title: title, route: route, roles: roles, scope: scope, priority: priority, legacy: legacy,
      segment: segment, stage: stage,
      platforms: { web: tiers[0], ipad: tiers[1], iphone: tiers[2] },
      spec: "spec/pages/" + id + ".html",
      optional: id.charAt(0) === "O",
    };
  }

  var PAGES = [
    p("W01", "Institution sign-in", "/app/sign-in", ["guest"], "required", "core", ["P41"], 1, "0", ["full", "full", "full"]),
    p("W02", "Auth return/recovery", "/app/auth/return", ["guest", "student", "instructor", "ta"], "required", "core", ["P41"], 1, "0", ["full", "full", "full"]),
    p("W03", "Invitation", "/app/invitations/:invitationId", ["guest", "student", "instructor", "ta"], "required", "core", ["P42"], 1, "0", ["full", "full", "full"]),
    p("W04", "Onboarding", "/app/onboarding", ["student", "instructor", "ta"], "required", "core", ["P43"], 1, "0", ["full", "full", "full"]),
    p("W05", "Role-aware Home", "/app/home", ["student", "instructor", "ta"], "required", "core", ["S01", "S14", "S17"], 2, "0", ["full", "full", "full"]),
    p("W06", "Courses and term archive", "/app/courses", ["student", "instructor", "ta"], "required", "core", ["S02"], 2, "0", ["full", "full", "full"]),
    p("W07", "Personal/global academic calendar", "/app/calendar", ["student", "instructor", "ta"], "required", "core", ["S12"], 2, "3", ["full", "full", "full"]),
    p("W08", "Activity and notification settings", "/app/activity", ["student", "instructor", "ta"], "required", "core", ["S13"], 1, "3", ["full", "full", "full"]),
    p("W09", "Global academic search", "/app/search", ["student", "instructor", "ta"], "required", "core", ["P45"], 1, "3", ["full", "full", "full"]),
    p("W10", "Profile/account/preferences", "/app/account", ["student", "instructor", "ta"], "required", "core", ["P44"], 1, "0", ["full", "full", "full"]),
    p("W11", "Academic software/tools directory", "/app/tools", ["student", "instructor", "ta"], "required", "follow-on", [], 1, "3", ["full", "full", "full"]),
    p("W12", "Help/technical request", "/app/help", ["guest", "student", "instructor", "ta"], "required", "follow-on", ["P46"], 1, "3", ["full", "full", "full"]),
    p("W13", "System states", "/app/system/:state", ["guest", "student", "instructor", "ta"], "required", "core", [], 1, "0", ["full", "full", "full"]),
    p("W14", "Course home", "/courses/:courseId", ["student", "instructor", "ta"], "required", "core", ["S03"], 2, "1", ["full", "full", "full"]),
    p("W15", "Syllabus/grading summary", "/courses/:courseId/syllabus", ["student", "instructor", "ta"], "required", "core", ["S03", "S04"], 2, "1", ["full", "full", "full"]),
    p("W16", "Modules", "/courses/:courseId/modules", ["student", "instructor", "ta"], "required", "core", ["S04"], 2, "1", ["full", "full", "full"]),
    p("W17", "Lesson/material", "/courses/:courseId/modules/:moduleId/lessons/:lessonId", ["student", "instructor", "ta"], "required", "core", ["S04"], 2, "1", ["full", "full", "full"]),
    p("W18", "Coursework list", "/courses/:courseId/coursework", ["student", "instructor", "ta"], "required", "core", ["S03", "S05", "S10"], 2, "1", ["full", "full", "full"]),
    p("W19", "Assignment detail", "/courses/:courseId/assignments/:assignmentId", ["student", "instructor", "ta"], "required", "core", ["S05"], 3, "1", ["full", "full", "full"]),
    p("W20", "Add work", "/courses/:courseId/assignments/:assignmentId/work", ["student"], "required", "core", ["S06"], 3, "1", ["full", "full", "full"]),
    p("W21", "Review and submit", "/courses/:courseId/assignments/:assignmentId/review", ["student"], "required", "core", ["S07"], 3, "1", ["full", "full", "full"]),
    p("W22", "Receipt/attempt history", "/courses/:courseId/assignments/:assignmentId/attempts/:attemptId", ["student"], "required", "core", ["S08"], 3, "1", ["full", "full", "full"]),
    p("W23", "Released feedback", "/courses/:courseId/assignments/:assignmentId/feedback", ["student", "instructor"], "required", "core", ["S09"], 3, "1", ["full", "full", "full"]),
    p("W24", "Student course grades", "/courses/:courseId/grades", ["student", "instructor"], "required", "core", ["S09", "S19"], 3, "1", ["full", "full", "full"]),
    p("W25", "Quiz rules/start", "/courses/:courseId/quizzes/:quizId", ["student", "instructor", "ta"], "required", "core", ["S10", "S16"], 3, "2", ["full", "full", "full"]),
    p("W26", "Quiz attempt", "/courses/:courseId/quizzes/:quizId/attempts/:attemptId", ["student"], "required", "core", ["S10"], 3, "2", ["full", "full", "full"]),
    p("W27", "Quiz receipt/review", "/courses/:courseId/quizzes/:quizId/attempts/:attemptId/review", ["student"], "required", "core", ["S10"], 3, "2", ["full", "full", "full"]),
    p("W28", "Announcement list", "/courses/:courseId/announcements", ["student", "instructor", "ta"], "required", "core", ["S03", "S13"], 4, "3", ["full", "full", "full"]),
    p("W29", "Announcement detail", "/courses/:courseId/announcements/:announcementId", ["student", "instructor", "ta"], "required", "core", ["S03", "S13"], 4, "3", ["full", "full", "full"]),
    p("W30", "Discussion list", "/courses/:courseId/discussions", ["student", "instructor", "ta"], "required", "core", ["S11"], 4, "3", ["full", "full", "full"]),
    p("W31", "Discussion thread", "/courses/:courseId/discussions/:discussionId", ["student", "instructor", "ta"], "required", "core", ["S11"], 4, "3", ["full", "full", "full"]),
    p("W32", "Course calendar", "/courses/:courseId/calendar", ["student", "instructor", "ta"], "required", "core", ["S12", "S03"], 2, "3", ["full", "full", "full"]),
    p("W33", "My course groups", "/courses/:courseId/groups", ["student"], "required", "core", ["S21", "S15"], 4, "3", ["full", "full", "full"]),
    p("W34", "Group workspace/group submission status", "/courses/:courseId/groups/:groupId", ["student"], "required", "core", ["S15", "S21", "S07", "S08"], 4, "3", ["full", "full", "full"]),
    p("W35", "Course builder", "/teach/courses/:courseId/builder", ["instructor", "ta"], "required", "core", ["S14"], 5, "1", ["full", "review", "review"]),
    p("W36", "Course settings, syllabus and publication", "/teach/courses/:courseId/settings", ["instructor", "ta"], "required", "core", ["S14"], 5, "1", ["full", "review", "review"]),
    p("W37", "Module editor", "/teach/courses/:courseId/modules/:moduleId/edit", ["instructor", "ta"], "required", "core", ["S14"], 5, "1", ["full", "review", "review"]),
    p("W38", "Learning-content editor", "/teach/courses/:courseId/content/:contentId/edit", ["instructor", "ta"], "required", "core", ["P47"], 5, "1", ["full", "review", "review"]),
    p("W39", "Files and resources", "/teach/courses/:courseId/files", ["instructor", "ta"], "required", "core", ["P48"], 5, "1", ["full", "review", "review"]),
    p("W40", "Assignment editor", "/teach/courses/:courseId/assignments/:assignmentId/edit", ["instructor", "ta"], "required", "core", ["S15"], 5, "1", ["full", "review", "review"]),
    p("W41", "Quiz editor", "/teach/courses/:courseId/quizzes/:quizId/edit", ["instructor", "ta"], "required", "core", ["S16"], 5, "2", ["full", "review", "review"]),
    p("W42", "Question bank", "/teach/courses/:courseId/question-bank", ["instructor", "ta"], "required", "follow-on", [], 5, "2", ["full", "handoff", "handoff"]),
    p("W43", "Rubric library", "/teach/courses/:courseId/rubrics", ["instructor", "ta"], "required", "core", ["P49"], 5, "1", ["full", "review", "review"]),
    p("W44", "Rubric editor", "/teach/courses/:courseId/rubrics/:rubricId/edit", ["instructor", "ta"], "required", "core", ["P49"], 5, "1", ["full", "review", "review"]),
    p("W45", "Course people and staff permission", "/teach/courses/:courseId/people", ["instructor", "ta"], "required", "core", ["S21"], 5, "2", ["full", "review", "review"]),
    p("W46", "Learner allowances", "/teach/courses/:courseId/people/:learnerId/allowances", ["instructor", "ta"], "required", "core", ["S21"], 5, "2", ["full", "review", "review"]),
    p("W47", "Group sets and membership builder", "/teach/courses/:courseId/groups", ["instructor", "ta"], "required", "core", ["S15", "S21"], 4, "2", ["full", "review", "review"]),
    p("W48", "Grading queue", "/teach/courses/:courseId/grading", ["instructor", "ta"], "required", "core", ["S17"], 6, "1", ["full", "full", "review"]),
    p("W49", "Grader", "/teach/courses/:courseId/grading/:assessmentId/receipts/:receiptId", ["instructor", "ta"], "required", "core", ["S17"], 6, "1", ["full", "full", "review"]),
    p("W50", "Rubric-change impact preview", "/teach/courses/:courseId/rubrics/:rubricId/change-preview", ["instructor", "ta"], "required", "core", ["S18"], 6, "2", ["full", "review", "review"]),
    p("W51", "Staff gradebook", "/teach/courses/:courseId/gradebook", ["instructor", "ta"], "required", "core", ["S19"], 6, "1", ["full", "full", "review"]),
    p("W52", "Syllabus-based grading policy setup", "/teach/courses/:courseId/grading-policy", ["instructor", "ta"], "required", "core", ["S19", "S14"], 6, "1", ["full", "review", "review"]),
    p("W53", "Exact feedback release", "/teach/courses/:courseId/releases", ["instructor", "ta"], "required", "core", ["S20"], 6, "1", ["full", "full", "review"]),
    p("W54", "Grade correction and regrade review", "/teach/courses/:courseId/grading/requests/:requestId", ["instructor", "ta"], "required", "core", ["S19", "S09"], 6, "2", ["full", "review", "review"]),
    p("W55", "Announcement editor", "/teach/courses/:courseId/announcements/:announcementId/edit", ["instructor", "ta"], "required", "core", ["S13", "S03"], 4, "3", ["full", "review", "review"]),
    p("W56", "Discussion setup and moderation", "/teach/courses/:courseId/discussions/:discussionId/manage", ["instructor", "ta"], "required", "follow-on", ["S11"], 4, "3", ["full", "review", "review"]),
    p("W57", "Grading allocation and deadline planner", "/teach/courses/:courseId/grading-plan", ["instructor", "ta"], "required", "core", ["S17", "S12"], 6, "2", ["full", "full", "review"]),
    p("W58", "Course insights and attendance", "/teach/courses/:courseId/insights", ["instructor", "ta"], "required", "follow-on", ["S23"], 6, "4", ["full", "review", "review"]),
    p("W59", "Course copy and rollover", "/teach/courses/:courseId/copy", ["instructor", "ta"], "required", "follow-on", ["S22"], 5, "4", ["full", "review", "review"]),
    p("W60", "Content import/export preview", "/teach/courses/:courseId/content-transfer", ["instructor", "ta"], "required", "follow-on", ["S22"], 5, "4", ["full", "handoff", "handoff"]),
    p("O01", "Optional student achievements", "/courses/:courseId/achievements", ["student"], "optional", "optional", [], 6, "opt", ["full", "full", "full"]),
    p("O02", "Optional staff achievement authoring", "/teach/courses/:courseId/achievements/manage", ["instructor", "ta"], "optional", "optional", [], 6, "opt", ["full", "handoff", "handoff"]),
    p("O03", "Optional course FAQ assistant", "/courses/:courseId/assistant", ["student"], "optional", "optional", [], 6, "opt", ["full", "full", "full"]),
  ];

  var byId = {};
  PAGES.forEach(function (page) { byId[page.id] = page; });

  WB.defineFrozen(WB.manifest, "pages", PAGES);
  WB.defineFrozen(WB.manifest, "pagesById", byId);
})(typeof globalThis !== "undefined" ? globalThis : this);
