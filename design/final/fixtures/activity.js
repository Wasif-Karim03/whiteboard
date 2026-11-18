/* Whiteboard Phase 2b fixtures: activity items for W05 Home and W08 Activity.
   Sources: decisions.md BD25 (previews and activity items carry no score; "Feedback ready" links to W23 or
   W27); board-deep-dive-2026-11-15.md:1182 and :1221 (announcement and reply events). Item times are chosen
   by Claude under owner delegation. `go` is a page id or "<pageId>:<variant>", a variant from
   manifest/anchors.js (Phase 2 gate R7).
   Fictional, "reconstructed". */
(function (root) {
  "use strict";
  var WB = root.WB;

  function item(id, person, at, kind, refType, refId, go) {
    return { id: id, person_id: person, at: at, kind: kind, ref: { type: refType, id: refId }, go: go };
  }

  WB.defineFrozen(WB.data, "activity", {
    meta: { source: "reconstructed", basis: ["decisions.md BD25", "board-deep-dive-2026-11-15.md:1182,1221"] },
    items: [
      item("act-quiz2-feedback", "aisha", "2026-10-13T15:00:00-04:00", "feedbackReleased", "assessment", "quiz2", "W27:quiz2"),
      item("act-office-hours-updated", "aisha", "2026-10-16T08:30:00-04:00", "announcementUpdated", "announcement", "ann-office-hours", "W29:office-hours"),
      item("act-quiz3-announcement", "aisha", "2026-10-19T09:00:00-04:00", "announcementPublished", "announcement", "ann-quiz3", "W29"),
      item("act-projectile-reply", "aisha", "2026-10-20T09:12:00-04:00", "discussionReply", "discussion", "projectile", "W31"),
      item("act-ps4-received", "maya", "2026-10-15T10:12:00-04:00", "workReceived", "receipt", "AH-PHYS110-001", "W48"),
    ],
  });

  // Newest first.
  WB.defineFrozen(WB.sel, "activityFor", function (view, personId) {
    return view.data.activity.items
      .filter(function (x) { return x.person_id === personId; })
      .slice()
      .sort(function (a, b) { return WB.sel.minutesBetween(a.at, b.at); });
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
