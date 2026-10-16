/* Batch 06 shared tools (proposed destinations): P45 global search and P46 help center and technical
   support requests. Aisha uses the student shell. Search only returns what the signer-in can open and
   never hints at what it hides (D54). Technical help is separate from academic support (S34); its
   diagnostic context is listed and editable before sending (D55). */
(function () {
  "use strict";
  const K = window.K;
  const { D6, ic, esc, badge, btn, link, notice, card, webHead, web, ios, group, row, ival, field, cbox, tl } = K;
  const reg = K.reg;
  const iStudent = (o) => ios({ tabs: K.STUDENTTABS, tab: "today", trail: K.iAvatar, ...o });

  /* ============ P45 GLOBAL SEARCH ============ */
  const RES = [
    ["Courses", "book", [["PHYS 110 · Introductory Mechanics", "Module 3 · “Projectile motion” · Fall 2026", "S03:published"], ["PHYS 101 · Physics Foundations", "Week 6 · “Projectiles” · Fall 2025", null, true]]],
    ["Coursework", "pencil", [["Problem Set 4: Kinematics", "PHYS 110 · questions 2–3 · due Fri, Oct 16", "S05:open"], ["Quiz 3: Projectile motion", "PHYS 110 · open until Mon, Oct 19", "S10:available"]]],
    ["Events", "ticket", [["Physics After Dark: Motion in the Movies", "Physics Society · Wed, Oct 21 · “…laws of motion…”", "S28:published"]]],
    ["Organizations", "org", [["Physics Society", "Student organization · 3 upcoming events", "S29:member"]]],
    ["Services", "support", [["Physics learning support", "Learning Commons · help with projectile motion and more", "S34:selected"]]],
  ];
  const q45 = (st) => ({ noquery: "", searching: "projectile", results: "projectile", noresults: "projectle", restricted: "physics society budget" })[st];
  const filters = (p) => `<fieldset class="w-sel"><legend class="eyebrow">Type</legend>${["Courses", "Coursework", "Events", "Organizations", "Services"].map((t) => K.cbox(`${p}-t-${t.toLowerCase()}`, t, true)).join("")}</fieldset>${field({ id: `${p}-term`, label: "Term", type: "select", value: "Any term", options: ["Any term", "Fall 2026", "Fall 2025"] })}<fieldset class="w-sel"><legend class="eyebrow">Include</legend>${K.cbox(`${p}-arch`, "Archived material", true)}</fieldset>`;
  const results45 = (st) => {
    if (st === "noquery") return card("Recent and suggested", `<ul class="w-list inset">${[["history", "problem set 4", "S05:open"], ["history", "office hours", "S03:published"], ["ticket", "Events this week", "S28:published"], ["support", "Get support", "S34:browsing"]].map(([i, t, go]) => `<li>${ic(i)}<div class="grow">${link(t, { cls: "title", go })}</div></li>`).join("")}</ul>`);
    if (st === "searching") return card("", `<p role="status">${ic("hourglass")} Searching your courses, work, events, organizations and services…</p>${K.progress(40, "Search progress")}`, { label: "Search progress" });
    if (st === "noresults") return card("", `<div class="w-empty">${ic("search")}<div><b>No results for “projectle”</b><p class="meta">${link("Search for “projectile” instead", { go: "P45:results" })} · or turn on archived material and every type in the filters.</p></div></div>`, { label: "No results" });
    if (st === "restricted") return card("", `<div class="w-empty">${ic("search")}<div><b>No results you can open for “physics society budget”</b><p class="meta">Search shows only what you have access to. If you expected something, ask its owner — for organization records, an officer of that organization.</p>${link("Open Physics Society", { go: "S29:member" })}</div></div>`, { label: "No results" });
    return `<div class="w-stack"><p class="meta" role="status">9 results for “projectile” · grouped by type</p>${RES.map(([h, i, items]) => card(h, `<ul class="w-list inset">${items.map(([t, m, go, arch]) => `<li>${ic(i)}<div class="grow">${go ? link(t, { cls: "title", go }) : link(t, { cls: "title", note: "Opens the archived course read-only" })}<div class="meta">${m}</div></div>${arch ? badge("archived") : ""}</li>`).join("")}</ul>`)).join("")}</div>`;
  };
  reg("P45", {
    states: [
      ["noquery", "No query", 0],
      ["searching", "Searching", 1],
      ["results", "Results found", 2],
      ["noresults", "No results", 3],
      ["restricted", "Restricted result omitted", 4],
    ],
    url: (st) => "app.whiteboard.example/search" + (q45(st) ? "?q=" + encodeURIComponent(q45(st)).replace(/%20/g, "+") : ""),
    web(st) {
      const box = `<div class="w-field"><label for="w45-q">Search Whiteboard</label><input id="w45-q" type="search" value="${esc(q45(st))}" aria-describedby="w45-h"><span class="hint meta" id="w45-h">Searches only what you can open · press / from any page</span></div>`;
      return web({ nav: "today", crumbs: [["Today", "S01:usual"], ["Search"]], url: this.url(st), body: webHead("Search", "Courses, coursework, events, organizations and services") + `<div class="w-grid split">${card("Filters", box + filters("w45"))}${results45(st)}</div>` });
    },
    ios(st) {
      const bar = `<div class="i-field"><label for="i45-q">Search</label><input id="i45-q" type="search" value="${esc(q45(st))}"></div>`;
      let body;
      if (st === "noquery") body = group([row("problem set 4", "", { lead: ic("history"), go: "S05:open" }), row("Events this week", "", { lead: ic("ticket"), go: "S28:published" }), row("Get support", "", { lead: ic("support"), go: "S34:browsing" })], { h: "Recent and Suggested" });
      else if (st === "searching") body = `<p class="i-foot" role="status">Searching…</p>`;
      else if (st === "noresults") body = `<div class="i-card"><p><b>No results for “projectle”</b></p><p class="meta">Did you mean ${link("projectile", { go: "P45:results" })}?</p></div>`;
      else if (st === "restricted") body = `<div class="i-card"><p><b>No results you can open</b></p><p class="meta">Search shows only what you have access to. Ask the owner if you expected something.</p></div>`;
      else body = `<div class="i-chips">${["All", "Courses", "Coursework", "Events", "Services"].map((c, i) => link(c, { note: i ? "Filters to " + c : "Shows every type", current: i === 0 })).join("")}${link("Filters", { note: "Opens the filter sheet: type, term, archived" })}</div>` + RES.map(([h, i, items]) => group(items.map(([t, m, go, arch]) => row(t, m, { lead: ic(i), go: go || null, note: go ? "" : "Opens the archived course read-only", trail: arch ? badge("archived") : "" })), { h })).join("");
      return iStudent({ title: "Search", back: ["Today", "S01:usual"], body: bar + body });
    },
    notes: {
      noquery: { web: "Full results workspace with recent searches and suggestions; the header search and ‘/’ shortcut open it. Hint states that only permitted material is searched.", ios: "Search pushed from the nav-bar search button on Today/Campus or Account (D51) — no sixth tab; recent and suggested rows." },
      searching: { web: "Progress announced in a status region in words; the bar is secondary.", ios: "‘Searching…’ status line." },
      results: { web: "Grouped by type; every result names its source (course, organization, service) and matching context; archived items carry an Archived badge before opening. Results open S03, S05, S10, S28, S29, S34.", ios: "Filter chips + grouped rows; opening a result pushes its destination and Back returns to the kept query." },
      noresults: { web: "Spelling recovery as a link and the filters to widen; nothing invented.", ios: "Did-you-mean link." },
      restricted: { web: "An officer-only organization record exists but isn’t shown, counted or hinted at. Copy says search covers only what you can open and who to ask (D54).", ios: "Same honest empty state." },
    },
    a11y: ["Result counts and progress are announced through role=status.", "Groups are headed lists; the archived badge is text, read before the link.", "Restricted results leave no trace in counts or headings."],
  });

  /* ============ P46 HELP CENTER AND TECHNICAL SUPPORT ============ */
  const T = D6.support;
  const article = card("If an upload stops partway", `<p class="meta">Help article · updated Oct 2026</p><ol style="margin:8px 0 0 18px;display:grid;gap:4px"><li>Check the upload screen: “Nothing received yet” means your work wasn’t sent.</li><li>Keep the app open and retry; your pages and tags are kept.</li><li>If it stops again on the same page, report it below.</li></ol><p class="meta" style="margin-top:8px">${ic("check-circle")} Service status: all Whiteboard services normal (sample).</p>`);
  const diag = (p, st) => `<fieldset class="w-sel"><legend class="eyebrow">Shared with the IT Service Desk — untick to leave out</legend>${cbox(`${p}-d1`, "Page: PHYS 110 › Problem Set 4 › Upload", true)}${cbox(`${p}-d2`, "Time: Thu, Oct 15 · 6:12 am ET", true)}${cbox(`${p}-d3`, "App and browser version", true)}${cbox(`${p}-d4`, "Upload attempt ID U-88F2", true)}</fieldset><p class="meta">Never included: your pages, answers, grades or messages.</p>`;
  const form46 = (st, p) => `<div class="w-form one">${field({ id: `${p}-where`, label: "Where it happened", type: "select", value: "Assignment upload", options: ["Assignment upload", "Quiz", "Sign-in", "Other"] })}${field({ id: `${p}-what`, label: "What happened", type: "textarea", value: "Upload of Problem Set 4 stops at page 3 of 4 and says “Nothing received yet”. Retried twice on Wi-Fi." })}${diag(p, st)}<div class="w-field"><label for="${p}-file">Screenshot (optional)</label><input id="${p}-file" type="file" aria-describedby="${p}-file-h"><span class="hint meta" id="${p}-file-h">${st === "attachment" ? "Your browser is asking which file to share. Only the file you pick is attached." : "Only attached if you choose a file."}</span></div></div>`;
  reg("P46", {
    states: [
      ["selfservice", "Self-service", 0],
      ["draft", "Draft request", 1],
      ["attachment", "Attachment permission", 2],
      ["submitted", "Submitted", 3],
      ["resolved", "Resolved", 4],
    ],
    url: (st) => "app.whiteboard.example/help" + (st === "selfservice" ? "?q=upload+stopped" : st === "submitted" || st === "resolved" ? "/requests/" + T.ref : "/report"),
    web(st) {
      const crumbs = [["Today", "S01:usual"], ["Help"]];
      const side = card("Other help", `<ul class="w-list inset"><li>${ic("lock")}<div class="grow">${link("Can’t sign in?", { cls: "title", go: "P41:error" })}<div class="meta">Sign-in is run by Alder Hill; their help desk resets passwords.</div></div></li><li>${ic("support")}<div class="grow">${link("Academic support", { cls: "title", go: "S34:browsing" })}<div class="meta">Tutoring and advising are separate from technical help.</div></div></li><li>${ic("today")}<div class="grow">${link("Back to Today", { cls: "title", go: "S01:usual" })}</div></li></ul>`);
      let main;
      if (st === "selfservice") main = `<div class="w-stack">${`<div class="w-field"><label for="w46-q">Search help</label><input id="w46-q" type="search" value="upload stopped"></div>`}${article}${card("Still stuck?", `<p class="meta">Report it to the Alder Hill IT Service Desk. You’ll see what’s shared before sending.</p>${btn("Report an issue", { cls: "btn", go: "P46:draft" })}${link("Track a request", { go: "P46:submitted" })}`)}</div>`;
      else if (st === "draft" || st === "attachment") main = card("Report a technical issue", notice("warning", "pencil", "Draft · nothing submitted", "") + form46(st, "w46") + `<div class="w-row" style="margin-top:12px">${btn("Submit request", { cls: "btn primary", go: "P46:submitted" })}${btn("Discard", { cls: "btn plain", go: "P46:selfservice" })}</div>`);
      else if (st === "submitted") main = card("Request " + T.ref, `<p>${badge("techOpen")}</p><dl class="facts" style="margin-top:10px"><dt>Reference</dt><dd>${T.ref}</dd><dt>Received by</dt><dd>Alder Hill IT Service Desk · Thu, Oct 15 · 6:20 am ET</dd><dt>Shared</dt><dd>Your description, page, time, versions, upload attempt ID</dd></dl>${tl([["send", "Submitted by you", "Thu, Oct 15 · 6:20 am ET"], ["hourglass", "Next: the Service Desk replies", "Usually within 1 business day"]])}<p class="meta" style="margin-top:8px">Your Problem Set 4 receipt status isn’t changed by this request. Check it on the assignment.</p>${link("Open Problem Set 4", { go: "S05:open" })}`);
      else main = card("Request " + T.ref, `<p>${badge("techDone")}</p><blockquote class="w-quote"><span>“The upload stopped because of a fault in large-photo handling, fixed Fri, Oct 16. Please retry; your pages are kept.”</span><span class="meta">Alder Hill IT Service Desk · Fri, Oct 16 · 3:05 pm ET</span></blockquote>${tl([["send", "Submitted by you", "Thu, Oct 15 · 6:20 am ET"], ["key", "Vendor support access approved by Alder Hill (4 hours)", "Fri, Oct 16 · 10:00 am ET"], ["check-circle", "Resolved and closed", "Fri, Oct 16 · 3:05 pm ET"]])}${btn("Reopen if it happens again", { cls: "btn", go: "P46:draft" })}`);
      return web({ nav: "today", crumbs, url: this.url(st), body: webHead(st === "selfservice" ? "Help" : "Technical support", "Help with Whiteboard itself · academic support is separate") + `<div class="w-grid">${main}${side}</div>` });
    },
    ios(st) {
      const back = ["Account", "P44:editable"];
      if (st === "selfservice") return iStudent({ title: "Help", back, body: `<div class="i-field"><label for="i46-q">Search help</label><input id="i46-q" type="search" value="upload stopped"></div>` + group([row("If an upload stops partway", "Article · retry keeps your pages", { lead: ic("doc"), note: "Opens the article" })]) + group([row("Report an Issue", "", { go: "P46:draft" }), row("Can’t sign in?", "Alder Hill sign-in help", { go: "P41:error" }), row("Academic support", "Separate from technical help", { go: "S34:browsing" }), row("Back to Today", "", { go: "S01:usual" })]) });
      const formRows = group([ival("Where", "Assignment upload"), row("What happened", "Upload stops at page 3 of 4…"), ival("Screenshot", st === "attachment" ? "Choosing…" : "None")]) + group(["Page", "Time", "Versions", "Upload ID"].map((t, i) => `<div class="grow"><div class="t">${t}</div></div><input type="checkbox" id="i46-d${i}" checked aria-label="Share ${t}">`), { h: "Shared — untick to leave out", foot: "Never included: your pages, answers, grades or messages." });
      if (st === "draft" || st === "attachment") {
        const alert = st === "attachment" ? `<div class="i-alert-wrap" role="alertdialog" aria-modal="true" aria-labelledby="i46-al"><div class="i-alert"><div class="body"><p class="sysnote">iOS system prompt</p><h2 id="i46-al">“Whiteboard” Would Like to Access Your Photos</h2><p>Only the photo you choose is attached to this help request.</p></div><div class="btns"><button type="button" data-note="Nothing attached; you can still submit">Don’t Allow</button><button type="button" data-note="System choice: limited or full access; then the photo picker opens">Allow</button></div></div></div>` : "";
        return iStudent({ title: "Report an Issue", back: ["Help", "P46:selfservice"], body: notice("warning", "pencil", "Draft · nothing submitted", "") + formRows, bottom: btn("Submit", { cls: "i-btn", go: "P46:submitted" }), alert });
      }
      if (st === "submitted") return iStudent({ title: T.ref, back: ["Help", "P46:selfservice"], body: `<p>${badge("techOpen")}</p><div style="height:10px"></div>` + group([ival("Received by", "IT Service Desk"), ival("Sent", "Oct 15 · 6:20 AM"), row("Next", "The Service Desk replies, usually within 1 business day")], { foot: "Your Problem Set 4 status isn’t changed by this request." }) + group([row("Open Problem Set 4", "", { go: "S05:open" })]) });
      return iStudent({ title: T.ref, back: ["Help", "P46:selfservice"], body: `<p>${badge("techDone")}</p><div class="i-card" style="margin-top:10px"><p>“Fault in large-photo handling, fixed Fri, Oct 16. Please retry; your pages are kept.”</p><p class="meta">IT Service Desk · Oct 16 · 3:05 PM</p></div>` + group([row("Reopen if It Happens Again", "", { go: "P46:draft" })]) });
    },
    notes: {
      selfservice: { web: "Help search with a task article and sample service status; ‘Still stuck?’ leads to a report. Side panel separates sign-in problems (run by Alder Hill, P41) and academic support (S34).", ios: "Help stack reached from Account (P44) or a contextual error link." },
      draft: { web: "Issue form: where, what, and an editable list of exactly which diagnostics are shared, plus what’s never included. Draft badge says nothing is submitted.", ios: "Form rows with per-item share checkboxes." },
      attachment: { web: "Choosing a screenshot opens the browser’s own file chooser; the hint explains only the picked file is attached.", ios: "The app explains first; the Photos prompt appears only when adding an attachment (D55)." },
      submitted: { web: "Reference TS-2026-10482 issued with who received it and what was shared; next-step owner named. It doesn’t change the assignment’s receipt status — that stays on S05.", ios: "Reference detail; Problem Set 4 row." },
      resolved: { web: "Reply quoted with who and when; timeline includes the institution-approved vendor access (S37); closed with a Reopen option.", ios: "Reply card and Reopen row." },
    },
    a11y: ["Every diagnostic item is a labelled checkbox; nothing is shared silently.", "The file input has a visible label and a hint explaining what is attached.", "The status badge and the quoted reply carry their meaning in text."],
  });
})();
