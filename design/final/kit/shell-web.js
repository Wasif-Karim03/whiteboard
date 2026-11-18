/* Whiteboard final kit: web shell. 1280 frame (regular) or 390 narrow frame (compact, BD1).
   Regular: sidebar, header with toolbar and utility links, course tabs. Compact: bottom bar plus a Menu
   disclosure holding course nav, staff tools and Search, Help, Account. Every id is prefixed with opts.ns. */
(function (root) {
  "use strict";
  var WB = (root.WB = root.WB || {});
  var K = (WB.K = WB.K || {});
  var esc = WB.esc;

  function header(ctx, o, extra) {
    return (
      '<header class="wb-header">' + WB.crumbs("shell", o.crumbs) + WB.backLink(o, "wb-backlink") +
      '<div class="wb-header__row"><h1 class="wb-header__title">' + esc(o.title) + "</h1>" + K.actions(ctx, o.actions || []) + (extra || "") + "</div></header>"
    );
  }

  function main(o) {
    return '<main class="wb-main" id="' + esc(WB.nsId(o, "main")) + '">' + o.body + "</main>";
  }

  function skip(o) {
    return '<a class="wb-skip" href="#' + esc(WB.nsId(o, "main")) + '">Skip to content</a>';
  }

  function regular(ctx, o) {
    var sidebar =
      '<aside class="wb-sidebar">' + K.logo({ size: "sm" }) + WB.mainNav(o, "wb-navitem", "wb-nav__list", "wb-nav", ctx.role) +
      WB.staffTools(ctx, o) + '<div class="wb-sidebar__foot">' + WB.roleTag(ctx, o) + "</div></aside>";
    var util = WB.utilityNav(o, "wb-utility--header");
    return (
      skip(o) + '<div class="wb-web">' + sidebar + '<div class="wb-web__content">' + header(ctx, o, util) + WB.courseTabs(o) + main(o) + "</div></div>"
    );
  }

  function compact(ctx, o) {
    var courseNav = o.course && o.course.tabs ? WB.linkList("shell", o.course.tabs, "Course sections", "wb-nav wb-nav--course") : "";
    var menu =
      '<details class="wb-menu" id="' + esc(WB.nsId(o, "menu")) + '"><summary class="wb-menu__summary">' + K.icon("menu") + "Menu</summary>" +
      '<div class="wb-menu__panel">' + courseNav + WB.staffTools(ctx, o) + WB.utilityNav(o, "wb-utility--menu") + WB.roleTag(ctx, o) + "</div></details>";
    var top = '<div class="wb-topbar">' + K.logo({ size: "sm", wordmark: false }) + menu + "</div>";
    return skip(o) + '<div class="wb-web wb-web--narrow">' + top + header(ctx, o) + main(o) + WB.mainNav(o, "wb-tabitem", "wb-bottombar__list", "wb-bottombar", ctx.role) + "</div>";
  }

  WB.shells.web = function (ctx, opts) {
    var mode = WB.shellOpts("shells.web", ctx, opts);
    var width = ctx.sizeClass === "compact" ? "narrow" : "regular";
    var inner = mode === "access" ? WB.accessBody(opts) : ctx.sizeClass === "compact" ? compact(ctx, opts) : regular(ctx, opts);
    return '<div class="wb-frame wb-frame--web" data-width="' + width + '" data-mode="' + mode + '">' + inner + WB.overlays(opts) + "</div>";
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
