/* Whiteboard Phase 2b: namespaces and the frozen-registration helper for manifest/ and fixtures/.
   Source: design/reviews/final-design-plan-2026-11-15.md (Phase 2b); team plan §3 Step 1 and amendment A2.
   This extra file is chosen by Claude under owner delegation. Plain script, no dependencies; loads after
   the kit in a browser or a bare node:vm context. WB.manifest holds page, navigation, journey, state and
   status maps; WB.data holds fictional "reconstructed" records; WB.sel holds pure selectors. */
(function (root) {
  "use strict";
  var WB = (root.WB = root.WB || {});

  function deepFreeze(x) {
    if (x && (typeof x === "object" || typeof x === "function") && !Object.isFrozen(x)) {
      Object.freeze(x);
      Object.getOwnPropertyNames(x).forEach(function (k) {
        var d = Object.getOwnPropertyDescriptor(x, k);
        if (d && "value" in d) deepFreeze(d.value);
      });
    }
    return x;
  }

  function lock(obj, key, value) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, writable: false, configurable: false });
  }

  ["manifest", "data", "sel"].forEach(function (name) {
    if (!WB[name]) WB[name] = {};
  });

  // Adds a deep-frozen value under ns[key]. A key is defined once; after manifest/finalize.js has frozen
  // the namespaces, every further definition is refused.
  function defineFrozen(ns, key, value) {
    if (!ns || typeof ns !== "object") throw new Error("WB.defineFrozen: namespace must be an object");
    if (typeof key !== "string" || key === "") throw new Error("WB.defineFrozen: key must be a non-empty string");
    if (Object.isFrozen(ns)) throw new Error("WB.defineFrozen: data is finalized ('" + key + "')");
    if (Object.prototype.hasOwnProperty.call(ns, key)) throw new Error("WB.defineFrozen: '" + key + "' already defined");
    lock(ns, key, deepFreeze(value));
    return ns[key];
  }

  lock(WB, "deepFreeze", deepFreeze);
  lock(WB, "defineFrozen", defineFrozen);
})(typeof globalThis !== "undefined" ? globalThis : this);
