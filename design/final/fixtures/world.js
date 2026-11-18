/* Whiteboard Phase 2b fixtures: the Alder Hill world (people, courses, enrollments) and the date toolkit.
   Sources: spec/docs/22-fixtures-overview.html (notice, scenario_clock, dataset names);
   design/reviews/board-deep-dive-2026-11-15.md:206 (world summary); the board copy
   design/board/Whiteboard-Design-Board-2026-11-04.html (names, emails, course titles, help address).
   Fictional and labelled "reconstructed"; see fixtures/SOURCES.md for values chosen by Claude under owner
   delegation. Records store ISO strings with an explicit offset; words, formatted dates and percentages
   are produced only by the selectors below. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var sel = WB.sel;
  var def = function (k, v) { return WB.defineFrozen(sel, k, v); };

  WB.defineFrozen(WB.data, "world", {
    meta: { source: "reconstructed", basis: ["spec/docs/22-fixtures-overview.html", "board-deep-dive-2026-11-15.md:206"] },
    notice: "Fictional HTML design fixtures. No real institution, person, credential, upload, grade, tool entitlement or integration.",
    clock: "2026-10-20T16:00:00-04:00",
    institution: { id: "alderhill", name: "Alder Hill College", timezone: "America/New_York", sign_in_host: "sso.alderhill.example", support: "help@alderhill.example" },
    people: [
      { id: "aisha", name: "Aisha Rahman", role: "student", email: "arahman@alderhill.example" },
      { id: "ben", name: "Ben Okafor", role: "student", email: "bokafor@alderhill.example" },
      { id: "carmen", name: "Carmen Ortiz", role: "student", email: "cortiz@alderhill.example" },
      { id: "reyes", name: "Dr. Diane Reyes", role: "instructor", email: "dreyes@alderhill.example" },
      { id: "maya", name: "Maya Chen", role: "ta", email: "mchen@alderhill.example" },
    ],
    courses: [
      { id: "phys110-f26", key: "phys", code: "PHYS 110", title: "Introductory Mechanics", term: "Fall 2026", section: "Section 01", archived: false },
      { id: "math220-f26", key: "math", code: "MATH 220", title: "Linear Algebra", term: "Fall 2026", section: "Section 01", archived: false },
      { id: "math120-s26", key: "math", code: "MATH 120", title: "Calculus II", term: "Spring 2026", section: "Section 01", archived: true },
    ],
    enrollments: [
      { id: "aisha", person_id: "aisha", role: "student", course_ids: ["phys110-f26", "math220-f26", "math120-s26"] },
      { id: "ben", person_id: "ben", role: "student", course_ids: ["phys110-f26", "math220-f26"] },
      { id: "carmen", person_id: "carmen", role: "student", course_ids: ["phys110-f26"] },
      { id: "reyes", person_id: "reyes", role: "instructor", course_ids: ["phys110-f26", "math220-f26"] },
      { id: "maya", person_id: "maya", role: "ta", course_ids: ["phys110-f26"] },
    ],
    // The person each prototype role switch speaks for (Phase 2 gate, chosen by Claude under owner delegation).
    personas: {
      student: { person_id: "aisha", course_id: "phys110-f26" },
      instructor: { person_id: "reyes", course_id: "phys110-f26" },
      ta: { person_id: "maya", course_id: "phys110-f26" },
    },
  });

  // ---------- Date toolkit: fields come from the ISO string; the host time zone is never used. ----------
  var ISO = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)([+-])(\d\d):(\d\d)$/;
  var DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var ZONES = { "-04:00": "EDT", "-05:00": "EST" };
  var MINUTE_MS = 60000;
  var SECOND_MS = 1000;

  function parseIso(iso) {
    var m = typeof iso === "string" ? ISO.exec(iso) : null;
    if (!m) throw new Error("WB.sel.parseIso: not an ISO datetime with offset: '" + iso + "'");
    var sign = m[7] === "-" ? -1 : 1;
    var f = { year: +m[1], month: +m[2], day: +m[3], hour: +m[4], minute: +m[5], second: +m[6], offset: m[7] + m[8] + ":" + m[9] };
    f.offsetMinutes = sign * (+m[8] * 60 + +m[9]);
    f.epoch = Date.UTC(f.year, f.month - 1, f.day, f.hour, f.minute, f.second) - f.offsetMinutes * MINUTE_MS;
    return f;
  }
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  function weekday(iso, form) {
    var f = parseIso(iso);
    var d = new Date(Date.UTC(f.year, f.month - 1, f.day)).getUTCDay();
    return form === "long" ? DAYS_LONG[d] : DAYS_SHORT[d];
  }
  function fmtShortDate(iso) { var f = parseIso(iso); return MONTHS[f.month - 1] + " " + f.day; }
  function fmtDate(iso) { return weekday(iso, "short") + " " + fmtShortDate(iso); }
  function fmtTime(iso) {
    var f = parseIso(iso);
    var h = f.hour % 12 === 0 ? 12 : f.hour % 12;
    return h + ":" + pad(f.minute) + " " + (f.hour < 12 ? "AM" : "PM");
  }
  function fmtDateTime(iso) { return fmtDate(iso) + ", " + fmtTime(iso); }
  function zoneAbbr(iso) {
    var z = ZONES[parseIso(iso).offset];
    if (!z) throw new Error("WB.sel.zoneAbbr: no US Eastern abbreviation for '" + iso + "'");
    return z;
  }
  // Adds n minutes and keeps the record's offset (all fixture times sit inside one offset period). n may be
  // fractional: the arithmetic runs in whole seconds, the resolution of the ISO records (R14).
  function addMinutes(iso, n) {
    var f = parseIso(iso);
    var seconds = Math.round(n * 60);
    var local = new Date(f.epoch + f.offsetMinutes * MINUTE_MS + seconds * SECOND_MS);
    return local.getUTCFullYear() + "-" + pad(local.getUTCMonth() + 1) + "-" + pad(local.getUTCDate()) + "T" +
      pad(local.getUTCHours()) + ":" + pad(local.getUTCMinutes()) + ":" + pad(local.getUTCSeconds()) + f.offset;
  }
  function minutesBetween(a, b) { return (parseIso(b).epoch - parseIso(a).epoch) / MINUTE_MS; }
  function isBefore(a, b) { return parseIso(a).epoch < parseIso(b).epoch; }
  function minIso(a, b) { return isBefore(b, a) ? b : a; }
  // Two decimals and a percent sign. Rounds half-up once, at the last step (DD:1005 leaves the mode open;
  // half-up is chosen by Claude under owner delegation). The small epsilon absorbs binary noise.
  function pct(n) {
    if (typeof n !== "number" || !isFinite(n)) throw new Error("WB.sel.pct: not a finite number: " + n);
    return (Math.round((n + 1e-9) * 100) / 100).toFixed(2) + "%";
  }
  function round2(n) { return Math.round((n + 1e-9) * 100) / 100; }

  def("parseIso", parseIso);
  def("weekday", weekday);
  def("fmtDate", fmtDate);
  def("fmtShortDate", fmtShortDate);
  def("fmtTime", fmtTime);
  def("fmtDateTime", fmtDateTime);
  def("zoneAbbr", zoneAbbr);
  def("addMinutes", addMinutes);
  def("minutesBetween", minutesBetween);
  def("isBefore", isBefore);
  def("minIso", minIso);
  def("pct", pct);
  def("round2", round2);

  // ---------- World selectors (view-bound) ----------
  def("person", function (view, personId) {
    return view.data.world.people.filter(function (p) { return p.id === personId; })[0] || null;
  });
  def("course", function (view, courseId) {
    return view.data.world.courses.filter(function (c) { return c.id === courseId; })[0] || null;
  });
  // People enrolled in a course with a role ("student", "instructor" or "ta").
  def("enrolled", function (view, courseId, role) {
    return view.data.world.enrollments
      .filter(function (e) { return e.course_ids.indexOf(courseId) >= 0 && (!role || e.role === role); })
      .map(function (e) { return e.person_id; });
  });

  // ---------- Viewer identity (Phase 2 gate M1) ----------
  var ROLE_IDS = ["student", "instructor", "ta"];
  var own = function (obj, key) { return !!obj && Object.prototype.hasOwnProperty.call(obj, key); };
  var GUEST = Object.freeze({ role: "guest", personId: null, courseId: null });

  // who.role, only when an enrollment grants that person that role in that course; null otherwise.
  def("verifiedRole", function (view, who, courseId) {
    if (!who || typeof who !== "object" || typeof who.personId !== "string" || ROLE_IDS.indexOf(who.role) < 0) return null;
    var granted = view.data.world.enrollments.some(function (e) {
      return e.person_id === who.personId && e.role === who.role && e.course_ids.indexOf(courseId) >= 0;
    });
    return granted ? who.role : null;
  });

  // The frozen viewer for a role switch. The role is read from the persona's enrollment, so a persona whose
  // enrollment grants a different role (or none) gives the guest viewer.
  def("viewerFor", function (view, role) {
    var personas = view.data.world.personas;
    var p = ROLE_IDS.indexOf(role) >= 0 && own(personas, role) ? personas[role] : null;
    if (!p) return GUEST;
    var who = { role: role, personId: p.person_id, courseId: p.course_id };
    return sel.verifiedRole(view, who, p.course_id) === role ? Object.freeze(who) : GUEST;
  });

  // Shell-ready course option for K.shell: tabs from courseNav, tools from staffTools, each {id, label, go,
  // current}. opts.section marks the entry with that id; otherwise opts.page marks entries on that page.
  def("courseShell", function (view, who, opts) {
    var o = opts || {};
    var role = who ? sel.verifiedRole(view, who, who.courseId) : null;
    var course = role ? sel.course(view, who.courseId) : null;
    if (!course) return null;
    var item = function (entry) {
      var current = o.section !== undefined ? entry.id === o.section : entry.page === o.page;
      return Object.freeze({ id: entry.id, label: entry.label, go: entry.page, current: current });
    };
    return Object.freeze({
      key: course.key, code: course.code, title: course.title,
      tabs: Object.freeze(sel.courseNav(role).map(item)),
      tools: Object.freeze(sel.staffTools(role).map(item)),
    });
  });

  // File sizes: one decimal for MB, whole KB below one MB.
  var KB = 1024;
  var MB = KB * KB;
  def("fmtBytes", function (n) {
    if (typeof n !== "number" || !isFinite(n) || n < 0) throw new Error("WB.sel.fmtBytes: not a finite, non-negative number: " + n);
    return n >= MB ? (n / MB).toFixed(1) + " MB" : Math.round(n / KB) + " KB";
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
