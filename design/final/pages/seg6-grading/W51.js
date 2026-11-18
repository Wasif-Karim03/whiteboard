/* W51 Staff gradebook (Phase 3 spine). Instructor and TA, course-level. Every cell comes from gradebook (TA-scoped:
   only task items and learners, no totals). Web draws the whole table; iPad and iPhone draw one learner, the
   student persona's row, or the first row when that learner is outside a TA's scope. Contract: pages/SPINE.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["firstUseEmpty", "loading", "filteredEmpty", "offline", "permissionUnavailable"];
  var NOT_IN_TOTAL = "Not in the total until released";

  function anchorLearner(a) {
    var r = P.receiptById(a, a.sel.anchorFor("W49", null).record.id);
    return r ? r.owner_id : null;
  }

  // One cell as {text, html}: text for read-only lists, html for the table. Null cells stay blank (R13).
  function cellOf(a, row, item) {
    var c = row.cells[item.id];
    if (!c) return { text: "", html: "" };
    if (c.scoreWithheld) return { text: "Outside your grading task", html: esc("Outside your grading task") };
    var sub = a.sel.submissionFor(a.view, row.personId, item.id);
    var status = sub ? P.status(a, sub, false) : "";
    if (c.score !== null && c.score !== undefined) {
      var score = P.score(c.score, item.max);
      var held = c.held ? " " + a.K.badge({ label: "Not released", tone: "neutral" }) : "";
      return { text: score + (c.held ? " · Not released" : ""), html: esc(score) + held, status: status };
    }
    if (c.status === null && !c.held) {
      return sub && sub.receipt_id ? { text: NOT_IN_TOTAL, html: status + " " + esc(NOT_IN_TOTAL), status: status } : { text: "", html: "" };
    }
    // SPINE-06: a status-only outcome (excused, missing) shows just its status, plus the held indicator.
    return { text: c.held ? "Not released" : "", html: status + (c.held ? " " + a.K.badge({ label: "Not released", tone: "neutral" }) : ""), status: status };
  }

  function columns(a, gb) {
    var cols = [{ key: "learner", label: "Learner", primary: true }].concat(gb.items.map(function (it) { return { key: "i-" + it.id, label: it.title + " (" + it.max + ")" }; }));
    if (a.role !== "instructor") return cols;
    return cols.concat([{ key: "total", label: "Total (staff, includes held)" }, { key: "released", label: "Released total" }]);
  }

  function tableRow(a, gb, row, linkFor) {
    var cells = { learner: a.K.link({ label: row.name, go: WB.Teaching.go(a, "W45", { learnerId: row.personId, assessmentId: null, receiptId: null }) }) };
    gb.items.forEach(function (it) {
      var html = cellOf(a, row, it).html;
      var receipts = a.sel.receiptsFor(a.view, it.id, a.who).filter(function (r) { return (r.captured_members || [r.owner_id]).indexOf(row.personId) >= 0; });
      var receipt = receipts.slice().sort(function (x, y) { return y.attempt - x.attempt; })[0];
      var dest = WB.Teaching.go(a, "W49", { assessmentId: it.id, learnerId: row.personId, receiptId: receipt ? receipt.id : null });
      var legacy = !a.selection && it.id === P.assessmentId(a) && row.personId === linkFor ? "W49" : null;
      var go = " " + a.K.link({ label: "Open in grader", ariaLabel: "Open " + it.title + " for " + row.name, go: legacy || dest });
      cells["i-" + it.id] = html + go;
    });
    if (a.role === "instructor") {
      cells.total = esc(row.total || "");
      cells.released = esc(row.releasedTotal || "");
    }
    return { id: row.personId, cells: cells };
  }

  function filterEmpty() {
    return { title: "No learners match the filter", body: P.p("Other learners are still in the course."), action: { label: "Clear filters", note: "Preview only: filters are not wired" } };
  }

  function table(a, gb) {
    var linkFor = anchorLearner(a);
    var rows = a.state === "filteredEmpty" ? [] : gb.rows.map(function (r) { return tableRow(a, gb, r, linkFor); });
    var empty = a.state === "filteredEmpty" ? filterEmpty() : { title: "No learners yet", body: P.p("Learners appear here once they are enrolled.") };
    return a.K.table(a.ctx, { id: P.id(a, "gradebook"), caption: "Gradebook", columns: columns(a, gb), rows: rows, empty: empty });
  }

  function learnerRow(a, gb) {
    var id = P.learnerId(a);
    return gb.rows.filter(function (r) { return r.personId === id; })[0] || gb.rows[0] || null;
  }

  function learnerList(a, gb, row) {
    var items = gb.items.map(function (it) {
      var c = cellOf(a, row, it);
      return { title: it.title, meta: c.text || undefined, trailing: c.status || undefined, go: WB.Teaching.go(a, "W49", { assessmentId: it.id, learnerId: row.personId, receiptId: null }) };
    });
    var totals = a.role === "instructor" ? a.K.kv([{ label: "Total (staff, includes held)", value: row.total || "No calculable grade" }, { label: "Released total", value: row.releasedTotal || "No released results" }]) : "";
    return P.stack(a, [a.K.section({ title: row.name, body: a.K.list({ label: "Grade items for " + row.name, items: items }), level: 2 }), totals]);
  }

  function single(a, gb) {
    var hold = a.role === "instructor" ? [{ label: "Hold this learner's pending results", note: "Preview only: nothing is held in this prototype" }] : [];
    var handoff = P.handoff(a, { title: "Open on a larger screen", protectiveActions: hold });
    // SPINE-10: a filter that matches nobody wins before a learner is chosen, so no grades are drawn.
    if (a.state === "filteredEmpty") return P.stack(a, [handoff, a.K.empty(filterEmpty())]);
    var row = learnerRow(a, gb);
    if (!row) return a.K.empty({ title: "No learners yet", body: P.p("Learners appear here once they are enrolled.") });
    return P.stack(a, [handoff, WB.Teaching.picker(a, "W51", row.personId), P.links(a, [{ label: "Student course record", go: WB.Teaching.go(a, "W45", { learnerId: row.personId, assessmentId: null, receiptId: null }) }]), learnerList(a, gb, row)]);
  }

  function links(a) {
    if (a.role !== "instructor") return P.p("Releasing feedback is the instructor's step");
    return P.links(a, [{ label: "Release feedback", go: "W53" }, { label: "Grading policy", go: "W52" }]);
  }

  function top(a) {
    if (a.state === "offline") return P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown")]);
    if (a.state !== "firstUseEmpty") return "";
    return a.K.notice({ tone: "info", title: "Empty categories", body: P.p("A category with no released results is left out of the total until something is released.") });
  }

  function body(a) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "the gradebook")]);
    var gb = a.sel.gradebook(a.view, a.who.courseId, a.who);
    if (!gb) return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a)]);
    var main = a.platform === "web" ? table(a, gb) : single(a, gb);
    return P.stack(a, [top(a), main, links(a)]);
  }

  WB.definePage("W51", {
    states: STATES,
    na: P.na(STATES, { invalid: "Cells are read-only here; marks are entered in the grader" }),
    render: function (a) { return P.shell(a, { title: a.page.title, body: body(a) }, { page: "W51" }); },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
