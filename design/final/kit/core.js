/* Whiteboard final kit: core helpers, render context and the shared status vocabulary (BD39).
   Plain script, no dependencies; runs in a browser or a bare node:vm context. Renderers return HTML
   strings, never mutate their arguments and give identical output for identical input. */
(function (root) {
  "use strict";
  var WB = (root.WB = root.WB || {});
  var K = (WB.K = WB.K || {});
  WB.shells = WB.shells || {};

  var ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  WB.esc = function (x) {
    if (x === null || x === undefined) return "";
    return String(x).replace(/[&<>"']/g, function (c) { return ESC[c]; });
  };

  WB.fail = function (fn, what) {
    throw new Error("WB.K." + fn + ": " + what);
  };

  // Escaped attribute string. Skips null, undefined and false; true renders a bare boolean attribute.
  WB.attrs = function (obj) {
    var out = "";
    Object.keys(obj || {}).forEach(function (k) {
      var v = obj[k];
      if (v === null || v === undefined || v === false) return;
      out += v === true ? " " + k : " " + k + '="' + WB.esc(v) + '"';
    });
    return out;
  };

  // Throws unless every named field is present and not an empty string.
  WB.need = function (fn, o, keys) {
    if (!o || typeof o !== "object") WB.fail(fn, "options object is required");
    keys.forEach(function (k) {
      if (o[k] === undefined || o[k] === null || o[k] === "") WB.fail(fn, "missing required field '" + k + "'");
    });
  };

  WB.oneOf = function (fn, what, value, list) {
    if (list.indexOf(value) < 0) WB.fail(fn, "unknown " + what + " '" + value + "'");
    return value;
  };

  // Allowed: #fragment, a scheme-less relative path, https: and mailto:. Whitespace and control characters
  // are stripped and the scheme compared case-insensitively before matching; anything else throws.
  WB.safeHref = function (href, fn) {
    var name = fn || "href";
    if (typeof href !== "string" || href === "") WB.fail(name, "href must be a non-empty string");
    var clean = href.replace(/[\s\u0000-\u001f\u007f]/g, "").toLowerCase();
    var scheme = /^([a-z][a-z0-9+.-]*):/.exec(clean);
    if (scheme && scheme[1] !== "https" && scheme[1] !== "mailto") WB.fail(name, "scheme '" + scheme[1] + ":' is not allowed");
    if (!scheme && clean.indexOf("//") === 0) WB.fail(name, "protocol-relative href is not allowed");
    if (clean === "") WB.fail(name, "href is empty after cleaning");
    return href;
  };

  // A go target is "<pageId>[:<variant-or-state>][~<scenario>]"; its href is the viewer route "#/<go>".
  WB.goHref = function (go, fn) {
    if (typeof go !== "string" || !/^[A-Za-z0-9_-]+(:[A-Za-z0-9_.-]+)?(~[a-z0-9_]+)?(\?(tc|ta|tl|tr)=[A-Za-z0-9_-]*(&(tc|ta|tl|tr)=[A-Za-z0-9_-]*)*)?$/.test(go)) WB.fail(fn || "go", "invalid go target '" + go + "'");
    return "#/" + go;
  };

  // Ids are always caller-supplied (never generated).
  WB.checkId = function (fn, id) {
    if (typeof id !== "string" || !/^[A-Za-z][\w-]*$/.test(id)) WB.fail(fn, "a caller-supplied id is required (letters, digits, - and _)");
    return id;
  };

  function freezeAll(list) {
    list.forEach(function (x) { Object.freeze(x); });
    return Object.freeze(list);
  }

  WB.PLATFORMS = Object.freeze(["web", "ipad", "iphone"]);
  WB.ROLES = Object.freeze(["student", "instructor", "ta", "guest"]);
  WB.STAFF = Object.freeze(["instructor", "ta"]);
  WB.ROLE_LABELS = Object.freeze({ student: "Student", instructor: "Instructor", ta: "TA", guest: "Guest" });
  WB.TIERS = Object.freeze(["full", "review", "handoff"]);
  WB.TONES = Object.freeze(["accent", "success", "warning", "error", "info", "neutral"]);
  WB.ACTS = Object.freeze(["open-dialog", "close-dialog", "toggle", "sort", "back"]);

  // Render context: every adaptive and shell function takes this as its first argument.
  WB.ctx = function (o) {
    WB.need("ctx", o, ["platform", "role"]);
    WB.oneOf("ctx", "platform", o.platform, WB.PLATFORMS);
    WB.oneOf("ctx", "role", o.role, WB.ROLES);
    var tier = o.tier === undefined ? "full" : WB.oneOf("ctx", "tier", o.tier, WB.TIERS);
    var orientation = null;
    var sizeClass = "compact";
    if (o.platform === "web") {
      if (o.width !== undefined) WB.oneOf("ctx", "width", o.width, ["regular", "narrow"]);
      sizeClass = o.width === "narrow" ? "compact" : "regular";
    } else if (o.platform === "ipad") {
      orientation = o.orientation === undefined ? "landscape" : WB.oneOf("ctx", "orientation", o.orientation, ["landscape", "portrait"]);
      sizeClass = orientation === "portrait" ? "compact" : "regular";
    } else {
      orientation = "portrait";
    }
    return Object.freeze({ platform: o.platform, sizeClass: sizeClass, orientation: orientation, role: o.role, tier: tier });
  };

  WB.checkCtx = function (fn, ctx) {
    if (!ctx || typeof ctx !== "object" || !Object.isFrozen(ctx)) WB.fail(fn, "first argument must be a ctx from WB.ctx()");
    WB.oneOf(fn, "platform", ctx.platform, WB.PLATFORMS);
    WB.oneOf(fn, "role", ctx.role, WB.ROLES);
    WB.oneOf(fn, "size class", ctx.sizeClass, ["regular", "compact"]);
    WB.oneOf(fn, "tier", ctx.tier, WB.TIERS);
    return ctx;
  };

  // The five canonical platform and size combinations (plan §2). Pass one to WB.ctx with a role.
  WB.CONTEXTS = freezeAll([
    { name: "web-regular", platform: "web", width: "regular" },
    { name: "web-compact", platform: "web", width: "narrow" },
    { name: "ipad-regular", platform: "ipad", orientation: "landscape" },
    { name: "ipad-compact", platform: "ipad", orientation: "portrait" },
    { name: "iphone-compact", platform: "iphone" },
  ]);

  // Global navigation (BD1): the same five items on every platform.
  WB.NAV_GLOBAL = freezeAll([
    { id: "today", label: "Today", icon: "home" },
    { id: "courses", label: "Courses", icon: "book" },
    { id: "calendar", label: "Calendar", icon: "calendar" },
    { id: "activity", label: "Activity", icon: "bell" },
    { id: "tools", label: "Tools", icon: "tool" },
  ]);
  // Utility navigation (A-R9): reachable in app mode on every context.
  WB.NAV_UTILITY = freezeAll([
    { id: "search", label: "Search", icon: "search" },
    { id: "help", label: "Help", icon: "help" },
    { id: "account", label: "Account", icon: "person" },
  ]);

  var STUDENT = ["student"];
  var STAFF = ["instructor", "ta"];
  var ALL = ["student", "instructor", "ta"];
  function st(label, tone, icon, visibleTo, extra) {
    var e = { label: label, tone: tone, icon: icon, visibleTo: Object.freeze(visibleTo.slice()) };
    Object.keys(extra || {}).forEach(function (k) { e[k] = extra[k]; });
    return Object.freeze(e);
  }
  // Work statuses, labels exactly as BD39 (design/final/decisions.md). The kit owns these labels;
  // 2b's manifest maps record states to these keys and must not redefine them.
  WB.STATUS = Object.freeze({
    notStarted: st("Not started", "neutral", "doc", STUDENT),
    draft: st("Draft", "info", "doc", STUDENT, { ownOnly: true }),
    queued: st("Queued", "warning", "hourglass", STUDENT, { ownOnly: true }),
    received: st("Received", "success", "check-circle", ALL),
    receivedNotReleased: st("Received · Feedback not released yet", "success", "check-circle", STUDENT),
    late: st("Late", "warning", "clock", ALL, { modifier: true }),
    held: st("Held", "neutral", "eye-off", STAFF),
    graded: st("Graded", "neutral", "check", STAFF),
    released: st("Released", "success", "check", ALL),
    feedbackUpdated: st("Feedback updated", "info", "retry", STUDENT),
    missing: st("Missing", "error", "alert", ALL, { needsRelease: "student" }),
    notReceivedClosed: st("Not received · closed", "neutral", "clock", STUDENT),
    excused: st("Excused", "neutral", "info", ALL, { needsRelease: "student" }),
    needsAction: st("Needs action", "warning", "alert", ALL, { attention: true }),
  });

  // Who may see a status word. Guests see no work statuses. ownOnly statuses are hidden when own is false;
  // needsRelease statuses reach the student only with released: true.
  WB.statusVisible = function (key, role, opts) {
    var s = WB.STATUS[key];
    if (!s) WB.fail("statusVisible", "unknown status key '" + key + "'");
    WB.oneOf("statusVisible", "role", role, WB.ROLES);
    var o = opts || {};
    if (s.visibleTo.indexOf(role) < 0) return false;
    if (s.ownOnly && o.own === false) return false;
    if (s.needsRelease === role && o.released !== true) return false;
    return true;
  };

  // D3 access, availability and context states. Not work statuses (BD39 › Other labels).
  WB.FLAGS = Object.freeze({
    locked: Object.freeze({ label: "Locked", tone: "neutral", icon: "lock" }),
    closed: Object.freeze({ label: "Closed", tone: "neutral", icon: "lock" }),
    extension: Object.freeze({ label: "Extension applied", tone: "accent", icon: "clock" }),
    lastKnown: Object.freeze({ label: "Last known", tone: "warning", icon: "clock" }),
    readOnly: Object.freeze({ label: "Read-only", tone: "neutral", icon: "lock" }),
    notOpen: Object.freeze({ label: "Not open yet", tone: "neutral", icon: "eye-off" }),
    preview: Object.freeze({ label: "Instructor preview", tone: "warning", icon: "eye" }),
  });

  WB.version = "2a";
  K.version = WB.version;
})(typeof globalThis !== "undefined" ? globalThis : this);
