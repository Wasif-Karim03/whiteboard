/* Calendar presentation: civil-date navigation and authorized event views. No clock or data is changed. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var esc = WB.esc;
  var C = {};
  var DAY = 86400000;
  var MODES = ["week", "month", "agenda"];

  function key(date) { return date.toISOString().slice(0, 10); }
  function dateOf(day) { return new Date(day + "T00:00:00Z"); }
  function valid(day) { return typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day) && !isNaN(dateOf(day).getTime()) && key(dateOf(day)) === day; }
  function add(day, n) { return key(new Date(dateOf(day).getTime() + n * DAY)); }
  function monthMove(day, n) {
    var d = dateOf(day), first = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1));
    var last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    first.setUTCDate(Math.min(d.getUTCDate(), last));
    return key(first);
  }
  function monday(day) { return add(day, -((dateOf(day).getUTCDay() + 6) % 7)); }
  function parts(iso, zone) {
    var values = {};
    new Intl.DateTimeFormat("en-US", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(iso)).forEach(function (p) { values[p.type] = p.value; });
    return { day: values.year + "-" + values.month + "-" + values.day, minute: Number(values.hour) * 60 + Number(values.minute) };
  }
  function labelDay(day, options) { return new Intl.DateTimeFormat("en-US", Object.assign({ timeZone: "UTC" }, options)).format(dateOf(day)); }
  function time(iso, zone) { return new Intl.DateTimeFormat("en-US", { timeZone: zone, hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(iso)); }
  function fullTime(iso, zone) { return new Intl.DateTimeFormat("en-US", { timeZone: zone, year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(iso)); }
  function offset(iso, zone) {
    return new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "shortOffset", hour: "numeric" }).formatToParts(new Date(iso)).filter(function (p) { return p.type === "timeZoneName"; })[0].value;
  }
  function courseId(course) { return course.id; }
  function courses(a) { return a.sel.calendarCourses(a.view, a.who); }
  function normalize(a, input) {
    input = input || {};
    var today = parts(a.view.clock, a.sel.calendarZone(a.view)).day;
    var allowed = courses(a).map(courseId);
    var wanted = Object.prototype.hasOwnProperty.call(input, "courseId") ? input.courseId : (a.page.id === "W32" ? a.who.courseId : null);
    if (a.page.id === "W32" && (wanted === null || wanted === "" || wanted === undefined)) wanted = a.who.courseId;
    var scope = wanted && allowed.indexOf(wanted) >= 0 ? wanted : null;
    // A foreign course is not silently converted into a combined calendar.
    if (wanted && !scope) scope = "__unavailable__";
    return { mode: MODES.indexOf(input.mode) >= 0 ? input.mode : (a.sizeClass === "regular" ? "week" : "agenda"), day: valid(input.day) ? input.day : today, courseId: scope, selected: typeof input.selected === "string" ? input.selected : null };
  }
  function reduce(a, state, op, value) {
    if (op === "reset") return normalize(a, {});
    var s = normalize(a, state), next = { mode: s.mode, day: s.day, courseId: s.courseId, selected: s.selected };
    if (op === "event") next.selected = typeof value === "string" ? value : null;
    else if (op === "close") next.selected = null;
    else {
      if (op === "view" && MODES.indexOf(value) >= 0) next.mode = value;
      if (op === "today") next.day = parts(a.view.clock, a.sel.calendarZone(a.view)).day;
      if (op === "previous" || op === "next") {
        var n = op === "next" ? 1 : -1;
        next.day = s.mode === "month" ? monthMove(s.day, n) : add(s.day, n * (s.mode === "week" ? 7 : 8));
      }
      if (op === "course") next.courseId = value === "" && a.page.id === "W07" ? null : value;
      next.selected = null;
    }
    return normalize(a, next);
  }
  function range(a, state) {
    var s = normalize(a, state), start, count, title;
    if (s.mode === "month") {
      var first = s.day.slice(0, 7) + "-01";
      start = monday(first); count = 42;
      title = labelDay(first, { month: "long", year: "numeric" });
    } else if (s.mode === "week") {
      start = monday(s.day); count = 7;
      title = labelDay(start, { month: "short", day: "numeric", year: "numeric" }) + " – " + labelDay(add(start, 6), { month: "short", day: "numeric", year: "numeric" });
    } else {
      start = s.day; count = 8;
      title = labelDay(start, { month: "short", day: "numeric", year: "numeric" }) + " – " + labelDay(add(start, 7), { month: "short", day: "numeric", year: "numeric" });
    }
    var days = []; for (var i = 0; i < count; i += 1) days.push(add(start, i));
    return { fromDay: start, toDay: add(start, count), days: days, title: title };
  }
  function projected(entries, r, zone) {
    var out = [];
    entries.forEach(function (e) {
      var begin = Date.parse(e.start), finish = e.end ? Date.parse(e.end) : begin;
      if (!isFinite(begin) || !isFinite(finish) || finish < begin) return;
      var first = parts(begin, zone), last = parts(finish > begin ? finish - 1 : begin, zone);
      r.days.forEach(function (day) {
        if (day < first.day || day > last.day) return;
        var start = day === first.day ? first.minute : 0;
        var end = finish === begin ? start : day === parts(finish, zone).day ? parts(finish, zone).minute : 1440;
        out.push({ event: e, day: day, start: start, end: end, point: finish === begin, instant: begin });
      });
    });
    return out.sort(function (x, y) { return x.day.localeCompare(y.day) || x.instant - y.instant || x.event.name.localeCompare(y.event.name); });
  }
  function attr(text) { return esc(String(text)); }
  function button(op, value, text, extra, id, aria) {
    return '<button type="button" class="wb-btn wb-btn--secondary wb-cal-button' + (extra || "") + '" data-cal-op="' + attr(op) + '"' + (value == null ? "" : ' data-cal-value="' + attr(value) + '"') + (id ? ' id="' + attr(id) + '"' : '') + (aria ? ' aria-label="' + attr(aria) + '"' : '') + '>' + esc(text) + '</button>';
  }
  function toolbar(a, s, r) {
    var opts = courses(a).map(function (c) { return '<option value="' + attr(c.id) + '"' + (s.courseId === c.id ? ' selected' : '') + '>' + esc(c.code ? c.code + " · " + c.title : c.title) + '</option>'; });
    if (a.page.id === "W07") opts.unshift('<option value=""' + (s.courseId === null ? ' selected' : '') + '>All calendars</option>');
    var scope = s.courseId === "__unavailable__" ? P.p("This calendar is not available for your course role") : '<label class="wb-cal-scope" for="' + attr(P.id(a, "calendar-course")) + '">Calendar<select id="' + attr(P.id(a, "calendar-course")) + '" data-cal-op="course">' + opts.join("") + '</select></label>';
    var modes = [["month", "Month"], ["week", "Week"], ["agenda", "Schedule"]].map(function (m) { return '<button type="button" class="wb-btn wb-btn--secondary wb-cal-button" data-cal-op="view" data-cal-value="' + m[0] + '" id="' + attr(P.id(a, "calendar-view-" + m[0])) + '" aria-pressed="' + (s.mode === m[0]) + '">' + m[1] + '</button>'; }).join("");
    return '<div class="wb-cal-toolbar"><div class="wb-cal-navigation">' + button("previous", null, "Previous", "", P.id(a, "calendar-previous")) + button("today", null, "Today", "", P.id(a, "calendar-today")) + button("next", null, "Next", "", P.id(a, "calendar-next")) + '<h2 id="' + attr(P.id(a, "calendar-period")) + '" tabindex="-1">' + esc(r.title) + '</h2></div><div class="wb-cal-controls"><div role="group" aria-label="Calendar view">' + modes + '</div>' + scope + '<p class="wb-cal-zone">Times shown in ' + esc(a.sel.calendarZone(a.view)) + '</p></div></div>';
  }
  function chip(a, row, zone, combined, linked) {
    var e = row.event, go = e.go && !linked.has(e.id) ? e.go : null;
    if (go) linked.add(e.id);
    var startDay = parts(e.start, zone).day;
    var endDay = parts(e.end || e.start, zone).day;
    var begin = row.day === startDay ? time(e.start, zone) : "Continues";
    var endPart = parts(e.end || e.start, zone);
    var finish = !row.point ? (row.day === endDay || (endDay === add(row.day, 1) && endPart.minute === 0) ? time(e.end, zone) : "continues next day") : "";
    var content = '<span class="wb-cal-event-name">' + esc(e.name) + '</span><span class="wb-cal-event-time">' + esc(begin + (finish ? " – " + finish : "")) + '</span>' +
      (e.where ? '<span class="wb-cal-event-location">' + esc(e.where) + '</span>' : "") +
      (combined && e.courseLabel ? '<span class="wb-cal-event-course">' + esc(e.courseLabel) + '</span>' : "");
    var occurrenceId = P.id(a, "calendar-event-" + encodeURIComponent(e.id) + "-" + row.day);
    var opener = go ? '<a class="wb-cal-event-link" href="' + attr(WB.goHref(go, "calendar")) + '" data-go="' + attr(go) + '">' + content + '</a>'
      : '<button type="button" class="wb-cal-event-link" id="' + attr(occurrenceId) + '" data-cal-day="' + attr(row.day) + '" data-cal-op="event" data-cal-value="' + attr(e.id) + '">' + content + '</button>';
    var info = go ? '<button type="button" class="wb-btn wb-btn--secondary wb-cal-button wb-cal-event-info" id="' + attr(occurrenceId) + '" data-cal-day="' + attr(row.day) + '" data-cal-op="event" data-cal-value="' + attr(e.id) + '" aria-label="' + attr("Details for " + e.name) + '">Details</button>' : "";
    return '<div class="wb-cal-event" data-course-key="' + attr(e.courseKey || "") + '" data-cal-kind="' + attr(e.kind || "") + '">' + opener + info + '</div>';
  }
  function selectedPanel(a, s, entries, zone) {
    var e = entries.filter(function (x) { return x.id === s.selected; })[0];
    if (!e) return "";
    var kinds = { class: "Class", officeHours: "Office hours", personal: "Private event", gradingTask: "Grading deadline", due: "Coursework deadline" };
    var rows = [{ label: "Type", value: kinds[e.kind] || "Event" }, { label: "Starts", value: fullTime(e.start, zone) }];
    if (e.end && Date.parse(e.end) > Date.parse(e.start)) rows.push({ label: "Ends", value: fullTime(e.end, zone) });
    if (e.where) rows.push({ label: "Location", value: e.where });
    if (e.courseLabel) rows.push({ label: e.private ? "Calendar" : "Course", value: e.courseLabel });
    if (e.source) rows.push({ label: "Source", value: e.source });
    if (e.private) rows.push({ label: "Visibility", value: "Only you" });
    return '<section class="wb-cal-detail"><h2 id="' + attr(P.id(a, "calendar-detail")) + '" tabindex="-1">' + esc(e.name) + '</h2>' + a.K.kv(rows) + button("close", null, "Close details") + '</section>';
  }
  function listDays(a, s, r, rows, zone, mode) {
    var linked = new Set(), today = parts(a.view.clock, zone).day;
    return '<div class="wb-cal-' + mode + '"' + (mode === "month" ? ' role="region" aria-label="Month calendar" tabindex="0"' : '') + '>' + (mode === "month" ? r.days.slice(0, 7).map(function (day) { return '<div class="wb-cal-week-label" aria-hidden="true">' + esc(labelDay(day, { weekday: "short" })) + '</div>'; }).join("") : "") + r.days.map(function (day) {
      var events = rows.filter(function (x) { return x.day === day; });
      if (mode === "agenda" && !events.length) return "";
      var out = events.map(function (x) { return '<li>' + chip(a, x, zone, s.courseId === null, linked) + '</li>'; }).join("");
      return '<section class="wb-cal-day' + (mode === "month" && day.slice(0, 7) !== s.day.slice(0, 7) ? ' wb-cal-outside' : '') + '"' + (day === today ? ' aria-current="date"' : '') + '><h3>' + (mode === "month" ? '<time datetime="' + attr(day) + '"><span class="wb-sr">' + esc(labelDay(day, { weekday: "long", month: "long", day: "numeric", year: "numeric" })) + '</span><span aria-hidden="true">' + Number(day.slice(-2)) + '</span></time>' : esc(labelDay(day, { weekday: "short", month: "short", day: "numeric" }))) + '</h3>' + (out ? '<ul>' + out + '</ul>' : mode === "month" ? "" : '<p>No events</p>') + '</section>';
    }).join("") + '</div>' + (!rows.length ? P.p("No events in this period") : "");
  }
  function lanes(rows) {
    var used = [], max = 0;
    rows.forEach(function (x) {
      var start = Math.floor(x.start / 15), end = Math.min(96, Math.max(start + 2, Math.ceil(x.end / 15)));
      var lane = 0; while (lane < used.length && used[lane] > start) lane += 1;
      used[lane] = end; max = Math.max(max, lane + 1);
      x.slot = Math.min(96, start + 1); x.span = Math.max(1, end - start); x.lane = lane + 1;
    });
    return max;
  }
  function week(a, s, r, rows, zone) {
    var changed = rows.some(function (x) { return !x.point && offset(x.event.start, zone) !== offset(x.event.end, zone); });
    var repeated = r.days.some(function (day) {
      var dayRows = rows.filter(function (x) { return x.day === day && parts(x.event.start, zone).day === day; });
      var offsets = new Set(dayRows.map(function (x) { return offset(x.event.start, zone); }));
      return offsets.size > 1 || dayRows.some(function (x, i) { return i > 0 && x.start < dayRows[i - 1].start; });
    });
    if (changed || repeated) return P.p("Daylight-saving time change: showing exact times in Schedule") + listDays(a, s, r, rows, zone, "agenda");
    var byDay = r.days.map(function (day) { return rows.filter(function (x) { return x.day === day && !x.point; }).sort(function (x, y) { return x.start - y.start || x.instant - y.instant; }); });
    var widths = byDay.map(lanes);
    if (widths.some(function (n) { return n > 8; })) return P.p("More overlapping events than the week view can show; showing the schedule instead.") + listDays(a, s, r, rows, zone, "agenda");
    var linked = new Set(), today = parts(a.view.clock, zone).day;
    var deadlines = rows.filter(function (x) { return x.point; });
    var band = deadlines.length ? '<section class="wb-cal-deadlines"><h3>Deadlines</h3><ul>' + deadlines.map(function (x) { return '<li>' + esc(labelDay(x.day, { weekday: "short", month: "short", day: "numeric" })) + ' · ' + chip(a, x, zone, s.courseId === null, linked) + '</li>'; }).join("") + '</ul></section>' : "";
    var grid = r.days.map(function (day, i) {
      var blocks = byDay[i].map(function (x) { return '<div class="wb-cal-block wb-cal-slot-' + x.slot + ' wb-cal-span-' + x.span + ' wb-cal-lane-' + x.lane + '">' + chip(a, x, zone, s.courseId === null, linked) + '</div>'; }).join("");
      return '<section class="wb-cal-weekday"' + (day === today ? ' aria-current="date"' : '') + '><h3>' + esc(labelDay(day, { weekday: "short", month: "short", day: "numeric" })) + '</h3><div class="wb-cal-timeline wb-cal-lanes-' + Math.max(1, widths[i]) + '">' + blocks + '</div></section>';
    }).join("");
    var hours = [];
    for (var hour = 0; hour < 24; hour += 1) hours.push('<li>' + esc((hour % 12 || 12) + (hour < 12 ? " AM" : " PM")) + '</li>');
    return band + '<div class="wb-cal-week" role="region" aria-label="Weekly time grid" tabindex="0"><ol class="wb-cal-hours" aria-label="Hours">' + hours.join("") + '</ol>' + grid + '</div>' + (!rows.length ? P.p("No events in this period") : "");
  }
  function visibleEntries(a, input) {
    var s = normalize(a, input), r = range(a, s), zone = a.sel.calendarZone(a.view);
    if (s.courseId === "__unavailable__" || a.state === "firstUseEmpty" || a.state === "filteredEmpty") return [];
    var entries = a.sel.calendarEntries(a.view, a.who, s.courseId);
    var seen = new Set();
    return projected(entries, r, zone).map(function (row) { return row.event; }).filter(function (event) {
      if (seen.has(event.id)) return false;
      seen.add(event.id); return true;
    });
  }
  function render(a, input) {
    var s = normalize(a, input), r = range(a, s), zone = a.sel.calendarZone(a.view);
    var entries = visibleEntries(a, s);
    var rows = projected(entries, r, zone);
    var body = s.mode === "week" ? week(a, s, r, rows, zone) : listDays(a, s, r, rows, zone, s.mode);
    var empty = a.state === "filteredEmpty" ? P.p("No events match these filters") + button("reset", null, "Clear filters") : a.state === "firstUseEmpty" ? P.p("No events yet") : "";
    return '<div class="wb-calendar">' + toolbar(a, s, r) + empty + body + selectedPanel(a, s, entries, zone) + '</div>';
  }
  C.normalize = normalize; C.reduce = reduce; C.range = range; C.render = render; C.visibleEntries = visibleEntries;
  C.dayKey = function (a, iso) { return parts(iso, a.sel.calendarZone(a.view)).day; };
  WB.calendar = C;
})(typeof globalThis !== "undefined" ? globalThis : this);
