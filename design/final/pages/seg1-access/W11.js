/* W11 Academic tools directory (Phase 3 seg1). No tool catalog fixture exists, so the page draws one sample
   entry with unknown eligibility and invents no tool, provider, host, license or date. The same view for all three
   roles. A catalog fixture and selector are kit requests. Contract: pages/PAGES.md. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var P = WB.P;
  var STATES = ["loading", "firstUseEmpty", "filteredEmpty", "offline"];
  var AVAILABILITY = ["Available", "Eligibility unknown", "Unavailable"];

  function inst(a) { return a.view.data.world.institution; }
  function helpLinks(a) { return P.links(a, [{ label: "Get tool help", go: "W12" }, { label: "Course policy", go: "W15" }]); }

  function controls(a) {
    return a.K.grid(a.ctx, {
      cols: 2, compactCols: 1,
      items: [
        a.K.field({ id: P.id(a, "q"), label: "Search tools" }),
        a.K.field({ id: P.id(a, "avail"), type: "select", label: "Availability", options: AVAILABILITY.map(function (v) { return { value: v, label: v }; }) }),
      ],
    });
  }

  function card(a) {
    var i = inst(a);
    return a.K.card({
      title: "Sample entry: no tool is listed yet",
      body: P.stack(a, [
        a.K.kv([
          { label: "Provider", value: "Not listed" },
          { label: "Eligibility", value: "Unknown: no verified entitlement record" },
          { label: "Help owner", value: i.support },
        ]),
        "<p>" + a.K.link({ label: "Email " + i.support, href: "mailto:" + i.support }) + "</p>",
        a.K.button({ label: "Continue to provider", kind: "primary", disabled: true, reason: "No verified destination", id: P.id(a, "provider") }),
      ]),
    });
  }

  function directory(a) {
    return P.stack(a, [
      controls(a), card(a), helpLinks(a),
      P.p("A listing never promises a free license; course policy overrides a listing."),
      P.p(a.view.data.world.notice),
    ]);
  }

  function body(a) {
    if (a.state === "loading") return P.loading(a, "the tools directory");
    if (a.state === "firstUseEmpty") return a.K.empty({ title: "No tools are listed for " + inst(a).name, action: { label: "Get tool help", go: "W12" } });
    if (a.state === "filteredEmpty") return P.stack(a, [controls(a), a.K.empty({ title: "No tools match these filters", action: { label: "Clear filters", go: "W11" } })]);
    if (a.state === "offline") {
      return P.stack(a, [
        a.K.notice({ tone: "warning", title: "The catalog could not be refreshed. Eligibility is not confirmed" }),
        a.K.flag("lastKnown"), card(a), helpLinks(a),
      ]);
    }
    return directory(a);
  }

  WB.definePage("W11", {
    states: STATES,
    na: P.na(STATES, { invalid: "The search box filters a sample list; no typed value is checked" }),
    render: function (a) { return { title: a.page.title, navActive: "tools", body: body(a) }; },
  });
})(typeof globalThis !== "undefined" ? globalThis : this);
