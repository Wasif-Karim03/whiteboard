/* Whiteboard Phase 3 spine: shared page helpers (WB.P), loaded after pages/register.js and pages/placeholder.js
   and before the page files (tools/load_site.mjs PAGE_PRE). Pure: every helper takes the frozen render
   argument `a` first, composes only a.K and a.sel and returns strings or plain values. Rule R-truth, the
   presentation variants and the TA access branches are recorded in pages/SPINE.md. Chosen by Claude under
   owner delegation. All data is fictional. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var esc = WB.esc;

  // Presentation variants change what is drawn, never which record: confirm, reviewed and acknowledged map to
  // the default record; motion-reviewed maps to the motion record (R03, R11, R14).
  var PRESENTATION = { confirm: null, reviewed: null, acknowledged: null, "motion-reviewed": "motion" };
  var LATE_RULES = { accepted_until_close_marked_late: "Late work is accepted until the close time and is marked late." };
  var FILE_RULES = { "pdf-png-jpg-up-to-10-files": "PDF, PNG or JPG files, up to 10 files." };

  // Default N/A reasons; a page passes its own where the reason is page-specific.
  var NA = {
    loading: "This view reads one local record and has no region that waits for data",
    firstUseEmpty: "This page is about one record; when it is absent the page says so instead",
    filteredEmpty: "This page has no filters",
    invalid: "Nothing on this page takes typed input",
    saving: "Nothing is saved from this page",
    saveFailed: "Nothing is saved from this page",
    conflict: "Nothing on this page can be edited by two people at once",
    offline: "This page sends nothing, so being offline changes nothing here",
    permissionUnavailable: "The role switch already blocks roles this page is not for",
    sessionExpired: "Session expiry is drawn once on the shared sign-in pages, not on each page",
    notYetAvailable: "Opening dates are drawn on the assignment page",
    archived: "The spine course is current; archived terms are drawn on the course list",
    success: "This page has no committing action of its own",
    partialSuccess: "This page has no bulk action",
    deviceDenied: "This page asks for no device permission",
    destructive: "This page deletes nothing",
  };
  function na(drawn, own) {
    var out = {};
    WB.manifest.states.forEach(function (s) {
      if (drawn.indexOf(s.id) >= 0) return;
      out[s.id] = own && has(own, s.id) ? own[s.id] : NA[s.id];
    });
    return out;
  }

  function has(obj, key) { return Boolean(obj) && typeof key === "string" && Object.prototype.hasOwnProperty.call(obj, key); }
  function merge(base, over) {
    var out = {};
    Object.keys(base).forEach(function (k) { out[k] = base[k]; });
    Object.keys(over || {}).forEach(function (k) { if (over[k] !== undefined) out[k] = over[k]; });
    return out;
  }

  function id(a, suffix) { return a.ns + "-" + suffix; }
  function recordVariant(a) { return has(PRESENTATION, a.variant) ? PRESENTATION[a.variant] : a.variant; }

  function shell(a, opts, where) {
    var course = a.sel.courseShell(a.view, a.who, where);
    var out = merge({ navActive: "courses" }, opts);
    if (course) out.course = course;
    return out;
  }

  function assessmentId(a) {
    if (a.selection && a.selection.assessmentId) return a.selection.assessmentId;
    if (a.selection && a.who.courseId !== a.sel.viewerFor(a.view, a.role).courseId) {
      var first = a.sel.courseAssessments(a.view, a.who)[0];
      return first ? first.id : null;
    }
    return a.sel.anchorFor("W19", recordVariant(a) === "motion" ? "motion" : null).record.id;
  }
  // ":motion" when the record is the group work, so links keep their record identity (R07).
  function suffix(a) { return recordVariant(a) === "motion" ? ":motion" : ""; }
  // The student's draft for this record, counted only when it is the W20 anchor draft (rule R-truth).
  function draftOf(a) {
    if (a.role !== "student") return null;
    var draft = a.sel.draftFor(a.view, assessmentId(a), a.who);
    var anchor = a.sel.anchorFor("W20", recordVariant(a));
    return draft && anchor && draft.id === anchor.record.id ? draft : null;
  }
  function receiptOf(a) {
    if (a.role !== "student") return null;
    var list = a.sel.receiptsFor(a.view, assessmentId(a), a.who);
    if (a.selection && a.selection.receiptId) return list.filter(function (r) { return r.id === a.selection.receiptId; })[0] || null;
    return list.slice().sort(function (x, y) { return y.attempt - x.attempt; })[0] || null;
  }
  function learnerId(a) { if (a.selection && a.selection.learnerId) return a.selection.learnerId; return a.sel.viewerFor(a.view, "student").personId; }
  function assessments(a) {
    var courseId = a.who.courseId;
    return a.view.data.coursework.assessments.filter(function (x) { return courseId && x.course_id === courseId && x.published; });
  }
  // Current unpublished content is unavailable, but an already-issued own receipt stays readable.
  function publicationGate(a, item, receipt) {
    if (a.role !== "student" || !item || item.published) return null;
    var course = a.sel.course(a.view, a.who.courseId);
    var body = permissionNotice(a, "This assessment is not published");
    if (receipt && course && a.state !== "permissionUnavailable") {
      body = a.K.receipt({ ref: receipt.id, item: "Assessment no longer published", course: course.code,
        acceptedAt: a.sel.fmtDateTime(receipt.accepted_at), timeZone: a.sel.zoneAbbr(receipt.accepted_at),
        attempt: receipt.attempt, late: Boolean(receipt.late), files: receipt.files.length ? receipt.files.map(function (f) { return f.name; }) : undefined }) +
        receiptDetails(a, receipt) + p("This receipt does not change. Current assessment details are not published.") + links(a, [{ label: "Coursework", go: "W18" }]);
    }
    return shell(a, { title: receipt ? "Submission receipt" : "Assessment unavailable", body: body }, { section: "coursework" });
  }
  function receiptDetails(a, receipt) {
    var rows = receipt.files.map(function (f) { return { label: f.name, value: fileMeta(a, f) }; }).concat(tagRows(receipt.page_tags || []));
    if (receipt.assessment_version !== undefined) rows.push({ label: "Assessment version", value: String(receipt.assessment_version) });
    if (receipt.actor_id) rows.push({ label: "Handed in by", value: personName(a, receipt.actor_id) });
    if (receipt.captured_members) {
      rows.push({ label: "Handed in for", value: receipt.captured_members.map(function (id) { return personName(a, id); }).join(", ") });
      rows.push({ label: "Group membership version", value: String(receipt.membership_version) });
    }
    return rows.length ? a.K.kv(rows) : "";
  }
  function receiptById(a, receiptId) {
    return a.sel.receiptById(a.view, receiptId, a.who);
  }

  // The go token of the page view whose anchor is this record, or null (draw plain text).
  function recordGo(pageId, type, recordId) {
    return WB.sel.recordGo(pageId, type, recordId);
  }

  function status(a, submission, own) {
    if (!submission) return "";
    var k = WB.manifest.status.keyFor(submission, a.role, { own: own });
    if (!k) return "";
    return a.K.status(k.key, a.ctx, { released: k.released, own: own, late: k.late });
  }
  function ownSubmission(a, itemId) {
    return a.sel.submissionFor(a.view, a.who.personId, itemId) || { state: "notStarted", released: false };
  }
  function score(value, max) {
    return value === null || value === undefined ? "" : value + " / " + max;
  }
  function when(a, iso) { return a.sel.fmtDateTime(iso) + " " + a.sel.zoneAbbr(iso); }

  // R04: closed at or after close, or at or after due when there is no close and late work is not accepted.
  function lateAccepted(item) { return Boolean(item.late_rule) && /^accepted/.test(item.late_rule); }
  function closeTime(item) {
    if (item.close) return item.close;
    return item.due && !lateAccepted(item) ? item.due : null;
  }
  function closed(a, item) {
    var at = closeTime(item);
    return Boolean(at) && !a.sel.isBefore(a.view.clock, at);
  }
  function closedButton(a, item, suffix) {
    return a.K.button({ label: "Submit attempt", disabled: true, reason: "Closed on " + when(a, closeTime(item)), id: id(a, suffix) });
  }

  // R12: access ended is course-level; unallocated is an active TA with no task for this assessment.
  function taEnded(a) {
    return a.role === "ta" && !a.sel.taAccessActive(a.view, a.who.personId, a.who.courseId);
  }
  function gradingGo(a, itemId) {
    var item = a.sel.assessment(a.view, itemId);
    var role = item ? a.sel.verifiedRole(a.view, a.who, item.course_id) : null;
    if (role !== "instructor" && role !== "ta") return null;
    if (role === "ta" && (!a.sel.taTaskAccess(a.view, itemId, a.who).active || !a.sel.taScope(a.view, itemId, a.who))) return null;
    var queue = recordGo("W48", "assessment", itemId);
    if (queue) return queue;
    return a.sel.receiptsFor(a.view, itemId, a.who).map(function (receipt) { return recordGo("W49", "receipt", receipt.id); }).filter(Boolean)[0] || null;
  }
  function taTaskEnded(a, itemId) {
    if (a.role !== "ta") return false;
    var access = a.sel.taTaskAccess(a.view, itemId, a.who);
    return Boolean(access.task) && !access.active;
  }
  function taTaskEndedNotice(a, itemId) {
    var task = a.sel.taTaskAccess(a.view, itemId, a.who).task;
    var item = a.sel.assessment(a.view, itemId);
    return a.K.notice({ tone: "info", title: "Your grading access for this assignment has ended", body: (item ? p(item.title) : "") + (task ? p("Access ended " + when(a, task.access_end)) : ""), actions: [{ label: "View my grading tasks", go: "W05" }] });
  }
  function taUnallocated(a, itemId) {
    return a.role === "ta" && !taEnded(a) && !a.sel.taTaskAccess(a.view, itemId, a.who).task;
  }
  function taskTitle(a, itemId) {
    var task = a.sel.gradingTaskFor(a.view, a.who.personId, itemId) || a.sel.gradingTaskFor(a.view, a.who.personId);
    var item = task ? a.sel.assessment(a.view, task.assessment_id) : null;
    return item ? item.title : "";
  }
  function taEndedNotice(a, itemId) {
    var end = a.sel.accessEnd(a.view, a.who.personId, a.who.courseId);
    var title = taskTitle(a, itemId);
    var body = (end ? "<p>Access ended " + esc(when(a, end)) + ".</p>" : "") + (title ? "<p>Grading task: " + esc(title) + ".</p>" : "");
    return a.K.notice({ tone: "info", title: "Your grading access for this course has ended", body: body, actions: [{ label: "Go to Home", go: "W05" }] });
  }
  function unallocatedNotice(a) {
    return a.K.notice({ tone: "info", title: "This assignment is not in your grading tasks", body: "<p>Ask the instructor if you should grade it.</p>" });
  }
  function permissionNotice(a, text) {
    return a.K.notice({
      tone: "info", title: text || "This is not available for your course role",
      body: "<p>Nothing from this page is shown outside your course role.</p>", actions: [{ label: "Go to Home", go: "W05" }],
    });
  }
  function loading(a, label) { return '<p role="status">Loading ' + esc(label) + "…</p>"; }
  function offlineNotice(a) {
    return a.K.notice({
      tone: "warning", title: "You're offline. Showing the last copy saved on this device",
      body: "<p>Sending work and releasing feedback are blocked until you reconnect.</p>",
    });
  }
  // R-truth: the record is not there at this clock. Link to the page at its home clock when that differs.
  function offHome(a, text) {
    var anchor = a.sel.anchorFor(a.page.id, recordVariant(a));
    var go = anchor && anchor.home !== a.scenario ? a.page.id + (a.variant ? ":" + a.variant : "") + "~" + anchor.home : null;
    return a.K.notice({
      tone: "info", title: text, body: "<p>This view follows the prototype clock.</p>",
      actions: go ? [{ label: "Open it at the matching prototype clock", go: go }] : [],
    });
  }
  function handoff(a, opts) { return a.tier === "full" ? "" : a.K.handoff(a.ctx, opts); }
  // A data-free handoff for authority, permission and expiry branches on a non-full tier (R05).
  function bareHandoff(a) { return handoff(a, { title: "Open on a larger screen" }); }

  // Staff pages (W48, W49, W51, W53): authority branches run first and show no learner data (R05, R12). An
  // active TA on permissionUnavailable gets the permission notice, not the expiry notice, so no end is invented.
  function staffGate(a, itemId) {
    var deny = null;
    if (taEnded(a)) deny = taEndedNotice(a, itemId);
    else if (a.state === "permissionUnavailable") deny = permissionNotice(a, a.role === "instructor" ? "You are not teaching this course" : null);
    else if (itemId && taTaskEnded(a, itemId)) deny = taTaskEndedNotice(a, itemId);
    else if (itemId && taUnallocated(a, itemId)) deny = unallocatedNotice(a);
    return deny ? stack(a, [bareHandoff(a), deny]) : null;
  }

  // ---------- Small render pieces ----------
  function p(text) { return "<p>" + esc(text) + "</p>"; }
  function links(a, list) {
    var items = list.filter(Boolean).map(function (l) { return "<p>" + a.K.link(l) + "</p>"; });
    return items.length ? a.K.stack(a.ctx, { items: items, gap: "sm" }) : "";
  }
  function stack(a, items) { return a.K.stack(a.ctx, { items: items.filter(Boolean) }); }
  function lateRuleText(item) { return has(LATE_RULES, item.late_rule) ? LATE_RULES[item.late_rule] : ""; }
  function fileRuleText(rule) { return has(FILE_RULES, rule) ? FILE_RULES[rule] : ""; }
  function pageCount(files) { return files.reduce(function (n, f) { return n + (f.pages || 0); }, 0); }
  function fileMeta(a, f) {
    return [a.sel.fmtBytes(f.bytes), f.pages ? f.pages + (f.pages === 1 ? " page" : " pages") : ""].filter(Boolean).join(" · ");
  }
  function questionsText(list) { return (list.length === 1 ? "Question " : "Questions ") + list.join(", "); }
  // Page tags as kv rows; keep limits them to the listed question ids (R01) and drops pages left with none.
  function tagRows(tags, keep) {
    return (tags || []).map(function (t) {
      var qs = keep ? t.questions.filter(function (q) { return keep.indexOf(q) >= 0; }) : t.questions;
      return qs.length ? { label: "Page " + t.page, value: questionsText(qs) } : null;
    }).filter(Boolean);
  }
  var PROCESSING = { ready: "Ready", processing: "Processing", failed: "Could not be read" };
  function processingText(f) { return has(PROCESSING, f.processing) ? PROCESSING[f.processing] : ""; }
  // The draft's file tray; removable adds a preview-only Remove button per row (W20). Read-only otherwise (W21).
  function tray(a, draft, removable) {
    return a.K.list({
      label: "Files in this attempt",
      items: draft.files.map(function (f) {
        var meta = [fileMeta(a, f), processingText(f)].filter(Boolean).join(" · ");
        var remove = removable ? a.K.button({ label: "Remove", kind: "quiet", note: "Preview only: files are not removed in this prototype" }) : undefined;
        return { title: f.name, meta: meta, trailing: remove };
      }),
    });
  }
  // R-truth for W20 and W21: no anchor draft at this clock. Status, a receipt link when one exists, off-home link.
  function noDraft(a) {
    var r = receiptOf(a);
    var go = r ? recordGo("W22", "receipt", r.id) : null;
    return stack(a, [
      status(a, ownSubmission(a, assessmentId(a)), true),
      go ? links(a, [{ label: "View receipt", go: go }]) : "",
      offHome(a, r ? "This work is already handed in" : "There is no draft of this work at this point"),
    ]);
  }
  function personName(a, personId) {
    var person = personId ? a.sel.person(a.view, personId) : null;
    return person ? person.name : "";
  }

  Object.defineProperty(WB, "P", {
    value: Object.freeze({
      na: na, id: id, recordVariant: recordVariant, shell: shell, assessmentId: assessmentId,
      suffix: suffix, draftOf: draftOf, receiptOf: receiptOf, learnerId: learnerId, assessments: assessments, publicationGate: publicationGate, receiptById: receiptById, recordGo: recordGo, status: status,
      ownSubmission: ownSubmission, score: score, when: when, closed: closed,
      closeTime: closeTime, closedButton: closedButton, taEnded: taEnded, staffGate: staffGate, taUnallocated: taUnallocated,
      gradingGo: gradingGo, taTaskEnded: taTaskEnded, taTaskEndedNotice: taTaskEndedNotice,
      taEndedNotice: taEndedNotice, unallocatedNotice: unallocatedNotice, permissionNotice: permissionNotice,
      loading: loading, offlineNotice: offlineNotice, offHome: offHome, handoff: handoff, bareHandoff: bareHandoff,
      tray: tray, noDraft: noDraft, p: p, links: links, stack: stack, lateRuleText: lateRuleText, fileRuleText: fileRuleText, pageCount: pageCount,
      fileMeta: fileMeta, questionsText: questionsText, tagRows: tagRows, personName: personName,
    }),
    enumerable: true, writable: false, configurable: false,
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
