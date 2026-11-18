/* Whiteboard Phase 2b fixtures: quizzes, allowances, attempts and the quiz timing selectors.
   Sources: spec/docs/22-fixtures-overview.html (quiz, allowance, quiz_attempt_scenario,
   late_quiz_start_scenario); board-deep-dive-2026-11-15.md:1024-1034 (W25: opens, closes, 30 minutes with
   extra time, 2 attempts; effective deadline = min(personal close, start + effective minutes)), :1590 (W41:
   timer 20 minutes, questions version 3), :1655 (W46: Aisha 20 plus 10 minutes, AS-EXAMPLE-026), :1096 (W27
   receipt). decisions.md BD27 (selection rule disclosed before start). The base world has no Quiz 3 attempt;
   scenario overrides in fixtures/scenarios.js add it. The base Quiz 2 attempt and its receipt (Phase 2 gate
   R7) are chosen by Claude under owner delegation. Fictional, "reconstructed". */
(function (root) {
  "use strict";
  var WB = root.WB;
  var sel = WB.sel;
  var def = function (k, v) { return WB.defineFrozen(sel, k, v); };
  var PHYS = "phys110-f26";
  function answer(item, at) { return { item_id: item, value: "sample-answer-" + item, acknowledged_at: at }; }

  WB.defineFrozen(WB.data, "quiz", {
    meta: { source: "reconstructed", basis: ["spec/docs/22-fixtures-overview.html", "board-deep-dive-2026-11-15.md:1024-1034,1096,1590,1655", "decisions.md BD27"] },
    quizzes: [
      {
        id: "quiz2", course_id: PHYS, title: "Quiz 2", version: 1, opens: "2026-10-05T08:00:00-04:00", close: "2026-10-06T23:59:00-04:00",
        minutes: 20, max_attempts: 1, selection: "latest", release_rule: "instructor", ai_policy: "not_permitted", max: 10, items: ["q2-1", "q2-2", "q2-3", "q2-4"],
      },
      {
        id: "quiz3", course_id: PHYS, title: "Quiz 3: Projectile motion", version: 3, opens: "2026-10-21T08:00:00-04:00", close: "2026-10-22T23:59:00-04:00",
        minutes: 20, max_attempts: 2, selection: "latest", release_rule: "instructor", ai_policy: "not_permitted", max: 10,
        items: [
          { id: "q1", kind: "single_choice" },
          { id: "q2", kind: "multiple_select" },
          { id: "q3", kind: "numeric" },
          { id: "q4", kind: "written" },
        ],
      },
    ],
    allowances: [
      { id: "aisha-quiz3", person_id: "aisha", assessment_id: "quiz3", extra_minutes: 10, multiplier: null, timer_mode: "extra_minutes", recorded_by: "reyes", basis_reference_instructor_only: "AS-EXAMPLE-026", note: "Extra time on timed quizzes." },
    ],
    attempts: [
      {
        id: "aisha-quiz2-1", person_id: "aisha", quiz_id: "quiz2", attempt: 1, started_at: "2026-10-05T09:00:00-04:00",
        answers: [
          answer("q2-1", "2026-10-05T09:03:00-04:00"),
          answer("q2-2", "2026-10-05T09:07:00-04:00"),
          answer("q2-3", "2026-10-05T09:11:00-04:00"),
          answer("q2-4", "2026-10-05T09:15:00-04:00"),
        ],
        received_at: "2026-10-05T09:16:00-04:00", receipt_id: "AH-PHYS110-Q2-001",
      },
    ],
  });

  def("quiz", function (view, quizId) {
    return view.data.quiz.quizzes.filter(function (q) { return q.id === quizId; })[0] || null;
  });
  function quizOrThrow(view, quizId) {
    var q = sel.quiz(view, quizId);
    if (!q) throw new Error("WB.sel: unknown quiz '" + quizId + "'");
    return q;
  }
  def("allowanceFor", function (view, quizId, personId) {
    return view.data.quiz.allowances.filter(function (a) { return a.assessment_id === quizId && a.person_id === personId; })[0] || null;
  });

  // Base minutes plus extra minutes, or base times a multiplier; never both (DD:1032). The product is kept
  // exact (15 × 1.5 = 22.5); only display text rounds (R14).
  def("effectiveMinutes", function (view, quizId, personId) {
    var q = quizOrThrow(view, quizId);
    var a = sel.allowanceFor(view, quizId, personId);
    if (!a) return q.minutes;
    var hasExtra = a.extra_minutes !== null && a.extra_minutes !== undefined;
    var hasMult = a.multiplier !== null && a.multiplier !== undefined;
    if (hasExtra && hasMult) throw new Error("WB.sel.effectiveMinutes: allowance '" + a.id + "' sets both extra_minutes and multiplier");
    if (hasMult) return q.minutes * a.multiplier;
    return q.minutes + (hasExtra ? a.extra_minutes : 0);
  });

  // min(personal close, startedAt + effective minutes)
  def("effectiveDeadline", function (view, quizId, personId, startedAt) {
    var q = quizOrThrow(view, quizId);
    return sel.minIso(q.close, sel.addMinutes(startedAt, sel.effectiveMinutes(view, quizId, personId)));
  });
  // The last start time that still gets the full effective minutes: close minus effective minutes.
  def("lateStartThreshold", function (view, quizId, personId) {
    return sel.addMinutes(quizOrThrow(view, quizId).close, -sel.effectiveMinutes(view, quizId, personId));
  });
  def("availableMinutes", function (view, quizId, personId, startedAt) {
    return sel.minutesBetween(startedAt, sel.effectiveDeadline(view, quizId, personId, startedAt));
  });

  def("attemptFor", function (view, quizId, personId) {
    return view.data.quiz.attempts.filter(function (t) { return t.quiz_id === quizId && t.person_id === personId; })[0] || null;
  });

  // The W26 attempt as of the view clock: {active, secondsLeft, acknowledged, unsent, deadline}, or null.
  def("attemptView", function (view, quizId, personId) {
    var t = sel.attemptFor(view, quizId, personId);
    if (!t) return null;
    var deadline = sel.effectiveDeadline(view, quizId, personId, t.started_at);
    var active = t.received_at === null && sel.isBefore(view.clock, deadline);
    var acknowledged = t.answers.filter(function (x) { return x.acknowledged_at !== null; }).length;
    return {
      active: active,
      secondsLeft: active ? Math.max(0, sel.minutesBetween(view.clock, deadline) * 60) : 0,
      acknowledged: acknowledged,
      unsent: t.answers.length - acknowledged,
      deadline: deadline,
    };
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
