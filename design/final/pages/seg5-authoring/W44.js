/* W44 Rubric editor (Phase 3 seg5). Anchor: the problem-set rubric. Once scored work uses it, points change only
   through Preview impact (W50). A TA reads the criteria of an active task only (A6). */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "invalid", "saving", "conflict", "offline", "permissionUnavailable"];
  var PREVIEW = "Preview only: nothing changes in this prototype";
  var SAVE = { saving: "saving", conflict: "conflict", offline: "savedLocal" };

  function found(a) {
    var id = a.sel.anchorFor("W44").record.id;
    return P.assessments(a).map(function (it) { return { it: it, r: a.sel.rubricFor(a.view, it.id, a.who) }; })
      .filter(function (e) { return e.r && e.r.id === id; })[0] || null;
  }
  function inUse(a, it) {
    return a.role === "instructor" && a.sel.enrolled(a.view, a.who.courseId, "student").some(function (id) { return a.sel.gradeDraftFor(a.view, id, it.id, a.who); });
  }
  function total(r) { return r.criteria.reduce(function (n, c) { return n + c.max; }, 0); }

  function readOnly(a, e, scope) {
    var criteria = scope ? e.r.criteria.filter(function (c) { return scope.questionIds.indexOf(c.question_id) >= 0; }) : e.r.criteria;
    var points = criteria.reduce(function (n, c) { return n + c.max; }, 0);
    return a.K.kv(criteria.map(function (c) { return { label: "Question " + c.question_id + ": " + c.title, value: c.max + " points" }; })
      .concat([{ label: scope ? "Assigned points" : "Total", value: scope ? points + " points" : total(e.r) + " of " + e.it.max + " points" }]));
  }
  function editor(a, e, used) {
    var lock = used ? { disabled: true, reason: "Change points through Preview impact" } : {};
    var rows = [];
    e.r.criteria.forEach(function (c, i) {
      rows.push(
        a.K.field({ id: P.id(a, "t" + i), label: "Question " + c.question_id + " criterion", value: c.title }),
        a.K.field(Object.assign({ id: P.id(a, "p" + i), label: "Question " + c.question_id + " points", type: "number", value: c.max, help: "Whole points" }, lock)),
        a.K.button({ label: "Move up", kind: "quiet", note: PREVIEW }) + a.K.button({ label: "Move down", kind: "quiet", note: PREVIEW })
      );
    });
    var off = a.state === "offline";
    var save = used ? "" : off ? a.K.button({ label: "Save rubric", disabled: true, reason: "You're offline. Nothing has been published", id: P.id(a, "save") })
      : a.K.button({ label: "Save rubric", kind: "primary", note: PREVIEW });
    return P.stack(a, rows.concat([P.p("Total: " + total(e.r) + " of " + e.it.max + " points"), save]));
  }
  function notices(a, e, used) {
    var impact = P.recordGo("W50", "rubric", e.r.id);
    var full = a.tier === "full";
    return P.stack(a, [
      a.state === "offline" ? P.offlineNotice(a) : "",
      full && SAVE[a.state] ? a.K.saveStatus(SAVE[a.state]) : "",
      a.state === "invalid" ? a.K.notice({ tone: "error", title: "Criteria must add up to " + e.it.max + " points" }) : "",
      a.state === "conflict" ? a.K.notice({ tone: "warning", title: "Another staff member changed this rubric",
        actions: full ? [{ label: "Reload", note: PREVIEW }, { label: "Compare", note: PREVIEW }] : [] }) : "",
      used ? a.K.notice({ tone: "warning", title: "Scores already use version " + e.r.version, actions: impact ? [{ label: "Preview impact", go: impact }] : [] }) : "",
    ]);
  }

  function taView(a, e) {
    var acc = a.sel.taTaskAccess(a.view, e.it.id, a.who);
    if (!acc.task) return P.unallocatedNotice(a);
    var scope = acc.active ? a.sel.taScope(a.view, e.it.id, a.who) : null;
    if (!scope) return a.K.notice({ tone: "info", title: "Access ended", body: P.p(e.it.title) });
    return P.stack(a, [a.K.flag("readOnly"), P.p("Editing this course is the instructor's step"), readOnly(a, e, scope), scope.allQuestions ? "" : P.p("Other questions are outside your grading task")]);
  }

  function body(a) {
    var gate = P.staffGate(a, null);
    if (gate) return gate;
    if (a.state === "loading") return P.stack(a, [P.bareHandoff(a), P.loading(a, "the rubric")]);
    var e = found(a);
    if (!e) return P.stack(a, [P.bareHandoff(a), P.permissionNotice(a)]);
    var links = P.links(a, [{ label: "Rubric library", go: "W43" }, { label: "Course home", go: P.recordGo("W14", "course", a.who.courseId) }].filter(function (l) { return l.go; }));
    if (a.role === "ta") return P.stack(a, [P.bareHandoff(a), taView(a, e), links]);
    var used = inUse(a, e.it);
    return P.stack(a, [
      P.handoff(a, { title: "Open on a larger screen" }), P.p("Rubric for " + e.it.title), notices(a, e, used),
      a.tier === "full" ? editor(a, e, used) : readOnly(a, e), links,
    ]);
  }

  WB.definePage("W44", {
    states: STATES,
    na: P.na(STATES, {
      firstUseEmpty: "This page edits one existing rubric, so there is no empty view",
      saveFailed: "No rubric change is recorded, so no save can fail here",
    }),
    render: function (a) { return P.shell(a, { title: "Edit rubric", body: body(a), back: { label: "Rubric library", go: "W43" } }, { page: "W43" }); },
  });
})(globalThis);
