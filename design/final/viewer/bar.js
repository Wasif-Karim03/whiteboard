/* Whiteboard Phase 2c viewer: the prototype bar (team plan Step 4, R2, R14). Pure, no DOM.
   barModel describes every state-dependent part of the bar; renderBar is built from it, and the DOM glue's
   syncBar applies the same model to the live controls, so a fresh render and a synced bar always agree.
   Every id is prefixed "v-". The journey select is a picker only: its value is the active tour, else the
   pending pick. A sync that shows the active tour discards the pending pick (journeyPick), so the displayed
   value is always the one "Start tour" dispatches. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var V = (WB.viewer = WB.viewer || {});
  var esc = WB.esc;
  var attrs = WB.attrs;

  var SEGMENT_LABELS = ["Segment 1 · Access and account", "Segment 2 · Home and course", "Segment 3 · Submit and results", "Segment 4 · Community and groups", "Segment 5 · Authoring", "Segment 6 · Grading and insights"];
  var OPTIONAL_LABEL = "Optional pages (off by default)";
  var PLATFORMS = [["web", "Web"], ["ipad", "iPad"], ["iphone", "iPhone"]];
  var WIDTHS = [["regular", "Regular 1280"], ["narrow", "Narrow 390"]];
  var ORIENTATIONS = [["landscape", "Landscape"], ["portrait", "Portrait"]];
  var APPEARANCES = [["system", "System"], ["light", "Light"], ["dark", "Dark"]];
  var TEXTS = [["default", "Default"], ["larger", "Larger"]];

  function option(value, label, selected, disabled) {
    return "<option" + attrs({ value: value, selected: Boolean(selected), disabled: Boolean(disabled) }) + ">" + esc(label) + "</option>";
  }

  function pageOptionsHtml(W, vs) {
    var groups = SEGMENT_LABELS.map(function (label, i) {
      var pages = W.manifest.pages.filter(function (p) { return !p.optional && p.segment === i + 1; });
      return { label: label, pages: pages };
    });
    if (vs.opt) groups.push({ label: OPTIONAL_LABEL, pages: W.manifest.pages.filter(function (p) { return p.optional; }) });
    return groups.map(function (g) {
      return '<optgroup label="' + esc(g.label) + '">' + g.pages.map(function (p) { return option(p.id, p.id + " · " + p.title, p.id === vs.page); }).join("") + "</optgroup>";
    }).join("");
  }

  // "Default", the 16 situations (N/A ones disabled with their reason) and the page's own views.
  function stateMenuHtml(entry, vs) {
    var token = vs && vs.token;
    var kind = V.classifyToken(entry, token);
    var current = kind === "state" || kind === "variant" ? token : "";
    var states = V.stateOptions(entry).map(function (s) {
      var label = s.applicable ? s.label : s.label + " (not applicable: " + s.reason + ")";
      return option(s.id, label, s.id === current, !s.applicable);
    }).join("");
    var variantIds = Object.keys(entry.variants);
    var variants = variantIds.length
      ? '<optgroup label="Page views">' + variantIds.map(function (v) { return option(v, entry.variants[v], v === current); }).join("") + "</optgroup>"
      : "";
    return option("", "Default", current === "") + '<optgroup label="Situations">' + states + "</optgroup>" + variants;
  }

  // The journey select's displayed value and the pending pick that survives this sync. An active tour wins
  // and clears the pick; otherwise the pick is shown and kept.
  function journeyPick(vs, pending) {
    if (vs.j) return { value: vs.j, pending: "" };
    var p = pending || "";
    return { value: p, pending: p };
  }

  function barModel(W, vs, opts) {
    var entry = W.pageFor(vs.page);
    var kind = V.classifyToken(entry, vs.token);
    var pick = journeyPick(vs, opts && opts.pendingJourney);
    return {
      values: {
        page: vs.page, platform: vs.platform, width: vs.width, orientation: vs.orientation, role: vs.role,
        scenario: vs.scenario, state: kind === "state" || kind === "variant" ? vs.token : "",
        appearance: vs.appearance, text: vs.text, opt: Boolean(vs.opt), journey: pick.value,
      },
      pendingJourney: pick.pending,
      hidden: { width: vs.platform !== "web", orientation: vs.platform !== "ipad" },
      pageOptionsHtml: pageOptionsHtml(W, vs),
      stateOptionsHtml: stateMenuHtml(entry, vs),
    };
  }

  function radios(id, legend, key, choices, value, hidden) {
    var items = choices.map(function (c) {
      var rid = id + "-" + c[0];
      return '<span class="wb-vbar__choice"><input' + attrs({ type: "radio", id: rid, name: id, value: c[0], "data-v-key": key, checked: c[0] === value }) + '><label for="' + rid + '">' + esc(c[1]) + "</label></span>";
    }).join("");
    return "<fieldset" + attrs({ class: "wb-vbar__group", id: id, hidden: Boolean(hidden) }) + "><legend>" + esc(legend) + "</legend>" + items + "</fieldset>";
  }

  function select(id, label, key, optionsHtml) {
    return '<div class="wb-vbar__field"><label for="' + id + '">' + esc(label) + "</label><select" + attrs({ id: id, class: "wb-vbar__select", "data-v-key": key }) + ">" + optionsHtml + "</select></div>";
  }

  function simpleOptions(pairs, value) {
    return pairs.map(function (p) { return option(p[0], p[1], p[0] === value); }).join("");
  }

  function scenarioOptions(W, value) {
    var clocks = W.data.scenarios.clocks;
    return W.sel.scenarioIds().map(function (id) { return option(id, V.SCENARIO_LABELS[id] + " · " + W.sel.fmtDateTime(clocks[id]), id === value); }).join("");
  }

  function journeyOptions(W, value) {
    return option("", "No tour", value === "") + W.manifest.journeys.map(function (j) { return option(j.id, j.id + " · " + j.title, j.id === value); }).join("");
  }

  function renderBar(W, vs, opts) {
    var m = barModel(W, vs, opts);
    var v = m.values;
    var roles = W.ROLES.map(function (r) { return [r, W.ROLE_LABELS[r]]; });
    var optBox = '<div class="wb-vbar__field wb-vbar__field--inline"><input' + attrs({ type: "checkbox", id: "v-opt", "data-v-key": "opt", checked: v.opt }) + '><label for="v-opt">Show optional pages</label></div>';
    var start = "<button" + attrs({ type: "button", class: "wb-btn wb-btn--secondary", "data-v-act": "tour-start" }) + '><span class="wb-btn__label">Start tour</span></button>';
    return (
      '<header class="wb-previewbar" aria-labelledby="v-bar-title"><div class="wb-previewbar__identity">' + '<span class="wb-previewbar__label">Fictional demo</span>' +
      '<h2 class="wb-sr" id="v-bar-title">Prototype controls · fictional data</h2></div>' +
      '<details class="wb-previewbar__settings" id="v-settings"><summary id="v-settings-toggle">' + W.K.icon("tool") + 'Preview settings</summary><div class="wb-previewbar__panel">' +
      select("v-page", "Page", "page", m.pageOptionsHtml) + optBox +
      radios("v-platform", "Platform", "platform", PLATFORMS, v.platform, false) +
      radios("v-width", "Web width", "width", WIDTHS, v.width, m.hidden.width) +
      radios("v-orient", "iPad orientation", "orientation", ORIENTATIONS, v.orientation, m.hidden.orientation) +
      select("v-role", "Role switch (not sign-in)", "role", simpleOptions(roles, v.role)) +
      select("v-scenario", "Scenario clock", "scenario", scenarioOptions(W, v.scenario)) +
      select("v-state", "Other situations", "state", m.stateOptionsHtml) +
      radios("v-appearance", "Appearance", "appearance", APPEARANCES, v.appearance, false) +
      radios("v-text", "Text size", "text", TEXTS, v.text, false) +
      '<div class="wb-vbar__field wb-vbar__field--tour">' + select("v-journey", "Journey", "journey", journeyOptions(W, v.journey)) + start + "</div>" +
      "</div></details></header>"
    );
  }

  V.SEGMENT_LABELS = Object.freeze(SEGMENT_LABELS.slice());
  V.OPTIONAL_LABEL = OPTIONAL_LABEL;
  V.APPEARANCES = Object.freeze(APPEARANCES.slice());
  V.TEXTS = Object.freeze(TEXTS.slice());
  V.barModel = barModel;
  V.journeyPick = journeyPick;
  V.stateMenuHtml = stateMenuHtml;
  V.renderBar = renderBar;
})(typeof globalThis !== "undefined" ? globalThis : this);
