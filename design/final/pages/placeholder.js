/* Whiteboard Phase 2c: the placeholder page (team plan Step 2). WB.sealPages() uses it for every manifest page
   with no registration, so all 63 pages render on all five contexts before Phase 3 draws them. A placeholder
   shows no fixture records and no course art. Chosen by Claude under owner delegation. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var REASON = "Not built yet: this page's situations arrive in Phase 3";
  var TIER_NOTES = { review: "Planned tier: Review and protect", handoff: "Planned tier: Handoff" };
  var TIER_LABELS = { full: "Full", review: "Review and protect", handoff: "Handoff" };
  var APP_ROUTE = /^\/(courses|teach)(\/|$)/;

  function naAll() {
    var na = {};
    WB.manifest.states.forEach(function (s) { na[s.id] = REASON; });
    return na;
  }

  // The global or utility entry whose page is this page; course and teaching routes sit under Courses.
  function navActiveFor(page) {
    var nav = WB.manifest.navigation;
    var hit = nav.global.concat(nav.utility).filter(function (e) { return e.page === page.id; })[0];
    if (hit) return hit.id;
    return APP_ROUTE.test(page.route) ? "courses" : null;
  }

  function facts(a) {
    var page = a.page;
    return a.K.kv([
      { label: "Page", value: page.id },
      { label: "Route", value: page.route },
      { label: "Roles", value: page.roles.map(function (r) { return WB.ROLE_LABELS[r]; }).join(", ") },
      { label: "Platform tier", value: TIER_LABELS[a.tier] },
      { label: "Segment", value: String(page.segment) },
    ]);
  }

  function body(a) {
    var K = a.K;
    var handoff = a.tier === "full" ? "" : K.handoff(a.ctx, { title: "Open on a larger screen", note: TIER_NOTES[a.tier] });
    var notice = K.notice({ tone: "info", title: "Not built yet", body: "<p>This page is a placeholder until Phase 3. All data is fictional.</p>" });
    var spec = "<p>" + K.link({ label: "Open the page spec", href: "Whiteboard-Final-Spec.html#spec-" + a.page.id }) + "</p>";
    return handoff + notice + facts(a) + spec;
  }

  function render(a) {
    var out = { title: a.page.title, body: body(a) };
    if (a.role === "guest") return { title: out.title, body: out.body, mode: "access", links: [{ label: "Help", go: "W12" }] };
    return { title: out.title, body: out.body, navActive: navActiveFor(a.page) };
  }

  // {variantId: label} from manifest/anchors.js, so tour and Activity variant links resolve before Phase 3.
  function anchorVariants(pageId) {
    var a = Object.prototype.hasOwnProperty.call(WB.manifest.anchors, pageId) ? WB.manifest.anchors[pageId] : null;
    var out = {};
    if (a) Object.keys(a.variants).forEach(function (id) { out[id] = a.variants[id].label; });
    return out;
  }

  function placeholderPage(page) {
    if (!page || !WB.manifest.pagesById[page.id]) throw new Error("WB.placeholderPage: unknown page");
    return WB.deepFreeze({ id: page.id, page: page, states: [], na: naAll(), variants: anchorVariants(page.id), render: render, placeholder: true });
  }

  Object.defineProperty(WB, "placeholderPage", { value: placeholderPage, enumerable: true, writable: false, configurable: false });
})(typeof globalThis !== "undefined" ? globalThis : this);
