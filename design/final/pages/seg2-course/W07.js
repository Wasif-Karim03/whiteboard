/* W07 Combined calendar: shared month/week/schedule views and enrolled-course filtering.
   Authorized selector projection includes own private events only in the combined scope.
   Private save/delete actions remain explicit local prototype previews. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var STATES = ["loading", "firstUseEmpty", "filteredEmpty", "invalid", "offline", "deviceDenied", "destructive"];
  var PREVIEW = "Preview only: private events are not saved in this prototype";

  function tools(a) {
    var add = a.K.button({ label: "Add private event", act: "open-dialog", target: P.id(a, "event"), id: P.id(a, "add") });
    var links = [{ label: "Reminder settings", go: "W08" }, a.role === "instructor" ? { label: "Manage grading deadlines", go: "W57" } : null];
    var state = WB.calendar.normalize(a, a.calendar);
    var course = state.courseId || a.who.courseId;
    var open = '<button type="button" class="wb-btn wb-btn--secondary" data-cal-op="open-course" data-cal-value="' + esc(course) + '">Course calendar</button>';
    return '<div class="wb-cal-tools">' + add + open + P.links(a, links) + '</div>';
  }

  function eventDialog(a) {
    var f = function (sfx, label, type, extra) { return a.K.field(Object.assign({ id: P.id(a, "ev-" + sfx), label: label, type: type }, extra || {})); };
    var body = [
      f("title", "Title", "text", { required: true }), f("start-date", "Start date", "date"), f("start-time", "Start time", "time"),
      f("end-date", "End date", "date"), f("end-time", "End time", "time", a.state === "invalid" ? { error: "End must be after start" } : null),
      f("repeat", "Repeat", "select", { options: [{ value: "none", label: "Does not repeat" }, { value: "weekly", label: "Every week" }] }),
      f("reminder", "Reminder", "select", { options: [{ value: "none", label: "No reminder" }, { value: "15", label: "15 minutes before" }] }),
      P.p("Only you can see a private event."),
    ].join("");
    return a.K.dialog(a.ctx, {
      id: P.id(a, "event"), kind: "form", title: "Add private event", open: a.variant === "add-event" || a.state === "invalid", body: body,
      actions: [{ id: P.id(a, "event-save"), label: "Save private event", kind: "primary", note: PREVIEW }],
    });
  }

  function deleteDialog(a, own) {
    return a.K.dialog(a.ctx, {
      id: P.id(a, "delete"), kind: "destructive", title: "Delete this private event?", open: true,
      body: P.p(own.name) + P.p(P.when(a, own.start)) + P.p("Only your own copy is removed. Course dates are not affected."),
      actions: [{ id: P.id(a, "delete-go"), label: "Delete this event", note: PREVIEW }],
    });
  }

  function notices(a, own) {
    if (a.state === "offline") {
      return P.stack(a, [a.K.notice({ tone: "warning", title: "Course dates may be out of date", body: P.p("Changes are not confirmed until you reconnect.") }), a.K.flag("lastKnown")]);
    }
    if (a.state === "deviceDenied") {
      return a.K.notice({ tone: "warning", title: "Browser notifications are blocked", body: P.p("The calendar still works. Reminders are not delivered."), actions: [{ label: "Reminder settings", go: "W08" }] });
    }
    if (a.state === "destructive" && !own) return a.K.notice({ tone: "info", title: "You have no private event in this period" });
    return "";
  }

  function render(a) {
    var own = WB.calendar.visibleEntries(a, a.calendar).filter(function (r) { return r.private; })[0] || null;
    var ended = P.taEnded(a) ? P.taEndedNotice(a, P.assessmentId(a)) : "";
    var main = a.state === "loading" ? P.loading(a, "your calendar") : WB.calendar.render(a, a.calendar);
    var body = P.stack(a, [ended, notices(a, own), main, tools(a)]);
    var dialogs = eventDialog(a) + (a.state === "destructive" && own ? deleteDialog(a, own) : "");
    return { title: "Calendar", navActive: "calendar", body: body, dialog: dialogs };
  }

  WB.definePage("W07", {
    states: STATES,
    na: P.na(STATES, {
      saving: "Private events are preview-only here; no save request is drawn",
      saveFailed: "Private events are preview-only here; no save request is drawn",
      conflict: "A private event has one owner and one editor",
    }),
    variants: { "add-event": "Add private event dialog open" },
    render: render,
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
