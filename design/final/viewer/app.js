/* Whiteboard Phase 2c viewer: DOM glue for Whiteboard-Final.html (team plan Step 5, R1–R4, R8, R11, R13–R15).
   No routing or decision logic lives here: route.js, interact.js, bar.js and tours.js decide; this file reads
   the DOM, calls them and applies the result through one apply() path. Focus is never animated and the
   viewer adds no motion. Browser behaviour is unverified until Phase 6 (source checks only). */
(function (root) {
  "use strict";
  if (typeof document === "undefined") return;
  var WB = root.WB;
  var V = WB.viewer;
  var NS = V.STAGE_NS;
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

  var current = null;
  var modal = null;
  var openMenu = null;
  var pendingJourney = "";
  var frameNotes = [];
  var calendarState = null;
  var pendingCalendarScope;
  var calendarOpener = null;

  function $(id) { return document.getElementById(id); }
  function stage() { return $("v-stage"); }

  function setStatus(text, quiet) {
    var el = $("v-status");
    if (el) { el.textContent = text; el.classList.toggle("wb-vstatus--quiet", Boolean(quiet)); }
  }

  function errorText(err) {
    return err && err.message ? err.message : String(err);
  }

  // ---------- History and theme ----------
  function writeHistory(mode, vs) {
    var hash = V.formatHash(vs);
    if (mode === "push") {
      try { history.pushState(null, "", hash); } catch (e) { location.hash = hash; }
    } else if (mode === "replace") {
      try { history.replaceState(null, "", hash); } catch (e) { location.replace(hash); }
    }
  }

  function applyTheme(vs) {
    var html = document.documentElement;
    if (vs.appearance === "system") html.removeAttribute("data-theme");
    else html.setAttribute("data-theme", vs.appearance);
    if (vs.text === "larger") html.setAttribute("data-text", "larger");
    else html.removeAttribute("data-text");
  }

  // ---------- Regions ----------
  function renderStage(vs) {
    var el = stage();
    openMenu = null;
    try {
      var frame = V.renderFrame(WB, vs, { ns: NS, calendar: calendarState });
      el.innerHTML = frame.html;
      frameNotes = frame.notes.slice();
      document.title = frame.title + " · Whiteboard prototype (fictional data)";
    } catch (err) {
      frameNotes = ["This view could not be drawn: " + errorText(err)];
      el.innerHTML = WB.K.notice({ tone: "error", title: "This view could not be drawn", body: "<p>" + WB.esc(errorText(err)) + "</p>" });
    }
    var calendarWeek = el.querySelector(".wb-cal-week");
    if (calendarWeek) calendarWeek.scrollTop = 8 * 80;
    var h1 = el.querySelector("h1");
    if (h1) h1.setAttribute("tabindex", "-1");
  }

  function renderTour(vs) {
    var el = $("v-tour");
    var html = V.tours.panel(WB, vs);
    el.innerHTML = html;
    el.hidden = html === "";
  }

  function setRadios(name, value) {
    var list = document.querySelectorAll('input[type="radio"][name="' + name + '"]');
    Array.prototype.forEach.call(list, function (r) { r.checked = r.value === value; });
  }

  function syncBar(vs) {
    var m = V.barModel(WB, vs, { pendingJourney: pendingJourney });
    var v = m.values;
    $("v-width").hidden = m.hidden.width;
    $("v-orient").hidden = m.hidden.orientation;
    $("v-page").innerHTML = m.pageOptionsHtml;
    $("v-page").value = v.page;
    $("v-state").innerHTML = m.stateOptionsHtml;
    $("v-state").value = v.state;
    setRadios("v-platform", v.platform);
    setRadios("v-width", v.width);
    setRadios("v-orient", v.orientation);
    setRadios("v-appearance", v.appearance);
    setRadios("v-text", v.text);
    $("v-opt").checked = v.opt;
    $("v-role").value = v.role;
    $("v-scenario").value = v.scenario;
    $("v-journey").value = v.journey;
    pendingJourney = m.pendingJourney;
    var active = document.activeElement;
    var hiddenGroup = active && active.closest && active.closest("fieldset[hidden]");
    if (hiddenGroup) {
      var checked = document.querySelector('input[name="v-platform"]:checked');
      if (checked) checked.focus();
    }
  }

  function focusFor(kind) {
    var target = null;
    if (kind === "h1") target = stage().querySelector("h1") || stage();
    else if (kind === "tour") target = $("v-tour-title");
    else if (kind === "journey") {
      var settings = $("v-settings");
      target = settings && !settings.open ? $("v-settings-toggle") : $("v-journey");
    }
    if (target) target.focus();
  }

  // ---------- The one apply path ----------
  function apply(result) {
    if (!result) return;
    var prev = current;
    var plan = V.renderPlan(prev, result.vs);
    current = result.vs;
    if (!prev || prev.page !== current.page || prev.role !== current.role || prev.scenario !== current.scenario || JSON.stringify(prev.selection) !== JSON.stringify(current.selection)) calendarState = null;
    if (pendingCalendarScope !== undefined) { calendarState = { courseId: pendingCalendarScope }; pendingCalendarScope = undefined; }
    writeHistory(result.history, current);
    if (plan.frame) {
      teardownModal();
      renderStage(current);
    }
    if (plan.tour) renderTour(current);
    syncBar(current);
    if (plan.theme) applyTheme(current);
    setStatus(result.status + (frameNotes.length ? " · " + frameNotes.join(" · ") : ""), !result.notes.length && !frameNotes.length);
    var dialogTookFocus = plan.frame && activateOpenDialogs();
    if (!dialogTookFocus) focusFor(result.focus);
  }

  // ---------- Modal lifecycle (one modal at a time; the opener is kept as an element) ----------
  function focusables(container) {
    return Array.prototype.filter.call(container.querySelectorAll(FOCUSABLE), function (el) { return !el.closest("[hidden]"); });
  }

  function isFocusable(el) {
    return !el.disabled && el.getAttribute("aria-disabled") !== "true" && !el.closest("[hidden]");
  }

  // F02: describe candidates for interact.js tabStops/trapStep (radio groups are one stop).
  function tabInfo(el) {
    return { tag: el.tagName.toLowerCase(), type: el.type || "", name: el.name || "", checked: el.checked === true, disabled: el.disabled === true, tabindex: el.getAttribute("tabindex"), hidden: Boolean(el.closest("[hidden]")) };
  }

  function trapKeydown(dialog) {
    return function (e) {
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); closeDialog(); return; }
      if (e.key !== "Tab") return;
      var list = focusables(dialog);
      var step = V.trapStep(list.map(tabInfo), list.indexOf(document.activeElement), dialog.contains(document.activeElement), e.shiftKey);
      if (step.prevent) e.preventDefault();
      if (step.focus >= 0) list[step.focus].focus();
    };
  }

  // Mark only sibling branches inert, leaving the dialog and every ancestor interactive. Save the exact
  // previous state so closing or replacing a dialog does not enable a branch that was already inert.
  function isolateModal(dialog, body) {
    var saved = [];
    for (var node = dialog; node && node !== body; node = node.parentElement) {
      var parent = node.parentElement;
      if (!parent) break;
      Array.prototype.forEach.call(parent.children, function (sibling) {
        if (sibling === node) return;
        saved.push({ node: sibling, inert: sibling.inert });
        sibling.inert = true;
      });
    }
    return saved;
  }
  function restoreModal(saved) {
    saved.forEach(function (item) { item.node.inert = item.inert; });
  }
  V.isolateModal = isolateModal;
  V.restoreModal = restoreModal;

  function enterModal(id, opener) {
    var dialog = $(id);
    if (!dialog) return false;
    var isolated = isolateModal(dialog, document.body);
    var plan = V.dialogFocusPlan({ dialogId: id, opener: null, hasH1: false });
    var list = focusables(dialog);
    var stops = V.tabStops(list.map(tabInfo));
    if (stops.length) list[stops[0]].focus();
    else {
      var title = $(plan.fallbackInitial);
      if (title) { title.setAttribute("tabindex", "-1"); title.focus(); }
    }
    var onKeydown = trapKeydown(dialog);
    document.addEventListener("keydown", onKeydown, true);
    modal = { dialogId: id, opener: opener || null, onKeydown: onKeydown, isolated: isolated };
    return true;
  }

  function teardownModal() {
    if (modal) {
      document.removeEventListener("keydown", modal.onKeydown, true);
      restoreModal(modal.isolated);
    }
    modal = null;
  }

  function showDialog(id, show) {
    var scrim = stage().querySelector('[data-dialog="' + id + '"]');
    if (scrim) scrim.hidden = !show;
    var dialog = $(id);
    if (dialog) dialog.hidden = !show;
    return Boolean(dialog);
  }

  function openerState(el) {
    return el ? { connected: el.isConnected, focusable: isFocusable(el) } : null;
  }

  // Single-modal invariant (interact.js modalTransition): B must exist; A and its scrim are hidden before the
  // modal record is replaced, and B never returns focus into the hidden A.
  function openDialog(id, opener) {
    var currentDialog = modal ? $(modal.dialogId) : null;
    var t = V.modalTransition({
      currentId: modal ? modal.dialogId : null,
      currentOpener: modal ? openerState(modal.opener) : null,
      nextId: id,
      nextExists: Boolean($(id)),
      openerInsideCurrent: Boolean(currentDialog && opener && currentDialog.contains(opener)),
    });
    if (!t.open) { setStatus(t.status); return; }
    var returnOpener = t.returnOpener === "current" ? modal.opener : t.returnOpener === "new" ? opener : null;
    t.hide.forEach(function (h) { showDialog(h, false); });
    teardownModal();
    showDialog(id, true);
    enterModal(id, returnOpener || null);
  }

  function closeDialog(targetId) {
    var id = modal ? modal.dialogId : targetId;
    if (!id) return;
    var opener = modal ? modal.opener : null;
    showDialog(id, false);
    teardownModal();
    var h1 = stage().querySelector("h1");
    var plan = V.dialogFocusPlan({
      dialogId: id,
      opener: opener ? { connected: opener.isConnected, focusable: isFocusable(opener) } : null,
      hasH1: Boolean(h1),
    });
    var target = plan.returnTo === "opener" ? opener : plan.returnTo === "h1" ? h1 : stage();
    target.focus();
  }

  function activateOpenDialogs() {
    var dialog = stage().querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
    if (!dialog || modal) return false;
    return enterModal(dialog.id, null);
  }

  // ---------- Toggles: iPad sidebar, iPhone section and account menus ----------
  function setToggle(id, open) {
    var target = $(id);
    if (!target) return null;
    target.hidden = !open;
    var controls = stage().querySelectorAll('[aria-controls="' + id + '"]');
    Array.prototype.forEach.call(controls, function (b) { b.setAttribute("aria-expanded", String(open)); });
    return target;
  }

  function toggle(id, button) {
    var target = $(id);
    if (!target) { setStatus("This control is not drawn in the prototype yet."); return; }
    var open = target.hidden;
    var t = V.menuToggle(openMenu ? openMenu.id : null, id, open);
    t.close.forEach(function (c) { setToggle(c, false); });
    setToggle(id, open);
    var tracked = id === NS + "-sidebar" ? $(NS + "-sidebar-toggle") : button;
    if (id === NS + "-sidebar") {
      var focusTarget = $(V.sidebarFocusTarget(NS, open));
      if (focusTarget) focusTarget.focus();
    }
    openMenu = t.openId === null ? null : t.openId === id ? { id: id, button: tracked } : openMenu;
  }

  function closeMenuOnEscape(e) {
    if (e.key === "Escape" && !e.defaultPrevented && !modal) {
      var detail = e.target.closest ? e.target.closest("details.wb-course-more[open], .wb-tool-disclosure > details[open]") : null;
      if (!detail) detail = stage().querySelector("details.wb-course-more[open]");
      if (detail) { e.preventDefault(); detail.open = false; detail.querySelector("summary").focus(); return; }
    }
    if (!V.menuEscapes({ key: e.key, defaultPrevented: e.defaultPrevented, modal: Boolean(modal), openId: openMenu ? openMenu.id : null })) return;
    e.preventDefault();
    var menu = openMenu;
    setToggle(menu.id, false);
    openMenu = null;
    var back = menu.id === NS + "-sidebar" ? $(V.sidebarFocusTarget(NS, false)) : menu.button;
    if (back && back.isConnected) back.focus();
  }

  function closeCourseMenuOnBlur(e) {
    var detail = e.target.closest ? e.target.closest("details.wb-course-more[open]") : null;
    if (detail && !detail.contains(e.relatedTarget)) detail.open = false;
  }

  // Calendar browsing is local UI state; it never changes the scenario clock or grants a role.
  function calendarArgs(vs) {
    var ac = V.activeContext(vs);
    var ctx = WB.ctx(Object.assign({ role: vs.role, tier: "full" }, ac));
    var view = WB.sel.scenarioView(vs.scenario);
    var selection = WB.sel.resolveTeachingSelection(view, vs.role, vs.selection, vs.page, null);
    return { page: WB.pageFor(vs.page).page, ctx: ctx, platform: ctx.platform, sizeClass: ctx.sizeClass, role: vs.role,
      view: view, who: selection && selection.allowed ? selection.who : WB.sel.viewerFor(view, vs.role), sel: WB.sel, K: WB.K, WB: WB, ns: NS + "-c", state: null };
  }
  function calendarAction(e, control) {
    if (control.disabled || control.getAttribute("aria-disabled") === "true" || modal) return;
    var op = control.getAttribute("data-cal-op");
    var value = control.tagName === "SELECT" ? control.value : control.getAttribute("data-cal-value");
    if (op === "open-course") {
      var a = calendarArgs(current);
      if (!WB.sel.calendarCourses(a.view, a.who).some(function (c) { return c.id === value; })) { setStatus("This course calendar is not available to you."); return; }
      e.preventDefault();
      pendingCalendarScope = value;
      apply(V.reduce(WB, current, { type: "link", href: "#/W32" }));
      return;
    }
    if (current.page !== "W07" && current.page !== "W32") return;
    e.preventDefault();
    var args = calendarArgs(current);
    if (op === "event") calendarOpener = control.id;
    var priorMode = WB.calendar.normalize(args, calendarState).mode;
    calendarState = WB.calendar.reduce(args, calendarState, op, value);
    if (op === "reset" && current.token === "filteredEmpty") {
      var savedCalendar = calendarState;
      apply(V.reduce(WB, current, { type: "back" }));
      calendarState = savedCalendar;
      return;
    }
    var id = control.id;
    var scroll = stage().querySelector(".wb-cal-week, .wb-cal-month");
    var top = scroll ? scroll.scrollTop : null;
    var left = scroll ? scroll.scrollLeft : null;
    teardownModal();
    renderStage(current);
    var nextScroll = stage().querySelector(".wb-cal-week, .wb-cal-month");
    if (nextScroll && top !== null && priorMode === calendarState.mode) { nextScroll.scrollTop = top; nextScroll.scrollLeft = left; }
    var focus = op === "event" ? $(NS + "-c-calendar-detail") : op === "close" && calendarOpener ? $(calendarOpener) : id ? $(id) : null;
    if (!focus) focus = $(NS + "-c-calendar-period");
    if (focus) focus.focus();
    if (nextScroll && top !== null && priorMode === calendarState.mode) { nextScroll.scrollTop = top; nextScroll.scrollLeft = left; }
    var period = $(NS + "-c-calendar-period");
    setStatus(period ? period.textContent : "Calendar updated", true);
  }

  // ---------- Stage clicks ----------
  function activationInput(el) {
    var described = el.getAttribute("aria-describedby");
    var reasonEl = described ? $(described) : null;
    return {
      tag: el.tagName.toLowerCase(),
      ariaDisabled: el.getAttribute("aria-disabled"),
      disabled: el.disabled === true,
      act: el.getAttribute("data-act"),
      target: el.getAttribute("data-target"),
      note: el.getAttribute("data-note"),
      reasonText: reasonEl ? reasonEl.textContent.trim() : "",
      href: el.getAttribute("href"),
    };
  }

  // R13: in-page "#…" links (the shell's Skip to content) move focus without touching the route hash.
  function inPage(e, id) {
    if (!V.isPlainClick(e)) return;
    var target = $(id);
    if (!target) return;
    e.preventDefault();
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus();
    target.scrollIntoView({ behavior: "auto", block: "start" });
  }

  function onStageClick(e) {
    var cal = e.target.closest ? e.target.closest("button[data-cal-op]") : null;
    if (cal && stage().contains(cal)) { calendarAction(e, cal); return; }
    var el = e.target.closest ? e.target.closest("a, button") : null;
    if (!el || !stage().contains(el)) return;
    var input = activationInput(el);
    var a = V.activation(input);
    if (a.kind === "blocked") { e.preventDefault(); setStatus(a.status); return; }
    if (a.kind === "link") {
      if (!V.shouldIntercept(e, input.href)) return;
      e.preventDefault();
      var courseMenu = el.closest("details.wb-course-more");
      if (courseMenu) courseMenu.open = false;
      apply(V.reduce(WB, current, { type: "link", href: input.href }));
      return;
    }
    if (a.kind === "in-page") return inPage(e, a.target);
    if (a.kind === "native") return;
    e.preventDefault();
    if (a.kind === "open-dialog") openDialog(a.target, el);
    else if (a.kind === "close-dialog") closeDialog(a.target);
    else if (a.kind === "toggle") toggle(a.target, el);
    else if (a.kind === "back") apply(V.reduce(WB, current, { type: "back" }));
    else if (a.kind === "preview") setStatus(a.status);
  }

  // R15: compact-table sort selects are preview only; restore the rendered choice.
  function onStageChange(e) {
    var t = e.target;
    if (t.matches && t.matches("select[data-cal-op]")) { calendarAction(e, t); return; }
    if (!t.matches || !t.matches('select[data-act="sort"]')) return;
    var rendered = t.querySelector("option[selected]") || t.querySelector("option");
    var out = V.sortSelectOutcome({ note: t.getAttribute("data-note"), renderedValue: rendered ? rendered.value : "" });
    t.value = out.value;
    setStatus(out.status);
  }

  // ---------- Bar, tour panel and skip ----------
  function onBarChange(e) {
    var t = e.target;
    var key = t.getAttribute("data-v-key");
    if (!key) return;
    if (key === "journey") { pendingJourney = t.value; return; }
    var value = t.type === "checkbox" ? t.checked : t.value;
    try {
      apply(V.reduce(WB, current, { type: "bar", key: key, value: value }));
    } catch (err) {
      setStatus("That setting could not be applied: " + errorText(err));
    }
  }

  function runVact(act) {
    if (act === "skip") { stage().focus(); return; }
    if (act === "tour-start") {
      // F01: dispatch exactly what the select displays; syncBar keeps it equal to the active tour or the pick.
      var jid = $("v-journey").value;
      pendingJourney = "";
      apply(V.reduce(WB, current, { type: "tour", op: "start", jid: jid }));
      return;
    }
    var ops = { "tour-prev": "prev", "tour-next": "next", "tour-end": "end" };
    if (!V.has(ops, act)) return;
    var op = ops[act];
    if (op === "end") pendingJourney = "";
    apply(V.reduce(WB, current, { type: "tour", op: op }));
  }

  function onVactClick(e) {
    var el = e.target.closest ? e.target.closest("[data-v-act]") : null;
    if (!el || el.disabled) return;
    e.preventDefault();
    runVact(el.getAttribute("data-v-act"));
  }

  function onHashChange() {
    apply(V.reduce(WB, current, { type: "hash", hash: location.hash }));
  }

  // ---------- Start-up ----------
  function start() {
    var first = V.reduce(WB, null, { type: "hash", hash: location.hash }) || V.reduce(WB, null, { type: "hash", hash: V.formatHash(V.DEFAULTS) });
    $("v-bar").innerHTML = V.renderBar(WB, first.vs, { pendingJourney: "" });
    apply(V.merge(first, { history: "replace", focus: "none" }));
    $("v-bar").addEventListener("change", onBarChange);
    stage().addEventListener("click", onStageClick);
    stage().addEventListener("change", onStageChange);
    stage().addEventListener("keydown", closeMenuOnEscape);
    stage().addEventListener("focusout", closeCourseMenuOnBlur);
    document.addEventListener("click", onVactClick);
    document.addEventListener("click", function (e) {
      stage().querySelectorAll("details.wb-course-more[open]").forEach(function (detail) { if (!detail.contains(e.target)) detail.open = false; });
    });
    window.addEventListener("hashchange", onHashChange);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})(typeof globalThis !== "undefined" ? globalThis : this);
