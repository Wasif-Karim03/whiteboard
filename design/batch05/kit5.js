/* Batch 05 kit extension: statuses, fictional data and shells for campus spaces (S26 find a room,
   S27 reservation request) and campus life (S28 events, S29 organization home, S30 event composer,
   S31 event approval, S32 attendance, S33 organization transition). Loaded after batch04/kit4.js.
   Scenario: the Physics Society revises “Physics After Dark” (Wed, Oct 21) to run until 7:30 pm for
   80 people with live captions; launch night is Fri, Oct 16 (the event Aisha joined in S12/S13). */
(function () {
  "use strict";
  const K = window.K;
  const { ic, esc } = K;

  const P = {
    scan: '<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M4 12h16"/>',
    door: '<path d="M5 21h14M7 21V4.5A1.5 1.5 0 0 1 8.5 3h7A1.5 1.5 0 0 1 17 4.5V21"/><path d="M13.5 12.5h.01"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><path d="M14.5 9.2c-.5-.8-1.4-1.2-2.5-1.2-1.5 0-2.5.8-2.5 1.9 0 2.6 5 1.3 5 4.1 0 1.1-1.1 2-2.6 2-1.2 0-2.2-.5-2.6-1.4M12 6.5V8M12 16v1.5"/>',
    swap: '<path d="M4 8h13M13.5 4.5L17 8l-3.5 3.5M20 16H7M10.5 12.5L7 16l3.5 3.5"/>',
  };
  K.sprite = K.sprite.replace("</defs>", Object.entries(P).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join("") + "</defs>");
  K.icons.push(...Object.keys(P));

  // Status additions. A request is not a booking; approved is not confirmed; queued is not synced (D42–D49).
  Object.assign(K.STATUS, {
    roomFits: ["success", "check", "Fits the whole interval"],
    roomBusy: ["error", "x", "Unavailable for this interval"],
    partial: ["warning", "alert", "Partial match"],
    resDraft: ["warning", "pencil", "Draft · not requested"],
    returned: ["warning", "reply", "Returned · revision needed"],
    requested: ["info", "hourglass", "Requested · decision pending"],
    resApproved: ["accent", "check", "Approved · not confirmed"],
    resConfirmed: ["success", "check-circle", "Confirmed in source"],
    occCancelled: ["neutral", "x", "This date cancelled · series kept"],
    placesLeft: ["info", "ticket", "Places available"],
    going: ["success", "check-circle", "Place confirmed"],
    full: ["neutral", "users", "Full"],
    waitlisted: ["warning", "hourglass", "Waitlisted · no place yet"],
    evCancelled: ["neutral", "x", "Cancelled by organizer"],
    visitor: ["neutral", "eye", "Not a member"],
    memberReq: ["info", "hourglass", "Membership requested"],
    member: ["success", "check", "Member"],
    officer: ["accent", "key", "Officer"],
    vacant: ["warning", "alert", "Vacant"],
    revDraft: ["warning", "pencil", "Revision draft · not published"],
    pubVersion: ["success", "check-circle", "Published version"],
    depOpen: ["warning", "hourglass", "Not resolved"],
    depDone: ["success", "check", "Resolved"],
    fundPending: ["info", "hourglass", "Funding decision pending"],
    fundApproved: ["success", "check", "Funding approved"],
    evApproved: ["accent", "check", "Approved · not published"],
    checkedIn: ["success", "check-circle", "Checked in · synced"],
    queuedLocal: ["warning", "offline", "Queued on this device · not synced"],
    duplicate: ["neutral", "history", "Duplicate · earlier check-in kept"],
    ineligible: ["error", "x", "Not eligible tonight"],
    assigned: ["info", "person", "Assigned · awaiting acceptance"],
    accepted: ["accent", "check", "Accepted · not complete"],
    handoffDone: ["success", "check-circle", "Handoff complete"],
    itemOpen: ["warning", "clock", "Open"],
    itemDone: ["success", "check", "Done"],
  });

  const ORG = "Physics Society";
  K.D5 = {
    org: ORG,
    // People (fictional). Aisha is the Batch 01 student; officers are students; reviewers are staff.
    aisha: { name: K.D.student, initials: K.D.initials, role: "Student" },
    priya: { name: "Priya Nair", initials: "PN", role: "Events officer · " + ORG },
    lucas: { name: "Lucas Moreau", initials: "LM", role: "Incoming events officer · " + ORG },
    kofi: { name: "Kofi Mensah", initials: "KM", role: "President · " + ORG },
    marcus: { name: "Marcus Bell", initials: "MB", role: "Event Services · space approver" },
    hannah: { name: "Hannah Lindqvist", initials: "HL", role: "Student Activities · event reviewer" },
    rosa: { name: "Rosa Delgado", initials: "RD", role: "Student Activities Fund coordinator" },
    adviser: "Dr. Lena Vogel · Physics",
    resSource: "Alder Hill space reservation system",
    // S26 search for the Physics After Dark revision (setup 5:00, doors 5:30, ends 7:30, teardown to 7:45).
    need: { date: "Wed, Oct 21, 2026", start: "5:00 pm", end: "7:45 pm", cap: 80, feats: ["Projector", "Demonstration bench", "Listening support", "Step-free route"] },
    rooms: [
      { id: "h104", name: "Hollis Hall 104", cap: 80, feats: { "Projector": "Yes", "Demonstration bench": "Yes · Physics bench, staff-operated gas off", "Listening support": "12 portable receivers (Event Services)", "Step-free route": "Yes · east entrance ramp, level to front row" }, busy: "Physics Society holds 5:00–7:15 pm (current reservation RES-2026-0583); free after", fit: "ok" },
      { id: "e100", name: "Emery Hall 100", cap: 140, feats: { "Projector": "Yes", "Demonstration bench": "No", "Listening support": "Installed hearing loop", "Step-free route": "Yes · main entrance" }, busy: "Writing Center workshop 4:00–6:00 pm overlaps 5:00–6:00 pm", fit: "busy" },
      { id: "k212", name: "Keene Center 212", cap: 60, feats: { "Projector": "Out of service Oct 14–29 (Facilities FN-1187)", "Demonstration bench": "No", "Listening support": "No", "Step-free route": "Yes" }, busy: "Free", fit: "no" },
    ],
    // Reservation case (S27). Existing booking 5:00–7:15 pm; the revision needs 5:00–7:45 pm.
    res: {
      ref: "RES-2026-0583", room: "Hollis Hall 104", date: "Wed, Oct 21, 2026", now: "5:00–7:15 pm", next: "5:00–7:45 pm", people: 80,
      purpose: "Physics After Dark: Motion in the Movies — revision 2 (film clips with live captions, Q&A until 7:30 pm)",
      setup: "Setup 5:00 · doors 5:30 · ends 7:30 · teardown by 7:45",
      fp: "4F2A-91C", series: [["Wed, Sep 23", "Held", "occ-held"], ["Wed, Oct 21", "This request changes the end time to 7:45 pm", "occ-this"], ["Wed, Nov 18", "Cancelled Fri, Oct 2 by Priya Nair · midterm week; series kept", "occ-cx"]],
    },
    // Events (S28). Aisha’s view on Thu, Oct 15.
    events: {
      dark: { id: "dark", title: "Physics After Dark: Motion in the Movies", org: ORG, when: "Wed, Oct 21 · 5:30–7:00 pm", room: "Hollis Hall 104", cap: 60, conf: 48, desc: "Film clips that bend (and break) the laws of motion, explained live with demonstrations. Free; open to all students.", access: "Step-free via the east entrance ramp · reserved front-row seating · portable listening receivers at the door" },
      launch: { id: "launch", title: "Physics Society launch night", org: ORG, when: "Fri, Oct 16 · 6:00–7:30 pm", room: "Hollis Hall courtyard", rain: "Hollis Hall 104 if it rains", cap: 40, conf: 33, desc: "Bottle rockets, a pressure demo and pizza. Members and first-time visitors welcome.", access: "Courtyard is step-free from the north path · seating available · rain location is step-free", pass: "K7Q-4M2" },
      scope: { id: "scope", title: "Telescope night", org: "Astronomy Club", when: "Sat, Oct 24 · 8:00–10:00 pm", room: "Keene Center roof deck", cap: 30, conf: 30, wait: 7, pos: 3, desc: "Saturn and the Moon through the club’s 8-inch telescope. Dress warmly.", access: "Roof deck by elevator · step-free · red-light area, no flash" },
      drop: { id: "drop", title: "Pumpkin drop", org: ORG, when: "Sat, Oct 31 · 2:00–3:00 pm", room: "Hollis Hall roof", cap: 50, conf: 21, desc: "Predict the fall time; we drop the pumpkin.", access: "—", cx: "Cancelled Wed, Oct 14 by Physics Society: roof access for the drop was not approved by Facilities." },
    },
    // Organization (S29).
    officers: [["President", "Kofi Mensah"], ["Events officer", "Priya Nair"], ["Treasurer", null], ["Outreach officer", "Grace Liu"]],
    // Event revision (S30/S31): v1 published vs r2 draft.
    rev: {
      v1: { when: "Wed, Oct 21 · 5:30–7:00 pm", cap: 60, room: "Hollis Hall 104", desc: "Film clips that bend (and break) the laws of motion, explained live with demonstrations." },
      r2: { when: "Wed, Oct 21 · 5:30–7:30 pm", cap: 80, room: "Hollis Hall 104 · 5:00–7:45 pm incl. setup", desc: "Film clips that bend (and break) the laws of motion, explained live with demonstrations — now with live captions and a Q&A with Dr. Lena Vogel until 7:30 pm." },
      floor: 48, fund: { ref: "SAF-2026-0312", amt: "$180", what: "Live captioning (CART) for 2 hours" },
    },
    // Attendance (S32): launch night, Fri, Oct 16, courtyard entrance; operator Lucas Moreau (scoped to this event).
    att: [
      { name: "Aisha Rahman", pass: "K7Q-4M2", st: "eligible", note: "Confirmed place · no guest" },
      { name: "Noah Fischer", pass: "P3D-8XW", st: "eligible", note: "Confirmed place · guest: Lily Fischer (named at RSVP)" },
      { name: "Ben Okafor", pass: "R9M-2TC", st: "duplicate", note: "Checked in 6:09 pm by Priya Nair’s device" },
      { name: "Daniel Kim", pass: "Z4H-6QE", st: "ineligible", note: "Pass is for Physics After Dark · Wed, Oct 21" },
    ],
  };

  // Organization-officer nav group added to the student web shell (role-scoped; shown only to officers).
  K.orgNav = (cur, who) => `<div class="w-navlabel eyebrow">${ORG} · ${esc(who.role.split(" · ")[0])}</div><div class="w-nav">${[
    ["home", "Organization home", "org", "S29:officer"],
    ["events", "Event drafts", "pencil", "S30:draft"],
    ["rooms", "Find a room", "building", "S26:available"],
    ["requests", "Room requests", "door", "S27:draft"],
    ["checkin", "Check-in", "scan", "S32:eligible"],
    ["handoff", "Officer handoff", "swap", "S33:assigned"],
  ].map(([k, t, i, go]) => K.link(t, { icon: i, go, current: k === cur })).join("")}</div>`;

  // Campus operations shell (Event Services space approvers, Student Activities reviewers).
  const OPSNAV = [["requests", "Room requests", "door", "S27:requested"], ["rooms", "Find a room", "building", "S26:available"], ["reviews", "Event reviews", "checklist", "S31:pending"]];
  K.webOps = ({ nav = "requests", crumbs = [], banner = "", body = "", overlay = "", url = "", who }) => {
    const n = OPSNAV.map(([k, t, i, go]) => K.link(t, { icon: i, go, current: k === nav })).join("");
    const crumbHtml = crumbs.map(([t, go], i) => (i === crumbs.length - 1 ? `<span aria-current="page">${t}</span>` : `<span class="${i > 0 ? "crumb-mid" : ""}">${K.link(t, { go })}</span>${ic("chev-r", i > 0 ? "crumb-mid" : "")}`)).join("");
    return `<div class="wb w-app staff ops" data-url="${esc(url)}">
<nav class="w-side" aria-label="Whiteboard campus operations">
  <div class="w-brand"><span class="w-mark" aria-hidden="true">w</span>Whiteboard</div>
  <div class="w-navlabel eyebrow">Campus operations</div>
  <div class="w-nav">${n}</div>
  <div class="w-navlabel eyebrow">${esc(who.role)}</div>
  <div class="w-nav w-foot">${K.link("Help", { icon: "help", go: "P46:selfservice" })}</div>
</nav>
<div class="w-main">
  <header class="w-top">
    <button type="button" class="w-iconbtn w-menu" aria-label="Open navigation menu" data-note="Narrow web: opens the same navigation as a disclosure panel">${ic("menu")}</button>
    <nav class="w-crumbs" aria-label="Breadcrumb">${crumbHtml}</nav>
    <button type="button" class="w-search" data-go="P45:noquery" data-note="P45 Global search; results stay within your office’s scope">${ic("search")}<span>Search requests and events</span></button>
    ${K.link(who.initials, { cls: "w-avatar", label: "Account: " + who.name, go: "P44:editable" })}
  </header>
  ${banner}
  <main class="w-content">${body}</main>
</div>${overlay}</div>`;
  };
  K.OPSTABS = [["requests", "Requests", "door", "S27:requested"], ["reviews", "Reviews", "checklist", "S31:pending"], ["rooms", "Rooms", "building", "S26:available"]];
  K.iWho = (p) => K.link(`<span class="i-avatar">${p.initials}</span>`, { cls: "i-iconbtn", label: "Account: " + p.name, go: "P44:editable" });
  // Capacity line: confirmed of capacity, in words first; the bar is secondary.
  K.cap = (conf, cap, label) => `<div class="w-capline"><span><b>${conf} of ${cap}</b> places confirmed${cap > conf ? ` · ${cap - conf} left` : " · none left"}</span>${K.progress(Math.round((conf / cap) * 100), label || "Places confirmed")}</div>`;
  // Decorative pass code (not scannable; the short code is the accessible equivalent).
  K.passCode = (code) => {
    let seed = [...code].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
    const cells = [];
    for (let y = 0; y < 13; y++) for (let x = 0; x < 13; x++) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      const corner = (x < 3 && y < 3) || (x > 9 && y < 3) || (x < 3 && y > 9);
      if (corner ? true : seed % 3 === 0) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
    }
    return `<svg class="passcode" viewBox="-1 -1 15 15" aria-hidden="true" focusable="false"><rect x="-1" y="-1" width="15" height="15" fill="#fff"/><g fill="#111">${cells.join("")}</g></svg>`;
  };
})();
