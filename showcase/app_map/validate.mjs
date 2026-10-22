import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => fs.readFileSync(path.join(dir, f), "utf8");
const screens = JSON.parse(read("screens.json")),
  routes = JSON.parse(read("routes.json")),
  data = { screens, ...routes };
const ids = new Set(screens.map((n) => n.id));
assert.equal(screens.length, 50);
assert.equal(ids.size, 50);
assert.equal(screens.filter((n) => n.status === "concept").length, 40);
assert.equal(screens.filter((n) => n.status === "proposed").length, 10);
assert.equal(screens.filter((n) => n.ios.desktopRecommended).length, 12);
for (const n of screens) {
  for (const key of ["id", "title", "domain", "role", "purpose", "status"])
    assert.ok(n[key]);
  for (const key of ["content", "actions", "states"])
    assert.ok(n[key].length >= 3);
  for (const p of ["web", "ios"]) {
    assert.ok(n[p].presentation);
    assert.ok(n[p].entry);
    assert.ok(n[p].notes.length);
  }
}
for (const e of routes.edges) {
  assert.ok(ids.has(e.source) && ids.has(e.target));
  assert.ok(e.label);
  if (e.handoff) assert.ok(e.condition);
}
for (const n of screens) {
  assert.ok(
    n.id === "P42" || routes.edges.some((e) => e.target === n.id),
    "Incoming or external invitation " + n.id,
  );
  assert.ok(
    routes.edges.some((e) => e.source === n.id),
    "Outgoing " + n.id,
  );
}
const reached = new Set(["P41", "P42", "P50"]);
let previous = 0;
while (previous !== reached.size) {
  previous = reached.size;
  routes.edges.forEach((e) => {
    if (reached.has(e.source)) reached.add(e.target);
  });
}
assert.equal(reached.size, 50);
for (const j of routes.journeys) {
  assert.ok(j.title && j.summary);
  j.steps.forEach((id) => assert.ok(ids.has(id)));
  for (let i = 1; i < j.steps.length; i++)
    assert.ok(
      routes.edges.some(
        (e) =>
          e.source === j.steps[i - 1] &&
          e.target === j.steps[i] &&
          (!j.edgeLabels?.[i - 1] || e.label === j.edgeLabels[i - 1]),
      ),
      j.id + " transition " + i,
    );
}
const html = read("index.html"),
  markup = html.split("<script")[0],
  htmlIds = [...markup.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
assert.equal(new Set(htmlIds).size, htmlIds.length, "Unique HTML IDs");
for (const p of ["web", "ios"])
  for (const id of ids)
    assert.ok(htmlIds.includes(p + "-" + id), "Rendered " + p + " " + id);
assert.equal(
  (html.split("<script")[0].match(/class="screen-card"/g) || []).length,
  100,
);
for (const m of markup.matchAll(/href="#([^"]+)"/g))
  assert.ok(htmlIds.includes(m[1]), "Link target " + m[1]);
for (const m of markup.matchAll(/(?:aria-labelledby|for)="([^"]+)"/g))
  assert.ok(htmlIds.includes(m[1]), "Accessible reference " + m[1]);
assert.ok(
  !/<(?:script|img|link)[^>]+(?:src|href)="(?:https?:|\/\/)/.test(html),
  "Native print expansion and restoration after filtering",
  "Distinct quiz publication/release and responsibility handoffs",
  "Shared tools with role-aware return convention",
  "No external runtime assets",
);
const scripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)];
let parsed = 0;
for (const [, attrs, code] of scripts) {
  if (attrs.includes("application/json"))
    assert.equal(JSON.parse(code).screens.length, 50);
  else {
    new vm.Script(code);
    parsed++;
  }
}
const ctx = { window: { Atlas: { data } } };
vm.runInNewContext(read("view.js"), ctx);
const A = ctx.window.Atlas,
  before = JSON.stringify(data);
for (const p of ["web", "ios"])
  for (const n of screens) {
    assert.ok(A.inspector(n, p).includes(n.id));
    assert.ok(A.card(n, p).includes(p + "-" + n.id));
  }
assert.equal(JSON.stringify(data), before, "Pure render functions");
// Exercise the real controller with DOM doubles: filtering, navigation, history and journey changes.
const elements = {},
  cards = {},
  groups = {},
  listeners = {},
  journeyViews = {},
  eventHandlers = {};
function element(id) {
  return (elements[id] ??= {
    value: "",
    textContent: "",
    hidden: false,
    innerHTML: "",
    dataset: {},
    focus() {
      this.focused = true;
    },
    scrollIntoView() {
      this.scrolled = true;
    },
    addEventListener(type, fn) {
      listeners[id + ":" + type] = fn;
    },
    setAttribute(k, v) {
      this[k] = v;
    },
    getAttribute(k) {
      return this[k];
    },
  });
}
for (const id of htmlIds) element(id);
for (const p of ["web", "ios"]) {
  cards[p] = screens.map((n) =>
    Object.assign(element(p + "-" + n.id), {
      dataset: { screen: n.id },
      open: false,
      matches: (s) => s === "details",
    }),
  );
  groups[p] = Object.keys(A.domains).map((d) => ({
    matches: () => false,
    hidden: false,
    querySelectorAll: () =>
      cards[p].filter((c) => A.byId[c.dataset.screen].domain === d),
  }));
  journeyViews[p] = { innerHTML: "" };
  element(p + "-journey").dataset.journey = p;
  for (const key of ["search", "domain", "status"]) {
    const el = element(p + "-" + key);
    el.dataset.filter = p;
    el.tagName = key === "search" ? "INPUT" : "SELECT";
  }
}
const document = {
  documentElement: { dataset: {} },
  getElementById: element,
  addEventListener: (type, fn) => (eventHandlers[type] = fn),
  querySelector: (s) => journeyViews[s.includes('"web"') ? "web" : "ios"],
  querySelectorAll: (s) => {
    if (s === "[data-filter]")
      return ["web", "ios"].flatMap((p) =>
        ["search", "domain", "status"].map((k) => element(p + "-" + k)),
      );
    if (s === "[data-journey]")
      return ["web", "ios"].map((p) => element(p + "-journey"));
    if (s === ".screen-card,.screen-group")
      return [...cards.web, ...cards.ios, ...groups.web, ...groups.ios];
    const p = s.includes("#web") ? "web" : "ios";
    if (s.includes(".screen-group")) return groups[p];
    if (s.includes(".screen-card")) return cards[p];
    return [];
  },
};
let pushes = [];
Object.assign(ctx, {
  document,
  history: { pushState: (a, b, hash) => pushes.push(hash) },
  location: { hash: "" },
  localStorage: { getItem: () => null, setItem: () => {} },
});
ctx.window.matchMedia = () => ({ matches: false, addEventListener() {} });
ctx.window.addEventListener = (type, fn) => (eventHandlers[type] = fn);
vm.runInNewContext(read("app.js"), ctx);
assert.equal(
  screens.filter((n) => A.matches(n, "", "", "proposed")).length,
  10,
);
assert.ok(
  screens
    .filter((n) => A.matches(n, "gradebook", "", ""))
    .some((n) => n.id === "S19"),
);
assert.equal(
  screens.filter((n) => A.matches(n, "not-a-screen", "", "")).length,
  0,
);
element("web-status").value = "proposed";
listeners["web-status:change"]();
assert.equal(cards.web.filter((c) => !c.hidden).length, 10);
assert.equal(cards.ios.filter((c) => !c.hidden).length, 50);
const target = {
  dataset: { platform: "web", node: "S19" },
  closest: (selector) => (selector === "[data-node]" ? target : null),
};
let prevented = false;
eventHandlers.click({
  target,
  button: 0,
  preventDefault() {
    prevented = true;
  },
});
assert.ok(prevented);
assert.equal(pushes.at(-1), "#web-S19");
assert.ok(element("web-inspector").innerHTML.includes("S19"));
assert.equal(element("web-status").value, "");
assert.ok(element("web-selected-title").focused);
const prior = pushes.length;
eventHandlers.click({
  target,
  button: 0,
  ctrlKey: true,
  preventDefault() {
    throw Error("Must preserve modified link");
  },
});
assert.equal(pushes.length, prior);
element("ios-journey").value = "booking";
listeners["ios-journey:change"]();
assert.ok(journeyViews.ios.innerHTML.includes("S27"));
assert.ok(element("ios-inspector").innerHTML.includes("S26"));
ctx.location.hash = "#ios-S08";
eventHandlers.hashchange();
assert.ok(element("ios-inspector").innerHTML.includes("S08"));
ctx.location.hash = "#ios-X99";
eventHandlers.hashchange();
assert.ok(element("ios-inspector").innerHTML.includes("S08"));
// Native printing includes filtered screens and restores the exact prior state.
element("web-status").value = "proposed";
listeners["web-status:change"]();
const priorPrint = cards.web.map((c) => ({ hidden: c.hidden, open: c.open }));
eventHandlers.beforeprint();
assert.equal(
  [...cards.web, ...cards.ios].filter((c) => !c.hidden && c.open).length,
  100,
);
eventHandlers.afterprint();
assert.deepEqual(
  cards.web.map((c) => ({ hidden: c.hidden, open: c.open })),
  priorPrint,
);
const quizMarkup = A.journey(
  routes.journeys.find((j) => j.id === "quiz"),
  "web",
);
assert.ok(
  quizMarkup.includes("Publish quiz for learner attempt") &&
    quizMarkup.includes("Release results to learner"),
);
for (const [source, target] of [
  ["S30", "S31"],
  ["S31", "S30"],
  ["S36", "S35"],
])
  assert.ok(
    routes.edges.find((e) => e.source === source && e.target === target)
      .handoff,
  );
assert.ok(routes.sharedNavigation.destinations.every((id) => ids.has(id)));
assert.ok(
  markup.includes("Closing a shared tool returns to the originating workspace"),
);
const record = {
  checked_date: "2026-10-15",
  destinations: 50,
  concept_screens: 40,
  proposed_screens: 10,
  rendered_presentations: 100,
  transitions: routes.edges.length,
  guided_journeys: routes.journeys.length,
  checks: [
    "Schema and unique IDs",
    "All nodes reachable; incoming and outgoing edges",
    "Every guided journey has valid transitions",
    "All 100 descriptions server-rendered",
    "HTML fragment and accessible reference integrity",
    "Inline JavaScript syntax; embedded JSON",
    "Pure rendering functions",
    "Actual controller filtering, role/scope search, deep links, modified clicks, journey changes",
    "Native print expansion and restoration after filtering",
    "Distinct quiz publication/release and responsibility handoffs",
    "Shared tools with role-aware return convention",
    "No external runtime assets",
  ],
  browser_acceptance:
    "Unverified: earlier recorded local-file URL-policy restriction; no alternate route attempted",
  native_ios: "Planned only; no simulator or device checks",
};
fs.writeFileSync(
  path.join(dir, "verification.json"),
  JSON.stringify(record, null, 2) + "\n",
);
console.log(JSON.stringify(record, null, 2));
