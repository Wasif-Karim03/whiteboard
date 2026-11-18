/* Whiteboard Phase 2b fixtures: lab teams and the group assignment.
   Sources: spec/docs/22-fixtures-overview.html (group_set, group_assignment, group_receipt fields);
   board-deep-dive-2026-11-15.md:1247 (group receipt AH-PHYS110-GROUP-001: Team Orbit, sent by Ben, Thu Oct 22
   2:20 PM, members Aisha and Ben, team version 1) and :1260 (Team Orbit, Team Vector, version 1,
   self-enrollment off). The group receipt is not in the base world (Oct 20); the group_submission scenario
   adds it (fixtures/scenarios.js). Fictional, "reconstructed". */
(function (root) {
  "use strict";
  var WB = root.WB;
  var sel = WB.sel;
  var PHYS = "phys110-f26";

  WB.defineFrozen(WB.data, "groups", {
    meta: { source: "reconstructed", basis: ["spec/docs/22-fixtures-overview.html", "board-deep-dive-2026-11-15.md:1247,1260"] },
    group_sets: [
      {
        id: "lab-teams", course_id: PHYS, name: "Lab teams", version: 1, self_enrollment: false, ungrouped: [],
        groups: [
          { id: "team-orbit", name: "Team Orbit", members: ["aisha", "ben"] },
          { id: "team-vector", name: "Team Vector", members: ["carmen"] },
        ],
      },
    ],
    group_assignments: [
      { id: "motion", course_id: PHYS, mode: "one_submission_per_group", group_set_id: "lab-teams", membership_version_at_publish: 1 },
    ],
    // Group receipts; see fixtures/scenarios.js (group_submission) for AH-PHYS110-GROUP-001.
    receipts: [],
  });

  WB.defineFrozen(sel, "groupFor", function (view, personId, setId) {
    var set = view.data.groups.group_sets.filter(function (s) { return s.id === setId; })[0];
    if (!set) return null;
    return set.groups.filter(function (g) { return g.members.indexOf(personId) >= 0; })[0] || null;
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
