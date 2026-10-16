// Builds the self-contained, offline design-review pages (one per batch) from editable sources.
// Usage (from repo root): node design/build.mjs            # all batches
//                         node design/build.mjs batch02    # one batch
// Reads the canonical app-map briefs/routes so each preview stays in sync with the atlas.
import fs from "node:fs";
import path from "node:path";
import { contrastReport } from "./tools/contrast.mjs";
import { BATCHES, SHARED_CSS } from "./batches.mjs";
import { base, read, brief, crossBatchIndex, mapFor, runBatch } from "./tools/load.mjs";

const only = process.argv[2];
const xb = crossBatchIndex();
const css = SHARED_CSS.map((f) => read(f)).join("\n");
const ctl = read("batch01/preview.js");
const seg = (ctl, opts) => `<div class="w-seg" role="group" data-ctl="${ctl}" aria-label="${ctl === "theme" ? "Theme" : ctl === "width" ? "Web frame width" : "Text size"}">${opts.map(([v, t]) => `<button type="button" value="${v}" aria-pressed="false">${t}</button>`).join("")}</div>`;

function sysSection(K) {
  const { ic } = K;
const swatch = (tok, use) => `<div class="pv-sw"><i style="background:var(--${tok})"></i><span><b>${use}</b><br><code>--${tok}</code></span></div>`;
const contrast = contrastReport(path.join(base, "system/tokens.css"));
const cfail = contrast.filter((r) => !r.pass);
const cmin = (theme) => Math.min(...contrast.filter((r) => r.theme === theme && r.min === 4.5).map((r) => r.ratio));
const sys = `<div class="pv-sys">
<section><h3>Type · system font, Dynamic Type roles</h3><div class="pv-type">
${[["iOS Large Title", "34/41 bold", 34, 700], ["Web page title · iOS Title 1", "26–28 bold", 26, 700], ["Section · Title 3", "19–20 semibold", 19, 650], ["Headline / card title", "16–17 semibold", 16.5, 650], ["Body (web 15 · iOS 17)", "15–17 regular", 15, 400], ["Secondary / footnote", "13 regular", 13, 400], ["Caption · badges", "12 semibold", 12, 600]].map(([n, m, s, w]) => `<div><code>${m}</code><span style="font-size:${s}px;font-weight:${w};line-height:1.2">${n}</span></div>`).join("")}
</div><p class="meta" style="margin-top:8px">SF Pro via the system stack; tabular figures for times, scores and counts. The ‘Larger text’ control previews +24% Dynamic Type; layouts must reflow, not truncate.</p></section>
<section><h3>Colour roles</h3>${[["wb-bg", "Page / grouped background"], ["wb-surface", "Card, list, sheet"], ["wb-fill", "Control fill"], ["wb-text", "Primary text"], ["wb-text-2", "Secondary text"], ["wb-border", "Input boundary"], ["wb-accent", "Whiteboard teal · actions"], ["wb-accent-tint", "Selection"], ["wb-focus", "Focus ring (blue, distinct from accent)"]].map(([t, u]) => swatch(t, u)).join("")}</section>
<section><h3>Status vocabulary — one wording everywhere</h3><div class="pv-row">${Object.keys(K.STATUS).map((k) => K.badge(k)).join("")}</div><p class="meta">Icon + words, never colour alone. ‘Queued · not received’ and ‘Received’ never share a colour or icon. ‘Feedback not released’ is neutral, not a warning — nothing is wrong.</p></section>
<section><h3>Actions</h3><div class="pv-row">${K.btn("Primary", { cls: "btn primary" })}${K.btn("Secondary")}${K.btn("Outline", { cls: "btn outline" })}${K.btn("Plain", { cls: "btn plain" })}${K.btn("Destructive", { cls: "btn destructive" })}${K.btn("Unavailable", { disabled: true })}</div><ul><li>One primary action per view region.</li><li>Unavailable actions stay focusable and are described by their reason.</li><li>Web hit target ≥ 32 px (24 px WCAG 2.2 minimum); iOS ≥ 44 pt.</li><li>Consequential actions (submit, release) confirm with the exact facts.</li></ul></section>
<section><h3>Notices</h3><div style="display:grid;gap:8px">${K.notice("info", "info", "Information", "Context the user should know.")}${K.notice("warning", "clock", "Warning", "Something may be stale or needs attention.")}${K.notice("error", "alert", "Error", "Something failed; says what was and wasn’t saved.")}${K.notice("neutral", "eye-off", "Neutral", "Waiting on someone else; nothing is wrong.")}</div></section>
<section><h3>Navigation · web vs planned iOS</h3><table class="pv-table"><thead><tr><th scope="col"></th><th scope="col">Web</th><th scope="col">iPhone (planned)</th></tr></thead><tbody>
<tr><th scope="row">Student primary</th><td>Sidebar: Today, Courses, Calendar, Updates; Campus: Events, Organizations, Support; officers also get a role-scoped organization section</td><td>Tab bar: Today, Courses, Calendar, Updates, Campus (fifth tab proposed in Batch 05, D42)</td></tr>
<tr><th scope="row">Staff primary</th><td>Sidebar: Teaching, Grading, Calendar, Updates; course tools: Builder, Files, Rubrics, People, Next term, Insights</td><td>Tab bar: Teaching, Grading, Calendar, Updates; dense authoring defers to web where recommended</td></tr>
<tr><th scope="row">Scheduling office</th><td>Sidebar: Timetable, Change reviews, Find a room (S26); role and term shown</td><td>Tab bar: Timetable, Reviews, Rooms; grid comparisons defer to web</td></tr>
<tr><th scope="row">Campus operations</th><td>Sidebar: Room requests, Find a room, Event reviews; office role shown</td><td>Tab bar: Requests, Reviews, Rooms</td></tr>
<tr><th scope="row">Access</th><td>Focused page; no product navigation until identity and role are known</td><td>No tab bar until role is known; system authentication sheet</td></tr>
<tr><th scope="row">Location</th><td>Breadcrumbs; course section links</td><td>Nav bar back + title; section chips</td></tr>
<tr><th scope="row">Support desk and institution administration</th><td>Support desk: Referral queue, Assigned to me. Administration: Initial setup, People/access/records, Connections, Migration rehearsal, Trust &amp; AI controls (Batch 06)</td><td>Queue/Mine tabs; administration tabs are read-first subsets with “Best on a computer” (desktop recommended, D56)</td></tr>
<tr><th scope="row">Shared tools</th><td>Top bar: Search (P45), Help (P46), Account (P44) — proposed, designed in Batch 06</td><td>Search from a nav-bar button and Account; Help from Account and error links; Support under Campus — no sixth tab (D50–D51)</td></tr>
<tr><th scope="row">Narrow web</th><td colspan="2">Sidebar collapses to a menu button; columns stack; it remains a web page (no tab bar, no native gestures)</td></tr>
<tr><th scope="row">Capture</th><td>Browser camera or file input</td><td>Full-screen camera, Photos, Files; system permission</td></tr></tbody></table></section>
<section><h3>Spacing, shape, motion, focus</h3><ul><li>4-pt grid: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 56.</li><li>Radii: controls 8, inset groups 10, cards 12, sheets 16.</li><li>Elevation: one soft card shadow; modals add scrim. No gradients.</li><li>Motion 120–320 ms ease-out for state changes only; none under Reduce Motion.</li><li>Focus: 3 px blue ring, 2 px offset, on every interactive element.</li><li>Light/dark from system preference with a manual override; iOS uses true-black grouped backgrounds.</li></ul></section>
<section><h3>Contrast · static token math</h3><p>${contrast.length} token pairs across light, dark and iOS dark: <b>${cfail.length ? cfail.length + " below target" : "all meet target"}</b>. Lowest text pair: light ${cmin("light").toFixed(2)}:1, dark ${cmin("dark").toFixed(2)}:1, iOS dark ${cmin("iosDark").toFixed(2)}:1.</p><p class="meta">Colour arithmetic only. Rendered contrast, forced colours and screen-reader output are not yet verified.</p></section>
</div>`;

  return sys;
}

function build(b) {
  const MAP = mapFor(b, xb);
  const { K, PV } = runBatch(b, MAP);
  const { esc, ic } = K;
  if (K.order.join() !== b.ids.join()) throw Error(`${b.key}: screen registry mismatch: ${K.order.join()}`);
  const js = b.js.map((f) => read(f));

  // ---------- Screen sections (static default state; JS re-renders on change) ----------
  const sections = K.order.map((id) => {
    const def = K.screens[id], m = brief(id), st = def.states[0][0];
    const kind = m.status === "proposed" ? `<span class="badge info">${ic("info")}Proposed destination</span>` : `<span class="badge neutral">${ic("info")}Concept · web</span>`;
    const desk = m.ios.desktopRecommended ? `<span class="badge accent">${ic("laptop")}Desktop recommended · iOS is a subset</span>` : "";
    return `<section class="pv-sec" id="${id}" aria-labelledby="${id}-h">
<header><span class="id">${id}</span><h2 id="${id}-h" tabindex="-1">${esc(m.title)}</h2><span class="meta">${esc(m.role)} · ${esc(m.domain)}</span>${kind}<span class="badge warning">${ic("info")}Planned iOS · not built</span>${desk}<span class="badge neutral">Ready for review · not accepted</span></header>
<p class="pv-purpose">${esc(m.purpose)}</p>
<div class="pv-states" role="group" aria-label="${id} state">${def.states.map(([k, t, mi, why]) => `<button type="button" data-state="${k}" aria-pressed="${k === st}"${why ? ` title="${esc(why)}"` : ""}>${esc(t)}${mi == null ? '<span class="x">added</span>' : ""}</button>`).join("")}</div>
<div class="pv-stage">
  <div><p class="pv-frame-label"><b data-slot="wlabel">Web · desktop</b><span>·</span><span>${esc(m.web.presentation)}</span></p>
  <div class="pv-webwrap"><div class="pv-web"><div class="chrome" aria-hidden="true"><span class="dots"><i></i><i></i><i></i></span><span class="url">${ic("lock")}<span data-slot="url">${esc(def.url(st))}</span></span></div><div class="viewport pv-frame" role="region" aria-label="${id} web design">
  <div data-slot="web">${def.web(st)}</div></div></div></div></div>
  <div><p class="pv-frame-label"><b>iPhone · planned iOS</b><span>·</span><span>HTML illustration, not a native build</span></p>
  <div class="pv-phone"><div class="screen pv-frame" role="region" aria-label="${id} planned iPhone design"><div data-slot="ios" style="height:100%">${def.ios(st)}</div></div><div class="island" aria-hidden="true"></div></div></div>
</div>
<div class="pv-spec" data-slot="notes">${PV.notes(id, st)}</div>
</section>`;
  });

  // ---------- Journeys ----------
  const node = (s) => {
    if (b.ids.includes(s)) return `<a href="#${s}"><b>${s}</b>${esc(brief(s).title)}</a>`;
    if (xb[s]) return `<a class="staff" href="${xb[s].file}#${s}"><b>${s}</b>${esc(brief(s).title)}<span class="meta">${xb[s].batch}</span></a>`;
    return `<a class="staff" href="#journey" aria-disabled="true"><b>${s}</b>${esc(brief(s).title)}<span class="meta">Later batch</span></a>`;
  };
  const strip = (j) => `<h3 style="font-size:15px;margin:14px 0 2px">${esc(j.id[0].toUpperCase() + j.id.slice(1))} journey</h3><p class="meta" style="max-width:90ch">${esc(j.summary)}</p><div class="pv-journey" aria-label="${esc(j.id)} journey steps">${j.steps.map((s, i) => {
    const solid = (x) => b.ids.includes(x);
    const dash = i && !(solid(s) && solid(j.steps[i - 1]));
    return (i ? `<span class="${dash ? "dash" : "arrow"}" aria-hidden="true">${dash ? "⇢" : "→"}</span>` : "") + node(s);
  }).join("")}</div>`;
  const journeys = MAP.journeys.map(strip).join("");
  const others = BATCHES.filter((o) => o.key !== b.key).map((o) => `<a href="${path.basename(o.out)}">${o.label}</a>`).join("");
  const sys = sysSection(K);

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${b.title}</title>
<meta name="description" content="${esc(b.description)}">
<style>${css}</style>
</head>
<body>
${K.sprite}
<a class="pv-skip" href="#journey">Skip to the journeys</a>
<header class="pv-top">
  <h1><span class="w-mark" aria-hidden="true" style="width:22px;height:22px;font-size:13px">w</span>Whiteboard design · ${b.label}</h1>
  <div class="pv-controls">
    <span class="pv-ctl">Theme ${seg("theme", [["system", "System"], ["light", "Light"], ["dark", "Dark"]])}</span>
    <span class="pv-ctl">Web frame ${seg("width", [["desktop", "Desktop"], ["narrow", "Narrow"]])}</span>
    <span class="pv-ctl">Text ${seg("text", [["default", "Default"], ["large", "Larger"]])}</span>
  </div>
</header>
<nav class="pv-toc" aria-label="Sections"><a href="#journey">Journeys</a><a href="#system">Design system</a>${b.ids.map((id) => `<a href="#${id}">${id} ${esc(brief(id).title)}</a>`).join("")}${others ? `<span class="meta" style="align-self:center;padding:0 6px">Other batches:</span>${others}` : ""}</nav>
<main class="pv" id="main">
<section class="pv-intro" aria-label="About this preview">
  <div><h2>${b.heading}</h2>
  ${b.intro.map((p) => `<p>${p}</p>`).join("\n  ")}</div>
  <div class="pv-truth"><h3>What this is — and isn’t</h3><ul>
  <li>Design review draft. <b>Not owner-accepted.</b></li>
  <li>All people, schools, courses, scores and receipts are fictional.</li>
  <li>Web frames are concept designs; P-numbered screens are <b>proposed</b> destinations. iPhone frames are HTML illustrations of a <b>planned</b> iOS app; no native build exists.</li>
  <li>No sign-in, identity provider, upload, storage, grading service or live integration exists. URLs use the reserved <code>.example</code> domain.</li>
  <li>Browser, keyboard, screen-reader and device checks have <b>not been run</b>. Only static source checks have.</li></ul></div>
</section>
<section class="pv-sec" id="journey" aria-labelledby="journey-h"><header><h2 id="journey-h" tabindex="-1">Journeys and recovery paths</h2></header>
${journeys}
<h3 style="font-size:15px;margin:18px 0 8px">Recovery paths</h3>
<div class="pv-recovery">${b.recovery.map(([go, t, d]) => `<div><b><a href="#${go}">${go.replace(":", " · ")}</a> — ${t}</b>${d}</div>`).join("")}</div></section>
<section class="pv-sec" id="system" aria-labelledby="system-h"><header><h2 id="system-h" tabindex="-1">Shared design system</h2><span class="badge neutral">Proposed · not accepted</span></header>
<p class="pv-purpose">Restrained and system-native: SF Pro, generous whitespace, one teal identity colour, semantic status that never relies on colour alone. Web and iOS share tokens and status language; navigation and layout follow each platform’s conventions.</p>${sys}</section>
${sections.join("\n")}
</main>
<div class="pv-toast" id="pv-toast" role="status" aria-live="polite"></div>
<script>window.MAP=${JSON.stringify(MAP).replace(/</g, "\\u003c")};</script>
<script>${js.join("\n")}</script>
<script>${ctl}</script>
</body>
</html>
`;
  const out = path.join(base, b.out);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(`Built ${path.relative(path.join(base, ".."), out)} · ${(html.length / 1024).toFixed(0)} KB · ${b.ids.length} screens · ${K.order.reduce((n, id) => n + K.screens[id].states.length, 0)} states × 2 platforms`);
}

for (const b of BATCHES) if (!only || b.key === only) build(b);

// The owner review packet (preview/index.html) summarises every batch; rebuild it with a full build.
if (!only) await import("./tools/build_review.mjs");
