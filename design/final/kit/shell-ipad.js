/* Whiteboard final kit: iPad shell (planned native iPadOS presentation, no Safari chrome).
   About 1194×834 landscape or 834×1194 portrait. Collapsible sidebar (collapsed behind a named toggle in
   portrait) with utility links in its footer, course tabs, and course tools in a Tools popover.
   Every id is prefixed with opts.ns. */
(function (root) {
  "use strict";
  var WB = (root.WB = root.WB || {});
  var K = (WB.K = WB.K || {});
  var esc = WB.esc;

  function toolsPopover(ctx, o) {
    if (!o.course || !o.course.tools || WB.STAFF.indexOf(ctx.role) < 0) return "";
    return (
      '<details class="wb-popover" id="' + esc(WB.nsId(o, "tools")) + '"><summary class="wb-popover__summary">' + K.icon("tool") + "Tools</summary>" +
      '<div class="wb-popover__panel">' + WB.linkList("shell", o.course.tools, "Course tools", "wb-nav wb-nav--tools") + "</div></details>"
    );
  }

  function app(ctx, o) {
    var open = ctx.orientation === "landscape";
    var sidebarId = WB.nsId(o, "sidebar");
    var toggle = K.button({
      id: WB.nsId(o, "sidebar-toggle"),
      label: open ? "Hide sidebar" : "Show sidebar",
      kind: "quiet",
      icon: "sidebar",
      iconOnly: true,
      ariaLabel: open ? "Hide sidebar" : "Show sidebar",
      act: "toggle",
      target: sidebarId,
      controls: sidebarId,
      expanded: open,
    });
    // Portrait only: the sidebar is an overlay, so it gets its own Hide button (the landscape sidebar has none).
    var close = open ? "" : '<div class="wb-sidebar__close">' + K.button({
      label: "Hide sidebar",
      kind: "quiet",
      icon: "x",
      iconOnly: true,
      ariaLabel: "Hide sidebar",
      act: "toggle",
      target: sidebarId,
      controls: sidebarId,
      expanded: true,
      id: WB.nsId(o, "sidebar-close"),
    }) + "</div>";
    var sidebar =
      "<aside" + WB.attrs({ class: "wb-sidebar wb-sidebar--ipad", id: sidebarId, hidden: !open }) + ">" + close + K.logo({ size: "sm" }) +
      WB.mainNav(o, "wb-navitem", "wb-nav__list", "wb-nav", ctx.role) + '<div class="wb-sidebar__foot">' + WB.utilityNav(o, "wb-utility--sidebar") + WB.roleTag(ctx, o) + "</div></aside>";
    var header =
      '<header class="wb-header wb-header--ipad">' + WB.crumbs("shell", o.crumbs) + WB.backLink(o, "wb-backlink") +
      '<div class="wb-header__row">' + toggle + '<h1 class="wb-header__title">' + esc(o.title) + "</h1>" + toolsPopover(ctx, o) + K.actions(ctx, o.actions || []) + "</div></header>";
    return (
      '<div class="wb-ipad">' + sidebar + '<div class="wb-ipad__content">' + header + WB.courseTabs(o) +
      '<main class="wb-main" id="' + esc(WB.nsId(o, "main")) + '">' + o.body + "</main></div></div>"
    );
  }

  WB.shells.ipad = function (ctx, opts) {
    var mode = WB.shellOpts("shells.ipad", ctx, opts);
    var inner = mode === "access" ? WB.accessBody(opts) : app(ctx, opts);
    return '<div class="wb-frame wb-frame--ipad" data-orientation="' + ctx.orientation + '" data-mode="' + mode + '">' + inner + WB.overlays(opts) + "</div>";
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
