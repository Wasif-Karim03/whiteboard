// Calendar scope, route and local-state integration. Source/mock checks, not browser acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { WB, S, view, viewer, copy, frame } from "./spine_helpers.mjs";
const C = WB.calendar;
function args(page = "W07", role = "student", data = null, scenario = "default") {
  const v = data ? S.buildView(data, scenario) : view(scenario);
  return { page: WB.pageFor(page).page, ctx: WB.ctx({ platform: "web", role }), sizeClass: "regular", platform: "web", role, sel: S, K: WB.K, WB, view: v, who: S.viewerFor(v, role), ns: "test-c" };
}
function render(a, calendar) {
  const result = WB.pageFor(a.page.id).render({ ...a, calendar });
  return { result, html: WB.K.shell(a.ctx, { ...result, ns: "test", hrefs: WB.manifest.navigation.hrefs }) };
}

test("combined calendar collects every enrolled course; course scope excludes private and foreign dates", () => {
  const data = copy(WB.data), a = args(), courses = S.calendarCourses(a.view, a.who);
  const other = courses.find((c) => c.id !== a.who.courseId && !c.archived);
  assert.ok(other);
  const event = { ...data.calendar.events.find((e) => e.visibility === "course"), id: "second-course-class", course_id: other.id, name: "Second course seminar" };
  data.calendar.events.push(event);
  const base = data.coursework.assessments.find((x) => x.published);
  data.coursework.assessments.push({ ...base, id: "second-course-work", course_id: other.id, title: "Second course coursework", quiz_id: null, due: event.start });
  const b = args("W07", "student", data);
  const all = S.calendarEntries(b.view, b.who, null);
  assert.ok(all.some((e) => e.id === event.id));
  assert.ok(all.some((e) => e.id === "due-second-course-work"));
  const only = S.calendarEntries(b.view, b.who, other.id);
  assert.ok(only.length >= 2 && only.every((e) => e.courseId === other.id && !e.private));
  for (const entry of only.filter(e => e.go)) {
    const resolved = WB.viewer.parseHash("#/" + entry.go, { current: { ...WB.viewer.DEFAULTS, role: "student" } });
    assert.equal(resolved.vs.role, "student");
    assert.equal(resolved.vs.selection.courseId, other.id);
    assert.equal(resolved.vs.selection.assessmentId, entry.id.replace(/^due-/, ""));
  }
  assert.deepEqual(Array.from(S.calendarEntries(b.view, b.who, "not-enrolled")), []);
  const privateEvent = data.calendar.events.find((e) => e.visibility === "private");
  privateEvent.course_id = a.who.courseId;
  const c = args("W32", "student", data);
  assert.ok(!S.calendarEntries(c.view, c.who, c.who.courseId).some((e) => e.id === privateEvent.id));
  assert.ok(S.calendarEntries(c.view, c.who, null).some((e) => e.id === privateEvent.id));
});

test("every enrolled course has a calendar entry and an honest empty course view", () => {
  const a = args("W32"), other = S.calendarCourses(a.view, a.who).find((c) => c.archived);
  assert.equal(S.calendarEntries(a.view, a.who, other.id).length, 0);
  const { html, result } = render(a, { courseId: other.id });
  assert.ok(result.title.includes(other.code));
  assert.match(html, /No events in this period/);
  assert.ok(!html.includes('data-go="W18"'), "unimplemented course pages are not implied by a PHYS-bound course shell");
  const denied = render(a, { courseId: "not-enrolled" }).html;
  assert.match(denied, /You are not enrolled in this course/);
  assert.ok(!denied.includes("wb-cal-event"));
  for (const platform of ["web", "ipad", "iphone"]) {
    const html = frame({ page: "W06", role: "student", platform }).html;
    for (const course of S.calendarCourses(a.view, a.who).filter((c) => !c.archived)) assert.ok(html.includes(`data-cal-value="${course.id}"`));
  }
});

test("calendar excludes unpublished deadlines and expired TA tasks without changing the authority clock", () => {
  const data = copy(WB.data), event = data.coursework.assessments.find((x) => x.published);
  event.published = false;
  const a = args("W07", "student", data);
  assert.ok(!S.calendarEntries(a.view, a.who, null).some((e) => e.id === "due-" + event.id));
  const expired = args("W07", "ta", null, "ta_expired");
  assert.ok(!S.calendarEntries(expired.view, expired.who, null).some((e) => e.kind === "gradingTask"));
  const clock = expired.view.clock;
  const old = C.reduce(expired, {}, "previous");
  const html = C.render(expired, old);
  assert.equal(expired.view.clock, clock);
  assert.ok(!html.includes('data-go="W48"'));
});

test("local period clicks retain focus targets and can switch views without changing route or scenario", () => {
  const src = fs.readFileSync(new URL("../viewer/app.js", import.meta.url), "utf8");
  const fn = src.slice(src.indexOf("  function calendarAction("), src.indexOf("  // ---------- Stage clicks"));
  const a = args(), focused = [], route = { page: "W07", role: "student", scenario: "default" };
  let draws = 0;
  const elements = { prev: { focus: () => focused.push("prev") }, "p-c-calendar-period": { textContent: "Period", focus: () => focused.push("period") } };
  const ctx = vm.createContext({ modal: null, current: route, calendarState: null, WB, NS: "p", calendarArgs: () => a, stage: () => ({ querySelector: () => null }), teardownModal: () => {}, renderStage: () => { draws += 1; }, $: (id) => elements[id], setStatus: () => {} });
  vm.runInContext(fn, ctx);
  const control = (op, value = null) => ({ id: "prev", tagName: "BUTTON", getAttribute: (key) => key === "data-cal-op" ? op : key === "data-cal-value" ? value : null });
  const original = C.normalize(a, {});
  for (let i = 0; i < 2; i += 1) ctx.calendarAction({ preventDefault: () => {} }, control("previous"));
  assert.equal(ctx.calendarState.day, C.reduce(a, C.reduce(a, original, "previous"), "previous").day);
  ctx.calendarAction({ preventDefault: () => {} }, control("view", "month"));
  assert.equal(ctx.calendarState.mode, "month");
  assert.equal(draws, 3); assert.deepEqual(focused, ["prev", "prev", "prev"]);
  assert.deepEqual(route, { page: "W07", role: "student", scenario: "default" });
});

test("opening an enrolled course calendar preserves role and clock through the real route reducer", () => {
  const src = fs.readFileSync(new URL("../viewer/app.js", import.meta.url), "utf8");
  const fn = src.slice(src.indexOf("  function calendarAction("), src.indexOf("  // ---------- Stage clicks"));
  const a = args("W06"), course = S.calendarCourses(a.view, a.who).find((c) => c.id !== a.who.courseId);
  const current = WB.viewer.normalize(WB, { ...WB.viewer.DEFAULTS, page: "W06", role: "student" }).vs;
  let applied;
  const ctx = vm.createContext({ modal: null, current, WB, V: WB.viewer, calendarArgs: () => a, apply: (r) => { applied = r; }, setStatus: () => {} });
  vm.runInContext(fn, ctx);
  const ctrl = { tagName: "BUTTON", getAttribute: (k) => k === "data-cal-op" ? "open-course" : k === "data-cal-value" ? course.id : null };
  ctx.calendarAction({ preventDefault: () => {} }, ctrl);
  assert.ok(applied && applied.vs.page === "W32");
  assert.equal(applied.vs.role, current.role); assert.equal(applied.vs.scenario, current.scenario);
  assert.equal(ctx.pendingCalendarScope, course.id);
});

test("calendar projection works through the data-only loader without page helpers", async () => {
  const { loadAll } = await import("./load_data.mjs");
  const W = loadAll(), v = W.sel.scenarioView("default"), who = W.sel.viewerFor(v, "student");
  assert.equal(W.P, undefined);
  const entries = W.sel.calendarEntries(v, who, null);
  assert.ok(entries.length && entries.some((e) => e.go));
  for (const e of entries.filter((x) => x.go)) assert.ok(W.manifest.pagesById[e.go.split(/[?:~]/)[0]]);
});

test("private event dialogs respect the selected course and visible period", () => {
  const a = { ...args(), state: "destructive" };
  const other = S.calendarCourses(a.view, a.who).find((c) => c.archived);
  const own = S.calendarEntries(a.view, a.who, null).find((e) => e.private);
  for (const calendar of [{ courseId: other.id }, { mode: "month", day: "2030-01-01" }]) {
    const { html } = render(a, calendar);
    assert.equal(WB.viewer.openDialogIds(html).length, 0);
    assert.ok(!html.includes(own.name));
    assert.match(html, /You have no private event in this period/);
  }
  const courseHtml = render(args(), { courseId: other.id }).html;
  assert.ok(courseHtml.includes(`data-cal-op="open-course" data-cal-value="${other.id}"`));
});

for (const mode of ["week", "month"]) test(`${mode} event details restore occurrence focus and both scroll axes`, () => {
  const src = fs.readFileSync(new URL("../viewer/app.js", import.meta.url), "utf8");
  const fn = src.slice(src.indexOf("  function calendarAction("), src.indexOf("  // ---------- Stage clicks"));
  const a = args(), own = S.calendarEntries(a.view, a.who, null).find((e) => e.private);
  const focused = [], notices = [], scroll = { scrollTop: 720, scrollLeft: 215 };
  const ids = { occurrence: { focus: () => focused.push("occurrence") }, "p-c-calendar-detail": { focus: () => focused.push("detail") }, "p-c-calendar-period": { textContent: "Period", focus: () => focused.push("period") } };
  const ctx = vm.createContext({ modal: null, current: { page: "W07" }, calendarState: C.normalize(a, { mode }), calendarOpener: null, WB, NS: "p", calendarArgs: () => a, stage: () => ({ querySelector: (selector) => { assert.ok(selector.includes(".wb-cal-month") && selector.includes(".wb-cal-week")); return scroll; } }), teardownModal: () => {}, renderStage: () => { scroll.scrollTop = 0; scroll.scrollLeft = 0; }, $: (id) => ids[id], setStatus: (_text, quiet) => notices.push(quiet) });
  vm.runInContext(fn, ctx);
  const control = (op) => ({ id: op === "event" ? "occurrence" : "close", tagName: "BUTTON", getAttribute: (k) => k === "data-cal-op" ? op : k === "data-cal-value" ? own.id : null });
  ctx.calendarAction({ preventDefault: () => {} }, control("event"));
  assert.equal(ctx.calendarState.selected, own.id);
  ctx.calendarAction({ preventDefault: () => {} }, control("close"));
  assert.deepEqual(focused, ["detail", "occurrence"]);
  assert.equal(scroll.scrollTop, 720); assert.equal(scroll.scrollLeft, 215);
  assert.deepEqual(notices, [true, true]);
});
