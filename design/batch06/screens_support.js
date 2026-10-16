/* Batch 06 student support: S34 get support (Aisha, student shell), S35 advising context and referral
   (Dr. Diane Reyes, teaching workspace), S36 support follow-through (Jamal Wright, Learning Commons
   support desk; Aisha’s student-safe view). A request is not an appointment; a referral shares only
   named facts, never grades or private notes; staff notes and the student-safe status are separate
   views of one case (D50–D53). */
(function () {
  "use strict";
  const K = window.K;
  const { D6, ic, esc, badge, btn, link, notice, card, webHead, web, webStaff, webSupport, ios, group, row, ival, field, radio, table, tl, checks, handoff, boundary } = K;
  const reg = K.reg;
  const A = D6.aisha, R = D6.ref, Q = D6.req, JW = D6.jamal;
  const iStudent = (o) => ios({ tabs: K.STUDENTTABS, tab: "campus", ...o });
  const iStaff = (o) => ios({ tabs: K.STAFFTABS, tab: "teaching", trail: K.iStaffAvatar, ...o });
  const iDesk = (o) => ios({ tabs: K.SUPTABS, tab: "queue", trail: K.iWho(JW), ...o });
  const svc = (id) => D6.services.find((s) => s.id === id);

  /* ============ S34 GET SUPPORT ============ */
  const svcList = (cur) => `<ul class="w-list inset" aria-label="Support services">${D6.services.map((s) => `<li class="${s.id === cur ? "sel" : ""}">${ic(s.id === "care" || s.id === "access" ? "external" : "support")}<div class="grow">${link(s.name, { cls: "title", go: s.id === "phys" ? "S34:selected" : null, note: s.id === "phys" ? "" : s.how === "Walk in" ? "Shows hours and location; nothing to request" : s.id === "advise" ? "Same request pattern as Physics learning support" : "Opens the service’s own site in a new tab; Whiteboard shares nothing", current: s.id === cur })}<div class="meta">${s.who} · ${s.what}</div></div></li>`).join("")}</ul>
<p class="meta" style="margin-top:10px">${ic("help")} Problem with Whiteboard itself? ${link("Technical help", { go: "P46:selfservice" })} is separate from academic support.</p>`;
  const shareChoice = (st, p) => {
    const need = st === "selected";
    return `<fieldset class="w-choice${need ? " need" : ""}"><legend class="eyebrow">What to share with Learning Commons (required)</legend>
<div class="w-opt">${radio(`${p}-share`, `${p}-only`, "Request only", false, { describedby: need ? `${p}-share-h` : "" })}<span class="meta">Your name, student email and this request. Nothing from your courses.</span></div>
<div class="w-opt">${radio(`${p}-share`, `${p}-ctx`, "Include PHYS 110 context", false, { describedby: need ? `${p}-share-h` : "" })}<span class="meta">Adds the course name, instructor and the topic you write below. Never your grades, submissions, feedback or allowances.</span></div>
<p class="meta" id="${p}-share-h">${ic("info")} Choose before you send. You can change it until Learning Commons replies.</p></fieldset>`;
  };
  const statusCard34 = (st) => {
    if (st === "requested") return card("Your request", `<p>${badge("supRequested")}</p><dl class="facts" style="margin-top:10px"><dt>Reference</dt><dd>${Q.ref}</dd><dt>Service</dt><dd>Physics learning support</dd><dt>Topic</dt><dd>${Q.topic}</dd><dt>Shared</dt><dd>PHYS 110 context (your choice)</dd></dl>${tl([["send", "Request sent", Q.at + " · by you"], ["reply", "Learning Commons replied", Q.reply + " · “A tutor will offer two times by Fri, Oct 16.”"], ["hourglass", "Next: Learning Commons offers times", "Nothing is booked until you pick a time and they confirm it"]])}<div class="w-row" style="margin-top:12px">${btn("Follow this request", { cls: "btn", go: "S36:student" })}${btn("Cancel request", { cls: "btn plain danger", go: "S34:cancelled" })}</div>`);
    if (st === "cancelled") return card("Your request", `<p>${badge("supCancelled")}</p>${notice("neutral", "x", "Request " + Q.ref + " is closed", "Cancelled by you · Thu, Oct 15 · 9:05 am ET. Learning Commons was told; no times were held for you. The closed request stays in your history.")}${btn("Request again", { cls: "btn", go: "S34:selected" })}`);
    if (st === "referral") return card("Referral from Dr. Diane Reyes", `<p>${badge("refActive")}</p><p class="meta" style="margin-top:6px">${R.at} · to ${R.to}</p><blockquote class="w-quote"><span>“${R.note}”</span></blockquote>${boundary(["Course: PHYS 110", "Fact: " + R.fact, "Your name and student email"], ["Grades, scores and feedback", "Submissions and attendance", "Private notes from staff"], "What Dr. Reyes shared")}<p class="meta" style="margin-top:8px">Learning Commons accepted it · Jamal Wright will offer times by Fri, Oct 23. Declining is fine; Dr. Reyes isn’t told why.</p><div class="w-row" style="margin-top:12px">${btn("Follow this referral", { cls: "btn primary", go: "S36:student" })}${btn("Decline", { cls: "btn plain", note: "Closes the referral for you; the service records ‘declined by student’ without a reason" })}</div>${handoff("S35", "Want an adviser or instructor to refer you with course context instead? Ask them; they create it in S35 and you see exactly what they shared.")}`);
    if (st === "browsing") return card("", `<div class="w-empty">${ic("support")}<div><b>Choose a service to see how it works</b><p class="meta">Each service says what you can request and what would be shared before anything is sent.</p></div></div>`, { label: "Request" });
    // selected
    const s = svc("phys");
    return card("Physics learning support", `<p class="meta">${s.who} · ${s.what}</p>${shareChoice(st, "w34")}${field({ id: "w34-topic", label: "What would you like help with?", type: "textarea", value: Q.topic, hint: "Shared only if you include PHYS 110 context." })}${field({ id: "w34-when", label: "Times that usually work", value: "Weekday afternoons after 3:00 pm" })}<div class="w-row" style="margin-top:12px">${btn("Request appointment", { cls: "btn primary", disabled: true, describedby: "w34-share-h", note: "Choose what to share first" })}</div><p class="meta" style="margin-top:8px">A request isn’t an appointment. Learning Commons offers times; nothing is booked until they confirm.</p>`);
  };
  reg("S34", {
    states: [
      ["browsing", "Browsing", 0],
      ["selected", "Sharing choice required", 1],
      ["requested", "Requested", 2],
      ["cancelled", "Cancelled", 3],
      ["referral", "Referral active", 4],
    ],
    url: (st) => "app.whiteboard.example/support" + (st === "browsing" ? "" : st === "referral" ? "/referrals/REF-2026-0147" : st === "selected" ? "/physics-learning-support" : "/requests/LC-2291"),
    web(st) {
      const cur = st === "browsing" ? "" : "phys";
      return web({ nav: "support", crumbs: [["Campus", "S28:published"], ["Support"]], url: this.url(st), body: webHead("Get support", "Academic and student services at Alder Hill · you decide what’s shared") + `<div class="w-grid">${card("Services", svcList(cur))}${statusCard34(st)}</div>` });
    },
    ios(st) {
      const back = ["Campus", "S28:published"];
      if (st === "browsing") return iStudent({ large: "Support", sub: "Academic and student services", back, trail: K.iAvatar, body: group(D6.services.map((s) => row(s.name, s.who + " · " + s.how, { lead: ic(s.id === "care" || s.id === "access" ? "external" : "support"), go: s.id === "phys" ? "S34:selected" : null, note: s.id === "phys" ? "" : "Shows the service; external services open their own site" }))) + group([row("Problem with the app?", "Technical help is separate", { lead: ic("help"), go: "P46:selfservice" })]) });
      if (st === "selected") {
        const sh = K.sheet("Request Physics Support", "Learning Commons · 45-minute session", `<fieldset class="i-group-form"><legend class="i-h">What to Share (Required)</legend>${radio("i34-share", "i34-only", "Request only — name, email, this request", false, { describedby: "i34-why" })}${radio("i34-share", "i34-ctx", "Include PHYS 110 context — course, instructor, your topic", false, { describedby: "i34-why" })}</fieldset>${K.ifield("i34-topic", "Topic", Q.topic)}<p class="i-foot" id="i34-why">Choose what to share first. Grades, submissions and feedback are never shared.</p>` + btn("Send Request", { cls: "i-btn", disabled: true, describedby: "i34-why", note: "Choose what to share first" }), "Cancel");
        return iStudent({ title: "Physics Learning Support", back: ["Support", "S34:browsing"], body: `<div class="i-card"><p>${esc(svc("phys").what)}</p></div>`, sheet: sh });
      }
      if (st === "requested") return iStudent({ title: Q.ref, back: ["Support", "S34:browsing"], body: `<p>${badge("supRequested")}</p><div style="height:10px"></div>` + group([ival("Service", "Physics"), ival("Shared", "PHYS 110 context"), row("Learning Commons replied", Q.reply + " · a tutor will offer two times by Fri, Oct 16")], { foot: "Nothing is booked until you pick a time and they confirm." }) + group([row("Follow This Request", "", { go: "S36:student" }), `<button type="button" class="rowbtn danger" data-go="S34:cancelled">Cancel Request</button>`]) });
      if (st === "cancelled") return iStudent({ title: Q.ref, back: ["Support", "S34:browsing"], body: notice("neutral", "x", "Request closed", "Cancelled by you · Thu, Oct 15 · 9:05 AM. Learning Commons was told. The closed request stays in your history.") + group([row("Request Again", "", { go: "S34:selected" })]) });
      return iStudent({ title: "Referral", back: ["Support", "S34:browsing"], body: `<p>${badge("refActive")}</p><div class="i-card" style="margin-top:10px"><p class="meta">Dr. Diane Reyes · ${R.at}</p><p>“${R.note}”</p></div>` + group([row("Shared", "PHYS 110 · " + esc(R.fact)), row("Never shared", "Grades, submissions, attendance, private notes")], { h: "What Dr. Reyes Shared" }) + group([row("Follow This Referral", "Accepted · times by Fri, Oct 23", { go: "S36:student" }), row("Decline", "No reason needed", { note: "Closes the referral for you; Dr. Reyes isn’t told why" })]) });
    },
    notes: {
      browsing: { web: "Service list beside an empty request panel. Each service says who runs it and how it works; confidential and accommodation services open their own sites and Whiteboard shares nothing. Technical help (P46) is a separate link, not a service.", ios: "Support lives under the Campus tab (D50) with service rows; external services are marked; technical help is a separate row." },
      selected: { web: "Choosing Physics learning support shows the sharing choice first, with no default. Request appointment is disabled and described by the hint until a choice is made. The topic field says it’s shared only with course context.", ios: "Request sheet: required sharing radios with no default, topic field, Send disabled with the reason." },
      requested: { web: "Request LC-2291 is ‘Requested · not scheduled’: reference, service, topic and the sharing choice in words; timeline names Learning Commons’ reply and who owns the next step. Cancel is available until confirmation.", ios: "Request detail with the same facts; Cancel Request as a destructive row." },
      cancelled: { web: "Closed request: who cancelled, when, that the service was told, and that no time was held. History kept; Request again starts a new request.", ios: "Neutral notice and Request Again." },
      referral: { web: "Dr. Reyes’s referral shows her student-visible note, exactly what was shared and what never is, the service’s acceptance and next-step owner. Booking stays the student’s choice; Decline needs no reason. Following it opens S36’s student view.", ios: "Referral detail: note card, shared/never-shared rows, Follow and Decline." },
    },
    a11y: ["The sharing choice is a fieldset with a legend and no default; the disabled Request button is described by the hint.", "Shared/never-shared lists carry hidden ‘Shared:’/‘Not shared:’ prefixes — not icons alone.", "Status badges always pair icon and words; timelines are ordered lists in reading order."],
  });

  /* ============ S35 ADVISING CONTEXT AND REFERRAL ============ */
  const RD = D6.reyes;
  const preview35 = (fact, note) => `<div class="w-stack">${card("What Aisha sees", `<p class="meta">Referral from Dr. Diane Reyes · PHYS 110</p><blockquote class="w-quote"><span>“${note || "—"}”</span></blockquote><p class="meta">Shared: course, this fact, her name and email. She chooses whether to book.</p>`)}${card("What Learning Commons sees", `<dl class="facts"><dt>Student</dt><dd>Aisha Rahman</dd><dt>Course</dt><dd>PHYS 110</dd><dt>Fact</dt><dd>${fact || "—"}</dd><dt>Referred by</dt><dd>Dr. Diane Reyes</dd></dl>`)}</div>`;
  const form35 = (st, p) => {
    const inv = st === "invalid";
    return `<div class="w-form one">${field({ id: `${p}-who`, label: "Student", value: "Aisha Rahman · PHYS 110 (enrolled)", readonly: true })}${field({ id: `${p}-to`, label: "Send to", type: "select", req: true, value: inv ? "Choose a service" : R.to, options: ["Choose a service", R.to, "Academic advising · College of Science", "Math & Science Tutoring Center · Learning Commons"], err: inv ? "Choose where this referral goes." : "" })}${field({ id: `${p}-fact`, label: "What happened (fact only)", type: "textarea", req: true, value: R.fact, hint: "Describe something observed. No grades, scores, diagnoses or predictions." })}${field({ id: `${p}-note`, label: "Note Aisha will see", type: "textarea", req: true, value: inv ? "" : R.note, err: inv ? "Write the note Aisha will see. Referrals are never sent without one." : "" })}</div>`;
  };
  reg("S35", {
    states: [
      ["draft", "Draft", 0],
      ["invalid", "Invalid", 1],
      ["received", "Received", 2],
      ["corrected", "Corrected", 3],
      ["restricted", "Restricted", 4],
    ],
    url: (st) => "app.whiteboard.example/teach/phys-110/people/aisha-rahman/referral" + (["received", "corrected"].includes(st) ? "/REF-2026-0147" : "/new"),
    web(st) {
      const crumbs = [["Teaching", "S14:published"], ["PHYS 110", "S14:published"], ["People", "S21:active"], ["Referral"]];
      if (st === "restricted") return webStaff({ tool: "people", crumbs, who: { ...D6.maya, role: "Teaching assistant" }, url: this.url(st), body: webHead("Refer to support", "PHYS 110 · Aisha Rahman") + card("", `${notice("neutral", "lock", "You can’t create referrals in PHYS 110", "Teaching assistants don’t have referral permission here. Dr. Diane Reyes (instructor) or an academic adviser can. Nothing about this student beyond the course roster is shown.")}<div class="w-row" style="margin-top:12px">${btn("Ask Dr. Diane Reyes", { cls: "btn", note: "Opens a course message to the instructor; you choose what to say" })}${link("Who can refer", { go: "S21:active" })}</div>`) });
      if (st === "received" || st === "corrected") {
        const cor = st === "corrected";
        const hist = tl([["send", "Created and sent to " + R.to, R.at + " · Dr. Diane Reyes"], ["check-circle", "Received in Learning Commons queue as " + R.caseId, R.at], ...(cor ? [["history", "Fact corrected", R.corrected + " · Dr. Diane Reyes · “Removed the mention of Problem Set 4 feedback”"]] : [])]);
        const facts = `<dl class="facts"><dt>Reference</dt><dd>${R.ref}</dd><dt>Status</dt><dd>${badge("refReceived")}${cor ? " " + badge("corrected") : ""}</dd><dt>Fact</dt><dd>${cor ? `${R.fact}<div class="meta">Was: <s>${R.factV1}</s></div>` : R.factV1}</dd><dt>Aisha sees</dt><dd>“${R.note}”</dd></dl>`;
        const body = `<div class="w-grid"><div class="w-stack">${card("Referral " + R.ref, facts + `<div class="w-row" style="margin-top:12px">${cor ? "" : btn("Correct referral", { cls: "btn", go: "S35:corrected" })}</div>`)}${card("History", hist)}</div><div class="w-stack">${cor ? notice("info", "history", "Correction recorded", "Learning Commons and Aisha now see the corrected fact. The earlier wording is kept in this history, not shown to Aisha.") : notice("success", "check-circle", "Received by Learning Commons", "Case " + R.caseId + " is in their queue. What happens next is theirs to decide and record.")}${handoff("S36", "Learning Commons follows this up in S36 Support follow-through. You’ll see its student-safe status, not their staff notes.")}</div></div>`;
        return webStaff({ tool: "people", crumbs, url: this.url(st), body: webHead("Referral for Aisha Rahman", "PHYS 110 · Physics learning support") + body });
      }
      const inv = st === "invalid";
      const top = inv ? notice("error", "alert", "2 things to fix before sending", `${link("Choose where this referral goes", { note: "Moves focus to Send to" })} · ${link("Write the note Aisha will see", { note: "Moves focus to the note" })}`) : notice("warning", "pencil", "Draft · not shared", "Nothing has been sent to Aisha or Learning Commons.");
      const body = top + `<div class="w-grid">${card("Referral", form35(st, "w35") + boundary(D6.shared, D6.notShared) + `<div class="w-row" style="margin-top:12px">${btn("Send referral", { cls: "btn primary", disabled: inv, describedby: inv ? "w35-to-e w35-note-e" : "", go: inv ? null : "S35:received", note: inv ? "Fix the 2 errors first" : "" })}${btn("Discard draft", { cls: "btn plain", note: "Deletes the draft; nothing was shared" })}</div>`)}${preview35(R.fact, inv ? "" : R.note)}</div>`;
      return webStaff({ tool: "people", crumbs, url: this.url(st), body: webHead("Refer Aisha Rahman to support", "Started from PHYS 110 · facts only · previewed before sending", badge(inv ? "blocked" : "refDraft")) + body });
    },
    ios(st) {
      const back = ["Aisha", "S21:active"];
      if (st === "restricted") return ios({ tabs: K.STAFFTABS, tab: "teaching", trail: K.iWho(D6.maya), title: "Refer to Support", back, body: notice("neutral", "lock", "No referral permission", "Teaching assistants can’t create referrals in PHYS 110. Dr. Diane Reyes or an adviser can.") + group([row("Ask Dr. Diane Reyes", "Course message", { note: "Opens a course message to the instructor" })]) });
      if (st === "received" || st === "corrected") {
        const cor = st === "corrected";
        return iStaff({ title: R.ref, back, body: `<p>${badge("refReceived")}${cor ? " " + badge("corrected") : ""}</p><div style="height:10px"></div>` + group([row("Fact", esc(cor ? R.fact : R.factV1)), row("Aisha Sees", esc(R.note)), ival("Service Case", R.caseId)], { foot: cor ? "Earlier wording kept in history; not shown to Aisha." : "Learning Commons follows up in S36; you see its student-safe status." }) + (cor ? "" : group([row("Correct Referral", "", { go: "S35:corrected" })])) + `<p class="i-foot" data-handoff="S36">The receiving service owns the next step (S36).</p>` });
      }
      const inv = st === "invalid";
      const sh = K.sheet("Review Before Sending", "Exactly what each person sees", group([row("Aisha Sees", "PHYS 110 · your note · she chooses whether to book"), row("Learning Commons Sees", "Name, email, PHYS 110, the fact"), row("Never Shared", "Grades, submissions, attendance, allowances, private notes")]) + btn("Send Referral", { cls: "i-btn", go: "S35:received" }), "Back to Edit");
      return iStaff({ title: "Refer to Support", back, body: (inv ? notice("error", "alert", "2 things to fix", "Choose a service · write the note Aisha will see") : notice("warning", "pencil", "Draft · not shared", "")) + `<div class="i-group-form">${K.ifield("i35-to", "Send To", inv ? "" : "Physics learning support", { err: inv ? "Choose a service." : "" })}${K.ifield("i35-fact", "Fact Only", R.fact)}${K.ifield("i35-note", "Note Aisha Sees", inv ? "" : R.note, { err: inv ? "Write the note Aisha will see." : "" })}</div>`, bottom: btn("Review", { cls: "i-btn", disabled: inv, note: inv ? "Fix the 2 errors first" : "Opens the final review sheet" }), sheet: st === "draft" ? sh : "" });
    },
    notes: {
      draft: { web: "Editor beside two previews — what Aisha sees and what Learning Commons sees — and an explicit shared / never-shared boundary. The fact field asks for observation only; grades, scores, diagnoses and risk labels are excluded by design (D52).", ios: "Form stack; the final review sheet lists exactly what each recipient sees before Send." },
      invalid: { web: "Missing destination and student-visible note: field errors, a linked summary, Send disabled and described by both errors. The previews show ‘—’ instead of guessing.", ios: "Inline field errors and summary; Review disabled." },
      received: { web: "Read-only record: reference, case number in the receiving queue, the fact and note as sent, and history. Next steps belong to Learning Commons (handoff to S36, not a link).", ios: "Record rows; handoff note in words." },
      corrected: { web: "The original wording mentioned Problem Set 4 feedback; the correction removes it. Corrected fact shown with the old wording struck through for the referrer only; history records who and when; recipients see the corrected text.", ios: "Corrected badge; earlier wording kept in history, not shown to the student." },
      restricted: { web: "Maya Chen (TA) lacks referral permission: neutral notice names who can refer, shows nothing beyond the roster, and offers a message to the instructor.", ios: "Locked notice and Ask Dr. Diane Reyes row." },
    },
    a11y: ["Error summary links move focus to each field; Send is aria-disabled and described by both errors.", "Struck-through earlier wording is labelled ‘Was:’ in text so it isn’t conveyed by strikethrough alone.", "Previews are headed regions so a screen reader can compare recipient views."],
  });

  /* ============ S36 SUPPORT FOLLOW-THROUGH ============ */
  const safe36 = {
    received: "Learning Commons has your referral and will assign a tutor.",
    accepted: "Accepted · Jamal Wright will offer you two times by Fri, Oct 23.",
    redirected: "Moved to Math & Science Tutoring Center · drop in Mon–Thu 3:00–6:00 pm, Keene Center 105.",
    unassigned: "Learning Commons has your referral and will assign a tutor.",
    resolved: "Complete · you met with a tutor on Mon, Oct 26. Request another session any time.",
  };
  const stat36 = { received: "caseNew", accepted: "caseOwned", redirected: "caseMoved", unassigned: "caseNew", resolved: "caseResolved" };
  const hist36 = (st) => {
    const h = [["check-circle", "Received from Dr. Diane Reyes (REF-2026-0147)", R.at]];
    if (st !== "received") h.push(["person", "Accepted by Jamal Wright", "Thu, Oct 22 · 9:00 am ET"]);
    if (st === "redirected") h.push(["swap", "Redirected to Math & Science Tutoring Center", "Thu, Oct 22 · 2:15 pm ET · Jamal Wright · “Physics tutors full until Nov 2; drop-in can help this week”"]);
    if (st === "unassigned") h.push(["retry", "Returned to queue", "Fri, Oct 23 · 8:30 am ET · Jamal Wright · “Out until Oct 26”"], ["bell", "Queue lead notified", "Fri, Oct 23 · 8:30 am ET · Ines Duarte"]);
    if (st === "resolved") h.push(["calendar", "Session held", "Mon, Oct 26 · 4:00–4:45 pm · Hollis Hall 116"], ["check-circle", "Resolved by Jamal Wright", "Mon, Oct 26 · 5:10 pm ET"]);
    return h;
  };
  const owner36 = (st) => ({ received: "No one yet · in the Physics learning support queue", accepted: "Jamal Wright · offer two times by Fri, Oct 23", redirected: "Math & Science Tutoring Center queue · no owner yet", unassigned: "No one · queue lead Ines Duarte notified", resolved: "Closed · no next step" })[st];
  const actions36 = (st) => {
    if (st === "received" || st === "unassigned") return `${btn("Accept referral", { cls: "btn primary", go: "S36:accepted" })}${btn("Redirect…", { cls: "btn", go: "S36:redirected" })}`;
    if (st === "accepted") return `${btn("Resolve…", { cls: "btn primary", go: "S36:resolved" })}${btn("Redirect…", { cls: "btn", go: "S36:redirected" })}${btn("Return to queue", { cls: "btn plain", go: "S36:unassigned" })}`;
    if (st === "redirected") return `<p class="meta">Now owned by the Math & Science Tutoring Center queue. ${link("Undo redirect", { note: "Available until the new service accepts; recorded in history" })}</p>`;
    return `<p class="meta">Resolved cases stay read-only. A new request opens a new case.</p>`;
  };
  reg("S36", {
    states: [
      ["received", "Received · unassigned", 0],
      ["accepted", "Accepted", 1],
      ["redirected", "Redirected", 2],
      ["unassigned", "Returned to queue", 3],
      ["resolved", "Resolved", 4],
      ["student", "Student view", null, "Arrivals from S13 and S34 are students: the same case shown as status and next step only, without staff notes."],
    ],
    url: (st) => (st === "student" ? "app.whiteboard.example/support/requests" : "app.whiteboard.example/support-desk/learning-commons/cases/LC-2318"),
    web(st) {
      if (st === "student") return web({ nav: "support", crumbs: [["Support", "S34:browsing"], ["Your requests"]], url: this.url(st), body: webHead("Your support requests", "Status and next step from each service") + card("", `<ul class="w-list inset">
<li>${ic("users")}<div class="grow"><span class="title">Physics learning support · ${R.caseId}</span><div class="meta">Referral from Dr. Diane Reyes · ${R.at}</div><p style="margin-top:4px">${safe36.accepted}</p></div>${badge("caseOwned", "Accepted")}</li>
<li>${ic("support")}<div class="grow"><span class="title">Physics learning support · ${Q.ref}</span><div class="meta">Your request · ${Q.at}</div><p style="margin-top:4px">Learning Commons replied ${Q.reply}: a tutor will offer two times by Fri, Oct 16.</p></div>${badge("supRequested")}</li></ul>
<p class="meta" style="margin-top:10px">Staff notes stay with the service. ${link("Back to Support", { go: "S34:referral" })}</p>`) });
      const queue = table("Learning Commons · Physics learning support queue", ["Case", "Source", "Received", "Owner"], D6.queue.map((c) => ({ sel: c.id === "LC-2318", cells: [c.id === "LC-2318" ? link(`${c.id} · ${c.who}`, { go: "S36:received" }) : `${c.id} · ${c.who}`, c.src, c.at, c.owner || (c.id === "LC-2318" ? (["received", "unassigned", "redirected"].includes(st) ? "Unassigned" : st === "resolved" ? "Jamal Wright · resolved" : "Jamal Wright") : "Unassigned")] })));
      const detail = card(`${R.caseId} · Aisha Rahman`, `<p>${badge(stat36[st])}</p><dl class="facts" style="margin-top:10px"><dt>From</dt><dd>Referral · Dr. Diane Reyes · PHYS 110</dd><dt>Shared fact</dt><dd>${R.fact}</dd><dt>Next step</dt><dd>${owner36(st)}</dd><dt>Capacity</dt><dd>${D6.cap}</dd></dl><div class="w-row" style="margin-top:12px">${actions36(st)}</div>${st === "accepted" ? handoff("S35", "Shared wording needs a fix? Ask Dr. Reyes to correct it in S35 — the service can’t edit a referrer’s text.") : ""}`);
      const notes = card("Staff notes · Learning Commons only", st === "received" ? `<p class="meta">No notes yet.</p>` : `<p>${st === "resolved" ? "Worked through two-stage projectile problems; suggested the PHYS 110 Wednesday review session." : "Prefers weekday afternoons. Offer Tue or Wed after 3 pm."}</p><p class="meta">Never shown to the student or the referrer.</p>`);
      const studentSees = card("Aisha sees", `<p>${safe36[st]}</p><p class="meta" data-handoff="S34">Shown in her Support page (S34) and request list. No staff notes, no owner workload.</p>`);
      return webSupport({ nav: st === "accepted" || st === "resolved" ? "mine" : "queue", who: JW, crumbs: [["Referral queue", "S36:received"], [R.caseId]], url: this.url(st), body: webHead("Support follow-through", "Learning Commons · Physics learning support") + `<div class="w-grid"><div class="w-stack">${detail}${card("History", tl(hist36(st)))}</div><div class="w-stack">${studentSees}${notes}${card("Queue", queue, { flush: true })}</div></div>` });
    },
    ios(st) {
      if (st === "student") return iStudent({ title: "Your Requests", back: ["Support", "S34:referral"], trail: K.iAvatar, body: group([row(`Physics · ${R.caseId}`, safe36.accepted, { trail: badge("caseOwned", "Accepted") }), row(`Physics · ${Q.ref}`, "Times offered by Fri, Oct 16", { trail: badge("supRequested", "Requested") })], { foot: "Staff notes stay with the service." }) });
      const sheet = st === "accepted" ? K.sheet("Case Actions", R.caseId + " · Aisha Rahman", group([row("Resolve", "Records outcome; student sees ‘Complete’", { go: "S36:resolved" }), row("Redirect", "Choose a new service; history kept", { go: "S36:redirected" }), row("Return to Queue", "You stop owning it; queue lead told", { go: "S36:unassigned" })]), "Close") : "";
      return iDesk({ tab: st === "accepted" || st === "resolved" ? "mine" : "queue", title: R.caseId, back: ["Queue", "S36:received"], body: `<p>${badge(stat36[st])}</p><div style="height:10px"></div>` + group([row("Next Step", owner36(st)), row("Shared Fact", esc(R.fact))]) + group([row("Aisha Sees", safe36[st])], { foot: "Student-safe status. Staff notes are never shown." }) + group(hist36(st).map(([i, t, m]) => row(t, m, { lead: ic(i) })), { h: "History" }), bottom: st === "received" || st === "unassigned" ? btn("Accept Referral", { cls: "i-btn", go: "S36:accepted" }) : "", sheet });
    },
    notes: {
      received: { web: "Coordinator queue with LC-2318 selected: shared fact, next-step owner (‘No one yet’), capacity context, the student-safe status beside staff notes, and ordered history. Accept and Redirect are the only actions.", ios: "Case timeline with Accept Referral at the bottom." },
      accepted: { web: "Jamal Wright owns the next step with a date. Staff notes are labelled Learning Commons only. Referrer text can’t be edited here: a handoff asks Dr. Reyes to correct it in S35.", ios: "Action sheet: Resolve, Redirect, Return to Queue, each saying its effect." },
      redirected: { web: "Redirect names the new queue and the reason; ownership moves to that queue with no owner yet; Undo is available until the new service accepts. History keeps every step.", ios: "Redirected badge; history row quotes the reason." },
      unassigned: { web: "Returned to queue: nobody owns it, said plainly; the queue lead is notified. The student-safe status stays truthful (‘will assign a tutor’) instead of hiding the gap.", ios: "Accept Referral returns as the primary action." },
      resolved: { web: "Resolved with the session held and who resolved it; the case is read-only. The student sees ‘Complete’ and can start a new request.", ios: "Resolved badge; full history." },
      student: { web: "Aisha’s request list: each case shows service, source, student-safe status and badge only. Her own LC-2291 request and the referral case appear together; staff notes never do.", ios: "Your Requests list under Campus › Support." },
    },
    a11y: ["Staff notes and the student-safe view are separate headed regions; the latter is what the student’s screen reader hears.", "History is an ordered list with actor and time in text.", "The selected queue row is marked with aria-current, not colour alone."],
  });
})();
