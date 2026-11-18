// Phase 2c tests: the pure viewer modules (team plan Step 9, R1–R15). The DOM glue (app.js, gallery.js) is
// only loaded in a bare vm here; browser behaviour is Phase 6. Source checks only.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { loadAll, dataPath } from "./load_data.mjs";
import { loadSite, PAGE_PRE, PAGE_SEAL, VIEWER_PURE } from "./load_site.mjs";
import { checkHtml } from "./html_check.mjs";
import { CHROME_IDS, composedIdProblems } from "./check_render.mjs";

const W = loadSite();
const V = W.viewer;
const STATE_IDS = W.manifest.states.map((s) => s.id);
const decode = (s) => s.split("&" + "amp;").join("&");
const hrefsIn = (html) => [...html.matchAll(/href="([^"]*)"/g)].map((m) => decode(m[1]));
const vsOf = (over = {}) => V.normalize(W, { ...V.DEFAULTS, ...over }).vs;
const reduce = (vs, action) => V.reduce(W, vs, action);
const bar = (vs, key, value) => reduce(vs, { type: "bar", key, value });
const parse = (hash, current) => V.parseHash(hash, current ? { current } : undefined);
const frame = (WB, vs, ns = "t") => WB.viewer.renderFrame(WB, WB.viewer.normalize(WB, { ...WB.viewer.DEFAULTS, ...vs }).vs, { ns });

// A context with the registry and the pure viewer loaded but not sealed, for spy pages.
function spySite(defs) {
  const WB = loadAll({ extra: [...PAGE_PRE, ...VIEWER_PURE].map(dataPath) });
  for (const [id, d] of Object.entries(defs)) {
    const na = Object.fromEntries(STATE_IDS.filter((s) => !d.states.includes(s)).map((s) => [s, "Does not happen on this page"]));
    WB.definePage(id, { na, variants: {}, ...d });
  }
  WB.sealPages();
  return WB;
}

// A spy body that names its state and carries the tier handoff the composer requires off the full tier.
const spyBody = (a) => ({
  title: "Spy",
  body: (a.tier === "full" ? "" : a.K.handoff(a.ctx, { title: "Open on a larger screen" })) + `<p>${a.state || "default"}</p>`,
});

// ---------- Routing ----------
const ROUND_TRIPS = [
  {},
  { width: "narrow" },
  { platform: "ipad", orientation: "portrait" },
  { platform: "ipad", width: "narrow" },
  { orientation: "portrait" },
  { platform: "iphone", role: "ta", page: "W19" },
  { page: "W35", role: "instructor", scenario: "ta_expired", appearance: "dark", text: "larger" },
  { page: "O01", opt: true },
  { page: "W48", role: "instructor", j: "J03", k: 1 },
  { page: "W01", role: "guest", token: "loading", platform: "ipad" },
];

test("formatHash → parseHash round-trips 10 view states with a fixed key order and only non-default keys", () => {
  for (const over of ROUND_TRIPS) {
    const vs = vsOf(over);
    const hash = V.formatHash(vs);
    assert.match(hash, /^#\/[WO]\d\d(:[A-Za-z0-9_.-]+)?\?v=1/);
    const keys = hash.split("?")[1].split("&").map((kv) => kv.split("=")[0]);
    const order = ["v", "p", "w", "o", "r", "c", "a", "x", "opt", "j", "k"];
    assert.deepEqual(keys, [...keys].sort((a, b) => order.indexOf(a) - order.indexOf(b)), hash);
    const back = parse(hash);
    assert.equal(back.bare, false);
    assert.deepEqual({ ...back.vs }, { ...vs }, hash);
  }
  assert.equal(V.formatHash(vsOf()), "#/W05?v=1");
});

test("invalid hash values fall back to defaults with notes; an unknown page falls back to W05", () => {
  const p = parse("#/W05?v=1&p=tv&w=huge&o=sideways&r=dean&c=never&j=J99&k=x");
  assert.equal(p.vs.platform, "web");
  assert.equal(p.vs.width, "regular");
  assert.equal(p.vs.orientation, "landscape");
  assert.equal(p.vs.role, "student");
  assert.equal(p.vs.scenario, "default");
  assert.equal(p.vs.j, null);
  assert.ok(p.notes.length >= 6, p.notes.join(" | "));
  const unknown = parse("#/W99?v=1");
  assert.equal(unknown.vs.page, "W05");
  assert.ok(unknown.notes.includes("Unknown page in link"));
});

const INHERITED = ["constructor", "__proto__", "toString", "hasOwnProperty", "valueOf"];

test("inherited property names as query keys never throw and fall back with a note", () => {
  for (const key of INHERITED) {
    for (const hash of [`#/W05?v=1&${key}=x`, `#/W05?v=1&${key}`, `#/W05?v=1&p=ipad&${key}=web`]) {
      const p = parse(hash);
      assert.equal(p.vs.page, "W05", hash);
      assert.ok(p.notes.includes(`Unknown setting '${key}' in link`), `${hash}: ${p.notes.join(" | ")}`);
      assert.doesNotThrow(() => V.renderBar(W, p.vs), hash);
    }
  }
  assert.equal(parse("#/W05?v=1&p=ipad&constructor=web").vs.platform, "ipad");
  for (const key of INHERITED) {
    assert.throws(() => bar(vsOf(), key, "x"), /bad bar setting/, key);
    assert.throws(() => bar(vsOf(), "page", key), /unknown page/, key);
  }
});

test("inherited property names as page ids fall back to W05 with a note and the frame and bar render", () => {
  for (const id of INHERITED) {
    for (const hash of [`#/${id}?v=1`, `#/${id}`, `#/${id}:loading?v=1`, `#/W05:${id}?v=1`]) {
      const p = parse(hash, vsOf({ role: "ta" }));
      assert.equal(p.vs.page, "W05", hash);
      if (!hash.startsWith("#/W05")) assert.ok(p.notes.includes("Unknown page in link"), `${hash}: ${p.notes.join(" | ")}`);
      assert.doesNotThrow(() => V.renderBar(W, p.vs), hash);
      assert.doesNotThrow(() => V.renderFrame(W, p.vs, { ns: "t" }), hash);
    }
    assert.ok(!V.isPage(W, id), id);
    assert.throws(() => W.pageFor(id), /unknown page id/, id);
    const r = V.reduce(W, vsOf(), { type: "hash", hash: `#/${id}?v=1` });
    assert.equal(r.vs.page, "W05");
    assert.ok(r.notes.includes("Unknown page in link"));
  }
  const entry = W.pageFor("W05");
  for (const id of INHERITED) assert.equal(V.classifyToken(entry, id), "unknown", id);
});

test("a bare hash inherits the current settings; a complete hash never does", () => {
  const ipad = vsOf({ platform: "ipad" });
  const bare = parse("#/W20", ipad);
  assert.equal(bare.bare, true);
  assert.equal(bare.vs.platform, "ipad");
  const full = parse("#/W05?v=1", ipad);
  assert.equal(full.bare, false);
  assert.equal(full.vs.platform, "web");
  const hand = parse("#/W05?p=iphone", vsOf({ role: "instructor" }));
  assert.equal(hand.vs.platform, "iphone");
  assert.equal(hand.vs.role, "student");
  assert.equal(parse("#v-stage"), null);
  assert.equal(parse("#/O01?v=1").vs.opt, true);
});

test("prototypeHref and shouldIntercept", () => {
  assert.equal(V.prototypeHref({ page: "W01", role: "guest" }), "Whiteboard-Final.html#/W01?v=1&r=guest");
  const click = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false };
  assert.equal(V.shouldIntercept(click, "#/W20"), true);
  for (const k of ["metaKey", "ctrlKey", "shiftKey", "altKey", "defaultPrevented"]) assert.equal(V.shouldIntercept({ ...click, [k]: true }, "#/W20"), false, k);
  assert.equal(V.shouldIntercept({ ...click, button: 1 }, "#/W20"), false);
  assert.equal(V.shouldIntercept(click, "https://example.org"), false);
  assert.equal(V.shouldIntercept(click, "#x"), false);
  assert.deepEqual(Object.keys(V.SCENARIO_LABELS).sort(), [...W.sel.scenarioIds()].sort());
});

// ---------- Inactive width and orientation (R7) ----------
test("an inactive width or orientation is stored but never changes the frame", () => {
  const p = parse("#/W05?v=1&p=ipad&w=narrow").vs;
  assert.equal(p.platform, "ipad");
  assert.equal(p.width, "narrow");
  assert.equal(V.activeContext(p).width, undefined);
  assert.equal(frame(W, p).html, frame(W, parse("#/W05?v=1&p=ipad").vs).html);
  assert.equal(frame(W, parse("#/W05?v=1&o=portrait").vs).html, frame(W, parse("#/W05?v=1").vs).html);
  assert.equal(V.renderPlan(vsOf({ platform: "ipad" }), vsOf({ platform: "ipad", width: "narrow" })).frame, false);
});

test("reload equivalence: narrow web → iPad → reload → web keeps narrow; iPad portrait → web → reload → iPad keeps portrait", () => {
  const ipad = bar(parse("#/W05?v=1&w=narrow").vs, "platform", "ipad");
  const hash = V.formatHash(ipad.vs);
  assert.ok(hash.includes("p=ipad") && hash.includes("w=narrow"), hash);
  assert.equal(bar(parse(hash).vs, "platform", "web").vs.width, "narrow");
  assert.equal(bar(ipad.vs, "platform", "web").vs.width, "narrow");
  const web = bar(parse("#/W05?v=1&p=ipad&o=portrait").vs, "platform", "web");
  assert.equal(bar(parse(V.formatHash(web.vs)).vs, "platform", "ipad").vs.orientation, "portrait");
});

// ---------- History restoration (R1) ----------
test("W05 → W06 → iPad → Back restores W05 on web, and the entry reloads identically", () => {
  const first = reduce(null, { type: "hash", hash: "#/W05" });
  const h1 = V.formatHash(first.vs);
  assert.equal(h1, "#/W05?v=1");
  const link = reduce(first.vs, { type: "link", href: "#/W06" });
  assert.equal(link.history, "push");
  assert.equal(link.vs.platform, "web");
  const ipad = bar(link.vs, "platform", "ipad");
  assert.equal(ipad.history, "replace");
  assert.ok(V.formatHash(ipad.vs).includes("p=ipad"));
  const back = reduce(ipad.vs, { type: "hash", hash: h1 });
  assert.equal(back.history, "none");
  assert.equal(back.vs.platform, "web");
  assert.equal(back.vs.page, "W05");
  assert.deepEqual({ ...parse(h1).vs }, { ...back.vs });
  const bareNav = reduce(ipad.vs, { type: "hash", hash: "#/W07" });
  assert.equal(bareNav.vs.platform, "ipad");
  assert.equal(bareNav.history, "replace");
  assert.equal(reduce(ipad.vs, { type: "hash", hash: "#v-main" }), null);
});

// ---------- Tour invariant (R9) and panel refresh (R8) ----------
const S = reduce(vsOf(), { type: "tour", op: "start", jid: "J03" });

test("starting J03 moves to its first step; page or role changes end it, platform and state keep it", () => {
  assert.equal(S.vs.page, "W48");
  assert.equal(S.vs.role, "instructor");
  assert.equal(S.vs.j, "J03");
  assert.equal(S.vs.k, 1);
  const page = bar(S.vs, "page", "W05");
  assert.equal(page.vs.j, null);
  assert.equal(page.vs.k, null);
  assert.match(page.status, /Tour ended/);
  assert.equal(bar(S.vs, "role", "ta").vs.j, null);
  assert.equal(bar(S.vs, "platform", "ipad").vs.j, "J03");
  assert.equal(bar(S.vs, "state", "loading").vs.j, "J03");
  assert.equal(parse("#/W05?v=1&j=J03&k=1").vs.j, null);
  assert.ok(parse("#/W05?v=1&j=J03&k=1").notes.some((n) => /Tour ended/.test(n)));
  assert.equal(parse("#/W48?v=1&r=instructor&j=J03&k=1").vs.j, "J03");
  assert.equal(parse("#/W48?v=1&r=instructor&j=J03&k=99").vs.j, null);
  assert.equal(reduce(S.vs, { type: "hash", hash: "#/W49" }).vs.j, null);
});

test("the tour panel refreshes on its own key: end, start in place, next", () => {
  const end = reduce(S.vs, { type: "tour", op: "end" });
  assert.deepEqual({ ...V.renderPlan(S.vs, end.vs), theme: undefined }, { frame: false, tour: true, theme: undefined });
  assert.equal(end.focus, "journey");
  assert.equal(V.tours.panel(W, end.vs), "");
  const w06 = vsOf({ page: "W06", scenario: "assignment_submission" });
  const j02 = reduce(w06, { type: "tour", op: "start", jid: "J02" });
  const plan = V.renderPlan(w06, j02.vs);
  assert.equal(plan.frame, false);
  assert.equal(plan.tour, true);
  assert.equal(j02.focus, "tour");
  assert.match(V.tours.panel(W, j02.vs), /Step 1 of 9/);
  // From the default clock, step 1 moves to its scenario, so the frame redraws and focus goes to the h1.
  const fromDefault = vsOf({ page: "W06" });
  const moved = reduce(fromDefault, { type: "tour", op: "start", jid: "J02" });
  assert.equal(V.renderPlan(fromDefault, moved.vs).frame, true);
  assert.equal(moved.focus, "h1");
  const next = reduce(S.vs, { type: "tour", op: "next" });
  assert.equal(V.renderPlan(S.vs, next.vs).frame, true);
  assert.equal(V.renderPlan(S.vs, next.vs).tour, true);
  assert.equal(next.focus, "h1");
});

// ---------- Bar sync (R2, R14) ----------
test("barModel hides the inactive fieldsets but keeps their stored values", () => {
  const web = V.barModel(W, vsOf());
  assert.equal(web.hidden.width, false);
  assert.equal(web.hidden.orientation, true);
  const ipad = V.barModel(W, bar(vsOf(), "platform", "ipad").vs);
  assert.equal(ipad.hidden.width, true);
  assert.equal(ipad.hidden.orientation, false);
  const phone = V.barModel(W, vsOf({ platform: "iphone" }));
  assert.equal(phone.hidden.width && phone.hidden.orientation, true);
  assert.equal(V.barModel(W, vsOf({ platform: "ipad", width: "narrow" })).values.width, "narrow");
});

test("optional pages appear only with the switch on, and switching off on O01 moves to the role home", () => {
  const off = vsOf();
  assert.doesNotMatch(V.barModel(W, off).pageOptionsHtml, /O01/);
  const on = bar(off, "opt", true).vs;
  for (const id of ["O01", "O02", "O03"]) assert.match(V.barModel(W, on).pageOptionsHtml, new RegExp(`value="${id}"`));
  const leave = bar(vsOf({ page: "O01", opt: true }), "opt", false);
  assert.equal(leave.vs.page, "W05");
  assert.match(leave.status, /Optional pages are off/);
});

test("the journey select is a picker: pending pick, active tour, empty after an end", () => {
  assert.equal(V.barModel(W, vsOf(), { pendingJourney: "J03" }).values.journey, "J03");
  assert.equal(V.barModel(W, S.vs).values.journey, "J03");
  assert.equal(V.barModel(W, reduce(S.vs, { type: "tour", op: "end" }).vs).values.journey, "");
});

// F01: the displayed journey and the started journey always agree.
test("active J02, pick J03, then an appearance change: the select shows J02 and Start starts J02", () => {
  const j02 = reduce(vsOf({ page: "W06" }), { type: "tour", op: "start", jid: "J02" }).vs;
  // The DOM glue: picking stores the pending pick; every apply re-syncs the bar from barModel.
  let pending = "J03";
  const after = bar(j02, "appearance", "dark").vs;
  const m = V.barModel(W, after, { pendingJourney: pending });
  pending = m.pendingJourney;
  const displayed = m.values.journey;
  assert.equal(displayed, "J02");
  assert.equal(pending, "");
  // Start dispatches the displayed value, so the started tour is the one on screen.
  const started = reduce(after, { type: "tour", op: "start", jid: displayed }).vs;
  assert.equal(started.j, displayed);
  // With no tour active, the pick is shown, kept across syncs, and is what Start starts.
  const idle = V.barModel(W, vsOf(), { pendingJourney: "J03" });
  assert.deepEqual({ ...V.journeyPick(vsOf(), "J03") }, { value: "J03", pending: "J03" });
  assert.equal(idle.values.journey, idle.pendingJourney);
  assert.equal(reduce(vsOf(), { type: "tour", op: "start", jid: idle.values.journey }).vs.j, "J03");
});

function checkedRadio(html, fieldset) {
  const m = new RegExp(`<input[^>]*name="${fieldset}"[^>]*checked[^>]*>`).exec(html);
  return m && /value="([^"]+)"/.exec(m[0])[1];
}
const fieldsetHidden = (html, id) => new RegExp(`<fieldset[^>]*id="${id}"[^>]*hidden`).test(html);

test("renderBar and barModel agree for web, iPad and iPhone", () => {
  for (const over of [{}, { platform: "ipad", width: "narrow", orientation: "portrait" }, { platform: "iphone" }]) {
    const vs = vsOf(over);
    const model = V.barModel(W, vs);
    const html = V.renderBar(W, vs);
    assert.equal(fieldsetHidden(html, "v-width"), model.hidden.width);
    assert.equal(fieldsetHidden(html, "v-orient"), model.hidden.orientation);
    assert.equal(checkedRadio(html, "v-width"), model.values.width);
    assert.equal(checkedRadio(html, "v-orient"), model.values.orientation);
    assert.equal(checkedRadio(html, "v-platform"), model.values.platform);
    assert.ok(html.includes(model.pageOptionsHtml));
    assert.ok(html.includes(model.stateOptionsHtml));
  }
});

// An isolated registry with no page files: every page is a placeholder whatever Phase 3 has built.
const EMPTY = spySite({});

test("renderBar content: labels, 16 situations with reasons, 12 journeys, configured clocks, optional pages", () => {
  const html = V.renderBar(EMPTY, vsOf());
  assert.deepEqual([...checkHtml(html)], []);
  assert.match(html, /Prototype controls · fictional data/);
  assert.match(html, /Role switch \(not sign-in\)/);
  const state = /<select[^>]*id="v-state"[\s\S]*?<\/select>/.exec(html)[0];
  const situations = /<optgroup label="Situations">([\s\S]*?)<\/optgroup>/.exec(state)[1];
  assert.equal((situations.match(/<option/g) || []).length, 16);
  assert.equal((situations.match(/disabled/g) || []).length, 16);
  assert.match(situations, /not applicable: Not built yet/);
  const journey = /<select[^>]*id="v-journey"[\s\S]*?<\/select>/.exec(html)[0];
  assert.equal((journey.match(/<option/g) || []).length, 13);
  assert.match(journey, /No tour/);
  const clocks = /<select[^>]*id="v-scenario"[\s\S]*?<\/select>/.exec(html)[0];
  assert.equal((clocks.match(/<option/g) || []).length, W.sel.scenarioIds().length);
  for (const a of ["System", "Light", "Dark", "Default", "Larger"]) assert.match(html, new RegExp(`>${a}<`));
  assert.doesNotMatch(html, /value="O01"/);
  assert.match(V.renderBar(W, vsOf({ opt: true })), /value="O01"/);
});

// ---------- Activation guard (R3, R13, R15) ----------
test("activation blocks disabled controls first and routes the rest", () => {
  const reason = "Closes after the deadline";
  assert.deepEqual({ ...V.activation({ tag: "button", ariaDisabled: "true", act: "open-dialog", target: "x", reasonText: reason }) }, { kind: "blocked", status: reason });
  assert.equal(V.activation({ tag: "button", ariaDisabled: "true", act: "toggle", target: "x" }).kind, "blocked");
  assert.equal(V.activation({ tag: "button", disabled: true, act: "open-dialog", target: "x" }).status, "Not available right now. The reason is shown beside it.");
  assert.equal(V.activation({ tag: "a", ariaDisabled: "true", href: "#/W20" }).kind, "blocked");
  assert.deepEqual({ ...V.activation({ tag: "button", act: "open-dialog", target: "d1" }) }, { kind: "open-dialog", target: "d1" });
  assert.deepEqual({ ...V.activation({ tag: "a", href: "#v-main" }) }, { kind: "in-page", target: "v-main" });
  assert.equal(V.activation({ tag: "a", href: "#/W20" }).kind, "link");
  const out = V.sortSelectOutcome({ renderedValue: "due:asc" });
  assert.deepEqual({ ...out }, { status: "Preview only: this action does nothing in the prototype", value: "due:asc" });
  assert.equal(V.sortSelectOutcome({ note: "Sorting arrives later", renderedValue: "" }).status, "Sorting arrives later");
});

test("a real disabled kit button renders aria-disabled and its reason id; an enabled opener has no id", () => {
  const html = W.K.button({ label: "Submit", disabled: true, reason: "Closes after the deadline", id: "b1", act: "open-dialog", target: "d1" });
  assert.match(html, /aria-disabled="true"/);
  assert.match(html, /id="b1-reason"/);
  const opener = W.K.button({ label: "Submit", act: "open-dialog", target: "d1" });
  assert.doesNotMatch(opener, /\sid=/);
});

// ---------- Dialogs (R4, R11) ----------
test("openDialogIds and dialogFocusPlan", () => {
  const ctx = W.ctx({ platform: "web", role: "student" });
  assert.deepEqual([...V.openDialogIds(W.K.dialog(ctx, { id: "d1", title: "Hand in", body: "<p>x</p>", open: true }))], ["d1"]);
  assert.deepEqual([...V.openDialogIds(W.K.dialog(ctx, { id: "d1", title: "Hand in", body: "<p>x</p>" }))], []);
  const plan = (o) => V.dialogFocusPlan({ dialogId: "d1", ...o });
  assert.equal(plan({ opener: { connected: true, focusable: true }, hasH1: true }).returnTo, "opener");
  assert.equal(plan({ opener: { connected: false, focusable: true }, hasH1: true }).returnTo, "h1");
  assert.equal(plan({ opener: { connected: true, focusable: false }, hasH1: true }).returnTo, "h1");
  const none = plan({ opener: null, hasH1: true });
  assert.equal(none.returnTo, "h1");
  assert.equal(none.fallbackInitial, "d1-title");
  assert.equal(plan({ opener: null, hasH1: false }).returnTo, "stage");
});

test("modalTransition keeps one modal: A → B hides A, then closing B returns focus outside the hidden A", () => {
  const live = { connected: true, focusable: true };
  // Opening A from the page.
  const first = V.modalTransition({ currentId: null, currentOpener: null, nextId: "dA", nextExists: true, openerInsideCurrent: false });
  assert.deepEqual({ ...first, hide: [...first.hide] }, { open: true, hide: [], returnOpener: "new", status: "" });
  // A button inside A opens B: A (and its scrim) is hidden first; B returns focus to A's opener.
  const ab = V.modalTransition({ currentId: "dA", currentOpener: live, nextId: "dB", nextExists: true, openerInsideCurrent: true });
  assert.equal(ab.open, true);
  assert.deepEqual([...ab.hide], ["dA"]);
  assert.equal(ab.returnOpener, "current");
  // Escape or close on B: the focus plan uses A's opener, never the button inside the hidden A.
  assert.equal(V.dialogFocusPlan({ dialogId: "dB", opener: live, hasH1: true }).returnTo, "opener");
  // A's opener is gone or not focusable: B keeps no opener, so closing B falls back to the h1 or the stage.
  for (const gone of [{ connected: false, focusable: true }, { connected: true, focusable: false }, null]) {
    const t = V.modalTransition({ currentId: "dA", currentOpener: gone, nextId: "dB", nextExists: true, openerInsideCurrent: true });
    assert.equal(t.returnOpener, "none");
    assert.deepEqual([...t.hide], ["dA"]);
    assert.equal(V.dialogFocusPlan({ dialogId: "dB", opener: null, hasH1: true }).returnTo, "h1");
    assert.equal(V.dialogFocusPlan({ dialogId: "dB", opener: null, hasH1: false }).returnTo, "stage");
  }
  // B is not drawn: nothing changes, A stays the modal and a status explains why.
  const missing = V.modalTransition({ currentId: "dA", currentOpener: live, nextId: "dX", nextExists: false, openerInsideCurrent: true });
  assert.equal(missing.open, false);
  assert.deepEqual([...missing.hide], []);
  assert.match(missing.status, /not drawn/);
  // Re-opening the same dialog hides nothing.
  assert.equal(V.modalTransition({ currentId: "dA", currentOpener: live, nextId: "dA", nextExists: true, openerInsideCurrent: true }).hide.length, 0);
});

test("app.js openDialog checks the next dialog first, hides the current one, then replaces the modal record", () => {
  const src = fs.readFileSync(dataPath("viewer/app.js"), "utf8");
  const body = /function openDialog\(id, opener\) \{([\s\S]*?)\n  \}/.exec(src)[1];
  const at = (s) => body.indexOf(s);
  for (const s of ["V.modalTransition(", "if (!t.open)", "t.hide.forEach", "teardownModal()", "showDialog(id, true)", "enterModal(id"]) assert.ok(at(s) >= 0, s);
  assert.ok(at("if (!t.open)") < at("t.hide.forEach") && at("t.hide.forEach") < at("teardownModal()") && at("teardownModal()") < at("enterModal(id"));
});

// F02: Tab stops inside a dialog, read from rendered kit markup in document order.
const FOCUS_TAG = /<(a|button|input|select|textarea)\b([^>]*)>/g;
const attrOf = (a, name) => { const m = new RegExp(`\\s${name}="([^"]*)"`).exec(a); return m ? m[1] : null; };
const hasAttr = (a, name) => new RegExp(`\\s${name}(?=[\\s=>]|$)`).test(a);
const tabList = (html) => [...html.matchAll(FOCUS_TAG)].map(([, tag, a]) => ({
  tag, type: attrOf(a, "type") || "", name: attrOf(a, "name") || "", checked: hasAttr(a, "checked"),
  disabled: hasAttr(a, "disabled"), tabindex: attrOf(a, "tabindex"), hidden: false, id: attrOf(a, "id"),
}));

test("tabStops: a radio group is one stop (checked, else first); hidden, disabled and tabindex=-1 are skipped", () => {
  const r = (name, checked, extra = {}) => ({ tag: "input", type: "radio", name, checked, ...extra });
  const list = [
    r("g", false), r("g", true), r("g", false),
    { tag: "button", type: "button" },
    { tag: "button", type: "button", disabled: true },
    { tag: "a", tabindex: "-1" },
    { tag: "input", type: "text", hidden: true },
    r("h", false), r("h", false),
    r("k", true, { disabled: true }), r("k", false),
    { tag: "textarea" },
  ];
  assert.deepEqual([...V.tabStops(list)], [1, 3, 7, 10, 11]);
});

test("a dialog opening with a K.choiceGroup whose second option is checked: Shift+Tab on it wraps to the last stop", () => {
  const ctx = W.ctx({ platform: "web", role: "student" });
  const group = W.K.choiceGroup({ id: "d1-g", legend: "Hand in as", name: "d1-g", type: "radio", options: [
    { id: "d1-g-a", value: "a", label: "File" }, { id: "d1-g-b", value: "b", label: "Link", checked: true }, { id: "d1-g-c", value: "c", label: "Text" },
  ] });
  const html = W.K.dialog(ctx, { id: "d1", title: "Hand in", body: group, open: true, actions: [{ label: "Hand in", kind: "primary", id: "d1-go" }] });
  const list = tabList(html);
  const stops = V.tabStops(list);
  const idx = (id) => list.findIndex((d) => d.id === id);
  assert.equal(stops[0], idx("d1-g-b"));
  assert.equal(stops.filter((i) => list[i].type === "radio").length, 1);
  const lastStop = stops[stops.length - 1];
  assert.equal(list[lastStop].id, "d1-go");
  // Shift+Tab on the checked radio (the first stop, though not the first candidate) wraps to the last stop.
  assert.deepEqual({ ...V.trapStep(list, idx("d1-g-b"), true, true) }, { prevent: true, focus: lastStop });
  // Tab on the last stop wraps to the checked radio; a middle stop is left to native Tab.
  assert.deepEqual({ ...V.trapStep(list, lastStop, true, false) }, { prevent: true, focus: idx("d1-g-b") });
  assert.deepEqual({ ...V.trapStep(list, stops[1], true, true) }, { prevent: false, focus: -1 });
  // Focus outside the dialog is pulled in; a dialog with no stops keeps focus where it is.
  assert.deepEqual({ ...V.trapStep(list, -1, false, false) }, { prevent: true, focus: idx("d1-g-b") });
  assert.deepEqual({ ...V.trapStep([], -1, true, true) }, { prevent: true, focus: -1 });
});

test("a variant that renders an open dialog is reported in openDialogs", () => {
  const WB = spySite({
    W20: {
      states: ["saveFailed", "invalid", "offline"],
      variants: { "open-dialog": "Hand-in dialog open" },
      render: (a) => ({
        title: "Spy",
        body: "<p>Spy</p>",
        dialog: a.variant === "open-dialog" ? a.K.dialog(a.ctx, { id: `${a.ns}-d1`, title: "Hand in", body: "<p>x</p>", open: true }) : undefined,
      }),
    },
  });
  assert.deepEqual([...frame(WB, { page: "W20", token: "open-dialog" }, "s").openDialogs], ["s-c-d1"]);
  assert.deepEqual([...frame(WB, { page: "W20" }, "s").openDialogs], []);
});

// ---------- Frames, tours and board ----------
test("renderFrame: role-blocked frames skip the page render; N/A tokens add a note; output is deterministic", () => {
  let calls = 0;
  const WB = spySite({ W20: { states: ["saveFailed", "invalid", "offline"], render: () => { calls += 1; return { title: "Spy", body: "<p>Spy</p>" }; } } });
  const blocked = frame(WB, { page: "W20", role: "instructor" });
  assert.equal(blocked.blocked, true);
  assert.match(blocked.html, /Instructor can(&#39;|')t open this page/);
  assert.equal(calls, 0);
  const na = frame(EMPTY, { page: "W05", token: "loading" });
  assert.match(na.notes[0], /does not apply here/);
  assert.equal(na.html, frame(EMPTY, { page: "W05" }).html);
  assert.equal(frame(W, { page: "W19", platform: "iphone" }).html, frame(W, { page: "W19", platform: "iphone" }).html);
});

test("M7: a tour step lands in its scenario", () => {
  assert.equal(V.tours.viewFor("J02", 7, vsOf()).scenario, "assignment_submission");
  assert.equal(V.tours.viewFor("J02", 9, vsOf()).scenario, "default");
  const j03 = V.tours.viewFor("J03", 6, vsOf());
  assert.deepEqual([j03.role, j03.scenario], ["student", "ps4_released"]);
  const inTour = reduce(vsOf(), { type: "tour", op: "start", jid: "J02" }).vs;
  const clock = reduce(inTour, { type: "bar", key: "scenario", value: "default" }).vs;
  assert.equal(inTour.scenario, "assignment_submission");
  assert.deepEqual([clock.scenario, clock.j], ["default", "J02"]);
});

test("R3: J07 carries its group records", () => {
  const at = (k) => V.tours.viewFor("J07", k, vsOf());
  assert.deepEqual([at(2).page, at(2).token], ["W40", "motion"]);
  for (const [k, page] of [[5, "W19"], [6, "W20"], [7, "W21"]]) assert.deepEqual([at(k).page, at(k).token, at(k).scenario], [page, "motion", "group_work_in_progress"], `step ${k}`);
  assert.deepEqual([at(8).page, at(8).token, at(8).scenario], ["W22", "group", "group_submission"]);
  assert.deepEqual([at(9).page, at(9).role, at(9).token], ["W49", "instructor", "group"]);
  assert.equal(V.renderFrame(W, at(8), { ns: "t" }).html.includes("Unknown view"), false);
  assert.equal(V.tours.viewFor("J02", 6, vsOf()).token, null);
});

test("M10: a link can carry a scenario", () => {
  const start = vsOf({ scenario: "assignment_submission", role: "student" });
  const a = parse("#/W22~default", start);
  assert.deepEqual([a.vs.role, a.vs.scenario, a.vs.page], ["student", "default", "W22"]);
  const b = parse("#/W22:group~group_submission", start);
  assert.deepEqual([b.vs.token, b.vs.scenario], ["group", "group_submission"]);
  const c = parse("#/W53~nope", start);
  assert.ok(c.notes.includes("Unknown scenario in link"));
  assert.equal(c.vs.scenario, "assignment_submission");
  assert.equal(parse("#/W53~ps4_released?v=1&c=default").vs.scenario, "default");
  assert.equal(parse("#/W53~ps4_released?v=1").vs.scenario, "ps4_released");
  assert.equal(V.formatHash(b.vs).includes("~"), false);
});

test("M1: render receives a frozen who for the role", () => {
  const seen = {};
  const WB = spySite({ W14: { states: [], render: (a) => { seen[a.role] = a.who; return spyBody(a); } } });
  for (const role of ["student", "instructor", "ta"]) frame(WB, { page: "W14", role });
  assert.deepEqual({ ...seen.student }, { role: "student", personId: "aisha", courseId: "phys110-f26" });
  assert.deepEqual({ ...seen.instructor }, { role: "instructor", personId: "reyes", courseId: "phys110-f26" });
  assert.deepEqual({ ...seen.ta }, { role: "ta", personId: "maya", courseId: "phys110-f26" });
  for (const role of ["student", "instructor", "ta"]) assert.ok(Object.isFrozen(seen[role]), role);
});

test("tours: 12 journeys, viewFor sets the step role, step 1 disables Previous with its reason", () => {
  assert.equal(V.tours.list().length, 12);
  assert.equal(V.tours.viewFor("J03", 1, vsOf()).role, "instructor");
  const html = V.tours.panel(W, S.vs);
  assert.match(html, /<button[^>]*data-v-act="tour-prev"[^>]*disabled/);
  assert.match(html, /First step/);
  assert.deepEqual([...checkHtml(html)], []);
});

test("boardSection: valid HTML for 3 pages, 3 frames, link containers outside the selects, relative role links", () => {
  const html = ["W49", "W01", "O01"].map((id) => V.boardSection(W, id, { role: W.manifest.pagesById[id].roles[0] })).join("");
  assert.deepEqual([...checkHtml(html)], []);
  const w49 = V.boardSection(W, "W49", { role: "instructor" });
  assert.equal((w49.match(/class="wb-board__frame"/g) || []).length, 3);
  assert.match(w49, /id="board-W49-figures"/);
  assert.match(w49, /id="board-W49-links"/);
  const parts = V.boardSectionParts(W, "W49", { role: "instructor" });
  assert.doesNotMatch(parts.figuresHtml + parts.linksHtml, /bd-W49-(role|state)/);
  assert.match(w49, /id="bd-W49-role"/);
  for (const h of hrefsIn(w49).filter((h) => h.startsWith("Whiteboard-Final.html"))) {
    assert.doesNotMatch(h, /https?:/);
    assert.match(h, /v=1/);
    assert.match(h, /r=instructor/);
  }
});

test("boardLinks: 5 contexts in order; role and situation changes reach every link and the parts", () => {
  const rows = V.boardLinks(W, "W49", { role: "instructor" });
  assert.deepEqual(Array.from(rows, (r) => r.context), ["web-regular", "web-narrow", "ipad-landscape", "ipad-portrait", "iphone"]);
  assert.match(rows[3].href, /p=ipad&o=portrait/);
  assert.match(rows[1].href, /w=narrow/);
  const ta = V.boardLinks(W, "W49", { role: "ta" });
  for (const r of ta) assert.match(r.href, /r=ta/);
  const parts = V.boardSectionParts(W, "W49", { role: "ta" });
  const found = new Set(hrefsIn(parts.figuresHtml + parts.linksHtml).filter((h) => h.startsWith("Whiteboard-Final.html")));
  assert.deepEqual([...found].sort(), Array.from(ta, (r) => r.href).sort());
  assert.doesNotMatch(parts.figuresHtml + parts.linksHtml, /r=instructor/);
  const WB = spySite({ W49: { states: ["loading", "permissionUnavailable", "conflict"], render: spyBody } });
  const loading = WB.viewer.boardLinks(WB, "W49", { role: "instructor", token: "loading" });
  for (const r of loading) assert.match(r.href, /#\/W49:loading\?/);
  const lp = WB.viewer.boardSectionParts(WB, "W49", { role: "instructor", token: "loading" });
  assert.match(lp.figuresHtml, /<p>loading<\/p>/);
  for (const r of loading) assert.ok(hrefsIn(lp.figuresHtml + lp.linksHtml).includes(r.href), r.context);
});

test("app.js and gallery.js load in a bare vm; sidebarFocusTarget names the shell ids", () => {
  assert.doesNotThrow(() => loadAll({ extra: [...PAGE_PRE, PAGE_SEAL, ...VIEWER_PURE, "viewer/app.js", "viewer/gallery.js"].map(dataPath) }));
  assert.equal(V.sidebarFocusTarget("v", true), "v-sidebar-close");
  assert.equal(V.sidebarFocusTarget("v", false), "v-sidebar-toggle");
});

// ---------- Phase 2c inspection-3: (a) id namespaces, (b) one shell menu, (c) Escape ownership ----------
const APP_SRC = fs.readFileSync(dataPath("viewer/app.js"), "utf8");
const COMPOSE_SRC = fs.readFileSync(dataPath("viewer/compose.js"), "utf8");
const BUILD_SRC = fs.readFileSync(new URL("../build.mjs", import.meta.url), "utf8");
const functionBody = (src, head) => new RegExp(`${head} \\{([\\s\\S]*?)\\n  \\}`).exec(src)[1];

test("the stage namespace is p; page content renders as p-c and a default frame has no v- or b- ids", () => {
  const seen = [];
  const WB = spySite({ W20: { states: ["saveFailed", "invalid", "offline"], render: (a) => { seen.push(a.ns); return spyBody(a); } } });
  const vs = WB.viewer.normalize(WB, { ...WB.viewer.DEFAULTS, page: "W20" }).vs;
  const html = WB.viewer.renderFrame(WB, vs).html;
  assert.equal(WB.viewer.STAGE_NS, "p");
  assert.deepEqual(seen, ["p-c"]);
  assert.doesNotMatch(html, /\sid="[vb]-/);
  assert.ok(APP_SRC.includes("var NS = V.STAGE_NS;"));
  assert.ok(!APP_SRC.includes('var NS = "v"'));
  assert.ok(COMPOSE_SRC.includes('ns: ns + "-c"'));
});

test("composedIdProblems: a frame id that collides with the bar or chrome is reported; clean parts report nothing", () => {
  const bar = '<select id="v-state"></select>';
  assert.deepEqual(composedIdProblems([bar, '<div id="p-main"><h1 id="p-c-title">x</h1></div>']), []);
  const collide = composedIdProblems([bar, '<div id="v-state"></div>']);
  assert.ok(collide.includes('duplicate id "v-state"'), collide.join(" | "));
  assert.ok(collide.includes('frame id "v-state" uses a viewer namespace'), collide.join(" | "));
  assert.deepEqual(composedIdProblems(["", '<i id="p-c-x"></i><b id="p-c-x"></b>']), ['duplicate id "p-c-x"']);
  assert.deepEqual(composedIdProblems(["", '<div id="v-stage"></div>']).filter((p) => p.startsWith("duplicate")), ['duplicate id "v-stage"']);
});

test("CHROME_IDS are exactly the v- and b- ids build.mjs writes, each as an id literal", () => {
  const written = [...new Set([...BUILD_SRC.matchAll(/id="([vb]-[^"]*)"/g)].map((m) => m[1]))].sort();
  assert.deepEqual([...CHROME_IDS].sort(), written);
  for (const id of CHROME_IDS) assert.ok(BUILD_SRC.includes(`id="${id}"`), id);
});

test("W05 default bar and frame share no ids on iPhone or web", () => {
  for (const platform of ["iphone", "web"]) {
    const vs = vsOf({ page: "W05", platform });
    const bar = V.renderBar(W, vs, { pendingJourney: "" });
    const frame = V.renderFrame(W, vs);
    assert.deepEqual(composedIdProblems([bar, frame.html]), [], platform);
  }
});

test("menuToggle: opening a second menu closes the first; closing an untracked menu keeps the tracked one", () => {
  // The viewer modules run in a vm realm, so results are compared as plain JSON copies.
  const plain = (x) => JSON.parse(JSON.stringify(x));
  assert.deepEqual(plain(V.menuToggle(null, "p-sections", true)), { close: [], openId: "p-sections" });
  assert.deepEqual(plain(V.menuToggle("p-sections", "p-account", true)), { close: ["p-sections"], openId: "p-account" });
  assert.deepEqual(plain(V.menuToggle("p-account", "p-account", false)), { close: [], openId: null });
  assert.deepEqual(plain(V.menuToggle("p-account", "p-sections", false)), { close: [], openId: "p-account" });
  assert.deepEqual(plain(V.menuToggle("p-account", "p-account", true)), { close: [], openId: "p-account" });
});

test("app.js toggle goes through menuToggle and closes every menu it returns", () => {
  const body = functionBody(APP_SRC, "function toggle\\(id, button\\)");
  assert.ok(body.includes("V.menuToggle("));
  assert.ok(body.includes("t.close.forEach"));
  assert.ok(!APP_SRC.includes("openMenu = open ?"));
});

test("menuEscapes: only an unhandled Escape with no modal and a tracked menu", () => {
  const base = { key: "Escape", defaultPrevented: false, modal: false, openId: "p-account" };
  assert.equal(V.menuEscapes(base), true);
  assert.equal(V.menuEscapes({ ...base, defaultPrevented: true }), false);
  assert.equal(V.menuEscapes({ ...base, modal: true }), false);
  assert.equal(V.menuEscapes({ ...base, openId: null }), false);
  assert.equal(V.menuEscapes({ ...base, key: "Tab" }), false);
});

test("a dialog consumes its Escape: trapKeydown stops propagation before it closes the dialog", () => {
  const escape = functionBody(APP_SRC, "function trapKeydown\\(dialog\\)").split("\n").find((l) => l.includes('e.key === "Escape"'));
  assert.ok(escape.indexOf("e.stopPropagation()") >= 0);
  assert.ok(escape.indexOf("e.stopPropagation()") < escape.indexOf("closeDialog()"));
});

test("closeMenuOnEscape defers to menuEscapes and passes defaultPrevented through", () => {
  const body = functionBody(APP_SRC, "function closeMenuOnEscape\\(e\\)");
  assert.ok(body.includes("V.menuEscapes("));
  assert.ok(body.includes("defaultPrevented: e.defaultPrevented"));
});
