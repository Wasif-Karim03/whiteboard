/* W15 Syllabus and grading summary. Teaching staff, the module schedule, assessment rules and the grade items by
   category (title, category and points only; never a score or status). Weights, the policy version and a
   syllabus file have no record yet (kit requests). A TA reads the rules without the item table. Contract:
   pages/PAGES.md, pages/SPINE.md; decisions in pages/seg2-course/NOTES.md (chosen by Claude under owner
   delegation). */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "firstUseEmpty", "offline", "permissionUnavailable"];
  var AI = { not_permitted: "AI tools are not permitted during this quiz." };

  function categoryLabel(id) { return id.charAt(0).toUpperCase() + id.slice(1); }

  function staffSection(a) {
    var people = a.sel.enrolled(a.view, a.who.courseId, "instructor").map(function (id) { return a.sel.person(a.view, id); }).filter(Boolean);
    var body = people.length
      ? "<ul>" + people.map(function (p) { return "<li>" + esc(p.name) + " · " + a.K.link({ label: p.email, href: "mailto:" + p.email }) + "</li>"; }).join("") + "</ul>"
      : P.p("No teaching staff are listed yet");
    return a.K.section({ title: "Teaching staff", body: body });
  }

  function scheduleSection(a) {
    var mods = a.view.data.coursework.modules.filter(function (m) { return m.course_id === a.who.courseId; }).slice()
      .sort(function (x, y) { return x.position - y.position; });
    var list = mods.length
      ? a.K.list({ label: "Modules", items: mods.map(function (m) { return { title: m.title, meta: a.sel.fmtShortDate(m.starts) + " to " + a.sel.fmtShortDate(m.ends) }; }) })
      : P.p("No modules are published yet");
    return a.K.section({ title: "Schedule", body: list + P.links(a, [{ label: "Open modules", go: "W16" }]) });
  }

  function rulesSection(a) {
    var lines = [];
    P.assessments(a).forEach(function (item) {
      var late = P.lateRuleText(item);
      if (late) lines.push(item.title + ": " + late);
      if (item.max_attempts) lines.push(item.title + ": " + item.max_attempts + (item.max_attempts === 1 ? " attempt" : " attempts") + ".");
      var quiz = item.quiz_id ? a.sel.quiz(a.view, item.quiz_id) : null;
      if (quiz && AI[quiz.ai_policy]) lines.push(item.title + ": " + AI[quiz.ai_policy]);
    });
    var body = lines.length ? "<ul>" + lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>" : P.p("No assessment rules are published yet");
    return a.K.section({ title: "Assessment rules", body: body });
  }

  function noPolicy(a) {
    return a.K.empty({ title: "No grading policy is published for this course", body: P.p("A course total is not shown until one is published.") });
  }

  function categoriesSection(a) {
    if (a.role === "ta") return a.K.section({ title: "Grading categories", body: P.p("You can read these rules. Changing the grading policy is the instructor's step.") });
    var learner = a.role === "student" ? a.who.personId : P.learnerId(a);
    var rows = a.state === "firstUseEmpty" ? null : a.sel.gradeRows(a.view, a.who.courseId, learner, a.who);
    if (!rows) return a.K.section({ title: "Grading categories", body: noPolicy(a) });
    var published = P.assessments(a);
    rows = rows.filter(function (r) { return published.some(function (it) { return it.id === r.itemId; }); });
    var table = a.K.table(a.ctx, {
      id: P.id(a, "categories"), caption: "Grade items by category", empty: { title: "No grade items yet" },
      columns: [{ key: "item", label: "Item", primary: true }, { key: "category", label: "Category" }, { key: "points", label: "Points" }],
      rows: rows.map(function (r) { return { id: r.itemId, cells: { item: esc(r.title), category: esc(categoryLabel(r.category)), points: esc(r.max + " points") } }; }),
    });
    var note = a.K.notice({ tone: "info", title: "Category weights and the policy version are not drawn on this page yet" });
    return a.K.section({ title: "Grading categories", body: table + note });
  }

  function rail(a) {
    var links = [{ label: "Coursework", go: "W18" }];
    if (a.role === "student") links.push({ label: "My grades", go: "W24" });
    if (a.role === "instructor") links.push({ label: "Edit grading policy", go: "W52" }, { label: "Edit course details", go: "W36" });
    return P.stack(a, [
      a.K.button({ label: "Download syllabus", disabled: true, reason: "No syllabus file is attached to this course", id: P.id(a, "download") }),
      P.links(a, links),
    ]);
  }

  function content(a) {
    var c = a.sel.course(a.view, a.who.courseId);
    var banner = c ? a.K.courseBanner(a.ctx, { key: c.key, code: c.code, title: c.title, term: c.term }) : "";
    var main = P.stack(a, [a.role !== "student" ? a.K.flag("preview") : "", staffSection(a), scheduleSection(a), rulesSection(a), categoriesSection(a)]);
    var ended = P.taEnded(a) ? P.taEndedNotice(a, P.assessmentId(a)) : "";
    return P.stack(a, [banner, ended, a.K.rail(a.ctx, { main: main, rail: rail(a), railLabel: "Syllabus tools" })]);
  }

  function body(a) {
    if (a.state === "permissionUnavailable") return P.permissionNotice(a, "You are not enrolled in this course");
    if (a.state === "loading") return P.loading(a, "the syllabus");
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown"), content(a)]);
    return content(a);
  }

  WB.definePage("W15", {
    states: STATES,
    na: P.na(STATES, { saveFailed: "No syllabus file exists to fail a download" }),
    render: function (a) { return P.shell(a, { title: "Syllabus and grading", body: body(a) }, { page: "W15" }); },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
