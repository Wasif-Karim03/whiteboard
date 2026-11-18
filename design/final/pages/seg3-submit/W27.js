/* W27 Quiz receipt/review (Phase 3 seg3-submit). Student only. Anchor: the persona's Quiz 3 receipt, home
   quiz_received; variant quiz2 (the released Quiz 2 receipt, home default). The receipt is read at the current
   clock; when it is not there yet the page says so and shows no reference (rule R-truth). Nothing here edits.
   The released review shows only resultFor values; a held result shows no score. The rules link is record-true
   (amendment A10). Contract: pages/SPINE.md and pages/seg3-submit/NOTES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "offline", "success", "permissionUnavailable"];
  var RELEASE = { instructor: "Scores are shown after the instructor releases them." };

  function items(quiz) { return quiz.items.map(function (x) { return typeof x === "string" ? x : x.id; }); }

  // R08: an unresolved receipt keeps its identity. Only the default anchor is declared as the receipt for W25's
  // quiz (manifest/anchors.js); any other receipt that does not resolve has no assessment and gets no quiz links.
  function context(a) {
    var variant = P.recordVariant(a);
    var anchor = a.sel.anchorFor("W27", variant);
    var selectedId = a.selection && a.selection.receiptId;
    var receipt = P.receiptById(a, selectedId || anchor.record.id);
    var itemId = receipt ? receipt.assessment_id : a.selection && a.selection.assessmentId ? a.selection.assessmentId : variant ? null : a.sel.anchorFor("W25").record.id;
    var item = itemId ? a.sel.assessment(a.view, itemId) : null;
    if (!item || !item.quiz_id) return { receipt: null, item: null };
    var quiz = a.sel.quiz(a.view, item.quiz_id);
    var attempt = receipt && a.sel.quizAttemptForReceipt ? a.sel.quizAttemptForReceipt(a.view, receipt.id, a.who) : a.sel.attemptFor(a.view, quiz.id, a.who.personId);
    if (receipt && attempt && attempt.receipt_id !== receipt.id) attempt = null;
    var latest = a.sel.attemptFor(a.view, quiz.id, a.who.personId);
    return { receipt: receipt, item: item, quiz: quiz, attempt: attempt, av: attempt && latest && attempt.id === latest.id ? a.sel.attemptView(a.view, quiz.id, a.who.personId) : null };
  }

  function rulesLink(a, c) {
    var go = P.recordGo("W25", "assessment", c.item.id) || (a.selection ? WB.Teaching.go(a, "W25", { assessmentId: c.item.id, receiptId: null }) : null);
    return go ? { label: "Quiz rules and attempts", go: go } : null;
  }

  // ---------- Present receipt ----------
  function slip(a, c) {
    var r = c.receipt;
    var course = a.sel.course(a.view, a.who.courseId);
    return a.K.receipt({ ref: r.id, item: c.item.title, course: course.code, acceptedAt: a.sel.fmtDateTime(r.accepted_at), timeZone: a.sel.zoneAbbr(r.accepted_at), attempt: r.attempt });
  }

  function answers(a, c) {
    if (!c.attempt || c.attempt.receipt_id !== c.receipt.id) return "";
    var rows = items(c.quiz).map(function (id, i) {
      var ans = c.attempt.answers.filter(function (x) { return x.item_id === id && x.acknowledged_at; })[0];
      return { label: "Question " + (i + 1), value: ans ? ans.value + " · saved " + a.sel.fmtTime(ans.acknowledged_at) : "No answer" };
    });
    return a.K.section({ title: "Submitted answers", body: a.K.kv(rows), level: 2 });
  }

  function review(a, c) {
    if (a.state === "offline") {
      return a.K.section({ title: "Released review", level: 3, body: P.p("The released review could not be loaded.") +
        a.K.button({ label: "Retry", note: "Preview only: nothing is loaded in this prototype" }) });
    }
    var res = a.sel.resultFor(a.view, a.who.personId, c.item.id, a.who);
    if (!res || res.status === null) {
      var rule = Object.prototype.hasOwnProperty.call(RELEASE, c.quiz.release_rule) ? RELEASE[c.quiz.release_rule] : "";
      return a.K.section({ title: "Released review", level: 3, body: (rule ? P.p(rule) : "") + P.p("Nothing about marking is shown before release.") });
    }
    var releases = a.sel.releasesFor(a.view, c.item.id, a.who);
    var sub = a.sel.submissionFor(a.view, a.who.personId, c.item.id);
    var matching = releases.filter(function (rel) { return rel.entries.some(function (entry) {
      return entry.person_id === a.who.personId && (entry.receipt_id === c.receipt.id || (!entry.receipt_id && sub && sub.receipt_id === c.receipt.id));
    }); });
    var last = matching.length ? matching[matching.length - 1] : null;
    if (!last) return a.K.section({ title: "Released review", level: 3, body: P.p("No released feedback for this attempt") });
    var snapshot = last.entries.filter(function (entry) { return entry.person_id === a.who.personId && (entry.receipt_id === c.receipt.id || (!entry.receipt_id && sub && sub.receipt_id === c.receipt.id)); })[0];
    var status = snapshot.status || res.status;
    var score = snapshot.score === undefined && !snapshot.receipt_id ? res.score : snapshot.score;
    var comment = snapshot.comment === undefined && !snapshot.receipt_id ? res.comment : snapshot.comment;
    var outcome = status === "excused" || status === "missing"
      ? a.K.status(status, a.ctx, { released: true, own: true }) : "";
    var rows = [];
    if (score !== null && score !== undefined) rows.push({ label: "Score", value: P.score(score, res.max) });
    if (comment) rows.push({ label: "Comment", value: comment });
    if (last.released_at) rows.push({ label: "Released on", value: P.when(a, last.released_at) });
    if (last) rows.push({ label: "Release version", value: String(last.version) });
    return a.K.section({ title: "Released review", level: 3, body: outcome + (rows.length ? a.K.kv(rows) : "") + P.p("Answer keys are not part of this review.") });
  }

  function details(a, c) {
    var rows = [];
    if (c.receipt.assessment_version !== undefined) rows.push({ label: "Question version", value: String(c.receipt.assessment_version) });
    if (c.av && c.attempt.receipt_id === c.receipt.id) rows.push({ label: "Answered", value: String(c.av.acknowledged) + " of " + c.quiz.items.length });
    var rules = rulesLink(a, c);
    return P.stack(a, [
      P.status(a, P.ownSubmission(a, c.item.id), true), rows.length ? a.K.kv(rows) : "", review(a, c),
      a.K.button({ label: "Download receipt", note: "Preview only: nothing is downloaded in this prototype" }),
      rules ? "" : P.p("The rules page is drawn for Quiz 3 only in this prototype."),
      P.links(a, [{ label: "View course grades", go: "W24" }, rules, { label: "Coursework", go: "W18" }]),
    ]);
  }

  function top(a, c) {
    if (a.state === "success") {
      return a.K.notice({ tone: "success", title: "Your quiz is handed in", body: P.p("Receipt " + c.receipt.id + " was issued at " + P.when(a, c.receipt.accepted_at) + ".") });
    }
    return a.state === "offline" ? P.stack(a, [P.offlineNotice(a), a.K.flag("lastKnown")]) : "";
  }

  function present(a, c) {
    var main = P.stack(a, [top(a, c), slip(a, c), P.p("This receipt does not change."), answers(a, c)]);
    return a.K.rail(a.ctx, { main: main, rail: details(a, c), railLabel: "Details" });
  }

  // ---------- Absent receipt ----------
  function absent(a, c) {
    var attemptGo = c.av && c.av.active ? P.recordGo("W26", "attempt", c.attempt.id) : null;
    var next = attemptGo ? { label: "Go to the attempt", go: attemptGo } : rulesLink(a, c) && { label: "Quiz rules", go: rulesLink(a, c).go };
    return P.stack(a, [
      a.K.empty({ title: "No confirmed receipt", body: P.p("Nothing has been handed in for this quiz yet.") }),
      P.status(a, P.ownSubmission(a, c.item.id), true), P.links(a, [next]), P.offHome(a, "The receipt is issued later in the prototype"),
    ]);
  }

  function unavailable(a) {
    return P.stack(a, [
      a.K.empty({ title: "This receipt is not available", body: P.p("It has not been issued to you at this point in the prototype.") }),
      P.links(a, [{ label: "Coursework", go: "W18" }]),
    ]);
  }

  function body(a, c) {
    if (a.state === "permissionUnavailable") return P.permissionNotice(a, "This receipt belongs to another person");
    if (a.state === "loading") return P.loading(a, "the receipt");
    if (!c.item) return unavailable(a);
    return c.receipt ? present(a, c) : absent(a, c);
  }

  WB.definePage("W27", {
    states: STATES,
    na: P.na(STATES, {
      firstUseEmpty: "A receipt page is about one receipt; without it the page says no receipt exists",
      saveFailed: "Nothing is saved here; a failed review load is drawn under offline",
    }),
    variants: { quiz2: WB.manifest.anchors.W27.variants.quiz2.label },
    render: function (a) {
      var c = context(a);
      var anchor = a.sel.anchorFor("W27", P.recordVariant(a));
      var owned = c.receipt && c.item ? a.sel.receiptsFor(a.view, c.item.id, a.who).filter(function (r) { return r.id === c.receipt.id; })[0] : null;
      var gate = P.publicationGate(a, c.item, owned);
      if (gate) return gate;
      return P.shell(a, { title: c.item ? "Quiz receipt: " + c.item.title : "Quiz receipt", body: body(a, c) }, { section: "coursework" });
    },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
