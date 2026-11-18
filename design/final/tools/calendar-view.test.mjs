import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { WB } from "./spine_helpers.mjs";

const fake = { P: WB.P, esc: WB.esc, goHref: WB.goHref };
vm.runInNewContext(fs.readFileSync(new URL("../pages/calendar.js", import.meta.url), "utf8"), { WB: fake, Intl, Date, Set, isFinite, isNaN });
const C = fake.calendar;
const item = (id, start, end, extra = {}) => ({ id, name: id, start, end, kind: "class", courseId: "c", courseLabel: "Course C", source: "course", ...extra });
function args(entries = [], page = "W07", sizeClass = "regular", clock = "2026-10-21T12:00:00-04:00") {
  return { page: { id: page }, sizeClass, who: { courseId: "c" }, view: { clock }, K: WB.K,
    sel: { calendarZone: () => "America/New_York", calendarCourses: () => [{ id: "c", code: "C", title: "Course" }], calendarEntries: (_v, _w, scope) => entries.filter((e) => scope === null || e.courseId === scope) } };
}
const plain = (v) => JSON.parse(JSON.stringify(v));

test("calendar normalizes authorized scope and civil day without moving the clock", () => {
  const a = args([], "W07", "regular", "2026-10-21T01:00:00Z");
  assert.equal(C.normalize(a, {}).day, "2026-10-20");
  assert.equal(C.normalize(a, {}).mode, "week");
  assert.equal(C.normalize(args([], "W07", "compact"), {}).mode, "agenda");
  const bad = C.normalize(a, { courseId: "foreign" });
  assert.notEqual(C.normalize(a, bad).courseId, null);
  assert.match(C.render(a, bad), /not available for your course role/);
  assert.notEqual(C.normalize(args([], "W32"), { courseId: null }).courseId, null);
  assert.equal(a.view.clock, "2026-10-21T01:00:00Z");
});

test("calendar navigates leap days and month ends; week starts Monday and agenda spans eight days", () => {
  const a = args(), state = { mode: "month", day: "2024-01-31", courseId: null, selected: "x" };
  const feb = C.reduce(a, state, "next");
  assert.equal(feb.day, "2024-02-29"); assert.equal(feb.selected, null);
  assert.equal(C.reduce(a, feb, "previous").day, "2024-01-29");
  const month = C.range(a, feb); assert.equal(month.days.length, 42); assert.equal(month.fromDay, "2024-01-29");
  const week = C.range(a, { mode: "week", day: "2026-10-21" });
  assert.equal(week.fromDay, "2026-10-19"); assert.equal(week.toDay, "2026-10-26");
  const agenda = C.range(a, { mode: "agenda", day: "2026-10-21" });
  assert.equal(agenda.days.length, 8); assert.equal(agenda.toDay, "2026-10-29");
  const forward = C.reduce(a, { mode: "week", day: "2026-10-21" }, "next");
  assert.equal(C.reduce(a, forward, "previous").day, "2026-10-21");
});

test("calendar projects events in institution timezone across DST and clips midnight end", () => {
  const a = args([item("before DST", "2026-11-01T05:30:00Z", "2026-11-01T06:30:00Z"), item("ends midnight", "2026-11-01T23:00:00-05:00", "2026-11-02T00:00:00-05:00")]);
  const html = C.render(a, { mode: "agenda", day: "2026-11-01" });
  assert.match(html, /before DST/); assert.match(html, /1:30 AM/);
  assert.equal((html.match(/data-cal-value="ends midnight"/g) || []).length, 1);
  assert.ok(!html.includes("Nov 2"));
});

test("week uses lanes and deadline band, falls back for excessive overlaps, and shows selected detail", () => {
  const events = [item("lecture", "2026-10-21T09:00:00-04:00", "2026-10-21T10:00:00-04:00", { go: "W19", where: "Room" }), item("other", "2026-10-21T09:15:00-04:00", "2026-10-21T09:30:00-04:00"), item("due", "2026-10-21T12:00:00-04:00", "2026-10-21T12:00:00-04:00", { kind: "due" })];
  const a = args(events), html = C.render(a, { selected: "lecture" });
  assert.match(html, /wb-cal-lane-2/); assert.match(html, /Deadlines/); assert.match(html, /Close details/);
  assert.equal((html.match(/data-go="W19"/g) || []).length, 1);
  assert.match(html, /Room/);
  const many = Array.from({ length: 9 }, (_, i) => item(`event ${i}`, "2026-10-21T09:00:00-04:00", "2026-10-21T10:00:00-04:00"));
  assert.match(C.render(args(many), {}), /showing the schedule instead/);
});

test("calendar views provide scope, navigation, empty and selection reset", () => {
  const a = args(), s = C.normalize(a, { mode: "month", day: "2026-10-21", selected: "x" });
  assert.equal(C.reduce(a, s, "view", "agenda").selected, null);
  assert.equal(C.reduce(a, s, "course", "foreign").courseId, "__unavailable__");
  assert.equal(C.reduce(a, s, "close").selected, null);
  for (const mode of ["week", "month", "agenda"]) {
    const html = C.render(a, { mode });
    assert.match(html, /data-cal-op="previous"/); assert.match(html, /data-cal-op="course"/); assert.match(html, /All calendars/);
    assert.match(html, /No events/);
  }
  const scoped = C.render(args([], "W32"), {});
  assert.doesNotMatch(scoped, /All calendars/);
});

test("real selectors keep private events out of course and other-role calendars", () => {
  const v = WB.sel.scenarioView("default");
  function real(role, page) {
    const who = WB.sel.viewerFor(v, role);
    return { page: { id: page }, sizeClass: "regular", who, view: v, sel: WB.sel, K: WB.K, ns: "test" };
  }
  const student = real("student", "W07"), instructor = real("instructor", "W07");
  const own = WB.sel.calendarEntries(v, student.who, null).find((e) => e.private);
  assert.ok(own);
  assert.ok(C.render(student, {}).includes(WB.esc(own.name)));
  assert.ok(!C.render(real("student", "W32"), {}).includes(WB.esc(own.name)));
  assert.ok(!C.render(instructor, {}).includes(WB.esc(own.name)));
});

test("empty presets do not render records, and reset clears filters", () => {
  const event = item("hidden event", "2026-10-21T09:00:00-04:00", "2026-10-21T10:00:00-04:00");
  for (const state of ["firstUseEmpty", "filteredEmpty"]) {
    const a = { ...args([event]), state };
    const html = C.render(a, {});
    assert.ok(!html.includes("hidden event"));
    assert.equal(C.visibleEntries(a, {}).length, 0);
    if (state === "filteredEmpty") assert.match(html, /data-cal-op="reset"/);
  }
  assert.equal(C.reduce(args(), { mode: "month", day: "2024-01-31", courseId: "c" }, "reset").mode, "week");
  assert.equal(C.dayKey(args(), "2026-10-21T01:00:00Z"), "2026-10-20");
});

test("W32 switches to any authorized course and rejects foreign scope", () => {
  const a = args([], "W32");
  a.sel.calendarCourses = () => [{ id: "c", title: "First" }, { id: "c2", title: "Second" }];
  assert.equal(C.reduce(a, {}, "course", "c2").courseId, "c2");
  assert.equal(C.normalize(a, { courseId: null }).courseId, "c");
  assert.equal(C.reduce(a, {}, "course", "foreign").courseId, "__unavailable__");
});

test("calendar controls have stable focus targets and multiday chips describe their segments", () => {
  const events = [item("Overnight", "2026-10-21T23:00:00-04:00", "2026-10-22T01:30:00-04:00", { go: "W19", where: "Room" })];
  const a = args(events), html = C.render(a, { mode: "agenda", selected: "Overnight" });
  for (const suffix of ["previous", "next", "today", "course", "view-week", "view-month", "view-agenda", "detail"]) assert.ok(html.includes(`calendar-${suffix}"`), suffix);
  assert.ok(html.includes("Times shown in America/New_York"));
  assert.match(html, /wb-cal-event-name/); assert.match(html, /wb-cal-event-time/);
  assert.match(html, /11:00 PM[^<]*continues next day/);
  assert.match(html, /Continues[^<]*1:30 AM/);
  assert.match(html, /aria-label="Details for Overnight"/);
  assert.equal((html.match(/data-go="W19"/g) || []).length, 1);
  assert.match(html, /calendar-detail" tabindex="-1"/);
  const month = C.render(args(), { mode: "month" });
  assert.equal((month.match(/No events/g) || []).length, 1);
});

test("DST transitions use exact zoned details and schedule fallback in chronological order", () => {
  const fall = [item("Later", "2026-11-01T06:10:00Z", "2026-11-01T06:20:00Z"), item("Earlier", "2026-11-01T05:45:00Z", "2026-11-01T06:15:00Z")];
  const a = args(fall), html = C.render(a, { mode: "week", day: "2026-11-01", selected: "Earlier" });
  assert.match(html, /Daylight-saving time change: showing exact times in Schedule/);
  assert.ok(html.indexOf('wb-cal-event-name">Earlier') < html.indexOf('wb-cal-event-name">Later'));
  assert.match(html, /1:45 AM EDT/); assert.match(html, /1:15 AM EST/);
  const spring = item("Spring", "2026-03-08T06:30:00Z", "2026-03-08T07:30:00Z");
  const sh = C.render(args([spring]), { mode: "week", day: "2026-03-08", selected: "Spring" });
  assert.match(sh, /Daylight-saving time change: showing exact times in Schedule/);
  assert.match(sh, /1:30 AM EST/); assert.match(sh, /3:30 AM EDT/);
});

test("each event occurrence has a stable distinct focus target", () => {
  const event = item("night", "2026-10-21T23:00:00-04:00", "2026-10-22T01:00:00-04:00", { go: "W19" });
  const html = C.render(args([event]), { mode: "agenda" });
  assert.match(html, /id="[^"]*calendar-event-night-2026-10-21" data-cal-day="2026-10-21"/);
  assert.match(html, /id="[^"]*calendar-event-night-2026-10-22" data-cal-day="2026-10-22"/);
});


test("separate repeated-hour events stay distinct rather than appearing to collide", () => {
  const a = args([item("First occurrence", "2026-11-01T01:15:00-04:00", "2026-11-01T01:35:00-04:00"), item("Second occurrence", "2026-11-01T01:15:00-05:00", "2026-11-01T01:35:00-05:00")]);
  const html = C.render(a, { mode: "week", day: "2026-11-01" });
  assert.match(html, /Daylight-saving time change/);
  assert.ok(!html.includes('class="wb-cal-week"'));
  assert.ok(html.indexOf("First occurrence") < html.indexOf("Second occurrence"));
  assert.match(html, /EDT/); assert.match(html, /EST/);
});
