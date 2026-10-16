/* Click-through prototype controller. Renders the approved screen designs full-size and follows
   their links. Local only: no network; the remembered platform/theme are per-viewer conveniences.
   Nothing here is production code and all records are fictional. */
(function () {
  "use strict";
  const K = window.K, MAP = window.MAP, P = window.PROTO;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = K.esc;
  const store = { get(k) { try { return localStorage.getItem("wb-proto-" + k); } catch { return null; } }, set(k, v) { try { localStorage.setItem("wb-proto-" + k, v); } catch {} } };
  const title = (id) => (MAP.screens.find((s) => s.id === id) || { title: id }).title;
  const stateOf = (id, st) => K.screens[id].states.find((s) => s[0] === st) || K.screens[id].states[0];
  const roleBy = (k) => P.roles.find((r) => r.key === k);
  const roleOfScreen = (id) => Object.keys(P.screenRole).find((k) => P.screenRole[k].includes(id));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const S = { role: null, id: null, st: null, platform: store.get("platform") || (innerWidth < 720 ? "ios" : "web"), tour: null, step: 0, as: null };
  const view = $("#pt-view"), toastEl = $("#pt-toast");
  let tt;
  function toast(msg, action) {
    toastEl.innerHTML = `<span>${esc(msg)}</span>` + (action ? `<button type="button" class="pt-tbtn" data-act="toast">${esc(action.label)}</button>` : "");
    toastEl._act = action && action.run;
    toastEl.classList.add("on");
    clearTimeout(tt);
    tt = setTimeout(() => toastEl.classList.remove("on"), action ? 7000 : 3600);
  }

  // ---------- Routing: #role/S07:confirm ----------
  const hashFor = () => (S.role ? `#${S.role}/${S.id}:${S.st}` + (S.tour ? `/${S.tour}.${S.step}` : "") : "#");
  function go(id, st, opts = {}) {
    if (!K.screens[id]) return toast("That screen isn’t part of this prototype.");
    S.id = id; S.st = stateOf(id, st)[0];
    S.as = opts.as || null;
    if (S.tour && !opts.fromTour) syncTourStep();
    const h = hashFor();
    if (location.hash !== h) history[opts.replace ? "replaceState" : "pushState"](null, "", h);
    render();
  }
  function fromHash() {
    const [role, scr, tour] = location.hash.slice(1).split("/");
    if (!role || !roleBy(role)) { S.role = null; S.tour = null; return renderWelcome(); }
    S.role = role;
    if (tour) { const [t, n] = tour.split("."); if (P.tours[t]) { S.tour = t; S.step = +n || 0; } } else S.tour = null;
    const [id, st] = (scr || roleBy(role).home).split(":");
    S.id = K.screens[id] ? id : roleBy(role).home.split(":")[0];
    S.st = stateOf(S.id, st)[0];
    S.as = S.tour ? P.tours[S.tour].steps[S.step][2] || null : null;
    render();
  }
  window.addEventListener("popstate", fromHash);

  // ---------- Tours ----------
  function syncTourStep() {
    const steps = P.tours[S.tour].steps;
    const exact = steps.findIndex((s, i) => i >= S.step && s[0] === `${S.id}:${S.st}`);
    const any = exact >= 0 ? exact : steps.findIndex((s) => s[0] === `${S.id}:${S.st}`);
    if (any >= 0) { S.step = any; S.as = steps[any][2] || null; }
  }
  function startTour(key) {
    S.tour = key; S.step = 0;
    closeMenus();
    const [s0, , as] = P.tours[key].steps[0];
    const [id, st] = s0.split(":");
    go(id, st, { as, fromTour: true });
  }
  function tourStep(d) {
    const steps = P.tours[S.tour].steps;
    const n = Math.max(0, Math.min(steps.length - 1, S.step + d));
    S.step = n;
    const [id, st] = steps[n][0].split(":");
    go(id, st, { as: steps[n][2], fromTour: true });
  }
  function endTour() { S.tour = null; S.as = null; history.replaceState(null, "", hashFor()); render(); }

  // ---------- Rendering ----------
  function renderWelcome() {
    document.body.classList.add("pt-welcoming");
    $("#pt-bar").hidden = true;
    $("#pt-tour").hidden = true;
    view.className = "pt-welcome";
    view.innerHTML = `<div class="pt-wel-in">
<p class="pt-kicker">Whiteboard · interactive prototype</p>
<h1>Pick a role and click around</h1>
<p class="pt-lead">This is a click-through prototype of Whiteboard, a learning and campus platform for <b>Alder Hill</b>, a fictional college. Every person, course, grade and record is made up. The buttons work: they move through the designs the way the real product would. Each role has guided tours, or you can explore freely.</p>
<div class="pt-roles">${P.roles.map((r) => `<article class="pt-role"><div class="pt-rhead"><span class="pt-av">${r.initials}</span><div><h2>${esc(r.label)}</h2><p class="pt-meta">${esc(r.person)}</p></div></div><p>${esc(r.blurb)}</p>
<button type="button" class="pt-primary" data-act="role" data-role="${r.key}">Explore as ${esc(r.label.toLowerCase())}</button>
<ul class="pt-tourlist">${r.tours.map((t) => `<li><button type="button" class="pt-link" data-act="tour" data-role="${r.key}" data-tour="${t}">${esc(P.tours[t].title)}</button> <span class="pt-meta">· ${P.tours[t].steps.length} steps</span></li>`).join("")}</ul></article>`).join("")}</div>
<section class="pt-how"><h2>How it works</h2><ul>
<li><b>Web or iPhone.</b> Switch at the top. The iPhone screens show a planned app; no native app exists.</li>
<li><b>Tours</b> walk through one task step by step, sometimes switching to another person’s view so you see both sides.</li>
<li><b>Other situations</b> shows the same screen when something is offline, late, blocked or waiting on someone.</li>
<li>Typing doesn’t save anything, and a few controls only explain where they’d lead. Those show a short note instead.</li></ul>
<p class="pt-meta">A design prototype with fictional data. Not a working product, not connected to any school system, and it makes no claims about real customers or results.</p></section></div>`;
    document.title = "Whiteboard prototype";
    $("#pt-view").focus({ preventScroll: true });
  }

  function render() {
    if (!S.role) return renderWelcome();
    document.body.classList.remove("pt-welcoming");
    $("#pt-bar").hidden = false;
    const def = K.screens[S.id], st = stateOf(S.id, S.st);
    const asKey = S.as || roleOfScreen(S.id);
    const asRole = asKey && asKey !== S.role ? roleBy(asKey) : null;
    // Bar
    $("#pt-role").textContent = roleBy(S.role).label;
    $("#pt-where").innerHTML = `<b>${esc(title(S.id))}</b><span class="pt-meta"> · ${esc(st[1])}</span>` + (asRole ? ` <span class="pt-as">Viewing as ${esc(asRole.label.toLowerCase())}</span>` : "");
    for (const b of document.querySelectorAll("[data-platform]")) b.setAttribute("aria-pressed", String(b.dataset.platform === S.platform));
    // Screen
    const html = S.platform === "web" ? def.web(st[0]) : def.ios(st[0]);
    view.className = S.platform === "web" ? "pt-web" : "pt-ios";
    view.innerHTML = S.platform === "web"
      ? `<div class="pt-webframe pv-frame" role="region" aria-label="${esc(title(S.id))}, web">${html}</div>`
      : `<div class="pt-phonewrap"><div class="pt-phone"><div class="screen pv-frame" role="region" aria-label="${esc(title(S.id))}, planned iPhone"><div style="height:100%">${html}</div></div><div class="island" aria-hidden="true"></div></div></div>`;
    decorateHandoffs();
    fitPhone();
    view.scrollTop = 0;
    const wf = $(".pt-webframe"); if (wf) wf.scrollTop = 0;
    // Tour bar
    const tb = $("#pt-tour");
    if (S.tour) {
      const t = P.tours[S.tour], n = t.steps.length, cur = t.steps[S.step];
      const on = cur[0] === `${S.id}:${S.st}`;
      tb.hidden = false;
      tb.innerHTML = `<div class="pt-tour-txt"><span class="pt-meta">${esc(t.title)} · step ${S.step + 1} of ${n}</span><b>${on ? esc(cur[1]) : "You’ve left the tour path. Next continues it."}</b></div>
<div class="pt-dots" aria-hidden="true">${t.steps.map((_, i) => `<i class="${i < S.step ? "done" : i === S.step ? "cur" : ""}"></i>`).join("")}</div>
<div class="pt-tour-btns"><button type="button" class="pt-tbtn" data-act="prev" ${S.step === 0 && on ? "disabled" : ""}>Back</button>${S.step < n - 1 ? `<button type="button" class="pt-tbtn primary" data-act="next">Next</button>` : `<button type="button" class="pt-tbtn primary" data-act="endtour">Finish</button>`}<button type="button" class="pt-tbtn" data-act="endtour" aria-label="Exit tour">✕</button></div>`;
      if (!on) tb.querySelector('[data-act="next"]') && (tb.querySelector('[data-act="next"]').dataset.act = "resume");
    } else tb.hidden = true;
    document.body.classList.toggle("pt-touring", !!S.tour);
    document.title = `${title(S.id)} · Whiteboard prototype`;
  }

  // Student→staff handoffs are explained in words in the designs. In the prototype, offer to look at the other side.
  function decorateHandoffs() {
    for (const p of view.querySelectorAll("[data-handoff]")) {
      const id = p.dataset.handoff;
      if (!K.screens[id]) continue;
      const b = document.createElement("button");
      b.type = "button"; b.className = "pt-handoff"; b.dataset.act = "handoff"; b.dataset.target = id;
      b.textContent = `See the other side: ${title(id)} →`;
      p.after(b);
    }
  }

  function fitPhone() {
    const wrap = $(".pt-phonewrap"); if (!wrap) return;
    const ph = wrap.firstElementChild;
    const availH = view.clientHeight - 24, availW = view.clientWidth - 24;
    const small = innerWidth < 500;
    document.body.classList.toggle("pt-fullphone", small);
    if (small) { ph.style.transform = ""; wrap.style.height = ""; wrap.style.width = ""; return; }
    const sc = Math.min(1, availH / 874, availW / 415);
    ph.style.transform = `scale(${sc})`;
    wrap.style.width = `${415 * sc}px`; wrap.style.height = `${874 * sc}px`;
  }
  window.addEventListener("resize", fitPhone);

  // ---------- Menus ----------
  function closeMenus() { for (const m of document.querySelectorAll(".pt-menu")) m.hidden = true; for (const b of document.querySelectorAll("[aria-expanded]")) b.setAttribute("aria-expanded", "false"); }
  function openMenu(btn, html) {
    const m = $("#" + btn.getAttribute("aria-controls"));
    const open = m.hidden;
    closeMenus();
    if (!open) return;
    m.innerHTML = html; m.hidden = false; btn.setAttribute("aria-expanded", "true");
    const f = m.querySelector("button"); if (f) f.focus();
  }
  const menuRoles = () => P.roles.map((r) => `<button type="button" data-act="role" data-role="${r.key}" ${r.key === S.role ? 'aria-current="true"' : ""}><b>${esc(r.label)}</b><span class="pt-meta">${esc(r.person)}</span></button>`).join("") + `<button type="button" data-act="home"><b>All roles</b><span class="pt-meta">Back to the start page</span></button>`;
  const menuTours = () => { const r = roleBy(S.role); const other = Object.keys(P.tours).filter((t) => !r.tours.includes(t)); return `<p class="pt-mh">${esc(r.label)}</p>` + r.tours.map((t) => `<button type="button" data-act="tour" data-tour="${t}" ${t === S.tour ? 'aria-current="true"' : ""}><b>${esc(P.tours[t].title)}</b><span class="pt-meta">${esc(P.tours[t].intro)}</span></button>`).join("") + `<p class="pt-mh">Other roles’ tours</p>` + other.map((t) => `<button type="button" data-act="tour" data-tour="${t}"><b>${esc(P.tours[t].title)}</b><span class="pt-meta">${esc(roleBy(P.roles.find((x) => x.tours.includes(t)).key).label)}</span></button>`).join(""); };
  const menuStates = () => `<p class="pt-mh">${esc(title(S.id))} in other situations</p>` + K.screens[S.id].states.map((s) => `<button type="button" data-act="state" data-st="${s[0]}" ${s[0] === S.st ? 'aria-current="true"' : ""}><b>${esc(s[1])}</b>${s[3] ? `<span class="pt-meta">${esc(s[3])}</span>` : ""}</button>`).join("");

  // ---------- Events ----------
  const CLOSERS = /^(cancel|close|done|not now|back|keep editing|dismiss|ok|got it)\b/i;
  document.addEventListener("click", (ev) => {
    const a = ev.target.closest("[data-act]");
    if (a) {
      const act = a.dataset.act;
      if (act === "role") { closeMenus(); S.tour = null; S.role = a.dataset.role; const [id, st] = roleBy(S.role).home.split(":"); return go(id, st); }
      if (act === "home") { closeMenus(); S.role = null; S.tour = null; history.pushState(null, "", "#"); return renderWelcome(); }
      if (act === "tour") { if (a.dataset.role) S.role = a.dataset.role; return startTour(a.dataset.tour); }
      if (act === "state") { closeMenus(); return go(S.id, a.dataset.st); }
      if (act === "platform") { S.platform = a.dataset.platform; store.set("platform", S.platform); return render(); }
      if (act === "next") return tourStep(1);
      if (act === "prev") return tourStep(P.tours[S.tour].steps[S.step][0] === `${S.id}:${S.st}` ? -1 : 0);
      if (act === "resume") return tourStep(P.tours[S.tour].steps[S.step][0] === `${S.id}:${S.st}` ? 1 : 0);
      if (act === "endtour") return endTour();
      if (act === "menu-roles") return openMenu(a, menuRoles());
      if (act === "menu-tours") return openMenu(a, menuTours());
      if (act === "menu-states") return openMenu(a, menuStates());
      if (act === "theme") { const r = document.documentElement; const dark = r.getAttribute("data-theme") === "dark" || (!r.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches); r.setAttribute("data-theme", dark ? "light" : "dark"); store.set("theme", dark ? "light" : "dark"); return; }
      if (act === "text") { const big = document.documentElement.style.getPropertyValue("--wb-scale") === "1.24"; document.documentElement.style.setProperty("--wb-scale", big ? "1" : "1.24"); a.setAttribute("aria-pressed", String(!big)); return; }
      if (act === "handoff") { const id = a.dataset.target; return go(id, K.screens[id].states[0][0], { as: roleOfScreen(id) }); }
      if (act === "toast") { toastEl.classList.remove("on"); return toastEl._act && toastEl._act(); }
    }
    if (!ev.target.closest(".pt-menu")) closeMenus();
    const frame = ev.target.closest(".pv-frame");
    if (!frame) return;
    const f = ev.target.closest("[data-focus]");
    if (f) { const t = frame.querySelector("#" + CSS.escape(f.dataset.focus)); if (t) { t.scrollIntoView({ block: "center" }); t.focus({ preventScroll: true }); } return; }
    const t = ev.target.closest("[data-go],[data-note],a,button");
    if (!t) return;
    if (t.matches("a")) ev.preventDefault();
    if (t.matches("input,select,textarea,label")) return;
    if (t.getAttribute("aria-disabled") === "true") return toast(t.dataset.note || "Not available right now. The reason is shown beside it.");
    if (t.dataset.go) {
      const [id, st] = t.dataset.go.split(":");
      if (K.screens[id]) return go(id, st || K.screens[id].states[0][0]);
    }
    const label = (t.textContent || t.getAttribute("aria-label") || "").trim();
    if (CLOSERS.test(label) && history.length > 1 && S.role) return history.back();
    if (t.dataset.note) return toast(t.dataset.note);
    if (t.matches("button,a")) toast("This control isn’t wired in the prototype.");
  });
  document.addEventListener("submit", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenus();
    if (!S.tour || e.target.closest("input,textarea,select,[contenteditable]")) return;
    if (e.altKey && e.key === "ArrowRight") tourStep(1);
    if (e.altKey && e.key === "ArrowLeft") tourStep(-1);
  });

  // ---------- Start ----------
  const th = store.get("theme"); if (th) document.documentElement.setAttribute("data-theme", th);
  fromHash();
})();
