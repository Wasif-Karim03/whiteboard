/* Whiteboard Phase 2b: navigation map.
   Source: spec/docs/19-navigation-map-navigation-json.html (blocks Global, Top Bar, Student Course, Staff
   Course, Staff Tools, Optional; labels, pages and TA modes transcribed in doc order). BD26 (TA navigation
   follows the permission matrix; instructor navigation adds Syllabus and Assessments). BD8 and BD38: no
   staff entry targets W22, W33 or W34. Mapping "Assessments" to W18 is chosen by Claude under owner
   delegation. Global and utility ids match WB.NAV_GLOBAL and WB.NAV_UTILITY (kit/core.js). */
(function (root) {
  "use strict";
  var WB = root.WB;
  var ALL = ["student", "instructor", "ta"];

  function e(id, text, page, extra) {
    var entry = { id: id, label: text, page: page };
    Object.keys(extra || {}).forEach(function (k) { entry[k] = extra[k]; });
    return entry;
  }
  function ta(id, text, page, mode) { return e(id, text, page, { taMode: mode }); }

  var NAV = {
    global: [
      e("today", "Today", "W05", { roles: ALL }),
      e("courses", "Courses", "W06", { roles: ALL }),
      e("calendar", "Calendar", "W07", { roles: ALL }),
      e("activity", "Activity", "W08", { roles: ALL }),
      e("tools", "Tools", "W11", { roles: ALL }),
    ],
    // doc 19 "Top Bar"
    utility: [
      e("search", "Search", "W09", { roles: ALL }),
      e("account", "Account", "W10", { roles: ALL }),
      e("help", "Help", "W12", { roles: ALL }),
    ],
    studentCourse: [
      e("overview", "Overview", "W14"),
      e("modules", "Modules", "W16"),
      e("coursework", "Coursework", "W18"),
      e("calendar", "Calendar", "W32"),
      e("announcements", "Announcements", "W28"),
      e("discussions", "Discussions", "W30"),
      e("grades", "Grades", "W24"),
      e("groups", "Groups", "W33"),
    ],
    staffCourse: [
      ta("builder", "Builder", "W35", "read_only"),
      ta("grading", "Grading", "W48", "assigned_only"),
      ta("gradebook", "Gradebook", "W51", "assigned_only"),
      ta("people", "People", "W45", "restricted_read_only"),
      ta("groups", "Groups", "W47", "assigned_read_only"),
      ta("calendar", "Calendar", "W32", "read_only"),
      ta("announcements", "Announcements", "W28", "read_only"),
      ta("discussions", "Discussions", "W30", "participate"),
      ta("settings", "Settings", "W36", "read_only"),
    ],
    staffTools: [
      ta("files", "Files", "W39", "published_or_assigned_read_only"),
      ta("rubrics", "Rubrics", "W43", "assigned_read_only"),
      ta("question-bank", "Question bank", "W42", "no_access_default"),
      ta("allowances", "Allowances and requests", "W46", "effective_timing_only"),
      ta("grading-plan", "Grading plan", "W57", "own_tasks_only"),
      ta("insights", "Insights and attendance", "W58", "assigned_only_if_granted"),
      ta("copy-course", "Copy course", "W59", "no_access_default"),
      ta("content-transfer", "Content import/export", "W60", "no_access_default"),
      ta("grade-review", "Grade review requests", "W54", "assigned_read_only_or_propose"),
    ],
    // doc 19 "Optional (off by default)"
    optional: [
      e("achievements", "Achievements", "O01"),
      e("manage-achievements", "Manage achievements", "O02"),
      e("assistant", "Course assistant", "O03"),
    ],
    extras: [
      e("syllabus", "Syllabus", "W15", { roles: ["instructor"], source: "BD26" }),
      e("assessments", "Assessments", "W18", { roles: ["instructor"], source: "BD26" }),
    ],
    // Ready for the kit shell's opts.hrefs (kit/API.md › Shells).
    hrefs: { today: "#/W05", courses: "#/W06", calendar: "#/W07", activity: "#/W08", tools: "#/W11", search: "#/W09", help: "#/W12", account: "#/W10" },
  };

  WB.defineFrozen(WB.manifest, "navigation", NAV);

  // Course navigation for a role. A TA keeps every staff entry in its scoped mode (BD26 matrix detail).
  WB.defineFrozen(WB.sel, "courseNav", function (role) {
    var nav = WB.manifest.navigation;
    if (role === "student") return nav.studentCourse.slice();
    if (role === "instructor") return nav.staffCourse.concat(nav.extras);
    if (role === "ta") return nav.staffCourse.slice();
    return [];
  });

  // Staff tools for a role. A TA does not get entries whose matrix mode is no_access_default (BD26).
  WB.defineFrozen(WB.sel, "staffTools", function (role) {
    var tools = WB.manifest.navigation.staffTools;
    if (role === "instructor") return tools.slice();
    if (role === "ta") return tools.filter(function (t) { return t.taMode !== "no_access_default"; });
    return [];
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
