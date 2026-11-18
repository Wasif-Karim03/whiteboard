/* Whiteboard Phase 2c: the page registry (team plan Step 1; contract in pages/PAGES.md).
   Plain script, no dependencies; loads after the kit and DATA_FILES in a browser or a bare node:vm context.
   WB.definePage(id, def) registers one page; WB.sealPages() (pages/seal.js) fills a placeholder for every
   manifest page with no registration and freezes the registry; WB.pageFor(id) and WB.pageIds() read it.
   Every definition is validated and fails fast. Chosen by Claude under owner delegation. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var VARIANT_ID = /^[a-z][a-z0-9-]*$/;
  var MAX_REASON = 140;
  var registry = {};
  var sealed = false;

  function fail(what) {
    throw new Error("WB.definePage: " + what);
  }

  function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function stateIds() {
    return WB.manifest.states.map(function (s) { return s.id; });
  }

  function checkStates(id, list, all) {
    if (!Array.isArray(list)) fail(id + ": states must be an array of state ids");
    var seen = {};
    list.forEach(function (s) {
      if (all.indexOf(s) < 0) fail(id + ": unknown state '" + s + "'");
      if (seen[s]) fail(id + ": state '" + s + "' is listed twice");
      seen[s] = true;
    });
  }

  function checkNa(id, na, states, all) {
    if (!na || typeof na !== "object" || Array.isArray(na)) fail(id + ": na must be an object of state id → reason");
    Object.keys(na).forEach(function (s) {
      if (all.indexOf(s) < 0) fail(id + ": unknown state '" + s + "' in na");
      if (states.indexOf(s) >= 0) fail(id + ": state '" + s + "' is in both states and na");
      var reason = na[s];
      if (typeof reason !== "string" || reason.trim() === "") fail(id + ": na reason for '" + s + "' is empty");
      if (reason.length > MAX_REASON) fail(id + ": na reason for '" + s + "' is over " + MAX_REASON + " characters");
    });
    var missing = all.filter(function (s) { return states.indexOf(s) < 0 && !has(na, s); });
    if (missing.length) fail(id + ": states and na do not cover " + missing.join(", "));
  }

  function checkVariants(id, variants, all) {
    if (variants === undefined) return;
    if (!variants || typeof variants !== "object" || Array.isArray(variants)) fail(id + ": variants must be an object of id → label");
    Object.keys(variants).forEach(function (v) {
      if (!VARIANT_ID.test(v)) fail(id + ": variant id '" + v + "' must match " + VARIANT_ID);
      if (all.indexOf(v) >= 0) fail(id + ": variant '" + v + "' collides with a state id");
      var label = variants[v];
      if (typeof label !== "string" || label.trim() === "") fail(id + ": variant '" + v + "' has an empty label");
    });
  }

  // A failure scenario that lists this page must be drawable here: its state cannot be marked N/A.
  function checkFailures(id, states) {
    WB.data.scenarios.failures.forEach(function (f) {
      if (f.pages.indexOf(id) >= 0 && states.indexOf(f.state) < 0) {
        fail(id + ": failure scenario '" + f.id + "' needs state '" + f.state + "' in states");
      }
    });
  }

  function validate(id, def) {
    if (typeof id !== "string" || !has(WB.manifest.pagesById, id)) fail("unknown page id '" + id + "'");
    if (sealed) fail(id + ": the registry is sealed");
    if (has(registry, id)) fail(id + ": already registered");
    if (!def || typeof def !== "object") fail(id + ": a definition object is required");
    if (typeof def.render !== "function") fail(id + ": render must be a function");
    var all = stateIds();
    checkStates(id, def.states, all);
    checkNa(id, def.na, def.states, all);
    checkVariants(id, def.variants, all);
    checkFailures(id, def.states);
  }

  function copyObject(src) {
    var out = {};
    Object.keys(src || {}).forEach(function (k) { out[k] = src[k]; });
    return out;
  }

  function definePage(id, def) {
    validate(id, def);
    var entry = WB.deepFreeze({
      id: id,
      page: WB.manifest.pagesById[id],
      states: def.states.slice(),
      na: copyObject(def.na),
      variants: copyObject(def.variants),
      render: def.render,
      placeholder: false,
    });
    var next = copyObject(registry);
    next[id] = entry;
    registry = next;
    return entry;
  }

  function pageIds() {
    return WB.manifest.pages.map(function (p) { return p.id; });
  }

  function pageFor(id) {
    if (!sealed) throw new Error("WB.pageFor: the registry is not sealed yet (load pages/seal.js)");
    if (!has(registry, id)) throw new Error("WB.pageFor: unknown page id '" + id + "'");
    return registry[id];
  }

  function sealPages() {
    if (sealed) fail("the registry is already sealed");
    if (typeof WB.placeholderPage !== "function") fail("pages/placeholder.js must load before sealing");
    var full = {};
    WB.manifest.pages.forEach(function (page) {
      full[page.id] = has(registry, page.id) ? registry[page.id] : WB.placeholderPage(page);
    });
    registry = Object.freeze(full);
    sealed = true;
    return pageIds().length;
  }

  function lock(key, value) {
    Object.defineProperty(WB, key, { value: value, enumerable: true, writable: false, configurable: false });
  }

  lock("definePage", definePage);
  lock("pageFor", pageFor);
  lock("pageIds", pageIds);
  lock("sealPages", sealPages);
})(typeof globalThis !== "undefined" ? globalThis : this);
