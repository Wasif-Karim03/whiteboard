/* Batch 06 kit extension: statuses, fictional data and shells for student support (S34 get support,
   S35 referral, S36 follow-through), institution operations (S37 people & records, S38 connections,
   S39 migration rehearsal, S40 trust & AI controls, P50 initial setup) and the shared tools P45 search
   and P46 technical help. Loaded after batch05/kit5.js. Every record is fictional and local: nothing
   here claims a live connection, a production migration, certification or a real support service. */
(function () {
  "use strict";
  const K = window.K;
  const { ic, esc } = K;

  const P = {
    plug: '<path d="M9 3v5M15 3v5M6.5 8h11v3a5.5 5.5 0 0 1-11 0zM12 16.5V21"/>',
    archive: '<rect x="3.5" y="4" width="17" height="4.5" rx="1.2"/><path d="M5 8.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V8.5M10 12.5h4"/>',
    sparkle: '<path d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
    merge: '<path d="M6 3.5v4a5 5 0 0 0 5 5h2a5 5 0 0 1 5 5v3M18 3.5v4a5 5 0 0 1-3 4.6M3.5 18l2.5 2.5L8.5 18"/>',
  };
  K.sprite = K.sprite.replace("</defs>", Object.entries(P).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join("") + "</defs>");
  K.icons.push(...Object.keys(P));

  // Status additions. A request is not an appointment; a referral is not consent to share more;
  // validated is not sent; accepted applies to one exact preview; a setting is not a certification (D50–D58).
  Object.assign(K.STATUS, {
    supRequested: ["info", "hourglass", "Requested · not scheduled"],
    supCancelled: ["neutral", "x", "Cancelled · request closed"],
    refActive: ["accent", "users", "Referral · your choice to book"],
    refDraft: ["warning", "pencil", "Draft · not shared"],
    refReceived: ["success", "check-circle", "Received by service"],
    refRestricted: ["neutral", "lock", "No referral permission"],
    caseNew: ["warning", "hourglass", "Unassigned · in queue"],
    caseOwned: ["accent", "person", "Owned · next step set"],
    caseMoved: ["info", "swap", "Redirected · new queue"],
    caseResolved: ["success", "check-circle", "Resolved"],
    supportOpen: ["warning", "key", "Support access active"],
    supportClosed: ["neutral", "lock", "Support access closed"],
    aligned: ["success", "check", "Records agree"],
    collision: ["error", "merge", "Collision · decision needed"],
    validated: ["info", "checklist", "Validated · not sent"],
    rowRejected: ["error", "x", "Rejected by source"],
    rowAcked: ["success", "check-circle", "Acknowledged by source"],
    sample: ["neutral", "info", "Sample refresh · not live"],
    unmapped: ["warning", "alert", "Needs a mapping decision"],
    mapped: ["success", "check", "Mapped"],
    notMigrated: ["neutral", "eye-off", "Not migrated"],
    pvAccepted: ["accent", "check", "Accepted · not applied"],
    aiOn: ["info", "sparkle", "Allowed · course rules apply"],
    aiOff: ["neutral", "x", "Turned off"],
    exitReady: ["info", "eye", "Exit preview ready"],
    exported: ["success", "download", "Sample prepared · local file"],
    untested: ["warning", "hourglass", "Not tested"],
    tested: ["success", "check", "Test passed"],
    ownerPending: ["warning", "person", "Owner hasn’t accepted"],
    rehearsal: ["accent", "checklist", "Ready for rehearsal · not live"],
    techOpen: ["info", "hourglass", "Submitted · awaiting reply"],
    techDone: ["success", "check-circle", "Resolved · closed"],
    archived: ["neutral", "archive", "Archived"],
  });

  const INST = K.D2.inst;
  K.D6 = {
    inst: INST,
    aisha: { name: K.D.student, initials: K.D.initials, role: "Student" },
    reyes: K.D2.staff,
    maya: { name: "Maya Chen", initials: "MC", role: "Teaching assistant · PHYS 110" },
    jamal: { name: "Jamal Wright", initials: "JW", role: "Support coordinator · Learning Commons" },
    ines: { name: "Ines Duarte", initials: "ID", role: "Queue lead · Learning Commons" },
    nadia: { name: "Nadia Haddad", initials: "NH", role: "Institution administrator" },
    owen: { name: "Owen Park", initials: "OP", role: "Institution IT · connections" },
    theo: { name: "Theo Lindgren", initials: "TL", role: "Implementation administrator" },
    ruth: K.D4.registrar,
    // S34 services. Academic support only; technical product help is P46.
    services: [
      { id: "phys", name: "Physics learning support", who: "Learning Commons", what: "45-minute sessions with a physics tutor for PHYS 110–210 · Hollis Hall 116 or online", how: "Request an appointment" },
      { id: "drop", name: "Math & Science Tutoring Center", who: "Learning Commons", what: "Drop-in, no appointment · Keene Center 105 · Mon–Thu 3:00–6:00 pm", how: "Walk in" },
      { id: "advise", name: "Academic advising", who: "College of Science", what: "Course planning, adding or dropping a course, major requirements", how: "Request an appointment" },
      { id: "access", name: "Accessibility Resources", who: "Student Affairs", what: "Accommodations. Documentation stays with Accessibility Resources and is never shown in courses.", how: "Opens the service’s own site" },
      { id: "care", name: "Counseling & wellbeing", who: "Student Health", what: "Confidential. Whiteboard links to the service’s own booking and shares nothing.", how: "Opens the service’s own site" },
    ],
    req: { ref: "LC-2291", at: "Mon, Oct 12 · 8:40 pm ET", reply: "Tue, Oct 13 · 11:20 am ET", topic: "Projectile motion — choosing the sign of g" },
    // Referral (S35 → S36). Facts only; no grades, scores, risk labels or private notes (D52).
    ref: {
      ref: "REF-2026-0147", caseId: "LC-2318", at: "Wed, Oct 21 · 10:15 am ET", to: "Physics learning support · Learning Commons",
      fact: "Asked in office hours on Tue, Oct 20 for more practice with projectile-motion sign conventions.",
      factV1: "Asked after the Problem Set 4 feedback for more practice with projectile-motion sign conventions.",
      note: "You mentioned wanting more practice with sign conventions. Learning Commons tutors can work through problems with you. Booking is up to you.",
      corrected: "Thu, Oct 22 · 9:40 am ET",
    },
    shared: ["Your name and student email", "Course: PHYS 110 · Introductory Mechanics", "Referred by Dr. Diane Reyes", "The fact and note shown here"],
    notShared: ["Grades, scores and feedback", "Submissions and attempts", "Attendance and participation", "Allowances and accommodations", "Private notes from staff"],
    // S36 Learning Commons queue (fictional).
    queue: [
      { id: "LC-2318", who: "Aisha Rahman", src: "Referral · Dr. Diane Reyes · PHYS 110", at: "Wed, Oct 21 · 10:15 am" },
      { id: "LC-2314", who: "Daniel Kim", src: "Student request · PHYS 110", at: "Tue, Oct 20 · 4:02 pm" },
      { id: "LC-2309", who: "Ben Okafor", src: "Student request · MATH 220", at: "Mon, Oct 19 · 9:30 am", owner: "Ines Duarte" },
    ],
    cap: "Physics tutors this week: 6 of 8 sessions booked",
    // S37 institution people (fictional slice).
    people: [
      { name: "Dr. Diane Reyes", ini: "DR", role: "Faculty", aff: "Physics", st: "active", note: "Institution role from the student records system" },
      { name: "Maya Chen", ini: "MC", role: "Teaching assistant", aff: "Physics · graduate student", st: "expired", note: "Ended automatically Sun, Oct 18 · 11:59 pm ET (end date set by Dr. Diane Reyes)" },
      { name: "Elliot Grant", ini: "EG", role: "Staff", aff: "Office of the Registrar (former)", st: "revoked", note: "Revoked Wed, Oct 14 · 4:30 pm ET by Nadia Haddad · “Left Alder Hill on Oct 9”" },
      { name: "Aisha Rahman", ini: "AR", role: "Student", aff: "College of Science", st: "active", note: "Enrolled Fall 2026 · from the student records system" },
    ],
    support: { ref: "TS-2026-10482", who: "Whiteboard product support (fictional vendor)", scope: "Read-only · PHYS 110 upload settings and the upload log for request TS-2026-10482", start: "Fri, Oct 16 · 10:00 am ET", end: "Fri, Oct 16 · 2:00 pm ET", by: "Nadia Haddad" },
    // S38 connection targets (concept: no production connectivity is claimed).
    conns: [
      ["Alder Hill student records", "Official for people, enrollment and final grades", "Sample refresh Thu, Oct 15 · 6:00 am ET"],
      ["Alder Hill sign-in", "Official for identity and sign-in", "Test passed Tue, Oct 13 · 2:15 pm ET"],
      ["Alder Hill scheduling system", "Official for timetable and rooms of record", "Sample refresh Thu, Oct 15 · 7:30 am ET"],
      ["Alder Hill space reservation system", "Official for event reservations", "Sample refresh Thu, Oct 15 · 8:00 am ET"],
    ],
    xfer: { name: "PHYS 110 · Problem Set 4 · release R1", rows: 44, sent: "Tue, Oct 20 · 4:12 pm ET" },
    // S39 migration rehearsal source (fictional export from a previous system).
    mig: { src: "PHYS 110 · Fall 2025 · previous system export (fictional)", dest: "PHYS 110 · Spring 2027 rehearsal shell", fp: "MIG-7C1E-04", fp2: "MIG-9A30-05", accepted: "Thu, Oct 15 · 3:10 pm ET", reexport: "Fri, Oct 16 · 9:05 am ET" },
  };

  // Generic desk shell for staff who aren't teaching: support services, institution administration.
  K.webDesk = ({ area, label, items, nav, crumbs = [], banner = "", body = "", overlay = "", url = "", who, search = "Search" }) => {
    const n = items.map(([k, t, i, go]) => K.link(t, { icon: i, go, current: k === nav })).join("");
    const crumbHtml = crumbs.map(([t, go], i) => (i === crumbs.length - 1 ? `<span aria-current="page">${t}</span>` : `<span class="${i > 0 ? "crumb-mid" : ""}">${K.link(t, { go })}</span>${ic("chev-r", i > 0 ? "crumb-mid" : "")}`)).join("");
    return `<div class="wb w-app staff ops" data-url="${esc(url)}">
<nav class="w-side" aria-label="${esc(label)}">
  <div class="w-brand"><span class="w-mark" aria-hidden="true">w</span>Whiteboard</div>
  <div class="w-navlabel eyebrow">${esc(area)}</div>
  <div class="w-nav">${n}</div>
  <div class="w-navlabel eyebrow">${esc(who.role)}</div>
  <div class="w-nav w-foot">${K.link("Help", { icon: "help", go: "P46:selfservice" })}</div>
</nav>
<div class="w-main">
  <header class="w-top">
    <button type="button" class="w-iconbtn w-menu" aria-label="Open navigation menu" data-note="Narrow web: opens the same navigation as a disclosure panel">${ic("menu")}</button>
    <nav class="w-crumbs" aria-label="Breadcrumb">${crumbHtml}</nav>
    <button type="button" class="w-search" data-go="P45:noquery">${ic("search")}<span>${esc(search)}</span></button>
    ${K.link(who.initials, { cls: "w-avatar", label: "Account: " + who.name, go: "P44:editable" })}
  </header>
  ${banner}
  <main class="w-content">${body}</main>
</div>${overlay}</div>`;
  };
  K.SUPNAV = [["queue", "Referral queue", "list", "S36:received"], ["mine", "Assigned to me", "person", "S36:accepted"]];
  K.ADMINNAV = [
    ["setup", "Initial setup", "checklist", "P50:review"],
    ["people", "People, access & records", "users", "S37:active"],
    ["connections", "Connections", "plug", "S38:aligned"],
    ["migration", "Migration rehearsal", "copy", "S39:unmapped"],
    ["trust", "Trust & AI controls", "shield", "S40:allowed"],
  ];
  K.SUPTABS = [["queue", "Queue", "list", "S36:received"], ["mine", "Mine", "person", "S36:accepted"]];
  K.ADMINTABS = [["setup", "Setup", "checklist", "P50:review"], ["people", "People", "users", "S37:active"], ["connections", "Connect", "plug", "S38:aligned"], ["migration", "Migrate", "copy", "S39:unmapped"], ["trust", "Controls", "shield", "S40:allowed"]];
  K.webSupport = (o) => K.webDesk({ area: "Support services", label: "Whiteboard support services", items: K.SUPNAV, search: "Search cases", ...o });
  K.webAdmin = (o) => K.webDesk({ area: INST.name + " · administration", label: "Whiteboard institution administration", items: K.ADMINNAV, search: "Search people and records", ...o });
  // Two-column “who sees what” boundary used by S34/S35/S36.
  K.boundary = (shared, notShared, h = "What’s shared") => `<div class="w-grid even w-bound"><div><h3 class="eyebrow">${h}</h3><ul class="w-checks">${shared.map((t) => `<li class="ok">${ic("check-circle")}<span><span class="sr">Shared: </span>${t}</span></li>`).join("")}</ul></div><div><h3 class="eyebrow">Never shared</h3><ul class="w-checks">${notShared.map((t) => `<li>${ic("eye-off")}<span><span class="sr">Not shared: </span>${t}</span></li>`).join("")}</ul></div></div>`;
  // Concept disclaimer for institution pages (no live connection, certification or production claim).
  K.conceptNote = (t) => `<p class="meta w-concept">${ic("info")} ${t}</p>`;
  K.steps = (labels, n, label = "Steps") => `<ol class="w-steps" aria-label="${esc(label)}">${labels.map((t, i) => `<li${i + 1 === n ? ' aria-current="step"' : i + 1 < n ? ' class="done"' : ""}><span class="n">${i + 1 < n ? "✓" : i + 1}</span><span class="lbl">${t}</span></li>`).join("")}</ol>`;
})();
