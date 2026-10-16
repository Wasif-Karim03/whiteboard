/* Batch 04 academic scheduling screens: S24 academic timetable, S25 schedule-change review.
   Scheduling-office shell from batch04/kit4.js. Scenario: Keene Center 212’s projector fails Tue,
   Oct 13; MATH 220 moves to Keene Center 105 for Oct 15–29. Proposal Wed, Oct 14 · 9:10 am, approved
   4:05 pm, applied in the source Thu, Oct 15 · 7:30 am — the change S12 shows learners at 7:40 am. */
(function () {
  "use strict";
  const K = window.K;
  const { D4, ic, esc, badge, btn, link, notice, card, webHead, ios, group, row, ival, table, tl, radio, cbox, desktopNote, webSched } = K;
  const reg = K.reg;
  const CH = D4.change, R = D4.registrar, T = D4.proposer;
  const iSched = (o) => ios({ tabs: K.SCHEDTABS, ...o });
  const DAYS = [["Mon", "M"], ["Tue", "T"], ["Wed", "W"], ["Thu", "Th"], ["Fri", "F"]];
  const PAT = { MWF: ["Mon", "Wed", "Fri"], TTh: ["Tue", "Thu"], MW: ["Mon", "Wed"], Tue: ["Tue"], Thu: ["Thu"] };
  const onDay = (pat, d) => PAT[pat].includes(d[0]);

  /* ============ S24 ACADEMIC TIMETABLE ============ */
  const refresh = { current: "Mon, Oct 12 · 6:00 am ET", conflict: "Wed, Oct 14 · 6:00 am ET", delayed: "Wed, Oct 14 · 6:00 am ET", proposal: "Wed, Oct 14 · 12:00 pm ET", applied: "Thu, Oct 15 · 7:30 am ET" };
  const mtg = (m, st, p) => {
    const [days, time, course, room, cap, who, flag] = m;
    let cls = "mtg", extra = "", rm = room;
    if (flag === "m220") {
      cls += " sel";
      if (st === "conflict") { cls += " conflict"; extra = `<span class="flag">${ic("alert")}Projector out of service</span>`; }
      if (st === "proposal") extra = `<span class="prop">${ic("pencil")}Proposed: Keene Center 105 · not applied</span>`;
      if (st === "applied") { rm = "Keene Center 105"; extra = `<span class="flag ok">${ic("check")}Changed Oct 15–29 · applied in source</span>`; }
    }
    return `<li><a href="#" class="${cls}"${flag === "m220" ? ' aria-current="true"' : ""} data-note="Selects ${esc(course)} (${esc(days)} ${esc(time)})"><b>${esc(course)}</b><span>${esc(time)}</span><span class="meta">${esc(rm)} · ${esc(cap)}</span>${extra}</a></li>`;
  };
  const grid = (st, p) => `<div class="w-tt" role="group" aria-label="Weekly timetable, Monday to Friday">${DAYS.map((d) => `<section class="day" aria-label="${d[0]}"><h3>${d[0]}</h3><ul>${D4.meetings.filter((m) => onDay(m[0], d)).map((m) => mtg(m, st, p)).join("")}</ul></section>`).join("")}</div>`;
  const cons = (st) => {
    const proj = st === "conflict" || st === "proposal" ? ["err", "Projector · out of service Oct 14–29 (Facilities FN-1187)"] : ["ok", st === "applied" ? "Projector · working in Keene Center 105" : "Projector · working"];
    return K.checks([["ok", `Room free for every meeting`], ["ok", `Capacity ${st === "applied" ? "64" : "60"} ≥ 58 enrolled`], proj, ["ok", "Step-free access"], ["ok", "Instructor has no other meeting"]].map(([k, t]) => [k, t]), "Constraints for MATH 220 lecture");
  };
  const rail24 = (st) => {
    const facts = `<dl class="facts"><dt>When</dt><dd>TTh 10:30–11:45 am</dd><dt>Room</dt><dd>${st === "applied" ? "Keene Center 105 <span class=\"meta\">· Oct 15–29, then 212</span>" : "Keene Center 212"}</dd><dt>Instructor</dt><dd>Dr. Samuel Price</dd><dt>Enrolled</dt><dd>58</dd></dl>`;
    const acts = {
      current: `${btn("Propose a change…", { cls: "btn block", go: "S25:draft" })}${btn("Inspect room options", { cls: "btn plain block", icon: "building", go: "S26:available", note: "Opens Find a room (S26). The S26 preview follows the Physics After Dark scenario; from here it would open prefilled with TTh 10:30–11:45, 58 seats and a projector." })}`,
      conflict: `${btn("Propose a change…", { cls: "btn primary block", go: "S25:draft" })}${btn("Inspect room options", { cls: "btn plain block", icon: "building", go: "S26:available", note: "Opens Find a room (S26) prefilled with TTh 10:30–11:45, 58 seats and a projector. The S26 preview follows the Physics After Dark scenario." })}`,
      delayed: `${btn("Propose a change…", { cls: "btn block", go: "S25:draft", note: "Proposals can be drafted; checks re-run when the source refreshes" })}`,
      proposal: `${notice("warning", "pencil", `Proposal ${CH.ref} open`, `Submitted Wed, Oct 14 · 9:40 am ET by ${T.name}. The source timetable is unchanged until a decision is applied there.`)}<div style="height:8px"></div>${btn("Open review", { cls: "btn block", go: "S25:submitted" })}`,
      applied: `${notice("success", "check", "Applied in the source", `Refreshed copy shows Keene Center 105 for Oct 15–29 (${CH.ref}).`)}<div style="height:8px"></div>${btn("View decision record", { cls: "btn block", go: "S25:applied" })}${K.handoff("S12", "Learners and Dr. Price see it in Calendar (S12) as a changed meeting, because the source applied it — an approval alone notifies no one.")}`,
    }[st];
    return `<div class="w-rail">${card("MATH 220 lecture", `${facts}<h3 class="eyebrow" style="margin:12px 0 4px">Constraints</h3>${cons(st)}<div style="display:grid;gap:8px;margin-top:12px">${acts}</div>`)}${card("Source", `<dl class="facts"><dt>Timetable</dt><dd>${CH.source}</dd><dt>Status</dt><dd>${st === "delayed" ? badge("lastKnown") : badge("applied", "Source snapshot applied")}</dd><dt>Refreshed</dt><dd>${refresh[st]}</dd></dl><p class="meta" style="margin-top:8px">Whiteboard shows a read-only copy. Proposals never edit it.</p>`)}</div>`;
  };
  reg("S24", {
    states: [
      ["current", "Current", 0],
      ["conflict", "Conflict", 1],
      ["delayed", "Source delayed", 2],
      ["proposal", "Proposal open", 3],
      ["applied", "Change applied", 4],
    ],
    url: () => "app.whiteboard.example/scheduling/fall-2026/timetable?buildings=keene,hollis",
    web(st) {
      const banner = st === "delayed" ? `<div class="w-banner" role="status">${ic("clock")}<span><b>Source refresh delayed.</b> Showing the last-known timetable from Wed, Oct 14 · 6:00 am ET. Nothing here was removed; constraint checks re-run when the source responds.</span></div>` : st === "conflict" ? `<div class="w-banner" role="alert" style="background:var(--wb-error-bg, var(--wb-warning-bg))">${ic("alert")}<span><b>1 constraint conflict.</b> MATH 220 lecture needs a projector; Keene Center 212’s is out of service Oct 14–29.</span></div>` : "";
      const right = `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><div class="w-seg" role="group" aria-label="View"><button type="button" aria-pressed="true" data-note="Grid by day">Grid</button><button type="button" aria-pressed="false" data-note="Sortable list by room, course or instructor">List</button></div>${btn("Filters · 2", { cls: "btn", icon: "sliders", note: "Buildings: Keene Center, Hollis Hall · Fall 2026 · weekly pattern" })}</div>`;
      return webSched({ crumbs: [["Academic scheduling", "S24:current"], ["Fall 2026 timetable"]], url: this.url(st), banner, body: webHead("Academic timetable", `Fall 2026 · weekly pattern · Keene Center and Hollis Hall · ${st === "delayed" ? "last known" : "source applied"} · refreshed ${refresh[st]}`, right) + `<div class="w-grid edit">${card("", grid(st, "ws24"), { label: "Timetable grid" })}${rail24(st)}</div>` });
    },
    ios(st) {
      const seg = `<div class="i-seg" role="group" aria-label="Day">${DAYS.map((d) => `<button type="button" aria-pressed="${d[0] === "Thu"}" data-note="Shows ${d[0]}">${d[0]}</button>`).join("")}</div>`;
      const rows = D4.meetings.filter((m) => onDay(m[0], DAYS[3])).map((m) => {
        const is = m[6] === "m220";
        const trail = !is ? "" : st === "conflict" ? badge("conflict", "Conflict") : st === "proposal" ? badge("proposalOpen", "Proposal open") : st === "applied" ? badge("applied", "Changed") : st === "delayed" ? badge("lastKnown") : "";
        return row(esc(m[2]), `${m[1]} · ${is && st === "applied" ? "Keene Center 105" : m[3]}`, { trail, go: is ? (st === "proposal" ? "S25:submitted" : st === "applied" ? "S25:applied" : "S25:draft") : undefined, note: is ? undefined : "Opens meeting detail" });
      });
      const sh = st === "conflict" ? K.sheet("MATH 220 lecture", "Thu 10:30–11:45 am · Keene Center 212 · 58 enrolled", group([row("Projector out of service", "Oct 14–29 · Facilities FN-1187", { lead: ic("alert") }), row("Capacity 60 ≥ 58", "", { lead: ic("check") }), row("Instructor free", "", { lead: ic("check") })]) + btn("Propose a Change…", { cls: "i-btn", go: "S25:draft" }), "Close") : "";
      const top = st === "delayed" ? notice("warning", "clock", "Source refresh delayed", "Last known: Wed, Oct 14 · 6:00 am.") : st === "applied" ? notice("success", "check", "Source applied a change", "MATH 220 is in Keene Center 105 Oct 15–29.") : "";
      return iSched({ tab: "timetable", large: "Timetable", sub: `Fall 2026 · refreshed ${refresh[st].replace(" ET", "")}`, trail: K.iAv(R), body: top + (top ? '<div style="height:10px"></div>' : "") + seg + group(rows, { h: "Thursday · Keene + Hollis" }) + `<p class="i-foot" data-handoff="S12">Learners see a meeting change in Calendar (S12) only after the source applies it.</p>` + desktopNote("Comparing simultaneous meetings across the week is easier on the grid.", "app.whiteboard.example/scheduling/fall-2026/timetable"), sheet: sh });
    },
    notes: {
      current: { web: "Read-only source copy as a Mon–Fri grid with a meeting detail rail (constraints, actions) and a Source card (system, status, last refresh). Grid/List toggle for different comparisons.", ios: "Mapped agenda: day filter + meetings list; meeting detail opens a sheet or the change review. Desktop recommended for the grid." },
      conflict: { web: "Constraint violation attached to the specific meeting (red outline + text flag) and repeated in its checklist with the evidence (Facilities notice). Propose a change becomes primary; room options open S26 Find a room (Batch 05).", ios: "Conflict badge on the row; detail sheet lists the failing constraint." },
      delayed: { web: "Source delayed: status banner and ‘Last known’ status; nothing hidden or removed; proposals can still be drafted.", ios: "Warning notice with the last-known time." },
      proposal: { web: "Proposal shown as a dashed ‘Proposed · not applied’ note inside the source meeting, which still shows Keene Center 212. The applied timetable stays distinct from proposals.", ios: "‘Proposal open’ badge; row opens the review." },
      applied: { web: "Refreshed source copy shows Keene Center 105 with ‘applied in source’. Calendar sharing is a handoff (learners see it in S12 because the source changed), never triggered by approval.", ios: "Success notice; row shows the new room." },
    },
    a11y: ["Each day is a labelled region; meetings are links with full text (course, time, room, enrolment).", "Conflict and proposal are text inside the meeting, not border colour alone.", "Grid/List is a pressed-state button group."],
  });

  /* ============ S25 SCHEDULE-CHANGE REVIEW ============ */
  const pick = { draft: "k105", blocked: "k108" };
  const chosen = (st) => D4.rooms.find((r) => r.id === (pick[st] || "k105"));
  const opts = (st, p) => {
    const ro = !(st === "draft" || st === "blocked");
    return `<fieldset class="w-choice"><legend class="sr">Room options for TTh 10:30–11:45 am</legend>${D4.rooms.map((r) => `<div class="w-opt${r.id === chosen(st).id ? " sel" : ""}">${radio(`${p}-room`, `${p}-${r.id}`, `<b>${r.name}</b> <span class="meta">· seats ${r.cap} · ${r.feat} · ${r.free}</span>`, r.id === chosen(st).id, { disabled: ro, describedby: `${p}-${r.id}-r` })}<span id="${p}-${r.id}-r">${r.ok ? badge("pass", "Meets all constraints") : badge("failC", "Rejected · " + r.why)}</span></div>`).join("")}</fieldset>`;
  };
  const consTable = (st) => {
    const r = chosen(st), bad = !r.ok;
    const P = (ok, t) => `${badge(ok ? "pass" : "failC")} <span>${t}</span>`;
    return table("Constraint results: current and proposed", ["Constraint", "Current · Keene Center 212", `Proposed · ${r.name}`], [
      ["Room free · 5 meetings", P(true, "Yes"), P(true, "Yes")],
      ["Capacity ≥ 58 enrolled", P(true, "60 seats"), P(!bad, `${r.cap} seats`)],
      ["Projector", P(false, "Out of service Oct 14–29"), P(true, "Working")],
      ["Step-free access", P(true, "Yes"), P(true, "Yes")],
      ["Instructor available", P(true, "Same time"), P(true, "Same time")],
      ["Source term dates", P(true, "Fall 2026"), P(true, "Oct 15–29 within term")],
    ]);
  };
  const hist = (st) => {
    const h = [["doc", "Draft started", `Wed, Oct 14 · 9:10 am ET · ${T.name}`]];
    if (["submitted", "approved", "applied"].includes(st)) h.unshift(["send", "Submitted for review", `Wed, Oct 14 · 9:40 am ET · ${T.name}`]);
    if (["approved", "applied"].includes(st)) h.unshift(["check", "Approved", `Wed, Oct 14 · 4:05 pm ET · ${R.name} · “Only feasible room with a projector at this time.”`]);
    if (st === "applied") h.unshift(["publish", "Source copy reflects the decision", `Thu, Oct 15 · 7:30 am ET · ${CH.source} refresh · applied by ${R.name}`]);
    if (st === "blocked") h.unshift(["alert", "Keene Center 108 checked · capacity fails", "Wed, Oct 14 · 9:22 am ET · kept as a rejected alternative"]);
    return tl(h);
  };
  const decision = (st) => ({
    draft: `${notice("info", "info", "Submitting doesn’t change the timetable", "The registrar decides; the source changes only when the decision is applied there.")}<div style="height:10px"></div>${btn("Submit for review", { cls: "btn primary block", go: "S25:submitted" })}${btn("Save draft", { cls: "btn block", note: "Saved · not submitted" })}`,
    blocked: `${btn("Submit for review", { cls: "btn primary block", disabled: true, describedby: "ws25-why", note: "Selected room fails capacity" })}<p class="meta" id="ws25-why" style="margin-top:6px">Keene Center 108 seats 40; 58 are enrolled. Choose a room that meets every constraint.</p>`,
    submitted: `<p class="meta" style="margin-bottom:8px">Your decision is recorded here. It doesn’t change the source timetable.</p>${btn("Approve change", { cls: "btn primary block", go: "S25:approved" })}${btn("Return to proposer…", { cls: "btn block", note: "Sends it back to Tom Becker with your note; nothing is applied" })}`,
    approved: `${notice("warning", "hourglass", "Approved · source not yet changed", `${CH.source} still shows Keene Center 212. Learners see nothing yet.`)}<div style="height:10px"></div>${cbox("ws25-ack", `Apply this decision in ${CH.source} for ${CH.span}`, false)}<div style="height:8px"></div>${btn("Apply source copy", { cls: "btn primary block", go: "S25:applied", note: "Sends the decision to the source; this page waits for its refreshed copy" })}`,
    applied: `${notice("success", "check-circle", "Applied · source copy reflects the decision", "Refreshed Thu, Oct 15 · 7:30 am ET: MATH 220 TTh 10:30 in Keene Center 105 for Oct 15–29.")}<div style="height:10px"></div>${btn("Return to timetable", { cls: "btn block", go: "S24:applied" })}${K.handoff("S12", "Learners and Dr. Price now see the change in Calendar (S12) — notified because the source applied it, not because it was approved.")}`,
  })[st];
  reg("S25", {
    states: [
      ["draft", "Draft", 0],
      ["blocked", "Blocked", 1],
      ["submitted", "Submitted", 2],
      ["approved", "Approved", 3],
      ["applied", "Applied", 4],
    ],
    url: () => `app.whiteboard.example/scheduling/changes/${CH.ref.toLowerCase()}`,
    web(st) {
      const mine = st === "draft" || st === "blocked";
      const stat = { draft: "propDraft", blocked: "blocked", submitted: "pending", approved: "approved", applied: "applied" }[st];
      const r = chosen(st);
      const compare = `<div class="w-grid even">${card("Current · source", `<dl class="facts"><dt>Meeting</dt><dd>${CH.now}</dd><dt>Course</dt><dd>${CH.course}</dd><dt>Enrolled</dt><dd>58</dd></dl>`)}${card(`Proposed${st === "applied" ? " · now applied" : ""}`, `<dl class="facts"><dt>Meeting</dt><dd><span class="w-diff"><s>Keene Center 212</s> ${ic("chev-r")} ${r.name}</span></dd><dt>Dates</dt><dd>${CH.span}</dd><dt>Reason</dt><dd>${CH.reason}</dd></dl>`, { cls: r.ok ? "" : "bad" })}</div>`;
      const left = `<div class="w-stack">${compare}${card(mine ? "Choose a feasible option" : "Options considered", opts(st, "ws25"))}${card("Constraint evidence", consTable(st))}</div>`;
      const rail = `<div class="w-rail">${card(mine ? "Proposal" : "Registrar decision", `<div style="display:grid;gap:8px">${decision(st)}</div>`)}${card("History", hist(st))}</div>`;
      return webSched({ nav: "reviews", who: mine ? T : R, crumbs: [["Timetable", "S24:proposal"], ["Change reviews", "S25:submitted"], [CH.ref]], url: this.url(st), body: webHead(`Schedule change ${CH.ref}`, `${CH.course} · ${mine ? T.name + " · " + T.role : "Proposed by " + T.name}`, badge(stat)) + `<div class="w-grid edit">${left}${rail}</div>` });
    },
    ios(st) {
      const mine = st === "draft" || st === "blocked";
      const r = chosen(st);
      const body = `<div class="i-card"><p class="meta">Current · source</p><p><b>Keene Center 212</b> · TTh 10:30–11:45</p><p class="meta">Projector out of service Oct 14–29</p></div><div class="i-card${r.ok ? "" : " bad"}"><p class="meta">Proposed · ${CH.span}</p><p><b>${r.name}</b> · seats ${r.cap}</p>${r.ok ? badge("pass", "Meets all constraints") : badge("failC", "Capacity fails · 40 < 58")}</div>` +
        group([row("Room Free · 5 Meetings", "", { trail: badge("pass") }), row("Capacity ≥ 58", `${r.cap} seats`, { trail: badge(r.ok ? "pass" : "failC") }), row("Projector", "Working", { trail: badge("pass") }), row("Instructor Available", "", { trail: badge("pass") })], { h: "Constraints" }) +
        (mine ? group(D4.rooms.map((x) => row(x.name, x.ok ? "Meets all constraints" : "Rejected · " + x.why, { trail: x.id === r.id ? ic("check") : "", note: "Choose " + x.name })), { h: "Options" }) : "") +
        (st === "applied" ? `<p class="i-foot" data-handoff="S12">Learners see it in Calendar (S12) because the source applied it.</p>` : "") +
        group([row("Return to Timetable", "", { go: st === "applied" ? "S24:applied" : "S24:proposal" })]) + desktopNote("Room, time and capacity comparisons are easier side by side.", "app.whiteboard.example/scheduling/changes/" + CH.ref.toLowerCase());
      const bottom = { draft: btn("Submit for Review", { cls: "i-btn", go: "S25:submitted" }), blocked: btn("Submit for Review", { cls: "i-btn", disabled: true, note: "Selected room fails capacity" }), submitted: btn("Approve Change", { cls: "i-btn", go: "S25:approved" }), approved: btn("Apply Source Copy…", { cls: "i-btn", go: "S25:applied" }), applied: "" }[st];
      const top = { blocked: notice("error", "alert", "Keene Center 108 can’t hold this class", "Seats 40; 58 enrolled."), approved: notice("warning", "hourglass", "Approved · source not changed", "Learners see nothing yet."), applied: notice("success", "check-circle", "Applied in source", "Refreshed Thu, Oct 15 · 7:30 am.") }[st] || "";
      return iSched({ tab: "reviews", back: ["Reviews", "S25:submitted"], title: CH.ref, trail: K.iAv(mine ? T : R), body: (top ? top + '<div style="height:10px"></div>' : "") + body, bottom });
    },
    notes: {
      draft: { web: "Department scheduler Tom Becker drafts: current vs proposed cards, room options each with a constraint verdict, and a constraint evidence table (current vs proposed). Submitting is explicitly not a timetable change.", ios: "Review stack: current and proposed cards, constraint checklist, options, Submit." },
      blocked: { web: "Choosing Keene Center 108 fails capacity (40 < 58): the proposed card and the table cell fail in text; Submit disabled with the reason. The smaller room stays visible as a rejected alternative.", ios: "Error notice; failing row; Submit disabled." },
      submitted: { web: "Registrar Ruth Adeyemi reviews read-only options and evidence; Approve or Return to proposer. The decision is recorded and does not change the source.", ios: "Approve Change at the bottom." },
      approved: { web: "Approval and application are two named transitions: approved state says the source still shows 212 and learners see nothing; Apply source copy needs an explicit acknowledgment.", ios: "Warning notice; Apply Source Copy…" },
      applied: { web: "Applied only when the refreshed source copy reflects the decision (time and system named). Return to the timetable (S24 applied); learner notice is a Calendar handoff (S12).", ios: "Success notice; handoff note; return row." },
    },
    a11y: ["Room options are radios; each option’s verdict is linked by aria-describedby.", "Pass/fail is text in badges inside the table, not colour.", "Disabled Submit keeps its reason visible and described."],
  });
})();
