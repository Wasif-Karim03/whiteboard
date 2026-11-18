/* Whiteboard Phase 2c viewer: pure interaction rules for the DOM glue (team plan Step 4, R1–R4, R8, R9,
   R11, R13, R15). reduce() turns one action into the next view state plus history and focus instructions;
   every result passes through normalize. renderPlan() says which regions must re-render. activation()
   decides what a click on a stage control does, checking disabled controls first. No DOM. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var V = (WB.viewer = WB.viewer || {});

  var GENERIC_BLOCKED = "Not available right now. The reason is shown beside it.";
  var PREVIEW = "Preview only: this action does nothing in the prototype";
  var OPTIONAL_OFF = "Optional pages are off";
  var BAR_CHOICES = {
    platform: ["web", "ipad", "iphone"],
    width: ["regular", "narrow"],
    orientation: ["landscape", "portrait"],
    role: ["student", "instructor", "ta", "guest"],
    appearance: ["system", "light", "dark"],
    text: ["default", "larger"],
  };
  var CONTEXT_LABELS = { web: { regular: "Web", narrow: "Web narrow" }, ipad: { landscape: "iPad landscape", portrait: "iPad portrait" }, iphone: "iPhone" };

  function contextLabel(vs) {
    var ac = V.activeContext(vs);
    if (ac.platform === "web") return CONTEXT_LABELS.web[ac.width];
    if (ac.platform === "ipad") return CONTEXT_LABELS.ipad[ac.orientation];
    return CONTEXT_LABELS.iphone;
  }

  function statusLine(W, vs, notes) {
    var page = W.manifest.pagesById[vs.page];
    var parts = [page.id + " " + page.title, contextLabel(vs), W.ROLE_LABELS[vs.role], V.SCENARIO_LABELS[vs.scenario]];
    if (vs.token) parts.push(vs.token);
    return parts.concat(notes).join(" · ");
  }

  function finish(W, vs, history, focus, notes) {
    var n = V.normalize(W, vs);
    var all = notes.concat(n.notes);
    return Object.freeze({ vs: n.vs, history: history, focus: focus, status: statusLine(W, n.vs, all), notes: all });
  }

  function viewChanged(prev, next) {
    return !prev || prev.page !== next.page || prev.token !== next.token || JSON.stringify(prev.selection) !== JSON.stringify(next.selection);
  }

  function fromHash(W, vs, hash) {
    var p = V.parseHash(hash, { current: vs || undefined });
    if (!p) return null;
    return finish(W, p.vs, p.bare ? "replace" : "none", viewChanged(vs, p.vs) ? "h1" : "none", p.notes);
  }

  function fromLink(W, vs, href) {
    var p = V.parseHash(href, { current: vs || undefined });
    if (!p) return null;
    return finish(W, p.vs, "push", "h1", p.notes);
  }

  function barValue(W, vs, key, value) {
    if (key === "page") {
      if (!V.isPage(W, value)) throw new Error("WB.viewer.reduce: unknown page '" + value + "'");
      return { vs: V.merge(vs, { page: value, token: null, selection: null }), notes: [] };
    }
    if (key === "state") return { vs: V.merge(vs, { token: value ? String(value) : null }), notes: [] };
    if (key === "scenario") {
      if (W.sel.scenarioIds().indexOf(value) < 0) throw new Error("WB.viewer.reduce: unknown scenario '" + value + "'");
      return { vs: V.merge(vs, { scenario: value }), notes: [] };
    }
    if (key === "opt") return optValue(W, vs, value === true || value === "true" || value === "1");
    if (!V.has(BAR_CHOICES, key) || BAR_CHOICES[key].indexOf(value) < 0) throw new Error("WB.viewer.reduce: bad bar setting " + key + "='" + value + "'");
    var set = {};
    set[key] = value;
    if (key === "role") set.selection = null;
    return { vs: V.merge(vs, set), notes: [] };
  }

  function optValue(W, vs, on) {
    if (on || !W.manifest.pagesById[vs.page].optional) return { vs: V.merge(vs, { opt: on }), notes: [] };
    return { vs: V.merge(vs, { opt: false, page: V.roleHome(vs.role), token: null }), notes: [OPTIONAL_OFF] };
  }

  function fromTour(W, vs, op, jid) {
    if (op === "end") return finish(W, V.merge(vs, { j: null, k: null }), "replace", "journey", []);
    var target = op === "start" ? { jid: jid, k: 1 } : vs.j ? { jid: vs.j, k: vs.k + (op === "next" ? 1 : -1) } : null;
    var next = target && V.tours.viewFor(target.jid, target.k, V.merge(vs, { selection: null }));
    if (!next) return finish(W, vs, "none", "none", [op === "start" ? "Choose a journey first" : "No tour step there"]);
    var moved = vs.page !== next.page || vs.role !== next.role || vs.token !== next.token || vs.scenario !== next.scenario;
    return finish(W, next, "push", moved ? "h1" : "tour", []);
  }

  function reduce(W, vs, action) {
    var cur = vs || V.DEFAULTS;
    if (action.type === "hash") return fromHash(W, vs, action.hash);
    if (action.type === "link") return fromLink(W, cur, action.href);
    if (action.type === "bar") {
      var b = barValue(W, cur, action.key, action.value);
      return finish(W, b.vs, "replace", "control", b.notes);
    }
    if (action.type === "tour") return fromTour(W, cur, action.op, action.jid);
    if (action.type === "back") return finish(W, V.merge(cur, { token: null }), "push", "h1", []);
    throw new Error("WB.viewer.reduce: unknown action '" + action.type + "'");
  }

  function frameKey(vs) {
    var ac = V.activeContext(vs);
    return [vs.page, vs.token, vs.role, vs.scenario, ac.platform, ac.width, ac.orientation, JSON.stringify(vs.selection || null)].join("|");
  }

  function renderPlan(prev, next) {
    if (!prev) return Object.freeze({ frame: true, tour: true, theme: true });
    return Object.freeze({
      frame: frameKey(prev) !== frameKey(next),
      tour: [prev.j, prev.k, prev.page, prev.role].join("|") !== [next.j, next.k, next.page, next.role].join("|"),
      theme: prev.appearance !== next.appearance || prev.text !== next.text,
    });
  }

  var DOM_ACTS = ["open-dialog", "close-dialog", "toggle"];

  // Input: {tag, ariaDisabled, disabled, act, target, note, reasonText, href}. Disabled is checked first.
  function activation(a) {
    if (a.ariaDisabled === "true" || a.disabled === true) return { kind: "blocked", status: a.reasonText || a.note || GENERIC_BLOCKED };
    if (a.tag === "a") {
      var href = typeof a.href === "string" ? a.href : "";
      if (href.indexOf("#/") === 0) return { kind: "link" };
      if (href.charAt(0) === "#" && href.length > 1) return { kind: "in-page", target: href.slice(1) };
      return { kind: "native" };
    }
    if (DOM_ACTS.indexOf(a.act) >= 0) return { kind: a.act, target: a.target };
    if (a.act === "back") return { kind: "back" };
    if (a.tag === "button") return { kind: "preview", status: a.note || PREVIEW };
    return { kind: "native" };
  }

  function sortSelectOutcome(o) {
    return { status: o.note || PREVIEW, value: o.renderedValue };
  }

  // Ids of role="dialog" elements rendered without the hidden attribute (kit/adaptive.js K.dialog markup).
  function openDialogIds(html) {
    var out = [];
    var tags = String(html).match(/<div\b[^>]*\brole="dialog"[^>]*>/g) || [];
    tags.forEach(function (tag) {
      var id = /\bid="([^"]+)"/.exec(tag);
      if (id && !/\shidden(?=[\s>])/.test(tag)) out.push(id[1]);
    });
    return out;
  }

  function dialogFocusPlan(o) {
    var opener = o.opener;
    var returnTo = opener && opener.connected && opener.focusable ? "opener" : o.hasH1 ? "h1" : "stage";
    return { initial: "first-focusable", fallbackInitial: o.dialogId + "-title", returnTo: returnTo };
  }

  var DIALOG_MISSING = "This dialog is not drawn in the prototype yet.";

  // One modal at a time. Input: {currentId, currentOpener: {connected, focusable} | null, nextId, nextExists,
  // openerInsideCurrent}. Opening B over A hides A and its scrim first; B's return-focus opener is never an
  // element inside the hidden A: it is A's opener while valid, else none (closing then falls back to h1/stage).
  function modalTransition(o) {
    if (!o.nextExists) return { open: false, hide: [], returnOpener: "none", status: DIALOG_MISSING };
    var current = o.currentId || null;
    var hide = current && current !== o.nextId ? [current] : [];
    if (!current || !o.openerInsideCurrent) return { open: true, hide: hide, returnOpener: "new", status: "" };
    var co = o.currentOpener;
    var keep = co && co.connected && co.focusable ? "current" : "none";
    return { open: true, hide: hide, returnOpener: keep, status: "" };
  }

  function skipsTab(d) {
    return Boolean(d.hidden) || Boolean(d.disabled) || String(d.tabindex) === "-1";
  }

  function radioGroup(d) {
    return d.tag === "input" && d.type === "radio" && d.name ? d.name : null;
  }

  // The sequential Tab stops among focusable candidates, as indexes in document order. Input: a list of
  // {tag, type, name, checked, disabled, tabindex, hidden}. Hidden, disabled and tabindex=-1 entries are
  // skipped; radios sharing a name are one stop: the checked one, else the first. Positive tabindex is not
  // reordered (the kit emits none).
  function tabStops(list) {
    var groupStop = {};
    list.forEach(function (d, i) {
      var g = radioGroup(d);
      if (!g || skipsTab(d)) return;
      if (!V.has(groupStop, g) || (d.checked && !list[groupStop[g]].checked)) groupStop[g] = i;
    });
    var out = [];
    list.forEach(function (d, i) {
      if (skipsTab(d)) return;
      var g = radioGroup(d);
      if (!g || groupStop[g] === i) out.push(i);
    });
    return out;
  }

  // The dialog Tab trap at its boundaries. Input: the candidate list, the index of the focused element in it
  // (-1 when it is not a candidate), whether focus is inside the dialog, and Shift. A focused radio counts as
  // its group's stop. Returns {prevent, focus}: focus is a candidate index to move to, or -1.
  function trapStep(list, activeIndex, inside, shift) {
    var stops = tabStops(list);
    if (!stops.length) return { prevent: true, focus: -1 };
    var first = stops[0];
    var last = stops[stops.length - 1];
    if (!inside) return { prevent: true, focus: shift ? last : first };
    var at = activeIndex;
    var g = activeIndex >= 0 ? radioGroup(list[activeIndex]) : null;
    if (g) at = stops.filter(function (i) { return radioGroup(list[i]) === g; })[0];
    if (shift && at === first) return { prevent: true, focus: last };
    if (!shift && at === last) return { prevent: true, focus: first };
    return { prevent: false, focus: -1 };
  }

  // One menu at a time: opening B closes the tracked A; closing a menu that is not tracked keeps the tracked one.
  function menuToggle(openId, id, opening) {
    if (opening) return Object.freeze({ close: Object.freeze(openId && openId !== id ? [openId] : []), openId: id });
    return Object.freeze({ close: Object.freeze([]), openId: openId === id ? null : openId });
  }

  // The menu handler acts only on an Escape nobody handled, with no modal open and a tracked menu.
  function menuEscapes(o) {
    return o.key === "Escape" && !o.defaultPrevented && !o.modal && Boolean(o.openId);
  }

  V.tabStops = tabStops;
  V.trapStep = trapStep;
  V.menuToggle = menuToggle;
  V.menuEscapes = menuEscapes;
  V.GENERIC_BLOCKED = GENERIC_BLOCKED;
  V.modalTransition = modalTransition;
  V.PREVIEW = PREVIEW;
  V.statusLine = statusLine;
  V.reduce = reduce;
  V.renderPlan = renderPlan;
  V.activation = activation;
  V.sortSelectOutcome = sortSelectOutcome;
  V.openDialogIds = openDialogIds;
  V.dialogFocusPlan = dialogFocusPlan;
})(typeof globalThis !== "undefined" ? globalThis : this);
