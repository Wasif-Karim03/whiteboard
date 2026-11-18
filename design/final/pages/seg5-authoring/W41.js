/* W41 Quiz editor (Phase 3 seg5). Anchor: Quiz 3. Settings come from the quiz record; an active attempt locks
   editing; bank questions stay pinned (BD22). No answer-key data exists, so the key stays hidden. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "invalid", "saveFailed", "offline", "permissionUnavailable"];
  var PREVIEW = "Preview only: nothing changes in this prototype";
  var KINDS = { single_choice: "Single choice", multiple_select: "Multiple select", numeric: "Numeric", written: "Written" };
  var RULES = { latest: "The latest attempt counts", instructor: "The instructor releases results", not_permitted: "AI tools are not permitted" };

  function itemId(a) { return a.selection && a.selection.assessmentId || a.sel.anchorFor("W41").record.id; }
  function quizOf(a) { return a.sel.quiz(a.view, a.sel.assessment(a.view, itemId(a)).quiz_id); }
  function rule(v) { return Object.prototype.hasOwnProperty.call(RULES, v) ? RULES[v] : ""; }
  function active(a, q) {
    return a.sel.enrolled(a.view, a.who.courseId, "student").filter(function (id) {
      var t = a.sel.attemptView(a.view, q.id, id);
      return t && t.active;
    }).length;
  }
  function heldCount(a) {
    var fam = a.sel.receivedFamily();
    return a.sel.submissionsFor(a.view, itemId(a)).filter(function (s) { return !s.released && fam.indexOf(s.state) >= 0; }).length;
  }

  function settings(a, q) {
    return a.K.kv([
      { label: "Opens", value: P.when(a, q.opens) }, { label: "Closes", value: P.when(a, q.close) },
      { label: "Time limit", value: q.minutes + " minutes" }, { label: "Attempts", value: String(q.max_attempts) },
    ].concat(a.role === "instructor" ? [{ label: "Points", value: String(q.max) }, { label: "Version", value: String(q.version) },
      { label: "Counting", value: rule(q.selection) }, { label: "Results", value: rule(q.release_rule) }, { label: "AI use", value: rule(q.ai_policy) }] : []));
  }
  function status(a, q) {
    var n = active(a, q);
    return P.stack(a, [
      n ? a.K.notice({ tone: "warning", title: "An attempt is in progress", body: P.p("Attempts in progress: " + n) }) : P.p("No attempt is in progress"),
      P.p("Results not yet released: " + heldCount(a)),
      P.p("Questions added from the bank are pinned to the version chosen. A later bank edit does not change this quiz."),
    ]);
  }
  function editor(a, q) {
    var reason = active(a, q) ? "Wait until the active attempt ends" : a.state === "offline" ? "You're offline. Nothing has been published"
      : a.state === "invalid" ? "Choose a correct answer first" : null;
    var f = function (key, label, value) {
      return a.K.field(Object.assign({ id: P.id(a, key), label: label, type: "number", value: value }, reason ? { disabled: true, reason: reason } : {}));
    };
    var rows = q.items.map(function (x) { var it = typeof x === "string" ? { id: x } : x; return { title: "Question " + it.id, meta: KINDS[it.kind] || "" }; });
    return P.stack(a, [
      a.state === "invalid" ? a.K.notice({ tone: "error", title: "Choose a correct answer for this question", body: P.p(rows[0].title) }) : "",
      a.state === "saveFailed" ? a.K.notice({ tone: "error", title: "The quiz was not saved; your changes are still on this page", actions: [{ label: "Retry save", note: PREVIEW }] }) : "",
      f("minutes", "Time limit in minutes", q.minutes), f("attempts", "Attempts", q.max_attempts),
      a.K.list({ label: "Questions", items: rows }),
      reason ? a.K.button({ label: "Save quiz", kind: "primary", disabled: true, reason: reason, id: P.id(a, "save") }) : a.K.button({ label: "Save quiz", kind: "primary", note: PREVIEW }),
      a.K.section({ title: "Answer key", level: 2, body: P.stack(a, [P.p("Hidden until you choose Show"), a.K.button({ label: "Show answer key", note: PREVIEW })]) }),
    ]);
  }
  function links(a) {
    var al = a.sel.allowanceFor(a.view, itemId(a), P.learnerId(a));
    return P.links(a, [{ label: "Add from question bank", go: "W42" }, al ? { label: "Allowances", go: P.recordGo("W46", "allowance", al.id) } : null].filter(function (l) { return l && l.go; }));
  }

  function body(a, q) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "the quiz")]);
    if (a.role === "ta") return P.stack(a, [P.bareHandoff(a), a.K.flag("readOnly"), P.p("Editing this course is the instructor's step"), settings(a, q)]);
    return P.stack(a, [
      P.handoff(a, { title: "Open on a larger screen" }), a.state === "offline" ? P.offlineNotice(a) : "",
      settings(a, q), status(a, q), a.tier === "full" ? editor(a, q) : "", links(a),
    ]);
  }

  WB.definePage("W41", {
    states: STATES,
    na: P.na(STATES, {
      firstUseEmpty: "This page edits one existing quiz, so there is no empty view",
      saving: "No quiz change is recorded, so there is no save in progress to show",
      conflict: "No other staff edit of this quiz is recorded",
    }),
    render: function (a) {
      var q = quizOf(a);
      return P.shell(a, { title: "Edit quiz: " + q.title, body: body(a, q), back: { label: "Builder", go: "W35" } }, { page: "W35" });
    },
  });
})(globalThis);
