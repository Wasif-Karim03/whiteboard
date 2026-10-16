/* Batch 03 learner screens: S10 quiz attempt, S11 course conversation, S12 calendar, S13 updates.
   Student shell from batch01/kit.js. Fictional data; dates follow the Batch 01 week (today Thu, Oct 15). */
(function () {
  "use strict";
  const K = window.K;
  const { D, D2, D3, ic, esc, badge, btn, link, notice, card, web, webHead, courseTabs, ios, group, row, sheet, field, toggle, av, role, handoff } = K;
  const reg = K.reg;
  const Q = D2.quiz, A = D3.quiz;

  /* ============ S10 QUIZ ATTEMPT ============ */
  const qCrumbs = [["Courses", "S02:current"], ["PHYS 110", "S03:published"], ["Quizzes"]];
  const qUrl = "app.whiteboard.example/courses/phys-110/quizzes/quiz-3";
  // One item, answerable (p = id prefix) or read-only snapshot.
  const item = (it, p, o = {}) => {
    const a = A.answers[it.id], ro = o.ro, blank = o.blank && o.blank.includes(it.id);
    let ctl;
    if (it.options) ctl = `<fieldset class="w-choices"><legend class="sr">${it.id} answer</legend>${it.options.map((t, i) => `<label for="${p}-${it.id}-${i}"><input type="radio" id="${p}-${it.id}-${i}" name="${p}-${it.id}"${!blank && a === i ? " checked" : ""}${ro ? " disabled" : ""}>${esc(t)}</label>`).join("")}</fieldset>`;
    else if (it.type === "Numeric") ctl = `<div class="w-field" style="max-width:220px"><label for="${p}-${it.id}">Answer in seconds</label><input id="${p}-${it.id}" type="text" inputmode="decimal" value="${blank ? "" : esc(a)}"${ro ? " readonly" : ""}></div>`;
    else ctl = `<div class="w-field"><label for="${p}-${it.id}">Your explanation</label><textarea id="${p}-${it.id}" rows="4"${ro ? " readonly" : ""}>${blank ? "" : esc(a)}</textarea></div>`;
    const status = ro ? "" : blank ? `<span class="meta">Not answered</span>` : o.device ? badge("deviceOnly", "On this device") : badge("answersSaved", "Saved");
    return `<section class="w-card w-qcard" aria-labelledby="${p}-${it.id}-h"><div class="qh"><h2 id="${p}-${it.id}-h" style="font-size:16px">Question ${it.id.slice(1)} <span class="meta">· ${it.type} · ${it.pts} points</span></h2>${status}</div><p>${esc(it.prompt)}</p>${ctl}</section>`;
  };
  const rules = (o = {}) => `<dl class="facts"><dt>Window</dt><dd>${Q.window}</dd><dt>Your time</dt><dd><b>${A.mine} minutes</b> · course limit ${A.base} minutes + your ${A.allowance} allowance</dd><dt>Attempts</dt><dd>${o.used || 0} of ${Q.attempts} used · highest attempt counts</dd><dt>Results</dt><dd>Released ${Q.release.toLowerCase()} · Mon, Oct 19 · 11:59 pm ET</dd></dl>`;
  const timer = (st) => {
    const off = st === "offline";
    return card("", `<div class="w-timer" role="timer" aria-label="Time remaining"><span class="meta">Time left</span><b>${off ? "21:06" : "26:41"}</b><span class="meta">of your ${A.mine} minutes · started ${A.started}</span></div>
<div style="margin:12px 0">${off ? badge("deviceOnly") : badge("answersSaved", "All answers saved · 10:17:44 am")}</div>
<p class="meta">Answered ${off ? 3 : 3} of 4. If you leave, the timer keeps running and your answers stay saved.</p>
<div style="display:grid;gap:8px;margin-top:12px">${off ? btn("Review and submit", { cls: "btn primary block", disabled: true, describedby: "ws10-offwhy", note: "Needs a connection" }) + `<p class="meta" id="ws10-offwhy">Submitting needs a connection. Nothing has been sent since 10:21 am.</p>` : btn("Review and submit", { cls: "btn primary block", go: "S10:submitted", note: "Opens a review step listing unanswered items, then Submit attempt" })}</div>`, { label: "Attempt status" });
  };
  const sNote = (t) => `<p class="meta" style="margin-top:8px">${t}</p>`;
  reg("S10", {
    states: [
      ["available", "Available", 0],
      ["progress", "In progress", 1],
      ["offline", "Offline", 2],
      ["submitted", "Submitted", 3],
      ["held", "Results held", 4],
    ],
    url: (st) => qUrl + (st === "progress" || st === "offline" ? "/attempt/1" : ""),
    web(st) {
      const base = { nav: "courses", crumbs: qCrumbs, url: this.url(st) };
      const head = (meta, right = "") => webHead(Q.title, meta, right) + courseTabs("quizzes");
      if (st === "available")
        return web({ ...base, body: head("PHYS 110 · Module 3 · 4 questions · 10 points") + `<div class="w-grid"><div class="w-stack">${card("Before you start", rules() + `<p style="margin-top:12px">Answers save as you go. You can close the tab and return; the timer keeps running once you start.</p><div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">${btn("Start attempt 1", { cls: "btn primary", go: "S10:progress", note: "Starts your 30-minute timer" })}${btn("Return to the course", { cls: "btn", go: "S03:published" })}</div>`)}</div><div class="w-stack">${card("Allowances", `<p>Your quiz time allowance applies to every timed quiz in PHYS 110. It is separate from assignment extensions — your Problem Set 4 dates don’t change this quiz.</p>`)}${card("Course AI rule", `<p class="meta">Not permitted during quizzes. Use only your own notes and a calculator.</p>`)}</div></div>` });
      if (st === "progress" || st === "offline") {
        const off = st === "offline";
        const banner = off ? `<div class="w-banner" role="status" style="background:var(--wb-warning-bg)">${ic("offline")}<span><b>You’re offline.</b> Your answers since 10:21 am are saved in this browser only and haven’t been sent. Keep this tab open; they’ll send when you reconnect. The timer keeps running.</span></div>` : "";
        const items = Q.items.map((it, i) => item(it, "ws10", { device: off && i === 3, blank: ["Q4"].filter(() => !off) })).join("");
        return web({ ...base, banner, body: webHead(Q.title, `Attempt 1 · ${off ? "offline" : "in progress"}`) + `<div class="w-grid edit"><div class="w-stack">${items}</div><div class="w-rail">${timer(st)}${card("Questions", `<ol class="w-list inset">${Q.items.map((it, i) => `<li><span class="grow">Question ${i + 1}</span>${(off ? true : i < 3) ? badge(off && i === 3 ? "deviceOnly" : "answersSaved", off && i === 3 ? "On device" : "Saved") : `<span class="meta">Not answered</span>`}</li>`).join("")}</ol>`)}</div></div>` });
      }
      const sub = st === "submitted";
      const receipt = card("", `<div style="display:flex;gap:12px;align-items:flex-start"><span style="color:var(--wb-success)">${ic("check-circle")}</span><div><h2 style="font-size:19px">Attempt 1 submitted</h2><p class="meta">${A.at} · reference <code>${A.ref}</code></p></div></div><dl class="facts" style="margin-top:12px"><dt>Answered</dt><dd>4 of 4</dd><dt>Time used</dt><dd>17 of 30 minutes</dd><dt>Questions</dt><dd>Quiz version 1 · your answers and these questions are kept together, even if the quiz is edited later</dd><dt>Attempts left</dt><dd>1 · until Mon, Oct 19 · 11:59 pm ET</dd></dl>`);
      const held = card("", `<div style="display:flex;gap:12px;align-items:flex-start"><span style="color:var(--wb-neutral)">${ic("eye-off")}</span><div><h2 style="font-size:19px">Results aren’t released yet</h2><p style="margin-top:4px">Dr. Diane Reyes releases Quiz 3 results ${Q.release.toLowerCase()} — Mon, Oct 19 · 11:59 pm ET. No scores, correct answers or comments are shown before then.</p></div></div>`);
      const answers = card("Your submitted answers", `<p class="meta" style="margin-bottom:10px">Read-only snapshot of Attempt 1.</p><div class="w-stack">${Q.items.map((it) => item(it, sub ? "ws10s" : "ws10h", { ro: true })).join("")}</div>`);
      return web({ ...base, body: head(sub ? "Submitted · results not released" : "Viewed Sat, Oct 17 · results not released", badge(sub ? "submitted" : "resultsHeld")) + `<div class="w-grid"><div class="w-stack">${sub ? receipt : held}${answers}</div><div class="w-stack">${card("What happens next", `<p>${sub ? "Your attempt is recorded. You can start Attempt 2 until the quiz closes; the higher score counts." : "Your Attempt 1 receipt stays the same whatever happens to the quiz."}</p>` + handoff("S16", "Your instructor reviews quiz results in their own workspace; nothing here changes until results are released.") + `<div style="display:grid;gap:8px;margin-top:12px">${sub ? btn("Start attempt 2", { cls: "btn block", note: "Starts a new 30-minute attempt; Attempt 1 is kept" }) : ""}${btn("Return to the course", { cls: "btn block", go: "S03:published" })}</div>`)}${sub ? "" : card("Attempt history", `<ul class="w-list inset"><li>${ic("check-circle")}<div class="grow"><span class="title">Attempt 1</span><div class="meta">${A.at} · <code>${A.ref}</code></div></div></li></ul>`)}</div></div>` });
    },
    ios(st) {
      const back = ["PHYS 110", "S03:published"];
      if (st === "available")
        return ios({ tab: "courses", back, title: "Quiz", large: "Quiz 3", sub: "Projectile motion · 4 questions · 10 points", body: group([K.ival("Your time", `${A.mine} min`), K.ival("Includes", A.allowance), K.ival("Attempts", "0 of 2 used"), K.ival("Closes", "Mon, Oct 19 · 11:59 pm")], { foot: "Separate from assignment extensions. Results release after the close date." }) + group([row("Course AI rule", "Not permitted during quizzes")]), bottom: btn("Start Attempt 1", { cls: "i-btn", go: "S10:progress" }) + btn("Return to Course", { cls: "i-btn secondary", go: "S03:published" }) });
      if (st === "progress" || st === "offline") {
        const off = st === "offline";
        const it = Q.items[off ? 3 : 1];
        const bar = `<div class="i-timer" role="timer" aria-label="Time remaining"><span>Question ${off ? 4 : 2} of 4</span><b>${off ? "21:06" : "26:41"}</b>${off ? badge("deviceOnly", "On device") : badge("answersSaved", "Saved")}</div>`;
        return ios({ tab: "courses", tabs: false, back: ["Pause", "S10:available"], title: "Quiz 3", trail: btn("Review", { cls: "i-iconbtn", note: "Opens the review sheet: answered/unanswered items, then Submit" }), body: bar + (off ? notice("warning", "offline", "Offline", "Answers are saved on this iPhone and haven’t been sent. They send when you reconnect; the timer keeps running.") + '<div style="height:10px"></div>' : "") + item(it, "is10") + `<div class="i-dots" aria-hidden="true">${Q.items.map((_, i) => `<i class="${i === (off ? 3 : 1) ? "on" : ""}"></i>`).join("")}</div>`, bottom: off ? btn("Submit", { cls: "i-btn", disabled: true, note: "Needs a connection" }) : btn("Next Question", { cls: "i-btn", note: "Question 3" })});
      }
      const sub = st === "submitted";
      return ios({ tab: "courses", back, title: "Quiz 3", body: `<div class="i-hero"><span class="glyph">${ic(sub ? "check-circle" : "eye-off")}</span><h1>${sub ? "Attempt 1 submitted" : "Results not released"}</h1><p class="i-sub" style="margin:0">${sub ? A.at : "Released after the quiz closes · Mon, Oct 19 · 11:59 pm ET"}</p></div>` + group([K.ival("Reference", `<code>${A.ref}</code>`), K.ival("Answered", "4 of 4"), K.ival("Questions", "Version 1 · kept with your answers")], { h: "Receipt" }) + group(Q.items.map((it, i) => row(`Question ${i + 1}`, it.type, { note: "Read-only view of your submitted answer" })), { h: "Your answers" }) + handoff("S16", "Your instructor reviews results separately; nothing changes here until release.") + group([row("Return to Course", "", { go: "S03:published" })]) });
    },
    notes: {
      available: { web: "Rules first: window, personal time (allowance named, separate from assignment extensions), attempts, release rule. Start is the single primary action.", ios: "Large-title summary, rule rows, Start pinned to the bottom." },
      progress: { web: "All questions on one page as cards; rail holds the timer (role=timer, not live-announced every second), save status per answer and the question list. Review and submit is a separate step.", ios: "Paged flow without the tab bar; persistent timer strip with save state; Review opens a sheet. Backgrounding returns to the same item." },
      offline: { web: "Banner says answers are in this browser only and not sent; Submit unavailable with a reason; timer honesty (keeps running).", ios: "Same wording; the unsent item is badged ‘On device’." },
      submitted: { web: "Receipt with reference, time, answered count and the item-snapshot promise; the S10→S16 staff handoff is explained, not linked.", ios: "Receipt hero, then read-only answers." },
      held: { web: "Neutral held state: release rule and date; submitted answers read-only; no scores, keys or progress hints.", ios: "Same; receipt facts only." },
    },
    a11y: ["Timer uses role=timer and is not announced every second; a 5-minute warning would be a polite live announcement.", "Multiple-choice options are a fieldset of radios with 44 px rows.", "Read-only answers stay readable (disabled radios keep the chosen state visible as text in the summary)."],
  });

  /* ============ S11 COURSE CONVERSATION ============ */
  const T = D3.thread;
  const post = (p, o = {}) => `<article class="w-post${p.reply ? " reply" : ""}${o.mine ? " mine" : ""}" aria-label="${esc(p.who)}, ${esc(p.role)}">${av(p.ini, p.staff)}<div class="body"><div class="who"><b>${esc(p.who)}</b>${role(p.role, p.staff)}<span class="meta">${esc(p.at)}</span>${o.badge || ""}</div><p>${esc(p.text)}</p>${o.noReply ? "" : `<div>${btn("Reply", { cls: "btn plain", icon: "reply", note: "Opens the composer under this post" })}</div>`}</div></article>`;
  reg("S11", {
    states: [
      ["open", "Open", 0],
      ["draft", "Draft reply", 1],
      ["posted", "Posted", 2],
      ["locked", "Locked", 3],
      ["unavailable", "Unavailable", 4],
    ],
    url: (st) => "app.whiteboard.example/courses/phys-110/discussion/" + (st === "unavailable" ? "module-4-forces" : "launch-lab"),
    web(st) {
      const crumbs = [["Courses", "S02:current"], ["PHYS 110", "S03:published"], ["Discussion"]];
      if (st === "unavailable")
        return web({ nav: "courses", crumbs, url: this.url(st), body: webHead("Module 4 discussion", "PHYS 110 · Forces and free-body diagrams") + courseTabs("discussion") + card("", `<div style="display:flex;gap:12px;align-items:flex-start"><span style="color:var(--wb-neutral)">${ic("eye-off")}</span><div><h2 style="font-size:19px">This discussion isn’t open yet</h2><p style="margin-top:4px">It opens with Module 4 on Mon, Oct 19 · 8:00 am ET, when Dr. Diane Reyes publishes it. Nothing has been posted, and you haven’t missed anything.</p><div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">${btn("Open the Module 3 discussion", { cls: "btn", go: "S11:open" })}${btn("Return to course home", { cls: "btn plain", go: "S03:published" })}</div></div></div>`) });
      const locked = st === "locked", posted = st === "posted", draft = st === "draft";
      const mine = { who: D.student, ini: D.initials, role: "Student · you", at: "Thu, Oct 15 · 10:52 am", text: T.mine };
      const composer = locked ? notice("neutral", "lock", "Replies closed Mon, Oct 19", "Dr. Diane Reyes closed this discussion when Module 3 ended. You can still read every post.") :
        posted ? "" :
        card("", `<div class="w-composer"><div class="w-field"><label for="ws11-reply">Reply to the discussion <span class="meta">· posting as ${D.student}, Student · visible to PHYS 110</span></label><textarea id="ws11-reply" rows="4" aria-describedby="ws11-rs">${draft ? esc(T.mine) : ""}</textarea><span class="hint" id="ws11-rs">${draft ? "Draft saved on this device 10:49 am · not posted" : "Your instructor and classmates see your name and role."}</span></div><div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap">${draft ? badge("replyDraft") : ""}${btn("Post reply", { cls: "btn primary", icon: "send", go: draft ? "S11:posted" : null, disabled: !draft, describedby: draft ? null : "ws11-rs", note: draft ? "Posts with your name, role and time" : "Write something to post" })}</div></div>`);
      const thread = `<div class="w-thread">${T.posts.map((p) => post(p, { noReply: locked })).join("")}${posted ? post(mine, { mine: true, badge: badge("posted", "Posted 10:52 am"), noReply: true }) : ""}</div>`;
      return web({ nav: "courses", crumbs, url: this.url(st), body: webHead(T.title, "PHYS 110 · Module 3 · Projectile motion", locked ? badge("locked", "Replies closed") : "") + courseTabs("discussion") + `<div class="w-grid"><div class="w-stack">${card("", `<div class="w-post" aria-label="Prompt from Dr. Diane Reyes, Instructor">${av("DR", true)}<div><div class="who"><b>Dr. Diane Reyes</b>${role("Instructor", true)}<span class="meta">Mon, Oct 12 · 8:00 am</span></div><p style="margin-top:6px">${esc(T.prompt)}</p></div></div>`, { label: "Discussion prompt" })}${composer}${thread}</div><div class="w-stack">${card("Context", `<ul class="w-list inset"><li>${ic("doc")}<div class="grow">${link("Projectile motion", { go: "S04:available" })}<div class="meta">Module 3 lesson</div></div></li><li>${ic("video")}<div class="grow">Launch lab demonstration<div class="meta">4:12 video</div></div></li></ul>`)}${card("How this discussion works", `<p class="meta">${locked ? "Closed for replies; posts stay readable." : "Open to PHYS 110 students and staff until Mon, Oct 19."} Not graded. Staff can hide a post; you’d be told why.</p><div style="margin-top:10px">${btn("Return to course home", { cls: "btn", go: "S03:published" })}</div>`)}</div></div>` });
    },
    ios(st) {
      const back = ["PHYS 110", "S03:published"];
      if (st === "unavailable") return ios({ tab: "courses", back, title: "Discussion", body: `<div class="i-hero"><span class="glyph">${ic("eye-off")}</span><h1>Not open yet</h1><p class="i-sub" style="margin:0">Opens with Module 4 on Mon, Oct 19 · 8:00 am ET.</p></div>` + group([row("Module 3 Discussion", "Open until Mon, Oct 19", { go: "S11:open" }), row("Return to Course", "", { go: "S03:published" })]) });
      const locked = st === "locked", posted = st === "posted", draft = st === "draft";
      const pr = (p) => `<div class="i-card" style="${p.reply ? "margin-left:20px" : ""}"><div class="who" style="display:flex;gap:6px;align-items:baseline;flex-wrap:wrap"><b>${esc(p.who)}</b>${role(p.role, p.staff)}</div><p class="meta">${esc(p.at)}</p><p>${esc(p.text)}</p></div>`;
      const sh = draft ? `<div class="i-sheet-wrap" role="dialog" aria-modal="true" aria-label="Reply"><div class="i-sheet"><div class="i-grabber" aria-hidden="true"></div><h2>Reply</h2><p class="meta">Posting as ${D.student} · Student · PHYS 110</p><div class="i-field"><label for="is11-r">Your reply</label><textarea id="is11-r" rows="5" style="border:0;background:transparent;font:inherit;color:inherit">${esc(T.mine)}</textarea></div><p class="meta">Draft · not posted</p><div style="height:10px"></div>${btn("Post", { cls: "i-btn", go: "S11:posted" })}<div style="height:8px"></div><button type="button" class="i-btn secondary" data-note="Keeps the draft on this iPhone">Save Draft</button></div></div>` : "";
      return ios({ tab: "courses", back, title: "Discussion", body: `<div class="i-card"><p class="eyebrow">Module 3 · Prompt</p><div class="t" style="font-weight:650">${T.title}</div><p class="meta">Dr. Diane Reyes · Instructor</p><p>${esc(T.prompt)}</p></div>` + (locked ? notice("neutral", "lock", "Replies closed", "Reading is still available.") : "") + T.posts.map(pr).join("") + (posted ? `<div class="i-card" style="box-shadow:inset 0 0 0 1px var(--wb-accent)"><div style="display:flex;gap:6px;align-items:baseline;flex-wrap:wrap"><b>${D.student}</b>${role("Student · you")}${badge("posted", "Posted")}</div><p>${esc(T.mine)}</p></div>` : ""), bottom: locked || posted ? "" : btn("Reply", { cls: "i-btn", icon: "reply", go: "S11:draft" }), sheet: sh });
    },
    notes: {
      open: { web: "Prompt and lesson context stay above the composer; the composer names who you are posting as and who can see it. Every post shows name, role chip and time.", ios: "Thread stack; Reply opens a keyboard-aware sheet." },
      draft: { web: "Draft is labelled ‘not posted’ in two places (hint + badge); Post is the only primary action.", ios: "Reply sheet with identity line, Post and Save Draft." },
      posted: { web: "Your post appears with a ‘Posted’ status and accent outline; no edit-history ambiguity.", ios: "Posted card at the end of the thread." },
      locked: { web: "Neutral notice says who closed replies and when; reading continues; reply buttons removed rather than disabled.", ios: "Notice; no Reply button." },
      unavailable: { web: "Map state ‘course not published’ drawn as the Module 4 discussion before it opens; says nothing was missed and offers the open discussion.", ios: "Hero explanation with the open alternative." },
    },
    a11y: ["Each post is an article named by author and role; role is text, not colour only.", "Composer label includes posting identity and audience.", "Locked thread removes reply controls instead of leaving dead buttons."],
  });

  /* ============ S12 CALENDAR ============ */
  const ev = ([t, title, where, cls, flag], st, day) => {
    const stale = st === "delayed" && cls === "c-math";
    const chg = flag === "chg" && st === "changed";
    const go = flag === "due" ? "S05:open" : flag === "ev" ? "S28:confirmed" : null;
    const note = flag === "ev" || flag === "due" ? "" : `${title} · ${where}`;
    if (flag === "ev" && st !== "personal") return "";
    const label = `${t} ${flag === "due" ? "pm" : ""} ${title}${chg ? " · room changed" : ""}${stale ? " · last known" : ""}`;
    return link(`<b>${t}${flag === "due" ? " pm" : ""}</b> ${esc(title)}<br><span class="meta">${chg ? `<s>Keene Center 212</s> Keene Center 105` : esc(where)}${stale ? " · last known" : ""}</span>`, { cls: `w-ev ${cls}${flag === "due" ? " due" : ""}${stale ? " stale" : ""}${chg ? " chg" : ""}`, go, note: note || null, label });
  };
  const agendaFor = (st) => {
    if (st === "empty") return `<div class="i-hero" style="padding:18px 0"><span class="glyph">${ic("calendar")}</span><h2 style="font-size:18px">Nothing scheduled</h2><p class="meta">No classes, deadlines or events on Sun, Oct 18. Quiz 3 closes the next day.</p></div>`;
    const day = st === "personal" ? D3.week[4] : D3.week[3];
    const items = day[2].filter((e) => e[4] !== "ev" || st === "personal");
    return `<ul class="w-agenda">${items.map(([t, title, where, cls, flag]) => `<li><span class="time">${t}${flag === "due" ? " pm" : t === "6:00" ? " pm" : " am"}</span><div><b>${esc(title)}</b><div class="meta">${flag === "chg" && st === "changed" ? `Room changed: <s>Keene Center 212</s> → Keene Center 105` : esc(where)}</div><div class="meta">Source: ${flag === "ev" ? "Physics Society · you joined Oct 13" : flag === "due" ? "PHYS 110 course · Dr. Diane Reyes" : cls === "c-math" && st === "delayed" ? "Registrar schedule · last updated Wed, Oct 14 · 6:00 pm" : "Registrar schedule"}</div></div><span>${flag === "chg" && st === "changed" ? badge("changedTime", "Room changed") : flag === "ev" ? badge("confirmed", "You’re going") : cls === "c-math" && st === "delayed" ? badge("lastKnown") : flag === "due" ? link("Open", { go: "S05:open" }) : ""}</span></li>`).join("")}</ul>`;
  };
  // Requester view (Batch 05): Priya Nair’s week of Oct 19–25. A room request is not a booking (S27).
  const PN = { name: "Priya Nair", initials: "PN" };
  const REQ = [["Mon 19", []], ["Tue 20", [["6:00 pm", "Physics Society officers’ meeting", "Hollis Hall 116", "Physics Society"]]], ["Wed 21", [["5:00 pm", "Room request RES-2026-0583", "Hollis Hall 104 · 5:00–7:45 pm · 80 people", "req"], ["5:30 pm", "Physics After Dark (published version)", "Hollis Hall 104 · 5:30–7:00 pm · organizer", "Physics Society"]]], ["Thu 22", []], ["Fri 23", []]];
  const reqWeb = (url) => web({ nav: "calendar", who: PN, crumbs: [["Calendar"]], url, body: webHead("Calendar", "Week of Oct 19–25 · Eastern Time · Priya Nair") + `<div class="w-grid">${card("Week", `<ul class="w-agenda">${REQ.flatMap(([d, items]) => items.map(([t, title, where, src]) => `<li><span class="time">${d}<br>${t}</span><div><b>${esc(title)}</b><div class="meta">${esc(where)}</div><div class="meta">Source: ${src === "req" ? "Room requests you made · Alder Hill space reservation system" : esc(src)}</div></div><span>${src === "req" ? `${badge("confirmed", "Confirmed in source")} ${link("Open request", { go: "S27:confirmed" })}` : ""}</span></li>`)).join("")}</ul>`)}<div class="w-stack">${card("Sources", `<ul class="w-list inset"><li><div class="grow"><span class="title">Room requests you made</span><div class="meta">Shows requested, approved · not confirmed, confirmed or cancelled — exactly as the request says. A room is booked only once the reservation source confirms it.</div></div></li><li><div class="grow"><span class="title">Physics Society events</span><div class="meta">Published versions only. Draft revisions never appear here.</div></div></li></ul>`)}</div></div>` });
  const reqIos = () => ios({ tab: "calendar", title: "Calendar", large: "Calendar", trail: `<span class="i-avatar" aria-hidden="true">PN</span>`, body: group([row("5:00 pm · Room request RES-2026-0583", "Hollis Hall 104 · 5:00–7:45 pm", { trail: badge("confirmed", "Confirmed"), go: "S27:confirmed" }), row("5:30 pm · Physics After Dark", "Published version · organizer", { go: "S28:published" })], { h: "Wednesday, Oct 21", foot: "A request becomes a booking only when the reservation source confirms it." }) });

  reg("S12", {
    states: [
      ["current", "Current", 0],
      ["delayed", "Source delayed", 1],
      ["changed", "Schedule changed", 2],
      ["empty", "Empty date", 3],
      ["personal", "Event confirmed", 4],
      ["request", "Room request (requester)", null, "Added in Batch 05: route S12→S27 — a requester sees their room request in Calendar with its accurate status."],
    ],
    url: (st) => "app.whiteboard.example/calendar/week/" + (st === "request" ? "2026-10-19" : "2026-10-12" + (st === "empty" ? "?day=18" : "")),
    web(st) {
      if (st === "request") return reqWeb(this.url(st));
      const selDay = st === "empty" ? "18" : st === "personal" ? "16" : "15";
      const banner = st === "delayed" ? `<div class="w-banner" role="status" style="background:var(--wb-warning-bg)">${ic("clock")}<span><b>Registrar schedule hasn’t updated since Wed, Oct 14 · 6:00 pm.</b> Class meetings show their last-known time and room. Course deadlines are current.</span>${btn("Check again", { cls: "btn", note: "Retries the registrar source; nothing is removed while it’s delayed" })}</div>` : st === "changed" ? `<div class="w-banner" role="status" style="background:var(--wb-info-bg)">${ic("history")}<span><b>MATH 220 moved today.</b> Thu, Oct 15 · 10:30 am is now in Keene Center 105 (was 212). Changed by the Registrar at 7:40 am.</span></div>` : "";
      const week = `<div class="w-week" role="list" aria-label="Week of Oct 12">${D3.week.map(([d, n, items]) => `<section class="day${n === selDay ? " sel" : ""}" role="listitem"${n === "15" ? ' aria-current="date"' : ""} aria-label="${d}, Oct ${n}${n === "15" ? ", today" : ""}"><h3>${d} ${n}</h3>${items.map((e) => ev(e, st, n)).join("")}${n === "18" && st === "empty" ? `<span class="meta">Nothing scheduled</span>` : ""}</section>`).join("")}</div>`;
      const dayName = { 15: "Thursday, October 15 · today", 16: "Friday, October 16", 18: "Sunday, October 18" }[selDay];
      return web({ nav: "calendar", crumbs: [["Calendar"]], url: this.url(st), banner, body: webHead("Calendar", "Week of Oct 12–18 · Eastern Time", `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><div class="w-seg" role="group" aria-label="View"><button type="button" aria-pressed="false" data-note="Agenda list">Agenda</button><button type="button" aria-pressed="true" data-note="Week grid">Week</button><button type="button" aria-pressed="false" data-note="Month grid">Month</button></div>${btn("", { cls: "btn", icon: "chev-l", label: "Previous week", note: "Week of Oct 5" })}${btn("Today", { cls: "btn", note: "Returns to Thu, Oct 15" })}${btn("", { cls: "btn", icon: "chev-r", label: "Next week", note: "Week of Oct 19" })}</div>`) + `<div class="w-grid">${card("", week, { label: "Week" })}<div class="w-stack">${card(dayName, agendaFor(st))}${card("Sources", `<ul class="w-list inset"><li>${ic("building")}<div class="grow"><span class="title">Registrar schedule</span><div class="meta">${st === "delayed" ? "Delayed · last updated Wed, Oct 14 · 6:00 pm" : "Updated Thu, Oct 15 · 7:40 am"}</div></div>${st === "delayed" ? badge("lastKnown") : ""}</li><li>${ic("book")}<div class="grow"><span class="title">Course deadlines</span><div class="meta">From PHYS 110, MATH 220, WRIT 140 · live</div></div></li><li>${ic("users")}<div class="grow"><span class="title">Campus events you joined</span><div class="meta">${st === "personal" ? "1 confirmed this week" : "None this week"}</div></div></li></ul><p class="meta" style="margin-top:8px">Room requests appear on their own source with their true status (S27; see the requester state). ${link("Subscribe from another calendar app", { go: "P44:current" })}</p>`)}</div></div>` });
    },
    ios(st) {
      if (st === "request") return reqIos();
      const days = D3.week.map(([d, n]) => `<button type="button" aria-pressed="${n === (st === "empty" ? "18" : st === "personal" ? "16" : "15")}" data-note="Shows ${d}, Oct ${n}"><span style="display:block;font-size:11px">${d.slice(0, 1)}</span>${n}</button>`).join("");
      const sel = st === "empty" ? "Sunday, Oct 18" : st === "personal" ? "Friday, Oct 16" : "Today · Thu, Oct 15";
      const items = st === "empty" ? [] : (st === "personal" ? D3.week[4] : D3.week[3])[2].filter((e) => e[4] !== "ev" || st === "personal");
      const rows = items.map(([t, title, where, cls, flag]) => row(`${t}${flag === "due" || t === "6:00" ? " pm" : " am"} · ${esc(title)}`, flag === "chg" && st === "changed" ? "Keene Center 105 · was 212" : cls === "c-math" && st === "delayed" ? `${where} · last known` : esc(where), { trail: flag === "chg" && st === "changed" ? badge("changedTime", "Changed") : flag === "ev" ? badge("confirmed", "Going") : cls === "c-math" && st === "delayed" ? badge("lastKnown") : "", go: flag === "due" ? "S05:open" : flag === "ev" ? "S28:confirmed" : null }));
      return ios({ tab: "calendar", title: "Calendar", large: "Calendar", trail: K.iAvatar, body: `<div class="i-seg" role="group" aria-label="Day" style="display:grid;grid-template-columns:repeat(7,1fr)">${days}</div>` + (st === "delayed" ? notice("warning", "clock", "Class times last updated Oct 14", "Shown as last known until the registrar responds.") : st === "changed" ? notice("info", "history", "MATH 220 room changed", "Now Keene Center 105 at 10:30 am.") : "") + (rows.length ? group(rows, { h: sel }) : `<h2 class="i-h">${sel}</h2><div class="i-card" style="text-align:center"><p>Nothing scheduled.</p><p class="meta">Quiz 3 closes Mon, Oct 19.</p></div>`) + group([K.iswitch("is12-sync", "Add to iPhone Calendar", false, { sub: "Optional · Whiteboard items stay here either way", note: "Asks for Calendar permission only when turned on" })], { h: "Device calendar" }) });
    },
    notes: {
      current: { web: "Week grid + selected-day agenda + source list. Every item names its source; deadlines link to the work (S12→S05).", ios: "Agenda-first day view with a week strip; month is a sheet. Device-calendar sync is an optional, separately permissioned switch." },
      delayed: { web: "Delayed registrar source: banner with last update; affected meetings stay visible with dashed edge and ‘last known’ — never erased.", ios: "Notice + ‘last known’ badge on affected rows." },
      changed: { web: "Changed room shown old → new on the item and in the agenda, with who changed it and when.", ios: "Changed badge; subtitle names the old room." },
      empty: { web: "Empty Sunday says what is absent and points to the next deadline instead of a blank grid.", ios: "Empty card with the next deadline." },
      personal: { web: "Confirmed campus event (joined via S28) appears with its own source and ‘You’re going’; it opens the event (S28 confirmed, Batch 05). Waitlisted events never appear as going.", ios: "Going badge; row opens S28." },
      request: { web: "Requester view (Priya Nair, Physics Society events officer). Her room request appears on its own ‘Room requests’ source with its true status — here Confirmed in source; before that it would read Requested or Approved · not confirmed, never as a booked room. Opens S27; Today’s published event stays separate.", ios: "Request row with the same status words; opens S27." },
    },
    a11y: ["Week is a list of day regions; today is aria-current=date.", "Changed/delayed are words and badges, not only dashed or outlined edges.", "Icon-only week arrows have visually hidden names."],
  });

  /* ============ S13 UPDATES & PREFERENCES ============ */
  const feed = (st, p) => {
    if (st === "empty") return `<div class="i-hero" style="padding:24px 0"><span class="glyph">${ic("bell")}</span><h2 style="font-size:18px">You’re all caught up</h2><p class="meta">New feedback, deadline changes and campus updates appear here. Nothing is hidden by your delivery settings — they only change email and alerts.</p></div>`;
    const unreadN = st === "unread" ? 3 : 0;
    return `<ul class="w-feed" aria-label="Updates">${D3.updates.map((u, i) => {
      const unread = i < unreadN, delayed = st === "delayed" && u.k === "schedule";
      return `<li class="${unread ? "unread" : ""}"><span class="dot" aria-hidden="true"></span>${ic(u.icon)}<div><span class="sr">${unread ? "Unread: " : ""}</span>${link(`<span class="title">${u.title}</span>`, { go: u.go, note: u.note })}<div class="meta">${u.src} · ${u.at}</div>${delayed ? `<div class="meta" style="color:var(--wb-warning-text, inherit)">${ic("clock")} Registrar source delayed · checked Thu, Oct 15 · 9:05 am. This notice may be out of date.</div>` : ""}</div><span>${unread ? badge("unread", "New") : ""}</span></li>`;
    }).join("")}</ul>`;
  };
  const prefs = (st, p) => `<div style="display:grid;gap:4px">${toggle(`${p}-fb`, "Feedback released", true, { sub: "In Whiteboard · email" })}${toggle(`${p}-dl`, "Deadline changes", true, { sub: "In Whiteboard · email" })}${toggle(`${p}-sc`, "Schedule changes", true, { sub: "In Whiteboard" })}${toggle(`${p}-cp`, "Campus event updates", st !== "saved", { sub: st === "saved" ? "Off · from now on" : "In Whiteboard" })}</div>${st === "saved" ? `<div style="margin-top:10px">${badge("prefSaved")}</div><p class="meta" style="margin-top:6px">Campus updates you already received stay in your history.</p>` : ""}<p class="meta" style="margin-top:10px">Urgent notices from your school (closures, safety) can’t be turned off here. ${link("All delivery settings", { go: "P44:editable" })}</p>`;
  reg("S13", {
    states: [
      ["unread", "Unread", 0],
      ["read", "Read", 1],
      ["saved", "Preference saved", 2],
      ["delayed", "Source delayed", 3],
      ["empty", "No updates", 4],
    ],
    url: () => "app.whiteboard.example/updates",
    web(st) {
      const filters = `<div class="w-seg" role="group" aria-label="Filter updates">${["All", "Coursework", "Feedback", "Schedule", "Campus"].map((t, i) => `<button type="button" aria-pressed="${i === 0}" data-note="Shows ${t.toLowerCase()} updates">${t}</button>`).join("")}</div>`;
      return web({ nav: "updates", crumbs: [["Updates"]], url: this.url(st), body: webHead("Updates", st === "unread" ? "3 unread · newest first" : st === "empty" ? "Nothing new" : "All read · newest first", st === "unread" ? btn("Mark all as read", { cls: "btn", go: "S13:read" }) : "") + `<div class="w-grid"><div class="w-stack">${card("", (st === "empty" ? "" : filters + '<div style="height:10px"></div>') + feed(st, "ws13"), { label: "Update feed" })}<p>${link("Return to Today", { go: "S01:usual", icon: "chev-l" })}</p></div><div class="w-stack">${card("Delivery", prefs(st, "ws13"))}${card("About updates", `<p class="meta">Updates point to the record that changed; they never show scores. Turning an update type off changes future email and alerts only — it doesn’t change the record or remove it from this list.</p>`)}</div></div>` });
    },
    ios(st) {
      const chips = `<div class="i-chips" role="group" aria-label="Filter">${["All", "Coursework", "Feedback", "Schedule", "Campus"].map((t, i) => `<button type="button" aria-pressed="${i === 0}" data-note="Filter: ${t}">${t}</button>`).join("")}</div>`;
      const unreadN = st === "unread" ? 3 : 0;
      const rows = D3.updates.map((u, i) => row(`${i < unreadN ? '<span class="sr">Unread: </span>' : ""}${u.title}`, `${u.src.split(" · ")[0]} · ${u.at}${st === "delayed" && u.k === "schedule" ? " · source delayed, may be out of date" : ""}`, { lead: i < unreadN ? `<span style="width:8px;height:8px;border-radius:50%;background:var(--wb-accent);flex:none" aria-hidden="true"></span>` : "", go: u.go, note: u.note }));
      const sh = st === "saved" ? sheet("Notification Preferences", "Applies to future updates only", group([`<div class="grow"><div class="t">iPhone notifications</div><div class="s">Allowed in iOS Settings</div></div>${btn("Settings", { cls: "btn plain", note: "Opens iOS Settings for Whiteboard — the system permission is separate" })}`]) + group(["Feedback released", "Deadline changes", "Schedule changes", "Campus event updates"].map((t, i) => K.iswitch(`is13-p${i}`, t, i < 3, { sub: i === 3 ? "Off · saved" : "" })), { h: "Whiteboard delivers" }), "Done") : "";
      return ios({ tab: "updates", title: "Updates", large: "Updates", trail: btn("", { cls: "i-iconbtn", icon: "sliders", label: "Notification preferences", go: "S13:saved" }), body: st === "empty" ? `<div class="i-hero"><span class="glyph">${ic("bell")}</span><h1 style="font-size:22px">All caught up</h1><p class="i-sub" style="margin:0">New feedback, deadline and campus updates appear here.</p></div>` + group([row("Return to Today", "", { go: "S01:usual" })]) : chips + (st === "delayed" ? notice("warning", "clock", "Schedule source delayed", "Checked 9:05 am. Schedule updates may be out of date.") : "") + group(rows, { h: st === "unread" ? "3 New" : "Earlier" }) + group([row("Return to Today", "", { go: "S01:usual" })]), sheet: sh });
    },
    notes: {
      unread: { web: "Feed of course/campus updates, newest first; unread = dot + bold + ‘New’ + hidden ‘Unread:’ prefix. Each item opens its source (S05, S09, S12, S28, S36). Feedback items never show the score (D9).", ios: "Updates tab with filter chips; unread rows lead with a dot and a hidden ‘Unread’ prefix." },
      read: { web: "Read items remain in history; no unread markers.", ios: "Same list, ‘Earlier’ heading." },
      saved: { web: "Saving a preference shows ‘applies to future updates’ and keeps past items; urgent school notices are not switchable.", ios: "Preferences sheet: iOS notification permission (system) and Whiteboard delivery switches are separate controls." },
      delayed: { web: "A source-dependent update carries its last-checked time and an ‘may be out of date’ line.", ios: "Notice above the list; row subtitle says delayed." },
      empty: { web: "Empty guidance explains what will appear and that delivery settings don’t hide items.", ios: "Hero + Return to Today." },
    },
    a11y: ["Unread is conveyed by text (‘New’ badge, hidden ‘Unread:’ prefix), not only the dot or weight.", "Delivery switches are role=switch with visible sub-labels.", "System permission and in-app preference are different controls with different names."],
  });
})();
