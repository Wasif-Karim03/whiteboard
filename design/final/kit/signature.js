/* Whiteboard final kit: signature components with contracts the board lacked (deep dive, Component gaps):
   receipt slip, work trail, context line, save status (C12), honest figure, timer and course banner/card. */
(function (root) {
  "use strict";
  var WB = (root.WB = root.WB || {});
  var K = (WB.K = WB.K || {});
  var esc = WB.esc;

  function kvRow(label, valueHtml) {
    return '<div class="wb-kv__row"><dt>' + esc(label) + "</dt><dd>" + valueHtml + "</dd></div>";
  }

  // Immutable receipt facts as plain, selectable text. No spinner and no pending look (UX rule 2).
  K.receipt = function (o) {
    WB.need("receipt", o, ["ref", "item", "course", "acceptedAt", "timeZone"]);
    var files = "";
    if (o.files !== undefined) {
      if (!Array.isArray(o.files) || !o.files.length) WB.fail("receipt", "files must be a non-empty array when given");
      files = kvRow("Files", '<ul class="wb-receipt__files">' + o.files.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul>");
    }
    return (
      '<section class="wb-receipt" aria-label="Receipt">' +
      '<p class="wb-receipt__head">' + K.icon("check-circle") + '<span class="wb-receipt__title">' + esc(WB.STATUS.received.label) + "</span>" +
      (o.late ? '<span class="wb-status__late">' + K.icon(WB.STATUS.late.icon) + esc(WB.STATUS.late.label) + "</span>" : "") + "</p>" +
      '<dl class="wb-kv wb-receipt__fields">' +
      kvRow("Receipt", '<span class="wb-receipt__ref">' + esc(o.ref) + "</span>") +
      kvRow("Item", esc(o.item)) +
      kvRow("Course", esc(o.course)) +
      kvRow("Accepted", esc(o.acceptedAt) + ' <span class="wb-receipt__tz">' + esc(o.timeZone) + "</span>") +
      (o.attempt !== undefined ? kvRow("Attempt", esc(o.attempt)) : "") +
      files +
      "</dl></section>"
    );
  };

  var TRAIL_STATES = { done: ["check-circle", "Done"], current: ["clock", "Current step"], todo: ["doc", "Not done yet"] };

  K.trail = function (o) {
    if (!o || !Array.isArray(o.steps) || !o.steps.length) WB.fail("trail", "steps must be a non-empty array");
    var steps = o.steps.map(function (s) {
      WB.need("trail", s, ["label", "state"]);
      var st = TRAIL_STATES[s.state];
      if (!st) WB.fail("trail", "unknown step state '" + s.state + "'");
      return (
        '<li class="wb-trail__step wb-trail__step--' + s.state + '"' + (s.state === "current" ? ' aria-current="step"' : "") + ">" + K.icon(st[0]) +
        '<span class="wb-trail__label">' + esc(s.label) + '<span class="wb-sr"> (' + st[1] + ")</span></span>" +
        (s.meta ? '<span class="wb-trail__meta">' + esc(s.meta) + "</span>" : "") + "</li>"
      );
    });
    return '<ol class="wb-trail" aria-label="' + esc(o.label || "Work trail") + '">' + steps.join("") + "</ol>";
  };

  WB.crumbs = function (fn, crumbs) {
    if (!crumbs || !crumbs.length) return "";
    var items = crumbs.map(function (c) {
      WB.need(fn, c, ["label"]);
      if (!c.go && !c.href) return '<li aria-current="page">' + esc(c.label) + "</li>";
      var a = WB.navAttrs(fn, c);
      return "<li><a" + WB.attrs({ class: "wb-link", href: a.href, "data-go": a["data-go"] }) + ">" + esc(c.label) + "</a></li>";
    });
    return '<nav class="wb-crumbs" aria-label="Breadcrumb"><ol>' + items.join("") + "</ol></nav>";
  };

  // Where am I and as whom: institution, course, term and role, with optional breadcrumbs.
  K.contextLine = function (o) {
    WB.need("contextLine", o, ["institution", "role"]);
    WB.oneOf("contextLine", "role", o.role, WB.ROLES);
    var parts = [o.institution, o.course, o.term].filter(function (x) { return x !== undefined && x !== null && x !== ""; });
    return (
      '<div class="wb-context"><p class="wb-context__line">' +
      parts.map(function (p) { return '<span class="wb-context__part">' + esc(p) + "</span>"; }).join('<span class="wb-context__sep" aria-hidden="true"> · </span>') +
      '<span class="wb-context__role">' + K.icon("person") + "Viewing as " + esc(WB.ROLE_LABELS[o.role]) + "</span></p>" +
      WB.crumbs("contextLine", o.crumbs) + "</div>"
    );
  };

  // C12 save-status wording. Never doubles as a work status (BD39).
  WB.SAVE_STATES = Object.freeze({
    dirty: Object.freeze({ label: "Unsaved changes", icon: "doc", tone: "neutral" }),
    saving: Object.freeze({ label: "Saving…", icon: "hourglass", tone: "neutral" }),
    saved: Object.freeze({ label: "Saved", icon: "check", tone: "success" }),
    savedLocal: Object.freeze({ label: "Saved locally", icon: "offline", tone: "warning" }),
    failed: Object.freeze({ label: "Save failed", icon: "alert", tone: "error" }),
    conflict: Object.freeze({ label: "Conflict", icon: "alert", tone: "warning" }),
  });

  K.saveStatus = function (state, opts) {
    var s = WB.SAVE_STATES[state];
    if (!s) WB.fail("saveStatus", "unknown save state '" + state + "'");
    var o = opts || {};
    var time = o.time && (state === "saved" || state === "savedLocal") ? " " + esc(o.time) : "";
    return '<p class="wb-save wb-save--' + s.tone + '" role="status">' + K.icon(s.icon) + '<span class="wb-save__label">' + esc(s.label) + time + "</span></p>";
  };

  // An honest number always shows what it is computed from.
  K.figure = function (o) {
    WB.need("figure", o, ["label", "value", "basis"]);
    return '<div class="wb-figure"><span class="wb-figure__label">' + esc(o.label) + '</span><span class="wb-figure__value">' + esc(o.value) + '</span><span class="wb-figure__basis">' + esc(o.basis) + "</span></div>";
  };

  // Static text: no animation and no live region (UX rule 6).
  K.timer = function (o) {
    WB.need("timer", o, ["label", "remaining", "endsAt"]);
    return '<p class="wb-timer">' + K.icon("clock") + '<span class="wb-timer__label">' + esc(o.label) + '</span><span class="wb-timer__value">' + esc(o.remaining) + '</span><span class="wb-timer__ends">Ends at ' + esc(o.endsAt) + "</span></p>";
  };

  K.courseBanner = function (ctx, o) {
    WB.checkCtx("courseBanner", ctx);
    WB.need("courseBanner", o, ["key", "code", "title"]);
    WB.checkCourse("courseBanner", o.key);
    var meta = [o.who, o.term].filter(Boolean).map(function (m) { return '<span class="wb-course-banner__meta">' + esc(m) + "</span>"; }).join("");
    return (
      '<div class="wb-course-banner wb-course--' + o.key + " wb-course-banner--" + ctx.sizeClass + '">' + WB.courseArt(o.key) +
      '<div class="wb-course-banner__text"><span class="wb-course-banner__code">' + esc(o.code) + '</span><span class="wb-course-banner__title">' + esc(o.title) + "</span>" + meta + "</div></div>"
    );
  };

  K.courseCard = function (ctx, o) {
    WB.checkCtx("courseCard", ctx);
    WB.need("courseCard", o, ["key", "code", "title"]);
    WB.checkCourse("courseCard", o.key);
    var title = o.go ? '<a class="wb-card__link" href="' + WB.goHref(o.go, "courseCard") + '" data-go="' + esc(o.go) + '">' + esc(o.title) + "</a>" : esc(o.title);
    return (
      '<article class="wb-course-card wb-course--' + o.key + '"><div class="wb-course-card__art">' + WB.courseArt(o.key) + '<span class="wb-course-card__code">' + esc(o.code) + "</span></div>" +
      '<h2 class="wb-course-card__title">' + title + "</h2>" + (o.meta ? '<p class="wb-course-card__meta">' + esc(o.meta) + "</p>" : "") + "</article>"
    );
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
