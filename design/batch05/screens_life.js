/* Batch 05 campus life (1/2): S28 campus event discovery (Aisha), S29 organization home (Aisha as
   visitor → member; Priya as officer), S30 collaborative event composer (Priya). Published details stay
   unchanged until an approved revision is published; capacity never drops below confirmed places. */
(function () {
  "use strict";
  const K = window.K;
  const { D5, ic, esc, badge, btn, link, notice, card, webHead, web, ios, group, row, ival, field, checks, tl, handoff, orgNav, iWho, cap } = K;
  const reg = K.reg;
  const E = D5.events, PN = D5.priya, AR = D5.aisha, V = D5.rev;
  const iStu = (o) => ios({ tabs: K.STUDENTTABS, tab: "campus", trail: K.iAvatar, ...o });
  const iOrg = (o) => ios({ tabs: K.STUDENTTABS, tab: "campus", trail: iWho(PN), ...o });

  /* ============ S28 CAMPUS EVENT DISCOVERY ============ */
  const sel28 = { published: "dark", confirmed: "launch", full: "scope", waitlisted: "scope", cancelled: "drop" };
  const mineSt = (e, st) => e.id === "launch" ? ["going", "Place confirmed"] : e.id === "drop" ? ["evCancelled", "Cancelled"] : e.id === "scope" ? (st === "waitlisted" ? ["waitlisted", `Waitlisted · #${e.pos} of ${e.wait}`] : ["full", "Full · waitlist open"]) : ["placesLeft", `${e.cap - e.conf} places left`];
  const order = ["launch", "dark", "scope", "drop"];
  const feed28 = (st) => `<ul class="w-list" aria-label="Campus events">${order.map((k) => { const e = E[k], [b, t] = mineSt(e, st), cur = k === sel28[st]; const go = { launch: "S28:confirmed", dark: "S28:published", scope: st === "waitlisted" ? "S28:waitlisted" : "S28:full", drop: "S28:cancelled" }[k]; return `<li${cur ? ' class="sel" aria-current="true"' : ""}><div class="grow">${link(esc(e.title), { cls: "title", go })}<div class="meta">${esc(e.org)} · ${e.when} · ${esc(e.room)}</div></div>${badge(b, t)}</li>`; }).join("")}</ul>`;
  const action28 = (e, st) => ({
    published: `${btn("Reserve a place", { cls: "btn primary", note: "Confirms a place at once while places remain; your pass and calendar entry then appear (as for launch night)" })}`,
    confirmed: `<div class="w-row">${btn("Open event pass", { cls: "btn primary", icon: "ticket", go: "S32:pass" })}${btn("See in Calendar", { cls: "btn", icon: "calendar", go: "S12:personal" })}${btn("Leave event", { cls: "btn plain", note: "Asks to confirm, then releases your place to the next person on the waitlist" })}</div>`,
    full: `${btn("Join waitlist", { cls: "btn primary", go: "S28:waitlisted" })}<p class="meta" style="margin-top:6px">A waitlist position isn’t a place: no pass and no calendar entry until a place is offered and you confirm it.</p>`,
    waitlisted: `${btn("Leave waitlist", { cls: "btn", note: "Removes you from the waitlist; positions behind you move up" })}<p class="meta" style="margin-top:6px">Positions move in order. If a place opens you get an update and must confirm it; until then nothing is reserved and it isn’t in your calendar.</p>`,
    cancelled: "",
  })[st];
  const detail28 = (st) => {
    const e = E[sel28[st]], [b, t] = mineSt(e, st);
    const top = st === "confirmed" ? notice("info", "history", "Changed Wed, Oct 14 by Physics Society", "If it rains, launch night moves to Hollis Hall 104 (step-free). The decision is posted here by 4:00 pm Friday. Your place carries over.") : st === "cancelled" ? notice("neutral", "x", "Cancelled by the organizer", `${esc(e.cx)} Your place was released; there is nothing for you to do.`) : st === "waitlisted" ? notice("warning", "hourglass", `You’re #${e.pos} of ${e.wait} on the waitlist`, "Joined Thu, Oct 15 · 8:12 am. No place is reserved yet.") : "";
    const capLine = st === "cancelled" ? "" : cap(e.conf, e.cap, `${e.title}: places confirmed`);
    return `<div class="w-stack"><div><h2 class="w-evtitle">${esc(e.title)}</h2><p class="meta">Organized by ${link(esc(e.org), { go: e.org === D5.org ? "S29:visitor" : "S29:visitor", note: e.org === D5.org ? "" : "Opens the Astronomy Club’s organization home (same layout as S29)" })}</p></div>${top}<dl class="facts"><dt>When</dt><dd>${e.when}</dd><dt>Where</dt><dd>${esc(e.room)}${e.rain ? ` · <span class="meta">${esc(e.rain)}</span>` : ""}</dd><dt>Your status</dt><dd>${badge(b, t)}</dd><dt>Access</dt><dd>${esc(e.access)}</dd></dl><p>${esc(e.desc)}</p>${capLine}${action28(e, st) || ""}</div>`;
  };
  reg("S28", {
    states: [
      ["published", "Published", 0],
      ["confirmed", "Place confirmed", 1],
      ["full", "Full", 2],
      ["waitlisted", "Waitlisted", 3],
      ["cancelled", "Cancelled", 4],
    ],
    url: (st) => `app.whiteboard.example/campus/events/${sel28[st]}`,
    web(st) {
      const right = `<div class="w-seg" role="group" aria-label="Show"><button type="button" aria-pressed="true" data-note="All published events">All</button><button type="button" aria-pressed="false" data-note="Events where you have a confirmed place">Going</button><button type="button" aria-pressed="false" data-note="Events where you are waitlisted">Waitlist</button></div>`;
      return web({ nav: "events", crumbs: [["Campus"], ["Events"]], url: this.url(st), body: webHead("Campus events", "Approved, published events only · this week and next", right) + `<div class="w-grid">${card("", feed28(st), { label: "Events", flush: true })}${card("", detail28(st), { label: "Event details" })}</div>` });
    },
    ios(st) {
      if (st === "published") {
        const rows = order.map((k) => { const e = E[k], [b, t] = mineSt(e, st); return row(esc(e.title), `${e.when} · ${esc(e.room)}`, { trail: badge(b, t), go: { launch: "S28:confirmed", scope: "S28:full", drop: "S28:cancelled" }[k], note: k === "dark" ? "Pushes the event detail" : undefined }); });
        return iStu({ large: "Campus", sub: "Published events · this week and next", body: `<div class="i-seg" role="group" aria-label="Campus section"><button type="button" aria-pressed="true" data-note="Events">Events</button><button type="button" aria-pressed="false" data-go="S29:member">Organizations</button></div>` + group(rows, { h: "Events" }) + `<div class="i-card"><p class="t">${esc(E.dark.title)}</p><p class="meta">${E.dark.when} · ${E.dark.room}</p>${cap(E.dark.conf, E.dark.cap, "Places confirmed")}${btn("Reserve a Place", { cls: "i-btn", note: "Confirms a place while places remain" })}</div>` });
      }
      const e = E[sel28[st]], [b, t] = mineSt(e, st);
      const top = { confirmed: notice("info", "history", "Rain plan added Wed, Oct 14", "Moves to Hollis Hall 104 if it rains."), cancelled: notice("neutral", "x", "Cancelled by organizer", "Your place was released."), waitlisted: notice("warning", "hourglass", `#${e.pos} of ${e.wait} on the waitlist`, "No place reserved yet.") }[st] || "";
      const rows = [row("When", e.when), row("Where", esc(e.room) + (e.rain ? " · rain: Hollis Hall 104" : "")), row("Organizer", esc(e.org), { go: "S29:visitor" }), row("Access", esc(e.access))];
      const extra = st === "confirmed" ? group([row("Event Pass", "Works offline · no Calendar permission needed", { lead: ic("ticket"), go: "S32:pass" }), row("In Your Calendar", "Fri, Oct 16", { lead: ic("calendar"), go: "S12:personal" })]) : "";
      const bottom = { confirmed: btn("Leave Event…", { cls: "i-btn secondary", note: "Confirms before releasing your place" }), full: btn("Join Waitlist", { cls: "i-btn", go: "S28:waitlisted" }), waitlisted: btn("Leave Waitlist", { cls: "i-btn secondary", note: "Removes you from the waitlist" }), cancelled: "" }[st];
      return iStu({ title: "Event", back: ["Campus", "S28:published"], body: (top ? top + '<div style="height:10px"></div>' : "") + `<div class="i-card"><p class="t">${esc(e.title)}</p>${badge(b, t)}<p>${esc(e.desc)}</p>${st === "cancelled" ? "" : cap(e.conf, e.cap, "Places confirmed")}</div>` + group(rows) + extra, bottom });
    },
    notes: {
      published: { web: "Feed of approved, published events beside a detail panel. Each row carries your status in words (Place confirmed, places left, Full, Cancelled). Capacity reads ‘48 of 60 places confirmed · 12 left’ before the bar. Reserve a place is the one primary action.", ios: "Campus tab (new fifth tab, D42) with an Events/Organizations switch; rows push event detail." },
      confirmed: { web: "Launch night (the event in S12/S13): the organizer’s change is a dated notice; place confirmed; Open event pass (S32) and See in Calendar (S12). Leave event confirms first.", ios: "Pass row works offline and needs no Calendar permission; calendar row opens S12." },
      full: { web: "Full shows ‘30 of 30 · none left’ and offers the waitlist, stating that a position is not a place and creates no pass or calendar entry.", ios: "Join Waitlist at the bottom." },
      waitlisted: { web: "Ordered position (#3 of 7) with the join time; nothing reserved; offers must be confirmed. No pass, no calendar entry.", ios: "Warning notice with position; Leave Waitlist." },
      cancelled: { web: "Cancelled stays visible to people who held a place, with who cancelled, when and why; all participation actions are removed (not disabled). Unpublished events never appear.", ios: "Neutral notice; no actions." },
    },
    a11y: ["Your status is a text badge on every row and in the details, not colour.", "Capacity is a sentence first; the progress bar is labelled and secondary.", "Removed actions on cancelled events avoid dead buttons."],
  });

  /* ============ S29 ORGANIZATION HOME ============ */
  const stat29 = { visitor: "visitor", requested: "memberReq", member: "member", officer: "officer", transition: "officer" };
  const officerList = (st) => `<ul class="w-list inset" aria-label="Officers">${D5.officers.map(([r, n]) => `<li><div class="grow"><span class="title">${r}</span><div class="meta">${n ? (st === "transition" && r === "Events officer" ? `Priya Nair → Lucas Moreau from Sun, Nov 1 · handoff 4 of 6 done` : n) : "No one in this role"}</div></div>${n ? (st === "transition" && r === "Events officer" ? badge("assigned", "Handoff in progress") : "") : badge("vacant")}</li>`).join("")}<li><div class="grow"><span class="title">Faculty adviser</span><div class="meta">${D5.adviser}</div></div></li></ul>`;
  const events29 = `<ul class="w-list inset" aria-label="Published events">${["launch", "dark", "drop"].map((k) => `<li><div class="grow">${link(esc(E[k].title), { cls: "title", go: { launch: "S28:confirmed", dark: "S28:published", drop: "S28:cancelled" }[k] })}<div class="meta">${E[k].when}</div></div>${k === "drop" ? badge("evCancelled", "Cancelled") : ""}</li>`).join("")}</ul>`;
  const member29 = (st) => ({
    visitor: `<p>Open to all students. Officers review requests, usually within a week.</p>${btn("Request membership", { cls: "btn primary block", go: "S29:requested" })}<p class="meta" style="margin-top:6px">You don’t need to be a member to attend events.</p>`,
    requested: `${notice("info", "hourglass", "Requested Thu, Oct 15 · 9:02 am", "Officers decide; you’ll get an update. Events stay open to you meanwhile.")}<div style="height:8px"></div>${btn("Withdraw request", { cls: "btn block", note: "Withdraws the request; nothing else changes" })}`,
    member: `<p>Member since Fri, Oct 16.</p><ul class="w-list inset"><li><div class="grow"><span class="title">Members’ meeting</span><div class="meta">Tue · 6:00 pm · Hollis Hall 116</div></div></li><li><div class="grow"><span class="title">Member updates</span><div class="meta">In your Updates feed</div></div></li></ul>${btn("Leave organization", { cls: "btn plain block", note: "Confirms first; your event places are kept" })}`,
  })[st];
  const work29 = (st) => `<ul class="w-list inset" aria-label="Organization work"><li><div class="grow"><span class="title">Physics After Dark · revision 2</span><div class="meta">Draft · owned by ${D5.org} · last edited by Priya Nair</div></div>${badge("revDraft", "Draft")}</li><li><div class="grow"><span class="title">Room request ${D5.res.ref}</span><div class="meta">Hollis Hall 104 · Wed, Oct 21</div></div>${badge("resConfirmed")}</li><li><div class="grow"><span class="title">Funding request ${V.fund.ref}</span><div class="meta">${V.fund.amt} · ${V.fund.what}</div></div>${badge("fundPending")}</li></ul><p class="meta">Drafts, requests and files belong to the organization, not to one officer’s account.</p><div style="display:grid;gap:8px;margin-top:10px">${btn("Open event draft", { cls: "btn primary block", go: "S30:draft" })}${btn(st === "transition" ? "Open officer handoff" : "Start officer handoff", { cls: "btn block", icon: "swap", go: st === "transition" ? "S33:accepted" : "S33:unassigned" })}</div>`;
  reg("S29", {
    states: [
      ["visitor", "Visitor", 0],
      ["requested", "Membership requested", 1],
      ["member", "Member", 2],
      ["officer", "Officer", 3],
      ["transition", "Transition active", 4],
    ],
    url: () => "app.whiteboard.example/campus/organizations/physics-society",
    web(st) {
      const off = st === "officer" || st === "transition";
      const head = webHead(D5.org, `Hands-on physics for everyone · adviser ${D5.adviser} · 64 members`, badge(stat29[st], off ? "Officer · Events" : undefined));
      const banner = st === "transition" ? `<div class="w-banner" role="status">${ic("swap")}<span><b>Officer handoff in progress.</b> Lucas Moreau becomes events officer on Sun, Nov 1. The organization keeps every draft and request throughout.</span></div>` : "";
      const left = `<div class="w-stack">${card("Upcoming events", events29 + `<div style="margin-top:8px">${link("All Physics Society events", { go: "S28:published" })}</div>`)}${card("Officers", officerList(st))}</div>`;
      const rail = `<div class="w-rail">${off ? card("Organization work", work29(st)) : card("Membership", member29(st))}</div>`;
      const o = { crumbs: [["Organizations", "S29:member"], [D5.org]], url: this.url(st), banner, body: head + `<div class="w-grid">${left}${rail}</div>` };
      return off ? web({ nav: "none", who: PN, groups: orgNav("home", PN), ...o }) : web({ nav: "orgs", ...o });
    },
    ios(st) {
      const off = st === "officer" || st === "transition";
      const top = st === "transition" ? notice("info", "swap", "Handoff in progress", "Lucas Moreau takes over events on Nov 1.") : st === "requested" ? notice("info", "hourglass", "Membership requested", "Officers decide; events stay open to you.") : "";
      const body = (top ? top + '<div style="height:10px"></div>' : "") + `<div class="i-card"><p class="t">${D5.org}</p><p class="meta">Hands-on physics for everyone · 64 members</p>${badge(stat29[st])}</div>` +
        group([row(esc(E.launch.title), E.launch.when, { go: "S28:confirmed" }), row(esc(E.dark.title), E.dark.when, { go: "S28:published" })], { h: "Events" }) +
        group(D5.officers.map(([r, n]) => row(r, n ? (st === "transition" && r === "Events officer" ? "Priya Nair → Lucas Moreau · Nov 1" : n) : "Vacant", { trail: n ? "" : badge("vacant") })), { h: "Officers" }) +
        (off ? group([row("Event Drafts", "Physics After Dark · revision 2", { go: "S30:draft" }), row("Officer Handoff", st === "transition" ? "4 of 6 done" : "Not started", { go: st === "transition" ? "S33:accepted" : "S33:unassigned" })], { h: "Officer tools", foot: "Shown only to officers." }) : "");
      const bottom = { visitor: btn("Request Membership", { cls: "i-btn", go: "S29:requested" }), requested: btn("Withdraw Request", { cls: "i-btn secondary", note: "Withdraws the request" }) }[st] || "";
      return (off ? iOrg : iStu)({ title: D5.org, back: ["Campus", "S28:published"], body, bottom });
    },
    notes: {
      visitor: { web: "Public profile: mission, adviser, published events (→S28) and officers, including a Vacant treasurer stated in words. Membership card: Request membership; events don’t require it.", ios: "Profile stack; Request Membership at the bottom." },
      requested: { web: "Pending request with time and who decides; Withdraw is the only action; events stay open.", ios: "Info notice; Withdraw Request." },
      member: { web: "Member context adds meeting time and member updates; no officer tools.", ios: "Member badge; same profile." },
      officer: { web: "Priya Nair (events officer) sees the organization’s own work: draft revision, room request, funding request — each owned by the organization. Open event draft (S30) and Start officer handoff (S33). Officer tools also appear in her sidebar.", ios: "Officer tools group appears only in officer context." },
      transition: { web: "Handoff banner and officer row show outgoing → incoming with the effective date and progress; ownership never moves to a person.", ios: "Info notice; officer row names both people." },
    },
    a11y: ["Role and membership are text badges; vacancies say ‘Vacant’ in words.", "Officer-only controls are absent, not disabled, for other people.", "Outgoing → incoming uses an arrow plus words (‘from Sun, Nov 1’)."],
  });

  /* ============ S30 COLLABORATIVE EVENT COMPOSER ============ */
  const dep30 = (st) => {
    const room = { published: ["resConfirmed", "Hollis Hall 104 · 5:00–7:15 pm · confirmed"], draft: ["depOpen", "Needs 5:00–7:45 pm · current hold ends 7:15"], invalid: ["depOpen", "Needs 5:00–7:45 pm · current hold ends 7:15"], pending: ["resDraft", `Request ${D5.res.ref} drafted · not sent`], ready: ["resConfirmed", "5:00–7:45 pm · AH-SR-77310"] }[st];
    const fund = { published: ["depDone", "None needed"], draft: ["depOpen", "Not requested"], invalid: ["depOpen", "Not requested"], pending: ["fundPending", `${V.fund.ref} · ${V.fund.amt} · Rosa Delgado deciding`], ready: ["fundPending", `${V.fund.ref} · ${V.fund.amt} · Rosa Delgado deciding`] }[st];
    const roomAct = st === "pending" ? link("Open room request", { go: "S27:draft" }) : st === "draft" || st === "invalid" ? link("Find a room", { go: "S26:available" }) : st === "ready" ? link("View confirmation", { go: "S27:confirmed" }) : "";
    return `<ul class="w-deps" aria-label="Dependencies"><li>${ic("door")}<div><b>Room · Event Services</b>${badge(room[0])}<span class="meta">${room[1]}</span>${roomAct}</div></li><li>${ic("coin")}<div><b>Funding · Student Activities Fund</b>${badge(fund[0])}<span class="meta">${fund[1]}</span>${st === "draft" ? btn("Request funding…", { cls: "btn", note: `Drafts ${V.fund.ref}: ${V.fund.amt} for ${V.fund.what}` }) : ""}</div></li><li>${ic("checklist")}<div><b>Event review · Student Activities</b>${badge(st === "published" ? "depDone" : "notStarted", st === "published" ? "Approved · version 1" : "Not sent")}<span class="meta">${st === "published" ? "Hannah Lindqvist · Sep 28" : "Sent when fields are valid and each dependency is requested"}</span></div></li></ul>`;
  };
  const form30 = (st, p) => {
    const bad = st === "invalid";
    return `<div class="w-form">${field({ id: `${p}-title`, label: "Title", value: E.dark.title, w: 2 })}${field({ id: `${p}-start`, label: "Starts", value: "Wed, Oct 21 · 5:30 pm" })}${field({ id: `${p}-end`, label: "Ends", value: "7:30 pm", hint: "Changed · was 7:00 pm" })}${field({ id: `${p}-cap`, label: "Capacity", value: bad ? "40" : "80", type: "number", err: bad ? "Capacity can’t go below the 48 places already confirmed." : "", hint: "48 places are confirmed. Capacity can’t drop below that." })}${field({ id: `${p}-room`, label: "Room", value: "Hollis Hall 104", readonly: true, hint: "Set by the room request" })}${field({ id: `${p}-desc`, label: "Student-facing description", type: "textarea", value: V.r2.desc, w: 2 })}${field({ id: `${p}-access`, label: "Access information", type: "textarea", value: E.dark.access + " · live captions on screen", w: 2, rows: 2 })}</div>`;
  };
  const pub30 = `<dl class="facts"><dt>When</dt><dd>${V.v1.when}</dd><dt>Capacity</dt><dd>${V.v1.cap} · 48 confirmed</dd><dt>Room</dt><dd>${V.v1.room}</dd><dt>Description</dt><dd>${esc(V.v1.desc)}</dd></dl><p class="meta" style="margin-top:8px">Students see this version until an approved revision is published.</p>`;
  const action30 = (st, p) => ({
    published: `${btn("Start revision", { cls: "btn primary block", go: "S30:draft" })}<p class="meta">Creates revision 2 as an organization draft. Version 1 stays published.</p>`,
    draft: `${badge("autosaved", "Saved to Physics Society drafts · 3:02 pm")}<p class="meta">Officers can see and edit this draft.</p>${btn("Send for review", { cls: "btn primary block", disabled: true, describedby: `${p}-why`, note: "Request the room and funding first" })}<p class="meta" id="${p}-why">Request the room change and the funding first.</p>`,
    invalid: `<div class="notice error" role="alert">${ic("alert")}<div><strong>1 problem blocks review</strong><span><a href="#" data-focus="${p}-cap">Capacity is below confirmed places</a></span></div></div>${btn("Send for review", { cls: "btn primary block", disabled: true, describedby: `${p}-cap-e`, note: "Fix capacity first" })}`,
    pending: `${btn("Send for review", { cls: "btn primary block", disabled: true, describedby: `${p}-why`, note: "Send the room request first" })}<p class="meta" id="${p}-why">The room request is drafted but not sent. Funding is requested.</p>`,
    ready: `${notice("success", "check", "Ready for review", "Fields valid; room confirmed; funding requested. Approval waits for the funding decision.")}<div style="height:8px"></div>${btn("Send for review", { cls: "btn primary block", note: "Sends revision 2 to Student Activities; version 1 stays published" })}${handoff("S31", "Hannah Lindqvist (Student Activities) reviews it in the approval workspace (S31) and can return it with a reason.")}`,
  })[st];
  reg("S30", {
    states: [
      ["published", "Published only", 0],
      ["draft", "Draft", 1],
      ["invalid", "Invalid", 2],
      ["pending", "Dependencies pending", 3],
      ["ready", "Revision ready", 4],
    ],
    url: (st) => "app.whiteboard.example/campus/organizations/physics-society/events/after-dark" + (st === "published" ? "" : "/revisions/2"),
    web(st) {
      const p = "w30";
      const main = st === "published" ? card("Version 1 · published", pub30) : `<div class="w-stack">${card("Revision 2 · draft", form30(st, p))}${card("Version 1 · published", pub30)}</div>`;
      const rail = `<div class="w-rail">${card(st === "published" ? "Revision" : "Send for review", `<div style="display:grid;gap:8px">${action30(st, p)}</div>`)}${card("Dependencies", dep30(st))}</div>`;
      return web({ nav: "none", who: PN, groups: orgNav("events", PN), crumbs: [[D5.org, "S29:officer"], ["Event drafts", "S30:draft"], ["Physics After Dark"]], url: this.url(st), body: webHead("Physics After Dark", `${D5.org} · owned by the organization`, badge(st === "published" ? "pubVersion" : "revDraft")) + `<div class="w-grid edit">${main}${rail}</div>` });
    },
    ios(st) {
      if (st === "published") return iOrg({ title: "Physics After Dark", back: [D5.org, "S29:officer"], body: group([row("When", V.v1.when), row("Capacity", "60 · 48 confirmed"), row("Room", V.v1.room)], { h: "Version 1 · published" }), bottom: btn("Start Revision", { cls: "i-btn", go: "S30:draft" }) });
      const bad = st === "invalid";
      const deps = group([row("Room", { draft: "Needs 5:00–7:45 PM", invalid: "Needs 5:00–7:45 PM", pending: "Request drafted · not sent", ready: "Confirmed in source" }[st], { trail: badge(st === "ready" ? "resConfirmed" : "depOpen", st === "ready" ? "Confirmed" : "Open"), go: st === "pending" ? "S27:draft" : st === "ready" ? "S27:confirmed" : "S26:available" }), row("Funding", st === "pending" || st === "ready" ? "Decision pending" : "Not requested", { trail: badge(st === "pending" || st === "ready" ? "fundPending" : "depOpen", st === "pending" || st === "ready" ? "Pending" : "Open") })], { h: "Dependencies" });
      const body = (bad ? notice("error", "alert", "Capacity below confirmed places", "48 are confirmed.") + '<div style="height:10px"></div>' : "") + `<div class="i-group-form">${K.ifield("i30-title", "Title", E.dark.title)}${K.ifield("i30-end", "Ends", "7:30 PM")}${K.ifield("i30-cap", "Capacity", bad ? "40" : "80", { err: bad ? "Can’t go below 48 confirmed" : "" })}</div><p class="i-foot">Draft saved on this iPhone and to the organization. Offline edits are kept; sending needs a connection.</p>` + deps;
      return iOrg({ title: "Revision 2", back: [D5.org, "S29:officer"], body, bottom: btn("Send for Review", { cls: "i-btn", disabled: st !== "ready", note: st === "ready" ? "Sends revision 2 to Student Activities" : "Resolve the items above first" }) });
    },
    notes: {
      published: { web: "Only version 1 exists: read-only published details, dependencies all resolved, and Start revision. Nothing students see changes.", ios: "Published facts and Start Revision." },
      draft: { web: "Revision 2 form beside the unchanged published version; autosave names where the draft lives (the organization). Changed fields say ‘was …’. The dependency rail shows room (needs a longer interval → Find a room, S26) and funding (not requested). Send for review is disabled with its reason.", ios: "Sectioned editor with native date-time sheets; dependency cards." },
      invalid: { web: "Capacity 40 below 48 confirmed: field error, summary that moves focus to it, Send disabled and described by the error.", ios: "Error notice and field error." },
      pending: { web: "Room request drafted but not sent (opens S27); funding requested and pending with its owner. Send for review stays disabled until each dependency is at least requested.", ios: "Dependency rows open the room request." },
      ready: { web: "Room confirmed in source, funding requested: review can begin. The notice says approval still waits for the funding decision; the reviewer workspace is a handoff (S31), not a link.", ios: "Send for Review enabled." },
    },
    a11y: ["Validation summary links move focus to the field (data-focus).", "Each dependency names its owner and status in words.", "Disabled Send keeps a visible, described reason."],
  });
})();
