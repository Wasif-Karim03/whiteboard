/* W58 Course insights and attendance (Phase 3, seg6-grading). Instructor and TA, course-level. Submission facts per
   published assessment come from receivedProgress and counts of submissionsFor (a TA counts only their task's
   learners). No attendance record exists, so attendance is an honest empty that never counts anyone absent. No
   risk scores or predictions. A TA gets no attendance and no course-wide counts. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "offline", "permissionUnavailable", "firstUseEmpty", "filteredEmpty"];

  function countOf(subs, state) { return subs.filter(function (s) { return s.state === state; }).length; }

  // One fact row per assessment the viewer may count; a TA only where their task scope is active (A6).
  function factRows(a) {
    return P.assessments(a).map(function (item) {
      var scope = a.role === "ta" ? a.sel.taScope(a.view, item.id, a.who) : null;
      if (a.role === "ta" && !scope) return null;
      var got = a.sel.receivedProgress(a.view, item.id, a.who);
      if (!got) return null;
      var subs = a.sel.submissionsFor(a.view, item.id).filter(function (s) { return !scope || scope.learnerIds.indexOf(s.person_id) >= 0; });
      var row = {
        id: item.id, cells: {
          item: esc(item.title), got: esc(got.received + " of " + got.of), missing: esc(String(countOf(subs, "missing"))),
          excused: esc(countOf(subs, "excused") + ", left out of the missing count"),
        },
      };
      var go = P.recordGo("W48", "assessment", item.id);
      return go ? { id: row.id, cells: row.cells, go: go } : row;
    }).filter(Boolean);
  }

  function facts(a) {
    var filtered = a.state === "filteredEmpty";
    return a.K.table(a.ctx, {
      id: P.id(a, "facts"), caption: "Submission facts",
      columns: [{ key: "item", label: "Assessment", primary: true }, { key: "got", label: "Handed in" }, { key: "missing", label: "Missing work", numeric: true }, { key: "excused", label: "Excused work" }],
      rows: filtered ? [] : factRows(a),
      empty: filtered
        ? { title: "No assessments match the filter", body: P.p("Other assessments are still in the course."), action: { label: "Clear filters", note: "Preview only: filters are not wired" } }
        : { title: "No facts to show", body: P.p("Facts appear once assessments are published.") },
    });
  }

  function attendance(a) {
    var empty = a.K.empty({ title: "No attendance has been recorded", body: P.p("A session with no entry is not recorded. It is never counted as absent.") });
    if (a.tier !== "full") return a.K.section({ title: "Attendance", body: empty, level: 2 });
    var controls = P.stack(a, [
      a.K.button({ label: "Record attendance", note: "Preview only: attendance is not recorded in this prototype" }),
      a.K.button({ label: "Correct attendance", disabled: true, reason: "No entry to correct", id: P.id(a, "correct") }),
    ]);
    return a.K.section({ title: "Attendance", body: empty + controls, level: 2 });
  }

  function links(a) {
    var list = [{ label: "Course calendar", go: "W32" }];
    if (a.role === "instructor") list.unshift({ label: "Grade review requests", go: "W54" });
    return P.links(a, list);
  }

  function top(a) { return a.state === "offline" ? P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown")]) : ""; }

  function body(a) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "course insights")]);
    var flag = a.role === "instructor" ? [{ label: "Flag a fact for review", note: "Preview only: nothing is flagged in this prototype" }] : [];
    var handoff = P.handoff(a, { title: "Open on a larger screen", protectiveActions: flag });
    var role = a.role === "instructor"
      ? attendance(a)
      : a.K.notice({ tone: "info", title: "Attendance is not in your course role. A grading task does not grant it" });
    return P.stack(a, [handoff, top(a), facts(a), role, P.p("No risk scores or predictions are shown"), links(a)]);
  }

  WB.definePage("W58", {
    states: STATES,
    na: P.na(STATES, {
      invalid: "No attendance entry exists to correct", saving: "No attendance entry exists to correct",
      saveFailed: "No attendance entry exists to correct", conflict: "No attendance entry exists to correct",
    }),
    render: function (a) { return P.shell(a, { title: a.page.title, body: body(a) }, { page: "W58" }); },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
