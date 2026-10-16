/* Batch 04 kit extension: statuses, fictional data and the scheduling-office shell for course
   operations (S21 people and permissions, S22 course copy, S23 insights and attendance) and academic
   scheduling (S24 timetable, S25 schedule-change review). Loaded after batch03/kit3.js. */
(function () {
  "use strict";
  const K = window.K;
  const { ic, esc } = K;

  // Status additions. Access, allowance, copy and scheduling words are text first; colour is secondary.
  Object.assign(K.STATUS, {
    active: ["success", "check", "Active"],
    invited: ["info", "mail", "Invited · not activated"],
    accessExpired: ["error", "clock", "Access expired"],
    accessRevoked: ["neutral", "x", "Access revoked · record kept"],
    allowance: ["accent", "clock", "Allowance active"],
    selIncomplete: ["neutral", "checklist", "Selection incomplete"],
    previewCurrent: ["info", "eye", "Preview current"],
    exception: ["error", "alert", "Exception blocks copy"],
    copyReady: ["success", "check", "Reviewed · ready to copy"],
    copied: ["success", "check-circle", "Copied · separate course"],
    excluded: ["neutral", "eye-off", "Not copied"],
    dateWarn: ["warning", "calendar", "Check date"],
    followUp: ["warning", "alert", "Not submitted"],
    disputed: ["warning", "hourglass", "Correction pending"],
    corrected: ["info", "history", "Corrected"],
    present: ["success", "check", "Present"],
    absent: ["neutral", "x", "Absent"],
    applied: ["success", "check", "Applied in source"],
    conflict: ["error", "alert", "Constraint conflict"],
    proposalOpen: ["warning", "pencil", "Proposal open · not applied"],
    propDraft: ["warning", "pencil", "Draft · not submitted"],
    blocked: ["error", "alert", "Blocked"],
    pending: ["info", "hourglass", "Decision pending"],
    approved: ["accent", "check", "Approved · source not changed"],
    pass: ["success", "check", "Meets"],
    failC: ["error", "x", "Fails"],
  });

  K.D4 = {
    // S21 course people (PHYS 110 · Fall 2026). Students: 44 enrolled; a slice is drawn.
    staff: [
      { name: "Dr. Diane Reyes", ini: "DR", role: "Instructor", st: "active", ends: "End of term", note: "Course owner" },
      { name: "Maya Chen", ini: "MC", role: "Teaching assistant", st: "active", ends: "Sun, Oct 18 · 11:59 pm ET", note: "Grading window for PS1–PS4" },
      { name: "Ravi Shah", ini: "RS", role: "Grader", st: "active", ends: "End of term", note: "Problem Set 2 only" },
      { name: "Jordan Ellis", ini: "JE", role: "Teaching assistant", st: "invited", ends: "Invitation expires Thu, Oct 22", note: "Invited Thu, Oct 15 by Dr. Diane Reyes" },
    ],
    students: [
      { name: "Aisha Rahman", ini: "AR", allow: "Quiz time 1.5×" },
      { name: "Ben Okafor", ini: "BO" },
      { name: "Noah Fischer", ini: "NF" },
      { name: "Sam Whitaker", ini: "SW", allow: "Problem Set 4 excused" },
      { name: "Tomás Rivera", ini: "TR" },
    ],
    // Course-scoped permission boundary (D34). Text answers, never icons alone.
    perms: [
      ["See roster and submissions", "Yes", "Yes", "Assigned work only"],
      ["Score and comment", "Yes", "Yes", "Assigned work only"],
      ["Change a rubric rule", "Yes", "Propose only", "No"],
      ["Release feedback", "Yes", "No", "No"],
      ["Manage people and allowances", "Yes", "No", "No"],
      ["See an allowance’s adjusted timing", "Yes", "Yes", "Yes"],
      ["See an allowance’s basis reference", "Yes", "No", "No"],
    ],
    allowances: [
      { who: "Aisha Rahman", what: "Quiz time 1.5×", scope: "All quizzes · Fall 2026", basis: "Accessibility Services notice · ref. AS-2026-0418", by: "Dr. Diane Reyes · Sep 2" },
      { who: "Sam Whitaker", what: "Excused", scope: "Problem Set 4 only", basis: "Instructor decision", by: "Dr. Diane Reyes · Oct 14" },
    ],
    // S22 course copy: PHYS 110 Fall 2026 → Spring 2027. Shift +21 weeks (Mon Aug 31 → Mon Jan 25).
    copy: {
      src: "PHYS 110 · Fall 2026", dst: "PHYS 110 · Spring 2027", shift: "+21 weeks (147 days) · weekdays kept",
      first: ["Mon, Aug 31, 2026", "Mon, Jan 25, 2027"], brk: "Spring break Mon, Mar 8 – Fri, Mar 12",
      dates: [
        ["Module 1 opens", "Mon, Aug 31", "Mon, Jan 25", ""],
        ["Problem Set 1 due", "Fri, Sep 11 · 11:59 pm", "Fri, Feb 5 · 11:59 pm", ""],
        ["Quiz 1 closes", "Mon, Sep 14 · 11:59 pm", "Mon, Feb 8 · 11:59 pm", ""],
        ["Problem Set 2 due", "Fri, Sep 25 · 11:59 pm", "Fri, Feb 19 · 11:59 pm", ""],
        ["Module 3 opens", "Mon, Oct 12 · 8:00 am", "Mon, Mar 8 · 8:00 am", "brk"],
        ["Problem Set 4 due", "Fri, Oct 16 · 11:59 pm", "Fri, Mar 12 · 11:59 pm", "brk"],
        ["Quiz 3 closes", "Mon, Oct 19 · 11:59 pm", "Mon, Mar 15 · 11:59 pm", ""],
        ["Module 4 opens", "Mon, Oct 19 · 8:00 am", "Mon, Mar 15 · 8:00 am", ""],
      ],
      tool: { name: "Projectile launch simulator", kind: "External tool link (LTI 1.1)", where: "Module 3 · after “Launch lab demonstration”" },
      excluded: ["People, roles and invitations", "Submissions and receipts", "Scores, feedback and release records", "Discussion posts", "Allowances and excusals", "Attendance records"],
    },
    // S23 insights. Scenario Mon, Oct 19 (PS4 closed Sun, Oct 18).
    lab: { name: "Lab L02", when: "Thu, Oct 15 · 1:00–2:50 pm", room: "Hollis Hall 116", src: "Lab sign-in sheet · entered by Maya Chen, Fri, Oct 16 · 9:05 am" },
    att: [
      ["Carmen Díaz", "present"], ["Daniel Kim", "absent"], ["Elena Petrova", "present"], ["Farid Haddad", "present"], ["Grace Liu", "present"], ["Jae-won Park", "present"],
    ],
    // S24 timetable: Fall 2026 weekly pattern, Keene Center + Hollis Hall. [days, time, course, room, cap/enrolled, instructor, flag]
    meetings: [
      ["MWF", "9:00–9:50 am", "PHYS 110 lecture", "Hollis Hall 104", "44 / 80", "Dr. Diane Reyes"],
      ["MWF", "11:00–11:50 am", "MATH 110 lecture", "Keene Center 212", "52 / 60", "Dr. Ana Morales"],
      ["TTh", "10:30–11:45 am", "MATH 220 lecture", "Keene Center 212", "58 / 60", "Dr. Samuel Price", "m220"],
      ["TTh", "11:00 am–12:15 pm", "PHYS 210 lecture", "Hollis Hall 104", "36 / 80", "Dr. Lena Vogel"],
      ["Tue", "1:00–2:50 pm", "PHYS 110 Lab L01", "Hollis Hall 116", "22 / 24", "Dr. Diane Reyes"],
      ["Thu", "1:00–2:50 pm", "PHYS 110 Lab L02", "Hollis Hall 116", "22 / 24", "Dr. Diane Reyes"],
      ["MW", "1:00–2:15 pm", "MATH 305 seminar", "Keene Center 108", "18 / 40", "Dr. Samuel Price"],
    ],
    rooms: [
      { id: "k105", name: "Keene Center 105", cap: 64, feat: "Projector · step-free", free: "Free TTh 10:30–11:45", ok: true },
      { id: "k108", name: "Keene Center 108", cap: 40, feat: "Projector · step-free", free: "Free TTh 10:30–11:45", why: "Seats 40; 58 enrolled" },
      { id: "h104", name: "Hollis Hall 104", cap: 80, feat: "Projector · step-free", free: "PHYS 210 from 11:00", why: "Overlaps PHYS 210 lecture 11:00–11:45" },
    ],
    // MATH 220 change scenario (feeds S12’s “moved to Keene Center 105” on Thu, Oct 15).
    change: {
      ref: "SCR-2026-0147", course: "MATH 220 lecture · Dr. Samuel Price", now: "TTh 10:30–11:45 am · Keene Center 212", next: "TTh 10:30–11:45 am · Keene Center 105",
      span: "Thu, Oct 15 – Thu, Oct 29 · 5 meetings", reason: "Keene Center 212 projector out of service (Facilities notice FN-1187, reported Tue, Oct 13)",
      source: "Alder Hill scheduling system",
    },
    proposer: { name: "Tom Becker", initials: "TB", role: "Mathematics department scheduler" },
    registrar: { name: "Ruth Adeyemi", initials: "RA", role: "Office of the Registrar" },
  };

  // ---------- Scheduling-office web shell (registrar / department scheduler) ----------
  const SCHNAV = [
    ["timetable", "Timetable", "calendar", "S24:current"],
    ["reviews", "Change reviews", "checklist", "S25:submitted"],
    ["rooms", "Find a room", "building", "S26:available"],
  ];
  K.webSched = ({ nav = "timetable", crumbs = [], banner = "", body = "", overlay = "", url = "", who = K.D4.registrar }) => {
    const n = SCHNAV.map(([k, t, i, go, note]) => K.link(t, { icon: i, go, note, current: k === nav })).join("");
    const crumbHtml = crumbs.map(([t, go], i) => (i === crumbs.length - 1 ? `<span aria-current="page">${t}</span>` : `<span class="${i > 0 ? "crumb-mid" : ""}">${K.link(t, { go })}</span>${ic("chev-r", i > 0 ? "crumb-mid" : "")}`)).join("");
    return `<div class="wb w-app staff sched" data-url="${esc(url)}">
<nav class="w-side" aria-label="Whiteboard academic scheduling">
  <div class="w-brand"><span class="w-mark" aria-hidden="true">w</span>Whiteboard</div>
  <div class="w-navlabel eyebrow">Academic scheduling</div>
  <div class="w-nav">${n}</div>
  <div class="w-navlabel eyebrow">Fall 2026 · ${esc(who.role)}</div>
  <div class="w-nav w-foot">${K.link("Help", { icon: "help", go: "P46:selfservice" })}</div>
</nav>
<div class="w-main">
  <header class="w-top">
    <button type="button" class="w-iconbtn w-menu" aria-label="Open navigation menu" data-note="Narrow web: opens the same navigation as a disclosure panel">${ic("menu")}</button>
    <nav class="w-crumbs" aria-label="Breadcrumb">${crumbHtml}</nav>
    <button type="button" class="w-search" data-go="P45:noquery" data-note="P45 Global search; results stay within your scheduling scope">${ic("search")}<span>Search courses and rooms</span></button>
    ${K.link(who.initials, { cls: "w-avatar", label: "Account: " + who.name, go: "P44:editable" })}
  </header>
  ${banner}
  <main class="w-content">${body}</main>
</div>${overlay}</div>`;
  };
  K.SCHEDTABS = [["timetable", "Timetable", "calendar", "S24:current"], ["reviews", "Reviews", "checklist", "S25:submitted"], ["rooms", "Rooms", "building", "S26:available"]];
  K.iAv = (p) => K.link(`<span class="i-avatar">${p.initials}</span>`, { cls: "i-iconbtn", label: "Account: " + p.name, go: "P44:editable" });
  K.radio = (name, id, label, checked, o = {}) => `<div class="w-radio${o.bad ? " bad" : ""}"><input type="radio" name="${name}" id="${id}"${checked ? " checked" : ""}${o.disabled ? " disabled" : ""}${o.describedby ? ` aria-describedby="${o.describedby}"` : ""}><label for="${id}">${label}</label></div>`;
  K.cbox = (id, label, checked, o = {}) => `<div class="w-cbox"><input type="checkbox" id="${id}"${checked ? " checked" : ""}${o.disabled ? " disabled" : ""}${o.describedby ? ` aria-describedby="${o.describedby}"` : ""}><label for="${id}">${label}</label></div>`;
  K.tl = (items) => `<ul class="w-timeline">${items.map(([i, t, m]) => `<li>${ic(i)}<div><b>${t}</b><div class="meta">${m}</div></div></li>`).join("")}</ul>`;
})();
