/* Batch 03 grading screens: S17 grading workspace, S18 rubric-change preview, S19 gradebook,
   S20 release and records. Staff shell from batch02/kit2.js. Scenario: Problem Set 4 closed
   Sun, Oct 18; grading Mon, Oct 19; release Tue, Oct 20; regrade Thu, Oct 22 (matches S09). */
(function () {
  "use strict";
  const K = window.K;
  const { D, D2, D3, ic, esc, badge, btn, link, notice, card, webStaff, webHead, ios, group, row, field, checks, ival, sheet, page, qsel, desktopNote, handoff } = K;
  const reg = K.reg;
  const MAYA = { name: "Maya Chen", initials: "MC" };
  const iStaff = (o) => ios({ tabs: K.STAFFTABS, tab: "grading", ...o });
  const crumbsG = [["Grading", "S17:received"], ["PHYS 110", "S19:graded"]];
  const qids = D.questions.map((q) => q.id);
  const C = D3.counts;
  const tally = `PHYS 110 · Closed Sun, Oct 18 · ${C.received} received · ${C.graded} graded · ${C.missing} missing · ${C.excused} excused`;

  /* ============ S17 GRADING WORKSPACE ============ */
  const sel = { received: "Aisha Rahman", progress: "Aisha Rahman", graded: "Aisha Rahman", missing: "Tomás Rivera", expired: "Ben Okafor" };
  const aishaSt = { received: "notReviewed", progress: "reviewing", graded: "graded" };
  const roster = (st) => `<ul class="w-roster" aria-label="Submissions">${D3.roster.map((r) => {
    const s = r.name === "Aisha Rahman" ? aishaSt[st] || "graded" : r.st;
    return `<li><a href="#" aria-current="${r.name === sel[st]}" data-note="Opens ${esc(r.name)}’s submission">${esc(r.name)}<span class="grow"></span>${badge(s, { notReviewed: "Not reviewed", reviewing: "In review", graded: "Graded", missing: "Missing", excused: "Excused" }[s])}</a></li>`;
  }).join("")}</ul><p class="meta" style="margin-top:8px">Showing 12 of 44 · ${link("Open gradebook", { go: "S19:graded" })}</p>`;
  const reviewed = { received: [], progress: ["1a", "1b", "2"], graded: qids, expired: ["1a", "1b"] };
  const curQ = { received: "1a", progress: "3", graded: "3", expired: "2" };
  const rubricQ3 = (p, ro) => `<table class="w-matrix"><caption class="sr">Rubric for question 3 · Kinematics problem-solving v2</caption><thead><tr><th scope="col">Criterion</th><th scope="col">Level</th><th scope="col">Points</th></tr></thead><tbody>${D2.rubric.criteria.map((c, i) => {
    const lvl = i === 1 ? 1 : 0;
    return `<tr><th scope="row">${c.name}</th><td><label class="sr" for="${p}-c${i}">Level for ${c.name}</label><select id="${p}-c${i}"${ro ? " disabled" : ""}>${D2.rubric.levels.map((l, j) => `<option${j === lvl ? " selected" : ""}>${l}</option>`).join("")}</select></td><td><span class="pts">${c.pts[lvl]} / ${c.pts[0]}</span></td></tr>`;
  }).join("")}</tbody><tfoot><tr><th scope="row">Question 3</th><td></td><td><span class="pts">7 / 8</span></td></tr></tfoot></table>`;
  const panel = (st) => {
    if (st === "missing")
      return `<div class="w-rail">${card("Tomás Rivera", `${notice("neutral", "alert", "Nothing submitted", "Problem Set 4 closed Sun, Oct 18 · 11:59 pm ET with no receipt. There are no pages to grade, so scores can’t be entered.")}<dl class="facts" style="margin-top:12px"><dt>Status</dt><dd>${badge("missing")}</dd><dt>Counts as</dt><dd>0 in the course calculation (after close)</dd><dt>Allowances</dt><dd>None recorded</dd></dl><div style="display:grid;gap:8px;margin-top:12px">${btn("How missing work counts", { cls: "btn block", go: "S19:missing" })}${btn("Excuse with a reason…", { cls: "btn plain block", go: "S21:allowance", note: "Records an excusal with a reason in course people and allowances; removes it from the denominator" })}${btn("Grant an extension…", { cls: "btn plain block", go: "S21:allowance" })}</div>`)}${card("Excused this assignment", `<p class="meta">Sam Whitaker · excused by Dr. Diane Reyes, Oct 14. No score is entered or shown; it isn’t missing.</p>`)}</div>`;
    const ro = st === "expired", q = curQ[st], qi = qids.indexOf(q), qd = D.questions[qi];
    const done = reviewed[st];
    const scoreBlock = q === "3" ? rubricQ3("ws17", ro) + `<div style="margin-top:8px">${btn("Change a rubric rule…", { cls: "btn plain", icon: "table", go: "S18:impact", note: "Previews which scored answers would change before anything is applied" })}</div>` :
      `<div class="w-score"><div class="w-field"><label for="ws17-score">Score for ${q}</label><input id="ws17-score" type="text" inputmode="decimal" value="${st === "received" ? "" : D.marks[q]}"${ro ? " readonly" : ""} aria-describedby="ws17-max"></div><span class="meta" id="ws17-max">of ${qd.max} points · points only, no rubric</span></div>`;
    const comment = field({ id: "ws17-cm", label: `Comment on ${q} <span class="meta">· the learner sees this after release</span>`, type: "textarea", rows: 3, value: st === "received" ? "" : D.comments[q], readonly: ro });
    const remaining = qids.length - done.length;
    const complete = st === "graded" ? `${badge("graded")}<p class="meta" style="margin-top:6px">Review marked complete Mon, Oct 19 · 10:05 am ET by Dr. Diane Reyes. Aisha can’t see anything until it’s released.</p><div style="display:grid;gap:8px;margin-top:10px">${btn("Prepare release", { cls: "btn primary block", go: "S20:preview" })}${btn("Next: Ben Okafor", { cls: "btn block", go: "S17:received", note: "Opens the next unreviewed submission" })}</div>` :
      ro ? btn("Mark review complete", { cls: "btn primary block", disabled: true, describedby: "ws17-why", note: "Access ended" }) + `<p class="meta" id="ws17-why">Your grading access ended. Nothing can be saved.</p>` :
      btn("Mark review complete", { cls: "btn primary block", disabled: true, describedby: "ws17-why", note: `${remaining} questions not reviewed` }) + `<p class="meta" id="ws17-why">${remaining} of 5 questions not reviewed yet. Scores you enter are saved but don’t count as a completed review.</p>`;
    return `<div class="w-rail">${card(`Question ${q} <span class="meta" style="font-weight:400">· ${qd.max} points</span>`, `<p class="meta" style="margin-bottom:10px">${esc(qd.text)}</p>${scoreBlock}<div style="height:10px"></div>${comment}${ro ? "" : `<p class="meta" style="margin-top:6px">${st === "received" ? "Not saved yet" : "Saved · 9:42 am ET"}</p>`}`)}
${card("Review", `${checks(qids.map((x) => [done.includes(x) ? "ok" : x === q ? "todo" : "todo", `Question ${x}${done.includes(x) ? ` · ${D.marks[x]}/${D.questions[qids.indexOf(x)].max}` : x === q ? " · open now" : " · not reviewed"}`]), "Review checklist")}${st === "graded" ? `<div style="display:flex;justify-content:space-between;align-items:baseline;margin:12px 0 6px"><b>Total</b><span class="w-total">27<span class="meta" style="font-size:15px"> / 30</span></span></div>${field({ id: "ws17-ov", label: "Overall comment", type: "textarea", rows: 2, value: D.overall })}` : ""}<div style="margin-top:12px">${complete}</div>`)}
${card("Course AI rule", `<p class="meta">${esc(D.a.policy)} Aisha’s receipt records no AI-assistance disclosure.</p>`)}</div>`;
  };
  reg("S17", {
    states: [
      ["received", "Received", 0],
      ["progress", "In progress", 1],
      ["graded", "Graded", 2],
      ["missing", "Missing / excused", 3],
      ["expired", "Access expired", 4],
    ],
    url: (st) => `app.whiteboard.example/teach/phys-110/grading/ps4/${{ missing: "tomas-rivera", expired: "ben-okafor" }[st] || "aisha-rahman"}`,
    web(st) {
      const who = st === "expired" ? MAYA : D2.staff;
      const banner = st === "expired" ? `<div class="w-banner" role="alert" style="background:var(--wb-error-bg, var(--wb-warning-bg))">${ic("lock")}<span><b>Your grading access for PHYS 110 ended Sun, Oct 18 · 11:59 pm ET.</b> Scores and comments are read-only. Your saved work (Ben Okafor, questions 1a–1b) is kept. Dr. Diane Reyes can extend teaching-assistant access.</span></div>` : "";
      const name = sel[st];
      const evidence = st === "missing" ? card("Submission", `<div class="i-hero" style="padding:30px 0"><span class="glyph">${ic("doc")}</span><h2 style="font-size:18px">No submission</h2><p class="meta">No receipt exists for Problem Set 4. Missing is a status, not a score you enter.</p></div>`) :
        card(`${esc(name)} · Attempt 1`, `<p class="meta" style="margin-bottom:10px">${name === "Aisha Rahman" ? `Receipt <code>${D.receipt.ref}</code> · ${D.receipt.at}` : "Receipt AH-PHYS110-017 · Fri, Oct 16 · 10:42 pm ET"} · 4 pages</p>${qsel(qids, curQ[st], "Question", (x) => (reviewed[st].includes(x) ? ic("check") : ""))}<div style="max-width:360px;margin:14px auto 0">${page(curQ[st] === "3" ? "3" : curQ[st] === "2" ? "2" : "1", curQ[st], curQ[st] === "3" ? { mark: [70, 148] } : {})}</div><div style="display:flex;justify-content:center;gap:8px;margin-top:10px;flex-wrap:wrap">${btn("Read page text", { cls: "btn plain", note: "Transcription of the page (text alternative)" })}${btn("Add a marker", { cls: "btn plain", icon: "pin", note: "Places a numbered marker the learner sees with the comment" })}${btn("Enlarge", { cls: "btn plain", note: "Full-size page" })}</div>`);
      return webStaff({ nav: "grading", tool: "", who, crumbs: [...crumbsG, ["Problem Set 4"]], url: this.url(st), banner, body: webHead("Problem Set 4: Kinematics", tally, `<div style="display:flex;gap:8px;flex-wrap:wrap">${btn("Gradebook", { cls: "btn", icon: "table", go: "S19:graded" })}${st === "expired" ? "" : btn("Prepare release", { cls: "btn", icon: "publish", go: st === "received" ? "S20:none" : "S20:preview" })}</div>`) + `<div class="w-grid grade3">${card("Submissions", roster(st), { flush: false })}${evidence}${panel(st)}</div>` });
    },
    ios(st) {
      const ro = st === "expired";
      if (st === "missing") return iStaff({ back: ["Problem Set 4", "S17:received"], title: "Tomás Rivera", trail: K.iStaffAvatar, body: `<div class="i-hero"><span class="glyph">${ic("doc")}</span><h1 style="font-size:24px">No submission</h1><p class="i-sub" style="margin:0">Closed Sun, Oct 18 · 11:59 pm ET. Nothing to grade.</p></div>` + group([ival("Status", badge("missing")), ival("Counts as", "0 after close"), row("How Missing Work Counts", "", { go: "S19:missing" }), row("Excuse with a Reason…", "", { go: "S21:allowance" })]) + group([row("Sam Whitaker", "Excused by Dr. Diane Reyes · no score shown", { trail: badge("excused") })], { h: "Also not graded" }) });
      const q = curQ[st];
      const pickers = `<div class="i-seg" role="group" aria-label="Question">${qids.map((x) => `<button type="button" aria-pressed="${x === q}" data-note="Question ${x}">${reviewed[st].includes(x) ? "✓ " : ""}${x}</button>`).join("")}</div>`;
      const sh = st === "progress" ? `<div class="i-sheet-wrap" role="dialog" aria-modal="true" aria-label="Grade question 3"><div class="i-sheet"><div class="i-grabber" aria-hidden="true"></div><h2>Question 3 · 7 / 8</h2><p class="meta">Kinematics problem-solving v2 · Saved 9:42 am</p>${group(D2.rubric.criteria.map((c, i) => ival(c.name.replace("Sets up vertical motion with the same time variable", "Same time variable").replace("Substitutes with the correct sign for g", "Correct sign for g").replace("Final answer with units", "Units"), `${D2.rubric.levels[i === 1 ? 1 : 0]} · ${c.pts[i === 1 ? 1 : 0]}`, { note: "Choose a level" })))}${group([`<div class="i-fieldrow" style="width:100%"><div class="i-field"><label for="is17-cm">Comment</label><input id="is17-cm" value="${esc(D.comments["3"])}"></div></div>`])}${group([row("Change a Rubric Rule…", "", { go: "S18:impact" })])}<div style="height:8px"></div><button type="button" class="i-btn secondary" data-note="Closes the sheet; scores stay saved">Done</button></div></div>` : "";
      const bottom = st === "graded" ? btn("Prepare Release", { cls: "i-btn", go: "S20:preview" }) : ro ? btn("Mark Review Complete", { cls: "i-btn", disabled: true, note: "Access ended" }) : btn("Grade Question " + q, { cls: "i-btn", go: "S17:progress" });
      return iStaff({ back: ["Problem Set 4", "S19:graded"], title: sel[st], trail: K.link(`<span class="i-avatar">${ro ? "MC" : "DR"}</span>`, { cls: "i-iconbtn", label: "Account: " + (ro ? "Maya Chen" : D2.staff.name), go: "P44:editable" }), body: (ro ? notice("error", "lock", "Grading access ended Oct 18", "Read-only. Your saved scores are kept.") + '<div style="height:10px"></div>' : "") + `<div class="i-card" style="display:flex;justify-content:space-between;align-items:center"><span>${sel[st]} · Attempt 1</span>${badge(ro ? "accessEnded" : aishaSt[st], ro ? "Read-only" : null)}</div>` + pickers + `<div class="i-card">${page(q === "3" ? "3" : q === "2" ? "2" : "1", q, q === "3" ? { mark: [70, 148] } : {})}<p class="meta" style="text-align:center">Pinch to zoom · ${link("Read page text", { note: "Text alternative" })}</p></div>` + (st === "graded" ? group([ival("Total", "27 / 30"), ival("Review", "Complete · not released")]) : "") + `<p class="i-foot">Comparing pages with the rubric is faster on a larger screen.</p>`, bottom, sheet: sh });
    },
    notes: {
      received: { web: "Three panes: roster with status, the learner’s page for the selected question, and the score/comment panel. Question selector keeps page, score and comment aligned. Complete is disabled with a count of what’s left.", ios: "Learner title + question segmented control above a full-width page; grading happens in a sheet. Phone grading is for urgent review (not a parity claim)." },
      progress: { web: "Rubric question: level selects per criterion with live total; ‘Change a rubric rule…’ is the S17→S18 route. Saved ≠ reviewed: the checklist shows what’s still open.", ios: "Grading sheet with rubric levels, comment and the rubric-change route." },
      graded: { web: "Complete review is ‘Graded · staff only’ (purple, distinct from Released green). Prepare release → S20; the learner sees nothing yet.", ios: "Total and ‘Complete · not released’; Prepare Release." },
      missing: { web: "Missing: no score field at all; explains how it counts and routes to S19. Excuse/extension open course allowances (S21, Batch 04). Excused learners are listed as excused, not zero.", ios: "Hero explanation; excused learner shown separately." },
      expired: { web: "TA (Maya Chen) after access ended: error banner, all inputs read-only, saved work kept, who can restore access.", ios: "Error notice; Mark complete disabled." },
    },
    a11y: ["Roster status is text in a badge, not colour.", "Rubric level selects have per-criterion labels; total is in a table footer.", "Disabled Complete keeps a visible reason linked by aria-describedby."],
  });

  /* ============ S18 RUBRIC-CHANGE PREVIEW ============ */
  const R = D3.rule;
  const impactTable = (st) => {
    const rows = st === "overrides" ? R.rows.filter((r) => r[4] === "override") : R.rows;
    return `<div class="w-tablewrap"><table class="w-table"><caption class="sr">Answers affected by the proposed change</caption><thead><tr><th scope="col">Learner</th><th scope="col">C2 level</th><th scope="col" class="num">Q3 now</th><th scope="col" class="num">Q3 after</th><th scope="col">Effect</th></tr></thead><tbody>${rows.map(([n, lvl, now, next, k, why]) => `<tr${k === "override" && st === "overrides" ? ' class="sel"' : ""}><th scope="row">${esc(n)}</th><td>${lvl}</td><td class="num">${now}</td><td class="num">${k === "calc" ? `<b>${next}</b>` : next}</td><td>${k === "calc" ? badge("recalculated", "+0.5 · recalculated") : k === "override" ? badge("override") + (why ? `<div class="meta">${esc(why)}</div>` : "") : `<span class="meta">Rule applies when scored</span>`}</td></tr>`).join("")}</tbody></table></div>`;
  };
  reg("S18", {
    states: [
      ["none", "No impact", 0],
      ["impact", "Impact found", 1],
      ["overrides", "Overrides preserved", 2],
      ["approval", "Approval required", 3],
      ["applied", "Applied", 4],
    ],
    url: () => "app.whiteboard.example/teach/phys-110/rubrics/kinematics/change-preview",
    web(st) {
      const ta = st === "approval", none = st === "none", applied = st === "applied";
      const rule = card("Proposed change", none ? `<dl class="facts"><dt>Criterion</dt><dd>C3 · Final answer with units</dd><dt>Now</dt><dd>Missing: “No final answer”</dd><dt>Proposed</dt><dd>Missing: “No final answer, or units absent and value wrong”</dd><dt>Points</dt><dd>Unchanged (0)</dd></dl>` :
        `<dl class="facts"><dt>Criterion</dt><dd>${R.crit}</dd><dt>Now · v2</dt><dd>${R.now}</dd><dt>Proposed</dt><dd><b>${R.next}</b></dd></dl><p class="meta" style="margin-top:8px">${ta ? "Proposed by Maya Chen (TA) · Mon, Oct 19 · 11:02 am" : "Edited from grading · Mon, Oct 19 · 11:02 am"}</p>`);
      const summary = none ? notice("success", "check", "No scored answer uses this level", "Applying changes the wording for answers scored from now on. No existing score changes.") :
        `<div class="w-scope"><div><span class="meta">Recalculated</span><b>7</b><span class="meta">+0.5 each on Q3</span></div><div><span class="meta">Manual scores kept</span><b>2</b><span class="meta">never changed by a rule</span></div><div><span class="meta">Not yet scored</span><b>1</b><span class="meta">new rule applies</span></div><div><span class="meta">Unaffected</span><b>31</b><span class="meta">scored Complete or Missing on C2</span></div></div>`;
      const scope = `<ul class="w-list inset"><li>${ic("pencil")}<div class="grow"><span class="title">Problem Set 4 · Question 3</span><div class="meta">Not released · scores update when applied</div></div></li><li>${ic("lock")}<div class="grow"><span class="title">Problem Set 3 · Question 2</span><div class="meta">Released Oct 9 with v1 · not changed</div></div></li></ul>`;
      const act = applied ? `${badge("published", "Version 3 applied")}<p class="meta" style="margin-top:6px">Applied by Dr. Diane Reyes · Mon, Oct 19 · 11:20 am ET. 7 scores recalculated; 2 manual scores kept; v2 kept in history.</p><div style="margin-top:10px">${btn("Return to grading", { cls: "btn primary block", go: "S17:progress" })}</div>` :
        ta ? `${badge("approval")}<p class="meta" style="margin-top:6px" id="ws18-why">Only the instructor can apply rubric changes. Sent to Dr. Diane Reyes at 11:04 am; nothing changes until she applies it.</p><div style="display:grid;gap:8px;margin-top:10px">${btn("Apply change", { cls: "btn primary block", disabled: true, describedby: "ws18-why", note: "Instructor only" })}${btn("Withdraw request", { cls: "btn block", go: "S17:progress", note: "Withdraws the proposal; grading continues with v2" })}</div>` :
        `<div style="display:grid;gap:8px">${btn(none ? "Apply wording change" : "Apply to 7 answers", { cls: "btn primary block", go: "S18:applied", note: "Creates rubric version 3" })}${btn("Cancel", { cls: "btn block", go: "S17:progress", note: "Discards the proposal; nothing changes" })}</div><p class="meta" style="margin-top:8px">Applying creates version 3. Released work and manual scores are never changed by this action.</p>`;
      return webStaff({ nav: "grading", tool: "rubrics", who: ta ? MAYA : D2.staff, crumbs: [...crumbsG, ["Problem Set 4", "S17:progress"], ["Rubric change"]], url: this.url(st), body: webHead("Preview rubric change", "Kinematics problem-solving · v2 → v3 · used in 2 assignments", applied ? badge("published", "v3 current") : "") + `<div class="w-grid edit"><div class="w-stack">${rule}${card(none ? "Impact" : "Affected answers", summary + (none ? "" : `<div style="height:12px"></div>${st === "overrides" ? notice("info", "pencil", "Manual scores are kept", "These two scores were set by hand. A rule change never overwrites them; change them one by one in grading if needed.") + '<div style="height:12px"></div>' : ""}${impactTable(st)}`))}</div><div class="w-rail">${card(applied ? "Applied" : "Decision", act)}${card("Where this rubric is used", scope)}</div></div>` });
    },
    ios(st) {
      const ta = st === "approval", none = st === "none", applied = st === "applied";
      const rows = (st === "overrides" ? R.rows.filter((r) => r[4] === "override") : R.rows.filter((r) => r[4] !== "not").slice(0, 5)).map(([n, , now, next, k]) => row(n, `Q3 ${now} → ${next}`, { trail: badge(k === "calc" ? "recalculated" : "override", k === "calc" ? "+0.5" : "Kept") }));
      return iStaff({ back: ["Grading", "S17:progress"], title: "Rubric Change", body: desktopNote("Comparing every affected learner, level and override is easier on a computer.", "app.whiteboard.example/teach/phys-110/rubrics/kinematics/change-preview") + '<div style="height:12px"></div>' + group(none ? [ival("Criterion", "C3 · Units"), ival("Change", "Wording only")] : [ival("Criterion", "C2 · Sign of g"), row("Now", R.now), row("Proposed", R.next)], { h: "Change · v2 → v3" }) + (none ? notice("success", "check", "No scored answer affected", "") : group(rows, { h: st === "overrides" ? "Manual scores kept · 2" : "7 recalculated · 2 kept · 1 not scored", foot: st === "overrides" ? "Rule changes never overwrite manual scores." : "Problem Set 3 (released, v1) is not changed." })), bottom: applied ? notice("success", "check-circle", "Version 3 applied", "Oct 19 · 11:20 am") + btn("Return to Grading", { cls: "i-btn", go: "S17:progress" }) : ta ? btn("Apply", { cls: "i-btn", disabled: true, note: "Instructor only — request sent" }) + `<p class="i-foot">Waiting for Dr. Diane Reyes.</p>` : btn(none ? "Apply Wording" : "Apply to 7 Answers", { cls: "i-btn", go: "S18:applied" }) + btn("Cancel", { cls: "i-btn secondary", go: "S17:progress" }) });
    },
    notes: {
      none: { web: "Wording-only edit to a level nobody was scored at: success notice says no score changes; apply still versions the rubric.", ios: "Same summary in rows." },
      impact: { web: "Impact table is the decision evidence: learner, level, Q3 now → after, effect. Counts above it. Released work (PS3, v1) listed as unchanged. Apply and Cancel both return to grading (S18→S17).", ios: "Desktop recommended (mapped). Summary rows with old → new; ‘Best on a computer’ card." },
      overrides: { web: "Manual scores filtered and explained: who set them, when, why; rule changes never overwrite them.", ios: "Filtered list of kept scores." },
      approval: { web: "TA view: Apply disabled with a reason; request status and a withdraw route.", ios: "Apply disabled; waiting line." },
      applied: { web: "Version 3 applied with who/when and counts; v2 kept in history; return to grading.", ios: "Applied notice + Return." },
    },
    a11y: ["Impact is a real table with row headers; effect is text, not colour.", "Disabled Apply references its reason.", "Numbers use tabular figures and right alignment."],
  });

  /* ============ S19 GRADEBOOK ============ */
  const focus = { ungraded: ["Ben Okafor", "ps4"], missing: ["Noah Fischer", "ps4"], excused: ["Sam Whitaker", "ps4"], graded: ["Aisha Rahman", "ps4"], released: ["Aisha Rahman", "ps3"] };
  const cell = ([v, s]) => `<span class="cell">${v === "—" ? `<span class="meta">—</span>` : esc(v)}${s === "graded" ? badge("graded", "Staff only") : s === "released" ? `<span class="vis">${ic("eye")}<span class="sr">Released</span></span>` : s === "missing" ? badge("missing") : s === "excused" ? badge("excused") : s === "notReviewed" ? badge("notReviewed", "Not graded") : s === "resultsHeld" ? `<span class="vis">not released</span>` : ""}</span>`;
  const gbTable = (st, p) => `<div class="w-tablewrap"><table class="w-table w-gb"><caption class="sr">PHYS 110 gradebook</caption><thead><tr><th scope="col">Student</th><th scope="col">PS3 <span class="meta">/30</span></th><th scope="col">Quiz 2 <span class="meta">/10</span></th><th scope="col">PS4 <span class="meta">/30</span></th><th scope="col">Quiz 3 <span class="meta">/10</span></th><th scope="col" class="num">Assignments · staff</th><th scope="col" class="num">Learner sees</th></tr></thead><tbody>${D3.gb.map((r) => {
    const f = focus[st];
    const td = (k) => `<td${f[0] === r.name && f[1] === k ? ' class="focus" aria-current="true"' : ""}>${cell(r[k])}</td>`;
    return `<tr><th scope="row">${esc(r.name)}</th>${td("ps3")}${td("q2")}${td("ps4")}${td("q3")}<td class="num">${r.cat}</td><td class="num">${r.learner}</td></tr>`;
  }).join("")}</tbody></table></div>`;
  const explain = {
    ungraded: ["Ben Okafor · PS4", "Received, not graded yet", "Excluded from the current calculation until review is complete. Not a zero.", "86.7% = 78 / 90 (PS1–PS3)", ["Open in grading", "S17:received"]],
    missing: ["Noah Fischer · PS4", "Missing", "Closed Sun, Oct 18 with no receipt, so it now counts as 0 in the staff calculation. Noah still sees 73.3% until the next release includes the Missing status.", "55.0% = 66 / 120 (PS1–PS4, PS4 = 0)", ["How missing appears in grading", "S17:missing"]],
    excused: ["Sam Whitaker · PS4", "Excused", "Removed from the denominator — not a zero and not missing. Sam sees ‘Excused’ after release.", "84.4% = 76 / 90 (PS1–PS3)", null],
    graded: ["Aisha Rahman · PS4", "Graded · staff only", "Included in the staff calculation. Aisha doesn’t see it until it’s released, so her view still shows 87.8%.", "88.3% = 106 / 120 staff · 87.8% = 79 / 90 learner", ["Open Aisha’s work", "S17:graded"]],
    released: ["Aisha Rahman · PS3", "Released Fri, Oct 9", "The learner sees this approved snapshot. Later edits create a new draft that stays staff-only until re-released.", "24 / 30 · counts in both views", ["Open Aisha’s work", "S17:graded"]],
  };
  reg("S19", {
    states: [
      ["ungraded", "Ungraded", 0],
      ["missing", "Missing", 1],
      ["excused", "Excused", 2],
      ["graded", "Graded", 3],
      ["released", "Released", 4],
    ],
    url: () => "app.whiteboard.example/teach/phys-110/gradebook",
    web(st) {
      const [t, s, why, calc, go] = explain[st];
      return webStaff({ nav: "grading", tool: "", crumbs: [...crumbsG.slice(0, 1), ["PHYS 110 gradebook"]], url: this.url(st), body: webHead("Gradebook", "PHYS 110 · 44 students · showing 6 · sorted by name", `<div style="display:flex;gap:8px;flex-wrap:wrap">${btn("Sort and filter", { cls: "btn", icon: "sliders", note: "Sort by name, status or score; filter by status" })}${btn("Prepare release", { cls: "btn primary", icon: "publish", go: "S20:preview" })}</div>`) + `<div class="w-grid edit"><div class="w-stack">${card("", gbTable(st), { label: "Gradebook table" })}<p class="meta">Status and score are separate: a badge says what the record is; the number says what it’s worth. ${ic("eye")} = learner can see it.</p></div><div class="w-rail">${card(t, `<p>${badge({ ungraded: "notReviewed", missing: "missing", excused: "excused", graded: "graded", released: "released" }[st], s)}</p><p style="margin-top:8px">${why}</p><p class="meta" style="margin-top:8px">${ic("calc")} ${calc}</p>${go ? `<div style="margin-top:10px">${btn(go[0], { cls: "btn block", go: go[1] })}</div>` : ""}`)}${card("Assignments category · 40%", `<ul class="w-checks"><li>${ic("check")}<span><b>Graded</b> counts in the staff view; <b>released</b> counts in the learner view.</span></li><li>${ic("clock")}<span><b>Not graded</b> is left out until review is complete.</span></li><li>${ic("alert")}<span><b>Missing</b> counts as 0 after the close date.</span></li><li>${ic("info")}<span><b>Excused</b> is removed from the denominator.</span></li></ul><p class="meta" style="margin-top:8px">Quizzes 20% · Lab reports 15% · Exams 25%.</p>`)}</div></div>` });
    },
    ios(st) {
      const [t, s, why, calc, go] = explain[st];
      const sh = sheet(t, s, `<p style="padding:0 2px">${why}</p><p class="meta" style="margin-top:8px">${calc}</p>` + (go ? group([row(go[0], "", { go: go[1] })]) : ""), "Done");
      return iStaff({ back: ["Grading", "S17:graded"], title: "Gradebook", body: desktopNote("Comparing many students and calculation columns is easier on a computer.", "app.whiteboard.example/teach/phys-110/gradebook") + '<div style="height:12px"></div>' + group(D3.gb.map((r) => row(r.name, `PS4 ${r.ps4[0]} · Assignments ${r.cat}`, { trail: badge(r.ps4[1] === "notReviewed" ? "notReviewed" : r.ps4[1], r.ps4[1] === "notReviewed" ? "Not graded" : null), note: "Opens the score-detail sheet" })), { h: "Problem Set 4", foot: "Staff calculation. Learners see released results only." }), sheet: sh });
    },
    notes: {
      ungraded: { web: "Full-width table; status badge and score are separate columns of meaning. Rail explains the focused cell and its calculation; ‘Open in grading’ is S19→S17.", ios: "Mapped list (desktop recommended) with a score-detail sheet." },
      missing: { web: "Missing enters the denominator after close; staff and learner percentages differ and the rail says why.", ios: "Detail sheet with the same explanation." },
      excused: { web: "Excused leaves the denominator; it is neither 0 nor missing.", ios: "Same." },
      graded: { web: "Graded is staff-only (purple badge); learner view excludes it until release. Prepare release is S19→S20.", ios: "Same." },
      released: { web: "Released cell shows the eye marker; later edits become a staff-only draft (see S20 ‘new draft’).", ios: "Same." },
    },
    a11y: ["Focused cell uses aria-current plus outline, not colour only.", "Eye icon has a hidden ‘Released’ label.", "Column headers state the maximum points."],
  });

  /* ============ S20 RELEASE AND RECORDS ============ */
  const steps = (cur) => `<ol class="w-steps" aria-label="Release steps">${["Scope", "Exceptions", "Preview", "Release"].map((t, i) => `<li${i === cur ? ' aria-current="step"' : ""}${i < cur ? ' class="done"' : ""}><span class="n">${i < cur ? ic("check") : i + 1}</span><span class="lbl">${t}</span></li>`).join("")}</ol>`;
  const scope = (st) => {
    const n = st === "none" ? [0, 0, 41, 2] : [40, 2, 0, 2];
    return `<div class="w-scope"><div><span class="meta">Ready to release</span><b>${n[0]}</b><span class="meta">${st === "none" ? "no review complete" : "39 graded + 1 excused"}</span></div><div><span class="meta">Held</span><b>${n[1]}</b><span class="meta">review incomplete</span></div>${st === "none" ? `<div><span class="meta">Not reviewed</span><b>41</b><span class="meta">received</span></div>` : ""}<div><span class="meta">Missing</span><b>${n[3]}</b><span class="meta">status only · no feedback</span></div></div>`;
  };
  const preview = (st) => {
    const nd = st === "newdraft";
    return `<dl class="facts"><dt>Learner</dt><dd>Aisha Rahman · 1 of 40 ${btn("Next", { cls: "btn plain", note: "Shows the next learner’s exact payload" })}</dd><dt>Attempt</dt><dd>Attempt 1 · receipt <code>${D.receipt.ref}</code></dd><dt>Score</dt><dd>${nd ? `<span class="w-diff"><s>27</s> → <b>28</b></span>` : "27"} / 30</dd><dt>Question 3</dt><dd>${nd ? `<span class="w-diff"><s>7</s> → <b>8</b></span>` : "7"} / 8 · Kinematics problem-solving v2</dd><dt>Comments</dt><dd>5 question comments + overall${nd ? " · Q3 comment changed" : ""}</dd><dt>Prepared</dt><dd>${nd ? "Thu, Oct 22 · 10:58 am ET" : "Tue, Oct 20 · 4:02 pm ET"} by Dr. Diane Reyes</dd></dl>`;
  };
  const history = (st) => `<ul class="w-timeline">${(st === "released" || st === "newdraft" ? [["publish", "Released to 40 learners", "Tue, Oct 20 · 4:10 pm · Dr. Diane Reyes · snapshot R1"]] : []).concat(st === "newdraft" ? [["pencil", "Aisha Rahman · Q3 regraded 7 → 8", "Thu, Oct 22 · 10:58 am · not released"]] : []).map(([i, t, m]) => `<li>${ic(i)}<div><b>${t}</b><div class="meta">${m}</div></div></li>`).join("") || `<li>${ic("info")}<div><span class="meta">No releases yet for Problem Set 4.</span></div></li>`}</ul>`;
  reg("S20", {
    states: [
      ["none", "No eligible work", 0],
      ["preview", "Preview ready", 1],
      ["stale", "Preview stale", 2],
      ["released", "Released", 3],
      ["newdraft", "New draft held", 4],
    ],
    url: () => "app.whiteboard.example/teach/phys-110/grading/ps4/release",
    web(st) {
      const banner = st === "stale" ? `<div class="w-banner" role="alert" style="background:var(--wb-warning-bg)">${ic("retry")}<span><b>Preview out of date.</b> Maya Chen changed Carmen Díaz’s Question 2 comment at 4:06 pm, after this preview was prepared. Refresh before releasing.</span>${btn("Refresh preview", { cls: "btn", go: "S20:preview" })}</div>` : st === "newdraft" ? `<div class="w-banner" role="status" style="background:var(--wb-warning-bg)">${ic("pencil")}<span><b>1 changed record isn’t released.</b> Aisha Rahman still sees the Oct 20 snapshot (27/30) until you release this update.</span></div>` : "";
      const cur = { none: 0, preview: 2, stale: 2, released: 3, newdraft: 2 }[st];
      let act;
      if (st === "none") act = btn("Release", { cls: "btn primary block", disabled: true, describedby: "ws20-why", note: "Nothing eligible" }) + `<p class="meta" id="ws20-why">No reviews are complete yet. Release opens when at least one review is marked complete.</p>${btn("Open grading", { cls: "btn block", go: "S17:received" })}`;
      else if (st === "stale") act = btn("Release to 40 learners", { cls: "btn primary block", disabled: true, describedby: "ws20-why", note: "Preview out of date" }) + `<p class="meta" id="ws20-why">Refresh the preview first. Releasing an outdated preview isn’t possible.</p>`;
      else if (st === "released") act = `${badge("released", "Released · snapshot R1")}<p class="meta" style="margin-top:6px">Tue, Oct 20 · 4:10 pm ET by Dr. Diane Reyes. 40 learners can see their own feedback. 2 held records stay staff-only.</p>` + handoff("S09", "Each learner now sees their released snapshot on their Feedback page.") + `<div style="display:grid;gap:8px;margin-top:10px">${btn("Return to gradebook", { cls: "btn block", go: "S19:released" })}</div>`;
      else if (st === "newdraft") act = btn("Release update to 1 learner", { cls: "btn primary block", note: "Creates snapshot R2 for Aisha Rahman; R1 stays in her history (S09 re-released)", go: "S20:released" }) + `<p class="meta" style="margin-top:6px">The update names the change (Q3 7 → 8). The Oct 20 snapshot is kept, read-only.</p>`;
      else act = `<div class="w-field"><label style="display:flex;gap:8px;align-items:flex-start;font-weight:400" for="ws20-ok"><input type="checkbox" id="ws20-ok" style="margin-top:3px"> I’ve checked the scope and preview. 40 learners will see scores and comments.</label></div><div style="height:8px"></div>${btn("Release to 40 learners", { cls: "btn primary block", icon: "publish", go: "S20:released" })}`;
      const records = st === "released" || st === "newdraft" ? card("Institution record", `<p>${badge("pendingReview", "Sent · not acknowledged")}</p><p class="meta" style="margin-top:6px" data-handoff="S38">Sent to the institution’s record system Tue, Oct 20 · 4:10 pm. Acknowledgment is separate from release and doesn’t change what learners see. Alder Hill IT reconciles any rejected rows in S38 Connections &amp; reconciliation.</p>`) : "";
      const exceptions = st === "none" ? "" : card("Exceptions", `<ul class="w-list inset"><li>${ic("hourglass")}<div class="grow"><span class="title">Ben Okafor, Priya Nair</span><div class="meta">Held · review not complete</div></div>${badge("heldBack", "Held")}</li><li>${ic("alert")}<div class="grow"><span class="title">Noah Fischer, Tomás Rivera</span><div class="meta">Missing · no feedback to release; status shows in the gradebook</div></div>${badge("missing")}</li><li>${ic("info")}<div class="grow"><span class="title">Sam Whitaker</span><div class="meta">Excused · learner sees ‘Excused’, no score</div></div>${badge("excused")}</li></ul>`);
      return webStaff({ nav: "grading", tool: "", crumbs: [...crumbsG, ["Problem Set 4", "S17:graded"], ["Release"]], url: this.url(st), banner, body: webHead("Release feedback", "Problem Set 4: Kinematics · PHYS 110", steps(cur)) + `<div class="w-grid edit"><div class="w-stack">${card("Scope", scope(st))}${exceptions}${st === "none" ? "" : card(st === "newdraft" ? "Update preview · changed record" : "Exact preview", (st === "stale" ? `<p>${badge("stale")}</p><div style="height:8px"></div>` : "") + preview(st))}</div><div class="w-rail">${card(st === "released" ? "Released" : "Release", act)}${records}${card("Release history", history(st))}</div></div>` });
    },
    ios(st) {
      const back = ["Problem Set 4", "S17:graded"];
      const stepTitle = { none: "Scope", preview: "Step 3 of 4 · Preview", stale: "Step 3 of 4 · Preview", released: "Released", newdraft: "Update · Preview" }[st];
      if (st === "none") return iStaff({ back, title: "Release", body: `<div class="i-hero"><span class="glyph">${ic("hourglass")}</span><h1 style="font-size:24px">Nothing to release yet</h1><p class="i-sub" style="margin:0">No reviews are complete. 41 received, 2 missing.</p></div>` + group([row("Open Grading", "", { go: "S17:received" })]) });
      if (st === "released") return iStaff({ back, title: "Release", body: `<div class="i-hero"><span class="glyph">${ic("check-circle")}</span><h1 style="font-size:24px">Released to 40 learners</h1><p class="i-sub" style="margin:0">Tue, Oct 20 · 4:10 pm ET · snapshot R1</p></div>` + group([ival("Held", "2 · review incomplete"), ival("Institution record", "Sent · not acknowledged")]) + handoff("S09", "Learners now see their released snapshot.") + group([row("Return to Gradebook", "", { go: "S19:released" })]) });
      const nd = st === "newdraft";
      return iStaff({ back, title: "Release", body: `<p class="i-sub">${stepTitle}</p>` + (st === "stale" ? notice("warning", "retry", "Preview out of date", "Carmen Díaz’s Q2 comment changed at 4:06 pm.") + '<div style="height:10px"></div>' : nd ? notice("warning", "pencil", "1 changed record not released", "Aisha still sees 27/30 from Oct 20.") + '<div style="height:10px"></div>' : "") + group(nd ? [ival("Aisha Rahman · Q3", "7 → 8"), ival("Total", "27 → 28 / 30")] : [ival("Ready", "40"), ival("Held", "2"), ival("Missing", "2 · status only")], { h: nd ? "Change" : "Scope" }) + group([ival("Learner", "Aisha Rahman"), ival("Score", nd ? "28 / 30" : "27 / 30"), ival("Attempt", "1 · " + D.receipt.ref), ival("Rubric", "v2")], { h: "Exact preview" }), bottom: st === "stale" ? btn("Refresh Preview", { cls: "i-btn", go: "S20:preview" }) : btn(nd ? "Release Update…" : "Release to 40…", { cls: "i-btn", go: "S20:released", note: "Final step asks for explicit confirmation before releasing" }) });
    },
    notes: {
      none: { web: "Scope shows zero eligible; Release disabled with the reason and a route to grading.", ios: "Hero explanation + Open Grading." },
      preview: { web: "Checklist steps (Scope → Exceptions → Preview → Release). Exact payload per learner (attempt, receipt, score, rubric version, comments). Release needs an explicit confirmation checkbox.", ios: "Step-based review; the final step is an explicit confirmation." },
      stale: { web: "A change after preview names who/what/when and blocks release until refreshed (no releasing an outdated payload).", ios: "Notice + Refresh as the only action." },
      released: { web: "Release record (who, when, snapshot id), held records stay staff-only; S20→S09 is a role handoff explained in words. Institution record ‘sent · not acknowledged’ is separate; S38 reconciles it (handoff).", ios: "Hero + record status." },
      newdraft: { web: "Post-release regrade becomes a held draft with an old → new diff; releasing creates snapshot R2 and keeps R1 (matches S09 re-released).", ios: "Change summary and Release Update." },
    },
    a11y: ["Steps use aria-current=step.", "Release confirmation is a labelled checkbox, not a hidden modal.", "Stale/held banners use role=alert/status with words, not colour only."],
  });
})();
