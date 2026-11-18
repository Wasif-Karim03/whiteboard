/* Whiteboard final kit: core components. All return HTML strings.
   Escaped: label, title, text, caption, reason, value, ariaLabel (and other plain-text fields).
   Trusted HTML from other K calls: body, html, list, detail, cells.*, leading, trailing, footer. */
(function (root) {
  "use strict";
  var WB = (root.WB = root.WB || {});
  var K = (WB.K = WB.K || {});
  var esc = WB.esc;
  var attrs = WB.attrs;

  var KINDS = ["primary", "secondary", "quiet", "danger"];
  var TONE_ICON = { accent: "info", success: "check-circle", warning: "alert", error: "alert", info: "info", neutral: "info" };
  var NEEDS_TARGET = ["open-dialog", "toggle", "sort"];

  function tone(fn, t) { return WB.oneOf(fn, "tone", t, WB.TONES); }
  function nav(fn, o) {
    if (o.go) return { href: WB.goHref(o.go, fn), "data-go": o.go };
    if (o.href) return { href: WB.safeHref(o.href, fn) };
    return WB.fail(fn, "a go target or href is required");
  }
  WB.navAttrs = nav;
  function headingTag(fn, level) {
    if ([2, 3, 4].indexOf(level) < 0) WB.fail(fn, "level must be 2, 3 or 4");
    return "h" + level;
  }
  // An action-list item is an action (K.button options) or a destination (go or href), which renders as a
  // button-styled <a href> so copy-link and modified clicks stay native (A-R8).
  function destination(fn, o) {
    var kind = o.kind === undefined ? "secondary" : WB.oneOf(fn, "kind", o.kind, KINDS);
    if (o.iconOnly && (!o.ariaLabel || !o.icon)) WB.fail(fn, "iconOnly requires icon and ariaLabel");
    if (!o.iconOnly) WB.need(fn, o, ["label"]);
    if (o.disabled || o.act !== undefined) WB.fail(fn, "a destination (go or href) cannot be disabled or carry act");
    if (o.id !== undefined) WB.checkId(fn, o.id);
    var a = nav(fn, o);
    var cls = "wb-btn wb-btn--" + kind + (o.iconOnly ? " wb-iconbtn" : "");
    var inner = (o.icon ? K.icon(o.icon) : "") + (o.iconOnly ? "" : '<span class="wb-btn__label">' + esc(o.label) + "</span>");
    return "<a" + attrs({ class: cls, id: o.id, href: a.href, "data-go": a["data-go"], "aria-label": o.ariaLabel, "data-note": o.note }) + ">" + inner + "</a>";
  }
  function actionItem(fn, o) {
    if (!o || typeof o !== "object") WB.fail(fn, "each action needs an options object");
    return o.go !== undefined || o.href !== undefined ? destination(fn, o) : K.button(o);
  }
  WB.renderAction = actionItem;
  function buttons(fn, list) {
    if (list === undefined || list === null) return "";
    if (!Array.isArray(list)) WB.fail(fn, "actions must be an array of action or destination options");
    return list.map(function (b) { return actionItem(fn, b); }).join("");
  }
  WB.renderActions = buttons;

  // A real <button type="button"> for actions only. disabled needs a visible reason (UX rule 8) and an id for it.
  K.button = function (o) {
    if (!o || typeof o !== "object") WB.fail("button", "options object is required");
    if (o.go !== undefined || o.href !== undefined) WB.fail("button", "go and href are navigation; use K.link (or a destination in an action list)");
    var kind = o.kind === undefined ? "secondary" : WB.oneOf("button", "kind", o.kind, KINDS);
    if (o.iconOnly && (!o.ariaLabel || !o.icon)) WB.fail("button", "iconOnly requires icon and ariaLabel");
    if (!o.iconOnly) WB.need("button", o, ["label"]);
    if (o.act !== undefined) WB.oneOf("button", "act", o.act, WB.ACTS);
    if (NEEDS_TARGET.indexOf(o.act) >= 0 && !o.target) WB.fail("button", "act '" + o.act + "' requires target");
    if (o.disabled) {
      if (!o.reason) WB.fail("button", "disabled requires a reason");
      WB.checkId("button", o.id);
    } else if (o.id !== undefined) {
      WB.checkId("button", o.id);
    }
    var reasonId = o.disabled ? o.id + "-reason" : null;
    var cls = "wb-btn wb-btn--" + kind + (o.iconOnly ? " wb-iconbtn" : "");
    var a = attrs({
      type: "button",
      class: cls,
      id: o.id,
      "aria-label": o.ariaLabel,
      "aria-disabled": o.disabled ? "true" : null,
      "aria-describedby": reasonId,
      "aria-expanded": o.expanded === undefined ? null : String(Boolean(o.expanded)),
      "aria-controls": o.controls,
      "data-act": o.act,
      "data-target": o.target,
      "data-note": o.note,
    });
    var inner = (o.icon ? K.icon(o.icon) : "") + (o.iconOnly ? "" : '<span class="wb-btn__label">' + esc(o.label) + "</span>");
    var btn = "<button" + a + ">" + inner + "</button>";
    if (!o.disabled) return btn;
    return '<span class="wb-btnwrap">' + btn + '<span class="wb-btn__reason" id="' + esc(reasonId) + '">' + esc(o.reason) + "</span></span>";
  };

  // Navigation is always a link (A-R8). go renders the viewer route "#/<go>".
  K.link = function (o) {
    WB.need("link", o, ["label"]);
    var a = nav("link", o);
    return "<a" + attrs({ class: "wb-link", href: a.href, "data-go": a["data-go"], "aria-current": o.current ? "page" : null }) + ">" + (o.icon ? K.icon(o.icon) : "") + esc(o.label) + "</a>";
  };

  function lateChip() {
    return '<span class="wb-status__late">' + K.icon(WB.STATUS.late.icon) + WB.STATUS.late.label + "</span>";
  }

  // Work status: text plus icon plus tone (UX rule 1). Throws when the ctx role may not see it (BD39).
  K.status = function (key, ctx, opts) {
    WB.checkCtx("status", ctx);
    var s = WB.STATUS[key];
    if (!s) WB.fail("status", "unknown status key '" + key + "'");
    if (s.modifier) WB.fail("status", "'" + key + "' is a modifier; pass late: true with Received");
    var o = opts || {};
    if (!WB.statusVisible(key, ctx.role, o)) WB.fail("status", "'" + key + "' is not visible to " + ctx.role);
    if (o.late && key !== "received" && key !== "receivedNotReleased") WB.fail("status", "late is allowed only with Received");
    return (
      '<span class="wb-status wb-status--' + s.tone + '">' + K.icon(s.icon) + '<span class="wb-status__label">' + esc(s.label) + "</span>" +
      (o.late ? lateChip() : "") + (o.detail ? '<span class="wb-status__detail">' + o.detail + "</span>" : "") + "</span>"
    );
  };

  K.flag = function (key) {
    var f = WB.FLAGS[key];
    if (!f) WB.fail("flag", "unknown flag '" + key + "'");
    return '<span class="wb-flag wb-flag--' + f.tone + '">' + K.icon(f.icon) + esc(f.label) + "</span>";
  };

  // Counts and labels that are not work statuses.
  K.badge = function (o) {
    WB.need("badge", o, ["label", "tone"]);
    return '<span class="wb-badge wb-badge--' + tone("badge", o.tone) + '">' + (o.icon ? K.icon(o.icon) : "") + esc(o.label) + "</span>";
  };

  K.notice = function (o) {
    WB.need("notice", o, ["tone", "title"]);
    var t = tone("notice", o.tone);
    return (
      '<div class="wb-notice wb-notice--' + t + '" role="' + (t === "error" ? "alert" : "status") + '">' + K.icon(o.icon || TONE_ICON[t]) +
      '<div class="wb-notice__content"><p class="wb-notice__title">' + esc(o.title) + "</p>" +
      (o.body ? '<div class="wb-notice__body">' + o.body + "</div>" : "") +
      (o.actions && o.actions.length ? '<div class="wb-notice__actions">' + buttons("notice", o.actions) + "</div>" : "") +
      "</div></div>"
    );
  };

  K.card = function (o) {
    WB.need("card", o, ["body"]);
    var h = headingTag("card", o.level === undefined ? 2 : o.level);
    var title = "";
    if (o.title) {
      var inner = o.go ? '<a class="wb-card__link" href="' + WB.goHref(o.go, "card") + '" data-go="' + esc(o.go) + '">' + esc(o.title) + "</a>" : esc(o.title);
      title = "<" + h + ' class="wb-card__title">' + inner + "</" + h + ">";
    } else if (o.go) {
      WB.fail("card", "go requires a title for the link name");
    }
    return '<article class="wb-card">' + title + '<div class="wb-card__body">' + o.body + "</div>" + (o.footer ? '<div class="wb-card__footer">' + o.footer + "</div>" : "") + "</article>";
  };

  K.section = function (o) {
    WB.need("section", o, ["title", "body"]);
    var h = headingTag("section", o.level === undefined ? 2 : o.level);
    var acts = o.actions && o.actions.length ? '<div class="wb-section__actions">' + buttons("section", o.actions) + "</div>" : "";
    return '<section class="wb-section"><div class="wb-section__head"><' + h + ' class="wb-section__title">' + esc(o.title) + "</" + h + ">" + acts + "</div>" + o.body + "</section>";
  };

  K.list = function (o) {
    WB.need("list", o, ["label"]);
    if (!Array.isArray(o.items)) WB.fail("list", "items must be an array");
    var rows = o.items.map(function (it) {
      WB.need("list", it, ["title"]);
      var inner =
        (it.leading ? '<span class="wb-row__leading">' + it.leading + "</span>" : "") +
        '<span class="wb-row__text"><span class="wb-row__title">' + esc(it.title) + "</span>" + (it.meta ? '<span class="wb-row__meta">' + esc(it.meta) + "</span>" : "") + "</span>" +
        (it.trailing ? '<span class="wb-row__trailing">' + it.trailing + "</span>" : "");
      if (!it.go && !it.href) return '<li class="wb-row">' + inner + "</li>";
      var a = nav("list", it);
      return '<li class="wb-row"><a' + attrs({ class: "wb-rowlink", href: a.href, "data-go": a["data-go"] }) + ">" + inner + K.icon("chev-r") + "</a></li>";
    });
    return '<ul class="wb-list" aria-label="' + esc(o.label) + '">' + rows.join("") + "</ul>";
  };

  K.kv = function (items) {
    if (!Array.isArray(items) || !items.length) WB.fail("kv", "items must be a non-empty array");
    return (
      '<dl class="wb-kv">' +
      items.map(function (it) {
        WB.need("kv", it, ["label", "value"]);
        return '<div class="wb-kv__row"><dt>' + esc(it.label) + "</dt><dd>" + esc(it.value) + "</dd></div>";
      }).join("") +
      "</dl>"
    );
  };

  K.tabs = function (o) {
    WB.need("tabs", o, ["label"]);
    if (!Array.isArray(o.items) || !o.items.length) WB.fail("tabs", "items must be a non-empty array");
    var lis = o.items.map(function (it) {
      WB.need("tabs", it, ["id", "label"]);
      var a = nav("tabs", it);
      return "<li><a" + attrs({ class: "wb-tab", href: a.href, "data-go": a["data-go"], "aria-current": it.current ? "page" : null }) + ">" + esc(it.label) + "</a></li>";
    });
    return '<nav class="wb-tabs" aria-label="' + esc(o.label) + '"><ul class="wb-tabs__list">' + lis.join("") + "</ul></nav>";
  };

  K.segmented = function (o) {
    WB.need("segmented", o, ["label", "name"]);
    if (!Array.isArray(o.options) || o.options.length < 2) WB.fail("segmented", "options needs at least two entries");
    var opts = o.options.map(function (op) {
      WB.need("segmented", op, ["value", "label"]);
      return "<button" + attrs({ type: "button", class: "wb-seg__opt", "aria-pressed": op.selected ? "true" : "false", "data-name": o.name, "data-value": op.value }) + ">" + esc(op.label) + "</button>";
    });
    return '<div class="wb-seg" role="group" aria-label="' + esc(o.label) + '">' + opts.join("") + "</div>";
  };

  K.chips = function (o) {
    WB.need("chips", o, ["label"]);
    if (!Array.isArray(o.items)) WB.fail("chips", "items must be an array");
    return (
      '<ul class="wb-chips" aria-label="' + esc(o.label) + '">' +
      o.items.map(function (c) {
        WB.need("chips", c, ["label"]);
        var t = c.tone === undefined ? "neutral" : tone("chips", c.tone);
        return '<li class="wb-chip wb-chip--' + t + '">' + (c.icon ? K.icon(c.icon) : "") + esc(c.label) + "</li>";
      }).join("") +
      "</ul>"
    );
  };

  K.avatar = function (o) {
    WB.need("avatar", o, ["name"]);
    var initials = String(o.name).trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join("");
    return '<span class="wb-avatar" role="img" aria-label="' + esc(o.name) + '">' + esc(initials) + "</span>";
  };

  K.empty = function (o) {
    WB.need("empty", o, ["title"]);
    return (
      '<div class="wb-empty">' + K.icon(o.icon || "folder") + '<p class="wb-empty__title">' + esc(o.title) + "</p>" +
      (o.body ? '<div class="wb-empty__body">' + o.body + "</div>" : "") + (o.action ? WB.renderAction("empty", o.action) : "") + "</div>"
    );
  };

  function finite(fn, name, n) {
    if (typeof n !== "number" || !isFinite(n)) WB.fail(fn, name + " must be a finite number");
    return n;
  }

  K.progress = function (o) {
    WB.need("progress", o, ["label"]);
    var max = finite("progress", "max", o.max);
    var value = finite("progress", "value", o.value);
    if (max <= 0 || value < 0 || value > max) WB.fail("progress", "value must be within 0..max and max above 0");
    var pct = Math.round((value / max) * 100);
    return (
      '<div class="wb-progress"><div class="wb-progress__head"><span class="wb-progress__label">' + esc(o.label) + '</span><span class="wb-progress__value">' +
      esc(value + " of " + max) + "</span></div>" +
      "<div" + attrs({ class: "wb-progress__track", role: "progressbar", "aria-label": o.label, "aria-valuemin": "0", "aria-valuemax": String(max), "aria-valuenow": String(value) }) + ">" +
      '<span class="wb-progress__bar" style="width:' + pct + '%"></span></div></div>'
    );
  };

  K.stat = function (o) {
    WB.need("stat", o, ["label", "value"]);
    return '<div class="wb-stat"><span class="wb-stat__label">' + esc(o.label) + '</span><span class="wb-stat__value">' + esc(o.value) + "</span>" + (o.note ? '<span class="wb-stat__note">' + esc(o.note) + "</span>" : "") + "</div>";
  };

  K.disclosure = function (o) {
    WB.need("disclosure", o, ["summary", "body"]);
    WB.checkId("disclosure", o.id);
    return "<details" + attrs({ class: "wb-disclosure", id: o.id, open: Boolean(o.open) }) + '><summary class="wb-disclosure__summary">' + esc(o.summary) + '</summary><div class="wb-disclosure__body">' + o.body + "</div></details>";
  };

  K.toast = function (o) {
    WB.need("toast", o, ["text"]);
    return '<div class="wb-toast" role="status"><span class="wb-toast__text">' + esc(o.text) + "</span>" + (o.action ? WB.renderAction("toast", Object.assign({ kind: "quiet" }, o.action)) : "") + "</div>";
  };

  // Rule 8: say who owns a locked thing and offer "Request change" instead of a dead control.
  K.lockedNote = function (o) {
    WB.need("lockedNote", o, ["owner", "reason"]);
    var req = o.requestGo ? '<a class="wb-link" href="' + WB.goHref(o.requestGo, "lockedNote") + '" data-go="' + esc(o.requestGo) + '">Request change</a>' : "";
    return '<div class="wb-locked">' + K.icon("lock") + '<div class="wb-locked__content"><p class="wb-locked__reason">' + esc(o.reason) + '</p><p class="wb-locked__owner">Managed by ' + esc(o.owner) + "</p>" + req + "</div></div>";
  };

  // ---------- Forms ----------
  var FIELD_TYPES = ["text", "email", "password", "number", "date", "time", "textarea", "select", "checkbox", "toggle"];
  // Autocomplete hints by input type, as [type, hint] pairs.
  var AUTOCOMPLETE = [["email", "email"], ["password", "current-password"]];
  function autocompleteFor(type) {
    var hit = AUTOCOMPLETE.filter(function (p) { return p[0] === type; })[0];
    return hit ? hit[1] : null;
  }

  function hints(id, o) {
    var help = o.help ? '<p class="wb-field__help" id="' + esc(id) + '-help">' + esc(o.help) + "</p>" : "";
    var reason = o.disabled ? '<p class="wb-field__help" id="' + esc(id) + '-reason">' + K.icon("lock") + esc(o.reason) + "</p>" : "";
    var error = o.error ? '<p class="wb-field__error" id="' + esc(id) + '-error">' + K.icon("alert") + esc(o.error) + "</p>" : "";
    var ids = [o.help ? id + "-help" : null, o.disabled ? id + "-reason" : null, o.error ? id + "-error" : null].filter(Boolean);
    return { html: help + reason + error, describedby: ids.length ? ids.join(" ") : null };
  }
  function labelText(o) {
    return esc(o.label) + (o.required ? '<span class="wb-field__req"> (required)</span>' : "");
  }

  // Each option needs a non-empty label and a string or number value. "" is allowed for a placeholder; values must be distinct.
  function checkSelectOptions(options) {
    var seen = new Set();
    options.forEach(function (op) {
      if (!op || typeof op !== "object") WB.fail("field", "each select option needs a value and a label");
      if (typeof op.label !== "string" || op.label === "") WB.fail("field", "select option label must be a non-empty string");
      if (typeof op.value !== "string" && typeof op.value !== "number") WB.fail("field", "select option value must be a string or number");
      if (seen.has(String(op.value))) WB.fail("field", "duplicate select option value '" + op.value + "'");
      seen.add(String(op.value));
    });
  }

  // Every control has a real <label for>; help, reason and error are tied in by aria-describedby.
  K.field = function (o) {
    WB.need("field", o, ["label"]);
    var id = WB.checkId("field", o.id);
    var type = o.type === undefined ? "text" : o.type;
    if (type === "radio") WB.fail("field", "use K.choiceGroup for radio options");
    WB.oneOf("field", "type", type, FIELD_TYPES);
    if (o.disabled && !o.reason) WB.fail("field", "disabled requires a reason");
    var bounds = {};
    ["min", "max", "step"].forEach(function (key) {
      if (o[key] === undefined) return;
      if (type !== "number") WB.fail("field", key + " is only supported for number fields");
      bounds[key] = finite("field", key, o[key]);
    });
    if (bounds.min !== undefined && bounds.max !== undefined && bounds.min > bounds.max) WB.fail("field", "min must not exceed max");
    if (bounds.step !== undefined && bounds.step <= 0) WB.fail("field", "step must be above 0");
    var h = hints(id, o);
    var common = { id: id, name: o.name || id, "aria-describedby": h.describedby, "aria-invalid": o.error ? "true" : null, required: Boolean(o.required), disabled: Boolean(o.disabled) };
    var label = '<label class="wb-field__label" for="' + esc(id) + '">' + labelText(o) + "</label>";
    if (type === "checkbox" || type === "toggle") {
      var boxValue = o.value === undefined ? null : String(o.value);
      var box = "<input" + attrs(Object.assign({ type: "checkbox", class: type === "toggle" ? "wb-check wb-toggle" : "wb-check", role: type === "toggle" ? "switch" : null, value: boxValue, checked: Boolean(o.checked) }, common)) + ">";
      return '<div class="wb-field wb-field--check">' + box + label + h.html + "</div>";
    }
    var control;
    if (type === "textarea") {
      control = "<textarea" + attrs(Object.assign({ class: "wb-input wb-textarea", rows: "4" }, common)) + ">" + esc(o.value) + "</textarea>";
    } else if (type === "select") {
      if (!Array.isArray(o.options) || !o.options.length) WB.fail("field", "select requires options");
      // value, when given, picks the selected option and takes precedence over option.selected.
      var hasValue = o.value !== undefined && o.value !== null;
      checkSelectOptions(o.options);
      if (hasValue && !o.options.some(function (op) { return String(op.value) === String(o.value); })) WB.fail("field", "value '" + o.value + "' matches no select option");
      control =
        "<select" + attrs(Object.assign({ class: "wb-select" }, common)) + ">" +
        o.options.map(function (op) {
          var selected = hasValue ? String(op.value) === String(o.value) : Boolean(op.selected);
          return "<option" + attrs({ value: op.value, selected: selected }) + ">" + esc(op.label) + "</option>";
        }).join("") +
        "</select>";
    } else {
      // Secret fields never block paste (UX rule 12): no paste handlers, a normal autocomplete hint.
      control = "<input" + attrs(Object.assign({ type: type, class: "wb-input", value: o.value === undefined ? null : String(o.value), autocomplete: autocompleteFor(type) }, bounds, common)) + ">";
    }
    return '<div class="wb-field">' + label + control + h.html + "</div>";
  };

  // A fieldset of radios or checkboxes sharing one name (A-R2). Option ids and values must be distinct.
  K.choiceGroup = function (o) {
    WB.need("choiceGroup", o, ["legend", "name"]);
    var id = WB.checkId("choiceGroup", o.id);
    var type = WB.oneOf("choiceGroup", "type", o.type, ["radio", "checkbox"]);
    if (!Array.isArray(o.options) || o.options.length < 2) WB.fail("choiceGroup", "options needs at least two entries");
    // The fieldset id and its derived hint ids are reserved before any option id is checked.
    var reserved = new Set([id, id + "-help", id + "-error"]);
    var seenIds = new Set();
    var seenValues = new Set();
    var h = hints(id, o);
    var items = o.options.map(function (op) {
      WB.need("choiceGroup", op, ["value", "label"]);
      WB.checkId("choiceGroup", op.id);
      if (reserved.has(op.id)) WB.fail("choiceGroup", "option id '" + op.id + "' collides with the group id or its help/error id");
      if (seenIds.has(op.id)) WB.fail("choiceGroup", "duplicate option id '" + op.id + "'");
      if (seenValues.has(String(op.value))) WB.fail("choiceGroup", "duplicate option value '" + op.value + "'");
      seenIds.add(op.id);
      seenValues.add(String(op.value));
      var input = "<input" + attrs({ type: type, class: "wb-check", id: op.id, name: o.name, value: op.value, checked: Boolean(op.checked), required: type === "radio" && o.required ? true : null }) + ">";
      return '<div class="wb-choice">' + input + '<label class="wb-choice__label" for="' + esc(op.id) + '">' + esc(op.label) + "</label></div>";
    });
    return (
      "<fieldset" + attrs({ class: "wb-choicegroup", id: id, "aria-describedby": h.describedby, "aria-invalid": o.error ? "true" : null }) + ">" +
      '<legend class="wb-field__label">' + esc(o.legend) + (o.required ? '<span class="wb-field__req"> (required)</span>' : "") + "</legend>" +
      items.join("") + h.html + "</fieldset>"
    );
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
