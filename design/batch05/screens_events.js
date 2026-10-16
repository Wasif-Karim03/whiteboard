/* Batch 05 campus life (2/2): S31 event approval workspace (Hannah Lindqvist, Student Activities),
   S32 event attendance (operator Lucas Moreau at launch night, Fri, Oct 16; Aisha’s pass), S33
   organization transition (Priya Nair → Lucas Moreau as events officer, effective Sun, Nov 1).
   Room, funding and event review keep separate owners; queued check-ins are not attendance until synced. */
(function () {
  "use strict";
  const K = window.K;
  const { D5, ic, esc, badge, btn, link, notice, card, webHead, web, webOps, ios, group, row, checks, table, tl, cbox, handoff, orgNav, iWho, cap, passCode, desktopNote } = K;
  const reg = K.reg;
  const E = D5.events, V = D5.rev, HL = D5.hannah, PN = D5.priya, LM = D5.lucas, KM = D5.kofi, AR = D5.aisha;
  const iOps = (o) => ios({ tabs: K.OPSTABS, ...o });
  const iOrg = (who, o) => ios({ tabs: K.STUDENTTABS, tab: "campus", trail: iWho(who), ...o });

  /* ============ S31 EVENT APPROVAL WORKSPACE ============ */
  const fundOk = (st) => st !== "blocked";
  const stat31 = { pending: ["pending", "Review pending"], returned: ["returned", "Returned to organization"], blocked: ["blocked", "Approval blocked"], approved: ["evApproved"], published: ["pubVersion", "Revision 2 published"] };
  const diff31 = table("Revision 2 compared with the published version", ["Field", "Version 1 · published", "Revision 2"], [
    ["Time", "5:30–7:00 pm", "<b>5:30–7:30 pm</b> · changed"],
    ["Capacity", "60", "<b>80</b> · changed · 48 confirmed fit"],
    ["Room", "Hollis Hall 104", "Hollis Hall 104 · 5:00–7:45 pm incl. setup"],
    ["Access", "Ramp, front-row seats, receivers", "<b>+ live captions</b> · changed"],
    ["Description", "Film clips… explained live", "<b>+ Q&amp;A with Dr. Lena Vogel</b> · changed"],
  ]);
  const deps31 = (st) => `<div class="w-depcols"><section aria-label="Room dependency"><h3>${ic("door")} Room</h3><p class="meta">Owner: Event Services · Marcus Bell</p>${badge("resConfirmed")}<p class="meta">${D5.res.ref} · Hollis Hall 104 · 5:00–7:45 pm · AH-SR-77310. Interval and capacity match revision 2.</p></section><section aria-label="Funding dependency"><h3>${ic("coin")} Funding</h3><p class="meta">Owner: Student Activities Fund · Rosa Delgado</p>${badge(fundOk(st) ? "fundApproved" : "fundPending")}<p class="meta">${V.fund.ref} · ${V.fund.amt} · ${V.fund.what}${fundOk(st) ? " · approved Mon, Oct 19 · 9:40 am" : " · requested Thu, Oct 15"}</p></section><section aria-label="Event review"><h3>${ic("checklist")} Event review</h3><p class="meta">Owner: Student Activities · ${HL.name}</p>${badge(stat31[st][0], stat31[st][1])}</section></div><p class="meta">You can read the room and funding decisions here; their owners change them.</p>`;
  const hist31 = (st) => {
    const h = [["send", "Revision 2 sent for review", "Sat, Oct 17 · 11:20 am · Priya Nair"]];
    if (st === "returned") h.unshift(["reply", "Returned to the organization", "Mon, Oct 19 · 9:15 am · Hannah Lindqvist · “Add when the captioner arrives and where captioned seating is.” Responsible: Priya Nair"]);
    if (["approved", "published"].includes(st)) h.unshift(["check", "Approved · fingerprint 7C1E-30B", "Mon, Oct 19 · 10:20 am · Hannah Lindqvist"]);
    if (st === "published") h.unshift(["publish", "Revision 2 published · 48 confirmed attendees notified of the change", "Mon, Oct 19 · 10:24 am · Hannah Lindqvist"]);
    return tl(h);
  };
  const action31 = (st, p) => ({
    pending: `${checks([["ok", "Room confirmed for the full interval"], ["ok", "Funding approved"], ["ok", "48 confirmed places fit capacity 80"], ["ok", "Required fields complete"]], "Approval checks")}${btn("Approve revision 2", { cls: "btn primary block", go: "S31:approved" })}${btn("Return with reason…", { cls: "btn block", go: "S31:returned" })}`,
    returned: `${notice("warning", "reply", "Returned Mon, Oct 19 · 9:15 am", "“Add when the captioner arrives and where captioned seating is.” Responsible: Priya Nair. Version 1 stays published.")}${handoff("S30", "Priya Nair sees the reason on her event draft (S30) and resends; this workspace waits.")}`,
    blocked: `${checks([["ok", "Room confirmed for the full interval"], ["err", "Funding decision pending · Rosa Delgado"], ["ok", "48 confirmed places fit capacity 80"]], "Approval checks")}${btn("Approve revision 2", { cls: "btn primary block", disabled: true, describedby: `${p}-why`, note: "Funding is still undecided" })}<p class="meta" id="${p}-why">Unresolved: funding ${V.fund.ref} (${V.fund.amt}). Its owner decides; you can’t approve around it.</p>${btn("Return with reason…", { cls: "btn block", go: "S31:returned" })}`,
    approved: `${notice("warning", "hourglass", "Approved · not published", "Students still see version 1. Approval covers these exact fields (fingerprint 7C1E-30B); any change to them needs a new approval.")}<div style="height:8px"></div>${btn("Publish revision 2", { cls: "btn primary block", go: "S31:published", note: "Replaces version 1 in discovery and notifies the 48 confirmed attendees" })}`,
    published: `${notice("success", "check-circle", "Published Mon, Oct 19 · 10:24 am", "Discovery now shows revision 2. 48 confirmed attendees were notified; their places carry over.")}${handoff("S28", "Students see revision 2 in Campus events (S28) with a dated ‘Changed’ notice.")}`,
  })[st];
  reg("S31", {
    states: [
      ["pending", "Pending", 0],
      ["returned", "Returned", 1],
      ["blocked", "Dependencies open", 2],
      ["approved", "Approved", 3],
      ["published", "Published", 4],
    ],
    url: () => "app.whiteboard.example/campus/reviews/after-dark-r2",
    web(st) {
      const left = `<div class="w-stack">${card("Dependencies · separate owners", deps31(st))}${card("What changes for students", diff31 + (st === "published" ? "" : `<p class="meta" style="margin-top:8px">Version 1 stays live until you publish.</p>`))}</div>`;
      const rail = `<div class="w-rail">${card("Decision", `<div style="display:grid;gap:8px">${action31(st, "w31")}</div>`)}${card("History", hist31(st))}</div>`;
      return webOps({ nav: "reviews", who: HL, crumbs: [["Event reviews", "S31:pending"], ["Physics After Dark · revision 2"]], url: this.url(st), body: webHead("Physics After Dark · revision 2", `${D5.org} · sent by Priya Nair · Sat, Oct 17`, badge(stat31[st][0], stat31[st][1])) + `<div class="w-grid edit">${left}${rail}</div>` });
    },
    ios(st) {
      const top = { returned: notice("warning", "reply", "Returned to Priya Nair", "Captioner arrival and seating needed."), blocked: notice("error", "alert", "Funding undecided", "Approval blocked until Rosa Delgado decides."), approved: notice("warning", "hourglass", "Approved · not published", "Students still see version 1."), published: notice("success", "check-circle", "Revision 2 published", "48 attendees notified.") }[st] || "";
      const body = (top ? top + '<div style="height:10px"></div>' : "") + group([row("Room", "Confirmed · AH-SR-77310", { trail: badge("resConfirmed", "Confirmed") }), row("Funding", fundOk(st) ? "Approved · $180" : "Pending · Rosa Delgado", { trail: badge(fundOk(st) ? "fundApproved" : "fundPending", fundOk(st) ? "Approved" : "Pending") }), row("Capacity", "80 · 48 confirmed fit")], { h: "Dependencies" }) + group([row("Time", "5:30–7:00 → 5:30–7:30 PM"), row("Capacity", "60 → 80"), row("Access", "+ live captions")], { h: "Changes" }) + desktopNote("Side-by-side dependency columns and version comparison are easier on a larger screen.", "app.whiteboard.example/campus/reviews/after-dark-r2");
      const bottom = { pending: btn("Decide…", { cls: "i-btn", go: "S31:approved", note: "Decision sheet: Approve or Return with reason" }), blocked: btn("Decide…", { cls: "i-btn", disabled: true, note: "Names the unresolved funding dependency" }), approved: btn("Publish Revision 2…", { cls: "i-btn", go: "S31:published" }) }[st] || "";
      return iOps({ tab: "reviews", trail: iWho(HL), title: "Revision 2", back: ["Reviews", "S31:pending"], body, bottom });
    },
    notes: {
      pending: { web: "Three dependency columns, each with its own owner and status; a version comparison of exactly what students will see change; checks; Approve or Return.", ios: "Review stack with dependency cards; Decide… opens the decision sheet." },
      returned: { web: "Specific reason and responsible person in the rail and history; version 1 stays published; the organization’s side is a handoff to S30.", ios: "Warning notice naming the person." },
      blocked: { web: "Funding pending with Rosa Delgado: that check fails in text, Approve is disabled and described by the named dependency. Return remains possible.", ios: "Error notice; Decide… disabled." },
      approved: { web: "Approved ≠ published: approval records a fingerprint of the exact fields; publishing is a separate action with its consequence stated (replaces version 1, notifies 48 people).", ios: "Publish Revision 2… at the bottom." },
      published: { web: "Published with time and notifications sent; discovery (S28) is a handoff. History is ordered newest first.", ios: "Success notice." },
    },
    a11y: ["Each dependency column is a labelled region with owner and status in words.", "Changed fields in the comparison say ‘changed’, not just bold.", "Disabled Approve is described by the unresolved dependency."],
  });

  /* ============ S32 EVENT ATTENDANCE ============ */
  const L = E.launch;
  const att = D5.att;
  const result32 = (st) => ({
    eligible: [notice("success", "check", "Aisha Rahman · eligible", "Confirmed place for launch night · no guest. Pass K7Q-4M2."), btn("Record check-in", { cls: "btn primary block", go: "S32:synced" })],
    offline: [notice("warning", "offline", "Recorded on this device · not synced", "Aisha Rahman · 6:14 pm. It counts once the server accepts it."), ""],
    synced: [notice("success", "check-circle", "Aisha Rahman · checked in · synced 6:14 pm", "Accepted by the server."), ""],
    duplicate: [notice("neutral", "history", "Ben Okafor · already checked in", "Checked in 6:09 pm on Priya Nair’s device. That earlier check-in is kept; nothing new was recorded."), ""],
    ineligible: [notice("error", "x", "Daniel Kim · not eligible tonight", "This pass is for Physics After Dark (Wed, Oct 21). Launch night is full and doesn’t accept walk-ins. Point him to that event’s date — don’t record a check-in."), ""],
  })[st];
  const queue32 = (st) => {
    const q = st === "offline" ? 14 : 0;
    return `<dl class="facts"><dt>Connection</dt><dd>${st === "offline" ? badge("queuedLocal", "Offline") : badge("checkedIn", "Online")}</dd><dt>On this device</dt><dd>${q ? `${q} check-ins queued · not synced` : "Nothing waiting"}</dd><dt>Last sync</dt><dd>${st === "offline" ? "6:02 pm" : "6:15 pm"}</dd></dl>${st === "offline" ? `<p class="meta" style="margin-top:6px">Queued check-ins are kept on this device until the server accepts them. Don’t clear browser data or sign out.</p>${btn("Try sync now", { cls: "btn block", go: "S32:synced", note: "Sends the queue; duplicates are excluded, not double-counted" })}` : ""}`;
  };
  const recon = table("Reconciliation · launch night", ["Attendee", "Recorded", "Result"], [
    ["Aisha Rahman", "6:14 pm · Lucas’s device", badge("checkedIn", "Accepted")],
    ["Noah Fischer + Lily Fischer (guest)", "6:11 pm · Lucas’s device", badge("checkedIn", "Accepted · 2 people")],
    ["Ben Okafor", "6:24 pm · Lucas’s device", badge("duplicate", "Duplicate · 6:09 pm kept")],
    ["12 others", "6:02–6:13 pm", badge("checkedIn", "Accepted")],
  ]);
  reg("S32", {
    states: [
      ["eligible", "Eligible", 0],
      ["offline", "Offline queued", 1],
      ["synced", "Synced", 2],
      ["duplicate", "Duplicate", 3],
      ["ineligible", "Ineligible", 4],
      ["pass", "Student pass", null, "Added: route S28→S32 opens the student’s own pass, which the brief lists as an entry; operator controls stay role-scoped."],
    ],
    url: (st) => st === "pass" ? "app.whiteboard.example/campus/events/launch/pass" : "app.whiteboard.example/campus/events/launch/check-in",
    web(st) {
      if (st === "pass") return web({ nav: "events", crumbs: [["Events", "S28:confirmed"], ["Your pass"]], url: this.url(st), body: webHead("Your event pass", `${L.title} · ${L.when}`) + `<div class="w-grid even">${card("", `<div class="w-pass">${passCode(L.pass)}<div><p class="t">${AR.name}</p><p class="meta">${L.title}</p><p class="meta">${L.when} · ${L.room}</p><p>Code <b class="code">${L.pass}</b></p>${badge("going")}</div></div><p class="meta">Show this at the door, or say your code. The pass works offline; adding to a device calendar is optional.</p>${link("Back to the event", { go: "S28:confirmed" })}`, { label: "Event pass" })}</div>` });
      const [res, act] = result32(st);
      const lookup = `<div class="w-form one">${K.field({ id: "w32-q", label: "Pass code or name", value: { eligible: "K7Q-4M2", offline: "K7Q-4M2", synced: "K7Q-4M2", duplicate: "R9M-2TC", ineligible: "Z4H-6QE" }[st] })}</div>${res}${act}`;
      const list = `<ul class="w-list inset" aria-label="Confirmed attendees, first rows">${att.map((a) => `<li><div class="grow"><span class="title">${a.name}</span><div class="meta">${a.note}</div></div>${a.name === "Aisha Rahman" ? (st === "offline" ? badge("queuedLocal", "Queued") : st === "synced" ? badge("checkedIn", "Synced") : badge("notStarted", "Not checked in")) : a.st === "duplicate" ? badge("checkedIn", "Checked in 6:09") : a.st === "ineligible" ? badge("ineligible", "Other event") : badge("notStarted", "Not checked in")}</li>`).join("")}</ul>`;
      const left = `<div class="w-stack">${card("Check someone in", lookup)}${st === "synced" || st === "duplicate" ? card("Reconciliation", recon + handoff("S31", "After the event, Student Activities receives the reconciled count (duplicates excluded) with the event record (S31).")) : card("Attendees · 33 confirmed", list)}</div>`;
      const rail = `<div class="w-rail">${card("This device", queue32(st))}${card("Tonight", `${cap(st === "synced" || st === "duplicate" ? 16 : 15, 33, "Checked in of confirmed")}<p class="meta">Counts synced check-ins only${st === "offline" ? "; 14 more are queued on this device" : ""}.</p><p class="meta">Operator scope: this event only, until 9:00 pm. Assigned by Priya Nair.</p>${link("Back to the event", { go: "S28:confirmed", note: "Opens the published event page" })}`)}</div>`;
      return web({ nav: "none", who: LM, groups: `<div class="w-navlabel eyebrow">Launch night · event operator</div><div class="w-nav">${link("Check-in", { icon: "scan", go: "S32:eligible", current: true })}</div>`, crumbs: [["Physics Society", "S29:member"], ["Launch night"], ["Check-in"]], url: this.url(st), banner: st === "offline" ? `<div class="w-banner" role="status">${ic("offline")}<span><b>Offline.</b> Check-ins are saved on this device and marked not synced. Eligibility is checked against the list downloaded at 6:02 pm.</span></div>` : "", body: webHead("Launch night check-in", `${L.when} · ${L.room} · operator ${LM.name}`) + `<div class="w-grid edit">${left}${rail}</div>` });
    },
    ios(st) {
      if (st === "pass") return iOrg(AR, { title: "Event Pass", back: ["Event", "S28:confirmed"], body: `<div class="i-card i-pass">${passCode(L.pass)}<p class="t">${AR.name}</p><p class="meta">${L.title} · ${L.when}</p><p>Code <b>${L.pass}</b></p>${badge("going")}</div><p class="i-foot">Works offline. Brightness goes up while this is open. Add to Wallet is not part of this concept.</p>` + group([row("Back to Event", "", { go: "S28:confirmed" })]) });
      const [res, act] = result32(st);
      const pill = st === "offline" ? `<span class="i-pill warn">${ic("offline")}Offline · 14 queued</span>` : `<span class="i-pill">${ic("check")}Synced 6:15 PM</span>`;
      const raw = `<header class="i-nav"><button type="button" class="back" data-go="S28:confirmed">${ic("chev-l")}Event</button><div class="ttl">Check-in</div><div class="trail">${iWho(LM)}</div></header><div class="i-camera"><div class="viewfinder"><div class="i-scanframe" aria-hidden="true"></div><div class="i-scanhint">${pill}</div></div><div class="i-scanres">${res}${act ? btn("Record Check-in", { cls: "i-btn", go: "S32:synced" }) : ""}${btn("Look Up by Name or Code", { cls: "i-btn secondary", note: "Manual lookup works without camera permission" })}</div></div><nav class="i-tabs" aria-label="Operator">${link(`${ic("scan")}<span>Scan</span>`, { current: true, note: "Scanner" })}${link(`${ic("list")}<span>Attendees</span>`, { note: "Attendee list for this event only" })}${link(`${ic("offline")}<span>Queue${st === "offline" ? " · 14" : ""}</span>`, { go: st === "offline" ? "S32:offline" : "S32:synced", note: "Device queue and reconciliation results" })}</nav><div class="i-home" aria-hidden="true"></div>`;
      return ios({ raw, dark: true });
    },
    notes: {
      eligible: { web: "Operator workspace scoped to one event: lookup by code or name, a plain-language result (who, place, guest), Record check-in, the attendee list and the device queue.", ios: "Camera scanner with the result card overlaid; manual lookup is always offered (and is the path if camera permission is denied)." },
      offline: { web: "Offline banner; the check-in reads ‘Recorded on this device · not synced’ and the queue counts 14. Tonight’s total counts synced records only, with queued ones named separately.", ios: "Offline pill with the queue count; Queue tab badge." },
      synced: { web: "After sync, a reconciliation table shows each queued record’s result (accepted, guest counted, duplicate excluded). The reconciled count goes to Student Activities as a handoff (S31).", ios: "Synced pill; result card." },
      duplicate: { web: "A second scan of Ben Okafor keeps the earlier 6:09 pm check-in and says which device recorded it; nothing new is stored.", ios: "Neutral result; no Record button." },
      ineligible: { web: "Clear reason (pass belongs to a different event), the event’s walk-in setting, and what the operator should say. No override is offered to the operator.", ios: "Error card; manual lookup remains." },
      pass: { web: "Aisha’s own pass: decorative code plus a short spoken/typed code, event, time, place and status. No operator controls.", ios: "Pass card that works offline; no device-calendar permission required." },
    },
    a11y: ["Every scan result is a status/alert region with the person and the reason in words.", "The pass code graphic is decorative; the short code is the accessible equivalent.", "Queued vs synced is written in words and never shares an icon or colour."],
  });

  /* ============ S33 ORGANIZATION TRANSITION ============ */
  const items33 = (st) => [
    ["Events officer role assigned to Lucas Moreau", st === "unassigned" ? "itemOpen" : "itemDone", "Kofi Mensah (president)"],
    ["Lucas reviews and accepts the checklist", ["unassigned", "assigned"].includes(st) ? "itemOpen" : "itemDone", "Lucas Moreau"],
    ["Physics After Dark revision 2 · stays an organization draft", "itemDone", "Organization-owned · no action"],
    [`Room request ${D5.res.ref} · contact changes to Lucas`, st === "blocked" ? "itemOpen" : ["accepted", "complete"].includes(st) ? "itemDone" : "itemOpen", "Event Services confirms the contact change"],
    [`Funding request ${V.fund.ref} · contact changes to Lucas`, ["accepted", "blocked", "complete"].includes(st) ? "itemDone" : "itemOpen", "Student Activities Fund"],
    ["Handoff notes and event files · kept in organization files", "itemDone", "Organization-owned · no action"],
  ];
  const list33 = (st) => `<ul class="w-list inset" aria-label="Handoff checklist">${items33(st).map(([t, k, who]) => `<li><div class="grow"><span class="title">${t}</span><div class="meta">${who}</div></div>${badge(k)}</li>`).join("")}</ul>`;
  const viewer33 = { unassigned: KM, assigned: LM, accepted: KM, blocked: KM, complete: LM };
  const stat33 = { unassigned: ["itemOpen", "Incoming officer needed"], assigned: ["assigned"], accepted: ["accepted"], blocked: ["blocked", "Blocked · item incomplete"], complete: ["handoffDone"] };
  const action33 = (st, p) => ({
    unassigned: `${K.field({ id: `${p}-who`, label: "Incoming events officer", type: "select", value: "Choose a member…", options: ["Choose a member…", "Lucas Moreau", "Grace Liu", "Aisha Rahman"], hint: "Members only. Role takes effect when the handoff completes." })}${K.field({ id: `${p}-from`, label: "Effective date", value: "Sun, Nov 1, 2026" })}${btn("Assign role", { cls: "btn primary block", go: "S33:assigned" })}`,
    assigned: `<p>Kofi Mensah assigned you as events officer from Sun, Nov 1. Review what you’ll own, then accept.</p>${cbox(`${p}-ack`, "I’ve read the handoff notes and the open work above", false)}${btn("Accept checklist", { cls: "btn primary block", go: "S33:accepted" })}${btn("Decline…", { cls: "btn block", note: "Declines with a note to Kofi Mensah; Priya stays events officer" })}`,
    accepted: `${notice("info", "check", "Accepted by Lucas Moreau · Tue, Oct 20", "All required items are done.")}<div style="height:8px"></div>${btn("Complete handoff", { cls: "btn primary block", go: "S33:complete", note: "Lucas becomes events officer; Priya’s officer access ends and her membership stays" })}`,
    blocked: `${btn("Complete handoff", { cls: "btn primary block", disabled: true, describedby: `${p}-why`, note: "A required item is incomplete" })}<p class="meta" id="${p}-why">Waiting on Event Services to confirm Lucas as contact for ${D5.res.ref}. Priya stays events officer until then.</p>`,
    complete: `${notice("success", "check-circle", "Handoff complete · Sun, Nov 1", "You’re events officer. Priya Nair is a member; her officer access ended. The organization kept every draft and request.")}<div style="height:8px"></div>${btn("Continue Physics After Dark draft", { cls: "btn primary block", go: "S30:draft" })}${btn("See officers", { cls: "btn block", go: "S29:officer" })}`,
  })[st];
  const hist33 = (st) => {
    const h = [["swap", "Handoff started by Priya Nair", "Mon, Oct 19 · 4:00 pm"]];
    if (st !== "unassigned") h.unshift(["person", "Lucas Moreau assigned · effective Sun, Nov 1", "Mon, Oct 19 · 4:12 pm · Kofi Mensah"]);
    if (["accepted", "blocked", "complete"].includes(st)) h.unshift(["check", "Checklist accepted", "Tue, Oct 20 · 8:30 pm · Lucas Moreau"]);
    if (st === "complete") h.unshift(["check-circle", "Handoff complete · roster and contact updated", "Sun, Nov 1 · 12:00 am · automatic on the effective date"]);
    return tl(h);
  };
  reg("S33", {
    states: [
      ["unassigned", "Unassigned", 0],
      ["assigned", "Assigned", 1],
      ["accepted", "Accepted", 2],
      ["blocked", "Blocked", 3],
      ["complete", "Complete", 4],
    ],
    url: () => "app.whiteboard.example/campus/organizations/physics-society/handoffs/events-officer",
    web(st) {
      const who = viewer33[st], p = "w33";
      const roles = `<div class="w-grid even">${card("Outgoing", `<p><b>Priya Nair</b></p><p class="meta">Events officer${st === "complete" ? " until Sun, Nov 1 · now a member" : " · until the handoff completes"}</p>`)}${card("Incoming", st === "unassigned" ? `<p class="meta">No one assigned yet</p>${badge("vacant", "Needed")}` : `<p><b>Lucas Moreau</b></p><p class="meta">Events officer ${st === "complete" ? "since Sun, Nov 1" : "from Sun, Nov 1"}</p>`)}</div>`;
      const left = `<div class="w-stack">${roles}${card("Checklist and open work", list33(st) + `<p class="meta" style="margin-top:8px">Open work belongs to ${D5.org} throughout; only the contact person changes.</p>`)}</div>`;
      const rail = `<div class="w-rail">${card("Your step · " + esc(who.name), `<div style="display:grid;gap:8px">${action33(st, p)}</div>`)}${card("History", hist33(st))}</div>`;
      return web({ nav: "none", who, groups: orgNav("handoff", who), crumbs: [[D5.org, "S29:transition"], ["Officer handoff"]], url: this.url(st), body: webHead("Events officer handoff", `${D5.org} · Priya Nair → ${st === "unassigned" ? "incoming officer" : "Lucas Moreau"}`, badge(stat33[st][0], stat33[st][1])) + `<div class="w-grid edit">${left}${rail}</div>` });
    },
    ios(st) {
      const who = viewer33[st];
      const rows = items33(st).map(([t, k, w]) => row(t, w, { trail: badge(k) }));
      const bottom = { unassigned: btn("Assign Incoming Officer…", { cls: "i-btn", go: "S33:assigned", note: "Opens the member picker" }), assigned: btn("Accept Checklist", { cls: "i-btn", go: "S33:accepted" }), accepted: btn("Complete Handoff", { cls: "i-btn", go: "S33:complete" }), blocked: btn("Complete Handoff", { cls: "i-btn", disabled: true, note: "Waiting on Event Services" }), complete: btn("Continue Draft", { cls: "i-btn", go: "S30:draft" }) }[st];
      const top = { blocked: notice("error", "alert", "1 required item open", "Event Services hasn’t confirmed the contact change."), complete: notice("success", "check-circle", "Handoff complete", "You’re events officer.") }[st] || "";
      return iOrg(who, { title: "Officer Handoff", back: [D5.org, "S29:transition"], body: (top ? top + '<div style="height:10px"></div>' : "") + `<div class="i-card"><p class="meta">Events officer</p><p><b>Priya Nair</b> → <b>${st === "unassigned" ? "not assigned" : "Lucas Moreau"}</b></p><p class="meta">Effective Sun, Nov 1 · viewing as ${who.name}</p></div>` + group(rows, { h: "Checklist", foot: "Each person sees only the step assigned to their role." }) + (st === "complete" ? group([row("Officers and Roster", "", { go: "S29:officer" })]) : ""), bottom });
    },
    notes: {
      unassigned: { web: "President Kofi Mensah picks an incoming member and an effective date. Outgoing and incoming cards make the gap explicit; open work lists who acts on each item.", ios: "Checklist-driven; Assign opens a member picker." },
      assigned: { web: "Lucas sees what he’ll own and accepts explicitly; declining keeps Priya in the role.", ios: "Accept Checklist at the bottom." },
      accepted: { web: "Back to the president: everything required is done, so Complete handoff is enabled and states its effect on both people.", ios: "Complete Handoff enabled." },
      blocked: { web: "One required item (Event Services confirming the contact change) is open: Complete is disabled, described by the named item, and Priya stays in role until then.", ios: "Error notice; Complete disabled." },
      complete: { web: "Role effective, roster and contacts updated; Priya keeps membership; the organization still owns the draft, which Lucas continues (S30); officers list opens S29.", ios: "Success notice; Continue Draft." },
    },
    a11y: ["Checklist status is a text badge on each item.", "The viewer’s own step is labelled with their name.", "Disabled Complete is described by the specific open item."],
  });
})();
