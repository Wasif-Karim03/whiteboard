/* Whiteboard Phase 2 gate (M7, R3, R7): the record each page is about, its home scenario and its variants.
   Source: pages/PAGES.md (anchor table). Anchors and variant labels are chosen by Claude under owner
   delegation. A page with no entry is course-level with home "default". Variant ids are lower-case words
   and never a state id; journeys and Activity links name them as tokens ("<pageId>:<variant>"). Anchors
   are ids only: pages still read records through the scoped WB.sel selectors. */
(function (root) {
  "use strict";
  var WB = root.WB;

  function at(type, id) { return { type: type, id: id }; }
  function anchor(record, home, variants) { return { record: record, home: home, variants: variants || {} }; }
  function variant(label, record, home) { return { label: label, record: record, home: home }; }

  var MOTION_DRAFT = variant("Team Orbit draft", at("draft", "team-orbit-motion-draft"), "group_work_in_progress");
  var GROUP_RECEIPT = variant("Team Orbit group receipt", at("receipt", "AH-PHYS110-GROUP-001"), "group_submission");
  var RUBRIC = anchor(at("rubric", "ps4-rubric"), "default");

  WB.defineFrozen(WB.manifest, "anchors", {
    W14: anchor(at("course", "phys110-f26"), "default"),
    W19: anchor(at("assessment", "ps4"), "default", { motion: variant("Motion investigation (group)", at("assessment", "motion"), "group_work_in_progress") }),
    W20: anchor(at("draft", "aisha-ps4-draft"), "assignment_submission", { motion: MOTION_DRAFT }),
    W21: anchor(at("draft", "aisha-ps4-draft"), "assignment_submission", { motion: MOTION_DRAFT }),
    W22: anchor(at("receipt", "AH-PHYS110-001"), "default", { group: GROUP_RECEIPT }),
    W23: anchor(at("release", "rel-ps4-1"), "ps4_released"),
    W25: anchor(at("assessment", "quiz3"), "default"),
    W26: anchor(at("attempt", "aisha-quiz3-1"), "quiz_in_progress"),
    W27: anchor(at("receipt", "AH-PHYS110-Q3-001"), "quiz_received", { quiz2: variant("Quiz 2 review", at("receipt", "AH-PHYS110-Q2-001"), "default") }),
    W29: anchor(at("announcement", "ann-quiz3"), "default", { "office-hours": variant("Office hours update", at("announcement", "ann-office-hours"), "default") }),
    W31: anchor(at("discussion", "projectile"), "default"),
    W33: anchor(at("groupSet", "lab-teams"), "group_work_in_progress"),
    W34: anchor(at("group", "team-orbit"), "group_work_in_progress"),
    W40: anchor(at("assessment", "ps4"), "default", { motion: variant("Motion investigation (group)", at("assessment", "motion"), "default") }),
    W41: anchor(at("assessment", "quiz3"), "default"),
    W43: RUBRIC,
    W44: RUBRIC,
    W45: anchor(at("person", "maya"), "default"),
    W46: anchor(at("allowance", "aisha-quiz3"), "default"),
    W47: anchor(at("groupSet", "lab-teams"), "default"),
    W48: anchor(at("assessment", "ps4"), "default"),
    W49: anchor(at("receipt", "AH-PHYS110-001"), "default", {
      ben: variant("Ben's submission", at("receipt", "AH-PHYS110-002"), "default"),
      group: GROUP_RECEIPT,
    }),
    W50: RUBRIC,
    W52: anchor(at("policy", "phys110-policy"), "default"),
    W53: anchor(at("assessment", "ps4"), "default"),
    W57: anchor(at("task", "task-maya-ps4"), "default"),
  });

  // Record-safe routes are available to both fixture selectors and page helpers.
  WB.defineFrozen(WB.sel, "recordGo", function (pageId, type, recordId) {
    var anchor = Object.prototype.hasOwnProperty.call(WB.manifest.anchors, pageId) ? WB.manifest.anchors[pageId] : null;
    if (!anchor) return null;
    var same = function (r) { return r.type === type && r.id === recordId; };
    if (same(anchor.record)) return pageId;
    var hit = Object.keys(anchor.variants).filter(function (v) { return same(anchor.variants[v].record); })[0];
    return hit ? pageId + ":" + hit : null;
  });

  // {record, home} for a page, or for one of its variants; null for an unknown page or variant. A page with
  // no entry has no anchor record (course level, home "default").
  WB.defineFrozen(WB.sel, "anchorFor", function (pageId, variantId) {
    var anchors = WB.manifest.anchors;
    if (typeof pageId !== "string" || !Object.prototype.hasOwnProperty.call(anchors, pageId)) return null;
    var a = anchors[pageId];
    if (variantId === undefined || variantId === null) return Object.freeze({ record: a.record, home: a.home });
    if (typeof variantId !== "string" || !Object.prototype.hasOwnProperty.call(a.variants, variantId)) return null;
    return Object.freeze({ record: a.variants[variantId].record, home: a.variants[variantId].home });
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
