/* Whiteboard final kit: adaptive components that change form by render context (plan §2 platform model),
   plus the shared pieces the three shells use. Switching is by ctx, never by media query. */
(function (root) {
  "use strict";
  var WB = (root.WB = root.WB || {});
  var K = (WB.K = WB.K || {});
  var esc = WB.esc;
  var attrs = WB.attrs;

  var DIALOG_KINDS = ["confirm", "form", "destructive", "capture"];

  function dialogVariant(ctx, o) {
    if (ctx.platform === "web") return "modal";
    if (ctx.platform === "ipad") return o.presentation === "popover" ? "popover" : "formsheet";
    return o.kind === "capture" ? "fullscreen" : "sheet";
  }

  // Modal on web, form sheet or popover on iPad, bottom sheet (full screen for capture) on iPhone.
  K.dialog = function (ctx, o) {
    WB.checkCtx("dialog", ctx);
    WB.need("dialog", o, ["title", "body"]);
    var id = WB.checkId("dialog", o.id);
    var kind = o.kind === undefined ? "confirm" : WB.oneOf("dialog", "kind", o.kind, DIALOG_KINDS);
    if (o.presentation !== undefined) WB.oneOf("dialog", "presentation", o.presentation, ["popover"]);
    if (o.actions !== undefined && !Array.isArray(o.actions)) WB.fail("dialog", "actions must be an array");
    if (o.cancelLabel !== undefined && (typeof o.cancelLabel !== "string" || !o.cancelLabel.trim())) WB.fail("dialog", "cancelLabel must be a non-empty string");
    var variant = dialogVariant(ctx, o);
    var actions = (o.actions || []).map(function (a) {
      WB.checkId("dialog", a.id);
      if (kind === "destructive" && (a.kind === undefined || a.kind === "primary")) return WB.renderAction("dialog", Object.assign({}, a, { kind: "danger" }));
      return WB.renderAction("dialog", a);
    });
    var close = K.button({ label: o.cancelLabel === undefined ? (kind === "capture" ? "Close" : "Cancel") : o.cancelLabel, kind: "secondary", act: "close-dialog", target: id });
    var hidden = o.open ? null : true;
    return (
      "<div" + attrs({ class: "wb-scrim", "data-dialog": id, hidden: hidden }) + "></div>" +
      "<div" + attrs({ class: "wb-dialog wb-dialog--" + variant + " wb-dialog--" + kind, id: id, role: "dialog", "aria-modal": "true", "aria-labelledby": id + "-title", "data-return-focus": true, hidden: hidden }) + ">" +
      (variant === "sheet" ? '<div class="wb-dialog__grabber" aria-hidden="true"></div>' : "") +
      '<div class="wb-dialog__head"><h2 class="wb-dialog__title" id="' + esc(id) + '-title">' + esc(o.title) + "</h2></div>" +
      '<div class="wb-dialog__body">' + o.body + "</div>" +
      '<div class="wb-dialog__actions">' + close + actions.join("") + "</div></div>"
    );
  };

  // ---------- Layout primitives (Phase 2 gate M6): pages lay out with these, never with style attributes ----------
  // Items are trusted HTML strings from kit calls; empty strings are dropped and anything else throws.
  function layoutItems(fn, items) {
    if (!Array.isArray(items)) WB.fail(fn, "items must be an array of HTML strings");
    items.forEach(function (x) { if (typeof x !== "string") WB.fail(fn, "every item must be an HTML string"); });
    return items.filter(function (x) { return x !== ""; });
  }

  // A vertical stack with a token gap (sm, md or lg).
  K.stack = function (ctx, o) {
    WB.checkCtx("stack", ctx);
    var gap = o.gap === undefined ? "md" : o.gap;
    WB.oneOf("stack", "gap", gap, ["sm", "md", "lg"]);
    return '<div class="wb-stack wb-stack--' + gap + '">' + layoutItems("stack", o.items).join("") + "</div>";
  };

  // A grid of cols columns when regular and compactCols when compact.
  K.grid = function (ctx, o) {
    WB.checkCtx("grid", ctx);
    var cols = o.cols === undefined ? 3 : o.cols;
    var compact = o.compactCols === undefined ? 1 : o.compactCols;
    WB.oneOf("grid", "cols", cols, [2, 3, 4]);
    WB.oneOf("grid", "compactCols", compact, [1, 2]);
    var n = ctx.sizeClass === "regular" ? cols : compact;
    return '<div class="wb-grid wb-grid--c' + n + '">' + layoutItems("grid", o.items).map(function (x) { return '<div class="wb-grid__cell">' + x + "</div>"; }).join("") + "</div>";
  };

  // Main content with a labelled side rail: side by side when regular (main first); stacked when compact,
  // with the rail first when railFirst.
  K.rail = function (ctx, o) {
    WB.checkCtx("rail", ctx);
    WB.need("rail", o, ["main", "rail", "railLabel"]);
    layoutItems("rail", [o.main, o.rail]);
    var main = '<div class="wb-rail__main">' + o.main + "</div>";
    var aside = '<aside class="wb-rail__aside" aria-label="' + esc(o.railLabel) + '">' + o.rail + "</aside>";
    if (ctx.sizeClass === "regular") return '<div class="wb-rail wb-rail--side">' + main + aside + "</div>";
    return '<div class="wb-rail wb-rail--stacked">' + (o.railFirst ? aside + main : main + aside) + "</div>";
  };

  // Two columns (web) or split view (iPad landscape) when regular; push navigation, one pane, when compact.
  K.split = function (ctx, o) {
    WB.checkCtx("split", ctx);
    WB.need("split", o, ["listLabel", "detailLabel", "list", "detail"]);
    var id = WB.checkId("split", o.id);
    function pane(which, label, html, extra) {
      return (
        '<section class="wb-split__pane wb-split__pane--' + which + '" aria-labelledby="' + esc(id) + "-" + which + '-title">' + (extra || "") +
        '<h2 class="wb-split__title" id="' + esc(id) + "-" + which + '-title">' + esc(label) + "</h2>" + html + "</section>"
      );
    }
    if (ctx.sizeClass === "regular") {
      var mode = ctx.platform === "ipad" ? "splitview" : "columns";
      return '<div class="wb-split wb-split--' + mode + '" id="' + esc(id) + '">' + pane("list", o.listLabel, o.list) + pane("detail", o.detailLabel, o.detail) + "</div>";
    }
    var body = o.selected
      ? pane("detail", o.detailLabel, o.detail, K.button({ label: "Back to " + o.listLabel, kind: "quiet", icon: "chev-l", act: "back" }))
      : pane("list", o.listLabel, o.list);
    return '<div class="wb-split wb-split--push" id="' + esc(id) + '">' + body + "</div>";
  };

  function cell(row, key) {
    if (!row.cells || !Object.prototype.hasOwnProperty.call(row.cells, key)) WB.fail("table", "row '" + row.id + "' has no cell '" + key + "'");
    return String(row.cells[key]);
  }
  function primaryHtml(row, key) {
    var html = cell(row, key);
    return row.go ? '<a class="wb-link" href="' + WB.goHref(row.go, "table") + '" data-go="' + esc(row.go) + '">' + html + "</a>" : html;
  }
  function sortText(col, dir) {
    var labels = col.sortLabels || { asc: "ascending", desc: "descending" };
    return col.label + ", " + labels[dir];
  }

  function regularTable(id, o, cols, primary) {
    var head = cols.map(function (c) {
      var cls = c.numeric ? ' class="wb-table__num"' : "";
      if (!c.sortable) return '<th scope="col"' + cls + ">" + esc(c.label) + "</th>";
      var current = o.sort && o.sort.key === c.key;
      var ariaSort = current ? (o.sort.dir === "desc" ? "descending" : "ascending") : "none";
      var btn = "<button" + attrs({ type: "button", class: "wb-sortbtn", "data-act": "sort", "data-target": id, "data-key": c.key }) + ">" + esc(c.label) + K.icon("sort") + "</button>";
      return '<th scope="col" aria-sort="' + ariaSort + '"' + cls + ">" + btn + "</th>";
    });
    var body = o.rows.map(function (r) {
      var sel = o.selectedId !== undefined && r.id === o.selectedId;
      return (
        "<tr" + attrs({ class: sel ? "is-selected" : null, "aria-current": sel ? "true" : null }) + ">" +
        cols.map(function (c) {
          if (c.key === primary.key) return '<th scope="row">' + primaryHtml(r, c.key) + "</th>";
          return "<td" + (c.numeric ? ' class="wb-table__num"' : "") + ">" + cell(r, c.key) + "</td>";
        }).join("") +
        "</tr>"
      );
    });
    return (
      '<div class="wb-table-wrap"><table class="wb-table" id="' + esc(id) + '"><caption>' + esc(o.caption) + "</caption><thead><tr>" + head.join("") +
      "</tr></thead><tbody>" + body.join("") + "</tbody></table></div>"
    );
  }

  // A-R10: compact tables keep a labelled sort control above the row-cards.
  function sortControl(id, o, cols) {
    var sortable = cols.filter(function (c) { return c.sortable; });
    if (!sortable.length) return "";
    var options = [];
    sortable.forEach(function (c) {
      ["asc", "desc"].forEach(function (dir) {
        var selected = Boolean(o.sort && o.sort.key === c.key && (o.sort.dir || "asc") === dir);
        options.push("<option" + attrs({ value: c.key + ":" + dir, selected: selected }) + ">" + esc(sortText(c, dir)) + "</option>");
      });
    });
    return (
      '<div class="wb-field wb-sort"><label class="wb-field__label" for="' + esc(id) + '-sort">Sort by</label>' +
      "<select" + attrs({ class: "wb-select", id: id + "-sort", "data-act": "sort", "data-target": id }) + ">" + options.join("") + "</select></div>"
    );
  }

  function compactTable(id, o, cols, primary) {
    var others = cols.filter(function (c) { return c.key !== primary.key; });
    var cards = o.rows.map(function (r) {
      var sel = o.selectedId !== undefined && r.id === o.selectedId;
      return (
        "<li" + attrs({ class: "wb-rowcard" + (sel ? " is-selected" : ""), "aria-current": sel ? "true" : null }) + '><p class="wb-rowcard__title">' + primaryHtml(r, primary.key) + "</p>" +
        '<dl class="wb-rowcard__fields">' + others.map(function (c) { return '<div class="wb-kv__row"><dt>' + esc(c.label) + "</dt><dd>" + cell(r, c.key) + "</dd></div>"; }).join("") + "</dl></li>"
      );
    });
    return sortControl(id, o, cols) + '<ul class="wb-rowcards" id="' + esc(id) + '" aria-label="' + esc(o.caption) + '">' + cards.join("") + "</ul>";
  }

  // <table> when regular; labelled row-cards when compact; K.empty when there are no rows.
  K.table = function (ctx, o) {
    WB.checkCtx("table", ctx);
    WB.need("table", o, ["caption", "empty"]);
    var id = WB.checkId("table", o.id);
    if (!Array.isArray(o.columns) || !o.columns.length) WB.fail("table", "columns must be a non-empty array");
    if (!Array.isArray(o.rows)) WB.fail("table", "rows must be an array");
    o.columns.forEach(function (c) { WB.need("table", c, ["key", "label"]); });
    var primaries = o.columns.filter(function (c) { return c.primary; });
    if (primaries.length > 1) WB.fail("table", "only one column may be primary");
    var primary = primaries[0] || o.columns[0];
    if (o.sort !== undefined) {
      if (!o.columns.some(function (c) { return c.sortable && c.key === o.sort.key; })) WB.fail("table", "sort key must be a sortable column");
      if (o.sort.dir !== undefined) WB.oneOf("table", "sort dir", o.sort.dir, ["asc", "desc"]);
    }
    if (!o.rows.length) return K.empty(o.empty);
    return ctx.sizeClass === "regular" ? regularTable(id, o, o.columns, primary) : compactTable(id, o, o.columns, primary);
  };

  K.actionsPlacement = function (ctx) {
    WB.checkCtx("actionsPlacement", ctx);
    return ctx.platform === "iphone" ? "dock" : "header";
  };

  // Header toolbar on web and iPad; bottom dock on iPhone with one primary, at most one secondary,
  // and the rest under "More actions".
  K.actions = function (ctx, actions, opts) {
    WB.checkCtx("actions", ctx);
    if (!Array.isArray(actions)) WB.fail("actions", "actions must be an array");
    if (!actions.length) return "";
    var label = (opts && opts.label) || "Page actions";
    if (K.actionsPlacement(ctx) === "header") return '<div class="wb-toolbar" role="toolbar" aria-label="' + esc(label) + '">' + WB.renderActions("actions", actions) + "</div>";
    var pIndex = actions.findIndex(function (a) { return a.kind === "primary"; });
    if (pIndex < 0) pIndex = 0;
    var rest = actions.filter(function (_, i) { return i !== pIndex; });
    var shown = [actions[pIndex]].concat(rest.slice(0, 1));
    var more = rest.slice(1);
    var menu = more.length
      ? '<details class="wb-more"><summary class="wb-more__summary">' + K.icon("more") + "More actions</summary><div class=\"wb-more__menu\">" + WB.renderActions("actions", more) + "</div></details>"
      : "";
    return '<div class="wb-dock" role="group" aria-label="' + esc(label) + '">' + WB.renderActions("actions", shown) + menu + "</div>";
  };

  // BD6 / BD11: review and handoff tiers show the last result, protective actions and a larger-screen pointer.
  K.handoff = function (ctx, o) {
    WB.checkCtx("handoff", ctx);
    if (ctx.tier === "full") WB.fail("handoff", "only for the review and handoff tiers");
    WB.need("handoff", o, ["title"]);
    var protective = o.protectiveActions && o.protectiveActions.length && ctx.tier === "review" ? K.actions(ctx, o.protectiveActions, { label: "Protective actions" }) : "";
    return (
      '<section class="wb-handoff wb-handoff--' + ctx.tier + '" aria-label="' + esc(o.title) + '"><p class="wb-handoff__title">' + K.icon("screen") + esc(o.title) + "</p>" +
      (o.lastResult ? '<div class="wb-handoff__result">' + o.lastResult + "</div>" : "") +
      (o.note ? '<p class="wb-handoff__note">' + esc(o.note) + "</p>" : "") + protective +
      '<p class="wb-handoff__hint">Open on a larger screen to edit this page.</p></section>'
    );
  };

  K.shell = function (ctx, opts) {
    WB.checkCtx("shell", ctx);
    var render = WB.shells[ctx.platform];
    if (typeof render !== "function") WB.fail("shell", "no shell registered for '" + ctx.platform + "'");
    return render(ctx, opts);
  };

  // ---------- Shared shell pieces ----------
  var NAV_IDS = WB.NAV_GLOBAL.concat(WB.NAV_UTILITY).map(function (n) { return n.id; });

  WB.shellOpts = function (fn, ctx, o) {
    WB.checkCtx(fn, ctx);
    WB.need(fn, o, ["ns", "title", "body"]);
    if (!/^[A-Za-z][\w-]*$/.test(o.ns)) WB.fail(fn, "ns must be an id-safe namespace");
    var mode = o.mode === undefined ? "app" : WB.oneOf(fn, "mode", o.mode, ["app", "access"]);
    if (mode === "app") {
      if (!o.hrefs || typeof o.hrefs !== "object") WB.fail(fn, "app mode requires opts.hrefs for every nav item");
      NAV_IDS.forEach(function (id) { WB.safeHref(o.hrefs[id], fn + " hrefs." + id); });
      if (o.navActive !== undefined && o.navActive !== null) WB.oneOf(fn, "navActive", o.navActive, NAV_IDS);
    }
    if (o.course !== undefined) {
      WB.need(fn, o.course, ["key", "code", "title"]);
      WB.checkCourse(fn, o.course.key);
    }
    return mode;
  };

  WB.nsId = function (o, part) { return o.ns + "-" + part; };

  // One nav link with data-nav and aria-current. variant picks the class (navitem, tabbar, utility).
  WB.navLink = function (o, item, cls, showLabel) {
    var current = o.navActive === item.id;
    var label = showLabel === false ? '<span class="wb-sr">' + esc(item.label) + "</span>" : '<span class="wb-navitem__label">' + esc(item.label) + "</span>";
    return "<a" + attrs({ class: cls, href: WB.safeHref(o.hrefs[item.id], "shell"), "data-nav": item.id, "aria-current": current ? "page" : null }) + ">" + K.icon(item.icon) + label + "</a>";
  };

  WB.navList = function (o, items, cls, listCls) {
    return '<ul class="' + listCls + '">' + items.map(function (n) { return "<li>" + WB.navLink(o, n, cls) + "</li>"; }).join("") + "</ul>";
  };

  WB.mainNav = function (o, cls, listCls, navCls, role) {
    var labels = role === "instructor" ? { today: "Teaching", courses: "My courses" } : role === "ta" ? { today: "My grading", courses: "My courses" } : {};
    var items = WB.NAV_GLOBAL.map(function (item) { return labels[item.id] ? Object.assign({}, item, { label: labels[item.id] }) : item; });
    return '<nav class="' + navCls + '" aria-label="Main">' + WB.navList(o, items, cls, listCls) + "</nav>";
  };

  WB.utilityNav = function (o, cls) {
    return '<nav class="wb-utility' + (cls ? " " + cls : "") + '" aria-label="Utility">' + WB.navList(o, WB.NAV_UTILITY, "wb-navitem wb-navitem--utility", "wb-utility__list") + "</nav>";
  };

  WB.courseTabs = function (o) {
    if (!o.course || !o.course.tabs || !o.course.tabs.length) return "";
    var primary = ["overview", "coursework", "calendar", "grades", "builder", "grading", "gradebook"];
    var core = o.course.tabs.filter(function (t) { return primary.indexOf(t.id) >= 0; });
    var other = o.course.tabs.filter(function (t) { return primary.indexOf(t.id) < 0; });
    var active = other.filter(function (t) { return t.current; })[0];
    var more = other.length ? '<details class="wb-course-more" id="' + esc(WB.nsId(o, "course-more")) + '"><summary' + attrs({ class: active ? "is-current" : null, "aria-label": (active ? active.label + ", " : "") + "More course sections" }) + '>' + esc(active ? active.label : "More") + K.icon("chev-d") + '</summary>' + WB.linkList("shell", other, "More course sections", "wb-course-more__list") + '</details>' : "";
    return '<div class="wb-course-navigation">' + (core.length ? K.tabs({ label: "Course sections", items: core }) : "") + more + '</div>';
  };

  WB.linkList = function (fn, items, label, cls) {
    if (!items || !items.length) return "";
    return (
      '<nav class="' + cls + '" aria-label="' + esc(label) + '"><ul>' +
      items.map(function (t) {
        WB.need(fn, t, ["label"]);
        var a = WB.navAttrs(fn, t);
        return "<li><a" + attrs({ class: "wb-navitem", href: a.href, "data-go": a["data-go"], "aria-current": t.current ? "page" : null }) + ">" + esc(t.label) + "</a></li>";
      }).join("") +
      "</ul></nav>"
    );
  };

  WB.staffTools = function (ctx, o) {
    if (!o.course || !o.course.tools || WB.STAFF.indexOf(ctx.role) < 0) return "";
    var links = WB.linkList("shell", o.course.tools, "Course tools", "wb-nav wb-nav--tools");
    if (ctx.sizeClass === "compact" || !links) return links;
    var active = o.course.tools.filter(function (t) { return t.current; })[0];
    return '<div class="wb-tool-disclosure">' + K.disclosure({ id: WB.nsId(o, "course-tools"), summary: active ? "Course tools · " + active.label : "Course tools", body: links }) + '</div>';
  };

  WB.backLink = function (o, cls) {
    if (!o.back) return "";
    WB.need("shell", o.back, ["label", "go"]);
    return '<a class="' + cls + '" href="' + WB.goHref(o.back.go, "shell") + '" data-go="' + esc(o.back.go) + '">' + K.icon("chev-l") + esc(o.back.label) + "</a>";
  };

  WB.roleTag = function (ctx, o) {
    return '<span class="wb-roletag">' + esc(o.roleLabel || WB.ROLE_LABELS[ctx.role]) + "</span>";
  };

  // Access mode (A-R7): frame, logo, title, body and safe help and recovery links only.
  WB.accessBody = function (o) {
    return (
      '<div class="wb-access">' + K.logo({ size: "lg" }) + '<main class="wb-main wb-access__main"><h1 class="wb-access__title">' + esc(o.title) + "</h1>" + o.body + "</main>" +
      WB.linkList("shell", o.links, "Help and recovery", "wb-access__links") + "</div>"
    );
  };

  WB.overlays = function (o) {
    return (o.dialog || "") + (o.toast ? '<div class="wb-toastwrap">' + o.toast + "</div>" : "");
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
