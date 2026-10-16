/* Batch 02 teaching screens S14–S16: course builder, assignment editor, quiz builder.
   Staff-only authoring; learner effects happen only through publication. Fictional data. */
(function () {
  "use strict";
  const K = window.K;
  const { D, D2, ic, esc, badge, btn, link, notice, card, webStaff, webHead, ios, group, row, field, toggle, checks, table, ival, iswitch, ifield, sheet, typeIcon, previewBar } = K;
  const reg = K.reg;
  const iStaff = (o) => ios({ tabs: K.STAFFTABS, tab: "teaching", ...o });
  const focusBtn = (text, id) => `<button type="button" class="btn plain" data-focus="${id}">${text}</button>`;
  const crumbsC = [["Teaching", "S14:published"], ["PHYS 110", "S14:published"]];

  /* ============ S14 COURSE BUILDER ============ */
  const preTerm = (st) => ["draft", "attention", "ready"].includes(st);
  const courseBadge = (st) => (st === "published" || st === "preview" ? badge("published", "Published · students can enter") : st === "draft" ? badge("staffDraft", "Draft · students can’t enter") : st === "attention" ? badge("attention", "Needs attention · 2 issues") : badge("ready", "Ready to publish"));
  const outline = (st, selId = "m3") => `<nav aria-label="Course outline"><ul class="w-outline">${D2.mods.map((m, i) => {
    const mState = preTerm(st) ? "staffDraft" : m.state;
    return `<li><div class="mod"${m.id === selId ? ' aria-current="true"' : ""}><button type="button" class="w-handle" aria-label="Reorder ${esc(m.title)}" data-note="Drag, or use Move up/Move down in this menu; order changes are staff-only until published">${ic("grip")}</button><span class="grow">${i + 1}. ${esc(m.title)}</span>${badge(mState, mState === "published" ? "Published" : "Draft")}</div>
<ul>${m.items.map(([t, n]) => {
      const go = t === "assignment" && n.startsWith("Problem Set 4") ? (st === "attention" ? "S15:invalid" : "S15:published") : t === "quiz" && n.startsWith("Quiz 3") ? (st === "attention" ? "S16:invalid" : "S16:published") : t === "page" && m.id === "m4" ? "P47:draft" : t === "file" ? (st === "attention" ? "P48:a11y" : "P48:ready") : t === "assignment" && m.id === "m4" ? "S15:draft" : null;
      return `<li>${link(`${ic(typeIcon(t))}<span class="grow">${esc(n)}</span>`, { cls: "item", go, note: go ? null : "Opens this item’s editor" })}</li>`;
    }).join("")}</ul></li>`;
  }).join("")}</ul><div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">${btn("Add module", { cls: "btn", icon: "plus", note: "Adds an empty draft module at the end" })}</div></nav>`;
  const readiness = (st) => {
    if (st === "draft") return checks([["todo", "Run checks to see what students would be missing"]], "Readiness");
    if (st === "attention") return checks([["err", "Problem Set 4: close date is before the due date", "S15:invalid"], ["err", "Quiz 3: question 2 has no points", "S16:invalid"], ["warn", "Force-diagram worksheet has no accessible alternative", "P48:a11y"], ["ok", "Syllabus and schedule published"], ["ok", "Every module has a release date"], ["ok", "Gradebook totals match assignment points"]], "Readiness");
    return checks([["ok", "Assignments: dates and points valid"], ["ok", "Quizzes: every item has points and an answer"], ["ok", "Materials: accessible alternatives present"], ["ok", "Syllabus and schedule published"], ["ok", "Every module has a release date"]], "Readiness");
  };
  const modDetail = (st) => {
    const m = D2.mods[2];
    return card(`Module 3 · ${m.title} ${badge(preTerm(st) ? "staffDraft" : "published", preTerm(st) ? "Draft" : "Published")}`, `<dl class="facts"><dt>Opens</dt><dd>Mon, Oct 12 · 8:00 am ET</dd><dt>Prerequisite</dt><dd>Complete Module 2</dd><dt>Items</dt><dd>4 · page, video, assignment, quiz</dd></dl>
<ul class="w-list inset" style="margin-top:10px">${m.items.map(([t, n]) => `<li>${ic(typeIcon(t))}<div class="grow"><span class="title">${esc(n)}</span><div class="meta">${{ page: "Lesson page · P47", video: "Video · captions and transcript", assignment: "30 points · due Fri, Oct 16", quiz: "10 points · 20 minutes · 2 attempts" }[t]}</div></div>${btn("Edit", { cls: "btn plain", go: { page: "P47:published", video: "P48:ready", assignment: st === "attention" ? "S15:invalid" : "S15:published", quiz: st === "attention" ? "S16:invalid" : "S16:published" }[t] })}</li>`).join("")}</ul>
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">${btn("New lesson page", { cls: "btn", icon: "doc", go: "P47:draft" })}${btn("New assignment", { cls: "btn", icon: "pencil", go: "S15:draft" })}${btn("New quiz", { cls: "btn", icon: "list", go: "S16:draft" })}${btn("Add file", { cls: "btn", icon: "folder", go: "P48:uploading" })}</div>`);
  };
  const courseTools = `<ul class="w-list inset">${[["Rubric library", "table", "P49:ready", null], ["Course people and allowances", "users", "S21:active", null], ["Prepare the next term", "copy", "S22:incomplete", null], ["Course observations", "eye", "S23:followup", null], ].map(([t, i, go, note]) => `<li>${ic(i)}<div class="grow">${link(t, { cls: "title", go, note })}</div></li>`).join("")}<li data-handoff="S37">${ic("building")}<div class="grow"><span class="title">Implementation acceptance</span><div class="meta">Handled by Alder Hill administrators in S37 People, access &amp; records — you’re told when the course is accepted.</div></div></li></ul>`;
  reg("S14", {
    states: [
      ["draft", "Draft course", 0],
      ["attention", "Needs attention", 1],
      ["ready", "Ready", 2],
      ["published", "Published", 3],
      ["preview", "Student preview", 4],
    ],
    url: (st) => "app.whiteboard.example/teach/phys-110" + (st === "preview" ? "/preview/student" : "/builder"),
    web(st) {
      if (st === "preview")
        return webStaff({ tool: "builder", crumbs: [...crumbsC, ["Student preview"]], url: this.url(st), banner: previewBar("S14:published"), body: webHead("PHYS 110 · Introductory Mechanics", "What an enrolled student sees today · Thu, Oct 15") + `<div class="w-grid even">${card("This week · Module 3: Projectile motion", `<p>Describe projectile motion by treating horizontal and vertical motion separately, linked by the same time.</p><ul class="w-list inset" style="margin-top:8px"><li>${ic("pencil")}<div class="grow"><span class="title">Problem Set 4: Kinematics</span><div class="meta">Due ${D.a.due}</div></div>${badge("available", "Open")}</li><li>${ic("list")}<div class="grow"><span class="title">Quiz 3: Projectile motion</span><div class="meta">Open until Mon, Oct 19 · 20 minutes</div></div></li></ul>`)}${card("Not visible to students yet", `<ul class="w-list inset"><li>${ic("lock")}<div class="grow"><span class="title">Module 4 · Forces and free-body diagrams</span><div class="meta">Draft · opens Mon, Oct 19 after Module 3</div></div></li></ul><p class="meta" style="margin-top:8px">Preview shows only what publication, dates and prerequisites allow.</p>`)}</div><p style="margin-top:16px">${link("Open the full student course view", { go: "S03:published" })} · ${link("Student module view", { go: "S04:available" })}</p>` });
      const meta = preTerm(st) ? "Fall 2026 · Term starts Mon, Aug 31 · 44 enrolled · Last edited Mon, Aug 24" : "Fall 2026 · Mon / Wed / Fri 9:00 am · Hollis Hall 104 · 44 enrolled";
      const pubBtn = st === "ready" ? btn("Publish course", { cls: "btn primary", icon: "publish", go: "S14:published", note: "Confirms: 44 enrolled students can enter on publish; modules keep their own release dates" }) : st === "published" ? "" : btn("Publish course", { cls: "btn primary", icon: "publish", disabled: true, describedby: "s14-pub-why", note: st === "draft" ? "Run readiness checks first" : "Fix the 2 blocking issues first" });
      const right = `<div class="w-rail">${card(`Readiness ${st === "attention" ? `<span class="meta">2 block publishing</span>` : ""}`, readiness(st) + `<div style="display:grid;gap:8px;margin-top:14px">${pubBtn}${st === "draft" ? btn("Run readiness checks", { cls: "btn", icon: "checklist", go: "S14:attention" }) : st === "attention" ? btn("Check again", { cls: "btn", icon: "retry", go: "S14:ready", note: "Design review: shows the result after both issues are fixed" }) : ""}${st === "published" ? "" : `<p class="meta" id="s14-pub-why">${{ draft: "Checks haven’t run yet.", attention: "2 issues must be fixed before students can enter.", ready: "Students can enter as soon as you publish. Modules still open on their own dates." }[st]}</p>`}</div>`)}
${card("Student view", `<p class="meta">See exactly what an enrolled student would see${st === "published" ? " today" : " after publishing"}.</p><div style="margin-top:10px">${btn("Preview as student", { cls: "btn block", icon: "eye", go: "S14:preview" })}</div>`)}
${card("Course tools", courseTools)}</div>`;
      return webStaff({ tool: "builder", crumbs: [...crumbsC.slice(0, 1), ["PHYS 110 · Course builder"]], url: this.url(st), body: webHead(`PHYS 110 · Introductory Mechanics ${courseBadge(st)}`, meta, btn("Preview as student", { cls: "btn", icon: "eye", go: "S14:preview" })) + `<div class="w-grid edit3">${card("Outline", outline(st))}<div style="display:grid;gap:16px;min-width:0">${st === "published" ? notice("success", "check-circle", "Published Mon, Aug 31 · 8:00 am ET", "Students enter the course; each module opens on its own date. Draft items stay hidden.") : ""}${modDetail(st)}</div>${right}</div>` });
    },
    ios(st) {
      if (st === "preview")
        return iStaff({ back: ["PHYS 110", "S14:published"], title: "Student Preview", raw: "", body: `<div class="i-previewbar" style="margin:0 -16px 12px">${ic("eye")}<span><b>Viewing as a student</b> · nothing is recorded</span><button type="button" data-go="S14:published">Done</button></div>${group([row("Module 3: Projectile motion", "This week · 2 of 4 modules complete", { bold: true, go: "S04:available" }), row("Problem Set 4: Kinematics", "Due Fri, Oct 16 · 11:59 pm", { go: "S05:open" }), row("Quiz 3: Projectile motion", "Open until Mon, Oct 19", { go: "S10:available" })], { h: "This week" })}${group([row("Module 4 · Forces", "Hidden from students · draft", { lead: ic("lock") })], { h: "Not visible yet" })}<p class="i-foot">${link("Open full student course view", { go: "S03:published" })}</p>` });
      const issues = st === "attention";
      return iStaff({ title: "PHYS 110", trail: K.iStaffAvatar, large: "PHYS 110", sub: `Introductory Mechanics · ${preTerm(st) ? "Starts Mon, Aug 31" : "Fall 2026"} · 44 enrolled`, body: `<div class="i-card"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center">${courseBadge(st)}</div><p class="meta">${{ draft: "Students can’t enter. Run checks before publishing.", attention: "2 issues block publishing.", ready: "All checks pass. Modules keep their own release dates.", published: "Published Mon, Aug 31. Draft items stay hidden." }[st]}</p>${st === "ready" ? btn("Publish Course", { cls: "i-btn", go: "S14:published", note: "Confirmation alert names who gains access" }) : st === "draft" ? btn("Run Checks", { cls: "i-btn tinted", go: "S14:attention" }) : ""}</div>
${issues ? group([row("PS4 close date is before due date", "Blocks publishing", { lead: `<span style="color:var(--wb-error)">${ic("alert")}</span>`, go: "S15:invalid" }), row("Quiz 3 · question 2 has no points", "Blocks publishing", { lead: `<span style="color:var(--wb-error)">${ic("alert")}</span>`, go: "S16:invalid" }), row("Worksheet needs accessible alternative", "Warning", { lead: `<span style="color:var(--wb-warning)">${ic("alert")}</span>`, go: "P48:a11y" })], { h: "Issues" }) : ""}
${group(D2.mods.map((m, i) => row(`${i + 1}. ${esc(m.title)}`, `${m.items.length} items · ${preTerm(st) ? "Draft" : m.state === "published" ? "Published" : "Draft"}`, { go: i === 2 ? (issues ? "S15:invalid" : "S15:published") : i === 3 ? "P47:draft" : null, note: i < 2 ? "Module detail: items list; reorder in a focused Edit screen" : null })), { h: "Modules", foot: "Reorder and bulk moves open a focused Edit screen; dense outline work is easier on the web." })}
${group([row("Preview as Student", "", { lead: ic("eye"), go: "S14:preview" }), row("Files", "", { lead: ic("folder"), go: "P48:ready" }), row("Rubrics", "", { lead: ic("table"), go: "P49:inuse" }), row("People", "", { lead: ic("users"), go: "S21:active" }), row("Next Term", "", { lead: ic("copy"), go: "S22:incomplete" }), row("Insights", "", { lead: ic("gauge"), go: "S23:followup" })], { h: "Course" })}` });
    },
    notes: {
      draft: { web: "Three-pane authoring workspace: outline (reorderable, per-item status), selected module detail, readiness rail. Publish is visible but unavailable with its reason. Scenario date is before term (Aug 24).", ios: "Course-management stack: status card with the next sensible action, modules list, course tools. Reordering is a focused Edit screen." },
      attention: { web: "Readiness lists blocking issues first; each links straight to the affected editor (S15, S16, P48). Publish stays described by ‘2 issues must be fixed’.", ios: "Issues group sits above modules; each row pushes the affected editor." },
      ready: { web: "All checks pass; Publish course becomes primary and explains what happens (students can enter; modules keep their dates).", ios: "Publish in the status card; a confirmation alert names who gains access." },
      published: { web: "Confirmation with time; publish button removed (unpublishing is rare and lives in course settings). Student preview stays one click away.", ios: "Status card shows published time; preview and tools remain." },
      preview: { web: "Distinct purple preview bar on every preview page with a direct ‘Return to builder’. Content shows only what publication, dates and prerequisites allow; the hidden draft module is named separately for the instructor.", ios: "Preview banner with Done returns to the builder; rows open the same learner screens (S03/S04/S05)." },
    },
    a11y: ["Outline is a nested list; reorder handles are labelled buttons with a Move up/Move down menu alternative.", "Readiness items announce ‘Blocks publishing’ / ‘Passed’ as text.", "Preview bar uses role=status and is the first element after the top bar."],
  });

  /* ============ S15 ASSIGNMENT EDITOR ============ */
  const qRows = (p, st) => D.questions.map((q) => {
    const bad = st === "invalid" && q.id === "3";
    const id = `${p}-q${q.id}`;
    return { cells: [`${q.id}`, `<span class="meta">${esc(q.text.slice(0, 64))}…</span>`, `<div class="w-field${bad ? " invalid" : ""}" style="width:84px"><label for="${id}" class="sr">Points for question ${q.id}</label><input id="${id}" type="text" inputmode="numeric" value="${bad ? "" : q.max}"${bad ? ` aria-invalid="true" aria-describedby="${id}-e"` : ""}></div>${bad ? `<span class="meta" id="${id}-e" style="color:var(--wb-error);font-weight:600">Enter points</span>` : ""}`] };
  });
  const s15checks = (st) => st === "draft" ? checks([["todo", "Validate to check dates, points and files"]], "Validation") : st === "invalid" ? checks([["err", `<button type="button" class="btn plain" style="padding:0;min-height:0" data-focus="ws15-close">Close date is before the due date</button>`], ["err", `<button type="button" class="btn plain" style="padding:0;min-height:0" data-focus="ws15-q3">Question 3 has no points · total is 22 of 30</button>`], ["ok", "AI-use rule fits the course policy"], ["ok", "Attached files have accessible text"]], "Validation") : checks([["ok", "Due Fri, Oct 16 before close Sun, Oct 18"], ["ok", "Question points total 30 of 30"], ["ok", "AI-use rule fits the course policy"], ["ok", "Attached files have accessible text"], ["ok", "Rubric total matches question 3 (8 points)"]], "Validation");
  reg("S15", {
    states: [
      ["draft", "Draft", 0],
      ["invalid", "Invalid", 1],
      ["ready", "Ready", 2],
      ["published", "Published", 3],
      ["changed", "Changed after publish", 4],
    ],
    url: () => "app.whiteboard.example/teach/phys-110/assignments/ps4/edit",
    web(st) {
      const pub = st === "published" || st === "changed";
      const status = { draft: badge("staffDraft"), invalid: badge("attention", "2 issues"), ready: badge("ready"), published: badge("published", "Published · students can see it"), changed: badge("changed", "Unpublished changes") }[st];
      const instr = st === "changed" ? "Show all working. For question 3, take upward as positive and use g = 9.8 m/s² downward." : "Show all working. Scan or upload your pages and tag each question.";
      const form = card("Details", `<div class="w-form">${field({ id: "ws15-title", label: "Title", value: D.a.title, req: true, w: 2 })}${field({ id: "ws15-ins", label: "Instructions", type: "textarea", value: instr, w: 2, hint: st === "changed" ? "Edited · not yet published" : "" })}${field({ id: "ws15-due", label: "Due", value: "Fri, Oct 16, 2026 · 11:59 pm ET", req: true })}${field({ id: "ws15-close", label: "Close (late work until)", value: st === "invalid" ? "Thu, Oct 15, 2026 · 11:59 pm ET" : "Sun, Oct 18, 2026 · 11:59 pm ET", err: st === "invalid" ? "Close must be on or after the due date (Fri, Oct 16)." : "", hint: "Individual allowances extend both dates (S21)" })}${field({ id: "ws15-ai", label: "AI-use rule", type: "select", value: "Limited", options: ["Not allowed", "Limited", "Allowed with disclosure"], hint: "Course policy allows up to ‘Allowed with disclosure’. Students see: " + esc(D.a.policy) })}${field({ id: "ws15-sub", label: "Submission", type: "select", value: "Scan or upload pages", options: ["Scan or upload pages", "File upload", "On paper"] })}</div>`) +
        card(`Questions <span class="meta">${st === "invalid" ? "22 of 30 points" : "30 points"}</span>`, table("Questions and point maxima", ["ID", "Question", "Points"], qRows("ws15", st)) + `<p class="meta" style="margin-top:8px">IDs stay the same when wording changes, so tags, grades and feedback keep matching.</p><div style="margin-top:8px">${btn("Add question", { cls: "btn", icon: "plus", note: "Adds question 5 with a new stable ID" })}</div>`) +
        card("Files and rubric", `<ul class="w-list inset"><li>${ic("doc")}<div class="grow"><span class="title">PS4 formula sheet.pdf</span><div class="meta">310 KB · version 1</div></div>${badge("complete", "Accessible text")}</li><li>${ic("table")}<div class="grow"><span class="title">Kinematics problem-solving · v2</span><div class="meta">Rubric for question 3 · 8 points</div></div>${btn("Change", { cls: "btn plain", go: "P49:inuse" })}</li></ul><div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">${btn("Add course file", { cls: "btn", icon: "folder", go: "P48:ready" })}${btn("Select or author rubric", { cls: "btn", icon: "table", go: "P49:ready" })}</div>`);
      let impact = "";
      if (st === "changed") impact = card("Learner impact", `<p>Publishing this change updates the instructions for <b>44 students</b>.</p><ul style="display:grid;gap:6px;padding-left:18px;list-style:disc;margin-top:8px"><li>18 students have submitted. Their receipts and submitted pages don’t change.</li><li>Students who already opened it see “Instructions updated Thu, Oct 15”.</li><li>Points, dates and question IDs are unchanged.</li></ul><div style="margin-top:10px">${toggle("ws15-ntf", "Notify students of the change", true, { sub: "Sends one update; respects quiet hours" })}</div><p class="meta" style="margin-top:6px">Changing points after grading starts goes through grading impact review (S17).</p>`, { cls: "", label: "Learner impact" });
      const actions = st === "changed" ? btn("Publish change", { cls: "btn primary block", icon: "publish", go: "S15:published" }) + btn("Discard change", { cls: "btn plain block", go: "S15:published", note: "Restores the published instructions" }) :
        pub ? btn("Unpublish", { cls: "btn block", disabled: true, describedby: "ws15-unpub", note: "Unavailable: 18 students have submitted" }) + `<p class="meta" id="ws15-unpub">Can’t unpublish: 18 students have submitted.</p>` :
        st === "ready" ? btn("Publish assignment", { cls: "btn primary block", icon: "publish", go: "S15:published", note: "Students see it when Module 3 opens (Mon, Oct 12)" }) :
        btn("Publish assignment", { cls: "btn primary block", icon: "publish", disabled: true, describedby: "ws15-why", note: st === "draft" ? "Validate first" : "Fix 2 issues first" }) + `<p class="meta" id="ws15-why">${st === "draft" ? "Validate before publishing." : "Fix 2 issues to publish."}</p>` + btn("Validate assignment", { cls: "btn block", icon: "checklist", go: st === "draft" ? "S15:invalid" : "S15:ready", note: st === "invalid" ? "Design review: result after fixing both" : null });
      const rail = `<div class="w-rail">${card(`Status ${status}`, s15checks(st) + `<div style="display:grid;gap:8px;margin-top:14px">${actions}${pub || st === "ready" ? "" : btn("Save draft", { cls: "btn plain block", note: "Saved · staff only" })}</div>`)}${impact}${card("Learner preview", `<p class="meta">${pub ? "Students see this now." : "Students can’t see this until it’s published."}</p><div style="margin-top:8px">${btn("Preview as student", { cls: "btn block", icon: "eye", go: "S05:open" })}</div>`)}</div>`;
      return webStaff({ tool: "builder", crumbs: [...crumbsC, ["Problem Set 4"]], url: this.url(st), body: webHead(`Edit assignment`, `Module 3 · Projectile motion · ${pub ? "Published Mon, Oct 5" : "Last saved Mon, Oct 5 · 3:12 pm ET"}`, btn("Back to course builder", { cls: "btn", go: "S14:published" })) + `<div class="w-grid edit"><div style="display:grid;gap:16px;min-width:0">${form}</div>${rail}</div>` });
    },
    ios(st) {
      const pub = st === "published" || st === "changed";
      const bad = st === "invalid";
      const body = (bad ? notice("error", "alert", "2 issues block publishing", "Close date is before the due date. Question 3 has no points.") : st === "changed" ? notice("info", "history", "Unpublished change", "Instructions edited. 18 submitted receipts won’t change.") : "") +
        group([ival("Title", "Problem Set 4"), ival("Due", "Fri, Oct 16 · 11:59 pm", { note: "Opens the native date picker sheet" }), ival("Close", bad ? "Thu, Oct 15" : "Sun, Oct 18", { err: bad, s: bad ? "Must be on or after the due date" : "", note: "Native date picker; validation returns here" }), ival("AI Use", "Limited")], { h: "Details" }) +
        group(D.questions.map((q) => ival(`Question ${q.id}`, bad && q.id === "3" ? "No points" : `${q.max} pts`, { err: bad && q.id === "3" })), { h: `Questions · ${bad ? "22" : "30"} of 30 points` }) +
        group([row("PS4 formula sheet.pdf", "Accessible text", { lead: ic("doc"), go: "P48:ready" }), row("Kinematics problem-solving", "Rubric · question 3", { lead: ic("table"), go: "P49:inuse" })], { h: "Files and Rubric" }) +
        group([row("Preview as Student", "", { lead: ic("eye"), go: "S05:open" })]);
      const bottom = st === "ready" ? btn("Review and Publish", { cls: "i-btn", go: "S15:published" }) : st === "changed" ? btn("Publish Change", { cls: "i-btn", go: "S15:published" }) : pub ? "" : btn("Publish", { cls: "i-btn", disabled: true, note: st === "draft" ? "Validate first" : "Fix 2 issues first" });
      const sh = st === "ready" ? sheet("Publish Problem Set 4?", "Students see it when Module 3 opens.", group([ival("Due", "Fri, Oct 16"), ival("Close", "Sun, Oct 18"), ival("Points", "30"), ival("Rubric", "Question 3")]) + '<div style="height:10px"></div>' + btn("Publish", { cls: "i-btn", go: "S15:published" })) : "";
      return iStaff({ back: ["PHYS 110", "S14:published"], title: "Edit Assignment", trail: st === "draft" ? btn("Validate", { cls: "i-iconbtn", go: "S15:invalid" }) : pub ? "" : "", body, bottom, sheet: sh });
    },
    notes: {
      draft: { web: "Form workspace with the validation and learner-preview rail beside it. Publish visible but unavailable until validated; Save draft keeps it staff-only.", ios: "Sectioned editor stack; Validate in the nav bar." },
      invalid: { web: "Field-level errors (close date, Q3 points) with messages tied by aria-describedby; the rail summary buttons move focus to each field. Total shows 22 of 30.", ios: "Error banner + affected rows in error text; date picker sheet returns to the field." },
      ready: { web: "All checks pass; Publish is primary with what students will see and when.", ios: "‘Review and Publish’ opens a summary sheet before publishing (shown)." },
      published: { web: "Published time; Unpublish is unavailable with a reason (submissions exist). Learner preview links to S05.", ios: "Same fields; publish button removed." },
      changed: { web: "Learner-impact card quantifies who is affected, states that receipts/submitted pages don’t change, and offers notify. Point changes after grading route to grading impact.", ios: "Info banner states the unpublished change and receipt guarantee; Publish Change in the bottom bar." },
    },
    a11y: ["Every field has a visible label; errors use aria-invalid + aria-describedby and appear beside the field.", "Validation summary buttons move focus to the field they describe (data-focus in the preview).", "Point inputs are text with numeric input mode, so ‘No points’ errors can be described."],
  });

  /* ============ S16 QUIZ BUILDER ============ */
  const Q = D2.quiz;
  const qOutline = (st, sel) => `<nav aria-label="Quiz questions"><ul class="w-outline">${Q.items.map((q) => {
    const bad = st === "invalid" && q.id === "Q3";
    return `<li>${link(`<span class="meta" style="width:22px">${q.id}</span><span class="grow">${esc(q.type)}<span class="meta" style="display:block">${esc(q.prompt.slice(0, 38))}…</span></span>${bad ? badge("attention", "Fix") : `<span class="meta">${q.pts} pt</span>`}`, { cls: "item", go: `S16:${st}`, note: "Selects this question" }).replace('class="item"', `class="item" style="padding-left:10px"${q.id === sel ? ' aria-current="true"' : ""}`)}</li>`;
  }).join("")}</ul><div style="margin-top:10px">${btn("Add question", { cls: "btn block", icon: "plus", note: "Multiple choice, numeric or written response" })}</div></nav>`;
  const itemEditor = (st, p) => {
    const bad = st === "invalid";
    const q = Q.items[bad ? 2 : 0];
    const opts = q.options.map((o, i) => {
      const empty = bad && i === 2;
      return `<li style="display:flex;gap:10px;align-items:center;padding:6px 0"><input type="radio" name="${p}-ans" id="${p}-o${i}"${i === q.answer ? " checked" : ""} aria-label="Mark option ${i + 1} correct"><div class="w-field${empty ? " invalid" : ""}" style="flex:1"><label for="${p}-t${i}" class="sr">Option ${i + 1} text</label><input id="${p}-t${i}" value="${empty ? "" : esc(o)}"${empty ? ` aria-invalid="true" aria-describedby="${p}-t${i}-e"` : ""}>${empty ? `<span class="err" id="${p}-t${i}-e">${ic("alert")}Option 3 needs text, or remove it.</span>` : ""}</div><button type="button" class="w-iconbtn" aria-label="Remove option ${i + 1}" data-note="Removes this option">${ic("trash")}</button></li>`;
    }).join("");
    return card(`${q.id} · ${q.type}`, `${st === "attempt" ? notice("info", "history", "Editing creates version 4", "27 submitted attempts keep version 3 — the question, their answer and timing. Your edit applies to new attempts only.") + '<div style="height:12px"></div>' : ""}<div class="w-form">${field({ id: `${p}-prompt`, label: "Prompt", type: "textarea", value: q.prompt, w: 2, req: true })}${field({ id: `${p}-type`, label: "Type", type: "select", value: q.type, options: ["Multiple choice", "Numeric", "Written response"] })}${field({ id: `${p}-pts`, label: "Points", value: bad ? "" : q.pts, err: bad ? "Enter points for this question." : "", inputmode: "numeric" })}</div>
<h3 style="font-size:14px;margin:14px 0 4px">Options <span class="meta">· select the correct answer</span></h3><ul>${opts}</ul>${btn("Add option", { cls: "btn plain", icon: "plus", note: "Adds an option" })}
${field({ id: `${p}-fb`, label: "Reference feedback (shown under the release rule)", type: "textarea", value: "Gravity acts throughout the flight, so vertical acceleration stays 9.8 m/s² downward.", rows: 2 })}`);
  };
  reg("S16", {
    states: [
      ["draft", "Draft", 0],
      ["invalid", "Invalid item", 1],
      ["ready", "Ready", 2],
      ["published", "Published", 3],
      ["attempt", "Attempt exists", 4],
    ],
    url: () => "app.whiteboard.example/teach/phys-110/quizzes/quiz-3/edit",
    web(st) {
      const pub = st === "published" || st === "attempt";
      const sel = st === "invalid" ? "Q3" : "Q1";
      const status = { draft: badge("staffDraft"), invalid: badge("attention", "1 question needs fixing"), ready: badge("ready"), published: badge("published", "Published · version 3"), attempt: badge("changed", "Unpublished edit · v4") }[st];
      const settings = card("Settings", `<dl class="facts"><dt>Opens</dt><dd>Mon, Oct 12 · 8:00 am ET</dd><dt>Closes</dt><dd>Mon, Oct 19 · 11:59 pm ET</dd><dt>Time limit</dt><dd>20 minutes</dd><dt>Attempts</dt><dd>2 · highest score counts</dd><dt>Results</dt><dd>Score and reference feedback after the close date</dd><dt>Total</dt><dd>${st === "invalid" ? "8 of 10 points" : "10 points · 4 questions"}</dd></dl><div style="margin-top:10px">${btn("Edit settings", { cls: "btn block", icon: "sliders", note: "Dates, time limit, attempts and release rule" })}</div>`);
      const actions = st === "ready" ? btn("Publish quiz", { cls: "btn primary block", icon: "publish", go: "S16:published", note: "Learners can attempt it in its window (S10)" }) :
        st === "attempt" ? btn("Publish version 4", { cls: "btn primary block", icon: "publish", go: "S16:published", note: "New attempts use v4; the 27 submitted attempts keep v3" }) :
        pub ? btn("Review results", { cls: "btn block", icon: "checklist", note: "Opens the quiz results review; learners see only their own attempt" }) + btn("Release results now", { cls: "btn block", disabled: true, describedby: "ws16-rel", note: "Release follows the captured rule: after Mon, Oct 19" }) + `<p class="meta" id="ws16-rel">Results release automatically after Mon, Oct 19, as set when published.</p><p class="meta" data-handoff="S10">Learners attempt the quiz and later see released results on their own quiz page (S10). ${link("See the learner’s quiz page", { go: "S10:available", note: "Design review link to S10 in Batch 03 — not a staff control" })}</p>` :
        btn("Publish quiz", { cls: "btn primary block", icon: "publish", disabled: true, describedby: "ws16-why", note: st === "draft" ? "Preview and validate first" : "Fix question 3 first" }) + `<p class="meta" id="ws16-why">${st === "draft" ? "Students can’t attempt a draft." : "Question 3 needs points and option text."}</p>`;
      const rail = `<div class="w-rail">${card(`Status ${status}`, (st === "invalid" ? checks([["err", "Q3: option 3 has no text"], ["err", "Q3: no points"], ["ok", "Q1, Q2, Q4 valid"]], "Validation") : st === "draft" ? checks([["todo", "Validation runs when you preview or publish"]], "Validation") : checks([["ok", "Every question has points and an answer"], ["ok", "Time limit and attempts set"], ["ok", "Release rule set"]], "Validation")) + `<div style="display:grid;gap:8px;margin-top:12px">${actions}${btn("Preview quiz", { cls: "btn block", icon: "eye", go: st === "draft" ? "S16:invalid" : null, note: st === "draft" ? "Design review: preview runs validation and finds Q3" : "Learner preview: timer runs but nothing is recorded" })}</div>`)}${settings}${pub ? card("Attempts", `<p><b>${st === "attempt" ? 27 : 27}</b> submitted · <b>3</b> in progress</p><p class="meta" style="margin-top:4px">Submitted attempts keep their question, answer and timing snapshot (version 3).</p>`) : ""}</div>`;
      return webStaff({ tool: "builder", crumbs: [...crumbsC, ["Quiz 3"]], url: this.url(st), body: webHead("Quiz 3: Projectile motion", "Module 3 · Projectile motion", btn("Back to course builder", { cls: "btn", go: "S14:published" })) + `<div class="w-grid edit3">${card("Questions", qOutline(st, sel))}<div style="min-width:0">${itemEditor(st, "ws16")}</div>${rail}</div>` });
    },
    ios(st) {
      const pub = st === "published" || st === "attempt";
      const bad = st === "invalid";
      const top = bad ? notice("error", "alert", "Question 3 needs fixing", "Add points and text for option 3.") : st === "attempt" ? notice("info", "history", "27 attempts keep version 3", "Your edit to Q1 will apply to new attempts only.") : "";
      const sh = st === "ready" ? sheet("Quiz Settings", "Review before publishing", group([ival("Opens", "Mon, Oct 12"), ival("Closes", "Mon, Oct 19"), ival("Time Limit", "20 min"), ival("Attempts", "2"), ival("Results", "After close")]) + '<div style="height:10px"></div>' + btn("Publish Quiz", { cls: "i-btn", go: "S16:published" }), "Done") : "";
      return iStaff({ back: ["PHYS 110", "S14:published"], title: "Quiz 3", trail: btn("Settings", { cls: "i-iconbtn", note: "Opens the quiz settings sheet", go: st === "ready" ? null : null }), body: top + group(Q.items.map((q) => row(`${q.id} · ${q.type}`, bad && q.id === "Q3" ? "No points · option 3 empty" : `${q.pts} points`, { go: bad && q.id === "Q3" ? "S16:invalid" : null, note: "Pushes the item editor; options and reorder use dedicated screens", trail: bad && q.id === "Q3" ? badge("attention", "Fix") : "" })), { h: `Questions · ${bad ? 8 : 10} points` }) + group([row("Add Question", "", { lead: ic("plus"), note: "Choose type, then the item editor opens" }), row("Preview Quiz", "", { lead: ic("eye"), note: "Learner preview; nothing is recorded" })]) + (pub ? group([ival("Submitted", "27"), ival("In progress", "3")], { h: "Attempts", foot: "Submitted attempts keep their question, answer and timing snapshot." }) : ""), bottom: st === "ready" ? btn("Publish Quiz", { cls: "i-btn", go: "S16:published" }) : st === "attempt" ? btn("Publish Version 4", { cls: "i-btn", go: "S16:published" }) : pub ? "" : btn("Publish Quiz", { cls: "i-btn", disabled: true, note: bad ? "Fix question 3 first" : "Preview to validate first" }), sheet: sh });
    },
    notes: {
      draft: { web: "Item outline, selected-item editor, settings rail. Draft can’t be attempted; publish explains why it’s unavailable.", ios: "Question list; each pushes an item editor; settings sheet from the nav bar." },
      invalid: { web: "The broken item is flagged in the outline; the editor shows field errors (empty option, missing points); rail summarises and the total shows 8 of 10.", ios: "Error banner plus the flagged row." },
      ready: { web: "Validation passes; Publish is primary; settings summarise the release rule that will be captured.", ios: "Settings sheet summarises before Publish (shown)." },
      published: { web: "Version number shown; results release follows the captured rule — ‘Release now’ unavailable with reason. ‘Review results’ is the S10→S16 instructor handoff.", ios: "Attempt counts group; no learner data beyond counts here." },
      attempt: { web: "Editing a published quiz with attempts creates a new version; the notice states that submitted attempts keep their snapshot and the edit affects new attempts only.", ios: "Same guarantee in the banner; Publish Version 4." },
    },
    a11y: ["Correct-answer radios are labelled per option; options have hidden-but-present labels.", "Outline marks the selected question with aria-current.", "Version and attempt guarantees are text, not icon-only."],
  });
})();
