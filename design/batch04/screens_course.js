/* Batch 04 course-operation screens: S21 people and course permissions, S22 course copy and
   rollover, S23 course insights and attendance. Staff shell from batch02/kit2.js. Scenario: PHYS 110
   Fall 2026; people changes Thu, Oct 15 and Mon, Oct 19; copy to Spring 2027 prepared Thu, Oct 15. */
(function () {
  "use strict";
  const K = window.K;
  const { D2, D4, ic, esc, badge, btn, link, notice, card, webStaff, webHead, ios, group, row, field, ival, table, handoff, tl, cbox, radio, desktopNote } = K;
  const reg = K.reg;
  const iStaff = (o) => ios({ tabs: K.STAFFTABS, tab: "teaching", ...o });
  const crumbsC = [["Teaching", "S14:published"], ["PHYS 110", "S14:published"]];
  const back = ["Course", "S14:published"];

  /* ============ S21 PEOPLE AND COURSE PERMISSIONS ============ */
  const day21 = { active: "Thu, Oct 15", invited: "Thu, Oct 15", confirm: "Thu, Oct 15", revoked: "Thu, Oct 15", expired: "Mon, Oct 19", allowance: "Mon, Oct 19" };
  const focus21 = { active: "Maya Chen", invited: "Jordan Ellis", expired: "Maya Chen", confirm: "Ravi Shah", revoked: "Ravi Shah", allowance: "Tomás Rivera" };
  const late = (st) => st === "expired" || st === "allowance";
  const sst = (p, st) => (p.name === "Maya Chen" && late(st) ? "accessExpired" : p.name === "Ravi Shah" && st === "revoked" ? "accessRevoked" : p.st);
  const ends = (p, st) => ({ accessExpired: "Ended Sun, Oct 18 · 11:59 pm ET", accessRevoked: "Ended Thu, Oct 15 · 2:20 pm ET" })[sst(p, st)] || p.ends;
  const act = (p, st) => {
    const s = sst(p, st);
    if (p.role === "Instructor") return `<span class="meta">Course owner</span>`;
    if (s === "invited") return link("Resend or withdraw", { go: "S21:invited" });
    if (s === "accessExpired") return link("Extend access", { go: "S21:expired" });
    if (s === "accessRevoked") return link("View record", { go: "S21:revoked" });
    if (p.name === "Ravi Shah") return link("Revoke access…", { go: "S21:confirm" });
    return link("Change role or access", { go: "S21:active" });
  };
  const staffTable = (st) => table("Course staff", ["Person", "Course role", "Access", "Ends", "Action"], D4.staff.map((p) => ({ sel: p.name === focus21[st], cells: [`${esc(p.name)}<div class="meta">${esc(p.note)}</div>`, esc(p.role), badge(sst(p, st)), `<span class="meta">${ends(p, st)}</span>`, act(p, st)] })));
  const allowTxt = (s, st) => (s.name === "Tomás Rivera" && st === "allowance" ? "PS4 extension to Wed, Oct 21" : s.allow || "—");
  const studentTable = (st) => table("Students", ["Person", "Course role", "Access", "Allowances", "Action"], D4.students.map((s) => ({ sel: s.name === focus21[st], cells: [esc(s.name), "Student", `${badge("active")}<div class="meta">From registrar enrollment</div>`, allowTxt(s, st) === "—" ? `<span class="meta">None</span>` : `${badge("allowance", allowTxt(s, st))}`, s.name === "Tomás Rivera" ? link(st === "allowance" ? "View allowance" : "Record allowance…", { go: "S21:allowance" }) : link("Record allowance…", { note: "Opens the allowance panel for " + s.name }) ] })));
  const permCard = card("What each course role can do", `<p class="meta" style="margin-bottom:8px">PHYS 110 only. Roles never carry over to other courses or to Alder Hill accounts.</p>${table("Course role permissions", ["Action", "Instructor", "Teaching assistant", "Grader"], D4.perms.map((r) => r.map(esc)))}`);
  const allowList = (st) => `<ul class="w-list inset" aria-label="Active allowances">${D4.allowances.concat(st === "allowance" ? [{ who: "Tomás Rivera", what: "Due-date extension", scope: "Problem Set 4 → Wed, Oct 21 · 11:59 pm ET", basis: "Instructor decision", by: "Dr. Diane Reyes · Oct 19" }] : []).map((a) => `<li><div class="grow"><div class="title">${esc(a.who)} · ${esc(a.what)}</div><div class="meta">${esc(a.scope)} · ${esc(a.basis)} · ${esc(a.by)}</div></div>${badge("allowance", "Active")}</li>`).join("")}</ul>`;
  const opNote = notice("neutral", "info", "Operational record only", "Records what changes and when. Don’t add medical or private details — Accessibility Services keeps any documentation; this record holds only its reference.");
  const rail21 = (st) => {
    if (st === "invited")
      return card("Jordan Ellis · invitation", `${notice("info", "mail", "No course access yet", "Jordan sees the invitation (P42) after signing in with Alder Hill sign-in as jellis@alderhill.example. Nothing is visible to Jordan until then.")}<dl class="facts" style="margin-top:12px"><dt>Invited</dt><dd>Thu, Oct 15 · 11:02 am ET by Dr. Diane Reyes</dd><dt>Role on acceptance</dt><dd>Teaching assistant</dd><dt>Access would end</dt><dd>Sun, Dec 20 · 11:59 pm ET</dd><dt>Link expires</dt><dd>Thu, Oct 22 · 11:59 pm ET</dd></dl><div style="display:grid;gap:8px;margin-top:12px">${btn("Resend invitation", { cls: "btn block", icon: "mail", note: "Sends the same invitation again; the expiry date restarts" })}${btn("Withdraw invitation…", { cls: "btn destructive block", note: "Ends the link. No access was created, so there is nothing to revoke." })}</div>`);
    if (st === "expired")
      return card("Maya Chen · access expired", `${notice("error", "lock", "Course actions blocked since Sun, Oct 18 · 11:59 pm ET", "Maya can’t open submissions, score or comment in PHYS 110. Saved work is kept (Ben Okafor, questions 1a–1b).")}<div style="height:12px"></div>${field({ id: "ws21-end", label: "New end date", value: "Sun, Oct 25, 2026 · 11:59 pm ET", hint: "Restores the same role and scope until this date." })}<div style="display:grid;gap:8px;margin-top:12px">${btn("Extend access", { cls: "btn primary block", note: "Restores Teaching assistant access until Oct 25; recorded in history" })}${link("See Maya’s read-only grading view", { go: "S17:expired" })}</div><h3 class="eyebrow" style="margin:14px 0 4px">History</h3>${tl([["clock", "Access ended automatically", "Sun, Oct 18 · 11:59 pm ET · end date reached"], ["check", "Invitation accepted", "Tue, Sep 1 · 8:14 am ET · Maya Chen"]])}`);
    if (st === "revoked")
      return card("Ravi Shah · access revoked", `${notice("neutral", "x", "Access ended Thu, Oct 15 · 2:20 pm ET", "Revoked by Dr. Diane Reyes. Reason: “Problem Set 2 grading finished.”")}<dl class="facts" style="margin-top:12px"><dt>Kept</dt><dd>12 Problem Set 2 scores and comments, still attributed to Ravi Shah</dd><dt>Released feedback</dt><dd>Unchanged</dd><dt>Other courses</dt><dd>Not affected</dd></dl><div style="margin-top:12px">${handoff("S37", "Alder Hill IT manages institution accounts and access policy in S37 People, access &amp; records. Revoking here ends PHYS 110 access only.")}</div><div style="margin-top:10px">${btn("Invite again…", { cls: "btn block", note: "Starts a new invitation (P42); the old record stays" })}</div>`);
    if (st === "allowance")
      return card("Tomás Rivera · allowance", `${badge("allowance")}<dl class="facts" style="margin-top:12px"><dt>Adjustment</dt><dd>Due-date extension</dd><dt>Applies to</dt><dd>Problem Set 4: Kinematics</dd><dt>Personal due</dt><dd>Wed, Oct 21 · 11:59 pm ET<div class="meta">Course due Fri, Oct 16</div></dd><dt>Basis</dt><dd>Instructor decision</dd><dt>Recorded</dt><dd>Dr. Diane Reyes · Mon, Oct 19 · 9:30 am ET</dd></dl><div style="height:12px"></div>${opNote}<div style="display:grid;gap:8px;margin-top:12px">${btn("Open Problem Set 4", { cls: "btn block", go: "S15:published", note: "The assignment editor lists personal due dates under Allowances" })}<p class="meta">Grading now shows Tomás as “Extension applied”, not Missing. Tomás sees the personal date first.</p></div>`);
    if (st === "confirm")
      return card("Ravi Shah · Grader", `<dl class="facts"><dt>Access</dt><dd>${badge("active")}</dd><dt>Ends</dt><dd>End of term</dd><dt>Scope</dt><dd>Problem Set 2 only · grading finished Oct 9</dd></dl><div style="margin-top:12px">${btn("Revoke access…", { cls: "btn destructive block", go: "S21:confirm" })}</div>`);
    return card("Maya Chen · Teaching assistant", `<dl class="facts"><dt>Access</dt><dd>${badge("active")}</dd><dt>Ends</dt><dd>Sun, Oct 18 · 11:59 pm ET</dd><dt>Scope</dt><dd>Grading Problem Sets 1–4</dd></dl><div style="height:12px"></div>${field({ id: "ws21-role", label: "Course role", type: "select", options: ["Teaching assistant", "Grader", "Instructor"], value: "Teaching assistant", hint: "Changes apply in PHYS 110 only. Releasing feedback stays instructor-only." })}<div style="display:grid;gap:8px;margin-top:12px">${btn("Save role", { cls: "btn block", note: "No change to save yet" })}${btn("Extend access…", { cls: "btn plain block", note: "Choose a new end date before the current one passes" })}${btn("Revoke access…", { cls: "btn destructive block", note: "Opens a review that names Maya and PHYS 110 before anything changes" })}</div>`);
  };
  const dialog21 = `<div class="w-dialog" role="dialog" aria-modal="true" aria-labelledby="ws21-dt"><div><h2 id="ws21-dt">Revoke Ravi Shah’s access to PHYS 110?</h2><p class="meta">Grader · Fall 2026 · access ends as soon as you confirm.</p><ul class="w-checks" aria-label="What happens"><li class="todo">${ic("lock")}<span>Ravi can no longer open PHYS 110 or its submissions.</span></li><li class="ok">${ic("check-circle")}<span>12 Problem Set 2 scores and comments stay, attributed to Ravi.</span></li><li class="ok">${ic("check-circle")}<span>Released feedback and other courses are unchanged.</span></li></ul>${field({ id: "ws21-why", label: "Reason <span class=\"meta\">(optional · staff only)</span>", value: "Problem Set 2 grading finished" })}<div class="row">${btn("Cancel", { cls: "btn", go: "S21:active" })}${btn("Revoke access", { cls: "btn primary", go: "S21:revoked" })}</div></div></div>`;
  reg("S21", {
    states: [
      ["active", "Active", 0],
      ["invited", "Invited", 1],
      ["expired", "Expired", 2],
      ["confirm", "Revoke review", null, "Added: destructive access change reviewed in a dialog/sheet naming the person and course before it applies (map iOS note)"],
      ["revoked", "Revoked", 3],
      ["allowance", "Allowance active", 4],
    ],
    url: (st) => `app.whiteboard.example/teach/phys-110/people${st === "allowance" ? "/students/tomas-rivera" : ""}`,
    web(st) {
      const main = `<div class="w-stack">${st === "allowance" ? card("Students · 44 enrolled", studentTable(st) + `<p class="meta" style="margin-top:8px">Showing 5 of 44 · enrollment comes from registrar records</p>`) + card("Course staff", staffTable(st)) : card("Course staff", staffTable(st)) + card("Students · 44 enrolled", studentTable(st) + `<p class="meta" style="margin-top:8px">Showing 5 of 44 · enrollment comes from registrar records</p>`)}${card("Active allowances", allowList(st) + `<p class="meta" style="margin-top:8px">Course staff see adjusted timing. Only the instructor sees the basis reference.</p>`)}</div>`;
      return webStaff({ tool: "people", crumbs: [...crumbsC, ["People"]], url: this.url(st), overlay: st === "confirm" ? dialog21 : "", body: webHead("People and permissions", `PHYS 110 · Fall 2026 · 4 staff · 44 students · ${day21[st]}`, `<div style="display:flex;gap:8px;flex-wrap:wrap">${btn("Invite staff…", { cls: "btn", icon: "mail", note: "Sends a course invitation (P42); access starts only when accepted" })}${btn("Course builder", { cls: "btn", icon: "list", go: "S14:published" })}</div>`) + `<div class="w-grid edit">${main}<div class="w-rail">${rail21(st)}${permCard}</div></div>` });
    },
    ios(st) {
      const list = (h) => group(D4.staff.map((p) => row(esc(p.name), `${esc(p.role)} · ${ends(p, st)}`, { lead: K.av(p.ini, true), trail: badge(sst(p, st)), go: { "Jordan Ellis": "S21:invited", "Maya Chen": late(st) ? "S21:expired" : "S21:active", "Ravi Shah": st === "revoked" ? "S21:revoked" : "S21:confirm" }[p.name], note: p.role === "Instructor" ? "Course owner" : undefined })), { h }) + group(D4.students.slice(0, 4).map((s) => row(esc(s.name), allowTxt(s, st), { lead: K.av(s.ini), go: s.name === "Tomás Rivera" ? "S21:allowance" : undefined, note: s.name === "Tomás Rivera" ? undefined : "Opens " + s.name })), { h: "Students · 44", foot: "Enrollment comes from registrar records." });
      if (st === "active" || st === "confirm") {
        const sh = st === "confirm" ? K.sheet("Revoke Ravi Shah from PHYS 110?", "Grader · Fall 2026 · ends as soon as you confirm", group([row("Can’t open PHYS 110 or submissions", "", { lead: ic("lock") }), row("12 PS2 scores stay, attributed", "", { lead: ic("check-circle") }), row("Released feedback unchanged", "", { lead: ic("check-circle") })]) + btn("Revoke Access", { cls: "i-btn", go: "S21:revoked" })) : "";
        return iStaff({ back, large: "People", sub: "PHYS 110 · Fall 2026", trail: K.iStaffAvatar, body: list("Staff") + group([row("What Each Role Can Do", "Release stays instructor-only", { lead: ic("shield"), note: "Opens the course role permission table" })]), sheet: sh });
      }
      if (st === "invited") return iStaff({ back: ["People", "S21:active"], title: "Jordan Ellis", trail: K.iStaffAvatar, body: notice("info", "mail", "No course access yet", "Jordan sees the invitation after signing in with Alder Hill sign-in.") + group([ival("Invited", "Thu, Oct 15"), ival("Role on Acceptance", "Teaching assistant"), ival("Link Expires", "Thu, Oct 22")]) + group([row("Resend Invitation", "", { note: "Expiry restarts" }), `<span class="danger">Withdraw Invitation…</span>`]) });
      if (st === "expired") return iStaff({ back: ["People", "S21:active"], title: "Maya Chen", trail: K.iStaffAvatar, body: notice("error", "lock", "Access expired Oct 18", "Course actions blocked. Saved work is kept.") + group([ival("Course Role", "Teaching assistant"), ival("Ended", "Sun, Oct 18 · 11:59 pm"), ival("New End Date", "Sun, Oct 25", { note: "Choose a date" })]) + group([row("Her Read-Only Grading View", "", { go: "S17:expired" })]), bottom: btn("Extend Access", { cls: "i-btn", note: "Restores the same role until Oct 25" }) });
      if (st === "revoked") return iStaff({ back: ["People", "S21:active"], title: "Ravi Shah", trail: K.iStaffAvatar, body: notice("neutral", "x", "Access revoked Oct 15 · 2:20 pm", "By Dr. Diane Reyes · Problem Set 2 grading finished.") + group([ival("Kept", "12 PS2 scores"), ival("Released Feedback", "Unchanged"), ival("Other Courses", "Not affected")]) + `<p class="i-foot" data-handoff="S37">Alder Hill IT manages institution accounts (S37). This ended PHYS 110 access only.</p>` });
      return iStaff({ back: ["People", "S21:active"], title: "Tomás Rivera", trail: K.iStaffAvatar, body: `<div class="i-card" style="display:flex;justify-content:space-between;align-items:center"><span>Problem Set 4</span>${badge("allowance")}</div>` + group([ival("Adjustment", "Extension"), ival("Personal Due", "Wed, Oct 21 · 11:59 pm"), ival("Course Due", "Fri, Oct 16"), ival("Basis", "Instructor decision")]) + group([row("Open Problem Set 4", "Allowances list in the editor", { go: "S15:published" })]) + `<p class="i-foot">Operational record only — no medical or private details. Accessibility Services keeps any documentation.</p>` });
    },
    notes: {
      active: { web: "Roster tables (staff, then students) with role, access status, end date and the action beside each person. Rail: the selected person’s role and access controls plus a course-role permission table — release stays instructor-only, TAs propose rubric changes (D27, D29).", ios: "People list with status badges; per-person pushed detail and a permissions row. Navigation never grants permission." },
      invited: { web: "Invitation is not access: Jordan Ellis has no course access until accepting in P42 while signed in. Resend or withdraw; withdrawing needs no revoke.", ios: "Pushed detail with invitation facts and a destructive-coloured Withdraw." },
      expired: { web: "Maya Chen’s end date passed (matches S17 ‘access expired’): course actions blocked, saved work kept, Extend access names the new date. Links to her read-only grading view.", ios: "Error notice, new end date row, Extend Access at the bottom." },
      confirm: { web: "Added state: revoke review dialog names the person, role, course and term, lists what ends and what is kept, and takes an optional staff-only reason.", ios: "Review sheet naming person and course (map note); Revoke Access confirms." },
      revoked: { web: "Revoked: access ended with the record retained — earlier scores stay attributed; released feedback unchanged; institution accounts are S37’s (handoff, not linked).", ios: "Record facts; institution-access note as a handoff." },
      allowance: { web: "Operational allowance for Tomás Rivera (PS4 extension recorded Mon, Oct 19, after S17 showed him Missing). Stores what/when/who and a basis label only — never private documentation. Route to S15 where the personal date is listed.", ios: "Allowance detail; route to the assignment editor; privacy note." },
    },
    a11y: ["Status is text in each badge; the selected row is marked aria-current.", "Revoke review is a modal dialog labelled by its question; Cancel returns without change.", "Permission table uses words (Yes / No / Propose only), not ticks."],
  });

  /* ============ S22 COURSE COPY AND ROLLOVER ============ */
  const C = D4.copy;
  const steps22 = (cur) => `<ol class="w-steps" aria-label="Copy steps">${["Select", "Dates", "Preview", "Copy"].map((t, i) => `<li${i === cur ? ' aria-current="step"' : ""}${i < cur ? ' class="done"' : ""}><span class="n">${i < cur ? ic("check") : i + 1}</span><span class="lbl">${t}</span></li>`).join("")}</ol>`;
  const stepOf = { incomplete: 1, preview: 2, exception: 2, ready: 3, applied: 4 };
  const sel22 = (p, ro) => `<fieldset class="w-sel"><legend class="sr">Content to copy</legend>${D2.mods.map((m, i) => cbox(`${p}-m${i}`, `Module ${i + 1}: ${esc(m.title)} <span class="meta">· ${m.items.length + (i === 2 ? 1 : 0)} items</span>`, true, { disabled: ro })).join("")}${cbox(`${p}-files`, `Course files <span class="meta">· ${D2.files.length} · current versions only</span>`, true, { disabled: ro })}${cbox(`${p}-rub`, `Rubrics <span class="meta">· Kinematics problem-solving v2</span>`, true, { disabled: ro })}</fieldset><h3 class="eyebrow" style="margin:14px 0 6px">Never copied</h3><ul class="w-list inset" aria-label="Never copied">${C.excluded.map((x) => `<li>${badge("excluded", "Not copied")}<span>${esc(x)}</span></li>`).join("")}</ul>`;
  const fixed = (st) => st === "ready" || st === "applied";
  const dateRows = (st) => C.dates.map(([what, a, b, f]) => {
    let dst = b, chk = `<span class="meta">Weekday kept</span>`;
    if (f === "brk") {
      if (fixed(st) && what.startsWith("Problem Set 4")) { dst = `<span class="w-diff"><s>Fri, Mar 12</s> ${ic("chev-r")} Fri, Mar 19 · 11:59 pm</span>`; chk = badge("previewCurrent", "Moved by you"); }
      else if (fixed(st)) chk = badge("previewCurrent", "Kept · opens before break");
      else chk = badge("dateWarn", "In spring break");
    }
    return [esc(what), `<span class="meta">${a}</span>`, dst, chk];
  });
  const toolRow = (st) => (st === "ready" || st === "applied" ? badge("copyReady", "Placeholder page") : badge("exception", "Not supported"));
  const exPanel = (p) => `${notice("error", "alert", `${esc(C.tool.name)} can’t be copied`, `${esc(C.tool.kind)} in ${esc(C.tool.where)}. Spring 2027 has no connection for it, so the copy can’t include a working link.`)}<fieldset class="w-choice" style="margin-top:12px"><legend><b>Choose what the destination gets</b></legend>${radio(`${p}-tool`, `${p}-t1`, `Placeholder page <span class="meta">· staff-only note “Reconnect simulator before Module 3 opens”; students see nothing</span>`, false)}${radio(`${p}-tool`, `${p}-t2`, `Leave it out <span class="meta">· Module 3 copies without it</span>`, false)}${radio(`${p}-tool`, `${p}-t3`, `Map to an approved tool <span class="meta">· none approved for Spring 2027 — Alder Hill IT reviews tool requests</span>`, false, { disabled: true })}</fieldset>`;
  const rail22 = (st) => {
    const dest = card("Destination", `<dl class="facts"><dt>Course</dt><dd>${C.dst}</dd><dt>Created as</dt><dd>${badge("staffDraft")}<div class="meta">Separate course · students can’t enter</div></dd><dt>Learners</dt><dd>0 · enrollment comes from registrar records later</dd><dt>Source</dt><dd>${C.src} · unchanged</dd></dl>`);
    if (st === "applied")
      return `<div class="w-rail">${card("Copy complete", `${notice("success", "check-circle", "PHYS 110 · Spring 2027 created", "Thu, Oct 15 · 3:46 pm ET by Dr. Diane Reyes. 4 modules, 13 items, 5 files, 1 rubric, 1 placeholder page. No learner data.")}<div style="display:grid;gap:8px;margin-top:12px">${btn("Inspect the destination course", { cls: "btn primary block", go: "S14:draft", note: "Opens the Spring 2027 draft in the course builder (drawn with the Batch 02 builder sample)" })}${btn("Back to Fall 2026", { cls: "btn block", go: "S14:published" })}</div>`)}${dest}</div>`;
    const blockers = { incomplete: ["Choose the destination’s first class day to calculate dates."], preview: ["1 exception: external tool can’t be copied.", "2 dates fall in spring break — check them."], exception: ["Choose what replaces the external tool."], ready: [] }[st];
    const can = st === "ready";
    const go = can ? btn("Copy to Spring 2027", { cls: "btn primary block", go: "S22:applied" }) : btn(st === "incomplete" ? "Preview copy" : "Copy to Spring 2027", { cls: "btn primary block", disabled: true, describedby: "ws22-why", note: blockers[0] });
    return `<div class="w-rail">${card(can ? "Ready to copy" : "Before you copy", `${blockers.length ? `<ul class="w-checks" id="ws22-why" aria-label="Blocking items">${blockers.map((b) => `<li class="err">${ic("alert")}<span><span class="sr">Blocks copying: </span>${b}</span></li>`).join("")}</ul>` : `${notice("success", "check", "Preview P-3 reviewed", "Built 3:40 pm from the current selection. Any change makes it out of date.")}`}${can ? `<div style="margin-top:10px">${K.cbox("ws22-ok", "I reviewed the content, dates and exception in this preview", true)}</div>` : ""}<div style="margin-top:12px">${go}</div>`)}${dest}</div>`;
  };
  reg("S22", {
    states: [
      ["incomplete", "Selection incomplete", 0],
      ["preview", "Preview current", 1],
      ["exception", "Exception open", 2],
      ["ready", "Ready", 3],
      ["applied", "Applied", 4],
    ],
    url: () => "app.whiteboard.example/teach/phys-110/copy/spring-2027",
    web(st) {
      const datesCard = st === "incomplete"
        ? card("Dates", `${field({ id: "ws22-term", label: "Destination term", type: "select", options: ["Spring 2027"], value: "Spring 2027" })}<div style="height:10px"></div>${field({ id: "ws22-first", label: "First class day in Spring 2027", value: "", req: true, err: "Choose a date to calculate shifted dates.", hint: `Fall 2026 started ${C.first[0]}.` })}<p class="meta" style="margin-top:10px">Shifted dates appear here once the first class day is set.</p>`)
        : card(`Dates · ${C.shift}`, `<p class="meta" style="margin-bottom:8px">First class day ${C.first[0]} → ${C.first[1]} · ${C.brk}</p>${table("Source and destination dates", ["Item", "Fall 2026 · source", "Spring 2027 · destination", "Check"], dateRows(st).concat([[`${esc(C.tool.name)}<div class="meta">${esc(C.tool.kind)}</div>`, `<span class="meta">Module 3</span>`, st === "ready" || st === "applied" ? "Placeholder page (staff only)" : "—", toolRow(st)]]))}`);
      const centre = st === "exception" ? card("Exception · external tool", exPanel("ws22")) + datesCard : datesCard;
      const head = webHead("Copy to next term", `${C.src} → ${C.dst} · source stays unchanged · no learner data is copied`, steps22(stepOf[st]));
      return webStaff({ tool: "term", crumbs: [...crumbsC, ["Next term"]], url: this.url(st), body: head + `<div class="w-grid edit3">${card("Select content", sel22("ws22", st === "applied"))}<div class="w-stack">${centre}</div>${rail22(st)}</div>` });
    },
    ios(st) {
      const desk = desktopNote("Reviewing every item, date and exception together is easier on a computer.", "app.whiteboard.example/teach/phys-110/copy/spring-2027");
      if (st === "applied") return iStaff({ back, title: "Copy", trail: K.iStaffAvatar, body: `<div class="i-hero"><span class="glyph">${ic("check-circle")}</span><h1 style="font-size:24px">Spring 2027 created</h1><p class="i-sub" style="margin:0">Separate draft course · source unchanged · no learner data.</p></div>` + group([ival("Modules", "4"), ival("Items", "13"), ival("Placeholder Pages", "1")]), bottom: btn("Inspect Destination", { cls: "i-btn", go: "S14:draft" }) });
      const sum = group([ival("Destination", "Spring 2027"), ival("First Class Day", st === "incomplete" ? "Choose…" : "Mon, Jan 25", { err: st === "incomplete", note: st === "incomplete" ? "Required to calculate dates" : undefined }), ival("Content", "4 modules · files · rubric")], { h: "Copy summary" });
      const checksG = st === "incomplete" ? "" : group([row("Dates to Check", fixed(st) ? "Reviewed" : "2 in spring break", { trail: fixed(st) ? badge("previewCurrent", "Done") : badge("dateWarn", "2"), note: "Opens the shifted-date list" }), row("External Tool", st === "ready" ? "Placeholder page" : "Not supported", { trail: st === "ready" ? badge("copyReady", "Resolved") : badge("exception", "1"), go: st === "ready" ? undefined : "S22:exception", note: st === "ready" ? "Placeholder chosen" : undefined })], { h: "Preview", foot: "Never copied: people, submissions, scores, discussions, allowances, attendance." });
      if (st === "exception") return iStaff({ back: ["Copy", "S22:preview"], title: "External Tool", trail: K.iStaffAvatar, body: notice("error", "alert", "Simulator can’t be copied", "Spring 2027 has no connection for this external tool.") + group([row("Placeholder Page", "Staff-only note to reconnect", { note: "Choose" }), row("Leave It Out", "Module 3 copies without it", { note: "Choose" }), row("Map to Approved Tool", "None approved for Spring 2027", { note: "Unavailable" })], { h: "Destination gets" }) + desk });
      const bottom = st === "ready" ? btn("Copy to Spring 2027", { cls: "i-btn", go: "S22:applied" }) : btn(st === "incomplete" ? "Preview Copy" : "Copy to Spring 2027", { cls: "i-btn", disabled: true, note: st === "incomplete" ? "Choose the first class day" : "Resolve the exception first" });
      return iStaff({ back, title: "Copy to Next Term", trail: K.iStaffAvatar, body: (st === "ready" ? notice("success", "check", "Preview reviewed", "Any change makes it out of date.") + '<div style="height:10px"></div>' : "") + sum + checksG + desk, bottom });
    },
    notes: {
      incomplete: { web: "Steps Select → Dates → Preview → Copy. Content is chosen by module; ‘Never copied’ lists learner data explicitly. Preview stays unavailable with a field error until the first class day exists.", ios: "Mapped checklist: summary rows with the missing first class day flagged; desktop recommended card." },
      preview: { web: "Source and destination dates side by side; the shift rule is stated (+21 weeks, weekdays kept). Dates in spring break are flagged to check; the unsupported external tool blocks copying.", ios: "Copy summary plus counts of dates to check and exceptions; each opens its detail." },
      exception: { web: "Exception panel above the dates: placeholder page, leave out, or map to an approved tool (unavailable, says who reviews tool requests). Copy stays blocked until a choice is made.", ios: "Pushed exception detail with three choices; the unavailable one says why." },
      ready: { web: "Exception resolved (placeholder), PS4 moved by hand to Fri, Mar 19 (old date struck through), Module 3 kept with a reason. Explicit review checkbox; preview P-3 is current; any change makes it stale.", ios: "Reviewed notice and Copy at the bottom." },
      applied: { web: "Copy creates a separate draft course with zero learners; the source is unchanged. Inspect opens the destination in the course builder (S14).", ios: "Success hero, counts, Inspect Destination." },
    },
    a11y: ["Disabled Copy keeps visible blocking reasons linked by aria-describedby.", "Old → new dates use strikethrough plus text, not colour alone.", "Content checkboxes are grouped in a fieldset with a legend."],
  });

  /* ============ S23 COURSE INSIGHTS AND ATTENDANCE ============ */
  const L = D4.lab;
  const attRows = (st) => D4.att.map(([n, s]) => {
    let status = badge(s), action = link("Correct…", { note: "Opens a correction for " + n });
    if (n === "Daniel Kim" && st === "disputed") { status = badge("disputed"); action = link("Review request", { go: "S23:disputed" }); }
    if (n === "Daniel Kim" && st === "corrected") { status = `${badge("present")} ${badge("corrected")}`; action = link("History", { go: "S23:corrected" }); }
    return { sel: n === "Daniel Kim" && (st === "disputed" || st === "corrected"), cells: [esc(n), status, `<span class="meta">${st === "corrected" && n === "Daniel Kim" ? "Sign-in sheet p. 2 · corrected Oct 19" : "Sign-in sheet · entered Oct 16"}</span>`, action] };
  });
  const separate = notice("neutral", "info", "Three separate records", "Submission, module completion and attendance are reported separately. Whiteboard doesn’t combine them into a score or predict outcomes.");
  const missedCard = (st) => {
    if (st === "allsubmitted")
      return card("Not submitted before close", `${field({ id: "ws23-asg", label: "Assignment", type: "select", options: ["Problem Set 4: Kinematics", "Problem Set 3: Kinematics in 1-D"], value: "Problem Set 3: Kinematics in 1-D" })}<div style="height:10px"></div>${notice("success", "check", "All 44 active students submitted before close", "Closed Fri, Oct 2 · 11:59 pm ET. No follow-up needed.")}`);
    return card("Not submitted before close", `${field({ id: "ws23-asg", label: "Assignment", type: "select", options: ["Problem Set 4: Kinematics", "Problem Set 3: Kinematics in 1-D"], value: "Problem Set 4: Kinematics" })}<p class="meta" style="margin:10px 0 6px">Closed Sun, Oct 18 · 11:59 pm ET · 44 active · 41 submitted · 1 excused (not counted)</p><ul class="w-list inset" aria-label="Active students without a submission"><li><div class="grow"><div class="title">Noah Fischer</div><div class="meta">No receipt · no allowance</div></div>${badge("followUp")}</li><li><div class="grow"><div class="title">Tomás Rivera</div><div class="meta">No receipt · no allowance</div></div>${badge("followUp")}</li></ul><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">${btn("Open in grading", { cls: "btn", go: "S17:missing" })}${btn("Record an allowance…", { cls: "btn plain", go: "S21:allowance" })}</div>${handoff("S35", "Concern beyond this course? An adviser can open S35 Advising context and referral; you share only facts you choose. Support records stay with support staff.")}`);
  };
  const compCard = card("Module 3 completion · 44 active", `<div class="w-bars">${[["Completed", 35, "every required item done"], ["Started, not completed", 7, ""], ["Not started", 2, ""]].map(([t, n, m]) => `<div><div style="display:flex;justify-content:space-between"><span>${t}${m ? ` <span class="meta">· ${m}</span>` : ""}</span>${link(`${n} students`, { note: `Lists the ${n} named students` })}</div>${K.progress(Math.round((n / 44) * 100), `${t}: ${n} of 44`)}</div>`).join("")}</div>`);
  const attCard = (st) => card(`Attendance · ${L.name}`, `<p class="meta" style="margin-bottom:8px">${L.when} · ${L.room} · ${st === "delayed" ? "last known" : "source"}: ${esc(L.src)}</p>${st === "delayed" ? notice("warning", "clock", "Attendance entries may be behind", "Last entry Fri, Oct 16 · 9:05 am ET. Lab L01 (Tue, Oct 13) isn’t entered yet — it isn’t counted as absent.") + '<div style="height:10px"></div>' : ""}${table(`Attendance for ${L.name}, ${L.when}`, ["Student", "Status", "Source", "Action"], attRows(st))}<p class="meta" style="margin-top:8px">Showing 6 of 22 · Lectures don’t record attendance in PHYS 110.</p>`);
  const corrPanel = (st) => {
    if (st === "disputed")
      return card("Correction request · Daniel Kim", `<p class="meta">${L.name} · ${L.when}</p><blockquote class="w-quote">“I signed page 2 of the sheet — I sat at the back bench.”<span class="meta">Daniel Kim · Sun, Oct 18 · 6:12 pm ET</span></blockquote><dl class="facts"><dt>Recorded</dt><dd>${badge("absent")} by Maya Chen from the sign-in sheet</dd></dl><div style="height:10px"></div>${field({ id: "ws23-new", label: "Corrected status", type: "select", options: ["Present", "Absent"], value: "Present" })}<div style="height:8px"></div>${field({ id: "ws23-why", label: "Reason (recorded with the change)", value: "Name found on sign-in sheet page 2" })}<div style="display:flex;gap:8px;margin-top:10px">${btn("Record correction", { cls: "btn primary", go: "S23:corrected" })}${btn("Keep as recorded", { cls: "btn", note: "Keeps Absent; Daniel sees your reason" })}</div>`);
    return card("Correction · Daniel Kim", `${tl([["history", "Absent → Present", "Mon, Oct 19 · 11:20 am ET · Dr. Diane Reyes · “Name found on sign-in sheet page 2”"], ["chat", "Correction requested", "Sun, Oct 18 · 6:12 pm ET · Daniel Kim"], ["doc", "Recorded Absent", "Fri, Oct 16 · 9:05 am ET · Maya Chen · sign-in sheet"]])}<p class="meta" style="margin-top:8px">The original entry is kept. Daniel sees Present and the reason.</p>`);
  };
  reg("S23", {
    states: [
      ["followup", "Follow-up needed", 0],
      ["allsubmitted", "All submitted", 1],
      ["disputed", "Attendance disputed", 2],
      ["corrected", "Attendance corrected", 3],
      ["delayed", "Source delayed", 4],
    ],
    url: (st) => `app.whiteboard.example/teach/phys-110/insights${st === "disputed" || st === "corrected" ? "/attendance/lab-l02-oct-15" : ""}`,
    web(st) {
      const left = `<div class="w-stack">${missedCard(st)}${compCard}</div>`;
      const right = `<div class="w-stack">${attCard(st)}${st === "disputed" || st === "corrected" ? corrPanel(st) : ""}${separate}</div>`;
      return webStaff({ tool: "insights", crumbs: [...crumbsC, ["Insights"]], url: this.url(st), body: webHead("Course insights", "PHYS 110 · Fall 2026 · facts from course records · Mon, Oct 19 · 9:00 am ET", btn("Course builder", { cls: "btn", icon: "list", go: "S14:published" })) + `<div class="w-grid even">${left}${right}</div>` });
    },
    ios(st) {
      const seg = (cur) => `<div class="i-seg" role="group" aria-label="Signal">${["Missed work", "Completion", "Attendance"].map((x) => `<button type="button" aria-pressed="${x === cur}" data-note="Shows ${x.toLowerCase()} only">${x}</button>`).join("")}</div>`;
      const foot = `<p class="i-foot">Separate records — no combined score or prediction.</p>`;
      if (st === "followup" || st === "allsubmitted")
        return iStaff({ back, large: "Insights", sub: "PHYS 110 · Mon, Oct 19", trail: K.iStaffAvatar, body: seg("Missed work") + (st === "allsubmitted" ? group([ival("Assignment", "Problem Set 3")]) + notice("success", "check", "All 44 active students submitted", "No follow-up needed.") : group([ival("Assignment", "Problem Set 4"), row("Noah Fischer", "No receipt · no allowance", { trail: badge("followUp"), go: "S17:missing" }), row("Tomás Rivera", "No receipt · no allowance", { trail: badge("followUp"), go: "S17:missing" })], { foot: "41 submitted · 1 excused (not counted)." }) + `<p class="i-foot" data-handoff="S35">Concern beyond this course? Advisers use S35 referral.</p>`) + foot });
      const list = group(D4.att.map(([n, s]) => row(esc(n), n === "Daniel Kim" && st === "corrected" ? "Corrected Oct 19 · sign-in p. 2" : "Sign-in sheet", { trail: n === "Daniel Kim" && st === "disputed" ? badge("disputed") : n === "Daniel Kim" && st === "corrected" ? badge("corrected", "Present") : badge(s), go: n === "Daniel Kim" ? "S23:disputed" : undefined, note: n === "Daniel Kim" ? undefined : "Opens a correction" })), { h: `${L.name} · Thu, Oct 15`, foot: st === "delayed" ? "Last entry Fri, Oct 16 · 9:05 am. Lab L01 not entered yet — not counted as absent." : "Source: lab sign-in sheet, entered by Maya Chen." });
      const sh = st === "disputed" ? `<div class="i-sheet-wrap" role="dialog" aria-modal="true" aria-label="Correct attendance for Daniel Kim"><div class="i-sheet"><div class="i-grabber" aria-hidden="true"></div><h2>Correct Daniel Kim</h2><p class="meta">${L.name} · Thu, Oct 15 · recorded Absent</p>${group([ival("Corrected Status", "Present", { note: "Choose" }), `<div class="i-fieldrow" style="width:100%"><div class="i-field"><label for="is23-why">Reason</label><input id="is23-why" value="Name found on sign-in sheet page 2"></div></div>`])}<div style="height:8px"></div>${btn("Record Correction", { cls: "i-btn", go: "S23:corrected" })}<div style="height:8px"></div><button type="button" class="i-btn secondary" data-note="Keeps Absent">Keep as Recorded</button></div></div>` : "";
      return iStaff({ back: ["Insights", "S23:followup"], title: "Attendance", trail: K.iStaffAvatar, body: seg("Attendance") + (st === "delayed" ? notice("warning", "clock", "Entries may be behind", "Last known record shown.") + '<div style="height:10px"></div>' : "") + list + (st === "corrected" ? group([ival("Changed", "Absent → Present"), ival("By", "Dr. Diane Reyes · Oct 19")], { h: "Daniel Kim · history" }) : "") + foot, sheet: sh });
    },
    notes: {
      followup: { web: "Two columns of facts: who hasn’t submitted (named, with allowance status; excused not counted), module completion as three named counts, and attendance with its source. Routes: grading (S17), allowances (S21), referral handoff (S35).", ios: "One signal at a time via a segmented control; interpretation note stays attached." },
      allsubmitted: { web: "Assignment picker set to PS3: neutral success notice, no follow-up list.", ios: "Same picker; success notice." },
      disputed: { web: "Daniel Kim’s correction request quoted with time; recorded value and who entered it; instructor chooses the corrected status and a reason before recording.", ios: "Pushed attendance list; correction sheet." },
      corrected: { web: "Corrected row shows both Present and Corrected; history keeps the original entry, the request and the change with reason and source page.", ios: "History rows under the list." },
      delayed: { web: "Source delayed: entries labelled last known with the last entry time; a missing lab isn’t counted as absent.", ios: "Warning notice; foot explains the gap." },
    },
    a11y: ["Completion bars are progressbars with text counts beside them.", "Attendance status and correction appear as text badges in the table.", "Correction fields are labelled; the reason is recorded with the change."],
  });
})();
