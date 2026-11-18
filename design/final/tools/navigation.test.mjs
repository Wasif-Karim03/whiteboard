// Integration mutation regressions. Source checks only, not browser acceptance.
import test from "node:test";
import assert from "node:assert/strict";
import { loadSite } from "./load_site.mjs";
import { checkLinks, checkReach, dataGos, REQUIRED_HOPS } from "./check_navigation.mjs";

const W = loadSite();
const frame = (over) => W.viewer.renderFrame(W, { ...W.viewer.DEFAULTS, page: "W49", role: "instructor", ...over });

// Keep mutation matrices bounded. All twelve real tours still run; the baseline above
// separately proves the full role/platform/scenario/state matrix.
function mutationSite() {
  const base = loadSite();
  return {
    ...base,
    manifest: { ...base.manifest, pages: base.manifest.pages.filter((p) => p.id === "W49") },
    CONTEXTS: [base.CONTEXTS[0]],
    sel: { ...base.sel, scenarioIds: () => ["default"] },
  };
}

test("all actual page links and 12 reducer tours resolve, with required same-role page hops", () => {
  const r = checkLinks(W);
  assert.deepEqual(r.errors, []);
  assert.equal(r.steps, 78);
  assert.equal(r.hops, REQUIRED_HOPS.length);
  assert.ok(r.renders > 40000);
  assert.ok(r.links > 500000);
});

test("rendered gallery and index links reach all 189 targets, including optional pages", () => {
  const r = checkReach(W);
  assert.deepEqual(r.errors, []);
  assert.equal(r.targets.size, 189);
  for (const id of ["O01", "O02", "O03"]) for (const p of ["web", "ipad", "iphone"]) assert.ok(r.targets.has(`${id}/${p}`));
});

test("W49 rubric-impact link is instructor-only and matches the receipt rubric", () => {
  for (const platform of ["web", "ipad", "iphone"]) {
    assert.ok(dataGos(frame({ platform }).html).includes("W50"));
    assert.ok(dataGos(frame({ platform, token: "ben" }).html).includes("W50"));
    assert.ok(!dataGos(frame({ platform, role: "ta" }).html).includes("W50"));
    assert.ok(!dataGos(frame({ platform, token: "group", scenario: "group_submission" }).html).includes("W50"));
    assert.ok(!dataGos(frame({ platform, token: "permissionUnavailable" }).html).includes("W50"));
  }
});

test("navigation proof rejects bad pages, tokens, scenarios, role changes, href mismatch and missing required hop", () => {
  const M = mutationSite(), original = M.viewer.renderFrame;
  M.viewer.renderFrame = (w, vs, opts) => {
    const f = original(w, vs, opts);
    if (vs.page !== "W49" || vs.role !== "instructor") return f;
    const broken = ["W99", "W50:missing", "W50~never", "W33"].map((g) => `<a href="#/${g}" data-go="${g}">Broken</a>`).join("");
    return { ...f, html: f.html.replace(/<a\b[^>]*data-go="W50"[^>]*>[\s\S]*?<\/a>/g, "") + broken + '<a href="#/W05" data-go="W06">Wrong href</a>' };
  };
  const errors = checkLinks(M).errors.join("\n");
  assert.match(errors, /W99.*page did not resolve/);
  assert.match(errors, /W50:missing.*unknown destination token/);
  assert.match(errors, /W50~never.*Unknown scenario/);
  assert.match(errors, /W33.*destination disallows/);
  assert.match(errors, /data-go\/href mismatch/);
  assert.match(errors, /missing rendered journey hop J03 W49->W50/);
});

test("navigation proof rejects a reducer that loses tour clock or token", () => {
  const M = mutationSite(), original = M.viewer.reduce;
  M.viewer.reduce = (w, vs, action) => {
    const r = original(w, vs, action);
    return action.type === "tour" && action.op === "next" ? { ...r, vs: { ...r.vs, scenario: "default", token: null } } : r;
  };
  assert.match(checkLinks(M).errors.join("\n"), /reducer lost page\/role\/scenario\/token/);
});

test("a different source record variant cannot supply a missing required journey hop", () => {
  const M = mutationSite(), original = M.viewer.renderFrame;
  M.viewer.renderFrame = (w, vs, opts) => {
    const f = original(w, vs, opts);
    // Ben's receipt still links to W50, but the J03 Aisha receipt no longer does.
    if (vs.page !== "W49" || vs.role !== "instructor" || vs.token === "ben") return f;
    return { ...f, html: f.html.replace(/<a\b[^>]*data-go="W50"[^>]*>[\s\S]*?<\/a>/g, "") };
  };
  const ben = M.viewer.renderFrame(M, { ...M.viewer.DEFAULTS, page: "W49", role: "instructor", token: "ben" });
  assert.ok(dataGos(ben.html).includes("W50"));
  assert.match(checkLinks(M).errors.join("\n"), /missing rendered journey hop J03 W49->W50/);
});

test("reach proof rejects omitted gallery links, missing index entries and placeholder output", () => {
  const M = loadSite(), section = M.viewer.boardSection, index = M.viewer.boardIndex, render = M.viewer.renderFrame;
  M.viewer.boardSection = (w, id, o) => section(w, id, o).replace(/<a\b[^>]*href="Whiteboard-Final.html#\/O01[^>]*>[\s\S]*?<\/a>/g, "");
  M.viewer.boardIndex = (w) => index(w).replace('href="#board-W49"', 'href="#board-missing"');
  M.viewer.renderFrame = (w, vs, o) => {
    const f = render(w, vs, o);
    return vs.page === "O02" ? { ...f, html: f.html + "This page is a placeholder" } : f;
  };
  const r = checkReach(M), errors = r.errors.join("\n");
  assert.match(errors, /O01 missing emitted/);
  assert.match(errors, /index must link once to W49/);
  assert.match(errors, /placeholder O02/);
  assert.equal(r.targets.size, 186);
});
