/* Batch 01 design kit: icons, helpers, platform shells and fictional sample data.
   Renderers return HTML strings and never mutate state. Nothing here is production code. */
(function () {
  "use strict";
  const K = (window.K = { screens: {}, order: [] });

  // ---------- Icons (line symbols, SF Symbols-like weight) ----------
  const P = {
    today: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M2.5 12h2M19.5 12h2M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    book: '<path d="M5 4.5h11a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 21h4"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17.2v.1"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6"/>',
    "chev-r": '<path d="M9 5l7 7-7 7"/>',
    "chev-l": '<path d="M15 5l-7 7 7 7"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    "check-circle": '<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.8 2.8 5.5-5.6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    camera: '<path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H8l1.5-2h5L16 6h1.5A2.5 2.5 0 0 1 20 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.5"/>',
    doc: '<path d="M7.5 3H14l5 5v11.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19.5v-15A1.5 1.5 0 0 1 7.5 3z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    photo: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M4 17l5-4.5 3.5 3 3-2.5L20 17"/>',
    folder: '<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
    offline: '<path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0M12 19h.01M3 3l18 18"/>',
    alert: '<path d="M12 3.5l9.5 16.5h-19z"/><path d="M12 10v4.5M12 17.3v.1"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.1"/>',
    retry: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4.5V11h-6.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
    rotate: '<path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4.5V10h5.5"/>',
    grip: '<path d="M5 9h14M5 15h14"/>',
    up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    users: '<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7.5M18 14.8c1.8.8 3 2.6 3.5 5.2"/>',
    support: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M5.6 5.6l3.9 3.9M14.5 14.5l3.9 3.9M18.4 5.6l-3.9 3.9M9.5 14.5l-3.9 3.9"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    hourglass: '<path d="M7 3h10M7 21h10M8 3v2.5a4 4 0 0 0 1.6 3.2L12 10.5l2.4-1.8A4 4 0 0 0 16 5.5V3M8 21v-2.5a4 4 0 0 1 1.6-3.2L12 13.5l2.4 1.8a4 4 0 0 1 1.6 3.2V21"/>',
    "eye-off": '<path d="M3 3l18 18M10.6 6.1A9.6 9.6 0 0 1 12 6c5 0 8.5 4.5 9.5 6a17 17 0 0 1-2.9 3.4M6.6 7.6C4.4 9 3 11 2.5 12c1 1.5 4.5 6 9.5 6 1.4 0 2.7-.3 3.8-.9"/><path d="M9.9 10a3 3 0 0 0 4.1 4.1"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 16V5M7 9.5l5-5 5 5M5 20h14"/>',
    chat: '<path d="M4 5.5h16v10H10l-4 3.5v-3.5H4z"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    eye: '<path d="M2.5 12C3.5 10.5 7 6 12 6s8.5 4.5 9.5 6c-1 1.5-4.5 6-9.5 6s-8.5-4.5-9.5-6z"/><circle cx="12" cy="12" r="3"/>',
    flash: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
    ticket: '<path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5V10a2 2 0 0 0 0 4v2.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5V14a2 2 0 0 0 0-4z"/><path d="M14.5 6.5v2M14.5 11v2M14.5 15.5v2"/>',
    org: '<path d="M6 21V4.5M6 5h11l-2 4 2 4H6"/><path d="M3.5 21h7"/>',
  };
  K.sprite =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    Object.entries(P).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join("") +
    "</defs></svg>";
  K.icons = Object.keys(P);
  const ic = (K.ic = (name, cls = "") => `<svg class="icon ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`);

  const esc = (K.esc = (x) => String(x ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]));

  // ---------- Shared status vocabulary ----------
  // One wording per record status across every screen and platform.
  const STATUS = (K.STATUS = {
    notStarted: ["neutral", "doc", "Not started"],
    draft: ["warning", "doc", "Draft · not submitted"],
    queued: ["warning", "hourglass", "Queued · not received"],
    received: ["success", "check-circle", "Received"],
    notReceived: ["error", "alert", "Not received"],
    held: ["neutral", "eye-off", "Feedback not released"],
    released: ["success", "check", "Feedback released"],
    updated: ["info", "retry", "Feedback updated"],
    excused: ["neutral", "info", "Excused"],
    available: ["info", "clock", "Available"],
    locked: ["neutral", "lock", "Locked"],
    complete: ["success", "check", "Complete"],
    closed: ["neutral", "lock", "Closed"],
    extension: ["accent", "clock", "Extension applied"],
    lastKnown: ["warning", "clock", "Last known"],
    readOnly: ["neutral", "lock", "Read-only"],
    notOpen: ["neutral", "eye-off", "Not open yet"],
    preview: ["warning", "eye", "Instructor preview"],
  });
  const badge = (K.badge = (key, text) => {
    const [kind, icon, label] = STATUS[key] || ["neutral", "info", key];
    return `<span class="badge ${kind}">${ic(icon)}${esc(text || label)}</span>`;
  });

  // ---------- Actions ----------
  // go: "S05:open" navigates the review page to that screen/state. note: preview-only explanation.
  const attrs = (o) => (o.go ? ` data-go="${o.go}"` : "") + (o.note ? ` data-note="${esc(o.note)}"` : "") + (o.label ? ` aria-label="${esc(o.label)}"` : "") + (o.disabled ? ` aria-disabled="true"` : "") + (o.describedby ? ` aria-describedby="${o.describedby}"` : "");
  K.btn = (text, o = {}) => `<button type="button" class="${o.cls || "btn"}"${attrs(o)}>${o.icon ? ic(o.icon) : ""}${text}</button>`;
  // In-page anchor for screens on this page; the other batch page for screens designed elsewhere.
  K.href = (go) => { const id = go.split(":")[0], xb = window.MAP && window.MAP.xb; return xb && xb[id] ? `${xb[id].file}#${go}` : "#" + id; };
  K.link = (text, o = {}) => `<a href="${o.go ? K.href(o.go) : "#"}" class="${o.cls || ""}"${attrs(o)}${o.current ? ' aria-current="page"' : ""}>${o.icon ? ic(o.icon) : ""}${text}</a>`;
  K.notice = (kind, icon, title, body, actions = "") => `<div class="notice ${kind}" role="${kind === "error" ? "alert" : "status"}">${ic(icon)}<div><strong>${title}</strong>${body ? `<span>${body}</span>` : ""}${actions ? `<div class="actions">${actions}</div>` : ""}</div></div>`;
  K.qchips = (covered, missing = []) => `<ul class="qchips" aria-label="Question coverage">${K.D.questions.map((q) => (missing.includes(q.id) ? `<li class="qchip missing">${ic("alert")}${q.id}<span class="sr"> has no page</span></li>` : covered ? `<li class="qchip">${ic("check")}${q.id}<span class="sr"> covered</span></li>` : `<li class="qchip missing">${q.id}</li>`)).join("")}</ul>`;

  // Illustrative handwritten page — decorative; every use sits beside a text label/alternative.
  K.page = (n, q, o = {}) => {
    const lines = [];
    const seed = n * 7 + (q.length || 1);
    for (let i = 0; i < 11; i++) {
      const w = 120 + ((seed * (i + 3) * 37) % 130);
      const y = 70 + i * 26;
      lines.push(`<path d="M28 ${y} q ${w / 4} -6 ${w / 2} 0 t ${w / 2} 0" />`);
    }
    const rot = o.rot ? ` style="transform:rotate(${o.rot}deg)"` : "";
    return `<div class="page-thumb${o.warn ? " warn" : ""}"${rot} aria-hidden="true"><svg viewBox="0 0 255 330"><g stroke="#e3e9ef" stroke-width="1">${Array.from({ length: 12 }, (_, i) => `<path d="M14 ${58 + i * 26}H241"/>`).join("")}</g><text x="28" y="40" font-family="ui-rounded, cursive" font-size="17" fill="#2b3f6b">Q${esc(q)}</text><g fill="none" stroke="#2b3f6b" stroke-width="2.2" stroke-linecap="round"${o.blur ? ' opacity=".45" filter="blur(1.2)"' : ""}>${lines.join("")}</g>${o.mark ? `<circle cx="${o.mark[0]}" cy="${o.mark[1]}" r="15" fill="none" stroke="#c0392b" stroke-width="2.5"/><text x="${o.mark[0] + 18}" y="${o.mark[1] - 10}" font-size="15" font-weight="700" fill="#c0392b">1</text>` : ""}</svg>${o.noLabel ? "" : `<span class="pno">${n}</span>`}</div>`;
  };

  // ---------- Fictional sample data (aligned with showcase core.js) ----------
  K.D = {
    student: "Aisha Rahman", initials: "AR",
    today: "Thursday, October 15", term: "Fall 2026",
    course: { code: "PHYS 110", title: "Introductory Mechanics", instructor: "Dr. Diane Reyes", ta: "Maya Chen", meets: "Mon / Wed / Fri · 9:00–9:50 am", room: "Hollis Hall 104", office: "Tue 2:00–3:00 pm · Hollis Hall 116" },
    courses: [
      { code: "PHYS 110", title: "Introductory Mechanics", who: "Dr. Diane Reyes", meets: "Mon / Wed / Fri · 9:00 am", room: "Hollis Hall 104", next: "Problem Set 4 · due Fri, Oct 16", dot: "c-phys" },
      { code: "MATH 220", title: "Linear Algebra", who: "Prof. Lena Foster", meets: "Tue / Thu · 10:30 am", room: "Keene Center 212", next: "Read §4.5 Basis and dimension before Tuesday", dot: "c-math" },
      { code: "WRIT 140", title: "Academic Writing", who: "Prof. Jonah Brooks", meets: "Mon / Wed · 1:00 pm", room: "Emery Hall 203", next: "Revise the opening paragraph of your argument essay", dot: "c-writ" },
    ],
    a: { title: "Problem Set 4: Kinematics", points: 30, due: "Fri, Oct 16 · 11:59 pm ET", close: "Sun, Oct 18 · 11:59 pm ET", dueX: "Sat, Oct 17 · 11:59 pm ET", closeX: "Mon, Oct 19 · 11:59 pm ET", policy: "Limited: use AI to clarify concepts; show your own working and disclose assistance." },
    questions: [
      { id: "1a", max: 6, text: "A ball rolls off a 1.25 m bench at 2.0 m/s. How long does it take to reach the floor?" },
      { id: "1b", max: 4, text: "How far from the bench does the ball land?" },
      { id: "2", max: 6, text: "A projectile leaves the ground at 15 m/s, 40° above horizontal. Find its horizontal and vertical velocity components." },
      { id: "3", max: 8, text: "For the launch in question 2, find the maximum height and the time taken to reach it." },
      { id: "4", max: 6, text: "Explain why horizontal velocity stays constant while vertical velocity changes during the flight." },
    ],
    pages: [["1", "1a, 1b"], ["2", "2"], ["3", "3"], ["4", "4"]],
    receipt: { ref: "AH-PHYS110-001", at: "Thu, Oct 15, 2026 · 6:30 am ET", ref2: "AH-PHYS110-002", at2: "Fri, Oct 16, 2026 · 8:14 pm ET" },
    marks: { "1a": 6, "1b": 4, "2": 5, "3": 7, "4": 5 },
    comments: {
      "1a": "Correct, with clear units.",
      "1b": "Correct. Good reuse of the time from 1a.",
      "2": "Components are right. Round to two significant figures, as the data allow.",
      "3": "Your setup is clear. Check the sign of the vertical acceleration in the final substitution — page 3, line 4.",
      "4": "Good explanation. Name the absence of horizontal force explicitly.",
    },
    overall: "Your setup is clear. Check the sign of the vertical acceleration in the final substitution.",
    rubric3: [["Sets up vertical motion with the same time variable", 3, 3], ["Substitutes with the correct sign for g", 2, 3], ["Final answer with units", 2, 2]],
    release: "Released by Dr. Diane Reyes · Tue, Oct 20 · 4:10 pm ET",
    rerelease: "Updated by Dr. Diane Reyes · Thu, Oct 22 · 11:05 am ET",
  };

  // ---------- Web shell ----------
  // Shared tools (P44 account, P45 search, P46 help) are proposed destinations: preview notes say so.
  const NAV = [
    ["today", "Today", "today", "S01:usual"],
    ["courses", "Courses", "book", "S02:current"],
    ["calendar", "Calendar", "calendar", "S12:current"],
    ["updates", "Updates", "bell", "S13:unread"],
  ];
  const CAMPUS = [
    ["events", "Events", "ticket", "S28:published"],
    ["orgs", "Organizations", "org", "S29:member"],
    ["support", "Support", "support", "S34:browsing"],
  ];
  // who: the signed-in student (default Aisha). groups: extra role-scoped nav (e.g. an officer's organization tools, Batch 05).
  K.web = ({ nav = "courses", crumbs = [], banner = "", body = "", overlay = "", url = "", who = { name: K.D.student, initials: K.D.initials }, groups = "" }) => {
    const navHtml = NAV.map(([k, t, i, go, note]) => K.link(t, { icon: i, go, note, current: k === nav })).join("");
    const campus = CAMPUS.map(([k, t, i, go, note]) => K.link(t, { icon: i, go, note, current: k === nav })).join("");
    const crumbHtml = crumbs.map(([t, go], i) => (i === crumbs.length - 1 ? `<span aria-current="page">${t}</span>` : `<span class="${i > 0 ? "crumb-mid" : ""}">${K.link(t, { go })}</span>${ic("chev-r", i > 0 ? "crumb-mid" : "")}`)).join("");
    return `<div class="wb w-app" data-url="${esc(url)}">
<nav class="w-side" aria-label="Whiteboard">
  <div class="w-brand"><span class="w-mark" aria-hidden="true">w</span>Whiteboard</div>
  <div class="w-nav">${navHtml}</div>
  <div class="w-navlabel eyebrow">Campus</div>
  <div class="w-nav">${campus}</div>${groups}
  <div class="w-nav w-foot">${K.link("Help", { icon: "help", go: "P46:selfservice" })}</div>
</nav>
<div class="w-main">
  <header class="w-top">
    <button type="button" class="w-iconbtn w-menu" aria-label="Open navigation menu" data-note="Narrow web: opens the same navigation as a disclosure panel">${ic("menu")}</button>
    <nav class="w-crumbs" aria-label="Breadcrumb">${crumbHtml}</nav>
    <button type="button" class="w-search" data-go="P45:noquery">${ic("search")}<span>Search courses, work, campus</span></button>
    <button type="button" class="w-iconbtn w-hide-narrow" aria-label="Technical help" data-go="P46:selfservice">${ic("help")}</button>
    <button type="button" class="w-avatar" aria-label="Account: ${who.name}" data-go="P44:editable" data-note="P44 Account and profile (proposed destination, Batch 02)">${who.initials}</button>
  </header>
  ${banner}
  <main class="w-content">${body}</main>
</div>${overlay}</div>`;
  };
  K.webHead = (title, meta = "", right = "") => `<div class="w-head"><div><h1>${title}</h1>${meta ? `<p class="meta">${meta}</p>` : ""}</div>${right}</div>`;
  K.card = (title, inner, o = {}) => `<section class="w-card${o.flush ? " flush" : ""}${o.cls ? " " + o.cls : ""}"${o.label ? ` aria-label="${esc(o.label)}"` : ""}>${title ? `<h2>${title}</h2>` : ""}${inner}</section>`;
  K.courseTabs = (cur, released) => `<nav class="w-tabs" aria-label="PHYS 110 sections">${[["overview", "Overview", "S03:published"], ["modules", "Modules", "S04:available"], ["work", "Assignments", "S05:open"], ["quizzes", "Quizzes", "S10:available"], ["discussion", "Discussion", "S11:open"], ["feedback", "Feedback", released ? "S09:released" : "S09:held"]].map(([k, t, go, note]) => K.link(t, { go, note, current: k === cur })).join("")}</nav>`;

  // ---------- iOS shell (PLANNED — not a native build) ----------
  const TABS = [["today", "Today", "today", "S01:usual"], ["courses", "Courses", "book", "S02:current"], ["calendar", "Calendar", "calendar", "S12:current"], ["updates", "Updates", "bell", "S13:unread"], ["campus", "Campus", "ticket", "S28:published"]];
  K.ios = ({ tab = "courses", back, title = "", trail = "", large = "", sub = "", body = "", bottom = "", sheet = "", alert = "", raw = "", dark = false, tabs = true }) => {
    const status = `<div class="i-status" aria-hidden="true"${dark ? ' style="color:#fff;background:#0b0d0e"' : ""}><span>9:41</span><span class="sys"><svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg width="26" height="12" viewBox="0 0 26 12"><rect x=".5" y=".5" width="22" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor"/><rect x="24" y="4" width="1.6" height="4" rx=".8" fill="currentColor" opacity=".4"/></svg></span></div>`;
    if (raw) return `<div class="wb i-app">${status}${raw}${sheet}${alert}</div>`;
    const nav = `<header class="i-nav">${back ? `<button type="button" class="back" data-go="${back[1]}">${ic("chev-l")}${back[0]}</button>` : "<span></span>"}<div class="ttl">${large ? "" : title}</div><div class="trail">${trail}</div></header>`;
    const tabbar = tabs ? `<nav class="i-tabs" aria-label="Tabs">${(Array.isArray(tabs) ? tabs : TABS).map(([k, t, i, go, note]) => K.link(`${ic(i)}<span>${t}</span>`, { go, note, current: k === tab })).join("")}</nav>` : "";
    return `<div class="wb i-app">${status}${nav}<main class="i-scroll">${large ? `<h1 class="i-large">${large}</h1>` : ""}${sub ? `<p class="i-sub">${sub}</p>` : ""}${body}</main>${bottom ? `<div class="i-bottom">${bottom}</div>` : ""}${tabbar}<div class="i-home" aria-hidden="true"></div>${sheet}${alert}</div>`;
  };
  K.iAvatar = `<button type="button" class="i-iconbtn" aria-label="Account: ${K.D.student}" data-go="P44:editable" data-note="Account → P44 (proposed, Batch 02); returns to this tab">${'<span class="i-avatar">' + K.D.initials + "</span>"}</button>`;
  K.group = (rows, o = {}) => `${o.h ? `<h2 class="i-h${o.big ? " big" : ""}">${o.h}</h2>` : ""}<ul class="i-group"${o.label ? ` aria-label="${esc(o.label)}"` : ""}>${rows.map((r) => `<li>${r}</li>`).join("")}</ul>${o.foot ? `<p class="i-foot">${o.foot}</p>` : ""}`;
  K.row = (t, s = "", o = {}) => {
    const inner = `${o.lead || ""}<div class="grow"><div class="t${o.bold ? " b" : ""}">${t}</div>${s ? `<div class="s">${s}</div>` : ""}</div>${o.trail || ""}${o.go || o.note ? ic("chev-r", "chev") : ""}`;
    return o.go || o.note ? `<a href="${o.go ? K.href(o.go) : "#"}"${o.go ? ` data-go="${o.go}"` : ""}${o.note ? ` data-note="${esc(o.note)}"` : ""}>${inner}</a>` : inner;
  };
  K.sheet = (title, meta, rows, cancel = "Cancel") => `<div class="i-sheet-wrap" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="i-sheet"><div class="i-grabber" aria-hidden="true"></div><h2>${title}</h2>${meta ? `<p class="meta">${meta}</p>` : ""}${rows}<div style="height:12px"></div><button type="button" class="i-btn secondary" data-note="Dismisses the sheet; nothing changes">${cancel}</button></div></div>`;

  K.reg = (id, def) => { K.screens[id] = def; K.order.push(id); };
})();
