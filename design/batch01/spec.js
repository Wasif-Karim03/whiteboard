/* Spec panel: joins the design notes with the canonical app-map brief (screens.json/routes.json,
   embedded at build time as window.MAP). Shared by the Node build and the browser. */
(function () {
  "use strict";
  const K = window.K;
  const esc = K.esc;
  const PV = (window.PV = {});
  const title = (id) => (window.MAP.screens.find((s) => s.id === id) || { title: id }).title;
  PV.notes = (id, st) => {
    const def = K.screens[id], brief = window.MAP.screens.find((s) => s.id === id);
    const s = def.states.find((x) => x[0] === st);
    const n = def.notes[st] || {};
    const edges = window.MAP.edges;
    const out = edges.filter((e) => e.source === id), inc = edges.filter((e) => e.target === id && e.source !== id);
    const r = (e, other) => `<div class="route${e.handoff ? " handoff" : ""}"><b>${other}</b><span>${esc(e.label)} <span class="meta">· ${esc(title(other))}</span></span>${e.condition || e.handoff ? `<span class="c">${e.handoff ? "Role handoff — no student access to staff tools. " : ""}${esc(e.condition)}</span>` : ""}</div>`;
    const covered = (i) => def.states.find((x) => x[2] === i);
    return `<section aria-label="This state"><h3>This state · ${esc(s[1])}</h3>${s[3] ? `<p class="meta" style="margin-bottom:6px">${esc(s[3])}</p>` : ""}<h4>Web</h4><p>${n.web || "—"}</p><h4>iPhone (planned)</h4><p>${n.ios || "—"}</p><h4>Accessibility</h4><ul>${def.a11y.map((x) => `<li>${x}</li>`).join("")}</ul></section>
<section aria-label="Map brief"><h3>Map brief · screens.json</h3><h4>States</h4><ul style="list-style:none;padding:0">${brief.states.map((x, i) => `<li class="mapstate"><span class="k">${covered(i) ? "✓ " + esc(covered(i)[1]) : "MISSING"}</span><span>${esc(x)}</span></li>`).join("")}</ul><h4>Content</h4><ul>${brief.content.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><h4>Presentation</h4><p><b>Web:</b> ${esc(brief.web.presentation)}</p><p><b>iOS:</b> ${esc(brief.ios.presentation)}</p></section>
<section aria-label="Routes"><h3>Routes · routes.json</h3><h4>Leaves to (${out.length})</h4>${out.map((e) => r(e, e.target)).join("")}<h4>Arrives from (${inc.length})</h4>${inc.map((e) => r(e, e.source)).join("")}</section>`;
  };
})();
