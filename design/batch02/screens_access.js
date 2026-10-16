/* Batch 02 access screens P41–P44 (proposed destinations): sign-in handoff, invitation,
   first use, profile/account. Fictional institution and people; no real authentication. */
(function () {
  "use strict";
  const K = window.K;
  const { D, D2, ic, esc, badge, btn, link, notice, card, web, webAccess, webStaff, webHead, ios, group, row, field, toggle, checks, ival, iswitch, ifield, sheet } = K;
  const reg = K.reg;
  const I = D2.inst;
  const logo = (alt) => `<span class="logo${alt ? " alt" : ""}" aria-hidden="true">${alt ? "AV" : "AH"}</span>`;
  const ilogo = (alt) => `<span class="i-logo${alt ? " alt" : ""}" aria-hidden="true">${alt ? "AV" : "AH"}</span>`;
  const returnTo = "PHYS 110 · Problem Set 4: Kinematics";
  const noAccess = (c = "") => `<p class="meta"${c}>${ic("shield")} Whiteboard never sees or stores your password. ${esc(I.short)} checks who you are and tells Whiteboard only that it’s you.</p>`;

  // iOS access screens have no tab bar: the person has no role context yet.
  const iAccess = (o) => ios({ tabs: false, ...o });

  /* ============ P41 INSTITUTION SELECTION AND SIGN-IN ============ */
  const finder = (p, sel) => `<div class="w-field"><label for="${p}-inst">Your school</label><input id="${p}-inst" type="search" value="Alder" aria-describedby="${p}-inst-h" aria-controls="${p}-inst-list" autocomplete="organization"><span class="hint" id="${p}-inst-h">Search by name or email domain, such as alderhill.example</span></div>
<ul class="w-inst w-card flush" id="${p}-inst-list" aria-label="Matching schools">
<li>${link(`${logo()}<span class="grow"><b>${I.name}</b><span class="meta" style="display:block">Used on this device · ${I.idp}</span></span>${sel === 0 ? ic("check") : ic("chev-r")}`, { go: "P41:redirect" })}</li>
<li>${link(`${logo(1)}<span class="grow"><b>${D2.wrongInst.name}</b><span class="meta" style="display:block">aldervalley.example</span></span>${ic("chev-r")}`, { go: "P41:wrong", note: "Design review: shows what happens when the wrong school is chosen" })}</li></ul>`;
  const destBox = `<div class="w-card" style="padding:14px 16px"><p class="eyebrow" style="margin-bottom:4px">After you sign in</p><p style="display:flex;gap:8px;align-items:center">${ic("doc")}<span>You’ll return to <b>${returnTo}</b>, the page you opened.</span></p></div>`;
  const outcomes = `<details class="w-card" style="padding:12px 16px"><summary style="cursor:pointer;font-weight:600">Design review · where people land by role</summary><ul style="display:grid;gap:6px;margin-top:10px;padding-left:16px;list-style:disc">
<li>${link("Student with course access → Today or the original page", { go: "S01:usual" })}</li>
<li>${link("First visit for any role → first-use setup", { go: "P43:ready" })}</li>
<li>${link("Instructor → Teaching workspace (assigned course)", { go: "S14:draft" })}</li>
<li>${link("Registrar or department scheduler → Academic scheduling", { go: "S24:current", note: "Opens academic scheduling; requires registrar/department permission" })}</li>
<li>${link("Administrator → Institution administration", { go: "S37:active", note: "Authorized administrators only" })}</li>
<li>${link("Initial administrator, institution not set up → Institution setup", { go: "P50:incomplete", note: "Authorized initial administrator only" })}</li></ul></details>`;
  reg("P41", {
    states: [
      ["need", "Institution needed", 0],
      ["redirect", "Redirecting", 1],
      ["returned", "Returned authenticated", 2],
      ["error", "Identity error", 3],
      ["wrong", "Wrong institution", 4],
    ],
    url: (st) => (st === "redirect" ? I.host + "/authorize?client=whiteboard" : "app.whiteboard.example/sign-in" + (st === "need" ? "?return=/courses/phys-110/assignments/ps4" : st === "returned" ? "/complete" : st === "error" ? "/problem" : "/check-school")),
    web(st) {
      let body, aside = "";
      if (st === "need") {
        body = `<h1>Sign in to Whiteboard</h1><p>Choose your school. You’ll sign in on your school’s own page.</p>${finder("w")}${destBox}${noAccess()}`;
        aside = `<h2 style="font-size:15px;color:var(--wb-text)">Why your school?</h2><p>Your school owns your account. Its sign-in page decides who you are; Whiteboard then shows only the courses and tools your school has given you.</p><p>Got an invitation link? Open it first — it remembers which school and course it’s for.</p>`;
      } else if (st === "redirect") {
        body = `<div class="w-handoff" aria-hidden="true"><span class="w-mark">w</span><span class="dots"><i></i><i></i><i></i></span>${logo()}</div><h1 style="text-align:center">Opening ${I.idp}…</h1><p style="text-align:center">You’re leaving Whiteboard to sign in with your school.</p>
<div class="w-card"><dl class="facts"><dt>School</dt><dd>${I.name}</dd><dt>Sign-in page</dt><dd>${I.host}</dd><dt>Then back to</dt><dd>${returnTo}</dd></dl></div>
<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">${btn("Open sign-in page", { cls: "btn primary", icon: "external", go: "P41:returned", note: "Design review: simulates a successful return from the institution" })}${btn("Choose another school", { cls: "btn", go: "P41:need" })}</div>
<p class="meta" style="text-align:center">If the page doesn’t open within a few seconds, use “Open sign-in page”.</p>${link("Design review: simulate a sign-in problem", { cls: "meta", go: "P41:error" })}`;
      } else if (st === "returned") {
        body = `<p>${badge("complete", "Signed in")}</p><h1>Welcome back, Aisha</h1><div class="w-card"><dl class="facts"><dt>Signed in as</dt><dd>Aisha Rahman · arahman@alderhill.example</dd><dt>School</dt><dd>${I.name}</dd><dt>Role</dt><dd>Student · 3 courses this term</dd></dl></div>
<p>Taking you back to <b>${returnTo}</b>.</p><div style="display:flex;gap:8px;flex-wrap:wrap">${btn("Continue to Problem Set 4", { cls: "btn primary", go: "S05:open" })}${btn("Go to Today instead", { cls: "btn", go: "S01:usual" })}</div>${outcomes}`;
      } else if (st === "error") {
        body = `<h1>${I.short} couldn’t confirm your sign-in</h1>${notice("error", "alert", "Your school’s sign-in page reported a problem", `It said: “Account temporarily locked after several attempts.” Nothing in Whiteboard was changed.`)}
<div class="w-card"><h2>What you can do</h2><ul style="display:grid;gap:8px;padding-left:18px;list-style:disc"><li>Unlock your account or reset your password with <b>${I.help}</b>. Only your school can do this.</li><li>Wait a few minutes, then try again.</li><li>Picked the wrong school? Choose again.</li></ul>
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">${btn("Try again", { cls: "btn primary", icon: "retry", go: "P41:redirect" })}${btn("Contact your school’s IT desk", { cls: "btn", icon: "external", note: "Opens the institution’s own help page; Whiteboard support can’t unlock school accounts" })}${btn("Choose another school", { cls: "btn plain", go: "P41:need" })}</div></div>
<p class="meta">Reference for your IT desk: WB-SIGNIN-7Q2 · Thu, Oct 15 · 6:11 am ET</p>`;
      } else {
        body = `<h1>This link belongs to a different school</h1>${notice("warning", "building", `You signed in with ${D2.wrongInst.name}`, `The page you opened, <b>${returnTo}</b>, is part of <b>${I.name}</b>.`)}
<div class="w-card"><ul class="w-inst" aria-label="Choose how to continue"><li>${link(`${logo()}<span class="grow"><b>Sign in with ${I.name}</b><span class="meta" style="display:block">Opens ${I.host}</span></span>${ic("chev-r")}`, { go: "P41:redirect" })}</li><li>${link(`${ic("search")}<span class="grow"><b>Search for another school</b></span>${ic("chev-r")}`, { go: "P41:need" })}</li></ul></div>
<p class="meta">You’re still signed in to ${D2.wrongInst.name}’s Whiteboard. ${link("Sign out of it", { note: "Ends that session only; the other school is unaffected" })}</p>`;
      }
      return webAccess({ url: this.url(st), body, aside });
    },
    ios(st) {
      if (st === "redirect")
        return K.ios({ raw: `<main class="i-scroll" style="padding-top:60px"><div class="i-hero"><span class="glyph">${ic("building")}</span><h1>Sign in to Whiteboard</h1><p class="i-sub">${I.name}</p></div></main>`, alert: `<div class="i-alert-wrap" role="alertdialog" aria-modal="true" aria-labelledby="ip41a-t" aria-describedby="ip41a-d"><div class="i-alert"><div class="body"><h2 id="ip41a-t">“Whiteboard” Wants to Use “alderhill.example” to Sign In</h2><p id="ip41a-d">This allows the app and website to share information about you.</p><p class="sysnote">iOS system prompt · wording owned by Apple</p></div><div class="btns"><button type="button" data-go="P41:need">Cancel</button><button type="button" data-go="P41:returned" data-note="Next: the school’s sign-in page opens in a secure system sheet; Whiteboard can’t see it">Continue</button></div></div></div>` });
      if (st === "need")
        return iAccess({ title: "", body: `<div class="i-hero"><span class="glyph">${ic("building")}</span><h1>Sign in to Whiteboard</h1><p class="i-sub">Choose your school. You’ll sign in on its own secure page.</p></div>
<ul class="i-group" style="margin-top:14px"><li class="i-fieldrow">${ifield("ip41-s", "Search schools", "Alder", { type: "search" })}</li></ul>
${group([row(I.name, "Used on this iPhone", { lead: ilogo(), go: "P41:redirect" }), row(D2.wrongInst.name, "aldervalley.example", { lead: ilogo(1), go: "P41:wrong", note: "Design review: wrong-school path" })], { h: "Schools" })}
<p class="i-foot">After you sign in, you’ll return to ${returnTo}.</p>`, bottom: btn("Continue", { cls: "i-btn", go: "P41:redirect" }) });
      if (st === "returned")
        return iAccess({ body: `<div class="i-hero" style="padding-top:40px"><span class="glyph">${ic("check-circle")}</span><h1>You’re signed in</h1><p class="i-sub">Aisha Rahman · Student · ${I.name}</p></div>${group([row("Problem Set 4: Kinematics", "Returning to the page you opened", { lead: ic("doc"), go: "S05:open" })], { h: "Continuing to" })}<p class="i-foot">The app restores the original link only when your role allows it; otherwise it opens Today.</p>`, bottom: btn("Continue", { cls: "i-btn", go: "S05:open" }) + btn("Go to Today", { cls: "i-btn secondary", go: "S01:usual" }) });
      if (st === "error")
        return iAccess({ back: ["Schools", "P41:need"], title: "Sign-in problem", body: `<div class="i-hero"><span class="glyph" style="background:var(--wb-error-bg);color:var(--wb-error)">${ic("alert")}</span><h1 style="font-size:24px">${I.short} couldn’t confirm your sign-in</h1><p class="i-sub">Your school said: “Account temporarily locked after several attempts.” Nothing in Whiteboard changed.</p></div>
${group([row("Unlock or reset your password", I.help, { lead: ic("key"), note: "Opens the institution’s help page in Safari; only the school can unlock accounts" }), row("Choose another school", "", { lead: ic("search"), go: "P41:need" })], { h: "What you can do" })}<p class="i-foot">Reference: WB-SIGNIN-7Q2 · 6:11 am ET</p>`, bottom: btn("Try Again", { cls: "i-btn", icon: "retry", go: "P41:redirect" }) });
      return iAccess({ back: ["Schools", "P41:need"], title: "Different school", body: `<div class="i-hero"><span class="glyph" style="background:var(--wb-warning-bg);color:var(--wb-warning)">${ic("building")}</span><h1 style="font-size:24px">This link is for ${I.name}</h1><p class="i-sub">You signed in with ${D2.wrongInst.name}. ${returnTo} isn’t part of that school.</p></div>${group([row(`Sign in with ${I.name}`, I.host, { lead: ilogo(), go: "P41:redirect" }), row("Search for another school", "", { lead: ic("search"), go: "P41:need" })])}<p class="i-foot">Your ${D2.wrongInst.short || "Alder Valley"} session stays signed in on this iPhone until you sign out in Account.</p>` });
    },
    notes: {
      need: { web: "Focused page, no product navigation: identity isn’t known yet. Recently used school first; search accepts name or email domain. The return destination is shown so the person knows the deep link is kept.", ios: "Hero + search + school list; no tab bar until role context exists. Continue sits in the bottom bar within thumb reach." },
      redirect: { web: "Hand-off summary names the school, the exact sign-in host and where the person returns — so an unexpected host is noticeable. Fallback button covers blocked pop-ups/redirects.", ios: "System authentication session prompt (wording owned by Apple), then the school’s page in a secure system sheet. Cancel returns to the school list with nothing changed." },
      returned: { web: "Brief confirmation of who/which school/which role before continuing to the original page. Review-only panel lists the role-based landing routes from routes.json.", ios: "Returns to the original deep link when permitted, otherwise Today. Tab bar appears only after this point." },
      error: { web: "Quotes the provider’s reason, says nothing in Whiteboard changed, and routes credential recovery to the school (Whiteboard can’t reset school passwords). Reference code for the IT desk.", ios: "Same content as a pushed screen; recovery row opens the school’s page in Safari." },
      wrong: { web: "Names both schools and the page that belongs to the right one. One-tap restart with the correct school; the other session is left alone.", ios: "Same; notes that the other school’s session remains until signed out." },
    },
    a11y: ["School search is a labelled search field controlling a named result list.", "The hand-off is announced as text (‘Opening Alder Hill sign-in…’), not only by animation; Reduce Motion stops the dots.", "Errors use role=alert once and keep focus on the page heading."],
  });

  /* ============ P42 INVITATION AND ACCOUNT ACTIVATION ============ */
  const V = D2.invitee;
  const inviteFacts = (full = true) => `<dl class="facts"><dt>School</dt><dd>${I.name}</dd><dt>Course</dt><dd>PHYS 110 · Introductory Mechanics · Fall 2026</dd><dt>Role</dt><dd>${V.role}</dd><dt>Invited by</dt><dd>Dr. Diane Reyes${full ? " · Instructor" : ""}</dd>${full ? `<dt>For</dt><dd>${V.email}</dd><dt>Expires</dt><dd>Thu, Oct 22 · 11:59 pm ET · one-time link</dd>` : ""}</dl>`;
  const taScope = `<ul style="display:grid;gap:6px;padding-left:18px;list-style:disc;margin-top:10px"><li>See the PHYS 110 roster and submitted work.</li><li>Grade the questions the instructor assigns to you.</li><li>You can’t publish course content or release feedback.</li></ul><p class="meta" style="margin-top:8px">The instructor and ${I.short} set these permissions; they can change them later.</p>`;
  reg("P42", {
    states: [
      ["valid", "Valid", 0],
      ["signin", "Sign-in required", 1],
      ["wrong", "Wrong account", 2],
      ["expired", "Expired", 3],
      ["used", "Already used", 4],
    ],
    url: () => "app.whiteboard.example/invite/7KD-4QX",
    web(st) {
      let body, aside = "";
      const head = (t, b = "") => `<p class="eyebrow">Invitation</p><h1>${t}</h1>${b}`;
      if (st === "valid") {
        body = head("Join PHYS 110 as a teaching assistant", `<p>Signed in as <b>${V.name}</b> · ${V.email} ${badge("complete", "Matches this invitation")}</p>`) + card("", inviteFacts()) + card("What you’ll be able to do", taScope) +
          `<div style="display:flex;gap:8px;flex-wrap:wrap">${btn("Accept invitation", { cls: "btn primary", go: "P43:multiple", note: "Adds the TA role once; next comes first-use setup for the new role" })}${btn("Not now", { cls: "btn", note: "Leaves the invitation unused until it expires" })}</div>`;
        aside = `<p>Accepting adds one role to your existing ${I.short} account. It doesn’t create a second account.</p><p>Not expecting this? Ignore it — nothing happens unless you accept.</p>`;
      } else if (st === "signin") {
        body = head("Sign in to see your invitation", `<p>An invitation from <b>${I.name}</b> is waiting. Sign in with your school to review and accept it.</p>`) + card("", inviteFacts(false)) +
          `${btn(`Sign in with ${I.name}`, { cls: "btn primary block", icon: "building", go: "P41:redirect" })}<p class="meta">You’ll come back to this invitation after signing in. Full details are shown only to the intended person.</p>`;
      } else if (st === "wrong") {
        body = head("This invitation is for someone else", "") + notice("warning", "person", "You’re signed in as Aisha Rahman", `This invitation was sent to <b>m•••n@alderhill.example</b>. It can only be accepted by that account.`) +
          card("", `<dl class="facts"><dt>School</dt><dd>${I.name}</dd><dt>Course</dt><dd>PHYS 110 · Fall 2026</dd></dl><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">${btn("Switch account", { cls: "btn primary", go: "P41:need", note: "Signs out of this account on this browser, then returns to the invitation after the right sign-in" })}${btn("Go to my Today", { cls: "btn", go: "S01:usual" })}</div>`) +
          `<p class="meta">Using a shared computer? Switch account signs out here; your work is saved.</p>`;
      } else if (st === "expired") {
        body = head("This invitation has expired", `<p>${badge("expired", "Expired Tue, Oct 13 · 11:59 pm ET")}</p>`) + card("", inviteFacts(false) + `<p style="margin-top:12px">Invitation links work for 7 days and only once. No access was added.</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">${btn("Ask Dr. Reyes for a new link", { cls: "btn primary", icon: "mail", note: "Sends a request to the inviter; they decide whether to send a new link" })}${btn("Go to Today", { cls: "btn", go: "S01:usual" })}</div>`);
      } else {
        body = head("You’ve already joined PHYS 110", `<p>${badge("used", "Accepted Tue, Oct 13 · 3:02 pm ET")}</p>`) + card("", `<dl class="facts"><dt>Role</dt><dd>${V.role} · PHYS 110</dd><dt>Accepted by</dt><dd>${V.name} (you)</dd></dl><p style="margin-top:10px">This link can’t be used again, so no duplicate access was created.</p><div style="margin-top:14px">${btn("Open PHYS 110 teaching", { cls: "btn primary", go: "S17:received", note: "Opens the TA’s assigned grading queue (S17); TAs don’t get course-builder controls" })}</div>`) +
          `<p class="meta">Wasn’t you? ${link("Report this to Dr. Reyes", { note: "Notifies the inviter; access can be removed by the instructor or school" })}</p>`;
      }
      return webAccess({ url: this.url(st), body, aside });
    },
    ios(st) {
      const top = (t, s, g = "mail", tone = "") => `<div class="i-hero"><span class="glyph"${tone}>${ic(g)}</span><h1 style="font-size:24px">${t}</h1>${s ? `<p class="i-sub">${s}</p>` : ""}</div>`;
      const factsRows = (full) => group([ival("School", I.short), ival("Course", "PHYS 110"), ival("Role", "TA"), ival("Invited by", "Dr. Reyes"), ...(full ? [ival("Expires", "Oct 22")] : [])], { h: "Invitation" });
      if (st === "valid") return iAccess({ title: "Invitation", body: top("Join PHYS 110 as a teaching assistant", `${V.name} · ${V.email}`) + factsRows(true) + group([row("See roster and submitted work"), row("Grade assigned questions"), row("Can’t publish content or release feedback")], { h: "Access", foot: "Set by the instructor and Alder Hill. Accepting adds a role; it doesn’t create a new account." }), bottom: btn("Accept Invitation", { cls: "i-btn", go: "P43:multiple" }) + btn("Not Now", { cls: "i-btn secondary", note: "Invitation stays unused until it expires" }) });
      if (st === "signin") return iAccess({ title: "Invitation", body: top("Sign in to see your invitation", `From ${I.name}. You’ll come back here after signing in.`) + factsRows(false), bottom: btn(`Sign in with ${I.short}`, { cls: "i-btn", go: "P41:redirect" }) });
      if (st === "wrong")
        return iAccess({ title: "Invitation", body: top("This invitation is for someone else", "Sent to m•••n@alderhill.example", "person", ' style="background:var(--wb-warning-bg);color:var(--wb-warning)"'), sheet: sheet("Switch account", "Signed in as Aisha Rahman · arahman@alderhill.example", group([row("Sign in as a different person", "Signs out on this iPhone, then returns to this invitation", { lead: ic("person"), go: "P41:need" }), row("Keep using Aisha Rahman", "Return to Today", { lead: ic("today"), go: "S01:usual" })])) });
      if (st === "expired") return iAccess({ title: "Invitation", body: top("This invitation has expired", "Expired Tue, Oct 13. Links work once, for 7 days. No access was added.", "clock", ' style="background:var(--wb-error-bg);color:var(--wb-error)"') + factsRows(false), bottom: btn("Ask for a New Link", { cls: "i-btn", note: "Sends a request to Dr. Reyes" }) + btn("Go to Today", { cls: "i-btn secondary", go: "S01:usual" }) });
      return iAccess({ title: "Invitation", body: top("You’ve already joined", "Accepted Tue, Oct 13 · 3:02 pm ET. This link can’t be reused.", "check-circle") + group([ival("Role", "TA · PHYS 110")]), bottom: btn("Open Teaching", { cls: "i-btn", go: "S17:received" }) });
    },
    notes: {
      valid: { web: "Review before acceptance: school, course, role, inviter, intended recipient, expiry and the plain-language scope of access. Acceptance adds a role to the existing account.", ios: "Universal-link screen with the same facts as grouped rows; Accept is the single primary action." },
      signin: { web: "Before sign-in only the school, course, role and inviter are shown; recipient and expiry are withheld. Sign-in hands off to P41 and returns here.", ios: "Same; the invitation token is kept across the system authentication session." },
      wrong: { web: "Names the signed-in account and a masked intended address; never shows full invite details to the wrong person. Switch account signs out here only.", ios: "Account-switch sheet opens automatically with the two clear choices." },
      expired: { web: "States expiry date and that no access was added. Replacement is a request to the inviter, not self-service re-issue.", ios: "Same facts; request and Today as the two actions." },
      used: { web: "One-time link: shows when and by whom it was accepted and routes to the existing destination — no duplicate access.", ios: "Same; single action to the existing workspace." },
    },
    a11y: ["Status (expired/used/matches) is text with an icon, not colour.", "Masked email is read as ‘m … n at alderhill.example’ via text, not obscured characters only (spec).", "The switch-account sheet traps focus and returns it to the heading on dismiss."],
  });

  /* ============ P43 FIRST-USE ONBOARDING ============ */
  const steps = (n) => `<ol class="w-steps" aria-label="Setup steps">${["Confirm details", "Preferences", "First task"].map((t, i) => `<li${i + 1 === n ? ' aria-current="step"' : i + 1 < n ? ' class="done"' : ""}><span class="n">${i + 1 < n ? "✓" : i + 1}</span><span class="lbl">${t}</span></li>`).join("")}</ol>`;
  const aishaFacts = (missing) => `<dl class="facts"><dt>Name</dt><dd>Aisha Rahman</dd><dt>School</dt><dd>${I.name}</dd><dt>Role</dt><dd>Student · Fall 2026</dd><dt>Courses</dt><dd>PHYS 110 · MATH 220 · WRIT 140</dd><dt>School email</dt><dd>${missing ? `<span style="color:var(--wb-error);font-weight:600">${ic("alert")} Missing from your school record</span>` : "arahman@alderhill.example"}</dd></dl>`;
  const prefsForm = (p) => `<div class="w-form"><div class="w-field"><label for="${p}-ap">Appearance</label><select id="${p}-ap"><option selected>Match system</option><option>Light</option><option>Dark</option></select></div><div class="w-field"><label for="${p}-tx">Text size</label><select id="${p}-tx"><option selected>Default</option><option>Larger</option><option>Largest</option></select></div></div>
<div style="margin-top:12px">${toggle(p + "-rm", "Reduce motion", false, { sub: "Follows your device setting unless you change it" })}${toggle(p + "-hc", "Increase contrast", false)}</div>
<h3 style="font-size:15px;margin:16px 0 6px">Updates</h3><p class="meta">Choose how Whiteboard tells you about new work, feedback and changes. You can change this any time in Updates.</p>
<div style="margin-top:6px">${toggle(p + "-dg", "Daily digest at 7:00 am", true)}${toggle(p + "-ur", "Immediately for due-date changes", true)}${toggle(p + "-qh", "Quiet hours 10:00 pm–7:00 am", true)}</div>`;
  reg("P43", {
    states: [
      ["ready", "Context ready", 0],
      ["prefs", "Preferences step", null, "Map lists preferences as content and ‘Set preferences’ as an action; this is the step that does it."],
      ["multiple", "Multiple roles", 1],
      ["incomplete", "Profile incomplete", 2],
      ["saved", "Preferences saved", 3],
      ["deferred", "Deferred", 4],
    ],
    url: (st) => "app.whiteboard.example/welcome" + ({ prefs: "/preferences", saved: "/first-task", multiple: "/choose-start", deferred: "" }[st] ?? ""),
    web(st) {
      if (st === "deferred")
        return web({ nav: "today", crumbs: [["Today"]], url: "app.whiteboard.example/today", body: webHead(`Good morning, Aisha`, `${D.today} · Fall 2026`) + card("", `<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><span style="flex:1;min-width:220px"><b>Finish setting up Whiteboard</b><br><span class="meta">2 of 3 steps left · preferences and your first task. Defaults are in use until then.</span></span>${btn("Resume setup", { cls: "btn primary", go: "P43:prefs" })}${btn("Dismiss", { cls: "btn plain", note: "Hides this card; setup stays available in Account" })}</div>`, { label: "Setup reminder" }) + `<p class="meta" style="margin-top:16px">Today’s work, schedule and updates appear below as designed in S01. ${link("Open S01 Today", { go: "S01:usual" })}</p>` });
      let body, aside = "";
      if (st === "ready") body = `${steps(1)}<h1>Welcome to Whiteboard, Aisha</h1><p>Check the details ${I.short} shared with us. You don’t need to choose a role — it comes from your school.</p>${card("", aishaFacts())}<p class="meta">Something wrong? Your school manages these details. ${link("How to fix them", { go: "P44:managed" })}</p><div style="display:flex;gap:8px;flex-wrap:wrap">${btn("Looks right", { cls: "btn primary", go: "P43:prefs" })}${btn("Set up later", { cls: "btn plain", go: "P43:deferred" })}</div>`;
      else if (st === "prefs") body = `${steps(2)}<h1>Make Whiteboard comfortable</h1><p>These apply on every device where you sign in.</p>${card("", prefsForm("w"))}<div style="display:flex;gap:8px;flex-wrap:wrap">${btn("Save and continue", { cls: "btn primary", go: "P43:saved" })}${btn("Back", { cls: "btn", go: "P43:ready" })}${btn("Skip for now", { cls: "btn plain", go: "P43:deferred" })}</div>`;
      else if (st === "multiple") {
        body = `${steps(1)}<h1>Where would you like to start?</h1><p>You have more than one role at ${I.short}. You can switch at any time from your account menu.</p>
<ul class="w-inst w-card flush" aria-label="Your roles"><li>${link(`${ic("book")}<span class="grow"><b>Teaching · PHYS 110</b><span class="meta" style="display:block">Instructor · course builder, grading, release</span></span>${ic("chev-r")}`, { go: "S14:draft" })}</li>
<li>${link(`${ic("calendar")}<span class="grow"><b>Physics department scheduling</b><span class="meta" style="display:block">Department scheduler · room and section proposals</span></span>${ic("chev-r")}`, { go: "S24:current", note: "Opens academic scheduling, filtered to Physics; requires department permission" })}</li>
<li>${link(`${ic("building")}<span class="grow"><b>Institution administration</b><span class="meta" style="display:block">Only if your school assigned you as an administrator</span></span>${ic("chev-r")}`, { go: "S37:active", note: "Shown only to authorized administrators" })}</li></ul>`;
        aside = `<p><b style="color:var(--wb-text)">Signed in as Dr. Diane Reyes</b><br>${D2.staff.email}</p><p>Roles come from ${I.short}’s records and course invitations, never from this choice. Choosing only sets where you land first.</p>`;
      } else if (st === "incomplete") body = `${steps(1)}<h1>One detail is missing</h1>${card("", aishaFacts(true))}${notice("warning", "mail", "Your school record has no email address", `Whiteboard uses it for receipts and update emails. Only the ${I.short} Registrar can add it. Until then, receipts stay available in Whiteboard and updates appear in the app only.`, btn("How to contact the Registrar", { cls: "btn", icon: "external", note: "Opens the school’s registrar page (institution-owned)" }))}<div style="display:flex;gap:8px;flex-wrap:wrap">${btn("Continue without email", { cls: "btn primary", go: "P43:prefs" })}${btn("Set up later", { cls: "btn plain", go: "P43:deferred" })}</div>`;
      else body = `${steps(3)}${notice("success", "check-circle", "Preferences saved", "Match system · Default text · Daily digest at 7:00 am · Due-date changes immediately · Quiet hours on")}<h1>Your first task</h1>${card("", `<p class="eyebrow">Due tomorrow</p><p style="font-size:17px;font-weight:650;margin:2px 0">Problem Set 4: Kinematics</p><p class="meta">PHYS 110 · Due ${D.a.due} · Not started</p><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">${btn("Start your student day", { cls: "btn primary", go: "S01:usual" })}${btn("Open Problem Set 4", { cls: "btn", go: "S05:open" })}</div>`)}<p class="meta">Chosen from work already in your courses. ${link("Review your profile", { go: "P44:editable" })}</p>`;
      return webAccess({ url: this.url(st), body, aside });
    },
    ios(st) {
      const dots = (n) => `<div class="i-dots" aria-label="Page ${n} of 3" role="img">${[1, 2, 3].map((i) => `<i class="${i === n ? "on" : ""}"></i>`).join("")}</div>`;
      if (st === "deferred") return K.ios({ tab: "today", title: "", trail: K.iAvatar, large: "Today", sub: D.today, body: `<div class="i-card"><div class="t">Finish setting up</div><p class="meta">2 of 3 steps left. Defaults are in use until then.</p>${btn("Resume Setup", { cls: "i-btn tinted", go: "P43:prefs" })}</div><p class="i-foot">Today’s content as designed in ${link("S01", { go: "S01:usual" })}.</p>` });
      if (st === "prefs")
        return iAccess({ title: "", trail: btn("Skip", { cls: "i-iconbtn", note: "Skips to Today; setup resumes from Account", go: "P43:deferred" }), body: `${dots(2)}<h1 class="i-large" style="font-size:28px">Make it comfortable</h1>${group([ival("Appearance", "System", { note: "Picker: System, Light, Dark" }), ival("Text Size", "Use iPhone setting", { note: "Follows Dynamic Type by default" }), `${iswitch("ip43-rm", "Reduce Motion", false, { sub: "Follows iPhone setting" })}`], { h: "Display" })}
${group([iswitch("ip43-dg", "Daily digest · 7:00 am", true), iswitch("ip43-ur", "Due-date changes right away", true)], { h: "Updates", foot: "Next, iOS will ask whether Whiteboard may send notifications. You can say no and still see every update in the Updates tab." })}`, bottom: btn("Continue", { cls: "i-btn", go: "P43:saved", note: "Then the iOS notification permission prompt appears — only after this explanation" }) });
      if (st === "multiple")
        return iAccess({ title: "", body: `${dots(1)}<h1 class="i-large" style="font-size:28px">Where to start?</h1><p class="i-sub">Dr. Diane Reyes · You have more than one role. Switch any time from Account.</p>${group([row("Teaching · PHYS 110", "Instructor", { lead: ic("book"), go: "S14:draft" }), row("Department scheduling", "Physics · scheduler", { lead: ic("calendar"), go: "S24:current" })], { h: "Your roles", foot: "Roles come from Alder Hill’s records. This only chooses which tab opens first." })}` });
      if (st === "saved")
        return iAccess({ title: "", body: `${dots(3)}<div class="i-hero"><span class="glyph">${ic("check-circle")}</span><h1>You’re set</h1><p class="i-sub">Preferences saved. Change them any time in Account.</p></div>${group([row("Problem Set 4: Kinematics", "PHYS 110 · Due Fri, Oct 16 · 11:59 pm", { lead: ic("doc"), bold: true, go: "S05:open" })], { h: "Your first task" })}${group([row("Review your profile", "", { lead: ic("person"), go: "P44:editable" })])}`, bottom: btn("Go to Today", { cls: "i-btn", go: "S01:usual" }) });
      const missing = st === "incomplete";
      return iAccess({ title: "", trail: btn("Later", { cls: "i-iconbtn", go: "P43:deferred" }), body: `${dots(1)}<h1 class="i-large" style="font-size:28px">${missing ? "One detail is missing" : "Welcome, Aisha"}</h1>${group([ival("Name", "Aisha Rahman"), ival("School", I.short), ival("Role", "Student"), ival("Courses", "3 this term"), ival("School email", missing ? "Missing" : "arahman@…", { err: missing })], { h: "From Alder Hill", foot: missing ? "Only the Alder Hill Registrar can add your email. Until then, receipts stay in the app and updates appear only in Updates." : "Your school manages these details." })}`, bottom: btn(missing ? "Continue Without Email" : "Looks Right", { cls: "i-btn", go: "P43:prefs" }) });
    },
    notes: {
      ready: { web: "Step 1 of 3. Shows assigned records (name, school, role, courses); the person never picks a role. Fix route goes to the institution-managed explanation in P44.", ios: "Paged flow, page 1; ‘Later’ in the nav bar defers without losing progress." },
      prefs: { web: "Display and update preferences in one short form; defaults are respectful (digest, quiet hours). Skip is always available.", ios: "Explains delivery choices first; the system notification prompt follows Continue, never on launch." },
      multiple: { web: "Starting-context choice for a person with several assigned roles; explains choice only sets the landing tab. Roles not assigned are not shown.", ios: "Same list; selecting opens the matching tab set." },
      incomplete: { web: "Names the missing field, who can fix it and what still works meanwhile; the person may continue.", ios: "Missing value shown as text ‘Missing’ in error colour plus footer explanation." },
      saved: { web: "Step 3: confirmation of saved choices plus one credible first task drawn from existing work (PS4 due tomorrow).", ios: "Final page ends at Today; first task row deep-links." },
      deferred: { web: "Lands on Today with a dismissible resume card; defaults apply. Nothing blocks normal use.", ios: "Same card at the top of the Today tab." },
    },
    a11y: ["Step indicator is an ordered list with aria-current=step; iOS page dots have a text label (‘Page 2 of 3’).", "Each switch has role=switch with a visible label.", "Missing data is stated in words, not by colour."],
  });

  /* ============ P44 PROFILE AND ACCOUNT ============ */
  const sec = [["profile", "Profile"], ["display", "Display & accessibility"], ["identity", "School identity & roles"], ["sessions", "Sign-in & sessions"], ["updates", "Update preferences"]];
  const secNav = (cur) => `<nav aria-label="Account sections"><ul class="w-outline">${sec.map(([k, t]) => `<li>${link(t, { cls: "item", go: k === "updates" ? null : `P44:${{ profile: "editable", display: "editable", identity: "managed", sessions: "current" }[k]}`, note: k === "updates" ? "Update preferences live in S13 Updates (its preferences panel)" : null }).replace("<a ", `<a style="padding-left:10px"${k === cur ? ' aria-current="true"' : ""} `)}</li>`).join("")}</ul></nav>`;
  const avatar = (txt, size = 64, pending) => `<span aria-hidden="true" style="display:grid;place-items:center;width:${size}px;height:${size}px;border-radius:50%;background:${pending ? "#c9d9e8" : "#d7e7e8"};color:#134447;font-weight:700;font-size:${size / 2.6}px;flex:none">${txt}</span>`;
  const sessions = (revoked) => `<div class="w-session">${ic("laptop")}<div class="grow"><b>Safari on Mac</b> ${badge("current")}<div class="meta">Signed in Thu, Oct 15 · 6:12 am ET · via ${I.idp}</div></div></div>
<div class="w-session">${ic("phone")}<div class="grow"><b>Whiteboard for iPhone</b> <span class="meta">(planned app)</span><div class="meta">Last active Thu, Oct 15 · 6:30 am ET</div></div>${btn("Sign out", { cls: "btn", note: "Ends that session; the device must sign in through Alder Hill again" })}</div>
<div class="w-session">${ic("laptop")}<div class="grow"><b>Chrome on Windows · Library computer</b>${revoked ? " " + badge("revoked") : ""}<div class="meta">${revoked ? "Signed out just now by you" : "Last active Fri, Oct 9 · 4:40 pm ET"}</div></div>${revoked ? "" : btn("Sign out", { cls: "btn", go: "P44:revoked" })}</div>`;
  const delegated = (revoked) => `<div class="w-session">${ic("calendar")}<div class="grow"><b>Calendar feed link</b>${revoked ? " " + badge("revoked", "Access ended") : ""}<div class="meta">${revoked ? "The old link stopped working. Calendar apps using it won’t update." : "Read-only due dates for an external calendar app · created Sep 2"}</div></div>${revoked ? btn("Create new link", { cls: "btn", note: "Creates a new read-only feed link" }) : btn("Turn off", { cls: "btn", go: "P44:revoked" })}</div>`;
  reg("P44", {
    states: [
      ["editable", "Editable", 0],
      ["managed", "Institution managed", 1],
      ["photo", "Pending photo review", 2],
      ["current", "Session current", 3],
      ["revoked", "Session revoked", 4],
    ],
    url: (st) => "app.whiteboard.example/account/" + ({ editable: "profile", managed: "identity", photo: "profile", current: "sessions", revoked: "sessions" }[st]),
    web(st) {
      const cur = { editable: "profile", managed: "identity", photo: "profile", current: "sessions", revoked: "sessions" }[st];
      let main;
      if (st === "editable" || st === "photo") {
        const pending = st === "photo";
        main = (pending ? notice("warning", "hourglass", "New photo pending review", `Submitted Thu, Oct 15 · 6:20 am ET. ${I.short}’s ID office reviews profile photos, usually within 2 school days. Your current photo stays visible until then.`, btn("Withdraw new photo", { cls: "btn", note: "Keeps the current photo; the pending one is discarded" })) + '<div style="height:12px"></div>' : "") +
          card("Profile", `<div style="display:flex;gap:16px;align-items:center;margin-bottom:14px">${avatar("AR")}${pending ? `${ic("chev-r")}${avatar("AR", 64, true)}<span class="meta">Current · Pending</span>` : ""}<div style="margin-left:${pending ? "8px" : "0"}">${btn(pending ? "Photo under review" : "Change photo", { cls: "btn", icon: "photo", go: pending ? null : "P44:photo", disabled: pending, note: pending ? "One photo can be reviewed at a time" : "Opens a file picker; the photo goes to review before others see it" })}</div></div>
<div class="w-form">${field({ id: "wp-legal", label: "Legal name", value: "Aisha Rahman", readonly: true, managed: true, hint: "From your school record" })}${field({ id: "wp-pref", label: "Name shown to others", value: "Aisha", hint: "Used in courses, discussions and feedback" })}${field({ id: "wp-pro", label: "Pronouns", value: "", hint: "Optional. Leave blank to show none.", type: "text" })}${field({ id: "wp-pron", label: "Name pronunciation", value: "EYE-sha RAH-mahn", hint: "Optional" })}</div>
<div style="display:flex;gap:8px;margin-top:14px">${btn("Save changes", { cls: "btn primary", disabled: true, describedby: "wp-save-h", note: "Nothing has changed yet" })}<span class="meta" id="wp-save-h" style="align-self:center">No unsaved changes</span></div>`) +
          card("Display & accessibility", `${field({ id: "wp-ap", label: "Appearance", type: "select", value: "Match system", options: ["Match system", "Light", "Dark"] })}<div style="margin-top:10px">${toggle("wp-rm", "Reduce motion", false, { sub: "Follows your device unless set here" })}${toggle("wp-hc", "Increase contrast", false)}${toggle("wp-ul", "Always underline links", true)}</div><p class="meta" style="margin-top:8px">Applies to every Whiteboard workspace on every device where you sign in.</p>`);
      } else if (st === "managed") {
        main = card("School identity & roles", `${notice("neutral", "building", `These details are managed by ${I.name}`, `To change them, contact the ${I.short} Registrar. Whiteboard updates automatically when your school record changes.`, btn("Contact the Registrar", { cls: "btn", icon: "external", note: "Opens the school’s registrar page (institution-owned)" }))}
<div class="w-form" style="margin-top:14px">${field({ id: "wm-legal", label: "Legal name", value: "Aisha Rahman", readonly: true, managed: true })}${field({ id: "wm-id", label: "Student ID", value: "AH-2027-04418", readonly: true, managed: true })}${field({ id: "wm-em", label: "School email", value: "arahman@alderhill.example", readonly: true, managed: true })}${field({ id: "wm-inst", label: "School", value: I.name, readonly: true, managed: true })}</div>
<h3 style="font-size:15px;margin:18px 0 6px">Roles</h3><ul class="w-list inset"><li>${ic("book")}<div class="grow"><span class="title">Student</span><div class="meta">Fall 2026 · PHYS 110, MATH 220, WRIT 140</div></div>${badge("managed", "From school records")}</li></ul>
<p class="meta" style="margin-top:10px">Sign-in method: ${I.idp}. Password and two-step verification are managed at ${I.host}.</p>`);
      } else {
        const rv = st === "revoked";
        main = (rv ? notice("success", "check-circle", "Signed out of 2 sessions", "Library computer and Calendar feed link no longer have access. Any work already submitted is unaffected.") + '<div style="height:12px"></div>' : "") +
          card("Sign-in", `<dl class="facts"><dt>Method</dt><dd>${I.idp} (single sign-on)</dd><dt>Password</dt><dd>Managed by ${I.short} · ${link("Change at " + I.host, { note: "Opens the institution’s account page" })}</dd><dt>Account security</dt><dd>${badge("complete", "No recent problems")}</dd></dl>`) +
          card("Where you’re signed in", sessions(rv) + `<div style="margin-top:10px">${btn("Sign out everywhere else", { cls: "btn destructive", note: "Ends every session except this one" })}</div>`) +
          card("Connected access", `<p class="meta" style="margin-bottom:6px">Links and apps you allowed to read your Whiteboard information.</p>${delegated(rv)}`);
      }
      return web({ nav: null, crumbs: [["Today", "S01:usual"], ["Account"]], url: this.url(st), body: webHead("Account", `Aisha Rahman · Student · ${I.name}`, btn("Back to Today", { cls: "btn", go: "S01:usual" })) + `<div class="w-grid split" style="grid-template-columns:200px minmax(0,1fr)"><div>${secNav(cur)}</div><div class="w-stack" style="display:grid;gap:16px">${main}</div></div>` });
    },
    ios(st) {
      const back = ["Today", "S01:usual"];
      if (st === "current" || st === "revoked") {
        const rv = st === "revoked";
        return K.ios({ tab: "today", back: ["Account", "P44:editable"], title: "Sign-In & Sessions", body: (rv ? notice("success", "check-circle", "Library computer signed out", "Calendar feed link turned off too.") : "") + group([ival("Method", I.idp), ival("Password", "Managed by Alder Hill", { note: "Opens login.alderhill.example in Safari" })], { h: "Sign-in" }) +
          group([row("This iPhone", "Whiteboard app · active now", { lead: ic("phone"), trail: badge("current") }), row("Safari on Mac", "Thu, Oct 15 · 6:12 am", { lead: ic("laptop"), note: "Session detail: device, sign-in time, Sign Out" }), row("Library computer", rv ? "Signed out just now" : "Fri, Oct 9 · 4:40 pm", { lead: ic("laptop"), trail: rv ? badge("revoked") : "", go: rv ? null : "P44:revoked" })], { h: "Where you’re signed in" }) +
          group([row("Calendar feed link", rv ? "Access ended" : "Read-only due dates", { lead: ic("calendar"), trail: rv ? badge("revoked", "Off") : "", go: rv ? null : "P44:revoked" })], { h: "Connected access" }) + group([`<button type="button" class="rowbtn danger" data-note="Ends all other sessions">Sign Out Everywhere Else</button>`]) });
      }
      if (st === "managed")
        return K.ios({ tab: "today", back: ["Account", "P44:editable"], title: "School Identity", body: group([ival("Legal Name", "Aisha Rahman"), ival("Student ID", "AH-2027-04418"), ival("Email", "arahman@…"), ival("School", I.short)], { h: "Managed by Alder Hill", foot: "To change these, contact the Alder Hill Registrar. Whiteboard updates when your school record changes." }) + group([row("Student", "Fall 2026 · 3 courses", { lead: ic("book") })], { h: "Roles" }) + group([row("Contact the Registrar", "Opens in Safari", { lead: ic("external"), note: "Institution-owned page" })]) });
      const pending = st === "photo";
      return K.ios({ tab: "today", back, title: "Account", large: "", body: `<div class="i-hero">${avatar("AR", 84, false)}<h1 style="font-size:22px">Aisha Rahman</h1><p class="i-sub">Student · ${I.name}</p>${pending ? badge("pendingReview", "New photo pending review") : btn("Change Photo", { cls: "btn plain", go: "P44:photo", note: "iOS asks for Photos access only now, when you choose a new photo" })}</div>${pending ? `<p class="i-foot" style="margin-top:0">Your current photo stays visible until Alder Hill approves the new one.</p>` : ""}
${group([`<div class="i-fieldrow" style="width:100%">${ifield("ip44-n", "Name shown to others", "Aisha")}</div>`, `<div class="i-fieldrow" style="width:100%">${ifield("ip44-p", "Pronouns (optional)", "")}</div>`, ival("Legal Name", "Managed", { go: "P44:managed" })], { h: "Profile" })}
${group([ival("Appearance", "System", { note: "Picker" }), iswitch("ip44-rm", "Reduce Motion", false, { sub: "Follows iPhone setting" }), ival("Text Size", "iPhone setting", { note: "Follows Dynamic Type" })], { h: "Display" })}
${group([row("School Identity & Roles", "", { lead: ic("building"), go: "P44:managed" }), row("Sign-In & Sessions", "", { lead: ic("shield"), go: "P44:current" }), row("Update Preferences", "", { lead: ic("bell"), go: "S13:unread" }), row("Search", "Proposed · P45", { lead: ic("search"), go: "P45:noquery" }), row("Help", "Proposed · P46", { lead: ic("help"), go: "P46:selfservice" })])}
${group([`<button type="button" class="rowbtn danger" data-go="P41:need" data-note="Signs out on this iPhone; next sign-in returns through Alder Hill">Sign Out</button>`])}` });
    },
    notes: {
      editable: { web: "Editable fields (display name, pronouns, pronunciation) are standard inputs; institution-owned fields are read-only with a dashed border and ‘Managed by institution’ text. Pronouns default to blank. Save is disabled with a stated reason until something changes.", ios: "Settings-style Account screen reached from the avatar; also hosts proposed Search/Help entries (open question D-iOS-Search)." },
      managed: { web: "Explains who owns each field and the exact change route; roles listed with source. Sign-in method and password owner named.", ios: "Grouped read-only values with a footer explaining the change route." },
      photo: { web: "Shows current and pending photos side by side; current remains public until review; withdraw is possible; Change Photo is disabled with reason.", ios: "Photo permission is requested only on Change Photo; pending state shown as a badge." },
      current: { web: "Sessions list marks this device, shows sign-in time and method, and offers per-session sign-out plus ‘everywhere else’. Delegated access (calendar feed) is separate.", ios: "Pushed Sign-In & Sessions screen; session rows open a detail screen." },
      revoked: { web: "Confirms exactly what ended and that submitted work is unaffected; revoked items remain listed with ‘Signed out’ until the page is left.", ios: "Same confirmation at the top; revoked rows lose their chevron." },
    },
    a11y: ["Read-only fields use readonly (not disabled) so they stay focusable and readable.", "Section navigation marks the current section; headings mirror it.", "Destructive actions use words (‘Sign out everywhere else’), not just red."],
  });
})();
