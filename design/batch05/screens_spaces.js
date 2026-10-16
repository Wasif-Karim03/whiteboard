/* Batch 05 campus spaces: S26 find a room, S27 reservation request. Requester Priya Nair (Physics
   Society events officer) uses the student shell with her organization tools; Event Services approver
   Marcus Bell uses the campus-operations shell. Choosing a room is not a request; a request is not a
   booking; approval is not confirmation — the reservation system (the source) confirms. */
(function () {
  "use strict";
  const K = window.K;
  const { D5, ic, esc, badge, btn, link, notice, card, webHead, web, webOps, ios, group, row, ival, field, cbox, table, tl, checks, desktopNote, handoff, orgNav, iWho } = K;
  const reg = K.reg;
  const N = D5.need, R = D5.res, PN = D5.priya, MB = D5.marcus;
  const iOrg = (o) => ios({ tabs: K.STUDENTTABS, tab: "campus", trail: iWho(PN), ...o });
  const iOps = (o) => ios({ tabs: K.OPSTABS, ...o });
  const officerWeb = (o) => web({ nav: "none", who: PN, groups: orgNav(o.tool, PN), ...o });

  /* ============ S26 FIND A ROOM ============ */
  const loop = (st) => st === "nomatch";
  const room = (id) => D5.rooms.find((r) => r.id === id);
  // Verdict per room for the current criteria. Every requirement stays visible on every result.
  const verdict = (r, st) => {
    if (r.id === "h104") return loop(st) ? ["partial", "Listening support is portable receivers, not an installed loop"] : ["roomFits", "Free 5:00–7:45 pm · Physics Society’s current hold ends 7:15; nothing else booked"];
    if (r.id === "e100") return ["roomBusy", "Writing Center workshop 4:00–6:00 pm overlaps your 5:00–6:00 pm"];
    return ["roomBusy", "Seats 60 (80 needed) · projector out of service Oct 14–29"];
  };
  const featRow = (r, f, st) => {
    const v = r.feats[f];
    const ok = !/^No|Out of service/.test(v) && !(loop(st) && f === "Listening support" && !/loop/.test(v));
    return `<li class="${ok ? "ok" : "err"}">${ic(ok ? "check-circle" : "x")}<span><span class="sr">${ok ? "Meets" : "Doesn’t meet"}: </span>${f} — ${esc(v)}</span></li>`;
  };
  const roomCard = (r, st, p, sel) => {
    const [k, why] = verdict(r, st);
    return `<li class="w-roomcard${sel ? " sel" : ""}${k === "roomBusy" ? " dim" : ""}"><div class="rh"><b>${r.name}</b><span class="meta">Seats ${r.cap}</span>${badge(k)}</div><p class="meta">${why}</p><ul class="w-checks" aria-label="${r.name} requirements">${N.feats.map((f) => featRow(r, f, st)).join("")}</ul><div class="ra">${sel ? badge("roomFits", "Selected") : k === "roomBusy" ? link("Why unavailable", { go: "S26:unavailable" }) : btn(k === "partial" ? "Choose with portable receivers" : "Choose this room", { cls: "btn", go: "S26:selected" })}</div></li>`;
  };
  const criteria = (st, p) => {
    const inc = st === "incomplete";
    return `<div class="w-form one">${field({ id: `${p}-date`, label: "Date", value: N.date, type: "text", req: true })}<div class="w-form two">${field({ id: `${p}-start`, label: "Start", value: N.start, req: true, hint: "Include setup" })}${field({ id: `${p}-end`, label: "End", value: inc ? "" : N.end, req: true, err: inc ? "Add an end time — rooms are checked for the whole interval, not just the start." : "", hint: inc ? "" : "Include teardown" })}</div>${field({ id: `${p}-cap`, label: "People", value: String(N.cap), type: "number", req: true })}
<fieldset class="w-sel"><legend class="eyebrow">Must have</legend>${cbox(`${p}-proj`, "Projector", true)}${cbox(`${p}-bench`, "Demonstration bench", true)}${cbox(`${p}-step`, "Step-free route to seating", true)}</fieldset>
${field({ id: `${p}-listen`, label: "Listening support", type: "select", value: loop(st) ? "Installed hearing loop only" : "Any (installed loop or portable receivers)", options: ["Not needed", "Any (installed loop or portable receivers)", "Installed hearing loop only"], hint: "Requirements are never dropped to find a match." })}
${btn("Check this time", { cls: "btn primary block", disabled: inc, describedby: inc ? `${p}-end-e` : "", note: inc ? "Add an end time first" : "Re-checks every room for 5:00–7:45 pm" })}</div>`;
  };
  const results = (st, p) => {
    if (st === "incomplete") return `<div class="w-empty">${ic("building")}<div><b>Add an end time to see rooms</b><p class="meta">Availability is checked from start to end. Set so far:</p>${checks([["ok", "Wed, Oct 21 from 5:00 pm"], ["ok", "80 people"], ["ok", "Projector, demonstration bench, step-free route, listening support"], ["todo", "End time"]], "Criteria so far")}</div></div>`;
    if (st === "unavailable") {
      const r = room("e100");
      return `<div class="w-stack">${link(`${ic("chev-l")}All results`, { go: "S26:available", cls: "w-back" })}<h3>${r.name} · seats ${r.cap}</h3>${notice("error", "x", "Unavailable for 5:00–7:45 pm", "Writing Center workshop holds Emery Hall 100 from 4:00 to 6:00 pm. That overlaps the first hour of your interval (5:00–6:00 pm).")}${table(`${r.name} on ${N.date}`, ["Time", "Status"], [["4:00–6:00 pm", "Writing Center workshop · booked"], ["6:00–9:00 pm", "Free"]])}<ul class="w-checks" aria-label="Requirements">${N.feats.map((f) => featRow(r, f, st)).join("")}</ul><p class="meta">Even from 6:00 pm this room has no demonstration bench. Options: start at 6:00 pm without the bench demo, or use Hollis Hall 104, which fits the whole interval.</p><div class="w-row">${btn("Use Hollis Hall 104", { cls: "btn primary", go: "S26:selected" })}${btn("Try 6:00–7:45 pm", { cls: "btn", note: "Re-checks with a 6:00 pm start; the bench requirement still applies" })}</div></div>`;
    }
    const sel = st === "selected";
    const head = st === "nomatch" ? notice("warning", "alert", "No room meets every requirement for 5:00–7:45 pm", "Closest options below say exactly what each one is missing. Nothing has been dropped from your criteria.") : sel ? notice("success", "check", "Hollis Hall 104 selected", "Choosing a room doesn’t reserve it. Next, send a request to Event Services.") : `<p class="meta">3 rooms checked for ${N.date}, ${N.start}–${N.end} · 1 fits everything.</p>`;
    return `<div class="w-stack">${head}<ul class="w-rooms" aria-label="Room results">${D5.rooms.map((r) => roomCard(r, st, p, sel && r.id === "h104")).join("")}</ul></div>`;
  };
  reg("S26", {
    states: [
      ["incomplete", "Criteria incomplete", 0],
      ["available", "Available", 1],
      ["unavailable", "Unavailable", 2],
      ["nomatch", "No full match", 3],
      ["selected", "Room selected", 4],
    ],
    url: (st) => "app.whiteboard.example/spaces/find?date=2026-10-21&from=17:00" + (st === "incomplete" ? "" : "&to=19:45") + "&people=80" + (st === "unavailable" ? "&room=emery-100" : ""),
    web(st) {
      const right = st === "selected" ? btn("Request this room", { cls: "btn primary", go: "S27:draft" }) : "";
      const ctx = `<p class="meta w-ctx">${ic("pencil")} For the event draft ${link("Physics After Dark · revision 2", { go: "S30:pending" })}</p>`;
      return officerWeb({ tool: "rooms", crumbs: [["Physics Society", "S29:officer"], ["Find a room"]], url: this.url(st), body: webHead("Find a room", "Checked for the complete interval · requirements stay on every result", right) + ctx + `<div class="w-grid split">${card("Requirements", criteria(st, "w26"))}${card("", results(st, "w26"), { label: "Results" })}</div>` });
    },
    ios(st) {
      if (st === "incomplete") {
        const sh = K.sheet("Requirements", "Wed, Oct 21 · 80 people", group([ival("Date", "Wed, Oct 21"), ival("Start", "5:00 PM"), ival("End", "Not set", { err: true, s: "Needed to check the whole interval", note: "Opens the time picker" }), ival("People", "80"), ival("Must Have", "Projector, bench, step-free"), ival("Listening Support", "Any")]) + `<p class="i-foot" id="i26-why">Add an end time to see rooms.</p>` + btn("Show Rooms", { cls: "i-btn", disabled: true, describedby: "i26-why", note: "Add an end time first" }), "Close");
        return iOrg({ title: "Find a Room", back: ["Campus", "S28:published"], body: `<div class="i-card"><p class="meta">Set your requirements to see rooms.</p></div>`, sheet: sh });
      }
      if (st === "unavailable" || st === "selected") {
        const r = room(st === "selected" ? "h104" : "e100");
        const top = st === "unavailable" ? notice("error", "x", "Unavailable 5:00–7:45 PM", "Writing Center workshop 4:00–6:00 PM overlaps 5:00–6:00 PM.") : notice("success", "check", "Selected", "Not reserved yet — send a request next.");
        return iOrg({ title: r.name, back: ["Rooms", "S26:available"], body: top + '<div style="height:10px"></div>' + group(N.feats.map((f) => row(f, esc(r.feats[f]), { lead: ic(/^No|Out/.test(r.feats[f]) ? "x" : "check") })), { h: `Seats ${r.cap} · requirements` }) + (st === "unavailable" ? group([row("Use Hollis Hall 104", "Fits the whole interval", { go: "S26:selected" })]) : ""), bottom: st === "selected" ? btn("Request This Room", { cls: "i-btn", go: "S27:draft" }) : "" });
      }
      const chips = `<div class="i-chips">${["Wed, Oct 21", "5:00–7:45 PM", "80 people", loop(st) ? "Hearing loop" : "Listening: any", "Projector", "Bench", "Step-free"].map((c) => link(c, { note: "Opens the requirements sheet; choices are kept" })).join("")}</div>`;
      const rows = D5.rooms.map((r) => { const [k, why] = verdict(r, st); return row(`${r.name} · seats ${r.cap}`, why, { trail: badge(k, k === "roomFits" ? "Fits" : k === "partial" ? "Partial" : "Unavailable"), go: r.id === "h104" ? "S26:selected" : "S26:unavailable" }); });
      return iOrg({ title: "Rooms", large: "Rooms", sub: "Checked for the whole interval", back: ["Campus", "S28:published"], body: chips + (loop(st) ? notice("warning", "alert", "No room meets everything", "Each result says what it’s missing.") : "") + group(rows, { h: "3 rooms checked" }) });
    },
    notes: {
      incomplete: { web: "Requirements panel beside results. With no end time the results area says why nothing is shown and lists what is set; the End field carries the error; Check this time is disabled and described by it.", ios: "Requirements sheet with native pickers; Show Rooms disabled with the reason underneath." },
      available: { web: "Every result repeats all four requirements as met/not met in text and names its availability for the whole 5:00–7:45 pm interval. Unavailable rooms stay listed with the reason rather than vanishing.", ios: "Requirement chips persist; result rows carry Fits/Unavailable in words; rows push room detail." },
      unavailable: { web: "Room detail names the conflicting booking and the overlapping minutes, shows the day’s timeline, and offers alternatives without silently changing the request.", ios: "Pushed room detail with the conflict notice and an alternative row." },
      nomatch: { web: "‘Installed hearing loop only’ leaves no full match. The page says so, keeps the requirement, and explains each closest option’s gap — Hollis Hall 104 offers portable receivers; Emery Hall 100 has a loop but a conflict and no bench.", ios: "Warning notice; partial rows say what’s missing." },
      selected: { web: "Choosing Hollis Hall 104 is not a reservation: the notice says the next step is a request to Event Services; Request this room opens S27.", ios: "Room detail with Request This Room at the bottom." },
    },
    a11y: ["Each requirement on each result is a text line with a hidden ‘Meets/Doesn’t meet’ prefix — not colour or icon alone.", "The incomplete End field is linked to the disabled button by aria-describedby.", "Unavailable rooms remain in the list with their reason, so screen-reader counts stay honest."],
  });

  /* ============ S27 RESERVATION REQUEST ============ */
  const mine = (st) => ["draft", "returned", "confirmed"].includes(st);
  const stat27 = { draft: "resDraft", returned: "returned", requested: "requested", approved: "resApproved", confirmed: "resConfirmed" };
  const facts27 = (st) => `<dl class="facts"><dt>Room</dt><dd>${R.room} · seats 80</dd><dt>Date</dt><dd>${R.date}</dd><dt>Interval</dt><dd><span class="w-diff"><s>${R.now}</s> ${ic("chev-r")} ${R.next}</span><span class="meta"> · ${R.setup}</span></dd><dt>People</dt><dd>${R.people}</dd><dt>Requester</dt><dd>${D5.org} · contact ${PN.name}</dd><dt>Purpose</dt><dd>${esc(R.purpose)}</dd></dl>`;
  const draftForm = (st, p) => `<div class="w-form one">${field({ id: `${p}-purpose`, label: "Purpose shown to Event Services", type: "textarea", value: R.purpose, rows: 2 })}<div class="w-form two">${field({ id: `${p}-people`, label: "People", value: "80", type: "number" })}${field({ id: `${p}-setup`, label: "Setup and teardown", value: R.setup })}</div>${field({ id: `${p}-op`, label: "Demonstration bench operator", value: st === "returned" ? "" : "Dr. Lena Vogel (faculty adviser)", req: true, err: st === "returned" ? "Name the staff member who runs the bench demo — Event Services returned the request for this." : "", hint: "Facilities requires a named staff operator for the gas-off bench." })}</div>`;
  const series = () => `<ul class="w-list inset" aria-label="Physics After Dark series · monthly on Wednesdays">${R.series.map(([d, t, k]) => `<li><div class="grow"><span class="title">${d}</span><div class="meta">${t}</div></div>${k === "occ-cx" ? badge("occCancelled") : k === "occ-this" ? badge("requested", "This request") : badge("resConfirmed", "Held")}</li>`).join("")}</ul><p class="meta">Changing or cancelling one date never edits the series or the other dates.</p>`;
  const sourceCard = (st) => `<dl class="facts"><dt>System</dt><dd>${D5.resSource}</dd><dt>Shows</dt><dd>${st === "confirmed" ? `Hollis Hall 104 · 5:00–7:45 pm · confirmation AH-SR-77310` : "Hollis Hall 104 · 5:00–7:15 pm (current hold)"}</dd><dt>Status</dt><dd>${st === "confirmed" ? badge("resConfirmed") : badge("lastKnown", "Unchanged")}</dd></dl><p class="meta" style="margin-top:8px">${st === "confirmed" ? "Recorded Fri, Oct 16 · 4:45 pm by Marcus Bell from the reservation system." : "Whiteboard shows the reservation system’s copy. Approving here doesn’t change it."}</p>`;
  const hist27 = (st) => {
    const h = [["doc", "Request drafted from Find a room", "Thu, Oct 15 · 3:20 pm · Priya Nair"]];
    const add = (x) => h.unshift(x);
    if (st !== "draft") add(["send", "Requested", "Thu, Oct 15 · 3:42 pm · Priya Nair"]);
    if (st === "returned") add(["reply", "Returned with reason", "Fri, Oct 16 · 10:05 am · Marcus Bell · “Name the bench operator.”"]);
    if (["requested", "approved", "confirmed"].includes(st)) { add(["reply", "Returned with reason", "Fri, Oct 16 · 10:05 am · Marcus Bell · “Name the bench operator.”"]); add(["send", "Resubmitted · operator Dr. Lena Vogel", "Fri, Oct 16 · 11:30 am · Priya Nair"]); }
    if (["approved", "confirmed"].includes(st)) add(["check", `Approved · details fingerprint ${R.fp}`, "Fri, Oct 16 · 2:15 pm · Marcus Bell"]);
    if (st === "confirmed") add(["check-circle", "Confirmation recorded · AH-SR-77310", "Fri, Oct 16 · 4:45 pm · Marcus Bell · from the reservation system"]);
    return tl(h);
  };
  const action27 = (st, p) => ({
    draft: `${notice("info", "info", "A request isn’t a booking", "Event Services decides; the room is yours only when the reservation system confirms it.")}<div style="height:8px"></div>${btn("Send request", { cls: "btn primary block", go: "S27:requested" })}${btn("Back to event draft", { cls: "btn block", go: "S30:pending" })}`,
    returned: `${notice("warning", "reply", "Returned by Marcus Bell · Fri, Oct 16 · 10:05 am", "“Name the staff member who will run the bench demo. Facilities needs it before approving gas-off bench use.”")}<div style="height:8px"></div>${btn("Resend request", { cls: "btn primary block", disabled: true, describedby: `${p}-op-e`, note: "Add the bench operator first" })}${btn("Back to event draft", { cls: "btn block", go: "S30:pending" })}`,
    requested: `<p class="meta">Approving records these exact details (fingerprint ${R.fp}). Any later change sends the request back to review.</p>${checks([["ok", "Hollis Hall 104 free 5:00–7:45 pm"], ["ok", "80 people · seats 80"], ["ok", "Step-free route · east entrance"], ["ok", "Bench operator named · Dr. Lena Vogel"]], "Request checks")}<div style="height:8px"></div>${btn("Approve request", { cls: "btn primary block", go: "S27:approved" })}${btn("Return with reason…", { cls: "btn block", go: "S27:returned", note: "Returns it to Priya Nair with your reason; nothing is reserved" })}`,
    approved: `${notice("warning", "hourglass", "Approved · not confirmed", `${D5.resSource} still shows 5:00–7:15 pm. The Physics Society and Student Activities see “Approved · not confirmed”.`)}<div style="height:8px"></div>${field({ id: `${p}-conf`, label: "Reservation system confirmation number", value: "", hint: "Copy it from the reservation system after you update the booking there." })}${btn("Record confirmation", { cls: "btn primary block", go: "S27:confirmed", note: "Records the source’s confirmation; Whiteboard never books the room itself" })}`,
    confirmed: `${notice("success", "check-circle", "Confirmed in source", "Hollis Hall 104 is booked 5:00–7:45 pm on Wed, Oct 21 (AH-SR-77310).")}<div style="height:8px"></div>${btn("Back to event draft", { cls: "btn primary block", go: "S30:ready" })}${btn("Open in Calendar", { cls: "btn block", icon: "calendar", go: "S12:request" })}${handoff("S31", "Student Activities sees this confirmation as the event’s room dependency in its review (S31). They can read it, not change it.")}`,
  })[st];
  reg("S27", {
    states: [
      ["draft", "Draft", 0],
      ["returned", "Returned", 1],
      ["requested", "Requested", 2],
      ["approved", "Approved · source pending", 3],
      ["confirmed", "Confirmed", 4],
    ],
    url: () => `app.whiteboard.example/spaces/requests/${R.ref.toLowerCase()}`,
    web(st) {
      const p = "w27";
      const left = `<div class="w-stack">${card(mine(st) && st !== "confirmed" ? "Request" : "Requested details", (st === "draft" || st === "returned" ? facts27(st) + `<div style="height:12px"></div>` + draftForm(st, p) : facts27(st) + (st !== "requested" ? "" : `<p class="meta" style="margin-top:8px">Bench operator: Dr. Lena Vogel (faculty adviser)</p>`)))}${card("Occurrences", series())}${card("Source", sourceCard(st))}</div>`;
      const rail = `<div class="w-rail">${card(mine(st) ? "Your request" : "Decision", `<div style="display:grid;gap:8px">${action27(st, p)}</div>`)}${card("History", hist27(st))}</div>`;
      const head = webHead(`Room request ${R.ref}`, `${R.room} · ${R.date} · ${D5.org}`, badge(stat27[st]));
      const body = head + `<div class="w-grid edit">${left}${rail}</div>`;
      return mine(st) ? officerWeb({ tool: "requests", crumbs: [["Physics Society", "S29:officer"], ["Room requests", "S27:draft"], [R.ref]], url: this.url(st), body }) : webOps({ nav: "requests", who: MB, crumbs: [["Room requests", "S27:requested"], [R.ref]], url: this.url(st), body });
    },
    ios(st) {
      const steps = [["doc", "Draft", "Thu, Oct 15"], ["send", "Requested", st === "draft" ? "Not yet" : "Thu, Oct 15"], ["check", "Approved", ["approved", "confirmed"].includes(st) ? "Fri, Oct 16 · 2:15 PM" : "Not yet"], ["check-circle", "Confirmed in source", st === "confirmed" ? "AH-SR-77310" : "Not yet"]];
      const top = { returned: notice("warning", "reply", "Returned · name the bench operator", "Marcus Bell · Fri, Oct 16"), approved: notice("warning", "hourglass", "Approved · not confirmed", "Reservation system unchanged."), confirmed: notice("success", "check-circle", "Confirmed in source", "Hollis Hall 104 · 5:00–7:45 PM") }[st] || "";
      const body = (top ? top + '<div style="height:10px"></div>' : "") + `<div class="i-card"><p class="t">${R.room}</p><p class="meta">${R.date}</p><p><s>${R.now}</s> → <b>${R.next}</b></p><p class="meta">80 people · ${D5.org}</p></div>` + group(steps.map(([i, t, m]) => row(t, m, { lead: ic(i) })), { h: "Status" }) + (st === "returned" ? `<div class="i-group-form">${K.ifield("i27-op", "Bench Operator", "", { err: "Name a staff operator" })}</div>` : "") + group(R.series.map(([d, t]) => row(d, t)), { h: "Series · monthly", foot: "Each date changes or cancels on its own." }) + (st === "confirmed" ? group([row("Open in Calendar", "", { go: "S12:request" }), row("Back to Event Draft", "", { go: "S30:ready" })]) : "");
      const bottom = { draft: btn("Send Request", { cls: "i-btn", go: "S27:requested" }), returned: btn("Resend Request", { cls: "i-btn", disabled: true, note: "Add the bench operator first" }), requested: btn("Approve…", { cls: "i-btn", go: "S27:approved", note: "Action sheet: Approve or Return with reason" }), approved: btn("Record Confirmation…", { cls: "i-btn", go: "S27:confirmed" }), confirmed: "" }[st];
      const o = { title: R.ref, back: mine(st) ? ["Campus", "S29:officer"] : ["Requests", "S27:requested"], body, bottom };
      return mine(st) ? iOrg(o) : iOps({ tab: "requests", trail: iWho(MB), ...o });
    },
    notes: {
      draft: { web: "Requester workspace: the requested details (old → new interval), the editable request, the series of occurrences and the source panel. The rail says a request isn’t a booking. Back to event draft keeps the booking context (S27→S30).", ios: "Status timeline, facts and Send Request." },
      returned: { web: "Return reason is quoted with who and when; the field it concerns carries the error; Resend is disabled and described by that error.", ios: "Returned notice; the bench-operator field shows the error; Resend disabled." },
      requested: { web: "Approver (Marcus Bell, Event Services) sees read-only details, checks in text and the fingerprint that approval will record. Approve, or Return with reason.", ios: "Ops tab bar; Approve… opens an action sheet with Return." },
      approved: { web: "Approved and confirmed are separate: the source still shows 5:00–7:15 pm, everyone else sees ‘Approved · not confirmed’, and Record confirmation needs the reservation system’s number.", ios: "Warning notice; Record Confirmation…" },
      confirmed: { web: "Confirmed only when the source’s confirmation is recorded (number, time, who). The requester returns to the event draft (S30 ready) or opens Calendar (S12). Student Activities reads it as a dependency (S31 handoff). The Nov 18 single-date cancellation stays in the series.", ios: "Success notice; Calendar and draft rows." },
    },
    a11y: ["Status is words in the badge and in each timeline step, not colour.", "Old → new interval uses a struck-through old value plus words, so it reads correctly without styling.", "Occurrence rows name the exact date; cancelled dates say ‘series kept’."],
  });
})();
