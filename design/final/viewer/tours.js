/* Whiteboard Phase 2c viewer: guided tours over the twelve journeys J01–J12 (team plan Step 4, R8).
   Pure, no DOM. A tour step fixes the page and the role; the panel is "" when no tour is active. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var V = (WB.viewer = WB.viewer || {});
  var esc = WB.esc;

  function list() {
    return WB.manifest.journeys;
  }

  function find(jid) {
    return list().filter(function (j) { return j.id === jid; })[0] || null;
  }

  function step(jid, k) {
    var j = find(jid);
    if (!j || typeof k !== "number" || k % 1 !== 0 || k < 1 || k > j.steps.length) return null;
    return j.steps[k - 1];
  }

  // The view for step k: the step's page, role, scenario and token (a variant or null), other settings kept.
  function viewFor(jid, k, vs) {
    var s = step(jid, k);
    if (!s) return null;
    var page = WB.manifest.pagesById[s.page];
    return Object.freeze(V.merge(vs, { page: s.page, role: s.role, scenario: s.scenario, token: s.token || null, j: jid, k: k, opt: Boolean(vs.opt || page.optional) }));
  }

  function button(act, label, reason) {
    var id = "v-" + act;
    var attrs = WB.attrs({ type: "button", class: "wb-btn wb-btn--secondary", "data-v-act": act, disabled: Boolean(reason), "aria-describedby": reason ? id + "-reason" : null });
    var btn = "<button" + attrs + '><span class="wb-btn__label">' + esc(label) + "</span></button>";
    if (!reason) return btn;
    return '<span class="wb-btnwrap">' + btn + '<span class="wb-btn__reason" id="' + id + '-reason">' + esc(reason) + "</span></span>";
  }

  function panel(W, vs) {
    if (!vs || !vs.j) return "";
    var j = find(vs.j);
    var s = step(vs.j, vs.k);
    if (!j || !s) return "";
    var n = j.steps.length;
    var page = W.manifest.pagesById[s.page];
    var prev = vs.k > 1 ? j.steps[vs.k - 2] : null;
    var switched = prev && prev.role !== s.role
      ? '<p class="wb-tour__note">Role switched to ' + esc(W.ROLE_LABELS[s.role]) + " for this step</p>"
      : "";
    return (
      '<section class="wb-tour" aria-label="' + esc("Guided tour: " + j.id + " " + j.title) + '">' +
      '<h2 class="wb-tour__title" id="v-tour-title" tabindex="-1">' +
      esc("Step " + vs.k + " of " + n + " · " + page.id + " " + page.title + " · as " + W.ROLE_LABELS[s.role]) + "</h2>" +
      switched +
      '<div class="wb-tour__actions">' +
      button("tour-prev", "Previous", vs.k === 1 ? "First step" : null) +
      button("tour-next", "Next", vs.k === n ? "Last step" : null) +
      button("tour-end", "End tour", null) +
      "</div></section>"
    );
  }

  V.tours = Object.freeze({ list: list, step: step, viewFor: viewFor, panel: panel });
})(typeof globalThis !== "undefined" ? globalThis : this);
