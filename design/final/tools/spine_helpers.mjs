// Phase 3 spine test helpers (shared by spine.test.mjs and spine-authority.test.mjs). frame() renders through
// the viewer composer; direct() builds the same frozen render arguments by hand, so a test can combine a
// state with a variant or pass a modified data copy (plan T7, R14). Source checks only.
import { loadSite } from "./load_site.mjs";
import { frameProblems } from "./check_render.mjs";

export const WB = loadSite();
export const S = WB.sel;
export const P = WB.P;
export const esc = WB.esc;
export const SPINE = [...WB.manifest.spine];
export const SCENARIOS = S.scenarioIds();
export const CTX5 = [
  { platform: "web", width: "regular" }, { platform: "web", width: "narrow" },
  { platform: "ipad", orientation: "landscape" }, { platform: "ipad", orientation: "portrait" }, { platform: "iphone" },
];
export const CTX3 = [CTX5[0], CTX5[2], CTX5[4]];
export const NS = "t";

export const view = (sc = "default") => S.scenarioView(sc);
export const viewer = (sc, role) => S.viewerFor(view(sc), role);
export const copy = (x) => JSON.parse(JSON.stringify(x));
export const title = (id, sc = "default") => S.assessment(view(sc), id).title;
export const when = (iso) => `${S.fmtDateTime(iso)} ${S.zoneAbbr(iso)}`;
export const courseId = () => viewer("default", "student").courseId;
export const studentIds = (sc = "default") => S.enrolled(view(sc), courseId(), "student");
export const studentNames = (sc = "default") => studentIds(sc).map((p) => S.person(view(sc), p).name);

export function frame(vs) {
  const V = WB.viewer;
  const f = V.renderFrame(WB, V.normalize(WB, { ...V.DEFAULTS, ...vs }).vs, { ns: NS });
  return { ...f, openDialogs: [...f.openDialogs], problems: [...frameProblems(f.html, vs.platform || "web", f.tier)] };
}

export function direct(pageId, o = {}) {
  const entry = WB.pageFor(pageId);
  const page = entry.page;
  const platform = o.platform || "web";
  const tier = page.platforms[platform];
  const input = { platform, role: o.role, tier };
  if (platform === "web") input.width = o.width || "regular";
  if (platform === "ipad") input.orientation = o.orientation || "landscape";
  const ctx = WB.ctx(input);
  const scenario = o.scenario || "default";
  const v = o.data ? S.buildView(o.data, scenario) : view(scenario);
  const selected = o.selection ? S.resolveTeachingSelection(v, o.role, o.selection, pageId, o.variant || null) : null;
  if (selected && !selected.allowed) throw new Error("direct: selected record is outside scope; use frame to verify the denial UI");
  const args = Object.freeze({
    page, ctx, platform: ctx.platform, sizeClass: ctx.sizeClass, orientation: ctx.orientation, tier, role: o.role,
    state: o.state || null, variant: o.variant || null, scenario, view: v, who: selected && selected.allowed ? selected.who : S.viewerFor(v, o.role), selection: selected && selected.allowed ? selected.selection : null, sel: S, K: WB.K, WB, ns: `${NS}-c`,
  });
  const r = entry.render(args);
  const html = WB.K.shell(ctx, { ...r, ns: NS, hrefs: WB.manifest.navigation.hrefs });
  return { html, tier, openDialogs: [...WB.viewer.openDialogIds(html)], problems: [...frameProblems(html, platform, tier)] };
}

export const tokensOf = (id) => [null, ...WB.pageFor(id).states, ...Object.keys(WB.pageFor(id).variants)];
export const rolesOf = (id) => [...WB.pageFor(id).page.roles];
export const count = (html, needle) => html.split(needle).length - 1;
export const mainOf = (html) => {
  const start = html.search(/<main[\s>]/);
  return html.slice(start, html.indexOf("</main>", start) + 7);
};
export const idsInMain = (html) => [...mainOf(html).replace(/^<main[^>]*>/, "").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
// The dialog element and everything after it (dialogs sit in the shell overlays, after </main>).
export const dialogOf = (html, id) => {
  const at = html.indexOf(`id="${id}"`);
  return at < 0 ? "" : html.slice(html.lastIndexOf("<div", at));
};
export const goLinks = (html) => [...html.matchAll(/data-go="([^"]+)"/g)].map((m) => m[1]);
export const goPages = (html) => goLinks(html).map((g) => g.split(/[:~?]/)[0]);
// Table rows (<tr>) or compact row-cards (<li class="wb-rowcard">) whose text holds the needle.
export function rowsWith(html, needle) {
  const rows = [...html.matchAll(/<tr[\s>][\s\S]*?<\/tr>|<li class="wb-rowcard[\s\S]*?<\/li>/g)].map((m) => m[0]);
  return rows.filter((r) => r.includes(needle));
}
export const disabledWith = (html, reason) => html.includes('aria-disabled="true"') && html.includes(esc(reason));
