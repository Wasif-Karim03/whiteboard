/* Whiteboard Phase 2c viewer: the hash route (team plan Step 4, R1, R7, R9). Pure, no DOM.
   Two hash kinds: a complete view state "#/<PAGE>[:<TOKEN>]?v=1&…" (never inherits) and a navigation target
   "#/<PAGE>[:<TOKEN>]" with no "?" (kit data-go links; inherits the current settings). Width and orientation
   are always stored and only take effect on their own platform (activeContext). normalize() keeps optional
   pages switched on and ends a tour whose current step no longer matches the page and role. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var V = (WB.viewer = WB.viewer || {});

  var DEFAULTS = Object.freeze({
    page: "W05", token: null, platform: "web", width: "regular", orientation: "landscape", role: "student",
    scenario: "default", appearance: "system", text: "default", opt: false, j: null, k: null,
  });
  var TOKEN = /^[A-Za-z0-9_.-]+$/;
  var TOUR_ENDED = "Tour ended: this view is not on the tour path";

  var SCENARIO_LABELS = Object.freeze({
    default: "Default",
    ta_unassigned: "TA enrolled, no allocation",
    ta_handover: "Instructor takeover example",
    math_released: "Linear Algebra feedback released",
    assignment_submission: "Before the PS4 hand-in",
    group_work_in_progress: "Group work in progress",
    group_submission: "Group work handed in",
    quiz_in_progress: "Quiz 3 in progress",
    quiz_received: "Quiz 3 handed in",
    late_quiz_start: "Late quiz start",
    ta_expired: "TA access ended",
    ps4_released: "PS4 feedback released",
  });

  // Own-property membership only: link input such as "constructor" or "__proto__" must never match.
  function has(obj, key) {
    return Boolean(obj) && typeof key === "string" && Object.prototype.hasOwnProperty.call(obj, key);
  }

  function isPage(W, id) {
    return has(W.manifest.pagesById, id);
  }

  function merge(base, over) {
    var out = {};
    Object.keys(base).forEach(function (k) { out[k] = base[k]; });
    Object.keys(over || {}).forEach(function (k) { if (over[k] !== undefined) out[k] = over[k]; });
    return out;
  }

  function journey(jid) {
    return WB.manifest.journeys.filter(function (j) { return j.id === jid; })[0] || null;
  }

  // Looked up at call time from the manifest, so route.js does not depend on tours.js load order.
  function tourStep(jid, k) {
    var tours = WB.viewer.tours;
    if (tours && typeof tours.step === "function") return tours.step(jid, k);
    var j = journey(jid);
    return j && k >= 1 && k <= j.steps.length ? j.steps[k - 1] : null;
  }

  function normalize(WBx, vs) {
    var W = WBx || WB;
    var notes = [];
    var page = isPage(W, vs.page) ? W.manifest.pagesById[vs.page] : null;
    var next = merge(vs, {});
    if (next.selection && ["W05", "W06", "W07", "W08", "W09", "W10", "W11", "W12"].indexOf(next.page) >= 0) next.selection = null;
    if (page && page.optional && !next.opt) next.opt = true;
    if (next.j) {
      var step = tourStep(next.j, next.k);
      if (!step || step.page !== next.page || step.role !== next.role) {
        next.j = null;
        next.k = null;
        notes.push(TOUR_ENDED);
      }
    } else {
      next.k = null;
    }
    return { vs: Object.freeze(next), notes: notes };
  }

  var CHOICES = {
    p: ["platform", ["web", "ipad", "iphone"], "platform"],
    w: ["width", ["regular", "narrow"], "web width"],
    o: ["orientation", ["landscape", "portrait"], "iPad orientation"],
    r: ["role", ["student", "instructor", "ta", "guest"], "role"],
    a: ["appearance", ["system", "light", "dark"], "appearance"],
    x: ["text", ["default", "larger"], "text size"],
  };

  function readParam(acc, key, value) {
    if (key === "v") return acc;
    var selectionKeys = { tc: "courseId", ta: "assessmentId", tl: "learnerId", tr: "receiptId" };
    if (has(selectionKeys, key)) {
      var selection = merge(acc.vs.selection || {}, {});
      selection[selectionKeys[key]] = value;
      return withSet(acc, "selection", Object.freeze(selection));
    }
    var c = has(CHOICES, key) ? CHOICES[key] : null;
    if (c) {
      if (c[1].indexOf(value) < 0) return withNote(acc, "Unknown " + c[2] + " in link");
      return withSet(acc, c[0], value);
    }
    if (key === "c") return WB.sel.scenarioIds().indexOf(value) >= 0 ? withSet(acc, "scenario", value) : withNote(acc, "Unknown scenario in link");
    if (key === "opt") return value === "1" || value === "0" ? withSet(acc, "opt", value === "1") : withNote(acc, "Unknown optional-pages setting in link");
    if (key === "j") return journey(value) ? withSet(acc, "j", value) : withNote(acc, "Unknown journey in link");
    if (key === "k") return /^[1-9]\d{0,2}$/.test(value) ? withSet(acc, "k", Number(value)) : withNote(acc, "Unknown tour step in link");
    return withNote(acc, "Unknown setting '" + key + "' in link");
  }
  function withSet(acc, key, value) {
    var set = {};
    set[key] = value;
    return { vs: merge(acc.vs, set), notes: acc.notes };
  }
  function withNote(acc, note) {
    return { vs: acc.vs, notes: acc.notes.concat([note]) };
  }

  function safeDecode(s) {
    try { return decodeURIComponent(s); } catch (e) { return "\u0000"; }
  }

  function readQuery(start, query) {
    return query.split("&").filter(Boolean).reduce(function (acc, part) {
      var eq = part.indexOf("=");
      var key = eq < 0 ? part : part.slice(0, eq);
      return readParam(acc, safeDecode(key), safeDecode(eq < 0 ? "" : part.slice(eq + 1)));
    }, { vs: start, notes: [] });
  }

  // "<page>[:<token>][~<scenario>]". The scenario suffix (Phase 2 gate M10) is split off first; an unknown
  // one adds a note and leaves the scenario unset (the current one is kept).
  function readScenario(path) {
    var tilde = path.lastIndexOf("~");
    if (tilde < 0) return { path: path, scenario: null, notes: [] };
    var id = safeDecode(path.slice(tilde + 1));
    var known = WB.sel.scenarioIds().indexOf(id) >= 0;
    return { path: path.slice(0, tilde), scenario: known ? id : null, notes: known ? [] : ["Unknown scenario in link"] };
  }

  function readPath(raw) {
    var sc = readScenario(raw);
    var path = sc.path;
    var colon = path.indexOf(":");
    var pageId = safeDecode(colon < 0 ? path : path.slice(0, colon));
    var token = colon < 0 ? null : safeDecode(path.slice(colon + 1));
    if (!isPage(WB, pageId)) return { page: DEFAULTS.page, token: null, scenario: sc.scenario, notes: sc.notes.concat(["Unknown page in link"]) };
    if (token !== null && !TOKEN.test(token)) return { page: pageId, token: null, scenario: sc.scenario, notes: sc.notes.concat(["Unknown view in link"]) };
    return { page: pageId, token: token, scenario: sc.scenario, notes: sc.notes };
  }

  // Returns {vs, notes, bare} or null for a hash that does not start with "#/".
  function parseHash(hash, opts) {
    if (typeof hash !== "string" || hash.indexOf("#/") !== 0) return null;
    var body = hash.slice(2);
    var q = body.indexOf("?");
    var contextual = q >= 0 && body.slice(q + 1).split("&").every(function (x) { return /^(tc|ta|tl|tr)=/.test(x); });
    var bare = q < 0 || contextual;
    var p = readPath(q < 0 ? body : body.slice(0, q));
    var current = opts && opts.current;
    var set = p.scenario ? { page: p.page, token: p.token, scenario: p.scenario } : { page: p.page, token: p.token };
    // A complete hash reads its query after the path, so its c= parameter wins over a ~scenario suffix.
    var read = contextual ? readQuery(merge(current || DEFAULTS, merge(set, { selection: {} })), body.slice(q + 1)) : bare
      ? { vs: merge(current || DEFAULTS, set), notes: [] }
      : readQuery(merge(DEFAULTS, set), body.slice(q + 1));
    var n = normalize(WB, read.vs);
    return { vs: n.vs, notes: p.notes.concat(read.notes, n.notes), bare: bare };
  }

  function formatHash(vs) {
    var parts = ["v=1"];
    if (vs.platform !== "web") parts.push("p=" + vs.platform);
    if (vs.width === "narrow") parts.push("w=narrow");
    if (vs.orientation === "portrait") parts.push("o=portrait");
    if (vs.role !== "student") parts.push("r=" + vs.role);
    if (vs.scenario !== "default") parts.push("c=" + encodeURIComponent(vs.scenario));
    if (vs.appearance !== "system") parts.push("a=" + vs.appearance);
    if (vs.text === "larger") parts.push("x=larger");
    if (vs.opt) parts.push("opt=1");
    var fields = { courseId: "tc", assessmentId: "ta", learnerId: "tl", receiptId: "tr" };
    Object.keys(fields).forEach(function (key) { if (vs.selection && vs.selection[key] !== undefined && vs.selection[key] !== null) parts.push(fields[key] + "=" + encodeURIComponent(vs.selection[key])); });
    if (vs.j) parts.push("j=" + vs.j, "k=" + vs.k);
    return "#/" + vs.page + (vs.token ? ":" + vs.token : "") + "?" + parts.join("&");
  }

  function activeContext(vs) {
    return {
      platform: vs.platform,
      width: vs.platform === "web" ? vs.width : undefined,
      orientation: vs.platform === "ipad" ? vs.orientation : undefined,
    };
  }

  // The shared link formatter for the board and the spec: always a complete, normalised hash.
  function prototypeHref(vs, file) {
    return (file || "Whiteboard-Final.html") + formatHash(normalize(WB, merge(DEFAULTS, vs)).vs);
  }

  function classifyToken(entry, token) {
    if (!token) return "none";
    if (entry.states.indexOf(token) >= 0) return "state";
    if (has(entry.variants, token)) return "variant";
    if (has(entry.na, token)) return "na";
    return "unknown";
  }

  function isPlainClick(evt) {
    return Boolean(evt) && evt.button === 0 && !evt.metaKey && !evt.ctrlKey && !evt.shiftKey && !evt.altKey && !evt.defaultPrevented;
  }

  function shouldIntercept(evt, href) {
    return isPlainClick(evt) && typeof href === "string" && href.indexOf("#/") === 0;
  }

  function roleHome(role) {
    return role === "guest" ? "W01" : "W05";
  }

  function sidebarFocusTarget(ns, opening) {
    return ns + (opening ? "-sidebar-close" : "-sidebar-toggle");
  }

  V.DEFAULTS = DEFAULTS;
  V.SCENARIO_LABELS = SCENARIO_LABELS;
  V.TOUR_ENDED = TOUR_ENDED;
  V.has = has;
  V.isPage = isPage;
  V.merge = merge;
  V.normalize = normalize;
  V.parseHash = parseHash;
  V.formatHash = formatHash;
  V.activeContext = activeContext;
  V.prototypeHref = prototypeHref;
  V.classifyToken = classifyToken;
  V.isPlainClick = isPlainClick;
  V.shouldIntercept = shouldIntercept;
  V.roleHome = roleHome;
  V.sidebarFocusTarget = sidebarFocusTarget;
})(typeof globalThis !== "undefined" ? globalThis : this);
