/* Whiteboard Phase 2c viewer: the board gallery (team plan Step 4, R10). Pure, no DOM.
   One section per page: metadata, role and situation selects, three scaled frames (web regular, iPad
   landscape, iPhone) and links that open the same view in the prototype in all five contexts. The figure and
   link containers are the only parts that change with the selects, and the selects sit outside them.
   Frames are inert and aria-hidden: the board is a visual overview read through its prototype links. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var V = (WB.viewer = WB.viewer || {});
  var esc = WB.esc;
  var attrs = WB.attrs;

  var LINK_CONTEXTS = [
    ["web-regular", "Open web in prototype", { platform: "web" }],
    ["web-narrow", "Open narrow web in prototype", { platform: "web", width: "narrow" }],
    ["ipad-landscape", "Open iPad in prototype", { platform: "ipad" }],
    ["ipad-portrait", "Open iPad portrait in prototype", { platform: "ipad", orientation: "portrait" }],
    ["iphone", "Open iPhone in prototype", { platform: "iphone" }],
  ];
  var FIGURES = [["web", "web-regular", "Web"], ["ipad", "ipad-landscape", "iPad landscape"], ["iphone", "iphone", "iPhone"]];
  var TIER_LABELS = { full: "Full", review: "Review and protect", handoff: "Handoff" };

  function viewOf(page, o, extra) {
    return V.merge({ page: page.id, token: o.token || null, role: o.role, opt: page.optional }, extra);
  }

  function boardLinks(W, pageId, o) {
    var page = W.manifest.pagesById[pageId];
    return Object.freeze(LINK_CONTEXTS.map(function (c) {
      return Object.freeze({ context: c[0], label: c[1], href: V.prototypeHref(viewOf(page, o, c[2])) });
    }));
  }

  function linkHtml(row) {
    return WB.K.link({ label: row.label, href: row.href });
  }

  function byContext(links, context) {
    return links.filter(function (l) { return l.context === context; })[0];
  }

  function figure(W, page, o, links, f) {
    var vs = V.merge(V.DEFAULTS, viewOf(page, o, { platform: f[0] }));
    var frame = V.renderFrame(W, V.normalize(W, vs).vs, { ns: "b-" + page.id + "-" + f[0] });
    return (
      '<figure class="wb-board__fig">' +
      '<div class="wb-board__viewport" data-platform="' + f[0] + '">' +
      '<div class="wb-board__frame" data-platform="' + f[0] + '" aria-hidden="true" inert>' + frame.html + "</div></div>" +
      '<figcaption class="wb-board__caption">' + esc(f[2] + " · " + TIER_LABELS[page.platforms[f[0]]]) + " · " + linkHtml(byContext(links, f[1])) + "</figcaption></figure>"
    );
  }

  function boardSectionParts(W, pageId, o) {
    var page = W.manifest.pagesById[pageId];
    var links = boardLinks(W, pageId, o);
    return {
      figuresHtml: FIGURES.map(function (f) { return figure(W, page, o, links, f); }).join(""),
      linksHtml: "Also: " + linkHtml(byContext(links, "web-narrow")) + " · " + linkHtml(byContext(links, "ipad-portrait")),
    };
  }

  function naList(W, entry) {
    var rows = V.stateOptions(entry).filter(function (s) { return !s.applicable; });
    if (!rows.length) return "<p>Every situation applies to this page.</p>";
    return '<ul class="wb-board__na">' + rows.map(function (s) { return "<li><strong>" + esc(s.label) + "</strong>: " + esc(s.reason) + "</li>"; }).join("") + "</ul>";
  }

  function meta(W, page, entry) {
    var K = W.K;
    var tiers = W.PLATFORMS.map(function (p) { return (p === "web" ? "Web" : p === "ipad" ? "iPad" : "iPhone") + " " + TIER_LABELS[page.platforms[p]]; }).join(" · ");
    var na = V.stateOptions(entry).filter(function (s) { return !s.applicable; }).length;
    return (
      '<div class="wb-board__meta">' +
      K.kv([{ label: "Roles", value: page.roles.map(function (r) { return W.ROLE_LABELS[r]; }).join(", ") }, { label: "Tier", value: tiers }, { label: "Route", value: page.route }]) +
      K.disclosure({ id: "board-" + page.id + "-na", summary: "Situations that do not apply (" + na + ")", body: naList(W, entry) }) +
      "</div>"
    );
  }

  function controls(W, page, entry, o) {
    var id = page.id;
    var roles = page.roles.map(function (r) { return "<option" + attrs({ value: r, selected: r === o.role }) + ">" + esc(W.ROLE_LABELS[r]) + "</option>"; }).join("");
    var sel = function (key, label, html) {
      var sid = "bd-" + id + "-" + key;
      return '<div class="wb-vbar__field"><label for="' + sid + '">' + esc(label) + "</label><select" + attrs({ id: sid, class: "wb-vbar__select", "data-board": id, "data-board-key": key }) + ">" + html + "</select></div>";
    };
    return '<div class="wb-board__controls">' + sel("role", "Role", roles) + sel("state", "Situation", V.stateMenuHtml(entry, { token: o.token || null })) + "</div>";
  }

  function boardSection(W, pageId, o) {
    var page = W.manifest.pagesById[pageId];
    var entry = W.pageFor(pageId);
    var parts = boardSectionParts(W, pageId, o);
    return (
      '<section class="wb-board__section" id="board-' + pageId + '" aria-labelledby="board-' + pageId + '-title">' +
      '<h2 class="wb-board__title" id="board-' + pageId + '-title">' + esc(pageId + " · " + page.title) + "</h2>" +
      meta(W, page, entry) + controls(W, page, entry, o) +
      '<div class="wb-board__figs" id="board-' + pageId + '-figures">' + parts.figuresHtml + "</div>" +
      '<p class="wb-board__links" id="board-' + pageId + '-links">' + parts.linksHtml + "</p></section>"
    );
  }

  function indexGroup(label, pages) {
    return (
      '<li class="wb-board__group"><h3>' + esc(label) + "</h3><ul>" +
      pages.map(function (p) { return '<li><a href="#board-' + p.id + '">' + esc(p.id + " · " + p.title) + "</a></li>"; }).join("") + "</ul></li>"
    );
  }

  function boardIndex(W) {
    var groups = V.SEGMENT_LABELS.map(function (label, i) {
      return indexGroup(label, W.manifest.pages.filter(function (p) { return !p.optional && p.segment === i + 1; }));
    });
    var optional = indexGroup(V.OPTIONAL_LABEL, W.manifest.pages.filter(function (p) { return p.optional; }));
    return '<nav class="wb-board__index" aria-labelledby="b-index-title"><h2 id="b-index-title">Pages</h2><ul>' + groups.join("") + optional + "</ul></nav>";
  }

  function boardRadios(id, legend, choices) {
    return (
      '<fieldset class="wb-vbar__group" id="' + id + '"><legend>' + esc(legend) + "</legend>" +
      choices.map(function (c, i) {
        var rid = id + "-" + c[0];
        return '<span class="wb-vbar__choice"><input' + attrs({ type: "radio", id: rid, name: id, value: c[0], checked: i === 0 }) + '><label for="' + rid + '">' + esc(c[1]) + "</label></span>";
      }).join("") + "</fieldset>"
    );
  }

  function boardBar() {
    return (
      '<header class="wb-vbar" aria-labelledby="b-bar-title"><h1 class="wb-vbar__title" id="b-bar-title">Prototype board · fictional data</h1>' +
      '<div class="wb-vbar__row">' + boardRadios("b-appearance", "Appearance", V.APPEARANCES) + boardRadios("b-text", "Text size", V.TEXTS) +
      '<p class="wb-vbar__note">Frames are pictures; use the links under each frame to open a page in the prototype.</p></div></header>'
    );
  }

  V.boardLinks = boardLinks;
  V.boardSectionParts = boardSectionParts;
  V.boardSection = boardSection;
  V.boardIndex = boardIndex;
  V.boardBar = boardBar;
})(typeof globalThis !== "undefined" ? globalThis : this);
