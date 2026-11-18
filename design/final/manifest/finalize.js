/* Whiteboard Phase 2b: freezes the data roots. Loaded last (DATA_FILES in design/final/tools/load_data.mjs).
   Team plan amendment A2: WB.manifest, WB.data and WB.sel are deep-frozen and pinned on WB as non-writable,
   non-configurable properties, so a root cannot be replaced or extended and WB.defineFrozen refuses any
   later definition. */
(function (root) {
  "use strict";
  var WB = root.WB;
  ["manifest", "data", "sel"].forEach(function (name) {
    var value = WB.deepFreeze(WB[name]);
    Object.defineProperty(WB, name, { value: value, enumerable: true, writable: false, configurable: false });
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
