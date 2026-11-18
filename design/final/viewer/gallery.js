/* Whiteboard Phase 2c viewer: DOM glue for Whiteboard-Final-Board.html (team plan Step 5, R10).
   Renders the board bar, the index and one section per page into #b-root. A role or situation change in a
   section replaces only that section's figure and link containers, so its selects and focus stay put.
   Board frames are inert, so no dialog lifecycle is needed. Browser behaviour is unverified until Phase 6. */
(function (root) {
  "use strict";
  if (typeof document === "undefined") return;
  var WB = root.WB;
  var V = WB.viewer;
  var SECTION_SELECT = /^bd-([WO]\d\d)-(role|state)$/;

  function $(id) { return document.getElementById(id); }

  function errorNotice(err) {
    var text = err && err.message ? err.message : String(err);
    return WB.K.notice({ tone: "error", title: "This part of the board could not be drawn", body: "<p>" + WB.esc(text) + "</p>" });
  }

  function sectionHtml(page) {
    try {
      return V.boardSection(WB, page.id, { role: page.roles[0], token: null });
    } catch (err) {
      return '<section class="wb-board__section" id="board-' + page.id + '" aria-label="' + page.id + '">' + errorNotice(err) + "</section>";
    }
  }

  function refreshSection(pageId) {
    var role = $("bd-" + pageId + "-role").value;
    var token = $("bd-" + pageId + "-state").value || null;
    try {
      var parts = V.boardSectionParts(WB, pageId, { role: role, token: token });
      $("board-" + pageId + "-figures").innerHTML = parts.figuresHtml;
      $("board-" + pageId + "-links").innerHTML = parts.linksHtml;
    } catch (err) {
      $("board-" + pageId + "-figures").innerHTML = errorNotice(err);
    }
  }

  function applyTheme(name, value) {
    var html = document.documentElement;
    if (name === "b-appearance") {
      if (value === "system") html.removeAttribute("data-theme");
      else html.setAttribute("data-theme", value);
    } else if (name === "b-text") {
      if (value === "larger") html.setAttribute("data-text", "larger");
      else html.removeAttribute("data-text");
    }
  }

  function onChange(e) {
    var t = e.target;
    var m = SECTION_SELECT.exec(t.id || "");
    if (m) { refreshSection(m[1]); return; }
    if (t.type === "radio") applyTheme(t.name, t.value);
  }

  function start() {
    var rootEl = $("b-root");
    rootEl.innerHTML =
      V.boardBar() + '<main class="wb-board" id="b-main">' + V.boardIndex(WB) +
      WB.manifest.pages.map(sectionHtml).join("") + "</main>";
    rootEl.addEventListener("change", onChange);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})(typeof globalThis !== "undefined" ? globalThis : this);
