// Tests for the design/final kit: loads it in a bare node:vm context and renders every component
// across WB.CONTEXTS, checking markup with checkHtml. Source checks only, not browser acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { loadKit, KIT_FILES, KIT_DIR } from "./load_kit.mjs";
import { checkHtml, isSafeHref } from "./html_check.mjs";
import { renderMatrix, shellOpts, deepFreeze, ROLES_ALL } from "./load_kit.mjs";

const WB = loadKit();
const K = WB.K;
const ctxs = (role = "student", extra = {}) => WB.CONTEXTS.map((c) => ({ name: c.name, ctx: WB.ctx({ ...c, role, ...extra }) }));
const clean = (html, label) => assert.deepEqual(checkHtml(html), [], `${label}\n${html.slice(0, 600)}`);
const count = (html, re) => (html.match(re) || []).length;
const BD39 = [
  "Not started", "Draft", "Queued", "Received", "Received · Feedback not released yet", "Late", "Held", "Graded",
  "Released", "Feedback updated", "Missing", "Not received · closed", "Excused", "Needs action",
];

test("loadKit runs in a bare vm and each load gives an independent WB", () => {
  const a = loadKit();
  const b = loadKit();
  assert.notEqual(a, b);
  a.K.extra = 1;
  assert.equal(b.K.extra, undefined);
  assert.equal(KIT_FILES.length, 9);
  for (const f of KIT_FILES) assert.ok(fs.existsSync(path.join(KIT_DIR, f)), f);
});

test("kit sources obey the step 1 bans", () => {
  const bans = [
    [/\b(import|export)\s/, "module syntax"], [/\brequire\(/, "require"], [/\bmodule\b/, "module"], [/\bwindow\b/, "window"],
    [/\bdocument\b/, "document"], [/\bDate\b/, "Date"], [/Math\.random/, "Math.random"], [/\son[a-z]+=/i, "inline handler"],
    [/<script/i, "<script>"], [/#[0-9a-fA-F]{3,8}\b/, "hex colour"], [/\b(rgb|rgba|hsl|hsla)\(/, "colour function"],
    [/\b[A-Z]{2,5} \d{3}\b/, "course code"], [/\bDr\.|\bProf\.|Reyes|University|College|Section 0/, "fictional people or school"],
    [/\b(cobalt|violet|coral|forest|amber)\b|["'](ink|night)["']/i, "theme id"], [/\blogos\b|lg-cur|["']slip["']/, "alternate logo"],
  ];
  for (const f of KIT_FILES) {
    const src = fs.readFileSync(path.join(KIT_DIR, f), "utf8");
    assert.match(src, /^\/\*[\s\S]*?\*\/\s*\(function \(root\) \{\s*"use strict";/, `${f} shape`);
    assert.match(src, /\}\)\(typeof globalThis !== "undefined" \? globalThis : this\);\s*$/, `${f} shape end`);
    for (const [re, what] of bans) assert.doesNotMatch(src, re, `${f}: ${what}`);
  }
});

test("every component renders clean, pure and deterministic in every context and role", () => {
  let n = 0;
  for (const role of ROLES_ALL)
    for (const { name, ctx } of ctxs(role, { tier: "review" })) {
      for (const [label, render] of renderMatrix(K, WB, ctx)) {
        const first = render();
        clean(first, `${name}/${role}: ${label}`);
        assert.equal(render(), first, `${label} is deterministic`);
        n += 1;
      }
    }
  assert.ok(n > 300, `rendered ${n} cases`);
});

test("dialog variant follows the platform", () => {
  const want = { "web-regular": "modal", "web-compact": "modal", "ipad-regular": "formsheet", "ipad-compact": "formsheet", "iphone-compact": "sheet" };
  for (const { name, ctx } of ctxs()) {
    const html = K.dialog(ctx, deepFreeze({ id: "dlg", title: "Sample item", body: "<p>Body</p>", actions: [{ id: "dlg-ok", label: "Confirm", kind: "primary" }] }));
    assert.match(html, new RegExp(`wb-dialog--${want[name]}\\b`), name);
    assert.match(html, /role="dialog" aria-modal="true" aria-labelledby="dlg-title" data-return-focus hidden/);
    assert.match(html, /data-act="close-dialog" data-target="dlg"/);
    assert.equal(/wb-dialog__grabber/.test(html), want[name] === "sheet");
  }
  const [ipad, iphone] = [WB.ctx({ platform: "ipad", role: "student" }), WB.ctx({ platform: "iphone", role: "student" })];
  assert.match(K.dialog(ipad, { id: "p", title: "T", body: "B", presentation: "popover" }), /wb-dialog--popover/);
  assert.match(K.dialog(iphone, { id: "c", title: "T", body: "B", kind: "capture" }), /wb-dialog--fullscreen/);
  const destructive = K.dialog(iphone, { id: "d", title: "T", body: "B", kind: "destructive", open: true, actions: [{ id: "d-ok", label: "Delete" }] });
  assert.match(destructive, /wb-btn--danger[^>]*id="d-ok"/);
  assert.doesNotMatch(destructive, / hidden(?=[ >])/);
  assert.throws(() => K.dialog(ipad, { title: "T", body: "B" }), /WB\.K\.dialog: a caller-supplied id/);
});

test("split shows two panes when regular and one pane with Back when compact", () => {
  for (const { name, ctx } of ctxs()) {
    const o = deepFreeze({ id: "sp", listLabel: "Items", detailLabel: "Item detail", list: "<p>List</p>", detail: "<p>Detail</p>" });
    const list = K.split(ctx, o);
    const detail = K.split(ctx, { ...o, selected: true });
    if (ctx.sizeClass === "regular") {
      assert.equal(count(list, /<section /g), 2, name);
      assert.match(list, ctx.platform === "ipad" ? /wb-split--splitview/ : /wb-split--columns/);
      assert.doesNotMatch(list, /Back to/);
    } else {
      assert.equal(count(list, /<section /g), 1, name);
      assert.match(list, /wb-split--push/);
      assert.match(list, /wb-split__pane--list/);
      assert.match(detail, /wb-split__pane--detail/);
      assert.match(detail, /data-act="back"[^>]*>.*Back to Items/);
    }
  }
});

test("table renders a <table> with aria-sort when regular and row-cards with a sort control when compact", () => {
  const o = deepFreeze({
    id: "tb", caption: "Sample items",
    columns: [{ key: "name", label: "Item", primary: true, sortable: true }, { key: "due", label: "Due date", sortable: true, sortLabels: { asc: "earliest first", desc: "latest first" } }, { key: "n", label: "Count", numeric: true }],
    rows: [{ id: "r1", cells: { name: "Sample item", due: "Mon", n: "3" }, go: "W05" }, { id: "r2", cells: { name: "Second item", due: "Tue", n: "4" } }],
    sort: { key: "due", dir: "desc" }, selectedId: "r2", empty: { title: "No items" },
  });
  for (const { name, ctx } of ctxs()) {
    const html = K.table(ctx, o);
    if (ctx.sizeClass === "regular") {
      assert.match(html, /<table class="wb-table" id="tb"><caption>Sample items<\/caption>/, name);
      assert.match(html, /<th scope="col" aria-sort="descending"><button type="button" class="wb-sortbtn" data-act="sort" data-target="tb" data-key="due">/);
      assert.match(html, /<th scope="col" aria-sort="none"><button/);
      assert.match(html, /<th scope="row"><a class="wb-link" href="#\/W05"/);
      assert.doesNotMatch(html, /wb-rowcards/);
    } else {
      assert.match(html, /<ul class="wb-rowcards" id="tb" aria-label="Sample items">/, name);
      assert.match(html, /<label class="wb-field__label" for="tb-sort">Sort by<\/label><select class="wb-select" id="tb-sort" data-act="sort" data-target="tb">/);
      assert.match(html, /<option value="due:desc" selected>Due date, latest first<\/option>/);
      assert.match(html, /<option value="due:asc">Due date, earliest first<\/option>/);
      assert.doesNotMatch(html, /<table/);
    }
    clean(html, name);
    assert.match(K.table(ctx, { ...o, rows: [] }), /wb-empty/);
  }
});

test("actions render a toolbar on web and iPad and a dock with More actions on iPhone", () => {
  const acts = deepFreeze([{ label: "Secondary one" }, { label: "Main action", kind: "primary" }, { label: "Secondary two" }, { label: "Third", kind: "quiet" }]);
  for (const { name, ctx } of ctxs()) {
    const html = K.actions(ctx, acts);
    if (ctx.platform === "iphone") {
      assert.equal(K.actionsPlacement(ctx), "dock");
      assert.match(html, /^<div class="wb-dock"/);
      const beforeMenu = html.split('<details class="wb-more">')[0];
      assert.equal(count(beforeMenu, /<button /g), 2);
      assert.match(beforeMenu, /wb-btn--primary/);
      assert.match(html, /More actions<\/summary>.*Secondary two.*Third/);
    } else {
      assert.equal(K.actionsPlacement(ctx), "header", name);
      assert.match(html, /^<div class="wb-toolbar" role="toolbar" aria-label="Page actions">/);
      assert.equal(count(html, /<button /g), 4);
    }
  }
  assert.equal(K.actions(WB.ctx({ platform: "iphone", role: "student" }), []), "");
});

test("disabled dock actions keep their wrapper and reason as direct dock children, with long labels and unbroken reasons", () => {
  const longReason = "Unavailable-until-the-registrar-confirms-the-enrolment-hold-is-cleared-for-this-term-and-course";
  const acts = deepFreeze([
    { label: "Submit the complete application packet for second review", kind: "primary", disabled: true, reason: longReason, id: "dock-primary" },
    { label: "Download every supporting document for the audit file", disabled: true, reason: longReason, id: "dock-secondary" },
  ]);
  const html = K.actions(WB.ctx({ platform: "iphone", role: "student" }), acts);
  clean(html, "iphone dock with two disabled actions");
  const beforeMenu = html.split('<details class="wb-more">')[0];
  assert.match(beforeMenu, /^<div class="wb-dock"/);
  assert.equal(count(beforeMenu, /<span class="wb-btnwrap"><button /g), 2);
  assert.equal(count(beforeMenu, /<span class="wb-btn__reason"/g), 2);
});

test("app shells have five global nav links and three utility links in every context", () => {
  for (const role of ROLES_ALL)
    for (const { name, ctx } of ctxs(role)) {
      const html = K.shell(ctx, deepFreeze(shellOpts("s1", { navActive: "courses" })));
      clean(html, `${name}/${role}`);
      assert.equal(count(html, /<main\b/g), 1);
      assert.equal(count(html, /<h1\b/g), 1);
      assert.match(html, /<nav class="[^"]*" aria-label="Main">/);
      const primary = [...html.matchAll(/<a [^>]*data-nav="(today|courses|calendar|activity|tools)"[^>]*>.*?<\/a>/g)];
      assert.equal(primary.length, 5, `${name}: five primary items`);
      assert.deepEqual(primary.map((m) => m[0].replace(/<[^>]*>/g, "").trim()), [role === "instructor" ? "Teaching" : role === "ta" ? "My grading" : "Today", role === "instructor" || role === "ta" ? "My courses" : "Courses", "Calendar", "Activity", "Tools"]);
      assert.match(html, /<a [^>]*href="#\/W02"[^>]*data-nav="courses" aria-current="page"/);
      for (const u of ["search", "help", "account"]) {
        const m = new RegExp(`<a [^>]*data-nav="${u}"[^>]*>(.*?)</a>`).exec(html);
        assert.ok(m, `${name}: ${u} reachable`);
        assert.ok(m[1].replace(/<[^>]*>/g, "").trim(), `${name}: ${u} has a name`);
      }
    }
});

test("platform shell specifics: frames, iPhone chrome, narrow bottom bar and Menu, iPad toggle", () => {
  const get = (name, role = "student") => K.shell(ctxs(role).find((c) => c.name === name).ctx, shellOpts("s2"));
  const phone = get("iphone-compact");
  assert.match(phone, /^<div class="wb-frame wb-frame--iphone"/);
  assert.match(phone, /class="wb-statusbar" aria-hidden="true"/);
  assert.match(phone, /class="wb-tabbar" aria-label="Main"/);
  assert.match(phone, /class="wb-homeindicator"/);
  assert.match(phone, /class="wb-titlebtn" aria-expanded="false" aria-controls="s2-sections"/);
  for (const chrome of [/safari/i, /address bar/i, /https?:\/\//, /\.com\b/, /reload/i]) assert.doesNotMatch(phone, chrome);
  const narrow = get("web-compact");
  assert.match(narrow, /data-width="narrow"/);
  assert.match(narrow, /<nav class="wb-bottombar" aria-label="Main">/);
  assert.match(narrow, /<details class="wb-menu" id="s2-menu"><summary class="wb-menu__summary">.*Menu<\/summary>/);
  assert.match(narrow.split('<details class="wb-menu"')[1].split("</details>")[0], /aria-label="Course sections"/);
  const wide = get("web-regular", "instructor");
  assert.match(wide, /<aside class="wb-sidebar">/);
  assert.match(wide, /aria-label="Course tools"/);
  assert.match(wide, /class="wb-tabs" aria-label="Course sections"/);
  assert.doesNotMatch(get("web-regular", "student"), /Course tools/);
  const portrait = get("ipad-compact");
  assert.match(portrait, /<aside class="wb-sidebar wb-sidebar--ipad" id="s2-sidebar" hidden>/);
  assert.match(portrait, /<button [^>]*aria-label="Show sidebar"[^>]*aria-expanded="false" aria-controls="s2-sidebar" data-act="toggle" data-target="s2-sidebar"/);
  assert.match(get("ipad-regular"), /<aside class="wb-sidebar wb-sidebar--ipad" id="s2-sidebar">.*aria-expanded="true"/);
  assert.match(get("ipad-regular", "ta"), /<details class="wb-popover" id="s2-tools"><summary class="wb-popover__summary">.*Tools<\/summary>/);
  assert.match(get("ipad-regular"), /data-orientation="landscape"/);
});

test("access mode keeps frame, logo and help links with no primary navigation", () => {
  const cases = { "guest sign-in": "Sign in", "expired session": "Your session ended" };
  for (const [what, title] of Object.entries(cases))
    for (const { name, ctx } of ctxs("guest")) {
      const html = K.shell(ctx, deepFreeze({ ns: "acc", mode: "access", title, body: "<p>Sample text</p>", links: [{ label: "Help", go: "W90" }, { label: "Recover access", go: "W91:start" }] }));
      clean(html, `${what}/${name}`);
      assert.doesNotMatch(html, /data-nav=/, `${what}/${name}`);
      assert.doesNotMatch(html, /wb-sidebar|wb-tabbar|wb-bottombar|wb-tabs|wb-accountmenu/);
      assert.match(html, /wb-logo/);
      assert.match(html, /aria-label="Help and recovery"/);
      assert.equal(count(html, /<h1\b/g), 1);
      if (ctx.platform === "iphone") assert.match(html, /wb-statusbar.*wb-homeindicator/);
    }
});

test("two shells with different ns, disabled buttons and dialogs compose into one valid document", () => {
  for (const { name, ctx } of ctxs("instructor")) {
    const part = (ns) => {
      const body = K.button({ id: `${ns}-b1`, label: "Publish", disabled: true, reason: "Waiting for review" }) + K.button({ id: `${ns}-b2`, label: "Archive", disabled: true, reason: "Owned by another instructor" }) +
        K.button({ label: "Open dialog", act: "open-dialog", target: `${ns}-dlg` });
      const dialog = K.dialog(ctx, { id: `${ns}-dlg`, title: "Confirm", body: "<p>Sure?</p>", actions: [{ id: `${ns}-dlg-ok`, label: "Confirm", kind: "primary" }] });
      return K.shell(ctx, shellOpts(ns, { body, dialog }));
    };
    clean(part("one") + part("two"), name);
  }
});

test("status labels are BD39's and visibility is enforced by throwing", () => {
  assert.deepEqual(Object.values(WB.STATUS).map((s) => s.label), BD39);
  const [student, instructor, ta, guest] = ["student", "instructor", "ta", "guest"].map((role) => WB.ctx({ platform: "web", role }));
  for (const k of ["held", "graded"]) assert.throws(() => K.status(k, student), /not visible to student/);
  for (const k of ["draft", "queued"]) for (const c of [instructor, ta]) assert.throws(() => K.status(k, c), /not visible/);
  assert.throws(() => K.status("draft", student, { own: false }), /not visible/);
  for (const k of ["missing", "excused"]) {
    assert.throws(() => K.status(k, student), /not visible/);
    assert.match(K.status(k, student, { released: true }), new RegExp(WB.STATUS[k].label));
    assert.match(K.status(k, instructor), /wb-status/);
  }
  assert.throws(() => K.status("late", student), /modifier/);
  assert.throws(() => K.status("draft", student, { late: true }), /only with Received/);
  assert.match(K.status("received", student, { late: true }), /Received<\/span><span class="wb-status__late">.*Late/);
  for (const k of Object.keys(WB.STATUS)) assert.throws(() => K.status(k, guest), /WB\.K\.status/);
  for (const k of Object.keys(WB.STATUS)) {
    const role = WB.STATUS[k].visibleTo[0];
    if (WB.STATUS[k].modifier) continue;
    const html = K.status(k, WB.ctx({ platform: "web", role }), { released: true });
    assert.match(html, /<svg class="wb-icon"/, k);
    assert.ok(html.includes(`<span class="wb-status__label">${WB.esc(WB.STATUS[k].label)}</span>`), k);
  }
});

test("save status covers the six C12 states", () => {
  const want = { dirty: "Unsaved changes", saving: "Saving…", saved: "Saved", savedLocal: "Saved locally", failed: "Save failed", conflict: "Conflict" };
  assert.deepEqual(Object.keys(WB.SAVE_STATES), Object.keys(want));
  for (const [k, label] of Object.entries(want)) assert.ok(K.saveStatus(k).includes(label), k);
  assert.match(K.saveStatus("savedLocal", { time: "4:02 PM" }), /Saved locally 4:02 PM/);
  assert.throws(() => K.saveStatus("draft"), /unknown save state/);
});

test("choice groups group independently with distinct names and ids", () => {
  const q = (n) => K.choiceGroup({ id: `q${n}`, legend: `Question ${n}`, name: `q${n}`, type: "radio", options: [{ id: `q${n}-a`, value: "a", label: "Option A" }, { id: `q${n}-b`, value: "b", label: "Option B" }] });
  const html = q(1) + q(2);
  clean(html, "two questions");
  assert.equal(count(html, /<fieldset/g), 2);
  assert.equal(count(html, /name="q1"/g), 2);
  assert.equal(count(html, /name="q2"/g), 2);
  assert.throws(() => K.choiceGroup({ id: "x", legend: "L", name: "x", type: "radio", options: [{ id: "x-a", value: "a", label: "A" }, { id: "x-a", value: "b", label: "B" }] }), /duplicate option id/);
  assert.throws(() => K.choiceGroup({ id: "x", legend: "L", name: "x", type: "radio", options: [{ id: "x-a", value: "a", label: "A" }, { id: "x-b", value: "a", label: "B" }] }), /duplicate option value/);
  assert.throws(() => K.field({ id: "r", label: "R", type: "radio" }), /K\.choiceGroup/);
});

test("choice group option ids may not collide with the group id or its help/error ids", () => {
  const group = (ids, extra = {}) => () => K.choiceGroup({ id: "g", legend: "L", name: "g", type: "radio", help: "Help", error: "Error", ...extra, options: [{ id: ids[0], value: "a", label: "A" }, { id: ids[1], value: "b", label: "B" }] });
  for (const clash of ["g", "g-help", "g-error"]) assert.throws(group([clash, "g-b"]), /collides with the group id/, clash);
  assert.throws(group(["g-a", "g-help"], { help: undefined, error: undefined }), /collides/, "reserved even without help text");
  clean(group(["g-a", "g-b"])(), "no collision");
});

test("choice group option values like constructor and __proto__ are not treated as duplicates", () => {
  const html = K.choiceGroup({ id: "v", legend: "L", name: "v", type: "checkbox", options: [{ id: "v-a", value: "constructor", label: "A" }, { id: "v-b", value: "__proto__", label: "B" }, { id: "v-c", value: "toString", label: "C" }] });
  clean(html, "prototype-named values");
  assert.match(html, /value="constructor"/);
  assert.match(html, /value="__proto__"/);
  assert.throws(() => K.choiceGroup({ id: "w", legend: "L", name: "w", type: "radio", options: [{ id: "w-a", value: 1, label: "A" }, { id: "w-b", value: "1", label: "B" }] }), /duplicate option value/);
});

test("K.field restores non-default values for select, checkbox and toggle", () => {
  const opts = [{ value: "a", label: "Option A", selected: true }, { value: "b", label: "Option B" }, { value: "c", label: "Option C" }];
  const select = K.field(deepFreeze({ id: "s", label: "Pick", type: "select", value: "c", options: opts }));
  clean(select, "select");
  assert.match(select, /<option value="c" selected>Option C<\/option>/);
  assert.equal(count(select, / selected>/g), 1, "value takes precedence over option.selected");
  assert.match(K.field({ id: "s2", label: "Pick", type: "select", value: 2, options: [{ value: 1, label: "One" }, { value: 2, label: "Two" }] }), /<option value="2" selected>Two/);
  assert.match(K.field({ id: "s3", label: "Pick", type: "select", options: opts }), /<option value="a" selected>/, "without value, option.selected applies");
  assert.throws(() => K.field({ id: "s4", label: "Pick", type: "select", value: "z", options: opts }), /WB\.K\.field: value 'z' matches no select option/);
  for (const type of ["checkbox", "toggle"]) {
    const html = K.field({ id: `c-${type}`, label: "Agree", type, value: "on-site", checked: true });
    clean(html, type);
    assert.match(html, /<input [^>]*value="on-site"[^>]*checked/, type);
    assert.doesNotMatch(K.field({ id: `d-${type}`, label: "Agree", type }), /value=/, `${type} without value keeps the browser default`);
  }
});

test("action lists render destinations as <a href> and K.button rejects navigation", () => {
  assert.throws(() => K.button({ label: "Open", go: "W05" }), /WB\.K\.button: go and href are navigation; use K\.link/);
  assert.throws(() => K.button({ label: "Open", href: "https://example.org" }), /use K\.link/);
  const items = deepFreeze([{ label: "Main", kind: "primary" }, { label: "Open item", go: "W05:open", icon: "chev-r" }, { label: "Help", href: "help/index.html" }, { label: "Four" }]);
  const isDest = (html, label, href) => {
    const link = [...html.matchAll(/<a class="wb-btn wb-btn--secondary" href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].find((m) => m[1] === href);
    assert.ok(link, `${label} renders as <a href="${href}">`);
    assert.match(link[2], new RegExp(`<span class="wb-btn__label">${label}</span>$`));
    assert.doesNotMatch(html, /<button [^>]*data-go=/);
  };
  for (const { name, ctx } of ctxs()) {
    const html = K.actions(ctx, items);
    clean(html, name);
    isDest(html, "Open item", "#/W05:open");
    assert.match(html, /href="#\/W05:open" data-go="W05:open"/);
    isDest(html, "Help", "help/index.html");
    const dialog = K.dialog(ctx, deepFreeze({ id: "dd", title: "T", body: "<p>B</p>", kind: "destructive", actions: [{ id: "dd-go", label: "View details", go: "W05", kind: "quiet" }] }));
    clean(dialog, `${name} dialog`);
    assert.match(dialog, /<a class="wb-btn wb-btn--quiet" id="dd-go" href="#\/W05" data-go="W05">/);
    const notice = K.notice(deepFreeze({ tone: "info", title: "T", actions: [{ label: "Open item", go: "W05" }] }));
    assert.match(notice, /<a class="wb-btn wb-btn--secondary" href="#\/W05" data-go="W05">/);
  }
  const dock = K.actions(WB.ctx({ platform: "iphone", role: "student" }), items);
  assert.match(dock.split('<details class="wb-more">')[1], /<a class="wb-btn wb-btn--secondary" href="help\/index.html">/, "a destination under More actions");
  assert.throws(() => K.actions(WB.ctx({ platform: "web", role: "student" }), [{ label: "X", go: "W05", disabled: true, reason: "R", id: "x" }]), /cannot be disabled/);
  assert.throws(() => K.actions(WB.ctx({ platform: "web", role: "student" }), [{ label: "X", href: "javascript:alert(1)" }]), /WB\.K\.actions/);
});

test("guards: disabled needs a reason, icon-only needs a name, unknown keys throw, ids are required", () => {
  assert.throws(() => K.button({ label: "Go", disabled: true, id: "b" }), /WB\.K\.button: disabled requires a reason/);
  assert.throws(() => K.button({ label: "Go", disabled: true, reason: "Why" }), /caller-supplied id/);
  assert.throws(() => K.button({ icon: "x", iconOnly: true }), /iconOnly requires icon and ariaLabel/);
  assert.throws(() => WB.ctx({ platform: "android", role: "student" }), /WB\.K\.ctx: unknown platform/);
  assert.throws(() => K.icon("nope"), /WB\.K\.icon: unknown icon/);
  assert.throws(() => WB.courseArt("bio"), /unknown course key/);
  assert.throws(() => K.badge({ label: "x", tone: "pink" }), /unknown tone/);
  assert.throws(() => K.field({ label: "Name" }), /WB\.K\.field: a caller-supplied id/);
  assert.throws(() => K.disclosure({ summary: "S", body: "B" }), /caller-supplied id/);
  assert.throws(() => K.table(WB.ctx({ platform: "web", role: "ta" }), { caption: "C", columns: [{ key: "a", label: "A" }], rows: [], empty: { title: "E" } }), /caller-supplied id/);
  const web = WB.ctx({ platform: "web", role: "student" });
  assert.throws(() => K.shell(web, { ...shellOpts("s"), ns: undefined }), /missing required field 'ns'/);
  assert.throws(() => K.shell(web, { ...shellOpts("s"), hrefs: undefined }), /hrefs/);
  assert.throws(() => K.handoff(web, { title: "T" }), /review and handoff tiers/);
  const escaped = K.button({ label: "<script>alert(1)</script>" });
  assert.ok(escaped.includes("&lt;script&gt;") && !escaped.includes("<script"));
  assert.deepEqual(checkHtml(escaped), []);
  assert.equal(WB.goHref("W53~ps4_released"), "#/W53~ps4_released");
  assert.equal(WB.goHref("W22:group~group_submission"), "#/W22:group~group_submission");
  assert.throws(() => WB.goHref("W22~"), /invalid go target/);
  assert.throws(() => WB.goHref("W22~Bad-Id"), /invalid go target/);
});

test("href policy rejects unsafe schemes in the kit and in checkHtml", () => {
  for (const bad of ["javascript:alert(1)", " JaVa\tscript:alert(1)", "data:text/html,hi", "vbscript:x", "//evil.example", "http://x.example"]) {
    assert.throws(() => K.link({ label: "L", href: bad }), /WB\.K\.link/, JSON.stringify(bad));
    assert.equal(isSafeHref(bad), false, JSON.stringify(bad));
    assert.ok(checkHtml(`<a href="${bad.replace(/\t/g, "&#9;")}">L</a>`).some((p) => /unsafe href/.test(p)), JSON.stringify(bad));
  }
  for (const ok of ["#/W05", "#top", "help/index.html", "https://example.org", "mailto:help@example.org"]) {
    assert.match(K.link({ label: "L", href: ok }), /<a class="wb-link" href=/);
    assert.equal(isSafeHref(ok), true, ok);
  }
  assert.throws(() => K.link({ label: "L", go: 'W05"><b>x' }), /invalid go target/);
});

test("checkHtml catches the problems it is meant to catch", () => {
  const has = (html, re) => assert.ok(checkHtml(html).some((p) => re.test(p)), `${html} → ${checkHtml(html).join("; ")}`);
  has("<p>undefined</p>", /undefined/);
  has("<div><span></div>", /unbalanced/);
  has('<button class="wb-btn">Go</button>', /type="button"/);
  has('<button type="button"><svg aria-hidden="true"></svg></button>', /accessible name/);
  has('<div role="button">x</div>', /role="button"/);
  has('<span class="wb-btn wb-btn--primary">x</span>', /not a <button> or <a href>/);
  has('<a class="wb-btn wb-btn--primary">x</a>', /not a <button> or <a href>/);
  assert.deepEqual(checkHtml('<a class="wb-btn wb-btn--primary" href="#/x">x</a>'), []);
  has('<input id="a">', /no <label for>/);
  has('<p id="a"></p><p id="a"></p>', /duplicate id/);
  has('<p aria-describedby="nope">x</p>', /does not resolve/);
  has('<button type="button" data-target="gone">x</button>', /does not resolve/);
  has('<p onclick="x()">x</p>', /inline handler/);
  has('<p style="color:#ff0000">x</p>', /colour literal/);
  has("<img src=\"a.png\">", /alt/);
  assert.deepEqual(checkHtml('<svg><use href="#wb-i-x"/></svg><br><input id="i"><label for="i">L</label>'), []);
  has('<p style="margin:0">x</p>', /style attribute/);
  has('<span class="wb-progress__bar" style="color:red"></span>', /style attribute/);
  assert.deepEqual(checkHtml(K.progress({ label: "Progress", value: 3, max: 4 })), []);
});

test("M6: stack, grid and rail switch by ctx", () => {
  const at = (name) => WB.ctx({ ...WB.CONTEXTS.find((c) => c.name === name), role: "student" });
  const web = at("web-regular");
  const phone = at("iphone-compact");
  const items = ["<p>One</p>", "<p>Two</p>", "<p>Three</p>"];
  assert.match(K.grid(web, { items }), /wb-grid--c3/);
  assert.match(K.grid(phone, { items }), /wb-grid--c1/);
  assert.match(K.grid(phone, { items, compactCols: 2 }), /wb-grid--c2/);
  const rail = { main: "<p>Main</p>", rail: "<p>Rail</p>", railLabel: "Details" };
  assert.match(K.rail(web, rail), /wb-rail--side/);
  assert.match(K.rail(phone, rail), /wb-rail--stacked/);
  const asideFirst = (html) => html.indexOf("<aside") < html.indexOf("wb-rail__main");
  assert.equal(asideFirst(K.rail(phone, { ...rail, railFirst: true })), true);
  assert.equal(asideFirst(K.rail(web, { ...rail, railFirst: true })), false);
  assert.equal(asideFirst(K.rail(phone, rail)), false);
  assert.throws(() => K.rail(web, { main: "<p>M</p>", rail: "<p>R</p>" }), /railLabel/);
  assert.throws(() => K.grid(web, { items, cols: 5 }), /cols/);
  assert.throws(() => K.stack(web, { items: ["<p>x</p>", 3] }), /HTML string/);
  assert.equal(K.stack(web, { items: ["<p>x</p>", ""] }), '<div class="wb-stack wb-stack--md"><p>x</p></div>');
  for (const { name, ctx } of ctxs()) {
    for (const html of [K.stack(ctx, { items, gap: "lg" }), K.grid(ctx, { items, cols: 4 }), K.rail(ctx, rail), K.rail(ctx, { ...rail, railFirst: true })]) clean(html, name);
  }
});

test("M9: the iPhone section menu holds course tools for staff", () => {
  const phone = (role, opts = shellOpts("s2")) => K.shell(WB.ctx({ platform: "iphone", role }), opts);
  const menu = (html) => {
    const start = html.indexOf('id="s2-sections"');
    return start < 0 ? "" : html.slice(start, html.indexOf("wb-navbar__trail"));
  };
  const ta = phone("ta");
  assert.ok(menu(ta).includes('aria-label="Course tools"'));
  assert.ok(menu(ta).includes('href="#/W40"'));
  clean(ta, "ta");
  assert.equal(phone("student").includes("Course tools"), false);
  const base = shellOpts("s2");
  const toolsOnly = phone("instructor", { ...base, course: { ...base.course, tabs: [] } });
  assert.ok(toolsOnly.includes('class="wb-titlebtn"'));
  assert.ok(menu(toolsOnly).includes('aria-label="Course tools"'));
  clean(toolsOnly, "tools only");
});

test("empty states render a destination action as a link, in K.empty and in K.table", () => {
  const action = { label: "Access help", go: "W12" };
  const empty = K.empty(deepFreeze({ title: "Nothing here", action }));
  clean(empty, "K.empty");
  assert.match(empty, /<a class="wb-btn wb-btn--secondary" href="#\/W12" data-go="W12">/);
  assert.doesNotMatch(empty, /<button/);
  for (const { name, ctx } of ctxs()) {
    const table = K.table(ctx, deepFreeze({ id: "req", caption: "Requests", columns: [{ key: "name", label: "Name" }], rows: [], empty: { title: "Nothing here", action } }));
    clean(table, `${name} table`);
    assert.match(table, /<a class="wb-btn wb-btn--secondary" href="#\/W12" data-go="W12">/, name);
    assert.doesNotMatch(table, /<button/, name);
  }
});

test("toast actions render a destination as a quiet link and any other action as a quiet button", () => {
  const link = K.toast(deepFreeze({ text: "Saved", action: { label: "View", go: "W20" } }));
  clean(link, "toast link");
  assert.match(link, /<a class="wb-btn wb-btn--quiet" href="#\/W20" data-go="W20">/);
  const button = K.toast(deepFreeze({ text: "Saved", action: { label: "Undo" } }));
  clean(button, "toast button");
  assert.match(button, /<button type="button" class="wb-btn wb-btn--quiet"/);
  assert.doesNotMatch(button, /<a /);
});

test("select placeholder with an empty value is valid, and is selected only when value is given", () => {
  const base = { id: "term", label: "Term", type: "select", required: true, options: deepFreeze([{ value: "", label: "Choose a term" }, { value: "f26", label: "Fall 2026" }]) };
  const bare = K.field(base);
  clean(bare, "placeholder");
  assert.match(bare, /<select [^>]*required/);
  assert.match(bare, /<option value="">Choose a term<\/option>/);
  assert.equal(count(bare, / selected/g), 0, "nothing is selected without a value");
  const chosen = K.field({ ...base, value: "" });
  clean(chosen, "placeholder selected");
  assert.match(chosen, /<option value="" selected>Choose a term<\/option>/);
  assert.equal(count(chosen, / selected/g), 1);
});

test("select options need a non-empty label and a string or number value, and values must be distinct", () => {
  const field = (options) => K.field({ id: "s", label: "Pick", type: "select", options });
  assert.throws(() => field([{ value: "a", label: "A" }, { value: "a", label: "Again" }]), /WB\.K\.field: duplicate select option value 'a'/);
  assert.throws(() => field([{ value: "1", label: "One" }, { value: 1, label: "Also one" }]), /duplicate select option value/);
  assert.throws(() => field([{ value: "a" }]), /select option label must be a non-empty string/);
  assert.throws(() => field([{ value: "a", label: "" }]), /select option label must be a non-empty string/);
  assert.throws(() => field([{ label: "No value" }]), /select option value must be a string or number/);
  assert.throws(() => field([{ value: null, label: "Null" }]), /select option value must be a string or number/);
  assert.doesNotThrow(() => field([{ value: "", label: "Choose" }, { value: 0, label: "Zero" }]));
});

test("iPad portrait sidebar gets an in-sidebar Hide button; landscape keeps only the header toggle", () => {
  const shell = (name) => K.shell(ctxs().find((c) => c.name === name).ctx, shellOpts("s2"));
  const sidebarButtons = (html) => html.match(/<button [^>]*aria-controls="s2-sidebar"[^>]*>/g) || [];
  const portrait = shell("ipad-compact");
  clean(portrait, "ipad portrait");
  assert.match(portrait, /<button type="button" class="wb-btn wb-btn--quiet wb-iconbtn" id="s2-sidebar-toggle"/);
  assert.equal(sidebarButtons(portrait).length, 2);
  const aside = portrait.split("<aside")[1].split("</aside>")[0];
  assert.equal(sidebarButtons(aside).length, 1, "one Hide button inside the aside");
  assert.match(aside, /^[^>]*>\s*<div class="wb-sidebar__close"><button [^>]*id="s2-sidebar-close"[^>]*aria-label="Hide sidebar"/, "the Hide button is the first child of the aside");
  const landscape = shell("ipad-regular");
  clean(landscape, "ipad landscape");
  assert.equal(sidebarButtons(landscape).length, 1);
  assert.doesNotMatch(landscape, /wb-sidebar__close|s2-sidebar-close/);
});

test("number fields emit validated bounds, including zero", () => {
  const base = { id: "mark", label: "Mark", type: "number" };
  const html = K.field({ ...base, min: 0, max: 12.5, step: 0.5 });
  clean(html, "bounded number field");
  assert.match(html, /\bmin="0"/);
  assert.match(html, /\bmax="12\.5"/);
  assert.match(html, /\bstep="0\.5"/);
  assert.throws(() => K.field({ ...base, min: 2, max: 1 }), /min must not exceed max/);
  assert.throws(() => K.field({ ...base, step: 0 }), /step must be above 0/);
  assert.throws(() => K.field({ ...base, max: Infinity }), /finite number/);
  assert.throws(() => K.field({ id: "name", label: "Name", min: 0 }), /only supported for number/);
});

test("dialog supports an escaped custom close label without changing close behavior", () => {
  for (const { ctx } of ctxs()) {
    const html = K.dialog(ctx, { id: "custom", title: "Title", body: "Body", cancelLabel: "Keep <editing>" });
    clean(html, "custom dialog close");
    assert.match(html, /Keep &lt;editing&gt;/);
    assert.match(html, /data-act="close-dialog" data-target="custom"/);
    assert.throws(() => K.dialog(ctx, { id: "custom", title: "Title", body: "Body", cancelLabel: "  " }), /cancelLabel must be a non-empty string/);
  }
});
