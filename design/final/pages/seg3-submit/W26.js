/* W26 Quiz attempt (Phase 3 seg3-submit). Student only. Anchor: the persona's Quiz 3 attempt, home
   quiz_in_progress. The attempt counts only when its id is the anchor id (rule R-truth); with no attempt, a
   received one or an expired one the page says so and draws no answer fields. Choices are unselected
   placeholders and only acknowledged answers are called saved (amendment A3). Submit is unreviewed by default,
   an opener on reviewed, the dialog open on confirm; its primary item is preview-only and a separate link
   shows an example receipt (A2). Saving, offline, saveFailed and invalid always win. Sign in again is
   preview-only (A1). Contract: pages/SPINE.md and pages/seg3-submit/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "invalid", "saving", "saveFailed", "offline", "sessionExpired"];
  var REVIEWED = ["reviewed", "confirm"];
  var CHOICES = ["Choice A", "Choice B", "Choice C", "Choice D"];
  var CHOICE_KINDS = ["single_choice", "multiple_select"];
  var LOCAL_SAVE = { saving: "saving", offline: "savedLocal", saveFailed: "failed" };
  var ROLE_NOTE = "Preview only: in this prototype, switch the role in the viewer bar or follow the tour";

  function minutes(n) { return String(n) + (n === 1 ? " minute" : " minutes"); }
  function plural(n, one, many) { return String(n) + " " + (n === 1 ? one : many); }
  // Quiz items are {id, kind} objects or plain ids; normalise to objects.
  function items(quiz) { return quiz.items.map(function (x) { return typeof x === "string" ? { id: x, kind: null } : x; }); }
  function answerOf(attempt, itemId) { return attempt.answers.filter(function (x) { return x.item_id === itemId; })[0] || null; }

  function context(a) {
    var item = a.sel.assessment(a.view, a.sel.anchorFor("W25").record.id);
    var quiz = a.sel.quiz(a.view, item.quiz_id);
    var attempt = a.sel.attemptFor(a.view, quiz.id, a.who.personId);
    if (attempt && attempt.id !== a.sel.anchorFor("W26").record.id) attempt = null;
    return { item: item, quiz: quiz, attempt: attempt, av: attempt ? a.sel.attemptView(a.view, quiz.id, a.who.personId) : null };
  }

  // ---------- Per-question view ----------
  function saveLine(a, ans) {
    if (!ans) return P.p("No answer yet");
    if (ans.acknowledged_at) return P.p("Saved answer: " + ans.value) + a.K.saveStatus("saved", { time: a.sel.fmtTime(ans.acknowledged_at) });
    var state = Object.prototype.hasOwnProperty.call(LOCAL_SAVE, a.state) ? LOCAL_SAVE[a.state] : "dirty";
    return P.p("Unsaved draft: not sent (" + ans.value + ")") + a.K.saveStatus(state);
  }

  function control(a, q, n, ans) {
    var base = P.id(a, q.id);
    var label = "Answer to question " + n;
    // R04: the kit has no disabled choice group, so placeholder choices are a plain list nobody can select.
    if (CHOICE_KINDS.indexOf(q.kind) >= 0) {
      return P.stack(a, [
        P.p(label + ": the question content is not in this prototype, so nothing can be chosen here"),
        a.K.list({ label: "Choices are not in this prototype", items: CHOICES.map(function (c) { return { title: c }; }) }),
      ]);
    }
    var error = q.kind === "numeric" && a.state === "invalid" ? "Enter a number, for example 12.5" : undefined;
    return a.K.field({ id: base, label: label, type: q.kind === "numeric" ? "text" : "textarea", value: ans ? ans.value : "", error: error });
  }

  function saveButton(a, q) {
    if (a.state === "offline") return a.K.button({ label: "Save answer", disabled: true, reason: "You're offline. Answers stay on this device", id: P.id(a, q.id + "-save") });
    if (a.state === "saving") return a.K.button({ label: "Save answer", disabled: true, reason: "An answer is still saving", id: P.id(a, q.id + "-save") });
    return a.K.button({ label: "Save answer", note: "Preview only: nothing is saved in this prototype" });
  }

  function questions(a, c) {
    return items(c.quiz).map(function (q, i) {
      var ans = answerOf(c.attempt, q.id);
      return a.K.section({ title: "Question " + (i + 1), body: P.stack(a, [control(a, q, i + 1, ans), saveLine(a, ans), saveButton(a, q)]), level: 2 });
    });
  }

  function statusText(ans) {
    if (!ans) return "No answer";
    return ans.acknowledged_at ? "Saved answer" : "Unsaved draft: not sent";
  }

  function questionList(a, c) {
    var list = a.K.list({ label: "Questions", items: items(c.quiz).map(function (q, i) {
      var ans = answerOf(c.attempt, q.id);
      return { title: "Question " + (i + 1), meta: statusText(ans) };
    }) });
    return a.sizeClass === "compact" ? a.K.disclosure({ id: P.id(a, "qlist"), summary: "Question status", body: list }) : list;
  }

  // ---------- Submit ----------
  function payloadRows(a, c) {
    return items(c.quiz).map(function (q, i) {
      var ans = answerOf(c.attempt, q.id);
      var value = !ans ? "No answer" : ans.acknowledged_at ? ans.value + " · saved " + a.sel.fmtTime(ans.acknowledged_at) : "Unsaved changes: will not be sent";
      return { label: "Question " + (i + 1), value: value };
    });
  }

  function summaryRows(a, c) {
    var total = c.quiz.items.length;
    return [
      { label: "Answered and saved", value: String(c.av.acknowledged) + " of " + total }, { label: "Not answered or not sent", value: String(total - c.av.acknowledged) },
      { label: "Attempt", value: String(c.attempt.attempt) }, { label: "Question version", value: String(c.quiz.version) },
      { label: "Time left", value: minutes(Math.ceil(c.av.secondsLeft / 60)) },
    ];
  }

  function dialog(a, c) {
    var missing = c.quiz.items.length - c.av.acknowledged;
    var warn = missing ? a.K.notice({ tone: "warning", title: plural(missing, "question has", "questions have") + " no saved answer", body: P.p("Only saved answers are sent.") }) : "";
    var body = warn + a.K.kv(payloadRows(a, c)) + a.K.kv(summaryRows(a, c)) + P.p("This cannot be changed after sending.") +
      P.p("Nothing is sent in this prototype. The example receipt below is a separate record, not the result of this action.");
    return a.K.dialog(a.ctx, {
      id: P.id(a, "submit"), title: "Submit this attempt", open: a.variant === "confirm", body: body,
      actions: [
        { id: P.id(a, "submit-go"), label: "Submit attempt", kind: "primary", note: "Preview only: nothing is sent in this prototype" },
        { id: P.id(a, "submit-example"), label: "See an example confirmed receipt", go: "W27~" + a.sel.anchorFor("W27").home },
      ],
    });
  }

  function block(a, c) {
    if (a.state === "saving") {
      return { reason: "An answer is still saving", notice: a.K.notice({ tone: "info", title: "An answer is still saving",
        body: P.p(plural(c.av.unsent, "answer is", "answers are") + " not confirmed yet. The timer has not been reset.") }) };
    }
    if (a.state === "offline") {
      return { reason: "You're offline. Nothing has been sent", notice: a.K.notice({ tone: "warning", title: "You're offline. Nothing has been sent",
        body: P.p("Unsent answers stay on this device only. Nothing is sent in the background. Reconnect before " + P.when(a, c.av.deadline) + ".") }) };
    }
    if (a.state === "saveFailed") {
      return { reason: "Check the status before sending again", notice: a.K.notice({ tone: "warning", title: "We could not confirm your submission",
        body: P.p("Check the status before sending again."), actions: [{ label: "Check status", go: "W27" }] }) };
    }
    if (a.state === "invalid") return { reason: "Fix the marked answer first", notice: "" };
    return null;
  }

  function submitOff(a, reason) { return a.K.button({ label: "Submit attempt", disabled: true, reason: reason, id: P.id(a, "submit-btn") }); }

  function commit(a, c) {
    var b = block(a, c);
    if (b) return { html: P.stack(a, [b.notice, submitOff(a, b.reason)]), dialog: null };
    if (REVIEWED.indexOf(a.variant) < 0) {
      return { html: P.stack(a, [submitOff(a, "Review your answers first"), P.links(a, [{ label: "Review answers", go: "W26:reviewed" }])]), dialog: null };
    }
    var review = a.K.section({ title: "Review", body: a.K.kv(payloadRows(a, c)), level: 3 });
    var opener = a.K.button({ label: "Submit attempt", kind: "primary", act: "open-dialog", target: P.id(a, "submit") });
    return { html: P.stack(a, [review, opener, P.links(a, [{ label: "Not reviewed yet", go: "W26" }])]), dialog: dialog(a, c) };
  }

  function activeView(a, c) {
    var cm = commit(a, c);
    var facts = a.K.kv([
      { label: "Attempt", value: String(c.attempt.attempt) }, { label: "Question version", value: String(c.quiz.version) },
      { label: "Saved answers", value: String(c.av.acknowledged) + " of " + c.quiz.items.length }, { label: "Not sent", value: String(c.av.unsent) },
    ]);
    var rail = P.stack(a, [
      a.K.timer({ label: "Time left", remaining: minutes(Math.ceil(c.av.secondsLeft / 60)), endsAt: P.when(a, c.av.deadline) }),
      facts, questionList(a, c), P.p("Nothing is sent in the background."), a.K.section({ title: "Submit", body: cm.html, level: 2 }),
    ]);
    return { body: a.K.rail(a.ctx, { main: P.stack(a, questions(a, c)), rail: rail, railLabel: "Attempt", railFirst: true }), dialog: cm.dialog };
  }

  // ---------- Not answerable ----------
  function rulesLink(a, c) { return { label: "Quiz rules", go: P.recordGo("W25", "assessment", c.item.id) || "W25" }; }

  function notAnswerable(a, c) {
    if (!c.attempt) {
      return P.stack(a, [P.status(a, P.ownSubmission(a, c.item.id), true), P.links(a, [rulesLink(a, c)]), P.offHome(a, "There is no attempt in progress at this point")]);
    }
    if (c.attempt.received_at) {
      var go = P.recordGo("W27", "receipt", c.attempt.receipt_id);
      return P.stack(a, [P.p("This attempt is already handed in."), go ? P.links(a, [{ label: "View receipt", go: go }]) : "", P.offHome(a, "This attempt is already handed in")]);
    }
    return a.K.notice({
      tone: "warning", title: "Time is up. Your answers are locked",
      body: P.p("The time ended " + P.when(a, c.av.deadline) + ".") + P.p("Only saved answers are finalised; no receipt exists until it is confirmed."),
      actions: [{ label: "Check status", go: "W27" }],
    });
  }

  function expired(a, c) {
    var until = c.av && c.av.active ? " The timer keeps running until " + P.when(a, c.av.deadline) + "." : "";
    return a.K.notice({
      tone: "warning", title: "Sign in again to continue", body: P.p("Your session has ended." + until),
      actions: [{ label: "Sign in again", note: ROLE_NOTE }, { label: "Get help", go: "W12" }],
    });
  }

  function view(a, c) {
    if (a.state === "loading") return { body: P.loading(a, "your attempt"), dialog: null };
    if (a.state === "sessionExpired") return { body: expired(a, c), dialog: null };
    if (!c.attempt || !c.av.active) return { body: notAnswerable(a, c), dialog: null };
    return activeView(a, c);
  }

  WB.definePage("W26", {
    states: STATES,
    na: P.na(STATES, {
      conflict: "One learner owns the attempt; a repeated send resolves to the same receipt",
      success: "The result of submitting is the receipt page",
      firstUseEmpty: "With no attempt the page says so and links to the rules",
    }),
    variants: { reviewed: "Review panel: Submit enabled", confirm: "Submit dialog open" },
    render: function (a) {
      var c = context(a);
      var gate = P.publicationGate(a, c.item);
      if (gate) return gate;
      var v = view(a, c);
      var out = { title: "Quiz attempt: " + c.item.title, body: v.body };
      if (a.state !== "saving") out.back = rulesLink(a, c);
      if (v.dialog) out.dialog = v.dialog;
      return P.shell(a, out, { section: "coursework" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
