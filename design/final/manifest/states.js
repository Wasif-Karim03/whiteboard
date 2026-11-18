/* Whiteboard Phase 2b: the 16 shared UI states.
   Source: spec/docs/05-spec-03-shared-ui-and-states.html › State vocabulary and recovery (labels verbatim,
   rules paraphrased). saveState links a state to a WB.SAVE_STATES key (kit/signature.js). */
(function (root) {
  "use strict";
  var WB = root.WB;
  var SRC = "spec/docs/05-spec-03-shared-ui-and-states.html › State vocabulary and recovery";

  function s(id, text, rule, saveState) {
    var e = { id: id, label: text, rule: rule, source: SRC };
    if (saveState) e.saveState = saveState;
    return e;
  }

  WB.defineFrozen(WB.manifest, "states", [
    s("loading", "Loading", "Stable skeleton or status for the affected region; never a fabricated grade or zero while data is unknown."),
    s("firstUseEmpty", "First-use empty", "Explain what is absent and who can create it; no create action for a role that cannot create."),
    s("filteredEmpty", "Filtered empty", "Name the active filters and offer Clear filters; distinct from having no course data."),
    s("invalid", "Invalid", "Exact field error and summary, keep entered values, focus the field, block only the invalid action."),
    s("saving", "Saving / local save", "Show where the data currently exists; a local draft is not a server acknowledgment.", "savedLocal"),
    s("saveFailed", "Save failed", "Keep the draft, say what was not saved, retry safely or copy permitted text; never false success.", "failed"),
    s("conflict", "Conflict/stale", "Identify the newer version and record; offer compare, reload or keep the local draft; never overwrite silently.", "conflict"),
    s("offline", "Offline", "Label cached or last-known data; block acknowledged sends and releases; keep eligible drafts and explain resume."),
    s("permissionUnavailable", "Permission unavailable", "State the course or role boundary without leaking private data; safe return or help; mutation stays blocked."),
    s("sessionExpired", "Session expiring/expired", "Warn without losing work; sign-in return restores an allowed destination and re-checks state."),
    s("notYetAvailable", "Not yet available", "Name the date or prerequisite when the learner may know it; never expose hidden material."),
    s("archived", "Archived", "Show the term and read-only policy; keep allowed historical feedback and receipts."),
    s("success", "Success", "Name the actual change and next destination; submissions need a receipt, releases need recipients and version."),
    s("partialSuccess", "Partial bulk success", "Item-level successes and failures; retry failed items only; no all-done message while rows remain."),
    s("deviceDenied", "Denied device permission", "Offer a file, manual or keyboard alternative; do not re-request or blame the user."),
    s("destructive", "Destructive action", "Name scope, count, record and reversibility; keep required history; Cancel changes nothing."),
  ]);
})(typeof globalThis !== "undefined" ? globalThis : this);
