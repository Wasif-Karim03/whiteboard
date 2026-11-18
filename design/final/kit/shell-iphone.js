/* Whiteboard final kit: iPhone shell (planned native iOS presentation, about 393×852, no Safari chrome).
   Decorative status bar, nav bar (back link, title or course section menu with staff course tools, Search,
   Account menu with Help),
   content, bottom dock for page actions, tab bar with the five global items, home indicator.
   Every id is prefixed with opts.ns. */
(function (root) {
  "use strict";
  var WB = (root.WB = root.WB || {});
  var K = (WB.K = WB.K || {});
  var esc = WB.esc;

  function statusBar() {
    return '<div class="wb-statusbar" aria-hidden="true"><span class="wb-statusbar__time">9:41</span><span class="wb-statusbar__icons"></span></div>';
  }

  function homeIndicator() {
    return '<div class="wb-homeindicator" aria-hidden="true"></div>';
  }

  function menuButton(id, label, icon, iconOnly) {
    return K.button({ label: label, kind: "quiet", icon: icon, iconOnly: iconOnly, ariaLabel: iconOnly ? label : undefined, act: "toggle", target: id, controls: id, expanded: false });
  }

  // The title opens the course section menu when the course has sections or, for staff, course tools (M9).
  function title(ctx, o) {
    var tabs = o.course && o.course.tabs && o.course.tabs.length ? o.course.tabs : null;
    var tools = WB.staffTools(ctx, o);
    if (!tabs && !tools) return '<h1 class="wb-navbar__title">' + esc(o.title) + "</h1>";
    var id = WB.nsId(o, "sections");
    var btn = "<button" + WB.attrs({ type: "button", class: "wb-titlebtn", "aria-expanded": "false", "aria-controls": id, "data-act": "toggle", "data-target": id }) + ">" + esc(o.title) + K.icon("chev-d") + "</button>";
    var sections = tabs ? WB.linkList("shell", tabs, "Course sections", "wb-nav wb-nav--course") : "";
    var menu = "<div" + WB.attrs({ class: "wb-sectionmenu", id: id, hidden: true }) + ">" + sections + tools + "</div>";
    return '<h1 class="wb-navbar__title">' + btn + "</h1>" + menu;
  }

  function accountMenu(ctx, o) {
    var id = WB.nsId(o, "account");
    var items = [WB.NAV_UTILITY[2], WB.NAV_UTILITY[1]];
    var menu =
      "<div" + WB.attrs({ class: "wb-accountmenu", id: id, hidden: true }) + '><nav aria-label="Account and help"><ul>' +
      items.map(function (n) { return "<li>" + WB.navLink(o, n, "wb-navitem") + "</li>"; }).join("") + "</ul></nav>" + WB.roleTag(ctx, o) + "</div>";
    return menuButton(id, "Account", "person", true) + menu;
  }

  function app(ctx, o) {
    var navbar =
      '<header class="wb-navbar"><div class="wb-navbar__lead">' + WB.backLink(o, "wb-navbar__back") + "</div>" + title(ctx, o) +
      '<div class="wb-navbar__trail">' + WB.navLink(o, WB.NAV_UTILITY[0], "wb-iconlink", false) + accountMenu(ctx, o) + "</div></header>";
    return (
      navbar + '<main class="wb-main wb-main--iphone" id="' + esc(WB.nsId(o, "main")) + '">' + o.body + "</main>" +
      K.actions(ctx, o.actions || []) + WB.mainNav(o, "wb-tabitem", "wb-tabbar__list", "wb-tabbar", ctx.role)
    );
  }

  WB.shells.iphone = function (ctx, opts) {
    var mode = WB.shellOpts("shells.iphone", ctx, opts);
    var inner = mode === "access" ? WB.accessBody(opts) : app(ctx, opts);
    return '<div class="wb-frame wb-frame--iphone" data-mode="' + mode + '">' + statusBar() + '<div class="wb-iphone">' + inner + "</div>" + homeIndicator() + WB.overlays(opts) + "</div>";
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
