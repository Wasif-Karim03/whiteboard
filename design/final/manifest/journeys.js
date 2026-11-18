/* Whiteboard Phase 2b: the 12 journeys and the J02 to J03 spine.
   Source: design/reviews/board-deep-dive-2026-11-15.md:161-172 (titles and paths; the same paths as
   design/final/tools/page_meta.mjs JOURNEY_PAGES). Step roles, scenarios and tokens (Phase 2 gate M7, R3) are
   chosen by Claude under owner delegation; tokens are variants in manifest/anchors.js. "token" matches the
   viewer route's name; it is manifest data, not fixture data.
   Spine: design/reviews/final-design-plan-2026-11-15.md §4 Phase 2. */
(function (root) {
  "use strict";
  var WB = root.WB;

  // steps(defaultRole, pages, {pageId: role}, {pageId: {scenario?, token?}}) gives [{page, role, scenario,
  // token}] in path order; scenario defaults to "default" and token to null.
  function steps(role, pages, except, at) {
    return pages.map(function (page) {
      var a = (at && at[page]) || {};
      return { page: page, role: (except && except[page]) || role, scenario: a.scenario || "default", token: a.token || null };
    });
  }
  // The same {scenario, token} for several pages.
  function each(pages, value) {
    var out = {};
    pages.forEach(function (p) { out[p] = value; });
    return out;
  }
  var HAND = { scenario: "assignment_submission" };
  var RELEASED = { scenario: "ps4_released" };
  var GROUP = { scenario: "group_work_in_progress" };
  var GROUP_DRAFT = { scenario: "group_work_in_progress", token: "motion" };
  var GROUP_DONE = { scenario: "group_submission", token: "group" };
  function j(id, title, list) { return { id: id, title: title, steps: list }; }

  WB.defineFrozen(WB.manifest, "journeys", [
    j("J01", "Arrival", steps("student", ["W01", "W02", "W03", "W04", "W05"], { W01: "guest" })),
    j("J02", "Individual submission", steps("student", ["W06", "W14", "W16", "W17", "W18", "W19", "W20", "W21", "W22"], null,
      each(["W06", "W14", "W16", "W17", "W18", "W19", "W20", "W21"], HAND))),
    j("J03", "Grade and release", steps("instructor", ["W48", "W49", "W50", "W51", "W53", "W23", "W24"], { W23: "student", W24: "student" }, each(["W23", "W24"], RELEASED))),
    j("J04", "Course authoring", steps("instructor", ["W35", "W36", "W37", "W38", "W39", "W40", "W43", "W44", "W14"])),
    j("J05", "Quiz lifecycle", steps("student", ["W41", "W42", "W25", "W26", "W27", "W53", "W24"], { W41: "instructor", W42: "instructor", W53: "instructor" },
      { W26: { scenario: "quiz_in_progress" }, W27: { scenario: "quiz_received" } })),
    j("J06", "Policy and correction", steps("instructor", ["W52", "W51", "W24", "W54", "W53", "W23"], { W24: "student", W23: "student" }, { W23: RELEASED })),
    j("J07", "Group assignment", steps("student", ["W47", "W40", "W33", "W34", "W19", "W20", "W21", "W22", "W49"], { W47: "instructor", W40: "instructor", W49: "instructor" }, {
      W40: { token: "motion" }, W33: GROUP, W34: GROUP, W19: GROUP_DRAFT, W20: GROUP_DRAFT, W21: GROUP_DRAFT, W22: GROUP_DONE, W49: GROUP_DONE,
    })),
    j("J08", "TA workload", steps("ta", ["W45", "W57", "W05", "W07", "W48", "W49"], { W45: "instructor", W57: "instructor" })),
    j("J09", "Course communication", steps("student", ["W55", "W28", "W29", "W08", "W30", "W31", "W56"], { W55: "instructor", W56: "instructor" })),
    j("J10", "Academic planning", steps("student", ["W36", "W32", "W07", "W08"], { W36: "instructor" })),
    j("J11", "Exceptions", steps("student", ["W46", "W19", "W25", "W58", "W54"], { W46: "instructor", W58: "instructor", W54: "instructor" })),
    j("J12", "Term continuity", steps("instructor", ["W06", "W59", "W60", "W35"])),
  ]);

  WB.defineFrozen(WB.manifest, "spine", ["W14", "W18", "W19", "W20", "W21", "W22", "W23", "W24", "W48", "W49", "W51", "W53"]);
})(typeof globalThis !== "undefined" ? globalThis : this);
