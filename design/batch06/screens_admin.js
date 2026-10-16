/* Batch 06 institution operations: P50 initial setup and S39 migration rehearsal (Theo Lindgren,
   implementation administrator), S37 people, access & records (Nadia Haddad, institution
   administrator), S38 connections & reconciliation and S40 trust & AI controls (Owen Park, IT).
   Desktop is recommended for all five; iPhone frames are read-first subsets (D56). The official
   student records system stays authoritative; nothing here claims a live connection, a production
   migration, legal compliance or certification. */
(function () {
  "use strict";
  const K = window.K;
  const { D6, ic, esc, badge, btn, link, notice, card, webHead, webAdmin, ios, group, row, ival, field, radio, table, tl, checks, handoff, desktopNote, conceptNote, steps, toggle } = K;
  const reg = K.reg;
  const NH = D6.nadia, OP = D6.owen, TL = D6.theo, M = D6.mig;
  const iAdmin = (who, o) => ios({ tabs: K.ADMINTABS, trail: K.iWho(who), ...o });
  const crumbs = (t) => [[D6.inst.short + " administration", "S37:active"], [t]];

  /* ============ P50 INSTITUTION INITIAL SETUP ============ */
  const STEPS = ["Institution", "Sources of record", "Identity", "Attributes", "Readiness"];
  const stepOf = { incomplete: 1, untested: 3, mapping: 4, ready: 5, review: 5 };
  const sources = (st) => table("Which system is official for each record", ["Record", "Official source", "Whiteboard’s role", "Owner acceptance"], [
    ["People and enrollment", "Alder Hill student records", "Reads; never overwrites", st === "review" ? badge("ownerPending", "Ruth Adeyemi hasn’t accepted") : st === "ready" ? badge("tested", "Accepted by Ruth Adeyemi") : "—"],
    ["Courses and sections", "Alder Hill student records", "Reads; course content lives in Whiteboard", st === "review" ? badge("ownerPending", "Ruth Adeyemi hasn’t accepted") : st === "ready" ? badge("tested", "Accepted by Ruth Adeyemi") : "—"],
    ["Final grades", "Alder Hill student records", "Sends released grades for acknowledgment", st === "review" ? badge("ownerPending", "Ruth Adeyemi hasn’t accepted") : st === "ready" ? badge("tested", "Accepted by Ruth Adeyemi") : "—"],
    ["Rooms and timetable", "Alder Hill scheduling system", "Reads; proposals only", st === "ready" || st === "review" ? badge("tested", "Accepted by Facilities") : "—"],
  ]);
  const attrs = (st) => table("Identity attribute mapping", ["Whiteboard needs", "From Alder Hill sign-in", "Result"], [
    ["Unique person ID", "employeeNumber / studentNumber", badge("tested", "Matches 1,284 of 1,284 sample people")],
    ["Name and email", "displayName, mail", badge("tested", "Matches")],
    ["Affiliation (student, faculty, staff)", st === "mapping" ? "Not sent" : "eduPersonAffiliation", st === "mapping" ? badge("blocked", "Missing for 212 staff in the sample") : badge("tested", "Matches")],
  ]);
  const ready = (st) => checks([
    [st === "incomplete" ? "err" : "ok", st === "incomplete" ? "Institution time zone is missing" : "Institution, term and time zone set"],
    [st === "incomplete" || st === "untested" ? "todo" : "ok", st === "untested" || st === "incomplete" ? "Identity connection not tested" : "Identity test passed · Tue, Oct 13 · 2:15 pm ET"],
    [st === "mapping" ? "err" : ["ready", "review"].includes(st) ? "ok" : "todo", st === "mapping" ? "Affiliation missing for 212 staff — owner: Alder Hill IT identity team" : "Attribute mapping"],
    [st === "review" ? "warn" : st === "ready" ? "ok" : "todo", st === "review" ? "Source-of-record choices await Ruth Adeyemi (Registrar)" : "Source owners accept their records"],
  ], "Readiness");
  const main50 = (st, p) => {
    if (st === "incomplete") return card("1 · Institution", `<div class="w-form two">${field({ id: `${p}-name`, label: "Institution name", value: "Alder Hill College", req: true })}${field({ id: `${p}-term`, label: "First term", value: "Spring 2027 · Jan 19 – May 14, 2027", req: true })}${field({ id: `${p}-org`, label: "Structure", value: "3 colleges · 22 departments (from student records)", readonly: true })}${field({ id: `${p}-tz`, label: "Time zone", type: "select", req: true, value: "Choose a time zone", options: ["Choose a time zone", "America/New_York (ET)", "America/Chicago (CT)"], err: "Choose the institution’s time zone. Every due date and receipt time depends on it." })}</div><div class="w-row" style="margin-top:12px">${btn("Continue", { cls: "btn primary", disabled: true, describedby: `${p}-tz-e`, note: "Set the time zone first" })}</div>`);
    if (st === "untested") return card("3 · Identity connection", `<dl class="facts"><dt>Provider</dt><dd>Alder Hill sign-in · login.alderhill.example</dd><dt>Status</dt><dd>${badge("untested")}</dd></dl><p class="meta" style="margin-top:8px">The test signs in one fictional test account and reads its attributes. It doesn’t create people or change the provider.</p><div class="w-row" style="margin-top:12px">${btn("Test identity connection", { cls: "btn primary", go: "P50:mapping", note: "Runs a sample sign-in; result appears in step 4" })}${link("Configure the first connection", { go: "S38:aligned" })}</div>`);
    if (st === "mapping") return card("4 · Attribute mapping", `${notice("error", "alert", "Affiliation isn’t sent for 212 staff", "Without it, staff can’t be told apart from students. The Alder Hill IT identity team owns the fix in the provider; Whiteboard won’t guess.")}${attrs(st)}<div class="w-row" style="margin-top:12px">${btn("Re-test after the provider is fixed", { cls: "btn", go: "P50:ready" })}</div>`);
    return card("5 · Readiness", `${st === "review" ? notice("warning", "person", "Review required", "Ruth Adeyemi (Registrar) owns people, courses and final grades. Rehearsal can’t start until she accepts these source-of-record choices.", btn("Send for acceptance", { cls: "btn", note: "Sends Ruth Adeyemi a review link; nothing changes until she accepts" })) : notice("success", "checklist", "Ready for rehearsal", "Every prerequisite check passes. This prepares a rehearsal only — Alder Hill isn’t live and nothing has been activated.")}${sources(st)}${attrs(st)}<div class="w-row" style="margin-top:12px">${st === "ready" ? btn("Start migration rehearsal", { cls: "btn primary", go: "S39:unmapped" }) + btn("Finish setup", { cls: "btn", go: "S37:active" }) : btn("Start migration rehearsal", { cls: "btn primary", disabled: true, describedby: `${p}-why`, note: "Waiting on the Registrar" })}</div>${st === "review" ? `<p class="meta" id="${p}-why">Waiting on Ruth Adeyemi’s acceptance.</p>` : ""}`);
  };
  reg("P50", {
    states: [
      ["incomplete", "Context incomplete", 0],
      ["untested", "Connection untested", 1],
      ["mapping", "Mapping issues", 2],
      ["ready", "Ready for rehearsal", 3],
      ["review", "Owner review required", 4],
    ],
    url: (st) => "admin.whiteboard.example/alder-hill/setup/" + ["institution", "", "identity", "attributes", "readiness", "readiness"][stepOf[st]],
    web(st) {
      const head = webHead("Institution setup", "Alder Hill College · prepares a rehearsal, never a launch", badge(st === "ready" ? "rehearsal" : st === "review" ? "ownerPending" : "attention", st === "ready" ? "" : st === "review" ? "" : "Setup incomplete"));
      return webAdmin({ nav: "setup", who: TL, crumbs: crumbs("Initial setup"), url: this.url(st), body: head + steps(STEPS, stepOf[st], "Setup steps") + `<div class="w-grid" style="margin-top:14px">${main50(st, "w50")}<div class="w-stack">${card("Readiness", ready(st))}${card("Sources of record", `<p class="meta">Alder Hill student records stay official for people, enrollment and final grades. Whiteboard never overwrites them.</p>`)}</div></div>` + conceptNote("Concept: connection names and sample counts are fictional. Passing setup prepares a rehearsal; it does not activate Whiteboard for Alder Hill.") });
    },
    ios(st) {
      const body = desktopNote("Source-of-record choices and attribute mapping are reviewed on a computer.", "admin.whiteboard.example/alder-hill/setup") + group(STEPS.map((t, i) => row(`${i + 1} · ${t}`, i + 1 < stepOf[st] ? "Done" : i + 1 === stepOf[st] ? "Current step" : "Not started", { lead: ic(i + 1 < stepOf[st] ? "check-circle" : i + 1 === stepOf[st] ? "chev-r" : "clock") })), { h: "Steps" }) + group([
        st === "incomplete" ? row("Time zone missing", "Needed for every due date", { lead: ic("alert") }) : st === "untested" ? row("Identity not tested", "Run the test on a computer", { lead: ic("hourglass") }) : st === "mapping" ? row("Affiliation missing · 212 staff", "Owner: Alder Hill IT identity team", { lead: ic("alert") }) : st === "review" ? row("Awaiting Ruth Adeyemi", "Registrar accepts source choices", { lead: ic("person") }) : row("Ready for rehearsal", "Not live; nothing activated", { lead: ic("checklist"), go: "S39:unmapped" }),
        row("Connections", "", { go: "S38:aligned" }), row("Finish Setup", "", { go: "S37:active" })], { h: "Issues" });
      return iAdmin(TL, { tab: "setup", large: "Setup", sub: "Alder Hill College", body });
    },
    notes: {
      incomplete: { web: "Step 1 of 5 with the time zone missing: field error explains why it matters; Continue disabled and described by it. Readiness lists what blocks and what’s to do.", ios: "Desktop note, step summary, and the blocking issue in words." },
      untested: { web: "Identity step says exactly what the test does and doesn’t do (one fictional test sign-in; no people created). A link opens S38 to inspect the first connection.", ios: "‘Identity not tested’ issue row; testing happens on a computer." },
      mapping: { web: "Mapping table shows each needed attribute, its source and result. Affiliation is missing for 212 sample staff; the fix is owned by the identity team in the provider; Whiteboard won’t infer roles.", ios: "Issue row with the owner named." },
      ready: { web: "All checks pass and owners accepted: ‘Ready for rehearsal · not live’. Start migration rehearsal opens S39; Finish setup goes to S37.", ios: "Ready row opens S39." },
      review: { web: "Checks pass but the Registrar hasn’t accepted source-of-record choices: per-record ‘Owner hasn’t accepted’ badges; rehearsal disabled with the reason; Send for acceptance changes nothing by itself.", ios: "Awaiting Ruth Adeyemi row." },
    },
    a11y: ["Step indicator is an ordered list with aria-current=\"step\"; completed steps say ‘Done’ in text on iPhone.", "Every readiness item states Passed / Blocks / To do in words.", "Disabled actions are described by the blocking reason."],
  });

  /* ============ S37 PEOPLE, ACCESS & RECORDS ============ */
  const S = D6.support;
  const personSel = { active: "Dr. Diane Reyes", expired: "Maya Chen", revoked: "Elliot Grant" };
  const pstat = (p) => (p.st === "active" ? badge("active") : p.st === "expired" ? badge("accessExpired", "Expired automatically") : badge("accessRevoked", "Revoked by administrator"));
  const peopleTable = (st) => table("Institution people (sample)", ["Person", "Role", "Affiliation", "Access"], D6.people.map((p) => ({ sel: personSel[st] === p.name, cells: [link(p.name, { go: p.st === "active" ? "S37:active" : "S37:" + p.st }), p.role, p.aff, pstat(p)] })));
  const supportCard = (st) => {
    if (st === "supportactive") return card("Temporary support access", `${notice("warning", "key", "Support access active · ends Fri, Oct 16 · 2:00 pm ET", "Granted by Nadia Haddad for technical request " + S.ref + ".")}<dl class="facts" style="margin-top:10px"><dt>Who</dt><dd>${S.who}</dd><dt>Purpose</dt><dd>Investigate uploads stopping partway (${S.ref})</dd><dt>Scope</dt><dd>${S.scope}</dd><dt>Window</dt><dd>${S.start} – ${S.end} (4 hours)</dd><dt>Not included</dt><dd>Submissions, grades, messages, other courses</dd></dl><div class="w-row" style="margin-top:12px">${btn("Close support access now", { cls: "btn danger", go: "S37:supportclosed" })}</div>`);
    if (st === "supportclosed") return card("Temporary support access", `${notice("neutral", "lock", "Support access closed", "Closed early by Nadia Haddad · Fri, Oct 16 · 11:40 am ET. The session can’t be used again; a new request needs a new approval.")}${tl([["key", "Granted · 4 hours", S.start + " · Nadia Haddad"], ["eye", "Used · read upload log", "Fri, Oct 16 · 10:22 am ET"], ["lock", "Closed early", "Fri, Oct 16 · 11:40 am ET · Nadia Haddad"]])}`);
    return card("Temporary support access", `<p class="meta">No support access is open. Requests show purpose, scope and expiry before you approve.</p>${link("Review last request (" + S.ref + ")", { go: "S37:supportclosed" })}`);
  };
  const personCard = (st) => {
    const p = D6.people.find((x) => x.name === (personSel[st] || "Dr. Diane Reyes"));
    return card(p.name, `<p>${pstat(p)}</p><dl class="facts" style="margin-top:10px"><dt>Role</dt><dd>${p.role}</dd><dt>Affiliation</dt><dd>${p.aff}</dd><dt>Record</dt><dd>${p.note}</dd></dl>${st === "active" ? `<div class="w-row" style="margin-top:12px">${btn("Review access", { cls: "btn", note: "Lists every course role and its end date" })}${btn("Revoke…", { cls: "btn plain danger", go: "S37:revoked" })}</div>` : st === "expired" ? `<p class="meta" style="margin-top:8px">Saved grading work is kept and stays attributed. Course-level extensions are made by the instructor in S21.</p>` : st === "revoked" ? `<p class="meta" style="margin-top:8px">Sessions ended immediately. Records this person created are kept and stay attributed.</p>` : ""}`);
  };
  const retention = card("Retention choices", `${radio("w37-ret", "w37-r5", "Keep course records 5 years after term end", true)}${radio("w37-ret", "w37-r7", "Keep course records 7 years after term end", false)}<p class="meta" style="margin-top:6px">Applies to Alder Hill courses in Whiteboard only. Official records follow the student records system’s own policy. Sample setting; no legal adequacy is claimed.</p>`);
  const audit = (st) => card("Audit history (fictional sample)", tl([
    ...(st === "supportclosed" ? [["lock", "Support access closed", "Fri, Oct 16 · 11:40 am ET · Nadia Haddad"]] : []),
    ...(st === "supportactive" || st === "supportclosed" ? [["key", "Support access granted · " + S.ref, "Fri, Oct 16 · 10:00 am ET · Nadia Haddad"]] : []),
    ["clock", "Maya Chen · TA access ended automatically", "Sun, Oct 18 · 11:59 pm ET · end date set by Dr. Diane Reyes"],
    ["x", "Elliot Grant · access revoked", "Wed, Oct 14 · 4:30 pm ET · Nadia Haddad"],
  ]) + btn("Export audit sample", { cls: "btn", icon: "download", note: "Creates a local CSV of this fictional history; nothing is sent anywhere" }));
  reg("S37", {
    states: [
      ["active", "Active", 0],
      ["expired", "Expired", 1],
      ["revoked", "Revoked", 2],
      ["supportactive", "Support access active", 3],
      ["supportclosed", "Support access closed", 4],
    ],
    url: (st) => "admin.whiteboard.example/alder-hill/people" + (st.startsWith("support") ? "/support-access/TS-2026-10482" : "/" + (personSel[st] || "").toLowerCase().replace(/[^a-z]+/g, "-")),
    web(st) {
      const right = `<div class="w-row">${btn("Review setup", { cls: "btn plain", go: "P50:review" })}${btn("Connections", { cls: "btn plain", go: "S38:aligned" })}</div>`;
      const sup = st.startsWith("support");
      return webAdmin({ nav: "people", who: NH, crumbs: crumbs("People, access & records"), url: this.url(st), body: webHead("People, access & records", "Alder Hill College · institution-scoped", right) + `<div class="w-grid"><div class="w-stack">${card("People", peopleTable(st), { flush: true })}${audit(st)}</div><div class="w-stack">${sup ? supportCard(st) : personCard(st)}${sup ? personCard("none") : supportCard(st)}${retention}${card("Related", `<ul class="w-list inset"><li>${link("Migration rehearsal", { cls: "title", go: "S39:accepted" })}<span class="meta">Record institution acceptance</span></li><li>${link("Trust & AI controls", { cls: "title", go: "S40:allowed" })}</li></ul>`)}</div></div>` });
    },
    ios(st) {
      const sup = st.startsWith("support");
      const p = D6.people.find((x) => x.name === (personSel[st] || "Dr. Diane Reyes"));
      const top = desktopNote("Institution-wide roster, policy and audit comparison work best on a computer.", "admin.whiteboard.example/alder-hill/people");
      if (sup) return iAdmin(NH, { tab: "people", title: "Support Access", back: ["People", "S37:active"], body: (st === "supportactive" ? notice("warning", "key", "Active · ends 2:00 PM", S.ref + " · read-only upload settings and log") : notice("neutral", "lock", "Closed early · 11:40 AM", "Can’t be used again.")) + group([ival("Who", "Vendor support"), ival("Purpose", S.ref), ival("Window", "10:00 AM – 2:00 PM")]) + (st === "supportactive" ? group([`<button type="button" class="rowbtn danger" data-go="S37:supportclosed">Close Support Access Now</button>`]) : "") });
      return iAdmin(NH, { tab: "people", large: "People", sub: "Alder Hill College", body: top + `<div class="i-field"><label for="i37-q">Search people</label><input id="i37-q" type="search" value="${st === "active" ? "" : esc(p.name)}"></div>` + group(D6.people.map((x) => row(x.name, x.role + " · " + (x.st === "active" ? "Active" : x.st === "expired" ? "Expired automatically" : "Revoked"), { go: x.st === "active" ? "S37:active" : "S37:" + x.st }))) + (st !== "active" ? group([row(p.name, esc(p.note))], { h: "Selected" }) : "") + group([row("Support Access", "None open", { go: "S37:supportactive" }), row("Retention", "Keep 5 years after term end")], { h: "Policies" }) });
    },
    notes: {
      active: { web: "Console: people table (sample), selected person’s role, affiliation and record source, audit history, temporary support access, retention choices and related consoles. Revoke is a separate, named action.", ios: "Desktop note, person search and compact policy summaries (desktop recommended)." },
      expired: { web: "Maya Chen’s TA access ended automatically at the date Dr. Reyes set; saved work kept and attributed; extensions are the instructor’s (S21), not changed here.", ios: "Selected person row explains the automatic end." },
      revoked: { web: "Elliot Grant revoked by the administrator with date, actor and reason; sessions ended; created records kept. Revoked and expired read differently in text.", ios: "Revoked row with reason." },
      supportactive: { web: "Time-limited vendor support access tied to technical request TS-2026-10482: who, purpose, scope, 4-hour window, what’s not included, and Close now. Audit records the grant.", ios: "Support Access detail with Close Support Access Now." },
      supportclosed: { web: "Closed early: who and when; the session can’t be reused; timeline shows grant, use and closure. A new request needs new approval.", ios: "Closed notice; read-only facts." },
    },
    a11y: ["Access status is text (‘Expired automatically’ vs ‘Revoked by administrator’), never colour alone.", "The selected table row uses aria-current.", "Destructive actions name their target and sit apart from neutral ones."],
  });

  /* ============ S38 CONNECTIONS & RECONCILIATION ============ */
  const X = D6.xfer;
  const connTable = table("Connection targets", ["System", "Authority", "Last check"], D6.conns.map(([n, a, t]) => [n, a, `${t}<div>${badge("sample")}</div>`]));
  const roster = (st) => {
    if (st !== "collision") return `<p>${badge("aligned", "Roster records agree · 1,284 of 1,284 sample rows")}</p>`;
    return `${notice("error", "merge", "Two records may be the same person", "Choose which record is canonical. Nothing merges until you choose.")}${table("Candidate records for Tomás Rivera", ["Candidate", "Source", "ID", "Course links"], [["Tomás Rivera", "Alder Hill student records (official)", "2026-1187", "PHYS 110 · enrolled"], ["Tomas Rivera", "Whiteboard invitation (local)", "wb-7781", "PHYS 110 · Problem Set 4 receipt AH-PHYS110-031"]])}<fieldset class="w-choice"><legend class="eyebrow">Canonical record</legend><div class="w-opt sel">${radio("w38-can", "w38-sis", "Student records 2026-1187 (recommended: official source)", true)}<span class="meta">The local record becomes an alias; its receipt and work move under 2026-1187 with history kept.</span></div><div class="w-opt">${radio("w38-can", "w38-loc", "Keep both — they are different people", false)}<span class="meta">Flags the local record for the Registrar; no change to official data.</span></div></fieldset>${btn("Confirm canonical record", { cls: "btn primary", go: "S38:retried" })}`;
  };
  const xferRows = (st) => {
    const r37 = st === "rejected" ? badge("rowRejected") : st === "retried" ? badge("rowAcked") : st === "validated" ? badge("validated") : badge("rowAcked");
    return table(X.name, ["Row", "Student", "Check", "Result"], [
      ["1–36", "36 students", "Validated", st === "validated" ? badge("validated") : badge("rowAcked")],
      ["37", st === "retried" ? "Tomás Rivera · 2026-1187" : "Tomas Rivera · wb-7781", st === "rejected" ? "Source: “Unknown student identifier wb-7781”" : st === "retried" ? "Rechecked after canonical choice" : "Validated", r37],
      ["38–43", "6 students", "Validated", st === "validated" ? badge("validated") : badge("rowAcked")],
      ["44", "1 student", "Excused · not sent", badge("excused")],
    ]);
  };
  const xferCard = (st) => {
    const top = st === "validated" ? notice("info", "checklist", "Sample transfer validated · not sent", "43 rows pass checks; 1 excused row is never sent. Sending asks the student records system to acknowledge; it decides.", btn("Send for acknowledgment", { cls: "btn", note: "Sends the sample; each row then shows the source’s answer" })) : st === "rejected" ? notice("error", "x", "1 row rejected by the source", "Row 37 uses a local ID the student records system doesn’t know. Released feedback in Whiteboard is unchanged.", btn("Resolve the record", { cls: "btn", go: "S38:collision" }) + btn("Retry rejected rows", { cls: "btn plain", go: "S38:retried" })) : st === "retried" ? notice("success", "check-circle", "Row 37 rechecked and acknowledged", "Retried Thu, Oct 22 · 10:05 am ET by Owen Park after choosing 2026-1187 as canonical. 43 of 43 sent rows acknowledged.") : "";
    return card("Grade transfer", top + `<p class="meta" style="margin:8px 0">Sent ${X.sent} from release R1 (S20). Whiteboard shows the source’s answer per row; it never marks a grade official itself.</p>` + xferRows(st) + btn("Export transfer report", { cls: "btn plain", icon: "download", note: "Local CSV of this fictional sample" }));
  };
  reg("S38", {
    states: [
      ["aligned", "Aligned", 0],
      ["collision", "Collision", 1],
      ["validated", "Validated", 2],
      ["rejected", "Rejected", 3],
      ["retried", "Retried", 4],
    ],
    url: (st) => "admin.whiteboard.example/alder-hill/connections" + (st === "collision" ? "/roster/collisions/2026-1187" : st === "aligned" ? "" : "/transfers/phys-110-ps4-r1"),
    web(st) {
      const right = `<div class="w-row">${btn("Import exceptions", { cls: "btn plain", go: "S39:exceptions" })}${btn("Affected access records", { cls: "btn plain", go: "S37:active" })}</div>`;
      return webAdmin({ nav: "connections", who: OP, crumbs: crumbs("Connections"), url: this.url(st), body: webHead("Connections & reconciliation", "Official sources stay authoritative · sample data", right) + `<div class="w-grid"><div class="w-stack">${card("Roster reconciliation", roster(st))}${st === "aligned" || st === "collision" ? "" : xferCard(st)}</div><div class="w-stack">${card("Connection targets", connTable, { flush: true })}${st === "aligned" || st === "collision" ? card("Grade transfer", `<p>${badge("rowAcked", "PHYS 110 PS4 R1 · 43 of 43 acknowledged")}</p>${link("Open transfer", { go: "S38:validated" })}`) : ""}</div></div>` + conceptNote("Concept: these are connection targets and fictional sample refreshes. No production connectivity is claimed.") });
    },
    ios(st) {
      const top = desktopNote("Comparing source rows, candidate matches and transfer errors works best on a computer.", "admin.whiteboard.example/alder-hill/connections");
      const items = st === "aligned" ? [row("No open exceptions", "Roster and transfers agree", { lead: ic("check-circle") })] : st === "collision" ? [row("Tomás Rivera · 2 records", "Choose canonical on a computer", { lead: ic("merge"), trail: badge("collision", "Decide") })] : st === "validated" ? [row("PHYS 110 PS4 R1", "43 rows validated · not sent", { lead: ic("checklist") })] : st === "rejected" ? [row("Row 37 · Tomas Rivera", "Unknown student identifier wb-7781", { lead: ic("x"), trail: badge("rowRejected", "Rejected"), go: "S38:collision" })] : [row("Row 37 · Tomás Rivera", "Rechecked · acknowledged", { lead: ic("check-circle") })];
      return iAdmin(OP, { tab: "connections", large: "Exceptions", sub: "Connections & reconciliation", body: top + group(items, { h: "Inbox" }) + group(D6.conns.map(([n, , t]) => row(n, t)), { h: "Targets · sample" }) + group([row("Import Exceptions", "", { go: "S39:exceptions" })]) });
    },
    notes: {
      aligned: { web: "Roster records agree; transfer summary acknowledged; each connection target names its authority and last sample check with a ‘Sample refresh · not live’ badge.", ios: "Exception inbox with no open items; targets listed." },
      collision: { web: "Two candidate records for Tomás Rivera: official 2026-1187 vs local invitation wb-7781 (which holds a PS4 receipt). The recommended canonical choice is the official source; the alternative flags for the Registrar. Nothing merges until confirmed; history kept.", ios: "Collision row; the decision is made on a computer." },
      validated: { web: "Grade transfer from S20’s release R1: 43 rows validated, 1 excused never sent; status ‘Validated · not sent’. Sending asks the source to acknowledge — it decides.", ios: "Validated row." },
      rejected: { web: "Source rejects row 37 with its reason quoted. Released feedback in Whiteboard is unchanged; routes to resolve the record (collision) or retry.", ios: "Rejected row opens the collision record." },
      retried: { web: "After the canonical choice, row 37 rechecked and acknowledged; who retried and when; 43 of 43 acknowledged.", ios: "Acknowledged row." },
    },
    a11y: ["Per-row results are text badges; the source’s rejection reason is quoted in the row.", "Candidate records are a table with a caption; the choice is a fieldset with a legend.", "‘Sample refresh · not live’ is a visible label, not a tooltip."],
  });

  /* ============ S39 MIGRATION REHEARSAL ============ */
  const ITEMS = [
    ["12 modules", "Modules", "mapped"],
    ["9 assignments", "Assignments (due dates shifted to Spring 2027)", "mapped"],
    ["6 quizzes · 3 use question pools", "Quizzes", "pool"],
    ["Weighted grade categories", "Gradebook categories", "mapped"],
    ["“Lab simulator” external tool", "No equivalent", "tool"],
    ["214 files", "Course files", "mapped"],
    ["Student submissions and grades", "Not migrated (learner records stay in the source)", "learner"],
  ];
  const itemRow = (st, [src, dest, k]) => {
    const open = st === "unmapped" || st === "exceptions";
    const res = k === "learner" ? badge("notMigrated") : k === "mapped" ? badge("mapped") : open ? badge(k === "pool" && st === "exceptions" ? "mapped" : "unmapped", k === "pool" && st === "exceptions" ? "Mapped · fixed question sets" : "") : badge("mapped", k === "pool" ? "Mapped · fixed question sets" : "Placeholder page");
    return [src, k === "tool" && !open ? "Placeholder page (instructor chooses later)" : k === "pool" && st !== "unmapped" ? "Quizzes · fixed question sets" : dest, res];
  };
  const fpLine = (st) => (st === "unmapped" ? "No preview yet" : st === "stale" ? `<span class="w-diff"><s>${M.fp}</s>${ic("chev-r")}${M.fp2}</span>` : M.fp);
  reg("S39", {
    states: [
      ["unmapped", "Unmapped", 0],
      ["current", "Preview current", 1],
      ["exceptions", "Exceptions open", 2],
      ["accepted", "Accepted", 3],
      ["stale", "Stale", 4],
    ],
    url: (st) => "admin.whiteboard.example/alder-hill/migration/phys-110-fall-2025" + (st === "unmapped" ? "" : "/preview/" + (st === "stale" ? M.fp2 : M.fp)),
    web(st) {
      const head = webHead("Migration rehearsal", `${M.src} → ${M.dest}`, badge(st === "accepted" ? "pvAccepted" : st === "stale" ? "stale" : st === "current" ? "previewCurrent" : "attention"));
      const top = {
        unmapped: notice("warning", "alert", "2 source items need a decision", "Question pools and the “Lab simulator” tool have no direct equivalent. Prepare a preview after deciding."),
        current: notice("info", "eye", "Preview " + M.fp + " is current", "Every item has a mapping. Acceptance applies to this exact preview only.", btn("Accept preview " + M.fp, { cls: "btn primary", go: "S39:accepted" })),
        exceptions: notice("error", "alert", "1 exception blocks acceptance", "“Lab simulator” has no decision. Choose a placeholder, leave it out, or ask the instructor.", btn("Use a placeholder page", { cls: "btn", go: "S39:current" })),
        accepted: notice("success", "check", "Accepted · not applied", `Theo Lindgren accepted ${M.fp} · ${M.accepted}. This is a rehearsal: nothing has been applied to a live course.`, btn("Record institution acceptance", { cls: "btn", go: "S37:active" })),
        stale: notice("warning", "retry", "Acceptance no longer applies", `The source was re-exported ${M.reexport}. The new preview ${M.fp2} differs, so the acceptance of ${M.fp} doesn’t carry over.`, btn("Prepare new preview", { cls: "btn primary", go: "S39:current" })),
      }[st];
      const tableHtml = table("Source inventory and mappings", ["Source item", "Destination", "Status"], ITEMS.map((it) => itemRow(st, it)));
      const decide = st === "unmapped" ? card("Decide: question pools", `${radio("w39-pool", "w39-fixed", "Turn each pool into a fixed question set", true)}${radio("w39-pool", "w39-out", "Leave pooled quizzes out", false)}${btn("Prepare preview", { cls: "btn primary", go: "S39:exceptions", note: "Creates a preview with a fingerprint" })}`) : "";
      return webAdmin({ nav: "migration", who: TL, crumbs: crumbs("Migration rehearsal"), url: this.url(st), body: head + top + `<div class="w-grid" style="margin-top:14px"><div class="w-stack">${card("Mappings", tableHtml, { flush: true })}</div><div class="w-stack">${decide}${card("Preview", `<dl class="facts"><dt>Fingerprint</dt><dd>${fpLine(st)}</dd><dt>Acceptance</dt><dd>${st === "accepted" ? "Stored for " + M.fp : st === "stale" ? "Was for " + M.fp + " · not valid now" : "None"}</dd></dl>${btn("Export exception report", { cls: "btn plain", icon: "download", note: "Local file of this fictional rehearsal" })}`)}${handoff("S22", "Ask Dr. Diane Reyes to inspect the rehearsal copy in S22 Course copy; she decides course-level choices like the Lab simulator.")}</div></div>` + conceptNote("A rehearsal doesn’t imply a production migration occurred. Source and counts are fictional.") });
    },
    ios(st) {
      const top = desktopNote("Large mapping tables and cross-course exceptions are reviewed on a computer.", "admin.whiteboard.example/alder-hill/migration");
      const sum = { unmapped: "2 decisions needed", current: "Current · " + M.fp, exceptions: "1 exception blocks acceptance", accepted: "Accepted · not applied", stale: "Stale · source re-exported" }[st];
      const ex = ITEMS.filter(([, , k]) => k !== "mapped").map((it) => { const [s, d, b] = itemRow(st, it); return row(s, d, { trail: b }); });
      return iAdmin(TL, { tab: "migration", large: "Migration", sub: "PHYS 110 · Fall 2025 rehearsal", body: top + group([row("Status", sum), ival("Fingerprint", st === "stale" ? M.fp2 : st === "unmapped" ? "None" : M.fp)]) + group(ex, { h: "Exceptions" }) + (st === "accepted" ? group([row("Record Institution Acceptance", "", { go: "S37:active" })]) : "") });
    },
    notes: {
      unmapped: { web: "Inventory table maps each source item; question pools and an unsupported external tool need decisions. Learner submissions and grades are explicitly not migrated. No preview or fingerprint yet.", ios: "Desktop note; status and exception drill-down rows." },
      current: { web: "Every item mapped; preview fingerprint MIG-7C1E-04 shown; Accept names the exact fingerprint it applies to.", ios: "Current status with fingerprint." },
      exceptions: { web: "One open exception (Lab simulator) blocks acceptance with options matching S22’s unsupported-tool choices; the instructor handoff explains who decides course-level choices.", ios: "Exception rows say what each lacks." },
      accepted: { web: "Accepted · not applied: who, when, which fingerprint; it’s a rehearsal. Record institution acceptance goes to S37.", ios: "Accepted status; Record Acceptance row." },
      stale: { web: "Source re-exported: fingerprint old → new; acceptance of the old preview doesn’t carry over; Prepare new preview is primary.", ios: "Stale status with the new fingerprint." },
    },
    a11y: ["The fingerprint change is written ‘was → now’ with strikethrough plus text, not colour.", "Mapping results are text badges in a captioned table.", "Accept names the fingerprint in its label, so a screen reader hears exactly what is accepted."],
  });

  /* ============ S40 TRUST & AI CONTROLS ============ */
  const aiOn = (st) => st !== "disabled";
  reg("S40", {
    states: [
      ["allowed", "AI drafting allowed", 0],
      ["disabled", "AI drafting off", 1],
      ["exitpreview", "Exit preview ready", 2],
      ["exported", "Export prepared", 3],
      ["changed", "Control changed", 4],
    ],
    url: (st) => "admin.whiteboard.example/alder-hill/trust" + (st === "exitpreview" || st === "exported" ? "/exit" : ""),
    web(st) {
      const ai = card("AI drafting help", `${toggle("w40-ai", "Allow optional AI drafting help for instructors", aiOn(st), { sub: "Off-by-default per course. Instructors choose; students’ work is never sent without the course policy allowing it.", note: aiOn(st) ? "Turning off shows a confirmation naming the 6 courses using it" : "Turning on doesn’t switch it on in any course" })}<p style="margin-top:8px">${badge(aiOn(st) ? "aiOn" : "aiOff")}</p><p class="meta" style="margin-top:6px">${aiOn(st) ? "A course’s stricter rule always wins: PHYS 110 is “Limited” — the institution setting never overrides it." : "Optional drafting help is unavailable in every course. Existing feedback and grades are unchanged."}</p>${aiOn(st) ? handoff("S17", "Instructors see drafting help as an optional, clearly labelled aid while grading in S17; they write and release the feedback.") : ""}`);
      const desc = card("Data use and accessibility", `<ul class="w-list inset"><li>${ic("shield")}<div class="grow"><span class="title">Data use</span><div class="meta">Course content and student work are used to run Alder Hill’s courses only. Describes intended controls; not a legal assessment.</div></div></li><li>${ic("eye")}<div class="grow"><span class="title">Accessibility</span><div class="meta">Design targets WCAG 2.2 AA. Not audited or certified; known gaps are listed in the design notes.</div></div></li><li>${ic("plug")}<div class="grow">${link("Standards and connection status", { cls: "title", go: "S38:aligned" })}<div class="meta">Connection targets · sample only</div></div></li></ul>`);
      const exit = st === "exitpreview" ? card("Portable exit preview", `${notice("info", "eye", "Exit preview ready", "Inspect exactly what a portable export would contain before preparing it.")}${table("Export scope (sample)", ["Included", "Format", "Count"], [["Course content and files", "Open formats (HTML, original files)", "3 courses · 231 items"], ["Released grades and feedback", "CSV + feedback text", "44 learners"], ["Receipts", "CSV with original timestamps", "52 receipts"], ["Audit history", "CSV", "128 entries"]])}<p class="meta" style="margin-top:6px">Not included: drafts never released, staff-only notes, other institutions’ data.</p>${btn("Export portable sample", { cls: "btn primary", go: "S40:exported" })}`) : st === "exported" ? card("Portable exit", notice("success", "download", "Sample prepared · local file", "alder-hill-portable-sample.zip prepared Thu, Oct 15 · 4:20 pm ET by Owen Park. Fictional data; saved on this computer only.")) : card("Portable exit", `<p class="meta">Prepare a preview to inspect the export scope first.</p>${btn("Prepare exit preview", { cls: "btn", go: "S40:exitpreview" })}`);
      const log = card("Control history (illustrative)", tl([...(st === "changed" || st === "disabled" ? [["x", "AI drafting help turned off", "Thu, Oct 15 · 3:55 pm ET · Owen Park · “Pause while faculty senate reviews guidance”"]] : []), ...(st === "exported" ? [["download", "Portable sample prepared", "Thu, Oct 15 · 4:20 pm ET · Owen Park"]] : []), ["sparkle", "AI drafting help allowed", "Mon, Sep 1 · 9:00 am ET · Owen Park"]]));
      const banner = st === "changed" ? notice("success", "history", "Control changed · audit entry recorded", "AI drafting help turned off Thu, Oct 15 · 3:55 pm ET by Owen Park. 6 courses lose the optional aid; no feedback or grades change.") : "";
      return webAdmin({ nav: "trust", who: OP, crumbs: crumbs("Trust & AI controls"), url: this.url(st), body: webHead("Trust & AI controls", "Inspectable intentions · no certification claimed") + banner + `<div class="w-grid"${banner ? ' style="margin-top:14px"' : ""}><div class="w-stack">${ai}${exit}</div><div class="w-stack">${desc}${log}</div></div>` + conceptNote("These controls are illustrative. They don’t establish legal compliance, certification or operational proof.") });
    },
    ios(st) {
      const top = desktopNote("Policy scope, export contents and audit history are reviewed together on a computer.", "admin.whiteboard.example/alder-hill/trust");
      const ai = `<li>${K.iswitch("i40-ai", "AI Drafting Help", aiOn(st), { sub: aiOn(st) ? "Allowed · course rules apply" : "Off in every course", note: "Opens a review sheet before changing" })}</li>`;
      const sheet = st === "changed" ? K.sheet("Turn Off AI Drafting Help?", "6 courses lose the optional aid", group([row("Feedback and grades", "Unchanged"), row("Audit entry", "Recorded with your name and reason")]) + btn("Turn Off", { cls: "i-btn", go: "S40:disabled" }), "Cancel") : "";
      return iAdmin(OP, { tab: "trust", large: "Controls", sub: "Trust & AI · Alder Hill", body: top + `<ul class="i-group">${ai}</ul>` + group([row("Portable Exit", st === "exitpreview" ? "Preview ready" : st === "exported" ? "Sample prepared · local" : "Not prepared", { go: st === "exported" ? null : "S40:exitpreview" }), row("Connections", "Sample only", { go: "S38:aligned" })]) + group([row("Last change", st === "changed" || st === "disabled" ? "AI help off · Oct 15 · Owen Park" : "AI help allowed · Sep 1")], { foot: "Illustrative controls; no certification claimed." }), sheet });
    },
    notes: {
      allowed: { web: "AI drafting allowed at institution level, but each course’s stricter policy wins (PHYS 110 ‘Limited’). Instructors meet it in S17 as an optional aid (handoff). Data-use and accessibility are described as intentions, not claims.", ios: "Read-first control summary with a switch that opens a review sheet." },
      disabled: { web: "Off: optional help unavailable everywhere; existing feedback and grades unchanged.", ios: "Switch off with ‘Off in every course’." },
      exitpreview: { web: "Exit preview lists export scope by category, format and count, and what’s excluded, before anything is prepared.", ios: "Portable Exit row says preview ready." },
      exported: { web: "Portable sample prepared as a local file with who and when; fictional data; nothing sent.", ios: "Row says ‘Sample prepared · local’." },
      changed: { web: "Banner confirms the change and audit entry with actor, time, reason and impact (6 courses lose the aid; nothing else changes). History lists it first.", ios: "Review sheet before the change names its impact and the audit entry." },
    },
    a11y: ["The AI switch has role=switch with aria-checked and a visible label; its effect is in adjacent text.", "Certification-free wording is visible body text, not fine print only.", "History entries carry actor, time and reason in text."],
  });
})();
