/* W25 Quiz rules/start (Phase 3 seg3-submit). Student, instructor and TA. Anchor: the quiz assessment, home
   default. Authority branches run first: staff see the published rules only (no learner attempt, allowance or
   receipt). The learner's branch follows the clock (not open, active attempt, received, closed, eligible).
   Start is the committing action: unacknowledged by default, an opener on acknowledged, the dialog open on
   confirm; its primary item is preview-only and a separate link shows an example attempt (amendment A2).
   Contract: pages/SPINE.md and pages/seg3-submit/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "offline", "notYetAvailable", "saveFailed", "conflict", "permissionUnavailable"];
  var ACKNOWLEDGED = ["acknowledged", "confirm"];
  // The scenario where the quiz is open and the learner has no attempt (guarded by tools/seg3-submit.test.mjs).
  var OPEN_CLOCK = "group_submission";
  var SELECTION = { latest: "Your latest attempt counts." };
  var RELEASE = { instructor: "Scores are shown after the instructor releases them." };
  var AI = { not_permitted: "AI tools are not permitted in this quiz." };
  var PREVIEW_NOTE = "Preview only: nothing starts in this prototype";

  function rule(map, key) { return Object.prototype.hasOwnProperty.call(map, key) ? map[key] : ""; }
  function minutes(n) { return String(n) + (n === 1 ? " minute" : " minutes"); }
  function itemOf(a) { return a.sel.assessment(a.view, a.selection && a.selection.assessmentId || a.sel.anchorFor("W25").record.id); }
  function clockTime(a, iso) { return a.sel.fmtTime(iso) + " " + a.sel.zoneAbbr(iso); }

  function rulesRows(a, item, quiz) {
    var rows = [
      { label: "Questions", value: String(quiz.items.length) }, { label: "Points", value: String(item.max) },
      { label: "Question version", value: String(quiz.version) }, { label: "Opens", value: P.when(a, quiz.opens) },
      { label: "Closes", value: P.when(a, quiz.close) }, { label: "Attempts allowed", value: String(quiz.max_attempts) },
    ];
    [["Which attempt counts", rule(SELECTION, quiz.selection)], ["Scores", rule(RELEASE, quiz.release_rule)], ["AI tools", rule(AI, quiz.ai_policy)]]
      .forEach(function (r) { if (r[1]) rows.push({ label: r[0], value: r[1] }); });
    return rows;
  }

  function rulesSection(a, item, quiz, timing) {
    var body = a.K.kv(rulesRows(a, item, quiz)) + timing +
      P.p("Leaving the quiz window is never treated as evidence and never cancels an attempt.");
    return a.K.section({ title: "Rules", body: body });
  }

  // ---------- Learner timing (own id only; never the allowance basis, note or recorder) ----------
  function ownTiming(a, quiz) {
    var me = a.who.personId;
    var allowance = a.sel.allowanceFor(a.view, quiz.id, me);
    var rows = [{ label: "Your time", value: minutes(a.sel.effectiveMinutes(a.view, quiz.id, me)) }];
    if (allowance) {
      var extra = allowance.multiplier ? "× " + allowance.multiplier : "plus " + minutes(allowance.extra_minutes);
      rows.push({ label: "Extra time", value: minutes(quiz.minutes) + " " + extra });
    }
    rows.push({ label: "To get your full time, start by", value: clockTime(a, a.sel.lateStartThreshold(a.view, quiz.id, me)) });
    return (allowance ? a.K.flag("extension") : "") + a.K.kv(rows);
  }

  function publishedTiming(a, quiz) {
    var rows = [
      { label: "Time limit", value: minutes(quiz.minutes) },
      { label: "Full time without extra time if started by", value: clockTime(a, a.sel.lateStartThreshold(a.view, quiz.id, a.who.personId)) },
    ];
    return a.K.kv(rows) + P.p("Personal extra time is not shown in this preview.");
  }

  // ---------- Staff preview (published rules only) ----------
  function staff(a, item, quiz) {
    if (a.state === "permissionUnavailable") return P.permissionNotice(a, a.role === "instructor" ? "You are not teaching this course" : null);
    if (a.state === "loading") return P.loading(a, "the quiz rules");
    var rules = rulesSection(a, item, quiz, publishedTiming(a, quiz));
    if (P.taEnded(a)) return P.stack(a, [P.taEndedNotice(a, null), rules, P.links(a, [{ label: "Coursework", go: "W18" }])]);
    var top = a.K.notice({ tone: "info", title: "Staff preview of the learner rules", body: P.p("Learners see these rules before they start.") });
    var edit = a.role === "instructor" ? P.recordGo("W41", "assessment", item.id) : null;
    var side = a.role === "ta" ? P.p("Quiz timing, extra time and release are the instructor's step.") : "";
    return P.stack(a, [
      a.state === "offline" ? P.offlineNotice(a) : "", a.role === "instructor" ? a.K.flag("preview") : "", top, rules, side,
      P.links(a, [edit ? { label: "Edit quiz", go: edit } : null, { label: "Coursework", go: "W18" }]),
    ]);
  }

  // ---------- Learner Start ----------
  function startOff(a, reason) { return a.K.button({ label: "Start attempt", disabled: true, reason: reason, id: P.id(a, "start-btn") }); }

  function blockOf(a) {
    if (a.state === "offline") return { reason: "You're offline. A timed attempt cannot start", notice: P.offlineNotice(a) };
    if (a.state === "saveFailed") {
      return { reason: "Check before starting again", notice: a.K.notice({ tone: "warning", title: "We could not confirm whether your attempt started",
        body: P.p("Check for an active attempt before starting again."), actions: [{ label: "Check for an active attempt", note: "Preview only: nothing is checked in this prototype" }] }) };
    }
    if (a.state === "conflict") {
      return { reason: "Confirm the current timing first", notice: a.K.notice({ tone: "warning", title: "The quiz timing changed since you opened this page",
        body: P.p("Refresh the rules before you start."), actions: [{ label: "Refresh rules", note: "Preview only: nothing is refreshed in this prototype" }] }) };
    }
    return null;
  }

  function shortNotice(a, quiz, avail) {
    return a.K.notice({ tone: "warning", title: "Only " + minutes(avail) + " are left if you start now",
      body: P.p("The quiz closes at " + P.when(a, quiz.close) + ", so your attempt ends then.") });
  }

  function dialog(a, quiz, avail, full) {
    var rows = [
      { label: "Your time", value: minutes(full) }, { label: "Available if you start now", value: minutes(avail) },
      { label: "Hard close", value: P.when(a, quiz.close) }, { label: "Attempt", value: "1 of " + quiz.max_attempts },
    ];
    if (rule(AI, quiz.ai_policy)) rows.push({ label: "AI tools", value: rule(AI, quiz.ai_policy) });
    var body = (avail < full ? shortNotice(a, quiz, avail) : "") + a.K.kv(rows) +
      P.p("The timer keeps running if you leave or lose connection.") +
      P.p("Nothing starts in this prototype. The example attempt below is a separate record, not the result of this action.");
    return a.K.dialog(a.ctx, {
      id: P.id(a, "start"), title: "Start this attempt", open: a.variant === "confirm", body: body,
      actions: [{ id: P.id(a, "start-go"), label: "Start attempt now", kind: "primary", note: PREVIEW_NOTE }].concat(
        quiz.id === a.sel.anchorFor("W25").record.id ? [{ id: P.id(a, "start-example"), label: "See an example attempt in progress", go: "W26~" + a.sel.anchorFor("W26").home }] : []),
    });
  }

  function eligible(a, quiz) {
    var me = a.who.personId;
    var full = a.sel.effectiveMinutes(a.view, quiz.id, me);
    var avail = a.sel.availableMinutes(a.view, quiz.id, me, a.view.clock);
    var block = blockOf(a);
    var ok = !block && ACKNOWLEDGED.indexOf(a.variant) >= 0;
    var box = a.K.field({ id: P.id(a, "rules-box"), type: "checkbox", label: "I have read the current rules", checked: ok, disabled: true,
      reason: block ? block.reason : "Use the link below to change this" });
    var warn = avail < full ? shortNotice(a, quiz, avail) : "";
    if (block) return { html: P.stack(a, [block.notice, warn, box, startOff(a, block.reason)]), dialog: null };
    if (!ok) {
      return { html: P.stack(a, [warn, box, startOff(a, "Confirm you have read the current rules first"), P.links(a, [{ label: "I have read them", go: "W25:acknowledged" }])]), dialog: null };
    }
    var opener = a.K.button({ label: "Start attempt", kind: "primary", act: "open-dialog", target: P.id(a, "start") });
    return { html: P.stack(a, [warn, box, opener, P.links(a, [{ label: "Not read yet", go: "W25" }])]), dialog: dialog(a, quiz, avail, full) };
  }

  function notOpen(a, quiz) {
    var opens = P.when(a, quiz.opens);
    var notice = a.K.notice({ tone: "info", title: "This quiz opens " + opens, actions: quiz.id === a.sel.anchorFor("W25").record.id ? [{ label: "See this quiz at a clock when it is open", go: "W25~" + OPEN_CLOCK }] : [] });
    return P.stack(a, [a.K.flag("notOpen"), startOff(a, "Opens " + opens), notice]);
  }

  function startPanel(a, quiz) {
    var me = a.who.personId;
    var clock = a.view.clock;
    var attempt = a.sel.attemptFor(a.view, quiz.id, me);
    var av = a.sel.attemptView(a.view, quiz.id, me);
    if (a.sel.isBefore(clock, quiz.opens)) return { html: notOpen(a, quiz), dialog: null };
    if (a.state === "notYetAvailable") return { html: P.offHome(a, "This quiz has already opened at this point"), dialog: null };
    if (av && av.active) return { html: active(a, quiz, attempt, av), dialog: null };
    if (attempt && attempt.received_at) return { html: received(a, quiz, attempt), dialog: null };
    if (attempt) {
      var attemptGo = P.recordGo("W26", "attempt", attempt.id);
      return { html: P.stack(a, [P.p("The time for your attempt is up."), attemptGo ? P.links(a, [{ label: "Check the attempt", go: attemptGo }]) : P.p("This attempt is not drawn in the prototype")]), dialog: null };
    }
    if (!a.sel.isBefore(clock, quiz.close)) return { html: P.stack(a, [a.K.flag("closed"), P.p("This quiz closed " + P.when(a, quiz.close) + ".")]), dialog: null };
    return eligible(a, quiz);
  }

  function active(a, quiz, attempt, av) {
    var started = a.sel.availableMinutes(a.view, quiz.id, a.who.personId, attempt.started_at);
    var full = a.sel.effectiveMinutes(a.view, quiz.id, a.who.personId);
    return P.stack(a, [
      a.K.timer({ label: "Time left", remaining: minutes(Math.ceil(av.secondsLeft / 60)), endsAt: P.when(a, av.deadline) }),
      started < full ? P.p("This attempt started with " + minutes(started) + " available.") : "",
      P.recordGo("W26", "attempt", attempt.id) ? P.links(a, [{ label: "Resume attempt", go: P.recordGo("W26", "attempt", attempt.id) }]) : P.p("This attempt is not drawn in the prototype"),
    ]);
  }

  function received(a, quiz, attempt) {
    var receipt = P.recordGo("W27", "receipt", attempt.receipt_id) || (attempt.receipt_id ? WB.Teaching.go(a, "W27", { assessmentId: itemOf(a).id, learnerId: a.who.personId, receiptId: attempt.receipt_id }) : null);
    var more = attempt.attempt < quiz.max_attempts && a.sel.isBefore(a.view.clock, quiz.close);
    return P.stack(a, [
      P.p("Attempt " + attempt.attempt + " of " + quiz.max_attempts + " is handed in."),
      receipt ? P.links(a, [{ label: "View receipt", go: receipt }]) : "",
      more ? startOff(a, "A second attempt is not drawn in this prototype") : "",
    ]);
  }

  function learner(a, item, quiz) {
    if (a.state === "permissionUnavailable") return { body: P.permissionNotice(a), dialog: null };
    if (a.state === "loading") return { body: P.loading(a, "the quiz rules"), dialog: null };
    var panel = startPanel(a, quiz);
    var rail = a.K.section({ title: "Start", body: P.stack(a, [P.status(a, P.ownSubmission(a, item.id), true), panel.html]), level: 2 });
    var main = P.stack(a, [rulesSection(a, item, quiz, ownTiming(a, quiz)), P.links(a, [{ label: "Coursework", go: "W18" }])]);
    return { body: a.K.rail(a.ctx, { main: main, rail: rail, railLabel: "Start" }), dialog: panel.dialog };
  }

  WB.definePage("W25", {
    states: STATES,
    na: P.na(STATES, {
      success: "Starting leads to the attempt page; this page shows no outcome of its own",
      invalid: "The only input is the rules acknowledgement, which blocks Start instead",
      saving: "Starting is one confirmed step; nothing here saves in the background",
    }),
    variants: { acknowledged: "Rules acknowledged: Start enabled", confirm: "Start dialog open" },
    render: function (a) {
      var item = itemOf(a);
      if (!item || !item.quiz_id) return P.shell(a, { title: "Quiz rules", body: P.permissionNotice(a) }, { section: "coursework" });
      var gate = P.publicationGate(a, item);
      if (gate) return gate;
      var quiz = a.sel.quiz(a.view, item.quiz_id);
      var v = a.role === "student" ? learner(a, item, quiz) : { body: staff(a, item, quiz), dialog: null };
      var out = { title: "Quiz rules: " + item.title, body: v.body };
      if (v.dialog) out.dialog = v.dialog;
      return P.shell(a, out, { section: "coursework" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
