/* W23 Released feedback (Phase 3 spine). Student and instructor preview. Anchor: the first problem-set release.
   Only the released projection is drawn: resultFor status, score, comment and question comments, plus marks from
   the learner's entry in the latest release snapshot. Before release nothing about the result is shown. The page
   viewer is listed as text (kit request 2). Contract: pages/SPINE.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "offline", "permissionUnavailable"];

  function learner(a) { return a.role === "student" ? a.who.personId : P.learnerId(a); }
  function totalOpts(a) { return a.role === "instructor" ? { as: "learner" } : undefined; }

  // The learner's entry in the newest snapshot that holds one, with that snapshot's version.
  function snapshot(a, itemId, personId) {
    var list = a.sel.releasesFor(a.view, itemId, a.who) || [];
    var hit = null;
    list.forEach(function (rel) {
      var e = rel.entries.filter(function (x) { return x.person_id === personId; })[0];
      if (e) hit = { version: rel.version, entry: e };
    });
    return hit;
  }

  function questionTable(a, it, res, snap) {
    var rubric = a.sel.rubricFor(a.view, it.id, a.who);
    if (!rubric || !rubric.criteria) return "";
    var marks = snap && snap.entry.marks ? snap.entry.marks : {};
    var comments = res.questionComments || {};
    var rows = rubric.criteria.map(function (c) {
      var mark = Object.prototype.hasOwnProperty.call(marks, c.question_id) ? P.score(marks[c.question_id], c.max) : "";
      var note = Object.prototype.hasOwnProperty.call(comments, c.question_id) ? comments[c.question_id] : "";
      return { id: "q" + c.question_id, cells: { q: esc("Question " + c.question_id), title: esc(c.title), mark: esc(mark), note: esc(note) } };
    });
    var columns = [{ key: "q", label: "Question", primary: true }, { key: "title", label: "Criterion" }, { key: "mark", label: "Mark" }, { key: "note", label: "Comment" }];
    return a.K.table(a.ctx, { id: P.id(a, "questions"), caption: "Feedback by question", columns: columns, rows: rows, empty: { title: "No questions", body: P.p("This assignment has no question list.") } });
  }

  function pagesText(a, personId, it, snap) {
    var r = a.role === "student" && snap && snap.entry.receipt_id ? a.sel.receiptById(a.view, snap.entry.receipt_id, a.who) : null;
    if (!r) return "";
    var names = r.files.map(function (f) { return f.name + " (" + P.fileMeta(a, f) + ")"; }).join(", ");
    return P.p("Pages you handed in: " + names + ". The page viewer is not drawn in this prototype.");
  }

  function totalFigure(a, personId) {
    var t = a.sel.courseTotal(a.view, a.who.courseId, personId, a.who, totalOpts(a));
    return t && !t.empty ? a.K.figure({ label: "Course total", value: t.display, basis: "Released results only" }) : "";
  }

  function releasedView(a, it, res, personId) {
    var snap = snapshot(a, it.id, personId);
    if (a.selection && a.selection.receiptId && (!snap || snap.entry.receipt_id !== a.selection.receiptId)) return a.K.empty({ title: "No released feedback for this attempt" });
    var score = res.score === null || res.score === undefined ? a.K.status(res.status, a.ctx, { released: true, own: a.role === "student" }) : a.K.figure({ label: "Score", value: P.score(res.score, res.max), basis: "Released " + P.when(a, res.releasedAt) });
    var main = P.stack(a, [
      res.comment ? a.K.section({ title: "Overall comment", body: P.p(res.comment), level: 2 }) : "",
      questionTable(a, it, res, snap), snap ? P.p("Version " + snap.version) : "", pagesText(a, personId, it, snap),
    ]);
    var ask = a.role === "student" ? a.K.button({ label: "Ask about this feedback", note: "Preview only: no message is sent in this prototype" }) : "";
    var receiptGo = snap && snap.entry.receipt_id ? (a.selection ? WB.Teaching.go(a, "W22", { assessmentId: it.id, learnerId: personId, receiptId: snap.entry.receipt_id }) : P.recordGo("W22", "receipt", snap.entry.receipt_id)) : null;
    var back = a.role === "student" ? [receiptGo ? { label: "Receipt", go: receiptGo } : null, { label: "My grades", go: "W24" }] : [{ label: "Learner grades", go: "W24" }, { label: "Release feedback", go: "W53" }];
    var rail = P.stack(a, [score, totalFigure(a, personId), P.links(a, back), ask]);
    return a.K.rail(a.ctx, { main: main, rail: rail, railLabel: "Result" });
  }

  function heldView(a, it) {
    if (a.role === "instructor") {
      return a.K.empty({ title: "Nothing has been released for this assignment", body: P.p("The learner sees feedback only after it is released."), action: { label: "Release feedback", go: "W53" } });
    }
    var r = P.receiptOf(a);
    return P.stack(a, [
      P.status(a, P.ownSubmission(a, it.id), true), P.p("Feedback has not been released"),
      r ? P.links(a, [{ label: "View receipt", go: P.recordGo("W22", "receipt", r.id) || "W22" }]) : "",
      P.offHome(a, "Feedback is released later in the prototype"),
    ]);
  }

  function content(a, it) {
    var personId = learner(a);
    var res = a.sel.resultFor(a.view, personId, it.id, a.who);
    if (!res) return P.permissionNotice(a);
    var inner = res.status === null ? heldView(a, it) : releasedView(a, it, res, personId);
    if (a.role !== "instructor") return inner;
    return P.stack(a, [a.K.flag("preview"), P.p("Previewing as " + P.personName(a, personId)), inner]);
  }

  function body(a, it) {
    if (a.state === "permissionUnavailable") return P.permissionNotice(a, "This feedback belongs to another person");
    if (a.state === "loading") return P.loading(a, "your feedback");
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown"), content(a, it)]);
    return content(a, it);
  }

  WB.definePage("W23", {
    states: STATES,
    na: P.na(STATES, { firstUseEmpty: "Feedback is about one released result; before release the page says nothing is released" }),
    render: function (a) {
      var it = a.sel.assessment(a.view, P.assessmentId(a));
      var gate = P.publicationGate(a, it);
      if (gate) return gate;
      return P.shell(a, { title: "Feedback: " + it.title, body: body(a, it) }, { section: "coursework" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
