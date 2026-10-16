/* Batch 02 kit extension: access and staff shells, form/validation helpers, extra icons and
   fictional staff data. Loaded after batch01/kit.js. Renderers return HTML strings only. */
(function () {
  "use strict";
  const K = window.K;
  const { ic, esc } = K;

  // ---------- Extra icons ----------
  const P = {
    building: '<path d="M4 20.5h16M5.5 20.5V9l6.5-4.5L18.5 9v11.5"/><path d="M9 20.5v-5h6v5M9 11.5h.01M12 11.5h.01M15 11.5h.01"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z"/><path d="M8.8 12.2l2.2 2.2 4.3-4.4"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4 7l8 6 8-6"/>',
    pencil: '<path d="M4 20l1-4.5L16 4.5l3.5 3.5L8.5 19z"/><path d="M14 7l3 3"/>',
    sliders: '<path d="M5 6h9M18 6h1M5 12h3M12 12h7M5 18h11M20 18h-1"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    heading: '<path d="M6 5v14M18 5v14M6 12h12"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="9.5" r="1.6"/><path d="M4 17.5l5.5-5 4 3.5 2.5-2 4 3.5"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10.5l5-3v9l-5-3"/>',
    sigma: '<path d="M17.5 5.5h-11l6 6.5-6 6.5h11"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    table: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M3.5 14.5h17M9 4.5v15"/>',
    publish: '<path d="M12 15V4M7.5 8.5L12 4l4.5 4.5"/><path d="M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13"/>',
    copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"/>',
    external: '<path d="M14 4.5h5.5V10M19.5 4.5L11 13M17 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 4 18.5v-10A1.5 1.5 0 0 1 5.5 7H10"/>',
    laptop: '<rect x="5" y="5" width="14" height="10" rx="1.5"/><path d="M2.5 18.5h19"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    logout: '<path d="M14 4.5H6.5A1.5 1.5 0 0 0 5 6v12a1.5 1.5 0 0 0 1.5 1.5H14M10 12h10.5M17 8.5l3.5 3.5-3.5 3.5"/>',
    history: '<path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4.5V10h5.5M12 8v4.5l3 2"/>',
    checklist: '<path d="M4 6.5l1.5 1.5L8 5.5M4 12.5l1.5 1.5L8 11.5M4 18.5l1.5 1.5L8 17.5M11 7h9M11 13h9M11 19h9"/>',
    text: '<path d="M5 6h14M5 11h14M5 16h9"/>',
    more: '<circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/>',
    gauge: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l4-5"/>',
  };
  K.sprite = K.sprite.replace("</defs>", Object.entries(P).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join("") + "</defs>");
  K.icons.push(...Object.keys(P));

  // ---------- Status vocabulary additions (authoring, access, files) ----------
  Object.assign(K.STATUS, {
    staffDraft: ["warning", "pencil", "Draft · staff only"],
    attention: ["warning", "alert", "Needs attention"],
    ready: ["info", "checklist", "Ready to publish"],
    published: ["success", "check-circle", "Published"],
    changed: ["info", "history", "Changed after publish"],
    autosaved: ["neutral", "check", "Saved"],
    inUse: ["info", "link", "In use"],
    uploading: ["info", "upload", "Uploading"],
    processing: ["neutral", "hourglass", "Processing"],
    a11yReview: ["warning", "eye", "Needs accessible alternative"],
    failed: ["error", "alert", "Upload failed"],
    managed: ["neutral", "building", "Managed by Alder Hill College"],
    pendingReview: ["warning", "hourglass", "Pending review"],
    current: ["success", "check", "This device"],
    revoked: ["neutral", "x", "Signed out"],
    expired: ["error", "clock", "Expired"],
    used: ["neutral", "check", "Already accepted"],
  });

  // ---------- Fictional staff/access data ----------
  K.D2 = {
    inst: { name: "Alder Hill College", short: "Alder Hill", idp: "Alder Hill sign-in", host: "login.alderhill.example", help: "Alder Hill IT Service Desk · it.alderhill.example" },
    wrongInst: { name: "Alder Valley Community College", host: "sso.aldervalley.example" },
    staff: { name: "Dr. Diane Reyes", initials: "DR", email: "dreyes@alderhill.example", role: "Instructor" },
    invitee: { name: "Maya Chen", email: "mchen@alderhill.example", role: "Teaching assistant", other: "maya.chen.personal@mail.example" },
    enrolled: 44,
    mods: [
      { id: "m1", title: "Foundations and vectors", state: "published", items: [["page", "Vectors and components"], ["assignment", "Problem Set 1: Vectors"], ["quiz", "Quiz 1: Vectors"]] },
      { id: "m2", title: "Motion in one dimension", state: "published", items: [["page", "Displacement, velocity, acceleration"], ["assignment", "Problem Set 2: 1-D motion"], ["quiz", "Quiz 2: Free fall"]] },
      { id: "m3", title: "Projectile motion", state: "published", note: "Opened Mon, Oct 12 · 8:00 am", items: [["page", "Projectile motion"], ["video", "Launch lab demonstration"], ["assignment", "Problem Set 4: Kinematics"], ["quiz", "Quiz 3: Projectile motion"]] },
      { id: "m4", title: "Forces and free-body diagrams", state: "staffDraft", note: "Opens Mon, Oct 19 · 8:00 am after Module 3", items: [["page", "Drawing free-body diagrams"], ["assignment", "Problem Set 5: Forces"], ["file", "Force-diagram worksheet (PDF)"]] },
    ],
    quiz: {
      title: "Quiz 3: Projectile motion", window: "Opens Mon, Oct 12 · Closes Mon, Oct 19 · 11:59 pm ET", minutes: 20, attempts: 2, release: "After the close date",
      items: [
        { id: "Q1", type: "Multiple choice", pts: 2, prompt: "At the highest point of a projectile’s flight, what is its vertical acceleration?", options: ["Zero", "9.8 m/s² downward", "9.8 m/s² upward"], answer: 1 },
        { id: "Q2", type: "Numeric", pts: 3, prompt: "A ball is launched horizontally at 4.0 m/s from 1.8 m. How long until it lands (s)?", answer: "0.61", tol: "± 0.02" },
        { id: "Q3", type: "Multiple choice", pts: 2, prompt: "Which quantity stays constant during ideal projectile motion?", options: ["Vertical velocity", "Horizontal velocity", "Speed"], answer: 1 },
        { id: "Q4", type: "Written response", pts: 3, prompt: "Explain why two balls — one dropped, one launched horizontally — land at the same time.", ref: "Both share the same vertical motion; horizontal velocity does not affect fall time." },
      ],
    },
    rubric: {
      title: "Kinematics problem-solving", id: "rub-kin-2", version: 2,
      levels: ["Complete", "Partial", "Missing"],
      criteria: [
        { id: "C1", name: "Sets up vertical motion with the same time variable", pts: [3, 2, 0] },
        { id: "C2", name: "Substitutes with the correct sign for g", pts: [3, 2, 0] },
        { id: "C3", name: "Final answer with units", pts: [2, 1, 0] },
      ],
      uses: [["Problem Set 4: Kinematics", "Question 3 · 8 points", "Graded with v2 · 39 of 44"], ["Problem Set 3: Kinematics in 1-D", "Question 2 · 8 points", "Released · uses v1 snapshot"]],
    },
    files: [
      { name: "Projectile motion lab sheet.pdf", type: "PDF", size: "1.2 MB", ver: 3, used: 2, alt: true, upd: "Oct 9" },
      { name: "Launch lab demonstration.mp4", type: "Video", size: "84 MB", ver: 1, used: 1, alt: true, upd: "Oct 8", note: "Captions + transcript" },
      { name: "Projectile path diagram.png", type: "Image", size: "220 KB", ver: 2, used: 2, alt: true, upd: "Oct 8" },
      { name: "Force-diagram worksheet.pdf", type: "PDF", size: "2.4 MB", ver: 1, used: 1, alt: false, upd: "Oct 14" },
      { name: "PS4 formula sheet.pdf", type: "PDF", size: "310 KB", ver: 1, used: 1, alt: true, upd: "Oct 5" },
    ],
  };
  const D2 = K.D2;

  // ---------- Staff web shell (instructor workspace) ----------
  const SNAV = [
    ["teaching", "Teaching", "book", "S14:draft"],
    ["grading", "Grading", "checklist", "S17:received"],
    ["calendar", "Calendar", "calendar", "S12:current"],
    ["updates", "Updates", "bell", null, "Staff updates feed — not yet mapped (S13 is the student feed)"],
  ];
  const CTOOLS = [
    ["builder", "Course builder", "list", "S14:draft"],
    ["files", "Files", "folder", "P48:ready"],
    ["rubrics", "Rubrics", "table", "P49:ready"],
    ["people", "People", "users", "S21:active"],
    ["term", "Next term", "copy", "S22:incomplete"],
    ["insights", "Insights", "gauge", "S23:followup"],
  ];
  K.webStaff = ({ nav = "teaching", tool = "builder", crumbs = [], banner = "", body = "", overlay = "", url = "", who = D2.staff }) => {
    const n = SNAV.map(([k, t, i, go, note]) => K.link(t, { icon: i, go, note, current: k === nav && !tool })).join("");
    const c = CTOOLS.map(([k, t, i, go, note]) => K.link(t, { icon: i, go, note, current: k === tool })).join("");
    const crumbHtml = crumbs.map(([t, go], i) => (i === crumbs.length - 1 ? `<span aria-current="page">${t}</span>` : `<span class="${i > 0 ? "crumb-mid" : ""}">${K.link(t, { go })}</span>${ic("chev-r", i > 0 ? "crumb-mid" : "")}`)).join("");
    return `<div class="wb w-app staff" data-url="${esc(url)}">
<nav class="w-side" aria-label="Whiteboard teaching">
  <div class="w-brand"><span class="w-mark" aria-hidden="true">w</span>Whiteboard</div>
  <div class="w-nav">${n}</div>
  <div class="w-navlabel eyebrow">PHYS 110 · Fall 2026</div>
  <div class="w-nav">${c}</div>
  <div class="w-nav w-foot">${K.link("Help", { icon: "help", go: "P46:selfservice" })}</div>
</nav>
<div class="w-main">
  <header class="w-top">
    <button type="button" class="w-iconbtn w-menu" aria-label="Open navigation menu" data-note="Narrow web: opens the same navigation as a disclosure panel">${ic("menu")}</button>
    <nav class="w-crumbs" aria-label="Breadcrumb">${crumbHtml}</nav>
    <button type="button" class="w-search" data-go="P45:noquery" data-note="P45 Global search; staff results stay within assigned courses">${ic("search")}<span>Search your courses</span></button>
    <button type="button" class="w-iconbtn w-hide-narrow" aria-label="Technical help" data-go="P46:selfservice">${ic("help")}</button>
    ${K.link(who.initials, { cls: "w-avatar", label: "Account: " + who.name, go: "P44:editable" })}
  </header>
  ${banner}
  <main class="w-content">${body}</main>
</div>${overlay}</div>`;
  };

  // Focused access shell: no product navigation before identity is known.
  K.webAccess = ({ body = "", url = "", aside = "", overlay = "" }) => `<div class="wb w-app w-access" data-url="${esc(url)}">
<header class="w-access-top"><span class="w-brand"><span class="w-mark" aria-hidden="true">w</span>Whiteboard</span>${K.link("Sign-in help", { cls: "btn plain", icon: "help", go: "P41:error", note: "P46 Technical help routes institution sign-in problems back to the institution (proposed)" })}</header>
<main class="w-access-main"><div class="w-access-col">${body}</div>${aside ? `<aside class="w-access-aside" aria-label="About this step">${aside}</aside>` : ""}</main>
<footer class="w-access-foot meta">Fictional concept · Accessibility · Privacy · No real sign-in occurs</footer>${overlay}</div>`;

  // Student-preview bar (shared by S14/S15/P47): visibly not the learner's own session.
  K.previewBar = (back, what = "student") => `<div class="w-previewbar" role="status">${ic("eye")}<span><b>Viewing as a ${what}</b> · Instructor preview. Publication, dates and prerequisites still apply; nothing you do here is recorded.</span>${K.btn("Return to builder", { cls: "btn", go: back })}</div>`;

  // ---------- Forms ----------
  // f = { id, label, value, type: text|textarea|select|date|number, options, hint, err, readonly, managed, w }
  K.field = (f) => {
    const hid = f.hint ? `${f.id}-h` : "", eid = f.err ? `${f.id}-e` : "";
    const desc = [eid, hid].filter(Boolean).join(" ");
    const common = ` id="${f.id}"${desc ? ` aria-describedby="${desc}"` : ""}${f.err ? ' aria-invalid="true"' : ""}${f.readonly ? " readonly" : ""}${f.req ? ' aria-required="true"' : ""}`;
    let ctl;
    if (f.type === "textarea") ctl = `<textarea${common} rows="${f.rows || 3}">${esc(f.value)}</textarea>`;
    else if (f.type === "select") ctl = `<select${common}>${f.options.map((o) => `<option${o === f.value ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
    else ctl = `<input${common} type="${f.type || "text"}" value="${esc(f.value)}"${f.inputmode ? ` inputmode="${f.inputmode}"` : ""}>`;
    return `<div class="w-field${f.err ? " invalid" : ""}${f.managed ? " managed" : ""}"${f.w ? ` style="grid-column:span ${f.w}"` : ""}><label for="${f.id}">${f.label}${f.req ? ' <span class="meta">(required)</span>' : ""}</label>${ctl}${f.err ? `<span class="err" id="${eid}">${ic("alert")}${f.err}</span>` : ""}${f.hint ? `<span class="hint" id="${hid}">${f.hint}</span>` : ""}</div>`;
  };
  K.toggle = (id, label, on, o = {}) => `<div class="w-switchrow"><span id="${id}-l">${label}${o.sub ? `<span class="meta">${o.sub}</span>` : ""}</span><button type="button" class="switch" role="switch" aria-checked="${on}" aria-labelledby="${id}-l"${o.note ? ` data-note="${esc(o.note)}"` : ""}${o.disabled ? ' aria-disabled="true"' : ""}><span></span></button></div>`;
  K.progress = (pct, label) => `<div class="w-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="${esc(label)}"><span style="width:${pct}%"></span></div>`;
  // Readiness/validation list: [kind ok|warn|err|todo, text, go?, note?]
  K.checks = (items, label = "Checks") => `<ul class="w-checks" aria-label="${esc(label)}">${items.map(([k, t, go, note]) => {
    const icon = { ok: "check-circle", warn: "alert", err: "alert", todo: "clock" }[k];
    const word = { ok: "Passed", warn: "Warning", err: "Blocks publishing", todo: "To do" }[k];
    const body = go || note ? K.link(t, { go, note }) : t;
    return `<li class="${k}">${ic(icon)}<span><span class="sr">${word}: </span>${body}</span></li>`;
  }).join("")}</ul>`;
  K.table = (caption, head, rows, o = {}) => `<div class="w-tablewrap"><table class="w-table${o.cls ? " " + o.cls : ""}"><caption class="${o.showCaption ? "" : "sr"}">${caption}</caption><thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr${r.sel ? ' class="sel" aria-current="true"' : ""}>${(r.cells || r).map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join("")}</tr>`).join("")}</tbody></table></div>`;
  K.typeIcon = (t) => ({ page: "doc", assignment: "pencil", quiz: "list", video: "video", file: "folder", PDF: "doc", Video: "video", Image: "image" })[t] || "doc";

  // ---------- iOS helpers ----------
  K.STAFFTABS = [["teaching", "Teaching", "book", "S14:draft"], ["grading", "Grading", "checklist", "S17:received"], ["calendar", "Calendar", "calendar", "S12:current"], ["updates", "Updates", "bell", null, "Staff updates feed — not yet mapped (S13 is the student feed)"]];
  K.iStaffAvatar = K.link(`<span class="i-avatar">${D2.staff.initials}</span>`, { cls: "i-iconbtn", label: "Account: " + D2.staff.name, go: "P44:editable" });
  K.ival = (t, v, o = {}) => K.row(t, o.s || "", { trail: `<span class="i-val${o.err ? " err" : ""}">${v}</span>`, go: o.go, note: o.note, lead: o.lead });
  K.iswitch = (id, label, on, o = {}) => `<div class="grow"><div class="t" id="${id}-l">${label}</div>${o.sub ? `<div class="s">${o.sub}</div>` : ""}</div><button type="button" class="switch" role="switch" aria-checked="${on}" aria-labelledby="${id}-l"${o.note ? ` data-note="${esc(o.note)}"` : ""}><span></span></button>`;
  K.ifield = (id, label, value, o = {}) => `<div class="i-field${o.err ? " invalid" : ""}"><label for="${id}">${label}</label><input id="${id}" type="${o.type || "text"}" value="${esc(value)}"${o.err ? ` aria-invalid="true" aria-describedby="${id}-e"` : ""}${o.readonly ? " readonly" : ""}>${o.err ? `<span class="err" id="${id}-e">${ic("alert")}${o.err}</span>` : ""}</div>`;
  K.desktopNote = (what, url) => `<div class="i-desk">${ic("laptop")}<div><b>Best on a computer</b><span>${what}</span><span class="meta">${esc(url)}</span></div>${K.btn("Copy link", { cls: "btn", icon: "copy", note: "Copies the web address so you can open it on a computer. No native parity is claimed." })}</div>`;
})();
