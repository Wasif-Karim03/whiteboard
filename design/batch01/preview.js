/* Review-page controller: state switching, cross-screen navigation, theme/width/text-size,
   preview-only notes. Local only; no network, storage is optional per-viewer convenience. */
(function () {
  "use strict";
  const K = window.K, MAP = window.MAP;
  const cur = {};
  const store = { get(k) { try { return localStorage.getItem("wb-b01-" + k); } catch { return null; } }, set(k, v) { try { localStorage.setItem("wb-b01-" + k, v); } catch {} } };
  const toast = document.getElementById("pv-toast");
  let tt;
  const say = (msg) => { toast.textContent = msg; toast.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("on"), 3200); };

  function render(id, st, focusFrame) {
    const def = K.screens[id];
    if (!def.states.some((s) => s[0] === st)) st = def.states[0][0];
    cur[id] = st;
    const sec = document.getElementById(id);
    sec.querySelector('[data-slot="web"]').innerHTML = def.web(st);
    sec.querySelector('[data-slot="ios"]').innerHTML = def.ios(st);
    sec.querySelector('[data-slot="url"]').textContent = def.url(st);
    sec.querySelector('[data-slot="notes"]').innerHTML = window.PV.notes(id, st);
    for (const b of sec.querySelectorAll(".pv-states button")) b.setAttribute("aria-pressed", String(b.dataset.state === st));
    if (focusFrame) sec.querySelector("h2").focus({ preventScroll: true });
  }

  document.addEventListener("click", (ev) => {
    const sb = ev.target.closest(".pv-states button");
    if (sb) { render(sb.closest(".pv-sec").id, sb.dataset.state); return; }
    const f = ev.target.closest("[data-focus]");
    if (f && f.closest(".pv-frame")) {
      // Validation summaries move focus to the field they describe.
      const target = f.closest(".pv-frame").querySelector("#" + CSS.escape(f.dataset.focus));
      if (target) { target.scrollIntoView({ block: "center" }); target.focus({ preventScroll: true }); }
      return;
    }
    const t = ev.target.closest("[data-go],[data-note]");
    if (!t || !t.closest(".pv-frame")) return;
    ev.preventDefault();
    if (t.getAttribute("aria-disabled") === "true") { say(t.dataset.note || "Unavailable in this state — the reason is shown beside the control."); return; }
    if (t.dataset.go) {
      const [id, st] = t.dataset.go.split(":");
      if (K.screens[id]) {
        const fromSec = t.closest(".pv-sec").id;
        render(id, st);
        if (id !== fromSec) { document.getElementById(id).scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); document.getElementById(id).querySelector("h2").focus({ preventScroll: true }); }
        say(`${id} · ${K.screens[id].states.find((s) => s[0] === cur[id])[1]}` + (t.dataset.note ? " — " + t.dataset.note : ""));
        return;
      }
      // Screen designed in another batch page: open that page at the same state.
      if (MAP.xb && MAP.xb[id]) { location.href = MAP.xb[id].file + "#" + id + ":" + (st || MAP.xb[id].states[0]); return; }
    }
    say("Preview only: " + (t.dataset.note || "not wired in this batch"));
  });

  // Controls
  const root = document.documentElement;
  const setTheme = (v) => { if (v === "system") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", v); store.set("theme", v); press("theme", v); };
  const setWidth = (v) => { document.querySelectorAll(".pv-stage").forEach((s) => s.classList.toggle("narrowweb", v === "narrow")); document.querySelectorAll('[data-slot="wlabel"]').forEach((l) => (l.textContent = v === "narrow" ? "Responsive web · narrow (390 px)" : "Web · desktop")); store.set("width", v); press("width", v); };
  const setText = (v) => { document.querySelectorAll(".pv-frame").forEach((f) => f.style.setProperty("--wb-scale", v === "large" ? "1.24" : "1")); store.set("text", v); press("text", v); };
  const press = (g, v) => document.querySelectorAll(`[data-ctl="${g}"] button`).forEach((b) => b.setAttribute("aria-pressed", String(b.value === v)));
  document.querySelectorAll("[data-ctl] button").forEach((b) => b.addEventListener("click", () => ({ theme: setTheme, width: setWidth, text: setText })[b.closest("[data-ctl]").dataset.ctl](b.value)));
  setTheme(store.get("theme") || "system");
  setWidth(store.get("width") || "desktop");
  setText(store.get("text") || "default");

  // Deep link: #S07 or #S07:incomplete
  const fromHash = () => { const [id, st] = location.hash.slice(1).split(":"); if (K.screens[id] && st) { render(id, st); document.getElementById(id).scrollIntoView({ block: "start" }); document.getElementById(id).querySelector("h2").focus({ preventScroll: true }); } };
  for (const id of K.order) cur[id] = K.screens[id].states[0][0];
  fromHash();
  window.addEventListener("hashchange", fromHash);

  // Table of contents highlight
  const links = [...document.querySelectorAll(".pv-toc a")];
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-40% 0px -55% 0px" });
  document.querySelectorAll(".pv-sec").forEach((s) => io.observe(s));
})();
