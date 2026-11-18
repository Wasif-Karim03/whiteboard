// Phase 4 security/content source checks. These exercise fictional projections, never production security.
import fs from "node:fs";
import path from "node:path";
import { DATA_DIR } from "./load_data.mjs";

const clone = (x) => JSON.parse(JSON.stringify(x));
const platforms = ["web", "ipad", "iphone"];
const tokens = (e) => [null, ...e.states, ...Object.keys(e.variants)];
const main = (s) => (s.match(/<main[\s>][\s\S]*?<\/main>/) || [s])[0];
const links = (s) => [...s.matchAll(/data-go="([^"]+)"/g)].map((m) => m[1]);

// Render against a resolved view, so mutations cannot be undone by scenario overrides.
export function projectedRender(W, page, role, platform, token, view) {
  const e = W.pageFor(page);
  const tier = e.page.platforms[platform];
  const ctx = W.ctx({ platform, role, tier, ...(platform === "web" ? { width: "regular" } : platform === "ipad" ? { orientation: "landscape" } : {}) });
  const a = Object.freeze({ page: e.page, ctx, platform, sizeClass: ctx.sizeClass, orientation: ctx.orientation, tier, role,
    state: e.states.includes(token) ? token : null, variant: Object.hasOwn(e.variants, token) ? token : null,
    scenario: view.id, view, who: W.sel.viewerFor(view, role), sel: W.sel, K: W.K, WB: W, ns: "proof-c" });
  const r = e.render(a);
  return W.K.shell(ctx, { ...r, ns: "proof", hrefs: W.manifest.navigation.hrefs });
}

export function checkLeaks(W) {
  const errors = [];
  let renders = 0;
  const previewPages = new Set(["W23", "W24", "W25"]);
  for (const scenario of W.sel.scenarioIds()) {
    const original = W.sel.scenarioView(scenario);
    const changed = clone(original);
    const secret = "UNRELEASED_STAFF_EVIDENCE_79431";
    for (const r of changed.data.grades.results) if (r.pending) r.pending.score = 0.123456789;
    for (const d of changed.data.grades.grade_drafts) {
      d.overall_comment = secret;
      for (const q of Object.keys(d.comments)) d.comments[q] = secret;
      for (const q of Object.keys(d.marks)) d.marks[q] = 0.123456789;
    }
    W.deepFreeze(changed);
    for (const page of W.pageIds()) {
      const e = W.pageFor(page);
      const roles = [...(e.page.roles.includes("student") ? ["student"] : []), ...(previewPages.has(page) ? ["instructor"] : [])];
      for (const role of roles) for (const platform of platforms) for (const token of tokens(e)) {
        const at = `${page}/${role}/${platform}/${token || "default"}/${scenario}`;
        try {
          const before = projectedRender(W, page, role, platform, token, original);
          const after = projectedRender(W, page, role, platform, token, changed);
          renders += 2;
          if (before !== after || after.includes(secret)) errors.push(`leaks: ${at}: held data changes learner output`);
          if (role === "student") for (const key of ["held", "graded"]) {
            if (after.includes(`>${W.esc(W.STATUS[key].label)}<`)) errors.push(`leaks: ${at}: staff status ${key}`);
          }
        } catch (err) { errors.push(`leaks: ${at}: ${err.message}`); }
      }
    }
  }
  // Every student route/state/variant: hide current titles even on direct anchored routes.
  // Issued receipt snapshots may remain readable without the current unpublished title.
  const v = clone(W.sel.scenarioView("default"));
  const hidden = v.data.coursework.assessments;
  for (const [i, a] of hidden.entries()) { a.published = false; a.title = `UNPUBLISHED_ASSESSMENT_${i}_79431`; }
  W.deepFreeze(v);
  for (const page of W.pageIds().filter((id) => W.pageFor(id).page.roles.includes("student"))) for (const platform of platforms) for (const token of tokens(W.pageFor(page))) {
    try {
      const html = projectedRender(W, page, "student", platform, token, v);
      renders++;
      for (const a of hidden) if (html.includes(a.title)) errors.push(`leaks: ${page}/${platform}/${token}: unpublished assessment title`);
    } catch (err) { errors.push(`leaks: ${page}/${platform}/${token}: ${err.message}`); }
  }
  return { errors, summary: `${renders} learner/preview renders; held-data noninterference and unpublished-list probes` };
}

export function checkAuthority(W) {
  const errors = [];
  let renders = 0;
  for (const scenario of W.sel.scenarioIds()) {
    const v = W.sel.scenarioView(scenario);
    const ta = W.sel.viewerFor(v, "ta");
    const before = JSON.stringify(v);
    for (const item of v.data.coursework.assessments) {
      if (W.sel.canRelease(v, ta, item.course_id)) errors.push(`authority: ${scenario}/${item.id}: TA can release`);
    }
    for (const page of W.pageIds()) {
      const e = W.pageFor(page);
      for (const role of e.page.roles.filter((r) => ["instructor", "ta"].includes(r))) for (const platform of platforms) {
        for (const token of tokens(e)) {
          try {
            const html = projectedRender(W, page, role, platform, token, v);
            renders++;
            if (links(html).some((g) => /^W3[34](?:[:~]|$)/.test(g))) errors.push(`authority: ${page}/${role}: staff link to learner groups`);
            if (page === "W53" && role === "ta") {
              if (/role="dialog"|data-act="open-dialog"|fp-|data-go="W53~ps4_released"/.test(html)) errors.push(`authority: ${scenario}/${platform}/${token}: TA release/preview control`);
              const st = W.sel.enrolled(v, ta.courseId, "student");
              for (const id of st) if (main(html).includes(W.esc(W.sel.person(v, id).name))) errors.push(`authority: TA release page exposes learner ${id}`);
            }
          } catch (err) { errors.push(`authority: ${page}/${role}/${platform}/${token}/${scenario}: ${err.message}`); }
        }
      }
    }
    for (const page of ["W22", "W27"]) for (const platform of platforms) for (const token of tokens(W.pageFor(page))) {
      const html = projectedRender(W, page, "student", platform, token, v);
      renders++;
      if (/<(?:input|select|textarea)\b/.test(main(html)) || /data-act="open-dialog"/.test(html)) errors.push(`authority: ${page}/${platform}/${token}: receipt has edit controls`);
    }
    if (JSON.stringify(v) !== before) errors.push(`authority: ${scenario}: rendering mutated snapshots`);
  }
  const held = W.sel.scenarioView("default");
  const item = W.sel.anchorFor("W19").record.id;
  const st = W.sel.viewerFor(held, "student");
  if (W.sel.resultFor(held, st.personId, item, st).status !== null) errors.push("authority: held default result is visible to student");
  if (W.manifest.status.keyFor({ state: "graded", released: false }, "student", { own: true }).key !== "receivedNotReleased") errors.push("authority: Graded treated as Released");
  return { errors, summary: `${renders} authority renders; TA release, staff routes, immutable receipt/snapshot checks` };
}

// Claim lint is deliberately bounded; it cannot establish real-world identity provenance.
export function fictionalTextErrors(text, at) {
  const errors = [];
  for (const re of [/\btrusted by\b/i, /\b\d[\d,]* (?:paying )?customers\b/i, /\b(?:deployed to production|production-ready|live backend|real customer results)\b/i]) {
    if (re.test(text)) errors.push(`fictional: ${at}: unsupported claim ${re}`);
  }
  for (const email of text.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi) || []) if (!/\.(?:example|test|invalid)$/i.test(email)) errors.push(`fictional: ${at}: non-example contact ${email}`);
  return errors;
}

export function checkFictional(W) {
  const errors = [];
  if (!/Fictional/.test(W.data.world.notice)) errors.push("fictional: fixture notice missing");
  for (const [key, data] of Object.entries(W.data)) if (key !== "scenarios" && data.meta?.source !== "reconstructed") errors.push(`fictional: ${key}: missing reconstructed provenance`);
  errors.push(...fictionalTextErrors(JSON.stringify(W.data.world), "world"));
  let renders = 0;
  for (const page of W.pageIds()) {
    const e = W.pageFor(page);
    for (const role of e.page.roles) for (const token of tokens(e)) {
      const html = projectedRender(W, page, role, "web", token, W.sel.scenarioView("default"));
      errors.push(...fictionalTextErrors(html.replace(/<[^>]*>/g, " "), `${page}/${role}/${token}`));
      renders++;
    }
  }
  const sources = ["viewer/app.js", "viewer/gallery.js"].map((f) => fs.readFileSync(path.join(DATA_DIR, f), "utf8"));
  if (sources.some((s) => /\b(?:fetch|XMLHttpRequest|WebSocket)\s*\(/.test(s))) errors.push("fictional: viewer has a network client");
  return { errors, summary: `${renders} renders, fictional provenance/example contacts and unsupported-claim lint (not identity verification)` };
}
