/* Record-aware links within the existing page families; local selection is not identity or authority. */
(function (root) {
  "use strict";
  var W = root.WB, S = W.sel;
  var FIELDS = { courseId: "tc", assessmentId: "ta", learnerId: "tl", receiptId: "tr" };
  function go(a, page, over) {
    var data = Object.assign({ courseId: a.who.courseId }, a.selection || {}), change = over || {};
    if (change.courseId && change.courseId !== data.courseId) data = { courseId: change.courseId };
    if (change.assessmentId && change.assessmentId !== data.assessmentId) { data.receiptId = null; }
    if (change.learnerId && change.learnerId !== data.learnerId) data.receiptId = null;
    Object.keys(change).forEach(function (k) { if (Object.prototype.hasOwnProperty.call(FIELDS, k)) data[k] = change[k]; });
    var query = Object.keys(FIELDS).filter(function (k) { return data[k] !== null && data[k] !== undefined; }).map(function (k) { return FIELDS[k] + "=" + encodeURIComponent(data[k]); });
    return page + "?" + query.join("&");
  }
  function courseworkGo(a, item) {
    var legacy = S.recordGo("W19", "assessment", item.id) || S.recordGo("W25", "assessment", item.id);
    return !a.selection && legacy ? legacy : go(a, item.kind === "quiz" ? "W25" : "W19", { assessmentId: item.id, learnerId: null, receiptId: null });
  }
  function picker(a, page, selected) {
    var ids = S.teachingLearners(a.view, a.who).map(function (p) { return p.id; });
    return a.K.disclosure({ id: W.P.id(a, "student-picker"), summary: "Choose student", body: a.K.list({ label: "Students in this course", items: ids.map(function (id) {
      return { title: W.P.personName(a, id), meta: id === selected ? "Selected" : undefined, go: go(a, page, { learnerId: id, assessmentId: null, receiptId: null }) };
    }) }) });
  }
  function contextHTML(a, html) {
    if (!a.selection) return html;
    // Preserve explicit selections on same-course navigation; record-specific legacy links retain their record.
    var coursePages = ["W14", "W15", "W16", "W17", "W18", "W24", "W28", "W30", "W32", "W35", "W36", "W37", "W38", "W39", "W42", "W43", "W45", "W47", "W51", "W52", "W54", "W57", "W58", "W59", "W60", "O01", "O02", "O03"];
    return html.replace(/href="#\/([^"?]+)"([^>]*?)data-go="\1"/g, function (all, target, between) {
      var page = target.slice(0, 3), token = target.indexOf(":") >= 0 ? target.slice(target.indexOf(":") + 1).split("~")[0] : null;
      if (page === "W06" || page === "W05") return all;
      var change = page === "W53" ? { receiptId: null, learnerId: null } : {};
      if (coursePages.indexOf(page) >= 0) change = { assessmentId: null, receiptId: null, learnerId: page === "W51" || page === "W24" ? a.selection.learnerId : null };
      if (coursePages.indexOf(a.page.id) >= 0 && coursePages.indexOf(page) < 0 && page !== a.page.id) change = { assessmentId: null, receiptId: null, learnerId: null };
      var anchor = token ? S.anchorFor(page, token) : null;
      if (anchor && anchor.record.type === "assessment") change = { assessmentId: anchor.record.id, receiptId: null, learnerId: null };
      if (anchor && anchor.record.type === "receipt") {
        var r = S.receiptById(a.view, anchor.record.id, a.who);
        if (r) change = { receiptId: r.id, assessmentId: r.assessment_id, learnerId: r.owner_id || null };
      }
      var dest = W.esc(go(a, target, change));
      return 'href="#/' + dest + '"' + between + 'data-go="' + dest + '"';
    });
  }
  function attempts(a, r) {
    var P = W.P;
    var list = S.receiptsFor(a.view, r.assessment_id, a.who).filter(function (x) {
      return r.group_id ? x.group_id === r.group_id : x.owner_id === r.owner_id;
    }).slice().sort(function (x, y) { return y.attempt - x.attempt; });
    if (list.length < 2) return "";
    return a.K.disclosure({ id: P.id(a, "attempts"), summary: "Submission attempts", body: a.K.list({ label: "Accepted attempts", items: list.map(function (x) {
      return { title: "Attempt " + x.attempt, meta: P.when(a, x.accepted_at) + (x.id === r.id ? " · Selected" : ""), go: go(a, "W49", { receiptId: x.id, assessmentId: x.assessment_id, learnerId: x.owner_id || null }) };
    }) }) });
  }
  function feedback(a, it, r) {
    if (a.role !== "instructor" || r.group_id) return "";
    var res = S.resultFor(a.view, r.owner_id, it.id, a.who);
    var releases = S.releasesFor(a.view, it.id, a.who) || [];
    var entry = null;
    releases.forEach(function (rel) { rel.entries.forEach(function (e) { if (e.person_id === r.owner_id && e.receipt_id === r.id) entry = e; }); });
    var body = entry && entry.comment ? W.P.p(entry.comment) : W.P.p("No released feedback for this attempt");
    if (entry) body += W.P.p("Released result: " + (res && res.status === "scored" ? W.P.score(res.score, it.max) : entry.status));
    return a.K.section({ title: "Released feedback", body: body, level: 2 });
  }
  function gradeRecord(a, it, learnerId) {
    var P = W.P, record = S.teachingStudent(a.view, a.who, learnerId);
    if (!record) return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a)]);
    var row = record.items.filter(function (x) { return x.assessment.id === it.id; })[0];
    var res = row && row.result, outcome = res && res.staffOutcome;
    var hasGrade = Boolean(outcome || res && res.status);
    var reason = it.grading_intent === "ungraded" ? "This is ungraded practice" : hasGrade ? "A grade is recorded without an uploaded submission" : "No accepted submission or recorded grade";
    var facts = [{ label: "Student", value: record.person.name }, { label: "Assessment", value: it.title }];
    if (res && res.status) facts.push({ label: "Released result", value: res.status === "scored" ? P.score(res.score, it.max) : res.status });
    if (outcome) facts.push({ label: "Held result", value: outcome.status === "scored" ? P.score(outcome.score, it.max) : outcome.status });
    var release = row && row.release, entry = release && release.entries[0];
    return P.stack(a, [P.bareHandoff(a), a.K.kv(facts), a.K.notice({ tone: "info", title: reason }), entry && entry.comment ? a.K.section({ title: "Released feedback", body: P.p(entry.comment), level: 2 }) : "",
      a.K.button({ label: "Save manual grade", disabled: true, reason: "Manual grade editing is a design preview; no saved change is recorded", id: P.id(a, "manual-grade") }),
      P.links(a, [{ label: "Student course record", go: go(a, "W45", { learnerId: learnerId, assessmentId: null, receiptId: null }) }, { label: "Gradebook", go: go(a, "W51", { learnerId: learnerId, assessmentId: null, receiptId: null }) }])]);
  }
  W.Teaching = Object.freeze({ go: go, courseworkGo: courseworkGo, picker: picker, contextHTML: contextHTML, attempts: attempts, feedback: feedback, gradeRecord: gradeRecord });
})(globalThis);
