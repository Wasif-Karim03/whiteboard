/* Whiteboard Phase 2c viewer: composes one device frame for a view state (team plan Step 4). Pure, no DOM.
   renderFrame resolves the page entry, the tier and the render context (inactive width or orientation is
   never passed), shows a role-blocked notice when the role switch does not fit the page, classifies the
   token, calls the page render with frozen arguments, validates its return and wraps it in K.shell. */
(function (root) {
  "use strict";
  var WB = root.WB;
  var V = (WB.viewer = WB.viewer || {});
  var STAGE_NS = "p";
  var views = {};

  function fail(what) {
    throw new Error("WB.viewer.renderFrame: " + what);
  }

  function ctxFor(W, vs, tier) {
    var ac = V.activeContext(vs);
    var input = { platform: ac.platform, role: vs.role, tier: tier };
    if (ac.width !== undefined) input.width = ac.width;
    if (ac.orientation !== undefined) input.orientation = ac.orientation;
    return W.ctx(input);
  }

  // scenarioView deep-clones and projects the data, so each scenario is resolved once per WB.
  function viewFor(W, scenario) {
    if (!Object.prototype.hasOwnProperty.call(views, scenario)) {
      var next = V.merge(views, {});
      next[scenario] = W.sel.scenarioView(scenario);
      views = next;
    }
    return views[scenario];
  }

  function stateLabel(W, id) {
    var s = W.manifest.states.filter(function (x) { return x.id === id; })[0];
    return s ? s.label : id;
  }

  function roleList(W, roles) {
    return roles.map(function (r) { return W.ROLE_LABELS[r]; }).join(", ");
  }

  function blockedFrame(W, vs, page, ctx, ns) {
    var K = W.K;
    var home = V.roleHome(vs.role);
    var body =
      K.notice({
        tone: "info",
        title: W.ROLE_LABELS[vs.role] + " can't open this page",
        body: "<p>Prototype role switch: this page is for " + W.esc(roleList(W, page.roles)) + ".</p>",
      }) +
      "<p>" + K.link({ label: "Go to " + W.manifest.pagesById[home].title, go: home }) + "</p>";
    var opts = vs.role === "guest"
      ? { ns: ns, mode: "access", title: page.title, body: body }
      : { ns: ns, title: page.title, body: body, hrefs: W.manifest.navigation.hrefs, navActive: null };
    return K.shell(ctx, opts);
  }

  function tokenArgs(W, entry, token) {
    var kind = V.classifyToken(entry, token);
    if (kind === "state") return { state: token, variant: null, notes: [] };
    if (kind === "variant") return { state: null, variant: token, notes: [] };
    if (kind === "na") return { state: null, variant: null, notes: [stateLabel(W, token) + " does not apply here: " + entry.na[token]] };
    if (kind === "unknown") return { state: null, variant: null, notes: ["Unknown view"] };
    return { state: null, variant: null, notes: [] };
  }

  function checkResult(r, tier) {
    if (!r || typeof r !== "object" || Array.isArray(r) || Object.prototype.toString.call(r) !== "[object Object]") fail("render must return a plain object");
    if (typeof r.title !== "string" || typeof r.body !== "string") fail("render must return string title and body");
    if (Object.prototype.hasOwnProperty.call(r, "ns") || Object.prototype.hasOwnProperty.call(r, "hrefs")) fail("render must not return ns or hrefs");
    if (tier !== "full" && r.body.indexOf("wb-handoff--" + tier) < 0) fail("the " + tier + " tier body must include K.handoff");
    return r;
  }

  function renderFrame(W, vs, opts) {
    var ns = (opts && opts.ns) || STAGE_NS;
    var entry = W.pageFor(vs.page);
    var page = entry.page;
    var tier = page.platforms[vs.platform];
    var ctx = ctxFor(W, vs, tier);
    var base = { title: page.title, pageId: page.id, tier: tier };
    if (page.roles.indexOf(vs.role) < 0) {
      var blocked = blockedFrame(W, vs, page, ctx, ns);
      return Object.freeze(V.merge(base, { html: blocked, notes: [], openDialogs: [], blocked: true }));
    }
    var t = tokenArgs(W, entry, vs.token);
    var view = viewFor(W, vs.scenario);
    var selected = W.sel.resolveTeachingSelection(view, vs.role, vs.selection, vs.page, t.variant);
    if (selected && !selected.allowed) {
      var denied = W.P.stack({ K: W.K, ctx: ctx }, [tier === "full" ? "" : W.K.handoff(ctx, { title: "Open on a larger screen" }), W.K.notice({ tone: "info", title: "This record is not available in your course or grading scope" })]);
      return Object.freeze(V.merge(base, { title: "Record unavailable", html: W.K.shell(ctx, { ns: ns, title: "Record unavailable", body: denied, hrefs: W.manifest.navigation.hrefs }), notes: t.notes, openDialogs: [], blocked: false }));
    }
    var args = Object.freeze({
      page: page, ctx: ctx, platform: ctx.platform, sizeClass: ctx.sizeClass, orientation: ctx.orientation, tier: tier,
      role: vs.role, state: t.state, variant: t.variant, scenario: vs.scenario, view: view, who: selected ? selected.who : W.sel.viewerFor(view, vs.role),
      selection: selected ? selected.selection : null,
      sel: W.sel, K: W.K, WB: W, ns: ns + "-c",
      calendar: opts && opts.calendar ? opts.calendar : null,
    });
    var r = checkResult(entry.render(args), tier);
    var html = W.Teaching.contextHTML(args, W.K.shell(ctx, V.merge(r, { ns: ns, hrefs: W.manifest.navigation.hrefs })));
    return Object.freeze(V.merge(base, { title: r.title, html: html, notes: t.notes, openDialogs: V.openDialogIds(html), blocked: false }));
  }

  // 16 rows for the situations menu: applicable states, or the N/A reason.
  function stateOptions(entry) {
    return WB.manifest.states.map(function (s) {
      var applicable = entry.states.indexOf(s.id) >= 0;
      return { id: s.id, label: s.label, applicable: applicable, reason: applicable ? "" : entry.na[s.id] };
    });
  }

  V.STAGE_NS = STAGE_NS;
  V.renderFrame = renderFrame;
  V.stateOptions = stateOptions;
})(typeof globalThis !== "undefined" ? globalThis : this);
